/** Dipakai bareng builder form (admin) & form Apply publik supaya urutan + tampilan field sama persis. */

export const PLATFORM_LABELS: Record<string, string> = { instagram: 'Instagram', tiktok: 'TikTok', threads: 'Threads', x: 'X' };
// TikTok & Threads wajib "@" di URL profil, sama seperti KOLRegister
export const PLATFORM_PREFIX: Record<string, string> = { instagram: 'instagram.com/', tiktok: 'tiktok.com/@', threads: 'threads.com/@', x: 'x.com/' };

/** Key tiap field di form Apply, urutan default. Custom field pakai id-nya sendiri. */
export const defaultApplyKeys = (o: { askDomicile: boolean; platforms: string[]; customIds: string[] }) => [
  'name', 'phone', 'email', 'niches',
  ...(o.askDomicile ? ['domicile'] : []),
  ...o.platforms.map((p) => `social:${p}`),
  'pic', 'handleBy',
  ...o.customIds,
];

/** Urutan tersimpan diterapkan ke key yang ada sekarang; key baru (belum ada di urutan) disisipkan
 * setelah tetangganya di urutan default, key yang sudah tidak ada dibuang. */
export function applyOrder(order: string[] | undefined, keys: string[]): string[] {
  if (!order?.length) return keys;
  const out = order.filter((k, i) => keys.includes(k) && order.indexOf(k) === i);
  keys.forEach((k, i) => {
    if (out.includes(k)) return;
    const prev = keys.slice(0, i).reverse().find((p) => out.includes(p));
    out.splice(prev ? out.indexOf(prev) + 1 : 0, 0, k);
  });
  return out;
}

/** Link apply pendek /apply/<kode>, kode = 6 hex terakhir applySlug (server terima slug lengkap maupun kode). */
export const shortApplyCode = (applySlug: string) => applySlug.split('-').pop() || applySlug;
