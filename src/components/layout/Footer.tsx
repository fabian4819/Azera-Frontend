import { Link } from 'react-router-dom';
import { useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
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
  fontSize: '0.85rem',
  color: 'var(--secondary)',
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
  // Gaya footer pitch.com: panggung ungu, kartu footer bercorak, dan panel CTA yang awalnya menutupi
  // seluruh grid lalu menyusut ke kolomnya saat masuk layar.
  const reduceMotion = useReducedMotion();

  const gridRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.35 });
  // Lebar overlay = dari tepi kiri grid sampai sedikit di bawah panel. 0 = layout bertumpuk (mobile), tanpa overlay.
  const [sweepWidth, setSweepWidth] = useState(0);
  useLayoutEffect(() => {
    const measure = () => {
      const left = panelRef.current?.offsetLeft ?? 0;
      setSweepWidth(left > 40 ? left + 24 : 0);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);
  const showSweep = !reduceMotion && sweepWidth > 0;
  const reveal = (i: number) => (reduceMotion ? {} : {
    initial: { opacity: 0, y: 14 },
    animate: gridInView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay: 0.45 + i * 0.08 },
  });

  return (
    <div className="footer-stage">
    <footer className="dashboard-main-mobile-pad soft-bg footer-card">
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
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.88rem', lineHeight: 1.7, maxWidth: '640px', margin: '20px 0 0' }}>
          AZERAKOL.ID is a nano&ndash;micro creator campaign specialist operated by PT Azera Creator Network. We help brands execute scalable KOL, KOC, affiliate, and event creator campaigns, from dozens to thousands of creators.
        </p>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px 40px' }}>
        <div ref={gridRef} className="footer-grid" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.3fr', gap: '40px', alignItems: 'stretch' }}>
          {showSweep && (
            <motion.div
              aria-hidden="true"
              initial={{ scaleX: 1 }}
              animate={gridInView ? { scaleX: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1], delay: 0.15 }}
              style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: sweepWidth, borderRadius: '20px', background: 'var(--hero-bg)', transformOrigin: 'right center', zIndex: 2 }}
            />
          )}
          <motion.div {...reveal(0)}>
            <h4 style={headingStyle}>Services</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <FooterLink to="/service/nano-micro-kol-campaign">Nano-Micro KOL Campaign</FooterLink>
              <FooterLink to="/service/koc-campaign">KOC Campaign</FooterLink>
              <FooterLink to="/service/affiliate-creator-campaign">Affiliate Creator Campaign</FooterLink>
              <FooterLink to="/service/event-creator-activation">Event Creator Activation</FooterLink>
            </div>
          </motion.div>

          <motion.div {...reveal(1)}>
            <h4 style={headingStyle}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <FooterLink to="/portfolio">Portfolio</FooterLink>
              <FooterLink to="/brand">Untuk Brand</FooterLink>
              <FooterLink to="/kol">Untuk KOL</FooterLink>
              <FooterLink to="/privacy-policy">Kebijakan Privasi</FooterLink>
            </div>
          </motion.div>

          <motion.div {...reveal(2)}>
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
          </motion.div>

          <div
            ref={panelRef}
            style={{
              position: 'relative',
              zIndex: 3,
              borderRadius: '20px',
              padding: '28px',
              background: 'var(--hero-bg)',
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
            AZERAKOL.ID is a brand of PT Azera Creator Network.
          </p>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.82rem', fontFamily: "var(--font-display)", marginTop: '4px' }}>
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
    </div>
  );
}
