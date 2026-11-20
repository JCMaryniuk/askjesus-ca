import {questRequirements,isBossStage} from './handoff-rules.mjs';
// Deterministic encounters: saved offers never reroll when a menu is reopened.
export const HELP_PEOPLE=[
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
export const HELP_REGIONS=[['Greenbough','fallen branches have cut off the woodland road'],['Tidehaven','floodwater has delayed the coastal boats'],['Frostmere','a blizzard has closed the mountain pass'],['Stormwatch','lightning has damaged the hill shelters'],['Emberwell','ashfall has forced families away from their homes'],['Duskhollow','fear has kept neighbours behind locked doors'],['Dawnreach','pilgrims have arrived exhausted at the city approach']];
export function makeHelpQuest({world=0,stage=0,bosses=0,cycle=0,seed=1}){
 if(isBossStage(world,stage))return null;
 const slot=(stage-(stage>9?1:0))%18,person=HELP_PEOPLE[slot],region=HELP_REGIONS[world%7];
 return {id:`${cycle}:${world}:${stage}`,slot,name:person[0]+' of '+region[0],animal:person[1],title:person[2],story:`In ${region[0]}, ${region[1]}. ${person[3]}`,reply:person[4],...questRequirements({world,stage,cycle,seed}),status:'offered'};
}
export function helpReady(q,life,getLevel){return !!q&&q.status==='accepted'&&q.requirements.every(r=>getLevel(life.xp[r.skill]||0)>=r.level&&(life.bag[r.id]||0)>=r.count);}
export function consumeHelp(q,life,getLevel){if(!helpReady(q,life,getLevel))return false;for(const r of q.requirements){life.bag[r.id]-=r.count;life.xp[r.skill]+=20+r.tier*6+r.count*4;}q.status='complete';return true;}
