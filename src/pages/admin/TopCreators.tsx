import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Download, Pencil, Trash2, X } from 'lucide-react';
import api from '../../lib/api';
import SheetGrid from '../../components/SheetGrid';

const f = 'var(--font-display)';
const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #e1e0ff', fontSize: '0.85rem', fontFamily: f, background: 'white' };

interface TopCreatorRow {
  id: string; source: 'manual' | 'portfolio'; portfolioId?: string;
  campaign: string; brand?: string; period?: string; name: string; username?: string; phone?: string;
  platform: string; postLink?: string; views?: number; likes?: number; comments?: number; shares?: number;
}
type Draft = Record<'campaign' | 'brand' | 'period' | 'name' | 'username' | 'phone' | 'platform' | 'postLink' | 'views' | 'likes' | 'comments' | 'shares', string>;
const EMPTY: Draft = { campaign: '', brand: '', period: '', name: '', username: '', phone: '', platform: 'tiktok', postLink: '', views: '', likes: '', comments: '', shares: '' };

const HEADERS = ['Campaign', 'Brand', 'Periode', 'Creator', 'Username', 'WhatsApp', 'Platform', 'Link Postingan', 'Views', 'Likes', 'Comments', 'Shares', 'Sumber'];
const FORM_FIELDS: [keyof Draft, string, string][] = [
  ['campaign', 'Campaign *', 'Nama campaign'], ['brand', 'Brand', 'Nama brand'], ['period', 'Periode', 'Nov 2026'],
  ['name', 'Nama Creator *', 'Nama creator'], ['username', 'Username', '@username'], ['phone', 'WhatsApp', '08xxxxxxxxxx'],
  ['postLink', 'Link Postingan', 'https://www.tiktok.com/@.../video/...'],
  ['views', 'Views', '18000'], ['likes', 'Likes', '120'], ['comments', 'Comments', '10'], ['shares', 'Shares', '5'],
];

const csvCell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;

