import { useState } from 'react';
import { useWaConfirm, useGroupLinkPrompt } from '../../lib/waConfirm';
import { ListChecks, X } from 'lucide-react';
import api from '../../lib/api';

const f = "var(--font-display)";

interface MatchRow {
  row: number; label: string; status: 'match' | 'already' | 'not_stage1' | 'duplicate' | 'unmatched' | 'ambiguous';
  by?: 'username' | 'phone' | 'name'; creatorName?: string;
}
const STATUS_TEXT: Record<MatchRow['status'], [string, string]> = {
  match: ['Akan di-approve', '#146c2e'],
  already: ['Sudah approved', '#5f6368'],
  not_stage1: ['Belum lolos tahap admin', '#a15c00'],
  duplicate: ['Baris dobel', '#5f6368'],
  ambiguous: ['Cocok ke >1 creator, cek manual', '#93000a'],
  unmatched: ['Tidak ketemu', '#93000a'],
};
const BY_TEXT = { username: 'username', phone: 'no. WA', name: 'nama' };

/** Client ACC manual di tab sendiri (mis. "List ok") di spreadsheet Listing: cocokkan otomatis ke
 * pendaftar (username/link sosmed → no. WA → nama), lalu approve tahap client sekaligus. */
export default function ClientSheetApprove({ campaignId, waGroupLink }: { campaignId: string; waGroupLink?: string }) {
  const confirmWa = useWaConfirm();
  const promptGroupLink = useGroupLinkPrompt();
  const [open, setOpen] = useState(false);
  const [tabs, setTabs] = useState<string[] | null>(null);
  const [tab, setTab] = useState('');
  const [rows, setRows] = useState<MatchRow[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const errText = (err: unknown, fallback: string) => (err as { response?: { data?: { message?: string } } })?.response?.data?.message || fallback;

  const start = async () => {
    setOpen(true);
    setRows(null);
    setMessage(null);
    try {
      const res = await api.get(`/admin/campaigns/${campaignId}/client-sheet/tabs`);
      setTabs(res.data.tabs);
      setTab((t) => (res.data.tabs.includes(t) ? t : res.data.tabs[0] || ''));
    } catch (err) {
      setTabs([]);
      setMessage({ ok: false, text: errText(err, 'Gagal membaca spreadsheet client.') });
    }
  };

  const run = async (apply: boolean) => {
    if (!tab) return;
    let waSender = '';
    if (apply) {
      setOpen(false); // modal link grup & konfirmasi WA tampil di atas halaman, bukan di balik modal ini
      const go = await promptGroupLink(campaignId, waGroupLink);
      const picked = go ? await confirmWa({
        title: `Approve ${toApprove} creator`,
        description: `Creator yang di-approve client dikirimi WA "lolos" berisi link portal${waGroupLink ? ' & link grup campaign' : ''}. Akun buzzer milik orang yang sama digabung satu pesan.`,
        trigger: 'creator_accepted', campaignId, confirmLabel: 'Approve & kirim',
      }) : null;
      setOpen(true);
      if (picked === null) return;
      waSender = picked;
    }
    setBusy(true);
    setMessage(null);
    try {
      const res = await api.post(`/admin/campaigns/${campaignId}/client-sheet/approve`, { tab, apply, waSender });
      setRows(res.data.rows);
      if (apply) setMessage({ ok: true, text: `${res.data.approved} creator di-approve client. Creator dikabari otomatis lewat WA.` });
    } catch (err) {
      setMessage({ ok: false, text: errText(err, 'Gagal mencocokkan tab client.') });
    } finally {
      setBusy(false);
    }
  };

  const toApprove = rows?.filter((r) => r.status === 'match').length ?? 0;
  const counts = rows ? Object.entries(rows.reduce<Record<string, number>>((a, r) => ({ ...a, [r.status]: (a[r.status] || 0) + 1 }), {})) : [];

  return (
    <>
      <button type="button" onClick={() => void start()} title="Client ACC lewat tab sendiri di spreadsheet Listing? Cocokkan & approve otomatis"
        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', marginBottom: '10px', borderRadius: '999px', border: '1px solid #c9b6f7', background: 'white', color: '#6728e4', fontSize: '0.8rem', fontWeight: 700, fontFamily: f, cursor: 'pointer' }}>
        <ListChecks size={15} /> Approve dari tab sheet client
      </button>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Approve dari tab sheet client" onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(25,28,32,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '720px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e1e0ff' }}>
              <p style={{ fontFamily: f, fontWeight: 800, fontSize: '1rem', color: '#191c20' }}>Approve dari tab sheet client</p>
              <button onClick={() => setOpen(false)} aria-label="Tutup" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#5f6368' }}><X size={18} /></button>
            </div>

            <div style={{ padding: '16px 20px', display: 'grid', gap: '12px', overflowY: 'auto' }}>
              <p style={{ fontFamily: f, fontSize: '0.8rem', color: '#464652' }}>
                Pilih tab yang dibuat client di spreadsheet Listing (isi: creator yang di-ACC). Tiap baris dicocokkan ke pendaftar lewat username/link sosmed, lalu nomor WA, lalu nama lengkap (kalau unik). Urutan & nama kolom bebas.
              </p>
              {tabs === null ? <p style={{ fontFamily: f, fontSize: '0.82rem', color: '#777683' }}>Membaca spreadsheet...</p>
                : tabs.length === 0 ? <p style={{ fontFamily: f, fontSize: '0.82rem', color: '#777683' }}>Belum ada tab tambahan di spreadsheet client (selain Listing & Campaign Tracker).</p>
                : (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <select value={tab} onChange={(e) => { setTab(e.target.value); setRows(null); }} style={{ flex: '1 1 200px', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #e1e0ff', fontFamily: f, fontSize: '0.85rem' }}>
                      {tabs.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <button onClick={() => void run(false)} disabled={busy || !tab} className="btn-primary" style={{ padding: '9px 18px', fontSize: '0.82rem', opacity: busy ? 0.6 : 1 }}>
                      {busy && !rows ? 'Mencocokkan...' : 'Cocokkan'}
                    </button>
                  </div>
                )}

              {message && <p role={message.ok ? 'status' : 'alert'} style={{ fontFamily: f, fontSize: '0.82rem', color: message.ok ? '#146c2e' : '#93000a' }}>{message.text}</p>}

              {rows && (
                <>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {counts.map(([s, n]) => (
                      <span key={s} style={{ background: '#f4f3fa', color: STATUS_TEXT[s as MatchRow['status']][1], borderRadius: '999px', padding: '4px 10px', fontSize: '0.74rem', fontWeight: 700, fontFamily: f }}>
                        {STATUS_TEXT[s as MatchRow['status']][0]}: {n}
                      </span>
                    ))}
                  </div>
                  <div style={{ border: '1px solid #e1e0ff', borderRadius: '10px', maxHeight: '320px', overflowY: 'auto' }}>
                    {rows.filter((r) => r.status !== 'already').map((r) => (
                      <div key={r.row} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '7px 12px', borderBottom: '1px solid #f0eeff', fontFamily: f, fontSize: '0.78rem' }}>
                        <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#191c20' }}>
                          <span style={{ color: '#9a99a6' }}>Baris {r.row} · </span>{r.label}{r.creatorName ? ` → ${r.creatorName}` : ''}
                        </span>
                        <span style={{ whiteSpace: 'nowrap', color: STATUS_TEXT[r.status][1], fontWeight: 600 }}>
                          {STATUS_TEXT[r.status][0]}{r.by ? ` (${BY_TEXT[r.by]})` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {rows && (
              <div style={{ padding: '14px 20px', borderTop: '1px solid #e1e0ff', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => void run(true)} disabled={busy || !toApprove} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem', opacity: busy || !toApprove ? 0.6 : 1 }}>
                  {busy ? 'Meng-approve...' : `Approve ${toApprove} creator`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
