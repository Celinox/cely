/**
 * Fonction unique des pages du CMS (l'offre Hobby de Vercel limite un déploiement à 12 fonctions).
 * Les adresses publiques sont réécrites vers /api/cms?route=… dans vercel.json :
 *   /actualites → actualites · /actualites/{slug} → article · /apercu → apercu
 *   /sitemap-articles.xml → sitemap · /api/cms/revalidate → revalidate · /api/cms/sante → sante
 * Le code de chaque page est dans api/_lib/route-*.js.
 */
const ROUTES = {
  article: require('./_lib/route-article'),
  apercu: require('./_lib/route-apercu'),
  actualites: require('./_lib/route-actualites'),
  sitemap: require('./_lib/route-sitemap'),
  revalidate: require('./_lib/route-revalidate'),
  sante: require('./_lib/route-sante'),
};

module.exports = async (req, res) => {
  const route = new URL(req.url, 'https://x').searchParams.get('route');
  const handler = Object.prototype.hasOwnProperty.call(ROUTES, route) ? ROUTES[route] : null;
  if (!handler) { res.statusCode = 404; res.setHeader('Cache-Control', 'private, no-store'); return res.end(); }
  return handler(req, res);
};
