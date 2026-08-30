import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { ease } from '../../lib/motion';

type Feature = { title: string; desc: string; image: string };

const features: Feature[] = [
  { title: 'Data-Driven Matching', desc: 'Pemilihan KOL tidak asal-asalan. Kami memakai data engagement, demografi audiens, dan performa historis untuk memastikan kesesuaian terbaik dengan brand kamu.', image: '/why-azera/data-matching.jpg' },
  { title: 'Jaringan KOL Masif', desc: 'Akses 20.000+ KOL aktif dari berbagai niche dan platform. Nano, micro, hingga macro creator tersedia di satu tempat.', image: '/why-azera/kol-network.jpg' },
  { title: 'Terkurasi & Terpercaya', desc: 'Setiap KOL melalui proses kurasi ketat. Fake followers, engagement rendah, dan konten tidak sesuai langsung terseleksi.', image: '/why-azera/curated-trusted.jpg' },
  { title: 'Fokus pada Performa', desc: 'Laporan transparan dengan metrik yang relevan. Setiap campaign dioptimalkan untuk mencapai tujuan bisnis yang sudah disepakati.', image: '/why-azera/performance-roi.jpg' },
];

function renderVisual(i: number) {
  const f = features[i];
  if (!f) return null;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '360px',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 20px 48px -14px rgba(59,20,118,0.55)',
        background: '#ffffff',
      }}
    >
      <img
        src={f.image}
        alt={f.title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </div>
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

function VisualFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        height: '440px',
        borderRadius: '28px',
        padding: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background:
          'radial-gradient(65% 55% at 62% 30%, rgba(255,110,199,0.55), rgba(255,110,199,0) 60%),' +
          'linear-gradient(150deg, #b9a2ff 0%, #8b5cf6 32%, #6d28d9 62%, #3b1476 100%)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '24px',
          border: '1.5px dashed rgba(255,255,255,0.5)',
          borderRadius: '20px',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', width: '100%' }}>{children}</div>
    </div>
  );
}

const swap = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.3, ease },
};

export default function WhyAzera() {
  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(features.length - 1, Math.max(0, Math.floor(v * features.length)));
    setActive(idx);
  });

  // Mobile: tumpuk biasa (tanpa pinning) — tiap poin + visualnya
  if (!isDesktop) {
    return (
      <section style={{ background: 'linear-gradient(180deg, #ece6ff 0%, var(--surface) 12%)', padding: '48px 0 72px' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: '48px' }}><HeadingBlock /></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {features.map((f, i) => (
              <div key={f.title}>
                <div style={{ marginBottom: '20px' }}><PointText f={f} /></div>
                <VisualFrame>{renderVisual(i)}</VisualFrame>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Desktop: scrollytelling — viewport di-pin, teks & visual cross-fade saat scroll
  return (
    <section ref={sectionRef} style={{ position: 'relative', height: `${features.length * 85}vh`, background: 'linear-gradient(180deg, #ece6ff 0%, var(--surface) 10%)' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' }}>
            {/* LEFT — heading (statis) + poin aktif (cross-fade) */}
            <div>
              <HeadingBlock />
              <div style={{ minHeight: '150px', marginTop: '44px' }}>
                <AnimatePresence mode="wait">
                  <motion.div key={active} {...swap}>
                    <PointText f={features[active]} />
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* progress indicator */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '28px' }}>
                {features.map((_, i) => (
                  <span key={i} style={{ width: i === active ? '26px' : '8px', height: '8px', borderRadius: '999px', background: i === active ? 'var(--secondary)' : 'var(--outline-variant)', transition: 'all 0.3s ease' }} />
                ))}
              </div>
            </div>

            {/* RIGHT — visual (cross-fade), tanpa overlay teks — gambar polos */}
            <div>
              <VisualFrame>
                <AnimatePresence mode="wait">
                  <motion.div key={active} {...swap} style={{ width: '100%' }}>
                    {renderVisual(active)}
                  </motion.div>
                </AnimatePresence>
              </VisualFrame>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
