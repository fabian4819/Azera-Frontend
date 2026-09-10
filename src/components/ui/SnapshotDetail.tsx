import { useState } from 'react';
import { SiInstagram, SiTiktok, SiThreads, SiX, SiFacebook, SiYoutube } from 'react-icons/si';
import { ExternalLink, BadgeCheck, TrendingUp, TrendingDown } from 'lucide-react';

const f = 'var(--font-display)';

const platformIcon: Record<string, React.ComponentType<{ size?: number }>> = {
  instagram: SiInstagram, tiktok: SiTiktok, threads: SiThreads, x: SiX, facebook: SiFacebook, youtube: SiYoutube,
};

export interface SampleRow {
  post?: string; url?: string; date?: string; approxDate?: boolean; format?: string; title?: string;
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

/** 12800 -> "12,8rb" · 1_420_000 -> "1,4jt" — sama gaya dengan panel ekstensi */
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

const box: React.CSSProperties = {
  background: '#f8f9ff', borderRadius: '10px', padding: '10px 12px',
};
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
  const pts = series.filter((p) => typeof p.v === 'number') as { t: string; v: number }[];
  if (pts.length < 2) return null;
  const vals = pts.map((p) => p.v);
  const min = Math.min(...vals), max = Math.max(...vals), range = max - min || 1;
  const W = 240, H = 40;
  const coords = pts.map((p, i) => {
    const x = (i / (pts.length - 1)) * W;
    const y = H - ((p.v - min) / range) * H;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const up = vals[vals.length - 1] >= vals[0];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '40px', display: 'block' }}>
      <polyline points={coords.join(' ')} fill="none" stroke={up ? '#12b76a' : '#f04438'} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Tren ER per post — sama seperti panel ekstensi: (likes + komentar) ÷ followers
 * per post, urut lama → baru; hijau kalau naik, merah kalau turun; titik kuning
 * = post berbayar.
 */
function ErTrendChart({ rows, followers, komentarLabel }: { rows: SampleRow[]; followers?: number | null; komentarLabel: string }) {
  const pts = rows
    .filter((r) => typeof r.likes === 'number')
    .map((r) => ({
      row: r,
      er: followers && followers > 0 ? ((r.likes! + (r.comments || 0)) / followers) * 100 : (r.likes as number),
      d: r.date ? +new Date(r.date) : 0,
    }))
    .sort((a, b) => a.d - b.d);
  const [hover, setHover] = useState<number | null>(null);
  if (pts.length < 2) return null;

  const W = 300, H = 80, pad = 6;
  const vals = pts.map((p) => p.er);
  const min = Math.min(...vals), max = Math.max(...vals), range = max - min || 1;
  const coords = pts.map((p, i) => ({
    x: pad + (i / (pts.length - 1)) * (W - pad * 2),
    y: H - pad - ((p.er - min) / range) * (H - pad * 2),
  }));
  const up = vals[vals.length - 1] >= vals[0];
  const color = up ? '#4ecb85' : '#f4796b';
  const line = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const area = `${pad},${H} ${line} ${W - pad},${H}`;
  const usesEr = !!(followers && followers > 0);
  const h = hover != null ? pts[hover] : null;

  return (
    <div>
      <p style={{ ...lbl, display: 'flex', justifyContent: 'space-between' }}>
        <span>Tren ER post{usesEr ? ` · (suka + ${komentarLabel.toLowerCase()}) ÷ ${fmt(followers)} followers` : ' · suka'}</span>
        <span style={{ color: rows.some((r) => r.paid) ? '#b45309' : 'transparent' }}>● berbayar</span>
      </p>
      <div style={{ position: 'relative' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
          style={{ width: '100%', height: '80px', display: 'block' }}
          onMouseLeave={() => setHover(null)}
          onMouseMove={(e) => {
            const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
            const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
            setHover(Math.round(ratio * (pts.length - 1)));
          }}
        >
          <polygon points={area} fill={color} opacity={0.13} />
          <polyline points={line} fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
          {pts.map((p, i) => (p.row.paid ? <circle key={i} cx={coords[i].x} cy={coords[i].y} r={2.4} fill="#f0c674" /> : null))}
          <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r={2.6} fill={color} />
          {h && <line x1={coords[hover!].x} y1={0} x2={coords[hover!].x} y2={H} stroke="#bbb" strokeWidth={0.8} strokeDasharray="2 2" />}
          {h && <circle cx={coords[hover!].x} cy={coords[hover!].y} r={3.4} fill="#fff" stroke={color} strokeWidth={1.8} />}
        </svg>
        {h && (
          <div style={{ fontSize: '0.7rem', color: '#55516b', marginTop: '2px', textAlign: 'center' }}>
            {tgl(h.row.date)}{h.row.paid ? ' · berbayar' : ''} — {usesEr ? pct(h.er) : fmt(h.er)} · {fmt(h.row.likes)} suka · {fmt(h.row.comments)} {komentarLabel.toLowerCase()}
            {typeof h.row.views === 'number' ? ` · ${fmt(h.row.views)} views` : ''}
          </div>
        )}
      </div>
    </div>
  );
}

type SortKey = 'date' | 'likes' | 'comments' | 'views' | 'shares';

export default function SnapshotDetail({ s, compact }: { s: SnapshotView; compact?: boolean }) {
  const [showAll, setShowAll] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const Icon = platformIcon[s.platform];
  const rows = s.sampleRows || [];
  const anyViews = rows.some((r) => typeof r.views === 'number');
  const anyShares = rows.some((r) => typeof r.shares === 'number');
  const capturedAt = s.capturedAt || s.createdAt;
  const erLabel = s.erBasis === 'views' ? 'ER (per views)' : 'Engagement rate';
  const komentarLabel = s.platform === 'threads' ? 'Replies' : 'Komentar';

  // urutkan seperti ekstensi: nilai kosong selalu di bawah
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
  const shown = showAll ? sortedRows : sortedRows.slice(0, 6);
  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortAsc((v) => !v);
    else { setSortKey(k); setSortAsc(false); }
  };
  const sortableTh = (k: SortKey, label: string) => (
    <th
      key={k}
      onClick={() => toggleSort(k)}
      style={{ padding: '4px 6px', cursor: 'pointer', color: sortKey === k ? '#6728e4' : '#8a869c', whiteSpace: 'nowrap' }}
    >
      {label}{sortKey === k ? (sortAsc ? ' ▲' : ' ▼') : ''}
    </th>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontFamily: f }}>
      {/* identitas ringkas (mode compact) */}
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

      {/* identitas penuh */}
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
        <Stat label={erLabel} value={pct(s.engagementRate)} sub={s.engagementRateMedian != null ? `median ${pct(s.engagementRateMedian)}` : undefined} />
        {s.engagementRateViews != null && <Stat label="ER by views" value={pct(s.engagementRateViews)} />}
      </div>

      {/* avg / median */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: '8px' }}>
        <Stat label="Avg likes" value={fmt(s.avgLikes)} sub={s.medLikes != null ? `median ${fmt(s.medLikes)}` : undefined} />
        <Stat label="Avg komentar" value={fmt(s.avgComments)} sub={s.medComments != null ? `median ${fmt(s.medComments)}` : undefined} />
        {(s.avgViews != null || s.medViews != null) && (
          <Stat label="Avg views" value={fmt(s.avgViews)} sub={s.medViews != null ? `median ${fmt(s.medViews)}` : undefined} />
        )}
        {s.avgShares != null && <Stat label="Avg shares" value={fmt(s.avgShares)} />}
      </div>

