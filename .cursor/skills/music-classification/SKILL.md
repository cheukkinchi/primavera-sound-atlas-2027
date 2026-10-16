---
name: music-classification
description: Classifies artists for the Primavera Sound Atlas into navigation families, subgenres, textures, and confidence levels, in Traditional Chinese, English, and Japanese. Use when adding or editing an act, a genre label, a source, or a listening route.
---

# Music classification

Use this when changing `src/data/artists.json`, genre labels in `src/i18n/ui.ts`, or listening routes.

Families are a listening map. They are not official Primavera tags, not a predicted 2027 setlist, and not mutually exclusive musicology.

## Families

Each act has one primary `family`, chosen for navigation. Secondary styles stay in `sub` and `adjacent`.

| id | English | 繁中 | 日本語 | Branches to show first |
| --- | --- | --- | --- | --- |
| `guitar` | Rock & Alternative | 搖滾及另類 | ロックとオルタナティブ | Indie rock, Shoegaze, Post-punk, Post-rock |
| `pop` | Pop & R&B | 流行與 R&B | ポップと R&B | Art pop, Synthpop, Alternative R&B, Dance-pop |
| `electronic` | Electronic & club | 電子與舞池 | エレクトロニックとクラブ | House, Techno, UK bass, Breakbeat |
| `rap` | Hip-hop & rap | Hip-hop 與饒舌 | ヒップホップとラップ | Hip-hop, Trap, Southern hip-hop, Experimental hip-hop |
| `folk` | Folk & songwriters | 民謠與創作 | フォークとシンガーソングライター | Indie folk, Chamber folk, Singer-songwriter, Country |
| `heavy` | Heavy & hardcore | 重型與硬核 | ヘヴィとハードコア | Hardcore punk, Metalcore, Doom metal, Grindcore |
| `experimental` | Ambient & leftfield | 氛圍與實驗 | アンビエントとレフトフィールド | Ambient, Experimental electronic, Drone, Avant-pop |
| `global` | Latin & beyond | 拉丁與跨界 | ラテンとその先 | Reggaeton, Dancehall, Flamenco, Latin pop |
| `unverified` | Still to be mapped | 待核實資料 | 未確認 | none |

Counts on the treemap use this one family. Do not add branch counts together; they overlap.

## Fields

- `main`: the best single genre label, in English.
- `sub`: other applicable labels. May repeat ideas in `main`. Do not use them as a ranking.
- `adjacent`: neighbours a listener might try next. Not claims that the artist plays those styles.
- `descriptors`: texture words (hazy, industrial, melodic). Not genres. Leave them untranslated in the UI.
- `parent`: a short English path such as `Hip-hop → alternative rap`.
- `releases`: a few entry points that were actually checked. Never a guessed festival set.
- `confidence`:
  - `strong` — biography, genre, and at least one release are backed by the listed sources.
  - `partial` — the bill is real, but genre or releases rest on thin or secondary evidence.
  - `unverified` — the name is on the bill and little else is established. Prefer family `unverified`.
- `sources`: pages you actually used. Title plus URL. The official Primavera URL also lives in `official`.

`sound_*` explains the placement. `listen_*` is an editorial listening cue and must be described as such. `note_*` records disputes, joint bills, and gaps.

## Naming genres

Store the English key. Add a Traditional Chinese and Japanese label in `genreZh` and `genreJa` inside `src/i18n/ui.ts` when the key is new. If no glossary entry exists, the UI shows the English key, which is acceptable for a first pass.

Prefer the existing glossary over a new synonym. `Synthpop` and `Synth-pop` already both map to the same translation; do not add a third spelling.

## Adding an act

1. Confirm the name is a distinct billed act. A B2B or collaboration is one card.
2. Set `id` to a stable slug. Do not renumber everyone; set `index` to the next free index.
3. Choose one family. Put crossed styles in `sub` and `adjacent`.
4. Write `bio`, `sound`, `listen`, and `note` in English and Traditional Chinese. Add Japanese, or leave `_ja` empty so the page falls back to English and say so in the note.
5. Copy markdown links `[label](url)` unchanged across languages.
6. Set `confidence` honestly. Add sources.
7. Put a portrait at `public/images/<id>.webp` and set `localImage` to `/images/<id>.webp`. Credit remains Primavera Sound media, not the MIT license.
8. Run `npm run check-ja` if Japanese prose was added.

## Listening routes

Routes in `src/i18n/ui.ts` (`ROUTES`) are editorial paths. They are not collaborations and not running order. Name acts with the billed `name` so the page can resolve them.
