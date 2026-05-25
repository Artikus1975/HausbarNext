# Hausbar Next v0.16 — Datenqualitäts-Audit

Basis: v0.16. Diese Version ist ein Audit-/Planungsstand. Die App-Logik wird nicht erweitert.

## Kurzfazit

Die Datenbasis ist nutzbar, aber noch nicht auf Barkarten-/Premium-Niveau. Viele Informationen sind intern hilfreich, aber die sichtbaren Beschreibungen müssen in späteren Enrichment-Batches deutlich professioneller kuratiert werden.

## Inventar

- Flaschen: 141
- Kategorien: 18
- Herkunftswerte: 13
- Geschmackswerte: 9
- Nutzungswerte: 10
- Flaschen ohne Herkunft: 90
- Flaschen ohne Beschreibung: 0
- Flaschen mit technischen/unschönen Beschreibungstexten: 1
- Flaschen mit Status "Unbekannt": 84
- Doppelte Display-Namen: 2

### Kategorien

- Aperitif / Bitter
- Bitters
- Cachaça
- Cognac / Brandy
- Edelbrand / Geist
- Garnish
- Gin
- Likör
- Pisco
- Rak? / Anis
- Rum
- Saft
- Sirup / Mixer
- Tequila
- Vermouth / Fortified Wine
- Vodka
- Wein
- Whisky

### Auffällige Inventar-Einträge (Auszug)

- Aperol (Aperitif / Bitter): technical-or-user-unfriendly-description, status unknown
- Aperitivo Bavarese (Aperitif / Bitter): status unknown
- Ramazzotti (Aperitif / Bitter): status unknown
- Celery Bitters (Bitters): empty:originTags, originTags missing
- Creole Bitters (Bitters): empty:originTags, originTags missing
- Peach Bitters (Bitters): empty:originTags, originTags missing, status unknown
- Old Town Decanter Bitters (Bitters): empty:originTags, originTags missing
- Old Time Aromatic Bitters (Bitters): empty:originTags, originTags missing
- Orange Bitters (Bitters): empty:originTags, originTags missing
- Angobitter (Bitters): empty:originTags, originTags missing, status unknown
- 1866 Brandy De Jerez Solero Grand Reserva (Cognac / Brandy): empty:originTags, originTags missing
- Kastaniengeist (Edelbrand / Geist): empty:originTags, originTags missing
- Edles Fass Nussler aus Wallnüssen (Edelbrand / Geist): empty:originTags, originTags missing, status unknown
- Walnussgeist (Edelbrand / Geist): empty:originTags, originTags missing, status unknown
- Pistaziengeist (Edelbrand / Geist): empty:originTags, originTags missing
- Haselnuss (Edelbrand / Geist): empty:originTags, originTags missing, status unknown
- Hauszwetschke (Edelbrand / Geist): empty:originTags, originTags missing, status unknown
- Kirsche (Edelbrand / Geist): empty:originTags, originTags missing, status unknown
- Marille (Edelbrand / Geist): empty:originTags, originTags missing, status unknown
- Alte Waldhimbeere (Edelbrand / Geist): empty:originTags, originTags missing, status unknown
- Alte Williams-Christ-Birne (Edelbrand / Geist): empty:originTags, originTags missing, status unknown
- Alter Bodensee-Apfel (Edelbrand / Geist): empty:originTags, originTags missing, status unknown
- Spätburgunder Trester (Edelbrand / Geist): empty:producer, empty:originTags, originTags missing, producer missing
- Maraschino Cherries (Garnish): empty:originTags, originTags missing
- Sapphire Premier Cru (Gin): empty:originTags, originTags missing, status unknown
- Fifty Pounds Gin (Gin): empty:originTags, originTags missing, status unknown
- Kyrö Gin (Gin): empty:originTags, originTags missing, status unknown
- Le Tribute Gin (Gin): empty:originTags, originTags missing, status unknown
- Needle Gin (Gin): empty:originTags, originTags missing, status unknown
- No.3 London Dry Gin (Gin): empty:originTags, originTags missing, status unknown
- Roku Japanese Craft Gin (Gin): status unknown
- Tanqueray London Dry Gin (Gin): empty:originTags, originTags missing, status unknown
- Tanqueray No. Ten (Gin): status unknown
- Ukiyo Blossom Gin (Gin): status unknown
- Ukiyo Nashi Pear Gin (Gin): status unknown
- Ukiyo Tokyo Dry Gin (Gin): status unknown
- Ukiyo Yuzu Gin (Gin): status unknown
- Ungava Canadian Premium Gin (Gin): empty:originTags, originTags missing
- Amarula (Likör): empty:originTags, originTags missing, status unknown
- Baileys (Likör): empty:originTags, originTags missing, status unknown

## Rezepte

- Rezepte: 88
- Stilrichtungen: 6
- Jahreszeiten: 5
- Rezepte ohne Beschreibung: 88
- Rezepte mit technischen/unschönen Beschreibungstexten: 0
- Rezepte ohne Glas: 88
- Rezepte ohne Garnish: 88
- Rezepte ohne Eis: 88
- Rezepte ohne Jahreszeit: 0
- Rezepte ohne Stilrichtung: 0

### Stilrichtungen

- Aperitif
- Cremig & Dessert
- Digestif
- Frisch & Sour
- Kräftig & Spirituosig
- Longdrink & Highball

### Jahreszeiten

- Frühling
- Ganzjährig
- Herbst
- Sommer
- Winter

### Auffällige Rezept-Einträge (Auszug)

- Kir: empty:flavorTags
- Kir Royale: empty:flavorTags

## Sichtbarkeit vs. interne Logik

Folgende Felder sollen intern erhalten bleiben, aber nicht automatisch im normalen Frontend sichtbar sein:

- technische Klassifikation
- Fallback-/Audit-Informationen
- leere Werte
- interne Rollen wie Barrolle oder Einsatzlogik
- doppelte Tag-Zusammenfassungen

Sichtbar sollten nur kuratierte, nutzerfreundliche Informationen sein: Beschreibung, Geschmack, Herkunft und Servierempfehlung.

## Empfohlene nächste Schritte

1. v0.17: Flaschen-Enrichment Batch 1 für Aperitif / Bitter / Vermouth.
2. v0.18: Rezept-Enrichment Batch 1 für Kernklassiker.
3. Danach erst weitere UI-Verdichtung oder Admin-/Auditmodus.

## Nicht gemacht

- Keine Internet-Recherche in diesem Audit.
- Keine Daten wurden gelöscht.
- Keine Filterlogik wurde geändert.
- Keine sichtbaren Features wurden ergänzt.
