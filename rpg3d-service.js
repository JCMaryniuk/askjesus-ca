import {RPGStage} from './rpg3d.bundle.js';
export const FRUIT_SOCKETS={Love:[0,3.05,.35],Joy:[-.7,2.8,.35],Peace:[.7,2.8,.35],Patience:[-1.15,2.2,.4],Kindness:[0,2,.65],Goodness:[1.15,2.2,.4],Faithfulness:[-1.25,1.6,.4],Gentleness:[0,1.15,.75],'Self-Control':[1.25,1.6,.4]};

// Service scenes share the renderer/asset lifecycle used by battles. Buying,
// socketing and skill upgrades remain in the existing game economy.
export class Service3DView {
 constructor(host,{onError=()=>{}}={}){
  this.host=host;this.stage=new RPGStage(host,{onError});this.version=0;
  this.labels=document.createElement('div');this.labels.className='fruit3dLabels';host.append(this.labels);
  this.observer=new ResizeObserver(()=>this.layoutLabels());this.observer.observe(host);
  this.stage.camera.position.set(0,3.5,7);this.stage.camera.lookAt(0,1.5,0);
 }
 async show(entry,{fruits={},equipped=[]}={}){
  const version=++this.version;
  if(!entry?.file)throw Error('Missing 3D service model');
  this.labels.replaceChildren();this.labelPoints=[];
  const items=[{key:'service',entry:{...entry,height:entry.height||3.5,actions:{}},position:[0,0,0]}];
  if(entry.fruitTree)for(const [name,position] of Object.entries(FRUIT_SOCKETS)){
   if(equipped.includes(name)&&fruits[name]?.file)items.push({key:'fruit:'+name,entry:{...fruits[name],height:.46,actions:{}},position});
   const label=document.createElement('span');label.className='fruit3dLabel';label.textContent=name;label.dataset.fruit=name;label.dataset.equipped=String(equipped.includes(name));this.labels.append(label);
   this.labelPoints.push({label,position});
  }
  const loaded=await this.stage.setActors(items);
  if(version!==this.version)return;
  if(!loaded)throw Error('A 3D service asset could not load');
  this.stage.frameActors();
  this.layoutLabels();
 }
 layoutLabels(){
  if(!this.labelPoints||this.stage.disposed)return;
  this.stage.camera.updateMatrixWorld(true);
  for(const {label,position} of this.labelPoints){const p=this.stage.camera.position.clone().set(position[0],position[1]-.08,position[2]+.25).project(this.stage.camera);label.style.left=`${(p.x+1)*50}%`;label.style.top=`${(1-p.y)*50}%`;}
 }
 async dispose(){++this.version;this.observer.disconnect();this.labels.remove();await this.stage.dispose();}
}
