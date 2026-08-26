import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { DollarSign, Headphones, Network, TrendingUp } from 'lucide-react';

const benefits = [
  { icon: DollarSign, title: 'Brand Deals Eksklusif', desc: 'Akses ke ratusan brand ternama yang mencari KOL terkurasi. Dapatkan kolaborasi yang sesuai dengan niche dan nilai brand-mu.', dark: false },
  { icon: Headphones, title: 'Campaign Support', desc: 'Tim AzeraKOL mendampingi setiap tahap campaign — dari briefing hingga pelaporan. Kamu tinggal fokus bikin konten.', dark: true },
  { icon: Network, title: 'KOL Network', desc: 'Bergabung dengan komunitas 20K+ KOL aktif Indonesia. Sharing knowledge, tips, dan peluang kolaborasi sesama kreator.', dark: false },
  { icon: TrendingUp, title: 'Growth Opportunities', desc: 'Track record dan portofolio campaign yang terbangun akan membuka pintu untuk kolaborasi lebih besar di masa depan.', dark: false },
];

const steps = [
  { num: '01', title: 'Daftar', desc: 'Isi form pendaftaran gratis dengan data profil dan media sosialmu.' },
  { num: '02', title: 'Review', desc: 'Tim AzeraKOL akan meninjau profil dalam 1–3 hari kerja.' },
  { num: '03', title: 'Campaign', desc: 'Mulai terima tawaran kolaborasi brand yang sesuai dengan nichemu.' },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function KOL() {
  const benefitsRef = useRef(null);
  const stepsRef = useRef(null);
  const ctaRef = useRef(null);
  const benefitsInView = useInView(benefitsRef, { once: true, margin: '-80px' });
  const stepsInView = useInView(stepsRef, { once: true, margin: '-80px' });
  const ctaInView = useInView(ctaRef, { once: true, margin: '-80px' });

  return (
    <div>
      <section style={{ padding: '80px 24px 8px', textAlign: 'center' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <motion.span className="tag-pill tag-pill-navy" style={{ margin: '0 auto 18px' }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: easeOut }}>
            Untuk KOL &amp; Creator
          </motion.span>
          <motion.h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(2.4rem, 6vw, 4.4rem)', color: 'var(--on-background)', lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-0.03em' }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}>
            Bergabung dengan{' '}
            <span className="underline-accent">
              AzeraKOL Network
              <svg viewBox="0 0 340 20" preserveAspectRatio="none" fill="none">
                <path d="M2 14C70 4 260 2 338 12" stroke="#6728e4" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>
          <motion.p style={{ color: 'var(--on-surface-variant)', fontSize: '1.02rem', lineHeight: 1.75, marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}>
            Daftar gratis dan dapatkan akses ke ratusan peluang kolaborasi dengan brand terpercaya di Indonesia.
          </motion.p>
          <motion.div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: easeOut, delay: 0.3 }}>
            <Link to="/kol/register" className="btn-primary" style={{ fontSize: '1rem' }}>
              Daftar Sekarang
            </Link>
            <a href="#benefits" className="btn-outline" style={{ fontSize: '1rem' }}>
              Lihat Manfaat
            </a>
          </motion.div>
          <motion.div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '36px' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}>
            {['20K+ KOL Aktif', 'Gratis Daftar', 'Review 1-3 Hari', 'Top Brand'].map((b) => (
              <span key={b} className="tag-pill tag-pill-purple">{b}</span>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="benefits" style={{ background: '#ffffff', padding: '96px 24px' }} ref={benefitsRef}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div style={{ textAlign: 'center', marginBottom: '56px' }}
            initial={{ opacity: 0, y: 24 }} animate={benefitsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: easeOut }}>
            <span className="tag-pill tag-pill-purple" style={{ marginBottom: '14px' }}>Manfaat</span>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--on-background)' }}>
              Kenapa Bergabung AzeraKOL?
            </h2>
          </motion.div>
          <div className="kol-benefits-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div key={b.title} initial={{ opacity: 0, y: 24 }} animate={benefitsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: easeOut, delay: i * 0.1 }}
                  className={b.dark ? 'bento-card-dark' : 'bento-card'} style={{ padding: '26px', height: '100%' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: b.dark ? 'rgba(255,255,255,0.12)' : 'rgba(103,40,228,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                    <Icon size={20} color={b.dark ? '#fff' : 'var(--secondary)'} />
                  </div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: b.dark ? '#fff' : 'var(--on-background)', marginBottom: '10px' }}>{b.title}</h3>
                  <p style={{ color: b.dark ? 'rgba(255,255,255,0.65)' : 'var(--on-surface-variant)', fontSize: '0.85rem', lineHeight: 1.65 }}>{b.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <div style={{ background: 'var(--primary)', padding: '64px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(3rem, 8vw, 5rem)', color: '#fff', lineHeight: 1, marginBottom: '8px' }}>
          20.000+
        </p>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', fontWeight: 500 }}>
          KOL aktif telah bergabung di AzeraKOL Network
        </p>
      </div>

      <section style={{ background: 'var(--surface-low)', padding: '96px 24px' }} ref={stepsRef}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div style={{ textAlign: 'center', marginBottom: '56px' }}
            initial={{ opacity: 0, y: 24 }} animate={stepsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: easeOut }}>
            <span className="tag-pill tag-pill-navy" style={{ marginBottom: '14px' }}>Cara Bergabung</span>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--on-background)' }}>
              Mudah &amp; Gratis.
            </h2>
          </motion.div>
          <div className="kol-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {steps.map((step, i) => (
              <motion.div key={step.title} initial={{ opacity: 0, y: 24 }} animate={stepsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: easeOut, delay: i * 0.12 }}
                className="bento-card" style={{ padding: '28px' }}>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em', color: 'var(--outline)', marginBottom: '10px' }}>
                  STEP {step.num}
                </p>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: 'var(--on-background)', marginBottom: '10px' }}>{step.title}</h3>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem', lineHeight: 1.65 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#ffffff', padding: '96px 24px' }} ref={ctaRef}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: easeOut }}
            className="bento-card-dark" style={{ padding: '60px 40px', textAlign: 'center' }}>
            <span className="tag-pill tag-pill-white" style={{ margin: '0 auto 16px' }}>Siap Bergabung?</span>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(1.9rem, 4.5vw, 3rem)', color: '#fff', lineHeight: 1.15, marginBottom: '16px' }}>
              Daftar Sekarang — Gratis!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
              Tidak ada biaya, tidak ada komitmen. Cukup daftar dan tunggu tim kami menghubungimu.
            </p>
            <Link to="/kol/register" className="btn-secondary" style={{ fontSize: '1.02rem', background: '#fff', color: 'var(--primary)' }}>
              Daftar KOL Sekarang
            </Link>
          </motion.div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) { .kol-benefits-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .kol-benefits-grid { grid-template-columns: 1fr !important; } .kol-steps-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 768px) { .kol-steps-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
