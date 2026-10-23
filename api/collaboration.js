/**
 * POST /api/collaboration — Vercel Serverless Function (Node runtime, aucune dépendance npm).
 *
 * Reçoit les réponses du formulaire de qualification "collabForm" (page /nous-rejoindre)
 * et déclenche un e-mail de notification via l'API REST Resend.
 *
 * Sécurité / conformité (voir brief utilisateur) :
 * - La clé secrète Resend (RESEND_API_KEY) ne vit que côté serveur (variable
 *   d'environnement Vercel), jamais exposée au navigateur.
 * - Le destinataire (CONTACT_TO_EMAIL) est fixé côté serveur : le visiteur ne
 *   peut jamais choisir où part le message (pas d'open relay).
 * - Toutes les données sont validées et échappées côté serveur, indépendamment
 *   de la validation déjà faite côté client (qui peut être contournée).
 * - Reply-To = e-mail du prospect (validé), From = adresse sur le domaine
 *   celygrowth.com vérifié dans Resend.
 * - La réponse distingue explicitement "accepté pour l'envoi par Resend" de
 *   "livré" : Resend renvoie un accusé d'acceptation, pas une preuve de
 *   livraison en boîte de réception (voir webhooks Resend pour un vrai statut
 *   de livraison si besoin un jour).
 */

const RESEND_API_URL = 'https://api.resend.com/emails';

// À configurer dans Vercel (Project Settings → Environment Variables) :
//   RESEND_API_KEY   = clé secrète Resend (jamais commitée, jamais dans le frontend)
//   CONTACT_TO_EMAIL = adresse qui doit recevoir les notifications de contact
//   CONTACT_FROM     = adresse d'envoi sur le domaine vérifié, ex. "Cely <contact@celygrowth.com>"
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;
const CONTACT_FROM = process.env.CONTACT_FROM || 'Cely — Site <contact@celygrowth.com>';

const MAX_LEN = { prenom: 80, nom: 80, email: 200, domaine: 40, lien: 300, message: 4000 };
const DOMAINES = ['Outbound', 'Paid', 'SEO', 'Tracking', 'Content', 'Autre'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- rate limiting minimal, en mémoire (best-effort : une instance Vercel
// peut être recyclée à tout moment, ce n'est pas un vrai store partagé —
// une protection anti-abus sérieuse passerait par un service externe, hors
// périmètre de cette mission). Sert surtout à freiner un script naïf. ---
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

// Neutralise tout ce qui pourrait ressembler à une tentative d'injection
// d'en-tête (CR/LF) avant usage dans Reply-To/subject.
function sanitizeHeaderValue(str) {
  return String(str).replace(/[\r\n]+/g, ' ').trim();
}

function isNonEmptyString(v, max) {
  return typeof v === 'string' && v.trim().length > 0 && v.trim().length <= max;
}

function validate(body) {
  const errors = [];
  for (const key of ['prenom', 'nom', 'email', 'domaine', 'message']) {
    if (!isNonEmptyString(body[key], MAX_LEN[key])) errors.push(key);
  }
  if (errors.length) return { ok: false, errors };
  const d = {
    prenom: sanitizeHeaderValue(body.prenom).slice(0, MAX_LEN.prenom),
    nom: sanitizeHeaderValue(body.nom).slice(0, MAX_LEN.nom),
    email: sanitizeHeaderValue(body.email).slice(0, MAX_LEN.email),
    domaine: DOMAINES.includes(body.domaine) ? body.domaine : null,
    lien: typeof body.lien === 'string' ? body.lien.trim().slice(0, MAX_LEN.lien) : '',
    message: String(body.message).trim().slice(0, MAX_LEN.message),
  };
  if (!EMAIL_RE.test(d.email)) return { ok: false, errors: ['email'] };
  if (!d.domaine) return { ok: false, errors: ['domaine'] };
  return { ok: true, data: d };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.error('[collaboration] Configuration manquante : RESEND_API_KEY et/ou CONTACT_TO_EMAIL.');
    return res.status(500).json({ ok: false, error: 'server_misconfigured' });
  }
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ ok: false, error: 'rate_limited' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};
  if (typeof body._hp === 'string' && body._hp.trim() !== '') {
    return res.status(200).json({ ok: true, accepted: true, delivered: 'unknown' });
  }
  const result = validate(body);
  if (!result.ok) return res.status(400).json({ ok: false, error: 'invalid_fields', fields: result.errors });
  const d = result.data;

  const subject = `Proposition de collaboration — ${d.prenom} ${d.nom} (${d.domaine})`;
  const rows = [['Prénom', d.prenom], ['Nom', d.nom], ['Email', d.email], ["Domaine d'expertise", d.domaine],
                ['Portfolio / LinkedIn', d.lien || '(non renseigné)'], ['Message', d.message]];
  const htmlRows = rows.map(([l, v]) => `<tr><td style="padding:8px 14px;font-family:sans-serif;font-size:13px;color:#6B6178;white-space:nowrap;vertical-align:top;">${escapeHtml(l)}</td><td style="padding:8px 14px;font-family:sans-serif;font-size:14px;color:#1A1128;">${escapeHtml(v).replace(/\n/g, '<br>')}</td></tr>`).join('');
  const html = `<!doctype html><html lang="fr"><body style="margin:0;padding:24px;background:#F7F5FA;font-family:sans-serif;">
    <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #DDD3F0;">
      <tr><td style="background:#1A1128;padding:20px 24px;"><span style="font-family:sans-serif;font-weight:800;color:#F7F5FA;font-size:18px;">Cely — Proposition de collaboration</span></td></tr>
      <tr><td style="padding:20px 24px 4px;"><p style="margin:0;font-family:sans-serif;font-size:14px;color:#6B6178;">Formulaire « Nous rejoindre » — page /nous-rejoindre</p></td></tr>
      <tr><td style="padding:8px 10px 20px;"><table role="presentation" width="100%" style="border-collapse:collapse;">${htmlRows}</table></td></tr>
    </table></body></html>`;
  const text = rows.map(([l, v]) => `${l} : ${v}`).join('\n');

  let r;
  try {
    r = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: CONTACT_FROM, to: [CONTACT_TO_EMAIL], reply_to: d.email, subject, html, text }),
    });
  } catch (err) {
    console.error('[collaboration] Échec réseau vers Resend:', err && err.message);
    return res.status(502).json({ ok: false, error: 'upstream_unreachable' });
  }
  if (!r.ok) {
    console.error('[collaboration] Resend a refusé l\'envoi:', r.status);
    return res.status(502).json({ ok: false, error: 'send_rejected' });
  }
  return res.status(200).json({ ok: true, accepted: true, delivered: 'unknown' });
};
