# Hausbar Next v0.2

Saubere Neubau-Basis fuer Murat's Hausbar.

## Zweck dieser Version

- Datenbasis aus v0.1 korrigiert
- kanonische Taxonomie fuer Geschmacks- und Nutzungsfilter ergaenzt
- `Rauchig` ist im Geschmacksfilter sichtbar, auch wenn die aktuelle Inventardatenbasis noch keine rauchige Flasche enthaelt
- Self-Excluding-Facets bleiben erhalten
- Keine Runtime-Hooks
- Keine Wrapper
- Kein Service Worker
- Kein Cache-Zwang

## Dateien

- `index.html`
- `style.css`
- `app.js`
- `data.js`
- `README.md`

## Testfokus

1. Inventar oeffnen.
2. Filter loeschen.
3. Geschmacksfilter oeffnen: `Rauchig` muss sichtbar sein.
4. `Fruchtig` auswaehlen.
5. Geschmacksfilter erneut oeffnen: `Rauchig` muss weiterhin sichtbar sein.
6. Kategorie, Stil, Nutzung und Herkunft einzeln testen.
7. Eine Flasche antippen und Detailansicht pruefen.
