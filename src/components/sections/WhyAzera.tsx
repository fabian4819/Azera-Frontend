import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, Users, ShieldCheck, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Data-Driven Matching',
    desc: 'Pemilihan KOL tidak asal-asalan. Kami menggunakan data engagement, demografi audiens, dan performa historis untuk memastikan kesesuaian terbaik.',
  },
  {
    icon: Users,
    title: 'Massive KOL Network',
    desc: 'Jaringan 20.000+ KOL aktif dari berbagai niche dan platform. Nano, micro, hingga macro KOL tersedia di satu tempat.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality & Trusted',
    desc: 'Setiap KOL telah melalui proses kurasi ketat. Fake followers, engagement rendah, dan konten tidak sesuai langsung terseleksi.',
  },
  {
    icon: TrendingUp,
    title: 'Performance Focused',
    desc: 'Laporan transparan dengan metrik yang relevan. Setiap kampanye dioptimalkan untuk mencapai tujuan bisnis yang sudah disepakati.',
  },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function WhyAzera() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      style={{ background: '#08060F', padding: '128px 24px', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background orb */}
      <div className="orb" style={{ width: '500px', height: '500px', background: '#6B2EE8', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.15 }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '72px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="section-label" style={{ display: 'inline-block', marginBottom: '16px' }}>
            Keunggulan Kami
          </span>
          <h2
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: '#EDE9F8',
              lineHeight: 1.15,
            }}
          >
            Why{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Azera?
            </span>
          </h2>
        </motion.div>

        {/* 2x2 grid */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}
          className="why-grid"
        >
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
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '20px',
                    padding: '32px',
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(107,46,232,0.2)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(107,46,232,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <Icon size={22} color="white" />
                  </div>
                  <h3
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 700,
                      fontSize: '1.15rem',
                      color: '#FFFFFF',
                      marginBottom: '10px',
                    }}
                  >
                    {feat.title}
                  </h3>
                  <p
                    style={{
                      color: '#8B87A8',
                      fontSize: '0.9rem',
                      lineHeight: 1.75,
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                  >
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
