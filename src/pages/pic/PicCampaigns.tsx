import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ExternalLink } from 'lucide-react';
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
  const [showLink, setShowLink] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [linking, setLinking] = useState(false);
  const [linkError, setLinkError] = useState('');

  const fetchCampaigns = async () => {
    const res = await picApi.get('/pic/campaigns');
    setCampaigns(res.data);
    setLoading(false);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void fetchCampaigns(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const linkCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinking(true);
    setLinkError('');
    try {
      await picApi.post('/pic/campaigns/link', { accessCode });
      setAccessCode('');
      setShowLink(false);
      await fetchCampaigns();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setLinkError(message || 'Failed to link campaign');
    } finally {
      setLinking(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#777683' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button onClick={() => setShowLink(!showLink)} className="btn-primary" style={{ padding: '9px 18px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={14} /> Link Campaign
        </button>
      </div>

      {showLink && (
        <div style={{ ...cardStyle, marginBottom: '16px' }}>
          <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px' }}>Link a new campaign</p>
          <form onSubmit={linkCampaign} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              placeholder="Campaign access code"
              required
              style={{ flex: '1 1 220px', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e1e0ff', fontFamily: f, fontSize: '0.85rem' }}
            />
            <button type="submit" disabled={linking} className="btn-primary" style={{ padding: '10px 18px', fontSize: '0.82rem', opacity: linking ? 0.6 : 1 }}>
              {linking ? 'Linking...' : 'Link'}
            </button>
          </form>
          {linkError && <p style={{ color: '#ba1a1a', fontSize: '0.8rem', marginTop: '10px', fontFamily: f }}>{linkError}</p>}
        </div>
      )}

      {campaigns.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', color: '#777683', padding: '48px', fontFamily: f, fontSize: '0.88rem' }}>
          No campaigns linked yet. Use the access code given by the admin to link your first campaign.
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
