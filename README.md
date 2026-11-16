# Sarko Classic RPG

A free browser RPG for iPhone and desktop, hosted at askjesus.ca while the Sarko domain is being decided.

Choose four of eight Sarko heroes. Battles use the illustrated card arena; Auto mode plays their eight skills against a reshuffling deck of monsters, while Manual mode lets you choose a ready skill or basic attack each turn. Actions advance slowly enough to read damage and healing. After every win, the party appears on an illustrated world map and you decide when to travel to the next battle. Defeat a boss after every five regular foes, collect spirit fruit and gems, and visit the merchant, forge, fruit tree, or church between fights.

The game uses character names, level-one stats, skill names and descriptions from the Sarko Windows beta. Survival reshuffles all 11 monster families and a named boss appears after every five regular foes. The seven-world book campaign has 20 stages per world, a boss at stage 20, all 17 full chapters to read, and ElevenLabs chapter narration. Completing a difficulty unlocks the next and carries the team, levels, fruit, skill ranks, gold, and points forward.

Survival backdrops change with the monster. Campaign backdrops match the current world. The illustrated travel map covers the seven linked worlds and shows the party's route between battles.

Arena monsters have half their original health, attack, and guard. Victories award 50% more gold, at least one fruit chest, and one team skill point for every two monsters cleared. Bosses award three fruit chests and a gem. Church skill upgrade costs are 25% higher than the prior beta.

Each hero has a dedicated Fruit of the Spirit tree based on the supplied art. Empty branches name the missing fruit, and wordless fruit pictures appear only when equipped. Remove All returns every fruit on that hero to inventory. Each fruit now applies its named effect: health, experience, damage reduction, cooldown, healing, gold, critical chance, special attack resistance, or attack power. The current value shown on the card includes any socketed gem.

## Run

`npm install` then `npm start`. The server uses Render's `PORT` value or port 3000 locally.

## Scores and saves

The Save Files menu has three independent save slots. Each slot saves its run, team, gear, upgrades, and high scores automatically in the current browser. An existing `sarko-card-arena-v3` save is migrated into File 1 when the new menu first loads. Players can rename slots, download a JSON backup, and import a backup into any slot.

These files live in browser storage on the current device; private browsing or clearing site data can erase them. Use Download Backup to keep a portable copy. Cloud saves and a shared online leaderboard need persistent server storage and are not active in this release.

## Original site

The earlier AskJesus.ca source is preserved in the `archive/askjesus-2026` branch.
