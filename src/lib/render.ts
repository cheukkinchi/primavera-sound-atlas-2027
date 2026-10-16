import { billOf } from '../data/billing';
import { FAMILIES, FAMILY_ORDER, type FamilyId } from '../data/families';
import type { Artist } from '../data/types';
import { LESSONS, ROUTES, familyName, field, genreLabel, t, type Lang } from '../i18n/ui';
import { familyCount, familyOf, filtered, findByName, isFrequency, orderedForDots, relatedArtists, type AtlasState } from './model';
import { canonical, esc, markdown, textOnly } from './text';

const imageUrl = (artist: Artist) => artist.localImage || artist.image;

const photo = (artist: Artist, attrs = '') => {
  const src = imageUrl(artist);
  const fallback = artist.image && artist.image !== src ? ` data-fallback="${esc(artist.image)}"` : '';
  return `<img src="${esc(src)}" alt="${esc(artist.name)}" loading="lazy" decoding="async" width="600" height="460" ${attrs}${fallback}>`;
};

export function coverageText(artists: Artist[], lang: Lang) {
  const strong = artists.filter((artist) => artist.confidence === 'strong').length;
  const partial = artists.filter((artist) => artist.confidence === 'partial').length;
  const unknown = artists.length - strong - partial;
  return t(lang, 'coverage')
    .replace('{total}', String(artists.length))
    .replace('{strong}', String(strong))
    .replace('{partial}', String(partial))
    .replace('{unknown}', String(unknown));
}

export function resultCount(shown: number, total: number, lang: Lang) {
  return t(lang, 'resultCount').replace('{shown}', String(shown)).replace('{total}', String(total));
}

export function renderFilters(artists: Artist[], state: AtlasState) {
  const all = `<button class="family-chip ${state.family === 'all' ? 'active' : ''}" data-family="all" aria-pressed="${state.family === 'all'}">${t(state.lang, 'all')} <span class="count">${artists.length}</span></button>`;
  const chips = FAMILY_ORDER.filter((id) => familyCount(artists, id) > 0)
    .map((id) => {
      const family = FAMILIES[id];
      const active = state.family === id;
      return `<button class="family-chip ${active ? 'active' : ''}" data-family="${id}" style="--family:${family.color}" aria-pressed="${active}"><span class="swatch" aria-hidden="true"></span>${family[state.lang]}<span class="count">${familyCount(artists, id)}</span></button>`;
    })
    .join('');
  return all + chips;
}

export function renderDots(artists: Artist[], state: AtlasState) {
  return orderedForDots(artists)
    .map((artist) => {
      const bill = billOf(artist.id);
      const dim = state.family !== 'all' && artist.family !== state.family ? ' dim' : '';
      const place = bill === 'rest' ? '' : ` · ${t(state.lang, bill === 'lead' ? 'billLead' : 'billMid')}`;
      const label = `${artist.name} · ${genreLabel(state.lang, artist.main)}${place}`;
      return `<button class="dot bill-${bill}${dim}" data-open="${esc(artist.id)}" style="--dot:${familyOf(artist.family).color}" aria-label="${esc(label)}"></button>`;
    })
    .join('');
}

export function renderLegend(artists: Artist[], lang: Lang) {
  return FAMILY_ORDER.filter((id) => familyCount(artists, id) > 0)
    .map((id) => {
      const family = FAMILIES[id];
      return `<li><span class="swatch" style="--family:${family.color}"></span><span>${family[lang]}</span><b>${familyCount(artists, id)}</b></li>`;
    })
    .join('');
}

