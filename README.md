# Hausbar Next v0.13

Clean Public Detail Views fuer Murat's Hausbar.

## Zweck dieser Version

- Detailansichten fuer Flaschen und Rezepte ruhiger und nutzerfreundlicher machen
- interne/technische Informationen im Hintergrund behalten, aber nicht mehr prominent anzeigen
- doppelte Informationen reduzieren
- leere Felder nicht anzeigen
- keine Daten loeschen

## Geaendert

- Flaschendetail reduziert auf kuratierte Nutzerinformationen
- Barrolle/Profil/Einsatz-Kacheln aus der normalen Frontendansicht entfernt
- technische Hilfstexte aus Flaschendetails entfernt
- Status wird nicht mehr angezeigt, wenn er keinen Mehrwert bietet
- Rezeptdetail zeigt keine leeren Pflegefelder mehr
- Fallback-/Audit-Informationen bleiben in den Daten, werden aber nicht mehr in der normalen Ansicht gezeigt
- Rezeptbeschreibungen klingen weniger technisch und nicht mehr wie Datenbanktexte

## Nicht geaendert

- Inventarfilter
- Rauchig-/Self-Excluding-Facets
- Rezeptsuche und Rezeptfilter
- Tagescocktail
- Heute-passend-Menue
- Datenbestand
- keine Runtime-Hooks
- keine Wrapper
- kein Service Worker

## Dateien

- index.html
- style.css
- app.js
- data.js
- README.md
