import { useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2, X } from 'lucide-react';
import api from '../../lib/api';

export type Access = 'hidden' | 'view' | 'edit';
type Platform = 'instagram' | 'tiktok' | 'threads' | 'x';
type SubField = 'link' | 'postedAt' | 'views' | 'likes' | 'comments' | 'shares' | 'saves' | 'reach' | 'screenshots';
export interface ProgressColumn {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'link';
  submission?: { type: 'draft' | 'post'; platform: Platform; field: SubField };
  creatorAccess: Access;
}
/** Kolom non-progress di Master Sheet (data sistem / jawaban form) — creator cuma bisa Hidden/View */
export interface SystemColumn { key: string; label: string; access: Access }

const f = 'var(--font-display)';
const PLATFORM_LABELS: Record<Platform, string> = { instagram: 'IG', tiktok: 'TikTok', threads: 'Threads', x: 'X' };
const FIELD_LABELS: Record<SubField, string> = {
  link: 'Link', postedAt: 'Tanggal Tayang', views: 'Views', likes: 'Likes', comments: 'Comments',
  shares: 'Shares', saves: 'Saves', reach: 'Reach', screenshots: 'Screenshot Insight',
};
// X & Threads tidak punya reach/saves (notes klien 17 Agu 2026, sama dengan submission.model.ts)
const fieldsFor = (p: Platform): SubField[] =>
  (Object.keys(FIELD_LABELS) as SubField[]).filter((k) => !((p === 'x' || p === 'threads') && (k === 'reach' || k === 'saves')));
const TYPE_LABELS = { text: 'Teks', number: 'Angka', date: 'Tanggal', link: 'Link' } as const;
const ACCESS_LABELS: Record<Access, string> = { hidden: 'Sembunyi', view: 'Lihat', edit: 'Edit' };

const autoLabel = (s: NonNullable<ProgressColumn['submission']>) =>
  s.field === 'link' ? `Link ${s.type === 'draft' ? 'Draft' : 'Post'} ${PLATFORM_LABELS[s.platform]}`
    : `${FIELD_LABELS[s.field]}${s.type === 'draft' ? ' Draft' : ''} ${PLATFORM_LABELS[s.platform]}`;

const select: React.CSSProperties = { padding: '7px 8px', borderRadius: '8px', border: '1px solid #c7c8cf', fontSize: '0.78rem', fontFamily: f, background: 'white', color: '#191c20' };
const iconBtn: React.CSSProperties = { padding: '6px', background: 'none', border: 'none', borderRadius: '50%', color: '#5f6368', cursor: 'pointer', display: 'flex' };

