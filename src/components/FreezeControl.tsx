import { useState } from 'react';
import { Snowflake } from 'lucide-react';

import type { Freeze } from '../hooks/useFreeze';

const OPTIONS = [0, 1, 2, 3, 4, 5];

/** Tombol "Bekukan" + popover pilih jumlah kolom & baris yang dibekukan. */
export default function FreezeControl({ freeze, onChange, maxCols, showRows = true }: {
  freeze: Freeze; onChange: (f: Freeze) => void; maxCols?: number; showRows?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const active = freeze.cols > 0 || freeze.rows > 0;
  const select: React.CSSProperties = { padding: '6px 8px', borderRadius: '8px', border: '1.5px solid #e1e0ff', fontSize: '0.8rem', background: 'white', cursor: 'pointer' };
  const cols = OPTIONS.filter((n) => maxCols === undefined || n <= maxCols);
  return (
    <div style={{ position: 'relative' }}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} title="Bekukan kolom & baris"
        style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '36px', padding: '0 12px', borderRadius: '10px', border: '1.5px solid #e1e0ff', background: active ? '#f0eeff' : 'white', color: '#464652', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
        <Snowflake size={14} /> Bekukan
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 50 }} />
          <div role="dialog" aria-label="Bekukan kolom dan baris"
            style={{ position: 'absolute', right: 0, top: '42px', zIndex: 51, width: '230px', background: 'white', borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,.18)', padding: '12px', fontFamily: 'var(--font-display)' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', fontSize: '0.8rem', marginBottom: showRows ? '10px' : 0 }}>
              Kolom dibekukan
              <select style={select} value={freeze.cols} onChange={(e) => onChange({ ...freeze, cols: Number(e.target.value) })}>
                {cols.map((n) => <option key={n} value={n}>{n === 0 ? 'Tidak ada' : `${n} kolom`}</option>)}
              </select>
            </label>
            {showRows && (
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', fontSize: '0.8rem' }}>
                Baris dibekukan
                <select style={select} value={freeze.rows} onChange={(e) => onChange({ ...freeze, rows: Number(e.target.value) })}>
                  {OPTIONS.map((n) => <option key={n} value={n}>{n === 0 ? 'Tidak ada' : `${n} baris`}</option>)}
                </select>
              </label>
            )}
            <p style={{ fontSize: '0.7rem', color: '#8a8a99', marginTop: '10px', lineHeight: 1.5 }}>Header selalu tetap di atas. Pilihan ini tersimpan di browser ini.</p>
          </div>
        </>
      )}
    </div>
  );
}
