import { FAMILIES, FAMILY_ORDER, type FamilyId } from '../data/families';
import type { Artist } from '../data/types';
import { LESSONS, ROUTES, familyName, field, genreLabel, t, type Lang } from '../i18n/ui';
import { familyCount, familyOf, filtered, findByName, isFrequency, orderedForDots, relatedArtists, type AtlasState } from './model';
import { canonical, esc, markdown, textOnly } from './text';

const imageUrl = (artist: Artist) => artist.localImage || artist.image;

const photo = (artist: Artist, attrs = '') =>
  `<img src="${esc(imageUrl(artist))}" alt="${esc(artist.name)}" loading="lazy" decoding="async" width="600" height="460" ${attrs} onerror="this.onerror=null;this.src='${esc(artist.image)}'">`;

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
      const dim = state.family !== 'all' && artist.family !== state.family ? ' dim' : '';
      const label = `${artist.name} · ${genreLabel(state.lang, artist.main)}`;
      return `<button class="dot${dim}" data-open="${esc(artist.id)}" style="--dot:${familyOf(artist.family).color}" aria-label="${esc(label)}"></button>`;
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

export function renderProfile(artists: Artist[], artist: Artist, state: AtlasState) {
  const lang = state.lang;
  const related = relatedArtists(artists, artist);
  const saved = state.saved.has(artist.id);
  const mainLabel = lang !== 'en' && genreLabel(lang, artist.main) !== artist.main ? `${esc(genreLabel(lang, artist.main))} / ` : '';
  const tags = (items: string[], labelled: boolean) =>
    items.map((item) => `<button class="tag tag-button" data-search="${esc(item)}">${esc(labelled ? genreLabel(lang, item) : item)}</button>`).join('') || '<span>n.a.</span>';
  const releases = artist.releases.length
    ? `<ol class="release-list">${artist.releases
        .map(
          (release, index) =>
            `<li><span>${String(index + 1).padStart(2, '0')} / ${esc(release)}</span><a href="https://open.spotify.com/search/${encodeURIComponent(artist.name + ' ' + release)}" target="_blank" rel="noopener noreferrer">${t(lang, 'listenSearch')} ↗</a></li>`,
        )
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
