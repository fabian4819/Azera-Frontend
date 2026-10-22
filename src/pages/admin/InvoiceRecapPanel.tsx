import { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import api from '../../lib/api';

/**
 * Data Rekap invoice (khusus owner): campaign, bulan running, status lunas, tier per item, kolom tambahan.
 * Disimpan di data.recap & items[i].tier lewat tombol Simpan editor, tidak ikut tercetak di PDF.
 * Dibaca halaman Rekap Keuangan (server: financeRecap.routes.ts).
 */

type Data = Record<string, unknown>;
export interface RecapColumn { key: string; label: string; type: 'text' | 'income' | 'expense' }
interface Recap { status?: 'unpaid' | 'paid'; paidAt?: string; campaignId?: string; runningMonth?: string; custom?: Record<string, string | number> }

const TIER_OPTIONS = ['Nano', 'Micro', 'Macro', 'Mega', 'Buzzer', 'Reimburse Produk'];
const f = 'var(--font-display)';
const label: React.CSSProperties = { display: 'block', fontFamily: f, fontSize: '0.72rem', fontWeight: 700, color: '#464652', marginBottom: '4px' };
const input: React.CSSProperties = { width: '100%', padding: '8px 10px', borderRadius: '10px', border: '1.5px solid #e1e0ff', fontFamily: f, fontSize: '0.82rem', background: 'white' };
const today = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });

/** data = tampilan saja; perubahan dikirim sebagai updater supaya diterapkan ke data editor terbaru */
export default function InvoiceRecapPanel({ data, onChange }: { data: Data; onChange: (update: (d: Data) => Data) => void }) {
  const [campaigns, setCampaigns] = useState<{ _id: string; name: string }[]>([]);
  const [columns, setColumns] = useState<RecapColumn[]>([]);

  useEffect(() => {
    api.get('/admin/campaigns').then((res) => setCampaigns(res.data)).catch(() => {});
    api.get('/admin/finance-recap/columns').then((res) => setColumns(res.data)).catch(() => {});
  }, []);

  const recap = (data.recap ?? {}) as Recap;
  const items = Array.isArray(data.items) ? (data.items as Data[]) : [];
  const recapOf = (d: Data) => (d.recap ?? {}) as Recap;
  const setRecap = (patch: Partial<Recap>) => onChange((d) => ({ ...d, recap: { ...recapOf(d), ...patch } }));
  const setTier = (i: number, tier: string) => onChange((d) => ({
    ...d, items: (Array.isArray(d.items) ? (d.items as Data[]) : []).map((it, j) => (j === i ? { ...it, tier } : it)),
  }));
  const setCustom = (key: string, value: string | number) => onChange((d) => ({
    ...d, recap: { ...recapOf(d), custom: { ...recapOf(d).custom, [key]: value } },
  }));
  const paid = recap.status === 'paid';

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '18px 20px', border: '1px solid #e1e0ff', marginBottom: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <ClipboardList size={16} color="#6728e4" />
        <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.9rem', color: '#191c20' }}>Data Rekap Keuangan</p>
      </div>
      <p style={{ fontFamily: f, fontSize: '0.74rem', color: '#8a8a99', marginBottom: '14px' }}>
        Tidak ikut tercetak di PDF. Dipakai halaman Rekap Keuangan; uang masuk hanya dihitung dari invoice berstatus Lunas.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px' }}>
        <label>
          <span style={label}>Campaign (sumber uang keluar)</span>
          <select style={input} value={recap.campaignId ?? ''} onChange={(e) => setRecap({ campaignId: e.target.value || undefined })}>
            <option value="">— Belum dihubungkan —</option>
            {campaigns.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </label>
        <label>
          <span style={label}>Bulan Running</span>
          <input type="month" style={input} value={recap.runningMonth ?? String(data.issueDate ?? '').slice(0, 7)} onChange={(e) => setRecap({ runningMonth: e.target.value || undefined })} />
        </label>
        <label>
          <span style={label}>Status Pembayaran</span>
          <select
            style={{ ...input, fontWeight: 700, color: paid ? '#065F46' : '#92400E' }}
            value={paid ? 'paid' : 'unpaid'}
            onChange={(e) => setRecap(e.target.value === 'paid' ? { status: 'paid', paidAt: recap.paidAt || today() } : { status: 'unpaid', paidAt: undefined })}
          >
            <option value="unpaid">Belum Lunas</option>
            <option value="paid">Lunas</option>
          </select>
        </label>
        {paid && (
          <label>
            <span style={label}>Tanggal Lunas</span>
            <input type="date" style={input} value={recap.paidAt ?? ''} onChange={(e) => setRecap({ paidAt: e.target.value || today() })} />
          </label>
        )}
        {columns.map((c) => (
          <label key={c.key}>
            <span style={label}>{c.label}{c.type === 'income' ? ' (+ masuk)' : c.type === 'expense' ? ' (− keluar)' : ''}</span>
            <input
              type={c.type === 'text' ? 'text' : 'number'}
              style={input}
              value={recap.custom?.[c.key] ?? ''}
              onChange={(e) => setCustom(c.key, c.type === 'text' ? e.target.value : e.target.value === '' ? '' : Number(e.target.value))}
            />
          </label>
        ))}
      </div>

      {items.some((it) => String(it.name ?? '').trim()) && (
        <div style={{ marginTop: '14px' }}>
          <span style={label}>Tier per item (SOW)</span>
          <datalist id="tier-options">{TIER_OPTIONS.map((t) => <option key={t} value={t} />)}</datalist>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {items.map((it, i) => String(it.name ?? '').trim() && (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 180px', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontFamily: f, fontSize: '0.8rem', color: '#191c20', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {String(it.name)} {it.qty !== undefined && it.qty !== '' ? `· ${String(it.qty)} talent` : ''}
                </span>
                <input list="tier-options" placeholder="Pilih / ketik tier" style={input} value={String(it.tier ?? '')} onChange={(e) => setTier(i, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
