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

const thStyle: React.CSSProperties = {
  padding: '14px 16px',
  textAlign: 'left',
  fontFamily: 'Syne, sans-serif',
  fontWeight: 700,
  color: '#120E28',
  fontSize: '0.78rem',
  whiteSpace: 'nowrap',
  letterSpacing: '0.04em',
};

const tdStyle: React.CSSProperties = {
  padding: '14px 16px',
  fontSize: '0.875rem',
  color: '#5B5780',
  whiteSpace: 'nowrap',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
};

const controlStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1.5px solid #E0DCFF',
  fontSize: '0.875rem',
  outline: 'none',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  background: 'white',
  cursor: 'pointer',
  color: '#120E28',
};

const platformColors: Record<string, string> = { IG: '#E8197A', TK: '#065F46', YT: '#C2410C' };
const platformBg: Record<string, string> = { IG: '#FFF0F7', TK: '#F0FDF4', YT: '#FFF7ED' };

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
    const vals = [sm?.instagram?.followers || 0, sm?.tiktok?.followers || 0, sm?.youtube?.subscribers || 0];
    const max = Math.max(...vals);
    if (max >= 1000000) return (max / 1000000).toFixed(1) + 'M';
    if (max >= 1000) return (max / 1000).toFixed(1) + 'K';
    return max.toString();
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <form
          onSubmit={(e) => { e.preventDefault(); fetchKOLs(); }}
          style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '240px' }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8B87A8' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama KOL..."
              style={{ ...controlStyle, width: '100%', paddingLeft: '36px' }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.875rem' }}>
            Cari
          </button>
        </form>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={controlStyle}>
            <option value="">Semua Status</option>
            {statusOptions.filter(Boolean).map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)} style={controlStyle}>
            <option value="">Semua Platform</option>
            {platformOptions.filter(Boolean).map((p) => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
          <button
            onClick={fetchKOLs}
            style={{ ...controlStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', color: '#8B87A8' }}
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #F0EEFF', overflow: 'hidden', boxShadow: '0 2px 12px rgba(107,46,232,0.06)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#F8F7FF', borderBottom: '1px solid #F0EEFF' }}>
                {['Nama', 'WA', 'Kota', 'Platform', 'Followers', 'ER%', 'Rating', 'Status', 'Tanggal', 'Aksi'].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} style={{ ...tdStyle, textAlign: 'center', padding: '48px' }}>Memuat...</td></tr>
              ) : kols.length === 0 ? (
                <tr><td colSpan={10} style={{ ...tdStyle, textAlign: 'center', padding: '48px' }}>Belum ada data KOL.</td></tr>
              ) : kols.map((k, i) => {
                const er = k.engagementRate || 0;
                const rating = erRating(er);
                const platforms = getPlatforms(k.socialMedia || {});
                return (
                  <tr
                    key={k._id}
                    style={{ borderBottom: '1px solid #F0EEFF', background: i % 2 === 0 ? 'white' : '#FDFCFF', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#F8F6FF')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? 'white' : '#FDFCFF')}
                  >
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#120E28' }}>{k.namaLengkap}</td>
                    <td style={tdStyle}>{k.whatsapp}</td>
                    <td style={tdStyle}>{k.kota}</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {platforms.map((p) => (
                          <span
                            key={p}
                            style={{
                              background: platformBg[p],
                              color: platformColors[p],
                              borderRadius: '4px',
                              padding: '2px 7px',
                              fontSize: '0.68rem',
                              fontFamily: 'Syne, sans-serif',
                              fontWeight: 700,
                            }}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={tdStyle}>{getMaxFollowers(k.socialMedia || {})}</td>
                    <td style={{ ...tdStyle, color: '#120E28', fontWeight: 600 }}>{er > 0 ? `${er}%` : '—'}</td>
                    <td style={tdStyle}>
                      {er > 0 && (
                        <span style={{ color: rating.color, fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.78rem' }}>
                          {rating.label}
                        </span>
                      )}
                    </td>
                    <td style={tdStyle}><StatusBadge status={k.status} /></td>
                    <td style={tdStyle}>{formatDate(k.createdAt)}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => navigate(`/admin/kols/${k._id}`)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 14px',
                          background: '#F0EEFF',
                          color: '#6B2EE8',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.78rem',
                          fontFamily: 'Syne, sans-serif',
                          fontWeight: 700,
                        }}
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
        <div style={{ padding: '12px 16px', borderTop: '1px solid #F0EEFF', color: '#8B87A8', fontSize: '0.78rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          {kols.length} KOL ditemukan
        </div>
      </div>
    </div>
  );
}
