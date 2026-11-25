"""Pages services (/services/<slug>) générées depuis src/services.json.

Chaque page reprend la DA de l'accueil (classes .hm) avec une couche .sp :
haut de page, définition, livrables, déroulé, pont vers Growth Part-Time,
cas clients éventuels, FAQ (balisage FAQPage via build.py) et autres leviers.
"""
import json, os, random, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'src', 'services.json')
CAS = os.path.join(ROOT, 'src', 'cas-clients.json')
SITE = 'https://www.celygrowth.com'
BASE = '/services/'

# phrase courte utilisée sur les cartes (autres leviers, page Services, navigation)
CARTE = {
    'strategie-acquisition': "Cibles, messages et plan d'action à 90 jours.",
    'prospection-outbound': "Fichiers ciblés, séquences email et LinkedIn, jusqu'au rendez-vous.",
    'inbound-marketing': "Contenu, LinkedIn, SEO et visibilité dans les IA.",
    'automatisation-marketing': "Du premier signal au rendez-vous, sans saisie manuelle.",
    'lead-scoring': "Vos commerciaux appellent d'abord les prospects les plus chauds.",
    'crm-tracking': "Savoir d'où vient chaque client, et combien il a coûté.",
    'publicite-ads': "LinkedIn Ads et Google Ads, pilotées avec le reste de votre acquisition.",
}
SPECIAUX = {
    '@audit': ("Audits", "/audit", "Des diagnostics écrits pour voir clair avant d'agir."),
    '@growth': ("Growth Part-Time", "/growth", "Tous les leviers, pilotés par un seul growth, chaque semaine."),
    '@article-lm': ("Lead magnet&nbsp;: ce qui marche en B2B", "/actualites/lead-magnet", "Pourquoi le PDF ne convertit plus, et quoi faire à la place."),
}

ARROW = '<svg class="arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 13 13 3M13 3H5M13 3v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
CHEV = '<svg viewBox="0 0 9 12" fill="none" aria-hidden="true"><path d="M2 1.5 6.5 6 2 10.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'

_I = {
    'target': '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".6"/>',
    'message': '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
    'layers': '<path d="M12 3 3 8l9 5 9-5z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
    'calendar': '<path d="M4 6h16v14H4zM4 10h16M9 3v4M15 3v4"/>',
    'chart': '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    'refresh': '<path d="M4 12a8 8 0 0 1 13.7-5.6M20 12a8 8 0 0 1-13.7 5.6"/><path d="M18 3v4h-4M6 21v-4h4"/>',
    'users': '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5.2a3 3 0 0 1 0 5.6M18 14.4c1.8.8 3 2.6 3 4.6"/>',
    'mail': '<path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/>',
    'shield': '<path d="M12 3 5 6v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V6z"/><path d="m9 12 2 2 4-4"/>',
    'split': '<path d="M6 3v6a6 6 0 0 0 6 6M18 3v6a6 6 0 0 1-6 6v6"/>',
    'compass': '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    'linkedin': '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 11v5M8 8v.01M12 16v-5M12 13c0-1.2 1-2 2-2s2 .8 2 2v3"/>',
    'cursor': '<path d="m5 3 6 16 2.4-6.6L20 10z"/>',
    'search': '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    'spark': '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M6.3 17.7l2.5-2.5M15.2 8.8l2.5-2.5"/>',
    'gift': '<path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13"/><path d="M12 7c-2-3-5-3-5-1s3 1 5 1c2 0 5 1 5-1s-3-2-5 1z"/>',
    'leaf': '<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14z"/><path d="M5 19 13 11"/>',
    'plus': '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    'database': '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
    'bell': '<path d="M6 16v-5a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
    'link': '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    'sliders': '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    'pipeline': '<path d="M3 5h18l-6 7v6l-6 2v-8z"/>',
    'pin': '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    'coin': '<circle cx="12" cy="12" r="9"/><path d="M15 9.2A3.5 3.5 0 0 0 9.5 10c0 3 5.5 1.5 5.5 4.3a3.5 3.5 0 0 1-5.8.8M12 6v2M12 16v2"/>',
    'check': '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
}

def icon(name):
    return ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" '
            'stroke-linejoin="round" aria-hidden="true">%s</svg>' % _I[name])

