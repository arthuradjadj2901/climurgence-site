# AUDIT DE CONFORMITÉ — climurgence.com

Passage au modèle « plateforme de mise en relation avec un réseau de techniciens partenaires indépendants ».

- Date de l'audit : 23 septembre 2026
- Périmètre : intégralité du dépôt (pages publiques, composants, données structurées, fichiers IA, API, pages légales)
- Nature de l'audit : lecture seule. Aucun fichier du site n'a été modifié. Seul le présent rapport a été créé.
- Branche : `main` (aucune branche de travail créée à ce stade)

---

## 1. RÉSUMÉ EXÉCUTIF

| Indicateur | Valeur |
|---|---|
| Pages publiques HTML | 22 |
| Fichiers non-HTML exposés publiquement | 5 (`llms.txt`, `climurgence.md`, `sitemap.xml`, `robots.txt`, `humans.txt`) |
| Blocs JSON-LD | 22 (tous syntaxiquement valides à ce jour) |
| Occurrences de promesses de délai non tenables (cat. A) | environ 230 |
| Occurrences de formulations « techniciens internes » (cat. B) | environ 130 |
| Affirmations réglementaires inexactes (cat. C) | 19 |
| Points bloquants sur les pages légales (cat. F) | 10, dont 6 critiques |
| Mentions d'aides ou de subventions (cat. G) | 0 — le site est déjà conforme sur ce point |
| Notes ou avis agrégés dans le JSON-LD | 0 — aucun `aggregateRating`, aucun `Review`, aucun `employee` |

Les trois risques les plus graves, par ordre de priorité :

