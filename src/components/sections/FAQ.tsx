import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { faqs } from '../../data/faq';

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section style={{ background: '#F2F0FF', padding: '96px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }} ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <span className="section-label" style={{ display: 'block', marginBottom: '16px' }}>FAQ</span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: '#1A1040',
              lineHeight: 1.2,
            }}
          >
            Pertanyaan yang{' '}
            <span className="pill-label" style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }}>
              Sering Ditanya
            </span>
          </h2>
        </motion.div>

        {/* Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              style={{
                background: 'white',
                borderRadius: '16px',
                border: open === index ? '1.5px solid #6B2EE8' : '1.5px solid transparent',
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}
            >
              {/* Question */}
              <button
                onClick={() => setOpen(open === index ? null : index)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '22px 24px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  gap: '16px',
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1A1040', lineHeight: 1.5 }}>
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  color="#6B2EE8"
                  style={{
                    flexShrink: 0,
                    transform: open === index ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s',
                  }}
                />
              </button>

              {/* Answer */}
              <AnimatePresence>
                {open === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p
                      style={{
                        padding: '0 24px 22px',
                        color: '#8B87B0',
                        fontSize: '0.9rem',
                        lineHeight: 1.8,
                      }}
                    >
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
