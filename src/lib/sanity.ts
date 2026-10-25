// Build-time access to the Sanity dataset (ADR-0001). The dataset is private, so reads need
// SANITY_READ_TOKEN (a Viewer token, kept in 1Password and in Vercel's environment).
import { createClient } from '@sanity/client';

export const sanityProject = { projectId: 'nzupjjh7', dataset: 'production' } as const;

export function sanityClient() {
  // import.meta.env inside Astro (reads .env), process.env in plain Node scripts.
  const token = import.meta.env?.SANITY_READ_TOKEN ?? process.env.SANITY_READ_TOKEN;
  if (!token) {
    throw new Error(
      'SANITY_READ_TOKEN is missing. Rebuild .env with: OP_ACCOUNT=my.1password.eu op inject -i .env.tpl -o .env -f',
    );
  }
  return createClient({ ...sanityProject, apiVersion: '2026-10-01', token, useCdn: false, perspective: 'published' });
}

export const queries = {
  // The rights gate starts in the query itself: other songs never leave Sanity (ADR-0003).
  publicSongs: `*[_type == "piosenka" && status == "zgoda" && defined(slug.current)]{
    "id": slug.current,
    title, originalTitle, originalAuthors, translators, publisher, ccli, originalUrl, status,
    "demo": demo.asset->url, themes, sample, lyrics, "publishedAt": _createdAt,
    "album": album->{ title, artist, year, "cover": cover.asset->url }
  }`,
  gatedSongs: `*[_type == "piosenka" && status != "zgoda"]{ "slug": slug.current, title }`,
  sampleSongs: `*[_type == "piosenka" && sample == true].title`,
  settings: `*[_id == "ustawienia"][0]{
    sunday, giving, contact, zdjecia,
    "pastors": pastors[]{ names, role, bio, "photo": photo.asset->url }
  }`,
};
