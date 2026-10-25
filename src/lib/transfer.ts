// Polish bank-transfer helpers: account formatting and the ZBP "QR do przelewu" payload
// (Rekomendacja Związku Banków Polskich: NIP|PL|NRB|kwota w groszach|nazwa|tytuł|||).

export function digitsOnly(account: string): string {
  return account.replace(/\D/g, '');
}

/** "69160014621726294250000001" → "69 1600 1462 1726 2942 5000 0001" */
export function formatAccount(account: string): string {
  const d = digitsOnly(account);
  return [d.slice(0, 2), ...(d.slice(2).match(/.{1,4}/g) ?? [])].join(' ');
}

/** IBAN mod-97 check for a Polish NRB (26 digits). */
export function isValidNrb(account: string): boolean {
  const d = digitsOnly(account);
  if (d.length !== 26) return false;
  // Move the check digits and "PL" (P=25, L=21) to the end, then mod 97.
  const rearranged = d.slice(2) + '2521' + d.slice(0, 2);
  let rest = 0;
  for (const ch of rearranged) rest = (rest * 10 + Number(ch)) % 97;
  return rest === 1;
}

// The NIP slot stays empty on purpose: a payload starting with digits makes phone cameras
// offer to call it as a phone number. Bank apps read the transfer without it.
export function transferQrPayload(input: {
  account: string;
  amountGrosze?: number;
  recipient: string;
  title: string;
}): string {
  const clean = (s: string, max: number) => s.replace(/\|/g, ' ').slice(0, max);
  const amount = input.amountGrosze ? String(Math.round(input.amountGrosze)).padStart(6, '0') : '';
  return [
    '',
    'PL',
    digitsOnly(input.account),
    amount,
    clean(input.recipient, 20),
    // ZBP recommends 32 characters, but the Zbór wants the full PIT wording; bank apps accept it.
    clean(input.title, 100),
    '',
    '',
    '',
  ].join('|');
}

