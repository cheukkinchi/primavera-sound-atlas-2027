import { FAMILIES, type FamilyId } from '../data/families';

export const LOCALES = ['zh-hant', 'en', 'ja'] as const;
export type Locale = (typeof LOCALES)[number];
export type Lang = 'zh' | 'en' | 'ja';

export const HTML_LANG: Record<Locale, string> = {
  'zh-hant': 'zh-Hant',
  en: 'en',
  ja: 'ja',
};

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function langOf(locale: Locale): Lang {
  if (locale === 'zh-hant') return 'zh';
  if (locale === 'ja') return 'ja';
  return 'en';
}

export function localePath(locale: Locale) {
  return `/${locale}/`;
}

type Copy = Record<Lang, string>;

export const UI = {
  navExplore: { zh: '探索藝人', en: 'Artists', ja: 'アーティスト' },
  navMap: { zh: '曲風地圖', en: 'Sound map', ja: 'サウンドマップ' },
  navRoutes: { zh: '聆聽路線', en: 'Listening routes', ja: 'リスニングルート' },
  myList: { zh: '我的清單', en: 'My list', ja: 'マイリスト' },
  heroTitle: { zh: '不只看陣容，<br>聽懂每個名字。', en: 'A whole world<br>between the names.', ja: '名前のあいだに、<br>ひとつの世界がある。' },
  heroDesc: {
    zh: '由結他聲牆走到凌晨舞池。把整個 Primavera 陣容，變成一張可以聆聽的音樂地圖。',
    en: 'From walls of guitar to the last dance at dawn. Find your way through every act on the Primavera lineup, one sound at a time.',
    ja: 'ギターの壁から夜明けのダンスフロアまで。Primavera の全ラインナップを、聴ける音楽地図にする。',
  },
  heroCta: { zh: '尋找你的下一隊愛團', en: 'Find your next favourite', ja: '次のお気に入りを探す' },
  acts: { zh: '組演出', en: 'acts to discover', ja: '組の出演' },
  worlds: { zh: '個聲音領域', en: 'sound worlds', ja: 'の音の領域' },
  noBoundaries: { zh: '曲風有交集，探索無邊界。', en: 'No borders. Just better ways to listen.', ja: '境界ではなく、聴き方を増やす。' },
  genomeTitle: { zh: '陣容，重新上色。', en: 'The lineup, recoloured.', ja: 'ラインナップを、色で読み直す。' },
  billLead: { zh: '領銜', en: 'Leading the bill', ja: '先頭' },
  billMid: { zh: '次輪點名', en: 'Second billing', ja: '二番手' },
  exploreTitle: { zh: '下一站，聽甚麼？', en: 'Where to next?', ja: '次は、何を聴く？' },
  exploreDesc: {
    zh: '從熟悉的曲風出發，也給陌生的聲音一點空間。',
    en: 'Start with a sound you love. Leave a little room for the unexpected.',
    ja: '知っている音から始めて、知らない音にも余白を残す。',
  },
  grid: { zh: '圖卡', en: 'Cards', ja: 'カード' },
  list: { zh: '列表', en: 'List', ja: 'リスト' },
  yourFrequency: { zh: '氣氛派優先', en: 'Your atmospheric side', ja: 'アンビエント寄り' },
  frequencyHint: { zh: 'Shoegaze · Dream pop · Post-rock', en: 'Shoegaze · Dream pop · Post-rock', ja: 'シューゲイズ · ドリームポップ · ポストロック' },
  sortLabel: { zh: '排序', en: 'Sort', ja: '並び替え' },
  sortAz: { zh: 'A → Z', en: 'A → Z', ja: 'A → Z' },
  discovery: { zh: '探索優先', en: 'Discovery first', ja: '発見優先' },
  clear: { zh: '重設篩選', en: 'Reset filters', ja: '絞り込みをリセット' },
  emptyTitle: { zh: '換個方向，還有很多聲音。', en: 'A different direction awaits.', ja: '方向を変えれば、まだ音がある。' },
  emptyDesc: {
    zh: '試試更簡單的關鍵字，或者清除篩選重新探索。',
    en: 'Try a shorter search, or reset the filters and start somewhere new.',
    ja: '短い言葉で探すか、絞り込みを消してやり直す。',
  },
  more: { zh: '再探索更多藝人', en: 'Keep exploring', ja: 'さらに見る' },
  mapTitle: { zh: '聲音之間，沒有圍牆。', en: 'Sounds without borders.', ja: '音のあいだに、壁はない。' },
  mapDesc: {
    zh: '區塊大小約按主要分類的人數分配。點擊領域，再沿支線探索；分類是導航，不是定論。',
    en: 'Tile sizes roughly reflect the number of acts in each primary family. Choose a world and follow its branches. A guide, never a verdict.',
    ja: '面の大きさは、主な分類に入る人数のおおよそ。領域を選び、支線をたどる。分類は案内であり、結論ではない。',
  },
  readMap: { zh: '如何閱讀這張地圖', en: 'How to read this map', ja: 'この地図の読み方' },
  guideTitle: { zh: '大類 → 分支 → 聲音質感', en: 'Family → branch → texture', ja: '大分類 → 支線 → 質感' },
  guideDesc: {
    zh: '同一位藝人可以跨越多種風格。這裡只選一個主要領域計算，詳細頁會保留次分類、相鄰風格與爭議。',
    en: 'An artist can live in more than one genre. Counts use one primary family; profiles preserve subgenres, neighbours and the grey areas.',
    ja: '一人のアーティストは複数のスタイルにまたがる。人数は主な領域ひとつで数え、詳細では下位分類・隣接・グレーゾーンを残す。',
  },
  mapCaveat: {
    zh: '圖譜並非嚴格歷史譜系。R&B、拉丁混種與實驗音樂等領域可能交疊。',
    en: 'This is a listening map, not a strict historical family tree. R&B, Latin hybrids and experimental music often cross its boundaries.',
    ja: 'これは聴取の地図であり、厳密な歴史的系譜ではない。R&B、ラテンの混成、実験音楽は境界を越える。',
  },
  branchNote: { zh: '支線分類可重疊，數量不應相加。', en: 'Branch counts overlap and should not be added.', ja: '支線は重なる。数を足し合わせない。' },
  routesTitle: { zh: '讓耳朵帶路。', en: 'Take the scenic route.', ja: '耳に道をゆだねる。' },
  routesDesc: {
    zh: '不是排名，是幾條從熟悉走向未知的聆聽路徑。先聽一組，再順著質感走下去。',
    en: 'Not a ranking. Three paths from familiar sounds into less familiar territory. Follow a texture, not the small print.',
    ja: '順位ではない。知っている音から、あまり知らない場所への三つの道。質感をたどる。',
  },
  methodTitle: { zh: '好的音樂地圖，<br>也會標示未知。', en: 'A good map leaves<br>room for the unknown.', ja: 'よい音楽地図は、<br>未知も書き込む。' },
  methodDesc: {
    zh: '名單以 Primavera 官方 A–Z 的獨立演出項目去重整理，包括 B2B 和聯名演出。音樂分類綜合藝人資料與編輯判斷，並不代表官方曲風標籤，也不是 2027 現場歌單預測。',
    en: 'The scope is the official A–Z, deduplicated by billed act, including B2Bs and collaborations. Genre placements combine source evidence with editorial interpretation. They are not official festival labels or predictions of 2027 setlists.',
    ja: '範囲は公式 A–Z を、請求された出演単位で重複なく整理したもの。B2B と連携も含む。分類は資料と編集判断の組み合わせであり、公式ジャンルでも 2027 年のセットリスト予測でもない。',
  },
  verificationNote: { zh: '名單核對與分類方法', en: 'Lineup verification and classification method', ja: 'ラインナップ照合と分類方法' },
  verificationBody: {
    zh: '2026 年 10 月 16 日官網 A–Z 去重後為 152 組。早期新聞公布 151 組，兩者數目不同，原因未能確認；官網頁首仍有 2026 舊字樣，但藝人連結與活動資料指向 2027。以目前獨立項目為範圍，不把多位合作藝人拆成重複條目。部分資料較少的名字會標記「資料有限」或「待核實」。曲風大類是本指南的導航分組，不是互斥的音樂學分類。',
    en: 'The official A–Z contained 152 unique acts on 16 October 2026. Early coverage announced 151; the reason for the mismatch has not been established. The official heading still contained a 2026 label, but artist links and event records point to 2027. Each collaboration is one billed entry. Thin or unresolved evidence is labelled explicitly. The navigation families are not mutually exclusive musicological categories.',
    ja: '2026 年 10 月 16 日の公式 A–Z は、重複を除くと 152 組。初期報道は 151 組で、差の理由は未確認。公式見出しには 2026 の古い表記が残るが、アーティストリンクとイベント記録は 2027 を指す。共演は請求された一件として扱い、分割して重複させない。資料が薄い名前は「限定的」または「未確認」と明記する。大分類は案内のためのグループであり、相互排他の音楽学分類ではない。',
  },
  officialLineup: { zh: '官方完整陣容', en: 'Official full lineup', ja: '公式ラインナップ' },
  announcement: { zh: '陣容公布報道', en: 'Lineup announcement', ja: 'ラインナップ発表記事' },
  footerNote: {
    zh: '非官方聆聽指南。與 Primavera Sound 並無隸屬關係。',
    en: 'An independent listening guide. Not affiliated with Primavera Sound.',
    ja: '非公式の聴取ガイド。Primavera Sound とは無関係。',
  },
  photoCredit: {
    zh: '藝人圖片：Primavera Sound 官方媒體素材。分類資料來源見各藝人介紹。',
    en: 'Artist photography via Primavera Sound. Music sources are credited in each profile.',
    ja: 'アーティスト写真は Primavera Sound の公式素材。分類の出典は各プロフィールに記す。',
  },
  shareAlt: {
    zh: '黑白照片：Don Caballero 成員靠近鏡頭。下方寫著 Primavera Sound Atlas 2027，旁邊是八個家族顏色的圓點。非官方聆聽指南。',
    en: 'Black and white photo of Don Caballero close to the camera. Below it: Primavera Sound Atlas 2027, beside eight dots in the family colours. An independent listening guide.',
    ja: 'Don Caballero のメンバーがカメラに寄った白黒写真。下に Primavera Sound Atlas 2027 と、ファミリー色の八つの点。非公式の聴取ガイド。',
  },
  all: { zh: '全部藝人', en: 'All artists', ja: 'すべて' },
  search: { zh: '搜尋藝人、曲風、聲音質感', en: 'Search artists, genres, textures', ja: 'アーティスト、ジャンル、質感を検索' },
  bio: { zh: '關於藝人', en: 'The artist', ja: 'アーティストについて' },
  sound: { zh: '為何這樣分類？', en: 'Why this classification?', ja: 'なぜこの分類か' },
  listen: { zh: '怎樣聽懂？', en: 'What to listen for', ja: 'どこを聴くか' },
  entry: { zh: '入門作品', en: 'Start listening', ja: '入り口になる作品' },
  subs: { zh: '次級分類', en: 'Subgenres', ja: '下位分類' },
  texture: { zh: '聲音質感', en: 'Sound palette', ja: '音の質感' },
  adjacent: { zh: '相鄰風格', en: 'Adjacent genres', ja: '隣接するスタイル' },
  note: { zh: '分類註記', en: 'Classification note', ja: '分類メモ' },
  sources: { zh: '資料來源', en: 'Sources', ja: '出典' },
  related: { zh: '沿著聲音繼續走', en: 'Follow the sound', ja: '音のつづき' },
  officialProfile: { zh: 'Primavera 官方藝人頁', en: 'Official Primavera profile', ja: 'Primavera 公式ページ' },
  save: { zh: '加入清單', en: 'Save', ja: 'リストに入れる' },
  saved: { zh: '已加入', en: 'Saved', ja: '追加済み' },
  close: { zh: '關閉', en: 'Close', ja: '閉じる' },
  strong: { zh: '資料充足', en: 'Source-backed', ja: '出典あり' },
  partial: { zh: '資料有限', en: 'Limited evidence', ja: '資料は限定的' },
  unverified: { zh: '待核實', en: 'Unverified', ja: '未確認' },
  results: { zh: '組藝人', en: 'acts', ja: '組' },
  total: { zh: '共', en: 'of', ja: '/' },
  profileIndex: { zh: '藝人檔案', en: 'Artist profile', ja: 'アーティストファイル' },
  set: { zh: '合作演出，曲風不等於現場預測。', en: 'A joint set is not a predictable genre playlist.', ja: '共演のジャンルは、当日のセットを予測しない。' },
  savedDesc: {
    zh: '清單存在這個瀏覽器的 cookie，下次打開還在。也可以匯出 PDF。',
    en: 'This list is stored in a cookie on this browser, so it is still here next time. You can also export a PDF.',
    ja: 'このリストはブラウザの cookie に残る。PDF でも書き出せる。',
  },
  savedEmpty: {
    zh: '清單還是空白。從任何藝人卡按「＋」，收集你想探索的名字。',
    en: 'Your list is a blank record. Hit ＋ on any artist to start collecting sounds.',
    ja: 'リストはまだ空。カードの「＋」で、聴きたい名前を集める。',
  },
  export: { zh: '匯出聆聽清單', en: 'Export listening list', ja: '聴取リストを書き出す' },
  colArtist: { zh: '藝人', en: 'Artist', ja: 'アーティスト' },
  colFamily: { zh: '聲音家族', en: 'Family', ja: 'ファミリー' },
  colGenre: { zh: '曲風', en: 'Genre', ja: 'ジャンル' },
  colReleases: { zh: '入門作品', en: 'Releases', ja: '入り口になる作品' },
  removed: { zh: '已從清單移除', en: 'Removed from your list', ja: 'リストから外した' },
  added: { zh: '已加入聆聽清單', en: 'Added to your listening list', ja: '聴取リストに入れた' },
  listenSpotify: { zh: '在 Spotify 搜尋', en: 'Search on Spotify', ja: 'Spotify で検索' },
  listenApple: { zh: '在 Apple Music 搜尋', en: 'Search on Apple Music', ja: 'Apple Music で検索' },
  listenYouTube: { zh: '在 YouTube 搜尋', en: 'Search on YouTube', ja: 'YouTube で検索' },
  noneReleases: {
    zh: '暫未核實入門作品，請參考官方藝人頁試聽。',
    en: 'No entry release verified yet. Follow the official artist profile to listen.',
    ja: '入り口になる作品はまだ確認していない。公式ページから聴く。',
  },
  genreEvidence: {
    zh: '分類與作品依據下方資料來源；「怎樣聽懂」及延伸關係含編輯聆聽建議。',
    en: 'Genre and release evidence is listed below. Listening cues and related-artist paths include editorial interpretation.',
    ja: '分類と作品の根拠は下の出典。聴きどころと関連は、編集上の聴取提案を含む。',
  },
  allSources: { zh: '官方演出資料與圖片', en: 'Official billing and photography', ja: '公式の出演情報と写真' },
  remove: { zh: '移除', en: 'Remove', ja: '外す' },
  browse: { zh: '返回探索', en: 'Back to exploring', ja: '探索に戻る' },
  exploreSound: { zh: '探索這個聲音', en: 'Explore this sound', ja: 'この音を探す' },
  showing: { zh: '顯示', en: 'Showing', ja: '表示' },
  legend: { zh: '圖例', en: 'Legend', ja: '凡例' },
  skip: { zh: '跳至藝人', en: 'Skip to artists', ja: 'アーティストへ' },
  backTop: { zh: '回到頁首', en: 'Back to top', ja: 'ページ上部へ' },
  languageLabel: { zh: '語言', en: 'Language', ja: '言語' },
  homeLabel: { zh: 'Primavera Sound Atlas 首頁', en: 'Primavera Sound Atlas home', ja: 'Primavera Sound Atlas ホーム' },
  switchView: { zh: '檢視方式', en: 'View mode', ja: '表示形式' },
  familyFilters: { zh: '音樂大類篩選', en: 'Music family filters', ja: '音楽の大分類' },
  editorial: {
    zh: '編輯探索路線，不代表合作或演出次序。',
    en: 'Editorial listening path, not a collaboration or running order.',
    ja: '編集上の聴取経路。共演や出演順を意味しない。',
  },
  routeActs: { zh: '組', en: 'acts', ja: '組' },
  coverage: {
    zh: '本版涵蓋 {total} 組演出：{strong} 組資料充足、{partial} 組資料有限、{unknown} 組待核實。每份介紹保留來源與資料限制。',
    en: 'This edition covers {total} billed acts: {strong} source-backed, {partial} with limited evidence, and {unknown} unverified. Each profile preserves its sources and limitations.',
    ja: 'この版は {total} 組。出典が十分なもの {strong}、資料が限定的なもの {partial}、未確認 {unknown}。各紹介は出典と限界を残す。',
  },
  resultCount: {
    zh: '顯示 {shown} / {total} 組藝人',
    en: 'Showing {shown} of {total} acts',
    ja: '{shown} / {total} 組を表示',
  },
  machineNote: {
    zh: '日文藝人介紹為機器翻譯，尚待校對。',
    en: 'Japanese artist profiles are machine-translated and still awaiting review.',
    ja: 'アーティスト紹介の日本語は機械翻訳で、校閲待ち。',
  },
} as const satisfies Record<string, Copy>;

