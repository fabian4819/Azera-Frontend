import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, RefreshCw } from 'lucide-react';
import api from '../../lib/api';

const f = 'var(--font-display)';

interface CampaignDashboardItem {
  _id: string;
  name: string;
  status: string;
  workflowStage: string;
  budget: number;
  brandId?: { namaBrand?: string } | string;
  masterSheetUrl?: string | null;
  reportSheetUrl?: string | null;
  recapPaymentSheetUrl?: string | null;
}

const sheetButtonStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
  padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #e1e0ff',
  background: 'white', color: '#6728e4', textDecoration: 'none',
  fontFamily: f, fontSize: '0.76rem', fontWeight: 700,
};

export default function CampaignDashboard() {
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
            Dashboard operasional admin dengan akses langsung ke master, report, dan recap payment.
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
            const sheets = [
              { label: 'Master Sheet', url: campaign.masterSheetUrl },
              { label: 'Report Sheet', url: campaign.reportSheetUrl },
              { label: 'Recap Payment', url: campaign.recapPaymentSheetUrl },
            ];
            return (
              <article key={campaign._id} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e1e0ff', boxShadow: '0 2px 12px rgba(107,46,232,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ minWidth: 0 }}>
                    <Link to={`/admin/campaigns/${campaign._id}`} style={{ fontFamily: f, fontWeight: 750, fontSize: '0.98rem', color: '#191c20', textDecoration: 'none' }}>
                      {campaign.name}
                    </Link>
                    <p style={{ fontFamily: f, fontSize: '0.78rem', color: '#777683', marginTop: '4px' }}>
                      {brandName || 'Tanpa brand'} · Rp{campaign.budget.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <span style={{ flexShrink: 0, background: '#e1e0ff', color: '#6728e4', borderRadius: '999px', padding: '5px 10px', fontSize: '0.68rem', fontWeight: 700 }}>
                    {campaign.workflowStage.replace(/_/g, ' ')}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '7px', marginTop: '18px' }}>
                  {sheets.map((sheet) => sheet.url ? (
                    <a key={sheet.label} href={sheet.url} target="_blank" rel="noopener noreferrer" style={sheetButtonStyle}>
                      <ExternalLink size={13} /> {sheet.label}
                    </a>
                  ) : (
                    <span key={sheet.label} style={{ ...sheetButtonStyle, color: '#8a8a99', background: '#f8f9ff' }}>
                      {sheet.label} belum tersedia
                    </span>
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
