import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, Users, Rocket, TrendingUp } from 'lucide-react';

const steps = [
  { number: '01', icon: Target, title: 'Plan', desc: 'Diskusi kebutuhan kampanye, target audiens, dan tujuan bisnis brand kamu bersama tim Azera.' },
  { number: '02', icon: Users, title: 'Match', desc: 'Kami menseleksi dan menyajikan shortlist KOL yang paling relevan berdasarkan data.' },
  { number: '03', icon: Rocket, title: 'Execute', desc: 'Tim Azera mengelola seluruh proses dari briefing KOL, review konten, hingga publikasi.' },
  { number: '04', icon: TrendingUp, title: 'Scale', desc: 'Analisis performa kampanye secara real-time dan optimalkan untuk hasil yang maksimal.' },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-py" style={{ background: '#f2f3f9', position: 'relative', overflow: 'hidden' }} ref={ref}>
      <div className="blob" style={{ width: '350px', height: '350px', background: '#e1e0ff', opacity: 0.3, top: '20%', left: '5%' }} />
      <div className="blob" style={{ width: '300px', height: '300px', background: '#ffd9e1', opacity: 0.2, bottom: '15%', right: '5%' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <motion.div
          style={{ textAlign: 'center', marginBottom: '80px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="section-label" style={{ marginBottom: '16px' }}>Proses Kami</span>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#191c20', lineHeight: 1.15 }}>
            How It{' '}
            <span className="pill-label" style={{ fontSize: '0.85rem', verticalAlign: 'middle' }}>Works</span>
          </h2>
        </motion.div>

        <div className="hiw-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', position: 'relative' }}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} style={{ position: 'relative' }}>
                {i < steps.length - 1 && (
                  <div
                    className="hiw-connector"
                    style={{
                      position: 'absolute',
                      top: '48px',
                      left: '55%',
                      right: '-45%',
                      height: '2px',
                      borderTop: '2px dashed rgba(103,40,228,0.25)',
                      zIndex: 0,
                    }}
                  />
                )}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, ease: easeOut, delay: i * 0.12 }}
                  style={{ textAlign: 'center', padding: '0 24px', position: 'relative', zIndex: 1 }}
                >
                  <div
                    className="kinetic-glow"
                    style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
                      fontSize: '0.7rem', color: 'white', letterSpacing: '0.04em',
                    }}
                  >
                    {step.number}
                  </div>
                  <div
                    className="glass-panel"
                    style={{
                      width: '64px', height: '64px', borderRadius: '16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 20px', background: 'white', boxShadow: '0 4px 20px rgba(103,40,228,0.1)',
                    }}
                  >
                    <Icon size={28} color="#6728e4" />
                  </div>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#191c20', marginBottom: '10px' }}>{step.title}</p>
                  <p style={{ color: '#464652', fontSize: '0.875rem', lineHeight: 1.7 }}>{step.desc}</p>
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
