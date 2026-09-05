import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote } from 'lucide-react';
import { ease } from '../../lib/motion';

interface QuoteItem {
  quote: string;
  name: string;
  title?: string;
  badge: string;
}

// Testimoni nyata dari klien, dengan atribusi orangnya langsung (bukan brand generik).
const quoteItems: QuoteItem[] = [
  {
    quote: 'Pas pakai jasa KOL Visit dari Azera untuk Campaign Modern Elektronik, ga nyangka sales naik 3x lipat. Padahal dari awal Azera tidak menjanjikan sales, karena saya juga menyadari bahwa KOL memang ditujukan untuk awareness. Happy doing business with Azera. Next event, ada pesanan KOL lagi.',
    name: 'Farrel', title: 'CEO of Amartya', badge: 'Repeat Client · 6 Campaigns · 2025–2026',
  },
  {
    quote: 'So far aku suka banget karena timnya gercep dan bisa paham arahan serta brief yang aku kasih. Bahkan sering bantu check dulu sebelum aku check, which is sangat membantu. Timnya juga enak diajak diskusi dan kalau ada yang belum dipahami, bisa langsung dibahas lewat call.',
    name: 'Rahel Indriawan', title: 'Campaign Connector', badge: 'Repeat Client · 30+ Campaigns · Since 2024',
  },
];

const cardStyles = [
  { bg: 'var(--secondary)', text: '#fff', sub: 'rgba(255,255,255,0.7)', chip: 'rgba(255,255,255,0.14)' },
  { bg: '#ece6ff', text: 'var(--on-background)', sub: 'var(--outline)', chip: '#ffffff' },
  { bg: 'var(--lime)', text: 'var(--on-lime)', sub: 'rgba(21,21,125,0.6)', chip: 'rgba(255,255,255,0.55)' },
  { bg: 'var(--primary)', text: '#fff', sub: 'rgba(255,255,255,0.6)', chip: 'rgba(255,255,255,0.14)' },
];

function TestimonialCard({ item, styleIdx }: { item: QuoteItem; styleIdx: number }) {
  const s = cardStyles[styleIdx % cardStyles.length];
  return (
    <div
      style={{
        background: s.bg,
        borderRadius: '20px',
        padding: '26px',
        width: '300px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '230px',
      }}
    >
      <div>
        <Quote size={20} color={s.text} style={{ opacity: 0.5, marginBottom: '12px' }} />
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: s.text, lineHeight: 1.5 }}>
          {item.quote}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '18px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: s.chip, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.text, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
          {item.name[0].toUpperCase()}
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.78rem', color: s.text }}>
            {item.name}{item.title ? ` — ${item.title}` : ''}
          </p>
          <p style={{ fontSize: '0.7rem', color: s.sub }}>{item.badge}</p>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ items, direction, duration }: { items: QuoteItem[]; direction: 'left' | 'right'; duration: number }) {
  // Konten digandakan 2x (dua set identik berurutan) — trik CSS marquee klasik:
  // animasikan translateX 0 -> -50%, begitu sampai -50% posisinya identik dengan
  // awal lagi, jadi loop-nya mulus tak terlihat sambungannya.
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: 'hidden', width: '100%' }} className="marquee-row">
      <div
        className={direction === 'left' ? 'marquee-track-left' : 'marquee-track-right'}
        style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', width: 'fit-content', animationDuration: `${duration}s` }}
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

  // Cuma 2 testimoni — diulang beberapa kali dulu supaya track-nya cukup panjang
  // dan terasa looping tak berujung, bukan cuma bolak-balik 2 kartu.
  const loopItems = Array(6).fill(quoteItems).flat();

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
      >
        <MarqueeRow items={loopItems} direction="left" duration={60} />
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
