# Stratégie de référencement — climurgence.com

Rédigée le 23 septembre 2026, après la mise en ligne du lot de correctifs immédiats. Elle prend pour cibles le printemps 2027 pour la pose et l'hiver 2026-2027 pour la climatisation réversible.

Aucun volume de recherche ne figure dans ce document : je n'ai pas accès aux outils de volume. Les mots-clés sont classés par intention et par priorité commerciale, et chaque cluster porte la mention **[volumes à vérifier]** pour Google Keyword Planner et Search Console.

---

## 0. Trois décisions à prendre avant de démarrer

### 0.1 La présence locale affirmée — à trancher en premier

Vous m'avez indiqué qu'aucun partenaire n'est signé à ce jour. Or le site publié contient **59 formulations affirmant une activité en cours**, réparties sur 17 fichiers. Extraits :

| Formulation | Où |
|---|---|
| « Nous intervenons fréquemment chez les commerces, restaurants et showrooms de la zone » | pages de ville |
| « Nos techniciens partenaires interviennent régulièrement chez les professionnels toulonnais : restaurants du centre-ville… » | `/depannage-clim-toulon/` |
| « Oui, nous intervenons régulièrement dans le centre historique » | pages de ville |
| « Voici les interventions que nous réalisons le plus régulièrement sur Aubagne » | les 7 pages de ville |
| « Nos installateurs partenaires posent également des climatisations à Aubagne » | `/depannage-clim-aubagne/` |
| « Merci à nos clients et à nos techniciens partenaires pour leur confiance » | `humans.txt` |

Ce n'était pas dans le périmètre du lot précédent et je ne l'ai pas modifié de ma propre initiative. Mais la contrainte que vous venez de poser pour les nouvelles pages — ne rien affirmer sur une présence locale — vaut logiquement pour les pages existantes.

Trois options :

1. **Tout reformuler au futur du service** : « le réseau couvre », « un technicien partenaire de votre secteur », « les interventions les plus courantes sont ». Coût : un lot de 17 fichiers, effort moyen. C'est ce que je recommande, et c'est un préalable à la création des pages locales, qui reprendront les mêmes tournures.
2. Attendre les premières signatures et corriger ensuite. Le risque est de publier 10 à 15 pages locales supplémentaires sur le même moule, donc de multiplier le problème par trois.
3. Ne rien changer, en considérant que « nos techniciens partenaires » décrit le modèle et non un état des lieux. C'est défendable pour « le réseau couvre le Var », beaucoup moins pour « nous intervenons régulièrement chez les restaurateurs toulonnais ».

**Je recommande l'option 1, en lot zéro, avant toute création de page.** Le reste de ce document suppose que les nouvelles pages sont rédigées selon cette règle.

### 0.2 Le pilier dépannage

Le menu envoie « Dépannage » vers `/depannage-clim-marseille/`, qui est à la fois la page de service et la page locale de Marseille. Le silo n'a donc pas de tête et Marseille absorbe les requêtes nationales comme locales.

**Décision proposée** : créer `/depannage-climatisation/` comme pilier, laisser `/depannage-clim-marseille/` dans son rôle local, et repointer le menu. Aucune URL existante n'est modifiée, donc aucune redirection n'est nécessaire.

### 0.3 Le nommage des URL locales

Les pages existantes utilisent `/depannage-clim-{ville}/`, avec « clim » abrégé. Pour l'installation, la forme complète `/installation-climatisation-{ville}/` correspond mieux à la requête réelle.

**Décision proposée** : ne pas renommer les pages de dépannage, dont l'ancienneté est le seul capital du domaine, et adopter la forme complète pour les nouvelles. L'asymétrie n'a aucun effet sur le classement.

---

## 1. Univers de mots-clés

Sept clusters. Pour chacun : l'intention, la priorité commerciale, et la page cible.

### Cluster 1 — Pose et installation **[volumes à vérifier]**

Priorité commerciale : **1**. C'est l'univers qui doit porter le printemps 2027.

| Requête type | Intention | Page cible |
|---|---|---|
| installation climatisation {commune} | transactionnelle locale | page locale installation, **à créer** |
| installateur climatisation {commune} | transactionnelle locale | idem |
| pose climatisation {commune} | transactionnelle locale | idem |
| devis installation climatisation | transactionnelle | `/installation-climatisation/` |
| installation climatisation maison / appartement | informationnelle haute | `/installation-climatisation/` |
| faire installer une clim | transactionnelle | `/installation-climatisation/` |

### Cluster 2 — Prix de la pose **[volumes à vérifier]**

Priorité commerciale : **1**. Requêtes à très forte intention, aujourd'hui mal couvertes : le `title` de `/tarifs/` ne parle que de dépannage.

| Requête type | Intention | Page cible |
|---|---|---|
| prix installation climatisation | commerciale | `/prix-installation-climatisation/`, **à créer** |
| prix pose clim réversible | commerciale | idem |
| tarif installation climatisation maison | commerciale | idem |
| combien coûte une clim installée | commerciale | idem |
| prix climatisation 100 m2 / 3 pièces | commerciale | idem, section dédiée |

