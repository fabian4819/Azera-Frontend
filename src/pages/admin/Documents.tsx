import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, FileDown, Pencil, Trash2, ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import api from '../../lib/api';

/**
 * Menu Document (AD-34..36): Quotation, Invoice, SPK dari template Google Docs klien.
 * Form digerakkan config per jenis — field = bagian [ ] di template. PDF dirender server.
 */

const f = 'var(--font-display)';
const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)', marginBottom: '20px',
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 13px', borderRadius: '12px', border: '1.5px solid #c7c8cf',
  fontSize: '0.85rem', color: '#191c20', background: 'white', outline: 'none', fontFamily: f,
};
const labelStyle: React.CSSProperties = { display: 'block', fontWeight: 600, fontSize: '0.78rem', color: '#191c20', marginBottom: '5px', fontFamily: f };
const btn = (primary = true): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '999px', cursor: 'pointer',
  fontFamily: f, fontSize: '0.8rem', fontWeight: 600, border: primary ? 'none' : '1.5px solid #c7c8cf',
  background: primary ? 'var(--secondary)' : 'white', color: primary ? 'white' : '#191c20',
});

type Data = Record<string, unknown>;
type FieldType = 'text' | 'textarea' | 'date' | 'number' | 'select';
interface Field { key: string; label: string; type?: FieldType; placeholder?: string; options?: { value: string; label: string }[]; wide?: boolean }
interface ItemsField { items: string; columns: Field[] }
interface RightField { right: string; label: string; fields: Field[] }
interface Section { title: string; fields: (Field | ItemsField | RightField)[] }
interface DocConfig { apiType: string; title: string; sections: Section[]; defaults: () => Data }

const today = (plusDays = 0) => new Date(Date.now() + plusDays * 86400000).toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
const NUMBER_HINT = 'Kosongkan = otomatis saat disimpan';

