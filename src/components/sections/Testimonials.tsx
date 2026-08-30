import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const testimonials = [
  { quote: 'AzeraKOL benar-benar mengubah cara kami menjalankan campaign KOL. Prosesnya profesional, hasilnya terukur, dan tim mereka sangat responsif.', name: 'Sari Dewi', role: 'Marketing Manager, BeautyX', initials: 'SD', bg: '#6728e4' },
  { quote: 'Dalam 3 minggu campaign dengan AzeraKOL, reach kami meningkat 4x lipat dan konversi penjualan naik 60%. Luar biasa efektif!', name: 'Budi Santoso', role: 'CEO, FreshFood Indonesia', initials: 'BS', bg: '#814bfe' },
  { quote: 'Kami sudah coba beberapa agency KOL sebelumnya, tapi AzeraKOL benar-benar berbeda. Data-driven, transparan, dan hasil campaign melampaui ekspektasi.', name: 'Rini Larasati', role: 'Brand Director, StyleHub', initials: 'RL', bg: '#7f003f' },
];

const niches = ['Beauty', 'F&B', 'Fashion', 'Tech', 'Home & Living', 'Fitness'];

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const prev = () => setActive((v) => (v - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive((v) => (v + 1) % testimonials.length);
  const t = testimonials[active];

  return (
    <section className="section-py" style={{ background: 'var(--surface-low)' }} ref={ref}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          style={{ textAlign: 'center', marginBottom: '56px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="tag-pill tag-pill-pink" style={{ marginBottom: '16px' }}>Testimoni</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'var(--on-background)', lineHeight: 1.15 }}>
            Apa Kata Klien Kami?
          </h2>
        </motion.div>

        <motion.div
          className="testi-bento"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut, delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 1fr 1fr',
            gridTemplateAreas: `"quote rating niches" "quote hours niches"`,
            gap: '18px',
          }}
        >
          <div
            style={{
              gridArea: 'quote',
              background: 'rgba(103,40,228,0.06)',
              border: '1.5px solid rgba(103,40,228,0.15)',
              borderRadius: 'var(--radius-lg)',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <Quote size={32} color="var(--secondary)" style={{ marginBottom: '16px', opacity: 0.4 }} />
              <p style={{ color: 'var(--on-background)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '28px', fontWeight: 500 }}>
                “{t.quote}”
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "var(--font-display)", fontWeight: 800, fontSize: '0.9rem', color: 'white', flexShrink: 0 }}>
                  {t.initials}
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '0.9rem', color: 'var(--on-background)' }}>{t.name}</p>
                  <p style={{ color: 'var(--outline)', fontSize: '0.78rem' }}>{t.role}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={prev} aria-label="Sebelumnya" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid rgba(103,40,228,0.25)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                  <ChevronLeft size={16} />
                </button>
                <button onClick={next} aria-label="Berikutnya" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1.5px solid rgba(103,40,228,0.25)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="bento-card" style={{ gridArea: 'rating', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
              {[0, 1, 2, 3, 4].map((n) => <Star key={n} size={13} fill="#ff81aa" color="#ff81aa" />)}
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: '1.8rem', color: 'var(--on-background)', lineHeight: 1 }}>4.9</p>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.78rem', marginTop: '4px' }}>Rating Klien</p>
          </div>

          <div className="bento-card" style={{ gridArea: 'hours', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: '1.8rem', color: 'var(--on-background)', lineHeight: 1, marginBottom: '4px' }}>500+</p>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.78rem' }}>Campaign Selesai</p>
          </div>

          <div className="bento-card-dark" style={{ gridArea: 'niches', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '0.9rem', color: '#fff', marginBottom: '14px' }}>
              Brand Kategori yang Kami Layani
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {niches.map((n) => (
                <span key={n} className="tag-pill tag-pill-white">{n}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .testi-bento {
            grid-template-columns: 1fr 1fr !important;
            grid-template-areas: "quote quote" "rating hours" "niches niches" !important;
          }
        }
        @media (max-width: 600px) {
          .testi-bento {
            grid-template-columns: 1fr !important;
            grid-template-areas: "quote" "rating" "hours" "niches" !important;
          }
        }
      `}</style>
    </section>
  );
}
