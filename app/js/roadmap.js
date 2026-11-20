// The roadmap to the platinum, built from the official descriptions and the
// published guides: which story chapters and missions, which collectibles and
// counts, in what order. Times and difficulty are PowerPyx's estimates.

export const ROADMAP_STAGES = [
  {
    number: 1,
    title: 'Chapter 1 — protect the one missable trophy',
    time: 'First hours',
    text: 'Play Chapter 1 and meditate at the first meditation spot at home. PowerPyx flags Positive Mental Attitude as the only possibly missable trophy because that first spot becomes permanently unavailable after Chapter 1. Everything else in this stage is unmissable story content.',
    trophyIds: ['positive-mental-attitude', 'just-like-paradise', 'paradise-lost'],
  },
  {
    number: 2,
    title: 'The story — Chapters 2 to 5',
    time: 'About 60–80 hours',
    text: 'Play the story through to the final mission. All 12 story trophies unlock automatically — the four chapter trophies, the named mission trophies and the gold for the final mission — and none of them can be missed (PowerPyx). Take stranger and side-contact missions between story beats when they appear.',
    trophyIds: [
      'tits-ass-drug-money',
      'vice-city-baby',
      'top-of-the-world-ma',
      'you-gotta-know-when-to-get-off',
      'trust',
      'break-the-bank',
      'family-matters',
      'dwnfall',
      'hi-jacked',
      'snow-storm',
    ],
  },
  {
    number: 3,
    title: 'Strangers, side missions and hidden events',
    time: 'During and after the story',
    text: 'Finish the five side contacts\' final missions (Andy, Kenton, Billy, Randy, Tyrone) and 8 stranger strands in total for the silver. The hidden event trophies — the Ocean Beach cocktail, the showroom smash, the bowling alley, the partner robberies — happen in free roam and around side content; several of their exact triggers are not pinned down in the published guides yet, so check each trophy\'s guide for what is known.',
    trophyIds: [
      'road-to-rehabilitation',
      'this-was-no-boat-accident',
      'the-lone-rider',
      'supply-and-demand',
      'spin-on-this',
      'strangers-and-freaks',
      'in-the-beginning',
      'capital-offense',
      'lets-go-bowling',
      'personal-best',
      'actions-speak-louder',
      'bad-luck-i-guess',
      'the-truth-is-out-there',
      'ten-pin',
      'hot-together',
      'retail-therapy',
    ],
  },
  {
    number: 4,
    title: 'Activities and collectibles',
    time: 'The long grind',
    text: 'The bulk of the post-story work: 250 stunts (PowerPyx counts 397 across Leonida; 100% needs 300), gold medals in all 42 Shooting Range challenges, 20 race wins, drone races at every location, 50 challenges, 5 bank vaults, 3 card sets, WAiNK at 100 locations, 100 vehicles discovered, 10 vehicles registered, every garage bought, and all of Leonida explored. Do the activities in whatever order you like — nothing here is missable.',
    trophyIds: [
      'cunning-stunts',
      'master-of-none',
      'the-shootist',
      'top-fun',
      'earn-cash-not-kudos',
      'baited-my-tackle',
      'stick-fiddler',
      'one-last-thing',
      'gunslinger',
      'catch-me-if-you-can',
      'challenging-tank',
      'sneakthief',
      'maximum-withdrawal',
      'a-classic-blitz-play',
      'pest-control',
      'fair-game',
      'dont-touch-my-deck',
      'you-wainker',
      'whip-it-good',
      'little-boxes',
      'on-the-spot',
      'the-goodtime-state',
      'dime-on-the-dollar',
      'treat-yo-self',
    ],
  },
  {
    number: 5,
    title: '100% completion and the platinum',
    time: 'Cleanup',
    text: 'After the credits, open the 100% completion checklist (Progress, then Stats, then 100% Completion) and work it line by line — earlier progress counts, and nothing on it is missable (GTABase). PowerPyx puts the checklist at roughly 60% of true completion, so finishing the other trophies does most of the work. When A Long Road pops, the platinum follows: Vice Got a Price!',
    trophyIds: ['a-long-road', 'vice-got-a-price'],
  },
];

export function renderRoadmap(container, trophies, state) {
  const byId = new Map(trophies.map((trophy) => [trophy.id, trophy]));
  container.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const block = document.createElement('article');
    block.className = 'stage';
    const heading = document.createElement('h3');
    heading.textContent = `Stage ${stage.number} — ${stage.title}`;
    const time = document.createElement('span');
    time.className = 'stage-time';
    time.textContent = stage.time;
    heading.append(time);
    const text = document.createElement('p');
    text.textContent = stage.text;
    const list = document.createElement('ul');
    for (const id of stage.trophyIds) {
      const trophy = byId.get(id);
      if (!trophy) continue;
      const item = document.createElement('li');
      const earned = state.earned.includes(id);
      const mark = document.createElement('span');
      mark.className = 'done-mark';
      mark.textContent = earned ? '✓ ' : '○ ';
      item.append(mark, document.createTextNode(`${trophy.name} — ${trophy.grade}`));
      list.append(item);
    }
    block.append(heading, text, list);
    container.append(block);
  }
}
