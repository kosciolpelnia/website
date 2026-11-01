// Polish typography: a one-letter word (a, i, o, u, w, z) must not end a line, so it gets a
// non-breaking space to the next word. Runs over every rendered page (src/middleware.ts), which
// also covers text coming from Sanity.
const NBSP = ' ';
const orphan = /(?<=^|[\s („"–—-])([aiouwz])\s+/gi;
const tag = /<!--[\s\S]*?-->|<(?:[^>"']|"[^"]*"|'[^']*')*>/g;
// Their text is data or gets copied, so it stays exactly as written.
const verbatim = /^<(script|style|textarea|pre|code|title)\b/i;

export function bindOrphans(text: string): string {
  return text.replace(orphan, `$1${NBSP}`);
}

/** Applies bindOrphans to the text between tags; tags and attributes stay untouched. */
export function bindOrphansInHtml(html: string): string {
  let out = '';
  let last = 0;
  let skipUntil: string | null = null;
  for (const match of html.matchAll(tag)) {
    const between = html.slice(last, match.index);
    out += skipUntil ? between : bindOrphans(between);
    out += match[0];
    last = match.index + match[0].length;
    if (skipUntil) {
      if (match[0].toLowerCase().startsWith(`</${skipUntil}`)) skipUntil = null;
    } else {
      skipUntil = verbatim.exec(match[0])?.[1].toLowerCase() ?? null;
    }
  }
  return out + (skipUntil ? html.slice(last) : bindOrphans(html.slice(last)));
}
