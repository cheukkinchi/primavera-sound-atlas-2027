/* Independent, source-backed music discovery guide. */
const A=window.ARTISTS||[];
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const state={lang:'zh',family:'all',mapFamily:'guitar',query:'',frequency:false,view:'grid',sort:'az',limit:24,saved:new Set(),selected:null};
const F={
 guitar:{en:'Rock',zh:'搖滾與另類',color:'#446bcb',text:'#ffffff',branches:['Indie rock','Shoegaze','Post-punk','Post-rock']},
 pop:{en:'Pop & R&B',zh:'流行與 R&B',color:'#d3568c',text:'#171714',branches:['Art pop','Synthpop','Alternative R&B','Dance-pop']},
 electronic:{en:'Electronic & club',zh:'電子與舞池',color:'#278262',text:'#ffffff',branches:['House','Techno','UK bass','Breakbeat']},
 rap:{en:'Hip-hop & rap',zh:'Hip-hop 與饒舌',color:'#ba462e',text:'#ffffff',branches:['Hip-hop','Trap','Southern hip-hop','Experimental hip-hop']},
 folk:{en:'Folk & songwriters',zh:'民謠與創作',color:'#b58c25',text:'#171714',branches:['Indie folk','Chamber folk','Singer-songwriter','Country']},
 heavy:{en:'Heavy & hardcore',zh:'重型與硬核',color:'#73528b',text:'#ffffff',branches:['Hardcore punk','Metalcore','Doom metal','Grindcore']},
 experimental:{en:'Ambient & leftfield',zh:'氛圍與實驗',color:'#467787',text:'#ffffff',branches:['Ambient','Experimental electronic','Drone','Avant-pop']},
 global:{en:'Latin & beyond',zh:'拉丁與跨界',color:'#d26b25',text:'#171714',branches:['Reggaeton','Dancehall','Flamenco','Latin pop']},
 unverified:{en:'Still to be mapped',zh:'待核實資料',color:'#8b8b7e',text:'#171714',branches:[]}
};
const T={
 navExplore:['探索藝人','Artists'],navMap:['曲風地圖','Sound map'],navRoutes:['聆聽路線','Listening routes'],myList:['我的清單','My list'],
 heroTitle:['不只看陣容，<br>聽懂每個名字。','A whole world<br>between the names.'],
 heroDesc:['由結他聲牆走到凌晨舞池。把整個 Primavera 陣容，變成一張可以聆聽的音樂地圖。','From walls of guitar to the last dance at dawn. Find your way through every act on the Primavera lineup, one sound at a time.'],
 heroCta:['尋找你的下一隊愛團','Find your next favourite'],acts:['組演出','acts to discover'],worlds:['個聲音領域','sound worlds'],noBoundaries:['曲風有交集，探索無邊界。','No borders. Just better ways to listen.'],
 genomeTitle:['THE LINEUP, RECOLOURED.','THE LINEUP, RECOLOURED.'],oneDot:['一點，一組藝人。點擊開始探索。','One dot. One act. Pick a starting point.'],
 exploreTitle:['下一站，聽甚麼？','Where to next?'],exploreDesc:['從熟悉的曲風出發，也給陌生的聲音一點空間。','Start with a sound you love. Leave a little room for the unexpected.'],
 grid:['圖卡','Cards'],list:['列表','List'],yourFrequency:['氣氛派優先','Your atmospheric side'],frequencyHint:['Shoegaze · Dream pop · Post-rock','Shoegaze · Dream pop · Post-rock'],
 sortLabel:['排序','Sort'],discovery:['探索優先','Discovery first'],clear:['重設篩選 ↺','Reset filters ↺'],emptyTitle:['換個方向，還有很多聲音。','A different direction awaits.'],
 emptyDesc:['試試更簡單的關鍵字，或者清除篩選重新探索。','Try a shorter search, or reset the filters and start somewhere new.'],more:['再探索更多藝人','Keep exploring'],
 mapTitle:['聲音之間，沒有圍牆。','Sounds without borders.'],mapDesc:['區塊大小約按主要分類的人數分配。點擊領域，再沿支線探索；分類是導航，不是定論。','Tile sizes roughly reflect the number of acts in each primary family. Choose a world and follow its branches. A guide, never a verdict.'],
 readMap:['如何閱讀這張地圖','HOW TO READ THIS MAP'],guideTitle:['大類 → 分支 → 聲音質感','Family → branch → texture'],
 guideDesc:['同一位藝人可以跨越多種風格。這裡只選一個主要領域計算，詳細頁會保留次分類、相鄰風格與爭議。','An artist can live in more than one genre. Counts use one primary family; profiles preserve subgenres, neighbours and the grey areas.'],
 mapCaveat:['圖譜並非嚴格歷史譜系。R&B、拉丁混種與實驗音樂等領域可能交疊。','This is a listening map, not a strict historical family tree. R&B, Latin hybrids and experimental music often cross its boundaries.'],
 routesTitle:['讓耳朵帶路。','Take the scenic route.'],routesDesc:['不是排名，是幾條從熟悉走向未知的聆聽路徑。先聽一組，再順著質感走下去。','Not a ranking. Three paths from familiar sounds into less familiar territory. Follow a texture, not the small print.'],
 methodTitle:['好的音樂地圖，<br>也會標示未知。','A good map leaves<br>room for the unknown.'],
 methodDesc:['名單以 Primavera 官方 A–Z 的獨立演出項目去重整理，包括 B2B 和聯名演出。音樂分類綜合藝人資料與編輯判斷，並不代表官方曲風標籤，也不是 2027 現場歌單預測。','The scope is the official A–Z, deduplicated by billed act, including B2Bs and collaborations. Genre placements combine source evidence with editorial interpretation. They are not official festival labels or predictions of 2027 setlists.'],
 verificationNote:['名單核對與分類方法','Lineup verification & classification method'],
 verificationBody:['2026 年 10 月 16 日官網 A–Z 去重後為 152 組。早期新聞公布 151 組，兩者數目不同，原因未能確認；官網頁首仍有 2026 舊字樣，但藝人連結與活動資料指向 2027。以目前獨立項目為範圍，不把多位合作藝人拆成重複條目。部分資料較少的名字會標記「資料有限」或「待核實」。曲風大類是本指南的導航分組，不是互斥的音樂學分類。','The official A–Z contained 152 unique acts on 16 October 2026. Early coverage announced 151; the reason for the mismatch has not been established. The official heading still contained a 2026 label, but artist links and event records point to 2027. Each collaboration is one billed entry. Thin or unresolved evidence is labelled explicitly. The navigation families are not mutually exclusive musicological categories.'],
 officialLineup:['官方完整陣容 ↗','Official full lineup ↗'],announcement:['陣容公布報道 ↗','Lineup announcement ↗'],
 footerNote:['非官方聆聽指南。與 Primavera Sound 並無隸屬關係。','An independent listening guide. Not affiliated with Primavera Sound.'],
 photoCredit:['藝人圖片：Primavera Sound 官方媒體素材。分類資料來源見各藝人介紹。','Artist photography via Primavera Sound. Music sources are credited in each profile.'],
 all:['全部藝人','All artists'],search:['搜尋藝人、曲風、聲音質感…','Search artists, genres, textures…'],bio:['關於藝人','The artist'],sound:['為何這樣分類？','Why this classification?'],
 listen:['怎樣聽懂？','What to listen for'],entry:['入門作品','Start listening'],subs:['次級分類','Subgenres'],texture:['聲音質感','Sound palette'],adjacent:['相鄰風格','Adjacent genres'],
 note:['分類註記','Classification note'],sources:['資料來源','Sources'],related:['沿著聲音繼續走','Follow the sound'],officialProfile:['Primavera 官方藝人頁','Official Primavera profile'],
 save:['＋ 加入清單','＋ Save act'],saved:['✓ 已加入','✓ Saved'],close:['關閉','Close'],strong:['資料充足','Source-backed'],partial:['資料有限','Limited evidence'],unverified:['待核實','Unverified'],
 results:['組藝人','acts'],total:['共','of'],profileIndex:['藝人檔案','ARTIST PROFILE'],set:['合作演出，曲風不等於現場預測。','A joint set is not a predictable genre playlist.'],
 savedDesc:['先記下喜歡的聲音，之後再慢慢聽。本清單只在本次瀏覽保留，可匯出文字檔保存。','Keep the sounds that catch your ear. This list lasts for this browsing session; export a text copy to keep it.'],
 savedEmpty:['清單還是空白。從任何藝人卡按「＋」，收集你想探索的名字。','Your list is a blank record. Hit ＋ on any artist to start collecting sounds.'],
 export:['匯出聆聽清單 ↓','Export listening list ↓'],removed:['已從清單移除','Removed from your list'],added:['已加入聆聽清單','Added to your listening list'],
 listenSearch:['Spotify 搜尋 ↗','Search Spotify ↗'],noneReleases:['暫未核實入門作品，請參考官方藝人頁試聽。','No entry release verified yet. Follow the official artist profile to listen.'],
 genreEvidence:['分類與作品依據下方資料來源；「怎樣聽懂」及延伸關係含編輯聆聽建議。','Genre and release evidence is listed below. Listening cues and related-artist paths include editorial interpretation.'],
 allSources:['官方演出資料與圖片','Official billing & photography'],remove:['移除','Remove'],browse:['返回探索 ↗','Back to exploring ↗'],
 coverageStrong:['資料充足','source-backed'],coveragePartial:['資料有限','limited-evidence'],coverageUnknown:['待核實','unverified'],
 branchHint:['下列聲音線索並非互斥分類。按標籤可繼續探索。','These sound cues overlap. Select a tag to continue exploring.'],
 editorial:['編輯探索路線，不代表合作或演出次序。','Editorial listening path, not a collaboration or running order.']
};
const genreZh={'Indie rock':'獨立搖滾','Alternative rock':'另類搖滾','Shoegaze':'瞪鞋搖滾','Dream pop':'夢幻流行','Slowcore':'慢核','Post-rock':'後搖','Post-punk':'後龐克','Noise pop':'噪音流行','Noise rock':'噪音搖滾','Math rock':'數學搖滾','Art rock':'藝術搖滾','Psychedelic rock':'迷幻搖滾','Art pop':'藝術流行','Synthpop':'合成器流行','Synth-pop':'合成器流行','Electropop':'電子流行','Indie pop':'獨立流行','Dance-pop':'舞曲流行','Alternative R&B':'另類 R&B','Experimental pop':'實驗流行','Ambient':'氛圍音樂','Dark ambient':'暗黑氛圍','Drone':'持續音','Experimental electronic':'實驗電子','Electronic':'電子','House':'浩室','Techno':'鐵克諾','Dub techno':'Dub techno','Deep house':'深浩室','IDM':'智能舞曲','Hip-hop':'嘻哈','Trap':'Trap','Indie folk':'獨立民謠','Folk':'民謠','Chamber folk':'室內民謠','Singer-songwriter':'創作歌手','Hardcore punk':'硬核龐克','Metalcore':'金屬核','Doom metal':'厄運金屬','Grindcore':'輾核','Reggaeton':'雷鬼動','Dancehall':'Dancehall','Flamenco':'法蘭明高','Chamber pop':'室內流行','Darkwave':'暗潮','Coldwave':'冷潮','Dream folk':'夢幻民謠','Folk rock':'民謠搖滾','Lo-fi':'低傳真'};
const tr=k=>(T[k]||[k,k])[state.lang==='zh'?0:1];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const textOnly=s=>String(s||'').replace(/\[([^\]]+)\]\((https?:\/\/(?:[^()\s]+|\([^()]*\))+)\)/g,'').replace(/https?:\/\/\S+/g,'').trim();
const markdown=s=>esc(s||'').replace(/\[([^\]]+)\]\((https?:\/\/(?:[^()\s]+|\([^()]*\))+)\)/g,(_,label,url)=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`).replace(/\n/g,'<br>');
const label=(key)=>state.lang==='zh'?(genreZh[key]||key):key;
const field=(a,k)=>a[k+'_'+state.lang]||a[k+'_en']||'';
const familyName=k=>F[k]?.[state.lang]||F.unverified[state.lang];
const familyCount=k=>A.filter(a=>a.family===k).length;
 const imageUrl=a=>a.localImage||a.image;
const photo=(a,attrs='')=>`<img src="${esc(imageUrl(a))}" alt="${esc(a.name)}" loading="lazy" decoding="async" width="600" height="460" ${attrs} onerror="this.onerror=null;this.src='${esc(a.image)}'">`;
const canonical=s=>String(s).normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
const frequency=a=>/shoegaze|dream.?pop|slowcore|post.?rock|ambient|ethereal|melanchol|atmospheric|drone/i.test([a.main,...a.sub,...a.adjacent,...a.descriptors].join(' '));
const genreScore=(a,b)=>[a.main,...a.sub,...a.adjacent].reduce((n,g)=>n+([b.main,...b.sub,...b.adjacent].some(h=>canonical(h)===canonical(g))?3:0),a.family===b.family?1:0);
function notify(msg){$('#toast').textContent=msg;$('#toast').classList.add('visible');clearTimeout(notify.timer);notify.timer=setTimeout(()=>$('#toast').classList.remove('visible'),1800)}
function renderLanguage(){
 document.documentElement.lang=state.lang==='zh'?'zh-Hant':'en';
 $$('[data-i18n]').forEach(e=>e.innerHTML=tr(e.dataset.i18n));
 $('#language').innerHTML=state.lang==='zh'?'中 <span>/</span> EN':'EN <span>/</span> 中';
 $('#language').setAttribute('aria-label',state.lang==='zh'?'Switch to English':'切換繁體中文');
 $('#search').placeholder=tr('search');$('#search').setAttribute('aria-label',tr('search'));
 $('#search').value=state.query;
 $$('.total-count').forEach(e=>e.textContent=A.length);
 const strong=A.filter(a=>a.confidence==='strong').length,partial=A.filter(a=>a.confidence==='partial').length,unknown=A.length-strong-partial;
 $('#coverage').textContent=state.lang==='zh'?`本版涵蓋 ${A.length} 組演出：${strong} 組資料充足、${partial} 組資料有限、${unknown} 組待核實。每份介紹保留來源與資料限制。`:`This edition covers ${A.length} billed acts: ${strong} source-backed, ${partial} with limited evidence, and ${unknown} unverified. Each profile preserves its sources and limitations.`;
 renderFilters();renderDots();renderArtists();renderMap();renderRoutes();renderLessons();updateSaved();
 if($('#profile').open&&state.selected)renderProfile(A.find(a=>a.id===state.selected));
 if($('#saved-dialog').open)renderSaved();
}
function renderFilters(){
 $('#family-filters').innerHTML=`<button class="family-chip ${state.family==='all'?'active':''}" data-family="all" aria-pressed="${state.family==='all'}">${tr('all')} <span class="count">${A.length}</span></button>`+Object.entries(F).filter(([k])=>familyCount(k)>0).map(([k,f])=>`<button class="family-chip ${state.family===k?'active':''}" data-family="${k}" style="--family:${f.color}" aria-pressed="${state.family===k}"><span class="swatch"></span>${f[state.lang]}<span class="count">${familyCount(k)}</span></button>`).join('');
}
function renderDots(){
 const sorted=[...A].sort((a,b)=>Object.keys(F).indexOf(a.family)-Object.keys(F).indexOf(b.family));
 $('#dots').innerHTML=sorted.map(a=>`<button class="dot ${state.family!=='all'&&a.family!==state.family?'dim':''}" data-open="${esc(a.id)}" style="--dot:${F[a.family]?.color||F.unverified.color}" aria-label="${esc(a.name+' · '+a.main)}" title="${esc(a.name+' · '+a.main)}"></button>`).join('');
}
function filtered(){
 let result=A.filter(a=>(state.family==='all'||a.family===state.family)&&(!state.frequency||frequency(a)));
 if(state.query.trim()){
 const q=canonical(state.query.trim());
 result=result.filter(a=>canonical([a.name,a.main,...a.sub,...a.adjacent,...a.descriptors,a.bio_en,a.bio_zh,...Object.keys(genreZh).filter(k=>[a.main,...a.sub,...a.adjacent].some(g=>canonical(g)===canonical(k))).map(k=>genreZh[k]),familyName(a.family)].join(' ')).includes(q));
 }
 result.sort((a,b)=>state.sort==='discovery'?(Number(frequency(b))-Number(frequency(a))||({strong:0,partial:1,unverified:2}[a.confidence]-{strong:0,partial:1,unverified:2}[b.confidence])||a.name.localeCompare(b.name)):a.name.localeCompare(b.name));
 return result;
}
function renderArtists(){
 const all=filtered(),visible=all.slice(0,state.limit);
 $('#artists').classList.toggle('list-mode',state.view==='list');
 $('#result-count').textContent=state.lang==='zh'?`顯示 ${Math.min(state.limit,all.length)} / ${all.length} 組藝人`:`Showing ${Math.min(state.limit,all.length)} of ${all.length} acts`;
 $('#artists').innerHTML=visible.map(a=>`<article class="artist-card" style="--family:${F[a.family]?.color||F.unverified.color}">
 <button class="card-image" data-open="${esc(a.id)}" aria-label="${esc(a.name)}">${photo(a)}<span class="card-number">${String(a.index+1).padStart(3,'0')}</span></button>
 <button class="card-bookmark" data-save="${esc(a.id)}" aria-pressed="${state.saved.has(a.id)}" aria-label="${esc((state.saved.has(a.id)?tr('remove'):tr('save'))+' '+a.name)}">${state.saved.has(a.id)?'✓':'＋'}</button>
 <div class="card-text"><div class="card-family">${familyName(a.family)}</div><button class="card-title" data-open="${esc(a.id)}">${esc(a.name)}<span class="arrow" aria-hidden="true">↗</span></button>
 <div class="card-genres">${esc([a.main,...a.sub.filter(g=>canonical(g)!==canonical(a.main))].slice(0,3).join(' · '))}</div>
 <p class="card-bio">${esc(textOnly(field(a,'bio')))}</p>${a.confidence!=='strong'?`<div class="card-status">${tr(a.confidence)}</div>`:''}</div></article>`).join('');
 $('#empty').hidden=all.length>0;$('#load-more').hidden=state.limit>=all.length;
 $('#grid-view').setAttribute('aria-pressed',state.view==='grid');$('#list-view').setAttribute('aria-pressed',state.view==='list');
}
function selectFamily(k,scroll=true){state.family=k;state.limit=24;renderFilters();renderDots();renderArtists();if(scroll)$('#explore').scrollIntoView({behavior:'smooth'})}
function resetFilters(){state.family='all';state.query='';state.frequency=false;state.limit=24;$('#search').value='';$('#your-frequency').checked=false;renderFilters();renderDots();renderArtists()}
function renderMap(){
 const entries=Object.entries(F).filter(([k])=>k!=='unverified'&&familyCount(k)>0).sort((a,b)=>familyCount(b[0])-familyCount(a[0]));
 const total=entries.reduce((n,[k])=>n+familyCount(k),0);
 // Minimum readable tile sizes preserve labels in small families.
 const groups=[entries.filter((_,i)=>i%2===0),entries.filter((_,i)=>i%2===1)];
 $('#treemap').style.cssText='display:flex;gap:4px;min-height:360px';
 $('#treemap').innerHTML=groups.map(group=>{const count=group.reduce((n,[k])=>n+familyCount(k),0);return `<div style="display:flex;flex-direction:column;gap:4px;flex:${count};min-width:0">`+group.map(([k,f])=>`<button class="map-block ${state.mapFamily===k?'selected':''}" data-map-family="${k}" aria-pressed="${state.mapFamily===k}" style="--family:${f.color};color:${f.text};flex:${familyCount(k)};min-height:104px;width:100%" aria-label="${esc(f[state.lang]+' '+familyCount(k))}"><span>${f[state.lang]}</span><div><b>${familyCount(k)}</b> <small>${Math.round(familyCount(k)/A.length*100)}%</small></div></button>`).join('')+'</div>'}).join('');
 renderBranches();
}
function renderBranches(){
 const family=F[state.mapFamily]||F.guitar,acts=A.filter(a=>a.family===state.mapFamily),counts=new Map();
 acts.forEach(a=>[...new Set([a.main,...a.sub])].forEach(g=>{if(g!=='n.a.')counts.set(g,(counts.get(g)||0)+1)}));
 const genres=[...counts].sort((a,b)=>b[1]-a[1]).slice(0,6);
 $('#family-tree').innerHTML=`<div class="tree-root" style="--family:${family.color}"><span class="tree-dot"></span><b>${family[state.lang]}</b><button data-family="${state.mapFamily}">${acts.length} ${tr('acts')} ↗</button></div>`+genres.map(([g,n])=>`<button class="tree-row branch" data-search="${esc(g)}" style="--family:${family.color}"><span>${esc(label(g))}</span><small>${n} ↗</small></button>`).join('')+`<p class="branch-note">${state.lang==='zh'?'支線分類可重疊，數量不應相加。':'Branch counts overlap and should not be added.'}</p>`;
}
function renderLessons(){
 const lessons=[
 ['Shoegaze','厚重結他效果、失真與 feedback 疊成聲牆；先感受聲場，再辨認旋律。','Effect-heavy guitars, distortion and feedback become a wall of sound. Hear the texture before tracing the melody.','DIIV'],
 ['Dream pop','漂浮的人聲與朦朧層次是重點。夢幻不一定要很吵，也不一定要很多結他。','Floating vocals and hazy layers take the lead. Dreamlike does not have to mean loud or guitar-heavy.','Atlas Sound'],
 ['Slowcore','慢速、留白與克制是辨識線索。憂鬱歌曲不一定就是 slowcore。','Slow pacing, space and restraint are the clues. A sad song is not automatically slowcore.','Julien Baker'],
 ['Post-rock','留意器樂如何循環、疊加與建構動態；不是所有後搖都要爆發。','Follow instrumental repetition, layering and dynamic construction. Not every post-rock piece needs a giant climax.','Don Caballero']
 ];
 $('#overlap-lesson').innerHTML=lessons.map(([genre,zh,en,artist],i)=>`<article class="lesson"><h3>${genre}<span>0${i+1}</span></h3><p>${state.lang==='zh'?zh:en}</p><button data-search="${genre}">${state.lang==='zh'?'探索這個聲音':'Explore this sound'} ↗</button></article>`).join('');
}
const ROUTES=[
 {zh:'從模糊結他，到噪音深處。',en:'From guitar haze into the deep.',desc_zh:'聲牆 → 陰暗後龐克 → 工業重量 → 器樂的開放結構。適合你的氣氛派路線。',desc_en:'Walls of sound, dark post-punk, industrial weight and open-ended instrumental structures. Your atmospheric route.',names:['DIIV','Have A Nice Life','Jesu','Don Caballero']},
 {zh:'先被旋律接住，再慢慢放開。',en:'Soft edges. Wide-open spaces.',desc_zh:'從親密的歌曲與人聲出發，走進迷幻層次，再讓節拍退到遠處。',desc_en:'Start with intimate songs and voices, move into psychedelic layers, then let the beat drift out of view.',names:['Phoebe Bridgers','Weyes Blood','Atlas Sound','Malibu']},
 {zh:'舞池，也可以很內省。',en:'The dancefloor has an inner life.',desc_zh:'低頻與憂鬱感牽引，從歌曲輪廓走向脈動、循環與深夜空間。',desc_en:'Bass and melancholy lead the way, from song forms into pulse, repetition and the spaces after midnight.',names:['Massive Attack','Andy Stott','BICEP','Four Tet']}
];
function renderRoutes(){
 $('#route-cards').innerHTML=ROUTES.map((r,i)=>`<article class="route-card"><div class="route-intro"><span class="route-number">ROUTE 0${i+1} / ${r.names.length} ACTS</span><h3>${r[state.lang]}</h3><p>${r['desc_'+state.lang]}</p><p style="font-size:var(--text-xs);margin-top:var(--space-3)">${tr('editorial')}</p></div><div class="route-chain">${r.names.map(name=>A.find(a=>canonical(a.name)===canonical(name))).filter(Boolean).map((a,j)=>`${j?'<span class="chain-arrow" aria-hidden="true">→</span>':''}<button class="route-artist" data-open="${esc(a.id)}">${photo(a)}<span>${esc(a.name)}</span></button>`).join('')}</div></article>`).join('');
}
function renderProfile(a){
 if(!a)return;state.selected=a.id;
 const related=A.filter(b=>b.id!==a.id&&b.confidence!=='unverified').map(b=>({a:b,score:genreScore(a,b)})).filter(b=>b.score>1).sort((x,y)=>y.score-x.score).slice(0,4).map(x=>x.a);
 $('#profile-content').innerHTML=`<div class="profile-top"><span>${tr('profileIndex')} / ${String(a.index+1).padStart(3,'0')}</span><div class="profile-top-actions"><button class="profile-save" data-save="${esc(a.id)}" aria-pressed="${state.saved.has(a.id)}">${state.saved.has(a.id)?tr('saved'):tr('save')}</button><button class="profile-close" data-close="profile" aria-label="${tr('close')}">×</button></div></div>
 <div class="profile-hero">${photo(a,'class="profile-portrait" loading="eager"')}<div class="profile-intro"><div class="card-family" style="--family:${F[a.family]?.color}">${familyName(a.family)} · ${tr(a.confidence)}</div><h2 id="profile-title">${esc(a.name)}</h2><div class="profile-main">${state.lang==='zh'&&genreZh[a.main]?`${esc(label(a.main))} / `:''}${esc(a.main)}</div><div class="profile-parent">${esc(a.parent)}</div></div></div>
 <div class="profile-body"><section class="profile-section"><h3>${tr('bio')}</h3><p>${markdown(field(a,'bio'))}</p></section>
 <section class="profile-section"><h3>${tr('sound')}</h3><p>${markdown(field(a,'sound'))}</p></section>
 <div class="profile-columns"><section class="profile-section"><h3>${tr('subs')}</h3><div class="tag-row">${a.sub.map(g=>`<button class="tag tag-button" data-search="${esc(g)}">${esc(label(g))}</button>`).join('')||'<span>n.a.</span>'}</div></section><section class="profile-section"><h3>${tr('texture')}</h3><div class="tag-row">${a.descriptors.map(g=>`<button class="tag tag-button" data-search="${esc(g)}">${esc(g)}</button>`).join('')||'<span>n.a.</span>'}</div></section></div>
 <section class="profile-section profile-listen"><h3>${tr('listen')}</h3><p>${markdown(field(a,'listen'))}</p></section>
 <section class="profile-section"><h3>${tr('entry')}</h3>${a.releases.length?`<ol class="release-list">${a.releases.map((r,i)=>`<li><span>${String(i+1).padStart(2,'0')} / ${esc(r)}</span><a href="https://open.spotify.com/search/${encodeURIComponent(a.name+' '+r)}" target="_blank" rel="noopener noreferrer">${tr('listenSearch')}</a></li>`).join('')}</ol>`:`<p>${tr('noneReleases')}</p>`}</section>
 <section class="profile-section"><h3>${tr('adjacent')}</h3><div class="tag-row">${a.adjacent.map(g=>`<button class="tag tag-button" data-search="${esc(g)}">${esc(label(g))}</button>`).join('')||'<span>n.a.</span>'}</div></section>
 <div class="profile-note"><b>${tr('note')}</b>${markdown(field(a,'note'))}<p>${tr('genreEvidence')}</p></div>
 ${related.length?`<section class="profile-section" style="margin-top:var(--space-6)"><h3>${tr('related')}</h3><div class="profile-related">${related.map(b=>`<button data-open="${esc(b.id)}">${esc(b.name)} ↗</button>`).join('')}</div></section>`:''}
 <section class="profile-section" style="margin-top:var(--space-6)"><h3>${tr('sources')}</h3><ol class="source-list">${a.sources.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title||new URL(s.url).hostname)} ↗</a></li>`).join('')}<li><a href="${esc(a.official)}" target="_blank" rel="noopener noreferrer">${tr('allSources')} ↗</a></li></ol></section>
 <a class="profile-official" href="${esc(a.official)}" target="_blank" rel="noopener noreferrer">${tr('officialProfile')}<span>↗</span></a></div>`;
 $('#profile').scrollTop=0;
}
function openProfile(id){const a=A.find(a=>a.id===id);if(!a)return;if($('#saved-dialog').open)$('#saved-dialog').close();renderProfile(a);if(!$('#profile').open)$('#profile').showModal();document.body.style.overflow='hidden'}
function closeDialog(id){$('#'+id).close();document.body.style.overflow='';if(id==='profile')state.selected=null}
function updateSaved(){$$('.saved-count').forEach(e=>e.textContent=state.saved.size);$$('[data-save]').forEach(b=>{const yes=state.saved.has(b.dataset.save);b.setAttribute('aria-pressed',yes);if(b.classList.contains('card-bookmark')){b.textContent=yes?'✓':'＋';const a=A.find(a=>a.id===b.dataset.save);b.setAttribute('aria-label',(yes?tr('remove'):tr('save'))+' '+(a?.name||''))}else b.textContent=yes?tr('saved'):tr('save')})}
function toggleSave(id){if(state.saved.has(id)){state.saved.delete(id);notify(tr('removed'))}else{state.saved.add(id);notify(tr('added'))}updateSaved();if($('#saved-dialog').open)renderSaved()}
function renderSaved(){
 const saved=A.filter(a=>state.saved.has(a.id));
 $('#saved-content').innerHTML=`<div class="profile-top"><span>MY PRIMAVERA / ${saved.length} ACTS</span><button class="profile-close" data-close="saved-dialog" aria-label="${tr('close')}">×</button></div><div class="saved-body"><h2 id="saved-title">${tr('myList')}</h2><p>${tr('savedDesc')}</p><div class="saved-items">${saved.length?saved.map(a=>`<article class="saved-item">${photo(a)}<button data-open="${esc(a.id)}">${esc(a.name)}<small>${esc(a.main)}</small></button><button data-save="${esc(a.id)}" aria-pressed="true" aria-label="${tr('remove')} ${esc(a.name)}">×</button></article>`).join(''):`<p>${tr('savedEmpty')}</p>`}</div>${saved.length?`<button class="primary" id="export-list">${tr('export')}</button>`:`<button class="primary" data-close="saved-dialog">${tr('browse')}</button>`}</div>`;
}
function exportSaved(){
 const items=A.filter(a=>state.saved.has(a.id));
 const lines=['PRIMAVERA SOUND ATLAS / 2027',tr('myList'),'16 OCT 2026','',...items.flatMap(a=>[a.name,a.main+' · '+a.sub.join(' · '),...a.releases.map(r=>'  '+r),a.official,...a.sources.map(s=>s.url),'']),'Independent listening guide. Not affiliated with Primavera Sound.'];
 const url=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download='Primavera-2027-Listening-List.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function searchGenre(q){if($('#profile').open)closeDialog('profile');state.query=q;state.family='all';state.frequency=false;state.limit=24;$('#search').value=q;$('#your-frequency').checked=false;renderFilters();renderDots();renderArtists();$('#explore').scrollIntoView({behavior:'smooth'})}
document.addEventListener('click',e=>{
 const open=e.target.closest('[data-open]');if(open){openProfile(open.dataset.open);return}
 const save=e.target.closest('[data-save]');if(save){toggleSave(save.dataset.save);return}
 const close=e.target.closest('[data-close]');if(close){closeDialog(close.dataset.close);return}
 const family=e.target.closest('[data-family]');if(family){selectFamily(family.dataset.family,!family.closest('#family-filters'));return}
 const mapFamily=e.target.closest('[data-map-family]');if(mapFamily){state.mapFamily=mapFamily.dataset.mapFamily;renderMap();return}
 const search=e.target.closest('[data-search]');if(search){searchGenre(search.dataset.search);return}
 if(e.target.closest('#export-list'))exportSaved();
});
$('#language').addEventListener('click',()=>{state.lang=state.lang==='zh'?'en':'zh';renderLanguage()});
$('#search').addEventListener('input',e=>{state.query=e.target.value;state.limit=24;renderArtists()});
$('#your-frequency').addEventListener('change',e=>{state.frequency=e.target.checked;state.limit=24;renderArtists()});
$('#sort').addEventListener('change',e=>{state.sort=e.target.value;state.limit=24;renderArtists()});
$('#grid-view').addEventListener('click',()=>{state.view='grid';renderArtists()});
$('#list-view').addEventListener('click',()=>{state.view='list';renderArtists()});
$('#clear-filters').addEventListener('click',resetFilters);$('#empty-reset').addEventListener('click',resetFilters);
$('#load-more').addEventListener('click',()=>{state.limit+=24;renderArtists()});
$('#mylist').addEventListener('click',()=>{renderSaved();$('#saved-dialog').showModal();document.body.style.overflow='hidden'});
['profile','saved-dialog'].forEach(id=>{
 $('#'+id).addEventListener('click',e=>{if(e.target===$('#'+id)){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(id)}});
 $('#'+id).addEventListener('close',()=>{document.body.style.overflow='';if(id==='profile')state.selected=null});
});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)&&!$('#profile').open&&!$('#saved-dialog').open){e.preventDefault();$('#search').focus()}});
$('#dots').addEventListener('pointerover',e=>{const b=e.target.closest('[data-open]');if(!b)return;const a=A.find(a=>a.id===b.dataset.open);$('#dot-tooltip').textContent=a.name+' / '+a.main;$('#dot-tooltip').classList.add('show')});
$('#dots').addEventListener('pointerleave',()=>$('#dot-tooltip').classList.remove('show'));
renderLanguage();
