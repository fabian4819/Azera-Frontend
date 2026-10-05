import { useState } from 'react';
import { Plus, Trash2, Copy, ArrowUp, ArrowDown, X, Circle, Square, GripHorizontal, Lock, Undo2 } from 'lucide-react';
import api from '../../lib/api';

export type CustomFieldType = 'text' | 'textarea' | 'number' | 'select' | 'checkbox';
export interface CustomField { id: string; label: string; type: CustomFieldType; required: boolean; options?: string[] }
/** Field default form Apply: Nama/WA/Email selalu ada; PIC & Handle by bisa dihapus admin. */
export interface ApplyFields { pic: boolean; handleBy: boolean; handleByRequired: boolean }
const DEFAULT_APPLY_FIELDS: ApplyFields = { pic: true, handleBy: true, handleByRequired: false };

const TYPE_LABELS: Record<CustomFieldType, string> = {
  text: 'Jawaban Singkat', textarea: 'Paragraf', number: 'Angka',
  select: 'Pilihan Ganda', checkbox: 'Kotak Centang',
};
const ANSWER_PLACEHOLDER: Partial<Record<CustomFieldType, string>> = {
  text: 'Teks jawaban singkat', textarea: 'Teks jawaban panjang', number: 'Jawaban angka',
};
const isChoice = (t: CustomFieldType) => t === 'select' || t === 'checkbox';
const font = "var(--font-display)";
const iconBtn: React.CSSProperties = {
  padding: '8px', background: 'none', border: 'none', borderRadius: '50%', color: '#5f6368', cursor: 'pointer', display: 'flex',
};

