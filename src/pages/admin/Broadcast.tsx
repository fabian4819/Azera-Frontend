import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Megaphone, ArrowLeft } from 'lucide-react';
import api from '../../lib/api';

const f = "var(--font-display)";
const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)', marginBottom: '20px',
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #c7c8cf',
  fontSize: '0.85rem', fontFamily: f, marginBottom: '14px', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem', fontWeight: 700, color: '#464652', marginBottom: '6px', display: 'block', fontFamily: f,
};

export default function Broadcast() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaignName, setCampaignName] = useState('');
  const [title, setTitle] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [location, setLocation] = useState('');
  const [schedule, setSchedule] = useState('');
  const [fee, setFee] = useState('');
  const [topPayment, setTopPayment] = useState('');
  const [syarat, setSyarat] = useState('');
  const [sow, setSow] = useState('');
  const [note, setNote] = useState('');
  const [pic, setPic] = useState('');
  const [recipientMode, setRecipientMode] = useState<'all' | 'manual'>('all');
  const [manualNumbers, setManualNumbers] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void api.get(`/admin/campaigns/${id}`).then((res) => {
        setCampaignName(res.data.name);
        setTitle((prev) => prev || res.data.name);
      });
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [id]);

  const send = async () => {
    setSending(true);
    setError('');
    setResult('');
    try {
      const res = await api.post(`/admin/campaigns/${id}/broadcast`, {
        title, urgent, location, schedule, fee, topPayment, syarat, sow, note, pic,
        recipients: recipientMode === 'all' ? 'all_creators' : manualNumbers.split(',').map((n) => n.trim()).filter(Boolean),
      });
      setResult(`Broadcast terkirim ke ${res.data.sent} nomor.`);
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data;
      setError(data?.error || data?.message || 'Gagal mengirim broadcast.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate(`/admin/campaigns/${id}`)}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#777683', fontSize: '0.875rem', marginBottom: '20px', padding: 0, fontFamily: f }}
      >
        <ArrowLeft size={16} /> Kembali ke Campaign
      </button>

      <h1 style={{ fontFamily: f, fontWeight: 800, fontSize: '1.3rem', color: '#191c20', marginBottom: '8px' }}>Broadcast Campaign</h1>
      {campaignName && <p style={{ fontFamily: f, fontSize: '0.85rem', color: '#777683', marginBottom: '20px' }}>Untuk campaign: <strong>{campaignName}</strong></p>}

      {result && <div style={{ background: '#d1fae5', color: '#065F46', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.82rem', fontFamily: f }}>{result}</div>}
      {error && <div style={{ background: '#ffdad6', color: '#ba1a1a', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.82rem', fontFamily: f }}>{error}</div>}

      <div style={cardStyle}>
        <label style={labelStyle}>Judul</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} placeholder="mis. Nano KOL IMBOOST" />

        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} /> Tandai Urgent
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Lokasi (untuk offline/event)</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} placeholder="mis. Mall X, Jakarta" />
          </div>
          <div>
            <label style={labelStyle}>Jadwal</label>
            <input value={schedule} onChange={(e) => setSchedule(e.target.value)} style={inputStyle} placeholder="mis. Sabtu 30 Agu, standby jam 09.00" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Fee</label>
            <input value={fee} onChange={(e) => setFee(e.target.value)} style={inputStyle} placeholder="mis. Rp350.000 + reimburse produk" />
          </div>
          <div>
            <label style={labelStyle}>TOP Payment</label>
            <input value={topPayment} onChange={(e) => setTopPayment(e.target.value)} style={inputStyle} placeholder="mis. H+7 setelah posting" />
          </div>
        </div>

        <label style={labelStyle}>Syarat</label>
        <textarea value={syarat} onChange={(e) => setSyarat(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="mis. Tier Nano, min followers 5rb, hijab friendly, anak boleh inframe" />

        <label style={labelStyle}>SOW</label>
        <textarea value={sow} onChange={(e) => setSow(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="mis. 1x Reels + 3x Story, wajib tag @azerakol.id" />

        <label style={labelStyle}>Catatan (opsional)</label>
        <input value={note} onChange={(e) => setNote(e.target.value)} style={inputStyle} placeholder="mis. jangan share di Threads" />

        <label style={labelStyle}>PIC</label>
        <input value={pic} onChange={(e) => setPic(e.target.value)} style={inputStyle} placeholder="mis. Azza (0812xxxxxxx)" />
      </div>

      <div style={cardStyle}>
        <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem', marginBottom: '14px' }}>Penerima</p>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer', fontFamily: f, fontSize: '0.85rem' }}>
          <input type="radio" checked={recipientMode === 'all'} onChange={() => setRecipientMode('all')} /> Semua creator approved
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', cursor: 'pointer', fontFamily: f, fontSize: '0.85rem' }}>
          <input type="radio" checked={recipientMode === 'manual'} onChange={() => setRecipientMode('manual')} /> Nomor manual (pisahkan koma)
        </label>
        {recipientMode === 'manual' && (
          <input value={manualNumbers} onChange={(e) => setManualNumbers(e.target.value)} style={inputStyle} placeholder="6281234567890, 6289876543210" />
        )}
        <button onClick={send} disabled={sending || !title || !fee || !syarat} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', opacity: sending || !title || !fee || !syarat ? 0.6 : 1 }}>
          <Megaphone size={15} /> {sending ? 'Mengirim...' : 'Kirim Broadcast'}
        </button>
      </div>
    </div>
  );
}
