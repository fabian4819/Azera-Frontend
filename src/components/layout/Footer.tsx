import { Link } from 'react-router-dom';
import { Camera, ExternalLink, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--primary)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px 32px' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr 1fr', gap: '40px', marginBottom: '48px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <img src="/icon.png" alt="AzeraKOL" style={{ height: '28px', objectFit: 'contain' }} />
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontStyle: 'italic', fontSize: '1.05rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
                AZERAKOL
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: '260px', fontFamily: "var(--font-display)" }}>
              Platform KOL campaign agency terpercaya di Indonesia, menghubungkan brand dengan ribuan KOL terkurasi.
            </p>
          </div>

          <div>
            <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Platform
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Untuk Brand', to: '/brand' },
                { label: 'Untuk KOL', to: '/kol' },
                { label: 'Portfolio', to: '/portfolio' },
                { label: 'Paket & Harga', to: '/brand' },
              ].map((item) => (
                <Link
                  key={item.to + item.label}
                  to={item.to}
                  style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s', fontFamily: "var(--font-display)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#ffffff')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)')}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Social
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href="https://www.instagram.com/azerakol.id/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s', fontFamily: "var(--font-display)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#ffffff')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)')}
              >
                <Camera size={14} /> Instagram
              </a>
              {['TikTok', 'LinkedIn'].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s', fontFamily: "var(--font-display)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#ffffff')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)')}
                >
                  <ExternalLink size={14} /> {platform}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Kontak
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href="https://wa.me/6288201586126"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s', fontFamily: "var(--font-display)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#ffffff')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)')}
              >
                <ExternalLink size={14} /> WhatsApp
              </a>
              <a
                href="mailto:hello@azerakol.id"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s', fontFamily: "var(--font-display)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#ffffff')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)')}
              >
                <Mail size={14} /> hello@azerakol.id
              </a>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', fontFamily: "var(--font-display)" }}>
            &copy; {new Date().getFullYear()} AzeraKOL Agency. All rights reserved.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', fontFamily: "var(--font-display)" }}>
            Jasa KOL Management & Influencer Marketing Indonesia
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