export function renderArtists(artists: Artist[], state: AtlasState) {
  const all = filtered(artists, state);
  const visible = all.slice(0, state.limit);
  const cards = visible
    .map((artist) => {
      const saved = state.saved.has(artist.id);
      const genres = [artist.main, ...artist.sub.filter((genre) => canonical(genre) !== canonical(artist.main))]
        .slice(0, 3)
        .map((genre) => genreLabel(state.lang, genre))
        .join(' · ');
      return `<article class="artist-card" style="--family:${familyOf(artist.family).color}">
        <button class="card-image" data-open="${esc(artist.id)}" aria-label="${esc(artist.name)}">${photo(artist)}<span class="card-number">${String(artist.index + 1).padStart(3, '0')}</span></button>
        <button class="card-bookmark" data-save="${esc(artist.id)}" aria-pressed="${saved}" aria-label="${esc((saved ? t(state.lang, 'remove') : t(state.lang, 'save')) + ' ' + artist.name)}">${saved ? '✓' : '＋'}</button>
        <div class="card-text"><div class="card-family">${familyName(state.lang, artist.family)}</div><button class="card-title" data-open="${esc(artist.id)}">${esc(artist.name)}<span class="arrow" aria-hidden="true">↗</span></button>
        <div class="card-genres">${esc(genres)}</div>
        <p class="card-bio">${esc(textOnly(field(artist, 'bio', state.lang)))}</p>${artist.confidence !== 'strong' ? `<div class="card-status">${t(state.lang, artist.confidence)}</div>` : ''}</div></article>`;
    })
    .join('');
  return { html: cards, total: all.length, shown: visible.length };
}

export function renderTreemap(artists: Artist[], state: AtlasState) {
  const entries = FAMILY_ORDER.filter((id) => id !== 'unverified' && familyCount(artists, id) > 0)
    .map((id) => [id, FAMILIES[id]] as const)
    .sort((a, b) => familyCount(artists, b[0]) - familyCount(artists, a[0]));
  const groups = [entries.filter((_, index) => index % 2 === 0), entries.filter((_, index) => index % 2 === 1)];
  return groups
    .map((group) => {
      const count = group.reduce((sum, [id]) => sum + familyCount(artists, id), 0);
      const tiles = group
        .map(([id, family]) => {
          const n = familyCount(artists, id);
          const selected = state.mapFamily === id;
          return `<button class="map-block ${selected ? 'selected' : ''}" data-map-family="${id}" aria-pressed="${selected}" style="--family:${family.color};color:${family.text};flex:${n}" aria-label="${esc(family[state.lang] + ' ' + n)}"><span>${family[state.lang]}</span><div><b>${n}</b> <small>${Math.round((n / artists.length) * 100)}%</small></div></button>`;
        })
        .join('');
      return `<div class="map-col" style="flex:${count}">${tiles}</div>`;
    })
    .join('');
}

export function renderBranches(artists: Artist[], state: AtlasState) {
  const family = familyOf(state.mapFamily);
  const acts = artists.filter((artist) => artist.family === state.mapFamily);
  const counts = new Map<string, number>();
  acts.forEach((artist) => {
    [...new Set([artist.main, ...artist.sub])].forEach((genre) => {
      if (genre !== 'n.a.') counts.set(genre, (counts.get(genre) || 0) + 1);
    });
  });
  const genres = [...counts].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const rows = genres
    .map(
      ([genre, count]) =>
        `<button class="tree-row branch" data-search="${esc(genre)}" style="--family:${family.color}"><span>${esc(genreLabel(state.lang, genre))}</span><small>${count} ↗</small></button>`,
    )
    .join('');
  return `<div class="tree-root" style="--family:${family.color}"><span class="tree-dot"></span><b>${family[state.lang]}</b><button data-family="${state.mapFamily}">${acts.length} ${t(state.lang, 'acts')} ↗</button></div>${rows}<p class="branch-note">${t(state.lang, 'branchNote')}</p>`;
}

export function renderLessons(lang: Lang) {
  return LESSONS.map(
    (lesson, index) =>
      `<article class="lesson"><h3>${esc(genreLabel(lang, lesson.genre))}<span>0${index + 1}</span></h3><p>${lesson[lang]}</p><button data-search="${esc(lesson.genre)}">${t(lang, 'exploreSound')} ↗</button></article>`,
  ).join('');
}

