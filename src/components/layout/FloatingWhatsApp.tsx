import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

const WA_PHONE = '6281994035538';
const WA_MESSAGE = 'Halo AzeraKOL!\nSaya ingin tanya-tanya, boleh dibantu?';

export default function FloatingWhatsApp() {
  const link = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(WA_MESSAGE)}`;

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      style={{
        position: 'fixed',
        right: '24px',
        bottom: '24px',
        zIndex: 1000,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        background: '#25D366',
        color: '#fff',
        textDecoration: 'none',
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
    </motion.a>
  );
}
