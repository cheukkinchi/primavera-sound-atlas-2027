---
name: infographic-design
description: Swiss and data-journalism visual rules for the Sound Atlas. Use when changing layout, type, colour, charts, the dot atlas, the treemap, or any infographic on this site.
---

# Infographic design

The live site uses the original Sound Atlas look. Do not restyle it toward a quieter Swiss system unless the user asks. The only ground-colour change from that original is a white page (`#ffffff`).

Archivo Black carries the display type. Satoshi carries the body, with Noto Sans TC, and Noto Sans JP on `/ja/` only. Family colours are the saturated originals and appear on dots, chips, and treemap tiles. Portraits are grayscale until hover. Dots are circles. Chips and the list button are pills.

## Grid

- Page width is `--page` (76rem) inside `--gutter`.
- Sections align to the same left edge. Do not introduce a second inset for decoration.
- Prefer a 12-column mental grid: hero is about 7 + 5, map is about 7 + 5, routes are about 5 + 7.
- Hairline rules (`1px`, `--line` or full `--ink`) separate sections. Do not use drop shadows or large radii.
- Numbers that are data use tabular figures (`font-variant-numeric: tabular-nums`).

## Type

- One Latin family: Inter Tight. Weights in use: 400, 500, 600, 700. Do not add a display serif or a black poster face.
- Traditional Chinese: Noto Sans TC. Japanese pages also load Noto Sans JP, and only those pages.
- Stack: `"Inter Tight", "Noto Sans TC"` and, on `:lang(ja)`, Noto Sans JP before Noto Sans TC.
- Body size is 1.0625rem so CJK is readable. Line-height is 1.6.
- Latin headings may use a small negative tracking (`-0.03em`). Chinese and Japanese headings use tracking `0`.
- Kickers are uppercase Latin, wide tracking, muted. Do not uppercase CJK.
- Hierarchy, from the tokens: `--text-xs`, `--text-sm`, `--text-base`, `--text-lg`, `--text-xl`, `--text-hero`. Do not invent a size between them.
- Ragged right. Line length for prose stays under about 40em.

## Colour

- Paper `--bg` `#f3f0e8`, ink `--ink` `#1c1b17`, muted text `--muted`.
- Family colours are desaturated and appear only as data: dot, treemap tile, card rule, legend swatch.
- Do not use family colour for buttons, links, or decoration.
- A tile's text colour is the family's `text` field. Check contrast before lightening a tile.
- Legend is required wherever colour encodes a family. Do not rely on colour alone: labels and counts sit on the tile and in the legend.

## Charts

- **Dot atlas**: one equal dot per act, grouped by family order. No decorative size variation. Hover or focus names the act.
- **Treemap**: area stands for the count of the primary family. Direct labels (name, count, share). Selecting a tile reveals overlapping branches and states that those counts must not be added.
- **Lessons and routes**: small multiples with a number, a title, and one sentence. Not a ranking.

## Annotation

- Every chart has a kicker, a sentence that says what the area or colour means, and a caveat when the encoding simplifies the truth.
- Source lines stay with the profile, not in a footer only.
- The method section records scope, date, and what is unknown.
- Japanese artist prose is marked as machine translation until a person reviews it.

## Accessibility

- Contrast of body text on paper stays dark ink on `--bg`.
- Interactive targets are at least 2.25rem tall.
- Focus is a 2px ink outline.
- `prefers-reduced-motion: reduce` removes smooth scrolling and transitions.
- Images have the artist name as alt text. Decorative marks are `aria-hidden`.

## Do not

- Poster lettering, gradient meshes, glassmorphism, pill-shaped chips, or grayscale-to-colour hover tricks.
- A third type family.
- Colour used as branding rather than as a scale.
- Charts without a unit, a count, or a caveat.
