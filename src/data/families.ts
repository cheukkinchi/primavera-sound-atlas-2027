export const FAMILY_ORDER = [
  'guitar',
  'pop',
  'electronic',
  'rap',
  'folk',
  'heavy',
  'experimental',
  'global',
  'unverified',
] as const;

export type FamilyId = (typeof FAMILY_ORDER)[number];

export type Family = {
  en: string;
  zh: string;
  ja: string;
  color: string;
  text: string;
  branches: string[];
};

export const FAMILIES: Record<FamilyId, Family> = {
  guitar: {
    en: 'Rock & Alternative',
    zh: '搖滾及另類',
    ja: 'ロックとオルタナティブ',
    color: '#446bcb',
    text: '#ffffff',
    branches: ['Indie rock', 'Shoegaze', 'Post-punk', 'Post-rock'],
  },
  pop: {
    en: 'Pop & R&B',
    zh: '流行與 R&B',
    ja: 'ポップと R&B',
    color: '#d3568c',
    text: '#171714',
    branches: ['Art pop', 'Synthpop', 'Alternative R&B', 'Dance-pop'],
  },
  electronic: {
    en: 'Electronic & club',
    zh: '電子與舞池',
    ja: 'エレクトロニックとクラブ',
    color: '#278262',
    text: '#ffffff',
    branches: ['House', 'Techno', 'UK bass', 'Breakbeat'],
  },
  rap: {
    en: 'Hip-hop & rap',
    zh: 'Hip-hop 與饒舌',
    ja: 'ヒップホップとラップ',
    color: '#ba462e',
    text: '#ffffff',
    branches: ['Hip-hop', 'Trap', 'Southern hip-hop', 'Experimental hip-hop'],
  },
  folk: {
    en: 'Folk & songwriters',
    zh: '民謠與創作',
    ja: 'フォークとシンガーソングライター',
    color: '#b58c25',
    text: '#171714',
    branches: ['Indie folk', 'Chamber folk', 'Singer-songwriter', 'Country'],
  },
  heavy: {
    en: 'Heavy & hardcore',
    zh: '重型與硬核',
    ja: 'ヘヴィとハードコア',
    color: '#73528b',
    text: '#ffffff',
    branches: ['Hardcore punk', 'Metalcore', 'Doom metal', 'Grindcore'],
  },
  experimental: {
    en: 'Ambient & leftfield',
    zh: '氛圍與實驗',
    ja: 'アンビエントとレフトフィールド',
    color: '#467787',
    text: '#ffffff',
    branches: ['Ambient', 'Experimental electronic', 'Drone', 'Avant-pop'],
  },
  global: {
    en: 'Latin & beyond',
    zh: '拉丁與跨界',
    ja: 'ラテンとその先',
    color: '#d26b25',
    text: '#171714',
    branches: ['Reggaeton', 'Dancehall', 'Flamenco', 'Latin pop'],
  },
  unverified: {
    en: 'Still to be mapped',
    zh: '待核實資料',
    ja: '未確認',
    color: '#8b8b7e',
    text: '#171714',
    branches: [],
  },
};
