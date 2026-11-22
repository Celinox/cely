/**
 * Lecture des contenus du CMS de Cely Growth (le CRM fait foi), côté serveur uniquement.
 * Contrat : docs/cms-contrat-site.md du dépôt cely-crm. Aucune dépendance npm.
 *
 * Variables d'environnement Vercel (noms seulement) :
 *   CELY_CMS_API_URL            https://cely-crm.vercel.app/api/site/cms/v1
 *   CELY_CMS_API_KEY            clé de lecture (jamais exposée au navigateur)
 *   CELY_CMS_REVALIDATE_SECRET  secret de l'appel de rafraîchissement envoyé par le CRM
 */
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.celygrowth.com';
const BLOG = '/actualites';
const DEFAULT_IMG = SITE + '/images/cely-mark-ce.png';
const ORG_ID = SITE + '/#organisation';
const PERSON_ID = SITE + '/#celien-boillot';

// Cache du CDN Vercel : une minute, puis contenu frais (un article dépublié disparaît en une minute au plus).
const CDN_CACHE = 'public, max-age=0, s-maxage=60, stale-while-revalidate=60';
const NO_CACHE = 'private, no-store';

function config() {
  const url = (process.env.CELY_CMS_API_URL || '').trim().replace(/\/+$/, '');
  const key = (process.env.CELY_CMS_API_KEY || '').trim();
  return url && key ? { url, key } : null;
}

/** Appel GET au CMS. Renvoie { status, body } ; status 0 si le CMS est injoignable ou non configuré. */
async function cmsGet(p) {
  const c = config();
  if (!c) return { status: 0, body: null };
  try {
    const res = await fetch(c.url + p, {
      headers: { Authorization: 'Bearer ' + c.key, Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    const body = await res.json().catch(() => null);
    return { status: res.status, body };
  } catch (e) {
    return { status: 0, body: null };
  }
}

/** Gabarit HTML généré par scripts/build.py (api/_cms/*.html), embarqué avec la fonction. */
const cache = {};
function template(name) {
  if (cache[name]) return cache[name];
  const candidates = [path.join(__dirname, '..', '_cms', name), path.join(__dirname, '_cms', name), path.join(process.cwd(), 'api', '_cms', name)];
  for (const f of candidates) {
    try { return (cache[name] = fs.readFileSync(f, 'utf8')); } catch (e) { /* suivant */ }
  }
  throw new Error('Gabarit introuvable : ' + name);
}

const esc = (v) => String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const safeUrl = (u) => (typeof u === 'string' && /^https?:\/\/[^\s"'<>]+$/i.test(u) ? u : null);
const isSlug = (s) => typeof s === 'string' && s.length <= 120 && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s);

const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
function parisDate(iso) {
  // brouillon en aperçu : aucune date de publication
  if (!iso || !Number.isFinite(Date.parse(iso))) return { iso: '', label: 'non publié' };
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso));
  const [y, m, d] = p.split('-').map(Number);
  return { iso: p, label: (d === 1 ? '1er' : String(d)) + ' ' + MONTHS[m - 1] + ' ' + y };
}

/** Carte d'article, même balisage que les cartes statiques de la page Ressources. */
function card(a, opts) {
  const o = opts || {};
  const img = safeUrl(a.cover_image && a.cover_image.url);
  const d = parisDate(a.published_at);
  if (!d.iso) return '';
  return '<a href="' + BLOG + '/' + esc(a.slug) + '" class="rs-card' + (o.wide ? ' is-wide' : '') + ' hp-in" data-cat="' + (/ia\b|geo|visibilit/i.test(a.category || '') ? 'geo' : 'growth') + '" data-cms-card>'
    + (img ? '<span class="rs-cover"><img src="' + esc(img) + '" alt="' + esc(a.cover_image.alt || '') + '" width="1200" height="630" loading="lazy" decoding="async"></span>' : '')
    + '<span class="rs-body"><span class="rs-meta">' + (a.category ? '<span class="rs-cat">' + esc(a.category) + '</span>' : '')
    + '<span>' + esc(a.reading_minutes) + ' min de lecture</span><time datetime="' + d.iso + '">' + esc(d.label) + '</time></span>'
    + '<h3 class="rs-title">' + esc(a.title) + '</h3>'
    + (a.excerpt ? '<span class="rs-dek">' + esc(a.excerpt) + '</span>' : '')
    + '<span class="rs-go">Lire l\'article ↗</span></span></a>';
}

/** Balises du <head> d'un article (mêmes conventions que scripts/build.py). */
function articleHead(a, opts) {
  const o = opts || {};
  const url = SITE + BLOG + '/' + a.slug;
  const seo = a.seo || {};
  const canonical = safeUrl(seo.canonical) || url;
  const img = safeUrl(seo.og_image) || DEFAULT_IMG;
  const title = seo.title || a.title;
  const desc = seo.description || a.excerpt || '';
  const robots = o.preview || seo.noindex ? 'noindex, nofollow' : 'index, follow';
  const out = [
    '<meta name="robots" content="' + robots + '">',
    '<title>' + esc(title) + '</title>',
    '<meta name="description" content="' + esc(desc) + '">',
    '<link rel="canonical" href="' + esc(canonical) + '">',
    '<meta property="og:type" content="article">',
    '<meta property="og:site_name" content="Cely">',
    '<meta property="og:locale" content="fr_FR">',
    '<meta property="og:title" content="' + esc(seo.og_title || title) + '">',
    '<meta property="og:description" content="' + esc(desc) + '">',
    '<meta property="og:url" content="' + esc(url) + '">',
    '<meta property="article:published_time" content="' + esc(a.published_at) + '">',
    '<meta property="article:modified_time" content="' + esc(a.updated_at) + '">',
  ];
  if (a.category) out.push('<meta property="article:section" content="' + esc(a.category) + '">');
  (a.tags || []).forEach((t) => out.push('<meta property="article:tag" content="' + esc(t) + '">'));
  out.push('<meta property="og:image" content="' + esc(img) + '">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + esc(seo.og_title || title) + '">',
    '<meta name="twitter:description" content="' + esc(desc) + '">',
    '<meta name="twitter:image" content="' + esc(img) + '">');
  if (!o.preview) {
    const ld = { '@context': 'https://schema.org', '@graph': [
      { '@type': 'BlogPosting', '@id': url + '#article', headline: a.title, description: desc, url: url, mainEntityOfPage: url,
        datePublished: a.published_at, dateModified: a.updated_at, image: img, inLanguage: 'fr-FR',
        author: !a.author || /c[ée]lien/i.test(a.author) ? { '@id': PERSON_ID } : { '@type': 'Person', name: a.author }, publisher: { '@id': ORG_ID },
        keywords: (a.keywords || []).join(', ') || undefined, articleSection: a.category || undefined },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: 'Ressources', item: SITE + BLOG },
        { '@type': 'ListItem', position: 3, name: a.title, item: url }] },
    ].concat(o.faq ? [o.faq] : []) };
    // « </ » échappé : le JSON ne peut pas fermer la balise script
    out.push('<script type="application/ld+json">' + JSON.stringify(ld).replace(/</g, '\\u003c') + '</script>');
  }
  return out.join('\n');
}

