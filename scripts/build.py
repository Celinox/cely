#!/usr/bin/env python3
"""
Génère une page HTML statique par URL à partir de la source unique src/site.html.

    python3 scripts/build.py

Pourquoi : chaque URL doit renvoyer SON propre HTML (title, description,
canonical, Open Graph, données structurées et contenu), sans dépendre du
JavaScript. Vercel sert ensuite ces fichiers avec "cleanUrls" (growth.html
→ /growth) et renvoie un vrai code 404 (404.html) pour toute URL inconnue.

À relancer après chaque modification de src/site.html, puis committer les
fichiers générés (index.html, growth.html, …, sitemap.xml).
"""
import json, os, re, sys, html, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src', 'site.html')
CONFIG = json.load(open(os.path.join(ROOT, 'src', 'site-config.json'), encoding='utf-8'))
SITE = 'https://www.celygrowth.com'
DEFAULT_IMG = SITE + '/images/cely-mark-ce.png'
TODAY = datetime.date.today().isoformat()

ORG_ID = SITE + "/#organisation"
PERSON_ID = SITE + "/#celien-boillot"
LOGO_HD = SITE + "/images/cely-logo-hd.png"
LOCAL_BUSINESS = {
    "@type": "LocalBusiness", "@id": ORG_ID,
    "name": "Cely",
    "description": "Agence growth marketing basée à Meylan (Grenoble), spécialisée dans l'accompagnement des startups B2B.",
    "url": SITE + "/", "logo": {"@type": "ImageObject", "url": LOGO_HD, "width": 1200, "height": 408},
    "image": SITE + "/images/og/og-accueil.png",
    "telephone": "+33756963783",
    "address": {"@type": "PostalAddress", "streetAddress": "6A Chemin des Prés", "postalCode": "38240",
                "addressLocality": "Meylan", "addressRegion": "Auvergne-Rhône-Alpes", "addressCountry": "FR"},
    "areaServed": {"@type": "Country", "name": "France"},
    "founder": {"@id": PERSON_ID},
    "sameAs": [CONFIG["LINKEDIN_URL"], "https://www.google.com/maps?cid=7863789155467383060"]
}
WEBSITE = {"@type": "WebSite", "@id": SITE + "/#site", "url": SITE + "/", "name": "Cely", "inLanguage": "fr-FR",
           "publisher": {"@id": ORG_ID}}
PERSON_CELIEN = {
    "@type": "Person", "@id": PERSON_ID, "name": "Célien Boillot",
    "jobTitle": "Fondateur de Cely",
    "image": SITE + "/images/celien-boillot-112.webp", "url": SITE + "/#histoire",
    "sameAs": [CONFIG["LINKEDIN_URL"]],
    "worksFor": {"@id": ORG_ID},
    "knowsAbout": ["Growth marketing", "Acquisition B2B", "Prospection B2B", "Référencement naturel", "Generative Engine Optimization"]
}
PUBLISHER = {"@id": ORG_ID}

