# RAPPORT DE CONFORMITÉ — climurgence.com

Passage au modèle « plateforme de mise en relation avec un réseau de techniciens partenaires indépendants ».

- Date : 23 septembre 2026
- Branche : `conformite-reseau-partenaires`
- Base : `main` (commit `c8e9351`)
- Statut : **non fusionnée, non poussée.** Aucune action sur `main`.
- Audit de départ : [AUDIT_CONFORMITE.md](AUDIT_CONFORMITE.md)

---

## 1. RÉSUMÉ

| Indicateur | Avant | Après |
|---|---|---|
| Pages publiques | 22 | 23 |
| Promesses de délai chiffrées | environ 230 | 0 |
| Formulations « techniciens internes » | environ 130 | 0 |
| Affirmations réglementaires inexactes | 19 | 0 |
| Emojis | 24 | 0 |
| Blocs JSON-LD valides | 22 / 22 | 23 / 23 |
| Liens internes cassés | 0 | 0 |
| Pages orphelines | 0 | 0 |
| Canonical modifiés | — | 0 |

14 commits, 34 fichiers touchés, 2 pages créées, 1 page supprimée avec redirection 301.

---

## 2. VOS ARBITRAGES ET LEUR APPLICATION

| Arbitrage | Application |
|---|---|
| **1. Médiateur** : aucune mention sur le site | Aucune section médiateur dans les CGU, aucun marqueur. L'article 13 traite le droit applicable et les litiges sans citer de médiateur. |
| **2. Abonnements supprimés** | Page `/contrats-pro/` supprimée, 301 vers `/notre-reseau/` dans `vercel.json` (avec et sans slash final). 48 liens retirés du menu et des pieds de page, plus 6 liens dans le corps des pages. Article 5 des CGV (SEPA, engagement 12 mois) supprimé. Sections abonnements retirées de `/tarifs/` et `/entretien-climatisation/`. 2 questions FAQ supprimées, 2 questions FAQ de pages de ville supprimées, 3 paragraphes reformulés. Option « Abonnement maintenance » retirée des 2 formulaires. Retirée du sitemap et de `llms.txt`. Catégorie `contrat` retirée de `api/lead.js`. |
| **3. « Déplacement offert » et « aucune majoration »** | 78 occurrences supprimées. Phrase de remplacement utilisée partout où une formulation était nécessaire : « Le technicien vous indique le prix du déplacement et du diagnostic avant toute intervention. » Aucune promesse tarifaire ne subsiste au nom de Clim Urgence. |
| **4. Délai de référence** | « Intervention en 24 h dans la majorité des cas, selon la disponibilité des techniciens partenaires de votre secteur. » appliquée sur l'accueil, les 7 pages de ville, `/zone-intervention/`, la FAQ, les CGU, `llms.txt` et `climurgence.md`. Message de confirmation de `js/main.js` : « Merci, votre demande est bien reçue. Nous vous rappelons rapidement. » Les 23 cartes de commune de `/zone-intervention/` affichent désormais « Réseau de partenaires actif ». |
| **5. Incohérence légale** | CGU et politique de confidentialité alignées sur le Kbis : CLIMURGENCE, SAS au capital de 120,00 euros, siège 5 avenue Edouard Branly 13009 Marseille, RCS Marseille 105 205 645, Président Arthur ADJADJ. Aucune autre personne n'est nommée. Le numéro de TVA était déjà présent dans les mentions légales : aucun marqueur nécessaire. |
| **6. Politique de confidentialité en priorité** | Traitée en premier (commit 2 sur 14). Voir section 3.1. |
| **7. Réglementation** | Corrections appliquées sur l'accueil, `/entretien-climatisation/`, `/guide/`, `/faq/`, les 2 articles de blog, `llms.txt` et `climurgence.md`. Voir section 3.4. |
| **8. Points non tranchés** | Option la plus prudente retenue dans chaque cas. Voir section 5. |

---

## 3. DÉTAIL DES MODIFICATIONS

### 3.1 Politique de confidentialité — `/confidentialite/`

| Élément | Avant | Après |
|---|---|---|
| Destinataires | « Vos données sont strictement réservées à l'usage interne de ClimUrgence. Elles ne sont ni vendues, ni louées, ni transférées à des tiers commerciaux. » | Trois destinataires listés : le technicien partenaire chargé de la demande (responsable de traitement autonome, identité communicable sur demande), le personnel habilité de Clim Urgence, les sous-traitants techniques. Précision que les données ne sont transmises qu'à un seul partenaire à la fois et jamais diffusées à l'ensemble du réseau. |
| Finalités | Réaliser l'intervention, suivi commercial, facturation | Qualifier la demande, la transmettre au partenaire, rappeler après intervention, traiter une réclamation, instruire une candidature partenaire |
| Base légale | « Consentement explicite » | Exécution de mesures précontractuelles, intérêt légitime pour le suivi de satisfaction, obligations légales |
| Durées | Prospects 3 ans, clients 5 ans, facturation 10 ans | Demandes non concrétisées 3 ans, demandes traitées 3 ans après intervention, candidatures partenaires 2 ans. Ligne facturation supprimée : Clim Urgence ne facture pas le client. |
| Responsable | « SASU en cours d'immatriculation », adresse sur demande | Identité complète issue du Kbis |
| Préambule | — | Paragraphe expliquant que la transmission au partenaire est le cœur du service |
| Données collectées | — | Ajout des champs de la candidature partenaire (société, SIREN, zones, activités) |

