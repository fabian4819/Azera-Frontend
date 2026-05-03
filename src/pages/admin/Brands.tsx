import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, RefreshCw } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import api from '../../lib/api';

interface Brand {
  _id: string;
  namaBrand: string;
  namaPIC: string;
  whatsapp: string;
  kategori: string;
  paket: string;
  budget: string;
  status: string;
  createdAt: string;
}

const statusOptions = ['', 'new', 'reviewed', 'contacted'];

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

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const res = await api.get('/admin/brands', { params });
      setBrands(res.data);
    } catch {
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBrands();
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      {/* Filter bar */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '240px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8B87A8' }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari brand atau PIC..."
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
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={fetchBrands}
            style={{
              ...controlStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              color: '#8B87A8',
            }}
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
                {['Brand', 'PIC', 'WhatsApp', 'Kategori', 'Paket', 'Budget', 'Status', 'Tanggal', 'Aksi'].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ ...tdStyle, textAlign: 'center', padding: '48px' }}>
                    Memuat...
                  </td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ ...tdStyle, textAlign: 'center', padding: '48px' }}>
                    Belum ada data brand.
                  </td>
                </tr>
              ) : (
                brands.map((b, i) => (
                  <tr
                    key={b._id}
                    style={{
                      borderBottom: '1px solid #F0EEFF',
                      background: i % 2 === 0 ? 'white' : '#FDFCFF',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#F8F6FF')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? 'white' : '#FDFCFF')}
                  >
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#120E28' }}>{b.namaBrand}</td>
                    <td style={tdStyle}>{b.namaPIC}</td>
                    <td style={tdStyle}>{b.whatsapp}</td>
                    <td style={tdStyle}>{b.kategori}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          background: '#F0EEFF',
                          color: '#6B2EE8',
                          borderRadius: '999px',
                          padding: '3px 10px',
                          fontSize: '0.72rem',
                          fontFamily: 'Syne, sans-serif',
                          fontWeight: 700,
                          textTransform: 'capitalize',
                        }}
                      >
                        {b.paket}
                      </span>
                    </td>
                    <td style={tdStyle}>{b.budget}</td>
                    <td style={tdStyle}><StatusBadge status={b.status} /></td>
                    <td style={tdStyle}>{formatDate(b.createdAt)}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => navigate(`/admin/brands/${b._id}`)}
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
                        <Eye size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #F0EEFF',
            color: '#8B87A8',
            fontSize: '0.78rem',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}
        >
          {brands.length} hasil ditemukan
        </div>
      </div>
    </div>
  );
}
