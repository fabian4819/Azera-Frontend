import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, MessageCircle, ShieldCheck } from 'lucide-react';
import api from '../lib/api';
import { buildBrandWALink } from '../utils/whatsapp';

const schema = z.object({
  namaBrand: z.string().min(2, 'Nama brand wajib diisi'),
  namaPIC: z.string().min(2, 'Nama PIC wajib diisi'),
  whatsapp: z.string().min(8, 'WhatsApp wajib diisi'),
  email: z.string().email('Email tidak valid'),
  website: z.string().optional(),
  kategori: z.string().min(1, 'Kategori wajib dipilih'),
  paket: z.string().min(1, 'Paket wajib dipilih'),
  targetAudience: z.string().min(5, 'Target audience wajib diisi'),
  budget: z.string().min(1, 'Budget wajib dipilih'),
  tujuan: z.array(z.string()).min(1, 'Pilih minimal 1 tujuan'),
  durasi: z.string().min(1, 'Durasi wajib dipilih'),
  deskripsi: z.string().min(20, 'Deskripsi minimal 20 karakter'),
});

type FormData = z.infer<typeof schema>;

const tujuanOptions = ['Brand Awareness', 'Product Launch', 'Increase Sales', 'App Download', 'Followers Growth', 'Event Promotion'];
const kategoriOptions = ['Beauty & Skincare', 'Food & Beverage', 'Fashion', 'Tech & Gadget', 'Health & Fitness', 'Travel', 'Finance', 'Education', 'Home & Living', 'Other'];
const budgetOptions = ['< Rp 5 Juta', 'Rp 5–15 Juta', 'Rp 15–40 Juta', 'Rp 40–100 Juta', '> Rp 100 Juta'];
const durasiOptions = ['1 Minggu', '2 Minggu', '1 Bulan', '2 Bulan', '3 Bulan+'];
const paketOptions = ['starter', 'growth', 'scale'];

const inputStyle = (hasError?: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '12px 16px',
  borderRadius: '12px',
  border: `1.5px solid ${hasError ? '#EF4444' : '#E0DCFF'}`,
  fontSize: '0.9rem',
  color: '#120E28',
  background: 'white',
  outline: 'none',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  transition: 'border-color 0.2s',
});

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontWeight: 600,
  fontSize: '0.82rem',
  color: '#120E28',
  marginBottom: '6px',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
};

const errorStyle: React.CSSProperties = { color: '#EF4444', fontSize: '0.75rem', marginTop: '4px', fontFamily: 'Plus Jakarta Sans, sans-serif' };

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'Syne, sans-serif',
  fontWeight: 700,
  fontSize: '0.95rem',
  background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  marginBottom: '20px',
  paddingBottom: '12px',
  borderBottom: '1px solid #F0EEFF',
  marginTop: '8px',
};

