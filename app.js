(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const app=$('#app');

/* ---------- icons ---------- */
const I={
 start:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M8 40V8h20l12 12v20H8Z"/><path d="M28 8v12h12"/><path d="M17 30l5 5 9-11"/></svg>',
 rules:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M24 5 8 11v12c0 10 7 17 16 20 9-3 16-10 16-20V11L24 5Z"/><path d="M17 24h14M17 31h9M17 17h14"/></svg>',
 classes:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="24" cy="16" r="8"/><path d="M8 42c2-9 8-14 16-14s14 5 16 14"/><path d="M33 9l6-4M38 16h6"/></svg>',
 backgrounds:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4"><rect x="7" y="10" width="34" height="28"/><path d="M7 18h34M14 26h8M14 31h14"/><circle cx="34" cy="29" r="3"/></svg>',
 world:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 42h36"/><path d="M10 42V20h8v22M20 42V8h9v34M31 42V16h7v26"/><path d="M23 14h3M23 20h3M23 26h3M13 26h2M34 22h2"/></svg>',
 mechanics:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4"><rect x="14" y="14" width="20" height="20"/><path d="M19 14V6M29 14V6M19 42v-8M29 42v-8M14 19H6M14 29H6M42 19h-8M42 29h-8"/><path d="M20 24h8"/></svg>',
 news:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 12h30v26H10a4 4 0 0 1-4-4V12Z"/><path d="M36 18h6v16a4 4 0 0 1-4 4h-2"/><path d="M12 19h18M12 25h18M12 31h11"/></svg>',
 donate:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M24 6 42 16v16L24 42 6 32V16L24 6Z"/><path d="M24 15v18M19 19h7a3 3 0 0 1 0 6h-4a3 3 0 0 0 0 6h7"/></svg>',
 bolt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>',
 warn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3 2 21h20L12 3Z"/><path d="M12 10v5M12 18v.5"/></svg>',
 info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
 danger:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3h8l5 5v8l-5 5H8l-5-5V8l5-5Z"/><path d="M12 8v5M12 16v.5"/></svg>'
};

/* ---------- sections ---------- */
const SECTIONS=[
 {id:'start',t:'Как начать',code:'M-01',c:'#00f0ff',d:'Вход на сервер, моды, ролевая система и первые шаги'},
 {id:'rules',t:'Правила',code:'M-02',c:'#ff2a6d',d:'Как вести себя в роли и вне её'},
 {id:'classes',t:'Классы',code:'M-03',c:'#00f0ff',d:'Соло, Нетраннер, Техник, Медтехник, Рокер'},
 {id:'backgrounds',t:'Предыстории',code:'M-04',c:'#f5e400',d:'Шесть жизненных путей, с которых начинается персонаж'},
 {id:'world',t:'Игровой мир',code:'M-05',c:'#ff2a6d',d:'Хронология, Чикаго, НСША, корпорации, банды'},
 {id:'mechanics',t:'Механика',code:'M-06',c:'#3dffa8',d:'Импланты, оружие, броня, кибердеки, крафт'},
 {id:'news',t:'Новости',code:'M-07',c:'#00f0ff',d:'Что изменилось на сайте и в правилах'},
 {id:'donate',t:'Донат',code:'M-08',c:'#f5e400',d:'Подписки NightCorp и аренда жилья'}
];
const SEC={};SECTIONS.forEach(s=>SEC[s.id]=s);

/* ---------- inline markup ---------- */
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function inl(s){
  s=esc(s);
  s=s.replace(/\{\{([^}]+)\}\}/g,'<code>$1</code>');
  s=s.replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>');
  s=s.replace(/==([^=]+)==/g,'<mark>$1</mark>');
  s=s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,(m,t,u)=>u.startsWith('#')?`<a href="${u}">${t}</a>`:`<a href="${u}" target="_blank" rel="noopener">${t}</a>`);
  return s;
}
const split=l=>l.split(/\s+\|\s+/);

