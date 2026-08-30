import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { faqs } from '../../data/faq';

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section className="section-py" style={{ background: '#ffffff' }} ref={ref}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          style={{ textAlign: 'center', marginBottom: '64px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="tag-pill tag-pill-navy" style={{ marginBottom: '16px' }}>FAQ</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'var(--on-background)', lineHeight: 1.15 }}>
            Pertanyaan yang Sering Ditanya.
          </h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: easeOut, delay: i * 0.07 }}
                style={{ borderBottom: '1px solid rgba(103,40,228,0.08)', position: 'relative' }}
              >
                {isOpen && (
                  <div style={{ position: 'absolute', left: '-24px', top: 0, bottom: 0, width: '3px', background: 'linear-gradient(180deg, #6728e4, #ff81aa)', borderRadius: '0 2px 2px 0' }} />
                )}
                <button
                  onClick={() => toggle(i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: '16px', padding: '24px 0', background: 'none', border: 'none',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1rem', color: isOpen ? '#6728e4' : '#191c20', transition: 'color 0.2s', lineHeight: 1.4 }}>
                    {faq.question}
                  </span>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ flexShrink: 0, color: isOpen ? '#6728e4' : '#777683' }}>
                    <ChevronDown size={20} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: easeOut }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={{ color: '#464652', fontSize: '0.925rem', lineHeight: 1.8, fontFamily: "var(--font-display)", paddingBottom: '24px' }}>
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
