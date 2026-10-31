import { Camera, Music2, AtSign, Hash } from 'lucide-react';
import { PLATFORM_LABELS, PLATFORM_PREFIX } from '../lib/applyForm';

const ICONS: Record<string, { icon: typeof Camera; color: string }> = {
  instagram: { icon: Camera, color: '#ff81aa' }, tiktok: { icon: Music2, color: '#10B981' },
  threads: { icon: AtSign, color: '#464652' }, x: { icon: Hash, color: '#191c20' },
};
const font = 'var(--font-display)';
const label: React.CSSProperties = { display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#191c20', marginBottom: '5px', fontFamily: font };
const box: React.CSSProperties = { display: 'flex', alignItems: 'stretch', border: '1.5px solid #c7c8cf', borderRadius: '12px', background: 'white', overflow: 'hidden' };
const bare: React.CSSProperties = { flex: 1, minWidth: 0, width: '100%', border: 'none', outline: 'none', padding: '11px 14px', fontSize: '0.875rem', fontFamily: font, color: '#191c20', background: 'transparent' };

interface Props {
  platform: string;
  minFollowers?: number | string;
  username?: string;
  followers?: string;
  /** Tanpa onChange = preview read-only (builder admin) */
  onChange?: (patch: Partial<{ username: string; followers: string }>) => void;
}

/** Kartu username (dengan prefix link profil) + followers per platform, tampilan sama dengan KOLRegister. */
export default function ApplySocialField({ platform, minFollowers, username = '', followers = '', onChange }: Props) {
  const { icon: Icon, color } = ICONS[platform] ?? { icon: AtSign, color: '#464652' };
  const name = PLATFORM_LABELS[platform] ?? platform;
  const min = Number(minFollowers) || 0;
  return (
    <div style={{ background: '#f8f9ff', border: `1px solid ${color}22`, borderRadius: '16px', padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <Icon size={18} color={color} />
        <p style={{ fontFamily: font, fontWeight: 700, color, fontSize: '0.9rem' }}>{name} *</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '10px' }} className="form-2col">
        <div>
          <span style={label}>Username</span>
          <div style={box}>
            <span style={{ display: 'flex', alignItems: 'center', paddingLeft: '14px', color: '#b7b7c2', fontFamily: font, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{PLATFORM_PREFIX[platform] ?? '@'}</span>
            <input
              aria-label={`Username ${name}`}
              value={username}
              readOnly={!onChange}
              tabIndex={onChange ? undefined : -1}
              onChange={(e) => onChange?.({ username: e.target.value.replace(/^@+/, '') })}
              placeholder="username"
              style={{ ...bare, paddingLeft: '2px', fontWeight: 600 }}
            />
          </div>
        </div>
        <div>
          <span style={label}>Followers{min ? <span style={{ fontWeight: 400, color: '#777683' }}> (min. {min.toLocaleString('id-ID')})</span> : null}</span>
          <div style={box}>
            <input
              aria-label={`Followers ${name}`}
              type="number" min={0} inputMode="numeric"
              value={followers}
              readOnly={!onChange}
              tabIndex={onChange ? undefined : -1}
              onChange={(e) => onChange?.({ followers: e.target.value })}
              placeholder={min ? String(min) : '1000'}
              style={bare}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
