import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Building2, Star } from 'lucide-react';

const floatAnim = (delay: number) => ({
  animate: { y: [0, -10, 0] },
  transition: { duration: 3, repeat: Infinity, delay, ease: 'easeInOut' as const },
});

export default function Hero() {
  return (
    <section
      style={{
        background: '#0F0A2E',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '80px',
      }}
    >
      {/* Background orbs */}
      <div
        className="orb"
        style={{
          width: '500px',
          height: '500px',
          background: 'rgba(107,46,232,0.35)',
          top: '-100px',
          left: '-150px',
        }}
      />
      <div
        className="orb"
        style={{
          width: '400px',
          height: '400px',
          background: 'rgba(232,25,122,0.25)',
          bottom: '-80px',
          right: '-100px',
        }}
      />
      <div
        className="orb"
        style={{
          width: '300px',
          height: '300px',
          background: 'rgba(56,198,240,0.15)',
          top: '30%',
          right: '20%',
        }}
      />

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '80px 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '64px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
          width: '100%',
        }}
        className="hero-grid"
      >
        {/* Left: Text content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="section-label" style={{ color: '#38C6F0', marginBottom: '20px', display: 'block' }}>
              KOL Campaign Engine for Growing Brands
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '24px',
            }}
          >
            We{' '}
            <span className="pill-label" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
              Scale
            </span>{' '}
            Brands Through The Power Of KOL Community.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              color: '#8B87B0',
              fontSize: '1.1rem',
              lineHeight: 1.7,
              marginBottom: '40px',
              maxWidth: '480px',
            }}
          >
            20,000+ Nano &amp; Micro KOL siap amplify brand kamu di seluruh Indonesia.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}
          >
            <Link to="/brand" className="btn-primary">
              Mulai Kampanye
            </Link>
            <Link
              to="/kol"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1.5px solid rgba(255,255,255,0.5)',
                color: 'white',
                background: 'transparent',
                borderRadius: '999px',
                padding: '13px 28px',
                fontWeight: 600,
                fontSize: '0.95rem',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              Daftar KOL
            </Link>
          </motion.div>
        </div>

        {/* Right: Floating stat cards */}
        <div
          style={{
            position: 'relative',
            height: '420px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="hero-right"
        >
          {/* Center glow circle */}
          <div
            style={{
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(107,46,232,0.3) 0%, transparent 70%)',
              position: 'absolute',
            }}
          />
          <div
            style={{
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              border: '1px solid rgba(107,46,232,0.3)',
              position: 'absolute',
            }}
          />
          <div
            style={{
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              border: '1px dashed rgba(107,46,232,0.15)',
              position: 'absolute',
            }}
          />

          {/* Stat card 1 - 20K+ KOL */}
          <motion.div
            className="floating-card"
            style={{
              position: 'absolute',
              top: '30px',
              left: '-20px',
              transform: 'rotate(-6deg)',
              minWidth: '140px',
            }}
            {...floatAnim(0)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#F0EEFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Users size={18} color="#6B2EE8" />
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1A1040' }}>20K+</p>
                <p style={{ fontSize: '0.75rem', color: '#8B87B0' }}>KOL Aktif</p>
              </div>
            </div>
          </motion.div>

          {/* Stat card 2 - 100+ Brand */}
          <motion.div
            className="floating-card"
            style={{
              position: 'absolute',
              top: '60px',
              right: '-30px',
              transform: 'rotate(5deg)',
              minWidth: '145px',
            }}
            {...floatAnim(1)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#FFF0F7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Building2 size={18} color="#E8197A" />
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1A1040' }}>100+</p>
                <p style={{ fontSize: '0.75rem', color: '#8B87B0' }}>Brand Partner</p>
              </div>
            </div>
          </motion.div>

          {/* Stat card 3 - 98% Satisfaction */}
          <motion.div
            className="floating-card"
            style={{
              position: 'absolute',
              bottom: '60px',
              right: '0px',
              transform: 'rotate(-3deg)',
              minWidth: '160px',
            }}
            {...floatAnim(2)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#F0FDF4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Star size={18} color="#10B981" />
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1A1040' }}>98%</p>
                <p style={{ fontSize: '0.75rem', color: '#8B87B0' }}>Satisfaction</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .hero-right {
            height: 240px !important;
          }
        }
      `}</style>
    </section>
  );
}
