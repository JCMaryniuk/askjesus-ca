# Sarko Classic RPG

A free browser RPG for iPhone and desktop, hosted at askjesus.ca while the Sarko domain is being decided.

Choose four of eight Sarko heroes. Players can switch between classic cards and a 3D battle arena with optimized character models exported from the Windows game. Auto mode plays their eight skills against a reshuffling deck of monsters; Manual mode lets you choose a ready skill or basic attack each turn. Defeat a boss after every five regular foes, collect spirit fruit and gems, and choose when to start the next fight. The shop, forge, fruit tree, church upgrades, and local high scores are available from the arena.

The game uses character names, level-one stats, skill names and descriptions from the Sarko Windows beta. It is a standalone browser adaptation of survival mode. The campaign is not part of this release.

The Fruit Tree uses the supplied `tree_equip.png` illustration and the fruit forms from `fruit f the spirit.png`. Each fruit now applies its named effect: health, experience, damage reduction, cooldown, healing, gold, critical chance, special attack resistance, or attack power. The current value shown on the card includes any socketed gem.

## Run

`npm install` then `npm start`. The server uses Render's `PORT` value or port 3000 locally.

## Scores and saves

The Save Files menu has three independent save slots. Each slot saves its run, team, gear, upgrades, and high scores automatically in the current browser. An existing `sarko-card-arena-v3` save is migrated into File 1 when the new menu first loads. Players can rename slots, download a JSON backup, and import a backup into any slot.

These files live in browser storage on the current device; private browsing or clearing site data can erase them. Use Download Backup to keep a portable copy. Cloud saves and a shared online leaderboard need persistent server storage and are not active in this release.

## Original site

The earlier AskJesus.ca source is preserved in the `archive/askjesus-2026` branch.

