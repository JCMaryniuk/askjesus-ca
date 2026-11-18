import {openPadKeyboard,closePadKeyboard,padKeyboardOpen} from './pad-keyboard.js';
const HEROES = [
  {name:'Sarko',art:'Sarko',role:'Guardian • healing',color:'#f0c568',hp:115,attack:22,defense:8,healing:0,faith:0,crit:0,resist:0},
  {name:'Levi',art:'Levi',role:'Sword • formation',color:'#70a8f6',hp:105,attack:28,defense:4,healing:0,faith:0,crit:0,resist:0},
  {name:'Waiz',art:'Waiz',role:'Twin blades • speed',color:'#96e7ca',hp:100,attack:26,defense:4,healing:0,faith:0,crit:0,resist:0},
  {name:'Diago',art:'Diago',role:'Heavy blade • mentor',color:'#f39a75',hp:135,attack:27,defense:7,healing:0,faith:0,crit:0,resist:0},
  {name:'Amaya',art:'Amaya',role:'Spear • precision',color:'#ffb679',hp:95,attack:26,defense:3,healing:0,faith:0,crit:0,resist:0},
  {name:'Naomi',art:'Naomi',role:'Crossbow • counsel',color:'#d0a5f5',hp:100,attack:19,defense:5,healing:0,faith:0,crit:0,resist:0},
  {name:'Hailey',art:'Hailey',role:'Bow • celestial',color:'#77d5ed',hp:85,attack:24,defense:2,healing:0,faith:0,crit:0,resist:0},
  {name:'Isaac',art:'Magnar',role:'Hammer • fortress',color:'#b9c6da',hp:160,attack:22,defense:12,healing:0,faith:0,crit:0,resist:0},
  {name:'Grace',art:'Grace',role:'Evangelist • longsword',color:'#ba79ec',hp:110,attack:24,defense:6,healing:14,faith:12,crit:.06,resist:.04}
];
const MONSTERS = ['AshhornStag','BriarClawBear','BrightCap','CrystalBackTortoise','DreadwingVulture','HollowWretch','Rockshade','Shadowthorn','StonehideRhino','Thornback','VineboundGuardian'];
const MONSTER_MOVES = {
  AshhornStag:['Antler Run','Antler Sweep'],BriarClawBear:['Hooking Claw','Mauling Rush'],BrightCap:['Cap Spring','Spore Burst'],
  CrystalBackTortoise:['Shell Turn','Crystal Tremor'],DreadwingVulture:['Dreadwing Dive','Wing Rake'],HollowWretch:['Twin Rake','Hunger Lunge'],
  Rockshade:['Stone Guard','Boulder Throw'],Shadowthorn:['Shadow Pounce','Thorn Burst'],
  StonehideRhino:['Horn Drive','Horn Toss'],Thornback:['Tusks','Boar Charge'],VineboundGuardian:['Rootfall','Vine Snare']
};
const BASIC_ATTACKS={AshhornStag:'Antler Jab',BriarClawBear:'Claw Swipe',BrightCap:'Cap Bump',CrystalBackTortoise:'Stone Bite',DreadwingVulture:'Beak Strike',HollowWretch:'Claw Strike',Rockshade:'Stone Fist',Shadowthorn:'Raking Swipe',StonehideRhino:'Horn Jab',Thornback:'Tusk Jab',VineboundGuardian:'Branch Strike',CorruptedWolf:'Fang Bite'};
const BOSSES = [
  {name:'Corrupted Wolf',type:'CorruptedWolf',moves:['Shadow Pounce','Raking Swipe','Dread Howl','Ravenous Lunge'],art:'Boss-CorruptedWolf.jpg'},
  {name:'Stoneheart Warden',type:'StonehideRhino',moves:['Horn Drive','Quaking Fist','Stone Guard','Boulder Throw'],art:'Boss-Stoneheart.jpg'},
  {name:'Tidebound Oracle',type:'CrystalBackTortoise',moves:['Shell Turn','Tidal Surge','Undertow','Crashing Wave'],art:'Boss-Tidebound.jpg'},
  {name:'Frostveil Warden',type:'AshhornStag',moves:['Antler Run','Whiteout Charge','Ice Lance','Frost Guard'],art:'Boss-Frostveil.jpg'},
  {name:'Stormwing Herald',type:'DreadwingVulture',moves:['Dreadwing Dive','Thunderstrike','Wing Rake','Tempest Burst']},
  {name:'Cinder Crown',type:'BriarClawBear',moves:['Hooking Claw','Cinder Breath','Molten Slam','Ember Guard']},
  {name:'Malachar',type:'Shadowthorn',moves:['Heavy Strike','Rush','Corruption Wave','Shadow Ward'],art:'Boss-Malachar.jpg'},
  {name:'Rex Draconum',type:'BriarClawBear',basicAttack:'Dragon Bite',moves:['Rex Claw','Dragon Breath','Tail Sweep','Royal Roar'],art:'Boss-RexDraconum.jpg'},
  {name:'Dawn Guardian',type:'VineboundGuardian',moves:['Rootfall','Radiant Judgment','Dawn Lance','Radiant Ward'],art:'Boss-DawnGuardian.jpg'}
];
const CAMPAIGN_BOSSES=[1,2,3,4,5,6,7];
const MIDWORLD_BOSSES=[
  BOSSES[0],
  {name:'Floodfang',type:'Thornback',moves:['Tusks','Tidal Surge','Undertow','Boar Charge']},
  {name:'Icewing',type:'DreadwingVulture',moves:['Dreadwing Dive','Whiteout Charge','Ice Lance','Wing Rake']},
  {name:'Thunderstone Colossus',type:'Rockshade',moves:['Boulder Throw','Thunderstrike','Stone Guard','Quaking Fist']},
  {name:'Ashhorn Inferno',type:'AshhornStag',moves:['Antler Run','Cinder Breath','Antler Sweep','Ember Guard']},
  BOSSES[0],
  BOSSES[8]
];
const WORLD_NAMES=['Earth','Water','Snow','Thunder','Fire','Shadow','Light'];
const ENEMY_AREA_SKILLS=['Spore Burst','Crystal Tremor','Thorn Burst','Rootfall','Quaking Fist','Tidal Surge','Whiteout Charge','Thunderstrike','Cinder Breath','Corruption Wave','Dragon Breath','Radiant Judgment','Dread Howl','Crashing Wave','Tempest Burst','Molten Slam','Tail Sweep','Royal Roar'];
const ENEMY_GUARD_SKILLS=['Stone Guard','Shell Turn','Frost Guard','Ember Guard','Shadow Ward','Radiant Ward'];
const ENEMY_HEAVY_SKILLS=['Heavy Strike','Rex Claw','Mauling Rush','Hunger Lunge','Ravenous Lunge','Ice Lance','Dawn Lance'];
function enemyKit(enemy){
  const boss=enemy.boss?[...BOSSES,...MIDWORLD_BOSSES].find(b=>b.name===(enemy.bossId||enemy.name.replace(/^BOSS · /,''))):null;
  return {skills:boss?.moves||MONSTER_MOVES[enemy.type]||enemy.moves||[],basic:boss?.basicAttack||BASIC_ATTACKS[enemy.type]||'Basic Attack'};
}
function syncEnemyKit(enemy){if(!enemy)return;const kit=enemyKit(enemy);enemy.moves=[...kit.skills];enemy.basicAttack=kit.basic;enemy.move=Math.max(0,Math.floor(enemy.move)||0);}
function nextEnemyAction(enemy){
  const kit=enemyKit(enemy),turn=enemy.move++;
  // One action per enemy turn. Alternate basic attacks with the full skill rotation.
  return turn%2===0||!kit.skills.length?{name:kit.basic,basic:true}:{name:kit.skills[Math.floor(turn/2)%kit.skills.length],basic:false};
}
function enemySkillDescription(name){return ENEMY_GUARD_SKILLS.includes(name)?'Guards itself: gains 2 defense for this encounter (up to +6).':ENEMY_AREA_SKILLS.includes(name)?'Hits every living hero for reduced damage.':ENEMY_HEAVY_SKILLS.includes(name)?'A heavy strike against one hero.':'A special strike against one hero.';}
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
const TREE_POSITIONS = [[50,17],[22,18],[78,18],[22,35],[50,35],[78,35],[22,52],[50,52],[78,52]];
const RARITIES = ['Common','Uncommon','Rare','Epic','Legendary'];
const MUSIC = ['assets/Main-Theme.mp3','assets/Journey-Toward-the-Light.mp3'];
const $ = s => document.querySelector(s);
const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const img = name => {const portraits={"Sarko.jpg":"hero-Sarko.jpg","Levi.jpg":"hero-Levi.jpg","Waiz.jpg":"hero-Waiz.jpg","Diago.jpg":"hero-Diago.jpg","Amaya.jpg":"hero-Amaya.jpg","Naomi.jpg":"hero-Naomi.jpg","Hailey.jpg":"hero-Hailey.jpg","Magnar.jpg":"hero-Isaac.jpg","Grace.jpg":"hero-Grace.jpg"};return portraits[name]?'assets/illustrations/'+portraits[name]:'assets/'+name;};
const fruitIcon = name => `<span class="fruitIcon" role="img" aria-label="${esc(name)} fruit" style="background-position:${FRUIT_POSITIONS[FRUITS.indexOf(name)]||'50% 50%'}"></span>`;
const gemEffect=g=>GEM_EFFECTS[g.name?.split(' ')[0]]||'Attack Power';
const fruitAttribute = g => FRUITS.includes(g.attribute)?g.attribute:g.name;
const fruitStat = g => `${fruitAttribute(g)==='Patience'?'−':'+'}${Math.round((g.bonus||0)*100)}% ${FRUIT_STATS[fruitAttribute(g)]||'Bonus'}${g.gem?` · ${gemStat(state.inventory.find(x=>x.id===g.gem))}`:''}`;
const gemStat=g=>g?`+${Math.round((g.bonus||.04)*100)}% ${gemEffect(g)}`:'No gem';
const enemyArt=e=>{const name=(e.boss?(e.bossId||e.name.replace(/^BOSS · /,'')):e.type).replace(/[^a-z0-9]/gi,'-');const aliases={'Corrupted-Wolf':'CorruptedWolf',Floodfang:'Thornback','Cinder-Crown':'BriarClawBear','Ashhorn-Inferno':'AshhornStag','Stormwing-Herald':'DreadwingVulture',Icewing:'DreadwingVulture'};return 'illustrations/'+(aliases[name]||name)+'.jpg';};
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
let threeManifest=null,threeView=null,threeHost=null,threeLoading=false,threeBusy=false,threePaused=false,threeEvents=[],threeFrame=null,threeVersion=0,threeFailure="";
const canUse3D=()=>threeManifest?.releaseReady===true;
function queue3D(event){if(state.malacharPhase==='hold'||state.rexPhase==='demonstration')for(const t of event.targets||[])if(t.enemy)t.defeated=false;if(threeView&&state.view3d)threeEvents.push(event);}
function close3D(){++threeVersion;threeView?.dispose();threeView=null;threeHost?.remove();threeHost=null;threeLoading=false;threeBusy=false;threeEvents=[];threeFrame=null;}
function fail3D(error){threeFailure=error.message||'The arena could not load.';state.paused=true;close3D();save();render();toast('Battle paused. Retry loading the 3D arena.');}
async function sync3D(){
  const slot=$('#battle3d');
  if(threeFailure||modal==='opening'||modal==='guildParty'){threeView?.setPaused(true);return;}
  if(!state.view3d||!canUse3D()||!slot){if(threeView||threeHost)close3D();return;}
  slot.setAttribute('aria-busy',threeLoading||!threeHost?'true':'false');
  if(threeHost){slot.append(threeHost);threeView?.setPaused(threeBusy?threePaused:state.paused||!!modal);return;}
  const version=++threeVersion;threeLoading=true;threeHost=document.createElement('div');threeHost.className='battle3dStage';slot.append(threeHost);
  try{
    const {Game3DView}=await import('./rpg3d-view.js');if(version!==threeVersion)return;
    threeView=new Game3DView(threeHost,threeManifest,{onSelect:key=>{if(threeBusy)return;const id=Number(key.replace('hero-',''));if(key.startsWith('hero-')){selectedHero=id;openModal('details');}},onError:message=>{if(version===threeVersion)fail3D(Error(message));}});
    await threeView.setBattle({key:state.battleId||state.enemy.name,heroes:state.fighters.map(f=>({id:f.id,name:hero(f.id).name,defeated:f.hp<=0})),enemy:state.enemy.boss?(state.enemy.bossId||state.enemy.name.replace(/^BOSS · /,'')):state.enemy.type,enemyDefeated:state.enemy.hp<=0,world:WORLD_NAMES[state.enemy.world??0],chapterStage:state.mode==='campaign'?state.worldStage+1:state.regular+1,storyBattle:!!(state.malacharPhase||state.rexPhase)});
    if(version!==threeVersion)return;threeLoading=false;$('#battle3d')?.setAttribute('aria-busy','false');threeView.setPaused(state.paused||!!modal);
  }catch(error){if(version===threeVersion)fail3D(error);}
}
function finishBattleTurn(){
  if(typeof coopRuntime!=='undefined'&&coopRuntime&&coopLeader())coopRuntime.events.push(...structuredClone(threeEvents));
  save();
  if(!threeView||!state.view3d||!threeEvents.length){render();return;}
  const events=threeEvents;threeEvents=[];threeBusy=true;threePaused=false;const version=threeVersion;
  threeView.present(events).then(()=>{if(version!==threeVersion)return;threeBusy=false;threeFrame=null;if(threePaused)state.paused=true;threePaused=false;save();render();}).catch(error=>{if(version===threeVersion)fail3D(error);});
}
function pauseBattle(){if(helpBlocked()){modal="help";render();return;}if(threeBusy){threePaused=!threePaused;threeView?.setPaused(threePaused);}else{state.paused=!state.paused;save();}render();}

const STORY_OPENING = {
 wake:{title:'Awakening · A new beginning',art:'assets/book/chapter-01.jpg',lines:[['Sarko','Where am I? The storm... I thought the water would never end.','worried'],['Waiz','Hello! My name is Waiz. You are safe in First Light. Take a breath.','warm'],['Sarko','This room, this armour... is all of this really for me?','wonder'],['Waiz','Yes. But nobody walks this new road alone. Your team will need you, and you will need them.','warm']]},
 training:{title:'Beyond the eastern gate',art:'assets/book/training.jpg',lines:[['Diago','I am Diago. A Shepherd protects the others. Today you learn by standing beside us.','serious'],['Waiz','And I will try not to call all my screaming tactical enthusiasm.','amused'],['Diago','Watch whose turn it is. Use a basic attack, or choose a ready skill. Healing keeps a companion in the fight.','serious'],['Sarko','Then we begin together.','determined']]},
 guild:{title:'The Guild of First Light',art:'assets/book/guild.jpg',lines:[['Waiz','Home at last! Everyone, meet Sarko. He survived Diago’s training. Mostly.','amused'],['Amaya','Surviving is a beginning. I am Amaya. My spear will hold the flank.','confident'],['Isaac','Shield brother! Isaac. When the road gets rough, stand beside me.','warm'],['Hailey','I am Hailey. My bow can reach the threats you cannot. You can count on me.','warm'],['Naomi','I am Naomi. I carry a crossbow, but listening is also part of protecting our friends.','gentle'],['Grace','Grace. An evangelist’s courage means little unless it helps someone else stand. My sword is with you.','confident'],['Diago','Choose your companions for the road. Speak, listen, and make room for their gifts.','serious']]},
 garden:{title:'The Hidden Garden',art:'assets/book/garden.jpg',lines:[['Sarko','We helped mend their fences, and somehow this little garden feels greater than a victory.','wonder'],['Naomi','Be still. We are not alone here.','wonder'],['Angel','Bearer of restoration. Those who walk in unity may receive what lies within. Remain as one.','gentle'],['Diago','Evolution shards. A gift entrusted to the whole company, not a prize for one champion.','serious'],['Sarko','Then we share it. Whatever waits ahead, nobody carries it alone.','determined']]},
 malachar:{title:'A shadow at the guild',art:'assets/book/malachar.jpg',lines:[['Malachar','So... Heaven chose another. Tell me, Shepherd: how long before your light breaks?','menacing'],['Sarko','You will not take them. Everyone, stay together!','determined'],['Diago','He is stronger than us. Protect each other and hold the line. We need time.','serious']]},
 levi:{title:'The Apostle arrives',art:'assets/book/levi.jpg',lines:[['Naomi','He is here.','hopeful'],['Levi','I leave for one supply run, and you nearly destroy headquarters.','amused'],['Waiz','For the record, the evil panther started it.','amused'],['Levi','Formation seven. Sarko and Isaac, hold the front. Watch for my signal. Now—together!','determined']]},
 aftermath:{title:'One road together',art:'assets/book/guild.jpg',lines:[['Malachar','When we meet again, I will not be alone.','angry'],['Levi','You lost the moment you came alone.','serious'],['Sarko','I could not have done that by myself.','relieved'],['Levi','You were never asked to. Take your companions. The road beyond First Light is waiting.','warm']]}
};
function storyFighter(id){const old=state.fighters.find(f=>f.id===id);return old||{id,level:1,xp:0,hp:HEROES[id].hp,ward:false,nextSkill:0,last:Array(8).fill(-100),cooldownSavings:Array(8).fill(0)};}
function beginOpeningScene(key){state.openingScene=key;state.openingPage=0;state.paused=true;modal='opening';save();}

const BOOK_FACES={wake:{Sarko:[.245,.22,.17],Waiz:[.755,.12,.13]},training:{Sarko:[.425,.15,.13],Waiz:[.82,.10,.12],Diago:[.15,.015,.15]},guild:{Sarko:[.075,.27,.15],Waiz:[.21,.33,.14],Diago:[.29,.065,.14],Amaya:[.43,.20,.12],Naomi:[.615,.24,.12],Hailey:[.50,.45,.13],Isaac:[.70,.37,.14],Grace:[.80,.21,.15]},garden:{Sarko:[.35,.34,.15],Naomi:[.06,.29,.12],Diago:[.29,.18,.14],Angel:[.66,.035,.12]},malachar:{Sarko:[.18,.27,.13],Diago:[.09,.17,.13],Malachar:[.75,.09,.13]},levi:{Levi:[.47,.12,.11],Waiz:[.245,.29,.10],Naomi:[.615,.24,.12]},aftermath:{Malachar:[.85,.29,.10],Levi:[.47,.12,.11],Sarko:[.14,.22,.11]}};
Object.assign(BOOK_FACES,{"repairs":{"Sarko":[0.045,0.23,0.09],"Waiz":[0.31,0.41,0.095],"Diago":[0.31,0.21,0.09],"Amaya":[0.45,0.39,0.085],"Naomi":[0.79,0.17,0.08],"Hailey":[0.78,0.54,0.09],"Isaac":[0.61,0.36,0.1],"Grace":[0.63,0.05,0.08]},"seeds":{"Sarko":[0.25,0.19,0.12],"Levi":[0.48,0.24,0.12]},"gardenInvite":{"Sarko":[0.36,0.39,0.1],"Levi":[0.48,0.38,0.09],"Naomi":[0.23,0.3,0.08],"Angel":[0.43,0.015,0.09],"Grace":[0.6,0.26,0.1]},"fractures":{"Sarko":[0.35,0.35,0.12],"Waiz":[0.22,0.24,0.11],"Hailey":[0.055,0.52,0.1],"Amaya":[0.2,0.49,0.08],"Levi":[0.53,0.29,0.09],"Isaac":[0.29,0.07,0.1],"Naomi":[0.06,0.13,0.1],"Malachar":[0.86,0.12,0.1]},"rexArrival":{"Rex":[0.68,0.04,0.13],"Malachar":[0.84,0.55,0.09],"Levi":[0.32,0.49,0.08],"Sarko":[0.14,0.47,0.09]},"breath":{"Hailey":[0.36,0.1,0.1],"Angel":[0.17,0.01,0.09],"Levi":[0.58,0.51,0.08],"Sarko":[0.43,0.47,0.08]},"kingLies":{"Rex":[0.75,0.03,0.13],"Sarko":[0.025,0.24,0.14],"Levi":[0.3,0.23,0.09],"Naomi":[0.37,0.15,0.1],"Isaac":[0.45,0.24,0.1],"Grace":[0.2,0.14,0.1]},"restoration":{"Sarko":[0.26,0.33,0.11],"Hailey":[0.36,0.52,0.09],"Grace":[0.53,0.44,0.11],"Rex":[0.78,0.24,0.1],"Levi":[0.45,0.1,0.09],"Waiz":[0.12,0.15,0.1],"Naomi":[0.19,0.12,0.08]},"cityWelcome":{"Jesus":[0.48,0.08,0.13],"Sarko":[0.4,0.27,0.11],"Levi":[0.04,0.09,0.1],"Waiz":[0.14,0.22,0.1],"Grace":[0.87,0.12,0.1]}});
const BOOK_FACE_ALIASES={firstLightView:"wake",meetDiago:"training","departure":"repairs","gardenGift":"gardenInvite","surrender":"fractures","rexAfter":"rexArrival","finalStand":"kingLies","rexDefeat":"restoration","cityGates":"cityWelcome","cityPurpose":"cityWelcome"};
function bookFace(scene,speaker,expression){let key=scene==='levi'&&speaker==='Naomi'?'guild':(BOOK_FACE_ALIASES[scene]||scene);if(!BOOK_FACES[key]?.[speaker]&&STORY_OPENING[scene]?.context)key=speaker==='Grace'?'restoration':speaker==='Rex'?'rexArrival':speaker==='Jesus'?'cityWelcome':'repairs';const rect=BOOK_FACES[key]?.[speaker];if(!rect)return '';const [x,y,w]=rect,h=w*1672/941;const art=scene==='aftermath'?'assets/book/levi.jpg':STORY_OPENING[key].art;return '<span class="bookFace" role="img" aria-label="'+esc(speaker+' · '+expression)+'" style="background-image:url('+art+');background-size:'+100/w+'% auto;background-position:'+x/(1-w)*100+'% '+y/(1-h)*100+'%"></span>';}

function openingModal(){
 const scene=STORY_OPENING[state.openingScene];if(!scene)return '';
 const page=Math.min(state.openingPage||0,scene.lines.length-1),[speaker,text,expression]=scene.lines[page];
 const id=HEROES.findIndex(h=>h.name===speaker),portrait=id>=0?img(HEROES[id].art+'.jpg'):scene.art;
 return modalFrame(scene.title,`${scene.context?`<p class="townNotice"><span class="eyebrow">Book chapter ${scene.chapter}</span><br>${esc(scene.context)}</p>`:''}<section class="narrativeScene" data-dialogue-next role="button" tabindex="0" aria-label="Continue dialogue"><img class="narrativeArt" src="${scene.art}" alt="${esc(scene.title)}"><div class="narrativeSpeech">${bookFace(state.openingScene,speaker,expression)||`<img src="${portrait}" alt="${esc(speaker)}">`}<div><span class="eyebrow">${esc(speaker)} · ${esc(expression)}</span><p>${esc(text)}</p></div></div><div class="dialoguePlayer" data-dialogue-audio="opening-${state.openingScene}-${page}"></div></section><p class="muted">${page+1} / ${scene.lines.length}</p><p class="controllerHint">Click the scene or press A to continue · B Previous line</p><div class="actions"><button class="button" data-action="openingNext">${page===scene.lines.length-1?'CONTINUE':'NEXT PAGE'}</button><button class="button ghost" data-action="openingSkip">SKIP SCENE</button></div>`);
}
function advanceOpening(skip=false){
 const key=state.openingScene,scene=STORY_OPENING[key];if(!scene)return;
 if(!skip&&(state.openingPage||0)<scene.lines.length-1){state.openingPage=(state.openingPage||0)+1;save();render();return;}
 state.openingScene=null;state.openingPage=0;modal='';
 if(bookAdvance(key)){save();render();return;}if(key==='wake')beginOpeningScene('training');
 else if(key==='training'){state.pendingStory=false;state.paused=false;state.guidedIntro=!skip;state.manual=!skip;}
 else if(key==='guild'){state.guildPicking=true;state.guildChosen=[0,2,3];modal='guildParty';}
 else if(key==='garden'){if(!state.gardenGift){state.gardenGift=true;state.points+=3;note('The garden’s shared gift: +3 skill points.');}beginOpeningScene('malachar');}
 else if(key==='malachar')startMalacharEncounter();
 else if(key==='levi'){state.malacharPhase='united';state.fighters.push(storyFighter(1));state.chosen=state.fighters.map(f=>f.id);state.fighters.forEach(f=>f.hp=fighterStats(f).max);state.enemy.hp=state.enemy.max=220;state.enemy.baseGuard=0;state.enemy.guard=0;state.enemy.attack=5;state.actor=0;state.paused=false;state.battleId=newId();note('Levi exposes Malachar’s weakness. The company is restored—strike together!');}
 else if(key==='aftermath'){state.malacharPhase=null;state.rexPhase='guild-rest';beginOpeningScene('repairs');}
 save();render();
}
function guildPartyModal(){return modalFrame('Choose your road companions',`<p class="controllerHint">Xbox: D-pad / stick to move · A to select or remove a hero · Choose four, then select Prepare for the road.</p><p>Choose four heroes for the journey. The whole guild will help during the coming attack.</p><p>${(state.guildChosen||[]).length} / 4 selected</p><div class="heroTabs">${HEROES.map((h,id)=>`<button class="button ${state.guildChosen?.includes(id)?'active':'alt'}" data-action="guildPick" data-id="${id}" ${id===1?'disabled':''}>${esc(h.name)}${id===1?' · away on supplies':''}</button>`).join('')}</div><button class="button" data-action="guildConfirm" ${state.guildChosen?.length===4?'':'disabled'}>PREPARE FOR THE ROAD</button>`);}
function startMalacharEncounter(){
 state.roadParty=[...state.chosen];state.fighters=HEROES.map((_,id)=>id).filter(id=>id!==1).map(storyFighter);state.chosen=state.fighters.map(f=>f.id);state.fighters.forEach(f=>f.hp=fighterStats(f).max);
 const b=BOSSES.find(b=>b.name==='Malachar');state.enemy={...b,boss:true,bossId:b.name,name:'BOSS · Malachar',world:0,level:12,hp:6000,max:6000,attack:42,guard:25,move:0};syncEnemyKit(state.enemy);state.enemy.baseGuard=25;
 state.malacharPhase='hold';state.malacharRounds=0;state.actor=0;state.turn=0;state.awaiting=false;state.paused=false;state.pendingStory=false;state.pendingScene=null;state.battleId=newId();note('Hold the line for three enemy turns. Malachar’s shadow restores him until help arrives.');
}
function guardMalachar(){if(state.malacharPhase==='hold'&&state.enemy.hp<1)state.enemy.hp=1;}
function malacharRound(){if(state.malacharPhase!=='hold')return;state.malacharRounds=(state.malacharRounds||0)+1;state.enemy.hp=state.enemy.max;state.fighters.forEach(f=>{if(f.hp<1)f.hp=1;});if(state.malacharRounds>=3)beginOpeningScene('levi');}
function openingAction(a,id){
 if(a==='openingNext'||a==='openingSkip'){advanceOpening(a==='openingSkip');return true;}
 if(a==='guildPick'){state.guildChosen=state.guildChosen||[];if(state.guildChosen.includes(id))state.guildChosen=state.guildChosen.filter(x=>x!==id);else if(id!==1&&state.guildChosen.length<4)state.guildChosen.push(id);save();render();return true;}
 if(a==='guildConfirm'&&state.guildChosen?.length===4){state.chosen=[...state.guildChosen];state.fighters=state.chosen.map(storyFighter);state.guildPicking=false;beginOpeningScene('malachar');render();return true;}
 return false;
}

// Deterministic encounters: saved offers never reroll when a menu is reopened.
const HELP_PEOPLE=[
 ['Mira','otter','A supper shared','The ferry workers gave their supper to a stranded family. Help me feed them before their night watch.','Thank you for noticing them. We will share what we can.'],
 ['Bram','badger','The broken doorstep','My elderly neighbour cannot cross her damaged doorstep. I promised she would not spend another day alone.','Let us repair it safely, and ask what else she needs.'],
 ['Tessa','fox','A delivery of hope','A courier fell ill while carrying supplies to a lonely household. Their letter says they think we have forgotten them.','We can finish the delivery and stay long enough to listen.'],
 ['Pippa','rabbit','An empty place at supper','A new family is afraid to join our table. I want to bring a meal to their door without embarrassing them.','Ask permission first. Kindness should leave them their dignity.'],
 ['Oren','stag','The weary carers','Our carers have worked through the night. They keep telling me other people need help more than they do.','Carers need care too. Let us make time for them.'],
 ['Selah','owl','Lessons by lamplight','Two apprentices stopped attending lessons because they were ashamed to ask for supplies.','Give them the supplies quietly. There is no shame in learning.'],
 ['Alder','beaver','A promise across the river','Two neighbours quarrelled over a damaged crossing. I want to repair it before anger becomes a lasting wall.','We will help both households, without taking sides.'],
 ['Nell','mouse','A welcome worth keeping','A traveller lost her belongings. She offered her last coin for a place to sleep, but I want her to feel welcome.','Let her keep her coin. We can help her start again.'],
 ['Hollis','bear','The overlooked workers','The harvest celebration is ready, but nobody remembered the workers who stayed behind to guard the orchard.','Take their share to them. Their service matters.'],
 ['Edda','wolf','A quiet apology','I accused a neighbour of taking supplies. I found them in my own shed. I want to apologise and make something useful for them.','Tell the truth first. We can help with the restitution.'],
 ['Lucan','lynx','Keep a light for them','A family is late returning from the road. Their children asked me to keep a welcoming light and supper ready.','We will prepare for their return and sit with the children.'],
 ['Cora','goat','The patient apprentice','My apprentice broke our last delivery. She is frightened I will send her away. I need supplies so we can try again together.','Mistakes can teach us. Let her help with the new work.'],
 ['Rowan','raccoon','The unpaid crossing','A traveller cannot afford the ferry. My crew needs wages too. I want to help without taking food from their homes.','Let us provide supplies for the crew so everyone is cared for.'],
 ['Suri','leopard','A place in the lesson','A shy child keeps watching our class from outside. The other children have asked how to invite him.','Offer a place beside you, and let him join at his own pace.'],
 ['Merrin','horse','Rest for the road-weary','The stable hands are exhausted after sheltering stranded travellers. They need more than another cheerful speech.','We can do some of the work and bring what they need.'],
 ['Hazel','squirrel','A garden for everyone','Our communal garden was damaged. Some want to shut its gates, but hungry neighbours still depend on it.','Repair the garden together and keep a welcome at its gate.'],
 ['Ivo','crane','A song after sorrow','A grieving household asked for quiet company. I want to bring useful supplies rather than words they are not ready to hear.','Let them lead. We can listen without trying to fix their grief.'],
 ['Wren','hedgehog','Room for one more','The inn is full. A weary stranger offered to sleep outside so nobody would be inconvenienced. We can do better.','Make room together. Nobody should feel like a burden.']
];
const HELP_REGIONS=[['Greenbough','fallen branches have cut off the woodland road'],['Tidehaven','floodwater has delayed the coastal boats'],['Frostmere','a blizzard has closed the mountain pass'],['Stormwatch','lightning has damaged the hill shelters'],['Emberwell','ashfall has forced families away from their homes'],['Duskhollow','fear has kept neighbours behind locked doors'],['Dawnreach','pilgrims have arrived exhausted at the city approach']];
function makeHelpQuest({world=0,stage=0,bosses=0,cycle=0}){
 if([9,19].includes(stage))return null;
 const slot=stage-(stage>9?1:0),person=HELP_PEOPLE[slot],region=HELP_REGIONS[world%7];
 const count=Math.min(3,1+Math.floor(bosses/3)),skills=Array.from({length:Math.min(6,Math.max(1,bosses))},(_,i)=>i);
 const selected=Array.from({length:Math.min(count,skills.length)},(_,i)=>skills[(slot+i)%skills.length]);
 const requirements=selected.map(skill=>{const tier=skill===5?0:Math.min(skill<2?8:2,Math.floor(bosses/(skill<2?2:4)));return {skill,tier,level:skill===5?1:skill<2?tier+1:1+tier*3,id:skill===5?'token':['fish','meal','wood','ore','ingot'][skill]+'-'+tier,count:1+Math.min(2,Math.floor(bosses/5))};});
 return {id:`${cycle}:${world}:${stage}`,slot,name:person[0]+' of '+region[0],animal:person[1],title:person[2],story:`In ${region[0]}, ${region[1]}. ${person[3]}`,reply:person[4],requirements,status:'offered'};
}
function helpReady(q,life,getLevel){return !!q&&q.status==='accepted'&&q.requirements.every(r=>getLevel(life.xp[r.skill]||0)>=r.level&&(life.bag[r.id]||0)>=r.count);}
function consumeHelp(q,life,getLevel){if(!helpReady(q,life,getLevel))return false;for(const r of q.requirements){life.bag[r.id]-=r.count;life.xp[r.skill]+=20+r.tier*6+r.count*4;}q.status='complete';return true;}

