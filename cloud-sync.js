// Provider-independent synchronization. Never infer ownership from an email.
export class CloudSync {
  constructor({api,storage,capture,apply,valid,changed=()=>{}}) {
    Object.assign(this,{api,storage,capture,apply,valid,changed});
    this.user=null;this.record=null;this.remote=null;this.status='guest';this.busy=false;this.generation=0;
  }
  read(key){try{return JSON.parse(this.storage.getItem(key));}catch{return null;}}
  put(key,value){this.storage.setItem(key,JSON.stringify(value));}
  key(){return 'sarko-cloud-cache:'+this.user.id;}
  notify(status){this.status=status;this.changed();}
  async connect(user){
    const generation=++this.generation;
    const active=this.read('sarko-cloud-active');
    if(active&&active!==user.id){
      this.cacheUnverifiedProgress();
      const guest=this.read('sarko-guest-backup');
      if(guest&&this.valid(guest))this.apply(guest);
      this.storage.removeItem('sarko-cloud-active');
    }
    this.user=user;this.record=this.read(this.key());this.remote=null;
    if(!this.read('sarko-cloud-active'))this.put('sarko-guest-backup',this.capture());
    if(this.record&&this.valid(this.record.payload)){
      this.put('sarko-cloud-active',user.id);this.apply(this.record.payload);
    }else this.record=null;
    this.notify('checking');
    try{const remote=await this.api.read();if(generation!==this.generation)return;
      if(remote&&!this.valid(remote.payload))throw Error('Cloud save is not compatible with this game version.');
      this.remote=remote;
      if(!this.record){this.notify('choose');return;}
      if((remote?.revision||0)!==this.record.revision){
        if(this.record.dirty)this.notify('conflict');
        else if(remote)this.useRemote();
        else this.notify('conflict');
      }else this.notify(this.record.dirty?'pending':'synced');
    }catch{if(generation===this.generation)this.notify('offline');}
  }
  useRemote(){
    if(!this.remote||!this.valid(this.remote.payload))throw Error('No compatible cloud save.');
    this.put('sarko-cloud-recovery',this.capture());
    this.record={revision:this.remote.revision,payload:this.remote.payload,dirty:false};
    this.put(this.key(),this.record);this.put('sarko-cloud-active',this.user.id);
    this.apply(this.record.payload);this.notify('synced');
  }
  async useLocal(){
    this.put('sarko-cloud-recovery',this.remote?.payload||this.capture());
    this.record={revision:this.remote?.revision||0,payload:this.capture(),dirty:true};
    this.put(this.key(),this.record);this.put('sarko-cloud-active',this.user.id);
    this.notify('pending');await this.flush();
  }
  localSaved(){
    if(!this.user){this.cacheUnverifiedProgress();return;}
    if(!this.record||this.status==='choose')return;
    const payload=this.capture();if(!this.valid(payload))return;
    this.record.payload=payload;this.record.dirty=true;this.put(this.key(),this.record);
    if(!['conflict','checking'].includes(this.status))this.notify('pending');
  }
  // Expired login or offline reload must still retain changes under the
  // original account's local cache. This never grants authenticated access.
  cacheUnverifiedProgress(){
    const active=this.read('sarko-cloud-active');if(typeof active!=='string')return;
    const key='sarko-cloud-cache:'+active,record=this.read(key),payload=this.capture();
    if(!record||!this.valid(record.payload)||!this.valid(payload))return;
    if(JSON.stringify(record.payload)!==JSON.stringify(payload)){
      record.payload=payload;record.dirty=true;this.put(key,record);
    }
  }
  async flush(){
    if(this.busy||!this.user||!this.record||!this.record.dirty||['conflict','choose','checking'].includes(this.status))return;
    this.busy=true;const generation=this.generation;const record=this.record;const payload=structuredClone(record.payload);
    try{const result=await this.api.write(record.revision,payload);if(generation!==this.generation)return;
      if(!result.ok){this.remote=await this.api.read();if(generation!==this.generation)return;this.notify('conflict');return;}
      record.revision=result.revision;record.dirty=JSON.stringify(record.payload)!==JSON.stringify(payload);
      this.put(this.key(),record);this.notify(record.dirty?'pending':'synced');
    }catch{if(generation===this.generation)this.notify('offline');}
    finally{this.busy=false;}
  }
  disconnect(){
    ++this.generation;this.user=null;this.record=null;this.remote=null;
    const guest=this.read('sarko-guest-backup');this.storage.removeItem('sarko-cloud-active');
    if(guest&&this.valid(guest))this.apply(guest);
    this.notify('guest');
  }
}
