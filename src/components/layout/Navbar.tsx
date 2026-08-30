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
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
          width: '92%',
          maxWidth: '980px',
          borderRadius: '999px',
          background: '#ffffff',
          border: '1.5px solid var(--outline-variant)',
          boxShadow: scrolled ? '0 8px 28px rgba(25,28,32,0.1)' : '0 4px 16px rgba(25,28,32,0.06)',
          transition: 'box-shadow 0.25s ease',
        }}
      >
        <div
          style={{
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <img src="/icon.png" alt="AzeraKOL" style={{ height: '26px', objectFit: 'contain' }} />
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontStyle: 'italic',
                fontSize: '1.05rem',
                color: 'var(--primary)',
                letterSpacing: '-0.02em',
              }}
            >
              AZERAKOL
            </span>
          </Link>

          <div className="navbar-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, justifyContent: 'center' }}>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontFamily: "var(--font-display)",
                  fontWeight: isActive(link.to) ? 700 : 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  color: isActive(link.to) ? 'var(--secondary)' : 'var(--on-surface-variant)',
                  letterSpacing: '-0.01em',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navbar-desktop-ctas" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <Link to="/kol/register" className="btn-ghost" style={{ fontSize: '0.85rem', padding: '9px 16px', color: 'var(--primary)' }}>
              Daftar KOL
            </Link>
            <Link to="/brand/form" className="btn-primary" style={{ fontSize: '0.85rem', padding: '9px 20px', boxShadow: 'none' }}>
              Saya Brand
            </Link>
          </div>

          <button
            className="navbar-hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '4px', display: 'none' }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      <div style={{ height: '88px' }} aria-hidden="true" />

      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '84px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 999,
            width: '95%',
            maxWidth: '480px',
            background: '#ffffff',
            border: '1.5px solid var(--outline-variant)',
            borderRadius: '24px',
            boxShadow: '0 8px 28px rgba(25,28,32,0.1)',
            padding: '16px 24px 20px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '16px' }}>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  fontFamily: "var(--font-display)",
                  fontWeight: isActive(link.to) ? 700 : 600,
                  fontSize: '0.98rem',
                  textDecoration: 'none',
                  color: isActive(link.to) ? 'var(--secondary)' : 'var(--on-background)',
                  background: isActive(link.to) ? 'rgba(103,40,228,0.06)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/kol/register" className="btn-outline" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'center' }}>
              Daftar KOL
            </Link>
            <Link to="/brand/form" className="btn-primary" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'center' }}>
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
