# Audit SEO et visibilité LLM — climurgence.com

Audit réalisé le 23 septembre 2026, en lecture seule, sur la branche `main` (commit `e9155c3`), après la fusion de la mise en conformité.

Méthode : lecture intégrale du code des 23 pages, extraction automatisée des balises et des liens, validation de tous les blocs JSON-LD, crawl interne complet, vérification des codes HTTP en production (curl), Lighthouse mobile en ligne de commande sur trois modèles de page. Aucun fichier n'a été modifié.

---

## 1. Résumé

Les cinq causes principales du mauvais positionnement Google :

1. **Toutes les URL internes du site répondent en 308.** `vercel.json` impose `"trailingSlash": false`, mais les 583 liens internes, les 23 `canonical`, les 23 URL du `sitemap.xml` et tous les `@id` JSON-LD portent un slash final. Google reçoit un sitemap dont 100 % des URL redirigent, et des canonical qui pointent vers des adresses redirigées.
2. **Aucune page « installation + commune » n'existe**, alors que la pose est devenue la priorité commerciale et que les sept pages locales publiées ciblent uniquement le dépannage.
3. **Cannibalisation sur le cœur de cible** : cinq pages visent « climatisation Marseille » (accueil, installation, entretien, dépannage-marseille, tarifs), et la page locale de Marseille sert en même temps de page pilier « Dépannage » dans le menu.
4. **Aucun signal de confiance exploitable** : `sameAs` vide, aucune photo de chantier, aucun auteur nommé, aucun profil externe, aucun backlink. Le domaine est jeune et n'a rien à quoi se raccrocher.
5. **Balises non calibrées et dates gelées** : 19 titles sur 23 dépassent 60 caractères, 20 meta descriptions sur 23 dépassent 160 caractères, et les dates affichées comme les `lastmod` du sitemap sont restées au 23 avril ou au 15 juin 2026 alors que le contenu a été refondu le 23 septembre.

Les trois raisons de la bonne visibilité LLM :

1. `llms.txt` et `climurgence.md` sont servis avec le bon `Content-Type`, structurés en questions-réponses courtes, et donnent le modèle économique, les prix et la zone sans ambiguïté.
2. `robots.txt` autorise explicitement les trente-deux robots utiles, dont Bingbot, OAI-SearchBot, GPTBot, ClaudeBot, PerplexityBot et Google-Extended : aucune règle bloquante.
3. Les 23 pages sont du HTML statique servi directement, sans JavaScript de rendu, avec 96 questions FAQ balisées en `FAQPage` et des réponses tenant en une phrase avant le détail.

---

## 2. Inventaire des pages

23 pages HTML, toutes indexables (`index, follow`), toutes canoniques d'elles-mêmes, toutes présentes dans le sitemap, aucun lien interne cassé, aucune page orpheline.

| URL | Title (car.) | Desc (car.) | H1 | Mots | Liens entrants | Liens sortants | Profondeur | Date affichée |
|---|---|---|---|---|---|---|---|---|
| `/` | 83 | 243 | Installation, Dépannage et Entretien de Climatisation à Marseille et en PACA | 1 233 | 22 | 14 | 0 | aucune |
| `/installation-climatisation/` | 74 | 221 | Installation climatisation à Marseille et PACA — pose clé en main | 2 782 | 22 | 14 | 1 | 24 avril 2026 |
| `/depannage-clim-marseille/` | 78 | 194 | Dépannage climatisation à Marseille | 1 480 | 22 | 14 | 1 | 23 avril 2026 |
| `/entretien-climatisation/` | 72 | 159 | Entretien climatisation à Marseille et PACA — révision annuelle dès 119 € | 1 976 | 22 | 14 | 1 | 23 avril 2026 |
| `/tarifs/` | 67 | 174 | Tarifs Dépannage Climatisation Marseille et PACA | 1 330 | 22 | 14 | 1 | aucune |
| `/faq/` | 65 | 166 | FAQ climatisation — vos questions, nos réponses | 4 819 | 22 | 14 | 1 | 23 avril 2026 |
| `/guide/` | 71 | 155 | Guide complet de la réglementation climatisation en France | 1 908 | 22 | 14 | 1 | 23 avril 2026 |
| `/notre-reseau/` | 54 | 215 | Notre réseau de techniciens partenaires | 1 024 | 22 | 14 | 1 | 23 septembre 2026 |
| `/zone-intervention/` | 73 | 185 | Zones couvertes par notre réseau de techniciens partenaires | 640 | 22 | 20 | 1 | 23 avril 2026 |
| `/contact/` | 57 | 173 | Contact — parlons de votre besoin | 698 | 22 | 20 | 1 | 24 avril 2026 |
| `/blog/` | 72 | 168 | Blog ClimUrgence — conseils et astuces climatisation | 396 | 22 | 16 | 1 | 24 avril 2026 |
| `/devenir-partenaire/` | 63 | 194 | Techniciens et installateurs : rejoignez le réseau Clim Urgence | 588 | 22 | 14 | 1 | 23 septembre 2026 |
| `/depannage-clim-aix-en-provence/` | 84 | 216 | Dépannage climatisation à Aix-en-Provence | 1 309 | 2 | 15 | 2 | 23 avril 2026 |
| `/depannage-clim-toulon/` | 75 | 205 | Dépannage climatisation à Toulon | 1 271 | 2 | 15 | 2 | 23 avril 2026 |
| `/depannage-clim-hyeres/` | 75 | 204 | Dépannage climatisation à Hyères | 1 218 | 2 | 15 | 2 | 23 avril 2026 |
| `/depannage-clim-vitrolles/` | 78 | 211 | Dépannage climatisation à Vitrolles | 1 172 | 2 | 15 | 2 | 23 avril 2026 |
| `/depannage-clim-aubagne/` | 76 | 200 | Dépannage climatisation à Aubagne | 1 170 | 2 | 15 | 2 | 23 avril 2026 |
| `/depannage-clim-la-ciotat/` | 78 | 203 | Dépannage climatisation à La Ciotat | 1 149 | 2 | 15 | 2 | 23 avril 2026 |
| `/blog/clim-souffle-chaud/` | 77 | 170 | Pourquoi ma climatisation souffle chaud ? | 1 718 | 1 | 15 | 2 | 24 avril 2026 |
| `/blog/code-erreur-e3-daikin/` | 75 | 159 | Code erreur E3 sur climatisation Daikin | 1 818 | 1 | 15 | 2 | 24 avril 2026 |
| `/cgv/` | 80 | 182 | Conditions générales d'utilisation du service de mise en relation | 1 269 | 22 | 14 | 1 | 23 septembre 2026 |
| `/confidentialite/` | 42 | 162 | Politique de confidentialité | 888 | 22 | 14 | 1 | 23 septembre 2026 |
| `/mentions-legales/` | 30 | 182 | Mentions légales | 592 | 22 | 14 | 1 | 23 septembre 2026 |

