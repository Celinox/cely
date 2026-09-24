# CELY — Refonte intégrale — Concept créatif & architecture (Checkpoint avant développement)

*Document de validation — rien n'est codé tant que ce document n'est pas validé (§108-109 du brief).*

Sources utilisées : `Cely_Brandbook_2026_FINAL.pdf`, `Cely_Synthese_Positionnement.pdf` (16/09/2026), inspection de bulldozer-collective.com, wenoble.fr, pharmagreen.fr/fr.

---

## 0. Ce que je retiens de chaque référence (Phase B)

**Bulldozer** — à garder : la structure en paliers (qualification → preuve → offres → conversion), le fait qu'une offre "chef d'orchestre" se décline en sous-briques lisibles, le ton assertif sans emphase. À ne pas reprendre : les faux dashboards produit, le contraste marine/jaune saturé (hors palette Cely), la logique 100% B2B SaaS froide.

**Wenoble** — à garder : la grande typographie, les photos qui débordent du cadre, les portraits nets sur fond réel, le rythme (jamais deux sections identiques d'affilée). À ne pas reprendre : la couleur orange, les logos clients, les études de cas chiffrées (nous n'en avons pas encore).

**Pharmagreen** — à garder : le principe d'un mini-outil dans le Hero qui redonne une lecture personnalisée immédiate, en 2 écrans, avec capture d'email au moment du résultat. À ne pas reprendre : le calcul pseudo-financier ("économies : X €") — interdit par le brief (§44) et par la synthèse positionnement (aucun chiffre inventé).

---

## 1. Concept créatif (une direction, assumée)

### Nom de la direction : **LE CARNET DE BORD**

Cely ne vend pas un tableau de bord (dashboard) — c'est justement ce que l'ancien site faisait trop (control room, radial cluster, etc.), et le brief l'interdit explicitement (§21, §105). Cely vend un **suivi hebdomadaire réel, tenu par une personne**, avec des décisions écrites noir sur blanc chaque semaine. C'est un carnet, pas un cockpit.

**Système visuel à 2 signatures** (au lieu des 5 diagrammes de l'ancien site) :

- **Signature A — Le Trait** : un unique trait tracé à la main (SVG, épaisseur irrégulière, jamais un dégradé néon) qui relie deux idées — un canal à un autre, un problème à une priorité. Utilisé UNIQUEMENT pour montrer une mise en relation/pilotage. Jamais décoratif.
- **Signature B — L'Annotation** : des petites notes marginales (flèches, cercles, ratures, mots clés en Space Grotesk, encre violette) posées sur de vraies photos ou de vrais documents (page d'audit, écran de brief, carnet). C'est la marque déjà présente dans le design system (`.annot`) — on l'étend en véritable direction artistique au lieu d'un composant isolé.

Ces deux signatures suffisent pour toute la refonte. Aucune autre métaphore graphique (pas de "control room", pas de radial cluster, pas de slider "moment").

**Test de marque (§118)** : logo masqué, le site reste identifiable par — la palette prune/violet/lavande, le mot "chef d'orchestre"/"pilote", les annotations manuscrites sur photos réelles, le "//" en label. C'est spécifique à Cely, pas un template SaaS.

### Ambiance en 4 mots
Documentaire. Précis. Chaleureux. Sobre. (Jamais : futuriste, corporate froid, gamifié.)

---

## 2. Structure définitive des pages

Inchangée par rapport au brief (§31), confirmée :

1. Accueil
2. Growth Part-Time
3. Audit
4. Manifeste
5. Nous rejoindre
6. Contact
7. Actualités (Hub)
8. Article (template dynamique)

