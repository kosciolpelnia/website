// Piosenka: lyrics model, the rights gate and the ProPresenter export.
// Everything here is pure so it runs the same at build time and in tests.

export type RightsStatus = 'brak' | 'w-trakcie' | 'zgoda';

export interface Section {
  /** Label as written in the source, e.g. "Zwrotka 1", "Refren". */
  label: string;
  lines: string[];
}

/** Only a Piosenka whose Status praw is "zgoda" may reach the public site (ADR-0003). */
export function isPublic(song: { status: RightsStatus }): boolean {
  return song.status === 'zgoda';
}

/**
 * Parses lyrics written as:
 *
 *   [Zwrotka 1]
 *   line
 *   line
 *
 *   [Refren]
 *   line
 *
 * Blank lines inside a section are ignored; a line before any label lands in an unlabelled section.
 */
export function parseLyrics(text: string): Section[] {
  const sections: Section[] = [];
  let current: Section | undefined;
  for (const raw of text.replace(/\r\n?/g, '\n').split('\n')) {
    const line = raw.trim();
    const label = line.match(/^\[(.+)\]$/);
    if (label) {
      current = { label: label[1].trim(), lines: [] };
      sections.push(current);
    } else if (line) {
      if (!current) {
        current = { label: '', lines: [] };
        sections.push(current);
      }
      current.lines.push(line);
    }
  }
  return sections.filter((s) => s.lines.length > 0);
}

// ProPresenter 7 turns known English group names into slide groups on text import.
const englishLabels: [RegExp, string][] = [
  [/^zwrotka\b/i, 'Verse'],
  [/^przedrefren\b/i, 'Pre-Chorus'],
  [/^refren\b/i, 'Chorus'],
  [/^(bridge|mostek)\b/i, 'Bridge'],
  [/^intro\b/i, 'Intro'],
  [/^(zakończenie|outro|tag)\b/i, 'Ending'],
];

export function englishLabel(label: string): string {
  for (const [pattern, name] of englishLabels) {
    if (pattern.test(label)) return label.replace(pattern, name);
  }
  return label;
}

export type LabelMode = 'pl' | 'en' | 'brak';

/**
 * Text for ProPresenter's import: slides separated by a blank line, each section
 * optionally headed by its label on its own line.
 */
export function toProPresenter(
  sections: Section[],
  options: { linesPerSlide: number; labels: LabelMode },
): string {
  const per = Math.max(1, Math.floor(options.linesPerSlide));
  const blocks: string[] = [];
  for (const section of sections) {
    const slides: string[] = [];
    for (let i = 0; i < section.lines.length; i += per) {
      slides.push(section.lines.slice(i, i + per).join('\n'));
    }
    const label =
      options.labels === 'brak' || !section.label
        ? ''
        : options.labels === 'en'
          ? englishLabel(section.label)
          : section.label;
    blocks.push((label ? `${label}\n` : '') + slides.join('\n\n'));
  }
  return blocks.join('\n\n') + '\n';
}