export type UiKey = keyof typeof UI;

export function t(lang: Lang, key: UiKey) {
  return UI[key][lang];
}

export const genreZh: Record<string, string> = {
  'Indie rock': '獨立搖滾',
  'Alternative rock': '另類搖滾',
  Shoegaze: '瞪鞋搖滾',
  'Dream pop': '夢幻流行',
  Slowcore: '慢核',
  'Post-rock': '後搖',
  'Post-punk': '後龐克',
  'Noise pop': '噪音流行',
  'Noise rock': '噪音搖滾',
  'Math rock': '數學搖滾',
  'Art rock': '藝術搖滾',
  'Psychedelic rock': '迷幻搖滾',
  'Art pop': '藝術流行',
  Synthpop: '合成器流行',
  'Synth-pop': '合成器流行',
  Electropop: '電子流行',
  'Indie pop': '獨立流行',
  'Dance-pop': '舞曲流行',
  'Alternative R&B': '另類 R&B',
  'Experimental pop': '實驗流行',
  Ambient: '氛圍音樂',
  'Dark ambient': '暗黑氛圍',
  Drone: '持續音',
  'Experimental electronic': '實驗電子',
  Electronic: '電子',
  House: '浩室',
  Techno: '鐵克諾',
  'Dub techno': 'Dub techno',
  'Deep house': '深浩室',
  IDM: '智能舞曲',
  'Hip-hop': '嘻哈',
  Trap: 'Trap',
  'Indie folk': '獨立民謠',
  Folk: '民謠',
  'Chamber folk': '室內民謠',
  'Singer-songwriter': '創作歌手',
  'Hardcore punk': '硬核龐克',
  Metalcore: '金屬核',
  'Doom metal': '厄運金屬',
  Grindcore: '輾核',
  Reggaeton: '雷鬼動',
  Dancehall: 'Dancehall',
  Flamenco: '法蘭明高',
  'Chamber pop': '室內流行',
  Darkwave: '暗潮',
  Coldwave: '冷潮',
  'Dream folk': '夢幻民謠',
  'Folk rock': '民謠搖滾',
  'Lo-fi': '低傳真',
  'UK bass': '英國低音',
  Breakbeat: '碎拍',
  'Southern hip-hop': '南方嘻哈',
  'Experimental hip-hop': '實驗嘻哈',
  Country: '鄉村',
  'Latin pop': '拉丁流行',
  'Avant-pop': '前衛流行',
};

