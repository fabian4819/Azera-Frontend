import { useEffect, useState } from 'react';
import { CalendarCheck, X } from 'lucide-react';
import api from '../../lib/api';

const f = 'var(--font-display)';
const PAYMENT_DUE_DAYS = 14;
const SENDER_LABELS: Record<string, string> = { partnership: 'Partnership / Brand', creator: 'Creator / KOL', developer: 'Developer (lokal)' };
const fmt = (d: string | Date) => new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' });
const selectStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: '12px', border: '1.5px solid #c7c8cf', fontSize: '0.85rem', fontFamily: f, background: 'white' };

interface Sender { id: string; status: string; connectedNumber: string | null }
interface Group { jid: string; name: string }
export interface DoneInsightState { doneInsightAt?: string; paymentDueAt?: string; waGroupJid?: string }

/** Admin menandai insight selesai → batas pembayaran fee H+14 hari kalender, info dikirim ke grup WA campaign.
 * "Kirim Info Payment" mengirim ulang info yang sama (tanggal tidak berubah). */
export default function DoneInsightCard({ campaignId, value, onChange }: { campaignId: string; value: DoneInsightState; onChange: (v: DoneInsightState) => void }) {
  const [mode, setMode] = useState<'mark' | 'resend' | null>(null);
  const [senders, setSenders] = useState<Sender[]>([]);
  const [sender, setSender] = useState('');
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [groupJid, setGroupJid] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const done = Boolean(value.doneInsightAt);

  const open = async (m: 'mark' | 'resend') => {
    setMode(m);
    setMessage(null);
    const [list, def] = await Promise.all([
      api.get('/admin/campaigns/wa-senders').then((r) => r.data as Sender[]).catch(() => [] as Sender[]),
      api.get('/admin/campaigns/wa-sender-default', { params: { trigger: 'payment_due_info', campaignId } }).then((r) => String(r.data.sender)).catch(() => ''),
    ]);
    setSenders(list);
    setSender(list.some((s) => s.id === def && s.status === 'connected') ? def : list.find((s) => s.status === 'connected')?.id ?? '');
  };

  // Daftar grup ikut nomor pengirim; grup yang terakhir dipakai campaign ini jadi pilihan awal
  useEffect(() => {
    if (!mode || !sender) return;
    let alive = true;
    api.get('/admin/campaigns/wa-groups', { params: { bot: sender } })
      .then((r) => {
        if (!alive) return;
        const list = r.data as Group[];
        setGroups(list);
        setGroupJid((g) => (list.some((x) => x.jid === g) ? g : list.some((x) => x.jid === value.waGroupJid) ? value.waGroupJid! : ''));
      })
      .catch(() => { if (alive) setGroups([]); });
    return () => { alive = false; };
  }, [mode, sender, value.waGroupJid]);

  const submit = async (send: boolean) => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await api.post(`/admin/campaigns/${campaignId}/done-insight`, { resend: mode === 'resend', groupJid: send ? groupJid : '', waSender: sender });
      onChange({ doneInsightAt: res.data.doneInsightAt, paymentDueAt: res.data.paymentDueAt, waGroupJid: res.data.waGroupJid });
      setMode(null);
      setMessage({ ok: true, text: res.data.sent ? 'Info payment masuk antrian kirim ke grup.' : 'Campaign ditandai done insight.' });
    } catch (err) {
      setMessage({ ok: false, text: (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal memproses.' });
    } finally {
      setBusy(false);
    }
  };

  const insightDate = value.doneInsightAt ? new Date(value.doneInsightAt) : new Date();
  const dueDate = value.paymentDueAt ? new Date(value.paymentDueAt) : new Date(insightDate.getTime() + PAYMENT_DUE_DAYS * 86_400_000);

  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e1e0ff', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
      <span style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f0eeff', color: '#6728e4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><CalendarCheck size={18} /></span>
      <div style={{ flex: 1, minWidth: 0, display: 'grid', gap: '10px' }}>
        <div>
          <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem', color: '#191c20' }}>Done Insight & Batas Pembayaran</p>
          <p style={{ fontSize: '0.78rem', color: '#777683', lineHeight: 1.5, marginTop: '2px' }}>
            Tandai saat insight campaign sudah lengkap. Batas pembayaran fee = H+{PAYMENT_DUE_DAYS} hari kalender, info dikirim ke grup WA campaign.
          </p>
        </div>
        {done ? (
          <div style={{ display: 'flex', gap: '8px 18px', flexWrap: 'wrap', fontFamily: f, fontSize: '0.84rem', color: '#191c20' }}>
            <span>Done insight: <b>{fmt(value.doneInsightAt!)}</b></span>
            <span>Batas payment: <b style={{ color: '#6728e4' }}>{fmt(value.paymentDueAt!)}</b></span>
          </div>
        ) : (
          <p style={{ fontFamily: f, fontSize: '0.82rem', color: '#a15c00' }}>Belum ditandai done insight.</p>
        )}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {!done && <button type="button" onClick={() => void open('mark')} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Tandai Done Insight</button>}
          {done && (
            <button type="button" onClick={() => void open('resend')}
              style={{ padding: '8px 16px', borderRadius: '999px', border: '1px solid #c9b6f7', background: 'white', color: '#6728e4', fontSize: '0.8rem', fontWeight: 700, fontFamily: f, cursor: 'pointer' }}>
              Kirim Info Payment
            </button>
          )}
        </div>
        {message && <p role={message.ok ? 'status' : 'alert'} style={{ fontFamily: f, fontSize: '0.8rem', color: message.ok ? '#146c2e' : '#ba1a1a' }}>{message.text}</p>}
      </div>

      {mode && (
        <div role="dialog" aria-modal="true" aria-label="Info payment" onClick={() => setMode(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(25,28,32,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '16px', width: 'min(480px, 100%)', padding: '20px', display: 'grid', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ flex: 1, fontFamily: f, fontWeight: 800, fontSize: '1rem', color: '#191c20' }}>{mode === 'mark' ? 'Tandai Done Insight' : 'Kirim Info Payment'}</p>
              <button type="button" onClick={() => setMode(null)} aria-label="Tutup" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#5f6368' }}><X size={18} /></button>
            </div>
            <p style={{ fontFamily: f, fontSize: '0.84rem', color: '#464652', lineHeight: 1.5 }}>
              Done insight <b>{fmt(insightDate)}</b> → batas pembayaran <b style={{ color: '#6728e4' }}>{fmt(dueDate)}</b>.
              {mode === 'mark' && ' Tanggal ini tidak bisa diubah setelah ditandai.'}
            </p>
            <label style={{ display: 'grid', gap: '6px', fontFamily: f, fontSize: '0.8rem', fontWeight: 700, color: '#191c20' }}>
              Kirim pakai WA
              <select value={sender} onChange={(e) => setSender(e.target.value)} style={selectStyle}>
                {senders.map((s) => (
                  <option key={s.id} value={s.id} disabled={s.status !== 'connected'}>{SENDER_LABELS[s.id] ?? s.id}: {s.status === 'connected' ? s.connectedNumber : 'belum terhubung'}</option>
                ))}
              </select>
            </label>
            <label style={{ display: 'grid', gap: '6px', fontFamily: f, fontSize: '0.8rem', fontWeight: 700, color: '#191c20' }}>
              Grup WA campaign
              <select value={groupJid} onChange={(e) => setGroupJid(e.target.value)} style={selectStyle} disabled={!groups}>
                <option value="">{groups === null ? 'Memuat grup…' : 'Pilih grup'}</option>
                {(groups || []).map((g) => <option key={g.jid} value={g.jid}>{g.name}</option>)}
              </select>
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
              {mode === 'mark' && (
                <button type="button" onClick={() => void submit(false)} disabled={busy}
                  style={{ padding: '9px 16px', borderRadius: '999px', border: '1.5px solid #c7c8cf', background: 'white', cursor: 'pointer', fontFamily: f, fontWeight: 700, fontSize: '0.8rem' }}>
                  Tandai saja (tanpa kirim)
                </button>
              )}
              <button type="button" onClick={() => void submit(true)} disabled={busy || !groupJid || !sender} className="btn-primary"
                style={{ padding: '9px 16px', fontSize: '0.8rem', opacity: busy || !groupJid || !sender ? 0.5 : 1 }}>
                {busy ? 'Memproses…' : mode === 'mark' ? 'Tandai & kirim ke grup' : 'Kirim ke grup'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
