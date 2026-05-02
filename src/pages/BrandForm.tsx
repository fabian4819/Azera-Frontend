import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2 } from 'lucide-react';
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

const tujuanOptions = [
  'Brand Awareness',
  'Product Launch',
  'Increase Sales',
  'App Download',
  'Followers Growth',
  'Event Promotion',
];

const kategoriOptions = ['Beauty & Skincare', 'Food & Beverage', 'Fashion', 'Tech & Gadget', 'Health & Fitness', 'Travel', 'Finance', 'Education', 'Home & Living', 'Other'];

const budgetOptions = ['< Rp 5 Juta', 'Rp 5–15 Juta', 'Rp 15–40 Juta', 'Rp 40–100 Juta', '> Rp 100 Juta'];

const durasiOptions = ['1 Minggu', '2 Minggu', '1 Bulan', '2 Bulan', '3 Bulan+'];

const paketOptions = ['starter', 'growth', 'scale'];

export default function BrandForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
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
    } catch (err) {
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F2F0FF', padding: '24px', paddingTop: '100px' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle2 size={40} color="#10B981" />
          </div>
          <h2 style={{ fontWeight: 800, fontSize: '1.8rem', color: '#1A1040', marginBottom: '12px' }}>Terima kasih!</h2>
          <p style={{ color: '#8B87B0', lineHeight: 1.7, marginBottom: '32px' }}>
            Form kamu sudah kami terima. Kami akan segera menghubungi kamu via WhatsApp untuk konsultasi lebih lanjut.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">Kembali ke Beranda</button>
        </div>
      </div>
    );
  }

  const inputStyle = (hasError?: boolean) => ({
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: `1.5px solid ${hasError ? '#EF4444' : '#E0DCFF'}`,
    fontSize: '0.9rem',
    color: '#1A1040',
    background: 'white',
    outline: 'none',
    fontFamily: 'inherit',
  });

  const labelStyle = { display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#1A1040', marginBottom: '6px' };
  const errorStyle = { color: '#EF4444', fontSize: '0.78rem', marginTop: '4px' };

  return (
    <div style={{ background: '#F2F0FF', minHeight: '100vh', paddingTop: '80px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="section-label" style={{ display: 'block', marginBottom: '12px' }}>Mulai Kampanye</span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#1A1040', lineHeight: 1.2 }}>
            Konsultasi Kampanye <span className="gradient-text">Gratis</span>
          </h1>
          <p style={{ color: '#8B87B0', marginTop: '12px' }}>Isi form di bawah dan tim kami akan menghubungi kamu via WhatsApp.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 24px rgba(107,46,232,0.08)' }}>
          {/* Section: Brand Info */}
          <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#6B2EE8', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #F0EEFF' }}>
            Informasi Brand
          </h3>

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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }} className="form-2col">
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
          <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#6B2EE8', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #F0EEFF' }}>
            Detail Kampanye
          </h3>

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
            <input {...register('targetAudience')} placeholder="Wanita 18-35 tahun, tertarik skincare, Jakarta & sekitarnya" style={inputStyle(!!errors.targetAudience)} />
            {errors.targetAudience && <p style={errorStyle}>{errors.targetAudience.message}</p>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Tujuan Kampanye * <span style={{ fontWeight: 400, color: '#8B87B0' }}>(bisa lebih dari 1)</span></label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {tujuanOptions.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTujuan(t)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '999px',
                    border: `1.5px solid ${tujuanVal?.includes(t) ? '#6B2EE8' : '#E0DCFF'}`,
                    background: tujuanVal?.includes(t) ? '#F0EEFF' : 'white',
                    color: tujuanVal?.includes(t) ? '#6B2EE8' : '#8B87B0',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {t}
                </button>
              ))}
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

          <div style={{ marginBottom: '32px' }}>
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

      <style>{`
        @media (max-width: 640px) { .form-2col { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