Lecture : les 12 pages du menu et du pied de page reçoivent 22 liens entrants chacune, c'est-à-dire uniquement la navigation globale. Les six pages locales hors Marseille n'ont que 2 liens entrants (depuis `/zone-intervention/` et `/contact/`) et les deux articles de blog un seul (depuis `/blog/`). Aucune page du site n'est mise en avant par un lien contextuel dans un corps de texte.

Volume total : environ 33 000 mots sur 23 pages. La FAQ à elle seule en représente 15 %.

---

## 3. SEO technique

### 3.1 Rendu et codes HTTP

Le site est du HTML statique servi directement par Vercel, sans dépendance au JavaScript pour le contenu. Temps de réponse serveur mesuré : 20 ms. `js/main.js` est chargé en `defer` et ne sert qu'au thème, au menu et au formulaire.

Codes relevés en production le 23 septembre 2026 :

| URL testée | Code | Destination |
|---|---|---|
| `https://climurgence.com/` | 200 | — |
| `http://climurgence.com/` | 308 | `https://climurgence.com/` |
| `https://www.climurgence.com/` | pas de résolution DNS | — |
| `https://climurgence.com/faq/` | **308** | `https://climurgence.com/faq` |
| `https://climurgence.com/faq` | 200 | — |
| `https://climurgence.com/depannage-clim-marseille/` | **308** | sans slash |
| `https://climurgence.com/index.html` | 308 | `/` |
| `https://climurgence.com/contrats-pro` | 301 | `/notre-reseau` |
| `https://climurgence.com/depannage` | **308** | `/depannage-clim-marseille` |
| `https://climurgence.com/installation` | **308** | `/installation-climatisation` |
| `https://climurgence.com/urgence` | **308** | `/depannage-clim-marseille` |
| `https://climurgence.com/page-inexistante` | 404 | corps `text/plain`, 79 octets |

C'est le point le plus grave de l'audit. `vercel.json` ligne 3 déclare `"trailingSlash": false`, ce qui force toutes les URL vers la forme sans slash. Or :

- 583 liens internes sur 673 portent un slash final (`grep -rho 'href="/[a-z0-9-]*/"'`) ;
- les 23 `<link rel="canonical">` portent un slash final ;
- les 23 `<loc>` du sitemap portent un slash final ;
- tous les `@id` et `url` des blocs JSON-LD portent un slash final ;
- les 12 liens de `llms.txt` portent un slash final.

Conséquence : Google explore un sitemap dont chaque URL renvoie « Page avec redirection », chaque canonical désigne une URL qui n'est pas celle servie, et chaque parcours interne consomme un saut de redirection. Sur un domaine jeune sans autorité, cela suffit à expliquer une indexation partielle et un classement faible.

Deux corrections possibles, à trancher : soit passer `"trailingSlash": true` (un seul octet dans `vercel.json`, aucune URL du contenu à modifier, et les formes sans slash redirigent alors vers les formes avec slash), soit réécrire les 583 liens, 23 canonical, 23 `<loc>` et tous les `@id`. La première option est nettement moins risquée et je la recommande.

Par ailleurs, cinq des six redirections de `vercel.json` utilisent `"permanent": true`, qui produit un 308 et non le 301 exigé par les règles du dépôt. Seule `/contrats-pro` utilise `"statusCode": 301`.

### 3.2 robots.txt, sitemap, page 404

`robots.txt` : correct et complet. Trente-deux agents explicitement autorisés, `Sitemap` déclaré, clé IndexNow rappelée en commentaire. Aucune règle bloquante. `llms.txt` n'y est pas mentionné, contrairement à `climurgence.md`.

`sitemap.xml` : 24 entrées pour 23 pages HTML, plus `/climurgence.md`. Aucune page manquante, aucune URL non canonique au sens strict — mais les 23 URL de pages redirigent en 308 (voir ci-dessus). Les `lastmod` sont obsolètes : 8 pages au 23 avril, 7 au 24 avril, 5 au 15 juin, 5 au 23 septembre, alors que la refonte de conformité a touché l'ensemble du site le 23 septembre.

Page 404 : c'est la page par défaut de Vercel, servie en `text/plain`, 79 octets, sans en-tête, sans menu, sans lien de retour ni numéro de téléphone. Un visiteur ou un robot qui l'atteint n'a aucun moyen de revenir dans le site.

### 3.3 Duplication et maillage

Aucun lien interne cassé, aucune page orpheline, aucun contenu dupliqué. Les sept pages locales ont été comparées deux à deux sur leur vocabulaire propre, en dehors de l'en-tête, du pied de page et des scripts : la similarité de Jaccard va de 27 % (Aubagne / Marseille) à 37 % (La Ciotat / Toulon). Ce ne sont donc pas des pages satellites, et leur contenu local est réel.

En revanche le maillage est purement structurel. Les 14 à 20 liens sortants de chaque page correspondent au menu et au pied de page. Aucune page ne pousse une autre page depuis son corps de texte, ce qui prive le site de toute hiérarchisation interne.

### 3.4 Performance mobile

Lighthouse 12, profil mobile, throttling simulé, exécuté sur la production :

| Page | Performance | Accessibilité | Bonnes pratiques | SEO | FCP | LCP | TBT | CLS | Poids |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 88 | 97 | 100 | 100 | 3,0 s | 3,0 s | 0 ms | 0 | 102 Kio |
| `/installation-climatisation` | 95 | 95 | — | 100 | 2,4 s | 2,4 s | 0 ms | 0,033 | 105 Kio |
| `/faq` | 90 | 94 | — | 100 | 2,9 s | 2,9 s | 0 ms | 0,028 | 110 Kio |

