import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

const stats = [
  { value: 20000, suffix: '', label: 'KOL Aktif', display: '20K+' },
  { value: 100,   suffix: '+', label: 'Brand Partner', display: '100+' },
  { value: 500,   suffix: '+', label: 'Kampanye Sukses', display: '500+' },
  { value: 98,    suffix: '%', label: 'Tingkat Kepuasan', display: '98%' },
];

function CountUp({ target, suffix, started }: { target: number; suffix: string; started: boolean }) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!started) return;
    const duration = 1800;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [started, target]);

  const display =
    target === 20000
      ? count >= 1000
        ? `${Math.round(count / 1000)}K`
        : count.toString()
      : count.toString();

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      style={{ background: '#08060F', padding: '80px 24px', position: 'relative', overflow: 'hidden' }}
    >
      {/* Top gradient line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #6B2EE8, #E8197A, #38C6F0, transparent)',
          opacity: 0.5,
        }}
      />
      {/* Bottom gradient line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #6B2EE8, #E8197A, #38C6F0, transparent)',
          opacity: 0.5,
        }}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
          }}
          className="stats-grid"
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                textAlign: 'center',
                padding: '20px 32px',
                borderRight: i < stats.length - 1 ? '1px solid rgba(107,46,232,0.2)' : 'none',
              }}
            >
              <p
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 900,
                  fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                  lineHeight: 1,
                  marginBottom: '8px',
                  background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                <CountUp target={stat.value} suffix={stat.suffix} started={isInView} />
              </p>
              <p
                style={{
                  color: '#8B87A8',
                  fontSize: '0.875rem',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  letterSpacing: '0.04em',
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-grid > div { border-right: none !important; border-bottom: 1px solid rgba(107,46,232,0.2); }
        }
      `}</style>
    </section>
  );
}
