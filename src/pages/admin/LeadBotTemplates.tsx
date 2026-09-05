import { useEffect, useState } from 'react';
import { Save, Lock } from 'lucide-react';
import api from '../../lib/api';

const f = "var(--font-display)";
const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)', marginBottom: '16px',
};

interface LeadBotTemplateItem {
  trigger: string;
  body: string;
  label: string;
  description: string;
  placeholders: string[];
}

interface LockedReference {
  templateBlock: string;
  jasaOptions: string[];
  budgetOptions: string[];
}

export default function LeadBotTemplates() {
  const [templates, setTemplates] = useState<LeadBotTemplateItem[]>([]);
  const [locked, setLocked] = useState<LockedReference | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingTrigger, setSavingTrigger] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const res = await api.get('/admin/lead-bot-templates');
      setTemplates(res.data.templates);
      setLocked(res.data.lockedReference);
      const d: Record<string, string> = {};
      for (const t of res.data.templates as LeadBotTemplateItem[]) d[t.trigger] = t.body;
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
      await api.patch(`/admin/lead-bot-templates/${trigger}`, { body: drafts[trigger] });
      setMessage('Template disimpan.');
      setTimeout(() => setMessage(''), 2000);
    } finally {
      setSavingTrigger(null);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#777683' }}>Memuat...</div>;

  return (
    <div>
      <h1 style={{ fontFamily: f, fontWeight: 800, fontSize: '1.3rem', color: '#191c20', marginBottom: '8px' }}>Template Bot WhatsApp (Lead Masuk)</h1>
      <p style={{ fontFamily: f, fontSize: '0.85rem', color: '#777683', marginBottom: '20px' }}>
        Pesan yang dibalas otomatis bot saat ada orang chat nomor WhatsApp bisnis (pilihan Brand/KOL/Support) — beda dari Template Pesan di menu sebelah, yang itu untuk notifikasi ke creator/client yang sudah terdaftar.
      </p>
      {message && (
        <div style={{ background: '#d1fae5', color: '#065F46', borderRadius: '10px', padding: '10px 16px', marginBottom: '16px', fontSize: '0.82rem', fontFamily: f }}>
          {message}
        </div>
      )}

      {templates.map((t) => (
        <div key={t.trigger} style={cardStyle}>
          <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.88rem', color: '#191c20', marginBottom: '4px' }}>
            {t.label}
          </p>
          <p style={{ fontFamily: f, fontSize: '0.78rem', color: '#777683', marginBottom: '10px', lineHeight: 1.5 }}>
            {t.description}
          </p>
          {t.placeholders.length > 0 && (
            <p style={{ fontFamily: f, fontSize: '0.75rem', color: '#6728e4', marginBottom: '10px' }}>
              Placeholder: {t.placeholders.map((p) => `{{${p}}}`).join(', ')}
            </p>
          )}
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

      {locked && (
        <div style={{ marginTop: '28px' }}>
          <h2 style={{ fontFamily: f, fontWeight: 800, fontSize: '1.05rem', color: '#191c20', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={16} color="#ba1a1a" /> Bagian yang Tidak Bisa Diubah
          </h2>
          <p style={{ fontFamily: f, fontSize: '0.8rem', color: '#777683', marginBottom: '14px', lineHeight: 1.6 }}>
            Bot membaca balasan Brand dengan mencocokkan teks label ini secara persis. Kalau diubah, bot bisa gagal total menyimpan data yang dikirim Brand — jadi bagian ini tampil sebagai referensi saja, bukan form edit.
          </p>

          <div style={{ ...cardStyle, background: '#faf9fc', border: '1.5px dashed #c7c8cf' }}>
            <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.85rem', color: '#191c20', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={13} color="#ba1a1a" /> Label Field Template Brand
            </p>
            <pre style={{
              fontFamily: 'monospace', fontSize: '0.8rem', color: '#464652', background: 'white',
              border: '1px solid #e1e0ff', borderRadius: '10px', padding: '14px', whiteSpace: 'pre-wrap', margin: 0,
            }}>
              {locked.templateBlock}
            </pre>
          </div>

          <div style={{ ...cardStyle, background: '#faf9fc', border: '1.5px dashed #c7c8cf' }}>
            <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.85rem', color: '#191c20', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={13} color="#ba1a1a" /> Pilihan Jasa
            </p>
            {locked.jasaOptions.map((o) => (
              <p key={o} style={{ fontFamily: f, fontSize: '0.82rem', color: '#464652', margin: '4px 0' }}>{o}</p>
            ))}
          </div>

          <div style={{ ...cardStyle, background: '#faf9fc', border: '1.5px dashed #c7c8cf' }}>
            <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.85rem', color: '#191c20', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={13} color="#ba1a1a" /> Pilihan Budget
            </p>
            {locked.budgetOptions.map((o) => (
              <p key={o} style={{ fontFamily: f, fontSize: '0.82rem', color: '#464652', margin: '4px 0' }}>{o}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
