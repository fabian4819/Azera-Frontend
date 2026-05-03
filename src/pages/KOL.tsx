import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { DollarSign, Headphones, Network, TrendingUp, ChevronRight } from 'lucide-react';

const benefits = [
  {
    icon: DollarSign,
    title: 'Brand Deals Eksklusif',
    desc: 'Akses ke ratusan brand ternama yang mencari KOL terkurasi. Dapatkan kolaborasi yang sesuai dengan niche dan nilai brand-mu.',
  },
  {
    icon: Headphones,
    title: 'Campaign Support',
    desc: 'Tim Azera mendampingi setiap tahap campaign — dari briefing hingga pelaporan. Kamu tinggal fokus bikin konten.',
  },
  {
    icon: Network,
    title: 'KOL Network',
    desc: 'Bergabung dengan komunitas 20K+ KOL aktif Indonesia. Sharing knowledge, tips, dan peluang kolaborasi sesama kreator.',
  },
  {
    icon: TrendingUp,
    title: 'Growth Opportunities',
    desc: 'Track record dan portofolio kampanye yang terbangun akan membuka pintu untuk kolaborasi lebih besar di masa depan.',
  },
];

const steps = [
  { num: '01', title: 'Daftar', desc: 'Isi form pendaftaran gratis dengan data profil dan media sosialmu.' },
  { num: '02', title: 'Review', desc: 'Tim Azera akan meninjau profil dalam 1–3 hari kerja.' },
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
      {/* Hero: DARK */}
      <section
        style={{
          background: '#08060F',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          padding: '120px 24px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="orb" style={{ width: '500px', height: '500px', background: '#6B2EE8', top: '-200px', left: '-100px' }} />
        <div className="orb" style={{ width: '350px', height: '350px', background: '#E8197A', bottom: '-100px', right: '10%' }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '680px' }}>
            <motion.span
              className="section-label"
              style={{ display: 'inline-block', marginBottom: '16px' }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut }}
            >
              Untuk KOL & Creator
            </motion.span>

            <motion.h1
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(2.5rem, 7vw, 6rem)',
                color: '#EDE9F8',
                lineHeight: 1.0,
                marginBottom: '24px',
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOut, delay: 0.1 }}
            >
              Bergabung dengan{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Azera Network
              </span>
            </motion.h1>

            <motion.p
              style={{
                color: '#8B87A8',
                fontSize: '1.05rem',
                lineHeight: 1.75,
                marginBottom: '40px',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                maxWidth: '500px',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}
            >
              Daftar gratis dan dapatkan akses ke ratusan peluang kolaborasi dengan brand terpercaya di Indonesia.
            </motion.p>

            <motion.div
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.3 }}
            >
              <Link to="/kol/register" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                Daftar Sekarang →
              </Link>
              <a href="#benefits" className="btn-outline" style={{ fontSize: '1rem', padding: '13px 28px' }}>
                Lihat Manfaat
              </a>
            </motion.div>

            {/* Floating badges */}
            <motion.div
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '40px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {['20K+ KOL Aktif', 'Gratis Daftar', 'Review 1-3 Hari', 'Top Brand'].map((b) => (
                <span
                  key={b}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#EDE9F8',
                    borderRadius: '999px',
                    padding: '8px 16px',
                    fontSize: '0.8rem',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontWeight: 600,
                  }}
                >
                  {b}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits: LIGHT */}
      <section id="benefits" style={{ background: '#FAFAFA', padding: '100px 24px' }} ref={benefitsRef}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div
            style={{ textAlign: 'center', marginBottom: '64px' }}
            initial={{ opacity: 0, y: 24 }}
            animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <span className="section-label" style={{ display: 'inline-block', marginBottom: '14px' }}>
              Manfaat
            </span>
            <h2
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                color: '#120E28',
              }}
            >
              Kenapa Bergabung{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Azera?
              </span>
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }} className="kol-benefits-grid">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, ease: easeOut, delay: i * 0.1 }}
                >
                  <div className="light-card" style={{ padding: '28px', height: '100%' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '18px',
                      }}
                    >
                      <Icon size={22} color="white" />
                    </div>
                    <h3
                      style={{
                        fontFamily: 'Syne, sans-serif',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: '#120E28',
                        marginBottom: '10px',
                      }}
                    >
                      {b.title}
                    </h3>
                    <p style={{ color: '#5B5780', fontSize: '0.875rem', lineHeight: 1.7, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {b.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats bar: DARK */}
      <div style={{ background: '#08060F', padding: '64px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="orb" style={{ width: '400px', height: '400px', background: '#6B2EE8', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.15 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1,
              marginBottom: '8px',
            }}
          >
            20.000+
          </p>
          <p style={{ color: '#8B87A8', fontSize: '1rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            KOL aktif telah bergabung di Azera Network
          </p>
        </div>
      </div>

      {/* Process: LIGHT */}
      <section style={{ background: '#F2F0FF', padding: '100px 24px' }} ref={stepsRef}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div
            style={{ textAlign: 'center', marginBottom: '64px' }}
            initial={{ opacity: 0, y: 24 }}
            animate={stepsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <span className="section-label" style={{ display: 'inline-block', marginBottom: '14px' }}>
              Cara Bergabung
            </span>
            <h2
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                color: '#120E28',
              }}
            >
              Mudah &{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Gratis.
              </span>
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="kol-steps-grid">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                animate={stepsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: easeOut, delay: i * 0.12 }}
              >
                <div
                  className="light-card"
                  style={{ padding: '32px', textAlign: 'center', position: 'relative' }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 900,
                      fontSize: '1rem',
                      color: 'white',
                    }}
                  >
                    {step.num}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: '#120E28',
                      marginBottom: '10px',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ color: '#5B5780', fontSize: '0.875rem', lineHeight: 1.7, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {step.desc}
                  </p>
                  {i < steps.length - 1 && (
                    <div
                      className="step-arrow"
                      style={{
                        position: 'absolute',
                        right: '-20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#6B2EE8',
                        zIndex: 10,
                      }}
                    >
                      <ChevronRight size={24} />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA: DARK */}
      <section style={{ background: '#08060F', padding: '100px 24px' }} ref={ctaRef}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px',
                padding: '60px 40px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div className="orb" style={{ width: '300px', height: '300px', background: '#6B2EE8', top: '-100px', left: '-100px', opacity: 0.2 }} />
              <div className="orb" style={{ width: '300px', height: '300px', background: '#E8197A', bottom: '-100px', right: '-100px', opacity: 0.15 }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <span className="section-label" style={{ display: 'inline-block', marginBottom: '16px' }}>
                  Siap Bergabung?
                </span>
                <h2
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 900,
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    color: '#EDE9F8',
                    lineHeight: 1.15,
                    marginBottom: '16px',
                  }}
                >
                  Daftar Sekarang — Gratis!
                </h2>
                <p
                  style={{
                    color: '#8B87A8',
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    marginBottom: '36px',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                  }}
                >
                  Tidak ada biaya, tidak ada komitmen. Cukup daftar dan tunggu tim kami menghubungimu.
                </p>
                <Link
                  to="/kol/register"
                  className="btn-primary"
                  style={{ fontSize: '1.05rem', padding: '16px 40px' }}
                >
                  Daftar KOL Sekarang →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .kol-benefits-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .kol-benefits-grid { grid-template-columns: 1fr !important; }
          .kol-steps-grid { grid-template-columns: 1fr !important; }
          .step-arrow { display: none !important; }
        }
        @media (max-width: 768px) {
          .kol-steps-grid { grid-template-columns: 1fr !important; }
          .step-arrow { display: none !important; }
        }
      `}</style>
    </div>
  );
}
