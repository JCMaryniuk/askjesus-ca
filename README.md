# Sarko Guild Card Arena

A free browser mini game for iPhone and desktop, hosted at askjesus.ca while the Sarko domain is being decided.

Choose four of eight Sarko heroes. Their eight skills play automatically against a reshuffling deck of monsters. Pause between attacks, inspect skill descriptions, defeat a boss after every five regular foes, collect spirit fruit and gems, and choose when to start the next fight. The shop, forge, fruit tree, church upgrades, and local high scores are available from the arena.

The game uses character names, level-one stats, skill names and descriptions from the Sarko Windows beta. It is a standalone browser adaptation of survival mode. The campaign is not part of this release.

## Run

`npm install` then `npm start`. The server uses Render's `PORT` value or port 3000 locally.

## Scores and saves

The Save Files menu has three independent save slots. Each slot saves its run, team, gear, upgrades, and high scores automatically in the current browser. An existing `sarko-card-arena-v3` save is migrated into File 1 when the new menu first loads. Players can rename slots, download a JSON backup, and import a backup into any slot.

These files live in browser storage on the current device; private browsing or clearing site data can erase them. Use Download Backup to keep a portable copy. Cloud saves and a shared online leaderboard need persistent server storage and are not active in this release.

## Original site

The earlier AskJesus.ca source is preserved in the `archive/askjesus-2026` branch.
