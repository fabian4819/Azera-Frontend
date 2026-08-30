import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, RefreshCw, Plus } from 'lucide-react';
import api from '../../lib/api';

interface Campaign {
  _id: string;
  name: string;
  brandId: { _id: string; namaBrand: string } | string;
  budget: number;
  status: string;
  workflowStage: string;
  applyOpen: boolean;
  createdAt: string;
}

const statusOptions = ['', 'draft', 'active', 'completed', 'cancelled'];

const statusColors: Record<string, { bg: string; color: string }> = {
  draft: { bg: '#eceef3', color: '#464652' },
  active: { bg: '#d1fae5', color: '#065F46' },
  completed: { bg: '#e1e0ff', color: '#15157d' },
  cancelled: { bg: '#ffdad6', color: '#ba1a1a' },
};

const thStyle: React.CSSProperties = {
  padding: '14px 16px', textAlign: 'left', fontFamily: "var(--font-display)",
  fontWeight: 700, color: '#191c20', fontSize: '0.78rem', whiteSpace: 'nowrap', letterSpacing: '0.04em',
};

const tdStyle: React.CSSProperties = {
  padding: '14px 16px', fontSize: '0.875rem', color: '#464652', whiteSpace: 'nowrap',
  fontFamily: "var(--font-display)",
};

const controlStyle: React.CSSProperties = {
  padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #c7c8cf', fontSize: '0.875rem',
  outline: 'none', fontFamily: "var(--font-display)", background: 'white', cursor: 'pointer', color: '#191c20',
};

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/admin/campaigns', { params });
      setCampaigns(res.data);
    } catch {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchCampaigns();
    }, 0);

    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  const formatBudget = (n: number) => `Rp${n.toLocaleString('id-ID')}`;

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={controlStyle}>
            <option value="">Semua Status</option>
            {statusOptions.filter(Boolean).map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <button onClick={fetchCampaigns} style={{ ...controlStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', color: '#777683' }}>
            <RefreshCw size={16} />
          </button>
        </div>
        <button onClick={() => navigate('/admin/campaigns/new')} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.875rem' }}>
          <Plus size={16} />
          Campaign Baru
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e1e0ff', overflow: 'hidden', boxShadow: '0 2px 12px rgba(107,46,232,0.06)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8f9ff', borderBottom: '1px solid #e1e0ff' }}>
                {['Campaign', 'Brand', 'Budget', 'Tahap', 'Status', 'Apply', 'Tanggal', 'Aksi'].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ ...tdStyle, textAlign: 'center', padding: '48px' }}>Memuat...</td></tr>
              ) : campaigns.length === 0 ? (
                <tr><td colSpan={8} style={{ ...tdStyle, textAlign: 'center', padding: '48px' }}>Belum ada campaign. Buat campaign pertama kamu.</td></tr>
              ) : (
                campaigns.map((c, i) => {
                  const sc = statusColors[c.status] || statusColors.draft;
                  return (
                    <tr key={c._id} style={{ borderBottom: '1px solid #e1e0ff', background: i % 2 === 0 ? 'white' : '#fcfcff' }}>
                      <td style={{ ...tdStyle, fontWeight: 600, color: '#191c20' }}>{c.name}</td>
                      <td style={tdStyle}>{typeof c.brandId === 'object' ? c.brandId.namaBrand : '—'}</td>
                      <td style={tdStyle}>{formatBudget(c.budget)}</td>
                      <td style={tdStyle}>
                        <span style={{ background: '#e1e0ff', color: '#6728e4', borderRadius: '999px', padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
                          {c.workflowStage.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ background: sc.bg, color: sc.color, borderRadius: '999px', padding: '4px 12px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'capitalize' }}>
                          {c.status}
                        </span>
                      </td>
                      <td style={tdStyle}>{c.applyOpen ? '🟢 Buka' : '⚪️ Tutup'}</td>
                      <td style={tdStyle}>{formatDate(c.createdAt)}</td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => navigate(`/admin/campaigns/${c._id}`)}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: '#e1e0ff', color: '#6728e4', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid #e1e0ff', color: '#777683', fontSize: '0.78rem' }}>
          {campaigns.length} campaign
        </div>
      </div>
    </div>
  );
}
