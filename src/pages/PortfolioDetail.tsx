import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import api from '../lib/api';
import {
  formatCompact, isVideo, platformLabel, resultBoxes, scopeText, sectionLabel, type PortfolioItem, type PlatformResult,
} from '../lib/portfolio';

const num = (v: number | null | undefined, compact = false) =>
  v === null || v === undefined ? '—' : compact ? formatCompact(v) : v.toLocaleString('id-ID');

const cell: React.CSSProperties = { padding: '8px 10px 8px 0', fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap', textAlign: 'left' };
const head: React.CSSProperties = { ...cell, fontWeight: 700, color: '#fff' };

type ExtraKey = 'reach' | 'impressions' | 'engagement' | 'er';
const EXTRA_LABELS: Record<ExtraKey, string> = { reach: 'Reach', impressions: 'Impressions', engagement: 'Engagement', er: 'ER' };

export default function PortfolioDetail() {
  const { id } = useParams();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/portfolio/${id}`)
      .then((res) => setItem(res.data))
      .catch(() => setNotFound(true));
  }, [id]);

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
  const creators = (item.topCreators || []).slice(0, 3);
  const media = (item.contents || []).slice(0, 3);

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

          {(media.length > 0 || creators.length > 0) && (
            <div style={{ minWidth: 0 }}>
              <p style={{ ...sectionLabel, marginBottom: '12px' }}>Contoh Konten</p>
              {media.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
                  {media.map((url) => (
                    isVideo(url)
                      ? <video key={url} src={url} controls playsInline style={{ width: '100%', aspectRatio: '9/16', objectFit: 'cover', borderRadius: '10px', background: '#000' }} />
                      : <a key={url} href={url} target="_blank" rel="noopener noreferrer"><img src={url} alt={`Contoh konten ${item.brand}`} style={{ width: '100%', aspectRatio: '9/16', objectFit: 'cover', borderRadius: '10px' }} /></a>
                  ))}
                </div>
              )}
              {creators.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--lime)', color: 'var(--on-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.66rem' }}>{i + 1}</span>
                  <span style={{ fontWeight: 700, color: '#fff' }}>{c.name}</span>
                  {c.views && <span>{c.views} views</span>}
                  {c.likes && <span>{c.likes} likes</span>}
                  {c.postLink && (
                    <a href={c.postLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--lime)', textDecoration: 'none' }}>
                      Lihat postingan <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              ))}
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

      <style>{`
        @media (max-width: 900px) {
          .portfolio-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
