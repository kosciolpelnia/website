import { defineField, defineType } from 'sanity';

// Piosenka (CONTEXT.md). The site's zod schema in src/content.config.ts must accept what this produces.
export const piosenka = defineType({
  name: 'piosenka',
  title: 'Piosenka',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Tytuł polski', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Adres strony',
      description: 'Część adresu: kosciolpelnia.pl/uwielbienie/…',
      type: 'slug',
      options: { source: 'title', maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status praw',
      description: 'Na stronie pojawi się TYLKO piosenka ze statusem „Zgoda”.',
      type: 'string',
      options: {
        list: [
          { title: 'Brak zgody', value: 'brak' },
          { title: 'W trakcie', value: 'w-trakcie' },
          { title: 'Zgoda', value: 'zgoda' },
        ],
        layout: 'radio',
      },
      initialValue: 'brak',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'originalTitle', title: 'Tytuł oryginału', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'originalAuthors',
      title: 'Autorzy oryginału',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'translators',
      title: 'Tłumacze',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'album',
      title: 'Album',
      description: 'Płyta, z której pochodzi oryginał. Nowy album dodasz przyciskiem „Create”.',
      type: 'reference',
      to: [{ type: 'album' }],
    }),
    defineField({ name: 'publisher', title: 'Wydawca', type: 'string' }),
    defineField({ name: 'ccli', title: 'Numer CCLI', type: 'string' }),
    defineField({ name: 'originalUrl', title: 'Link do oryginału (YouTube, Spotify…)', type: 'url' }),
    defineField({
      name: 'lyrics',
      title: 'Tekst',
      description:
        'Nazwę sekcji pisz w nawiasach kwadratowych w osobnej linii, np. [Zwrotka 1], [Refren], [Bridge]. Każda linia to jeden wers. PDF i tekst do ProPresentera powstają z tego automatycznie.',
      type: 'text',
      rows: 24,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'demo',
      title: 'Demo (MP3)',
      type: 'file',
      options: { accept: 'audio/mpeg' },
    }),
    defineField({ name: 'themes', title: 'Tematy', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({
      name: 'sample',
      title: 'Przykład',
      description: 'Zaznaczone tylko dla przykładowej piosenki. Usuń ją przed startem strony.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [{ title: 'Tytuł', name: 'title', by: [{ field: 'title', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', original: 'originalTitle', status: 'status', media: 'album.cover' },
    prepare: ({ title, original, status, media }) => ({
      media,
      title,
      subtitle: `${{ brak: '⛔ brak zgody', 'w-trakcie': '⏳ w trakcie', zgoda: '✅ zgoda' }[status as string] ?? ''} · ${original ?? ''}`,
    }),
  },
});