const CONFIGS: Record<string, DocConfig> = {
  quotation: {
    apiType: 'quotation', title: 'Quotation',
    defaults: () => ({ issueDate: today(), validUntil: today(14), items: [{}], approval: { proposedDate: today() } }),
    sections: [
      { title: 'Informasi Quotation', fields: [
        { key: 'number', label: 'Quotation No.', placeholder: NUMBER_HINT },
        { key: 'issueDate', label: 'Issued Date', type: 'date' },
        { key: 'validUntil', label: 'Valid Until', type: 'date' },
      ] },
      { title: 'Client Information', fields: [
        { key: 'client.company', label: 'Company / Brand', placeholder: 'Nama legal perusahaan / brand' },
        { key: 'client.tax', label: 'Tax Information', placeholder: 'NPWP 01.234.567.8-901.000 / Non-NPWP' },
        { key: 'client.address', label: 'Address', type: 'textarea', placeholder: 'Alamat lengkap perusahaan', wide: true },
        { key: 'client.picName', label: 'PIC — Nama Lengkap' },
        { key: 'client.picPosition', label: 'PIC — Jabatan' },
        { key: 'client.picContact', label: 'PIC — Telepon / Email' },
      ] },
      { title: 'Campaign Information', fields: [
        { key: 'campaign.name', label: 'Campaign / Product Name', wide: true },
        { key: 'campaign.period', label: 'Campaign Period', placeholder: '1–31 Oktober 2026' },
        { key: 'campaign.postingDate', label: 'Expected Posting Date', placeholder: '10–20 Oktober 2026' },
        { key: 'campaign.tier', label: 'Tier Followers', placeholder: 'Nano (1K–10K)' },
        { key: 'campaign.platform', label: 'Platform', placeholder: 'TikTok, Instagram' },
        { key: 'campaign.niche', label: 'Niche' },
        { key: 'campaign.demographic', label: 'Demographic', placeholder: 'Wanita 20–35, Jawa Tengah' },
      ] },
      { title: 'Scope of Work and Investment', fields: [
        { items: 'items', columns: [
          { key: 'name', label: 'Service / Deliverable', placeholder: 'KOL tier and activation service' },
          { key: 'sow', label: 'SOW', placeholder: '1x TikTok Video + IG Reels Mirror' },
          { key: 'qty', label: 'Qty', type: 'number' },
          { key: 'unitFee', label: 'Net Unit Fee (Rp)', type: 'number' },
        ] },
      ] },
      { title: 'Approval', fields: [
        { key: 'approval.proposedDate', label: 'Tanggal Proposed (Azera)', type: 'date' },
        { key: 'approval.approverName', label: 'Approved By — Nama', placeholder: 'Kosongkan kalau belum ditandatangani' },
        { key: 'approval.approverCompany', label: 'Approved By — Perusahaan' },
        { key: 'approval.approvedDate', label: 'Tanggal Approved', type: 'date' },
      ] },
    ],
  },
  invoice: {
    apiType: 'invoice', title: 'Invoice',
    defaults: () => ({ issueDate: today(), dueDate: today(7), items: [{}] }),
    sections: [
      { title: 'Informasi Invoice', fields: [
        { key: 'number', label: 'Invoice No.', placeholder: NUMBER_HINT },
        { key: 'reference', label: 'Reference', placeholder: 'Quotation / SPK No.' },
        { key: 'issueDate', label: 'Issued Date', type: 'date' },
        { key: 'dueDate', label: 'Due Date', type: 'date' },
      ] },
      { title: 'Bill To', fields: [
        { key: 'billTo.name', label: 'Legal Company / Brand Name', wide: true },
        { key: 'billTo.pic', label: 'PIC' },
        { key: 'billTo.npwp', label: 'NPWP' },
        { key: 'billTo.contact', label: 'Contact', placeholder: 'Telepon / email', wide: true },
      ] },
      { title: 'Invoice Details', fields: [
        { items: 'items', columns: [
          { key: 'name', label: 'Service / Description', placeholder: 'Campaign / service name' },
          { key: 'description', label: 'Keterangan', placeholder: 'Deliverables / periode / creator tier' },
          { key: 'qty', label: 'Qty', type: 'number' },
          { key: 'unitFee', label: 'Unit Fee (Rp)', type: 'number' },
        ] },
      ] },
    ],
  },
  spk: {
    apiType: 'spk_brand', title: 'SPK',
    defaults: () => ({
      signDate: today(), city: 'Semarang', lampiran1: { mechanism: 'dengan' },
      lampiran2: { termin1: { percent: 50 }, termin2: { percent: 50 } },
    }),
    sections: [
      { title: 'Informasi SPK', fields: [
        { key: 'number', label: 'Nomor SPK', placeholder: NUMBER_HINT },
        { key: 'signDate', label: 'Tanggal Penandatanganan', type: 'date' },
        { key: 'city', label: 'Kota Penandatanganan' },
      ] },
      { title: 'Pihak Kedua (Klien)', fields: [
        { key: 'client.company', label: 'Nama Badan Usaha Klien', wide: true },
        { key: 'client.signer', label: 'Nama Penandatangan' },
        { key: 'client.position', label: 'Jabatan' },
        { key: 'client.npwp', label: 'NPWP' },
        { key: 'client.address', label: 'Alamat Lengkap', type: 'textarea', wide: true },
      ] },
      { title: 'Lampiran 1 — Detail Campaign dan Ruang Lingkup', fields: [
        { key: 'lampiran1.campaignName', label: 'Nama Campaign' },
        { key: 'lampiran1.brandProduct', label: 'Brand / Produk' },
        { key: 'lampiran1.periodStart', label: 'Periode — Mulai', type: 'date' },
        { key: 'lampiran1.periodEnd', label: 'Periode — Selesai', type: 'date' },
        { key: 'lampiran1.platform', label: 'Platform', placeholder: 'TikTok / Instagram / X / Threads / Lainnya' },
        { key: 'lampiran1.sampleList', label: 'Referensi Sample List', placeholder: 'Tautan sample list' },
        { key: 'lampiran1.targetKol', label: 'Target KOL', type: 'textarea', placeholder: 'Jumlah, tier, domisili, niche, kriteria', wide: true },
        { key: 'lampiran1.sampleApprovedVia', label: 'Sample Disetujui Melalui', placeholder: 'WhatsApp / Email / Media lain' },
        { key: 'lampiran1.sampleApprovedDate', label: 'Tanggal Sample Disetujui', type: 'date' },
        { key: 'lampiran1.mechanism', label: 'Mekanisme Pemilihan Full Listing', type: 'select', wide: true, options: [
          { value: 'dengan', label: 'Dengan approval klien (approval full listing maks. 3 hari kerja)' },
          { value: 'tanpa', label: 'Tanpa approval individual klien' },
        ] },
        { key: 'lampiran1.deliverables', label: 'Deliverables', type: 'textarea', placeholder: 'Jumlah dan jenis konten per KOL', wide: true },
        { key: 'lampiran1.extraActivities', label: 'Aktivitas Tambahan', placeholder: 'Visit / Live / Event / Product delivery — kosong = Tidak Ada' },
        { key: 'lampiran1.airingDuration', label: 'Masa Tayang', placeholder: 'Durasi konten wajib tetap tayang' },
        { key: 'lampiran1.revisions', label: 'Revisi Termasuk', placeholder: 'Jumlah revisi / batasan' },
        { key: 'lampiran1.reporting', label: 'Insight & Laporan', placeholder: 'Metrik, format, dan deadline' },
        { key: 'lampiran1.picAzera', label: 'PIC Azera', placeholder: 'Nama | Email | WhatsApp' },
        { key: 'lampiran1.picClient', label: 'PIC Klien', placeholder: 'Nama | Email | WhatsApp' },
      ] },
      { title: 'Hak Penggunaan Konten', fields: [
        { right: 'rights.repost', label: 'Repost organic di akun brand', fields: [{ key: 'duration', label: 'Durasi' }, { key: 'platform', label: 'Platform' }] },
        { right: 'rights.paidAds', label: 'Paid media / ads', fields: [{ key: 'duration', label: 'Durasi' }, { key: 'region', label: 'Wilayah' }] },
        { right: 'rights.whitelisting', label: 'Whitelisting / code boost', fields: [{ key: 'duration', label: 'Durasi' }] },
        { right: 'rights.editing', label: 'Editing / cutdown', fields: [{ key: 'limit', label: 'Batasan' }] },
        { right: 'rights.exclusivity', label: 'Exclusivity', fields: [{ key: 'category', label: 'Kategori' }, { key: 'duration', label: 'Durasi' }] },
      ] },
      { title: 'Lampiran 2 — Nilai Kerja Sama dan Pembayaran', fields: [
        { key: 'lampiran2.serviceFee', label: 'Nilai Jasa (Rp)', type: 'number' },
        { key: 'lampiran2.additionalFee', label: 'Biaya Tambahan (Rp) — kosong = Tidak Ada', type: 'number' },
        { key: 'lampiran2.termin1.percent', label: 'Termin 1 — %', type: 'number' },
        { key: 'lampiran2.termin1.amount', label: 'Termin 1 — Rp', type: 'number' },
        { key: 'lampiran2.termin1.due', label: 'Termin 1 — Jatuh Tempo', placeholder: 'Tanggal atau keterangan', wide: true },
        { key: 'lampiran2.termin2.percent', label: 'Termin 2 — %', type: 'number' },
        { key: 'lampiran2.termin2.amount', label: 'Termin 2 — Rp', type: 'number' },
        { key: 'lampiran2.termin2.due', label: 'Termin 2 — Jatuh Tempo', placeholder: 'Tanggal atau keterangan', wide: true },
        { key: 'lampiran2.otherTermin', label: 'Termin Lain', placeholder: 'Jika ada — kosong = Tidak Ada' },
        { key: 'lampiran2.cancellationFee', label: 'Biaya Pembatalan', placeholder: 'Rumus/persentase + biaya yang sudah timbul' },
        { key: 'lampiran2.exceptions', label: 'Ketentuan Standar yang Dikecualikan', type: 'textarea', placeholder: 'Sebutkan pasal & ketentuan penggantinya — kosong = Tidak Ada', wide: true },
        { key: 'lampiran2.clientNotice', label: 'Alamat Pemberitahuan Pihak Kedua', placeholder: 'Email | Nomor WhatsApp | Alamat', wide: true },
      ] },
    ],
  },
};

