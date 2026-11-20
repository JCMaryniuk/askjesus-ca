// Stage numbers in the script are one-based encounter numbers.
export function findHandoffScene(scenes, state, type, seen = []) {
  if (state.mode !== 'campaign' || state.training || state.malacharPhase || state.rexPhase) return null;
  return Object.entries(scenes).find(([key, scene]) => {
    if (seen.includes(key) || scene.placement.type !== type) return false;
    const p = scene.placement;
    if (p.world !== state.world) return false;
    if (type === 'world-neighbour') return state.awaiting && p.afterStage === state.worldStage;
    if (type === 'boss-hint') return !state.awaiting && state.enemy?.boss && p.beforeStage === state.worldStage + 1 && scene.title === 'Before ' + state.enemy.bossId;
    return false;
  })?.[0] || null;
}
