// Progress store: the checklist, counters and settings live in localStorage only.
// Nothing is sent anywhere. Export downloads the state as JSON; import reads one back.

export const STORAGE_KEY = 'vice-trophy-tracker-v1';

export function defaultState() {
  return { earned: [], counts: {}, spoilers: false, earnedOnly: false };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const state = defaultState();
    if (Array.isArray(parsed.earned)) state.earned = parsed.earned.filter((n) => typeof n === 'string');
    if (parsed.counts && typeof parsed.counts === 'object') {
      for (const [key, value] of Object.entries(parsed.counts)) {
        if (Number.isFinite(value) && value >= 0) state.counts[key] = Math.floor(value);
      }
    }
    if (typeof parsed.spoilers === 'boolean') state.spoilers = parsed.spoilers;
    if (typeof parsed.earnedOnly === 'boolean') state.earnedOnly = parsed.earnedOnly;
    return state;
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function isEarned(state, trophyId) {
  return state.earned.includes(trophyId);
}

export function toggleEarned(state, trophyId) {
  const at = state.earned.indexOf(trophyId);
  if (at === -1) state.earned.push(trophyId);
  else state.earned.splice(at, 1);
  saveState(state);
}

export function setCount(state, trophyId, value) {
  const clean = Math.max(0, Math.floor(value));
  if (clean === 0) delete state.counts[trophyId];
  else state.counts[trophyId] = clean;
  saveState(state);
}

export function exportState(state) {
  const blob = new Blob(
    [JSON.stringify({ app: 'vice-trophy-tracker', version: 1, exportedAt: new Date().toISOString(), state }, null, 2)],
    { type: 'application/json' },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'vice-trophy-tracker-progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

export async function importStateFile(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const raw = parsed && parsed.state ? parsed.state : parsed;
  const state = defaultState();
  if (Array.isArray(raw.earned)) state.earned = raw.earned.filter((n) => typeof n === 'string');
  if (raw.counts && typeof raw.counts === 'object') {
    for (const [key, value] of Object.entries(raw.counts)) {
      if (Number.isFinite(value) && value >= 0) state.counts[key] = Math.floor(value);
    }
  }
  if (typeof raw.spoilers === 'boolean') state.spoilers = raw.spoilers;
  if (typeof raw.earnedOnly === 'boolean') state.earnedOnly = raw.earnedOnly;
  saveState(state);
  return state;
}
