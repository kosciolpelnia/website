---
status: accepted
date: 2026-10-24
---

# Astro static site on Vercel, edited in Sanity

The site replaces a one-page Canva export. Content changes are rare except Piosenki, which the worship team (not developers) will add with PDFs being generated and MP3 demos uploaded. We chose **Astro**, built fully static and hosted on **Vercel**, with **Sanity** as the editing panel: editors sign in with Google or e-mail, files sit on Sanity's CDN, and a publish triggers a Vercel rebuild through a deploy hook. Static output is fast, free on both services' free tiers and has nothing to break into.

Rejected: a Git-based CMS (Keystatic, Decap) – MP3s would bloat the repository and editors would in practice need GitHub accounts; WordPress on the existing Hostinger plan – a familiar panel, but the upkeep and security patching land on volunteers.

## Consequences

- Sanity project `nzupjjh7`, dataset `production`, panel at https://kosciolpelnia.sanity.studio (source in `studio/`, deployed with `npm run deploy` there). The dataset is **private** – a public one would let anyone read songs without permission through the API (ADR-0003) – so the build reads it with a Viewer token, `SANITY_READ_TOKEN`, kept in 1Password (`env-pelna-webpage`) and in Vercel. Uploaded files and images stay public on Sanity's CDN.
- Piosenki come in through a custom content loader in `src/content.config.ts`, whose zod schema is the contract with `studio/schemas/piosenka.ts`. Ustawienia strony is the singleton document `ustawienia`, laid over the defaults in `src/data/site.ts` by `mergeSettings()`, so an empty panel field never breaks a page.
- Pages read Piosenki only through `src/lib/catalog.ts`, so the source can change in one place.
- The domain stays at Hostinger. Cutover changes only the A/CNAME records for the site; the MX and SPF records for the Hostinger mailbox (info@kosciolpelnia.pl) must stay as they are. The Canva site is switched off only after the new one is live.
- GitHub organisation, Vercel and Sanity accounts belong to a shared church address, with Daniel as admin, so the site does not depend on one person.
