import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import api from '../../lib/api';

const f = "var(--font-display)";
const thStyle: React.CSSProperties = {
  padding: '14px 16px', textAlign: 'left', fontFamily: f,
  fontWeight: 700, color: '#191c20', fontSize: '0.78rem', whiteSpace: 'nowrap', letterSpacing: '0.04em',
};
const tdStyle: React.CSSProperties = {
  padding: '14px 16px', fontSize: '0.875rem', color: '#464652', fontFamily: f,
};

interface PicCampaignRef { _id: string; name: string }
interface PicUserItem {
  _id: string; name: string; email: string; phone: string;
  campaignIds: PicCampaignRef[]; createdAt: string;
}

export default function PicUsers() {
  const [picUsers, setPicUsers] = useState<PicUserItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPicUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/pic');
      setPicUsers(res.data);
    } catch {
      setPicUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void fetchPicUsers(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button onClick={fetchPicUsers} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', borderRadius: '10px', border: '1.5px solid #c7c8cf', background: 'white', cursor: 'pointer', color: '#777683' }}>
          <RefreshCw size={16} />
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e1e0ff', overflow: 'hidden', boxShadow: '0 2px 12px rgba(107,46,232,0.06)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8f9ff', borderBottom: '1px solid #e1e0ff' }}>
                {['Nama MG', 'WhatsApp', 'Email', 'Campaign', 'Tanggal Daftar'].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ ...tdStyle, textAlign: 'center', padding: '48px' }}>Memuat...</td></tr>
              ) : picUsers.length === 0 ? (
                <tr><td colSpan={5} style={{ ...tdStyle, textAlign: 'center', padding: '48px' }}>Belum ada akun PIC yang sign up.</td></tr>
              ) : picUsers.map((p, i) => (
                <tr
                  key={p._id}
                  style={{ borderBottom: '1px solid #e1e0ff', background: i % 2 === 0 ? 'white' : '#fcfcff' }}
                >
                  <td style={{ ...tdStyle, fontWeight: 600, color: '#191c20' }}>{p.name}</td>
                  <td style={tdStyle}>{p.phone}</td>
                  <td style={tdStyle}>{p.email}</td>
                  <td style={tdStyle}>
                    {p.campaignIds.length === 0 ? (
                      <span style={{ color: '#8a8a99' }}>Belum ada campaign</span>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {p.campaignIds.map((c) => (
                          <span key={c._id} style={{ background: '#e1e0ff', color: '#6728e4', borderRadius: '999px', padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            {c.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td style={tdStyle}>{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid #e1e0ff', color: '#777683', fontSize: '0.78rem', fontFamily: f }}>
          {picUsers.length} akun PIC/Handle-by
        </div>
      </div>
    </div>
  );
}
