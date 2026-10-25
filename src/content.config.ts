import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { queries, sanityClient } from './lib/sanity';

// Piosenka: one translated song, edited in Sanity (ADR-0001). The zod schema is the contract
// between the panel (studio/schemas/piosenka.ts) and the pages.
const piosenki = defineCollection({
  loader: {
    name: 'sanity-piosenki',
    load: async ({ store, parseData, logger }) => {
      const songs = await sanityClient().fetch<Array<Record<string, unknown> & { id: string; lyrics?: string }>>(
        queries.publicSongs,
      );
      store.clear();
      for (const { id, lyrics, ...rest } of songs) {
        const data = await parseData({ id, data: rest });
        store.set({ id, data, body: lyrics ?? '' });
      }
      logger.info(`${songs.length} public songs from Sanity`);
    },
  },
  schema: z.object({
    title: z.string(),
    originalTitle: z.string(),
    originalAuthors: z.array(z.string()).min(1),
    translators: z.array(z.string()).min(1),
    publisher: z.string().nullish(),
    ccli: z.string().nullish(),
    originalUrl: z.url().nullish(),
    status: z.enum(['brak', 'w-trakcie', 'zgoda']),
    /** URL of the MP3 demo of the Polish version (Sanity CDN). */
    demo: z.string().nullish(),
    themes: z.array(z.string()).nullish().transform((t) => t ?? []),
    /** Marks sample content shipped with the scaffold; never meant for real use. */
    sample: z.boolean().nullish().transform((s) => s ?? false),
    publishedAt: z.coerce.date().optional(),
    /** The original release; cover is a Sanity CDN image URL. */
    album: z
      .object({
        title: z.string(),
        artist: z.string().nullish(),
        year: z.number().nullish(),
        cover: z.string().nullish(),
      })
      .nullish(),
  }),
});

export const collections = { piosenki };
