import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const tiers = [
  {
    label: 'NANO KOL',
    labelColor: '#E8197A',
    kolCount: '50 KOL',
    desc: 'Micro-community trust & engagement',
    width: '60%',
    bg: 'linear-gradient(135deg, #38C6F0 0%, #6B2EE8 100%)',
  },
  {
    label: 'MICRO KOL',
    labelColor: '#6B2EE8',
    kolCount: '100 KOL',
    desc: 'Broader reach with high relevance',
    width: '80%',
    bg: 'linear-gradient(135deg, #6B2EE8 0%, #E8197A 100%)',
  },
  {
    label: 'MASSIVE IMPACT',
    labelColor: 'white',
    kolCount: '500+ KOL',
    desc: 'Full-scale campaign domination',
    width: '100%',
    bg: 'linear-gradient(135deg, #E8197A 0%, #6B2EE8 50%, #38C6F0 100%)',
  },
];

export default function OurOffer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section style={{ background: 'white', padding: '96px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }} ref={ref}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '16px' }}
        >
          <span className="section-label" style={{ display: 'block', marginBottom: '16px' }}>
            KOL Campaign Solution
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: '#1A1040',
              lineHeight: 1.2,
              marginBottom: '12px',
            }}
          >
            End-to-end KOL Campaign Solution
          </h2>
          <p style={{ color: '#8B87B0', fontSize: '1.05rem' }}>
            From 50 to 500+ KOL — skalakan sesuai kebutuhan brand kamu
          </p>
        </motion.div>

        {/* Pyramid tiers */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            margin: '56px 0',
          }}
        >
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.label}
              initial={{ opacity: 0, scaleX: 0.6 }}
              animate={inView ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              style={{
                width: tier.width,
                background: tier.bg,
                borderRadius: '16px',
                padding: '24px 32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 20px rgba(107,46,232,0.2)',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <span
                  style={{
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.2)',
                    color: tier.labelColor,
                    borderRadius: '999px',
                    padding: '4px 12px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginBottom: '6px',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}
                >
                  {tier.label}
                </span>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem' }}>
                  {tier.desc}
                </p>
              </div>
              <p style={{ fontWeight: 900, fontSize: '1.5rem', color: 'white', whiteSpace: 'nowrap' }}>
                {tier.kolCount}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link to="/brand" className="btn-primary" style={{ fontSize: '1rem', padding: '16px 36px' }}>
            Pilih Paket Sesuai Kebutuhan
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
