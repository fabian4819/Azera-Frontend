import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, FileDown, Pencil, Trash2, ArrowLeft, Save, AlertTriangle, ZoomIn, ZoomOut } from 'lucide-react';
import api from '../../lib/api';

/**
 * Menu Document (AD-34..36): Quotation, Invoice, SPK dari template Google Docs klien.
 * Editor = dokumennya sendiri: server merender template mode "edit" (tiap bagian [ ] jadi
 * kotak isian) ke iframe; nilai dibaca langsung dari iframe. PDF final tetap dirender server.
 */

const f = 'var(--font-display)';
const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)', marginBottom: '20px',
};
const btn = (primary = true): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '999px', cursor: 'pointer',
  fontFamily: f, fontSize: '0.8rem', fontWeight: 600, border: primary ? 'none' : '1.5px solid #c7c8cf',
  background: primary ? 'var(--secondary)' : 'white', color: primary ? 'white' : '#191c20',
});

type Data = Record<string, unknown>;
interface DocConfig { apiType: string; title: string; defaults: () => Data }

const today = (plusDays = 0) => new Date(Date.now() + plusDays * 86400000).toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });

const CONFIGS: Record<string, DocConfig> = {
  quotation: {
    apiType: 'quotation', title: 'Quotation',
    defaults: () => ({ issueDate: today(), validUntil: today(14), items: [{}], approval: { proposedDate: today() } }),
  },
  invoice: {
    apiType: 'invoice', title: 'Invoice',
    defaults: () => ({ issueDate: today(), dueDate: today(7), items: [{}] }),
  },
  spk: {
    apiType: 'spk_brand', title: 'SPK',
    defaults: () => ({ signDate: today(), city: 'Semarang', lampiran1: { mechanism: 'dengan' }, lampiran2: { termin1: { percent: 50 }, termin2: { percent: 50 } } }),
  },
};

function getPath(o: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, k) => (acc && typeof acc === 'object' ? (acc as Data)[k] : undefined), o);
}
/** Set nilai di path "a.b.0.c" tanpa mutasi — array (items) tetap array */
function setPath(o: unknown, keys: string[], value: unknown): unknown {
  const [head, ...rest] = keys;
  const base: Record<string, unknown> = Array.isArray(o) ? ([...o] as unknown as Record<string, unknown>) : { ...(o && typeof o === 'object' ? (o as Data) : {}) };
  base[head] = rest.length ? setPath(base[head], rest, value) : value;
  return base;
}
const rupiah = (v: number) => `Rp${Math.round(v).toLocaleString('id-ID')}`;

/** Angka turunan yang ditampilkan template (data-calc) — rumus sama dengan server (docTemplates.ts) */
function computeCalcs(data: Data): Record<string, number> {
  const out: Record<string, number> = {};
  const items = Array.isArray(data.items) ? (data.items as Data[]) : [];
  let subtotal = 0;
  items.forEach((it, i) => {
    const qty = it.qty === '' || it.qty === undefined || it.qty === null ? 1 : Number(it.qty) || 0;
    const amount = qty * (Number(it.unitFee) || 0);
    out[`amount.${i}`] = amount;
    subtotal += amount;
  });
  out.subtotal = subtotal;
  out.total = subtotal - Math.min(Number(data.discount) || 0, subtotal);
  const l2 = (data.lampiran2 ?? {}) as Data;
  out.spkTotal = (Number(l2.serviceFee) || 0) + (Number(l2.additionalFee) || 0);
  return out;
}

/** Nilai elemen isian di iframe. Pakai tagName, bukan instanceof — elemen iframe beda realm */
function readValue(el: HTMLElement): unknown {
  if (el.tagName === 'INPUT') {
    const input = el as HTMLInputElement;
    if (input.type === 'checkbox') return input.checked;
    if (input.dataset.kind === 'number') return input.value === '' ? '' : Number(input.value);
    return input.value;
  }
  if (el.tagName === 'SELECT') return (el as HTMLSelectElement).value;
  return el.innerText.replace(/\n$/, '');
}

