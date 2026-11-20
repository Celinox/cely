"""
Cas clients : génère la page mère /cas-clients et une page détail par cas
à partir de la source unique src/cas-clients.json (appelé par build.py).

Ajouter un cas = ajouter une entrée dans src/cas-clients.json, puis lancer
python3 scripts/build.py. Aucun composant à toucher.

Deux gabarits de page détail, choisis par le champ « offre » :
  - decouverte : court et visuel (client, hypothèse, lancé, appris, appel à l'action)
  - growth     : développé (contexte, enjeux, démarche, leviers, résultats, suite)

Un texte non confirmé s'écrit {"t": "...", "a_valider": "source"} : la page
affiche la mention « À valider » et le build liste ces éléments.
"""
import json, os, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'src', 'cas-clients.json')
BASE = '/cas-clients'
OFFRES = {'decouverte': 'Offre découverte', 'growth': 'Offre Growth'}
FILTRES = [('tous', 'Tous'), ('growth', '<span class="cc-f-pre">Offre </span>Growth'), ('decouverte', '<span class="cc-f-pre">Offre d</span><span class="cc-f-short">D</span>écouverte')]
STATUTS = {'en_cours': 'En cours', 'termine': 'Terminé'}
ARROW = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 13 13 3M13 3H5M13 3v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'

A_VALIDER = []          # (page, texte, source), rempli à chaque build


def load():
    return json.load(open(DATA, encoding='utf-8'))['cas']


def e(v):
    return html.escape(v, quote=True)


def raw(v):
    """Texte brut d'une valeur (chaîne ou {"t", "a_valider"})."""
    return v['t'] if isinstance(v, dict) else v


def t(v, page):
    """Texte échappé, suivi de la mention « À valider » si la valeur n'est pas confirmée."""
    if isinstance(v, dict):
        if v.get('a_valider'):
            A_VALIDER.append((page, v['t'], v['a_valider']))
            return e(v['t']) + ' <span class="cc-av">À valider</span>'
        return e(v['t'])
    return e(v)


def lvl(statut, extra=''):
    """Pastille de statut. « En cours » : style niveau de jeu vidéo (animée, lumineuse)."""
    live = statut == 'en_cours'
    px = '<span class="cc-lvl-px" aria-hidden="true"><i></i><i></i><i></i></span>' if live else '<span class="cc-lvl-ok" aria-hidden="true"></span>'
    return '<span class="cc-lvl %s%s"><span class="cc-lvl-k" aria-hidden="true">%s</span>%s<span class="cc-lvl-t">%s</span></span>' % (
        'is-live' if live else 'is-done', extra, 'LVL' if live else 'GG', px, STATUTS[statut])


def tags(c, page):
    return ''.join('<li>%s</li>' % t(x, page) for x in c.get('etiquettes', []))


def url(c):
    return '%s/%s' % (BASE, c['slug'])


# ------------------------------------------------------------------ page mère
def card(c, i):
    page = url(c)
    lg = c['logo']
    return (
        '<li class="cc-item" data-offre="%(offre)s" style="--i:%(i)d">'
        '<a class="cc-card" href="%(url)s">'
        '<div class="cc-card-top"><img class="cc-card-logo" src="%(src)s" alt="" width="%(w)d" height="%(h)d" style="--lh:%(hc)dpx" loading="lazy" decoding="async">%(lvl)s</div>'
        '<span class="cc-card-name">%(client)s</span>'
        '<span class="cc-card-hook">%(hook)s</span>'
        '<div class="cc-card-foot"><span class="cc-offre">%(offre_l)s</span><ul class="cc-tags" aria-label="Thèmes">%(tags)s</ul>'
        '<span class="cc-card-go" aria-hidden="true">%(arrow)s</span></div>'
        '</a></li>'
    ) % dict(offre=c['offre'], i=i, url=page, src=lg['src'], w=lg['w'], h=lg['h'], hc=lg.get('h_carte', 30), lvl=lvl(c['statut']),
             client=e(c['client']), hook=t(c['accroche'], page), offre_l=OFFRES[c['offre']], tags=tags(c, page), arrow=ARROW)


