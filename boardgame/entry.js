const festivals=[
{name:'春節',pinyin:'Chūn jié',en:'Lunar New Year',time:'農曆正月初一',meaning:'迎接新的一年',ids:[1,12,13]},
{name:'元宵節',pinyin:'Yuán xiāo jié',en:'Lantern Festival',time:'農曆正月十五',meaning:'賞花燈，慶團圓',ids:[14,15,8]},
{name:'兒童節',pinyin:'Ér tóng jié',en:'Children’s Day',time:'國曆四月四日',meaning:'關愛兒童',ids:[1,2,4]},
{name:'清明節',pinyin:'Qīng míng jié',en:'Qingming Festival',time:'國曆約四月四至五日',meaning:'紀念祖先',ids:[19,20,9],relatedIds:[19,20,9,21,23]},
{name:'端午節',pinyin:'Duān wǔ jié',en:'Dragon Boat Festival',time:'農曆五月初五',meaning:'祈求健康平安',ids:[10,16,17]},
{name:'七夕情人節',pinyin:'Qī xī qíng rén jié',en:'Qixi Festival',time:'農曆七月初七',meaning:'表達愛意',ids:[2,3,5],relatedIds:[2,3,5,7]},
{name:'中元節',pinyin:'Zhōng yuán jié',en:'Zhongyuan Festival',time:'農曆七月十五',meaning:'普渡與祈福',ids:[21,22,23],relatedIds:[20,21,22,23]},
{name:'中秋節',pinyin:'Zhōng qiū jié',en:'Mid-Autumn Festival',time:'農曆八月十五',meaning:'家人團圓',ids:[1,18,11]},
{name:'教師節',pinyin:'Jiào shī jié',en:'Teachers’ Day',time:'國曆九月二十八日',meaning:'感謝老師',ids:[3,6,7]},
{name:'冬至',pinyin:'Dōng zhì',en:'Winter Solstice',time:'國曆約十二月二十一至二十二日',meaning:'團圓過冬',ids:[1,8,24]}
];
let selectedFestival=0,categoryFilter='all';
function updateCategoryGuide(){const names=['相聚與心意','節日食物','節日活動','祭祀與祝願'],counts=[7,5,7,5],descriptions=['和家人朋友在一起，表達關心與感謝。','看看不同節日，大家會吃什麼。','看看不同節日，大家會做什麼。','認識祭拜的習俗，了解祈求平安的心意。'];$('categoryTitle').textContent=categoryFilter==='all'?'全部活動與習俗':names[+categoryFilter];$('categoryExplanation').textContent=categoryFilter==='all'?'同一種活動，可能出現在不同節日。':descriptions[+categoryFilter];$('categoryCount').textContent=`${categoryFilter==='all'?24:counts[+categoryFilter]} 張圖卡`;}
function fillRelatedCard(id){const c=cards[id-1],matches=festivals.filter(f=>(f.relatedIds||f.ids).includes(id));$('relatedTitle').textContent=c.name;$('relatedEnglish').textContent=c.en;$('relatedPicture').innerHTML=art(c);$('relatedSentence').textContent=`說說看：「${matches.map(f=>f.name).join('、')}，可以${c.name==='家人團聚'?'和家人團聚':c.name}。」`;$('relatedListen').onclick=()=>speak(c);$('relatedRecord').onclick=()=>{$('relatedDialog').close();openRecord(id);};}
function showPage(id){stopAudio();['entryView','festivalView','learnView','gameView','recordsView'].forEach(x=>$(x).hidden=x!==id);const active=id==='gameView'?'gameTab':id==='recordsView'?'recordsTab':'learnTab';['learnTab','gameTab','recordsTab'].forEach(x=>{$(x).classList.toggle('active',x===active);$(x).setAttribute('aria-pressed',String(x===active));});if(id==='recordsView')renderRecords();window.scrollTo({top:0,behavior:'smooth'});}
function chooseFestival(index){selectedFestival=index;const f=festivals[index];$('festivalChoices').innerHTML=festivals.map((v,i)=>`<button data-festival="${i}" aria-pressed="${i===index}" class="${i===index?'selected':''}"><span>${String(i+1).padStart(2,'0')}</span>${v.name}</button>`).join('');$('festivalIntro').innerHTML=`<div><p class="eyebrow">${String(index+1).padStart(2,'0')} · 節日介紹</p><h2>${f.name}</h2><p>${f.pinyin} · ${f.en}</p><p><strong>${f.time}</strong><br>${f.meaning}</p></div><button id="listenIntro">🔊 聽介紹</button>`;$('listenIntro').onclick=()=>speak({name:`${f.name}。${f.time}。${f.meaning}。`});$('festivalActivities').innerHTML=f.ids.map(id=>{const c=cards[id-1];return `<article class="activity" style="--category:${c.color}"><button class="picture-button" data-festival-listen="${id}" aria-label="聽${c.name}">${art(c)}<span class="card-copy"><strong>${c.name}</strong><small>${c.en}</small></span></button><button class="record-button" data-festival-record="${id}">🎙 我的配音${recordings.has(id)?' ✓':''}</button></article>`;}).join('');}
$('festivalChoices').onclick=e=>{const b=e.target.closest('[data-festival]');if(b)chooseFestival(+b.dataset.festival);};
$('festivalActivities').onclick=e=>{const listen=e.target.closest('[data-festival-listen]'),rec=e.target.closest('[data-festival-record]');if(listen)speak(cards[+listen.dataset.festivalListen-1]);if(rec)openRecord(+rec.dataset.festivalRecord);};
$('recDialog').addEventListener('close',()=>chooseFestival(selectedFestival));
function applyCategory(){updateCategoryGuide();document.querySelectorAll('#library .activity').forEach(n=>{const i=+n.dataset.activity-1,category=i===23?1:i<7?0:i<11?1:i<18?2:3;n.hidden=categoryFilter!=='all'&&category!==+categoryFilter;});document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===categoryFilter)));}
function openActivities(category='all'){categoryFilter=String(category);applyCategory();showPage('learnView');}
$('openFestivals').onclick=()=>{chooseFestival(selectedFestival);showPage('festivalView');};$('openActivities').onclick=()=>openActivities();document.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>openActivities(b.dataset.category));document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{categoryFilter=b.dataset.filter;applyCategory();});document.querySelectorAll('.back-entry').forEach(b=>b.onclick=()=>showPage('entryView'));
new MutationObserver(applyCategory).observe($('library'),{childList:true});
$('library').addEventListener('click',e=>{const b=e.target.closest('[data-related]');if(!b)return;const id=+b.dataset.related;fillRelatedCard(id);$('relatedFestivals').innerHTML=festivals.map((f,i)=>(f.relatedIds||f.ids).includes(id)?`<button data-related-festival="${i}">${f.name} →</button>`:'').join('');$('relatedDialog').showModal();});
$('relatedFestivals').onclick=e=>{const b=e.target.closest('[data-related-festival]');if(b){$('relatedDialog').close();chooseFestival(+b.dataset.relatedFestival);showPage('festivalView');}};$('closeRelated').onclick=()=>$('relatedDialog').close();
function renderRecords(){$('recordSummary').innerHTML=`<article><span>我的配音</span><strong>${recordings.size} / 24</strong><button id="reviewRecordings">回活動卡錄音 →</button></article><article><span>01 發牌遊戲</span><strong>${dealBadges.size} / 10 枚章</strong><p>${dealBadges.size?[...dealBadges].map(i=>festivals[i].name).join("、"):"選節日，集滿三張活動卡就能領章。"}</p><button id="continueGame">回發牌遊戲 →</button></article>`;$('reviewRecordings').onclick=()=>openActivities();$('continueGame').onclick=()=>showPage('gameView');}
$('recordsTab').onclick=()=>showPage('recordsView');$('entryExamples').innerHTML=[1,12,13].map(id=>{const c=cards[id-1];return `<div style="--category:${c.color}">${art(c)}<strong>${c.name}</strong></div>`;}).join('');chooseFestival(0);applyCategory();



if(location.hash==='#activities')openActivities();



