## Accueil : section logos intégrée au reste de la page

- Titre et sous-titre sur la hiérarchie des autres sections : `hp-eyebrow` « Nos clients » + `hp-h2` (même taille que « Cely, en une minute. »).
- Logos en hauteur optique homogène (surface visuelle constante), alignés au centre, fondu progressif sur les bords au lieu de coupes nettes.
- La bande et la carte « Et bientôt vous ? » forment un seul bloc ; la carte est réduite et rattachée à la bande (séparateur pointillé), texte et lien conservés.
- Espacements : le haut reprend la valeur qui dégageait déjà le bandeau incliné ; l'écart avant « En une minute » passe sur le rythme standard.

Token / voisin touché : aucun token modifié. Une règle `.hp-clients + .hp-video { padding-top: calc(var(--hp-sec-y) * .75) }` réduit l'écart de la section vidéo uniquement quand elle suit cette section.

Captures avant/après : `avant-*.png` / `apres-*.png` (1440, 820, 380 px).
Vérifié : build OK, aucun lien cassé, pas de défilement horizontal, autres pages identiques au pixel près.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_017Q9V5WaTzHC6gq9Rsvp593
