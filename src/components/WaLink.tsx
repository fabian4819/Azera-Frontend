import { ArrowUpRight } from 'lucide-react';

/** "0812-3456 789" / "+62812..." → "62812..." (format wa.me wajib kode negara, tanpa + dan spasi). */
const waNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
};
/** Teks yang memang nomor HP (bukan "-", JID grup, dll.) */
const isPhoneLike = (v: string) => /^\+?[\d\s().-]{8,20}$/.test(v.trim());

/** Nomor WhatsApp di tabel: klik → buka chat di aplikasi WhatsApp (wa.me), hijau + panah. */
export default function WaLink({ phone }: { phone: string }) {
  if (!isPhoneLike(phone)) return <>{phone}</>;
  return (
    <a
      href={`https://wa.me/${waNumber(phone)}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      title="Chat di WhatsApp"
      style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#128c4a', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
    >
      {phone}
      <ArrowUpRight size={13} strokeWidth={2.5} />
    </a>
  );
}
