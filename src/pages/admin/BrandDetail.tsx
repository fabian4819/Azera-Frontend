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

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#8B87B0' }}>Memuat...</div>;
  if (!brand) return null;

  const Field = ({ label, value }: { label: string; value?: string }) => (
    <div>
      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8B87B0', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ color: '#1A1040', fontSize: '0.9rem', fontWeight: 500 }}>{value || '—'}</p>
    </div>
  );

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => navigate('/admin/brands')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#8B87B0', fontSize: '0.875rem', marginBottom: '24px', padding: 0 }}
      >
        <ArrowLeft size={16} />
        Kembali ke Brands
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }} className="detail-grid">
        {/* Left: Brand info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header card */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #F0EEFF' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#1A1040', marginBottom: '4px' }}>{brand.namaBrand}</h2>
                <p style={{ color: '#8B87B0', fontSize: '0.875rem' }}>
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
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #F0EEFF' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1A1040', marginBottom: '20px' }}>Detail Kampanye</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Field label="Target Audience" value={brand.targetAudience} />
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8B87B0', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tujuan</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(brand.tujuan || []).map((t) => (
                    <span key={t} style={{ background: '#F0EEFF', color: '#6B2EE8', borderRadius: '999px', padding: '4px 12px', fontSize: '0.8rem', fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8B87B0', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deskripsi</p>
                <p style={{ color: '#1A1040', fontSize: '0.9rem', lineHeight: 1.7 }}>{brand.deskripsi}</p>
              </div>
            </div>
          </div>

          {/* WA quick link */}
          <a
            href={`https://wa.me/${brand.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#25D366', color: 'white', borderRadius: '12px', padding: '14px 20px', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}
          >
            <ExternalLink size={16} />
            Hubungi via WhatsApp
          </a>
        </div>

        {/* Right: Status + notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #F0EEFF' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1A1040', marginBottom: '20px' }}>Update Status</h3>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#1A1040', marginBottom: '6px' }}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #E0DCFF', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', background: 'white', cursor: 'pointer' }}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#1A1040', marginBottom: '6px' }}>Catatan Internal</label>
              <textarea
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                rows={5}
                placeholder="Tambahkan catatan internal..."
                style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #E0DCFF', fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
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

      <style>{`
        @media (max-width: 900px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .detail-fields { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
