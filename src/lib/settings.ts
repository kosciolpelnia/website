// Ustawienia strony: the Sanity document "ustawienia" laid over the defaults in src/data/site.ts.
import { photoSlots } from '../data/photos';
import { defaults, type SanityImage, type Site } from '../data/site';
import { queries, sanityClient } from './sanity';

/** What the "ustawienia" query returns; every field may be missing or empty. */
export interface SettingsDoc {
  sunday?: Partial<Record<'start' | 'venueName' | 'street' | 'postalCode' | 'city' | 'parking', string | null>> & {
    timeline?: { time?: string; title?: string; text?: string }[] | null;
    kids?: { ages?: string; title?: string; text?: string }[] | null;
  } | null;
  giving?: Partial<Record<'nip' | 'recipient' | 'account' | 'stripeUrl', string | null>> & {
    purposes?: { name?: string; title?: string }[] | null;
  } | null;
  contact?: Partial<Record<'email' | 'instagram' | 'facebook', string | null>> | null;
  pastors?: { names?: string; role?: string; bio?: string; photo?: string | null }[] | null;
  zdjecia?: Record<string, { image?: SanityImage | null; alt?: string | null } | null> | null;
}

const pick = <T,>(value: T | null | undefined, fallback: T): T =>
  value === null || value === undefined || (typeof value === 'string' && value.trim() === '') ? fallback : value;

const complete = <T extends object>(items: Partial<T>[] | null | undefined, keys: (keyof T)[]): T[] =>
  (items ?? []).filter((i) => keys.every((k) => pick(i[k] as unknown, undefined) !== undefined)) as T[];

export function mapsUrl(street: string, postalCode: string, city: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${street}, ${postalCode} ${city}`)}`;
}

export function mergeSettings(doc: SettingsDoc | null, base: Site = defaults): Site {
  const s = doc?.sunday ?? {};
  const g = doc?.giving ?? {};
  const c = doc?.contact ?? {};
  const timeline = complete<Site['sunday']['timeline'][number]>(s.timeline, ['time', 'title', 'text']);
  const kids = complete<Site['sunday']['kids'][number]>(s.kids, ['ages', 'title', 'text']);
  const purposes = complete<Site['giving']['purposes'][number]>(g.purposes, ['name', 'title']);
  const pastors = complete<{ names: string; role: string; bio: string }>(doc?.pastors, ['names', 'bio']).map((p) => ({
    names: p.names,
    role: pick(p.role, 'Pastorzy zboru'),
    bio: p.bio,
    photo: (p as { photo?: string | null }).photo ?? null,
  }));
  const photos: Site['photos'] = {};
  for (const slot of photoSlots) {
    const p = doc?.zdjecia?.[slot.key];
    if (p?.image?.asset?._ref) photos[slot.key] = { image: p.image, alt: pick(p.alt, slot.label) };
  }
  const street = pick(s.street, base.sunday.street);
  const postalCode = pick(s.postalCode, base.sunday.postalCode);
  const city = pick(s.city, base.sunday.city);
  return {
    ...base,
    nip: pick(g.nip, base.nip),
    email: pick(c.email, base.email),
    instagram: pick(c.instagram, base.instagram),
    facebook: pick(c.facebook, base.facebook),
    sunday: {
      start: pick(s.start, base.sunday.start),
      venueName: pick(s.venueName, base.sunday.venueName),
      street,
      postalCode,
      city,
      mapsUrl: mapsUrl(street, postalCode, city),
      timeline: timeline.length ? timeline : base.sunday.timeline,
      kids: kids.length ? kids : base.sunday.kids,
      parking: pick(s.parking, base.sunday.parking),
    },
    pastors: pastors.length ? pastors : base.pastors,
    photos,
    giving: {
      ...base.giving,
      recipient: pick(g.recipient, base.giving.recipient),
      account: pick(g.account, base.giving.account),
      stripeUrl: pick(g.stripeUrl, base.giving.stripeUrl),
      purposes: purposes.length ? purposes : base.giving.purposes,
    },
  };
}

let cached: Promise<Site> | undefined;

/** One fetch per build, shared by every page. */
export function getSite(): Promise<Site> {
  cached ??= sanityClient().fetch<SettingsDoc | null>(queries.settings).then((doc) => mergeSettings(doc));
  return cached;
}
