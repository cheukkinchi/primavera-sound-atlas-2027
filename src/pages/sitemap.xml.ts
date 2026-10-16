import type { APIRoute } from 'astro';
import { HTML_LANG, LOCALES, localePath } from '../i18n/ui';

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://primavera-2027-sound-atlas.pages.dev');
  const url = (path: string) => new URL(path, origin).href;
  const alternates = [
    ...LOCALES.map((locale) => `    <xhtml:link rel="alternate" hreflang="${HTML_LANG[locale]}" href="${url(localePath(locale))}"/>`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${url(localePath('zh-hant'))}"/>`,
  ].join('\n');
  const entries = LOCALES.map(
    (locale) => `  <url>\n    <loc>${url(localePath(locale))}</loc>\n${alternates}\n  </url>`,
  ).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
