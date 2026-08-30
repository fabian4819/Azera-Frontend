import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Plus } from 'lucide-react';
import { ease } from '../../lib/motion';
import { faqs } from '../../data/faq';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section ref={ref} style={{ background: 'linear-gradient(160deg, #2c1065 0%, #1c0a44 100%)', padding: '100px 24px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <motion.div
          style={{ textAlign: 'center', marginBottom: '56px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', display: 'inline-block', marginBottom: '18px' }}>
            FAQs
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, 4.8vw, 3.2rem)', color: '#c6a5ff', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
            Bukan sekadar agency biasa.
          </h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease, delay: i * 0.07 }}
                style={{
                  background: isOpen ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.09)',
                  borderRadius: '22px',
                  transition: 'background 0.25s ease',
                }}
              >
                <button
                  onClick={() => toggle(i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: '20px', padding: '22px 26px', background: 'none', border: 'none',
                    cursor: 'pointer', textAlign: 'center',
                  }}
                >
                  <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: '#fff', lineHeight: 1.4 }}>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25, ease }}
                    style={{
                      flexShrink: 0, width: '34px', height: '34px', borderRadius: '50%', background: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)',
                    }}
                  >
                    <Plus size={17} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.9rem', lineHeight: 1.75, textAlign: 'center', padding: '0 26px 26px' }}>
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
