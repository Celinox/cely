# Inventaire celygrowth.com — avant modifications

Source : les fichiers du dossier SITE CELY (version locale, accueil v3 inclus, pas encore poussée). Le site en ligne tourne encore sur l'ancienne accueil.

## 1. Routes et sitemap

| URL | Fichier | Dans le sitemap | robots | Statut |
|---|---|---|---|---|
| / | index.html | oui | index, follow | 200 (statique) |
| /404 | 404.html | non | noindex, follow | 200 (statique) |
| /actualites | actualites.html | oui | index, follow | 200 (statique) |
| /actualites/inbound-vs-outbound | actualites/inbound-vs-outbound.html | oui | index, follow | 200 (statique) |
| /actualites/referencement-ia | actualites/referencement-ia.html | oui | index, follow | 200 (statique) |
| /audit | audit.html | oui | index, follow | 200 (statique) |
| /audit/audit-marketing-digital | audit/audit-marketing-digital.html | oui | index, follow | 200 (statique) |
| /confidentialite | confidentialite.html | non | noindex, follow | 200 (statique) |
| /contact | contact.html | oui | index, follow | 200 (statique) |
| /cookies | cookies.html | non | noindex, follow | 200 (statique) |
| /growth | growth.html | oui | index, follow | 200 (statique) |
| /manifeste | manifeste.html | oui | index, follow | 200 (statique) |
| /mentions-legales | mentions-legales.html | non | noindex, follow | 200 (statique) |
| /motion-design | motion-design.html | oui | index, follow | 200 (statique) |
| /nous-rejoindre | nous-rejoindre.html | oui | index, follow | 200 (statique) |
| /services | services.html | oui | index, follow | 200 (statique) |

Pas de CMS ni de route dynamique : une source unique `src/site.html`, générée en pages statiques par `scripts/build.py`. Vercel : `cleanUrls`, pas de slash final, 301 de celygrowth.com et 2celygrowth.vercel.app vers www.

**/motion-design** : la page existe bien dans le code et répond en 200 en ligne (vérifié : H1 « Votre vidéo en motion design pour 500 € »). Elle n'est liée depuis aucune page. Comme demandé, je ne la redirige pas sans ton feu vert.

## 2. Metas, H1, H2, données structurées

| URL | Title (car.) | Meta (car.) | Canonical | H1 | Schémas | Images |
|---|---|---|---|---|---|---|
| / | Growth marketer à temps partagé pour startups B2B | Cely (56) | Cely structure l'acquisition des startups B2B qui n'ont pas encore de growth : outbound et inbound lancés dès le premier mois, sans engagement. (143) | ok | Le growth marketer à temps partagé de votre startup. | FAQPage, LocalBusiness, WebSite | 8, alt ok |
| /404 | Page introuvable | Cely (23) | Cette page n'existe pas ou plus. (32) | absent | Mauvais chemin. Ça arrive. | aucun | 3, alt ok |
| /actualites | Actualités growth marketing B2B | Cely (38) | Ce qu'on observe, ce qu'on teste — les analyses et retours d'expérience de Cely sur le growth marketing B2B. (108) | ok | Nos analyses et retours d'expérience sur la croissance. | aucun | 3, alt ok |
| /actualites/inbound-vs-outbound | Inbound vs outbound : quoi choisir en 2026 ? (+ simulateur) (59) | Inbound ou outbound marketing ? Avantages, canaux, ratios et méthode pour choisir la bonne stratégie B2B en 2026. Testez notre simulateur gratuit. (146) | ok | Inbound vs outbound : quoi choisir pour son entreprise en 2026 ? | BlogPosting, BreadcrumbList, FAQPage, Organization, Person | 5, alt ok |
| /actualites/referencement-ia | Référencement IA (GEO) : la ruée vers l'or de 2026 (50) | Le GEO, mythe ou réalité ? Ce que disent les études, ce qui change avec les Aperçus IA en France, et la méthode pour être cité par ChatGPT. (139) | ok | Le référencement IA : la ruée vers l'or de 2026 | BlogPosting, BreadcrumbList, FAQPage, Organization, Person, ScholarlyArticle, WebPage | 5, alt ok |
| /audit | Audits marketing digital pour startups B2B | Cely (49) | Les audits Cely : des diagnostics écrits et actionnables sur votre acquisition digitale. Découvrez l'Audit Marketing Digital, notre premier format. (147) | ok | Des audits pour voir clair avant d'agir. | aucun | 3, alt ok |
| /audit/audit-marketing-digital | Audit Marketing Digital complet (1 250 €) | Cely (48) | Audit Marketing Digital Cely : diagnostic complet de votre acquisition et plan d'action priorisé, en rapport écrit de 50 pages avec suivi — 1 250 €. (148) | ok | Voyez clair dans votre acquisition avec un audit marketing digital complet. | BreadcrumbList | 3, alt ok |
| /confidentialite | Politique de confidentialité | Cely (35) | Comment Cely traite les données personnelles transmises via les formulaires du site celygrowth.com, et comment exercer vos droits. (130) | ok | Politique de confidentialité | aucun | 3, alt ok |
| /contact | Contact : premier rendez-vous offert | Cely (43) | Parlez de votre croissance avec Cely : un premier rendez-vous offert de 30 minutes pour identifier vos blocages et repartir avec des pistes concrètes. (150) | ok | 30 minutes. Vous repartez avec 2 à 3 pistes concrètes. | aucun | 4, alt ok |
| /cookies | Cookies | Cely (14) | Les cookies utilisés sur celygrowth.com et comment les paramétrer. (66) | ok | Cookies | aucun | 3, alt ok |
| /growth | Growth Part-Time : un growth marketer intégré | Cely (52) | Growth Part-Time : Cely rejoint votre équipe 6 à 10 h par semaine pour piloter votre acquisition — outbound, inbound et coordination des experts. (145) | ok | Un Head of Growth dans votre équipe. Des rendez-vous, pas des rapports. | FAQPage | 3, alt ok |
| /manifeste | Manifeste : notre vision du growth marketing | Cely (51) | Le manifeste Cely : notre vision du growth marketing pour les startups et PME B2B. Pas de plan livré en PDF, un pilotage intégré à votre équipe. (144) | ok | Ce qu'on croit, avant de toucher à un seul canal. | aucun | 4, alt ok |
| /mentions-legales | Mentions légales | Cely (23) | Mentions légales du site celygrowth.com : éditeur, hébergement et propriété intellectuelle. (91) | ok | Mentions légales | aucun | 3, alt ok |
| /motion-design | Vidéo motion design à 500 € (offre de lancement) | Cely (55) | Votre vidéo en motion design jusqu'à 60 s pour 500 € au lieu de 1 000 € : livrée en 7 jours, tous formats, révisions illimitées. 5 places. (138) | ok | Votre vidéo en motion design pour 500 €. | BreadcrumbList, FAQPage, Offer, Service | 3, alt ok |
| /nous-rejoindre | Nous rejoindre : réseau d'experts growth | Cely (47) | Rejoindre le réseau Cely : experts outbound, paid, SEO, tracking et contenu, mobilisés selon les besoins réels de chaque mission client. (136) | ok | Construire le réseau d'experts qui fait grandir nos clients. | aucun | 3, alt ok |
| /services | Services growth marketing B2B | Cely (36) | Les services Cely au-delà du pilotage growth : growth marketing freelance et direction marketing externalisée — formats en préparation. (135) | ok | Ce qu'on peut prendre en charge, au-delà du pilotage growth. | aucun | 3, alt ok |

