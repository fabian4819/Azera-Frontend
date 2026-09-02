import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { ease } from '../lib/motion';

// Sama seperti hero halaman utama (Hero.tsx) — dipakai ulang di hero halaman service
// supaya treatment visualnya konsisten. Listener mouse nempel ke parent section
// sendiri (bukan lewat prop), jadi tinggal taruh komponen ini sebagai child pertama.
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
      {bgPhotos.map((p, i) => {
        const amp = (i % 2 === 0 ? -1 : 1) * (12 + (i % 3) * 5);
        const dur = 6.5 + (i % 4) * 1.1;
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
      <style>{`
        @media (max-width: 768px) { .hero-ghosts { display: none; } }
      `}</style>
    </div>
  );
}
