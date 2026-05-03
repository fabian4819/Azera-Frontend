import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Camera, Play, ExternalLink } from 'lucide-react';
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
    <div style={{ background: '#FAFAFA', minHeight: '100vh' }}>
      {/* Dark hero */}
      <div
        style={{
          background: '#08060F',
          padding: '140px 24px 100px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="orb" style={{ width: '400px', height: '400px', background: '#6B2EE8', top: '-150px', left: '10%' }} />
        <div className="orb" style={{ width: '300px', height: '300px', background: '#E8197A', bottom: '-100px', right: '10%' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
          <span className="section-label" style={{ display: 'inline-block', marginBottom: '16px' }}>
            Untuk Brand
          </span>
          <motion.h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              color: '#EDE9F8',
              lineHeight: 1.05,
              marginBottom: '20px',
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            Pilih Paket{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Kampanye
            </span>{' '}
            Kamu.
          </motion.h1>
          <motion.p
            style={{
              color: '#8B87A8',
              fontSize: '1.05rem',
              lineHeight: 1.75,
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.15 }}
          >
            Dari kampanye skala kecil hingga massive KOL campaign — Azera punya solusi untuk setiap kebutuhan brand.
          </motion.p>
        </div>

        {/* Bottom wave shape */}
        <div
          style={{
            position: 'absolute',
            bottom: -1,
            left: 0,
            right: 0,
            height: '40px',
            background: '#FAFAFA',
            borderRadius: '50% 50% 0 0 / 40px 40px 0 0',
          }}
        />
      </div>

      {/* Package cards */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px 100px' }}>
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px', alignItems: 'start' }}
          className="brand-grid"
        >
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut, delay: i * 0.12 }}
              style={{ position: 'relative' }}
            >
              {/* Popular badge */}
              {pkg.popular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                    color: 'white',
                    borderRadius: '999px',
                    padding: '5px 18px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    fontFamily: 'Syne, sans-serif',
                    letterSpacing: '0.1em',
                    whiteSpace: 'nowrap',
                    zIndex: 10,
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
                    ? '0 8px 48px rgba(107,46,232,0.2), 0 0 0 2px #6B2EE8'
                    : '0 4px 24px rgba(107,46,232,0.07)',
                  border: pkg.popular ? '1px solid #6B2EE8' : '1px solid rgba(107,46,232,0.06)',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Top gradient accent */}
                <div
                  style={{
                    height: '3px',
                    background:
                      i === 0
                        ? 'linear-gradient(90deg, #6B2EE8, #7C3AFF)'
                        : i === 1
                        ? 'linear-gradient(90deg, #6B2EE8, #E8197A)'
                        : 'linear-gradient(90deg, #E8197A, #38C6F0)',
                  }}
                />

                <div style={{ padding: '36px 32px' }}>
                  {/* Package name */}
                  <p
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 800,
                      fontSize: '1.4rem',
                      color: '#120E28',
                      marginBottom: '4px',
                    }}
                  >
                    {pkg.name}
                  </p>

                  {/* Price */}
                  <p
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 900,
                      fontSize: '1.8rem',
                      background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      marginBottom: '20px',
                      lineHeight: 1.2,
                    }}
                  >
                    {pkg.price}
                  </p>

                  {/* KOL count + reach */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    <span
                      style={{
                        background: '#F0EEFF',
                        color: '#6B2EE8',
                        borderRadius: '999px',
                        padding: '5px 14px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        fontFamily: 'Syne, sans-serif',
                      }}
                    >
                      {pkg.kolRange}
                    </span>
                    <span
                      style={{
                        background: '#F0FFF4',
                        color: '#065F46',
                        borderRadius: '999px',
                        padding: '5px 14px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        fontFamily: 'Syne, sans-serif',
                      }}
                    >
                      {pkg.reach} reach
                    </span>
                  </div>

                  {/* Platform badges */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '24px' }}>
                    {pkg.platforms.map((p) => (
                      <span
                        key={p}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: '#F8F7FF',
                          color: '#5B5780',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                        }}
                      >
                        {platformIcons[p]}
                        {p}
                      </span>
                    ))}
                  </div>

                  {/* Divider */}
                  <div style={{ height: '1px', background: '#F0EEFF', marginBottom: '24px' }} />

                  {/* Features */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                    {pkg.features.map((f) => (
                      <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <CheckCircle2
                          size={16}
                          color="#6B2EE8"
                          style={{ flexShrink: 0, marginTop: '1px' }}
                        />
                        <span style={{ color: '#5B5780', fontSize: '0.875rem', lineHeight: 1.5, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    to={`/brand/form?paket=${pkg.slug}`}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem' }}
                  >
                    Konsultasi Gratis →
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
