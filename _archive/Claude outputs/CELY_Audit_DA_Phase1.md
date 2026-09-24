# CELY — Audit visuel & plan de refonte (Phase 1)
### Diagnostic, direction artistique et plan de refonte — avant exécution

*Préparé à partir de l'inspection réelle du site en production (celygrowth.com, desktop + mobile), du code source déployé, du brandbook `Cely_Brandbook_2026_FINAL.pdf`, et d'une lecture de la référence Bulldozer Collective. Aucune ligne de code du site n'a été modifiée pour produire ce document.*

---

## 0. Alerte — 4 problèmes à corriger indépendamment de la refonte

Avant même de parler direction artistique, l'inspection du site **en ligne, maintenant** a trouvé des textes de développement visibles par tout visiteur réel. Ce ne sont pas des choix esthétiques à discuter, ce sont des bugs de contenu :

| # | Où | Ce qui s'affiche | Règle violée |
|---|---|---|---|
| 1 | Homepage, section Offres | `À partir de [PRIX_MINIMUM_A_CONFIRMER] €/mois` | Placeholder brut visible en prod |
| 2 | Homepage, section "Un aperçu, pas une promesse" | `"[VERBATIM CLIENT À FOURNIR]"` + `[NOM, RÔLE — ENTREPRISE À FOURNIR]` | Placeholder brut visible en prod |
| 3 | Homepage, section preuve sociale | Bandeau "Déjà dans quelques équipes" avec logos **Nova, Kivo, Lumen, Arc, Tessa, North, Pulse** + mention "LOGOS DE DÉMONSTRATION — À REMPLACER PAR DE VRAIS CLIENTS AVANT PRODUCTION" | Fausse preuve sociale, interdiction absolue (§22/§24 du brief) |
| 4 | Homepage (section humaine), Manifeste, CTA final, Contact | `[PHOTO À PRODUIRE]` / `[Photo]` en clair dans des cadres pointillés | Placeholder visible (§12) |
| 5 | Actualités (hub + preview homepage) | 4 articles tagués "Démonstration" mais publiquement lisibles/cliquables | Contenu fictif affiché comme du contenu réel (§38/§45) |

Ces éléments existent depuis les sessions précédentes avec la mention explicite "à remplacer plus tard" — la nouvelle règle du brief interdit justement ce raisonnement. Je propose de traiter les points 1, 3 et 5 en urgence (retrait ou masquage), indépendamment du calendrier de refonte visuelle, parce qu'ils exposent le site à un risque de crédibilité immédiat. Les points 2 et 4 se résolvent naturellement par la nouvelle direction photo/preuve (partie 5) mais peuvent aussi être neutralisés dès maintenant en attendant les vrais assets.

**Décision à valider (D0)** : je corrige ces 5 points dès le début de la Phase 2, avant même le reste de la refonte visuelle — d'accord ?

---

## 1. Ce que l'inspection réelle a montré

Constat gabarit par gabarit (desktop 1280px + mobile 375px), en plus des captures :

