// Gaya sama dengan toggle "Wajib diisi" di CustomFormBuilder.
export default function Switch({ checked, onChange, label, disabled }: {
  checked: boolean; onChange: (checked: boolean) => void; label: string; disabled?: boolean;
}) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: checked ? '#191c20' : '#777683', fontFamily: 'var(--font-display)', fontWeight: 600, cursor: disabled ? 'wait' : 'pointer', flexShrink: 0 }}>
      {label}
      <input type="checkbox" role="switch" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
      <span style={{ width: '36px', height: '20px', borderRadius: '10px', background: checked ? '#c9b6f7' : '#c7c8cf', position: 'relative', transition: 'background .15s', opacity: disabled ? 0.6 : 1 }}>
        <span style={{ position: 'absolute', top: '2px', left: checked ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', background: checked ? '#6728e4' : 'white', boxShadow: '0 1px 3px rgba(0,0,0,.3)', transition: 'left .15s' }} />
      </span>
    </label>
  );
}
