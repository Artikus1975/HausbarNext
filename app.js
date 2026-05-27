'use strict';

const APP_VERSION = (window.HB_DATA && HB_DATA.version) || 'v0.24';

const state = {
  view: 'home',
  search: '',
  filters: { category: '', flavor: '', usage: '', style: '', origin: '' },
  recipeSearch: '',
  recipeFilters: { season: '', style: '' }
};

const CATEGORY_FACETS = [
  'Aperitif / Bitter','Bitters','Brandy','Cognac','Edelbrand / Geist','Garnish','Gin','Likör','Pisco','Rakı / Anis','Rum / Cachaça','Saft','Sirup / Mixer','Tequila','Vermouth / Fortified Wine','Wein / Champagner','Vodka','Whisky'
];

const FILTER_FACETS = {
  category: CATEGORY_FACETS,
  flavor: ['Bitter','Fruchtig','Kräuterig','Floral','Rauchig','Süß','Trocken','Zitrisch','Nussig','Kaffee'],
  usage: ['Aperitif','Cocktailbasis','Digestif','Frisch & Sour','Longdrink & Highball','Modifier','Pur','Spirit-Forward','Spritz','Tiki & Tropical'],
  style: ['Klassisch','Modern','Elegant','Kräftig','Leicht','Komplex','Frisch','Herb','Süßlich','Tropisch','Würzig','Dessert','Premium / Sipping']
};

const COUNTRY_FACETS = [
  'Barbados','Brasilien','Deutschland','England','Finnland','Frankreich','Italien','Jamaika','Japan','Kanada','Niederlande','Peru','Portugal','Schottland','Spanien','Trinidad und Tobago','Türkei','USA'
];

