import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, FileText, Film, Image as ImageIcon, Link2, Loader2, Paperclip, Plus, Trash2, Type } from 'lucide-react';

/**
 * Brief Campaign ala Notion: satu dokumen, ketik langsung; sisipkan gambar/video/file/link di posisi mana
 * pun lewat tombol + di samping baris atau ketik "/" di baris kosong. Gambar bisa paste / drop. Autosave.
 * Data tetap urutan blok {kind, content} (teks = teks biasa, bukan HTML), lihat server briefBlocks.ts.
 */

export interface BriefBlock { kind: 'text' | 'file' | 'image' | 'video' | 'link'; content: string }
type MediaKind = 'image' | 'video' | 'file';
interface Item { id: string; kind: BriefBlock['kind'] | 'uploading'; content: string }

const f = 'var(--font-display)';
let seq = 0;
const newId = () => `b${++seq}`;
const toItems = (blocks: BriefBlock[]): Item[] => blocks.map((b) => ({ id: newId(), ...b }));
/** Mode edit selalu diakhiri baris teks kosong, tempat mengetik berikutnya */
const withTrailingText = (items: Item[]) => (items.at(-1)?.kind === 'text' ? items : [...items, { id: newId(), kind: 'text' as const, content: '' }]);
const toBlocks = (items: Item[]): BriefBlock[] =>
  items.filter((i): i is Item & { kind: BriefBlock['kind'] } => i.kind !== 'uploading' && (i.kind === 'text' ? !!i.content.trim() : /^https?:\/\//i.test(i.content.trim())))
    .map(({ kind, content }) => ({ kind, content: kind === 'text' ? content : content.trim() }));
const fileName = (url: string) => decodeURIComponent(url.split('?')[0].split('/').pop() || url);

const MENU: { kind: 'text' | 'link' | MediaKind; label: string; hint: string; icon: typeof Type }[] = [
  { kind: 'text', label: 'Teks', hint: 'Paragraf baru', icon: Type },
  { kind: 'image', label: 'Gambar', hint: 'Upload gambar (atau paste / drop)', icon: ImageIcon },
  { kind: 'video', label: 'Video', hint: 'Upload video', icon: Film },
  { kind: 'file', label: 'File', hint: 'PDF, dokumen, dll', icon: Paperclip },
  { kind: 'link', label: 'Link', hint: 'Tempel URL', icon: Link2 },
];
const ACCEPT: Record<MediaKind, string> = { image: 'image/*', video: 'video/*', file: '' };

function MediaView({ item }: { item: Item }) {
  if (item.kind === 'image') return <img src={item.content} alt="" style={{ maxWidth: '100%', borderRadius: '10px', display: 'block' }} />;
  if (item.kind === 'video') return <video src={item.content} controls style={{ maxWidth: '100%', borderRadius: '10px', display: 'block' }} />;
  const Icon = item.kind === 'file' ? FileText : Link2;
  return (
    <a href={item.content} target="_blank" rel="noopener noreferrer"
      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', maxWidth: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #e1e0ff', background: '#faf9ff', color: '#4b2fc4', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none', wordBreak: 'break-all' }}>
      <Icon size={15} style={{ flexShrink: 0 }} /> {item.kind === 'file' ? fileName(item.content) : item.content}
    </a>
  );
}

/** Tampilan baca saja (dashboard creator/PIC, atau client tanpa hak edit) */
export function BriefView({ blocks }: { blocks: BriefBlock[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: f, fontSize: '0.88rem', color: '#191c20', lineHeight: 1.6 }}>
      {blocks.map((b, i) => b.kind === 'text'
        ? <p key={i} style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{b.content}</p>
        : <MediaView key={i} item={{ id: String(i), ...b }} />)}
    </div>
  );
}

export default function BriefEditor({ initialBlocks, onSave, onUpload, placeholder }: {
  initialBlocks: BriefBlock[];
  onSave: (blocks: BriefBlock[]) => Promise<void>;
  onUpload: (file: File) => Promise<{ url: string; kind: BriefBlock['kind'] }>;
  placeholder?: string;
}) {
  const [items, setItems] = useState<Item[]>(() => withTrailingText(toItems(initialBlocks)));
  const [menuAt, setMenuAt] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const pendingUpload = useRef<string | null>(null);
  const focusId = useRef<string | null>(null);
  const textRefs = useRef(new Map<string, HTMLTextAreaElement>());
  const savedJson = useRef(JSON.stringify(toBlocks(toItems(initialBlocks))));
  const latest = useRef({ items, onSave });
  useEffect(() => { latest.current = { items, onSave }; });

  // Autosave 800ms setelah berhenti mengetik; hanya kalau isi yang disimpan benar-benar berubah
  useEffect(() => {
    const json = JSON.stringify(toBlocks(items));
    if (json === savedJson.current || items.some((i) => i.kind === 'uploading')) return;
    const t = window.setTimeout(() => {
      setStatus('saving');
      onSave(JSON.parse(json))
        .then(() => { savedJson.current = json; setStatus('saved'); })
        .catch(() => setStatus('error'));
    }, 800);
    return () => window.clearTimeout(t);
  }, [items, onSave]);

  // Pindah tab / tutup editor sebelum jeda autosave habis: simpan sisa ketikan terakhir
  useEffect(() => () => {
    const json = JSON.stringify(toBlocks(latest.current.items));
    if (json !== savedJson.current) void latest.current.onSave(JSON.parse(json)).catch(() => {});
  }, []);

  // Fokus ke baris teks yang baru dibuat/dituju
  useEffect(() => {
    const id = focusId.current;
    if (!id) return;
    focusId.current = null;
    const el = textRefs.current.get(id);
    if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
  });

  const update = (fn: (prev: Item[]) => Item[]) => setItems((prev) => withTrailingText(fn(prev)));
  const setText = (id: string, content: string) => update((prev) => prev.map((i) => (i.id === id ? { ...i, content } : i)));
  const remove = (id: string) => update((prev) => prev.filter((i) => i.id !== id));
  const move = (id: string, dir: -1 | 1) => update((prev) => {
    const i = prev.findIndex((x) => x.id === id), j = i + dir;
    if (j < 0 || j >= prev.length) return prev;
    const next = [...prev];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  });
  /** Sisipkan setelah afterId; kalau afterId baris teks kosong, baris itu yang diganti (seperti Notion) */
  const insertAfter = (afterId: string, item: Item) => update((prev) => {
    const i = prev.findIndex((x) => x.id === afterId);
    const replace = prev[i]?.kind === 'text' && !prev[i].content.trim();
    const next = [...prev];
    next.splice(i < 0 ? next.length : i + (replace ? 0 : 1), replace ? 1 : 0, item);
    return next;
  });

  const uploadFiles = async (afterId: string, files: File[]) => {
    setError('');
    let anchor = afterId;
    for (const file of files) {
      const placeholderItem: Item = { id: newId(), kind: 'uploading', content: file.name };
      insertAfter(anchor, placeholderItem);
      anchor = placeholderItem.id;
      try {
        const { url, kind } = await onUpload(file);
        setItems((prev) => prev.map((i) => (i.id === placeholderItem.id ? { ...i, kind, content: url } : i)));
      } catch {
        setError(`Gagal upload ${file.name}.`);
        remove(placeholderItem.id);
      }
    }
  };

  const choose = (afterId: string, kind: (typeof MENU)[number]['kind']) => {
    setMenuAt(null);
    setError('');
    // "/" yang diketik untuk membuka menu dihapus
    setItems((prev) => prev.map((i) => (i.id === afterId && i.content === '/' ? { ...i, content: '' } : i)));
    if (kind === 'text') {
      const item: Item = { id: newId(), kind: 'text', content: '' };
      focusId.current = item.id;
      insertAfter(afterId, item);
    } else if (kind === 'link') {
      // Link baru = baris input URL di dokumen; selesai saat Enter / klik di luar
      const item: Item = { id: newId(), kind: 'link', content: '' };
      setEditingLink(item.id);
      insertAfter(afterId, item);
    } else if (fileInput.current) {
      pendingUpload.current = afterId;
      fileInput.current.accept = ACCEPT[kind];
      fileInput.current.click();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, item: Item, index: number) => {
    if (e.key === 'Escape') setMenuAt(null);
    // Backspace di baris kosong = hapus baris, pindah ke akhir baris teks sebelumnya
    if (e.key === 'Backspace' && !item.content && index > 0) {
      e.preventDefault();
      const prevText = items.slice(0, index).reverse().find((i) => i.kind === 'text');
      if (prevText) focusId.current = prevText.id;
      remove(item.id);
    }
  };

  const autoGrow = (el: HTMLTextAreaElement | null, id: string) => {
    if (!el) { textRefs.current.delete(id); return; }
    textRefs.current.set(id, el);
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  const toolBtn: React.CSSProperties = { width: '24px', height: '24px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#9a99a6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
  const isOnlyEmpty = items.length === 1 && !items[0].content;

  return (
    <div
      className="brief-editor"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const files = [...e.dataTransfer.files];
        if (!files.length) return;
        e.preventDefault();
        const target = (e.target as HTMLElement).closest<HTMLElement>('[data-brief-id]')?.dataset.briefId ?? items[items.length - 1].id;
        void uploadFiles(target, files);
      }}
      style={{ fontFamily: f, fontSize: '0.88rem', color: '#191c20', lineHeight: 1.6, paddingLeft: '30px' }}
    >
      <style>{`
        .brief-editor .brief-gutter, .brief-editor .brief-tools { opacity: 0; transition: opacity .15s; }
        .brief-editor .brief-row:hover .brief-gutter, .brief-editor .brief-row:focus-within .brief-gutter, .brief-editor .brief-row:hover .brief-tools { opacity: 1; }
        .brief-editor .brief-gutter button:hover, .brief-editor .brief-tools button:hover { background: #f0eeff !important; color: #6728e4 !important; }
        .brief-editor textarea::placeholder { color: #b5b4c0; }
        @media (hover: none) { .brief-editor .brief-gutter, .brief-editor .brief-tools { opacity: 1; } }
        @keyframes brief-spin { to { transform: rotate(360deg); } }
      `}</style>
      <input ref={fileInput} type="file" multiple hidden onChange={(e) => {
        const files = [...(e.target.files ?? [])];
        e.target.value = '';
        if (files.length && pendingUpload.current) void uploadFiles(pendingUpload.current, files);
      }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map((item, index) => (
          <div key={item.id} data-brief-id={item.id} className="brief-row" style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', marginLeft: '-30px' }}>
            <div className="brief-gutter" style={{ width: '26px', flexShrink: 0, paddingTop: item.kind === 'text' ? '1px' : '4px' }}>
              <button type="button" aria-label="Sisipkan konten" title="Sisipkan teks, gambar, video, file, atau link" style={toolBtn}
                onClick={() => setMenuAt(menuAt === item.id ? null : item.id)}><Plus size={16} /></button>
            </div>

            <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
              {item.kind === 'text' ? (
                <textarea
                  ref={(el) => autoGrow(el, item.id)}
                  value={item.content}
                  rows={1}
                  aria-label="Isi brief"
                  placeholder={isOnlyEmpty ? (placeholder ?? 'Tulis brief di sini… ketik "/" untuk sisipkan gambar, video, file, atau link') : index === items.length - 1 ? 'Ketik "/" untuk sisipkan konten' : ''}
                  onChange={(e) => { setText(item.id, e.target.value); setMenuAt(e.target.value === '/' ? item.id : null); }}
                  onKeyDown={(e) => onKeyDown(e, item, index)}
                  onPaste={(e) => {
                    const files = [...e.clipboardData.files];
                    if (!files.length) return;
                    e.preventDefault();
                    void uploadFiles(item.id, files);
                  }}
                  style={{ width: '100%', border: 'none', outline: 'none', resize: 'none', overflow: 'hidden', background: 'transparent', padding: '2px 0', font: 'inherit', color: 'inherit', lineHeight: 'inherit', display: 'block' }}
                />
              ) : item.kind === 'link' && editingLink === item.id ? (
                <input
                  autoFocus
                  value={item.content}
                  placeholder="Tempel link, lalu Enter (https://...)"
                  aria-label="URL link"
                  onChange={(e) => setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, content: e.target.value } : i)))}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); e.currentTarget.blur(); } }}
                  onBlur={(e) => {
                    setEditingLink(null);
                    const url = e.target.value.trim();
                    if (/^https?:\/\/\S+$/i.test(url)) return;
                    if (url) setError('Link harus diawali http:// atau https://');
                    remove(item.id);
                  }}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1.5px solid #c4b5fd', outline: 'none', font: 'inherit', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              ) : item.kind === 'uploading' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '10px', background: '#f8f9ff', color: '#777683', fontSize: '0.82rem' }}>
                  <Loader2 size={15} style={{ animation: 'brief-spin 1s linear infinite' }} /> Mengupload {item.content}…
                </div>
              ) : (
                <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
                  <MediaView item={item} />
                  <div className="brief-tools" style={{ position: 'absolute', top: '6px', right: '6px', display: 'flex', gap: '2px', padding: '2px', borderRadius: '8px', background: 'rgba(255,255,255,0.95)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                    <button type="button" aria-label="Naikkan" title="Naikkan" style={toolBtn} onClick={() => move(item.id, -1)}><ArrowUp size={14} /></button>
                    <button type="button" aria-label="Turunkan" title="Turunkan" style={toolBtn} onClick={() => move(item.id, 1)}><ArrowDown size={14} /></button>
                    <button type="button" aria-label="Hapus" title="Hapus" style={{ ...toolBtn, color: '#ba1a1a' }} onClick={() => remove(item.id)}><Trash2 size={14} /></button>
                  </div>
                </div>
              )}

              {menuAt === item.id && (
                <div role="menu" style={{ position: 'absolute', top: '100%', left: 0, zIndex: 20, marginTop: '4px', width: '250px', padding: '6px', borderRadius: '12px', background: 'white', border: '1px solid #e1e0ff', boxShadow: '0 12px 32px rgba(30,10,94,0.18)' }}>
                  {MENU.map(({ kind, label, hint, icon: Icon }) => (
                    <button key={kind} type="button" role="menuitem" className="brief-menu-item"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => choose(item.id, kind)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '7px 8px', borderRadius: '8px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: f }}>
                      <span style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1px solid #e1e0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6728e4', flexShrink: 0 }}><Icon size={15} /></span>
                      <span>
                        <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#191c20' }}>{label}</span>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: '#8a8a99' }}>{hint}</span>
                      </span>
                    </button>
                  ))}
                  <style>{'.brief-menu-item:hover { background: #f4f3ff !important; }'}</style>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '10px', fontSize: '0.72rem', color: '#9a99a6', minHeight: '18px' }}>
        <span style={{ color: '#ba1a1a' }}>{error}</span>
        <span>{status === 'saving' ? 'Menyimpan…' : status === 'saved' ? 'Tersimpan' : status === 'error' ? <span style={{ color: '#ba1a1a' }}>Gagal menyimpan, coba ketik lagi</span> : ''}</span>
      </div>
    </div>
  );
}
