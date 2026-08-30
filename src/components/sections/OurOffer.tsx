import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const tiers = [
  { label: 'Nano KOL', count: '50 KOL', desc: '1K–10K followers, engagement tinggi', tint: 'purple', delay: 0.1 },
  { label: 'Micro KOL', count: '100 KOL', desc: '10K–100K followers, reach lebih luas', tint: 'pink', delay: 0.2 },
  { label: 'Massive Impact', count: '500+ KOL', desc: 'Gabungan semua tier, dampak maksimal', tint: 'dark', delay: 0.3 },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function OurOffer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-py" style={{ background: 'var(--surface-low)' }} ref={ref}>
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          style={{ textAlign: 'center', marginBottom: '56px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="tag-pill tag-pill-navy" style={{ marginBottom: '16px' }}>Paket Layanan</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'var(--on-background)', lineHeight: 1.15, marginBottom: '14px' }}>
            Skalakan Campaign Kamu.
          </h2>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto' }}>
            Dari puluhan hingga ratusan KOL — AzeraKOL menyediakan solusi campaign end-to-end untuk setiap skala brand.
          </p>
        </motion.div>

        <div className="offer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '48px' }}>
          {tiers.map((tier) => (
            <motion.div
              key={tier.label}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: easeOut, delay: tier.delay }}
              className={tier.tint === 'dark' ? 'bento-card-dark' : 'bento-card'}
              style={{ padding: '28px' }}
            >
              <span className={`tag-pill ${tier.tint === 'dark' ? 'tag-pill-white' : tier.tint === 'purple' ? 'tag-pill-purple' : 'tag-pill-pink'}`} style={{ marginBottom: '20px' }}>
                {tier.label}
              </span>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: '2rem', color: tier.tint === 'dark' ? '#fff' : 'var(--on-background)', lineHeight: 1, marginBottom: '8px' }}>
                {tier.count}
              </p>
              <p style={{ color: tier.tint === 'dark' ? 'rgba(255,255,255,0.65)' : 'var(--on-surface-variant)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                {tier.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          style={{ textAlign: 'center' }}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut, delay: 0.4 }}
        >
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem', marginBottom: '28px' }}>
            From 50 to 500+ KOL — End-to-end campaign solution
          </p>
          <Link to="/brand" className="btn-primary" style={{ fontSize: '1rem' }}>
            Pilih Paket
          </Link>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .offer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