function helpBlocked(){return !!state.helpQuest&&['offered','accepted','declined'].includes(state.helpQuest.status)&&!state.awaiting&&!state.training;}
function helpPrepare(){
 state.helpQuest=null;state.helpResult=null;
 if(state.enemy?.boss||state.malacharPhase||state.rexPhase||state.training)return;
 const stage=state.mode==='campaign'?state.worldStage:state.regular;
 state.helpQuest=makeHelpQuest({world:state.enemy.world,stage,bosses:lifeData().bosses||0,cycle:Math.floor(state.cleared/140)});
 state.paused=true;
}
function helpPanel(){const q=state.helpQuest;if(!q)return '';const l=lifeData();return modalFrame('An encounter · Fight or Help',`
 <div class="questPortrait" role="img" aria-label="${esc(q.name)}, a ${q.animal}" style="background-position:${(q.slot%6)*20}% ${Math.floor(q.slot/6)*50}%"></div>
 <div data-dialogue-audio="quest-${q.slot}"></div><span class="eyebrow">${esc(q.name)} · ${esc(q.animal)} townsfolk</span><h2>${esc(q.title)}</h2><p>${esc(q.story)}</p>
 <p>Choose one way to complete this tile. Accepting Help commits this encounter to the quest; choosing Fight commits it to battle.</p>
 <h3>Supplies and levels required</h3><ul>${q.requirements.map(r=>`<li>${esc(SKILLS[r.skill])} level ${r.level} · ${r.count} × ${esc(item(r.id).name)} · You have ${l.bag[r.id]||0}, level ${level(l.xp[r.skill]||0)}</li>`).join('')}</ul>
 <p>Help rewards: 25% extra gold and hero XP over this fight, life-skill XP for every required skill, and one additional fruit chest. Supplies are consumed only when you hand them in.</p>
 ${q.status==='offered'?`<h3>How will you respond?</h3><div class="actions">${lifeButton('helpAccept',esc(q.reply))}${lifeButton('helpDecline','Your troubles are not worth my time.')}${lifeButton('helpFight','FIGHT INSTEAD')}</div>`:q.status==='declined'?`<p>${esc(q.name)} withdraws the request after your response. This tile now offers battle only.</p>${lifeButton('helpFight','FIGHT')}`:`<p>You promised to help ${esc(q.name)}. Return with the supplies when you are ready.</p>${!l.malachar?'<p>Supervised fishing is available for this request. Full life-skill access still unlocks through bosses.</p>':''}<div class="actions">${q.requirements.map(r=>lifeButton('lifeTab','PRACTISE '+SKILLS[r.skill].toUpperCase(),`data-index="${r.skill}"`)).join('')}${lifeButton('helpComplete','DELIVER SUPPLIES & COMPLETE','',!helpReady(q,l,level))}${lifeButton('town','VISIT FIRST LIGHT')}</div>`}`);}
function helpHandle(action){
 if(action==='helpOpen'){if(helpBlocked()){modal='help';render();}return true;}
 if(!action.startsWith('help'))return false;
 const q=state.helpQuest;if(!q||state.awaiting||state.enemy?.boss||state.training)return true;
 if(action==='helpAccept'&&q.status==='offered'){q.status='accepted';if(!lifeData().malachar)lifeData().questApprentice=true;modal='help';}
 if(action==='helpDecline'&&q.status==='offered')q.status='declined';
 if(action==='helpFight'&&['offered','declined'].includes(q.status)){q.status='fight';modal='';state.paused=false;}
 if(action==='helpComplete'&&consumeHelp(q,lifeData(),level)){
  lifeData().questApprentice=false;state.helpRewarding=true;state.enemy.hp=0;modal='';victory();state.helpRewarding=false;
  state.questsCompleted=(state.questsCompleted||0)+1;playerProfile().quests=(playerProfile().quests||0)+1;state.helpResult=`You helped ${q.name}: ${q.title}`;
  note(state.helpResult+'. Extra chest, gold, hero XP and life-skill XP earned.');
 }
 save();render();return true;
}

const SURVIVAL_SHARED=['chosen','fighters','inventory','ranks','gold','points','life','town','gearPriorities','skillPriorities','questsCompleted','playerName','scores','progressProfile'];
function enterSharedSurvival(){
 if(state.mode!=='campaign'||!state.openingComplete||!state.awaiting||state.openingScene||state.pendingStory||state.pendingScene||state.rexPhase||state.malacharPhase||state.training||state.campaignReturn)return toast('Finish the guild introduction and the current story scene, then enter Survival between encounters.');
 townArchive();const campaign=JSON.parse(JSON.stringify(state)),shared={};for(const key of SURVIVAL_SHARED)if(state[key]!==undefined)shared[key]=JSON.parse(JSON.stringify(state[key]));
 state.campaignCarry=null;state.chosen=[...campaign.chosen];startRun('survival');Object.assign(state,shared);
 state.campaignReturn=campaign;state.openingComplete=true;state.openingVersion=0;state.paused=true;
 state.survivalBest=campaign.survivalBest||0;state.progressProfile=campaign.progressProfile;
 state.enemy.level=Math.max(state.enemy.level,Math.round(state.fighters.reduce((n,f)=>n+f.level,0)/state.fighters.length));
 note('Survival uses your Campaign company. Gold, equipment, skills and earned experience return with you.');save();render();
}
function returnToCampaign(){
 if(!state.campaignReturn)return;
 if(!state.awaiting&&!state.town?.retry)return toast('Finish this encounter before returning to Campaign.');
 const run=state,campaign=state.campaignReturn;townArchive();
 for(const key of SURVIVAL_SHARED)if(run[key]!==undefined)campaign[key]=JSON.parse(JSON.stringify(run[key]));
 campaign.survivalBest=Math.max(campaign.survivalBest||0,run.survivalBest||0,run.cleared);
 if(campaign.campaignCarry&&campaign.phase==='over')for(const key of ['chosen','fighters','inventory','ranks','gold','points'])campaign.campaignCarry[key]=JSON.parse(JSON.stringify(campaign[key]));
 campaign.campaignReturn=null;state=campaign;state.paused=true;modal='';close3D();
 // Rescue debt and fainting belong to the company; the Campaign route does not move.
 if(state.town?.retry){state.town.retry=false;state.town.message+=' Your Campaign road is preserved.';modal='town';}
 save();render();toast('Campaign restored. Survival earnings and your company came back with you.');
}

