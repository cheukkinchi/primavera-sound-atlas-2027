// Builds the share card and favicons in public/.
//   node scripts/make-share-assets.mjs
// Needs network once: it fetches the Don Caballero photo named in artists.json
// and the Archivo Black font (SIL OFL) into a temp folder. Outputs are committed.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const pub = join(root, 'public');
const work = join(tmpdir(), 'psa-share-assets');
await mkdir(work, { recursive: true });

const FONT_URL = 'https://github.com/google/fonts/raw/main/ofl/archivoblack/ArchivoBlack-Regular.ttf';
const fontPath = join(work, 'ArchivoBlack-Regular.ttf');
const photoPath = join(work, 'don-caballero.jpg');

async function download(url, to) {
  if (existsSync(to)) return;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  await writeFile(to, Buffer.from(await res.arrayBuffer()));
}

const artists = JSON.parse(await readFile(join(root, 'src/data/artists.json'), 'utf8'));
const don = artists.find((artist) => artist.id === 'don-caballero');
if (!don?.image) throw new Error('don-caballero has no image URL');
await download(don.image, photoPath);
await download(FONT_URL, fontPath);

const { default: sharp } = await import('sharp');
const { default: opentype } = await import('opentype.js');

// ---- Share card, 1200 x 630 ----
const W = 1200;
const H = 630;
const PHOTO_H = 380;
const INK = '#171715';
const families = ['#446bcb', '#d3568c', '#278262', '#ba462e', '#b58c25', '#73528b', '#467787', '#d26b25'];

const photo = await sharp(photoPath)
  .resize(W, PHOTO_H, { fit: 'cover', position: 'attention' })
  .grayscale()
  .linear(1.08, -6)
  .toBuffer();

const dots = families
  .map((fill, i) => {
    const r = [13, 17, 11, 20, 14, 18, 12, 16][i];
    return `<circle cx="${W - 64 - (families.length - 1 - i) * 46}" cy="${PHOTO_H + 70}" r="${r}" fill="${fill}"/>`;
  })
  .join('');

const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect x="0" y="${PHOTO_H}" width="${W}" height="${H - PHOTO_H}" fill="#ffffff"/>
  <rect x="0" y="${PHOTO_H}" width="${W}" height="2" fill="${INK}"/>
  <g font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="700" fill="${INK}">
    <text x="64" y="${PHOTO_H + 206}" font-size="19" letter-spacing="2.2">INDEPENDENT LISTENING ATLAS · NOT AFFILIATED WITH PRIMAVERA SOUND</text>
  </g>
  ${dots}
  <g font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="700" fill="${INK}" text-anchor="end">
    <text x="${W - 64}" y="${PHOTO_H + 140}" font-size="19" letter-spacing="2.2">BARCELONA · 02–06 JUN 2027</text>
  </g>
  <rect x="0" y="${PHOTO_H - 44}" width="360" height="44" fill="${INK}"/>
  <text x="24" y="${PHOTO_H - 15}" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-weight="700" font-size="17" letter-spacing="1.8" fill="#ffffff">DON CABALLERO · PHOTO: PRIMAVERA SOUND</text>
</svg>`);

// sharp's bundled fontconfig can't load custom fonts, so the title is drawn as outlined glyphs.
const font = opentype.parse((await readFile(fontPath)).buffer.slice(0));
const titlePath = (text, x, y, size, tracking) => {
  const scale = size / font.unitsPerEm;
  let cursor = x;
  let d = '';
  for (const glyph of font.stringToGlyphs(text)) {
    d += glyph.getPath(cursor, y, size).toPathData(2);
    cursor += glyph.advanceWidth * scale + tracking;
  }
  return `<path d="${d}" fill="${INK}"/>`;
};
const title = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${titlePath(
    'PRIMAVERA SOUND',
    64,
    PHOTO_H + 100,
    54,
    -2.2,
  )}${titlePath('ATLAS 2027', 64, PHOTO_H + 162, 54, -2.2)}</svg>`,
);

await sharp({ create: { width: W, height: H, channels: 3, background: '#ffffff' } })
  .composite([
    { input: photo, top: 0, left: 0 },
    { input: overlay, top: 0, left: 0 },
    { input: title, top: 0, left: 0 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(join(pub, 'og.jpg'));

// ---- Favicons: a black dot ----
const dotSvg = (size, { pad = 0, bg = null, fill = INK } = {}) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${
      bg ? `<rect width="${size}" height="${size}" fill="${bg}"/>` : ''
    }<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - pad}" fill="${fill}"/></svg>`,
  );

// SVG favicon: black dot, flips to white only where the browser UI is dark.
await writeFile(
  join(pub, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><style>circle{fill:${INK}}@media (prefers-color-scheme:dark){circle{fill:#fff}}</style><circle cx="16" cy="16" r="13"/></svg>\n`,
);

// ICO (PNG-compressed 16, 32, 48) for crawlers and older browsers.
const sizes = [16, 32, 48];
const pngs = await Promise.all(
  sizes.map((s) => sharp(dotSvg(s * 4, { pad: s * 4 * 0.1 })).resize(s, s).png().toBuffer()),
);
const header = Buffer.alloc(6);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = pngs.map((png, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(sizes[i], 0);
  e.writeUInt8(sizes[i], 1);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(png.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += png.length;
  return e;
});
await writeFile(join(pub, 'favicon.ico'), Buffer.concat([header, ...entries, ...pngs]));

// iOS ignores transparency, so give the home-screen icon a white ground.
await sharp(dotSvg(720, { pad: 720 * 0.2, bg: '#ffffff' })).resize(180, 180).png().toFile(join(pub, 'apple-touch-icon.png'));

console.log('wrote og.jpg, favicon.svg, favicon.ico, apple-touch-icon.png');
