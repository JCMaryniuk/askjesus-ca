// Auth is handled by the provider SDK. Only the public project key is configured.
export async function createCloudClient(config) {
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.url || '') || !config.publishableKey) return null;
  const {createClient} = await import('./supabase.bundle.js');
  const client = createClient(config.url, config.publishableKey, {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false,storageKey:'sarko-cloud-auth'}});
  return {
    auth:client.auth,
    async party(operation,room=null,input={}) {const {data,error}=await client.rpc('sarko_party',{p_operation:operation,p_room:room,p_input:input});if(error)throw error;return data;},
    async reward(room,battle,reward=null,revision=null,payload=null) {const {data,error}=await client.rpc('sarko_party_reward',{p_room:room,p_battle:battle,p_reward:reward,p_revision:revision,p_payload:payload});if(error)throw error;return data;},
    async read() {const {data,error}=await client.from('sarko_cloud_saves').select('revision,payload,updated_at').maybeSingle();if(error)throw error;return data;},
    async write(revision,payload) {const {data,error}=await client.rpc('sarko_save',{p_expected_revision:revision,p_payload:payload});if(error)throw error;return data;}
  };
}
