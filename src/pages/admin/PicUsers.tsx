import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import api from '../../lib/api';
import SheetGrid from '../../components/SheetGrid';

interface PicCampaignRef { _id: string; name: string }
interface PicUserItem {
  _id: string; name: string; email: string; phone: string;
  city?: string; ownerName?: string; position?: string; backupPhone?: string; socialMedia?: string; portfolio?: string; ktpUrl?: string;
  campaignIds: PicCampaignRef[]; createdAt: string;
}

// Tabel ala Sheets (cari, filter & urut per kolom, bekukan, sembunyikan kolom). WhatsApp & link jadi klik-able otomatis.
const HEADERS = ['Management/Agency', 'Kota', 'PIC', 'Jabatan', 'WhatsApp', 'WA Back Up', 'Email', 'Sosial Media', 'Portfolio', 'KTP', 'Campaign', 'Tanggal Daftar'];
const KTP_COL = HEADERS.indexOf('KTP');

export default function PicUsers() {
  const [picUsers, setPicUsers] = useState<PicUserItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPicUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/pic');
      setPicUsers(res.data);
    } catch {
      setPicUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void fetchPicUsers(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const rows = picUsers.map((p) => [
    p.name, p.city || '', p.ownerName || '', p.position || '', p.phone, p.backupPhone || '', p.email,
    p.socialMedia || '', p.portfolio || '', p.ktpUrl || '',
    p.campaignIds.map((c) => c.name).join(', '),
    p.createdAt.slice(0, 10), // YYYY-MM-DD supaya urut tanggal benar
  ]);

  return (
    <div>
      <PicGroupLinkSetting />
      <SheetGrid
        storageKey="admin:pic-users"
        headers={HEADERS}
        rows={rows}
        emptyText={loading ? 'Memuat...' : 'Belum ada akun PIC yang sign up.'}
        hint={(
          <button onClick={() => void fetchPicUsers()} aria-label="Muat ulang" title="Muat ulang"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', border: '1.5px solid #c7c8cf', background: 'white', cursor: 'pointer', color: '#777683' }}>
            <RefreshCw size={16} />
          </button>
        )}
        customCell={(_r, c, v) => (c === KTP_COL && v
          ? <a href={String(v)} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: '#6728e4', fontWeight: 600 }}>Lihat KTP</a>
          : undefined)}
        footer={` · ${picUsers.length} akun PIC/Handle-by`}
      />
    </div>
  );
}

/** Link grup WA PIC: tampil di portal PIC (PIC baru langsung bisa minta gabung, admin approve di WhatsApp) */
function PicGroupLinkSetting() {
  const [link, setLink] = useState('');
  const [saved, setSaved] = useState('');
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  useEffect(() => {
    api.get('/admin/pic/settings').then((r) => { setLink(r.data.picGroupLink); setSaved(r.data.picGroupLink); }).catch(() => undefined);
  }, []);
  const save = async () => {
    setStatus(null);
    try {
      const r = await api.put('/admin/pic/settings', { picGroupLink: link });
      setSaved(r.data.picGroupLink);
      setStatus({ ok: true, text: 'Tersimpan.' });
    } catch (err) {
      setStatus({ ok: false, text: (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal menyimpan.' });
    }
  };
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e1e0ff', background: 'white' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: 700, color: '#191c20' }}>Link grup WA PIC</span>
      <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://chat.whatsapp.com/..." aria-label="Link grup WA PIC"
        style={{ flex: '1 1 260px', padding: '8px 12px', borderRadius: '10px', border: '1.5px solid #e1e0ff', fontSize: '0.84rem', fontFamily: 'var(--font-display)' }} />
      <button type="button" onClick={() => void save()} disabled={link === saved} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', opacity: link === saved ? 0.5 : 1 }}>Simpan</button>
      <span style={{ flexBasis: '100%', fontSize: '0.72rem', color: status ? (status.ok ? '#065F46' : '#ba1a1a') : '#777683', fontFamily: 'var(--font-display)' }}>
        {status?.text ?? 'Tampil di portal PIC. Atur grupnya "Setujui anggota baru" di WhatsApp supaya tiap permintaan gabung di-review admin.'}
      </span>
    </div>
  );
}
