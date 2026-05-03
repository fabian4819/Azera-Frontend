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
  'linear-gradient(135deg, #6728e4, #ff81aa)',
  'linear-gradient(135deg, #814bfe, #6728e4)',
  'linear-gradient(135deg, #ff81aa, #814bfe)',
  'linear-gradient(135deg, #6728e4, #814bfe)',
  'linear-gradient(135deg, #ff81aa, #6728e4)',
  'linear-gradient(135deg, #814bfe, #ff81aa)',
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

  const filtered = activeCategory === 'Semua' ? items : items.filter((i) => i.category === activeCategory);

  return (
    <div style={{ background: '#f8f9ff', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div style={{ background: '#15157d', padding: '120px 24px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="blob-lg" style={{ width: '500px', height: '500px', background: '#814bfe', opacity: 0.3, top: '-200px', left: '5%' }} />
        <div className="blob-lg" style={{ width: '400px', height: '400px', background: '#ff81aa', opacity: 0.25, bottom: '-150px', right: '5%' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px', margin: '0 auto' }}>
          <span className="section-label" style={{ display: 'inline-block', marginBottom: '16px', color: '#9da1ff' }}>Portfolio</span>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: '#ffffff', lineHeight: 1.05, marginBottom: '16px', letterSpacing: '-0.03em' }}>
            Kampanye{' '}
            <span style={{ background: 'linear-gradient(135deg, #9da1ff, #ff81aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Sukses
            </span>{' '}
            Kami
          </h1>
          <p style={{ color: 'rgba(157,161,255,0.8)', fontSize: '1rem', lineHeight: 1.7, fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: '480px', margin: '0 auto' }}>
            Hasil nyata dari ratusan kampanye KOL yang telah kami jalankan bersama brand terpercaya.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px 80px', position: 'relative' }}>
        <div className="blob" style={{ width: '300px', height: '300px', background: '#e1e0ff', opacity: 0.15, top: '20%', right: '5%' }} />
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '48px', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          {allCategories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '9px 22px', borderRadius: '999px', border: 'none',
                  background: active ? 'linear-gradient(135deg, #6728e4, #814bfe)' : 'white',
                  color: active ? 'white' : '#464652',
                  fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                  transition: 'all 0.2s', fontFamily: "'Plus Jakarta Sans', sans-serif",
                  boxShadow: active ? '0 4px 20px rgba(103,40,228,0.3)' : '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                {cat}
              </button>
            );
          })}
        </div>

        <div className="portfolio-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', position: 'relative', zIndex: 1 }}>
          {filtered.map((item, index) => (
            <motion.div key={item._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.06 }}>
              <div className="glass-panel card-hover" style={{ overflow: 'hidden', background: 'white' }}>
                <div style={{ height: '120px', background: gradients[index % gradients.length], display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', position: 'relative' }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '4rem', fontWeight: 800, color: 'rgba(255,255,255,0.2)', lineHeight: 1 }}>{item.brand[0]}</span>
                  {item.featured && (
                    <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '999px', padding: '4px 12px', fontSize: '0.65rem', fontWeight: 700, position: 'absolute', top: '12px', right: '12px', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.08em' }}>
                      FEATURED
                    </span>
                  )}
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#191c20' }}>{item.brand}</h3>
                    <span style={{ background: '#e1e0ff', color: '#6728e4', borderRadius: '999px', padding: '3px 10px', fontSize: '0.7rem', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.category}</span>
                  </div>
                  <p style={{ color: '#777683', fontSize: '0.82rem', marginBottom: '16px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.hashtag}</p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#777683', fontSize: '0.78rem' }}><Users size={13} />{item.kolCount} KOL</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#777683', fontSize: '0.78rem' }}><Eye size={13} />{item.reach}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10B981', fontSize: '0.78rem' }}><TrendingUp size={13} />{item.engagement}% ER</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: '#777683' }}>
            <p style={{ fontSize: '1rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Belum ada portfolio untuk kategori ini.</p>
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
