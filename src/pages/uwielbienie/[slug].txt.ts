import type { APIRoute, GetStaticPaths } from 'astro';
import { publicSongs, type Piosenka } from '../../lib/catalog';
import { toProPresenter } from '../../lib/songs';

export const getStaticPaths = (async () =>
  (await publicSongs()).map((song) => ({ params: { slug: song.slug }, props: { song } }))) satisfies GetStaticPaths;

// The default ProPresenter import text: two lines per slide, English group names.
export const GET: APIRoute<{ song: Piosenka }> = ({ props: { song } }) =>
  new Response(toProPresenter(song.sections, { linesPerSlide: 2, labels: 'en' }), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
