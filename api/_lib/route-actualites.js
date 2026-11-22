/**
 * GET /actualites (réécrit vers /api/cms-actualites) — page Ressources : les articles du CMS (les plus récents d'abord)
 * sont ajoutés en tête de la grille, devant les guides statiques. CMS indisponible : la page statique seule.
 */
const { safe, CDN_CACHE, cmsGet, template, card } = require('./cms');

module.exports = safe(async (req, res) => {
  const page = template('actualites.html');
  const r = await cmsGet('/articles?par_page=100');
  const items = r.status === 200 && r.body && Array.isArray(r.body.items) ? r.body.items : [];
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // CMS indisponible : cache court, pour retrouver vite les articles
  res.setHeader('Cache-Control', r.status === 200 ? CDN_CACHE : 'public, max-age=0, s-maxage=10');
  res.end(page.replace('<!--CMS:CARDS-->', items.map((a) => card(a, { wide: true })).join('\n')));
});
