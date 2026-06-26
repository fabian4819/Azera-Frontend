import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { fadeUp, fadeLeft, fadeRight, stagger, useParallax } from '../../lib/motion';

const problems = [
  { title: 'KOL Tidak Relevan', desc: 'Susah menemukan KOL yang benar-benar sesuai dengan niche dan target audiens brand.' },
  { title: 'Anggaran Tidak Terkontrol', desc: 'Biaya kampanye membengkak tanpa hasil yang jelas dan terukur.' },
  { title: 'Proses Manual & Lambat', desc: 'Briefing, negosiasi, dan pelaporan dilakukan satu per satu — sangat menguras waktu.' },
];

const solutions = [
  { title: 'Matching Berbasis Data', desc: 'Algoritma kami mencocokkan brand dengan KOL berdasarkan demografi, engagement, dan performa nyata.' },
  { title: 'Budget Transparan', desc: 'Paket harga jelas, laporan terukur, dan ROI yang bisa diprediksi dari awal kampanye.' },
  { title: 'End-to-End Management', desc: 'Tim AzeraKOL menangani seluruh proses — dari briefing hingga laporan akhir kampanye.' },
];

export default function ProblemSolution() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { ref: blobRef1, y: blobY1 } = useParallax(50);
  const { ref: blobRef2, y: blobY2 } = useParallax(-50);

  return (
    <section className="section-py" style={{ background: '#ffffff', position: 'relative', overflow: 'hidden' }} ref={ref}>
      <motion.div
        ref={blobRef1 as React.RefObject<HTMLDivElement>}
        style={{ y: blobY1, position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: '#e1e0ff', opacity: 0.25, top: '10%', right: '-100px', filter: 'blur(48px)', pointerEvents: 'none' }}
      />
      <motion.div
        ref={blobRef2 as React.RefObject<HTMLDivElement>}
        style={{ y: blobY2, position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', background: '#ffd9e1', opacity: 0.2, bottom: '10%', left: '-100px', filter: 'blur(40px)', pointerEvents: 'none' }}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Section header */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '72px' }}
          variants={fadeUp(0)}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
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
          {/* Problems — slide from left */}
          <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            variants={stagger(0.1, 0.1)}
            initial="hidden"
            animate={isInView ? 'show' : 'hidden'}
          >
            <motion.p
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ba1a1a', marginBottom: '8px' }}
              variants={fadeLeft(0)}
            >
              Masalah
            </motion.p>
            {problems.map((p) => (
              <motion.div key={p.title} variants={fadeLeft(0)} whileHover={{ x: 4, transition: { duration: 0.2 } }}>
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
          </motion.div>

          {/* Solutions — slide from right */}
          <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            variants={stagger(0.1, 0.15)}
            initial="hidden"
            animate={isInView ? 'show' : 'hidden'}
          >
            <motion.p
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6728e4', marginBottom: '8px' }}
              variants={fadeRight(0)}
            >
              Solusi AzeraKOL
            </motion.p>
            {solutions.map((s) => (
              <motion.div key={s.title} variants={fadeRight(0)} whileHover={{ x: -4, transition: { duration: 0.2 } }}>
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
