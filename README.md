# Primavera 2027 · Sound Atlas

Primavera Sound Barcelona 2027 的非官方聆聽地圖。繁體中文、English、日本語。

An independent listening atlas for the Primavera Sound Barcelona 2027 lineup. It is a guide for finding acts you might like. It is not a ranking, not an official genre list, and not affiliated with Primavera Sound.

Japanese artist profiles are machine-translated and still awaiting review. Interface copy in Japanese was written with the site.

## Develop

```bash
npm install
npm run dev
```

Open `http://localhost:4321`. The root page sends you to `/zh-hant/`, `/en/`, or `/ja/` from the browser language.

```bash
npm run build
npm run check-ja
```

Static files land in `dist/`.

## Data

Artist records live in `src/data/artists.json`. Photos in `public/images/` are Primavera Sound media assets. They are not covered by the license below. Classification sources are linked inside each profile.

Working rules for agents and editors: [AGENTS.md](AGENTS.md).

## Deploy

The public repository is [cheukkinchi/primavera-2027-sound-atlas](https://github.com/cheukkinchi/primavera-2027-sound-atlas).

Cloudflare Pages builds `main` with:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node | `22` |
| Production URL | https://primavera-2027-sound-atlas.pages.dev |

Connect the GitHub repo under Workers & Pages → Create → Pages → Connect to Git. After that, every push to `main` deploys, and pull requests get preview URLs.

## License

Code and original writing in this repository are [MIT](LICENSE). Artist photographs remain the property of their rights holders (Primavera Sound media assets) and are excluded.
