import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function DualCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="dualcta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '440px', position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: easeOut }}
        className="dualcta-left"
        style={{ background: 'var(--primary)', padding: '80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        <span className="tag-pill tag-pill-white" style={{ marginBottom: '18px' }}>Untuk Brand</span>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#ffffff', lineHeight: 1.15, marginBottom: '16px' }}>
          Siap Mulai Campaign KOL?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '32px', maxWidth: '380px' }}>
          Konsultasi gratis dengan tim AzeraKOL. Kami bantu tentukan strategi, pilih KOL, dan jalankan campaign yang tepat sasaran.
        </p>
        <Link to="/brand/form" className="btn-primary" style={{ alignSelf: 'flex-start', fontSize: '1rem' }}>
          Mulai Campaign
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
        className="dualcta-right"
        style={{ background: 'var(--secondary)', padding: '80px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        <span className="tag-pill tag-pill-white" style={{ marginBottom: '18px' }}>Untuk KOL</span>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#ffffff', lineHeight: 1.15, marginBottom: '16px' }}>
          Bergabung dengan AzeraKOL Network
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '32px', maxWidth: '380px' }}>
          Daftar gratis, dapatkan akses ke ratusan peluang kolaborasi brand ternama di Indonesia. Tim kami siap mendukung perjalanan kariermu.
        </p>
        <Link
          to="/kol/register"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', borderRadius: '999px', background: 'white', color: 'var(--secondary)', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', textDecoration: 'none', alignSelf: 'flex-start' }}
        >
          Bergabung KOL
        </Link>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .dualcta-grid { grid-template-columns: 1fr !important; }
          .dualcta-left { padding: 64px 32px !important; }
          .dualcta-right { padding: 64px 32px !important; }
        }
      `}</style>
    </section>
  );
}
