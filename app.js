'use strict';

const APP_VERSION = (window.HB_DATA && HB_DATA.version) || 'v0.12';

const state = {
  view: 'home',
  search: '',
  filters: { category: '', flavor: '', usage: '', style: '', origin: '' },
  recipeSearch: '',
  recipeFilters: { season: '', style: '' }
};

const inventory = HB_DATA.inventory.map(normalizeItem);
const recipes = HB_DATA.recipes || [];
const taxonomy = HB_DATA.taxonomies || {};
const CANONICAL_FLAVORS = arrayOf(taxonomy.flavorTags);
const CANONICAL_USAGES = arrayOf(taxonomy.usageTags);

const els = {};

document.addEventListener('DOMContentLoaded', () => {
  cacheElements();
  bindEvents();
  renderAppVersion();
  renderAll();
});


function renderAppVersion(){
  document.title = `Hausbar Next ${APP_VERSION}`;
  document.querySelectorAll('[data-app-version]').forEach(el => {
    el.textContent = APP_VERSION;
  });
}

function cacheElements(){
  els.views = document.querySelectorAll('.view');
  els.navButtons = document.querySelectorAll('.bottom-nav button');
  els.homeStats = document.getElementById('homeStats');
  els.dailyDrinkCard = document.getElementById('dailyDrinkCard');
  els.dailyDrinkName = document.getElementById('dailyDrinkName');
  els.dailyDrinkStyle = document.getElementById('dailyDrinkStyle');
  els.rerollTodayMenu = document.getElementById('rerollTodayMenu');
  els.todayMenuGrid = document.getElementById('todayMenuGrid');
  els.searchInput = document.getElementById('searchInput');
  els.categoryFilter = document.getElementById('categoryFilter');
  els.flavorFilter = document.getElementById('flavorFilter');
  els.usageFilter = document.getElementById('usageFilter');
  els.styleFilter = document.getElementById('styleFilter');
  els.originFilter = document.getElementById('originFilter');
  els.resetFilters = document.getElementById('resetFilters');
  els.inventoryCount = document.getElementById('inventoryCount');
  els.inventoryGrid = document.getElementById('inventoryGrid');
  els.recipeSearch = document.getElementById('recipeSearch');
  els.recipeSeasonFilter = document.getElementById('recipeSeasonFilter');
  els.recipeStyleFilter = document.getElementById('recipeStyleFilter');
  els.resetRecipeFilters = document.getElementById('resetRecipeFilters');
  els.recipeCount = document.getElementById('recipeCount');
  els.recipeGrid = document.getElementById('recipeGrid');
  els.dialog = document.getElementById('itemDialog');
  els.closeDialog = document.getElementById('closeDialog');
  els.detailName = document.getElementById('detailName');
  els.detailCategory = document.getElementById('detailCategory');
  els.detailBody = document.getElementById('detailBody');
  els.recipeDialog = document.getElementById('recipeDialog');
  els.closeRecipeDialog = document.getElementById('closeRecipeDialog');
  els.recipeDetailName = document.getElementById('recipeDetailName');
  els.recipeDetailCategory = document.getElementById('recipeDetailCategory');
  els.recipeDetailBody = document.getElementById('recipeDetailBody');
}

function bindEvents(){
  els.navButtons.forEach(btn => btn.addEventListener('click', () => setView(btn.dataset.view)));
  if(els.dailyDrinkCard) els.dailyDrinkCard.addEventListener('click', () => { const drink = getDailyDrink(); if(drink) openRecipe(drink.id); });
  if(els.rerollTodayMenu) els.rerollTodayMenu.addEventListener('click', () => { saveTodayMenu(generateTodayMenu({ reroll: true })); renderHome(); });
  els.searchInput.addEventListener('input', e => { state.search = e.target.value.trim().toLowerCase(); renderInventory(); });
  els.categoryFilter.addEventListener('change', e => setFilter('category', e.target.value));
  els.flavorFilter.addEventListener('change', e => setFilter('flavor', e.target.value));
  els.usageFilter.addEventListener('change', e => setFilter('usage', e.target.value));
  els.styleFilter.addEventListener('change', e => setFilter('style', e.target.value));
  els.originFilter.addEventListener('change', e => setFilter('origin', e.target.value));
  els.resetFilters.addEventListener('click', resetFilters);
  els.recipeSearch.addEventListener('input', e => { state.recipeSearch = e.target.value.trim().toLowerCase(); renderRecipes(); });
  els.recipeSeasonFilter.addEventListener('change', e => { state.recipeFilters.season = e.target.value; renderRecipes(); });
  els.recipeStyleFilter.addEventListener('change', e => { state.recipeFilters.style = e.target.value; renderRecipes(); });
  els.resetRecipeFilters.addEventListener('click', resetRecipeFilters);
  els.closeDialog.addEventListener('click', () => els.dialog.close());
  els.closeRecipeDialog.addEventListener('click', () => els.recipeDialog.close());
}

