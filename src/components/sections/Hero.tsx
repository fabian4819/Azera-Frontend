import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Building2, Star, ChevronDown, Zap, Rocket } from 'lucide-react';

const statCards = [
  { icon: Users, value: '20K+', label: 'KOL Aktif', rotate: '-6deg', delay: 0.3, color: '#814bfe' },
  { icon: Building2, value: '100+', label: 'Brand Partner', rotate: '5deg', delay: 0.45, color: '#9da1ff' },
  { icon: Star, value: '98%', label: 'Tingkat Kepuasan', rotate: '-4deg', delay: 0.6, color: '#ff81aa' },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section
      style={{
        minHeight: '100vh',
        background: '#f8f9ff',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '80px',
      }}
    >
      {/* Floating blobs */}
      <div className="blob-lg" style={{ width: '700px', height: '700px', background: '#e1e0ff', opacity: 0.5, top: '-300px', left: '-200px' }} />
      <div className="blob-lg" style={{ width: '600px', height: '600px', background: '#ffd9e1', opacity: 0.35, bottom: '-200px', right: '-150px' }} />
      <div className="blob" style={{ width: '400px', height: '400px', background: '#f3eaff', opacity: 0.4, top: '40%', right: '30%' }} />

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '80px 24px',
          display: 'grid',
          gridTemplateColumns: '3fr 2fr',
          gap: '80px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
          width: '100%',
        }}
        className="hero-grid"
      >
        <div>
          <motion.div
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#e1e0ff', borderRadius: '999px', padding: '6px 20px', marginBottom: '24px' }}
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <Zap size={14} color="#6728e4" />
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.75rem', color: '#6728e4', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              KOL Campaign Engine
            </span>
          </motion.div>

          <motion.h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(3rem, 8vw, 6.5rem)',
              color: '#191c20',
              lineHeight: 1.05,
              marginBottom: '24px',
              letterSpacing: '-0.03em',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
          >
            We{' '}
            <span style={{ background: 'linear-gradient(135deg, #6728e4, #ff81aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Scale Brands
            </span>{' '}
            Through KOL Power.
          </motion.h1>

          <motion.p
            style={{
              color: '#464652',
              fontSize: '1.1rem',
              lineHeight: 1.75,
              maxWidth: '520px',
              marginBottom: '40px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
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
            <Link to="/brand/form" className="btn-primary" style={{ fontSize: '1rem', padding: '15px 32px', gap: '10px' }}>
              <Rocket size={18} />
              Mulai Kampanye
            </Link>
            <Link to="/kol/register" className="btn-outline" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              Daftar KOL
            </Link>
          </motion.div>
        </div>

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-end' }} className="hero-cards">
          {statCards.map(({ icon: Icon, value, label, rotate, delay, color }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: 40, rotate }}
              animate={{ opacity: 1, x: 0, rotate }}
              transition={{ duration: 0.7, ease: easeOut, delay }}
              style={{ width: '100%', maxWidth: '280px' }}
              whileHover={{ rotate: 0, scale: 1.02 }}
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: delay * 2 }}
                className="glass-panel"
                style={{ padding: '28px', position: 'relative' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '-12px',
                    width: '44px',
                    height: '44px',
                    borderRadius: '14px',
                    background: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 8px 24px ${color}40`,
                  }}
                >
                  <Icon size={20} color="white" />
                </div>
                <div style={{ marginTop: '12px' }}>
                  <p
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 800,
                      fontSize: '1.8rem',
                      color: '#191c20',
                      lineHeight: 1,
                    }}
                  >
                    {value}
                  </p>
                  <p style={{ color: '#777683', fontSize: '0.8rem', marginTop: '4px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500 }}>
                    {label}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

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
          color: '#777683',
        }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
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
