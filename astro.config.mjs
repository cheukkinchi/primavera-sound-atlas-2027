import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://primavera-sound-atlas-2027.pages.dev',
  i18n: {
    defaultLocale: 'zh-hant',
    locales: ['zh-hant', 'en', 'ja'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
});
