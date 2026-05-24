# Hausbar Next v0.1

Neubau der Hausbar-App als saubere Basis.

## Grundsätze

- Keine Runtime-Hooks
- Keine Wrapper
- Keine versteckten Datenmigrationen beim Rendern
- Self-Excluding-Facets für Inventarfilter
- `Whisky` als einzige Hauptkategorie für Whisky/Whiskey
- `tags` wird nicht als primäres Logikfeld verwendet
- Flaschen-Detailstruktur für spätere Internetdaten vorbereitet

## Testplan

1. `index.html` öffnen.
2. Inventar öffnen.
3. `Filter löschen` drücken.
4. Prüfen, ob `Rauchig` im Geschmacksfilter sichtbar ist.
5. `Fruchtig` auswählen.
6. Geschmacksfilter sofort wieder öffnen.
7. `Rauchig` muss weiterhin sichtbar sein.
8. Kategorie-, Stil-, Nutzungs- und Herkunftsfilter testen.
9. Flasche antippen und Detailansicht prüfen.

## Dateien

- `index.html`
- `style.css`
- `app.js`
- `data.js`

Bewusst kein Service Worker in v0.1, um Cache-Probleme beim Testen zu vermeiden.
