// Post-build guard (ADR-0003): no Piosenka without Status praw "zgoda" may appear anywhere in dist/.
// Sample songs only warn: they are allowed until the real translations arrive.
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { queries, sanityClient } from '../src/lib/sanity.ts';

const dist = 'dist';
const client = sanityClient();
const [gated, samples] = await Promise.all([
  client.fetch<{ slug: string | null; title: string | null }[]>(queries.gatedSongs),
  client.fetch<string[]>(queries.sampleSongs),
]);

const built = (await readdir(dist, { withFileTypes: true, recursive: true }))
  .filter((e) => e.isFile())
  .map((e) => join(e.parentPath, e.name));
const texts = await Promise.all(
  built.filter((f) => /\.(html|txt|xml)$/.test(f)).map(async (f) => [f, await readFile(f, 'utf8')] as const),
);

const problems: string[] = [];
for (const { slug, title } of gated) {
  if (slug) for (const f of built) if (f.includes(`/${slug}.`)) problems.push(`gated song "${slug}" was built: ${f}`);
  if (title) for (const [f, text] of texts) if (text.includes(title)) problems.push(`gated song title "${title}" appears in ${f}`);
}
for (const title of samples) console.warn(`check-dist: sample song "${title}" is still in Sanity`);

if (problems.length) {
  console.error('check-dist failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}
console.log(`check-dist: ok (${built.length} files, ${gated.length} gated songs checked)`);
