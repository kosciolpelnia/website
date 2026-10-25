// Zdjęcia: every photo slot on the site, in one list shared by the pages and the Sanity panel
// (studio/schemas/ustawienia.ts). The shot list for photographers is docs/zdjecia.md.

export interface PhotoSlot {
  /** Field name in Ustawienia strony → zdjecia. */
  key: string;
  /** Panel label and placeholder caption. */
  label: string;
  /** Where it shows up. */
  page: string;
  /** What the photo should show, for whoever takes it. */
  brief: string;
  /** Width / height of the crop the page uses. */
  aspect: [number, number];
}

export const photoSlots = [
  {
    key: 'glowna',
    label: 'Uwielbienie na nabożeństwie',
    page: 'Strona główna, obok hasła',
    brief: 'Ludzie w trakcie uwielbienia, zespół w tle, ciepłe światło. Bardziej twarze i ręce niż scena.',
    aspect: [4, 5],
  },
  {
    key: 'dzieci',
    label: 'Dzieci na zajęciach',
    page: 'Strona główna i niedziela: sekcja dla rodzin',
    brief: 'Dzieci przy zajęciach lub w kąciku zabaw, z opiekunem. Tylko za pisemną zgodą rodziców, najlepiej bez twarzy w zbliżeniu.',
    aspect: [4, 3],
  },
  {
    key: 'wejscie',
    label: 'Wejście do budynku przy Batorego 7',
    page: 'Twoja pierwsza niedziela, „Gdzie”',
    brief: 'Budynek i wejście z perspektywy przechodnia, z widocznym szyldem lub numerem. Pomaga trafić za pierwszym razem.',
    aspect: [3, 2],
  },
  {
    key: 'kawa',
    label: 'Kawa i rozmowy',
    page: 'Twoja pierwsza niedziela, przebieg',
    brief: 'Ludzie przy kawie przed lub po nabożeństwie, śmiech, rozmowy w małych grupach.',
    aspect: [3, 2],
  },
  {
    key: 'spolecznosc',
    label: 'Cały kościół razem',
    page: 'Kim jesteśmy, pod nagłówkiem',
    brief: 'Wspólne zdjęcie zboru albo szeroki kadr pełnej sali. Poziome, z zapasem nieba/ściany u góry.',
    aspect: [16, 9],
  },
  {
    key: 'chrzest',
    label: 'Chrzest w wodzie',
    page: 'W co wierzymy, „Jak to wygląda w praktyce”',
    brief: 'Moment chrztu przez zanurzenie albo radość tuż po nim. Za zgodą osoby chrzczonej.',
    aspect: [16, 9],
  },
  {
    key: 'zespol',
    label: 'Zespół uwielbienia',
    page: 'Uwielbienie, pod nagłówkiem',
    brief: 'Zespół przy instrumentach na próbie lub nabożeństwie. Szeroki kadr.',
    aspect: [21, 9],
  },
  {
    key: 'miasto',
    label: 'Kościół dla Wieliczki',
    page: 'Wspieraj, obok wstępu',
    brief: 'Coś, co robicie dla miasta lub ludzi: akcja, pomoc, spotkanie otwarte. Pokazuje, na co idą darowizny.',
    aspect: [3, 2],
  },
] as const satisfies readonly PhotoSlot[];

export type PhotoKey = (typeof photoSlots)[number]['key'];

export const photoSlot = (key: PhotoKey) => photoSlots.find((s) => s.key === key)!;
