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
    <div style={{ background: 'var(--surface)', minHeight: '100vh' }}>
      <div style={{ padding: '80px 24px 8px', textAlign: 'center' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <span className="tag-pill tag-pill-navy" style={{ margin: '0 auto 18px' }}>Untuk Brand</span>
          <motion.h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
              color: 'var(--on-background)',
              lineHeight: 1.1,
              marginBottom: '18px',
              letterSpacing: '-0.03em',
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            Pilih Paket{' '}
            <span className="underline-accent">
              Campaign
              <svg viewBox="0 0 220 20" preserveAspectRatio="none" fill="none">
                <path d="M2 14C44 4 118 2 218 12" stroke="#6728e4" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </span>{' '}
            Kamu.
          </motion.h1>
          <motion.p
            style={{ color: 'var(--on-surface-variant)', fontSize: '1.02rem', lineHeight: 1.75 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.15 }}
          >
            Dari campaign skala kecil hingga massive KOL campaign, AzeraKOL punya solusi untuk setiap kebutuhan brand.
          </motion.p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '72px 24px 100px' }}>
        <div className="brand-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'start' }}>
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
                  style={{
                    position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--secondary)', color: 'white', borderRadius: '999px',
                    padding: '6px 20px', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em',
                    whiteSpace: 'nowrap', zIndex: 10, fontFamily: "var(--font-display)",
                  }}
                >
                  MOST POPULAR
                </div>
              )}

              <div
                className={pkg.popular ? 'bento-card-dark' : 'bento-card'}
                style={{ overflow: 'hidden', borderColor: pkg.popular ? 'var(--primary)' : undefined }}
              >
                <div style={{ padding: '34px 30px' }}>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: '1.3rem', color: pkg.popular ? '#fff' : 'var(--on-background)', marginBottom: '4px' }}>
                    {pkg.name}
                  </p>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: '1.7rem', color: pkg.popular ? '#fff' : 'var(--secondary)', marginBottom: '18px', lineHeight: 1.2 }}>
                    {pkg.price}
                  </p>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    <span className={`tag-pill ${pkg.popular ? 'tag-pill-white' : 'tag-pill-purple'}`}>{pkg.kolRange}</span>
                    <span className={`tag-pill ${pkg.popular ? 'tag-pill-white' : 'tag-pill-purple'}`}>{pkg.reach} reach</span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '22px' }}>
                    {pkg.platforms.map((p) => (
                      <span
                        key={p}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          background: pkg.popular ? 'rgba(255,255,255,0.1)' : 'var(--surface-container)',
                          color: pkg.popular ? 'rgba(255,255,255,0.8)' : 'var(--on-surface-variant)',
                          borderRadius: '6px', padding: '4px 10px', fontSize: '0.72rem', fontWeight: 600,
                        }}
                      >
                        {platformIcons[p]}
                        {p}
                      </span>
                    ))}
                  </div>

                  <div style={{ height: '1px', background: pkg.popular ? 'rgba(255,255,255,0.12)' : 'var(--outline-variant)', marginBottom: '22px' }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                    {pkg.features.map((f) => (
                      <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <CheckCircle2 size={16} color={pkg.popular ? '#fff' : 'var(--secondary)'} style={{ flexShrink: 0, marginTop: '1px' }} />
                        <span style={{ color: pkg.popular ? 'rgba(255,255,255,0.75)' : 'var(--on-surface-variant)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={`/brand/form?paket=${pkg.slug}`}
                    className={pkg.popular ? 'btn-secondary' : 'btn-primary'}
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem', background: pkg.popular ? '#fff' : undefined, color: pkg.popular ? 'var(--primary)' : undefined }}
                  >
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