function getPath(o: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, k) => (acc && typeof acc === 'object' ? (acc as Data)[k] : undefined), o);
}
function setPath(o: Data, path: string, value: unknown): Data {
  const [head, ...rest] = path.split('.');
  if (!rest.length) return { ...o, [head]: value };
  const child = o[head] && typeof o[head] === 'object' ? (o[head] as Data) : {};
  return { ...o, [head]: setPath(child, rest.join('.'), value) };
}
const rupiah = (v: number) => `Rp${Math.round(v).toLocaleString('id-ID')}`;

function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const common = { style: inputStyle, placeholder: field.placeholder, 'aria-label': field.label };
  const str = value === undefined || value === null ? '' : String(value);
  if (field.type === 'textarea') return <textarea {...common} rows={2} value={str} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />;
  if (field.type === 'select') return (
    <select {...common} value={str} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
      {field.options!.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
  if (field.type === 'number') return <input {...common} type="number" min={0} value={str} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} />;
  return <input {...common} type={field.type === 'date' ? 'date' : 'text'} value={str} onChange={(e) => onChange(e.target.value)} />;
}

interface ListRow { _id: string; number: string; client: string; updatedAt: string }

const fetchRows = (apiType: string): Promise<ListRow[]> =>
  api.get('/admin/documents', { params: { type: apiType } }).then((res) => res.data);

