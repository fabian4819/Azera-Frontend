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
    <section style={{ background: '#FAFAFA', padding: '128px 24px' }} ref={ref}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '72px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="section-label" style={{ display: 'inline-block', marginBottom: '16px' }}>
            FAQ
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
            Pertanyaan yang{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Sering Ditanya.
            </span>
          </h2>
        </motion.div>

        {/* Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: easeOut, delay: i * 0.07 }}
                style={{
                  borderBottom: '1px solid rgba(107,46,232,0.1)',
                  position: 'relative',
                }}
              >
                {/* Active left accent bar */}
                {isOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '-24px',
                      top: 0,
                      bottom: 0,
                      width: '3px',
                      background: 'linear-gradient(180deg, #6B2EE8, #E8197A)',
                      borderRadius: '0 2px 2px 0',
                    }}
                  />
                )}

                {/* Question row */}
                <button
                  onClick={() => toggle(i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    padding: '24px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: isOpen ? '#6B2EE8' : '#120E28',
                      transition: 'color 0.2s',
                      lineHeight: 1.4,
                    }}
                  >
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ flexShrink: 0, color: isOpen ? '#6B2EE8' : '#8B87A8' }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: easeOut }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p
                        style={{
                          color: '#5B5780',
                          fontSize: '0.925rem',
                          lineHeight: 1.8,
                          fontFamily: 'Plus Jakarta Sans, sans-serif',
                          paddingBottom: '24px',
                        }}
                      >
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
