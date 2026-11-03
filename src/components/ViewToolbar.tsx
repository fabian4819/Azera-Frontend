import { useState } from 'react';
import { Columns3, RotateCcw, Undo2 } from 'lucide-react';

interface Props {
  columns: { id: string; label: string; visible: boolean }[];
  onToggleColumn: (id: string) => void;
  onShowAll: () => void;
  canUndo: boolean;
  onUndo: () => void;
  /** Ada urutan/filter/kolom tersembunyi yang beda dari bawaan */
  canReset: boolean;
  onReset: () => void;
}

const btn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '5px', height: '36px', padding: '0 12px', borderRadius: '10px',
  border: '1.5px solid #e1e0ff', background: 'white', color: '#464652', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700,
  fontFamily: 'var(--font-display)', whiteSpace: 'nowrap',
};

/** Undo, reset tampilan & pilih kolom yang tampil, dipakai tabel Creators dan SheetGrid. */
export default function ViewToolbar({ columns, onToggleColumn, onShowAll, canUndo, onUndo, canReset, onReset }: Props) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const hiddenCount = columns.filter((c) => !c.visible).length;
  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
      <button type="button" onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl/⌘+Z)"
        style={{ ...btn, opacity: canUndo ? 1 : 0.45, cursor: canUndo ? 'pointer' : 'default' }}>
        <Undo2 size={14} /> Undo
      </button>
      <button type="button" onClick={onReset} disabled={!canReset} title="Kembalikan urutan, filter & kolom ke semula"
        style={{ ...btn, opacity: canReset ? 1 : 0.45, cursor: canReset ? 'pointer' : 'default', color: canReset ? '#6728e4' : '#464652' }}>
        <RotateCcw size={14} /> Reset tampilan
      </button>
      <button type="button" onClick={(e) => setRect(e.currentTarget.getBoundingClientRect())} aria-haspopup="dialog"
        style={{ ...btn, ...(hiddenCount ? { borderColor: '#6728e4', color: '#6728e4' } : {}) }}>
        <Columns3 size={14} /> Kolom{hiddenCount ? ` (${hiddenCount} disembunyikan)` : ''}
      </button>
      {rect && (
        <>
          <div onClick={() => setRect(null)} style={{ position: 'fixed', inset: 0, zIndex: 200 }} />
          <div role="dialog" aria-label="Tampilkan kolom" onKeyDown={(e) => { if (e.key === 'Escape') setRect(null); }}
            style={{ position: 'fixed', top: rect.bottom + 4, left: Math.max(8, Math.min(rect.right - 240, window.innerWidth - 248)), width: 240, maxHeight: `calc(100vh - ${rect.bottom + 16}px)`, overflowY: 'auto', zIndex: 201, background: 'white', borderRadius: '10px', border: '1px solid #e1e0ff', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '6px', fontFamily: 'var(--font-display)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px 6px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#777683' }}>Kolom yang tampil</span>
              {hiddenCount > 0 && <button type="button" onClick={onShowAll} style={{ background: 'none', border: 'none', color: '#6728e4', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, padding: 0 }}>Tampilkan semua</button>}
            </div>
            {columns.map((c) => (
              <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 8px', fontSize: '0.78rem', color: '#464652', cursor: 'pointer' }}>
                <input type="checkbox" checked={c.visible} onChange={() => onToggleColumn(c.id)} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.label}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
