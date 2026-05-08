# climurgence.com — Site vitrine

Site vitrine public de la SAS **Clim Urgence** (dépannage, entretien, installation
climatisation à Marseille et environs). C'est ici qu'arrivent les visiteurs depuis
Google, et que sont captés tous les leads via 3 formulaires.

> ⚠️ Ce repo est **distinct** du CRM (`crm.climurgence.com`). Toute la logique
> d'agent IA WhatsApp / Twilio a été migrée dans le CRM — ce site n'envoie
> désormais **que des emails Resend** vers `contact@climurgence.com`.

---

## 📋 Stack technique

| Élément | Détail |
|---------|--------|
| **Hébergement** | [Vercel](https://vercel.com) (statique + Serverless Functions) |
| **Frontend** | HTML/CSS/JS pur — pas de framework, pas de build étape |
| **Backend** | 1 seule Serverless Function : `api/lead.js` |
| **Email** | [Resend](https://resend.com) — domaine `climurgence.com` vérifié |
| **Anti-spam** | Honeypot dans chaque `<form>` + rate limit 5 leads / 10 min / IP via [Upstash Redis](https://upstash.com) |
| **Build images** | [`sharp`](https://sharp.pixelplumbing.com/) (devDep) — utilisé hors CI |

---

## 🔑 Variables d'environnement

Toutes les variables sont définies **dans Vercel Dashboard** (Production + Preview)
et dans `.env.local` pour les tests locaux. **Aucune** n'est commitée dans le repo.

| Variable | Rôle | Où l'obtenir |
|----------|------|--------------|
| `RESEND_API_KEY_SITE` | Clé Resend dédiée au site (cloisonnée du CRM) | [Dashboard Resend → API Keys](https://resend.com/api-keys) |
| `LEAD_EMAIL_TO` | Adresse qui reçoit les leads (par défaut : `contact@climurgence.com`) | — |
| `LEAD_EMAIL_DRY_RUN` | `1` = log l'email dans la console au lieu de l'envoyer (test local) ; `0` = envoi réel | — |
| `UPSTASH_REDIS_REST_URL` | URL REST de la base Redis (rate limit) | [Upstash Console](https://console.upstash.com) → ta DB → REST API |
| `UPSTASH_REDIS_REST_TOKEN` | Token REST de la base Redis | Idem ci-dessus |

> 💡 Si l'ancien projet utilise les noms `KV_REST_API_URL` / `KV_REST_API_TOKEN`
> (anciens noms Vercel KV), `api/lead.js` les lit aussi en fallback —
> aucune action urgente, tu pourras renommer plus tard.

Voir [.env.example](./.env.example) pour le template complet.

---

## 💻 Lancement en local

### Pré-requis (à faire **une seule fois**)

1. **Node.js ≥ 18** installé
2. **Vercel CLI** : `npm install -g vercel`
3. **Lier le projet à Vercel** (la 1re fois seulement) :
   ```bash
   npx vercel link
   ```
   → choisis ton équipe puis le projet `climurgence-site` existant.

### Lancer le site + l'API en local

1. Crée `.env.local` à la racine, en copiant `.env.example` :
   ```bash
   cp .env.example .env.local
   ```
   Puis renseigne tes vraies clés (Resend + Upstash).

2. **Important** : pour les tests, mets `LEAD_EMAIL_DRY_RUN=1` dans
   `.env.local`. Ça affiche le mail dans la console au lieu de l'envoyer
   réellement — utile pour itérer sans spammer ta boîte.

3. Installe les dépendances (1re fois ou après changement de `package.json`) :
   ```bash
   npm install
   ```
   > 💡 **Anti-pattern OneDrive** : si l'install bloque sur des fichiers
   > verrouillés, mets OneDrive en pause (icône bleue → Suspendre la
   > synchronisation 2h) et relance.

4. Lance le serveur de dev :
   ```bash
   npx vercel dev
   ```
   → ouvre [http://localhost:3000](http://localhost:3000) dans le navigateur.

Le serveur sert le site **et** simule la Serverless Function `/api/lead`
exactement comme en prod.

---

## 🚢 Déploiement en production

Le projet est déployé automatiquement par Vercel à chaque push sur `main`.

**Avant le 1er push** post-refonte, ajoute ces 5 variables dans
**Vercel Dashboard → Settings → Environment Variables** (Production + Preview) :

- `RESEND_API_KEY_SITE`
- `LEAD_EMAIL_TO=contact@climurgence.com`
- `LEAD_EMAIL_DRY_RUN=0`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Sinon les emails ne partiront pas.

> ⚠️ Les anciennes variables `OPENAI_API_KEY`, `TWILIO_*`, `PDFMONKEY_*`
> peuvent être supprimées **après** que la nouvelle version est validée
> en prod (pas tout de suite, garde-les en filet de secours pour rollback).

---

## 🧪 Tester `/api/lead`

### Test 1 — Mode dry-run (aucun mail envoyé)

1. Dans `.env.local` : `LEAD_EMAIL_DRY_RUN=1`
2. `npx vercel dev`
3. Sur [http://localhost:3000](http://localhost:3000), remplis le formulaire et soumets
4. Dans le terminal Git Bash, tu dois voir :
   ```
   ──────── [lead] DRY-RUN — email non envoyé ────────
   From    : Site Clim Urgence <noreply@climurgence.com>
   To      : contact@climurgence.com
   Subject : [CONTACT 13008] ... — Jean Dupont
   --- TEXT ---
   ...
   ```

### Test 2 — Vrai email

1. `LEAD_EMAIL_DRY_RUN=0` dans `.env.local`
2. Soumets un formulaire avec ton vrai email à toi (pas celui de Clim Urgence)
3. Vérifie ta boîte `contact@climurgence.com` — le mail doit arriver avec :
   - Bandeau coloré selon le type (rouge urgence, orange install, etc.)
   - Bouton orange « 📋 Créer la fiche client dans le CRM »
   - Toutes tes coordonnées + le sujet
   - Métadonnées en bas (page d'origine, IP tronquée, navigateur)

### Test 3 — Honeypot anti-bot

1. Ouvre la page → **F12** (DevTools) → onglet **Console**
2. Colle :
   ```javascript
   document.querySelector('input[name="website"]').value = 'http://spam.example';
   ```
3. Remplis et soumets le formulaire
4. La requête doit retourner **200 OK** mais **aucun mail** ne doit partir.
   Dans le terminal `vercel dev` : `[lead] Honeypot déclenché — bot piégé`.

### Test 4 — Rate limit

1. Soumets 6 formulaires d'affilée depuis la même IP
2. Le 6e doit retourner **429** avec un message d'erreur invitant à téléphoner.

---

## 🔄 Procédure rollback

Si un problème majeur survient en prod après la mise en ligne :

1. **Étape rapide** (revert via Vercel Dashboard) :
   Vercel → Deployments → choisir le dernier déploiement avant la refonte → **Promote to Production**.
   Effet immédiat, aucun code à toucher.

2. **Rollback complet via git** (si tu veux annuler côté code) :
   ```bash
   # Remettre les anciens endpoints en place
   git mv api/_archive/devis.js api/devis.js
   git mv api/_archive/whatsapp.js api/whatsapp.js

   # Remettre twilio + openai dans package.json (les versions étaient :
   # "openai": "^4.67.0" et "twilio": "^5.3.7")
   ```
   Puis :
   - Restaurer les entrées correspondantes dans `vercel.json` (`functions`).
   - `npm install`
   - Tester en local avec `vercel dev` puis pousser.

> 📌 Les anciens endpoints sont **conservés** dans `api/_archive/` —
> Vercel ignore les sous-dossiers d'`api/` qui commencent par `_`,
> donc ils ne sont pas exposés mais sont prêts pour un rollback.

---

## 📂 Structure du projet

```
climurgence-site/
├── api/
│   ├── lead.js              ← Route unique de réception des leads
│   └── _archive/            ← Anciens endpoints (Twilio + OpenAI), inactifs
│       ├── devis.js
│       └── whatsapp.js
├── css/                     ← Styles (servis avec cache 1 an)
├── js/
│   └── main.js              ← Handler unifié .form-devis + .modal-form
├── img/                     ← Images (servies avec cache 1 an)
├── index.html               ← Page d'accueil + form #1
├── contact/index.html       ← Form #2
├── tarifs/index.html        ← Form #3 (modal, 18 prestations)
├── depannage-clim-*/        ← 7 pages SEO (sans formulaire)
├── entretien-climatisation/ ← page SEO
├── installation-climatisation/
├── contrats-pro/
├── faq/  guide/  blog/  zone-intervention/
├── cgv/  mentions-legales/  confidentialite/
├── vercel.json              ← Config Vercel (functions, headers, redirects)
├── package.json             ← deps : @upstash/redis + resend
├── .env.example             ← Template variables d'env
└── .gitignore
```

---

## 🔐 Sécurité

- **Headers de sécurité** durcis dans `vercel.json` : HSTS, CSP, X-Frame-Options, etc.
- **Honeypot** caché en CSS dans chaque `<form>` : un bot rempli typiquement tous les champs détectés ; nous on rejette silencieusement.
- **Rate limit** Redis : protection DDoS basique des formulaires.
- **IP tronquée** dans les logs et les emails (RGPD : ne pas conserver l'IP en clair).
- **Resend Reply-To** = email du prospect : tu peux répondre directement depuis Gmail sans copier-coller.

---

## 📞 Contact

- **Société** : SAS Clim Urgence
- **Téléphone** : 06 43 72 18 50 (9h-21h, 7j/7)
- **Email** : contact@climurgence.com
