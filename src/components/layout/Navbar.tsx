import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Brand', to: '/brand' },
  { label: 'KOL', to: '/kol' },
  { label: 'Portfolio', to: '/portfolio' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        background: scrolled ? 'white' : 'transparent',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/icon.png" alt="Azera icon" style={{ height: '36px', width: '36px', objectFit: 'contain' }} />
          <span
            style={{
              fontWeight: 800,
              fontSize: '1.25rem',
              color: scrolled ? '#1A1040' : 'white',
              letterSpacing: '0.05em',
            }}
          >
            AZERA
          </span>
        </Link>

        {/* Desktop nav links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          className="hidden-mobile"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 500,
                fontSize: '0.95rem',
                textDecoration: 'none',
                color: isActive(link.to)
                  ? '#6B2EE8'
                  : scrolled
                  ? '#1A1040'
                  : 'rgba(255,255,255,0.85)',
                transition: 'color 0.2s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }} className="hidden-mobile">
          <Link
            to="/kol"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              border: `1.5px solid ${scrolled ? '#6B2EE8' : 'white'}`,
              color: scrolled ? '#6B2EE8' : 'white',
              background: 'transparent',
              borderRadius: '999px',
              padding: '9px 20px',
              fontWeight: 600,
              fontSize: '0.875rem',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            Daftar KOL
          </Link>
          <Link
            to="/brand"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: scrolled ? '#0F0A2E' : 'white',
              color: scrolled ? 'white' : '#1A1040',
              borderRadius: '999px',
              padding: '9px 20px',
              fontWeight: 600,
              fontSize: '0.875rem',
              textDecoration: 'none',
              border: 'none',
              transition: 'all 0.2s',
            }}
          >
            Saya Brand
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: scrolled ? '#1A1040' : 'white',
            padding: '8px',
          }}
          className="show-mobile"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          style={{
            background: 'white',
            borderTop: '1px solid #F0EEFF',
            padding: '16px 24px 24px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          }}
          className="show-mobile"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: 'block',
                padding: '12px 0',
                fontWeight: 500,
                fontSize: '1rem',
                textDecoration: 'none',
                color: isActive(link.to) ? '#6B2EE8' : '#1A1040',
                borderBottom: '1px solid #F0EEFF',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
            <Link to="/kol" className="btn-outline" style={{ padding: '10px 20px', fontSize: '0.875rem' }}>
              Daftar KOL
            </Link>
            <Link to="/brand" className="btn-dark" style={{ padding: '10px 20px', fontSize: '0.875rem' }}>
              Saya Brand
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
