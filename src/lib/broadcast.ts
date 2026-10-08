/** Data campaign yang dipakai menyusun Broadcast Campaign (format WA listing Azera). */
export interface BroadcastInput {
  name: string;
  type?: 'online' | 'offline';
  eventDetails?: { location?: string; date?: string; timeWindow?: string };
  fee?: { creatorFee?: number; picFee?: number; mgFee?: number };
  feeNote?: string;
  benefits?: string[];
  requirements?: string[];
  deliverables?: string[];
  infoLink?: string;
}

const rp = (n: number) => `Rp${n.toLocaleString('id-ID')}`;
/** 7500 → "7,5k" (gaya penulisan fee pic/mg di broadcast klien) */
const k = (n: number) => `${(n / 1000).toLocaleString('id-ID')}k`;
/** Baris yang diawali huruf/angka diberi "- ", baris yang sudah diawali emoji/simbol dibiarkan */
const list = (xs: string[] = []) =>
  xs.map((x) => x.trim()).filter(Boolean).map((x) => (/^[\p{L}\p{N}]/u.test(x) ? `- ${x}` : x)).join('\n');

export function buildBroadcast(c: BroadcastInput, applyUrl: string): string {
  const sections: string[] = [`*${c.name} | AZERA* ✨`];

  const ev = c.type === 'offline' ? c.eventDetails : undefined;
  const when = ev?.date
    ? new Date(ev.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' })
    : '';
  const info = [ev?.location && `📍 ${ev.location}`, when && `📅 ${when}`, ev?.timeWindow && `🕓 ${ev.timeWindow}`].filter(Boolean);
  if (info.length) sections.push(info.join('\n'));

  const fee = c.fee?.creatorFee ? `💰 Fee ${rp(c.fee.creatorFee)}${c.feeNote ? ` (${c.feeNote})` : ''}` : '';
  const benefit = [fee, list(c.benefits)].filter(Boolean).join('\n');
  if (benefit) sections.push(`*Benefit:*\n${benefit}`);

  const picMg = [c.fee?.picFee && `fee pic ${k(c.fee.picFee)}`, c.fee?.mgFee && `mg ${k(c.fee.mgFee)}`].filter(Boolean);
  if (picMg.length) sections.push(`_${picMg.join(', ')}_`);

  if (list(c.requirements)) sections.push(`*Syarat:*\n${list(c.requirements)}`);
  if (list(c.deliverables)) sections.push(`*SOW:*\n${list(c.deliverables)}`);
  if (c.infoLink?.trim()) sections.push(`*Info:*\n${c.infoLink.trim()}`);
  sections.push(`*Daftar:*\n${applyUrl}`);
  sections.push('PIC: AZERA\nHandle by+WA:');

  return sections.join('\n\n');
}
