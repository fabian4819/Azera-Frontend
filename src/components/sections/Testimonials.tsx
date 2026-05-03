import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    quote: 'Azera benar-benar mengubah cara kami menjalankan kampanye KOL. Prosesnya profesional, hasilnya terukur, dan tim mereka sangat responsif.',
    name: 'Sari Dewi',
    role: 'Marketing Manager, BeautyX',
    initials: 'SD',
  },
  {
    quote: 'Dalam 3 minggu kampanye dengan Azera, reach kami meningkat 4x lipat dan konversi penjualan naik 60%. Luar biasa efektif!',
    name: 'Budi Santoso',
    role: 'CEO, FreshFood Indonesia',
    initials: 'BS',
  },
  {
    quote: 'Kami sudah coba beberapa agency KOL sebelumnya, tapi Azera benar-benar berbeda. Data-driven, transparan, dan hasil kampanye melampaui ekspektasi.',
    name: 'Rini Larasati',
    role: 'Brand Director, StyleHub',
    initials: 'RL',
  },
];

const gradients = [
  'linear-gradient(135deg, #6B2EE8, #E8197A)',
  'linear-gradient(135deg, #E8197A, #38C6F0)',
  'linear-gradient(135deg, #38C6F0, #6B2EE8)',
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const prev = () => setActive((v) => (v - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((v) => (v + 1) % testimonials.length);

  return (
    <section style={{ background: '#F2F0FF', padding: '128px 24px' }} ref={ref}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '72px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="section-label" style={{ display: 'inline-block', marginBottom: '16px' }}>
            Testimoni
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
            Apa Kata{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Klien Kami?
            </span>
          </h2>
        </motion.div>

        {/* Desktop: 3 cards */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}
          className="testimonials-grid"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: easeOut, delay: i * 0.12 }}
            >
              <div className="light-card" style={{ padding: '32px', height: '100%' }}>
                {/* Quote mark */}
                <p
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: '4rem',
                    lineHeight: 0.8,
                    marginBottom: '16px',
                    background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  "
                </p>
                <p
                  style={{
                    color: '#5B5780',
                    fontSize: '0.95rem',
                    lineHeight: 1.75,
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    marginBottom: '28px',
                    fontStyle: 'italic',
                  }}
                >
                  {t.quote}
                </p>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(107,46,232,0.1)', marginBottom: '20px' }} />

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: gradients[i % gradients.length],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      color: 'white',
                      flexShrink: 0,
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#120E28' }}>
                      {t.name}
                    </p>
                    <p style={{ color: '#8B87A8', fontSize: '0.78rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: single card with arrows */}
        <div className="testimonials-mobile" style={{ display: 'none' }}>
          <div className="light-card" style={{ padding: '32px', marginBottom: '24px' }}>
            <p
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: '4rem',
                lineHeight: 0.8,
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              "
            </p>
            <p style={{ color: '#5B5780', fontSize: '0.95rem', lineHeight: 1.75, fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '28px', fontStyle: 'italic' }}>
              {testimonials[active].quote}
            </p>
            <div style={{ height: '1px', background: 'rgba(107,46,232,0.1)', marginBottom: '20px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: gradients[active % gradients.length],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: 'white',
                }}
              >
                {testimonials[active].initials}
              </div>
              <div>
                <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#120E28' }}>{testimonials[active].name}</p>
                <p style={{ color: '#8B87A8', fontSize: '0.78rem' }}>{testimonials[active].role}</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={prev}
              style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1.5px solid #E0DCFF', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B2EE8' }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1.5px solid #E0DCFF', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B2EE8' }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .testimonials-grid { display: none !important; }
          .testimonials-mobile { display: block !important; }
        }
      `}</style>
    </section>
  );
}
