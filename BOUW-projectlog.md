# Bouwprojectlog — Groepsindeler

## Project

Lokale browserapp voor docenten om een namenlijst willekeurig in evenwichtige groepen te verdelen. De namen blijven in de browser; er is geen centrale opslag.

## Bestaande uitgangssituatie

De app stond in `AI Apps/04 - Groepsindeler`. De oorspronkelijke versie bevatte een namenlijst, groepsgrootte 2–6, de presentatiestijlen Festival DJ en Team Draft, tekstuitvoer en CSV-export.

## Review en aanpassingen in de werkversie

- Pauzeren/hervatten zet nu de CSS-animaties stil en start ze weer.
- Animatie overslaan stopt alle CSS-animaties.
- Wijzigen van namen of groepsgrootte wist de oude uitkomst en schakelt export uit tot er opnieuw is ingedeeld.
- Kopiëren heeft een terugvalpad voor browsers waarin de Clipboard API niet beschikbaar is.
- Vervangen van vraagtekenpictogrammen, zichtbare toetsenbordfocus voor de presentatiestijlen en ondersteuning voor verminderde beweging toegevoegd.
- Verouderde Bingo-stijlen verwijderd; documentatie bijgewerkt naar de twee actuele presentatiestijlen.

## Verificatiestatus

De code en documentatie zijn statisch nagekeken. De eerdere browserproef op 21 november 2026 betrof de oorspronkelijke versie en geldt niet als verificatie van deze bijgewerkte werkversie. De volledige testmatrix en een nieuwe browserproef staan nog open; zie `TESTPLAN.md`.
