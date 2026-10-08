import { useEffect, useMemo, useState } from 'react';
import { Copy, Check, Send, X, Users, UserRound } from 'lucide-react';
import api from '../../lib/api';

const font = 'var(--font-display)';
interface Option { id: string; label: string; sub?: string }
interface Creator { _id: string; name: string; phone?: string; source: string }
interface Group { jid: string; name?: string }

/** Grup listing Azera yang otomatis tercentang */
const isDefaultGroup = (name = '') => {
  const n = name.trim().toUpperCase();
  return n === 'GRUP PIC AZERA' || n.startsWith('AZERA MG X PARTNER');
};

/** Dropdown checklist (native <details>) dengan cari + pilih semua */
function ChecklistDropdown({ placeholder, options, selected, onChange }: { placeholder: string; options: Option[]; selected: string[]; onChange: (ids: string[]) => void }) {
  const [q, setQ] = useState('');
  const shown = options.filter((o) => `${o.label} ${o.sub ?? ''}`.toLowerCase().includes(q.toLowerCase()));
  const allShown = shown.length > 0 && shown.every((o) => selected.includes(o.id));
  const toggle = (id: string) => onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  const toggleAll = () =>
    onChange(allShown ? selected.filter((s) => !shown.some((o) => o.id === s)) : [...new Set([...selected, ...shown.map((o) => o.id)])]);

  return (
    <details style={{ marginTop: '10px', border: '1.5px solid #c7c8cf', borderRadius: '12px', background: 'white' }}>
      <summary style={{ padding: '10px 14px', cursor: 'pointer', fontSize: '0.82rem', fontFamily: font, color: selected.length ? '#191c20' : '#777683' }}>
        {selected.length ? `${selected.length} dipilih` : placeholder}
      </summary>
      <div style={{ borderTop: '1px solid #e1e0ff', padding: '10px 14px' }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari..." style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #c7c8cf', fontSize: '0.8rem', fontFamily: font, marginBottom: '6px' }} />
        {options.length === 0 ? (
          <p style={{ fontSize: '0.78rem', color: '#9a99a6', fontFamily: font, padding: '6px 0' }}>Tidak ada data.</p>
        ) : (
          <>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: '32px', fontSize: '0.8rem', fontWeight: 700, color: '#6728e4', fontFamily: font, cursor: 'pointer' }}>
              <input type="checkbox" checked={allShown} onChange={toggleAll} style={{ accentColor: '#6728e4' }} /> Pilih semua{q && ' (hasil cari)'}
            </label>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {shown.map((o) => (
                <label key={o.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: '32px', fontSize: '0.82rem', fontFamily: font, cursor: 'pointer' }}>
                  <input type="checkbox" checked={selected.includes(o.id)} onChange={() => toggle(o.id)} style={{ accentColor: '#6728e4' }} />
                  <span style={{ color: '#191c20' }}>{o.label}</span>
                  {o.sub && <span style={{ color: '#9a99a6', fontSize: '0.74rem' }}>{o.sub}</span>}
                </label>
              ))}
            </div>
          </>
        )}
      </div>
    </details>
  );
}

interface Props {
  campaignId: string;
  initialText: string;
  onClose: () => void;
}