def main_index(cas, cfg):
    counts = {'tous': len(cas), 'growth': 0, 'decouverte': 0}
    for c in cas:
        counts[c['offre']] += 1
    filtres = ''.join(
        '<a class="cc-f" href="%s" data-f="%s"%s><span>%s</span><span class="cc-f-n">%d</span></a>' % (
            BASE if k == 'tous' else '%s?offre=%s' % (BASE, k), k, ' aria-current="true"' if k == 'tous' else '', l, counts[k])
        for k, l in FILTRES)
    empties = ''.join(empty(k) for k in ('growth', 'decouverte') if counts[k] == 0)
    return '''<main class="site-page cc-page" data-page="cas-clients" hidden>
  <section class="cc-hero" aria-labelledby="ccH1">
    <div class="section-wrap">
      <span class="section-label">Cas clients</span>
      <h1 class="cc-h1" id="ccH1">Ils testent leur marché <span>avec Cely</span></h1>
      <p class="cc-lede">Pour chaque client&nbsp;: ce qu'on a lancé, pour qui, et ce qu'on en apprend. Les résultats s'affichent quand ils sont mesurés.</p>
    </div>
  </section>

  <section class="cc-list" aria-label="Liste des cas clients">
    <div class="section-wrap">
      <nav class="cc-filter" aria-label="Filtrer par offre">%(filtres)s</nav>
      <p class="cc-count" id="ccCount" aria-live="polite">%(n)d cas affichés</p>
      <ul class="cc-grid" id="ccGrid">%(cards)s</ul>
      %(empties)s
    </div>
  </section>

  %(cta)s

  <script>(function(){ "use strict";
    var grid = document.getElementById('ccGrid'); if(!grid) return;
    var items = [].slice.call(grid.children), links = [].slice.call(document.querySelectorAll('.cc-f'));
    var empties = [].slice.call(document.querySelectorAll('.cc-empty')), count = document.getElementById('ccCount');
    function apply(f, push){
      if(['tous','growth','decouverte'].indexOf(f) < 0) f = 'tous';
      var n = 0;
      items.forEach(function(li){ var on = f === 'tous' || li.getAttribute('data-offre') === f; li.hidden = !on; if(on) n++; });
      links.forEach(function(a){ if(a.getAttribute('data-f') === f) a.setAttribute('aria-current','true'); else a.removeAttribute('aria-current'); });
      empties.forEach(function(el){ el.hidden = el.getAttribute('data-f') !== f; });
      grid.hidden = n === 0;
      count.textContent = n === 0 ? 'Aucun cas pour ce filtre' : n + (n > 1 ? ' cas affichés' : ' cas affiché');
      if(push){ var u = f === 'tous' ? location.pathname : location.pathname + '?offre=' + f; history.replaceState(null, '', u); }
    }
    links.forEach(function(a){ a.addEventListener('click', function(ev){
      if(ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button) return;
      ev.preventDefault(); apply(a.getAttribute('data-f'), true);
    }); });
    apply(new URLSearchParams(location.search).get('offre') || 'tous', false);
  })();</script>
</main>''' % dict(filtres=filtres, n=len(cas), cards=''.join(card(c, i) for i, c in enumerate(cas)), empties=empties, cta=cta_final(cfg, 'index'))


