import { useEffect, useRef, useState } from 'react';
import { QrCode, CheckCircle2, LogOut, RefreshCw, Send } from 'lucide-react';
import api from '../../lib/api';

const f = "var(--font-display)";
const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)', marginBottom: '20px',
};

type WaStatus = 'disconnected' | 'connecting' | 'qr' | 'connected';

interface WaMessageLog {
  _id: string; trigger: string; to: string; payload: string;
  status: 'queued' | 'sent' | 'failed'; error?: string; createdAt: string;
}

export default function WhatsApp() {
  const [status, setStatus] = useState<WaStatus>('disconnected');
  const [connectedNumber, setConnectedNumber] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [logs, setLogs] = useState<WaMessageLog[]>([]);
  const [testTo, setTestTo] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [actionError, setActionError] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = async () => {
    const res = await api.get('/admin/whatsapp/status');
    setStatus(res.data.status);
    setConnectedNumber(res.data.connectedNumber);
    if (res.data.status === 'qr') {
      const qrRes = await api.get('/admin/whatsapp/qr');
      setQr(qrRes.data.qr);
    } else {
      setQr(null);
    }
  };

  const fetchLogs = async () => {
    const res = await api.get('/admin/whatsapp/logs');
    setLogs(res.data);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchStatus();
      void fetchLogs();
    }, 0);
    pollRef.current = setInterval(() => {
      void fetchStatus();
    }, 3000);
    return () => {
      window.clearTimeout(timeoutId);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const connect = async () => {
    setActionError('');
    try {
      await api.post('/admin/whatsapp/connect');
      await fetchStatus();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setActionError(message || 'Gagal memulai koneksi');
    }
  };

  const logout = async () => {
    setActionError('');
    try {
      await api.post('/admin/whatsapp/logout');
      await fetchStatus();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setActionError(message || 'Gagal logout');
    }
  };

  const sendTest = async () => {
    setActionError('');
    setSending(true);
    try {
      await api.post('/admin/whatsapp/test-send', { to: testTo, message: testMessage });
      setTestMessage('');
      await fetchLogs();
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data;
      setActionError(data?.error || data?.message || 'Gagal mengirim pesan');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontFamily: f, fontWeight: 800, fontSize: '1.3rem', color: '#191c20', marginBottom: '20px' }}>WhatsApp</h1>

      {actionError && (
        <div style={{ background: '#ffdad6', color: '#ba1a1a', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.82rem', fontFamily: f, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <span>{actionError}</span>
          <button onClick={() => setActionError('')} style={{ background: 'none', border: 'none', color: '#ba1a1a', cursor: 'pointer', fontWeight: 700, fontFamily: f, flexShrink: 0 }}>✕</button>
        </div>
      )}

      <div style={cardStyle}>
        <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem', marginBottom: '16px' }}>Status Koneksi</p>

        {status === 'connected' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={20} color="#065F46" />
              <div>
                <p style={{ fontFamily: f, fontWeight: 700, color: '#065F46' }}>Terhubung</p>
                <p style={{ fontFamily: f, fontSize: '0.82rem', color: '#464652' }}>{connectedNumber}</p>
              </div>
            </div>
            <button onClick={logout} className="btn-secondary" style={{ padding: '9px 18px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        )}

        {status === 'qr' && qr && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: f, fontSize: '0.85rem', color: '#464652', marginBottom: '14px' }}>
              Scan QR ini dengan WhatsApp (Perangkat Tertaut). Gunakan nomor testing dulu, ganti ke nomor resmi client nanti dengan Logout lalu scan ulang.
            </p>
            <img src={qr} alt="QR WhatsApp" style={{ width: '220px', height: '220px', border: '1px solid #e1e0ff', borderRadius: '12px' }} />
          </div>
        )}

        {status === 'connecting' && (
          <p style={{ fontFamily: f, fontSize: '0.85rem', color: '#464652' }}>Menghubungkan...</p>
        )}

        {status === 'disconnected' && (
          <div>
            <p style={{ fontFamily: f, fontSize: '0.85rem', color: '#464652', marginBottom: '14px' }}>Belum terhubung ke WhatsApp.</p>
            <button onClick={connect} className="btn-primary" style={{ padding: '9px 18px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <QrCode size={14} /> Hubungkan
            </button>
          </div>
        )}
      </div>

      {status === 'connected' && (
        <div style={cardStyle}>
          <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem', marginBottom: '16px' }}>Kirim Pesan Uji</p>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              placeholder="Nomor WA (mis. 6281234567890)"
              value={testTo}
              onChange={(e) => setTestTo(e.target.value)}
              style={{ flex: '0 0 240px', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e1e0ff', fontFamily: f, fontSize: '0.82rem' }}
            />
            <input
              placeholder="Isi pesan"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              style={{ flex: 1, padding: '9px 12px', borderRadius: '8px', border: '1px solid #e1e0ff', fontFamily: f, fontSize: '0.82rem' }}
            />
            <button onClick={sendTest} disabled={sending || !testTo || !testMessage} className="btn-primary" style={{ padding: '9px 18px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', opacity: sending || !testTo || !testMessage ? 0.6 : 1 }}>
              <Send size={14} /> {sending ? 'Mengirim...' : 'Kirim'}
            </button>
          </div>
        </div>
      )}

      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem' }}>Log Pesan</p>
          <button onClick={fetchLogs} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6728e4' }}>
            <RefreshCw size={16} />
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', fontFamily: f }}>
            <thead>
              <tr style={{ background: '#f8f9ff', textAlign: 'left' }}>
                {['Waktu', 'Trigger', 'Ke', 'Pesan', 'Status'].map((h) => (
                  <th key={h} style={{ padding: '8px 10px', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '8px 10px' }}>{new Date(l.createdAt).toLocaleString('id-ID')}</td>
                  <td style={{ padding: '8px 10px' }}>{l.trigger}</td>
                  <td style={{ padding: '8px 10px' }}>{l.to}</td>
                  <td style={{ padding: '8px 10px', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.payload}</td>
                  <td style={{ padding: '8px 10px' }}>
                    {l.status === 'sent' && <span style={{ color: '#065F46' }}>Terkirim</span>}
                    {l.status === 'queued' && <span style={{ color: '#92400E' }}>Antri</span>}
                    {l.status === 'failed' && <span style={{ color: '#ba1a1a' }} title={l.error}>Gagal</span>}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: '#8a8a99' }}>Belum ada pesan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
