import { useEffect, useState, Fragment } from 'react';
import { Sparkles, RefreshCw, FileText, ImageIcon, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

/** AI insight text hanya pakai **bold** dan "- " bullet, render itu saja, bukan full markdown parser. */
function renderBoldSegments(line: string) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <Fragment key={i}>{part}</Fragment>
  );
}

function renderInsightText(text: string) {
  return text.split('\n').map((line, i) => {
    const trimmed = line.trimStart();
    const heading = trimmed.match(/^(#{1,6})\s+(.*)/);
    if (heading) {
      return (
        <div key={i} style={{ fontWeight: 800, fontSize: heading[1].length <= 3 ? '0.95rem' : '0.88rem', marginTop: i === 0 ? 0 : '10px', color: '#191c20' }}>
          {renderBoldSegments(heading[2])}
        </div>
      );
    }
    if (trimmed.startsWith('- ')) {
      return (
        <div key={i} style={{ display: 'flex', gap: '8px', paddingLeft: '4px' }}>
          <span>•</span>
          <span>{renderBoldSegments(trimmed.slice(2))}</span>
        </div>
      );
    }
    return <div key={i}>{line ? renderBoldSegments(line) : ' '}</div>;
  });
}

const f = "var(--font-display)";
const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)', marginBottom: '20px',
};
const labelSmall: React.CSSProperties = {
  fontSize: '0.7rem', fontFamily: f, fontWeight: 700, color: '#777683',
  marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em',
};
const sectionTitle: React.CSSProperties = { fontFamily: f, fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '16px' };
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #c7c8cf',
  fontSize: '0.85rem', color: '#191c20', fontFamily: f, outline: 'none',
};
const smallBtn: React.CSSProperties = {
  padding: '8px 16px', fontSize: '0.8rem', fontWeight: 700, borderRadius: '10px', border: '1.5px solid #6728e4',
  background: 'white', color: '#6728e4', cursor: 'pointer', fontFamily: f, display: 'flex', alignItems: 'center', gap: '6px',
};

interface Analytics {
  totalPosts: number; totalViews: number; totalLikes: number; totalComments: number; totalShares: number;
  totalReach: number | null; totalSaves: number | null; engagementRate: number;
  costPerView: number | null; cpm: number | null;
  achievement?: { viewsPct?: number; engagementRatePct?: number };
  perPlatform: Record<string, { posts: number; views: number; likes: number; comments: number; shares: number }>;
}
type AutoFee = 'feeCreator' | 'feePic' | 'feeMg';
interface FinanceRecord {
  revenue: number; feeCreator: number; feePic: number; feeMg: number; reimburse: number; ads: number; opex: number; discount: number; profit: number;
  feeManual: AutoFee[];
  /** Fee otomatis = fee per creator (tahap 1) x creator yang di-approve */
  auto: { acceptedCount: number; perCreator: Record<AutoFee, number>; totals: Record<AutoFee, number> };
}
const FEE_LABELS: Record<string, string> = { feeCreator: 'Fee Creator', feePic: 'Fee PIC', feeMg: 'Fee MG', reimburse: 'Reimburse', ads: 'Ads', opex: 'Opex' };
const AUTO_FEES: AutoFee[] = ['feeCreator', 'feePic', 'feeMg'];
const rupiah = (n: number) => `Rp${n.toLocaleString('id-ID')}`;
interface DocRecord { _id: string; type: string; pdfUrl?: string; data: Record<string, unknown>; createdAt: string }

/** Tab Report (analytics, AI insight, report & case study) dan tab Finance (fee & profit) di CampaignDetail.
 * Invoice dikelola di menu Document > Invoice (revenue tetap dihitung dari invoice campaign ini).
 * Submission & insight per creator dikelola di Master Sheet. */
