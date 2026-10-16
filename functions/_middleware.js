const LOCALES = [
  { prefix: 'ja', path: '/ja/' },
  { prefix: 'en', path: '/en/' },
  { prefix: 'zh', path: '/zh-hant/' },
];

function localeFromAcceptLanguage(header) {
  const tags = (header || '')
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const quality = params.map((param) => param.trim()).find((param) => param.startsWith('q='));
      return { tag, q: quality ? Number(quality.slice(2)) : 1 };
    })
    .filter((item) => item.tag && !Number.isNaN(item.q))
    .sort((a, b) => b.q - a.q)
    .map((item) => item.tag);
  for (const tag of tags) {
    const value = tag.toLowerCase();
    const match = LOCALES.find((locale) => value === locale.prefix || value.startsWith(`${locale.prefix}-`));
    if (match) return match.path;
  }
  return '/zh-hant/';
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.pathname !== '/') return context.next();
  const path = localeFromAcceptLanguage(context.request.headers.get('accept-language'));
  return Response.redirect(new URL(path, url.origin), 302);
}
