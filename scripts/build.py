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
SITE = 'https://www.celygrowth.com'
DEFAULT_IMG = SITE + '/images/cely-mark-ce.png'
TODAY = datetime.date.today().isoformat()

LOCAL_BUSINESS = {
    "@type": "LocalBusiness", "@id": SITE + "/#organisation",
    "name": "Cely",
    "description": "Cely est une agence growth marketing basée à Meylan (Grenoble), spécialisée dans l'accompagnement des startups tech B2B.",
    "url": SITE + "/", "logo": DEFAULT_IMG, "image": DEFAULT_IMG,
    "telephone": "+33756963783",
    "address": {"@type": "PostalAddress", "streetAddress": "6A Chem. des Prés", "postalCode": "38240",
                "addressLocality": "Meylan", "addressCountry": "FR"},
    "openingHoursSpecification": [
        {"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "06:30", "closes": "21:30"},
        {"@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "08:00", "closes": "19:30"},
        {"@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "10:00", "closes": "14:00"}],
    "sameAs": ["https://www.google.com/maps?cid=7863789155467383060", "https://www.linkedin.com/in/celienboillotwenoble/"]
}
WEBSITE = {"@type": "WebSite", "@id": SITE + "/#site", "url": SITE + "/", "name": "Cely", "inLanguage": "fr-FR",
           "publisher": {"@id": SITE + "/#organisation"}}

def crumbs(*items):
    return {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": SITE + u} for i, (n, u) in enumerate(items)]}

ARTICLE_URL = '/actualites/inbound-vs-outbound'
BLOG_POSTING = {
    "@type": "BlogPosting", "@id": SITE + ARTICLE_URL + "#article",
    "headline": "Inbound vs outbound : quoi choisir pour son entreprise en 2026 ?",
    "description": "Inbound ou outbound marketing ? Avantages, canaux, ratios et méthode pour choisir la bonne stratégie B2B en 2026. Testez notre simulateur gratuit.",
    "image": SITE + "/images/og-inbound-vs-outbound.png", "inLanguage": "fr-FR",
    "datePublished": "2026-09-18", "dateModified": "2026-09-18",
    "mainEntityOfPage": SITE + ARTICLE_URL,
    "author": {"@type": "Person", "name": "Célien Boillot", "url": "https://www.linkedin.com/in/celienboillotwenoble/",
               "sameAs": ["https://www.linkedin.com/in/celienboillotwenoble/"], "jobTitle": "Fondateur de Cely, cofondateur de Wenoble"},
    "publisher": {"@type": "Organization", "@id": SITE + "/#organisation", "name": "Cely", "logo": {"@type": "ImageObject", "url": DEFAULT_IMG}}
}

# key = data-page dans src/site.html ; out = fichier généré ; path = URL canonique
PAGES = [
    dict(key='hero', out='index.html', path='/', prio='1.0', freq='weekly',
         title="Agence Growth Marketing B2B pour startups | Cely",
         desc="Cely, agence growth marketing B2B près de Grenoble : on s'intègre à votre équipe pour piloter votre acquisition. Premier mois satisfait ou remboursé.",
         ld=[LOCAL_BUSINESS, WEBSITE]),
    dict(key='growth', out='growth.html', path='/growth', prio='0.9', freq='monthly',
         title="Growth Part-Time : un growth marketer intégré | Cely",
         desc="Growth Part-Time : Cely rejoint votre équipe pour piloter et exécuter votre croissance — outbound, inbound et coordination des experts, dès 5h/semaine."),
    dict(key='audit', out='audit.html', path='/audit', prio='0.8', freq='monthly',
         title="Audits marketing digital pour startups B2B | Cely",
         desc="Les audits Cely : des diagnostics écrits et actionnables sur votre acquisition digitale. Découvrez l'Audit Marketing Digital, notre premier format."),
    dict(key='audit-detail', out='audit/audit-marketing-digital.html', path='/audit/audit-marketing-digital', prio='0.8', freq='monthly',
         title="Audit Marketing Digital complet (1 250 €) | Cely",
         desc="Audit Marketing Digital Cely : diagnostic complet de votre acquisition et plan d'action priorisé, en rapport écrit de 50 pages avec suivi — 1 250 €.",
         ld=[crumbs(("Accueil", "/"), ("Audit", "/audit"), ("Audit Marketing Digital", "/audit/audit-marketing-digital"))]),
    dict(key='services', out='services.html', path='/services', prio='0.6', freq='monthly',
         title="Services growth marketing B2B | Cely",
         desc="Les services Cely au-delà du pilotage growth : growth marketing freelance et direction marketing externalisée — formats en préparation."),
    dict(key='actu', out='actualites.html', path='/actualites', prio='0.5', freq='weekly',
         title="Actualités growth marketing B2B | Cely",
         desc="Ce qu'on observe, ce qu'on teste — les analyses et retours d'expérience de Cely sur le growth marketing B2B."),
    dict(key='article', out='actualites/inbound-vs-outbound.html', path=ARTICLE_URL, prio='0.6', freq='monthly', og_type='article',
         title="Inbound vs outbound : quoi choisir en 2026 ? (+ simulateur)",
         desc="Inbound ou outbound marketing ? Avantages, canaux, ratios et méthode pour choisir la bonne stratégie B2B en 2026. Testez notre simulateur gratuit.",
         img=SITE + "/images/og-inbound-vs-outbound.png",
         ld=[BLOG_POSTING, crumbs(("Accueil", "/"), ("Actualités", "/actualites"), ("Inbound vs outbound", ARTICLE_URL))]),
    dict(key='manifeste', out='manifeste.html', path='/manifeste', prio='0.5', freq='monthly',
         title="Manifeste : notre vision du growth marketing | Cely",
         desc="Le manifeste Cely : notre vision du growth marketing pour les startups tech B2B, sans jargon ni prestations à distance."),
    dict(key='rejoindre', out='nous-rejoindre.html', path='/nous-rejoindre', prio='0.4', freq='monthly',
         title="Nous rejoindre : réseau d'experts growth | Cely",
         desc="Rejoindre le réseau Cely : experts outbound, paid, SEO, tracking et contenu, mobilisés selon les besoins réels de chaque mission client."),
    dict(key='contact', out='contact.html', path='/contact', prio='0.6', freq='yearly',
         title="Contact : premier rendez-vous offert | Cely",
         desc="Parlez de votre croissance avec Cely : un premier rendez-vous offert de 30 minutes pour identifier vos blocages et repartir avec des pistes concrètes."),
    dict(key='mentions-legales', out='mentions-legales.html', path='/mentions-legales', robots='noindex, follow', sitemap=False,
         title="Mentions légales | Cely", desc="Mentions légales du site celygrowth.com : éditeur, hébergement et propriété intellectuelle."),
    dict(key='confidentialite', out='confidentialite.html', path='/confidentialite', robots='noindex, follow', sitemap=False,
         title="Politique de confidentialité | Cely", desc="Comment Cely traite les données personnelles transmises via les formulaires du site celygrowth.com, et comment exercer vos droits."),
    dict(key='cookies', out='cookies.html', path='/cookies', robots='noindex, follow', sitemap=False,
         title="Cookies | Cely", desc="Les cookies utilisés sur celygrowth.com et comment les paramétrer."),
    dict(key='404', out='404.html', path=None, robots='noindex, follow', sitemap=False,
         title="Page introuvable | Cely", desc="Cette page n'existe pas ou plus."),
]

def esc(v): return html.escape(v, quote=True)

def head_for(p):
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
    out += [
        '<meta property="og:image" content="%s">' % img,
        '<meta name="twitter:card" content="summary_large_image">',
        '<meta name="twitter:title" content="%s">' % esc(p['title']),
        '<meta name="twitter:description" content="%s">' % esc(p['desc']),
        '<meta name="twitter:image" content="%s">' % img,
    ]
    if p.get('ld'):
        graph = {"@context": "https://schema.org", "@graph": p['ld']}
        out.append('<script type="application/ld+json">%s</script>' % json.dumps(graph, ensure_ascii=False, separators=(',', ':')))
    return '\n'.join(out)

def main():
    src = open(SRC, encoding='utf-8').read()
    assert '<!--PAGE_HEAD-->' in src, 'marqueur <!--PAGE_HEAD--> absent de src/site.html'
    start = src.index('<div id="site-content">') + len('<div id="site-content">')
    end = src.index('<footer class="site-footer"')
    end = src.rindex('</div>', start, end)
    zone = src[start:end]
    mains = {m.group(1): m.group(0) for m in re.finditer(r'<main class="site-page[^"]*" data-page="([^"]+)"[^>]*>.*?</main>', zone, re.S)}
    warnings = []
    for p in PAGES:
        assert p['key'] in mains, 'page absente de la source : ' + p['key']
        assert len(p['title']) <= 60, ('title > 60', p['title'])
        assert len(p['desc']) <= 155, ('description > 155', p['desc'], len(p['desc']))
        body_main = re.sub(r'(<main class="site-page[^"]*" data-page="[^"]+")\s+hidden>', r'\1>', mains[p['key']], count=1)
        page = src[:start] + '\n\n  ' + body_main + '\n\n' + src[end:]
        page = page.replace('<!--PAGE_HEAD-->', head_for(p), 1)
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
            rows += ['  <url>', '    <loc>%s%s</loc>' % (SITE, p['path']), '    <lastmod>%s</lastmod>' % TODAY,
                     '    <changefreq>%s</changefreq>' % p['freq'], '    <priority>%s</priority>' % p['prio'], '  </url>']
    rows.append('</urlset>')
    with open(os.path.join(ROOT, 'sitemap.xml'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(rows) + '\n')
    print('  sitemap.xml mis à jour (lastmod %s)' % TODAY)
    if warnings:
        print('\n  ⚠  Champs [À compléter] encore présents dans : ' + ', '.join(warnings) + ' — à renseigner dans src/site.html avant publication.')

if __name__ == '__main__':
    main()
