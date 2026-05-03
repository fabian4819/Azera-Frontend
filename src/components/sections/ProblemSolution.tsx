import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const problems = [
  { title: 'KOL Tidak Relevan', desc: 'Susah menemukan KOL yang benar-benar sesuai dengan niche dan target audiens brand.' },
  { title: 'Anggaran Tidak Terkontrol', desc: 'Biaya kampanye membengkak tanpa hasil yang jelas dan terukur.' },
  { title: 'Proses Manual & Lambat', desc: 'Briefing, negosiasi, dan pelaporan dilakukan satu per satu — sangat menguras waktu.' },
];

const solutions = [
  { title: 'Matching Berbasis Data', desc: 'Algoritma kami mencocokkan brand dengan KOL berdasarkan demografi, engagement, dan performa nyata.' },
  { title: 'Budget Transparan', desc: 'Paket harga jelas, laporan terukur, dan ROI yang bisa diprediksi dari awal kampanye.' },
  { title: 'End-to-End Management', desc: 'Tim Azera menangani seluruh proses — dari briefing hingga laporan akhir kampanye.' },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function ProblemSolution() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-py" style={{ background: '#ffffff', position: 'relative', overflow: 'hidden' }} ref={ref}>
      <div className="blob" style={{ width: '400px', height: '400px', background: '#e1e0ff', opacity: 0.25, top: '10%', right: '-100px' }} />
      <div className="blob" style={{ width: '350px', height: '350px', background: '#ffd9e1', opacity: 0.2, bottom: '10%', left: '-100px' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <motion.div
          style={{ textAlign: 'center', marginBottom: '72px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="section-label" style={{ marginBottom: '16px' }}>Pain Points & Solusi</span>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#191c20', lineHeight: 1.15 }}>
            Masalah yang Sering Dihadapi
            <br />
            <span style={{ background: 'linear-gradient(135deg, #6728e4, #ff81aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Brand Kamu.
            </span>
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="ps-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <motion.p
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ba1a1a', marginBottom: '8px' }}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, ease: easeOut, delay: 0.1 }}
            >
              Masalah
            </motion.p>
            {problems.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, ease: easeOut, delay: 0.15 + i * 0.1 }}
              >
                <div className="glass-panel" style={{ padding: '24px', borderLeft: '3px solid #ffb1c6' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ffdad6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <AlertCircle size={18} color="#ba1a1a" />
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '6px' }}>{p.title}</p>
                      <p style={{ color: '#464652', fontSize: '0.875rem', lineHeight: 1.65 }}>{p.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <motion.p
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6728e4', marginBottom: '8px' }}
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, ease: easeOut, delay: 0.1 }}
            >
              Solusi Azera
            </motion.p>
            {solutions.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, ease: easeOut, delay: 0.15 + i * 0.1 }}
              >
                <div className="glass-panel" style={{ padding: '24px', borderLeft: '3px solid #814bfe' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6728e4, #814bfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle2 size={18} color="white" />
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '6px' }}>{s.title}</p>
                      <p style={{ color: '#464652', fontSize: '0.875rem', lineHeight: 1.65 }}>{s.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