export const genreJa: Record<string, string> = {
  'Indie rock': 'インディーロック',
  'Alternative rock': 'オルタナティブロック',
  Shoegaze: 'シューゲイズ',
  'Dream pop': 'ドリームポップ',
  Slowcore: 'スローコア',
  'Post-rock': 'ポストロック',
  'Post-punk': 'ポストパンク',
  'Noise pop': 'ノイズポップ',
  'Noise rock': 'ノイズロック',
  'Math rock': 'マスロック',
  'Art rock': 'アートロック',
  'Psychedelic rock': 'サイケデリックロック',
  'Art pop': 'アートポップ',
  Synthpop: 'シンセポップ',
  'Synth-pop': 'シンセポップ',
  Electropop: 'エレクトロポップ',
  'Indie pop': 'インディーポップ',
  'Dance-pop': 'ダンスポップ',
  'Alternative R&B': 'オルタナティブ R&B',
  'Experimental pop': 'エクスペリメンタルポップ',
  Ambient: 'アンビエント',
  'Dark ambient': 'ダークアンビエント',
  Drone: 'ドローン',
  'Experimental electronic': '実験電子音楽',
  Electronic: 'エレクトロニック',
  House: 'ハウス',
  Techno: 'テクノ',
  'Dub techno': 'ダブテクノ',
  'Deep house': 'ディープハウス',
  IDM: 'IDM',
  'Hip-hop': 'ヒップホップ',
  Trap: 'トラップ',
  'Indie folk': 'インディーフォーク',
  Folk: 'フォーク',
  'Chamber folk': 'チェンバーフォーク',
  'Singer-songwriter': 'シンガーソングライター',
  'Hardcore punk': 'ハードコアパンク',
  Metalcore: 'メタルコア',
  'Doom metal': 'ドゥームメタル',
  Grindcore: 'グラインドコア',
  Reggaeton: 'レゲトン',
  Dancehall: 'ダンスホール',
  Flamenco: 'フラメンコ',
  'Chamber pop': 'チェンバーポップ',
  Darkwave: 'ダークウェイヴ',
  Coldwave: 'コールドウェイヴ',
  'Dream folk': 'ドリームフォーク',
  'Folk rock': 'フォークロック',
  'Lo-fi': 'ローファイ',
  'UK bass': 'UKベース',
  Breakbeat: 'ブレイクビーツ',
  'Southern hip-hop': 'サザンヒップホップ',
  'Experimental hip-hop': '実験ヒップホップ',
  Country: 'カントリー',
  'Latin pop': 'ラテンポップ',
  'Avant-pop': 'アヴァンポップ',
};

