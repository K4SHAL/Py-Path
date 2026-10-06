const K='pypath1',$=s=>document.querySelector(s),fmt=d=>d.toLocaleDateString('en-CA'),today=()=>fmt(new Date()),HT="Hold to commit";
let S={};try{S=JSON.parse(localStorage.getItem(K)||'{}')}catch(e){}
['d','q','t','m','c'].forEach(k=>S[k]=S[k]||{});
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}};
let n=0;const L=STAGES.flatMap(s=>s.l.map(l=>({...l,s:s.n,id:n++})));
let cur=(L.find(l=>!S.d[l.id])||L[0]).id,run=false,tick,hs=0,raf=0;
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'),pad=i=>String(i+1).padStart(2,'0');
const md=s=>esc(s).split('~~~').map((p,i)=>i%2?`<pre>${p.trim()}</pre>`:p.split('\n\n').map(x=>`<p>${x.replace(/`([^`]+)`/g,'<code>$1</code>')}</p>`).join('')).join('');
const xp=()=>Object.keys(S.d).length*50+Object.keys(S.q).length*10+Object.keys(S.t).length*5;
function streak(){let c=0,d=new Date();if((S.m[fmt(d)]||0)<1200)d.setDate(d.getDate()-1);while((S.m[fmt(d)]||0)>=1200){c++;d.setDate(d.getDate()-1)}return c}
function head(){const x=xp();$('#hi').textContent=S.name?'Hi, '+S.name:'';$('#streak').textContent=streak()+'-day streak';$('#lvl').textContent='Level '+(1+Math.floor(x/150))+', '+x+' XP';$('#th').textContent=document.documentElement.dataset.theme=='dark'?'Light mode':'Dark mode'}
function clock(){const s=S.m[today()]||0,m=Math.floor(s/60);$('#fill').style.width=Math.min(100,s/72)+'%';$('#time').textContent=Math.floor(m/60)+'h '+String(m%60).padStart(2,'0')+'m';$('#go').textContent=!S.c[today()]?'Commit to start':run?'Pause session':s>0?'Resume session':'Start session'}
function nav(){$('#nav').innerHTML=STAGES.map(s=>`<h4>${esc(s.n)}</h4>`+L.filter(l=>l.s==s.n).map(l=>`<a data-id="${l.id}" class="${l.id==cur?'on':''} ${S.d[l.id]?'ok':''}"><i>${pad(l.id)}</i>${esc(l.t)}</a>`).join('')).join('')}
function view(){const l=L[cur],x=EX[l.t]||(l.c?l:null),dn=!!S.d[cur],last=cur==L.length-1,v=$('#view');
v.innerHTML=`<div class="num" aria-hidden="true">${pad(cur)}</div><h1>${esc(l.t)}</h1><p class="meta">Sheet ${cur+1} of ${L.length}. ${esc(l.s)}.</p><h3>Read</h3>${x?`<p class="say">${esc(x.s)}</p><h3>Line by line</h3>${x.c.map(([a,b])=>`<div class="ln"><pre>${esc(a)}</pre><p>${esc(b)}</p></div>`).join('')}`:md(l.r)}<p class="ref">Go deeper: ${esc(l.ref)}</p><h3>Try it in your terminal</h3>${l.k.map((t,i)=>`<label class="task"><input type="checkbox" data-k="${cur}:${i}" ${S.t[cur+':'+i]?'checked':''}><span>${esc(t)}</span></label>`).join('')}${x&&x.h?`<details class="how"><summary>Stuck? Show me exactly how</summary>${md(x.h)}</details>`:''}<h3>Check yourself</h3><p><b>${esc(l.q[0])}</b></p>${l.q[1].map((o,i)=>`<button class="opt" data-i="${i}">${esc(o)}</button>`).join('')}<button id="fin" class="big">${dn?(last?'Course complete':'Done. Next lesson'):'Complete lesson (+50 XP)'}</button>`;}
function gate(){const ok=!!S.ok,lk=ok&&!S.c[today()];$('#ob').hidden=ok;$('#lock').hidden=!lk;document.querySelectorAll('main,header,footer').forEach(e=>e.inert=!ok||lk);
if(!ok){const nm=$('#nm'),ag=$('#ag'),st=$('#start'),chk=()=>{st.disabled=!(nm.value.trim()&&ag.checked)};nm.oninput=ag.onchange=chk;nm.onkeydown=e=>{if(e.key=='Enter'&&!st.disabled)st.click()};nm.focus()}
else if(lk){$('#lt').textContent='Ready, '+S.name+'?';$('#hold').focus()}}
function startTimer(){run=true;clearInterval(tick);tick=setInterval(()=>{const d=today();if(!S.c[d]){pause();gate();render();return}S.m[d]=(S.m[d]||0)+1;if(S.m[d]%15==0){save();head()}clock()},1000)}
function pause(){run=false;clearInterval(tick);save()}
function holdStart(){if(hs)return;hs=performance.now();const b=$('#hold');(function f(){if(!hs||!b.isConnected)return;const p=Math.min(1,(performance.now()-hs)/1200);b.style.setProperty('--p',p);b.firstChild.textContent=p<1?'Keep holding… '+Math.round(p*100)+'%':'Committed';if(p>=1){hs=0;S.c[today()]=1;save();startTimer();gate();render();scrollTo(0,0)}else raf=requestAnimationFrame(f)})()}
function holdEnd(){if(!hs)return;cancelAnimationFrame(raf);hs=0;const b=$('#hold');if(b){b.style.setProperty('--p',0);b.firstChild.textContent=HT}}
const render=()=>{head();nav();view();clock()};
document.addEventListener('click',e=>{const t=e.target;
if(t.dataset.id!=null&&t.closest('#nav')){cur=+t.dataset.id;render();scrollTo(0,0)}
else if(t.id=='start'){S.name=$('#nm').value.trim().slice(0,30);S.ok=new Date().toISOString();save();gate();render()}
else if(t.classList.contains('opt')){if(+t.dataset.i==L[cur].q[2]){t.classList.add('right');S.q[cur]=1}else t.classList.add('wrong');save();head()}
else if(t.id=='fin'){S.d[cur]=1;save();if(cur<L.length-1)cur++;render();scrollTo(0,0)}
else if(t.id=='go'){if(!S.c[today()]){gate();return}run?pause():startTimer();clock()}
else if(t.id=='th'){S.th=document.documentElement.dataset.theme=='dark'?'light':'dark';document.documentElement.dataset.theme=S.th;save();head()}
else if(t.id=='rs'&&confirm('Reset all progress, including your name and agreement?')){localStorage.removeItem(K);location.reload()}});
document.addEventListener('change',e=>{const k=e.target.dataset.k;if(k){e.target.checked?S.t[k]=1:delete S.t[k];save();head()}});
addEventListener('beforeunload',save);
document.addEventListener('pointerdown',e=>{if(e.target.closest('#hold')){e.preventDefault();holdStart()}});
['pointerup','pointercancel'].forEach(n=>document.addEventListener(n,holdEnd));
document.addEventListener('contextmenu',e=>{if(e.target.closest('#hold'))e.preventDefault()});
document.addEventListener('keydown',e=>{if(e.target.id=='hold'&&(e.key==' '||e.key=='Enter')&&!e.repeat){e.preventDefault();holdStart()}});
document.addEventListener('keyup',e=>{if(e.target.id=='hold')holdEnd()});
if(S.c[today()])startTimer();render();gate();
