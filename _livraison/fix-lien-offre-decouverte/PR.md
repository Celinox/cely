## Offre découverte : URL canonique sous /services

L'Offre découverte était une page autonome (`/offre-decouverte`), absente de /services. Elle passe à `/services/offre-decouverte` et entre dans le hub des services.

| Lien | Avant | Après |
|---|---|---|
| Bouton navbar desktop (toutes les pages) | /offre-decouverte | /services/offre-decouverte |
| Bouton barre mobile (toutes les pages) | /offre-decouverte | /services/offre-decouverte |
| Bouton menu mobile (toutes les pages) | /offre-decouverte | /services/offre-decouverte |
| Carte « Et bientôt vous ? » (accueil) | /offre-decouverte | /services/offre-decouverte |
| Hub /services : nouvelle entrée `#offre-decouverte` + lien dans le sommaire | — | /services/offre-decouverte |
| Pied de page | aucun lien Offre découverte | inchangé |

- Redirections 301 dans `vercel.json` : `/offre-decouverte` et `/offre-decouverte.html` → `/services/offre-decouverte`.
- Fil d'Ariane Accueil › Services › Offre découverte, sitemap, canonical et données structurées (Service + liste des services) mis à jour.
- L'ancre `/services#offre-decouverte` arrive sous l'en-tête fixe (titre visible).

Vérifié : build OK, aucun lien cassé, chaque bouton cliqué sur desktop et mobile. La 301 elle-même ne se teste qu'une fois déployée sur Vercel (prévisualisation de la branche).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_017Q9V5WaTzHC6gq9Rsvp593
