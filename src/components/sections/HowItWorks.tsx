import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ClipboardList, Search, Rocket, TrendingUp } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'PLAN',
    desc: 'Understand your goals & audience',
  },
  {
    number: '02',
    icon: Search,
    title: 'MATCH',
    desc: 'Select the right KOL for your brand',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'EXECUTE',
    desc: 'Fully managed campaign from brief to results',
  },
  {
    number: '04',
    icon: TrendingUp,
    title: 'SCALE',
    desc: 'Optimize for better performance',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section style={{ background: 'white', padding: '96px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }} ref={ref}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '72px' }}
        >
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: '#1A1040',
              lineHeight: 1.2,
            }}
          >
            How it{' '}
            <span className="pill-label" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)' }}>
              works
            </span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0',
            position: 'relative',
          }}
          className="steps-grid"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '0 24px',
                  position: 'relative',
                }}
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className="connector-line"
                    style={{
                      position: 'absolute',
                      top: '44px',
                      left: 'calc(50% + 44px)',
                      right: 'calc(-50% + 44px)',
                      borderTop: '2px dashed #E0DCFF',
                      zIndex: 0,
                    }}
                  />
                )}

                {/* Number */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    marginBottom: '16px',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {step.number}
                </div>

                {/* Icon box */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: '#F0EEFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <Icon size={28} color="#6B2EE8" />
                </div>

                {/* Title */}
                <p style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1A1040', marginBottom: '8px' }}>
                  {step.title}
                </p>

                {/* Desc */}
                <p style={{ color: '#8B87B0', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .steps-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .connector-line { display: none !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .steps-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 40px !important; }
          .connector-line { display: none !important; }
        }
      `}</style>
    </section>
  );
}
