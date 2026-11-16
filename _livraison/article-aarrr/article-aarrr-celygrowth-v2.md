# PROMPT — Publication de l'article « Le framework AARRR » sur celygrowth.com

> Version 2 — intègre l'analyse de la SERP française, le plan de maillage complet et les consignes GEO.
> Copie-colle tout ce document dans le projet Claude qui gère le site.

---

## 1. Contexte et règles

Tu publies un nouvel article sur le blog (/actualites) de **celygrowth.com**, le site de Cely, l'activité de Growth Marketing à temps partagé de Célien Boillot (Saint-Ismier, près de Grenoble). Cible : dirigeants de startups et de PME B2B.

**Objectif : prendre la première position française sur « aarrr » et son cluster.** L'analyse de la SERP en section 8 montre que c'est jouable : les pages en tête ont une autorité faible et traitent toutes le sujet de la même façon.

**Règles absolues :**

1. **Ne réécris pas le texte** de la section 5. Il est rédigé dans la voix de Célien : vouvoiement, ton direct, expressions comme « A la la la… », « Et je vais vous dire… », « AARRRR !!!! ». Corrige une coquille, jamais le style.
2. **N'ajoute aucune statistique** absente du texte.
3. **Reprends exactement la charte des articles existants** (`/actualites/inbound-vs-outbound` et `/actualites/referencement-ia`) : bloc auteur en haut, bloc « À retenir », schémas en embed HTML, encadrés colorés, outil interactif avec capture d'email, FAQ en accordéon, CTA final, bloc auteur de fin. Va lire ces deux pages avant de commencer et aligne-toi sur leurs classes CSS et leurs composants existants plutôt que d'en créer de nouveaux.
4. **Un seul outil interactif** dans la page : le Diagnostic AARRR, en partie 5. La partie 1 ne contient qu'une accroche en ancre vers lui, pas un second formulaire.
5. **Vérifie chaque URL externe** avant publication (section 6). Si l'une ne répond plus, signale-le, n'invente pas de remplacement. Les liens 1 et 2 sont des présentations SlideShare : si SlideShare a changé d'URL, cherche la présentation « Startup Metrics for Pirates » de Dave McClure et utilise l'URL réelle, sans jamais en fabriquer une.
6. Toute décision non prévue ici : prends-la et signale-la dans ton compte rendu.

---

## 2. Paramétrage SEO et GEO

