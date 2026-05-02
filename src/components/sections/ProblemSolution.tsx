import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { XCircle, CheckCircle2 } from 'lucide-react';

const problems = [
  { title: 'Jangkauan Terbatas', desc: 'Satu influencer besar tidak menjangkau semua segmen audiens.' },
  { title: 'Biaya Tinggi', desc: 'Satu postingan macro influencer bisa menghabiskan seluruh budget kampanye.' },
  { title: 'Hasil Tidak Stabil', desc: 'Performa satu creator sangat bergantung pada mood konten hari itu.' },
];

const solutions = [
  { title: 'Lebih Banyak Kreator', desc: '10–500+ KOL menjangkau audiens dari berbagai penjuru Indonesia.' },
  { title: 'Lebih Banyak Touchpoint', desc: 'Multiple content dari multiple KOL = brand exposure yang masif dan berulang.' },
  { title: 'Lebih Banyak Konversi', desc: 'Nano & Micro KOL punya trust level tinggi = purchase intent lebih kuat.' },
];

export default function ProblemSolution() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section style={{ background: 'white', padding: '96px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }} ref={ref}>
        {/* Section label */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span className="section-label">Mengapa Azera?</span>
        </div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            color: '#1A1040',
            lineHeight: 1.2,
            marginBottom: '64px',
          }}
        >
          Scaling dengan{' '}
          <span className="pill-label" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)' }}>
            satu influencer
          </span>{' '}
          itu tidak pasti.
        </motion.h2>

        {/* Two columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
          }}
          className="ps-grid"
        >
          {/* Problems */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3
              style={{
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#EF4444',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <XCircle size={20} />
              Masalah dengan 1 Influencer
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {problems.map((item) => (
                <div
                  key={item.title}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '20px',
                    borderRadius: '16px',
                    background: '#FFF5F5',
                    border: '1px solid #FEE2E2',
                  }}
                >
                  <XCircle size={20} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ fontWeight: 700, color: '#1A1040', marginBottom: '4px' }}>{item.title}</p>
                    <p style={{ color: '#8B87B0', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Solutions */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3
              style={{
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#10B981',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <CheckCircle2 size={20} />
              Solusi dengan Azera
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {solutions.map((item) => (
                <div
                  key={item.title}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '20px',
                    borderRadius: '16px',
                    background: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                  }}
                >
                  <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <p style={{ fontWeight: 700, color: '#1A1040', marginBottom: '4px' }}>{item.title}</p>
                    <p style={{ color: '#8B87B0', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .ps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
