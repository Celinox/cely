/**
 * GET /sitemap-articles.xml (réécrit vers /api/cms-sitemap) — articles publiés et indexables du CMS.
 * Déclaré dans robots.txt à côté de sitemap.xml (pages statiques, généré par scripts/build.py).
 */
const { safe, SITE, BLOG, CDN_CACHE, cmsGet, esc, isSlug } = require('./_lib/cms');

module.exports = safe(async (req, res) => {
  const r = await cmsGet('/sitemap');
  if (r.status !== 200 || !r.body || !Array.isArray(r.body.articles)) {
    res.statusCode = 503; res.setHeader('Retry-After', '60'); res.setHeader('Cache-Control', 'private, no-store'); return res.end();
  }
  const rows = r.body.articles
    .filter((a) => isSlug(a.slug) && (!a.canonical || a.canonical === SITE + BLOG + '/' + a.slug))
    .map((a) => '  <url>\n    <loc>' + SITE + BLOG + '/' + esc(a.slug) + '</loc>\n    <lastmod>' + esc(String(a.updated_at).slice(0, 10)) + '</lastmod>\n  </url>');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', CDN_CACHE);
  res.end('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + rows.join('\n') + (rows.length ? '\n' : '') + '</urlset>\n');
});