/** Top 3 creator semua campaign: dari portfolio (otomatis) + catatan manual untuk campaign tanpa portfolio. */
export default function TopCreators() {
  const [rows, setRows] = useState<TopCreatorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<{ id?: string; draft: Draft } | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/top-creators');
      setRows(res.data);
      setError('');
    } catch {
      setError('Gagal memuat data top creator.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const t = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(t);
  }, [load]);

  const save = async () => {
    if (!editing) return;
    if (!editing.draft.campaign.trim() || !editing.draft.name.trim()) { setError('Nama campaign & nama creator wajib diisi.'); return; }
    setSaving(true);
    setError('');
    try {
      if (editing.id) await api.patch(`/admin/top-creators/${editing.id}`, editing.draft);
      else await api.post('/admin/top-creators', editing.draft);
      setEditing(null);
      await load();
    } catch (err) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (r: TopCreatorRow) => {
    if (!window.confirm(`Hapus ${r.name} dari top creator ${r.campaign}?`)) return;
    try {
      await api.delete(`/admin/top-creators/${r.id}`);
      await load();
    } catch {
      setError('Gagal menghapus.');
    }
  };

  const table = rows.map((r) => [
    r.campaign, r.brand || '', r.period || '', r.name, r.username || '', r.phone || '', r.platform, r.postLink || '',
    r.views ?? '', r.likes ?? '', r.comments ?? '', r.shares ?? '', r.source === 'portfolio' ? 'Portfolio' : 'Manual',
  ]);

  const downloadCsv = () => {
    const csv = [HEADERS, ...table].map((row) => row.map(csvCell).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'top-creator-azera.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
        <p style={{ flex: '1 1 320px', fontFamily: f, fontSize: '0.82rem', color: '#464652' }}>
          Top 3 creator tiap campaign. Yang dari <b>Portfolio</b> otomatis ikut (diedit di menu Portfolio); campaign yang belum punya portfolio ditambah manual di sini.
        </p>
        <button type="button" onClick={downloadCsv} disabled={!rows.length}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '999px', border: '1px solid #c9b6f7', background: 'white', color: '#6728e4', fontSize: '0.8rem', fontWeight: 700, fontFamily: f, cursor: 'pointer' }}>
          <Download size={14} /> Download CSV
        </button>
        <button type="button" onClick={() => setEditing({ draft: { ...EMPTY } })} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
          <Plus size={14} /> Tambah top creator
        </button>
      </div>
      {error && <p role="alert" style={{ color: '#ba1a1a', fontFamily: f, fontSize: '0.82rem', marginBottom: '10px' }}>{error}</p>}

      <SheetGrid
        storageKey="admin:top-creators"
        headers={HEADERS}
        rows={table}
        emptyText={loading ? 'Memuat…' : 'Belum ada data top creator.'}
        actionHeader="Aksi"
        rowAction={(i) => {
          const r = rows[i];
          if (!r) return null;
          if (r.source === 'portfolio') {
            return <Link to="/admin/portfolio" style={{ fontFamily: f, fontSize: '0.74rem', fontWeight: 700, color: '#6728e4' }}>Edit di Portfolio</Link>;
          }
          return (
            <span style={{ display: 'flex', gap: '4px' }}>
              <button type="button" aria-label={`Edit ${r.name}`} onClick={() => setEditing({ id: r.id, draft: { ...EMPTY, ...Object.fromEntries(Object.keys(EMPTY).map((k) => [k, String((r as unknown as Record<string, unknown>)[k] ?? '')])) } as Draft })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6728e4', display: 'flex', padding: '4px' }}><Pencil size={14} /></button>
              <button type="button" aria-label={`Hapus ${r.name}`} onClick={() => void remove(r)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ba1a1a', display: 'flex', padding: '4px' }}><Trash2 size={14} /></button>
            </span>
          );
        }}
      />

      {editing && (
        <div role="dialog" aria-modal="true" aria-label="Top creator" onClick={() => setEditing(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(25,28,32,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '16px', width: 'min(620px, 100%)', maxHeight: '90vh', overflowY: 'auto', padding: '20px', display: 'grid', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ flex: 1, fontFamily: f, fontWeight: 800, fontSize: '1rem', color: '#191c20' }}>{editing.id ? 'Edit top creator' : 'Tambah top creator'}</p>
              <button type="button" onClick={() => setEditing(null)} aria-label="Tutup" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#5f6368' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {FORM_FIELDS.map(([key, label, ph]) => (
                <label key={key} style={{ display: 'grid', gap: '4px', fontFamily: f, fontSize: '0.74rem', fontWeight: 700, color: '#464652' }}>
                  {label}
                  <input value={editing.draft[key]} placeholder={ph} onChange={(e) => setEditing({ ...editing, draft: { ...editing.draft, [key]: e.target.value } })} style={inputStyle} />
                </label>
              ))}
              <label style={{ display: 'grid', gap: '4px', fontFamily: f, fontSize: '0.74rem', fontWeight: 700, color: '#464652' }}>
                Platform
                <select value={editing.draft.platform} onChange={(e) => setEditing({ ...editing, draft: { ...editing.draft, platform: e.target.value } })} style={inputStyle}>
                  {['tiktok', 'instagram', 'threads', 'x', 'youtube'].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" onClick={() => setEditing(null)} style={{ padding: '9px 18px', borderRadius: '999px', border: '1.5px solid #c7c8cf', background: 'white', cursor: 'pointer', fontFamily: f, fontWeight: 700, fontSize: '0.82rem' }}>Batal</button>
              <button type="button" onClick={() => void save()} disabled={saving} className="btn-primary" style={{ padding: '9px 18px', fontSize: '0.82rem', opacity: saving ? 0.6 : 1 }}>{saving ? 'Menyimpan…' : 'Simpan'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
