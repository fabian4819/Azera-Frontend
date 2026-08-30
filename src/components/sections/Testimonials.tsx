import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote } from 'lucide-react';
import { ease } from '../../lib/motion';

// Brand portfolio AzeraKOL (logo asli, sama seperti yang dipakai di halaman Portfolio).
// Kutipan sengaja generik & atribusinya "Tim [Brand]" — bukan nama orang yang dikarang,
// supaya tidak mengklaim ada individu spesifik yang mengucapkannya.
const brandQuotes = [
  { brand: 'Hanasui', logo: '/logos/hanasui.png', quote: 'Campaign dengan AzeraKOL membantu kami menjangkau audiens yang lebih tepat sasaran.' },
  { brand: 'Pigeon', logo: '/logos/pigeon.svg', quote: 'Proses kerja sama rapi, dari seleksi KOL sampai laporan akhir campaign.' },
  { brand: 'XL Axiata', logo: '/logos/xl-axiata.svg', quote: 'AzeraKOL memahami kebutuhan campaign kami dengan cepat dan detail.' },
  { brand: 'Kopi ABC', logo: '/logos/kopi-abc.png', quote: 'Hasil campaign melampaui ekspektasi, komunikasi juga lancar dari awal.' },
  { brand: 'Smartfren', logo: '/logos/smartfren.svg', quote: 'Kami percaya AzeraKOL untuk mengelola campaign KOL secara end-to-end.' },
  { brand: 'Pertamina', logo: '/logos/pertamina.svg', quote: 'Kolaborasi yang profesional, dengan hasil campaign yang terukur.' },
];

const cardStyles = [
  { bg: 'var(--secondary)', text: '#fff', sub: 'rgba(255,255,255,0.7)', chip: 'rgba(255,255,255,0.14)' },
  { bg: '#ece6ff', text: 'var(--on-background)', sub: 'var(--outline)', chip: '#ffffff' },
  { bg: 'var(--lime)', text: 'var(--on-lime)', sub: 'rgba(21,21,125,0.6)', chip: 'rgba(255,255,255,0.55)' },
  { bg: 'var(--primary)', text: '#fff', sub: 'rgba(255,255,255,0.6)', chip: 'rgba(255,255,255,0.14)' },
];

function TestimonialCard({ item, styleIdx }: { item: (typeof brandQuotes)[number]; styleIdx: number }) {
  const s = cardStyles[styleIdx % cardStyles.length];
  return (
    <div
      style={{
        background: s.bg,
        borderRadius: '20px',
        padding: '26px',
        width: '280px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '210px',
      }}
    >
      <div>
        <Quote size={20} color={s.text} style={{ opacity: 0.5, marginBottom: '12px' }} />
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: s.text, lineHeight: 1.5 }}>
          {item.quote}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '18px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: s.chip, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5px', flexShrink: 0 }}>
          <img src={item.logo} alt={item.brand} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.78rem', color: s.text }}>Tim {item.brand}</p>
          <p style={{ fontSize: '0.7rem', color: s.sub }}>{item.brand}</p>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ items, direction, duration }: { items: (typeof brandQuotes)[number][]; direction: 'left' | 'right'; duration: number }) {
  // Konten digandakan 2x (dua set identik berurutan) — trik CSS marquee klasik:
  // animasikan translateX 0 -> -50%, begitu sampai -50% posisinya identik dengan
  // awal lagi, jadi loop-nya mulus tak terlihat sambungannya.
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: 'hidden', width: '100%' }} className="marquee-row">
      <div
        className={direction === 'left' ? 'marquee-track-left' : 'marquee-track-right'}
        style={{ display: 'flex', gap: '20px', width: 'fit-content', animationDuration: `${duration}s` }}
      >
        {doubled.map((item, i) => (
          <TestimonialCard key={i} item={item} styleIdx={i} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Portfolio cuma 6 brand — digandakan berkali-kali per baris (dengan urutan/offset
  // beda tiap baris) supaya marquee-nya terasa "banyak", sesuai permintaan.
  const rowA = [...brandQuotes, ...brandQuotes, ...brandQuotes];
  const rowB = [...brandQuotes.slice(3), ...brandQuotes.slice(0, 3), ...brandQuotes, ...brandQuotes];

  return (
    <section className="section-py" style={{ background: 'var(--surface-low)', overflow: 'hidden' }} ref={ref}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          style={{ textAlign: 'center', marginBottom: '56px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
        >
          <span className="tag-pill tag-pill-pink" style={{ marginBottom: '16px' }}>Testimoni</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'var(--on-background)', lineHeight: 1.15, marginBottom: '10px' }}>
            Dipercaya Brand Ternama.
          </h2>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem' }}>
            Sebagian brand yang sudah menjalankan campaign KOL bersama AzeraKOL.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, ease, delay: 0.15 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        <MarqueeRow items={rowA} direction="left" duration={42} />
        <MarqueeRow items={rowB} direction="right" duration={48} />
      </motion.div>

      <style>{`
        @keyframes marquee-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .marquee-track-left { animation-name: marquee-left; animation-timing-function: linear; animation-iteration-count: infinite; }
        .marquee-track-right { animation-name: marquee-right; animation-timing-function: linear; animation-iteration-count: infinite; }
        .marquee-row:hover .marquee-track-left,
        .marquee-row:hover .marquee-track-right { animation-play-state: paused; }
      `}</style>
    </section>
  );
}
