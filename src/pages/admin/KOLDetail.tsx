import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Play, MessageCircle } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import { erRating, calcEngagement, calcViewRate } from '../../utils/engagement';
import api from '../../lib/api';

interface SocialPlatform {
  username?: string;
  channel?: string;
  followers?: number;
  subscribers?: number;
  avgLike?: number;
  avgComment?: number;
  avgViews?: number;
}

interface KOLData {
  _id: string;
  namaLengkap: string;
  whatsapp: string;
  email: string;
  kota: string;
  tanggalLahir: string;
  jenisKelamin: string;
  niche: string[];
  socialMedia: {
    instagram?: SocialPlatform;
    tiktok?: SocialPlatform;
    youtube?: SocialPlatform;
  };
  rateCard?: string;
  portfolioLink?: string;
  pengalaman?: string;
  fotoProfil?: string;
  status: string;
  catatanKurasi?: string;
  keputusan?: string;
  alasanReject?: string;
  engagementRate?: number;
  createdAt: string;
}

const cardStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: '16px',
  padding: '24px',
  border: '1px solid #F0EEFF',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '10px',
  border: '1.5px solid #E0DCFF',
  fontSize: '0.875rem',
  outline: 'none',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  background: 'white',
  color: '#120E28',
  resize: 'vertical' as const,
};

