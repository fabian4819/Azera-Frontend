import PageHero from '../components/sections/PageHero';
import FormSidePanel, { PANEL_POINTS } from '../components/sections/FormSidePanel';
import { BrandIllustration } from '../components/illustrations';
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
  campaignName: z.string().min(2, 'Nama campaign wajib diisi'),
  platforms: z.array(z.string()).min(1, 'Pilih minimal 1 platform'),
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
const platformOptions = ['Instagram', 'TikTok', 'Threads', 'X'];

const inputStyle = (hasError?: boolean): React.CSSProperties => ({
  width: '100%', padding: '12px 16px', borderRadius: '12px',
  border: `1.5px solid ${hasError ? '#ba1a1a' : '#c7c8cf'}`,
  fontSize: '0.9rem', color: '#191c20', background: 'white',
  outline: 'none', fontFamily: "var(--font-display)",
  transition: 'border-color 0.2s, box-shadow 0.2s',
});
const inputFocus = { boxShadow: '0 0 0 3px rgba(103,40,228,0.12)', borderColor: '#6728e4' };

const labelStyle: React.CSSProperties = {
  display: 'block', fontWeight: 600, fontSize: '0.82rem', color: '#191c20',
  marginBottom: '6px', fontFamily: "var(--font-display)",
};
const errorStyle: React.CSSProperties = { color: '#ba1a1a', fontSize: '0.75rem', marginTop: '4px', fontFamily: "var(--font-display)" };

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1rem',
  color: '#6728e4', marginBottom: '20px', paddingBottom: '12px',
  borderBottom: '1px solid #e1e0ff', marginTop: '8px',
};

