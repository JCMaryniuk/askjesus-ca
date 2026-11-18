let target=null,panel=null;
export const padKeyboardOpen=()=>!!panel;
export function closePadKeyboard(){const field=target;panel?.remove();panel=null;target=null;if(field?.isConnected)field.focus();}
export function openPadKeyboard(field){
 if(!field?.isConnected||field.readOnly||field.disabled)return;
 closePadKeyboard();target=field;panel=document.createElement('section');panel.id='controllerKeyboard';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','Controller keyboard');
 const numeric=field.inputMode==='numeric';const chars=numeric?'1234567890':'abcdefghijklmnopqrstuvwxyz0123456789@._-+';
 panel.innerHTML='<div class="padKeyboardPanel"><h2>Controller keyboard</h2><p>D-pad / stick to move · A to enter · B to finish</p><output aria-live="polite"></output><div class="padKeyGrid"></div><div class="actions"><button type="button" data-pad-command="back">BACKSPACE</button><button type="button" data-pad-command="clear">CLEAR</button><button type="button" data-pad-command="done">DONE</button></div></div>';
 const grid=panel.querySelector('.padKeyGrid');for(const char of chars){const b=document.createElement('button');b.type='button';b.textContent=char;b.dataset.padChar=char;grid.append(b);}
 const refresh=()=>{panel.querySelector('output').textContent=target.value||'Enter text';};refresh();
 panel.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.padCommand==='done'){closePadKeyboard();return;}if(!target?.isConnected){closePadKeyboard();return;}
 if(b.dataset.padCommand==='back')target.value=target.value.slice(0,-1);else if(b.dataset.padCommand==='clear')target.value='';else if(b.dataset.padChar){const max=target.maxLength>0?target.maxLength:254;if(target.value.length<max)target.value+=b.dataset.padChar;}
 target.dispatchEvent(new Event('input',{bubbles:true}));refresh();});
 document.body.append(panel);grid.querySelector('button')?.focus();
}
