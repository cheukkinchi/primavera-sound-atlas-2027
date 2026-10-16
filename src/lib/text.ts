export const esc = (value: unknown) =>
  String(value ?? '').replace(/[&<>"']/g, (char) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char,
  );

export const textOnly = (value: string) =>
  String(value || '')
    .replace(/\[([^\]]+)\]\((https?:\/\/(?:[^()\s]+|\([^()]*\))+)\)/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .trim();

export const markdown = (value: string) =>
  esc(value || '')
    .replace(
      /\[([^\]]+)\]\((https?:\/\/(?:[^()\s]+|\([^()]*\))+)\)/g,
      (_, label: string, url: string) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`,
    )
    .replace(/\n/g, '<br>');

export const canonical = (value: string) =>
  String(value)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
