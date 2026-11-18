const clone=x=>structuredClone(x);
export function validateLoadout(p){
  return !!(p&&Array.isArray(p.heroes)&&p.heroes.length===2&&new Set(p.heroes).size===2&&p.heroes.every(id=>Number.isInteger(id)&&id>=0&&id<9)&&Array.isArray(p.fighters)&&p.fighters.length===2&&new Set(p.fighters.map(f=>f?.id)).size===2&&p.fighters.every(f=>f&&p.heroes.includes(f.id)&&Number.isInteger(f.level)&&f.level>=1&&Number.isFinite(f.hp)&&f.hp>0&&Number.isFinite(f.xp)&&f.xp>=0)&&Array.isArray(p.inventory)&&p.inventory.every(g=>g&&(g.equippedTo===null||p.heroes.includes(g.equippedTo)))&&Array.isArray(p.life?.xp)&&p.life.xp.length===6&&p.life.xp.every(x=>Number.isFinite(x)&&x>=0)&&p.life.bag&&typeof p.life.bag==='object'&&!Array.isArray(p.life.bag)&&Object.values(p.life.bag).every(n=>Number.isSafeInteger(n)&&n>=0));
}
export function assembleParty(members){
  if(members.length!==2||members.some(m=>!validateLoadout(m.loadout)))throw Error('Each player must choose two conscious heroes.');
  const heroes=members.flatMap(m=>m.loadout.heroes);if(new Set(heroes).size!==4)throw Error('Choose four different heroes across the two players.');
  const owners=Object.fromEntries(members.flatMap(m=>m.loadout.heroes.map(id=>[id,m.user_id])));
  return {heroes,owners,fighters:clone(members.flatMap(m=>m.loadout.fighters)),inventory:clone(members.flatMap(m=>m.loadout.inventory)),ranks:Object.assign({},...members.map(m=>m.loadout.ranks||{}))};
}
export function combinedLife(members,getLevel){
  const lives=members.map(m=>m.loadout.life),levels=Array.from({length:6},(_,i)=>Math.min(10,lives.reduce((sum,l)=>sum+getLevel(l.xp[i]),0)));
  const bag={};for(const life of lives)for(const [id,n]of Object.entries(life.bag||{}))bag[id]=(bag[id]||0)+Math.max(0,n);
  return {levels,bag};
}
export function sharedRequirements(requirements,members,getLevel){const shared=combinedLife(members,getLevel);return requirements.every(r=>shared.levels[r.skill]>=r.level&&(shared.bag[r.id]||0)>=r.count);}
export function allocateSupplies(requirements,members,getLevel){
  if(!sharedRequirements(requirements,members,getLevel))throw Error('The team needs more levels or supplies.');
  const out=members.map(m=>({user_id:m.user_id,bag:{...m.loadout.life.bag},used:{}}));
  for(const req of requirements){let remaining=req.count;for(const p of out){const take=Math.min(remaining,p.bag[req.id]||0);p.bag[req.id]=(p.bag[req.id]||0)-take;p.used[req.id]=(p.used[req.id]||0)+take;remaining-=take;}}
  return out;
}
export function ownsHero(room,user,id){return room.members.find(m=>m.user_id===user)?.loadout.heroes.includes(id)===true;}
export function settleSharedLife(members,before,after,user,getLevel){
  const me=members.find(m=>m.user_id===user);if(!me)throw Error('Not a party member');
  const result=clone(me.loadout.life);result.bag??={};
  for(const id of new Set([...Object.keys(before.bag),...Object.keys(after.bag)])){
    const delta=(after.bag[id]||0)-(before.bag[id]||0);
    if(delta>=0)result.bag[id]=(result.bag[id]||0)+delta;
    else{let remaining=-delta;for(const m of [...members].sort((a,b)=>a.user_id.localeCompare(b.user_id))){const used=Math.min(remaining,m.loadout.life.bag[id]||0);if(m.user_id===user)result.bag[id]=Math.max(0,(result.bag[id]||0)-used);remaining-=used;}}
  }
  for(const key of ['bosses','worlds'])result[key]=Math.max(result[key]||0,after[key]||0);result.malachar=!!(result.malachar||after.malachar);
  result.xp=result.xp.map((xp,i)=>xp+Math.max(0,(after.xp[i]||0)-(before.xp[i]||0)));
  return result;
}
export function canControl(room,user,action){
  if(!room.members.some(m=>m.user_id===user)||room.status!=='playing')return false;
  if(['move','next','fight','help','dialogue','pause','mode'].includes(action.type))return room.leader_id===user;
  if(['skill','priority'].includes(action.type))return ownsHero(room,user,action.hero)&&Number.isInteger(action.skill)&&action.skill>=-1&&action.skill<8;
  return false;
}
export function applyCoopReward(solo,reward,ownedHeroes,maxHealth){
  if(!reward||typeof reward.id!=='string'||!Number.isInteger(reward.gold)||reward.gold<0||!Number.isInteger(reward.xp)||reward.xp<0||!Array.isArray(reward.items))throw Error('Invalid co-op reward');
  solo.coopRewardIds??=[];if(solo.coopRewardIds.includes(reward.id))return false;
  solo.gold+=reward.gold;solo.points+=reward.points||0;
  for(const item of reward.items)solo.inventory.push({...clone(item),id:reward.id+':'+item.id,equippedTo:null});
  for(const id of ownedHeroes){const fighter=solo.fighters.find(f=>f.id===id)||solo.town?.roster?.[id];if(!fighter)continue;
    fighter.xp+=reward.xp*2;while(fighter.xp>=60+fighter.level*30){fighter.xp-=60+fighter.level*30;fighter.level++;fighter.hp=maxHealth(fighter);}}
  solo.coopRewardIds.push(reward.id);return true;
}
export class CoopPresence {
  constructor(now=()=>Date.now()){this.now=now;this.lastSeen=new Map();}
  seen(user){this.lastSeen.set(user,this.now());}
  missing(members){return members.filter(m=>this.now()-(this.lastSeen.get(m.user_id)||0)>15000).map(m=>m.user_id);}
  canAdvance(members){return members.length===2&&this.missing(members).length===0;}
}
