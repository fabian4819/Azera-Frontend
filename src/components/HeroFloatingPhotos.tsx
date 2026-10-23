import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { ease } from '../lib/motion';

// Foto konten tersebar di background hero (ghosting ala pitch.com: kartu tegak, transparan, di-tint ungu
// supaya melebur dengan gradasi, tanpa bayangan). Listener mouse nempel
// ke parent section sendiri (bukan lewat prop), jadi tinggal taruh komponen ini sebagai
// child pertama. Di mobile foto diperkecil (bukan disembunyikan) supaya tetap sama
// dengan desktop; parallax mouse halus (diam di layar sentuh).
const bgPhotos = [
  { src: '/hero/social-phone.jpg', pos: { top: '8%', left: '4%' }, w: 184, h: 230 },
  { src: '/hero/team-meeting.jpg', pos: { top: '5%', left: '38%' }, w: 206, h: 150 },
  { src: '/hero/content-plan.jpg', pos: { top: '8%', right: '4%' }, w: 172, h: 214 },
  { src: '/hero/tiktok2.jpg', pos: { top: '31%', left: '9%' }, w: 166, h: 166 },
  { src: '/hero/mkt-analytics.jpg', pos: { top: '33%', right: '8%' }, w: 206, h: 150 },
  { src: '/hero/ig-reels1.jpg', pos: { top: '41%', left: '41%' }, w: 152, h: 190 },
  { src: '/hero/reels2.jpg', pos: { top: '49%', left: '2%' }, w: 166, h: 208 },
  { src: '/hero/social-apps.jpg', pos: { top: '47%', right: '2%' }, w: 198, h: 150 },
  { src: '/hero/team-collab.jpg', pos: { bottom: '3%', left: '19%' }, w: 206, h: 150 },
  { src: '/hero/tiktok1.jpg', pos: { bottom: '2%', right: '19%' }, w: 160, h: 200 },
];

function ParallaxCard({ src, w, h, springX, springY, depth }: { src: string; w: number; h: number; springX: MotionValue<number>; springY: MotionValue<number>; depth: number }) {
  const x = useTransform(springX, (v) => v * depth);
  const y = useTransform(springY, (v) => v * depth);
  return (
    <motion.div
      className="hero-ghost-card"
      style={{
        x, y,
        width: `${w}px`, height: `${h}px`,
        borderRadius: '10px',
        overflow: 'hidden',
        background: '#5318eb',
      }}
    >
      {/* luminosity = foto jadi monokrom ber-tint ungu latar, seperti ghost card pitch.com */}
      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'luminosity', opacity: 0.7 }} />
    </motion.div>
  );
}

export default function HeroFloatingPhotos() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20, mass: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;
    const handleMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    const handleLeave = () => { mouseX.set(0); mouseY.set(0); };
    parent.addEventListener('mousemove', handleMove);
    parent.addEventListener('mouseleave', handleLeave);
    return () => {
      parent.removeEventListener('mousemove', handleMove);
      parent.removeEventListener('mouseleave', handleLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="hero-ghosts" aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      {bgPhotos.map((p, i) => (
        <motion.div
          key={p.src}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 0.28, scale: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.2 + i * 0.07 }}
          style={{ position: 'absolute', ...p.pos }}
        >
          <ParallaxCard src={p.src} w={p.w} h={p.h} springX={springX} springY={springY} depth={10 + (i % 5) * 6} />
        </motion.div>
      ))}
      <style>{`
        @media (max-width: 768px) { .hero-ghost-card { zoom: 0.5; opacity: 0.75; } }
      `}</style>
    </div>
  );
}
