import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, RefreshCw } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import { erRating } from '../../utils/engagement';
import api from '../../lib/api';

interface KOLItem {
  _id: string;
  namaLengkap: string;
  whatsapp: string;
  kota: string;
  niche: string[];
  socialMedia: {
    instagram?: { username: string; followers: number };
    tiktok?: { username: string; followers: number };
    youtube?: { channel: string; subscribers: number };
  };
  engagementRate?: number;
  status: string;
  createdAt: string;
}

const statusOptions = ['', 'pending', 'reviewing', 'approved', 'rejected'];
const platformOptions = ['', 'instagram', 'tiktok', 'youtube'];

export default function KOLs() {
  const [kols, setKols] = useState<KOLItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const navigate = useNavigate();

  const fetchKOLs = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      if (platformFilter) params.platform = platformFilter;
      if (search) params.search = search;
      const res = await api.get('/admin/kols', { params });
      setKols(res.data);
    } catch {
      setKols([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKOLs();
  }, [statusFilter, platformFilter]);

  const getPlatforms = (sm: KOLItem['socialMedia']) => {
    const p = [];
    if (sm?.instagram) p.push('IG');
    if (sm?.tiktok) p.push('TK');
    if (sm?.youtube) p.push('YT');
    return p;
  };

  const getMaxFollowers = (sm: KOLItem['socialMedia']) => {
    const vals = [
      sm?.instagram?.followers || 0,
      sm?.tiktok?.followers || 0,
      sm?.youtube?.subscribers || 0,
    ];
    const max = Math.max(...vals);
    if (max >= 1000000) return (max / 1000000).toFixed(1) + 'M';
    if (max >= 1000) return (max / 1000).toFixed(1) + 'K';
    return max.toString();
  };

  const platformColors: Record<string, string> = { IG: '#E8197A', TK: '#065F46', YT: '#C2410C' };
  const platformBg: Record<string, string> = { IG: '#FFF0F7', TK: '#F0FDF4', YT: '#FFF7ED' };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <form onSubmit={(e) => { e.preventDefault(); fetchKOLs(); }} style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '240px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8B87B0' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama KOL..."
              style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: '10px', border: '1.5px solid #E0DCFF', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit' }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.875rem' }}>Cari</button>
        </form>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E0DCFF', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', background: 'white', cursor: 'pointer' }}>
            <option value="">Semua Status</option>
            {statusOptions.filter(Boolean).map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E0DCFF', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', background: 'white', cursor: 'pointer' }}>
            <option value="">Semua Platform</option>
            {platformOptions.filter(Boolean).map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </select>
          <button onClick={fetchKOLs} style={{ padding: '10px', borderRadius: '10px', border: '1.5px solid #E0DCFF', background: 'white', cursor: 'pointer', color: '#8B87B0', display: 'flex' }}>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #F0EEFF', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#F8F7FF', borderBottom: '1px solid #F0EEFF' }}>
                {['Nama', 'WA', 'Kota', 'Platform', 'Followers', 'ER%', 'Rating', 'Status', 'Tanggal', 'Aksi'].map((h) => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#1A1040', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} style={{ textAlign: 'center', padding: '48px', color: '#8B87B0' }}>Memuat...</td></tr>
              ) : kols.length === 0 ? (
                <tr><td colSpan={10} style={{ textAlign: 'center', padding: '48px', color: '#8B87B0' }}>Belum ada data KOL.</td></tr>
              ) : kols.map((k, i) => {
                const er = k.engagementRate || 0;
                const rating = erRating(er);
                const platforms = getPlatforms(k.socialMedia || {});
                return (
                  <tr key={k._id} style={{ borderBottom: '1px solid #F0EEFF', background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1A1040', whiteSpace: 'nowrap' }}>{k.namaLengkap}</td>
                    <td style={{ padding: '14px 16px', color: '#8B87B0', whiteSpace: 'nowrap' }}>{k.whatsapp}</td>
                    <td style={{ padding: '14px 16px', color: '#8B87B0', whiteSpace: 'nowrap' }}>{k.kota}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {platforms.map((p) => (
                          <span key={p} style={{ background: platformBg[p], color: platformColors[p], borderRadius: '4px', padding: '2px 6px', fontSize: '0.7rem', fontWeight: 700 }}>{p}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#8B87B0', whiteSpace: 'nowrap' }}>{getMaxFollowers(k.socialMedia || {})}</td>
                    <td style={{ padding: '14px 16px', color: '#1A1040', fontWeight: 600 }}>{er > 0 ? `${er}%` : '—'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {er > 0 && <span style={{ color: rating.color, fontWeight: 700, fontSize: '0.8rem' }}>{rating.label}</span>}
                    </td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge status={k.status} /></td>
                    <td style={{ padding: '14px 16px', color: '#8B87B0', whiteSpace: 'nowrap' }}>{formatDate(k.createdAt)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => navigate(`/admin/kols/${k._id}`)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: '#F0EEFF', color: '#6B2EE8', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                      >
                        <Eye size={14} />View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '14px 16px', borderTop: '1px solid #F0EEFF', color: '#8B87B0', fontSize: '0.8rem' }}>
          {kols.length} KOL ditemukan
        </div>
      </div>
    </div>
  );
}
