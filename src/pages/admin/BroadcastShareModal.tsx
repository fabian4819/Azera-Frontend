import { useEffect, useMemo, useState } from 'react';
import { Copy, Check, Send, X, Users, UserRound, Table2, Save } from 'lucide-react';
import api from '../../lib/api';
import Creators from './Creators';
import ChecklistDropdown from '../../components/ui/ChecklistDropdown';

const font = 'var(--font-display)';
const outlineBtn: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1.5px solid #6728e4', background: 'white', color: '#6728e4', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: font };
interface Creator { _id: string; name: string; phone?: string; source: string }
interface Group { jid: string; name?: string }
interface Sender { id: string; status: string; connectedNumber: string | null }
const SENDER_LABELS: Record<string, string> = { partnership: 'Partnership / Brand', creator: 'Creator / KOL', developer: 'Developer (lokal)' };

/** Grup listing Azera yang otomatis tercentang */
const isDefaultGroup = (name = '') => {
  const n = name.trim().toUpperCase();
  return n === 'GRUP PIC AZERA' || n.startsWith('AZERA MG X PARTNER');
};

interface PanelProps {
  campaignId: string;
  text: string;
  onTextChange: (text: string) => void;
  /** Dipanggil dengan campaign terbaru tiap teks disimpan (share/Simpan) */
  onPersisted?: (campaign: unknown) => void;
  /** Tampilkan tombol Simpan (halaman detail campaign) */
  showSave?: boolean;
  /** Share sekalian buka pendaftaran, cuma untuk campaign baru; di detail admin atur sendiri di Form Pendaftaran */
  openOnShare?: boolean;
}

/** Editor + share Broadcast Campaign: edit, copy, pilih WA pengirim, share ke grup / creator.
 * Dipakai di modal setelah buat campaign dan di tab Overview CampaignDetail. */