def crumbs(*items):
    return {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": SITE + u} for i, (n, u) in enumerate(items)]}

ARTICLE_URL = '/actualites/inbound-vs-outbound'
BLOG_POSTING = {
    "@type": "BlogPosting", "@id": SITE + ARTICLE_URL + "#article",
    "headline": "Inbound vs outbound : quoi choisir pour son entreprise en 2026 ?",
    "description": "Inbound ou outbound marketing ? Avantages, canaux, ratios et méthode pour choisir la bonne stratégie B2B en 2026. Testez notre simulateur gratuit.",
    "image": SITE + "/images/og-inbound-vs-outbound.png", "inLanguage": "fr-FR",
    "datePublished": "2026-09-18", "dateModified": "2026-10-23",
    "mainEntityOfPage": {"@type": "WebPage", "@id": SITE + ARTICLE_URL},
    "author": {"@id": PERSON_ID},
    "publisher": PUBLISHER,
    "articleSection": "Growth marketing B2B",
    "keywords": ["inbound marketing", "outbound marketing", "prospection B2B", "stratégie d'acquisition"]
}

ARTICLE_IA_URL = '/actualites/referencement-ia'
BLOG_POSTING_IA = {
    "@type": "BlogPosting", "@id": SITE + ARTICLE_IA_URL + "#article",
    "headline": "Le référencement IA : la ruée vers l'or de 2026",
    "alternativeHeadline": "Référencement IA (GEO) : comment être cité par ChatGPT, Perplexity et les Aperçus IA",
    "description": "Le GEO, mythe ou réalité ? Ce que disent les études, ce qui change avec les Aperçus IA en France, et la méthode pour être cité par ChatGPT.",
    "image": SITE + "/images/og-referencement-ia.png", "inLanguage": "fr-FR",
    "datePublished": "2026-10-01", "dateModified": "2026-10-01",
    "mainEntityOfPage": {"@type": "WebPage", "@id": SITE + ARTICLE_IA_URL},
    "author": {"@id": PERSON_ID},
    "publisher": PUBLISHER,
    "articleSection": "GEO & visibilité IA",
    "keywords": ["référencement IA", "GEO", "Generative Engine Optimization", "SEO IA", "AEO", "Aperçus IA", "ChatGPT", "Perplexity"],
    "about": [{"@type": "Thing", "name": "Generative Engine Optimization"}, {"@type": "Thing", "name": "Référencement naturel"}],
    "mentions": [
        {"@type": "Organization", "name": "OpenAI", "sameAs": "https://openai.com"},
        {"@type": "Organization", "name": "Google", "sameAs": "https://www.google.com"},
        {"@type": "Organization", "name": "Perplexity", "sameAs": "https://www.perplexity.ai"},
        {"@type": "Organization", "name": "Webflow", "sameAs": "https://webflow.com"}],
    "citation": [
        {"@type": "ScholarlyArticle", "name": "GEO: Generative Engine Optimization", "author": "Aggarwal, Murahari, Rajpurohit, Kalyan, Narasimhan, Deshpande", "datePublished": "2024", "url": "https://arxiv.org/abs/2311.09735"},
        {"@type": "WebPage", "name": "AI features and your website — Google Search Central", "url": "https://developers.google.com/search/docs/appearance/ai-features"},
        {"@type": "WebPage", "name": "Overview of OpenAI Crawlers", "url": "https://developers.openai.com/api/docs/bots"},
        {"@type": "WebPage", "name": "Traffic is no longer a reliable growth metric — Growth Unhinged", "url": "https://www.growthunhinged.com/p/traffic-is-no-longer-reliable"},
        {"@type": "WebPage", "name": "Webflow 2x'd Sign-Ups from LLMs — Graphite", "url": "https://graphite.io/five-percent/case-studies/webflow-llm-signups"}]
}

SERVICE_GROWTH = {
    "@type": "Service", "@id": SITE + "/growth#service",
    "name": "Growth Part-Time", "serviceType": "Growth marketing à temps partagé",
    "description": "Un growth marketer intégré à votre équipe 6 à 10 heures par semaine : stratégie, outbound, inbound et automatisation. Sans engagement, premier mois satisfait ou remboursé.",
    "provider": {"@id": ORG_ID}, "areaServed": {"@type": "Country", "name": "France"},
    "audience": {"@type": "BusinessAudience", "name": "Startups et PME B2B"},
    "url": SITE + "/growth",
    "offers": {"@type": "Offer", "url": SITE + "/growth", "priceCurrency": "EUR", "price": "750",
               "availability": "https://schema.org/InStock",
               "priceSpecification": {"@type": "UnitPriceSpecification", "price": "750", "minPrice": "750", "priceCurrency": "EUR",
                                      "valueAddedTaxIncluded": False, "unitCode": "MON", "unitText": "mois"},
               "description": "À partir de 750 € HT par mois, sans engagement."}
}
SERVICE_AUDIT = {
    "@type": "Service", "@id": SITE + "/audit/audit-marketing-digital#service",
    "name": "Audit Marketing Digital", "serviceType": "Audit marketing digital",
    "description": "Diagnostic complet de l'acquisition digitale d'une entreprise B2B, restitué en rapport écrit d'environ 50 pages, avec un suivi à M+1 et M+2.",
    "provider": {"@id": ORG_ID}, "areaServed": {"@type": "Country", "name": "France"},
    "url": SITE + "/audit/audit-marketing-digital",
    "offers": {"@type": "Offer", "url": SITE + "/audit/audit-marketing-digital", "price": "1250", "priceCurrency": "EUR",
               "availability": "https://schema.org/InStock",
               "priceSpecification": {"@type": "PriceSpecification", "price": "1250", "priceCurrency": "EUR", "valueAddedTaxIncluded": False}}
}
COLLECTION = {
    "@type": "CollectionPage", "@id": SITE + "/actualites#page", "url": SITE + "/actualites",
    "name": "Ressources growth marketing B2B", "inLanguage": "fr-FR", "isPartOf": {"@id": SITE + "/#site"},
    "mainEntity": {"@type": "ItemList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "url": SITE + ARTICLE_IA_URL, "name": "Le référencement IA : la ruée vers l'or de 2026"},
        {"@type": "ListItem", "position": 2, "url": SITE + ARTICLE_URL, "name": "Inbound vs outbound : quoi choisir pour son entreprise en 2026 ?"}]}
}

