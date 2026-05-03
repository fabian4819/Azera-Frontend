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
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: scrolled ? 'rgba(8,6,15,0.92)' : 'rgba(8,6,15,0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          transition: 'background 0.3s ease',
        }}
      >
        {/* Gradient bottom line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #6B2EE8, #E8197A, #38C6F0, transparent)',
            opacity: 0.6,
          }}
        />

        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
          }}
        >
          {/* Logo */}
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
            <img src="/icon.png" alt="Azera" style={{ height: '32px', objectFit: 'contain' }} />
            <span
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: '1.15rem',
                color: '#FFFFFF',
                letterSpacing: '0.12em',
              }}
            >
              AZERA
            </span>
          </Link>

          {/* Center nav — desktop */}
          <div
            className="navbar-links"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontWeight: active ? 700 : 500,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    color: active ? 'transparent' : 'rgba(255,255,255,0.6)',
                    background: active ? 'linear-gradient(135deg, #6B2EE8, #E8197A)' : 'transparent',
                    WebkitBackgroundClip: active ? 'text' : 'unset',
                    WebkitTextFillColor: active ? 'transparent' : 'unset',
                    backgroundClip: active ? 'text' : 'unset',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right CTAs — desktop */}
          <div
            className="navbar-ctas"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
          >
            <Link to="/kol/register" className="btn-ghost" style={{ fontSize: '0.85rem', padding: '9px 16px' }}>
              Daftar KOL
            </Link>
            <Link to="/brand/form" className="btn-primary" style={{ fontSize: '0.85rem', padding: '9px 20px' }}>
              Saya Brand
            </Link>
          </div>

          {/* Hamburger — mobile */}
          <button
            className="navbar-hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.8)',
              padding: '4px',
              display: 'none',
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile slide-down menu */}
        {menuOpen && (
          <div
            style={{
              background: 'rgba(8,6,15,0.98)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              padding: '20px 24px 28px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '20px' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontWeight: isActive(link.to) ? 700 : 500,
                    fontSize: '1rem',
                    textDecoration: 'none',
                    color: isActive(link.to) ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                    background: isActive(link.to) ? 'rgba(107,46,232,0.15)' : 'transparent',
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
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .navbar-links { display: none !important; }
          .navbar-ctas { display: none !important; }
          .navbar-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
