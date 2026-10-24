import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Piosenka: one translated song. Files live in src/content/piosenki/ until the Sanity
// panel replaces this loader (ADR-0001); the schema is the contract both must meet.
const piosenki = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/piosenki' }),
  schema: z.object({
    title: z.string(),
    originalTitle: z.string(),
    originalAuthors: z.array(z.string()).min(1),
    translators: z.array(z.string()).min(1),
    publisher: z.string().optional(),
    ccli: z.string().optional(),
    originalUrl: z.url().optional(),
    status: z.enum(['brak', 'w-trakcie', 'zgoda']),
    /** Path under /public or a full URL to the MP3 demo of the Polish version. */
    demo: z.string().optional(),
    themes: z.array(z.string()).default([]),
    /** Marks sample content shipped with the scaffold; never meant for real use. */
    sample: z.boolean().default(false),
    publishedAt: z.coerce.date().optional(),
  }),
});

export const collections = { piosenki };
