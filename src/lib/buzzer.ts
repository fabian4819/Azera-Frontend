/** Setting campaign buzzer di form admin (BuzzerSettings) ↔ criteria.buzzerMax di server */

/** Isian maks akun per platform (string supaya input boleh kosong saat diketik); null = bukan campaign buzzer */
export type BuzzerDraft = Record<string, string> | null;

/** criteria.buzzerMax dari server → draft form */
export const buzzerDraftFrom = (max?: Record<string, number | undefined> | null): BuzzerDraft => {
  const entries = Object.entries(max || {}).filter(([, n]) => Number(n) > 0);
  return entries.length ? Object.fromEntries(entries.map(([p, n]) => [p, String(n)])) : null;
};

/** Draft → criteria.buzzerMax (cuma platform yang dipilih); null/kosong = semua 0 supaya buzzer mati saat di-PATCH */
export const buzzerMaxFrom = (draft: BuzzerDraft, platforms: string[]) =>
  Object.fromEntries(['instagram', 'tiktok', 'threads', 'x'].map((p) => [p, draft && platforms.includes(p) ? Math.min(20, Math.max(0, Math.floor(Number(draft[p]) || 0))) : 0]));
