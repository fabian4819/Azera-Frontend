import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AlertCircle, Check } from 'lucide-react';
import { fadeUp, stagger } from '../../lib/motion';

const problems = [
  { title: 'KOL Tidak Relevan', desc: 'Susah menemukan KOL yang benar-benar sesuai dengan niche dan target audiens brand.' },
  { title: 'Anggaran Tidak Terkontrol', desc: 'Biaya campaign membengkak tanpa hasil yang jelas dan terukur.' },
  { title: 'Proses Manual & Lambat', desc: 'Briefing, negosiasi, dan pelaporan dilakukan satu per satu — sangat menguras waktu.' },
];

const solutions = [
  { title: 'Matching Berbasis Data', desc: 'Algoritma kami mencocokkan brand dengan KOL berdasarkan demografi, engagement, dan performa nyata.' },
  { title: 'Budget Transparan', desc: 'Paket harga jelas, laporan terukur, dan ROI yang bisa diprediksi dari awal campaign.' },
  { title: 'End-to-End Management', desc: 'Tim AzeraKOL menangani seluruh proses — dari briefing hingga laporan akhir campaign.' },
];

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase',
};

const colLabel: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px',
  display: 'flex', alignItems: 'center', gap: '8px',
};

const cardTitle: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem',
  color: 'var(--on-background)', marginBottom: '6px',
};

const cardDesc: React.CSSProperties = { color: 'var(--on-surface-variant)', fontSize: '0.875rem', lineHeight: 1.6 };

const iconBox = (bg: string): React.CSSProperties => ({
  width: '40px', height: '40px', borderRadius: '11px', background: bg,
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
});

export default function ProblemSolution() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="section-py" style={{ background: '#ffffff' }} ref={ref}>
      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div style={{ textAlign: 'center', marginBottom: '60px' }} variants={fadeUp(0)} initial="hidden" animate={isInView ? 'show' : 'hidden'}>
          <span style={{ ...eyebrow, color: 'var(--secondary)', display: 'inline-block', marginBottom: '16px' }}>
            Pain Points &amp; Solusi
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 3.4rem)', color: 'var(--on-background)', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            Masalah yang Sering Dihadapi<br />Brand Kamu.
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="ps-grid">
          {/* Masalah */}
          <motion.div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} variants={stagger(0.1, 0.1)} initial="hidden" animate={isInView ? 'show' : 'hidden'}>
            <p style={{ ...colLabel, color: 'var(--error)' }}>Masalah</p>
            {problems.map((p) => (
              <motion.div key={p.title} variants={fadeUp(0)} className="bento-card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={iconBox('var(--error-container)')}>
                    <AlertCircle size={18} color="var(--error)" />
                  </div>
                  <div>
                    <p style={cardTitle}>{p.title}</p>
                    <p style={cardDesc}>{p.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Solusi */}
          <motion.div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} variants={stagger(0.1, 0.15)} initial="hidden" animate={isInView ? 'show' : 'hidden'}>
            <p style={{ ...colLabel, color: 'var(--secondary)' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--lime-strong)', display: 'inline-block' }} />
              Solusi AzeraKOL
            </p>
            {solutions.map((s) => (
              <motion.div key={s.title} variants={fadeUp(0)} className="bento-card bento-card-sol" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={iconBox('rgba(196,238,135,0.5)')}>
                    <Check size={18} color="#2f5406" />
                  </div>
                  <div>
                    <p style={cardTitle}>{s.title}</p>
                    <p style={cardDesc}>{s.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