/* ---------- block markup ---------- */
function render(src,ctx){
  const L=src.replace(/\r/g,'').split('\n');let i=0,o=[];
  const toc=ctx.toc;let hn=0;
  while(i<L.length){
    let l=L[i];const t=l.trim();
    if(!t){i++;continue}
    if(t.startsWith('::')&&t!=='::'){
      const m=t.slice(2).trim(),sp=m.indexOf(' ');
      const type=sp<0?m:m.slice(0,sp),arg=sp<0?'':m.slice(sp+1);
      const body=[];i++;
      let depth=1;
      while(i<L.length){const tt=L[i].trim();if(tt==='::'){depth--;if(!depth)break}else if(tt.startsWith('::'))depth++;body.push(L[i]);i++}
      i++;o.push(block(type,arg,type==='more'?body:body.filter(x=>x.trim()),ctx));continue;
    }
    if(t.startsWith('## ')){hn++;const id='s'+hn;toc.push({id,t:t.slice(3)});o.push(`<h2 id="${id}"><span class="hn">${String(hn).padStart(2,'0')}</span><span>${inl(t.slice(3))}</span></h2>`);i++;continue}
    if(t.startsWith('### ')){o.push(`<h3>${inl(t.slice(4))}</h3>`);i++;continue}
    if(t.startsWith('> ')){o.push(`<div class="quote">${inl(t.slice(2))}</div>`);i++;continue}
    if(/^- /.test(t)){const it=[];while(i<L.length&&/^- /.test(L[i].trim())){it.push(`<li>${inl(L[i].trim().slice(2))}</li>`);i++}o.push(`<ul>${it.join('')}</ul>`);continue}
    if(/^\d+\. /.test(t)){const it=[];while(i<L.length&&/^\d+\. /.test(L[i].trim())){it.push(`<li>${inl(L[i].trim().replace(/^\d+\. /,''))}</li>`);i++}o.push(`<ol>${it.join('')}</ol>`);continue}
    o.push(`<p>${inl(t)}</p>`);i++;
  }
  return o.join('\n');
}
function paras(lines){return lines.map(l=>{l=l.trim();return /^- /.test(l)?`<ul><li>${inl(l.slice(2))}</li></ul>`:`<p>${inl(l)}</p>`}).join('').replace(/<\/ul><ul>/g,'')}
function block(type,arg,b,ctx){
  switch(type){
  case 'tldr':return `<div class="tldr"><div class="k">${I.bolt}${arg?inl(arg):'Коротко'}</div><ul>${b.map(l=>`<li>${inl(l.trim().replace(/^- /,''))}</li>`).join('')}</ul></div>`;
  case 'cards':{const n=parseInt(arg)||2;return `<div class="cards" style="--cols:${n}">${b.map(l=>{const [h,p,tag]=split(l.trim());return `<div class="card">${tag?`<span class="badge">${inl(tag)}</span>`:''}<h4>${inl(h)}</h4>${p?`<p>${inl(p)}</p>`:''}</div>`}).join('')}</div>`}
  case 'links':return `<div class="linkrow">${b.map(l=>{const [h,u]=split(l.trim());return u.startsWith('#')?`<a href="${u}">${inl(h)}</a>`:`<a href="${u}" target="_blank" rel="noopener">${inl(h)} ↗</a>`}).join('')}</div>`;
  case 'facts':return `<dl class="facts">${b.map(l=>{const [k,...v]=split(l.trim());return `<dt>${inl(k)}</dt><dd>${inl(v.join(' | '))}</dd>`}).join('')}</dl>`;
  case 'table':{const [h,...r]=b;return `<div class="tbl"><table><thead><tr>${split(h.trim()).map(c=>`<th>${inl(c)}</th>`).join('')}</tr></thead><tbody>${r.map(row=>`<tr>${split(row.trim()).map(c=>`<td>${inl(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
  case 'timeline':return `<div class="tl">${b.map(l=>{const [d,...x]=split(l.trim());return `<div class="ev"><div class="d">${inl(d)}</div><div class="t">${inl(x.join(' | '))}</div></div>`}).join('')}</div>`;
  case 'steps':return `<div class="steps">${b.map(l=>`<div class="step"><p>${inl(l.trim().replace(/^- /,''))}</p></div>`).join('')}</div>`;
  case 'rules':return `<div class="rules">${b.map(l=>{const [n,x,note]=split(l.trim());return `<div class="rule"><div class="n">${inl(n)}</div><div class="x"><p>${inl(x||'')}</p>${note?`<p class="note">${inl(note)}</p>`:''}</div></div>`}).join('')}</div>`;
  case 'warn':case 'info':case 'danger':return `<div class="call ${type}">${I[type]}<div>${arg?`<p><b>${inl(arg)}</b></p>`:''}${paras(b)}</div></div>`;
  case 'quote':return `<div class="quote">${b.map(inl).join('<br>')}${arg?`<cite>${inl(arg)}</cite>`:''}</div>`;
  case 'stats':return `<div class="stats">${b.map(l=>{const [v,k]=split(l.trim());return `<div class="stat"><b>${inl(v)}</b><span>${inl(k||'')}</span></div>`}).join('')}</div>`;
  case 'terms':return `<div class="terms">${b.map(l=>{const [k,...v]=split(l.trim());return `<div class="term"><b>${inl(k)}</b><p>${inl(v.join(' | '))}</p></div>`}).join('')}</div>`;
  case 'chips':return `<div class="chips">${b.join(', ').split(/\s*,\s*/).filter(Boolean).map(c=>`<span class="chip">${inl(c)}</span>`).join('')}</div>`;
  case 'more':return `<details class="more"><summary>${inl(arg||'Подробнее')}</summary><div class="in">${render(b.join('\n'),{toc:[]})}</div></details>`;
  case 'price':{ // tier blocks separated by lines starting with "# "
    const tiers=[];let cur=null;
    b.forEach(l=>{l=l.trim();if(l.startsWith('# ')){const [n,c,h]=split(l.slice(2));cur={n,c,h:!!h,it:[]};tiers.push(cur)}else if(cur)cur.it.push(l.replace(/^- /,''))});
    return `<div class="price">${tiers.map(t=>`<div class="tier${t.h?' hot':''}"><h4>${inl(t.n)}</h4><div class="cost">${inl(t.c)}</div><ul>${t.it.map(x=>`<li>${inl(x)}</li>`).join('')}</ul></div>`).join('')}</div>`}
  case 'items':return itemsBlock(arg.trim());
  case 'boosty':{const u=S().boosty;return u?`<div class="linkrow"><a class="boosty" href="${esc(u)}" target="_blank" rel="noopener">Поддержать на Boosty ↗</a></div>`:''}
  case 'server':{const [ip0,note]=split(arg.trim());const ip=S().ip||ip0;return `<div class="srv"><div class="srv-k"><span class="dot"></span>Адрес сервера</div><button class="srv-ip" data-copy="${esc(ip)}" title="Скопировать адрес">${esc(ip)}<small>нажми, чтобы скопировать</small></button><div class="srv-note">${I.info||''}<span>${inl(note||'')}</span></div>${b.length?`<p class="srv-sub">${b.map(inl).join('<br>')}</p>`:''}</div>`}
  case 'subpages':{const ids=b.map(x=>x.trim());return `<div class="cards" style="--cols:${parseInt(arg)||2}">${ids.map(id=>{const p=PM.byId[id];if(!p)return '';return `<a class="card" href="#${id}"><h4>${inl(p.t)}</h4>${p.lead?`<p>${inl(p.lead)}</p>`:''}</a>`}).join('')}</div>`}
  default:return `<p>${b.map(inl).join('<br>')}</p>`;
  }
}

/* ---------- item catalog ---------- */
const RAR={'Базовое':'#8792ab','Редкое':'#00f0ff','Очень редкое':'#b46bff','Легендарное':'#f5e400'};
let itemSeq=0;
function rarity(it){const r=(it.stats.find(s=>s[0]==='Редкость')||[])[1]||'';const k=Object.keys(RAR).find(k=>r.startsWith(k));return {label:r,color:k?RAR[k]:'#8792ab'}}
function statVal(s){let v=s[1]||'';const subs=s.slice(2).map(x=>`${esc(x[0])}: ${esc(x[1])}`);return (v?inl(v):'')+(subs.length?`<span class="sub">${subs.join(' · ')}</span>`:'')}
function itemsBlock(key){
  const list=(window.ITEMS||{})[key]||[];if(!list.length)return '';
  const id='ig'+(itemSeq++);const cats=[...new Set(list.map(i=>i.cat).filter(Boolean))];
  const SUM=['Урон','Урон очереди','Броня тела','Броня головы','Куб лечения','Куб урона','Память','Боезапас','Память','Куб лечения','Куб урона','Урон \"ЭМИ\"','Действие'];
  const cards=list.map(it=>{
    const r=rarity(it);const type=(it.stats.find(s=>s[0]==='Тип')||[])[1];
    const sum=it.stats.filter(s=>SUM.includes(s[0])).sort((a,b)=>SUM.indexOf(a[0])-SUM.indexOf(b[0])).slice(0,2).map(s=>`<span><i>${esc(s[0])}</i> ${esc(s[1]||'')}</span>`).join('');
    const rows=it.stats.filter(s=>s[0]!=='Редкость'&&s[0]!=='Тип').map(s=>`<tr><th>${esc(s[0])}</th><td>${statVal(s)}</td></tr>`).join('');
    const notes=(it.notes||[]).map(n=>`<p class="note">${n[0]?`<b>${esc(n[0])}:</b> `:''}${inl(n[1])}</p>`).join('');
    const mods=it.mods?`<ul>${it.mods.map(m=>`<li>${inl(m)}</li>`).join('')}</ul>`:'';
    return `<details class="item" data-cat="${esc(it.cat||'')}" data-q="${esc((it.name+' '+(it.desc||'')+' '+(type||'')).toLowerCase())}" style="--r:${r.color}">
      <summary>${it.icon?`<img src="${it.icon}" alt="" loading="lazy" width="72" height="72">`:`<span class="noimg"></span>`}
        <span class="meta">${it.badge?`<em class="bdg">${esc(it.badge)}</em>`:''}${r.label?`<em class="rar">${esc(r.label)}</em>`:''}<b>${esc(it.name)}</b>${type?`<small>${esc(type)}</small>`:''}<span class="sum">${sum}</span><span class="more-hint">Нажмите, чтобы узнать больше</span></span></summary>
      <div class="body">${it.desc?`<p>${inl(it.desc)}</p>`:''}${rows?`<table>${rows}</table>`:''}${mods}${notes}</div></details>`}).join('');
  return `<div class="catalog" id="${id}"><div class="cat-bar"><div class="cat-tabs">${cats.length>1?`<button class="on" data-c="">Все <small>${list.length}</small></button>`+cats.map(c=>`<button data-c="${esc(c)}">${esc(c)} <small>${list.filter(i=>i.cat===c).length}</small></button>`).join(''):''}</div><input type="search" placeholder="Найти в списке…" aria-label="Фильтр по названию"></div><div class="items">${cards}</div></div>`;
}
function wireCatalogs(){
  $$('.catalog').forEach(cg=>{let cat='',q='';const apply=()=>$$('.item',cg).forEach(el=>{el.hidden=!((!cat||el.dataset.cat===cat)&&(!q||el.dataset.q.includes(q)))});
    $$('.cat-bar button',cg).forEach(b=>b.onclick=()=>{cat=b.dataset.c;$$('.cat-bar button',cg).forEach(x=>x.classList.toggle('on',x===b));apply()});
    const inp=$('input',cg);inp.oninput=()=>{q=inp.value.trim().toLowerCase();apply()}});
}

/* ---------- ordering ---------- */
const ordered=()=>SECTIONS.flatMap(s=>PM.pages.filter(p=>p.sec===s.id));
function secPages(sid){return PM.pages.filter(p=>p.sec===sid)}

/* ---------- top nav ---------- */
$('#topnav').innerHTML=SECTIONS.slice(0,6).map(s=>`<a href="#sec-${s.id}" data-s="${s.id}">${s.t}</a>`).join('');

/* ---------- views ---------- */
const BGI={"fixer": "<path d=\"M4 9h16v10H4z\"/><path d=\"M9 9V6h6v3\"/><path d=\"M4 13h16\"/><path d=\"M11 13v2h2v-2\"/>", "media": "<rect x=\"3\" y=\"7\" width=\"13\" height=\"10\" rx=\"1\"/><path d=\"M16 11l5-3v8l-5-3\"/><circle cx=\"8\" cy=\"12\" r=\"2.2\"/>", "lawman": "<path d=\"M12 3l7 3v5c0 5-3.2 8.2-7 10-3.8-1.8-7-5-7-10V6z\"/><path d=\"M12 8.5l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z\"/>", "nomad": "<circle cx=\"12\" cy=\"12\" r=\"8.5\"/><circle cx=\"12\" cy=\"12\" r=\"2.2\"/><path d=\"M12 3.5v6.3M4.6 16.3l5.5-3.2M19.4 16.3l-5.5-3.2\"/>", "streetkid": "<path d=\"M8 9h7v12H8z\"/><path d=\"M9.5 9V6.5h4V9\"/><path d=\"M11.5 6.5V4h2\"/><path d=\"M17 5.5l2-1M17 8h2.5M17 10.5l2 1\"/>", "corpo": "<path d=\"M6 21V7l6-4 6 4v14\"/><path d=\"M3 21h18\"/><path d=\"M9.5 10h1M13.5 10h1M9.5 13.5h1M13.5 13.5h1M9.5 17h1M13.5 17h1\"/>"};
function home(){
  const art=window.ART||{};
  const st=SECTIONS.map((s,i)=>{
    const n=secPages(s.id).length;
    return `<a class="station${i<2||i>5?' big':''}${art[s.id]?' has-art':''}" href="#sec-${s.id}" style="--c:${s.c}">
      ${art[s.id]?`<div class="bg" style="background-image:url('${art[s.id]}')"></div>`:''}
      <div class="code"><span class="stop"></span>${s.code}${n>1?` · ${n} стр.`:''}</div>
      <span class="go">ОТКРЫТЬ ›</span>
      <div class="ico">${I[s.id]}</div>
      <h3>${s.t}</h3><p>${s.d}</p></a>`}).join('');
  const roles=[['solo','Соло','Наёмный стрелок, телохранитель, киберсамурай','#00f0ff'],['netrunner','Нетраннер','Хакер, который ныряет в Сеть с головой','#ff2a6d'],['techie','Техник','Соберёт, разберёт и улучшит что угодно','#f5e400'],['medtech','Медтехник','Риппердок: латает тела и ставит импланты','#3dffa8'],['rocker','Рокер','Музыка и слово как оружие против системы','#b46bff']];
  const bgs=[['fixer','Фиксер','Посредник: сделки, связи, информация','#f5e400'],['media','Медиа','Журналист, для которого правда — оружие','#00f0ff'],['lawman','Законник','Коп или агент в городе, где бандиты сильнее','#4d8bff'],['nomad','Кочевник','Семья на колёсах, за спиной вся стая','#ff8a3d'],['streetkid','Дитя улиц','Вырос в трущобах и знает каждый угол','#c6ff3d'],['corpo','Корпорат','Карьера в башне, где улыбка — тоже нож','#ff2a6d']];
  app.innerHTML=`
  <section class="hero${art.hero?' has-art':''}" id="hero">
    ${art.hero?'':'<canvas id="sky" aria-hidden="true"></canvas>'}
    ${art.hero?`<picture>${art.heroMobile?`<source media="(max-width:700px)" srcset="${art.heroMobile}">`:''}<img class="art" src="${art.hero}" alt="" fetchpriority="high" onload="this.classList.add('ready')"></picture>`:''}
    <canvas class="rain" id="rain" aria-hidden="true"></canvas>
    ${art.crew?`<div class="crew-wrap" id="crewWrap"><img class="crew" src="${art.crew}" alt="" onload="this.parentNode.classList.add('ready')"><div class="crew-fx" aria-hidden="true">
        <canvas class="smoke"></canvas><i class="ember"></i>
        <i class="eye b" style="--x:38.5;--y:34.6"></i>
        <i class="eye b" style="--x:52.7;--y:11.5"></i><i class="eye b" style="--x:55.8;--y:11.5"></i>
        <i class="eye r" style="--x:82.6;--y:9.2;--d:0s"></i><i class="eye r" style="--x:85.7;--y:7.8;--d:.35s"></i><i class="eye r" style="--x:86.7;--y:10.8;--d:.7s"></i><i class="eye r" style="--x:83.1;--y:12.4;--d:1.05s"></i>
        <i class="imp c" style="--x:40.5;--y:37.5;--s:5;--d:.2s"></i>
        <i class="imp c" style="--x:41.6;--y:47.5;--s:6;--d:1.1s"></i>
        <i class="imp c" style="--x:24.5;--y:74;--s:5;--d:2s"></i>
        <i class="imp c" style="--x:46.5;--y:13;--s:5;--d:.6s"></i>
        <i class="imp c" style="--x:69;--y:33.6;--s:4;--d:1.5s"></i>
        <i class="imp r" style="--x:95;--y:41;--s:6;--d:.9s"></i>
      </div></div>`:''}
    <div class="hero-in">
      <div class="boot" id="boot" aria-hidden="true"></div>
      ${art.logo?`<h1 class="logo-t"><span class="sr">Project Matrix: Chicago 2077</span><img src="${art.logo}" alt=""><img class="g g1" src="${art.logo}" alt=""><img class="g g2" src="${art.logo}" alt=""></h1>`:`<h1 class="title"><span class="l1 glitch" data-t="PROJECT">PROJECT</span><span class="l2"><span class="glitch" data-t="MATRIX">MATRIX</span><span class="yr">2077</span></span></h1>`}
      <p class="lede">Ролевой мир, где каждый шаг имеет цену. <b>Чикаго, 2077 год:</b> свет рекламы прикрывает гниль улиц, а обещания корпораций стоят дешевле пули.</p>
      <div class="hero-cta">
        <a class="btn btn-p" href="#start-join">Начать играть</a>
        <a class="btn btn-g" href="#sec-world">Изучить мир</a>
        <a class="btn btn-w" href="${esc(S().wargm)}" target="_blank" rel="noopener" title="Страница сервера на WARGM"><span class="wg">WARGM</span> Страница сервера ↗</a>
        <button class="ip" id="copyIp" title="Скопировать адрес сервера"><span class="dot"></span><span><small>Сервер · нажми, чтобы скопировать</small>${esc(S().ip)}</span></button>
      </div>
    </div>
  </section>
  <section class="wrap metro">
    <div class="metro-head"><h2 class="h-sec">Разделы</h2><p>Впервые здесь? Начни с «Как начать» и «Правил». Остальное открывай, когда захочешь узнать больше о мире и механиках.</p></div>
    <div class="line"><div class="rail-line" aria-hidden="true"></div>${st}</div>
  </section>
  <section class="wrap manifesto">
    <div><blockquote>Здесь нет героев. Есть те, кто готов рискнуть, и те, кто <em>уже заплатил</em> за свой выбор.</blockquote><cite>// Сегодня ты подписываешь контракт, завтра сам становишься его жертвой.</cite></div>
    <div class="pillars">
      <div class="pillar"><h4>Песочница без рельсов</h4><p>Сценарии не пишут заранее. Всё, что случается, рождается на глазах и делается руками игроков.</p></div>
      <div class="pillar"><h4>Решения важнее кубов</h4><p>Авторская система с элементами D&amp;D. Сделки, переговоры, взломы и предательства меняют мир: кварталы переходят из рук в руки, корпорации отвечают.</p></div>
      <div class="pillar"><h4>Нет второстепенных ролей</h4><p>Подними банду против корпораций, стань фантомом Сети или легендой сцены. Можно остаться никем, можно стать легендой.</p></div>
      <div class="pillar"><h4>Доверие и уважение</h4><p>Мы ценим историю, драму, конфликты, дружбу, падение, спасение и смерть. Идеи игроков становятся частью лора.</p></div>
    </div>
  </section>
  <section class="wrap roles">
    ${art.roles?`<div class="roles-art" style="background-image:url('${art.roles}')"></div>`:''}<div class="metro-head"><h2 class="h-sec">Кем ты будешь?</h2><p>Класс определяет навыки. Предыстория определяет, откуда ты пришёл. Сочетай как хочешь.</p></div>
    <div class="role-k"><span>Класс</span><a href="#sec-classes">Все классы ›</a></div><div class="role-row">${roles.map((([id,n,d,c])=>`<a class="role${art[id]?' has-art':''}" href="#${id}" style="--c:${c}"><div class="portrait" ${art[id]?`style="background-image:url('${art[id]}'),radial-gradient(ellipse at 50% 75%,color-mix(in srgb,${c} 32%,transparent),transparent 65%),linear-gradient(180deg,#0b0e17,#111626)"`:''}></div><b>${n}</b><span>${d}</span></a>`)).join('')}</div><div class="role-k c"><span>Предыстория</span><a href="#sec-backgrounds">Все предыстории ›</a></div><div class="bg-btns">${bgs.map(([id,n,d,c])=>`<a class="bg-btn" href="#${id}" style="--c:${c}" title="${d}"><span class="ni"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${BGI[id]||''}</svg></span><b>${n}</b></a>`).join('')}</div>
  </section>



  <footer class="wrap foot"><span>Project Matrix 2077 · ролевой сервер Conan Exiles</span><span><a href="${esc(S().discord)}" target="_blank" rel="noopener">Discord</a> · <a href="${esc(S().wargm)}" target="_blank" rel="noopener">WARGM</a> · <a href="#news">Новости</a> · <a href="#admin" class="adm-link">Админ</a></span></footer>`;
  $('#copyIp').onclick=()=>copy(S().ip);
  if(!art.hero)sky();boot();parallax();rain();crewFx();
  stationGlow();
}

let rainRAF=0;
function rain(){
  cancelAnimationFrame(rainRAF);const c=$('#rain');if(!c||reduce)return;
  const x=c.getContext('2d');let W,H,drops=[],dpr=Math.min(devicePixelRatio||1,2);
  const mk=(y)=>{const z=Math.random();return {x:Math.random()*(W+200)-100,y:y!=null?y:Math.random()*H,z,l:10+z*26,v:(9+z*14)*dpr*.6,a:.08+z*.32,m:Math.random()<.07}};
  function size(){const r=c.getBoundingClientRect();W=c.width=r.width*dpr;H=c.height=r.height*dpr;const n=Math.round(r.width*r.height/5200);drops=Array.from({length:n},()=>mk())}
  size();let vis=true;const io=new IntersectionObserver(e=>{vis=e[0].isIntersecting});io.observe(c);
  addEventListener('resize',size);
  const wind=-.18;
  function f(){
    if(!document.body.contains(c)){io.disconnect();removeEventListener('resize',size);return}
    rainRAF=requestAnimationFrame(f);if(!vis||document.hidden)return;
    x.clearRect(0,0,W,H);x.lineCap='round';
    for(const d of drops){
      d.y+=d.v;d.x+=d.v*wind;
      if(d.y>H+30){Object.assign(d,mk(-30));}
      x.strokeStyle=d.m?`rgba(255,42,109,${d.a})`:`rgba(190,235,255,${d.a})`;x.lineWidth=(.6+d.z*1.1)*dpr;
      x.beginPath();x.moveTo(d.x,d.y);x.lineTo(d.x-d.l*wind*dpr,d.y-d.l*dpr);x.stroke();
    }
  }
  f();
}

function crewFx(){
  const w=$('#crewWrap');if(!w)return;const h=$('#hero');
  const fit=()=>{const r=h.getBoundingClientRect();const ar=1204/924;let ht=r.height*.94;const maxW=innerWidth*.66;if(ht*ar>maxW)ht=maxW/ar;w.style.height=ht+'px';w.style.width=ht*ar+'px'};
  fit();addEventListener('resize',fit);
  const c=$('.smoke',w);if(!c||reduce)return;const x=c.getContext('2d');let P=[],t=0,W,H;
  const sz=()=>{const r=c.getBoundingClientRect();W=c.width=r.width;H=c.height=r.height};sz();addEventListener('resize',sz);
  let vis=true;const io=new IntersectionObserver(e=>{vis=e[0].isIntersecting});io.observe(c);
  (function f(){if(!document.body.contains(c)){io.disconnect();return}requestAnimationFrame(f);if(!vis||document.hidden)return;t++;
    if(t%3===0)P.push({x:W*.5,y:H-2,vx:(Math.random()-.5)*.25,vy:-(.45+Math.random()*.35),r:3+Math.random()*3,a:.5,ph:Math.random()*6});
    x.clearRect(0,0,W,H);
    for(const p of P){p.ph+=.03;p.x+=p.vx+Math.sin(p.ph+t*.01)*.35+(H-p.y)/H*.25;p.y+=p.vy;p.r+=.12;p.a*=.991;
      const g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);g.addColorStop(0,`rgba(205,215,230,${p.a})`);g.addColorStop(1,'rgba(205,215,230,0)');x.fillStyle=g;x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill()}
    P=P.filter(p=>p.a>.012&&p.y>-20);
  })();
}
function parallax(){const h=$('#hero');if(!h||reduce||!matchMedia('(pointer:fine)').matches)return;let raf=0;h.addEventListener('pointermove',e=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const r=h.getBoundingClientRect();h.style.setProperty('--px',((e.clientX-r.left)/r.width-.5).toFixed(3));h.style.setProperty('--py',((e.clientY-r.top)/r.height-.5).toFixed(3))})})}
function stationGlow(){$$('.station').forEach(el=>el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px')}))}

function railHTML(sid,curId){
  const s=SEC[sid];const ps=secPages(sid);let lastG=null;
  const items=ps.map(p=>{let g='';if(p.grp&&p.grp!==lastG){lastG=p.grp;g=`<div class="grp">${esc(p.grp)}</div>`}
    return g+`<a href="#${p.id}" class="${p.lvl===1?'sub':p.lvl===2?'sub2':''}${p.id===curId?' on':''}">${esc(p.t)}</a>`}).join('');
  const others=SECTIONS.filter(x=>x.id!==sid).map(x=>`<a href="#sec-${x.id}" style="--c:${x.c}">${I[x.id]}${x.t}</a>`).join('');
  return `<aside class="rail" id="rail" style="--c:${s.c}"><h5>${I[sid]}<a href="#sec-${sid}" style="border:0;padding:0;color:inherit">${s.t}</a></h5>${items}<div class="other">${others}</div></aside>`;
}
function page(p){
  const s=SEC[p.sec];const ctx={toc:[]};
  const body=render(p.md||'',ctx);
  const list=ordered();const k=list.indexOf(p);const prev=list[k-1],next=list[k+1];
  const parent=p.parent&&PM.byId[p.parent];
  const art=(window.ART||{})[p.id];const fig=art&&art.includes('/people/');
  app.innerHTML=`<div class="doc">${railHTML(p.sec,p.id)}
  <article class="article enter" style="--c:${s.c}">
    ${art&&!fig?`<div class="ph-art" style="background-image:url('${art}')"></div>`:''}
    <div class="crumbs"><a href="#home">Главная</a><i>/</i><a href="#sec-${s.id}">${s.t}</a>${parent?`<i>/</i><a href="#${parent.id}">${esc(parent.t)}</a>`:''}</div>
    ${fig?'<div class="ph-wrap">':''}<header class="ph"><div class="tag">${esc(p.kicker||s.t)}</div><h1 class="scramble">${esc(p.h||p.t)}</h1>${p.lead?`<p class="lead">${inl(p.lead)}</p>`:''}</header>${fig?`<div class="ph-fig"><img src="${art}" alt=""></div></div>`:''}
    <div class="prose">${body}</div>
    <nav class="pager">${prev?`<a href="#${prev.id}"><small>‹ Назад</small><b>${esc(prev.t)}</b></a>`:''}${next?`<a class="nx" href="#${next.id}"><small>Дальше ›</small><b>${esc(next.t)}</b></a>`:''}</nav>
  </article>
  <aside class="toc" style="--c:${s.c}">${ctx.toc.length>1?`<div class="k">На странице</div>`+ctx.toc.map(t=>`<a href="#${p.id}" data-to="${t.id}">${esc(t.t.replace(/\*\*/g,''))}</a>`).join(''):''}</aside></div>`;
  $$('.toc a').forEach(a=>a.onclick=e=>{e.preventDefault();document.getElementById(a.dataset.to).scrollIntoView({behavior:'smooth'})});
  $$('.prose h2').forEach(h=>h.style.cursor='default');
  scramble($('.scramble'));spy();wireCatalogs();$$('[data-copy]').forEach(b=>b.onclick=()=>copy(b.dataset.copy));
}
function figOf(id){const a=(window.ART||{})[id];return a&&a.includes('/people/')?a:''}
function hub(sid){
  const s=SEC[sid];const ps=secPages(sid);
  if(ps.length===1){return page(ps[0])}
  const groups=[];ps.forEach(p=>{const g=p.grp||'';let G=groups.find(x=>x.g===g);if(!G){G={g,ps:[]};groups.push(G)}G.ps.push(p)});
  const art=(window.ART||{})[sid];
  app.innerHTML=`<div class="doc">${railHTML(sid,null)}
  <article class="article enter" style="--c:${s.c}">
    ${art?`<div class="ph-art${/crew/.test(art)?' cut':''}" style="background-image:url('${art}')"></div>`:''}
    <div class="crumbs"><a href="#home">Главная</a><i>/</i><span>${s.t}</span></div>
    <header class="ph"><div class="tag">${s.code}</div><h1 class="scramble">${s.t}</h1><p class="lead">${s.d}. Выбери страницу.</p></header>
    ${groups.map(G=>`${G.g?`<div class="hub-grp">${esc(G.g)}</div>`:''}<div class="hub-grid">${G.ps.map(p=>`<a class="card${figOf(p.id)?' fig-card':''}" href="#${p.id}">${figOf(p.id)?`<img src="${figOf(p.id)}" alt="" loading="lazy">`:''}${p.badge?`<span class="badge">${esc(p.badge)}</span>`:''}<h4>${esc(p.t)}</h4>${p.lead?`<p>${inl(p.lead)}</p>`:''}</a>`).join('')}</div>`).join('')}
  </article><aside class="toc"></aside></div>`;
  scramble($('.scramble'));
}

/* ---------- effects ---------- */
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function scramble(el){
  if(!el||reduce)return;const fin=el.textContent;const ch='▓▒░<>/\\_#$%АБВГДЕЖЗ0123456789';let f=0;const tot=18;
  const tick=()=>{f++;el.textContent=fin.split('').map((c,i)=>c===' '?' ':(i<fin.length*f/tot?c:ch[Math.random()*ch.length|0])).join('');if(f<tot)requestAnimationFrame(tick);else el.textContent=fin};tick();
}
function boot(){
  const el=$('#boot');if(!el)return;
  const lines=['> handshake chicago.metro.net ... <span class="ok">OK</span>','> NetWatch trace ... <span class="ok">чисто</span>','> добро пожаловать, чумба<span class="caret"></span>'];
  if(reduce){el.innerHTML=lines.join('<br>');return}
  let k=0;const step=()=>{if(!document.body.contains(el))return;el.innerHTML=lines.slice(0,k+1).join('<br>');k++;if(k<lines.length)setTimeout(step,420)};setTimeout(step,200);
}
let skyRAF=0;
function sky(){
  cancelAnimationFrame(skyRAF);
  const c=$('#sky');if(!c)return;const x=c.getContext('2d');
  let W,H,dpr,layers=[],drops=[],signs=[];
  function build(){
    dpr=Math.min(devicePixelRatio||1,2);W=c.clientWidth;H=c.clientHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);
    layers=[];signs=[];
    const conf=[{n:Math.ceil(W/38),h:[.25,.55],col:'#0b1020',win:.06,a:.5},{n:Math.ceil(W/55),h:[.3,.75],col:'#080b16',win:.1,a:.8},{n:Math.ceil(W/80),h:[.35,.95],col:'#05070f',win:.16,a:1}];
    let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
    conf.forEach((cf,li)=>{
      const off=document.createElement('canvas');off.width=W*dpr;off.height=H*dpr;const o=off.getContext('2d');o.setTransform(dpr,0,0,dpr,0,0);
      let px=-20;
      while(px<W){const w=30+rnd()*90*(li+1)*.6;const h=H*(cf.h[0]+rnd()*(cf.h[1]-cf.h[0]));
        // fade buildings on the left (text side) a bit
        o.fillStyle=cf.col;o.fillRect(px,H-h,w,h);
        if(rnd()<.3){o.fillRect(px+w*.4,H-h-20-rnd()*40,2,40)}
        for(let yy=H-h+10;yy<H-6;yy+=9)for(let xx=px+5;xx<px+w-5;xx+=7)if(rnd()<cf.win){o.fillStyle=rnd()<.7?'rgba(0,240,255,.55)':rnd()<.5?'rgba(255,42,109,.6)':'rgba(245,228,0,.5)';o.fillRect(xx,yy,3,4)}
        if(li===2&&rnd()<.35&&px>W*.35)signs.push({x:px+w*.2,y:H-h+20+rnd()*h*.4,w:Math.max(8,w*.15),h:30+rnd()*60,c:rnd()<.5?'#ff2a6d':'#00f0ff',ph:rnd()*6});
        px+=w+rnd()*6}
      layers.push({img:off,a:cf.a});
    });
    drops=Array.from({length:Math.round(W*H/9000)},()=>({x:Math.random()*W,y:Math.random()*H,l:8+Math.random()*16,s:6+Math.random()*8}));
  }
  function frame(t){
    x.clearRect(0,0,W,H);
    const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#05060b');g.addColorStop(.55,'#0b0d22');g.addColorStop(1,'#1a0a1e');x.fillStyle=g;x.fillRect(0,0,W,H);
    // glow on horizon
    const rg=x.createRadialGradient(W*.75,H,0,W*.75,H,H*.9);rg.addColorStop(0,'rgba(255,42,109,.25)');rg.addColorStop(1,'rgba(255,42,109,0)');x.fillStyle=rg;x.fillRect(0,0,W,H);
    layers.forEach(L=>{x.globalAlpha=L.a;x.drawImage(L.img,0,0,W,H)});x.globalAlpha=1;
    signs.forEach(s=>{const on=Math.sin(t/300+s.ph)>-.85||reduce;x.shadowBlur=on?18:0;x.shadowColor=s.c;x.fillStyle=on?s.c:'#222';x.globalAlpha=.85;x.fillRect(s.x,s.y,s.w,s.h);x.globalAlpha=1;x.shadowBlur=0});
    x.strokeStyle='rgba(160,200,255,.28)';x.lineWidth=1;x.beginPath();
    drops.forEach(d=>{x.moveTo(d.x,d.y);x.lineTo(d.x-2,d.y+d.l);if(!reduce){d.y+=d.s;d.x-=.6;if(d.y>H){d.y=-20;d.x=Math.random()*W}}});x.stroke();
    // fog
    const fg=x.createLinearGradient(0,H*.6,0,H);fg.addColorStop(0,'rgba(5,6,11,0)');fg.addColorStop(1,'rgba(5,6,11,.9)');x.fillStyle=fg;x.fillRect(0,H*.6,W,H*.4);
    if(!reduce&&document.body.contains(c))skyRAF=requestAnimationFrame(frame);
  }
  build();frame(0);
  window.onresize=()=>{if(document.body.contains(c)){build();if(reduce)frame(0)}};
}
function spy(){
  const hs=$$('.prose h2');const links=$$('.toc a');if(!hs.length)return;
  const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('on',a.dataset.to===e.target.id))}})},{rootMargin:'-20% 0px -70% 0px'});
  hs.forEach(h=>io.observe(h));
}
function copy(t){
  const done=()=>toast('Скопировано: '+(t.length>60?'данные':t));
  try{navigator.clipboard.writeText(t).then(done,()=>fallback())}catch(e){fallback()}
  function fallback(){const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');done()}catch(e){toast(t)}ta.remove()}
}
function toast(m){const d=document.createElement('div');d.className='toast';d.textContent=m;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}

/* ---------- search ---------- */
let IDX=null;
function plain(md){return md.replace(/^::.*$/gm,'').replace(/[*=`#>|]/g,' ').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/\s+/g,' ')}
function buildIdx(){IDX=PM.pages.map(p=>({p,t:p.t.toLowerCase(),x:(p.t+' '+(p.lead||'')+' '+plain(p.md||'')),xl:null}));IDX.forEach(r=>r.xl=r.x.toLowerCase())}
function openSearch(){
  if(!IDX)buildIdx();
  const w=document.createElement('div');w.className='pal';w.innerHTML=`<div class="pal-box" role="dialog" aria-label="Поиск"><div class="pal-in">${'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8.5" cy="8.5" r="6"/><path d="m13 13 5 5"/></svg>'}<input id="q" placeholder="Импланты, SIN, ограбление, Arasaka…" autocomplete="off"></div><div class="pal-res" id="res"></div></div>`;
  document.body.appendChild(w);const q=$('#q',w),res=$('#res',w);let sel=0,cur=[];
  const close=()=>w.remove();
  w.onclick=e=>{if(e.target===w)close()};
  function run(){
    const v=q.value.trim().toLowerCase();
    if(!v){cur=SECTIONS.map(s=>({p:{id:'sec-'+s.id,t:s.t,sec:s.id},snip:s.d}));}
    else{const words=v.split(/\s+/);cur=IDX.map(r=>{let sc=0;for(const w of words){if(r.t.includes(w))sc+=10;const c=r.xl.split(w).length-1;if(!c&&!r.t.includes(w))return null;sc+=Math.min(c,8)}return {r,sc}}).filter(Boolean).sort((a,b)=>b.sc-a.sc).slice(0,24).map(({r})=>{const k=r.xl.indexOf(words[0]);const a=Math.max(0,k-60);let sn=(a?'…':'')+r.x.slice(a,a+170)+'…';sn=esc(sn).replace(new RegExp(words[0].replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi'),m=>`<em>${m}</em>`);return {p:r.p,snip:sn,raw:1}})}
    sel=0;
    res.innerHTML=cur.length?cur.map((c,i)=>`<a href="#${c.p.id}" class="${i===0?'on':''}"><b>${esc(c.p.t)}<span class="sec">${SEC[c.p.sec]?SEC[c.p.sec].t:''}</span></b><small>${c.raw?c.snip:esc(c.snip)}</small></a>`).join(''):`<div class="pal-empty">Ничего не нашлось. Попробуй другое слово, например «импланты» или «плен».</div>`;
    $$('a',res).forEach(a=>a.onclick=close);
  }
  q.oninput=run;
  q.onkeydown=e=>{const as=$$('a',res);if(e.key==='Escape')close();else if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();sel=(sel+(e.key==='ArrowDown'?1:-1)+as.length)%as.length;as.forEach((a,i)=>a.classList.toggle('on',i===sel));as[sel]&&as[sel].scrollIntoView({block:'nearest'})}else if(e.key==='Enter'&&as[sel]){location.hash=as[sel].getAttribute('href');close()}};
  run();q.focus();
}
$('#openSearch').onclick=openSearch;
addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'||(e.key==='/'&&!/input|textarea/i.test(document.activeElement.tagName))){e.preventDefault();if(!$('.pal'))openSearch()}});

/* ---------- admin: data, overrides ---------- */
const DEF={ip:'145.239.130.3:7794',discord:'https://discord.gg/projectm',wargm:'https://wargm.ru/server/74770',boosty:''};
function S(){return Object.assign({},DEF,((window.ADMIN||{}).settings)||{})}
const ORIG={};PM.pages.forEach(p=>ORIG[p.id]={t:p.t,lead:p.lead,md:p.md});
function newsFromMd(md){const m=/::timeline\n([\s\S]*?)\n::/.exec(md||'');if(!m)return[];return m[1].split('\n').filter(l=>l.trim()).map(l=>{const k=l.indexOf(' | ');return {d:l.slice(0,k).trim(),t:l.slice(k+3).trim()}})}
function newsToMd(list){return '\n::timeline\n'+list.map(n=>`${(n.d||'').replace(/\|/g,'/')} | ${(n.t||'').replace(/\n+/g,' ')}`).join('\n')+'\n::\n'}
function applyAdmin(){
  const A=window.ADMIN||{};
  PM.pages.forEach(p=>Object.assign(p,ORIG[p.id]));
  Object.entries(A.pages||{}).forEach(([id,o])=>{const p=PM.byId[id];if(p&&o){if(o.t)p.t=o.t;if(o.lead!=null)p.lead=o.lead;if(o.md!=null)p.md=o.md}});
  if(Array.isArray(A.news)&&PM.byId.news)PM.byId.news.md=newsToMd(A.news);
  const s=S();const dc=$('#bar .dc');if(dc)dc.href=s.discord;
  IDX=null;renderAnn();
}
function renderAnn(){
  const el=$('#ann');if(!el)return;const a=(window.ADMIN||{}).announce||{};
  let closed='';try{closed=sessionStorage.getItem('pm-ann')||''}catch(e){}
  if(!a.on||!a.text||closed===a.text){el.hidden=true;el.innerHTML='';return}
  el.hidden=false;el.className='ann '+(a.kind||'info');
  el.innerHTML=`<div class="ann-in">${I[a.kind==='danger'?'danger':a.kind==='warn'?'warn':'info']||''}<p>${inl(a.text)}</p><button aria-label="Скрыть объявление">✕</button></div>`;
  $('button',el).onclick=()=>{try{sessionStorage.setItem('pm-ann',a.text)}catch(e){}el.hidden=true};
}

/* ---------- admin: cabinet ---------- */
let D=null,adminTab='ann',adminPage='news',adminDirty=false;
const unlocked=()=>{try{return sessionStorage.getItem('pm-admin')==='1'}catch(e){return window.__pmAdmin===1}};
async function sha(t){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('pm2077:'+t));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function clone(o){return JSON.parse(JSON.stringify(o))}
function loadDraft(){
  if(D)return;let saved=null;try{saved=JSON.parse(sessionStorage.getItem('pm-admin-draft')||'null')}catch(e){}
  D=saved||clone(window.ADMIN||{});D.settings=Object.assign({},DEF,D.settings||{});D.announce=Object.assign({on:false,kind:'info',text:''},D.announce||{});D.pages=D.pages||{};
  if(!Array.isArray(D.news))D.news=newsFromMd(ORIG.news?ORIG.news.md:'');
  adminDirty=!!saved;
}
function dirty(){adminDirty=true;try{sessionStorage.setItem('pm-admin-draft',JSON.stringify(D))}catch(e){}const st=$('#adm-state');if(st){st.textContent='Есть несохранённые изменения';st.className='adm-state warn'}}
function adminView(){
  if(!unlocked()){
    app.innerHTML=`<section class="wrap adm-login"><form class="adm-box" id="admLogin"><div class="tag">Доступ ограничен</div><h1>Кабинет администратора</h1><p>Введи пароль администратора.</p><input type="password" id="admPw" autocomplete="current-password" placeholder="Пароль" required><p class="adm-err" id="admErr" hidden>Неверный пароль.</p><button class="btn btn-p" type="submit">Войти</button></form></section>`;
    $('#admLogin').onsubmit=async e=>{e.preventDefault();let ok=false;try{ok=(await sha($('#admPw').value))===(window.ADMIN||{}).pass}catch(err){}
      if(ok){try{sessionStorage.setItem('pm-admin','1')}catch(err){window.__pmAdmin=1}adminView()}else{$('#admErr').hidden=false}};
    setTimeout(()=>$('#admPw')&&$('#admPw').focus(),50);return;
  }
  loadDraft();
  const tabs=[['ann','Объявление'],['news','Новости'],['pages','Тексты страниц'],['links','Адрес и ссылки'],['access','Доступ']];
  app.innerHTML=`<section class="wrap adm">
    <header class="adm-head"><div><div class="tag">Кабинет администратора</div><h1>Управление сайтом</h1></div>
      <div class="adm-actions"><span id="adm-state" class="adm-state ${adminDirty?'warn':''}">${adminDirty?'Есть несохранённые изменения':'Всё сохранено'}</span>
      <button class="btn btn-g" id="admReset" type="button">Отменить изменения</button><button class="btn btn-p" id="admSave" type="button">Сохранить на сайт</button></div></header>
    <p class="adm-msg" id="admMsg" hidden></p>
    <nav class="adm-tabs">${tabs.map(([k,t])=>`<button type="button" data-k="${k}" class="${k===adminTab?'on':''}">${t}</button>`).join('')}<button type="button" id="admOut" class="out">Выйти</button></nav>
    <div id="admBody"></div></section>`;
  $$('.adm-tabs [data-k]').forEach(b=>b.onclick=()=>{adminTab=b.dataset.k;$$('.adm-tabs [data-k]').forEach(x=>x.classList.toggle('on',x===b));tab()});
  $('#admOut').onclick=()=>{try{sessionStorage.removeItem('pm-admin')}catch(e){}window.__pmAdmin=0;location.hash='home'};
  $('#admSave').onclick=save;
  $('#admReset').onclick=()=>{try{sessionStorage.removeItem('pm-admin-draft')}catch(e){}D=null;adminDirty=false;adminView()};
  tab();
}
function msg(t,kind){const m=$('#admMsg');if(!m)return;m.hidden=!t;m.className='adm-msg '+(kind||'');m.textContent=t||''}
function field(lbl,html,hint){return `<label class="adm-f"><span>${lbl}</span>${html}${hint?`<small>${hint}</small>`:''}</label>`}
function tab(){
  const b=$('#admBody');
  if(adminTab==='ann'){const a=D.announce;
    b.innerHTML=`<div class="adm-card"><h2>Объявление на сайте</h2><p class="adm-note">Плашка показывается сверху на всех страницах. Посетитель может её скрыть до следующего визита.</p>
      <label class="adm-sw"><input type="checkbox" id="aOn" ${a.on?'checked':''}> Показывать объявление</label>
      ${field('Тип',`<select id="aKind"><option value="info"${a.kind==='info'?' selected':''}>Инфо (голубой)</option><option value="warn"${a.kind==='warn'?' selected':''}>Внимание (жёлтый)</option><option value="danger"${a.kind==='danger'?' selected':''}>Важно (красный)</option></select>`)}
      ${field('Текст',`<textarea id="aText" rows="3" placeholder="Например: 12 октября с 10:00 до 14:00 технические работы на сервере">${esc(a.text||'')}</textarea>`,'Можно **жирный** и ссылки [текст](#start-join).')}
      <div class="adm-prev-k">Как будет выглядеть</div><div id="aPrev"></div></div>`;
    const upd=()=>{a.on=$('#aOn').checked;a.kind=$('#aKind').value;a.text=$('#aText').value;$('#aPrev').innerHTML=a.text?`<div class="ann ${a.kind}"><div class="ann-in">${I[a.kind==='danger'?'danger':a.kind==='warn'?'warn':'info']}<p>${inl(a.text)}</p></div></div>`:'<p class="adm-note">Текст пустой.</p>'};
    ['aOn','aKind','aText'].forEach(id=>$('#'+id).oninput=$('#'+id).onchange=()=>{upd();dirty()});upd();
  }
  else if(adminTab==='news'){
    const today=new Date();const td=String(today.getDate()).padStart(2,'0')+'.'+String(today.getMonth()+1).padStart(2,'0')+'.'+today.getFullYear();
    b.innerHTML=`<div class="adm-card"><div class="adm-row"><h2>Новости</h2><button class="btn btn-p sm" id="nAdd" type="button">+ Добавить новость</button></div>
      <p class="adm-note">Самое новое сверху. В тексте можно **жирный** и ссылки на страницы сайта: [Правила](#rules-ic).</p>
      <div id="nList">${D.news.map((n,i)=>`<div class="adm-news" data-i="${i}"><input class="nd" value="${esc(n.d||'')}" aria-label="Дата"><textarea class="nt" rows="2" aria-label="Текст новости">${esc(n.t||'')}</textarea>
        <div class="nb"><button type="button" class="nu" title="Выше" ${i?'':'disabled'}>↑</button><button type="button" class="ndn" title="Ниже" ${i<D.news.length-1?'':'disabled'}>↓</button><button type="button" class="nx" title="Удалить">Удалить</button></div></div>`).join('')||'<p class="adm-note">Новостей пока нет.</p>'}</div></div>`;
    $('#nAdd').onclick=()=>{D.news.unshift({d:td,t:''});dirty();tab();setTimeout(()=>{const t=$('.adm-news .nt');t&&t.focus()},30)};
    $$('.adm-news').forEach(r=>{const i=+r.dataset.i;
      $('.nd',r).oninput=e=>{D.news[i].d=e.target.value;dirty()};
      $('.nt',r).oninput=e=>{D.news[i].t=e.target.value;dirty()};
      $('.nu',r).onclick=()=>{[D.news[i-1],D.news[i]]=[D.news[i],D.news[i-1]];dirty();tab()};
      $('.ndn',r).onclick=()=>{[D.news[i+1],D.news[i]]=[D.news[i],D.news[i+1]];dirty();tab()};
      const x=$('.nx',r);x.onclick=()=>{if(x.dataset.sure){D.news.splice(i,1);dirty();tab()}else{x.dataset.sure=1;x.textContent='Точно удалить?';x.classList.add('sure');setTimeout(()=>{if(x.isConnected){delete x.dataset.sure;x.textContent='Удалить';x.classList.remove('sure')}},3000)}};
    });
  }
  else if(adminTab==='pages'){
    const opts=SECTIONS.map(s=>`<optgroup label="${s.t}">${PM.pages.filter(p=>p.sec===s.id&&p.id!=='news').map(p=>`<option value="${p.id}"${p.id===adminPage?' selected':''}>${esc(ORIG[p.id].t)}${D.pages[p.id]?' •':''}</option>`).join('')}</optgroup>`).join('');
    if(adminPage==='news'||!PM.byId[adminPage])adminPage='start-join';
    const o=D.pages[adminPage]||{},src=ORIG[adminPage];
    const cur={t:o.t||src.t,lead:o.lead!=null?o.lead:(src.lead||''),md:o.md!=null?o.md:src.md};
    b.innerHTML=`<div class="adm-card"><div class="adm-row"><h2>Тексты страниц</h2><a class="adm-open" href="#${adminPage}" target="_self">Открыть страницу ›</a></div>
      ${field('Страница',`<select id="pSel">${opts}</select>`,'Точкой • отмечены страницы, которые уже менялись. Новости правятся во вкладке «Новости».')}
      ${field('Заголовок',`<input id="pT" value="${esc(cur.t)}">`)}
      ${field('Подзаголовок',`<textarea id="pL" rows="2">${esc(cur.lead)}</textarea>`)}
      <div class="adm-split"><label class="adm-f"><span>Текст страницы</span><textarea id="pM" class="mono" spellcheck="false">${esc(cur.md.replace(/^\n/,''))}</textarea></label>
        <div class="adm-f"><span>Предпросмотр</span><div class="adm-prev prose" id="pPrev"></div></div></div>
      <div class="adm-row"><details class="adm-help"><summary>Шпаргалка по разметке</summary><div>
        <p><code>## Заголовок</code> — раздел с номером; <code>### Подзаголовок</code>; <code>- пункт</code> — список; <code>1. шаг</code> — нумерованный; <code>&gt; цитата</code></p>
        <p><code>**жирный**</code>, <code>==выделение==</code>, <code>[текст](#id-страницы)</code> или <code>[текст](https://…)</code></p>
        <p>Блоки начинаются с <code>::тип</code> и заканчиваются строкой <code>::</code>. Колонки разделяются <code> | </code>:</p>
        <p><code>::tldr</code> коротко · <code>::cards 3</code> Заголовок | текст | метка · <code>::table</code> первая строка — шапка · <code>::steps</code> шаги · <code>::terms</code> Термин | пояснение · <code>::facts</code> · <code>::timeline</code> Дата | событие · <code>::info</code>, <code>::warn</code>, <code>::danger Заголовок</code> — плашки · <code>::more Заголовок</code> — раскрывашка · <code>::chips</code> через запятую · <code>::links</code> Текст | ссылка · <code>::price</code> # Название | Цена | hot · <code>::items weapons</code> — каталог</p>
      </div></details><button class="btn btn-g sm" id="pRev" type="button" ${D.pages[adminPage]?'':'disabled'}>Вернуть оригинал</button></div></div>`;
    $('#pSel').onchange=e=>{adminPage=e.target.value;tab()};
    let tm=0;const prev=()=>{try{$('#pPrev').innerHTML=render($('#pM').value,{toc:[]});wireCatalogs()}catch(e){$('#pPrev').textContent='Ошибка разметки: '+e.message}};
    const upd=()=>{const t=$('#pT').value,l=$('#pL').value,m='\n'+$('#pM').value.replace(/^\n/,'')+(/\n$/.test($('#pM').value)?'':'\n');
      if(t===src.t&&l===(src.lead||'')&&m===src.md)delete D.pages[adminPage];else D.pages[adminPage]={t,lead:l,md:m};
      $('#pRev').disabled=!D.pages[adminPage];dirty();clearTimeout(tm);tm=setTimeout(prev,250)};
    ['pT','pL','pM'].forEach(id=>$('#'+id).oninput=upd);
    $('#pRev').onclick=()=>{delete D.pages[adminPage];dirty();tab()};
    prev();
  }
  else if(adminTab==='links'){const s=D.settings;
    b.innerHTML=`<div class="adm-card"><h2>Адрес сервера и ссылки</h2><p class="adm-note">Меняются сразу по всему сайту: главный экран, «Вход в игру», шапка и подвал.</p>
      ${field('Адрес сервера (IP:порт)',`<input id="sIp" value="${esc(s.ip)}" class="mono">`)}
      ${field('Discord',`<input id="sDc" value="${esc(s.discord)}" placeholder="https://discord.gg/…">`)}
      ${field('WARGM',`<input id="sWg" value="${esc(s.wargm)}" placeholder="https://wargm.ru/server/…">`)}
      ${field('Boosty',`<input id="sBo" value="${esc(s.boosty)}" placeholder="https://boosty.to/…">`,'Если заполнено, на странице «Донат» появится кнопка «Поддержать на Boosty».')}</div>`;
    [['sIp','ip'],['sDc','discord'],['sWg','wargm'],['sBo','boosty']].forEach(([id,k])=>$('#'+id).oninput=e=>{s[k]=e.target.value.trim();dirty()});
  }
  else if(adminTab==='access'){
    b.innerHTML=`<div class="adm-card"><h2>Доступ</h2>
      <p class="adm-note">Пароль только открывает этот кабинет. Сохранять изменения на сайт могут лишь те, кому владелец дал права редактора через меню Share. Остальные увидят ошибку при сохранении.</p>
      <form id="pwForm">${field('Новый пароль',`<input type="password" id="pw1" autocomplete="new-password" minlength="6" required>`)}${field('Повтори пароль',`<input type="password" id="pw2" autocomplete="new-password" minlength="6" required>`)}
      <p class="adm-err" id="pwErr" hidden></p><button class="btn btn-g sm" type="submit">Сменить пароль</button></form>
      <p class="adm-note">Новый пароль начнёт действовать после «Сохранить на сайт».</p></div>`;
    $('#pwForm').onsubmit=async e=>{e.preventDefault();const a=$('#pw1').value,c=$('#pw2').value,er=$('#pwErr');
      if(a!==c){er.hidden=false;er.textContent='Пароли не совпадают.';return}
      D.pass=await sha(a);dirty();er.hidden=true;$('#pwForm').reset();msg('Пароль изменён в черновике. Нажми «Сохранить на сайт».','ok')};
  }
}
async function save(){
  const btn=$('#admSave');btn.disabled=true;msg('Сохраняю…');
  let art=null;try{art=window.claude&&window.claude.use?await window.claude.use('artifact'):null}catch(e){}
  if(!art){btn.disabled=false;const txt='window.ADMIN='+JSON.stringify(D)+';\n';
    msg('На этом хостинге сайт не может сохранить себя сам. Нажми «Скопировать данные», открой на GitHub файл content/admin-data.js, нажми карандаш «Edit», замени всё содержимое и нажми «Commit changes». Через 1–2 минуты изменения появятся на сайте.','warn');
    const m=$('#admMsg');const b2=document.createElement('button');b2.type='button';b2.className='btn btn-p sm';b2.style.marginTop='10px';b2.textContent='Скопировать данные';b2.onclick=()=>copy(txt);m.appendChild(document.createElement('br'));m.appendChild(b2);return}
  const data=clone(D);
  try{
    await art.publish({'content/admin-data.js':{content:'window.ADMIN='+JSON.stringify(data)+';\n',contentType:'text/javascript'}});
    window.ADMIN=data;applyAdmin();adminDirty=false;try{sessionStorage.removeItem('pm-admin-draft')}catch(e){}
    const st=$('#adm-state');if(st){st.textContent='Всё сохранено';st.className='adm-state'}msg('Сохранено. Изменения уже на сайте у всех посетителей.','ok');
  }catch(e){
    const c=e&&e.code;
    if(c==='conflict')msg('Кто-то сохранил сайт раньше тебя. Страница обновится, черновик останется.','warn');
    else if(c==='not_writer'||c==='not_granted'||c==='consent_required')msg('У этого аккаунта нет прав редактора сайта. Попроси владельца выдать доступ через меню Share.','err');
    else if(c==='capability_disabled'||c==='capability_removed')msg('Отсюда сохранить нельзя (например, сайт открыт по публичной ссылке). Открой его в Claude под аккаунтом редактора.','err');
    else if(c==='rate_limited')msg('Слишком частые сохранения. Подожди минуту и попробуй снова.','warn');
    else msg('Не удалось сохранить: '+((e&&e.message)||'ошибка сервиса')+'. Попробуй ещё раз через минуту.','err');
  }
  btn.disabled=false;
}

/* ---------- router ---------- */
function route(){
  cancelAnimationFrame(skyRAF);
  document.body.classList.remove('rail-open');
  const h=decodeURIComponent(location.hash.slice(1))||'home';
  let sid=null;
  if(h==='home'){home()}
  else if(h==='admin'){adminView()}
  else if(h.startsWith('sec-')&&SEC[h.slice(4)]){sid=h.slice(4);hub(sid)}
  else if(PM.byId[h]){sid=PM.byId[h].sec;page(PM.byId[h])}
  else {home()}
  $$('#topnav a').forEach(a=>a.classList.toggle('on',a.dataset.s===sid));
  $('#burger').classList.toggle('off',!sid);
  window.scrollTo(0,0);
  const w=$('#wipe');w.classList.remove('go');void w.offsetWidth;if(!reduce)w.classList.add('go');
  document.title=sid?((PM.byId[h]?PM.byId[h].t:SEC[sid].t)+' — Project Matrix 2077'):'Project Matrix 2077';
}
addEventListener('hashchange',route);
$('#burger').onclick=()=>document.body.classList.toggle('rail-open');
addEventListener('scroll',()=>{const d=document.documentElement;const p=d.scrollTop/(d.scrollHeight-d.clientHeight||1);$('#progress').style.width=(p*100).toFixed(1)+'%'},{passive:true});
applyAdmin();
route();
})();
