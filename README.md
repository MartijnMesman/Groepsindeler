# Groepsindeler

## Doel

Een zelfstandige browserapp voor docenten om een namenlijst snel en willekeurig in evenwichtige groepen te verdelen.

## Functies

- Namen invoeren per regel, komma of puntkomma.
- Een maximale groepsgrootte van 2 tot en met 6 kiezen.
- Willekeurig indelen in groepen die hoogstens één persoon in grootte verschillen.
- De uitkomst presenteren als Festival DJ of Team Draft.
- De animatie pauzeren, hervatten of stoppen.
- De indeling als tekst kopiëren of als CSV downloaden.

## Privacy en opslag

De namen worden alleen in de browser verwerkt. De app verstuurt of bewaart geen namen.

## Bestanden

- `index.html` — interface en inhoud.
- `styles.css` — vormgeving, animaties en mobiele weergave.
- `app.js` — indeling, statusmeldingen en export.
- `CONTEXT.md`, `BESLUITEN.md`, `BOUW-projectlog.md` en `TESTPLAN.md` — projectkaders en voortgang.

## Status

De app is gekoppeld aan Vercel en de laatste build is gereed: https://groepsindeler.vercel.app

De Vercel-projectinstelling vereist team-SSO. Alleen gebruikers met toegang tot het Vercel-team kunnen de app nu openen. De GitHub-repository is openbaar. De bijgewerkte versie is nog niet opnieuw handmatig getest; zie `TESTPLAN.md`.