export default function BrandForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tujuan: [], platforms: [] },
  });

  useEffect(() => {
    const paketParam = searchParams.get('paket');
    if (paketParam && paketOptions.includes(paketParam)) {
      setValue('paket', paketParam);
    }
  }, [searchParams, setValue]);

  const tujuanVal = watch('tujuan');
  const platformsVal = watch('platforms');

  const toggleTujuan = (val: string) => {
    const current = tujuanVal || [];
    if (current.includes(val)) setValue('tujuan', current.filter((v) => v !== val));
    else setValue('tujuan', [...current, val]);
  };

  const togglePlatform = (val: string) => {
    const current = platformsVal || [];
    if (current.includes(val)) setValue('platforms', current.filter((v) => v !== val));
    else setValue('platforms', [...current, val]);
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
      <div className="purple-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--form-bg)', padding: '24px', paddingTop: '100px' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px', background: 'white', borderRadius: '24px', padding: 'clamp(28px, 5vw, 40px)', boxShadow: '0 12px 40px rgba(28,10,68,0.25)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle2 size={40} color="white" />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: '1.8rem', color: 'var(--on-background)', marginBottom: '12px' }}>
            Terima kasih!
          </h2>
          <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.7, marginBottom: '32px' }}>
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
    <div className="purple-page" style={{ background: 'var(--form-bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 24px 80px' }}>
        <PageHero
          title="Konsultasi Campaign"
          accent="Gratis"
          subtitle="Isi form di bawah dan tim kami akan menghubungi kamu via WhatsApp."
          illustration={<BrandIllustration />}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px', alignItems: 'start' }} className="form-side-grid">
          <FormSidePanel
            blurb="Konsultasi gratis, tidak ada biaya di awal. Tim kami siap membantu merencanakan campaign terbaik untuk brand kamu."
            points={[PANEL_POINTS.whatsapp, PANEL_POINTS.privacy, PANEL_POINTS.check('Tidak ada komitmen awal')]}
          />

          <form onSubmit={handleSubmit(onSubmit)} style={{ minWidth: 0, background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <p style={sectionTitleStyle}>Informasi Brand</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="form-2col">
              <div>
                <label style={labelStyle}>Nama Brand *</label>
                <input {...register('namaBrand')} placeholder="AzeraKOL Beauty" style={inputStyle(!!errors.namaBrand)} onFocus={(e) => Object.assign(e.target.style, inputFocus)} onBlur={(e) => Object.assign(e.target.style, { boxShadow: 'none' })} />
                {errors.namaBrand && <p style={errorStyle}>{errors.namaBrand.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Nama PIC *</label>
                <input {...register('namaPIC')} placeholder="Nama lengkap Anda" style={inputStyle(!!errors.namaPIC)} onFocus={(e) => Object.assign(e.target.style, inputFocus)} onBlur={(e) => Object.assign(e.target.style, { boxShadow: 'none' })} />
                {errors.namaPIC && <p style={errorStyle}>{errors.namaPIC.message}</p>}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="form-2col">
              <div>
                <label style={labelStyle}>WhatsApp *</label>
                <input {...register('whatsapp')} placeholder="08xxxxxxxxxx" style={inputStyle(!!errors.whatsapp)} onFocus={(e) => Object.assign(e.target.style, inputFocus)} onBlur={(e) => Object.assign(e.target.style, { boxShadow: 'none' })} />
                {errors.whatsapp && <p style={errorStyle}>{errors.whatsapp.message}</p>}
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <input {...register('email')} type="email" placeholder="brand@email.com" style={inputStyle(!!errors.email)} onFocus={(e) => Object.assign(e.target.style, inputFocus)} onBlur={(e) => Object.assign(e.target.style, { boxShadow: 'none' })} />
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

            <p style={sectionTitleStyle}>Detail Campaign</p>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Nama Campaign *</label>
              <input {...register('campaignName')} placeholder="mis. Launching Serum Baru" style={inputStyle(!!errors.campaignName)} onFocus={(e) => Object.assign(e.target.style, inputFocus)} onBlur={(e) => Object.assign(e.target.style, { boxShadow: 'none' })} />
              {errors.campaignName && <p style={errorStyle}>{errors.campaignName.message}</p>}
            </div>
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
              <label style={labelStyle}>Platform * <span style={{ fontWeight: 400, color: '#777683' }}>(bisa lebih dari 1)</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {platformOptions.map((p) => {
                  const selected = platformsVal?.includes(p);
                  return (
                    <button
                      key={p} type="button" onClick={() => togglePlatform(p)}
                      style={{
                        padding: '8px 16px', borderRadius: '999px', border: 'none',
                        background: selected ? 'var(--secondary)' : 'rgba(103,40,228,0.1)',
                        color: selected ? 'white' : '#6728e4',
                        fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                        transition: 'all 0.2s', fontFamily: "var(--font-display)",
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              {errors.platforms && <p style={errorStyle}>{errors.platforms.message as string}</p>}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Target Audience *</label>
              <input {...register('targetAudience')} placeholder="Wanita 18-35 tahun, tertarik skincare, Jakarta" style={inputStyle(!!errors.targetAudience)} onFocus={(e) => Object.assign(e.target.style, inputFocus)} onBlur={(e) => Object.assign(e.target.style, { boxShadow: 'none' })} />
              {errors.targetAudience && <p style={errorStyle}>{errors.targetAudience.message}</p>}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Tujuan Campaign * <span style={{ fontWeight: 400, color: '#777683' }}>(bisa lebih dari 1)</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {tujuanOptions.map((t) => {
                  const selected = tujuanVal?.includes(t);
                  return (
                    <button
                      key={t} type="button" onClick={() => toggleTujuan(t)}
                      style={{
                        padding: '8px 16px', borderRadius: '999px', border: 'none',
                        background: selected ? 'var(--secondary)' : 'rgba(103,40,228,0.1)',
                        color: selected ? 'white' : '#6728e4',
                        fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                        transition: 'all 0.2s', fontFamily: "var(--font-display)",
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
              <label style={labelStyle}>Durasi Campaign *</label>
              <select {...register('durasi')} style={inputStyle(!!errors.durasi)}>
                <option value="">Pilih durasi</option>
                {durasiOptions.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.durasi && <p style={errorStyle}>{errors.durasi.message}</p>}
            </div>
            <div style={{ marginBottom: '36px' }}>
              <label style={labelStyle}>Deskripsi Campaign *</label>
              <textarea {...register('deskripsi')} rows={4} placeholder="Ceritakan lebih detail tentang produk, tujuan campaign, tone of voice, dll." style={{ ...inputStyle(!!errors.deskripsi), resize: 'vertical' }} />
              {errors.deskripsi && <p style={errorStyle}>{errors.deskripsi.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '16px', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Mengirim...' : 'Kirim & Konsultasi via WhatsApp'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .form-2col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
