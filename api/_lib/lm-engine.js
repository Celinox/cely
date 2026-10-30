/* Moteur de recommandation du Générateur de lead magnet (règles déterministes, V1).
   Partagé entre la page (/actualites/lead-magnet) et la fonction /api/generateur-lead-magnet. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CelyLeadMagnet = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var OPTIONS = {
    panier: { low: 'Moins de 1 000 €', mid: '1 000 à 10 000 €', high: 'Plus de 10 000 €' },
    temps: { heures: 'Quelques heures', jours: 'Quelques jours', semaines: 'Plusieurs semaines' },
    decideur: { one: 'Une seule personne', few: 'Deux ou trois', comite: 'Un comité' },
    essai: { rien: 'Rien encore', doc: 'Un document à télécharger', webinaire: 'Un webinaire', autre: 'Autre chose' },
    priorite: { volume: 'Du volume de contacts', qualif: 'Des contacts très qualifiés', credib: 'De la crédibilité' }
  };
  function clean(t, max) {
    return String(t || '').replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max || 160);
  }
  function lc(t) { return t ? t.charAt(0).toLowerCase() + t.slice(1) : t; }
  function noDot(t) { return t.replace(/[.!?…\s]+$/, ''); }

  var PROFILES = {
    checklist: { famille: 'Le document', format: 'Une checklist actionnable', kind: 'doc' },
    modele: { famille: 'Le document', format: 'Un modèle prêt à l\'emploi', kind: 'doc' },
    quiz: { famille: 'L\'outil', format: 'Un quiz de positionnement en 5 questions', kind: 'outil' },
    diagnostic: { famille: 'L\'outil', format: 'Un diagnostic avec résultat personnalisé', kind: 'outil' },
    calculateur: { famille: 'L\'outil', format: 'Un calculateur ou simulateur chiffré', kind: 'outil' },
    audit: { famille: 'L\'humain', format: 'Un audit offert de 30 minutes', kind: 'humain' },
    barometre: { famille: 'La donnée', format: 'Un baromètre construit à partir de vos réponses clients', kind: 'donnee' },
    atelier: { famille: 'L\'humain', format: 'Un atelier en petit comité, en visio', kind: 'humain' }
  };

  function pick(a) {
    var t = a.temps, p = a.panier, pr = a.priorite;
    if (t === 'heures') {
      if (pr === 'qualif' && p === 'high') return 'audit';
      return pr === 'volume' ? 'checklist' : 'modele';
    }
    if (t === 'jours') {
      if (pr === 'qualif' && p === 'high') return 'audit';
      if (pr === 'credib') return a.decideur === 'comite' ? 'modele' : 'atelier';
      if (pr === 'volume' && p === 'low') return 'quiz';
      return 'diagnostic';
    }
    if (pr === 'credib') return 'barometre';
    if (pr === 'volume') return p === 'low' ? 'quiz' : 'calculateur';
    return p === 'low' ? 'diagnostic' : 'calculateur';
  }

  function build(raw) {
    var a = {
      offre: clean(raw.offre, 160), cible: clean(raw.cible, 160), probleme: clean(raw.probleme, 300),
      panier: OPTIONS.panier[raw.panier] ? raw.panier : 'mid', temps: OPTIONS.temps[raw.temps] ? raw.temps : 'jours',
      decideur: OPTIONS.decideur[raw.decideur] ? raw.decideur : 'few', essai: OPTIONS.essai[raw.essai] ? raw.essai : 'rien',
      priorite: OPTIONS.priorite[raw.priorite] ? raw.priorite : 'qualif'
    };
    var key = pick(a), P = PROFILES[key];
    var pb = noDot(a.probleme) || 'votre problème principal', pbl = lc(pb);
    var cible = noDot(a.cible) || 'vos prospects', offre = noDot(a.offre) || 'votre offre';

    var why = 'Avec un panier de ' + lc(OPTIONS.panier[a.panier]) + ', ' + (a.decideur === 'one' ? 'une seule personne qui décide' : a.decideur === 'few' ? 'deux ou trois personnes dans la décision' : 'un comité de décision') +
      ' et ' + lc(OPTIONS.temps[a.temps]) + ' devant vous, le bon format pour vous est : ' + lc(P.format) + '. ';
    var because = {
      checklist: 'C\'est le format le plus rapide à produire qui reste utile, et il attire du volume : idéal quand le temps manque.',
      modele: 'Un modèle fait gagner du temps tout de suite à votre prospect, et il se produit en quelques heures sans sacrifier la qualité.',
      quiz: 'Un quiz court attire du volume, donne une réponse immédiate et vous dit déjà où en est chaque contact.',
      diagnostic: 'Un diagnostic donne un résultat personnalisé et vous rapporte ses réponses : vous savez exactement comment relancer.',
      calculateur: 'Un calculateur fait travailler votre prospect sur ses propres chiffres : c\'est le format qui qualifie le mieux, et le plus difficile à copier.',
      audit: 'Avec un tel panier et un objectif de qualification, un échange humain vaut plus que n\'importe quel document : chaque rendez-vous compte.',
      barometre: 'Pour gagner en crédibilité, rien ne remplace des données que vous êtes le seul à avoir. Plusieurs semaines permettent de les collecter proprement.',
      atelier: 'Un atelier en petit comité installe votre expertise sans demander des semaines de production, et chaque participant est un contact chaud.'
    }[key];
    if (a.decideur === 'comite' && P.kind !== 'doc') because += ' Comme un comité décide chez vos clients, ajoutez une version transmissible : un récapitulatif propre que votre contact fera circuler en interne.';

    var titles = {
      doc: ['La checklist pour en finir avec « ' + pbl + ' »', cible + ' : le modèle pour régler « ' + pbl + ' » en une semaine', '« ' + pb + ' » : les 10 points à vérifier avant d\'aller plus loin'],
      outil: ['« ' + pb + ' » : où en êtes-vous ? ' + ({ quiz: 'Le quiz', calculateur: 'Le calculateur' }[key] || 'Le diagnostic') + ' en 5 minutes', cible + ' : mesurez ce que « ' + pbl + ' » vous coûte vraiment', '5 questions pour savoir par où attaquer « ' + pbl + ' »'],
      humain: ['30 minutes pour débloquer « ' + pbl + ' »', cible + ' : un regard extérieur sur « ' + pbl + ' », offert', 'On regarde ensemble « ' + pbl + ' » et vous repartez avec un plan'],
      donnee: ['Baromètre : comment les ' + cible + ' gèrent « ' + pbl + ' »', '« ' + pb + ' » : ce que révèlent les réponses de vos pairs', 'Où vous situez-vous face à « ' + pbl + ' » ? Les chiffres du secteur']
    }[P.kind];
    if (key === 'checklist') titles[1] = cible + ' : la checklist en 10 points pour « ' + pbl + ' »';

    var contenu = {
      doc: { label: 'Le sommaire en 5 parties', items: ['Le constat : à quoi ressemble « ' + pbl + ' » quand on le vit', 'Les causes les plus fréquentes, en une page', 'La méthode pas à pas, avec les points de contrôle', 'Les erreurs à éviter, tirées de votre expérience terrain', 'Le passage à l\'action : ce que ' + lc(offre) + ' change concrètement'] },
      outil: { label: 'Les 5 questions à poser à vos prospects', items: ['Où en êtes-vous aujourd\'hui sur « ' + pbl + ' » ? (échelle de 1 à 5)', 'Quel volume ou quel chiffre clé mesure ce problème chez vous ?', 'Qu\'avez-vous déjà tenté, et qu\'est-ce que ça a donné ?', 'Qui d\'autre est concerné par la décision ?', 'Dans combien de temps voulez-vous que ce soit réglé ?'] },
      humain: { label: 'La trame du rendez-vous', items: ['5 min : la situation actuelle sur « ' + pbl + ' », racontée par votre prospect', '10 min : les chiffres et ce qui a déjà été tenté', '10 min : votre lecture, deux ou trois pistes concrètes', '3 min : ce qui se passe s\'il ne fait rien', '2 min : la prochaine étape, proposée clairement'] },
      donnee: { label: 'Le plan de l\'étude', items: ['Définir la question centrale autour de « ' + pbl + ' »', 'Écrire un questionnaire de 8 à 10 questions', 'Le diffuser auprès de ' + cible + ' et viser un échantillon exploitable', 'Analyser et sortir 5 enseignements clairs', 'Publier une version courte en accès libre et la version complète en échange du contact'] }
    }[P.kind];

    var page = [
      ['Le titre', 'La promesse du lead magnet, formulée comme un résultat : « ' + titles[0] + ' ».'],
      ['Le sous-titre', 'Pour qui c\'est (' + cible + ') et ce qu\'on obtient, en une phrase.'],
      ['Ce que vous allez obtenir', 'Trois puces concrètes, et un aperçu visuel du résultat.'],
      ['Pourquoi vous faire confiance', 'Qui l\'a conçu, et votre expérience sur « ' + pbl + ' ».'],
      ['Le formulaire', 'Email et société, pas plus. Finalité et lien vers votre politique de confidentialité.'],
      ['Ce qui se passe ensuite', 'Le résultat arrive tout de suite, et ce que vous ferez du contact.']
    ];
    if (P.kind === 'humain') page[4] = ['La prise de rendez-vous', 'Un agenda intégré et deux questions de qualification, pas plus.'];

    var sequence = [
      ['Le jour même', 'Objet : « Votre ' + (P.kind === 'humain' ? 'rendez-vous est confirmé' : 'résultat est prêt') + ' »', 'Livrer ce qui a été promis, sans rien vendre. Une seule question en fin d\'email pour ouvrir la conversation.'],
      ['J+3', 'Objet : « Ce que vos réponses disent de votre situation »', 'Une lecture personnalisée : une remarque précise tirée de ce que le contact a fourni.'],
      ['J+10', 'Objet : « On en parle 30 minutes ? »', 'Proposer un échange court, en rappelant ce qu\'il y gagnerait concrètement avec ' + lc(offre) + '.']
    ];

    var kpi = { volume: 'Le nombre de contacts qui correspondent à votre cible, chaque mois.', qualif: 'Le nombre de rendez-vous obtenus à partir du lead magnet.', credib: 'Le nombre de reprises et de partages par votre cible, et les rendez-vous qui en découlent.' }[a.priorite];
    var piege = {
      rien: 'Comme c\'est votre premier lead magnet, ne visez pas la perfection : lancez une version simple, mesurez un mois, puis améliorez.',
      doc: 'Vous avez déjà essayé un document : ne jugez pas celui-ci au nombre de téléchargements, mais aux conversations qu\'il ouvre.',
      webinaire: 'Vous avez déjà fait un webinaire : ne comptez pas les inscrits mais les présents, et relancez-les dans les 48 heures.',
      autre: 'Avant de comparer avec ce que vous avez déjà essayé, fixez le même indicateur pour les deux, sinon la comparaison ne veut rien dire.'
    }[a.essai];

    return { key: key, famille: P.famille, format: P.format, kind: P.kind, why: why + because, titles: titles, contenu: contenu, page: page, sequence: sequence, kpi: kpi, piege: piege, answers: a, labels: OPTIONS };
  }
  return { build: build, OPTIONS: OPTIONS, PROFILES: PROFILES };
}));
