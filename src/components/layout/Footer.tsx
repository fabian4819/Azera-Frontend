import { Link } from 'react-router-dom';
import { Camera, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#08060F', position: 'relative', overflow: 'hidden' }}>
      {/* Top content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 24px 0', position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '48px',
          }}
          className="footer-grid"
        >
          {/* Column 1: Logo + tagline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <img src="/icon.png" alt="Azera" style={{ height: '32px', objectFit: 'contain' }} />
              <span
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: '#FFFFFF',
                  letterSpacing: '0.12em',
                }}
              >
                AZERA
              </span>
            </div>
            <p
              style={{
                color: '#8B87A8',
                fontSize: '0.875rem',
                lineHeight: 1.7,
                maxWidth: '220px',
              }}
            >
              Platform KOL campaign agency terpercaya di Indonesia. Kami menghubungkan brand dengan ribuan KOL terkurasi.
            </p>
          </div>

          {/* Column 2: Platform links */}
          <div>
            <h4
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: '0.8rem',
                color: '#FFFFFF',
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
                    color: '#8B87A8',
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#EDE9F8')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#8B87A8')}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Social */}
          <div>
            <h4
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: '0.8rem',
                color: '#FFFFFF',
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#8B87A8',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#EDE9F8')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#8B87A8')}
              >
                <Camera size={15} />
                Instagram
              </a>
              <a
                href="#"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#8B87A8',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#EDE9F8')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#8B87A8')}
              >
                <ExternalLink size={15} />
                TikTok
              </a>
              <a
                href="#"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#8B87A8',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#EDE9F8')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#8B87A8')}
              >
                <ExternalLink size={15} />
                LinkedIn
              </a>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: '0.8rem',
                color: '#FFFFFF',
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#8B87A8',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#EDE9F8')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#8B87A8')}
              >
                <ExternalLink size={15} />
                WhatsApp
              </a>
              <a
                href="mailto:hello@azerakol.id"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#8B87A8',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#EDE9F8')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#8B87A8')}
              >
                <Mail size={15} />
                hello@azerakol.id
              </a>
            </div>
          </div>
        </div>

        {/* Gradient divider */}
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #6B2EE8, #E8197A, #38C6F0, transparent)',
            opacity: 0.4,
            margin: '56px 0 0',
          }}
        />
      </div>

      {/* Big AZERA watermark + copyright */}
      <div style={{ position: 'relative', textAlign: 'center', overflow: 'hidden' }}>
        {/* Giant text */}
        <div
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(6rem, 18vw, 18rem)',
            lineHeight: 0.85,
            background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            opacity: 0.12,
            userSelect: 'none',
            pointerEvents: 'none',
            padding: '20px 0 0',
          }}
        >
          AZERA
        </div>

        {/* Copyright overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#8B87A8', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
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
