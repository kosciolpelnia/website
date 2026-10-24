// Ustawienia strony: defaults for the facts shown across pages. The Sanity document
// "ustawienia" overrides any field it fills in (src/lib/settings.ts, ADR-0001).
// `null` means "not supplied yet": pages render a visible placeholder instead (see <Brak />).

export interface Site {
  name: string;
  legalName: string;
  nip: string | null;
  url: string;
  email: string;
  instagram: string;
  facebook: string;
  verse: { text: string; ref: string };
  mission: string;
  sunday: {
    start: string;
    venueName: string | null;
    street: string;
    postalCode: string;
    city: string;
    /** Derived from the address in mergeSettings(). */
    mapsUrl: string;
    timeline: { time: string; title: string; text: string }[];
    kidsAges: string | null;
    parking: string | null;
  };
  pastors: { names: string; role: string; bio: string; photo: string | null }[];
  giving: {
    recipient: string;
    account: string;
    baseTitle: string;
    purposes: { name: string; title: string }[];
    stripeUrl: string;
  };
}

export const defaults: Site = {
  name: 'Kościół Pełnia',
  legalName: 'Kościół Zielonoświątkowy Zbór „Pełnia” w Wieliczce',
  nip: null,
  url: 'https://kosciolpelnia.pl',
  email: 'info@kosciolpelnia.pl',
  instagram: 'https://www.instagram.com/kosciolpelnia',
  facebook: 'https://www.facebook.com/people/KDM-Wieliczka/61565869917256/',

  verse: { text: 'Wy jesteście solą ziemi.', ref: 'Mateusza 5:13' },
  mission:
    'Naszą misją jako lokalnego kościoła jest w mieście soli budować społeczność, w której każdy może prawdziwie doświadczyć Bożej miłości, obecności i mocy.',

  sunday: {
    start: '11:30',
    venueName: null,
    street: 'Stefana Batorego 7',
    postalCode: '32-020',
    city: 'Wieliczka',
    mapsUrl: '',
    timeline: [
      { time: '11:15', title: 'Kawa i powitanie', text: 'Przyjdź chwilę wcześniej. Przy kawie lub herbacie chętnie Cię przywitamy i poznamy.' },
      { time: '11:30', title: 'Nabożeństwo', text: 'Wspólnie uwielbiamy Boga, modlimy się i słuchamy Słowa Bożego. Dzieci w tym czasie mają swój kościół dziecięcy.' },
      { time: '12:30', title: 'Czas razem', text: 'Po nabożeństwie zostajemy na kawie i rozmowach. Nigdzie się nie spieszymy.' },
    ],
    kidsAges: null,
    parking: null,
  },

  pastors: [
    {
      names: 'Daniel i Nastia',
      role: 'Pastorzy zboru',
      bio: 'Daniel i Nastia to liderzy głęboko zaangażowani w życie kościoła. Gdy pojawiła się inicjatywa otwarcia kościoła w Wieliczce, z otwartym sercem odpowiedzieli na to wezwanie i stali się głównymi liderami prowadzącymi nowo powstający kościół.',
      photo: null,
    },
  ],

  giving: {
    recipient: 'Kościół Pełnia',
    account: '69 1600 1462 1726 2942 5000 0001',
    baseTitle: 'Darowizna na cele kultu religijnego',
    purposes: [
      { name: 'Dziesięcina', title: 'Darowizna na cele kultu religijnego - dziesięcina' },
      { name: 'Ofiara', title: 'Darowizna na cele kultu religijnego - ofiara' },
      { name: 'Cel bieżący', title: 'Darowizna na cele kultu religijnego' },
    ],
    stripeUrl: 'https://donate.stripe.com/3cI14of3NdWv23O54R6g800',
  },
};
