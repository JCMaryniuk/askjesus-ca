// Authenticated polling transport. Only the selected leader drives simulation.
export class CoopClient {
  constructor({api,user,onRoom=()=>{},onError=()=>{}}){Object.assign(this,{api,user,onRoom,onError});this.room=null;this.pending=false;this.closed=false;this.queue=Promise.resolve();}
  request(operation,room,input){const task=this.queue.then(()=>this.api.party(operation,room,input));this.queue=task.catch(()=>{});return task;}
  async command(operation,input={}){
    if(this.closed)return null;
    const result=await this.request(operation,this.room?.id||null,input);
    if(this.closed)return null;
    if(result.conflict){await this.poll();throw Error('Party changed. Try that action again.');}
    if(result.left){this.room=null;this.onRoom(null);return null;}
    this.room=result;this.onRoom(result);return result;
  }
  async poll(){if(this.pending||!this.room||this.closed)return;this.pending=true;try{const r=await this.request('poll',this.room.id);if(!this.closed){this.room=r;this.onRoom(r);}}catch(error){if(!this.closed)this.onError(error);}finally{this.pending=false;}}
  get leader(){return this.room?.leader_id===this.user.id;}
  async publish(snapshot,ack=[]){if(!this.leader)throw Error('Only the party leader advances the encounter.');return this.command('publish',{revision:this.room.revision,snapshot,ack});}
  async action(hero,skill,type='skill'){return this.command('action',{id:crypto.randomUUID(),type,hero,skill});}
  stop(){this.closed=true;}
}