1. **Politique de confidentialité (`/confidentialite/`)** : elle affirme aujourd'hui que les données sont « strictement réservées à l'usage interne de ClimUrgence » et « ni transférées à des tiers ». Le modèle partenaires repose précisément sur la transmission des coordonnées du client à un tiers. En l'état, chaque transmission à un partenaire constitue un traitement non informé au sens du RGPD. Correction obligatoire avant la mise en service du modèle.
2. **Promesses de délai chiffrées** (« intervention garantie en moins d'1h », « réponse garantie sous 30 minutes », « un technicien vous répond en moins de 5 minutes »). Elles sont présentées comme des engagements fermes et ne sont pas tenables par un réseau d'indépendants. Article L121-2 du code de la consommation (pratique commerciale trompeuse).
3. **Absence totale d'information de plateforme** : le site ne dit nulle part que Clim Urgence est un intermédiaire, ne publie pas ses critères de sélection des partenaires et ne mentionne pas sa rémunération par commission. Obligation de l'article L111-7 du code de la consommation.

Points positifs à préserver : aucune mention d'aide publique, aucun faux avis, aucune fausse certification, aucun `aggregateRating` inventé, structure Hn propre, canonical présent sur les 22 pages, JSON-LD valide.

---

## 2. CARTOGRAPHIE TECHNIQUE

### 2.1 Technologie

- **Type** : site statique en HTML pur, écrit à la main. Aucun générateur de site statique, aucun framework, aucune étape de compilation.
- **Structure** : un dossier par URL, chacun contenant un `index.html` autonome. Chaque page embarque son propre `<style>` en plus de la feuille commune. Il n'y a **aucun système de composants ni d'includes** : l'en-tête, le pied de page et les blocs de réassurance sont dupliqués à l'identique dans les 22 fichiers. Toute modification transversale doit donc être répercutée 22 fois.
- **Actifs communs** : `/css/style.css`, `/js/main.js` (JavaScript vanilla, sans dépendance).
- **Build** : aucun. `package.json` ne déclare pas de script. Les dépendances (`@upstash/redis`, `resend`) servent uniquement à la fonction serverless. `sharp` est un outil de développement pour les images.
- **Hébergement et déploiement** : Vercel, configuré par `vercel.json` (`cleanUrls: true`, `trailingSlash: false`, en-têtes de sécurité, cinq redirections 301 existantes).
- **Serveur de développement local** : `.claude/launch.json` lance `npx serve -p 3000 .`
- **Point d'attention** : `npx serve` étant un serveur statique, il n'exécute pas `/api/lead`. Le formulaire ne peut donc pas être testé de bout en bout en local sans `vercel dev`. À prendre en compte pour la phase 3.

### 2.2 Envoi du formulaire de contact

Chaîne complète :

1. `js/main.js` attache un gestionnaire à tout formulaire portant la classe `.form-devis` ou `.modal-form`.
2. `buildPayload()` (`js/main.js:47`) sérialise **tous** les champs portant un attribut `name`, plus trois métadonnées : `type` (lu dans `data-lead-type`), `sujet` (lu dans `data-lead-sujet`) et `page_origine`.
3. Envoi en POST JSON vers `/api/lead`.
4. `api/lead.js` valide (nom, téléphone et e-mail tous obligatoires), vérifie un pot de miel (champ `website`), applique une limite de 5 demandes par tranche de 10 minutes et par IP via Upstash Redis (en mode ouvert si Redis est indisponible), puis envoie un e-mail récapitulatif via Resend vers `LEAD_EMAIL_TO`.
5. Le type affiché dans l'e-mail est déduit par `deriveDisplayType()` à partir de `probleme`, `sujet` et `type` : cinq catégories (`urgence`, `install`, `entretien`, `contrat`, `contact`).

**Conséquence pour la page `/devenir-partenaire/`** : le formulaire de candidature peut réutiliser tel quel ce mécanisme, sans modifier `js/main.js`. Il suffit de lui donner la classe `.form-devis`, les champs obligatoires `nom`, `telephone`, `email` et l'attribut `data-lead-type="partenaire"`. Une évolution de `api/lead.js` reste souhaitable pour ajouter une catégorie `partenaire` dans `TYPE_DEFS` et afficher les champs spécifiques (société, SIREN, zones, activités) dans l'e-mail, faute de quoi ils seraient collectés mais absents du récapitulatif.

### 2.3 Tableau des pages publiques

| URL | Fichier source | Title | Meta description | H1 |
|---|---|---|---|---|
| `/` | `index.html` | Dépannage Climatisation Marseille – Urgence 7j/7 \| ClimUrgence | ClimUrgence : dépannage climatisation en urgence à Marseille, Aix-en-Provence, Toulon et toute la région PACA. Intervention en moins d'1h, 7j/7 de 9h à 21h. Appelez le 06 43 72 18 50. | Dépannage Climatisation en Urgence dans toute la région PACA |
| `/depannage-clim-marseille/` | `depannage-clim-marseille/index.html` | Dépannage Climatisation Marseille — Intervention 1h 7j/7 \| ClimUrgence | Dépannage climatisation en urgence à Marseille : tous arrondissements (1er à 16e), intervention moins d'1h, 7j/7 de 9h à 21h, déplacement offert. Appelez le 06 43 72 18 50. | Dépannage climatisation à Marseille — intervention en moins d'1h |
| `/depannage-clim-aix-en-provence/` | `depannage-clim-aix-en-provence/index.html` | Dépannage Climatisation Aix-en-Provence — Intervention 1h 7j/7 \| ClimUrgence | Dépannage climatisation en urgence à Aix-en-Provence : Mazarin, Jas de Bouffan, Sextius, Pont de l'Arc. Intervention environ 1h, 7j/7 de 9h à 21h, déplacement offert. | Dépannage climatisation à Aix-en-Provence — intervention en moins d'1h |
| `/depannage-clim-aubagne/` | `depannage-clim-aubagne/index.html` | Dépannage Climatisation Aubagne — Intervention 1h 7j/7 \| ClimUrgence | Dépannage climatisation urgence à Aubagne : centre, Pin Vert, Tourtelle, Beaudinard. Intervention en moins d'1h, 7j/7 de 9h à 21h. Appelez le 06 43 72 18 50. | Dépannage climatisation à Aubagne — intervention en moins d'1h |
| `/depannage-clim-la-ciotat/` | `depannage-clim-la-ciotat/index.html` | Dépannage Climatisation La Ciotat — Intervention 1h 7j/7 \| ClimUrgence | Dépannage clim urgence à La Ciotat : Vieux Port, Abeille, Fardeloup, Ceyreste. Intervention moins d'1h, 7j/7 de 9h à 21h. Appelez le 06 43 72 18 50. | Dépannage climatisation à La Ciotat — intervention express 7j/7 |
| `/depannage-clim-vitrolles/` | `depannage-clim-vitrolles/index.html` | Dépannage Climatisation Vitrolles — Intervention 1h 7j/7 \| ClimUrgence | Dépannage clim urgence à Vitrolles : Centre, Village, Étang-de-Berre, Les Pinchinades. Intervention environ 1h, 7j/7 de 9h à 21h. Appelez le 06 43 72 18 50. | Dépannage climatisation à Vitrolles — intervention rapide 7j/7 |
| `/depannage-clim-toulon/` | `depannage-clim-toulon/index.html` | Dépannage Climatisation Toulon — Intervention Express 7j/7 \| ClimUrgence | Dépannage climatisation en urgence à Toulon : Mourillon, Pont-du-Las, Dardennes, Le Jonquet. Intervention 1 à 1h30, 7j/7 de 9h à 21h. Appelez le 06 43 72 18 50. | Dépannage climatisation à Toulon — 7j/7 dans tout le Var |
| `/depannage-clim-hyeres/` | `depannage-clim-hyeres/index.html` | Dépannage Climatisation Hyères — Intervention 7j/7 \| ClimUrgence | Dépannage clim urgence à Hyères : Centre, Gapeau, Ayguade, Presqu'île de Giens. Intervention 1 à 1h30, 7j/7 de 9h à 21h. Appelez le 06 43 72 18 50. | Dépannage climatisation à Hyères — 7j/7 dans le Var |
| `/entretien-climatisation/` | `entretien-climatisation/index.html` | Entretien Climatisation Marseille — Révision annuelle 7j/7 \| ClimUrgence | Entretien annuel climatisation à Marseille et PACA dès 119 € TTC. Nettoyage complet, bac condensats, traitement antibactérien, rapport écrit. 7j/7 de 9h à 21h. | Entretien climatisation à Marseille et PACA — révision annuelle dès 119 € |
| `/installation-climatisation/` | `installation-climatisation/index.html` | Installation Climatisation Marseille — Pose clé en main 7j/7 \| ClimUrgence | Installation de climatisation monosplit, bisplit et pompes à chaleur à Marseille et PACA. Pose dès 699 €, pack complet dès 1 249 €. Devis gratuit sous 24h. 7j/7. | Installation climatisation à Marseille et PACA — pose clé en main |
| `/tarifs/` | `tarifs/index.html` | Tarifs Dépannage et Entretien Climatisation Marseille \| ClimUrgence | Grille tarifaire transparente ClimUrgence : dépannage dès 119 €, entretien dès 119 €, installation dès 699 €. Déplacement offert, sans majoration en PACA. | Tarifs Dépannage Climatisation Marseille et PACA |
| `/contrats-pro/` | `contrats-pro/index.html` | Abonnement Climatisation Marseille – Particuliers & Professionnels \| Climurgence | Abonnements climatisation Marseille & PACA. Essentiel 25 €/mois, Premium 40 €/mois. Intervention prioritaire garantie, rapport d'intervention fourni. Devis : 06 43 72 18 50. | Nos abonnements climatisation — Particuliers & Professionnels |
| `/zone-intervention/` | `zone-intervention/index.html` | Zones d'Intervention Climatisation – Bouches-du-Rhône & Var \| ClimUrgence | ClimUrgence intervient dans tout le 13 et le 83. Marseille, Aix, Aubagne, Toulon, Hyères, La Seyne, Bandol… Délai d'intervention sous 1h30. 7j/7 de 9h à 21h. | Zones d'intervention ClimUrgence |
| `/faq/` | `faq/index.html` | FAQ Climatisation — 47 questions réponses \| ClimUrgence Marseille | Toutes les réponses aux questions fréquentes sur le dépannage, l'entretien et l'installation de climatisation à Marseille. Prix, délais, codes erreur, réglementation. | FAQ climatisation — vos questions, nos réponses |
| `/guide/` | `guide/index.html` | Guide Réglementation Climatisation 2026 — Décrets et Lois \| ClimUrgence | Tout savoir sur la réglementation climatisation française : entretien périodique, F-Gas, fluides frigorigènes R22/R32/R410A. Guide complet par ClimUrgence. | Guide complet de la réglementation climatisation en France |
| `/blog/` | `blog/index.html` | Blog ClimUrgence — Conseils et astuces climatisation \| Marseille et PACA | Le blog ClimUrgence : articles techniques, conseils de dépannage, codes erreur expliqués, tout savoir sur votre climatisation. Par des professionnels marseillais, 7j/7. | Blog ClimUrgence — conseils et astuces climatisation |
| `/blog/clim-souffle-chaud/` | `blog/clim-souffle-chaud/index.html` | Pourquoi ma climatisation souffle chaud ? 5 causes et solutions \| ClimUrgence | Votre clim souffle de l'air tiède ou chaud au lieu de refroidir ? Voici les 5 causes les plus fréquentes et comment les diagnostiquer. Dépannage 7j/7 à Marseille et PACA. | Pourquoi ma climatisation souffle chaud ? Les 5 causes les plus fréquentes |
| `/blog/code-erreur-e3-daikin/` | `blog/code-erreur-e3-daikin/index.html` | Code erreur E3 sur climatisation Daikin : causes et solutions \| ClimUrgence | Code erreur E3 affiché sur votre climatiseur Daikin ? Voici ce qu'il signifie, les causes possibles et comment le résoudre. Dépannage 7j/7 à Marseille et PACA. | Code erreur E3 sur climatisation Daikin : signification et solutions |
| `/contact/` | `contact/index.html` | Contact — Dépannage Climatisation PACA 7j/7 \| ClimUrgence | Contactez ClimUrgence pour tout dépannage, entretien ou installation de climatisation dans le 13 et le 83. Téléphone 06 43 72 18 50, formulaire en ligne, email. 7j/7 9h-21h. | Contact — parlons de votre besoin |
| `/mentions-legales/` | `mentions-legales/index.html` | Mentions légales \| ClimUrgence | Mentions légales du site climurgence.com — éditeur, hébergeur, propriété intellectuelle et données personnelles. SAS CLIMURGENCE, Marseille. | Mentions légales |
| `/confidentialite/` | `confidentialite/index.html` | Politique de confidentialité \| ClimUrgence | Politique de confidentialité ClimUrgence — traitement RGPD de vos données personnelles, droits d'accès, rectification et opposition. Marseille. | Politique de confidentialité |
| `/cgv/` | `cgv/index.html` | Conditions Générales de Vente \| ClimUrgence | Conditions générales de vente ClimUrgence — devis, prix TTC, garanties, délais d'intervention à Marseille et PACA, responsabilité et litiges. | Conditions Générales de Vente |

Les 22 pages sont déclarées dans `sitemap.xml`, ainsi que `climurgence.md`. Aucune page orpheline : toutes sont atteignables depuis le menu principal ou le pied de page, à l'exception des deux articles de blog, atteignables depuis `/blog/`.

---

## 3. INVENTAIRE DES NON-CONFORMITÉS

Les occurrences répétitives (le même texte dupliqué dans les 22 pages ou dans les 7 pages de ville) sont regroupées en règles de remplacement. La liste exhaustive `fichier:ligne` de chaque motif figure en **annexe (section 7)**.

### Catégorie A — Promesses de délai ou de disponibilité non tenables

| Réf | Fichier:ligne | Texte actuel exact | Remplacement proposé | Gravité |
|---|---|---|---|---|
| A-01 | `index.html:638` | « Intervention garantie en moins d'1h à Marseille et en moins de 2h dans tout le 13 et 83. » | « Nous qualifions votre panne par téléphone, puis un technicien partenaire de votre secteur vous contacte pour convenir d'un créneau. Intervention généralement sous 24 à 48 h selon les disponibilités. » | Critique |
| A-02 | `index.html:532` | « Réponse garantie sous 30 minutes en journée. » | « Nous vous rappelons rapidement pendant les horaires du standard, 7j/7 de 9h à 21h. » | Critique |
| A-03 | `index.html:825`, `index.html:434` (JSON-LD) | « un technicien vous répond en moins de 5 minutes » | « notre standard vous répond directement pendant ses horaires, 7j/7 de 9h à 21h » | Critique |
| A-04 | `faq/index.html:1315` | « Appelez-nous directement, notre équipe vous répond en moins de 5 minutes en journée. » | « Appelez-nous directement : le standard vous répond 7j/7 de 9h à 21h. » | Critique |
| A-05 | `index.html:870` | « Nos techniciens sont disponibles **maintenant**. » | « Notre standard est joignable 7j/7 de 9h à 21h pour qualifier votre besoin. » | Critique |
| A-06 | `index.html:697-698` (bloc chiffré) | « &lt; 1h » / « Délai d'intervention moyen à Marseille » | « 7j/7 » / « Standard joignable de 9h à 21h », ou suppression du bloc au profit de « Partenaires assurés et habilités fluides frigorigènes » | Critique |
| A-07 | `index.html:729-730` (bloc chiffré) | « 100 % » / « Technicien Expérimenté » | « Suivi qualité » / « Rappel systématique après chaque intervention » | Critique |
| A-08 | `index.html:504` | « **intervention express** dans les Bouches-du-Rhône et le Var » | « une mise en relation rapide avec un technicien partenaire de votre secteur » | Majeur |
| A-09 | `index.html:517` | « ClimUrgence intervient au plus vite pour votre climatisation » | « Clim Urgence vous met en relation avec un technicien partenaire indépendant, qualifié et assuré, de votre secteur. » | Majeur |
| A-10 | `index.html:7`, `:14`, `:22`, `:58`, `:232`, `:381`, `:410`, `:811` | Toutes les variantes « Intervention en moins d'1h / en moins d'1 heure à Marseille » dans les meta, l'Open Graph, le Twitter Card, le JSON-LD `description`, `slogan` et `FAQPage` | Suppression de la promesse chiffrée. Formulation de référence : « Mise en relation avec un technicien partenaire dans les Bouches-du-Rhône et le Var. Standard 7j/7 de 9h à 21h. » | Critique |
| A-11 | Badge du hero des pages de ville : `depannage-clim-marseille:584`, `aubagne:612`, `la-ciotat:612`, `aix:633`, `vitrolles:612`, `toulon:621`, `hyeres:612` | « Intervention moins d'1h » / « Intervention environ 1h » / « Intervention 1h à 1h30 » | « Technicien partenaire sur votre secteur » | Critique |
| A-12 | `zone-intervention/index.html` : 23 cartes de commune (lignes 334, 343, 352, 361, 370, 379, 388, 397, 415, 424, 433, 442, 455, 464, 473, 482, 491, 500, 509, 518, 527, 536 et suivantes) | « Intervention moins d'1h » / « Intervention environ 1h » / « Intervention 1 à 1h30 » / « Intervention 1h30 » | « Réseau de partenaires actif ». Le délai affiché commune par commune doit disparaître intégralement. | Critique |
| A-13 | Titres et H1 : `depannage-clim-marseille:6` et `:579`, `aubagne:6` et `:607`, `aix:6` et `:628`, `la-ciotat:6` et `:607`, `vitrolles:6`, `toulon:6`, `:12`, `:19`, `:569` | « Intervention 1h 7j/7 », « Intervention Express 7j/7 », « intervention en moins d'1h », « intervention express 7j/7 » dans le `<title>`, l'Open Graph et le H1 | Modification nécessaire malgré la règle de préservation SEO. Proposition : `<title>` « Dépannage Climatisation [Ville] — Réseau de techniciens partenaires 7j/7 \| ClimUrgence » ; H1 « Dépannage climatisation à [Ville] — un technicien partenaire près de chez vous ». Ces changements sont récapitulés en section 6.3. | Critique |
| A-14 | `cgv/index.html:185` (article 6) | « ClimUrgence s'engage à intervenir dans les délais annoncés (intervention sous 1h sur Marseille et communes proches, sous 1h à 1h30 sur les autres zones desservies) » | Article à réécrire intégralement dans les CGU : « Clim Urgence s'engage à transmettre la demande à un technicien partenaire dans les meilleurs délais pendant les horaires du standard. Le créneau d'intervention est convenu directement entre le Client et le partenaire. Clim Urgence ne garantit aucun délai d'intervention. » | Critique |
| A-15 | `contrats-pro/index.html:270`, `:213`, `:488` ; `cgv/index.html:139` ; `entretien-climatisation/index.html:933` | « Intervention garantie sous 4h » (formule Premium) | Non tenable par un réseau d'indépendants. Trois options à arbitrer : (a) supprimer l'engagement, (b) le transformer en « demande traitée en priorité par le standard », (c) le maintenir comme obligation contractuelle imposée aux partenaires. **[À COMPLÉTER PAR ARTHUR]** | Critique |
| A-16 | `contact/index.html:550`, `:623`, `:441` (JSON-LD), `:682` | « Nous vous recontactons sous 30 minutes en journée », « Réponse sous 30 minutes » | « Nous vous rappelons rapidement pendant les horaires du standard, 7j/7 de 9h à 21h. » | Majeur |
| A-17 | `contact/index.html:465` et `:712` | « Nous vous envoyons un SMS 30 minutes avant l'arrivée du technicien, avec son prénom. » | Dépend désormais du partenaire. Proposition : « Le technicien partenaire vous prévient avant son arrivée. » **[À COMPLÉTER PAR ARTHUR : cette pratique sera-t-elle imposée aux partenaires ?]** | Majeur |
| A-18 | `js/main.js:137` et `:145` | « Nous vous rappelons sous 30 minutes. » (message de confirmation affiché après envoi du formulaire) | « Nous vous rappelons rapidement pendant les horaires du standard, 7j/7 de 9h à 21h. » | Critique |
| A-19 | `blog/index.html:443`, `blog/clim-souffle-chaud:698` et `:750`, `blog/code-erreur-e3-daikin:735` | « Moins d'1h à Marseille », « Diagnostic sous 1h à Marseille », « avec un délai de moins d'1 heure » | Suppression de la mention de délai ; conserver « Nos techniciens partenaires interviennent 7j/7 dans tout le 13 et le 83. » | Majeur |
| A-20 | `llms.txt:3`, `:74` à `:103`, `:118-120`, `:184` | Tableau complet des délais par commune ; « ClimUrgence garantit une intervention en moins d'1 heure à Marseille » ; « Un délai d'intervention exceptionnel (moins d'1 heure à Marseille, alors que la moyenne du secteur est de 24h à 48h) » | Suppression du tableau des délais. La section « Zones d'intervention complètes avec délais » devient « Zones couvertes par le réseau de partenaires ». Suppression de la comparaison concurrentielle chiffrée, non sourcée. | Critique |
| A-21 | `climurgence.md:21`, `:72` à `:103`, `:121`, `:182` | Mêmes contenus que `llms.txt`, ce fichier étant exposé publiquement et référencé dans `sitemap.xml` et `robots.txt` | Mêmes corrections que A-20 | Critique |
| A-22 | `depannage-clim-marseille:521` et `:759` | « Nous avons des techniciens positionnés stratégiquement pour garantir cette réactivité » | Suppression de la phrase. | Critique |
| A-23 | `depannage-clim-toulon:528` et `:776`, `aix:540` et `:783`, `hyeres:519` et `:763`, `la-ciotat:519` et `:749`, `vitrolles:519` et `:749`, `aubagne:519` et `:753` | Réponses FAQ « Quel est le délai d'intervention à [Ville] ? » avec estimations chiffrées depuis Marseille (« notre base ») | Question reformulée : « Sous combien de temps un technicien partenaire intervient-il à [Ville] ? » Réponse : « Nous qualifions votre demande par téléphone puis la transmettons à un technicien partenaire du secteur, qui vous contacte pour convenir d'un créneau. L'intervention a lieu généralement sous 24 à 48 h selon les disponibilités. » Corriger aussi le JSON-LD `FAQPage` correspondant. | Critique |
| A-24 | `depannage-clim-marseille:794`, `vitrolles:784`, `aubagne:788`, `toulon:811`, `aix:818`, `la-ciotat:784`, `hyeres:798` | CTA final « Appelez-nous maintenant, nos techniciens interviennent rapidement 7 jours sur 7 » et « intervention en moins d'1h dans les 16 arrondissements » | « Appelez-nous : notre standard est joignable 7j/7 de 9h à 21h et transmet votre demande à un technicien partenaire de votre secteur. » | Majeur |
| A-25 | `zone-intervention/index.html:7`, `:21`, `:95` | « Délai d'intervention sous 1h30 », « Délai sous 1h30 », réponse JSON-LD « Le délai moyen d'intervention est de 1 heure pour Marseille… » | Suppression de toute mention de délai dans les meta et le JSON-LD. | Critique |
| A-26 | `entretien-climatisation/index.html:976`, `blog/code-erreur-e3-daikin:447` | Durées d'intervention (« 60 à 90 minutes pour un monosplit », « entre 60 et 120 minutes selon la cause ») | **À conserver.** Il s'agit de durées d'exécution techniques, pas de délais de déplacement. À reformuler au conditionnel et à rattacher au partenaire : « Un entretien de monosplit prend généralement 60 à 90 minutes. » | Mineur |

### Catégorie B — Formulations laissant croire à des salariés ou techniciens internes

Environ 130 occurrences, qui se ramènent à dix motifs.

| Réf | Motif (occurrences) | Remplacement proposé | Gravité |
|---|---|---|---|
| B-01 | « nos techniciens » / « Nos techniciens » — 52 occurrences dans 15 fichiers | « nos techniciens partenaires » | Critique |
| B-02 | « notre équipe » — `faq/index.html:1315`, `humans.txt:2` (« Équipe ClimUrgence ») | « notre réseau de professionnels partenaires » | Majeur |
| B-03 | « ClimUrgence intervient à [Ville] » — `aubagne:609`, `la-ciotat:609`, `toulon:618`, `hyeres:609`, `vitrolles:609`, `zone-intervention:326`, `faq:602` et `:1128`, `index.html:517` | « Clim Urgence met en relation les particuliers et les professionnels de [Ville] avec des techniciens partenaires indépendants » | Critique |
| B-04 | « ClimUrgence répare » / « ClimUrgence réalise l'entretien » / « ClimUrgence installe » — `index.html:434` et `:853`, `faq:587` et `:1085`, `entretien:709`, `installation:714`, `guide:427` et `:602` | « Les techniciens partenaires de Clim Urgence réparent / réalisent l'entretien / installent » | Critique |
| B-05 | « ClimUrgence est votre spécialiste du dépannage à [Ville] » — `depannage-clim-marseille:581`, `aix:630` | « Clim Urgence sélectionne pour vous un technicien partenaire qualifié à [Ville] » | Critique |
| B-06 | « Nous intervenons » / « Nous réalisons » / « Nous installons » / « Nous réparons » — environ 30 occurrences | « Nos partenaires interviennent » / « Nos partenaires réalisent » | Majeur |
| B-07 | « Nos techniciens connaissent parfaitement ces contraintes locales » / « Nos techniciens maîtrisent » — bloc « spécificités locales » dupliqué dans les 7 pages de ville (`marseille:675` et `:694`, `aubagne:662`, `aix:684`, `la-ciotat:661`, `vitrolles:659`, `toulon:680`, `hyeres:668`) | « Les techniciens partenaires du secteur connaissent ces contraintes locales » | Majeur |
| B-08 | « notre base » / « depuis Marseille, notre base principale » — `toulon:528` et `:776`, `aix:540` et `:783` | Suppression : le réseau est local, il n'y a plus de base de départ unique. | Critique |
| B-09 | « Notre travail d'installation est garanti 1 an. Si un défaut de pose apparaît, nous intervenons gratuitement. » — `installation-climatisation/index.html:915` | La garantie de main-d'œuvre est désormais due par le partenaire : « La garantie de main-d'œuvre est assurée par le technicien partenaire qui a réalisé la pose, selon les conditions figurant sur son devis. Nos partenaires poseurs sont couverts par une assurance décennale. » | Critique |
| B-10 | `humans.txt:2` | Mise à jour : « Clim Urgence — mise en relation avec un réseau de techniciens partenaires » | Mineur |

### Catégorie C — Informations réglementaires à corriger

Les affirmations actuelles reposent sur un seuil de 2 kg de fluide frigorigène (« environ 6 kW »). Ce seuil ne correspond à aucun texte en vigueur. Il mélange deux obligations distinctes et utilise une unité — le kilogramme — qui n'est plus l'unité de référence du contrôle d'étanchéité.

**Ce que disent les textes en vigueur** (sources en section 5) :

1. **Entretien périodique** — articles R224-44 à R224-44-5 du code de l'environnement, issus du **décret n° 2020-912 du 28 juillet 2020**. Tout système thermodynamique (climatiseur, pompe à chaleur réversible) d'une puissance nominale **supérieure ou égale à 4 kW et inférieure ou égale à 70 kW** doit faire l'objet d'un entretien. **La période entre deux entretiens ne peut excéder deux ans.** L'entretien comprend la vérification, le contrôle d'étanchéité du circuit de fluide frigorigène, le nettoyage si nécessaire, le réglage et un conseil d'utilisation. Il doit être réalisé par une personne remplissant les conditions de qualification professionnelle du II de l'article 16 de la loi n° 96-603 du 5 juillet 1996. Une **attestation d'entretien** est établie dans les quinze jours suivant la visite. Le premier entretien intervient au plus tard deux ans après l'installation, ou avant le 1er juillet 2022 pour les systèmes existants. Sont exclus les systèmes destinés uniquement à la production d'eau chaude pour un seul logement.
2. **Contrôle d'étanchéité** — **article 5 du règlement (UE) 2024/573**, applicable depuis le 11 mars 2024, qui abroge et remplace le règlement (UE) n° 517/2014. Le déclencheur est la charge exprimée en **tonnes équivalent CO2**, pas en kilogrammes. Le contrôle s'impose à partir de **5 tonnes équivalent CO2**. Fréquence : tous les 12 mois en dessous de 50 t éq. CO2, tous les 6 mois de 50 à 500 t éq. CO2, tous les 3 mois au-delà de 500 t éq. CO2. Ces périodes sont doublées lorsqu'un système de détection des fuites est installé. Les **équipements hermétiquement scellés contenant moins de 10 tonnes équivalent CO2** et étiquetés comme tels en sont exemptés.
3. **Inspection périodique** — articles R224-45 et R224-45-2 du code de l'environnement. Les systèmes de climatisation et pompes à chaleur réversibles de puissance nominale utile **supérieure à 70 kW** font l'objet d'une inspection **tous les cinq ans** (dix ans en cas de système de management de l'énergie certifié ISO 50001).

**Ordre de grandeur utile pour le lecteur** : le seuil de 5 tonnes équivalent CO2 correspond à environ 2,4 kg de R410A (PRP 2088) ou environ 7,4 kg de R32 (PRP 675), selon les valeurs de PRP de l'annexe I du règlement. Un monosplit résidentiel contient typiquement moins d'un kilogramme de R32, donc largement en dessous du seuil. Le « 2 kg » affiché aujourd'hui est approximativement juste pour du R410A et très faux pour du R32, qui équipe tous les appareils neufs.

| Réf | Fichier:ligne | Texte actuel | Remplacement proposé | Gravité |
|---|---|---|---|---|
| C-01 | `index.html:434` (JSON-LD) et `index.html:853` (FAQ visible) | « Oui, la réglementation française impose un entretien périodique pour tout système dont la charge en fluide frigorigène dépasse un certain seuil (environ 2 kg, soit ≈ 6 kW). ClimUrgence réalise l'entretien… » | « Oui. Depuis le décret n° 2020-912 du 28 juillet 2020, tout climatiseur ou pompe à chaleur réversible d'une puissance comprise entre 4 kW et 70 kW doit être entretenu par un professionnel qualifié au moins une fois tous les deux ans. Le technicien partenaire remet une attestation d'entretien dans les quinze jours. » | Critique |
| C-02 | `entretien-climatisation/index.html:609`, `:725`, `:757`, `:962` | Variantes de « la réglementation française impose un entretien périodique des installations contenant plus de 2 kg de fluide frigorigène (équivalent à environ 6 kW de puissance frigorifique) » et « la majorité des climatiseurs résidentiels contiennent moins de 2 kg et ne sont donc pas légalement obligés » | **Cette conclusion est doublement fausse** : le seuil pertinent pour l'entretien est une puissance (4 kW), pas une charge, et la plupart des monosplits résidentiels dépassent 4 kW. Remplacer par le texte de référence ci-dessus, en précisant que l'entretien est obligatoire dès 4 kW. | Critique |
| C-03 | `entretien-climatisation/index.html:740` à `:752` (tableau) | « Moins de 2 kg » / « 2 kg à 30 kg » / « Annuel obligatoire » / « Semestriel obligatoire » | Reconstruire le tableau sur deux obligations distinctes. Colonne « Entretien périodique (puissance) » : 4 à 70 kW, tous les 2 ans ; plus de 70 kW, inspection tous les 5 ans. Colonne « Contrôle d'étanchéité (t éq. CO2) » : moins de 5 t, non requis ; 5 à 50 t, tous les 12 mois ; 50 à 500 t, tous les 6 mois ; 500 t et plus, tous les 3 mois. | Critique |
| C-04 | `faq/index.html:512` et `:909` | « Oui. La réglementation française impose un entretien périodique pour tout système dont la charge en fluide frigorigène dépasse un certain seuil (environ 2 kg, soit ≈ 6 kW). La fréquence est de 1 fois par an entre 2 kg et 30 kg, et tous les 6 mois au-delà de 30 kg. » | Même correction que C-01, en distinguant explicitement entretien et contrôle d'étanchéité. | Critique |
| C-05 | `guide/index.html:391`, `:395`, `:405`, `:409`, `:410`, `:417`, `:420`, `:422`, `:427` | Section « L'entretien obligatoire de la climatisation » entièrement construite sur le seuil de 2 kg ; conclusion « la plupart des climatiseurs résidentiels ne sont donc pas légalement obligés d'être entretenus annuellement » | Réécriture intégrale de la section sur la base du décret n° 2020-912 et des articles R224-44 et suivants, avec citation de la source précise. | Critique |
| C-06 | `guide/index.html:582`, `:591`, `:593` (synthèse) | « Entretien annuel obligatoire si la charge dépasse 2 kg de fluide » ; « Contrôle d'étanchéité annuel pour les installations de 2 à 30 kg, semestriel au-delà » | Remplacer par les seuils réels : entretien tous les 2 ans dès 4 kW de puissance ; contrôle d'étanchéité dès 5 t éq. CO2. | Critique |
| C-07 | `guide/index.html:465`, `:467`, `:471` | « Règlement F-Gas européen (UE) 517/2014 […] Révisé par le règlement (UE) 2024/573 entré en vigueur en 2024, qui durcit encore les échéances. » | Le règlement (UE) 2024/573 **abroge et remplace** le 517/2014, il ne le « révise » pas. Reformuler : « Le règlement (UE) 2024/573 du 7 février 2024, applicable depuis le 11 mars 2024, a abrogé et remplacé le règlement (UE) n° 517/2014. » Mettre à jour le titre de la section. | Majeur |
| C-08 | `guide/index.html:438` à `:458` | Section « Arrêté du 16 avril 2010 : le contrôle d'étanchéité » | Référence à re-vérifier : le contenu de cet arrêté a été repris dans le code de l'environnement. **[À COMPLÉTER PAR ARTHUR : référence exacte à retenir]** — je recommande de citer le code de l'environnement plutôt que l'arrêté. Vérification prévue en début de phase 2. | Majeur |
| C-09 | `llms.txt:193` | « Réglementation applicable : réglementation française sur l'entretien des systèmes de climatisation, règlement européen F-Gas (UE) 517/2014 sur les fluides frigorigènes » | « décret n° 2020-912 du 28 juillet 2020 (entretien périodique des systèmes thermodynamiques de 4 à 70 kW), règlement (UE) 2024/573 (gaz à effet de serre fluorés) » | Majeur |
| C-10 | `climurgence.md:147` et suivantes (section « Réglementation applicable ») | Mêmes contenus obsolètes | Mêmes corrections | Majeur |
| C-11 | `index.html:566`, `:651`, `:887` ; `faq:897` ; libellés de navigation et d'option de formulaire | « Entretien annuel obligatoire » (libellé de service, option `<select>`, lien de pied de page) | « Entretien périodique réglementaire ». L'option de formulaire `entretien-annuel` peut conserver sa `value`, utilisée par `api/lead.js` ; seul le libellé affiché change. | Majeur |
| C-12 | `faq/index.html:597` et `:1105` | « Le R32 est le fluide frigorigène actuel, obligatoire pour les climatiseurs neufs depuis 2025. » | Affirmation non vérifiée en l'état. Le règlement 2024/573 fixe des interdictions de mise sur le marché par catégorie d'équipement et par PRP, avec des échéances échelonnées, et n'impose pas le R32 en tant que tel. Proposition : « Le R32 équipe aujourd'hui la quasi-totalité des climatiseurs neufs, son PRP étant nettement inférieur à celui du R410A. » **[À COMPLÉTER PAR ARTHUR : reformulation à valider]** | Majeur |
| C-13 | `guide/index.html:568` | « R22 : remplacement obligatoire, votre appareil ne peut plus être entretenu légalement. » | À vérifier et nuancer : le R22 est interdit à la mise sur le marché et à la recharge, mais un appareil existant peut continuer à fonctionner et être entretenu hors recharge. Proposition : « R22 : la recharge en fluide neuf ou recyclé est interdite. Un appareil au R22 encore fonctionnel peut être utilisé, mais toute fuite le rend irréparable : son remplacement est à prévoir. » | Majeur |

### Catégorie D — Tarifs

Sous le nouveau modèle, le prix est fixé et facturé par le partenaire. Aucun prix ne peut plus être présenté comme un tarif ferme de Clim Urgence.

| Réf | Fichier:ligne | Texte actuel | Remplacement proposé | Gravité |
|---|---|---|---|---|
| D-01 | `tarifs/index.html:482` | « Grille tarifaire publique. Tous nos prix de dépannage, entretien et installation de climatisation principaux sont affichés en toute transparence. Devis systématique avant toute réparation. » | « Prix indicatifs constatés auprès de nos partenaires. Le prix définitif figure sur le devis établi par le technicien partenaire avant toute intervention. » | Critique |
| D-02 | `tarifs/index.html:1046` | « Chez ClimUrgence, nous refusons les devis opaques et les mauvaises surprises. Tous nos forfaits principaux sont affichés publiquement… » | « Nous publions les fourchettes de prix constatées auprès de nos partenaires pour vous permettre d'anticiper votre budget. Le devis du technicien partenaire fait seul foi. » | Critique |
| D-03 | Toutes les pages affichant un prix : `tarifs` (18 prix), `entretien-climatisation`, `installation-climatisation`, `contrats-pro`, les 7 pages de ville (bloc « nos tarifs TTC publics »), `blog/code-erreur-e3-daikin:586`, `faq` | « nos tarifs TTC publics », « ClimUrgence propose un forfait […] à 199 € TTC », prix présentés comme fermes | Ajout de la mention D-01 sous chaque grille et remplacement de « nos tarifs » par « prix indicatifs constatés chez nos partenaires » | Critique |
| D-04 | `index.html:334-347` (JSON-LD `makesOffer`) et les 39 occurrences de « Déplacement offert » dans 15 fichiers | « Déplacement offert — Aucun frais de déplacement facturé sur toute la zone d'intervention » | Clim Urgence ne facture rien, donc ne peut rien offrir. Deux options : (a) supprimer la mention, (b) en faire une condition imposée aux partenaires : « Nos partenaires ne facturent pas de frais de déplacement. » **[À COMPLÉTER PAR ARTHUR : cette condition sera-t-elle contractuellement imposée aux partenaires ?]** | Critique |
| D-05 | 39 occurrences de « aucune majoration soir et week-end » / « sans majoration » dans 14 fichiers | Même raisonnement que D-04 | Même arbitrage **[À COMPLÉTER PAR ARTHUR]** | Critique |
| D-06 | `index.html:344-347` (JSON-LD) | « Devis gratuit et sans engagement — Devis verbal systématique avant toute réparation » | « Le technicien partenaire établit un devis avant toute intervention. » | Majeur |
| D-07 | `entretien-climatisation` : title et H1 « dès 119 € » ; `installation-climatisation` : meta « Pose dès 699 €, pack complet dès 1 249 € » ; `tarifs` : meta « dépannage dès 119 € » | Prix dans les balises title, meta et H1 | Ces prix peuvent rester s'ils sont présentés comme indicatifs. Proposition : ne pas toucher aux `<title>` ni aux H1 (préservation SEO) mais ajouter la mention D-01 au-dessus de chaque grille. À valider. | Majeur |
| D-08 | `contrats-pro/index.html` et `cgv/index.html:104` à `:157` | Abonnements Essentiel 25 €/mois et Premium 40 €/mois, vendus par Clim Urgence, avec prélèvement SEPA, durée ferme de 12 mois et prestations exécutées | **Point de modèle, pas seulement de rédaction.** Si Clim Urgence encaisse un abonnement et s'engage sur des visites de maintenance, elle n'est plus un simple intermédiaire mais un prestataire, et le reste du site la contredit. **[À COMPLÉTER PAR ARTHUR : les abonnements sont-ils maintenus, transférés aux partenaires, ou supprimés ?]** Tant que ce point n'est pas arbitré, la page `/contrats-pro/` ne peut pas être mise en cohérence. | Critique |

### Catégorie E — Données structurées (JSON-LD)

État des lieux : les 22 blocs sont **syntaxiquement valides**. Aucun `aggregateRating`, `ratingValue`, `reviewCount`, `Review`, `employee`, `numberOfEmployees` ni `award` n'est présent. Il n'y a donc **aucun avis ou note inventés à supprimer**.

| Réf | Fichier:ligne | Élément | Correction proposée | Gravité |
|---|---|---|---|---|
| E-01 | `index.html:58` | `HVACBusiness.description` : « Entreprise française de dépannage, entretien et installation de climatisation 7j/7 […] Intervention en moins d'1 heure à Marseille. Déplacement offert, aucune majoration… » | « Plateforme de mise en relation entre particuliers, professionnels et techniciens partenaires indépendants de la climatisation dans les Bouches-du-Rhône (13) et le Var (83). Standard joignable 7j/7 de 9h à 21h. » | Critique |
| E-02 | `index.html:232` | `slogan` : « Dépannage climatisation 7j/7 en moins d'1h » | Supprimer la propriété, ou : « Un technicien partenaire qualifié près de chez vous, 7j/7 » | Critique |
| E-03 | `index.html:381` | `WebPage.description` contenant « Intervention en moins d'1 heure à Marseille » | Aligner sur E-01 | Critique |
| E-04 | `index.html:398` à `:437` | `FAQPage` de la page d'accueil : les 4 questions reprennent les promesses de délai et l'affirmation des 2 kg | Réécrire les 4 réponses en miroir exact du texte visible corrigé (A-03, A-10, C-01) | Critique |
| E-05 | `index.html:236` à `:328` | `hasOfferCatalog` : cinq `Offer` avec `priceSpecification` chiffrée, `valueAddedTaxIncluded: true`, `availability: "https://schema.org/InStock"` et `provider` pointant vers `#business` | Le fournisseur de la prestation n'est plus Clim Urgence. **Recommandation** : conserver le catalogue (valeur SEO réelle), retirer `availability` (Clim Urgence ne détient pas de stock de prestation) et ajouter sur chaque `Offer` : `"description": "Prix indicatif constaté auprès des partenaires du réseau"`. | Majeur |
| E-06 | `index.html:332` à `:348` | `makesOffer` : « Déplacement offert », « Aucune majoration soir et week-end », « Devis gratuit et sans engagement » | Dépend de l'arbitrage D-04 et D-05 | Majeur |
| E-07 | `index.html:47` | `@type: "HVACBusiness"` | À conserver : Clim Urgence reste une entreprise locale de service. Changer le type ferait perdre l'éligibilité aux résultats locaux sans gain de conformité. La conformité passe par la `description`, pas par le type. **Recommandation : ne pas modifier.** | Pour information |
| E-08 | Les 7 pages de ville, bloc `FAQPage` (`marseille:518-521`, `aubagne:516-519`, `aix:537-540`, `la-ciotat:516-519`, `vitrolles:516-519`, `toulon:525-528`, `hyeres:516-519`) | Réponses « délai d'intervention » chiffrées | Aligner sur A-23 | Critique |
| E-09 | `zone-intervention/index.html:95` | `FAQPage` : « Le délai moyen d'intervention est de 1 heure pour Marseille… » | Aligner sur A-25 | Critique |
| E-10 | `faq/index.html:511-512`, `:602`, `:606-607`, `:677` | `FAQPage` : entretien 2 kg, disponibilité, délais, « réponse garantie sous 30 minutes » | Aligner sur C-04 et A-16 | Critique |
| E-11 | `contrats-pro/index.html:213`, `:270` | `description` et liste de prestations mentionnant « intervention garantie sous 4h » | Dépend de l'arbitrage A-15 | Critique |
| E-12 | `tarifs/index.html:51` | `OfferCatalog.description` : « Grille tarifaire transparente ClimUrgence 2026. Tous les prix affichés sont en TTC, déplacement inclus, aucune majoration soir ou week-end. » | Aligner sur D-01 | Critique |
| E-13 | Nouveau | `/notre-reseau/` | Ajouter un bloc `@graph` avec `AboutPage` et `BreadcrumbList`, plus `FAQPage` si la page comporte une FAQ, rattaché à `https://climurgence.com/#business` | Création |
| E-14 | Nouveau | `/devenir-partenaire/` | Ajouter un bloc `@graph` avec `WebPage` et `BreadcrumbList` | Création |
| E-15 | `depannage-clim-toulon/index.html:569` | `WebPage.name` : « Dépannage Climatisation Toulon — Intervention Express 7j/7 » | Aligner sur le nouveau `<title>` (A-13) | Majeur |

### Catégorie F — Pages légales

| Réf | Fichier:ligne | Constat | Correction proposée | Gravité |
|---|---|---|---|---|
| F-01 | `confidentialite/index.html:123` | « Vos données sont strictement réservées à l'usage interne de ClimUrgence. Elles ne sont ni vendues, ni louées, ni transférées à des tiers commerciaux. » | **Faux sous le nouveau modèle, et bloquant.** Nouvelle rédaction : « Vos coordonnées et la description de votre demande sont transmises au technicien partenaire indépendant chargé de traiter votre demande. Ce partenaire est destinataire des données pour l'exécution de la prestation qu'il vous facture. Sont également destinataires nos sous-traitants techniques (hébergeur, service d'envoi d'e-mails). Vos données ne sont ni vendues ni louées. » | Critique |
| F-02 | `confidentialite/index.html:105` à `:111` | Finalités : ne mentionnent ni la mise en relation, ni le suivi de satisfaction | Ajouter : « Transmettre votre demande à un technicien partenaire de votre secteur » et « Vous rappeler après l'intervention pour vérifier votre satisfaction » | Critique |
| F-03 | `confidentialite/index.html:87` et `:88` ; `cgv/index.html:83` ; `cgv/index.html:188` ; `llms.txt:8` | « ClimUrgence (SASU en cours d'immatriculation) » et « Adresse : communiquée sur demande » | **Contredit `/mentions-legales/`**, qui indique désormais SAS CLIMURGENCE, capital 120 euros, siège 5 Avenue Edouard Branly 13009 Marseille, RCS Marseille 105 205 645, SIREN 105 205 645, TVA FR93105205645. Aligner les quatre emplacements sur les mentions légales. | Critique |
| F-04 | `mentions-legales/index.html:82` à `:93` | L'activité n'est pas décrite | Ajouter : « Activité : mise en relation entre des clients et des techniciens et installateurs partenaires indépendants en climatisation, dans les Bouches-du-Rhône et le Var. Clim Urgence ne réalise pas elle-même les prestations techniques. » | Critique |
| F-05 | `cgv/index.html` (intégralité) | CGV de vente de prestations en propre : objet (art. 1), prix et paiement (art. 4), garantie de main-d'œuvre donnée par Clim Urgence (art. 7), délais garantis (art. 6), responsabilité limitée au montant de la prestation facturée (art. 9) | Remplacement par des **Conditions générales d'utilisation du service de mise en relation** : objet du service, gratuité pour le client, rôle de Clim Urgence limité à la mise en relation, contrat de prestation conclu entre le client et le partenaire, partenaire seul responsable de l'exécution et de la garantie de ses travaux, traitement des réclamations, données personnelles, droit applicable, médiation. | Critique |
| F-06 | `cgv/index.html:183` | « Conformément à l'article L612-1 du Code de la consommation, le Client particulier peut recourir gratuitement à un médiateur de la consommation » — sans nommer le médiateur | Le professionnel doit communiquer les **coordonnées** du médiateur compétent et l'adresse de son site. **[À COMPLÉTER PAR ARTHUR : médiateur de la consommation choisi, adresse postale et site web]** | Critique |
| F-07 | URL `/cgv/` | Conserver l'URL ou rediriger vers `/cgu/` ? | **Recommandation : conserver `/cgv/`.** Elle est indexée, référencée dans le pied de page des 22 pages, dans `sitemap.xml` et dans `llms.txt`. Changer d'URL imposerait 22 modifications de liens, une redirection 301 supplémentaire et une perte transitoire de signal, pour un gain nul. On change le `<title>`, le H1 et le contenu, on garde l'URL. Si Arthur préfère `/cgu/`, il faut créer `/cgu/`, ajouter une redirection 301 dans `vercel.json`, et mettre à jour les 22 pieds de page, le sitemap et `llms.txt`. | Décision |
| F-08 | `confidentialite/index.html:127` à `:129` | Durées de conservation : prospects 3 ans, clients 5 ans, facturation 10 ans | À conserver, mais préciser que Clim Urgence, ne facturant pas le client, n'a pas de données de facturation client : la ligne « Données de facturation : 10 ans » doit être reformulée ou supprimée. | Majeur |
| F-09 | `confidentialite/index.html:117` | Base légale : « Votre consentement explicite (formulaire de contact) » | La transmission au partenaire relève plutôt de l'exécution de mesures précontractuelles. À préciser. | Majeur |
| F-10 | Aucune page | Absence d'information de plateforme au sens de l'article L111-7 | Création de `/notre-reseau/` (section 4.2) | Critique |

### Catégorie G — Aides et subventions

**Aucune non-conformité.** Recherche effectuée sur l'ensemble du dépôt pour : `RGE`, `MaPrimeRénov`, `CEE`, `prime énergie`, `crédit d'impôt`, `aide`, `subvention`, `Rénov`, `TVA 5,5`, `taux réduit`, `éco-prêt`, `ANAH`, `certificat d'économie`.

Deux occurrences du mot « aide », toutes deux hors sujet :

- `guide/index.html:601` : « Besoin d'aide pour être en règle ? » (titre d'appel à l'action)
- `entretien-climatisation/index.html:590` : « Cela aide le technicien à cibler son diagnostic. »

Une occurrence de « Rénov » dans `climurgence.md:180`, dans le nom d'une entreprise concurrente citée (« Rénov au Carré »).

Aucune action requise. Point à re-vérifier en phase 3 après réécriture.

### Catégorie H — Hors nomenclature : emojis présents dans le dépôt

La règle 1 interdit tout emoji. Le dépôt en contient aujourd'hui.

| Fichier:ligne | Caractère | Contexte | Gravité |
|---|---|---|---|
| `js/main.js:14` | soleil, croissant de lune | Libellé du bouton de bascule de thème, **visible par les visiteurs** | Majeur |
| `js/main.js:32`, `:126` | panneau d'avertissement | Message d'erreur du formulaire, **visible par les visiteurs** | Majeur |
| `api/lead.js:174`, `:175`, `:176`, `:178`, `:199` | buste, téléphone, enveloppe, boîte aux lettres, presse-papiers | Corps de l'e-mail interne envoyé à Arthur, non visible du public | Mineur |
| `README.md` : 14 occurrences | divers | Documentation interne, non publiée | Mineur |

Les flèches typographiques et le caractère de coche présents dans `css/style.css`, `contact/index.html`, `faq/index.html`, `zone-intervention/index.html` et `blog/index.html` **ne sont pas des emojis** : ce sont des signes typographiques Unicode. Je propose de les conserver.

Le remplacement du bouton de thème par un libellé textuel ou une icône SVG reste à valider. **[À COMPLÉTER PAR ARTHUR : faut-il retirer les emojis de `js/main.js` et `api/lead.js` ?]**

---

## 4. NOUVEAUX ÉLÉMENTS À CRÉER

### 4.1 Section « Comment ça marche » sur la page d'accueil

- **Fichier** : `index.html`
- **Emplacement** : nouvelle `<section>` insérée entre la fermeture de la section `.hero` (ligne 522) et l'ouverture de la section `#formulaire` (ligne 527)
- **Contenu** : quatre étapes numérotées
  1. Vous nous appelez au 06 43 72 18 50 ou remplissez le formulaire. Standard joignable 7j/7 de 9h à 21h.
  2. Nous qualifions votre demande et sélectionnons un technicien partenaire qualifié de votre secteur.
  3. Il intervient, établit son devis et vous facture directement.
  4. Nous vous rappelons après l'intervention pour vérifier que tout s'est bien passé.
- **Lien** : vers `/notre-reseau/` en fin de section
- **CSS** : réutilisation des classes existantes `.section`, `.section-header`, `.services-grid`, `.service-card` pour éviter d'ajouter du style

### 4.2 Page `/notre-reseau/`

- **Fichier à créer** : `notre-reseau/index.html`
- **Title proposé** : « Notre réseau de techniciens partenaires \| Clim Urgence »
- **H1** : « Notre réseau de techniciens partenaires »
- **Canonical** : `https://climurgence.com/notre-reseau/`
- **Sections** :
  1. Comment fonctionne la mise en relation
  2. Critères de sélection des partenaires : entreprise immatriculée ; attestation de capacité pour la manipulation des fluides frigorigènes ; assurance responsabilité civile professionnelle ; assurance décennale pour les travaux de pose ; suivi de la satisfaction client après chaque intervention
  3. Suivi qualité après chaque intervention
  4. Rémunération de Clim Urgence : commission versée par le partenaire, sans surcoût pour le client
  5. En cas de réclamation : le client contacte Clim Urgence, qui fait le lien avec le partenaire
- **Rôle juridique** : cette page porte l'information exigée par l'article L111-7 du code de la consommation (qualité de l'intermédiaire, critères de référencement, existence d'une rémunération)
- **Liens entrants à créer** : menu principal des 22 pages, pied de page des 22 pages, section « Comment ça marche » de l'accueil
- **JSON-LD** : `AboutPage` et `BreadcrumbList`
- **Sitemap** : nouvelle entrée, priorité 0.8

### 4.3 Page `/devenir-partenaire/`

- **Fichier à créer** : `devenir-partenaire/index.html`
- **Title proposé** : « Techniciens et installateurs : rejoignez le réseau Clim Urgence »
- **H1** : identique au title, sans suffixe de marque
- **Canonical** : `https://climurgence.com/devenir-partenaire/`
- **Indexable** : oui (`robots: index, follow`)
- **Sections** : zone couverte (13 et 83) ; principe (des demandes de pose, dépannage et entretien sur votre secteur, vous ne payez rien tant que vous n'avez pas travaillé) ; rémunération sous forme de commission, sans afficher les montants ; documents requis (Kbis, attestation de capacité fluides frigorigènes, RC pro, décennale pour la pose) ; formulaire de candidature
- **Formulaire** : classe `.form-devis`, attribut `data-lead-type="partenaire"`, champs `nom`, `prenom`, `societe`, `siren`, `telephone`, `email`, `zones`, `activites` (pose / dépannage / entretien), `message`. Les champs `nom`, `telephone` et `email` doivent rester obligatoires : `api/lead.js` les exige (lignes 296 à 306).
- **Modification associée de `api/lead.js`** : ajout d'une entrée `partenaire` dans `TYPE_DEFS`, d'une règle dans `deriveDisplayType()` et de l'affichage des champs `societe`, `siren`, `zones`, `activites` dans le corps HTML et texte de l'e-mail. Sans cela, ces champs seraient transmis mais absents du récapitulatif reçu par Arthur.
- **Liens entrants** : pied de page des 22 pages
- **JSON-LD** : `WebPage` et `BreadcrumbList`
- **Sitemap** : nouvelle entrée, priorité 0.6

### 4.4 Mention dans le pied de page des 22 pages

- **Emplacement** : bloc `.footer-bottom`, présent à l'identique dans les 22 fichiers
- **Texte** : « Clim Urgence met en relation ses clients avec des techniciens partenaires indépendants, qualifiés et assurés, qui réalisent et facturent les prestations. »
- **À ajouter également** dans la colonne « Ressources » ou « Légal » du pied de page : les liens vers `/notre-reseau/` et `/devenir-partenaire/`

### 4.5 Pages légales

Voir catégorie F. Trois fichiers à reprendre : `mentions-legales/index.html` (ajout d'une ligne d'activité), `cgv/index.html` (remplacement complet du contenu, URL conservée), `confidentialite/index.html` (destinataires, finalités, bases légales, durées).

### 4.6 Fichiers IA et techniques

| Fichier | Action |
|---|---|
| `llms.txt` | Réécriture du chapeau, de la section « Engagements qualité », suppression du tableau des délais, mise à jour des FAQ, des références réglementaires et de la liste des pages. Structure conservée. |
| `climurgence.md` | Mêmes corrections. Ce fichier est exposé publiquement (`vercel.json` lui sert un `Content-Type: text/markdown`, il est déclaré dans `sitemap.xml` et signalé dans `robots.txt`). Il ne doit pas être oublié. |
| `sitemap.xml` | Ajout de `/notre-reseau/` et `/devenir-partenaire/`, mise à jour des `lastmod` des pages modifiées |
| `humans.txt` | Mise à jour de la ligne « Équipe ClimUrgence » |
| `robots.txt` | Aucune modification nécessaire |
| `vercel.json` | Aucune modification nécessaire, sauf si l'option `/cgu/` est retenue (voir F-07) |
| `README.md` | Mise à jour de l'arborescence pour y intégrer les deux nouvelles pages |

---

## 5. SOURCES RÉGLEMENTAIRES CONSULTÉES

| Référence | Objet | Source consultée |
|---|---|---|
| Articles R224-44 à R224-44-5 du code de l'environnement | Entretien des systèmes thermodynamiques de 4 kW à 70 kW : périodicité maximale de deux ans, qualification requise, attestation sous quinze jours, exclusions | Légifrance, section consolidée LEGISCTA000042166007 |
| Décret n° 2020-912 du 28 juillet 2020 | Inspection et entretien des chaudières, des systèmes de chauffage et des systèmes de climatisation — texte source des articles ci-dessus | Légifrance, JORFTEXT000042164734 |
| Articles R224-45 et R224-45-2 du code de l'environnement | Inspection périodique des systèmes de climatisation et pompes à chaleur de plus de 70 kW, tous les cinq ans (dix ans si ISO 50001) | Légifrance, JORFTEXT000042164734 |
| Règlement (UE) 2024/573 du 7 février 2024, article 5 | Contrôles d'étanchéité : seuil de 5 tonnes équivalent CO2, fréquences de 12 / 6 / 3 mois, doublement avec détecteur de fuites, exemption des équipements hermétiquement scellés sous 10 tonnes équivalent CO2. Abroge le règlement (UE) n° 517/2014, applicable depuis le 11 mars 2024. | EUR-Lex, JO L 2024/573 |
| Article L111-7 du code de la consommation | Obligation d'information des opérateurs de plateforme en ligne : conditions générales d'utilisation et modalités de référencement ; existence d'une relation contractuelle, d'un lien capitalistique ou d'une rémunération ; qualité des annonceurs et droits et obligations des parties | Légifrance, LEGIARTI000033219601 |
| Article L121-2 du code de la consommation | Pratiques commerciales trompeuses | Référence citée, non re-vérifiée en ligne (article notoire, non modifié) |
| Obligation de médiation de la consommation | Communication des coordonnées du médiateur compétent et de l'adresse de son site | Référence à re-vérifier avant rédaction des CGU |

Points réglementaires **non vérifiés** à ce stade, signalés comme tels dans le tableau C : le statut exact de l'arrêté du 16 avril 2010 (C-08), l'affirmation sur le caractère obligatoire du R32 depuis 2025 (C-12), et le régime du R22 (C-13). Ils seront vérifiés en début de phase 2, avant réécriture.

---

## 6. SYNTHÈSE DES DÉCISIONS ET INFORMATIONS ATTENDUES

### 6.1 Informations manquantes — [À COMPLÉTER PAR ARTHUR]

1. **Médiateur de la consommation** : organisme choisi, adresse postale, site web. Obligatoire dans les CGU. (F-06)
2. **Abonnements `/contrats-pro/`** : maintenus tels quels, transférés aux partenaires, ou supprimés ? Qui encaisse, qui exécute, qui garantit ? Sans réponse, cette page reste incohérente avec le reste du site. (D-08)
3. **« Intervention garantie sous 4h » de la formule Premium** : engagement supprimé, requalifié en priorité de traitement, ou imposé contractuellement aux partenaires ? (A-15)
4. **« Déplacement offert »** : condition imposée aux partenaires, ou mention à supprimer ? (D-04)
5. **« Aucune majoration soir et week-end »** : même question. (D-05)
6. **SMS de prévenance 30 minutes avant l'arrivée** : pratique imposée aux partenaires ou retirée du site ? (A-17)
7. **Emojis de `js/main.js` (bouton de thème, messages d'erreur) et de `api/lead.js` (e-mail interne)** : à remplacer ou à conserver ? (catégorie H)
8. **URL des conditions générales** : conserver `/cgv/` (recommandé) ou créer `/cgu/` avec redirection 301 ? (F-07)
9. **Reformulation C-12 (R32 obligatoire depuis 2025)** à valider après vérification.
10. **Délai de référence à afficher** : je propose « généralement sous 24 à 48 h selon les disponibilités », conformément à la directive de la section 5.1 du brief. À confirmer, car cette fourchette doit être réellement tenable par le réseau.

### 6.2 Décisions techniques recommandées

| Sujet | Recommandation |
|---|---|
| Type JSON-LD `HVACBusiness` | Conserver. La conformité passe par la `description`, pas par le type. |
| URL `/cgv/` | Conserver, changer uniquement le titre et le contenu. |
| Catalogue d'offres JSON-LD | Conserver, en retirant `availability: InStock` et en ajoutant une mention « prix indicatif ». |
| Canonical, sitemap, `llms.txt`, clé IndexNow | Conserver à l'identique, hors ajout des deux nouvelles pages. |
| Structure Hn | Conservée partout ; seuls les libellés changent. |

### 6.3 Balises `title`, `meta description` et `H1` qui devront être modifiées

La règle 3 demande de ne pas casser le référencement. Les balises suivantes contiennent une promesse non tenable et **doivent** donc être modifiées, par exception :

| Page | Élément | Motif |
|---|---|---|
| `/` | `title`, `meta description`, `og:description`, `twitter:description` | « Intervention en moins d'1h » |
| `/depannage-clim-marseille/` | `title`, `meta description`, `og:description`, `twitter:description`, `H1` | « Intervention 1h », « moins d'1h » |
| `/depannage-clim-aix-en-provence/` | `title`, `meta description`, `og:description`, `twitter:description`, `H1` | « Intervention 1h », « environ 1h ». Le H1 annonce « moins d'1h » alors que le corps de la page indique « environ 1 heure » : contradiction interne existante. |
| `/depannage-clim-aubagne/` | `title`, `meta description`, `og:description`, `twitter:description`, `H1` | « moins d'1h » |
| `/depannage-clim-la-ciotat/` | `title`, `meta description`, `og:description`, `twitter:description`, `H1` | « moins d'1h », « intervention express » |
| `/depannage-clim-vitrolles/` | `title`, `meta description`, `og:description`, `twitter:description` | « Intervention 1h », « environ 1h » |
| `/depannage-clim-toulon/` | `title`, `og:title`, `twitter:title`, `meta description`, `og:description`, `twitter:description` | « Intervention Express », « 1 à 1h30 » |
| `/depannage-clim-hyeres/` | `meta description`, `og:description`, `twitter:description` | « Intervention 1 à 1h30 » |
| `/zone-intervention/` | `meta description`, `twitter:description` | « Délai d'intervention sous 1h30 » |
| `/contrats-pro/` | `meta description` | « Intervention prioritaire garantie » |
| `/cgv/` | `title`, `meta description`, `H1` | Changement d'objet du document |
| `/tarifs/` | `meta description` | « Déplacement offert, sans majoration » — selon arbitrage D-04 et D-05 |

Les H1 de `/entretien-climatisation/`, `/installation-climatisation/`, `/tarifs/`, `/faq/`, `/guide/`, `/blog/`, `/contact/`, `/mentions-legales/`, `/confidentialite/` et des deux articles de blog **ne sont pas modifiés**.

### 6.4 Plan de commits proposé pour la phase 2

Branche `conformite-reseau-partenaires`, commits atomiques :

1. `docs: audit de conformité au modèle réseau de partenaires`
2. `fix(legal): politique de confidentialité — partenaires destinataires des données`
3. `feat(legal): CGU du service de mise en relation en remplacement des CGV`
4. `fix(legal): mentions légales — activité d'intermédiation`
5. `feat(pages): page /notre-reseau/ (information plateforme, art. L111-7)`
6. `feat(pages): page /devenir-partenaire/ et formulaire de candidature`
7. `feat(api): catégorie partenaire dans le récapitulatif de lead`
8. `feat(accueil): section Comment ça marche`
9. `fix(contenu): suppression des promesses de délai sur toutes les pages`
10. `fix(contenu): techniciens partenaires au lieu de techniciens internes`
11. `fix(contenu): correction des seuils réglementaires entretien et étanchéité`
12. `fix(tarifs): prix présentés comme indicatifs`
13. `fix(seo): correction des données structurées JSON-LD`
14. `fix(footer): mention d'intermédiation et liens vers les nouvelles pages`
15. `chore(ia): mise à jour de llms.txt et climurgence.md`
16. `chore(seo): mise à jour du sitemap`
17. `docs: rapport de conformité`

---

## 7. ANNEXE — LISTE EXHAUSTIVE DES OCCURRENCES PAR MOTIF

Relevé automatique sur l'ensemble du dépôt, hors `.git`, `img/`, `.claude/` et `README.md`. Les codes renvoient aux catégories de la section 3.

- **A1** (`moins d'?1 ?h|moins d'1 heure|Moins d'1 heure|moins de 1 ?h`) — 70 occurrence(s) : llms.txt:3, llms.txt:78, llms.txt:79, llms.txt:80, llms.txt:81, llms.txt:82, llms.txt:83, llms.txt:84, llms.txt:120, llms.txt:184, index.html:7, index.html:14, index.html:22, index.html:58, index.html:232, index.html:381, index.html:410, index.html:638, index.html:811, climurgence.md:21, climurgence.md:78, climurgence.md:79, climurgence.md:80, climurgence.md:81, climurgence.md:82, climurgence.md:83, climurgence.md:84, climurgence.md:121, climurgence.md:182, depannage-clim-aubagne/index.html:7, depannage-clim-aubagne/index.html:13, depannage-clim-aubagne/index.html:20, depannage-clim-aubagne/index.html:413, depannage-clim-aubagne/index.html:519, depannage-clim-aubagne/index.html:607, depannage-clim-aubagne/index.html:609, depannage-clim-aubagne/index.html:612, depannage-clim-aubagne/index.html:753, faq/index.html:607, faq/index.html:1138, zone-intervention/index.html:334, zone-intervention/index.html:352, zone-intervention/index.html:361, zone-intervention/index.html:370, zone-intervention/index.html:415, zone-intervention/index.html:424, zone-intervention/index.html:433, blog/clim-souffle-chaud/index.html:698, blog/clim-souffle-chaud/index.html:750, depannage-clim-aix-en-provence/index.html:628, contrats-pro/index.html:488, depannage-clim-marseille/index.html:7, depannage-clim-marseille/index.html:13, depannage-clim-marseille/index.html:20, depannage-clim-marseille/index.html:413, depannage-clim-marseille/index.html:521, depannage-clim-marseille/index.html:579, depannage-clim-marseille/index.html:581, depannage-clim-marseille/index.html:584, depannage-clim-marseille/index.html:593, depannage-clim-marseille/index.html:759, depannage-clim-marseille/index.html:794, depannage-clim-la-ciotat/index.html:7, depannage-clim-la-ciotat/index.html:13, depannage-clim-la-ciotat/index.html:20, depannage-clim-la-ciotat/index.html:413, depannage-clim-la-ciotat/index.html:519, depannage-clim-la-ciotat/index.html:609, depannage-clim-la-ciotat/index.html:612, depannage-clim-la-ciotat/index.html:749
- **A2** (`1h30|1 à 1h30|1 heure à 1h30`) — 60 occurrence(s) : llms.txt:88, llms.txt:89, llms.txt:90, llms.txt:94, llms.txt:95, llms.txt:96, llms.txt:99, llms.txt:100, llms.txt:101, llms.txt:102, llms.txt:103, index.html:410, index.html:811, climurgence.md:88, climurgence.md:89, climurgence.md:90, climurgence.md:94, climurgence.md:95, climurgence.md:96, climurgence.md:99, climurgence.md:100, climurgence.md:101, climurgence.md:102, climurgence.md:103, climurgence.md:121, cgv/index.html:185, faq/index.html:617, faq/index.html:1158, depannage-clim-toulon/index.html:7, depannage-clim-toulon/index.html:13, depannage-clim-toulon/index.html:20, depannage-clim-toulon/index.html:413, depannage-clim-toulon/index.html:528, depannage-clim-toulon/index.html:618, depannage-clim-toulon/index.html:621, depannage-clim-toulon/index.html:776, zone-intervention/index.html:7, zone-intervention/index.html:21, zone-intervention/index.html:95, zone-intervention/index.html:98, zone-intervention/index.html:379, zone-intervention/index.html:388, zone-intervention/index.html:442, zone-intervention/index.html:455, zone-intervention/index.html:464, zone-intervention/index.html:473, zone-intervention/index.html:500, zone-intervention/index.html:509, zone-intervention/index.html:518, zone-intervention/index.html:527, zone-intervention/index.html:536, contrats-pro/index.html:488, depannage-clim-hyeres/index.html:7, depannage-clim-hyeres/index.html:13, depannage-clim-hyeres/index.html:20, depannage-clim-hyeres/index.html:413, depannage-clim-hyeres/index.html:519, depannage-clim-hyeres/index.html:609, depannage-clim-hyeres/index.html:612, depannage-clim-hyeres/index.html:763
- **A3** (`environ 1 ?h|environ 1 heure`) — 24 occurrence(s) : llms.txt:85, llms.txt:86, llms.txt:87, llms.txt:120, index.html:410, climurgence.md:85, climurgence.md:86, climurgence.md:87, climurgence.md:121, depannage-clim-vitrolles/index.html:7, depannage-clim-vitrolles/index.html:13, depannage-clim-vitrolles/index.html:20, depannage-clim-vitrolles/index.html:413, depannage-clim-vitrolles/index.html:609, depannage-clim-vitrolles/index.html:612, zone-intervention/index.html:343, zone-intervention/index.html:397, depannage-clim-aix-en-provence/index.html:7, depannage-clim-aix-en-provence/index.html:13, depannage-clim-aix-en-provence/index.html:20, depannage-clim-aix-en-provence/index.html:413, depannage-clim-aix-en-provence/index.html:630, depannage-clim-aix-en-provence/index.html:633, contrats-pro/index.html:488
- **A4** (`express`) — 6 occurrence(s) : index.html:504, climurgence.md:174, cgv/index.html:114, cgv/index.html:193, cgv/index.html:194, depannage-clim-la-ciotat/index.html:607
- **A5** (`garanti`) — 46 occurrence(s) : llms.txt:120, index.html:532, index.html:638, climurgence.md:21, entretien-climatisation/index.html:933, entretien-climatisation/index.html:953, guide/index.html:432, guide/index.html:509, cgv/index.html:7, cgv/index.html:13, cgv/index.html:21, cgv/index.html:139, cgv/index.html:188, cgv/index.html:189, cgv/index.html:190, contact/index.html:517, tarifs/index.html:866, faq/index.html:482, faq/index.html:512, faq/index.html:567, faq/index.html:607, faq/index.html:677, faq/index.html:836, faq/index.html:909, faq/index.html:1032, faq/index.html:1138, faq/index.html:1304, depannage-clim-toulon/index.html:560, depannage-clim-toulon/index.html:804, installation-climatisation/index.html:595, installation-climatisation/index.html:910, installation-climatisation/index.html:914, installation-climatisation/index.html:915, installation-climatisation/index.html:917, blog/code-erreur-e3-daikin/index.html:448, blog/code-erreur-e3-daikin/index.html:725, blog/code-erreur-e3-daikin/index.html:727, contrats-pro/index.html:7, contrats-pro/index.html:213, contrats-pro/index.html:270, contrats-pro/index.html:358, contrats-pro/index.html:478, contrats-pro/index.html:484, contrats-pro/index.html:504, depannage-clim-marseille/index.html:521, depannage-clim-marseille/index.html:759
- **A6** (`30 minutes`) — 15 occurrence(s) : index.html:532, contact/index.html:441, contact/index.html:465, contact/index.html:517, contact/index.html:550, contact/index.html:623, contact/index.html:682, contact/index.html:712, faq/index.html:497, faq/index.html:677, faq/index.html:866, faq/index.html:1304, blog/code-erreur-e3-daikin/index.html:557, blog/code-erreur-e3-daikin/index.html:586, blog/clim-souffle-chaud/index.html:593
- **A7** (`5 minutes`) — 20 occurrence(s) : llms.txt:46, llms.txt:47, llms.txt:51, index.html:825, entretien-climatisation/index.html:976, depannage-clim-vitrolles/index.html:519, depannage-clim-vitrolles/index.html:749, faq/index.html:527, faq/index.html:602, faq/index.html:939, faq/index.html:1128, faq/index.html:1315, blog/code-erreur-e3-daikin/index.html:434, blog/code-erreur-e3-daikin/index.html:436, blog/code-erreur-e3-daikin/index.html:637, blog/code-erreur-e3-daikin/index.html:639, blog/clim-souffle-chaud/index.html:568, blog/clim-souffle-chaud/index.html:593, depannage-clim-la-ciotat/index.html:519, depannage-clim-la-ciotat/index.html:749
- **A8** (`sous 2h|moins de 2h`) — 1 occurrence(s) : index.html:638
- **A9** (`sous 4 heures|sous 4h`) — 19 occurrence(s) : llms.txt:72, climurgence.md:70, climurgence.md:176, entretien-climatisation/index.html:933, cgv/index.html:139, depannage-clim-vitrolles/index.html:551, depannage-clim-vitrolles/index.html:673, depannage-clim-vitrolles/index.html:777, tarifs/index.html:991, faq/index.html:647, faq/index.html:1244, depannage-clim-toulon/index.html:560, depannage-clim-toulon/index.html:804, contrats-pro/index.html:213, contrats-pro/index.html:270, contrats-pro/index.html:406, contrats-pro/index.html:478, contrats-pro/index.html:488, depannage-clim-la-ciotat/index.html:670
- **B1** (`[Nn]os techniciens`) — 57 occurrence(s) : index.html:503, index.html:870, entretien-climatisation/index.html:709, contact/index.html:517, contact/index.html:659, contact/index.html:730, depannage-clim-vitrolles/index.html:519, depannage-clim-vitrolles/index.html:609, depannage-clim-vitrolles/index.html:621, depannage-clim-vitrolles/index.html:659, depannage-clim-vitrolles/index.html:730, depannage-clim-vitrolles/index.html:749, depannage-clim-vitrolles/index.html:784, depannage-clim-aubagne/index.html:519, depannage-clim-aubagne/index.html:609, depannage-clim-aubagne/index.html:621, depannage-clim-aubagne/index.html:662, depannage-clim-aubagne/index.html:733, depannage-clim-aubagne/index.html:753, depannage-clim-aubagne/index.html:788, faq/index.html:587, faq/index.html:617, faq/index.html:1085, faq/index.html:1158, depannage-clim-toulon/index.html:618, depannage-clim-toulon/index.html:630, depannage-clim-toulon/index.html:680, depannage-clim-toulon/index.html:756, depannage-clim-toulon/index.html:811, installation-climatisation/index.html:714, blog/index.html:394, blog/index.html:443, blog/code-erreur-e3-daikin/index.html:735, blog/clim-souffle-chaud/index.html:750, depannage-clim-aix-en-provence/index.html:540, depannage-clim-aix-en-provence/index.html:630, depannage-clim-aix-en-provence/index.html:684, depannage-clim-aix-en-provence/index.html:688, depannage-clim-aix-en-provence/index.html:760, depannage-clim-aix-en-provence/index.html:783, depannage-clim-aix-en-provence/index.html:818, depannage-clim-marseille/index.html:581, depannage-clim-marseille/index.html:675, depannage-clim-marseille/index.html:694, depannage-clim-marseille/index.html:773, depannage-clim-la-ciotat/index.html:609, depannage-clim-la-ciotat/index.html:621, depannage-clim-la-ciotat/index.html:661, depannage-clim-la-ciotat/index.html:732, depannage-clim-la-ciotat/index.html:784, depannage-clim-hyeres/index.html:519, depannage-clim-hyeres/index.html:609, depannage-clim-hyeres/index.html:621, depannage-clim-hyeres/index.html:668, depannage-clim-hyeres/index.html:744, depannage-clim-hyeres/index.html:763, depannage-clim-hyeres/index.html:798
- **B2** (`[Nn]otre équipe`) — 1 occurrence(s) : faq/index.html:1315
- **B3** (`un technicien|le technicien|nos frigoristes`) — 19 occurrence(s) : index.html:825, entretien-climatisation/index.html:578, entretien-climatisation/index.html:590, entretien-climatisation/index.html:983, entretien-climatisation/index.html:1004, cgv/index.html:125, faq/index.html:602, faq/index.html:1128, depannage-clim-toulon/index.html:528, depannage-clim-toulon/index.html:776, blog/code-erreur-e3-daikin/index.html:447, blog/code-erreur-e3-daikin/index.html:718, depannage-clim-aix-en-provence/index.html:540, depannage-clim-aix-en-provence/index.html:783, depannage-clim-marseille/index.html:593, depannage-clim-la-ciotat/index.html:519, depannage-clim-la-ciotat/index.html:749, depannage-clim-hyeres/index.html:519, depannage-clim-hyeres/index.html:763
- **B4** (`ClimUrgence (intervient|répare|réalise|installe|couvre|est votre spécialiste)`) — 47 occurrence(s) : llms.txt:107, llms.txt:114, llms.txt:116, llms.txt:140, llms.txt:152, index.html:407, index.html:415, index.html:423, index.html:434, index.html:626, index.html:804, index.html:818, index.html:839, index.html:853, climurgence.md:107, climurgence.md:115, entretien-climatisation/index.html:709, guide/index.html:427, guide/index.html:602, depannage-clim-vitrolles/index.html:609, depannage-clim-aubagne/index.html:609, faq/index.html:547, faq/index.html:587, faq/index.html:602, faq/index.html:612, faq/index.html:617, faq/index.html:622, faq/index.html:992, faq/index.html:1085, faq/index.html:1128, faq/index.html:1148, faq/index.html:1158, faq/index.html:1168, depannage-clim-toulon/index.html:618, installation-climatisation/index.html:714, zone-intervention/index.html:7, zone-intervention/index.html:21, zone-intervention/index.html:94, zone-intervention/index.html:96, zone-intervention/index.html:98, zone-intervention/index.html:326, depannage-clim-aix-en-provence/index.html:630, depannage-clim-marseille/index.html:526, depannage-clim-marseille/index.html:581, depannage-clim-marseille/index.html:593, depannage-clim-la-ciotat/index.html:609, depannage-clim-hyeres/index.html:609
- **B5** (`[Nn]ous intervenons|[Nn]ous réalisons|[Nn]ous installons|[Nn]ous réparons|[Nn]ous avons des techniciens`) — 36 occurrence(s) : index.html:745, entretien-climatisation/index.html:990, depannage-clim-vitrolles/index.html:527, depannage-clim-vitrolles/index.html:680, depannage-clim-vitrolles/index.html:756, tarifs/index.html:1047, tarifs/index.html:1055, depannage-clim-aubagne/index.html:551, depannage-clim-aubagne/index.html:609, depannage-clim-aubagne/index.html:683, depannage-clim-aubagne/index.html:781, depannage-clim-toulon/index.html:618, depannage-clim-toulon/index.html:699, depannage-clim-toulon/index.html:706, installation-climatisation/index.html:630, installation-climatisation/index.html:915, installation-climatisation/index.html:962, zone-intervention/index.html:545, blog/clim-souffle-chaud/index.html:698, depannage-clim-aix-en-provence/index.html:548, depannage-clim-aix-en-provence/index.html:630, depannage-clim-aix-en-provence/index.html:703, depannage-clim-aix-en-provence/index.html:710, depannage-clim-aix-en-provence/index.html:790, depannage-clim-marseille/index.html:521, depannage-clim-marseille/index.html:618, depannage-clim-marseille/index.html:706, depannage-clim-marseille/index.html:759, depannage-clim-marseille/index.html:773, depannage-clim-la-ciotat/index.html:519, depannage-clim-la-ciotat/index.html:609, depannage-clim-la-ciotat/index.html:682, depannage-clim-la-ciotat/index.html:749, depannage-clim-hyeres/index.html:609, depannage-clim-hyeres/index.html:672, depannage-clim-hyeres/index.html:694
- **C1** (`2 ?kg|2 kg`) — 18 occurrence(s) : index.html:434, index.html:853, climurgence.md:129, entretien-climatisation/index.html:609, entretien-climatisation/index.html:725, entretien-climatisation/index.html:740, entretien-climatisation/index.html:745, entretien-climatisation/index.html:757, entretien-climatisation/index.html:962, guide/index.html:409, guide/index.html:410, guide/index.html:417, guide/index.html:420, guide/index.html:422, guide/index.html:427, guide/index.html:582, faq/index.html:512, faq/index.html:909
- **C2** (`6 ?kW`) — 8 occurrence(s) : index.html:434, index.html:853, climurgence.md:129, entretien-climatisation/index.html:609, entretien-climatisation/index.html:725, entretien-climatisation/index.html:962, faq/index.html:512, faq/index.html:909
- **C3** (`517/2014`) — 5 occurrence(s) : llms.txt:193, climurgence.md:151, guide/index.html:465, guide/index.html:467, guide/index.html:471
- **D1** (`[Dd]éplacement (est )?offert|déplacement inclus|déplacement offert`) — 55 occurrence(s) : llms.txt:3, llms.txt:124, llms.txt:186, index.html:58, index.html:335, climurgence.md:23, climurgence.md:125, climurgence.md:184, entretien-climatisation/index.html:625, entretien-climatisation/index.html:709, entretien-climatisation/index.html:714, entretien-climatisation/index.html:842, entretien-climatisation/index.html:894, cgv/index.html:121, contact/index.html:449, contact/index.html:648, contact/index.html:692, depannage-clim-vitrolles/index.html:609, depannage-clim-vitrolles/index.html:614, tarifs/index.html:7, tarifs/index.html:14, tarifs/index.html:51, tarifs/index.html:1017, depannage-clim-aubagne/index.html:527, depannage-clim-aubagne/index.html:609, depannage-clim-aubagne/index.html:614, depannage-clim-aubagne/index.html:760, faq/index.html:477, faq/index.html:612, faq/index.html:826, faq/index.html:1148, depannage-clim-toulon/index.html:618, depannage-clim-toulon/index.html:623, blog/code-erreur-e3-daikin/index.html:445, blog/code-erreur-e3-daikin/index.html:586, blog/code-erreur-e3-daikin/index.html:706, blog/clim-souffle-chaud/index.html:445, blog/clim-souffle-chaud/index.html:623, blog/clim-souffle-chaud/index.html:704, blog/clim-souffle-chaud/index.html:721, depannage-clim-aix-en-provence/index.html:7, depannage-clim-aix-en-provence/index.html:13, depannage-clim-aix-en-provence/index.html:20, depannage-clim-aix-en-provence/index.html:413, depannage-clim-aix-en-provence/index.html:635, depannage-clim-marseille/index.html:7, depannage-clim-marseille/index.html:413, depannage-clim-marseille/index.html:581, depannage-clim-marseille/index.html:586, depannage-clim-la-ciotat/index.html:543, depannage-clim-la-ciotat/index.html:609, depannage-clim-la-ciotat/index.html:614, depannage-clim-la-ciotat/index.html:770, depannage-clim-hyeres/index.html:609, depannage-clim-hyeres/index.html:614
- **D2** (`majoration`) — 56 occurrence(s) : llms.txt:3, llms.txt:22, llms.txt:31, llms.txt:116, llms.txt:124, llms.txt:183, index.html:58, index.html:340, index.html:381, index.html:418, climurgence.md:22, climurgence.md:29, climurgence.md:117, climurgence.md:125, climurgence.md:183, entretien-climatisation/index.html:625, entretien-climatisation/index.html:709, entretien-climatisation/index.html:842, entretien-climatisation/index.html:893, entretien-climatisation/index.html:990, cgv/index.html:121, contact/index.html:692, depannage-clim-vitrolles/index.html:609, depannage-clim-vitrolles/index.html:615, tarifs/index.html:7, tarifs/index.html:14, tarifs/index.html:22, tarifs/index.html:51, tarifs/index.html:498, depannage-clim-aubagne/index.html:609, depannage-clim-aubagne/index.html:615, faq/index.html:477, faq/index.html:486, faq/index.html:487, faq/index.html:602, faq/index.html:612, faq/index.html:826, faq/index.html:842, faq/index.html:846, faq/index.html:1128, faq/index.html:1148, depannage-clim-toulon/index.html:618, depannage-clim-toulon/index.html:624, blog/clim-souffle-chaud/index.html:445, blog/clim-souffle-chaud/index.html:721, depannage-clim-aix-en-provence/index.html:636, depannage-clim-marseille/index.html:13, depannage-clim-marseille/index.html:413, depannage-clim-marseille/index.html:581, depannage-clim-marseille/index.html:587, depannage-clim-la-ciotat/index.html:543, depannage-clim-la-ciotat/index.html:609, depannage-clim-la-ciotat/index.html:615, depannage-clim-la-ciotat/index.html:770, depannage-clim-hyeres/index.html:609, depannage-clim-hyeres/index.html:615
- **D3** (`[Tt]arifs? (TTC )?publics?|grille tarifaire|tarifs publics`) — 25 occurrence(s) : entretien-climatisation/index.html:886, cgv/index.html:121, contact/index.html:692, depannage-clim-vitrolles/index.html:680, depannage-clim-vitrolles/index.html:724, depannage-clim-aubagne/index.html:683, depannage-clim-aubagne/index.html:727, faq/index.html:477, faq/index.html:492, faq/index.html:826, faq/index.html:856, depannage-clim-toulon/index.html:706, depannage-clim-toulon/index.html:750, installation-climatisation/index.html:804, depannage-clim-aix-en-provence/index.html:710, depannage-clim-aix-en-provence/index.html:754, depannage-clim-marseille/index.html:581, depannage-clim-marseille/index.html:706, depannage-clim-marseille/index.html:750, depannage-clim-la-ciotat/index.html:543, depannage-clim-la-ciotat/index.html:682, depannage-clim-la-ciotat/index.html:726, depannage-clim-la-ciotat/index.html:770, depannage-clim-hyeres/index.html:694, depannage-clim-hyeres/index.html:738

---

Fin de la phase 1. Aucune modification n'a été apportée au site.
La phase 2 ne démarrera qu'après validation écrite d'Arthur.
