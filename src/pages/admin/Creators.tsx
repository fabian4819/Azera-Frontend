import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, RefreshCw } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import api from '../../lib/api';

interface CreatorItem {
  _id: string;
  name: string;
  phone: string;
  domicile?: { province?: string; city?: string };
  niches: string[];
  socials: { platform: string; followers: number }[];
  performanceScore: { overall: number };
  complianceStatus: string;
  status: string;
  createdAt: string;
}

const statusOptions = ['', 'pending', 'reviewing', 'approved', 'rejected'];
const complianceLabels: Record<string, { label: string; color: string; bg: string }> = {
  ok: { label: 'OK', color: '#065F46', bg: '#d1fae5' },
  sp1: { label: 'SP1', color: '#92400E', bg: '#fef3c7' },
  sp2_blacklist: { label: 'Blacklist', color: '#ba1a1a', bg: '#ffdad6' },
};

const thStyle: React.CSSProperties = {
  padding: '14px 16px', textAlign: 'left', fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontWeight: 700, color: '#191c20', fontSize: '0.78rem', whiteSpace: 'nowrap', letterSpacing: '0.04em',
};
const tdStyle: React.CSSProperties = {
  padding: '14px 16px', fontSize: '0.875rem', color: '#464652', whiteSpace: 'nowrap', fontFamily: 'Plus Jakarta Sans, sans-serif',
};
const controlStyle: React.CSSProperties = {
  padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #c7c8cf', fontSize: '0.875rem',
  outline: 'none', fontFamily: 'Plus Jakarta Sans, sans-serif', background: 'white', cursor: 'pointer', color: '#191c20',
};

export default function Creators() {
  const [creators, setCreators] = useState<CreatorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  const fetchCreators = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/admin/creators', { params });
      setCreators(res.data);
    } catch {
      setCreators([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchCreators();
    }, 0);
    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const filtered = search ? creators.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)) : creators;

  const maxFollowers = (socials: CreatorItem['socials']) => {
    const max = Math.max(0, ...socials.map((s) => s.followers));
    if (max >= 1000000) return (max / 1000000).toFixed(1) + 'M';
    if (max >= 1000) return (max / 1000).toFixed(1) + 'K';
    return max.toString();
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#777683' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau nomor WA..." style={{ ...controlStyle, width: '100%', paddingLeft: '36px' }} />
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={controlStyle}>
            <option value="">Semua Status</option>
            {statusOptions.filter(Boolean).map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <button onClick={fetchCreators} style={{ ...controlStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', color: '#777683' }}>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e1e0ff', overflow: 'hidden', boxShadow: '0 2px 12px rgba(107,46,232,0.06)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8f9ff', borderBottom: '1px solid #e1e0ff' }}>
                {['Nama', 'WA', 'Domisili', 'Niche', 'Followers', 'Skor', 'Compliance', 'Status', 'Tanggal', 'Aksi'].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} style={{ ...tdStyle, textAlign: 'center', padding: '48px' }}>Memuat...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={10} style={{ ...tdStyle, textAlign: 'center', padding: '48px' }}>Belum ada creator.</td></tr>
              ) : filtered.map((c, i) => {
                const comp = complianceLabels[c.complianceStatus] || complianceLabels.ok;
                return (
                  <tr
                    key={c._id}
                    style={{ borderBottom: '1px solid #e1e0ff', background: i % 2 === 0 ? 'white' : '#fcfcff' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#F8F6FF')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? 'white' : '#fcfcff')}
                  >
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#191c20' }}>{c.name}</td>
                    <td style={tdStyle}>{c.phone}</td>
                    <td style={tdStyle}>{c.domicile?.city || c.domicile?.province || '—'}</td>
                    <td style={tdStyle}>{c.niches?.slice(0, 2).join(', ') || '—'}</td>
                    <td style={tdStyle}>{maxFollowers(c.socials || [])}</td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: '#6728e4' }}>{c.performanceScore?.overall ?? 0}</td>
                    <td style={tdStyle}>
                      <span style={{ background: comp.bg, color: comp.color, borderRadius: '999px', padding: '3px 10px', fontSize: '0.7rem', fontWeight: 700 }}>{comp.label}</span>
                    </td>
                    <td style={tdStyle}><StatusBadge status={c.status} /></td>
                    <td style={tdStyle}>{formatDate(c.createdAt)}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => navigate(`/admin/creators/${c._id}`)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: '#e1e0ff', color: '#6728e4', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
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
        <div style={{ padding: '12px 16px', borderTop: '1px solid #e1e0ff', color: '#777683', fontSize: '0.78rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          {filtered.length} creator ditemukan
        </div>
      </div>
    </div>
  );
}
