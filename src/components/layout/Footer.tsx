import { Link } from 'react-router-dom';
import { Camera, ExternalLink, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#f0f1f5', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 24px 0', position: 'relative', zIndex: 1 }}>
        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '48px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <img src="/icon.png" alt="Azera" style={{ height: '32px', objectFit: 'contain' }} />
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 900,
                  fontStyle: 'italic',
                  fontSize: '1.1rem',
                  color: '#15157d',
                  letterSpacing: '-0.02em',
                }}
              >
                AZERA
              </span>
            </div>
            <p
              style={{
                color: '#464652',
                fontSize: '0.875rem',
                lineHeight: 1.7,
                maxWidth: '220px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Platform KOL campaign agency terpercaya di Indonesia. Kami menghubungkan brand dengan ribuan KOL terkurasi.
            </p>
          </div>

          <div>
            <h4
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: '0.8rem',
                color: '#15157d',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Platform
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Untuk Brand', to: '/brand' },
                { label: 'Untuk KOL', to: '/kol' },
                { label: 'Portfolio', to: '/portfolio' },
                { label: 'Paket & Harga', to: '/brand' },
              ].map((item) => (
                <Link
                  key={item.to + item.label}
                  to={item.to}
                  style={{
                    color: '#464652',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#6728e4')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#464652')}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: '0.8rem',
                color: '#15157d',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Social
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href="https://www.instagram.com/azerakol.id/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', color: '#464652',
                  fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#6728e4')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#464652')}
              >
                <Camera size={15} /> Instagram
              </a>
              {['TikTok', 'LinkedIn'].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px', color: '#464652',
                    fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#6728e4')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#464652')}
                >
                  <ExternalLink size={15} /> {platform}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: '0.8rem',
                color: '#15157d',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              Kontak
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href="https://wa.me/6288201586126"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', color: '#464652',
                  fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#6728e4')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#464652')}
              >
                <ExternalLink size={15} /> WhatsApp
              </a>
              <a
                href="mailto:hello@azerakol.id"
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', color: '#464652',
                  fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#6728e4')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#464652')}
              >
                <Mail size={15} /> hello@azerakol.id
              </a>
            </div>
          </div>
        </div>

        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #c7c8cf, transparent)',
            margin: '48px 0 0',
          }}
        />
      </div>

      <div style={{ position: 'relative', textAlign: 'center', overflow: 'hidden', paddingBottom: '20px' }}>
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(6rem, 18vw, 14rem)',
            lineHeight: 0.85,
            color: '#15157d',
            opacity: 0.04,
            userSelect: 'none',
            pointerEvents: 'none',
            padding: '20px 0 0',
          }}
        >
          AZERA
        </div>
        <div style={{ position: 'absolute', bottom: '20px', left: 0, right: 0, textAlign: 'center' }}>
          <p style={{ color: '#777683', fontSize: '0.78rem', letterSpacing: '0.05em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            &copy; {new Date().getFullYear()} Azera KOL Agency. All rights reserved.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
