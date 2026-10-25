import { defineField, defineType } from 'sanity';

// Album: the original release a Piosenka comes from. One cover serves every song on it.
export const album = defineType({
  name: 'album',
  title: 'Album',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Tytuł albumu', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'artist', title: 'Wykonawca', type: 'string', description: 'np. Hillsong Worship' }),
    defineField({ name: 'year', title: 'Rok wydania', type: 'number', validation: (r) => r.min(1900).max(2100).integer() }),
    defineField({
      name: 'cover',
      title: 'Okładka',
      description: 'Kwadratowa, najlepiej min. 600 × 600 px.',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  orderings: [{ title: 'Tytuł', name: 'title', by: [{ field: 'title', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', artist: 'artist', year: 'year', media: 'cover' },
    prepare: ({ title, artist, year, media }) => ({ title, subtitle: [artist, year].filter(Boolean).join(' · '), media }),
  },
});