export function genreLabel(lang: Lang, key: string) {
  if (lang === 'zh') return genreZh[key] || key;
  if (lang === 'ja') return genreJa[key] || key;
  return key;
}

export function familyName(lang: Lang, id: string) {
  const family = FAMILIES[id as FamilyId] ?? FAMILIES.unverified;
  return family[lang];
}

export function field(artist: { [key: string]: unknown }, key: string, lang: Lang) {
  const local = artist[`${key}_${lang}`];
  const english = artist[`${key}_en`];
  if (typeof local === 'string' && local) return local;
  if (typeof english === 'string') return english;
  return '';
}

export const LESSONS = [
  {
    genre: 'Shoegaze',
    zh: '厚重結他效果、失真與 feedback 疊成聲牆；先感受聲場，再辨認旋律。',
    en: 'Effect-heavy guitars, distortion and feedback become a wall of sound. Hear the texture before tracing the melody.',
    ja: 'エフェクトの厚いギター、歪みとフィードバックが音の壁になる。旋律を追う前に、質感を聴く。',
  },
  {
    genre: 'Dream pop',
    zh: '漂浮的人聲與朦朧層次是重點。夢幻不一定要很吵，也不一定要很多結他。',
    en: 'Floating vocals and hazy layers take the lead. Dreamlike does not have to mean loud or guitar-heavy.',
    ja: '浮かぶ声と霞んだ層が中心。夢幻は、大きい音やギターの多さを必要としない。',
  },
  {
    genre: 'Slowcore',
    zh: '慢速、留白與克制是辨識線索。憂鬱歌曲不一定就是 slowcore。',
    en: 'Slow pacing, space and restraint are the clues. A sad song is not automatically slowcore.',
    ja: '遅さ、余白、抑制が手がかり。悲しい歌がそのままスローコアになるわけではない。',
  },
  {
    genre: 'Post-rock',
    zh: '留意器樂如何循環、疊加與建構動態；不是所有後搖都要爆發。',
    en: 'Follow instrumental repetition, layering and dynamic construction. Not every post-rock piece needs a giant climax.',
    ja: '器楽の反復、積層、ダイナミクスの組み立てを追う。ポストロックのすべてが爆発を必要とするわけではない。',
  },
];

