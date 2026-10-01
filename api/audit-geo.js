/**
 * POST /api/audit-geo — Vercel Serverless Function (Node runtime, aucune dépendance npm).
 *
 * Reçoit les demandes d'« audit GEO offert » de l'article
 * /actualites/referencement-ia (formulaire compact en début d'article et
 * formulaire complet en section 8) et envoie un e-mail de notification à Cely
 * via l'API REST Resend.
 *
 * Même modèle de sécurité que /api/contact et /api/lead-article : clé Resend et
 * destinataire fixés côté serveur, jamais côté client ; validation stricte
 * indépendante du navigateur ; honeypot ; rate limiting best-effort en mémoire ;
 * distinction « accepté par Resend » / « livré ».
 */

const RESEND_API_URL = 'https://api.resend.com/emails';

// Réutilise les variables d'environnement Vercel déjà en place pour /api/contact :
//   RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;
const CONTACT_FROM = process.env.CONTACT_FROM || 'Cely — Site <contact@celygrowth.com>';

const LEAD_SOURCE_TAG = 'Prospect_Article_ReferencementIA';

const MAX_LEN = { site: 300, email: 200, page: 500 };
const PLACEMENTS = { debut: "Formulaire compact (début d'article)", fin: 'Formulaire complet (section 8)' };
const VARIANTS = ['compact', 'full'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const hits = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > MAX_PER_WINDOW;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeHeaderValue(str) {
  return String(str).replace(/[\r\n]+/g, ' ').trim();
}

function isNonEmptyString(v, max) {
  return typeof v === 'string' && v.trim().length > 0 && v.trim().length <= max;
}

// Accepte « www.site.fr », « site.fr/page » ou une URL complète ; renvoie une URL http(s) propre ou ''.
function normalizeSite(raw) {
  let v = String(raw || '').trim();
  if (!v) return '';
  if (!/^https?:\/\//i.test(v)) v = 'https://' + v;
  try {
    const u = new URL(v);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
    if (!/\./.test(u.hostname) || u.username || u.password) return '';
    return u.origin + (u.pathname === '/' ? '' : u.pathname);
  } catch {
    return '';
  }
}

function validate(body) {
  if (!isNonEmptyString(body.site, MAX_LEN.site)) return { ok: false, errors: ['site'] };
  const site = normalizeSite(sanitizeHeaderValue(body.site));
  if (!site) return { ok: false, errors: ['site'] };

  if (!isNonEmptyString(body.email, MAX_LEN.email)) return { ok: false, errors: ['email'] };
  const email = sanitizeHeaderValue(body.email).slice(0, MAX_LEN.email);
  if (!EMAIL_RE.test(email)) return { ok: false, errors: ['email'] };

  const placement = Object.prototype.hasOwnProperty.call(PLACEMENTS, body.placement) ? body.placement : null;
  if (!placement) return { ok: false, errors: ['placement'] };
  const variant = VARIANTS.includes(body.variant) ? body.variant : '';

  // page : informative uniquement (jamais utilisée comme lien cliquable dans l'e-mail)
  const page = isNonEmptyString(body.page, MAX_LEN.page) ? sanitizeHeaderValue(body.page) : '';

  return { ok: true, data: { site, email, placement, variant, page } };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.error("[audit-geo] Configuration manquante : RESEND_API_KEY et/ou CONTACT_TO_EMAIL absents des variables d'environnement.");
    return res.status(500).json({ ok: false, error: 'server_misconfigured' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, error: 'rate_limited' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // honeypot : champ caché côté client, jamais rempli par un humain
  if (typeof body._hp === 'string' && body._hp.trim() !== '') {
    return res.status(200).json({ ok: true, accepted: true, delivered: 'unknown' });
  }

  const result = validate(body);
  if (!result.ok) {
    return res.status(400).json({ ok: false, error: 'invalid_fields', fields: result.errors });
  }
  const d = result.data;
  const host = d.site.replace(/^https?:\/\//, '');
  const when = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris', dateStyle: 'full', timeStyle: 'short' });

  const subject = `Audit GEO demandé — ${host}`;

  const rows = [
    ['Site à auditer', d.site],
    ['Email', d.email],
    ['Formulaire', PLACEMENTS[d.placement]],
    ['Reçu le', when],
    ['Page', d.page || '/actualites/referencement-ia'],
  ];

  const htmlRows = rows
    .map(([label, value]) => `<tr><td style="padding:8px 14px;font-family:sans-serif;font-size:13px;color:#6B6178;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 14px;font-family:sans-serif;font-size:14px;color:#1A1128;">${escapeHtml(value)}</td></tr>`)
    .join('');

  const html = `<!doctype html><html lang="fr"><body style="margin:0;padding:24px;background:#F7F5FA;font-family:sans-serif;">
    <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #DDD3F0;">
      <tr><td style="background:#1A1128;padding:20px 24px;">
        <span style="font-family:sans-serif;font-weight:800;color:#F7F5FA;font-size:18px;">Cely — Demande d'audit GEO</span>
      </td></tr>
      <tr><td style="padding:20px 24px 4px;">
        <p style="margin:0;font-family:sans-serif;font-size:14px;color:#6B6178;">Article « Le référencement IA : la ruée vers l'or de 2026 » — /actualites/referencement-ia</p>
      </td></tr>
      <tr><td style="padding:8px 10px 20px;">
        <table role="presentation" width="100%" style="border-collapse:collapse;">${htmlRows}</table>
      </td></tr>
      <tr><td style="padding:0 24px 20px;">
        <p style="margin:0;font-family:sans-serif;font-size:12px;color:#6B6178;">Répondre à cet e-mail répond directement à ${escapeHtml(d.email)}. Le prospect attend un premier diagnostic par e-mail.</p>
      </td></tr>
    </table>
  </body></html>`;

  const text = `${LEAD_SOURCE_TAG}\n` + rows.map(([label, value]) => `${label} : ${value}`).join('\n') +
    `\n\nRépondre à cet e-mail répond directement à ${d.email}.`;

  let resendRes;
  try {
    resendRes = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO_EMAIL],
        reply_to: d.email,
        subject,
        html,
        text,
        tags: [{ name: 'source', value: 'article_referencement_ia' }, { name: 'placement', value: d.placement }],
      }),
    });
  } catch (err) {
    console.error('[audit-geo] Échec réseau vers Resend:', err && err.message);
    return res.status(502).json({ ok: false, error: 'upstream_unreachable' });
  }

  if (!resendRes.ok) {
    let detail = null;
    try { detail = await resendRes.json(); } catch {}
    console.error("[audit-geo] Resend a refusé l'envoi:", resendRes.status, detail && detail.message);
    return res.status(502).json({ ok: false, error: 'send_rejected' });
  }

  return res.status(200).json({ ok: true, accepted: true, delivered: 'unknown' });
};
