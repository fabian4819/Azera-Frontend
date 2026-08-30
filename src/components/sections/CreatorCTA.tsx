import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Clock, Award, TrendingUp, UserCheck } from 'lucide-react';
import { ease } from '../../lib/motion';

const benefits = [
  { icon: Clock, title: 'Pembayaran Tepat Waktu', desc: 'Dibayar sesuai kesepakatan, tanpa telat.' },
  { icon: Award, title: 'Brief Sesuai Niche', desc: 'Campaign dikurasi sesuai kategori & audiensmu.' },
  { icon: TrendingUp, title: 'Growth Karier', desc: 'Akses campaign brand besar & portofolio nyata.' },
  { icon: UserCheck, title: 'Tim Nyata, Bukan Bot', desc: 'Didampingi PIC asli, respons cepat.' },
];

export default function CreatorCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} style={{ position: 'relative', overflow: 'hidden', padding: '90px 24px' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }} aria-hidden="true">
        <img src="/cta/creator-bg.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(28,10,68,0.75) 0%, rgba(44,16,101,0.35) 30%, rgba(44,16,101,0.35) 65%, rgba(15,7,45,0.8) 100%)',
          }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', display: 'inline-block', marginBottom: '18px' }}>
            Untuk Creator
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 3.4rem)', color: '#fff', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '18px' }}>
            Gabung jadi <span className="mark-lime">Creator AzeraKOL.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.02rem', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 44px' }}>
            Jaringan tempat brief yang sesuai niche kamu datang sendiri, dan pembayaran selalu tepat waktu.
          </p>
        </motion.div>

        <motion.div
          className="creator-cta-grid"
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '40px', textAlign: 'left' }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
        >
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} style={{ background: '#fff', borderRadius: '999px', padding: '14px 22px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={19} color="#fff" />
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--on-background)' }}>{b.title}</p>
                  <p style={{ fontSize: '0.76rem', color: 'var(--on-surface-variant)' }}>{b.desc}</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
        >
          <Link to="/kol" className="btn-lime" style={{ fontSize: '1rem' }}>
            Gabung Jadi Creator <span style={{ fontSize: '1.1rem' }}>↗</span>
          </Link>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .creator-cta-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