const FACET_ALIASES = {
  flavor: {
    'orange':['Zitrisch','Fruchtig'],'zitrone':'Zitrisch','zitronig':'Zitrisch','limette':'Zitrisch','mandarine':['Zitrisch','Fruchtig'],'grapefruit':['Zitrisch','Bitter'],'yuzu':'Zitrisch','bergamotte':'Zitrisch','zitrus':'Zitrisch',
    'birne':'Fruchtig','apfel':'Fruchtig','beere':'Fruchtig','beeren':'Fruchtig','kirsche':'Fruchtig','pflaume':'Fruchtig','pfirsich':'Fruchtig','steinfrucht':'Fruchtig','tropisch':'Fruchtig','sakura':'Floral','rose':'Floral',
    'anis':'Kräuterig','wacholder':'Kräuterig','kräuter':'Kräuterig','kraeuter':'Kräuterig','botanicals':'Kräuterig','minze':'Kräuterig','wermut':'Kräuterig','aromatisch':'Kräuterig','harzig':'Kräuterig','vegetal':'Kräuterig','gurke':'Kräuterig','frisch':'Zitrisch',
    'rauch':'Rauchig','torf':'Rauchig','torfig':'Rauchig',
    'schokolade':'Süß','kakao':'Süß','vanille':'Süß','karamell':'Süß','honig':'Süß','warm':'Süß','scharf':'Kräuterig',
    'mandel':'Nussig','nuss':'Nussig','nussig':'Nussig','kaffee':'Kaffee','espresso':'Kaffee','trocken':'Trocken','herb':'Bitter','dunkel':'Bitter','erdig':'Kräuterig','pfeffer':'Kräuterig','pfeffrig':'Kräuterig','zimt':'Kräuterig','nelke':'Kräuterig','ingwer':'Kräuterig','gewürz':'Kräuterig','gewuerz':'Kräuterig','würzig':'Kräuterig'
  },
  usage: {
    'aperitif':'Aperitif','amaro-cocktails':'Aperitif','americano':'Aperitif','anis-serve':'Aperitif','bloody mary':'Cocktailbasis','brandy cocktail':'Cocktailbasis','cocktail-klassiker':'Cocktailbasis','cocktailbasis':'Cocktailbasis','gin-cocktails':'Cocktailbasis','rum-drinks':'Cocktailbasis','vermouth-cocktails':'Cocktailbasis','champagner-cocktails':'Cocktailbasis','port-cocktails':'Cocktailbasis','sherry-cocktails':'Cocktailbasis',
    'digestif':'Digestif','dessert':'Digestif','dessertdrink':'Digestif','sour':'Frisch & Sour','frisch & sour':'Frisch & Sour','daiquiri':'Frisch & Sour','margarita':'Frisch & Sour','gimlet':'Frisch & Sour','white lady':'Frisch & Sour','collins':'Longdrink & Highball','fizz':'Longdrink & Highball','gin & tonic':'Longdrink & Highball','gin tonic':'Longdrink & Highball','highball':'Longdrink & Highball','longdrink':'Longdrink & Highball','tonic':'Longdrink & Highball','mule':'Longdrink & Highball','filler':'Longdrink & Highball','highball-akzent':'Longdrink & Highball','hugo-twist':'Longdrink & Highball','french 75':'Longdrink & Highball',
    'modifier':'Modifier','martini-twist':'Modifier','old fashioned':'Spirit-Forward','manhattan':'Spirit-Forward','martini':'Spirit-Forward','negroni':'Spirit-Forward','spirit-forward':'Spirit-Forward','pur':'Pur','sipping':'Pur','spritz':'Spritz','tiki':'Tiki & Tropical','tropical':'Tiki & Tropical','tiki & tropical':'Tiki & Tropical'
  },
  style: {
    'klassisch':'Klassisch','classic':'Klassisch','london dry':'Klassisch','dry gin':'Klassisch','dry vermouth':'Klassisch','rye whiskey':'Klassisch','scotch':'Klassisch','bourbon':'Klassisch','white rum':'Klassisch','dark rum':'Klassisch','cognac':'Klassisch','brandy':'Klassisch','vodka':'Klassisch','tequila':'Klassisch','pisco puro':'Klassisch','queebranta':'Klassisch','quebranta':'Klassisch',
    'modern':'Modern','new western':'Modern','japanese gin':'Modern','nordic gin':'Modern','canadian gin':'Modern','botanical gin':'Modern','fruit-forward gin':'Modern','citrus gin':'Modern','herbal gin':'Modern','rye gin':'Modern','premium gin':'Modern','japanese whisky':'Modern',
    'elegant':'Elegant','französisch':'Elegant','mediterran':'Elegant','floral':'Elegant','fruchtig-floral':'Elegant','moscatel':'Elegant','wine':'Elegant','fortified wine':'Elegant','tawny port':'Elegant','px sherry':'Dessert','red vermouth':'Elegant',
    'kräftig':'Kräftig','kraeftig':'Kräftig','intensiv':'Kräftig','creole':'Kräftig','aromatic bitters':'Kräftig','cocktail bitters':'Kräftig','bitter aperitif':'Herb','amaro':'Herb','absinthe':'Herb','pastis':'Herb','anis aperitif':'Herb','savory':'Herb','trocken':'Herb','aromatisch':'Herb','herb':'Herb',
    'leicht':'Leicht','sommerlich':'Frisch','frisch':'Frisch','zitrisch':'Frisch','zitronenlikör':'Frisch','juice':'Frisch','mixer':'Frisch','ginger beer':'Frisch','universal':'Frisch',
    'komplex':'Komplex','rund':'Komplex','aromatic':'Komplex','single malt':'Komplex','premium rum':'Premium / Sipping','sipping':'Premium / Sipping','tropisch':'Tropisch','tropical modifier':'Tropisch','cachaça':'Tropisch','sugarcane spirit':'Tropisch','rum':'Tropisch',
    'würzig':'Würzig','wuerzig':'Würzig','süßlich':'Süßlich','suesslich':'Süßlich','likör':'Süßlich','liqueur':'Süßlich','orange liqueur':'Süßlich','nut liqueur':'Süßlich','chocolate liqueur':'Dessert','cream liqueur':'Dessert','coffee liqueur':'Dessert','dessert':'Dessert','digestif':'Dessert'
  },
  origin: {
    'bayern':'Deutschland','schwarzwald':'Deutschland','deutschland':'Deutschland',
    'chiba':'Japan','japan':'Japan','douro':'Portugal','portugal':'Portugal','jerez':'Spanien','murcia':'Spanien','spanien':'Spanien','katalonien':'Spanien',
    'london':'England','england':'England','finnland':'Finnland','frankreich':'Frankreich','marseillan':'Frankreich','cognac':'Frankreich','bordeaux':'Frankreich',
    'italien':'Italien','padua':'Italien','mailand':'Italien','sizilien':'Italien','kanada':'Kanada','québec':'Kanada','quebec':'Kanada',
    'niederlande':'Niederlande','peru':'Peru','barbados':'Barbados','brasilien':'Brasilien','jamaika':'Jamaika','schottland':'Schottland','islay':'Schottland','speyside':'Schottland','trinidad und tobago':'Trinidad und Tobago','türkei':'Türkei','tuerkei':'Türkei','usa':'USA','kentucky':'USA'
  }
};
const inventory = HB_DATA.inventory.map(normalizeItem);
const recipes = HB_DATA.recipes || [];
const taxonomy = HB_DATA.taxonomies || {};


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

  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-open-recipe-id]');
    if(!trigger) return;
    event.preventDefault();
    event.stopPropagation();
    openRecipe(trigger.dataset.openRecipeId);
  });
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
  normalized.category = canonicalCategory(normalized);
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
  if(filters.flavor && !facetContains(item, 'flavor', filters.flavor)) return false;
  if(filters.usage && !facetContains(item, 'usage', filters.usage)) return false;
  if(filters.style && !facetContains(item, 'style', filters.style)) return false;
  if(filters.origin && !facetContains(item, 'origin', filters.origin)) return false;
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
  if(filterName === 'category') return CATEGORY_FACETS;
  if(filterName === 'origin') return uniqueSorted(source.map(countryFacet).filter(Boolean));
  if(FILTER_FACETS[filterName]) return FILTER_FACETS[filterName];
  return [];
}

