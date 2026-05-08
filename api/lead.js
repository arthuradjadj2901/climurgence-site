// ════════════════════════════════════════════════════════════════════
// /api/lead — Route unique de réception des leads du site
// ════════════════════════════════════════════════════════════════════
//
// Reçoit les soumissions de TOUS les formulaires du site (form home,
// form contact, modal tarifs) et envoie un email récap propre vers
// LEAD_EMAIL_TO via Resend, avec un bouton "Créer la fiche client"
// qui pointe vers le CRM avec les champs pré-remplis en query params.
//
// ── Body attendu (JSON) ──
// {
//   type:      "contact" | "tarif" | string,  // type brut envoyé par le form
//   sujet?:    string,                         // sujet précis (label prestation pour le modal tarifs)
//   nom:       string,                         // requis
//   prenom?:   string,
//   telephone?:string,                         // au moins l'un de telephone OU email requis
//   email?:    string,
//   codepostal?:string,
//   ville?:    string,
//   probleme?: string,                         // value du <select> côté forms home/contact
//   message?:  string,
//   page_origine?: string,                     // window.location.pathname
//   website?:  string                          // honeypot — doit être vide
// }
//
// ── Réponses ──
//   200 { ok: true }     succès (ou bot piégé silencieux)
//   400 { ok: false, error: "..." }   validation échouée
//   405 { ok: false, error: "Method not allowed" }
//   429 { ok: false, error: "Trop de demandes" }   rate limit dépassé
//   500 { ok: false, error: "..." }   erreur interne (Resend, etc.)
// ════════════════════════════════════════════════════════════════════

const { Redis } = require("@upstash/redis");
const { Resend } = require("resend");

// ── Config ──────────────────────────────────────────────────────────
const FROM_ADDRESS = "Site Clim Urgence <noreply@climurgence.com>";
const FALLBACK_TO  = "contact@climurgence.com";
const CRM_BASE_URL = "https://crm.climurgence.com/clients/nouveau";
const RATE_LIMIT_MAX     = 5;       // 5 leads max
const RATE_LIMIT_WINDOW  = 60 * 10; // par fenêtre de 10 min
const RATE_LIMIT_PREFIX  = "lead_rl:";

// ── Mapping type → label + couleur (sujet + bandeau du mail) ────────
const TYPE_DEFS = {
  urgence:   { label: "URGENCE",   color: "#dc2626", labelLong: "Urgence dépannage" },
  install:   { label: "INSTALL",   color: "#ea580c", labelLong: "Demande d'installation" },
  entretien: { label: "ENTRETIEN", color: "#2563eb", labelLong: "Demande d'entretien" },
  contrat:   { label: "CONTRAT",   color: "#9333ea", labelLong: "Demande contrat / abonnement" },
  contact:   { label: "CONTACT",   color: "#6b7280", labelLong: "Demande de contact" },
};

// ── Dérive le type d'affichage à partir des données du formulaire ───
// Priorité : `probleme` (forms home/contact) > `sujet` (modal tarifs) > `type` brut.
function deriveDisplayType({ type, probleme, sujet }) {
  const haystack = [probleme, sujet, type].filter(Boolean).join(" ").toLowerCase();

  if (/panne-totale|ne-refroidit|code-erreur|fuite|bruit|d[ée]pannage|urgence/.test(haystack)) return "urgence";
  if (/installation|remplacement|pose monosplit|fourniture \+ pose|d[ée]pose/.test(haystack))  return "install";
  if (/entretien|nettoyage|jet hp|vmc/.test(haystack))                                          return "entretien";
  if (/abonnement|contrat|formule (essentiel|premium)/.test(haystack))                          return "contrat";
  return "contact";
}

// ── Mapping `probleme` (value du <select>) → libellé lisible ────────
const PROBLEME_LABELS = {
  "panne-totale":      "Panne totale — clim ne démarre plus",
  "ne-refroidit-plus": "Clim ne refroidit plus",
  "code-erreur":       "Code erreur affiché (E1, E3, F3…)",
  "fuite":             "Fuite eau / gaz réfrigérant",
  "bruit":             "Bruit anormal",
  "entretien-annuel":  "Entretien annuel obligatoire",
  "nettoyage":         "Nettoyage filtres uniquement",
  "installation-neuve":"Installation neuve",
  "remplacement":      "Remplacement ancien système",
  "abonnement":        "Abonnement maintenance",
};

function readableSujet({ sujet, probleme, message }) {
  if (sujet && sujet.trim()) return sujet.trim();
  if (probleme && PROBLEME_LABELS[probleme]) return PROBLEME_LABELS[probleme];
  if (probleme && probleme.trim()) return probleme.trim();
  if (message && message.trim()) {
    const m = message.trim();
    return m.length > 60 ? m.slice(0, 60) + "…" : m;
  }
  return "Demande sans sujet précis";
}