### 3.2 CGV devenues CGU — `/cgv/`

**URL conservée**, conformément à la recommandation de l'audit : la page est indexée, référencée dans les 23 pieds de page, le sitemap et `llms.txt`. Seuls le `title`, le H1 et le contenu changent.

14 articles remplacent les 13 précédents :

| Ancien contenu supprimé | Nouveau contenu |
|---|---|
| Art. 1 : prestations de dépannage vendues par « le Prestataire » | Art. 1 : objet du service de mise en relation, mention explicite que Clim Urgence ne réalise aucune prestation technique |
| Art. 4 : prix, TVA, exigibilité, retard de paiement | Art. 3 : gratuité totale du service pour le client, rémunération par commission du partenaire |
| Art. 5 : contrats de maintenance, SEPA, période ferme de 12 mois, reconduction tacite, résiliation | Art. 4 : déroulement de la mise en relation, absence de garantie de délai et de disponibilité |
| Art. 6 : « intervention sous 1h sur Marseille » | Art. 5 : contrat conclu entre client et partenaire, prix fixés librement par le partenaire, prix du site indicatifs |
| Art. 7 : main-d'œuvre garantie 3 mois / 12 mois par Clim Urgence | Art. 6 : partenaire seul responsable de l'exécution et des garanties |
| Art. 9 : responsabilité limitée au montant de la prestation facturée | Art. 7 : critères de sélection des partenaires, absence de positionnement payant |
| — | Art. 8 : traitement des réclamations, exclusion possible du partenaire |
| — | Art. 9 : obligations du client |
| Art. 12 : médiation de la consommation | Art. 13 : droit applicable et litiges, sans mention de médiateur (votre arbitrage n° 1) |

### 3.3 Mentions légales — `/mentions-legales/`

Ajout d'une section **Activité** : mise en relation, Clim Urgence ne réalise pas les prestations, le partenaire facture et encaisse, rémunération par commission sans surcoût, renvoi vers `/notre-reseau/` au titre de l'article L111-7. Les informations tarifaires sont requalifiées en prix indicatifs constatés chez les partenaires.

### 3.4 Réglementation

| Fichier | Avant | Après |
|---|---|---|
| `index.html` (FAQ visible et JSON-LD) | « entretien périodique pour tout système dont la charge dépasse un certain seuil (environ 2 kg, soit ≈ 6 kW) » | Décret n° 2020-912 : 4 kW à 70 kW, entretien au moins tous les deux ans, attestation sous quinze jours |
| `/entretien-climatisation/` | Tableau à 3 seuils en kilogrammes, conclusion « la majorité des climatiseurs résidentiels ne sont pas légalement obligés » | Deux tableaux distincts : entretien périodique par puissance (moins de 4 kW, 4 à 70 kW, plus de 70 kW) et contrôle d'étanchéité en tonnes équivalent CO2 (moins de 5 t, 5 à 50 t, 50 à 500 t, 500 t et plus, avec et sans détecteur de fuites). Conclusion corrigée : la plupart des monosplits dépassent 4 kW et **sont** soumis à l'obligation. |
| `/guide/` article 1 | Section entière bâtie sur le seuil de 2 kg | Réécriture intégrale : décret n° 2020-912, articles R224-44 et suivants, périodicité de deux ans, qualification requise, attestation, premier entretien, exclusions, inspection quinquennale au-delà de 70 kW, tableau F-Gas en tonnes équivalent CO2, ordres de grandeur (5 t éq. CO2 ≈ 2,4 kg de R410A ou 7,4 kg de R32) |
| `/guide/` section arrêté | « Arrêté du 16 avril 2010 » présenté comme le texte en vigueur | Renvoi aux articles R543-75 à R543-123 du code de l'environnement. La référence à l'arrêté est retirée plutôt qu'affirmée abrogée, faute de vérification concluante de son statut. |
| `/guide/` section F-Gas | « Règlement 517/2014 […] révisé par le règlement 2024/573 » | « Le règlement (UE) 2024/573 du 7 février 2024, applicable depuis le 11 mars 2024, abroge et remplace le règlement (UE) n° 517/2014. » |
| `/guide/` R22 | « remplacement obligatoire, votre appareil ne peut plus être entretenu légalement » | « La recharge en fluide neuf ou recyclé est interdite. Un appareil encore fonctionnel peut être utilisé et entretenu, mais toute fuite le rend irréparable. » |
| `/faq/` (2 emplacements) | Même seuil de 2 kg, fréquences annuelle et semestrielle | Entretien 4 à 70 kW tous les deux ans, distinction explicite avec le contrôle d'étanchéité à 5 tonnes équivalent CO2 |
| `/faq/` R32 | « obligatoire pour les climatiseurs neufs depuis 2025 » | « Le R32 équipe aujourd'hui la quasi-totalité des climatiseurs neufs, sous l'effet des interdictions échelonnées de mise sur le marché prévues par le règlement (UE) 2024/573. » |
| Blog (2 articles) | « arrêté du 16 avril 2010 » | Articles R543-75 et suivants du code de l'environnement |
| `llms.txt`, `climurgence.md` | « F-Gas (UE) 517/2014 » | Références complètes au décret 2020-912, aux articles R224-44/R224-45 et au règlement 2024/573 |
| Libellés | « Entretien annuel obligatoire » | « Entretien périodique réglementaire » (menus, cartes de service, options de formulaire). La `value` technique `entretien-annuel` est conservée pour ne pas casser `api/lead.js`. |

