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
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          width: '95%',
          maxWidth: '1280px',
          borderRadius: '999px',
          background: scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: scrolled
            ? '0 8px 32px rgba(46,49,146,0.15), 0 2px 8px rgba(0,0,0,0.04)'
            : '0 4px 20px rgba(46,49,146,0.08)',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          padding: '12px 32px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <img src="/icon.png" alt="Azera" style={{ height: '28px', objectFit: 'contain' }} />
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
          </Link>

          <div
            className="navbar-desktop-links"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: isActive(link.to) ? 700 : 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  color: isActive(link.to) ? '#6728e4' : '#464652',
                  background: isActive(link.to) ? 'rgba(103,40,228,0.08)' : 'transparent',
                  letterSpacing: '-0.01em',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div
            className="navbar-desktop-ctas"
            style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}
          >
            <Link
              to="/kol/register"
              className="btn-ghost"
              style={{ fontSize: '0.85rem', padding: '9px 16px', color: '#15157d' }}
            >
              Daftar KOL
            </Link>
            <Link
              to="/brand/form"
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '9px 20px' }}
            >
              Saya Brand
            </Link>
          </div>

          <button
            className="navbar-hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#15157d',
              padding: '4px',
              display: 'none',
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '88px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '480px',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.3)',
            boxShadow: '0 20px 60px rgba(46,49,146,0.15)',
            padding: '20px',
            zIndex: 999,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '20px' }}>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: isActive(link.to) ? 700 : 600,
                  fontSize: '1rem',
                  textDecoration: 'none',
                  color: isActive(link.to) ? '#6728e4' : '#191c20',
                  background: isActive(link.to) ? 'rgba(103,40,228,0.08)' : 'transparent',
                  transition: 'all 0.2s',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/kol/register" className="btn-outline" style={{ justifyContent: 'center' }}>
              Daftar KOL
            </Link>
            <Link to="/brand/form" className="btn-primary" style={{ justifyContent: 'center' }}>
              Saya Brand
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .navbar-desktop-links { display: none !important; }
          .navbar-desktop-ctas { display: none !important; }
          .navbar-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