### Cluster 3 — Types d'installation **[volumes à vérifier]**

Priorité commerciale : **2**. Requêtes de comparaison, en amont de l'achat, excellentes pour la citation par les LLM.

| Requête type | Intention | Page cible |
|---|---|---|
| monosplit ou multisplit | informationnelle | `/installation-climatisation/multisplit/`, **à créer** |
| climatisation gainable prix / avantages | informationnelle | `/installation-climatisation/gainable/`, **à créer** |
| climatisation réversible chauffage hiver | informationnelle | `/climatisation-reversible-chauffage/`, **à créer** |
| pompe à chaleur air air ou climatisation | informationnelle | idem |
| remplacer une vieille climatisation | transactionnelle | `/remplacement-climatisation/`, **à créer** |
| quelle puissance de clim pour X m2 | informationnelle | `/puissance-climatisation/`, **à créer** |

### Cluster 4 — Copropriété et réglementation de la pose **[volumes à vérifier]**

Priorité commerciale : **2**, mais valeur de différenciation **1**. Personne ne traite correctement ce sujet localement, et c'est le premier frein du prospect marseillais.

| Requête type | Intention | Page cible |
|---|---|---|
| climatisation copropriété autorisation | informationnelle | `/climatisation-copropriete/`, **à créer** |
| accord syndic climatisation | informationnelle | idem |
| unité extérieure façade copropriété | informationnelle | idem |
| déclaration préalable climatisation | informationnelle | idem |
| clim en appartement sans unité extérieure | informationnelle | idem |
| entretien climatisation obligatoire | informationnelle | `/guide/` (existant) |

### Cluster 5 — Dépannage par panne **[volumes à vérifier]**

Priorité commerciale : **2**. C'est le socle actuel du site et la source des citations LLM. À consolider, pas à étendre indéfiniment.

| Requête type | Intention | Page cible |
|---|---|---|
| clim ne refroidit plus | informationnelle urgente | `/blog/clim-souffle-chaud/` (existant) |
| code erreur E3 / E1 / F3 Daikin | informationnelle urgente | `/blog/code-erreur-e3-daikin/` (existant), extensions |
| clim fuit de l'eau | informationnelle urgente | **à créer**, blog |
| clim fait du bruit | informationnelle urgente | **à créer**, blog |
| dépannage climatisation {commune} | transactionnelle locale | pages de ville existantes |
| dépannage climatisation urgence | transactionnelle | `/depannage-climatisation/`, **à créer** |

### Cluster 6 — Entretien **[volumes à vérifier]**

Priorité commerciale : **3**, mais saisonnalité favorable en février-mars.

| Requête type | Intention | Page cible |
|---|---|---|
| entretien climatisation obligatoire | informationnelle | `/guide/` |
| entretien climatisation prix | commerciale | `/entretien-climatisation/` |
| nettoyage climatisation | informationnelle | `/entretien-climatisation/` |
| attestation entretien climatisation | informationnelle | `/guide/` |

### Cluster 7 — Communes **[volumes à vérifier]**

Priorité commerciale : **1** en combinaison avec le cluster 1, **2** avec le cluster 5.

Communes prioritaires pour l'installation, dans l'ordre : Marseille, Aix-en-Provence, Toulon, Aubagne, La Ciotat, Hyères, Martigues. Puis, par vagues : Vitrolles, Salon-de-Provence, La Seyne-sur-Mer, Six-Fours-les-Plages, Sanary-sur-Mer, Cassis, Istres, Marignane, La Garde, La Valette-du-Var, Ollioules, Bandol, Saint-Cyr-sur-Mer, Allauch, Plan-de-Cuques, Septèmes-les-Vallons.

### Cannibalisations à résoudre

| Conflit | Résolution |
|---|---|
| Accueil et `/depannage-clim-marseille/` sur « climatisation Marseille » | L'accueil vise la marque et « installation, dépannage et entretien de climatisation 13 et 83 ». La page Marseille vise « dépannage climatisation Marseille » strictement |
| `/installation-climatisation/` et la future page locale Marseille | Le pilier vise « installation climatisation » sans commune et la page locale « installation climatisation Marseille » |
| `/tarifs/` et `/prix-installation-climatisation/` | `/tarifs/` devient un hub de prix tous services, la nouvelle page traite la pose en profondeur |
| `/guide/` et `/entretien-climatisation/` sur l'obligation d'entretien | `/guide/` porte la réglementation, `/entretien-climatisation/` porte la prestation. Un lien réciproque explicite, pas de duplication du texte réglementaire |

---

## 2. Architecture cible

