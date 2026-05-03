import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  { quote: 'Azera benar-benar mengubah cara kami menjalankan kampanye KOL. Prosesnya profesional, hasilnya terukur, dan tim mereka sangat responsif.', name: 'Sari Dewi', role: 'Marketing Manager, BeautyX', initials: 'SD' },
  { quote: 'Dalam 3 minggu kampanye dengan Azera, reach kami meningkat 4x lipat dan konversi penjualan naik 60%. Luar biasa efektif!', name: 'Budi Santoso', role: 'CEO, FreshFood Indonesia', initials: 'BS' },
  { quote: 'Kami sudah coba beberapa agency KOL sebelumnya, tapi Azera benar-benar berbeda. Data-driven, transparan, dan hasil kampanye melampaui ekspektasi.', name: 'Rini Larasati', role: 'Brand Director, StyleHub', initials: 'RL' },
];

const gradients = [
  'linear-gradient(135deg, #6728e4, #814bfe)',
  'linear-gradient(135deg, #814bfe, #ff81aa)',
  'linear-gradient(135deg, #ff81aa, #6728e4)',
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const prev = () => setActive((v) => (v - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((v) => (v + 1) % testimonials.length);

  return (
    <section className="section-py" style={{ background: '#f2f3f9', position: 'relative', overflow: 'hidden' }} ref={ref}>
      <div className="blob" style={{ width: '300px', height: '300px', background: '#e1e0ff', opacity: 0.25, top: '15%', right: '5%' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <motion.div
          style={{ textAlign: 'center', marginBottom: '72px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="section-label" style={{ marginBottom: '16px' }}>Testimoni</span>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#191c20', lineHeight: 1.15 }}>
            Apa Kata{' '}
            <span style={{ background: 'linear-gradient(135deg, #6728e4, #ff81aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Klien Kami?
            </span>
          </h2>
        </motion.div>

        <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: easeOut, delay: i * 0.12 }}
            >
              <div className="glass-panel card-hover" style={{ padding: '32px', height: '100%' }}>
                <Quote size={36} color="#814bfe" style={{ marginBottom: '16px', opacity: 0.3 }} />
                <p style={{ color: '#464652', fontSize: '0.95rem', lineHeight: 1.75, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '28px', fontStyle: 'italic' }}>
                  {t.quote}
                </p>
                <div style={{ height: '1px', background: 'rgba(103,40,228,0.08)', marginBottom: '20px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: gradients[i % gradients.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '0.9rem', color: 'white', flexShrink: 0 }}>
                    {t.initials}
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#191c20' }}>{t.name}</p>
                    <p style={{ color: '#777683', fontSize: '0.78rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="testimonials-mobile" style={{ display: 'none' }}>
          <div className="glass-panel" style={{ padding: '32px', marginBottom: '24px' }}>
            <Quote size={36} color="#814bfe" style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ color: '#464652', fontSize: '0.95rem', lineHeight: 1.75, fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '28px', fontStyle: 'italic' }}>
              {testimonials[active].quote}
            </p>
            <div style={{ height: '1px', background: 'rgba(103,40,228,0.08)', marginBottom: '20px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: gradients[active % gradients.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '0.9rem', color: 'white' }}>
                {testimonials[active].initials}
              </div>
              <div>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: '#191c20' }}>{testimonials[active].name}</p>
                <p style={{ color: '#777683', fontSize: '0.78rem' }}>{testimonials[active].role}</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button onClick={prev} style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1.5px solid #c7c8cf', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6728e4' }}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={next} style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1.5px solid #c7c8cf', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6728e4' }}>
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