/** Élément complet (balises imbriquées comprises) qui commence à l'index i du texte. */
function elementAt(text, i) {
  const tag = /^<(\w+)/.exec(text.slice(i))[1];
  const rx = new RegExp('<(/?)' + tag + '\\b[^>]*>', 'g');
  rx.lastIndex = i;
  let depth = 0, m;
  while ((m = rx.exec(text))) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return text.slice(i, rx.lastIndex);
  }
  return text.slice(i);
}

/** Retire du contenu le premier élément qui commence par ce début de balise ; renvoie [élément, reste]. */
function takeBlock(html, start) {
  const i = html.indexOf(start);
  if (i < 0) return ['', html];
  const el = elementAt(html, i);
  return [el, html.slice(0, i) + html.slice(i + el.length)];
}

/** Code d'un outil du site (api/_cms/outils/<nom>.html, généré par scripts/build.py). */
function outil(nom) {
  try { return template('outils/' + nom + '.html'); } catch (e) { return ''; }
}

/** FAQPage à partir de la FAQ affichée (mêmes règles que scripts/build.py : texte identique à la page). */
function faqLd(html, url) {
  const txt = (h) => h.replace(/<[^>]+>/g, '').replace(/&nbsp;| /g, ' ').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const items = [...html.matchAll(/<details class="art-faq-item"[^>]*><summary><h3>([\s\S]*?)<\/h3>[\s\S]*?<\/summary><div class="art-faq-answer">([\s\S]*?)<\/div><\/details>/g)];
  if (!items.length) return null;
  return { '@type': 'FAQPage', '@id': url + '#faq', mainEntity: items.map((m) => ({ '@type': 'Question', name: txt(m[1]), acceptedAnswer: { '@type': 'Answer', text: txt(m[2]) } })) };
}

const isCelien = (a) => !a.author || /c[ée]lien/i.test(a.author);
const SVG_LI = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 21 11.2 21 14.5V21h-4v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9z"/></svg>';
const SVG_LINK = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