function renderAll(){
  renderHome();
  renderInventory();
  renderRecipes();
  setView(state.view);
}

function setView(view){
  state.view = view;
  els.views.forEach(v => v.classList.toggle('active', v.id === `view-${view}`));
  els.navButtons.forEach(b => b.classList.toggle('active', b.dataset.view === view));
}

function normalizeItem(item){
  const normalized = { ...item };
  normalized.category = normalized.category === 'Whiskey' ? 'Whisky' : (normalized.category || 'Unkategorisiert');
  normalized.flavorTags = arrayOf(normalized.flavorTags);
  normalized.usageTags = arrayOf(normalized.usageTags);
  normalized.styleTags = arrayOf(normalized.styleTags);
  normalized.guestTags = arrayOf(normalized.guestTags);
  normalized.originTags = arrayOf(normalized.originTags);
  normalized.legacyTags = arrayOf(normalized.legacyTags);
  normalized.description = normalized.description || { short: '', long: '', tastingNotes: [], bestUse: [], serving: '', sourceStatus: 'empty' };
  normalized.searchText = [
    normalized.name, normalized.producer, normalized.category, normalized.subcategory,
    ...normalized.flavorTags, ...normalized.usageTags, ...normalized.styleTags, ...normalized.guestTags, ...normalized.originTags,
    normalized.description.short, normalized.notes
  ].filter(Boolean).join(' ').toLowerCase();
  return normalized;
}

function arrayOf(value){
  return Array.isArray(value) ? [...new Set(value.map(v => String(v).trim()).filter(Boolean))] : [];
}

function setFilter(name, value){
  state.filters[name] = value;
  renderInventory();
}

function resetFilters(){
  state.search = '';
  state.filters = { category: '', flavor: '', usage: '', style: '', origin: '' };
  els.searchInput.value = '';
  renderInventory();
}

function sameValue(a, b){
  return String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();
}

function listContains(list, selected){
  if(!selected) return true;
  return arrayOf(list).some(value => sameValue(value, selected));
}

function itemMatches(item, filters, search){
  if(search && !item.searchText.includes(search)) return false;
  if(filters.category && !sameValue(item.category, filters.category)) return false;
  if(filters.flavor && !listContains(item.flavorTags, filters.flavor)) return false;
  if(filters.usage && !listContains(item.usageTags, filters.usage)) return false;
  if(filters.style && !listContains(item.styleTags, filters.style)) return false;
  if(filters.origin && !listContains(item.originTags, filters.origin)) return false;
  return true;
}

function filteredInventory(ignoreFilterName = null){
  const filters = { ...state.filters };
  if(ignoreFilterName) filters[ignoreFilterName] = '';
  return inventory.filter(item => itemMatches(item, filters, state.search));
}

function renderInventory(){
  populateAllFilters();
  const items = filteredInventory();
  els.inventoryCount.textContent = `${items.length} von ${inventory.length} Flaschen`;
  els.inventoryGrid.innerHTML = items.map(renderItemCard).join('') || '<p class="empty">Keine Flaschen gefunden.</p>';
  els.inventoryGrid.querySelectorAll('[data-item-id]').forEach(btn => btn.addEventListener('click', () => openItem(btn.dataset.itemId)));
}

function populateAllFilters(){
  populateSelect(els.categoryFilter, 'Alle Kategorien', optionsFor('category'), state.filters.category);
  populateSelect(els.flavorFilter, 'Alle Geschmäcker', optionsFor('flavor'), state.filters.flavor);
  populateSelect(els.usageFilter, 'Alle Nutzungen', optionsFor('usage'), state.filters.usage);
  populateSelect(els.styleFilter, 'Alle Stile', optionsFor('style'), state.filters.style);
  populateSelect(els.originFilter, 'Alle Herkünfte', optionsFor('origin'), state.filters.origin);
}

