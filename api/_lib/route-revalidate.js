/**
 * POST /api/cms/revalidate — appel du CRM quand un contenu change (secret partagé CELY_CMS_REVALIDATE_SECRET).
 * Le site n'a pas de cache par étiquettes : ses pages CMS sont gardées une minute au plus par le CDN, le
 * contenu à jour est donc servi dans la minute. Cette route valide l'appel et répond 200 pour que le CRM
 * sache que le site est joignable ; elle n'a aucun effet de bord (un appel répété est sans conséquence).
 */
const crypto = require('crypto');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'POST') { res.statusCode = 405; res.setHeader('Allow', 'POST'); return res.end(); }
  const secret = (process.env.CELY_CMS_REVALIDATE_SECRET || '').trim();
  const given = Buffer.from(String(req.headers.authorization || '').replace(/^Bearer /, ''));
  const expected = Buffer.from(secret);
  if (secret.length < 24 || given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) {
    res.statusCode = 401; return res.end();
  }
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: true }));
};
