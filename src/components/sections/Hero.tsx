import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Megaphone, TrendingUp, Zap } from 'lucide-react';
import { ease } from '../../lib/motion';

const statCards = [
  {
    icon: TrendingUp,
    value: '20K+',
    label: 'KOL AKTIF',
    desc: 'KOL terkurasi aktif siap menjalankan kampanye brand kamu.',
    iconBg: '#7B1D40',
    valueColor: '#191c20',
    iconPlacement: 'bottom-left' as const,
    rotate: '4deg',
    delay: 0.35,
    translateY: 32,
  },
  {
    icon: Users,
    value: '100+',
    label: 'BRAND PARTNER',
    desc: 'Brand terkemuka yang telah mempercayakan kampanye ke Azera.',
    iconBg: '#6728e4',
    valueColor: '#6728e4',
    iconPlacement: 'top-center' as const,
    rotate: '-2deg',
    delay: 0.5,
    translateY: 0,
  },
  {
    icon: Megaphone,
    value: '98%',
    label: 'TINGKAT KEPUASAN',
    desc: 'Tingkat kepuasan klien yang konsisten dari setiap kampanye.',
    iconBg: '#1e1b4b',
    valueColor: '#191c20',
    iconPlacement: 'top-right' as const,
    rotate: '3deg',
    delay: 0.65,
    translateY: 28,
  },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });

  // Parallax layers
  const blobY1  = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const blobY2  = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const blobY3  = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const headingY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const cardsY   = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse 90% 70% at 50% -10%, #bdb0f0 0%, #d6cff6 25%, #eae7fa 50%, #f4f2fd 70%, #f8f7ff 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '80px',
      }}
    >
      {/* Parallax blobs */}
      <motion.div style={{ y: blobY1, position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '800px', height: '500px', background: 'radial-gradient(ellipse at 50% 0%, rgba(103,40,228,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <motion.div style={{ y: blobY2, position: 'absolute', bottom: '-100px', right: '-100px', width: '450px', height: '450px', borderRadius: '50%', background: '#e1e0ff', opacity: 0.35, filter: 'blur(60px)', pointerEvents: 'none' }} />
      <motion.div style={{ y: blobY3, position: 'absolute', top: '20%', left: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: '#ffd9e1', opacity: 0.3, filter: 'blur(48px)', pointerEvents: 'none' }} />

      {/* Centered content */}
      <motion.div
        style={{
          maxWidth: '860px',
          width: '100%',
          margin: '0 auto',
          padding: '80px 24px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          y: headingY,
        }}
      >
        <motion.div
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1e1050', borderRadius: '999px', padding: '8px 20px', marginBottom: '28px' }}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease }}
        >
          <Zap size={14} color="#a78bfa" fill="#a78bfa" />
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.72rem', color: '#fff', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            KOL Agency Indonesia
          </span>
        </motion.div>

        <motion.h1
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(2.6rem, 7vw, 5rem)', color: '#0f0c2e', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.03em' }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
        >
          Jasa KOL Management untuk{' '}
          <em style={{ fontStyle: 'italic', background: 'linear-gradient(135deg, #6728e4, #9b5de5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Brand Growth.
          </em>
        </motion.h1>

        <motion.p
          style={{ color: '#4a4868', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '580px', marginBottom: '40px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.22 }}
        >
          Azera membantu brand menjalankan campaign KOL dan influencer marketing di Indonesia melalui jaringan nano, micro, dan macro creator terkurasi untuk Instagram, TikTok, YouTube, dan live streaming.
        </motion.p>

        <motion.div
          style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '80px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.34 }}
        >
          <Link
            to="/brand/form"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#6728e4', color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', padding: '15px 32px', borderRadius: '999px', textDecoration: 'none', boxShadow: '0 8px 32px rgba(103,40,228,0.35)', transition: 'transform 0.18s ease, box-shadow 0.18s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(103,40,228,0.45)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(103,40,228,0.35)'; }}
          >
            Mulai Sekarang <span style={{ fontSize: '1.1rem' }}>↗</span>
          </Link>
          <Link
            to="/portfolio"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.7)', color: '#1e1050', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', padding: '14px 32px', borderRadius: '999px', textDecoration: 'none', border: '1.5px solid rgba(103,40,228,0.15)', backdropFilter: 'blur(8px)', transition: 'background 0.18s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.9)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.7)'; }}
          >
            Lihat Portfolio
          </Link>
        </motion.div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        style={{
          maxWidth: '1100px',
          width: '100%',
          margin: '0 auto',
          padding: '0 24px 80px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          alignItems: 'flex-end',
          position: 'relative',
          zIndex: 1,
          y: cardsY,
        }}
        className="hero-stats"
      >
        {statCards.map(({ icon: Icon, value, label, desc, iconBg, valueColor, iconPlacement, rotate, delay, translateY }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay }}
            style={{ position: 'relative', transform: `translateY(${translateY}px) rotate(${rotate})` }}
            whileHover={{ rotate: '0deg', translateY: 0, transition: { duration: 0.25 } }}
          >
            {iconPlacement === 'top-center' && (
              <div style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', width: '48px', height: '48px', borderRadius: '50%', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 24px ${iconBg}55`, zIndex: 2 }}>
                <Icon size={22} color="white" />
              </div>
            )}
            {iconPlacement === 'top-right' && (
              <div style={{ position: 'absolute', top: '-20px', right: '20px', width: '48px', height: '48px', borderRadius: '50%', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 24px ${iconBg}55`, zIndex: 2 }}>
                <Icon size={22} color="white" />
              </div>
            )}

            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
              style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '32px 28px 28px', boxShadow: '0 8px 40px rgba(30,10,94,0.1), 0 1px 0 rgba(255,255,255,0.8) inset', border: '1px solid rgba(255,255,255,0.7)', position: 'relative' }}
            >
              {iconPlacement === 'bottom-left' && (
                <div style={{ position: 'absolute', bottom: '-20px', left: '-16px', width: '48px', height: '48px', borderRadius: '50%', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 24px ${iconBg}55`, zIndex: 2 }}>
                  <Icon size={22} color="white" />
                </div>
              )}
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '2.6rem', color: valueColor, lineHeight: 1, marginBottom: '4px' }}>{value}</p>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.7rem', color: '#6b7280', letterSpacing: '0.1em', marginBottom: '14px' }}>{label}</p>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontStyle: 'italic', fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.6 }}>{desc}</p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .hero-stats { grid-template-columns: 1fr !important; padding-bottom: 48px !important; }
        }
      `}</style>
    </section>
  );
}