H2 par page :

- **/** : Cely, en une minute. · Pas encore de growth ? Ça ressemble sûrement à ça. · Vous avez quatre options. · Dans 30 jours, voilà ce qui a changé. · Chaque semaine, votre acquisition avance. Même quand vous êtes pris ailleurs. · Ce qu'on pilote pour vous. · Les bons outils ne suffisent pas. Il faut quelqu'un à la barre. · Vos questions, en clair. · Nos dernières actus. · Pas encore de growth ? Parlons-en.
- **/404** : 
- **/actualites** : Ce qu'on vient de publier. · Un premier rendez-vous.Des pistes concrètes pour avancer.
- **/actualites/inbound-vs-outbound** : Inbound vs outbound : les avantages et les inconvénients en un coup d'œil · Inbound vs outbound : quelle différence et quels canaux ? · 1. L'inbound marketing : faire venir les clients à vous · 2. L'outbound marketing : aller chercher ses clients · 3. Inbound et outbound marketing combinés : la stratégie la plus solide en B2B · 4. Comment choisir entre inbound et outbound ? · 5. Inbound ou outbound : quelle stratégie pour votre situation ? · FAQ : inbound vs outbound · Conclusion : inbound ou outbound, la bonne réponse est celle que vous tiendrez · Pour aller plus loin. · Un premier rendez-vous.Des pistes concrètes pour avancer.
- **/actualites/referencement-ia** : Mon avis, sans filtre : le SEO tel qu'on le connaît a deux ans devant lui · Le GEO : mythe ou réalité ? · Le GEO : il suffit d'avoir un bon SEO ? · Ce que disent vraiment les études (et pas les posts LinkedIn) · Comment les IA choisissent-elles qui elles citent ? · Par où commencer quand on est une PME B2B ? · Les 7 erreurs qui vous rendent invisible pour les IA · Votre site est-il visible dans les IA ? · FAQ : le référencement IA · Conclusion : la ruée vers l'or, c'est maintenant · Pour aller plus loin. · Un premier rendez-vous.Des pistes concrètes pour avancer.
- **/audit** : L'audit à faire dès maintenant. · Pas sûr qu'un audit soitle bon format ?
- **/audit/audit-marketing-digital** : Un premier échange n'est pas un audit. · Trois situations où un audit a du sens. · Cinq familles de sujets, passées au crible. · Quatre étapes, du cadrage au suivi. · Un format fixe, un prix fixe. · Ce qu'on nous demande le plus souvent. · Parlons de votre situation.Voyez si l'Audit Marketing Digital a du sens.
- **/confidentialite** : Responsable du traitement · Données collectées et finalités · Destinataires et sous-traitants · Durée de conservation · Vos droits
- **/contact** : Choisissez votre créneau · Vous préférez écrire ? · Message envoyé. · L'envoi n'a pas abouti. · Ce qui se passe après votre envoi.
- **/cookies** : Cookies déposés par Cely · Services tiers · Paramétrer votre navigateur
- **/growth** : Growth Part-Time, dans quel cas ? · Ce que Cely fait, concrètement. · Les 30 premiers jours, concrètement. · Comment se déroule la collaboration, semaine après semaine. · Un engagement progressif, sans surprise. · Vos questions, en clair. · Parlons de votre situation.Repartez avec de premières pistes.
- **/manifeste** : On ne croit pas au growth livré en PDF. · On commence par comprendre. · On construit avec l'équipe qui va le vivre. · On préfère peu de clients, bien accompagnés. · On s'intègre, où que vous soyez. · On préfère être jugés sur les résultats que sur un contrat.
- **/mentions-legales** : Éditeur du site · Hébergement · Propriété intellectuelle · Données personnelles
- **/motion-design** : Nos réalisations. · Une minute pour convaincre. · La qualité d'un studio, sans le prix ni l'attente. · Simple, de la visio à la validation. · Un prix de lancement, pas une promo permanente. · Les questions qu'on nous pose. · Votre prochaine vidéo peut être prête dans 7 jours.
- **/nous-rejoindre** : Les domaines sur lesquels on cherche des profils. · Trois principes qui guident la collaboration. · Parlez-nous de votre expertise. · Une question avant de postuler ?Parlons-en directement.
- **/services** : Deux formats en cours de construction. · Un besoin qui ne rentredans aucune case ?