export function renderRoutes(artists: Artist[], lang: Lang) {
  return ROUTES.map((route, index) => {
    const chain = route.names
      .map((name) => findByName(artists, name))
      .filter((artist): artist is Artist => Boolean(artist))
      .map(
        (artist, position) =>
          `${position ? '<span class="chain-arrow" aria-hidden="true">→</span>' : ''}<button class="route-artist" data-open="${esc(artist.id)}">${photo(artist)}<span>${esc(artist.name)}</span></button>`,
      )
      .join('');
    return `<article class="route-card"><div class="route-intro"><span class="route-number">ROUTE 0${index + 1} / ${route.names.length} ${t(lang, 'routeActs')}</span><h3>${route[lang]}</h3><p>${route[`desc_${lang}`]}</p><p class="editorial">${t(lang, 'editorial')}</p></div><div class="route-chain">${chain}</div></article>`;
  }).join('');
}

const listenIcon = {
  spotify:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 1.8a10.2 10.2 0 1 0 0 20.4 10.2 10.2 0 0 0 0-20.4zm4.67 14.72a.63.63 0 0 1-.87.21c-2.38-1.45-5.38-1.78-8.91-.98a.63.63 0 1 1-.28-1.23c3.86-.88 7.17-.5 9.85 1.13.3.18.4.58.21.87zm1.16-2.59a.79.79 0 0 1-1.08.26c-2.73-1.68-6.89-2.16-10.12-1.18a.79.79 0 0 1-.46-1.52c3.7-1.12 8.3-.58 11.4 1.36.37.23.48.72.26 1.08zm.1-2.7C14.86 9.4 9.55 9.2 6.72 10.06a.94.94 0 1 1-.55-1.8c3.24-.98 9.16-.79 12.78 1.42a.94.94 0 1 1-.96 1.62z"/></svg>',
  apple:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-.1 2.9-2.2c.7-1 1.2-2.1 1.6-3.2-4.2-1.6-3.9-6.1-3.9-6.2zM14.7 6.4c.6-.8 1.1-1.9.9-3-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.8-.9 2.9 1 .1 2-.5 2.6-1.3z"/></svg>',
  youtube:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM9.8 15.6V8.8l6.2 3.4-6.2 3.4z"/></svg>',
};

