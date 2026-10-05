import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import api from '../lib/api';
import SocialEmbed from '../components/SocialEmbed';
import { ease } from '../lib/motion';
import { PORTFOLIO_CATEGORIES, isVideo, resultBoxes, sectionLabel, brandKey, campaignLabel, nicheChip, videoTile, type PortfolioItem, type TopCreator } from '../lib/portfolio';

const categories = ['All Campaigns', ...PORTFOLIO_CATEGORIES];

// Carousel contoh konten: embed postingan Top Creator (yang punya link) + foto/video upload
type Slide = { kind: 'creator'; creator: TopCreator } | { kind: 'media'; url: string };

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [category, setCategory] = useState('All Campaigns');
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

  const filtered = category === 'All Campaigns' ? items : items.filter((i) => i.category === category);
  // fallback ke brand pertama yang terlihat kalau selectedId hilang dari filter kategori aktif
  const selected = filtered.find((i) => i._id === selectedId) || filtered[0];

  // satu bubble per brand; brand dengan >1 campaign memunculkan sub-bubble per campaign
  const brandGroups = [...filtered.reduce((m, i) => {
    const k = brandKey(i.brand);
    m.set(k, [...(m.get(k) || []), i]);
    return m;
  }, new Map<string, PortfolioItem[]>()).values()];
  const activeGroup = selected ? brandGroups.find((g) => g.some((i) => i._id === selected._id)) : undefined;

  const slides: Slide[] = selected ? [
    ...(selected.topCreators || []).slice(0, 3).flatMap((c) => (c.postLink ? [{ kind: 'creator' as const, creator: c }] : [])),
    ...(selected.contents || []).slice(0, 3).map((url) => ({ kind: 'media' as const, url })),
  ] : [];
  const hasCreators = slides.length > 0;
  const creatorCount = slides.length;
  const boxes = selected ? resultBoxes(selected).slice(0, 4) : [];

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

        {/* Bubble brand (satu per brand) */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: activeGroup && activeGroup.length > 1 ? '14px' : '40px' }}>
          {brandGroups.map((group) => {
            const first = group[0];
            const active = group === activeGroup;
            return (
              <button
                key={first._id}
                onClick={() => setSelectedId(first._id)}
                style={{
                  padding: '11px 22px', borderRadius: '999px',
                  border: active ? '1.5px solid var(--secondary)' : '1.5px solid var(--outline-variant)',
                  background: active ? 'var(--secondary)' : '#fff',
                  color: active ? '#fff' : 'var(--on-background)',
                  fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer',
                  transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '8px',
                }}
              >
                {first.brand.trim()}
                {group.length > 1 && (
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '1px 7px', borderRadius: '999px', background: active ? 'rgba(255,255,255,0.22)' : 'var(--surface-container)' }}>
                    {group.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sub-bubble campaign: hanya untuk brand yang punya lebih dari satu campaign */}
        <AnimatePresence>
          {activeGroup && activeGroup.length > 1 && (
            <motion.div
              key={activeGroup[0]._id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '40px' }}
            >
              {activeGroup.map((item) => {
                const active = item._id === selected?._id;
                return (
                  <button
                    key={item._id}
                    onClick={() => setSelectedId(item._id)}
                    style={{
                      padding: '8px 18px', borderRadius: '999px',
                      border: active ? '1.5px solid var(--primary)' : '1.5px dashed var(--outline-variant)',
                      background: active ? 'var(--primary)' : 'transparent',
                      color: active ? '#fff' : 'var(--on-surface-variant)',
                      fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {campaignLabel(item)}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

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
              style={{ background: 'var(--portfolio-bg)', borderRadius: '24px', padding: '28px', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '28px', maxWidth: '980px', margin: '0 auto' }} // selebar navbar (Navbar.tsx maxWidth 980px)
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
                        style={{ flex: '0 1 340px', minWidth: 0, display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory' }}
                        className="portfolio-creator-scroll"
                      >
                        {slides.map((slide, i) => (
                          <div key={i} style={{ flex: '0 0 100%', minWidth: 0, scrollSnapAlign: 'center' }}>
                            {slide.kind === 'media' ? (
                              isVideo(slide.url)
                                ? <video src={slide.url} controls playsInline style={{ ...videoTile, objectFit: 'cover', background: '#000' }} />
                                : <img src={slide.url} alt={`Contoh konten ${selected.brand}`} style={{ ...videoTile, objectFit: 'cover', cursor: 'default' }} />
                            ) : (
                              <SocialEmbed platform={slide.creator.platform} url={slide.creator.postLink!} />
                            )}
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
                        {slides.map((_, i) => (
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
                    <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)' }}>
                      Contoh postingan kreator · {creatorIndex + 1} dari {creatorCount}
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      borderRadius: '20px', overflow: 'hidden', height: '100%', minHeight: '340px',
                      background: 'rgba(255,255,255,0.08)',
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

              {/* Kanan: info campaign — rata atas, sejajar dengan atas video */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {selected.logo && <img src={selected.logo} alt={selected.brand} style={{ height: '32px', maxWidth: '120px', objectFit: 'contain', background: '#fff', borderRadius: '8px', padding: '4px 8px' }} />}
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--lime)' }}>{selected.brand}</span>
                  <span className="tag-pill tag-pill-white">{selected.category}</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#fff', lineHeight: 1.2, marginBottom: '20px' }}>
                  {selected.title || `${selected.brand} ${selected.category}`}
                </h2>

                {selected.objective && (
                  <div style={{ marginBottom: '18px' }}>
                    <p style={sectionLabel}>Objective</p>
                    <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.92rem', lineHeight: 1.7 }}>{selected.objective}</p>
                  </div>
                )}

                {!!selected.niches?.length && (
                  <div style={{ marginBottom: '18px' }}>
                    <p style={sectionLabel}>Niche KOL</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selected.niches.map((n) => <span key={n} style={nicheChip}>{n}</span>)}
                    </div>
                  </div>
                )}

                {selected.deliverables && (
                  <div style={{ marginBottom: '18px' }}>
                    <p style={sectionLabel}>Creator Deliverables</p>
                    <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.92rem', lineHeight: 1.7 }}>{selected.deliverables}</p>
                  </div>
                )}

                {boxes.length > 0 && (
                  <>
                    <p style={{ ...sectionLabel, marginBottom: '12px' }}>Campaign Results</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {boxes.map((b) => (
                        <div key={b.label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 14px' }}>
                          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>{b.label}</p>
                          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--lime)' }}>{b.value}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <Link
                  to={`/portfolio/${selected._id}`}
                  className="btn-lime portfolio-detail-cta"
                  style={{ marginTop: '24px', padding: '12px 24px', fontSize: '0.9rem', alignSelf: 'flex-start' }}
                >
                  Lihat Detail Campaign <ArrowRight size={16} className="portfolio-detail-cta-arrow" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .portfolio-detail-grid { grid-template-columns: minmax(0, 1fr) !important; padding: 20px 16px !important; }
        }
        .portfolio-detail-cta-arrow { transition: transform 0.25s ease; }
        .portfolio-detail-cta:hover .portfolio-detail-cta-arrow { transform: translateX(4px); }
        .portfolio-creator-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .portfolio-creator-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
