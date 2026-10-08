import { CheckCircle2, MessageCircle, ShieldCheck, type LucideIcon } from 'lucide-react';

const WA_HELP_LINK = 'https://wa.me/6288201586126';

/**
 * Panel samping form publik (Form Brand & Form KOL): kartu info AzeraKOL + kartu "Butuh bantuan?" WhatsApp.
 * Dipasang di kolom kiri grid `.form-side-grid` (sticky; < 900px pindah ke bawah form, lihat index.css).
 */
export default function FormSidePanel({ blurb, points }: {
  blurb: string;
  points: { icon: LucideIcon; color: string; text: string }[];
}) {
  return (
    <div style={{ position: 'sticky', top: '96px' }} className="form-side-panel">
      <div className="bento-card" style={{ padding: '28px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <img src="/logo-transparent.png" alt="AzeraKOL" style={{ height: '28px' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontStyle: 'italic', fontSize: '1rem', color: '#15157d', letterSpacing: '-0.02em' }}>AZERAKOL</span>
        </div>
        <p style={{ color: '#464652', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '20px', fontFamily: 'var(--font-display)' }}>{blurb}</p>
        {points.map(({ icon: Icon, color, text }, i) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#464652', fontSize: '0.82rem', marginBottom: i < points.length - 1 ? '10px' : 0 }}>
            <Icon size={15} color={color} style={{ flexShrink: 0 }} />
            <span>{text}</span>
          </div>
        ))}
      </div>
      <div className="bento-card-dark" style={{ padding: '20px' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '6px' }}>Butuh bantuan?</p>
        <p style={{ fontSize: '0.82rem', opacity: 0.85, marginBottom: '14px' }}>Hubungi kami langsung via WhatsApp</p>
        <a
          href={WA_HELP_LINK} target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.2)', color: 'white',
            borderRadius: '8px', padding: '9px 16px', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none', fontFamily: 'var(--font-display)',
          }}
        >
          <MessageCircle size={14} /> Chat Sekarang
        </a>
      </div>
    </div>
  );
}

/** Poin panel yang dipakai kedua form */
// eslint-disable-next-line react-refresh/only-export-components
export const PANEL_POINTS = {
  whatsapp: { icon: MessageCircle, color: '#25D366', text: 'Respon via WhatsApp dalam 1x24 jam' },
  privacy: { icon: ShieldCheck, color: '#6728e4', text: 'Data kamu aman & terjaga privasi' },
  check: (text: string) => ({ icon: CheckCircle2, color: '#6728e4', text }),
};
