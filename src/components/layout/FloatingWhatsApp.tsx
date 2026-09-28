import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { contactOptions } from '../../lib/contact';

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'fixed', right: '24px', bottom: '24px', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{ background: '#fff', borderRadius: '16px', padding: '8px', boxShadow: '0 12px 32px rgba(25,28,32,0.18)', minWidth: '180px' }}
          >
            {contactOptions.map((opt) => (
              <a
                key={opt.label}
                href={opt.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px',
                  fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.88rem',
                  textDecoration: 'none', color: 'var(--on-background)', whiteSpace: 'nowrap',
                }}
              >
                <FaWhatsapp size={18} color="#25D366" />
                Untuk {opt.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat via WhatsApp"
        aria-expanded={open}
        initial={{ opacity: 0, y: 16, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4, ease: 'easeOut' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: '#25D366',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '999px',
          padding: '12px 20px 12px 12px',
          boxShadow: '0 10px 30px rgba(37, 211, 102, 0.4)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '0.9rem',
          whiteSpace: 'nowrap',
        }}
      >
        <FaWhatsapp size={26} color="#fff" />
        <span>Contact Us</span>
      </motion.button>
    </div>
  );
}