def empty(f):
    if f == 'growth':
        h, p, a1, a2 = ('Le premier cas Growth Part-Time peut être le vôtre',
                        "Aucun accompagnement Growth Part-Time n'est encore publié ici. Un growth dédié chaque semaine, et votre histoire en tête de cette page.",
                        ('/contact#formulaire', 'Faire le point avec Célien'), ('/growth', 'Découvrir Growth Part-Time'))
    else:
        h, p, a1, a2 = ("Le premier test de marché peut être le vôtre",
                        "Aucun cas Offre découverte n'est encore publié ici.",
                        ('/contact#formulaire', 'Faire le point avec Célien'), ('/services/offre-decouverte', "Voir l'offre découverte"))
    return '''<div class="cc-empty" data-f="%s" hidden>
        <span class="cc-empty-slot" aria-hidden="true"><span class="cely-spot cc-empty-cely" data-cely="wave" data-cely-threshold="0.2"></span></span>
        <div class="cc-empty-txt">
          <span class="cc-lvl is-locked"><span class="cc-lvl-k" aria-hidden="true">LVL</span><span class="cc-lvl-t">Place libre</span></span>
          <h2 class="cc-empty-h">%s</h2>
          <p>%s</p>
          <div class="cc-empty-actions"><a href="%s" class="hp-btn"><span class="hp-btn-dot" aria-hidden="true"></span>%s%s</a><a href="%s" class="btn-text-cely">%s%s</a></div>
        </div>
      </div>''' % (f, e(h), e(p), a1[0], e(a1[1]), ARROW, a2[0], e(a2[1]), ARROW.replace('1.8', '1.6'))


def cta_final(cfg, kind):
    if kind == 'growth':
        h, p = 'Un growth dans votre équipe, dès le premier mois', "30 minutes avec Célien pour voir ce qu'un accompagnement changerait chez vous."
        sec = ('/growth', 'Découvrir Growth Part-Time')
    else:
        h, p = "Testez votre marché avant d'investir", "300 décideurs de vos cibles, des messages écrits un par un, et une réponse sur votre marché en 28 jours."
        sec = ('/services/offre-decouverte', "Voir l'offre découverte")
    return '''<section class="hp-sec hp-dark hp-final cc-final" aria-labelledby="ccFinalTitle">
    <div class="section-wrap hp-final-wrap">
      <h2 class="hp-final-h2 cc-final-h2" id="ccFinalTitle">%s</h2>
      <p class="hp-final-text">%s</p>
      <div class="hp-final-actions">
        <a href="%s" target="_blank" rel="noopener" class="hp-btn hp-btn-light hp-btn-xl"><span class="hp-btn-dot" aria-hidden="true"></span>Réserver un appel<span class="sr-only"> (ouvre un nouvel onglet)</span>%s</a>
        <a href="%s" class="btn-text-cely cc-final-link">%s%s</a>
      </div>
    </div>
  </section>''' % (e(h), e(p), cfg['RDV_URL'], ARROW, sec[0], e(sec[1]), ARROW.replace('1.8', '1.6'))


# ------------------------------------------------------------------ pages détail
def hero(c, page, one):
    lg = c['logo']
    return '''<section class="cc-d-hero" aria-labelledby="ccDH1">
    <div class="section-wrap">
      <div class="cc-d-meta"><a href="%(base)s" class="cc-back"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13 8H3m0 0 4-4M3 8l4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Tous les cas</a>%(lvl)s</div>
      <img class="cc-d-logo" src="%(src)s" alt="Logo %(client)s" width="%(w)d" height="%(h)d" style="--lh:%(hp)dpx">
      <h1 class="cc-d-h1" id="ccDH1">%(client)s</h1>
      <p class="cc-d-one">%(one)s</p>
      <div class="cc-d-facts">
        <a class="cc-offre" href="%(base)s?offre=%(offre)s">%(offre_l)s</a>
        <ul class="cc-tags" aria-label="Thèmes">%(tags)s</ul>
        <span class="cc-d-since">Depuis %(debut)s</span>
      </div>
    </div>
  </section>''' % dict(base=BASE, lvl=lvl(c['statut'], ' is-enter'), src=lg['src'], client=e(c['client']), w=lg['w'], h=lg['h'], hp=lg.get('h_page', 44),
                       one=one, offre=c['offre'], offre_l=OFFRES[c['offre']], tags=tags(c, page), debut=e(c['debut']))