export function BroadcastSharePanel({ campaignId, text, onTextChange: setText, onPersisted, showSave, openOnShare = false }: PanelProps) {
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const [creatorIds, setCreatorIds] = useState<string[]>([]);
  const [busy, setBusy] = useState<'group' | 'creator' | null>(null);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [allCreatorsOpen, setAllCreatorsOpen] = useState(false);
  const [senders, setSenders] = useState<Sender[]>([]);
  const [bot, setBot] = useState('');

  useEffect(() => {
    api.get('/admin/creators').then((r) => setCreators(r.data)).catch(() => setCreators([]));
    // Default: partnership kalau terhubung, selain itu WA pertama yang terhubung (di lokal = developer)
    api.get('/admin/campaigns/wa-senders').then((r) => {
      const list: Sender[] = r.data;
      setSenders(list);
      const on = list.filter((x) => x.status === 'connected');
      setBot((on.find((x) => x.id === 'partnership') ?? on[0] ?? list[0])?.id ?? '');
    }).catch(() => setSenders([]));
  }, []);

  const pickBot = (id: string) => {
    setGroups([]);
    setGroupIds([]);
    setBot(id);
  };

  // Grup ikut nomor pengirim, dicentang ulang ke grup default tiap ganti WA
  useEffect(() => {
    if (!bot) return;
    api.get('/admin/campaigns/wa-groups', { params: { bot } }).then((r) => {
      setGroups(r.data);
      setGroupIds(r.data.filter((g: Group) => isDefaultGroup(g.name)).map((g: Group) => g.jid));
    }).catch(() => setGroups([]));
  }, [bot]);

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

  // Simpan teks terakhir sebagai broadcast campaign (+ buka pendaftaran kalau openOnShare, yaitu campaign baru)
  const persist = async (openRegistration = openOnShare) => {
    const res = await api.patch(`/admin/campaigns/${campaignId}`, { briefContent: text, ...(openRegistration ? { applyOpen: true } : {}) });
    onPersisted?.(res.data);
  };

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await persist(false);
      setStatus({ ok: true, text: 'Broadcast disimpan.' });
    } catch {
      setStatus({ ok: false, text: 'Gagal menyimpan broadcast.' });
    } finally {
      setSaving(false);
    }
  };

  const share = async (kind: 'group' | 'creator') => {
    const ids = kind === 'group' ? groupIds : creatorIds;
    if (!ids.length) return;
    setBusy(kind);
    setStatus(null);
    try {
      await persist();
      const res = await api.post(`/admin/campaigns/${campaignId}/share`, kind === 'group' ? { message: text, groupJids: ids, bot } : { message: text, creatorIds: ids, bot });
      const failed: string[] = res.data.failed || [];
      setStatus({ ok: !failed.length, text: `${res.data.sent} pesan masuk antrian kirim (WA ${SENDER_LABELS[bot] ?? bot})${failed.length ? `, ${failed.length} gagal (nomor tidak valid)` : ''}.` });
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setStatus({ ok: false, text: message || 'Gagal share broadcast.' });
    } finally {
      setBusy(null);
    }
  };

  const shareBtn = (kind: 'group' | 'creator', label: string, Icon: typeof Users, count: number) => (
    <button onClick={() => void share(kind)} disabled={busy !== null || !count} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.82rem', opacity: busy !== null || !count ? 0.6 : 1 }}>
      <Icon size={15} /> {busy === kind ? 'Mengirim...' : `${label}${count ? ` (${count})` : ''}`}
    </button>
  );

  return (
    <div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={16} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #c7c8cf', fontSize: '0.85rem', color: '#191c20', fontFamily: font, resize: 'vertical', outline: 'none' }} />

        <div style={{ display: 'flex', gap: '8px', margin: '10px 0 18px' }}>
          <button onClick={() => void copy()} style={outlineBtn}>
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Tersalin' : 'Copy'}
          </button>
          {showSave && (
            <button onClick={() => void save()} disabled={saving} style={{ ...outlineBtn, opacity: saving ? 0.6 : 1 }}>
              <Save size={14} /> {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          )}
        </div>

        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#191c20', marginBottom: '6px', fontFamily: font }}>Kirim pakai WA</label>
        <select value={bot} onChange={(e) => pickBot(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #c7c8cf', fontSize: '0.85rem', fontFamily: font, background: 'white', marginBottom: '16px', cursor: 'pointer' }}>
          {senders.map((x) => (
            <option key={x.id} value={x.id} disabled={x.status !== 'connected'}>
              {SENDER_LABELS[x.id] ?? x.id}: {x.status === 'connected' ? x.connectedNumber : 'belum terhubung'}
            </option>
          ))}
        </select>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div>
            {shareBtn('group', 'Share ke Grup', Users, groupIds.length)}
            <ChecklistDropdown placeholder="Pilih grup WhatsApp" options={groupOptions} selected={groupIds} onChange={setGroupIds} />
          </div>
          <div>
            {shareBtn('creator', 'Share ke Creator', UserRound, creatorIds.length)}
            <ChecklistDropdown placeholder="Pilih creator" options={creatorOptions} selected={creatorIds} onChange={setCreatorIds} />
            <button onClick={() => setAllCreatorsOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', padding: '6px 0', background: 'none', border: 'none', color: '#6728e4', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: font }}>
              <Table2 size={14} /> See all creator
            </button>
          </div>
        </div>

        {allCreatorsOpen && (
          <div role="dialog" aria-modal="true" aria-label="Semua creator" style={{ position: 'fixed', inset: 0, background: 'rgba(25,28,32,0.45)', zIndex: 110, padding: '16px', display: 'flex' }}>
            <div style={{ background: '#f8f9ff', borderRadius: '16px', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', padding: '20px', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <p style={{ fontFamily: font, fontWeight: 700, fontSize: '1.05rem', color: '#191c20' }}>Pilih Creator <span style={{ fontWeight: 500, color: '#777683', fontSize: '0.85rem' }}>· {creatorIds.length} dipilih</span></p>
                <button onClick={() => setAllCreatorsOpen(false)} className="btn-primary" style={{ padding: '9px 20px', fontSize: '0.82rem' }}>Selesai</button>
              </div>
              <Creators scope="share" selected={creatorIds} onSelectedChange={setCreatorIds} />
            </div>
          </div>
        )}

        {status && (
          <p role="status" style={{ marginTop: '14px', fontSize: '0.82rem', fontFamily: font, padding: '10px 14px', borderRadius: '10px', background: status.ok ? '#e6f4ea' : '#ffdad6', color: status.ok ? '#1e7e34' : '#ba1a1a' }}>
            <Send size={13} style={{ verticalAlign: '-2px', marginRight: '6px' }} />{status.text}
          </p>
        )}
    </div>
  );
}

interface Props {
  campaignId: string;
  initialText: string;
  onClose: () => void;
}

/** Modal Broadcast Campaign setelah campaign dibuat. */
export default function BroadcastShareModal({ campaignId, initialText, onClose }: Props) {
  const [text, setText] = useState(initialText);

  const close = async () => {
    // best-effort: edit terakhir tetap tersimpan (dan pendaftaran dibuka) walau tidak di-share
    await api.patch(`/admin/campaigns/${campaignId}`, { briefContent: text, applyOpen: true }).catch(() => undefined);
    onClose();
  };

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
        <BroadcastSharePanel campaignId={campaignId} text={text} onTextChange={setText} openOnShare />
      </div>
    </div>
  );
}
