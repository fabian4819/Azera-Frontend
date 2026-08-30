import { useEffect, useState } from 'react';
import { History } from 'lucide-react';
import api from '../../lib/api';

const f = "var(--font-display)";
const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)', marginBottom: '20px',
};

const STAGE_LABELS: Record<string, string> = {
  draft: 'Draft',
  listing: 'Listing',
  open_registration: 'Open Registration',
  internal_review: 'Internal Review',
  smart_recommendation: 'Smart Recommendation',
  creator_approved: 'Creator Approved',
  client_approval: 'Client Approval',
  brief_sent: 'Brief Sent',
  waiting_draft: 'Waiting Draft',
  content_review: 'Content Review',
  revision: 'Revision',
  waiting_post: 'Waiting Post',
  posted: 'Posted',
  waiting_insight: 'Waiting Insight',
  insight_collected: 'Insight Collected',
  report_generated: 'Report Generated',
  completed: 'Completed',
};

const STAGE_ORDER = Object.keys(STAGE_LABELS);

const SUB_STAGE_LABELS: Record<string, string> = {
  brief_sent: 'Brief Sent',
  waiting_draft: 'Waiting Draft',
  content_review: 'Content Review',
  revision: 'Revision',
  waiting_post: 'Waiting Post',
  posted: 'Posted',
  waiting_insight: 'Waiting Insight',
  insight_collected: 'Insight Collected',
};

interface WorkflowData {
  workflowStage: string;
  validNextStages: string[];
  creatorStages: { applicationId: string; creatorName: string; subStage: string }[];
  history: { _id: string; fromStage: string; toStage: string; byUserId?: { name: string }; byRole: string; isOverride: boolean; reason?: string; createdAt: string }[];
}

export default function WorkflowTracker({ campaignId }: { campaignId: string }) {
  const [data, setData] = useState<WorkflowData | null>(null);
  const [toStage, setToStage] = useState('');
  const [override, setOverride] = useState(false);
  const [reason, setReason] = useState('');
  const [transitioning, setTransitioning] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [actionError, setActionError] = useState('');

  const load = async () => {
    const res = await api.get(`/admin/campaigns/${campaignId}/workflow`);
    setData(res.data);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  const transition = async () => {
    if (!toStage) return;
    setTransitioning(true);
    setActionError('');
    try {
      await api.post(`/admin/campaigns/${campaignId}/workflow/transition`, { toStage, override, reason: reason || undefined });
      setToStage('');
      setReason('');
      setOverride(false);
      await load();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setActionError(message || 'Gagal mengubah tahap.');
    } finally {
      setTransitioning(false);
    }
  };

  if (!data) return null;

  const currentIndex = STAGE_ORDER.indexOf(data.workflowStage);

  return (
    <div style={cardStyle}>
      <p style={{ fontFamily: f, fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '16px' }}>Progress Tracker (17 Tahap)</p>

      {actionError && (
        <div style={{ background: '#ffdad6', color: '#ba1a1a', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', fontSize: '0.8rem', fontFamily: f }}>
          {actionError}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
        {STAGE_ORDER.map((stage, i) => (
          <span
            key={stage}
            style={{
              padding: '5px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, fontFamily: f,
              background: i === currentIndex ? '#6728e4' : i < currentIndex ? '#e1e0ff' : '#f0f0f5',
              color: i === currentIndex ? 'white' : i < currentIndex ? '#6728e4' : '#8a8a99',
            }}
          >
            {STAGE_LABELS[stage]}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '10px' }}>
        <select
          value={toStage}
          onChange={(e) => setToStage(e.target.value)}
          style={{ padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #c7c8cf', fontSize: '0.8rem', fontFamily: f }}
        >
          <option value="">Pindah ke tahap...</option>
          {(override ? STAGE_ORDER : data.validNextStages).map((s) => (
            <option key={s} value={s}>{STAGE_LABELS[s]}</option>
          ))}
        </select>
        <button
          onClick={transition}
          disabled={!toStage || transitioning}
          className="btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.8rem', opacity: !toStage || transitioning ? 0.6 : 1 }}
        >
          {transitioning ? 'Memproses...' : 'Ubah Tahap'}
        </button>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontFamily: f, color: '#464652', marginBottom: '8px', cursor: 'pointer' }}>
        <input type="checkbox" checked={override} onChange={(e) => setOverride(e.target.checked)} /> Override (lompat tahap manapun — perlu alasan kalau bukan Owner)
      </label>
      {override && (
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Alasan override"
          style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #c7c8cf', fontSize: '0.8rem', fontFamily: f, marginBottom: '10px', boxSizing: 'border-box' }}
        />
      )}

      {data.creatorStages.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.82rem', color: '#191c20', marginBottom: '10px' }}>Sub-Tahap per Creator</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {data.creatorStages.map((c) => (
              <div key={c.applicationId} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8f9ff', borderRadius: '8px', fontSize: '0.78rem', fontFamily: f }}>
                <span>{c.creatorName}</span>
                <span style={{ color: '#6728e4', fontWeight: 700 }}>{SUB_STAGE_LABELS[c.subStage] || c.subStage}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setShowHistory((v) => !v)}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#6728e4', fontSize: '0.78rem', fontWeight: 700, fontFamily: f, marginTop: '16px', padding: 0 }}
      >
        <History size={13} /> {showHistory ? 'Sembunyikan' : 'Lihat'} Riwayat Transisi
      </button>
      {showHistory && (
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {data.history.length === 0 && <p style={{ fontSize: '0.78rem', color: '#8a8a99', fontFamily: f }}>Belum ada riwayat.</p>}
          {data.history.map((h) => (
            <div key={h._id} style={{ fontSize: '0.76rem', color: '#464652', fontFamily: f, borderBottom: '1px solid #f0f0f0', paddingBottom: '6px' }}>
              <strong>{STAGE_LABELS[h.fromStage]}</strong> → <strong>{STAGE_LABELS[h.toStage]}</strong>
              {h.isOverride && <span style={{ color: '#ba1a1a' }}> (override)</span>}
              {' '}— {h.byUserId?.name || h.byRole} · {new Date(h.createdAt).toLocaleString('id-ID')}
              {h.reason && h.reason !== 'auto' && <div style={{ color: '#8a8a99' }}>Alasan: {h.reason}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
