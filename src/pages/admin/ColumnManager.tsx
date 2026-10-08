import { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react';

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
const ACCESS_ICON = { hidden: EyeOff, view: Eye, edit: Pencil };

const autoLabel = (s: NonNullable<ProgressColumn['submission']>) =>
  s.field === 'link' ? `Link ${s.type === 'draft' ? 'Draft' : 'Post'} ${PLATFORM_LABELS[s.platform]}`
    : `${FIELD_LABELS[s.field]}${s.type === 'draft' ? ' Draft' : ''} ${PLATFORM_LABELS[s.platform]}`;

const newFree = (): ProgressColumn => ({ id: crypto.randomUUID(), label: 'Kolom baru', type: 'text', creatorAccess: 'edit' });
const newSubmission = (platform: Platform = 'instagram', field: SubField = 'link'): ProgressColumn => {
  const submission = { type: 'post' as const, platform, field };
  return { id: crypto.randomUUID(), label: autoLabel(submission), type: 'text', submission, creatorAccess: 'edit' };
};

const sel: React.CSSProperties = { width: '100%', padding: '5px 6px', borderRadius: '6px', border: '1px solid #c7c8cf', fontSize: '0.76rem', background: 'white', color: '#202124' };
const lbl: React.CSSProperties = { fontSize: '0.7rem', fontWeight: 700, color: '#5f6368', marginBottom: '3px', display: 'block' };
const item: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '7px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#202124', textAlign: 'left' };

/** Ikon akses creator di header kolom, supaya admin lihat sekilas kolom mana yang terlihat/bisa diedit creator. */
export function AccessIcon({ access }: { access: Access }) {
  const Icon = ACCESS_ICON[access];
  const color = access === 'edit' ? '#6728e4' : access === 'view' ? '#5f6368' : '#b0afba';
  return <span title={`Creator: ${ACCESS_LABELS[access]}`} style={{ display: 'flex', flexShrink: 0 }}><Icon size={12} color={color} /></span>;
}

