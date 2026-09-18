/**
 * POST /api/lead-article — Vercel Serverless Function (Node runtime, aucune dépendance npm).
 *
 * Reçoit la capture email du simulateur "Inbound vs outbound" (article de blog
 * /actualites/inbound-vs-outbound) et déclenche un e-mail de notification via
 * l'API REST Resend, avec le profil obtenu et le détail des réponses en contexte.
 *
 * Même modèle de sécurité que /api/contact : clé Resend et destinataire fixés
 * côté serveur, jamais côté client ; validation stricte indépendante du client ;
 * honeypot ; rate limiting best-effort en mémoire ; distinction accepté/livré.
 */

const RESEND_API_URL = 'https://api.resend.com/emails';

// Réutilise les mêmes variables d'environnement Vercel que /api/contact :
//   RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;
const CONTACT_FROM = process.env.CONTACT_FROM || 'Cely — Site <contact@celygrowth.com>';

const LEAD_SOURCE_TAG = 'Prospect_Article_InboundVsOutbound';

const MAX_LEN = { email: 200, profile: 60 };
const MAX_ANSWERS = 8;
const MAX_ANSWER_LABEL = 160;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PROFILES = ["Outbound d'abord", "Inbound d'abord", 'Combo signal-based'];

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

function validate(body) {
  if (!isNonEmptyString(body.email, MAX_LEN.email)) return { ok: false, errors: ['email'] };
  const email = sanitizeHeaderValue(body.email).slice(0, MAX_LEN.email);
  if (!EMAIL_RE.test(email)) return { ok: false, errors: ['email'] };

  if (body.consent !== true) return { ok: false, errors: ['consent'] };

  const profile = PROFILES.includes(body.profile) ? body.profile : null;
  if (!profile) return { ok: false, errors: ['profile'] };

  const scoreI = Number(body.scoreI);
  const scoreO = Number(body.scoreO);
  if (!Number.isFinite(scoreI) || !Number.isFinite(scoreO)) return { ok: false, errors: ['score'] };

  let answers = [];
  if (Array.isArray(body.answers)) {
    answers = body.answers.slice(0, MAX_ANSWERS).map((a) => ({
      question: isNonEmptyString(a && a.question, MAX_ANSWER_LABEL) ? sanitizeHeaderValue(a.question).slice(0, MAX_ANSWER_LABEL) : '',
      answer: isNonEmptyString(a && a.answer, MAX_ANSWER_LABEL) ? sanitizeHeaderValue(a.answer).slice(0, MAX_ANSWER_LABEL) : '',
    })).filter((a) => a.question && a.answer);
  }

  return { ok: true, data: { email, profile, scoreI, scoreO, answers } };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.error('[lead-article] Configuration manquante : RESEND_API_KEY et/ou CONTACT_TO_EMAIL absents des variables d\'environnement.');
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

  const subject = `${LEAD_SOURCE_TAG} — nouveau lead (profil : ${d.profile})`;

  const answerRows = d.answers
    .map((a) => `<tr><td style="padding:6px 14px;font-family:sans-serif;font-size:13px;color:#6B6178;vertical-align:top;">${escapeHtml(a.question)}</td><td style="padding:6px 14px;font-family:sans-serif;font-size:14px;color:#1A1128;">${escapeHtml(a.answer)}</td></tr>`)
    .join('');

  const html = `<!doctype html><html lang="fr"><body style="margin:0;padding:24px;background:#F7F5FA;font-family:sans-serif;">
    <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #DDD3F0;">
      <tr><td style="background:#1A1128;padding:20px 24px;">
        <span style="font-family:sans-serif;font-weight:800;color:#F7F5FA;font-size:18px;">Cely — Nouveau lead (article Inbound vs outbound)</span>
      </td></tr>
      <tr><td style="padding:20px 24px 4px;">
        <p style="margin:0;font-family:sans-serif;font-size:14px;color:#6B6178;">Simulateur en fin d'article — /actualites/inbound-vs-outbound</p>
      </td></tr>
      <tr><td style="padding:14px 24px 4px;">
        <table role="presentation" style="border-collapse:collapse;">
          <tr><td style="padding:6px 14px;font-family:sans-serif;font-size:13px;color:#6B6178;white-space:nowrap;">Email</td><td style="padding:6px 14px;font-family:sans-serif;font-size:14px;color:#1A1128;font-weight:700;">${escapeHtml(d.email)}</td></tr>
          <tr><td style="padding:6px 14px;font-family:sans-serif;font-size:13px;color:#6B6178;white-space:nowrap;">Profil obtenu</td><td style="padding:6px 14px;font-family:sans-serif;font-size:14px;color:#1A1128;font-weight:700;">${escapeHtml(d.profile)}</td></tr>
          <tr><td style="padding:6px 14px;font-family:sans-serif;font-size:13px;color:#6B6178;white-space:nowrap;">Score</td><td style="padding:6px 14px;font-family:sans-serif;font-size:14px;color:#1A1128;">Inbound ${escapeHtml(String(d.scoreI))} — Outbound ${escapeHtml(String(d.scoreO))}</td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:8px 10px 20px;">
        <table role="presentation" width="100%" style="border-collapse:collapse;">${answerRows}</table>
      </td></tr>
      <tr><td style="padding:0 24px 20px;">
        <p style="margin:0;font-family:sans-serif;font-size:12px;color:#6B6178;">Contexte : score sert de base de relance. Répondre à cet e-mail n'atteint pas le prospect (pas de reply-to prospect ici, contrairement au formulaire de contact).</p>
      </td></tr>
    </table>
  </body></html>`;

  const text = `${LEAD_SOURCE_TAG}\nEmail : ${d.email}\nProfil obtenu : ${d.profile}\nScore : Inbound ${d.scoreI} — Outbound ${d.scoreO}\n\n` +
    d.answers.map((a) => `${a.question} : ${a.answer}`).join('\n');

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
        subject,
        html,
        text,
      }),
    });
  } catch (err) {
    console.error('[lead-article] Échec réseau vers Resend:', err && err.message);
    return res.status(502).json({ ok: false, error: 'upstream_unreachable' });
  }

  if (!resendRes.ok) {
    let detail = null;
    try { detail = await resendRes.json(); } catch {}
    console.error('[lead-article] Resend a refusé l\'envoi:', resendRes.status, detail && detail.message);
    return res.status(502).json({ ok: false, error: 'send_rejected' });
  }

  return res.status(200).json({ ok: true, accepted: true, delivered: 'unknown' });
};
