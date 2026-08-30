import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Zap, Users, ShieldCheck, BarChart3, Search, Check, X, TrendingUp } from 'lucide-react';
import { SiInstagram, SiTiktok } from 'react-icons/si';
import { ease } from '../../lib/motion';

type Feature = { icon: typeof Zap; title: string; desc: string };

const features: Feature[] = [
  { icon: Zap, title: 'Data-Driven Matching', desc: 'Pemilihan KOL tidak asal-asalan. Kami memakai data engagement, demografi audiens, dan performa historis untuk memastikan kesesuaian terbaik dengan brand kamu.' },
  { icon: Users, title: 'Jaringan KOL Masif', desc: 'Akses 20.000+ KOL aktif dari berbagai niche dan platform. Nano, micro, hingga macro creator tersedia di satu tempat.' },
  { icon: ShieldCheck, title: 'Terkurasi & Terpercaya', desc: 'Setiap KOL melalui proses kurasi ketat. Fake followers, engagement rendah, dan konten tidak sesuai langsung terseleksi.' },
  { icon: BarChart3, title: 'Fokus pada Performa', desc: 'Laporan transparan dengan metrik yang relevan. Setiap campaign dioptimalkan untuk mencapai tujuan bisnis yang sudah disepakati.' },
];

const avatarColors = ['#6728e4', '#814bfe', '#ff81aa', '#15157d', '#7f003f', '#5318eb', '#b3e768', '#9573d6', '#a31556', '#2e3192', '#c6a5ff'];

const cardShell: React.CSSProperties = {
  background: '#fff', borderRadius: '16px', padding: '18px', width: '100%',
  boxShadow: '0 22px 55px -22px rgba(103,40,228,0.35)',
};
const cardLabel: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'var(--outline)', marginBottom: '14px',
};

function renderVisual(i: number) {
  if (i === 0) {
    const rows = [
      { n: 'Nadia Lestari', ini: 'NL', bg: '#6728e4', Icon: SiInstagram, meta: 'Instagram · 30K', s: 96 },
      { n: 'Rangga Putra', ini: 'RP', bg: '#814bfe', Icon: SiTiktok, meta: 'TikTok · 82K', s: 91 },
      { n: 'Siti Fauziah', ini: 'SF', bg: '#ff81aa', Icon: SiInstagram, meta: 'Instagram · 45K', s: 88 },
    ];
    return (
      <div style={cardShell}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 13px', borderRadius: '12px', background: 'var(--surface-container)', marginBottom: '12px' }}>
          <Search size={16} color="var(--outline)" />
          <span style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem', flex: 1 }}>Cari KOL untuk campaign skincare…</span>
          <span style={{ background: 'var(--lime)', color: 'var(--on-lime)', borderRadius: '999px', padding: '3px 9px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.6rem' }}>AI Match</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {rows.map((r) => (
            <div key={r.n} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '9px 11px', borderRadius: '11px', border: '1px solid var(--outline-variant)' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.72rem', flexShrink: 0 }}>{r.ini}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--on-background)' }}>{r.n}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center', gap: '5px' }}><r.Icon size={10} /> {r.meta}</p>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'rgba(196,238,135,0.4)', color: '#3d6410', borderRadius: '999px', padding: '3px 9px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.68rem' }}><Check size={11} /> {r.s}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (i === 1) {
    return (
      <div style={cardShell}>
        <p style={cardLabel}>Jaringan Creator</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '9px', marginBottom: '16px' }}>
          {avatarColors.map((c, k) => (
            <div key={k} style={{ aspectRatio: '1', borderRadius: '50%', background: c }} />
          ))}
          <div style={{ aspectRatio: '1', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.62rem' }}>+20K</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.9rem', color: 'var(--secondary)', lineHeight: 1 }}>20.000+</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>KOL aktif terkurasi</span>
        </div>
      </div>
    );
  }
  if (i === 2) {
    const checks = [
      { ok: true, t: 'Engagement rate asli & konsisten' },
      { ok: true, t: 'Audiens relevan dengan niche brand' },
      { ok: false, t: 'Fake followers → otomatis ditolak' },
      { ok: true, t: 'Kualitas konten sesuai standar' },
    ];
    return (
      <div style={cardShell}>
        <p style={cardLabel}>Proses Kurasi</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {checks.map((c) => (
            <div key={c.t} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '11px 13px', borderRadius: '11px', background: c.ok ? 'rgba(196,238,135,0.18)' : 'var(--error-container)' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: c.ok ? 'rgba(196,238,135,0.7)' : 'rgba(186,26,26,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {c.ok ? <Check size={13} color="#3d6410" /> : <X size={13} color="var(--error)" />}
              </div>
              <span style={{ fontSize: '0.83rem', color: 'var(--on-background)', fontWeight: 500 }}>{c.t}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  const bars = [42, 58, 50, 72, 88];
  return (
    <div style={cardShell}>
      <p style={cardLabel}>Performa Campaign</p>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '120px', marginBottom: '16px', padding: '0 4px' }}>
        {bars.map((h, k) => (
          <div key={k} style={{ flex: 1, height: `${h}%`, borderRadius: '8px 8px 4px 4px', background: k === bars.length - 1 ? 'var(--lime)' : 'linear-gradient(180deg, #814bfe, #6728e4)' }} />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.7rem', color: 'var(--secondary)', lineHeight: 1 }}>+240%</p>
          <p style={{ fontSize: '0.78rem', color: 'var(--on-surface-variant)' }}>Rata-rata kenaikan reach</p>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(196,238,135,0.4)', color: '#3d6410', borderRadius: '999px', padding: '6px 12px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.75rem' }}>
          <TrendingUp size={13} /> ROI naik
        </span>
      </div>
    </div>
  );
}

function HeadingBlock() {
  return (
    <div>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--secondary)', display: 'inline-block', marginBottom: '16px' }}>
        Why AzeraKOL
      </span>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.05, letterSpacing: '-0.03em', color: 'var(--on-background)', marginBottom: '18px' }}>
        Partner KOL yang<br />brand percaya.
      </h2>
      <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '440px' }}>
        Dari matching creator sampai laporan akhir, AzeraKOL adalah tempat brand menjalankan campaign KOL yang benar-benar terukur.
      </p>
    </div>
  );
}

function PointText({ f }: { f: Feature }) {
  const Icon = f.icon;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <Icon size={24} color="var(--secondary)" />
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'var(--secondary)' }}>{f.title}</h3>
      </div>
      <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.98rem', lineHeight: 1.7, maxWidth: '440px' }}>{f.desc}</p>
    </div>
  );
}

function VisualFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'linear-gradient(155deg, #ece6ff 0%, #cbb4ff 100%)', borderRadius: '24px', padding: '26px', height: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </div>
  );
}

const swap = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.3, ease },
};

export default function WhyAzera() {
  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(features.length - 1, Math.max(0, Math.floor(v * features.length)));
    setActive(idx);
  });

  // Mobile: tumpuk biasa (tanpa pinning) — tiap poin + visualnya
  if (!isDesktop) {
    return (
      <section style={{ background: 'linear-gradient(180deg, #ece6ff 0%, var(--surface) 12%)', padding: '48px 0 72px' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: '48px' }}><HeadingBlock /></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {features.map((f, i) => (
              <div key={f.title}>
                <div style={{ marginBottom: '20px' }}><PointText f={f} /></div>
                <VisualFrame>{renderVisual(i)}</VisualFrame>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Desktop: scrollytelling — viewport di-pin, teks & visual cross-fade saat scroll
  return (
    <section ref={sectionRef} style={{ position: 'relative', height: `${features.length * 85}vh`, background: 'linear-gradient(180deg, #ece6ff 0%, var(--surface) 10%)' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center' }}>
            {/* LEFT — heading (statis) + poin aktif (cross-fade) */}
            <div>
              <HeadingBlock />
              <div style={{ minHeight: '150px', marginTop: '44px' }}>
                <AnimatePresence mode="wait">
                  <motion.div key={active} {...swap}>
                    <PointText f={features[active]} />
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* progress indicator */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '28px' }}>
                {features.map((_, i) => (
                  <span key={i} style={{ width: i === active ? '26px' : '8px', height: '8px', borderRadius: '999px', background: i === active ? 'var(--secondary)' : 'var(--outline-variant)', transition: 'all 0.3s ease' }} />
                ))}
              </div>
            </div>

            {/* RIGHT — visual (cross-fade) */}
            <div>
              <VisualFrame>
                <AnimatePresence mode="wait">
                  <motion.div key={active} {...swap} style={{ width: '100%' }}>
                    {renderVisual(active)}
                  </motion.div>
                </AnimatePresence>
              </VisualFrame>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
