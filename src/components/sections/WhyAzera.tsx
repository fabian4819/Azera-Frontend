import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ease } from '../../lib/motion';

type Feature = { title: string; desc: string; image: string };

const features: Feature[] = [
  { title: 'Data-Driven Matching', desc: 'Pemilihan KOL tidak asal-asalan. Kami memakai data engagement, demografi audiens, dan performa historis untuk memastikan kesesuaian terbaik dengan brand kamu.', image: '/why-azera/1-data-matching.webp' },
  { title: 'Jaringan KOL Masif', desc: 'Akses 20.000+ KOL aktif dari berbagai niche dan platform. Nano, micro, hingga macro creator tersedia di satu tempat.', image: '/why-azera/2-kol-network.webp' },
  { title: 'Terkurasi & Terpercaya', desc: 'Setiap KOL melalui proses kurasi ketat. Fake followers, engagement rendah, dan konten tidak sesuai langsung terseleksi.', image: '/why-azera/3-curated-trusted.webp' },
  { title: 'Fokus pada Performa', desc: 'Laporan transparan dengan metrik yang relevan. Setiap campaign dioptimalkan untuk mencapai tujuan bisnis yang sudah disepakati.', image: '/why-azera/4-performance-roi.webp' },
];

// Ilustrasi polos tanpa bingkai — PNG/WebP transparan, langsung di atas latar section.
function renderVisual(i: number) {
  const f = features[i];
  if (!f) return null;
  return (
    <img
      src={f.image}
      alt={f.title}
      style={{ width: '100%', aspectRatio: '3 / 2', objectFit: 'contain', display: 'block' }}
    />
  );
}

function HeadingBlock() {
  return (
    <div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--secondary)', display: 'inline-block', marginBottom: '16px' }}>
        Why AzeraKOL
      </span>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.05, letterSpacing: '-0.03em', color: 'var(--on-background)', marginBottom: '18px' }}>
        Partner KOL yang<br />brand percaya.
      </h2>
      <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '440px' }}>
        Dari matching creator sampai laporan akhir, AzeraKOL adalah tempat brand menjalankan campaign KOL yang benar-benar terukur.
      </p>
    </div>
  );
}

function PointText({ f }: { f: Feature }) {
  return (
    <div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'var(--secondary)', marginBottom: '12px' }}>{f.title}</h3>
      <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.98rem', lineHeight: 1.7, maxWidth: '440px' }}>{f.desc}</p>
    </div>
  );
}


// Visual terikat ke posisi scroll: redup di tepi layar, penuh (opacity 1) tepat di tengah.
function ScrollFade({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [120, 0, -120]);
  const scale = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.92, 1, 0.92]);
  return <motion.div ref={ref} style={{ ...style, opacity, y, scale }}>{children}</motion.div>;
}

// Teks kiri: slide vertikal terarah — masuk dari bawah saat maju, dari atas saat mundur.
const textVariants = {
  enter: (dir: number) => ({ y: dir > 0 ? 36 : -36, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (dir: number) => ({ y: dir > 0 ? -36 : 36, opacity: 0 }),
};

export default function WhyAzera() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isDesktop, setIsDesktop] = useState(true);
  const activeRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Snap ringan (proximity) supaya ilustrasi "pas" di tengah saat berhenti scroll
  useEffect(() => {
    if (!isDesktop) return;
    const html = document.documentElement;
    html.style.scrollSnapType = 'y proximity';
    return () => { html.style.scrollSnapType = ''; };
  }, [isDesktop]);

  const activate = (idx: number) => {
    if (idx === activeRef.current) return;
    setDirection(idx > activeRef.current ? 1 : -1);
    activeRef.current = idx;
    setActive(idx);
  };

  // Mobile: tumpuk biasa — tiap poin + visualnya fade mengikuti scroll
  if (!isDesktop) {
    return (
      <section style={{ background: 'linear-gradient(180deg, #ece6ff 0%, var(--surface) 12%)', padding: '48px 0 72px' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: '48px' }}><HeadingBlock /></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {features.map((f, i) => (
              <ScrollFade key={f.title}>
                <div style={{ marginBottom: '20px' }}><PointText f={f} /></div>
                {renderVisual(i)}
              </ScrollFade>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Desktop: kolom kiri sticky, visual kanan scroll natural & opacity mengikuti scroll, snap di tengah
  return (
    <section style={{ position: 'relative', background: 'linear-gradient(180deg, #ece6ff 0%, var(--surface) 10%)' }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px' }}>
        {/* LEFT — heading + poin aktif, sticky */}
        <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <HeadingBlock />
          <div style={{ minHeight: '150px', marginTop: '44px', overflow: 'hidden' }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease }}
              >
                <PointText f={features[active]} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT — tiap visual satu layar, terang penuh saat di tengah */}
        <div>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              viewport={{ amount: 0.5 }}
              onViewportEnter={() => activate(i)}
              style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', scrollSnapAlign: 'center' }}
            >
              <ScrollFade style={{ width: '100%' }}>
                {renderVisual(i)}
              </ScrollFade>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
