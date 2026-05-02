import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, Users, ShieldCheck, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Data-Driven Matching',
    desc: 'Smart KOL matching tailored to brand goals & audience demographics for maximum relevance.',
  },
  {
    icon: Users,
    title: 'Massive KOL Network',
    desc: '20,000+ Nano & Micro KOL across Indonesia covering all niches and regions.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality & Trusted',
    desc: 'Strict screening for quality content & creators — only verified, authentic KOL in our network.',
  },
  {
    icon: TrendingUp,
    title: 'Performance Focused',
    desc: 'Real impact, real results, real growth. We measure what matters: reach, engagement & conversions.',
  },
];

export default function WhyAzera() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section style={{ background: '#F2F0FF', padding: '96px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }} ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <span className="section-label" style={{ display: 'block', marginBottom: '16px' }}>
            Keunggulan Kami
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: '#1A1040',
              lineHeight: 1.2,
            }}
          >
            Why{' '}
            <span className="pill-label" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)' }}>
              Azera
            </span>
            ?
          </h2>
        </motion.div>

        {/* Feature cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
          }}
          className="why-grid"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="card"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ padding: '32px' }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: '#F0EEFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <Icon size={24} color="#6B2EE8" />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1A1040', marginBottom: '10px' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#8B87B0', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .why-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
