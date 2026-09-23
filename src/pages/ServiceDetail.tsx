import { useRef, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import type { MouseEvent as ReactMouseEvent, RefObject } from 'react';
import { Check, Plus } from 'lucide-react';
import { getServiceBySlug } from '../data/services';
import { ease, fadeUp, stagger, useParallax } from '../lib/motion';

const serviceHeroImages: Record<string, string> = {
  'nano-micro-kol-campaign': '/service-heroes/nano-micro-kol-campaign-purple.webp',
  'koc-campaign': '/service-heroes/koc-campaign-purple.webp',
  'affiliate-creator-campaign': '/service-heroes/affiliate-creator-campaign-purple.webp',
  'event-creator-activation': '/service-heroes/event-creator-activation-purple.webp',
};

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
  const pricingRef = useRef(null);
  const isPricingInView = useInView(pricingRef, { once: true, margin: '-80px' });

  // Motion ala homepage: hero bg ikut mouse + scroll, teks hero memudar saat di-scroll lewat
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20, mass: 0.5 });
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgX = useTransform(springX, (v) => v * -24);
  const bgScrollY = useTransform(heroProgress, [0, 1], [0, 160]);
  const bgY = useTransform([bgScrollY, springY], ([s, m]: number[]) => s + m * -24);
  const copyY = useTransform(heroProgress, [0, 1], [0, -80]);
  const copyOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);
  const handleHeroMove = (e: ReactMouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const resetHeroMouse = () => { mouseX.set(0); mouseY.set(0); };

  const scopeParallax = useParallax(36);
  const workflowParallax = useParallax(28);
  const pricingParallax = useParallax(70);
  const hoverLift = { y: -6, transition: { duration: 0.3, ease } };

  const WA_LINK = 'https://wa.me/6281919525186?text=' + encodeURIComponent(`Halo AzeraKOL!\nSaya ingin tanya-tanya soal layanan ${service?.navLabel || ''}, boleh dibantu?`);

  if (!service) return <Navigate to="/" replace />;

  return (
    <div style={{ background: 'var(--surface)' }}>
      {/* Hero */}
      <section
        ref={heroRef}
        className="service-hero"
        onMouseMove={reduceMotion ? undefined : handleHeroMove}
        onMouseLeave={resetHeroMouse}
      >
        <motion.div
          aria-hidden="true"
          className="service-hero-bg"
          style={{ backgroundImage: `url(${serviceHeroImages[service.slug]})`, ...(reduceMotion ? {} : { x: bgX, y: bgY }) }}
        />
        <motion.div
          className="service-hero-copy"
          variants={stagger(0.09, 0.05)}
          initial="hidden"
          animate="show"
          style={reduceMotion ? undefined : { y: copyY, opacity: copyOpacity }}
        >
          <motion.span variants={fadeUp(0, 20)} className="tag-pill tag-pill-white service-hero-eyebrow">{service.eyebrow}</motion.span>
          <motion.h1
            variants={fadeUp()}
            style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)',
              color: '#fff', lineHeight: 1.1, marginBottom: '18px', letterSpacing: '-0.03em',
            }}
          >
            {service.headlinePlain}{' '}
            <span className="mark-lime">{service.headlineHighlight}</span>
          </motion.h1>
          <motion.p variants={fadeUp()} style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.08rem', fontWeight: 500, lineHeight: 1.6, marginBottom: '24px' }}>{service.subheading}</motion.p>
          <motion.div variants={fadeUp()} className="service-hero-tags">
            {service.tags.map((tag) => (
              <span key={tag} className="tag-pill" style={{ fontSize: '0.78rem', color: 'var(--lime)', background: 'rgba(28,10,68,0.4)', border: '1px solid rgba(196,238,135,0.3)', backdropFilter: 'blur(8px)', textShadow: 'none' }}>{tag}</span>
            ))}
          </motion.div>
          <motion.div variants={fadeUp()}>
          {service.description.map((p, i) => (
            <p key={i} style={{ color: i === 0 ? '#fff' : 'rgba(255,255,255,0.82)', fontWeight: i === 0 ? 700 : 400, fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '8px' }}>
              {p}
            </p>
          ))}
          </motion.div>
          <motion.div variants={fadeUp()} style={{ marginTop: '28px' }}>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-lime">
              Diskusikan Campaign Kamu
            </a>
          </motion.div>
        </motion.div>
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
              <motion.img
                ref={scopeParallax.ref as RefObject<HTMLImageElement>}
                style={reduceMotion ? undefined : { y: scopeParallax.y }}
                src="/service-sections/scope-coverage.webp"
                alt="Ilustrasi cakupan pengelolaan campaign AzeraKOL"
              />
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
                    whileHover={{ ...hoverLift, rotate: -0.4 }}
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
            ref={workflowParallax.ref as RefObject<HTMLImageElement>}
            style={reduceMotion ? undefined : { y: workflowParallax.y }}
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
                  whileHover={hoverLift}
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

      {/* Paket Campaign + CTA — gaya sama dengan CTA "Untuk Creator" di home */}
      <section ref={pricingRef} style={{ position: 'relative', overflow: 'hidden', padding: '90px 24px' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }} aria-hidden="true">
          <motion.img
            ref={pricingParallax.ref as RefObject<HTMLImageElement>}
            src="/cta/creator-bg.jpg"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', scale: 1.2, ...(reduceMotion ? {} : { y: pricingParallax.y }) }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(28,10,68,0.75) 0%, rgba(44,16,101,0.35) 30%, rgba(44,16,101,0.35) 65%, rgba(15,7,45,0.8) 100%)',
            }}
          />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '980px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', display: 'inline-block', marginBottom: '18px' }}>
              Paket Campaign
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, 5vw, 3.4rem)', color: '#fff', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '18px' }}>
              Siap jalankan <span className="mark-lime">{service.navLabel}?</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.02rem', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 44px' }}>
              Paket disesuaikan dengan kebutuhan dan skala campaign brand kamu. Diskusikan dengan tim kami untuk gambaran strateginya.
            </p>
          </motion.div>

          <motion.div
            className="service-pricing-grid"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', marginBottom: '40px', textAlign: 'left' }}
            initial={{ opacity: 0, y: 20 }}
            animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
          >
            {service.pricing.map((tier, ti) => (
              <div key={tier.badge}>
                <div style={{ padding: '0 8px 14px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--lime)' }}>{tier.badge}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: '#fff', marginTop: '4px' }}>{tier.name}</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {tier.features.map((f, fi) => (
                    <motion.div
                      key={f}
                      initial={{ opacity: 0, x: ti === 0 ? -20 : 20 }}
                      animate={isPricingInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, ease, delay: 0.2 + fi * 0.07 + ti * 0.05 }}
                      whileHover={{ scale: 1.02, transition: { duration: 0.25, ease } }}
                      style={{ background: '#fff', borderRadius: '999px', padding: '10px 20px 10px 10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={16} color="#fff" />
                      </div>
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.88rem', color: 'var(--on-background)', lineHeight: 1.35 }}>{f}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease, delay: 0.2 }}
          >
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-lime" style={{ fontSize: '1rem' }}>
              Diskusikan Campaign Kamu <span style={{ fontSize: '1.1rem' }}>↗</span>
            </a>
          </motion.div>
        </div>
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

      <style>{`
        .service-hero {
          position: relative;
          isolation: isolate;
          min-height: 100svh;
          margin-top: -88px;
          padding: 132px 24px 80px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #562fa0;
          text-align: center;
        }
        .service-hero-bg {
          position: absolute;
          inset: -40px;
          z-index: -1;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
        }
        .service-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 0;
          /* Gelap di tengah (area teks) supaya kontras ≥4.5:1, memudar ke samping agar kolase tetap terang */
          background: radial-gradient(ellipse 48% 62% at 50% 52%, rgba(28,10,68,0.5) 0%, rgba(28,10,68,0.34) 55%, rgba(28,10,68,0) 100%);
          pointer-events: none;
        }
        .service-hero-copy {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          text-shadow: 0 2px 20px rgba(20,6,60,0.35);
        }
        .service-hero-eyebrow { margin: 0 auto 20px; }
        .service-hero-copy .mark-lime { text-shadow: none; }
        .service-hero-tags {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-bottom: 28px;
        }
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
          .service-hero { padding: 128px 20px 72px; }
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
