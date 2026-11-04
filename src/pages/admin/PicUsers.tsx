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
