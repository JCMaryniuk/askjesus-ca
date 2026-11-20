// Shared, deterministic rules for the website and packaged app.
export const RULES_VERSION=2;
export const DIFFICULTY_RULES=[
 {name:'Easy',combat:1,xp:1},{name:'Medium',combat:1.5,xp:1.25},
 {name:'Hard',combat:2,xp:1.5},{name:'Hardcore',combat:2,xp:2}
];
export const worldStages=world=>world===0?10:20;
export const isBossStage=(world,stage)=>world===0?stage===9:[9,19].includes(stage);
export const difficultyScale=(difficulty=0,cycles=0)=>DIFFICULTY_RULES[difficulty]?.combat*2**Math.max(0,cycles)||1;
export const experienceScale=difficulty=>DIFFICULTY_RULES[difficulty]?.xp||1;
export const mayChooseDifficulty=(difficulty,completed)=>Number.isInteger(difficulty)&&difficulty>=0&&difficulty<4&&(difficulty<3||completed);
export const ACTIVE_NODES=[0,1,3,5,7,9,11,13,15];
export const PASSIVE_BONUSES=[['max',.08],['attack',.06],['defense',.08],['healing',.12],['crit',.04],['resist',.04],['max',.1]];
const PASSIVE_NAMES=['Steadfast Heart','Practised Hands','Patient Defender','Compassionate Service','Watchful Spirit','Unshaken Faith','Enduring Hope'];
const GIFTS=['Shepherd','Apostle','Pathfinder','Mentor','Vanguard','Witness','Restorer','Fortress','Evangelist'];
export function skillTree(id,skills){let passive=0;return Array.from({length:16},(_,node)=>{
 const active=ACTIVE_NODES.indexOf(node);
 if(active>=0){const source=active<8?active:0,s=skills[source];return {node,kind:'active',active,source,id:s?.id||'attack',name:active===8?`${GIFTS[id]}’s Mastery`:s?.name||'Basic Attack',description:active===8?'A mastered version of the first technique, with greater effect. Uses its familiar combat motion.':s?.description||'',cost:50+node*25};}
 const p=passive++;return {node,kind:'passive',name:`${GIFTS[id]} · ${PASSIVE_NAMES[p]}`,description:`Permanently grants +${Math.round(PASSIVE_BONUSES[p][1]*100)}% ${PASSIVE_BONUSES[p][0]==='max'?'maximum health':PASSIVE_BONUSES[p][0]}.`,bonus:PASSIVE_BONUSES[p],cost:50+node*25};
 });}
export function ensureLoadout(f){
 if(!Array.isArray(f.purchasedNodes))f.purchasedNodes=[0,1];
 f.purchasedNodes=[...new Set(f.purchasedNodes.filter(n=>Number.isInteger(n)&&n>=0&&n<16))].sort((a,b)=>a-b);
 if(!Array.isArray(f.equippedSkills))f.equippedSkills=[0,1];
 f.equippedSkills=[...new Set(f.equippedSkills.filter(i=>Number.isInteger(i)&&ACTIVE_NODES[i]!==undefined&&f.purchasedNodes.includes(ACTIVE_NODES[i])))].slice(0,4);
 f.last=Array.from({length:9},(_,i)=>Number.isFinite(f.last?.[i])?f.last[i]:-100);
 if(!f.equippedSkills.includes(f.queuedSkill)&&f.queuedSkill!==-1){f.queuedSkill=null;f.healTarget=null;}
 return f;
}
export function purchaseNode(f,node,wallet){ensureLoadout(f);if(!Number.isInteger(node)||node<0||node>15||f.purchasedNodes.includes(node)||(node>0&&!f.purchasedNodes.includes(node-1)))return false;
 const cost=50+node*25;if(wallet.gold<cost||wallet.points<1)return false;
 wallet.gold-=cost;wallet.points--;f.purchasedNodes.push(node);return true;
}
export function equipActive(f,index){ensureLoadout(f);if(!f.purchasedNodes.includes(ACTIVE_NODES[index]))return false;
 if(f.equippedSkills.includes(index)){f.equippedSkills=f.equippedSkills.filter(i=>i!==index);if(f.queuedSkill===index){f.queuedSkill=null;f.healTarget=null;}return true;}
 if(f.equippedSkills.length>=4)return false;f.equippedSkills.push(index);return true;
}
export function teamBonuses(fighters){const has=id=>fighters.some(f=>f.id===id&&!f.permanentlyLost);return {attack:has(1)?1.25:1,defense:has(3)?1.25:1,max:has(6)?1.25:1,crit:has(2)?.25:0};}
export function passiveBonuses(f){ensureLoadout(f);const result={};let p=0;for(let node=2;node<16;node+=2){const [key,value]=PASSIVE_BONUSES[p++];if(f.purchasedNodes.includes(node))result[key]=(result[key]||0)+value;}return result;}
export function selectHealTarget(fighters,manual,targetId){const alive=fighters.filter(f=>f.hp>0&&!f.permanentlyLost);return manual?alive.find(f=>f.id===targetId)||null:alive.reduce((a,b)=>!a||b.hp<a.hp?b:a,null);}
export function questSeed(seed,world,stage,cycle){let n=(seed^Math.imul(world+1,73856093)^Math.imul(stage+1,19349663)^Math.imul(cycle+1,83492791))>>>0;return ()=>{n^=n<<13;n^=n>>>17;n^=n<<5;return (n>>>0)/4294967296;};}
export function questRequirements({world=0,stage=0,cycle=0,seed=1}){
 const rand=questSeed(seed,world,stage,cycle),slot=stage-(stage>9?1:0);
 // Each ten-stage route has nine help tiles: the first six cover all six skills.
 const primary=(slot%9)%6,selected=[primary];
 if(world>=2)selected.push((primary+1+Math.floor(rand()*5))%6);
 const lifeLevel=1+Math.min(6,Math.floor(world*.7)+Math.floor((stage%10)/7));
 const requirements=selected.map(skill=>{const tier=skill===5?0:skill<2?Math.max(0,lifeLevel-1):Math.floor((lifeLevel-1)/3);return {skill,tier,level:skill<2?tier+1:skill===5?lifeLevel:1+tier*3,id:skill===5?'token':['fish','meal','wood','ore','ingot'][skill]+'-'+tier,count:1+Math.floor(rand()*2)+Math.floor(world/3)};});
 return {requirements,characterLevel:1+world*2+Math.floor(stage/7)};
}
