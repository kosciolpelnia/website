import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { piosenka } from './schemas/piosenka';
import { ustawienia } from './schemas/ustawienia';

const singletonId = 'ustawienia';

export default defineConfig({
  name: 'default',
  title: 'Kościół Pełnia',
  projectId: 'nzupjjh7',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Treści')
          .items([
            S.listItem()
              .title('Ustawienia strony')
              .id(singletonId)
              .child(S.document().schemaType('ustawienia').documentId(singletonId).title('Ustawienia strony')),
            S.divider(),
            S.documentTypeListItem('piosenka').title('Piosenki'),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: [piosenka, ustawienia],
    // Ustawienia is a singleton: no "new" or "duplicate" for it.
    templates: (templates) => templates.filter((t) => t.schemaType !== 'ustawienia'),
  },
  document: {
    actions: (actions, ctx) =>
      ctx.schemaType === 'ustawienia' ? actions.filter((a) => !['duplicate', 'delete', 'unpublish'].includes(a.action ?? '')) : actions,
  },
});
