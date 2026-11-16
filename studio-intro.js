(() => {
  try { if(sessionStorage.getItem('sarko-studio-intro'))return; } catch {}
  globalThis.sarkoIntroPlaying=true;
  const panel=document.createElement('section');
  panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Radiant Kingdom Studios introduction');
  panel.id='studioIntro';panel.style.cssText='position:fixed;inset:0;z-index:100000;background:#02060c;display:grid;place-content:center;justify-items:center;padding:20px';
  const video=document.createElement('video');video.src='assets/RKS-intro.mp4';video.muted=true;video.playsInline=true;video.preload='auto';video.style.cssText='width:min(78vw,72vh,720px);max-height:78vh;object-fit:contain';
  const controls=document.createElement('div');controls.className='actions';
  const sound=document.createElement('button');sound.className='button';sound.textContent='SOUND ON';sound.onclick=()=>{video.muted=!video.muted;sound.textContent=video.muted?'SOUND ON':'SOUND OFF';};
  const skip=document.createElement('button');skip.className='button alt';skip.id='startupSkip';skip.textContent='SKIP INTRO';
  let timer;const finish=()=>{clearTimeout(timer);video.pause();video.removeAttribute('src');video.load();panel.remove();globalThis.sarkoIntroPlaying=false;try{sessionStorage.setItem('sarko-studio-intro','seen')}catch{}};
  skip.onclick=finish;video.onended=finish;video.onerror=finish;panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();finish();}});
  controls.append(sound,skip);panel.append(video,controls);document.body.append(panel);skip.focus();timer=setTimeout(finish,12000);video.play().catch(()=>finish());
})();
