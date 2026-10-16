import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const artists = JSON.parse(readFileSync('src/data/artists.json', 'utf8'));
const byId = new Map();
for (const file of readdirSync('scripts/ja-out').filter((name) => name.endsWith('.json'))) {
  const batch = JSON.parse(readFileSync(`scripts/ja-out/${file}`, 'utf8'));
  for (const row of batch) byId.set(row.id, row);
}

let missing = 0;
for (const artist of artists) {
  const row = byId.get(artist.id);
  if (!row) {
    missing += 1;
    continue;
  }
  for (const key of ['bio_ja', 'sound_ja', 'listen_ja', 'note_ja']) {
    if (typeof row[key] === 'string' && row[key].trim()) artist[key] = row[key];
  }
}
writeFileSync('src/data/artists.json', JSON.stringify(artists));
console.log(`merged ${byId.size}, missing ${missing}`);
