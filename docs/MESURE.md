# Mesure d'audience — Umami Cloud

État : **préparé, non déployé.** Le script Umami n'est posé sur aucune page. Il manque l'identifiant de site, à créer dans Umami Cloud.

## Ce qui est déjà en place

| Élément | Fichier | État |
|---|---|---|
| Domaine `cloud.umami.is` autorisé dans la `Content-Security-Policy` (`script-src`) | `vercel.json` | Fait |
| Fonction `track()` inerte tant que `window.umami` n'existe pas | `js/main.js` | Fait |
| Événement `clic_telephone` sur tout lien `tel:`, avec l'emplacement du bouton | `js/main.js` | Fait |
| Événement `clic_whatsapp` sur tout lien `wa.me` ou `whatsapp:` | `js/main.js` | Fait, mais aucun lien WhatsApp n'existe aujourd'hui sur le site |
| Événement `envoi_formulaire` au succès des formulaires de devis et de la modale tarifs | `js/main.js` | Fait |
| Événement `envoi_candidature_partenaire` au succès du formulaire de `/devenir-partenaire/` | `js/main.js` | Fait |

Tant que la balise n'est pas posée, `track()` ne fait rien : aucune requête, aucun cookie, aucun impact sur la performance.

## Ce qu'il reste à faire

1. Créer le site dans Umami Cloud et récupérer le `data-website-id`.
2. Remplacer `[À COMPLÉTER PAR ARTHUR]` ci-dessous par cet identifiant, puis ajouter la balise avant `</head>` **des 23 pages et de `404.html`**. Le site n'a pas de système de composants : l'en-tête est dupliqué dans chaque fichier.

```html
<script defer src="https://cloud.umami.is/script.js" data-website-id="[À COMPLÉTER PAR ARTHUR]"></script>
```

3. Vérifier dans Umami que les quatre événements remontent : un clic sur le numéro depuis mobile, un envoi du formulaire de contact, un envoi du formulaire partenaire.

## Emplacements renvoyés par `clic_telephone`

`en-tete`, `hero`, `pied-de-page`, `bouton-mobile`, `barre-fixe`, `corps-de-page`. Ils permettent de savoir quel point d'appel convertit réellement sur mobile.

## Point de vigilance RGPD

Umami Cloud ne dépose pas de cookie et n'utilise pas d'identifiant persistant. En l'état, aucune bannière de consentement n'est requise. Si l'hébergement ou la configuration changent, la page `/confidentialite/` devra être mise à jour en conséquence.
