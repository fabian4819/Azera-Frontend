import { useEffect, useRef, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Users, TrendingUp, ChevronLeft, ChevronRight, Check, Eye, Plus,
} from 'lucide-react';
import { getServiceBySlug } from '../data/services';
import { ease } from '../lib/motion';
import api from '../lib/api';
import SocialEmbed from '../components/SocialEmbed';

const serviceHeroImages: Record<string, string> = {
  'nano-micro-kol-campaign': '/service-heroes/nano-micro-kol-campaign.webp',
  'koc-campaign': '/service-heroes/koc-campaign.webp',
  'affiliate-creator-campaign': '/service-heroes/affiliate-creator-campaign.webp',
  'event-creator-activation': '/service-heroes/event-creator-activation.webp',
};

interface TopCreator {
  name: string;
  platform: 'instagram' | 'tiktok';
  postLink: string;
  views?: string;
  likes?: string;
  comments?: string;
  shares?: string;
}
interface PortfolioItem {
  _id: string;
  brand: string;
  category: string;
  kolCount: number;
  reach: string;
  engagement: number;
  logo?: string;
  title?: string;
  objective?: string;
  topCreators?: TopCreator[];
}

function RelatedSuccess({ category }: { category: string }) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creatorIndex, setCreatorIndex] = useState(0);
  const [creatorScrollKey, setCreatorScrollKey] = useState<string | undefined>(undefined);
  const creatorScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get('/portfolio')
      .then((res) => {
        const filtered = (res.data as PortfolioItem[]).filter((i) => i.category === category);
        if (filtered.length) {
          setItems(filtered);
          setSelectedId(filtered[0]._id);
        }
      })
      .catch(() => {});
  }, [category]);

  const selected = items.find((i) => i._id === selectedId) || items[0];
  const hasCreators = selected?.topCreators && selected.topCreators.length > 0;
  const creatorCount = selected?.topCreators?.length ?? 0;

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

  if (!items.length) return null;

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '32px' }}>
        {items.map((item) => {
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

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease }}
            style={{ background: 'var(--primary)', borderRadius: '28px', padding: '36px', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '36px' }}
            className="service-detail-grid"
          >
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
                      className="service-creator-scroll"
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
                    borderRadius: '20px', overflow: 'hidden', height: '100%', minHeight: '260px',
                    background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px',
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

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--lime)' }}>{selected.brand}</span>
                <span className="tag-pill tag-pill-white">{selected.category}</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', color: '#fff', lineHeight: 1.2, marginBottom: '16px' }}>
                {selected.title || `${selected.brand} Campaign`}
              </h3>
              {selected.objective && (
                <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '16px' }}>{selected.objective}</p>
              )}
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem' }}><Users size={14} /> {selected.kolCount} KOL</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem' }}><Eye size={14} /> {selected.reach} Reach</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--lime)', fontSize: '0.85rem', fontWeight: 700 }}><TrendingUp size={14} /> {selected.engagement}% ER</div>
              </div>
              <Link to="/portfolio" style={{ display: 'inline-block', marginTop: '20px', color: 'var(--lime)', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
                Lihat semua portfolio &rarr;
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) { .service-detail-grid { grid-template-columns: 1fr !important; } }
        .service-creator-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .service-creator-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

function FAQAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <motion.div
            key={item.question}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease, delay: i * 0.07 }}
            style={{
              background: isOpen ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.09)',
              borderRadius: '22px',
              overflow: 'hidden',
              transition: 'background 0.25s ease',
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: '20px', padding: '22px 26px', background: 'none', border: 'none',
                cursor: 'pointer', textAlign: 'center',
              }}
            >
              <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: '#fff', lineHeight: 1.4 }}>{item.question}</span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.25, ease }}
                style={{
                  flexShrink: 0, width: '34px', height: '34px', borderRadius: '50%', background: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--secondary)',
                }}
              >
                <Plus size={17} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease }}
                  style={{ overflow: 'hidden' }}
                >
                  <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.9rem', lineHeight: 1.75, textAlign: 'center', padding: '0 26px 26px' }}>{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug || '');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const workflowRef = useRef(null);
  const isWorkflowInView = useInView(workflowRef, { once: true, margin: '-100px' });

  const WA_LINK = 'https://wa.me/6281919525186?text=' + encodeURIComponent(`Halo AzeraKOL!\nSaya ingin tanya-tanya soal layanan ${service?.navLabel || ''}, boleh dibantu?`);

  if (!service) return <Navigate to="/" replace />;

  return (
    <div style={{ background: 'var(--surface)' }}>
      {/* Hero */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          marginTop: '-88px',
          minHeight: '100svh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '132px',
          paddingBottom: '80px',
          paddingLeft: '24px',
          paddingRight: '24px',
          textAlign: 'center',
          background:
            'linear-gradient(90deg, rgba(247,249,255,0.18) 0%, rgba(248,249,255,0.82) 35%, rgba(248,249,255,0.9) 50%, rgba(248,249,255,0.82) 65%, rgba(247,249,255,0.18) 100%), ' +
            `url(${serviceHeroImages[service.slug]}) center / cover no-repeat`,
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '760px', margin: '0 auto' }}>
          <span className="tag-pill tag-pill-navy" style={{ margin: '0 auto 20px', backdropFilter: 'blur(8px)' }}>{service.eyebrow}</span>
          <h1
            style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)',
              color: 'var(--on-background)', lineHeight: 1.1, marginBottom: '18px', letterSpacing: '-0.03em',
            }}
          >
            {service.headlinePlain}{' '}
            <span className="mark-lime">{service.headlineHighlight}</span>
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.05rem', marginBottom: '24px' }}>{service.subheading}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '28px' }}>
            {service.tags.map((tag) => (
              <span key={tag} className="tag-pill tag-pill-purple" style={{ fontSize: '0.78rem', backdropFilter: 'blur(8px)' }}>{tag}</span>
            ))}
          </div>
          {service.description.map((p, i) => (
            <p key={i} style={{ color: i === 0 ? 'var(--primary)' : 'var(--on-surface-variant)', fontWeight: i === 0 ? 700 : 400, fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '8px' }}>
              {p}
            </p>
          ))}
          <div style={{ marginTop: '28px' }}>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-lime">
              Diskusikan Campaign Kamu
            </a>
          </div>
        </div>
      </section>

      {/* Scope & Advantages */}
      <section ref={ref} className="service-scope-section">
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
            style={{ maxWidth: '720px', marginBottom: '48px' }}
          >
            <span className="service-section-eyebrow">What You Get</span>
            <h2 className="service-section-title">Semua yang campaign kamu butuhkan, <span className="mark-lime">dalam satu tim.</span></h2>
            <p className="service-section-lead">Dari pemilihan creator sampai laporan akhir, setiap detail dikelola agar campaign berjalan rapi dan terukur.</p>
          </motion.div>

          <div className="service-scope-layout">
            <motion.div
              initial={{ opacity: 0, x: -28, rotate: -1.5 }}
              animate={isInView ? { opacity: 1, x: 0, rotate: 0 } : {}}
              transition={{ duration: 0.7, ease }}
              className="service-scope-visual"
            >
              <img src="/service-sections/scope-coverage.webp" alt="Ilustrasi cakupan pengelolaan campaign AzeraKOL" />
              <div className="service-visual-caption">
                <span>{String(service.scope.length).padStart(2, '0')}</span>
                <div>
                  <strong>{service.scopeTitle}</strong>
                  <small>Terintegrasi end-to-end</small>
                </div>
              </div>
            </motion.div>

            <div className="service-scope-grid">
              {service.scope.map((item, i) => (
                  <motion.article
                    key={item.title}
                    initial={{ opacity: 0, y: 24 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.55, ease, delay: 0.08 + i * 0.06 }}
                    className="service-scope-card"
                  >
                    <span className="service-scope-index">0{i + 1}</span>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section ref={workflowRef} className="service-workflow-section">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isWorkflowInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease }}
          className="service-workflow-shell"
        >
          <div className="service-workflow-heading">
            <div>
              <span className="service-section-eyebrow service-section-eyebrow-light">How We Work</span>
              <h2>Dari brief jadi campaign<br /><span>yang benar-benar jalan.</span></h2>
            </div>
            <p>Empat tahap yang jelas, satu tim yang mendampingi dari strategi sampai optimasi performa.</p>
          </div>

          <motion.img
            src="/service-sections/campaign-workflow.webp"
            alt="Ilustrasi alur kerja campaign dari perencanaan hingga optimasi"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={isWorkflowInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.75, ease, delay: 0.12 }}
            className="service-workflow-illustration"
          />

          <div className="service-workflow-grid">
            {service.workflow.map((step, i) => (
                <motion.article
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={isWorkflowInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, ease, delay: 0.2 + i * 0.08 }}
                  className="service-workflow-card"
                >
                  <span className="service-workflow-number">0{i + 1}</span>
                  <span className="service-workflow-label">Step {i + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </motion.article>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pricing / Estimasi Paket */}
      <section style={{ padding: '90px 24px', background: 'var(--surface-container)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', textAlign: 'center', color: 'var(--on-background)', marginBottom: '12px', letterSpacing: '-0.02em' }}>
            Paket Campaign
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '48px' }}>
            Paket disesuaikan dengan kebutuhan dan skala campaign brand kamu.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="service-pricing-grid">
            {service.pricing.map((tier) => (
              <div
                key={tier.badge}
                style={{
                  borderRadius: '24px', padding: '32px',
                  background: tier.dark ? 'var(--primary)' : '#fff',
                  border: tier.dark ? 'none' : '1.5px solid var(--outline-variant)',
                }}
              >
                <span className={tier.dark ? 'tag-pill tag-pill-lime' : 'tag-pill tag-pill-navy'}>{tier.badge}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: tier.dark ? '#fff' : 'var(--on-background)', margin: '16px 0 20px' }}>
                  {tier.name}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                  {tier.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <Check size={16} color={tier.dark ? 'var(--lime)' : 'var(--secondary)'} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '0.88rem', color: tier.dark ? 'rgba(255,255,255,0.85)' : 'var(--on-surface-variant)', lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className={tier.dark ? 'btn-lime' : 'btn-primary'} style={{ width: '100%', justifyContent: 'center' }}>
                  Diskusikan Campaign Kamu
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Success */}
      <section style={{ padding: '90px 24px', maxWidth: '1160px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="tag-pill tag-pill-navy" style={{ margin: '0 auto 16px' }}>Related Success</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: 'var(--on-background)', letterSpacing: '-0.02em' }}>
            Campaign {service.navLabel} Kami
          </h2>
        </div>
        <RelatedSuccess category={service.portfolioCategory} />
      </section>

      {/* FAQ */}
      <section style={{ padding: '100px 24px', background: 'var(--hero-bg)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', display: 'inline-block', marginBottom: '18px' }}>
              FAQs
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, 4.8vw, 3.2rem)', color: '#fff', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
              Pertanyaan umum seputar layanan.
            </h2>
          </div>
          <FAQAccordion items={service.faq} />
        </div>
      </section>

      {/* Closing CTA */}
      <section style={{ padding: '90px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)', color: 'var(--on-background)', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Siap Jalankan Campaign {service.navLabel}?
          </h2>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.98rem', marginBottom: '28px' }}>
            Jadwalkan diskusi dengan tim kami dan dapatkan gambaran strategi campaign untuk brand kamu.
          </p>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-lime">
            Diskusikan Campaign Kamu
          </a>
        </div>
      </section>

      <style>{`
        .service-scope-section {
          padding: 112px 24px;
          background:
            radial-gradient(circle at 8% 18%, rgba(196,238,135,0.22), transparent 24%),
            linear-gradient(180deg, var(--surface) 0%, #f0ecff 100%);
        }
        .service-section-eyebrow {
          display: inline-block;
          margin-bottom: 16px;
          color: var(--secondary);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .service-section-title {
          max-width: 700px;
          margin-bottom: 18px;
          color: var(--on-background);
          font-family: var(--font-display);
          font-size: clamp(2rem, 4.5vw, 3.15rem);
          font-weight: 700;
          letter-spacing: -0.035em;
          line-height: 1.06;
        }
        .service-section-lead {
          max-width: 610px;
          color: var(--on-surface-variant);
          font-size: 1rem;
          line-height: 1.72;
        }
        .service-scope-layout {
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.45fr);
          gap: 22px;
          align-items: stretch;
        }
        .service-scope-visual {
          position: relative;
          min-height: 550px;
          overflow: hidden;
          border-radius: 32px;
          background:
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.14) 1px, transparent 0) 0 0 / 18px 18px,
            linear-gradient(145deg, #241064 0%, #15157d 55%, #6728e4 145%);
          box-shadow: 0 28px 70px -34px rgba(46,49,146,0.7);
        }
        .service-scope-visual > img {
          width: 116%;
          max-width: none;
          height: 84%;
          margin-left: -8%;
          object-fit: contain;
          display: block;
        }
        .service-visual-caption {
          position: absolute;
          right: 22px;
          bottom: 22px;
          left: 22px;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 15px 17px;
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 18px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
        }
        .service-visual-caption > span {
          color: var(--lime);
          font-family: var(--font-display);
          font-size: 1.7rem;
          font-weight: 700;
        }
        .service-visual-caption strong,
        .service-visual-caption small { display: block; }
        .service-visual-caption strong {
          margin-bottom: 3px;
          color: #fff;
          font-family: var(--font-display);
          font-size: 0.9rem;
        }
        .service-visual-caption small { color: rgba(255,255,255,0.6); font-size: 0.75rem; }
        .service-scope-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }
        .service-scope-card {
          min-height: 170px;
          padding: 22px;
          border: 1.5px solid rgba(103,40,228,0.12);
          border-radius: 22px;
          background: rgba(255,255,255,0.86);
          box-shadow: 0 12px 35px -28px rgba(21,21,125,0.5);
          transition: transform 0.3s var(--ease-spring), background 0.3s ease, box-shadow 0.3s ease;
        }
        .service-scope-card:hover {
          transform: translateY(-5px) rotate(-0.4deg);
          background: #fff;
          box-shadow: var(--shadow-pitch);
        }
        .service-scope-index {
          display: block;
          margin-bottom: 24px;
          color: var(--secondary);
          font-family: var(--font-display);
          font-size: 1.85rem;
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 1;
        }
        .service-scope-card h3 {
          margin-bottom: 8px;
          color: var(--on-background);
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
        }
        .service-scope-card p {
          color: var(--on-surface-variant);
          font-size: 0.82rem;
          line-height: 1.62;
        }
        .service-workflow-section {
          padding: 112px 24px;
          background: var(--hero-bg);
        }
        .service-workflow-shell {
          max-width: 1160px;
          margin: 0 auto;
        }
        .service-workflow-heading {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 48px;
          align-items: end;
        }
        .service-section-eyebrow-light { color: var(--lime); }
        .service-workflow-heading h2 {
          color: #fff;
          font-family: var(--font-display);
          font-size: clamp(2rem, 4.2vw, 3rem);
          font-weight: 700;
          letter-spacing: -0.035em;
          line-height: 1.07;
        }
        .service-workflow-heading h2 span { color: #c9b6ff; }
        .service-workflow-heading > p {
          color: rgba(255,255,255,0.66);
          font-size: 0.94rem;
          line-height: 1.7;
        }
        .service-workflow-illustration {
          width: 100%;
          height: auto;
          margin: 34px auto 20px;
          display: block;
          filter: drop-shadow(0 20px 26px rgba(7,5,40,0.2));
        }
        .service-workflow-grid {
          position: relative;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }
        .service-workflow-card {
          min-height: 210px;
          padding: 21px;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 20px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
          transition: transform 0.3s var(--ease-spring), background 0.3s ease;
        }
        .service-workflow-card:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.14);
        }
        .service-workflow-number {
          display: block;
          margin-bottom: 8px;
          color: var(--lime);
          font-family: var(--font-display);
          font-size: 2.35rem;
          font-weight: 700;
          letter-spacing: -0.06em;
          line-height: 1;
        }
        .service-workflow-label {
          display: block;
          margin-bottom: 24px;
          color: rgba(255,255,255,0.46);
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .service-workflow-card h3 {
          margin-bottom: 9px;
          color: #fff;
          font-family: var(--font-display);
          font-size: 1.08rem;
          font-weight: 700;
        }
        .service-workflow-card p {
          color: rgba(255,255,255,0.62);
          font-size: 0.8rem;
          line-height: 1.62;
        }
        @media (max-width: 900px) {
          .service-scope-layout { grid-template-columns: 1fr; }
          .service-scope-visual { min-height: 430px; }
          .service-workflow-heading { grid-template-columns: 1fr; gap: 18px; }
          .service-workflow-heading > p { max-width: 560px; }
          .service-workflow-grid { grid-template-columns: repeat(2, 1fr); }
          .service-pricing-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .service-scope-section { padding: 80px 18px; }
          .service-scope-grid { grid-template-columns: 1fr; }
          .service-scope-visual { min-height: 370px; }
          .service-scope-visual > img { height: 80%; width: 128%; margin-left: -14%; }
          .service-workflow-section { padding: 80px 18px; }
          .service-workflow-illustration { width: 135%; max-width: none; margin-left: -17.5%; }
          .service-workflow-grid { grid-template-columns: 1fr; }
          .service-workflow-card { min-height: 0; }
        }
      `}</style>
    </div>
  );
}
