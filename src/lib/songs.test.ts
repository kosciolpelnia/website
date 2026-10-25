import { describe, expect, it } from 'vitest';
import { englishLabel, isPublic, parseLyrics, searchText, songCount, toProPresenter } from './songs';

const lyrics = `
[Zwrotka 1]
Pierwsza linia
Druga linia

Trzecia linia

[Refren]
Refren raz
Refren dwa
`;

describe('parseLyrics', () => {
  it('splits labelled sections and drops blank lines', () => {
    expect(parseLyrics(lyrics)).toEqual([
      { label: 'Zwrotka 1', lines: ['Pierwsza linia', 'Druga linia', 'Trzecia linia'] },
      { label: 'Refren', lines: ['Refren raz', 'Refren dwa'] },
    ]);
  });

  it('keeps lines before any label in an unlabelled section', () => {
    expect(parseLyrics('a\nb\r\n[Refren]\nc')).toEqual([
      { label: '', lines: ['a', 'b'] },
      { label: 'Refren', lines: ['c'] },
    ]);
  });
});

describe('isPublic', () => {
  it('lets only "zgoda" through', () => {
    expect(isPublic({ status: 'zgoda' })).toBe(true);
    expect(isPublic({ status: 'w-trakcie' })).toBe(false);
    expect(isPublic({ status: 'brak' })).toBe(false);
  });
});

describe('toProPresenter', () => {
  const sections = parseLyrics(lyrics);

  it('cuts sections into slides of N lines with Polish labels', () => {
    expect(toProPresenter(sections, { linesPerSlide: 2, labels: 'pl' })).toBe(
      'Zwrotka 1\nPierwsza linia\nDruga linia\n\nTrzecia linia\n\nRefren\nRefren raz\nRefren dwa\n',
    );
  });

  it('maps labels to ProPresenter group names', () => {
    expect(toProPresenter(sections, { linesPerSlide: 4, labels: 'en' })).toBe(
      'Verse 1\nPierwsza linia\nDruga linia\nTrzecia linia\n\nChorus\nRefren raz\nRefren dwa\n',
    );
  });

  it('can leave labels out', () => {
    expect(toProPresenter(sections, { linesPerSlide: 4, labels: 'brak' })).toBe(
      'Pierwsza linia\nDruga linia\nTrzecia linia\n\nRefren raz\nRefren dwa\n',
    );
  });
});

describe('englishLabel', () => {
  it('keeps numbering and unknown labels', () => {
    expect(englishLabel('Zwrotka 2')).toBe('Verse 2');
    expect(englishLabel('Przedrefren')).toBe('Pre-Chorus');
    expect(englishLabel('Mostek')).toBe('Bridge');
    expect(englishLabel('Wstawka')).toBe('Wstawka');
  });
});

describe('searchText', () => {
  it('lets "zrodlo" find "Źródło" and covers authors and album', () => {
    const text = searchText({
      title: 'Źródło łaski',
      originalTitle: 'Fountain',
      originalAuthors: ['Brooke Ligertwood'],
      translators: ['Daniel'],
      album: { title: 'Seven', artist: 'Hillsong' },
    });
    expect(text).toContain('zrodlo laski');
    expect(text).toContain('brooke ligertwood');
    expect(text).toContain('hillsong');
  });
});

describe('songCount', () => {
  it('declines like Polish does', () => {
    expect([0, 1, 2, 4, 5, 12, 22, 25, 104].map(songCount)).toEqual([
      '0 piosenek', '1 piosenka', '2 piosenki', '4 piosenki', '5 piosenek', '12 piosenek', '22 piosenki', '25 piosenek', '104 piosenki',
    ]);
  });
});