MOTION_URL = '/motion-design'
SERVICE_MOTION = {
    "@type": "Service", "@id": SITE + MOTION_URL + "#service",
    "name": "Vidéo en motion design", "serviceType": "Motion design",
    "description": "Vidéo en motion design jusqu'à 60 secondes, livrée en 7 jours, déclinée dans tous les formats (vertical, horizontal, carré), révisions illimitées jusqu'à satisfaction.",
    "provider": {"@id": ORG_ID}, "areaServed": {"@type": "Country", "name": "France"},
    "url": SITE + MOTION_URL,
    "offers": {"@type": "Offer", "price": "500", "priceCurrency": "EUR", "availability": "https://schema.org/LimitedAvailability",
               "url": SITE + MOTION_URL, "description": "Offre de lancement limitée à 5 projets (prix habituel : 1 000 €)."}
}

H = ("Accueil", "/")
OG = SITE + "/images/og/"

# key = data-page dans src/site.html ; out = fichier généré ; path = URL canonique
PAGES = [
    dict(key='hero', out='index.html', path='/', prio='1.0', freq='weekly', topbar=True, img=OG + 'og-accueil.png',
         title="Growth marketer à temps partagé pour startups B2B | Cely",
         desc="Cely structure l'acquisition des startups B2B qui n'ont pas encore de growth : outbound et inbound lancés dès le premier mois, sans engagement.",
         ld=[LOCAL_BUSINESS, WEBSITE, PERSON_CELIEN]),
    dict(key='growth', out='growth.html', path='/growth', prio='0.9', freq='monthly', topbar=True, img=OG + 'og-growth.png',
         crumbs=[H, ("Growth Part-Time", "/growth")],
         title="Growth Part-Time : un growth marketer intégré | Cely",
         desc="Growth Part-Time : un growth marketer intégré à votre équipe 6 à 10 h par semaine. Stratégie, outbound, inbound, automatisation. Dès 750 € HT/mois.",
         ld=[SERVICE_GROWTH]),
    dict(key='audit', out='audit.html', path='/audit', prio='0.8', freq='monthly', topbar=True, img=OG + 'og-audit.png',
         crumbs=[H, ("Audits", "/audit")],
         title="Audits marketing digital pour startups B2B | Cely",
         desc="Les audits Cely : des diagnostics écrits et actionnables sur votre acquisition digitale. Découvrez l'Audit Marketing Digital, notre premier format."),
    dict(key='audit-detail', out='audit/audit-marketing-digital.html', path='/audit/audit-marketing-digital', prio='0.8', freq='monthly', topbar=True,
         img=OG + 'og-audit-marketing-digital.png', crumbs=[H, ("Audits", "/audit"), ("Audit Marketing Digital", "/audit/audit-marketing-digital")],
         title="Audit Marketing Digital complet (1 250 €) | Cely",
         desc="Audit Marketing Digital Cely : diagnostic complet de votre acquisition et plan d'action priorisé, en rapport écrit de 50 pages avec suivi — 1 250 €.",
         ld=[SERVICE_AUDIT]),
    dict(key='services', out='services.html', path='/services', prio='0.6', freq='monthly', topbar=True, img=OG + 'og-services.png',
         crumbs=[H, ("Formats d'accompagnement", "/services")],
         title="Growth freelance ou directeur marketing externalisé ? | Cely",
         desc="Growth marketer freelance, directeur marketing externalisé ou growth à temps partagé : quelles différences pour une startup B2B ? Comment choisir le bon format."),
    dict(key='actu', out='actualites.html', path='/actualites', prio='0.6', freq='weekly', img=OG + 'og-ressources.png',
         crumbs=[H, ("Ressources", "/actualites")],
         title="Ressources growth marketing B2B : guides et outils | Cely",
         desc="Guides, analyses et outils gratuits sur le growth marketing B2B : acquisition, prospection, SEO et GEO. Écrits à partir de ce qu'on applique sur le terrain.",
         ld=[COLLECTION]),
    dict(key='article', out='actualites/inbound-vs-outbound.html', path=ARTICLE_URL, prio='0.7', freq='monthly', og_type='article',
         crumbs=[H, ("Ressources", "/actualites"), ("Inbound vs outbound", ARTICLE_URL)],
         title="Inbound vs outbound : quoi choisir en 2026 ? (+ simulateur)",
         desc="Inbound ou outbound marketing ? Avantages, canaux, ratios et méthode pour choisir la bonne stratégie B2B en 2026. Testez notre simulateur gratuit.",
         img=SITE + "/images/og-inbound-vs-outbound.png",
         article=dict(published="2026-09-18", modified="2026-10-23", section="Growth marketing B2B",
                      tags=["Growth marketing", "Prospection LinkedIn", "SEO / GEO", "Stratégie B2B"]),
         ld=[BLOG_POSTING, PERSON_CELIEN]),
    dict(key='article-ia', out='actualites/referencement-ia.html', path=ARTICLE_IA_URL, prio='0.7', freq='monthly', og_type='article',
         crumbs=[H, ("Ressources", "/actualites"), ("Référencement IA", ARTICLE_IA_URL)],
         title="Référencement IA (GEO) : la ruée vers l'or de 2026",
         desc="Le GEO, mythe ou réalité ? Ce que disent les études, ce qui change avec les Aperçus IA en France, et la méthode pour être cité par ChatGPT.",
         img=SITE + "/images/og-referencement-ia.png",
         article=dict(published="2026-10-01", modified="2026-10-01", section="Visibilité IA — SEO / GEO",
                      tags=["SEO / GEO", "Visibilité IA", "Stratégie B2B", "Growth marketing"]),
         ld=[BLOG_POSTING_IA, PERSON_CELIEN]),
    dict(key='motion-design', out='motion-design.html', path=MOTION_URL, prio='0.5', freq='monthly',
         crumbs=[H, ("Motion design", MOTION_URL)],
         title="Vidéo motion design à 500 € (offre de lancement) | Cely",
         desc="Votre vidéo en motion design jusqu'à 60 s pour 500 € au lieu de 1 000 € : livrée en 7 jours, tous formats, révisions illimitées. 5 places seulement.",
         ld=[SERVICE_MOTION]),
    dict(key='manifeste', out='manifeste.html', path='/manifeste', prio='0.5', freq='monthly', img=OG + 'og-manifeste.png',
         crumbs=[H, ("Manifeste", "/manifeste")],
         title="Manifeste : notre vision du growth marketing | Cely",
         desc="Le manifeste Cely : notre vision du growth marketing pour les startups B2B. Comprendre avant d'agir, s'intégrer à l'équipe, rester tant que ça marche.",
         ld=[PERSON_CELIEN]),
    dict(key='rejoindre', out='nous-rejoindre.html', path='/nous-rejoindre', robots='noindex, follow', sitemap=False,
         crumbs=[H, ("Nous rejoindre", "/nous-rejoindre")],
         title="Nous rejoindre : réseau d'experts growth | Cely",
         desc="Rejoindre le réseau Cely : experts outbound, paid, SEO, tracking et contenu, mobilisés selon les besoins réels de chaque mission client, dans la durée."),
    dict(key='contact', out='contact.html', path='/contact', prio='0.6', freq='yearly', topbar=True, img=OG + 'og-contact.png', cta=False,
         crumbs=[H, ("Contact", "/contact")],
         title="Contact : premier rendez-vous offert | Cely",
         desc="Parlez de votre croissance avec Cely : un premier rendez-vous offert de 30 minutes pour identifier vos blocages et repartir avec des pistes concrètes."),
    dict(key='mentions-legales', out='mentions-legales.html', path='/mentions-legales', robots='noindex, follow', sitemap=False,
         crumbs=[H, ("Mentions légales", "/mentions-legales")],
         title="Mentions légales | Cely", desc="Mentions légales du site celygrowth.com : éditeur du site, coordonnées, hébergement, propriété intellectuelle et renvoi vers la politique de données."),
    dict(key='confidentialite', out='confidentialite.html', path='/confidentialite', robots='noindex, follow', sitemap=False,
         crumbs=[H, ("Confidentialité", "/confidentialite")],
         title="Politique de confidentialité | Cely", desc="Comment Cely traite les données personnelles transmises via les formulaires de celygrowth.com : finalités, destinataires, durée de conservation et vos droits."),
    dict(key='cookies', out='cookies.html', path='/cookies', robots='noindex, follow', sitemap=False,
         crumbs=[H, ("Cookies", "/cookies")],
         title="Cookies | Cely", desc="Les cookies sur celygrowth.com : aucun cookie de mesure d'audience ni de publicité, les services tiers concernés et comment paramétrer votre navigateur."),
    dict(key='404', out='404.html', path=None, robots='noindex, follow', sitemap=False,
         title="Page introuvable | Cely", desc="Cette page n'existe pas ou plus. Retrouvez l'accueil de Cely, l'offre Growth Part-Time ou nos ressources growth marketing B2B, ou réservez un diagnostic."),
]

