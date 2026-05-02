import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, Headphones, Network, TrendingUp, Users, ArrowRight } from 'lucide-react';

const benefits = [
  {
    icon: DollarSign,
    title: 'Brand Deals',
    desc: 'Dapatkan kolaborasi brand yang sesuai niche kamu dengan kompensasi yang fair dan transparan.',
    color: '#10B981',
    bg: '#F0FDF4',
  },
  {
    icon: Headphones,
    title: 'Campaign Support',
    desc: 'Tim Azera siap bantu dari awal hingga akhir kampanye — brief, konten, hingga pelaporan.',
    color: '#6B2EE8',
    bg: '#F0EEFF',
  },
  {
    icon: Network,
    title: 'KOL Network',
    desc: 'Bergabung dengan komunitas 20,000+ KOL. Kolaborasi, share insight, dan tumbuh bersama.',
    color: '#38C6F0',
    bg: '#F0FBFF',
  },
  {
    icon: TrendingUp,
    title: 'Growth Opportunities',
    desc: 'Tingkatkan portofolio dan jangkauan kamu dengan kampanye yang konsisten dari brand terpercaya.',
    color: '#E8197A',
    bg: '#FFF0F7',
  },
];

export default function KOL() {
  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Hero */}
      <section
        style={{
          background: '#0F0A2E',
          padding: '96px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="orb" style={{ width: '450px', height: '450px', background: 'rgba(107,46,232,0.3)', top: '-150px', right: '-100px' }} />
        <div className="orb" style={{ width: '300px', height: '300px', background: 'rgba(56,198,240,0.2)', bottom: '-80px', left: '-80px' }} />

        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label" style={{ color: '#38C6F0', display: 'block', marginBottom: '16px' }}>
              Untuk KOL & Creator
            </span>
            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.15,
                marginBottom: '20px',
              }}
            >
              Bergabung dengan Jaringan KOL{' '}
              <span className="gradient-text">Azera</span>
            </h1>
            <p style={{ color: '#8B87B0', fontSize: '1.05rem', maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.7 }}>
              Monetize konten kamu, dapatkan brand deal yang sesuai, dan tumbuh bersama komunitas creator terbesar di Indonesia.
            </p>
            <Link to="/kol/register" className="btn-primary" style={{ fontSize: '1rem', padding: '16px 36px' }}>
              Daftar Sekarang — Gratis
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{ background: '#1C1545', padding: '24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '64px', flexWrap: 'wrap' }}>
          {[
            { value: '20K+', label: 'KOL sudah bergabung' },
            { value: '100+', label: 'Brand partner' },
            { value: '500+', label: 'Kampanye berjalan' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p className="gradient-text" style={{ fontSize: '2rem', fontWeight: 900 }}>{s.value}</p>
              <p style={{ color: '#8B87B0', fontSize: '0.85rem' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <section style={{ background: 'white', padding: '96px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span className="section-label" style={{ display: 'block', marginBottom: '12px' }}>Keuntungan</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: '#1A1040', lineHeight: 1.2 }}>
              Kenapa Bergabung dengan <span className="gradient-text">Azera</span>?
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }} className="benefits-grid">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.title}
                  className="card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  style={{ padding: '32px', display: 'flex', gap: '20px' }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: b.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={24} color={b.color} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1A1040', marginBottom: '8px' }}>{b.title}</h3>
                    <p style={{ color: '#8B87B0', fontSize: '0.9rem', lineHeight: 1.7 }}>{b.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Card */}
      <section style={{ background: '#F2F0FF', padding: '80px 24px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
              borderRadius: '28px',
              padding: '56px 48px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', top: '-80px', right: '-80px' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Users size={40} color="rgba(255,255,255,0.5)" style={{ marginBottom: '20px' }} />
              <h2 style={{ fontWeight: 800, fontSize: '2rem', color: 'white', marginBottom: '12px' }}>
                Siap Bergabung?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '32px' }}>
                Daftar sekarang — gratis! Tim kami akan mereview profil dan menghubungi kamu untuk onboarding.
              </p>
              <Link
                to="/kol/register"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'white',
                  color: '#6B2EE8',
                  borderRadius: '999px',
                  padding: '16px 36px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textDecoration: 'none',
                }}
              >
                Daftar KOL Sekarang
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) { .benefits-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