```
/                                             accueil, trois services au même niveau
│
├── /installation-climatisation/              PILIER INSTALLATION
│   ├── /installation-climatisation/multisplit/
│   ├── /installation-climatisation/gainable/
│   ├── /remplacement-climatisation/
│   ├── /climatisation-reversible-chauffage/
│   ├── /puissance-climatisation/
│   ├── /climatisation-copropriete/
│   ├── /prix-installation-climatisation/
│   └── /installation-climatisation-{commune}/   × 7 puis extension
│
├── /depannage-climatisation/                 PILIER DÉPANNAGE (à créer)
│   └── /depannage-clim-{commune}/               × 7 existantes
│
├── /entretien-climatisation/                 PILIER ENTRETIEN
│
├── /tarifs/                                  hub prix, renvoie vers les pages prix de silo
│
├── /guide/                                   réglementation
├── /blog/                                    pannes, saisonnalité, conseils
├── /faq/                                     45 questions
│
└── /notre-reseau/  /zone-intervention/  /contact/  /devenir-partenaire/  + légales
```

### Règles de maillage

1. **Chaque page enfant renvoie à son pilier** dans son premier tiers, avec une ancre descriptive, jamais « cliquez ici ».
2. **Chaque pilier renvoie à tous ses enfants** depuis une section dédiée, pas seulement depuis le menu.
3. **Chaque page locale d'installation renvoie** au pilier installation, à la page prix installation, à la page copropriété, et aux deux ou trois communes limitrophes réellement voisines.
4. **Chaque page locale de dépannage renvoie** à la page locale d'installation de la même commune, et réciproquement. C'est le lien qui manque aujourd'hui et qui fera remonter le silo installation.
5. **Les articles de blog renvoient à leur pilier** dans le corps du texte, pas seulement dans l'encart d'appel final. C'est la lacune la plus criante du site actuel : deux articles, aucun lien contextuel sortant.
6. **Le fil d'Ariane** suit l'arborescence : Accueil › Installation › Installation à Marseille. Balisé en `BreadcrumbList`, comme aujourd'hui.

### Menu cible

`Installation` · `Dépannage` · `Entretien` · `Prix` · `Notre réseau` · `Contact`

Changements : « Dépannage » pointe vers le nouveau pilier et non plus vers Marseille ; « Tarifs » devient « Prix », plus proche de la requête. Le pied de page conserve tous les liens actuels et gagne une colonne « Installation » listant les pages du silo.

---

## 3. Repositionnement de la page d'accueil

L'accueil a déjà été rééquilibré : le H1 cite les trois services, l'installation est première dans le menu, et le premier bouton est « Demander un devis d'installation ». Il reste trois écarts.

| Élément | Avant | Après | Motif |
|---|---|---|---|
| `title` | `Installation, Dépannage et Entretien Climatisation Marseille et PACA \| Clim Urgence` (83 car.) | `Installation et dépannage climatisation 13 et 83 \| Clim Urgence` (59 car.) | 83 caractères sont tronqués dans les résultats. « PACA » n'est pas une requête, « 13 et 83 » si |
| `meta description` | 243 caractères | `Installation, dépannage et entretien de climatisation dans le 13 et le 83. Mise en relation gratuite avec un technicien partenaire. Standard 7j/7 de 9h à 21h.` (158 car.) | 243 caractères sont tronqués. À affiner sous 160 si vous préférez |
| `H1` | `Installation, Dépannage et Entretien de Climatisation à Marseille et en PACA` | inchangé | Il fonctionne, il couvre les trois services, ne pas y toucher |

**Structure H2 cible**, dans cet ordre :

1. `Faire poser une climatisation dans les Bouches-du-Rhône et le Var` — nouveau, porte le cluster 1, renvoie au pilier installation et aux pages locales
2. `Comment ça marche` — inchangé, c'est le bloc qui porte la confiance
3. `Installation, dépannage et entretien de climatisation` — inchangé, les trois cartes
4. `Combien coûte une installation de climatisation` — nouveau, trois fourchettes et un lien vers la page prix installation
5. `Zones couvertes par notre réseau` — inchangé, mais la liste des communes devient une liste de liens vers les pages locales, ce qui les sort de leur isolement actuel
6. `Pourquoi passer par Clim Urgence` — inchangé
7. `Questions fréquentes` — la FAQ actuelle de l'accueil est entièrement orientée dépannage. Deux des quatre questions passent sur l'installation

**Ce qu'il ne faut pas toucher** : le bloc `answer-capsule` du hero, qui est très probablement ce qui fait citer le site par les assistants, et les blocs JSON-LD `Organization`, `WebSite` et les trois `Service`.

---

## 4. Pages à créer ou refondre, par ordre de priorité

Les `title` sont calibrés pour tenir sous 60 caractères, les `meta description` sous 160.

### P1 — `/prix-installation-climatisation/`