def esc(v): return html.escape(v, quote=True)

def faq_from_main(main_html, page_url):
    """FAQPage construit à partir de la FAQ réellement affichée : questions et
    réponses identiques mot pour mot au texte de la page (règle Google)."""
    items = re.findall(r'<details class="art-faq-item"[^>]*>\s*<summary><h3>(.*?)</h3>.*?</summary>\s*<div class="art-faq-answer">(.*?)</div>', main_html, re.S)
    items += re.findall(r'<details class="(?:gpt|aud)-faq-item"[^>]*>\s*<summary>(.*?)<span class="pm"[^>]*></span></summary>\s*<p class="(?:gpt|aud)-faq-answer">(.*?)</p>', main_html, re.S)
    def txt(h):
        t = html.unescape(re.sub(r'<[^>]+>', '', h)).replace('\u00a0', ' ')
        return re.sub(r'\s+', ' ', t).strip()
    if not items:
        return None
    return {"@type": "FAQPage", "@id": page_url + "#faq", "mainEntity": [
        {"@type": "Question", "name": txt(q), "acceptedAnswer": {"@type": "Answer", "text": txt(a)}} for q, a in items]}

def head_for(p, faq=None):
    url = SITE + p['path'] if p['path'] else None
    img = p.get('img', DEFAULT_IMG)
    out = [
        '<meta name="robots" content="%s">' % p.get('robots', 'index, follow'),
        '<title>%s</title>' % esc(p['title']),
        '<meta name="description" content="%s">' % esc(p['desc']),
    ]
    if url:
        out.append('<link rel="canonical" href="%s">' % url)
    out += [
        '<meta property="og:type" content="%s">' % p.get('og_type', 'website'),
        '<meta property="og:site_name" content="Cely">',
        '<meta property="og:locale" content="fr_FR">',
        '<meta property="og:title" content="%s">' % esc(p['title']),
        '<meta property="og:description" content="%s">' % esc(p['desc']),
    ]
    if url:
        out.append('<meta property="og:url" content="%s">' % url)
    if p.get('article'):
        a = p['article']
        out += ['<meta property="article:published_time" content="%s">' % a['published'],
                '<meta property="article:modified_time" content="%s">' % a['modified'],
                '<meta property="article:author" content="%s">' % CONFIG['LINKEDIN_URL'],
                '<meta property="article:section" content="%s">' % esc(a['section'])]
        out += ['<meta property="article:tag" content="%s">' % esc(t) for t in a['tags']]
    out += [
        '<meta property="og:image" content="%s">' % img,
    ] + (['<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">', '<meta property="og:image:alt" content="%s">' % esc(p['title'])] if p.get('img') else []) + [
        '<meta name="twitter:card" content="summary_large_image">',
        '<meta name="twitter:title" content="%s">' % esc(p['title']),
        '<meta name="twitter:description" content="%s">' % esc(p['desc']),
        '<meta name="twitter:image" content="%s">' % img,
    ]
    ld = list(p.get('ld') or []) + ([crumbs(*p['crumbs'])] if p.get('crumbs') else []) + ([faq] if faq else [])
    if ld:
        graph = {"@context": "https://schema.org", "@graph": ld}
        out.append('<script type="application/ld+json">%s</script>' % json.dumps(graph, ensure_ascii=False, separators=(',', ':')))
    return '\n'.join(out)

