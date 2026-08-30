import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue } from 'framer-motion';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { Hand, Target, Users, Rocket, TrendingUp } from 'lucide-react';
import { ease } from '../../lib/motion';

const steps = [
  { number: '01', icon: Target, title: 'Plan', desc: 'Diskusi kebutuhan campaign, target audiens, dan tujuan bisnis brand kamu bersama tim AzeraKOL.' },
  { number: '02', icon: Users, title: 'Match', desc: 'Kami menseleksi dan menyajikan shortlist KOL yang paling relevan berdasarkan data.' },
  { number: '03', icon: Rocket, title: 'Execute', desc: 'Tim AzeraKOL mengelola seluruh proses dari briefing KOL, review konten, hingga publikasi.' },
  { number: '04', icon: TrendingUp, title: 'Scale', desc: 'Analisis performa campaign secara real-time dan optimalkan untuk hasil yang maksimal.' },
];

// Digandakan 3x supaya carousel bisa di-loop tanpa henti — di kiri & kanan set
// utama selalu ada "buffer" set yang identik, jadi begitu user hampir mentok
// ke salah satu ujung, scrollLeft dilompat diam-diam ke posisi ekuivalen di
// set sebelahnya (kontennya sama persis, jadi lompatannya tidak terlihat).
const loopSteps = [...steps, ...steps, ...steps];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scrollable, setScrollable] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const oneSetWidthRef = useRef(0);

  // Kursor kustom "Geser" yang mengikuti posisi mouse selama di atas carousel
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Click-drag-to-scroll manual di atas native horizontal scroll (jadi wheel/trackpad
  // swipe tanpa klik tetap jalan, dan klik-tahan-geser juga tetap bisa)
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);

  // Posisikan scroll di awal set TENGAH (dari 3 set yang di-render), supaya
  // ada ruang buffer identik di kiri (set sebelumnya) & kanan (set berikutnya)
  // untuk loop. Pakai useLayoutEffect supaya lompatan awal ini tidak sempat kelihatan.
  useLayoutEffect(() => {
    const measure = (resetScroll: boolean) => {
      if (!viewportRef.current || !trackRef.current) return;
      const oneSet = trackRef.current.scrollWidth / 3;
      oneSetWidthRef.current = oneSet;
      setScrollable(oneSet > viewportRef.current.clientWidth + 1);
      if (resetScroll) viewportRef.current.scrollLeft = oneSet;
    };
    measure(true);
    const onResize = () => measure(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Kartu yang paling dekat dengan tengah viewport otomatis jadi lurus (rotate 0).
  // Pakai offsetLeft/offsetWidth (murni layout box, TIDAK kepengaruh transform CSS
  // seperti rotate) supaya perhitungannya presisi & tidak meleset karena tilt kartu.
  const rafRef = useRef(0);
  const updateActiveIndex = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;
    let closest = 0;
    let closestDist = Infinity;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const cardCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(cardCenter - viewportCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);

    // Wraparound: begitu posisi scroll melewati setengah lebar satu set dari
    // titik awal, lompat diam-diam sejauh satu set ke arah berlawanan.
    const oneSet = oneSetWidthRef.current;
    if (oneSet > 0) {
      if (viewport.scrollLeft < oneSet * 0.5) {
        viewport.scrollLeft += oneSet;
      } else if (viewport.scrollLeft > oneSet * 1.5) {
        viewport.scrollLeft -= oneSet;
      }
    }
  };
  const onScrollViewport = () => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateActiveIndex);
  };
  useEffect(() => {
    updateActiveIndex();
  }, [scrollable]);

  const onMouseEnter = () => setHovering(true);
  const onMouseLeave = () => {
    setHovering(false);
    draggingRef.current = false;
  };
  // Posisi badge dihitung relatif ke WRAPPER luar (yang tidak ikut scroll),
  // bukan ke viewport yang scroll — supaya badge tetap nempel di mouse,
  // tidak ikut kegeser saat konten di-drag.
  const onMouseMoveWrapper = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
    if (draggingRef.current && viewportRef.current) {
      const walked = e.clientX - startXRef.current;
      viewportRef.current.scrollLeft = startScrollRef.current - walked;
    }
  };
  const onMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!scrollable || !viewportRef.current) return;
    draggingRef.current = true;
    startXRef.current = e.clientX;
    startScrollRef.current = viewportRef.current.scrollLeft;
  };
  const onMouseUp = () => {
    draggingRef.current = false;
  };

  return (
    <section className="section-py" style={{ background: 'var(--surface-low)' }} ref={ref}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          style={{ marginBottom: '56px', maxWidth: '640px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--secondary)', display: 'inline-block', marginBottom: '16px' }}>
            How To
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, 4.5vw, 3rem)', color: 'var(--on-background)', lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: '18px' }}>
            Dari brief awal sampai<br />campaign selesai.
          </h2>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem', lineHeight: 1.7 }}>
            Campaign terbaik tidak dikerjakan sendirian. Di AzeraKOL, brand, tim kami, dan creator bergerak bersama untuk hasil yang maksimal.
          </p>
        </motion.div>
      </div>

      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMoveWrapper}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', cursor: scrollable && hovering ? 'none' : 'default' }}
      >
        {scrollable && (
          <motion.div
            animate={{ opacity: hovering ? 1 : 0, scale: hovering ? 1 : 0.85 }}
            transition={{ duration: 0.2, ease }}
            style={{
              position: 'absolute', top: 0, left: 0, zIndex: 5, x: cursorX, y: cursorY,
              translateX: '-50%', translateY: '-50%',
              width: '78px', height: '78px', borderRadius: '50%', background: 'var(--primary)', color: '#fff',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.7rem',
              pointerEvents: 'none', boxShadow: '0 12px 28px -8px rgba(21,21,125,0.5)',
            }}
          >
            <Hand size={14} />
            Geser
          </motion.div>
        )}

        <div
          ref={viewportRef}
          onScroll={onScrollViewport}
          style={{ position: 'relative', overflowX: 'auto', overflowY: 'visible', scrollbarWidth: 'none', padding: '24px 24px', margin: '-24px 0', userSelect: 'none' }}
          className="hiw-viewport"
        >
          <div ref={trackRef} style={{ display: 'flex', gap: '20px', width: 'fit-content' }}>
            {loopSteps.map((step, i) => {
              const Icon = step.icon;
              const baseTilts = [-1.4, 1, -0.8, 1.2];
              const baseTilt = baseTilts[i % steps.length] ?? 0;
              const tilt = i === activeIndex ? 0 : baseTilt;
              return (
                <motion.div
                  key={i}
                  ref={(el) => { cardRefs.current[i] = el; }}
                  initial={{ opacity: 0, y: 30, rotate: baseTilt }}
                  animate={isInView ? { opacity: 1, y: 0, rotate: tilt } : { rotate: baseTilt }}
                  transition={{ duration: 0.6, ease, delay: (i % steps.length) * 0.1, rotate: { duration: 0.35, ease } }}
                  className="hiw-card"
                  style={{ padding: '28px 24px', width: '280px', flexShrink: 0 }}
                >
                  <div className="hiw-icon-box" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '12px', marginBottom: '20px' }}>
                    <Icon size={20} />
                  </div>
                  <p className="hiw-step-label" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em', marginBottom: '8px' }}>
                    STEP {step.number}
                  </p>
                  <p className="hiw-title" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', marginBottom: '10px' }}>
                    {step.title}
                  </p>
                  <p className="hiw-desc" style={{ fontSize: '0.85rem', lineHeight: 1.65 }}>
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .hiw-viewport { -ms-overflow-style: none; }
        .hiw-viewport::-webkit-scrollbar { display: none; }

        .hiw-card {
          background: #fff;
          border: 1.5px solid var(--outline-variant);
          border-radius: var(--radius-lg);
          transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hiw-card:hover {
          background: var(--primary);
          border-color: var(--primary);
          transform: translateY(-3px);
          box-shadow: var(--shadow-pitch);
        }
        .hiw-icon-box { background: rgba(103,40,228,0.08); color: var(--secondary); transition: background 0.3s ease, color 0.3s ease; }
        .hiw-card:hover .hiw-icon-box { background: rgba(255,255,255,0.12); color: #fff; }
        .hiw-step-label { color: var(--outline); transition: color 0.3s ease; }
        .hiw-card:hover .hiw-step-label { color: rgba(255,255,255,0.5); }
        .hiw-title { color: var(--on-background); transition: color 0.3s ease; }
        .hiw-card:hover .hiw-title { color: #fff; }
        .hiw-desc { color: var(--on-surface-variant); transition: color 0.3s ease; }
        .hiw-card:hover .hiw-desc { color: rgba(255,255,255,0.65); }
      `}</style>
    </section>
  );
}
