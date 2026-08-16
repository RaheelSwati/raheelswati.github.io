const stores={
  google:{url:'https://play.google.com/store/apps/details?id=com.extrude.studio.office.flip',label:'GET IT ON GOOGLE PLAY'},
  amazon:{url:'https://www.amazon.com/gp/product/B0HCVCDTNX',label:'GET IT ON AMAZON'},
  ios:{url:'https://apps.apple.com/app/id6797204686',label:'GET IT ON THE APP STORE'}
};
const query=new URLSearchParams(location.search);
function storeKey(){const requested=query.get('store');if(stores[requested])return requested;const ua=navigator.userAgent;if(/Silk|Kindle|KF[A-Z]/i.test(ua))return'amazon';if(/iPhone|iPad|iPod/i.test(ua))return'ios';return'google'}
function orientation(){const ratio=innerWidth/innerHeight;if(ratio<.82)return'portrait';if(ratio<1.22)return'square';return'landscape'}
const key=storeKey(),store=stores[key],format=orientation();
const scene=document.querySelector('#scene'),decision=document.querySelector('#decision'),complete=document.querySelector('#complete'),positionChoices=document.querySelector('#positionChoices'),rotationChoices=document.querySelector('#rotationChoices'),question=document.querySelector('#question'),hint=document.querySelector('#hint'),stepCount=document.querySelector('#stepCount'),flash=document.querySelector('#flash');
const paths={idle:'idle.mp4',correct:'correct.mp4',wrong:'wrong.mp4',rotate:'rotate.mp4',success:'success.mp4',retry:'retry.mp4'};
for(const id of['download','finalDownload']){const link=document.querySelector(`#${id}`);link.href=store.url;link.textContent=store.label;link.addEventListener('click',openStore)}
window.clickTag=store.url;
function openStore(event){if(typeof window.openAppStore==='function'){event.preventDefault();window.openAppStore();return}if(window.mraid&&typeof window.mraid.open==='function'){event.preventDefault();window.mraid.open(store.url)}}
function src(name){return`videos/${format}/${paths[name]}`}
function notify(message){flash.textContent=message;flash.classList.add('show');setTimeout(()=>flash.classList.remove('show'),1500)}
function play(name,onEnd){document.body.classList.add('playing');scene.loop=false;scene.muted=false;scene.src=src(name);scene.currentTime=0;scene.onended=()=>{scene.onended=null;document.body.classList.remove('playing');onEnd?.()};const attempt=scene.play();if(attempt)attempt.catch(()=>{scene.muted=true;scene.play()})}
function showIdle(){scene.src=src('idle');scene.loop=true;scene.muted=true;scene.play().catch(()=>{});decision.hidden=false;complete.hidden=true}
function wrong(){play('wrong',()=>play('retry',()=>{notify('Try a clearer, usable position');showPosition()}))}
function showPosition(){positionChoices.hidden=false;rotationChoices.hidden=true;stepCount.textContent='1 / 2';question.textContent='Where should the chair go?';hint.textContent='Make the workstation comfortable and usable.';decision.hidden=false}
function correct(){play('correct',()=>{stepCount.textContent='2 / 2';question.textContent='Which way should the chair face?';hint.textContent='A usable chair should face the work surface.';positionChoices.hidden=true;rotationChoices.hidden=false;decision.hidden=false;notify('Great position — now set the angle')})}
function wrongAngle(){play('wrong',()=>{notify('Maya cannot reach the desk that way');decision.hidden=false})}
function rotate(){play('rotate',()=>play('success',()=>{decision.hidden=true;complete.hidden=false;window.parent.postMessage({type:'officeFlipPlayableComplete',store:key,url:store.url},'*');if(typeof window.OfficeFlipPlayableCompleted==='function')window.OfficeFlipPlayableCompleted({store:key,url:store.url})}))}
document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>({wrong,correct,'wrong-angle':wrongAngle,rotate}[button.dataset.action])()));
document.querySelector('#replay').addEventListener('click',()=>{showPosition();showIdle()});
addEventListener('resize',()=>{if(orientation()!==format)location.reload()});
window.OfficeFlipPlayable={getStore:()=>key,getFormat:()=>format};
window.parent.postMessage({type:'officeFlipPlayableReady',store:key,format},'*');
showPosition();showIdle();
