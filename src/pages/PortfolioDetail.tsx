import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Play, X } from 'lucide-react';
import api from '../lib/api';
import SocialEmbed from '../components/SocialEmbed';
import {
  formatCompact, isVideo, platformLabel, resultBoxes, scopeText, sectionLabel, nicheChip, videoTile as tile, type PortfolioItem, type PlatformResult, type TopCreator,
} from '../lib/portfolio';

const num = (v: number | null | undefined, compact = false) =>
  v === null || v === undefined ? '—' : compact ? formatCompact(v) : v.toLocaleString('id-ID');

const cell: React.CSSProperties = { padding: '8px 10px 8px 0', fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap', textAlign: 'left' };
const head: React.CSSProperties = { ...cell, fontWeight: 700, color: '#fff' };

type ExtraKey = 'reach' | 'impressions' | 'engagement' | 'er';
const EXTRA_LABELS: Record<ExtraKey, string> = { reach: 'Reach', impressions: 'Impressions', engagement: 'Engagement', er: 'ER' };

type Clip = { kind: 'embed'; creator: TopCreator } | { kind: 'media'; url: string };

const EMBED_W = 340; // embed IG/TikTok tidak bisa dirender lebih sempit dari ±326px

/** Render embed di lebar aslinya lalu perkecil (CSS zoom, layout ikut mengecil) agar muat di kolom sempit. */
function ZoomFit({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.5);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setZoom(Math.min(1, el.clientWidth / EMBED_W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ minWidth: 0 }}>
      <div style={{ width: `${EMBED_W}px`, zoom }}>{children}</div>
    </div>
  );
}

export default function PortfolioDetail() {
  const { id } = useParams();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [playing, setPlaying] = useState<Clip | null>(null);

  useEffect(() => {
    api.get(`/portfolio/${id}`)
      .then((res) => setItem(res.data))
      .catch(() => setNotFound(true));
  }, [id]);

  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPlaying(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playing]);

  if (notFound || !item) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)' }}>
        <p style={{ fontFamily: 'var(--font-display)', color: 'var(--on-surface-variant)' }}>
          {notFound ? 'Portfolio tidak ditemukan.' : 'Memuat...'}
        </p>
      </div>
    );
  }

  const rows = item.platforms || [];
  // kolom Metrik Tambahan hanya muncul bila ada baris yang diizinkan tampil publik (server sudah strip sisanya)
  const extraCols = (Object.keys(EXTRA_LABELS) as ExtraKey[]).filter((k) => rows.some((r) => r[k] !== undefined && r[k] !== null && r[k] !== ''));
  const extraValue = (r: PlatformResult, k: ExtraKey) => (k === 'er' ? r.er || '—' : num(r[k], true));
  const scope = scopeText(item);
  const clips: Clip[] = [
    ...(item.topCreators || []).slice(0, 3).filter((c) => c.postLink).map((creator) => ({ kind: 'embed' as const, creator })),
    ...(item.contents || []).slice(0, 3).map((url) => ({ kind: 'media' as const, url })),
  ];

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh', padding: '96px 24px 90px' }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto', background: 'var(--portfolio-bg)', borderRadius: '28px', padding: '36px', color: '#fff' }}>
        <Link to="/portfolio" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--lime)', fontSize: '0.85rem', textDecoration: 'none', marginBottom: '20px' }}>
          <ArrowLeft size={15} /> Kembali ke Portofolio
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {item.logo && <img src={item.logo} alt={item.brand} style={{ height: '32px', maxWidth: '120px', objectFit: 'contain', background: '#fff', borderRadius: '8px', padding: '4px 8px' }} />}
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--lime)' }}>{item.brand}</span>
          <span className="tag-pill tag-pill-white">{item.category}</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', lineHeight: 1.2, marginBottom: '6px' }}>
          {item.title || `${item.brand} ${item.category}`}
        </h1>
        {item.period && <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Periode: {item.period}</p>}

        <div style={{ height: '22px' }} />
        {item.objective && (
          <div style={{ marginBottom: '18px' }}>
            <p style={sectionLabel}>Objective</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>{item.objective}</p>
          </div>
        )}
        {!!item.niches?.length && (
          <div style={{ marginBottom: '18px' }}>
            <p style={sectionLabel}>Niche KOL</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {item.niches.map((n) => <span key={n} style={nicheChip}>{n}</span>)}
            </div>
          </div>
        )}
        {item.deliverables && (
          <div style={{ marginBottom: '22px' }}>
            <p style={sectionLabel}>Creator Deliverables</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>{item.deliverables}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px', marginBottom: '32px' }}>
          {resultBoxes(item).map((b) => (
            <div key={b.label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 12px' }}>
              <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2px' }}>{b.label}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.25, color: 'var(--lime)' }}>{b.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px' }} className="portfolio-detail-grid">
          {/* kiri: tabel platform + scope + kredit, supaya tidak ada ruang kosong di samping kolom video yang tinggi */}
          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {rows.length > 0 && (
            <div>
              <p style={{ ...sectionLabel, marginBottom: '12px' }}>Hasil per Platform</p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                  <thead>
                    <tr>
                      {['Platform', 'Kreator', 'Postingan', 'Views', ...extraCols.map((k) => EXTRA_LABELS[k])].map((h) => <th key={h} style={head}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i}>
                        <td style={cell}>{platformLabel(r)}</td>
                        <td style={cell}>{num(r.creators)}</td>
                        <td style={cell}>{num(r.posts)}</td>
                        <td style={cell}>{num(r.views, true)}</td>
                        {extraCols.map((k) => <td key={k} style={cell}>{extraValue(r, k)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {scope && (
            <div>
              <p style={sectionLabel}>Scope AZERA</p>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{scope}</p>
            </div>
          )}

          {(item.partnerAgency || item.hashtag) && (
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>
              {[item.partnerAgency && `In collaboration with ${item.partnerAgency}`, item.hashtag].filter(Boolean).join('  •  ')}
            </p>
          )}
          </div>

          {clips.length > 0 && (
            <div style={{ minWidth: 0 }}>
              <p style={{ ...sectionLabel, marginBottom: '12px' }}>Contoh Konten</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', alignItems: 'start' }}>
                {clips.map((clip, i) => (
                  clip.kind === 'embed' ? (
                    <ZoomFit key={i}><SocialEmbed platform={clip.creator.platform} url={clip.creator.postLink!} /></ZoomFit>
                  ) : (
                    <button key={i} onClick={() => setPlaying(clip)} style={tile} aria-label={`Buka contoh konten ${i + 1}`}>
                      {isVideo(clip.url)
                        ? <video src={clip.url} muted playsInline preload="metadata" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <img src={clip.url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                      {isVideo(clip.url) && <Play size={30} fill="#fff" color="#fff" style={{ position: 'relative' }} />}
                    </button>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {playing && (
        <div
          onClick={() => setPlaying(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', overflowY: 'auto' }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setPlaying(null)} aria-label="Tutup" style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 1, width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.6)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} />
            </button>
            {playing.kind === 'embed' ? null : isVideo(playing.url) ? (
              <video src={playing.url} controls autoPlay playsInline style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: '14px', background: '#000' }} />
            ) : (
              <img src={playing.url} alt={`Contoh konten ${item.brand}`} style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: '14px' }} />
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .portfolio-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
