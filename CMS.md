# Articles du CMS (Cely Growth)

Les articles du blog se rédigent, se programment et se publient dans le CMS de Cely Growth (le CRM fait foi).
Le site les lit à chaque visite, sans redéploiement. Les 4 articles statiques existants restent inchangés.

Une seule fonction Vercel, `api/cms.js` (l'offre Hobby limite un déploiement à 12 fonctions), aiguille vers le code
de chaque page, dans `api/_lib/route-*.js`. Les réécritures sont dans `vercel.json`.

| Adresse | Code | Rôle |
| --- | --- | --- |
| `/actualites` | `route-actualites.js` | Page Ressources (gabarit `api/_cms/actualites.html`) avec les articles du CMS en tête de grille |
| `/actualites/{slug}` | fichier statique, sinon `route-article.js` | Article du CMS ; ancien slug → 301 ; non publié → 404 |
| `/apercu?jeton=…` | `route-apercu.js` | Aperçu d'un brouillon (lien du CMS, 24 h au plus), jamais indexé ni mis en cache |
| `/sitemap-articles.xml` | `route-sitemap.js` | Articles publiés et indexables (déclaré dans `robots.txt`) |
| `POST /api/cms/revalidate` | `route-revalidate.js` | Appel du CRM quand un contenu change (secret vérifié) |
| `/api/cms/sante` | `route-sante.js` | Diagnostic de la liaison (variables présentes, réponse du CMS), sans aucun secret |

- Articles riches : le gabarit `api/_cms/article.html` reprend la structure des articles statiques (en-tête et
  partage, bloc auteur, « Réponse directe » et « À retenir » remontés en haut, sommaire, encadré final, tags, carte
  auteur, « À lire ensuite »). Les blocs du Markdown (`:::reponse`, `:::faq`, `:::outil`… : modèle dans
  `docs/cms-modele-article.md` du dépôt cely-crm) arrivent avec les classes `art-*` du site ; la FAQ produit les
  données FAQPage. `:::outil nom` est remplacé par le balisage de l'outil (`api/_cms/outils/<nom>.html`, exporté par
  `scripts/build.py`) ; les scripts des outils sont déjà présents sur toutes les pages.
- Cache : le CDN de Vercel garde chaque page du CMS une minute au plus (`s-maxage=60`). Un article publié,
  modifié ou dépublié est donc à jour sur le site en une minute au plus ; un article programmé apparaît dans la
  minute qui suit son heure.
- Gabarits : `api/_cms/article.html` et `api/_cms/actualites.html` sont générés par `python3 scripts/build.py`
  depuis `src/site.html` (pages `cms-article` et `actu`). Les marqueurs `<!--CMS:…-->` sont remplis par les fonctions.
- Le HTML des articles est nettoyé par le CMS (aucun script) ; titres, extraits et attributs sont échappés ici.
- CMS injoignable : les pages d'article répondent 503 sans être mises en cache ; la page Ressources s'affiche avec
  les seuls guides statiques.
- Non branché : réglages SEO des pages statiques venant du CMS (`/pages` du contrat). Les pages statiques gardent
  les valeurs de `src/site.html` ; les appliquer demanderait un rebuild ou un middleware.

## Variables d'environnement Vercel (noms seulement)
| Nom | Valeur |
| --- | --- |
| `CELY_CMS_API_URL` | `https://cely-crm.vercel.app/api/site/cms/v1` |
| `CELY_CMS_API_KEY` | même valeur que `CMS_SITE_API_KEY` dans le Vercel du CRM |
| `CELY_CMS_REVALIDATE_SECRET` | même valeur que `CMS_SITE_REVALIDATE_SECRET` dans le Vercel du CRM |