### 3.5 Pages créées

**`/notre-reseau/`** — porte l'information de l'article L111-7. Sections : fonctionnement en six étapes, interlocuteur contractuel, cinq critères de sélection, règles d'attribution des demandes (aucun positionnement payant), suivi qualité, rémunération par commission, traitement des réclamations, données personnelles, appel aux techniciens. JSON-LD `AboutPage` + `BreadcrumbList` + `FAQPage` (5 questions). Liée depuis le menu, le pied de page et la section « Comment ça marche » des 23 pages.

**`/devenir-partenaire/`** — page de recrutement indexable. Sections : zone couverte, principe (« vous ne payez rien tant que vous n'avez pas travaillé »), rémunération à la commission sans montants affichés, quatre documents requis, déroulement en quatre étapes, formulaire de candidature. JSON-LD `WebPage` + `BreadcrumbList`. Liée depuis le pied de page des 23 pages.

### 3.6 Accueil — section « Comment ça marche »

Insérée entre le hero et le formulaire, en quatre étapes, avec renvoi vers `/notre-reseau/`. Elle réutilise les classes existantes (`.section`, `.section-header`, `.services-grid`, `.service-card`) : aucune règle CSS ajoutée.

Le bloc de chiffres a été refait : « moins d'1h / délai moyen » devient « Gratuit / la mise en relation ne vous coûte rien », « 100 % / technicien expérimenté » devient « Suivi / nous vous rappelons après chaque intervention ». La mention de transmission des données au partenaire a été ajoutée sous le bouton du formulaire, avec lien vers la politique de confidentialité.

### 3.7 Pied de page des 23 pages

Mention ajoutée au-dessus de la ligne de copyright : « Clim Urgence met en relation ses clients avec des techniciens partenaires indépendants, qualifiés et assurés, qui réalisent et facturent les prestations. En savoir plus sur notre réseau. » Une classe `.footer-network` a été ajoutée à `css/style.css`.

Menu : « Abonnements » remplacé par « Notre réseau ». Pied de page : « Notre réseau » et « Devenir partenaire » ajoutés dans la colonne Ressources, « CGV » renommé « Conditions générales ».

### 3.8 Code

| Fichier | Modification |
|---|---|
| `api/lead.js` | Catégorie `partenaire` ajoutée dans `TYPE_DEFS`, court-circuit de la requalification automatique pour ce type, affichage des champs `societe`, `siren`, `zones`, `activites` dans les versions HTML et texte de l'e-mail. Catégorie `contrat` et entrée `abonnement` supprimées. 5 emojis remplacés par des libellés textuels. |
| `js/main.js` | **Correction d'un défaut** : `buildPayload()` sérialisait les cases à cocher sans tenir compte de leur état. Les trois activités du formulaire partenaire auraient été envoyées quoi qu'il arrive, la dernière écrasant les précédentes. Les cases non cochées sont désormais ignorées et les valeurs multiples portant le même `name` sont concaténées. Messages de confirmation mis à jour. 3 emojis retirés. |
| `css/style.css` | Classe `.footer-network` ajoutée, bordure supérieure déplacée de `.footer-bottom` vers ce nouveau bloc. |
| `vercel.json` | Deux redirections 301 permanentes de `/contrats-pro` et `/contrats-pro/` vers `/notre-reseau/`. |
| `sitemap.xml` | `/contrats-pro/` retirée, `/notre-reseau/` (0.8) et `/devenir-partenaire/` (0.6) ajoutées, dates de modification à jour. |

---

## 4. PHASE 3 — VÉRIFICATIONS EFFECTUÉES

### 4.1 Recherche finale des termes (insensible à la casse, hors CSS inline)

| Terme | Occurrences | Justification des occurrences restantes |
|---|---|---|
| « moins d'1h » | **0** | — |
| « moins de 1h » | **0** | — |
| « < 1h » | **0** | — |
| « 5 minutes » | 2 | Instructions techniques de réinitialisation Daikin : « couper le disjoncteur pendant au moins 5 minutes ». |
| « 30 minutes » | 3 | Durées techniques : temps de séchage de l'unité extérieure, durée d'un test de performance. |
| « nos techniciens sont disponibles » | **0** | — |
| « 100 % » | 5 | Uniquement du CSS en ligne : `style="width:100%"` sur des boutons de formulaire et des tableaux d'e-mail. |
| « RGE » | **0** | — |
| « MaPrimeRénov » | **0** | — |
| « prime » | 1 | Le verbe primer : « Ce règlement est directement applicable en France et prime sur la législation nationale. » |
| « garanti » | 38 | Trois familles, toutes légitimes : (a) la **garantie constructeur** des appareils, qui n'engage pas Clim Urgence ; (b) les **garanties légales et contractuelles dues par le partenaire**, explicitement attribuées à lui ; (c) les phrases affirmant l'**absence** de garantie, comme « Clim Urgence ne garantit aucun délai d'intervention », « Clim Urgence ne délivre aucune garantie sur les prestations réalisées par les Partenaires » et « Aucun délai n'est garanti ». Deux emplois non commerciaux subsistent : « le marquage CE garantit que le produit est conforme » et « pour garantir que le gaz n'est pas relâché dans l'atmosphère ». |

### 4.2 Emojis

**0 emoji** dans l'ensemble du dépôt (hors `README.md` et `AUDIT_CONFORMITE.md`).

Conservés parce qu'il s'agit de signes typographiques Unicode et non d'emojis : 46 flèches (`→`, `←`) dans `css/style.css`, `contact`, `faq`, `zone-intervention`, `blog` et les commentaires de `api/lead.js`, ainsi qu'une coche `✓` utilisée en `content` CSS dans `guide/index.html`. Aucun n'a de présentation emoji ni de sélecteur de variante. Dites-moi si vous souhaitez qu'ils partent aussi.

### 4.3 Build et liens

Le site est statique, sans étape de compilation. `npx serve` reste bloqué sur cette machine (aucun port ouvert, aucun log) : j'ai donc servi le site avec `python3 -m http.server` pour la vérification.

- 12 URL testées en HTTP : **200** pour toutes, sauf `/contrats-pro/` en **404** en local, ce qui est attendu puisque la redirection 301 est assurée par Vercel et non par le serveur statique.
- **0 lien interne cassé** sur l'ensemble des `href` et `src` internes des 23 pages.
- **0 page orpheline**. `/notre-reseau/` et `/devenir-partenaire/` sont référencées depuis les 23 pages.

### 4.4 Validation syntaxique

- **23 blocs JSON-LD sur 23** valides.
- `vercel.json`, `package.json`, `sitemap.xml` valides.
- `js/main.js` et `api/lead.js` passent `node --check`.

### 4.5 Test fonctionnel des formulaires

Formulaire partenaire soumis dans le navigateur avec « Pose » et « Entretien » cochés et « Dépannage » décoché. Charge utile effectivement transmise :

```json
{"type":"partenaire","sujet":"Candidature technicien partenaire","nom":"Jean Dupont",
 "societe":"Froid Provence SARL","siren":"123456789","telephone":"0612345678",
 "email":"jean@froid-provence.fr","zones":"Marseille, Aubagne",
 "activites":"Pose, Entretien","page_origine":"/devenir-partenaire/"}
```

La case décochée est bien absente. `api/lead.js` exécuté en mode `LEAD_EMAIL_DRY_RUN` sur cette charge produit l'objet `[PARTENAIRE] Candidature technicien partenaire — Jean Dupont` et une section ENTREPRISE contenant société, SIREN, zones et activités.

Un lead client standard a également été rejoué : objet `[URGENCE 13008] Clim ne refroidit plus — Marie Martin`, comportement inchangé. Aucune régression.

### 4.6 Vérification mobile (375 x 812)

- `/notre-reseau/`, `/devenir-partenaire/`, `/zone-intervention/` et l'accueil : **aucun débordement horizontal** (`scrollWidth` égal à `innerWidth`).
- Section « Comment ça marche » : les 4 cartes s'empilent correctement, textes lisibles.
- Formulaire de candidature : les 8 champs et les 3 cases à cocher s'affichent et sont utilisables.
- Bouton d'appel flottant présent et fonctionnel (`tel:+33643721850`) sur toutes les pages testées.
- Menu : « Accueil / Notre réseau / Dépannage / Entretien / Installation / Tarifs / Contact ».
- Les 23 cartes de commune de `/zone-intervention/` affichent toutes « Réseau de partenaires actif ».
- Aucune erreur dans la console du navigateur.

### 4.7 Balises title, meta description, H1 et canonical

**Aucun canonical n'a été modifié.** Les changements suivants étaient nécessaires pour retirer une promesse non tenable ou refléter le changement d'objet d'une page :

| Page | Élément | Avant | Après |
|---|---|---|---|
| `/cgv/` | `title` | Conditions Générales de Vente \| ClimUrgence | Conditions générales d'utilisation du service de mise en relation \| Clim Urgence |
| `/cgv/` | `meta description` | Conditions générales de vente ClimUrgence — devis, prix TTC, garanties, délais d'intervention à Marseille et PACA, responsabilité et litiges. | Conditions générales d'utilisation du service de mise en relation Clim Urgence : gratuité pour le client, rôle d'intermédiaire, responsabilité du technicien partenaire, réclamations. |
| `/cgv/` | H1 | Conditions Générales de Vente | Conditions générales d'utilisation du service de mise en relation |
| `/confidentialite/` | `meta description` | Politique de confidentialité ClimUrgence — traitement RGPD de vos données personnelles, droits d'accès, rectification et opposition. Marseille. | Politique de confidentialité Clim Urgence — données transmises au technicien partenaire chargé de votre demande, finalités, durées de conservation et droits RGPD. |
| `/contrats-pro/` | page entière | existait | **supprimée, 301 vers `/notre-reseau/`** |
| `/depannage-clim-aix-en-provence/` | `title` | Dépannage Climatisation Aix-en-Provence — Intervention 1h 7j/7 \| ClimUrgence | Dépannage Climatisation Aix-en-Provence — Techniciens partenaires 7j/7 \| ClimUrgence |
| `/depannage-clim-aix-en-provence/` | `meta description` | Dépannage climatisation en urgence à Aix-en-Provence : Mazarin, Jas de Bouffan, Sextius, Pont de l'Arc. Intervention environ 1h, 7j/7 de 9h à 21h, déplacement offert. | Dépannage climatisation à Aix-en-Provence : Mazarin, Jas de Bouffan, Sextius, Pont de l'Arc. Clim Urgence vous met en relation avec un technicien partenaire indépendant, qualifié et assuré. Standard 7j/7 de 9h à 21h. |
| `/depannage-clim-aix-en-provence/` | H1 | Dépannage climatisation à Aix-en-Provence — intervention en moins d'1h | Dépannage climatisation à Aix-en-Provence — un technicien partenaire près de chez vous |
| `/depannage-clim-aubagne/` | `title` | Dépannage Climatisation Aubagne — Intervention 1h 7j/7 \| ClimUrgence | Dépannage Climatisation Aubagne — Techniciens partenaires 7j/7 \| ClimUrgence |
| `/depannage-clim-aubagne/` | `meta description` | Dépannage climatisation urgence à Aubagne : centre, Pin Vert, Tourtelle, Beaudinard. Intervention en moins d'1h, 7j/7 de 9h à 21h. Appelez le 06 43 72 18 50. | Dépannage climatisation à Aubagne : centre, Pin Vert, Tourtelle, Beaudinard. Clim Urgence vous met en relation avec un technicien partenaire indépendant, qualifié et assuré. Standard 7j/7 de 9h à 21h. |
| `/depannage-clim-aubagne/` | H1 | Dépannage climatisation à Aubagne — intervention en moins d'1h | Dépannage climatisation à Aubagne — un technicien partenaire près de chez vous |
| `/depannage-clim-hyeres/` | `title` | Dépannage Climatisation Hyères — Intervention 7j/7 \| ClimUrgence | Dépannage Climatisation Hyères — Techniciens partenaires 7j/7 \| ClimUrgence |
| `/depannage-clim-hyeres/` | `meta description` | Dépannage clim urgence à Hyères : Centre, Gapeau, Ayguade, Presqu'île de Giens. Intervention 1 à 1h30, 7j/7 de 9h à 21h. Appelez le 06 43 72 18 50. | Dépannage climatisation à Hyères : Centre, Gapeau, Ayguade, Presqu'île de Giens. Clim Urgence vous met en relation avec un technicien partenaire indépendant, qualifié et assuré. Standard 7j/7 de 9h à 21h. |
| `/depannage-clim-hyeres/` | H1 | Dépannage climatisation à Hyères — 7j/7 dans le Var | Dépannage climatisation à Hyères — un technicien partenaire près de chez vous |
| `/depannage-clim-la-ciotat/` | `title` | Dépannage Climatisation La Ciotat — Intervention 1h 7j/7 \| ClimUrgence | Dépannage Climatisation La Ciotat — Techniciens partenaires 7j/7 \| ClimUrgence |
| `/depannage-clim-la-ciotat/` | `meta description` | Dépannage clim urgence à La Ciotat : Vieux Port, Abeille, Fardeloup, Ceyreste. Intervention moins d'1h, 7j/7 de 9h à 21h. Appelez le 06 43 72 18 50. | Dépannage climatisation à La Ciotat : Vieux Port, Abeille, Fardeloup, Ceyreste. Clim Urgence vous met en relation avec un technicien partenaire indépendant, qualifié et assuré. Standard 7j/7 de 9h à 21h. |
| `/depannage-clim-la-ciotat/` | H1 | Dépannage climatisation à La Ciotat — intervention express 7j/7 | Dépannage climatisation à La Ciotat — un technicien partenaire près de chez vous |
| `/depannage-clim-marseille/` | `title` | Dépannage Climatisation Marseille — Intervention 1h 7j/7 \| ClimUrgence | Dépannage Climatisation Marseille — Techniciens partenaires 7j/7 \| ClimUrgence |
| `/depannage-clim-marseille/` | `meta description` | Dépannage climatisation en urgence à Marseille : tous arrondissements (1er à 16e), intervention moins d'1h, 7j/7 de 9h à 21h, déplacement offert. Appelez le 06 43 72 18 50. | Dépannage climatisation à Marseille, tous arrondissements (1er à 16e). Clim Urgence vous met en relation avec un technicien partenaire indépendant, qualifié et assuré. Standard 7j/7 de 9h à 21h. |
| `/depannage-clim-marseille/` | H1 | Dépannage climatisation à Marseille — intervention en moins d'1h | Dépannage climatisation à Marseille — un technicien partenaire près de chez vous |
| `/depannage-clim-toulon/` | `title` | Dépannage Climatisation Toulon — Intervention Express 7j/7 \| ClimUrgence | Dépannage Climatisation Toulon — Techniciens partenaires 7j/7 \| ClimUrgence |
| `/depannage-clim-toulon/` | `meta description` | Dépannage climatisation en urgence à Toulon : Mourillon, Pont-du-Las, Dardennes, Le Jonquet. Intervention 1 à 1h30, 7j/7 de 9h à 21h. Appelez le 06 43 72 18 50. | Dépannage climatisation à Toulon : Mourillon, Pont-du-Las, Dardennes, Le Jonquet. Clim Urgence vous met en relation avec un technicien partenaire indépendant, qualifié et assuré. Standard 7j/7 de 9h à 21h. |
| `/depannage-clim-toulon/` | H1 | Dépannage climatisation à Toulon — 7j/7 dans tout le Var | Dépannage climatisation à Toulon — un technicien partenaire près de chez vous |
| `/depannage-clim-vitrolles/` | `title` | Dépannage Climatisation Vitrolles — Intervention 1h 7j/7 \| ClimUrgence | Dépannage Climatisation Vitrolles — Techniciens partenaires 7j/7 \| ClimUrgence |
| `/depannage-clim-vitrolles/` | `meta description` | Dépannage clim urgence à Vitrolles : Centre, Village, Étang-de-Berre, Les Pinchinades. Intervention environ 1h, 7j/7 de 9h à 21h. Appelez le 06 43 72 18 50. | Dépannage climatisation à Vitrolles : Centre, Village, Étang-de-Berre, Les Pinchinades. Clim Urgence vous met en relation avec un technicien partenaire indépendant, qualifié et assuré. Standard 7j/7 de 9h à 21h. |
| `/depannage-clim-vitrolles/` | H1 | Dépannage climatisation à Vitrolles — intervention rapide 7j/7 | Dépannage climatisation à Vitrolles — un technicien partenaire près de chez vous |
| `/devenir-partenaire/` | page entière | — | **page créée** |
| `/faq/` | `title` | FAQ Climatisation — 47 questions réponses \| ClimUrgence Marseille | FAQ Climatisation — 45 questions réponses \| ClimUrgence Marseille |
| `/` | `title` | Dépannage Climatisation Marseille – Urgence 7j/7 \| ClimUrgence | Dépannage Climatisation Marseille — Réseau de techniciens partenaires 7j/7 \| ClimUrgence |
| `/` | `meta description` | ClimUrgence : dépannage climatisation en urgence à Marseille, Aix-en-Provence, Toulon et toute la région PACA. Intervention en moins d'1h, 7j/7 de 9h à 21h. Appelez le 06 43 72 18 50. | Clim Urgence met en relation particuliers et professionnels avec des techniciens partenaires indépendants en climatisation dans les Bouches-du-Rhône (13) et le Var (83). Standard 7j/7 de 9h à 21h. 06 43 72 18 50. |
| `/mentions-legales/` | `meta description` | Mentions légales du site climurgence.com — éditeur, hébergeur, propriété intellectuelle et données personnelles. SAS CLIMURGENCE, Marseille. | Mentions légales du site climurgence.com — éditeur SAS CLIMURGENCE, activité de mise en relation avec des techniciens partenaires indépendants, hébergeur et propriété intellectuelle. |
| `/notre-reseau/` | page entière | — | **page créée** |
| `/tarifs/` | `meta description` | Grille tarifaire transparente ClimUrgence : dépannage dès 119 €, entretien dès 119 €, installation dès 699 €. Déplacement offert, sans majoration en PACA. | Prix indicatifs constatés auprès des techniciens partenaires Clim Urgence : dépannage dès 119 €, entretien dès 119 €, installation dès 699 €. Le devis du partenaire fait foi. |
| `/zone-intervention/` | `meta description` | ClimUrgence intervient dans tout le 13 et le 83. Marseille, Aix, Aubagne, Toulon, Hyères, La Seyne, Bandol… Délai d'intervention sous 1h30. 7j/7 de 9h à 21h. | Le réseau de techniciens partenaires Clim Urgence couvre les Bouches-du-Rhône (13) et le Var (83) : Marseille, Aix, Aubagne, Toulon, Hyères, La Seyne, Bandol. Standard 7j/7 de 9h à 21h. |
| `/zone-intervention/` | H1 | Zones d'intervention ClimUrgence | Zones couvertes par notre réseau de techniciens partenaires |

Les H1 de `/entretien-climatisation/`, `/installation-climatisation/`, `/tarifs/`, `/faq/`, `/guide/`, `/blog/`, `/contact/`, `/mentions-legales/`, `/confidentialite/` et des deux articles de blog **n'ont pas été touchés**.

Le `title` de `/faq/` passe de « 47 questions réponses » à « 45 questions réponses » : c'est la conséquence arithmétique de la suppression des deux questions sur les abonnements. Le nombre de questions visibles et le nombre de questions déclarées dans le `FAQPage` sont tous deux à 45.

---

## 5. CHOIX QUE J'AI FAITS À VOTRE PLACE (point 8 de vos arbitrages)

Vous m'avez demandé de retenir l'option la plus prudente juridiquement et la plus cohérente avec le modèle. Voici les six décisions, à relire.

| # | Sujet | Options possibles | Choix retenu | Raison |
|---|---|---|---|---|
| 1 | **« Intervention garantie sous 4h »** de la formule Premium | Supprimer / requalifier / imposer aux partenaires | **Supprimé**, en même temps que les abonnements (arbitrage n° 2) | La suppression des abonnements rendait la question sans objet. Aucune trace ne subsiste. |
| 2 | **SMS de prévenance 30 minutes avant l'arrivée** | Supprimer / imposer aux partenaires | **Supprimé**. Remplacé par : « Le technicien partenaire convient du créneau directement avec vous par téléphone et vous prévient de son arrivée selon ce que vous aurez fixé ensemble. » | Clim Urgence ne maîtrise pas l'organisation du partenaire. Promettre un SMS envoyé par un tiers serait un engagement qu'elle ne peut pas tenir. |
| 3 | **Emojis de `js/main.js` et `api/lead.js`** | Conserver / remplacer | **Tous retirés.** Bouton de thème : « Mode clair » / « Mode sombre ». Messages d'erreur : sans pictogramme. E-mail interne : libellés textuels (Nom, Tél., E-mail, Adresse, Société, SIREN, Zones, Activités). | Votre règle n° 1 interdit l'emoji sans exception. À noter : le bouton de thème n'existe dans aucune page HTML, ce code est mort. |
| 4 | **URL des conditions générales** | Conserver `/cgv/` / créer `/cgu/` avec 301 | **`/cgv/` conservée** | Recommandation de l'audit que vous avez validée. Évite 23 modifications de liens, une redirection supplémentaire et une perte transitoire de signal, pour un gain nul. |
| 5 | **Prix dans les `title`, `meta` et H1** | Retirer / conserver en les marquant indicatifs | **Conservés**, avec mention « prix indicatifs constatés » ajoutée au-dessus de chaque grille et dans les descriptions | Retirer « dès 119 € » des titres aurait coûté du référencement sans gain de conformité, dès lors que le caractère indicatif est affirmé partout. |
| 6 | **Type JSON-LD `HVACBusiness`** | Conserver / basculer en `Organization` | **Conservé**, avec une `description` requalifiée en plateforme de mise en relation | Clim Urgence reste une entreprise locale de service. Changer le type ferait perdre l'éligibilité aux résultats locaux sans gain de conformité. |

Deux ajustements complémentaires, non listés dans l'audit, faits pour la même raison de prudence :

- **Garantie de main-d'œuvre sur l'installation.** « Notre travail d'installation est garanti 1 an, nous intervenons gratuitement » a été remplacé par une garantie due par l'installateur partenaire, couvert par une assurance décennale. Le badge « SAV assuré » devient « Partenaires assurés en décennale », et « Nous gérons le SAV avec le fabricant pour vous » devient une orientation vers le fabricant ou le partenaire.
- **Comparaisons concurrentielles chiffrées.** Les affirmations du type « la plupart des concurrents facturent 50 à 80 € de déplacement et majorent de 25 à 50 % » ont été supprimées de la FAQ, de `llms.txt` et de `climurgence.md` : elles n'étaient pas sourçables et n'ont plus d'objet puisque Clim Urgence ne fixe plus les prix.

---

## 6. ÉLÉMENTS `[À COMPLÉTER PAR ARTHUR]`

**Aucun marqueur `[À COMPLÉTER PAR ARTHUR]` ne subsiste dans le site.** Vos arbitrages ont couvert tous les points ouverts de l'audit :

- le médiateur ne doit pas figurer sur le site (arbitrage n° 1) ;
- le numéro de TVA intracommunautaire était déjà présent dans les mentions légales (`FR93105205645`) ;
- les six autres points ont été tranchés par vous ou par moi (section 5).

---

## 7. POINTS QUE JE VOUS SIGNALE

1. **`/zone-intervention/` contient un bloc `FAQPage` sans FAQ visible sur la page.** C'est antérieur à mes modifications et je ne l'ai pas corrigé : les réponses ont été mises en conformité, mais le décalage entre balisage et contenu visible subsiste. Google demande que le balisage `FAQPage` corresponde à du contenu visible. Deux options : afficher ces cinq questions sur la page, ou retirer le bloc. À arbitrer séparément.

2. **Les prix affichés sont présentés comme « constatés auprès de nos partenaires ».** C'est la formulation que votre brief prévoyait. Elle suppose que ces montants correspondent bien à ce que pratiquent les partenaires du réseau. Si ce n'est pas encore le cas au démarrage, il faudra soit ajuster les montants, soit retirer les grilles le temps de disposer de vrais relevés.

3. **`npx serve` ne démarre pas sur cette machine.** La configuration `.claude/launch.json` reste bloquée en « starting » sans ouvrir de port ni produire de log. J'ai contourné avec `python3 -m http.server` pour vérifier. Sans incidence sur la production, mais gênant pour vos prochains tests locaux.

4. **`/api/lead` n'est pas testable avec un serveur statique.** Le test de bout en bout a été fait en deux temps : charge utile vérifiée dans le navigateur, traitement vérifié en exécutant `api/lead.js` en mode `LEAD_EMAIL_DRY_RUN`. Pour un test complet en local, il faudrait `vercel dev`.

5. **Le défaut de sérialisation des cases à cocher** (section 3.8) aurait envoyé les trois activités quelle que soit la sélection. Il n'existait pas avant, puisque aucun formulaire n'avait de case à cocher : il aurait été introduit par la page partenaire. Corrigé et testé.

---

## 8. SOURCES RÉGLEMENTAIRES

| Référence | Objet | Source |
|---|---|---|
| Articles R224-44 à R224-44-5 du code de l'environnement | Entretien des systèmes thermodynamiques de 4 à 70 kW : périodicité maximale de deux ans, contenu de l'entretien, qualification (II de l'article 16 de la loi n° 96-603), attestation sous quinze jours, premier entretien, exclusions | Légifrance, LEGISCTA000042166007 |
| Décret n° 2020-912 du 28 juillet 2020 | Texte source des articles ci-dessus | Légifrance, JORFTEXT000042164734 |
| Articles R224-45 et R224-45-2 du code de l'environnement | Inspection périodique tous les cinq ans au-delà de 70 kW, dix ans si ISO 50001 | Légifrance, JORFTEXT000042164734 |
| Règlement (UE) 2024/573, article 5 | Contrôle d'étanchéité : seuil de 5 tonnes équivalent CO2, fréquences 12 / 6 / 3 mois, doublées avec détecteur de fuites ; exemption des équipements hermétiquement scellés sous 10 tonnes équivalent CO2. Abroge le règlement (UE) n° 517/2014, applicable depuis le 11 mars 2024. | EUR-Lex, JO L 2024/573 |
| Articles R543-75 à R543-123 du code de l'environnement | Manipulation des fluides frigorigènes, attestation de capacité, contrôle d'étanchéité | Légifrance, LEGISCTA000006176997 |
| Article L111-7 du code de la consommation | Information due par les opérateurs de plateforme : conditions d'utilisation et modalités de référencement, existence d'une relation contractuelle ou d'une rémunération influant sur le classement, qualité des annonceurs | Légifrance, LEGIARTI000033219601 |
| Article L121-2 du code de la consommation | Pratiques commerciales trompeuses | Référence citée, non re-vérifiée en ligne (article notoire) |

**Non vérifié :** le statut exact de l'arrêté du 16 avril 2010 (abrogation, codification). Plutôt que d'affirmer son abrogation, la section correspondante du guide renvoie désormais aux articles R543-75 et suivants du code de l'environnement, qui sont, eux, en vigueur.

---

## 9. LISTE DES COMMITS

| # | Commit | Objet |
|---|---|---|
| 1 | `3456856` | docs: audit de conformité au modèle réseau de partenaires |
| 2 | `8b640cc` | fix(legal): politique de confidentialité — partenaires destinataires des données |
| 3 | `c38f432` | feat(legal): CGU du service de mise en relation en remplacement des CGV |
| 4 | `8bf9914` | fix(legal): mentions légales — activité d'intermédiation |
| 5 | `6562d80` | feat(pages): page /notre-reseau/ (information plateforme, art. L111-7) |
| 6 | `e88d1c9` | feat(pages): page /devenir-partenaire/ et formulaire de candidature |
| 7 | `7de67af` | feat(api): catégorie partenaire dans le récapitulatif de lead |
| 8 | `a43b1e6` | fix(js): cases à cocher, message de confirmation et suppression des emojis |
| 9 | `960b19b` | chore: suppression des abonnements, redirection 301 et sitemap |
| 10 | `8635099` | feat(accueil): section Comment ça marche et mise en conformité |
| 11 | `82e1c74` | fix(villes): réseau de partenaires et suppression des délais garantis |
| 12 | `66d0610` | fix(contenu): suppression des promesses de délai sur toutes les pages |
| 13 | `0e165af` | chore(ia): mise à jour de llms.txt, climurgence.md et humans.txt |
| 14 | `8f9c3af` | fix(garanties): garantie de main-d'oeuvre et SAV à la charge du partenaire |

Le commit 12 porte, outre les délais, les corrections réglementaires des pages accueil, entretien, guide, FAQ et blog, ainsi que les corrections de données structurées : ces modifications touchaient les mêmes fichiers et ne pouvaient pas être isolées sans découper les fichiers. Le commit 10 porte aussi la suppression du fichier `contrats-pro/index.html`.

---

## 10. COMMANDES POUR RELIRE ET FUSIONNER

### Relire la branche

```bash
git -C ~/Desktop/climurgence-site fetch --all && git -C ~/Desktop/climurgence-site log --oneline main..conformite-reseau-partenaires
```

Voir l'ensemble des modifications :

```bash
git -C ~/Desktop/climurgence-site diff main...conformite-reseau-partenaires
```

Voir seulement les fichiers touchés et le volume :

```bash
git -C ~/Desktop/climurgence-site diff --stat main...conformite-reseau-partenaires
```

Relire un fichier en particulier, par exemple la politique de confidentialité :

```bash
git -C ~/Desktop/climurgence-site diff main...conformite-reseau-partenaires -- confidentialite/index.html
```

### Prévisualiser le site en local

```bash
cd ~/Desktop/climurgence-site && python3 -m http.server 4173
```

Puis ouvrir http://127.0.0.1:4173/ dans un navigateur. Pages à regarder en priorité : `/`, `/notre-reseau/`, `/devenir-partenaire/`, `/cgv/`, `/confidentialite/`, `/zone-intervention/`.

Pour arrêter le serveur, Ctrl+C dans le terminal.

### Fusionner, une fois la relecture faite

**Je n'ai ni fusionné ni poussé quoi que ce soit.** Chaque push sur `main` déclenche un déploiement en production : à vous de lancer ces commandes quand vous serez prêt.

```bash
git -C ~/Desktop/climurgence-site checkout main && git -C ~/Desktop/climurgence-site merge --no-ff conformite-reseau-partenaires
```

```bash
git -C ~/Desktop/climurgence-site push origin main
```

### Après le déploiement

1. Vérifier que `https://climurgence.com/contrats-pro/` renvoie bien un **301** vers `/notre-reseau/`.
2. Soumettre le sitemap à la Search Console pour accélérer la prise en compte des deux nouvelles pages.
3. Tester le formulaire de `/devenir-partenaire/` en conditions réelles et vérifier la bonne réception de l'e-mail `[PARTENAIRE]`.
4. Passer les deux nouvelles pages au test des résultats enrichis de Google.
5. Vérifier la fiche Google Business Profile, qui n'est pas dans le périmètre de ce dépôt et peut encore annoncer des délais d'intervention.
