import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, TrendingUp } from 'lucide-react';
import api from '../lib/api';

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
  { _id: '1', brand: 'BeautyX', hashtag: '#GlowWithBeautyX', category: 'Beauty', kolCount: 120, reach: '2.5M', engagement: 4.8 },
  { _id: '2', brand: 'FreshFood', hashtag: '#FreshFoodChallenge', category: 'F&B', kolCount: 85, reach: '1.8M', engagement: 6.2 },
  { _id: '3', brand: 'StyleHub', hashtag: '#StyleHubOOTD', category: 'Fashion', kolCount: 200, reach: '4.1M', engagement: 5.1 },
  { _id: '4', brand: 'TechMart', hashtag: '#TechMartDeal', category: 'Tech', kolCount: 60, reach: '900K', engagement: 3.5 },
  { _id: '5', brand: 'FitLife', hashtag: '#FitLifeChallenge', category: 'Fitness', kolCount: 150, reach: '3.2M', engagement: 7.1 },
  { _id: '6', brand: 'HomeNest', hashtag: '#HomeNestInspo', category: 'Home & Living', kolCount: 45, reach: '750K', engagement: 4.2 },
];

const gradients = [
  'linear-gradient(135deg, #6B2EE8, #E8197A)',
  'linear-gradient(135deg, #38C6F0, #6B2EE8)',
  'linear-gradient(135deg, #E8197A, #38C6F0)',
  'linear-gradient(135deg, #6B2EE8, #38C6F0)',
  'linear-gradient(135deg, #E8197A, #6B2EE8)',
  'linear-gradient(135deg, #38C6F0, #E8197A)',
];

const allCategories = ['Semua', 'Beauty', 'F&B', 'Fashion', 'Tech', 'Fitness', 'Home & Living'];

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>(placeholders);
  const [activeCategory, setActiveCategory] = useState('Semua');

  useEffect(() => {
    api.get('/portfolio')
      .then((res) => { if (res.data?.length) setItems(res.data); })
      .catch(() => {});
  }, []);

  const filtered = activeCategory === 'Semua'
    ? items
    : items.filter((i) => i.category === activeCategory);

  return (
    <div style={{ background: '#F2F0FF', minHeight: '100vh', paddingTop: '80px' }}>
      {/* Hero */}
      <div style={{ background: '#0F0A2E', padding: '80px 24px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="orb" style={{ width: '350px', height: '350px', background: 'rgba(107,46,232,0.3)', top: '-100px', right: '-80px' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-label" style={{ color: '#38C6F0', display: 'block', marginBottom: '16px' }}>Portfolio</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '12px' }}>
            Kampanye <span className="gradient-text">Sukses</span> Kami
          </h1>
          <p style={{ color: '#8B87B0', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto' }}>
            Hasil nyata dari ratusan kampanye KOL yang telah kami jalankan bersama brand terpercaya.
          </p>
        </div>
      </div>

      {/* Filter + Grid */}
      <div style={{ maxWidth: '1200px', margin: '-40px auto 80px', padding: '0 24px' }}>
        {/* Filter bar */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '32px', justifyContent: 'center' }}>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '9px 20px',
                borderRadius: '999px',
                border: `1.5px solid ${activeCategory === cat ? '#6B2EE8' : '#E0DCFF'}`,
                background: activeCategory === cat ? '#6B2EE8' : 'white',
                color: activeCategory === cat ? 'white' : '#8B87B0',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}
          className="portfolio-grid"
        >
          {filtered.map((item, index) => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="card"
              style={{ overflow: 'hidden' }}
            >
              {/* Header */}
              <div
                style={{
                  height: '140px',
                  background: gradients[index % gradients.length],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    fontSize: '4rem',
                    fontWeight: 900,
                    color: 'rgba(255,255,255,0.2)',
                    lineHeight: 1,
                  }}
                >
                  {item.brand[0]}
                </span>
                {item.featured && (
                  <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '999px', padding: '4px 12px', fontSize: '0.7rem', fontWeight: 700, position: 'absolute', top: '12px', right: '12px' }}>
                    FEATURED
                  </span>
                )}
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1A1040' }}>{item.brand}</h3>
                  <span style={{ background: '#F0EEFF', color: '#6B2EE8', borderRadius: '999px', padding: '3px 10px', fontSize: '0.7rem', fontWeight: 600 }}>
                    {item.category}
                  </span>
                </div>
                <p style={{ color: '#8B87B0', fontSize: '0.82rem', marginBottom: '16px' }}>{item.hashtag}</p>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8B87B0', fontSize: '0.78rem' }}>
                    <Users size={13} />{item.kolCount} KOL
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#8B87B0', fontSize: '0.78rem' }}>
                    <Eye size={13} />{item.reach}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10B981', fontSize: '0.78rem' }}>
                    <TrendingUp size={13} />{item.engagement}% ER
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: '#8B87B0' }}>
            <p style={{ fontSize: '1rem' }}>Belum ada portfolio untuk kategori ini.</p>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) { .portfolio-grid { grid-template-columns: 1fr !important; } }
        @media (min-width: 769px) and (max-width: 1024px) { .portfolio-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </div>
  );
}
