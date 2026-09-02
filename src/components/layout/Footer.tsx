import { Link } from 'react-router-dom';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { SiInstagram } from 'react-icons/si';
import { FaWhatsapp } from 'react-icons/fa';

const linkStyle: CSSProperties = {
  color: 'var(--on-surface-variant)',
  fontSize: '0.9rem',
  lineHeight: 1.5,
  textDecoration: 'none',
  transition: 'color 0.2s',
  fontFamily: "var(--font-display)",
};

const headingStyle: CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 800,
  fontSize: '0.75rem',
  color: 'var(--secondary)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: '22px',
};

const socialIconStyle: CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: 'rgba(103,40,228,0.08)',
  color: 'var(--secondary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.2s, color 0.2s',
};

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      style={linkStyle}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--on-background)')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--on-surface-variant)')}
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
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--on-background)')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--on-surface-variant)')}
    >
      {children}
    </a>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={socialIconStyle}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)'; e.currentTarget.style.color = '#ffffff'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(103,40,228,0.08)'; e.currentTarget.style.color = 'var(--secondary)'; }}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: '#ffffff', borderRadius: '32px 32px 0 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', paddingBottom: '28px', borderBottom: '1px solid var(--outline-variant)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo-transparent.png" alt="AzeraKOL" style={{ height: '28px', objectFit: 'contain' }} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1.05rem', color: 'var(--on-background)', letterSpacing: '-0.045em' }}>
              PT AZERA CREATOR NETWORK
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SocialIcon href="https://www.instagram.com/azerakol.id/" label="Instagram"><SiInstagram size={16} /></SocialIcon>
            <SocialIcon href="https://wa.me/6281919525186" label="WhatsApp"><FaWhatsapp size={17} /></SocialIcon>
            <SocialIcon href="mailto:hello@azerakol.id" label="Email"><Mail size={16} /></SocialIcon>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px 40px' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.3fr', gap: '40px', alignItems: 'stretch' }}>
          <div>
            <h4 style={headingStyle}>Services</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <FooterLink to="/service/kol-marketing">KOL Marketing</FooterLink>
              <FooterLink to="/service/engagement-boost">Engagement Boost</FooterLink>
              <FooterLink to="/service/affiliate-marketing">Affiliate Marketing</FooterLink>
            </div>
          </div>

          <div>
            <h4 style={headingStyle}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <FooterLink to="/portfolio">Portfolio</FooterLink>
              <FooterLink to="/brand">Untuk Brand</FooterLink>
              <FooterLink to="/kol">Untuk KOL</FooterLink>
              <FooterLink to="/privacy-policy">Kebijakan Privasi</FooterLink>
            </div>
          </div>

          <div>
            <h4 style={headingStyle}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <FooterAnchor href="mailto:hello@azerakol.id">hello@azerakol.id</FooterAnchor>
              <FooterAnchor href="https://wa.me/6281919525186">+62 819-1952-5186</FooterAnchor>
              <FooterAnchor href={`https://maps.google.com/?q=${encodeURIComponent('Gedung Sovoism, Jl. Dr. Cipto No. 20, Kel. Bugangan, Kec. Semarang Timur, Kota Semarang')}`}>
                Gedung Sovoism<br />
                Jl. Dr. Cipto No. 20, Kel. Bugangan,<br />
                Kec. Semarang Timur, Kota Semarang
              </FooterAnchor>
            </div>
          </div>

          <div
            style={{
              position: 'relative',
              borderRadius: '20px',
              padding: '28px',
              background:
                'radial-gradient(85% 65% at 50% -8%, #8c68d4, rgba(140,104,212,0) 58%),' +
                'linear-gradient(180deg, #7d54d2 0%, #7650cd 52%, #6f4ac6 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '24px',
              minHeight: '220px',
            }}
          >
            <div style={{ border: '1.5px dashed rgba(255,255,255,0.4)', borderRadius: '14px', padding: '18px' }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: '1.3rem', lineHeight: 1.25, color: '#ffffff', margin: 0 }}>
                Platform lengkap kelola <span className="mark-lime">campaign KOL</span> & influencer marketing.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <Link to="/brand/form" className="btn-outline-white" style={{ fontSize: '0.85rem', padding: '9px 16px' }}>
                Start <ArrowRight size={14} />
              </Link>
              <a href="https://wa.me/6281919525186?text=Halo%20AzeraKOL!%0ASaya%20ingin%20tanya-tanya%2C%20boleh%20dibantu%3F" target="_blank" rel="noopener noreferrer" className="btn-lime" style={{ fontSize: '0.85rem', padding: '9px 18px' }}>
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 32px' }}>
        <div style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.82rem', fontFamily: "var(--font-display)" }}>
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
