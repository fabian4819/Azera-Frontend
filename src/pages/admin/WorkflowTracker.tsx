import { useEffect, useState } from 'react';
import { History, PlayCircle, XCircle } from 'lucide-react';
import api from '../../lib/api';
import { STAGE_ORDER, STAGE_LABELS, stageLabel } from '../../lib/stages';

const f = "var(--font-display)";
const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)', marginBottom: '20px',
};

interface WorkflowData {
  workflowStage: string;
  history: { _id: string; fromStage: string; toStage: string; byUserId?: { name: string }; byRole: string; reason?: string; createdAt: string }[];
}

/** Progress campaign 5 tahap (+ Ditolak). Admin klik pill tahap untuk memindahkan (maju/mundur bebas). */
export default function WorkflowTracker({ campaignId, stage, onChanged, decide }: {
  campaignId: string;
  /** Form pendaftaran sudah ditutup & masih Listing → tampilkan tombol cepat Ditolak / Running di header */
  decide?: boolean;
  /** Tahap dari parent (CampaignDetail) supaya tombol Running/Ditolak di Overview & tracker ini selalu sinkron */
  stage: string;
  onChanged: (stage: string) => void;
}) {
  const [history, setHistory] = useState<WorkflowData['history']>([]);
  const [transitioning, setTransitioning] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [actionError, setActionError] = useState('');

  const load = async () => {
    const res = await api.get<WorkflowData>(`/admin/campaigns/${campaignId}/workflow`);
    setHistory(res.data.history);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId, stage]);

  // Klik pill = pindah ke tahap itu (maju/mundur bebas)
  const transition = async (toStage: string) => {
    if (toStage === stage || transitioning) return;
    setTransitioning(toStage);
    setActionError('');
    try {
      const res = await api.post(`/admin/campaigns/${campaignId}/workflow/transition`, { toStage });
      onChanged(res.data.workflowStage);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setActionError(message || 'Gagal memindahkan tahap.');
    } finally {
      setTransitioning(null);
    }
  };

  const rejected = stage === 'rejected';
  const currentIndex = rejected ? -1 : STAGE_ORDER.indexOf(stage as (typeof STAGE_ORDER)[number]);

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <p style={{ fontFamily: f, fontWeight: 700, fontSize: '1rem', color: '#191c20' }}>Progress Campaign</p>
        {decide && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={() => void transition('rejected')} disabled={Boolean(transitioning)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1.5px solid #ba1a1a', background: 'white', color: '#ba1a1a', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: f, opacity: transitioning ? 0.6 : 1 }}>
              <XCircle size={14} /> Ditolak
            </button>
            <button type="button" onClick={() => void transition('running')} disabled={Boolean(transitioning)} className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.8rem', opacity: transitioning ? 0.6 : 1 }}>
              <PlayCircle size={14} /> Running
            </button>
          </div>
        )}
      </div>

      {actionError && (
        <div style={{ background: '#ffdad6', color: '#ba1a1a', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', fontSize: '0.8rem', fontFamily: f }}>
          {actionError}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
        {STAGE_ORDER.map((s, i) => {
          const current = i === currentIndex;
          const done = !rejected && i < currentIndex;
          return (
            <span key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {i > 0 && <span style={{ width: '18px', height: '2px', background: !rejected && i <= currentIndex ? '#6728e4' : '#e1e0ff' }} />}
              <button
                type="button" onClick={() => void transition(s)} disabled={current || Boolean(transitioning)}
                title={current ? 'Tahap saat ini' : `Pindahkan ke ${STAGE_LABELS[s]}`}
                style={{
                  padding: '7px 16px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, fontFamily: f, border: 'none',
                  cursor: current ? 'default' : transitioning ? 'wait' : 'pointer',
                  background: current ? '#6728e4' : done ? '#e1e0ff' : '#f0f0f5',
                  color: current ? 'white' : done ? '#6728e4' : '#8a8a99',
                  opacity: transitioning && transitioning !== s ? 0.6 : 1,
                }}
              >
                {transitioning === s ? 'Memindahkan...' : STAGE_LABELS[s]}
              </button>
            </span>
          );
        })}
        <span style={{ width: '1px', height: '24px', background: '#e1e0ff', margin: '0 6px' }} />
        <button
          type="button" onClick={() => void transition('rejected')} disabled={rejected || Boolean(transitioning)}
          title={rejected ? 'Campaign ditolak' : 'Tandai campaign ditolak'}
          style={{
            padding: '7px 16px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, fontFamily: f,
            border: rejected ? 'none' : '1.5px solid #ffdad6', cursor: rejected ? 'default' : 'pointer',
            background: rejected ? '#ba1a1a' : 'white', color: rejected ? 'white' : '#ba1a1a',
          }}
        >
          {transitioning === 'rejected' ? 'Memindahkan...' : 'Ditolak'}
        </button>
      </div>

      <button
        onClick={() => setShowHistory((v) => !v)}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#6728e4', fontSize: '0.78rem', fontWeight: 700, fontFamily: f, marginTop: '16px', padding: 0 }}
      >
        <History size={13} /> {showHistory ? 'Sembunyikan' : 'Lihat'} Riwayat
      </button>
      {showHistory && (
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {history.length === 0 && <p style={{ fontSize: '0.78rem', color: '#8a8a99', fontFamily: f }}>Belum ada riwayat.</p>}
          {history.map((h) => (
            <div key={h._id} style={{ fontSize: '0.76rem', color: '#464652', fontFamily: f, borderBottom: '1px solid #f0f0f0', paddingBottom: '6px' }}>
              <strong>{stageLabel(h.fromStage)}</strong> → <strong>{stageLabel(h.toStage)}</strong>
              {' '}· {h.byUserId?.name || h.byRole} · {new Date(h.createdAt).toLocaleString('id-ID')}
              {h.reason && h.reason !== 'auto' && <div style={{ color: '#8a8a99' }}>Catatan: {h.reason}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
