// Browser adaptation of Sarko's FishingRound and RecipeActivity rules.
export const SKILLS=['Fishing','Cooking','Woodcutting','Mining','Forging','Wisdom'];
export const FISH=['Brook Minnow','River Perch','Bluefin Dace','Reed Carp','Silver Trout','Amber Bass','Moon Bream','Crystal Pike','Golden Char'];
export const MEALS=['Crispy Brook Minnow','Herb-roasted River Perch','Pan-seared Bluefin Dace','Roasted Reed Carp','Herb-seared Silver Trout','Skillet Amber Bass','Moon Bream Supper','Crystal Pike Steak','Golden Char Feast'];
export const BONUSES=['Gathering','Health','Attack','Defense','Health','Gathering','Healing','Critical','Defense'];
export const LESSONS=[
 'Let us learn to provide for our company. Cast your line, then wait for the bite before you hook the fish. During the reel, tap to switch between reeling and resting. Keep tension inside the green band. Too much tension breaks the line. Successful catches earn experience. Higher fishing levels unlock better fish. Keep fish for cooking, or sell your spare catch at the merchant.',
 'A meal can prepare us for the road ahead. Select a recipe and bring its required fish, plus grain or herbs from the merchant. Chop, add, wait, flip, then remove the meal. Follow each instruction and time your actions in the green zone. Meals restore health and grant a bonus for the next three victories. One meal bonus per hero: a new meal replaces the old one. Higher cooking levels unlock stronger recipes.',
 'Good wood rewards a steady hand. Choose a tree within your woodcutting level. Strike when the moving marker reaches the green zone. Land three good strikes before three misses. Better timing gives extra supplies. Higher levels open stronger timber. Sell spare wood at the merchant, or keep it for forging.',
 'Read the stone before you strike. Choose an ore vein within your mining level. Hit the moving marker inside the green zone three times, before three misses. Excellent timing earns extra ore. Higher levels reveal rarer veins. Your ore can be sold or used at the forge.',
 'Now we can shape what we have gathered. Bring matching wood and ore to the forge. Heat, hammer, hammer, hammer, then quench. Time every action in the green zone. Success creates a trade ingot worth more than the raw materials. Higher forging levels unlock more valuable work. Ingredients are used when you begin, so take your time.',
 'Wisdom grows when we listen and put truth into practice. Read the passage, then choose the answer that completes it. Correct answers earn wisdom experience and a study token you can sell at the merchant. As your wisdom grows, more questions become available. You may read the lesson again whenever you need it.'
];
export function freshLife(){return {version:1,malachar:false,worlds:0,bosses:0,xp:Array(6).fill(0),seen:[],bag:{},buffs:{}};}
export function level(xp){let n=1;while(n<10&&xp>=n*(n+1)*20)n++;return n;}
export function unlocked(life,i){return Number.isInteger(i)&&i>=0&&i<6;}
export function item(id){if(typeof id!=='string')return null;const [kind,n]=id.split('-'),i=Number(n)||0;if(['fish','meal','wood','ore','ingot'].includes(kind)&&(!/^\d+$/.test(n)||!Number.isInteger(i)||i<0||i>(['fish','meal'].includes(kind)?8:2)))return null;if(kind==='fish')return {name:FISH[i],sell:8+i*5};if(kind==='meal')return {name:MEALS[i],sell:22+i*9,heal:20+i*8,bonus:BONUSES[i],power:.03+i*.012};if(kind==='wood')return {name:['Oak','Ash','Radiant Cedar'][i]+' timber',sell:12+i*16};if(kind==='ore')return {name:['Iron','Silver','Sunstone'][i]+' ore',sell:16+i*19};if(kind==='ingot')return {name:['Iron','Silver','Sunstone'][i]+' trade ingot',sell:85+i*85};if(id==='grain'||id==='herbs')return {name:id,sell:2,buy:10};if(id==='token')return {name:'Wisdom study token',sell:12};return null;}
export function ingredients(skill,tier){return skill===1?{['fish-'+tier]:2,[tier%3===0?'grain':'herbs']:2}:skill===4?{['wood-'+tier]:4,['ore-'+tier]:4}:{};}
export function requiredLevel(skill,tier){return skill===0||skill===1?tier+1:1+tier*3;}
export function canCraft(life,skill,tier){return Object.entries(ingredients(skill,tier)).every(([id,n])=>(life.bag[id]||0)>=n);}
export function startActivity(life,skill,tier=0,random=Math.random){
 if(!Number.isInteger(skill)||skill<0||skill>5||!Number.isInteger(tier)||tier<0||tier>(skill<2?8:2)||!unlocked(life,skill)||level(life.xp[skill])<requiredLevel(skill,tier))return null;
 if((skill===1||skill===4)&&!canCraft(life,skill,tier))return null;
 for(const [id,n]of Object.entries(ingredients(skill,tier)))life.bag[id]-=n;
 return {skill,tier,phase:skill===0?'cast':'active',time:0,wait:2.5+random()*2.5,tension:.4,progress:0,overload:0,reel:false,step:0,hits:0,misses:0,perfect:0,claimed:false};
}
export function meter(a){return (Math.sin(a.time*(1.8+a.tier*.3))+1)/2;}
export function tickActivity(a,dt){if(!a||['won','lost'].includes(a.phase))return;dt=Math.max(0,Math.min(.1,dt));a.time+=dt;
 if(a.skill!==0)return;
 if(a.phase==='waiting'&&a.time>=a.wait){a.phase='bite';a.time=0;}
 else if(a.phase==='bite'&&a.time>2.2){a.phase='lost';}
 else if(a.phase==='reel'){a.tension=Math.max(0,Math.min(1,a.tension+dt*((a.reel?.16+a.tier*.005:-.2)+Math.sin(a.time*1.3)*.03)));const safe=a.tension>=.18&&a.tension<=.8;a.progress=Math.max(0,Math.min(1,a.progress+dt*(a.reel&&safe?.095:a.tension<.18?-.025:0)));a.overload=a.tension>.93?a.overload+dt:Math.max(0,a.overload-dt*2);if(a.overload>2||a.time>90)a.phase='lost';else if(a.progress>=1)a.phase='won';}
}
export function actActivity(a){if(!a||['won','lost'].includes(a.phase))return;
 if(a.skill===0){if(a.phase==='cast'){a.phase='waiting';a.time=0;}else if(a.phase==='waiting')a.phase='lost';else if(a.phase==='bite'){a.phase='reel';a.time=0;a.reel=true;}else if(a.phase==='reel')a.reel=!a.reel;return;}
 if(a.skill===5)return;
 if(a.skill===1&&a.step===2){if(a.time<2)return;a.step++;a.time=0;return;}
 const accuracy=Math.abs(meter(a)-.5);if(accuracy<=.22){a.hits++;a.step++;if(accuracy<.08)a.perfect++;}else a.misses++;
 a.time=0;if(a.misses>=3)a.phase='lost';else if(a.hits>=(a.skill===1?4:a.skill===4?5:3))a.phase='won';
}
export const QUESTIONS=[['The fruit of the Spirit includes love, joy and…','Peace','Pride','Envy','Galatians 5:22–23'],['Be quick to listen and slow to…','Speak','Care','Forgive','James 1:19'],['Love is patient, love is…','Kind','Boastful','Envious','1 Corinthians 13:4'],['Walk by faith, not by…','Sight','Love','Hope','2 Corinthians 5:7'],['A gentle answer turns away…','Wrath','Kindness','Truth','Proverbs 15:1'],['Blessed are the…','Peacemakers','Proud','Cruel','Matthew 5:9']];
export function claimActivity(life,a,random=Math.random){if(!a||a.claimed||a.phase!=='won')return null;a.claimed=true;const id=a.skill===0?'fish-'+a.tier:a.skill===1?'meal-'+a.tier:a.skill===2?'wood-'+a.tier:a.skill===3?'ore-'+a.tier:a.skill===4?'ingot-'+a.tier:'token';let count=(a.skill===2||a.skill===3)&&a.perfect>=2?2:1;const gathering=Math.max(0,...Object.values(life.buffs).filter(b=>b.kind==='Gathering'&&b.victories>0).map(b=>b.power));if([0,2,3].includes(a.skill)&&random()<gathering)count++;life.bag[id]=(life.bag[id]||0)+count;const xp=12+a.tier*3;life.xp[a.skill]+=xp;return {id,count,xp};}
export function sellItem(life,id,gold){const info=item(id);if(!info||!(life.bag[id]>0))return gold;life.bag[id]--;return gold+info.sell;}
export function buyIngredient(life,id,gold){const info=item(id);if(!info?.buy||gold<info.buy)return gold;life.bag[id]=(life.bag[id]||0)+1;return gold-info.buy;}
export function eatMeal(life,id,hero,hp,max){const info=item(id);if(!id.startsWith('meal-')||!info||!(life.bag[id]>0)||hp<=0)return null;life.bag[id]--;life.buffs[hero]={kind:info.bonus,power:info.power,victories:3};return {hp:Math.min(max,hp+info.heal),healed:Math.min(max-hp,info.heal)};}
export function expireMeals(life){for(const [id,buff]of Object.entries(life.buffs))if(--buff.victories<=0)delete life.buffs[id];}
