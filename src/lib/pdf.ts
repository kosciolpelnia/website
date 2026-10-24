// Builds the printable lyrics PDF of a Piosenka at build time (one template for all songs).
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import logoSvg from '../assets/logo.svg?raw';
import type { Section } from './songs';

const require = createRequire(import.meta.url);
const font = (pkg: string, file: string) => readFile(require.resolve(`@expo-google-fonts/${pkg}/${file}`));

const green = rgb(0x36 / 255, 0x4f / 255, 0x32 / 255);
const orange = rgb(0xeb / 255, 0x53 / 255, 0x19 / 255);
const brown = rgb(0x2d / 255, 0x23 / 255, 0x1b / 255);

const A4 = { w: 595.28, h: 841.89 };
const margin = 56;
const logoPaths = [...logoSvg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]);
const [logoX, logoY, logoW] = [94, 100, 154];

export interface PdfSong {
  title: string;
  originalTitle: string;
  originalAuthors: string[];
  translators: string[];
  publisher?: string | null;
  ccli?: string | null;
  sections: Section[];
  url: string;
}

export function creditLine(song: PdfSong): string {
  return [
    `„${song.originalTitle}”: ${song.originalAuthors.join(', ')}`,
    song.publisher && `© ${song.publisher}`,
    song.ccli && `CCLI ${song.ccli}`,
    `Tłumaczenie: ${song.translators.join(', ')}`,
  ]
    .filter(Boolean)
    .join(' · ');
}

function wrap(text: string, f: PDFFont, size: number, width: number): string[] {
  const out: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (f.widthOfTextAtSize(next, size) > width && line) {
      out.push(line);
      line = word;
    } else line = next;
  }
  if (line) out.push(line);
  return out;
}

export async function songPdf(song: PdfSong): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  doc.setTitle(song.title);
  doc.setAuthor(song.translators.join(', '));
  doc.setCreator('Kościół Pełnia - kosciolpelnia.pl');
  doc.setLanguage('pl-PL');

  const [regular, semibold, black] = await Promise.all([
    font('inter', '400Regular/Inter_400Regular.ttf'),
    font('inter', '600SemiBold/Inter_600SemiBold.ttf'),
    font('rubik', '900Black/Rubik_900Black.ttf'),
  ]).then((files) =>
    // pdf-lib's subsetter drops Inter glyphs, so only Rubik (one title line) is subset.
    Promise.all(files.map((f, i) => doc.embedFont(f, { subset: i === 2 }))),
  );

  const contentWidth = A4.w - margin * 2;
  const footerSize = 7.5;
  const footer = [
    ...wrap(creditLine(song), regular, footerSize, contentWidth),
    `Tekst udostępniony bezpłatnie do użytku w kościołach. ${song.url}`,
  ];
  const footerTop = margin + footer.length * 11;

  let page: PDFPage;
  let y = 0;
  const newPage = () => {
    page = doc.addPage([A4.w, A4.h]);
    footer.forEach((text, i) =>
      page.drawText(text, { x: margin, y: margin + (footer.length - 1 - i) * 11, size: footerSize, font: regular, color: brown }),
    );
    y = A4.h - margin;
  };
  newPage();

  // Header: logo on the right, title block on the left.
  const logoWidth = 48;
  const scale = logoWidth / logoW;
  for (const d of logoPaths) {
    page!.drawSvgPath(d, {
      x: A4.w - margin - logoWidth - logoX * scale,
      y: A4.h - margin + logoY * scale,
      scale,
      color: green,
    });
  }
  for (const line of wrap(song.title, black, 26, contentWidth - logoWidth - 20)) {
    page!.drawText(line, { x: margin, y: y - 24, size: 26, font: black, color: green });
    y -= 30;
  }
  page!.drawText(`${song.originalTitle} · ${song.originalAuthors.join(', ')}`, {
    x: margin,
    y: y - 18,
    size: 9.5,
    font: regular,
    color: brown,
  });
  y -= 52;

  const size = 12.5;
  const lead = 18;
  for (const section of song.sections) {
    const needed = (section.label ? 18 : 0) + Math.min(section.lines.length, 4) * lead;
    if (y - needed < footerTop + 12) newPage();
    if (section.label) {
      page!.drawText(section.label.toUpperCase(), { x: margin, y, size: 8.5, font: semibold, color: orange });
      y -= 18;
    }
    for (const raw of section.lines) {
      for (const line of wrap(raw, regular, size, contentWidth)) {
        if (y < footerTop + 12) newPage();
        page!.drawText(line, { x: margin, y, size, font: regular, color: brown });
        y -= lead;
      }
    }
    y -= 14;
  }

  return doc.save();
}
