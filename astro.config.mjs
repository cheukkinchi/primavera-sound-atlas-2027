import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://primavera-2027-sound-atlas.pages.dev',
  i18n: {
    defaultLocale: 'zh-hant',
    locales: ['zh-hant', 'en', 'ja'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
});