export default function Documents() {
  const { type = 'quotation' } = useParams();
  const config = CONFIGS[type];
  const [rows, setRows] = useState<ListRow[]>([]);
  const [editing, setEditing] = useState<{ id: string | null; data: Data } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!config) return () => {};
    let alive = true;
    fetchRows(config.apiType)
      .then((data) => { if (alive) setRows(data); })
      .catch(() => { if (alive) setError('Gagal memuat daftar dokumen.'); });
    return () => { alive = false; };
  }, [config]);

  // Pindah jenis dokumen (Quotation ↔ Invoice ↔ SPK) = reset editor & muat daftar jenis itu
  const [shownType, setShownType] = useState(type);
  if (shownType !== type) {
    setShownType(type);
    setEditing(null); setError(''); setNotice(''); setConfirmDelete(null);
  }
  useEffect(() => load(), [load]);

  if (!config) return <p style={{ fontFamily: f }}>Jenis dokumen tidak dikenal.</p>;

  const openPdf = async (id: string) => {
    // Buka tab dulu secara sinkron — window.open setelah await diblokir popup blocker
    const tab = window.open('', '_blank');
    try {
      const res = await api.get(`/admin/documents/${id}/pdf`, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      if (tab) tab.location.href = url; else window.location.href = url;
    } catch {
      tab?.close();
      setError('Gagal membuat PDF.');
    }
  };

  const save = async (thenPdf: boolean) => {
    if (!editing) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const res = editing.id
        ? await api.patch(`/admin/documents/${editing.id}`, { data: editing.data })
        : await api.post('/admin/documents', { type: config.apiType, data: editing.data });
      setEditing({ id: res.data._id, data: res.data.data });
      setNotice(`Tersimpan — nomor ${String(res.data.data.number)}`);
      load();
      if (thenPdf) await openPdf(res.data._id);
    } catch {
      setError('Gagal menyimpan dokumen.');
    } finally {
      setBusy(false);
    }
  };

  const edit = async (id: string) => {
    setError(''); setNotice('');
    try {
      const res = await api.get(`/admin/documents/${id}`);
      setEditing({ id, data: res.data.data });
    } catch {
      setError('Gagal membuka dokumen.');
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/admin/documents/${id}`);
      setConfirmDelete(null);
      load();
    } catch {
      setError('Gagal menghapus dokumen.');
    }
  };

  const banner = (
    <>
      {error && (
        <div style={{ ...cardStyle, background: '#fff5f5', borderColor: '#fecaca', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ba1a1a', fontFamily: f, fontSize: '0.82rem' }}>
          <AlertTriangle size={14} /> <span style={{ flex: 1 }}>{error}</span>
          <button onClick={() => setError('')} style={{ ...btn(false), padding: '4px 10px' }}>Tutup</button>
        </div>
      )}
      {notice && <div style={{ ...cardStyle, background: '#d1fae5', borderColor: '#a7f3d0', padding: '12px 16px', color: '#065F46', fontFamily: f, fontSize: '0.82rem' }}>{notice}</div>}
    </>
  );

  if (editing) {
    const data = editing.data;
    const set = (path: string, v: unknown) => setEditing({ ...editing, data: setPath(data, path, v) });
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <button onClick={() => { setEditing(null); setNotice(''); }} style={btn(false)}><ArrowLeft size={14} /> Kembali ke daftar</button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => save(false)} disabled={busy} style={{ ...btn(false), opacity: busy ? 0.6 : 1 }}><Save size={14} /> Simpan</button>
            <button onClick={() => save(true)} disabled={busy} style={{ ...btn(), opacity: busy ? 0.6 : 1 }}><FileDown size={14} /> {busy ? 'Memproses...' : 'Simpan & Lihat PDF'}</button>
          </div>
        </div>
        {banner}
        {config.sections.map((section) => (
          <div key={section.title} style={cardStyle}>
            <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem', marginBottom: '14px' }}>{section.title}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {section.fields.map((field) => {
                if ('items' in field) {
                  const list = (Array.isArray(data[field.items]) ? data[field.items] : []) as Data[];
                  const total = list.reduce((s, it) => s + (it.qty === '' || it.qty === undefined ? 1 : Number(it.qty)) * (Number(it.unitFee) || 0), 0);
                  const setList = (next: Data[]) => set(field.items, next);
                  return (
                    <div key={field.items} style={{ gridColumn: '1 / -1' }}>
                      {list.map((it, idx) => (
                        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 0.7fr 1.2fr auto', gap: '8px', alignItems: 'end', marginBottom: '10px' }}>
                          {field.columns.map((col) => (
                            <div key={col.key}>
                              {idx === 0 && <label style={labelStyle}>{col.label}</label>}
                              <FieldInput field={col} value={it[col.key]} onChange={(v) => setList(list.map((x, i) => (i === idx ? { ...x, [col.key]: v } : x)))} />
                            </div>
                          ))}
                          <button onClick={() => setList(list.filter((_, i) => i !== idx))} title="Hapus baris" aria-label="Hapus baris" style={{ ...btn(false), padding: '9px' }}><Trash2 size={14} /></button>
                        </div>
                      ))}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                        <button onClick={() => setList([...list, {}])} style={btn(false)}><Plus size={14} /> Tambah Baris</button>
                        <span style={{ fontFamily: f, fontWeight: 700, fontSize: '0.9rem' }}>Total: {rupiah(total)}</span>
                      </div>
                    </div>
                  );
                }
                if ('right' in field) {
                  const enabled = getPath(data, `${field.right}.enabled`) === true;
                  return (
                    <div key={field.right} style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '240px repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', alignItems: 'center' }}>
                      <label style={{ ...labelStyle, marginBottom: 0, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={enabled} onChange={(e) => set(`${field.right}.enabled`, e.target.checked)} />
                        {field.label} — {enabled ? 'YA' : 'TIDAK'}
                      </label>
                      {enabled && field.fields.map((sub) => (
                        <FieldInput key={sub.key} field={{ ...sub, placeholder: sub.label }} value={getPath(data, `${field.right}.${sub.key}`)} onChange={(v) => set(`${field.right}.${sub.key}`, v)} />
                      ))}
                    </div>
                  );
                }
                return (
                  <div key={field.key} style={field.wide ? { gridColumn: '1 / -1' } : undefined}>
                    <label style={labelStyle}>{field.label}</label>
                    <FieldInput field={field} value={getPath(data, field.key)} onChange={(v) => set(field.key, v)} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <p style={{ fontFamily: f, fontSize: '0.85rem', color: '#464652' }}>Isi bagian [ ] template {config.title}, lalu unduh PDF-nya.</p>
        <button onClick={() => { setNotice(''); setEditing({ id: null, data: config.defaults() }); }} style={btn()}><Plus size={14} /> Buat {config.title}</button>
      </div>
      {banner}
      <div style={cardStyle}>
        {rows.length === 0 ? (
          <p style={{ fontFamily: f, fontSize: '0.85rem', color: '#464652' }}>Belum ada {config.title}.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', fontFamily: f }}>
              <thead>
                <tr style={{ background: '#f8f9ff', textAlign: 'left' }}>
                  {['Nomor', 'Klien', 'Terakhir Diubah', ''].map((h) => <th key={h} style={{ padding: '9px 10px', fontWeight: 700 }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '9px 10px', fontWeight: 600, whiteSpace: 'nowrap' }}>{r.number || '-'}</td>
                    <td style={{ padding: '9px 10px' }}>{r.client || '-'}</td>
                    <td style={{ padding: '9px 10px', whiteSpace: 'nowrap' }}>{new Date(r.updatedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                    <td style={{ padding: '9px 10px', whiteSpace: 'nowrap', textAlign: 'right' }}>
                      {confirmDelete === r._id ? (
                        <span style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                          <span style={{ color: '#ba1a1a' }}>Hapus dokumen ini?</span>
                          <button onClick={() => remove(r._id)} style={{ ...btn(), background: '#ba1a1a', padding: '6px 12px' }}>Ya, hapus</button>
                          <button onClick={() => setConfirmDelete(null)} style={{ ...btn(false), padding: '6px 12px' }}>Batal</button>
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', gap: '6px' }}>
                          <button onClick={() => edit(r._id)} style={{ ...btn(false), padding: '6px 12px' }}><Pencil size={13} /> Edit</button>
                          <button onClick={() => openPdf(r._id)} style={{ ...btn(), padding: '6px 12px' }}><FileDown size={13} /> PDF</button>
                          <button onClick={() => setConfirmDelete(r._id)} title="Hapus" aria-label="Hapus" style={{ ...btn(false), padding: '6px 10px' }}><Trash2 size={13} /></button>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
