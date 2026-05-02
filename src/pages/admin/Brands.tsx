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

  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '240px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8B87B0' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari brand atau PIC..."
              style={{
                width: '100%', padding: '10px 14px 10px 36px', borderRadius: '10px',
                border: '1.5px solid #E0DCFF', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.875rem' }}>
            Cari
          </button>
        </form>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #E0DCFF', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', background: 'white', cursor: 'pointer' }}
          >
            <option value="">Semua Status</option>
            {statusOptions.filter(Boolean).map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <button onClick={fetchBrands} style={{ padding: '10px', borderRadius: '10px', border: '1.5px solid #E0DCFF', background: 'white', cursor: 'pointer', color: '#8B87B0', display: 'flex' }}>
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
                {['Brand', 'PIC', 'WhatsApp', 'Kategori', 'Paket', 'Budget', 'Status', 'Tanggal', 'Aksi'].map((h) => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 700, color: '#1A1040', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '48px', color: '#8B87B0' }}>Memuat...</td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '48px', color: '#8B87B0' }}>Belum ada data brand.</td>
                </tr>
              ) : brands.map((b, i) => (
                <tr key={b._id} style={{ borderBottom: '1px solid #F0EEFF', background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1A1040', whiteSpace: 'nowrap' }}>{b.namaBrand}</td>
                  <td style={{ padding: '14px 16px', color: '#8B87B0', whiteSpace: 'nowrap' }}>{b.namaPIC}</td>
                  <td style={{ padding: '14px 16px', color: '#8B87B0', whiteSpace: 'nowrap' }}>{b.whatsapp}</td>
                  <td style={{ padding: '14px 16px', color: '#8B87B0', whiteSpace: 'nowrap' }}>{b.kategori}</td>
                  <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{ background: '#F0EEFF', color: '#6B2EE8', borderRadius: '999px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>
                      {b.paket}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#8B87B0', whiteSpace: 'nowrap' }}>{b.budget}</td>
                  <td style={{ padding: '14px 16px' }}><StatusBadge status={b.status} /></td>
                  <td style={{ padding: '14px 16px', color: '#8B87B0', whiteSpace: 'nowrap' }}>{formatDate(b.createdAt)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => navigate(`/admin/brands/${b._id}`)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px',
                        background: '#F0EEFF', color: '#6B2EE8', borderRadius: '8px', border: 'none',
                        cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                      }}
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '14px 16px', borderTop: '1px solid #F0EEFF', color: '#8B87B0', fontSize: '0.8rem' }}>
          {brands.length} hasil ditemukan
        </div>
      </div>
    </div>
  );
}
