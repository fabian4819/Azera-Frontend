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
  logo?: string;
  logoBg?: string;
}

const placeholders: PortfolioItem[] = [];

const swatches = ['#6728e4', '#814bfe', '#7f003f'];

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

  if (items.length === 0) return null;

  return (
    <section className="section-py" style={{ background: '#ffffff' }} ref={ref}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          style={{ textAlign: 'center', marginBottom: '64px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="tag-pill tag-pill-purple" style={{ marginBottom: '16px' }}>Portfolio</span>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: 'var(--on-background)', lineHeight: 1.15 }}>
            Campaign Terbaik Kami.
          </h2>
        </motion.div>

        <div className="portfolio-prev-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '48px' }}>
          {items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: easeOut, delay: i * 0.12 }}
              className="bento-card"
              style={{ padding: '28px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div
                  style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: item.logo ? (item.logoBg || 'var(--surface-container)') : swatches[i % swatches.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: item.logo ? '8px' : 0,
                  }}
                >
                  {item.logo ? (
                    <img src={item.logo} alt={`Logo ${item.brand}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.3rem', color: 'white' }}>{item.brand[0]}</span>
                  )}
                </div>
                {item.featured && <span className="tag-pill tag-pill-purple">Featured</span>}
              </div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: 'var(--on-background)', marginBottom: '4px' }}>
                {item.brand}
              </h3>
              <p style={{ color: 'var(--secondary)', fontSize: '0.82rem', marginBottom: '14px', fontWeight: 500 }}>
                {item.hashtag}
              </p>
              <span style={{ background: 'var(--surface-container)', color: 'var(--on-surface-variant)', borderRadius: '999px', padding: '4px 14px', fontSize: '0.72rem', fontWeight: 600, display: 'inline-block', marginBottom: '20px' }}>
                {item.category}
              </span>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', borderTop: '1px solid var(--outline-variant)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--outline)', fontSize: '0.78rem' }}>
                  <Users size={13} /> {item.kolCount} KOL
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--outline)', fontSize: '0.78rem' }}>
                  <Eye size={13} /> {item.reach}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontSize: '0.78rem' }}>
                  <TrendingUp size={13} /> {item.engagement}% ER
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          style={{ textAlign: 'center' }}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut, delay: 0.4 }}
        >
          <Link to="/portfolio" className="btn-outline" style={{ fontSize: '1rem' }}>
            Lihat Semua Portfolio
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
