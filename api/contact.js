/**
 * POST /api/contact — Vercel Serverless Function (Node runtime, aucune dépendance npm).
 *
 * Reçoit les réponses du formulaire de qualification "qualifForm" (page /contact)
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

const MAX_LEN = { prenom: 80, nom: 80, email: 200, entreprise: 150, stade: 60, taille: 40, revenu: 60, gestion: 120, blocage: 3000, scale: 4 };

const STADES = ['Pré-seed / Amorçage', 'Seed', 'Série A', 'Série B et +', 'Autre'];
const TAILLES = ['Solo', '2 à 5', '6 à 15', '16 à 50', '50 et +'];
const REVENUS = ['', 'Moins de 10k€/mois', '10k€ à 50k€/mois', '50k€ à 200k€/mois', 'Plus de 200k€/mois'];
const GESTIONS = ["Personne en interne (dirigeant·e ou associé·e)", 'Un profil généraliste marketing', 'Une agence', 'Un·e freelance', 'Personne pour l\'instant'];

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
  const data = {};

  for (const key of ['prenom', 'nom', 'email', 'entreprise', 'stade', 'taille', 'gestion', 'blocage']) {
    if (!isNonEmptyString(body[key], MAX_LEN[key])) errors.push(key);
  }
  if (errors.length) return { ok: false, errors };

  data.prenom = sanitizeHeaderValue(body.prenom).slice(0, MAX_LEN.prenom);
  data.nom = sanitizeHeaderValue(body.nom).slice(0, MAX_LEN.nom);
  data.email = sanitizeHeaderValue(body.email).slice(0, MAX_LEN.email);
  if (!EMAIL_RE.test(data.email)) return { ok: false, errors: ['email'] };
  data.entreprise = String(body.entreprise).trim().slice(0, MAX_LEN.entreprise);
  data.stade = STADES.includes(body.stade) ? body.stade : null;
  if (!data.stade) return { ok: false, errors: ['stade'] };
  data.taille = TAILLES.includes(body.taille) ? body.taille : null;
  if (!data.taille) return { ok: false, errors: ['taille'] };
  data.gestion = GESTIONS.includes(body.gestion) ? body.gestion : null;
  if (!data.gestion) return { ok: false, errors: ['gestion'] };
  data.blocage = String(body.blocage).trim().slice(0, MAX_LEN.blocage);

  // champs optionnels
  data.revenu = REVENUS.includes(body.revenu) ? body.revenu : '';
  const scaleNum = Number(body.scale);
  data.scale = Number.isInteger(scaleNum) && scaleNum >= 1 && scaleNum <= 10 ? scaleNum : null;

  return { ok: true, data };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.error('[contact] Configuration manquante : RESEND_API_KEY et/ou CONTACT_TO_EMAIL absents des variables d\'environnement.');
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
    // on répond succès pour ne pas indiquer au bot qu'il a été détecté,
    // mais on n'envoie jamais réellement l'e-mail.
    return res.status(200).json({ ok: true, accepted: true, delivered: 'unknown' });
  }

  const result = validate(body);
  if (!result.ok) {
    return res.status(400).json({ ok: false, error: 'invalid_fields', fields: result.errors });
  }
  const d = result.data;

  // normalisation optionnelle d'une URL de site perso — jamais utilisée ici
  // (le formulaire de qualification n'a pas ce champ), gardé pour cohérence
  // si un champ "site" est ajouté un jour.
  function normalizeUrl(raw) {
    if (!raw) return '';
    let v = String(raw).trim();
    if (!v) return '';
    if (!/^https?:\/\//i.test(v)) v = 'https://' + v;
    try {
      const u = new URL(v);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
      return u.toString();
    } catch {
      return '';
    }
  }
  void normalizeUrl;

  const subject = `Nouvelle demande de contact — ${d.prenom} ${d.nom} (${d.entreprise})`;

  const rows = [
    ['Prénom', d.prenom],
    ['Nom', d.nom],
    ['Email', d.email],
    ['Entreprise', d.entreprise],
    ['Stade de la startup', d.stade],
    ["Taille de l'équipe", d.taille],
    ['Tranche de revenu mensuel', d.revenu || '(non renseigné)'],
    ["Qui gère l'acquisition aujourd'hui", d.gestion],
    ["Qu'est-ce qui bloque le plus", d.blocage],
    ['Auto-évaluation acquisition (1-10)', d.scale !== null ? `${d.scale} / 10` : '(non renseigné)'],
  ];

  const htmlRows = rows
    .map(([label, value]) => `<tr><td style="padding:8px 14px;font-family:sans-serif;font-size:13px;color:#6B6178;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 14px;font-family:sans-serif;font-size:14px;color:#1A1128;">${escapeHtml(value).replace(/\n/g, '<br>')}</td></tr>`)
    .join('');

  const html = `<!doctype html><html lang="fr"><body style="margin:0;padding:24px;background:#F7F5FA;font-family:sans-serif;">
    <table role="presentation" width="100%" style="max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #DDD3F0;">
      <tr><td style="background:#1A1128;padding:20px 24px;">
        <span style="font-family:sans-serif;font-weight:800;color:#F7F5FA;font-size:18px;">Cely — Nouveau contact</span>
      </td></tr>
      <tr><td style="padding:20px 24px 4px;">
        <p style="margin:0;font-family:sans-serif;font-size:14px;color:#6B6178;">Formulaire de qualification — page /contact</p>
      </td></tr>
      <tr><td style="padding:8px 10px 20px;">
        <table role="presentation" width="100%" style="border-collapse:collapse;">${htmlRows}</table>
      </td></tr>
      <tr><td style="padding:0 24px 20px;">
        <p style="margin:0;font-family:sans-serif;font-size:12px;color:#6B6178;">Répondre à cet e-mail répond directement à ${escapeHtml(d.email)}.</p>
      </td></tr>
    </table>
  </body></html>`;

  const text = rows.map(([label, value]) => `${label} : ${value}`).join('\n') + `\n\nRépondre à cet e-mail répond directement à ${d.email}.`;

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
      }),
    });
  } catch (err) {
    console.error('[contact] Échec réseau vers Resend:', err && err.message);
    return res.status(502).json({ ok: false, error: 'upstream_unreachable' });
  }

  if (!resendRes.ok) {
    let detail = null;
    try { detail = await resendRes.json(); } catch {}
    console.error('[contact] Resend a refusé l\'envoi:', resendRes.status, detail && detail.message);
    return res.status(502).json({ ok: false, error: 'send_rejected' });
  }

  // Resend a accepté le message pour envoi : cela ne garantit pas encore la
  // livraison en boîte de réception (bounce, spam, filtrage possibles après
  // coup). On le dit clairement au client plutôt que de prétendre "livré".
  return res.status(200).json({ ok: true, accepted: true, delivered: 'unknown' });
};
