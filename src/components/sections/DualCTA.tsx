import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function DualCTA() {
  return (
    <section>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
        className="dual-cta-grid"
      >
        {/* Left: Brand */}
        <div
          style={{
            background: '#0F0A2E',
            padding: '80px 64px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'rgba(107,46,232,0.25)',
              filter: 'blur(80px)',
              top: '-100px',
              left: '-100px',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(107,46,232,0.3)',
                color: '#A78BFA',
                borderRadius: '999px',
                padding: '6px 16px',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '20px',
              }}
            >
              Untuk Brand
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.2,
                marginBottom: '16px',
              }}
            >
              Saya Brand
            </h2>
            <p style={{ color: '#8B87B0', fontSize: '1rem', lineHeight: 1.7, marginBottom: '32px', maxWidth: '360px' }}>
              Scale bisnis kamu dengan kekuatan KOL community. Mulai kampanye hari ini dan jangkau jutaan konsumen potensial.
            </p>
            <Link to="/brand" className="btn-primary" style={{ alignSelf: 'flex-start', gap: '10px' }}>
              Mulai Kampanye
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Right: KOL */}
        <div
          style={{
            background: 'linear-gradient(135deg, #6B2EE8 0%, #E8197A 100%)',
            padding: '80px 64px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              filter: 'blur(80px)',
              bottom: '-100px',
              right: '-100px',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                borderRadius: '999px',
                padding: '6px 16px',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '20px',
              }}
            >
              Untuk KOL
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.2,
                marginBottom: '16px',
              }}
            >
              Saya KOL
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '32px', maxWidth: '360px' }}>
              Bergabung dengan komunitas 20,000+ KOL Azera. Dapatkan brand deal, campaign brief, dan dukungan penuh dari tim kami.
            </p>
            <Link
              to="/kol/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'white',
                color: '#1A1040',
                borderRadius: '999px',
                padding: '14px 28px',
                fontWeight: 700,
                fontSize: '0.95rem',
                textDecoration: 'none',
                transition: 'transform 0.2s',
                alignSelf: 'flex-start',
              }}
            >
              Bergabung Sekarang
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .dual-cta-grid { grid-template-columns: 1fr !important; }
          .dual-cta-grid > div { padding: 60px 32px !important; }
        }
      `}</style>
    </section>
  );
}
