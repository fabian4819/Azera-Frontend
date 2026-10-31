import { useEffect, useState } from 'react';
import { Plus, Trash2, Copy, ArrowUp, ArrowDown, X, Circle, Square, GripHorizontal, Lock, Undo2 } from 'lucide-react';
import api from '../../lib/api';
import { NICHES } from '../../lib/niches';
import { PLATFORM_LABELS, applyOrder, defaultApplyKeys } from '../../lib/applyForm';
import ApplySocialField from '../../components/ApplySocialField';

export type CustomFieldType = 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'file';
/** description = keterangan opsional dari admin, tampil di bawah judul pertanyaan di form apply */
export interface CustomField { id: string; label: string; description?: string; type: CustomFieldType; required: boolean; options?: string[] }
/** Field default form Apply: Nama/WA/Email selalu ada; PIC & Handle by bisa dihapus admin.
 * order = urutan semua field (default + custom id) hasil drag, lihat lib/applyForm.ts */
export interface ApplyFields { pic: boolean; handleBy: boolean; handleByRequired: boolean; order?: string[] }
const DEFAULT_APPLY_FIELDS: ApplyFields = { pic: true, handleBy: true, handleByRequired: false };

const TYPE_LABELS: Record<CustomFieldType, string> = {
  text: 'Jawaban Singkat', textarea: 'Paragraf', number: 'Angka',
  select: 'Pilihan Ganda', checkbox: 'Kotak Centang', file: 'Upload File/Gambar',
};
const ANSWER_PLACEHOLDER: Partial<Record<CustomFieldType, string>> = {
  text: 'Teks jawaban singkat', textarea: 'Teks jawaban panjang', number: 'Jawaban angka', file: '⤒ Upload file / gambar',
};
const isChoice = (t: CustomFieldType) => t === 'select' || t === 'checkbox';
const font = "var(--font-display)";
const iconBtn: React.CSSProperties = {
  padding: '8px', background: 'none', border: 'none', borderRadius: '50%', color: '#5f6368', cursor: 'pointer', display: 'flex',
};

/** Buang pertanyaan tanpa judul & opsi kosong sebelum disimpan */
// eslint-disable-next-line react-refresh/only-export-components
export const cleanFields = (fields: CustomField[]): CustomField[] =>
  fields
    .filter((f) => f.label.trim())
    .map((f) => ({
      ...f,
      label: f.label.trim(),
      description: f.description?.trim() || undefined,
      options: isChoice(f.type) ? (f.options || []).map((o) => o.trim()).filter(Boolean) : [],
    }));

interface Props {
  /** Tanpa campaignId = mode lokal (wizard buat campaign): tidak ada tombol simpan, state dilapor lewat onChange */
  campaignId?: string;
  onChange?: (fields: CustomField[], applyFields: ApplyFields) => void;
  initial: CustomField[];
  initialApplyFields?: ApplyFields;
  /** Platform di kriteria campaign, tiap platform jadi field wajib username + followers di form apply */
  platforms?: string[];
  /** Min. followers per platform dari kriteria, ditampilkan sebagai keterangan di label */
  minFollowers?: Record<string, number | string | undefined>;
  /** Kriteria provinsi/kota terisi → field Provinsi & Kota muncul (wajib) di form apply */
  askDomicile?: boolean;
  /** Niche yang dipilih di kriteria campaign, jadi opsi Niche di form apply */
  niches?: string[];
  /** Semua akun PIC terdaftar + yang dicentang untuk campaign ini (jadi opsi dropdown PIC di form) */
  pics: { _id: string; name: string; email: string }[];
  assignedPicIds: string[];
  onTogglePic: (pic: { _id: string; name: string; email: string; phone: string }, on: boolean) => Promise<void>;
  onSaved?: (fields: CustomField[], applyFields: ApplyFields) => void;
}

