import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Copy, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import api from '../../lib/api';
import CampaignAnalyticsFinance from './CampaignAnalyticsFinance';

interface Social { platform: string; username: string; followers: number }
interface Creator {
  _id: string; name: string; phone: string; gender: string;
  domicile: { province: string; city: string }; socials: Social[]; niches: string[];
  performanceScore: { overall: number };
}
interface Application {
  _id: string; creatorId: Creator; curationResult: string; curationReason?: string; status: string;
}
interface Campaign {
  _id: string; name: string; objective: string; briefContent?: string; deliverables: string[];
  budget: number; criteria: { niches: string[]; minFollowers?: number; provinces: string[]; platforms: string[] };
  status: string; workflowStage: string; applyOpen: boolean; applySlug: string;
}

const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)', marginBottom: '20px',
};

const labelSmall: React.CSSProperties = {
  fontSize: '0.7rem', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#777683',
  marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em',
};

const curationColors: Record<string, { bg: string; color: string; label: string }> = {
  highly_recommended: { bg: '#d1fae5', color: '#065F46', label: 'Highly Recommended' },
  recommended: { bg: '#dbeafe', color: '#1E40AF', label: 'Recommended' },
  need_review: { bg: '#fef3c7', color: '#92400E', label: 'Need Review' },
  rejected: { bg: '#ffdad6', color: '#ba1a1a', label: 'Rejected' },
};

