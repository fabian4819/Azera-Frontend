import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Eye, TrendingUp, ArrowRight } from 'lucide-react';
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
  'linear-gradient(135deg, #6728e4, #ff81aa)',
  'linear-gradient(135deg, #814bfe, #6728e4)',
  'linear-gradient(135deg, #ff81aa, #814bfe)',
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
    <section className="section-py" style={{ background: '#ffffff', position: 'relative', overflow: 'hidden' }} ref={ref}>
      <div className="blob" style={{ width: '350px', height: '350px', background: '#e1e0ff', opacity: 0.25, top: '10%', right: '5%' }} />
      <div className="blob" style={{ width: '300px', height: '300px', background: '#ffd9e1', opacity: 0.2, bottom: '10%', left: '5%' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <motion.div
          style={{ textAlign: 'center', marginBottom: '72px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <span className="section-label" style={{ marginBottom: '16px' }}>Portfolio</span>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#191c20', lineHeight: 1.15 }}>
            Kampanye{' '}
            <span className="pill-label" style={{ fontSize: '0.75rem', verticalAlign: 'middle' }}>Terbaik</span>{' '}
            Kami.
          </h2>
        </motion.div>

        <div className="portfolio-prev-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '56px' }}>
          {items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: easeOut, delay: i * 0.12 }}
            >
              <div className="glass-panel card-hover" style={{ overflow: 'hidden' }}>
                <div style={{ height: '4px', background: gradients[i % gradients.length] }} />
                <div style={{ padding: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '52px', height: '52px', borderRadius: '16px', background: gradients[i % gradients.length],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: 'white',
                      }}
                    >
                      {item.brand[0]}
                    </div>
                    {item.featured && (
                      <span style={{ background: '#e1e0ff', color: '#6728e4', borderRadius: '999px', padding: '5px 14px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        FEATURED
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#191c20', marginBottom: '4px' }}>
                    {item.brand}
                  </h3>
                  <p style={{ color: '#814bfe', fontSize: '0.82rem', marginBottom: '12px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500 }}>
                    {item.hashtag}
                  </p>
                  <span style={{ background: '#f3eaff', color: '#6728e4', borderRadius: '999px', padding: '4px 14px', fontSize: '0.72rem', fontWeight: 600, display: 'inline-block', marginBottom: '20px' }}>
                    {item.category}
                  </span>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#777683', fontSize: '0.78rem' }}>
                      <Users size={13} /> {item.kolCount} KOL
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#777683', fontSize: '0.78rem' }}>
                      <Eye size={13} /> {item.reach}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontSize: '0.78rem' }}>
                      <TrendingUp size={13} /> {item.engagement}% ER
                    </div>
                  </div>
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
          <Link to="/portfolio" className="btn-secondary" style={{ fontSize: '1rem', padding: '14px 36px', gap: '10px' }}>
            Lihat Semua Portfolio
            <ArrowRight size={18} />
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
