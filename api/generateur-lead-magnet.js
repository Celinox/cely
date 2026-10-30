/**
 * POST /api/generateur-lead-magnet — Vercel Serverless Function (Node runtime, aucune dépendance npm).
 *
 * Reçoit les 8 réponses du Générateur de lead magnet (article /actualites/lead-magnet), recalcule le plan
 * côté serveur avec le même moteur que la page (api/_lib/lm-engine.js), puis envoie via Resend :
 *   1. une notification à CONTACT_TO_EMAIL (réponses + profil recommandé), Reply-To = prospect ;
 *   2. un e-mail récapitulatif au prospect (son plan), Reply-To = CONTACT_TO_EMAIL.
 *
 * Variables Vercel : RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM (domaine vérifié dans Resend).
 * Sécurité : destinataire interne fixé côté serveur, validation et échappement serveur, honeypot `_hp`,
 * rate limit en mémoire (best-effort), consentement obligatoire.
 */
const Engine = require('./_lib/lm-engine.js');

const RESEND_API_URL = 'https://api.resend.com/emails';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;
const CONTACT_FROM = process.env.CONTACT_FROM || 'Cely — Site <contact@celygrowth.com>';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ARTICLE = 'https://www.celygrowth.com/actualites/lead-magnet';
const CONTACT = 'https://www.celygrowth.com/contact#formulaire';

const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  arr.push(now); hits.set(ip, arr);
  return arr.length > 5;
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const hdr = (s) => String(s).replace(/[\r\n]+/g, ' ').trim();

function validate(body) {
  const email = typeof body.email === 'string' ? hdr(body.email).slice(0, 200) : '';
  const company = typeof body.company === 'string' ? hdr(body.company).slice(0, 150) : '';
  if (!EMAIL_RE.test(email)) return { ok: false, errors: ['email'] };
  if (!company) return { ok: false, errors: ['company'] };
  if (body.consent !== true) return { ok: false, errors: ['consent'] };
  const a = body.answers && typeof body.answers === 'object' ? body.answers : {};
  return { ok: true, email, company, plan: Engine.build(a) };
}

async function send(payload) {
  try {
    const r = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) console.error('[generateur-lead-magnet] Resend a refusé l\'envoi:', r.status);
    return r.ok;
  } catch (err) {
    console.error('[generateur-lead-magnet] Échec réseau vers Resend:', err && err.message);
    return false;
  }
}

