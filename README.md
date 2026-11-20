# Vice Trophy Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/DianChairo/vice-trophy-tracker/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/DianChairo/vice-trophy-tracker/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: every trophy with its official name, description and grade, a guide in our own words that cites its sources, a checklist saved in your browser, a roadmap to the platinum, and the missable trophies flagged.

## What it covers

- **All 55 trophies** — 1 platinum, 2 gold, 6 silver, 46 bronze; 28 of them hidden on PlayStation until earned. Names, descriptions and grades are the official list as Exophase and PSNProfiles publish it.
- **A tracker** — tick trophies off, track counters for the counted ones (250 stunts, 42 Shooting Range challenges, 100 WAiNK locations…), filter by kind (story, missable, collectibles, activities, online) and grade, and search by name or description. Progress is saved in the browser (localStorage) and can be exported to a file and imported back.
- **A spoiler setting** — hides the names, descriptions and guides of the hidden trophies until you earn them.
- **A roadmap to the platinum** — five stages built from the official descriptions: Chapter 1, the story, strangers and side missions, activities and collectibles, then 100% completion. PowerPyx rates the set 4/10 and about 200 hours in a single playthrough.
- **Missables** — exactly one trophy is flagged possibly missable: Positive Mental Attitude, whose first meditation spot is offered at home in Chapter 1 and becomes unavailable after that chapter (PowerPyx). Every story trophy is unmissable.
- **Cited guides** — each trophy's guide names its sources beside it: the official list, PowerPyx's trophy guide, GTABase's list, and our own reading of the official description. Where a trigger is not pinned down in any published guide yet, the guide says so instead of inventing a location.

## How to run

No build step, no network. Serve `app/` with any static file server and open `index.html`, or run the included one:

```sh
node serve.ts
# then open http://localhost:8080
```

The page works with the network off: every file it loads is under `app/`, and it fetches nothing else.

## How to use it

1. Open the Tracker tab, tick off trophies as you earn them — progress is saved automatically.
2. Use the counters on counted trophies (stunts, races, vaults…) to track partial progress.
3. Turn on **Hide story spoilers** before a first playthrough to keep hidden trophies secret until earned.
4. Read the Roadmap tab for the order to earn them in, and the Missables tab for the one trophy to protect in Chapter 1.
5. Use **Export progress** to back up your checklist as JSON, and **Import progress** to restore it.

## About

Vice Trophy Tracker is an independent, fan-made guide. It is not affiliated with Rockstar Games, and it uses no Rockstar logo, artwork or game screenshots. GTA 6 released on 19 November 2026; this guide was written from the official trophy list and the launch-week guides named in the app, and it will be updated as the community pins down the triggers that are still unconfirmed.

MIT licensed — see [LICENSE](LICENSE).
