/**
 * GET /api/cms-sante — diagnostic de la liaison avec le CMS, sans aucun secret :
 * variables présentes ou non (jamais leur valeur), réponse du CMS, nombre d'articles publiés lus.
 */
const { safe, config, cmsGet } = require('./_lib/cms');

module.exports = safe(async (req, res) => {
  const c = config();
  const out = {
    variables: {
      CELY_CMS_API_URL: !!(process.env.CELY_CMS_API_URL || '').trim(),
      CELY_CMS_API_KEY: !!(process.env.CELY_CMS_API_KEY || '').trim(),
      CELY_CMS_API_KEY_longueur_ok: (process.env.CELY_CMS_API_KEY || '').trim().length >= 32,
      CELY_CMS_REVALIDATE_SECRET: !!(process.env.CELY_CMS_REVALIDATE_SECRET || '').trim(),
    },
    adresse_cms: c ? c.url.replace(/^(https?:\/\/[^/]+).*$/, '$1') : null,
  };
  if (c) {
    const r = await cmsGet('/articles?par_page=5');
    out.reponse_cms = r.status || 'injoignable';
    out.sens = { 200: 'OK', 401: 'clé refusée : CELY_CMS_API_KEY différente de CMS_SITE_API_KEY du CRM', 503: 'CRM non configuré ou indisponible', 404: 'adresse CELY_CMS_API_URL incorrecte' }[r.status] || 'CRM injoignable : vérifier CELY_CMS_API_URL';
    if (r.status === 200 && r.body) { out.articles_publies = r.body.total; out.slugs = (r.body.items || []).map((a) => a.slug); }
  } else out.sens = 'variables CELY_CMS_API_URL ou CELY_CMS_API_KEY absentes de ce déploiement';
  res.statusCode = 200;
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(out, null, 2));
});
