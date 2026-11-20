// Filtering and the spoiler rule: which trophies a view shows, and what a hidden
// trophy looks like until it is earned.

// The named sources each guide cites. Labels and links live here so the data file
// carries short keys and the page renders the full citation.
export const SOURCES = {
  exophase: {
    label: 'Exophase — GTA 6 trophy list',
    role: 'official name, description and grade',
    url: 'https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/',
  },
  psnprofiles: {
    label: 'PSNProfiles — GTA 6 trophies',
    role: 'grades and the counts PlayStation tracks',
    url: 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
  },
  powerpyx: {
    label: 'PowerPyx — GTA 6 Trophy Guide & Roadmap',
    role: 'roadmap, difficulty and time estimates, the one missable trophy',
    url: 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/',
  },
  gtabase: {
    label: 'GTABase — GTA 6 achievements and trophies list',
    role: 'cross-check of the list, the 100% checklist, meditation spots',
    url: 'https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series',
  },
  tracker: {
    label: 'Vice Trophy Tracker',
    role: 'our own reading of the official description',
    url: null,
  },
};

export const KIND_LABELS = {
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  online: 'Online',
};

// A trophy is hidden from the spoiler setting when PlayStation hides it until earned.
export function isSpoilerHidden(trophy, state) {
  return state.spoilers && trophy.hidden && !state.earned.includes(trophy.id);
}

export function matchesKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable === true;
  if (kind === 'online') return false; // The official list has no online trophies.
  return trophy.kind === kind;
}

export function matchesGrade(trophy, grade) {
  return grade === 'all' || trophy.grade === grade;
}

export function matchesSearch(trophy, query) {
  if (!query) return true;
  const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
  return query.toLowerCase().split(/\s+/).every((word) => haystack.includes(word));
}

export function visibleTrophies(trophies, state, filters) {
  return trophies.filter((trophy) => {
    if (filters.earnedOnly && !state.earned.includes(trophy.id)) return false;
    return matchesKind(trophy, filters.kind) && matchesGrade(trophy, filters.grade) && matchesSearch(trophy, filters.query);
  });
}

export function formatTarget(trophy) {
  if (trophy.target == null) return null;
  return trophy.target.toLocaleString('en-US');
}
