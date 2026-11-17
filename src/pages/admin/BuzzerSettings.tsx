import { PLATFORM_LABELS } from '../../lib/applyForm';
import type { BuzzerDraft } from '../../lib/buzzer';

const font = "var(--font-display)";
const inputStyle: React.CSSProperties = { width: '80px', padding: '8px 10px', borderRadius: '10px', border: '1.5px solid #e1e0ff', fontSize: '0.85rem', fontFamily: font };

/** Campaign buzzer: satu creator boleh daftar beberapa akun per platform (tiap akun = baris sendiri di sheet). */
export default function BuzzerSettings({ platforms, value, onChange }: { platforms: string[]; value: BuzzerDraft; onChange: (v: BuzzerDraft) => void }) {
  if (!platforms.length) return null;
  return (
    <div style={{ marginBottom: '14px', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e1e0ff', background: '#faf9ff' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: font, fontSize: '0.84rem', fontWeight: 700, color: '#191c20', cursor: 'pointer' }}>
        <input type="checkbox" checked={value !== null} onChange={(e) => onChange(e.target.checked ? Object.fromEntries(platforms.map((p) => [p, '3'])) : null)} style={{ accentColor: '#6728e4', width: '16px', height: '16px' }} />
        Campaign Buzzer (1 creator boleh daftar beberapa akun)
      </label>
      {value !== null && (
        <>
          <p style={{ fontFamily: font, fontSize: '0.76rem', color: '#777683', margin: '6px 0 10px' }}>
            Maks akun per platform. Di form, creator pilih mau daftar berapa akun; tiap akun jadi baris sendiri di sheet (fee creator & PIC dihitung per akun lolos). Isi 0 = platform itu tidak ditanya.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {platforms.map((p) => (
              <label key={p} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: font, fontSize: '0.82rem', color: '#464652' }}>
                {PLATFORM_LABELS[p] ?? p} maks
                <input type="number" min={0} max={20} value={value[p] ?? ''} onChange={(e) => onChange({ ...value, [p]: e.target.value })} style={inputStyle} />
                akun
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
