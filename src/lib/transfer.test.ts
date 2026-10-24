import { describe, expect, it } from 'vitest';
import { defaults as site } from '../data/site';
import { formatAccount, isValidNrb, transferQrPayload } from './transfer';

describe('formatAccount', () => {
  it('groups an NRB as banks print it', () => {
    expect(formatAccount('69160014621726294250000001')).toBe('69 1600 1462 1726 2942 5000 0001');
  });
});

describe('isValidNrb', () => {
  it('accepts the church account and rejects a typo', () => {
    expect(isValidNrb(site.giving.account)).toBe(true);
    expect(isValidNrb('69 1600 1462 1726 2942 5000 0002')).toBe(false);
    expect(isValidNrb('123')).toBe(false);
  });
});

describe('transferQrPayload', () => {
  it('builds the ZBP payload with empty amount by default', () => {
    expect(
      transferQrPayload({ account: '69 1600 1462 1726 2942 5000 0001', recipient: 'Kościół Pełnia', title: 'Dziesięcina' }),
    ).toBe('|PL|69160014621726294250000001||Kościół Pełnia|Dziesięcina|||');
  });

  it('pads the amount in grosze and strips separators', () => {
    expect(
      transferQrPayload({ nip: '123-456-78-90', account: '69160014621726294250000001', amountGrosze: 5000, recipient: 'A|B', title: 'T' }),
    ).toBe('1234567890|PL|69160014621726294250000001|005000|A B|T|||');
  });
});
