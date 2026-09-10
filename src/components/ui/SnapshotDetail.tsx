import { useMemo, useState } from 'react';
import { SiInstagram, SiTiktok, SiThreads, SiX, SiFacebook, SiYoutube } from 'react-icons/si';
import { ExternalLink, BadgeCheck, TrendingUp, TrendingDown } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip,
  type DotProps,
} from 'recharts';

const f = 'var(--font-display)';

const platformIcon: Record<string, React.ComponentType<{ size?: number }>> = {
  instagram: SiInstagram, tiktok: SiTiktok, threads: SiThreads, x: SiX, facebook: SiFacebook, youtube: SiYoutube,
};

export interface SampleRow {
  post?: string; url?: string; date?: string; approxDate?: boolean; format?: string; title?: string;
  thumb?: string;
  likes?: number | null; comments?: number | null; views?: number | null; shares?: number | null;
  saves?: number | null; paid?: boolean;
}

export interface SnapshotView {
  platform: string; username: string; displayName?: string; avatarUrl?: string; bio?: string; isVerified?: boolean;
  profileUrl?: string;
  followers?: number | null; following?: number | null; postsCount?: number | null;
  avgLikes?: number | null; avgComments?: number | null; avgViews?: number | null; avgShares?: number | null;
  medLikes?: number | null; medComments?: number | null; medViews?: number | null;
  engagementRate?: number | null; engagementRateMedian?: number | null; engagementRateViews?: number | null;
  erBasis?: string;
  postsSampled?: number | null; totalCollected?: number | null;
  paidPosts?: number | null; organicPosts?: number | null;
  postsPerWeek?: number | null; postRangeDays?: number | null; outlierRatio?: number | null; roundedNumbers?: boolean;
  sampleRows?: SampleRow[];
  missingFields?: string[];
  followersDelta?: number | null; followersDeltaAll?: number | null;
  snapshotCount?: number; firstCapturedAt?: string; capturedAt?: string; createdAt?: string;
  followerSeries?: { t: string; v: number | null }[];
  niche?: string; notes?: string; shortlistCampaign?: string;
  capturedBy?: { name?: string } | null;
}

/* ---------- format ---------- */
function fmt(n?: number | null): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return '—';
  const abs = Math.abs(n);
  const koma = (x: number, d: number) => x.toFixed(d).replace('.', ',');
  if (abs >= 1_000_000_000) return koma(n / 1_000_000_000, 1) + 'M';
  if (abs >= 1_000_000) return koma(n / 1_000_000, 1) + 'jt';
  if (abs >= 1_000) return koma(n / 1_000, 1) + 'rb';
  return String(Math.round(n * 100) / 100).replace('.', ',');
}
function pct(n?: number | null): string {
  return n === null || n === undefined || !Number.isFinite(n) ? '—' : (Math.round(n * 100) / 100).toFixed(2).replace('.', ',') + '%';
}
function tgl(s?: string): string {
  if (!s) return '—';
  try { return new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: '2-digit' }); }
  catch { return '—'; }
}
function ringkasRentang(hari?: number | null): string {
  if (hari === null || hari === undefined) return '—';
  if (hari < 60) return hari + ' hari';
  if (hari < 730) return (Math.round((hari / 30.4) * 10) / 10).toString().replace('.', ',') + ' bulan';
  return (Math.round((hari / 365) * 10) / 10).toString().replace('.', ',') + ' tahun';
}
function num1(n?: number | null): string {
  return n == null || !Number.isFinite(n) ? '—' : String(Math.round(n * 100) / 100).replace('.', ',');
}