export default function BrandForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tujuan: [] },
  });

  useEffect(() => {
    const paketParam = searchParams.get('paket');
    if (paketParam && paketOptions.includes(paketParam)) {
      setValue('paket', paketParam);
    }
  }, [searchParams, setValue]);

  const tujuanVal = watch('tujuan');

  const toggleTujuan = (val: string) => {
    const current = tujuanVal || [];
    if (current.includes(val)) {
      setValue('tujuan', current.filter((v) => v !== val));
    } else {
      setValue('tujuan', [...current, val]);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await api.post('/brands', data);
      const waLink = buildBrandWALink(data);
      setSubmitted(true);
      setTimeout(() => window.open(waLink, '_blank'), 500);
    } catch {
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F2F0FF',
          padding: '24px',
          paddingTop: '100px',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 0 40px rgba(107,46,232,0.4)',
            }}
          >
            <CheckCircle2 size={40} color="white" />
          </div>
          <h2
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: '1.8rem',
              color: '#120E28',
              marginBottom: '12px',
            }}
          >
            Terima kasih!
          </h2>
          <p style={{ color: '#5B5780', lineHeight: 1.7, marginBottom: '32px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Form kamu sudah kami terima. Kami akan segera menghubungi kamu via WhatsApp untuk konsultasi lebih lanjut.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary" style={{ margin: '0 auto' }}>
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F2F0FF', minHeight: '100vh', paddingTop: '80px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="section-label" style={{ display: 'inline-block', marginBottom: '12px' }}>
            Mulai Kampanye
          </span>
          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              color: '#120E28',
              lineHeight: 1.15,
            }}
          >
            Konsultasi Kampanye{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Gratis
            </span>
          </h1>
          <p style={{ color: '#5B5780', marginTop: '12px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Isi form di bawah dan tim kami akan menghubungi kamu via WhatsApp.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px', alignItems: 'start' }} className="brandform-grid">
          {/* Left sticky panel */}
          <div style={{ position: 'sticky', top: '96px' }} className="brandform-panel">
            <div className="light-card" style={{ padding: '28px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <img src="/icon.png" alt="Azera" style={{ height: '28px' }} />
                <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', color: '#120E28', letterSpacing: '0.08em' }}>AZERA</span>
              </div>
              <p style={{ color: '#5B5780', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '20px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Konsultasi gratis, tidak ada biaya di awal. Tim kami siap membantu merencanakan kampanye terbaik untuk brand kamu.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5B5780', fontSize: '0.82rem', marginBottom: '10px' }}>
                <MessageCircle size={15} color="#25D366" />
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Respon via WhatsApp dalam 1x24 jam</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5B5780', fontSize: '0.82rem', marginBottom: '10px' }}>
                <ShieldCheck size={15} color="#6B2EE8" />
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Data kamu aman & terjaga privasi</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5B5780', fontSize: '0.82rem' }}>
                <CheckCircle2 size={15} color="#6B2EE8" />
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Tidak ada komitmen awal</span>
              </div>
            </div>
            <div
              style={{
                background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                borderRadius: '16px',
                padding: '20px',
                color: 'white',
              }}
            >
              <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: '6px' }}>Butuh bantuan?</p>
              <p style={{ fontSize: '0.82rem', opacity: 0.85, marginBottom: '14px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Hubungi kami langsung via WhatsApp
              </p>
              <a
                href="https://wa.me/6288201586126"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '9px 16px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              >
                <MessageCircle size={14} />
                Chat Sekarang
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 24px rgba(107,46,232,0.08)' }}
          >
            {/* Section: Brand Info */}
            <p style={sectionTitleStyle}>Informasi Brand</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="form-2col">
              <div>
                <label style={labelStyle}>Nama Brand *</label>
                <input {...register('namaBrand')} placeholder="Azera Beauty" style={inputStyle(!!errors.namaBrand)} />
                {errors.namaBrand && <p style={errorStyle}>{errors.namaBrand.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Nama PIC *</label>
                <input {...register('namaPIC')} placeholder="Nama lengkap Anda" style={inputStyle(!!errors.namaPIC)} />
                {errors.namaPIC && <p style={errorStyle}>{errors.namaPIC.message}</p>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="form-2col">
              <div>
                <label style={labelStyle}>WhatsApp *</label>
                <input {...register('whatsapp')} placeholder="08xxxxxxxxxx" style={inputStyle(!!errors.whatsapp)} />
                {errors.whatsapp && <p style={errorStyle}>{errors.whatsapp.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <input {...register('email')} type="email" placeholder="brand@email.com" style={inputStyle(!!errors.email)} />
                {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }} className="form-2col">
              <div>
                <label style={labelStyle}>Website (opsional)</label>
                <input {...register('website')} placeholder="https://brand.com" style={inputStyle()} />
              </div>
              <div>
                <label style={labelStyle}>Kategori Brand *</label>
                <select {...register('kategori')} style={inputStyle(!!errors.kategori)}>
                  <option value="">Pilih kategori</option>
                  {kategoriOptions.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
                {errors.kategori && <p style={errorStyle}>{errors.kategori.message}</p>}
              </div>
            </div>

            {/* Section: Campaign */}
            <p style={sectionTitleStyle}>Detail Kampanye</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="form-2col">
              <div>
                <label style={labelStyle}>Paket *</label>
                <select {...register('paket')} style={inputStyle(!!errors.paket)}>
                  <option value="">Pilih paket</option>
                  <option value="starter">Starter – Rp 5.000.000</option>
                  <option value="growth">Growth – Rp 15.000.000</option>
                  <option value="scale">Scale – Rp 40.000.000</option>
                </select>
                {errors.paket && <p style={errorStyle}>{errors.paket.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Budget *</label>
                <select {...register('budget')} style={inputStyle(!!errors.budget)}>
                  <option value="">Pilih budget</option>
                  {budgetOptions.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.budget && <p style={errorStyle}>{errors.budget.message}</p>}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Target Audience *</label>
              <input {...register('targetAudience')} placeholder="Wanita 18-35 tahun, tertarik skincare, Jakarta" style={inputStyle(!!errors.targetAudience)} />
              {errors.targetAudience && <p style={errorStyle}>{errors.targetAudience.message}</p>}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>
                Tujuan Kampanye *{' '}
                <span style={{ fontWeight: 400, color: '#8B87A8' }}>(bisa lebih dari 1)</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {tujuanOptions.map((t) => {
                  const selected = tujuanVal?.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTujuan(t)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '999px',
                        border: 'none',
                        background: selected ? 'linear-gradient(135deg, #6B2EE8, #E8197A)' : '#F0EEFF',
                        color: selected ? 'white' : '#6B2EE8',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
              {errors.tujuan && <p style={errorStyle}>{errors.tujuan.message as string}</p>}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Durasi Kampanye *</label>
              <select {...register('durasi')} style={inputStyle(!!errors.durasi)}>
                <option value="">Pilih durasi</option>
                {durasiOptions.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.durasi && <p style={errorStyle}>{errors.durasi.message}</p>}
            </div>

            <div style={{ marginBottom: '36px' }}>
              <label style={labelStyle}>Deskripsi Kampanye *</label>
              <textarea
                {...register('deskripsi')}
                rows={4}
                placeholder="Ceritakan lebih detail tentang produk, tujuan kampanye, tone of voice, dll."
                style={{ ...inputStyle(!!errors.deskripsi), resize: 'vertical' }}
              />
              {errors.deskripsi && <p style={errorStyle}>{errors.deskripsi.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '16px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Mengirim...' : 'Kirim & Konsultasi via WhatsApp'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .brandform-grid { grid-template-columns: 1fr !important; }
          .brandform-panel { position: static !important; display: none; }
        }
        @media (max-width: 640px) {
          .form-2col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