Navbar (§32) : Growth Part-Time, Audit, Actualités, Manifeste, Nous rejoindre — CTA "Parler de votre croissance". Ordre confirmé conforme à la priorité commerciale Growth Part-Time > Audit (synthèse positionnement, section 3 : l'Audit passe "en lien discret").

---

## 3. Wireframe détaillé — Homepage

| # | Section | Contenu | Statut contenu |
|---|---|---|---|
| 1 | **Hero + mini-simulateur** | H1 clair + sous-ligne + simulateur à droite (desktop) | Copy à valider (voir §4-5) |
| 2 | **Confiance éditoriale** | PAS de logos (aucun client réel). Remplacée par un court paragraphe "une seule direction, les bonnes expertises au bon moment" + mention du fonctionnement réel (orchestration + partenaires) | Remplace la fausse preuve sociale — conforme §51 |
| 3 | **Le problème** | Grande composition 50/50 : titre + photo éditoriale d'un côté, liste numérotée de 5 tensions concrètes de l'autre (texte de la synthèse positionnement : canaux qui avancent séparément, tests non mesurés, outils cloisonnés) | Textes à écrire (Phase F), mécanisme validé |
| 4 | **"Ça vous parle ?"** | 3-5 situations types (pas des témoignages), grande typo, signature B (annotations) sur les phrases clés | Explicitement non attribué à un client — conforme §57 |
| 5 | **Comment ça marche** | 4 cards éditoriales empilées (stacked cards, signature A pour relier les étapes) : Formulaire → Call de découverte → Call de proposition → Mission. Reprend EXACTEMENT le funnel de la synthèse positionnement (section 3), avec la mention explicite que le call de découverte ne livre PAS le plan complet | Mécanisme validé par la synthèse, copy à écrire |
| 6 | **Comparatif** | Tableau 5-7 critères : Recrutement temps plein / Freelances / Agence classique / Cely Growth Part-Time. Formulations non-absolues (§66) | À rédiger avec prudence (pas de "jamais"/"toujours") |
| 7 | **Ce que vous aurez entre les mains** | Remplace la section Avis (aucun avis réel aujourd'hasource). Montre les livrables réels du mois 1 (audit, plan, canaux lancés) | Conforme §70, aligné sur l'engagement 30 jours de la synthèse |
| 8 | **Actualités** | 1 article principal + 2 secondaires SI de vrais articles existent, sinon message honnête (déjà en place sur le site actuel après le nettoyage D0) | En attente des vrais articles |
| 9 | **CTA final** | "Votre growth n'a peut-être pas besoin d'un canal de plus. Il a peut-être besoin de quelqu'un pour tenir l'ensemble." + CTA "Voyons si Cely peut s'intégrer" | Copy proposée, à valider |
| 10 | **Footer** | Conforme §75 | — |

Sections explicitement retirées de la homepage par rapport à l'ancien site : bande de logos fictifs, diagramme "control room", slider "moment", radial cluster de l'Audit. Aucune de ces métaphores n'est reprise (conforme à la consigne "repartir de zéro", §02).

---

## 4. Composition du Hero

**Layout desktop** : grille 12 colonnes, texte sur 5-6 colonnes à gauche, simulateur sur 5-6 colonnes à droite (inspiré du principe Pharmagreen, exécution 100% Cely : fond off-white/lavande, pas de card SaaS générique).

**Copy proposée** (à valider, plusieurs options par ligne comme demandé au §36) :
- H1 : *"Le growth qui s'intègre."* (signature de marque conservée)
- Sous-ligne (une seule phrase, §37) : *"Cely rejoint votre équipe quelques heures par semaine pour piloter votre acquisition — pas pour ajouter un rapport de plus."*
- CTA : *"Vérifier si Cely peut vous accompagner"* (ouvre/scroll vers le simulateur)

**Mobile** : texte d'abord, simulateur juste après, jamais caché derrière un scroll long (§49).

---

## 5. Fonctionnement du simulateur

**Nom retenu** : *"Est-ce le bon moment pour un pilote growth ?"* (reprend directement "le moment d'achat" de la synthèse positionnement — pas de nom pseudo-scientifique).

**4 questions** (reprises et resserrées du §43, alignées sur l'ICP réel de la synthèse) :
1. Votre entreprise est-elle une startup tech B2B ? (Oui / Non / Modèle mixte)
2. Combien de personnes dans l'équipe ? (1-4 / 5-30 / 31-100 / 100+)
3. Où en êtes-vous ? (Produit en développement / Produit lancé, premiers clients / Traction, mais personne ne pilote l'acquisition / Acquisition déjà structurée avec un responsable growth)
4. Qui pilote aujourd'hui votre acquisition ? (Personne clairement / Le fondateur, en plus du reste / Plusieurs prestataires séparés / Un responsable growth dédié)

**Logique de restitution — déterministe, sans score** :
- Si (1=Oui) ET (2=5-30) ET (3=traction sans pilote) ET (4≠responsable dédié) → *"Votre situation correspond au moment où Cely intervient généralement. Un échange permettra de vérifier si on peut vous aider."* → CTA vers le formulaire de qualification (étape 1 du funnel réel).
- Si (3=produit en développement) → *"Votre produit semble encore en construction. Growth Part-Time n'est probablement pas la première étape — revenez quand la traction démarre."* → pas de CTA de vente forcé, lien vers le Manifeste ou l'Audit.
- Si (3=acquisition déjà structurée) ou (4=responsable dédié) → *"Vous avez déjà un pilotage growth en place. Un échange peut avoir du sens sur un sujet ponctuel, mais l'offre principale n'est pas forcément adaptée."*
- Sinon (cas mixtes) → message neutre invitant à l'échange, sans forcer une conclusion.

Mention obligatoire sous le résultat (§45) : *"Premier repère basé sur vos réponses. Pas un audit automatisé."*

**Capture (§46-47)** : après le résultat positif, formulaire réel (nom, email pro, entreprise) branché sur un vrai envoi (pas de faux "message envoyé" tant que le backend n'est pas câblé — état de chargement / succès / erreur réels). C'est aussi l'étape 1 du funnel officiel (formulaire de qualification, synthèse positionnement section 3).

---

## 6. Concept des animations

Un seul système, réutilisé partout — pas de librairie d'effets (§99) :

1. **Reveal typographique** au scroll (titres qui apparaissent, opacity+translateY léger, jamais de layout shift).
2. **Stacked cards** pour la section "Comment ça marche" (§62-63) — 4 cards, sticky raisonnable, jamais 3000px de scroll, fallback statique total si `prefers-reduced-motion`.
3. **Le Trait (signature A)** qui se dessine (stroke-dashoffset) quand la section problème/solution entre dans le viewport — remplace toutes les anciennes animations de diagramme.
4. **Hover image** sur les photos éditoriales (légère révélation/recadrage, jamais de changement de largeur — le bug de hitbox de l'ancien site, §27, n'est pas reproduit).
5. **Micro-flèches** sur les CTA (translation courte au hover).

Tout le reste (perf, reduced-motion, focus clavier) suit tel quel les règles §29-30 du brief.

---

## 7. Visuels nécessaires (à produire)

| Visuel | Usage | Priorité |
|---|---|---|
| Portrait de Célien en situation de travail (écran, notes) | Hero secondaire / Manifeste / CTA final | P0 |
| Photo d'un point d'équipe / visio avec un client (même simulée en interne si aucun client ne peut être filmé) | Section "Comment ça marche", étape Call | P0 |
| Photo d'un vrai document Cely annoté (plan d'action, page d'audit) | Signature B, section "Ce que vous aurez entre les mains" | P0 |
| Photo de carnet/notes manuscrites réelles | Section problème, Actualités | P1 |
| Photo de préparation d'une campagne outbound (écran LinkedIn/CRM réel, flouté si besoin de confidentialité) | Growth Part-Time | P1 |
| Portrait secondaire pour Nous rejoindre | Page Nous rejoindre | P2 |

Direction : documentaire, lumière naturelle, jamais de stock avec sourire forcé (§20, §105). Tant que ces photos ne sont pas prêtes, les emplacements resteront des placeholders discrets en développement — jamais publiés tels quels (leçon du nettoyage D0 déjà fait sur le site actuel).

---

## 8. Design system (base)

Conservé du brandbook (non renégociable) :
- Couleurs : off-white `#F7F5FA`, prune `#1A1128`, violet `#8B5BFF`, rose `#E88BF7`, lavande `#E9D7FF`.
- Typo : M PLUS Rounded 1c (titres), Manrope (corps), Space Grotesk (labels/annotations).
- Marque graphique : le "e" connecté (jamais isolé/recoloré), le slash "//".

Nouveau (spécifique à cette refonte) :
- Grille 12 colonnes, un seul axe gauche pour tout le contenu éditorial (§23).
- Tokens de motion : 1 easing, 2 durées (court/normal), pas plus.
- Un seul système de card (photo + annotation), pas de carte générique dupliquée pour chaque section.
- Tokens de traitement photo : ratio, léger désaturé au repos / couleur au hover, jamais de filtre décoratif supplémentaire.

---

## 9. Points commerciaux non validés (statut réel, §111)

| Élément | Statut | Ce qui sera affiché en attendant |
|---|---|---|
| Prix Growth Part-Time | **MANQUANT** (chiffrage en cours, synthèse positionnement §6/§8) | "Sur devis, minimum 5h/semaine" — aucun chiffre |
| Prix du call de découverte | **À CONFIRMER** (gratuit ou symbolique) | Pas de prix affiché tant que non tranché ; le call reste présenté comme point d'entrée, sans mot "gratuit" figé en dur |
| Conditions de la garantie 1er mois | **À CONFIRMER** (critère de déclenchement non objectif à ce jour) | Composant préparé, non publié tant que le critère n'est pas écrit noir sur blanc |
| Partenaires (Ads, outbound) | **MANQUANT** publiquement (partenaire Ads en place en interne, mais pas de logo/nom public confirmé) | Aucun logo, aucune mention nominative tant que non autorisée |
| Témoignages / avis clients | **MANQUANT** | Section "Ce que vous aurez entre les mains" à la place |
| Mission-preuve chiffrée | **MANQUANT** (aucune identifiée à ce jour, synthèse positionnement §8) | Aucun chiffre de résultat client publié |
| Photos réelles | **MANQUANT** (liste §7 ci-dessus) | Placeholders internes non publiés |
| Articles Actualités | **EN ATTENTE** (annoncé "d'ici 1-2 jours") | Message honnête déjà en place sur le site actuel |

---

## Validation demandée

Avant de lancer le développement (§109 : dans un environnement séparé, sans remplacer le site public actuel), je te demande de valider ou d'ajuster :

1. La direction "Carnet de bord" (signatures Le Trait / L'Annotation) — go/no-go.
2. La structure homepage ci-dessus (section 3) — l'ordre, les remplacements de preuve sociale.
3. Le copy du Hero (section 4) — H1/sous-ligne/CTA.
4. La logique du simulateur (section 5) — questions et messages de restitution.
5. La stack technique cible (Astro recommandé pour le SEO + Hostinger + contenu éditorial indexable, à confirmer avant Phase G) et le sujet CMS (WordPress headless vs autre) — je n'ai pas encore assez d'éléments sur tes contraintes d'hébergement réelles pour trancher seul.

Une fois ces points validés, je passe aux wireframes des pages secondaires (Phase E), puis au copywriting complet (Phase F) et au design system détaillé (Phase G) avant tout code.
