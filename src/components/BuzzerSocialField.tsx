import ApplySocialField from './ApplySocialField';
import { PLATFORM_LABELS } from '../lib/applyForm';

const font = 'var(--font-display)';
export interface SocialDraft { username: string; followers: string }

/** Campaign buzzer: creator pilih mau daftar berapa akun (1..max) di platform ini, lalu isi tiap akun.
 * Tanpa onChange = preview read-only di builder admin. */
export default function BuzzerSocialField({ platform, max, minFollowers, accounts, onChange }: {
  platform: string; max: number; minFollowers?: number | string; accounts: SocialDraft[]; onChange?: (accounts: SocialDraft[]) => void;
}) {
  const name = PLATFORM_LABELS[platform] ?? platform;
  const count = Math.max(1, accounts.length);
  const setCount = (n: number) => onChange?.(Array.from({ length: n }, (_, i) => accounts[i] ?? { username: '', followers: '' }));
  return (
    <div style={{ display: 'grid', gap: '10px' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: font, fontSize: '0.84rem', fontWeight: 600, color: '#191c20', flexWrap: 'wrap' }}>
        Mau daftar berapa akun {name}?
        <select value={count} disabled={!onChange} onChange={(e) => setCount(Number(e.target.value))}
          style={{ padding: '8px 12px', borderRadius: '10px', border: '1.5px solid #c7c8cf', fontFamily: font, fontSize: '0.85rem', background: 'white' }}>
          {Array.from({ length: max }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1} akun</option>)}
        </select>
        <span style={{ fontWeight: 400, color: '#777683', fontSize: '0.76rem' }}>(maks. {max})</span>
      </label>
      {Array.from({ length: onChange ? count : 1 }, (_, i) => (
        <div key={i}>
          {count > 1 && <p style={{ fontFamily: font, fontSize: '0.76rem', fontWeight: 700, color: '#6728e4', margin: '0 0 4px' }}>Akun {i + 1}</p>}
          <ApplySocialField platform={platform} minFollowers={minFollowers} username={accounts[i]?.username} followers={accounts[i]?.followers}
            onChange={onChange ? (patch) => onChange(Array.from({ length: count }, (_, j) => (j === i ? { ...(accounts[j] ?? { username: '', followers: '' }), ...patch } : accounts[j] ?? { username: '', followers: '' }))) : undefined} />
        </div>
      ))}
    </div>
  );
}
