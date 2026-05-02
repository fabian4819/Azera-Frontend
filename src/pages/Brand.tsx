import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Zap } from 'lucide-react';
import { packages } from '../data/packages';

const platformColors: Record<string, { bg: string; color: string }> = {
  Instagram: { bg: '#FFF0F7', color: '#E8197A' },
  TikTok: { bg: '#F0FDF4', color: '#065F46' },
  YouTube: { bg: '#FFF7ED', color: '#C2410C' },
  'All platforms': { bg: '#F0EEFF', color: '#6B2EE8' },
  Live: { bg: '#FEF3C7', color: '#92400E' },
};

export default function Brand() {
  return (
    <div style={{ background: '#F2F0FF', minHeight: '100vh', paddingTop: '80px' }}>
      {/* Hero */}
      <div style={{ background: '#0F0A2E', padding: '80px 24px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="orb" style={{ width: '400px', height: '400px', background: 'rgba(107,46,232,0.3)', top: '-150px', left: '-100px' }} />
        <div className="orb" style={{ width: '300px', height: '300px', background: 'rgba(232,25,122,0.2)', bottom: '-100px', right: '-80px' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-label" style={{ color: '#38C6F0', display: 'block', marginBottom: '16px' }}>
            Paket Kampanye KOL
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '16px' }}>
            Pilih Paket yang <span className="gradient-text">Tepat</span>
          </h1>
          <p style={{ color: '#8B87B0', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
            Dari brand baru hingga perusahaan besar — kami punya paket yang sesuai.
          </p>
        </div>
      </div>

      {/* Package cards */}
      <div style={{ maxWidth: '1200px', margin: '-40px auto 80px', padding: '0 24px' }}>
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}
          className="packages-grid"
        >
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                background: 'white',
                borderRadius: '24px',
                padding: '36px 28px',
                border: pkg.popular ? '2px solid #6B2EE8' : '1px solid #F0EEFF',
                boxShadow: pkg.popular ? '0 8px 40px rgba(107,46,232,0.2)' : '0 4px 24px rgba(107,46,232,0.06)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Popular badge */}
              {pkg.popular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(90deg, #6B2EE8, #E8197A)',
                    color: 'white',
                    borderRadius: '999px',
                    padding: '6px 20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Star size={12} fill="white" />
                  MOST POPULAR
                </div>
              )}

              {/* Package name */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: pkg.popular ? 'linear-gradient(135deg, #6B2EE8, #E8197A)' : '#F0EEFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Zap size={16} color={pkg.popular ? 'white' : '#6B2EE8'} />
                  </div>
                  <h3 style={{ fontWeight: 800, fontSize: '1.3rem', color: '#1A1040' }}>{pkg.name}</h3>
                </div>
                <p style={{ fontSize: '2rem', fontWeight: 900, color: '#6B2EE8', lineHeight: 1 }}>{pkg.price}</p>
                <p style={{ fontSize: '0.8rem', color: '#8B87B0', marginTop: '4px' }}>per kampanye</p>
              </div>

              {/* KOL count */}
              <div style={{ background: '#F2F0FF', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px' }}>
                <p style={{ fontSize: '0.8rem', color: '#8B87B0', marginBottom: '2px' }}>Jumlah KOL</p>
                <p style={{ fontWeight: 700, color: '#1A1040' }}>{pkg.kolRange}</p>
              </div>

              {/* Reach */}
              <div style={{ background: '#F2F0FF', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px' }}>
                <p style={{ fontSize: '0.8rem', color: '#8B87B0', marginBottom: '2px' }}>Est. Reach</p>
                <p style={{ fontWeight: 700, color: '#1A1040' }}>{pkg.reach}</p>
              </div>

              {/* Platforms */}
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '0.8rem', color: '#8B87B0', marginBottom: '8px' }}>Platform</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {pkg.platforms.map((p) => (
                    <span
                      key={p}
                      style={{
                        background: platformColors[p]?.bg || '#F0EEFF',
                        color: platformColors[p]?.color || '#6B2EE8',
                        borderRadius: '999px',
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div style={{ flex: 1, marginBottom: '28px' }}>
                <p style={{ fontSize: '0.8rem', color: '#8B87B0', marginBottom: '12px', fontWeight: 600 }}>Termasuk:</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {pkg.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.875rem', color: '#1A1040' }}>
                      <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <Link
                to={`/brand/form?paket=${pkg.slug}`}
                className={pkg.popular ? 'btn-primary' : 'btn-outline'}
                style={{ width: '100%', justifyContent: 'center', textAlign: 'center' }}
              >
                Konsultasi Gratis
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .packages-grid { grid-template-columns: 1fr !important; } }
        @media (min-width: 769px) and (max-width: 1024px) { .packages-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </div>
  );
}
