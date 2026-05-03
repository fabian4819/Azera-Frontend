import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles, Zap } from 'lucide-react';

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function DualCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="dualcta-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '480px', position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: easeOut }}
        className="dualcta-left"
        style={{
          background: '#15157d',
          padding: '80px 60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="blob" style={{ width: '250px', height: '250px', background: '#814bfe', opacity: 0.15, bottom: '-100px', left: '-100px' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9da1ff', display: 'inline-block', marginBottom: '16px' }}>
            Untuk Brand
          </span>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#ffffff', lineHeight: 1.15, marginBottom: '16px' }}>
            Siap Mulai Kampanye KOL?
          </h2>
          <p style={{ color: 'rgba(157,161,255,0.8)', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '36px', fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: '380px' }}>
            Konsultasi gratis dengan tim Azera. Kami bantu tentukan strategi, pilih KOL, dan jalankan kampanye yang tepat sasaran.
          </p>
          <Link to="/brand/form" className="btn-primary" style={{ alignSelf: 'flex-start', fontSize: '1rem', padding: '14px 32px', gap: '10px' }}>
            <Sparkles size={18} />
            Mulai Kampanye
          </Link>
        </div>
      </motion.div>

      <div className="dualcta-sep" style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px', background: 'linear-gradient(180deg, transparent, #9da1ff, #ff81aa, transparent)', opacity: 0.3, zIndex: 10 }} />

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
        className="dualcta-right"
        style={{
          background: 'linear-gradient(135deg, #6728e4, #ff81aa)',
          padding: '80px 60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="blob" style={{ width: '250px', height: '250px', background: 'rgba(255,255,255,0.2)', top: '-100px', right: '-100px', opacity: 0.15 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.7)', display: 'inline-block', marginBottom: '16px' }}>
            Untuk KOL
          </span>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#ffffff', lineHeight: 1.15, marginBottom: '16px' }}>
            Bergabung dengan Azera Network
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.75, marginBottom: '36px', fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: '380px' }}>
            Daftar gratis, dapatkan akses ke ratusan peluang kolaborasi brand ternama di Indonesia. Tim kami siap mendukung perjalanan kariermu.
          </p>
          <Link
            to="/kol/register"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px', borderRadius: '999px', background: 'white',
              color: '#6728e4', fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
              transition: 'all 0.2s', alignSelf: 'flex-start',
            }}
          >
            <Zap size={18} />
            Bergabung KOL
          </Link>
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .dualcta-grid { grid-template-columns: 1fr !important; }
          .dualcta-left { padding: 64px 32px !important; }
          .dualcta-right { padding: 64px 32px !important; }
          .dualcta-sep { display: none !important; }
        }
      `}</style>
    </section>
  );
}
