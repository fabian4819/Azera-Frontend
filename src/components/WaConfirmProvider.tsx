import { useCallback, useRef, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import api from '../lib/api';
import { WaConfirmContext, GroupLinkContext, type WaConfirmRequest } from '../lib/waConfirm';

const font = 'var(--font-display)';
const SENDER_LABELS: Record<string, string> = { partnership: 'Partnership / Brand', creator: 'Creator / KOL', developer: 'Developer (lokal)' };
interface Sender { id: string; status: string; connectedNumber: string | null }

/** Satu modal untuk semua tindakan admin yang memicu bot WA: tampilkan penerima + pilih nomor pengirim
 * (default = pengaturan pengirim di detail campaign, bisa diganti untuk kiriman ini saja). */
export default function WaConfirmProvider({ children }: { children: React.ReactNode }) {
  const [req, setReq] = useState<WaConfirmRequest | null>(null);
  const [senders, setSenders] = useState<Sender[]>([]);
  const [sender, setSender] = useState('');
  const [loading, setLoading] = useState(false);
  const resolver = useRef<((v: string | null) => void) | null>(null);

  const confirm = useCallback((r: WaConfirmRequest) => new Promise<string | null>((resolve) => {
    resolver.current = resolve;
    setReq(r);
    setLoading(true);
    Promise.all([
      api.get('/admin/campaigns/wa-senders').then((x) => x.data as Sender[]).catch(() => [] as Sender[]),
      api.get('/admin/campaigns/wa-sender-default', { params: { trigger: r.trigger, campaignId: r.campaignId } }).then((x) => String(x.data.sender)).catch(() => ''),
    ]).then(([list, def]) => {
      setSenders(list);
      setSender(list.some((s) => s.id === def) ? def : list.find((s) => s.status === 'connected')?.id ?? '');
    }).finally(() => setLoading(false));
  }), []);

  // Prompt link grup WA campaign (sebelum approve creator)
  const [linkFor, setLinkFor] = useState<string | null>(null);
  const [link, setLink] = useState('');
  const [linkError, setLinkError] = useState('');
  const [savingLink, setSavingLink] = useState(false);
  const linkResolver = useRef<((v: boolean) => void) | null>(null);
  const promptLink = useCallback((campaignId: string, currentLink?: string) => {
    if (currentLink?.trim()) return Promise.resolve(true);
    return new Promise<boolean>((resolve) => {
      linkResolver.current = resolve;
      setLink(''); setLinkError(''); setLinkFor(campaignId);
    });
  }, []);
  const closeLink = (v: boolean) => {
    linkResolver.current?.(v);
    linkResolver.current = null;
    setLinkFor(null);
  };
  const saveLink = async () => {
    if (!/^https:\/\/chat\.whatsapp\.com\/\S+$/.test(link.trim())) { setLinkError('Isi link undangan grup WhatsApp (https://chat.whatsapp.com/...)'); return; }
    setSavingLink(true);
    try {
      await api.patch(`/admin/campaigns/${linkFor}`, { waGroupLink: link.trim() });
      closeLink(true);
    } catch (err) {
      setLinkError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal menyimpan link.');
    } finally {
      setSavingLink(false);
    }
  };

  const close = (v: string | null) => {
    resolver.current?.(v);
    resolver.current = null;
    setReq(null);
  };
  const chosen = senders.find((s) => s.id === sender);

  return (
    <WaConfirmContext.Provider value={confirm}>
    <GroupLinkContext.Provider value={promptLink}>
      {children}
      {linkFor && (
        <div role="dialog" aria-modal="true" aria-label="Link grup WA campaign" onClick={() => closeLink(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(25,28,32,0.45)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '16px', width: 'min(460px, 100%)', padding: '20px', display: 'grid', gap: '12px' }}>
            <p style={{ fontFamily: font, fontWeight: 800, fontSize: '1rem', color: '#191c20' }}>Link grup WA campaign belum diisi</p>
            <p style={{ fontFamily: font, fontSize: '0.84rem', color: '#464652', lineHeight: 1.5 }}>
              Link ini dikirim ke creator di WA "lolos" supaya mereka langsung gabung grup campaign. Isi sekarang, atau lewati kalau grupnya belum dibuat.
            </p>
            <input autoFocus value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://chat.whatsapp.com/..." aria-label="Link grup WA campaign"
              onKeyDown={(e) => { if (e.key === 'Enter') void saveLink(); }}
              style={{ padding: '10px 12px', borderRadius: '12px', border: '1.5px solid #c7c8cf', fontSize: '0.85rem', fontFamily: font }} />
            {linkError && <p role="alert" style={{ fontFamily: font, fontSize: '0.78rem', color: '#ba1a1a' }}>{linkError}</p>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => closeLink(false)} style={{ padding: '9px 16px', borderRadius: '999px', border: '1.5px solid #c7c8cf', background: 'white', cursor: 'pointer', fontFamily: font, fontWeight: 700, fontSize: '0.8rem' }}>Batal</button>
              <button type="button" onClick={() => closeLink(true)} style={{ padding: '9px 16px', borderRadius: '999px', border: '1.5px solid #c9b6f7', background: 'white', color: '#6728e4', cursor: 'pointer', fontFamily: font, fontWeight: 700, fontSize: '0.8rem' }}>Lewati</button>
              <button type="button" onClick={() => void saveLink()} disabled={savingLink} className="btn-primary" style={{ padding: '9px 16px', fontSize: '0.8rem', opacity: savingLink ? 0.6 : 1 }}>
                {savingLink ? 'Menyimpan…' : 'Simpan & lanjut'}
              </button>
            </div>
          </div>
        </div>
      )}
      {req && (
        <div role="dialog" aria-modal="true" aria-label={req.title} onClick={() => close(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(25,28,32,0.45)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '16px', width: 'min(460px, 100%)', padding: '20px', display: 'grid', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <MessageCircle size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ flex: 1, fontFamily: font, fontWeight: 800, fontSize: '1rem', color: '#191c20' }}>{req.title}</p>
              <button type="button" onClick={() => close(null)} aria-label="Tutup" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5f6368', display: 'flex' }}><X size={18} /></button>
            </div>
            <p style={{ fontFamily: font, fontSize: '0.84rem', color: '#464652', lineHeight: 1.5 }}>{req.description}</p>
            <label style={{ display: 'grid', gap: '6px', fontFamily: font, fontSize: '0.8rem', fontWeight: 700, color: '#191c20' }}>
              Kirim pakai WA
              <select value={sender} onChange={(e) => setSender(e.target.value)} disabled={loading}
                style={{ padding: '10px 12px', borderRadius: '12px', border: '1.5px solid #c7c8cf', fontSize: '0.85rem', fontFamily: font, background: 'white' }}>
                {loading && <option value="">Memuat…</option>}
                {senders.map((s) => (
                  <option key={s.id} value={s.id} disabled={s.status !== 'connected'}>
                    {SENDER_LABELS[s.id] ?? s.id}: {s.status === 'connected' ? s.connectedNumber : 'belum terhubung'}
                  </option>
                ))}
              </select>
              <span style={{ fontWeight: 400, fontSize: '0.72rem', color: '#777683' }}>Default dari pengaturan pengirim campaign; ganti di sini untuk kiriman ini saja.</span>
            </label>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" onClick={() => close(null)} style={{ padding: '9px 18px', borderRadius: '999px', border: '1.5px solid #c7c8cf', background: 'white', cursor: 'pointer', fontFamily: font, fontWeight: 700, fontSize: '0.82rem' }}>Batal</button>
              <button type="button" onClick={() => close(sender)} disabled={loading || chosen?.status !== 'connected'} className="btn-primary"
                style={{ padding: '9px 18px', fontSize: '0.82rem', opacity: loading || chosen?.status !== 'connected' ? 0.5 : 1 }}>
                {req.confirmLabel ?? 'Kirim'}
              </button>
            </div>
          </div>
        </div>
      )}
    </GroupLinkContext.Provider>
    </WaConfirmContext.Provider>
  );
}
