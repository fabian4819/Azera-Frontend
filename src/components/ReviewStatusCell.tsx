import { useState } from 'react';
import { Check, RotateCcw, X } from 'lucide-react';

// Status review draft / posting (Submission.status)
const REVIEW_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  submitted: { bg: '#fff4d6', color: '#8a5a00', label: 'Menunggu review' },
  approved: { bg: '#d7f5e3', color: '#146c2e', label: 'Approved' },
  revision_requested: { bg: '#ffdad6', color: '#93000a', label: 'Revisi' },
};

interface Props {
  type: 'draft' | 'post';
  status: string;
  notes?: string;
  /** Simpan keputusan; error dilempar supaya form catatan tetap terbuka. Kosong = baca saja (dashboard creator/PIC). */
  onReview?: (status: 'approved' | 'revision_requested', notes?: string) => Promise<void>;
}

const POP_W = 340;

/** Posisi popup (fixed) di bawah elemen; kalau mepet bawah layar, di atasnya. */
function popupPos(rect: DOMRect, height: number): React.CSSProperties {
  const below = rect.bottom + height + 12 < window.innerHeight;
  return {
    position: 'fixed', zIndex: 300, width: POP_W, left: Math.max(8, Math.min(rect.left, window.innerWidth - POP_W - 8)),
    ...(below ? { top: rect.bottom + 6 } : { bottom: window.innerHeight - rect.top + 6 }),
  };
}

/** Sel Status Draft / Status Posting: badge + catatan revisi (popup saat hover), plus Approve / Revisi
 * kalau ada onReview (Master Sheet admin & dashboard client). */
export default function ReviewStatusCell({ type, status, notes, onReview }: Props) {
  const [busy, setBusy] = useState(false);
  // Form catatan revisi (popup textarea, catatan bisa panjang) + popup baca catatan saat hover
  const [editing, setEditing] = useState<{ text: string; rect: DOMRect } | null>(null);
  const [hover, setHover] = useState<DOMRect | null>(null);

  if (!status) return <span style={{ color: '#9a99a6' }}>{type === 'draft' ? 'Belum ada draft' : 'Belum posting'}</span>;

  const run = async (next: 'approved' | 'revision_requested', text?: string) => {
    if (!onReview) return;
    setBusy(true);
    try {
      await onReview(next, text);
      setEditing(null);
    } catch {
      // pesan error ditampilkan oleh pemanggil
    } finally {
      setBusy(false);
    }
  };

  const openEditor = (e: React.MouseEvent<HTMLElement>, text: string) => {
    e.stopPropagation();
    if (!onReview) return;
    setHover(null);
    setEditing({ text, rect: (e.currentTarget.closest('td') ?? e.currentTarget).getBoundingClientRect() });
  };

  const btn = (bg: string, color: string): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 8px', borderRadius: '6px', border: 'none',
    background: bg, color, fontSize: '0.7rem', fontWeight: 700, cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.6 : 1,
  });

  const s = REVIEW_STYLE[status] ?? REVIEW_STYLE.submitted;
  const ok = Boolean(editing?.text.trim());
  const send = () => { if (editing && ok) void run('revision_requested', editing.text); };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ background: s.bg, color: s.color, borderRadius: '999px', padding: '2px 9px', fontSize: '0.7rem', fontWeight: 700 }}>{s.label}</span>
      {onReview && status !== 'approved' && (
        <button type="button" disabled={busy} onClick={(e) => { e.stopPropagation(); void run('approved'); }} style={btn('#146c2e', 'white')}><Check size={11} /> Approve</button>
      )}
      {onReview && status !== 'revision_requested' && (
        <button type="button" disabled={busy} onClick={(e) => openEditor(e, '')} style={btn('#ffdad6', '#93000a')}><RotateCcw size={11} /> Revisi</button>
      )}
      {status === 'revision_requested' && notes && (
        <button type="button" aria-label={`Catatan revisi: ${notes}${onReview ? '. Klik untuk ubah' : ''}`}
          onMouseEnter={(e) => setHover(e.currentTarget.getBoundingClientRect())} onMouseLeave={() => setHover(null)}
          onFocus={(e) => setHover(e.currentTarget.getBoundingClientRect())} onBlur={() => setHover(null)}
          onClick={(e) => openEditor(e, notes)}
          style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', background: 'none', border: 'none', padding: 0, color: '#5f6368', fontStyle: 'italic', fontSize: '0.72rem', cursor: onReview ? 'pointer' : 'help' }}>
          “{notes}”
        </button>
      )}

      {hover && notes && !editing && (
        <div role="tooltip" style={{
          ...popupPos(hover, 200), pointerEvents: 'none', background: '#191c20', color: 'white', borderRadius: '12px', padding: '12px 14px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.22)', whiteSpace: 'normal', fontStyle: 'normal',
        }}>
          <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#c9b6f7', marginBottom: '6px' }}>
            Catatan revisi {type === 'draft' ? 'draft' : 'posting'}
          </p>
          <p style={{ fontSize: '0.8rem', lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: '50vh', overflow: 'hidden' }}>{notes}</p>
          {onReview && <p style={{ fontSize: '0.68rem', color: '#9a99a6', marginTop: '8px' }}>Klik untuk ubah catatan</p>}
        </div>
      )}

      {editing && (
        <>
          <div onClick={(e) => { e.stopPropagation(); if (!busy) setEditing(null); }} style={{ position: 'fixed', inset: 0, zIndex: 299 }} />
          <div role="dialog" aria-label="Catatan revisi" onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => { if (e.key === 'Escape' && !busy) setEditing(null); }}
            style={{ ...popupPos(editing.rect, 230), background: 'white', borderRadius: '12px', padding: '14px', boxShadow: '0 8px 28px rgba(0,0,0,0.22)', whiteSpace: 'normal' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#191c20', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
              Catatan revisi {type === 'draft' ? 'draft' : 'posting'}
            </p>
            <textarea autoFocus value={editing.text} maxLength={1000} rows={5} placeholder="Tulis apa yang perlu direvisi…"
              onChange={(e) => setEditing({ ...editing, text: e.target.value })}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send(); }}
              style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #c9b6f7', borderRadius: '8px', padding: '8px 10px', fontSize: '0.8rem', lineHeight: 1.5, fontFamily: 'inherit', resize: 'vertical', outline: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <span style={{ fontSize: '0.68rem', color: '#9a99a6', marginRight: 'auto' }}>{editing.text.length}/1000 · Ctrl/⌘+Enter kirim</span>
              <button type="button" disabled={busy} onClick={() => setEditing(null)} style={{ ...btn('#eef0f2', '#5f6368'), padding: '5px 12px' }}><X size={11} /> Batal</button>
              <button type="button" disabled={busy || !ok} onClick={send} style={{ ...btn('#93000a', 'white'), padding: '5px 12px', opacity: busy || !ok ? 0.5 : 1 }}>
                {busy ? 'Menyimpan…' : 'Kirim revisi'}
              </button>
            </div>
          </div>
        </>
      )}
    </span>
  );
}