/** Modal Broadcast Campaign setelah campaign dibuat: edit, copy, share (via WA partnership) ke grup / creator. */
export default function BroadcastShareModal({ campaignId, initialText, onClose }: Props) {
  const [text, setText] = useState(initialText);
  const [copied, setCopied] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const [creatorIds, setCreatorIds] = useState<string[]>([]);
  const [busy, setBusy] = useState<'group' | 'creator' | null>(null);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    api.get('/admin/campaigns/wa-groups').then((r) => {
      setGroups(r.data);
      setGroupIds(r.data.filter((g: Group) => isDefaultGroup(g.name)).map((g: Group) => g.jid));
    }).catch(() => setGroups([]));
    api.get('/admin/creators').then((r) => setCreators(r.data)).catch(() => setCreators([]));
  }, []);

  const groupOptions = useMemo(() => groups.map((g) => ({ id: g.jid, label: g.name || g.jid })), [groups]);
  // Creator dari pendaftaran (form) & dari campaign (campaign/import) yang punya nomor WA
  const creatorOptions = useMemo(
    () => creators.filter((c) => c.source !== 'extension' && c.phone).map((c) => ({ id: c._id, label: c.name, sub: c.phone })),
    [creators]
  );

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simpan teks terakhir sebagai broadcast campaign + buka pendaftaran, supaya link Daftar bisa dipakai
  const persist = () => api.patch(`/admin/campaigns/${campaignId}`, { briefContent: text, applyOpen: true });

  const share = async (kind: 'group' | 'creator') => {
    const ids = kind === 'group' ? groupIds : creatorIds;
    if (!ids.length) return;
    setBusy(kind);
    setStatus(null);
    try {
      await persist();
      const res = await api.post(`/admin/campaigns/${campaignId}/share`, kind === 'group' ? { message: text, groupJids: ids } : { message: text, creatorIds: ids });
      const failed: string[] = res.data.failed || [];
      setStatus({ ok: !failed.length, text: `${res.data.sent} pesan masuk antrian kirim (WA partnership)${failed.length ? `, ${failed.length} gagal (nomor tidak valid)` : ''}.` });
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setStatus({ ok: false, text: message || 'Gagal share broadcast.' });
    } finally {
      setBusy(null);
    }
  };

  const close = async () => {
    await persist().catch(() => undefined); // best-effort: edit terakhir tetap tersimpan walau tidak di-share
    onClose();
  };

  const shareBtn = (kind: 'group' | 'creator', label: string, Icon: typeof Users, count: number) => (
    <button onClick={() => void share(kind)} disabled={busy !== null || !count} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.82rem', opacity: busy !== null || !count ? 0.6 : 1 }}>
      <Icon size={15} /> {busy === kind ? 'Mengirim...' : `${label}${count ? ` (${count})` : ''}`}
    </button>
  );

  return (
    <div role="dialog" aria-modal="true" aria-label="Broadcast Campaign" style={{ position: 'fixed', inset: 0, background: 'rgba(25,28,32,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 100 }}>
      <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '720px', maxHeight: '92vh', overflowY: 'auto', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <p style={{ fontFamily: font, fontWeight: 700, fontSize: '1.1rem', color: '#191c20' }}>Campaign dibuat 🎉 Broadcast Campaign</p>
          <button onClick={() => void close()} title="Tutup" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5f6368', display: 'flex' }}><X size={20} /></button>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#777683', fontFamily: font, marginBottom: '14px' }}>
          Tergenerate dari kebutuhan campaign, link Daftar = form apply dari tahap 2. Silakan edit sebelum di-share.
        </p>

        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={16} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #c7c8cf', fontSize: '0.85rem', color: '#191c20', fontFamily: font, resize: 'vertical', outline: 'none' }} />

        <button onClick={() => void copy()} style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '10px 0 18px', padding: '8px 16px', borderRadius: '10px', border: '1.5px solid #6728e4', background: 'white', color: '#6728e4', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: font }}>
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Tersalin' : 'Copy'}
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div>
            {shareBtn('group', 'Share ke Grup', Users, groupIds.length)}
            <ChecklistDropdown placeholder="Pilih grup WhatsApp" options={groupOptions} selected={groupIds} onChange={setGroupIds} />
          </div>
          <div>
            {shareBtn('creator', 'Share ke Creator', UserRound, creatorIds.length)}
            <ChecklistDropdown placeholder="Pilih creator" options={creatorOptions} selected={creatorIds} onChange={setCreatorIds} />
          </div>
        </div>

        {status && (
          <p role="status" style={{ marginTop: '14px', fontSize: '0.82rem', fontFamily: font, padding: '10px 14px', borderRadius: '10px', background: status.ok ? '#e6f4ea' : '#ffdad6', color: status.ok ? '#1e7e34' : '#ba1a1a' }}>
            <Send size={13} style={{ verticalAlign: '-2px', marginRight: '6px' }} />{status.text}
          </p>
        )}
      </div>
    </div>
  );
}