/** Cartes statiques de la page Ressources (les 4 guides historiques), pour compléter « À lire ensuite ». */
function staticCards() {
  try {
    const page = template('actualites.html');
    return [...page.matchAll(/<a href="(\/actualites\/[^"]+)"[^>]*class="rs-card[^"]*"[^>]*>[\s\S]*?<\/a>/g)]
      .map((m) => ({ href: m[1], html: m[0].replace(/class="rs-card[^"]*"/, 'class="rs-card hp-in"') }));
  } catch (e) { return []; }
}

/** Page d'article complète à partir du gabarit. o.next : autres articles du CMS (liste), o.preview, o.status. */
function renderArticle(a, opts) {
  const o = opts || {};
  const url = SITE + BLOG + '/' + a.slug;
  const d = parisDate(a.published_at);
  const u = parisDate(a.updated_at);

  // contenu : « Réponse directe » et « À retenir » remontent en haut, les outils sont injectés
  let body = a.content_html || '';
  let answer, tldr;
  [answer, body] = takeBlock(body, '<div class="art-answer"');
  [tldr, body] = takeBlock(body, '<div class="art-tldr"');
  body = body.replace(/<div data-cms-outil="([a-z-]+)"><\/div>/g, (m, nom) => outil(nom));

  const h2 = (a.headings || []).filter((h) => h.level === 2);
  const toc = h2.length >= 2
    ? '<aside class="art-toc reveal" aria-label="Sommaire de l\'article"><span class="art-toc-label">Dans cet article</span><nav class="art-toc-list">'
      + h2.map((h) => '<a href="#' + esc(h.id) + '">' + esc(h.text) + '</a>').join('') + '</nav></aside>'
    : '';
  const share = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url);
  const dates = d.iso
    ? '<time datetime="' + d.iso + '">Publié le ' + esc(d.label) + '</time>' + (u.iso ? ' · <time datetime="' + u.iso + '">Mis à jour le ' + esc(u.label) + '</time>' : '')
    : 'Non publié';

  // « À lire ensuite » : deux autres articles du CMS, complétés par les guides historiques
  const cards = (o.next || []).filter((n) => n.slug !== a.slug).slice(0, 2).map((n) => card(n));
  for (const c of staticCards()) { if (cards.length >= 2) break; cards.push(c.html); }
  const next = cards.length
    ? '<section class="hp-sec art-next"><div class="section-wrap"><div class="hp-head hp-in"><p class="hp-eyebrow">À lire ensuite</p><h2 class="hp-h2">Pour aller plus loin.</h2></div>'
      + '<div class="rs-grid art-next-grid art-next-2">' + cards.join('\n') + '</div></div></section>'
    : '';

  const values = {
    'CMS:HEAD': articleHead(a, Object.assign({}, o, { faq: faqLd(body, url) })),
    'CMS:BANNER': o.preview ? '<div class="cms-preview-banner" role="status">Aperçu — non publié (' + esc(o.status || '') + ')</div>' : '',
    'CMS:CATEGORY': esc(a.category || 'Ressources'),
    'CMS:TITLE': esc(a.title),
    'CMS:CRUMB': esc(a.title),
    'CMS:DEK': a.excerpt ? '<p class="art-header-dek">' + esc(a.excerpt) + '</p>' : '',
    'CMS:META': '<span class="art-readtime">' + esc(a.reading_minutes) + ' min de lecture</span><span class="art-share">'
      + '<a class="art-share-btn" href="' + esc(share) + '" target="_blank" rel="noopener" aria-label="Partager sur LinkedIn">' + SVG_LI + 'LinkedIn</a>'
      + '<button type="button" class="art-share-btn" data-copy="' + esc(url) + '">' + SVG_LINK + '<span>Copier le lien</span></button></span>',
    'CMS:DATES': dates,
    'CMS:TLDR': answer || tldr ? '<section class="art-tldr-wrap"><div class="section-wrap reveal">' + answer + tldr + '</div></section>' : '',
    'CMS:TOC': toc,
    // content_html est déjà nettoyé par le CMS (aucun script, liste fermée de balises et de classes)
    'CMS:CONTENT': body,
    'CMS:TAGS': (a.tags || []).length ? '<div class="art-tags">' + a.tags.map((t) => '<span class="art-tag">' + esc(t) + '</span>').join('\n') + '</div>' : '',
    'CMS:NEXT': next,
  };
  let page = template('article.html');
  // autre auteur que Célien : signature simple à la place de son bloc et de sa carte
  if (!isCelien(a)) {
    page = page.replace(/<!--CMS:AUTHOR-->[\s\S]*?<!--\/CMS:AUTHOR-->/, '<p class="art-authorhead-dates">Par ' + esc(a.author) + ' · <!--CMS:DATES--></p>')
      .replace(/<!--CMS:AUTHORCARD-->[\s\S]*?<!--\/CMS:AUTHORCARD-->/, '');
  }
  return page.replace(/<!--(CMS:[A-Z]+)-->/g, (m, k) => (k in values ? values[k] : ''));
}

/** Enveloppe une fonction : une erreur inattendue donne une 503 non mise en cache, jamais une page cassée. */
function safe(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (e) {
      console.error('cms', e && e.name); // jamais le contenu de l'erreur : il peut porter un jeton
      if (!res.headersSent) {
        res.statusCode = 503;
        res.setHeader('Cache-Control', NO_CACHE);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end('<!doctype html><meta charset="utf-8"><title>Indisponible</title><p>Page momentanément indisponible. Réessayez dans un instant.</p>');
      } else res.end();
    }
  };
}

module.exports = { safe, SITE, BLOG, CDN_CACHE, NO_CACHE, config, cmsGet, template, esc, isSlug, card, renderArticle, parisDate };
