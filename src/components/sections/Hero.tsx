import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { SiInstagram, SiTiktok, SiThreads, SiX } from 'react-icons/si';
import { ease } from '../../lib/motion';

// Foto konten/marketing tersebar di seluruh area background (ghosting ala pitch)
const bgPhotos = [
  { src: '/hero/social-phone.jpg', pos: { top: '8%', left: '4%' }, rot: -8, w: 184, h: 230 },
  { src: '/hero/team-meeting.jpg', pos: { top: '5%', left: '38%' }, rot: 4, w: 206, h: 150 },
  { src: '/hero/content-plan.jpg', pos: { top: '8%', right: '4%' }, rot: 7, w: 172, h: 214 },
  { src: '/hero/tiktok2.jpg', pos: { top: '31%', left: '9%' }, rot: 6, w: 166, h: 166 },
  { src: '/hero/mkt-analytics.jpg', pos: { top: '33%', right: '8%' }, rot: -6, w: 206, h: 150 },
  { src: '/hero/ig-reels1.jpg', pos: { top: '41%', left: '41%' }, rot: -4, w: 152, h: 190 },
  { src: '/hero/reels2.jpg', pos: { top: '49%', left: '2%' }, rot: 7, w: 166, h: 208 },
  { src: '/hero/social-apps.jpg', pos: { top: '47%', right: '2%' }, rot: -7, w: 198, h: 150 },
  { src: '/hero/team-collab.jpg', pos: { bottom: '3%', left: '19%' }, rot: 5, w: 206, h: 150 },
  { src: '/hero/tiktok1.jpg', pos: { bottom: '2%', right: '19%' }, rot: -6, w: 160, h: 200 },
];

const avatarStack = [
  { initials: 'RA', bg: '#6728e4' },
  { initials: 'DP', bg: '#814bfe' },
  { initials: 'SF', bg: '#ff81aa' },
  { initials: 'MK', bg: '#15157d' },
  { initials: 'NL', bg: '#7f003f' },
];

const platforms = [
  { label: 'Instagram', icon: SiInstagram },
  { label: 'TikTok', icon: SiTiktok },
  { label: 'Threads', icon: SiThreads },
  { label: 'X', icon: SiX },
];

const glassCard: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: 'var(--radius-lg)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
};

// Kartu foto (boks + gambar sekaligus) yang bergeser mengikuti mouse (parallax)
// sebagai satu kesatuan — depth beda-beda per foto biar terasa berlapis.
function ParallaxCard({ src, w, h, springX, springY, depth }: { src: string; w: number; h: number; springX: MotionValue<number>; springY: MotionValue<number>; depth: number }) {
  const x = useTransform(springX, (v) => v * depth);
  const y = useTransform(springY, (v) => v * depth);
  return (
    <motion.div
      style={{
        x, y,
        width: `${w}px`, height: `${h}px`,
        borderRadius: '18px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.18)',
        boxShadow: '0 20px 50px -18px rgba(0,0,0,0.45)',
      }}
    >
      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </motion.div>
  );
}