interface Props {
  campaignId: string;
  initial: CustomField[];
  initialApplyFields?: ApplyFields;
  /** Semua akun PIC terdaftar + yang dicentang untuk campaign ini (jadi opsi dropdown PIC di form) */
  pics: { _id: string; name: string; email: string }[];
  assignedPicIds: string[];
  onTogglePic: (pic: { _id: string; name: string; email: string; phone: string }, on: boolean) => Promise<void>;
  onSaved: (fields: CustomField[], applyFields: ApplyFields) => void;
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
export default function CustomFormBuilder({ campaignId, initial, initialApplyFields, pics, assignedPicIds, onTogglePic, onSaved }: Props) {
  const [fields, setFields] = useState<CustomField[]>(initial);
  const [applyFields, setApplyFields] = useState<ApplyFields>(initialApplyFields ?? DEFAULT_APPLY_FIELDS);
  const [saved, setSaved] = useState(JSON.stringify([initial, initialApplyFields ?? DEFAULT_APPLY_FIELDS]));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [focusOpt, setFocusOpt] = useState<string | null>(null);
  // Drag cuma aktif kalau mulai dari handle, supaya select teks di input tetap normal
  const [handleId, setHandleId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
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

  const move = (id: string, dir: -1 | 1) =>
    setFields((prev) => {
      const i = prev.findIndex((f) => f.id === id);
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  // Reorder live saat kartu yang di-drag melewati kartu lain
  const dragOver = (overId: string) =>
    setFields((prev) => {
      const from = prev.findIndex((f) => f.id === dragId);
      const to = prev.findIndex((f) => f.id === overId);
      if (from === -1 || to === -1 || from === to) return prev;
      const next = [...prev];
      next.splice(to, 0, next.splice(from, 1)[0]);
      return next;
    });

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
      const cleaned = fields
        .filter((f) => f.label.trim())
        .map((f) => ({
          ...f,
          label: f.label.trim(),
          options: isChoice(f.type) ? (f.options || []).map((o) => o.trim()).filter(Boolean) : [],
        }));
      const res = await api.patch(`/admin/campaigns/${campaignId}`, { customFields: cleaned, applyFields });
      const next: CustomField[] = res.data.customFields || [];
      const nextApply: ApplyFields = res.data.applyFields ?? applyFields;
      setFields(next);
      setApplyFields(nextApply);
      setSaved(JSON.stringify([next, nextApply]));
      onSaved(next, nextApply);
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
          Field default di bawah otomatis ada di form Apply. Nama, WhatsApp, dan Email wajib; PIC dan Handle by boleh dihapus.
          Tambahkan pertanyaan lain sesuai kebutuhan campaign.
        </p>
      </div>

      {['Nama Lengkap', 'WhatsApp', 'Email'].map((label) => (
        <div key={label} style={{ ...defaultCard, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: font, fontSize: '0.95rem', color: '#191c20' }}>{label}<span style={{ color: '#d93025' }}> *</span></p>
            {answerLine('50%', 'Teks jawaban singkat')}
          </div>
          <span title="Field default, tidak bisa dihapus" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', color: '#777683', fontFamily: font, whiteSpace: 'nowrap' }}>
            <Lock size={13} /> Wajib
          </span>
        </div>
      ))}

      {applyFields.pic && (
        <div style={defaultCard}>
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
      )}

      {applyFields.handleBy && (
        <div style={defaultCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <p style={{ fontFamily: font, fontSize: '0.95rem', color: '#191c20' }}>Handle by{applyFields.handleByRequired && <span style={{ color: '#d93025' }}> *</span>}</p>
            <button onClick={() => setApply({ handleBy: false })} title="Hapus field Handle by dari form" style={iconBtn}><Trash2 size={18} /></button>
          </div>
          {answerLine('50%', 'Teks jawaban singkat (isian bebas)')}
          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e1e0ff', paddingTop: '8px', marginTop: '12px' }}>
            <Toggle label="Wajib diisi" checked={applyFields.handleByRequired} onChange={(v) => setApply({ handleByRequired: v })} />
          </div>
        </div>
      )}

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

      {fields.map((f, i) => {
        const active = f.id === activeId;
        return (
          <div
            key={f.id}
            onClick={() => setActiveId(f.id)}
            draggable={handleId === f.id}
            onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; setDragId(f.id); }}
            onDragOver={(e) => { if (!dragId) return; e.preventDefault(); dragOver(f.id); }}
            onDragEnd={() => { setDragId(null); setHandleId(null); }}
            style={{
              opacity: dragId === f.id ? 0.5 : 1,
              background: 'white', borderRadius: '12px', border: '1px solid #e1e0ff', marginBottom: '12px', cursor: active ? 'default' : 'pointer',
              borderLeft: active ? '6px solid #6728e4' : '6px solid transparent', boxShadow: active ? '0 4px 16px rgba(107,46,232,0.12)' : 'none',
              padding: '4px 24px 8px',
            }}
          >
            <div
              title="Geser untuk mengubah urutan"
              onMouseDown={() => setHandleId(f.id)}
              onMouseUp={() => setHandleId(null)}
              style={{ display: 'flex', justifyContent: 'center', color: '#b0afba', cursor: dragId ? 'grabbing' : 'grab', padding: '2px 0 6px' }}
            >
              <GripHorizontal size={18} />
            </div>
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
              </div>
            ) : (
              <p style={{ fontFamily: font, fontSize: '0.95rem', color: f.label ? '#191c20' : '#9a99a6', marginBottom: '14px' }}>
                {f.label || 'Pertanyaan tanpa judul'}
                {f.required && <span style={{ color: '#d93025' }}> *</span>}
              </p>
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
                <button onClick={() => move(f.id, 1)} disabled={i === fields.length - 1} title="Pindah ke bawah" style={{ ...iconBtn, opacity: i === fields.length - 1 ? 0.3 : 1 }}><ArrowDown size={18} /></button>
                <button onClick={(e) => { e.stopPropagation(); duplicate(f); }} title="Duplikat" style={iconBtn}><Copy size={18} /></button>
                <button onClick={(e) => { e.stopPropagation(); remove(f.id); }} title="Hapus" style={iconBtn}><Trash2 size={18} /></button>
                <span style={{ width: '1px', height: '28px', background: '#e1e0ff', margin: '0 10px' }} />
                <Toggle label="Wajib diisi" checked={f.required} onChange={(v) => update(f.id, { required: v })} />
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={addField}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', marginBottom: '16px', background: 'white', border: '1.5px dashed #c9b6f7', borderRadius: '12px', color: '#6728e4', fontWeight: 700, fontSize: '0.85rem', fontFamily: font, cursor: 'pointer' }}
      >
        <Plus size={16} /> Tambah Pertanyaan
      </button>

      <div style={{ position: 'sticky', bottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', background: 'white', border: '1px solid #e1e0ff', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 4px 20px rgba(107,46,232,0.12)' }}>
        <span style={{ fontSize: '0.8rem', fontFamily: font, color: status ? (status.ok ? '#1e7e34' : '#ba1a1a') : dirty ? '#b26a00' : '#777683' }}>
          {status?.text ?? (dirty ? 'Ada perubahan yang belum disimpan' : 'Semua perubahan tersimpan')}
        </span>
        <button onClick={save} disabled={saving || !dirty} className="btn-primary" style={{ padding: '9px 20px', fontSize: '0.82rem', opacity: saving || !dirty ? 0.6 : 1 }}>
          {saving ? 'Menyimpan...' : 'Simpan Form'}
        </button>
      </div>
    </div>
  );
}
