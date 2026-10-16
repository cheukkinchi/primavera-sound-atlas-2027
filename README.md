# Primavera 2027 · Sound Atlas

An independent listening atlas for the Primavera Sound Barcelona 2027 lineup. It is a guide for finding acts you might like. It is not a ranking, not an official genre list, and not affiliated with Primavera Sound. Japanese artist profiles are machine-translated and still awaiting review.



Primavera Sound Barcelona 2027 陣容的獨立聆聽地圖，幫你找到可能會喜歡的演出。這不是排名，也不是官方曲風分類，與 Primavera Sound 沒有任何關係。日文版的藝人介紹為機器翻譯，仍待校對。



Primavera Sound Barcelona 2027 のラインナップを聴いて巡るための、非公式のリスニング・アトラスです。気に入りそうなアーティストを見つけるためのガイドであり、ランキングでも公式のジャンル分類でもありません。Primavera Sound とは提携していません。アーティスト紹介文は機械翻訳で、現在レビュー待ちです。

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


| Setting          | Value                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------- |
| Build command    | `npm run build`                                                                              |
| Output directory | `dist`                                                                                       |
| Node             | `22`                                                                                         |
| Production URL   | [https://primavera-2027-sound-atlas.pages.dev](https://primavera-2027-sound-atlas.pages.dev) |


Connect the GitHub repo under Workers & Pages → Create → Pages → Connect to Git. After that, every push to `main` deploys, and pull requests get preview URLs.

## License

Code and original writing in this repository are [MIT](LICENSE).

Artist photographs under `public/images/` are Primavera Sound media assets. They remain the property of their rights holders and are not covered by the MIT license.