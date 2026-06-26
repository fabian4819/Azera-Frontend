import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, Camera, Play, Zap } from 'lucide-react';
import { calcEngagement, calcViewRate, erRating } from '../utils/engagement';
import api from '../lib/api';

const niches = ['Beauty', 'Fashion', 'Food & Beverage', 'Travel', 'Tech', 'Fitness', 'Parenting', 'Gaming', 'Finance', 'Education', 'Lifestyle', 'Entertainment'];

const schema = z.object({
  namaLengkap: z.string().min(2, 'Nama wajib diisi'),
  whatsapp: z.string().min(8, 'WhatsApp wajib diisi'),
  email: z.string().email('Email tidak valid'),
  kota: z.string().min(2, 'Kota wajib diisi'),
  tanggalLahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
  jenisKelamin: z.string().min(1, 'Jenis kelamin wajib dipilih'),
  niche: z.array(z.string()).min(1, 'Pilih minimal 1 niche'),
  ig_username: z.string().optional(),
  ig_followers: z.number().optional(),
  ig_avgLike: z.number().optional(),
  ig_avgComment: z.number().optional(),
  tt_username: z.string().optional(),
  tt_followers: z.number().optional(),
  tt_avgLike: z.number().optional(),
  tt_avgComment: z.number().optional(),
  tt_avgViews: z.number().optional(),
  yt_channel: z.string().optional(),
  yt_subscribers: z.number().optional(),
  yt_avgViews: z.number().optional(),
  rateCard: z.string().optional(),
  portfolioLink: z.string().optional(),
  pengalaman: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function ERBadge({ er, color = '#6728e4' }: { er: number; color?: string }) {
  const rating = erRating(er);
  if (er === 0) return null;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '10px', padding: '8px 16px', borderRadius: '10px', background: `linear-gradient(135deg, ${color}, #814bfe)` }}>
      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1rem', color: 'white' }}>{er}%</span>
      <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>ER — {rating.label}</span>
    </div>
  );
}

const inputStyle = (err?: boolean): React.CSSProperties => ({
  width: '100%', padding: '11px 14px', borderRadius: '12px',
  border: `1.5px solid ${err ? '#ba1a1a' : '#c7c8cf'}`,
  fontSize: '0.875rem', color: '#191c20', background: 'white',
  outline: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif",
  transition: 'border-color 0.2s',
});

const labelStyle: React.CSSProperties = {
  display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#191c20',
  marginBottom: '5px', fontFamily: "'Plus Jakarta Sans', sans-serif",
};

const errStyle: React.CSSProperties = { color: '#ba1a1a', fontSize: '0.75rem', marginTop: '3px', fontFamily: "'Plus Jakarta Sans', sans-serif" };

