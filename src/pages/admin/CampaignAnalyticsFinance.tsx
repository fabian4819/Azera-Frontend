import { useEffect, useState } from 'react';
import { Sparkles, RefreshCw, FileText, ImageIcon, Plus, Trash2, ExternalLink } from 'lucide-react';
import api from '../../lib/api';

const f = "'Plus Jakarta Sans', sans-serif";
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
interface ParsedInsight { views?: number; reach?: number; likes?: number; comments?: number; shares?: number; saves?: number; verifiedAt?: string }
interface Submission {
  _id: string; type: string; platform: string; link?: string; insightScreenshotUrls: string[];
  parsedInsight?: ParsedInsight; creatorId?: { name: string };
}
interface Invoice { _id: string; number: string; total: number; status: string; isDp: boolean; pdfUrl?: string; accessCode: string }
interface FinanceRecord { revenue: number; feeCreator: number; feePic: number; feeMg: number; reimburse: number; ads: number; opex: number; discount: number; profit: number }
interface DocRecord { _id: string; type: string; pdfUrl?: string; data: Record<string, unknown>; createdAt: string }

export default function CampaignAnalyticsFinance({ campaignId }: { campaignId: string }) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [aiInsight, setAiInsight] = useState('');
  const [insightLoading, setInsightLoading] = useState(false);
  const [finance, setFinance] = useState<FinanceRecord | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [documents, setDocuments] = useState<DocRecord[]>([]);
  const [parsingId, setParsingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const [invoiceItems, setInvoiceItems] = useState([{ name: '', description: '', qty: 1, rate: 0 }]);
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [invoiceIsDp, setInvoiceIsDp] = useState(false);
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [generatingCaseStudy, setGeneratingCaseStudy] = useState(false);

  const loadAll = async () => {
    try {
      const [aRes, sRes, fRes, iRes, dRes, cRes] = await Promise.all([
        api.get(`/admin/campaigns/${campaignId}/analytics`),
        api.get(`/admin/campaigns/${campaignId}/submissions`),
        api.get(`/admin/campaigns/${campaignId}/finance`),
        api.get(`/admin/campaigns/${campaignId}/invoices`),
        api.get(`/admin/campaigns/${campaignId}/documents`),
        api.get(`/admin/campaigns/${campaignId}`),
      ]);
      setAnalytics(aRes.data);
      setSubmissions(sRes.data);
      setFinance(fRes.data);
      setInvoices(iRes.data);
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

  const parseInsight = async (submissionId: string) => {
    setParsingId(submissionId);
    setActionError('');
    try {
      const res = await api.post(`/admin/submissions/${submissionId}/parse-insight`);
      setSubmissions((prev) => prev.map((s) => (s._id === submissionId ? res.data : s)));
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setActionError(message || 'Gagal membaca insight.');
    } finally {
      setParsingId(null);
    }
  };

  const verifyInsight = async (submissionId: string, field: string, value: string) => {
    const num = value === '' ? undefined : Number(value);
    setActionError('');
    try {
      const res = await api.patch(`/admin/submissions/${submissionId}`, { parsedInsight: { [field]: num } });
      setSubmissions((prev) => prev.map((s) => (s._id === submissionId ? res.data : s)));
    } catch {
      setActionError('Gagal menyimpan koreksi.');
    }
  };

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

  const saveFinanceField = async (field: string, value: number) => {
    setActionError('');
    try {
      const res = await api.patch(`/admin/campaigns/${campaignId}/finance`, { [field]: value });
      setFinance(res.data);
    } catch {
      setActionError('Gagal menyimpan data finance.');
    }
  };

  const addInvoiceItem = () => setInvoiceItems((prev) => [...prev, { name: '', description: '', qty: 1, rate: 0 }]);
  const removeInvoiceItem = (i: number) => setInvoiceItems((prev) => prev.filter((_, idx) => idx !== i));
  const updateInvoiceItem = (i: number, field: string, value: string | number) =>
    setInvoiceItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)));

  const createInvoice = async () => {
    setCreatingInvoice(true);
    setActionError('');
    try {
      const res = await api.post(`/admin/campaigns/${campaignId}/invoices`, {
        items: invoiceItems.filter((i) => i.name), discount: invoiceDiscount, isDp: invoiceIsDp,
      });
      setInvoices((prev) => [res.data, ...prev]);
      setInvoiceItems([{ name: '', description: '', qty: 1, rate: 0 }]);
      setInvoiceDiscount(0);
      setInvoiceIsDp(false);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setActionError(message || 'Gagal membuat invoice.');
    } finally {
      setCreatingInvoice(false);
    }
  };

  const verifyInvoice = async (invoiceId: string) => {
    setActionError('');
    try {
      const res = await api.patch(`/admin/invoices/${invoiceId}/verify`);
      setInvoices((prev) => prev.map((inv) => (inv._id === invoiceId ? res.data : inv)));
    } catch {
      setActionError('Gagal verifikasi invoice.');
    }
  };

  const generateReport = async () => {
    setGeneratingReport(true);
    setActionError('');
    try {
      const res = await api.post(`/admin/campaigns/${campaignId}/generate-report`);
      setDocuments((prev) => [res.data, ...prev]);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      setActionError(message || 'Gagal generate report.');
    } finally {
      setGeneratingReport(false);
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
      <div style={cardStyle}>
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
      </div>

      {/* Submissions & insight verification */}
      <div style={cardStyle}>
        <p style={sectionTitle}>Submission & Insight ({submissions.length})</p>
        {submissions.length === 0 ? (
          <p style={{ color: '#777683', fontSize: '0.85rem', fontFamily: f }}>Belum ada submission dari creator.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {submissions.map((s) => (
              <div key={s._id} style={{ border: '1px solid #e1e0ff', borderRadius: '12px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.85rem', textTransform: 'capitalize' }}>
                    {s.creatorId?.name || '-'} · {s.type} · {s.platform}
                  </p>
                  {s.insightScreenshotUrls.length > 0 && (
                    <button onClick={() => parseInsight(s._id)} disabled={parsingId === s._id} style={{ ...smallBtn, padding: '6px 12px', fontSize: '0.75rem' }}>
                      <Sparkles size={12} /> {parsingId === s._id ? 'Membaca...' : 'Baca Insight AI'}
                    </button>
                  )}
                </div>
                {s.link && <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: '#6728e4', fontFamily: f, wordBreak: 'break-all' }}>{s.link}</a>}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginTop: '10px' }}>
                  {(['views', 'reach', 'likes', 'comments', 'shares', 'saves'] as const).map((field) => (
                    <div key={field}>
                      <label style={{ fontSize: '0.65rem', color: '#777683', fontFamily: f, textTransform: 'uppercase' }}>{field}</label>
                      <input
                        defaultValue={s.parsedInsight?.[field] ?? ''}
                        onBlur={(e) => verifyInsight(s._id, field, e.target.value)}
                        type="number"
                        style={{ ...inputStyle, padding: '6px 8px', fontSize: '0.78rem' }}
                      />
                    </div>
                  ))}
                </div>
                {s.parsedInsight?.verifiedAt && <p style={{ fontSize: '0.7rem', color: '#065F46', marginTop: '6px', fontFamily: f }}>✓ Terverifikasi</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Insight */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <p style={sectionTitle}>AI Campaign Insight</p>
          <button onClick={generateInsight} disabled={insightLoading} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
            <Sparkles size={14} /> {insightLoading ? 'Menganalisis...' : 'Generate Insight'}
          </button>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#464652', fontFamily: f, lineHeight: 1.6, whiteSpace: 'pre-wrap', background: '#f5f3ff', borderRadius: '10px', padding: '14px' }}>
          {aiInsight || 'Belum ada insight — klik Generate Insight.'}
        </p>
      </div>

      {/* Finance */}
      {finance && (
        <div style={cardStyle}>
          <p style={sectionTitle}>Finance</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }} className="form-2col">
            {(['feeCreator', 'feePic', 'feeMg', 'reimburse', 'ads', 'opex'] as const).map((field) => (
              <div key={field}>
                <label style={{ fontSize: '0.72rem', color: '#777683', fontFamily: f }}>{field}</label>
                <input
                  defaultValue={finance[field]}
                  onBlur={(e) => saveFinanceField(field, Number(e.target.value) || 0)}
                  type="number"
                  style={{ ...inputStyle, padding: '8px 10px' }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {statBox('Revenue', `Rp${finance.revenue.toLocaleString('id-ID')}`)}
            {statBox('Profit', `Rp${finance.profit.toLocaleString('id-ID')}`)}
          </div>
        </div>
      )}

      {/* Invoices */}
      <div style={cardStyle}>
        <p style={sectionTitle}>Invoice ({invoices.length})</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {invoices.map((inv) => (
            <div key={inv._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e1e0ff', borderRadius: '10px', padding: '10px 14px' }}>
              <div>
                <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.82rem' }}>{inv.number}</p>
                <p style={{ fontSize: '0.75rem', color: '#777683', fontFamily: f }}>Rp{inv.total.toLocaleString('id-ID')} · {inv.status}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {inv.pdfUrl && <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#6728e4' }}><ExternalLink size={16} /></a>}
                {inv.status === 'waiting_verification' && (
                  <button onClick={() => verifyInvoice(inv._id)} style={{ ...smallBtn, padding: '4px 10px', fontSize: '0.72rem' }}>Verifikasi</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.85rem', marginBottom: '10px' }}>Buat Invoice Baru</p>
        {invoiceItems.map((item, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
            <input placeholder="Nama item" value={item.name} onChange={(e) => updateInvoiceItem(i, 'name', e.target.value)} style={{ ...inputStyle, padding: '8px 10px' }} />
            <input placeholder="Qty" type="number" value={item.qty} onChange={(e) => updateInvoiceItem(i, 'qty', Number(e.target.value))} style={{ ...inputStyle, padding: '8px 10px' }} />
            <input placeholder="Rate" type="number" value={item.rate} onChange={(e) => updateInvoiceItem(i, 'rate', Number(e.target.value))} style={{ ...inputStyle, padding: '8px 10px' }} />
            <button onClick={() => removeInvoiceItem(i)} style={{ background: 'none', border: 'none', color: '#ba1a1a', cursor: 'pointer' }}><Trash2 size={16} /></button>
          </div>
        ))}
        <button onClick={addInvoiceItem} style={{ ...smallBtn, padding: '6px 12px', fontSize: '0.75rem', marginBottom: '12px' }}><Plus size={12} /> Item</button>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
          <input placeholder="Discount" type="number" value={invoiceDiscount} onChange={(e) => setInvoiceDiscount(Number(e.target.value))} style={{ ...inputStyle, padding: '8px 10px', width: '140px' }} />
          <label style={{ fontSize: '0.8rem', fontFamily: f, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input type="checkbox" checked={invoiceIsDp} onChange={(e) => setInvoiceIsDp(e.target.checked)} /> DP
          </label>
        </div>
        <button onClick={createInvoice} disabled={creatingInvoice} className="btn-primary" style={{ padding: '9px 18px', fontSize: '0.82rem' }}>
          {creatingInvoice ? 'Membuat...' : 'Generate Invoice'}
        </button>
      </div>

      {/* Report & Case Study */}
      <div style={cardStyle}>
        <p style={sectionTitle}>Report & Case Study</p>
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
      </div>
    </>
  );
}