Constats SEO : 7 meta descriptions sous 140 caractères ; og:image générique (`cely-mark-ce.png`) sur toutes les pages sauf les articles ; pas de BreadcrumbList hors articles et audit ; LocalBusiness avec des horaires incohérents (dimanche ouvert) ; pas de schéma Service sur /growth ni /audit/audit-marketing-digital ; aucun schéma sur /actualites.

## 3. Crawl des liens

- **Liens internes** : 0 lien cassé, 0 ancre morte (tous les `href` résolus vers une page existante, toutes les `#ancres` trouvées).
- **Liens externes** : 42, non testables depuis mon environnement (sortie réseau bloquée) ; je les vérifie un par un à la fin.
- **Renvois annoncés sans lien réel** (inbound-vs-outbound) :
  - « On détaille la méthode dans notre accompagnement SEO/GEO » : texte sans lien ;
  - « On détaille notre méthode dans cet article sur le contenu LinkedIn » : article inexistant ;
  - « On a résumé notre approche dans cet article sur YouTube en B2B » : article inexistant ;
  - « Sales Navigator, dont on parle en détail dans cet article » : article inexistant ;
  - « On explique le montage technique dans cet article » : article inexistant ;
  - « Un exemple concret de ce que ça donne sur la durée : ce cas client. » : aucun cas publié ;
  - « Un exemple chiffré ? Ce cas client. » : aucun cas publié ;
  - « C'est aussi le cœur de notre offre de prospection » : texte sans lien ;
  - « notre méthode IMPA » : aucune page ;
  - « La nôtre suit cette logique, si vous voulez voir à quoi ça ressemble » (newsletter) : aucune newsletter en ligne.
- **referencement-ia** : aucun renvoi mort trouvé.

## 4. Placeholders et mentions à retirer

- /growth : « Point hebdo — Semaine du [ ] », « coordonner les bons experts », carte « Coordonner », « coordination des experts », « intervention d'un expert spécialisé », FAQ « coordonne les expertises complémentaires ».
- /services : badges « Bientôt disponible », « formats en préparation », « prestataires ».
- /manifeste : « pour chaque expert qui travaille avec Cely », « prestataire » (dans un sens positif : « pas un prestataire de plus »).
- /mentions-legales, /confidentialite : `[À compléter : SIRET]`, `[À compléter : forme juridique]`, `[À compléter : adresse e-mail de contact]`, `[À compléter : valider cette durée]` → j'ai besoin de ces infos.
- /motion-design : « Vidéo exemple bientôt en ligne », « Bientôt vous ».
- « [X XXX] abonnés LinkedIn » et « [Photo à produire] » : plus présents dans les pages générées.

## 5. Historique git (anciennes URLs)

- `/cely.html` : ancienne page d'accueil, supprimée → 301 vers / à ajouter.
- Images déplacées de la racine vers /images (`/cely-logo-light.png`, `/cely-logo-light.webp`, `/cely-logo-dark.png`, `/cely-mark-ce.png`, `/celien-boillot.png`, `/og-inbound-vs-outbound.png`) → 301 à ajouter (anciennes og:image possiblement en cache chez LinkedIn).
- Déjà en place : /index.html, /home, /actualites/gabarit et 5 anciens slugs d'articles → /actualites.
