const HEROES = [
  {name:'Sarko',art:'Sarko',role:'Guardian • healing',color:'#f0c568',hp:115,attack:22,defense:8,healing:0,faith:0,crit:0,resist:0},
  {name:'Levi',art:'Levi',role:'Sword • formation',color:'#70a8f6',hp:105,attack:28,defense:4,healing:0,faith:0,crit:0,resist:0},
  {name:'Waiz',art:'Waiz',role:'Twin blades • speed',color:'#96e7ca',hp:100,attack:26,defense:4,healing:0,faith:0,crit:0,resist:0},
  {name:'Diago',art:'Diago',role:'Heavy blade • mentor',color:'#f39a75',hp:135,attack:27,defense:7,healing:0,faith:0,crit:0,resist:0},
  {name:'Amaya',art:'Amaya',role:'Spear • precision',color:'#ffb679',hp:95,attack:26,defense:3,healing:0,faith:0,crit:0,resist:0},
  {name:'Naomi',art:'Naomi',role:'Crossbow • counsel',color:'#d0a5f5',hp:100,attack:19,defense:5,healing:0,faith:0,crit:0,resist:0},
  {name:'Hailey',art:'Hailey',role:'Bow • celestial',color:'#77d5ed',hp:85,attack:24,defense:2,healing:0,faith:0,crit:0,resist:0},
  {name:'Isaac',art:'Magnar',role:'Hammer • fortress',color:'#b9c6da',hp:160,attack:22,defense:12,healing:0,faith:0,crit:0,resist:0}
];
const MONSTERS = ['AshhornStag','BriarClawBear','BrightCap','CrystalBackTortoise','DreadwingVulture','HollowWretch','Rockshade','Shadowthorn','StonehideRhino','Thornback','VineboundGuardian'];
const MONSTER_MOVES = {
  AshhornStag:['Antler Run','Antler Sweep'],BriarClawBear:['Hooking Claw'],BrightCap:['Cap Spring','Spore Burst'],
  CrystalBackTortoise:['Shell Turn'],DreadwingVulture:['Dreadwing Dive','Wing Rake'],HollowWretch:['Twin Rake'],
  Rockshade:['Stone Guard','Double Fist','Boulder Throw','Rock Charge'],Shadowthorn:['Shadow Pounce','Raking Swipe','Thorn Burst'],
  StonehideRhino:['Horn Drive','Horn Toss'],Thornback:['Tusks','Boar Charge'],VineboundGuardian:['Rootfall']
};
const BOSSES = [
  {name:'Corrupted Wolf',type:'CorruptedWolf',moves:['Shadow Pounce','Raking Swipe'],art:'Boss-CorruptedWolf.jpg'},
  {name:'Stoneheart Warden',type:'StonehideRhino',moves:['Horn Drive','Quaking Fist'],art:'Boss-Stoneheart.jpg'},
  {name:'Tidebound Oracle',type:'CrystalBackTortoise',moves:['Shell Turn','Tidal Surge'],art:'Boss-Tidebound.jpg'},
  {name:'Frostveil Warden',type:'AshhornStag',moves:['Antler Run','Whiteout Charge'],art:'Boss-Frostveil.jpg'},
  {name:'Stormwing Herald',type:'DreadwingVulture',moves:['Dreadwing Dive','Thunderstrike']},
  {name:'Cinder Crown',type:'BriarClawBear',moves:['Hooking Claw','Cinder Breath']},
  {name:'Malachar',type:'Shadowthorn',moves:['Heavy Strike','Rush','Corruption Wave'],art:'Boss-Malachar.jpg'},
  {name:'Rex Draconum',type:'BriarClawBear',moves:['Rex Claw','Dragon Breath'],art:'Boss-RexDraconum.jpg'},
  {name:'Dawn Guardian',type:'VineboundGuardian',moves:['Rootfall','Radiant Judgment'],art:'Boss-DawnGuardian.jpg'}
];
const CAMPAIGN_BOSSES=[1,2,3,4,5,6,7];
const MIDWORLD_BOSSES=[
  BOSSES[0],
  {name:'Floodfang',type:'Thornback',moves:['Tusks','Tidal Surge']},
  {name:'Icewing',type:'DreadwingVulture',moves:['Dreadwing Dive','Whiteout Charge']},
  {name:'Thunderstone Colossus',type:'Rockshade',moves:['Boulder Throw','Thunderstrike']},
  {name:'Ashhorn Inferno',type:'AshhornStag',moves:['Antler Run','Cinder Breath']},
  BOSSES[0],
  BOSSES[8]
];
const WORLD_NAMES=['Earth','Water','Snow','Thunder','Fire','Shadow','Light'];
const DIFFICULTIES=['Easy','Medium','Hard','Hardcore'];
const CAMPAIGN_SCENES=[
  [{speaker:'Sarko',text:'I know what it feels like to freeze when someone needs me. I will keep walking.'},{speaker:'Waiz',text:'You do not have to walk this road alone.'},{speaker:'Diago',text:'Stand steady. Courage grows through practice.'}],
  [{speaker:'Naomi',text:'Look beyond the water. The safest path is the one we can cross together.'},{speaker:'Levi',text:'Then we hold the line while everyone passes.'},{speaker:'Sarko',text:'No one gets left behind.'}],
  [{speaker:'Hailey',text:'I can see the path through the snow. Follow my arrows.'},{speaker:'Amaya',text:'Keep your formation and trust her aim.'},{speaker:'Sarko',text:'We protect each other until the storm passes.'}],
  [{speaker:'Isaac',text:'I can build a wall against the thunder, but the team makes it strong.'},{speaker:'Naomi',text:'Listen before you rush. The warning is part of the gift.'},{speaker:'Waiz',text:'Then we move together, one step at a time.'}],
  [{speaker:'Diago',text:'The fire tests more than your armor. Stay close.'},{speaker:'Hailey',text:'My bow is ready. I can cover the whole team.'},{speaker:'Sarko',text:'We have survived fear before. We can face this too.'}],
  [{speaker:'Malachar',text:'Your light will fail when your trust breaks.'},{speaker:'Naomi',text:'His words are a trap. Hold to what we know is true.'},{speaker:'Sarko',text:'Our strength is in standing together.'}],
  [{speaker:'Rex Draconum',text:'You call dependence strength? I call it weakness.'},{speaker:'Levi',text:'Love remains when strength fails.'},{speaker:'Sarko',text:'We came this far together. We finish together.'}]
];
const GEM_EFFECTS={Radiant:'Attack Power',Storm:'Critical Chance',Guardian:'Damage Reduction',Luminous:'Healing Power'};
const FRUITS = ['Love','Joy','Peace','Patience','Kindness','Goodness','Faithfulness','Gentleness','Self-Control'];
const FRUIT_STATS = {
  Love:'Max Health',Joy:'XP Gain',Peace:'Damage Reduction',Patience:'Skill Cooldown',
  Kindness:'Healing Power',Goodness:'Gold Gain',Faithfulness:'Critical Chance',
  Gentleness:'Special Attack Resistance','Self-Control':'Attack Power'
};
const FRUIT_POSITIONS = ['0% 0%','50% 0%','100% 0%','0% 50%','50% 50%','100% 50%','0% 100%','50% 100%','100% 100%'];
const TREE_POSITIONS = [[50,16],[29,29],[72,29],[22,46],[50,43],[79,46],[28,64],[50,65],[73,64]];
const RARITIES = ['Common','Uncommon','Rare','Epic','Legendary'];
const MUSIC = ['assets/Main-Theme.mp3','assets/Journey-Toward-the-Light.mp3'];
const $ = s => document.querySelector(s);
const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const img = name => `assets/${name}`;
const fruitIcon = name => `<span class="fruitIcon" role="img" aria-label="${esc(name)} fruit" style="background-position:${FRUIT_POSITIONS[FRUITS.indexOf(name)]||'50% 50%'}"></span>`;
const gemEffect=g=>GEM_EFFECTS[g.name?.split(' ')[0]]||'Attack Power';
const fruitStat = g => `${g.name==='Patience'?'−':'+'}${Math.round((g.bonus||0)*100)}% ${FRUIT_STATS[g.name]||'Bonus'}${g.gem?` · ${gemStat(state.inventory.find(x=>x.id===g.gem))}`:''}`;
const gemStat=g=>g?`+${Math.round((g.bonus||.04)*100)}% ${gemEffect(g)}`:'No gem';
const enemyArt=e=>e?.art||`Monster-${e?.type}.jpg`;
const label = id => id.replace(/([a-z])([A-Z])/g,'$1 $2');
const rand = n => Math.floor(Math.random()*n);
const clamp = (n,a,b) => Math.min(b,Math.max(a,n));
const newId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
let data = {skills:{}};
let campaignData = {worlds:[],chapters:[]};
let modal = '';
let selectedHero = 0;
let selectedGear = -1;
let selectedGem = -1;
let musicOn = false;
let musicIndex = 0;
let transient = {chips:[],hits:[],enemyMove:'',heal:-1,weapon:-1};
const SAVE_KEY = 'sarko-card-arena-files-v1';
const LEGACY_KEY = 'sarko-card-arena-v3';
let saveFiles = loadSaveFiles();
let state = loadState();
let manualChoice=null;