| Élément | Valeur |
|---|---|
| Mot-clé principal | aarrr (880 recherches/mois France, difficulté 15) |
| Variantes ciblées | framework aarrr, funnel aarrr, aarrr funnel, modèle aarrr, méthode aarrr, matrice aarrr, aarrr framework |
| Mots-clés secondaires | pirate metrics, dave mcclure, rarra, aaarrr, acquisition activation rétention revenu recommandation, growth marketing, growth hacking |
| Slug | `/actualites/framework-aarrr` |
| Meta title | Framework AARRR : définition, étapes et limites en B2B |
| Meta description | AARRR expliqué simplement : les 5 étapes, l'origine, ce que le modèle vaut vraiment et comment l'adapter au B2B. Avec un diagnostic gratuit. |
| Catégorie | Growth marketing B2B (même que l'article inbound vs outbound) |
| Auteur | Célien Boillot |
| Dates | Publication et mise à jour visibles en haut |

**Données structurées :** `Article` + `Person` (Célien Boillot, `sameAs` vers https://www.linkedin.com/in/celienboillotwenoble/) + `Organization` (Cely) + `BreadcrumbList` (Accueil › Actualités › Framework AARRR). **Pas de `FAQPage`** : ce balisage ne déclenche plus de résultat enrichi dans Google depuis mai 2026.

**Hiérarchie :** un seul H1. Les titres numérotés sont des H2, les sous-parties des H3. Dans le texte ci-dessous, `##` = H2 et `###` = H3.

### Consignes GEO (prioritaires sur cette requête)

La SERP affiche un **AI Overview en première position** (voir section 8). Une partie des clics se joue donc avant les résultats classiques, et être la source citée compte autant qu'être premier. Trois conséquences concrètes :

- **Le bloc « Réponse directe » doit être autonome et autosuffisant.** Lisible hors contexte, sans pronom qui renvoie à autre chose, avec la définition complète en trois phrases maximum. C'est le passage le plus susceptible d'être repris.
- **Chaque H2 commence par une réponse directe** d'une à deux phrases avant tout développement. Ne la noie pas sous une introduction.
- **Les définitions courtes sont posées en propre** : AARRR, pirate metrics, RARRA, AAARRR, chaque étape. Une phrase, sujet-verbe-complément, sans digression. C'est ce format que les moteurs génératifs extraient.

### Opportunités repérées sur la SERP

- **Un bloc Images apparaît en positions 2 et 12.** Les schémas doivent donc être indexables : exporte chaque embed en PNG en parallèle, nomme les fichiers `framework-aarrr-schema.png`, `entonnoir-aarrr-b2b.png`, etc., avec un texte alternatif descriptif, et place-les dans la page à côté des embeds HTML (l'embed reste la version lisible, l'image sert à l'indexation visuelle).
- **Un bloc Vidéo apparaît en position 6.** Si Célien tourne une vidéo courte sur AARRR, elle a une place à prendre. À signaler, pas à faire maintenant.

---

## 3. Les blocs visuels à coder

Reprends les composants existants du site. Tous les embeds : police héritée, une seule colonne sous 720 px, balises sémantiques, pas de librairie externe.

### 3.1 Post-it « culture générale »

Un encadré style note manuscrite ou papier collé, en rotation très légère (1 à 2°), fond jaune pâle. Court, deux lignes. C'est un élément de respiration, il doit trancher visuellement avec les encadrés « Conseil Cély » de l'article inbound vs outbound.

### 3.2 Schéma 1 — L'entonnoir AARRR

Cinq étages en dégradé, du plus large au plus étroit, dans l'esprit de l'entonnoir outbound de l'article inbound vs outbound. Pour chaque étage : la lettre, le nom de l'étape, la question à se poser, et un exemple d'indicateur sur le côté.

| Étape | Question | Exemple d'indicateur |
|---|---|---|
| **A**cquisition | Comment me découvrent-ils ? | Visiteurs, contacts entrants |
| **A**ctivation | Font-ils un premier pas ? | Demandes de devis, rendez-vous pris |
| **R**étention | Restent-ils ? | Clients encore actifs à 6 mois |
| **R**evenu | Combien rapportent-ils ? | Panier moyen, revenu par client |
| **R**ecommandation | Parlent-ils de moi ? | Clients venus par recommandation |

Légende : *Les cinq étapes du framework AARRR, aussi appelé « pirate metrics ».*

### 3.3 Schéma 2 — Le seau percé

Illustration simple en SVG : un seau rempli par le haut, avec une fuite au milieu et une flaque en dessous. Deux libellés seulement : « ce que vous versez en acquisition » et « ce que vous perdez juste après ». Pas de texte supplémentaire, c'est une image mentale, pas un tableau.

### 3.4 Schéma 3 — AARRR en B2C vs AARRR en B2B

Deux colonnes côte à côte, comme le comparatif inbound/outbound.

| Étape | En B2C / SaaS volume | En B2B cycle long |
|---|---|---|
| Acquisition | Trafic, taux de conversion | Nombre de comptes touchés, en volume brut |
| Activation | Inscription, premier usage | Premier rendez-vous qualifié |
| Rétention | Connexions mensuelles, churn | Renouvellement, élargissement de mission |
| Revenu | MRR, panier moyen | Valeur du contrat, revenu sur la durée de vie |
| Recommandation | Boucle virale, parrainage automatisé | Demande provoquée, process et timing |
| Rythme de lecture | Hebdomadaire | Trimestriel |

Légende : *Mêmes étapes, autres mécaniques, autres volumes.*

### 3.5 La FAQ en accordéon

Composant existant du site si possible. Sinon `<details>` / `<summary>` natifs. Chaque question reste un H3 dans le code, chaque réponse reste dans le HTML même repliée, une seule ouverte à la fois.

---

## 4. Le Diagnostic AARRR (outil interactif, partie 5)

C'est l'élément de conversion principal de l'article. Même logique que le simulateur de l'article inbound vs outbound, mais il produit un entonnoir chiffré au lieu d'un profil.

**Déroulé :**

1. **Cinq écrans, un par étape**, avec une barre de progression et un compteur « Étape 2 sur 5 ».
2. **Chaque écran pose une ou deux questions chiffrées** sur les 90 derniers jours, avec un champ numérique libre et, toujours, une case **« Je ne sais pas »**. Cette case est essentielle : elle compte dans le résultat.
3. **L'entonnoir se construit en direct** à droite (ou en dessous sur mobile) : à chaque réponse, un étage se remplit avec le chiffre saisi. C'est l'élément gamifié.
4. **Avant le résultat** : capture email + société, une case de consentement RGPD avec la finalité et le lien vers la politique de confidentialité.
5. **Résultat instantané**, sans attendre l'email.

**Les questions :**

| Écran | Question | Champ |
|---|---|---|
| 1. Acquisition | Sur les 90 derniers jours, combien de personnes ont découvert votre entreprise ? (visiteurs du site, contacts entrants, prospects touchés) | Nombre / Je ne sais pas |
| 2. Activation | Parmi elles, combien ont fait un premier pas concret ? (demande de devis, rendez-vous pris, inscription) | Nombre / Je ne sais pas |
| 3. Rétention | Sur vos clients signés il y a plus de six mois, combien sont encore actifs aujourd'hui ? | Nombre + total / Je ne sais pas |
| 4. Revenu | Quel est votre panier moyen par client sur la période ? | Montant / Je ne sais pas |
| 5. Recommandation | Combien de nouveaux clients sont venus par recommandation ? | Nombre / Je ne sais pas |

**Le résultat affiche :**

- **L'entonnoir rempli** avec les chiffres saisis et les taux de passage calculés entre chaque étage.
- **L'étape où la chute est la plus forte**, mise en avant visuellement : « Votre plus grosse fuite est à l'étape X ».
- **Deux ou trois actions concrètes** pour cette étape précise (textes à écrire avec Célien, un bloc par étape).
- **Un cas particulier prioritaire** : si l'utilisateur a coché « Je ne sais pas » sur trois étapes ou plus, le résultat principal devient « Votre premier chantier n'est pas l'acquisition, c'est la mesure », avant tout le reste.
- **Le CTA** de prise de rendez-vous.

**Côté Cely :** l'email, la société, les chiffres saisis et l'étape identifiée sont envoyés par notification à celygrowth@gmail.com, et poussés dans le CRM si l'intégration existe. Les chiffres réels du prospect sont le meilleur contexte de relance possible.

**Accessibilité :** navigable au clavier, `aria-live` sur le résultat, respect de `prefers-reduced-motion`, champs numériques avec le bon `inputmode`.

---

## 5. Le texte de l'article (à publier tel quel)

Liens externes : `[ancre](URL)`, nouvel onglet, `rel="noopener"`, dofollow. Liens internes : `[ancre](INTERNE : cible)`, à remplacer par l'URL réelle du site. **Si la page n'existe pas, supprime le lien, garde le texte, et signale-le.**

---

# Le framework AARRR, mais qu'est-ce que c'est ?

**[BLOC AUTEUR — même composant que les autres articles]**
Écrit par **Célien Boillot**, fondateur de Cely, growth marketing à temps partagé. Publié le [date] · Mis à jour le [date].

**[RÉPONSE DIRECTE — encadré]**

Le framework AARRR est un modèle de growth marketing qui découpe le parcours client en cinq étapes mesurables : Acquisition, Activation, Rétention, Revenu et Recommandation. Créé en 2007 par Dave McClure, il ne sert pas à faire joli dans un reporting : il sert à repérer à quelle étape précise vous perdez vos clients. Et donc à savoir où mettre votre énergie en premier.

**[À RETENIR — liste à puces]**

- **AARRR** signifie Acquisition, Activation, Rétention, Revenu, Recommandation. Cinq étapes du parcours client, surnommées « pirate metrics ».
- **Son intérêt :** il oblige à regarder ailleurs que l'acquisition, là où se situe le vrai problème dans la moitié des cas.
- **Sa limite :** c'est un outil de diagnostic, pas un plan d'action. Il montre où ça fuit, il ne dit pas quoi faire.
- **En B2B,** le modèle fonctionne, mais pas de la même façon qu'en B2C : l'utilisateur n'est pas l'acheteur, le cycle est long, et la recommandation se provoque au lieu de se propager.
- **Un diagnostic gratuit** en fin d'article vous indique à quelle étape vous perdez le plus de monde.

A la la la… Ce fameux framework AARRR, qu'on entend souvent, sur LinkedIn, sur les réseaux, comme le plan exact à suivre si on veut de la croissance digitale.

Est-ce vraiment un framework cohérent ? Explication et détail de ce framework.

**[POST-IT CULTURE GÉNÉRALE]**

> Il a été créé par Dave McClure, et surnommé « pirate metrics » parce que l'acronyme se prononce comme un cri de pirate.
>
> **AARRRR !!!!** Le cri de pirate pour une acquisition qui fonctionne parfaitement.

## 1. Qu'est-ce qu'exactement ce fameux framework ?

AARRR, ce sont cinq lettres pour cinq étapes du parcours de votre client. Le modèle vient d'une présentation de Dave McClure en 2007, [« Startup Metrics for Pirates »](https://www.slideshare.net/slideshow/startup-metrics-for-pirates-presentation/629833), restée célèbre depuis.

**Acquisition** — comment les gens vous découvrent. SEO, publicité, LinkedIn, bouche-à-oreille, salons. C'est l'étape sur laquelle tout le monde se concentre.

**Activation** — leur premier vrai moment de valeur. Ils ne font pas que passer : ils font quelque chose. Ils demandent un devis, réservent un appel, créent un compte, testent le produit.

**Rétention** — ils restent. Ils reviennent, ils renouvellent, ils ne partent pas chez le concurrent au bout de trois mois.

**Revenu** — ils paient. Et surtout : combien, et combien de fois.

**Recommandation** — ils parlent de vous et vous ramènent du monde.

**[SCHÉMA 1 — L'entonnoir AARRR]**

Et oui… L'idée est vraiment de penser à toutes les phases de l'acquisition, et s'il y en a une qui fuit, ça ne marche pas.

L'image est bête mais elle est juste : vous pouvez verser autant d'eau que vous voulez en haut du seau, si le seau est percé au milieu, vous payez pour remplir le sol.

**[SCHÉMA 2 — Le seau percé]**

Et je vais vous dire… C'est exactement cela que j'utilise pour mes clients. Car c'est vraiment le champ d'action d'un growth à part entière : avoir une vue d'ensemble et gérer toutes les métriques de l'acquisition. C'est d'ailleurs le cœur de [ce qu'on fait chez Cely](INTERNE : page Growth Part-Time).

Petite précision avant d'aller plus loin : vous croiserez des versions différentes. Parfois le Revenu passe avant la Recommandation, parfois on ajoute un A devant pour **Awareness**, la notoriété, ce qui donne AAARRR. McClure lui-même [a fait évoluer sa présentation au fil des années](https://www.slideshare.net/slideshow/startup-metrics-for-pirates-nov-2015-platzi/55484897). Ce n'est pas grave. L'ordre des lettres n'a jamais fait grandir personne. Ce qui compte, c'est de regarder les cinq.

> **Envie de savoir où ça fuit chez vous ?** Le diagnostic est en fin d'article : cinq questions, votre entonnoir chiffré, et l'étape qui vous coûte le plus cher aujourd'hui. [J'y vais direct](#diagnostic-aarrr).

## 2. Ce framework est-il vrai ?

Oui.

Vraiment. Et je préfère le dire tout de suite, parce que vous allez voir que j'ai des réserves juste après : **AARRR est un excellent outil de diagnostic.** Il fait quelque chose que peu de modèles font : il oblige à regarder ailleurs que le haut du tunnel.

Parce que la réalité, c'est que la plupart des dirigeants que je rencontre me parlent d'acquisition. « Il me faut plus de leads. » « Il faut qu'on fasse du SEO. » « On devrait lancer des ads. »

Et dans la moitié des cas, le problème n'est pas là. Les leads arrivent, mais personne ne les rappelle sous 48 heures. Ou les clients signent, mais partent au bout de six mois. Ou tout le monde est content, et personne ne pense à demander une recommandation.

AARRR vous force à poser les cinq questions au lieu d'une seule. Rien que pour ça, il mérite sa réputation. C'est aussi pour ça qu'il est devenu [l'un des piliers du growth marketing](https://www.salesforce.com/fr/blog/qu-est-ce-que-growth-marketing/), et l'un des premiers outils qu'on sort en [growth hacking](https://www.ecommercemag.fr/Thematique/marketing-1221/Breves/L-AARRR-l-outil-majeur-de-growth-hacking-371960.htm).

### Son vrai mérite : il tue les métriques de vanité

Le deuxième intérêt du modèle, c'est qu'il déplace l'attention. Les impressions LinkedIn, les vues, les visiteurs : ce sont des chiffres qui font plaisir et qui ne paient pas les salaires.

AARRR vous ramène à ce qui compte : **le taux de passage d'une étape à l'autre.** Combien de visiteurs deviennent des leads. Combien de leads deviennent des rendez-vous. Combien de rendez-vous deviennent des clients. Combien de clients restent.

C'est exactement la logique mathématique dont je parlais dans [l'article inbound vs outbound](INTERNE : article inbound vs outbound) : quand vous connaissez vos ratios, vous savez quoi faire le lundi matin.

## 3. Mais non, ce n'est pas un plan à suivre

Et c'est là que je vais être moins d'accord avec ce que vous lisez sur LinkedIn.

AARRR est présenté partout comme une méthode, un plan, une recette. Ce n'en est pas une. **Il vous dit où ça coince, il ne vous dit pas quoi faire.** Et entre les deux, il y a tout le métier.

### Trois limites qu'on vous cache rarement

**Le parcours n'est pas linéaire.** Dans la vraie vie, un client peut vous recommander avant même d'avoir acheté. Il peut disparaître six mois et revenir. Il peut lire trois articles, oublier, voir un post LinkedIn, et vous appeler un an plus tard. Les cinq étapes ne se suivent pas comme des cases. [Plusieurs praticiens le relèvent](https://decikit.com/fr/frameworks/aarrr) : le modèle est séquentiel, les clients ne le sont pas.

**Le modèle a été pensé pour des produits B2C et SaaS à fort volume.** McClure l'a imaginé pour des startups avec des milliers d'utilisateurs en self-service. Mesurer un taux d'activation sur 40 visiteurs par mois, statistiquement, ça ne veut rien dire. D'ailleurs, les [repères publiés sur les produits B2B](https://amplitude.com/benchmarks/technology-b2b-saas/startup) supposent un volume d'utilisateurs que la plupart des PME françaises n'auront jamais.

**Le risque du tableau de bord.** Cinq étapes multipliées par trois indicateurs, ça fait quinze chiffres. Personne ne pilote quoi que ce soit avec quinze chiffres. Un indicateur par étape suffit largement.

### Et la variante RARRA ?

Vous la croiserez tôt ou tard. [RARRA](https://clevertap.com/blog/aarrr-vs-rarra-framework-pirate-metrics/) reprend exactement les mêmes étapes, mais remet la Rétention en premier. L'idée, portée notamment par Thomas Petit et Gabor Papp : inutile d'acquérir à tout prix si vous ne gardez personne. C'est [particulièrement pertinent sur les modèles à revenus récurrents](https://www.conseilsmarketing.com/growth-hacking/le-modele-rarra-lalternative-au-aarrr-pour-les-business-modeles-recurrents/).

Mon avis : ce n'est pas un autre modèle, c'est le même avec une priorité différente. Et cette priorité est souvent la bonne.

## 4. Et en B2B, ça marche vraiment ?

Oui, mais pas de la même façon. Et c'est ma principale réserve quand je vois le modèle appliqué tel quel.

En B2B, trois choses changent la donne :

**L'utilisateur n'est pas l'acheteur.** Celui qui lit votre article n'est pas forcément celui qui signe. Souvent, il y a un comité : un opérationnel qui vous découvre, un responsable qui valide, un dirigeant qui paie.

**Le cycle est long.** Quand il faut six à neuf mois entre le premier contact et la signature, l'entonnoir mensuel ne raconte rien. Vous mesurez des gens entrés dans le tunnel il y a deux trimestres.

**Les volumes sont petits.** Dix clients par an, ce n'est pas une cohorte, c'est une liste. Les pourcentages n'ont aucun sens à cette échelle, et [l'analyse par cohortes](https://amplitude.com/explore/analytics/cohort-analysis), qui est l'outil normal pour mesurer une rétention, demande un volume que vous n'avez pas.

### La recommandation : ça marche, mais pas pareil

On lit souvent qu'en B2B la recommandation ne fonctionne pas. C'est faux, et c'est même souvent le meilleur canal.

Ce qui change, c'est le mécanisme. En B2C, la boucle est automatique et massive : un parrainage, un code promo, et l'utilisateur en ramène dix sans que vous leviez le petit doigt.

En B2B, vous pouvez tout à fait automatiser des choses. Une demande d'avis déclenchée après un jalon précis du projet, une relance programmée, un process de parrainage avec une contrepartie claire. Ça marche.

Mais c'est plus dur, pour une raison simple : vos clients sont moins nombreux, ils recommandent moins souvent, et surtout ils engagent leur réputation professionnelle en le faisant. Donc le volume ne sera jamais celui du B2C, et l'automatisation seule ne suffit pas. Il faut le bon timing et, souvent, le demander vous-même.

### Comment je l'adapte chez mes clients

Je ne jette pas le modèle, je le tords un peu.

**Je compte en chiffres bruts, pas en pourcentages.** « 2 000 visiteurs, 35 leads, 8 rendez-vous, 2 clients » sur les 90 derniers jours, c'est beaucoup plus parlant qu'une liste de taux. Et ça désigne immédiatement l'endroit où ça fuit.

**Je décale l'activation.** En B2B, l'activation ce n'est pas une inscription, c'est le premier rendez-vous qualifié. C'est le moment où la personne passe de curieuse à engagée.

**Je raccorde le milieu du tunnel au CRM.** Entre l'activation et le revenu, les étapes du CRM — lead, qualifié, opportunité, client — décrivent mieux la réalité d'une vente complexe que le modèle d'origine.

**Je traite la recommandation comme un canal à part entière.** Avec un process, un moment déclencheur, une demande explicite. Pas comme un bonus qui tomberait du ciel.

**Et je mesure sur des périodes longues.** Trimestre, pas semaine. Sinon vous allez réagir à du bruit.

**[SCHÉMA 3 — AARRR en B2C vs en B2B]**

Et si votre problème se situe tout en haut de l'entonnoir, la vraie question devient le choix des canaux : c'est ce que je détaille dans [l'article sur l'inbound et l'outbound](INTERNE : article inbound vs outbound). Si c'est la visibilité qui manque, [le référencement et la visibilité dans les IA](INTERNE : article référencement IA) sont le premier chantier.

## 5. Faites le test : où fuit votre acquisition ?

Plutôt que de vous laisser avec la théorie, autant le faire maintenant.

Cinq questions, une par étape, sur vos 90 derniers jours. Si vous n'avez pas le chiffre, cochez « je ne sais pas » : c'est une réponse en soi, et souvent la plus instructive.

**[DIAGNOSTIC AARRR — ancre `#diagnostic-aarrr`, voir section 4 du prompt]**

### Comment lire votre résultat

**Regardez l'écart, pas le chiffre.** Ce qui compte n'est pas l'étape au plus petit nombre, c'est celle où vous perdez le plus de monde d'une ligne à l'autre. C'est là qu'est l'argent.

**Travaillez une seule étape à la fois**, pendant un trimestre entier. Corriger l'activation et la rétention en même temps, c'est le meilleur moyen de ne savoir ce qui a marché ni pourquoi.

**Et si vous avez coché « je ne sais pas » trois fois ou plus :** votre premier chantier n'est pas l'acquisition, c'est la mesure. Tant que vous ne savez pas où vous perdez vos clients, tout budget supplémentaire est un pari.

Franchement, la plupart des entreprises découvrent à ce moment-là qu'elles dépensent en acquisition ce qu'elles perdent juste après. Si vous voulez qu'on regarde ça ensemble et en détail, c'est l'objet de [notre audit](INTERNE : page Audit).

## FAQ

### Que signifie AARRR ?

Acquisition, Activation, Rétention, Revenu, Recommandation : les cinq étapes du parcours client. On parle aussi de « pirate metrics », parce que l'acronyme se prononce comme un cri de pirate.

### Qui a créé le framework AARRR ?

Dave McClure, investisseur américain et fondateur de 500 Startups, en 2007, dans une présentation intitulée « Startup Metrics for Pirates ».

### AARRR ou AAARRR, quelle différence ?

La version à trois A ajoute l'Awareness, la notoriété, en amont de l'acquisition. Utile si vous travaillez votre marque, dispensable sinon.

### Qu'est-ce que le modèle RARRA ?

Une variante qui remet la Rétention en premier, popularisée par Thomas Petit et Gabor Papp. Mêmes étapes, autre ordre de priorité.

### Le framework AARRR fonctionne-t-il en B2B ?

Oui, mais pas de la même façon qu'en B2C. Il faut compter en volumes bruts plutôt qu'en pourcentages, décaler l'activation vers le premier rendez-vous qualifié, raccorder le milieu du tunnel au CRM et mesurer par trimestre.

### Quels outils faut-il pour piloter son AARRR ?

Au minimum un outil d'analytics pour le haut du tunnel, un CRM pour le milieu et de quoi suivre le revenu. Pas besoin d'une usine à gaz pour commencer : [une feuille suffit au départ](#diagnostic-aarrr).

### AARRR, c'est pareil que le tunnel de conversion ?

Pas tout à fait. Le tunnel de conversion s'arrête en général à l'achat. AARRR continue après : rétention, revenu dans la durée, recommandation. C'est ce qui en fait un modèle de croissance et pas seulement un modèle de vente.

### Par quelle étape commencer quand tout semble bloqué ?

Par celle où vous perdez le plus de monde d'une étape à la suivante, pas par celle au plus petit chiffre. Et si vous ne savez pas, commencez par mesurer : c'est le chantier le plus rentable des trois premiers mois.

## Conclusion : un bon miroir, un mauvais plan

Alors, ce framework AARRR, vrai ou survendu ?

Les deux. **C'est un excellent miroir, et un mauvais plan d'action.** Il vous montre où ça fuit, et c'est déjà énorme, parce que presque personne ne regarde ailleurs que l'acquisition. Mais il ne vous dira pas quoi faire ensuite, et en B2B il demande d'être retravaillé pour coller à votre réalité.

Donc utilisez-le pour ce qu'il est : un outil de diagnostic, une fois par trimestre, sur une feuille. Pas comme un plan de croissance.

Et si vous voulez qu'on regarde votre tunnel ensemble, [c'est par ici](INTERNE : page contact).

**[CTA FINAL — composant existant, premier échange offert]**

**[BLOC AUTEUR DE FIN]**
**Célien Boillot** — Fondateur de Cely, growth marketing à temps partagé pour startups et PME B2B, basé près de Grenoble. Il pilote l'acquisition de ses clients de l'intérieur, intégré à leur équipe. [Profil LinkedIn](https://www.linkedin.com/in/celienboillotwenoble/).

---

## 6. Le plan de maillage

### Liens externes (10 posés + 2 en réserve)

| # | Source | URL | Emplacement dans le texte |
|---|---|---|---|
| 1 | Dave McClure — « Startup Metrics for Pirates » (présentation d'origine) | https://www.slideshare.net/slideshow/startup-metrics-for-pirates-presentation/629833 | Partie 1, ouverture |
| 2 | Dave McClure — version actualisée de la présentation (2015) | https://www.slideshare.net/slideshow/startup-metrics-for-pirates-nov-2015-platzi/55484897 | Partie 1, AARRR ou AAARRR |
| 3 | Salesforce — growth marketing et framework AARRR | https://www.salesforce.com/fr/blog/qu-est-ce-que-growth-marketing/ | Partie 2, pilier du growth |
| 4 | E-commerce Mag — l'AARRR, outil majeur de growth hacking | https://www.ecommercemag.fr/Thematique/marketing-1221/Breves/L-AARRR-l-outil-majeur-de-growth-hacking-371960.htm | Partie 2, growth hacking |
| 5 | Decikit — fiche AARRR et ses limites | https://decikit.com/fr/frameworks/aarrr | Partie 3, parcours non linéaire |
| 6 | Amplitude — repères produits B2B SaaS | https://amplitude.com/benchmarks/technology-b2b-saas/startup | Partie 3, modèle pensé pour le volume |
| 7 | CleverTap — AARRR vs RARRA | https://clevertap.com/blog/aarrr-vs-rarra-framework-pirate-metrics/ | Partie 3, variante RARRA |
| 8 | Conseils Marketing — RARRA et modèles récurrents | https://www.conseilsmarketing.com/growth-hacking/le-modele-rarra-lalternative-au-aarrr-pour-les-business-modeles-recurrents/ | Partie 3, RARRA |
| 9 | Amplitude — guide de l'analyse par cohortes | https://amplitude.com/explore/analytics/cohort-analysis | Partie 4, volumes trop petits |
| 10 | Pipedrive — AARRR, définition et KPI | https://www.pipedrive.com/fr/blog/aarrr | En réserve, partie 1 |
| 11 | Dinmo — AARRR, framework growth | https://www.dinmo.com/marketing-strategy/data-driven-marketing/aarrr/ | En réserve, partie 1 |

**Règle importante :** plusieurs des meilleurs contenus français sur ce mot-clé sont publiés par des agences growth, donc des concurrents directs de Cely. **Ne pose aucun lien vers une agence.** Les sources retenues sont : la source primaire, des éditeurs d'outils, un média professionnel, un éditeur de CRM et des ressources neutres.

### Liens internes (12 emplacements)

| # | Page cible | Emplacement | Ancre |
|---|---|---|---|
| 1 | Growth Part-Time | Partie 1, après « champ d'action d'un growth » | ce qu'on fait chez Cely |
| 2 | Article inbound vs outbound | Partie 2, logique des ratios | l'article inbound vs outbound |
| 3 | Article inbound vs outbound | Partie 4, fin, choix des canaux | l'article sur l'inbound et l'outbound |
| 4 | Article référencement IA | Partie 4, fin, visibilité | le référencement et la visibilité dans les IA |
| 5 | Page Audit | Partie 5, après « comment lire votre résultat » | notre audit |
| 6 | Page contact | Conclusion | c'est par ici |
| 7 | Page contact | CTA du diagnostic | *(bouton)* |
| 8 | Page contact | CTA final | *(bouton)* |
| 9 | Catégorie Growth marketing B2B | Fil d'Ariane et étiquette de l'article | *(navigation)* |
| 10 | Bloc « articles liés » en bas de page | Vers inbound vs outbound et référencement IA | *(composant)* |
| 11 | **Depuis** l'article inbound vs outbound | À l'endroit où il est question de mesurer ses ratios | le framework AARRR |
| 12 | **Depuis** la page Growth Part-Time | Là où le métier de growth est décrit | le framework AARRR |

Les liens 11 et 12 sont les plus importants pour le référencement de ce nouvel article : ce sont les pages déjà installées qui lui transmettent de l'autorité. Ne les oublie pas, et ne pose qu'un seul lien par page source.

---

## 7. Checklist avant publication

**Contenu**
- [ ] Texte identique à la section 5, expressions orales comprises.
- [ ] Bloc auteur en haut, réponse directe juste après, « À retenir » ensuite.
- [ ] Aucun chiffre ajouté.
- [ ] Un seul formulaire dans la page (le diagnostic).

**Structure**
- [ ] Un seul H1, hiérarchie H2 › H3 sans saut de niveau.
- [ ] Ancre `#diagnostic-aarrr` fonctionnelle depuis la partie 1 et depuis la FAQ.

**SEO / GEO**
- [ ] Meta title, meta description, slug, canonical, Open Graph.
- [ ] JSON-LD Article + Person + Organization + BreadcrumbList. Pas de FAQPage.
- [ ] Mot-clé dans le H1, la réponse directe, plusieurs H2, la FAQ et la conclusion.
- [ ] Chaque H2 ouvre sur une réponse directe autonome.
- [ ] Schémas exportés aussi en PNG nommés et avec texte alternatif, pour le bloc Images de la SERP.
- [ ] Article rattaché à la catégorie Growth marketing B2B.

**Maillage**
- [ ] 10 liens externes posés, tous testés, en nouvel onglet avec `rel="noopener"`.
- [ ] Aucun lien vers une agence growth concurrente.
- [ ] 12 emplacements internes traités, dont les liens retour depuis l'article inbound vs outbound et la page Growth Part-Time.

**Technique**
- [ ] Schémas en embed HTML, texte présent dans le DOM.
- [ ] Rendu mobile vérifié, tableaux scrollables.
- [ ] Diagnostic fonctionnel : entonnoir qui se remplit, cases « je ne sais pas », capture email, résultat instantané, notification reçue.
- [ ] FAQ en accordéon, réponses dans le HTML même repliées.
- [ ] Page indexable et présente dans le sitemap.

**Compte rendu attendu**
URL publiée, liens internes non posés faute de page, liens externes hors service, et toute décision prise sans instruction.

---

## 8. Analyse de la SERP française (relevé du 7 octobre 2026)

Contexte pour comprendre les choix ci-dessus. À ne pas publier.

**Ce que renvoie Google sur « aarrr » en France :**

| Position | Résultat | Autorité de domaine | Clics estimés |
|---|---|---|---|
| 1 | **Aperçu IA (AI Overview)** | — | — |
| 2 | Bloc Images | — | — |
| 3 | sedomicilier.fr — guide AARRR | 38 | 430 |
| 4 | LinkedIn Learning — module vidéo | 99 | 49 |
| 5 | mise-en-valeur.fr | 16 | 21 |
| 6 | Bloc Vidéo | — | — |
| 7 | tracker.my.com (anglais) | 83 | 20 |
| 8 | scalizer.fr | 20 | 15 |
| 9 | ecommercemag.fr | 57 | 6 |
| 10 | synerweb.fr | 20 | 7 |
| 11 | salesforce.com/fr | 92 | 6 |
| 13 | petithack.com | 20 | 4 |
| 14 | conseilsmarketing.com — RARRA | 54 | 3 |
| 15 | beaboss.fr | 54 | 2 |

**Quatre conclusions.**

**La SERP est prenable.** En dehors de sedomicilier qui domine, les pages classées ont une autorité faible : 16, 20, 20, 20. Un article plus complet, mieux structuré et avec un vrai point de vue peut passer devant sans profil de liens important.

**Un seul concurrent compte vraiment.** sedomicilier.fr capte l'essentiel des clics avec un guide classique. C'est la page à battre, et elle est battable : c'est une fiche neutre, sans avis, sans adaptation au B2B, sans outil.

**L'Aperçu IA est en première position**, avant tous les résultats. D'où les consignes GEO de la section 2 : une partie du trafic se joue sur le fait d'être la source citée, pas seulement d'être premier.

**Deux blocs non textuels à exploiter :** un carrousel d'images en position 2, et une vidéo en position 6 (actuellement LinkedIn Learning). D'où les schémas exportés en PNG, et la piste d'une vidéo courte à tourner plus tard.

**Ce que fait la concurrence, et ce que personne ne fait.** Toutes les pages du top 15 font la même chose : définition, origine, les cinq étapes, les KPI par étape. Deux seulement évoquent les limites du modèle. **Aucune ne propose d'adaptation au B2B à faible volume, aucune ne prend position, aucune ne propose d'outil de diagnostic.** C'est exactement le triptyque de cet article : les parties 3, 4 et le diagnostic sont la raison d'être de la page. Si quelque chose doit être coupé, ce n'est jamais celles-là.