Le site est très léger et n'a aucun problème d'interactivité. Le seul frein mesuré est le chargement des polices Google : la requête `fonts.googleapis.com/css2` bloque le rendu et coûte **825 ms** à elle seule, `style.css` 167 ms de plus. L'élément LCP est le `<h1>`, donc purement dépendant de l'arrivée de la police. Le fichier `DM Sans` pèse 62,6 Kio, soit 61 % du poids total de la page d'accueil. Héberger les deux polices en local avec `preload` ramènerait le LCP sous 1,5 s.

Images : deux seulement par page, le logo en `webp` (6,8 Kio), avec `width` et `height` déclarés. Aucune image de contenu sur l'ensemble du site. Pas de `loading="lazy"`, ce qui est sans effet ici puisque le logo est au-dessus de la ligne de flottaison.

`style.css` : 40,6 Kio non minifiés, 8,3 Kio transférés en gzip. Économie potentielle mesurée : 2 Kio. Sans intérêt.

### 3.5 Accessibilité ayant un impact SEO

Deux audits en échec sur la page d'accueil :

- **Contrastes insuffisants.** `#1a7ec8` sur fond blanc donne un ratio de 4,31 (minimum AA : 4,5) et touche les `.section-eyebrow` et les `.btn-outline`. Blanc sur `#e8521a` donne 3,71 et touche le bouton de soumission du formulaire ainsi que les trois éléments de l'`urgency-strip`. Le bouton principal de conversion du site est donc sous le seuil.
- **`label-content-name-mismatch`** sur cinq éléments : l'`aria-label` ne contient pas le texte visible du lien (par exemple `aria-label="En savoir plus sur l'installation de climatisation"` sur un lien dont le texte visible est différent). Gêne la commande vocale.

Le reste est propre : `lang="fr"`, lien d'évitement, `role` et `aria-*` cohérents, libellés de formulaire tous associés par `for`/`id`, structure Hn sans saut de niveau.

### 3.6 Open Graph et Twitter