function hasExternalFacetContext(filterName){
  if(state.search) return true;
  return Object.entries(state.filters).some(([key, value]) => key !== filterName && Boolean(value));
}

function optionsFor(filterName){
  const source = filteredInventory(filterName);
  let values = [];
  if(filterName === 'category') values = source.map(i => i.category);
  if(filterName === 'flavor') {
    values = source.flatMap(i => i.flavorTags);
    if(!hasExternalFacetContext('flavor')) values = [...CANONICAL_FLAVORS, ...values];
  }
  if(filterName === 'usage') {
    values = source.flatMap(i => i.usageTags);
    if(!hasExternalFacetContext('usage')) values = [...CANONICAL_USAGES, ...values];
  }
  if(filterName === 'style') values = source.flatMap(i => i.styleTags);
  if(filterName === 'origin') values = source.flatMap(i => i.originTags);
  return uniqueSorted(values);
}

function uniqueSorted(values){
  const map = new Map();
  arrayOf(values).forEach(value => {
    const key = String(value).trim().toLowerCase();
    if(key && !map.has(key)) map.set(key, value);
  });
  return Array.from(map.values()).sort((a,b) => a.localeCompare(b, 'de', { sensitivity: 'base' }));
}

function populateSelect(select, label, options, value){
  const safeOptions = uniqueSorted(options);
  const exists = !value || safeOptions.some(opt => sameValue(opt, value));
  const finalValue = exists ? value : '';
  const html = [`<option value="">${escapeHtml(label)}</option>`, ...safeOptions.map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`)].join('');
  select.innerHTML = html;
  select.value = finalValue;
  if(!exists){
    if(select === els.categoryFilter) state.filters.category = '';
    if(select === els.flavorFilter) state.filters.flavor = '';
    if(select === els.usageFilter) state.filters.usage = '';
    if(select === els.styleFilter) state.filters.style = '';
    if(select === els.originFilter) state.filters.origin = '';
  }
}

function renderItemCard(item){
  const tags = [...item.flavorTags.slice(0,3), ...item.usageTags.slice(0,2)].slice(0,5);
  return `<button class="item-card" data-item-id="${escapeHtml(item.id)}">
    <h3>${escapeHtml(item.name)}</h3>
    <p class="meta">${escapeHtml([item.category, item.subcategory].filter(Boolean).join(' · '))}</p>
    <div class="tag-row">${tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
  </button>`;
}

function openItem(id){
  const item = inventory.find(i => i.id === id);
  if(!item) return;
  els.detailName.textContent = item.name;
  els.detailCategory.textContent = [item.category, item.subcategory].filter(Boolean).join(' · ');
  const desc = item.description || {};
  const originLabel = item.originTags.length ? item.originTags.join(' · ') : 'Herkunft offen';
  const profileText = bottleProfileText(item, desc);
  const leadingTags = [...item.flavorTags.slice(0,2), ...item.styleTags.slice(0,1)].filter(Boolean).slice(0,3);
  els.detailBody.innerHTML = `
    <div class="bottle-hero-detail premium-bottle-hero">
      <div class="bottle-hero-copy">
        <p class="eyebrow">Flaschenprofil</p>
        <h3>${escapeHtml(item.name)}</h3>
        <p>${escapeHtml(profileText)}</p>
        <div class="signature-strip">
          ${leadingTags.length ? leadingTags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('') : '<span>Profil wird kuratiert</span>'}
        </div>
      </div>
      <div class="bottle-meta-grid premium-meta-grid">
        ${metaTile('Kategorie', item.category)}
        ${metaTile('Unterkategorie', item.subcategory || 'Noch offen')}
        ${metaTile('Status', item.status || 'Nicht gepflegt')}
        ${metaTile('Herkunft', originLabel)}
      </div>
    </div>

    <div class="bottle-snapshot">
      ${snapshotTile('Barrolle', bottleRole(item))}
      ${snapshotTile('Profil', bottleMood(item))}
      ${snapshotTile('Einsatz', bottleBestUse(item))}
    </div>

    <div class="detail-section highlight-section bottle-description-card">
      <h3>Beschreibung</h3>
      <p>${escapeHtml(desc.short || bottleCuratedPlaceholder(item))}</p>
    </div>

    <div class="detail-grid two-col">
      ${detailTags('Geschmack', item.flavorTags, 'Aromen, sensorische Richtung und geschmackliche Wirkung.')}
      ${detailTags('Nutzung', item.usageTags, 'Cocktail-Rollen, Einsatzbereiche und Bar-Kontext.')}
      ${detailTags('Stil', item.styleTags, 'Intensität, Charakter und Position in deiner Bar.')}
      ${detailTags('Herkunft', item.originTags, 'Land, Region oder stilistische Herkunft.')}
    </div>

    <div class="detail-grid two-col">
      <div class="detail-section">
        <h3>Beste Verwendung</h3>
        ${item.usageTags.length ? `<ul class="clean-list compact-list polished-list">${item.usageTags.slice(0,5).map(tag => `<li>${escapeHtml(usageSentence(tag))}</li>`).join('')}</ul>` : '<p class="empty">Noch keine Nutzung gepflegt.</p>'}
      </div>
      <div class="detail-section">
        <h3>Servieren</h3>
        <p>${escapeHtml(desc.serving || servingSuggestionFor(item))}</p>
      </div>
    </div>

    <div class="detail-section curation-note">
      <h3>Kuration</h3>
      <p>${escapeHtml(bottleCurationStatus(item))}</p>
    </div>

    ${item.notes ? `<div class="detail-section"><h3>Notizen</h3><p>${escapeHtml(item.notes)}</p></div>` : ''}
  `;
  els.dialog.showModal();
}

function snapshotTile(label, value){
  return `<div class="snapshot-tile"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || 'Noch offen')}</strong></div>`;
}

function bottleRole(item){
  if(listContains(item.usageTags, 'sipping')) return 'Sipping / Pur';
  if(listContains(item.usageTags, 'modifier')) return 'Modifier';
  if(listContains(item.usageTags, 'aperitif')) return 'Aperitif';
  if(listContains(item.usageTags, 'tiki')) return 'Tiki / Tropical';
  if(listContains(item.usageTags, 'spritz')) return 'Spritz / Longdrink';
  if(item.category) return item.category;
  return 'Bar-Zutat';
}

function bottleMood(item){
  const tags = [...item.flavorTags.slice(0,2), ...item.styleTags.slice(0,2)].filter(Boolean);
  return tags.length ? tags.join(' · ') : 'Profil offen';
}

function bottleBestUse(item){
  if(item.usageTags.length) return item.usageTags.slice(0,2).join(' · ');
  if(item.category === 'Whisky') return 'Pur / Klassiker';
  if(item.category === 'Gin') return 'Highball / Sour';
  return 'Noch zu kuratieren';
}

function bottleCuratedPlaceholder(item){
  const origin = item.originTags.length ? ` aus ${item.originTags.join(' / ')}` : '';
  const flavor = item.flavorTags.slice(0,3).join(', ');
  const style = item.styleTags.slice(0,2).join(', ');
  const parts = [];
  if(item.category) parts.push(`${item.category}${origin}`);
  if(flavor) parts.push(`mit ${flavor}em Profil`);
  if(style) parts.push(`im Stil ${style}`);
  return parts.length
    ? `${parts.join(' – ')}. Eine ausführliche, quellenbasierte Flaschenbeschreibung wird später in der Internet-/Kurationsphase ergänzt.`
    : 'Noch keine kuratierte Beschreibung vorhanden. Diese Sektion ist für spätere Hersteller-/Internetdaten und eigene Verkostungsnotizen vorbereitet.';
}

function bottleCurationStatus(item){
  const missing = [];
  if(!item.originTags.length) missing.push('Herkunft');
  if(!(item.description && (item.description.short || item.description.long))) missing.push('Beschreibung');
  if(!item.guestTags.length) missing.push('Gästekontext');
  if(!missing.length) return 'Die wichtigsten Kurationsfelder sind für diese Flasche bereits gepflegt.';
  return `Noch offen für spätere Kuration: ${missing.join(', ')}.`;
}

function metaTile(label, value){
  return `<div class="meta-tile"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || 'Noch offen')}</strong></div>`;
}

function bottleProfileText(item, desc){
  if(desc.long) return desc.long;
  if(desc.short) return desc.short;
  const flavors = item.flavorTags.slice(0,3).join(', ');
  const styles = item.styleTags.slice(0,2).join(', ');
  const parts = [];
  if(flavors) parts.push(`Profil: ${flavors}`);
  if(styles) parts.push(`Stil: ${styles}`);
  if(item.category) parts.push(`Kategorie: ${item.category}`);
  return parts.join(' · ') || 'Profil für spätere Kurationsdaten vorbereitet.';
}

function usageSentence(tag){
  const clean = String(tag || '').trim();
  if(!clean) return 'Als flexible Bar-Zutat einsetzbar.';
  const map = {
    'sipping': 'Pur oder mit wenig Wasser genießen.',
    'highball': 'Gut für Highballs und längere Drinks.',
    'sour': 'Geeignet für Sours und frische Drinks.',
    'spritz': 'Passend für Spritz- und Aperitif-Drinks.',
    'negroni': 'Ideal für Negroni-Varianten.',
    'old-fashioned': 'Geeignet für Old-Fashioned- und Stirred-Drinks.',
    'tiki': 'Passend für Tiki- und Tropical-Drinks.',
    'modifier': 'Als Modifier für Balance, Tiefe oder Akzent.'
  };
  return map[clean.toLowerCase()] || `Einsatz: ${clean}.`;
}

function servingSuggestionFor(item){
  if(listContains(item.usageTags, 'sipping')) return 'Pur, leicht gekühlt oder mit wenigen Tropfen Wasser servieren.';
  if(listContains(item.usageTags, 'spritz')) return 'Gekühlt mit viel Eis, Soda oder Schaumwein als Aperitif servieren.';
  if(listContains(item.usageTags, 'highball')) return 'Auf Eis im Highballglas mit passendem Filler servieren.';
  if(listContains(item.usageTags, 'tiki')) return 'Auf Crushed Ice oder mit tropischer Garnitur einsetzen.';
  return 'Servierempfehlung ist vorbereitet und wird später kuratiert ergänzt.';
}

function detailTags(title, tags, helper = ''){
  return `<div class="detail-section tag-section"><h3>${escapeHtml(title)}</h3>${helper ? `<p class="section-helper">${escapeHtml(helper)}</p>` : ''}<div class="tag-row">${tags.length ? tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('') : '<span class="empty">Noch leer</span>'}</div></div>`;
}

function renderHome(){
  const categories = new Set(inventory.map(i => i.category));
  const origins = new Set(inventory.flatMap(i => i.originTags));
  els.homeStats.innerHTML = [
    ['Flaschen', inventory.length], ['Rezepte', recipes.length], ['Kategorien', categories.size]
  ].map(([label,value]) => `<div class="stat"><strong>${value}</strong><span>${label}</span></div>`).join('');

  const daily = getDailyDrink();
  if(daily){
    els.dailyDrinkName.textContent = daily.name;
    els.dailyDrinkStyle.textContent = [daily.style, ...arrayOf(daily.season).slice(0,1)].filter(Boolean).join(' · ');
  }
  const menu = getTodayMenu();
  els.todayMenuGrid.innerHTML = menu.map(renderHomeMenuItem).join('') || '<p class="empty">Noch keine Empfehlungen vorhanden.</p>';
  els.todayMenuGrid.querySelectorAll('[data-home-recipe-id]').forEach(btn => btn.addEventListener('click', () => openRecipe(btn.dataset.homeRecipeId)));
}

function berlinDateKey(){
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date()).reduce((acc, part) => { acc[part.type] = part.value; return acc; }, {});
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function hashString(value){
  let hash = 2166136261;
  for(const ch of String(value)){
    hash ^= ch.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededIndex(length, seed){
  if(!length) return 0;
  return hashString(seed) % length;
}

function sortedRecipes(){
  return [...recipes].sort((a,b) => String(a.name).localeCompare(String(b.name), 'de', { sensitivity: 'base' }));
}

function getDailyDrink(){
  const list = sortedRecipes();
  if(!list.length) return null;
  return list[seededIndex(list.length, `daily-${berlinDateKey()}`)];
}

function recipeMatchesStyle(recipe, styles){
  const wanted = arrayOf(styles).map(v => v.toLowerCase());
  const hay = [recipe.style, recipe.category, ...(recipe.flavorTags || []), ...(recipe.moodTags || [])].filter(Boolean).join(' ').toLowerCase();
  return wanted.some(value => hay.includes(value));
}

function pickRecipe(candidates, seed, usedIds){
  const clean = candidates.filter(recipe => !usedIds.has(recipe.id));
  if(!clean.length) return null;
  return clean[seededIndex(clean.length, seed)];
}

function generateTodayMenu(options = {}){
  const dateKey = berlinDateKey();
  const seedSuffix = options.reroll ? `${Date.now()}-${Math.random()}` : dateKey;
  const source = sortedRecipes();
  const used = new Set();
  const aperitifCandidates = source.filter(recipe => recipeMatchesStyle(recipe, ['Aperitif']));
  const mainCandidates = source.filter(recipe => recipeMatchesStyle(recipe, ['Frisch & Sour', 'Longdrink & Highball', 'Kräftig & Spirituosig']));
  const dessertCandidates = source.filter(recipe => recipeMatchesStyle(recipe, ['Digestif', 'Cremig & Dessert', 'Dessert']));

  const aperitif = pickRecipe(aperitifCandidates, `aperitif-${seedSuffix}`, used);
  if(aperitif) used.add(aperitif.id);
  const main = pickRecipe(mainCandidates, `main-${seedSuffix}`, used) || pickRecipe(source, `main-fallback-${seedSuffix}`, used);
  if(main) used.add(main.id);
  const dessert = pickRecipe(dessertCandidates, `dessert-${seedSuffix}`, used) || pickRecipe(source, `dessert-fallback-${seedSuffix}`, used);
  if(dessert) used.add(dessert.id);

  return [
    { slot: 'Aperitif', recipe: aperitif },
    { slot: 'Hauptdrink', recipe: main },
    { slot: 'Digestif / Dessert', recipe: dessert }
  ].filter(entry => entry.recipe);
}

function todayMenuStorageKey(){
  return `hausbar-next-today-menu-${berlinDateKey()}`;
}

function saveTodayMenu(menu){
  try {
    localStorage.setItem(todayMenuStorageKey(), JSON.stringify(menu.map(entry => ({ slot: entry.slot, id: entry.recipe.id }))));
  } catch (_) {}
}

function getTodayMenu(){
  const key = todayMenuStorageKey();
  try {
    const raw = localStorage.getItem(key);
    if(raw){
      const saved = JSON.parse(raw);
      const hydrated = saved.map(entry => ({ slot: entry.slot, recipe: recipes.find(recipe => recipe.id === entry.id) })).filter(entry => entry.recipe);
      if(hydrated.length === 3) return hydrated;
    }
  } catch (_) {}
  const menu = generateTodayMenu();
  saveTodayMenu(menu);
  return menu;
}

function renderHomeMenuItem(entry){
  const recipe = entry.recipe;
  const subtitle = [recipe.style, ...arrayOf(recipe.season).slice(0,1)].filter(Boolean).join(' · ');
  return `<button class="home-menu-item" data-home-recipe-id="${escapeHtml(recipe.id)}" type="button">
    <span>${escapeHtml(entry.slot)}</span>
    <strong>${escapeHtml(recipe.name)}</strong>
    <small>${escapeHtml(subtitle || recipe.category || 'Rezept')}</small>
  </button>`;
}

function renderRecipes(){
  populateRecipeFilters();
  const query = state.recipeSearch;
  const list = recipes.filter(recipe => {
    if(query && !recipeSearchText(recipe).includes(query)) return false;
    if(state.recipeFilters.season && !arrayOf(recipe.season).includes(state.recipeFilters.season)) return false;
    if(state.recipeFilters.style && recipe.style !== state.recipeFilters.style) return false;
    return true;
  });
  els.recipeCount.textContent = `${list.length} von ${recipes.length} Rezepten`;
  els.recipeGrid.innerHTML = list.map(renderRecipeCard).join('') || '<p class="empty">Keine Rezepte gefunden.</p>';
  els.recipeGrid.querySelectorAll('[data-recipe-id]').forEach(btn => btn.addEventListener('click', () => openRecipe(btn.dataset.recipeId)));
}

function populateRecipeFilters(){
  const seasons = uniqueSorted(recipes.flatMap(r => arrayOf(r.season)));
  const styles = uniqueSorted(recipes.map(r => r.style).filter(Boolean));
  populateSelect(els.recipeSeasonFilter, 'Alle Jahreszeiten', seasons, state.recipeFilters.season);
  populateSelect(els.recipeStyleFilter, 'Alle Stilrichtungen', styles, state.recipeFilters.style);
}

function resetRecipeFilters(){
  state.recipeSearch = '';
  state.recipeFilters = { season: '', style: '' };
  els.recipeSearch.value = '';
  els.recipeSeasonFilter.value = '';
  els.recipeStyleFilter.value = '';
  renderRecipes();
}

function recipeSearchText(recipe){
  return [
    recipe.name, recipe.category, recipe.style, recipe.strength,
    ...(recipe.season || []), ...(recipe.ingredients || []), ...(recipe.instructions || []),
    ...(recipe.flavorTags || []), ...(recipe.moodTags || []), ...(recipe.match || []), ...(recipe.missingFallback || [])
  ].filter(Boolean).join(' ').toLowerCase();
}

function renderRecipeCard(recipe){
  const seasonPreview = arrayOf(recipe.season).slice(0,1);
  const tags = [recipe.category, recipe.style, ...seasonPreview, recipe.strength].filter(Boolean).slice(0,4);
  const subtitle = [recipe.category, recipe.style, ...seasonPreview, recipe.strength].filter(Boolean).join(' · ');
  return `<button class="item-card recipe-card" data-recipe-id="${escapeHtml(recipe.id)}">
    <h3>${escapeHtml(recipe.name)}</h3>
    <p class="meta">${escapeHtml(subtitle || (recipe.ingredients || []).slice(0,3).join(' · '))}</p>
    <p class="recipe-preview">${escapeHtml(recipeShortDescription(recipe))}</p>
    <div class="tag-row">${tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
  </button>`;
}

function openRecipe(id){
  const recipe = recipes.find(r => r.id === id);
  if(!recipe) return;
  els.recipeDetailName.textContent = recipe.name;
  els.recipeDetailCategory.textContent = [recipe.category, recipe.style, ...arrayOf(recipe.season).slice(0,2), recipe.strength].filter(Boolean).join(' · ');
  const ingredients = arrayOf(recipe.ingredients);
  const instructions = arrayOf(recipe.instructions);
  const serving = recipeServingMeta(recipe);
  els.recipeDetailBody.innerHTML = `
    <div class="detail-section highlight-section"><h3>Beschreibung</h3><p>${escapeHtml(recipeLongDescription(recipe))}</p></div>
    <div class="recipe-meta-grid">
      ${recipeMetaTile('Stärke', recipe.strength || 'Nicht hinterlegt')}
      ${recipeMetaTile('Glas', serving.glass)}
      ${recipeMetaTile('Eis', serving.ice)}
      ${recipeMetaTile('Garnish', serving.garnish)}
    </div>
    <div class="detail-section"><h3>Zutaten</h3>${ingredients.length ? `<ul class="clean-list ingredient-list">${ingredients.map(i => `<li><span>${escapeHtml(i)}</span></li>`).join('')}</ul>` : '<p class="empty">Keine Zutaten hinterlegt.</p>'}</div>
    <div class="detail-section"><h3>Zubereitung</h3>${instructions.length ? `<ol class="clean-list step-list">${instructions.map(step => `<li>${escapeHtml(step)}</li>`).join('')}</ol>` : '<p class="empty">Keine Zubereitung hinterlegt.</p>'}</div>
    <div class="detail-section"><h3>Servierhinweis</h3><p>${escapeHtml(serving.note)}</p></div>
    ${detailTags('Jahreszeit', arrayOf(recipe.season))}
    ${detailTags('Geschmack', recipe.flavorTags || [])}
    ${detailTags('Stimmung', recipe.moodTags || [])}
    ${detailTags('Benötigte Bar-Zutaten', recipe.match || [])}
    ${detailTags('Fallback / mögliche fehlende Angabe', recipe.missingFallback || [])}
  `;
  els.recipeDialog.showModal();
}

function recipeMetaTile(label, value){
  return `<div class="recipe-meta-tile"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function recipeShortDescription(recipe){
  const flavors = arrayOf(recipe.flavorTags).slice(0,2).join(' und ');
  const style = recipe.style || recipe.category || 'Cocktail';
  if(flavors) return `${style} mit ${flavors}em Profil.`;
  return `${style} aus Murats Rezeptbestand.`;
}

function recipeLongDescription(recipe){
  const name = recipe.name || 'Dieser Drink';
  const style = recipe.style || recipe.category || 'Cocktail';
  const strength = recipe.strength ? `Die Stärke ist als ${recipe.strength} eingeordnet.` : 'Die Stärke ist noch nicht eingeordnet.';
  const flavors = arrayOf(recipe.flavorTags);
  const moods = arrayOf(recipe.moodTags);
  const seasons = arrayOf(recipe.season);
  const flavorText = flavors.length ? ` Geschmacklich wirkt der Drink ${joinHuman(flavors)}.` : '';
  const moodText = moods.length ? ` Besonders passend für ${joinHuman(moods)}.` : '';
  const seasonText = seasons.length ? ` Saison: ${joinHuman(seasons)}.` : '';
  return `${name} ist ein ${style}-Rezept aus Murats Hausbar. ${strength}${flavorText}${moodText}${seasonText}`;
}

function recipeServingMeta(recipe){
  const text = recipeSearchText(recipe);
  const name = String(recipe.name || '').toLowerCase();
  const category = String(recipe.category || '').toLowerCase();
  const style = String(recipe.style || '').toLowerCase();
  let glass = 'Tumbler oder Coupette';
  let ice = 'Je nach Rezept';
  let garnish = 'Zitruszeste oder passende Garnitur';
  let note = 'Kalt und frisch servieren. Die genaue Glas- und Garnish-Kuration wird später pro Rezept verfeinert.';

  if(text.includes('spritz') || name.includes('spritz')) { glass = 'Weinglas'; ice = 'Viel Eis'; garnish = 'Orangenscheibe oder Zeste'; note = 'Locker auf Eis bauen und mit Schaumwein oder Soda frisch verlängern.'; }
  else if(text.includes('martini') || name.includes('martini')) { glass = 'Martini- oder Coupetteglas'; ice = 'Ohne Eis im Glas'; garnish = 'Zeste oder Olive'; note = 'Sehr kalt rühren oder shaken und ohne Eis servieren.'; }
  else if(text.includes('sour') || category.includes('sour')) { glass = 'Tumbler oder Coupette'; ice = 'Frisches Eis oder ohne Eis'; garnish = 'Zitruszeste'; note = 'Kräftig shaken. Bei Eiweiß zuerst dry shaken, dann mit Eis shaken.'; }
  else if(text.includes('highball') || text.includes('soda') || text.includes('tonic')) { glass = 'Highballglas'; ice = 'Viel klares Eis'; garnish = 'Zitruszeste oder Fruchtscheibe'; note = 'Direkt im Glas auf Eis bauen und vorsichtig verrühren.'; }
  else if(text.includes('negroni') || style.includes('aperitif') || category.includes('klassiker')) { glass = 'Tumbler'; ice = 'Großer Eiswürfel'; garnish = 'Orangenzeste'; note = 'Auf Eis rühren und mit aromatischer Zeste servieren.'; }
  else if(text.includes('tiki') || text.includes('tropical') || text.includes('tropisch')) { glass = 'Tiki Mug oder großes Glas'; ice = 'Crushed Ice'; garnish = 'Minze, Zitrus oder Frucht'; note = 'Kräftig shaken oder swizzlen und üppig garnieren.'; }
  else if(style.includes('dessert') || text.includes('cremig')) { glass = 'Coupette oder kleines Glas'; ice = 'Ohne Eis oder frisches Eis'; garnish = 'Muskat, Schokolade oder Zeste'; note = 'Cremig und sehr kalt servieren.'; }

  return { glass, ice, garnish, note };
}

function joinHuman(values){
  const list = arrayOf(values);
  if(list.length <= 1) return list[0] || '';
  if(list.length === 2) return `${list[0]} und ${list[1]}`;
  return `${list.slice(0,-1).join(', ')} und ${list[list.length-1]}`;
}

function escapeHtml(value){
  return String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}