export default function KOLDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kol, setKol] = useState<KOLData | null>(null);
  const [loading, setLoading] = useState(true);
  const [catatan, setCatatan] = useState('');
  const [keputusan, setKeputusan] = useState('');
  const [alasan, setAlasan] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get(`/admin/kols/${id}`)
      .then((res) => {
        setKol(res.data);
        setCatatan(res.data.catatanKurasi || '');
        setKeputusan(res.data.keputusan || '');
        setAlasan(res.data.alasanReject || '');
      })
      .catch(() => navigate('/admin/kols'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const save = async () => {
    setSaving(true);
    try {
      const body: Record<string, string> = { catatanKurasi: catatan, keputusan };
      if (keputusan === 'rejected') body.alasanReject = alasan;
      const statusMap: Record<string, string> = { approved: 'approved', rejected: 'rejected' };
      if (statusMap[keputusan]) body.status = statusMap[keputusan];
      else body.status = 'reviewing';
      await api.patch(`/admin/kols/${id}`, body);
      setKol((prev) => (prev ? { ...prev, ...body } : prev));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Gagal menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  const openWALink = async (type: 'approve' | 'reject') => {
    try {
      const res = await api.get(`/admin/kols/${id}/wa-link?type=${type}`);
      window.open(res.data.link, '_blank');
    } catch {
      alert('Gagal membuat link WA.');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#8B87A8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Memuat...</div>;
  if (!kol) return null;

  const sm = kol.socialMedia || {};
  const igER = sm.instagram ? calcEngagement(sm.instagram.followers || 0, sm.instagram.avgLike || 0, sm.instagram.avgComment || 0) : 0;
  const ttER = sm.tiktok ? calcEngagement(sm.tiktok.followers || 0, sm.tiktok.avgLike || 0, sm.tiktok.avgComment || 0) : 0;
  const ytVR = sm.youtube ? calcViewRate(sm.youtube.subscribers || 0, sm.youtube.avgViews || 0) : 0;

  const StatCard = ({ label, value, color }: { label: string; value: string | number; color?: string }) => (
    <div style={{ background: '#F8F7FF', borderRadius: '10px', padding: '14px', textAlign: 'center', border: '1px solid #F0EEFF' }}>
      <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 800, color: color || '#120E28' }}>{value}</p>
      <p style={{ fontSize: '0.72rem', color: '#8B87A8', marginTop: '2px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{label}</p>
    </div>
  );

  return (
    <div>
      <button
        onClick={() => navigate('/admin/kols')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#8B87A8', fontSize: '0.875rem', marginBottom: '24px', padding: 0, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        <ArrowLeft size={16} />
        Kembali ke KOLs
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }} className="detail-grid">
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Profile card */}
          <div style={cardStyle}>
            {/* Top gradient bar */}
            <div style={{ height: '3px', background: 'linear-gradient(135deg, #6B2EE8, #E8197A)', borderRadius: '2px', marginBottom: '24px' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              {kol.fotoProfil ? (
                <img
                  src={`/uploads/${kol.fotoProfil}`}
                  alt={kol.namaLengkap}
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 800,
                    fontSize: '1.5rem',
                    color: 'white',
                    flexShrink: 0,
                  }}
                >
                  {kol.namaLengkap[0]}
                </div>
              )}
              <div>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: '#120E28' }}>
                  {kol.namaLengkap}
                </h2>
                <p style={{ color: '#8B87A8', fontSize: '0.875rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {kol.kota} · {kol.jenisKelamin}
                </p>
                <div style={{ marginTop: '6px' }}><StatusBadge status={kol.status} /></div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'WhatsApp', val: kol.whatsapp },
                { label: 'Email', val: kol.email },
                { label: 'Lahir', val: kol.tanggalLahir ? new Date(kol.tanggalLahir).toLocaleDateString('id-ID') : '—' },
              ].map((f) => (
                <div key={f.label} style={{ fontSize: '0.8rem' }}>
                  <p style={{ color: '#8B87A8', marginBottom: '2px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{f.label}</p>
                  <p style={{ fontWeight: 600, color: '#120E28', fontFamily: 'Plus Jakarta Sans, sans-serif', wordBreak: 'break-all' }}>{f.val}</p>
                </div>
              ))}
            </div>

            <div>
              <p style={{ fontSize: '0.7rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#8B87A8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Niche
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(kol.niche || []).map((n) => (
                  <span
                    key={n}
                    style={{ background: '#F0EEFF', color: '#6B2EE8', borderRadius: '999px', padding: '4px 12px', fontSize: '0.78rem', fontFamily: 'Syne, sans-serif', fontWeight: 700 }}
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Instagram */}
          {sm.instagram && (
            <div style={{ ...cardStyle, border: '1px solid #FEE2E2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Camera size={18} color="#E8197A" />
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#E8197A' }}>
                  Instagram — @{sm.instagram.username}
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <StatCard label="Followers" value={(sm.instagram.followers || 0).toLocaleString()} />
                <StatCard label="Avg. Like" value={(sm.instagram.avgLike || 0).toLocaleString()} />
                <StatCard label="Avg. Comment" value={(sm.instagram.avgComment || 0).toLocaleString()} />
                <StatCard label="ER%" value={`${igER}%`} color={erRating(igER).color} />
              </div>
            </div>
          )}

          {/* TikTok */}
          {sm.tiktok && (
            <div style={{ ...cardStyle, border: '1px solid #BBF7D0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#065F46' }}>
                  TikTok — @{sm.tiktok.username}
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <StatCard label="Followers" value={(sm.tiktok.followers || 0).toLocaleString()} />
                <StatCard label="Avg. Like" value={(sm.tiktok.avgLike || 0).toLocaleString()} />
                <StatCard label="Avg. Views" value={(sm.tiktok.avgViews || 0).toLocaleString()} />
                <StatCard label="ER%" value={`${ttER}%`} color={erRating(ttER).color} />
              </div>
            </div>
          )}

          {/* YouTube */}
          {sm.youtube && (
            <div style={{ ...cardStyle, border: '1px solid #FED7AA' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Play size={18} color="#C2410C" />
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#C2410C' }}>
                  YouTube — {sm.youtube.channel}
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <StatCard label="Subscribers" value={(sm.youtube.subscribers || 0).toLocaleString()} />
                <StatCard label="Avg. Views" value={(sm.youtube.avgViews || 0).toLocaleString()} />
                <StatCard label="View Rate" value={`${ytVR}%`} color="#C2410C" />
              </div>
            </div>
          )}

          {/* Additional info */}
          {(kol.rateCard || kol.portfolioLink || kol.pengalaman) && (
            <div style={cardStyle}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#120E28', marginBottom: '16px' }}>
                Informasi Tambahan
              </h3>
              {kol.rateCard && (
                <p style={{ marginBottom: '8px', fontSize: '0.875rem', color: '#120E28', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  <strong>Rate Card:</strong> {kol.rateCard}
                </p>
              )}
              {kol.portfolioLink && (
                <p style={{ marginBottom: '8px', fontSize: '0.875rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  <strong style={{ color: '#120E28' }}>Portfolio:</strong>{' '}
                  <a href={kol.portfolioLink} target="_blank" rel="noopener noreferrer" style={{ color: '#6B2EE8' }}>
                    {kol.portfolioLink}
                  </a>
                </p>
              )}
              {kol.pengalaman && (
                <p style={{ fontSize: '0.875rem', color: '#8B87A8', lineHeight: 1.7, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  <strong style={{ color: '#120E28' }}>Pengalaman:</strong> {kol.pengalaman}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right: Curation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={cardStyle}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#120E28', marginBottom: '20px' }}>
              Kurasi KOL
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#120E28', marginBottom: '6px' }}>
                Catatan Kurasi
              </label>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                rows={4}
                placeholder="Catatan internal dari tim kurasi..."
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: keputusan === 'rejected' ? '16px' : '20px' }}>
              <label style={{ display: 'block', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#120E28', marginBottom: '6px' }}>
                Keputusan
              </label>
              <select
                value={keputusan}
                onChange={(e) => setKeputusan(e.target.value)}
                style={{ ...inputStyle, resize: undefined, cursor: 'pointer' }}
              >
                <option value="">Belum diputuskan</option>
                <option value="approved">Disetujui</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>

            {keputusan === 'rejected' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#120E28', marginBottom: '6px' }}>
                  Alasan Penolakan
                </label>
                <textarea
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  rows={3}
                  placeholder="Tuliskan alasan penolakan..."
                  style={{ ...inputStyle, borderColor: '#EF4444' }}
                />
              </div>
            )}

            <button
              onClick={save}
              disabled={saving}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', opacity: saving ? 0.7 : 1, marginBottom: '12px' }}
            >
              {saved ? 'Tersimpan!' : saving ? 'Menyimpan...' : 'Simpan Kurasi'}
            </button>

            {keputusan === 'approved' && (
              <button
                onClick={() => openWALink('approve')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#25D366',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '12px',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <MessageCircle size={16} />
                Kirim Approval via WhatsApp
              </button>
            )}
            {keputusan === 'rejected' && (
              <button
                onClick={() => openWALink('reject')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#EF4444',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '12px',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <MessageCircle size={16} />
                Kirim Penolakan via WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
