# Primavera 2027 · Sound Atlas

Independent listening atlas for the Primavera Sound Barcelona 2027 lineup. It helps listeners find acts they might like, through a tasteful infographic rather than a poster or a ranking.

This file is the working brief for humans and coding agents.

## Purpose

- Turn the official A–Z into a map you can listen through.
- Families are navigation, not a verdict and not an official festival label.
- Leave uncertainty visible. Thin evidence stays labelled.

The site is not affiliated with Primavera Sound.

## Locales

| URL | Voice |
| --- | --- |
| `/zh-hant/` | Primary. Traditional Chinese. |
| `/en/` | English. |
| `/ja/` | Japanese. Artist prose is machine-translated and still awaiting review. |

The root `/` redirects in the browser: `ja` to `/ja/`, `en` to `/en/`, otherwise `/zh-hant/`.

Interface copy lives in `src/i18n/ui.ts`. Artist prose lives on each record as `bio`, `sound`, `listen`, and `note`, with `_zh`, `_en`, and `_ja` suffixes. Japanese falls back to English when a field is empty.

## Data

`src/data/artists.json` is the catalogue. One object per billed act, including B2Bs and collaborations. Do not split a joint bill into duplicate cards.

| Field | Meaning |
| --- | --- |
| `id`, `name`, `index` | Stable id, billed name, position in the source A–Z |
| `family` | One primary navigation family. See `.cursor/skills/music-classification/SKILL.md` |
| `main`, `sub`, `adjacent`, `descriptors`, `parent` | Genre placement. English keys. Labels are translated in the UI |
| `releases` | Entry listening, not a predicted 2027 setlist |
| `confidence` | `strong`, `partial`, or `unverified` |
| `sources` | `{ title, url }` evidence |
| `official` | Primavera artist page |
| `image`, `localImage` | Remote photo and `/images/...webp` |

Photos in `public/images/` come from Primavera Sound media. They are not covered by the MIT license.

Regenerate JSON from the original export with `npm run convert-data` only if `legacy/data.js` is still present. After that, edit `artists.json` directly.

## Design

The visual system is the original atlas: Archivo Black and Satoshi, saturated family colours, circular dots, grayscale portraits that return to colour on hover. The page background is white. Rules are in `.cursor/skills/infographic-design/SKILL.md`.

## Commands

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview
npm run check-ja # confirm Japanese fields and that source links survived
```

## Deploy

GitHub repository: `cheukkinchi/primavera-2027-sound-atlas` (public).

Cloudflare Pages, connected to that repo:

- Build command: `npm run build`
- Output directory: `dist`
- Node: `22` (see `.node-version`)
- Production branch: `main`
- Site: `https://primavera-2027-sound-atlas.pages.dev`

A push to `main` deploys. Pull requests get preview URLs once the Git connection exists in the Cloudflare dashboard.

## Editing rules

- Do not invent genres, releases, or sources. If evidence is thin, lower `confidence` and say so in `note`.
- Do not present a family as mutually exclusive musicology.
- Keep markdown links `[label](url)` intact when translating.
- Do not imply affiliation with the festival.
- Match existing behaviour before restyling: search, family filters, atmospheric toggle, sort, treemap, routes, profile, session list, text export.
