import { Link } from 'react-router-dom';
import type { CSSProperties, ReactNode } from 'react';

const linkStyle: CSSProperties = {
  color: 'rgba(255,255,255,0.65)',
  fontSize: '0.9rem',
  textDecoration: 'none',
  transition: 'color 0.2s',
  fontFamily: "var(--font-display)",
};

const headingStyle: CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 800,
  fontSize: '0.75rem',
  color: 'var(--lime)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: '22px',
};

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      style={linkStyle}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#ffffff')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)')}
    >
      {children}
    </Link>
  );
}

function FooterAnchor({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={linkStyle}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#ffffff')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)')}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer
      style={{
        background:
          'radial-gradient(85% 65% at 50% -8%, #8c68d4, rgba(140,104,212,0) 58%),' +
          'linear-gradient(180deg, #7d54d2 0%, #7650cd 52%, #6f4ac6 100%)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 24px 40px' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr', gap: '40px', marginBottom: '56px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <img src="/icon.png" alt="AzeraKOL" style={{ height: '28px', objectFit: 'contain' }} />
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontStyle: 'italic', fontSize: '1.05rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
                AZERAKOL
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', lineHeight: 1.75, maxWidth: '280px', fontFamily: "var(--font-display)" }}>
              Influencer marketing agency yang menghubungkan brand dengan ribuan KOL terkurasi, dari engagement boost, KOL marketing, sampai affiliate marketing.
            </p>
          </div>

          <div>
            <h4 style={headingStyle}>Layanan</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <FooterLink to="/brand">Engagement Boost</FooterLink>
              <FooterLink to="/brand">KOL Marketing</FooterLink>
              <FooterLink to="/brand">Affiliate Marketing</FooterLink>
            </div>
          </div>

          <div>
            <h4 style={headingStyle}>Perusahaan</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <FooterLink to="/portfolio">Portfolio</FooterLink>
              <FooterLink to="/brand">Untuk Brand</FooterLink>
              <FooterLink to="/kol">Untuk KOL</FooterLink>
            </div>
          </div>

          <div>
            <h4 style={headingStyle}>Hubungi Kami</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <FooterAnchor href="mailto:hello@azerakol.id">hello@azerakol.id</FooterAnchor>
              <FooterAnchor href="https://wa.me/6281994035538">+62 819-9403-5538</FooterAnchor>
              <FooterAnchor href="https://www.instagram.com/azerakol.id/">@azerakol.id</FooterAnchor>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '28px', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', fontFamily: "var(--font-display)" }}>
            &copy; {new Date().getFullYear()} AzeraKOL Agency. All rights reserved.
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
