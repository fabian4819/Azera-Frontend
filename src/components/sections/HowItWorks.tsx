import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, Users, Rocket, TrendingUp } from 'lucide-react';

const steps = [
  { number: '01', icon: Target, title: 'Plan', desc: 'Diskusi kebutuhan campaign, target audiens, dan tujuan bisnis brand kamu bersama tim AzeraKOL.', dark: false },
  { number: '02', icon: Users, title: 'Match', desc: 'Kami menseleksi dan menyajikan shortlist KOL yang paling relevan berdasarkan data.', dark: true },
  { number: '03', icon: Rocket, title: 'Execute', desc: 'Tim AzeraKOL mengelola seluruh proses dari briefing KOL, review konten, hingga publikasi.', dark: false },
  { number: '04', icon: TrendingUp, title: 'Scale', desc: 'Analisis performa campaign secara real-time dan optimalkan untuk hasil yang maksimal.', dark: false },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-py" style={{ background: 'var(--surface-low)' }} ref={ref}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          style={{ textAlign: 'center', marginBottom: '64px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="tag-pill tag-pill-navy" style={{ marginBottom: '16px' }}>Proses Kami</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'var(--on-background)', lineHeight: 1.15 }}>
            How It Works
          </h2>
        </motion.div>

        <div className="hiw-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: easeOut, delay: i * 0.1 }}
                className={step.dark ? 'bento-card-dark' : 'bento-card'}
                style={{ padding: '28px 24px' }}
              >
                <div
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '40px', height: '40px', borderRadius: '12px', marginBottom: '20px',
                    background: step.dark ? 'rgba(255,255,255,0.12)' : 'rgba(103,40,228,0.08)',
                  }}
                >
                  <Icon size={20} color={step.dark ? '#fff' : 'var(--secondary)'} />
                </div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em', color: step.dark ? 'rgba(255,255,255,0.5)' : 'var(--outline)', marginBottom: '8px' }}>
                  STEP {step.number}
                </p>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1.15rem', color: step.dark ? '#fff' : 'var(--on-background)', marginBottom: '10px' }}>
                  {step.title}
                </p>
                <p style={{ color: step.dark ? 'rgba(255,255,255,0.65)' : 'var(--on-surface-variant)', fontSize: '0.85rem', lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hiw-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .hiw-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
