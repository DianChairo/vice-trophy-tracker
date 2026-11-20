// Vice Trophy Tracker boot: loads the trophy data, renders the checklist, the
// roadmap, the missables page and the sources page, and wires every control.

import { loadState, saveState, toggleEarned, setCount, exportState, importStateFile } from './store.js';
import { SOURCES, KIND_LABELS, isSpoilerHidden, visibleTrophies, formatTarget } from './filters.js';
import { renderRoadmap } from './roadmap.js';

const state = loadState();
const filters = { kind: 'all', grade: 'all', query: '' };
const openGuides = new Set();

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

const listEl = document.getElementById('trophy-list');
const metaEl = document.getElementById('list-meta');
const emptyEl = document.getElementById('empty-state');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const spoilersEl = document.getElementById('spoilers');
const earnedOnlyEl = document.getElementById('earned-only');

spoilersEl.checked = state.spoilers;
earnedOnlyEl.checked = state.earnedOnly;

function gradeLabel(trophy) {
  return trophy.grade.charAt(0).toUpperCase() + trophy.grade.slice(1);
}

function renderProgress() {
  const earned = state.earned.length;
  const total = trophies.length;
  document.getElementById('earned-count').textContent = `${earned} / ${total} earned`;
  document.getElementById('earned-pct').textContent = `${Math.round((earned / total) * 100)}%`;
  document.getElementById('progress-fill').style.width = `${(earned / total) * 100}%`;
  const byGrade = {};
  for (const trophy of trophies) {
    if (!state.earned.includes(trophy.id)) continue;
    byGrade[trophy.grade] = (byGrade[trophy.grade] ?? 0) + 1;
  }
  const totals = {};
  for (const trophy of trophies) totals[trophy.grade] = (totals[trophy.grade] ?? 0) + 1;
  document.getElementById('grade-counts').textContent = ['platinum', 'gold', 'silver', 'bronze']
    .map((grade) => `${byGrade[grade] ?? 0}/${totals[grade]} ${grade}`)
    .join(' · ');
}

function sourceLine(keys) {
  const parts = keys.map((key) => SOURCES[key]).filter(Boolean);
  const span = document.createElement('p');
  span.className = 'sources';
  const strong = document.createElement('strong');
  strong.textContent = 'Sources: ';
  span.append(strong);
  parts.forEach((source, index) => {
    if (index > 0) span.append(document.createTextNode(' · '));
    if (source.url) {
      const link = document.createElement('a');
      link.href = source.url;
      link.rel = 'noopener';
      link.textContent = source.label;
      span.append(link);
    } else {
      span.append(document.createTextNode(source.label));
    }
    span.append(document.createTextNode(` (${source.role})`));
  });
  return span;
}

function renderCounter(trophy) {
  const wrap = document.createElement('div');
  wrap.className = 'counter';
  const label = document.createElement('span');
  const current = state.counts[trophy.id] ?? 0;
  label.textContent = `Progress: ${current} / ${formatTarget(trophy)}`;
  const minus = document.createElement('button');
  minus.type = 'button';
  minus.textContent = '−';
  minus.setAttribute('aria-label', `Decrease ${trophy.name} progress`);
  minus.addEventListener('click', () => {
    setCount(state, trophy.id, (state.counts[trophy.id] ?? 0) - 1);
    renderAll();
  });
  const plus = document.createElement('button');
  plus.type = 'button';
  plus.textContent = '+';
  plus.setAttribute('aria-label', `Increase ${trophy.name} progress`);
  plus.addEventListener('click', () => {
    setCount(state, trophy.id, (state.counts[trophy.id] ?? 0) + 1);
    renderAll();
  });
  wrap.append(label, minus, plus);
  return wrap;
}

function renderTrophyCard(trophy) {
  const card = document.createElement('article');
  card.className = 'trophy';
  if (state.earned.includes(trophy.id)) card.classList.add('earned');

  const head = document.createElement('div');
  head.className = 'trophy-head';
  const check = document.createElement('input');
  check.type = 'checkbox';
  check.className = 'trophy-check';
  check.checked = state.earned.includes(trophy.id);
  check.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  check.addEventListener('change', () => {
    toggleEarned(state, trophy.id);
    renderAll();
  });
  const medal = document.createElement('span');
  medal.className = `medal ${trophy.grade}`;
  medal.title = gradeLabel(trophy);
  const main = document.createElement('div');
  main.className = 'trophy-main';

  const hidden = isSpoilerHidden(trophy, state);
  const name = document.createElement('h3');
  name.className = 'trophy-name';
  name.textContent = hidden ? 'Hidden trophy — earn it to reveal' : trophy.name;
  const gradeTag = document.createElement('span');
  gradeTag.className = 'grade-label';
  gradeTag.textContent = gradeLabel(trophy);
  name.append(gradeTag);
  main.append(name);

  if (hidden) {
    const note = document.createElement('p');
    note.className = 'spoiler-note';
    note.textContent = 'A hidden story trophy. Spoilers are on — tick the box once you have earned it to see its name, description and guide.';
    main.append(note);
  } else {
    const desc = document.createElement('p');
    desc.className = 'trophy-desc';
    desc.textContent = trophy.description;
    main.append(desc);
  }

  const tags = document.createElement('div');
  tags.className = 'trophy-tags';
  const kindTag = document.createElement('span');
  kindTag.className = 'tag';
  kindTag.textContent = KIND_LABELS[trophy.kind] ?? trophy.kind;
  tags.append(kindTag);
  if (trophy.missable) {
    const missableTag = document.createElement('span');
    missableTag.className = 'tag missable';
    missableTag.textContent = 'Missable';
    tags.append(missableTag);
  }
  if (trophy.hidden) {
    const hiddenTag = document.createElement('span');
    hiddenTag.className = 'tag hidden-flag';
    hiddenTag.textContent = 'Hidden on PSN';
    tags.append(hiddenTag);
  }
  if (trophy.target != null) {
    const targetTag = document.createElement('span');
    targetTag.className = 'tag target';
    targetTag.textContent = `Target: ${formatTarget(trophy)}`;
    tags.append(targetTag);
  }
  const stageTag = document.createElement('span');
  stageTag.className = 'tag';
  stageTag.textContent = `Roadmap stage ${trophy.stage}`;
  tags.append(stageTag);
  main.append(tags);

  if (!hidden && trophy.target != null) main.append(renderCounter(trophy));

  if (!hidden) {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'guide-toggle';
    const open = openGuides.has(trophy.id);
    toggle.textContent = open ? 'Hide guide' : 'Read the guide';
    toggle.addEventListener('click', () => {
      if (openGuides.has(trophy.id)) openGuides.delete(trophy.id);
      else openGuides.add(trophy.id);
      renderAll();
    });
    main.append(toggle);
    if (open) {
      const guide = document.createElement('div');
      guide.className = 'guide';
      const label = document.createElement('p');
      label.className = 'guide-label';
      label.textContent = 'Guide — our own words';
      const body = document.createElement('p');
      body.textContent = trophy.guide;
      guide.append(label, body, sourceLine(trophy.sources));
      main.append(guide);
    }
  }

  head.append(check, medal, main);
  card.append(head);
  return card;
}