const statusColors: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#eceef3', color: '#464652' },
  accepted: { bg: '#d1fae5', color: '#065F46' },
  rejected: { bg: '#ffdad6', color: '#ba1a1a' },
};

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [briefDraft, setBriefDraft] = useState('');
  const [generating, setGenerating] = useState(false);
  const [briefError, setBriefError] = useState('');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [decidingId, setDecidingId] = useState<string | null>(null);
  const [lastPassword, setLastPassword] = useState<{ name: string; password: string } | null>(null);

  const load = async () => {
    try {
      const [cRes, aRes] = await Promise.all([
        api.get(`/admin/campaigns/${id}`),
        api.get(`/admin/applications/campaign/${id}`),
      ]);
      setCampaign(cRes.data);
      setBriefDraft(cRes.data.briefContent || '');
      setApplications(aRes.data);
    } catch {
      navigate('/admin/campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const generateBrief = async () => {
    setGenerating(true);
    setBriefError('');
    try {
      const res = await api.post(`/admin/campaigns/${id}/generate-brief`);
      setCampaign(res.data);
      setBriefDraft(res.data.briefContent || '');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setBriefError(message || 'Gagal generate brief. Coba lagi.');
    } finally {
      setGenerating(false);
    }
  };

  const saveBrief = async () => {
    setSaving(true);
    try {
      const res = await api.patch(`/admin/campaigns/${id}`, { briefContent: briefDraft });
      setCampaign(res.data);
    } catch {
      alert('Gagal menyimpan brief.');
    } finally {
      setSaving(false);
    }
  };

  const toggleApplyOpen = async () => {
    if (!campaign) return;
    const res = await api.patch(`/admin/campaigns/${id}`, { applyOpen: !campaign.applyOpen });
    setCampaign(res.data);
  };

  const decide = async (appId: string, status: 'accepted' | 'rejected', creatorName: string) => {
    setDecidingId(appId);
    try {
      const res = await api.patch(`/admin/applications/${appId}`, { status });
      setApplications((prev) => prev.map((a) => (a._id === appId ? res.data.application : a)));
      if (res.data.generatedPassword) {
        setLastPassword({ name: creatorName, password: res.data.generatedPassword });
      }
    } catch {
      alert('Gagal menyimpan keputusan.');
    } finally {
      setDecidingId(null);
    }
  };

  const copyApplyLink = () => {
    const url = `${window.location.origin}/apply/${campaign?.applySlug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#777683' }}>Memuat...</div>;
  if (!campaign) return null;

  return (
    <div>
      <button
        onClick={() => navigate('/admin/campaigns')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#777683', fontSize: '0.875rem', marginBottom: '24px', padding: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <ArrowLeft size={16} />
        Kembali ke Campaigns
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }} className="detail-grid">
        <div>
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ width: '40px', height: '3px', background: 'linear-gradient(135deg, #6728e4, #ff81aa)', borderRadius: '2px', marginBottom: '12px' }} />
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: '#191c20' }}>{campaign.name}</h2>
              </div>
              <span style={{ background: '#e1e0ff', color: '#6728e4', borderRadius: '999px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700 }}>
                {campaign.workflowStage.replace(/_/g, ' ')}
              </span>
            </div>
            <p style={labelSmall}>Tujuan</p>
            <p style={{ color: '#191c20', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.6 }}>{campaign.objective}</p>
            <p style={labelSmall}>Budget</p>
            <p style={{ color: '#191c20', fontSize: '0.9rem' }}>Rp{campaign.budget.toLocaleString('id-ID')}</p>
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#191c20' }}>Brief Campaign</p>
              <button onClick={generateBrief} disabled={generating} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', opacity: generating ? 0.7 : 1 }}>
                <Sparkles size={14} />
                {generating ? 'Generating...' : 'Generate dengan AI'}
              </button>
            </div>
            {briefError && (
              <p style={{ color: '#ba1a1a', fontSize: '0.82rem', marginBottom: '12px', background: '#ffdad6', padding: '10px 14px', borderRadius: '10px' }}>
                {briefError}
              </p>
            )}
            <textarea
              value={briefDraft}
              onChange={(e) => setBriefDraft(e.target.value)}
              rows={8}
              placeholder="Brief belum dibuat — klik Generate dengan AI, atau tulis manual di sini."
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #c7c8cf', fontSize: '0.875rem', color: '#191c20', fontFamily: "'Plus Jakarta Sans', sans-serif", resize: 'vertical', outline: 'none', marginBottom: '12px' }}
            />
            <button onClick={saveBrief} disabled={saving} style={{ padding: '9px 18px', borderRadius: '10px', border: '1.5px solid #6728e4', background: 'white', color: '#6728e4', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {saving ? 'Menyimpan...' : 'Simpan Brief'}
            </button>
          </div>

          <div style={cardStyle}>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '16px' }}>
              Pendaftar ({applications.length})
            </p>
            {lastPassword && (
              <div style={{ background: '#d1fae5', borderRadius: '12px', padding: '14px 16px', marginBottom: '16px' }}>
                <p style={{ fontSize: '0.82rem', color: '#065F46', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <strong>{lastPassword.name}</strong> diterima — password Talent Portal: <code style={{ background: 'white', padding: '2px 8px', borderRadius: '6px' }}>{lastPassword.password}</code>
                  <br />Sampaikan ke creator via WhatsApp (otomatis di Modul 4).
                </p>
              </div>
            )}
            {applications.length === 0 ? (
              <p style={{ color: '#777683', fontSize: '0.875rem', textAlign: 'center', padding: '24px' }}>Belum ada pendaftar.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {applications.map((a) => {
                  const cc = curationColors[a.curationResult] || curationColors.need_review;
                  const sc = statusColors[a.status] || statusColors.pending;
                  return (
                    <div key={a._id} style={{ border: '1px solid #e1e0ff', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#191c20' }}>{a.creatorId?.name || 'Creator dihapus'}</p>
                          <p style={{ fontSize: '0.78rem', color: '#777683' }}>
                            {a.creatorId?.phone} · {a.creatorId?.domicile?.province} · skor {a.creatorId?.performanceScore?.overall ?? '-'}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ background: cc.bg, color: cc.color, borderRadius: '999px', padding: '3px 10px', fontSize: '0.7rem', fontWeight: 700 }}>{cc.label}</span>
                          <span style={{ background: sc.bg, color: sc.color, borderRadius: '999px', padding: '3px 10px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'capitalize' }}>{a.status}</span>
                        </div>
                      </div>
                      {a.curationReason && <p style={{ fontSize: '0.78rem', color: '#464652', marginBottom: '10px', lineHeight: 1.5 }}>{a.curationReason}</p>}
                      {a.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => decide(a._id, 'accepted', a.creatorId?.name)}
                            disabled={decidingId === a._id}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: '#d1fae5', color: '#065F46', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                          >
                            <ThumbsUp size={13} /> Terima
                          </button>
                          <button
                            onClick={() => decide(a._id, 'rejected', a.creatorId?.name)}
                            disabled={decidingId === a._id}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: '#ffdad6', color: '#ba1a1a', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                          >
                            <ThumbsDown size={13} /> Tolak
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <CampaignAnalyticsFinance campaignId={campaign._id} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={cardStyle}>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '16px' }}>Pendaftaran</p>
            <button
              onClick={toggleApplyOpen}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginBottom: '12px', background: campaign.applyOpen ? '#ba1a1a' : undefined }}
            >
              {campaign.applyOpen ? 'Tutup Pendaftaran' : 'Buka Pendaftaran'}
            </button>
            {campaign.applyOpen && (
              <button
                onClick={copyApplyLink}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '10px', border: '1.5px solid #c7c8cf', background: 'white', color: '#464652', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Tersalin!' : 'Salin Link Apply'}
              </button>
            )}
          </div>

          <div style={cardStyle}>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '14px' }}>Kriteria</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div><p style={labelSmall}>Niche</p><p style={{ fontSize: '0.85rem', color: '#191c20' }}>{campaign.criteria.niches.join(', ') || '—'}</p></div>
              <div><p style={labelSmall}>Platform</p><p style={{ fontSize: '0.85rem', color: '#191c20' }}>{campaign.criteria.platforms.join(', ') || '—'}</p></div>
              <div><p style={labelSmall}>Min. Followers</p><p style={{ fontSize: '0.85rem', color: '#191c20' }}>{campaign.criteria.minFollowers?.toLocaleString('id-ID') || '—'}</p></div>
              <div><p style={labelSmall}>Provinsi</p><p style={{ fontSize: '0.85rem', color: '#191c20' }}>{campaign.criteria.provinces.join(', ') || '—'}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
