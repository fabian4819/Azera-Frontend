import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import api from '../../lib/api';

const f = "var(--font-display)";
interface Sender { id: string; label: string; connected: boolean }
export type WaSenders = Record<string, { primary: string; backup?: string }>;

/** Tindakan bot per campaign yang pengirimnya bisa diatur (trigger yang dikirim dengan campaign terkait) */
const ACTIONS: [string, string][] = [
  ['creator_accepted', 'Approval creator (creator diterima)'],
  ['brief_campaign', 'Broadcast / brief campaign ke creator'],
  ['reminder_draft', 'Reminder draft'],
  ['reminder_upload', 'Reminder upload'],
  ['reminder_revision', 'Reminder revisi'],
  ['reminder_insight', 'Reminder insight'],
  ['creator_bank_info_request', 'Minta info bank creator'],
  ['reminder_payment_creator', 'Reminder pembayaran creator'],
  ['payment_completed', 'Pembayaran creator selesai'],
  ['pic_bank_info_request', 'Minta info bank PIC'],
  ['campaign_started', 'Campaign dimulai (ke client)'],
  ['campaign_completed', 'Campaign selesai (ke client)'],
  ['invoice_new', 'Invoice baru (ke client)'],
  ['invoice_paid', 'Invoice terverifikasi (ke client)'],
  ['reminder_payment_client', 'Reminder pembayaran client'],
  ['daily_progress_report', 'Daily progress report (grup tim)'],
];
const AZERA = 'azera';
const sel: React.CSSProperties = { padding: '7px 10px', borderRadius: '10px', border: '1.5px solid #c7c8cf', fontSize: '0.78rem', fontFamily: f, background: 'white', minWidth: 0, width: '100%' };

/** Pengirim pesan bot per tindakan: utama + backup (dipakai kalau kirim lewat utama gagal / utama tidak tersambung) */
export default function CampaignWaSenders({ campaignId, value, onSaved }: { campaignId: string; value?: WaSenders; onSaved: (v: WaSenders) => void }) {
  const [senders, setSenders] = useState<Sender[]>([]);
  const [draft, setDraft] = useState<WaSenders>(value ?? {});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/admin/whatsapp-admin/senders').then((res) => setSenders(res.data)).catch(() => setSenders([{ id: AZERA, label: 'WA Azera (bot bawaan)', connected: true }]));
  }, []);

  const set = (trigger: string, key: 'primary' | 'backup', v: string) => setDraft((d) => {
    const cur = d[trigger] ?? { primary: AZERA };
    const next = { ...cur, [key]: v || undefined };
    if (next.backup === next.primary) delete next.backup;
    return { ...d, [trigger]: { primary: next.primary || AZERA, ...(next.backup ? { backup: next.backup } : {}) } };
  });
  const applyAll = (trigger: string) => setDraft((d) => Object.fromEntries(ACTIONS.map(([t]) => [t, { ...(d[trigger] ?? { primary: AZERA }) }])));

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      const res = await api.patch(`/admin/campaigns/${campaignId}`, { waSenders: draft });
      onSaved(res.data.waSenders ?? draft);
      setMsg('Tersimpan.');
    } catch {
      setMsg('Gagal menyimpan, coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const options = (allowEmpty: boolean) => (
    <>
      {allowEmpty && <option value="">Tanpa backup</option>}
      {senders.map((s) => <option key={s.id} value={s.id}>{s.label}{s.connected ? '' : ' · belum tersambung'}</option>)}
    </>
  );

  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #e1e0ff', boxShadow: '0 2px 12px rgba(107,46,232,0.05)', marginBottom: '20px' }}>
      <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}><Send size={16} color="#6728e4" /> Pengirim Pesan Bot</p>
      <p style={{ fontFamily: f, fontSize: '0.8rem', color: '#777683', marginBottom: '16px', lineHeight: 1.5 }}>
        Pilih nomor yang mengirim tiap pesan bot campaign ini: WA Azera (bot bawaan) atau WA admin yang sudah disambungkan di menu WhatsApp Admin.
        Kalau kirim lewat <strong>utama</strong> gagal atau utama sedang tidak tersambung, otomatis dikirim lewat <strong>backup</strong>.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(160px, 1.2fr) 1fr 1fr auto', gap: '8px 10px', alignItems: 'center' }}>
        <span style={{ fontFamily: f, fontSize: '0.72rem', fontWeight: 700, color: '#5f6368' }}>Tindakan bot</span>
        <span style={{ fontFamily: f, fontSize: '0.72rem', fontWeight: 700, color: '#5f6368' }}>Utama</span>
        <span style={{ fontFamily: f, fontSize: '0.72rem', fontWeight: 700, color: '#5f6368' }}>Backup</span>
        <span />
        {ACTIONS.map(([trigger, label]) => {
          const cur = draft[trigger] ?? { primary: AZERA };
          return (
            <div key={trigger} style={{ display: 'contents' }}>
              <span style={{ fontFamily: f, fontSize: '0.8rem', color: '#191c20' }}>{label}</span>
              <select value={cur.primary} onChange={(e) => set(trigger, 'primary', e.target.value)} aria-label={`Pengirim utama ${label}`} style={sel}>{options(false)}</select>
              <select value={cur.backup ?? ''} onChange={(e) => set(trigger, 'backup', e.target.value)} aria-label={`Pengirim backup ${label}`} style={sel}>{options(true)}</select>
              <button type="button" onClick={() => applyAll(trigger)} title="Pakai pengaturan baris ini untuk semua tindakan"
                style={{ fontFamily: f, fontSize: '0.7rem', color: '#6728e4', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>Terapkan ke semua</button>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
        <button type="button" onClick={() => void save()} disabled={saving} className="btn-primary" style={{ padding: '9px 18px', fontSize: '0.82rem', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Menyimpan…' : 'Simpan Pengirim'}
        </button>
        {msg && <span style={{ fontFamily: f, fontSize: '0.8rem', color: msg === 'Tersimpan.' ? '#065F46' : '#ba1a1a' }}>{msg}</span>}
      </div>
    </div>
  );
}