def main():
    src = open(SRC, encoding='utf-8').read()
    # blocs conditionnels <!--IF:FLAG--> … <!--/IF:FLAG--> pilotés par site-config.json
    def _if(m):
        return m.group(2) if CONFIG.get(m.group(1)) else ''
    src = re.sub(r'<!--IF:([A-Z_]+)-->(.*?)<!--/IF:\1-->\n?', _if, src, flags=re.S)
    # constantes {{NOM}}
    src = re.sub(r'\{\{([A-Z_]+)\}\}', lambda m: str(CONFIG[m.group(1)]), src)
    warnings_long = []
    assert '<!--PAGE_HEAD-->' in src, 'marqueur <!--PAGE_HEAD--> absent de src/site.html'
    start = src.index('<div id="site-content">') + len('<div id="site-content">')
    end = src.index('<footer class="site-footer"')
    end = src.rindex('</div>', start, end)
    zone = src[start:end]
    mains = {m.group(1): m.group(0) for m in re.finditer(r'<main class="site-page[^"]*" data-page="([^"]+)"[^>]*>.*?</main>', zone, re.S)}
    # composants partagés <!--COMPONENT:NOM--> … <!--/COMPONENT:NOM--> (retirés de la sortie, injectés à la demande)
    comps = {m.group(1): m.group(2).strip() for m in re.finditer(r'<!--COMPONENT:([A-Z_]+)-->(.*?)<!--/COMPONENT:\1-->', src, re.S)}
    src = re.sub(r'\n?<!--COMPONENT:([A-Z_]+)-->.*?<!--/COMPONENT:\1-->\n?', '\n', src, flags=re.S)
    start = src.index('<div id="site-content">') + len('<div id="site-content">')
    end = src.rindex('</div>', start, src.index('<footer class="site-footer"'))
    lastmod_path = os.path.join(ROOT, 'scripts', 'lastmod.json')
    lastmod = json.load(open(lastmod_path, encoding='utf-8')) if os.path.exists(lastmod_path) else {}
    warnings = []
    for p in PAGES:
        assert p['key'] in mains, 'page absente de la source : ' + p['key']
        assert len(p['title']) <= 60, ('title > 60', p['title'])
        assert len(p['desc']) <= 210, ('description > 210', p['desc'], len(p['desc']))
        body_main = re.sub(r'(<main class="site-page[^"]*" data-page="[^"]+")\s+hidden>', r'\1>', mains[p['key']], count=1)
        # fil d'Ariane visible (le même que le BreadcrumbList)
        inject = ''
        if p.get('topbar'):
            inject += '\n  ' + comps['TOPBAR']
        if p.get('crumbs'):
            lis = []
            for i, (n, u) in enumerate(p['crumbs']):
                last = i == len(p['crumbs']) - 1
                lis.append('<li>' + ('<span aria-current="page">%s</span>' % esc(n) if last else '<a href="%s">%s</a>' % (u, esc(n))) + '</li>')
            inject += '\n  <nav class="crumbs" aria-label="Fil d\'Ariane"><div class="section-wrap"><ol>' + ''.join(lis) + '</ol></div></nav>'
        if inject:
            body_main = re.sub(r'(<main class="site-page[^"]*" data-page="[^"]+"[^>]*>)', lambda m: m.group(1) + inject, body_main, count=1)
        cta = comps['CTA_FINAL'] if p.get('cta', True) else ''
        body_main = body_main.replace('<!--CTA_FINAL-->', cta)
        h = __import__('hashlib').md5(body_main.encode('utf-8')).hexdigest()
        if p['path']:
            rec = lastmod.get(p['path'])
            if not rec or rec['hash'] != h:
                lastmod[p['path']] = {'hash': h, 'date': TODAY}
        page = src[:start] + '\n\n  ' + body_main + '\n\n' + src[end:]
        faq = faq_from_main(body_main, SITE + p['path']) if p['path'] else None
        page = page.replace('<!--PAGE_HEAD-->', head_for(p, faq), 1)
        assert page.count('<h1') == 1, ('un seul H1 attendu', p['out'], page.count('<h1'))
        if not (140 <= len(p['desc']) <= 160) and not p.get('article'):
            warnings_long.append('%s (%d car.)' % (p['out'], len(p['desc'])))
        dest = os.path.join(ROOT, p['out'])
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, 'w', encoding='utf-8') as f:
            f.write(page)
        if '[À compléter' in body_main:
            warnings.append(p['out'])
        print('  %-40s %6d Ko  %s' % (p['out'], len(page.encode('utf-8')) // 1024, p['path'] or '(404)'))
    # sitemap : uniquement les URL canoniques indexables
    rows = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for p in PAGES:
        if p.get('sitemap', True) and p['path'] and p.get('robots', 'index, follow').startswith('index'):
            rows += ['  <url>', '    <loc>%s%s</loc>' % (SITE, p['path']), '    <lastmod>%s</lastmod>' % lastmod[p['path']]['date'],
                     '    <changefreq>%s</changefreq>' % p['freq'], '    <priority>%s</priority>' % p['prio'], '  </url>']
    rows.append('</urlset>')
    with open(os.path.join(ROOT, 'sitemap.xml'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(rows) + '\n')
    with open(lastmod_path, 'w', encoding='utf-8') as f:
        json.dump(lastmod, f, ensure_ascii=False, indent=1, sort_keys=True)
    print('  sitemap.xml mis à jour (lastmod réel par page, voir scripts/lastmod.json)')
    if warnings_long:
        print('\n  ⚠  Meta description hors de la plage 140–160 caractères : ' + ', '.join(warnings_long))
    if '[X XXX]' in str(CONFIG.get('LINKEDIN_FOLLOWERS')) and '{{LINKEDIN_FOLLOWERS}}' in open(SRC, encoding='utf-8').read():
        print("\n  ⚠  LINKEDIN_FOLLOWERS vaut encore « [X XXX] » dans src/site-config.json : le texte s'affiche tel quel sur le site.")
    if warnings:
        print('\n  ⚠  Champs [À compléter] encore présents dans : ' + ', '.join(warnings) + ' — à renseigner dans src/site.html avant publication.')

if __name__ == '__main__':
    main()