def progress(d, page, statut):
    cur = raw(d.get('etape_actuelle', ''))
    steps, seen = [], False
    for s in d.get('etapes', []):
        state = 'is-now' if s['nom'] == cur else ('is-next' if seen else 'is-done')
        if s['nom'] == cur:
            seen = True
        if statut == 'termine':
            state = 'is-done'
        steps.append('<li class="cc-step %s"%s><span class="cc-step-bar" aria-hidden="true"></span><span class="cc-step-n">%s</span><span class="cc-step-d">%s</span></li>' % (
            state, ' aria-current="step"' if state == 'is-now' else '', e(s['nom']), e(s['dates'])))
    if not steps:
        return ''
    now = '' if statut == 'termine' or not cur else '<p class="cc-now">Étape en cours&nbsp;: <strong>%s</strong></p>' % t(d['etape_actuelle'], page)
    return '<ol class="cc-steps" aria-label="Avancement">%s</ol>%s' % (''.join(steps), now)


def bloc_eeat(b, page):
    piliers = ''.join('<li class="cc-pil"><span class="cc-pil-l" aria-hidden="true">%s</span><h3>%s</h3><p>%s</p></li>' % (e(p['l']), e(p['nom']), t(p['t'], page)) for p in b['piliers'])
    conv = b.get('conversion')
    conv_html = '<div class="cc-conv"><span class="cc-conv-ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M4 5h16l-6 7v6l-4 2v-8L4 5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></span><div><h3>%s</h3><p>%s</p></div></div>' % (e(conv['titre']), t(conv['t'], page)) if conv else ''
    st = '<p class="cc-bloc-status">%s</p>' % t(b['statut'], page) if b.get('statut') else ''
    return '''<section class="cc-sec cc-eeat" aria-labelledby="ccEeat">
    <div class="section-wrap">
      <div class="cc-sec-head"><h2 class="cc-h2" id="ccEeat">%s</h2><p class="cc-sec-lede">%s</p></div>
      <ul class="cc-pils">%s</ul>
      %s%s
    </div>
  </section>''' % (e(b['titre']), t(b['intro'], page), piliers, conv_html, st)