const shell = (title, inner) => `<!doctype html><html lang="fr"><body style="margin:0;padding:24px;background:#F7F5FA;font-family:sans-serif;">
<table role="presentation" width="100%" style="max-width:620px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #DDD3F0;">
<tr><td style="background:#1A1128;padding:20px 24px;"><span style="font-weight:800;color:#F7F5FA;font-size:18px;">${esc(title)}</span></td></tr>
${inner}</table></body></html>`;
const h2 = (t) => `<tr><td style="padding:18px 24px 4px;"><p style="margin:0;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#682DFE;font-weight:700;">${esc(t)}</p></td></tr>`;
const para = (t) => `<tr><td style="padding:4px 24px;"><p style="margin:0;font-size:15px;line-height:1.55;color:#1A1128;">${esc(t)}</p></td></tr>`;
const list = (items) => `<tr><td style="padding:4px 24px;"><ul style="margin:0;padding-left:20px;font-size:15px;line-height:1.55;color:#1A1128;">${items.map((i) => `<li style="margin:0 0 6px;">${i}</li>`).join('')}</ul></td></tr>`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'method_not_allowed' }); }
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.error('[generateur-lead-magnet] Configuration manquante : RESEND_API_KEY et/ou CONTACT_TO_EMAIL.');
    return res.status(500).json({ ok: false, error: 'server_misconfigured' });
  }
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ ok: false, error: 'rate_limited' });
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};
  if (typeof body._hp === 'string' && body._hp.trim() !== '') return res.status(200).json({ ok: true, accepted: true, delivered: 'unknown' });
  const v = validate(body);
  if (!v.ok) return res.status(400).json({ ok: false, error: 'invalid_fields', fields: v.errors });
  const p = v.plan, a = p.answers, L = p.labels;

  // 1. Notification interne
  const rows = [
    ['Email', v.email], ['Société', v.company],
    ['Profil recommandé', `${p.format} (famille : ${p.famille})`],
    ['Offre', a.offre || '—'], ['Cible', a.cible || '—'], ['Problème', a.probleme || '—'],
    ['Panier', L.panier[a.panier]], ['Temps disponible', L.temps[a.temps]],
    ['Décideurs', L.decideur[a.decideur]], ['Déjà essayé', L.essai[a.essai]], ['Priorité', L.priorite[a.priorite]],
  ];
  const nHtml = shell('Cely — Générateur de lead magnet',
    `<tr><td style="padding:18px 24px 4px;"><p style="margin:0;font-size:14px;color:#6B6178;">Article « Lead magnet » — /actualites/lead-magnet</p></td></tr>
<tr><td style="padding:8px 10px 20px;"><table role="presentation" width="100%" style="border-collapse:collapse;">${rows.map(([l, x]) => `<tr><td style="padding:8px 14px;font-size:13px;color:#6B6178;white-space:nowrap;vertical-align:top;">${esc(l)}</td><td style="padding:8px 14px;font-size:14px;color:#1A1128;">${esc(x)}</td></tr>`).join('')}</table></td></tr>`);
  const notified = await send({
    from: CONTACT_FROM, to: [CONTACT_TO_EMAIL], reply_to: v.email,
    subject: hdr(`Générateur lead magnet — ${v.company} (${p.format})`),
    html: nHtml, text: rows.map(([l, x]) => `${l} : ${x}`).join('\n'),
  });
  if (!notified) return res.status(502).json({ ok: false, error: 'send_rejected' });

  // 2. Récapitulatif au prospect
  const rHtml = shell('Votre plan de lead magnet',
    para('Bonjour,') + para('Voici le récapitulatif du plan construit par le générateur de lead magnet de Cely, à partir de vos réponses.') +
    h2('Le format recommandé') + para(p.format) + para(p.why) +
    h2('Trois idées de titre') + list(p.titles.map(esc)) +
    h2(p.contenu.label) + list(p.contenu.items.map(esc)) +
    h2('La page de capture, bloc par bloc') + list(p.page.map(([t, d]) => `<strong>${esc(t)}</strong> : ${esc(d)}`)) +
    h2('La séquence de relance') + list(p.sequence.map(([w, s, d]) => `<strong>${esc(w)}</strong> — ${esc(s)}<br>${esc(d)}`)) +
    h2('L\'indicateur à suivre') + para(p.kpi) +
    h2('Le piège à éviter') + para(p.piege) +
    `<tr><td style="padding:20px 24px 8px;"><a href="${CONTACT}" style="display:inline-block;background:#682DFE;color:#FFFFFF;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:999px;font-size:15px;">Faire le point avec Célien</a></td></tr>` +
    `<tr><td style="padding:8px 24px 24px;"><p style="margin:0;font-size:13px;line-height:1.5;color:#6B6178;">Vous recevez cet e-mail parce que vous avez demandé votre plan sur <a href="${ARTICLE}" style="color:#5B22E0;">celygrowth.com</a>. Pour toute question ou pour faire supprimer vos données, répondez simplement à ce message.</p></td></tr>`);
  const rText = [
    'Votre plan de lead magnet — Cely', '', `Format recommandé : ${p.format}`, p.why, '',
    'Trois idées de titre :', ...p.titles.map((t) => `- ${t}`), '',
    `${p.contenu.label} :`, ...p.contenu.items.map((t) => `- ${t}`), '',
    'La page de capture :', ...p.page.map(([t, d]) => `- ${t} : ${d}`), '',
    'La séquence de relance :', ...p.sequence.map(([w, s, d]) => `- ${w} — ${s} : ${d}`), '',
    `Indicateur à suivre : ${p.kpi}`, `Piège à éviter : ${p.piege}`, '',
    `Faire le point avec Célien : ${CONTACT}`,
  ].join('\n');
  const recap = await send({
    from: CONTACT_FROM, to: [v.email], reply_to: CONTACT_TO_EMAIL,
    subject: 'Votre plan de lead magnet', html: rHtml, text: rText,
  });
  if (!recap) return res.status(502).json({ ok: false, error: 'recap_rejected', notified: true });
  return res.status(200).json({ ok: true, accepted: true, delivered: 'unknown' });
};
