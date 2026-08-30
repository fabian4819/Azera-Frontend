import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import talentApi from '../../lib/talentApi';

interface Submission {
  _id: string; type: string; platform: string; link?: string;
  insightScreenshotUrls: string[]; status: string; createdAt: string;
}
interface CampaignInfo {
  _id: string; name: string; briefContent?: string; workflowStage: string;
}

const f = "var(--font-display)";
const cardStyle: React.CSSProperties = { background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e1e0ff', marginBottom: '16px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #c7c8cf', fontSize: '0.875rem', color: '#191c20', background: 'white', outline: 'none', fontFamily: f };
const labelStyle: React.CSSProperties = { display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#191c20', marginBottom: '5px', fontFamily: f };

const statusLabels: Record<string, { label: string; bg: string; color: string }> = {
  submitted: { label: 'Terkirim', bg: '#eceef3', color: '#464652' },
  approved: { label: 'Disetujui', bg: '#d1fae5', color: '#065F46' },
  revision_requested: { label: 'Perlu Revisi', bg: '#fef3c7', color: '#92400E' },
};

export default function TalentCampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<CampaignInfo | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState<'draft' | 'post'>('post');
  const [platform, setPlatform] = useState('instagram');
  const [link, setLink] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const load = () => {
    talentApi.get(`/creator/campaigns/${id}`)
      .then((res) => {
        setCampaign(res.data.campaign);
        setSubmissions(res.data.submissions);
      })
      .catch(() => navigate('/talent/campaigns'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('platform', platform);
      if (link) formData.append('link', link);
      if (files) Array.from(files).forEach((file) => formData.append('insightScreenshots', file));
      await talentApi.post(`/creator/campaigns/${id}/submissions`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setLink('');
      setFiles(null);
      load();
    } catch {
      setSubmitError('Gagal mengirim. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', padding: '40px', color: '#777683', fontFamily: f }}>Memuat...</p>;
  if (!campaign) return null;

  return (
    <div>
      <button onClick={() => navigate('/talent/campaigns')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#777683', fontSize: '0.85rem', marginBottom: '18px', padding: 0, fontFamily: f }}>
        <ArrowLeft size={15} />
        Kembali
      </button>

      <h1 style={{ fontFamily: f, fontWeight: 800, fontSize: '1.25rem', color: '#191c20', marginBottom: '6px' }}>{campaign.name}</h1>
      <span style={{ background: '#e1e0ff', color: '#6728e4', borderRadius: '999px', padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 }}>{campaign.workflowStage.replace(/_/g, ' ')}</span>

      {campaign.briefContent && (
        <div style={{ ...cardStyle, marginTop: '16px' }}>
          <p style={{ ...labelStyle, marginBottom: '8px' }}>Brief</p>
          <p style={{ fontFamily: f, fontSize: '0.85rem', color: '#464652', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{campaign.briefContent}</p>
        </div>
      )}

      <div style={{ ...cardStyle, marginTop: '16px' }}>
        <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem', color: '#191c20', marginBottom: '14px' }}>Upload Konten & Insight</p>
        <form onSubmit={onSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }} className="form-2col">
            <div>
              <label style={labelStyle}>Jenis</label>
              <select value={type} onChange={(e) => setType(e.target.value as 'draft' | 'post')} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="draft">Draft</option>
                <option value="post">Post (sudah tayang)</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="threads">Threads</option>
                <option value="x">X</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Link Post</label>
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://instagram.com/p/..." style={inputStyle} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Screenshot Insight (maks. 6)</label>
            <input type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} style={{ ...inputStyle, padding: '10px 14px', cursor: 'pointer' }} />
          </div>
          {submitError && <p style={{ color: '#ba1a1a', fontSize: '0.8rem', marginBottom: '12px', fontFamily: f }}>{submitError}</p>}
          <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: submitting ? 0.7 : 1 }}>
            <Upload size={16} />
            {submitting ? 'Mengirim...' : 'Kirim'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: '20px' }}>
        <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem', color: '#191c20', marginBottom: '12px' }}>Riwayat Submission ({submissions.length})</p>
        {submissions.length === 0 ? (
          <p style={{ color: '#777683', fontSize: '0.85rem', fontFamily: f, textAlign: 'center', padding: '20px' }}>Belum ada submission.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {submissions.map((s) => {
              const st = statusLabels[s.status] || statusLabels.submitted;
              return (
                <div key={s._id} style={cardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.85rem', color: '#191c20', textTransform: 'capitalize' }}>{s.type} · {s.platform}</p>
                    <span style={{ background: st.bg, color: st.color, borderRadius: '999px', padding: '3px 10px', fontSize: '0.68rem', fontWeight: 700 }}>{st.label}</span>
                  </div>
                  {s.link && <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: '#6728e4', wordBreak: 'break-all', fontFamily: f }}>{s.link}</a>}
                  {s.insightScreenshotUrls.length > 0 && (
                    <p style={{ fontSize: '0.75rem', color: '#777683', marginTop: '6px', fontFamily: f }}>{s.insightScreenshotUrls.length} screenshot terlampir</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
