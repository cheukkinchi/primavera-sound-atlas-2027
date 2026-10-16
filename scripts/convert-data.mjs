import { readFileSync, writeFileSync, chmodSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const source = join(root, 'legacy', 'data.js');
globalThis.window = {};
require(source);
const artists = globalThis.window.ARTISTS;

if (!Array.isArray(artists) || artists.length === 0) {
  throw new Error('legacy/data.js did not export ARTISTS');
}

const normalised = artists.map((artist) => {
  const local = String(artist.localImage || '').replace(/^images\//, '/images/');
  return { ...artist, localImage: local };
});

const out = join(root, 'src', 'data', 'artists.json');
writeFileSync(out, JSON.stringify(normalised));
chmodSync(out, 0o644);
console.log(`wrote ${normalised.length} artists to ${out}`);
