# Refonte des pages intérieures — rapport de livraison

Toutes les pages tournent désormais sur les composants de l'accueil. Tout est dans ton dossier SITE CELY, généré et vérifié, mais rien n'est encore poussé. L'inventaire « avant » est dans `inventaire-avant.md`, les captures dans `captures-pages.zip` (desktop 1440 et mobile 375).

## 1. Composants globaux

- **Navigation** : unique, sticky et floutée, page active signalée (point et `aria-current`). Le CTA « Diagnostic gratuit » mène à `/contact#formulaire`, sur desktop comme dans le menu mobile. Audit et Nous rejoindre ne sont plus que dans le footer.
- **Bandeau de réassurance** : c'est maintenant un composant unique (`<!--COMPONENT:TOPBAR-->`), injecté par le build sur l'accueil, /growth, /audit, /audit/audit-marketing-digital, /services et /contact. Il n'apparaît ni sur les articles ni sur les pages légales.
- **Footer** : un seul pour tout le site, logo SVG. La colonne Offre contient Growth Part-Time, Audit Marketing Digital (lien vers /audit/audit-marketing-digital) et Ressources. Il n'y a pas de lien vers /services.
- **Fil d'Ariane** : généré par le build sur toutes les pages sauf l'accueil, à partir de la même liste que le schéma BreadcrumbList. Les deux restent donc toujours identiques.
- **CTA de fin** : un seul composant (`<!--COMPONENT:CTA_FINAL-->`), celui de l'accueil. Il remplace partout l'ancien double bloc « Premier échange offert » + « On en parle ? ». Il est absent de /contact (on y est déjà), de /nous-rejoindre (autre cible) et des pages légales.
- **Boutons et cartes** : tous les boutons d'action ont le style de l'accueil (pilule, contour, ombre décalée), de même que les labels de section (losange, sans « // »), les titres et les cartes. Le seul libellé de CTA restant est « Réserver mon diagnostic gratuit ».
- **404** : nouveau H1 « Cette page n'existe pas (ou plus). », 3 liens (Accueil, Growth Part-Time, Ressources) et le CTA diagnostic. La page est en noindex et Vercel la sert avec un vrai statut 404 (vérifié).

## 2. SEO technique

- **Redirections 301** : ajoutées pour /cely.html (ancienne accueil) et pour les 6 images déplacées de la racine vers /images. Les règles www et 2celygrowth.vercel.app existaient déjà, Vercel force le https et `trailingSlash:false` est conservé.
- **Sitemap** : /nous-rejoindre est retiré (désormais en noindex). Le `lastmod` est réel, page par page : le build compare le contenu de chaque page à sa version précédente (`scripts/lastmod.json`) et ne change la date que si la page a changé.
- **robots.txt** : déjà correct (lien vers le sitemap, /api exclu). Pages légales et 404 en noindex.
- **Metas** : title ≤ 60 caractères et meta entre 140 et 160 caractères, toutes uniques. Le build contrôle désormais automatiquement les longueurs et la présence d'un seul H1 par page. og et twitter sont alignés, og:type est `article` sur les articles et `website` ailleurs.
- **Images OG** : 8 images 1200×630 générées pour les pages commerciales (`images/og/`). Les images OG des articles sont conservées.
- **JSON-LD** :
  - Organisation (LocalBusiness) : `@id` unique, description corrigée sans « tech », horaires supprimés, logo en PNG HD (`images/cely-logo-hd.png`), sameAs LinkedIn et fiche Google.
  - Person « Célien Boillot », Fondateur de Cely, déclaré auteur des deux articles.
  - Service sur /growth (à partir de 750 EUR par mois) et sur /audit/audit-marketing-digital (1 250 EUR HT).
  - BlogPosting sur chaque article, CollectionPage et ItemList sur /actualites.
  - FAQPage partout où une FAQ s'affiche, reconstruite depuis le texte exact de la page. La FAQ de l'audit est désormais prise en compte, ce n'était pas le cas avant.
  - BreadcrumbList partout.
- **Maillage** : 0 lien interne cassé, 0 ancre morte. Toutes les pages indexables reçoivent au moins 2 liens internes, sauf /motion-design (voir point 4).
- **Perf et accessibilité** : polices chargées en asynchrone (une feuille Google Fonts bloquante faisait doublon et a été retirée), graisse Space Grotesk 700 ajoutée, contrastes AA corrigés (fonds lavande, liens des encadrés d'articles), libellé ajouté au champ anti-spam du simulateur.

## 3. Page par page

- **/growth** :
  - meta et sous-titre du hero remplacés ;
  - visuel AARRR en carte produit, mention « illustratif » retirée ;
  - carte « Coordonner » remplacée par « Automatiser » ;
  - bloc « Ce qu'on pilote » de l'accueil ajouté, avec le schéma d'automatisation et les services complémentaires ;
  - 30 premiers jours présentés avec la frise animée de l'accueil, mention « adapté au périmètre » conservée ;
  - « Point hebdo — Semaine 12 », visuel marqué « Exemple », carte 2 réécrite ;
  - inclus du forfait réécrits, ligne « en plus » réécrite ;
  - effet cadre sur « satisfait » ;
  - FAQ : réponse « Qui exécute » réécrite, question « Et quand on recrutera… » ajoutée, accordéon exclusif ;
  - lien discret vers /services en fin de FAQ.
- **/audit** :
  - grande carte premium (1 250 € HT, 3 caractéristiques, bouton « Découvrir l'audit ») ;
  - nouveau bloc « Audit ou accompagnement ? » en 2 cartes.
- **/audit/audit-marketing-digital** :
  - « 1 250 € HT » partout ;
  - maquette du rapport refaite (couverture, synthèse, plan d'action), marquée « Exemple de structure » ;
  - textes des 5 familles réalignés sur leurs titres (il y avait bien un décalage d'un cran) ;
  - bloc « Un premier échange n'est pas un audit » en cartes côte à côte ;
  - FAQ : réponses sur le prix et la durée mises à jour, accordéon exclusif.
- **/services** : nouveaux title, meta et H1. Trois sections H2 (définition, pour qui, avantages, limites), un tableau comparatif dans le style de l'accueil, puis « Ce que propose Cely aujourd'hui ». Les badges « Bientôt disponible » ont disparu. La page est liée depuis /growth et depuis les deux articles, mais ni depuis la nav ni depuis le footer.
- **/actualites** : nouveaux H1, title et meta. Article mis en avant en grande carte (couverture, catégorie, temps de lecture, date), badge « Outil gratuit inclus », filtres prêts mais masqués tant qu'il y a moins de 4 articles.
- **Articles** :
  - ajouts : barre de progression, sommaire qui surligne la section en cours, temps de lecture (25 et 30 min), partage LinkedIn et copie du lien ;
  - lecture : colonne de 720 px, texte en 18 px, interligne 1,7, tableaux avec défilement horizontal propre ;
  - bloc « À lire ensuite » avec l'autre article, plus des liens vers /growth et /services ;
  - CTA de fin global, conclusions conservées telles quelles.
- **Corrections inbound-vs-outbound** :
  - « notre accompagnement SEO/GEO » devient un lien vers /growth ;
  - « notre offre de prospection » devient un lien vers /growth ;
  - supprimés : les renvois vers les articles LinkedIn, YouTube, Sales Navigator et « montage technique », les 2 « ce cas client », « méthode IMPA » et « La nôtre suit cette logique » ;
  - comme le contenu a changé, `dateModified` et « Mis à jour le » passent au 23 octobre 2026.
- **Contrôle referencement-ia** : aucun renvoi mort, rien à corriger.
- **/manifeste** : nouvelle meta, point 01 réécrit (« piloté de loin »). Une section par conviction en alternance clair/sombre, avec numéro géant. Fin de page avec la photo de Célien, « Le growth qui s'intègre. » en très grand, lien vers /growth et CTA global.
- **/contact** : nouveaux H1 et sous-titre. Formulaire en 2 étapes intact (champs et IDs). À côté : la carte « Avec qui vous parlez » et le créneau Calendly. « Ce qui se passe ensuite » devient une frise horizontale. L'ancre #formulaire fonctionne.
- **/nous-rejoindre** : passée en noindex et retirée du sitemap. Le formulaire est désormais branché (nouvelle fonction `api/collaboration.js`, même mécanisme Resend et mêmes variables que /contact, testée). CTA de fin « Proposer une collaboration » vers #collaboration.
- **Pages légales** : gabarit sobre, sommaire sur la politique de confidentialité, texte mis à jour sur le formulaire Nous rejoindre (désormais transmis).

## 4. À valider ou à me fournir

1. **Pages légales** : la page n'est publiable qu'avec ces informations.
   - SIRET ;
   - forme juridique ;
   - e-mail de contact ;
   - durée de conservation des données.
2. **TVA de l'audit** : la FAQ dit « 1 250 € HT ». À compléter si tu veux une mention précise (TVA non applicable, etc.).
3. **Délai de l'audit** : phrase ajoutée à valider : « En général, comptez quelques semaines entre le cadrage et la restitution. »
4. **Délai de réponse** : « 48 h ouvrées » partout comme demandé, alors que le site disait « 24 h ».
5. **/motion-design** : la page existe et répond bien en 200 en ligne (vérifié), elle ne renvoie pas d'erreur. Comme demandé, je ne l'ai ni redirigée ni retirée du sitemap. Elle n'est liée depuis aucune page et contient encore « Bientôt vous » et « Vidéo exemple bientôt en ligne ». Dis-moi : garder et lier, passer en noindex, ou rediriger en 301 vers / ?
6. **Horaires** : retirés du schéma en attendant les vrais.
7. **Liens externes** : 39 testés, 37 OK. leptidigital.fr (article IA) renvoie une erreur côté site, à vérifier. bing.com/webmasters ne s'affiche qu'avec JavaScript, normal.
8. **« // » dans les labels du brief** : affichés avec le losange, puisque tu avais demandé de supprimer les « // ». Les numéros du manifeste sont en « 01 » géant, sans barre.
9. **Images OG des articles** : conservées comme demandé, mais elles contiennent encore « // ACTUALITÉS ». Sur le site, j'utilise des couvertures redessinées dans la DA (`images/covers/`). Je peux régénérer les OG si tu veux.

## 5. Checklist finale

- [x] 0 lien interne cassé, 0 ancre morte (crawl de toutes les pages générées).
- [x] Liens externes : 37/39 OK, 1 en erreur signalé (point 4.7).
- [ ] 0 placeholder visible : il reste ceux des pages légales (point 4.1) et ceux de /motion-design (point 4.5).
- [x] Sitemap : uniquement des pages en 200 et indexables. robots.txt OK.
- [x] 301 : /cely.html et les anciennes images. /motion-design en attente de ta décision.
- [x] Title et meta uniques, longueurs respectées (tableau ci-dessous). Seule exception : la meta de referencement-ia fait 139 caractères, laissée intacte car le brief demande de ne pas toucher aux metas des articles.
- [x] Schémas : JSON valide sur toutes les pages, contrôlé par script. Je n'ai pas accès au Rich Results Test, à passer après le déploiement.
- [x] Un seul H1 par page (contrôlé par le build), aucun saut de niveau de titre.
- [x] Nav, footer, bandeau et CTA identiques partout.
- [x] Aucune mention de prestataires ou d'experts sur les pages commerciales (hors /nous-rejoindre et hors contenu éditorial des articles).
- [x] Lighthouse mobile ≥ 90 partout (tableau ci-dessous).
- [x] Responsive vérifié à 375, 768, 1280 et 1440 px : aucun débordement, aucune erreur JavaScript.

### Lighthouse mobile

Mesuré en local avec compression gzip, comme Vercel. Best Practices est à 96 uniquement parce que mon environnement bloque Google Fonts et Calendly (erreurs console). \*SEO à 69 sur les pages volontairement en noindex : c'est le noindex qui est pénalisé.

| URL | Perf | Accessibilité | Best Practices | SEO |
|---|---|---|---|---|
| / | 95 | 100 | 96 | 100 |
| /growth | 95 | 100 | 96 | 100 |
| /audit | 99 | 100 | 96 | 100 |
| /audit/audit-marketing-digital | 98 | 100 | 96 | 100 |
| /services | 99 | 100 | 96 | 100 |
| /actualites | 100 | 100 | 96 | 100 |
| /actualites/inbound-vs-outbound | 96 | 100 | 96 | 100 |
| /actualites/referencement-ia | 95 | 100 | 96 | 100 |
| /manifeste | 100 | 100 | 96 | 100 |
| /contact | 99 | 100 | 96 | 100 |
| /nous-rejoindre | 99 | 100 | 96 | 69* |
| /mentions-legales | 100 | 100 | 96 | 69* |
| /confidentialite | 100 | 100 | 96 | 69* |
| /cookies | 100 | 100 | 96 | 69* |
| /motion-design | 98 | 97 | 96 | 100 |

### Tableau final

| URL | Title (car.) | Meta (car.) | H1 | Schémas | Indexation |
|---|---|---|---|---|---|
| / | Growth marketer à temps partagé pour startups B2B | Cely (56) | Cely structure l'acquisition des startups B2B qui n'ont pas encore de growth : outbound et inbound lancés dès le premier mois, sans engagement. (143) | Le growth marketer à temps partagé de votre startup. | FAQPage, LocalBusiness, Person, WebSite | index |
| /404 | Page introuvable | Cely (23) | Cette page n'existe pas ou plus. Retrouvez l'accueil de Cely, l'offre Growth Part-Time ou nos ressources growth marketing B2B, ou réservez un diagnostic. (153) | Cette page n'existe pas (ou plus). | — | noindex |
| /actualites | Ressources growth marketing B2B : guides et outils | Cely (57) | Guides, analyses et outils gratuits sur le growth marketing B2B : acquisition, prospection, SEO et GEO. Écrits à partir de ce qu'on applique sur le terrain. (156) | Ressources growth marketing B2B | BreadcrumbList, CollectionPage | index |
| /actualites/inbound-vs-outbound | Inbound vs outbound : quoi choisir en 2026 ? (+ simulateur) (59) | Inbound ou outbound marketing ? Avantages, canaux, ratios et méthode pour choisir la bonne stratégie B2B en 2026. Testez notre simulateur gratuit. (146) | Inbound vs outbound : quoi choisir pour son entreprise en 2026 ? | BlogPosting, BreadcrumbList, FAQPage, Person | index |
| /actualites/referencement-ia | Référencement IA (GEO) : la ruée vers l'or de 2026 (50) | Le GEO, mythe ou réalité ? Ce que disent les études, ce qui change avec les Aperçus IA en France, et la méthode pour être cité par ChatGPT. (139) | Le référencement IA : la ruée vers l'or de 2026 | BlogPosting, BreadcrumbList, FAQPage, Person | index |
| /audit | Audits marketing digital pour startups B2B | Cely (49) | Les audits Cely : des diagnostics écrits et actionnables sur votre acquisition digitale. Découvrez l'Audit Marketing Digital, notre premier format. (147) | Des audits pour voir clair avant d'agir. | BreadcrumbList | index |
| /audit/audit-marketing-digital | Audit Marketing Digital complet (1 250 €) | Cely (48) | Audit Marketing Digital Cely : diagnostic complet de votre acquisition et plan d'action priorisé, en rapport écrit de 50 pages avec suivi — 1 250 €. (148) | Voyez clair dans votre acquisition avec un audit marketing digital complet. | BreadcrumbList, FAQPage, Offer, Service | index |
| /confidentialite | Politique de confidentialité | Cely (35) | Comment Cely traite les données personnelles transmises via les formulaires de celygrowth.com : finalités, destinataires, durée de conservation et vos droits. (158) | Politique de confidentialité | BreadcrumbList | noindex |
| /contact | Contact : premier rendez-vous offert | Cely (43) | Parlez de votre croissance avec Cely : un premier rendez-vous offert de 30 minutes pour identifier vos blocages et repartir avec des pistes concrètes. (150) | Réservons 30 minutes pour faire le point. | BreadcrumbList | index |
| /cookies | Cookies | Cely (14) | Les cookies sur celygrowth.com : aucun cookie de mesure d'audience ni de publicité, les services tiers concernés et comment paramétrer votre navigateur. (152) | Cookies | BreadcrumbList | noindex |
| /growth | Growth Part-Time : un growth marketer intégré | Cely (52) | Growth Part-Time : un growth marketer intégré à votre équipe 6 à 10 h par semaine. Stratégie, outbound, inbound, automatisation. Dès 750 € HT/mois. (147) | Un Head of Growth dans votre équipe. Des rendez-vous, pas des rapports. | BreadcrumbList, FAQPage, Offer, Service | index |
| /manifeste | Manifeste : notre vision du growth marketing | Cely (51) | Le manifeste Cely : notre vision du growth marketing pour les startups B2B. Comprendre avant d'agir, s'intégrer à l'équipe, rester tant que ça marche. (150) | Ce qu'on croit, avant de toucher à un seul canal. | BreadcrumbList, Person | index |
| /mentions-legales | Mentions légales | Cely (23) | Mentions légales du site celygrowth.com : éditeur du site, coordonnées, hébergement, propriété intellectuelle et renvoi vers la politique de données. (149) | Mentions légales | BreadcrumbList | noindex |
| /motion-design | Vidéo motion design à 500 € (offre de lancement) | Cely (55) | Votre vidéo en motion design jusqu'à 60 s pour 500 € au lieu de 1 000 € : livrée en 7 jours, tous formats, révisions illimitées. 5 places seulement. (148) | Votre vidéo en motion design pour 500 €. | BreadcrumbList, FAQPage, Offer, Service | index |
| /nous-rejoindre | Nous rejoindre : réseau d'experts growth | Cely (47) | Rejoindre le réseau Cely : experts outbound, paid, SEO, tracking et contenu, mobilisés selon les besoins réels de chaque mission client, dans la durée. (151) | Construire le réseau d'experts qui fait grandir nos clients. | BreadcrumbList | noindex |
| /services | Growth freelance ou directeur marketing externalisé ? | Cely (60) | Growth marketer freelance, directeur marketing externalisé ou growth à temps partagé : quelles différences pour une startup B2B ? Comment choisir le bon format. (160) | Growth freelance, direction marketing externalisée ou growth à temps partagé ? | BreadcrumbList | index |
