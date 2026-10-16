import { FAMILIES, FAMILY_ORDER, type FamilyId } from '../data/families';
import type { Artist } from '../data/types';
import { familyName, genreJa, genreZh, type Lang } from '../i18n/ui';
import { canonical } from './text';

export type AtlasState = {
  lang: Lang;
  family: string;
  mapFamily: string;
  query: string;
  frequency: boolean;
  view: 'grid' | 'list';
  sort: 'az' | 'discovery';
  limit: number;
  saved: Set<string>;
  selected: string | null;
};

export const confidenceRank: Record<Artist['confidence'], number> = {
  strong: 0,
  partial: 1,
  unverified: 2,
};

export function isFrequency(artist: Artist) {
  return /shoegaze|dream.?pop|slowcore|post.?rock|ambient|ethereal|melanchol|atmospheric|drone/i.test(
    [artist.main, ...artist.sub, ...artist.adjacent, ...artist.descriptors].join(' '),
  );
}

export function familyCount(artists: Artist[], id: string) {
  return artists.filter((artist) => artist.family === id).length;
}

export function familyOf(id: string) {
  return FAMILIES[id as FamilyId] ?? FAMILIES.unverified;
}

export function searchBlob(artist: Artist) {
  const genres = [artist.main, ...artist.sub, ...artist.adjacent];
  const translated = genres.flatMap((genre) => [genreZh[genre], genreJa[genre]].filter(Boolean));
  return canonical(
    [
      artist.name,
      ...genres,
      ...artist.descriptors,
      ...translated,
      artist.bio_en,
      artist.bio_zh,
      artist.bio_ja || '',
      familyName('zh', artist.family),
      familyName('en', artist.family),
      familyName('ja', artist.family),
    ].join(' '),
  );
}

export function filtered(artists: Artist[], state: AtlasState) {
  let result = artists.filter(
    (artist) =>
      (state.family === 'all' || artist.family === state.family) &&
      (!state.frequency || isFrequency(artist)),
  );
  const query = canonical(state.query.trim());
  if (query) result = result.filter((artist) => searchBlob(artist).includes(query));
  result.sort((a, b) => {
    if (state.sort === 'discovery') {
      const freq = Number(isFrequency(b)) - Number(isFrequency(a));
      if (freq) return freq;
      const confidence = confidenceRank[a.confidence] - confidenceRank[b.confidence];
      if (confidence) return confidence;
    }
    return a.name.localeCompare(b.name);
  });
  return result;
}

export function genreScore(a: Artist, b: Artist) {
  const genres = [b.main, ...b.sub, ...b.adjacent];
  return [a.main, ...a.sub, ...a.adjacent].reduce(
    (score, genre) => score + (genres.some((other) => canonical(other) === canonical(genre)) ? 3 : 0),
    a.family === b.family ? 1 : 0,
  );
}

export function relatedArtists(artists: Artist[], artist: Artist) {
  return artists
    .filter((other) => other.id !== artist.id && other.confidence !== 'unverified')
    .map((other) => ({ other, score: genreScore(artist, other) }))
    .filter((item) => item.score > 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.other);
}

export function orderedForDots(artists: Artist[]) {
  return [...artists].sort(
    (a, b) => FAMILY_ORDER.indexOf(a.family as FamilyId) - FAMILY_ORDER.indexOf(b.family as FamilyId),
  );
}

export function findByName(artists: Artist[], name: string) {
  return artists.find((artist) => canonical(artist.name) === canonical(name));
}
