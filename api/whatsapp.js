const { Redis } = require("@upstash/redis");
const { default: OpenAI } = require("openai");
const twilio = require("twilio");
const querystring = require("querystring");

const TWILIO_FROM = "whatsapp:+14155238886";
const MY_WHATSAPP = "whatsapp:+33643721850";
const KV_LAST_DEVIS_KEY = "last_devis";

const SYSTEM_PROMPT = `Tu es l'assistant de devis de ClimUrgence, entreprise de dépannage climatisation à Marseille. Tu reçois une demande client et tu génères un devis structuré.

Catalogue des prestations :
- Diagnostic panne (DIAG-001) : 79€ TTC
- Dépannage remise en froid monosplit (DEP-001) : 149€ TTC — bisplit 199€ — trisplit 249€
- Dépannage fuite d'eau condensats (DEP-002) : 119€ TTC
- Dépannage code erreur électronique (DEP-003) : 139€ TTC
- Dépannage panne totale (DEP-004) : 119€ TTC
- Dépannage fuite gaz + recharge 300g (DEP-005) : 199€ TTC
- Dépannage bruit anormal (DEP-006) : 129€ TTC
- Remplacement carte électronique (DEP-007) : 150€ MO + pièce 80-350€
- Remplacement télécommande (DEP-008) : 79€ TTC
- Entretien annuel monosplit (ENT-001) : 139€ TTC
- Entretien annuel bisplit (ENT-002) : 199€ TTC
- Entretien annuel trisplit (ENT-003) : 249€ TTC
- Nettoyage Jet HP intérieur (NET-001) : 149€ TTC
- Nettoyage Jet HP extérieur (NET-002) : 79€ TTC
- Pose seule monosplit (INST-001) : 499€ TTC
- Fourniture + pose 2.5kW (INST-002) : 1099€ TTC
- Fourniture + pose 3.5kW (INST-002) : 1299€ TTC
- Fourniture + pose 5kW (INST-002) : 1599€ TTC
- Dépose ancienne unité (INST-003) : 149€ TTC

Règles : déplacement offert, aucune majoration soir/week-end, TVA 20%, ne jamais déduire automatiquement le diagnostic.

Réponds UNIQUEMENT en JSON valide sans markdown :
{"client_nom":"nom","probleme":"résumé","lignes_whatsapp":"• Prestation (REF) — prix€ TTC\\n• Prestation (REF) — prix€ TTC","lignes_html":"<tr><td>Prestation</td><td>REF</td><td class=prix>prix€ TTC</td></tr>","total_ttc":"total€ TTC","conditions":"conditions","note_technicien":"note"}`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function sendTwiml(res) {
  res.setHeader("Content-Type", "text/xml");
  res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
}

