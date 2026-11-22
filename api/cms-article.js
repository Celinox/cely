/**
 * GET /actualites/{slug} (réécrit vers /api/cms-article?slug=…) — article du CMS rendu dans le gabarit du site.
 * Les articles statiques existants (fichiers actualites/*.html) sont servis avant cette fonction par Vercel.
 * Ancien slug → 301 vers le slug actuel ; inconnu ou non publié → vraie 404 ; CMS indisponible → 503 non mis en cache.
 */
const fs = require('fs');
const path = require('path');
const { safe, BLOG, CDN_CACHE, NO_CACHE, cmsGet, isSlug, renderArticle } = require('./_lib/cms');

function notFound(res) {
  let body = '<!doctype html><title>Page introuvable</title><h1>Page introuvable</h1>';
  for (const f of [path.join(__dirname, '..', '404.html'), path.join(process.cwd(), '404.html')]) {
    try { body = fs.readFileSync(f, 'utf8'); break; } catch (e) { /* suivant */ }
  }
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', CDN_CACHE);
  res.end(body);
}

module.exports = safe(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.statusCode = 405; res.setHeader('Allow', 'GET, HEAD'); return res.end(); }
  const slug = new URL(req.url, 'https://x').searchParams.get('slug') || '';
  if (!isSlug(slug)) return notFound(res);
  const r = await cmsGet('/articles/' + slug);
  if (r.status === 200 && r.body && r.body.redirect && isSlug(r.body.redirect.to)) {
    res.statusCode = 301;
    res.setHeader('Location', BLOG + '/' + r.body.redirect.to);
    res.setHeader('Cache-Control', CDN_CACHE);
    return res.end();
  }
  if (r.status === 200 && r.body && r.body.article) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', CDN_CACHE);
    return res.end(req.method === 'HEAD' ? undefined : renderArticle(r.body.article));
  }
  if (r.status === 404) return notFound(res);
  // CMS injoignable, non configuré, limite atteinte… : jamais mis en cache, le CDN réessaiera
  res.statusCode = 503;
  res.setHeader('Retry-After', '60');
  res.setHeader('Cache-Control', NO_CACHE);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end('<!doctype html><meta charset="utf-8"><title>Indisponible</title><p>Article momentanément indisponible. Réessayez dans un instant.</p>');
});
