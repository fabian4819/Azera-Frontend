import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ease } from '../../lib/motion';

export default function BrandCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} style={{ background: 'linear-gradient(160deg, #2c1065 0%, #1c0a44 100%)', padding: '90px 24px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', display: 'inline-block', marginBottom: '18px' }}>
            Untuk Brand
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 3.4rem)', color: '#fff', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '18px' }}>
            Siap mulai <span style={{ color: '#c6a5ff' }}>campaign KOL kamu?</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.02rem', lineHeight: 1.7, maxWidth: '540px', margin: '0 auto 40px' }}>
            Konsultasi gratis dengan tim AzeraKOL. Kami bantu tentukan strategi, pilih KOL, dan jalankan campaign yang tepat sasaran.
          </p>
          <Link to="/brand/form" className="btn-lime" style={{ fontSize: '1rem' }}>
            Mulai Campaign <span style={{ fontSize: '1.1rem' }}>↗</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