- **Densité de systèmes graphiques** : j'ai compté **5 dispositifs graphiques distincts** rien que sur Homepage + Growth + Audit : (a) le "Cely Path" du Hero (trajectoire SVG), (b) le diagramme "control room" à 5 satellites de la section problème, (c) la boucle pointillée Comprendre/Prioriser/Exécuter/Mesurer/Ajuster sur Growth, (d) le cluster radial à 8 satellites (SEO/SEA/Site/...) sur Audit, (e) le slider de stades "Idée → 100+" de la section Moment. Le brief demande de redescendre à **2 signatures**. C'est le chantier le plus lourd de cette refonte.
- **Typographie mobile** : le H1 Hero occupe **3 lignes pleines** en 375px avec un poids visuel très lourd (`M PLUS Rounded 1c` en display géant) — correspond exactement au symptôme "titres qui prennent cinq lignes" du brief.
- **Aucune vraie photographie nulle part sur le site.** Zéro photo humaine réelle n'est actuellement chargée : chaque emplacement prévu pour une photo est un cadre en pointillés avec légende entre crochets.
- **Répétition du ciblage** : "5-30 personnes" apparaît en Hero (kicker), dans la section "C'est un moment, pas une taille" (bloc chiffré + slider), et est réexpliqué dans le brandbook lui-même. Trois formulations du même fait.
- **Incohérence Growth vs Homepage** : la page `/growth` affiche encore *"On ne démarre jamais sans audit préalable"* — phrase que le funnel de la Homepage a justement rendue obsolète il y a deux sessions (remplacée par l'appel de découverte). Ce sera à corriger pour rester cohérent avec la nouvelle logique commerciale en 3 étapes.
- **Ce qui fonctionne déjà bien et ne doit pas être détruit** : la page Audit (hiérarchie prix/timeline/livrable très lisible, peu de widgets), la page Manifeste (texte, rythme, une seule respiration photo), la page Nous rejoindre (claire, courte, honnête sur le fait que Cely n'est pas une agence avec 50 salariés), le système de boutons/annotations/slash de marque (cohérent partout), l'architecture de navigation (inchangée, toujours pertinente).
- **Comparaison Bulldozer** : leur crédibilité vient d'un mur de vrais logos clients avec mention "Success story" et de partenariats technologiques affichés (Anthropic, Google, Clay, LinkedIn, Meta) plutôt que d'effets visuels. Structurellement, leur Hero est sobre : un titre, un sous-titre de 2 lignes, un CTA primaire + un CTA secondaire, une seule preuve (logos), sans schéma. Cely ne peut pas répliquer le mur de logos (aucun client actuel), donc la partie 6 de ce document propose une stratégie de confiance alternative plutôt qu'une imitation.

---

## 2. Audit section par section — Homepage

Convention : **KEEP** (ne pas toucher) / **IMPROVE** (même rôle, traitement affiné) / **MERGE** (fusionner avec une autre section) / **REMOVE** (supprimer) / **ADD** (nouvelle section).

### 2.1 — Nav + Hero
- **Rôle actuel** : présenter la signature de marque et l'offre en un écran.
- **Problème constaté** : le Hero fonctionne bien sur le fond (titre clair, un seul CTA primaire visible), mais le "Cely Path" (trajectoire SVG) est un objet assez abstrait qui n'apporte pas d'information — c'est de la décoration élaborée, pas un visuel porteur de sens (règle §9). Sur mobile, le H1 prend 3 lignes pleines et écrase le sous-titre.
- **Ce qui fonctionne** : la formule "Le growth qui s'intègre", le kicker de ciblage immédiat, un CTA primaire + un lien secondaire vers l'Audit (clair, pas de choix cornélien).
- **Décision : IMPROVE.** Réduire le poids du H1 (voir nouvelle échelle typo, partie 4), et remplacer le Cely Path par l'option **B de la partie 30 du brief** : une recomposition du tracé en un geste unique, plus monumental et plus sobre (une seule ligne continue, un seul point d'impact), pas une photo en Hero — le Hero doit rester la signature graphique la plus "structure" du site, la photo humaine arrive juste après (section 2.3). Le contraste entre les deux fait justement le concept "structure / humain" du brief.

### 2.2 — Preuve sociale ("Déjà dans quelques équipes")
- **Rôle actuel** : rassurer immédiatement après le Hero.
- **Problème constaté** : logos fictifs affichés en clair (voir alerte §0).
- **Décision : REMOVE**, purement et simplement — pas de remplacement par d'autres logos. Voir partie 6 pour ce qui vient à la place (rien, ou une phrase de transition courte vers la section suivante — à trancher en exécution selon ce que donne la composition).

### 2.3 — "Le vrai problème" (control room)
- **Rôle actuel** : nommer la douleur (canaux non pilotés).
- **Problème constaté** : diagramme à 5 satellites — exactement le pattern "widget" que le brief cible. L'information (5 symptômes) est juste, la forme est scolaire.
- **Ce qui fonctionne** : la punchline "On s'intègre avant de piloter", le fond sombre qui crée une rupture de rythme avec le reste de la page (bon principe éditorial à garder).
- **Décision : IMPROVE.** Garder la rupture visuelle (fond prune), remplacer le diagramme par la Signature A ("Chemin Cely" — lignes/trajectoires) réutilisée ici dans sa forme la plus simple : une ligne qui part de 4-5 points dispersés (canaux non coordonnés) vers un point unique. C'est la même signature que le Hero, pas un nouveau système — exactement l'esprit de la règle §8.

### 2.4 — "Du growth. Mais surtout quelqu'un dans la boucle." (section humaine)
- **Rôle actuel** : montrer l'intégration réelle à l'équipe cliente.
- **Problème constaté** : c'est la section la plus stratégique du site pour incarner "l'humain", et c'est actuellement un cadre en pointillés avec la légende `[PHOTO À PRODUIRE]`.
- **Décision : IMPROVE — priorité maximale.** C'est l'endroit numéro 1 pour la vraie photographie (voir Shot List, photo 01). Tant que la photo n'existe pas, composition alternative : agrandir la citation "Cely rejoint votre équipe, pas un rapport de plus" en typographie éditoriale forte sur fond texturé (papier/carnet), avec les 4 annotations actuelles ("Point équipe", "Direct avec les sales", "Tests chaque semaine", "Priorités partagées") conservées mais réduites en système d'annotation (Signature B), posées sur la composition typographique plutôt que sur un cadre vide.

### 2.5 — Boucle Comprendre / Prioriser / Exécuter / Mesurer / Ajuster
- **Problème constaté** : le process est déjà couvert par 2.4 (intégration hebdo) et par la section Offres (parcours en 3 étapes). Trois explications du même mécanisme sur une seule page.
- **Décision : MERGE.** Réduire à une ligne de 5 mots-clés sans animation de boucle dédiée, positionnée en sous-ligne de la section 2.4 plutôt qu'en bloc autonome (règle §33 : "elle doit rester secondaire").

### 2.6 — "En 30 jours" (engagement de mise en place)
- **Rôle actuel** : rendre concret l'engagement à 30 jours.
- **Problème constaté** : aucun sur le fond (le texte est juste et le disclaimer anti-surpromesse est bon) ; en revanche le composant `.ms-track` réutilisé ici est identique à celui de la section Moment plus bas → répétition visuelle.
- **Décision : IMPROVE.** Garder le contenu, changer le traitement visuel pour ne pas dupliquer la section Moment (par exemple trois repères horizontaux sur une ligne de temps plutôt que 3 colonnes empilées).

### 2.7 — Offres (funnel 3 étapes)
- **Rôle actuel** : présenter le parcours de démarrage et hiérarchiser Growth / Audit.
- **Problème constaté** : le fond fonctionne bien (le brief §34 dit explicitement de ne pas la reconstruire) ; seul le prix `[PRIX_MINIMUM_A_CONFIRMER]` casse la crédibilité.
- **Décision : KEEP la structure, IMPROVE le contenu** (prix réel dès qu'il est fourni) + ajouter une petite photo ou texture documentaire à côté du bloc Growth Part-Time (règle §34 : "photographie ou visuel humain côté Growth").

### 2.8 — "C'est un moment, pas une taille" (slider de stades)
- **Rôle actuel** : qualifier la cible par un signal business plutôt qu'une taille figée.
- **Problème constaté** : répète une information déjà donnée deux fois (Hero kicker + section humaine mentionne l'équipe). Le slider (Idée/1-5/5-30/30-100/100+) est un widget de plus, et la case noire "ZONE CELY" vide n'apporte rien de concret.
- **Décision : MERGE / réduire fortement.** Fusionner le message clé ("c'est un moment, pas une taille") dans le Hero ou la section 2.3, sous forme d'une phrase, pas d'un nouveau dispositif. Si le contenu justifie de garder une section séparée, la réduire à une seule ligne de progression simple (pas de case vide "ZONE CELY").

### 2.9 — "Un aperçu, pas une promesse" (preuve du travail)
- **Rôle actuel** : rendre tangible le livrable Audit.
- **Problème constaté** : le mockup "feuille de route" (barres grises génériques) est une bonne idée honnête de représentation du format, mais le témoignage `[VERBATIM CLIENT À FOURNIR]` est un placeholder visible.
- **Décision : IMPROVE.** Garder et enrichir le mockup de document (le pousser vers une vraie maquette éditoriale du livrable — voir Shot List, visuel 03), retirer complètement le bloc verbatim tant qu'aucune vraie citation n'existe (pas de remplacement par une fausse citation, juste une absence assumée ou reformulée en "ce que contient un Audit" sans attribution).

### 2.10 — Manifeste (extrait) + CTA final + Actualités preview + Footer
- **Manifeste (extrait)** : KEEP, fonctionne comme respiration de fin de page.
- **CTA final** : IMPROVE uniquement sur le point `[Photo]` de Célien (remplacer par une vraie photo dès qu'elle existe, sinon retirer le cadre plutôt que le laisser en placeholder visible).
- **Actualités preview** : IMPROVE — retirer les articles tagués "Démonstration" de l'affichage public (les garder dans le code comme structure, publier uniquement de vrais articles quand ils existent), quitte à afficher un état "Bientôt" honnête à la place.
- **Footer** : KEEP, ne pose aucun problème identifié.

---

## 3. Plan de cohérence — autres pages

### 3.1 — Growth Part-Time (priorité commerciale n°1)
- Ordre logique globalement déjà respecté (service → cible → intégration → quotidien → démarrage → prix → contact).
- **À corriger en priorité** : la phrase "On ne démarre jamais sans audit préalable" contredit le nouveau funnel homepage (découverte → diagnostic → plan). À reformuler pour rester cohérent, sans pour autant promettre un chemin plus engageant que la réalité (le point reste à vérifier avec toi : est-ce qu'un diagnostic reste réellement un prérequis systématique, ou seulement recommandé ?).
- **IMPROVE** : la boucle pointillée (signature graphique n°3 en trop) → remplacer par une vraie photo de travail (Shot List, photo 02) entourée de 3-4 annotations (Signature B), conformément à la règle §43.
- **KEEP** : le bloc "5h minimum/semaine", la mise en page prix, la répartition "Quatre familles de travail" (le système de pills est dense mais lisible — à alléger dans le traitement visuel plutôt qu'à restructurer, cf. §54 alternance photo/typo/document/espace).

### 3.2 — Audit Digital
- C'est la page la plus proche du niveau visé par le brief : peu de widgets, hiérarchie de prix très lisible, timeline claire, mockup de document honnête.
- **IMPROVE uniquement** : remplacer le cluster radial à 8 satellites (signature graphique n°4 en trop) par la Signature A (chemin Cely) ou par une vraie image du sommaire de l'Audit (Shot List, visuel 03) ; enrichir le mockup de feuille de route pour qu'il ressemble davantage à un vrai document (page de couverture stylisée, pas juste des barres grises).

### 3.3 — Actualités (hub) + template Article
- Hiérarchie éditoriale (une à la une + liste + catégories) déjà en place et pertinente.
- **Problème** : les 4 articles sont fictifs et publiquement visibles.
- **Décision** : soit publier uniquement de vrais articles au lancement (page peut être plus courte, honnêteté d'abord), soit garder la page accessible mais sans contenu tant qu'aucun article réel n'est prêt (état "Bientôt, on prépare nos premières notes de terrain"), à trancher avec toi (D3 plus bas).
- Template Article : rien de visuellement excessif n'a été trouvé (pas d'animation complexe, largeur de lecture correcte) — **KEEP**, à condition que les visuels d'accompagnement (une fois de vrais articles publiés) suivent la même direction photo que le reste du site.

### 3.4 — Manifeste
- Déjà proche de la cible : texte, rythme, une image en pointillés.
- **IMPROVE uniquement** : remplacer le cadre `[Photo à produire]` par une vraie photo (Shot List, photo 04) ou, à défaut, une composition typographique pleine page plutôt qu'un cadre vide.

### 3.5 — Nous rejoindre
- Déjà clair sur le fait que Cely n'est pas une grosse équipe salariée (texte honnête : "Cely ne fait pas tout en interne").
- **IMPROVE léger** : ajouter une photo de travail (bureau réel, détail de collaboration) plutôt qu'aucune image du tout — mais uniquement si un vrai asset existe, sinon **KEEP tel quel**, la page fonctionne déjà très bien à l'écrit seul.

### 3.6 — Contact
- Simple, un formulaire, un `[Photo]` de Célien à remplacer dès qu'une vraie photo existe. Sinon retirer le cadre plutôt que le garder en placeholder (§12, §49).
- **KEEP** la structure, **IMPROVE** uniquement ce point photo.

---

## 4. Direction artistique affinée

### Concept : "La structure rencontre l'humain"
Le principe reste celui du brief : la grille, les lignes et la typographie représentent le pilotage ; la photographie, les documents et les annotations représentent l'intégration réelle à l'équipe. Concrètement, cela se traduit par une règle simple à appliquer partout : **chaque section qui parle de méthode/pilotage garde un traitement graphique (Signature A) ; chaque section qui parle de relation/quotidien passe en photo ou document annoté (Signature B).** Aucune section ne doit mélanger un widget schématique ET une intention humaine — c'est ce mélange qui produit l'effet "trop scolaire" identifié dans le brief.

### Les deux signatures (règle §8), définies précisément
- **Signature A — Le Chemin Cely** : une ligne continue, un point de départ dispersé, un point d'arrivée unique (le hub Cely). Utilisée uniquement pour : Hero, section "Le vrai problème", et ponctuellement pour illustrer un chemin d'offre (Audit → Growth). Jamais plus d'une instance par page.
- **Signature B — L'annotation éditoriale** : petites étiquettes flottantes à bord arrondi, flèche fine, texte Space Grotesk 12-13px — déjà présentes dans le composant `.annot` du design system actuel. Elles se posent sur les photos et documents, jamais sur un fond vide.

### Nouvelle échelle typographique (réponse à §16-17)
| Niveau | Usage | Traitement |
|---|---|---|
| Display | Hero uniquement, 1 fois par site au maximum par page | Poids conservé, mais largeur de colonne desktop élargie pour tenir sur 2 lignes maximum |
| H1 | Titre de page | Réduit d'environ 15-20% par rapport à l'actuel — fort mais plus assis |
| H2 | Titre de section, cohérent partout | Taille unique actuelle globalement correcte, seul le Hero et Display doivent s'en distinguer davantage (l'écart actuel H1/H2 est jugé too flat par endroits, à corriger cas par cas plutôt qu'uniformément — règle §17 : "ne réduis pas tous les titres uniformément") |
| H3 | Sous-section | Inchangé |
| Lead | Chapô éditorial | Inchangé |
| Body | Lecture | Inchangé |
| Label | Nav/catégories | Inchangé (Space Grotesk, fonctionne déjà bien) |
| Annotation | Détail de marque | Inchangé (composant `.annot` déjà correct) |

### Ce qui ne change pas (rappel)
Logo, "e" connecté, point violet, palette (#F7F5FA / #1A1128 / #8B5BFF / #E88BF7 / #E9D7FF), typographies (M PLUS Rounded 1c / Manrope / Space Grotesk), positionnement, navigation principale.

---

## 5. Direction photographique & shot list (8 photos)

Direction : documentaire startup, lumière naturelle, scènes de travail réelles — jamais posées façon banque d'images corporate. Le brandbook lui-même illustre cette direction avec des photos de démonstration (couple souriant autour d'un ordinateur, page 25/28) : ce sont des références de style, pas des photos Cely réelles, et elles ne doivent jamais être utilisées telles quelles sur le site final sous peine de laisser croire à une fausse collaboration client.

| # | Scène | Cadrage | Lumière | Emplacement | Desktop/Mobile | Rôle |
|---|---|---|---|---|---|---|
| 01 | Célien en réunion de travail avec une équipe (3-5 personnes), écran ou carnet visible | Plan large documentaire, pas posé | Naturelle | Homepage — section "Du growth, mais surtout quelqu'un dans la boucle" | Les deux, recadrage vertical mobile | Prouver l'intégration réelle à l'équipe — **priorité P0** |
| 02 | Point d'équipe hebdo, écran partagé ou tableau avec priorités notées à la main | Plan rapproché sur les mains/le support, visages en second plan | Naturelle | Page Growth — section visuel signature | Les deux | Rendre concret "ce que ça change dans votre semaine" — **P0** |
| 03 | Détail d'un document Audit ouvert (couverture ou sommaire), sur bureau réel | Plan serré, angle légèrement plongeant | Naturelle, contraste doux | Page Audit — section "Le livrable" + preview homepage | Les deux | Rendre l'offre Audit tangible — **P0** |
| 04 | Portrait environnemental de Célien, bureau réel, ordinateur ou carnet | Mi-corps, regard naturel (pas regard caméra forcé) | Naturelle | Manifeste + Contact (CTA final) | Les deux | Humaniser la marque, remplacer les `[Photo]` — **P0** |
| 05 | Main annotant un carnet ou une feuille de route (post-it, flèches) | Très serré, détail | Naturelle, chaleureuse | Section "En 30 jours" ou Offres | Desktop principalement | Ancrer le concept "structure + humain" — **P1** |
| 06 | Échange informel avec un commercial/partenaire (2 personnes, table basse ou bureau) | Plan moyen | Naturelle | Growth — section "Direct avec les sales" | Les deux | Illustrer la coordination avec les partenaires — **P1** |
| 07 | Détail d'écran d'ordinateur (dashboard réel ou campagne en cours, flouté si besoin de confidentialité) | Très serré, angle 3/4 | Neutre/écran | Growth ou Audit, section méthode | Desktop uniquement | Rendre le travail concret sans faux dashboard fictif — **P1** |
| 08 | Préparation d'une campagne : plusieurs documents/écrans étalés sur un bureau | Plan large, vue de dessus | Naturelle | Homepage — alternative si 01 indisponible, ou page Growth | Les deux | Densité visuelle "matière" sans widget — **P2** |

**Priorisation** : P0 (photos 01-04) sont les seules indispensables pour lever tous les placeholders actuellement visibles en production. P1 (05-07) enrichissent Growth. P2 (08) est un bonus de rythme visuel, à ne produire que si le budget shooting le permet — le brief est explicite : "cinq très bons assets plutôt que vingt génériques."

---

## 6. Stratégie de confiance alternative (sans client réel)

Puisque toute preuve sociale doit être retirée (§0, §2.2), la crédibilité vient d'ailleurs :
- **Présence humaine réelle du fondateur** (photos 01, 04) — déjà le plus fort levier disponible.
- **Transparence sur le fonctionnement** : le funnel en 3 étapes, le prix de l'Audit à 1 250 €, le minimum de 5h/semaine — tout est déjà écrit noir sur blanc, c'est un vrai actif de confiance à mettre en avant visuellement plutôt qu'à cacher dans du texte courant.
- **Le livrable Audit rendu tangible** (photo 03 + mockup enrichi) : montrer le format plutôt que promettre un résultat.
- **Honnêteté sur les limites** : la ligne "Un aperçu, pas une promesse" et le disclaimer "pas une promesse de résultat business" sont déjà dans cet esprit — à garder texte identique, juste mieux mis en scène visuellement.
- **Qualité éditoriale d'Actualités**, une fois de vrais articles publiés (pas de date fixée ici, dépend de ta capacité de production).

---

## 7. Inventaire des assets (vue d'ensemble)

| Page | Section | Type de visuel | Message transmis | Asset existant ? | À produire ? | Priorité | Mobile | Alternative sans asset |
|---|---|---|---|---|---|---|---|---|
| Home | Hero | D — dispositif graphique Cely | Structure/pilotage | Oui (à simplifier) | Non | P1 | Recomposé, plus compact | — |
| Home | Preuve sociale | — | — | — | — | P0 | — | **Section supprimée** |
| Home | Le vrai problème | D — dispositif graphique Cely (signature A) | Absence de pilotage | Partiel (à remplacer) | Non | P1 | Version simplifiée | — |
| Home | Section humaine | A — photographie | Intégration réelle à l'équipe | Non | **Oui (photo 01)** | **P0** | Recadrage vertical | Composition typographique + annotations |
| Home | En 30 jours | C — composition typo | Engagement mise en place | Oui (texte) | Non | P2 | Ligne de temps compacte | — |
| Home | Offres | E — photo/texture légère | Growth = humain, Audit = document | Non | Photo 02 ou 08 (partagée) | P1 | Optionnel | Texte seul si non prêt |
| Home | Moment | F — aucun visuel (fusionné) | Ciblage | — | Non | P1 | — | — |
| Home | Preuve du travail | B — vrai document | Tangibilité de l'Audit | Partiel (mockup) | **Oui (photo 03)** | **P0** | Recadré | Mockup enrichi seul |
| Home | CTA final | A — photographie | Humaniser le contact | Non | **Oui (photo 04)** | **P0** | Cercle recadré | Retirer le cadre |
| Home | Actualités preview | — | Expertise éditoriale | Non (fictif) | Dépend des vrais articles | P0 (masquage) | — | État "Bientôt" |
| Growth | Hero | A ou E | Intégration à l'équipe | Non (avatar initiales) | Photo 01 ou 02 (partagée) | P1 | Recadré | Avatar actuel (déjà honnête) |
| Growth | Visuel signature | E — photo + annotations | Quotidien réel | Non | **Oui (photo 02)** | **P0** | Recadré | — |
| Growth | Coordination sales | A — photographie | Coordination partenaires | Non | Photo 06 | P1 | Optionnel | Texte seul |
| Audit | Hero/diagramme canaux | D → à remplacer | Périmètre de l'audit | Oui (à remplacer) | Non | P1 | Simplifié | — |
| Audit | Le livrable | B — document | Tangibilité | Partiel (mockup) | **Oui (photo 03, partagée)** | **P0** | Recadré | Mockup enrichi seul |
| Manifeste | Respiration | A — photographie | Conviction incarnée | Non | Photo 04 (partagée) | P1 | Recadré | Composition typo seule |
| Nous rejoindre | Illustration collaboration | A — photographie | Collaboration experts | Non | Photo 06 (partagée) | P2 | Optionnel | Texte seul (déjà suffisant) |
| Contact | Portrait fondateur | A — photographie | Faciliter l'échange | Non | **Oui (photo 04, partagée)** | **P0** | Recadré | Retirer le cadre |

---

## 8. Décisions à valider avant exécution

- **D0** — Corriger en priorité absolue, avant le reste de la refonte : retirer le bandeau de faux logos, masquer les articles "Démonstration" du rendu public, et neutraliser les deux placeholders texte (`[PRIX_MINIMUM_A_CONFIRMER]` et le verbatim client) — soit en les retirant, soit en attendant que tu fournisses le vrai prix plancher pour Growth Part-Time. **As-tu ce montant maintenant, ou dois-je masquer la ligne de prix en attendant ?**
- **D1** — Validation de la réduction à 2 signatures graphiques (partie 4) : je remplace le diagramme "control room", la boucle pointillée Growth et le cluster radial Audit par des variantes de la Signature A (chemin Cely), quitte à ce qu'elles soient très simplifiées. D'accord pour ce principe ?
- **D2** — Validation du Hero : je pars sur l'option B de la partie 30 du brief (trajectoire recomposée en un geste plus monumental et plus sobre), pas sur une photo en Hero. La photo humaine arrive juste après (section 2.4). D'accord ?
- **D3** — Actualités : préfères-tu (a) publier la page avec un état "Bientôt" tant qu'aucun article réel n'existe, ou (b) garder les 4 articles actuels mais les dépublier du menu principal et du preview homepage en les gardant accessibles seulement par lien direct pour test interne ? Le brief penche pour (a).
- **D4** — Photos : peux-tu confirmer un budget/planning de shooting pour les 4 photos P0 (liste partie 5) ? Sans elles, je peux livrer une version "compositions éditoriales alternatives" en attendant, mais la section humaine (2.4) restera moins forte que ce que le brief demande.
- **D5** — Growth Part-Time : la phrase "On ne démarre jamais sans audit préalable" doit-elle rester vraie (un audit est un prérequis systématique) ou seulement recommandée (le call de découverte peut suffire à démarrer directement en Growth) ? La réponse change la formulation exacte.
- **D6** — Prix Growth Part-Time : toujours en attente du montant plancher réel pour remplacer `[PRIX_MINIMUM_A_CONFIRMER]` (déjà demandé en session précédente).

---

## 9. Ordre d'exécution proposé (une fois validé)

1. Corrections d'urgence (D0) — indépendant du reste, livrable en premier.
2. Design system (nouvelle échelle typo, tokens de grille, réduction des signatures graphiques).
3. Homepage.
4. Growth Part-Time.
5. Audit.
6. Actualités + template Article.
7. Manifeste.
8. Nous rejoindre.
9. Contact.
10. Responsive complet (repasse dédiée, pas un empilement de colonnes).
11. QA finale (liens, CTA, formulaires, mobile, animations, SEO, perf, et la checklist anti-triche : zéro "100%", zéro logo inventé, zéro placeholder visible).

Je n'écris aucun code tant que ce plan n'est pas validé, conformément à ta demande.