export default function CampaignAnalyticsFinance({ campaignId, view, stage, onStageChanged }: {
  campaignId: string;
  view: 'report' | 'finance';
  stage?: string;
  onStageChanged?: (stage: string) => void;
}) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [reportReady, setReportReady] = useState(false);
  const [movingStage, setMovingStage] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [insightLoading, setInsightLoading] = useState(false);
  const [finance, setFinance] = useState<FinanceRecord | null>(null);
  const [documents, setDocuments] = useState<DocRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const [generatingReport, setGeneratingReport] = useState(false);
  const [generatingCaseStudy, setGeneratingCaseStudy] = useState(false);

  const loadAll = async () => {
    try {
      const [aRes, fRes, dRes, cRes] = await Promise.all([
        api.get(`/admin/campaigns/${campaignId}/analytics`),
        api.get(`/admin/campaigns/${campaignId}/finance`),
        api.get(`/admin/campaigns/${campaignId}/documents`),
        api.get(`/admin/campaigns/${campaignId}`),
      ]);
      setAnalytics(aRes.data);
      setFinance(fRes.data);
      setDocuments(dRes.data);
      setAiInsight(cRes.data.aiInsight || '');
    } catch {
      setError('Gagal memuat data analytics/finance.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = window.setTimeout(() => { void loadAll(); }, 0);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  const generateInsight = async () => {
    setInsightLoading(true);
    setActionError('');
    try {
      const res = await api.post(`/admin/campaigns/${campaignId}/generate-insight`);
      setAiInsight(res.data.aiInsight);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setActionError(message || 'Gagal generate insight.');
    } finally {
      setInsightLoading(false);
    }
  };

  // value null = fee otomatis dikembalikan ke hitungan otomatis
  const saveFinanceField = async (field: string, value: number | null) => {
    setActionError('');
    try {
      const res = await api.patch(`/admin/campaigns/${campaignId}/finance`, { [field]: value });
      setFinance(res.data);
    } catch {
      setActionError('Gagal menyimpan data finance.');
    }
  };

  const generateReport = async () => {
    setGeneratingReport(true);
    setActionError('');
    try {
      const res = await api.post(`/admin/campaigns/${campaignId}/generate-report`);
      setDocuments((prev) => [res.data, ...prev]);
      setReportReady(true);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setActionError(message || 'Gagal generate report.');
    } finally {
      setGeneratingReport(false);
    }
  };

  // Tahap tidak lagi maju otomatis; setelah report jadi, admin bisa pindah ke tahap Report dengan 1 klik
  const moveToReport = async () => {
    setMovingStage(true);
    setActionError('');
    try {
      const res = await api.post(`/admin/campaigns/${campaignId}/workflow/transition`, { toStage: 'report' });
      onStageChanged?.(res.data.workflowStage);
      setReportReady(false);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setActionError(message || 'Gagal memindahkan tahap.');
    } finally {
      setMovingStage(false);
    }
  };

  const generateCaseStudy = async () => {
    setGeneratingCaseStudy(true);
    setActionError('');
    try {
      const res = await api.post(`/admin/campaigns/${campaignId}/generate-case-study`);
      setDocuments((prev) => [res.data, ...prev]);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setActionError(message || 'Gagal generate case study.');
    } finally {
      setGeneratingCaseStudy(false);
    }
  };

  if (loading) return <div style={cardStyle}><p style={{ color: '#777683', fontFamily: f, textAlign: 'center' }}>Memuat analytics...</p></div>;
  if (error) return <div style={cardStyle}><p style={{ color: '#ba1a1a', fontFamily: f }}>{error}</p></div>;

  const statBox = (label: string, value: string) => (
    <div style={{ background: '#f8f9ff', border: '1px solid #e1e0ff', borderRadius: '12px', padding: '14px 16px', flex: 1, minWidth: '110px' }}>
      <p style={labelSmall}>{label}</p>
      <p style={{ fontFamily: f, fontWeight: 700, fontSize: '1.2rem', color: '#6728e4' }}>{value}</p>
    </div>
  );

  return (
    <>
      {actionError && (
        <div style={{ background: '#ffdad6', color: '#ba1a1a', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.82rem', fontFamily: f, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <span>{actionError}</span>
          <button onClick={() => setActionError('')} style={{ background: 'none', border: 'none', color: '#ba1a1a', cursor: 'pointer', fontWeight: 700, fontFamily: f, flexShrink: 0 }}>✕</button>
        </div>
      )}
      {/* Analytics */}
      {view === 'report' && <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <p style={sectionTitle}>Analytics</p>
          <button onClick={loadAll} style={{ ...smallBtn, padding: '6px 10px' }}><RefreshCw size={13} /></button>
        </div>
        {analytics && (
          <>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {statBox('Total Post', String(analytics.totalPosts))}
              {statBox('Views', analytics.totalViews.toLocaleString('id-ID'))}
              {statBox('Reach', analytics.totalReach !== null ? analytics.totalReach.toLocaleString('id-ID') : '-')}
              {statBox('Engagement Rate', `${analytics.engagementRate}%`)}
              {analytics.achievement?.viewsPct !== undefined && statBox('Pencapaian Target', `${analytics.achievement.viewsPct}%`)}
            </div>
            {Object.entries(analytics.perPlatform).map(([platform, s]) => (
              <div key={platform} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '8px 0', borderBottom: '1px solid #f0f0f0', fontFamily: f }}>
                <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{platform}</span>
                <span style={{ color: '#777683' }}>{s.posts} post · {s.views.toLocaleString('id-ID')} views</span>
              </div>
            ))}
          </>
        )}
      </div>}

      {/* Submission & insight per creator sekarang di Master Sheet (board draft/posting/insight) */}
      {view === 'report' && (
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
          <div>
            <p style={sectionTitle}>Submission & Insight Creator</p>
            <p style={{ fontSize: '0.82rem', color: '#777683', fontFamily: f, marginTop: '4px' }}>Draft, link posting, screenshot insight, dan review dikelola di Master Sheet.</p>
          </div>
          <Link to={`/admin/campaigns/${campaignId}/sheet?tab=master`} style={{ ...smallBtn, textDecoration: 'none' }}>
            <ExternalLink size={14} /> Buka Master Sheet
          </Link>
        </div>
      )}

      {/* AI Insight */}
      {view === 'report' && <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <p style={sectionTitle}>AI Campaign Insight</p>
          <button onClick={generateInsight} disabled={insightLoading} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <Sparkles size={14} /> {insightLoading ? 'Menganalisis...' : 'Generate Insight'}
          </button>
        </div>
        <div style={{ fontSize: '0.85rem', color: '#464652', fontFamily: f, lineHeight: 1.6, background: '#f5f3ff', borderRadius: '10px', padding: '14px' }}>
          {aiInsight ? renderInsightText(aiInsight) : 'Belum ada insight. Klik Generate Insight.'}
        </div>
      </div>}

      {/* Finance */}
      {view === 'finance' && finance && (
        <div style={cardStyle}>
          <p style={sectionTitle}>Finance</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }} className="form-2col">
            {(['feeCreator', 'feePic', 'feeMg', 'reimburse', 'ads', 'opex'] as const).map((field) => {
              const isAuto = (AUTO_FEES as string[]).includes(field);
              const manual = isAuto && finance.feeManual.includes(field as AutoFee);
              return (
                <div key={field}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#464652', fontFamily: f, fontWeight: 600, marginBottom: '4px' }}>
                    {FEE_LABELS[field]}
                    {isAuto && (
                      <span style={{ fontSize: '0.64rem', fontWeight: 700, padding: '1px 7px', borderRadius: '999px', background: manual ? '#fef3c7' : '#eefad8', color: manual ? '#92400E' : '#3d6b00' }}>
                        {manual ? 'Manual' : 'Otomatis'}
                      </span>
                    )}
                  </label>
                  <input
                    key={`${field}-${finance[field]}`}
                    defaultValue={finance[field]}
                    onBlur={(e) => { if (Number(e.target.value) !== finance[field]) void saveFinanceField(field, Number(e.target.value) || 0); }}
                    type="number"
                    style={{ ...inputStyle, padding: '8px 10px' }}
                  />
                  {isAuto && (
                    <p style={{ fontSize: '0.68rem', color: '#8a8a99', fontFamily: f, marginTop: '4px' }}>
                      {manual ? (
                        <button onClick={() => void saveFinanceField(field, null)} style={{ background: 'none', border: 'none', padding: 0, color: '#6728e4', cursor: 'pointer', fontSize: '0.68rem', fontWeight: 700, fontFamily: f }}>
                          Pakai otomatis ({rupiah(finance.auto.totals[field as AutoFee])})
                        </button>
                      ) : (
                        `${rupiah(finance.auto.perCreator[field as AutoFee])} × ${finance.auto.acceptedCount} creator di-approve`
                      )}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {statBox('Revenue', rupiah(finance.revenue))}
            {statBox('Profit', rupiah(finance.profit))}
          </div>
        </div>
      )}

      {/* Report & Case Study */}
      {view === 'report' && <div style={cardStyle}>
        <p style={sectionTitle}>Report & Case Study</p>
        {reportReady && stage !== 'report' && stage !== 'completed' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', background: '#eefad8', borderRadius: '10px', padding: '10px 14px', margin: '10px 0 14px', fontFamily: f, fontSize: '0.8rem', color: '#2c4d00' }}>
            <span>Report sudah dibuat. Pindahkan campaign ke tahap Report?</span>
            <button onClick={() => void moveToReport()} disabled={movingStage} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.78rem', opacity: movingStage ? 0.6 : 1 }}>
              {movingStage ? 'Memindahkan...' : 'Pindah ke Report'}
            </button>
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <button onClick={generateReport} disabled={generatingReport} className="btn-primary" style={{ padding: '9px 16px', fontSize: '0.8rem' }}>
            <FileText size={14} /> {generatingReport ? 'Membuat...' : 'Generate Report'}
          </button>
          <button onClick={generateCaseStudy} disabled={generatingCaseStudy} style={{ ...smallBtn }}>
            <ImageIcon size={14} /> {generatingCaseStudy ? 'Membuat...' : 'Generate Case Study'}
          </button>
        </div>
        {documents.map((doc) => (
          <div key={doc._id} style={{ border: '1px solid #e1e0ff', borderRadius: '10px', padding: '12px 14px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: f, fontWeight: 700, fontSize: '0.8rem', textTransform: 'capitalize' }}>{doc.type.replace('_', ' ')}</span>
              {doc.pdfUrl && <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#6728e4' }}><ExternalLink size={14} /></a>}
            </div>
            {doc.type === 'case_study' && (
              <div style={{ marginTop: '8px', fontSize: '0.78rem', fontFamily: f, color: '#464652' }}>
                <p style={{ fontWeight: 700, marginBottom: '4px' }}>{String(doc.data.headline || '')}</p>
                <p>{String(doc.data.results || '')}</p>
              </div>
            )}
          </div>
        ))}
      </div>}
    </>
  );
}
