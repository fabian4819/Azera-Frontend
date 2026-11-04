import { PLATFORM_PREFIX } from './applyForm';

/** Header kolom tabel = nama platform ("Instagram") atau "Username <platform>" (tab Pendaftar/Listing) */
const PLATFORM_BY_HEADER: Record<string, string> = { instagram: 'instagram', tiktok: 'tiktok', threads: 'threads', x: 'x' };

/** "@username" di kolom platform → URL profil (tiktok.com/@..., instagram.com/...). null kalau bukan. */
export function profileUrlFor(header: string | undefined, value: string): string | null {
  // "Instagram" (header lama) atau "Username Instagram" (tab Pendaftar/Listing dengan metrik ekstensi)
  const platform = header ? PLATFORM_BY_HEADER[header.trim().toLowerCase().replace(/^username\s+/, '')] : undefined;
  const v = value.trim();
  if (!platform || !v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  const username = v.replace(/^@+/, '');
  return username && !/\s/.test(username) ? `https://${PLATFORM_PREFIX[platform]}${username}` : null;
}

/** Potongan teks yang berupa link: https://..., atau domain tanpa skema (instagram.com/x, www.situs.id). */
export function toUrl(token: string): string | null {
  const t = token.trim().replace(/[),.;]+$/, '');
  if (/^https?:\/\/\S+$/i.test(t)) return t;
  if (/^(www\.)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(t) && /[a-z]/i.test(t.split('.').pop() || '')) return `https://${t}`;
  return null;
}