/** Buka PDF di tab yang sudah dibuka sinkron (window.open setelah await diblokir popup blocker) */
async function openPdf(id: string, tab: Window | null): Promise<boolean> {
  try {
    const res = await api.get(`/admin/documents/${id}/pdf`, { responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    if (tab) tab.location.href = url; else window.location.href = url;
    return true;
  } catch {
    tab?.close();
    return false;
  }
}

const ZOOM_MIN = 0.5, ZOOM_MAX = 2, ZOOM_STEP = 0.1;

function DocEditor({ config, initialId, initialData, onBack, onSaved }: {
  config: DocConfig; initialId: string | null; initialData: Data; onBack: () => void; onSaved: () => void;
}) {
  const dataRef = useRef<Data>(initialData);
  const idRef = useRef<string | null>(initialId);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const scrollRef = useRef(0);
  const zoomRef = useRef(1);
  const dirtyRef = useRef(false);
  const [html, setHtml] = useState('');
  const [zoom, setZoom] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmLeave, setConfirmLeave] = useState(false);

  const render = useCallback(() => {
    scrollRef.current = iframeRef.current?.contentWindow?.scrollY ?? 0;
    return api.post('/admin/documents/preview', { type: config.apiType, data: dataRef.current })
      .then((res) => setHtml(res.data.html))
      .catch(() => setError('Gagal memuat dokumen.'));
  }, [config.apiType]);

  useEffect(() => { render(); }, [render]);

  const applyZoom = (z: number) => {
    const doc = iframeRef.current?.contentDocument;
    doc?.documentElement.style.setProperty('zoom', String(z));
  };
  useEffect(() => { zoomRef.current = zoom; applyZoom(zoom); }, [zoom]);

  const refreshDerived = (doc: Document) => {
    const data = dataRef.current;
    doc.querySelectorAll<HTMLElement>('[data-mirror]').forEach((el) => {
      const v = String(getPath(data, el.dataset.mirror!) ?? '').trim();
      el.textContent = v || el.dataset.empty || '';
    });
    const calcs = computeCalcs(data);
    doc.querySelectorAll<HTMLElement>('[data-calc]').forEach((el) => {
      const v = calcs[el.dataset.calc!];
      if (v !== undefined) el.textContent = rupiah(v);
    });
  };

  // Tiap render = dokumen iframe baru, jadi listener dipasang ulang di sini (tidak dobel)
  const onLoad = () => {
    const win = iframeRef.current?.contentWindow;
    const doc = iframeRef.current?.contentDocument;
    if (!win || !doc) return;
    applyZoom(zoomRef.current);
    win.scrollTo(0, scrollRef.current);
    doc.addEventListener('input', (e) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('[data-k]');
      if (!el) return;
      dataRef.current = setPath(dataRef.current, el.dataset.k!.split('.'), readValue(el)) as Data;
      dirtyRef.current = true;
      refreshDerived(doc);
    });
    doc.addEventListener('change', (e) => {
      if ((e.target as HTMLElement).closest('[data-rerender]')) render();
    });
    doc.addEventListener('click', (e) => {
      const button = (e.target as HTMLElement).closest<HTMLElement>('[data-action]');
      if (!button) return;
      const items = Array.isArray(dataRef.current.items) ? [...(dataRef.current.items as Data[])] : [];
      if (button.dataset.action === 'add-item') items.push({});
      if (button.dataset.action === 'del-item') items.splice(Number(button.dataset.i), 1);
      dataRef.current = { ...dataRef.current, items };
      dirtyRef.current = true;
      render();
    });
  };

  const save = async (thenPdf: boolean) => {
    const tab = thenPdf ? window.open('', '_blank') : null;
    setBusy(true); setError(''); setNotice('');
    try {
      const res = idRef.current
        ? await api.patch(`/admin/documents/${idRef.current}`, { data: dataRef.current })
        : await api.post('/admin/documents', { type: config.apiType, data: dataRef.current });
      idRef.current = res.data._id;
      dataRef.current = res.data.data;
      dirtyRef.current = false;
      setNotice(`Tersimpan — nomor ${String(res.data.data.number)}`);
      onSaved();
      render(); // tampilkan nomor otomatis yang baru didapat
      if (thenPdf && !(await openPdf(res.data._id, tab))) setError('Tersimpan, tapi gagal membuat PDF.');
    } catch {
      tab?.close();
      setError('Gagal menyimpan dokumen.');
    } finally {
      setBusy(false);
    }
  };

  const back = () => {
    if (dirtyRef.current) setConfirmLeave(true);
    else onBack();
  };
  const changeZoom = (delta: number) => setZoom((z) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round((z + delta) * 10) / 10)));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <button onClick={back} style={btn(false)}><ArrowLeft size={14} /> Kembali ke daftar</button>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'white', border: '1.5px solid #c7c8cf', borderRadius: '999px', padding: '3px' }}>
          <button onClick={() => changeZoom(-ZOOM_STEP)} disabled={zoom <= ZOOM_MIN} aria-label="Perkecil" title="Perkecil" style={{ ...btn(false), border: 'none', padding: '6px 10px' }}><ZoomOut size={15} /></button>
          <button onClick={() => setZoom(1)} title="Kembali ke 100%" style={{ ...btn(false), border: 'none', padding: '6px 8px', minWidth: '56px', justifyContent: 'center' }}>{Math.round(zoom * 100)}%</button>
          <button onClick={() => changeZoom(ZOOM_STEP)} disabled={zoom >= ZOOM_MAX} aria-label="Perbesar" title="Perbesar" style={{ ...btn(false), border: 'none', padding: '6px 10px' }}><ZoomIn size={15} /></button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => save(false)} disabled={busy} style={{ ...btn(false), opacity: busy ? 0.6 : 1 }}><Save size={14} /> Simpan</button>
          <button onClick={() => save(true)} disabled={busy} style={{ ...btn(), opacity: busy ? 0.6 : 1 }}><FileDown size={14} /> {busy ? 'Memproses...' : 'Simpan & Lihat PDF'}</button>
        </div>
      </div>

      {confirmLeave && (
        <div style={{ ...cardStyle, background: '#fffbeb', borderColor: '#fde68a', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontFamily: f, fontSize: '0.82rem', color: '#92400E' }}>
          <AlertTriangle size={14} /> <span style={{ flex: 1 }}>Ada perubahan yang belum disimpan.</span>
          <button onClick={() => { setConfirmLeave(false); save(false); }} style={{ ...btn(), padding: '6px 12px' }}>Simpan dulu</button>
          <button onClick={onBack} style={{ ...btn(false), padding: '6px 12px' }}>Buang perubahan</button>
          <button onClick={() => setConfirmLeave(false)} style={{ ...btn(false), padding: '6px 12px' }}>Batal</button>
        </div>
      )}
      {error && (
        <div style={{ ...cardStyle, background: '#fff5f5', borderColor: '#fecaca', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ba1a1a', fontFamily: f, fontSize: '0.82rem' }}>
          <AlertTriangle size={14} /> <span style={{ flex: 1 }}>{error}</span>
          <button onClick={() => setError('')} style={{ ...btn(false), padding: '4px 10px' }}>Tutup</button>
        </div>
      )}
      {notice && <div style={{ ...cardStyle, background: '#d1fae5', borderColor: '#a7f3d0', padding: '12px 16px', color: '#065F46', fontFamily: f, fontSize: '0.82rem' }}>{notice}</div>}

      <p style={{ fontFamily: f, fontSize: '0.78rem', color: '#464652', marginBottom: '8px' }}>
        Klik kotak kuning untuk mengisi. Pemisah halaman final (header, footer, nomor halaman) mengikuti PDF.
      </p>
      <iframe
        ref={iframeRef}
        title={`Editor ${config.title}`}
        srcDoc={html}
        onLoad={onLoad}
        style={{ width: '100%', height: 'calc(100vh - 250px)', minHeight: '480px', border: '1px solid #e1e0ff', borderRadius: '16px', background: '#dcdce3' }}
      />
    </div>
  );
}