function AccessPicker({ value, options, onChange, label }: { value: Access; options: Access[]; onChange: (a: Access) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={`Akses creator: ${label}`} style={{ display: 'inline-flex', border: '1px solid #c9b6f7', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
      {options.map((a) => (
        <button key={a} type="button" role="radio" aria-checked={value === a} onClick={() => onChange(a)}
          style={{ padding: '6px 10px', border: 'none', fontSize: '0.74rem', fontWeight: 700, fontFamily: f, cursor: 'pointer', background: value === a ? '#6728e4' : 'white', color: value === a ? 'white' : '#6728e4' }}>
          {ACCESS_LABELS[a]}
        </button>
      ))}
    </div>
  );
}

interface Props {
  campaignId: string;
  initialProgress: ProgressColumn[];
  systemColumns: SystemColumn[];
  onClose: () => void;
  onSaved: () => void;
}

/** Atur kolom Master Sheet: tambah/edit kolom progress + akses creator (portal) per kolom. */
export default function ColumnManager({ campaignId, initialProgress, systemColumns, onClose, onSaved }: Props) {
  const [cols, setCols] = useState<ProgressColumn[]>(initialProgress);
  const [access, setAccess] = useState<Record<string, Access>>(() => Object.fromEntries(systemColumns.map((c) => [c.key, c.access])));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (id: string, patch: Partial<ProgressColumn>) => setCols((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const move = (i: number, dir: -1 | 1) => setCols((p) => {
    const j = i + dir;
    if (j < 0 || j >= p.length) return p;
    const n = [...p];
    [n[i], n[j]] = [n[j], n[i]];
    return n;
  });

  const addFree = () => setCols((p) => [...p, { id: crypto.randomUUID(), label: '', type: 'text', creatorAccess: 'edit' }]);
  // Paket kolom standar 1 platform — 2 platform = klik 2x (kolom per platform terpisah)
  const addPlatformSet = (platform: Platform) => setCols((p) => [
    ...p,
    ...(['link', 'postedAt', 'views', 'likes', 'comments', 'shares', 'screenshots'] as SubField[]).map((field) => {
      const submission = { type: 'post' as const, platform, field };
      return { id: crypto.randomUUID(), label: autoLabel(submission), type: 'text' as const, submission, creatorAccess: 'edit' as Access };
    }),
  ]);

  const setSource = (c: ProgressColumn, source: string) => {
    if (source === 'free') update(c.id, { submission: undefined });
    else {
      const submission = { type: 'post' as const, platform: 'instagram' as Platform, field: 'link' as SubField };
      update(c.id, { submission, label: c.label || autoLabel(submission) });
    }
  };

  const setBinding = (c: ProgressColumn, patch: Partial<NonNullable<ProgressColumn['submission']>>) => {
    const prev = c.submission!;
    const next = { ...prev, ...patch };
    if (!fieldsFor(next.platform).includes(next.field)) next.field = 'link';
    // Label yang masih label otomatis ikut berubah; label yang sudah diketik admin dibiarkan
    update(c.id, { submission: next, label: !c.label || c.label === autoLabel(prev) ? autoLabel(next) : c.label });
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const columnAccess = Object.fromEntries(Object.entries(access).filter(([, a]) => a !== 'edit'));
      await api.patch(`/admin/campaigns/${campaignId}`, { progressColumns: cols.filter((c) => c.label.trim()), columnAccess });
      onSaved();
    } catch {
      setError('Gagal menyimpan pengaturan kolom.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Kelola kolom" onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(25,28,32,.4)', display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ flex: 1 }} />
      <div style={{ width: 'min(720px, 100vw)', height: '100%', background: '#f8f9ff', display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 32px rgba(0,0,0,.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', background: 'white', borderBottom: '1px solid #e1e0ff' }}>
          <div>
            <p style={{ fontFamily: f, fontWeight: 800, fontSize: '1.1rem', color: '#191c20' }}>Kelola Kolom</p>
            <p style={{ fontSize: '0.78rem', color: '#777683', marginTop: '2px' }}>Akses = apa yang dilihat creator di dashboard campaign (magic link).</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Tutup" style={iconBtn}><X size={20} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px' }}>
          <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.92rem', color: '#6728e4', marginBottom: '4px' }}>Kolom Progress</p>
          <p style={{ fontSize: '0.76rem', color: '#777683', marginBottom: '12px', lineHeight: 1.5 }}>
            Kolom "Submission" tersambung ke data submission (Report, analytics, workflow, ekstensi ikut jalan). Beda platform = kolom terpisah.
            Kolom "Isian bebas" cuma catatan di tabel.
          </p>

          {cols.length === 0 && <p style={{ fontSize: '0.8rem', color: '#9a99a6', padding: '12px 0' }}>Belum ada kolom progress.</p>}
          {cols.map((c, i) => (
            <div key={c.id} style={{ background: 'white', border: '1px solid #e1e0ff', borderRadius: '12px', padding: '12px 14px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input value={c.label} onChange={(e) => update(c.id, { label: e.target.value })} placeholder="Nama kolom" aria-label="Nama kolom"
                  style={{ flex: '1 1 180px', padding: '8px 10px', borderRadius: '8px', border: '1px solid #c7c8cf', fontSize: '0.84rem', fontFamily: f, minWidth: 0 }} />
                <AccessPicker label={c.label} value={c.creatorAccess} options={['hidden', 'view', 'edit']} onChange={(a) => update(c.id, { creatorAccess: a })} />
                <div style={{ display: 'flex' }}>
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Pindah ke atas" style={{ ...iconBtn, opacity: i === 0 ? 0.3 : 1 }}><ArrowUp size={16} /></button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === cols.length - 1} aria-label="Pindah ke bawah" style={{ ...iconBtn, opacity: i === cols.length - 1 ? 0.3 : 1 }}><ArrowDown size={16} /></button>
                  <button type="button" onClick={() => setCols((p) => p.filter((x) => x.id !== c.id))} aria-label="Hapus kolom" style={iconBtn}><Trash2 size={16} /></button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                <select value={c.submission ? 'submission' : 'free'} onChange={(e) => setSource(c, e.target.value)} aria-label="Sumber data" style={select}>
                  <option value="free">Isian bebas</option>
                  <option value="submission">Submission</option>
                </select>
                {c.submission ? (
                  <>
                    <select value={c.submission.type} onChange={(e) => setBinding(c, { type: e.target.value as 'draft' | 'post' })} aria-label="Jenis submission" style={select}>
                      <option value="draft">Draft</option>
                      <option value="post">Post</option>
                    </select>
                    <select value={c.submission.platform} onChange={(e) => setBinding(c, { platform: e.target.value as Platform })} aria-label="Platform" style={select}>
                      {(Object.keys(PLATFORM_LABELS) as Platform[]).map((p) => <option key={p} value={p}>{PLATFORM_LABELS[p]}</option>)}
                    </select>
                    <select value={c.submission.field} onChange={(e) => setBinding(c, { field: e.target.value as SubField })} aria-label="Data" style={select}>
                      {fieldsFor(c.submission.platform).map((k) => <option key={k} value={k}>{FIELD_LABELS[k]}</option>)}
                    </select>
                  </>
                ) : (
                  <select value={c.type} onChange={(e) => update(c.id, { type: e.target.value as ProgressColumn['type'] })} aria-label="Tipe isian" style={select}>
                    {(Object.keys(TYPE_LABELS) as ProgressColumn['type'][]).map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
                  </select>
                )}
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '26px' }}>
            <button type="button" onClick={addFree} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '999px', border: '1.5px dashed #c9b6f7', background: 'white', color: '#6728e4', fontSize: '0.78rem', fontWeight: 700, fontFamily: f, cursor: 'pointer' }}>
              <Plus size={14} /> Kolom
            </button>
            {(Object.keys(PLATFORM_LABELS) as Platform[]).map((p) => (
              <button key={p} type="button" onClick={() => addPlatformSet(p)} title={`Tambah Link Post, Tanggal Tayang, Views, Likes, Comments, Shares, Screenshot untuk ${PLATFORM_LABELS[p]}`}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '999px', border: '1.5px solid #e1e0ff', background: 'white', color: '#464652', fontSize: '0.78rem', fontWeight: 700, fontFamily: f, cursor: 'pointer' }}>
                <Plus size={14} /> Paket {PLATFORM_LABELS[p]}
              </button>
            ))}
          </div>

          <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.92rem', color: '#6728e4', marginBottom: '4px' }}>Kolom Data</p>
          <p style={{ fontSize: '0.76rem', color: '#777683', marginBottom: '12px' }}>Data sistem & jawaban form — creator hanya bisa melihat, tidak bisa mengedit. Data pribadi (WA, email) sebaiknya disembunyikan.</p>
          <div style={{ background: 'white', border: '1px solid #e1e0ff', borderRadius: '12px', overflow: 'hidden' }}>
            {systemColumns.map((c, i) => (
              <div key={c.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '8px 14px', borderTop: i ? '1px solid #f0eeff' : 'none' }}>
                <span style={{ fontSize: '0.82rem', fontFamily: f, color: '#191c20', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.label}</span>
                <AccessPicker label={c.label} value={access[c.key] === 'view' ? 'view' : 'hidden'} options={['hidden', 'view']} onChange={(a) => setAccess((p) => ({ ...p, [c.key]: a }))} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', padding: '14px 22px', background: 'white', borderTop: '1px solid #e1e0ff' }}>
          {error && <span role="alert" style={{ color: '#ba1a1a', fontSize: '0.8rem', marginRight: 'auto' }}>{error}</span>}
          <button type="button" onClick={onClose} style={{ padding: '9px 18px', borderRadius: '999px', border: '1.5px solid #c7c8cf', background: 'white', fontSize: '0.82rem', fontFamily: f, fontWeight: 700, cursor: 'pointer' }}>Batal</button>
          <button type="button" onClick={save} disabled={saving} className="btn-primary" style={{ padding: '9px 20px', fontSize: '0.82rem', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Menyimpan...' : 'Simpan Kolom'}
          </button>
        </div>
      </div>
    </div>
  );
}
