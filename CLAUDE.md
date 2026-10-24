# pelnia-webpage

Public website of Kościół Pełnia (Wieliczka) at kosciolpelnia.pl. Astro 7, static, Tailwind 4, Vercel. Read `CONTEXT.md` (vocabulary – use it exactly) and `docs/adr/` before changing things.

## Commands

Node comes from fnm (`eval "$(fnm env)"` in a fresh shell; Node 24).

- `npm run dev` – dev server on :4321 (the preview pane uses `.claude/launch.json`, name `pelnia-dev`)
- `npm run build` – static build into `dist/`, then `scripts/check-dist.mjs` (the rights gate, ADR-0003)
- `npm run check` – Astro/TypeScript diagnostics
- `npm test` – vitest unit tests (`src/lib/*.test.ts`)

## Rules

- Colours: only the brand tokens in `src/styles/global.css` (`zielen`, `bez`, `pomarancz`, `bursztyn`, `braz`, `bez-jasny`); Tailwind's default palette is switched off on purpose.
- Logo: only `<Logo />` (full lockup, `currentColor`). The logobook forbids the P alone, rearranged parts, effects and off-palette colours.
- Piosenki are read only through `publicSongs()` in `src/lib/catalog.ts`.
- Missing facts are `null` in `src/data/site.ts` and render through `<Brak co="…" />`; unapproved copy sits inside `<Szkic>`. Search for `Brak` / `Szkic` to see what is still open.
- No third-party embeds or cookies (maps are links, demos are self-hosted MP3s), so the site needs no cookie banner.
- Brand sources: `Pełnia/` (logo files) and `logobook.pdf` (179 MB, not in git, nor `Pełnia/do druku/`).
