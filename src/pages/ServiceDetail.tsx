import { useEffect, useRef, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Target, Users, Rocket, TrendingUp, ShieldCheck, Layers, ClipboardCheck, BarChart3,
  ChevronLeft, ChevronRight, Check, Eye,
} from 'lucide-react';
import { getServiceBySlug } from '../data/services';
import { ease } from '../lib/motion';
import api from '../lib/api';
import SocialEmbed from '../components/SocialEmbed';
import HeroFloatingPhotos from '../components/HeroFloatingPhotos';

const scopeIcons = [ShieldCheck, Layers, Target, TrendingUp, ClipboardCheck, BarChart3];
const workflowIcons = [Target, Users, Rocket, TrendingUp];

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
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{ background: 'rgba(255,255,255,0.09)', borderRadius: '16px', overflow: 'hidden' }}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{item.question}</span>
              <span
                style={{
                  flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%', background: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s',
                }}
              >
                <span style={{ color: 'var(--primary)', fontSize: '1.1rem', lineHeight: 1 }}>+</span>
              </span>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease }}
                  style={{ overflow: 'hidden' }}
                >
                  <p style={{ padding: '0 22px 18px', color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', lineHeight: 1.7 }}>{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
          paddingTop: '132px',
          paddingBottom: '80px',
          paddingLeft: '24px',
          paddingRight: '24px',
          textAlign: 'center',
          background:
            'radial-gradient(85% 65% at 50% -8%, #6f4ab8, rgba(111,74,184,0) 58%),' +
            'linear-gradient(180deg, #5c3aa8 0%, #562fa0 52%, #4a2f8c 100%)',
        }}
      >
        <HeroFloatingPhotos />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '760px', margin: '0 auto' }}>
          <span className="tag-pill tag-pill-white" style={{ margin: '0 auto 20px' }}>{service.eyebrow}</span>
          <h1
            style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)',
              color: '#fff', lineHeight: 1.1, marginBottom: '18px', letterSpacing: '-0.03em',
            }}
          >
            {service.headlinePlain}{' '}
            <span className="mark-lime">{service.headlineHighlight}</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', marginBottom: '24px' }}>{service.subheading}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '28px' }}>
            {service.tags.map((tag) => (
              <span key={tag} className="tag-pill tag-pill-white" style={{ fontSize: '0.78rem', color: 'var(--lime)' }}>{tag}</span>
            ))}
          </div>
          {service.description.map((p, i) => (
            <p key={i} style={{ color: i === 0 ? '#fff' : 'rgba(255,255,255,0.75)', fontWeight: i === 0 ? 700 : 400, fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '8px' }}>
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
      <section ref={ref} style={{ padding: '90px 24px', maxWidth: '1160px', margin: '0 auto' }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
          style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', textAlign: 'center', color: 'var(--on-background)', marginBottom: '40px', letterSpacing: '-0.02em' }}
        >
          {service.scopeTitle}
        </motion.h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="service-scope-grid">
          {service.scope.map((item, i) => {
            const Icon = scopeIcons[i % scopeIcons.length];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease, delay: i * 0.06 }}
                style={{ background: 'var(--primary)', borderRadius: '20px', padding: '28px' }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(196,238,135,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Icon size={20} color="var(--lime)" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.02rem', color: '#fff', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', lineHeight: 1.6 }}>{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Workflow */}
      <section style={{ padding: '20px 24px 90px', maxWidth: '1160px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', textAlign: 'center', color: 'var(--on-background)', marginBottom: '48px', letterSpacing: '-0.02em' }}>
          Alur Kerja Campaign
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }} className="service-workflow-grid">
          {service.workflow.map((step, i) => {
            const Icon = workflowIcons[i % workflowIcons.length];
            return (
              <div key={step.title} style={{ textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Icon size={26} color="#fff" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--on-background)', marginBottom: '8px' }}>{step.title}</h3>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            );
          })}
        </div>
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
      <section style={{ padding: '90px 24px', background: 'linear-gradient(160deg, #2c1065 0%, #1c0a44 100%)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', textAlign: 'center', color: '#fff', marginBottom: '40px', letterSpacing: '-0.02em' }}>
            Pertanyaan Umum
          </h2>
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
        @media (max-width: 900px) {
          .service-scope-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .service-workflow-grid { grid-template-columns: repeat(2, 1fr) !important; row-gap: 32px !important; }
          .service-pricing-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .service-scope-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