interface ListRow { _id: string; number: string; client: string; updatedAt: string }

const fetchRows = (apiType: string): Promise<ListRow[]> =>
  api.get('/admin/documents', { params: { type: apiType } }).then((res) => res.data);

export default function Documents() {
  const { type = 'quotation' } = useParams();
  const config = CONFIGS[type];
  const [rows, setRows] = useState<ListRow[]>([]);
  const [editing, setEditing] = useState<{ id: string | null; data: Data } | null>(null);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!config) return () => {};
    let alive = true;
    fetchRows(config.apiType)
      .then((data) => { if (alive) setRows(data); })
      .catch(() => { if (alive) setError('Gagal memuat daftar dokumen.'); });
    return () => { alive = false; };
  }, [config]);

  // Pindah jenis dokumen (Quotation ↔ Invoice ↔ SPK) = tutup editor & muat daftar jenis itu
  const [shownType, setShownType] = useState(type);
  if (shownType !== type) {
    setShownType(type);
    setEditing(null); setError(''); setConfirmDelete(null);
  }
  useEffect(() => load(), [load]);

  if (!config) return <p style={{ fontFamily: f }}>Jenis dokumen tidak dikenal.</p>;

  if (editing) {
    return (
      <DocEditor
        key={editing.id ?? 'new'}
        config={config}
        initialId={editing.id}
        initialData={editing.data}
        onBack={() => { setEditing(null); load(); }}
        onSaved={load}
      />
    );
  }

  const edit = async (id: string) => {
    setError('');
    try {
      const res = await api.get(`/admin/documents/${id}`);
      setEditing({ id, data: res.data.data });
    } catch {
      setError('Gagal membuka dokumen.');
    }
  };

  const pdf = async (id: string) => {
    if (!(await openPdf(id, window.open('', '_blank')))) setError('Gagal membuat PDF.');
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <p style={{ fontFamily: f, fontSize: '0.85rem', color: '#464652' }}>Isi bagian [ ] langsung di dokumen {config.title}, lalu unduh PDF-nya.</p>
        <button onClick={() => setEditing({ id: null, data: config.defaults() })} style={btn()}><Plus size={14} /> Buat {config.title}</button>
      </div>
      {error && (
        <div style={{ ...cardStyle, background: '#fff5f5', borderColor: '#fecaca', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ba1a1a', fontFamily: f, fontSize: '0.82rem' }}>
          <AlertTriangle size={14} /> <span style={{ flex: 1 }}>{error}</span>
          <button onClick={() => setError('')} style={{ ...btn(false), padding: '4px 10px' }}>Tutup</button>
        </div>
      )}
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
                          <button onClick={() => pdf(r._id)} style={{ ...btn(), padding: '6px 12px' }}><FileDown size={13} /> PDF</button>
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