function canonicalCategory(item){
  const category = String(item.category || '').trim();
  const subcategory = String(item.subcategory || '').trim();
  const name = String(item.name || '').trim();
  const lower = `${category} ${subcategory} ${name}`.toLowerCase();
  if(category === 'Whiskey') return 'Whisky';
  if(category === 'Rum' || category === 'Cachaça') return 'Rum / Cachaça';
  if(category === 'Cognac / Brandy') {
    const detail = `${subcategory} ${name}`.toLowerCase();
    return detail.includes('cognac') ? 'Cognac' : 'Brandy';
  }
  if(category === 'Vermouth / Fortified Wine') return 'Vermouth / Fortified Wine';
  if(category === 'Wein' || category === 'Wine') return 'Wein / Champagner';
  if(category === 'Tequila / Mezcal') return 'Tequila';
  if(CATEGORY_FACETS.some(value => sameValue(value, category))) return CATEGORY_FACETS.find(value => sameValue(value, category));
  return category || 'Unkategorisiert';
}

function countryFromOriginTag(value){
  const raw = String(value || '').trim();
  if(!raw) return '';
  const direct = COUNTRY_FACETS.find(country => sameValue(country, raw));
  if(direct) return direct;
  return FACET_ALIASES.origin?.[raw.toLowerCase()] || '';
}

function countryFacet(item){
  for(const value of arrayOf(item.originTags)){
    const country = countryFromOriginTag(value);
    if(country) return country;
  }
  return '';
}

function facetContains(item, filterName, selected){
  if(!selected) return true;
  return displayFacetValues(item, filterName).some(value => sameValue(value, selected));
}

