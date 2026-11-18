/** Tarif Fee Finance per jumlah talent di invoice, sama dengan server/src/modules/finance/financeTier.ts */
export const FINANCE_TIERS: { label: string; max: number; fee: number }[] = [
  { label: 'Talent <50', max: 49, fee: 20_000 },
  { label: 'Talent 50-100', max: 100, fee: 40_000 },
  { label: 'Talent >100', max: 500, fee: 75_000 },
  { label: 'Talent >500', max: 1000, fee: 150_000 },
  { label: 'Talent >1000', max: 2000, fee: 200_000 },
  { label: 'Talent >2000', max: 3000, fee: 250_000 },
  { label: 'Talent >3000', max: Infinity, fee: 300_000 },
];
