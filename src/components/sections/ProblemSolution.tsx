import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Quote } from 'lucide-react';
import { ease } from '../../lib/motion';

const solutions = [
  {
    tab: 'Matching Berbasis Data',
    title: 'Matching Berbasis Data',
    desc: 'Algoritma kami mencocokkan brand dengan KOL berdasarkan demografi, engagement, dan performa nyata.',
    image: '/solutions/matching.jpg',
  },
  {
    tab: 'Budget Transparan',
    title: 'Budget Transparan',
    desc: 'Paket harga jelas, laporan terukur, dan ROI yang bisa diprediksi dari awal campaign.',
    image: '/solutions/budget.jpg',
  },
  {
    tab: 'End-to-End Management',
    title: 'End-to-End Management',
    desc: 'Tim AzeraKOL menangani seluruh proses, dari briefing hingga laporan akhir campaign.',
    image: '/solutions/management.jpg',
  },
];

// Kutipan asli & terdokumentasi dari tokoh digital marketing/social media —
// bukan testimoni fiktif, jadi atribusinya harus akurat (nama + peran nyata).
const quotes = [
  { text: 'Content is king, but marketing is queen, and runs the household.', name: 'Gary Vaynerchuk', role: 'CEO, VaynerMedia' },
  { text: 'Marketing is no longer about the stuff you make, but about the stories you tell.', name: 'Seth Godin', role: 'Author & Marketing Speaker' },
  { text: 'Social media is about sociology and psychology more than technology.', name: 'Brian Solis', role: 'Digital Analyst & Author' },
  { text: 'Content is fire, social media is gasoline.', name: 'Jay Baer', role: 'Marketing Consultant & Author' },
];

const QUOTE_DURATION = 5;

function QuoteCarousel() {
  const [index, setIndex] = useState(0);
  const q = quotes[index];

  return (
    <div style={{ position: 'relative', marginTop: '32px' }}>
      <div style={{ position: 'absolute', top: '-8px', left: '18px', right: '18px', height: '16px', borderRadius: '10px', background: 'linear-gradient(90deg, var(--lime), var(--secondary))' }} />
      <div style={{ position: 'relative', background: '#c9b6ff', borderRadius: '18px', padding: '26px', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease }}
          >
            <Quote size={22} color="#2c1065" style={{ opacity: 0.55, marginBottom: '12px' }} />
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: '#1c0a44', lineHeight: 1.5, marginBottom: '18px' }}>
              “{q.text}”
            </p>
            <p style={{ color: 'rgba(28,10,68,0.75)', fontSize: '0.85rem' }}>
              <span style={{ fontWeight: 700 }}>{q.name}</span>, {q.role}
            </p>
          </motion.div>
        </AnimatePresence>

        <div style={{ marginTop: '20px', height: '3px', borderRadius: '999px', background: 'rgba(28,10,68,0.15)', overflow: 'hidden' }}>
          <motion.div
            key={index}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: QUOTE_DURATION, ease: 'linear' }}
            onAnimationComplete={() => setIndex((i) => (i + 1) % quotes.length)}
            style={{ height: '100%', background: '#1c0a44' }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ProblemSolution() {
  const [active, setActive] = useState(0);
  const current = solutions[active];
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} style={{ background: 'linear-gradient(160deg, #2c1065 0%, #1c0a44 100%)', padding: '100px 24px' }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        <motion.div
          style={{ textAlign: 'center', marginBottom: '48px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', display: 'inline-block', marginBottom: '20px' }}>
            Solutions
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
            <span style={{ color: '#fff' }}>AzeraKOL, untuk brand</span><br />
            <span style={{ color: '#c6a5ff' }}>yang serius mau bertumbuh.</span>
          </h2>
        </motion.div>

        <motion.div
          style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '56px' }}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease, delay: 0.15 }}
        >
          {solutions.map((s, i) => (
            <button
              key={s.tab}
              onClick={() => setActive(i)}
              style={{
                padding: '11px 20px',
                background: 'transparent',
                border: i === active ? '1.5px solid #a684ff' : '1.5px solid transparent',
                borderRadius: '10px',
                color: i === active ? '#fff' : 'rgba(255,255,255,0.4)',
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem',
                cursor: 'pointer', transition: 'color 0.25s ease, border-color 0.25s ease',
              }}
            >
              {s.tab}
            </button>
          ))}
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' }} className="ps-grid">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease }}
              style={{ borderRadius: '24px', overflow: 'hidden', height: '440px' }}
            >
              <img src={current.image} alt={current.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </motion.div>
          </AnimatePresence>

          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease }}
              >
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', color: '#fff', letterSpacing: '-0.02em', marginBottom: '16px' }}>
                  {current.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', lineHeight: 1.7 }}>
                  {current.desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Kutipan berputar otomatis, independen dari tab solusi di atas */}
            <QuoteCarousel />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
