import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Eye, TrendingUp, ArrowRight } from 'lucide-react';
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
  logo?: string;
  logoBg?: string;
}

interface CaseStudy {
  id: string;
  headline: string;
  brandName?: string;
  campaignName?: string;
  highlightStats: { views: number; engagementRate: number; totalPosts: number };
}

const placeholders: PortfolioItem[] = [];

const swatches = ['#6728e4', '#814bfe', '#7f003f', '#15157d', '#a31556', '#6728e4'];

const allCategories = ['Semua', 'Beauty', 'F&B', 'Fashion', 'Tech', 'Fitness', 'Home & Living'];

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>(placeholders);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [activeCategory, setActiveCategory] = useState('Semua');

  useEffect(() => {
    api.get('/portfolio')
      .then((res) => { if (res.data?.length) setItems(res.data); })
      .catch(() => {});
    api.get('/portfolio/case-studies')
      .then((res) => setCaseStudies(res.data))
      .catch(() => {});
  }, []);

  const filtered = activeCategory === 'Semua' ? items : items.filter((i) => i.category === activeCategory);

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh' }}>
      <div style={{ padding: '80px 24px 8px', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <span className="tag-pill tag-pill-navy" style={{ margin: '0 auto 16px' }}>Portfolio</span>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', color: 'var(--on-background)', lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-0.03em' }}>
            Campaign{' '}
            <span className="underline-accent">
              Sukses
              <svg viewBox="0 0 180 20" preserveAspectRatio="none" fill="none">
                <path d="M2 14C36 4 96 2 178 12" stroke="#6728e4" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </span>{' '}
            Kami
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto' }}>
            Hasil nyata dari ratusan campaign KOL yang telah kami jalankan bersama brand terpercaya.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 24px 80px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '48px', justifyContent: 'center' }}>
          {allCategories.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '9px 22px', borderRadius: '999px',
                  border: active ? '1.5px solid var(--secondary)' : '1.5px solid var(--outline-variant)',
                  background: active ? 'var(--secondary)' : 'white',
                  color: active ? 'white' : 'var(--on-surface-variant)',
                  fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}>
                {cat}
              </button>
            );
          })}
        </div>

        {caseStudies.length > 0 && (
          <div style={{ marginBottom: '52px' }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: 'var(--on-background)', marginBottom: '20px', textAlign: 'center' }}>
              Case Study Terbaru
            </h2>
            <div className="portfolio-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
              {caseStudies.map((cs, index) => (
                <motion.div key={cs.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.06 }}>
                  <Link to={`/portfolio/case-study/${cs.id}`} style={{ textDecoration: 'none' }}>
                    <div className="bento-card" style={{ padding: '24px' }}>
                      {cs.brandName && <span className="tag-pill tag-pill-purple">{cs.brandName}</span>}
                      <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--on-background)', margin: '12px 0' }}>{cs.headline}</h3>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--outline)', fontSize: '0.78rem' }}><Eye size={13} />{cs.highlightStats.views.toLocaleString('id-ID')}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10B981', fontSize: '0.78rem' }}><TrendingUp size={13} />{cs.highlightStats.engagementRate}% ER</div>
                      </div>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--secondary)', fontSize: '0.82rem', fontWeight: 700 }}>
                        Lihat Detail <ArrowRight size={13} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="portfolio-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {filtered.map((item, index) => (
            <motion.div key={item._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.06 }}>
              <div className="bento-card" style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    height: '110px',
                    background: item.logo ? (item.logoBg || 'var(--surface-container)') : swatches[index % swatches.length],
                    display: 'flex', alignItems: 'center', justifyContent: item.logo ? 'center' : 'space-between',
                    padding: '20px', position: 'relative',
                  }}
                >
                  {item.logo ? (
                    <img src={item.logo} alt={`Logo ${item.brand}`} style={{ maxHeight: '48px', maxWidth: '70%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '3.6rem', fontWeight: 800, color: 'rgba(255,255,255,0.2)', lineHeight: 1 }}>{item.brand[0]}</span>
                  )}
                  {item.featured && (
                    <span style={{ background: 'rgba(255,255,255,0.18)', color: 'white', borderRadius: '999px', padding: '4px 12px', fontSize: '0.65rem', fontWeight: 700, position: 'absolute', top: '12px', right: '12px', letterSpacing: '0.08em' }}>
                      FEATURED
                    </span>
                  )}
                </div>
                <div style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'var(--on-background)' }}>{item.brand}</h3>
                    <span className="tag-pill tag-pill-purple">{item.category}</span>
                  </div>
                  <p style={{ color: 'var(--outline)', fontSize: '0.82rem', marginBottom: '16px' }}>{item.hashtag}</p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--outline)', fontSize: '0.78rem' }}><Users size={13} />{item.kolCount} KOL</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--outline)', fontSize: '0.78rem' }}><Eye size={13} />{item.reach}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10B981', fontSize: '0.78rem' }}><TrendingUp size={13} />{item.engagement}% ER</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--outline)' }}>
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
