import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
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
}

const placeholders: PortfolioItem[] = [
  { _id: '1', brand: 'BeautyX', hashtag: '#GlowWithBeautyX', category: 'Beauty', kolCount: 120, reach: '2.5M', engagement: 4.8 },
  { _id: '2', brand: 'FreshFood', hashtag: '#FreshFoodChallenge', category: 'F&B', kolCount: 85, reach: '1.8M', engagement: 6.2 },
  { _id: '3', brand: 'StyleHub', hashtag: '#StyleHubOOTD', category: 'Fashion', kolCount: 200, reach: '4.1M', engagement: 5.1 },
];

const gradients = [
  'linear-gradient(135deg, #6B2EE8, #E8197A)',
  'linear-gradient(135deg, #38C6F0, #6B2EE8)',
  'linear-gradient(135deg, #E8197A, #38C6F0)',
];

export default function PortfolioPreview() {
  const [items, setItems] = useState<PortfolioItem[]>(placeholders);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    api.get('/portfolio/featured')
      .then((res) => {
        if (res.data && res.data.length > 0) setItems(res.data);
      })
      .catch(() => {});
  }, []);

  return (
    <section style={{ background: '#F2F0FF', padding: '96px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }} ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <span className="section-label" style={{ display: 'block', marginBottom: '16px' }}>Portfolio</span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: '#1A1040',
              lineHeight: 1.2,
            }}
          >
            Kampanye{' '}
            <span className="pill-label" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)' }}>
              Terbaik
            </span>{' '}
            Kami
          </h2>
        </motion.div>

        {/* Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginBottom: '48px',
          }}
          className="portfolio-grid"
        >
          {items.slice(0, 3).map((item, index) => (
            <motion.div
              key={item._id}
              className="card"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{ overflow: 'hidden' }}
            >
              {/* Brand logo placeholder */}
              <div
                style={{
                  height: '140px',
                  background: gradients[index % gradients.length],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  fontWeight: 900,
                  color: 'rgba(255,255,255,0.3)',
                  letterSpacing: '-0.02em',
                }}
              >
                {item.brand[0]}
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1A1040' }}>{item.brand}</h3>
                  <span
                    style={{
                      background: '#F0EEFF',
                      color: '#6B2EE8',
                      borderRadius: '999px',
                      padding: '3px 10px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                    }}
                  >
                    {item.category}
                  </span>
                </div>
                <p style={{ color: '#8B87B0', fontSize: '0.85rem', marginBottom: '16px' }}>{item.hashtag}</p>

                {/* Metrics */}
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8B87B0', fontSize: '0.8rem' }}>
                    <Users size={14} />
                    <span>{item.kolCount} KOL</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8B87B0', fontSize: '0.8rem' }}>
                    <Eye size={14} />
                    <span>{item.reach}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontSize: '0.8rem' }}>
                    <TrendingUp size={14} />
                    <span>{item.engagement}% ER</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/portfolio" className="btn-outline">
            Lihat Semua Portfolio
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .portfolio-grid { grid-template-columns: 1fr !important; } }
        @media (min-width: 769px) and (max-width: 1024px) { .portfolio-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  );
}
