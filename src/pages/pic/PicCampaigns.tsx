import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import picApi from '../../lib/picApi';

const f = "var(--font-display)";
const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)',
};

interface PicCampaign {
  _id: string; name: string; status: string; workflowStage: string; budget: number;
  brandId?: { namaBrand?: string };
}

export default function PicCampaigns() {
  const [campaigns, setCampaigns] = useState<PicCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    const res = await picApi.get('/pic/campaigns');
    setCampaigns(res.data);
    setLoading(false);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void fetchCampaigns(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#777683' }}>Loading...</div>;

  return (
    <div>
      {campaigns.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', color: '#777683', padding: '48px', fontFamily: f, fontSize: '0.88rem' }}>
          No campaigns assigned yet. Once the admin assigns you as PIC/Handle-by on a campaign, it will show up here automatically.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {campaigns.map((c) => (
            <Link
              key={c._id}
              to={`/pic/campaigns/${c._id}`}
              style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none' }}
            >
              <div>
                <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem', color: '#191c20' }}>{c.name}</p>
                <p style={{ fontFamily: f, fontSize: '0.8rem', color: '#777683', marginTop: '2px' }}>
                  {c.brandId?.namaBrand || '—'} · Rp{c.budget.toLocaleString('id-ID')}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: '#e1e0ff', color: '#6728e4', borderRadius: '999px', padding: '5px 14px', fontSize: '0.72rem', fontWeight: 700 }}>
                  {c.workflowStage.replace(/_/g, ' ')}
                </span>
                <ExternalLink size={16} color="#8a8a99" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
