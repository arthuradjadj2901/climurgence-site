# Mesure d'audience — Umami Cloud

État : **en place.** Le script est posé sur les 23 pages du site et sur `404.html`.

Identifiant de site : `ece4f5f2-5dda-4f84-803b-26eec299e65c`. Tableau de bord : https://cloud.umami.is

## Ce qui est mesuré

| Élément | Fichier |
|---|---|
| Balise Umami avant `</head>` des 24 pages | chaque `index.html` et `404.html` |
| Domaine `cloud.umami.is` autorisé dans la `Content-Security-Policy` (`script-src`) | `vercel.json` |
| Fonction `track()`, sans effet si le script ne s'est pas chargé | `js/main.js` |

### Événements

| Événement | Déclencheur | Propriétés |
|---|---|---|
| `clic_telephone` | clic sur tout lien `tel:` | `emplacement`, `page` |
| `clic_whatsapp` | clic sur tout lien `wa.me` ou `whatsapp:` | `emplacement`, `page` |
| `envoi_formulaire` | succès de l'envoi d'un formulaire de devis ou de la modale tarifs | `formulaire`, `page` |
| `envoi_candidature_partenaire` | succès de l'envoi du formulaire de `/devenir-partenaire/` | `formulaire`, `page` |

`emplacement` vaut `en-tete`, `hero`, `pied-de-page`, `bouton-mobile`, `barre-fixe` ou `corps-de-page`. Ces valeurs permettent de savoir quel point d'appel convertit réellement sur mobile.

Aucun lien WhatsApp n'existe aujourd'hui sur le site : `clic_whatsapp` est câblé mais ne se déclenchera pas tant qu'un lien ne sera pas ajouté.

Les événements ne remontent qu'en cas de succès réel de l'envoi, après la réponse de `/api/lead`. Un formulaire en erreur ne compte pas comme une conversion.

## Vérification après une mise en ligne

1. Ouvrir une page du site, puis le tableau de bord Umami : la visite doit apparaître en temps réel.
2. Cliquer sur le numéro depuis un mobile, vérifier l'apparition de `clic_telephone` avec `emplacement: bouton-mobile`.
3. Envoyer le formulaire de contact, vérifier `envoi_formulaire`.
4. Envoyer le formulaire de `/devenir-partenaire/`, vérifier `envoi_candidature_partenaire`.

## Point de vigilance RGPD

Umami ne dépose pas de cookie et n'utilise pas d'identifiant persistant : aucune bannière de consentement n'est requise en l'état. Si l'hébergement ou la configuration changent, la page `/confidentialite/` devra être mise à jour en conséquence.
