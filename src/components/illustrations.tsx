/**
 * Ilustrasi spot halaman publik (form & kamus), gaya sama dengan /service-sections/*.webp:
 * flat line-art, outline navy tebal, isi putih/lavender/ungu, aksen lime, latar transparan (dipasang di atas --hero-bg).
 */
const N = '#1c0a44'; // outline navy
const L = '#c4ee87'; // lime (--lime)
const P = '#8b66eb'; // ungu
const V = '#e1e0ff'; // lavender
const W = '#ffffff';
const line = { stroke: N, strokeWidth: 3, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

type Props = { style?: React.CSSProperties };
const svgProps = (label: string, style?: React.CSSProperties) => ({
  viewBox: '0 0 320 240', role: 'img', 'aria-label': label, style: { width: '100%', height: 'auto', display: 'block', ...style },
});
const Sparks = ({ x, y }: { x: number; y: number }) => (
  <g stroke={L} strokeWidth={4} strokeLinecap="round">
    <path d={`M${x} ${y} l8 -8`} /><path d={`M${x + 4} ${y + 14} h12`} /><path d={`M${x - 6} ${y - 6} l-2 -10`} />
  </g>
);

/** Form brand: megaphone di layar + grafik naik + chat konsultasi */
export function BrandIllustration({ style }: Props) {
  return (
    <svg {...svgProps('Ilustrasi konsultasi campaign brand', style)}>
      <rect x="70" y="40" width="170" height="120" rx="14" fill={W} {...line} />
      <rect x="70" y="40" width="170" height="22" rx="10" fill={P} {...line} />
      <circle cx="84" cy="51" r="3" fill={W} /><circle cx="95" cy="51" r="3" fill={W} /><circle cx="106" cy="51" r="3" fill={W} />
      <path d="M104 98 l46 -20 v52 l-46 -20 z" fill={L} {...line} />
      <rect x="90" y="96" width="16" height="16" rx="3" fill={P} {...line} />
      <path d="M150 88 q12 16 0 32" fill="none" {...line} />
      <path d="M168 94 l14 -6 M170 104 h16 M168 114 l14 6" {...line} />
      <rect x="196" y="90" width="30" height="8" rx="4" fill={V} /><rect x="196" y="106" width="22" height="8" rx="4" fill={V} />
      <rect x="216" y="128" width="84" height="74" rx="12" fill={W} {...line} />
      <rect x="230" y="172" width="12" height="18" rx="2" fill={P} {...line} />
      <rect x="250" y="160" width="12" height="30" rx="2" fill={P} {...line} />
      <rect x="270" y="146" width="12" height="44" rx="2" fill={L} {...line} />
      <path d="M230 158 l20 -10 l20 6 l14 -12" fill="none" stroke={P} strokeWidth={3} strokeLinecap="round" />
      <path d="M20 128 h84 a10 10 0 0 1 10 10 v34 a10 10 0 0 1 -10 10 h-56 l-16 14 v-14 h-12 a10 10 0 0 1 -10 -10 v-34 a10 10 0 0 1 10 -10 z" fill={V} {...line} />
      <circle cx="44" cy="156" r="5" fill={N} /><circle cx="62" cy="156" r="5" fill={N} /><circle cx="80" cy="156" r="5" fill={N} />
      <Sparks x={262} y={30} />
    </svg>
  );
}

/** Form KOL: HP dengan profil creator + bintang + hati */
export function CreatorIllustration({ style }: Props) {
  return (
    <svg {...svgProps('Ilustrasi pendaftaran creator', style)}>
      <rect x="112" y="18" width="104" height="200" rx="18" fill={W} {...line} />
      <rect x="146" y="28" width="36" height="7" rx="3.5" fill={N} />
      <circle cx="164" cy="82" r="28" fill={V} {...line} />
      <circle cx="164" cy="76" r="10" fill={P} {...line} />
      <path d="M146 100 q18 -22 36 0" fill={P} {...line} />
      <rect x="132" y="124" width="64" height="10" rx="5" fill={N} />
      <rect x="140" y="142" width="48" height="8" rx="4" fill={V} />
      <rect x="128" y="164" width="72" height="30" rx="15" fill={L} {...line} />
      <path d="M152 179 l8 8 l16 -16" fill="none" {...line} />
      <rect x="22" y="58" width="76" height="62" rx="12" fill={W} {...line} />
      <path d="M60 72 l6 12 l13 2 l-10 9 l3 13 l-12 -7 l-12 7 l3 -13 l-10 -9 l13 -2 z" fill={L} {...line} />
      <rect x="230" y="128" width="72" height="62" rx="12" fill={W} {...line} />
      <path d="M266 176 c-22 -14 -24 -30 -12 -34 c6 -2 10 2 12 6 c2 -4 6 -8 12 -6 c12 4 10 20 -12 34 z" fill={P} {...line} />
      <rect x="230" y="50" width="62" height="48" rx="10" fill={P} {...line} />
      <path d="M254 62 l18 12 l-18 12 z" fill={W} {...line} />
      <Sparks x={40} y={36} />
    </svg>
  );
}

/** Form apply campaign: clipboard checklist + kamera konten */
export function ApplyIllustration({ style }: Props) {
  return (
    <svg {...svgProps('Ilustrasi daftar campaign', style)}>
      <rect x="92" y="30" width="136" height="186" rx="14" fill={W} {...line} />
      <rect x="130" y="18" width="60" height="26" rx="8" fill={L} {...line} />
      {[72, 112, 152].map((y, i) => (
        <g key={y}>
          <circle cx="122" cy={y} r="11" fill={i < 2 ? L : V} {...line} />
          {i < 2 && <path d={`M116 ${y} l5 5 l9 -10`} fill="none" {...line} />}
          <rect x="144" y={y - 9} width="62" height="8" rx="4" fill={P} />
          <rect x="144" y={y + 3} width="40" height="7" rx="3.5" fill={V} />
        </g>
      ))}
      <rect x="112" y="182" width="96" height="20" rx="10" fill={P} {...line} />
      <rect x="226" y="116" width="78" height="58" rx="12" fill={P} {...line} />
      <circle cx="265" cy="145" r="16" fill={W} {...line} />
      <circle cx="265" cy="145" r="7" fill={L} {...line} />
      <rect x="240" y="106" width="22" height="12" rx="4" fill={P} {...line} />
      <rect x="18" y="70" width="64" height="88" rx="10" fill={V} {...line} />
      <path d="M30 140 l14 -18 l10 12 l8 -8 l12 14 z" fill={P} {...line} />
      <circle cx="62" cy="94" r="7" fill={L} {...line} />
      <Sparks x={256} y={70} />
    </svg>
  );
}

/** Kamus: buku terbuka A–Z + kaca pembesar */
export function KamusIllustration({ style }: Props) {
  return (
    <svg {...svgProps('Ilustrasi kamus istilah KOL', style)}>
      <path d="M40 66 q60 -20 120 6 v132 q-60 -24 -120 -6 z" fill={W} {...line} />
      <path d="M280 66 q-60 -20 -120 6 v132 q60 -24 120 -6 z" fill={V} {...line} />
      <text x="96" y="122" textAnchor="middle" fontFamily="var(--font-display), sans-serif" fontWeight="800" fontSize="40" fill={P}>A</text>
      <rect x="62" y="140" width="68" height="8" rx="4" fill={V} /><rect x="62" y="156" width="50" height="8" rx="4" fill={V} />
      <text x="222" y="122" textAnchor="middle" fontFamily="var(--font-display), sans-serif" fontWeight="800" fontSize="40" fill={N}>Z</text>
      <rect x="190" y="140" width="68" height="8" rx="4" fill={W} /><rect x="190" y="156" width="50" height="8" rx="4" fill={W} />
      <circle cx="232" cy="64" r="30" fill={L} fillOpacity={0.9} {...line} />
      <circle cx="232" cy="64" r="18" fill={W} {...line} />
      <path d="M254 86 l26 26" stroke={N} strokeWidth={10} strokeLinecap="round" />
      <path d="M254 86 l26 26" stroke={P} strokeWidth={5} strokeLinecap="round" />
      <rect x="30" y="20" width="58" height="30" rx="10" fill={P} {...line} />
      <path d="M44 35 h30" stroke={W} strokeWidth={4} strokeLinecap="round" />
      <Sparks x={120} y={30} />
    </svg>
  );
}

/** Portfolio: piala hasil campaign + grafik naik + kartu konten */
export function PortfolioIllustration({ style }: Props) {
  return (
    <svg {...svgProps('Ilustrasi portfolio campaign sukses', style)}>
      <rect x="12" y="52" width="84" height="120" rx="12" fill={W} {...line} />
      <rect x="24" y="64" width="60" height="56" rx="8" fill={P} {...line} />
      <path d="M46 82 l18 10 l-18 10 z" fill={W} {...line} />
      <rect x="26" y="134" width="56" height="8" rx="4" fill={P} />
      <rect x="26" y="150" width="38" height="8" rx="4" fill={V} />
      <path d="M124 40 h72 v34 a36 36 0 0 1 -72 0 z" fill={L} {...line} />
      <path d="M124 52 h-16 a14 14 0 0 0 16 26 M196 52 h16 a14 14 0 0 1 -16 26" fill="none" {...line} />
      <path d="M160 52 l5 10 l11 2 l-8 8 l2 11 l-10 -5 l-10 5 l2 -11 l-8 -8 l11 -2 z" fill={W} {...line} />
      <rect x="150" y="110" width="20" height="26" fill={P} {...line} />
      <rect x="128" y="136" width="64" height="18" rx="4" fill={P} {...line} />
      <rect x="118" y="154" width="84" height="16" rx="4" fill={V} {...line} />
      <rect x="214" y="96" width="88" height="96" rx="12" fill={W} {...line} />
      <rect x="228" y="152" width="12" height="26" rx="2" fill={V} {...line} />
      <rect x="246" y="138" width="12" height="40" rx="2" fill={P} {...line} />
      <rect x="264" y="122" width="12" height="56" rx="2" fill={P} {...line} />
      <rect x="282" y="110" width="12" height="68" rx="2" fill={L} {...line} />
      <path d="M228 136 l18 -14 l18 6 l18 -18" fill="none" stroke={N} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <Sparks x={244} y={46} />
      <Sparks x={104} y={26} />
    </svg>
  );
}
