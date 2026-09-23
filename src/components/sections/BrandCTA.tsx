import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ease } from '../../lib/motion';
import { services } from '../../data/services';

export default function BrandCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} style={{ background: 'var(--hero-bg)', padding: '90px 24px' }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', display: 'inline-block', marginBottom: '18px' }}>
            Untuk Brand
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 3.4rem)', color: '#fff', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '18px' }}>
            Pilih layanan <span style={{ color: 'var(--lime)' }}>campaign KOL kamu.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.02rem', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 48px' }}>
            Empat layanan inti AzeraKOL, dari awareness sampai penjualan. Pilih yang paling sesuai dengan tujuan brand kamu.
          </p>
        </motion.div>

        <div className="brand-services-grid">
          {services.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease, delay: 0.1 + i * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.3, ease } }}
            >
              <Link to={`/service/${s.slug}`} className="brand-service-card">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--lime)' }}>0{i + 1}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: '#fff', lineHeight: 1.25, letterSpacing: '-0.01em', margin: '14px 0 10px' }}>
                  {s.navLabel}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.88rem', lineHeight: 1.6, flex: 1 }}>{s.subheading}</p>
                <span className="brand-service-link">
                  Lihat layanan <ArrowUpRight size={16} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease, delay: 0.45 }}
          style={{ marginTop: '44px' }}
        >
          <Link to="/brand/form" className="btn-lime" style={{ fontSize: '1rem' }}>
            Mulai Campaign <span style={{ fontSize: '1.1rem' }}>↗</span>
          </Link>
        </motion.div>
      </div>

      <style>{`
        .brand-services-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          text-align: left;
        }
        .brand-service-card {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 24px;
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 22px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          text-decoration: none;
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .brand-service-card:hover {
          background: rgba(255,255,255,0.14);
          border-color: rgba(196,238,135,0.5);
        }
        .brand-service-card:focus-visible {
          outline: 2px solid var(--lime);
          outline-offset: 3px;
        }
        .brand-service-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 22px;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--lime);
        }
        @media (max-width: 1024px) {
          .brand-services-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 560px) {
          .brand-services-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