function initialState(){return {phase:'selection',mode:'survival',difficulty:0,unlockedDifficulty:0,campaignCarry:null,world:0,worldStage:0,pendingStory:false,pendingScene:null,storyChapter:0,bossDeck:[],chosen:[],fighters:[],enemy:null,deck:[],cleared:0,regular:0,turn:0,actor:0,paused:false,awaiting:false,manual:false,view3d:false,gold:0,points:0,inventory:[],ranks:{},scores:[],log:[],loot:[],scoreSent:false,arena:0,shopRevision:0,shopBought:[],playerName:'',savedAt:Date.now()};}
function validState(s){
  const heroId=id=>Number.isInteger(id)&&id>=0&&id<HEROES.length;
  if(!s||typeof s!=='object'||!['selection','battle','over'].includes(s.phase))return false;
  if(!Array.isArray(s.chosen)||s.chosen.length>4||!s.chosen.every(heroId)||!Array.isArray(s.inventory)||!Array.isArray(s.scores))return false;
  if(s.inventory.some(g=>!g||!['Fruit','Gem'].includes(g.kind)||typeof g.name!=='string'||!RARITIES.includes(g.rarity)||!Number.isFinite(g.bonus)||!((g.equippedTo===null)||heroId(g.equippedTo))))return false;
  if(!Number.isInteger(s.arena)||!heroId(s.arena)||!Number.isInteger(s.cleared)||s.cleared<0)return false;
  if(s.phase!=='selection'){
    if(!Array.isArray(s.fighters)||s.fighters.length!==4||s.fighters.some(f=>!heroId(f.id)||!Number.isFinite(f.hp)||!Number.isInteger(f.level)||f.level<1||!Array.isArray(f.last)))return false;
    const e=s.enemy;if(!e||!(MONSTERS.includes(e.type)||e.type==='CorruptedWolf')||typeof e.name!=='string'||!Number.isFinite(e.hp)||!Number.isFinite(e.max)||!Array.isArray(e.moves))return false;
  }
  return true;
}
function loadSaveFiles(){
  try {
    const files=JSON.parse(localStorage.getItem(SAVE_KEY));
    if(files?.version===1&&Array.isArray(files.slots)&&files.slots.length===3&&files.slots.some(slot=>validState(slot?.state))) {
      files.active=Number.isInteger(files.active)&&validState(files.slots[files.active]?.state)?files.active:files.slots.findIndex(slot=>validState(slot?.state));
      return files;
    }
  } catch {}
  let old=null;
  try {old=JSON.parse(localStorage.getItem(LEGACY_KEY));} catch {}
  return {version:1,active:0,slots:[{name:'File 1',state:validState(old)?old:initialState()},null,null]};
}
function loadState(){
  const loaded={...initialState(),...saveFiles.slots[saveFiles.active].state};
  if(loaded.mode==='survival')loaded.regular=loaded.cleared%20;
  if(loaded.enemy&&!Number.isInteger(loaded.enemy.world))loaded.enemy.world=loaded.mode==='campaign'?loaded.world:Math.floor(loaded.cleared/20)%7;
  return loaded;
}
function save(){
  state.savedAt=Date.now();
  saveFiles.slots[saveFiles.active].state=state;
  try {localStorage.setItem(SAVE_KEY,JSON.stringify(saveFiles));return true;} catch {return false;}
}
function switchFile(index){
  if(index<0||index>=3)return;
  if(index===saveFiles.active)return;
  save();
  if(!saveFiles.slots[index])saveFiles.slots[index]={name:`File ${index+1}`,state:initialState()};
  saveFiles.active=index;state=loadState();state.paused=true;
  selectedHero=state.chosen[0]??0;selectedGear=-1;selectedGem=-1;transient={chips:[],hits:[],enemyMove:'',heal:-1,weapon:-1};
  save();modal='files';render();toast(`Opened ${saveFiles.slots[index].name}.`);
}
function renameFile(index){
  const slot=saveFiles.slots[index],input=$(`#fileName${index}`);
  if(!slot||!input)return;
  slot.name=input.value.trim().slice(0,30)||`File ${index+1}`;
  save();render();
}
function deleteFile(index){
  if(!saveFiles.slots[index]||!confirm(`Delete ${saveFiles.slots[index].name}? This cannot be undone unless you downloaded a backup.`))return;
  saveFiles.slots[index]=null;
  if(index===saveFiles.active){
    let next=saveFiles.slots.findIndex(Boolean);
    if(next<0){next=0;saveFiles.slots[0]={name:'File 1',state:initialState()};}
    saveFiles.active=next;state=loadState();state.paused=true;
  }
  save();render();
}
function downloadFile(index){
  const slot=saveFiles.slots[index];if(!slot)return;
  save();
  const blob=new Blob([JSON.stringify({app:'Sarko Guild Card Arena',version:1,name:slot.name,state:slot.state})],{type:'application/json'});
  const url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download=`Sarko-${slot.name.replace(/[^a-z0-9-]+/gi,'-')}.json`;
  document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function importFile(index,file){
  if(!file||index<0||index>=3)return;
  try {
    const backup=JSON.parse(await file.text());
    if(backup?.app!=='Sarko Guild Card Arena'||backup.version!==1||!validState(backup.state))throw Error('Invalid Sarko save file.');
    if(saveFiles.slots[index]&&!confirm(`Replace ${saveFiles.slots[index].name} with this backup?`))return;
    save();saveFiles.slots[index]={name:String(backup.name||`File ${index+1}`).slice(0,30),state:backup.state};
    if(index===saveFiles.active){state=loadState();state.paused=true;}
    save();render();toast('Save file imported.');
  } catch(e){toast(e.message||'Could not import save file.');}
}
function toast(text){const el=$('#toast');el.textContent=text;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2400);}
function note(text){state.log.unshift(text);state.log=state.log.slice(0,30);save();}
function hero(id){return HEROES[id];}
function skillFor(id,index){return data.skills?.[id===7?'Magnar':hero(id).name]?.[index]??{name:'Attack',description:'Strike the foe.'};}
function rankFor(id,index){return 1+(state.ranks[`${id}-${index}`]||0);}
function fruitBonus(id,name){return state.inventory.filter(g=>g.kind==='Fruit'&&g.equippedTo===id&&g.name===name).reduce((n,g)=>n+(g.bonus||0),0);}
function gemBonus(id,effect){return state.inventory.filter(g=>g.kind==='Fruit'&&g.equippedTo===id&&g.gem).reduce((n,g)=>{const gem=state.inventory.find(x=>x.id===g.gem);return n+(gem&&gemEffect(gem)===effect?(gem.bonus||.04):0);},0);}
function skillUpgradeCost(index,rank){return Math.ceil((45+25*rank+10*index)*1.25);}
function cooldown(id,index){return Math.max(1,3+Math.floor(index/2)-(rankFor(id,index)-1));}
function recordSkillUse(f,index){
  const base=cooldown(f.id,index);
  if(!Array.isArray(f.cooldownSavings))f.cooldownSavings=Array(8).fill(0);
  const accumulated=(f.cooldownSavings[index]||0)+base*fruitBonus(f.id,'Patience');
  const saved=Math.min(base-1,Math.floor(accumulated));
  f.cooldownSavings[index]=accumulated-saved;
  f.last[index]=state.turn-saved;
}
function fighterStats(f){const base=hero(f.id),level=f.level||1;return {max:Math.round(base.hp*(1+.12*(level-1)+fruitBonus(f.id,'Love'))),attack:Math.round(base.attack*(1+.08*(level-1)+fruitBonus(f.id,'Self-Control')+gemBonus(f.id,'Attack Power'))),defense:Math.round(base.defense*(1+.055*(level-1))),healing:Math.round(base.healing*(1+.08*(level-1))),faith:base.faith,crit:base.crit+fruitBonus(f.id,'Faithfulness')+gemBonus(f.id,'Critical Chance'),resist:base.resist+fruitBonus(f.id,'Peace')+gemBonus(f.id,'Damage Reduction')};}
function shuffledDeck(){return [...MONSTERS].sort(()=>Math.random()-.5);}
function shuffledBosses(){return BOSSES.map((_,i)=>i).sort(()=>Math.random()-.5);}
function pickHero(id){if(state.phase!=='selection')return;const at=state.chosen.indexOf(id);if(at>=0)state.chosen.splice(at,1);else if(state.chosen.length<4)state.chosen.push(id);else return toast('Choose exactly four heroes.');save();render();}
function startRun(mode='survival'){
  const carry=mode==='campaign'&&state.campaignCarry?.difficulty===state.difficulty-1?state.campaignCarry:null;
  if(state.chosen.length!==4&&!carry)return toast('Choose four heroes first.');
  if(mode==='campaign'&&state.difficulty>state.unlockedDifficulty)return toast('Beat the previous difficulty first.');
  if(carry)state.chosen=[...carry.chosen];
  state.mode=mode;state.world=0;state.worldStage=0;state.pendingStory=mode==='campaign';state.pendingScene=null;state.storyChapter=0;
  state.inventory=[];state.ranks={};selectedGear=-1;selectedGem=-1;state.phase='battle';state.manual=false;manualChoice=null;
  state.fighters=state.chosen.map(id=>({id,level:1,xp:0,hp:hero(id).hp,ward:false,nextSkill:0,last:Array(8).fill(-100),cooldownSavings:Array(8).fill(0)}));
  if(carry){state.inventory=JSON.parse(JSON.stringify(carry.inventory));state.ranks={...carry.ranks};state.fighters=JSON.parse(JSON.stringify(carry.fighters));}
  state.fighters.forEach(f=>f.hp=fighterStats(f).max);state.deck=[];state.bossDeck=[];state.cleared=0;state.regular=0;state.turn=0;state.actor=0;
  state.paused=mode==='campaign';state.awaiting=false;state.gold=0;state.points=0;state.loot=[];state.log=[];state.shopBought=[];state.shopRevision=0;
  state.arena=state.chosen[rand(4)];state.scoreSent=false;note(mode==='campaign'?'The book campaign begins in the Earth world.':'The guild arena opens. Choose when to fight the next foe.');
  if(carry){state.gold=carry.gold;state.points=carry.points;note('Your heroes, gear, levels, and skill ranks carry into the next difficulty.');}
  spawnEnemy();if(mode==='campaign'){modal='story';state.paused=true;}playMusic();render();globalThis.scrollTo?.(0,0);
}
function spawnEnemy(){
  const campaign=state.mode==='campaign';
  const boss=[9,19].includes(campaign?state.worldStage:state.regular);
  const world=campaign?state.world:Math.floor(state.cleared/20)%7;
  let chosenBoss=null,type;
  if(boss){
    if(campaign)chosenBoss=state.worldStage===9?MIDWORLD_BOSSES[state.world]:BOSSES[CAMPAIGN_BOSSES[state.world]];
    else{if(!state.bossDeck?.length)state.bossDeck=shuffledBosses();chosenBoss=BOSSES[state.bossDeck.shift()];}
    type=chosenBoss.type;
  }else{
    if(!state.deck.length){state.deck=shuffledDeck();note('The monster deck has been reshuffled.');}
    type=state.deck.shift();
  }
  const level=campaign?Math.max(1,1+state.world*2+Math.floor(state.worldStage/5)+(boss?2:0)):Math.max(1,1+Math.floor(state.cleared/3)+(boss?2:0)+rand(3)-1);
  const difficulty=campaign?[.8,1,1.2,1.4][state.difficulty||0]:1;
  const hp=Math.max(1,Math.round(((boss?300:145)+state.cleared*(boss?30:12))*(1+.07*(level-1))*.5*difficulty));
  state.enemy={type,boss,world,bossId:chosenBoss?.name||null,name:boss?`BOSS · ${chosenBoss.name}`:label(type),art:chosenBoss?.art||null,level,hp,max:hp,
    attack:Math.max(1,Math.round(((boss?34:20)+state.cleared*2)*(1+.04*(level-1))*.5*difficulty)),
    guard:Math.max(0,Math.round(((boss?13:5)+Math.floor(level/2))*.5*difficulty)),moves:chosenBoss?.moves||MONSTER_MOVES[type],move:0};
  state.awaiting=false;state.paused=false;state.actor=0;state.turn=0;state.loot=[];
  note(`${campaign?`World ${state.world+1} · Stage ${state.worldStage+1}`:`Wave ${state.cleared+1}`}: ${state.enemy.name} enters the arena.`);save();
}
function availableTeamMoves(){
  const alive=id=>state.fighters.some(f=>f.id===id&&f.hp>0),count=state.fighters.filter(f=>f.hp>0).length,moves=[];
  if(alive(0)&&alive(1))moves.push("Shepherd's Advance");
  if(alive(5)&&count>1)moves.push('A Witnessed Opening');
  if(alive(3)&&alive(6))moves.push("The Mentor's Clear Line");
  if(alive(7)&&alive(4))moves.push('Room to Move');
  if(alive(1)&&count>1)moves.push('Guiding Parry');
  if(alive(2)&&count>1)moves.push('One Road Together');
  if(count>=3)moves.push('Threefold Support');
  return moves;
}
function teamMove(){
  const moves=availableTeamMoves();if(!moves.length)return;
  const move=moves[(Math.floor(state.turn/4)-1)%moves.length],living=state.fighters.filter(f=>f.hp>0);
  const current=move==='A Witnessed Opening'||move==='Room to Move';
  let hit=0;
  if(current)hit=living.length*12+12;
  else if(move!=='Threefold Support'){
    const finisher=move==="Shepherd's Advance"?living.find(f=>f.id===1):move==="The Mentor's Clear Line"?living.find(f=>f.id===6):living.find(f=>f.id!==(move==='Guiding Parry'?1:2));
    hit=Math.max(1,Math.round(fighterStats(finisher).attack*(move==="The Mentor's Clear Line"?.35:.2)));
  }
  state.enemy.hp=Math.max(0,state.enemy.hp-hit);
  if(hit)transient.chips.push({text:'−'+hit+' '+move,color:'#f1c76b'});
  if(!current)for(const ally of living){
    ally.ward=true;
    const pct=move==='Threefold Support'?.05:move==="Shepherd's Advance"?.04:0;
    const healed=Math.min(fighterStats(ally).max-ally.hp,Math.round(fighterStats(ally).max*pct));
    if(healed>0){ally.hp+=healed;transient.heal=ally.id;transient.chips.push({text:'+'+healed+' '+hero(ally.id).name,color:'#72e5aa'});}
  }
  note('TEAM SKILL / '+move+' / '+hit+' bonus damage'+(current?'.':move==='Threefold Support'||move==="Shepherd's Advance"?'; healing and protection.':'; protection.'));
}
function toggleMode(){
  if(state.phase!=='battle'||state.awaiting)return;
  state.manual=!state.manual;manualChoice=null;state.paused=false;
  note(state.manual?'Manual turns: choose a basic attack or a ready skill for each hero.':'Auto battle resumed.');
  save();render();
}
function toggleView(){
  state.view3d=!state.view3d;
  save();render();
}
function chooseManual(index){
  if(!state.manual||state.phase!=='battle'||state.paused||state.awaiting||modal)return;
  const f=state.fighters[state.actor];if(!f||f.hp<=0)return;
  const turn=state.turn+(state.actor===0?1:0);
  if(index>=0&&turn-f.last[index]<cooldown(f.id,index))return toast('That skill is still cooling down.');
  manualChoice=index;battleTick();
}
function manualPanel(){
  if(!state.manual||state.phase!=='battle'||state.awaiting)return '';
  const f=state.fighters[state.actor];if(!f)return '';
  const turn=state.turn+(state.actor===0?1:0),skills=data.skills[f.id===7?'Magnar':hero(f.id).name]||[];
  return '<div class="manualPanel panel panelpad"><div class="sectionHead"><div><span class="eyebrow">Manual turn · '+hero(f.id).name+'</span><h3>Choose an action</h3></div><button class="button mini" data-action="basic">BASIC ATTACK</button></div><div class="manualSkills">'+skills.map((skill,i)=>{
    const wait=Math.max(0,cooldown(f.id,i)-(turn-f.last[i]));
    return '<button class="manualSkill button mini" data-action="manualSkill" data-index="'+i+'" '+(wait?'disabled':'')+'><img src="'+img('Skill-'+f.id+'-'+i+'.png')+'" alt=""><span>'+esc(skill.name)+'<small>'+(wait?'Ready in '+wait+' turns':'Ready · '+esc(skill.description))+'</small></span></button>';
  }).join('')+'</div></div>';
}
function battleTick(){
  if(state.phase!=='battle'||state.paused||state.awaiting||modal)return;
  const enemy=state.enemy;if(!enemy)return;
  const f=state.fighters[state.actor],nextTurn=state.turn+(state.actor===0?1:0);
  if(state.manual&&f?.hp>0&&manualChoice===null)return;
  if(state.manual&&manualChoice>=0&&nextTurn-f.last[manualChoice]<cooldown(f.id,manualChoice))return;
  transient={chips:[],hits:[],enemyMove:'',heal:-1,weapon:-1};
  if(state.actor===0)state.turn++;
  if(f?.hp>0){
    const available=[];
    for(let k=0;k<8;k++){const n=(f.nextSkill+k)%8;if(state.turn-f.last[n]>=cooldown(f.id,n))available.push(n);}
    const index=state.manual?manualChoice:available[0];
    if(index===-1){
      const stats=fighterStats(f),hit=Math.max(3,Math.round(stats.attack)-enemy.guard);
      enemy.hp=Math.max(0,enemy.hp-hit);transient.weapon=f.id;
      transient.chips.push({text:'−'+hit+' '+hero(f.id).name,color:hero(f.id).color});
      note(hero(f.id).name+' uses Basic Attack for '+hit+' damage.');
      globalThis.SarkoArena3D?.action({kind:'attack',hero:f.id,skill:'Basic Attack',color:hero(f.id).color});
    }else if(index!==undefined&&index!==null){
      const skill=skillFor(f.id,index),desc=skill.description.toLowerCase(),stats=fighterStats(f),power=1+.18*(rankFor(f.id,index)-1);
      recordSkillUse(f,index);f.nextSkill=(index+1)%8;
      const heal=/heal|restore|recover/.test(desc),protect=/protect|ward|brace|guard/.test(desc);
      if(heal){
        const target=state.fighters.filter(x=>x.hp>0).sort((a,b)=>a.hp/fighterStats(a).max-b.hp/fighterStats(b).max)[0];
        if(target){const amount=Math.round(Math.max(18,Math.round((stats.healing*2+stats.faith)*power))*(1+fruitBonus(f.id,'Kindness')+gemBonus(f.id,'Healing Power')));
          const healed=Math.min(amount,fighterStats(target).max-target.hp);target.hp+=healed;transient.heal=target.id;
          transient.chips.push({text:'+'+healed+' '+hero(target.id).name,color:'#72e5aa'});
          note(hero(f.id).name+' uses '+skill.name+'; '+hero(target.id).name+' heals '+healed+'.');
          globalThis.SarkoArena3D?.action({kind:'heal',hero:f.id,target:target.id,skill:skill.name,color:'#72e5aa'});
        }
      }
      if(protect){state.fighters.filter(x=>x.hp>0).forEach(x=>x.ward=true);note(hero(f.id).name+' grants a protective ward.');}
      if(!heal||/strike|bolt|arrow|cut|thrust/.test(desc)){
        let hit=Math.max(4,Math.round(stats.attack*(1.2+(f.nextSkill%4)*.13)*power)-enemy.guard);
        if(Math.random()<stats.crit){hit=Math.round(hit*2);note('Critical hit!');}
        enemy.hp=Math.max(0,enemy.hp-hit);transient.weapon=f.id;
        transient.chips.push({text:'−'+hit+' '+hero(f.id).name,color:hero(f.id).color});
        note(hero(f.id).name+' uses '+skill.name+' for '+hit+' damage.');
        globalThis.SarkoArena3D?.action({kind:'attack',hero:f.id,skill:skill.name,color:hero(f.id).color});
      }
    }
  }
  manualChoice=null;
  state.actor++;
  if(enemy.hp<=0){victory();render();return;}
  if(state.actor>=4){
    state.actor=0;
    if(state.turn%4===0){teamMove();if(enemy.hp<=0){victory();render();return;}}
    monsterTurn();
  }
  save();render();
}
function unequipFallen(id){
  for(const item of state.inventory)if(item.equippedTo===id)item.equippedTo=null;
  note(hero(id).name+' falls. Their fruit returns to the card arena inventory.');
}
function monsterTurn(){
  const enemy=state.enemy,living=state.fighters.filter(f=>f.hp>0);if(!living.length)return defeat();
  const move=enemy.moves[enemy.move++%enemy.moves.length];
  transient.enemyMove=move;
  if(move==='Stone Guard'||move==='Shell Turn'){enemy.guard+=2;note(`${enemy.name} uses ${move} and hardens its defense.`);return;}
  const area=['Spore Burst','Rootfall','Quaking Fist','Tidal Surge','Whiteout Charge','Thunderstrike','Cinder Breath','Corruption Wave','Dragon Breath','Radiant Judgment'].includes(move);
  const targets=area?living:[living[rand(living.length)]];
  const multiplier=area?.67:move==='Heavy Strike'||move==='Rex Claw'?1.3:1;
  for(const victim of targets){
    const stats=fighterStats(victim);
    const damage=Math.max(2,Math.round((enemy.attack*multiplier-stats.defense*.5)*(1-stats.resist)*(1-(area?fruitBonus(victim.id,'Gentleness'):0))*(victim.ward?.55:1)));
    victim.hp=Math.max(0,victim.hp-damage);victim.ward=false;
    transient.hits.push({id:victim.id,damage});
    globalThis.SarkoArena3D?.action({kind:'enemy',target:victim.id});
    note(`${enemy.name} uses ${move} on ${hero(victim.id).name} for ${damage}.`);
    if(victim.hp===0)unequipFallen(victim.id);
  }
  if(state.fighters.every(f=>f.hp===0))defeat();
}
function victory(){
  const enemy=state.enemy,boss=enemy.boss;state.cleared++;state.regular=state.mode==='campaign'?0:(state.regular+1)%20;
  if(state.mode==='campaign'){state.worldStage++;if([5,10,15].includes(state.worldStage))state.pendingScene={world:state.world,stage:state.worldStage};}
  state.awaiting=true;state.paused=true;state.actor=0;
  const earnedPoint=state.cleared%2===0;if(earnedPoint)state.points++;
  state.gold+=Math.round((24+enemy.level*10+(boss?80:0))*1.5*(1+state.chosen.reduce((n,id)=>n+fruitBonus(id,'Goodness'),0)));
  state.loot=[];addLoot('Fruit');
  if(boss){addLoot('Fruit');addLoot('Fruit');addLoot('Gem');}
  else{if(Math.random()<.44)addLoot('Fruit');if(Math.random()<.18)addLoot('Gem');}
  const xp=22+enemy.level*7+(boss?40:0);
  for(const f of state.fighters){if(f.hp<=0)continue;f.xp+=Math.round(xp*(1+fruitBonus(f.id,'Joy')));while(f.xp>=60+f.level*30){f.xp-=60+f.level*30;f.level++;f.hp=fighterStats(f).max;note(`${hero(f.id).name} reaches level ${f.level} and fully heals.`);}}
  if(boss&&state.mode==='campaign'){
    state.points+=2;
    state.fighters.filter(f=>f.hp>0).forEach(f=>{f.level++;f.hp=fighterStats(f).max;});
    if(state.worldStage===20){
      if(state.world===6){state.phase='over';state.unlockedDifficulty=Math.max(state.unlockedDifficulty,Math.min(3,state.difficulty+1));state.campaignCarry={difficulty:state.difficulty,chosen:[...state.chosen],inventory:JSON.parse(JSON.stringify(state.inventory)),ranks:{...state.ranks},fighters:JSON.parse(JSON.stringify(state.fighters)),gold:state.gold,points:state.points};note(`Campaign complete on ${DIFFICULTIES[state.difficulty]}. The next difficulty is unlocked.`);}
      else{state.world++;state.worldStage=0;state.pendingStory=true;state.storyChapter=campaignData.worlds[state.world]?.first||0;note(`${campaignData.worlds[state.world]?.name||'Next'} world unlocked. Read the next book chapters before continuing.`);}
    }
  }
  note(`${enemy.name} defeated. ${state.cleared} monsters cleared. A chest was found. ${earnedPoint?'+1 skill point.':'Next victory awards a skill point.'}`);save();
}
function addLoot(kind){const item=kind==='Fruit'?{id:newId(),kind,name:FRUITS[rand(FRUITS.length)],rarity:RARITIES[Math.min(4,Math.floor(state.cleared/9)+rand(2))],bonus:.04+rand(4)*.02,equippedTo:null,gem:null}:{id:newId(),kind,name:['Radiant','Storm','Guardian','Luminous'][rand(4)]+' Gem',rarity:RARITIES[Math.min(4,Math.floor(state.cleared/12)+rand(2))],bonus:.04,equippedTo:null};state.inventory.push(item);state.loot.push(item);}
function defeat(){state.phase='over';state.paused=true;note(`Run complete: ${state.cleared} monsters cleared.`);save();}
function nextFight(){if(state.phase!=='battle'||!state.awaiting)return;if(state.pendingStory){modal='story';render();return;}if(state.pendingScene){modal='scene';render();return;}spawnEnemy();render();}
function resetRun(){manualChoice=null;state.inventory=[];state.ranks={};state.gold=0;state.points=0;state.loot=[];selectedGear=-1;selectedGem=-1;state.phase='selection';state.chosen=[...(state.campaignCarry?.chosen||[])];state.fighters=[];state.enemy=null;state.awaiting=false;state.paused=false;modal='';save();render();}
function submitScore(){if(state.phase!=='over'||state.scoreSent)return;const input=$('#scoreName');const name=(input?.value||state.playerName||'Traveler').trim().slice(0,30)||'Traveler';state.playerName=name;state.scores.push({name,cleared:state.cleared,bosses:Math.floor(state.cleared/20)*2+(state.cleared%20>=10?1:0),team:state.chosen.map(id=>hero(id).name).join(', '),date:new Date().toISOString().slice(0,10)});state.scores.sort((a,b)=>b.cleared-a.cleared);state.scores=state.scores.slice(0,50);state.scoreSent=true;save();toast('Score saved on this device.');render();}
function playMusic(){if(!musicOn)return;const a=$('#music');if(!a)return;a.src=MUSIC[musicIndex%MUSIC.length];a.volume=.28;a.play().catch(()=>{});}
function toggleMusic(){musicOn=!musicOn;const a=$('#music');if(musicOn)playMusic();else a.pause();render();}
$('#music').addEventListener('ended',()=>{musicIndex++;playMusic();});
function progressMap(){
  const campaign=state.mode==='campaign',start=campaign?0:Math.max(0,state.cleared-3),count=campaign?20:11;
  return `<div class="map" aria-label="Stage map">${Array.from({length:count},(_,j)=>{const n=start+j+1,boss=campaign?n===20:n%6===0,done=campaign?n<=state.worldStage:n<=state.cleared,now=campaign?n===state.worldStage+1:n===state.cleared+1;return `<div class="dot ${boss?'boss':''} ${done?'done':''} ${now?'now':''}" title="Stage ${n}${boss?' boss':''}">${boss?'♛':done?'✓':''}</div>`;}).join('')}</div>`;
}
function arenaArt(){
  return `World-${WORLD_NAMES[state.enemy?.world??(state.mode==='campaign'?state.world:Math.floor(state.cleared/20)%7)]}.jpg`;
}
function modeHeading(){return state.mode==='campaign'?`World ${state.world+1}: ${campaignData.worlds[state.world]?.name||'Earth'} · Stage ${state.worldStage+1}/20 · ${DIFFICULTIES[state.difficulty]}`:`Wave ${state.cleared+1}`;}
function journeyScreen(){
  const campaign=state.mode==='campaign',world=campaign?state.world:Math.floor(state.cleared/20)%7;
  const names=['Earth','Water','Snow','Thunder','Fire','Shadow','Light'],name=names[world];
  const stage=campaign?state.worldStage:state.regular;
  const progress=campaign?stage/20:(state.cleared%20)/20;
  const x=15+(world+progress)*11.3,y=[45,48,42,45,43,48,45][world];
  const nextBoss=[9,19].includes(stage);
  const next=campaign?`World ${world+1} · Stage ${stage+1} of 20`:`Survival wave ${state.cleared+1}`;
  const token=hero(state.arena);
  return `<section class="journeyScreen panel panelpad"><span class="eyebrow">The road between battles · ${campaign?'Book campaign':'Endless survival'}</span><h1>${esc(state.enemy.name)} is defeated</h1><p class="journeyIntro">Your party travels onward through ${name}. Choose when to enter the next encounter.</p>
    <div class="worldMap" role="img" aria-label="Sarko world map showing the party in ${name}"><img class="worldMapArt" src="${img('Sarko-World-Map.jpg')}" alt="Illustrated Sarko world with seven connected regions"><div class="mapNames">${names.map((region,i)=>`<span style="left:${8+i*12.1}%" class="${i===world?'current':''}">${region}</span>`).join('')}</div><div class="partyMarker" style="left:${x}%;top:${y}%"><img src="${img(token.art+'.jpg')}" alt="${esc(token.name)}"><span>PARTY · ${esc(name)}</span></div></div>
    <div class="journeyGrid"><div class="panel panelpad"><span class="eyebrow">Route ahead</span><h2>${esc(next)}</h2><p>${nextBoss?(stage===9?'A midworld boss guards the road.':'The world boss waits at the end of this road.'):'The next monster is waiting beyond the path.'}</p><div class="journeyWorld"><img src="${img('World-'+name+'.jpg')}" alt="${esc(name)} world"><div><strong>${esc(name)} world</strong><span>${campaign?`${stage} of 20 stages cleared in this world`:`${state.cleared} ${state.cleared===1?'monster':'monsters'} cleared in survival`}</span></div></div><button class="button journeyGo" data-action="next">${nextBoss?'TRAVEL TO BOSS':'TRAVEL TO NEXT BATTLE'} →</button></div>
    <div class="panel panelpad"><span class="eyebrow">Victory · rewards found</span><h2>${esc(state.enemy.name)} defeated</h2>${lootHtml()}<p class="small muted">Gold ${state.gold} · Skill points ${state.points}. A fruit chest is guaranteed after every victory.</p><div class="actions"><button class="button alt" data-action="modal" data-modal="shop">VISIT MERCHANT</button><button class="button alt" data-action="modal" data-modal="forge">FORGE</button><button class="button alt" data-action="modal" data-modal="church">UPGRADE SKILLS</button><button class="button alt" data-action="modal" data-modal="tree">FRUIT TREE</button></div></div></div></section>`;
}
function heroCard(id,selection=false){const h=hero(id),picked=state.chosen.includes(id),f=state.fighters.find(x=>x.id===id),stats=f?fighterStats(f):h,hit=transient.hits.filter(x=>x.id===id).reduce((n,x)=>n+x.damage,0);return `<article class="card ${selection?'':'heroBattle'} ${picked&&selection?'selected':''} ${f&&f.hp===0?'dead':''} ${transient.heal===id?'healing':''}" style="border-top:4px solid ${h.color}"><button class="cardbutton" data-action="${selection?'pick':'details'}" data-id="${id}" aria-label="${selection?'Choose':'Inspect'} ${h.name}"><img class="portrait" src="${img(h.art+'.jpg')}" alt="${h.name}"><div class="cardbody"><div class="meta"><h3>${h.name}</h3><span class="role">${selection?'LV 1':`LV ${f.level}`}</span></div><div class="role">${h.role}</div>${hit?`<div class="damageTaken" aria-live="polite">−${hit} DAMAGE TAKEN${transient.enemyMove?` · ${esc(transient.enemyMove)}`:''}</div>`:''}${f?`<div class="bar health" aria-label="Health ${f.hp} of ${stats.max}"><span style="width:${100*f.hp/stats.max}%"></span></div><div class="stats">HP ${f.hp}/${stats.max} · ATK ${stats.attack} · DEF ${stats.defense}</div><div class="bar xp"><span style="width:${100*f.xp/(60+f.level*30)}%"></span></div><div class="stats">XP ${f.xp}/${60+f.level*30}</div>`:`<div class="stats">HP ${h.hp} · ATK ${h.attack} · DEF ${h.defense}</div>`}</div></button>${selection?`<span class="pick">${picked?'✓ CHOSEN':'TAP TO PICK'}</span>`:''}</article>`;}
function header(){return `<div class="topbar"><div class="brand"><div class="brandmark">S</div><div><b>SARKO CLASSIC RPG</b><span class="eyebrow small">Guild Arena · ${esc(saveFiles.slots[saveFiles.active].name)}</span></div></div><nav class="nav" aria-label="Main navigation">${state.mode==='campaign'&&state.phase!=='selection'?'<button class="button mini" data-action="modal" data-modal="story">Book Story</button>':''}<button class="button mini ${modal==='files'?'active':''}" data-action="modal" data-modal="files">Save Files</button><button class="button mini ${modal==='shop'?'active':''}" data-action="modal" data-modal="shop">Shop</button><button class="button mini ${modal==='forge'?'active':''}" data-action="modal" data-modal="forge">Forge</button><button class="button mini ${modal==='church'?'active':''}" data-action="modal" data-modal="church">Church</button><button class="button mini ${modal==='tree'?'active':''}" data-action="modal" data-modal="tree">Fruit Tree</button><button class="button mini ${modal==='scores'?'active':''}" data-action="modal" data-modal="scores">Scores</button></nav></div>`;}
function selection(){return `<div class="intro"><section class="panel heroIntro"><span class="eyebrow">Guild of First Light · two ways to play</span><h1>Choose four heroes.<br>Follow the book or survive.</h1><p>Survival reshuffles all monsters and dungeon guardians. Campaign follows all 17 chapters across seven worlds, with 18 monsters and bosses at stages 10 and 20 in each world. Choose Auto or Manual during combat.</p><div class="statline"><span>✦ ${state.chosen.length}/4 selected</span><span>✦ A chest every victory</span><span>✦ Fruit & gems</span></div><div class="actions"><button class="button" data-action="start" ${state.chosen.length!==4?'disabled':''}>ENDLESS SURVIVAL</button><button class="button" data-action="startCampaign" ${state.chosen.length!==4?'disabled':''}>BOOK CAMPAIGN</button></div><div class="difficultyPick"><span class="eyebrow">Campaign difficulty · beat one to unlock the next</span><div class="actions">${DIFFICULTIES.map((name,i)=>`<button class="button mini ${state.difficulty===i?'active':'alt'}" data-action="difficulty" data-index="${i}" ${i>state.unlockedDifficulty?'disabled':''}>${name}${i>state.unlockedDifficulty?' 🔒':''}</button>`).join('')}</div></div></section><div class="panel introArt" role="img" aria-label="Sarko themed arena"></div></div><div class="sectionHead"><div><span class="eyebrow">Playable companions</span><h2>Pick your party</h2></div><span class="muted small">Tap a card to select it. Skills can be read in battle.</span></div><div class="roster">${HEROES.map((_,i)=>heroCard(i,true)).join('')}</div>`;}
function lootHtml(){return `<div class="loot">${state.loot.length?state.loot.map(g=>`<div class="lootitem">${g.kind==='Fruit'?fruitIcon(g.name):`<img src="${img('Guild-Gem.jpg')}" alt="">`}<span>${esc(g.rarity)} ${esc(g.name)}</span></div>`).join(''):'<span class="muted">No gear found this fight.</span>'}</div>`;}
function battle(){if(state.awaiting&&state.phase==='battle')return journeyScreen();const e=state.enemy;return `<section class="arenaBackdrop" style="background-image:url('${img(arenaArt())}')"><div class="battleHead"><div><span class="eyebrow">${state.phase==='over'?'Run complete':state.awaiting?'Foe defeated':`${modeHeading()} · ${e.boss?'Boss battle':state.mode==='campaign'?'World encounter':'Survival'}`}</span><h2>${state.phase==='over'?`${state.cleared} monsters cleared`:state.awaiting?`${e.name} defeated`:`${e.name} enters the arena`}</h2><div class="summary"><span>Cleared <b>${state.cleared}</b></span><span>Gold <b>${state.gold}</b></span><span>Skill points <b>${state.points}</b></span></div></div><div class="actions"><button class="button merchantButton" data-action="modal" data-modal="shop">VISIT MERCHANT · 10 FRUIT OFFERS</button>${state.phase==='battle'&&!state.awaiting?`<button class="button alt" data-action="mode">${state.manual?'MANUAL':'AUTO'}</button><button class="button alt" data-action="pause">${state.paused?'RESUME':'PAUSE BATTLE'}</button>`:''}<button class="button ghost" data-action="music">${musicOn?'MUSIC ON':'MUSIC OFF'}</button></div></div>${manualPanel()}${state.awaiting?`<div class="panel panelpad" style="margin-top:16px"><span class="eyebrow">Victory · rewards found</span><h3>${e.name} is defeated</h3>${lootHtml()}<p class="muted small">${state.cleared%2===0?"+1 skill point earned.":"Next victory earns a skill point."} A chest is guaranteed each victory. Spend gold in the shop or improve gear before continuing.</p><div class="actions"><button class="button" data-action="next">FIGHT NEXT →</button><button class="button alt" data-action="modal" data-modal="shop">VISIT MERCHANT</button><button class="button alt" data-action="modal" data-modal="forge">VISIT FORGE</button><button class="button alt" data-action="modal" data-modal="church">UPGRADE SKILLS</button><button class="button alt" data-action="modal" data-modal="tree">EQUIP FRUIT</button></div></div>`:''}<div class="battleGrid"><div class="heroes">${state.fighters.map(f=>heroCard(f.id)).join('')}</div><article class="card enemyCard" data-world="${WORLD_NAMES[e.world??0]}"><img src="${img(enemyArt(e))}" alt="${e.name}"><div class="cardbody"><span class="eyebrow">${e.boss?'Boss':'Monster'} · ${WORLD_NAMES[e.world??0]} world · level ${e.level}</span><h3>${e.name}</h3><div class="bar enemy" aria-label="Enemy health ${e.hp} of ${e.max}"><span style="width:${100*e.hp/e.max}%"></span></div><p class="stats">HP ${e.hp}/${e.max} · ATK ${e.attack} · GUARD ${e.guard}</p><button class="button mini alt" data-action="enemy">Attack patterns</button><div class="damageDealt" aria-live="polite">${transient.chips.map(c=>`<span class="chip" style="color:${c.color}">${esc(c.text)}${c.text.startsWith('−')?' DAMAGE DEALT':''}</span>`).join('')}</div></div>${transient.weapon>=0?`<img class="strike" src="${img('Weapon-'+hero(transient.weapon).art+'.png')}" alt="">`:''}</article></div>${state.phase==='over'?`<div class="panel panelpad" style="margin-top:16px"><span class="eyebrow">Your guild record</span><h3>Enter a name for the high scores</h3><div class="actions"><input id="scoreName" class="nameInput" maxlength="30" autocomplete="nickname" placeholder="Your name" value="${esc(state.playerName)}" ${state.scoreSent?'disabled':''}><button class="button" data-action="submit" ${state.scoreSent?'disabled':''}>${state.scoreSent?'SCORE SAVED':'SAVE SCORE'}</button><button class="button alt" data-action="reset">NEW RUN</button></div><p class="muted small">Scores are currently saved on this device.</p></div>`:''}<div class="battleFoot"><div class="panel panelpad"><span class="eyebrow">Battle record</span><div class="log" aria-live="polite">${state.log.slice(0,8).map(line=>`<p>${esc(line)}</p>`).join('')}</div></div><div class="panel panelpad"><span class="eyebrow">How to play</span><div class="detail"><strong>Tap a hero</strong> to read all eight skills and their cooldowns.<br><strong>Auto/Manual</strong> switches between watching and choosing each action. Pause to inspect gear or use the forge and church.<br><strong>After victory</strong>, inspect the loot and choose when to fight next.<br><strong>Bosses</strong> bring fruit and a gem. Each world has bosses at encounters 10 and 20 in Survival and Campaign.</div></div></div></section>`;}
function modalFrame(title,body){return `<div class="overlay" id="overlay"><section class="panel panelpad modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modalHead"><div><span class="eyebrow">Guild of First Light</span><h2>${esc(title)}</h2></div><button class="button alt" data-action="close">CLOSE ✕</button></div>${body}</section></div>`;}
function storyModal(){
  const world=campaignData.worlds[state.world]||{name:'Earth',first:0,after:3};
  const chapters=campaignData.chapters.slice(world.first,world.after);
  return modalFrame(`${world.name} · The Book of Sarko`,
    `<div class="storyLead"><img src="${img('World-'+world.name[0]+world.name.slice(1).toLowerCase()+'.jpg')}" alt="${esc(world.name)} world"><div><span class="eyebrow">World ${state.world+1} of 7 · ${DIFFICULTIES[state.difficulty]}</span><h3>Walk the story with Sarko</h3><p>Read or listen to these chapters before the next twenty stages. Stages 10 and 20 face bosses from this world.</p></div></div>`+
    `<div class="storyChapters">${chapters.map((chapter,i)=>{const n=world.first+i+1;return `<article class="storyChapter"><span class="eyebrow">Chapter ${n}</span><h3>${esc(chapter.title)}</h3><p>${esc(chapter.summary)}</p><details><summary>Read the full chapter</summary><p class="chapterText">${esc(chapter.text)}</p></details><audio controls preload="none" src="assets/story/Chapter-${String(n).padStart(2,'0')}-Full.mp3" aria-label="Listen to chapter ${n}"></audio></article>`;}).join('')}</div>`+
    `<div class="actions"><button class="button" data-action="continueStory">${state.awaiting?'ENTER NEXT WORLD':'BEGIN WORLD'}</button></div>`);
}
function continueStory(){modal='';if(state.pendingStory){state.pendingStory=false;if(state.awaiting&&state.phase==='battle')spawnEnemy();else state.paused=false;}save();render();}
function sceneModal(){
  const scene=state.pendingScene;if(!scene)return '';
  const world=campaignData.worlds[scene.world]||{name:'EARTH',first:0,after:1};
  const beat=[5,10,15].indexOf(scene.stage),chapter=Math.min(world.after,world.first+beat+1);
  const voices=CAMPAIGN_SCENES[scene.world]||[];
  const portrait=name=>name==='Malachar'?'Boss-Malachar.jpg':name==='Rex Draconum'?'Boss-RexDraconum.jpg':name==='Isaac'?'Magnar.jpg':`${name}.jpg`;
  return modalFrame(`${world.name} · Stage ${scene.stage} story`,
    `<div class="storyLead"><img src="${img('World-'+world.name.toLowerCase().replace(/^./,c=>c.toUpperCase())+'.jpg')}" alt="${esc(world.name)} world"><div><span class="eyebrow">The journey continues</span><h3>${esc(campaignData.chapters[chapter-1]?.title||'The Book of Sarko')}</h3><p>${esc(campaignData.chapters[chapter-1]?.summary||'The team presses onward together.')}</p></div></div>`+
    `<div class="storyVoices">${voices.map(line=>`<div class="storyVoice"><img src="${img(portrait(line.speaker))}" alt="${esc(line.speaker)}"><div><strong>${esc(line.speaker)}</strong><p>${esc(line.text)}</p></div></div>`).join('')}</div>`+
    `<p class="muted small">These lines adapt the chapter. Listen to the full ElevenLabs narration below.</p><audio controls preload="none" src="assets/story/Chapter-${String(chapter).padStart(2,'0')}-Full.mp3" aria-label="Listen to chapter ${chapter}"></audio>`+
    `<div class="actions"><button class="button" data-action="continueScene">CONTINUE TO STAGE ${scene.stage+1}</button></div>`);
}
function continueScene(){state.pendingScene=null;modal='';if(state.awaiting&&state.phase==='battle')spawnEnemy();save();render();}
function tabs(){const ids=state.phase==='selection'?state.chosen:state.chosen;return `<div class="heroTabs">${ids.map(id=>`<button class="button mini ${selectedHero===id?'active':'alt'}" data-action="heroTab" data-id="${id}">${hero(id).name}</button>`).join('')}</div>`;}
function detailsModal(id){const h=hero(id),skills=data.skills[id===7?'Magnar':h.name]||[];return modalFrame(`${h.name} · skills`,`${tabs()}<div class="summary"><span>HP <b>${h.hp}</b></span><span>ATK <b>${h.attack}</b></span><span>DEF <b>${h.defense}</b></span><span>HEAL <b>${h.healing}</b></span><span>CRIT <b>${Math.round(h.crit*100)}%</b></span></div><p class="muted">${esc(h.role)} · Tap a skill to read it. In Manual mode, pick a ready skill or Basic Attack on each hero's turn.</p><div class="skillGrid">${skills.map((s,i)=>`<div class="skill"><img src="${img('Skill-'+id+'-'+i+'.png')}" alt=""><div><strong>${esc(s.name)}</strong><p>${esc(s.description)}</p><span class="eyebrow small">Rank ${rankFor(id,i)} · ${cooldown(id,i)} turn cooldown</span></div></div>`).join('')}</div>`);}
function scoresModal(){return modalFrame('High scores',`<p class="muted">Local rankings on this device. Shared online rankings need a durable score database.</p><div class="rankings">${state.scores.length?state.scores.map((s,i)=>`<div class="shopItem"><span class="eyebrow">#${i+1}</span><div class="grow"><strong>${esc(s.name)}</strong><div class="small muted">${esc(s.team)} · ${esc(s.date)}</div></div><strong>${s.cleared} cleared</strong></div>`).join(''):'<div class="empty">No scores yet. Your first run can set the record.</div>'}</div>`);}
function filesModal(){return modalFrame('Save files',`<p class="muted">Your game saves automatically in this browser. Choose a file to switch runs. Download a backup to keep a copy or move it to another device.</p><div class="saveSlots">${saveFiles.slots.map((slot,i)=>`<div class="saveSlot ${i===saveFiles.active?'current':''}"><div class="saveSlotHead"><span class="eyebrow">File ${i+1}${i===saveFiles.active?' · Active':''}</span><span class="small muted">${slot?new Date(slot.state.savedAt||Date.now()).toLocaleString():'Empty'}</span></div>${slot?`<input id="fileName${i}" class="nameInput" maxlength="30" value="${esc(slot.name)}" aria-label="Name for file ${i+1}"><p class="small muted">${slot.state.phase==='selection'?'Choosing heroes':slot.state.phase==='over'?'Run finished':'Wave '+(slot.state.cleared+1)} · ${slot.state.cleared||0} defeated · ${slot.state.chosen.map(id=>hero(id)?.name).filter(Boolean).join(', ')||'No team yet'}</p>`:'<strong>Empty file</strong>'}<div class="actions">${slot?`<button class="button mini ${i===saveFiles.active?'active':'alt'}" data-action="switchFile" data-index="${i}" ${i===saveFiles.active?'disabled':''}>${i===saveFiles.active?'CURRENT FILE':'SWITCH TO FILE'}</button><button class="button mini alt" data-action="renameFile" data-index="${i}">RENAME</button><button class="button mini alt" data-action="downloadFile" data-index="${i}">DOWNLOAD BACKUP</button><button class="button mini danger" data-action="deleteFile" data-index="${i}">DELETE</button>`:`<button class="button mini" data-action="switchFile" data-index="${i}">CREATE FILE</button>`}<button class="button mini alt" data-action="chooseImport" data-index="${i}">IMPORT BACKUP</button><input id="fileImport${i}" class="fileImport" type="file" accept=".json,application/json" data-import-slot="${i}" aria-label="Import backup into file ${i+1}"></div></div>`).join('')}</div><p class="small muted">Files stay on this device in this browser. Private browsing or clearing site data can erase them.</p>`);}
function shopOffers(){
  let seed=71411+(state.shopRevision||0)*7919;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const prices=[80,150,280,520,950];
  return Array.from({length:10},()=>{
    const roll=random(),tier=roll<.52?0:roll<.80?1:roll<.94?2:roll<.99?3:4;
    return {name:FRUITS[Math.floor(random()*FRUITS.length)],rarity:RARITIES[tier],price:prices[tier],bonus:.05+tier*.025};
  });
}
function shopModal(){const offers=shopOffers();return modalFrame('First Light fruit merchant',`<div class="shopItem"><img src="${img('Guild-Shop.jpg')}" alt=""><div class="grow"><strong>Ten Spirit Fruit offers · shared by Survival and Campaign</strong><div class="small muted">Arena gold ${state.gold} · Stock ${state.shopRevision} · Purchases stay in the arena inventory.</div></div><button class="button mini" data-action="refresh" ${state.gold<100?'disabled':''}>REFRESH 100</button></div><div class="shopGrid" style="margin-top:14px">${offers.map((o,i)=>`<div class="shopItem">${fruitIcon(o.name)}<div class="grow"><strong>${o.rarity} ${o.name} Fruit</strong><div class="small muted">${esc(fruitStat(o))}</div></div><button class="button mini" data-action="buy" data-index="${i}" ${state.phase==='selection'||state.shopBought.includes(i)||state.gold<o.price?'disabled':''}>${state.shopBought.includes(i)?'SOLD':o.price+' GOLD'}</button></div>`).join('')}</div>`);}
function forgeModal(){const fruit=state.inventory.filter(g=>g.kind==='Fruit'),gems=state.inventory.filter(g=>g.kind==='Gem'),target=state.inventory[selectedGear],gem=state.inventory[selectedGem];return modalFrame('First Light forge',`<div class="shopItem"><img src="${img('Guild-Forge.jpg')}" alt=""><div><strong>Merge five matching fruits or socket a gem.</strong><div class="small muted">Gold ${state.gold} · Fruit ${fruit.length} · Gems ${gems.length}</div></div></div><div class="sectionHead"><h3>Spirit fruits</h3><span class="muted small">Select a fruit to merge or socket. Use Fruit Tree to equip it.</span></div><div class="inventory">${fruit.length?fruit.map(g=>{const ix=state.inventory.indexOf(g);return `<button class="shopItem cardbutton ${selectedGear===ix?'active':''}" data-action="selectGear" data-index="${ix}">${fruitIcon(g.name)}<div class="grow"><strong>${esc(g.rarity)} ${esc(g.name)} Fruit</strong><div class="small muted">${esc(fruitStat(g))} · ${g.equippedTo===null?'Unequipped':'Equipped by '+hero(g.equippedTo).name}${g.gem?' · Gem socketed':''}</div></div></button>`;}).join(''):'<div class="empty">No fruit yet. Defeat foes or visit the shop.</div>'}</div><div class="sectionHead"><h3>Gems</h3></div><div class="inventory">${gems.length?gems.map(g=>{const ix=state.inventory.indexOf(g);return `<button class="shopItem cardbutton ${selectedGem===ix?'active':''}" data-action="selectGem" data-index="${ix}"><img src="${img('Guild-Gem.jpg')}" alt=""><div class="grow"><strong>${esc(g.rarity)} ${esc(g.name)}</strong><div class="small muted">${g.socketedTo?'Socketed':'Ready to socket'}</div></div></button>`;}).join(''):'<div class="empty">Bosses always drop a gem.</div>'}</div><div class="actions"><button class="button" data-action="merge" ${!target||target.kind!=='Fruit'?'disabled':''}>MERGE FIVE MATCHING</button><button class="button alt" data-action="socket" ${!target||!gem||target.gem||gem.socketedTo?'disabled':''}>SOCKET GEM</button><button class="button alt" data-action="unsocket" ${!target?.gem?'disabled':''}>UNSOCKET</button><button class="button alt" data-action="modal" data-modal="tree">GO TO FRUIT TREE →</button></div><p class="muted small">Merging costs 120 gold and consumes four extra fruits of the same name and rarity. Socketing costs 60 gold.</p>`);}
function churchModal(){const id=state.chosen.includes(selectedHero)?selectedHero:state.chosen[0]??0,skills=data.skills[id===7?'Magnar':hero(id).name]||[];return modalFrame('Church of First Light',`<div class="shopItem"><img src="${img('Guild-Church.jpg')}" alt=""><div><strong>Train the gifts of your heroes.</strong><div class="small muted">Team skill points ${state.points} · Gold ${state.gold} · One point every two victories.</div></div></div>${tabs()}<div class="skillGrid">${skills.map((s,i)=>{const rank=rankFor(id,i),cost=skillUpgradeCost(i,rank);return `<div class="skill"><img src="${img('Skill-'+id+'-'+i+'.png')}" alt=""><div><strong>${esc(s.name)}</strong><p>${esc(s.description)}</p><span class="eyebrow small">Rank ${rank}/5 · ${cooldown(id,i)} turn cooldown</span></div><button class="button mini" data-action="upgrade" data-id="${id}" data-index="${i}" ${rank>=5||state.points<1||state.gold<cost?'disabled':''}>${rank>=5?'MAX':cost+' GOLD'}</button></div>`;}).join('')}</div>`);}
function treeModal(){
  const id=state.chosen.includes(selectedHero)?selectedHero:state.chosen[0]??0;
  const fruit=state.inventory.filter(g=>g.kind==='Fruit');
  const available=fruit.filter(g=>g.equippedTo===null);
  const equipped=fruit.filter(g=>g.equippedTo===id);
  const others=fruit.filter(g=>g.equippedTo!==null&&g.equippedTo!==id);
  const fruitRow=g=>{const ix=state.inventory.indexOf(g);return `<div class="shopItem fruitRow">${fruitIcon(g.name)}<div class="grow"><strong>${esc(g.rarity)} ${esc(g.name)}</strong><div class="fruitStat">${esc(fruitStat(g))}</div><div class="small muted">${g.gem?'Gem socketed · ':''}${g.equippedTo===null?'Unequipped':'Equipped by '+hero(g.equippedTo).name}</div></div>${g.equippedTo===null?'':`<img class="wearerHead" src="${img(hero(g.equippedTo).art+'.jpg')}" alt="${hero(g.equippedTo).name}'s head">`}<button class="button mini" data-action="equip" data-id="${id}" data-index="${ix}">${g.equippedTo===id?'REMOVE':'EQUIP'}</button></div>`;};
  return modalFrame(`${hero(id).name} · fruit tree`,
    `<div class="treeHero"><img class="heroHead" src="${img(hero(id).art+'.jpg')}" alt="${hero(id).name}"><div class="grow"><span class="eyebrow">Equipping now</span><h3>${hero(id).name}</h3><p class="small muted">Choose another hero below. Each hero can equip one fruit of each kind.</p></div><button class="button mini" data-action="unequipAll" data-id="${id}" ${equipped.length?'':'disabled'}>REMOVE ALL FRUIT</button></div>${tabs()}`+
    `<div class="sectionHead"><h3>Unequipped fruit · ${available.length}</h3><span class="small muted">Tap EQUIP to place a fruit on ${hero(id).name}'s tree.</span></div><div class="inventory">${available.length?available.map(fruitRow).join(''):'<div class="empty">No unequipped fruit. Win battles or visit the shop.</div>'}</div>`+
    `<div class="sectionHead"><h3>Fruit of the Spirit tree</h3></div><div class="spiritTree" role="group" aria-label="${hero(id).name}'s Fruit of the Spirit tree">${FRUITS.map((name,i)=>{const g=equipped.find(x=>x.name===name),[left,top]=TREE_POSITIONS[i];return `<div class="spiritBranch ${g?'filled':'empty'}" style="left:${left}%;top:${top}%" title="${esc(name)}${g?' · '+esc(fruitStat(g)):' · empty'}">${g?fruitIcon(name):''}<span class="spiritBranchName">${esc(name)}</span></div>`;}).join('')}</div><p class="muted small">Each branch names its fruit. The picture appears only when equipped; its bonus is listed below.</p>`+
    `<div class="gearSlots">${FRUITS.map(name=>{const g=equipped.find(x=>x.name===name);return `<div class="gearSlot">${g?fruitIcon(name):'<span class="emptyFruit">+</span>'}<div><strong>${name}</strong><div class="small muted">${g?`${esc(g.rarity)} · ${esc(fruitStat(g))}`:'Empty branch'}</div></div></div>`;}).join('')}</div>`+
    `<div class="sectionHead"><h3>Equipped by ${hero(id).name}</h3></div><div class="inventory">${equipped.length?equipped.map(fruitRow).join(''):'<div class="empty">No fruit equipped yet.</div>'}</div>`+
    `${others.length?`<div class="sectionHead"><h3>Equipped by other heroes</h3></div><div class="inventory">${others.map(fruitRow).join('')}</div>`:''}`);
}
function enemyModal(){const e=state.enemy;return modalFrame(e.name,`<div class="shopItem"><img src="${img(enemyArt(e))}" alt=""><div><strong>Level ${e.level} · HP ${e.hp}/${e.max}</strong><p>Attack ${e.attack} · Guard ${e.guard}</p><span class="eyebrow">Attack patterns</span><p>${e.moves.map(esc).join(' · ')}</p><p class="muted">The monster deck reshuffles after all families appear.</p></div></div>`);}
function forgeModalV2(){
  const fruit=state.inventory.filter(g=>g.kind==='Fruit'),gems=state.inventory.filter(g=>g.kind==='Gem');
  const target=state.inventory[selectedGear],gem=state.inventory[selectedGem];
  return modalFrame('First Light forge',
    `<div class="forgeGuide"><img src="${img('Guild-Forge.jpg')}" alt=""><div><h3>Fit a gem into a fruit</h3><p>Choose a gem, then tap SOCKET on a fruit below. Gems add the shown bonus to that hero while the fruit is equipped. Socketing costs 60 gold.</p><p class="eyebrow">Gold ${state.gold} · ${fruit.length} fruit · ${gems.filter(g=>!g.socketedTo).length} available gems</p></div></div>`+
    `<div class="forgeColumns"><section><h3>1 · Choose a gem</h3><div class="inventory">${gems.filter(g=>!g.socketedTo).length?gems.filter(g=>!g.socketedTo).map(g=>{const i=state.inventory.indexOf(g);return `<button class="shopItem cardbutton ${selectedGem===i?'active':''}" data-action="selectGem" data-index="${i}"><img src="${img('Guild-Gem.jpg')}" alt=""><div class="grow"><strong>${esc(g.rarity)} ${esc(g.name)}</strong><div class="small muted">${esc(gemStat(g))}</div></div><span>${selectedGem===i?'SELECTED':'CHOOSE'}</span></button>`;}).join(''):'<div class="empty">Defeat a boss to find a gem.</div>'}</div></section>`+
    `<section><h3>2 · Choose a fruit slot</h3><div class="inventory">${fruit.length?fruit.map(g=>{const i=state.inventory.indexOf(g),socketed=state.inventory.find(x=>x.id===g.gem);return `<div class="shopItem">${fruitIcon(g.name)}<div class="grow"><strong>${esc(g.rarity)} ${esc(g.name)} Fruit</strong><div class="small muted">${esc(fruitStat(g))}${socketed?` · ${esc(socketed.name)}`:''}</div></div><button class="button mini" data-action="socketInto" data-index="${i}" ${g.gem||!gem||state.gold<60?'disabled':''}>${g.gem?'FILLED':'SOCKET'}</button><button class="button mini alt" data-action="selectGear" data-index="${i}">SELECT</button></div>`;}).join(''):'<div class="empty">Win a chest or buy fruit in the shop.</div>'}</div></section></div>`+
    `<div class="forgeActions"><div><strong>Selected fruit:</strong> ${target?.kind==='Fruit'?esc(target.name):'None'} · <strong>Selected gem:</strong> ${gem?.kind==='Gem'?esc(gem.name)+' ('+esc(gemStat(gem))+')':'None'}</div><div class="actions"><button class="button" data-action="merge" ${!target||target.kind!=='Fruit'?'disabled':''}>MERGE FIVE MATCHING · 120 GOLD</button><button class="button alt" data-action="unsocket" ${!target?.gem?'disabled':''}>REMOVE GEM FROM SELECTED FRUIT</button><button class="button alt" data-action="modal" data-modal="tree">GO TO FRUIT TREE</button></div></div>`);
}
function socketInto(index){selectedGear=index;socket();}
function renderModal(){if(!modal)return '';if(modal==='story')return storyModal();if(modal==='scene')return sceneModal();if(modal==='files')return filesModal();if(modal==='scores')return scoresModal();if(modal==='shop')return shopModal();if(modal==='forge')return forgeModalV2();if(modal==='church')return churchModal();if(modal==='tree')return treeModal();if(modal==='details')return detailsModal(selectedHero);if(modal==='enemy')return enemyModal();return '';}
function render(){const app=$('#app');app.innerHTML=`<main class="shell">${header()}${state.phase==='selection'?selection():battle()}<footer class="footer">Sarko · Radiant Kingdom Studios · Free browser edition · Progress and scores are saved on this device.</footer></main>${renderModal()}`;}
function openModal(type){modal=type;if(state.phase==='battle'&&!state.awaiting)state.paused=true;save();render();}
function buy(index){if(state.phase!=='battle'||state.shopBought.includes(index))return;const offer=shopOffers()[index];if(!offer||state.gold<offer.price)return;state.gold-=offer.price;state.shopBought.push(index);state.inventory.push({id:newId(),kind:'Fruit',name:offer.name,rarity:offer.rarity,bonus:offer.bonus,equippedTo:null,gem:null});save();render();toast(`${offer.name} Fruit purchased.`);}
function merge(){const g=state.inventory[selectedGear];if(!g||g.kind!=='Fruit')return;const matches=state.inventory.filter(x=>x.kind==='Fruit'&&x.id!==g.id&&x.name===g.name&&x.rarity===g.rarity&&x.equippedTo===null);const tier=RARITIES.indexOf(g.rarity);if(matches.length<4)return toast('Five matching fruits are needed.');if(tier>=RARITIES.length-1)return toast('Already legendary.');if(state.gold<120)return toast('Need 120 gold.');state.gold-=120;const used=new Set(matches.slice(0,4).map(x=>x.id));state.inventory=state.inventory.filter(x=>!used.has(x.id));g.rarity=RARITIES[tier+1];g.bonus=Math.round((g.bonus+.04)*100)/100;save();render();toast(`${g.name} Fruit became ${g.rarity}.`);}
function socket(){const g=state.inventory[selectedGear],gem=state.inventory[selectedGem];if(!g||!gem||g.kind!=='Fruit'||gem.kind!=='Gem'||g.gem||gem.socketedTo)return;if(state.gold<60)return toast('Need 60 gold.');state.gold-=60;g.gem=gem.id;gem.socketedTo=g.id;save();render();toast('Gem socketed into fruit.');}
function unsocket(){const g=state.inventory[selectedGear];if(!g?.gem)return;const gem=state.inventory.find(x=>x.id===g.gem);if(gem)gem.socketedTo=null;g.gem=null;save();render();toast('Gem removed.');}
function equip(id,index){const g=state.inventory[index];if(!g||g.kind!=='Fruit')return;if(state.phase==='battle'&&state.fighters.some(f=>f.id===id&&f.hp===0))return toast('A fallen hero cannot equip fruit until the next run.');if(g.equippedTo===id)g.equippedTo=null;else{for(const x of state.inventory)if(x.kind==='Fruit'&&x.name===g.name&&x.equippedTo===id)x.equippedTo=null;g.equippedTo=id;}for(const f of state.fighters){const max=fighterStats(f).max;f.hp=Math.min(f.hp,max);}save();render();}
function unequipAll(id){for(const g of state.inventory)if(g.kind==='Fruit'&&g.equippedTo===id)g.equippedTo=null;for(const f of state.fighters){const max=fighterStats(f).max;f.hp=Math.min(f.hp,max);}save();render();toast(`All fruit removed from ${hero(id).name}.`);}
function upgrade(id,index){const rank=rankFor(id,index),cost=skillUpgradeCost(index,rank);if(rank>=5||state.points<1||state.gold<cost)return;state.points--;state.gold-=cost;state.ranks[`${id}-${index}`]=(state.ranks[`${id}-${index}`]||0)+1;save();render();toast(`${skillFor(id,index).name} upgraded.`);}
document.addEventListener('click',event=>{const button=event.target.closest('[data-action]');if(!button)return;const a=button.dataset.action,id=Number(button.dataset.id),index=Number(button.dataset.index);if(a==='pick')pickHero(id);else if(a==='mode')toggleMode();else if(a==='view')toggleView();else if(a==='basic')chooseManual(-1);else if(a==='manualSkill')chooseManual(index);else if(a==='start')startRun();else if(a==='startCampaign')startRun('campaign');else if(a==='difficulty'){if(index<=state.unlockedDifficulty){state.difficulty=index;save();render();}}else if(a==='continueStory')continueStory();else if(a==='continueScene')continueScene();else if(a==='pause'){state.paused=!state.paused;save();render();}else if(a==='next')nextFight();else if(a==='reset')resetRun();else if(a==='submit')submitScore();else if(a==='modal')openModal(button.dataset.modal);else if(a==='close'){if(modal==='story')continueStory();else if(modal==='scene')continueScene();else{modal='';render();}}else if(a==='switchFile')switchFile(index);else if(a==='renameFile')renameFile(index);else if(a==='deleteFile')deleteFile(index);else if(a==='downloadFile')downloadFile(index);else if(a==='chooseImport')$(`#fileImport${index}`)?.click();else if(a==='details'){selectedHero=id;openModal('details');}else if(a==='heroTab'){selectedHero=id;render();}else if(a==='enemy')openModal('enemy');else if(a==='music')toggleMusic();else if(a==='buy')buy(index);else if(a==='refresh'){if(state.gold>=100){state.gold-=100;state.shopRevision++;state.shopBought=[];save();render();}}else if(a==='selectGear'){selectedGear=index;render();}else if(a==='selectGem'){selectedGem=index;render();}else if(a==='merge')merge();else if(a==='socket')socket();else if(a==='socketInto')socketInto(index);else if(a==='unsocket')unsocket();else if(a==='equip')equip(id,index);else if(a==='unequipAll')unequipAll(id);else if(a==='upgrade')upgrade(id,index);});
document.addEventListener('change',event=>{const input=event.target.closest('[data-import-slot]');if(input){importFile(Number(input.dataset.importSlot),input.files?.[0]);input.value='';}});
document.addEventListener('contextmenu',event=>{const card=event.target.closest('[data-action="details"]');if(card){event.preventDefault();selectedHero=Number(card.dataset.id);openModal('details');}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&modal){if(modal==='story')continueStory();else if(modal==='scene')continueScene();else{modal='';render();}}else if(event.key===' '&&state.phase==='battle'&&!modal){event.preventDefault();state.paused=!state.paused;save();render();}});
document.addEventListener('click',event=>{if(event.target?.id==='overlay'){if(modal==='story')continueStory();else if(modal==='scene')continueScene();else{modal='';render();}}});
if(globalThis.SarkoArena3D)globalThis.SarkoArena3D.onHeroClick=id=>{selectedHero=id;openModal('details');};
let padHeld=false;setInterval(()=>{const pad=navigator.getGamepads?.()?.find(Boolean);if(!pad)return;const pressed=pad.buttons[0]?.pressed;if(pressed&&!padHeld){const focused=document.activeElement;if(focused?.tagName==='BUTTON')focused.click();}padHeld=pressed;if(pad.buttons[1]?.pressed&&modal){modal='';render();}if(pad.buttons[12]?.pressed||pad.buttons[13]?.pressed){const all=[...document.querySelectorAll('button:not(:disabled)')];const at=all.indexOf(document.activeElement);all[(at+(pad.buttons[13]?.pressed?1:all.length-1))%all.length]?.focus();}},220);
Promise.all([fetch('data.json').then(r=>r.json()),fetch('campaign-data.json').then(r=>r.json())]).then(([skills,story])=>{data=skills;campaignData=story;render();}).catch(()=>{render();toast('Game data is loading.');});
setInterval(battleTick,1800);
render();
