import {nodes,edges,destinations} from './world.js';
import {MovementController} from './movement.js';
const canvas=document.querySelector('#gameCanvas'),ctx=canvas.getContext('2d');
const title=document.querySelector('#sceneTitle'),status=document.querySelector('#status'),interior=document.querySelector('#interior');
const wallet=document.querySelector('#wallet'),clock=document.querySelector('#clock'),mapHint=document.querySelector('#mapHint');
const saveKey='theDailyGrind.save.v1';
let activeScene='map',lastTime=0,walkCycle=0,keys={},playerFacing=1,gameTime=0;
const saved=loadSave();
const movement=new MovementController(id=>enterLocation(id));
if(saved?.position){movement.position=saved.position;}
if(saved?.wallet!==undefined)wallet.textContent=saved.wallet.toLocaleString('en-PH');
function loadSave(){try{return JSON.parse(localStorage.getItem(saveKey)||'null')}catch{return null}}
function save(){localStorage.setItem(saveKey,JSON.stringify({version:1,position:movement.position,wallet:Number(wallet.textContent.replace(/,/g,'')),gameTime,activeScene:'map'}));document.querySelector('#saveState').textContent='✓ Progress saved';}
function resize(){const r=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
new ResizeObserver(resize).observe(canvas);resize();
function xy(p){const w=canvas.clientWidth,h=canvas.clientHeight;return{x:p.x*w,y:p.y*h};}
function drawIsoBuilding(x,y,w,h,front,roof,label,emoji){ctx.save();ctx.translate(x,y);ctx.fillStyle='#0003';ctx.beginPath();ctx.ellipse(0,h*.42,w*.78,h*.22,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle=front;ctx.beginPath();ctx.moveTo(-w/2,-h*.05);ctx.lineTo(0,h*.18);ctx.lineTo(w/2,-h*.05);ctx.lineTo(0,-h*.29);ctx.closePath();ctx.fill();
 ctx.fillStyle=roof;ctx.beginPath();ctx.moveTo(-w/2,-h*.05);ctx.lineTo(0,-h*.52);ctx.lineTo(w/2,-h*.05);ctx.lineTo(0,h*.18);ctx.closePath();ctx.fill();
 ctx.fillStyle='#fff1d0';ctx.font=`bold ${Math.max(10,w*.12)}px system-ui`;ctx.textAlign='center';ctx.fillText(emoji,0,-h*.12);
 ctx.fillStyle='#183b33';ctx.font=`bold ${Math.max(9,w*.085)}px system-ui`;ctx.fillText(label,0,h*.62);ctx.restore();}
function drawTree(x,y,s=1){ctx.fillStyle='#76543b';ctx.fillRect(x-3*s,y-2*s,6*s,25*s);ctx.fillStyle='#39744d';for(const [dx,dy,r] of [[0,-18,17],[12,-8,13],[-12,-7,13],[0,-2,12]]){ctx.beginPath();ctx.arc(x+dx*s,y+dy*s,r*s,0,Math.PI*2);ctx.fill();}}
function drawRoad(){const w=canvas.clientWidth,h=canvas.clientHeight;ctx.fillStyle='#a9c78d';ctx.fillRect(0,0,w,h);
 // grass texture patches
 for(let i=0;i<70;i++){const x=(i*97%997)/997*w,y=(i*173%991)/991*h;ctx.fillStyle=i%2?'#8fb77d':'#b8d19a';ctx.globalAlpha=.35;ctx.fillRect(x,y,18,9);}ctx.globalAlpha=1;
 ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#d8c49b';ctx.lineWidth=Math.max(35,w*.055);ctx.beginPath();for(let i=0;i<edges.length;i++){const [a,b]=edges[i],p=xy(nodes[a]),q=xy(nodes[b]);ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);}ctx.stroke();
 ctx.strokeStyle='#f0dfbd';ctx.lineWidth=2;ctx.setLineDash([9,12]);ctx.beginPath();for(const [a,b] of edges){const p=xy(nodes[a]),q=xy(nodes[b]);ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);}ctx.stroke();ctx.setLineDash([]);
}
function drawMap(){drawRoad();const w=canvas.clientWidth,h=canvas.clientHeight;
 // Decorative lots/buildings are kept clear of the waypoint roads.
 drawIsoBuilding(w*.17,h*.17,w*.20,h*.20,'#c96e49','#e7a65c','ALING NENA','🏪');
 drawIsoBuilding(w*.83,h*.17,w*.20,h*.20,'#d18a54','#f0c16f','KUYA JUN','🍲');
 drawIsoBuilding(w*.81,h*.82,w*.19,h*.20,'#719b69','#9fc17c','PLAZA','🌳');
 drawIsoBuilding(w*.94,h*.46,w*.17,h*.23,'#6d879c','#a8c4cc','SKYLINE','🏢');
 drawTree(w*.38,h*.22,.8);drawTree(w*.59,h*.61,.9);drawTree(w*.31,h*.72,.8);drawTree(w*.88,h*.65,.75);
 // destination markers
 for(const [id,d] of Object.entries(destinations)){const p=xy(nodes[d.door]);ctx.beginPath();ctx.fillStyle='#f6d17e';ctx.arc(p.x,p.y,11,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff6d5';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#253e32';ctx.font='bold 12px system-ui';ctx.textAlign='center';ctx.fillText('!',p.x,p.y+4);}
 drawPlayer();
}
function drawPlayer(){const p=xy(movement.position),moving=movement.moving;walkCycle+=moving?.22:0;const bob=moving?Math.sin(walkCycle)*2:0;
 ctx.save();ctx.translate(p.x,p.y+bob);ctx.fillStyle='#0004';ctx.beginPath();ctx.ellipse(0,8,10,5,0,0,Math.PI*2);ctx.fill();
 // simple readable character placeholder
 ctx.fillStyle='#f0c49b';ctx.beginPath();ctx.arc(0,-17,7,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#293f37';ctx.beginPath();ctx.arc(0,-19,7,Math.PI,Math.PI*2);ctx.fill();
 ctx.fillStyle='#e8b45f';ctx.fillRect(-7,-10,14,17);
 ctx.strokeStyle='#263d35';ctx.lineWidth=3;ctx.lineCap='round';const swing=moving?Math.sin(walkCycle)*5:0;
 ctx.beginPath();ctx.moveTo(-4,6);ctx.lineTo(-5+swing,13);ctx.moveTo(4,6);ctx.lineTo(5-swing,13);ctx.stroke();
 ctx.restore();}
function frame(t){const dt=Math.min((t-lastTime)/1000||0,.05);lastTime=t;if(activeScene==='map'){movement.update(dt);drawMap();if(!movement.moving&&movement.destination===null){} }requestAnimationFrame(frame);}
requestAnimationFrame(frame);
function enterLocation(id){const d=destinations[id];activeScene=id;canvas.classList.add('hidden');interior.classList.remove('hidden');title.textContent=d.short;document.querySelector('#interiorName').textContent=d.name;document.querySelector('#interiorDesc').textContent=d.desc;document.querySelector('#interiorArt').querySelector('.scene-emoji').textContent=d.emoji;status.textContent='You arrived at '+d.short+'.';mapHint.classList.add('hidden');save();}
function exitLocation(){if(activeScene==='map')return;const id=activeScene;activeScene='map';interior.classList.add('hidden');canvas.classList.remove('hidden');mapHint.classList.remove('hidden');movement.restoreAt(destinations[id].returnNode);title.textContent='Barangay San Isidro';status.textContent='You are back outside. Choose your next destination.';save();drawMap();}
function choose(id){if(activeScene!=='map'||movement.locked)return;const ok=movement.travelTo(id);if(ok){status.textContent='Walking to '+destinations[id].short+'…';mapHint.textContent='On the way — destination selection is locked';} }
document.querySelectorAll('[data-destination]').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.destination)));
document.querySelector('#exitButton').addEventListener('click',exitLocation);
function interact(){if(activeScene!=='map'||movement.locked)return;const p=movement.position;for(const [id,d] of Object.entries(destinations)){const q=nodes[d.door];if(Math.hypot(p.x-q.x,p.y-q.y)<.025){enterLocation(id);break;}}}
window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();if(e.key==='Escape'){exitLocation();return;}if(e.key==='Enter'||e.key.toLowerCase()==='e'){interact();return;}keys[e.key.toLowerCase()]=true;});
window.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
canvas.addEventListener('pointerdown',e=>{if(activeScene!=='map'||movement.locked)return;const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;let best=null,dist=.055;for(const [id,d] of Object.entries(destinations)){const p=nodes[d.door],v=Math.hypot(p.x-x,p.y-y);if(v<dist){dist=v;best=id;}}if(best)choose(best);});
setInterval(()=>{if(activeScene==='map'&&!movement.moving){mapHint.textContent='Click a glowing location marker to walk there';}},1600);
window.addEventListener('beforeunload',save);