export const ROUTES = [
  {
    zh: '從模糊結他，到噪音深處。',
    en: 'From guitar haze into the deep.',
    ja: 'ぼやけたギターから、ノイズの奥へ。',
    desc_zh: '聲牆 → 陰暗後龐克 → 工業重量 → 器樂的開放結構。適合你的氣氛派路線。',
    desc_en: 'Walls of sound, dark post-punk, industrial weight and open-ended instrumental structures. Your atmospheric route.',
    desc_ja: '音の壁、暗いポストパンク、インダストリアルの重さ、開かれた器楽の構造。雰囲気寄りの道。',
    names: ['DIIV', 'Have A Nice Life', 'Jesu', 'Don Caballero'],
  },
  {
    zh: '先被旋律接住，再慢慢放開。',
    en: 'Soft edges. Wide-open spaces.',
    ja: 'メロディに受け止めてもらってから、手を離す。',
    desc_zh: '從親密的歌曲與人聲出發，走進迷幻層次，再讓節拍退到遠處。',
    desc_en: 'Start with intimate songs and voices, move into psychedelic layers, then let the beat drift out of view.',
    desc_ja: '親密な歌と声から入り、サイケデリックな層へ。それからビートを遠くへ。',
    names: ['Phoebe Bridgers', 'Weyes Blood', 'Atlas Sound', 'Malibu'],
  },
  {
    zh: '舞池，也可以很內省。',
    en: 'The dancefloor has an inner life.',
    ja: 'ダンスフロアも、内省的でいられる。',
    desc_zh: '低頻與憂鬱感牽引，從歌曲輪廓走向脈動、循環與深夜空間。',
    desc_en: 'Bass and melancholy lead the way, from song forms into pulse, repetition and the spaces after midnight.',
    desc_ja: '低音とメランコリーが先導する。歌のかたちから、パルス、反復、深夜の空間へ。',
    names: ['Massive Attack', 'Andy Stott', 'BICEP', 'Four Tet'],
  },
];
