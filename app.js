'use strict';

const APP_VERSION = (window.HB_DATA && HB_DATA.version) || 'v0.3';

const state = {
  view: 'home',
  search: '',
  filters: { category: '', flavor: '', usage: '', style: '', origin: '' },
  recipeSearch: ''
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
  els.recipeCount = document.getElementById('recipeCount');
  els.recipeGrid = document.getElementById('recipeGrid');
  els.dialog = document.getElementById('itemDialog');
  els.closeDialog = document.getElementById('closeDialog');
  els.detailName = document.getElementById('detailName');
  els.detailCategory = document.getElementById('detailCategory');
  els.detailBody = document.getElementById('detailBody');
}

function bindEvents(){
  els.navButtons.forEach(btn => btn.addEventListener('click', () => setView(btn.dataset.view)));
  els.searchInput.addEventListener('input', e => { state.search = e.target.value.trim().toLowerCase(); renderInventory(); });
  els.categoryFilter.addEventListener('change', e => setFilter('category', e.target.value));
  els.flavorFilter.addEventListener('change', e => setFilter('flavor', e.target.value));
  els.usageFilter.addEventListener('change', e => setFilter('usage', e.target.value));
  els.styleFilter.addEventListener('change', e => setFilter('style', e.target.value));
  els.originFilter.addEventListener('change', e => setFilter('origin', e.target.value));
  els.resetFilters.addEventListener('click', resetFilters);
  els.recipeSearch.addEventListener('input', e => { state.recipeSearch = e.target.value.trim().toLowerCase(); renderRecipes(); });
  els.closeDialog.addEventListener('click', () => els.dialog.close());
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
  els.detailBody.innerHTML = `
    <div class="detail-section"><h3>Beschreibung</h3><p>${escapeHtml(desc.short || 'Noch keine kuratierte Beschreibung vorhanden. Das Feld ist für spätere Kurationsdaten vorbereitet.')}</p></div>
    ${detailTags('Geschmack', item.flavorTags)}
    ${detailTags('Nutzung', item.usageTags)}
    ${detailTags('Stil', item.styleTags)}
    ${detailTags('Herkunft', item.originTags)}
    <div class="detail-section"><h3>Servieridee</h3><p class="empty">Für spätere Internet-/Kurationsdaten vorbereitet.</p></div>
    ${item.notes ? `<div class="detail-section"><h3>Notizen</h3><p>${escapeHtml(item.notes)}</p></div>` : ''}
  `;
  els.dialog.showModal();
}

function detailTags(title, tags){
  return `<div class="detail-section"><h3>${escapeHtml(title)}</h3><div class="tag-row">${tags.length ? tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('') : '<span class="empty">Noch leer</span>'}</div></div>`;
}

function renderHome(){
  const categories = new Set(inventory.map(i => i.category));
  const origins = new Set(inventory.flatMap(i => i.originTags));
  els.homeStats.innerHTML = [
    ['Flaschen', inventory.length], ['Rezepte', recipes.length], ['Kategorien', categories.size], ['Herkünfte', origins.size]
  ].map(([label,value]) => `<div class="stat"><strong>${value}</strong><span>${label}</span></div>`).join('');
}

function renderRecipes(){
  const query = state.recipeSearch;
  const list = recipes.filter(r => !query || [r.name, r.category, r.style, ...(r.ingredients||[])].join(' ').toLowerCase().includes(query));
  els.recipeCount.textContent = `${list.length} von ${recipes.length} Rezepten`;
  els.recipeGrid.innerHTML = list.map(renderRecipeCard).join('') || '<p class="empty">Keine Rezepte gefunden.</p>';
}

function renderRecipeCard(recipe){
  const tags = [recipe.category, recipe.style, recipe.strength].filter(Boolean).slice(0,4);
  return `<article class="item-card"><h3>${escapeHtml(recipe.name)}</h3><p class="meta">${escapeHtml((recipe.ingredients || []).slice(0,4).join(' · '))}</p><div class="tag-row">${tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join('')}</div></article>`;
}

function escapeHtml(value){
  return String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}
