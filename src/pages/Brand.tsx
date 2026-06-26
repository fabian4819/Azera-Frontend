import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Camera, Play, ExternalLink, Sparkles } from 'lucide-react';
import { packages } from '../data/packages';

const platformIcons: Record<string, React.ReactNode> = {
  Instagram: <Camera size={13} />,
  TikTok: <ExternalLink size={13} />,
  YouTube: <Play size={13} />,
  'All platforms': <ExternalLink size={13} />,
  Live: <ExternalLink size={13} />,
};

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function Brand() {
  return (
    <div style={{ background: '#f8f9ff', minHeight: '100vh' }}>
      <div style={{ background: '#15157d', padding: '140px 24px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="blob-lg" style={{ width: '500px', height: '500px', background: '#814bfe', opacity: 0.3, top: '-200px', left: '10%' }} />
        <div className="blob-lg" style={{ width: '400px', height: '400px', background: '#ff81aa', opacity: 0.25, bottom: '-150px', right: '10%' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
          <span className="section-label" style={{ display: 'inline-block', marginBottom: '16px', color: '#9da1ff' }}>
            Untuk Brand
          </span>
          <motion.h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              color: '#ffffff',
              lineHeight: 1.05,
              marginBottom: '20px',
              letterSpacing: '-0.03em',
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            Pilih Paket{' '}
            <span style={{ background: 'linear-gradient(135deg, #9da1ff, #ff81aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Kampanye
            </span>{' '}
            Kamu.
          </motion.h1>
          <motion.p
            style={{ color: 'rgba(157,161,255,0.8)', fontSize: '1.05rem', lineHeight: 1.75, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.15 }}
          >
            Dari kampanye skala kecil hingga massive KOL campaign — AzeraKOL punya solusi untuk setiap kebutuhan brand.
          </motion.p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px 100px', position: 'relative' }}>
        <div className="blob" style={{ width: '350px', height: '350px', background: '#e1e0ff', opacity: 0.2, top: '30%', left: '5%' }} />
        <div className="blob" style={{ width: '300px', height: '300px', background: '#ffd9e1', opacity: 0.15, bottom: '20%', right: '5%' }} />

        <div className="brand-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px', alignItems: 'start', position: 'relative', zIndex: 1 }}>
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut, delay: i * 0.12 }}
              style={{ position: 'relative' }}
            >
              {pkg.popular && (
                <div
                  className="kinetic-glow"
                  style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'white',
                    borderRadius: '999px',
                    padding: '6px 20px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  MOST POPULAR
                </div>
              )}

              <div
                style={{
                  background: 'white',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: pkg.popular
                    ? '0 8px 48px rgba(103,40,228,0.2), 0 0 0 2px #6728e4'
                    : '0 4px 24px rgba(0,0,0,0.06)',
                  border: pkg.popular ? '2px solid #6728e4' : '1px solid rgba(0,0,0,0.06)',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{
                  height: '3px',
                  background: i === 0
                    ? 'linear-gradient(90deg, #6728e4, #814bfe)'
                    : i === 1
                    ? 'linear-gradient(90deg, #6728e4, #ff81aa)'
                    : 'linear-gradient(90deg, #ff81aa, #814bfe)',
                }} />
                <div style={{ padding: '36px 32px' }}>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: '#191c20', marginBottom: '4px' }}>
                    {pkg.name}
                  </p>
                  <p style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.8rem',
                    background: 'linear-gradient(135deg, #6728e4, #ff81aa)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text', marginBottom: '20px', lineHeight: 1.2,
                  }}>
                    {pkg.price}
                  </p>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    <span style={{ background: '#e1e0ff', color: '#6728e4', borderRadius: '999px', padding: '5px 14px', fontSize: '0.78rem', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {pkg.kolRange}
                    </span>
                    <span style={{ background: '#f3eaff', color: '#6728e4', borderRadius: '999px', padding: '5px 14px', fontSize: '0.78rem', fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {pkg.reach} reach
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '24px' }}>
                    {pkg.platforms.map((p) => (
                      <span key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f8f9ff', color: '#464652', borderRadius: '6px', padding: '4px 10px', fontSize: '0.72rem', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {platformIcons[p]}
                        {p}
                      </span>
                    ))}
                  </div>

                  <div style={{ height: '1px', background: '#e1e0ff', marginBottom: '24px' }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                    {pkg.features.map((f) => (
                      <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <CheckCircle2 size={16} color="#6728e4" style={{ flexShrink: 0, marginTop: '1px' }} />
                        <span style={{ color: '#464652', fontSize: '0.875rem', lineHeight: 1.5, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={`/brand/form?paket=${pkg.slug}`}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem' }}
                  >
                    <Sparkles size={16} />
                    Konsultasi Gratis
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .brand-grid { grid-template-columns: 1fr !important; max-width: 480px; margin: 0 auto; }
        }
        @media (min-width: 901px) and (max-width: 1100px) {
          .brand-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
