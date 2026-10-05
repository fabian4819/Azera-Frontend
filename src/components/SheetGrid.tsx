import { useMemo, useRef, useState, type ReactNode } from 'react';
import { ArrowDownAZ, ArrowDownZA, ListFilter, Pencil, Plus, Search, Upload, X } from 'lucide-react';

export type Cell = string | number;
export type CellKind = 'text' | 'number' | 'date' | 'link' | 'file';

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
  /** Pengaturan kolom (admin) — tampil di atas opsi urut/filter */
  extra?: ReactNode;
}

/** Dropdown filter kolom ala Google Sheets: urutkan A→Z / Z→A + filter berdasarkan nilai. */
function FilterMenu({ header, rect, values, hidden, sortDir, onSort, onApply, onClose, extra }: FilterMenuProps) {
  const [draft, setDraft] = useState(() => new Set(hidden));
  const [search, setSearch] = useState('');
  const shown = values.filter((v) => v.key.toLowerCase().includes(search.trim().toLowerCase()));
  const toggle = (k: string) => setDraft((d) => { const n = new Set(d); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  const setShown = (hide: boolean) => setDraft((d) => { const n = new Set(d); shown.forEach((v) => (hide ? n.add(v.key) : n.delete(v.key))); return n; });

  const W = extra ? 300 : 260;
  const top = Math.max(8, Math.min(rect.bottom + 4, window.innerHeight - 420));
  const item: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '7px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#202124', textAlign: 'left' };
  const link: React.CSSProperties = { background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', fontSize: '0.75rem', padding: 0 };
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 50 }} />
      <div role="dialog" aria-label={`Filter kolom ${header}`} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
        style={{ position: 'fixed', top, left: Math.max(8, Math.min(rect.left, window.innerWidth - W - 8)), width: W, maxHeight: `calc(100vh - ${top + 8}px)`, overflowY: 'auto', zIndex: 51, background: 'white', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,.18)', fontFamily: 'Arial, Helvetica, sans-serif', padding: '6px 0' }}>
        {extra && <>{extra}<div style={{ borderTop: `1px solid ${GRID}`, margin: '6px 0' }} /></>}
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

interface SheetGridProps {
  headers: string[];
  rows: Cell[][];
  totals?: Cell[];
  /** Teks di kiri kotak cari */
  hint?: ReactNode;
  emptyText: string;
  /** Sel progress yang boleh diedit di baris/kolom ini (index asli, bukan index setelah filter) */
  canEdit?: (row: number, col: number) => boolean;
  kindOf?: (col: number) => CellKind | undefined;
  onEdit?: (row: number, col: number, value: string) => Promise<void>;
  onUpload?: (row: number, col: number, files: File[]) => Promise<void>;
  /** Baris yang ditandai (mis. baris milik creator sendiri di portal) */
  highlightRow?: (row: number) => boolean;
  /** Kolom tambahan paling kanan, mis. tombol Approve/Reject */
  actionHeader?: string;
  rowAction?: (row: number) => ReactNode;
  footer?: ReactNode;
  maxHeight?: string;
  /** Admin: pengaturan kolom di dropdown header (nama, sumber data, akses creator, hapus) */
  columnMenu?: (col: number, close: () => void) => ReactNode;
  /** Ikon kecil di header, mis. penanda akses creator */
  headerIcon?: (col: number) => ReactNode;
  /** Admin: isi popover tombol "+" di ujung kanan header (tambah kolom) */
  addColumnMenu?: (close: () => void) => ReactNode;
}

function errorMessage(err: unknown): string {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal menyimpan. Coba lagi.';
}

/** Tabel ala Google Sheets: cari, filter & urutkan per kolom, plus edit sel progress langsung di tabel. */
export default function SheetGrid({
  headers, rows: allRows, totals, hint, emptyText, canEdit, kindOf, onEdit, onUpload, highlightRow, actionHeader, rowAction, footer, maxHeight,
  columnMenu, headerIcon, addColumnMenu,
}: SheetGridProps) {
  const [addMenu, setAddMenu] = useState<DOMRect | null>(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<number | null>(null);
  // Filter & sort per kolom; `hidden` = nilai yang disembunyikan per index kolom
  const [sort, setSort] = useState<{ col: number; dir: 1 | -1 } | null>(null);
  const [hidden, setHidden] = useState<Record<number, Set<string>>>({});
  const [menu, setMenu] = useState<{ col: number; rect: DOMRect } | null>(null);
  const [editing, setEditing] = useState<{ row: number; col: number; value: string } | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const uploadTarget = useRef<{ row: number; col: number } | null>(null);

  const clearFilters = () => {
    setSort(null);
    setHidden({});
    setMenu(null);
  };

  // Nomor baris asli (baris 1 = header, sama dgn sheet) tetap dipakai walau difilter
  const activeFilters = Object.entries(hidden).filter(([, s]) => s.size > 0);
  const filtered = Boolean(query.trim()) || activeFilters.length > 0;
  const rows = useMemo(() => {
    let out = allRows.map((r, i) => ({ r, i, no: i + 2 }));
    const q = query.trim().toLowerCase();
    if (q) out = out.filter(({ r }) => r.some((c) => String(c).toLowerCase().includes(q)));
    const active = Object.entries(hidden).filter(([, s]) => s.size > 0);
    if (active.length) out = out.filter(({ r }) => active.every(([ci, s]) => !s.has(String(r[Number(ci)] ?? ''))));
    if (sort) out = [...out].sort((a, b) => compareCells(a.r[sort.col], b.r[sort.col], sort.dir));
    return out;
  }, [allRows, query, hidden, sort]);

  // Nilai unik + jumlahnya untuk kolom yang dropdown-nya sedang dibuka
  const menuValues = useMemo(() => {
    if (!menu) return [];
    const counts = new Map<string, { v: Cell; count: number }>();
    allRows.forEach((r) => {
      const v = r[menu.col] ?? '';
      const k = String(v);
      const e = counts.get(k);
      if (e) e.count++; else counts.set(k, { v, count: 1 });
    });
    return [...counts.entries()].sort((a, b) => compareCells(a[1].v, b[1].v, 1)).map(([key, { count }]) => ({ key, count }));
  }, [menu, allRows]);

  const numericCols = useMemo(() => {
    const set = new Set<number>();
    headers.forEach((_, ci) => { if (allRows.some((r) => typeof r[ci] === 'number')) set.add(ci); });
    return set;
  }, [headers, allRows]);

  const startEdit = (row: number, col: number) => {
    if (!canEdit?.(row, col) || saving) return;
    if (kindOf?.(col) === 'file') return;
    setActionError('');
    setEditing({ row, col, value: String(allRows[row]?.[col] ?? '') });
  };

  const commit = async () => {
    if (!editing || !onEdit) return;
    const { row, col, value } = editing;
    setEditing(null);
    if (value.trim() === String(allRows[row]?.[col] ?? '')) return;
    setSaving(`${row}:${col}`);
    try {
      await onEdit(row, col, value);
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setSaving(null);
    }
  };

  const pickFiles = (row: number, col: number) => {
    uploadTarget.current = { row, col };
    fileInput.current?.click();
  };

  const onFiles = async (files: FileList | null) => {
    const target = uploadTarget.current;
    if (!target || !files?.length || !onUpload) return;
    setSaving(`${target.row}:${target.col}`);
    setActionError('');
    try {
      await onUpload(target.row, target.col, [...files]);
    } catch (err) {
      setActionError(errorMessage(err));
    } finally {
      setSaving(null);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

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
  const inputType = (k?: CellKind) => (k === 'number' ? 'text' : k === 'date' ? 'date' : k === 'link' ? 'url' : 'text');

  const renderEditableCell = (row: number, col: number, v: Cell) => {
    const kind = kindOf?.(col);
    const editable = canEdit?.(row, col);
    const busy = saving === `${row}:${col}`;
    if (editing && editing.row === row && editing.col === col) {
      return (
        <input
          autoFocus
          type={inputType(kind)}
          inputMode={kind === 'number' ? 'numeric' : undefined}
          value={editing.value}
          aria-label={`Edit ${headers[col]}`}
          placeholder={kind === 'link' ? 'https://...' : undefined}
          onChange={(e) => setEditing({ ...editing, value: e.target.value })}
          onBlur={() => void commit()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); void commit(); }
            if (e.key === 'Escape') setEditing(null);
          }}
          onClick={(e) => e.stopPropagation()}
          style={{ width: '100%', minWidth: '160px', border: '2px solid #1a73e8', borderRadius: '2px', padding: '3px 6px', fontSize: '0.8rem', outline: 'none', fontFamily: 'inherit' }}
        />
      );
    }
    if (kind === 'file') {
      const urls = String(v || '').split(' ').filter(Boolean);
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          {urls.map((u, i) => (
            <a key={u} href={u} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: '#1a73e8' }}>Gambar {i + 1}</a>
          ))}
          {editable && (
            <button type="button" disabled={busy} onClick={(e) => { e.stopPropagation(); pickFiles(row, col); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', border: '1px solid #c9b6f7', background: 'white', color: '#6728e4', borderRadius: '6px', padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
              <Upload size={12} /> {busy ? 'Mengunggah…' : 'Upload'}
            </button>
          )}
        </span>
      );
    }
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: busy ? 0.5 : 1 }}>
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {busy ? 'Menyimpan…' : v === '' && editable ? <span style={{ color: '#9a99a6' }}>Klik untuk isi</span> : renderCell(v)}
        </span>
        {editable && !busy && <Pencil size={11} color="#9a99a6" style={{ flexShrink: 0 }} />}
      </span>
    );
  };

  const colCount = headers.length + (rowAction ? 1 : 0) + (addColumnMenu ? 1 : 0);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '10px' }}>
        <div style={{ color: '#777683', fontSize: '0.8rem', minWidth: 0 }}>{hint}</div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px', height: '36px', border: '1.5px solid #e1e0ff', borderRadius: '10px', background: 'white', flex: '0 1 280px', minWidth: 0 }}>
          <Search size={14} color="#777683" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setSelected(null); }} placeholder="Cari di tabel ini…" aria-label="Cari di tabel"
            style={{ border: 'none', outline: 'none', fontSize: '0.8rem', fontFamily: 'var(--font-display)', flex: 1, minWidth: 0, background: 'transparent' }} />
        </label>
      </div>

      {actionError && (
        <div role="alert" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '10px 14px', marginBottom: '10px', borderRadius: '10px', background: '#ffdad6', color: '#93000a', fontSize: '0.8rem' }}>
          {actionError}
          <button type="button" onClick={() => setActionError('')} aria-label="Tutup pesan" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93000a', display: 'flex' }}><X size={14} /></button>
        </div>
      )}

      <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={(e) => void onFiles(e.target.files)} />

      <div style={{ background: 'white', border: `1px solid ${GRID}`, borderRadius: '10px', overflow: 'auto', maxHeight: maxHeight ?? 'calc(100vh - 300px)', minHeight: '240px' }}>
        <table style={{ borderCollapse: 'separate', borderSpacing: 0, minWidth: '100%', fontFamily: 'Arial, Helvetica, sans-serif' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
            <tr>
              <th style={{ ...rowNoStyle, zIndex: 3 }} />
              {headers.map((_, ci) => (
                <th key={ci} style={{ ...cellBase, background: HEAD_BG, color: '#5f6368', fontWeight: 400, fontSize: '0.72rem', textAlign: 'center', padding: '3px 10px', ...(ci === 0 ? { ...firstColStyle, zIndex: 3 } : {}) }}>
                  {colLetter(ci)}
                </th>
              ))}
              {addColumnMenu && <th style={{ ...cellBase, background: HEAD_BG }} />}
              {rowAction && <th style={{ ...cellBase, background: HEAD_BG }} />}
            </tr>
            <tr>
              <th style={{ ...rowNoStyle, zIndex: 3 }}>1</th>
              {headers.map((h, ci) => {
                const on = Boolean(hidden[ci]?.size) || sort?.col === ci;
                const SortIcon = sort?.col === ci ? (sort.dir === 1 ? ArrowDownAZ : ArrowDownZA) : ListFilter;
                return (
                  <th key={ci} title={h} style={{ ...cellBase, background: '#f3f0ff', fontWeight: 700, textAlign: 'left', ...(ci === 0 ? { ...firstColStyle, zIndex: 3 } : {}) }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{h}</span>
                      {headerIcon?.(ci)}
                      <button type="button" aria-label={`${columnMenu ? 'Atur, filter & urutkan' : 'Filter & urutkan'} ${h}`} title={columnMenu ? 'Atur kolom, filter & urutkan' : 'Filter & urutkan'}
                        onClick={(e) => { e.stopPropagation(); setMenu({ col: ci, rect: e.currentTarget.getBoundingClientRect() }); }}
                        style={{ flexShrink: 0, width: '22px', height: '22px', borderRadius: '4px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? '#6728e4' : 'transparent', color: on ? 'white' : '#5f6368' }}>
                        {hidden[ci]?.size ? <ListFilter size={13} /> : <SortIcon size={13} />}
                      </button>
                    </div>
                  </th>
                );
              })}
              {addColumnMenu && (
                <th style={{ ...cellBase, background: '#f3f0ff', padding: '3px 8px' }}>
                  <button type="button" aria-label="Tambah kolom" title="Tambah kolom"
                    onClick={(e) => setAddMenu(e.currentTarget.getBoundingClientRect())}
                    style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px dashed #c9b6f7', background: 'white', color: '#6728e4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={14} />
                  </button>
                </th>
              )}
              {rowAction && <th style={{ ...cellBase, background: '#f3f0ff', fontWeight: 700, textAlign: 'left', position: 'sticky', right: 0, zIndex: 3 }}>{actionHeader ?? 'Aksi'}</th>}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td style={rowNoStyle}>2</td>
                <td colSpan={colCount} style={{ ...cellBase, maxWidth: 'none', color: '#777683', padding: '28px 16px' }}>
                  {filtered ? 'Tidak ada baris yang cocok dengan pencarian/filter.' : emptyText}
                </td>
              </tr>
            ) : rows.map(({ r, i, no }) => {
              const isSel = selected === no;
              const mark = highlightRow?.(i);
              const bg = isSel ? '#e8f0fe' : mark ? '#fbf8ff' : 'white';
              return (
                <tr key={i} onClick={() => setSelected(isSel ? null : no)}>
                  <td style={{ ...rowNoStyle, background: isSel ? '#d3e3fd' : mark ? '#e9e1ff' : HEAD_BG, color: isSel ? '#0b57d0' : mark ? '#6728e4' : '#5f6368', fontWeight: mark ? 700 : 400 }}>{no}</td>
                  {headers.map((_, ci) => {
                    const v = r[ci] ?? '';
                    const editable = canEdit?.(i, ci);
                    return (
                      <td key={ci} title={String(v)}
                        onClick={editable ? (e) => { e.stopPropagation(); startEdit(i, ci); } : undefined}
                        style={{ ...cellBase, background: editable && !isSel ? '#fffdf2' : bg, cursor: editable ? 'text' : 'default', textAlign: numericCols.has(ci) ? 'right' : 'left', ...(ci === 0 ? firstColStyle : {}) }}>
                        {canEdit ? renderEditableCell(i, ci, v) : renderCell(v)}
                      </td>
                    );
                  })}
                  {addColumnMenu && <td style={{ ...cellBase, background: bg }} />}
                  {rowAction && (
                    <td onClick={(e) => e.stopPropagation()} style={{ ...cellBase, background: bg, position: 'sticky', right: 0, overflow: 'visible' }}>{rowAction(i)}</td>
                  )}
                </tr>
              );
            })}
          </tbody>
          {totals && rows.length > 0 && !filtered && (
            <tfoot style={{ position: 'sticky', bottom: 0, zIndex: 2 }}>
              <tr>
                <td style={{ ...rowNoStyle, borderTop: '2px solid #c7c8cf' }} />
                {totals.map((v, ci) => (
                  <td key={ci} style={{ ...cellBase, borderTop: '2px solid #c7c8cf', background: '#f3f0ff', fontWeight: 700, textAlign: numericCols.has(ci) ? 'right' : 'left', ...(ci === 0 ? firstColStyle : {}) }}>
                    {renderCell(v)}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <p style={{ marginTop: '8px', color: '#9a99a6', fontSize: '0.72rem' }}>
        {filtered ? `${rows.length} dari ${allRows.length} baris` : `${allRows.length} baris`}
        {footer}
        {(activeFilters.length > 0 || sort) && (
          <button type="button" onClick={clearFilters} style={{ marginLeft: '8px', display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'none', border: 'none', color: '#6728e4', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, padding: 0 }}>
            <X size={12} /> Hapus filter & urutan
          </button>
        )}
      </p>

      {menu && (
        <FilterMenu key={menu.col} header={headers[menu.col]} rect={menu.rect} values={menuValues}
          hidden={hidden[menu.col] ?? new Set()} sortDir={sort?.col === menu.col ? sort.dir : null}
          onSort={(dir) => { setSort({ col: menu.col, dir }); setMenu(null); }}
          onApply={(h) => { setHidden((prev) => ({ ...prev, [menu.col]: h })); setSelected(null); setMenu(null); }}
          onClose={() => setMenu(null)}
          extra={columnMenu?.(menu.col, () => setMenu(null))} />
      )}

      {addMenu && addColumnMenu && (
        <>
          <div onClick={() => setAddMenu(null)} style={{ position: 'fixed', inset: 0, zIndex: 50 }} />
          <div role="dialog" aria-label="Tambah kolom" onKeyDown={(e) => { if (e.key === 'Escape') setAddMenu(null); }}
            style={{ position: 'fixed', top: Math.min(addMenu.bottom + 4, window.innerHeight - 320), left: Math.max(8, Math.min(addMenu.right - 260, window.innerWidth - 268)), width: 260, zIndex: 51, background: 'white', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,.18)', padding: '6px 0' }}>
            {addColumnMenu(() => setAddMenu(null))}
          </div>
        </>
      )}
    </div>
  );
}