def page_decouverte(c, cas, cfg):
    page, d = url(c), c['decouverte']
    chiffres = ''.join('<li><span class="cc-fig-n">%s</span><span class="cc-fig-l">%s</span></li>' % (t(x['n'], page), t(x['label'], page)) for x in d.get('chiffres', []))
    tot = sum(x['n'] for x in d.get('cibles', [])) or 1
    bar = ''.join('<span class="cc-mix-seg" style="--w:%.2f%%;--c:var(--%s)"></span>' % (x['n'] * 100 / tot, col) for x, col in zip(d.get('cibles', []), ('violet-3', 'pink', 'violet', 'lavender', 'prune')))
    legend = ''.join('<li><i style="--c:var(--%s)" aria-hidden="true"></i><span>%s</span><b>%d</b></li>' % (col, e(x['nom']), x['n']) for x, col in zip(d.get('cibles', []), ('violet-3', 'pink', 'violet', 'lavender', 'prune')))
    mix = '<div class="cc-mix"><p class="cc-mix-h">Répartition des contacts par cible</p><div class="cc-mix-bar" aria-hidden="true">%s</div><ul class="cc-mix-legend">%s</ul></div>' % (bar, legend) if d.get('cibles') else ''
    actions = ''.join('<li>%s</li>' % t(a, page) for a in d.get('actions', []))
    blocs = ''.join(bloc_eeat(b, page) for b in d.get('blocs', []) if b['type'] == 'eeat')
    if d.get('appris'):
        appris = '<ul class="cc-learn">%s</ul>' % ''.join('<li>%s</li>' % t(a, page) for a in d['appris'])
    else:
        appris = '<p class="cc-wait"><span class="cc-wait-dot" aria-hidden="true"></span>%s</p>' % t(d['appris_attente'], page)
    nxt = cas[(cas.index(c) + 1) % len(cas)]
    nav = '' if nxt is c else '<nav class="cc-next" aria-label="Cas suivant"><div class="section-wrap"><a href="%s"><span>Cas suivant</span><b>%s</b>%s</a></div></nav>' % (url(nxt), e(nxt['client']), ARROW)
    return '''<main class="site-page cc-page cc-detail" data-page="cas-%(slug)s" hidden>
  %(hero)s

  <section class="cc-sec cc-hyp" aria-labelledby="ccHyp">
    <div class="section-wrap cc-hyp-grid">
      <h2 class="cc-h2 cc-h2-side" id="ccHyp">L'hypothèse testée</h2>
      <p class="cc-hyp-t">%(hyp)s</p>
    </div>
  </section>

  <section class="cc-sec cc-launch" aria-labelledby="ccLaunch">
    <div class="section-wrap">
      <div class="cc-sec-head"><h2 class="cc-h2" id="ccLaunch">Ce qu'on a lancé</h2><p class="cc-sec-lede">%(intro)s</p></div>
      <ul class="cc-figs">%(chiffres)s</ul>
      %(mix)s
      <ul class="cc-actions">%(actions)s</ul>
    </div>
  </section>

  %(blocs)s

  <section class="cc-sec cc-learned" aria-labelledby="ccLearn">
    <div class="section-wrap">
      <div class="cc-sec-head"><h2 class="cc-h2" id="ccLearn">Ce qu'on a appris</h2></div>
      %(appris)s
      %(progress)s
    </div>
  </section>

  %(nav)s
  %(cta)s
</main>''' % dict(slug=c['slug'], hero=hero(c, page, t(d['client_phrase'], page)), hyp=t(d['hypothese'], page), intro=t(d['lance_intro'], page),
                  chiffres=chiffres, mix=mix, actions=actions, blocs=blocs, appris=appris, progress=progress(d, page, c['statut']),
                  cta=cta_final(cfg, 'decouverte'), nav=nav)