// ── Sépare nom complet en prénom + nom (best effort, optionnel) ─────
function splitFullName(full) {
  if (!full) return { prenom: "", nom: "" };
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { prenom: "", nom: parts[0] };
  return { prenom: parts[0], nom: parts.slice(1).join(" ") };
}

// ── Construit l'URL CRM avec query params encodés ───────────────────
function buildCrmUrl({ nom, prenom, telephone, email, codepostal, ville, displayType }) {
  const params = new URLSearchParams();
  if (prenom)     params.set("prenom", prenom);
  if (nom)        params.set("nom", nom);
  if (telephone)  params.set("telephone", telephone);
  if (email)      params.set("email", email);
  if (codepostal) params.set("codepostal", codepostal);
  if (ville)      params.set("ville", ville);
  params.set("source", `site_${displayType}`);
  return `${CRM_BASE_URL}?${params.toString()}`;
}

// ── Échappement HTML ────────────────────────────────────────────────
function esc(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ── Détection User-Agent simplifiée ─────────────────────────────────
function shortUserAgent(ua) {
  if (!ua) return "Inconnu";
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);
  let browser = "Navigateur inconnu";
  if (/Edg\//.test(ua))         browser = "Edge";
  else if (/Chrome\//.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua))browser = "Firefox";
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) browser = "Safari";
  return `${isMobile ? "Mobile" : "Desktop"} (${browser})`;
}

// ── Tronque l'IP (RGPD : ne pas conserver l'IP en clair) ────────────
function truncateIp(ip) {
  if (!ip) return "";
  // IPv4 : 192.168.1.42 → 192.168.x.x
  if (/^(\d+\.\d+)\.\d+\.\d+$/.test(ip)) return ip.replace(/\.\d+\.\d+$/, ".x.x");
  // IPv6 : ne garder que les 2 premiers groupes
  if (ip.includes(":")) return ip.split(":").slice(0, 2).join(":") + ":xxxx";
  return ip;
}

// ── Timestamp Europe/Paris formaté FR ───────────────────────────────
function nowParisFr() {
  return new Date().toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Construction du sujet : [TYPE CP] Sujet — Nom ───────────────────
function buildSubject({ displayType, sujet, codepostal, nom }) {
  const def = TYPE_DEFS[displayType] || TYPE_DEFS.contact;
  const cp  = codepostal ? ` ${codepostal}` : "";
  const sujetClean = (sujet || "—").length > 70 ? sujet.slice(0, 70) + "…" : (sujet || "—");
  const nomClean   = nom || "Anonyme";
  return `[${def.label}${cp}] ${sujetClean} — ${nomClean}`;
}

// ── Construction du body HTML ───────────────────────────────────────
function buildHtmlBody({
  displayType, sujet, nom, prenom, telephone, email, codepostal, ville,
  probleme, message, pageOrigine, ip, userAgent, crmUrl,
}) {
  const def = TYPE_DEFS[displayType] || TYPE_DEFS.contact;
  const sujetReadable = readableSujet({ sujet, probleme });

  // Lignes coordonnées (skip vides)
  const coords = [];
  const fullName = [prenom, nom].filter(Boolean).join(" ");
  if (fullName) coords.push(`<tr><td style="padding:4px 0;color:#6b7280;width:24px;">👤</td><td style="padding:4px 0;font-size:16px;font-weight:600;">${esc(fullName)}</td></tr>`);
  if (telephone) coords.push(`<tr><td style="padding:4px 0;">📞</td><td style="padding:4px 0;font-size:16px;"><a href="tel:${esc(telephone.replace(/\s/g,""))}" style="color:#1f2937;text-decoration:none;font-weight:600;">${esc(telephone)}</a></td></tr>`);
  if (email) coords.push(`<tr><td style="padding:4px 0;">✉️</td><td style="padding:4px 0;font-size:16px;"><a href="mailto:${esc(email)}" style="color:#1f2937;text-decoration:none;font-weight:600;">${esc(email)}</a></td></tr>`);
  const lieu = [codepostal, ville].filter(Boolean).join(" ");
  if (lieu) coords.push(`<tr><td style="padding:4px 0;">📮</td><td style="padding:4px 0;font-size:16px;">${esc(lieu)}</td></tr>`);

  // Section demande
  const messageHtml = message && message.trim()
    ? `<p style="margin:8px 0 0;padding:12px;background:#f9fafb;border-left:3px solid ${def.color};border-radius:4px;color:#374151;font-style:italic;white-space:pre-wrap;">${esc(message)}</p>`
    : `<p style="margin:8px 0 0;color:#9ca3af;font-style:italic;">Aucun message libre.</p>`;

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Nouveau lead</title></head>
<body style="margin:0;padding:24px;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1f2937;line-height:1.5;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

    <div style="background:${def.color};color:#ffffff;padding:18px 24px;">
      <div style="font-size:12px;letter-spacing:1.5px;font-weight:600;opacity:0.85;">${def.label}</div>
      <div style="font-size:20px;font-weight:700;margin-top:4px;">${esc(sujetReadable)}</div>
    </div>

    <div style="padding:24px;">
      <a href="${esc(crmUrl)}"
         style="display:block;background:#ea580c;color:#ffffff;text-decoration:none;text-align:center;padding:16px 24px;border-radius:8px;font-weight:700;font-size:16px;margin-bottom:24px;">
        📋 Créer la fiche client dans le CRM
      </a>

      <div style="font-size:11px;letter-spacing:1.2px;color:#9ca3af;font-weight:600;margin-bottom:8px;">COORDONNÉES</div>
      <table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        ${coords.join("\n        ") || '<tr><td style="color:#9ca3af;font-style:italic;">Aucune coordonnée renseignée.</td></tr>'}
      </table>

      <div style="font-size:11px;letter-spacing:1.2px;color:#9ca3af;font-weight:600;margin-bottom:8px;">DEMANDE</div>
      <p style="margin:0 0 4px;color:#1f2937;"><strong>Sujet :</strong> ${esc(sujetReadable)}</p>
      ${messageHtml}

      <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;line-height:1.7;">
        <div style="font-size:10px;letter-spacing:1.2px;font-weight:600;margin-bottom:6px;">MÉTADONNÉES</div>
        <div><strong>Page :</strong> ${esc(pageOrigine || "—")}</div>
        <div><strong>Date :</strong> ${esc(nowParisFr())} (heure de Paris)</div>
        <div><strong>IP :</strong> ${esc(truncateIp(ip))} · ${esc(shortUserAgent(userAgent))}</div>
      </div>
    </div>

    <div style="background:#f9fafb;padding:12px 24px;font-size:11px;color:#9ca3af;text-align:center;">
      Email envoyé automatiquement par climurgence.com — répondre à ce mail recontacte directement le prospect (si email fourni).
    </div>
  </div>
</body>
</html>`;
}

// ── Version texte fallback (multipart) ──────────────────────────────
function buildTextBody({
  displayType, sujet, nom, prenom, telephone, email, codepostal, ville,
  probleme, message, pageOrigine, ip, userAgent, crmUrl,
}) {
  const def = TYPE_DEFS[displayType] || TYPE_DEFS.contact;
  const sujetReadable = readableSujet({ sujet, probleme });
  const fullName = [prenom, nom].filter(Boolean).join(" ");
  const lieu = [codepostal, ville].filter(Boolean).join(" ");

  const lines = [];
  lines.push(`[${def.label}] ${sujetReadable}`);
  lines.push("");
  lines.push("CRÉER LA FICHE CLIENT DANS LE CRM :");
  lines.push(crmUrl);
  lines.push("");
  lines.push("─── COORDONNÉES ───");
  if (fullName)  lines.push(`Nom       : ${fullName}`);
  if (telephone) lines.push(`Téléphone : ${telephone}`);
  if (email)     lines.push(`Email     : ${email}`);
  if (lieu)      lines.push(`Adresse   : ${lieu}`);
  lines.push("");
  lines.push("─── DEMANDE ───");
  lines.push(`Sujet : ${sujetReadable}`);
  if (message) {
    lines.push("");
    lines.push("Message :");
    lines.push(message);
  }
  lines.push("");
  lines.push("─── MÉTADONNÉES ───");
  lines.push(`Page  : ${pageOrigine || "—"}`);
  lines.push(`Date  : ${nowParisFr()} (heure de Paris)`);
  lines.push(`IP    : ${truncateIp(ip)} · ${shortUserAgent(userAgent)}`);
  return lines.join("\n");
}

// ── Récupération de l'IP client (Vercel passe x-forwarded-for) ──────
function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (xff) return String(xff).split(",")[0].trim();
  return req.headers["x-real-ip"] || req.socket?.remoteAddress || "";
}

// ── Initialisation Redis (rate limit) — supporte les deux nommages ──
function initRedis() {
  const url   = process.env.UPSTASH_REDIS_REST_URL   || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

// ── Rate limit : 5 leads / 10 min / IP ──────────────────────────────
async function checkRateLimit(redis, ip) {
  if (!redis || !ip) return { ok: true }; // pas de Redis = pas de rate limit (mode dégradé)
  const key = RATE_LIMIT_PREFIX + ip;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, RATE_LIMIT_WINDOW);
  if (count > RATE_LIMIT_MAX) return { ok: false, count };
  return { ok: true, count };
}

// ════════════════════════════════════════════════════════════════════
// Handler
// ════════════════════════════════════════════════════════════════════
module.exports = async function handler(req, res) {
  // CORS basique (le site et l'API sont sur le même domaine, donc ouvert)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const body = req.body || {};

    // ── 1. Honeypot — bot piégé : on log et on renvoie 200 silencieux
    if (body.website && String(body.website).trim() !== "") {
      console.log("[lead] Honeypot déclenché — bot piégé, email non envoyé");
      return res.status(200).json({ ok: true });
    }

    // ── 2. Validation : nom requis + (telephone OU email) requis
    const nomRaw = (body.nom || "").trim();
    const tel    = (body.telephone || "").trim();
    const email  = (body.email || "").trim();
    if (!nomRaw) {
      return res.status(400).json({ ok: false, error: "Le nom est requis." });
    }
    if (!tel && !email) {
      return res.status(400).json({ ok: false, error: "Au moins un téléphone OU un email est requis." });
    }

    // ── 3. Rate limit
    const ip = getClientIp(req);
    const redis = initRedis();
    const rl = await checkRateLimit(redis, ip);
    if (!rl.ok) {
      console.warn(`[lead] Rate limit dépassé pour IP ${truncateIp(ip)} (${rl.count} tentatives)`);
      return res.status(429).json({ ok: false, error: "Trop de demandes en peu de temps. Merci de réessayer dans quelques minutes ou de nous appeler au 06 43 72 18 50." });
    }

    // ── 4. Préparation des données
    const { prenom: prenomSplit, nom: nomSplit } = splitFullName(nomRaw);
    const prenom = (body.prenom || prenomSplit || "").trim();
    const nom    = nomSplit || nomRaw;

    const codepostal = (body.codepostal || "").trim();
    const ville      = (body.ville || "").trim();
    const probleme   = (body.probleme || "").trim();
    const sujet      = (body.sujet || "").trim();
    const message    = (body.message || "").trim();
    const pageOrigine= (body.page_origine || "").trim();
    const userAgent  = req.headers["user-agent"] || "";

    const displayType = deriveDisplayType({
      type: body.type, probleme, sujet,
    });

    const crmUrl = buildCrmUrl({
      nom, prenom, telephone: tel, email, codepostal, ville, displayType,
    });

    const subject = buildSubject({
      displayType,
      sujet: readableSujet({ sujet, probleme, message }),
      codepostal, nom: [prenom, nom].filter(Boolean).join(" "),
    });

    const html = buildHtmlBody({
      displayType, sujet, nom, prenom, telephone: tel, email,
      codepostal, ville, probleme, message, pageOrigine,
      ip, userAgent, crmUrl,
    });

    const text = buildTextBody({
      displayType, sujet, nom, prenom, telephone: tel, email,
      codepostal, ville, probleme, message, pageOrigine,
      ip, userAgent, crmUrl,
    });

    const to = process.env.LEAD_EMAIL_TO || FALLBACK_TO;
    const replyTo = email || undefined;

    // ── 5. Mode dry-run : log au lieu d'envoyer
    if (process.env.LEAD_EMAIL_DRY_RUN === "1") {
      console.log("──────── [lead] DRY-RUN — email non envoyé ────────");
      console.log("From    :", FROM_ADDRESS);
      console.log("To      :", to);
      console.log("Reply-To:", replyTo || "(aucun)");
      console.log("Subject :", subject);
      console.log("--- TEXT ---");
      console.log(text);
      console.log("--- END ---");
      return res.status(200).json({ ok: true, dryRun: true });
    }

    // ── 6. Envoi via Resend
    const apiKey = process.env.RESEND_API_KEY_SITE;
    if (!apiKey) {
      console.error("[lead] RESEND_API_KEY_SITE manquante");
      return res.status(500).json({ ok: false, error: "Configuration serveur incomplète." });
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
      text,
      replyTo,
    });

    if (error) {
      console.error("[lead] Erreur Resend :", error);
      return res.status(500).json({ ok: false, error: "Impossible d'envoyer l'email pour le moment." });
    }

    // ── 7. Log non-PII pour suivi
    console.log(`[lead] Envoyé id=${data?.id} type=${displayType} cp=${codepostal || "-"} page=${pageOrigine || "-"}`);
    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error("[lead] Erreur interne :", err);
    return res.status(500).json({ ok: false, error: "Erreur interne." });
  }
};
