import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import api from '../../lib/api';

const f = "var(--font-display)";
const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)', marginBottom: '16px',
};

interface WaTemplate {
  _id: string; trigger: string; audience: 'creator' | 'client'; body: string;
}

const TRIGGER_LABELS: Record<string, string> = {
  creator_accepted: 'Creator Diterima',
  creator_rejected: 'Creator Ditolak',
  brief_campaign: 'Brief Campaign',
  reminder_draft: 'Reminder Draft',
  reminder_upload: 'Reminder Upload',
  reminder_revision: 'Reminder Revisi',
  reminder_insight: 'Reminder Insight',
  reminder_payment_creator: 'Reminder Pembayaran Creator',
  payment_completed: 'Pembayaran Creator Selesai',
  invoice_new: 'Invoice Baru',
  invoice_paid: 'Invoice Terverifikasi',
  reminder_payment_client: 'Reminder Pembayaran Client',
  campaign_started: 'Campaign Dimulai',
  campaign_completed: 'Campaign Selesai',
  daily_progress_report: 'Daily Progress Report',
  broadcast_campaign: 'Broadcast Campaign',
};

export default function WaTemplates() {
  const [templates, setTemplates] = useState<WaTemplate[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingTrigger, setSavingTrigger] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const res = await api.get('/admin/wa-templates');
      setTemplates(res.data);
      const d: Record<string, string> = {};
      for (const t of res.data as WaTemplate[]) d[t.trigger] = t.body;
      setDrafts(d);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const save = async (trigger: string) => {
    setSavingTrigger(trigger);
    try {
      await api.patch(`/admin/wa-templates/${trigger}`, { body: drafts[trigger] });
      setMessage('Template disimpan.');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setSavingTrigger(null);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#777683' }}>Memuat...</div>;

  const creatorTemplates = templates.filter((t) => t.audience === 'creator');
  const clientTemplates = templates.filter((t) => t.audience === 'client');

  const renderGroup = (title: string, group: WaTemplate[]) => (
    <div style={{ marginBottom: '28px' }}>
      <h2 style={{ fontFamily: f, fontWeight: 800, fontSize: '1.05rem', color: '#191c20', marginBottom: '14px' }}>{title}</h2>
      {group.map((t) => (
        <div key={t.trigger} style={cardStyle}>
          <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.88rem', color: '#191c20', marginBottom: '10px' }}>
            {TRIGGER_LABELS[t.trigger] || t.trigger}
          </p>
          <textarea
            value={drafts[t.trigger] ?? ''}
            onChange={(e) => setDrafts((prev) => ({ ...prev, [t.trigger]: e.target.value }))}
            rows={4}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #c7c8cf', fontSize: '0.82rem', fontFamily: f, resize: 'vertical', outline: 'none', marginBottom: '10px', boxSizing: 'border-box' }}
          />
          <button
            onClick={() => save(t.trigger)}
            disabled={savingTrigger === t.trigger}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px', opacity: savingTrigger === t.trigger ? 0.6 : 1 }}
          >
            <Save size={13} /> {savingTrigger === t.trigger ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <h1 style={{ fontFamily: f, fontWeight: 800, fontSize: '1.3rem', color: '#191c20', marginBottom: '8px' }}>Template Pesan WhatsApp</h1>
      <p style={{ fontFamily: f, fontSize: '0.85rem', color: '#777683', marginBottom: '20px' }}>
        Placeholder tersedia: {'{{nama}}'}, {'{{campaign}}'}, {'{{password}}'}, {'{{grup_link}}'}, {'{{brief}}'}, {'{{invoice_number}}'}, {'{{bill_to}}'}, {'{{total}}'}, {'{{payment_link}}'}, {'{{pdf_url}}'}, dll — sesuaikan per trigger.
      </p>
      {message && (
        <div style={{ background: '#d1fae5', color: '#065F46', borderRadius: '10px', padding: '10px 16px', marginBottom: '16px', fontSize: '0.82rem', fontFamily: f }}>
          {message}
        </div>
      )}
      {renderGroup('Ke Creator/Talent', creatorTemplates)}
      {renderGroup('Ke Client', clientTemplates)}
    </div>
  );
}