async function parseBody(req) {
  // Vercel parse automatiquement application/x-www-form-urlencoded → req.body
  if (req.body && typeof req.body === "object" && Object.keys(req.body).length > 0) {
    return req.body;
  }
  // Fallback : lecture manuelle du stream
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk.toString()));
    req.on("end", () => {
      try { resolve(querystring.parse(data)); } catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}

function buildModifiedDevisMessage(devisData, codepostal) {
  return `🔧 DEVIS MODIFIÉ — ${devisData.client_nom} (${codepostal || ""})

PROBLÈME : ${devisData.probleme}

LIGNES DE DEVIS :
${devisData.lignes_whatsapp}

TOTAL : ${devisData.total_ttc}
DÉPLACEMENT : Offert
CONDITIONS : ${devisData.conditions}
NOTE TECHNICIEN : ${devisData.note_technicien}

✅ Réponds OK pour générer le PDF
✏️ Réponds MODIF + tes corrections pour modifier
💬 Réponds DEVIS + description pour un nouveau devis`;
}

// ── PDFMonkey ─────────────────────────────────────────────────────────────────

async function generatePdf(record) {
  const templateId = process.env.PDFMONKEY_TEMPLATE_ID;
  const apiKey = process.env.PDFMONKEY_API_KEY;

  if (!templateId || !apiKey) throw new Error("PDFMONKEY_TEMPLATE_ID ou PDFMONKEY_API_KEY manquant");

  const payload = {
    devis_numero: record.devis_numero,
    client_nom: record.client_nom,
    client_telephone: record.client_telephone,
    client_codepostal: record.client_codepostal,
    date_devis: record.date_devis,
    probleme: record.probleme,
    lignes_devis: record.lignes_html,
    total_ttc: record.total_ttc,
    conditions: record.conditions,
    note_technicien: record.note_technicien,
  };

  const createRes = await fetch("https://api.pdfmonkey.io/api/v1/documents", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      document: {
        document_template_id: templateId,
        status: "pending",
        payload,
        meta: { _filename: `devis-${record.devis_numero}.pdf` },
      },
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`PDFMonkey create failed ${createRes.status}: ${errText}`);
  }

  const { document } = await createRes.json();
  const docId = document.id;
  console.log(`[whatsapp] PDF PDFMonkey lancé, ID=${docId}`);

  // Polling : max 25 × 2s = 50 secondes
  for (let i = 0; i < 25; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const pollRes = await fetch(`https://api.pdfmonkey.io/api/v1/documents/${docId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!pollRes.ok) continue;
    const { document: doc } = await pollRes.json();
    if (doc.status === "success" && doc.download_url) return doc.download_url;
    if (doc.status === "error") throw new Error(`PDFMonkey error: ${JSON.stringify(doc.errors)}`);
  }

  throw new Error("PDFMonkey timeout: PDF non prêt après 50s");
}

// ── Commande OK ───────────────────────────────────────────────────────────────

async function handleOk(redis, twilioClient) {
  console.log("[handleOk] Récupération du dernier devis depuis Redis…");
  const raw = await redis.get(KV_LAST_DEVIS_KEY);
  const lastDevis = typeof raw === "string" ? JSON.parse(raw) : raw;

  if (!lastDevis) {
    console.warn("[handleOk] Aucun devis en cours dans Redis");
    await twilioClient.messages.create({
      from: TWILIO_FROM, to: MY_WHATSAPP,
      body: "❌ Aucun devis en cours. Soumets d'abord une demande via le formulaire du site.",
    });
    return;
  }

  console.log(`[handleOk] Devis trouvé: ${lastDevis.devis_numero} — ${lastDevis.client_nom}`);

  try {
    const msg1 = await twilioClient.messages.create({
      from: TWILIO_FROM, to: MY_WHATSAPP,
      body: `⏳ Génération du PDF pour le devis ${lastDevis.devis_numero}…`,
    });
    console.log(`[handleOk] Message WhatsApp envoyé: SID=${msg1.sid} status=${msg1.status}`);

    const downloadUrl = await generatePdf(lastDevis);
    console.log(`[handleOk] PDF prêt: ${downloadUrl}`);

    const msg2 = await twilioClient.messages.create({
      from: TWILIO_FROM, to: MY_WHATSAPP,
      body: `✅ PDF prêt — devis ${lastDevis.devis_numero}\n\n📄 ${downloadUrl}\n\nClient : ${lastDevis.client_nom}\nTotal : ${lastDevis.total_ttc}`,
    });
    console.log(`[handleOk] PDF envoyé: SID=${msg2.sid} status=${msg2.status}`);

  } catch (err) {
    console.error("[handleOk] Erreur:", err.message, err.stack);
    try {
      await twilioClient.messages.create({
        from: TWILIO_FROM, to: MY_WHATSAPP,
        body: `❌ Erreur PDF : ${err.message}`,
      });
    } catch (sendErr) {
      console.error("[handleOk] Impossible d'envoyer le message d'erreur:", sendErr.message);
    }
  }
}

// ── Commande MODIF ────────────────────────────────────────────────────────────

async function handleModif(modifText, redis, twilioClient) {
  const raw = await redis.get(KV_LAST_DEVIS_KEY);
  const lastDevis = typeof raw === "string" ? JSON.parse(raw) : raw;

  if (!lastDevis) {
    await twilioClient.messages.create({
      from: TWILIO_FROM, to: MY_WHATSAPP,
      body: "❌ Aucun devis en cours à modifier.",
    });
    return;
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // On reprend l'historique complet de la conversation pour garder le contexte
  const previousMessages = lastDevis.openai_messages || [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: `Client: ${lastDevis.client_nom}, Problème: ${lastDevis.probleme}` },
    {
      role: "assistant",
      content: JSON.stringify({
        client_nom: lastDevis.client_nom,
        probleme: lastDevis.probleme,
        lignes_whatsapp: lastDevis.lignes_whatsapp,
        lignes_html: lastDevis.lignes_html,
        total_ttc: lastDevis.total_ttc,
        conditions: lastDevis.conditions,
        note_technicien: lastDevis.note_technicien,
      }),
    },
  ];

  const messages = [
    ...previousMessages,
    {
      role: "user",
      content: `MODIFICATION DEMANDÉE : ${modifText}\n\nRéponds avec le devis corrigé au même format JSON.`,
    },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    response_format: { type: "json_object" },
    temperature: 0.2,
  });

  const newResponse = completion.choices[0].message.content;
  const newData = JSON.parse(newResponse);

  // Mise à jour Redis
  const updatedRecord = {
    ...lastDevis,
    ...newData,
    updated_at: new Date().toISOString(),
    openai_messages: [...messages, { role: "assistant", content: newResponse }],
  };

  await Promise.all([
    redis.set(KV_LAST_DEVIS_KEY, JSON.stringify(updatedRecord), { ex: 60 * 60 * 24 * 7 }),
    redis.set(`devis:${lastDevis.devis_numero}`, JSON.stringify(updatedRecord), { ex: 60 * 60 * 24 * 90 }),
  ]);

  await twilioClient.messages.create({
    from: TWILIO_FROM, to: MY_WHATSAPP,
    body: buildModifiedDevisMessage(newData, lastDevis.client_codepostal),
  });

  console.log(`[whatsapp] Devis ${lastDevis.devis_numero} modifié`);
}

// ── Commande DEVIS ────────────────────────────────────────────────────────────

async function handleDevis(description, redis, twilioClient) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const userMessage = `Génère un devis à partir de cette description :\n${description}`;

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

  const counter = await redis.incr("devis_counter");
  const year = new Date().getFullYear();
  const devisNumero = `${year}-${String(counter).padStart(3, "0")}`;
  const dateDevis = new Date().toLocaleDateString("fr-FR");

  const newRecord = {
    devis_numero: devisNumero,
    date_devis: dateDevis,
    client_nom: devisData.client_nom || "Client",
    client_telephone: "",
    client_codepostal: "",
    client_email: "",
    probleme: devisData.probleme,
    lignes_whatsapp: devisData.lignes_whatsapp,
    lignes_html: devisData.lignes_html,
    total_ttc: devisData.total_ttc,
    conditions: devisData.conditions,
    note_technicien: devisData.note_technicien,
    raw_input: { description },
    openai_messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
      { role: "assistant", content: openaiResponse },
    ],
    created_at: new Date().toISOString(),
  };

  await Promise.all([
    redis.set(KV_LAST_DEVIS_KEY, JSON.stringify(newRecord), { ex: 60 * 60 * 24 * 7 }),
    redis.set(`devis:${devisNumero}`, JSON.stringify(newRecord), { ex: 60 * 60 * 24 * 90 }),
  ]);

  await twilioClient.messages.create({
    from: TWILIO_FROM, to: MY_WHATSAPP,
    body: `🔧 NOUVEAU DEVIS — ${devisData.client_nom} (WhatsApp)

PROBLÈME : ${devisData.probleme}

LIGNES DE DEVIS :
${devisData.lignes_whatsapp}

TOTAL : ${devisData.total_ttc}
DÉPLACEMENT : Offert
CONDITIONS : ${devisData.conditions}
NOTE TECHNICIEN : ${devisData.note_technicien}

✅ Réponds OK pour générer le PDF
✏️ Réponds MODIF + tes corrections pour modifier
💬 Réponds DEVIS + description pour un nouveau devis`,
  });

  console.log(`[whatsapp] Nouveau devis ${devisNumero} généré depuis WhatsApp`);
}

// ── Handler principal ─────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Content-Type", "text/xml");
    return res.status(405).send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
  }

  // Répondre immédiatement à Twilio (évite le timeout webhook de 15s)
  sendTwiml(res);

  try {
    const body = await parseBody(req);
    const rawMessage = (body.Body || "").trim();
    const from = body.From || "";

    // Sécurité : on n'accepte que les messages de ton propre numéro
    if (from !== MY_WHATSAPP) {
      console.warn(`[whatsapp] Message ignoré venant de: ${from}`);
      return;
    }

    // Ignorer les messages système Twilio sandbox (join/leave codes)
    const TWILIO_SYSTEM_RE = /^(join|leave)\s+\S+/i;
    if (TWILIO_SYSTEM_RE.test(rawMessage)) {
      console.log(`[whatsapp] Message système Twilio ignoré: "${rawMessage}"`);
      return;
    }

    console.log(`[whatsapp] Commande reçue: "${rawMessage}"`);

    const upper = rawMessage.toUpperCase();

    const redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });

    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    if (upper === "OK") {
      await handleOk(redis, twilioClient);

    } else if (upper.startsWith("MODIF")) {
      const modifText = rawMessage.replace(/^MODIF\s*/i, "").trim();
      if (!modifText) {
        await twilioClient.messages.create({
          from: TWILIO_FROM, to: MY_WHATSAPP,
          body: '✏️ Précise les modifications après MODIF.\nEx : "MODIF Ajoute un entretien bisplit et retire le diagnostic"',
        });
        return;
      }
      await handleModif(modifText, redis, twilioClient);

    } else if (upper.startsWith("DEVIS")) {
      const description = rawMessage.replace(/^DEVIS\s*/i, "").trim();
      if (!description) {
        await twilioClient.messages.create({
          from: TWILIO_FROM, to: MY_WHATSAPP,
          body: '💬 Décris la demande après DEVIS.\nEx : "DEVIS Client 13008, clim qui ne refroidit plus, monosplit Daikin"',
        });
        return;
      }
      await handleDevis(description, redis, twilioClient);

    } else {
      await twilioClient.messages.create({
        from: TWILIO_FROM, to: MY_WHATSAPP,
        body: `❓ Commande non reconnue : "${rawMessage}"\n\n✅ OK — générer le PDF\n✏️ MODIF + texte — modifier le devis\n💬 DEVIS + description — nouveau devis`,
      });
    }

  } catch (err) {
    console.error("[whatsapp] Erreur non rattrapée:", err);
    // res déjà envoyé, on log uniquement
  }
};
