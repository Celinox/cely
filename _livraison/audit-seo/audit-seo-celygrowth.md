# Audit SEO — celygrowth.com (lecture seule)

Date : 15 novembre 2026. Base : branche `main` (commit 38ca396), identique à la production (titres, canonicals et meta robots relus en prod sur les 19 pages). Aucune modification faite.
Outils : lecture du code et des 20 pages générées, requêtes en lecture sur la prod (navigateur), Lighthouse mobile en local (simulation, polices servies localement), PageSpeed via Ubersuggest sur la prod. Aucune donnée terrain (CrUX) ni donnée de trafic ou de positionnement disponible.

## 1. Synthèse

Le socle technique est sain : HTTPS + www canonique, 301 sur slash final et `.html`, vraie 404 en `noindex`, sitemap aligné sur les pages indexables, un H1 unique partout, titles et descriptions uniques et à la bonne longueur, Open Graph et Twitter complets, JSON-LD valide (syntaxe) sur toutes les pages.
Les points faibles sont surtout du maillage, de la cohérence d'URL et du rendu sans JavaScript.

Les 5 priorités :
1. **S04** — L'Offre découverte n'est pas sous /services (`/services/offre-decouverte` répond 404 en prod). Corrigé par le lot 2.
2. **S01** — `/motion-design` est indexée et dans le sitemap, mais aucune page ne pointe vers elle (page orpheline). Décision à prendre : la relier, la passer en noindex ou la rediriger.
3. **S02** — Sans JavaScript, le H1 et une partie du texte sont invisibles (opacité 0) sur 6 des 7 pages testées. Le texte reste dans le HTML, mais c'est fragile pour les robots qui n'exécutent pas le JS.
4. **S05 / S06** — Hub `/audit` (1 seul lien entrant) et articles récents (3 à 4 liens entrants, profondeur 2) faiblement maillés.
5. **S07 / S14** — Recouvrement de mots-clés entre accueil, /growth et /comparatif ; poids HTML élevé (≈ 460 à 540 Ko par page, dont ≈ 144 Ko de CSS inutilisé).

## 2. Inventaire des pages

Routage = fichiers HTML générés par `scripts/build.py`. Sitemap = 15 URL. Écarts routage/sitemap : les 4 pages en `noindex` et la 404 sont hors sitemap (normal). Aucune URL du sitemap ne manque au routage, aucune page indexable ne manque au sitemap.

