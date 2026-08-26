import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { SiInstagram, SiTiktok, SiThreads, SiX } from 'react-icons/si';
import { ease } from '../../lib/motion';

const avatarStack = [
  { initials: 'RA', bg: '#6728e4' },
  { initials: 'DP', bg: '#814bfe' },
  { initials: 'SF', bg: '#ff81aa' },
  { initials: 'MK', bg: '#15157d' },
  { initials: 'NL', bg: '#7f003f' },
];

const platforms = [
  { label: 'Instagram', icon: SiInstagram, color: '#E1306C' },
  { label: 'TikTok', icon: SiTiktok, color: '#000000' },
  { label: 'Threads', icon: SiThreads, color: '#464652' },
  { label: 'X', icon: SiX, color: '#191c20' },
];

export default function Hero() {
  return (
    <section style={{ background: 'var(--surface)', paddingTop: '72px', paddingBottom: '96px', position: 'relative' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="tag-pill tag-pill-navy"
          style={{ margin: '0 auto 28px' }}
        >
          KOL Agency Indonesia
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.08 }}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(2.4rem, 6vw, 4.4rem)',
            color: 'var(--on-background)',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '24px',
          }}
        >
          Jasa KOL Management untuk{' '}
          <span className="underline-accent">
            Brand Growth.
            <svg viewBox="0 0 300 20" preserveAspectRatio="none" fill="none">
              <path d="M2 14C60 4 160 2 298 12" stroke="#6728e4" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.16 }}
          style={{ color: 'var(--on-surface-variant)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '580px', margin: '0 auto 36px' }}
        >
          AzeraKOL membantu brand menjalankan campaign KOL dan influencer marketing di Indonesia melalui jaringan nano, micro, dan macro creator terkurasi untuk Instagram, TikTok, YouTube, dan live streaming.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.24 }}
          style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Link to="/brand/form" className="btn-primary" style={{ fontSize: '1rem' }}>
            Mulai Sekarang <span style={{ fontSize: '1.1rem' }}>↗</span>
          </Link>
          <Link to="/portfolio" className="btn-outline" style={{ fontSize: '1rem' }}>
            Lihat Portfolio
          </Link>
        </motion.div>
      </div>

      {/* Bento grid */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.34 }}
        className="hero-bento"
        style={{
          maxWidth: '1100px',
          margin: '64px auto 0',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateAreas: `"a b b" "a c d"`,
          gap: '20px',
        }}
      >
        <div className="bento-card" style={{ gridArea: 'a', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span className="tag-pill tag-pill-purple" style={{ marginBottom: '18px' }}>Data-Driven</span>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1.15rem', color: 'var(--on-background)', marginBottom: '10px' }}>
              Matching KOL Presisi
            </p>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem', lineHeight: 1.65 }}>
              20.000+ KOL siap dipilih sesuai niche &amp; budget brand kamu.
            </p>
          </div>
          <div style={{ display: 'flex', marginTop: '24px' }}>
            {avatarStack.map((a, i) => (
              <div
                key={a.initials}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%', background: a.bg,
                  border: '2.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '0.65rem', fontWeight: 700, marginLeft: i === 0 ? 0 : '-10px',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {a.initials}
              </div>
            ))}
          </div>
        </div>

        <div className="bento-card-dark" style={{ gridArea: 'b', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span className="tag-pill tag-pill-white" style={{ marginBottom: '14px' }}>
            <TrendingUp size={12} /> Kepuasan Klien
          </span>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '2.6rem', color: '#fff', lineHeight: 1 }}>100%</p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '6px' }}>
            Tingkat kepuasan klien dari setiap campaign yang kami jalankan.
          </p>
        </div>

        <div className="bento-card" style={{ gridArea: 'c', padding: '24px' }}>
          <span className="tag-pill tag-pill-pink" style={{ marginBottom: '16px' }}>Multi-Platform</span>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
            {platforms.map(({ label, icon: Icon, color }) => (
              <div key={label} title={label} style={{ width: '34px', height: '34px', borderRadius: '10px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color={color} />
              </div>
            ))}
          </div>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.82rem', lineHeight: 1.6 }}>
            Satu campaign, semua platform utama.
          </p>
        </div>

        <div className="bento-card" style={{ gridArea: 'd', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '2rem', color: 'var(--secondary)', lineHeight: 1, marginBottom: '6px' }}>100+</p>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.04em' }}>Brand Partner</p>
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .hero-bento {
            grid-template-columns: 1fr !important;
            grid-template-areas: "a" "b" "c" "d" !important;
          }
        }
      `}</style>
    </section>
  );
}