function displayFacetValues(item, filterName){
  if(filterName === 'origin') return countryFacet(item) ? [countryFacet(item)] : [];
  const canonical = FILTER_FACETS[filterName] || [];
  let raw = [];
  if(filterName === 'flavor') raw = item.flavorTags;
  if(filterName === 'usage') raw = item.usageTags;
  if(filterName === 'style') raw = [...item.styleTags, item.category, item.subcategory];
  const result = new Set();
  arrayOf(raw).forEach(value => {
    const direct = canonical.find(c => sameValue(c, value));
    if(direct) result.add(direct);
    const key = String(value || '').toLowerCase().trim();
    const aliases = arrayOf(FACET_ALIASES[filterName]?.[key]);
    aliases.forEach(alias => {
      if(alias && canonical.some(c => sameValue(c, alias))) result.add(alias);
    });
  });
  return canonical.filter(v => result.has(v));
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
  const safeOptions = arrayOf(options);
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
  const tags = [...displayFacetValues(item, 'flavor').slice(0,3), ...displayFacetValues(item, 'usage').slice(0,2)].slice(0,5);
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
  els.detailCategory.textContent = item.category || ''; // reduzierte Kopfzeile: keine doppelte Unterkategorie im Hero
  const desc = item.description || {};
  const descriptionText = cleanBottleDisplayText(desc.short || desc.long || bottlePublicDescription(item));
  const leadingTags = uniqueList([...displayFacetValues(item, 'flavor').slice(0,4), ...displayFacetValues(item, 'usage').slice(0,2)]).filter(Boolean).slice(0,6);
  const originText = countryFacet(item);

  els.detailBody.innerHTML = `
    <div class="bottle-hero-detail premium-bottle-hero clean-public-hero bottle-public-card">
      <div class="bottle-hero-copy">
        <p class="eyebrow">Flaschenprofil</p>
        <h3>${escapeHtml(item.name)}</h3>
        <p>${escapeHtml(descriptionText)}</p>
        ${leadingTags.length ? `<div class="signature-strip">${leadingTags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
      </div>
      ${originText ? `<div class="quiet-meta"><span>Herkunft</span><strong>${escapeHtml(originText)}</strong></div>` : ''}
    </div>

    ${item.notes ? `<div class="detail-section"><h3>Notizen</h3><p>${escapeHtml(cleanBottleDisplayText(item.notes))}</p></div>` : ''}
  `;
  els.dialog.showModal();
}


function cleanBottleDisplayText(text){
  let value = String(text || '').trim();
  if(!value) return '';
  const removePatterns = [
    /\s*;?\s*nicht als [^.?!]*(?:[.?!]|$)/gi,
    /\s*;?\s*keine? [^.?!]*klassifiziert(?:[.?!]|$)/gi,
    /\s*;?\s*als [^.?!]*eingestuft(?:[.?!]|$)/gi,
    /\s*;?\s*für spätere [^.?!]*(?:[.?!]|$)/gi,
    /\s*;?\s*eine ausführliche[^.?!]*(?:[.?!]|$)/gi,
    /\s*;?\s*noch offen[^.?!]*(?:[.?!]|$)/gi
  ];
  removePatterns.forEach(pattern => { value = value.replace(pattern, ''); });
  value = value.replace(/\s+([,.;:!?])/g, '$1').replace(/\s{2,}/g, ' ').trim();
  if(value && !/[.!?]$/.test(value)) value += '.';
  return value || 'Eine kuratierte Beschreibung wird ergänzt.';
}

function uniqueList(values){
  const seen = new Set();
  return arrayOf(values).filter(value => {
    const key = String(value || '').toLowerCase().trim();
    if(!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function bottlePublicDescription(item){
  const origin = countryFacet(item);
  const flavors = item.flavorTags.slice(0,3).join(', ');
  const uses = item.usageTags.slice(0,2).join(' und ');
  const intro = [origin, item.category].filter(Boolean).join(' · ');
  const parts = [];
  if(intro) parts.push(intro);
  if(flavors) parts.push(`mit ${flavors}em Profil`);
  if(uses) parts.push(`besonders passend für ${uses}`);
  return parts.length ? `${parts.join(' – ')}.` : 'Beschreibung wird später kuratiert ergänzt.';
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
  const origin = countryFacet(item) ? ` aus ${countryFacet(item)}` : '';
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
  const values = arrayOf(tags);
  if(!values.length) return '';
  return `<div class="detail-section tag-section"><h3>${escapeHtml(title)}</h3>${helper ? `<p class="section-helper">${escapeHtml(helper)}</p>` : ''}<div class="tag-row">${values.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div></div>`;
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
    els.dailyDrinkCard.dataset.openRecipeId = daily.id;
  }
  const menu = getTodayMenu();
  els.todayMenuGrid.innerHTML = menu.map(renderHomeMenuItem).join('') || '<p class="empty">Noch keine Empfehlungen vorhanden.</p>';
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
  return `<button class="home-menu-item" data-open-recipe-id="${escapeHtml(recipe.id)}" type="button">
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
  return `<button class="item-card recipe-card" data-recipe-id="${escapeHtml(recipe.id)}" data-open-recipe-id="${escapeHtml(recipe.id)}">
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
  els.recipeDetailCategory.textContent = compactRecipeMeta(recipe);
  const ingredients = arrayOf(recipe.ingredients);
  const instructions = arrayOf(recipe.instructions);
  const serving = recipeServingMeta(recipe);
  els.recipeDetailBody.innerHTML = `
    <div class="detail-section highlight-section"><h3>Beschreibung</h3><p>${escapeHtml(recipeLongDescription(recipe))}</p></div>
    <div class="detail-section"><h3>Zutaten</h3>${ingredients.length ? `<ul class="clean-list ingredient-list">${ingredients.map(i => `<li><span>${escapeHtml(i)}</span></li>`).join('')}</ul>` : '<p class="empty">Keine Zutaten hinterlegt.</p>'}</div>
    <div class="detail-section"><h3>Zubereitung</h3>${instructions.length ? `<ol class="clean-list step-list">${instructions.map(step => `<li>${escapeHtml(step)}</li>`).join('')}</ol>` : '<p class="empty">Keine Zubereitung hinterlegt.</p>'}</div>
    <div class="recipe-meta-grid compact-recipe-meta">
      ${recipeMetaTile('Stärke', recipeStrengthLabel(recipe.strength))}
      ${recipeMetaTile('Glas', serving.glass)}
      ${recipeMetaTile('Eis', serving.ice)}
      ${recipeMetaTile('Garnish', serving.garnish)}
    </div>
  `;
  els.recipeDialog.showModal();
}

function compactRecipeMeta(recipe){
  const values = [recipe.category, recipe.style].filter(Boolean);
  return Array.from(new Set(values)).slice(0,2).join(' · ');
}

function recipeMetaTile(label, value){
  return `<div class="recipe-meta-tile"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function recipeShortDescription(recipe){
  const flavors = arrayOf(recipe.flavorTags).slice(0,2).join(' und ');
  const style = recipe.style || recipe.category || 'Cocktail';
  if(flavors) return `${style} mit ${flavors}em Profil.`;
  if(recipe.strength) return `${style}, ${recipeStrengthLabel(recipe.strength).toLowerCase()}.`;
  return `${style} für die Hausbar.`;
}

function recipeLongDescription(recipe){
  const name = String(recipe.name || '').toLowerCase();
  const style = String(recipe.style || recipe.category || 'Cocktail');
  const flavors = arrayOf(recipe.flavorTags).map(v => String(v).toLowerCase());
  const profile = flavors.slice(0,2).join(' und ');

  if(name.includes('negroni')) return 'Ein kräftiger, bitter-süßer Aperitif mit Gin, Campari und rotem Vermouth. Klar, herb und elegant – ein Klassiker für den frühen Abend.';
  if(name.includes('old fashioned')) return 'Ein ruhiger, spirituoser Klassiker mit Tiefe, feiner Süße und aromatischer Bitterkeit. Ideal für langsames Trinken und klare Bar-Momente.';
  if(name.includes('sour')) return 'Ein frischer, balancierter Sour mit lebendiger Säure, feiner Süße und klarer Struktur.';
  if(name.includes('spritz')) return 'Ein leichter, prickelnder Aperitif mit frischer Bitterkeit und sommerlicher Leichtigkeit.';
  if(name.includes('martini')) return 'Ein klarer, eleganter Drink mit trockener Struktur und präzisem, kühlem Charakter.';
  if(name.includes('sazerac')) return 'Ein intensiver, würziger Klassiker mit Tiefe, Kräuteranklang und trockenem Finish.';

  if(profile) return `Ein ${style.toLowerCase()} mit ${profile}em Charakter. Ausgewogen, klar und passend für einen stilvollen Bar-Moment.`;
  return `Ein ${style.toLowerCase()} mit klarer Struktur und ausgewogenem Charakter.`;
}

function recipeStrengthLabel(value){
  const clean = String(value || '').trim();
  if(!clean) return 'Noch nicht eingeordnet';
  const lower = clean.toLowerCase();
  if(lower.includes('stark') || lower.includes('kräftig')) return 'kräftig';
  if(lower.includes('mittel')) return 'mittelkräftig';
  if(lower.includes('leicht')) return 'leicht';
  return clean;
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
