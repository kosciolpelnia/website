import { defineField, defineType } from 'sanity';

// Ustawienia strony (CONTEXT.md): one document, id "ustawienia". Empty fields fall back to
// src/data/site.ts on the site, and missing facts there show as „DO UZUPEŁNIENIA”.
export const ustawienia = defineType({
  name: 'ustawienia',
  title: 'Ustawienia strony',
  type: 'document',
  groups: [
    { name: 'niedziela', title: 'Niedziela', default: true },
    { name: 'pastorzy', title: 'Pastorzy' },
    { name: 'darowizny', title: 'Darowizny' },
    { name: 'kontakt', title: 'Kontakt' },
  ],
  fields: [
    defineField({
      name: 'sunday',
      title: 'Niedziela',
      type: 'object',
      group: 'niedziela',
      fields: [
        defineField({ name: 'start', title: 'Godzina nabożeństwa', type: 'string', description: 'np. 11:30' }),
        defineField({ name: 'venueName', title: 'Nazwa miejsca / sali', type: 'string' }),
        defineField({ name: 'street', title: 'Ulica i numer', type: 'string', description: 'bez „ul.”' }),
        defineField({ name: 'postalCode', title: 'Kod pocztowy', type: 'string' }),
        defineField({ name: 'city', title: 'Miasto', type: 'string' }),
        defineField({ name: 'parking', title: 'Dojazd i parking', type: 'text', rows: 3 }),
        defineField({
          name: 'kids',
          title: 'Kościół dziecięcy',
          description: 'Jedna pozycja na grupę wiekową. Widać je na stronie głównej i na stronie o niedzieli.',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'ages', title: 'Wiek', type: 'string', description: 'np. do 3 lat' },
                { name: 'title', title: 'Nazwa', type: 'string', description: 'np. Kącik zabaw' },
                { name: 'text', title: 'Opis', type: 'text', rows: 3 },
              ],
              preview: { select: { title: 'title', subtitle: 'ages' } },
            },
          ],
        }),
        defineField({
          name: 'timeline',
          title: 'Przebieg niedzieli',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'time', title: 'Godzina', type: 'string' },
                { name: 'title', title: 'Nazwa', type: 'string' },
                { name: 'text', title: 'Opis', type: 'text', rows: 2 },
              ],
              preview: { select: { title: 'title', subtitle: 'time' } },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'pastors',
      title: 'Pastorzy',
      type: 'array',
      group: 'pastorzy',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'names', title: 'Imiona', type: 'string' },
            { name: 'role', title: 'Funkcja', type: 'string' },
            { name: 'bio', title: 'Opis', type: 'text', rows: 5 },
            { name: 'photo', title: 'Zdjęcie (pionowe)', type: 'image', options: { hotspot: true } },
          ],
          preview: { select: { title: 'names', subtitle: 'role', media: 'photo' } },
        },
      ],
    }),
    defineField({
      name: 'giving',
      title: 'Darowizny',
      type: 'object',
      group: 'darowizny',
      fields: [
        defineField({ name: 'nip', title: 'NIP zboru', type: 'string' }),
        defineField({ name: 'recipient', title: 'Odbiorca przelewu', type: 'string' }),
        defineField({ name: 'account', title: 'Numer konta', type: 'string' }),
        defineField({
          name: 'purposes',
          title: 'Cele i tytuły przelewu',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'name', title: 'Nazwa', type: 'string' },
                { name: 'title', title: 'Tytuł przelewu', type: 'string', description: 'Zacznij od „Darowizna na cele kultu religijnego”' },
              ],
              preview: { select: { title: 'name', subtitle: 'title' } },
            },
          ],
        }),
        defineField({ name: 'stripeUrl', title: 'Link do płatności online (Stripe)', type: 'url' }),
      ],
    }),
    defineField({
      name: 'contact',
      title: 'Kontakt',
      type: 'object',
      group: 'kontakt',
      fields: [
        defineField({ name: 'email', title: 'E-mail', type: 'string' }),
        defineField({ name: 'instagram', title: 'Instagram (link)', type: 'url' }),
        defineField({ name: 'facebook', title: 'Facebook (link)', type: 'url' }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Ustawienia strony' }) },
});
