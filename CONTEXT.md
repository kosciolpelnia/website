# Kościół Pełnia – strona

The public website of Kościół Zielonoświątkowy Zbór „Pełnia” w Wieliczce, at kosciolpelnia.pl: a church card, pages about who we are, what we believe, Sunday and giving, and a library of Polish worship-song translations other churches may use for free. Polish only for now; English would live under `/en`.

## Language

**Zbór**:
The local congregation, Pełnia in Wieliczka: a zbór of Kościół Zielonoświątkowy w RP (KZ). Its legal name is „Kościół Zielonoświątkowy Zbór „Pełnia” w Wieliczce”; „Kościół Pełnia” is the everyday name.
_Avoid_: parafia, wspólnota (as a proper name), KDM Wieliczka (the old name in the Facebook URL)

**KZ**:
Kościół Zielonoświątkowy w RP, the denomination. Its confession (kz.pl/wyznanie-wiary) is the source for „W co wierzymy”; the site summarises it in its own words and links the original.

**Nabożeństwo**:
The Sunday service, 11:30 at ul. Stefana Batorego 7. Preceded by kawa at 11:15 and followed by czas razem from 12:30.
_Avoid_: msza, spotkanie (as the name of the service)

**Kościół dziecięcy**:
Everything for children on Sunday, one entry per age group in Ustawienia strony: the **Kącik zabaw** (under 3, in the hall for the whole Nabożeństwo, next to the parents) and the **Zajęcia dla dzieci** (from 3, during the sermon, with opiekunowie). Families with children are the Zbór's main audience, so this block stands high on both the home and the Sunday page.
_Avoid_: szkółka niedzielna

**Siedziba**:
The Zbór's registered address (ul. Stefana Batorego 7, 32-020 Wieliczka), the same building as the Nabożeństwo. Used in the privacy policy; NIP 6832152982.

**Pastorzy**:
Daniel i Nastia, who lead the Zbór. Shown by first names only.

**Piosenka**:
One Polish translation of a worship song, with its section-structured lyrics, credits (original title, original authors, publisher, CCLI number, translators), an optional Demo, a generated PDF and the ProPresenter export. Only translations for now; own songs and paid extras (akordy, multitracki) may come later.
_Avoid_: pieśń in code identifiers (fine in copy), utwór, track

**Status praw**:
Where a Piosenka stands with the original rights holder: `brak` (nothing asked), `w-trakcie` (asked), `zgoda` (permission granted). Only `zgoda` is ever public (ADR-0003).

**Sekcja**:
A labelled block of a Piosenka's lyrics: Zwrotka N, Przedrefren, Refren, Bridge (Mostek), Intro, Zakończenie. Written in the source as `[Refren]` on its own line.

**Album**:
The original release a Piosenka comes from: title, artist, year and a cover image (Sanity document `album`, referenced by the song). One cover serves every song from the same release. Covers are copyrighted too, so ask for them with the translation permission.

**Demo**:
An MP3 recording of the Polish version, played by the site's own player. Never an external embed.

**Eksport do ProPresentera**:
The lyrics as plain text, slides separated by a blank line, N lines per slide (2 or 4), each Sekcja optionally headed by its label in English (ProPresenter turns Verse/Chorus/Bridge into slide groups), Polish, or none. Copied from the song page or downloaded as `.txt`.

**Darowizna**:
A gift to the Zbór, for a named cel (Dziesięcina, Ofiara, or a one-off zbiórka added in the panel): a bank transfer (account, title, ZBP transfer QR code) or online through the existing Stripe Payment Link. Titles start with „Darowizna na cele kultu religijnego” so donors can deduct it in PIT; the QR code carries that full title although ZBP recommends 32 characters (the Zbór chose the full PIT wording), and leaves the NIP slot empty because a code starting with digits makes phone cameras offer a phone call.
_Avoid_: datek, opłata, składka

**Ustawienia strony**:
The facts shown across pages: address, times, Pastorzy, bank data, contact links. In `src/data/site.ts` today; a Sanity singleton later (ADR-0001). A `null` there renders as a visible „DO UZUPEŁNIENIA” mark.

**Szkic**:
Copy drafted for the Zbór that the pastors have not approved yet, wrapped in `<Szkic>` so it shows as such. Approving it means removing the wrapper.
