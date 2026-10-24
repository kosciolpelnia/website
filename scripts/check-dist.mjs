// Post-build guard: no Piosenka without Status praw "zgoda" may appear anywhere in dist/ (ADR-0003).
// Sample songs only warn: they are allowed until the real translations arrive.
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const contentDir = 'src/content/piosenki';
const dist = 'dist';

const files = async (dir) =>
  (await readdir(dir, { withFileTypes: true, recursive: true })).filter((e) => e.isFile()).map((e) => join(e.parentPath, e.name));

const field = (src, name) => src.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1].trim().replace(/^["']|["']$/g, '');

const problems = [];
const built = await files(dist);
const texts = await Promise.all(built.filter((f) => /\.(html|txt|xml)$/.test(f)).map(async (f) => [f, await readFile(f, 'utf8')]));

for (const name of await readdir(contentDir)) {
  const src = await readFile(join(contentDir, name), 'utf8');
  const slug = name.replace(/\.md$/, '');
  const title = field(src, 'title');
  if (field(src, 'sample') === 'true') console.warn(`check-dist: sample song "${slug}" is still in ${contentDir}`);
  if (field(src, 'status') === 'zgoda') continue;
  for (const f of built) if (f.includes(slug)) problems.push(`gated song "${slug}" was built: ${f}`);
  for (const [f, text] of texts) if (title && text.includes(title)) problems.push(`gated song title "${title}" appears in ${f}`);
}

if (problems.length) {
  console.error('check-dist failed:\n- ' + problems.join('\n- '));
  process.exit(1);
}
console.log(`check-dist: ok (${built.length} files)`);
