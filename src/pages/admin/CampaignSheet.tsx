import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowDownAZ, ArrowDownZA, ArrowLeft, ExternalLink, ListFilter, RefreshCw, Search, X } from 'lucide-react';
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

const isEmpty = (v?: Cell) => v === undefined || v === '';
/** Angka dibanding numerik, teks natural (A2 < A10); sel kosong selalu di bawah seperti Sheets. */
function compareCells(x: Cell | undefined, y: Cell | undefined, dir: 1 | -1): number {
  if (isEmpty(x) || isEmpty(y)) return Number(isEmpty(x)) - Number(isEmpty(y));
  if (typeof x === 'number' && typeof y === 'number') return dir * (x - y);
  return dir * String(x).localeCompare(String(y), 'id', { numeric: true, sensitivity: 'base' });
}

interface FilterMenuProps {
  header: string;
  rect: DOMRect;
  values: { key: string; count: number }[];
  hidden: Set<string>;
  sortDir: 1 | -1 | null;
  onSort: (dir: 1 | -1) => void;
  onApply: (hidden: Set<string>) => void;
  onClose: () => void;
}

/** Dropdown filter kolom ala Google Sheets: urutkan A→Z / Z→A + filter berdasarkan nilai. */
function FilterMenu({ header, rect, values, hidden, sortDir, onSort, onApply, onClose }: FilterMenuProps) {
  const [draft, setDraft] = useState(() => new Set(hidden));
  const [search, setSearch] = useState('');
  const shown = values.filter((v) => v.key.toLowerCase().includes(search.trim().toLowerCase()));
  const toggle = (k: string) => setDraft((d) => { const n = new Set(d); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  const setShown = (hide: boolean) => setDraft((d) => { const n = new Set(d); shown.forEach((v) => (hide ? n.add(v.key) : n.delete(v.key))); return n; });

  const W = 260;
  const item: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '7px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#202124', textAlign: 'left' };
  const link: React.CSSProperties = { background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', fontSize: '0.75rem', padding: 0 };
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 50 }} />
      <div role="dialog" aria-label={`Filter kolom ${header}`} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
        style={{ position: 'fixed', top: Math.min(rect.bottom + 4, window.innerHeight - 420), left: Math.max(8, Math.min(rect.left, window.innerWidth - W - 8)), width: W, zIndex: 51, background: 'white', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,.18)', fontFamily: 'Arial, Helvetica, sans-serif', padding: '6px 0' }}>
        <button type="button" style={{ ...item, fontWeight: sortDir === 1 ? 700 : 400 }} onClick={() => onSort(1)}><ArrowDownAZ size={15} /> Urutkan A → Z</button>
        <button type="button" style={{ ...item, fontWeight: sortDir === -1 ? 700 : 400 }} onClick={() => onSort(-1)}><ArrowDownZA size={15} /> Urutkan Z → A</button>
        <div style={{ borderTop: `1px solid ${GRID}`, margin: '6px 0' }} />
        <div style={{ padding: '0 12px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5f6368', marginBottom: '6px' }}>Filter menurut nilai</p>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '6px' }}>
            <button type="button" style={link} onClick={() => setShown(false)}>Pilih semua</button>
            <button type="button" style={link} onClick={() => setShown(true)}>Hapus</button>
            <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#9a99a6' }}>{values.length - draft.size}/{values.length}</span>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', border: `1px solid ${GRID}`, borderRadius: '6px', padding: '0 8px', height: '30px' }}>
            <Search size={13} color="#777683" />
            <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nilai…" aria-label="Cari nilai"
              style={{ border: 'none', outline: 'none', fontSize: '0.78rem', flex: 1, minWidth: 0 }} />
          </label>
          <div style={{ maxHeight: '200px', overflowY: 'auto', margin: '6px 0' }}>
            {shown.length === 0 ? <p style={{ fontSize: '0.75rem', color: '#9a99a6', padding: '8px 0' }}>Tidak ada nilai.</p> : shown.map((v) => (
              <label key={v.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', fontSize: '0.78rem', color: '#202124', cursor: 'pointer' }}>
                <input type="checkbox" checked={!draft.has(v.key)} onChange={() => toggle(v.key)} />
                <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontStyle: v.key ? 'normal' : 'italic' }}>{v.key || '(Kosong)'}</span>
                <span style={{ color: '#9a99a6', fontSize: '0.7rem' }}>{v.count}</span>
              </label>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '8px 12px 4px', borderTop: `1px solid ${GRID}` }}>
          <button type="button" onClick={onClose} style={{ padding: '6px 14px', borderRadius: '6px', border: `1px solid ${GRID}`, background: 'white', cursor: 'pointer', fontSize: '0.78rem' }}>Batal</button>
          <button type="button" onClick={() => onApply(draft)} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: '#6728e4', color: 'white', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>OK</button>
        </div>
      </div>
    </>
  );
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
  // Filter & sort per kolom; `hidden` = nilai yang disembunyikan per index kolom
  const [sort, setSort] = useState<{ col: number; dir: 1 | -1 } | null>(null);
  const [hidden, setHidden] = useState<Record<number, Set<string>>>({});
  const [menu, setMenu] = useState<{ col: number; rect: DOMRect } | null>(null);
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
    clearFilters();
  };

  const clearFilters = () => {
    setSort(null);
    setHidden({});
    setMenu(null);
  };

  const refresh = () => {
    setCache({});
    setSelected(null);
    setError('');
  };

  // Nomor baris asli (baris 1 = header, sama dgn sheet) tetap dipakai walau difilter
  const activeFilters = Object.entries(hidden).filter(([, s]) => s.size > 0).map(([ci, s]) => [Number(ci), s] as const);
  const filtered = Boolean(query.trim()) || activeFilters.length > 0;
  const rows = useMemo(() => {
    let out = (view?.rows ?? []).map((r, i) => ({ r, no: i + 2 }));
    const q = query.trim().toLowerCase();
    if (q) out = out.filter(({ r }) => r.some((c) => String(c).toLowerCase().includes(q)));
    const active = Object.entries(hidden).filter(([, s]) => s.size > 0);
    if (active.length) out = out.filter(({ r }) => active.every(([ci, s]) => !s.has(String(r[Number(ci)] ?? ''))));
    if (sort) out = [...out].sort((a, b) => compareCells(a.r[sort.col], b.r[sort.col], sort.dir));
    return out;
  }, [view, query, hidden, sort]);

  // Nilai unik + jumlahnya untuk kolom yang dropdown-nya sedang dibuka
  const menuValues = useMemo(() => {
    if (!menu || !view) return [];
    const counts = new Map<string, { v: Cell; count: number }>();
    view.rows.forEach((r) => {
      const v = r[menu.col] ?? '';
      const k = String(v);
      const e = counts.get(k);
      if (e) e.count++; else counts.set(k, { v, count: 1 });
    });
    return [...counts.entries()].sort((a, b) => compareCells(a[1].v, b[1].v, 1)).map(([key, { count }]) => ({ key, count }));
  }, [menu, view]);

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{h}</span>
                      {(() => {
                        const on = Boolean(hidden[ci]?.size) || sort?.col === ci;
                        const SortIcon = sort?.col === ci ? (sort.dir === 1 ? ArrowDownAZ : ArrowDownZA) : ListFilter;
                        return (
                          <button type="button" aria-label={`Filter & urutkan ${h}`} title="Filter & urutkan"
                            onClick={(e) => { e.stopPropagation(); setMenu({ col: ci, rect: e.currentTarget.getBoundingClientRect() }); }}
                            style={{ flexShrink: 0, width: '22px', height: '22px', borderRadius: '4px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? '#6728e4' : 'transparent', color: on ? 'white' : '#5f6368' }}>
                            {hidden[ci]?.size ? <ListFilter size={13} /> : <SortIcon size={13} />}
                          </button>
                        );
                      })()}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td style={rowNoStyle}>2</td>
                  <td colSpan={view.headers.length} style={{ ...cellBase, maxWidth: 'none', color: '#777683', padding: '28px 16px' }}>
                    {filtered ? 'Tidak ada baris yang cocok dengan pencarian/filter.' : tab.empty}
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
            {view.totals && rows.length > 0 && !filtered && (
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
          {filtered ? `${rows.length} dari ${view.rows.length} baris` : `${view.rows.length} baris`} · Data langsung dari database — sama dengan yang disinkron ke Google Sheets.
          {(activeFilters.length > 0 || sort) && (
            <button type="button" onClick={clearFilters} style={{ marginLeft: '8px', display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'none', border: 'none', color: '#6728e4', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, padding: 0 }}>
              <X size={12} /> Hapus filter & urutan
            </button>
          )}
        </p>
      )}

      {menu && view && (
        <FilterMenu key={menu.col} header={view.headers[menu.col]} rect={menu.rect} values={menuValues}
          hidden={hidden[menu.col] ?? new Set()} sortDir={sort?.col === menu.col ? sort.dir : null}
          onSort={(dir) => { setSort({ col: menu.col, dir }); setMenu(null); }}
          onApply={(h) => { setHidden((prev) => ({ ...prev, [menu.col]: h })); setSelected(null); setMenu(null); }}
          onClose={() => setMenu(null)} />
      )}
    </div>
  );
}
