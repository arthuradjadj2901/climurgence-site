const { Redis } = require("@upstash/redis");
const { default: OpenAI } = require("openai");
const twilio = require("twilio");

const TWILIO_FROM = "whatsapp:+14155238886";
const MY_WHATSAPP = "whatsapp:+33643721850";
const KV_LAST_DEVIS_KEY = "last_devis";

const SYSTEM_PROMPT = `Tu es l'assistant de devis de ClimUrgence, entreprise de dépannage climatisation à Marseille. Tu reçois une demande client et tu génères un devis structuré.

Catalogue des prestations (prix TTC, TVA 20% incluse) :

[DÉPANNAGE URGENCE]
- Climatiseur ne refroidit plus (DEP-001) : 149€ TTC
- Fuite d'eau / condensats (DEP-002) : 119€ TTC
- Code erreur E1, E3, F3 (DEP-003) : 139€ TTC
- Climatiseur ne démarre plus (DEP-004) : 119€ TTC
- Fuite gaz réfrigérant + recharge jusqu'à 300g inclus (DEP-005) : 199€ TTC
- Bruit anormal / vibrations (DEP-006) : 129€ TTC

[DIAGNOSTIC]
- Diagnostic panne sans réparation (DIAG-001) : 79€ TTC (déductible du montant total si réparation acceptée dans la même intervention)

[REMPLACEMENT PIÈCES]
- Remplacement carte électronique (DEP-007) : 150€ TTC main d'œuvre + pièce sur devis après identification du modèle exact
- Remplacement télécommande (DEP-008) : 79€ TTC (télécommande universelle incluse)

[ENTRETIEN ANNUEL]
- Entretien monosplit 1 unité (ENT-001) : 119€ TTC
- Entretien bisplit 2 unités (ENT-002) : 159€ TTC
- Entretien multisplit 3 à 5 unités (ENT-003) : 199€ TTC
- Entretien pompe à chaleur air/air (ENT-004) : 199€ TTC
- Entretien VMC simple flux (ENT-005) : 119€ TTC
- Entretien VMC double flux (ENT-006) : 199€ TTC

[NETTOYAGE PROFESSIONNEL]
- Nettoyage Jet HP unité intérieure (NET-001) : 149€ TTC
- Nettoyage Jet HP unité extérieure (NET-002) : 79€ TTC
- Pack combiné entretien + Jet HP intérieur (NET-003) : 249€ TTC au lieu de 268€

[INSTALLATION]
- Pose monosplit appareil fourni par client (INST-001) : 699€ TTC
- Pack complet fourniture + pose 2,5 kW jusqu'à 20 m² (INST-002) : 1 249€ TTC
- Pack complet fourniture + pose 3,5 kW 20 à 30 m² (INST-003) : 1 449€ TTC
- Pack complet fourniture + pose 5 kW 30 à 45 m² (INST-004) : 1 749€ TTC
- Pack complet fourniture + pose 7 kW 45 à 70 m² (INST-005) : 2 149€ TTC
- Dépose ancien climatiseur combinée avec nouvelle pose (INST-006) : 149€ TTC
- Liaison frigorifique supplémentaire au-delà des 5m inclus (INST-007) : 12€ TTC par mètre

[CONTRATS MAINTENANCE]
- Formule Essentiel (CTRT-001) : 25€ TTC/mois ou 300€ TTC/an — 1 visite annuelle de maintenance préventive + 15% de réduction sur tous les dépannages
- Formule Premium (CTRT-002) : 40€ TTC/mois ou 480€ TTC/an — 2 visites annuelles préventives (printemps + automne) + intervention garantie sous 4h en heures ouvrées + 20% de réduction sur pièces et dépannages

Règles : déplacement offert partout sur Bouches-du-Rhône (13) et Var (83), aucune majoration soir/week-end/jours fériés, TVA 20% incluse dans tous les prix affichés, ne jamais déduire automatiquement le diagnostic de la facture finale (la déduction est appliquée manuellement si la réparation est acceptée dans la même intervention).

Réponds UNIQUEMENT en JSON valide sans markdown :
{"client_nom":"nom","probleme":"résumé","lignes_whatsapp":"• Prestation (REF) — prix€ TTC\\n• Prestation (REF) — prix€ TTC","lignes_html":"<tr><td>Prestation</td><td>REF</td><td class=prix>prix€ TTC</td></tr>","total_ttc":"total€ TTC","conditions":"conditions","note_technicien":"note"}`;

