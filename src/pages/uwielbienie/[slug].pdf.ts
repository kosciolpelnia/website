import type { APIRoute, GetStaticPaths } from 'astro';
import { publicSongs, type Piosenka } from '../../lib/catalog';
import { songPdf } from '../../lib/pdf';

export const getStaticPaths = (async () =>
  (await publicSongs()).map((song) => ({ params: { slug: song.slug }, props: { song } }))) satisfies GetStaticPaths;

export const GET: APIRoute<{ song: Piosenka }> = async ({ props: { song }, site }) => {
  const pdf = await songPdf({ ...song, url: new URL(`/uwielbienie/${song.slug}`, site).href });
  return new Response(pdf as BodyInit, { headers: { 'Content-Type': 'application/pdf' } });
};
