import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const tiers = [
  {
    label: 'NANO KOL',
    count: '50 KOL',
    desc: '1K–10K followers, engagement tinggi',
    gradient: 'linear-gradient(135deg, #6B2EE8, #7C3AFF)',
    width: '60%',
    delay: 0.15,
  },
  {
    label: 'MICRO KOL',
    count: '100 KOL',
    desc: '10K–100K followers, reach lebih luas',
    gradient: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
    width: '80%',
    delay: 0.25,
  },
  {
    label: 'MASSIVE IMPACT',
    count: '500+ KOL',
    desc: 'Gabungan semua tier, dampak maksimal',
    gradient: 'linear-gradient(135deg, #E8197A, #38C6F0)',
    width: '100%',
    delay: 0.35,
  },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function OurOffer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section style={{ background: '#FAFAFA', padding: '128px 24px' }} ref={ref}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '72px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="section-label" style={{ display: 'inline-block', marginBottom: '16px' }}>
            Paket Layanan
          </span>
          <h2
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: '#120E28',
              lineHeight: 1.15,
              marginBottom: '16px',
            }}
          >
            Skalakan{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Kampanye
            </span>{' '}
            Kamu.
          </h2>
          <p style={{ color: '#5B5780', fontSize: '1rem', lineHeight: 1.7, maxWidth: '500px', margin: '0 auto', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Dari puluhan hingga ratusan KOL — Azera menyediakan solusi kampanye end-to-end untuk setiap skala brand.
          </p>
        </motion.div>

        {/* Pyramid tiers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', marginBottom: '56px' }}>
          {tiers.map((tier) => (
            <motion.div
              key={tier.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, ease: easeOut, delay: tier.delay }}
              style={{ width: tier.width, maxWidth: '640px' }}
            >
              <div
                style={{
                  background: tier.gradient,
                  borderRadius: '16px',
                  padding: '24px 32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  boxShadow: '0 8px 32px rgba(107,46,232,0.25)',
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 900,
                      fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                      color: 'white',
                      lineHeight: 1,
                    }}
                  >
                    {tier.count}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', marginTop: '4px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {tier.desc}
                  </p>
                </div>
                <span
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    borderRadius: '999px',
                    padding: '6px 16px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    fontFamily: 'Syne, sans-serif',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tier.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom text + CTA */}
        <motion.div
          style={{ textAlign: 'center' }}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut, delay: 0.5 }}
        >
          <p
            style={{
              color: '#5B5780',
              fontSize: '1rem',
              marginBottom: '32px',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            From 50 to 500+ KOL — End-to-end campaign solution
          </p>
          <Link
            to="/brand"
            className="btn-primary"
            style={{ fontSize: '1rem', padding: '15px 36px' }}
          >
            Pilih Paket →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