const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#191c20', fontFamily: font, cursor: 'pointer' }}>
    {label}
    <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
    <span style={{ width: '36px', height: '20px', borderRadius: '10px', background: checked ? '#c9b6f7' : '#c7c8cf', position: 'relative', transition: 'background .15s' }}>
      <span style={{ position: 'absolute', top: '2px', left: checked ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', background: checked ? '#6728e4' : 'white', boxShadow: '0 1px 3px rgba(0,0,0,.3)', transition: 'left .15s' }} />
    </span>
  </label>
);

const defaultCard: React.CSSProperties = { background: 'white', borderRadius: '12px', border: '1px solid #e1e0ff', marginBottom: '12px', padding: '16px 24px' };
const answerLine = (w: string, text: string) => (
  <p style={{ fontSize: '0.85rem', color: '#9a99a6', borderBottom: '1px dotted #c7c8cf', paddingBottom: '6px', width: w, marginTop: '10px', fontFamily: font }}>{text}</p>
);

/** Builder pertanyaan tambahan form Apply, pengalaman ala Google Forms (AD-47). */
export default function CustomFormBuilder({ campaignId, onChange, initial, initialApplyFields, platforms = [], minFollowers = {}, askDomicile = false, niches = [], pics, assignedPicIds, onTogglePic, onSaved }: Props) {
  const [fields, setFields] = useState<CustomField[]>(initial);
  const [applyFields, setApplyFields] = useState<ApplyFields>(initialApplyFields ?? DEFAULT_APPLY_FIELDS);
  const [saved, setSaved] = useState(JSON.stringify([initial, initialApplyFields ?? DEFAULT_APPLY_FIELDS]));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [focusOpt, setFocusOpt] = useState<string | null>(null);
  // Drag cuma aktif kalau mulai dari handle, supaya select teks di input tetap normal
  const [handleId, setHandleId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const nicheOptions = niches.length ? niches : NICHES;
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [picBusy, setPicBusy] = useState<string | null>(null);
  const [picError, setPicError] = useState('');

  const togglePic = async (pic: Props['pics'][number], on: boolean) => {
    setPicBusy(pic._id);
    setPicError('');
    try {
      await onTogglePic(pic as Parameters<Props['onTogglePic']>[0], on);
    } catch {
      setPicError(`Gagal ${on ? 'menambahkan' : 'melepas'} ${pic.name}. Coba lagi.`);
    } finally {
      setPicBusy(null);
    }
  };
  useEffect(() => { onChange?.(fields, applyFields); }, [fields, applyFields]); // eslint-disable-line react-hooks/exhaustive-deps
  const dirty = JSON.stringify([fields, applyFields]) !== saved;
  const setApply = (patch: Partial<ApplyFields>) => setApplyFields((a) => ({ ...a, ...patch }));

  const update = (id: string, patch: Partial<CustomField>) =>
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));

  // Pertanyaan baru disisipkan di bawah kartu yang sedang aktif, seperti Google Forms
  const insertAfterActive = (field: CustomField) => {
    setFields((prev) => {
      const idx = prev.findIndex((f) => f.id === activeId);
      const at = idx === -1 ? prev.length : idx + 1;
      return [...prev.slice(0, at), field, ...prev.slice(at)];
    });
    setActiveId(field.id);
  };

  const addField = () => insertAfterActive({ id: crypto.randomUUID(), label: '', type: 'select', required: false, options: ['Opsi 1'] });

  const duplicate = (f: CustomField) => insertAfterActive({ ...f, id: crypto.randomUUID(), options: [...(f.options || [])] });

  const remove = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    setActiveId(null);
  };

  // Urutan semua kartu (default + custom); PIC/Handle by yang dihapus tidak ikut, balik ke posisi default kalau dikembalikan
  const keys = applyOrder(applyFields.order, defaultApplyKeys({ askDomicile, platforms, customIds: fields.map((f) => f.id) }))
    .filter((k) => (k !== 'pic' || applyFields.pic) && (k !== 'handleBy' || applyFields.handleBy));
  const reorder = (from: number, to: number) => {
    if (from === -1 || to < 0 || to >= keys.length || from === to) return;
    const next = [...keys];
    next.splice(to, 0, next.splice(from, 1)[0]);
    setApply({ order: next });
  };
  const move = (key: string, dir: -1 | 1) => reorder(keys.indexOf(key), keys.indexOf(key) + dir);
  // Reorder live saat kartu yang di-drag melewati kartu lain
  const dragOver = (overKey: string) => reorder(keys.indexOf(dragId ?? ''), keys.indexOf(overKey));

  // Kartu bisa di-drag, tapi drag cuma mulai dari handle supaya select teks di input tetap normal
  const dragProps = (key: string) => ({
    draggable: handleId === key,
    onDragStart: (e: React.DragEvent) => { e.dataTransfer.effectAllowed = 'move'; setDragId(key); },
    onDragOver: (e: React.DragEvent) => { if (!dragId) return; e.preventDefault(); dragOver(key); },
    onDragEnd: () => { setDragId(null); setHandleId(null); },
  });
  const grip = (key: string) => (
    <div
      title="Geser untuk mengubah urutan"
      onMouseDown={() => setHandleId(key)}
      onMouseUp={() => setHandleId(null)}
      style={{ display: 'flex', justifyContent: 'center', color: '#b0afba', cursor: dragId ? 'grabbing' : 'grab', padding: '2px 0 6px', margin: '-12px 0 0' }}
    >
      <GripHorizontal size={18} />
    </div>
  );
  const lockedTag = (
    <span title="Field default, tidak bisa dihapus" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', color: '#777683', fontFamily: font, whiteSpace: 'nowrap' }}>
      <Lock size={13} /> Wajib
    </span>
  );
  const fieldTitle = (text: string, required = true) => (
    <p style={{ fontFamily: font, fontSize: '0.95rem', color: '#191c20' }}>{text}{required && <span style={{ color: '#d93025' }}> *</span>}</p>
  );
  const fixedCard = (key: string, title: string, body: React.ReactNode) => (
    <div key={key} {...dragProps(key)} style={{ ...defaultCard, opacity: dragId === key ? 0.5 : 1 }}>
      {grip(key)}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
        {fieldTitle(title)}
        {lockedTag}
      </div>
      {body}
    </div>
  );

  const changeType = (f: CustomField, type: CustomFieldType) =>
    update(f.id, { type, options: isChoice(type) && !(f.options || []).length ? ['Opsi 1'] : f.options });

  const setOption = (f: CustomField, idx: number, value: string) =>
    update(f.id, { options: (f.options || []).map((o, i) => (i === idx ? value : o)) });

  const addOption = (f: CustomField, after?: number) => {
    const opts = [...(f.options || [])];
    const at = after === undefined ? opts.length : after + 1;
    opts.splice(at, 0, `Opsi ${opts.length + 1}`);
    update(f.id, { options: opts });
    setFocusOpt(`${f.id}:${at}`);
  };

  const removeOption = (f: CustomField, idx: number) =>
    update(f.id, { options: (f.options || []).filter((_, i) => i !== idx) });

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const cleaned = cleanFields(fields);
      const res = await api.patch(`/admin/campaigns/${campaignId}`, { customFields: cleaned, applyFields });
      const next: CustomField[] = res.data.customFields || [];
      const nextApply: ApplyFields = res.data.applyFields ?? applyFields;
      setFields(next);
      setApplyFields(nextApply);
      setSaved(JSON.stringify([next, nextApply]));
      onSaved?.(next, nextApply);
      setStatus({ ok: true, text: 'Form kustom disimpan.' });
      setTimeout(() => setStatus(null), 2500);
    } catch {
      setStatus({ ok: false, text: 'Gagal menyimpan form kustom.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e1e0ff', borderTop: '10px solid #6728e4', padding: '22px 24px', marginBottom: '12px' }}>
        <p style={{ fontFamily: font, fontWeight: 700, fontSize: '1.4rem', color: '#191c20', marginBottom: '6px' }}>Form Kustom Pendaftaran</p>
        <p style={{ fontSize: '0.82rem', color: '#777683' }}>
          Field default di bawah otomatis ada di form Apply. Nama, WhatsApp, Email, dan Niche wajib; Provinsi & Kota
          muncul (wajib) kalau kriteria provinsi/kota diisi di tahap 1; username + followers
          muncul otomatis untuk tiap platform yang dipilih di kriteria campaign (tahap 1). PIC dan Handle by boleh dihapus.
          Tambahkan pertanyaan lain sesuai kebutuhan campaign.
        </p>
      </div>

      {keys.map((key, i) => {
        switch (key) {
          case 'name': return fixedCard(key, 'Nama Lengkap', answerLine('50%', 'Teks jawaban singkat'));
          case 'phone': return fixedCard(key, 'Nomor WhatsApp', answerLine('50%', '08xxxxxxxxxx'));
          case 'email': return fixedCard(key, 'Email', answerLine('50%', 'you@email.com'));
          case 'niches': return fixedCard(key, 'Niche', (
            <>
              <p style={{ fontSize: '0.76rem', color: '#777683', fontFamily: font, margin: '-4px 0 10px' }}>Opsi dari niche di kriteria campaign (tahap 1), boleh pilih lebih dari satu.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {nicheOptions.map((n) => (
                  <span key={n} style={{ padding: '7px 14px', borderRadius: '999px', background: '#e1e0ff', color: '#6728e4', fontSize: '0.78rem', fontWeight: 600, fontFamily: font }}>{n}</span>
                ))}
              </div>
            </>
          ));
          case 'domicile': return fixedCard(key, 'Provinsi & Kota / Kabupaten Domisili', (
            <div style={{ display: 'flex', gap: '16px' }}>{answerLine('40%', 'Pilih provinsi ▾')}{answerLine('40%', 'Pilih kota / kabupaten ▾')}</div>
          ));
          case 'pic': return (
        <div key="pic" {...dragProps('pic')} style={{ ...defaultCard, opacity: dragId === 'pic' ? 0.5 : 1 }}>
          {grip('pic')}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <p style={{ fontFamily: font, fontSize: '0.95rem', color: '#191c20' }}>PIC{assignedPicIds.length > 0 && <span style={{ color: '#d93025' }}> *</span>}</p>
            <button onClick={() => setApply({ pic: false })} title="Hapus field PIC dari form" style={iconBtn}><Trash2 size={18} /></button>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#777683', fontFamily: font, margin: '4px 0 8px' }}>
            Centang PIC yang jadi pilihan di form campaign ini (tersimpan otomatis). Tanpa PIC tercentang, field ini tidak tampil di form.
          </p>
          {pics.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: '#9a99a6', fontFamily: font }}>Belum ada akun PIC terdaftar. PIC daftar sendiri lewat halaman /login, lalu muncul di sini.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {pics.map((p) => {
                const on = assignedPicIds.includes(p._id);
                return (
                  <label key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: '38px', cursor: picBusy ? 'wait' : 'pointer', opacity: picBusy === p._id ? 0.5 : 1 }}>
                    <input type="checkbox" checked={on} disabled={Boolean(picBusy)} onChange={(e) => void togglePic(p, e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#6728e4' }} />
                    <span style={{ fontSize: '0.88rem', color: '#191c20', fontFamily: font }}>{p.name}</span>
                    <span style={{ fontSize: '0.76rem', color: '#9a99a6', fontFamily: font, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.email}</span>
                  </label>
                );
              })}
            </div>
          )}
          {picError && <p role="alert" style={{ color: '#ba1a1a', fontSize: '0.78rem', fontFamily: font, marginTop: '6px' }}>{picError}</p>}
        </div>
          );
          case 'handleBy': return (
        <div key="handleBy" {...dragProps('handleBy')} style={{ ...defaultCard, opacity: dragId === 'handleBy' ? 0.5 : 1 }}>
          {grip('handleBy')}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <p style={{ fontFamily: font, fontSize: '0.95rem', color: '#191c20' }}>Handle by{applyFields.handleByRequired && <span style={{ color: '#d93025' }}> *</span>}</p>
            <button onClick={() => setApply({ handleBy: false })} title="Hapus field Handle by dari form" style={iconBtn}><Trash2 size={18} /></button>
          </div>
          {answerLine('50%', 'Nama HB + nomor WA')}
          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e1e0ff', paddingTop: '8px', marginTop: '12px' }}>
            <Toggle label="Wajib diisi" checked={applyFields.handleByRequired} onChange={(v) => setApply({ handleByRequired: v })} />
          </div>
        </div>
          );
        }
        if (key.startsWith('social:')) {
          const p = key.slice(7);
          return fixedCard(key, `Username & Followers ${PLATFORM_LABELS[p] ?? p}`, <ApplySocialField platform={p} minFollowers={minFollowers[p]} />);
        }
        const f = fields.find((x) => x.id === key);
        if (!f) return null;
        const active = f.id === activeId;
        return (
          <div
            key={f.id}
            onClick={() => setActiveId(f.id)}
            {...dragProps(f.id)}
            style={{
              opacity: dragId === f.id ? 0.5 : 1,
              background: 'white', borderRadius: '12px', border: '1px solid #e1e0ff', marginBottom: '12px', cursor: active ? 'default' : 'pointer',
              borderLeft: active ? '6px solid #6728e4' : '6px solid transparent', boxShadow: active ? '0 4px 16px rgba(107,46,232,0.12)' : 'none',
              padding: '4px 24px 8px',
            }}
          >
            <div style={{ marginTop: '12px' }}>{grip(f.id)}</div>
            {active ? (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '16px' }}>
                <input
                  autoFocus={!f.label}
                  value={f.label}
                  onChange={(e) => update(f.id, { label: e.target.value })}
                  placeholder="Pertanyaan"
                  style={{ flex: '1 1 280px', padding: '14px', background: '#f6f5ff', border: 'none', borderBottom: '2px solid #6728e4', borderRadius: '4px 4px 0 0', fontSize: '0.95rem', fontFamily: font, outline: 'none' }}
                />
                <select
                  value={f.type}
                  onChange={(e) => changeType(f, e.target.value as CustomFieldType)}
                  style={{ flex: '0 0 200px', padding: '13px 12px', borderRadius: '6px', border: '1px solid #c7c8cf', fontSize: '0.85rem', fontFamily: font, color: '#191c20', background: 'white' }}
                >
                  {(Object.keys(TYPE_LABELS) as CustomFieldType[]).map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
                </select>
                <textarea
                  value={f.description ?? ''}
                  onChange={(e) => update(f.id, { description: e.target.value })}
                  placeholder="Keterangan (opsional), tampil di bawah judul pertanyaan"
                  rows={2}
                  style={{ flex: '1 1 100%', padding: '8px 2px', border: 'none', borderBottom: '1px solid #e1e0ff', fontSize: '0.82rem', fontFamily: font, color: '#464652', outline: 'none', resize: 'vertical' }}
                />
              </div>
            ) : (
              <div style={{ marginBottom: '14px' }}>
                <p style={{ fontFamily: font, fontSize: '0.95rem', color: f.label ? '#191c20' : '#9a99a6' }}>
                  {f.label || 'Pertanyaan tanpa judul'}
                  {f.required && <span style={{ color: '#d93025' }}> *</span>}
                </p>
                {f.description && <p style={{ fontFamily: font, fontSize: '0.8rem', color: '#777683', marginTop: '4px', whiteSpace: 'pre-wrap' }}>{f.description}</p>}
              </div>
            )}

            {isChoice(f.type) ? (
              <div style={{ marginBottom: '12px' }}>
                {(f.options || []).map((o, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: '38px' }}>
                    {f.type === 'select' ? <Circle size={18} color="#b0afba" /> : <Square size={18} color="#b0afba" />}
                    {active ? (
                      <>
                        <input
                          autoFocus={focusOpt === `${f.id}:${idx}`}
                          onFocus={(e) => { e.target.select(); setFocusOpt(null); }}
                          value={o}
                          onChange={(e) => setOption(f, idx, e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOption(f, idx); } }}
                          style={{ flex: 1, padding: '6px 0', border: 'none', borderBottom: '1px solid transparent', fontSize: '0.88rem', fontFamily: font, outline: 'none' }}
                          onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = '#e1e0ff')}
                          onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = 'transparent')}
                        />
                        {(f.options || []).length > 1 && (
                          <button onClick={() => removeOption(f, idx)} title="Hapus opsi" style={iconBtn}><X size={18} /></button>
                        )}
                      </>
                    ) : (
                      <span style={{ fontSize: '0.88rem', color: '#464652', fontFamily: font }}>{o}</span>
                    )}
                  </div>
                ))}
                {active && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: '38px' }}>
                    {f.type === 'select' ? <Circle size={18} color="#b0afba" /> : <Square size={18} color="#b0afba" />}
                    <button onClick={() => addOption(f)} style={{ background: 'none', border: 'none', padding: '6px 0', color: '#777683', fontSize: '0.88rem', fontFamily: font, cursor: 'pointer' }}>
                      Tambah opsi
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: '#9a99a6', borderBottom: '1px dotted #c7c8cf', paddingBottom: '6px', width: f.type === 'textarea' ? '80%' : '50%', marginBottom: '20px', fontFamily: font }}>
                {ANSWER_PLACEHOLDER[f.type]}
              </p>
            )}

            {active && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '2px', borderTop: '1px solid #e1e0ff', paddingTop: '6px' }}>
                <button onClick={() => move(f.id, -1)} disabled={i === 0} title="Pindah ke atas" style={{ ...iconBtn, opacity: i === 0 ? 0.3 : 1 }}><ArrowUp size={18} /></button>
                <button onClick={() => move(f.id, 1)} disabled={i === keys.length - 1} title="Pindah ke bawah" style={{ ...iconBtn, opacity: i === keys.length - 1 ? 0.3 : 1 }}><ArrowDown size={18} /></button>
                <button onClick={(e) => { e.stopPropagation(); duplicate(f); }} title="Duplikat" style={iconBtn}><Copy size={18} /></button>
                <button onClick={(e) => { e.stopPropagation(); remove(f.id); }} title="Hapus" style={iconBtn}><Trash2 size={18} /></button>
                <span style={{ width: '1px', height: '28px', background: '#e1e0ff', margin: '0 10px' }} />
                <Toggle label="Wajib diisi" checked={f.required} onChange={(v) => update(f.id, { required: v })} />
              </div>
            )}
          </div>
        );
      })}

      {(!applyFields.pic || !applyFields.handleBy) && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {!applyFields.pic && (
            <button onClick={() => setApply({ pic: true })} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '999px', border: '1px solid #c9b6f7', background: 'white', color: '#6728e4', fontSize: '0.78rem', fontWeight: 700, fontFamily: font, cursor: 'pointer' }}>
              <Undo2 size={14} /> Kembalikan field PIC
            </button>
          )}
          {!applyFields.handleBy && (
            <button onClick={() => setApply({ handleBy: true })} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '999px', border: '1px solid #c9b6f7', background: 'white', color: '#6728e4', fontSize: '0.78rem', fontWeight: 700, fontFamily: font, cursor: 'pointer' }}>
              <Undo2 size={14} /> Kembalikan field Handle by
            </button>
          )}
        </div>
      )}

      <button
        onClick={addField}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', marginBottom: '16px', background: 'white', border: '1.5px dashed #c9b6f7', borderRadius: '12px', color: '#6728e4', fontWeight: 700, fontSize: '0.85rem', fontFamily: font, cursor: 'pointer' }}
      >
        <Plus size={16} /> Tambah Pertanyaan
      </button>

      {campaignId && <div style={{ position: 'sticky', bottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', background: 'white', border: '1px solid #e1e0ff', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 4px 20px rgba(107,46,232,0.12)' }}>
        <span style={{ fontSize: '0.8rem', fontFamily: font, color: status ? (status.ok ? '#1e7e34' : '#ba1a1a') : dirty ? '#b26a00' : '#777683' }}>
          {status?.text ?? (dirty ? 'Ada perubahan yang belum disimpan' : 'Semua perubahan tersimpan')}
        </span>
        <button onClick={save} disabled={saving || !dirty} className="btn-primary" style={{ padding: '9px 20px', fontSize: '0.82rem', opacity: saving || !dirty ? 0.6 : 1 }}>
          {saving ? 'Menyimpan...' : 'Simpan Form'}
        </button>
      </div>}
    </div>
  );
}
