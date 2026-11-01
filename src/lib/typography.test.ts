import { describe, expect, it } from 'vitest';
import { bindOrphans, bindOrphansInHtml } from './typography';

const nb = ' ';

describe('bindOrphans', () => {
  it('binds one-letter words to the next word, also in a row and across line breaks', () => {
    expect(bindOrphans('wyznają w Składzie')).toBe(`wyznają w${nb}Składzie`);
    expect(bindOrphans('każde z\n   tych')).toBe(`każde z${nb}tych`);
    expect(bindOrphans('i w domu')).toBe(`i${nb}w${nb}domu`);
    expect(bindOrphans('W domu (a nie tu)')).toBe(`W${nb}domu (a${nb}nie tu)`);
  });

  it('leaves longer words and word endings alone', () => {
    expect(bindOrphans('nasza kawa i na')).toBe(`nasza kawa i${nb}na`);
    expect(bindOrphans('ta woda')).toBe('ta woda');
  });
});

describe('bindOrphansInHtml', () => {
  it('changes text but not tags or attributes', () => {
    expect(bindOrphansInHtml('<p data-copy="a b > i c" class="a b">a b</p>')).toBe(
      `<p data-copy="a b > i c" class="a b">a${nb}b</p>`,
    );
  });

  it('binds a word to a link that follows it', () => {
    expect(bindOrphansInHtml('jest w <a href="/x">Wieliczce</a>')).toBe(`jest w${nb}<a href="/x">Wieliczce</a>`);
  });

  it('skips scripts, styles, form text and the page title', () => {
    for (const html of ['<script>a = i + w b</script>', '<style>a b { }</style>', '<textarea>a b</textarea>', '<title>a b</title>']) {
      expect(bindOrphansInHtml(html)).toBe(html);
    }
    expect(bindOrphansInHtml('<textarea>a b</textarea><p>a b</p>')).toBe(`<textarea>a b</textarea><p>a${nb}b</p>`);
  });
});
