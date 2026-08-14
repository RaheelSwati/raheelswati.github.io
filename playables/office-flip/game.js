const cleanables=[...document.querySelectorAll('[data-clean]')];
const catalog=document.querySelector('#catalog');
const progress=document.querySelector('#progress');
const maya=document.querySelector('#maya');
const title=document.querySelector('#mayaTitle');
const line=document.querySelector('#mayaLine');
const placed=document.querySelector('#placed');
const finish=document.querySelector('#finish');
const tip=document.querySelector('#tip');
const download=document.querySelector('#download');
let cleaned=0, furnished=0;

const stores={
  amazon:{url:'https://www.amazon.com/gp/product/B0HCVCDTNX',label:'GET IT ON AMAZON APPSTORE'},
  google:{url:'https://play.google.com/store/apps/details?id=com.extrude.studio.office.flip',label:'GET IT ON GOOGLE PLAY'},
  ios:{url:'https://apps.apple.com/app/id6797204686',label:'DOWNLOAD ON THE APP STORE'}
};
function currentStore(){
  const requested=new URLSearchParams(location.search).get('store');
  if(requested==='amazon')return 'amazon';
  if(requested==='ios'||requested==='apple')return 'ios';
  if(requested==='google'||requested==='android'||requested==='play')return 'google';
  const ua=navigator.userAgent;
  if(/Silk|Kindle|KF[A-Z]/i.test(ua))return 'amazon';
  if(/iPhone|iPad|iPod/i.test(ua))return 'ios';
  return 'google';
}
const storeKey=currentStore(), store=stores[storeKey];
download.href=store.url; download.textContent=store.label;
download.addEventListener('click',event=>{if(window.mraid&&typeof window.mraid.open==='function'){event.preventDefault();window.mraid.open(store.url);}});

function react(kind,heading,copy){
  maya.src=`assets/maya-${kind}.png`;
  title.textContent=heading; line.textContent=copy;
  maya.classList.remove('pop'); requestAnimationFrame(()=>maya.classList.add('pop'));
}
function update(){
  progress.textContent=`${cleaned+furnished} / 6`;
  if(cleaned===3){
    catalog.hidden=false;
    document.querySelector('#stepTitle').textContent='2 · FURNISH';
    document.querySelector('#stepCopy').textContent='Choose what enters the room';
    tip.textContent='Choose each real game object, then drag it anywhere on the office floor.';
  }
  if(furnished===3){finish.hidden=false;tip.textContent='Drag the desk, chair, and lamp to refine the layout, then show Maya.'}
}
function enableDrag(img){
  img.draggable=false; let active=false,offsetX=0,offsetY=0;
  const begin=(x,y)=>{const rect=img.getBoundingClientRect();offsetX=x-rect.left;offsetY=y-rect.top;active=true;img.classList.add('dragging');};
  const move=(x,y)=>{if(!active)return;const area=placed.getBoundingClientRect(),width=img.offsetWidth,height=img.offsetHeight;const nx=Math.max(area.width*.08,Math.min(area.width-width-area.width*.08,x-area.left-offsetX));const ny=Math.max(area.height*.27,Math.min(area.height-height-area.height*.06,y-area.top-offsetY));img.style.left=`${nx}px`;img.style.top=`${ny}px`;};
  const stop=()=>{active=false;img.classList.remove('dragging');};
  img.addEventListener('pointerdown',event=>{event.preventDefault();begin(event.clientX,event.clientY);});
  document.addEventListener('pointermove',event=>{if(active){event.preventDefault();move(event.clientX,event.clientY);}},{passive:false});
  document.addEventListener('pointerup',stop);document.addEventListener('pointercancel',stop);
  img.addEventListener('touchstart',event=>{event.preventDefault();const p=event.touches[0];begin(p.clientX,p.clientY);},{passive:false});
  document.addEventListener('touchmove',event=>{if(active){event.preventDefault();const p=event.touches[0];move(p.clientX,p.clientY);}},{passive:false});
  document.addEventListener('touchend',stop);
}
cleanables.forEach(el=>el.addEventListener('click',()=>{
  if(el.classList.contains('gone'))return;
  el.classList.add('gone'); cleaned++;
  if(cleaned===1) react('neutral','THAT HELPS','One less thing between me and a fresh start.');
  if(cleaned===2) react('concerned','ONE MARK LEFT','There is still one hidden mess on the floor — can you spot it?');
  if(cleaned===3) react('happy','ROOM TO BREATHE','Now I can imagine what this place could become!');
  update();
}));
document.querySelectorAll('.item').forEach(btn=>btn.addEventListener('click',()=>{
  if(cleaned<3){react('concerned','NOT QUITE YET','Let’s clear the floor first so nothing gets buried.');return}
  if(btn.disabled)return;
  const kind=btn.dataset.item;
  const img=document.createElement('img'); img.src=kind==='lamp'?'assets/lamp1.png':`assets/${kind}.png`; img.className=kind; img.alt=kind; placed.appendChild(img); enableDrag(img);
  btn.disabled=true; furnished++;
  const messages={desk:['A PLACE TO CREATE','The desk faces the light — that feels right.'],chair:['A GOOD FIT','I can already picture myself working here.'],lamp:['A WARMER ROOM','That light makes late creative work feel welcoming.']};
  react(furnished===3?'happy':'neutral',...messages[kind]); update();
}));
finish.addEventListener('click',()=>{document.querySelector('#complete').hidden=false;window.parent.postMessage({type:'officeFlipPlayableComplete',store:storeKey,url:store.url},'*');if(typeof window.OfficeFlipPlayableCompleted==='function')window.OfficeFlipPlayableCompleted({store:storeKey,url:store.url});});
document.querySelector('#replay').addEventListener('click',()=>location.reload());
window.OfficeFlipPlayable={start(){document.body.classList.add('playable-started');},getStore(){return storeKey;}};
window.parent.postMessage({type:'officeFlipPlayableReady',store:storeKey},'*');
update();
