import {RPGStage,THREE} from './rpg3d.bundle.js';
import {WORLD_TINTS} from './rpg3d-view.js';

// Presentation of the existing twenty-encounter journey. No rewards or battle
// progression live here; the existing Continue button owns those decisions.
export class Travel3DView {
 constructor(host,{onError=()=>{}}={}){
  this.host=host;this.stage=new RPGStage(host,{onError});this.version=0;
  this.decor=new THREE.Group();this.stage.scene.add(this.decor);
  this.labels=document.createElement('div');this.labels.className='travel3dLabels';host.append(this.labels);
  this.resize=new ResizeObserver(()=>this.frame());this.resize.observe(host);
 }
 async show({entry,hero,stage=0,world='Earth',encounters=[]}){
  const version=++this.version;this.clear();this.overview=false;
  await this.stage.setEnvironment(entry);if(version!==this.version)return;
  const offset=stage>=10?10:0;
  this.points=Array.from({length:10},(_,i)=>new THREE.Vector3(Math.sin(i*.85)*3.2,.18,4.6-i*1.02));
  const curve=new THREE.CatmullRomCurve3(this.points);
  const road=new THREE.Mesh(new THREE.TubeGeometry(curve,100,.07,8,false),new THREE.MeshStandardMaterial({color:'#bfa36c',metalness:.65,roughness:.45}));this.decor.add(road);
  for(const [i,p] of this.points.entries()){
   const number=offset+i+1,done=number<=stage,current=number===stage+1,boss=i===9;
   const color=done?'#458b76':current?'#fff0a5':boss?'#b95b7c':'#637c98';
   const base=new THREE.Mesh(new THREE.CylinderGeometry(boss?.58:.35,boss?.64:.4,.16,boss?6:24),new THREE.MeshStandardMaterial({color,metalness:.6,roughness:.3,emissive:current?'#b78938':'#000000',emissiveIntensity:.45}));base.position.copy(p);this.decor.add(base);
   if(boss){for(let j=0;j<5;j++){const crown=new THREE.Mesh(new THREE.ConeGeometry(.11,.42,5),new THREE.MeshStandardMaterial({color:'#e9c57a',metalness:.8,roughness:.25}));crown.position.copy(p).add(new THREE.Vector3(Math.sin(j/5*Math.PI*2)*.37,.3,Math.cos(j/5*Math.PI*2)*.37));this.decor.add(crown);}}
   const label=document.createElement('span');label.className='travel3dLabel';label.textContent=(boss?'BOSS · ':'')+number;label.dataset.state=done?'cleared':current?'next':'ahead';label.setAttribute('aria-label',`${world} encounter ${number}, ${boss?'boss':'monster'}, ${done?'cleared':current?'next':'ahead'}`);this.labels.append(label);
  }
  const position=this.points[Math.max(0,Math.min(stage-offset,9))].clone();position.y=.26;position.x-=.7;
  const creatures=encounters.flatMap((item,i)=>item?.entry?[{key:'encounter-'+i,entry:{...item.entry,height:i===9?.85:.65,worldTint:WORLD_TINTS[world],tintStrength:world==='Snow'?.85:.55,tintFloor:world==='Snow'?.5:.08},position:this.points[i].clone().add(new THREE.Vector3(0,.26,0)).toArray(),facing:Math.PI/4}]:[]);
  encounters.forEach((item,i)=>{if(item?.name&&this.labels.children[i])this.labels.children[i].setAttribute('aria-label',this.labels.children[i].getAttribute('aria-label')+', '+item.name);});
  if(!await this.stage.setActors([{key:'party',entry:{...hero,height:1.15},position:position.toArray(),facing:Math.PI},...creatures]))throw Error('The travelling hero could not load');
  if(version!==this.version)return;
  this.frame();this.host.setAttribute('aria-busy','false');
 }
 async showOverview(manifest,currentWorld=0){
  const version=++this.version;this.clear();this.overview=true;
  const s=this.stage,names=['Earth','Water','Snow','Thunder','Fire','Shadow','Light','Heavenly City'];
  s.terrain.clear();s.scene.background=new THREE.Color('#13243c');s.scene.fog.color.set('#13243c');
  this.points=[[-4,0,4],[0,0,4],[4,0,4],[4,0,0],[0,0,0],[-4,0,0],[-4,0,-4],[1,0,-4]].map(p=>new THREE.Vector3(...p));
  const items=names.map((name,i)=>({key:name,entry:{...(i===7?manifest.services.heavenlyCity:manifest.worlds[name+'-1']),height:2,actions:{}},position:this.points[i].toArray()}));
  if(!await s.setActors(items))throw Error('The world overview could not finish loading');if(version!==this.version)return;
  for(const [i,name] of names.entries()){
   const actor=s.actors.get(name),bounds=new THREE.Box3().setFromObject(actor.visual),size=bounds.getSize(new THREE.Vector3());actor.visual.scale.setScalar(2.9/Math.max(size.x,size.z));
   const label=document.createElement('span');label.className='travel3dLabel';label.textContent=name;label.dataset.state=i===currentWorld?'next':i<currentWorld?'cleared':'ahead';this.labels.append(label);
   if(i===currentWorld){const ring=new THREE.Mesh(new THREE.TorusGeometry(1.8,.055,8,48),new THREE.MeshStandardMaterial({color:'#ffe5a0',emissive:'#b78538',emissiveIntensity:.65}));ring.rotation.x=Math.PI/2;ring.position.copy(this.points[i]).add(new THREE.Vector3(0,.05,0));this.decor.add(ring);}
  }
  const road=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(this.points),100,.06,8,false),new THREE.MeshStandardMaterial({color:'#e4be70',emissive:'#805d1e',emissiveIntensity:.4}));this.decor.add(road);
  this.frame();this.host.setAttribute('aria-busy','false');
 }
 frame(){
  if(this.stage.disposed||!this.points)return;
  const s=this.stage;s.autoFrameActors=false;s.camera.position.set(0,15,12);s.camera.lookAt(0,0,0);s.camera.zoom=1;s.camera.updateProjectionMatrix();s.camera.updateMatrixWorld(true);
  let extent=.01;for(const p of this.points)for(const dx of this.overview?[-1.8,1.8]:[0])for(const dz of this.overview?[-1.8,1.8]:[0]){const projected=p.clone().add(new THREE.Vector3(dx,this.overview?1:0,dz)).project(s.camera);extent=Math.max(extent,Math.abs(projected.x),Math.abs(projected.y));}
  s.camera.zoom=Math.min(1.25,.78/extent);s.camera.updateProjectionMatrix();
  [...this.labels.children].forEach((label,i)=>{const p=this.points[i].clone().add(new THREE.Vector3(0,this.overview?1.6:.35,0)).project(s.camera);label.style.left=`${(p.x+1)*50}%`;label.style.top=`${(1-p.y)*50}%`;});
 }
 clear(){this.decor.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});this.decor.clear();this.labels.replaceChildren();}
 async dispose(){++this.version;this.resize.disconnect();this.clear();this.labels.remove();await this.stage.dispose();}
}