      {/* konteks sampel */}
      <div style={{ fontSize: '0.75rem', color: '#55516b', lineHeight: 1.6 }}>
        Dihitung dari <b>{s.postsSampled ?? '—'} post</b>
        {s.totalCollected != null ? ` (dari ${s.totalCollected} terkumpul)` : ''}
        {s.postRangeDays != null ? ` dalam ${ringkasRentang(s.postRangeDays)}` : ''}
        {s.postsPerWeek != null ? ` · ${String(Math.round(s.postsPerWeek * 100) / 100).replace('.', ',')} post/minggu` : ''}
        {(s.paidPosts ?? 0) > 0 ? ` · ${s.paidPosts} berbayar / ${s.organicPosts ?? 0} organik` : ''}
        {s.roundedNumbers ? ' · angka platform dibulatkan' : ''}
        {s.outlierRatio != null && s.outlierRatio >= 5 ? ` · ⚠ 1 post ${Math.round(s.outlierRatio)}× di atas median` : ''}
      </div>

      {(s.niche || s.shortlistCampaign || s.notes) && (
        <div style={{ fontSize: '0.75rem', color: '#55516b', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {s.niche && <span style={{ background: '#f0eeff', color: '#4a2ba8', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>{s.niche}</span>}
          {s.shortlistCampaign && <span style={{ background: '#fff4e6', color: '#b45309', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>shortlist: {s.shortlistCampaign}</span>}
          {s.notes && <span>“{s.notes}”</span>}
        </div>
      )}

      {/* tren ER per post — sama seperti panel ekstensi */}
      <ErTrendChart rows={rows} followers={s.followers} komentarLabel={komentarLabel} />

      {/* tren followers antar snapshot — data yang ekstensi tidak punya */}
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
          <p style={lbl}>Rincian {rows.length} post di sampel</p>
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
                      {r.url ? <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: '#6728e4', textDecoration: 'none' }}>{r.approxDate ? '≈' : ''}{tgl(r.date)}</a> : `${r.approxDate ? '≈' : ''}${tgl(r.date)}`}
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
          {rows.length > 6 && (
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
