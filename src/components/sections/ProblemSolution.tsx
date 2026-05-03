import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const problems = [
  {
    title: 'KOL Tidak Relevan',
    desc: 'Susah menemukan KOL yang benar-benar sesuai dengan niche dan target audiens brand.',
  },
  {
    title: 'Anggaran Tidak Terkontrol',
    desc: 'Biaya kampanye membengkak tanpa hasil yang jelas dan terukur.',
  },
  {
    title: 'Proses Manual & Lambat',
    desc: 'Briefing, negosiasi, dan pelaporan dilakukan satu per satu — sangat menguras waktu.',
  },
];

const solutions = [
  {
    title: 'Matching Berbasis Data',
    desc: 'Algoritma kami mencocokkan brand dengan KOL berdasarkan demografi, engagement, dan performa nyata.',
  },
  {
    title: 'Budget Transparan',
    desc: 'Paket harga jelas, laporan terukur, dan ROI yang bisa diprediksi dari awal kampanye.',
  },
  {
    title: 'End-to-End Management',
    desc: 'Tim Azera menangani seluruh proses — dari briefing hingga laporan akhir kampanye.',
  },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function ProblemSolution() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section style={{ background: '#FAFAFA', padding: '128px 24px' }} ref={ref}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '72px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="section-label" style={{ display: 'inline-block', marginBottom: '16px' }}>
            Pain Points & Solusi
          </span>
          <h2
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: '#120E28',
              lineHeight: 1.15,
            }}
          >
            Masalah yang Sering Dihadapi
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Brand Kamu.
            </span>
          </h2>
        </motion.div>

        {/* Two columns */}
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}
          className="ps-grid"
        >
          {/* Problems */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <motion.p
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#EF4444',
                marginBottom: '8px',
              }}
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
                <div
                  className="light-card"
                  style={{
                    padding: '24px',
                    borderLeft: '3px solid #FCA5A5',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: '#FEE2E2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <AlertCircle size={18} color="#EF4444" />
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: 'Syne, sans-serif',
                          fontWeight: 700,
                          fontSize: '1rem',
                          color: '#120E28',
                          marginBottom: '6px',
                        }}
                      >
                        {p.title}
                      </p>
                      <p style={{ color: '#5B5780', fontSize: '0.875rem', lineHeight: 1.65 }}>{p.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Solutions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <motion.p
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#6B2EE8',
                marginBottom: '8px',
              }}
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
                <div
                  className="light-card"
                  style={{
                    padding: '24px',
                    borderLeft: '3px solid #6B2EE8',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircle2 size={18} color="white" />
                    </div>
                    <div>
                      <p
                        style={{
                          fontFamily: 'Syne, sans-serif',
                          fontWeight: 700,
                          fontSize: '1rem',
                          color: '#120E28',
                          marginBottom: '6px',
                        }}
                      >
                        {s.title}
                      </p>
                      <p style={{ color: '#5B5780', fontSize: '0.875rem', lineHeight: 1.65 }}>{s.desc}</p>
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
