import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
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

export default function ProblemSolution() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="section-py" style={{ background: '#ffffff' }} ref={ref}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div style={{ textAlign: 'center', marginBottom: '64px' }} variants={fadeUp(0)} initial="hidden" animate={isInView ? 'show' : 'hidden'}>
          <span className="tag-pill tag-pill-pink" style={{ marginBottom: '16px' }}>Pain Points &amp; Solusi</span>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'var(--on-background)', lineHeight: 1.15 }}>
            Masalah yang Sering Dihadapi<br />Brand Kamu.
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="ps-grid">
          <motion.div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} variants={stagger(0.1, 0.1)} initial="hidden" animate={isInView ? 'show' : 'hidden'}>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--error)', marginBottom: '4px' }}>
              Masalah
            </p>
            {problems.map((p) => (
              <motion.div key={p.title} variants={fadeUp(0)} className="bento-card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--error-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <AlertCircle size={18} color="var(--error)" />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--on-background)', marginBottom: '6px' }}>{p.title}</p>
                    <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem', lineHeight: 1.6 }}>{p.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} variants={stagger(0.1, 0.15)} initial="hidden" animate={isInView ? 'show' : 'hidden'}>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--secondary)', marginBottom: '4px' }}>
              Solusi AzeraKOL
            </p>
            {solutions.map((s) => (
              <motion.div key={s.title} variants={fadeUp(0)} className="bento-card" style={{ padding: '22px', borderColor: 'rgba(103,40,228,0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(103,40,228,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckCircle2 size={18} color="var(--secondary)" />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--on-background)', marginBottom: '6px' }}>{s.title}</p>
                    <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem', lineHeight: 1.6 }}>{s.desc}</p>
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