function AccessPicker({ value, options, onChange }: { value: Access; options: Access[]; onChange: (a: Access) => void }) {
  return (
    <div role="radiogroup" aria-label="Akses creator" style={{ display: 'flex', border: '1px solid #c9b6f7', borderRadius: '6px', overflow: 'hidden' }}>
      {options.map((a) => (
        <button key={a} type="button" role="radio" aria-checked={value === a} onClick={() => onChange(a)}
          style={{ flex: 1, padding: '5px 4px', border: 'none', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', background: value === a ? '#6728e4' : 'white', color: value === a ? 'white' : '#6728e4' }}>
          {ACCESS_LABELS[a]}
        </button>
      ))}
    </div>
  );
}

interface ColumnMenuProps {
  /** Kolom progress (bisa diubah/hapus), kosong untuk kolom data sistem */
  progress?: ProgressColumn;
  access: Access;
  canMoveLeft: boolean;
  canMoveRight: boolean;
  onAccess: (a: Access) => void;
  onChange: (next: ProgressColumn) => void;
  onMove: (dir: -1 | 1) => void;
  onInsertRight: () => void;
  onDelete: () => void;
}

/** Bagian atas dropdown header kolom Master Sheet: pengaturan kolom langsung dari tabel. */
export function ColumnMenu({ progress, access, canMoveLeft, canMoveRight, onAccess, onChange, onMove, onInsertRight, onDelete }: ColumnMenuProps) {
  const [label, setLabel] = useState(progress?.label ?? '');

  if (!progress) {
    return (
      <div style={{ padding: '4px 12px 6px' }}>
        <span style={lbl}>Akses creator (portal)</span>
        <AccessPicker value={access === 'view' ? 'view' : 'hidden'} options={['hidden', 'view']} onChange={onAccess} />
        <p style={{ fontSize: '0.7rem', color: '#777683', marginTop: '6px', lineHeight: 1.5 }}>
          Kolom data sistem (diisi otomatis/admin), jadi creator hanya bisa melihat. Butuh kolom yang bisa diisi creator?
          Tambah lewat tombol <strong>+</strong> di ujung kanan header, akses Edit tersedia di sana.
        </p>
      </div>
    );
  }

  const commitLabel = () => { if (label.trim() && label.trim() !== progress.label) onChange({ ...progress, label: label.trim() }); };
  const setBinding = (patch: Partial<NonNullable<ProgressColumn['submission']>>) => {
    const prev = progress.submission!;
    const next = { ...prev, ...patch };
    if (!fieldsFor(next.platform).includes(next.field)) next.field = 'link';
    // Nama kolom yang masih nama otomatis ikut berubah; yang sudah diketik admin dibiarkan
    onChange({ ...progress, submission: next, label: progress.label === autoLabel(prev) ? autoLabel(next) : progress.label });
  };

  return (
    <div>
      <div style={{ padding: '4px 12px 6px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>
          <span style={lbl}>Nama kolom</span>
          <input value={label} onChange={(e) => setLabel(e.target.value)} onBlur={commitLabel} onKeyDown={(e) => { if (e.key === 'Enter') commitLabel(); }}
            aria-label="Nama kolom" style={{ ...sel, padding: '6px 8px' }} />
        </div>
        <div>
          <span style={lbl}>Sumber data</span>
          <select value={progress.submission ? 'submission' : 'free'} aria-label="Sumber data" style={sel}
            onChange={(e) => onChange(e.target.value === 'free' ? { ...progress, submission: undefined } : { ...newSubmission(), id: progress.id, creatorAccess: progress.creatorAccess })}>
            <option value="free">Isian bebas</option>
            <option value="submission">Submission (masuk Report & workflow)</option>
          </select>
        </div>
        {progress.submission ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr', gap: '6px' }}>
            <select value={progress.submission.type} onChange={(e) => setBinding({ type: e.target.value as 'draft' | 'post' })} aria-label="Jenis submission" style={sel}>
              <option value="draft">Draft</option>
              <option value="post">Post</option>
            </select>
            <select value={progress.submission.platform} onChange={(e) => setBinding({ platform: e.target.value as Platform })} aria-label="Platform" style={sel}>
              {(Object.keys(PLATFORM_LABELS) as Platform[]).map((p) => <option key={p} value={p}>{PLATFORM_LABELS[p]}</option>)}
            </select>
            <select value={progress.submission.field} onChange={(e) => setBinding({ field: e.target.value as SubField })} aria-label="Data" style={sel}>
              {fieldsFor(progress.submission.platform).map((k) => <option key={k} value={k}>{FIELD_LABELS[k]}</option>)}
            </select>
          </div>
        ) : (
          <select value={progress.type} onChange={(e) => onChange({ ...progress, type: e.target.value as ProgressColumn['type'] })} aria-label="Tipe isian" style={sel}>
            {(Object.keys(TYPE_LABELS) as ProgressColumn['type'][]).map((t) => <option key={t} value={t}>Tipe: {TYPE_LABELS[t]}</option>)}
          </select>
        )}
        <div>
          <span style={lbl}>Akses creator (portal)</span>
          <AccessPicker value={progress.creatorAccess} options={['hidden', 'view', 'edit']} onChange={(a) => onChange({ ...progress, creatorAccess: a })} />
        </div>
      </div>
      <div style={{ borderTop: '1px solid #e2e3e3', margin: '6px 0' }} />
      <div style={{ display: 'flex' }}>
        <button type="button" disabled={!canMoveLeft} onClick={() => onMove(-1)} style={{ ...item, opacity: canMoveLeft ? 1 : 0.35 }}><ArrowLeft size={14} /> Geser kiri</button>
        <button type="button" disabled={!canMoveRight} onClick={() => onMove(1)} style={{ ...item, opacity: canMoveRight ? 1 : 0.35 }}><ArrowRight size={14} /> Geser kanan</button>
      </div>
      <button type="button" onClick={onInsertRight} style={item}><Plus size={14} /> Sisipkan kolom di kanan</button>
      <button type="button" onClick={onDelete} style={{ ...item, color: '#b3261e' }}><Trash2 size={14} /> Hapus kolom</button>
    </div>
  );
}

/** Isi popover tombol "+" di ujung header: tambah kolom bebas / submission / paket 1 platform. */
export function AddColumnMenu({ onAdd }: { onAdd: (cols: ProgressColumn[]) => void }) {
  return (
    <div>
      <button type="button" onClick={() => onAdd([newFree()])} style={item}><Plus size={14} /> Kolom isian bebas</button>
      <button type="button" onClick={() => onAdd([newSubmission()])} style={item}><Plus size={14} /> Kolom submission</button>
      <div style={{ borderTop: '1px solid #e2e3e3', margin: '6px 0' }} />
      <p style={{ padding: '0 12px 4px', fontSize: '0.7rem', fontWeight: 700, color: '#5f6368' }}>Paket per platform (Link Post, Tanggal Tayang, Views, Likes, Comments, Shares, Screenshot)</p>
      {(Object.keys(PLATFORM_LABELS) as Platform[]).map((p) => (
        <button key={p} type="button" style={item}
          onClick={() => onAdd((['link', 'postedAt', 'views', 'likes', 'comments', 'shares', 'screenshots'] as SubField[]).map((f) => newSubmission(p, f)))}>
          <Plus size={14} /> Paket {PLATFORM_LABELS[p]}
        </button>
      ))}
    </div>
  );
}
