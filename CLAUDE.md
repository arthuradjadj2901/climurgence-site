# Règles de travail — climurgence.com

Règles permanentes pour toute intervention sur ce dépôt. Elles priment sur toute habitude par défaut.

## Git et déploiement

- **Toute modification se fait sur une branche dédiée, jamais directement sur `main`.**
- **Pousser une branche de travail ne demande pas d'autorisation.** Après chaque push, donner à Arthur l'URL de prévisualisation Vercel.
- **Ne jamais fusionner dans `main` ni pousser `main`** tant qu'Arthur n'a pas écrit explicitement **« OK mise en ligne »**. Une validation du contenu, un « c'est bon » ou un « parfait » ne valent pas autorisation de mise en ligne.
- **Après une mise en ligne**, vérifier que la production répond correctement (pages principales, redirections, formulaire) et signaler tout problème constaté.

## Contenu

- **Aucun emoji**, nulle part : pages, code, commentaires, messages de commit, attributs `alt`, JSON-LD, fichiers destinés aux IA. Les signes typographiques Unicode (flèches, coche) ne sont pas des emojis et peuvent rester.
- **Aucune promesse de délai au nom de Clim Urgence.** Formulation de référence : « Intervention en 24 h dans la majorité des cas, selon la disponibilité des techniciens partenaires de votre secteur. » Le standard est joignable 7j/7 de 9h à 21h ; c'est le standard qui est disponible, pas un technicien.
- **Aucune promesse de prix au nom de Clim Urgence.** Les montants publiés sont des « prix généralement pratiqués sur le marché », donnés à titre indicatif. Seul le devis établi par le technicien partenaire fait foi. Formulation de référence : « Le technicien vous indique le prix du déplacement et du diagnostic avant toute intervention. »
- **Aucun prix présenté comme constaté chez les partenaires.** Aucun partenaire n'est signé à ce jour : les formulations « prix constatés auprès de nos partenaires », « chez nos installateurs partenaires » ou équivalentes sont inexactes. Écrire **« prix généralement pratiqués sur le marché »**, et faire suivre de « Le technicien vous indique le prix du déplacement et du diagnostic avant toute intervention, et seul son devis fait foi. » Pour la même raison, ne rédiger aucun contenu affirmant une présence locale, des réalisations, des chantiers ou des avis clients.
- **Ne rien inventer** : ni fait juridique, ni chiffre, ni statistique, ni avis client, ni certification, ni label. Si une information manque, poser un marqueur `[À COMPLÉTER PAR ARTHUR]` et le signaler dans le compte rendu.
- Tous les textes sont en français, au vouvoiement, dans un ton professionnel et direct.

## Référencement

- **Aucune URL existante modifiée sans redirection 301.** Les redirections se déclarent dans `vercel.json` avec `"statusCode": 301` : `"permanent": true` produit un 308.
- Ne pas modifier les `canonical`, la clé IndexNow, la structure des balises Hn ni le `sitemap.xml` au-delà de ce qui est nécessaire.
- Les `title`, `meta description` et H1 ne changent que si le contenu l'impose. Lister chaque modification avant/après dans le compte rendu.
- Toute page ajoutée est déclarée dans `sitemap.xml` et liée depuis le menu ou le pied de page.

## Modèle économique à respecter dans les textes

Clim Urgence est une **plateforme de mise en relation**, pas une entreprise de dépannage. Elle ne réalise aucune prestation technique.

- Écrire « nos techniciens partenaires », jamais « nos techniciens ».
- Le technicien partenaire établit son devis, intervient, facture et encaisse directement le client.
- Les garanties sur les travaux et les pièces sont dues par le partenaire, jamais par Clim Urgence.
- Le service est gratuit pour le client. Clim Urgence est rémunérée par une commission versée par le partenaire, sans surcoût pour le client.
- Toute page se présentant au nom de l'entreprise utilise l'accroche : « Installation, dépannage et entretien de climatisation — Bouches-du-Rhône et Var ».
- L'installation, le dépannage et l'entretien sont au même niveau de priorité commerciale. L'installation figure en premier dans le menu et dans les listes de services.

## Réglementation

Vérifier toute affirmation réglementaire sur une source officielle (Légifrance, EUR-Lex, ecologie.gouv.fr) avant publication, et citer la source dans le compte rendu. Références en vigueur :

- **Entretien périodique** : décret n° 2020-912 du 28 juillet 2020, articles R224-44 à R224-44-5 du code de l'environnement. Systèmes thermodynamiques de 4 kW à 70 kW, période maximale de deux ans entre deux entretiens, attestation remise sous quinze jours.
- **Inspection périodique** : articles R224-45 et suivants du code de l'environnement. Au-delà de 70 kW, tous les cinq ans.
- **Contrôle d'étanchéité** : règlement (UE) 2024/573, applicable depuis le 11 mars 2024, qui abroge le règlement (UE) n° 517/2014. Seuil de 5 tonnes équivalent CO2, jamais un poids en kilogrammes.
- **Fluides frigorigènes** : articles R543-75 à R543-123 du code de l'environnement.
- **Information de plateforme** : article L111-7 du code de la consommation, portée par la page `/notre-reseau/`.
- **Pratiques commerciales trompeuses** : article L121-2 du code de la consommation.

Clim Urgence n'est pas certifiée RGE : aucune mention d'aide ou de subvention (MaPrimeRénov', CEE, prime énergie) ne doit apparaître.

## Technique

- Site statique en HTML pur, sans générateur ni étape de compilation. Un dossier par URL, chacun avec son `index.html`.
- **Aucun système de composants** : l'en-tête, le menu et le pied de page sont dupliqués dans chaque page. Toute modification transversale doit être répercutée sur toutes les pages.
- Serveur local : `python3 -m http.server 4173`. `npx serve` ne démarre pas sur cette machine. Pour tester les redirections et `/api/lead`, utiliser `vercel dev`.
- Valider la syntaxe de chaque bloc JSON-LD après modification.
- Les formulaires passent tous par `js/main.js` puis `/api/lead`. Les champs `nom`, `telephone` et `email` sont obligatoires côté serveur.

## Avant de rendre la main

1. Recherche des termes à risque : promesses de délai, « garanti », « déplacement offert », « majoration », « RGE », « MaPrimeRénov ». Justifier chaque occurrence restante.
2. Recherche d'emojis : il doit y en avoir zéro.
3. Validation de tous les blocs JSON-LD, de `vercel.json` et de `sitemap.xml`.
4. Vérification des liens internes : aucun lien cassé, aucune page orpheline.
5. Vérification du rendu mobile des pages modifiées.
6. Commits atomiques, en français, un par type de modification.
