import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const navLinks = [{ label: 'Home', to: '/' }];

// belum ada landing page khusus per service, redirect sengaja dikosongkan dulu
const services = ['Engagement Boost', 'KOL Marketing', 'Affiliate Marketing'];

const registerOptions = [
  { label: 'KOL', to: '/kol/register' },
  { label: 'Brand', to: '/brand/form' },
];

const WA_PHONE = '6281994035538';
const WA_MESSAGE = 'Halo AzeraKOL!\nSaya ingin tanya-tanya, boleh dibantu?';
const WA_LINK = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(WA_MESSAGE)}`;

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [mobileServiceOpen, setMobileServiceOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [mobileRegisterOpen, setMobileRegisterOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const serviceCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const registerCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openService = () => {
    if (serviceCloseTimer.current) clearTimeout(serviceCloseTimer.current);
    setServiceOpen(true);
  };
  const closeServiceDelayed = () => {
    serviceCloseTimer.current = setTimeout(() => setServiceOpen(false), 150);
  };

  const openRegister = () => {
    if (registerCloseTimer.current) clearTimeout(registerCloseTimer.current);
    setRegisterOpen(true);
  };
  const closeRegisterDelayed = () => {
    registerCloseTimer.current = setTimeout(() => setRegisterOpen(false), 150);
  };

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
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontFamily: "var(--font-display)",
                fontWeight: isActive('/') ? 700 : 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                color: isActive('/') ? 'var(--secondary)' : 'var(--on-surface-variant)',
                letterSpacing: '-0.01em',
              }}
            >
              Home
            </Link>

            <div
              style={{ position: 'relative' }}
              onMouseEnter={openService}
              onMouseLeave={closeServiceDelayed}
            >
              <button
                onClick={() => setServiceOpen((v) => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'none', cursor: 'pointer',
                  fontFamily: "var(--font-display)", fontWeight: 600, fontSize: '0.9rem',
                  color: 'var(--on-surface-variant)', letterSpacing: '-0.01em',
                }}
              >
                Service
                <ChevronDown size={14} style={{ transform: serviceOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>

              {serviceOpen && (
                <div
                  style={{
                    position: 'absolute', top: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)',
                    background: '#ffffff', border: '1.5px solid var(--outline-variant)', borderRadius: '16px',
                    boxShadow: '0 12px 32px rgba(25,28,32,0.12)', padding: '8px', minWidth: '220px',
                  }}
                >
                  {services.map((label) => (
                    <span
                      key={label}
                      style={{
                        display: 'block', padding: '10px 14px', borderRadius: '10px',
                        fontFamily: "var(--font-display)", fontWeight: 600, fontSize: '0.88rem',
                        color: 'var(--on-background)', whiteSpace: 'nowrap', cursor: 'default',
                      }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/portfolio"
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontFamily: "var(--font-display)",
                fontWeight: isActive('/portfolio') ? 700 : 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                color: isActive('/portfolio') ? 'var(--secondary)' : 'var(--on-surface-variant)',
                letterSpacing: '-0.01em',
              }}
            >
              Portfolio
            </Link>
          </div>

          <div className="navbar-desktop-ctas" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div
              style={{ position: 'relative' }}
              onMouseEnter={openRegister}
              onMouseLeave={closeRegisterDelayed}
            >
              <button
                onClick={() => setRegisterOpen((v) => !v)}
                className="btn-ghost"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', padding: '9px 16px', color: 'var(--primary)', border: 'none', cursor: 'pointer' }}
              >
                Daftar
                <ChevronDown size={14} style={{ transform: registerOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>

              {registerOpen && (
                <div
                  style={{
                    position: 'absolute', top: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)',
                    background: '#ffffff', border: '1.5px solid var(--outline-variant)', borderRadius: '16px',
                    boxShadow: '0 12px 32px rgba(25,28,32,0.12)', padding: '8px', minWidth: '140px',
                  }}
                >
                  {registerOptions.map((opt) => (
                    <Link
                      key={opt.label}
                      to={opt.to}
                      onClick={() => { setRegisterOpen(false); setMenuOpen(false); }}
                      style={{
                        display: 'block', padding: '10px 14px', borderRadius: '10px',
                        fontFamily: "var(--font-display)", fontWeight: 600, fontSize: '0.88rem',
                        textDecoration: 'none', color: 'var(--on-background)', whiteSpace: 'nowrap',
                      }}
                    >
                      {opt.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '0.85rem', padding: '9px 20px', boxShadow: 'none' }}>
              Contact Us
            </a>
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

            <button
              onClick={() => setMobileServiceOpen((v) => !v)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer',
                fontFamily: "var(--font-display)", fontWeight: 600, fontSize: '0.98rem', color: 'var(--on-background)',
              }}
            >
              Service
              <ChevronDown size={16} style={{ transform: mobileServiceOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
            </button>
            {mobileServiceOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '14px' }}>
                {services.map((label) => (
                  <span
                    key={label}
                    style={{
                      padding: '10px 14px', borderRadius: '10px', fontFamily: "var(--font-display)",
                      fontWeight: 600, fontSize: '0.9rem', color: 'var(--on-surface-variant)',
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}

            <Link
              to="/portfolio"
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                fontFamily: "var(--font-display)",
                fontWeight: isActive('/portfolio') ? 700 : 600,
                fontSize: '0.98rem',
                textDecoration: 'none',
                color: isActive('/portfolio') ? 'var(--secondary)' : 'var(--on-background)',
                background: isActive('/portfolio') ? 'rgba(103,40,228,0.06)' : 'transparent',
              }}
            >
              Portfolio
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => setMobileRegisterOpen((v) => !v)}
              className="btn-outline"
              style={{ justifyContent: 'space-between', cursor: 'pointer' }}
            >
              Daftar
              <ChevronDown size={16} style={{ transform: mobileRegisterOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
            </button>
            {mobileRegisterOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
                {registerOptions.map((opt) => (
                  <Link
                    key={opt.label}
                    to={opt.to}
                    className="btn-outline"
                    onClick={() => { setMenuOpen(false); setMobileRegisterOpen(false); }}
                    style={{ justifyContent: 'center' }}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            )}
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary" onClick={() => setMenuOpen(false)} style={{ justifyContent: 'center' }}>
              Contact Us
            </a>
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
