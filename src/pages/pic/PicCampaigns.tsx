import { stageLabel } from '../../lib/stages';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Copy, Check, Users, Wallet, Megaphone, Trophy, Landmark, MessageCircle } from 'lucide-react';
import picApi from '../../lib/picApi';

const f = "var(--font-display)";
const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)',
};
const rp = (n: number) => `Rp${n.toLocaleString('id-ID')}`;

interface PicCampaign {
  _id: string; name: string; status: string; workflowStage: string;
  brandId?: { namaBrand?: string };
  applyOpen: boolean; applyUrl?: string;
  registrants: number; creators: number; picFee: number; totalFee: number; paid: boolean;
}
interface Leaderboard { top: { rank: number; name: string; count: number; me: boolean }[]; me: { rank: number; count: number } | null }

export default function PicCampaigns() {
  const [campaigns, setCampaigns] = useState<PicCampaign[]>([]);
  const [board, setBoard] = useState<Leaderboard | null>(null);
  const [hasBank, setHasBank] = useState(true);
  const [groupLink, setGroupLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    picApi.get('/pic/campaigns').then((r) => setCampaigns(r.data)).catch(() => setError('Gagal memuat campaign.')).finally(() => setLoading(false));
    picApi.get('/pic/leaderboard').then((r) => setBoard(r.data)).catch(() => setBoard(null));
    picApi.get('/pic/me').then((r) => { setHasBank(Boolean(r.data.paymentInfo?.accountNumber)); setGroupLink(r.data.picGroupLink || ''); }).catch(() => undefined);
  }, []);

  const copy = async (c: PicCampaign) => {
    if (!c.applyUrl) return;
    try {
      await navigator.clipboard.writeText(c.applyUrl);
      setCopied(c._id);
      setTimeout(() => setCopied(null), 2000);
    } catch { setError('Gagal menyalin link.'); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#777683' }}>Memuat...</div>;

  const creators = campaigns.reduce((a, c) => a + c.creators, 0);
  const paidFee = campaigns.filter((c) => c.paid).reduce((a, c) => a + c.totalFee, 0);
  const unpaidFee = campaigns.filter((c) => !c.paid).reduce((a, c) => a + c.totalFee, 0);
  const stats = [
    { label: 'Campaign buka pendaftaran', value: String(campaigns.filter((c) => c.applyOpen).length), icon: Megaphone },
    { label: 'Creator lolos (semua campaign)', value: String(creators), icon: Users },
    { label: 'Fee belum dibayar', value: rp(unpaidFee), icon: Wallet },
    { label: 'Fee sudah dibayar', value: rp(paidFee), icon: Check },
  ];

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      {error && <p role="alert" style={{ color: '#ba1a1a', fontFamily: f, fontSize: '0.84rem' }}>{error}</p>}
      {groupLink && (
        <a href={groupLink} target="_blank" rel="noopener noreferrer" style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '10px', background: '#e9fbe9', borderColor: '#9be29b', textDecoration: 'none', color: '#146c2e', fontFamily: f, fontSize: '0.86rem' }}>
          <MessageCircle size={18} style={{ flexShrink: 0 }} />
          <span style={{ flex: 1 }}><b>Gabung Grup WhatsApp PIC Azera</b> · info job & pembayaran. Klik untuk minta bergabung, admin akan menyetujui.</span>
          <ExternalLink size={15} />
        </a>
      )}
      {!hasBank && (
        <Link to="/pic/profile" style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '10px', background: '#fff7e6', borderColor: '#ffd591', textDecoration: 'none', color: '#8a5300', fontFamily: f, fontSize: '0.86rem' }}>
          <Landmark size={18} style={{ flexShrink: 0 }} /> Rekening/e-wallet belum diisi. Isi di Profil & Rekening supaya fee PIC bisa ditransfer.
        </Link>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} style={cardStyle}>
            <Icon size={18} color="#6728e4" />
            <p style={{ fontFamily: f, fontWeight: 800, fontSize: '1.3rem', color: '#191c20', marginTop: '8px' }}>{value}</p>
            <p style={{ fontFamily: f, fontSize: '0.76rem', color: '#777683' }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{ flex: '2 1 420px', minWidth: 0, display: 'grid', gap: '12px' }}>
          {campaigns.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center', color: '#777683', padding: '48px', fontFamily: f, fontSize: '0.88rem' }}>
              Belum ada campaign. Begitu admin menambahkan kamu sebagai PIC di sebuah campaign, campaign itu muncul di sini.
            </div>
          ) : campaigns.map((c) => (
            <div key={c._id} style={{ ...cardStyle, display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap' }}>
                <Link to={`/pic/campaigns/${c._id}`} style={{ textDecoration: 'none', minWidth: 0 }}>
                  <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem', color: '#191c20', display: 'flex', alignItems: 'center', gap: '6px' }}>{c.name} <ExternalLink size={14} color="#8a8a99" /></p>
                  <p style={{ fontFamily: f, fontSize: '0.8rem', color: '#777683', marginTop: '2px' }}>{c.brandId?.namaBrand || '-'}</p>
                </Link>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ background: '#e1e0ff', color: '#6728e4', borderRadius: '999px', padding: '5px 12px', fontSize: '0.72rem', fontWeight: 700 }}>{stageLabel(c.workflowStage)}</span>
                  {c.totalFee > 0 && (
                    <span style={{ background: c.paid ? '#d1fae5' : '#fff1f0', color: c.paid ? '#065F46' : '#a8071a', borderRadius: '999px', padding: '5px 12px', fontSize: '0.72rem', fontWeight: 700 }}>
                      {c.paid ? 'Fee sudah dibayar' : 'Fee belum dibayar'}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px 20px', flexWrap: 'wrap', fontFamily: f, fontSize: '0.82rem', color: '#464652' }}>
                <span>Pendaftar dari kamu: <b>{c.registrants}</b></span>
                <span>Lolos: <b>{c.creators}</b></span>
                <span>Fee PIC: <b>{c.picFee ? `${rp(c.picFee)} × ${c.creators} = ${rp(c.totalFee)}` : '-'}</b></span>
              </div>
              {c.applyUrl ? (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#f8f7ff', borderRadius: '10px', padding: '8px 10px' }}>
                  <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: f, fontSize: '0.8rem', color: '#6728e4' }}>{c.applyUrl}</span>
                  <button onClick={() => void copy(c)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '999px', border: '1px solid #c9b6f7', background: 'white', color: '#6728e4', fontSize: '0.76rem', fontWeight: 700, fontFamily: f, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {copied === c._id ? <Check size={13} /> : <Copy size={13} />} {copied === c._id ? 'Tersalin' : 'Copy link daftar'}
                  </button>
                </div>
              ) : (
                <p style={{ fontFamily: f, fontSize: '0.78rem', color: '#9a99a6' }}>Pendaftaran sedang ditutup.</p>
              )}
            </div>
          ))}
        </div>

        {board && board.top.length > 0 && (
          <div style={{ ...cardStyle, flex: '1 1 260px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Trophy size={18} color="#d48806" />
              <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem', color: '#191c20' }}>Top PIC Bulan Ini</p>
            </div>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '6px' }}>
              {board.top.map((r) => (
                <li key={r.rank} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', padding: '7px 10px', borderRadius: '10px', background: r.me ? '#f0eeff' : 'transparent', fontFamily: f, fontSize: '0.84rem', color: '#191c20', fontWeight: r.me ? 700 : 500 }}>
                  <span>{r.rank}. {r.name}{r.me ? ' (kamu)' : ''}</span>
                  <span style={{ color: '#6728e4', whiteSpace: 'nowrap' }}>{r.count} pendaftar</span>
                </li>
              ))}
            </ol>
            {board.me && board.me.rank > board.top.length && (
              <p style={{ fontFamily: f, fontSize: '0.8rem', color: '#464652', marginTop: '10px' }}>Peringkat kamu: #{board.me.rank} ({board.me.count} pendaftar)</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