def page_growth(c, cas, cfg):
    """Gabarit Offre Growth : contexte, enjeux, démarche par étapes, leviers, résultats, suite."""
    page, g = url(c), c['growth']
    enjeux = ''.join('<li>%s</li>' % t(x, page) for x in g.get('enjeux', []))
    demarche = ''.join('<li class="cc-gstep"><span class="cc-gstep-when">%s</span><h3>%s</h3><p>%s</p></li>' % (t(s['quand'], page), t(s['titre'], page), t(s['texte'], page)) for s in g.get('demarche', []))
    leviers = ''.join('<li class="cc-lev"><h3>%s</h3><p>%s</p></li>' % (t(l['nom'], page), t(l['texte'], page)) for l in g.get('leviers', []))
    if g.get('resultats'):
        res = '<ul class="cc-figs">%s</ul>' % ''.join('<li><span class="cc-fig-n">%s</span><span class="cc-fig-l">%s</span></li>' % (t(r['n'], page), t(r['label'], page)) for r in g['resultats'])
    else:
        res = '<p class="cc-wait"><span class="cc-wait-dot" aria-hidden="true"></span>%s</p>' % t(g.get('resultats_attente', 'Les résultats seront publiés une fois mesurés.'), page)
    suite = ''.join('<p>%s</p>' % t(x, page) for x in g.get('suite', []))
    nxt = cas[(cas.index(c) + 1) % len(cas)]
    nav = '' if nxt is c else '<nav class="cc-next" aria-label="Cas suivant"><div class="section-wrap"><a href="%s"><span>Cas suivant</span><b>%s</b>%s</a></div></nav>' % (url(nxt), e(nxt['client']), ARROW)
    return '''<main class="site-page cc-page cc-detail cc-detail-growth" data-page="cas-%(slug)s" hidden>
  %(hero)s

  <section class="cc-sec" aria-labelledby="ccCtx">
    <div class="section-wrap cc-hyp-grid">
      <h2 class="cc-h2 cc-h2-side" id="ccCtx">Contexte</h2>
      <div class="cc-prose">%(contexte)s</div>
    </div>
  </section>

  <section class="cc-sec cc-stakes" aria-labelledby="ccStakes">
    <div class="section-wrap cc-hyp-grid">
      <h2 class="cc-h2 cc-h2-side" id="ccStakes">Enjeux</h2>
      <ul class="cc-actions">%(enjeux)s</ul>
    </div>
  </section>

  <section class="cc-sec cc-launch" aria-labelledby="ccSteps">
    <div class="section-wrap">
      <div class="cc-sec-head"><h2 class="cc-h2" id="ccSteps">La démarche, étape par étape</h2></div>
      <ol class="cc-gsteps">%(demarche)s</ol>
    </div>
  </section>

  <section class="cc-sec cc-eeat" aria-labelledby="ccLev">
    <div class="section-wrap">
      <div class="cc-sec-head"><h2 class="cc-h2" id="ccLev">Les leviers activés</h2></div>
      <ul class="cc-levs">%(leviers)s</ul>
    </div>
  </section>

  <section class="cc-sec cc-learned" aria-labelledby="ccRes">
    <div class="section-wrap">
      <div class="cc-sec-head"><h2 class="cc-h2" id="ccRes">Résultats</h2></div>
      %(res)s
    </div>
  </section>

  <section class="cc-sec cc-tight" aria-labelledby="ccNext">
    <div class="section-wrap cc-hyp-grid">
      <h2 class="cc-h2 cc-h2-side" id="ccNext">La suite</h2>
      <div class="cc-prose">%(suite)s</div>
    </div>
  </section>

  %(nav)s
  %(cta)s
</main>''' % dict(slug=c['slug'], hero=hero(c, page, t(g['client_phrase'], page)),
                  contexte=''.join('<p>%s</p>' % t(x, page) for x in g.get('contexte', [])), enjeux=enjeux, demarche=demarche,
                  leviers=leviers, res=res, suite=suite, cta=cta_final(cfg, 'growth'), nav=nav)


# ------------------------------------------------------------------ intégration au build
def generate(cfg, H, OG, ORGANIZATION, data_path=None):
    """Renvoie (mains, pages) : le HTML des <main> et les entrées PAGES correspondantes."""
    global DATA
    if data_path:
        DATA = data_path
    del A_VALIDER[:]
    cas = load()
    crumb = ("Cas clients", BASE)
    mains = {'cas-clients': main_index(cas, cfg)}
    pages = [dict(key='cas-clients', out='cas-clients.html', path=BASE, prio='0.8', freq='weekly', cta=False,
                  crumbs=[H, crumb], img=OG + 'og-cas-clients.png',
                  title="Cas clients : tests de marché et growth B2B | Cely",
                  desc="Nos clients, ce qu'on a lancé pour eux et ce qu'on en apprend. Filtrez par offre et voyez comment Cely teste un marché B2B avant d'investir.",
                  ld=[ORGANIZATION])]
    for c in cas:
        key = 'cas-' + c['slug']
        mains[key] = page_decouverte(c, cas, cfg) if c['offre'] == 'decouverte' else page_growth(c, cas, cfg)
        s = c['seo']
        pages.append(dict(key=key, out='cas-clients/%s.html' % c['slug'], path=url(c), prio='0.7', freq='weekly', cta=False,
                          crumbs=[H, crumb, (c['client'], url(c))], img=OG + s['og'], title=s['title'], desc=s['desc'], ld=[ORGANIZATION]))
    return mains, pages, list(A_VALIDER)