function renderList() {
  const shown = visibleTrophies(trophies, state, filters);
  listEl.replaceChildren();
  for (const trophy of shown) listEl.append(renderTrophyCard(trophy));
  emptyEl.hidden = shown.length !== 0;
  metaEl.textContent = `Showing ${shown.length} of ${trophies.length} trophies` +
    (filters.kind !== 'all' ? ` · kind: ${KIND_LABELS[filters.kind]}` : '') +
    (state.earned.length > 0 ? ` · ${state.earned.length} earned` : '');
}

function renderMissables() {
  const container = document.getElementById('missable-list');
  container.replaceChildren();
  const missable = trophies.filter((trophy) => trophy.missable);
  for (const trophy of missable) container.append(renderTrophyCard(trophy));
  if (missable.length === 0) {
    const none = document.createElement('p');
    none.textContent = 'No trophy is currently flagged missable.';
    container.append(none);
  }
}

function renderSources() {
  const list = document.getElementById('source-list');
  list.replaceChildren();
  for (const [key, source] of Object.entries(SOURCES)) {
    const item = document.createElement('li');
    if (source.url) {
      const link = document.createElement('a');
      link.href = source.url;
      link.rel = 'noopener';
      link.textContent = source.label;
      item.append(link);
    } else {
      item.append(document.createTextNode(source.label));
    }
    const role = document.createElement('span');
    role.className = 'source-role';
    role.textContent = ` — ${source.role}`;
    item.append(role);
    list.append(item);
  }
}

function renderAll() {
  const scrollY = window.scrollY;
  renderProgress();
  renderList();
  renderRoadmap(document.getElementById('roadmap-stages'), trophies, state);
  renderMissables();
  window.scrollTo(0, scrollY);
}

function showTab(name) {
  for (const view of document.querySelectorAll('.view')) view.hidden = view.id !== `view-${name}`;
  for (const tab of document.querySelectorAll('.tab')) tab.classList.toggle('active', tab.dataset.tab === name);
}

function currentTab() {
  const hash = location.hash.replace('#', '');
  return ['tracker', 'roadmap', 'missables', 'sources'].includes(hash) ? hash : 'tracker';
}

window.addEventListener('hashchange', () => showTab(currentTab()));

searchEl.addEventListener('input', () => {
  filters.query = searchEl.value.trim();
  renderList();
});
gradeEl.addEventListener('change', () => {
  filters.grade = gradeEl.value;
  renderList();
});
document.getElementById('kind-chips').addEventListener('click', (event) => {
  const button = event.target.closest('[data-kind]');
  if (!button) return;
  filters.kind = button.dataset.kind;
  for (const chip of document.querySelectorAll('#kind-chips .chip')) {
    chip.classList.toggle('active', chip === button);
  }
  renderList();
});
spoilersEl.addEventListener('change', () => {
  state.spoilers = spoilersEl.checked;
  saveState(state);
  renderAll();
});
earnedOnlyEl.addEventListener('change', () => {
  state.earnedOnly = earnedOnlyEl.checked;
  saveState(state);
  renderList();
});
document.getElementById('export').addEventListener('click', () => exportState(state));
document.getElementById('import').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const next = await importStateFile(file);
    Object.assign(state, next);
    spoilersEl.checked = state.spoilers;
    earnedOnlyEl.checked = state.earnedOnly;
    renderAll();
  } catch {
    alert('That file could not be imported as tracker progress.');
  }
  event.target.value = '';
});
document.getElementById('reset').addEventListener('click', () => {
  if (!confirm('Clear all earned trophies, counters and settings?')) return;
  state.earned = [];
  state.counts = {};
  state.spoilers = false;
  state.earnedOnly = false;
  saveState(state);
  spoilersEl.checked = false;
  earnedOnlyEl.checked = false;
  openGuides.clear();
  renderAll();
});

renderSources();
renderAll();
showTab(currentTab());
