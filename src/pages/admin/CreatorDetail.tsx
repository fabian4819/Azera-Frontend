import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, ThumbsDown, Unlock } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import api from '../../lib/api';

const f = "var(--font-display)";
const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)', marginBottom: '20px',
};
const labelSmall: React.CSSProperties = {
  fontSize: '0.7rem', fontFamily: f, fontWeight: 700, color: '#777683',
  marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em',
};

interface ScoreBreakdown {
  reliability: { score: number; totalCampaigns: number; onTimeCount: number; violationCount: number };
  quality: { score: number; totalCampaigns: number; avgRevisions: number; noRevisionCount: number };
  performance: { score: number; note: string };
  communication: { score: number | null; avgResponseHours: number | null; sampleCount: number };
  overall: number;
}

interface Creator {
  _id: string; name: string; phone: string; email?: string; gender?: string;
  domicile?: { province?: string; city?: string };
  socials: { platform: string; username: string; profileUrl: string; followers: number }[];
  activities: string[]; niches: string[]; nicheOther?: string;
  contentStyles: string[]; contentStyleOther?: string;
  bankAccount?: { bankName: string; accountNumber: string; accountName: string };
  npwp?: string; mediaKitUrl?: string; portfolioLink?: string;
  complianceStatus: string; cancelCount: number; status: string; createdAt: string;
}

interface HistoryItem {
  _id: string; campaignId?: { name: string }; brandId?: { namaBrand: string };
  uploadedOnTime: boolean; revisions: number; violation?: string; createdAt: string;
}

const GENDER_LABELS: Record<string, string> = { male: 'Laki-laki', female_hijab: 'Perempuan (Hijab)', female_non_hijab: 'Perempuan (Non-Hijab)' };

