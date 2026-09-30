const progressKey='festival-learning-v5';
let progressStorageOK=true;
const badgeSets=[dealBadges,gameBadges[2],gameBadges[3],memoryBadges];
try{const saved=JSON.parse(localStorage.getItem(progressKey)||'[]');if(Array.isArray(saved))saved.slice(0,4).forEach((ids,i)=>{if(Array.isArray(ids))ids.filter(n=>Number.isInteger(n)&&n>=0&&n<10).forEach(n=>badgeSets[i].add(n));});}catch{progressStorageOK=false;}
function saveProgress(){try{localStorage.setItem(progressKey,JSON.stringify(badgeSets.map(set=>[...set])));progressStorageOK=true;}catch{progressStorageOK=false;toast('目前無法儲存完成章；關閉網頁前請保留你的成果。');}}
const gameNames=['01 發牌遊戲','02 情境挑戰','03 句子重組','04 翻牌記憶'];
const recordsIntro=document.querySelector('#recordsView>p:not(.eyebrow)');
renderRecords=function(){
 recordsIntro.textContent=progressStorageOK?'完成章與錄音保存在這個瀏覽器。未完成的回合不保留；換装置、換網址或清除網站資料後，記錄不會跟著移轉。':'目前無法讀取或儲存完成章，以下顯示本次開啟的成果。錄音是否可儲存，請以錄音視窗提示為準。';
 const total=badgeSets.reduce((n,s)=>n+s.size,0),complete=festivals.filter((_,i)=>badgeSets.every(s=>s.has(i))).length;
 $('recordSummary').className='learning-records';
 $('recordSummary').innerHTML=`<div class="record-totals"><article><span>我的節日章</span><strong>${total} / 40</strong><small>每個節日有四種遊戲章</small></article><article><span>四種遊戲全完成</span><strong>${complete} / 10</strong><small>已完成的節日</small></article><article><span>我的配音</span><strong>${recordings.size} / 24</strong><small>已儲存的活動錄音</small></article></div>
 <h2>我的節日集章冊</h2><p>✓ 表示已完成；點選格子可以開始練習，完成的也能再玩。</p><div class="record-table-scroll"><table class="record-table"><caption>十個節日 × 四種遊戲</caption><thead><tr><th scope="col">節日</th>${gameNames.map(n=>`<th scope="col">${n}</th>`).join('')}</tr></thead><tbody>${festivals.map((f,i)=>`<tr><th scope="row">${String(i+1).padStart(2,'0')} ${f.name}</th>${badgeSets.map((s,g)=>`<td><button class="${s.has(i)?'badge-done':''}" data-record-festival="${i}" data-record-mode="${g}" aria-label="${f.name}，${gameNames[g]}，${s.has(i)?'已完成，再玩一次':'尚未完成，開始練習'}">${s.has(i)?'✓ 已完成':'▶ 練習'}</button></td>`).join('')}</tr>`).join('')}</tbody></table></div>
 <div class="record-voice-heading"><h2>我的活動配音</h2><button id="recordsToActivities">回A活動圖卡 →</button></div><p>可聽自己的錄音，也可以補錄或重錄。錄音不會上傳；重錄會取代同一張卡的舊錄音。</p><div class="record-voices">${cards.map(c=>`<article><strong>${String(c.id).padStart(2,'0')} ${c.name}</strong><span>${recordings.has(c.id)?'✓ 已錄音':'尚未錄音'}</span><div><button data-record-play="${c.id}" ${recordings.has(c.id)?'':'disabled'} aria-label="播放${c.name}的錄音">▶ 播放</button><button data-record-voice="${c.id}">${recordings.has(c.id)?'重錄':'錄音'}</button></div></article>`).join('')}</div><p class="small">完成章表示已完成練習，不是測驗成績或口說能力評分。</p>`;
 $('recordsToActivities').onclick=()=>openActivities();
};
$('recordSummary').addEventListener('click',e=>{const game=e.target.closest('[data-record-mode]'),play=e.target.closest('[data-record-play]'),voice=e.target.closest('[data-record-voice]');if(play)speak(cards[+play.dataset.recordPlay-1]);if(voice)openRecord(+voice.dataset.recordVoice);if(!game)return;const f=+game.dataset.recordFestival,g=+game.dataset.recordMode;if(g===0){chooseDealFestival(f);showPage('gameView');}else if(g===3){memoryFestival=f;$('memoryFestival').value=f;startMemory();showPage('memoryView');}else{practiceMode=g+1;practiceFestival=f;$('practiceFestival').value=f;startPractice();showPage('practiceView');}});
$('recDialog').addEventListener('close',()=>{if(!$('recordsView').hidden)renderRecords();});
new MutationObserver(()=>{if(!$('recordsView').hidden)renderRecords();}).observe($('recordCount'),{childList:true});