export default function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20, mass: 0.5 });

  const handleMouseMove = (e: ReactMouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        overflow: 'hidden',
        marginTop: '-88px',
        paddingTop: '132px',
        paddingBottom: '80px',
        background:
          'radial-gradient(85% 65% at 50% -8%, #6f4ab8, rgba(111,74,184,0) 58%),' +
          'linear-gradient(180deg, #5c3aa8 0%, #562fa0 52%, #4a2f8c 100%)',
      }}
    >
      {/* Foto konten tersebar (ghosting) */}
      <div className="hero-ghosts" aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        {bgPhotos.map((p, i) => {
          const amp = (i % 2 === 0 ? -1 : 1) * (12 + (i % 3) * 5); // -12..-22 / +12..+22 px
          const dur = 6.5 + (i % 4) * 1.1; // 6.5..9.8 s, beda-beda biar organik
          const delay = 0.2 + i * 0.07;
          return (
            <motion.div
              key={p.src}
              initial={{ opacity: 0, scale: 0.9, rotate: p.rot, y: 0 }}
              animate={{
                opacity: 0.36,
                scale: 1,
                rotate: [p.rot, p.rot + (i % 2 ? 2.5 : -2.5), p.rot],
                y: [0, amp, 0],
              }}
              transition={{
                opacity: { duration: 0.9, ease, delay },
                scale: { duration: 0.9, ease, delay },
                rotate: { duration: dur, ease: 'easeInOut', repeat: Infinity, delay },
                y: { duration: dur, ease: 'easeInOut', repeat: Infinity, delay },
              }}
              style={{ position: 'absolute', ...p.pos }}
            >
              <ParallaxCard src={p.src} w={p.w} h={p.h} springX={springX} springY={springY} depth={10 + (i % 5) * 6} />
            </motion.div>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '960px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.05 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(2.8rem, 7.5vw, 5.4rem)',
            color: '#ffffff',
            lineHeight: 0.98,
            letterSpacing: '-0.045em',
            marginBottom: '26px',
          }}
        >
          Scale Your Brand with{' '}
          <span className="underline-accent">
            Nano&ndash;Micro Creators
            <svg viewBox="0 0 300 20" preserveAspectRatio="none" fill="none">
              <path d="M2 14C60 4 160 2 298 12" stroke="var(--lime)" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.13 }}
          style={{ color: 'rgba(255,255,255,0.82)', fontSize: '1.08rem', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto 36px' }}
        >
          Specialized in high-volume KOL, KOC, affiliate, and event creator campaigns&mdash;from dozens to thousands of creators.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
          style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Link to="/brand/form" className="btn-lime" style={{ fontSize: '1rem' }}>
            Mulai Sekarang <span style={{ fontSize: '1.1rem' }}>↗</span>
          </Link>
          <Link to="/portfolio" className="btn-outline-white" style={{ fontSize: '1rem' }}>
            Lihat Portfolio
          </Link>
        </motion.div>
      </div>

      {/* Bento cards (glass, di atas gradient gelap) */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.3 }}
        className="hero-bento"
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1080px',
          margin: '56px auto 0',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateAreas: `"a b b" "a c d"`,
          gap: '18px',
        }}
      >
        <div style={{ ...glassCard, gridArea: 'a', padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span className="tag-pill tag-pill-white" style={{ marginBottom: '18px' }}>Data-Driven</span>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: '#fff', marginBottom: '10px' }}>
              Matching KOL Presisi
            </p>
            <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.85rem', lineHeight: 1.65 }}>
              20.000+ KOL siap dipilih sesuai niche &amp; budget brand kamu.
            </p>
          </div>
          <div style={{ display: 'flex', marginTop: '24px' }}>
            {avatarStack.map((a, i) => (
              <div
                key={a.initials}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%', background: a.bg,
                  border: '2.5px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '0.65rem', fontWeight: 700, marginLeft: i === 0 ? 0 : '-10px',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {a.initials}
              </div>
            ))}
          </div>
        </div>

        {/* Kartu aksen lime */}
        <div style={{ gridArea: 'b', padding: '28px', borderRadius: 'var(--radius-lg)', background: 'var(--lime)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(21,21,125,0.7)', marginBottom: '10px' }}>
            Kepuasan Klien
          </span>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.8rem', color: 'var(--on-lime)', lineHeight: 1 }}>100%</p>
          <p style={{ color: 'rgba(21,21,125,0.72)', fontSize: '0.85rem', marginTop: '8px', maxWidth: '320px' }}>
            Tingkat kepuasan klien dari setiap campaign yang kami jalankan.
          </p>
        </div>

        <div style={{ ...glassCard, gridArea: 'c', padding: '24px' }}>
          <span className="tag-pill tag-pill-white" style={{ marginBottom: '16px' }}>Multi-Platform</span>
          <div style={{ display: 'flex', gap: '9px', marginBottom: '12px' }}>
            {platforms.map(({ label, icon: Icon }) => (
              <div key={label} title={label} style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={15} color="#fff" />
              </div>
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.82rem', lineHeight: 1.6 }}>
            Satu campaign, semua platform utama.
          </p>
        </div>

        <div style={{ ...glassCard, gridArea: 'd', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--lime)', lineHeight: 1, marginBottom: '6px' }}>100+</p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.04em' }}>Brand Partner</p>
        </div>
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .hero-ghosts { display: none; }
          .hero-bento {
            grid-template-columns: 1fr !important;
            grid-template-areas: "a" "b" "c" "d" !important;
          }
        }
      `}</style>
    </section>
  );
}
