import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function DualCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} style={{ background: '#08060F' }}>
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '480px' }}
        className="dualcta-grid"
      >
        {/* Left: Brand CTA */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: easeOut }}
          style={{
            background: '#0D0920',
            padding: '80px 60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
          className="dualcta-left"
        >
          {/* Subtle orb */}
          <div className="orb" style={{ width: '300px', height: '300px', background: '#6B2EE8', bottom: '-100px', left: '-100px', opacity: 0.2 }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <span className="section-label" style={{ display: 'inline-block', marginBottom: '16px' }}>
              Untuk Brand
            </span>
            <h2
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                color: '#FFFFFF',
                lineHeight: 1.15,
                marginBottom: '16px',
              }}
            >
              Siap Mulai Kampanye KOL?
            </h2>
            <p
              style={{
                color: '#8B87A8',
                fontSize: '0.95rem',
                lineHeight: 1.75,
                marginBottom: '36px',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                maxWidth: '380px',
              }}
            >
              Konsultasi gratis dengan tim Azera. Kami bantu tentukan strategi, pilih KOL, dan jalankan kampanye yang tepat sasaran.
            </p>
            <Link to="/brand/form" className="btn-primary" style={{ alignSelf: 'flex-start', fontSize: '1rem', padding: '14px 32px' }}>
              Mulai Kampanye →
            </Link>
          </div>
        </motion.div>

        {/* Vertical separator */}
        <div
          className="dualcta-sep"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '50%',
            width: '1px',
            background: 'linear-gradient(180deg, transparent, #6B2EE8, #E8197A, transparent)',
            opacity: 0.4,
            zIndex: 10,
          }}
        />

        {/* Right: KOL CTA */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
          style={{
            background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
            padding: '80px 60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
          className="dualcta-right"
        >
          {/* Subtle orb */}
          <div className="orb" style={{ width: '300px', height: '300px', background: 'rgba(255,255,255,0.3)', top: '-100px', right: '-100px', opacity: 0.15 }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <span
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.7)',
                display: 'inline-block',
                marginBottom: '16px',
              }}
            >
              Untuk KOL
            </span>
            <h2
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                color: '#FFFFFF',
                lineHeight: 1.15,
                marginBottom: '16px',
              }}
            >
              Bergabung dengan Azera Network
            </h2>
            <p
              style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.95rem',
                lineHeight: 1.75,
                marginBottom: '36px',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                maxWidth: '380px',
              }}
            >
              Daftar gratis, dapatkan akses ke ratusan peluang kolaborasi brand ternama di Indonesia. Tim kami siap mendukung perjalanan kariermu.
            </p>
            <Link
              to="/kol/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 32px',
                borderRadius: '999px',
                background: 'white',
                color: '#6B2EE8',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 700,
                fontSize: '1rem',
                textDecoration: 'none',
                transition: 'all 0.2s',
                alignSelf: 'flex-start',
              }}
            >
              Bergabung KOL →
            </Link>
          </div>
        </motion.div>
      </div>

      <style>{`
        .dualcta-grid { position: relative; }
        @media (max-width: 768px) {
          .dualcta-grid { grid-template-columns: 1fr !important; }
          .dualcta-left { padding: 64px 32px !important; }
          .dualcta-right { padding: 64px 32px !important; }
          .dualcta-sep { display: none !important; }
        }
      `}</style>
    </section>
  );
}
