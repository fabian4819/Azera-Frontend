import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import talentApi from '../../lib/talentApi';

interface CampaignItem {
  applicationId: string;
  campaign: { _id: string; name: string; workflowStage: string; budget: number };
}

const f = "var(--font-display)";

export default function TalentCampaigns() {
  const [items, setItems] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    talentApi.get('/creator/campaigns')
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {loading ? (
        <p style={{ color: '#777683', fontFamily: f, textAlign: 'center', padding: '40px' }}>Memuat...</p>
      ) : items.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
          <p style={{ color: '#777683', fontFamily: f, fontSize: '0.9rem' }}>Belum ada campaign yang kamu ikuti.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map((item) => (
            <button
              key={item.applicationId}
              onClick={() => navigate(`/talent/campaigns/${item.campaign._id}`)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', borderRadius: '16px', padding: '18px 20px', border: '1px solid #e1e0ff', cursor: 'pointer', textAlign: 'left', width: '100%' }}
            >
              <div>
                <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem', color: '#191c20', marginBottom: '4px' }}>{item.campaign.name}</p>
                <span style={{ background: '#e1e0ff', color: '#6728e4', borderRadius: '999px', padding: '3px 10px', fontSize: '0.7rem', fontWeight: 700 }}>
                  {item.campaign.workflowStage.replace(/_/g, ' ')}
                </span>
              </div>
              <ChevronRight size={18} color="#777683" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
