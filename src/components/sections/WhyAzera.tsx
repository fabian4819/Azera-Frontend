import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Data-Driven Matching', desc: 'Pemilihan KOL tidak asal-asalan. Kami menggunakan data engagement, demografi audiens, dan performa historis untuk memastikan kesesuaian terbaik.', dark: false },
  { icon: Users, title: 'Massive KOL Network', desc: 'Jaringan 20.000+ KOL aktif dari berbagai niche dan platform. Nano, micro, hingga macro KOL tersedia di satu tempat.', dark: true },
  { icon: ShieldCheck, title: 'Quality & Trusted', desc: 'Setiap KOL telah melalui proses kurasi ketat. Fake followers, engagement rendah, dan konten tidak sesuai langsung terseleksi.', dark: false },
  { icon: BarChart3, title: 'Performance Focused', desc: 'Laporan transparan dengan metrik yang relevan. Setiap campaign dioptimalkan untuk mencapai tujuan bisnis yang sudah disepakati.', dark: false },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function WhyAzera() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-py" style={{ background: '#ffffff' }} ref={ref}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          style={{ textAlign: 'center', marginBottom: '64px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="tag-pill tag-pill-purple" style={{ marginBottom: '16px' }}>Keunggulan Kami</span>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'var(--on-background)', lineHeight: 1.15 }}>
            Why AzeraKOL?
          </h2>
        </motion.div>

        <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: easeOut, delay: i * 0.1 }}
                className={feat.dark ? 'bento-card-dark' : 'bento-card'}
                style={{ padding: '32px' }}
              >
                <div
                  style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: feat.dark ? 'rgba(255,255,255,0.12)' : 'rgba(103,40,228,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '22px',
                  }}
                >
                  <Icon size={22} color={feat.dark ? '#fff' : 'var(--secondary)'} />
                </div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1.15rem', color: feat.dark ? '#fff' : 'var(--on-background)', marginBottom: '10px' }}>
                  {feat.title}
                </h3>
                <p style={{ color: feat.dark ? 'rgba(255,255,255,0.65)' : 'var(--on-surface-variant)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {feat.desc}
                </p>
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
