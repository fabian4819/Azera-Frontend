import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Eye, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../lib/api';
import SocialEmbed from '../components/SocialEmbed';
import { ease } from '../lib/motion';

interface TopCreator {
  name: string;
  platform: 'instagram' | 'tiktok';
  postLink: string;
  views?: string;
  likes?: string;
  comments?: string;
  shares?: string;
}
interface PortfolioMetrics {
  totalImpression?: string;
  accountsReached?: string;
  totalEngagement?: string;
  totalFollowers?: string;
  avgEngagementRate?: string;
  costPerView?: string;
}
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
  title?: string;
  objective?: string;
  metrics?: PortfolioMetrics;
  topCreators?: TopCreator[];
}

const categories = ['All', 'Engagement Boost', 'KOL Marketing', 'Affiliate Marketing'];

const metricEntries: { key: keyof PortfolioMetrics; label: string }[] = [
  { key: 'totalImpression', label: 'Total Impression' },
  { key: 'accountsReached', label: 'Accounts Reached' },
  { key: 'totalEngagement', label: 'Total Engagement' },
  { key: 'totalFollowers', label: 'Total Followers' },
  { key: 'avgEngagementRate', label: 'Average ER Post' },
  { key: 'costPerView', label: 'Cost Per View' },
];

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [category, setCategory] = useState('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creatorIndex, setCreatorIndex] = useState(0);
  const [creatorScrollKey, setCreatorScrollKey] = useState<string | undefined>(undefined);
  const creatorScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get('/portfolio')
      .then((res) => {
        if (res.data?.length) {
          setItems(res.data);
          setSelectedId(res.data[0]._id);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = category === 'All' ? items : items.filter((i) => i.category === category);
  // fallback ke brand pertama yang terlihat kalau selectedId hilang dari filter kategori aktif
  const selected = filtered.find((i) => i._id === selectedId) || filtered[0];

  const hasMetrics = selected?.metrics && Object.values(selected.metrics).some((v) => v);
  const hasCreators = selected?.topCreators && selected.topCreators.length > 0;
  const creatorCount = selected?.topCreators?.length ?? 0;

  // ganti brand -> reset carousel creator ke slide pertama (remount via key, bukan effect)
  if (selected?._id !== creatorScrollKey) {
    setCreatorScrollKey(selected?._id);
    if (creatorIndex !== 0) setCreatorIndex(0);
  }

  function handleCreatorScroll() {
    const el = creatorScrollRef.current;
    if (!el || el.clientWidth === 0) return;
    setCreatorIndex(Math.round(el.scrollLeft / el.clientWidth));
  }

  function goToCreator(i: number) {
    const el = creatorScrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(i, creatorCount - 1));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
    setCreatorIndex(clamped);
  }

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh' }}>
      <div style={{ padding: '80px 24px 8px', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <span className="tag-pill tag-pill-navy" style={{ margin: '0 auto 16px' }}>Portfolio</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', color: 'var(--on-background)', lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-0.03em' }}>
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
            Hasil nyata dari campaign KOL yang telah kami jalankan bersama brand terpercaya.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '56px 24px 90px' }}>
        {/* Filter kategori */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', gap: '4px', padding: '6px', borderRadius: '999px', background: 'var(--primary)', flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: '10px 20px', borderRadius: '999px', border: 'none',
                    background: active ? '#fff' : 'transparent',
                    color: active ? 'var(--secondary)' : 'rgba(255,255,255,0.75)',
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                    transition: 'all 0.2s', whiteSpace: 'nowrap',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid chip brand (dari data Portfolio asli) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '40px' }}>
          {filtered.map((item) => {
            const active = selected?._id === item._id;
            return (
              <button
                key={item._id}
                onClick={() => setSelectedId(item._id)}
                style={{
                  padding: '11px 22px', borderRadius: '999px',
                  border: active ? '1.5px solid var(--secondary)' : '1.5px solid var(--outline-variant)',
                  background: active ? 'var(--secondary)' : '#fff',
                  color: active ? '#fff' : 'var(--on-background)',
                  fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {item.brand}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--outline)' }}>
            <p style={{ fontSize: '1rem' }}>Belum ada portfolio untuk kategori ini.</p>
          </div>
        )}

        {/* Detail campaign brand terpilih */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease }}
              style={{ background: 'var(--primary)', borderRadius: '28px', padding: '36px', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '36px' }}
              className="portfolio-detail-grid"
            >
              {/* Kiri: showcase top 3 creator (video ter-embed) atau fallback logo */}
              <div>
                {hasCreators ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => goToCreator(creatorIndex - 1)}
                        disabled={creatorIndex === 0}
                        style={{
                          flexShrink: 0, width: '32px', height: '32px', borderRadius: '50%', border: 'none',
                          background: 'rgba(255,255,255,0.12)', color: '#fff', display: creatorCount > 1 ? 'flex' : 'none',
                          alignItems: 'center', justifyContent: 'center', cursor: creatorIndex === 0 ? 'default' : 'pointer',
                          opacity: creatorIndex === 0 ? 0.35 : 1, transition: 'opacity 0.2s',
                        }}
                      >
                        <ChevronLeft size={16} />
                      </button>

                      <div
                        key={selected._id}
                        ref={creatorScrollRef}
                        onScroll={handleCreatorScroll}
                        style={{ width: '340px', minWidth: 0, display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory' }}
                        className="portfolio-creator-scroll"
                      >
                        {selected.topCreators!.slice(0, 3).map((c, i) => (
                          <div key={i} style={{ flex: '0 0 100%', minWidth: 0, scrollSnapAlign: 'center' }}>
                            <SocialEmbed platform={c.platform} url={c.postLink} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '8px', fontSize: '0.76rem', color: 'rgba(255,255,255,0.7)' }}>
                              <span
                                style={{
                                  flexShrink: 0, width: '20px', height: '20px', borderRadius: '50%',
                                  background: 'var(--lime)', color: 'var(--on-lime)', display: 'flex',
                                  alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)',
                                  fontWeight: 800, fontSize: '0.66rem',
                                }}
                              >
                                {i + 1}
                              </span>
                              <span style={{ fontWeight: 700, color: '#fff' }}>{c.name}</span>
                              {c.views && <span>{c.views} views</span>}
                              {c.likes && <span>{c.likes} likes</span>}
                              {c.comments && <span>{c.comments} komentar</span>}
                              {c.shares && <span>{c.shares} share</span>}
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => goToCreator(creatorIndex + 1)}
                        disabled={creatorIndex === creatorCount - 1}
                        style={{
                          flexShrink: 0, width: '32px', height: '32px', borderRadius: '50%', border: 'none',
                          background: 'rgba(255,255,255,0.12)', color: '#fff', display: creatorCount > 1 ? 'flex' : 'none',
                          alignItems: 'center', justifyContent: 'center', cursor: creatorIndex === creatorCount - 1 ? 'default' : 'pointer',
                          opacity: creatorIndex === creatorCount - 1 ? 0.35 : 1, transition: 'opacity 0.2s',
                        }}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    {creatorCount > 1 && (
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '14px' }}>
                        {selected.topCreators!.slice(0, 3).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => goToCreator(i)}
                            style={{
                              width: i === creatorIndex ? '20px' : '6px', height: '6px', borderRadius: '999px', border: 'none',
                              background: i === creatorIndex ? 'var(--lime)' : 'rgba(255,255,255,0.25)', cursor: 'pointer', transition: 'all 0.2s',
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      borderRadius: '20px', overflow: 'hidden', height: '100%', minHeight: '340px',
                      background: selected.logo ? (selected.logoBg || 'rgba(255,255,255,0.08)') : 'rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px',
                    }}
                  >
                    {selected.logo ? (
                      <img src={selected.logo} alt={selected.brand} style={{ maxWidth: '70%', maxHeight: '140px', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '4rem', color: 'rgba(255,255,255,0.25)' }}>{selected.brand[0]}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Kanan: info campaign */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--lime)' }}>{selected.brand}</span>
                  <span className="tag-pill tag-pill-white">{selected.category}</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#fff', lineHeight: 1.2, marginBottom: '20px' }}>
                  {selected.title || `${selected.brand} KOL Campaign`}
                </h2>

                {selected.objective && (
                  <div style={{ marginBottom: '22px' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lime)', marginBottom: '8px' }}>Objective</p>
                    <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.92rem', lineHeight: 1.7 }}>{selected.objective}</p>
                  </div>
                )}

                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lime)', marginBottom: '12px' }}>
                  {hasMetrics ? 'Performance Metrics Result' : 'Ringkasan Campaign'}
                </p>

                {hasMetrics ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }} className="portfolio-metrics-grid">
                    {metricEntries.map(({ key, label }) => {
                      const value = selected.metrics?.[key];
                      if (!value) return null;
                      return (
                        <div key={key} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 14px' }}>
                          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>{label}</p>
                          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--lime)' }}>{value}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem' }}><Users size={14} /> {selected.kolCount} KOL</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem' }}><Eye size={14} /> {selected.reach} Reach</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--lime)', fontSize: '0.85rem', fontWeight: 700 }}><TrendingUp size={14} /> {selected.engagement}% ER</div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .portfolio-detail-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .portfolio-metrics-grid { grid-template-columns: 1fr 1fr !important; }
        }
        .portfolio-creator-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .portfolio-creator-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
