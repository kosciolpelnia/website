---
status: accepted
date: 2026-10-24
---

# Only a Piosenka with Status praw „zgoda” exists on the public site

Translating and publishing someone else's song needs the rights holder's permission, which the Zbór has not started collecting yet. A song without permission must not appear at all – not as text, not as a „coming soon” title (a public list of unlicensed translations is itself a problem), and not in the PDF, `.txt` or sitemap. The team still sees every song in the panel.

This is enforced in code, not by convention:

1. `isPublic()` in `src/lib/songs.ts` lets only `zgoda` through, and `publicSongs()` in `src/lib/catalog.ts` is the only way pages read Piosenki.
2. `scripts/check-dist.mjs` runs after every `npm run build` and fails the build if any file name or any HTML/TXT/XML file in `dist/` carries the slug or title of a non-`zgoda` song.

## Consequences

- Every song carries its credits (original authors, publisher, CCLI, translators) on the page and in the PDF footer, and the texts are offered free for church use.
- Sample songs (`sample: true`) only warn in the post-build check; they must be deleted before go-live.
