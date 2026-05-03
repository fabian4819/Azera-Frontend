import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Eye, TrendingUp } from 'lucide-react';
import api from '../../lib/api';

interface PortfolioItem {
  _id: string;
  brand: string;
  hashtag: string;
  category: string;
  kolCount: number;
  reach: string;
  engagement: number;
  featured?: boolean;
}

const placeholders: PortfolioItem[] = [
  { _id: '1', brand: 'BeautyX', hashtag: '#GlowWithBeautyX', category: 'Beauty', kolCount: 120, reach: '2.5M', engagement: 4.8, featured: true },
  { _id: '2', brand: 'FreshFood', hashtag: '#FreshFoodChallenge', category: 'F&B', kolCount: 85, reach: '1.8M', engagement: 6.2 },
  { _id: '3', brand: 'StyleHub', hashtag: '#StyleHubOOTD', category: 'Fashion', kolCount: 200, reach: '4.1M', engagement: 5.1 },
];

const gradients = [
  'linear-gradient(135deg, #6B2EE8, #E8197A)',
  'linear-gradient(135deg, #38C6F0, #6B2EE8)',
  'linear-gradient(135deg, #E8197A, #38C6F0)',
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function PortfolioPreview() {
  const [items, setItems] = useState<PortfolioItem[]>(placeholders);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    api.get('/portfolio/featured')
      .then((res) => { if (res.data?.length) setItems(res.data.slice(0, 3)); })
      .catch(() => {});
  }, []);

  return (
    <section
      ref={ref}
      style={{ background: '#08060F', padding: '128px 24px', position: 'relative', overflow: 'hidden' }}
    >
      {/* Orbs */}
      <div className="orb" style={{ width: '400px', height: '400px', background: '#E8197A', bottom: '-100px', left: '-100px' }} />
      <div className="orb" style={{ width: '350px', height: '350px', background: '#6B2EE8', top: '-100px', right: '10%', opacity: 0.2 }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '72px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="section-label" style={{ display: 'inline-block', marginBottom: '16px' }}>
            Portfolio
          </span>
          <h2
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: '#EDE9F8',
              lineHeight: 1.15,
            }}
          >
            Kampanye{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Terbaik
            </span>{' '}
            Kami.
          </h2>
        </motion.div>

        {/* Cards */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '56px' }}
          className="portfolio-prev-grid"
        >
          {items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: easeOut, delay: i * 0.12 }}
            >
              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Top gradient bar */}
                <div
                  style={{
                    height: '4px',
                    background: gradients[i % gradients.length],
                  }}
                />

                <div style={{ padding: '28px' }}>
                  {/* Brand initial circle */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: gradients[i % gradients.length],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Syne, sans-serif',
                        fontWeight: 900,
                        fontSize: '1.3rem',
                        color: 'white',
                      }}
                    >
                      {item.brand[0]}
                    </div>
                    {item.featured && (
                      <span
                        style={{
                          background: 'rgba(107,46,232,0.2)',
                          color: '#A78BFA',
                          borderRadius: '999px',
                          padding: '4px 12px',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          fontFamily: 'Syne, sans-serif',
                        }}
                      >
                        FEATURED
                      </span>
                    )}
                  </div>

                  <h3
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: '#EDE9F8',
                      marginBottom: '4px',
                    }}
                  >
                    {item.brand}
                  </h3>
                  <p style={{ color: '#38C6F0', fontSize: '0.82rem', marginBottom: '12px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {item.hashtag}
                  </p>

                  <span
                    style={{
                      background: 'rgba(107,46,232,0.2)',
                      color: '#A78BFA',
                      borderRadius: '999px',
                      padding: '4px 12px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      display: 'inline-block',
                      marginBottom: '20px',
                    }}
                  >
                    {item.category}
                  </span>

                  {/* Metrics */}
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8B87A8', fontSize: '0.78rem' }}>
                      <Users size={13} color="#8B87A8" />
                      {item.kolCount} KOL
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8B87A8', fontSize: '0.78rem' }}>
                      <Eye size={13} color="#8B87A8" />
                      {item.reach}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontSize: '0.78rem' }}>
                      <TrendingUp size={13} color="#10B981" />
                      {item.engagement}% ER
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          style={{ textAlign: 'center' }}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut, delay: 0.4 }}
        >
          <Link to="/portfolio" className="btn-outline" style={{ fontSize: '1rem', padding: '14px 36px' }}>
            Lihat Semua Portfolio →
          </Link>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .portfolio-prev-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .portfolio-prev-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
