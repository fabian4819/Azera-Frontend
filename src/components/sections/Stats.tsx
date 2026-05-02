import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { value: 20000, suffix: '+', label: 'KOL Aktif' },
  { value: 100, suffix: '+', label: 'Brand Partner' },
  { value: 500, suffix: '+', label: 'Kampanye Sukses' },
  { value: 98, suffix: '%', label: 'Tingkat Kepuasan' },
];

function CountUp({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [active, target]);

  const formatted = count >= 1000 ? (count / 1000).toFixed(0) + 'K' : count.toString();

  return (
    <span className="gradient-text" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1 }}>
      {formatted}{suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section style={{ background: '#1C1545', padding: '64px 24px' }} ref={ref}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0',
        }}
        className="stats-grid"
      >
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            style={{
              textAlign: 'center',
              padding: '24px 32px',
              borderRight: index < stats.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}
            className="stat-item"
          >
            <CountUp target={stat.value} suffix={stat.suffix} active={inView} />
            <p style={{ color: '#8B87B0', fontSize: '0.9rem', marginTop: '8px', fontWeight: 500 }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stat-item { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.1); }
          .stat-item:nth-child(odd) { border-right: 1px solid rgba(255,255,255,0.1) !important; }
          .stat-item:nth-last-child(-n+2) { border-bottom: none; }
        }
      `}</style>
    </section>
  );
}