| URL | Title | H1 | Indexable | Canonical |
|---|---|---|---|---|
| / | Agence growth marketing B2B pour startups \| Cely | Le growth marketer à temps partagé de votre startup. | oui | https://www.celygrowth.com/ |
| /growth | Growth marketer freelance pour startups B2B \| Cely | Un Head of Growth dans votre équipe. Des rendez-vous, pas des rapports. | oui | …/growth |
| /services | Services growth marketing B2B \| Cely | Nos services pour votre croissance digitale. | oui | …/services |
| /offre-decouverte | Offre découverte : testez votre marché en 28 jours \| Cely | Testez votre marché en 28 jours. | oui | …/offre-decouverte |
| /audit | Audits marketing digital pour startups B2B \| Cely | Des audits pour voir clair avant d'agir. | oui | …/audit |
| /audit/audit-marketing-digital | Audit Marketing Digital complet (1 250 €) \| Cely | Voyez clair dans votre acquisition avec un audit marketing digital complet. | oui | …/audit/audit-marketing-digital |
| /comparatif-growth-marketing | Freelance, agence ou directeur marketing externalisé ? | Freelance, agence, salarié ou directeur marketing externalisé : que choisir ? | oui | …/comparatif-growth-marketing |
| /actualites | Ressources growth marketing B2B : guides et outils \| Cely | Ressources growth marketing B2B | oui | …/actualites |
| /actualites/inbound-vs-outbound | Inbound vs outbound : quoi choisir en 2026 ? (+ simulateur) | Inbound vs outbound : quoi choisir pour son entreprise en 2026 ? | oui | …/actualites/inbound-vs-outbound |
| /actualites/referencement-ia | Référencement IA (GEO) : la ruée vers l'or de 2026 | Le référencement IA : la ruée vers l'or de 2026 | oui | …/actualites/referencement-ia |
| /actualites/framework-aarrr | Framework AARRR : définition, étapes et limites en B2B | Le framework AARRR, mais qu'est-ce que c'est ? | oui | …/actualites/framework-aarrr |
| /actualites/lead-magnet | Lead magnet : définition, types et ce qui marche en B2B | Lead magnet : pourquoi votre PDF ne convertit plus (et par quoi le remplacer) | oui | …/actualites/lead-magnet |
| /motion-design | Vidéo motion design à 500 € (offre de lancement) \| Cely | Votre vidéo en motion design pour 500 €. | oui | …/motion-design |
| /manifeste | Manifeste : notre vision du growth marketing \| Cely | Ce qu'on croit, avant de toucher à un seul canal. | oui | …/manifeste |
| /contact | Contact : premier rendez-vous offert \| Cely | Réservons 30 minutes pour faire le point. | oui | …/contact |
| /nous-rejoindre | Nous rejoindre : réseau d'experts growth \| Cely | Construire le réseau d'experts qui fait grandir nos clients. | non (noindex, follow) | …/nous-rejoindre |
| /mentions-legales | Mentions légales \| Cely | Mentions légales | non (noindex, follow) | …/mentions-legales |
| /confidentialite | Politique de confidentialité \| Cely | Politique de confidentialité | non (noindex, follow) | …/confidentialite |
| /cookies | Cookies \| Cely | Cookies | non (noindex, follow) | …/cookies |
| 404 (toute URL inconnue) | Page introuvable \| Cely | Cette page n'existe pas (ou plus). | non (noindex, follow), code 404 | — |

## 3. Constats

