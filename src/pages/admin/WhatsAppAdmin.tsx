import { useEffect, useState } from 'react';
import { CheckCircle2, LogOut, Smartphone } from 'lucide-react';
import api from '../../lib/api';

const f = "var(--font-display)";
const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '22px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)', marginBottom: '16px',
};

type WaStatus = 'disconnected' | 'connecting' | 'qr' | 'connected';
type Slot = 'primary' | 'backup';
interface SlotStatus { status: WaStatus; connectedNumber: string | null }
interface AdminRow { userId: string; name: string; role: string; slots: Record<Slot, SlotStatus> }
const SLOT_LABEL: Record<Slot, string> = { primary: '1. Utama', backup: '2. Backup' };
const errorOf = (err: unknown, fallback: string) => (err as { response?: { data?: { message?: string } } })?.response?.data?.message || fallback;

/** Satu nomor WA admin (utama/backup): status, scan QR, putuskan */
function SlotCard({ userId, slot }: { userId: string; slot: Slot }) {
  const [st, setSt] = useState<SlotStatus>({ status: 'disconnected', connectedNumber: null });
  const [qr, setQr] = useState<string | null>(null);
  const [error, setError] = useState('');
  const base = `/admin/whatsapp-admin/${userId}/${slot}`;

  const fetchStatus = async () => {
    const res = await api.get(`${base}/status`);
    setSt(res.data);
    setQr(res.data.status === 'qr' ? (await api.get(`${base}/qr`)).data.qr : null);
  };

  useEffect(() => {
    const t = window.setTimeout(() => { void fetchStatus(); }, 0);
    const poll = window.setInterval(() => { void fetchStatus(); }, 3000);
    return () => { window.clearTimeout(t); window.clearInterval(poll); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base]);

  const act = async (path: 'connect' | 'logout', fallback: string) => {
    setError('');
    try { await api.post(`${base}/${path}`); await fetchStatus(); } catch (err) { setError(errorOf(err, fallback)); }
  };

  return (
    <div style={{ flex: '1 1 280px', border: '1px solid #efeeff', borderRadius: '12px', padding: '16px', minWidth: 0 }}>
      <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Smartphone size={15} color="#6728e4" /> {SLOT_LABEL[slot]}
      </p>
      {error && <p style={{ color: '#ba1a1a', fontSize: '0.8rem', fontFamily: f, marginBottom: '10px' }}>{error}</p>}
      {st.status === 'connected' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#065F46" />
            <div>
              <p style={{ fontFamily: f, fontWeight: 700, color: '#065F46', fontSize: '0.85rem' }}>Terhubung</p>
              <p style={{ fontFamily: f, fontSize: '0.8rem', color: '#464652' }}>+{st.connectedNumber}</p>
            </div>
          </div>
          <button onClick={() => void act('logout', 'Gagal memutuskan')} className="btn-secondary" style={{ padding: '7px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LogOut size={13} /> Putuskan
          </button>
        </div>
      )}
      {st.status === 'qr' && qr && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: f, fontSize: '0.8rem', color: '#464652', marginBottom: '10px' }}>Scan dengan WhatsApp nomor ini (Perangkat Tertaut).</p>
          <img src={qr} alt={`QR WhatsApp ${SLOT_LABEL[slot]}`} style={{ width: '200px', height: '200px', border: '1px solid #e1e0ff', borderRadius: '12px' }} />
        </div>
      )}
      {(st.status === 'connecting' || (st.status === 'qr' && !qr)) && <p style={{ fontFamily: f, fontSize: '0.82rem', color: '#464652' }}>Menghubungkan...</p>}
      {st.status === 'disconnected' && (
        <div>
          <p style={{ fontFamily: f, fontSize: '0.82rem', color: '#464652', marginBottom: '10px' }}>Belum terhubung.</p>
          <button onClick={() => void act('connect', 'Gagal memulai koneksi')} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Hubungkan (scan QR)</button>
        </div>
      )}
    </div>
  );
}

/** Menu WhatsApp Admin: 2 nomor WA per admin (utama & backup), dipilih sebagai pengirim bot per campaign. */
export default function WhatsAppAdmin() {
  const [admins, setAdmins] = useState<AdminRow[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/whatsapp-admin')
      .then((res) => setAdmins(res.data))
      .catch((err) => setError(errorOf(err, 'Data gagal dimuat.')));
  }, []);

  return (
    <div>
      <div style={{ ...cardStyle, background: '#f8f7ff' }}>
        <p style={{ fontFamily: f, fontSize: '0.84rem', color: '#464652', lineHeight: 1.6 }}>
          Sambungkan nomor WhatsApp admin: <strong>1. Utama</strong> dan <strong>2. Backup</strong>. Nomor ini bisa dipilih sebagai pengirim pesan bot
          di pengaturan tiap campaign (menu Campaign → <em>Pengirim Pesan Bot</em>). Kalau kirim lewat nomor utama gagal, otomatis dikirim lewat backup.
          Nomor ini <strong>hanya dipakai untuk mengirim</strong>: chat pribadi di nomor admin tidak dibaca, tidak disimpan, dan tidak dibalas bot.
        </p>
      </div>
      {error && <p style={{ color: '#ba1a1a', fontFamily: f, fontSize: '0.85rem' }}>{error}</p>}
      {!admins && !error && <p style={{ fontFamily: f, color: '#777683' }}>Memuat…</p>}
      {admins?.map((a) => (
        <div key={a.userId} style={cardStyle}>
          <p style={{ fontFamily: f, fontWeight: 700, fontSize: '1.02rem', marginBottom: '14px' }}>
            {a.name} <span style={{ fontWeight: 400, fontSize: '0.78rem', color: '#8a8a99', textTransform: 'capitalize' }}>· {a.role}</span>
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <SlotCard userId={a.userId} slot="primary" />
            <SlotCard userId={a.userId} slot="backup" />
          </div>
        </div>
      ))}
    </div>
  );
}
