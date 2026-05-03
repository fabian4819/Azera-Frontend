import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const tiers = [
  { label: 'NANO KOL', count: '50 KOL', desc: '1K–10K followers, engagement tinggi', gradient: 'linear-gradient(135deg, #6728e4, #814bfe)', width: '60%', delay: 0.15 },
  { label: 'MICRO KOL', count: '100 KOL', desc: '10K–100K followers, reach lebih luas', gradient: 'linear-gradient(135deg, #6728e4, #ff81aa)', width: '80%', delay: 0.25 },
  { label: 'MASSIVE IMPACT', count: '500+ KOL', desc: 'Gabungan semua tier, dampak maksimal', gradient: 'linear-gradient(135deg, #ff81aa, #814bfe)', width: '100%', delay: 0.35 },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function OurOffer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-py" style={{ background: '#f2f3f9', position: 'relative', overflow: 'hidden' }} ref={ref}>
      <div className="blob" style={{ width: '350px', height: '350px', background: '#e1e0ff', opacity: 0.3, top: '30%', right: '5%' }} />
      <div className="blob" style={{ width: '300px', height: '300px', background: '#ffd9e1', opacity: 0.2, bottom: '20%', left: '5%' }} />

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <motion.div
          style={{ textAlign: 'center', marginBottom: '72px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="section-label" style={{ marginBottom: '16px' }}>Paket Layanan</span>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#191c20', lineHeight: 1.15, marginBottom: '16px' }}>
            Skalakan{' '}
            <span style={{ background: 'linear-gradient(135deg, #6728e4, #ff81aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Kampanye
            </span>{' '}
            Kamu.
          </h2>
          <p style={{ color: '#464652', fontSize: '1rem', lineHeight: 1.7, maxWidth: '500px', margin: '0 auto', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Dari puluhan hingga ratusan KOL — Azera menyediakan solusi kampanye end-to-end untuk setiap skala brand.
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', marginBottom: '56px' }}>
          {tiers.map((tier) => (
            <motion.div
              key={tier.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, ease: easeOut, delay: tier.delay }}
              className="card-hover"
              style={{ width: tier.width, maxWidth: '640px' }}
            >
              <div
                style={{
                  background: tier.gradient,
                  borderRadius: '16px',
                  padding: '28px 36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  boxShadow: '0 8px 32px rgba(103,40,228,0.25)',
                }}
              >
                <div>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: 'white', lineHeight: 1 }}>
                    {tier.count}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem', marginTop: '4px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500 }}>
                    {tier.desc}
                  </p>
                </div>
                <span
                  style={{
                    background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '999px',
                    padding: '8px 18px', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em',
                    fontFamily: "'Plus Jakarta Sans', sans-serif", whiteSpace: 'nowrap',
                  }}
                >
                  {tier.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          style={{ textAlign: 'center' }}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut, delay: 0.5 }}
        >
          <p style={{ color: '#464652', fontSize: '1rem', marginBottom: '32px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            From 50 to 500+ KOL — End-to-end campaign solution
          </p>
          <Link to="/brand" className="btn-primary" style={{ fontSize: '1rem', padding: '15px 36px', gap: '10px' }}>
            <Sparkles size={18} />
            Pilih Paket
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
