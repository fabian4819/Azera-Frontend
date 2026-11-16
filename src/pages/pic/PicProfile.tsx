import { useEffect, useState } from 'react';
import { Save, Landmark, UserRound } from 'lucide-react';
import picApi from '../../lib/picApi';

const f = "var(--font-display)";
const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '22px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)',
};
const labelStyle: React.CSSProperties = { display: 'block', fontFamily: f, fontSize: '0.78rem', fontWeight: 600, color: '#464652', marginBottom: '6px' };
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e1e0ff', fontSize: '0.88rem',
  fontFamily: f, color: '#191c20', outline: 'none', background: 'white',
};

interface Profile {
  name: string; email: string; city?: string; ownerName?: string; position?: string; phone: string;
  backupPhone?: string; socialMedia?: string; portfolio?: string;
  paymentInfo?: { methodName?: string; accountNumber?: string; accountName?: string; updatedAt?: string };
}
type ProfileForm = Required<Pick<Profile, 'city' | 'ownerName' | 'position' | 'phone' | 'backupPhone' | 'socialMedia' | 'portfolio'>>;
type PaymentForm = { methodName: string; accountNumber: string; accountName: string };

const PROFILE_LABELS: [keyof ProfileForm, string, string][] = [
  ['ownerName', 'Nama PIC', 'Nama lengkap'],
  ['position', 'Jabatan', 'Owner / Admin'],
  ['city', 'Kota Management/Agency', 'Jakarta'],
  ['phone', 'Nomor WhatsApp *', '08xxxxxxxxxx'],
  ['backupPhone', 'WhatsApp Cadangan', '08xxxxxxxxxx'],
  ['socialMedia', 'Sosmed Agency', '@agency'],
  ['portfolio', 'Link Portfolio', 'https://...'],
];

/** PIC ubah data sendiri: profil & rekening/e-wallet untuk pembayaran fee PIC. */
export default function PicProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<ProfileForm | null>(null);
  const [pay, setPay] = useState<PaymentForm>({ methodName: '', accountNumber: '', accountName: '' });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const fill = (p: Profile) => {
    setProfile(p);
    setForm({ city: p.city || '', ownerName: p.ownerName || '', position: p.position || '', phone: p.phone || '', backupPhone: p.backupPhone || '', socialMedia: p.socialMedia || '', portfolio: p.portfolio || '' });
    setPay({ methodName: p.paymentInfo?.methodName || '', accountNumber: p.paymentInfo?.accountNumber || '', accountName: p.paymentInfo?.accountName || '' });
  };

  useEffect(() => {
    picApi.get('/pic/me').then((r) => fill(r.data)).catch(() => setStatus({ ok: false, text: 'Gagal memuat profil.' }));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (!form.phone.trim()) { setStatus({ ok: false, text: 'Nomor WhatsApp wajib diisi.' }); return; }
    setSaving(true);
    setStatus(null);
    try {
      const res = await picApi.patch('/pic/me', { ...form, paymentInfo: pay });
      fill(res.data);
      setStatus({ ok: true, text: 'Data tersimpan.' });
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setStatus({ ok: false, text: message || 'Gagal menyimpan.' });
    } finally {
      setSaving(false);
    }
  };

  if (!profile || !form) {
    return status ? <p role="alert" style={{ color: '#ba1a1a', fontFamily: f }}>{status.text}</p>
      : <div style={{ textAlign: 'center', padding: '80px', color: '#777683' }}>Memuat...</div>;
  }

  return (
    <form onSubmit={save} style={{ maxWidth: '760px', display: 'grid', gap: '16px' }}>
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Landmark size={18} color="#6728e4" />
          <p style={{ fontFamily: f, fontWeight: 700, fontSize: '1rem', color: '#191c20' }}>Rekening / E-Wallet Pembayaran Fee</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div><label style={labelStyle}>Nama Bank / E-Wallet</label><input value={pay.methodName} onChange={(e) => setPay({ ...pay, methodName: e.target.value })} placeholder="BCA / DANA" style={inputStyle} /></div>
          <div><label style={labelStyle}>No. Rekening / E-Wallet</label><input value={pay.accountNumber} onChange={(e) => setPay({ ...pay, accountNumber: e.target.value })} inputMode="numeric" placeholder="1234567890" style={inputStyle} /></div>
          <div><label style={labelStyle}>Nama Penerima</label><input value={pay.accountName} onChange={(e) => setPay({ ...pay, accountName: e.target.value })} placeholder="Sesuai buku tabungan" style={inputStyle} /></div>
        </div>
        {profile.paymentInfo?.updatedAt && (
          <p style={{ fontFamily: f, fontSize: '0.74rem', color: '#9a99a6', marginTop: '10px' }}>
            Terakhir diubah {new Date(profile.paymentInfo.updatedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' })}
          </p>
        )}
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <UserRound size={18} color="#6728e4" />
          <p style={{ fontFamily: f, fontWeight: 700, fontSize: '1rem', color: '#191c20' }}>Profil {profile.name}</p>
        </div>
        <p style={{ fontFamily: f, fontSize: '0.76rem', color: '#777683', marginBottom: '16px' }}>Nama management & email login ({profile.email}) diubah lewat admin Azera.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {PROFILE_LABELS.map(([key, label, ph]) => (
            <div key={key}><label style={labelStyle}>{label}</label><input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={ph} style={inputStyle} /></div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.86rem', opacity: saving ? 0.6 : 1 }}>
          <Save size={15} /> {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
        {status && <p role={status.ok ? 'status' : 'alert'} style={{ fontFamily: f, fontSize: '0.82rem', color: status.ok ? '#065F46' : '#ba1a1a' }}>{status.text}</p>}
      </div>
    </form>
  );
}
