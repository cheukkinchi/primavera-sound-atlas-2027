import artistsJson from '../data/artists.json';
import type { Artist } from '../data/types';
import { familyName, genreLabel, t, type Lang } from '../i18n/ui';
import { familyOf, type AtlasState } from '../lib/model';
import { esc } from '../lib/text';
import {
  renderArtists,
  renderBranches,
  renderDots,
  renderFilters,
  renderProfile,
  renderSaved,
  renderTreemap,
  resultCount,
} from '../lib/render';

const artists = artistsJson as Artist[];
const lang = (document.documentElement.dataset.lang || 'zh') as Lang;

const $ = (selector: string) => document.querySelector(selector);
const SAVED_COOKIE = 'psa-list';

function readSaved() {
  const row = document.cookie.split('; ').find((item) => item.startsWith(`${SAVED_COOKIE}=`));
  if (!row) return new Set<string>();
  const ids = decodeURIComponent(row.slice(SAVED_COOKIE.length + 1))
    .split(',')
    .filter((id) => artists.some((artist) => artist.id === id));
  return new Set(ids);
}

function writeSaved(saved: Set<string>) {
  const value = encodeURIComponent([...saved].join(','));
  document.cookie = `${SAVED_COOKIE}=${value}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

const state: AtlasState = {
  lang,
  family: 'all',
  mapFamily: 'guitar',
  query: '',
  frequency: false,
  view: 'grid',
  sort: 'az',
  limit: 24,
  saved: readSaved(),
  selected: null,
};

function notify(message: string) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(() => toast.classList.remove('visible'), 1800);
}
notify.timer = 0;

function paintArtists() {
  const grid = $('#artists');
  const count = $('#result-count');
  const empty = $('#empty') as HTMLElement | null;
  const more = $('#load-more') as HTMLElement | null;
  if (!grid || !count || !empty || !more) return;
  const view = renderArtists(artists, state);
  grid.innerHTML = view.html;
  grid.classList.toggle('list-mode', state.view === 'list');
  count.textContent = resultCount(view.shown, view.total, state.lang);
  empty.hidden = view.total > 0;
  more.hidden = state.limit >= view.total;
  $('#grid-view')?.setAttribute('aria-pressed', String(state.view === 'grid'));
  $('#list-view')?.setAttribute('aria-pressed', String(state.view === 'list'));
}

function paintFilters() {
  const node = $('#family-filters');
  if (node) node.innerHTML = renderFilters(artists, state);
}

function paintDots() {
  const node = $('#dots');
  if (node) node.innerHTML = renderDots(artists, state);
}

function paintMap() {
  const map = $('#treemap');
  const tree = $('#family-tree');
  if (map) map.innerHTML = renderTreemap(artists, state);
  if (tree) tree.innerHTML = renderBranches(artists, state);
}

function updateSaved() {
  document.querySelectorAll('.saved-count').forEach((node) => {
    node.textContent = String(state.saved.size);
  });
  document.querySelectorAll<HTMLButtonElement>('[data-save]').forEach((button) => {
    const yes = state.saved.has(button.dataset.save || '');
    button.setAttribute('aria-pressed', String(yes));
    if (button.classList.contains('card-bookmark')) {
      button.textContent = yes ? '✓' : '＋';
      const artist = artists.find((item) => item.id === button.dataset.save);
      button.setAttribute('aria-label', `${yes ? t(state.lang, 'remove') : t(state.lang, 'save')} ${artist?.name || ''}`);
    } else if (button.classList.contains('profile-save')) {
      button.textContent = yes ? t(state.lang, 'saved') : t(state.lang, 'save');
    }
  });
}

function openProfile(id: string) {
  const artist = artists.find((item) => item.id === id);
  const dialog = $('#profile') as HTMLDialogElement | null;
  const content = $('#profile-content');
  if (!artist || !dialog || !content) return;
  const saved = $('#saved-dialog') as HTMLDialogElement | null;
  if (saved?.open) saved.close();
  state.selected = id;
  content.innerHTML = renderProfile(artists, artist, state);
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
}

function closeDialog(id: string) {
  const dialog = document.getElementById(id) as HTMLDialogElement | null;
  dialog?.close();
  if (id === 'profile') state.selected = null;
}

function toggleSave(id: string) {
  if (state.saved.has(id)) {
    state.saved.delete(id);
    notify(t(state.lang, 'removed'));
  } else {
    state.saved.add(id);
    notify(t(state.lang, 'added'));
  }
  writeSaved(state.saved);
  updateSaved();
  const saved = $('#saved-dialog') as HTMLDialogElement | null;
  if (saved?.open) {
    const buttons = [...document.querySelectorAll<HTMLElement>('#saved-content [data-save]')];
    const position = buttons.findIndex((button) => button === document.activeElement);
    renderSavedDialog();
    if (position >= 0) {
      const next = [...document.querySelectorAll<HTMLElement>('#saved-content [data-save]')];
      const close = document.querySelector<HTMLElement>('#saved-content [data-close]');
      (next[Math.min(position, next.length - 1)] ?? close)?.focus();
    }
  }
}

function renderSavedDialog() {
  const content = $('#saved-content');
  if (content) content.innerHTML = renderSaved(artists, state);
}

function fillPrintSheet() {
  const sheet = $('#print-list');
  if (!sheet) return;
  const items = artists.filter((artist) => state.saved.has(artist.id));
  const locale = state.lang === 'zh' ? 'zh-Hant' : state.lang === 'ja' ? 'ja' : 'en-GB';
  const date = new Date().toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  const rows = items
    .map((artist) => {
      const releases = artist.releases.length ? artist.releases.join(' · ') : '—';
      return `<tr><td>${esc(artist.name)}</td><td><span class="print-family" style="--family:${familyOf(artist.family).color}">${esc(familyName(state.lang, artist.family))}</span></td><td>${esc(genreLabel(state.lang, artist.main))}</td><td>${esc(releases)}</td></tr>`;
    })
    .join('');
  const body = items.length
    ? `<table><thead><tr><th>${esc(t(state.lang, 'colArtist'))}</th><th>${esc(t(state.lang, 'colFamily'))}</th><th>${esc(t(state.lang, 'colGenre'))}</th><th>${esc(t(state.lang, 'colReleases'))}</th></tr></thead><tbody>${rows}</tbody></table>`
    : `<p>${esc(t(state.lang, 'savedEmpty'))}</p>`;
  sheet.innerHTML = `<p class="print-kicker">PRIMAVERA SOUND ATLAS · 2027</p><h1>${esc(t(state.lang, 'myList'))}</h1><p class="print-meta">${esc(date)} · ${items.length}</p>${body}`;
}

function exportSaved() {
  const previousTitle = document.title;
  document.title = 'Primavera-2027-Listening-List';
  const restore = () => {
    document.title = previousTitle;
    window.removeEventListener('afterprint', restore);
  };
  window.addEventListener('afterprint', restore);
  window.print();
}
window.addEventListener('beforeprint', fillPrintSheet);

function resetFilters() {
  state.family = 'all';
  state.query = '';
  state.frequency = false;
  state.limit = 24;
  const search = $('#search') as HTMLInputElement | null;
  const freq = $('#your-frequency') as HTMLInputElement | null;
  if (search) search.value = '';
  if (freq) freq.checked = false;
  paintFilters();
  paintDots();
  paintArtists();
}

function searchGenre(query: string) {
  const profile = $('#profile') as HTMLDialogElement | null;
  if (profile?.open) closeDialog('profile');
  state.query = query;
  state.family = 'all';
  state.frequency = false;
  state.limit = 24;
  const search = $('#search') as HTMLInputElement | null;
  const freq = $('#your-frequency') as HTMLInputElement | null;
  if (search) search.value = query;
  if (freq) freq.checked = false;
  paintFilters();
  paintDots();
  paintArtists();
  $('#explore')?.scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('click', (event) => {
  const target = event.target as Element | null;
  if (!target) return;
  const open = target.closest<HTMLElement>('[data-open]');
  if (open?.dataset.open) {
    openProfile(open.dataset.open);
    return;
  }
  const save = target.closest<HTMLElement>('[data-save]');
  if (save?.dataset.save) {
    toggleSave(save.dataset.save);
    return;
  }
  const close = target.closest<HTMLElement>('[data-close]');
  if (close?.dataset.close) {
    closeDialog(close.dataset.close);
    return;
  }
  const family = target.closest<HTMLElement>('[data-family]');
  if (family?.dataset.family) {
    state.family = family.dataset.family;
    state.limit = 24;
    paintFilters();
    paintDots();
    paintArtists();
    if (!family.closest('#family-filters')) $('#explore')?.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  const mapFamily = target.closest<HTMLElement>('[data-map-family]');
  if (mapFamily?.dataset.mapFamily) {
    state.mapFamily = mapFamily.dataset.mapFamily;
    paintMap();
    return;
  }
  const search = target.closest<HTMLElement>('[data-search]');
  if (search?.dataset.search) {
    searchGenre(search.dataset.search);
    return;
  }
  if (target.closest('#export-list')) exportSaved();
});

$('#search')?.addEventListener('input', (event) => {
  state.query = (event.target as HTMLInputElement).value;
  state.limit = 24;
  paintArtists();
});
$('#your-frequency')?.addEventListener('change', (event) => {
  state.frequency = (event.target as HTMLInputElement).checked;
  state.limit = 24;
  paintArtists();
});
$('#sort')?.addEventListener('change', (event) => {
  state.sort = (event.target as HTMLSelectElement).value as AtlasState['sort'];
  state.limit = 24;
  paintArtists();
});
$('#grid-view')?.addEventListener('click', () => {
  state.view = 'grid';
  paintArtists();
});
$('#list-view')?.addEventListener('click', () => {
  state.view = 'list';
  paintArtists();
});
$('#clear-filters')?.addEventListener('click', resetFilters);
$('#empty-reset')?.addEventListener('click', resetFilters);
$('#load-more')?.addEventListener('click', () => {
  state.limit += 24;
  paintArtists();
});
$('#mylist')?.addEventListener('click', () => {
  renderSavedDialog();
  const dialog = $('#saved-dialog') as HTMLDialogElement | null;
  dialog?.showModal();
});

['profile', 'saved-dialog'].forEach((id) => {
  const dialog = document.getElementById(id) as HTMLDialogElement | null;
  dialog?.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
      closeDialog(id);
    }
  });
  dialog?.addEventListener('close', () => {
    if (id === 'profile') state.selected = null;
  });
});

document.addEventListener('keydown', (event) => {
  const profile = $('#profile') as HTMLDialogElement | null;
  const saved = $('#saved-dialog') as HTMLDialogElement | null;
  if (event.key !== '/' || profile?.open || saved?.open) return;
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
  event.preventDefault();
  ($('#search') as HTMLInputElement | null)?.focus();
});

$('#dots')?.addEventListener('pointerover', (event) => {
  const button = (event.target as Element).closest<HTMLElement>('[data-open]');
  const tip = $('#dot-tooltip');
  if (!button || !tip) return;
  const artist = artists.find((item) => item.id === button.dataset.open);
  if (!artist) return;
  tip.textContent = `${artist.name} / ${genreLabel(state.lang, artist.main)}`;
  tip.classList.add('show');
});
$('#dots')?.addEventListener('pointerleave', () => $('#dot-tooltip')?.classList.remove('show'));

function useFallback(img: HTMLImageElement) {
  const fallback = img.dataset.fallback;
  if (!fallback) return;
  delete img.dataset.fallback;
  img.src = fallback;
}
document.addEventListener(
  'error',
  (event) => {
    if (event.target instanceof HTMLImageElement) useFallback(event.target);
  },
  true,
);
document.querySelectorAll<HTMLImageElement>('img[data-fallback]').forEach((img) => {
  if (img.currentSrc && img.complete && img.naturalWidth === 0) useFallback(img);
});

function syncControls() {
  const query = ($('#search') as HTMLInputElement | null)?.value || '';
  const frequency = ($('#your-frequency') as HTMLInputElement | null)?.checked ?? false;
  const sort = ($('#sort') as HTMLSelectElement | null)?.value === 'discovery' ? 'discovery' : 'az';
  if (query === state.query && frequency === state.frequency && sort === state.sort) return false;
  state.query = query;
  state.frequency = frequency;
  state.sort = sort;
  state.limit = 24;
  return true;
}

if (syncControls() || state.saved.size) {
  paintArtists();
  updateSaved();
}
window.addEventListener('pageshow', () => {
  if (syncControls()) {
    paintArtists();
    updateSaved();
  }
});
