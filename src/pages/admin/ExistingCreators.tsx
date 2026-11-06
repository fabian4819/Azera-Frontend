import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Upload } from 'lucide-react';
import api from '../../lib/api';

const f = "var(--font-display)";
const card: React.CSSProperties = { background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e1e0ff', boxShadow: '0 2px 12px rgba(107,46,232,0.05)' };
const td: React.CSSProperties = { padding: '9px 12px', whiteSpace: 'nowrap', borderBottom: '1px solid #f0f0f5' };
const input: React.CSSProperties = { padding: '9px 14px', borderRadius: '10px', border: '1.5px solid #e1e0ff', fontFamily: f, fontSize: '0.82rem', background: 'white' };

interface Social { username?: string; url?: string; followers?: number }
interface ExistingCreator {
  _id: string; name: string; phone?: string; age?: number; domicile?: string; gender?: string; niches: string[];
  instagram?: Social; tiktok?: Social; approval?: string;
}
interface ListResponse { items: ExistingCreator[]; total: number; page: number; pageSize: number; niches: string[] }

const num = (n?: number) => (n === undefined || n === null ? '' : n.toLocaleString('id-ID'));

function SocialCell({ s, prefix }: { s?: Social; prefix: string }) {
  if (!s?.username && !s?.url) return <span style={{ color: '#c7c8cf' }}>-</span>;
  const href = s.url || `https://${prefix}${s.username}`;
  return (
    <span>
      <a href={href} target="_blank" rel="noreferrer" style={{ color: '#6B2EE8', fontWeight: 600 }}>@{s.username || 'profil'}</a>
      {s.followers !== undefined && <span style={{ color: '#777683' }}> · {num(s.followers)}</span>}
    </span>
  );
}

/** Creator kurasi hasil Import Data (sudah pernah ikut campaign sebelum ada platform), terpisah dari Creators. */
export default function ExistingCreators() {
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [niche, setNiche] = useState('');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ListResponse | null>(null);
  const [error, setError] = useState('');

  // Ketik dulu, cari setelah berhenti 300ms
  useEffect(() => {
    const t = window.setTimeout(() => { setQuery(q.trim()); setPage(1); }, 300);
    return () => window.clearTimeout(t);
  }, [q]);

  useEffect(() => {
    let alive = true;
    api.get('/admin/existing-creators', { params: { q: query, niche, sort, page } })
      .then((res) => { if (alive) { setData(res.data); setError(''); } })
      .catch(() => { if (alive) setError('Data gagal dimuat. Coba muat ulang.'); });
    return () => { alive = false; };
  }, [query, niche, sort, page]);

  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;
  return (
    <div>
      <div style={{ ...card, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <label style={{ ...input, display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 260px', minWidth: 0 }}>
          <Search size={14} color="#777683" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama, No WA, username, domisili, approval…" aria-label="Cari creator"
            style={{ border: 'none', outline: 'none', flex: 1, minWidth: 0, fontFamily: f, fontSize: '0.82rem' }} />
        </label>
        <select value={niche} onChange={(e) => { setNiche(e.target.value); setPage(1); }} aria-label="Filter niche" style={input}>
          <option value="">Semua niche</option>
          {(data?.niches ?? []).map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} aria-label="Urutkan" style={input}>
          <option value="name">Urut nama</option>
          <option value="tiktok">Followers TikTok terbanyak</option>
          <option value="ig">Followers IG terbanyak</option>
          <option value="newest">Terbaru diimport</option>
        </select>
        <Link to="/admin/import" className="btn-primary" style={{ padding: '9px 16px', fontSize: '0.8rem', textDecoration: 'none' }}><Upload size={14} /> Import Data</Link>
      </div>

      <div style={card}>
        <p style={{ fontFamily: f, fontSize: '0.82rem', color: '#464652', marginBottom: '12px' }}>
          {data ? `${data.total.toLocaleString('id-ID')} creator` : 'Memuat…'} · creator kurasi yang sudah pernah ikut campaign sebelum ada platform (dari Import Data)
        </p>
        {error && <p style={{ color: '#ba1a1a', fontSize: '0.82rem', fontFamily: f }}>{error}</p>}
        {data && data.total === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#777683', fontFamily: f, fontSize: '0.85rem' }}>
            {query || niche ? 'Tidak ada creator yang cocok.' : <>Belum ada data. Import dulu lewat menu <Link to="/admin/import" style={{ color: '#6B2EE8' }}>Import Data</Link>.</>}
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', fontFamily: f }}>
              <thead>
                <tr style={{ textAlign: 'left', background: '#f8f9ff' }}>
                  {['Nama', 'Niche', 'Umur', 'Domisili', 'Gender', 'No WA', 'Instagram', 'TikTok', 'Approval'].map((h) => <th key={h} style={{ ...td, fontWeight: 700 }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {(data?.items ?? []).map((c) => (
                  <tr key={c._id}>
                    <td style={{ ...td, fontWeight: 600 }}>{c.name}</td>
                    <td style={td}>{c.niches.join(', ') || '-'}</td>
                    <td style={td}>{c.age ?? '-'}</td>
                    <td style={td}>{c.domicile || '-'}</td>
                    <td style={td}>{c.gender || '-'}</td>
                    <td style={td}>{c.phone ? <a href={`https://wa.me/${c.phone}`} target="_blank" rel="noreferrer" style={{ color: '#065F46' }}>+{c.phone}</a> : <span style={{ color: '#c7c8cf' }}>-</span>}</td>
                    <td style={td}><SocialCell s={c.instagram} prefix="instagram.com/" /></td>
                    <td style={td}><SocialCell s={c.tiktok} prefix="tiktok.com/@" /></td>
                    <td style={{ ...td, whiteSpace: 'normal', minWidth: '160px' }}>{c.approval || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '14px', fontFamily: f, fontSize: '0.8rem' }}>
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} style={{ ...input, cursor: 'pointer', opacity: page <= 1 ? 0.4 : 1 }}>‹ Sebelumnya</button>
            <span>Halaman {page} / {pages}</span>
            <button type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)} style={{ ...input, cursor: 'pointer', opacity: page >= pages ? 0.4 : 1 }}>Berikutnya ›</button>
          </div>
        )}
      </div>
    </div>
  );
}
