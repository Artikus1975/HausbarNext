# Hausbar Next v0.21

Korrektur nach v0.18: Die Datenanreicherung bleibt erhalten, aber die sichtbaren Inventar-Filter werden wieder auf kontrollierte, nutzerfreundliche Facetten begrenzt.

## Zweck dieser Version

- keine ausufernden Geschmacksfilter wie einzelne Botanicals, Früchte oder Detailnoten
- keine ausufernden Nutzungs- und Stilfilter
- Herkunftsfilter zeigt nur noch die Haupt-Herkunft, nicht Regionen/Orte/Dörfer
- detaillierte Tags bleiben intern für Suche, Beschreibung und spätere Intelligenz erhalten
- Inventar bleibt übersichtlich für den Nutzer

## Nicht geändert

- keine Änderung an der Grundlogik der App
- keine Änderung am Rauchig-Prinzip
- keine UI-Experimente
- keine neuen Daten-Enrichment-Batches
- keine Runtime-Hooks, keine Wrapper, kein Service Worker

## Upload

Die fünf App-Dateien ersetzen:

- index.html
- style.css
- app.js
- data.js
- README.md

Testlink:

https://artikus1975.github.io/HausbarNext/?v=019


## v0.21

Controlled Inventory Filter Taxonomy: sichtbare Inventarfilter sind auf kuratierte Hauptwerte begrenzt. Interne Detailtags bleiben erhalten, erscheinen aber nicht als Filteroptionen. Herkunftsfilter zeigt nur Länder.


## v0.21

- Inventar-Flaschendetails zeigen den Bereich „Servieren“ nicht mehr an.
- Servierdaten bleiben intern in den Daten erhalten.
- Keine Änderung an Filtern, Rezepten, Tagescocktail oder Datenanreicherung.
