import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Building2, Star, ChevronDown } from 'lucide-react';

const statCards = [
  { icon: Users,     value: '20K+', label: 'KOL Aktif',        rotate: '-4deg',  delay: 0.3 },
  { icon: Building2, value: '100+', label: 'Brand Partner',    rotate: '3deg',   delay: 0.45 },
  { icon: Star,      value: '98%',  label: 'Tingkat Kepuasan', rotate: '-2deg',  delay: 0.6 },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section
      style={{
        minHeight: '100vh',
        background: '#08060F',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '72px',
      }}
    >
      {/* Background orbs */}
      <div className="orb" style={{ width: '600px', height: '600px', background: '#6B2EE8', top: '-200px', left: '-150px' }} />
      <div className="orb" style={{ width: '500px', height: '500px', background: '#E8197A', bottom: '-150px', right: '-100px' }} />
      <div className="orb" style={{ width: '300px', height: '300px', background: '#38C6F0', top: '-50px', right: '20%', opacity: 0.2 }} />

      {/* Giant AZERA watermark */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'Syne, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(8rem, 25vw, 22rem)',
          color: 'white',
          opacity: 0.04,
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          zIndex: 0,
        }}
      >
        AZERA
      </div>

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '80px 24px',
          display: 'grid',
          gridTemplateColumns: '3fr 2fr',
          gap: '64px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
          width: '100%',
        }}
        className="hero-grid"
      >
        {/* Left content */}
        <div>
          <motion.span
            className="section-label"
            style={{ display: 'inline-block', marginBottom: '20px' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            KOL Campaign Engine
          </motion.span>

          <motion.h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              color: '#EDE9F8',
              lineHeight: 1.0,
              marginBottom: '24px',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
          >
            We{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Scale Brands
            </span>{' '}
            Through KOL Power.
          </motion.h1>

          <motion.p
            style={{
              color: '#8B87A8',
              fontSize: '1.05rem',
              lineHeight: 1.75,
              maxWidth: '520px',
              marginBottom: '40px',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}
          >
            Azera menghubungkan brand kamu dengan ribuan KOL terkurasi di seluruh Indonesia. Kampanye lebih efisien, hasil lebih terukur.
          </motion.p>

          <motion.div
            style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.3 }}
          >
            <Link to="/brand/form" className="btn-primary" style={{ fontSize: '1rem', padding: '15px 32px' }}>
              Mulai Kampanye →
            </Link>
            <Link to="/kol/register" className="btn-outline" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              Daftar KOL
            </Link>
          </motion.div>
        </div>

        {/* Right: Floating stat cards */}
        <div
          style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-end' }}
          className="hero-cards"
        >
          {statCards.map(({ icon: Icon, value, label, rotate, delay }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0, rotate }}
              transition={{ duration: 0.7, ease: easeOut, delay }}
              style={{ width: '100%', maxWidth: '260px' }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: delay * 2 }}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  padding: '24px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} color="white" />
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: 'Syne, sans-serif',
                        fontWeight: 900,
                        fontSize: '1.6rem',
                        color: '#FFFFFF',
                        lineHeight: 1,
                      }}
                    >
                      {value}
                    </p>
                    <p style={{ color: '#8B87A8', fontSize: '0.8rem', marginTop: '2px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {label}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          color: '#8B87A8',
        }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Scroll
        </span>
        <ChevronDown size={18} />
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-cards { display: none !important; }
        }
      `}</style>
    </section>
  );
}