function playerProfile(){
 let p;try{p=JSON.parse(localStorage.getItem('sarko-player-profile'));}catch{}
 if(state.progressProfile?.token){const saved=state.progressProfile;if(p?.token===saved.token){saved.quests=Math.max(saved.quests||0,p.quests||0);saved.ids={...p.ids,...saved.ids};saved.best??={};for(const [key,value]of Object.entries(p.best||{}))saved.best[key]=Math.max(saved.best[key]||0,value);saved.name=p.name||saved.name;}return saved;}
 if(!p?.token)p={token:scoreUUID(),name:'Traveller '+Math.floor(10000+Math.random()*90000),ids:{},best:{},quests:0};
 state.progressProfile=p;return p;
}
function recordPlayerProgress(){
 if(state.phase==='selection'||!state.fighters.length)return;
 const p=playerProfile(),campaign=state.mode==='campaign'?state:state.campaignReturn;
 const party=(state.roadParty||state.chosen).slice(0,4).map(id=>hero(id).name);
 const roster=[...state.fighters,...Object.values(state.town?.roster||{})];
 const values={level:Math.max(1,...roster.map(f=>f.level)),quests:Math.max(p.quests||0,state.questsCompleted||0),survival:Math.max(state.survivalBest||0,state.mode==='survival'?state.cleared:0)};
 if(campaign)values['campaign:'+campaign.difficulty]=Math.min(140,campaign.cleared);
 p.ids??={};p.best??={};
 for(const [key,value] of Object.entries(values)){
  const previous=p.best[key];if(previous!==undefined&&previous>=value&&p.lastName===p.name)continue;
  const mode=key.split(':')[0],difficulty=mode==='campaign'?Number(key.split(':')[1]):0;
  p.best[key]=Math.max(previous||0,value);p.ids[key]??=scoreUUID();
  const rankingTeam=mode==='level'?[hero(roster.reduce((best,f)=>f.level>best.level?f:best,roster[0]).id).name]:party;
  queueScore({id:p.ids[key],token:p.token,name:p.name,mode,difficulty,cleared:p.best[key],team:rankingTeam});
 }
 p.lastName=p.name;try{localStorage.setItem('sarko-player-profile',JSON.stringify(p));}catch{}
}
function renameRankingPlayer(){const input=$('#rankingName');if(!input)return;const name=input.value.trim().replace(/[<>\x00-\x1f]/g,'').slice(0,30);if(!name)return toast('Choose a display name.');const p=playerProfile();p.name=name;state.playerName=name;p.lastName=null;try{localStorage.setItem('sarko-player-profile',JSON.stringify(p));}catch{}save();syncScores();render();}
function progressRankings(){
 const p=playerProfile(),mode=onlineScores.mode,labels={level:'Highest hero level',campaign:'Furthest Campaign',survival:'Furthest Survival',quests:'Quests completed'},unit={level:'level',campaign:'encounters',survival:'encounters',quests:'quests'};
 const rows=onlineScores.rows||[],page=onlineScores.page||0;
 return modalFrame('Sarko community rankings',`<p>Progress is recorded automatically while you play. Your public display name, heroes and best progress appear here. Keep your save backup to retain your identity on another device.</p><div class="actions"><input id="rankingName" class="nameInput" maxlength="30" aria-label="Public display name" value="${esc(p.name)}">${lifeButton('rankingName','SAVE DISPLAY NAME')}</div><div class="actions">${Object.entries(labels).map(([key,label])=>`<button class="button mini ${mode===key?'active':''}" data-action="scoreMode" data-mode="${key}">${label}</button>`).join('')}</div>${mode==='campaign'?`<div class="actions">${DIFFICULTIES.map((name,i)=>lifeButton('scoreDifficulty',name,`data-index="${i}"`)).join('')}</div>`:''}<p role="status">${onlineScores.status==='ready'?'Shared rankings':onlineScores.status==='loading'?'Loading shared rankings…':'Offline · your progress will upload when connected.'}</p><div class="rankings">${rows.map((r,i)=>`<div class="shopItem"><b>#${page*100+i+1}</b><div class="grow"><strong>${esc(r.name)}</strong><p>${esc(r.team)}</p></div><strong>${Number(r.cleared)||0} ${unit[mode]}</strong></div>`).join('')||'<p>No entries loaded yet.</p>'}</div><div class="actions">${lifeButton('rankPage','PREVIOUS',`data-index="${page-1}"`,page===0)}${lifeButton('rankPage','NEXT',`data-index="${page+1}"`,rows.length<100)}${lifeButton('refreshScores','REFRESH')}</div>`);
}

async function gameFullscreen(){
 try{if(document.fullscreenElement){await document.exitFullscreen();return;}
 if(document.fullscreenEnabled&&document.documentElement.requestFullscreen){await document.documentElement.requestFullscreen();return;}
 toast('Fullscreen is unavailable in this browser. On iPhone, use Safari Share → Add to Home Screen, then open Sarko from that icon.');
 }catch{toast('The browser could not enter fullscreen. On a computer, try F11.');}
}
function initialState(){return {phase:'selection',mode:'survival',difficulty:0,unlockedDifficulty:0,campaignCarry:null,world:0,worldStage:0,mapView:'route',pendingStory:false,pendingScene:null,storyChapter:0,bossDeck:[],chosen:[],fighters:[],enemy:null,deck:[],cleared:0,regular:0,turn:0,actor:0,paused:false,awaiting:false,manual:false,view3d:true,gold:0,points:0,inventory:[],ranks:{},scores:[],log:[],loot:[],scoreSent:false,arena:0,shopRevision:0,shopBought:[],playerName:'',savedAt:Date.now()};}
function validState(s){
  const heroId=id=>Number.isInteger(id)&&id>=0&&id<HEROES.length;
  if(!s||typeof s!=='object'||!['selection','battle','over'].includes(s.phase))return false;
  if(!Array.isArray(s.chosen)||s.chosen.length>(s.malacharPhase||s.rexPhase?9:4)||!s.chosen.every(heroId)||!Array.isArray(s.inventory)||!Array.isArray(s.scores))return false;
  if(s.inventory.some(g=>!g||!['Fruit','Gem'].includes(g.kind)||typeof g.name!=='string'||(g.kind==='Fruit'&&g.attribute!==undefined&&!FRUITS.includes(g.attribute))||!RARITIES.includes(g.rarity)||!Number.isFinite(g.bonus)||!((g.equippedTo===null)||heroId(g.equippedTo))))return false;
  if(!Number.isInteger(s.arena)||!heroId(s.arena)||!Number.isInteger(s.cleared)||s.cleared<0)return false;
  if(s.phase!=='selection'){
    if(!Array.isArray(s.fighters)||s.fighters.length!==(s.malacharPhase||s.rexPhase||s.openingVersion&&!s.openingComplete?s.chosen.length:4)||s.fighters.some(f=>!heroId(f.id)||!Number.isFinite(f.hp)||!Number.isInteger(f.level)||f.level<1||!Array.isArray(f.last)))return false;
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
  loaded.view3d=true;if(loaded.helpQuest&&['offered','accepted','declined'].includes(loaded.helpQuest.status))loaded.paused=true;
  syncEnemyKit(loaded.enemy);
  return loaded;
}
function save(){
  if(typeof coopRuntime!=='undefined'&&coopRuntime){coopRuntime.dirty=true;return true;}
  recordPlayerProgress();
  state.savedAt=Date.now();
  saveFiles.slots[saveFiles.active].state=state;
  try {localStorage.setItem(SAVE_KEY,JSON.stringify(saveFiles));if(typeof cloud!=='undefined')cloud?.localSaved();return true;} catch {return false;}
}
function switchFile(index){
  if(index<0||index>=3)return;
  if(index===saveFiles.active)return;
  save();
  close3D();manualChoice=null;
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
    close3D();manualChoice=null;
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
    if(index===saveFiles.active){close3D();manualChoice=null;state=loadState();state.paused=true;}
    save();render();toast('Save file imported.');
  } catch(e){toast(e.message||'Could not import save file.');}
}
function toast(text){const el=$('#toast');el.textContent=text;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2400);}
function note(text){state.log.unshift(text);state.log=state.log.slice(0,30);save();}
function hero(id){return HEROES[id];}
function skillFor(id,index){return data.skills?.[id===7?'Magnar':hero(id).name]?.[index]??{name:'Attack',description:'Strike the foe.'};}
function rankFor(id,index){return 1+(state.ranks[`${id}-${index}`]||0);}
function fruitBonus(id,name){const total=state.inventory.filter(g=>g.kind==='Fruit'&&g.equippedTo===id&&fruitAttribute(g)===name).reduce((n,g)=>n+(g.bonus||0),0);return Math.min(['Peace','Patience','Gentleness','Faithfulness'].includes(name)?.75:Infinity,total);}
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
function fighterStats(f){const base=hero(f.id),level=f.level||1;return {max:Math.round(base.hp*(1+.12*(level-1)+fruitBonus(f.id,'Love')+lifeBonus(f.id,'Health'))),attack:Math.round(base.attack*(1+.08*(level-1)+fruitBonus(f.id,'Self-Control')+gemBonus(f.id,'Attack Power')+lifeBonus(f.id,'Attack'))),defense:Math.round(base.defense*(1+.055*(level-1)+lifeBonus(f.id,'Defense'))),healing:Math.round(base.healing*(1+.08*(level-1)+lifeBonus(f.id,'Healing'))),faith:base.faith,crit:lifeBonus(f.id,'Critical')+base.crit+fruitBonus(f.id,'Faithfulness')+gemBonus(f.id,'Critical Chance'),resist:base.resist+fruitBonus(f.id,'Peace')+gemBonus(f.id,'Damage Reduction')};}
function shuffledDeck(){return [...MONSTERS].sort(()=>Math.random()-.5);}
function shuffledBosses(){return BOSSES.map((_,i)=>i).sort(()=>Math.random()-.5);}
function pickHero(id){if(state.phase!=='selection')return;const at=state.chosen.indexOf(id);if(at>=0)state.chosen.splice(at,1);else if(state.chosen.length<4)state.chosen.push(id);else return toast('Choose exactly four heroes.');save();render();}
function startRun(mode='survival'){
  const carry=mode==='campaign'&&state.campaignCarry?.difficulty===state.difficulty-1?state.campaignCarry:null;
  if(mode!=='campaign'&&state.chosen.length!==4&&!carry)return toast('Choose four heroes first.');
  if(mode==='campaign'&&state.difficulty>state.unlockedDifficulty)return toast('Beat the previous difficulty first.');
  if(carry)state.chosen=[...carry.chosen];if(mode==='campaign'&&!carry){state.chosen=[0,2,3];state.openingVersion=1;state.openingComplete=false;state.gardenGift=false;}else{state.openingVersion=0;state.openingComplete=true;}state.openingScene=null;state.guildPicking=false;state.malacharPhase=null;
  state.scenePage=0;state.guidedIntro=false;state.mode=mode;state.world=0;state.worldStage=0;state.mapView='route';state.pendingStory=mode==='campaign';state.pendingScene=null;state.storyChapter=0;
  state.rexPhase=null;state.bookBattleReturn=null;state.bookGardenStarted=false;state.bookGardenComplete=false;state.bookRexWarning=false;state.bookFinalStarted=false;state.bookRestoration=false;state.bookCityComplete=false;state.helpQuest=null;state.helpResult=null;state.questsCompleted=0;state.training=null;state.town=null;if(state.life){state.life.bag={};state.life.buffs={};}lifeRound=null;state.inventory=[];state.ranks={};selectedGear=-1;selectedGem=-1;state.phase='battle';state.manual=false;manualChoice=null;
  state.fighters=state.chosen.map(id=>({id,level:1,xp:0,hp:hero(id).hp,ward:false,nextSkill:0,last:Array(8).fill(-100),cooldownSavings:Array(8).fill(0)}));
  if(carry){state.inventory=JSON.parse(JSON.stringify(carry.inventory));state.ranks={...carry.ranks};state.fighters=JSON.parse(JSON.stringify(carry.fighters));}
  state.fighters.forEach(f=>f.hp=fighterStats(f).max);state.deck=[];state.bossDeck=[];state.cleared=0;state.regular=0;state.turn=0;state.actor=0;
  state.paused=mode==='campaign';state.awaiting=false;state.gold=0;state.points=0;state.loot=[];state.log=[];state.shopBought=[];state.shopRevision=0;
  state.arena=state.chosen[rand(state.chosen.length)];state.scoreSent=false;state.scoreRunId=scoreUUID();state.scoreRunToken=scoreUUID();note(mode==='campaign'?'The book campaign begins in the Earth world.':'The guild arena opens. Choose when to fight the next foe.');
  if(carry){state.gold=carry.gold;state.points=carry.points;note('Your heroes, gear, levels, and skill ranks carry into the next difficulty.');}
  spawnEnemy();if(mode==='campaign'){modal='story';state.paused=true;}playMusic();render();globalThis.scrollTo?.(0,0);
}
function spawnEnemy(){
  if(threeView||threeHost)close3D();state.battleId=newId();
  state.mapView='route';
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
  const easy=campaign&&(state.difficulty||0)===0;
  const hp=Math.max(1,Math.round(((boss?300:145)+state.cleared*(boss?30:12))*(1+.07*(level-1))*.5*difficulty*(easy?1.2:1)));
  state.enemy={type,boss,world,bossId:chosenBoss?.name||null,name:boss?`BOSS · ${chosenBoss.name}`:label(type),art:chosenBoss?.art||null,level,hp,max:hp,
    attack:Math.max(1,Math.round(((boss?34:20)+state.cleared*2)*(1+.04*(level-1))*.5*difficulty*(easy?1.15:1))),
    guard:Math.max(0,Math.round(((boss?13:5)+Math.floor(level/2))*.5*difficulty)),moves:chosenBoss?.moves||MONSTER_MOVES[type],move:0};
  syncEnemyKit(state.enemy);state.enemy.baseGuard=state.enemy.guard;
  state.awaiting=false;state.paused=false;state.actor=0;state.turn=0;state.loot=[];
  bookEncounterStart();helpPrepare();note(`${campaign?`World ${state.world+1} · Stage ${state.worldStage+1}`:`Wave ${state.cleared+1}`}: ${state.enemy.name} enters the arena.`);save();
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
  const choreography={"Shepherd's Advance":{0:'sanctuary',1:'apostles_advance'},"A Witnessed Opening":{5:'guided_bolt'},"The Mentor's Clear Line":{3:'mentors_measure',6:'piercing_star'},"Room to Move":{7:'stonewall_brace',4:'vanguard_step'},"Guiding Parry":{1:'guiding_parry'},"One Road Together":{2:'guardians_passage'}};
  const support=['sanctuary','steady_resolve','courageous_witness','stand_together','renewed_focus','sheltering_word','regenerative_focus','steadfast_heart','shelter_of_grace'];
  const participants=living.map(f=>({hero:f.id,action:move==='Threefold Support'?support[f.id]:(choreography[move]?.[f.id]||'attack')}));
  const team3D={hero:living[0].id,effectOnly:true,participants,skillId:move,color:'#f1c76b',targets:[]};
  const current=move==='A Witnessed Opening'||move==='Room to Move';
  let hit=0;
  if(current)hit=living.length*12+12;
  else if(move!=='Threefold Support'){
    const finisher=move==="Shepherd's Advance"?living.find(f=>f.id===1):move==="The Mentor's Clear Line"?living.find(f=>f.id===6):living.find(f=>f.id!==(move==='Guiding Parry'?1:2));
    hit=Math.max(1,Math.round(fighterStats(finisher).attack*(move==="The Mentor's Clear Line"?.35:.2)));
  }
  hit=townDamage(hit);state.enemy.hp=Math.max(0,state.enemy.hp-hit);
  if(hit)team3D.targets.push({enemy:true,kind:'damage',amount:hit,defeated:state.enemy.hp===0});
  if(hit)transient.chips.push({text:'−'+hit+' '+move,color:'#f1c76b'});
  if(!current)for(const ally of living){
    ally.ward=true;
    team3D.targets.push({hero:ally.id,kind:'ward'});
    const pct=move==='Threefold Support'?.05:move==="Shepherd's Advance"?.04:0;
    const healed=Math.min(fighterStats(ally).max-ally.hp,Math.round(fighterStats(ally).max*pct));
    if(healed>0){ally.hp+=healed;transient.heal=ally.id;transient.chips.push({text:'+'+healed+' '+hero(ally.id).name,color:'#72e5aa'});}
    if(healed>0)team3D.targets.push({hero:ally.id,kind:'heal',amount:healed});
  }
  queue3D(team3D);
  note('TEAM SKILL / '+move+' / '+hit+' bonus damage'+(current?'.':move==='Threefold Support'||move==="Shepherd's Advance"?'; healing and protection.':'; protection.'));
}
function toggleMode(){
  if(state.phase!=='battle'||state.awaiting)return;
  state.manual=!state.manual;manualChoice=null;state.paused=false;
  note(state.manual?'Manual turns: choose a basic attack or a ready skill for each hero.':'Auto battle resumed.');
  save();render();
}
function toggleView(){
  if(threeBusy)return;threeFailure='';state.view3d=true;state.paused=true;close3D();save();render();
}
function chooseManual(index){
  if(helpBlocked())return;if(!state.manual||state.phase!=='battle'||state.paused||state.awaiting||modal)return;
  const f=state.fighters[state.actor];if(!f||f.hp<=0)return;
  const turn=state.turn+(state.actor===0?1:0);
  if(index>=0&&turn-f.last[index]<cooldown(f.id,index))return toast('That skill is still cooling down.');
  manualChoice=index;battleTick();
}
function setSkillPriority(id,index){
  if(state.manual||state.phase!=='battle'||!Number.isInteger(index)||index<0||index>=8)return;
  const f=state.fighters.find(f=>f.id===id);if(!f)return;
  f.prioritySkill=f.prioritySkill===index?null:index;save();render();
}
function autoSkillIndex(f,available){return available.includes(f.prioritySkill)?f.prioritySkill:available[0];}
function autoSkillPanel(){
  if(state.phase!=='battle'||state.awaiting)return '';
  const f=state.fighters.find(f=>f.id===selectedHero)||state.fighters[0];if(!f)return '';
  const skills=data.skills[f.id===7?'Magnar':hero(f.id).name]||[],turn=state.turn+(state.actor===0?1:0);
  return '<div class="manualPanel panel panelpad"><span class="eyebrow">Auto skills · '+esc(hero(f.id).name)+'</span><p>Auto chooses your moves. Select a skill for 1st priority whenever it is ready. Select it again to clear.</p><div class="heroTabs">'+state.fighters.map(h=>'<button class="button mini" data-action="priorityHero" data-id="'+h.id+'" aria-pressed="'+(h.id===f.id)+'">'+esc(hero(h.id).name)+'</button>').join('')+'</div><div class="manualSkills">'+skills.map((skill,i)=>{
    const wait=Math.max(0,cooldown(f.id,i)-(turn-f.last[i])),priority=f.prioritySkill===i;
    return '<button class="manualSkill button mini '+(priority?'active':'')+'" data-action="skillPriority" data-id="'+f.id+'" data-index="'+i+'" aria-pressed="'+priority+'"><img src="'+img('Skill-'+f.id+'-'+i+'.png')+'" alt=""><span>'+esc(skill.name)+'<small>'+(priority?'1st priority · ':'')+(wait?'Ready in '+wait+' turns':'Ready')+'</small><small>'+esc(skill.description)+'</small></span></button>';
  }).join('')+'</div></div>';
}
function manualPanel(){
  if(!state.manual)return autoSkillPanel();
  if(!state.manual||state.phase!=='battle'||state.awaiting)return '';
  const f=state.fighters[state.actor];if(!f)return '';
  const turn=state.turn+(state.actor===0?1:0),skills=data.skills[f.id===7?'Magnar':hero(f.id).name]||[];
  return '<div class="manualPanel panel panelpad"><div class="sectionHead"><div><span class="eyebrow">Manual turn · '+hero(f.id).name+'</span><h3>Choose an action</h3></div><button class="button mini" data-action="basic">BASIC ATTACK</button></div><div class="manualSkills">'+skills.map((skill,i)=>{
    const wait=Math.max(0,cooldown(f.id,i)-(turn-f.last[i]));
    return '<button class="manualSkill button mini" data-action="manualSkill" data-index="'+i+'" '+(wait?'disabled':'')+'><img src="'+img('Skill-'+f.id+'-'+i+'.png')+'" alt=""><span>'+esc(skill.name)+'<small>'+(wait?'Ready in '+wait+' turns':'Ready · '+esc(skill.description))+'</small></span></button>';
  }).join('')+'</div></div>';
}
function battleTick(){if(typeof coopRuntime!=='undefined'&&coopRuntime&&(!coopLeader()||coopRewardsPending()||coopRuntime.publishing||coopRuntime.dirty||coopWire.room.status!=='playing'))return;if(titleOpen||helpBlocked())return;
  if(typeof window!=='undefined'&&state.view3d&&(!threeView||threeLoading||threeFailure))return;if(globalThis.sarkoIntroPlaying)return;
  if(state.phase!=='battle'||state.paused||state.awaiting||modal||threeBusy||threeLoading)return;
  const enemy=state.enemy;if(!enemy)return;
  const f=state.fighters[state.actor],nextTurn=state.turn+(state.actor===0?1:0);
  const manualActor=state.manual&&(!coopRuntime||coopWire.room.members.some(m=>m.loadout.heroes.includes(f?.id)));
  if(manualActor&&f?.hp>0&&manualChoice===null)return;
  if(manualActor&&manualChoice>=0&&nextTurn-f.last[manualChoice]<cooldown(f.id,manualChoice))return;
  threeEvents=[];threeFrame=threeView&&state.view3d?JSON.parse(JSON.stringify(state)):null;
  transient={chips:[],hits:[],enemyMove:'',heal:-1,weapon:-1};
  if(state.actor===0)state.turn++;
  if(f?.hp>0){
    const available=[];
    for(let k=0;k<8;k++){const n=(f.nextSkill+k)%8;if(state.turn-f.last[n]>=cooldown(f.id,n))available.push(n);}
    const index=manualActor?manualChoice:autoSkillIndex(f,available);
    if(index===-1){
      const stats=fighterStats(f),hit=townDamage(Math.max(3,Math.round(stats.attack)-enemy.guard));
      enemy.hp=Math.max(0,enemy.hp-hit);transient.weapon=f.id;
      transient.chips.push({text:'−'+hit+' '+hero(f.id).name,color:hero(f.id).color});
      note(hero(f.id).name+' uses Basic Attack for '+hit+' damage.');
      queue3D({hero:f.id,color:hero(f.id).color,projectile:f.id===5?'bolt':f.id===6?'arrow':null,advance:[5,6].includes(f.id)?0:1.25,targets:[{enemy:true,kind:'damage',amount:hit,defeated:enemy.hp===0}]});
    }else if(index!==undefined&&index!==null){
      const skill=skillFor(f.id,index),desc=skill.description.toLowerCase(),stats=fighterStats(f),power=1+.18*(rankFor(f.id,index)-1);
      const move3D={hero:f.id,skillId:skill.id,color:hero(f.id).color,targets:[]};
      recordSkillUse(f,index);f.nextSkill=(index+1)%8;
      const heal=/heal|restore|recover/.test(desc),protect=/protect|ward|brace|guard/.test(desc);
      if(heal){
        const target=state.fighters.filter(x=>x.hp>0).sort((a,b)=>a.hp/fighterStats(a).max-b.hp/fighterStats(b).max)[0];
        if(target){const amount=Math.round(Math.max(18,Math.round((stats.healing*2+stats.faith)*power))*(1+fruitBonus(f.id,'Kindness')+gemBonus(f.id,'Healing Power')));
          const healed=Math.min(amount,fighterStats(target).max-target.hp);target.hp+=healed;transient.heal=target.id;
          transient.chips.push({text:'+'+healed+' '+hero(target.id).name,color:'#72e5aa'});
          note(hero(f.id).name+' uses '+skill.name+'; '+hero(target.id).name+' heals '+healed+'.');
          move3D.targets.push({hero:target.id,kind:'heal',amount:healed});
        }
      }
      if(protect){state.fighters.filter(x=>x.hp>0).forEach(x=>{x.ward=true;move3D.targets.push({hero:x.id,kind:'ward'});});note(hero(f.id).name+' grants a protective ward.');}
      if(!heal||/strike|bolt|arrow|cut|thrust/.test(desc)){
        let hit=Math.max(4,Math.round(stats.attack*(1.2+(f.nextSkill%4)*.13)*power)-enemy.guard);
        const critical=Math.random()<stats.crit;if(critical){hit=Math.round(hit*2);note('Critical hit!');}
        hit=townDamage(hit);enemy.hp=Math.max(0,enemy.hp-hit);transient.weapon=f.id;
        transient.chips.push({text:'−'+hit+' '+hero(f.id).name,color:hero(f.id).color});
        note(hero(f.id).name+' uses '+skill.name+' for '+hit+' damage.');
        move3D.targets.push({enemy:true,kind:'damage',amount:hit,critical,defeated:enemy.hp===0});
        if([5,6].includes(f.id))move3D.projectile=f.id===5?'bolt':'arrow';
        if(![5,6].includes(f.id))move3D.advance=1.25;
      }
      queue3D(move3D);
    }
  }
  manualChoice=null;
  state.actor++;
  guardMalachar();bookBattleCheck();if(state.openingScene){finishBattleTurn();return;}if(enemy.hp<=0){victory();finishBattleTurn();return;}
  if(state.actor>=state.fighters.length){
    state.actor=0;
    if(state.turn%4===0){teamMove();bookBattleCheck();if(state.openingScene){finishBattleTurn();return;}if(enemy.hp<=0){victory();finishBattleTurn();return;}}
    monsterTurn();
  }
  finishBattleTurn();
}
function unequipFallen(id){townFaint(id);
  for(const item of state.inventory)if(item.equippedTo===id)item.equippedTo=null;
  note(hero(id).name+' has fainted. Their fruit returns to the arena inventory.');
}
function monsterTurn(){
  const enemy=state.enemy,living=state.fighters.filter(f=>f.hp>0);if(!living.length)return defeat();
  const action=nextEnemyAction(enemy),move=action.name;
  const move3D={enemy:true,skillId:action.basic?null:move,color:'#ffba7e',targets:[]};
  transient.enemyMove=action.basic?`${move} · Basic attack`:move;
  if(!action.basic&&ENEMY_GUARD_SKILLS.includes(move)){enemy.baseGuard??=enemy.guard;enemy.guard=Math.min(enemy.baseGuard+6,enemy.guard+2);move3D.targets.push({enemy:true,kind:'ward'});queue3D(move3D);note(`${enemy.name} uses ${move} and hardens its defense.`);bookEnemyTurn();malacharRound();return;}
  const area=!action.basic&&ENEMY_AREA_SKILLS.includes(move);
  const targets=area?living:[living[rand(living.length)]];
  const multiplier=action.basic?.8:area?.67:ENEMY_HEAVY_SKILLS.includes(move)?1.3:1;
  for(const victim of targets){
    const stats=fighterStats(victim);
    const damage=Math.max(2,Math.round((enemy.attack*multiplier-stats.defense*.5)*(1-stats.resist)*(1-(area?fruitBonus(victim.id,'Gentleness'):0))*(victim.ward?.55:1)));
    victim.hp=Math.max(state.malacharPhase==='hold'||state.rexPhase==='demonstration'?1:0,victim.hp-damage);victim.ward=false;
    transient.hits.push({id:victim.id,damage});
    move3D.targets.push({hero:victim.id,kind:'damage',amount:damage,defeated:victim.hp===0});
    note(`${enemy.name} uses ${move} on ${hero(victim.id).name} for ${damage}.`);
    if(victim.hp===0)unequipFallen(victim.id);
  }
  move3D.advance=area?0:1.25;queue3D(move3D);
  bookEnemyTurn();malacharRound();if(state.fighters.every(f=>f.hp===0))defeat();
}
function victory(){
 const session=typeof coopRuntime!=='undefined'&&coopRuntime;
 const before=session&&!state.awaiting?{battleId:state.battleId,gold:state.gold,points:state.points,hp:state.enemy?.hp}:null;
 if(before)state.loot=[];
 soloVictory();
 if(before&&before.hp<=0&&coopRuntime){
 const progress=Object.fromEntries(["mode","difficulty","world","worldStage","cleared","regular","phase","awaiting","enemy","battleId","deck","bossDeck","pendingStory","pendingScene","storyChapter","bookChapters","openingComplete","openingVersion","openingScene","openingPage","malacharPhase","rexPhase","gardenWave","rexRounds","bookGardenStarted","bookGardenComplete","bookRexWarning","bookFinalStarted","bookRestoration","bookCityComplete","helpQuest","helpResult","questsCompleted","training","campaignCarry","unlockedDifficulty"].filter(k=>state[k]!==undefined).map(k=>[k,structuredClone(state[k])]));
 coopRuntime.session.rewardGold+=state.gold-before.gold;
 coopRuntime.reward={id:coopWire.room.id+':'+before.battleId,battleId:before.battleId,enemyHp:before.hp,gold:state.gold-before.gold,points:state.points-before.points,xp:0,items:structuredClone(state.loot),fighters:structuredClone(state.fighters),life:structuredClone(state.life),progress,helped:!!state.helpRewarding};coopRuntime.dirty=true;
 }
}
function soloVictory(){
  const coopBefore=typeof coopRuntime!=='undefined'&&coopRuntime?{gold:state.gold,points:state.points}:null;
  if(state.awaiting)return;if(bookVictory())return;if(state.training){trainingVictory();return;}if(!state.helpRewarding){trainingRemember();townBattleFinished();}if(state.helpQuest&&!state.helpRewarding)state.helpQuest.status='fight';if(state.enemy?.boss)townBossWon();
  if(state.malacharPhase==='united'){state.awaiting=true;lifeData().malachar=true;lifeData().worlds=Math.max(1,lifeData().worlds);unlockBookChapter();state.gold+=180;note('Malachar retreats. The guild stands together. +180 gold.');beginOpeningScene('aftermath');save();return;}
  const enemy=state.enemy,boss=enemy.boss;if(state.life){expireMeals(state.life);for(const f of state.fighters)f.hp=Math.min(f.hp,fighterStats(f).max);}state.cleared++;if(state.campaignReturn)state.survivalBest=Math.max(state.survivalBest||0,state.cleared);if(boss)unlockBookChapter();state.regular=state.mode==='campaign'?0:(state.regular+1)%20;
  if(state.mode==='campaign'){state.worldStage++;if([5,10,15].includes(state.worldStage))state.pendingScene={world:state.world,stage:state.worldStage};}
  state.awaiting=true;state.paused=true;state.actor=0;
  const earnedPoint=state.cleared%2===0;if(earnedPoint)state.points++;
  state.gold+=Math.round((24+enemy.level*10+(boss?80:0))*2.25*(state.helpRewarding?1.25:1)*(1+state.chosen.reduce((n,id)=>n+fruitBonus(id,'Goodness'),0)));
  state.loot=[];addLoot('Fruit');if(state.helpRewarding)addLoot('Fruit');
  if(boss){addLoot('Fruit');addLoot('Fruit');addLoot('Gem');}
  else{if(Math.random()<.44)addLoot('Fruit');if(Math.random()<.18)addLoot('Gem');}
  const xp=Math.round((22+enemy.level*7+(boss?40:0))*(state.helpRewarding?1.25:1)*(state.campaignReturn?.5:1));
  for(const f of state.fighters){if(f.hp<=0)continue;f.xp+=Math.round(xp*(coopBefore?2:1)*(1+fruitBonus(f.id,'Joy')));while(f.xp>=60+f.level*30){f.xp-=60+f.level*30;f.level++;f.hp=fighterStats(f).max;note(`${hero(f.id).name} reaches level ${f.level} and fully heals.`);}}
  if(boss&&state.mode==='campaign'){
    state.points+=2;
    state.fighters.filter(f=>f.hp>0).forEach(f=>{f.level++;f.hp=fighterStats(f).max;});
    if(state.worldStage===20){lifeData().worlds=Math.max(lifeData().worlds,state.world+1);
      if(state.world===6){state.phase='over';state.unlockedDifficulty=Math.max(state.unlockedDifficulty,Math.min(3,state.difficulty+1));state.campaignCarry={difficulty:state.difficulty,chosen:[...state.chosen],inventory:JSON.parse(JSON.stringify(state.inventory)),ranks:{...state.ranks},fighters:JSON.parse(JSON.stringify(state.fighters)),gold:state.gold,points:state.points};note(`Campaign complete on ${DIFFICULTIES[state.difficulty]}. The next difficulty is unlocked.`);}
      else{state.world++;state.worldStage=0;state.mapView='overview';state.pendingStory=true;state.storyChapter=campaignData.worlds[state.world]?.first||0;note(`${campaignData.worlds[state.world]?.name||'Next'} world unlocked. Your next story encounter awaits. The Book Library can be visited separately.`);}
    }
  }
  if(state.mode==='campaign'&&state.openingComplete&&state.world===2&&state.worldStage===0&&boss&&!state.bookGardenStarted)beginGardenJourney();
  if(state.phase==='over'&&state.rexPhase==='final'){const ids=state.roadParty||state.chosen.slice(0,4);state.campaignCarry.chosen=ids;state.campaignCarry.fighters=state.fighters.filter(f=>ids.includes(f.id)).map(f=>JSON.parse(JSON.stringify(f)));beginOpeningScene('rexDefeat');}
  if(state.openingVersion&&!state.openingComplete&&state.world===1&&state.worldStage===0&&boss){state.pendingStory=false;state.pendingScene=null;beginOpeningScene('guild');}

  note(`${enemy.name} defeated. ${state.cleared} monsters cleared. A chest was found. ${earnedPoint?'+1 skill point.':'Next victory awards a skill point.'}`);save();
}
function addLoot(kind){const item=kind==='Fruit'?{id:newId(),kind,name:FRUITS[rand(FRUITS.length)],attribute:FRUITS[rand(FRUITS.length)],rarity:RARITIES[Math.min(4,Math.floor(state.cleared/9)+rand(2))],bonus:.04+rand(4)*.02,equippedTo:null,gem:null}:{id:newId(),kind,name:['Radiant','Storm','Guardian','Luminous'][rand(4)]+' Gem',rarity:RARITIES[Math.min(4,Math.floor(state.cleared/12)+rand(2))],bonus:.04,equippedTo:null};state.inventory.push(item);state.loot.push(item);}
function defeat(){const training=!!state.training;townRescue();if(training){trainingRestore();townData().retry=false;save();}}
function nextFight(){if(state.town?.retry){townOpen();return;}if(state.phase!=='battle'||!state.awaiting)return;if(state.pendingStory){modal='story';render();return;}if(state.pendingScene){modal='scene';render();return;}spawnEnemy();render();}
function resetRun(){if(state.campaignReturn){returnToCampaign();return;}state.helpQuest=null;state.helpResult=null;if(state.life)state.life.questApprentice=false;if(state.life){state.life.bag={};state.life.buffs={};}lifeRound=null;state.openingScene=null;state.guildPicking=false;state.malacharPhase=null;state.openingVersion=0;state.scenePage=0;state.guidedIntro=false;manualChoice=null;state.inventory=[];state.ranks={};state.gold=0;state.points=0;state.loot=[];selectedGear=-1;selectedGem=-1;state.phase='selection';state.chosen=[...(state.campaignCarry?.chosen||[])];state.fighters=[];state.enemy=null;state.awaiting=false;state.paused=false;modal='';save();render();}
function playMusic(){if(!musicOn)return;const a=$('#music');if(!a)return;a.src=MUSIC[musicIndex%MUSIC.length];a.volume=.28;a.play().catch(()=>{});}
function toggleMusic(){musicOn=!musicOn;const a=$('#music');if(musicOn)playMusic();else a.pause();render();}
$('#music').addEventListener('ended',()=>{musicIndex++;playMusic();});
function progressMap(){
  const campaign=state.mode==='campaign',start=campaign?0:Math.max(0,state.cleared-3),count=campaign?20:11;
  return `<div class="map" aria-label="Stage map">${Array.from({length:count},(_,j)=>{const n=start+j+1,boss=campaign?n===20:n%6===0,done=campaign?n<=state.worldStage:n<=state.cleared,now=campaign?n===state.worldStage+1:n===state.cleared+1;return `<div class="dot ${boss?'boss':''} ${done?'done':''} ${now?'now':''}" title="Stage ${n}${boss?' boss':''}">${boss?'♛':done?'✓':''}</div>`;}).join('')}</div>`;
}
function arenaArt(){
  const stage=state.mode==='campaign'?state.worldStage:state.regular;
  return `World-${WORLD_NAMES[state.enemy?.world??(state.mode==='campaign'?state.world:Math.floor(state.cleared/20)%7)]}${stage>=10?'-2':''}.jpg`;
}
const SHARED_SCORE_URL='https://sarko-guild-scores.bright-drum-4278.chatgpt.site/api/scores';
let onlineScores={rows:[],status:'idle',mode:'survival',difficulty:0,request:0};
let scoreSyncBusy=false;
function scoreUUID(){return globalThis.crypto?.randomUUID?.()||'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.floor(Math.random()*16);return(c==='x'?r:(r&3)|8).toString(16);});}
function pendingScores(){try{return JSON.parse(localStorage.getItem('sarko-score-outbox')||'[]');}catch{return [];}}
function queueScore(row){const rows=pendingScores().filter(s=>s.id!==row.id);rows.push(row);localStorage.setItem('sarko-score-outbox',JSON.stringify(rows));}
async function syncScores(){if(scoreSyncBusy)return;scoreSyncBusy=true;try{for(const row of pendingScores()){const r=await fetch(SHARED_SCORE_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(row),signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error('Score service unavailable');localStorage.setItem('sarko-score-outbox',JSON.stringify(pendingScores().filter(s=>s.id!==row.id||JSON.stringify(s)!==JSON.stringify(row))));}}catch{}finally{scoreSyncBusy=false;}}
async function loadOnlineScores(){const request=++onlineScores.request,mode=onlineScores.mode,difficulty=onlineScores.difficulty;onlineScores.status='loading';render();await syncScores();try{const r=await fetch(`${SHARED_SCORE_URL}?mode=${mode}&difficulty=${difficulty}&page=${onlineScores.page||0}`,{signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error('Unavailable');const data=await r.json();if(request!==onlineScores.request)return;onlineScores.rows=Array.isArray(data.scores)?data.scores:[];onlineScores.status='ready';}catch{if(request!==onlineScores.request)return;onlineScores.rows=[];onlineScores.status='offline';}if(modal==='scores')render();}
function submitScore(){if((state.phase!=='over'&&!state.town?.retry)||state.scoreSent)return;const input=$('#scoreName'),name=(input?.value||state.playerName||'Traveler').trim().slice(0,30)||'Traveler';state.playerName=name;state.scoreRunId||=scoreUUID();state.scoreRunToken||=scoreUUID();const team=state.chosen.map(id=>hero(id).name),row={id:state.scoreRunId,token:state.scoreRunToken,name,mode:state.mode,difficulty:state.mode==='campaign'?state.difficulty:0,cleared:state.cleared,team};queueScore(row);state.scores.push({id:row.id,name,mode:row.mode,difficulty:row.difficulty,cleared:row.cleared,team:team.join(', '),date:new Date().toISOString().slice(0,10)});state.scores.sort((a,b)=>b.cleared-a.cleared);state.scores=state.scores.slice(0,50);state.scoreSent=true;save();toast('Score saved. Uploading to shared rankings…');render();syncScores().then(()=>{toast(pendingScores().some(s=>s.id===row.id)?'Saved offline. Open Scores when connected to upload.':'Score recorded in the shared rankings.');if(modal==='scores')loadOnlineScores();});}
function scoresModal(){const rows=onlineScores.status==='ready'?onlineScores.rows:state.scores.filter(s=>(s.mode||'survival')===onlineScores.mode&&(onlineScores.mode==='survival'||(s.difficulty||0)===onlineScores.difficulty));return modalFrame('Guild high scores',`<p class="muted">Shared community rankings · your name, four heroes and monsters cleared.</p><div class="actions"><button class="button mini ${onlineScores.mode==='survival'?'active':''}" data-action="scoreMode" data-mode="survival">Survival</button><button class="button mini ${onlineScores.mode==='campaign'?'active':''}" data-action="scoreMode" data-mode="campaign">Campaign</button><button class="button mini" data-action="refreshScores">Refresh scores</button></div>${onlineScores.mode==='campaign'?`<div class="actions">${DIFFICULTIES.map((name,i)=>`<button class="button mini ${onlineScores.difficulty===i?'active':''}" data-action="scoreDifficulty" data-index="${i}">${name}</button>`).join('')}</div>`:''}<p role="status" class="small muted">${onlineScores.status==='loading'?'Loading shared rankings…':onlineScores.status==='offline'?'Shared rankings are temporarily unavailable. Showing scores saved on this device.':'Shared rankings'}${pendingScores().length?' · '+pendingScores().length+' saved score(s) waiting to upload.':''}</p><div class="rankings">${rows.length?rows.map((s,i)=>`<div class="shopItem"><span class="eyebrow">#${i+1}</span><div class="grow"><strong>${esc(s.name)}</strong><div class="small muted">${esc(s.team)} · ${esc(s.date)}</div></div><strong>${Number(s.cleared)||0} cleared</strong></div>`).join(''):'<div class="empty">No scores in this category yet. Finish a run and submit your name.</div>'}</div>`);}

function modeHeading(){return state.mode==='campaign'?`World ${state.world+1}: ${campaignData.worlds[state.world]?.name||'Earth'} · Stage ${state.worldStage+1}/20 · ${DIFFICULTIES[state.difficulty]}`:`Wave ${state.cleared+1}`;}
const ROUTE_POINTS=[[[10,86],[29,75],[54,71],[66,64],[60,52],[31,50],[43,42],[70,39],[76,27],[88,17]],[[10,86],[29,74],[47,66],[73,64],[65,51],[31,45],[41,36],[70,30],[77,24],[88,17]]];
const WORLD_POINTS=[[11,45],[25,75],[31,32],[44,29],[57,31],[69,46],[79,54],[89,18]];
function travelMap(world,stage,token){
  const names=[...WORLD_NAMES,'Heavenly City'];
  // Keep the illustrated routes in both Cards and 3D battle modes.
  if(state.mapView==='overview')return `<div class="travelMap overviewMap" role="img" aria-label="Seven Sarko worlds and Heavenly City"><img src="${img('Sarko-Overworld-Map.jpg')}" alt="Seven connected Sarko worlds leading to Heavenly City">${names.map((name,i)=>`<span class="worldPin ${i===world?'current':''}" style="left:${WORLD_POINTS[i][0]}%;top:${WORLD_POINTS[i][1]}%">${i===world?'◆ ':''}${esc(name)}</span>`).join('')}</div>`;
  const second=stage>=10,offset=second?10:0;
  const route=ROUTE_POINTS[second?1:0];
  return `<div class="travelMap routeMap" role="group" aria-label="${esc(names[world])} route, stages ${offset+1} to ${offset+10}, with nine monster encounters and one boss"><img src="${img('Sarko-Route-'+names[world]+(second?'-2':'')+'.jpg')}" alt="Illustrated ${esc(names[world])} route for stages ${offset+1} to ${offset+10}">${route.map(([x,y],i)=>{const n=offset+i+1,boss=n===10||n===20,done=n<=stage,now=n===stage+1;return `<button data-action="${now?'next':'routeInfo'}" ${now?'':'disabled'} class="encounterTile ${boss?'boss':''} ${done?'done':''} ${now?'now':''}" style="left:${x}%;top:${y}%" title="${boss?'Boss':'Monster'} encounter ${n}" aria-label="Stage ${n}: ${boss?'boss':'monster'}${done?', cleared':now?', next':''}"><b>${boss?'♛':'⚔'}</b><small>${n}</small></button>`;}).join('')}<div class="routeParty" style="left:${route[Math.max(0,Math.min(stage-offset,9))][0]}%;top:${route[Math.max(0,Math.min(stage-offset,9))][1]}%"><img src="${img(token.art+'.jpg')}" alt="${esc(token.name)}"></div></div>`;
}
function journeyScreen(){
  const campaign=state.mode==='campaign',world=campaign?state.world:Math.floor(state.cleared/20)%7;
  const names=['Earth','Water','Snow','Thunder','Fire','Shadow','Light'],name=names[world];
  const stage=campaign?state.worldStage:state.regular;
  const progress=campaign?stage/20:(state.cleared%20)/20;
  const nextBoss=[9,19].includes(stage);
  const next=campaign?`World ${world+1} · Stage ${stage+1} of 20`:`Survival wave ${state.cleared+1}`;
  const token=hero(state.arena);
  return `<section class="journeyScreen panel panelpad"><span class="eyebrow">The road between battles · ${campaign?'Book campaign':'Endless survival'}</span><h1>${state.helpResult?esc(state.helpResult):esc(state.enemy.name)+" is defeated"}</h1><p class="journeyIntro">Your party travels onward through ${name}. Choose when to enter the next encounter.</p>
    <div class="mapToolbar"><span class="eyebrow">${state.mapView==='overview'?'The seven worlds and Heavenly City':`${esc(name)} · Stages ${stage>=10?'11–20':'1–10'} · 9 monsters and 1 boss`}</span><button class="button mini alt" data-action="mapView" data-view="${state.mapView==='overview'?'route':'overview'}">${state.mapView==='overview'?'VIEW THIS WORLD':'VIEW ALL WORLDS'}</button></div>${travelMap(world,stage,token)}
    <div class="journeyGrid"><div class="panel panelpad"><span class="eyebrow">Route ahead</span><h2>${esc(next)}</h2><p>${nextBoss?(stage===9?'A midworld boss guards the road.':'The world boss waits at the end of this road.'):'The next monster is waiting beyond the path.'}</p><div class="journeyWorld"><img src="${img('World-'+name+'.jpg')}" alt="${esc(name)} world"><div><strong>${esc(name)} world</strong><span>${campaign?`${stage} of 20 stages cleared in this world`:`${state.cleared} ${state.cleared===1?'monster':'monsters'} cleared in survival`}</span></div></div><button class="button journeyGo" data-action="next">${nextBoss?'TRAVEL TO BOSS':'CHOOSE FIGHT OR HELP'} →</button></div>
    <div class="panel panelpad"><span class="eyebrow">Victory · rewards found</span><h2>${state.helpResult?"Kindness rewarded":esc(state.enemy.name)+" defeated"}</h2>${lootHtml()}<p class="small muted">Gold ${state.gold} · Skill points ${state.points}. A fruit chest is guaranteed after every victory.</p><div class="actions"><button class="button alt" data-action="town">FIRST LIGHT</button></div></div></div></section>`;
}
function heroCard(id,selection=false){const h=hero(id),picked=state.chosen.includes(id),f=state.fighters.find(x=>x.id===id),stats=f?fighterStats(f):h,hit=transient.hits.filter(x=>x.id===id).reduce((n,x)=>n+x.damage,0);return `<article class="card ${selection?'':'heroBattle'} ${picked&&selection?'selected':''} ${f&&f.hp===0?'dead':''} ${transient.heal===id?'healing':''}" style="--hero-accent:${h.color}"><button class="cardbutton" data-action="${selection?'pick':'details'}" data-id="${id}" aria-label="${selection?'Choose':'Inspect'} ${h.name}"><img class="portrait" src="${img(h.art+'.jpg')}" alt="${h.name}"><div class="cardbody"><div class="meta"><h3>${h.name}</h3><span class="role">${selection?'LV 1':`LV ${f.level}`}</span></div><div class="role">${h.role}</div>${hit?`<div class="damageTaken" aria-live="polite">−${hit} DAMAGE TAKEN${transient.enemyMove?` · ${esc(transient.enemyMove)}`:''}</div>`:''}${f?`<div class="bar health" aria-label="Health ${f.hp} of ${stats.max}"><span style="width:${100*f.hp/stats.max}%"></span></div><div class="stats">${f.hp<=0?'FAINTED · '+townRemaining(id)+' battles · ':''}HP ${f.hp}/${stats.max} · ATK ${stats.attack} · DEF ${stats.defense}</div><div class="bar xp"><span style="width:${100*f.xp/(60+f.level*30)}%"></span></div><div class="stats">XP ${f.xp}/${60+f.level*30}</div>`:`<div class="stats">HP ${h.hp} · ATK ${h.attack} · DEF ${h.defense}</div>`}</div></button>${selection?`<span class="pick">${picked?'✓ CHOSEN':'TAP TO PICK'}</span>`:''}</article>`;}
function header(){return `<div class="topbar"><div class="brand"><div class="brandmark"><img src="icon-180.png" alt="Sarko game icon"></div><div><b>SARKO CLASSIC RPG</b><span class="eyebrow small">Guild Arena · ${esc(saveFiles.slots[saveFiles.active].name)}</span></div></div><nav class="nav" aria-label="Main navigation">${lifeButton('fullscreen','FULL SCREEN')}${state.campaignReturn?lifeButton('returnCampaign','RETURN TO CAMPAIGN','',!state.awaiting&&!state.town?.retry):state.mode==='campaign'&&state.phase!=='selection'?lifeButton('enterSurvival','SURVIVAL','',!state.awaiting||!state.openingComplete):''}<button class="button mini" data-action="title">Title Menu</button><button class="button mini" data-action="modal" data-modal="library">Book Library</button><button class="button mini ${modal==='files'?'active':''}" data-action="modal" data-modal="files">Save Files</button><button class="button mini ${modal==='scores'?'active':''}" data-action="modal" data-modal="scores">Scores</button><button class="button mini" data-action="modal" data-modal="coop">Play Together</button><button class="button mini" data-action="town">First Light</button><button class="button mini" data-action="modal" data-modal="guide">Help</button><button class="button mini" data-action="modal" data-modal="report">Report a Bug</button></nav></div>`;}
function selection(){return `<div class="intro"><section class="panel heroIntro"><span class="eyebrow">Guild of First Light · two ways to play</span><h1>Walk Sarko’s story.<br>Build your company.</h1><p>Survival reshuffles all monsters and dungeon guardians. Campaign begins with Sarko, Waiz, and Diago. Complete the first world to meet the guild and choose four companions. Seven worlds each contain 18 monsters and two bosses; full chapters unlock separately in the Book Library. Choose Auto or Manual during combat.</p><div class="statline"><span>✦ ${state.chosen.length}/4 selected</span><span>✦ A chest every victory</span><span>✦ Fruit & gems</span></div><div class="actions"><p class="small muted">Survival opens after you meet the guild in Campaign. It uses this save’s heroes, skills and equipment.</p><button class="button" data-action="startCampaign">BOOK CAMPAIGN</button></div><div class="difficultyPick"><span class="eyebrow">Campaign difficulty · beat one to unlock the next</span><div class="actions">${DIFFICULTIES.map((name,i)=>`<button class="button mini ${state.difficulty===i?'active':'alt'}" data-action="difficulty" data-index="${i}" ${i>state.unlockedDifficulty?'disabled':''}>${name}${i>state.unlockedDifficulty?' 🔒':''}</button>`).join('')}</div></div></section><div class="panel introArt" role="img" aria-label="Sarko themed arena"></div></div><div class="sectionHead"><div><span class="eyebrow">Playable companions</span><h2>Pick your party</h2></div><span class="muted small">Tap a card to select it. Skills can be read in battle.</span></div><div class="roster">${HEROES.map((_,i)=>heroCard(i,true)).join('')}</div>`;}
function lootHtml(){return `<div class="loot">${state.loot.length?state.loot.map(g=>`<div class="lootitem">${g.kind==='Fruit'?fruitIcon(g.name):`<img src="${img('Guild-Gem.jpg')}" alt="">`}<span>${esc(g.rarity)} ${esc(g.name)}</span></div>`).join(''):'<span class="muted">No gear found this fight.</span>'}</div>`;}
function battle(){if(helpBlocked())return `<section class="panel panelpad"><h2>Choose how to help this road</h2><p>This encounter is waiting for your choice.</p>${lifeButton('helpOpen',state.helpQuest.status==='accepted'?'CONTINUE HELP QUEST':'FIGHT OR HELP')}</section>`;if(state.town?.retry)return `<section class="panel panelpad"><h2>Your company is resting in First Light</h2><p>${esc(state.town.message)}</p>${lifeButton('town','ENTER FIRST LIGHT')}</section>`;if(state.awaiting&&state.phase==='battle'&&!threeBusy)return journeyScreen();const e=state.enemy;return `<section class="arenaBackdrop" style="background-image:url('${img(arenaArt())}')"><div class="battleHead"><div><span class="eyebrow">${state.phase==='over'?'Run complete':state.awaiting?'Foe defeated':`${modeHeading()} · ${e.boss?'Boss battle':state.mode==='campaign'?'World encounter':'Survival'}`}</span><h2>${state.phase==='over'?`${state.cleared} monsters cleared`:state.awaiting?`${e.name} defeated`:`${e.name} enters the arena`}</h2><div class="summary"><span>Cleared <b>${state.cleared}</b></span><span>Gold <b>${state.gold}</b></span><span>Skill points <b>${state.points}</b></span></div></div><div class="actions"><button class="button merchantButton" data-action="town">FIRST LIGHT · TOWN</button>${state.phase==='battle'&&!state.awaiting?`<button class="button alt" data-action="mode">${state.manual?'MANUAL':'AUTO'}</button><button class="button alt" data-action="pause">${state.paused?'RESUME':'PAUSE BATTLE'}</button>`:''}<button class="button ghost" data-action="music">${musicOn?'MUSIC ON':'MUSIC OFF'}</button></div></div>${manualPanel()}${state.awaiting?`<div class="panel panelpad" style="margin-top:16px"><span class="eyebrow">Victory · rewards found</span><h3>${e.name} is defeated</h3>${lootHtml()}<p class="muted small">${state.cleared%2===0?"+1 skill point earned.":"Next victory earns a skill point."} A chest is guaranteed each victory. Spend gold in the shop or improve gear before continuing.</p><div class="actions"><button class="button" data-action="next">FIGHT NEXT →</button><button class="button alt" data-action="town">FIRST LIGHT</button></div></div>`:''}${threeFailure?`<div class="panel panelpad arenaError" role="alert"><h3>3D battle paused</h3><p>Your progress is safe. The arena could not load.</p><button class="button" data-action="view">RETRY 3D ARENA</button></div>`:'<div id="battle3d" aria-label="3D battle arena"></div>'}<div class="battleGrid"><div class="heroes">${state.fighters.map(f=>heroCard(f.id)).join('')}</div><article class="card enemyCard ${e.boss?'bossCard':''}" data-world="${WORLD_NAMES[e.world??0]}"><img src="${img(enemyArt(e))}" alt="${e.name}"><div class="cardbody"><span class="eyebrow">${e.boss?'Boss':'Monster'} · ${WORLD_NAMES[e.world??0]} world · level ${e.level}</span><h3>${e.name}</h3><div class="bar enemy" aria-label="Enemy health ${e.hp} of ${e.max}"><span style="width:${100*e.hp/e.max}%"></span></div><p class="stats">HP ${e.hp}/${e.max} · ATK ${e.attack} · GUARD ${e.guard}</p><button class="button mini alt" data-action="enemy">Attack patterns</button><div class="damageDealt" aria-live="polite">${transient.chips.map(c=>`<span class="chip" style="color:${c.color}">${esc(c.text)}${c.text.startsWith('−')?' DAMAGE DEALT':''}</span>`).join('')}</div></div>${transient.weapon>=0?`<img class="strike" src="${img('Weapon-'+hero(transient.weapon).art+'.png')}" alt="">`:''}</article></div>${state.phase==='over'?`<div class="panel panelpad" style="margin-top:16px"><span class="eyebrow">Your guild record</span><h3>Enter a name for the high scores</h3><div class="actions"><input id="scoreName" class="nameInput" maxlength="30" autocomplete="nickname" placeholder="Your name" value="${esc(state.playerName)}" ${state.scoreSent?'disabled':''}><button class="button" data-action="submit" ${state.scoreSent?'disabled':''}>${state.scoreSent?'SCORE SAVED':'SAVE SCORE'}</button><button class="button alt" data-action="reset">NEW RUN</button></div><p class="muted small">Submit your score to the shared rankings. Offline scores wait here until you reconnect.</p></div>`:''}<div class="battleFoot"><div class="panel panelpad"><span class="eyebrow">Battle record</span><div class="log" aria-live="polite">${state.log.slice(0,8).map(line=>`<p>${esc(line)}</p>`).join('')}</div></div><div class="panel panelpad"><span class="eyebrow">How to play</span><div class="detail"><strong>Tap a hero</strong> to read all eight skills and their cooldowns.<br><strong>Auto/Manual</strong> switches between watching and choosing each action. Pause to inspect gear or use the forge and church.<br><strong>After victory</strong>, inspect the loot and choose when to fight next.<br><strong>Bosses</strong> bring fruit and a gem. Each world has bosses at encounters 10 and 20 in Survival and Campaign.</div></div></div></section>`;}
function modalFrame(title,body){return `<div class="overlay" id="overlay"><section class="panel panelpad modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modalHead"><div><span class="eyebrow">Guild of First Light</span><h2>${esc(title)}</h2></div>${modal==='opening'?'<button class="button alt" data-action="openingSkip">SKIP SCENE</button>':modal==='guildParty'?'':'<button class="button alt" data-action="close">CLOSE ✕</button>'}</div>${body}</section></div>`;}
// Short playable adaptations of the chapter material in campaign-data.json.
// Combat, rewards and progression remain owned by the existing campaign.
const JOURNEY_GOALS = [
 ['Walk with Waiz to First Light','Keep the eastern road open','Put Diago’s lesson into practice','Protect the road beyond the eastern gate'],
 ['Help the team cross together','Secure the flooded approach','Keep the crossing open for others','Face the guardian of the crossing'],
 ['Stand together after the guild attack','Clear a route for the rebuilding effort','Carry hope through the mountain pass','Break through the corruption in the pass'],
 ['Reach the farming settlement','Protect the road to the Hidden Garden','Hold together when the formation breaks','Defend the Garden’s approach'],
 ['Follow the road toward the Dragon King','Hold the line against the gathering creatures','Protect one another through the fire','Break through the fiery blockade'],
 ['Enter the canyon without abandoning one another','Open a path through the shadow host','Stand against the King of Lies','Defeat the force barring the canyon exit'],
 ['Carry the wounded toward the light','Clear the final approach together','Make the road safe for those behind you','Open the last road to the Heavenly City']
];
const JOURNEY_DIALOGUE = [
 [['Waiz','Nobody reaches the Heavenly City alone. Your team will need you, too.'],['Sarko','Then I’ll take the first step with them.'],['Diago','You do not learn to protect people by waiting until you feel brave. Stand with your team.'],['Sarko','The road is safer now. Let’s use what we found before we go on.'],['Diago','You held your ground. Now learn when to strike and when to let someone help.'],['Waiz','That is why we brought a team.'],['Sarko','I still remember the flood. I don’t want fear to choose for me again.'],['Diago','Then choose the next right step. We will take it together.']],
 [['Waiz','You don’t have to face that fear alone. Watch my flank, and I’ll watch yours.'],['Sarko','Together, then.'],['Sarko','There are others who need this crossing. We cannot leave the road like this.'],['Waiz','One stretch at a time. Keep everyone close.'],['Amaya','The crossing is behind us. Check the wounded before we press on.'],['Sarko','We keep moving as a team.'],['Waiz','That creature is blocking the way. Ready?'],['Sarko','Ready enough to stand beside you.']],
 [['Amaya','The guild can be rebuilt. First, we keep the road safe for those helping us.'],['Sarko','Then that is where we begin.'],['Hailey','Everything feels different after the attack.'],['Sarko','We can still choose what we do for one another.'],['Amaya','Fear does not disappear because you hide it. Stay with the formation.'],['Waiz','And stay with us.'],['Sarko','We have carried our fears this far. We do not have to carry them alone.'],['Amaya','Then let’s finish the crossing.']],
 [['Naomi','Protecting people means noticing the lives beyond the battlefield.'],['Sarko','The farmers need a safe road. We can give them that.'],['Isaac','We hold the path. They bring their families through.'],['Sarko','No one gets left behind.'],['Amaya','Their attacks are coordinated. We must keep our own line together.'],['Sarko','I can protect the team without trying to control every step.'],['Levi','Strength is not yours alone to carry.'],['Sarko','I’ll trust the others to stand with me.']],
 [['Levi','Rex calls dependence weakness. He has forgotten what love can endure.'],['Sarko','Then we will show it by how we fight together.'],['Hailey','There are so many of them.'],['Sarko','Look at us, Hailey. You are not facing them alone.'],['Hailey','I can help keep everyone standing.'],['Amaya','Then we will make room for your light.'],['Levi','Hold your purpose when the fire comes.'],['Sarko','Protect one another. That is our way through.']],
 [['Naomi','Not every voice in this canyon tells the truth. Remember who stands beside you.'],['Sarko','I remember.'],['Waiz','The road keeps trying to split us up.'],['Amaya','Then we give it no opening.'],['Sarko','My failures do not have to decide what I do now.'],['Levi','Stand in that truth.'],['Isaac','Together to the end.'],['Sarko','Together.']],
 [['Sarko','The light is closer. Check on everyone before we go on.'],['Naomi','There is still a road to walk.'],['Hailey','We have come so far.'],['Waiz','And we are bringing everyone with us.'],['Levi','Others will follow this road. Leave it safer than we found it.'],['Sarko','Then our journey can help theirs.'],['Sarko','I can protect them and love them. I do not have to be their savior.'],['Levi','Walk forward, Shepherd.']]
];
function narrativeContext(){
 const world=state.pendingScene?.world??state.world;
 const segment=state.pendingScene?Math.floor(state.pendingScene.stage/5):0;
 const w=campaignData.worlds[world]||{first:0,after:3};
 const chapter=Math.min(w.after,w.first+1+Math.min(segment,w.after-w.first-1));
 return {world,segment,chapter,goal:JOURNEY_GOALS[world]?.[segment]||'Travel onward together'};
}
function narrativePages(){
 const c=narrativeContext(),lines=JOURNEY_DIALOGUE[c.world].slice(c.segment*2,c.segment*2+2);
 return lines.map(([speaker,text])=>({speaker,text}));
}
function narrativeModal(kind){
 const c=narrativeContext(),pages=narrativePages(),page=Math.min(state.scenePage||0,pages.length-1),line=pages[page];
 const portrait=HEROES.find(h=>h.name===line.speaker)?.art||'Sarko';
 const opening=c.world===0&&c.segment===0;
 const art='book/'+['training','water','snow','thunder','fire','shadow','light'][c.world]+'.jpg';
 const goalEnd=(c.segment+1)*5;
 return modalFrame(opening?'A road we walk together':c.goal,
 `<section class="narrativeScene" data-dialogue-next role="button" tabindex="0" aria-label="Continue dialogue"><img class="narrativeArt" src="${img(art)}" alt="${esc([...new Set(pages.map(p=>p.speaker))].join(' and '))} on the ${WORLD_NAMES[c.world]} road"><div class="narrativeSpeech">${bookFace(line.speaker==='Levi'?'levi':'guild',line.speaker,'thoughtful')}<div><span class="eyebrow">${esc(line.speaker)}</span><p>${esc(line.text)}</p></div></div><div data-dialogue-audio="line-${c.world}-${c.segment}-${page}" class="dialoguePlayer"></div><p class="dialogueContinue">${page+1} / ${pages.length} · Click or press A to continue</p></section>`+
 `<div class="storyObjective"><span class="eyebrow">Your next objective</span><h3>${esc(c.goal)}</h3><p>Win encounters ${c.segment*5+1}–${goalEnd} on this road.${goalEnd===10||goalEnd===20?' A boss guards the final encounter.':''} Victories open the next scene.</p></div>`+
 `${opening?'<p>Meet Sarko and Waiz in this adaptation of the opening chapters, then take your chosen four heroes onto the road. Guided play teaches manual attacks and equipping your first reward.</p>':''}`+
 `<div class="actions"><button class="button" data-action="${kind==='scene'?'continueScene':'continueStory'}">${page<pages.length-1?'NEXT LINE':opening?'BEGIN JOURNEY':'TAKE THE NEXT STEP'}</button>${opening?'<button class="button alt" data-action="guidedStory">PLAY GUIDED INTRO</button>':''}<button class="button ghost" data-action="skipNarrative">${opening?'SKIP INTRO & TUTORIAL':'SKIP SCENE'}</button></div>`+
 `<p class="muted">Full chapters are collected separately in the Book Library. Defeat bosses to unlock them.</p>`);
}
function advanceNarrative(){if((state.scenePage||0)<narrativePages().length-1){state.scenePage=(state.scenePage||0)+1;save();render();return true;}state.scenePage=0;return false;}
function finishNarrative(skip=false,guided=false){
 state.scenePage=0;if(skip)state.guidedIntro=false;
 if(guided){state.guidedIntro=true;state.manual=true;manualChoice=null;}
 if(modal==='scene')continueScene(true);else continueStory(true);
}
function storyObjectiveBanner(){if(state.rexPhase==='demonstration')return `<aside class="storyObjective"><strong>Protect the company · ${state.rexRounds||0} / 2 enemy turns</strong><p>This first meeting with Rex is a survival encounter. He will withdraw; he is not defeated here.</p></aside>`;if(state.malacharPhase?.startsWith('garden'))return `<aside class="storyObjective"><strong>The Hidden Garden · Malachar’s allies</strong><p>The whole guild fights together. Support each other through the allied boss waves.</p></aside>`;if(state.malacharPhase)return '<aside class="storyObjective"><span class="eyebrow">The guild stands together</span><strong>'+ (state.malacharPhase==='hold'?'Hold the line · '+(state.malacharRounds||0)+' / 3 enemy turns':'Levi has opened the way · Drive Malachar back')+'</strong><p>'+(state.malacharPhase==='hold'?'Protect and heal your companions. Malachar’s shadow restores him until help arrives.':'The company is restored. Attack together to force his retreat.')+'</p></aside>';
 if(state.mode!=='campaign'||state.phase==='selection')return '';
 const segment=Math.min(3,Math.floor(Math.min(19,state.worldStage)/5)),goal=JOURNEY_GOALS[state.world]?.[segment];
 if(!goal)return '';
 const guidance=state.guidedIntro?(state.cleared===0?'Diago’s lesson: choose Basic Attack or a ready skill below. Each hero takes one action. You can switch to Auto at any time.':state.inventory.some(g=>g.kind==='Fruit'&&g.equippedTo!==null)?'Your first fruit is equipped. Its bonus now helps its wearer in battle. Continue along the road when ready.':'Your victory earned Spirit Fruit. Open Fruit Tree, choose a hero, and press EQUIP beside a fruit to strengthen that hero.') : '';
 return `<aside class="storyObjective" aria-label="Story objective"><span class="eyebrow">${state.phase==='over'&&state.worldStage===20?'Journey complete':'Story objective'}</span><strong>${esc(goal)}</strong><span>${Math.min(5,state.worldStage-segment*5)} / 5 encounters cleared</span>${guidance?`<p>${esc(guidance)}</p><div class="actions">${state.cleared?'<button class="button mini" data-action="modal" data-modal="tree">OPEN FRUIT TREE</button>':''}<button class="button mini ghost" data-action="endGuide">END TUTORIAL</button></div>`:''}</aside>`;
}

function unlockBookChapter(){
 const count=campaignData.chapters.length||17;if((state.bookChapters||0)>=count)return;
 state.bookChapters=Math.min(count,Math.max(0,Number(state.bookChapters)||0)+1);
 note('Book Library: chapter '+state.bookChapters+' is unlocked. Read or listen whenever you like.');
}
function bookLibrary(){
 const chapters=campaignData.chapters||[],unlocked=Math.min(chapters.length,Math.max(0,Number(state.bookChapters)||0));
 return modalFrame('The Book of Sarko · Library', '<p class="muted">Your quiet place to read and listen. Each boss victory in Campaign or Survival unlocks the next chapter. Unlocked chapters stay in this save file when you start another run.</p><p class="eyebrow">'+unlocked+' / '+chapters.length+' chapters unlocked</p><div class="bookShelves">'+chapters.map((chapter,i)=>{
 const n=i+1;if(n>unlocked)return '<article class="bookLocked"><span class="eyebrow">Chapter '+n+'</span><h3>'+esc(chapter.title)+'</h3><p>Locked · Defeat '+(n-unlocked)+' more boss'+(n-unlocked===1?'':'es')+' to read and listen.</p></article>';
 const world=Math.max(0,campaignData.worlds.findIndex(w=>i>=w.first&&i<w.after));
 return '<details class="bookChapter"><summary>Chapter '+n+' · '+esc(chapter.title)+'</summary><img loading="lazy" class="bookIllustration" src="'+('assets/book/'+['chapter-01','training','training','water','guild','levi','guild','snow','garden','shadow','thunder','fire','fire','shadow','fire','light','light'][i]+'.jpg')+'" alt="Illustration of the '+esc(campaignData.worlds[world]?.name||'Sarko')+' journey"><p>'+esc(chapter.summary)+'</p><audio controls preload="none" src="assets/story/Chapter-'+String(n).padStart(2,'0')+'-Full.mp3" aria-label="Listen to chapter '+n+'"></audio><div class="chapterText">'+esc(chapter.text)+'</div></details>';
 }).join('')+'</div>');
}
function storyModal(){return state.pendingStory?narrativeModal('story'):bookLibrary();}
function continueStory(skip=false){if(state.pendingStory&&!skip&&advanceNarrative())return;state.scenePage=0;modal='';if(state.pendingStory){state.pendingStory=false;if(state.awaiting&&state.phase==='battle')spawnEnemy();else state.paused=false;}save();render();}
function sceneModal(){
  if(state.pendingScene)return narrativeModal("scene");
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
function continueScene(skip=false){if(state.pendingScene&&!skip&&advanceNarrative())return;state.scenePage=0;state.pendingScene=null;modal='';if(state.awaiting&&state.phase==='battle')spawnEnemy();save();render();}
function tabs(){const ids=state.phase==='selection'?state.chosen:state.chosen;return `<div class="heroTabs">${ids.map(id=>`<button class="button mini ${selectedHero===id?'active':'alt'}" data-action="heroTab" data-id="${id}">${hero(id).name}</button>`).join('')}</div>`;}
function detailsModal(id){const h=hero(id),skills=data.skills[id===7?'Magnar':h.name]||[];return modalFrame(`${h.name} · skills`,`${tabs()}<div class="summary"><span>HP <b>${h.hp}</b></span><span>ATK <b>${h.attack}</b></span><span>DEF <b>${h.defense}</b></span><span>HEAL <b>${h.healing}</b></span><span>CRIT <b>${Math.round(h.crit*100)}%</b></span></div><p class="muted">${esc(h.role)} · Tap a skill to read it. In Manual mode, pick a ready skill or Basic Attack on each hero's turn.</p><div class="skillGrid">${skills.map((s,i)=>`<div class="skill"><img src="${img('Skill-'+id+'-'+i+'.png')}" alt=""><div><strong>${esc(s.name)}</strong><p>${esc(s.description)}</p><span class="eyebrow small">Rank ${rankFor(id,i)} · ${cooldown(id,i)} turn cooldown</span></div></div>`).join('')}</div>`);}
function filesModal(){return modalFrame('Save files',`<button class="button" data-action="modal" data-modal="account">ACCOUNT / CLOUD SAVES</button><p class="muted">Your game saves automatically in this browser. Choose a file to switch runs. Download a backup to keep a copy or move it to another device.</p><div class="saveSlots">${saveFiles.slots.map((slot,i)=>`<div class="saveSlot ${i===saveFiles.active?'current':''}"><div class="saveSlotHead"><span class="eyebrow">File ${i+1}${i===saveFiles.active?' · Active':''}</span><span class="small muted">${slot?new Date(slot.state.savedAt||Date.now()).toLocaleString():'Empty'}</span></div>${slot?`<input id="fileName${i}" class="nameInput" maxlength="30" value="${esc(slot.name)}" aria-label="Name for file ${i+1}"><p class="small muted">${slot.state.phase==='selection'?'Choosing heroes':slot.state.phase==='over'?'Run finished':'Wave '+(slot.state.cleared+1)} · ${slot.state.cleared||0} defeated · ${slot.state.chosen.map(id=>hero(id)?.name).filter(Boolean).join(', ')||'No team yet'}</p>`:'<strong>Empty file</strong>'}<div class="actions">${slot?`<button class="button mini ${i===saveFiles.active?'active':'alt'}" data-action="switchFile" data-index="${i}" ${i===saveFiles.active?'disabled':''}>${i===saveFiles.active?'CURRENT FILE':'SWITCH TO FILE'}</button><button class="button mini alt" data-action="renameFile" data-index="${i}">RENAME</button><button class="button mini alt" data-action="downloadFile" data-index="${i}">DOWNLOAD BACKUP</button><button class="button mini alt" data-action="shareFile" data-index="${i}">SHARE BACKUP / EMAIL</button><button class="button mini danger" data-action="deleteFile" data-index="${i}">DELETE</button>`:`<button class="button mini" data-action="switchFile" data-index="${i}">CREATE FILE</button>`}<button class="button mini alt" data-action="chooseImport" data-index="${i}">IMPORT BACKUP</button><input id="fileImport${i}" class="fileImport" type="file" accept=".json,application/json" data-import-slot="${i}" aria-label="Import backup into file ${i+1}"></div></div>`).join('')}</div><p class="small muted">Files stay on this device in this browser. Private browsing or clearing site data can erase them.</p>`);}
function shopOffers(){
  let seed=71411+(state.shopRevision||0)*7919;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const prices=[80,150,280,520,950];
  return Array.from({length:10},()=>{
    const roll=random(),tier=roll<.52?0:roll<.80?1:roll<.94?2:roll<.99?3:4;
    return {name:FRUITS[Math.floor(random()*FRUITS.length)],attribute:FRUITS[Math.floor(random()*FRUITS.length)],rarity:RARITIES[tier],price:prices[tier],bonus:.05+tier*.025};
  });
}
function shopModal(){const offers=shopOffers();return modalFrame('First Light fruit merchant',lifeShop()+`<div class="shopItem"><img src="${img('Guild-Shop.jpg')}" alt=""><div class="grow"><strong>Ten Spirit Fruit offers · shared by Survival and Campaign</strong><div class="small muted">Arena gold ${state.gold} · Stock ${state.shopRevision} · Purchases stay in the arena inventory.</div></div><button class="button mini" data-action="refresh" ${state.gold<100?'disabled':''}>REFRESH 100</button></div><div class="shopGrid" style="margin-top:14px">${offers.map((o,i)=>`<div class="shopItem">${fruitIcon(o.name)}<div class="grow"><strong>${o.rarity} ${o.name} Fruit</strong><div class="small muted">${esc(fruitStat(o))}</div></div><button class="button mini" data-action="buy" data-index="${i}" ${state.phase==='selection'||state.shopBought.includes(i)||state.gold<o.price?'disabled':''}>${state.shopBought.includes(i)?'SOLD':o.price+' GOLD'}</button></div>`).join('')}</div>`);}
function forgeModal(){const fruit=state.inventory.filter(g=>g.kind==='Fruit'),gems=state.inventory.filter(g=>g.kind==='Gem'),target=state.inventory[selectedGear],gem=state.inventory[selectedGem];return modalFrame('First Light forge',`<div class="shopItem"><img src="${img('Guild-Forge.jpg')}" alt=""><div><strong>Merge five matching fruits or socket a gem.</strong><div class="small muted">Gold ${state.gold} · Fruit ${fruit.length} · Gems ${gems.length}</div></div></div><div class="sectionHead"><h3>Spirit fruits</h3><span class="muted small">Select a fruit to merge or socket. Use Fruit Tree to equip it.</span></div><div class="inventory">${fruit.length?fruit.map(g=>{const ix=state.inventory.indexOf(g);return `<button class="shopItem cardbutton ${selectedGear===ix?'active':''}" data-action="selectGear" data-index="${ix}">${fruitIcon(g.name)}<div class="grow"><strong>${esc(g.rarity)} ${esc(g.name)} Fruit</strong><div class="small muted">${esc(fruitStat(g))} · ${g.equippedTo===null?'Unequipped':'Equipped by '+hero(g.equippedTo).name}${g.gem?' · Gem socketed':''}</div></div></button>`;}).join(''):'<div class="empty">No fruit yet. Defeat foes or visit the shop.</div>'}</div><div class="sectionHead"><h3>Gems</h3></div><div class="inventory">${gems.length?gems.map(g=>{const ix=state.inventory.indexOf(g);return `<button class="shopItem cardbutton ${selectedGem===ix?'active':''}" data-action="selectGem" data-index="${ix}"><img src="${img('Guild-Gem.jpg')}" alt=""><div class="grow"><strong>${esc(g.rarity)} ${esc(g.name)}</strong><div class="small muted">${g.socketedTo?'Socketed':'Ready to socket'}</div></div></button>`;}).join(''):'<div class="empty">Bosses always drop a gem.</div>'}</div><div class="actions"><button class="button" data-action="merge" ${!target||target.kind!=='Fruit'?'disabled':''}>MERGE FIVE MATCHING</button><button class="button alt" data-action="socket" ${!target||!gem||target.gem||gem.socketedTo?'disabled':''}>SOCKET GEM</button><button class="button alt" data-action="unsocket" ${!target?.gem?'disabled':''}>UNSOCKET</button><button class="button alt" data-action="modal" data-modal="tree">GO TO FRUIT TREE →</button></div><p class="muted small">Merging costs 120 gold and consumes four extra fruits of the same name and rarity. Socketing costs 60 gold.</p>`);}
function churchModal(){const id=state.chosen.includes(selectedHero)?selectedHero:state.chosen[0]??0,skills=data.skills[id===7?'Magnar':hero(id).name]||[];return modalFrame('Church of First Light',`<button class="townServiceImage" data-action="lifeTab" data-index="5"><img src="assets/Guild-Church.jpg" alt="Wisdom study"><span>Wisdom study ${unlocked(lifeData(),5)?'':'· LOCKED'}</span></button><div class="shopItem"><img src="${img('Guild-Church.jpg')}" alt=""><div><strong>Train the gifts of your heroes.</strong><div class="small muted">Team skill points ${state.points} · Gold ${state.gold} · One point every two victories.</div></div></div>${tabs()}<div class="skillGrid">${skills.map((s,i)=>{const rank=rankFor(id,i),cost=skillUpgradeCost(i,rank);return `<div class="skill"><img src="${img('Skill-'+id+'-'+i+'.png')}" alt=""><div><strong>${esc(s.name)}</strong><p>${esc(s.description)}</p><span class="eyebrow small">Rank ${rank}/5 · ${cooldown(id,i)} turn cooldown</span></div><button class="button mini" data-action="upgrade" data-id="${id}" data-index="${i}" ${rank>=5||state.points<1||state.gold<cost?'disabled':''}>${rank>=5?'MAX':cost+' GOLD'}</button></div>`;}).join('')}</div>`);}
function gearPriorityUI(id){
 const priorities=state.gearPriorities?.[id]||[];
 return '<div class="actions"><button class="button" data-action="autoEquip" data-id="'+id+'">AUTO EQUIP STRONGEST</button></div><details class="panel panelpad"><summary>GEAR PRIORITIES</summary><p>Select stats in priority order. Click a selected stat to remove it. Auto Equip uses your priorities, then bonus strength; it leaves other heroes’ gear in place.</p><div class="actions">'+FRUITS.map((name,i)=>{const rank=priorities.indexOf(name);return '<button class="button mini" data-action="gearPriority" data-id="'+id+'" data-index="'+i+'" aria-pressed="'+(rank>=0)+'">'+(rank>=0?(rank+1)+'. ':'')+esc(FRUIT_STATS[name])+'</button>';}).join('')+'</div></details>';
}
function toggleGearPriority(id,index){if(!state.fighters.some(f=>f.id===id)||!FRUITS[index])return;state.gearPriorities=state.gearPriorities||{};const list=state.gearPriorities[id]||[];const name=FRUITS[index];state.gearPriorities[id]=list.includes(name)?list.filter(x=>x!==name):[...list,name];save();render();}
function compareAutoGear(a,b,id){
 const priorities=state.gearPriorities?.[id]||[];
 for(const stat of priorities){const av=fruitAttribute(a)===stat?a.bonus:0,bv=fruitAttribute(b)===stat?b.bonus:0;if(av!==bv)return bv-av;}
 const total=g=>(g.bonus||0)+(state.inventory.find(x=>x.id===g.gem)?.bonus||0);
 return total(b)-total(a)||(b.bonus||0)-(a.bonus||0)||(b.equippedTo===id?1:0)-(a.equippedTo===id?1:0);
}
function autoEquipStrongest(id){
 const fighter=state.fighters.find(f=>f.id===id);if(!fighter||fighter.hp<=0)return toast('A fainted hero must recover before equipping fruit.');
 for(const name of FRUITS){const choices=state.inventory.filter(g=>g.kind==='Fruit'&&g.name===name&&(g.equippedTo===null||g.equippedTo===id)).sort((a,b)=>compareAutoGear(a,b,id));if(!choices.length)continue;for(const g of choices)g.equippedTo=null;choices[0].equippedTo=id;}
 fighter.hp=Math.min(fighter.hp,fighterStats(fighter).max);save();render();toast('Strongest available fruit equipped for '+hero(id).name+'.');
}
function treeModal(){
  const id=state.chosen.includes(selectedHero)?selectedHero:state.chosen[0]??0;
  const fruit=state.inventory.filter(g=>g.kind==='Fruit');
  const available=fruit.filter(g=>g.equippedTo===null);
  const equipped=fruit.filter(g=>g.equippedTo===id);
  const others=fruit.filter(g=>g.equippedTo!==null&&g.equippedTo!==id);
  const fruitRow=g=>{const ix=state.inventory.indexOf(g);return `<div class="shopItem fruitRow">${fruitIcon(g.name)}<div class="grow"><strong>${esc(g.rarity)} ${esc(g.name)}</strong><div class="fruitStat">${esc(fruitStat(g))}</div><div class="small muted">${g.gem?'Gem socketed · ':''}${g.equippedTo===null?'Unequipped':'Equipped by '+hero(g.equippedTo).name}</div></div>${g.equippedTo===null?'':`<img class="wearerHead" src="${img(hero(g.equippedTo).art+'.jpg')}" alt="${hero(g.equippedTo).name}'s head">`}<button class="button mini" data-action="equip" data-id="${id}" data-index="${ix}">${g.equippedTo===id?'REMOVE':'EQUIP'}</button></div>`;};
  return modalFrame(`${hero(id).name} · fruit tree`,
    `<div class="treeHero"><img class="heroHead" src="${img(hero(id).art+'.jpg')}" alt="${hero(id).name}"><div class="grow"><span class="eyebrow">Equipping now</span><h3>${hero(id).name}</h3><p class="small muted">Choose another hero below. Each hero can equip one fruit of each kind. Main attributes roll randomly; read each fruit’s bonus before equipping.</p></div><button class="button mini" data-action="unequipAll" data-id="${id}" ${equipped.length?'':'disabled'}>REMOVE ALL FRUIT</button></div>${tabs()}${gearPriorityUI(id)}`+
    `<div class="sectionHead"><h3>Unequipped fruit · ${available.length}</h3><span class="small muted">Tap EQUIP to place a fruit on ${hero(id).name}'s tree.</span></div><div class="inventory">${available.length?available.map(fruitRow).join(''):'<div class="empty">No unequipped fruit. Win battles or visit the shop.</div>'}</div>`+
    `<div class="sectionHead"><h3>Fruit of the Spirit tree</h3></div><div class="spiritTree" role="group" aria-label="${hero(id).name}'s Fruit of the Spirit tree">${FRUITS.map((name,i)=>{const g=equipped.find(x=>x.name===name),[left,top]=TREE_POSITIONS[i];return `<div class="spiritBranch ${g?'filled':'empty'}" style="left:${left}%;top:${top}%" title="${esc(name)}${g?' · '+esc(fruitStat(g)):' · empty'}">${g?fruitIcon(name):''}<span class="spiritBranchName">${esc(name)}</span></div>`;}).join('')}</div><p class="muted small">Each branch names its fruit. The picture appears only when equipped; its bonus is listed below.</p>`+
    `<div class="gearSlots">${FRUITS.map(name=>{const g=equipped.find(x=>x.name===name);return `<div class="gearSlot">${g?fruitIcon(name):'<span class="emptyFruit">+</span>'}<div><strong>${name}</strong><div class="small muted">${g?`${esc(g.rarity)} · ${esc(fruitStat(g))}`:'Empty branch'}</div></div></div>`;}).join('')}</div>`+
    `<div class="sectionHead"><h3>Equipped by ${hero(id).name}</h3></div><div class="inventory">${equipped.length?equipped.map(fruitRow).join(''):'<div class="empty">No fruit equipped yet.</div>'}</div>`+
    `${others.length?`<div class="sectionHead"><h3>Equipped by other heroes</h3></div><div class="inventory">${others.map(fruitRow).join('')}</div>`:''}`);
}
function enemyModal(){const e=state.enemy,kit=enemyKit(e);return modalFrame(e.name,`<div class="shopItem"><img src="${img(enemyArt(e))}" alt=""><div><strong>Level ${e.level} · HP ${e.hp}/${e.max}</strong><p>Attack ${e.attack} · Guard ${e.guard}</p><span class="eyebrow">Basic attack</span><p><strong>${esc(kit.basic)}</strong> · A light strike against one hero.</p><span class="eyebrow">${kit.skills.length} skills</span>${kit.skills.map(name=>`<p><strong>${esc(name)}</strong><br>${esc(enemySkillDescription(name))}</p>`).join('')}${townBossRule()?`<p class="townNotice"><strong>${townBossRule().mechanic}</strong>: without a conscious counter hero, incoming damage is reduced by 72%. ${townBossRule().hint}</p>`:''}<p class="muted">One action per turn. Basic attacks alternate with skills, in the order shown. The monster deck reshuffles after all families appear.</p></div></div>`);}
let forgeTutorialStep=0,forgeTutorialReplay=false;
const FORGE_LESSONS=[
 ['Welcome to the First Light forge','Improve the fruit your heroes wear. Merging raises a fruit’s rarity; socketing adds a gem’s bonus. The forge works on fruit in your inventory, including equipped fruit. Use Fruit Tree to equip the result.','Guild-Forge.jpg'],
 ['Merge five matching fruits','Press SELECT beside the fruit you want to keep. You need four extra fruits with the same name and rarity, plus 120 gold. Donors must be unequipped, unlocked, and have no gem. MERGE FIVE MATCHING consumes those four donors and upgrades the selected fruit. Legendary fruit cannot be upgraded further.','Guild-Forge.jpg'],
 ['Choose a gem, then its fruit slot','Read each gem’s bonus and press CHOOSE. Press SOCKET beside a fruit with an empty slot. It costs 60 gold. The gem’s bonus applies to the hero wearing that fruit. To move a gem, SELECT its fruit and press REMOVE GEM; removal is free and returns the gem for reuse.','Guild-Gem.jpg'],
 ['Protect items and use automation','LOCKED protects an item from being consumed by merging. It does not stop equipping or socketing. Auto Forge uses eligible weak duplicates; Auto Socket puts strong gems into equipped fruit first. Read the displayed number of upgrades and total gold cost before confirming either action.','Guild-Forge.jpg']
];
function forgeTutorialUI(){
 if(state.forgeTutorialSeen&&!forgeTutorialReplay)return '<button class="button alt" data-action="forgeTutorialReplay">FORGE TUTORIAL · MERGE & SOCKET</button>';
 const [title,text,art]=FORGE_LESSONS[forgeTutorialStep];
 return `<section class="panel panelpad" aria-label="Forge tutorial"><div class="shopItem"><img src="${img(art)}" alt=""><div><span class="eyebrow">Forge tutorial · ${forgeTutorialStep+1} / ${FORGE_LESSONS.length}</span><h3>${title}</h3><p>${text}</p></div></div><div class="actions"><button class="button alt" data-action="forgeTutorialBack" ${forgeTutorialStep===0?'disabled':''}>BACK</button><button class="button" data-action="forgeTutorialNext">${forgeTutorialStep===FORGE_LESSONS.length-1?'READY TO FORGE':'NEXT'}</button><button class="button alt" data-action="forgeTutorialSkip">SKIP TUTORIAL</button></div></section>`;
}
function forgeTutorialHandle(action){
 if(!action.startsWith('forgeTutorial'))return false;
 if(action==='forgeTutorialReplay'){forgeTutorialStep=0;forgeTutorialReplay=true;}
 if(action==='forgeTutorialBack')forgeTutorialStep=Math.max(0,forgeTutorialStep-1);
 if(action==='forgeTutorialNext'&&forgeTutorialStep<FORGE_LESSONS.length-1)forgeTutorialStep++;
 else if(action==='forgeTutorialNext'||action==='forgeTutorialSkip'){state.forgeTutorialSeen=true;forgeTutorialReplay=false;forgeTutorialStep=0;save();}
 render();return true;
}

function forgeModalV2(){
  const fruit=state.inventory.filter(g=>g.kind==='Fruit'),gems=state.inventory.filter(g=>g.kind==='Gem');
  const target=state.inventory[selectedGear],gem=state.inventory[selectedGem];
  return modalFrame('First Light forge',forgeTutorialUI()+`<button class="townServiceImage" data-action="lifeTab" data-index="4"><img src="assets/Guild-Forge.jpg" alt="Trade forging workshop"><span>Trade forging ${unlocked(lifeData(),4)?'':'· LOCKED'}</span></button>`+forgeAutomationUI()+
    `<div class="forgeGuide"><img src="${img('Guild-Forge.jpg')}" alt=""><div><h3>Fit a gem into a fruit</h3><p>Choose a gem, then tap SOCKET on a fruit below. Gems add the shown bonus to that hero while the fruit is equipped. Socketing costs 60 gold.</p><p class="eyebrow">Gold ${state.gold} · ${fruit.length} fruit · ${gems.filter(g=>!g.socketedTo).length} available gems</p></div></div>`+
    `<div class="forgeColumns"><section><h3>1 · Choose a gem</h3><div class="inventory">${gems.filter(g=>!g.socketedTo).length?gems.filter(g=>!g.socketedTo).map(g=>{const i=state.inventory.indexOf(g);return `<button class="shopItem cardbutton ${selectedGem===i?'active':''}" data-action="selectGem" data-index="${i}"><img src="${img('Guild-Gem.jpg')}" alt=""><div class="grow"><strong>${esc(g.rarity)} ${esc(g.name)}</strong><div class="small muted">${esc(gemStat(g))}</div></div><span>${selectedGem===i?'SELECTED':'CHOOSE'}</span></button>`;}).join(''):'<div class="empty">Defeat a boss to find a gem.</div>'}</div></section>`+
    `<section><h3>2 · Choose a fruit slot</h3><div class="inventory">${fruit.length?fruit.map(g=>{const i=state.inventory.indexOf(g),socketed=state.inventory.find(x=>x.id===g.gem);return `<div class="shopItem">${fruitIcon(g.name)}<div class="grow"><strong>${esc(g.rarity)} ${esc(g.name)} Fruit</strong><div class="small muted">${esc(fruitStat(g))}${socketed?` · ${esc(socketed.name)}`:''}</div></div><button class="button mini" data-action="socketInto" data-index="${i}" ${g.gem||!gem||state.gold<60?'disabled':''}>${g.gem?'FILLED':'SOCKET'}</button><button class="button mini alt" data-action="selectGear" data-index="${i}">SELECT</button></div>`;}).join(''):'<div class="empty">Win a chest or buy fruit in the shop.</div>'}</div></section></div>`+
    `<div class="forgeActions"><div><strong>Selected fruit:</strong> ${target?.kind==='Fruit'?esc(target.name):'None'} · <strong>Selected gem:</strong> ${gem?.kind==='Gem'?esc(gem.name)+' ('+esc(gemStat(gem))+')':'None'}</div><div class="actions"><button class="button" data-action="merge" ${!target||target.kind!=='Fruit'?'disabled':''}>MERGE FIVE MATCHING · 120 GOLD</button><button class="button alt" data-action="unsocket" ${!target?.gem?'disabled':''}>REMOVE GEM FROM SELECTED FRUIT</button><button class="button alt" data-action="modal" data-modal="tree">GO TO FRUIT TREE</button></div></div>`);
}
function socketInto(index){selectedGear=index;socket();}
let travelView=null,travelHost=null,travelKey=null,travelVersion=0;
function closeTravel3D(){++travelVersion;travelView?.dispose();travelView=null;travelHost?.remove();travelHost=null;travelKey=null;}
async function syncTravel3D(){
 const slot=document.querySelector('#travel3d');
 if(!slot||!state.view3d||!canUse3D()){if(travelHost)closeTravel3D();return;}
 const world=state.mode==='campaign'?state.world:Math.floor(state.cleared/20)%7,stage=state.mode==='campaign'?state.worldStage:state.regular;
 const token=hero(state.arena),key=[world,stage,token.name,state.mapView].join(':');
 if(travelHost&&travelKey===key){slot.append(travelHost);travelView?.stage.setPaused(!!modal);return;}
 closeTravel3D();const version=++travelVersion;travelKey=key;
 travelHost=document.createElement('div');travelHost.className='travel3dStage';travelHost.setAttribute('aria-busy','true');slot.append(travelHost);
 try{
  const {Travel3DView}=await import('./rpg3d-travel.js');if(version!==travelVersion)return;
  travelView=new Travel3DView(travelHost,{onError:message=>{if(version===travelVersion){closeTravel3D();fail3D(Error(message));}}});
  if(state.mapView==='overview')await travelView.showOverview(threeManifest,world);
  else {const start=stage>=10?10:0;let monsterIndex=0,bossIndex=0;
   const encounters=Array.from({length:10},(_,i)=>{const encounter=start+i;if(encounter<stage)return null;let name;if(i===9){name=state.mode==='campaign'?(encounter===9?MIDWORLD_BOSSES[world]:BOSSES[CAMPAIGN_BOSSES[world]])?.name:BOSSES[state.bossDeck?.[bossIndex++]]?.name;}else name=state.deck[monsterIndex++];const entry=threeManifest.enemies[name];return entry?{name,entry}:null;});
   await travelView.show({encounters,entry:threeManifest.worlds[`${WORLD_NAMES[world]}-${stage>=10?2:1}`],hero:threeManifest.heroes[token.name],stage,world:WORLD_NAMES[world]});}
  if(version===travelVersion)travelView.stage.setPaused(!!modal);
 }catch(error){if(version===travelVersion){closeTravel3D();fail3D(error);}}
}
let serviceView=null,serviceHost=null,serviceKey=null,serviceVersion=0,serviceEquipmentKey=null;
function closeService3D(){++serviceVersion;serviceView?.dispose();serviceView=null;serviceHost?.remove();serviceHost=null;serviceKey=null;serviceEquipmentKey=null;}
async function syncService3D(){
 const entry=threeManifest?.services?.[modal],panel=document.querySelector('#overlay .modal');
 if(modal==='tree'||!state.view3d||!canUse3D()||!entry?.reviewed||!panel){if(serviceHost)closeService3D();return;}
 const id=state.chosen.includes(selectedHero)?selectedHero:state.chosen[0]??0;
 const equipped=state.inventory.filter(g=>g.kind==='Fruit'&&g.equippedTo===id).map(g=>g.name),equipmentKey=JSON.stringify([id,equipped]);
 const options={fruits:threeManifest.fruits,equipped};
 if(serviceHost&&serviceKey===modal){panel.querySelector('.modalHead').after(serviceHost);if(modal==='tree'&&serviceView&&equipmentKey!==serviceEquipmentKey){serviceEquipmentKey=equipmentKey;const current=serviceView;try{await current.show(entry,options);}catch(error){if(serviceView===current){closeService3D();toast('The 3D fruit tree could not load. Equipment controls are still available.');}}}return;}
 closeService3D();const version=++serviceVersion;serviceKey=modal;
 serviceHost=document.createElement('div');serviceHost.className='service3d';serviceHost.setAttribute('aria-label',`${modal} 3D scene`);serviceHost.setAttribute('aria-busy','true');panel.querySelector('.modalHead').after(serviceHost);
 try{
  const {Service3DView}=await import('./rpg3d-service.js');if(version!==serviceVersion)return;
  serviceView=new Service3DView(serviceHost,{onError:message=>{if(version===serviceVersion){closeService3D();toast(message);}}});
  serviceEquipmentKey=equipmentKey;await serviceView.show(entry,options);if(version!==serviceVersion)return;
  serviceHost.setAttribute('aria-busy','false');
 }catch(error){if(version===serviceVersion){closeService3D();toast('The 3D service scene could not load. Its controls are still available.');}}
}

const HELP_ARTICLES=[
 ['start','Getting started','story tutorial controls opening home waiz diago beginner','Start Campaign to follow Sarko from his home in First Light. Waiz introduces the journey; Diago explains combat. Click a dialogue scene or press Xbox A for the next line, B for the previous line. SKIP SCENE moves past the current scene. Dialogue plays automatically.'],
 ['combat','Attacks, skills and Auto priority','battle fighting manual automatic cooldown turns damage heal critical','Manual lets you choose a basic attack or a ready skill for the acting hero. Auto chooses for you. Click a skill in Auto to make it first priority when ready. Cooldowns are measured in turns. Red numbers show damage, blue shows a critical hit, and healing light with bright numbers shows health restored. Pause Battle gives you time to read or change equipment.'],
 ['quests','Fight or help a neighbour','quest quests accept refuse materials supplies decisions people tile','On a regular encounter tile, choose Fight or Help. You cannot do both on the same tile. Read the quest response and supply requirements before accepting. An unkind response can lose the quest opportunity. Accepted quests stay saved until you gather the required supplies and deliver them. Boss tiles require a fight.'],
 ['supplies','Finding quest supplies','fish wood ore meal cooking craft requirements level gathering apprentice','The quest lists the material, amount and life-skill level you need. Gather supplies in First Light. Early quests can offer supervised fishing before the permanent fishing unlock. Later quests need more advanced materials and crafts. Delivering consumes the requested supplies and awards gold, hero experience, experience in the skills used, and one more chest than fighting.'],
 ['fruit','Equipping and removing fruit','gear equipment tree equip unequip empty branch character strongest auto priority','Open First Light, then Fruit Tree. Choose the hero first. Unequipped fruit appears above the equipped list. Choose a fruit and equip it in its matching branch; empty branches show what is missing. The fruit’s main attribute is random, so read its actual bonus rather than judging by its colour. REMOVE ALL returns that hero’s fruit to the inventory. Auto Equip chooses strong available gear using your selected priorities.'],
 ['merge','Merging fruit in the Forge','merge merging five matching upgrade rarity donors gold forging','SELECT the fruit you want to keep. Merging costs 120 gold and consumes four extra fruits of the same name and rarity. Those donors must be unequipped, unlocked and have no gem. The selected fruit moves up one rarity. Legendary fruit cannot be upgraded further. The Forge has a step-by-step tutorial you can replay.'],
 ['socket','Putting gems into fruit slots','socket slot gems gem bonus remove unsocket gear forge','In the Forge, CHOOSE an available gem and read its bonus. Press SOCKET on an empty fruit slot. It costs 60 gold. The gem helps the hero wearing that fruit. To move it, SELECT its fruit and choose REMOVE GEM; removal is free. Each fruit holds one gem. Auto Socket favours strong gems and equipped fruit, and does not replace gems already fitted.'],
 ['locks','Equipment locks and automation','locked lock auto forge consume protect strongest','Locking protects an item from being consumed by merging. It does not prevent Auto Equip replacing it or Auto Socket adding a gem. Auto Forge preserves equipped and locked fruit as upgrade targets and consumes eligible weak duplicates. Check the previewed number of upgrades and gold cost before using it.'],
 ['town','First Light services','town shop store merchant forge inn church guild hall map','Open FIRST LIGHT and click the illustrated building or gathering place. The market buys and sells supplies and fruit. The Forge merges fruit and fits gems. The Church upgrades skills. The Guild Hall changes your team and offers training. Locked gathering places explain that you need more boss progress.'],
 ['skills','Upgrading hero skills','church skill points gold cost rank cooldown','Visit the Church, choose a hero and read the skill you want to improve. Upgrades cost gold and skill points; the button shows the current cost. Your team earns a skill point every two victories. Skills can reach rank five. Higher ranks improve skills and can reduce cooldowns.'],
 ['life','Unlocking life skills','fishing cooking woodcutting mining forging wisdom tutorial unlock bosses','Fishing opens after the first Malachar story battle. Each later boss unlocks another craft, starting with cooking. Each life skill has its own first-time tutorial. Higher skill levels unlock better gathering options. Cooking consumes recipe ingredients and makes meals that heal and grant temporary bonuses. Meals do not revive fainted heroes.'],
 ['party','Changing heroes and fainting','guild recruit team teammates character dead death faint three battles rescue debt negative gold','Change your team at the Guild Hall. New recruits begin at level one; returning heroes keep their training. A fainted hero rests for three completed battles. If the whole team falls, rescuers bring you to First Light and charge gold. If you cannot pay, the balance can become negative. Rested reserve heroes let you continue.'],
 ['bosses','Bosses and team choices','boss counter difficult weakness hint middle end 10 20','Each world has 18 regular encounters and bosses at stages ten and twenty. Bosses have a basic attack and four skills; regular monsters have a basic attack and two skills. Some bosses strongly resist teams without a suitable counter hero. Read their attack patterns, and watch for a hint after losing.'],
 ['survival','Campaign and Survival together','survival transfer shared experience gold progress equipment stats','After meeting the guild, enter Survival between Campaign encounters. It uses the same heroes, levels, skills and equipment from this save. Gold and modest experience earned there return with you. Return to Campaign between encounters to resume the same place on its map.'],
 ['training','Replaying an encounter','redo replay training practice monster chest treasure boss','The Guild Hall lets you replay regular monsters you have already defeated. Bosses cannot be replayed. Training earns gold and experience but omits the guaranteed treasure from normal victory rewards. It does not advance the map, story or boss unlocks.'],
 ['saves','Save files and backups','save saved load import export download backup email switch lost reset new game','The game saves in this browser on this device. SAVE FILES has three slots. Download a backup JSON file to keep or move your progress, then IMPORT BACKUP to restore it. SHARE BACKUP / EMAIL opens your device’s share sheet when supported; otherwise it downloads a file you can attach to an email. A new run resets its fruit and skill upgrades. Clearing browser data can remove local saves.'],
 ['rankings','Shared rankings','leaderboard rankings scores name level campaign survival quests online','SCORES shows highest hero level, furthest Campaign progress, furthest Survival progress and most quests completed. Progress submits automatically when connected. Set your public display name there. Pending updates retry after a connection returns. Scores do not replace your local saved-game files.'],
 ['book','The separate Book Library','book chapters listen audio library unlock story narration','The Book Library is separate from the playable Campaign story. Defeating bosses unlocks more chapters to read or hear with pictures. Campaign dialogue remains part of the journey and plays automatically as you advance scenes.'],
 ['screen','Full screen, phone and Xbox controls','fullscreen screen iphone mobile ios controller xbox gamepad buttons','Use FULL SCREEN on the title or game menu. Browsers that do not offer it may support Add to Home Screen instead. Touch and mouse select buttons; an Xbox-compatible controller uses D-pad or left stick to move, A to select, B to go back, and Start to pause battle. Browser and device controller support can vary.'],
 ['problem','Missing sound or a technical problem','bug glitch broken problem audio sound loading frozen screenshot report','Click the page once if the browser blocks automatic sound. If a scene fails to load, save a backup before refreshing. Use REPORT A BUG to describe what happened and attach or paste screenshots. Include what you expected and the steps that caused it. The report includes the build and basic game context, never your full save or ranking token.']
].map(([id,title,tags,text])=>({id,title,tags,text}));
let supportQuery='',supportDraft={description:'',email:''},supportPictures=[],supportStatus='';
const SUPPORT_EMAIL='godsrevival@live.com';
function supportResults(){const words=supportQuery.toLowerCase().trim().split(/\s+/).filter(w=>w&&!['how','do','i','the','to','a','in','my','is','and','can'].includes(w));const rows=HELP_ARTICLES.filter(a=>words.every(w=>(a.title+' '+a.tags+' '+a.text).toLowerCase().includes(w)));return rows.length?rows.map(a=>`<details class="supportArticle" ${words.length?'open':''}><summary>${esc(a.title)}</summary><p>${esc(a.text)}</p>${a.id==='merge'||a.id==='socket'?'<button class="button mini" data-action="supportForge">OPEN FORGE TUTORIAL</button>':''}</details>`).join(''):'<p>No matching help topic. Try “gems”, “fishing”, “save”, or “quests”, or report the problem below.</p>';}
function supportGuide(){return modalFrame('Help · First Light guide',`<label for="supportSearch">What do you need help with?</label><input id="supportSearch" class="nameInput" type="search" placeholder="Search skills, gems, quests, saves…" value="${esc(supportQuery)}"><div id="supportResults">${supportResults()}</div><button class="button" data-action="modal" data-modal="report">REPORT A BUG</button>`);}
function supportContext(){return JSON.stringify({build:document.querySelector('meta[name="sarko-build"]')?.content||'unknown',mode:state.mode,world:WORLD_NAMES[state.world||0],encounter:(state.worldStage||0)+1,scene:state.openingScene||null,heroes:state.chosen.map(id=>hero(id)?.name),browser:navigator.userAgent,screen:innerWidth+'x'+innerHeight},null,2);}
function supportReport(){return modalFrame('Report a Bug',`<p>Your description, selected screenshots and basic game/browser details will be sent through FormSubmit to <strong>${SUPPORT_EMAIL}</strong>. Your full save and ranking token are not included.</p><form id="supportForm"><label for="bugDescription">What needs fixing? What happened, and what did you expect?</label><textarea id="bugDescription" data-support-field="description" required minlength="10" maxlength="6000" rows="6" placeholder="Tell us how to reproduce the problem…">${esc(supportDraft.description)}</textarea><label for="bugEmail">Your email for a reply (optional)</label><input id="bugEmail" data-support-field="email" type="email" maxlength="254" value="${esc(supportDraft.email)}"><label for="bugImages">Upload screenshots, or paste an image here with Ctrl+V</label><input id="bugImages" type="file" accept="image/png,image/jpeg,image/webp" multiple><p class="small">Up to 3 screenshots, 8 MB total. PNG, JPG or WebP.</p><div class="supportPictures">${supportPictures.map((p,i)=>`<figure><img src="${p.url}" alt="Attached screenshot ${i+1}"><figcaption>${esc(p.file.name)}</figcaption><button type="button" class="button mini alt" data-action="supportRemove" data-index="${i}">REMOVE</button></figure>`).join('')}</div><details><summary>View included game details</summary><pre>${esc(supportContext())}</pre></details><p class="small" role="status">${esc(supportStatus)}</p><div class="actions"><button type="button" class="button" data-action="supportSend">SEND BUG REPORT</button><button type="button" class="button alt" data-action="supportClear">CLEAR DRAFT</button><button type="button" class="button alt" data-action="modal" data-modal="guide">SEARCH HELP</button></div><p class="small">Sending opens a separate confirmation tab so your game stays here. Finish any verification shown there.</p></form>`);}
function supportAddPictures(files){let added=0;for(const file of files){if(!['image/png','image/jpeg','image/webp'].includes(file.type)){supportStatus='Please use PNG, JPG or WebP screenshots.';continue;}if(supportPictures.length>=3||supportPictures.reduce((n,p)=>n+p.file.size,0)+file.size>8*1024*1024){supportStatus='Please keep attachments to 3 images and 8 MB total.';break;}supportPictures.push({file,url:URL.createObjectURL(file)});added++;}if(added)supportStatus=added+' screenshot'+(added===1?'':'s')+' attached.';render();}
function supportSend(){const original=document.querySelector('#supportForm');if(!original?.reportValidity())return;save();const form=document.createElement('form');form.method='POST';form.action='https://formsubmit.co/'+SUPPORT_EMAIL;form.enctype='multipart/form-data';form.target='_blank';form.rel='noopener';form.hidden=true;
const fields={_subject:'Sarko Classic RPG · Beta bug report',_template:'table',description:supportDraft.description,game_context:supportContext()};if(supportDraft.email)fields.email=supportDraft.email;
for(const [name,value] of Object.entries(fields)){const input=document.createElement('input');input.type='hidden';input.name=name;input.value=value;form.append(input);}
try{supportPictures.forEach((p,i)=>{const input=document.createElement('input');input.type='file';input.name='attachment'+(i+1);const transfer=new DataTransfer();transfer.items.add(p.file);input.files=transfer.files;form.append(input);});document.body.append(form);form.submit();setTimeout(()=>form.remove(),1000);supportStatus='Submission opened in a new tab. Complete the confirmation there. Your draft remains here until you clear it.';}catch{form.remove();supportStatus='This browser could not attach the screenshots. Please try a current browser or email your report and screenshots to '+SUPPORT_EMAIL+'.';}render();}
function supportHandle(action,index){if(!action.startsWith('support'))return false;if(action==='supportSend')supportSend();else if(action==='supportClear'){supportPictures.forEach(p=>URL.revokeObjectURL(p.url));supportPictures=[];supportDraft={description:'',email:''};supportStatus='';render();}else if(action==='supportRemove'){const p=supportPictures[index];if(p){URL.revokeObjectURL(p.url);supportPictures.splice(index,1);}render();}else if(action==='supportForge'){forgeTutorialStep=0;forgeTutorialReplay=true;openModal('forge');}return true;}
document.addEventListener('input',event=>{if(event.target.id==='supportSearch'){supportQuery=event.target.value;const results=document.querySelector('#supportResults');if(results)results.innerHTML=supportResults();}const field=event.target.dataset?.supportField;if(field&&Object.hasOwn(supportDraft,field))supportDraft[field]=event.target.value;});
document.addEventListener('change',event=>{if(event.target.id==='bugImages')supportAddPictures(Array.from(event.target.files||[]));});
document.addEventListener('paste',event=>{if(modal!=='report')return;const files=Array.from(event.clipboardData?.items||[]).filter(item=>item.kind==='file'&&item.type.startsWith('image/')).map(item=>item.getAsFile()).filter(Boolean);if(files.length){event.preventDefault();supportAddPictures(files);}});

let cloud=null,cloudApi=null,cloudReady=false,cloudMessage='',cloudEmail='',cloudWorking=false;
function cloudCapture(){return JSON.parse(JSON.stringify({version:1,files:saveFiles,profile:playerProfile()}));}
function cloudValid(p){return p?.version===1&&p.files?.version===1&&Array.isArray(p.files.slots)&&p.files.slots.length===3&&Number.isInteger(p.files.active)&&p.files.active>=0&&p.files.active<3&&validState(p.files.slots[p.files.active]?.state)&&p.files.slots.every(s=>s===null||typeof s?.name==='string'&&s.name.length<=100&&validState(s.state));}
function cloudApply(p){if(!cloudValid(p))throw Error('This save cannot be loaded.');const copy=structuredClone(p);localStorage.setItem(SAVE_KEY,JSON.stringify(copy.files));if(copy.profile?.token)localStorage.setItem('sarko-player-profile',JSON.stringify(copy.profile));else localStorage.removeItem('sarko-player-profile');close3D();saveFiles=copy.files;state=loadState();state.paused=true;manualChoice=null;selectedHero=state.chosen[0]??0;selectedGear=-1;selectedGem=-1;transient={chips:[],hits:[],enemyMove:'',heal:-1,weapon:-1};titleOpen=true;render();}
function cloudSummary(p){return p?.files?.slots.map((s,i)=>s?`File ${i+1}: ${s.name} · ${s.state.cleared||0} encounters`:`File ${i+1}: Empty`).join(' / ')||'No cloud save yet';}
function accountModal(){const status=cloud?.status||'guest',signed=!!cloud?.user;return modalFrame('Account & Cloud Saves',`<p>Play as a guest on this device, or sign in by email code to carry your three save files and ranking identity between devices. Your email is private and is not shown on rankings.</p>${!cloudReady?'<p>Cloud sign-in is being set up. Guest saves and downloadable backups remain available.</p>':!signed?`<label for="cloudEmail">Email address</label><input id="cloudEmail" class="nameInput" type="email" autocomplete="email" maxlength="254" value="${esc(cloudEmail)}"><button class="button" data-action="cloudCode" ${cloudWorking?'disabled':''}>SEND SIGN-IN CODE</button><label for="cloudCode">Code from your email</label><input id="cloudCode" class="nameInput" inputmode="numeric" autocomplete="one-time-code" maxlength="8" placeholder="Enter your code"><button class="button" data-action="cloudVerify" ${cloudWorking?'disabled':''}>SIGN IN</button>`:`<p>Signed in as <strong>${esc(cloud.user.email||'Player')}</strong></p><p role="status">${esc({checking:'Checking cloud saves…',choose:'Choose how to start syncing this device.',conflict:'Another device has a different save. Nothing has been overwritten.',offline:'Cloud connection unavailable. Progress stays on this device. Reconnect before switching devices.',pending:'Saved on this device · cloud upload pending.',synced:'Cloud save is up to date.',guest:'Guest play'}[status]||status)}</p>${['choose','conflict'].includes(status)?`<div class="panel panelpad"><h3>This device</h3><p>${esc(cloudSummary(cloudCapture()))}</p><h3>Cloud</h3><p>${esc(cloudSummary(cloud.remote?.payload))}</p><p>Choose one set of files. A local recovery copy is kept before replacing anything.</p>${cloud.remote?'<button class="button" data-action="cloudLoad">USE CLOUD SAVES ON THIS DEVICE</button>':''}<button class="button alt" data-action="cloudUpload">${cloud.remote?'REPLACE CLOUD WITH THIS DEVICE':'UPLOAD THIS DEVICE’S SAVES'}</button></div>`:''}<div class="actions"><button class="button" data-action="cloudSync" ${cloudWorking?'disabled':''}>SYNC NOW</button><button class="button alt" data-action="cloudSignout" ${cloudWorking?'disabled':''}>SIGN OUT & RETURN TO GUEST</button></div><p class="small">Wait for “Cloud save is up to date” before moving to another device. Signing out restores this device’s guest files; your account files remain in the cloud.</p>`}<p role="status">${esc(cloudMessage)}</p><div class="actions">${lifeButton('modal','SAVE FILES / DOWNLOAD BACKUP','data-modal="files"')}${lifeButton('cloudRecovery','DOWNLOAD RECOVERY COPY')}<label for="cloudRecoveryImport">Restore a recovery copy</label><input id="cloudRecoveryImport" type="file" accept=".json,application/json">${!signed?lifeButton('cloudGuest','PLAY AS GUEST'):''}</div>`);}
async function cloudAction(action){if(!action.startsWith('cloud'))return false;if(cloudWorking)return true;cloudMessage='';
if(action==='cloudGuest'){modal='';render();return true;}
if(action==='cloudRecovery'){const payload=cloud?.read('sarko-cloud-recovery')||cloud?.read('sarko-guest-backup');if(!payload){cloudMessage='No recovery copy yet.';render();return true;}const blob=new Blob([JSON.stringify(payload)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='Sarko-Cloud-Recovery.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000);return true;}
const emailInput=document.querySelector('#cloudEmail'),codeInput=document.querySelector('#cloudCode');if(emailInput)cloudEmail=emailInput.value.trim();const code=codeInput?.value.trim();
cloudWorking=true;
try{
 if(!cloudApi)throw Error('Email sign-in is not configured yet.');
 if(action==='cloudCode'){if(!cloudEmail||!emailInput.reportValidity())throw Error('Enter a valid email address.');const {error}=await cloudApi.auth.signInWithOtp({email:cloudEmail,options:{shouldCreateUser:true}});if(error)throw error;cloudMessage='If the address can receive mail, a sign-in code is on its way. Check spam too.';}
 if(action==='cloudVerify'){if(!/^\d{6,8}$/.test(code||''))throw Error('Enter the code from your email.');const {data,error}=await cloudApi.auth.verifyOtp({email:cloudEmail,token:code,type:'email'});if(error)throw error;await cloud.connect(data.user);}
 if(action==='cloudLoad'){cloud.useRemote();modal='account';}
 if(action==='cloudUpload')await cloud.useLocal();
 if(action==='cloudSync'){if(['offline','conflict','checking'].includes(cloud.status))await cloud.connect(cloud.user);await cloud.flush();}
 if(action==='cloudSignout'){if(cloud.record?.dirty){await cloud.flush();if(cloud.record?.dirty)throw Error('Cloud upload is pending. Stay signed in and reconnect, or download a backup before switching devices.');}const {error}=await cloudApi.auth.signOut({scope:'local'});if(error)throw error;cloud.disconnect();modal='account';}
}catch(error){cloudMessage=error.message||'Could not connect. Your local saves are safe.';}finally{cloudWorking=false;render();}return true;}
async function initCloud(){try{const config=await fetch('cloud-config.json',{cache:'no-store'}).then(r=>r.json());const {createCloudClient}=await import('./cloud-client.js');cloudApi=await createCloudClient(config);if(!cloudApi)return;const {CloudSync}=await import('./cloud-sync.js');cloud=new CloudSync({api:cloudApi,storage:localStorage,capture:cloudCapture,apply:cloudApply,valid:cloudValid,changed(){if(cloud?.status==='conflict'){state.paused=true;modal='account';}if(modal==='account')render();}});cloudReady=true;const {data,error}=await cloudApi.auth.getUser();if(data?.user){await cloud.connect(data.user);}else if(!navigator.onLine){cloudMessage='Offline. Guest files are available; reconnect to sign in.';}else if(error&&localStorage.getItem('sarko-cloud-active')){state.paused=true;cloudMessage='Please sign in again to sync your account files.';}if(modal==='account')render();setInterval(()=>cloud.flush(),15000);window.addEventListener('online',async()=>{if(cloud.user&&!coopActive()){await cloud.connect(cloud.user);await cloud.flush();}});document.addEventListener('visibilitychange',()=>{if(document.hidden)cloud.flush();});}catch{cloudMessage='Cloud connection unavailable. Guest saves still work.';}}
document.addEventListener('input',event=>{if(event.target.id==='cloudEmail')cloudEmail=event.target.value;});

let coopWire=null,coopRules=null,coopPicks=[],coopMessage='',coopWorking=false,coopRuntime=null,coopPollTimer=null;
function coopIntercept(action,button){
 const readOnly=['fullscreen','music','close','details','heroTab','priorityHero','enemy','scoreMode','scoreDifficulty','rankPage','refreshScores'];
 if(readOnly.includes(action))return false;
 if(action==='modal'){if(['coop','guide','report','scores','library','details'].includes(button.dataset.modal))return false;toast('Leave the party to change your personal files or equipment.');return true;}
 if(['basic','manualSkill','skillPriority'].includes(action)){
   const id=action==='skillPriority'?Number(button.dataset.id):state.fighters[state.actor]?.id;
   if(!coopOwns(id)){toast('Your teammate controls that hero.');return true;}
   if(!coopLeader()){coopWire.action(id,action==='basic'?-1:Number(button.dataset.index),action==='skillPriority'?'priority':'skill').catch(e=>{coopMessage=e.message;toast(e.message);});return true;}
   return false;
 }
 if(!coopLeader()){toast('The party leader chooses the route and shared activities.');return true;}
 if(['switchFile','deleteFile','renameFile','reset','titleNew','titleConfirmNew','start','startCampaign','returnCampaign','enterSurvival','townConfirm','cloudSignout','equip','unequipAll','buy','upgrade','merge','socket','autoEquip','autoForge','autoSocket'].includes(action)){toast('Leave the party before changing your solo game or equipment.');return true;}
 if(action==='next'&&coopRuntime.reward){if(!coopRuntime.solo.coopRewardIds?.includes(coopRuntime.reward.id)){toast('Wait for the encounter reward to save.');return true;}if(!coopWire.room.members.every(m=>(coopWire.room.receipts||[]).some(r=>r.user_id===m.user_id&&r.battle_id===coopRuntime.reward.battleId))){toast('Waiting for both players’ rewards to save.');return true;}coopRuntime.reward=null;}
 coopRuntime.dirty=true;return false;
}
function coopRewardsPending(){return !!coopRuntime?.reward&&!coopWire.room.members.every(m=>(coopWire.room.receipts||[]).some(r=>r.user_id===m.user_id&&r.battle_id===coopRuntime.reward.battleId));}

async function coopSettle(snapshot=coopWire?.room?.snapshot){
 if(!coopRuntime||!snapshot?.session||!snapshot.state||coopRuntime.claiming||coopRuntime.settling||cloud.busy)return;
 if(snapshot.reward&&!coopRuntime.solo.coopRewardIds?.includes(snapshot.reward.id))return;
 coopRuntime.settling=true;
 try{
  const room=coopWire.room.id,solo=structuredClone(coopRuntime.solo),shared=snapshot.state,session=snapshot.session;
  const noncombat=shared.gold-session.baseGold-session.rewardGold;
  solo.coopSettlements??={};const previous=solo.coopSettlements[room]?.noncombat||0;
  solo.gold+=noncombat-previous;solo.coopSettlements[room]={noncombat};
  solo.life=coopRules.settleSharedLife(session.members,session.sharedBase,shared.life,cloud.user.id,level);
  for(const f of shared.fighters.filter(f=>coopRuntime.owned.includes(f.id))){const own=solo.fighters.find(x=>x.id===f.id)||solo.town?.roster?.[f.id];if(own){own.hp=f.hp;own.level=f.level;own.xp=f.xp;own.ward=f.ward;}}
  solo.town??={};solo.town.fainted??={};for(const id of coopRuntime.owned){if(shared.town?.fainted?.[id]){solo.town.fainted[id]=structuredClone(shared.town.fainted[id]);for(const g of solo.inventory)if(g.equippedTo===id)g.equippedTo=null;}else delete solo.town.fainted[id];}
  if(coopLeader()&&shared.town){solo.town??={};for(const k of ['rescues','retry','message','trainingWins','encounters'])if(shared.town[k]!==undefined)solo.town[k]=structuredClone(shared.town[k]);}
  if(JSON.stringify(solo)===JSON.stringify(coopRuntime.solo))return;
  const payload=structuredClone(cloud.record.payload);payload.files.slots[payload.files.active].state=solo;
  const result=await cloudApi.write(cloud.record.revision,payload);if(!result.ok)throw Error('Another device changed your save. Shared progress is retained in the party; resolve the save conflict before leaving.');
  coopRuntime.solo=solo;saveFiles.slots[saveFiles.active].state=solo;localStorage.setItem(SAVE_KEY,JSON.stringify(saveFiles));cloud.record={revision:result.revision,payload,dirty:false};cloud.put(cloud.key(),cloud.record);cloud.notify('synced');
 }catch(e){coopMessage=e.message;state.paused=true;throw e;}finally{if(coopRuntime)coopRuntime.settling=false;}
}

function coopActive(){return !!coopRuntime;}
function coopLeader(){return !!coopWire?.leader;}
function coopOwns(id){return !coopRuntime||coopRuntime.owned.includes(id);}
function coopModal(){const r=coopWire?.room;return modalFrame('Adventure together · Two-player Co-op Beta',`<p>Each player brings two different heroes. The leader chooses the route; each player controls their own heroes. Rewards are shared equally and hero experience is doubled. Life-skill levels and supplies combine while teamed up.</p>${!cloud?.user?`${lifeButton('modal','SIGN IN TO PLAY TOGETHER','data-modal="account"')}<p>Guest play is always available solo.</p>`:!r?`<div class="actions">${cloud?.read('sarko-coop-recovery')?.user===cloud?.user?.id?lifeButton('coopResume','RECONNECT TO PARTY'):''}${lifeButton('coopCreate','CREATE PARTY')}<label for="coopInvite">Friend’s invitation code</label><input id="coopInvite" class="nameInput" maxlength="36" placeholder="Paste your friend’s invitation">${lifeButton('coopJoin','JOIN FRIEND')}</div>`:`<p>Party status: <strong>${esc(r.status)}</strong> · ${r.members.length}/2 players</p><label for="coopCode">Invitation code — share privately with your friend</label><input id="coopCode" class="nameInput" readonly value="${esc(r.invite)}"><div class="townRoster">${HEROES.map((h,id)=>{const taken=r.members.some(m=>m.user_id!==cloud.user.id&&m.loadout?.heroes.includes(id));const f=(coopRuntime?.solo||state).fighters.find(f=>f.id===id)||(coopRuntime?.solo||state).town?.roster?.[id];return `<button class="townHero ${coopPicks.includes(id)?'selected':''}" data-action="coopPick" data-id="${id}" ${taken||!f||f.hp<=0||coopRuntime?'disabled':''}><img src="${img(h.art+'.jpg')}" alt=""><span>${h.name}</span><small>${taken?'TEAMMATE’S HERO':!f?'Not recruited':f.hp<=0?'Fainted':coopPicks.includes(id)?'YOUR HERO':'LV '+f.level}</small></button>`;}).join('')}</div><p>${coopPicks.length}/2 chosen</p>${!coopRuntime?lifeButton('coopReady','READY WITH THESE HEROES','',coopPicks.length!==2):''}<div class="actions">${r.members.map((m,i)=>`<span>Player ${i+1}${m.user_id===cloud.user.id?' · You':''}${m.user_id===r.leader_id?' · Leader':''}${m.ready?' · Ready':''}</span>${coopLeader()&&m.user_id!==r.leader_id&&r.status!=='playing'?lifeButton('coopLeader','MAKE PLAYER '+(i+1)+' LEADER',`data-user="${m.user_id}"`):''}`).join('')}${coopLeader()?lifeButton('coopStart',coopRuntime?'RESUME TOGETHER':'START TOGETHER','',r.members.length!==2||r.members.some(m=>!m.ready)):''}${coopRuntime?lifeButton('coopPause','PAUSE PARTY'):''}${lifeButton('coopLeave','LEAVE PARTY')}</div>`}<p role="status">${esc(coopMessage)}</p><p class="small">Finish the current solo encounter before creating a party. Co-op follows the leader’s road; a guest’s solo campaign position is preserved. If either player disconnects, the party pauses.</p>`);}
function coopLoadout(){const solo=coopRuntime?.solo||state;const fighters=coopPicks.map(id=>solo.fighters.find(f=>f.id===id)||solo.town?.roster?.[id]);return structuredClone({heroes:coopPicks,fighters,inventory:solo.inventory.filter(g=>coopPicks.includes(g.equippedTo)),ranks:Object.fromEntries(Object.entries(solo.ranks).filter(([k])=>coopPicks.includes(Number(k.split('-')[0])))),life:solo.life||freshLife()});}
async function coopConnect(){if(coopWire)return;if(!cloud?.user||!cloudApi)throw Error('Sign in first.');await cloud.flush();if(cloud.status!=='synced')throw Error('Sync your cloud saves before joining a party.');coopRules=await import('./coop-core.js');const {CoopClient}=await import('./coop-client.js');coopWire=new CoopClient({api:cloudApi,user:cloud.user,onRoom:coopRoomChanged,onError(error){if(coopRuntime)state.paused=true;coopMessage='Connection lost. Party paused; your solo save is safe.';if(modal==='coop')render();}});coopPollTimer=setInterval(async()=>{await coopWire?.poll();if(coopRuntime&&coopLeader()&&coopRuntime.dirty&&!coopRuntime.publishing&&!threeBusy)await coopPublish();},1500);}
function coopSnapshot(){const keys=['gold','points','mode','difficulty','world','worldStage','cleared','regular','turn','actor','phase','paused','awaiting','chosen','fighters','inventory','ranks','enemy','battleId','loot','log','deck','bossDeck','arena','manual','mapView','helpQuest','helpResult','questsCompleted','life','town','gardenWave','rexRounds','training','campaignCarry','unlockedDifficulty','openingComplete','openingVersion','openingScene','openingPage','pendingStory','pendingScene','scenePage','storyChapter','bookChapters','malacharPhase','rexPhase','roadParty','bookGardenStarted','bookGardenComplete','bookRexWarning','bookFinalStarted','bookRestoration','bookCityComplete'];return {session:structuredClone(coopRuntime.session),seq:++coopRuntime.sequence,state:Object.fromEntries(keys.filter(k=>state[k]!==undefined).map(k=>[k,structuredClone(state[k])])),events:coopRuntime.events.splice(0),reward:coopRuntime.reward||null};}
async function coopPublish(){if(coopRuntime&&coopWire?.room?.snapshot?.seq)coopRuntime.sequence=Math.max(coopRuntime.sequence,coopWire.room.snapshot.seq);if(!coopRuntime||!coopLeader()||coopRuntime.publishing)return;coopRuntime.publishing=true;try{const snapshot=coopSnapshot(),ack=coopRuntime.ack.slice();coopRuntime.dirty=false;await coopWire.publish(snapshot,ack);coopRuntime.ack=coopRuntime.ack.filter(id=>!ack.includes(id));if(snapshot.reward)await coopClaim(snapshot.reward);await coopSettle(snapshot);}catch(e){state.paused=true;coopMessage=e.message;if(coopRuntime)coopRuntime.dirty=true;}finally{if(coopRuntime)coopRuntime.publishing=false;}}
function coopRoomChanged(room){if(!room)return;if(coopRuntime&&room.status!=='playing')state.paused=true;
 if(!coopRuntime&&room.status==='playing'&&room.snapshot&&!coopLeader())coopEnter(room.snapshot);
 if(coopRuntime&&!coopLeader()&&room.snapshot?.seq>coopRuntime.remoteSeq){const snap=room.snapshot;coopRuntime.remoteSeq=snap.seq;if(snap.session)coopRuntime.session=structuredClone(snap.session);Object.assign(state,structuredClone(snap.state));state.paused=room.status!=='playing'||state.paused;state.view3d=true;titleOpen=false;threeEvents=snap.events||[];if(threeEvents.length&&!threeBusy)finishBattleTurn();else render();if(snap.reward)coopClaim(snap.reward);}
 if(coopRuntime&&coopLeader())for(const row of room.actions||[]){if(coopRuntime.ack.includes(row.id))continue;const a=row.action;if(!coopRules.canControl(room,row.user_id,a)){coopRuntime.ack.push(row.id);continue;}if(a.type==='priority'){const f=state.fighters.find(f=>f.id===a.hero);if(f)f.prioritySkill=a.skill;coopRuntime.ack.push(row.id);coopRuntime.dirty=true;}else if(state.manual&&state.fighters[state.actor]?.id===a.hero){manualChoice=a.skill;coopRuntime.ack.push(row.id);battleTick();}}
 if(coopRuntime){if(!coopLeader()&&room.snapshot?.reward)coopRuntime.reward=room.snapshot.reward;if(coopRuntime.reward&&!coopRuntime.publishing)coopClaim(coopRuntime.reward);}if(coopRuntime&&!coopRuntime.publishing&&(!coopLeader()||!coopRuntime.dirty))coopSettle(room.snapshot).catch(()=>{});if(modal==='coop')render();}
function coopEnter(snapshot=null){if(coopRuntime)return;const me=coopWire.room.members.find(m=>m.user_id===cloud.user.id);const solo=structuredClone(state);coopRuntime={solo,owned:me.loadout.heroes,sequence:0,remoteSeq:0,dirty:true,publishing:false,ack:[],events:[],claiming:false,reward:null};localStorage.setItem('sarko-coop-recovery',JSON.stringify({user:cloud.user.id,room:coopWire.room.id,solo}));state=structuredClone(solo);const party=coopRules.assembleParty(coopWire.room.members);state.chosen=party.heroes;state.fighters=party.fighters;state.inventory=party.inventory;state.ranks=party.ranks;const shared=coopRules.combinedLife(coopWire.room.members,level);state.life=structuredClone(solo.life||freshLife());state.life.xp=shared.levels.map(n=>n*(n-1)*20);state.life.bag=shared.bag;state.life.malachar=coopWire.room.members.some(m=>m.loadout.life.malachar);state.life.bosses=Math.max(...coopWire.room.members.map(m=>m.loadout.life.bosses||0));coopRuntime.sharedBase=structuredClone(state.life);coopRuntime.session={members:structuredClone(coopWire.room.members),sharedBase:structuredClone(state.life),baseGold:state.gold,rewardGold:0};state.paused=true;state.manual=false;state.openingComplete=true;state.openingVersion=0;state.openingScene=null;state.guildPicking=false;state.pendingStory=false;state.pendingScene=null;state.view3d=true;if(snapshot){Object.assign(state,structuredClone(snapshot.state));coopRuntime.sequence=snapshot.seq||0;coopRuntime.remoteSeq=snapshot.seq||0;coopRuntime.reward=snapshot.reward||null;coopRuntime.session=structuredClone(snapshot.session||coopRuntime.session);coopRuntime.sharedBase=structuredClone(coopRuntime.session.sharedBase);}state.paused=true;modal='';titleOpen=false;close3D();render();}
async function coopClaim(reward){if(!coopRuntime||coopRuntime.claiming||coopRuntime.settling||coopRuntime.solo.coopRewardIds?.includes(reward.id))return;coopRuntime.claiming=true;try{
 if(coopLeader())await cloudApi.reward(coopWire.room.id,reward.battleId,reward);
 const offered=await cloudApi.reward(coopWire.room.id,reward.battleId);if(offered.claimed){if(!cloudValid(offered.payload))throw Error('Reconnect to recover the saved reward.');coopRuntime.solo=structuredClone(offered.payload.files.slots[offered.payload.files.active].state);saveFiles=structuredClone(offered.payload.files);localStorage.setItem(SAVE_KEY,JSON.stringify(saveFiles));cloud.record={revision:offered.revision,payload:offered.payload,dirty:false};cloud.put(cloud.key(),cloud.record);cloud.notify('synced');return;}
 const payload=structuredClone(cloud.record.payload),solo=structuredClone(coopRuntime.solo);solo.life=coopRules.settleSharedLife(coopRuntime.session.members,coopRuntime.sharedBase,reward.life||state.life,cloud.user.id,level);
 coopRules.applyCoopReward(solo,offered.reward,coopRuntime.owned,f=>Math.round(hero(f.id).hp*(1+.12*(f.level-1))));
 for(const f of (reward.fighters||state.fighters).filter(f=>coopRuntime.owned.includes(f.id))){const own=solo.fighters.find(x=>x.id===f.id)||solo.town?.roster?.[f.id];if(own){own.level=f.level;own.xp=f.xp;own.hp=f.hp;own.ward=f.ward;if(!f.hp){solo.town??={};solo.town.fainted??={};solo.town.fainted[f.id]={remaining:3};for(const g of solo.inventory)if(g.equippedTo===f.id)g.equippedTo=null;}} }
 if(coopLeader()&&reward.progress)Object.assign(solo,structuredClone(reward.progress));if(reward.helped)solo.questsCompleted=(coopRuntime.solo.questsCompleted||0)+1;
 payload.files.slots[payload.files.active].state=solo;
 const result=await cloudApi.reward(coopWire.room.id,reward.battleId,null,cloud.record.revision,payload);
 if(result.conflict)throw Error('Another device changed your save. Rewards are waiting safely; resolve cloud saves before collecting.');
 coopRuntime.solo=solo;saveFiles.slots[saveFiles.active].state=solo;localStorage.setItem(SAVE_KEY,JSON.stringify(saveFiles));cloud.record={revision:result.revision,payload,dirty:false};cloud.put(cloud.key(),cloud.record);cloud.notify('synced');coopMessage='Both players receive equal rewards · double hero XP. Your rewards are cloud saved.';
 }catch(e){coopMessage=e.message;state.paused=true;}finally{if(coopRuntime)coopRuntime.claiming=false;}}
async function coopAction(action,button){if(coopWorking)return;coopWorking=true;coopMessage='';try{
 if(action==='coopCreate'||action==='coopJoin'){if(state.phase!=='battle'||!state.awaiting||state.openingScene||state.malacharPhase||state.rexPhase)throw Error('Finish your current encounter and story scene first.');await coopConnect();if(action==='coopCreate')await coopWire.command('create');else{const invite=document.querySelector('#coopInvite')?.value.trim();if(!/^[0-9a-f-]{36}$/i.test(invite||''))throw Error('Paste the full invitation code.');await coopWire.command('join',{invite});}}
 if(action==='coopResume'){const recovery=cloud?.read('sarko-coop-recovery');if(!recovery||recovery.user!==cloud.user.id)throw Error('No party to reconnect to.');await coopConnect();coopWire.room={id:recovery.room};await coopWire.poll();if(!coopWire.room.members?.some(m=>m.user_id===cloud.user.id))throw Error('This party is no longer available.');if(coopWire.room.members.length===2&&coopWire.room.snapshot){coopEnter(coopWire.room.snapshot);await coopWire.command('pause');coopPicks=[...coopRuntime.owned];}modal='coop';}
 if(action==='coopPick'){const id=Number(button.dataset.id);coopPicks=coopPicks.includes(id)?coopPicks.filter(n=>n!==id):coopPicks.length<2?[...coopPicks,id]:coopPicks;}
 if(action==='coopReady'){const loadout=coopLoadout();if(!coopRules.validateLoadout(loadout))throw Error('Choose two conscious recruited heroes.');await coopWire.command('loadout',loadout);}
 if(action==='coopLeader')await coopWire.command('leader',{user:button.dataset.user});
 if(action==='coopStart'){if(!coopRuntime){coopRules.assembleParty(coopWire.room.members);coopEnter();await coopPublish();}await coopWire.command('start');state.paused=false;modal='';coopRuntime.dirty=true;}
 if(action==='coopPause'){await coopWire.command('pause');state.paused=true;}
 if(action==='coopLeave'){if(coopRuntime?.settling||coopRuntime?.publishing)throw Error('Wait for shared progress to save.');if(coopRuntime&&coopLeader())await coopPublish();if(coopRuntime)await coopSettle();if(coopRuntime?.claiming)throw Error('Wait for your rewards to save.');if(coopRuntime?.reward&&!coopRuntime.solo.coopRewardIds?.includes(coopRuntime.reward.id))await coopClaim(coopRuntime.reward);if(coopRuntime?.reward&&!coopRuntime.solo.coopRewardIds?.includes(coopRuntime.reward.id))throw Error('Collect the pending reward before leaving.');await coopWire.command('leave');if(coopRuntime){state=coopRuntime.solo;coopRuntime=null;state.paused=true;close3D();save();}coopWire.stop();coopWire=null;clearInterval(coopPollTimer);localStorage.removeItem('sarko-coop-recovery');coopPicks=[];modal='coop';}
}catch(e){coopMessage=e.message;}finally{coopWorking=false;render();}}

function renderModal(){if(!modal)return '';if(modal==='coop')return coopModal();if(modal==='account')return accountModal();if(modal==='guide')return supportGuide();if(modal==='report')return supportReport();if(modal==='help')return helpPanel();if(modal==='training')return trainingModal();if(modal==='town')return townModal();if(modal==='townGuild')return townGuildModal();if(modal==='townInn')return townInnModal();if(modal==='life')return lifeModal();if(modal==='opening')return openingModal();if(modal==='guildParty')return guildPartyModal();if(modal==='library')return bookLibrary();if(modal==='story')return storyModal();if(modal==='scene')return sceneModal();if(modal==='files')return filesModal();if(modal==='scores')return progressRankings();if(modal==='shop')return shopModal();if(modal==='forge')return forgeModalV2();if(modal==='church')return churchModal();if(modal==='tree')return treeModal();if(modal==='details')return detailsModal(selectedHero);if(modal==='enemy')return enemyModal();return '';}
function render(){const previousControl=document.activeElement;const previousData=previousControl?.tagName==='BUTTON'?{...previousControl.dataset}:null;if(titleOpen){dialogueAudio?.pause();dialogueKey=null;$('#app').innerHTML=titleScreen()+((modal==='trailer'||modal==='titleNew')?titleModal():renderModal());syncTitleClip();if(controllerActive){const old=previousData&&Object.keys(previousData).length?controllerButtons().find(b=>Object.entries(previousData).every(([k,v])=>b.dataset[k]===v)):null;(old||controllerDefault())?.focus({preventScroll:true});}return;}state.view3d=true;if(state.openingScene)modal='opening';else if(state.guildPicking)modal='guildParty';else if(state.openingVersion&&!state.openingComplete&&state.pendingStory&&state.world===0&&state.worldStage===0){state.pendingStory=false;beginOpeningScene('wake');}const focused=document.activeElement?.tagName==='BUTTON'?{...document.activeElement.dataset}:null;if(!modal&&state.phase==='battle'&&state.pendingStory&&!state.awaiting)modal='story';if(!modal&&helpBlocked())modal='help';const app=$('#app'),live=state;if(threeBusy&&threeFrame)state={...threeFrame,paused:threePaused};if(threeHost)threeHost.remove();if(serviceHost)serviceHost.remove();if(travelHost)travelHost.remove();app.innerHTML=`<main class="shell">${header()}${storyObjectiveBanner()}${state.phase==='selection'?selection():battle()}<footer class="footer">Sarko · Radiant Kingdom Studios · Free browser edition · Progress is saved on this device; rankings can be shared online.</footer></main>${renderModal()}`;state=live;if(canUse3D())sync3D();syncService3D();syncTravel3D();syncDialogueAudio();if(focused&&Object.keys(focused).length){const scope=modal?'#overlay button':'button';const matching=[...document.querySelectorAll(scope)].find(b=>!b.disabled&&Object.entries(focused).every(([k,v])=>b.dataset[k]===v));matching?.focus({preventScroll:true});}if(controllerActive&&!controllerButtons().includes(document.activeElement))controllerDefault()?.focus({preventScroll:true});}
function openModal(type){if(type!=='life')lifeRound=null;modal=type;if(state.phase==='battle'&&!state.awaiting)state.paused=true;save();render();if(type==='scores'){onlineScores.mode=state.mode;onlineScores.difficulty=state.difficulty||0;loadOnlineScores();}}
function buy(index){if(state.phase!=='battle'||state.shopBought.includes(index))return;const offer=shopOffers()[index];if(!offer||state.gold<offer.price)return;state.gold-=offer.price;state.shopBought.push(index);state.inventory.push({id:newId(),kind:'Fruit',name:offer.name,attribute:offer.attribute,rarity:offer.rarity,bonus:offer.bonus,equippedTo:null,gem:null});save();render();toast(`${offer.name} Fruit purchased.`);}
function forgeDonors(g,inventory=state.inventory){return inventory.filter(x=>x.kind==='Fruit'&&x.id!==g.id&&x.name===g.name&&x.rarity===g.rarity&&x.equippedTo===null&&!x.locked&&!x.gem).sort((a,b)=>a.bonus-b.bonus);}
function applyForge(g,donors){const used=new Set(donors.map(x=>x.id));state.gold-=120;state.inventory=state.inventory.filter(x=>!used.has(x.id));g.rarity=RARITIES[RARITIES.indexOf(g.rarity)+1];g.bonus=Math.round((g.bonus+.04)*100)/100;selectedGear=state.inventory.indexOf(g);selectedGem=-1;}
function merge(){const g=state.inventory[selectedGear];if(!g||g.kind!=='Fruit')return;const matches=forgeDonors(g);if(matches.length<4)return toast('Need four unlocked, unequipped matching fruits without gems.');if(RARITIES.indexOf(g.rarity)>=RARITIES.length-1)return toast('Already legendary.');if(state.gold<120)return toast('Need 120 gold.');applyForge(g,matches.slice(0,4));save();render();toast(g.name+' Fruit became '+g.rarity+'.');}
function toggleGearLock(index){const g=state.inventory[index];if(!g)return;g.locked=!g.locked;save();render();}
function autoForgePlan(){
 let items=state.inventory.map(g=>({...g})),gold=state.gold;const plan=[];
 while(gold>=120){
   const targets=items.filter(g=>g.kind==='Fruit'&&RARITIES.indexOf(g.rarity)<RARITIES.length-1).sort((a,b)=>(b.equippedTo!==null?1:0)-(a.equippedTo!==null?1:0)||(b.locked?1:0)-(a.locked?1:0)||b.bonus-a.bonus);
   const target=targets.find(g=>forgeDonors(g,items).length>=4);if(!target)break;
   const donors=forgeDonors(target,items).slice(0,4);plan.push({target:target.id,donors:donors.map(g=>g.id)});const consumed=new Set(donors.map(g=>g.id));items=items.filter(g=>!consumed.has(g.id));target.rarity=RARITIES[RARITIES.indexOf(target.rarity)+1];target.bonus=Math.round((target.bonus+.04)*100)/100;gold-=120;
 }
 return plan;
}
function autoForge(){const plan=autoForgePlan();for(const step of plan){const g=state.inventory.find(x=>x.id===step.target),donors=step.donors.map(id=>state.inventory.find(x=>x.id===id));applyForge(g,donors);}save();render();toast(plan.length+' upgrades forged · '+plan.length*120+' gold spent.');}
function autoSocketPlan(){
 const fruits=state.inventory.filter(g=>g.kind==='Fruit'&&!g.gem).sort((a,b)=>(b.equippedTo!==null?1:0)-(a.equippedTo!==null?1:0)||b.bonus-a.bonus);
 const gems=state.inventory.filter(g=>g.kind==='Gem'&&!g.socketedTo).sort((a,b)=>b.bonus-a.bonus);
 return fruits.slice(0,Math.min(gems.length,Math.floor(state.gold/60))).map((g,i)=>({fruit:g.id,gem:gems[i].id}));
}
function autoSocket(){const plan=autoSocketPlan();for(const step of plan){const fruit=state.inventory.find(g=>g.id===step.fruit),gem=state.inventory.find(g=>g.id===step.gem);fruit.gem=gem.id;gem.socketedTo=fruit.id;state.gold-=60;}save();render();toast(plan.length+' gems socketed · '+plan.length*60+' gold spent.');}
function forgeAutomationUI(){const upgrades=autoForgePlan().length,sockets=autoSocketPlan().length;return '<div class="panel panelpad"><h3>Automatic forging</h3><p>Auto Forge keeps equipped and locked fruit, then the strongest fruit, and consumes the weakest eligible duplicates. Locked items and socketed fruit are never consumed. Auto Socket puts the strongest gems into equipped fruit first, then other fruit. Existing gems stay in place.</p><div class="actions"><button class="button" data-action="autoForge" '+(upgrades?'':'disabled')+'>AUTO FORGE · '+upgrades+' UPGRADES · '+upgrades*120+' GOLD</button><button class="button" data-action="autoSocket" '+(sockets?'':'disabled')+'>AUTO SOCKET · '+sockets+' GEMS · '+sockets*60+' GOLD</button></div><details><summary>EQUIPMENT LOCKS · protect from consumption only</summary><div class="inventory">'+state.inventory.map((g,i)=>'<button class="button mini" data-action="gearLock" data-index="'+i+'" aria-pressed="'+!!g.locked+'">'+(g.locked?'LOCKED':'UNLOCKED')+' · '+esc(g.rarity+' '+g.name)+' · '+esc(g.kind==='Fruit'?fruitStat(g):gemStat(g))+'</button>').join('')+'</div></details></div>';}
function socket(){const g=state.inventory[selectedGear],gem=state.inventory[selectedGem];if(!g||!gem||g.kind!=='Fruit'||gem.kind!=='Gem'||g.gem||gem.socketedTo)return;if(state.gold<60)return toast('Need 60 gold.');state.gold-=60;g.gem=gem.id;gem.socketedTo=g.id;save();render();toast('Gem socketed into fruit.');}
function unsocket(){const g=state.inventory[selectedGear];if(!g?.gem)return;const gem=state.inventory.find(x=>x.id===g.gem);if(gem)gem.socketedTo=null;g.gem=null;save();render();toast('Gem removed.');}
function equip(id,index){const g=state.inventory[index];if(!g||g.kind!=='Fruit')return;if(state.phase==='battle'&&state.fighters.some(f=>f.id===id&&f.hp===0))return toast('A fainted hero must recover for three battles before equipping fruit.');if(g.equippedTo===id)g.equippedTo=null;else{for(const x of state.inventory)if(x.kind==='Fruit'&&x.name===g.name&&x.equippedTo===id)x.equippedTo=null;g.equippedTo=id;}for(const f of state.fighters){const max=fighterStats(f).max;f.hp=Math.min(f.hp,max);}save();render();}
function unequipAll(id){for(const g of state.inventory)if(g.kind==='Fruit'&&g.equippedTo===id)g.equippedTo=null;for(const f of state.fighters){const max=fighterStats(f).max;f.hp=Math.min(f.hp,max);}save();render();toast(`All fruit removed from ${hero(id).name}.`);}
function upgrade(id,index){const rank=rankFor(id,index),cost=skillUpgradeCost(index,rank);if(rank>=5||state.points<1||state.gold<cost)return;state.points--;state.gold-=cost;state.ranks[`${id}-${index}`]=(state.ranks[`${id}-${index}`]||0)+1;save();render();toast(`${skillFor(id,index).name} upgraded.`);}
document.addEventListener('click',event=>{const button=event.target.closest('[data-action]');if(!button)return;const a=button.dataset.action,id=Number(button.dataset.id),index=Number(button.dataset.index);if((threeBusy||threeLoading)&&!['pause','music','skillPriority','priorityHero','fullscreen'].includes(a)){toast('Let the current move finish before changing gear or screens.');return;}if(a.startsWith('coop')){coopAction(a,button);return;}if(coopRuntime&&coopIntercept(a,button))return;if(a.startsWith('cloud')){cloudAction(a);return;}if(supportHandle(a,index))return;if(forgeTutorialHandle(a))return;if(a==='fullscreen'){gameFullscreen();return;}if(a==='rankingName'){renameRankingPlayer();return;}if(a==='rankPage'){onlineScores.page=Math.max(0,index);loadOnlineScores();return;}if(a==='enterSurvival'){enterSharedSurvival();return;}if(a==='returnCampaign'){returnToCampaign();return;}if(helpHandle(a))return;if(openingAction(a,id))return;if((modal==='opening'||modal==='guildParty')&&a==='close')return;if(titleHandle(a))return;if(a==='trainingStart'){trainingStart(index);return;}if(a==='training'){modal='training';render();return;}if(a==='shareFile'){shareBackup(index);return;}if(townHandle(a,id,button.dataset.place))return;if(lifeHandle(a,index,button.dataset.item))return;if(a==='autoForge')autoForge();else if(a==='autoSocket')autoSocket();else if(a==='gearLock')toggleGearLock(index);else if(a==='autoEquip')autoEquipStrongest(id);else if(a==='gearPriority')toggleGearPriority(id,index);else if(a==='skillPriority')setSkillPriority(id,index);else if(a==='priorityHero'){selectedHero=id;render();}else if(a==='skipNarrative')finishNarrative(true);else if(a==='guidedStory')finishNarrative(false,true);else if(a==='endGuide'){state.guidedIntro=false;save();render();}else if(a==='pick')pickHero(id);else if(a==='mode')toggleMode();else if(a==='view')toggleView();else if(a==='mapView'){state.mapView=button.dataset.view;save();render();}else if(a==='basic')chooseManual(-1);else if(a==='manualSkill')chooseManual(index);else if(a==='start')startRun();else if(a==='startCampaign')startRun('campaign');else if(a==='difficulty'){if(index<=state.unlockedDifficulty){state.difficulty=index;save();render();}}else if(a==='continueStory')continueStory();else if(a==='continueScene')continueScene();else if(a==='pause'){pauseBattle();}else if(a==='next')nextFight();else if(a==='reset')resetRun();else if(a==='submit')submitScore();else if(a==='refreshScores')loadOnlineScores();else if(a==='scoreMode'){onlineScores.mode=button.dataset.mode;onlineScores.page=0;onlineScores.rows=[];loadOnlineScores();}else if(a==='scoreDifficulty'){onlineScores.difficulty=index;onlineScores.page=0;onlineScores.rows=[];loadOnlineScores();}else if(a==='modal')openModal(button.dataset.modal);else if(a==='close'){if(modal==='story')continueStory();else if(modal==='scene')continueScene();else{modal='';render();}}else if(a==='switchFile')switchFile(index);else if(a==='renameFile')renameFile(index);else if(a==='deleteFile')deleteFile(index);else if(a==='downloadFile')downloadFile(index);else if(a==='chooseImport')$(`#fileImport${index}`)?.click();else if(a==='details'){selectedHero=id;openModal('details');}else if(a==='heroTab'){selectedHero=id;render();}else if(a==='enemy')openModal('enemy');else if(a==='music')toggleMusic();else if(a==='buy')buy(index);else if(a==='refresh'){if(state.gold>=100){state.gold-=100;state.shopRevision++;state.shopBought=[];save();render();}}else if(a==='selectGear'){selectedGear=index;render();}else if(a==='selectGem'){selectedGem=index;render();}else if(a==='merge')merge();else if(a==='socket')socket();else if(a==='socketInto')socketInto(index);else if(a==='unsocket')unsocket();else if(a==='equip')equip(id,index);else if(a==='unequipAll')unequipAll(id);else if(a==='upgrade')upgrade(id,index);});
document.addEventListener('change',event=>{const input=event.target.closest('[data-import-slot]');if(input){importFile(Number(input.dataset.importSlot),input.files?.[0]);input.value='';}});
document.addEventListener('contextmenu',event=>{const card=event.target.closest('[data-action="details"]');if(card){event.preventDefault();selectedHero=Number(card.dataset.id);openModal('details');}});
document.addEventListener('keydown',event=>{if(globalThis.sarkoIntroPlaying)return;if(event.key==='Escape'&&(modal==='opening'||modal==='guildParty'))return;if(event.key==='Escape'&&modal){if(modal==='story')continueStory();else if(modal==='scene')continueScene();else{modal='';render();}}else if(event.key===' '&&state.phase==='battle'&&!modal){event.preventDefault();pauseBattle();}});
document.addEventListener('click',event=>{if(event.target?.id==='overlay'){if(modal==='story')continueStory();else if(modal==='scene')continueScene();else{modal='';render();}}});
fetch('assets-3d.json').then(r=>r.json()).then(manifest=>{threeManifest=manifest;state.view3d=true;if(!canUse3D())threeFailure='Arena assets unavailable';render();}).catch(()=>{threeFailure='Arena assets unavailable';render();});
let controllerActive=false,padPrevious=[],padDirection=0,padNextMove=0;
function controllerButtons(){const scope=padKeyboardOpen()?'#controllerKeyboard ':globalThis.sarkoIntroPlaying?'#studioIntro ':modal?'#overlay ':'';return [...document.querySelectorAll(scope+'button:not(:disabled),'+scope+'input:not(:disabled):not([readonly]):not([type=file]):not([type=hidden]),'+scope+'textarea:not(:disabled)')].filter(b=>b.getClientRects().length&&!b.closest('[hidden]'));}
function controllerDefault(){const all=controllerButtons();return (modal==='opening'?all.find(b=>b.dataset.action==='openingNext'):modal==='guildParty'?all.find(b=>b.dataset.action==='guildPick'):modal==='story'?all.find(b=>b.dataset.action==='continueStory'):modal==='scene'?all.find(b=>b.dataset.action==='continueScene'):modal==='life'?all.find(b=>['lifeLessonDone','lifeAct','lifeStart'].includes(b.dataset.action)):null)||all[0];}
function pollController(){
 const pad=Array.from(navigator.getGamepads?.()||[]).find(Boolean);if(!pad){padPrevious=[];padDirection=0;return;}
 const pressed=i=>!!pad.buttons[i]?.pressed,edge=i=>pressed(i)&&!padPrevious[i];
 const vertical=pad.axes?.[1]||0,horizontal=pad.axes?.[0]||0;
 const direction=pressed(13)||pressed(15)||vertical>.55||horizontal>.55?1:pressed(12)||pressed(14)||vertical<-.55||horizontal<-.55?-1:0;
 const all=controllerButtons(),now=performance.now();if(direction||pad.buttons.some(b=>b.pressed)){controllerActive=true;document.body.classList.add("controllerMode");}
 if(direction&&(direction!==padDirection||now>=padNextMove)){controllerActive=true;const at=all.indexOf(document.activeElement);all[at<0?(direction>0?0:all.length-1):(at+direction+all.length)%all.length]?.focus();padNextMove=now+(direction!==padDirection?320:150);}
 if(edge(0)){controllerActive=true;const button=all.includes(document.activeElement)?document.activeElement:controllerDefault();button?.focus();if(button?.matches('input,textarea'))openPadKeyboard(button);else button?.click();}
 if(edge(1)){if(padKeyboardOpen())closePadKeyboard();else if(globalThis.sarkoIntroPlaying)document.querySelector('#startupSkip')?.click();else if(modal==='opening'){if(state.openingPage>0){state.openingPage--;save();render();}}else if(modal)document.querySelector('#overlay [data-action="close"]')?.click();}
 if(edge(9)&&!titleOpen&&!globalThis.sarkoIntroPlaying&&state.phase==='battle'&&!modal&&!state.awaiting)pauseBattle();
 padDirection=direction;padPrevious=pad.buttons.map(b=>!!b.pressed);
}
setInterval(pollController,80);
Promise.all([fetch('data.json').then(r=>r.json()),fetch('campaign-data.json').then(r=>r.json())]).then(([skills,story])=>{data=skills;campaignData=story;render();}).catch(()=>{render();toast('Game data is loading.');});
setInterval(battleTick,1800);
// Keep one conversation player across renders; leaving or skipping stops speech.
let dialogueAudio=null,dialogueKey=null;
document.addEventListener('play',event=>{if(event.target.tagName==='AUDIO'&&event.target.id!=='music'){document.querySelectorAll('audio').forEach(a=>{if(a!==event.target&&a.id!=='music')a.pause();});}},true);
function syncDialogueAudio(){
 const slot=document.querySelector('[data-dialogue-audio]'),key=slot?.dataset.dialogueAudio;
 if(key===dialogueKey&&dialogueAudio){slot?.append(dialogueAudio);return;}
 if(dialogueAudio){dialogueAudio.pause();dialogueAudio.removeAttribute('src');dialogueAudio.load();}
 if($('#music'))$('#music').volume=.28;
 dialogueAudio=null;dialogueKey=key||null;if(!key)return;
 const audio=document.createElement('audio');audio.controls=false;audio.hidden=true;audio.preload='auto';audio.src='assets/dialogue/'+key+'.mp3?v=first-light-quests-20261117b';audio.setAttribute('aria-label','Listen to this conversation');audio.style.width='100%';slot.append(audio);dialogueAudio=audio;
 audio.addEventListener('play',()=>{document.querySelectorAll('.storyArchive audio').forEach(a=>a.pause());if($('#music'))$('#music').volume=.07;});
 for(const name of ['pause','ended'])audio.addEventListener(name,()=>{if($('#music'))$('#music').volume=.28;});
 audio.addEventListener('error',()=>{if(audio!==dialogueAudio)return;const note=document.createElement('p');note.className='small muted';note.textContent='Audio unavailable. You can read the conversation above and continue.';slot.append(note);},{once:true});
 if(!globalThis.sarkoIntroPlaying)audio.play().catch(()=>{});
}

Object.assign(STORY_OPENING,{"repairs":{"title":"After the attack · a home worth rebuilding","chapter":7,"art":"assets/book/guild-repairs.jpg","context":"Malachar has fled the ruined guild hall. Rain falls through the broken roof, but the company stays to repair its home and care for one another.","lines":[["Waiz","So... who is cleaning this up?","amused"],["Isaac","New guy!","warm"],["Sarko","What? I only just got here!","surprised"],["Waiz","I am carrying this board. It is emotionally heavy.","amused"],["Amaya","You are carrying one board. Here—bring it to the damaged wall.","amused"],["Hailey","The wall is crooked on purpose. Artistic design.","amused"],["Diago","Check everyone's wounds first. We rebuild together.","warm"],["Grace","Grace! Evangelist, enthusiastic volunteer, occasional ladder problem. Waiz, grab that end—wait, is anyone hurt? We should check first.","warm"]]},"seeds":{"title":"Seeds in the Rain","chapter":7,"art":"assets/book/seeds-rain.jpg","context":"Outside the damaged hall, Sarko finds Levi watching the mountains where Malachar disappeared. Below them, the people of First Light carry supplies and tend the wounded.","lines":[["Sarko","You think he will come back soon? You do not seem angry about the destruction.","worried"],["Levi","Yes, he will return. But look at the town. Chadash Adamah means New Earth—not because it is free from suffering, but because God is rebuilding everything.","gentle"],["Levi","A seed remains alone unless it enters the ground. Before something greater can grow, the seed must first break. Breaking hurts, but it is not the end.","gentle"],["Sarko","What happened to Malachar? He carries a mark like ours.","thoughtful"],["Levi","He once protected others. He saw loss and unanswered prayers, and decided that pain meant God could not be good. Pain did not destroy him. Hopelessness did.","sad"],["Sarko","Then healing has to mean more than closing a wound.","thoughtful"],["Levi","You are a Shepherd. You remind others why they should keep going.","warm"]]},"departure":{"title":"The road to the Heavenly City","chapter":7,"art":"assets/book/guild-repairs.jpg","context":"The company gathers by the guild hearth. Their injuries are real, but so is the bond forming between them. At sunrise they will leave First Light.","lines":[["Levi","We leave at sunrise. The Heavenly City awaits. The road will test your fear, your trust, and your hope. Nobody walks it alone.","serious"],["Diago","I trained others before you. I lost people I wanted to protect. That is why I push you so hard.","sad"],["Sarko","You have been carrying that all this time?","gentle"],["Naomi","Heroes become family before they become legends. We can carry one another's burdens.","gentle"],["Waiz","Then we should start by agreeing that the carved-stone game was unfair.","amused"],["Isaac","Adventure tomorrow. Food tonight!","warm"],["Grace","Right! Adventure, good news, possibly snacks. But if someone falls behind, we all stop. Nobody walks alone.","determined"]]},"gardenInvite":{"title":"An invitation beside the stream","chapter":9,"art":"assets/book/garden-invitation.jpg","context":"After helping a damaged farming settlement, the weary company rests beside a crystal stream. Naomi has just guided them away from a collapsing path. The water begins to shine.","lines":[["Naomi","The path to the left was not safe. Sometimes God shows a moment before it happens.","serious"],["Waiz","Prophet deer picks directions from now on.","amused"],["Angel","Bearer of restoration, you carry the light of renewal. There is little time. Those who walk in unity may receive what lies within—but only those who remain as one.","gentle"],["Naomi","The Hidden Garden...","wonder"],["Levi","I thought it was legend. Lower your shield, Sarko. This is an invitation.","wonder"],["Sarko","Then we enter together.","determined"]]},"gardenGift":{"title":"The silver tree","chapter":9,"art":"assets/book/garden-invitation.jpg","context":"A hidden path leads to a luminous silver tree. The gift within the garden belongs to the whole company. Their light draws attention from the shadows.","lines":[["Sarko","We spent the morning repairing fences and helping tired families. For once, protecting people meant ordinary kindness.","thoughtful"],["Naomi","That matters too. The light is not only for a battlefield.","gentle"],["Levi","Receive this gift together. Do not mistake growth for permission to stand alone.","serious"],["Waiz","I would prefer our next surprise to stay peaceful.","worried"],["Malachar","You have grown quickly. Faster than I expected. This time, I did not come alone.","menacing"]]},"fractures":{"title":"Malachar returns with allies","chapter":10,"art":"assets/book/garden-fractures.jpg","context":"Malachar's followers emerge beneath the silver roots. This adaptation uses existing arena creatures for his coordinated assault. The full guild joins the encounter; Levi is already with them this time.","lines":[["Malachar","You still believe suffering has purpose? My companions chose truth after Heaven abandoned them.","menacing"],["Levi","No. They forgot. Company, hold your formation.","serious"],["Naomi","Sarko—shield high, now! They are trying to split our attention.","serious"],["Sarko","Kingdom Sanctuary! Stay inside the light. We share the burden.","determined"],["Malachar","Waiz hides fear behind laughter. Amaya carries guilt. Hailey fears failure. Your Apostle blames himself for every soul he cannot save.","menacing"],["Sarko","He is not striking our armor. He is striking the things we hide from one another.","worried"],["Grace","I had an inspiring speech ready. My knees have apparently voted against it. Stay close, will you?","worried"]]},"surrender":{"title":"Strength through surrender","chapter":11,"art":"assets/book/garden-fractures.jpg","context":"The formation falters. Instead of pretending to be invulnerable, the companions admit their fears. Sarko's Shared Burden brightens as they choose trust over pride.","lines":[["Waiz","I joke because I hate feeling weak. I lost focus. I need your help.","sad"],["Amaya","I judged you for mistakes I make myself. I carried pressure like pride instead of trust.","sad"],["Hailey","I am afraid of failing you. So I force things and pretend I am in control.","worried"],["Isaac","I thought strength meant carrying everything alone. Shield brother shares the burden. So should I.","gentle"],["Naomi","Pride isolates. Humility reconnects.","gentle"],["Levi","God does not unite perfect souls. He unites surrendered ones.","serious"],["Sarko","I do not have to control every outcome to stand beside you. Together—again!","determined"],["Grace","All right. One breath, one step, one wildly hopeful horse. Come on—we can do this together.","determined"]]},"rexArrival":{"title":"The Dragon King","chapter":12,"art":"assets/book/rex-arrival.jpg","context":"Malachar is driven back against the silver tree, but he smiles toward the sky. Rex Draconum descends, spreading his vast wings above the garden. The Dragon King himself has come.","lines":[["Malachar","My king.","menacing"],["Levi","Rex Draconum. Why reveal yourself now?","serious"],["Rex","Because hope grows dangerous when ignored. Allow me to correct your expectations.","menacing"],["Sarko","My sanctuary... he shattered it without trying.","worried"],["Rex","You believe dependence protects people. Strength would have prevented your wounds.","cold"],["Levi","No. Love stayed when strength failed.","determined"],["Rex","Then show me how long your faith endures when those you protect begin to fall.","menacing"]]},"rexAfter":{"title":"A threat, not a victory","chapter":12,"art":"assets/book/rex-arrival.jpg","context":"The company survives Rex's overwhelming demonstration. He chooses to leave with Malachar; the heroes have not defeated him. Sarko reaches for restoration rather than revenge.","lines":[["Malachar","My king, we can finish them.","menacing"],["Rex","No. They are not ready. The Heavenly City will reveal whether their faith was ever real.","cold"],["Sarko","Divine Restoration. Come back to the light, everyone.","determined"],["Naomi","The Spirit of God sustains us.","gentle"],["Levi","And through the Son, we stand. This was not the end of our road.","serious"],["Sarko","This is not just power. It is purpose.","thoughtful"],["Grace","Well, that was considerably more dragon than I ordered. Hey—look at me. You are safe with us. Nobody left.","warm"]]},"breath":{"title":"Breath of Heaven","chapter":13,"art":"assets/book/breath-heaven.jpg","context":"Corrupted creatures converge on the damaged garden. Hailey sees too many threats at once. With the others beside her, she finds the courage to raise her bow.","lines":[["Hailey","There are too many angles. I am afraid I will miss when you need me most.","worried"],["Levi","Stand firm in faith. You do not have to carry this alone.","serious"],["Hailey","Celestial Rain!","determined"],["Hailey","I almost did not shoot.","sad"],["Sarko","But you did. We move forward together.","warm"],["Angel","Faithful ones... continue.","gentle"]]},"kingLies":{"title":"The King of Lies","chapter":14,"art":"assets/book/rex-canyon.jpg","context":"In a canyon of glowing blue stone, Rex approaches without his crushing aura. His offer sounds gentle: limitless power, if Sarko will abandon dependence and trust only himself.","lines":[["Rex","You heal, protect, sacrifice—and still you kneel. Why choose between light and darkness when both can belong to you?","cold"],["Sarko","If my healing had no limits... could I keep everyone safe?","worried"],["Naomi","Sarko, do not listen. He is using your fear of failure.","serious"],["Rex","What if you no longer served Heaven, but surpassed it?","menacing"],["Levi","Creation does not surpass its Creator. God never feared humanity becoming powerful. He feared what pride would turn us into.","serious"],["Sarko","I remember what carried us here. Love—not control.","determined"],["Isaac","Formation twelve!","determined"],["Grace","That is not a gift, Sarko. That is a chain with a very shiny ribbon. We already have you; you do not need to earn us.","serious"]]},"finalStand":{"title":"The fall of the Dragon King","chapter":15,"art":"assets/book/rex-canyon.jpg","context":"Rex returns above the shattered canyon, his wings casting a shadow over the company. Isaac and Sarko form the front line, Levi guides their defense, and the others cover the flanks and fire from the rear.","lines":[["Rex","Stand together, so you may fall together.","menacing"],["Levi","Everyone together! Protect the line. Watch for the opening.","determined"],["Sarko","Kingdom Sanctuary! Isaac, beside me!","determined"],["Isaac","Fortress Titan!","determined"],["Hailey","I can see the wing joints. Cover me while I aim.","serious"],["Naomi","His power is consuming him. Do not let his anger break our formation.","serious"],["Grace","Archers, I have your opening! Waiz, try to keep up. And please do not trip over my longsword.","determined"]]},"restoration":{"title":"Love restores","chapter":15,"art":"assets/book/rex-restoration.jpg","context":"Dragonfire breaks through the barrier and Hailey falls badly injured. The scene avoids graphic injury. Sarko reaches her while the others hold the line, and radiant restoration returns her strength.","lines":[["Naomi","Hailey! Sarko, she needs you!","worried"],["Sarko","Divine Restoration! Stay with us.","determined"],["Hailey","That was unpleasant. My bow—there. I can still fight.","determined"],["Waiz","She said that so calmly!","amused"],["Rex","You restored what was destroyed...","surprised"],["Sarko","I supported her. The regeneration is part of how the Creator made her. Love restores what power destroys.","determined"],["Levi","Now! Every opening, cover one another. Together!","determined"]]},"rexDefeat":{"title":"The king lays down control","chapter":15,"art":"assets/book/rex-restoration.jpg","context":"Rex falters as the guild’s coordinated attack breaks his defenses. Sarko offers restoration rather than hatred, and corruption loosens its grip on the exhausted Dragon King.","lines":[["Rex","So... this is what unity looks like.","sad"],["Levi","No. This is what love looks like.","gentle"],["Rex","All this time, I thought strength meant never needing anyone.","sad"],["Levi","And where did that road lead you?","gentle"],["Rex","Alone.","sad"],["Sarko","Courage is not never being afraid. I can protect and love people without controlling everything that happens to them.","thoughtful"],["Waiz","Does this count as a team-building exercise?","amused"],["Isaac","Best team building!","warm"],["Grace","Mercy! Unexpected, brilliant, and much better than another argument. Let us help him up—carefully.","gentle"]]},"cityGates":{"title":"The Heavenly City","chapter":16,"art":"assets/book/city-gates.jpg","context":"Beyond the canyon lies the final valley. Crystal rivers flow beneath radiant walls. The company approaches open gates, and the weight of exhaustion begins to lift.","lines":[["Naomi","We are close.","wonder"],["Waiz","How do you even describe that?","wonder"],["Levi","You do not.","gentle"],["Angel","The King has awaited your arrival.","warm"],["Hailey","No pain. No exhaustion. I can hardly believe it.","wonder"],["Waiz","Home.","gentle"],["Grace","Oh! Oh, look at the gates! I had so many words ready... Sarko, we actually made it. All of us.","wonder"]]},"cityWelcome":{"title":"The heart of a Shepherd","chapter":16,"art":"assets/book/city-welcome.jpg","context":"Inside the City, gentle light draws the company forward. Jesus welcomes Sarko with kindness that reaches back to the storm and the failure he has carried for so long.","lines":[["Jesus","I saw you in the rain.","gentle"],["Sarko","I thought I had to make up for it.","sad"],["Jesus","You were never asked to become everyone's savior. You were called to follow Me faithfully.","gentle"],["Sarko","I can protect them. I can love them. But I am not their Savior.","thoughtful"],["Jesus","Now you understand the heart of a Shepherd. You are home now.","warm"],["Sarko","I thought belonging was something I had to earn. Thank You for bringing us home.","gentle"]]},"cityPurpose":{"title":"A journey complete · a purpose beginning","chapter":17,"art":"assets/book/city-welcome.jpg","context":"The city is not the end of love's work. Beyond its gates, countless travelers still journey toward the light. The company receives a purpose that fits what they have learned together.","lines":[["Jesus","Shepherd, your role remains unchanged.","warm"],["Sarko","Protect people?","thoughtful"],["Jesus","Bring them together.","warm"],["Levi","Our journey to the City is over. But our purpose is only beginning.","gentle"],["Waiz","Then I suppose there are more people who need encouraging.","warm"],["Sarko","And none of them should have to walk alone.","determined"],["Grace","Then what are we waiting for? Well—one hug first. Then we carry that welcome to everyone still searching.","warm"]]}});
Object.assign(STORY_OPENING,{"wake":{"title":"Sarko’s Awakening · a room with his name","chapter":1,"art":"assets/book/chapter-01.jpg","context":"The storm is gone. Sarko wakes in an unfamiliar wooden room, with his name carved above the doorway. Birdsong reaches him from outside. For now, there is no battle—only a new beginning.","lines":[["Sarko","Where am I? The storm... I thought the water would never end.","worried"],["Sarko","My name is above the door. Someone expected me?","wonder"],["Sarko","That armour is enormous. I could never... wait. My paws. My reflection. I am not the small lion I remember.","surprised"],["Sarko","A dove on my forehead, and on my right paw. It is warm. I should be frightened, but somehow I feel safe.","wonder"],["Sarko","White metal, gold trim... and it fits. Even this shield feels as though it was made for me.","wonder"],["Sarko","Someone is knocking. Uh... come in?","surprised"],["Waiz","Hello! My name is Waiz! And judging by that expression, you have approximately a thousand questions.","amused"],["Sarko","I am Sarko. You could say that. Is this really my home?","worried"],["Waiz","For now, yes. You are in First Light, in Chadash Adamah—the New Earth. Take a breath. You are safe here.","warm"],["Sarko","Back home, I never felt important. During a flood, people needed help and I froze. What if that happens again?","worried"],["Waiz","Then you will have people beside you. That mark means you have been called, Sarko. It does not mean you must already know everything.","gentle"],["Waiz","Come to the doorway. There is something you should see before we talk about monsters.","warm"]]},"firstLightView":{"title":"The light beyond First Light","chapter":1,"art":"assets/illustrations/first-light-town.jpg","context":"Waiz opens the door onto lanterns, carved rooftops, and animals carrying supplies through First Light. Beyond the forests and mountains, a golden light shines on the horizon.","lines":[["Sarko","That light beyond the mountains... it is beautiful. What is it?","wonder"],["Waiz","The Heavenly City. Every Child of God journeys toward it. But listen carefully: nobody reaches it alone.","gentle"],["Sarko","So I need to become stronger before I can go there?","thoughtful"],["Waiz","Stronger, yes. But not proud. No one receives every gift. A Shepherd protects and heals. An Evangelist guides and encourages. Together, we cover one another's weaknesses.","warm"],["Sarko","A Shepherd... that is what I am? And my team would actually need me?","surprised"],["Waiz","They will. Your light is meant to help others stand when they are wounded or afraid. Miraculous Heal is a gift for them as much as for you.","gentle"],["Waiz","And protect that light with your choices. Being powerful is not the same as being kind. We learn to love, trust, forgive, and walk together.","serious"],["Sarko","Then I want to learn. I do not want fear deciding who I become.","determined"],["Waiz","Good! Because if you insist on doing everything alone, something with far too many teeth will eventually object.","amused"],["Sarko","You could have started with that!","amused"],["Waiz","Our leader is Levi, a tiger. You will meet him later. For now, explore the town. I will find our teacher, Diago, and catch up with you.","warm"]]},"meetDiago":{"title":"First Light · meeting the teacher","chapter":2,"art":"assets/book/training.jpg","context":"After exploring the bright market streets, Sarko spots Waiz waving beside a towering grizzly bear. The bear carries a worn greatsword and watches Sarko with the steady patience of someone who has survived many storms.","lines":[["Sarko","Everyone smiles at me as though I belong here. I have not done anything to earn it yet.","thoughtful"],["Waiz","Sarko! Found you! Told you I would catch up. This is Diago.","warm"],["Diago","I am Diago. Teacher class. You are the new Shepherd.","serious"],["Sarko","Yes, sir. Although I am still learning what that means.","worried"],["Diago","Good. A student who knows he needs teaching can learn. Do not confuse potential with victory.","serious"],["Sarko","What if I freeze when the others need me?","worried"],["Diago","Then we practice before that moment comes. You are not here to prove you are stronger than your companions. If your pack lives, you win.","gentle"],["Waiz","He sounds terrifying, but that was encouragement. I am almost certain.","amused"],["Diago","Eastern gate. Both of you. Bring the shield, Sarko. You will learn what it is for.","serious"],["Sarko","All right. I am coming.","determined"]]},"training":{"title":"Beyond the eastern gate · stand together","chapter":3,"art":"assets/book/training.jpg","context":"The town’s safety gives way to a training ground surrounded by weathered stone pillars. Diago stands beside Sarko; Waiz draws his twin blades. Their first lesson is protecting one another, not chasing glory.","lines":[["Sarko","So... where exactly are we going?","worried"],["Diago","To learn how you respond under pressure.","serious"],["Waiz","He means training. Probably. I will provide tactical enthusiasm.","amused"],["Diago","Plant your feet. Watch the enemy and your companions. Your shield buys them time; their gifts help you hold the line.","serious"],["Diago","In Manual mode, choose a basic attack or a ready skill when a hero's turn arrives. Read the skill description and cooldown before choosing.","serious"],["Waiz","Or use Auto and watch us work. Tap a skill in Auto to make it first priority when it becomes available. You can pause to think.","warm"],["Diago","Red numbers show damage. Blue marks a critical hit. Healing light and bright numbers show health restored. Pay attention to who needs help.","serious"],["Sarko","So winning is not just dealing the most damage. It is keeping everyone standing.","thoughtful"],["Diago","Exactly. Between encounters, use what you found and choose when to continue. If a traveller needs help, listen. Not every problem needs a sword.","gentle"],["Waiz","You have us for this first road. One step, then another. Nobody expects you to know the whole journey today.","warm"],["Sarko","Then we begin together.","determined"]]}});
function bookAdvance(key){
 const chain={wake:'firstLightView',firstLightView:'meetDiago',meetDiago:'training',repairs:'seeds',seeds:'departure',gardenInvite:'gardenGift',gardenGift:'fractures',rexAfter:'breath',rexDefeat:'cityGates',cityGates:'cityWelcome',cityWelcome:'cityPurpose'};
 if(chain[key]){beginOpeningScene(chain[key]);return true;}
 if(key==='departure'){finishGuildDeparture();return true;}
 if(key==='fractures'){startGardenWave(0);return true;}
 if(key==='surrender'){startGardenWave(1);return true;}
 if(key==='rexArrival'){startRexDemonstration();return true;}
 if(key==='breath'){returnFromBookBattle();state.bookGardenComplete=true;state.pendingStory=true;modal='story';return true;}
 if(key==='kingLies'){state.bookRexWarning=true;state.paused=false;return true;}
 if(key==='finalStand'){state.paused=false;return true;}
 if(key==='restoration'){for(const f of state.fighters){f.hp=fighterStats(f).max;delete townData().fainted[f.id];}state.rexPhase='final';state.paused=false;note('The company is restored. Finish the battle together.');return true;}
 if(key==='cityPurpose'){townArchive();const ids=state.roadParty||state.chosen.slice(0,4);state.chosen=ids;state.fighters=ids.map(id=>townData().roster[id]||storyFighter(id));state.bookCityComplete=true;state.bookChapters=17;state.rexPhase=null;state.phase='over';state.paused=true;state.openingScene=null;modal='';return true;}
 return false;
}
function finishGuildDeparture(){const ids=state.roadParty||[0,2,3,5];townArchive();state.fighters=ids.map(id=>townData().roster[id]||storyFighter(id));state.chosen=ids;state.malacharPhase=null;state.rexPhase=null;state.openingComplete=true;state.pendingStory=true;state.awaiting=true;modal='story';note('The guild has become a family. The road to the Heavenly City begins.');}
function beginGardenJourney(){state.bookGardenStarted=true;state.bookBattleReturn={enemy:state.enemy,world:state.world,worldStage:state.worldStage,regular:state.regular,awaiting:state.awaiting,chosen:[...state.chosen],fighters:JSON.parse(JSON.stringify(state.fighters)),battleId:state.battleId};townArchive();state.fighters=HEROES.map((_,id)=>townData().roster[id]||storyFighter(id));state.chosen=state.fighters.map(f=>f.id);state.malacharPhase='garden';beginOpeningScene('gardenInvite');}
function startGardenWave(index){close3D();state.gardenWave=index;state.malacharPhase='garden-'+index;const b=index===0?BOSSES[0]:index===1?MIDWORLD_BOSSES[3]:BOSSES[6],level=Math.max(8,...state.fighters.map(f=>f.level));const hp=index===2?1500:900;state.enemy={...b,boss:true,bossId:b.name,name:'BOSS · '+b.name,world:0,level,hp,max:hp,attack:index===2?35:27,guard:10,baseGuard:10,move:0};syncEnemyKit(state.enemy);state.awaiting=false;state.paused=false;state.actor=0;state.turn=0;state.battleId=newId();for(const f of state.fighters){f.hp=Math.max(f.hp,Math.round(fighterStats(f).max*.6));f.last=Array(8).fill(-100);}note(index===2?'Malachar faces the reunited company beneath the silver tree.':'Malachar sends an allied boss. Keep the guild together.');}
function startRexDemonstration(){close3D();state.malacharPhase=null;state.rexPhase='demonstration';state.rexRounds=0;const b=BOSSES[7];state.enemy={...b,boss:true,bossId:b.name,name:'Rex Draconum · overwhelming arrival',world:0,level:20,hp:99999,max:99999,attack:45,guard:40,baseGuard:40,move:0};syncEnemyKit(state.enemy);state.awaiting=false;state.paused=false;state.actor=0;state.turn=0;state.battleId=newId();note('Rex cannot be defeated here. Protect one another for two enemy turns until he withdraws.');}
function returnFromBookBattle(){const original=state.bookBattleReturn;if(!original)return;townArchive();Object.assign(state,original);state.bookBattleReturn=null;state.fighters=state.chosen.map(id=>townData().roster[id]||storyFighter(id));for(const f of state.fighters){f.hp=fighterStats(f).max;delete townData().fainted[f.id];}state.malacharPhase=null;state.rexPhase=null;state.paused=true;state.actor=0;state.turn=0;close3D();}
function bookVictory(){
 if(state.malacharPhase?.startsWith('garden-')){townBattleFinished();townBossWon();state.gold+=100;state.loot=[];addLoot('Fruit');addLoot('Gem');unlockBookChapter();if(state.gardenWave===0)beginOpeningScene('surrender');else if(state.gardenWave===1)startGardenWave(2);else{state.malacharPhase=null;beginOpeningScene('rexArrival');}save();return true;}
 return false;
}
function bookEnemyTurn(){if(state.rexPhase==='demonstration'){state.rexRounds=(state.rexRounds||0)+1;state.enemy.hp=state.enemy.max;if(state.rexRounds>=2){state.paused=true;beginOpeningScene('rexAfter');}}}
function bookBattleCheck(){if(state.rexPhase==='demonstration'){state.enemy.hp=Math.max(1,state.enemy.hp);return;}if(state.rexPhase==='final'&&!state.bookRestoration&&state.enemy.hp<=state.enemy.max*.5){state.bookRestoration=true;state.enemy.hp=Math.max(1,state.enemy.hp);state.rexPhase='restoration';beginOpeningScene('restoration');}}
function bookEncounterStart(){if(state.mode!=='campaign'||!state.openingComplete)return;if(state.world===6&&state.worldStage===9&&!state.bookRexWarning){const b=BOSSES[7];Object.assign(state.enemy,{...b,boss:true,bossId:b.name,name:'BOSS · Rex Draconum · canyon challenge'});syncEnemyKit(state.enemy);beginOpeningScene('kingLies');}if(state.world===6&&state.worldStage===19&&!state.bookFinalStarted){state.bookFinalStarted=true;state.rexPhase='final';state.roadParty=[...state.chosen];townArchive();state.fighters=HEROES.map((_,id)=>townData().roster[id]||storyFighter(id));state.chosen=state.fighters.map(f=>f.id);state.fighters.forEach(f=>f.hp=fighterStats(f).max);beginOpeningScene('finalStand');}}

let titleOpen=true,titleClipTimer=null;
function syncTitleClip(){clearTimeout(titleClipTimer);const v=document.querySelector('.titleBackdrop');if(!v||modal)return;v.autoplay=false;v.loop=false;v.pause();const cycle=()=>{v.style.opacity=0;titleClipTimer=setTimeout(()=>{if(!v.isConnected||modal||!titleOpen)return;v.currentTime=0;v.style.opacity=1;v.play().catch(()=>{v.style.opacity=0;});},25000);};v.onended=cycle;cycle();}

function titleScreen(){const hasSave=state.phase!=='selection';return `<section class="titleScreen"><video class="titleBackdrop" poster="assets/Sarko-Menu-Background.jpg" src="assets/Sarko-Trailer.mp4" muted playsinline preload="metadata" aria-hidden="true"></video><div class="titleShade"></div><div class="titleRail"><img class="titleCrest" src="icon-180.png" alt="Sarko crest"><h1>SARKO</h1><p class="eyebrow">Journey Toward the Light</p><h2>Classic RPG</h2><nav aria-label="Title menu">${lifeButton('titleContinue','CONTINUE GAME','',!hasSave)}${lifeButton('titleNew','NEW GAME')}${lifeButton('modal','ACCOUNT / CLOUD SAVES','data-modal="account"')}${lifeButton('modal','PLAY TOGETHER','data-modal="coop"')}${lifeButton('modal','SAVE FILES','data-modal="files"')}${lifeButton('titleTrailer','WATCH TRAILER')}${lifeButton('modal','RANKINGS','data-modal="scores"')}${lifeButton('modal','HELP','data-modal="guide"')}${lifeButton('modal','REPORT A BUG','data-modal="report"')}${lifeButton('fullscreen','FULL SCREEN')}</nav><p class="small">Mouse / touch · D-pad to move · A to select</p><p class="small">Radiant Kingdom Studios</p></div></section>`;}
function titleModal(){if(modal==='trailer')return modalFrame('Sarko · official game trailer','<video id="fullTrailer" src="assets/Sarko-Trailer.mp4" controls autoplay playsinline preload="metadata" style="width:100%;max-height:75vh" aria-label="Sarko game trailer"></video><p>Press B or Close to return to the title screen.</p>');if(modal==='titleNew')return modalFrame('Begin a new adventure',`<p>Start a new run in ${esc(saveFiles.slots[saveFiles.active].name)}? This resets the current run’s heroes, fruit and skill upgrades. Download a backup from Save Files first if you want to keep it.</p>${lifeButton('titleConfirmNew','START NEW RUN')}${lifeButton('modal','SAVE FILES','data-modal="files"')}`);return '';}
function titleHandle(a){if(a==='title'){document.querySelector('#music')?.pause();titleOpen=true;state.paused=true;modal='';close3D();save();render();return true;}if(a==='titleContinue'){titleOpen=false;modal='';state.paused=true;render();return true;}if(a==='titleNew'){modal='titleNew';render();return true;}if(a==='titleConfirmNew'){titleOpen=false;resetRun();return true;}if(a==='titleTrailer'){modal='trailer';render();return true;}return false;}
async function shareBackup(index){const slot=saveFiles.slots[index];if(!slot)return;save();const name=`Sarko-${slot.name.replace(/[^a-z0-9-]+/gi,'-')}.json`,file=new File([JSON.stringify({app:'Sarko Guild Card Arena',version:1,name:slot.name,state:slot.state})],name,{type:'application/json'});try{if(navigator.canShare?.({files:[file]})){await navigator.share({title:'Sarko saved-game backup',text:'Keep this Sarko backup safe. Import it from Save Files to restore the adventure.',files:[file]});return;}}catch(e){if(e.name==='AbortError')return;}downloadFile(index);toast('Backup downloaded. Attach the JSON file to an email to keep or share it.');}

function trainingRemember(){if(state.training||state.enemy?.boss||state.malacharPhase||state.rexPhase)return;const t=townData();t.encounters??=[];const key=`${state.mode}:${state.enemy.world}:${state.mode==='campaign'?state.worldStage:state.cleared}:${state.enemy.type}`;if(!t.encounters.some(e=>e.key===key))t.encounters.push({key,enemy:JSON.parse(JSON.stringify(state.enemy)),stage:state.mode==='campaign'?state.worldStage:state.regular});}
function trainingModal(){const t=townData();return modalFrame('Guild training · familiar encounters',`<p>Replay a regular monster you have already defeated. Bosses cannot be replayed. Training grants experience and gold, but removes the guaranteed treasure from the normal reward roll. It does not advance the map, score, story or boss unlocks. Training battles count toward fainting recovery.</p><div class="townRoster">${(t.encounters||[]).map((e,i)=>`<button class="townHero" data-action="trainingStart" data-index="${i}"><img src="${img(enemyArt(e.enemy))}" alt="${esc(e.enemy.name)}"><span>${esc(e.enemy.name)} · LV ${e.enemy.level}</span><small>${WORLD_NAMES[e.enemy.world]} · practice encounter</small></button>`).join('')||'<p>Defeat a regular monster to unlock its training encounter.</p>'}</div>${lifeButton('town','FIRST LIGHT')}`);}
function trainingStart(index){const e=townData().encounters?.[index];if(!e||e.enemy.boss||state.training||state.malacharPhase||state.rexPhase||state.openingScene||!state.awaiting||!state.fighters.some(f=>f.hp>0))return toast('Choose a rested party and finish the story encounter first.');state.training={enemy:state.enemy,world:state.world,worldStage:state.worldStage,regular:state.regular,awaiting:state.awaiting,pendingStory:state.pendingStory,pendingScene:state.pendingScene,battleId:state.battleId};state.enemy=JSON.parse(JSON.stringify(e.enemy));state.enemy.hp=state.enemy.max;state.enemy.move=0;state.enemy.guard=state.enemy.baseGuard??state.enemy.guard;state.world=e.enemy.world;state.worldStage=e.stage;state.regular=e.stage;state.pendingStory=false;state.pendingScene=null;state.awaiting=false;state.paused=true;state.actor=0;state.turn=0;state.battleId=newId();for(const f of state.fighters){f.last=Array(8).fill(-100);f.ward=false;}close3D();modal='';save();render();}
function trainingRestore(){const original=state.training;if(!original)return;Object.assign(state,original);state.training=null;state.paused=true;state.actor=0;state.turn=0;for(const f of state.fighters){f.last=Array(8).fill(-100);f.ward=false;}close3D();}
function trainingVictory(){const enemy=state.enemy;townBattleFinished();state.gold+=Math.round((24+enemy.level*10)*2.25*(1+state.chosen.reduce((n,id)=>n+fruitBonus(id,'Goodness'),0)));state.loot=[];if(Math.random()<.44)addLoot('Fruit');if(Math.random()<.18)addLoot('Gem');const t=townData();t.trainingWins=(t.trainingWins||0)+1;if(t.trainingWins%2===0)state.points++;for(const f of state.fighters){if(f.hp<=0)continue;f.xp+=Math.round((22+enemy.level*7)*(typeof coopRuntime!=='undefined'&&coopRuntime?2:1)*(1+fruitBonus(f.id,'Joy')));while(f.xp>=60+f.level*30){f.xp-=60+f.level*30;f.level++;f.hp=fighterStats(f).max;}}if(state.life)expireMeals(state.life);townArchive();const loot=state.loot.map(g=>g.name).join(', ');trainingRestore();t.message=`Training complete: ${enemy.name}. Experience and gold earned. ${loot?'Extra treasure: '+loot+'.':'No bonus treasure this time.'} The guaranteed treasure is omitted on replays.`;modal='town';save();}

// First Light: illustrated services, persistent reserves, and recoverable fainting.
let townPicks=[];
const TOWN_PLACES=[
 ['fish','Fishing pond',16,22,0],['mine','Crystal mine',87,17,3],['guild','Guild hall',50,42],['inn','Lantern Inn',24,47],['church','Church',76,37],['shop','Market',47,71],['forge','Forge',76,72],['wood','Legendary grove',16,76,2],['tree','Fruit of the Spirit',30,88]
];
const BOSS_COUNTERS={
 'Stoneheart Warden':{ids:[4,7],mechanic:'Living stone armor',hint:'Amaya’s precision or Isaac’s heavy hammer can break its stone armor.'},
 'Tidebound Oracle':{ids:[5],mechanic:'Veil of tides',hint:'Naomi reads the tidal rhythm. Bring her crossbow and counsel to expose the Oracle.'},
 'Frostveil Warden':{ids:[6],mechanic:'Whiteout veil',hint:'Hailey’s celestial bow finds its mark through the whiteout.'},
 'Thunderstone Colossus':{ids:[7],mechanic:'Storm shell',hint:'Isaac can ground the storm with his fortress stance and war hammer.'},
 'Cinder Crown':{ids:[0,8],mechanic:'Consuming embers',hint:'Sarko’s protection or Grace’s radiant support can hold back the consuming embers.'},
 'Malachar':{ids:[1,8],mechanic:'Shadow mantle',hint:'Levi’s formation or Grace’s heavenly light can break the shadow mantle.'},
 'Rex Draconum':{ids:[1],mechanic:'Royal dominion',hint:'Levi’s formation is the key to resisting Rex’s royal dominion.'}
};
function townData(){return state.town??={roster:{},fainted:{},battles:0,rescues:0,bossWins:[],message:'',retry:false};}
function townBossRule(){if(!state.enemy?.boss||state.malacharPhase||state.mode==='campaign'&&state.openingVersion&&!state.openingComplete)return null;return BOSS_COUNTERS[state.enemy.bossId]||null;}
function townCounterPresent(rule=townBossRule()){return !rule||state.fighters.some(f=>f.hp>0&&rule.ids.includes(f.id));}
function townDamage(hit){return Math.max(1,Math.round(hit*(townCounterPresent()?1:.28)));}
function townRemaining(id){return Math.max(0,townData().fainted[id]?.remaining||0);}
function townArchive(){const t=townData();for(const f of state.fighters){if(f.hp<=0&&!t.fainted[f.id])townFaint(f.id);t.roster[f.id]=JSON.parse(JSON.stringify(f));}}
function townFaint(id){const t=townData();if(!t.fainted[id])t.fainted[id]={remaining:3,battle:state.battleId};note(`${hero(id).name} has fainted and must sit out the next 3 battles.`);}
function townBattleFinished(){const t=townData();t.battles++;for(const [id,f]of Object.entries(t.fainted)){if(f.battle===state.battleId)continue;if(--f.remaining<=0){delete t.fainted[id];const fighter=t.roster[id];if(fighter)fighter.hp=fighterStats(fighter).max;const active=state.fighters.find(f=>f.id===Number(id));if(active)active.hp=fighterStats(active).max;note(`${hero(Number(id)).name} has recovered at First Light.`);}}townArchive();}
function townBossWon(){const t=townData(),l=lifeData();if(state.mode==='campaign'&&!l.malachar&&!state.malacharPhase)return;const key=state.malacharPhase?'story-'+state.malacharPhase+'-'+state.enemy.bossId:`${state.mode}:${state.difficulty}:${state.world}:${state.mode==='campaign'?state.worldStage:state.cleared}:${state.enemy?.bossId}`;if(!t.bossWins.includes(key)){t.bossWins.push(key);l.bosses=(l.bosses||0)+1;}if(state.malacharPhase||state.mode==='survival')l.malachar=true;const n=l.malachar?Math.min(6,l.bosses||1):0;if(n)note(`First Light: ${SKILLS.slice(0,n).join(', ')} available.`);}
function townNewFighter(id){return {id,level:1,xp:0,hp:hero(id).hp,nextSkill:0,last:Array(8).fill(-100),cooldownSavings:Array(8).fill(0)};}
function townOpen(){if(state.openingScene||state.guildPicking||state.malacharPhase||state.rexPhase)return toast('Finish this story encounter before visiting town.');townArchive();state.paused=true;modal='town';save();render();}
function townPartySize(){return state.mode==='campaign'&&state.openingVersion&&!state.openingComplete&&!state.malacharPhase?3:4;}
function townNeedsPatrol(){return HEROES.filter((_,id)=>!townRemaining(id)).length<4||!townGuildAllowed()&&state.fighters.filter(f=>f.hp>0&&!townRemaining(f.id)).length<townPartySize();}
function townGuildAllowed(){return state.phase!=='selection'&&(state.awaiting||townData().retry)&&(state.mode!=='campaign'||!state.openingVersion||state.openingComplete);}
function townSpot(place){const [id,name,x,y,skill]=place,locked=skill!==undefined&&!unlocked(lifeData(),skill)||id==='guild'&&!townGuildAllowed();return `<button class="townSpot ${locked?'locked':''}" style="left:${x}%;top:${y}%" data-action="townPlace" data-place="${id}" aria-label="${name}${locked?' · locked':''}"><span>${name}</span>${locked?'<small>LOCKED</small>':''}</button>`;}
function townModal(){const t=townData();return modalFrame('First Light',`<p>Click a building or gathering place to visit. Gold: <strong>${state.gold}</strong>${state.gold<0?' · Rescue debt: future earnings repay it.':''}</p>${t.message?`<p class="townNotice" role="status">${esc(t.message)}</p>`:''}<div class="townMapWrap"><div class="townMap"><img src="assets/illustrations/first-light-town.jpg" alt="First Light town with a guild hall, inn, church, market, forge, pond, crystal mine and legendary forest">${TOWN_PLACES.map(townSpot).join('')}</div></div><p class="small">Fishing opens after Malachar in the story, or your first Survival boss. Each further boss unlocks another craft. New guild recruits begin at level 1; returning recruits keep their training.</p>${t.retry?`<div class="actions"><input id="scoreName" class="nameInput" maxlength="30" placeholder="Your high-score name" value="${esc(state.playerName)}"><button class="button" data-action="submit" ${state.scoreSent?'disabled':''}>${state.scoreSent?'SCORE SAVED':'SAVE SCORE'}</button></div><p>Choose a rested team at the Guild Hall, then return to the same encounter.</p>${lifeButton('townRetry','RETURN TO ENCOUNTER','',state.fighters.filter(f=>f.hp>0&&!townRemaining(f.id)).length<townPartySize())}`:''}`);}
function townGuildModal(){const t=townData();return modalFrame('Guild Hall · assemble your company',`<p>Select four rested heroes. New recruits start at level 1. Returning heroes keep their levels, skills and health. Swapping does not heal a hero. Your journey and inventory continue.</p><div class="townRoster">${HEROES.map((h,id)=>{const locked=id===1&&state.mode==='campaign'&&state.openingVersion&&!state.openingComplete,remaining=townRemaining(id),f=t.roster[id];return `<button class="townHero ${townPicks.includes(id)?'selected':''}" data-action="townPick" data-id="${id}" ${remaining||locked?'disabled':''}><img src="${img(h.art+'.jpg')}" alt="${h.name}"><span>${h.name} · LV ${f?.level||1}</span><small>${locked?'Not yet met':remaining?`FAINTED · ${remaining} battles remaining`:townPicks.includes(id)?'IN PARTY':f?'Rested reserve':'New recruit'}</small></button>`;}).join('')}</div><button class="townServiceImage" data-action="training"><img src="assets/book/training.jpg" alt="Guild practice grounds"><span>Training grounds · replay defeated monsters</span></button><p>${townPicks.length}/4 selected</p>${lifeButton('townConfirm','SET OUT TOGETHER','',townPicks.length!==4)}${lifeButton('town','BACK TO TOWN')}`);}
function townInnModal(){const t=townData(),rest=25+10*(state.world||0),allUnavailable=townNeedsPatrol();return modalFrame('Lantern Inn',`<div class="townInterior"><img src="assets/illustrations/life-skills.jpg" alt="First Light inn and cooking hearth"><button data-action="lifeTab" data-index="1" class="townInteriorSpot">Cooking hearth${unlocked(lifeData(),1)?'':' · LOCKED'}</button></div><p>Rest heals your conscious party. Fainted heroes recover after three other battles; ordinary rest does not skip that recovery.</p>${lifeButton('townRest',`REST · ${rest} GOLD`,'',state.gold<rest)}${allUnavailable?`<p>Too few rested heroes remain. The rescue company can cover three patrol battles while your heroes recover. No loot, experience, boss unlocks or score are awarded for these patrols.</p>${lifeButton('townPatrol','REST WHILE THE GUILD COVERS 3 PATROLS')}`:''}<h3>Recovery ward</h3>${Object.entries(t.fainted).map(([id,f])=>`<p>${hero(Number(id)).name}: fainted · ${f.remaining} battles remaining</p>`).join('')||'<p>Everyone is ready for adventure.</p>'}${lifeButton('town','BACK TO TOWN')}`);}
function townVisit(id){if(id==='guild'){if(!townGuildAllowed())return toast('Locked · meet the guild first, and visit between battles.');townArchive();townPicks=state.chosen.filter(id=>!townRemaining(id));modal='townGuild';render();return;}if(id==='inn'){modal='townInn';render();return;}if(['fish','mine','wood'].includes(id)){lifeOpen({fish:0,mine:3,wood:2}[id]);return;}if(['shop','church','forge','tree'].includes(id))openModal(id);}
function townConfirm(){if(state.malacharPhase||state.rexPhase||!townGuildAllowed())return;if(townPicks.length!==4||townPicks.some(id=>townRemaining(id)))return;townArchive();const t=townData();for(const g of state.inventory)if(g.equippedTo!==null&&!townPicks.includes(g.equippedTo))g.equippedTo=null;state.chosen=[...townPicks];state.fighters=townPicks.map(id=>JSON.parse(JSON.stringify(t.roster[id]||townNewFighter(id))));for(const f of state.fighters){f.hp=Math.min(f.hp,fighterStats(f).max);f.last=Array(8).fill(-100);f.ward=false;}selectedHero=state.chosen[0];state.actor=0;manualChoice=null;state.paused=true;if(threeView||threeHost)close3D();state.battleId=newId();modal='town';save();render();}
function townRescue(){const t=townData();townBattleFinished();t.rescues++;const fee=80+20*(state.world||0)+10*Math.max(1,state.enemy?.level||1);state.gold-=fee;state.paused=true;state.awaiting=true;t.retry=true;const hint=townBossRule()?.hint;t.message=`Your company has fainted. Another guild team rescues you and brings you back to First Light to rest. Rescue payment: ${fee} gold.${state.gold<0?' Your balance is negative; future earnings will repay the guild.':''}${hint?' Boss hint: '+hint:''}`;note(t.message);modal='town';save();}
function townHandle(a,id,place){
 if(a==='town'){townOpen();return true;}if(a==='townPlace'){townVisit(place);return true;}if(a==='townPick'){if(townRemaining(id))return true;if(townPicks.includes(id))townPicks=townPicks.filter(x=>x!==id);else if(townPicks.length<4)townPicks.push(id);render();return true;}if(a==='townConfirm'){townConfirm();return true;}
 if(a==='townRest'){const fee=25+10*(state.world||0);if(state.gold>=fee){state.gold-=fee;state.fighters.filter(f=>f.hp>0).forEach(f=>f.hp=fighterStats(f).max);townArchive();save();render();}return true;}
 if(a==='townPatrol'){if(!townNeedsPatrol())return true;const t=townData();for(const id of Object.keys(t.fainted)){delete t.fainted[id];if(t.roster[id])t.roster[id].hp=fighterStats(t.roster[id]).max;}for(const f of state.fighters)f.hp=fighterStats(f).max;t.battles+=3;t.message='Three guild patrol battles pass while your company rests. Your heroes have recovered. Choose a team in the Guild Hall.';modal='town';save();render();return true;}
 if(a==='townRetry'){if(!townData().retry||state.fighters.filter(f=>f.hp>0&&!townRemaining(f.id)).length<townPartySize())return true;townData().retry=false;townData().message='';state.scoreSent=false;state.scoreRunId=scoreUUID();state.scoreRunToken=scoreUUID();state.enemy.hp=state.enemy.max;state.enemy.guard=state.enemy.baseGuard??state.enemy.guard;state.enemy.move=0;state.awaiting=false;state.actor=0;state.turn=0;state.paused=true;modal='';state.battleId=newId();save();render();return true;}return false;
}

// Browser adaptation of Sarko's FishingRound and RecipeActivity rules.
const SKILLS=['Fishing','Cooking','Woodcutting','Mining','Forging','Wisdom'];
const FISH=['Brook Minnow','River Perch','Bluefin Dace','Reed Carp','Silver Trout','Amber Bass','Moon Bream','Crystal Pike','Golden Char'];
const MEALS=['Crispy Brook Minnow','Herb-roasted River Perch','Pan-seared Bluefin Dace','Roasted Reed Carp','Herb-seared Silver Trout','Skillet Amber Bass','Moon Bream Supper','Crystal Pike Steak','Golden Char Feast'];
const BONUSES=['Gathering','Health','Attack','Defense','Health','Gathering','Healing','Critical','Defense'];
const LESSONS=[
 'Malachar has retreated. Let us learn to provide for our company. Cast your line, then wait for the bite before you hook the fish. During the reel, tap to switch between reeling and resting. Keep tension inside the green band. Too much tension breaks the line. Successful catches earn experience. Higher fishing levels unlock better fish. Keep fish for cooking, or sell your spare catch at the merchant.',
 'A meal can prepare us for the road ahead. Select a recipe and bring its required fish, plus grain or herbs from the merchant. Chop, add, wait, flip, then remove the meal. Follow each instruction and time your actions in the green zone. Meals restore health and grant a bonus for the next three victories. One meal bonus per hero: a new meal replaces the old one. Higher cooking levels unlock stronger recipes.',
 'Good wood rewards a steady hand. Choose a tree within your woodcutting level. Strike when the moving marker reaches the green zone. Land three good strikes before three misses. Better timing gives extra supplies. Higher levels open stronger timber. Sell spare wood at the merchant, or keep it for forging.',
 'Read the stone before you strike. Choose an ore vein within your mining level. Hit the moving marker inside the green zone three times, before three misses. Excellent timing earns extra ore. Higher levels reveal rarer veins. Your ore can be sold or used at the forge.',
 'Now we can shape what we have gathered. Bring matching wood and ore to the forge. Heat, hammer, hammer, hammer, then quench. Time every action in the green zone. Success creates a trade ingot worth more than the raw materials. Higher forging levels unlock more valuable work. Ingredients are used when you begin, so take your time.',
 'Wisdom grows when we listen and put truth into practice. Read the passage, then choose the answer that completes it. Correct answers earn wisdom experience and a study token you can sell at the merchant. As your wisdom grows, more questions become available. You may read the lesson again whenever you need it.'
];
function freshLife(){return {version:1,malachar:false,worlds:0,bosses:0,xp:Array(6).fill(0),seen:[],bag:{},buffs:{}};}
function level(xp){let n=1;while(n<10&&xp>=n*(n+1)*20)n++;return n;}
function unlocked(life,i){if(i===0&&life.questApprentice)return true;return life.malachar&&(life.bosses??Math.max(1,(life.worlds||0)*2-1))>=i+1;}
function item(id){if(typeof id!=='string')return null;const [kind,n]=id.split('-'),i=Number(n)||0;if(['fish','meal','wood','ore','ingot'].includes(kind)&&(!/^\d+$/.test(n)||!Number.isInteger(i)||i<0||i>(['fish','meal'].includes(kind)?8:2)))return null;if(kind==='fish')return {name:FISH[i],sell:8+i*5};if(kind==='meal')return {name:MEALS[i],sell:22+i*9,heal:20+i*8,bonus:BONUSES[i],power:.03+i*.012};if(kind==='wood')return {name:['Oak','Ash','Radiant Cedar'][i]+' timber',sell:12+i*16};if(kind==='ore')return {name:['Iron','Silver','Sunstone'][i]+' ore',sell:16+i*19};if(kind==='ingot')return {name:['Iron','Silver','Sunstone'][i]+' trade ingot',sell:85+i*85};if(id==='grain'||id==='herbs')return {name:id,sell:2,buy:5};if(id==='token')return {name:'Wisdom study token',sell:12};return null;}
function ingredients(skill,tier){return skill===1?{['fish-'+tier]:1,[tier%3===0?'grain':'herbs']:1}:skill===4?{['wood-'+tier]:2,['ore-'+tier]:2}:{};}
function requiredLevel(skill,tier){return skill===0||skill===1?tier+1:1+tier*3;}
function canCraft(life,skill,tier){return Object.entries(ingredients(skill,tier)).every(([id,n])=>(life.bag[id]||0)>=n);}
function startActivity(life,skill,tier=0,random=Math.random){
 if(!Number.isInteger(skill)||skill<0||skill>5||!Number.isInteger(tier)||tier<0||tier>(skill<2?8:2)||!unlocked(life,skill)||level(life.xp[skill])<requiredLevel(skill,tier))return null;
 if((skill===1||skill===4)&&!canCraft(life,skill,tier))return null;
 for(const [id,n]of Object.entries(ingredients(skill,tier)))life.bag[id]-=n;
 return {skill,tier,phase:skill===0?'cast':'active',time:0,wait:2.5+random()*2.5,tension:.4,progress:0,overload:0,reel:false,step:0,hits:0,misses:0,perfect:0,claimed:false};
}
function meter(a){return (Math.sin(a.time*(1.8+a.tier*.3))+1)/2;}
function tickActivity(a,dt){if(!a||['won','lost'].includes(a.phase))return;dt=Math.max(0,Math.min(.1,dt));a.time+=dt;
 if(a.skill!==0)return;
 if(a.phase==='waiting'&&a.time>=a.wait){a.phase='bite';a.time=0;}
 else if(a.phase==='bite'&&a.time>2.2){a.phase='lost';}
 else if(a.phase==='reel'){a.tension=Math.max(0,Math.min(1,a.tension+dt*((a.reel?.16+a.tier*.005:-.2)+Math.sin(a.time*1.3)*.03)));const safe=a.tension>=.18&&a.tension<=.8;a.progress=Math.max(0,Math.min(1,a.progress+dt*(a.reel&&safe?.095:a.tension<.18?-.025:0)));a.overload=a.tension>.93?a.overload+dt:Math.max(0,a.overload-dt*2);if(a.overload>2||a.time>90)a.phase='lost';else if(a.progress>=1)a.phase='won';}
}
function actActivity(a){if(!a||['won','lost'].includes(a.phase))return;
 if(a.skill===0){if(a.phase==='cast'){a.phase='waiting';a.time=0;}else if(a.phase==='waiting')a.phase='lost';else if(a.phase==='bite'){a.phase='reel';a.time=0;a.reel=true;}else if(a.phase==='reel')a.reel=!a.reel;return;}
 if(a.skill===5)return;
 if(a.skill===1&&a.step===2){if(a.time<2)return;a.step++;a.time=0;return;}
 const accuracy=Math.abs(meter(a)-.5);if(accuracy<=.22){a.hits++;a.step++;if(accuracy<.08)a.perfect++;}else a.misses++;
 a.time=0;if(a.misses>=3)a.phase='lost';else if(a.hits>=(a.skill===1?4:a.skill===4?5:3))a.phase='won';
}
const QUESTIONS=[['The fruit of the Spirit includes love, joy and…','Peace','Pride','Envy','Galatians 5:22–23'],['Be quick to listen and slow to…','Speak','Care','Forgive','James 1:19'],['Love is patient, love is…','Kind','Boastful','Envious','1 Corinthians 13:4'],['Walk by faith, not by…','Sight','Love','Hope','2 Corinthians 5:7'],['A gentle answer turns away…','Wrath','Kindness','Truth','Proverbs 15:1'],['Blessed are the…','Peacemakers','Proud','Cruel','Matthew 5:9']];
function claimActivity(life,a,random=Math.random){if(!a||a.claimed||a.phase!=='won')return null;a.claimed=true;const id=a.skill===0?'fish-'+a.tier:a.skill===1?'meal-'+a.tier:a.skill===2?'wood-'+a.tier:a.skill===3?'ore-'+a.tier:a.skill===4?'ingot-'+a.tier:'token';let count=(a.skill===2||a.skill===3)&&a.perfect>=2?2:1;const gathering=Math.max(0,...Object.values(life.buffs).filter(b=>b.kind==='Gathering'&&b.victories>0).map(b=>b.power));if([0,2,3].includes(a.skill)&&random()<gathering)count++;life.bag[id]=(life.bag[id]||0)+count;const xp=12+a.tier*3;life.xp[a.skill]+=xp;return {id,count,xp};}
function sellItem(life,id,gold){const info=item(id);if(!info||!(life.bag[id]>0))return gold;life.bag[id]--;return gold+info.sell;}
function buyIngredient(life,id,gold){const info=item(id);if(!info?.buy||gold<info.buy)return gold;life.bag[id]=(life.bag[id]||0)+1;return gold-info.buy;}
function eatMeal(life,id,hero,hp,max){const info=item(id);if(!id.startsWith('meal-')||!info||!(life.bag[id]>0)||hp<=0)return null;life.bag[id]--;life.buffs[hero]={kind:info.bonus,power:info.power,victories:3};return {hp:Math.min(max,hp+info.heal),healed:Math.min(max-hp,info.heal)};}
function expireMeals(life){for(const [id,buff]of Object.entries(life.buffs))if(--buff.victories<=0)delete life.buffs[id];}

let lifeTab=0,lifeRound=null,lifeLesson=false,lifeResult='',lifeQuestion=0;
function lifeData(){
 if(!state.life)state.life=freshLife();
 if(state.mode==='campaign'&&state.openingComplete&&state.openingVersion){state.life.malachar=true;state.life.bosses=Math.max(1,state.life.bosses||0);state.life.worlds=Math.max(state.life.worlds,state.world||0);}
 return state.life;
}
function lifeBonus(id,kind){const b=state.life?.buffs?.[id];return b?.kind===kind&&b.victories>0?b.power:0;}
function lifeButton(action,label,extra='',disabled=false){return `<button class="button" data-action="${action}" ${extra} ${disabled?'disabled':''}>${label}</button>`;}
function lifeOpen(index){if(!SKILLS[index])return;lifeRound=null;lifeResult='';lifeTab=index;lifeLesson=!lifeData().seen.includes(index);modal='life';state.paused=true;save();render();}
function lifeStart(tier){const l=lifeData();lifeRound=startActivity(l,lifeTab,tier);if(!lifeRound)return toast('Check your level and ingredients.');lifeQuestion=Math.floor(Math.random()*Math.min(QUESTIONS.length,level(l.xp[5])+1));lifeResult='';save();render();document.querySelector('#lifeAction, [data-action=lifeAnswer]')?.focus();}
function lifeFinish(){const reward=claimActivity(lifeData(),lifeRound);if(reward){lifeResult=`${item(reward.id).name} × ${reward.count} · +${reward.xp} ${SKILLS[lifeTab]} XP`;save();}else if(lifeRound?.phase==='lost')lifeResult='Try again. Watch the timing and tension carefully.';render();}
function lifeAct(){if(!lifeRound)return;actActivity(lifeRound);if(['won','lost'].includes(lifeRound.phase))lifeFinish();else render();}
function lifeAnswer(answer){if(!lifeRound||lifeRound.claimed||lifeRound.skill!==5||lifeRound.phase!=='active')return;lifeRound.phase=answer===0?'won':'lost';lifeFinish();}
function lifeInventory(selling=false){const l=lifeData();return `<div class="inventory">${Object.entries(l.bag).filter(([id,n])=>n>0&&item(id)).map(([id,n])=>{const info=item(id);return `<div class="shopItem"><div class="grow"><strong>${esc(info.name)} × ${n}</strong><p>${info.heal?`Heals ${info.heal} HP · +${Math.round(info.power*100)}% ${info.bonus} for 3 victories.`:''} Sell value: ${info.sell} gold</p></div>${selling?lifeButton('lifeSell','SELL ONE',`data-item="${id}"`):id.startsWith('meal-')?lifeButton('lifeEat','FEED SELECTED HERO',`data-item="${id}"`):''}</div>`;}).join('')||'<p>No supplies yet. Complete a life-skill activity to earn some.</p>'}</div>`;}
function lifeShop(){return `<section class="panel panelpad"><h3>Life-skill supplies & sales</h3><p>Buy cooking ingredients, or sell your catches, meals and crafted supplies.</p><div class="actions">${['grain','herbs'].map(id=>lifeButton('lifeBuy',`BUY ${id.toUpperCase()} · 5 GOLD`,`data-item="${id}"`,state.gold<5)).join('')}</div>${lifeInventory(true)}</section>`;}
function lifeModal(){const l=lifeData(),allowed=unlocked(l,lifeTab),lv=level(l.xp[lifeTab]);
 const head=`<div class="lifeBanner lifeArt${lifeTab}"><h2>${SKILLS[lifeTab]}</h2><span>Level ${lv} · ${l.xp[lifeTab]} total XP</span></div>${lifeButton('town','FIRST LIGHT')}`;
 if(!allowed)return modalFrame('Life skills',head+`<p class="empty">${lifeTab===0?'Fishing is LOCKED. Defeat Malachar in the story, or your first Survival boss.':SKILLS[lifeTab]+' is LOCKED. Defeat '+Math.max(1,lifeTab+1-(l.bosses||0))+' more bosses after fishing opens.'}</p><p>Fishing → Cooking → Woodcutting → Mining → Forging → Wisdom. No beast taming.</p>`);
 if(lifeLesson)return modalFrame(SKILLS[lifeTab]+' · First lesson',head+`<div class="narrativeSpeech"><img src="${img('Diago.jpg')}" alt="Diago"><div><span class="eyebrow">Diago · your guild mentor</span><p>${LESSONS[lifeTab]}</p></div></div><div data-dialogue-audio="life-${lifeTab}"></div>${lifeButton('lifeLessonDone','LET’S BEGIN')}`);
 let activity='';
 if(lifeRound&&!['won','lost'].includes(lifeRound.phase)){
 const a=lifeRound,steps=a.skill===1?['CHOP','ADD','WAIT','FLIP','REMOVE']:['HEAT','HAMMER','HAMMER','HAMMER','QUENCH'];
 activity=`<div class="lifePlay"><h3 id="lifeStatus">${lifeStatusText()}</h3><div class="lifeMeter"><span class="lifeSafe"></span><i id="lifeMarker"></i></div><progress id="lifeProgress" max="1" value="${a.progress}"></progress><p id="lifeHint"></p>${a.skill===5?`<h3>${QUESTIONS[lifeQuestion][0]}</h3><p>${QUESTIONS[lifeQuestion][4]}</p><div class="actions">${[1,2,0].map(i=>lifeButton('lifeAnswer',QUESTIONS[lifeQuestion][i+1],`data-index="${i}"`)).join('')}</div>`:lifeButton('lifeAct',a.skill===0?'CAST / HOOK / TOGGLE REEL':a.skill===1||a.skill===4?steps[Math.min(a.step,4)]:'STRIKE', 'id="lifeAction"')}<p>${[1,4].includes(a.skill)?'Ingredients are used when you start; leaving forfeits them. ':''}Click / tap the action button or press Xbox A. ${a.skill===0?'Toggle reeling and resting to stay in the green band.':'Three misses ends the attempt.'}</p>${lifeButton('lifeCancel','LEAVE ACTIVITY')}</div>`;
 }else{
 const max=lifeTab<2?9:lifeTab===5?1:3;
 activity=`${lifeResult?`<p role="status" class="lifeReward">${lifeResult}</p>`:''}<div class="shopGrid">${Array.from({length:max},(_,i)=>{const name=lifeTab===0?FISH[i]:lifeTab===1?MEALS[i]:lifeTab===2?item('wood-'+i).name:lifeTab===3?item('ore-'+i).name:lifeTab===4?item('ingot-'+i).name:'Scripture study',req=requiredLevel(lifeTab,i),parts=Object.entries(ingredients(lifeTab,i));return `<div class="panel panelpad"><h3>${name}</h3><p>Level ${req}${parts.length?' · '+parts.map(([id,n])=>`${n} ${item(id).name} (${l.bag[id]||0} owned)`).join(' + '):''}</p>${lifeTab===1?`<p>Heals ${item('meal-'+i).heal} HP · ${item('meal-'+i).bonus} bonus</p>`:''}${lifeButton('lifeStart',lv<req?'LEVEL '+req+' REQUIRED':'START',`data-index="${i}"`,lv<req||!canCraft(l,lifeTab,i))}</div>`;}).join('')}</div>`;
 }
 return modalFrame('Guild life skills',head+activity+`<div class="actions">${lifeButton('lifeTutorial','READ THE LESSON')}${lifeButton('town','FIRST LIGHT')}</div><h3>Meals & supplies</h3><p>Choose who eats a meal. Food heals conscious heroes; fainted heroes need three battles to recover. New bonuses replace old ones.</p>${tabs()}<p>Selected: ${hero(state.chosen.includes(selectedHero)?selectedHero:state.chosen[0]??0).name}</p>${lifeInventory()}`);
}
function lifeStatusText(){const a=lifeRound;if(!a)return '';if(a.skill===0)return {cast:'Cast your line',waiting:'Wait for a bite…',bite:'BITE! Hook it now!',reel:a.reel?'Reeling · watch tension':'Resting · line tension easing'}[a.phase]||a.phase;return `Step ${a.step+1} · ${a.hits} good hits · ${a.misses}/3 misses`;}
function lifeTick(){if(modal!=='life'||lifeLesson||!lifeRound||document.hidden)return;const a=lifeRound;if(['won','lost'].includes(a.phase))return;tickActivity(a,.05);if(['won','lost'].includes(a.phase)){lifeFinish();return;}const status=document.querySelector('#lifeStatus'),marker=document.querySelector('#lifeMarker'),progress=document.querySelector('#lifeProgress'),hint=document.querySelector('#lifeHint'),button=document.querySelector('#lifeAction');if(status)status.textContent=lifeStatusText();if(marker)marker.style.left=((a.skill===0?a.tension:meter(a))*100)+'%';if(progress)progress.value=a.skill===0?a.progress:a.hits/(a.skill===4?5:a.skill===1?4:3);if(hint)hint.textContent=a.skill===0?`Tension ${Math.round(a.tension*100)}% · Catch ${Math.round(a.progress*100)}%`:a.skill===1&&a.step===2?`Let it cook: ${Math.max(0,2-a.time).toFixed(1)} seconds`:'Strike in the green zone';if(button&&a.skill===0)button.textContent={cast:'CAST',waiting:'WAIT…',bite:'HOOK NOW',reel:a.reel?'REST LINE':'REEL IN'}[a.phase];}
function lifeHandle(action,index,itemId){
 if(action==='lifeTab'){lifeOpen(index);return true;}if(action==='lifeLessonDone'){if(!lifeData().seen.includes(lifeTab))lifeData().seen.push(lifeTab);lifeLesson=false;save();render();return true;}if(action==='lifeTutorial'){lifeRound=null;lifeLesson=true;render();return true;}
 if(action==='lifeStart'){lifeStart(index);return true;}if(action==='lifeAct'){lifeAct();return true;}if(action==='lifeAnswer'){lifeAnswer(index);return true;}if(action==='lifeCancel'){lifeRound=null;render();return true;}
 if(action==='lifeSell'){state.gold=sellItem(lifeData(),itemId,state.gold);save();render();return true;}if(action==='lifeBuy'){state.gold=buyIngredient(lifeData(),itemId,state.gold);save();render();return true;}
 if(action==='lifeEat'){const f=state.fighters.find(f=>f.id===selectedHero)||state.fighters[0];if(!f)return true;const result=eatMeal(lifeData(),itemId,f.id,f.hp,fighterStats(f).max);if(result){f.hp=Math.min(result.hp,fighterStats(f).max);save();render();toast(`${hero(f.id).name} restores ${result.healed} HP. Meal bonus active.`);}else toast('Choose a living hero and an available meal.');return true;}return false;
}

setInterval(lifeTick,50);
render();

function nextDialogueLine(){if(modal==='opening')advanceOpening();else if(modal==='story')continueStory();else if(modal==='scene')continueScene();}
document.addEventListener('click',event=>{if(event.target.closest('[data-dialogue-next]')&&!event.target.closest('button,a,input'))nextDialogueLine();});
document.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&event.target.matches('[data-dialogue-next]')){event.preventDefault();nextDialogueLine();}});

setInterval(()=>{if(pendingScores().length)syncScores();},15000);

initCloud();

document.addEventListener('change',async event=>{if(event.target.id!=='cloudRecoveryImport')return;const file=event.target.files?.[0];if(!file)return;try{if(file.size>2097152)throw Error('Recovery file is too large.');const p=JSON.parse(await file.text());if(!cloudValid(p))throw Error('Invalid recovery file.');if(!confirm('Restore all three files from this recovery copy? Download a backup first if you want to keep the current files.'))return;localStorage.setItem('sarko-cloud-recovery',JSON.stringify(cloudCapture()));cloudApply(p);cloud?.localSaved();modal='account';cloudMessage='Recovery files loaded on this device.';render();}catch(e){toast(e.message);}});
