# DESIGN.md · Association Indigo · « L'atelier »

Système visuel issu de la maquette C (`src/previews/atelier/`). Référence pour appliquer le design au vrai site.

## Le monde

La table des ateliers vue de dessus : tapis de découpe vert d'eau, papiers pastel découpés, scotch washi, étiquettes, tickets, tampons. Le site parle à des parents d'enfants atypiques, souvent le soir, souvent inquiets : chaleureux et fait main, jamais enfantin au point de perdre en lisibilité.

## Couleurs

| Rôle | Valeur | Usage |
|---|---|---|
| Encre | `#2A284E` | Texte, boutons principaux |
| Encre 2 | `#4B4873` | Texte secondaire (≥ 4.5:1 sur tous les papiers) |
| Action | `#3F49A6` | Survol des boutons, focus, tampon |
| Tapis | `#D5EDDC` | Fond des sections « table » |
| Grille | `#BEDFC8` / `#A6D2B4` | Lignes 1 cm (40 px) / 5 cm (200 px) |
| Papier lilas | `#CBD1FA` | TDAH, sommaire, pied de page |
| Papier saumon | `#FFC7B2` | DYS |
| Papier beurre | `#FFE69E` | HPI, tickets, surligneur des H2 |
| Papier ciel | `#BFE3F7` | Phobie scolaire |
| Papier mauve | `#E3CCF5` | Hypersensibilité |
| Papier menthe | `#C9EBC4` | Divers |
| Étincelles (logo) | `#F4A259` `#5361C9` `#EE7A5F` | Étoiles en papier, puces de liste |

Les sections alternent tapis et blanc. Jamais de dégradé, jamais de gris pour le texte.

## Typographie

- **Grandstander** 700–800 : titres, étiquettes, tickets. `text-wrap: balance`.
- **Nunito** 400–800 : texte courant. 18 px / 1.8 dans les articles, mesure ≤ 68ch.
- Titres de section : `clamp(2rem, 4vw, 3.1rem)`. H1 de l'accueil : bandes de papier, une ligne par bande, sans retour.

## Matières (composants dans `kit.tsx`)

- **Papier** : ombre `0 1px 1px rgba(42,40,78,.07), 0 10px 22px -10px rgba(42,40,78,.32)`, rotation de −3° à +3°. Les textes longs restent droits.
- **Scotch** (`Tape`) : 92×26 px, bords dentelés, opacité .85.
- **Étiquette** (`.tag`) : coins supérieurs coupés, œillet blanc.
- **Ticket** (`.ticket`) : deux encoches demi-rondes. Pour les appels à l'action « adhérer / donner / en parler ».
- **Pochette** : dossier avec onglet, les fiches (articles) dépassent du haut.
- **Ligne de découpe** (`CutLine`) : pointillés + ciseaux. Au maximum deux par page.
- **Tampon** (`Stamp`) : une seule réassurance par page.
- **Règle** : graduations du tapis en haut du hero de l'accueil.

## Mouvement

- **Signature** : la guirlande d'étiquettes (une par profil) se balance au survol, accrochée par son œillet.
- **Au chargement** : les pièces du hero « se posent » (translation + rotation, contenu toujours visible).
- **Au survol** : le papier se redresse et se soulève (`.paper-lift`).
- Tout est désactivé avec `prefers-reduced-motion`.

## Articles

Le texte saisi dans l'admin est structuré par `parseArticle()` : intertitres → `<h2>` (avec sommaire), puces → `<ul>`. C'est aussi un gain SEO (structure H2 réelle). À reprendre tel quel dans `ArticlePage`.

## À faire valider avant mise en ligne

- Les deux témoignages (Sophie, Marc) : réels ou à retirer.
- La photo du hero est une image générée par IA : une vraie photo d'atelier serait plus forte.
