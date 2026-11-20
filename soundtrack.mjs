// Only the liked instrumental Sarko score. Original WAVs stay in the music archive.
export const SCORE = Object.freeze({
  main: '01-SARKO-Journey-Toward-the-Light-Main-Theme--210026d1.mp3',
  sanctuary: '02-Sanctuary-Beneath-the-Ruins-Hidden-Holy-Chamber--9c338385.mp3',
  furnace: '03-The-Furnace-of-Endurance-Fire-Dungeon--ed7c0cce.mp3',
  cavern: '04-Echoes-of-the-Deep-Cavern-Dungeon--03035a64.mp3',
  stand: '05-4-Stand-Against-the-Darkness-Boss-Battle--3e9c9c97.mp3',
  trial: '06-Trial-of-the-Faithful-Armor-of-God--420c4798.mp3',
  roots: '07-Roots-of-the-Fallen-Overgrown-Dungeon--0b6c33ea.mp3',
  corridors: '08-Light-in-the-Corridors--f761e189.mp3',
  city: '09-City-of-Light--4fb5e959.mp3',
  dragon: '10-The-Dragon-King-s-Battle--15160c97.mp3',
  lies: '11-King-of-Lies--9b209060.mp3',
  breath: '12-Breath-of-Heaven--36e31766.mp3',
  shepherd: '13-The-False-Shepherd--a44c1293.mp3',
  shards: '14-Evolution-Shards--f030d3d6.mp3',
  journey: '15-The-Weight-of-the-Journey--2e0a0e17.mp3',
  seeds: '16-Seeds-in-the-Rain--85930b80.mp3',
  gathering: '17-Track-06-The-Gathering-of-Light--bcc6bc64.mp3',
  canyon: '18-SARKO-Shadows-in-the-Canyon--cafc0111.mp3',
  training: '19-SARKO-Diago-s-Training--261813e1.mp3',
  firstLight: '20-SARKO-First-Light--57d0535a.mp3',
  storm: '21-SARKO-The-Storm-and-Awakening--55de0915.mp3',
});

// Fishing, cooking, woodcutting, mining, forging, wisdom: quiet work, not combat.
export const LIFE_SCORE = Object.freeze(['seeds','gathering','firstLight','cavern','journey','sanctuary']);
// Earth, Water, Snow, Thunder, Fire, Shadow, Light.
export const WORLD_SCORE = Object.freeze(['firstLight','seeds','journey','shards','corridors','sanctuary','city']);
export const BATTLE_SCORE = Object.freeze(['roots','canyon','trial','stand','furnace','lies','dragon']);
export const BOSS_SCORE = Object.freeze(['stand','canyon','trial','stand','furnace','shepherd','dragon']);
export const STORY_SCORE = Object.freeze({
  wake:'storm', firstLightView:'firstLight', meetDiago:'training', training:'training',
  guild:'gathering', guildParty:'gathering', aftermath:'journey', repairs:'gathering',
  seeds:'seeds', departure:'main', garden:'shards', gardenInvite:'sanctuary', gardenGift:'shards',
  fractures:'shepherd', surrender:'journey', malachar:'shepherd', levi:'stand',
  rexArrival:'dragon', rexAfter:'journey', breath:'breath', kingLies:'lies', finalStand:'dragon',
  restoration:'breath', rexDefeat:'breath', cityGates:'city', cityWelcome:'city', cityPurpose:'city',
});

export function scoreUrl(key) { return 'assets/music/' + SCORE[key || 'main']; }

export function selectScore({state={},modal='',lifeTab=0,titleOpen=false,combat=false}={}) {
  if (titleOpen) return 'main';
  if (modal === 'life') return LIFE_SCORE[lifeTab] || 'firstLight';
  if (state.openingScene && STORY_SCORE[state.openingScene]) return STORY_SCORE[state.openingScene];
  if (modal === 'guildParty') return 'gathering';
  if (['town','townInn','shop'].includes(modal)) return 'firstLight';
  if (modal === 'townGuild') return 'gathering';
  if (modal === 'forge') return LIFE_SCORE[4];
  if (modal === 'church') return LIFE_SCORE[5];
  if (modal === 'tree') return 'shards';
  if (state.training || state.openingVersion && !state.openingComplete && combat && !state.enemy?.boss) return 'training';
  const world = Math.max(0,Math.min(6,Number(state.enemy?.world ?? state.world) || 0));
  if (combat) {
    const name = state.enemy?.bossId || state.enemy?.name || '';
    if (state.enemy?.boss && /Rex|Dragon King/i.test(name)) return 'dragon';
    if (state.enemy?.boss && /Malachar|False Shepherd/i.test(name)) return 'shepherd';
    return (state.enemy?.boss ? BOSS_SCORE : BATTLE_SCORE)[world];
  }
  if (state.phase === 'selection' || state.town?.retry) return 'firstLight';
  return WORLD_SCORE[Math.max(0,Math.min(6,Number(state.world) || 0))];
}