| ID | Catégorie | Page(s) | Constat | Preuve | Gravité | Effort | Piste de correction | Statut |
|---|---|---|---|---|---|---|---|---|
| S01 | Indexabilité / maillage | /motion-design | Page indexable et présente dans le sitemap, mais aucun lien interne n'y mène (orpheline). Elle présente une « offre de lancement limitée à 5 projets ». | Parcours des liens des 20 pages : 0 lien entrant ; sitemap `<loc>…/motion-design` ; prod 200, `index, follow`. | haute | faible | Décider : la relier (services, footer), la passer en noindex, ou la rediriger en 301. | vérifié |
| S02 | Rendu sans JS | /growth, /services, /offre-decouverte, /contact, /audit, /actualites/lead-magnet | Les blocs `.reveal` ont `opacity:0` par défaut et ne deviennent visibles qu'avec le JS : sans JS, le H1 est invisible (≈ 2 300 mots masqués sur l'article lead magnet, 385 sur /growth). Le texte reste présent dans le HTML. Accueil non concerné. | Rendu Playwright JS désactivé sur main : `h1Visible:false` sur 6 pages ; CSS `.reveal{ opacity:0 … }`. | moyenne | faible | Ne masquer qu'avec une classe posée par le JS (comme `.hp-anim .hp-in` sur l'accueil). | vérifié |
| S03 | Redirections | toutes | `http://celygrowth.com/growth/` aboutit bien à `https://www.celygrowth.com/growth` ; le nombre de sauts de la chaîne n'a pas pu être mesuré. PageSpeed signale « Redirects » (≈ 1,4 s mobile) quand l'URL testée n'est pas la canonique. | Navigation réelle (URL finale) ; Ubersuggest PageSpeed du 15/11. | basse | faible | Toujours utiliser `https://www.celygrowth.com/...` dans les liens externes ; mesurer la chaîne avec un outil qui affiche chaque saut. | partiel |
| S04 | URL / maillage | /offre-decouverte, /services | L'Offre découverte est une page autonome, absente de /services ; `/services/offre-decouverte` répond 404. | Prod : `/services/offre-decouverte` → 404 ; `/offre-decouverte` → 200. | haute | faible | **Corrigé par le lot 2** (URL canonique sous /services, 301 depuis l'ancien chemin, entrée dans le hub). | vérifié |
| S05 | Maillage | /audit | Le hub des audits n'a qu'un lien entrant (profondeur 2). Le pied de page pointe vers l'audit détaillé, pas vers le hub. | Parcours en largeur depuis / : /audit à profondeur 2, 1 lien entrant. | moyenne | faible | Ajouter le hub dans la navigation de /services ou dans le footer. | vérifié |
| S06 | Maillage | articles | Liens entrants : inbound-vs-outbound 5, referencement-ia 4, framework-aarrr 4, lead-magnet 3 ; lead-magnet et framework-aarrr à profondeur 2. | Même parcours. | moyenne | faible | Lier les articles depuis les pages services concernées (outbound, inbound, stratégie). | vérifié |
| S07 | Contenu / cannibalisation | /, /growth, /comparatif-growth-marketing, /services | Recouvrement sur « growth marketing B2B / growth marketer freelance / agence growth marketing » : title de l'accueil (« Agence growth marketing B2B »), title de /growth (« Growth marketer freelance »), mots-clés du JSON-LD du comparatif (« growth marketer freelance », « agence growth marketing »), title de /services (« Services growth marketing B2B »). | Titles et `keywords` JSON-LD relus. | moyenne | moyen | Attribuer un mot-clé principal par page et l'aligner dans title, H1 et maillage. | partiel (sans données de positionnement) |
| S08 | Balisage / contenu | /growth, /, /contact | Le H1 ne reprend pas le mot-clé du title (ex. /growth : title « Growth marketer freelance… », H1 « Un Head of Growth dans votre équipe… »). | Inventaire ci-dessus. | basse | faible | Intégrer le mot-clé principal dans le H1 ou un sous-titre proche. | vérifié |
| S09 | Contenu mince | /audit, /actualites, /cookies | Contenu principal court : /audit ≈ 260 mots, /actualites ≈ 311 (surtout du texte de liens), /cookies ≈ 96 (noindex). | Comptage des mots du `<main>`. | basse | moyen | Ajouter un court texte d'introduction utile sur /audit et /actualites. | vérifié |
| S10 | Accessibilité | /actualites/lead-magnet | Contraste insuffisant sur `.lmg-p-name` (panneau du générateur) : Lighthouse accessibilité 96. | Lighthouse mobile local, audit `color-contrast`. | basse | faible | Foncer la couleur du texte du panneau. | vérifié (labo) |
| S11 | Données structurées | toutes | JSON-LD présent et syntaxiquement valide partout : LocalBusiness + WebSite + Person (accueil), Service (growth, audit, motion, offre), ItemList (services, ressources), Article/BlogPosting (articles), BreadcrumbList (toutes les pages internes), FAQPage (8 pages). Les pages référencent l'organisation par `@id` sans la redéfinir localement. Validation Google (Rich Results Test) non faite. | Parsing JSON de tous les blocs : 0 erreur. | basse | faible | Passer les 5 modèles de page dans le Rich Results Test. | partiel |
| S12 | Données structurées | 8 pages | FAQPage très présent ; Google n'affiche plus ces extraits que pour quelques sites (gouvernement, santé). Aucun effet visible attendu dans les résultats, mais pas d'erreur. | Types relevés en S11. | basse | — | Garder pour la compréhension des moteurs et des IA ; ne pas en attendre d'extrait enrichi. | vérifié |
| S13 | Indexabilité | légales, /nous-rejoindre | `noindex, follow` volontaire, pages hors sitemap et non bloquées dans robots.txt : le noindex est lisible par les moteurs. | Prod : meta robots + robots.txt (`Disallow: /api/` seulement). | — | — | Rien à corriger ; /nous-rejoindre reste une décision éditoriale. | vérifié |
| S14 | Performance | toutes | HTML lourd (460 à 540 Ko avant compression, compression brotli active) : tout le CSS du site est intégré à chaque page, dont ≈ 144 Ko inutilisés par page. DOM : 1 084 éléments sur l'accueil. | Taille des réponses en prod ; Ubersuggest « Unused CSS » 144-146 Ko. | moyenne | élevé | Découper le CSS par page au build. | vérifié |
| S15 | Performance | /, /services, /actualites/lead-magnet | Prod (Ubersuggest, labo, accueil) : mobile LCP 2,4 s, CLS 0,070, TBT 0 ms ; desktop LCP 0,6 s, CLS 0,005. Local (Lighthouse mobile, simulation) : / 81, /services 91, lead-magnet 91 ; LCP 2,4 / 2,5 / 2,7 s. Pas de données terrain. | Rapports Ubersuggest et Lighthouse du 15/11. | basse | — | Vérifier les Core Web Vitals réels dans la Search Console (rapport Signaux Web essentiels). | partiel |
| S16 | Indexabilité | toutes | Doublons maîtrisés : `/growth/` → 301 `/growth` ; `/services.html` → `/services` ; `/index.html`, `/home`, `/cely` → `/` ; 404 réelle avec noindex ; canonicals absolues et auto-référentes. | Requêtes prod (redirection détectée puis URL finale). | — | — | — | vérifié |
| S17 | Images | toutes | Aucune image sans attribut alt. Les `alt=""` concernent des images décoratives (couvertures de cartes déjà titrées, logo du footer, avatars à côté du nom, copies des logos clients qui défilent). | Parsing des `<img>` des 20 pages. | basse | — | Rien à corriger. | vérifié |
| S18 | Balisage | toutes | Langue `fr`, viewport, favicon et apple-touch-icon présents ; Open Graph et Twitter complets (sauf `og:url` sur la 404, sans importance). | Parsing des `<head>`. | basse | — | — | vérifié |
| S19 | Ressources | /actualites/* | URL lisibles ; dates de publication et de mise à jour cohérentes entre la page, les meta `article:*` et le JSON-LD ; auteur Célien Boillot (Person + LinkedIn) ; catégorie via `article:section`. | Ex. inbound-vs-outbound : publié le 18/09, mis à jour le 23/10 (page, meta, JSON-LD). | — | — | — | vérifié |
| S20 | Scripts tiers | toutes | Google Fonts (CSS chargé en différé) et widget de réservation cely-crm (async, toutes pages sauf contact et motion design). Leur impact réel n'a pas pu être mesuré (domaines bloqués dans l'environnement de test). | Code source. | indéterminée | — | Mesurer avec PageSpeed Insights sur la prod, avec et sans le widget. | non testé |
| S21 | Accueil | / | La section logos du lot 1 ne change rien au SEO (aucun texte indexable ajouté ni retiré). | Diff du lot 1. | — | — | — | vérifié |

## 4. Points non testés

- **Chaîne de redirection exacte** (http → https → www → sans slash) : il faut un outil qui affiche chaque saut (curl `-I -L`, Screaming Frog) ; l'environnement de test bloque les requêtes directes vers le domaine.
- **Core Web Vitals terrain** : il faut les données CrUX (Search Console ou PageSpeed Insights avec assez de trafic).
- **Validation Google des données structurées** : Rich Results Test et rapport « Améliorations » de la Search Console.
- **Couverture d'index réelle** (pages indexées, exclues, canonicals choisies par Google) : rapport « Pages » de la Search Console.
- **Impact du widget de réservation et de Google Fonts** sur la performance réelle : PageSpeed Insights sur la prod.
- **Trafic, positionnement et cannibalisation effective** : Search Console (requêtes par page) ; aucune donnée disponible ici.
