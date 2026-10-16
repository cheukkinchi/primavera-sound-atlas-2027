import { readFileSync } from 'node:fs';

const artists = JSON.parse(readFileSync('src/data/artists.json', 'utf8'));
const link = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;
let missing = 0;
let broken = 0;
for (const artist of artists) {
  for (const key of ['bio', 'sound', 'listen', 'note']) {
    const english = artist[`${key}_en`] || '';
    const japanese = artist[`${key}_ja`] || '';
    if (!japanese.trim()) {
      missing += 1;
      console.log('missing', artist.id, key);
      continue;
    }
    const urls = [...english.matchAll(link)].map((match) => match[0]);
    for (const token of urls) {
      if (!japanese.includes(token)) {
        broken += 1;
        console.log('link', artist.id, key, token);
      }
    }
  }
}
console.log(`artists ${artists.length}, empty ja fields ${missing}, missing links ${broken}`);
if (missing || broken) process.exit(1);
