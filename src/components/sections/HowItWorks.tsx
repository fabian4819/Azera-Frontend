import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, Search, Rocket, TrendingUp } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Target,
    title: 'Plan',
    desc: 'Diskusi kebutuhan kampanye, target audiens, dan tujuan bisnis brand kamu bersama tim Azera.',
  },
  {
    number: '02',
    icon: Search,
    title: 'Match',
    desc: 'Kami menseleksi dan menyajikan shortlist KOL yang paling relevan berdasarkan data.',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Execute',
    desc: 'Tim Azera mengelola seluruh proses dari briefing KOL, review konten, hingga publikasi.',
  },
  {
    number: '04',
    icon: TrendingUp,
    title: 'Scale',
    desc: 'Analisis performa kampanye secara real-time dan optimalkan untuk hasil yang maksimal.',
  },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section style={{ background: '#F2F0FF', padding: '128px 24px' }} ref={ref}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '80px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="section-label" style={{ display: 'inline-block', marginBottom: '16px' }}>
            Proses Kami
          </span>
          <h2
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: '#120E28',
              lineHeight: 1.15,
            }}
          >
            How It{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Works.
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
          className="hiw-grid"
        >
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} style={{ position: 'relative' }}>
                {/* Dashed connector line */}
                {i < steps.length - 1 && (
                  <div
                    className="hiw-connector"
                    style={{
                      position: 'absolute',
                      top: '48px',
                      left: '50%',
                      right: '-50%',
                      height: '2px',
                      borderTop: '2px dashed rgba(107,46,232,0.35)',
                      zIndex: 0,
                    }}
                  />
                )}

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, ease: easeOut, delay: i * 0.12 }}
                  style={{
                    textAlign: 'center',
                    padding: '0 24px 0',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {/* Step number circle */}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 800,
                      fontSize: '0.72rem',
                      color: 'white',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {step.number}
                  </div>

                  {/* Icon card */}
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '14px',
                      background: 'white',
                      boxShadow: '0 4px 20px rgba(107,46,232,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                    }}
                  >
                    <Icon size={24} color="#6B2EE8" />
                  </div>

                  <p
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: '#120E28',
                      marginBottom: '10px',
                    }}
                  >
                    {step.title}
                  </p>
                  <p
                    style={{
                      color: '#5B5780',
                      fontSize: '0.875rem',
                      lineHeight: 1.7,
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                  >
                    {step.desc}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hiw-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hiw-connector { display: none !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .hiw-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 40px !important; }
          .hiw-connector { display: none !important; }
        }
      `}</style>
    </section>
  );
}
