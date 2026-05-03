import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Data-Driven Matching', desc: 'Pemilihan KOL tidak asal-asalan. Kami menggunakan data engagement, demografi audiens, dan performa historis untuk memastikan kesesuaian terbaik.' },
  { icon: Users, title: 'Massive KOL Network', desc: 'Jaringan 20.000+ KOL aktif dari berbagai niche dan platform. Nano, micro, hingga macro KOL tersedia di satu tempat.' },
  { icon: ShieldCheck, title: 'Quality & Trusted', desc: 'Setiap KOL telah melalui proses kurasi ketat. Fake followers, engagement rendah, dan konten tidak sesuai langsung terseleksi.' },
  { icon: BarChart3, title: 'Performance Focused', desc: 'Laporan transparan dengan metrik yang relevan. Setiap kampanye dioptimalkan untuk mencapai tujuan bisnis yang sudah disepakati.' },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function WhyAzera() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-py" style={{ background: '#ffffff', position: 'relative', overflow: 'hidden' }} ref={ref}>
      <div className="blob-lg" style={{ width: '500px', height: '500px', background: '#e1e0ff', opacity: 0.3, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <motion.div
          style={{ textAlign: 'center', marginBottom: '72px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="section-label" style={{ marginBottom: '16px' }}>Keunggulan Kami</span>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#191c20', lineHeight: 1.15 }}>
            Why{' '}
            <span className="pill-label" style={{ fontSize: '0.7rem', verticalAlign: 'middle' }}>Azera?</span>
          </h2>
        </motion.div>

        <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: easeOut, delay: i * 0.1 }}
              >
                <div
                  className="glass-panel card-hover"
                  style={{ padding: '36px', cursor: 'default' }}
                >
                  <div
                    style={{
                      width: '52px', height: '52px', borderRadius: '14px',
                      background: 'linear-gradient(135deg, #6728e4, #814bfe)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '24px',
                      boxShadow: '0 8px 24px rgba(103,40,228,0.25)',
                    }}
                  >
                    <Icon size={24} color="white" />
                  </div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1.2rem', color: '#191c20', marginBottom: '12px' }}>
                    {feat.title}
                  </h3>
                  <p style={{ color: '#464652', fontSize: '0.9rem', lineHeight: 1.75, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .why-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
