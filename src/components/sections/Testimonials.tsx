import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
  gradient: string;
}

const testimonials: Testimonial[] = [
  {
    quote: 'Azera benar-benar mengubah cara kami beriklan. Dengan 80 KOL dalam satu kampanye, brand awareness kami naik 3x dalam 2 minggu. Hasilnya melebihi ekspektasi kami!',
    name: 'Sari Dewi',
    role: 'Marketing Manager, BeautyX',
    initials: 'SD',
    gradient: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
  },
  {
    quote: 'Tim Azera sangat profesional. Dari brief, matching KOL, hingga reporting — semua terstruktur dan transparan. Ini adalah best ROI yang pernah kami dapatkan dari campaign digital.',
    name: 'Budi Santoso',
    role: 'CEO, FreshFood Indonesia',
    initials: 'BS',
    gradient: 'linear-gradient(135deg, #38C6F0, #6B2EE8)',
  },
  {
    quote: 'Kami sudah coba macro influencer sebelumnya tapi hasilnya biasa saja. Dengan Azera pakai 150 micro KOL, engagement rate kami 5x lebih tinggi dan conversion-nya nyata terasa.',
    name: 'Anita Rahma',
    role: 'Brand Director, StyleHub',
    initials: 'AR',
    gradient: 'linear-gradient(135deg, #E8197A, #38C6F0)',
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const prev = () => setActive((a) => (a - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((a) => (a + 1) % testimonials.length);

  return (
    <section style={{ background: 'white', padding: '96px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }} ref={ref}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '64px', flexWrap: 'wrap', gap: '16px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label" style={{ display: 'block', marginBottom: '12px' }}>Testimoni</span>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
                color: '#1A1040',
                lineHeight: 1.2,
              }}
            >
              Apa Kata{' '}
              <span className="pill-label" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)' }}>
                Klien Kami
              </span>
              ?
            </h2>
          </motion.div>

          {/* Navigation arrows */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={prev}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: '1.5px solid #E0DCFF',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6B2EE8',
                transition: 'all 0.2s',
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                border: 'none',
                background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                transition: 'all 0.2s',
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Testimonial cards - 3 col grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}
          className="testimonials-grid"
        >
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              className="card"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                padding: '32px',
                border: index === active ? '2px solid #6B2EE8' : undefined,
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}
              onClick={() => setActive(index)}
            >
              {/* Quote icon */}
              <Quote
                size={40}
                color="#6B2EE8"
                style={{ opacity: 0.15, marginBottom: '16px' }}
              />

              {/* Quote text */}
              <p style={{ color: '#1A1040', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '24px', fontStyle: 'italic' }}>
                "{t.quote}"
              </p>

              {/* Avatar + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: t.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    flexShrink: 0,
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A1040' }}>{t.name}</p>
                  <p style={{ fontSize: '0.8rem', color: '#8B87B0' }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? '24px' : '8px',
                height: '8px',
                borderRadius: '999px',
                background: i === active ? '#6B2EE8' : '#E0DCFF',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .testimonials-grid { grid-template-columns: 1fr !important; } }
        @media (min-width: 769px) and (max-width: 1024px) { .testimonials-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  );
}
