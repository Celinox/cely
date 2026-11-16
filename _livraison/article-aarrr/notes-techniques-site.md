# Notes techniques — site celygrowth.com (à lire avant de publier l'article AARRR)

## Où sont les fichiers
- Dossier sur le Mac : `/Users/maccelien/Documents/SITE CELY` (dépôt git `Celinox/cely`, déployé par Vercel à chaque push sur `main`). Célien pousse lui-même depuis son Terminal : ne jamais pousser à sa place.
- Le shell du Mac (device_bash) ne monte pas toujours ce dossier. Méthode fiable : `device_stage_files` des fichiers nécessaires → travail dans le conteneur cloud → `python3 scripts/build.py` dans le conteneur → `device_commit_files` des fichiers sources ET des fichiers générés (le build n'est pas relancé sur le Mac).
- Fichiers à récupérer : `src/site.html`, `src/site-config.json`, `scripts/build.py`, `scripts/lastmod.json`, `vercel.json`, `api/*.js`, et le dossier `images/` (logos, photos, covers, og). Lister avec `device_list_dir` (récursif).

## Architecture
- Source unique : `src/site.html`. Chaque page est un `<main class="site-page" data-page="CLE" hidden>…</main>`.
- `scripts/build.py` génère une page HTML statique par entrée de la liste `PAGES` (key, out, path, title ≤ 60 car., desc ≤ 160 car., crumbs, ld, img, og_type, article). Il injecte head/OG/JSON-LD, le fil d'Ariane (à partir de `crumbs`), le bandeau (`topbar=True` → pas sur les articles), le CTA final (marqueur `<!--CTA_FINAL-->` dans le main), et met à jour `sitemap.xml` + `scripts/lastmod.json`.
- Il construit automatiquement un FAQPage depuis `.art-faq-item` / `.gpt-faq-item` / `.aud-faq-item`. Pour l'article AARRR le brief demande **pas de FAQPage** : utiliser le composant FAQ des articles mais désactiver le FAQPage pour cette page (ajouter une option `no_faq=True` dans build.py et la respecter dans `head_for`/`main`).
- Constantes `{{LINKEDIN_URL}}`, `{{CALENDLY_URL}}` depuis `src/site-config.json`.
- Le build refuse un title > 60 caractères et exige un seul H1 par page.
- `navKey` dans le JS d'initialisation (chercher `var navKey = {`) : ajouter la clé de la nouvelle page → `'actualites'`.

## Composants à réutiliser (copier depuis les mains `article` et `article-ia`)
- En-tête article : `art-progress`, `art-header` (cat, h1, dek, `art-meta-row` avec temps de lecture + partage LinkedIn / copier le lien), bloc auteur `art-authorhead`, `art-tldr` (À retenir), `art-layout` avec sommaire `art-toc` (liens `#ancre`), `art-content`, encadrés `art-callout` (`art-callout-tip`, `art-callout-warning`), tableaux `art-table-wrap`/`art-table`, FAQ `art-faq` / `art-faq-item` (summary avec `<h3>` + `art-faq-icon`), `art-final-cta`, `art-author-card`, puis section `art-next` (« À lire ensuite », cartes `rs-card`) et `<!--CTA_FINAL-->`.
- Simulateur avec capture e-mail : celui de l'article inbound-vs-outbound (`#artSim`, form `#artsimForm`, envoi vers `/api/lead-article`). S'en inspirer pour le Diagnostic AARRR et créer une fonction `api/diagnostic-aarrr.js` sur le modèle de `api/contact.js` (Resend, variables `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM`, honeypot, rate limit, validation serveur). Destinataire : celygrowth@gmail.com via `CONTACT_TO_EMAIL` (le signaler : vérifier la variable dans Vercel). Le résultat s'affiche côté client sans attendre l'envoi.
- Accordéon exclusif + workflow + barre de progression : déjà gérés par le script commun (bloc commençant par `ACCUEIL — apparitions au défilement`) pour tout `main.site-page` ; la FAQ exclusive cible `.hp-faq details` → mettre la classe `hp-faq` sur le conteneur de FAQ de l'article.
- Couverture de carte : générer `images/covers/cover-framework-aarrr.webp` (1200×630, DA prune #1A1128, violet #682DFE, lavande #E9D7FF, rose #E88BF7, polices M PLUS Rounded 1c 800 / Space Grotesk / Manrope) et une image OG `images/og-framework-aarrr.png`.
- Pages de ressources : ajouter la carte de l'article dans `/actualites` (main `actu`, grille `rs-grid`) et dans le JSON-LD `COLLECTION` de build.py ; ajouter le lien « À lire ensuite » dans les deux autres articles si pertinent.

## URLs internes réelles
- Growth Part-Time : `/growth` · Audit : `/audit/audit-marketing-digital` (hub : `/audit`) · Contact : `/contact#formulaire` · Article inbound vs outbound : `/actualites/inbound-vs-outbound` · Article référencement IA : `/actualites/referencement-ia` · Ressources (catégorie) : `/actualites`.
- Il n'existe pas de page catégorie « Growth marketing B2B » : le fil d'Ariane est Accueil › Ressources › Framework AARRR (le brief dit « Actualités », le label du site est « Ressources » pour l'URL /actualites — garder « Ressources » et le signaler).

## Règles du site à respecter
- Aucune mention de prestataires / experts externes, aucun faux chiffre, avis ou client, vouvoiement.
- CTA : « Faire le point avec Célien » (principal), « Obtenir mon diagnostic gratuit » (contextuel), tous vers `/contact#formulaire`.
- Contrastes AA (liens dans les articles en #5B22E0), focus visibles, `prefers-reduced-motion`.

## Vérifications avant de livrer
- Crawl : 0 lien interne cassé, 0 ancre morte (`#diagnostic-aarrr` depuis la partie 1 et la FAQ).
- Captures 375 / 768 / 1280 / 1440 avec Playwright (`/opt/pw-browsers/chromium`), aucune erreur console, un seul H1.
- Lighthouse mobile ≥ 90 si possible.
- Après commit sur le Mac, revérifier quelques fichiers par md5 (re-stage et comparer).
- Republier l'aperçu de l'accueil n'est pas nécessaire pour un article.

## À donner à Célien à la fin
Compte rendu en français : URL, décisions prises, liens externes hors service, assets à produire (vidéo), et les commandes à copier, une par bloc :
cd "/Users/maccelien/Documents/SITE CELY"
git add -A src scripts api images *.html actualites audit sitemap.xml vercel.json
git commit -m "Nouvel article : le framework AARRR + diagnostic"
git push origin main
