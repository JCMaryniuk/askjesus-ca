import {RPGStage} from './rpg3d.bundle.js';
export const WORLD_TINTS={Earth:'#77a95b',Water:'#35b9d3',Snow:'#e4f4ff',Thunder:'#839bff',Fire:'#ef5731',Shadow:'#a768d3',Light:'#ffe9a9'};
export function battleFormation(heroes){
 const ranged=heroes.filter(h=>['Naomi','Hailey'].includes(h.name));
 const melee=heroes.filter(h=>!ranged.includes(h));
 const positions=new Map();
 // Every melee hero has a clear forward lane. Only bow/crossbow users stand back.
 for(const [group,x,spacing] of [[melee,-2.8,heroes.length>4?1.7:2.5],[ranged,-5.6,2.8]])
  group.forEach((h,i)=>positions.set(h.id,[x,0,(i-(group.length-1)/2)*spacing]));
 return heroes.map(h=>positions.get(h.id));
}
export function actionPresentation(action=''){
 const name=action.toLowerCase();
 if(/thunder|lightning|tempest/.test(name))return {effectKind:'lightning',color:'#a6caff'};
 if(/ice|frost|whiteout/.test(name))return {effectKind:'ice',color:'#b8f2ff',projectile:/lance/.test(name)?'ice':undefined};
 if(/fire|cinder|ember|molten|dragon breath/.test(name))return {effectKind:'fire',color:'#ff8a3d',projectile:/breath/.test(name)?'fire':undefined};
 if(/boulder/.test(name))return {effectKind:'stone',color:'#cfaf72',projectile:'boulder'};
 if(/quak|slam/.test(name))return {effectKind:'stone',color:'#cfaf72'};
 if(/shadow|dread|thorn|corruption/.test(name))return {effectKind:'shadow',color:'#c28aff'};
 if(/tidal|undertow|crashing wave|water/.test(name))return {effectKind:'water',color:'#69dcff'};
 if(/radiant|dawn|grace|light|sanctuary|great_commission/.test(name))return {effectKind:'holy',color:'#fff0b1'};
 if(/root|vine|spore/.test(name))return {effectKind:'nature',color:'#a1e69c'};
 return {};
}

// Presentation only: combat results, inventory and progression remain owned by
// the existing game engine, so switching views never starts a different run.
export class Game3DView {
  constructor(host,manifest,{allowUnreviewed=false,onSelect=()=>{},onError=()=>{}}={}){
    this.host=host;this.manifest=manifest;this.allowUnreviewed=allowUnreviewed;
    this.stage=new RPGStage(host,{onSelect,onError});this.baseFrameActors=this.stage.frameActors.bind(this.stage);this.battleKey=null;this.version=0;
  }
  entry(group,name){
    const entry=this.manifest[group]?.[name];
    if(!entry?.file||(!entry.reviewed&&!this.allowUnreviewed))throw Error(`${name} is still being prepared for 3D.`);
    return entry;
  }
  async setBattle({key,heroes,enemy,enemyDefeated=false,world,chapterStage,storyBattle=false}){
    if(this.battleKey===key)return;
    const version=++this.version;
    const baseWorld=this.entry('worlds',`${world}-${chapterStage>10?2:1}`);const worldEntry=storyBattle?{...baseWorld,battleBackdrop:'assets/book/guild-arena.jpg'}:baseWorld;
    const places=battleFormation(heroes);
    const actors=heroes.map((hero,i)=>({key:`hero-${hero.id}`,entry:this.entry('heroes',hero.name),position:places[i],facing:Math.PI/2,defeated:hero.defeated}));
    actors.push({key:'enemy',entry:{...this.entry('enemies',enemy),worldTint:WORLD_TINTS[world],tintStrength:world==='Snow'?.85:.55,tintFloor:world==='Snow'?.5:.08},position:[3,0,0],facing:-Math.PI/2,defeated:enemyDefeated});
    await this.stage.setEnvironment(worldEntry);
    if(version!==this.version)return;
    if(!await this.stage.setActors(actors))throw Error('The 3D battle could not finish loading.');
    if(version!==this.version)return;
    this.stage.frameActors=()=>{this.baseFrameActors();if(storyBattle){this.stage.camera.zoom*=1.55;this.stage.camera.updateProjectionMatrix();}};this.stage.frameActors();
    this.battleKey=key;
  }
  async present(events){
    const version=this.version;
    for(const event of events){
      if(version!==this.version)return false;
      const actor=event.enemy?'enemy':`hero-${event.hero}`;
      const action=event.skillId||'attack';
      const visual=actionPresentation(action);
      const targets=(event.targets||[]).map(t=>({
        key:t.enemy?'enemy':`hero-${t.hero}`,
        kind:t.kind,amount:t.kind==='damage'?-Math.abs(t.amount):t.amount,
        defeated:!!t.defeated,color:t.color||event.color
      }));
      if(!await this.stage.enqueue({actor,action,targets,participants:event.participants?.map(p=>({actor:`hero-${p.hero}`,action:p.action})),effectOnly:event.effectOnly,projectile:event.projectile||visual.projectile,effectKind:visual.effectKind,effectColor:visual.color,color:event.color,impactAt:event.impactAt,minimumDuration:1.25,advance:visual.projectile?0:event.advance||0}))
        throw Error('An animation required for this move is unavailable.');
    }
    return true;
  }
  setPaused(value){this.stage.setPaused(value);}
  async dispose(){++this.version;this.battleKey=null;await this.stage.dispose();}
}