- **Intention** : commerciale, haut de tunnel chaud. C'est la requête la plus rentable du cluster 1 et elle n'a aujourd'hui aucune page.
- **title** : `Prix d'une installation de climatisation | Clim Urgence`
- **meta** : `Combien coûte la pose d'une climatisation en 2027 : monosplit, multisplit, gainable, remplacement. Fourchettes de prix du marché dans le 13 et le 83.`
- **H1** : `Prix d'une installation de climatisation dans le 13 et le 83`
- **Requêtes** : prix installation climatisation, prix pose clim réversible, combien coûte une clim installée, prix climatisation 3 pièces
- **Plan** :
  - H2 Combien coûte une pose de climatisation — réponse en une phrase, puis tableau des fourchettes
  - H2 Ce qui fait varier le prix (H3 : puissance, nombre d'unités, longueur de liaison, difficulté d'accès, étage et façade, dépose de l'ancien appareil)
  - H2 Pose seule ou pack fourniture et pose
  - H2 Prix par type d'installation (H3 : monosplit, bisplit et multisplit, gainable, pompe à chaleur réversible)
  - H2 Ce que le devis doit contenir
  - H2 Pourquoi Clim Urgence ne fixe pas les prix
  - H2 Questions fréquentes sur le prix d'une installation
- **Éléments uniques obligatoires** : un tableau de fourchettes cohérent avec `/tarifs/` ; une liste de contrôle du devis ; l'explication du modèle de commission sans surcoût
- **Liens entrants** : accueil (H2 4), `/installation-climatisation/`, `/tarifs/`, les pages locales d'installation
- **Liens sortants** : `/installation-climatisation/`, `/climatisation-copropriete/`, `/tarifs/`, `/contact/`
- **Données structurées** : `WebPage`, `BreadcrumbList`, `FAQPage`. Pas d'`Offer` avec prix ferme : `PriceSpecification` avec `minPrice` et `maxPrice`, comme sur `/tarifs/`

### P2 à P4 — Les trois premières pages locales d'installation

`/installation-climatisation-marseille/`, `/installation-climatisation-aix-en-provence/`, `/installation-climatisation-toulon/`

Cahier des charges détaillé en partie 5. Modèle de métadonnées :

| Commune | title | meta description |
|---|---|---|
| Marseille | `Installation climatisation Marseille \| Clim Urgence` (51) | `Faire poser une climatisation à Marseille : copropriété, bâti ancien, littoral. Mise en relation gratuite avec un installateur partenaire du secteur.` (148) |
| Aix-en-Provence | `Installation climatisation Aix-en-Provence \| Clim Urgence` (57) | `Faire poser une climatisation à Aix-en-Provence : secteur sauvegardé, copropriétés du centre, maisons du pays d'Aix. Mise en relation gratuite.` (142) |
| Toulon | `Installation climatisation Toulon \| Clim Urgence` (48) | `Faire poser une climatisation à Toulon : immeubles du centre, quartiers du Mourillon et de Saint-Jean-du-Var, air marin. Mise en relation gratuite.` (146) |

- **H1** : `Installation de climatisation à {commune}`
- **Données structurées** : `Service` avec `areaServed` sur la commune, `provider` pointant l'organisation, `BreadcrumbList`, `FAQPage`, `WebPage`

### P5 — `/climatisation-copropriete/`

- **Intention** : informationnelle à forte valeur. C'est le frein numéro un dans les Bouches-du-Rhône et personne ne le traite sérieusement en local.
- **title** : `Climatisation en copropriété : règles et démarches` (50)
- **meta** : `Installer une climatisation en copropriété : règlement, parties communes, accord du syndic, déclaration préalable, bruit de l'unité extérieure.` (143)
- **H1** : `Installer une climatisation en copropriété`
- **Plan** : H2 Ce que dit le règlement de copropriété · H2 L'unité extérieure touche aux parties communes · H2 L'accord du syndic et de l'assemblée générale · H2 La déclaration préalable en mairie · H2 Le bruit et le voisinage · H2 Immeubles anciens, secteurs protégés et ABF · H2 Qui fait quoi entre vous, le syndic et l'installateur · H2 Questions fréquentes
- **Éléments uniques** : le déroulé chronologique des démarches ; la distinction entre ce qui relève du copropriétaire et ce qui relève du syndic ; les références réglementaires sourcées
- **Source à vérifier avant rédaction** : le régime de la déclaration préalable relève du code de l'urbanisme et **dépend du PLU de chaque commune**. Je ne publierai aucune affirmation générale sans l'avoir vérifiée commune par commune ; à défaut, la page renverra vers le service urbanisme concerné
- **Contenu déjà disponible** : les huit sous-sections copropriété de `/installation-climatisation/` sont la base. Elles y sont enfouies sans URL propre. Elles sont **déplacées**, pas dupliquées, et le pilier n'en conserve qu'un résumé de trois phrases avec un lien

### P6 — `/climatisation-reversible-chauffage/`

- **Intention** : informationnelle saisonnière. C'est l'angle d'octobre à février, celui qui permet de produire des demandes hors saison.
- **title** : `Se chauffer avec une clim réversible | Clim Urgence` (51)
- **meta** : `La climatisation réversible comme chauffage d'hiver : principe, performance par temps froid, consommation, limites en Provence. Guide complet.` (140)
- **H1** : `Se chauffer l'hiver avec une climatisation réversible`
- **Plan** : H2 Comment une clim réversible produit de la chaleur · H2 Est-ce efficace par temps froid en Provence · H2 Ce que cela change sur la facture · H2 Réversible ou autre mode de chauffage · H2 Les limites à connaître · H2 Poser une réversible en hiver, bonne ou mauvaise idée · H2 Questions fréquentes
- **Point d'attention** : aucune mention d'aide ni de subvention, Clim Urgence n'étant pas RGE. La page doit être explicite sur ce point plutôt que silencieuse, c'est un signal de sincérité que les LLM reprennent

### P7 — `/depannage-climatisation/`

Pilier du silo dépannage, voir 0.2.

- **title** : `Dépannage climatisation 13 et 83 | Clim Urgence` (47)
- **meta** : `Panne de climatisation dans les Bouches-du-Rhône ou le Var : mise en relation gratuite avec un technicien partenaire. Standard 7j/7 de 9h à 21h.` (143)
- **H1** : `Dépannage de climatisation dans les Bouches-du-Rhône et le Var`
- **Plan** : H2 Les pannes les plus courantes et quoi faire avant d'appeler · H2 Comment se passe une intervention · H2 Ce que coûte un dépannage · H2 Les communes couvertes (liens vers les 7 pages locales) · H2 Questions fréquentes
- **Attention** : cette page ne doit pas reprendre le contenu de `/depannage-clim-marseille/`. Elle traite le service, la page Marseille traite Marseille

### P8 — `/puissance-climatisation/`

- **title** : `Quelle puissance de climatisation pour quelle surface` (53)
- **H1** : `Quelle puissance de climatisation pour votre logement`
- Reprend et développe les ordres de grandeur, déjà présentés comme indicatifs. Cible « quelle puissance de clim pour X m2 », requête à très fort potentiel de citation par les assistants.

### P9 à P11 — Vague 2 des pages locales d'installation

Aubagne, La Ciotat, Hyères.

### P12 — `/remplacement-climatisation/`

- **title** : `Remplacer une climatisation : quand et à quel prix` (50)
- Cible le parc installé, qui est considérable en PACA, et les appareils au R22 devenus non rechargeables.

### P13 et P14 — `/installation-climatisation/multisplit/` et `/gainable/`

Pages de type, alimentées par les sections correspondantes du pilier.

### P15 — Refonte de `/tarifs/`

| Élément | Avant | Après |
|---|---|---|
| `title` | `Tarifs Dépannage et Entretien Climatisation Marseille \| ClimUrgence` | `Prix climatisation : pose, dépannage, entretien` (47) |
| `H1` | `Tarifs Dépannage Climatisation Marseille et PACA` | `Prix d'une climatisation dans le 13 et le 83` |

La page couvre déjà l'installation mais ne le dit ni dans son `title`, ni dans son `H1`, ni dans sa `meta`. Elle devient le hub de prix, avec un renvoi appuyé vers `/prix-installation-climatisation/`.

### P16 et au-delà — Extension des pages locales

Martigues, Vitrolles, Salon-de-Provence, La Seyne-sur-Mer, Six-Fours-les-Plages, Sanary-sur-Mer, Cassis. **Uniquement si le cahier des charges de la partie 5 peut être rempli.** Une commune pour laquelle vous ne pouvez rien dire de spécifique n'a pas de page : elle reste listée sur `/zone-intervention/`.

---

## 5. Cahier des charges des pages locales

C'est la partie la plus sensible de la stratégie. Une page locale sans substance est une page satellite, Google les identifie sans difficulté, et la sanction porte sur l'ensemble du site.

### Règle fondatrice

**Aucune page locale ne peut affirmer une présence, une intervention passée, un chantier ou un avis.** Tant qu'aucun partenaire n'est signé, la page décrit :

- ce que le service fait — mettre en relation ;
- ce qui est vrai de la commune — son bâti, son climat, ses règles d'urbanisme ;
- ce que le client doit anticiper — démarches, contraintes, questions à poser.

Formulations autorisées : « le réseau couvre », « un installateur partenaire de votre secteur », « les configurations les plus courantes à {commune} sont ». Formulations interdites : « nous intervenons régulièrement », « nos partenaires posent », « voici les interventions que nous réalisons ».

### Éléments obligatoires

Une page locale d'installation ne se publie que si elle contient **au minimum six des sept éléments suivants**, tous vérifiables :

1. **Composition réelle du parc de logements**, chiffrée et sourcée sur l'INSEE. C'est la donnée la plus discriminante entre communes, et elle est gratuite : dossier complet de la commune, tableau LOG T3, `https://www.insee.fr/fr/statistiques/2011101?geo=COM-{code}`. Elle détermine tout le reste : une commune à 62 % d'appartements appelle un discours copropriété, une commune à dominante pavillonnaire appelle un discours multi-zones.
2. **Contraintes d'urbanisme propres à la commune** : secteur sauvegardé, site patrimonial remarquable, périmètre de monument historique, règles du PLU sur les façades. À vérifier sur le site de la commune et sur l'Atlas des patrimoines. C'est un contenu que personne n'écrit et que les prospects cherchent.
3. **Spécificités climatiques et environnementales vérifiables** : exposition au mistral, proximité du littoral et corrosion saline, végétation environnante, îlot de chaleur urbain. Ces éléments existent déjà et sont bien écrits sur les pages de dépannage : ils sont réutilisables.
4. **Types de bâti dominants** et ce qu'ils impliquent pour la pose : immeubles haussmanniens, barres des années 60, lotissements récents, maisons de village.
5. **Quartiers ou secteurs nommés**, avec ce qui les distingue. Les pages de dépannage le font déjà correctement pour Marseille, Toulon et Aubagne.
6. **Communes limitrophes réellement desservies**, avec liens, ce qui construit un maillage géographique cohérent.
7. **Trois à cinq questions fréquentes propres à la commune**, pas des questions génériques avec le nom substitué.

### Longueur

**1 200 mots minimum**, hors en-tête et pied de page. Les pages de dépannage existantes font 1 150 à 1 480 mots et leur vocabulaire propre ne se recoupe qu'à 27–37 % : c'est le niveau à tenir.

### Contrôle anti-duplication

Avant publication de chaque vague, je mesure la similarité de vocabulaire deux à deux, comme lors de l'audit. **Seuil d'alerte : 45 %.** Au-delà, la page est retravaillée ou n'est pas publiée.

### Ce que vous devez fournir ou valider

| Information | Pourquoi | Qui |
|---|---|---|
| Commune par commune : un partenaire est-il signé, et sur quelles prestations | Conditionne toute formulation au présent | Arthur |
| Confirmation que les prix indicatifs ne varient pas selon la commune | Déjà confirmé, à figer par écrit dans les pages | Arthur — fait |
| Photos réelles, le jour où des chantiers partenaires existent | Aucune image de contenu sur le site aujourd'hui | Arthur |
| Validation des contraintes d'urbanisme relevées par commune | Je les collecte sur sources officielles, vous confirmez qu'elles sont exactes sur le terrain | Les deux |

---

## 6. Calendrier éditorial — 12 semaines, 2 contenus par semaine

Du lundi 28 septembre au dimanche 20 décembre 2026. La logique : l'angle réversible et chauffage pendant l'automne, les fondations du silo installation en parallèle, pour que les pages aient trois à six mois d'ancienneté quand la demande de pose repart en mars 2027.

| Semaine | Contenu 1 | Contenu 2 |
|---|---|---|
| S1 — 28 sept | Lot zéro : reformulation de la présence locale (0.1) | `/prix-installation-climatisation/` |
| S2 — 5 oct | `/depannage-climatisation/` (pilier) + repointage du menu | Refonte `title`/`H1`/`meta` de `/tarifs/` |
| S3 — 12 oct | `/climatisation-reversible-chauffage/` | Blog : « Faut-il laisser sa clim réversible allumée en continu l'hiver ? » |
| S4 — 19 oct | `/climatisation-copropriete/` | Repositionnement de l'accueil (partie 3) |
| S5 — 26 oct | `/installation-climatisation-marseille/` | Blog : « Clim réversible ou radiateurs : ce que change vraiment la facture » |
| S6 — 2 nov | `/installation-climatisation-aix-en-provence/` | `/puissance-climatisation/` |
| S7 — 9 nov | `/installation-climatisation-toulon/` | Blog : « Ma clim ne chauffe pas assez : les causes en hiver » |
| S8 — 16 nov | `/installation-climatisation/multisplit/` | Blog : « Poser une climatisation en hiver : les avantages qu'on ignore » |
| S9 — 23 nov | `/installation-climatisation-aubagne/` | `/remplacement-climatisation/` |
| S10 — 30 nov | `/installation-climatisation-la-ciotat/` | Blog : « Clim au R22 : pourquoi elle n'est plus réparable » |
| S11 — 7 déc | `/installation-climatisation-hyeres/` | `/installation-climatisation/gainable/` |
| S12 — 14 déc | Blog : « Préparer la pose du printemps : le bon moment pour le devis » | Revue de maillage interne et contrôle anti-duplication de la vague |

**Après le 20 décembre**, la suite logique, à valider en son temps : janvier-février sur l'entretien et la préparation de l'été, mars-avril sur la pose et les pages locales des vagues suivantes.

**Rythme réaliste** : deux contenus par semaine, dont une page de fond et un article, représente un effort soutenu. Si le rythme doit baisser, **sacrifiez les articles de blog, pas les pages de silo** : ce sont elles qui portent le chiffre d'affaires.

---

## 7. Plan GEO — être cité par les assistants

Le site est déjà bien cité. L'objectif est de ne rien casser et d'étendre la couverture aux huit questions du cluster pose qui n'ont aujourd'hui aucune page à citer.

### Ce qui fonctionne et ne doit pas bouger

`llms.txt` et `climurgence.md` servis en `text/plain` et `text/markdown`, le `robots.txt` ouvert aux trente-deux robots, les 96 questions en `FAQPage`, les réponses en une phrase suivies du détail, le bloc `answer-capsule` du hero.

### Ce qui doit être fait

1. **Compléter `llms.txt`.** Onze pages sur vingt-trois en sont absentes, dont `/faq/` et `/guide/`, qui sont les deux plus citables du site. À corriger dès le lot zéro, et à tenir à jour à chaque publication.
2. **Structurer chaque nouvelle page pour l'extraction** : une réponse directe en une à deux phrases sous chaque H2, avant tout développement ; un tableau quand il y a des valeurs ; une liste numérotée quand il y a des étapes ; une source citée quand l'affirmation est réglementaire.
3. **Ajouter une section « réponses courtes » à `llms.txt`** pour chaque nouvelle page de silo, au format question-réponse déjà utilisé.
4. **Renseigner `sameAs`** dans le JSON-LD dès que les premiers profils externes du plan hors site existent. C'est aujourd'hui un tableau vide, et c'est le principal frein à la reconnaissance de Clim Urgence comme entité.
5. **Soumettre les nouvelles URL à IndexNow** : c'est automatique depuis le lot précédent, à chaque mise en ligne.
6. **Publier des dates de mise à jour exactes.** Les assistants privilégient le contenu daté et récent.

### Protocole de suivi mensuel

Le premier lundi de chaque mois, poser les 20 questions de l'audit à ChatGPT, Perplexity, Claude et Gemini, en français, sans session connectée, et consigner dans un tableau : la question, l'assistant, Clim Urgence est-il cité, quelle page, quel concurrent est cité à la place.

C'est une demi-heure par mois et c'est la seule mesure fiable de la visibilité LLM : aucun outil ne la fournit correctement aujourd'hui. Les huit questions sans page à citer doivent basculer au fur et à mesure des publications.

---

## 8. Plan hors site — à exécuter par Arthur

Le domaine est jeune et n'a pas de backlink. C'est la deuxième cause du mauvais classement après le problème de redirections, déjà résolu. Sans fiche Google Business Profile, tout passe par la cohérence des citations et par quelques liens réellement mérités.

### Préalable absolu : figer les informations

Avant toute inscription, écrire une fois pour toutes et ne plus jamais dévier :

```
Clim Urgence
5 avenue Edouard Branly
13009 Marseille
06 43 72 18 50
contact@climurgence.com
https://climurgence.com
SAS CLIMURGENCE — RCS Marseille 105 205 645
```

Un seul caractère de différence entre deux annuaires affaiblit le signal. C'est la règle NAP, et c'est le seul levier local gratuit qui reste sans fiche Google.

### Priorité 1 — Les outils de moteur, cette semaine

| Action | Où | Pourquoi |
|---|---|---|
| Créer la propriété Search Console | search.google.com/search-console | Vérification par DNS chez OVH, propriété de type domaine |
| Créer Bing Webmaster Tools | bing.com/webmasters | Import depuis Search Console. **Déterminant** : Bing alimente une partie des réponses de ChatGPT |
| Vérifier la clé IndexNow dans Bing | Bing WMT > IndexNow | La soumission des 24 URL a été acceptée, il faut confirmer que la clé est reconnue |
| Tenter Bing Places | bingplaces.com | À tenter, **sans garantie** : les règles sur la génération de prospects y sont proches de celles de Google. Si le compte est refusé, ne pas insister |

### Priorité 2 — Annuaires, les deux premières semaines

Informations strictement identiques partout. Par ordre d'utilité :

1. **Pages Jaunes** — fiche gratuite, forte autorité en France
2. **Annuaire des entreprises de l'État** (annuaire-entreprises.data.gouv.fr) — automatique depuis le RCS, à vérifier et compléter
3. **Societe.com, Verif.com, Infogreffe** — fiches légales, à revendiquer
4. **Apple Business Connect** — alimente Plans et Siri, souvent négligé
5. **Annuaires locaux** : CCI Aix-Marseille-Provence, CCI du Var, annuaires des mairies et des offices de commerce
6. **Annuaires sectoriels du bâtiment**, en écartant ceux qui vendent des prospects — ils vous mettraient en concurrence avec votre propre modèle

À éviter : les fermes d'annuaires payantes qui promettent cent inscriptions. Elles produisent des liens sans valeur et des incohérences NAP.

### Priorité 3 — Avis, dès les premières mises en relation

Aucun avis n'existe aujourd'hui et il est hors de question d'en inventer. Dès la première intervention réussie :

- **Trustpilot** — compatible avec un modèle de plateforme, c'est le plus adapté ici
- **Avis Vérifiés ou Guest Suite** — payants, mais l'avis collecté est certifié et syndiqué
- **Pages Jaunes** — les avis y sont visibles dans les résultats Google

Procédure : un SMS de demande d'avis envoyé lors de l'appel de suivi que Clim Urgence passe déjà après chaque intervention. Le taux de réponse s'effondre après 48 heures.

Le jour où des avis authentiques existent, et seulement ce jour-là, ajouter `AggregateRating` au JSON-LD.

### Priorité 4 — Prescripteurs locaux, en continu

C'est le levier le plus rentable pour une plateforme de mise en relation, et il produit à la fois des liens et des demandes.

| Cible | Argument | Contrepartie possible |
|---|---|---|
| Syndics de copropriété du 13 et du 83 | Vous leur retirez un sujet pénible : les demandes de pose de leurs copropriétaires | Page « ressources » sur leur site, lien vers `/climatisation-copropriete/` |
| Agences immobilières et gestionnaires locatifs | Dépannage rapide sur leur parc, sans qu'ils cherchent | Mention dans leur rubrique partenaires |
| Conciergeries et gestionnaires de location saisonnière | Une clim en panne en août sur une location, c'est un remboursement | Idem |
| Cuisinistes, rénovateurs, architectes d'intérieur | Ils ne posent pas de clim mais leurs clients en veulent | Échange de recommandations |
| Réseaux professionnels : CCI, clubs d'entrepreneurs, BNI | Visibilité et liens depuis les annuaires de membres | Adhésion |

Méthode : un courriel court, personnalisé, avec un lien vers `/climatisation-copropriete/` une fois publiée. Cette page est votre meilleur argument auprès des syndics, elle leur rend service avant de rien leur demander.

### Priorité 5 — Médias et contenus locaux

Un contenu réellement utile a une chance d'être repris : une analyse du parc de logements des communes du 13 et du 83 face à la climatisation, à partir des données INSEE, intéresse *La Provence*, *Made in Marseille*, *Gomet'* et les radios locales. C'est long, incertain, mais un seul lien d'un média local vaut cinquante annuaires.

---

## 9. Mesure

### Ce qui est en place depuis le lot précédent

Umami sur les 24 pages, avec quatre événements : `clic_telephone` (avec l'emplacement du bouton), `clic_whatsapp`, `envoi_formulaire`, `envoi_candidature_partenaire`.

### À mettre en place

| Action | Où | Quand |
|---|---|---|
| Vérifier la remontée des quatre événements | Umami | Dès cette semaine, procédure dans `docs/MESURE.md` |
| Créer Search Console et Bing WMT | voir 8 | Cette semaine |
| Ajouter un lien WhatsApp, si vous le souhaitez | site | `clic_whatsapp` est câblé mais aucun lien n'existe |
| Tableau de suivi mensuel | tableur | Premier lundi de chaque mois |

### Indicateurs à suivre chaque mois

**Visibilité** : pages indexées et pages exclues par motif (Search Console) ; impressions et clics par cluster ; position moyenne sur les requêtes « installation climatisation + commune » ; pages indexées côté Bing ; domaines référents.

**Conversion** : clics sur le numéro, par emplacement ; envois de formulaire ; taux de conversion par page d'entrée ; part du trafic organique.

**GEO** : les 20 questions types, selon le protocole de la partie 7.

### Objectifs

Ce sont des objectifs, pas des prévisions. Le domaine est jeune, sans backlink, et le principal frein technique vient d'être levé : les trois prochains mois serviront d'abord à faire indexer correctement ce qui existe.

**À 3 mois, fin décembre 2026**

- Les 24 URL indexées dans Search Console, aucune en « Page avec redirection » — c'est l'effet direct de la correction du slash final, et c'est le seul objectif dont je suis certain qu'il est atteignable
- Le site indexé dans Bing, clé IndexNow reconnue
- 8 à 12 pages publiées selon le calendrier
- Les premières impressions sur le cluster pose, positions probablement au-delà de la page 3
- 5 à 10 citations externes cohérentes (annuaires, profils)
- Mesure de conversion opérationnelle, avec une première référence de taux
- Les 20 questions types suivies mensuellement, avec un premier point de comparaison

**À 6 mois, fin mars 2027**

- Le silo installation complet : pilier, prix, copropriété, réversible, puissance, et 6 à 8 pages locales
- Des positions en page 1 ou 2 sur les requêtes de longue traîne du cluster copropriété et du cluster puissance, qui sont les moins concurrentielles
- Des positions en page 2 ou 3 sur « installation climatisation + commune » pour les communes secondaires, plus lentes sur Marseille et Aix
- Les premiers avis authentiques publiés, `sameAs` renseigné, `AggregateRating` ajouté
- Un flux de demandes organiques mesuré et attribuable, qui devient la référence pour la saison de pose

**Ce que je ne promets pas** : une position en page 1 sur « installation climatisation Marseille » en six mois. C'est une requête tenue par des acteurs installés, avec de l'ancienneté et des backlinks. Le chemin réaliste passe par les communes secondaires et la longue traîne, puis par la remontée progressive vers les requêtes principales.

---

**Phase 2 terminée. J'attends votre validation avant toute mise en oeuvre.**
