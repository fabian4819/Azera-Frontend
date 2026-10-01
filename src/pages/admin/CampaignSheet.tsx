import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, RefreshCw, Search } from 'lucide-react';
import api from '../../lib/api';
import { SHEET_TABS, type SheetKind } from './sheetTabs';

const f = 'var(--font-display)';

type Cell = string | number;
interface SheetView {
  campaign: { _id: string; name: string; brandName: string | null };
  headers: string[];
  rows: Cell[][];
  totals?: Cell[];
  sheetUrl: string | null;
}

// Warna grid sama dengan Google Sheets supaya terasa familiar
const GRID = '#e2e3e3';
const HEAD_BG = '#f8f9fa';
const ROW_NO_W = 46;

/** A, B, …, Z, AA, AB … — label kolom ala spreadsheet */
const colLetter = (i: number): string => (i < 26 ? String.fromCharCode(65 + i) : colLetter(Math.floor(i / 26) - 1) + colLetter(i % 26));

function renderCell(v: Cell) {
  if (typeof v === 'number') return v.toLocaleString('id-ID');
  if (/^https?:\/\//.test(v)) {
    return <a href={v} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: '#1a73e8' }}>{v}</a>;
  }
  return v;
}

/** Tampilan Master / Report / Recap Payment satu campaign ala Google Sheets, di dalam admin. */
export default function CampaignSheet() {
  const { id } = useParams<{ id: string }>();
  const [params, setParams] = useSearchParams();
  const tab = SHEET_TABS.find((t) => t.kind === params.get('tab')) ?? SHEET_TABS[0];
  const kind = tab.kind;

  // Cache per tab supaya pindah tab instan; tombol refresh mengosongkan cache.
  const [cache, setCache] = useState<Partial<Record<SheetKind, SheetView>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  const view = cache[kind];

  const load = useCallback(async (k: SheetKind) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/admin/campaigns/${id}/sheet/${k}`);
      setCache((c) => ({ ...c, [k]: res.data }));
    } catch {
      setError('Data sheet gagal dimuat. Coba muat ulang.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (cache[kind] || error) return;
    const t = window.setTimeout(() => { void load(kind); }, 0);
    return () => window.clearTimeout(t);
  }, [kind, cache, error, load]);

  const switchTab = (k: SheetKind) => {
    setParams({ tab: k }, { replace: true });
    setQuery('');
    setSelected(null);
    setError('');
  };

  const refresh = () => {
    setCache({});
    setSelected(null);
    setError('');
  };

  // Nomor baris asli (baris 1 = header, sama dgn sheet) tetap dipakai walau difilter
  const rows = useMemo(() => {
    const all = (view?.rows ?? []).map((r, i) => ({ r, no: i + 2 }));
    const q = query.trim().toLowerCase();
    return q ? all.filter(({ r }) => r.some((c) => String(c).toLowerCase().includes(q))) : all;
  }, [view, query]);

  const numericCols = useMemo(() => {
    const set = new Set<number>();
    view?.headers.forEach((_, ci) => { if (view.rows.some((r) => typeof r[ci] === 'number')) set.add(ci); });
    return set;
  }, [view]);

  const campaign = view?.campaign ?? Object.values(cache)[0]?.campaign;

  const cellBase: React.CSSProperties = {
    borderRight: `1px solid ${GRID}`, borderBottom: `1px solid ${GRID}`, padding: '6px 10px',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px', fontSize: '0.8rem', color: '#202124',
  };
  const rowNoStyle: React.CSSProperties = {
    ...cellBase, position: 'sticky', left: 0, zIndex: 1, width: ROW_NO_W, minWidth: ROW_NO_W, textAlign: 'center',
    background: HEAD_BG, color: '#5f6368', fontSize: '0.72rem',
  };
  // Kolom pertama (nama creator) ikut nempel di kiri saat scroll horizontal
  const firstColStyle: React.CSSProperties = { position: 'sticky', left: ROW_NO_W, zIndex: 1 };

  return (
    <div>
      <Link to="/admin/campaign-dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#777683', fontSize: '0.8rem', textDecoration: 'none', fontFamily: f, marginBottom: '12px' }}>
        <ArrowLeft size={14} /> Semua Campaign
      </Link>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '18px' }}>
        <div style={{ minWidth: 0 }}>
          <h2 style={{ fontFamily: f, fontWeight: 800, fontSize: '1.35rem', color: '#191c20' }}>
            {campaign ? <Link to={`/admin/campaigns/${campaign._id}`} title="Buka detail campaign" style={{ color: 'inherit', textDecoration: 'none' }}>{campaign.name}</Link> : 'Memuat…'}
          </h2>
          {campaign && <p style={{ marginTop: '4px', color: '#777683', fontSize: '0.82rem' }}>{campaign.brandName || 'Tanpa brand'}</p>}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" onClick={refresh} disabled={loading} aria-label="Muat ulang data" title="Muat ulang data"
            style={{ width: '38px', height: '38px', borderRadius: '10px', border: '1.5px solid #c7c8cf', background: 'white', color: '#6728e4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: loading ? 0.5 : 1 }}>
            <RefreshCw size={16} />
          </button>
          {view?.sheetUrl && (
            <a href={view.sheetUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 14px', height: '38px', borderRadius: '10px', border: '1.5px solid #c7c8cf', background: 'white', color: '#188038', fontFamily: f, fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
              <ExternalLink size={14} /> Buka di Google Sheets
            </a>
          )}
        </div>
      </div>

      <div role="tablist" style={{ display: 'flex', gap: '4px', borderBottom: '1px solid #e1e0ff', marginBottom: '14px', overflowX: 'auto' }}>
        {SHEET_TABS.map((t) => {
          const active = t.kind === kind;
          const Icon = t.icon;
          const count = cache[t.kind]?.rows.length;
          return (
            <button key={t.kind} role="tab" aria-selected={active} onClick={() => switchTab(t.kind)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: `2.5px solid ${active ? '#6728e4' : 'transparent'}`, marginBottom: '-1px',
                color: active ? '#6728e4' : '#5f6368', fontFamily: f, fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap',
              }}>
              <Icon size={15} /> {t.label}
              {count !== undefined && (
                <span style={{ background: active ? '#e1e0ff' : '#eef0f2', color: active ? '#6728e4' : '#5f6368', borderRadius: '999px', padding: '1px 8px', fontSize: '0.7rem' }}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '10px' }}>
        <p style={{ color: '#777683', fontSize: '0.8rem' }}>{tab.hint}</p>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px', height: '36px', border: '1.5px solid #e1e0ff', borderRadius: '10px', background: 'white', minWidth: '240px' }}>
          <Search size={14} color="#777683" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setSelected(null); }} placeholder="Cari di sheet ini…" aria-label="Cari di sheet"
            style={{ border: 'none', outline: 'none', fontSize: '0.8rem', fontFamily: f, flex: 1, background: 'transparent' }} />
        </label>
      </div>

      {error ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#ba1a1a', background: 'white', borderRadius: '12px', border: '1px solid #ffdad6' }}>{error}</div>
      ) : !view ? (
        <div style={{ textAlign: 'center', padding: '70px', color: '#777683', background: 'white', borderRadius: '12px', border: `1px solid ${GRID}` }}>Memuat sheet…</div>
      ) : (
        <div style={{ background: 'white', border: `1px solid ${GRID}`, borderRadius: '10px', overflow: 'auto', maxHeight: 'calc(100vh - 300px)', minHeight: '240px' }}>
          <table style={{ borderCollapse: 'separate', borderSpacing: 0, minWidth: '100%', fontFamily: 'Arial, Helvetica, sans-serif' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
              <tr>
                <th style={{ ...rowNoStyle, zIndex: 3 }} />
                {view.headers.map((_, ci) => (
                  <th key={ci} style={{ ...cellBase, background: HEAD_BG, color: '#5f6368', fontWeight: 400, fontSize: '0.72rem', textAlign: 'center', padding: '3px 10px', ...(ci === 0 ? { ...firstColStyle, zIndex: 3 } : {}) }}>
                    {colLetter(ci)}
                  </th>
                ))}
              </tr>
              <tr>
                <th style={{ ...rowNoStyle, zIndex: 3 }}>1</th>
                {view.headers.map((h, ci) => (
                  <th key={ci} title={h} style={{ ...cellBase, background: '#f3f0ff', fontWeight: 700, textAlign: 'left', ...(ci === 0 ? { ...firstColStyle, zIndex: 3 } : {}) }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td style={rowNoStyle}>2</td>
                  <td colSpan={view.headers.length} style={{ ...cellBase, maxWidth: 'none', color: '#777683', padding: '28px 16px' }}>
                    {query ? `Tidak ada baris yang cocok dengan "${query}".` : tab.empty}
                  </td>
                </tr>
              ) : rows.map(({ r, no }) => {
                const isSel = selected === no;
                return (
                  <tr key={no} onClick={() => setSelected(isSel ? null : no)}>
                    <td style={{ ...rowNoStyle, background: isSel ? '#d3e3fd' : HEAD_BG, color: isSel ? '#0b57d0' : '#5f6368' }}>{no}</td>
                    {view.headers.map((_, ci) => {
                      const v = r[ci] ?? '';
                      return (
                        <td key={ci} title={String(v)} style={{ ...cellBase, background: isSel ? '#e8f0fe' : 'white', textAlign: numericCols.has(ci) ? 'right' : 'left', ...(ci === 0 ? firstColStyle : {}) }}>
                          {renderCell(v)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
            {view.totals && rows.length > 0 && !query && (
              <tfoot style={{ position: 'sticky', bottom: 0, zIndex: 2 }}>
                <tr>
                  <td style={{ ...rowNoStyle, borderTop: '2px solid #c7c8cf' }} />
                  {view.totals.map((v, ci) => (
                    <td key={ci} style={{ ...cellBase, borderTop: '2px solid #c7c8cf', background: '#f3f0ff', fontWeight: 700, textAlign: numericCols.has(ci) ? 'right' : 'left', ...(ci === 0 ? firstColStyle : {}) }}>
                      {renderCell(v)}
                    </td>
                  ))}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}

      {view && (
        <p style={{ marginTop: '8px', color: '#9a99a6', fontSize: '0.72rem' }}>
          {query ? `${rows.length} dari ${view.rows.length} baris` : `${view.rows.length} baris`} · Data langsung dari database — sama dengan yang disinkron ke Google Sheets.
        </p>
      )}
    </div>
  );
}
