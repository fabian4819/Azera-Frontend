import { useState } from 'react';

const font = 'var(--font-display)';
export interface Option { id: string; label: string; sub?: string }

/** Dropdown checklist (native <details>) dengan cari + pilih semua */
export default function ChecklistDropdown({ placeholder, options, selected, onChange, disabled }: { placeholder: string; options: Option[]; selected: string[]; onChange: (ids: string[]) => void; disabled?: boolean }) {
  const [q, setQ] = useState('');
  const shown = options.filter((o) => `${o.label} ${o.sub ?? ''}`.toLowerCase().includes(q.toLowerCase()));
  const allShown = shown.length > 0 && shown.every((o) => selected.includes(o.id));
  const toggle = (id: string) => onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  const toggleAll = () =>
    onChange(allShown ? selected.filter((s) => !shown.some((o) => o.id === s)) : [...new Set([...selected, ...shown.map((o) => o.id)])]);

  return (
    <details style={{ marginTop: '10px', border: '1.5px solid #c7c8cf', borderRadius: '12px', background: disabled ? '#f3f3f6' : 'white', pointerEvents: disabled ? 'none' : undefined, opacity: disabled ? 0.7 : 1 }}>
      <summary style={{ padding: '10px 14px', cursor: 'pointer', fontSize: '0.82rem', fontFamily: font, color: selected.length ? '#191c20' : '#777683' }}>
        {selected.length ? `${selected.length} dipilih` : placeholder}
      </summary>
      <div style={{ borderTop: '1px solid #e1e0ff', padding: '10px 14px' }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari..." style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #c7c8cf', fontSize: '0.8rem', fontFamily: font, marginBottom: '6px' }} />
        {options.length === 0 ? (
          <p style={{ fontSize: '0.78rem', color: '#9a99a6', fontFamily: font, padding: '6px 0' }}>Tidak ada data.</p>
        ) : (
          <>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: '32px', fontSize: '0.8rem', fontWeight: 700, color: '#6728e4', fontFamily: font, cursor: 'pointer' }}>
              <input type="checkbox" checked={allShown} onChange={toggleAll} style={{ accentColor: '#6728e4' }} /> Pilih semua{q && ' (hasil cari)'}
            </label>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {shown.map((o) => (
                <label key={o.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: '32px', fontSize: '0.82rem', fontFamily: font, cursor: 'pointer' }}>
                  <input type="checkbox" checked={selected.includes(o.id)} onChange={() => toggle(o.id)} style={{ accentColor: '#6728e4' }} />
                  <span style={{ color: '#191c20' }}>{o.label}</span>
                  {o.sub && <span style={{ color: '#9a99a6', fontSize: '0.74rem' }}>{o.sub}</span>}
                </label>
              ))}
            </div>
          </>
        )}
      </div>
    </details>
  );
}