PALETTES = {
    'butter': ['#FFF9DE', '#FFF1A8', '#FFE98A', '#FFE066', '#FFD84D'],
    'lav': ['#F5EEFF', '#E9D7FF', '#DCC6FF', '#CDB2FF', '#BFA0FF'],
    'mint': ['#EFFBF4', '#D9F5E5', '#C3EED6', '#A9E6C4', '#8FE0B5'],
    'pink': ['#FDF1FF', '#F9E0FD', '#F4CBFA', '#EEB5F8', '#E88BF7'],
}

def tiles(palette, seed):
    rnd = random.Random(seed)
    cols = PALETTES[palette]
    rects = ''.join('<rect x="%d" y="%d" width="1.002" height="1.002" fill="%s"/>' % (x, y, rnd.choice(cols))
                    for y in range(10) for x in range(16))
    return '<svg class="tiles" viewBox="0 0 16 10" preserveAspectRatio="xMidYMid slice" aria-hidden="true">%s</svg>' % rects

def visual(kind):
    if kind == 'plan':
        return ('<div class="ui ui-card" aria-hidden="true"><b>Plan à 90 jours</b>'
                '<div class="plan-row"><span>Cibles</span><s style="--s:0%;--e:30%"></s></div>'
                '<div class="plan-row"><span>Messages</span><s style="--s:12%;--e:46%"></s></div>'
                '<div class="plan-row"><span>Canaux</span><s style="--s:26%;--e:72%"></s></div>'
                '<div class="plan-row"><span>Actions</span><s style="--s:34%;--e:100%"></s></div></div>')
    if kind == 'seq':
        return ('<div class="ui seq" aria-hidden="true"><span><em>J0</em>Email d\'approche</span><span><em>J3</em>Invitation LinkedIn</span>'
                '<span><em>J7</em>Relance personnalisée</span><span class="reply">Réponse reçue → rendez-vous</span></div>')
    if kind == 'post':
        return ('<div class="ui ui-card post" aria-hidden="true"><span class="post-h"><img src="/images/celien-boillot-112.webp" alt="" width="112" height="112">Votre fondateur</span>'
                '<i style="width:92%"></i><i style="width:74%"></i><i style="width:84%"></i><span class="post-tag">SEO · GEO · EEAT</span></div>')
    if kind == 'flow':
        return ('<div class="ui flow" aria-hidden="true"><span>Signal d\'intérêt</span><span>Enrichissement</span><span>Séquence personnalisée</span>'
                '<span>Relances selon le comportement</span><span>Alerte à votre équipe</span><span>Rendez-vous</span></div>')
    if kind == 'score':
        rows = [("Directrice financière", "SaaS", 92), ("Associé", "Cabinet de conseil", 78), ("Responsable RH", "Industrie", 54), ("Office manager", "Agence", 21)]
        lis = ''.join('<li class="sp-sc%s"><span><b>%s</b><small>%s</small></span><s style="--w:%d%%"></s><em>%d</em></li>'
                      % (' hot' if i == 0 else '', n, c, v, v) for i, (n, c, v) in enumerate(rows))
        return '<div class="ui ui-card sp-ui" aria-hidden="true"><div class="ui-h"><b>Prospects à appeler</b><span class="chip">Aujourd\'hui</span></div><ul>%s</ul></div>' % lis
    if kind == 'crm':
        rows = [("Prospection", 46), ("Inbound", 28), ("Recommandation", 18), ("Publicité", 8)]
        lis = ''.join('<li class="bar">%s<s style="--w:%d%%"></s></li>' % (n, v * 2) for n, v in rows)
        return ('<div class="ui ui-card sp-ui" aria-hidden="true"><div class="ui-h"><b>Origine des clients signés</b><span class="chip ok">À jour</span></div>'
                '<ul>%s</ul></div>' % lis)
    if kind == 'ads':
        return ('<div class="ui ui-card sp-ui" aria-hidden="true"><div class="ui-h"><b>Campagne LinkedIn</b><span class="chip ok">Active</span></div>'
                '<div class="chart"><i style="--h:30%"></i><i style="--h:42%"></i><i style="--h:38%"></i><i style="--h:55%"></i><i style="--h:62%"></i><i style="--h:78%"></i></div>'
                '<ul class="sp-kpi"><li><small>Clics</small><b>Suivis</b></li><li><small>Demandes</small><b>Suivies</b></li><li class="on"><small>Rendez-vous</small><b>L\'objectif</b></li></ul></div>')
    raise ValueError(kind)

def h2(parts, hid):
    return '<h2 class="h2" id="%s">%s <span class="accent">%s</span></h2>' % (hid, parts[0], parts[1])

