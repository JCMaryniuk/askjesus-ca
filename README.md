# Sarko Classic RPG

A free browser RPG for iPhone and desktop, hosted at askjesus.ca while the Sarko domain is being decided.

Choose four of nine Sarko heroes, including Grace. Choose the illustrated Cards view or animated 3D battles and service scenes, with illustrated 2D maps in both modes; Auto mode plays their eight skills against a reshuffling deck of monsters, while Manual mode lets you choose a ready skill or basic attack each turn. Actions advance slowly enough to read damage and healing. After every win, the party appears on an illustrated world map and you decide when to travel to the next battle. Face bosses at encounters 10 and 20 in each world, collect spirit fruit and gems, and visit the merchant, forge, fruit tree, or church between fights.

The game uses character names, level-one stats, skill names and descriptions from the Sarko Windows beta. Survival reshuffles all 11 monster families and two bosses appear at encounters 10 and 20 in each world. The seven-world book campaign has 20 stages per world, bosses at stages 10 and 20, all 17 full chapters to read, and ElevenLabs chapter narration. The 28 adapted campaign conversations also have short ElevenLabs recordings, using the George storyteller voice with named speakers, visible subtitles, replay/pause controls, and skippable scenes. Completing a difficulty unlocks the next and carries the team, levels, fruit, skill ranks, gold, and points forward.

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

## Windows beta

Open Sarko Classic RPG from the title menu or guild table, then choose CARDS / 3D to launch the bundled browser edition. Keep Sarko open while playing; it serves the game locally at http://127.0.0.1:18765 without an internet connection. Cards and 3D share saves inside this browser edition. The older Unity card mode and the public website use separate save locations; use browser Save Files backups to transfer between the local and public browser editions.

Controller: D-pad or left stick moves focus; A selects; B closes a dialog; Start pauses or resumes a battle. Keyboard and touch controls remain available.

