import { Fragment, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowDownCircle, ArrowUpCircle, Columns3, Plus, Trash2, TrendingUp, Clock, FileSpreadsheet, ChevronDown, Pencil, X, EyeOff, RotateCcw } from 'lucide-react';
import api from '../../lib/api';
import type { RecapColumn } from './InvoiceRecapPanel';

/**
 * Rekap Keuangan (khusus owner): 1 grup per campaign (invoice yang dihubungkan ke campaign yang sama
 * digabung), uang masuk = invoice Lunas, uang keluar = Finance campaign (fee creator/PIC/MG dari Recap
 * Payment + reimburse/ads/opex) + kolom tambahan jenis "uang keluar". Periode = tanggal invoice.
 */

const f = 'var(--font-display)';
const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)', marginBottom: '20px',
};
const btn = (primary = true): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '999px', cursor: 'pointer',
  fontFamily: f, fontSize: '0.78rem', fontWeight: 600, border: primary ? 'none' : '1.5px solid #c7c8cf',
  background: primary ? 'var(--secondary)' : 'white', color: primary ? 'white' : '#191c20',
});
const input: React.CSSProperties = { padding: '7px 10px', borderRadius: '10px', border: '1.5px solid #e1e0ff', fontFamily: f, fontSize: '0.8rem', background: 'white' };
// Header sticky di dalam kontainer tabel yang scroll sendiri (box-shadow ganti border, border hilang saat sticky)
const th: React.CSSProperties = { padding: '9px 10px', fontWeight: 700, whiteSpace: 'nowrap', background: '#f8f9ff', textAlign: 'left', position: 'sticky', top: 0, zIndex: 2, boxShadow: 'inset 0 -1.5px 0 #e1e0ff' };
/** Sel angka yang bisa diklik untuk diedit */
const editableCell = (color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 8px', margin: '-4px -8px', borderRadius: '8px', cursor: 'pointer',
  background: 'none', border: '1.5px dashed transparent', fontFamily: f, fontSize: '0.8rem', fontWeight: 600, color,
});
const td: React.CSSProperties = { padding: '8px 10px', borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle' };

const rupiah = (v: number) => `Rp${Math.round(v).toLocaleString('id-ID')}`;
const ymd = (d: Date) => d.toLocaleDateString('en-CA');
const monthLabel = (ym: string) => (ym ? new Date(`${ym}-01T00:00:00`).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : '-');

type Mode = 'week' | 'month' | 'year' | 'custom' | 'all';
const MODES: { key: Mode; label: string }[] = [
  { key: 'week', label: 'Mingguan' }, { key: 'month', label: 'Bulanan' }, { key: 'year', label: 'Tahunan' },
  { key: 'custom', label: 'Custom' }, { key: 'all', label: 'Semua' },
];

/** Rentang tanggal (YYYY-MM-DD, inklusif) dari pilihan periode. Minggu = Senin–Minggu yang memuat tanggal acuan. */
function rangeOf(mode: Mode, ref: string, customFrom: string, customTo: string): { from?: string; to?: string } {
  const d = new Date(`${ref}T00:00:00`);
  if (mode === 'week') {
    const monday = new Date(d); monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
    return { from: ymd(monday), to: ymd(sunday) };
  }
  if (mode === 'month') return { from: ymd(new Date(d.getFullYear(), d.getMonth(), 1)), to: ymd(new Date(d.getFullYear(), d.getMonth() + 1, 0)) };
  if (mode === 'year') return { from: `${d.getFullYear()}-01-01`, to: `${d.getFullYear()}-12-31` };
  if (mode === 'custom') return { from: customFrom || undefined, to: customTo || undefined };
  return {};
}

interface Group {
  key: string; campaignId: string | null; campaign: string; company: string; contact: string; mastersheetUrl: string; runningMonth: string;
  items: { sow: string; tier: string; qty: number; unitFee: number; amount: number }[];
  invoices: { _id: string; number: string; issueDate: string; dueDate: string; total: number; paid: boolean; paidAt: string; overdue: boolean }[];
  custom: Record<string, string | number>; totalInvoice: number; income: number; receivable: number;
  expense: { feeCreator: number; feePic: number; feeMg: number; reimburse: number; ads: number; opex: number; custom: number; total: number };
  profit: number; margin: number | null;
  approvedCreators: number | null; talentWarning: string;
  /** Disembunyikan dari rekap: tidak ikut total & export, bisa dipulihkan */
  hidden: boolean;
}
interface Recap {
  columns: RecapColumn[]; groups: Group[];
  totals: { income: number; expense: number; profit: number; margin: number | null; receivable: number; overdue: number; invoiceCount: number; paidCount: number; hiddenCount: number };
}

const TIER_COLORS: Record<string, [string, string]> = {
  nano: ['#14532d', '#fff'], micro: ['#7c2d12', '#fff'], macro: ['#1e3a8a', '#fff'], mega: ['#581c87', '#fff'],
  buzzer: ['#fde68a', '#78350f'], 'reimburse produk': ['#3f2d12', '#fff'],
};
function TierPill({ tier }: { tier: string }) {
  if (!tier) return <span style={{ color: '#c7c8cf' }}>-</span>;
  const [bg, fg] = TIER_COLORS[tier.toLowerCase()] ?? ['#ede9fe', '#4c1d95'];
  return <span style={{ padding: '3px 12px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, background: bg, color: fg, whiteSpace: 'nowrap' }}>{tier}</span>;
}

/** Daftar per invoice dalam satu sel grup; tinggi baris tetap supaya kolom Invoice/Status/Jatuh Tempo sejajar */
function invoiceList(g: Group, render: (inv: Group['invoices'][number]) => React.ReactNode) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {g.invoices.map((inv) => <div key={inv._id} style={{ minHeight: '26px', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>{render(inv)}</div>)}
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, hint, color }: { icon: typeof TrendingUp; label: string; value: string; hint: string; color: string }) {
  return (
    <div style={{ ...cardStyle, marginBottom: 0, padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <Icon size={16} color={color} />
        <span style={{ fontFamily: f, fontSize: '0.76rem', fontWeight: 700, color: '#464652' }}>{label}</span>
      </div>
      <p style={{ fontFamily: f, fontWeight: 800, fontSize: '1.25rem', color }}>{value}</p>
      <p style={{ fontSize: '0.72rem', color: '#8a8a99', marginTop: '2px' }}>{hint}</p>
    </div>
  );
}

const COLUMN_TYPE_LABEL: Record<RecapColumn['type'], string> = { text: 'Teks / catatan', income: 'Uang masuk (+)', expense: 'Uang keluar (−)' };

function ColumnManager({ columns, onSaved, onClose }: { columns: RecapColumn[]; onSaved: () => void; onClose: () => void }) {
  const [draft, setDraft] = useState<Partial<RecapColumn>[]>(columns);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (i: number, patch: Partial<RecapColumn>) => setDraft((d) => d.map((c, j) => (j === i ? { ...c, ...patch } : c)));

  const save = async () => {
    setBusy(true); setError('');
    try {
      await api.put('/admin/finance-recap/columns', { columns: draft.filter((c) => c.label?.trim()) });
      onSaved();
    } catch (err) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Gagal menyimpan kolom.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ ...cardStyle, borderColor: '#c4b5fd' }}>
      <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>Kolom Tambahan</p>
      <p style={{ fontFamily: f, fontSize: '0.74rem', color: '#8a8a99', marginBottom: '12px' }}>
        Nilainya diisi per invoice di panel Data Rekap (menu Invoice). Jenis uang masuk/keluar ikut dihitung ke total & profit.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
        {draft.map((c, i) => (
          <div key={c.key ?? `new-${i}`} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input style={{ ...input, flex: '1 1 200px' }} placeholder="Nama kolom, mis. PPN, Fee Sales, Catatan" value={c.label ?? ''} onChange={(e) => set(i, { label: e.target.value })} />
            <select style={input} value={c.type ?? 'text'} onChange={(e) => set(i, { type: e.target.value as RecapColumn['type'] })}>
              {Object.entries(COLUMN_TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <button onClick={() => setDraft((d) => d.filter((_, j) => j !== i))} aria-label="Hapus kolom" title="Hapus kolom" style={{ ...btn(false), padding: '6px 10px' }}><Trash2 size={13} /></button>
          </div>
        ))}
      </div>
      {error && <p style={{ color: '#ba1a1a', fontFamily: f, fontSize: '0.78rem', marginBottom: '8px' }}>{error}</p>}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={() => setDraft((d) => [...d, { label: '', type: 'text' }])} style={btn(false)}><Plus size={13} /> Tambah kolom</button>
        <span style={{ flex: 1 }} />
        <button onClick={onClose} style={btn(false)}>Batal</button>
        <button onClick={save} disabled={busy} style={{ ...btn(), opacity: busy ? 0.6 : 1 }}>{busy ? 'Menyimpan...' : 'Simpan Kolom'}</button>
      </div>
    </div>
  );
}

const STATUS_STYLE = { paid: { bg: '#d1fae5', fg: '#065F46', border: '#6ee7b7' }, unpaid: { bg: '#fef3c7', fg: '#92400E', border: '#fcd34d' } };

/** Dropdown status ala sheet (pill + ▾), jelas bisa diganti. */
function StatusSelect({ paid, paidAt, busy, onChange }: { paid: boolean; paidAt: string; busy: boolean; onChange: (paid: boolean) => void }) {
  const st = STATUS_STYLE[paid ? 'paid' : 'unpaid'];
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }} title={paid && paidAt ? `Lunas ${paidAt}` : 'Ganti status pembayaran'}>
      <select
        value={paid ? 'paid' : 'unpaid'}
        disabled={busy}
        onChange={(e) => onChange(e.target.value === 'paid')}
        aria-label="Status pembayaran"
        style={{
          appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', fontFamily: f, fontSize: '0.72rem', fontWeight: 700,
          padding: '4px 26px 4px 12px', borderRadius: '999px', border: `1.5px solid ${st.border}`, background: st.bg, color: st.fg, opacity: busy ? 0.5 : 1,
        }}
      >
        <option value="unpaid">Belum Lunas</option>
        <option value="paid">Lunas</option>
      </select>
      <ChevronDown size={13} color={st.fg} style={{ position: 'absolute', right: '9px', pointerEvents: 'none' }} />
    </span>
  );
}

/** Jatuh tempo bisa diubah langsung; merah kalau belum lunas & sudah lewat. */
function DueDateInput({ value, overdue, paid, busy, onChange }: { value: string; overdue: boolean; paid: boolean; busy: boolean; onChange: (v: string) => void }) {
  return (
    <input
      type="date"
      value={value}
      disabled={busy}
      onChange={(e) => onChange(e.target.value)}
      title={overdue ? 'Belum lunas & sudah lewat jatuh tempo' : 'Ubah jatuh tempo'}
      style={{
        ...input, padding: '3px 8px', fontSize: '0.74rem', cursor: 'pointer', opacity: busy ? 0.5 : 1,
        ...(overdue ? { background: '#fee2e2', borderColor: '#fca5a5', color: '#b91c1c', fontWeight: 700 } : paid ? { color: '#8a8a99' } : {}),
      }}
    />
  );
}

type AutoFee = 'feeCreator' | 'feePic' | 'feeMg';
type FeeField = AutoFee | 'reimburse' | 'ads' | 'opex';
const FEE_FIELDS: { key: FeeField; label: string }[] = [
  { key: 'feeCreator', label: 'Fee Creator' }, { key: 'feePic', label: 'Fee PIC' }, { key: 'feeMg', label: 'Fee MG' },
  { key: 'reimburse', label: 'Reimburse' }, { key: 'ads', label: 'Ads' }, { key: 'opex', label: 'Opex' },
];
const AUTO_FEES: FeeField[] = ['feeCreator', 'feePic', 'feeMg'];
interface FinanceRecord extends Record<FeeField, number> {
  feeManual: AutoFee[];
  auto: { acceptedCount: number; perCreator: Record<AutoFee, number>; totals: Record<AutoFee, number> };
}

/**
 * Editor uang keluar satu campaign (= tab Finance campaign, PATCH /campaigns/:id/finance) + preview profit.
 * Profit = uang masuk − uang keluar, jadi diubah lewat rincian ini, bukan diketik langsung.
 * Grup tanpa campaign: pilih campaign dulu (uang keluar diambil dari campaign itu).
 */
function ExpenseEditor({ group, campaigns, onClose, onSaved }: {
  group: Group; campaigns: { _id: string; name: string }[]; onClose: () => void; onSaved: () => void;
}) {
  const [record, setRecord] = useState<FinanceRecord | null>(null);
  const [draft, setDraft] = useState<Partial<Record<FeeField, number | null>>>({});
  const [linkTo, setLinkTo] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!group.campaignId) return;
    api.get(`/admin/campaigns/${group.campaignId}/finance`).then((res) => setRecord(res.data)).catch(() => setError('Gagal memuat data biaya campaign.'));
  }, [group.campaignId]);

  // Nilai tampil: draft (null = kembali otomatis) > record
  const valueOf = (k: FeeField) => {
    const d = draft[k];
    if (d === null) return record?.auto.totals[k as AutoFee] ?? 0;
    return d ?? record?.[k] ?? 0;
  };
  const isManual = (k: FeeField) => AUTO_FEES.includes(k) && (draft[k] === null ? false : draft[k] !== undefined || !!record?.feeManual.includes(k as AutoFee));
  const total = FEE_FIELDS.reduce((sum, { key }) => sum + valueOf(key), 0) + group.expense.custom;
  const profit = group.income - total;

  const save = async () => {
    setBusy(true); setError('');
    try {
      if (!group.campaignId) {
        await Promise.all(group.invoices.map((inv) => api.patch(`/admin/finance-recap/invoices/${inv._id}`, { campaignId: linkTo })));
      } else if (Object.keys(draft).length) {
        await api.patch(`/admin/campaigns/${group.campaignId}/finance`, draft);
      }
      onSaved();
    } catch {
      setError('Gagal menyimpan.');
      setBusy(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(25,28,32,0.45)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ ...cardStyle, marginBottom: 0, width: 'min(560px, 100%)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '4px' }}>
          <p style={{ fontFamily: f, fontWeight: 800, fontSize: '1rem', flex: 1 }}>Uang Keluar · {group.campaign}</p>
          <button onClick={onClose} aria-label="Tutup" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#464652' }}><X size={18} /></button>
        </div>

        {!group.campaignId ? (
          <>
            <p style={{ fontFamily: f, fontSize: '0.78rem', color: '#464652', margin: '8px 0 12px' }}>
              Invoice ini belum dihubungkan ke campaign, jadi belum ada data biaya. Pilih campaign-nya: uang keluar diambil dari fee creator/PIC/MG di Recap Payment + reimburse/ads/opex campaign itu.
            </p>
            <select style={{ ...input, width: '100%' }} value={linkTo} onChange={(e) => setLinkTo(e.target.value)}>
              <option value="">— Pilih campaign —</option>
              {campaigns.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </>
        ) : !record ? (
          <p style={{ fontFamily: f, fontSize: '0.82rem', color: '#464652', marginTop: '12px' }}>{error || 'Memuat...'}</p>
        ) : (
          <>
            <p style={{ fontFamily: f, fontSize: '0.74rem', color: '#8a8a99', marginBottom: '14px' }}>
              Sama dengan tab Finance di halaman campaign. Fee otomatis = fee per creator × {record.auto.acceptedCount} creator di-approve; ketik angka untuk mengganti manual.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
              {FEE_FIELDS.map(({ key, label }) => {
                const auto = AUTO_FEES.includes(key);
                const manual = isManual(key);
                return (
                  <label key={key} style={{ display: 'block' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: f, fontSize: '0.72rem', fontWeight: 700, color: '#464652', marginBottom: '4px' }}>
                      {label}
                      {auto && (
                        <span style={{ fontSize: '0.62rem', padding: '1px 7px', borderRadius: '999px', background: manual ? '#fef3c7' : '#eefad8', color: manual ? '#92400E' : '#3d6b00' }}>
                          {manual ? 'Manual' : 'Otomatis'}
                        </span>
                      )}
                    </span>
                    <input type="number" style={{ ...input, width: '100%' }} value={valueOf(key)}
                      onChange={(e) => setDraft((d) => ({ ...d, [key]: Number(e.target.value) || 0 }))} />
                    {auto && manual && (
                      <button type="button" onClick={() => setDraft((d) => ({ ...d, [key]: null }))}
                        style={{ background: 'none', border: 'none', padding: 0, marginTop: '4px', cursor: 'pointer', fontFamily: f, fontSize: '0.68rem', fontWeight: 700, color: '#6728e4' }}>
                        Pakai otomatis ({rupiah(record.auto.totals[key as AutoFee])})
                      </button>
                    )}
                  </label>
                );
              })}
            </div>
            {group.expense.custom > 0 && (
              <p style={{ fontFamily: f, fontSize: '0.72rem', color: '#8a8a99', marginTop: '10px' }}>
                + {rupiah(group.expense.custom)} dari kolom tambahan uang keluar (diubah di panel Data Rekap invoice).
              </p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '16px', padding: '12px', borderRadius: '12px', background: '#f8f9ff' }}>
              {[['Uang Masuk', group.income, '#047857'], ['Uang Keluar', total, '#b91c1c'], ['Profit', profit, profit < 0 ? '#b91c1c' : '#4b2fc4']].map(([l, v, c]) => (
                <div key={l as string}>
                  <p style={{ fontFamily: f, fontSize: '0.7rem', color: '#8a8a99' }}>{l}</p>
                  <p style={{ fontFamily: f, fontWeight: 800, fontSize: '0.95rem', color: c as string }}>{rupiah(v as number)}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {error && record && <p style={{ color: '#ba1a1a', fontFamily: f, fontSize: '0.78rem', marginTop: '10px' }}>{error}</p>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
          <button onClick={onClose} style={btn(false)}>Batal</button>
          <button onClick={save} disabled={busy || (!group.campaignId ? !linkTo : !record || !Object.keys(draft).length)}
            style={{ ...btn(), opacity: busy || (!group.campaignId ? !linkTo : !record || !Object.keys(draft).length) ? 0.6 : 1 }}>
            {busy ? 'Menyimpan...' : group.campaignId ? 'Simpan' : 'Hubungkan'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FinanceRecap() {
  const [mode, setMode] = useState<Mode>('month');
  const [ref, setRef] = useState(() => ymd(new Date()));
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [data, setData] = useState<Recap | null>(null);
  const [error, setError] = useState('');
  const [managing, setManaging] = useState(false);
  const [busyInvoice, setBusyInvoice] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [showHidden, setShowHidden] = useState(false);
  const [confirmHide, setConfirmHide] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<{ _id: string; name: string }[]>([]);
  useEffect(() => { api.get('/admin/campaigns').then((res) => setCampaigns(res.data)).catch(() => {}); }, []);

  const { from, to } = rangeOf(mode, ref, customFrom, customTo);
  const load = useCallback(() => {
    api.get('/admin/finance-recap', { params: { from, to, showHidden: showHidden ? '1' : undefined } })
      .then((res) => { setData(res.data); setError(''); })
      .catch(() => setError('Gagal memuat rekap keuangan.'));
  }, [from, to, showHidden]);
  useEffect(() => { load(); }, [load]);

  /** Sembunyikan / pulihkan semua invoice di satu baris rekap (invoice-nya sendiri tidak dihapus) */
  const setHidden = async (g: Group, hidden: boolean) => {
    setConfirmHide(null);
    try {
      await Promise.all(g.invoices.map((inv) => api.patch(`/admin/finance-recap/invoices/${inv._id}`, { hidden })));
      load();
    } catch {
      setError(hidden ? 'Gagal menghapus baris dari rekap.' : 'Gagal memulihkan baris.');
    }
  };

  /** Ubah field rekap satu invoice (status / jatuh tempo) lalu muat ulang total */
  const patchInvoice = async (id: string, body: Record<string, unknown>) => {
    setBusyInvoice(id);
    try {
      await api.patch(`/admin/finance-recap/invoices/${id}`, body);
      load();
    } catch {
      setError('Gagal menyimpan perubahan invoice.');
    } finally {
      setBusyInvoice(null);
    }
  };

  // PDF butuh token, jadi diambil sebagai blob; tab dibuka sinkron dulu supaya tidak diblokir popup blocker
  const openPdf = async (id: string) => {
    const tab = window.open('', '_blank');
    try {
      const res = await api.get(`/admin/documents/${id}/pdf`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      if (tab) tab.location.href = url; else window.location.assign(url);
    } catch {
      tab?.close();
      setError('Gagal membuka PDF invoice.');
    }
  };

  const exportExcel = async () => {
    setExporting(true);
    try {
      const res = await api.get('/admin/finance-recap/export', { params: { from, to }, responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rekap-keuangan_${from || 'awal'}_${to || 'sekarang'}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('Gagal export Excel.');
    } finally {
      setExporting(false);
    }
  };

  const columns = data?.columns ?? [];
  const t = data?.totals;
  const periodLabel = from || to
    ? `${from ? new Date(`${from}T00:00:00`).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '…'} – ${to ? new Date(`${to}T00:00:00`).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '…'}`
    : 'Semua periode';
  const headers = ['Campaign', 'Perusahaan', 'Contact', 'Bulan Running', 'Master Sheet', 'SOW', 'Tier', 'Jumlah Talent', 'Fee/Talent', 'Total',
    'Total Payment', 'Invoice', 'Status', 'Jatuh Tempo', ...columns.map((c) => c.label), 'Uang Keluar', 'Profit', 'Margin', ''];

  return (
    <div>
      {/* Filter periode */}
      <div style={{ ...cardStyle, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ display: 'inline-flex', background: '#f4f3ff', borderRadius: '999px', padding: '3px', flexWrap: 'wrap' }}>
          {MODES.map((m) => (
            <button key={m.key} onClick={() => setMode(m.key)} style={{
              ...btn(false), border: 'none', padding: '6px 14px',
              background: mode === m.key ? 'var(--secondary)' : 'transparent', color: mode === m.key ? 'white' : '#464652',
            }}>{m.label}</button>
          ))}
        </div>
        {mode === 'week' && <label style={{ fontFamily: f, fontSize: '0.78rem' }}>Minggu yang memuat <input type="date" style={input} value={ref} onChange={(e) => e.target.value && setRef(e.target.value)} /></label>}
        {mode === 'month' && <input type="month" style={input} value={ref.slice(0, 7)} onChange={(e) => e.target.value && setRef(`${e.target.value}-01`)} />}
        {mode === 'year' && (
          <input type="number" style={{ ...input, width: '100px' }} min={2020} max={2100} value={ref.slice(0, 4)}
            onChange={(e) => /^\d{4}$/.test(e.target.value) && setRef(`${e.target.value}-01-01`)} />
        )}
        {mode === 'custom' && (
          <span style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', fontFamily: f, fontSize: '0.78rem' }}>
            <input type="date" style={input} value={customFrom} max={customTo || undefined} onChange={(e) => setCustomFrom(e.target.value)} />
            s/d
            <input type="date" style={input} value={customTo} min={customFrom || undefined} onChange={(e) => setCustomTo(e.target.value)} />
          </span>
        )}
        <span style={{ fontFamily: f, fontSize: '0.78rem', color: '#8a8a99' }}>{periodLabel} · berdasarkan tanggal invoice</span>
        <span style={{ flex: 1 }} />
        {(showHidden || !!t?.hiddenCount) && (
          <button onClick={() => setShowHidden((v) => !v)} style={{ ...btn(false), ...(showHidden && { background: '#f4f3ff', borderColor: '#c4b5fd' }) }}>
            <EyeOff size={13} /> {showHidden ? 'Sembunyikan yang dihapus' : `Lihat yang dihapus (${t?.hiddenCount})`}
          </button>
        )}
        <button onClick={() => setManaging((v) => !v)} style={btn(false)}><Columns3 size={13} /> Kolom Tambahan</button>
        <button onClick={exportExcel} disabled={exporting || !data?.groups.length} style={{ ...btn(), opacity: exporting || !data?.groups.length ? 0.6 : 1 }}>
          <FileSpreadsheet size={13} /> {exporting ? 'Menyiapkan...' : 'Export Excel'}
        </button>
      </div>

      {editingGroup && (
        <ExpenseEditor group={editingGroup} campaigns={campaigns} onClose={() => setEditingGroup(null)} onSaved={() => { setEditingGroup(null); load(); }} />
      )}
      <style>{`.recap-table-scroll button:hover { border-color: #c4b5fd !important; background: #f4f3ff !important; }`}</style>

      {managing && data && <ColumnManager columns={columns} onClose={() => setManaging(false)} onSaved={() => { setManaging(false); load(); }} />}

      {error && (
        <div style={{ ...cardStyle, background: '#fff5f5', borderColor: '#fecaca', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ba1a1a', fontFamily: f, fontSize: '0.82rem' }}>
          <AlertTriangle size={14} /> <span style={{ flex: 1 }}>{error}</span>
          <button onClick={() => setError('')} style={{ ...btn(false), padding: '4px 10px' }}>Tutup</button>
        </div>
      )}

      {/* Ringkasan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        <SummaryCard icon={ArrowDownCircle} color="#047857" label="Total Uang Masuk" value={rupiah(t?.income ?? 0)} hint={`${t?.paidCount ?? 0} dari ${t?.invoiceCount ?? 0} invoice lunas`} />
        <SummaryCard icon={ArrowUpCircle} color="#b91c1c" label="Total Uang Keluar" value={rupiah(t?.expense ?? 0)} hint="fee creator/PIC/MG + reimburse/ads/opex" />
        <SummaryCard icon={TrendingUp} color="#4b2fc4" label="Profit" value={rupiah(t?.profit ?? 0)} hint={t?.margin != null ? `margin ${t.margin}%` : 'belum ada uang masuk'} />
        <SummaryCard icon={Clock} color="#b45309" label="Piutang (Belum Lunas)" value={rupiah(t?.receivable ?? 0)} hint={t?.overdue ? `${rupiah(t.overdue)} sudah lewat jatuh tempo` : 'total invoice yang belum dibayar'} />
      </div>

      <div style={cardStyle}>
        {!data ? (
          <p style={{ fontFamily: f, fontSize: '0.85rem', color: '#464652' }}>Memuat...</p>
        ) : data.groups.length === 0 ? (
          <p style={{ fontFamily: f, fontSize: '0.85rem', color: '#464652' }}>
            Belum ada invoice di periode ini. Buat di menu <Link to="/admin/documents/invoice" style={{ color: '#4b2fc4', fontWeight: 600 }}>Invoice</Link>.
          </p>
        ) : (
          <div style={{ overflow: 'auto', maxHeight: 'calc(100vh - 220px)' }} className="recap-table-scroll">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', fontFamily: f }}>
              <thead><tr>{headers.map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
              <tbody>
                {data.groups.map((g) => {
                  const items = g.items.length ? g.items : [null];
                  const span = items.length;
                  const e = g.expense;
                  const breakdown = [['Fee creator', e.feeCreator], ['Fee PIC', e.feePic], ['Fee MG', e.feeMg], ['Reimburse', e.reimburse], ['Ads', e.ads], ['Opex', e.opex], ['Kolom tambahan', e.custom]]
                    .filter(([, v]) => v).map(([k, v]) => `${k}: ${rupiah(v as number)}`).join('\n');
                  const groupCell = (content: React.ReactNode, extra: React.CSSProperties = {}) => <td rowSpan={span} style={{ ...td, borderRight: '1px solid #f0f0f0', ...extra }}>{content}</td>;
                  return (
                    <Fragment key={g.key}>
                      {items.map((it, i) => (
                        <tr key={i} style={g.hidden ? { opacity: 0.5, background: '#fafafa' } : undefined} title={g.hidden ? 'Dihapus dari rekap, tidak ikut dihitung' : undefined}>
                          {i === 0 && (
                            <>
                              {groupCell(
                                <>
                                  <span style={{ fontWeight: 700 }}>{g.campaign}</span>
                                  {!g.campaignId && <span title="Hubungkan ke campaign di panel Data Rekap invoice supaya uang keluar terhitung" style={{ display: 'block', fontSize: '0.68rem', color: '#b45309' }}>belum dihubungkan ke campaign</span>}
                                  {g.approvedCreators !== null && (
                                    <span style={{ display: 'block', fontSize: '0.68rem', color: '#8a8a99' }}>{g.approvedCreators} creator di-approve</span>
                                  )}
                                  {g.talentWarning && (
                                    <span style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', marginTop: '4px', fontSize: '0.68rem', color: '#b91c1c', maxWidth: '200px' }}>
                                      <AlertTriangle size={11} style={{ flexShrink: 0, marginTop: '2px' }} /> {g.talentWarning}
                                    </span>
                                  )}
                                </>,
                                { minWidth: '150px' },
                              )}
                              {groupCell(g.company || '-')}
                              {groupCell(g.contact || '-', { fontSize: '0.74rem', color: '#464652' })}
                              {groupCell(monthLabel(g.runningMonth), { whiteSpace: 'nowrap' })}
                              {groupCell(g.mastersheetUrl ? <a href={g.mastersheetUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#4b2fc4', fontWeight: 600, whiteSpace: 'nowrap' }}>Buka Sheet ↗</a> : '-')}
                            </>
                          )}
                          <td style={{ ...td, minWidth: '180px' }}>{it?.sow || '-'}</td>
                          <td style={td}><TierPill tier={it?.tier ?? ''} /></td>
                          <td style={{ ...td, textAlign: 'center' }}>{it ? it.qty : '-'}</td>
                          <td style={{ ...td, whiteSpace: 'nowrap' }}>{it ? rupiah(it.unitFee) : '-'}</td>
                          <td style={{ ...td, whiteSpace: 'nowrap' }}>{it ? rupiah(it.amount) : '-'}</td>
                          {i === 0 && (
                            <>
                              {groupCell(<strong>{rupiah(g.totalInvoice)}</strong>, { background: '#fef9e7', whiteSpace: 'nowrap' })}
                              {/* Invoice, Status, Jatuh Tempo: 1 baris per invoice, tinggi baris sama supaya sejajar antar kolom */}
                              {groupCell(invoiceList(g, (inv) => (
                                <button onClick={() => openPdf(inv._id)} title={`Buka PDF · ${rupiah(inv.total)} · ${inv.issueDate}`}
                                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: f, fontSize: '0.76rem', fontWeight: 600, color: '#4b2fc4', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                                  {inv.number || '-'} ↗
                                </button>
                              )))}
                              {groupCell(invoiceList(g, (inv) => (
                                <StatusSelect paid={inv.paid} paidAt={inv.paidAt} busy={busyInvoice === inv._id}
                                  onChange={(paid) => patchInvoice(inv._id, { status: paid ? 'paid' : 'unpaid' })} />
                              )))}
                              {groupCell(invoiceList(g, (inv) => (
                                <DueDateInput value={inv.dueDate} overdue={inv.overdue} paid={inv.paid} busy={busyInvoice === inv._id}
                                  onChange={(v) => patchInvoice(inv._id, { dueDate: v })} />
                              )))}
                              {columns.map((c) => {
                                const v = g.custom[c.key];
                                return <Fragment key={c.key}>{groupCell(v === undefined ? '-' : c.type === 'text' ? String(v) : rupiah(Number(v)), { whiteSpace: c.type === 'text' ? 'normal' : 'nowrap' })}</Fragment>;
                              })}
                              {/* Uang keluar & profit: klik → editor rincian biaya (profit = masuk − keluar) */}
                              {groupCell(
                                <button onClick={() => setEditingGroup(g)} title={`${breakdown || 'Belum ada biaya'}\n\nKlik untuk ubah`} style={editableCell('#b91c1c')}>
                                  {rupiah(e.total)} <Pencil size={11} />
                                </button>, { whiteSpace: 'nowrap' })}
                              {groupCell(
                                <button onClick={() => setEditingGroup(g)} title="Profit = uang masuk − uang keluar. Klik untuk ubah rincian uang keluar" style={{ ...editableCell(g.profit < 0 ? '#b91c1c' : '#047857'), fontWeight: 800 }}>
                                  {rupiah(g.profit)} <Pencil size={11} />
                                </button>, { whiteSpace: 'nowrap' })}
                              {groupCell(g.margin != null ? `${g.margin}%` : '-', { whiteSpace: 'nowrap' })}
                              {groupCell(g.hidden ? (
                                <button onClick={() => setHidden(g, false)} title="Kembalikan ke rekap" style={{ ...btn(false), padding: '5px 10px', whiteSpace: 'nowrap' }}><RotateCcw size={12} /> Pulihkan</button>
                              ) : confirmHide === g.key ? (
                                <span style={{ display: 'inline-flex', flexDirection: 'column', gap: '6px', fontSize: '0.72rem', color: '#ba1a1a', whiteSpace: 'nowrap' }}>
                                  Hapus dari rekap?
                                  <span style={{ display: 'inline-flex', gap: '4px' }}>
                                    <button onClick={() => setHidden(g, true)} style={{ ...btn(), background: '#ba1a1a', padding: '5px 10px' }}>Ya, hapus</button>
                                    <button onClick={() => setConfirmHide(null)} style={{ ...btn(false), padding: '5px 10px' }}>Batal</button>
                                  </span>
                                </span>
                              ) : (
                                <button onClick={() => setConfirmHide(g.key)} aria-label="Hapus dari rekap" title="Hapus dari rekap (invoice tetap ada di menu Invoice, bisa dipulihkan)"
                                  style={{ ...btn(false), padding: '6px 9px' }}><Trash2 size={13} /></button>
                              ))}
                            </>
                          )}
                        </tr>
                      ))}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
