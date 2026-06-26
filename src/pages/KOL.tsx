import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { DollarSign, Headphones, Network, TrendingUp, ChevronRight, Zap, Sparkles } from 'lucide-react';

const benefits = [
  { icon: DollarSign, title: 'Brand Deals Eksklusif', desc: 'Akses ke ratusan brand ternama yang mencari KOL terkurasi. Dapatkan kolaborasi yang sesuai dengan niche dan nilai brand-mu.' },
  { icon: Headphones, title: 'Campaign Support', desc: 'Tim AzeraKOL mendampingi setiap tahap campaign — dari briefing hingga pelaporan. Kamu tinggal fokus bikin konten.' },
  { icon: Network, title: 'KOL Network', desc: 'Bergabung dengan komunitas 20K+ KOL aktif Indonesia. Sharing knowledge, tips, dan peluang kolaborasi sesama kreator.' },
  { icon: TrendingUp, title: 'Growth Opportunities', desc: 'Track record dan portofolio kampanye yang terbangun akan membuka pintu untuk kolaborasi lebih besar di masa depan.' },
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
      <section style={{ background: '#15157d', minHeight: '80vh', display: 'flex', alignItems: 'center', padding: '120px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div className="blob-lg" style={{ width: '600px', height: '600px', background: '#814bfe', opacity: 0.3, top: '-250px', left: '-150px' }} />
        <div className="blob-lg" style={{ width: '450px', height: '450px', background: '#ff81aa', opacity: 0.25, bottom: '-150px', right: '10%' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '680px' }}>
            <motion.span className="section-label" style={{ display: 'inline-block', marginBottom: '16px', color: '#9da1ff' }}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: easeOut }}>
              Untuk KOL & Creator
            </motion.span>
            <motion.h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(2.5rem, 7vw, 6rem)', color: '#ffffff', lineHeight: 1.0, marginBottom: '24px', letterSpacing: '-0.03em' }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}>
              Bergabung dengan{' '}
              <span style={{ background: 'linear-gradient(135deg, #9da1ff, #ff81aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                AzeraKOL Network
              </span>
            </motion.h1>
            <motion.p style={{ color: 'rgba(157,161,255,0.8)', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '40px', fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: '500px' }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}>
              Daftar gratis dan dapatkan akses ke ratusan peluang kolaborasi dengan brand terpercaya di Indonesia.
            </motion.p>
            <motion.div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: easeOut, delay: 0.3 }}>
              <Link to="/kol/register" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                <Zap size={18} />
                Daftar Sekarang
              </Link>
              <a href="#benefits" className="btn-outline" style={{ borderColor: 'rgba(157,161,255,0.5)', color: '#9da1ff', fontSize: '1rem', padding: '13px 28px' }}>
                Lihat Manfaat
              </a>
            </motion.div>
            <motion.div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '40px' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}>
              {['20K+ KOL Aktif', 'Gratis Daftar', 'Review 1-3 Hari', 'Top Brand'].map((b) => (
                <span key={b} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#e1e0ff', borderRadius: '999px', padding: '8px 16px', fontSize: '0.8rem', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                  {b}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section id="benefits" style={{ background: '#ffffff', padding: '100px 24px', position: 'relative', overflow: 'hidden' }} ref={benefitsRef}>
        <div className="blob" style={{ width: '350px', height: '350px', background: '#e1e0ff', opacity: 0.2, top: '15%', right: '5%' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div style={{ textAlign: 'center', marginBottom: '64px' }}
            initial={{ opacity: 0, y: 24 }} animate={benefitsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: easeOut }}>
            <span className="section-label" style={{ marginBottom: '14px' }}>Manfaat</span>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#191c20' }}>
              Kenapa Bergabung{' '}
              <span className="gradient-text">AzeraKOL?</span>
            </h2>
          </motion.div>
          <div className="kol-benefits-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div key={b.title} initial={{ opacity: 0, y: 24 }} animate={benefitsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: easeOut, delay: i * 0.1 }}>
                  <div className="glass-panel card-hover" style={{ padding: '28px', height: '100%', background: 'white' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #6728e4, #814bfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', boxShadow: '0 8px 24px rgba(103,40,228,0.2)' }}>
                      <Icon size={22} color="white" />
                    </div>
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '10px' }}>{b.title}</h3>
                    <p style={{ color: '#464652', fontSize: '0.875rem', lineHeight: 1.7, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{b.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <div style={{ background: '#15157d', padding: '64px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="blob" style={{ width: '300px', height: '300px', background: '#814bfe', opacity: 0.2, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(3rem, 8vw, 6rem)', color: '#9da1ff', lineHeight: 1, marginBottom: '8px' }}>
            20.000+
          </p>
          <p style={{ color: 'rgba(157,161,255,0.7)', fontSize: '1rem', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500 }}>
            KOL aktif telah bergabung di AzeraKOL Network
          </p>
        </div>
      </div>

      <section style={{ background: '#f2f3f9', padding: '100px 24px', position: 'relative', overflow: 'hidden' }} ref={stepsRef}>
        <div className="blob" style={{ width: '300px', height: '300px', background: '#e1e0ff', opacity: 0.2, bottom: '10%', right: '5%' }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div style={{ textAlign: 'center', marginBottom: '64px' }}
            initial={{ opacity: 0, y: 24 }} animate={stepsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: easeOut }}>
            <span className="section-label" style={{ marginBottom: '14px' }}>Cara Bergabung</span>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#191c20' }}>
              Mudah & <span className="gradient-text">Gratis.</span>
            </h2>
          </motion.div>
          <div className="kol-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {steps.map((step, i) => (
              <motion.div key={step.title} initial={{ opacity: 0, y: 24 }} animate={stepsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: easeOut, delay: i * 0.12 }}>
                <div className="glass-panel card-hover" style={{ padding: '32px', textAlign: 'center', position: 'relative', background: 'white' }}>
                  <div className="kinetic-glow" style={{ width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1rem', color: 'white' }}>
                    {step.num}
                  </div>
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#191c20', marginBottom: '10px' }}>{step.title}</h3>
                  <p style={{ color: '#464652', fontSize: '0.875rem', lineHeight: 1.7, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{step.desc}</p>
                  {i < steps.length - 1 && (
                    <div className="step-arrow" style={{ position: 'absolute', right: '-20px', top: '50%', transform: 'translateY(-50%)', color: '#6728e4', zIndex: 10 }}>
                      <ChevronRight size={24} />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#ffffff', padding: '100px 24px', position: 'relative', overflow: 'hidden' }} ref={ctaRef}>
        <div className="blob" style={{ width: '350px', height: '350px', background: '#e1e0ff', opacity: 0.2, top: '10%', right: '5%' }} />
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: easeOut }}>
            <div className="glass-panel" style={{ padding: '60px 40px', position: 'relative', overflow: 'hidden', background: 'white' }}>
              <span className="section-label" style={{ marginBottom: '16px' }}>Siap Bergabung?</span>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#191c20', lineHeight: 1.15, marginBottom: '16px' }}>
                Daftar Sekarang — Gratis!
              </h2>
              <p style={{ color: '#464652', fontSize: '1rem', lineHeight: 1.7, marginBottom: '36px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Tidak ada biaya, tidak ada komitmen. Cukup daftar dan tunggu tim kami menghubungimu.
              </p>
              <Link to="/kol/register" className="btn-primary" style={{ fontSize: '1.05rem', padding: '16px 40px' }}>
                <Sparkles size={18} />
                Daftar KOL Sekarang
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) { .kol-benefits-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .kol-benefits-grid { grid-template-columns: 1fr !important; } .kol-steps-grid { grid-template-columns: 1fr !important; } .step-arrow { display: none !important; } }
        @media (max-width: 768px) { .kol-steps-grid { grid-template-columns: 1fr !important; } .step-arrow { display: none !important; } }
      `}</style>
    </div>
  );
}