/* ---------- recompute dari baris (port dari KolxMetrics.compute ekstensi) ---------- */
interface Computed {
  n: number; avgLikes: number | null; avgComments: number | null; avgViews: number | null; avgShares: number | null;
  medLikes: number | null; medComments: number | null; medViews: number | null;
  er: number | null; erMedian: number | null; erViews: number | null;
  perMinggu: number | null; rangeDays: number | null; paid: number; organic: number; outlier: number | null;
}
function avg(a: number[]): number | null { return a.length ? a.reduce((s, v) => s + v, 0) / a.length : null; }
function median(a: number[]): number | null {
  if (!a.length) return null;
  const v = [...a].sort((x, y) => x - y); const t = Math.floor(v.length / 2);
  return v.length % 2 ? v[t] : (v[t - 1] + v[t]) / 2;
}
function computeFromRows(rows: SampleRow[], followers?: number | null, erBasis?: string, platform?: string): Computed {
  const pakaiShare = platform === 'facebook';
  const col = (k: 'likes' | 'comments' | 'views' | 'shares') =>
    rows.map((r) => r[k]).filter((x): x is number => typeof x === 'number');
  const avgLikes = avg(col('likes')), avgComments = avg(col('comments'));
  const avgViews = avg(col('views')), avgShares = avg(col('shares'));
  const medLikes = median(col('likes')), medComments = median(col('comments')), medViews = median(col('views'));
  const inter = (l: number | null, c: number | null, sh: number | null): number | null => {
    const parts: (number | null)[] = [l, c].concat(pakaiShare ? [sh] : []);
    return parts.some((v) => v !== null) ? parts.reduce<number>((acc, v) => acc + (v || 0), 0) : null;
  };
  const interactions = inter(avgLikes, avgComments, avgShares);
  const interMed = inter(medLikes, medComments, median(col('shares')));
  const basis = erBasis === 'views' ? avgViews : followers;
  const basisMed = erBasis === 'views' ? medViews : followers;
  const er = interactions != null && basis ? (interactions / basis) * 100 : null;
  const erMedian = interMed != null && basisMed ? (interMed / basisMed) * 100 : null;
  const erViews = erBasis !== 'views' && interactions != null && avgViews ? (interactions / avgViews) * 100 : null;
  const ts = rows.map((r) => (r.date ? +new Date(r.date) : 0)).filter(Boolean).sort((a, b) => b - a);
  let perMinggu: number | null = null, rangeDays: number | null = null;
  if (ts.length >= 2) {
    const days = (ts[0] - ts[ts.length - 1]) / 86400000;
    rangeDays = Math.round(days);
    perMinggu = days > 0 ? (ts.length - 1) / (days / 7) : null;
  }
  const likesArr = col('likes');
  const top = likesArr.length ? Math.max(...likesArr) : null;
  const outlier = medLikes && top ? top / medLikes : null;
  const paid = rows.filter((r) => r.paid).length;
  return {
    n: rows.length, avgLikes, avgComments, avgViews, avgShares, medLikes, medComments, medViews,
    er, erMedian, erViews, perMinggu, rangeDays, paid, organic: rows.length - paid, outlier,
  };
}

const box: React.CSSProperties = { background: '#f8f9ff', borderRadius: '10px', padding: '10px 12px' };
const lbl: React.CSSProperties = {
  fontSize: '0.62rem', fontFamily: f, fontWeight: 700, color: '#8a869c',
  textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px',
};
const val: React.CSSProperties = { fontSize: '0.98rem', fontWeight: 800, color: '#191c20', fontFamily: f };

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={box}>
      <p style={lbl}>{label}</p>
      <p style={val}>{value}</p>
      {sub && <p style={{ fontSize: '0.68rem', color: '#8a869c' }}>{sub}</p>}
    </div>
  );
}