export default function CreatorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deciding, setDeciding] = useState(false);
  const [actionError, setActionError] = useState('');

  const load = async () => {
    try {
      const res = await api.get(`/admin/creators/${id}`);
      setCreator(res.data.creator);
      setScoreBreakdown(res.data.scoreBreakdown);
      setHistory(res.data.history);
    } catch {
      navigate('/admin/creators');
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

  const decide = async (status: 'approved' | 'rejected') => {
    setDeciding(true);
    setActionError('');
    try {
      const res = await api.patch(`/admin/creators/${id}`, { status });
      setCreator(res.data);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setActionError(message || 'Gagal menyimpan keputusan.');
    } finally {
      setDeciding(false);
    }
  };

  const unlock = async () => {
    setActionError('');
    try {
      const res = await api.post(`/admin/creators/${id}/unlock`);
      setCreator(res.data);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setActionError(message || 'Gagal unlock.');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#777683' }}>Memuat...</div>;
  if (!creator) return null;

  return (
    <div>
      <button
        onClick={() => navigate('/admin/creators')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#777683', fontSize: '0.875rem', marginBottom: '24px', padding: 0, fontFamily: f }}
      >
        <ArrowLeft size={16} /> Kembali ke Creators
      </button>

      {actionError && (
        <div style={{ background: '#ffdad6', color: '#ba1a1a', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.82rem', fontFamily: f }}>
          {actionError}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }} className="detail-grid">
        <div>
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontFamily: f, fontWeight: 800, fontSize: '1.4rem', color: '#191c20' }}>{creator.name}</h2>
                <p style={{ fontSize: '0.85rem', color: '#777683' }}>{creator.phone} {creator.email ? `· ${creator.email}` : ''}</p>
              </div>
              <StatusBadge status={creator.status} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div><p style={labelSmall}>Jenis Kelamin</p><p style={{ fontSize: '0.85rem', color: '#191c20' }}>{creator.gender ? GENDER_LABELS[creator.gender] : '—'}</p></div>
              <div><p style={labelSmall}>Domisili</p><p style={{ fontSize: '0.85rem', color: '#191c20' }}>{creator.domicile?.city || '—'}, {creator.domicile?.province || '—'}</p></div>
              <div><p style={labelSmall}>Niche</p><p style={{ fontSize: '0.85rem', color: '#191c20' }}>{creator.niches.join(', ')}{creator.nicheOther ? `, ${creator.nicheOther}` : ''}</p></div>
              <div><p style={labelSmall}>Gaya Konten</p><p style={{ fontSize: '0.85rem', color: '#191c20' }}>{creator.contentStyles.join(', ')}{creator.contentStyleOther ? `, ${creator.contentStyleOther}` : ''}</p></div>
              <div><p style={labelSmall}>Aktivitas</p><p style={{ fontSize: '0.85rem', color: '#191c20' }}>{creator.activities.join(', ') || '—'}</p></div>
              <div><p style={labelSmall}>NPWP</p><p style={{ fontSize: '0.85rem', color: '#191c20' }}>{creator.npwp || '—'}</p></div>
            </div>
          </div>

          <div style={cardStyle}>
            <p style={{ fontFamily: f, fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '16px' }}>Media Sosial</p>
            {creator.socials.length === 0 ? <p style={{ color: '#777683', fontSize: '0.85rem' }}>Belum ada.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {creator.socials.map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8f9ff', borderRadius: '10px', fontSize: '0.85rem' }}>
                    <span style={{ textTransform: 'capitalize', fontWeight: 700, color: '#6728e4' }}>{s.platform}</span>
                    <span>{s.username} · {s.followers.toLocaleString('id-ID')} followers</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {scoreBreakdown && (
            <div style={cardStyle}>
              <p style={{ fontFamily: f, fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '16px' }}>Performance Score — {scoreBreakdown.overall}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ padding: '14px', background: '#f8f9ff', borderRadius: '10px' }}>
                  <p style={labelSmall}>Reliability (40%)</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#6728e4' }}>{scoreBreakdown.reliability.score}</p>
                  <p style={{ fontSize: '0.75rem', color: '#777683' }}>{scoreBreakdown.reliability.onTimeCount}/{scoreBreakdown.reliability.totalCampaigns} on-time, {scoreBreakdown.reliability.violationCount} pelanggaran</p>
                </div>
                <div style={{ padding: '14px', background: '#f8f9ff', borderRadius: '10px' }}>
                  <p style={labelSmall}>Quality (25%)</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#6728e4' }}>{scoreBreakdown.quality.score}</p>
                  <p style={{ fontSize: '0.75rem', color: '#777683' }}>avg {scoreBreakdown.quality.avgRevisions} revisi, {scoreBreakdown.quality.noRevisionCount} tanpa revisi</p>
                </div>
                <div style={{ padding: '14px', background: '#f8f9ff', borderRadius: '10px' }}>
                  <p style={labelSmall}>Performance (20%)</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#6728e4' }}>{scoreBreakdown.performance.score}</p>
                  <p style={{ fontSize: '0.75rem', color: '#777683' }}>{scoreBreakdown.performance.note}</p>
                </div>
                <div style={{ padding: '14px', background: '#f8f9ff', borderRadius: '10px' }}>
                  <p style={labelSmall}>Communication (15%)</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#6728e4' }}>{scoreBreakdown.communication.score ?? '—'}</p>
                  <p style={{ fontSize: '0.75rem', color: '#777683' }}>{scoreBreakdown.communication.sampleCount} sample{scoreBreakdown.communication.avgResponseHours ? `, avg ${scoreBreakdown.communication.avgResponseHours}j respon` : ''}</p>
                </div>
              </div>
            </div>
          )}

          <div style={cardStyle}>
            <p style={{ fontFamily: f, fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '16px' }}>Riwayat Campaign ({history.length})</p>
            {history.length === 0 ? <p style={{ color: '#777683', fontSize: '0.85rem' }}>Belum ada riwayat.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {history.map((h) => (
                  <div key={h._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f8f9ff', borderRadius: '10px', fontSize: '0.8rem' }}>
                    <span>{h.campaignId?.name || '—'} · {h.brandId?.namaBrand || '—'}</span>
                    <span style={{ color: h.violation ? '#ba1a1a' : '#065F46' }}>{h.violation || (h.uploadedOnTime ? 'On-time' : 'Telat')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={cardStyle}>
            <p style={{ fontFamily: f, fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '16px' }}>Keputusan</p>
            {creator.status === 'pending' || creator.status === 'reviewing' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => decide('approved')}
                  disabled={deciding}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: '#d1fae5', color: '#065F46', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, fontFamily: f }}
                >
                  <ThumbsUp size={15} /> Setujui
                </button>
                <button
                  onClick={() => decide('rejected')}
                  disabled={deciding}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: '#ffdad6', color: '#ba1a1a', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, fontFamily: f }}
                >
                  <ThumbsDown size={15} /> Tolak
                </button>
              </div>
            ) : (
              <p style={{ fontSize: '0.85rem', color: '#777683' }}>Status sudah final: <StatusBadge status={creator.status} /></p>
            )}
          </div>

          <div style={cardStyle}>
            <p style={{ fontFamily: f, fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '14px' }}>Compliance</p>
            <p style={{ fontSize: '0.85rem', color: '#191c20', marginBottom: '8px' }}>Status: <strong>{creator.complianceStatus}</strong></p>
            <p style={{ fontSize: '0.85rem', color: '#191c20', marginBottom: '14px' }}>Cancel count: {creator.cancelCount}</p>
            {creator.complianceStatus !== 'ok' && (
              <button
                onClick={unlock}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', padding: '9px', background: 'white', color: '#6728e4', borderRadius: '10px', border: '1.5px solid #6728e4', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, fontFamily: f }}
              >
                <Unlock size={14} /> Unlock Manual
              </button>
            )}
          </div>

          {creator.bankAccount && (
            <div style={cardStyle}>
              <p style={{ fontFamily: f, fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '14px' }}>Rekening</p>
              <p style={{ fontSize: '0.85rem', color: '#191c20' }}>{creator.bankAccount.bankName} — {creator.bankAccount.accountNumber}</p>
              <p style={{ fontSize: '0.85rem', color: '#777683' }}>a.n. {creator.bankAccount.accountName}</p>
            </div>
          )}

          {(creator.mediaKitUrl || creator.portfolioLink) && (
            <div style={cardStyle}>
              <p style={{ fontFamily: f, fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '14px' }}>Link</p>
              {creator.mediaKitUrl && <p style={{ fontSize: '0.85rem', marginBottom: '6px' }}><a href={creator.mediaKitUrl} target="_blank" rel="noreferrer" style={{ color: '#6728e4' }}>Media Kit</a></p>}
              {creator.portfolioLink && <p style={{ fontSize: '0.85rem' }}><a href={creator.portfolioLink} target="_blank" rel="noreferrer" style={{ color: '#6728e4' }}>Portfolio</a></p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
