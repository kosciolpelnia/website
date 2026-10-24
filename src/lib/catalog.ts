// The only way pages read Piosenki: the rights gate is applied here, once.
import { getCollection, type CollectionEntry } from 'astro:content';
import { isPublic, parseLyrics, type Section } from './songs';

export type Piosenka = CollectionEntry<'piosenki'>['data'] & {
  slug: string;
  sections: Section[];
};

export async function publicSongs(): Promise<Piosenka[]> {
  const entries = await getCollection('piosenki', (e) => isPublic(e.data));
  return entries
    .map((e) => ({ ...e.data, slug: e.id, sections: parseLyrics(e.body ?? '') }))
    .sort((a, b) => a.title.localeCompare(b.title, 'pl'));
}
