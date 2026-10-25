import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView, type MotionValue } from 'framer-motion';

const heading =
  'Campaign KOL bukan sekadar konten. Bersama AzeraKOL, itu jadi pertumbuhan nyata. Bangun kepercayaan, raih target, dan menangkan lebih banyak pasar.';

const stats = [
  { target: 20, suffix: 'K+', desc: 'Creator aktif siap menjalankan campaign brand kamu.' },
  { target: 500, suffix: '+', desc: 'Campaign berhasil dijalankan dari berbagai niche & industri.' },
  { target: 100, suffix: '%', desc: 'Tingkat kepuasan klien dari setiap campaign yang kami tangani.' },
];

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity, marginRight: '0.28em', display: 'inline-block' }}>
      {children}
    </motion.span>
  );
}

// Angka gaya slot (pitch.com): tiap digit kolom 0-9 (x2 supaya putarannya terasa) yang
// bergeser ke digit target, berurutan kiri ke kanan.
function RollingNumber({ target, suffix, started }: { target: number; suffix: string; started: boolean }) {
  const digits = String(target).split('').map(Number);
  const strip = [...Array(20)].map((_, n) => n % 10);
  return (
    <span aria-label={`${target}${suffix}`} style={{ display: 'inline-flex', alignItems: 'flex-start' }}>
      {digits.map((d, i) => (
        <span key={i} aria-hidden="true" style={{ display: 'inline-block', height: '1em', overflow: 'hidden' }}>
          <span
            style={{
              display: 'block',
              transform: `translateY(${started ? -(d + 10) : 0}em)`,
              transition: `transform 1.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.12}s`,
            }}
          >
            {strip.map((n, k) => <span key={k} style={{ display: 'block', height: '1em' }}>{n}</span>)}
          </span>
        </span>
      ))}
      <span aria-hidden="true">{suffix}</span>
    </span>
  );
}

export default function Stats() {
  const headingRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: headingRef, offset: ['start 0.85', 'start 0.35'] });
  const words = heading.split(' ');

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' });

  return (
    <section
      style={{
        padding: '120px 24px',
        background: 'var(--flow-light)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px' }} className="payoff-grid">
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--lime)' }}>
              The Payoff
            </span>
          </div>

          <div>
            <p
              ref={headingRef}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(1.7rem, 3.6vw, 2.8rem)',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                maxWidth: '900px',
                marginBottom: '76px',
              }}
            >
              {words.map((w, i) => {
                const start = i / words.length;
                const end = start + 1 / words.length;
                return (
                  <Word key={i} progress={scrollYProgress} range={[start, end]}>
                    {w}
                  </Word>
                );
              })}
            </p>

            <div ref={statsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }} className="payoff-stats">
              {stats.map((s, i) => (
                <motion.div
                  key={s.desc}
                  initial={{ opacity: 0, y: 18 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', color: 'var(--lime)', lineHeight: 1, marginBottom: '14px' }}>
                    <RollingNumber target={s.target} suffix={s.suffix} started={statsInView} />
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '260px' }}>
                    {s.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .payoff-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .payoff-stats { grid-template-columns: 1fr !important; gap: 36px !important; }
        }
      `}</style>
    </section>
  );
}