export default function KOLRegister() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { niche: [] },
  });

  const watchAll = watch();
  const igER = calcEngagement(watchAll.ig_followers || 0, watchAll.ig_avgLike || 0, watchAll.ig_avgComment || 0);
  const ttER = calcEngagement(watchAll.tt_followers || 0, watchAll.tt_avgLike || 0, watchAll.tt_avgComment || 0);
  const ytVR = calcViewRate(watchAll.yt_subscribers || 0, watchAll.yt_avgViews || 0);

  const niches_ = watchAll.niche || [];
  const toggleNiche = (val: string) => {
    if (niches_.includes(val)) setValue('niche', niches_.filter((n) => n !== val));
    else setValue('niche', [...niches_, val]);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      const { ig_username, ig_followers, ig_avgLike, ig_avgComment, tt_username, tt_followers, tt_avgLike, tt_avgComment, tt_avgViews, yt_channel, yt_subscribers, yt_avgViews, ...rest } = data;
      const socialMedia = {
        instagram: ig_username ? { username: ig_username, followers: ig_followers, avgLike: ig_avgLike, avgComment: ig_avgComment } : null,
        tiktok: tt_username ? { username: tt_username, followers: tt_followers, avgLike: tt_avgLike, avgComment: tt_avgComment, avgViews: tt_avgViews } : null,
        youtube: yt_channel ? { channel: yt_channel, subscribers: yt_subscribers, avgViews: yt_avgViews } : null,
      };
      Object.entries(rest).forEach(([k, v]) => {
        if (Array.isArray(v)) formData.append(k, JSON.stringify(v));
        else if (v !== undefined) formData.append(k, String(v));
      });
      formData.append('socialMedia', JSON.stringify(socialMedia));
      if (profileFile) formData.append('fotoProfil', profileFile);
      await api.post('/kols', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSubmitted(true);
    } catch {
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9ff', padding: '24px', paddingTop: '100px' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <div className="kinetic-glow" style={{ width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle2 size={40} color="white" />
          </div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.8rem', color: '#191c20', marginBottom: '12px' }}>
            Pendaftaran Berhasil!
          </h2>
          <p style={{ color: '#464652', lineHeight: 1.7, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Profil kamu sedang kami review. Tim AzeraKOL akan menghubungi kamu dalam 1–3 hari kerja via WhatsApp.
          </p>
        </div>
      </div>
    );
  }

  const SectionTitle = ({ title }: { title: string }) => (
    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#6728e4', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #e1e0ff', marginTop: '8px' }}>
      {title}
    </p>
  );

  return (
    <div style={{ background: '#f8f9ff', minHeight: '100vh', paddingTop: '80px', position: 'relative', overflow: 'hidden' }}>
      <div className="blob" style={{ width: '400px', height: '400px', background: '#e1e0ff', opacity: 0.2, top: '5%', right: '-100px' }} />
      <div className="blob" style={{ width: '350px', height: '350px', background: '#ffd9e1', opacity: 0.15, bottom: '5%', left: '-100px' }} />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="section-label" style={{ marginBottom: '12px' }}>Daftar KOL</span>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#191c20', lineHeight: 1.15 }}>
            Bergabung dengan{' '}
            <span className="gradient-text">AzeraKOL Network</span>
          </h1>
          <p style={{ color: '#464652', marginTop: '10px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Daftar gratis — tim kami akan review profil dan menghubungi kamu.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <SectionTitle title="1. Informasi Dasar" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }} className="form-2col">
            <div>
              <label style={labelStyle}>Nama Lengkap *</label>
              <input {...register('namaLengkap')} placeholder="Nama lengkap" style={inputStyle(!!errors.namaLengkap)} />
              {errors.namaLengkap && <p style={errStyle}>{errors.namaLengkap.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>WhatsApp *</label>
              <input {...register('whatsapp')} placeholder="08xxxxxxxxxx" style={inputStyle(!!errors.whatsapp)} />
              {errors.whatsapp && <p style={errStyle}>{errors.whatsapp.message}</p>}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }} className="form-2col">
            <div>
              <label style={labelStyle}>Email *</label>
              <input {...register('email')} type="email" placeholder="email@domain.com" style={inputStyle(!!errors.email)} />
              {errors.email && <p style={errStyle}>{errors.email.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>Kota *</label>
              <input {...register('kota')} placeholder="Jakarta" style={inputStyle(!!errors.kota)} />
              {errors.kota && <p style={errStyle}>{errors.kota.message}</p>}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }} className="form-2col">
            <div>
              <label style={labelStyle}>Tanggal Lahir *</label>
              <input {...register('tanggalLahir')} type="date" style={inputStyle(!!errors.tanggalLahir)} />
              {errors.tanggalLahir && <p style={errStyle}>{errors.tanggalLahir.message}</p>}
            </div>
            <div>
              <label style={labelStyle}>Jenis Kelamin *</label>
              <select {...register('jenisKelamin')} style={inputStyle(!!errors.jenisKelamin)}>
                <option value="">Pilih</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.jenisKelamin && <p style={errStyle}>{errors.jenisKelamin.message}</p>}
            </div>
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={labelStyle}>Niche Konten * <span style={{ fontWeight: 400, color: '#777683' }}>(bisa lebih dari 1)</span></label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {niches.map((n) => {
                const selected = niches_.includes(n);
                return (
                  <button key={n} type="button" onClick={() => toggleNiche(n)}
                    style={{
                      padding: '8px 16px', borderRadius: '999px', border: 'none',
                      background: selected ? 'linear-gradient(135deg, #6728e4, #814bfe)' : '#e1e0ff',
                      color: selected ? 'white' : '#6728e4',
                      fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.2s', fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>
                    {n}
                  </button>
                );
              })}
            </div>
            {errors.niche && <p style={errStyle}>{errors.niche.message as string}</p>}
          </div>

          <SectionTitle title="2. Media Sosial" />
          <p style={{ color: '#777683', fontSize: '0.85rem', marginBottom: '20px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Isi minimal 1 platform.</p>

          {/* Instagram card */}
          <div style={{ background: '#fdf2f8', border: '1px solid rgba(255,129,170,0.15)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Camera size={18} color="#ff81aa" />
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#ff81aa', fontSize: '0.9rem' }}>Instagram</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }} className="form-2col">
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Username</label><input {...register('ig_username')} placeholder="@username" style={inputStyle()} /></div>
              <div><label style={labelStyle}>Followers</label><input {...register('ig_followers', { valueAsNumber: true })} type="number" placeholder="10000" style={inputStyle()} /></div>
              <div><label style={labelStyle}>Avg. Like</label><input {...register('ig_avgLike', { valueAsNumber: true })} type="number" placeholder="500" style={inputStyle()} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Avg. Comment</label><input {...register('ig_avgComment', { valueAsNumber: true })} type="number" placeholder="50" style={inputStyle()} /></div>
            </div>
            <ERBadge er={igER} color="#ff81aa" />
          </div>

          {/* TikTok card */}
          <div style={{ background: '#f0fdf4', border: '1px solid rgba(16,185,129,0.12)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#10B981', fontSize: '0.9rem' }}>TikTok</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }} className="form-2col">
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Username</label><input {...register('tt_username')} placeholder="@username" style={inputStyle()} /></div>
              <div><label style={labelStyle}>Followers</label><input {...register('tt_followers', { valueAsNumber: true })} type="number" placeholder="10000" style={inputStyle()} /></div>
              <div><label style={labelStyle}>Avg. Like</label><input {...register('tt_avgLike', { valueAsNumber: true })} type="number" placeholder="500" style={inputStyle()} /></div>
              <div><label style={labelStyle}>Avg. Comment</label><input {...register('tt_avgComment', { valueAsNumber: true })} type="number" placeholder="50" style={inputStyle()} /></div>
              <div><label style={labelStyle}>Avg. Views</label><input {...register('tt_avgViews', { valueAsNumber: true })} type="number" placeholder="5000" style={inputStyle()} /></div>
            </div>
            <ERBadge er={ttER} color="#10B981" />
          </div>

          {/* YouTube card */}
          <div style={{ background: '#fff7ed', border: '1px solid rgba(194,65,12,0.12)', borderRadius: '16px', padding: '20px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Play size={18} color="#C2410C" />
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#C2410C', fontSize: '0.9rem' }}>YouTube</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }} className="form-2col">
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Channel Name</label><input {...register('yt_channel')} placeholder="Nama Channel" style={inputStyle()} /></div>
              <div><label style={labelStyle}>Subscribers</label><input {...register('yt_subscribers', { valueAsNumber: true })} type="number" placeholder="10000" style={inputStyle()} /></div>
              <div><label style={labelStyle}>Avg. Views / Video</label><input {...register('yt_avgViews', { valueAsNumber: true })} type="number" placeholder="2000" style={inputStyle()} /></div>
            </div>
            {ytVR > 0 && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '10px', padding: '8px 16px', borderRadius: '10px', background: 'linear-gradient(135deg, #C2410C, #F59E0B)' }}>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1rem', color: 'white' }}>{ytVR}%</span>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>View Rate</span>
              </div>
            )}
          </div>

          <SectionTitle title="3. Informasi Tambahan" />
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Rate Card (opsional)</label>
            <input {...register('rateCard')} placeholder="Rp 500.000 / posting" style={inputStyle()} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Portfolio / Contoh Konten (opsional)</label>
            <input {...register('portfolioLink')} placeholder="https://link-portfolio.com" style={inputStyle()} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Pengalaman Kolaborasi (opsional)</label>
            <textarea {...register('pengalaman')} rows={3} placeholder="Ceritakan pengalaman kolaborasi sebelumnya..." style={{ ...inputStyle(), resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: '36px' }}>
            <label style={labelStyle}>Foto Profil (opsional)</label>
            <input type="file" accept="image/*" onChange={(e) => setProfileFile(e.target.files?.[0] || null)} style={{ ...inputStyle(), padding: '10px 14px', cursor: 'pointer' }} />
            {profileFile && <p style={{ fontSize: '0.78rem', color: '#10B981', marginTop: '4px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>File: {profileFile.name}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '16px', opacity: loading ? 0.7 : 1 }}>
            <Zap size={18} />
            {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>
        </form>
      </div>
    </div>
  );
}
