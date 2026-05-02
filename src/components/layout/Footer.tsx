import { Link } from 'react-router-dom';
import { Music2, Mail, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#F2F0FF', position: 'relative', overflow: 'hidden' }}>
      {/* Main footer content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px 32px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '48px',
            marginBottom: '48px',
          }}
        >
          {/* Column 1: Logo + tagline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <img src="/icon.png" alt="Azera" style={{ height: '36px', objectFit: 'contain' }} />
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1A1040', letterSpacing: '0.05em' }}>
                AZERA
              </span>
            </div>
            <p style={{ color: '#8B87B0', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '220px' }}>
              Scale Brands. Amplify Impact.
            </p>
            <p style={{ color: '#8B87B0', fontSize: '0.85rem', marginTop: '8px', lineHeight: 1.6 }}>
              KOL Campaign Engine for Growing Brands — connecting you with 20,000+ Nano & Micro KOL across Indonesia.
            </p>
          </div>

          {/* Column 2: Links */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A1040', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Brand', to: '/brand' },
                { label: 'KOL', to: '/kol' },
                { label: 'Portfolio', to: '/portfolio' },
                { label: 'Daftar KOL', to: '/kol/register' },
                { label: 'Mulai Kampanye', to: '/brand/form' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    style={{ color: '#8B87B0', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#6B2EE8')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#8B87B0')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A1040', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Social Media
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: <span style={{ fontSize: '14px' }}>📸</span>, label: '@azerakol.id', href: 'https://www.instagram.com/azerakol.id/' },
                { icon: <Music2 size={16} />, label: '@azerakol.id', href: '#' },
                { icon: <span style={{ fontSize: '14px' }}>💼</span>, label: 'Azera KOL', href: '#' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#8B87B0',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#6B2EE8')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8B87B0')}
                >
                  {social.icon}
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A1040', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Kontak
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href="https://azerakol.id"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8B87B0', textDecoration: 'none', fontSize: '0.9rem' }}
              >
                <Globe size={16} />
                azerakol.id
              </a>
              <a
                href="mailto:hello@azerakol.id"
                style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8B87B0', textDecoration: 'none', fontSize: '0.9rem' }}
              >
                <Mail size={16} />
                hello@azerakol.id
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #E0DCFF', paddingTop: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <p style={{ color: '#8B87B0', fontSize: '0.85rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            © 2026 Azera. All rights reserved.
          </p>
        </div>
      </div>

      {/* Giant AZERA watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 'clamp(80px, 15vw, 160px)',
          fontWeight: 900,
          color: '#6B2EE8',
          opacity: 0.06,
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          pointerEvents: 'none',
          lineHeight: 1,
        }}
      >
        AZERA
      </div>
    </footer>
  );
}
