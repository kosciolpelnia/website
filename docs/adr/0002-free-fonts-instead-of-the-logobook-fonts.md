---
status: accepted
date: 2026-10-24
---

# Free Google fonts stand in for the logobook's paid fonts

The logobook (2026, by Sofiia Gavrylova) sets headings in Aktiv Grotesk Extended, body in Aktiv Grotesk (both Dalton Maag) and the logotype in Moront (Foxtype). None is free: a web licence for the three Aktiv styles is about £95 + VAT and Moront about $29, with desktop licences on top, and the Zbór owns none. Moront's Polish glyph coverage is also unconfirmed.

We use free, self-hosted (Fontsource, no Google CDN and so no third-party request) look-alikes with full Polish support: **Archivo** at 125% width for headings (uppercase), **Inter** for body, **Rubik Black** for display accents. The logo is always the outlined SVG, never re-typed.

## Consequences

- The three families are declared once, as `--font-naglowek`, `--font-tekst` and `--font-akcent` in `src/styles/global.css`. Buying the licences later means adding the WOFF2 files and changing those three lines.
- Headings drop to 105% width below 40rem, because long Polish words such as „ZIELONOŚWIĄTKOWCY” do not fit a phone at 125%.
- The song PDF embeds Inter and Rubik TTFs from `@expo-google-fonts/*` (Fontsource ships only per-subset WOFF2). Inter is embedded whole: pdf-lib's subsetter drops its glyphs.