def strip(t):
    return re.sub(r'<[^>]+>', '', t)

def load():
    return json.load(open(DATA, encoding='utf-8'))['services']

def url(s):
    return BASE + s['slug']

def btn(href, label, cls='btn'):
    return '<a class="%s" href="%s"><i aria-hidden="true"></i>%s%s</a>' % (cls, href, label, ARROW)

def page(s, by_slug, cas, show_cas=True):
    k = s['slug']
    out = ['<main class="site-page hm sp" data-page="svc-%s" hidden>' % k]
    # haut de page
    out.append('''
  <section class="sp-hero" aria-labelledby="h1">
    <div class="hero-grid" aria-hidden="true"></div>
    <div class="frame sp-hero-f">
      <div class="sp-hero-t">
        <h1 class="sp-h1" id="h1">%s <span class="accent">%s</span></h1>
        <p class="lead">%s</p>
        <div class="hero-cta">%s<a class="go" href="/growth">Découvrir la formule tout-en-un %s</a></div>
        <p class="micro">30 min offertes · Vous repartez avec 2 à 3 pistes concrètes</p>
      </div>
      <div class="mosaic sp-vis">%s%s</div>
    </div>
  </section>''' % (s['h1'][0], s['h1'][1], s['lead'], btn('/contact#formulaire', 'Faire le point avec Célien'), CHEV,
                   tiles(s['tiles'], k), visual(s['vis'])))
    # définition
    out.append('''
  <section class="row" aria-labelledby="sp-def">
    <div class="frame">
      <div class="sec-head x">%s</div>
      <div class="sp-def">
        <div class="sp-def-t">%s</div>
        <div class="sp-signs"><h3>%s</h3><ul>%s</ul></div>
      </div>
    </div>
  </section>''' % (h2(s['def_h2'], 'sp-def'), ''.join('<p>%s</p>' % p for p in s['def_p']), s['signs_h3'],
                   ''.join('<li>%s</li>' % x for x in s['signs'])))
    # livrables
    out.append('''
  <section class="row" aria-labelledby="sp-del">
    <div class="frame">
      <div class="sec-head x">%s</div>
      <div class="sp-grid">%s</div>
    </div>
  </section>''' % (h2(s['del_h2'], 'sp-del'), ''.join(
        '<div class="sp-cell"><span class="ic">%s</span><h3>%s</h3><p>%s</p></div>' % (icon(i), t, p) for i, t, p in s['deliver'])))
    # déroulé
    out.append('''
  <section class="row" aria-labelledby="sp-steps">
    <div class="frame">
      <div class="sec-head x">%s<p class="lead">Un déroulé type, adapté à votre situation après le diagnostic.</p></div>
      <ol class="sp-steps">%s</ol>
    </div>
  </section>''' % (h2(s['steps_h2'], 'sp-steps'), ''.join(
        '<li><span class="sp-k">%s</span><h3>%s</h3><p>%s</p></li>' % tuple(st) for st in s['steps'])))
    # pont vers Growth Part-Time
    core = ['strategie-acquisition', 'prospection-outbound', 'inbound-marketing', 'automatisation-marketing']
    chips = ''.join('<li%s><a href="%s">%s</a></li>' % (' class="on"' if c == k else '', url(by_slug[c]), by_slug[c]['nom']) for c in core)
    petit = {'lead-scoring': 'lead scoring', 'crm-tracking': 'CRM et tracking', 'publicite-ads': 'publicité'}
    opt = ', '.join('<a href="%s"%s>%s</a>' % (url(by_slug[c]), ' class="on"' if c == k else '', n) for c, n in petit.items())
    od = ('<a class="go" href="/services/offre-decouverte">Tester d\'abord&nbsp;: 28 jours, 500&nbsp;€&nbsp;HT %s</a>' % CHEV) if s.get('bridge_od') else ''
    out.append('''
  <section class="row dark sp-bridge" aria-labelledby="sp-gpt">
    <div class="frame sp-bridge-f">
      <div class="sp-bridge-t">
        <h2 class="h2" id="sp-gpt">Ce levier entre souvent dans <span class="accent">une formule tout-en-un</span></h2>
        <p class="lead">%s</p>
        <div class="hero-cta">%s%s</div>
      </div>
      <div class="sp-formula">
        <p class="sp-formula-h"><b>Growth Part-Time</b><span>Un growth dédié, chaque semaine</span></p>
        <ul class="sp-chips">%s</ul>
        <p class="sp-formula-n">Selon vos besoins&nbsp;: %s.</p>
        <p class="sp-formula-f">Un seul interlocuteur · Sans engagement</p>
        <span class="sp-formula-m cely-spot" data-cely="point" data-cely-threshold="0.2" aria-hidden="true"></span>
      </div>
    </div>
  </section>''' % (s['bridge'], btn('/growth', 'Découvrir Growth Part-Time', 'btn btn-light'), od, chips, opt))
    # cas clients
    if show_cas and s.get('cas'):
        cards = []
        for slug in s['cas']:
            c = cas[slug]
            cards.append('<a class="sp-cas-c" href="/cas-clients/%s"><img src="%s" alt="%s" width="%d" height="%d" loading="lazy" decoding="async" style="height:%dpx;width:auto">'
                         '<span class="sp-cas-a">%s</span><span class="go">Lire le cas client %s</span></a>'
                         % (slug, c['logo']['src'], c['client'], c['logo']['w'], c['logo']['h'], min(c['logo']['h_page'], 40), c['accroche'], CHEV))
        out.append('''
  <section class="row" aria-labelledby="sp-cas">
    <div class="frame">
      <div class="sec-head x"><h2 class="h2" id="sp-cas">Sur le terrain, <span class="accent">en ce moment</span></h2><p class="lead">Des missions en cours, racontées telles qu'elles avancent.</p></div>
      <div class="sp-cas">%s</div>
    </div>
  </section>''' % ''.join(cards))
    # FAQ
    qa = ''.join('<details class="gpt-faq-item"%s><summary>%s<span class="pm" aria-hidden="true"></span></summary><p class="gpt-faq-answer">%s</p></details>'
                 % (' open' if i == 0 else '', q, a) for i, (q, a) in enumerate(s['faq']))
    out.append('''
  <section class="row" aria-labelledby="sp-faq">
    <div class="frame faq">
      <div class="faq-side"><div><h2 class="h2" id="sp-faq">Questions fréquentes</h2><p>Une autre question&nbsp;? Posez-la directement à Célien.</p>%s</div></div>
      <div class="qa">%s</div>
    </div>
  </section>''' % (btn('/contact#formulaire', 'Poser ma question à Célien', 'btn btn-light'), qa))
    # autres leviers
    cards = []
    for r in s['related']:
        if r.startswith('@'):
            n, u, d = SPECIAUX[r]
        else:
            n, u, d = by_slug[r]['nom_long'], url(by_slug[r]), CARTE[r]
        cards.append('<a href="%s"><h3>%s</h3><p>%s</p><span class="go">En savoir plus %s</span></a>' % (u, n, d, CHEV))
    out.append('''
  <section class="row" aria-labelledby="sp-more">
    <div class="frame">
      <div class="sec-head x"><h2 class="h2" id="sp-more">Les autres <span class="accent">leviers</span></h2><a class="go" href="/services">Voir tous les services %s</a></div>
      <div class="more sp-more">%s</div>
    </div>
  </section>

  <!--CTA_FINAL-->

</main>''' % (CHEV, ''.join(cards)))
    return ''.join(out)

def generate(H, OG, ORG_ID, show_cas=True):
    svcs = load()
    by_slug = {s['slug']: s for s in svcs}
    cas = {c['slug']: c for c in json.load(open(CAS, encoding='utf-8'))['cas']}
    mains, pages = {}, []
    for s in svcs:
        u = url(s)
        mains['svc-' + s['slug']] = page(s, by_slug, cas, show_cas)
        ld = {"@type": "Service", "@id": SITE + u + "#service", "name": s['nom_long'], "serviceType": s['service_type'],
              "description": strip(s['desc']), "provider": {"@id": ORG_ID}, "areaServed": {"@type": "Country", "name": "France"},
              "audience": {"@type": "BusinessAudience", "name": "Startups et PME B2B"}, "url": SITE + u,
              "isRelatedTo": {"@id": SITE + "/growth#service"}}
        pages.append(dict(key='svc-' + s['slug'], out='services/%s.html' % s['slug'], path=u, prio='0.8', freq='monthly',
                          img=OG + 'og-services.png', crumbs=[H, ("Services", "/services"), (strip(s['nom_long']), u)],
                          title=s['title'], desc=s['desc'], ld=[ld]))
    return mains, pages, svcs
