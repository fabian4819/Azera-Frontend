import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import api from '../../lib/api';

interface BrandData {
  _id: string;
  namaBrand: string;
  namaPIC: string;
  whatsapp: string;
  email: string;
  website?: string;
  kategori: string;
  paket: string;
  targetAudience: string;
  budget: string;
  tujuan: string[];
  durasi: string;
  deskripsi: string;
  status: string;
  catatan?: string;
  createdAt: string;
}

const statusOptions = ['new', 'reviewed', 'contacted'];

const labelSmall: React.CSSProperties = {
  fontSize: '0.7rem',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontWeight: 700,
  color: '#777683',
  marginBottom: '4px',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const valueStyle: React.CSSProperties = {
  color: '#191c20',
  fontSize: '0.9rem',
  fontWeight: 500,
  fontFamily: 'Plus Jakarta Sans, sans-serif',
};

const cardStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: '16px',
  padding: '28px',
  border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '10px',
  border: '1.5px solid #c7c8cf',
  fontSize: '0.875rem',
  outline: 'none',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  background: 'white',
  color: '#191c20',
};

export default function BrandDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [catatan, setCatatan] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get(`/admin/brands/${id}`)
      .then((res) => {
        setBrand(res.data);
        setStatus(res.data.status);
        setCatatan(res.data.catatan || '');
      })
      .catch(() => navigate('/admin/brands'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const save = async () => {
    setSaving(true);
    try {
      await api.patch(`/admin/brands/${id}`, { status, catatan });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Gagal menyimpan. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#777683', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Memuat...</div>;
  if (!brand) return null;

  const Field = ({ label, value }: { label: string; value?: string }) => (
    <div>
      <p style={labelSmall}>{label}</p>
      <p style={valueStyle}>{value || '—'}</p>
    </div>
  );

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => navigate('/admin/brands')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#777683',
          fontSize: '0.875rem',
          marginBottom: '24px',
          padding: 0,
          fontFamily: 'Plus Jakarta Sans, sans-serif',
        }}
      >
        <ArrowLeft size={16} />
        Kembali ke Brands
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }} className="detail-grid">
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header card */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                {/* Gradient top accent */}
                <div style={{ width: '40px', height: '3px', background: 'linear-gradient(135deg, #6728e4, #ff81aa)', borderRadius: '2px', marginBottom: '12px' }} />
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: '#191c20', marginBottom: '4px' }}>
                  {brand.namaBrand}
                </h2>
                <p style={{ color: '#777683', fontSize: '0.8rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Diterima {new Date(brand.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <StatusBadge status={brand.status} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }} className="detail-fields">
              <Field label="PIC" value={brand.namaPIC} />
              <Field label="WhatsApp" value={brand.whatsapp} />
              <Field label="Email" value={brand.email} />
              <Field label="Website" value={brand.website} />
              <Field label="Kategori" value={brand.kategori} />
              <Field label="Paket" value={brand.paket} />
              <Field label="Budget" value={brand.budget} />
              <Field label="Durasi" value={brand.durasi} />
            </div>
          </div>

          {/* Campaign details */}
          <div style={cardStyle}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '20px' }}>
              Detail Kampanye
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Field label="Target Audience" value={brand.targetAudience} />
              <div>
                <p style={labelSmall}>Tujuan</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {(brand.tujuan || []).map((t) => (
                    <span
                      key={t}
                      style={{
                        background: '#e1e0ff',
                        color: '#6728e4',
                        borderRadius: '999px',
                        padding: '4px 12px',
                        fontSize: '0.78rem',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 700,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p style={labelSmall}>Deskripsi</p>
                <p style={{ color: '#191c20', fontSize: '0.9rem', lineHeight: 1.7, fontFamily: 'Plus Jakarta Sans, sans-serif', marginTop: '4px' }}>
                  {brand.deskripsi}
                </p>
              </div>
            </div>
          </div>

          {/* WA link */}
          <a
            href={`https://wa.me/${brand.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#25D366',
              color: 'white',
              borderRadius: '12px',
              padding: '14px 20px',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
            }}
          >
            <ExternalLink size={16} />
            Hubungi via WhatsApp
          </a>
        </div>

        {/* Right: Status + notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={cardStyle}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '20px' }}>
              Update Status
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#191c20', marginBottom: '6px' }}>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#191c20', marginBottom: '6px' }}>
                Catatan Internal
              </label>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                rows={5}
                placeholder="Tambahkan catatan internal..."
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>

            <button
              onClick={save}
              disabled={saving}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', opacity: saving ? 0.7 : 1 }}
            >
              {saved ? 'Tersimpan!' : saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
