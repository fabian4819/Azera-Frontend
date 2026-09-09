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

export default function SnapshotDetail({ s, compact }: { s: SnapshotView; compact?: boolean }) {
  const [showAll, setShowAll] = useState(false);
  const Icon = platformIcon[s.platform];
  const rows = s.sampleRows || [];
  const shown = showAll ? rows : rows.slice(0, 6);
  const anyViews = rows.some((r) => typeof r.views === 'number');
  const anyShares = rows.some((r) => typeof r.shares === 'number');
  const capturedAt = s.capturedAt || s.createdAt;
  const erLabel = s.erBasis === 'views' ? 'ER (per views)' : 'Engagement rate';

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

      {/* tren followers */}
      {s.followerSeries && s.followerSeries.filter((p) => typeof p.v === 'number').length >= 2 && (
        <div>
          <p style={{ ...lbl, display: 'flex', alignItems: 'center', gap: '4px' }}>
            {(s.followersDeltaAll ?? 0) >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />} Tren followers ({s.snapshotCount ?? s.followerSeries.length} snapshot)
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
                <tr style={{ color: '#8a869c', textAlign: 'right' }}>
                  <th style={{ textAlign: 'left', padding: '4px 6px' }}>Tanggal</th>
                  <th style={{ textAlign: 'left', padding: '4px 6px' }}>Format</th>
                  <th style={{ padding: '4px 6px' }}>Likes</th>
                  <th style={{ padding: '4px 6px' }}>Komentar</th>
                  {anyViews && <th style={{ padding: '4px 6px' }}>Views</th>}
                  {anyShares && <th style={{ padding: '4px 6px' }}>Shares</th>}
                </tr>
              </thead>
              <tbody>
                {shown.map((r, i) => (
                  <tr key={i} style={{ borderTop: '1px solid #eee', textAlign: 'right' }}>
                    <td style={{ textAlign: 'left', padding: '4px 6px', whiteSpace: 'nowrap' }}>
                      {r.url ? <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: '#6728e4', textDecoration: 'none' }}>{r.approxDate ? '≈' : ''}{tgl(r.date)}</a> : `${r.approxDate ? '≈' : ''}${tgl(r.date)}`}
                      {r.paid && <span style={{ marginLeft: 4, color: '#b45309', fontWeight: 700 }}>·$</span>}
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