function buildWhatsAppMessage(devisData, { telephone, email, codepostal, message }) {
  const msgClient = (message || "").trim() || "Aucun message";
  return `Nouvelle demande ClimUrgence
📍 Prestation : ${devisData.probleme}
👤 Nom : ${devisData.client_nom}
📞 Téléphone : ${telephone || "Non renseigné"}
📧 Email : ${email || "Non renseigné"}
📮 Code postal : ${codepostal || "Non renseigné"}
💬 Message : ${msgClient}

─────────────────
DEVIS GÉNÉRÉ
${devisData.lignes_whatsapp}

TOTAL TTC : ${devisData.total_ttc}
DÉPLACEMENT : Offert
CONDITIONS : ${devisData.conditions}
NOTE TECHNICIEN : ${devisData.note_technicien}

✅ Réponds OK pour générer le PDF
✏️ Réponds MODIF + tes corrections pour modifier
💬 Réponds DEVIS + description pour un nouveau devis`;
}

module.exports = async function handler(req, res) {
  // CORS preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { nom, telephone, codepostal, email, probleme, message } = req.body || {};

    if (!nom || !probleme) {
      return res.status(400).json({ error: "Champs nom et probleme requis" });
    }

    console.log(`[devis] Nouvelle demande de ${nom} (${codepostal})`);

    // ── Upstash Redis ─────────────────────────────────────────────────────────
    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });

    // ── OpenAI ────────────────────────────────────────────────────────────────
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const userMessage = `Client: ${nom}
Téléphone: ${telephone || "Non renseigné"}
Code postal: ${codepostal || "Non renseigné"}
Email: ${email || "Non renseigné"}
Problème: ${probleme}
Message complémentaire: ${message || "Aucun"}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const openaiResponse = completion.choices[0].message.content;
    const devisData = JSON.parse(openaiResponse);

    // ── Numéro de devis ───────────────────────────────────────────────────────
    const counter = await redis.incr("devis_counter");
    const year = new Date().getFullYear();
    const devisNumero = `${year}-${String(counter).padStart(3, "0")}`;
    const dateDevis = new Date().toLocaleDateString("fr-FR");

    // ── Sauvegarde Redis ──────────────────────────────────────────────────────
    const fullRecord = {
      devis_numero: devisNumero,
      date_devis: dateDevis,
      client_nom: devisData.client_nom || nom,
      client_telephone: telephone || "",
      client_codepostal: codepostal || "",
      client_email: email || "",
      probleme: devisData.probleme,
      lignes_whatsapp: devisData.lignes_whatsapp,
      lignes_html: devisData.lignes_html,
      total_ttc: devisData.total_ttc,
      conditions: devisData.conditions,
      note_technicien: devisData.note_technicien,
      raw_input: { nom, telephone, codepostal, email, probleme, message },
      openai_messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
        { role: "assistant", content: openaiResponse },
      ],
      created_at: new Date().toISOString(),
    };

    // Sauvegarde parallèle : historique (90 jours) + dernier devis actif (7 jours)
    await Promise.all([
      redis.set(`devis:${devisNumero}`, JSON.stringify(fullRecord), { ex: 60 * 60 * 24 * 90 }),
      redis.set(KV_LAST_DEVIS_KEY, JSON.stringify(fullRecord), { ex: 60 * 60 * 24 * 7 }),
    ]);

    // ── Envoi WhatsApp Twilio ─────────────────────────────────────────────────
    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    await twilioClient.messages.create({
      from: TWILIO_FROM,
      to: MY_WHATSAPP,
      body: buildWhatsAppMessage(devisData, { telephone, email, codepostal, message }),
    });

    console.log(`[devis] Devis ${devisNumero} créé et envoyé sur WhatsApp`);

    return res.status(200).json({
      success: true,
      devis_numero: devisNumero,
    });

  } catch (err) {
    console.error("[devis] Erreur:", err);
    return res.status(500).json({ error: "Erreur interne", detail: err.message });
  }
};