Les 23 pages ont les 11 balises attendues (`og:type`, `og:url`, `og:title`, `og:description`, `og:image`, `og:locale`, `og:site_name`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`). Toutes pointent vers la même image `og-home.webp`. `og:image:width` et `og:image:height` ne sont pas déclarés.

---

## 4. Données structurées

Les 48 blocs JSON-LD du site ont été parsés : **tous sont syntaxiquement valides**. Types présents :

| Type | Pages | Remarque |
|---|---|---|
| `HVACBusiness` | `/`, `/zone-intervention/` | Voir SD-01 |
| `WebSite` | `/` | Correct |
| `WebPage` | 21 pages | Absent de `/depannage-clim-marseille/` |
| `BreadcrumbList` | 23 pages | Correct |
| `FAQPage` | 13 pages, 96 questions | Correct |
| `Service` | 9 pages | Correct |
| `Article` | 3 pages | `author` pointe vers l'entreprise, pas une personne |
| `HowTo` | 3 pages | Correct |
| `OfferCatalog` | `/tarifs/` | Voir SD-05 |
| `ContactPage`, `AboutPage`, `Blog` | 3 pages | Correct |

Points à corriger :

- **SD-01 — `HVACBusiness` pour une plateforme de mise en relation.** `HVACBusiness` est un sous-type de `LocalBusiness` qui désigne une entreprise réalisant des prestations de chauffage et climatisation. Clim Urgence n'en réalise aucune. La description du bloc le dit d'ailleurs explicitement. Cette contradiction interne est exactement le signal que Google utilise pour écarter les agrégateurs du pack local, et elle est en tension avec l'article L121-2 du code de la consommation. `Organization` avec `serviceType` et `areaServed`, complété par des blocs `Service` dont le `provider` reste l'organisation intermédiaire, décrit la réalité sans perdre d'information.
- **SD-02 — adresse incohérente.** Le bloc déclare `addressLocality: "Marseille"`, `postalCode: "13000"`, sans `streetAddress`, et des coordonnées `43.2965 / 5.3698` qui correspondent au centre de Marseille. Les mentions légales et `llms.txt` donnent « 5 avenue Edouard Branly, 13009 Marseille ». Trois informations d'adresse différentes coexistent donc sur le site.
- **SD-03 — `sameAs` est un tableau vide.** Aucun profil externe rattaché. C'est le principal frein à la reconnaissance de Clim Urgence comme entité par Google et par les LLM.
- **SD-04 — deux graphies de la marque.** « ClimUrgence » apparaît 202 fois, « Clim Urgence » 290 fois, « CLIMURGENCE » 8 fois. Le `name` du JSON-LD est `"ClimUrgence"` alors que l'accroche officielle et `llms.txt` utilisent « Clim Urgence ».
- **SD-05 — `OfferCatalog` avec des prix fermes.** Les offres de `/tarifs/` déclarent `"price": 149` etc. Or la page elle-même précise qu'il s'agit de prix indicatifs constatés chez les partenaires et que seul le devis fait foi. Un `price` schema.org est une offre ferme. Il faut passer à `PriceSpecification` avec `minPrice`, ou retirer les valeurs.
- **SD-06 — `/depannage-clim-marseille/` n'a pas de bloc `WebPage`**, contrairement aux six autres pages locales.
- **SD-07 — aucun auteur identifié.** Les trois `Article` désignent l'entreprise comme auteur. Pour l'E-E-A-T, une personne nommée avec une page de présentation serait plus solide.

Types manquants utiles : `Person` pour l'auteur des contenus réglementaires, `ImageObject` sur des photos réelles de chantier, `Review` ou `AggregateRating` uniquement le jour où des avis authentiques existeront (à ne pas inventer).

---

## 5. Sémantique et contenu

### 5.1 Mot-clé principal par page et cannibalisation

| Page | Intention visée | Cannibalisation |
|---|---|---|
| `/` | marque + « climatisation Marseille » générique | Concurrence `/depannage-clim-marseille/` et `/installation-climatisation/` |
| `/installation-climatisation/` | « installation climatisation Marseille » | Concurrence l'accueil |
| `/depannage-clim-marseille/` | « dépannage climatisation Marseille » | Sert aussi de page pilier « Dépannage » dans le menu |
| `/entretien-climatisation/` | « entretien climatisation Marseille » | Concurrence l'accueil sur Marseille |
| `/tarifs/` | « prix dépannage climatisation » | Le title et le H1 ignorent l'installation que la page couvre |

Cinq pages contiennent « Marseille » dans leur H1 ou leur title. Google devra choisir seul laquelle positionner, et choisira mal.

Le problème d'architecture le plus structurant : **il n'existe pas de page pilier « dépannage »**. Le menu envoie « Dépannage » vers `/depannage-clim-marseille/`, qui est à la fois la page de service et la page locale de Marseille. Le silo dépannage n'a donc pas de tête.

### 5.2 Couverture de l'univers « pose »

Ce qui existe et tient la route :

- `/installation-climatisation/` : 2 782 mots, la page la plus fournie du site. Couvre monosplit, bisplit et multisplit, pompe à chaleur réversible, gainable, remplacement, les six étapes de la pose, et huit sous-sections sur la copropriété (règlement, parties communes, syndic, bruit, condensats, immeubles protégés, répartition des démarches, maison individuelle). C'est une bonne base.
- `/tarifs/` : trois prestations d'installation avec détail de ce qui est inclus.
- `/faq/` : 45 questions dont une partie sur la pose.

Ce qui manque entièrement :

| Sujet | État |
|---|---|
| installation climatisation + commune | **Aucune page.** Zéro pour les 23 communes. |
| prix installation climatisation (page dédiée) | Absent. Le title de `/tarifs/` ne parle que de dépannage. |
| climatisation réversible pour se chauffer l'hiver | Absent. C'est l'angle de la saison qui commence. |
| multisplit / bisplit (page dédiée) | Traité en trois paragraphes sur la page installation. |
| gainable (page dédiée) | Traité en un paragraphe. |
| remplacement d'une clim existante | Traité en un paragraphe. |
| clim en appartement et copropriété | Bien traité, mais enfoui dans la page installation, sans URL propre. |
| quelle puissance pour quelle surface | Présent uniquement dans `llms.txt` et la FAQ, aucune page. |
| marques (Daikin, Mitsubishi, Atlantic…) | Listes de marques, aucune page par marque. |
| aides et subventions | Volontairement absent. Correct : Clim Urgence n'est pas RGE. |

### 5.3 Signaux de confiance

Solide : `/notre-reseau/` explique le fonctionnement, les cinq critères de sélection vérifiés, l'attribution des demandes, la rémunération par commission et le circuit de réclamation. `/guide/` cite correctement le décret n° 2020-912, les articles R224-44 et suivants, R224-45 et suivants, R543-75 à R543-123 et le règlement (UE) 2024/573.

Fragile :

- Aucune photo. Les 23 pages ne contiennent que le logo, deux fois. Ni chantier, ni équipement, ni visage.
- Aucun auteur nommé, aucune page « qui écrit ces contenus ».
- Aucun avis client, sur le site comme ailleurs. C'est cohérent avec la règle de ne rien inventer, mais cela laisse un vide.
- Dates affichées gelées en avril et juin 2026 sur les pages refondues en septembre.
- `sameAs` vide : aucune existence rattachée hors du domaine.

### 5.4 Chiffres à vérifier ou à sourcer

| Affirmation | Emplacement | Statut |
|---|---|---|
| « une fuite d'eau provient 9 fois sur 10 d'un bac à condensats bouché » | `faq/index.html:452` et `:753` | Statistique non sourcée |
| « environ 70 % du parc aubagnais est constitué de maisons individuelles » | `depannage-clim-aubagne/index.html:685` | Vérifiable sur les données INSEE du logement, à sourcer ou à retirer |
| « 80 % » | `entretien-climatisation/index.html:943` | À vérifier |
| « amende de 1 500 € à 3 000 € » pour non-respect de l'obligation d'entretien | `guide/index.html:452` | Non rattaché à un article. Les articles R224-44 et suivants n'énoncent pas ce montant : à sourcer précisément ou à reformuler |

### 5.5 Blog et guide

Le blog compte deux articles, tous deux sur le dépannage (« clim souffle chaud », « code erreur E3 Daikin »), publiés le 24 avril 2026 et jamais mis à jour depuis. Ils sont bien construits (1 700 à 1 800 mots, `Article` + `HowTo` + `FAQPage`) mais reçoivent un seul lien entrant et ne renvoient vers aucune page de service dans leur corps de texte. Aucun contenu sur la pose.

`/guide/` est la meilleure page du site sur le plan de la fiabilité, mais elle est purement réglementaire et ne pousse vers aucune page commerciale.

---

## 6. SEO local sans fiche Google Business Profile

La contrainte est réelle : les règles de Google excluent les plateformes de génération de prospects des fiches d'établissement. La stratégie locale doit donc passer par l'organique, Bing, les annuaires et les LLM.

État actuel :

- Sept pages locales, toutes « dépannage », toutes réellement rédigées (27 à 37 % de vocabulaire commun seulement), avec un contenu local crédible : arrondissements de Marseille, quartiers, littoral sud et corrosion saline, bâti ancien du centre, mistral et fixations, parc de maisons individuelles à Aubagne.
- Seize communes prioritaires sont citées dans les listes de `/zone-intervention/` et dans l'`areaServed` du JSON-LD, mais n'ont aucune page : Martigues, Cassis, Istres, Marignane, Salon-de-Provence, Allauch, Plan-de-Cuques, Septèmes-les-Vallons, La Seyne-sur-Mer, Saint-Cyr-sur-Mer, Bandol, Sanary-sur-Mer, Ollioules, Six-Fours-les-Plages, La Valette-du-Var, La Garde.
- Cohérence des coordonnées : le téléphone `06 43 72 18 50` est identique partout, l'e-mail aussi. En revanche l'adresse existe en trois versions (JSON-LD sans rue et en 13000, mentions légales en 13009, `llms.txt` en 13009) et la marque en deux graphies. Avant toute inscription en annuaire, il faut figer une forme unique et strictement identique.
- Le numéro est un mobile. Sans fiche Google, un numéro géographique 04 renforcerait la crédibilité locale, mais ce n'est pas bloquant.

---

## 7. Visibilité LLM (GEO)

### 7.1 Ce qui fonctionne

`robots.txt` autorise tous les robots utiles, sans exception : Bingbot, Slurp, DuckDuckBot, GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, CCBot, Meta-ExternalAgent, Amazonbot, cohere-ai, YouBot, Diffbot, Bytespider. Aucune règle bloquante.

`llms.txt` (14,6 Kio) et `climurgence.md` (14,1 Kio) sont servis avec le bon `Content-Type`, structurés en titres courts, tableaux de prix et questions-réponses directes. Le modèle de mise en relation y est répété sans ambiguïté. C'est très probablement ce qui explique les citations actuelles.

Les contenus sont extractibles : réponse en une phrase puis détail, `answer-capsule` en haut de la page d'accueil, 96 questions `FAQPage`, tableaux de prix, listes d'étapes numérotées, références réglementaires citées.

### 7.2 Ce qui doit être corrigé

- **`llms.txt` contredit le site sur la réglementation.** Ligne 152 : « La réglementation française impose un entretien périodique pour les systèmes de climatisation dont la charge en fluide frigorigène dépasse un certain seuil […]. La majorité des climatiseurs monosplit ou bisplit résidentiels ne sont pas concernés par l'obligation légale. » C'est faux, et `/guide/` comme `/entretien-climatisation/` disent l'inverse et disent juste : l'entretien périodique du décret n° 2020-912 dépend de la **puissance nominale** (4 kW à 70 kW), pas de la charge en fluide ; c'est le contrôle d'étanchéité qui dépend de la charge, en tonnes équivalent CO2. La plupart des monosplits résidentiels dépassent 4 kW et **sont** soumis à l'obligation. Un LLM qui lit `llms.txt` diffusera une information réglementaire fausse au nom de Clim Urgence.
- **`llms.txt` contient une promesse de délai et de prix.** Ligne 172 : « ClimUrgence intervient sous 1 heure à Marseille pour 119 € TTC ». Cumul de trois infractions aux règles du dépôt : promesse de délai, promesse de prix, et la plateforme présentée comme intervenant elle-même.
- **Quatre autres formulations de `llms.txt` font de Clim Urgence un prestataire technique** : « ClimUrgence diagnostique et répare sur place ces codes erreur » (l. 164), « ClimUrgence intervient sur toutes les grandes marques » (l. 160), « coûte à partir de 119 € TTC chez ClimUrgence » (l. 148), « le délai entre le devis validé et l'installation est en moyenne de 5 à 10 jours ouvrés chez ClimUrgence » (l. 176, délai et chiffre non sourcé). À noter que `climurgence.md` est propre sur ces points : c'est `llms.txt` seul qui est en retard d'une révision.
- **Onze pages sur vingt-trois sont absentes de `llms.txt`**, dont les deux plus citables : `/faq/` (4 819 mots, 45 questions) et `/guide/` (réglementation sourcée). Manquent aussi `/blog/` et ses deux articles, et les six pages locales hors Marseille.
- **Les douze liens de `llms.txt` portent un slash final** et répondent donc en 308.
- **IndexNow n'est pas réellement implémenté.** La clé `climurgence2026a8f3c7d21b9` est bien servie à la racine et déclarée en `<meta>` sur les 23 pages, mais aucun script, aucun hook de déploiement et aucune commande n'appelle l'API IndexNow. Aucune URL n'a donc jamais été soumise à Bing, et par ricochet la fraîcheur du site n'est pas signalée à l'index qui alimente une partie des réponses de ChatGPT.

### 7.3 Les vingt questions types et la page qui devrait être citée

| # | Question posée à un assistant | Page qui devrait être citée | État |
|---|---|---|---|
| 1 | Qui appeler pour installer une clim à Marseille ? | `/installation-climatisation/` | Couvert, mais sans page locale Marseille dédiée à la pose |
| 2 | Combien coûte la pose d'une clim à Toulon ? | page prix installation + page Toulon pose | **Manque les deux.** `/tarifs/` répond partiellement, sans dimension locale |
| 3 | Quel installateur de climatisation à Aix-en-Provence ? | page installation Aix | **Manque** |
| 4 | Combien coûte une clim réversible installée ? | page prix installation | **Manque** (partiel dans `/tarifs/`) |
| 5 | Puis-je installer une clim en appartement en copropriété ? | page copropriété dédiée | Contenu présent dans `/installation-climatisation/`, pas d'URL propre |
| 6 | Faut-il l'accord du syndic pour poser une clim ? | idem | Idem |
| 7 | Quelle puissance de clim pour 30 m² ? | page dimensionnement | **Manque.** Réponse présente dans `llms.txt` et la FAQ seulement |
| 8 | Monosplit ou multisplit, que choisir ? | page types d'installation | Trois paragraphes seulement |
| 9 | Peut-on se chauffer avec une clim réversible l'hiver ? | page réversible et chauffage | **Manque.** Angle de la saison en cours |
| 10 | Combien coûte un dépannage de clim à Marseille ? | `/tarifs/` et `/depannage-clim-marseille/` | Couvert |
| 11 | Ma clim souffle de l'air chaud, que faire ? | `/blog/clim-souffle-chaud/` | Couvert |
| 12 | Que signifie le code erreur E3 sur une Daikin ? | `/blog/code-erreur-e3-daikin/` | Couvert |
| 13 | L'entretien de clim est-il obligatoire en France ? | `/guide/` et `/entretien-climatisation/` | Couvert sur le site, **faux dans `llms.txt`** |
| 14 | Tous les combien faut-il entretenir une climatisation ? | `/entretien-climatisation/` | Couvert |
| 15 | Qui peut recharger une clim en gaz R32 ? | `/guide/` | Couvert |
| 16 | Quelle différence entre R32 et R410A ? | `/guide/`, `llms.txt` | Couvert |
| 17 | Un dépanneur clim qui intervient le dimanche à Hyères ? | `/depannage-clim-hyeres/` | Couvert |
| 18 | Qui installe une clim à Martigues / Cassis / Six-Fours ? | pages locales | **Manque pour 16 communes** |
| 19 | Comment remplacer une vieille climatisation ? | page remplacement | Un paragraphe seulement |
| 20 | Clim Urgence est-il fiable, comment ça marche ? | `/notre-reseau/` | Couvert et bien traité |

Bilan : huit questions sur vingt n'ont pas de page à citer, et toutes relèvent de l'univers « pose ».

---

## 8. Conversion

**Il n'y a aucun outil de mesure sur le site.** Recherche exhaustive de `gtag`, `googletagmanager`, `dataLayer`, `analytics`, `plausible`, `matomo`, `umami`, `clarity`, `fbq`, `hotjar`, `@vercel/analytics`, `@vercel/speed-insights` sur l'ensemble des fichiers HTML, JS et JSON : zéro occurrence. Aucune audience mesurée, aucun clic téléphone compté, aucun envoi de formulaire tracé, aucune source de trafic connue. Toute décision d'arbitrage sur les six prochains mois se ferait à l'aveugle. C'est le point le plus critique après la question des redirections.

Deux obstacles techniques s'y ajoutent :

- La `Content-Security-Policy` de `vercel.json` limite `script-src` à `'self'`, `'unsafe-inline'`, `fonts.googleapis.com` et `cdnjs.cloudflare.com`. Aucun outil de mesure tiers ne pourra se charger sans modifier cette directive.
- Le formulaire ne redirige pas vers une page de remerciement : en cas de succès, `js/main.js` remplace le contenu du `<form>` par un message (lignes 152 à 157). Il n'y a donc pas d'URL de conversion, et il faudra pousser un événement explicite à cet endroit.

Le reste est correct :

- Le numéro est présent cinq fois sur la page d'accueil, dans l'en-tête, le hero, le pied de page et un bouton flottant `.mobile-cta` affiché uniquement sous 768 px.
- Le formulaire comporte un piège à robots (`website` en `tabindex="-1"`), une validation côté client et un rendu d'erreur propre.
- L'API `/api/lead` envoie un récapitulatif par e-mail via Resend, avec limitation de débit Redis.

Un point de friction : le formulaire exige cinq champs (nom, téléphone, code postal, e-mail, type de besoin) avant l'envoi. Pour une demande urgente sur mobile, c'est beaucoup. Le contraste du bouton de soumission est par ailleurs sous le seuil AA (3,71).

---

## 9. Tableau des failles

Impact : **Critique** = bloque le référencement ou la décision ; **Majeur** = perte mesurable ; **Mineur** = finition.

| ID | Catégorie | Constat | Preuve | Impact | Correction proposée | Effort |
|---|---|---|---|---|---|---|
| TECH-01 | Technique | `trailingSlash: false` alors que 583 liens, 23 canonical, 23 `<loc>` et tous les `@id` portent un slash final : 100 % des URL internes répondent en 308 | `vercel.json:3` ; `curl https://climurgence.com/faq/` → 308 | **Critique** | Passer `"trailingSlash": true`, puis revérifier les 23 URL en production | Faible |
| TECH-02 | Technique | Les 23 URL du sitemap redirigent, Search Console les classera en « Page avec redirection » | `sitemap.xml`, 23 `<loc>` sur 23 | **Critique** | Résolu par TECH-01 | Faible |
| CONV-01 | Conversion | Aucun outil de mesure d'audience sur le site | Recherche `gtag|dataLayer|plausible|matomo|analytics` : 0 occurrence | **Critique** | Installer un outil respectueux du RGPD, déclarer les événements `clic_telephone`, `envoi_formulaire`, `clic_whatsapp` | Moyen |
| GEO-01 | GEO / conformité | `llms.txt` affirme que l'obligation d'entretien dépend de la charge en fluide et que la plupart des monosplits n'y sont pas soumis. Faux, et contraire à `/guide/` | `llms.txt:152` vs `entretien-climatisation/index.html:725-792` | **Critique** | Réécrire sur la base du décret n° 2020-912, seuil 4 kW à 70 kW | Faible |
| GEO-02 | GEO / conformité | `llms.txt` : « ClimUrgence intervient sous 1 heure à Marseille pour 119 € TTC » | `llms.txt:172` | **Critique** | Reformuler selon les règles du dépôt, sans délai ni prix engageant | Faible |
| SEM-01 | Sémantique | Aucune page « installation + commune », pour aucune des 23 communes | Analyse de couverture, section 5.2 | **Critique** | Créer le silo installation par vagues de 3 à 5 communes (phase 3) | Fort |
| TECH-03 | Technique | 5 redirections sur 6 en `"permanent": true`, donc 308 et non 301 | `vercel.json:redirects` | Majeur | Remplacer par `"statusCode": 301` | Faible |
| TECH-04 | Technique | Page 404 par défaut de Vercel, `text/plain`, 79 octets, sans navigation | `curl https://climurgence.com/page-inexistante` | Majeur | Créer un `404.html` avec en-tête, menu, numéro et liens vers les pages piliers | Faible |
| TECH-05 | Performance | Google Fonts bloque le rendu : 825 ms sur le chemin critique, LCP à 3,0 s sur mobile | Lighthouse `render-blocking-resources` | Majeur | Héberger `Bebas Neue` et `DM Sans` en local, `preload` + `font-display: swap` | Moyen |
| TECH-06 | Accessibilité | Contrastes sous AA : `#1a7ec8` sur blanc = 4,31 ; blanc sur `#e8521a` = 3,71, dont le bouton d'envoi du formulaire | Lighthouse `color-contrast` | Majeur | Assombrir les deux teintes pour atteindre 4,5 | Faible |
| TECH-08 | Technique | `lastmod` et dates affichées gelées en avril et juin 2026 alors que le site a été refondu le 23 septembre | `sitemap.xml` ; 11 pages affichent « 23 avril 2026 » | Majeur | Aligner `lastmod`, `dateModified` et date affichée sur la date réelle de modification | Faible |
| SD-01 | Données structurées | `HVACBusiness` déclaré pour une plateforme qui ne réalise aucune prestation, en contradiction avec sa propre `description` | `index.html`, bloc `#business` | Majeur | Basculer sur `Organization` + blocs `Service`, conserver `areaServed` et les horaires | Moyen |
| SD-02 | Données structurées | Trois adresses différentes sur le site : JSON-LD sans rue en 13000, mentions légales en 13009, `llms.txt` en 13009 | `index.html` bloc `#business` vs `mentions-legales/index.html` | Majeur | Figer une adresse unique et la reporter partout | Faible |
| SD-03 | Données structurées | `sameAs` est un tableau vide : aucune existence hors du domaine | `grep '"sameAs": \[\]'` | Majeur | Le renseigner dès que les profils externes du plan hors site existent | Faible |
| SD-04 | Données structurées | Marque écrite « ClimUrgence » (202 fois) et « Clim Urgence » (290 fois), le JSON-LD retient la première, l'accroche officielle la seconde | Comptage sur `*.html`, `*.txt` | Majeur | Choisir « Clim Urgence », conserver « ClimUrgence » en `alternateName` | Moyen |
| SD-05 | Données structurées | `OfferCatalog` avec des `price` fermes alors que la page parle de prix indicatifs | `tarifs/index.html`, bloc `#catalog` | Majeur | Remplacer `price` par `PriceSpecification` / `minPrice` | Faible |
| SEM-02 | Sémantique | Pas de page pilier « dépannage » : le menu envoie vers la page locale de Marseille | `index.html`, `<nav>` | Majeur | Créer `/depannage-climatisation/` et réserver `/depannage-clim-marseille/` au local | Moyen |
| SEM-03 | Sémantique | `/tarifs/` a un title et un H1 « Tarifs Dépannage » alors que la page couvre aussi l'installation et l'entretien | `tarifs/index.html:H1` | Majeur | Reformuler pour couvrir les trois univers, ou créer une page prix installation | Faible |
| SEM-04 | Sémantique | Cinq pages visent « climatisation Marseille » dans leur H1 ou leur title | Section 5.1 | Majeur | Spécialiser chaque title sur une intention unique | Moyen |
| SEM-05 | Sémantique | 19 titles sur 23 dépassent 60 caractères (de 65 à 84), 20 descriptions sur 23 dépassent 160 caractères (jusqu'à 243) | Tableau section 2 | Majeur | Recalibrer, en listant chaque avant/après | Moyen |
| SEM-06 | Sémantique | Univers « pose » sous-couvert : ni prix installation, ni réversible et chauffage, ni copropriété en page propre, ni dimensionnement, ni pages par type ou par marque | Section 5.2 | Majeur | Silo installation complet (phase 2) | Fort |
| SEM-07 | Contenu | Blog réduit à 2 articles, tous deux sur le dépannage, non mis à jour depuis avril 2026, 1 lien entrant chacun | `/blog/` | Majeur | Calendrier éditorial et maillage contextuel | Fort |
| SEM-08 | E-E-A-T | Aucun auteur nommé, aucun profil externe, aucun avis, dates gelées | Sections 5.3 et 4 | Majeur | Page auteur, `Person` en JSON-LD, dates réelles, avis authentiques via le plan hors site | Moyen |
| SEM-09 | Contenu | Aucune image de contenu sur les 23 pages : seulement le logo, deux fois par page | Extraction de toutes les balises `<img>` | Majeur | Photos réelles de chantiers partenaires, avec `alt` descriptifs sans emoji | Moyen |
| SEM-10 | Conformité | Quatre chiffres affirmés sans source, dont une amende de 1 500 à 3 000 € rattachée à aucun article | `faq:452`, `aubagne:685`, `entretien:943`, `guide:452` | Majeur | Sourcer sur texte officiel ou INSEE, sinon retirer | Faible |
| GEO-03 | GEO / conformité | Quatre formulations de `llms.txt` présentent Clim Urgence comme réalisant les prestations, dont un délai de « 5 à 10 jours ouvrés » non sourcé | `llms.txt:148,160,164,176` | Majeur | Aligner `llms.txt` sur `climurgence.md`, déjà conforme | Faible |
| GEO-04 | GEO | 11 pages sur 23 absentes de `llms.txt`, dont `/faq/` et `/guide/` | Comparaison liens `llms.txt` / pages | Majeur | Compléter la liste des pages | Faible |
| GEO-05 | GEO | IndexNow déclaré mais jamais appelé : clé servie, `<meta>` présent, aucun envoi à l'API | Recherche sur `*.js`, `*.json` | Majeur | Script de ping au déploiement, sur les URL modifiées | Moyen |
| LOC-01 | Local | 16 communes prioritaires citées dans `areaServed` et `/zone-intervention/` sans aucune page | Section 6 | Majeur | Pages locales par vagues, avec contenu réellement local | Fort |
| CONV-02 | Conversion | Pas de page de remerciement ni d'événement au succès du formulaire | `js/main.js:140-157` | Majeur | Pousser un événement de conversion à cet endroit | Faible |
| CONV-03 | Conversion | Cinq champs obligatoires avant envoi | `index.html`, `<form>` | Majeur | Rendre l'e-mail facultatif côté client si le téléphone est fourni, en cohérence avec l'API | Faible |
| TECH-11 | Technique | La CSP n'autorise aucun domaine d'outil de mesure dans `script-src` | `vercel.json`, en-tête CSP | Majeur | Ajouter le domaine retenu au moment de l'installation | Faible |
| TECH-07 | Accessibilité | `aria-label` ne contient pas le texte visible sur 5 éléments | Lighthouse `label-content-name-mismatch` | Mineur | Faire commencer l'`aria-label` par le texte visible | Faible |
| TECH-09 | Technique | `www.climurgence.com` ne résout pas | `curl` : pas de réponse DNS | Mineur | Ajouter l'enregistrement et la redirection 301 vers le domaine nu | Faible |
| TECH-12 | Technique | La règle de cache `"/(.*).html"` ne s'applique pas aux URL propres : le HTML est servi en `max-age=0` | En-têtes de production | Mineur | Corriger la source de la règle | Faible |
| SD-06 | Données structurées | `/depannage-clim-marseille/` n'a pas de bloc `WebPage`, contrairement aux six autres pages locales | Extraction JSON-LD | Mineur | Ajouter le bloc | Faible |
| SD-07 | Données structurées | Les trois `Article` désignent l'entreprise comme auteur, aucun `Person` | Extraction JSON-LD | Mineur | Ajouter un auteur nommé | Faible |
| GEO-06 | GEO | Les 12 liens de `llms.txt` portent un slash final et répondent en 308 | `llms.txt:184-198` | Mineur | Résolu par TECH-01 | Faible |
| GEO-07 | GEO | `llms.txt` n'est pas mentionné dans `robots.txt`, contrairement à `climurgence.md` | `robots.txt` | Mineur | Ajouter la ligne de commentaire | Faible |
| TECH-10 | Performance | OG image unique pour les 23 pages, sans `og:image:width` ni `og:image:height` | Extraction des métadonnées | Mineur | Déclarer les dimensions, varier l'image sur les pages piliers | Faible |
| CONF-01 | Conformité | `README.md` contient 15 emojis, en contradiction avec les règles du dépôt | `README.md:7,13,26,39,…` | Mineur | Les retirer | Faible |

### Failles de conformité détectées au passage

Elles n'entrent pas dans le périmètre SEO mais relèvent des règles permanentes du dépôt, et je les signale parce qu'elles sont visibles publiquement :

| ID | Constat | Preuve |
|---|---|---|
| CONF-02 | « révision annuelle dès 119 € » figure dans le H1, le title, la meta description, l'`og:title` et le `twitter:title` de la page entretien : promesse de prix au nom de Clim Urgence | `entretien-climatisation/index.html:7,12,19,707` |
| CONF-03 | « Le protocole ClimUrgence en 8 étapes » présente la plateforme comme exécutant la prestation | `entretien-climatisation/index.html:801` |
| CONF-04 | « Les 5 engagements ClimUrgence », dont « Tarifs publiés publiquement sur notre site, identiques pour tous les clients, sans devis opaque » et « Rapport d'intervention écrit remis à chaque visite » : engagements pris au nom des partenaires, et contradiction directe avec la règle des prix indicatifs | `entretien-climatisation/index.html:925` |

---

## 10. Données qu'Arthur doit récupérer lui-même

Ces éléments ne sont pas mesurables depuis le code. Ils conditionnent la phase 2.

**1. Google Search Console** — https://search.google.com/search-console

Si la propriété n'existe pas, créer une propriété de type domaine (`climurgence.com`) et valider par enregistrement DNS chez OVH. Puis exporter :

- Indexation > Pages : le décompte exact par motif, en particulier « Page avec redirection », « Détectée, actuellement non indexée » et « Explorée, actuellement non indexée ». C'est ce tableau qui confirmera l'ampleur de TECH-01.
- Performances > Résultats de recherche, 3 derniers mois, export des requêtes et des pages avec impressions, clics, CTR et position moyenne.
- Sitemaps : la date de dernière lecture et le nombre d'URL découvertes.
- Expérience > Signaux web essentiels, vue mobile.

**2. Bing Webmaster Tools** — https://www.bing.com/webmasters

Déterminant : Bing alimente une partie des réponses de ChatGPT. L'import depuis Search Console évite de revalider. Exporter :

- Site Explorer : nombre d'URL découvertes et indexées.
- Search Performance : requêtes et pages.
- Backlinks : le rapport est gratuit et plus généreux que celui de Google.
- IndexNow : vérifier que la clé `climurgence2026a8f3c7d21b9` est reconnue, et le nombre d'URL soumises. Ce sera à zéro.

**3. Backlinks** — un outil gratuit au choix

- Ahrefs Webmaster Tools (gratuit après validation de la propriété) : profil de liens complet.
- Ou le rapport backlinks de Bing Webmaster Tools, déjà disponible au point 2.

À produire : la liste des domaines référents existants, s'il y en a, et leur date d'acquisition.

**4. Informations locales à fournir ou valider**

Nécessaires pour rédiger des pages locales réellement uniques, sans rien inventer :

- Pour chacune des 16 communes sans page : y a-t-il déjà au moins un technicien partenaire actif ? Sur quelles prestations ?
- Répartition réelle des demandes reçues par commune et par type (pose, dépannage, entretien), même approximative.
- Les prix indicatifs constatés varient-ils selon la commune ou la distance ?
- Photos exploitables de chantiers partenaires, avec l'autorisation du partenaire et du client.
- Des avis clients authentiques existent-ils quelque part, et sur quelle plateforme ?

**5. Décisions à prendre avant la phase 2**

- La graphie officielle de la marque : « Clim Urgence » ou « ClimUrgence ». Elle devra être identique sur le site, dans les annuaires et dans les données structurées.
- L'adresse à publier partout, à l'identique.
- L'outil de mesure retenu.
- Faut-il ouvrir un numéro géographique 04 en complément du mobile ?

---

## 11. Ce qui a été vérifié et qui est sain

Pour mémoire, afin de ne rien dégrader en phase 3 :

- Les 48 blocs JSON-LD sont syntaxiquement valides.
- Aucun lien interne cassé, aucune page orpheline, aucune page absente du sitemap.
- Les sept pages locales ne sont pas des pages satellites (27 à 37 % de vocabulaire commun seulement).
- `robots.txt` n'écarte aucun robot utile.
- Aucun emoji sur les pages publiées ni dans `llms.txt`, `climurgence.md`, `humans.txt` ou `robots.txt`. Le caractère `✓` de `guide/index.html:212` et de `css/style.css:1243` est un signe typographique Unicode, autorisé par les règles du dépôt.
- Aucune mention de RGE, MaPrimeRénov', prime énergie, déplacement offert ou majoration.
- Aucun avis ni note inventés dans les données structurées.
- En-têtes de sécurité complets, HSTS avec `preload`, temps de réponse serveur de 20 ms, poids de page autour de 100 Kio, `TBT` à 0 ms et `CLS` à 0 sur la page d'accueil.

---

**Phase 1 terminée. J'attends votre validation avant de rédiger `STRATEGIE_SEO.md`.**
