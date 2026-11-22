/**
 * GET /apercu?jeton=… (réécrit vers /api/cms-apercu) — aperçu d'un article du CMS quel que soit son statut.
 * Jamais mis en cache, jamais indexé ; le jeton n'est ni journalisé ni renvoyé.
 */
const { safe, NO_CACHE, cmsGet, renderArticle } = require('./_lib/cms');

module.exports = safe(async (req, res) => {
  res.setHeader('Cache-Control', NO_CACHE);
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Referrer-Policy', 'no-referrer');
  const jeton = new URL(req.url, 'https://x').searchParams.get('jeton') || '';
  const send = (status, html) => { res.statusCode = status; res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(html); };
  if (!/^[A-Za-z0-9_-]{43}$/.test(jeton)) return send(404, '<!doctype html><meta charset="utf-8"><title>Aperçu introuvable</title><p>Lien d\'aperçu invalide ou expiré.</p>');
  const r = await cmsGet('/apercu?jeton=' + encodeURIComponent(jeton));
  if (r.status === 200 && r.body && r.body.article) return send(200, renderArticle(r.body.article, { preview: true, status: r.body.preview && r.body.preview.status }));
  if (r.status === 404) return send(404, '<!doctype html><meta charset="utf-8"><title>Aperçu introuvable</title><p>Lien d\'aperçu invalide ou expiré.</p>');
  send(503, '<!doctype html><meta charset="utf-8"><title>Indisponible</title><p>Aperçu momentanément indisponible.</p>');
});
