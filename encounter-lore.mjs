const CREATURES={
 AshhornStag:['An ash-antlered stag with a powerful charging stride.','Its charges have made this stretch of road unsafe for travellers.'],
 BriarClawBear:['A heavy woodland bear protected by tangled, thorny growth.','It is driving travellers away from the path and the supplies they need.'],
 BrightCap:['A living mushroom creature that defends itself with spores.','Its spreading spores are keeping people from crossing this route safely.'],
 CrystalBackTortoise:['A slow, resilient tortoise with a shield of sharp crystals.','It has blocked the crossing; its heavy strikes threaten anyone passing close.'],
 DreadwingVulture:['A keen-eyed aerial hunter that strikes with sudden dives.','It is swooping at travellers along the exposed road.'],
 HollowWretch:['A restless, long-clawed creature that moves in sudden bursts.','It is stalking this path, leaving frightened neighbours unable to travel.'],
 Rockshade:['A stone-bodied creature with crushing strength.','Its attacks and falling rocks have cut people off from the road.'],
 Shadowthorn:['A shadow-touched creature armed with long, raking claws.','It is threatening the route between nearby homes and supplies.'],
 StonehideRhino:['A thick-armoured rhino whose charge is difficult to stop.','It is charging across the road and endangering the next travelling party.'],
 Thornback:['A tusked creature with a fiercely protected back.','Its repeated charges have forced workers and travellers to turn back.'],
 VineboundGuardian:['A powerful guardian woven from living roots and branches.','It has turned against people using this route and is closing the path with roots.'],
 CorruptedWolf:['A swift wolf whose movements are distorted by corruption.','It is stalking passing groups; the company must stop its attacks to make the road safe.']
};
export function encounterLore(enemy){const [bio,reason]=CREATURES[enemy?.type]||['A dangerous creature encountered along this road.','Its attacks are preventing neighbours from travelling safely.'];return {bio,reason};}
