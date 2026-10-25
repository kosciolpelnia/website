import { describe, expect, it } from 'vitest';
import { defaults } from '../data/site';
import { mergeSettings } from './settings';

describe('mergeSettings', () => {
  it('keeps the defaults when the panel is empty', () => {
    const site = mergeSettings(null);
    expect(site.sunday.start).toBe(defaults.sunday.start);
    expect(site.sunday.mapsUrl).toBe(
      'https://www.google.com/maps/search/?api=1&query=Stefana%20Batorego%207%2C%2032-020%20Wieliczka',
    );
    expect(site.nip).toBe(defaults.nip);
    expect(site.sunday.kids).toEqual(defaults.sunday.kids);
  });

  it('lets filled panel fields win and ignores blank ones', () => {
    const site = mergeSettings({
      sunday: { start: '10:00', venueName: '  ', parking: 'Parking za budynkiem' },
      giving: { nip: '1234567890', purposes: [] },
    });
    expect(site.sunday.start).toBe('10:00');
    expect(site.sunday.venueName).toBeNull();
    expect(site.sunday.parking).toBe('Parking za budynkiem');
    expect(site.nip).toBe('1234567890');
    expect(site.giving.purposes).toEqual(defaults.giving.purposes);
  });

  it('drops half-filled list rows instead of showing gaps', () => {
    const site = mergeSettings({
      pastors: [{ names: 'Daniel i Nastia', bio: 'Opis', photo: 'https://cdn.sanity.io/x.jpg' }, { names: 'Bez opisu' }],
      sunday: {
        timeline: [{ time: '11:00', title: 'Start' }],
        kids: [{ ages: 'od 3 lat', title: 'Zajęcia', text: 'Opis' }, { ages: 'do 3 lat' }],
      },
    });
    expect(site.sunday.kids).toEqual([{ ages: 'od 3 lat', title: 'Zajęcia', text: 'Opis' }]);
    expect(site.pastors).toEqual([
      { names: 'Daniel i Nastia', role: 'Pastorzy zboru', bio: 'Opis', photo: 'https://cdn.sanity.io/x.jpg' },
    ]);
    expect(site.sunday.timeline).toEqual(defaults.sunday.timeline);
  });
});
