import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { ease } from '../lib/motion';

// Foto konten tersebar di background hero (ghosting ala pitch.com: kartu tegak, transparan, di-tint ungu
// supaya melebur dengan gradasi, tanpa bayangan). Listener mouse nempel
// ke parent section sendiri (bukan lewat prop), jadi tinggal taruh komponen ini sebagai
// child pertama. Di mobile foto diperkecil (bukan disembunyikan) supaya tetap sama
// dengan desktop; parallax scroll tetap jalan, parallax mouse diam di layar sentuh.
// Tata letak diukur dari hero pitch.com (viewport 1440×900): kartu slide landscape, 4 besar (288×155)
// + kecil (~138×76) di sela-selanya, sebagian terpotong tepi layar. top dalam px dari atas hero (sama seperti
// pitch), left/right dalam % lebar. 3 kartu terakhir mengisi bagian bawah hero kita yang lebih tinggi (bento).
const BIG = { w: 288, h: 155 }
const SMALL = { w: 138, h: 76 }
const bgPhotos = [
  { src: '/hero/team-meeting.jpg', pos: { top: '77px', left: '16%' }, ...SMALL },
  { src: '/hero/social-apps.jpg', pos: { top: '182px', left: '-1%' }, w: 142, h: 103 },
  { src: '/hero/mkt-analytics.jpg', pos: { top: '105px', left: '40%' }, ...BIG },
  { src: '/hero/tiktok1.jpg', pos: { top: '70px', left: '62.6%' }, ...SMALL },
  { src: '/hero/content-plan.jpg', pos: { top: '40px', right: '-1%' }, w: 238, h: 100 },
  { src: '/hero/team-collab.jpg', pos: { top: '287px', left: '9.5%' }, ...BIG },
  { src: '/hero/social-phone.jpg', pos: { top: '306px', left: '80%' }, w: 188, h: 102 },
  { src: '/hero/reels2.jpg', pos: { top: '508px', left: '3.6%' }, w: 136, h: 70 },
  { src: '/hero/ig-reels1.jpg', pos: { top: '635px', left: '0.3%' }, ...BIG },
  { src: '/hero/tiktok2.jpg', pos: { top: '595px', left: '73.7%' }, ...BIG },
  { src: '/hero/mkt-analytics.jpg', pos: { top: '790px', left: '-2%' }, w: 120, h: 80 },
  { src: '/hero/team-meeting.jpg', pos: { top: '835px', left: '17%' }, ...SMALL },
  { src: '/hero/social-apps.jpg', pos: { top: '870px', left: '69%' }, w: 140, h: 76 },
  { src: '/hero/content-plan.jpg', pos: { top: '810px', left: '89.6%' }, w: 130, h: 90 },
  { src: '/hero/social-phone.jpg', pos: { top: '960px', left: '30%' }, ...BIG },
  { src: '/hero/reels2.jpg', pos: { top: '1010px', left: '6%' }, ...SMALL },
  { src: '/hero/team-collab.jpg', pos: { top: '1000px', right: '4%' }, ...SMALL },
];

/** Parallax ala pitch.com: saat hero di-scroll, kartu naik dengan kecepatan beda per lapisan (depth besar =
 * "lebih dekat" = lebih cepat), plus geser halus mengikuti mouse. */
function ParallaxCard({ src, w, h, springX, springY, scroll, depth }: {
  src: string; w: number; h: number; springX: MotionValue<number>; springY: MotionValue<number>; scroll: MotionValue<number>; depth: number;
}) {
  const x = useTransform(springX, (v) => v * depth);
  const y = useTransform([springY, scroll], ([m, sc]: number[]) => m * depth - sc * depth * 9);
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
  const reduceMotion = useReducedMotion();
  // 0 saat hero di atas layar → 1 saat hero sudah lewat; di-smooth supaya gerak scroll terasa "melayang"
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 });
  const scroll = useTransform(smoothScroll, (v) => (reduceMotion ? 0 : v));

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
          key={i}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 0.28, scale: 1 }}
          transition={{ duration: 0.9, ease, delay: 0.15 + i * 0.04 }}
          style={{ position: 'absolute', ...p.pos }}
        >
          <ParallaxCard src={p.src} w={p.w} h={p.h} springX={springX} springY={springY} scroll={scroll} depth={10 + (i % 5) * 6} />
        </motion.div>
      ))}
      <style>{`
        @media (max-width: 768px) { .hero-ghost-card { zoom: 0.5; opacity: 0.75; } }
      `}</style>
    </div>
  );
}