function Sparkline({ series }: { series: { t: string; v: number | null }[] }) {
  const pts = series
    .filter((p) => typeof p.v === 'number')
    .map((p) => ({ t: p.t, v: p.v as number }));
  if (pts.length < 2) return null;
  const up = pts[pts.length - 1].v >= pts[0].v;
  return (
    <ResponsiveContainer width="100%" height={44}>
      <LineChart data={pts} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <YAxis hide domain={['dataMin', 'dataMax']} />
        <XAxis dataKey="t" hide />
        <Line type="monotone" dataKey="v" stroke={up ? '#12b76a' : '#f04438'} strokeWidth={2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface ErDatum {
  i: number; er: number; label: string; row: SampleRow;
}

/** titik kuning kecil untuk post berbayar */
function PaidDot(props: DotProps & { payload?: ErDatum }) {
  const { cx, cy, payload } = props;
  if (!payload?.row.paid || cx == null || cy == null) return null;
  return <circle cx={cx} cy={cy} r={3} fill="#f0c674" stroke="#fff" strokeWidth={1} />;
}

function ErTooltip({
  active, payload, usesEr, komentarLabel,
}: { active?: boolean; payload?: { payload: ErDatum }[]; usesEr: boolean; komentarLabel: string }) {
  const [imgOk, setImgOk] = useState(true);
  const d = active && payload && payload.length ? payload[0].payload : null;
  if (!d) return null;
  const r = d.row;
  return (
    <div style={{ width: 190, background: '#fff', border: '1px solid #e1e0ff', borderRadius: 10, boxShadow: '0 10px 28px rgba(30,10,94,0.2)', padding: 8, fontFamily: f }}>
      {r.thumb && imgOk && (
        <img src={r.thumb} alt="" onError={() => setImgOk(false)}
          style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 6, display: 'block', marginBottom: 6 }} />
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#8a869c' }}>
        <span>{r.approxDate ? '≈' : ''}{tgl(r.date)}</span>
        {r.paid && <span style={{ color: '#b45309', fontWeight: 700 }}>BERBAYAR</span>}
      </div>
      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#191c20' }}>
        {usesEr ? pct(d.er) : fmt(d.er)}
        {r.format && <span style={{ fontSize: '0.62rem', color: '#8a869c', fontWeight: 600 }}> · {r.format}</span>}
      </div>
      <div style={{ fontSize: '0.68rem', color: '#55516b' }}>
        {fmt(r.likes)} suka · {fmt(r.comments)} {komentarLabel.toLowerCase()}
        {typeof r.views === 'number' ? ` · ${fmt(r.views)} views` : ''}
      </div>
      {r.title && <div style={{ fontSize: '0.66rem', color: '#8a869c', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>}
      {r.url && <div style={{ fontSize: '0.62rem', color: '#6728e4', marginTop: 3, fontWeight: 700 }}>klik untuk buka post ↗</div>}
    </div>
  );
}

/**
 * Tren ER per post — (likes + komentar) ÷ followers per post, urut lama → baru.
 * Recharts area chart; hijau naik / merah turun; titik kuning = berbayar.
 * Hover → popup gambar + info post; klik → buka post-nya.
 */
function ErTrendChart({ rows, followers, komentarLabel }: { rows: SampleRow[]; followers?: number | null; komentarLabel: string }) {
  const usesEr = !!(followers && followers > 0);
  const data = useMemo<ErDatum[]>(
    () =>
      rows
        .filter((r) => typeof r.likes === 'number')
        .map((r) => ({
          row: r,
          er: usesEr ? ((r.likes! + (r.comments || 0)) / followers!) * 100 : (r.likes as number),
          d: r.date ? +new Date(r.date) : 0,
          label: tgl(r.date),
        }))
        .sort((a, b) => a.d - b.d)
        .map((x, i) => ({ i, er: x.er, label: x.label, row: x.row })),
    [rows, followers, usesEr]
  );
  if (data.length < 2) return null;
  const up = data[data.length - 1].er >= data[0].er;
  const color = up ? '#12b76a' : '#e0463e';
  const gid = 'erfill-' + (up ? 'up' : 'dn');

  return (
    <div>
      <p style={{ ...lbl, display: 'flex', justifyContent: 'space-between' }}>
        <span>Tren ER post{usesEr ? ` · (suka + ${komentarLabel.toLowerCase()}) ÷ ${fmt(followers)} followers` : ' · suka'}</span>
        {rows.some((r) => r.paid) && <span style={{ color: '#b45309' }}>● berbayar</span>}
      </p>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart
          data={data}
          margin={{ top: 6, right: 8, bottom: 0, left: 8 }}
          onClick={(state) => {
            const idx = Number((state as { activeIndex?: number | string } | undefined)?.activeIndex);
            const p = Number.isInteger(idx) ? data[idx] : undefined;
            if (p?.row.url) window.open(p.row.url, '_blank', 'noopener');
          }}
          style={{ cursor: 'pointer' }}
        >
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="i" hide />
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Tooltip
            content={<ErTooltip usesEr={usesEr} komentarLabel={komentarLabel} />}
            cursor={{ stroke: '#b9b6cc', strokeWidth: 1, strokeDasharray: '3 3' }}
            wrapperStyle={{ zIndex: 10, outline: 'none' }}
            isAnimationActive={false}
          />
          <Area
            type="monotone" dataKey="er" stroke={color} strokeWidth={2}
            fill={`url(#${gid})`} isAnimationActive={false}
            dot={<PaidDot />} activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2, fill: color }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

type SortKey = 'date' | 'likes' | 'comments' | 'views' | 'shares';

const SAMPLE_OPTS: { key: string; label: string; take: (rows: SampleRow[]) => SampleRow[] }[] = [
  { key: '12', label: '12 post terakhir', take: (r) => r.slice(0, 12) },
  { key: '24', label: '24 post terakhir', take: (r) => r.slice(0, 24) },
  { key: '48', label: '48 post terakhir', take: (r) => r.slice(0, 48) },
  { key: 'all', label: 'Semua terkumpul', take: (r) => r },
  { key: '90d', label: '90 hari terakhir', take: (r) => byDays(r, 90) },
  { key: '180d', label: '180 hari terakhir', take: (r) => byDays(r, 180) },
];
function byDays(rows: SampleRow[], days: number): SampleRow[] {
  const cutoff = Date.now() - days * 86400000;
  return rows.filter((r) => !r.date || +new Date(r.date) >= cutoff);
}

export default function SnapshotDetail({ s, compact }: { s: SnapshotView; compact?: boolean }) {
  const allRows = useMemo(
    () => [...(s.sampleRows || [])].sort((a, b) => (b.date ? +new Date(b.date) : 0) - (a.date ? +new Date(a.date) : 0)),
    [s.sampleRows]
  );

  // default: seukuran yang dipakai ekstensi saat capture
  const defaultKey = (s.postsSampled && s.postsSampled > 12 ? (s.postsSampled >= 48 ? '48' : '24') : '12');
  const [sampleKey, setSampleKey] = useState(allRows.length ? defaultKey : 'all');
  const [showAll, setShowAll] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortAsc, setSortAsc] = useState(false);

  const Icon = platformIcon[s.platform];
  const capturedAt = s.capturedAt || s.createdAt;
  const erLabel = s.erBasis === 'views' ? 'ER (per views)' : 'Engagement rate';
  const komentarLabel = s.platform === 'threads' ? 'Replies' : 'Komentar';

  const rows = useMemo(() => {
    const opt = SAMPLE_OPTS.find((o) => o.key === sampleKey) || SAMPLE_OPTS[0];
    return allRows.length ? opt.take(allRows) : [];
  }, [allRows, sampleKey]);
  const live = useMemo(() => computeFromRows(rows, s.followers, s.erBasis, s.platform), [rows, s.followers, s.erBasis, s.platform]);
  const hasRows = allRows.length > 0;

  // kalau ada baris per-post → pakai hitungan live; kalau tidak → angka bawaan snapshot
  const m = hasRows
    ? {
        avgLikes: live.avgLikes, avgComments: live.avgComments, avgViews: live.avgViews, avgShares: live.avgShares,
        medLikes: live.medLikes, medComments: live.medComments, medViews: live.medViews,
        er: live.er, erMedian: live.erMedian, erViews: live.erViews,
        perMinggu: live.perMinggu, rangeDays: live.rangeDays, paid: live.paid, organic: live.organic,
        outlier: live.outlier, n: live.n,
      }
    : {
        avgLikes: s.avgLikes ?? null, avgComments: s.avgComments ?? null, avgViews: s.avgViews ?? null, avgShares: s.avgShares ?? null,
        medLikes: s.medLikes ?? null, medComments: s.medComments ?? null, medViews: s.medViews ?? null,
        er: s.engagementRate ?? null, erMedian: s.engagementRateMedian ?? null, erViews: s.engagementRateViews ?? null,
        perMinggu: s.postsPerWeek ?? null, rangeDays: s.postRangeDays ?? null,
        paid: s.paidPosts ?? 0, organic: s.organicPosts ?? 0, outlier: s.outlierRatio ?? null, n: s.postsSampled ?? 0,
      };

  const anyViews = rows.some((r) => typeof r.views === 'number');
  const anyShares = rows.some((r) => typeof r.shares === 'number');

  const sortVal = (r: SampleRow): number | null => {
    if (sortKey === 'date') return r.date ? +new Date(r.date) : null;
    const v = r[sortKey];
    return typeof v === 'number' ? v : null;
  };
  const sortedRows = [...rows].sort((a, b) => {
    const x = sortVal(a), y = sortVal(b);
    if (x == null || y == null) return x == null && y == null ? 0 : x == null ? 1 : -1;
    return sortAsc ? x - y : y - x;
  });
  const shown = showAll ? sortedRows : sortedRows.slice(0, 8);
  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortAsc((v) => !v);
    else { setSortKey(k); setSortAsc(false); }
  };
  const sortableTh = (k: SortKey, label: string) => (
    <th key={k} onClick={() => toggleSort(k)} style={{ padding: '4px 6px', cursor: 'pointer', color: sortKey === k ? '#6728e4' : '#8a869c', whiteSpace: 'nowrap' }}>
      {label}{sortKey === k ? (sortAsc ? ' ▲' : ' ▼') : ''}
    </th>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: f }}>
      {compact && (
        <p style={{ fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', color: '#191c20' }}>
          {Icon && <Icon size={13} />}
          <a href={s.profileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#6728e4', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            @{s.username} <ExternalLink size={9} />
          </a>
          {s.isVerified && <BadgeCheck size={13} color="#6728e4" />}
          {s.displayName && <span style={{ color: '#999', fontWeight: 500 }}>· {s.displayName}</span>}
        </p>
      )}

      {!compact && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {s.avatarUrl
            ? <img src={s.avatarUrl} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
            : Icon && <span style={{ width: 40, height: 40, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={18} /></span>}
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
              {s.displayName || s.username}
              {s.isVerified && <BadgeCheck size={14} color="#6728e4" />}
            </p>
            <a href={s.profileUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: '#6728e4', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              {Icon && <Icon size={11} />} @{s.username} <ExternalLink size={9} />
            </a>
          </div>
        </div>
      )}
      {s.bio && !compact && <p style={{ fontSize: '0.78rem', color: '#55516b', whiteSpace: 'pre-wrap' }}>{s.bio}</p>}

      {/* pemilih ukuran sampel — seperti dropdown "Sampel" di ekstensi */}
      {hasRows && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#55516b' }}>
          <span style={lbl}>Sampel</span>
          <select
            value={sampleKey}
            onChange={(e) => setSampleKey(e.target.value)}
            style={{ padding: '4px 8px', borderRadius: '8px', border: '1px solid #ddd9ec', fontSize: '0.78rem', fontFamily: f }}
          >
            {SAMPLE_OPTS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
          <span style={{ color: '#8a869c' }}>{rows.length} dari {allRows.length} terkumpul</span>
        </div>
      )}

      {/* angka utama */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: '8px' }}>
        <Stat
          label="Followers"
          value={fmt(s.followers)}
          sub={
            s.followersDeltaAll != null && s.followersDeltaAll !== 0
              ? `${s.followersDeltaAll > 0 ? '+' : ''}${fmt(s.followersDeltaAll)} total`
              : s.followersDelta != null && s.followersDelta !== 0
                ? `${s.followersDelta > 0 ? '+' : ''}${fmt(s.followersDelta)} vs sebelumnya`
                : undefined
          }
        />
        <Stat label="Following" value={fmt(s.following)} />
        <Stat label="Total post" value={fmt(s.postsCount)} />
        <Stat label={erLabel} value={pct(m.er)} sub={m.erMedian != null ? `median ${pct(m.erMedian)}` : undefined} />
        {m.erViews != null && <Stat label="ER by views" value={pct(m.erViews)} />}
      </div>

      {/* avg / median */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: '8px' }}>
        <Stat label="Avg likes" value={fmt(m.avgLikes)} sub={m.medLikes != null ? `median ${fmt(m.medLikes)}` : undefined} />
        <Stat label="Avg komentar" value={fmt(m.avgComments)} sub={m.medComments != null ? `median ${fmt(m.medComments)}` : undefined} />
        {(m.avgViews != null || m.medViews != null) && (
          <Stat label="Avg views" value={fmt(m.avgViews)} sub={m.medViews != null ? `median ${fmt(m.medViews)}` : undefined} />
        )}
        {m.avgShares != null && <Stat label="Avg shares" value={fmt(m.avgShares)} />}
      </div>

      {/* konteks sampel */}
      <div style={{ fontSize: '0.75rem', color: '#55516b', lineHeight: 1.6 }}>
        Dihitung dari <b>{m.n} post</b>
        {allRows.length ? ` (dari ${allRows.length} terkumpul)` : s.totalCollected != null ? ` (dari ${s.totalCollected} terkumpul)` : ''}
        {m.rangeDays != null ? ` dalam ${ringkasRentang(m.rangeDays)}` : ''}
        {m.perMinggu != null ? ` · ${num1(m.perMinggu)} post/minggu` : ''}
        {m.paid > 0 ? ` · ${m.paid} berbayar / ${m.organic} organik` : ''}
        {s.roundedNumbers ? ' · angka platform dibulatkan' : ''}
        {m.outlier != null && m.outlier >= 5 ? ` · ⚠ 1 post ${Math.round(m.outlier)}× di atas median` : ''}
      </div>

      {(s.niche || s.shortlistCampaign || s.notes) && (
        <div style={{ fontSize: '0.75rem', color: '#55516b', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {s.niche && <span style={{ background: '#f0eeff', color: '#4a2ba8', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>{s.niche}</span>}
          {s.shortlistCampaign && <span style={{ background: '#fff4e6', color: '#b45309', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>shortlist: {s.shortlistCampaign}</span>}
          {s.notes && <span>“{s.notes}”</span>}
        </div>
      )}

      {/* tren ER per post — grafik + popup gambar seperti ekstensi */}
      <ErTrendChart rows={rows} followers={s.followers} komentarLabel={komentarLabel} />

      {/* tren followers antar snapshot */}
      {s.followerSeries && s.followerSeries.filter((p) => typeof p.v === 'number').length >= 2 && (
        <div>
          <p style={{ ...lbl, display: 'flex', alignItems: 'center', gap: '4px' }}>
            {(s.followersDeltaAll ?? 0) >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />} Tren followers · {s.snapshotCount ?? s.followerSeries.length} snapshot
          </p>
          <Sparkline series={s.followerSeries} />
        </div>
      )}

      {/* rincian per post */}
      {rows.length > 0 && (
        <div>
          <p style={lbl}>Rincian {rows.length} post</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
              <thead>
                <tr style={{ textAlign: 'right' }}>
                  {sortableTh('date', 'Tanggal')}
                  <th style={{ textAlign: 'left', padding: '4px 6px', color: '#8a869c' }}>Format</th>
                  {sortableTh('likes', 'Likes')}
                  {sortableTh('comments', komentarLabel)}
                  {anyViews && sortableTh('views', 'Views')}
                  {anyShares && sortableTh('shares', 'Shares')}
                </tr>
              </thead>
              <tbody>
                {shown.map((r, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #eee', textAlign: 'right' }}>
                    <td style={{ textAlign: 'left', padding: '4px 6px', whiteSpace: 'nowrap' }}>
                      {r.url
                        ? <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: '#6728e4', textDecoration: 'none' }}>{r.approxDate ? '≈' : ''}{tgl(r.date)}</a>
                        : `${r.approxDate ? '≈' : ''}${tgl(r.date)}`}
                      {r.paid && <span style={{ marginLeft: 4, color: '#b45309', fontWeight: 700 }} title="berbayar">$</span>}
                    </td>
                    <td style={{ textAlign: 'left', padding: '4px 6px', color: '#8a869c' }}>{r.format || '—'}</td>
                    <td style={{ padding: '4px 6px' }}>{fmt(r.likes)}</td>
                    <td style={{ padding: '4px 6px' }}>{fmt(r.comments)}</td>
                    {anyViews && <td style={{ padding: '4px 6px' }}>{fmt(r.views)}</td>}
                    {anyShares && <td style={{ padding: '4px 6px' }}>{fmt(r.shares)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length > 8 && (
            <button onClick={() => setShowAll((v) => !v)} style={{ marginTop: 6, background: 'none', border: 'none', color: '#6728e4', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: f }}>
              {showAll ? 'Tampilkan lebih sedikit' : `Tampilkan semua ${rows.length}`}
            </button>
          )}
        </div>
      )}

      {(s.missingFields?.length ?? 0) > 0 && (
        <p style={{ fontSize: '0.72rem', color: '#b45309' }}>Belum kebaca ekstensi (isi manual bila perlu): {s.missingFields!.join(', ')}</p>
      )}
      <p style={{ fontSize: '0.68rem', color: '#8a869c' }}>
        Ditarik {tgl(capturedAt)}{s.capturedBy?.name ? ` oleh ${s.capturedBy.name}` : ''}
        {s.firstCapturedAt && s.firstCapturedAt !== capturedAt ? ` · pertama ${tgl(s.firstCapturedAt)}` : ''}
      </p>
    </div>
  );
}
