import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ease } from '../../lib/motion';

/**
 * Header halaman publik di atas latar ungu (--hero-bg): 2 kolom, teks rata tengah di kiri + ilustrasi di kanan.
 * Judul gaya Hero home (besar & rapat, kata kunci `accent` diberi garis lengkung lime), fade-up.
 * < 760px bertumpuk, ilustrasi di atas (lihat .page-hero di index.css).
 */
export default function PageHero({ title, accent, after, subtitle, illustration, tone = 'dark' }: {
  /** Bagian judul sebelum / sesudah kata kunci (boleh kosong) */
  title?: ReactNode; accent: string; after?: ReactNode; subtitle?: ReactNode; illustration: ReactNode;
  /** dark = di atas latar ungu (teks putih, garis lime); light = latar terang (teks gelap, garis ungu), mis. Portfolio */
  tone?: 'dark' | 'light';
}) {
  const light = tone === 'light';
  return (
    // Lebar sendiri di tengah viewport (tidak ikut container halaman yang bisa sempit, mis. form KOL 900px);
    // kolom selebar isinya & dipusatkan supaya teks dan ilustrasi berdekatan
    <div className="page-hero" style={{
      display: 'grid', gridTemplateColumns: 'minmax(0, 560px) minmax(0, 340px)', justifyContent: 'center', alignItems: 'center', gap: '40px', marginBottom: '32px',
      width: 'min(1000px, calc(100vw - 48px))', position: 'relative', left: '50%', transform: 'translateX(-50%)',
    }}>
      <div style={{ minWidth: 0, textAlign: 'center' }}>
      <motion.h1
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.05 }}
        style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.1rem, 5vw, 3.6rem)', color: light ? 'var(--on-background)' : '#fff', lineHeight: 1.02, letterSpacing: '-0.045em', marginBottom: '20px' }}
      >
        {title}{title ? ' ' : null}
        {/* Kata kunci pendek dijaga 1 baris supaya garis lime pas di bawahnya; yang panjang (nama campaign) boleh pecah */}
        <span className="underline-accent" style={accent.length <= 24 ? { whiteSpace: 'nowrap' } : undefined}>
          {accent}
          <svg viewBox="0 0 300 20" preserveAspectRatio="none" fill="none">
            <path d="M2 14C60 4 160 2 298 12" stroke={light ? 'var(--secondary)' : 'var(--lime)'} strokeWidth="5" strokeLinecap="round" />
          </svg>
        </span>
        {after ? <> {after}</> : null}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.13 }}
          style={{ color: light ? 'var(--on-surface-variant)' : 'rgba(255,255,255,0.82)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto' }}
        >
          {subtitle}
        </motion.p>
      )}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.1 }}
        className="page-hero-art" style={{ maxWidth: '340px', width: '100%', justifySelf: 'center' }}
      >
        {illustration}
      </motion.div>
    </div>
  );
}
