import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Play, X } from 'lucide-react';
import api from '../lib/api';
import {
  formatCompact, isVideo, platformLabel, resultBoxes, scopeText, sectionLabel, type PortfolioItem, type PlatformResult, type TopCreator,
} from '../lib/portfolio';

const num = (v: number | null | undefined, compact = false) =>
  v === null || v === undefined ? '—' : compact ? formatCompact(v) : v.toLocaleString('id-ID');

const cell: React.CSSProperties = { padding: '8px 10px 8px 0', fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap', textAlign: 'left' };
const head: React.CSSProperties = { ...cell, fontWeight: 700, color: '#fff' };

type ExtraKey = 'reach' | 'impressions' | 'engagement' | 'er';
const EXTRA_LABELS: Record<ExtraKey, string> = { reach: 'Reach', impressions: 'Impressions', engagement: 'Engagement', er: 'ER' };

type Clip = { kind: 'embed'; creator: TopCreator } | { kind: 'media'; url: string };

const IG_WIDTH = 326; // lebar minimum embed Instagram
const IG_HEADER = 54; // tinggi header username di embed IG
const IG_MEDIA_H = (IG_WIDTH * 5) / 4; // reel ditampilkan IG dalam kotak 4:5 dengan bar hitam kiri-kanan

/** Preview kecil postingan asli. TikTok: player resmi /player/v1 (ukuran bebas, hanya video).
 * Instagram: tidak punya player kecil & thumbnail butuh token API, jadi embed-nya dirender
 * di lebar minimum lalu diperkecil dengan CSS scale. */
function EmbedTile({ creator }: { creator: TopCreator }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tileW, setTileW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setTileW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const url = creator.postLink!;
  if (creator.platform === 'tiktok') {
    const id = url.match(/\/video\/(\d+)/)?.[1];
    if (id) {
      const params = 'controls=1&progress_bar=0&volume_control=0&fullscreen_button=1&timestamp=0&music_info=0&description=0&rel=0&native_context_menu=0&closed_caption=0';
      return (
        <div style={tile}>
          <iframe src={`https://www.tiktok.com/player/v1/${id}?${params}`} title={`Video ${creator.name}`} allow="fullscreen; encrypted-media" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
        </div>
      );
    }
  }
  const code = url.match(/instagram\.com\/(?:[^/]+\/)?(?:p|reel|reels|tv)\/([^/?#]+)/)?.[1];
  if (!code) return null;
  // perbesar sampai kotak media 4:5 setinggi tile 9:16, lalu geser ke tengah:
  // header, bar hitam, dan footer "View more on Instagram" terpotong, sisa videonya saja
  const scale = (tileW * 16) / 9 / IG_MEDIA_H;
  const offsetX = (IG_WIDTH * scale - tileW) / 2;
  return (
    <div ref={ref} style={tile}>
      <iframe
        src={`https://www.instagram.com/reel/${code}/embed/`}
        title={`Video ${creator.name}`}
        scrolling="no"
        style={{
          position: 'absolute', top: 0, left: 0, border: 0, width: `${IG_WIDTH}px`, height: `${IG_HEADER + IG_MEDIA_H + 200}px`,
          transform: `translateX(${-offsetX}px) scale(${scale}) translateY(-${IG_HEADER}px)`, transformOrigin: 'top left',
          visibility: tileW ? 'visible' : 'hidden',
        }}
      />
    </div>
  );
}

const tile: React.CSSProperties = {
  position: 'relative', width: '100%', aspectRatio: '9/16', borderRadius: '10px', overflow: 'hidden', border: 'none', padding: 0,
  background: 'rgba(255,255,255,0.14)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};

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
      <div style={{ maxWidth: '1160px', margin: '0 auto', background: 'var(--primary)', borderRadius: '28px', padding: '36px', color: '#fff' }}>
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
        {item.deliverables && (
          <div style={{ marginBottom: '22px' }}>
            <p style={sectionLabel}>Creator Deliverables</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>{item.deliverables}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '32px' }}>
          {resultBoxes(item).map((b) => (
            <div key={b.label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px 16px' }}>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>{b.label}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.35rem', color: 'var(--lime)' }}>{b.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px', marginBottom: '28px' }} className="portfolio-detail-grid">
          {rows.length > 0 && (
            <div style={{ minWidth: 0 }}>
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
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', marginTop: '10px' }}>
                Akumulasi views postingan, bukan jumlah penonton unik.
              </p>
            </div>
          )}

          {clips.length > 0 && (
            <div style={{ minWidth: 0 }}>
              <p style={{ ...sectionLabel, marginBottom: '12px' }}>Contoh Konten</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {clips.map((clip, i) => (
                  clip.kind === 'embed' ? <EmbedTile key={i} creator={clip.creator} /> : (
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

        {scope && (
          <div style={{ marginBottom: '20px' }}>
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