function listenLinks(name: string, release: string, lang: Lang) {
  const query = encodeURIComponent(`${name} ${release}`);
  const links = [
    [`https://open.spotify.com/search/${query}`, listenIcon.spotify, t(lang, 'listenSpotify')],
    [`https://music.apple.com/search?term=${query}`, listenIcon.apple, t(lang, 'listenApple')],
    [`https://www.youtube.com/results?search_query=${query}`, listenIcon.youtube, t(lang, 'listenYouTube')],
  ];
  return `<span class="listen-links">${links
    .map(
      ([href, icon, label]) =>
        `<a href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${esc(label)}: ${esc(release)}">${icon}</a>`,
    )
    .join('')}</span>`;
}

export function renderProfile(artists: Artist[], artist: Artist, state: AtlasState) {
  const lang = state.lang;
  const related = relatedArtists(artists, artist);
  const saved = state.saved.has(artist.id);
  const mainLabel = lang !== 'en' && genreLabel(lang, artist.main) !== artist.main ? `${esc(genreLabel(lang, artist.main))} / ` : '';
  const tags = (items: string[], labelled: boolean) =>
    items.map((item) => `<button class="tag tag-button" data-search="${esc(item)}">${esc(labelled ? genreLabel(lang, item) : item)}</button>`).join('') || '<span>n.a.</span>';
  const releases = artist.releases.length
    ? `<ol class="release-list">${artist.releases
        .map((release, index) => `<li><span>${String(index + 1).padStart(2, '0')} / ${esc(release)}</span>${listenLinks(artist.name, release, lang)}</li>`)
        .join('')}</ol>`
    : `<p>${t(lang, 'noneReleases')}</p>`;
  const sources = artist.sources
    .map((source) => {
      let host = source.url;
      try {
        host = new URL(source.url).hostname;
      } catch {
        host = source.url;
      }
      return `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title || host)} ↗</a></li>`;
    })
    .join('');
  return `<div class="profile-top"><span>${t(lang, 'profileIndex')} / ${String(artist.index + 1).padStart(3, '0')}</span><div class="profile-top-actions"><button class="profile-save" data-save="${esc(artist.id)}" aria-pressed="${saved}">${saved ? t(lang, 'saved') : t(lang, 'save')}</button><button class="profile-close" data-close="profile" aria-label="${t(lang, 'close')}">×</button></div></div>
    <div class="profile-hero">${photo(artist, 'class="profile-portrait" loading="eager"')}<div class="profile-intro"><div class="card-family" style="--family:${familyOf(artist.family).color}">${familyName(lang, artist.family)} · ${t(lang, artist.confidence)}</div><h2 id="profile-title">${esc(artist.name)}</h2><div class="profile-main">${mainLabel}${esc(artist.main)}</div><div class="profile-parent">${esc(artist.parent)}</div></div></div>
    <div class="profile-body"><section class="profile-section"><h3>${t(lang, 'bio')}</h3><p>${markdown(field(artist, 'bio', lang))}</p></section>
    <section class="profile-section"><h3>${t(lang, 'sound')}</h3><p>${markdown(field(artist, 'sound', lang))}</p></section>
    <div class="profile-columns"><section class="profile-section"><h3>${t(lang, 'subs')}</h3><div class="tag-row">${tags(artist.sub, true)}</div></section><section class="profile-section"><h3>${t(lang, 'texture')}</h3><div class="tag-row">${tags(artist.descriptors, false)}</div></section></div>
    <section class="profile-section profile-listen"><h3>${t(lang, 'listen')}</h3><p>${markdown(field(artist, 'listen', lang))}</p></section>
    <section class="profile-section"><h3>${t(lang, 'entry')}</h3>${releases}</section>
    <section class="profile-section"><h3>${t(lang, 'adjacent')}</h3><div class="tag-row">${tags(artist.adjacent, true)}</div></section>
    <div class="profile-note"><b>${t(lang, 'note')}</b>${markdown(field(artist, 'note', lang))}<p>${t(lang, 'genreEvidence')}</p></div>
    ${related.length ? `<section class="profile-section related-block"><h3>${t(lang, 'related')}</h3><div class="profile-related">${related.map((item) => `<button data-open="${esc(item.id)}">${esc(item.name)} ↗</button>`).join('')}</div></section>` : ''}
    <section class="profile-section related-block"><h3>${t(lang, 'sources')}</h3><ol class="source-list">${sources}<li><a href="${esc(artist.official)}" target="_blank" rel="noopener noreferrer">${t(lang, 'allSources')} ↗</a></li></ol></section>
    <a class="profile-official" href="${esc(artist.official)}" target="_blank" rel="noopener noreferrer">${t(lang, 'officialProfile')}<span>↗</span></a></div>`;
}

export function renderSaved(artists: Artist[], state: AtlasState) {
  const saved = artists.filter((artist) => state.saved.has(artist.id));
  const items = saved.length
    ? saved
        .map(
          (artist) =>
            `<article class="saved-item">${photo(artist)}<button data-open="${esc(artist.id)}">${esc(artist.name)}<small>${esc(genreLabel(state.lang, artist.main))}</small></button><button data-save="${esc(artist.id)}" aria-pressed="true" aria-label="${t(state.lang, 'remove')} ${esc(artist.name)}">×</button></article>`,
        )
        .join('')
    : `<p>${t(state.lang, 'savedEmpty')}</p>`;
  const action = saved.length
    ? `<button class="primary" id="export-list">${t(state.lang, 'export')}</button>`
    : `<button class="primary" data-close="saved-dialog">${t(state.lang, 'browse')}</button>`;
  return `<div class="profile-top"><span>MY PRIMAVERA / ${saved.length}</span><button class="profile-close" data-close="saved-dialog" aria-label="${t(state.lang, 'close')}">×</button></div><div class="saved-body"><h2 id="saved-title">${t(state.lang, 'myList')}</h2><p>${t(state.lang, 'savedDesc')}</p><div class="saved-items">${items}</div>${action}</div>`;
}

export function isKnownFamily(id: string): id is FamilyId {
  return id in FAMILIES;
}

export { isFrequency };
