# LISA inTec – neue Website

Statische Website (HTML, CSS, wenig JavaScript), läuft auf jedem Webhosting ohne Datenbank oder CMS.

## Dateien
- `index.html` – Startseite mit Leistungen, Zielgruppen, Ablauf, Über uns, Kontakt
- `impressum.html`, `datenschutz.html` – rechtliche Seiten
- `assets/styles.css`, `assets/main.js`, `assets/favicon.svg`
- `robots.txt`, `sitemap.xml`

## Vor dem Livegang ergänzen
1. **Logo:** Das Signet im Kopf ist ein Platzhalter (Faserquerschnitt). Das echte Logo als SVG/PNG in `assets/` legen und im `<a class="brand">` ersetzen.
2. **Impressum:** UID-Nummer (CHE-…) und vertretungsberechtigte Person(en) eintragen (Kommentar in `impressum.html`).
3. **Datenschutz:** Namen des Hosting-Anbieters ergänzen; Text bei Bedarf rechtlich prüfen lassen.
4. **Weiterleitungen** (301) von den alten Adressen, damit Google-Rankings erhalten bleiben:
   - `/dienstleistungen` → `/#leistungen`
   - `/kontakt` → `/#kontakt`
   - `/Impressum` → `/impressum.html`
   - `/datenschutzerklaerung` → `/datenschutz.html`
5. **Fotos (optional):** Eigene Baustellen-/Spleissfotos würden die Seite weiter aufwerten.
6. Google Search Console: `sitemap.xml` einreichen; Google-Unternehmensprofil mit gleicher Adresse/Telefonnummer pflegen.

## Was verbessert wurde
- Moderne, eigenständige Gestaltung mit Glasfaser-Farbkode als Leitmotiv, Hell- und Dunkelmodus
- Alles Wichtige auf einer Seite: weniger Klicks, klare Handlungsaufrufe (Anrufen, Anfragen)
- Voll responsiv, schnell (keine Bibliotheken, keine Tracker, keine Cookies)
- SEO: aussagekräftige Titel/Beschreibungen, strukturierte Daten (LocalBusiness mit Öffnungszeiten), Sitemap
- Barrierefreiheit: semantisches HTML, Tastaturbedienung, Sprunglink, reduzierte Bewegung respektiert
- Live-Anzeige «Jetzt erreichbar» nach Schweizer Zeit
