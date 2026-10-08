import { stageLabel } from '../../lib/stages';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { SHEET_TABS } from './sheetTabs';
import api from '../../lib/api';

const f = 'var(--font-display)';

interface CampaignDashboardItem {
  _id: string;
  name: string;
  status: string;
  workflowStage: string;
  budget: number;
  brandId?: { namaBrand?: string } | string;
}

const sheetButtonStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px',
  padding: '10px 6px', borderRadius: '10px', border: '1.5px solid #e1e0ff',
  background: '#faf9ff', color: '#6728e4', textDecoration: 'none',
  fontFamily: f, fontSize: '0.74rem', fontWeight: 700, textAlign: 'center',
};

export default function CampaignDashboard() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<CampaignDashboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCampaigns = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/campaigns/dashboard-links');
      setCampaigns(response.data);
    } catch {
      setError('Dashboard campaign gagal dimuat. Coba muat ulang.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void fetchCampaigns(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '22px' }}>
        <div>
          <h2 style={{ fontFamily: f, fontWeight: 800, fontSize: '1.35rem', color: '#191c20' }}>Semua Campaign</h2>
          <p style={{ marginTop: '4px', color: '#777683', fontSize: '0.82rem' }}>
            Pilih campaign, lalu buka Master Sheet, Report, atau Recap Payment langsung di sini.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void fetchCampaigns()}
          aria-label="Muat ulang dashboard campaign"
          style={{ width: '38px', height: '38px', borderRadius: '10px', border: '1.5px solid #c7c8cf', background: 'white', color: '#6728e4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '70px', color: '#777683' }}>Memuat campaign...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#ba1a1a', background: 'white', borderRadius: '16px', border: '1px solid #ffdad6' }}>{error}</div>
      ) : campaigns.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#777683', background: 'white', borderRadius: '16px', border: '1px solid #e1e0ff' }}>Belum ada campaign.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '14px' }}>
          {campaigns.map((campaign) => {
            const brandName = typeof campaign.brandId === 'object' ? campaign.brandId?.namaBrand : undefined;
            return (
              // Klik di mana saja pada card = buka detail campaign (judul tetap <Link> untuk keyboard/tab baru)
              <article key={campaign._id} onClick={() => navigate(`/admin/campaigns/${campaign._id}`)} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e1e0ff', boxShadow: '0 2px 12px rgba(107,46,232,0.05)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ minWidth: 0 }}>
                    <Link to={`/admin/campaigns/${campaign._id}`} onClick={(e) => e.stopPropagation()} style={{ fontFamily: f, fontWeight: 750, fontSize: '0.98rem', color: '#191c20', textDecoration: 'none' }}>
                      {campaign.name}
                    </Link>
                    <p style={{ fontFamily: f, fontSize: '0.78rem', color: '#777683', marginTop: '4px' }}>
                      {brandName || 'Tanpa brand'} · Rp{campaign.budget.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <span style={{ flexShrink: 0, background: '#e1e0ff', color: '#6728e4', borderRadius: '999px', padding: '5px 10px', fontSize: '0.68rem', fontWeight: 700 }}>
                    {stageLabel(campaign.workflowStage)}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '18px' }}>
                  {SHEET_TABS.map(({ kind, label, icon: Icon }) => (
                    <Link key={kind} to={`/admin/campaigns/${campaign._id}/sheet?tab=${kind}`} onClick={(e) => e.stopPropagation()} style={sheetButtonStyle}>
                      <Icon size={17} /> {label}
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
