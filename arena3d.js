import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const names=['Sarko','Levi','Waiz','Diago','Amaya','Naomi','Hailey','Isaac'];
const colors=['#f0c568','#70a8f6','#96e7ca','#f39a75','#ffb679','#d0a5f5','#77d5ed','#b9c6da'];
let renderer,scene,camera,host,ring,enemyImage,enemyTexture,enemyType='',partyKey='',backdropName='',backdrop;
let enemyRoot,actors=[],effects=[],lastState,frame=0;
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
const loader=new GLTFLoader(),textureLoader=new THREE.TextureLoader(),modelCache=new Map(),weaponCache=new Map();
const clock=new THREE.Clock();

function material(color,metalness=.15,roughness=.72){return new THREE.MeshStandardMaterial({color,metalness,roughness});}
function mesh(geometry,mat,parent,x=0,y=0,z=0){const item=new THREE.Mesh(geometry,mat);item.position.set(x,y,z);parent.add(item);return item;}
function addPillar(x,z){
  const stone=material('#64768e'),gold=material('#c9a65c',.8,.28);
  mesh(new THREE.CylinderGeometry(.34,.42,2.9,8),stone,scene,x,1.35,z);
  mesh(new THREE.CylinderGeometry(.51,.51,.18,8),gold,scene,x,2.79,z);
  mesh(new THREE.CylinderGeometry(.48,.48,.2,8),gold,scene,x,.16,z);
  const flame=mesh(new THREE.ConeGeometry(.14,.52,9),new THREE.MeshBasicMaterial({color:'#ffd783'}),scene,x,3.13,z);
  flame.userData.flame=true;
}
function setup(){
  scene=new THREE.Scene();scene.background=new THREE.Color('#071526');scene.fog=new THREE.Fog('#071526',20,38);
  camera=new THREE.PerspectiveCamera(43,2,.1,60);camera.position.set(0,4.7,10.6);camera.lookAt(0,1.1,0);
  renderer=new THREE.WebGLRenderer({antialias:false,alpha:false,powerPreference:'low-power'});
  renderer.domElement.addEventListener('click',event=>{
    const bounds=renderer.domElement.getBoundingClientRect();
    pointer.set(((event.clientX-bounds.left)/bounds.width)*2-1,-((event.clientY-bounds.top)/bounds.height)*2+1);
    raycaster.setFromCamera(pointer,camera);
    for(const actor of actors){if(raycaster.intersectObject(actor.figure,true).length){globalThis.SarkoArena3D?.onHeroClick?.(actor.id);break;}}
  });
  renderer.setPixelRatio(Math.min(1.5,window.devicePixelRatio||1));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
  scene.add(new THREE.HemisphereLight('#e8f1ff','#273344',2.5));
  const sun=new THREE.DirectionalLight('#fff0cf',3.0);sun.position.set(-3,8,5);scene.add(sun);
  const blue=new THREE.PointLight('#80b8ff',16,12);blue.position.set(1,4,-4);scene.add(blue);
  const floor=mesh(new THREE.CylinderGeometry(7.2,7.2,.34,48),material('#344254',.1,.95),scene,0,-.2,0);
  floor.name='arena-floor';
  backdrop=mesh(new THREE.PlaneGeometry(29,16),new THREE.MeshBasicMaterial({color:'#13233c',side:THREE.DoubleSide,fog:false}),scene,0,5,-10);
  const shade=mesh(new THREE.PlaneGeometry(29,16),new THREE.MeshBasicMaterial({color:'#03101c',transparent:true,opacity:.3,side:THREE.DoubleSide,fog:false}),scene,0,5,-9.98);
  shade.renderOrder=1;
  mesh(new THREE.CylinderGeometry(7.34,7.34,.08,48),material('#bd9550',.75,.32),scene,0,-.38,0);
  ring=new THREE.Mesh(new THREE.RingGeometry(5.8,5.87,64),new THREE.MeshBasicMaterial({color:'#c8a260',side:THREE.DoubleSide}));
  ring.rotation.x=-Math.PI/2;ring.position.y=.001;scene.add(ring);
  for(const [x,z] of [[-5.4,-3.4],[5.4,-3.4],[-5.4,3.4],[5.4,3.4]])addPillar(x,z);
  const inlay=new THREE.Group();scene.add(inlay);
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4;
    const glyph=mesh(new THREE.BoxGeometry(.08,.015,.48),material('#d9b666',.75,.25),inlay,Math.cos(a)*4.45,.012,Math.sin(a)*4.45);
    glyph.rotation.y=-a;
  }
  enemyRoot=new THREE.Group();enemyRoot.position.set(2.55,.12,-.55);scene.add(enemyRoot);
  buildEnemy();
  requestAnimationFrame(animate);
}
function buildEnemy(){
  enemyRoot.clear();
  mesh(new THREE.CylinderGeometry(1.36,1.48,.28,32),material('#6a7382',.3,.65),enemyRoot,0,.02,0);
  mesh(new THREE.CylinderGeometry(1.4,1.4,.08,32),material('#c6a45c',.8,.32),enemyRoot,0,.19,0);
  mesh(new THREE.BoxGeometry(2.32,2.62,.13),material('#bd9855',.7,.3),enemyRoot,0,1.62,.08);
  mesh(new THREE.BoxGeometry(2.16,2.46,.04),material('#112039',.1,.8),enemyRoot,0,1.62,.17);
  enemyImage=mesh(new THREE.PlaneGeometry(2.08,2.38),new THREE.MeshBasicMaterial({color:'#8e7454',side:THREE.DoubleSide}),enemyRoot,0,1.62,.2);
}
function figureFallback(id,parent){
  const tone=colors[id];
  const body=mesh(new THREE.CylinderGeometry(.24,.34,1.05,10),material(tone,.6,.35),parent,0,.94,0);
  mesh(new THREE.SphereGeometry(.29,14,10),material('#c9ad84'),parent,0,1.70,0);
  for(const side of [-1,1]){
    mesh(new THREE.CylinderGeometry(.09,.12,.77,8),material(tone,.65,.35),parent,side*.37,1.04,0).rotation.z=side*.18;
    mesh(new THREE.CylinderGeometry(.12,.15,.78,8),material('#3b4558'),parent,side*.15,.33,0);
  }
  const art=id===7?'Magnar':names[id];
  textureLoader.load('assets/'+art+'.jpg',texture=>{
    texture.colorSpace=THREE.SRGBColorSpace;
    const portrait=mesh(new THREE.PlaneGeometry(.54,.54),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}),parent,0,1.72,.26);
    portrait.userData.portrait=true;
  });
  return body;
}
async function modelFor(id){
  const name=names[id];
  if(!modelCache.has(name))modelCache.set(name,loader.loadAsync('assets/'+name+'-3D.glb').then(result=>result.scene).catch(()=>null));
  return modelCache.get(name);
}
function weaponFor(id){
  if(!weaponCache.has(id)){
    const name=id===7?'Magnar':names[id];
    weaponCache.set(id,textureLoader.loadAsync('assets/Weapon-'+name+'.png').then(texture=>{texture.colorSpace=THREE.SRGBColorSpace;return texture;}).catch(()=>null));
  }
  return weaponCache.get(id);
}
function rebuildParty(state){
  for(const actor of actors)scene.remove(actor.root);
  actors=[];
  state.fighters.forEach((fighter,index)=>{
    const root=new THREE.Group();
    const x=-3.35+(index%2)*1.55,z=-1.05+Math.floor(index/2)*1.65;
    root.position.set(x,.13,z);root.rotation.y=.22;scene.add(root);
    const figure=new THREE.Group();root.add(figure);figureFallback(fighter.id,figure);
    const actor={id:fighter.id,root,figure,x,z,loaded:false};actors.push(actor);
    weaponFor(fighter.id);
    modelFor(fighter.id).then(source=>{
      if(!source||!actors.includes(actor))return;
      figure.clear();
      const copy=source.clone(true);
      const bounds=new THREE.Box3().setFromObject(copy),size=bounds.getSize(new THREE.Vector3());
      const height=Math.max(.01,size.y),scale=2.45/height;
      copy.scale.setScalar(scale);
      copy.position.sub(bounds.getCenter(new THREE.Vector3()).multiplyScalar(scale));
      copy.position.y+=height*scale*.5+.13;
      figure.add(copy);actor.loaded=true;
    });
  });
}
function enemyArt(type,art){
  const key=type+'|'+(art||'');
  if(key===enemyType)return;
  enemyType=key;
  if(enemyTexture)enemyTexture.dispose();
  textureLoader.load('assets/'+(art||'Monster-'+type+'.jpg'),texture=>{
    if(key!==enemyType){texture.dispose();return;}
    texture.colorSpace=THREE.SRGBColorSpace;enemyTexture=texture;
    if(enemyImage.parent){enemyImage.material.dispose();enemyImage.material=new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide});}
  });
}
function mount(nextHost,state,art){
  lastState=state;
  if(!nextHost)return;
  try{if(!renderer)setup();}catch(error){nextHost.textContent='3D view unavailable on this device. Battle controls remain playable.';return;}
  host=nextHost;
  if(renderer.domElement.parentNode!==host)host.appendChild(renderer.domElement);
  const key=state.fighters.map(f=>f.id).join(',');
  if(key!==partyKey){partyKey=key;rebuildParty(state);}
  enemyArt(state.enemy?.type||'BriarClawBear',state.enemy?.art);
  if(art&&art!==backdropName){
    backdropName=art;
    textureLoader.load('assets/'+art,texture=>{
      if(art!==backdropName){texture.dispose();return;}
      texture.colorSpace=THREE.SRGBColorSpace;
      backdrop.material.dispose();backdrop.material=new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide,fog:false});
    });
  }
  const width=Math.max(1,host.clientWidth),height=Math.max(1,host.clientHeight);
  if(renderer.domElement.width!==Math.round(width*renderer.getPixelRatio())||renderer.domElement.height!==Math.round(height*renderer.getPixelRatio())){
    renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();
  }
}
function flash(where,color,kind){
  const sphere=mesh(new THREE.SphereGeometry(kind==='heal'?.43:.62,20,12),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.65,depthWrite:false,blending:THREE.AdditiveBlending}),scene,where.x,where.y+1.25,where.z);
  effects.push({object:sphere,until:performance.now()+620,kind});
  const light=new THREE.PointLight(color,12,4);light.position.copy(sphere.position);scene.add(light);
  effects.push({object:light,until:performance.now()+350,kind:'light'});
}
function action(info){
  if(!scene)return;
  const actor=actors.find(a=>a.id===info.hero);
  if(info.kind==='heal'){
    const target=actors.find(a=>a.id===info.target)||actor;
    if(target)flash(target.root.position,'#6ef5b1','heal');
    return;
  }
  if(info.kind==='enemy'){
    const target=actors.find(a=>a.id===info.target)||actors[0];
    if(target)flash(target.root.position,'#ff6971','hit');
    enemyRoot.userData.lunge=performance.now()+450;return;
  }
  if(actor){
    actor.root.userData.lunge=performance.now()+530;
    weaponFor(info.hero).then(texture=>{
      if(!texture||!scene||!actors.includes(actor))return;
      const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false,opacity:.95}));
      sprite.scale.set(1.8,1.8,1);
      scene.add(sprite);
      effects.push({object:sprite,until:performance.now()+850,start:performance.now(),from:actor.x,kind:'weapon'});
    });
    let color=info.color||colors[info.hero];
    if(/thunder|storm|lightning/i.test(info.skill))color='#9db5ff';
    else if(/fire|flame|burn/i.test(info.skill))color='#ff9a49';
    else if(/ice|frost|snow/i.test(info.skill))color='#9deaff';
    flash(enemyRoot.position,color,'hit');
    const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(1.7,.7,.6),new THREE.Vector3(2.1,2.1,.3),new THREE.Vector3(2.9,1.6,.5),new THREE.Vector3(3.25,.8,.4)]);
    const arc=mesh(new THREE.TubeGeometry(curve,24,.055,6,false),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.9,blending:THREE.AdditiveBlending}),scene);
    effects.push({object:arc,until:performance.now()+430,kind:'arc'});
  }
}
function animate(){
  requestAnimationFrame(animate);
  if(!renderer||!host||!host.isConnected)return;
  const now=performance.now(),time=clock.getElapsedTime();
  ring.material.opacity=.8+.2*Math.sin(time*2);
  for(const actor of actors){
    const alive=lastState?.fighters.find(f=>f.id===actor.id)?.hp>0;
    actor.root.visible=alive;
    const attack=actor.root.userData.lunge;
    actor.root.position.x=actor.x+(attack&&now<attack?.35*Math.sin((1-(attack-now)/530)*Math.PI):0);
    actor.root.position.y=.13+.025*Math.sin(time*2+actor.id);
  }
  const enemyAttack=enemyRoot.userData.lunge;
  enemyRoot.position.x=2.55-(enemyAttack&&now<enemyAttack?.34*Math.sin((1-(enemyAttack-now)/450)*Math.PI):0);
  for(let i=effects.length-1;i>=0;i--){
    const effect=effects[i],remaining=(effect.until-now)/620;
    if(remaining<=0){scene.remove(effect.object);effect.object.geometry?.dispose();effect.object.material?.dispose();effects.splice(i,1);continue;}
    if(effect.object.material?.opacity!==undefined)effect.object.material.opacity=Math.max(0,remaining*.75);
    if(effect.kind==='weapon'){
      const t=Math.min(1,(now-effect.start)/800);
      effect.object.position.set(effect.from+(2.55-effect.from)*t,1.25+.65*Math.sin(Math.PI*t),.95);
      effect.object.material.rotation=-.5+1.3*t;
      effect.object.material.opacity=Math.min(1,Math.max(0,(effect.until-now)/240));
    }
    if(effect.kind==='heal')effect.object.scale.setScalar(1+(1-remaining)*1.2);
  }
  renderer.render(scene,camera);
}
export {mount,action};
