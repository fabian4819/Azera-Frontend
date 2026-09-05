import { useEffect, useState } from 'react';
import { CheckCircle2, Camera, Music2, AtSign, Hash, Zap } from 'lucide-react';
import api from '../lib/api';

const niches = ['Beauty', 'Fashion', 'Food & Beverage', 'Travel', 'Tech', 'Fitness', 'Parenting', 'Gaming', 'Finance', 'Education', 'Lifestyle', 'Entertainment', 'Yang lain'];
const contentStyles = ['Review', 'Tutorial', 'Challenge / Trend', 'Daily Vlog', 'Storytelling', 'Talking Head', 'GRWM', 'Before & After', 'Comedy', 'Unboxing', 'Cinematic', 'ASMR', 'Voice Over', 'Live Streaming', 'Podcast / Interview', 'Foto Estetik', 'UGC Style', 'Yang lain'];
const activities = [
  { value: 'kol', label: 'KOL (Key Opinion Leader)', desc: 'Audiensmu mengikuti rekomendasi/opinimu dan itu memengaruhi keputusan mereka.' },
  { value: 'koc', label: 'KOC (Key Opinion Consumer)', desc: 'Membagikan pengalaman pakai produk secara autentik sebagai konsumen.' },
  { value: 'ugc', label: 'UGC Creator', desc: 'Membuat konten untuk brand tanpa harus dipublikasikan di akun pribadi.' },
  { value: 'affiliator', label: 'Affiliator', desc: 'Mempromosikan produk lewat link affiliate, dapat komisi dari penjualan.' },
  { value: 'live_streamer', label: 'Live Streamer', desc: 'Siaran langsung untuk interaksi dengan audiens atau bantu penjualan.' },
];
const socialPlatforms = [
  { value: 'instagram', label: 'Instagram', icon: Camera, color: '#ff81aa' },
  { value: 'tiktok', label: 'TikTok', icon: Music2, color: '#10B981' },
  { value: 'threads', label: 'Threads', icon: AtSign, color: '#464652' },
  { value: 'x', label: 'X', icon: Hash, color: '#191c20' },
];

const WILAYAH_API = 'https://www.emsifa.com/api-wilayah-indonesia/api';

interface WilayahOption { id: string; name: string }

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #c7c8cf',
  fontSize: '0.875rem', color: '#191c20', background: 'white', outline: 'none',
  fontFamily: "var(--font-display)",
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#191c20',
  marginBottom: '5px', fontFamily: "var(--font-display)",
};

const SectionTitle = ({ title }: { title: string }) => (
  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1rem', color: '#6728e4', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #e1e0ff', marginTop: '8px' }}>
    {title}
  </p>
);

const Pill = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
  <button type="button" onClick={onClick} style={{
    padding: '8px 16px', borderRadius: '999px', border: 'none',
    background: selected ? 'linear-gradient(135deg, #6728e4, #814bfe)' : '#e1e0ff',
    color: selected ? 'white' : '#6728e4', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
    fontFamily: "var(--font-display)",
  }}>
    {label}
  </button>
);

interface SocialState { username: string; profileUrl: string; followers: string }

export default function KOLRegister() {
  const [submitted, setSubmitted] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [provinces, setProvinces] = useState<WilayahOption[]>([]);
  const [cities, setCities] = useState<WilayahOption[]>([]);
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [socials, setSocials] = useState<Record<string, SocialState>>({});
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [nicheOther, setNicheOther] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [styleOther, setStyleOther] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [rateType, setRateType] = useState<'nominal' | 'unknown' | ''>('');
  const [rateAmount, setRateAmount] = useState('');
  const [rateNegotiable, setRateNegotiable] = useState<'yes' | 'no' | 'depends' | ''>('');
  const [portfolioLink, setPortfolioLink] = useState('');

  useEffect(() => {
    fetch(`${WILAYAH_API}/provinces.json`)
      .then((res) => res.json())
      .then((data: WilayahOption[]) => setProvinces(data))
      .catch(() => setProvinces([]));
  }, []);

  const onProvinceChange = (provinceId: string) => {
    setProvince(provinceId);
    setCity('');
    setCities([]);
    if (!provinceId) return;
    fetch(`${WILAYAH_API}/regencies/${provinceId}.json`)
      .then((res) => res.json())
      .then((data: WilayahOption[]) => setCities(data))
      .catch(() => setCities([]));
  };

  const toggle = (list: string[], setList: (v: string[]) => void, val: string) => {
    if (list.includes(val)) setList(list.filter((v) => v !== val));
    else setList([...list, val]);
  };

  const setSocialField = (platform: string, field: keyof SocialState, value: string) => {
    setSocials((prev) => ({ ...prev, [platform]: { ...prev[platform], [field]: value } }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!name || !phone || !gender || !province || !city) {
      setSubmitError('Nama, nomor WA, jenis kelamin, provinsi, dan kota/kabupaten wajib diisi.');
      return;
    }
    if (!Object.values(socials).some((v) => v?.username)) {
      setSubmitError('Isi minimal 1 platform media sosial.');
      return;
    }
    if (selectedActivities.length === 0) {
      setSubmitError('Pilih minimal 1 aktivitas sebagai creator.');
      return;
    }
    if (selectedNiches.length === 0 || (selectedNiches.includes('Yang lain') && !nicheOther)) {
      setSubmitError('Pilih minimal 1 niche konten.');
      return;
    }
    if (selectedStyles.length === 0 || (selectedStyles.includes('Yang lain') && !styleOther)) {
      setSubmitError('Pilih minimal 1 gaya konten.');
      return;
    }
    if (!rateType || (rateType === 'nominal' && !rateAmount) || !rateNegotiable) {
      setSubmitError('Estimasi rate dan status negosiasi rate wajib diisi.');
      return;
    }
    setLoading(true);
    try {
      const socialsPayload = Object.entries(socials)
        .filter(([, v]) => v?.username)
        .map(([platform, v]) => ({ platform, username: v.username, profileUrl: v.profileUrl || '', followers: Number(v.followers) || 0 }));

      const provinceName = provinces.find((p) => p.id === province)?.name || '';
      const cityName = cities.find((c) => c.id === city)?.name || '';

      const res = await api.post('/creators/register', {
        name, phone, gender,
        domicile: { province: provinceName, city: cityName },
        socials: socialsPayload,
        activities: selectedActivities,
        niches: selectedNiches.filter((n) => n !== 'Yang lain'),
        nicheOther: selectedNiches.includes('Yang lain') ? nicheOther : undefined,
        contentStyles: selectedStyles.filter((s) => s !== 'Yang lain'),
        contentStyleOther: selectedStyles.includes('Yang lain') ? styleOther : undefined,
        bankAccount: bankName ? { bankName, accountNumber, accountName } : undefined,
        rateEstimateType: rateType || undefined,
        rateEstimateAmount: rateType === 'nominal' && rateAmount ? Number(rateAmount) : undefined,
        rateNegotiable: rateNegotiable || undefined,
        portfolioLink: portfolioLink || undefined,
      });
      if (res.data.alreadyExists) setAlreadyExists(true);
      setSubmitted(true);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setSubmitError(message || 'Terjadi kesalahan. Silakan coba lagi.');
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
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: '1.8rem', color: '#191c20', marginBottom: '12px' }}>
            {alreadyExists ? 'Kamu Sudah Terdaftar' : 'Pendaftaran Berhasil!'}
          </h2>
          <p style={{ color: '#464652', lineHeight: 1.7, fontFamily: "var(--font-display)" }}>
            {alreadyExists
              ? 'Nomor WhatsApp kamu sudah terdaftar sebelumnya. Tim AzeraKOL akan segera menghubungi.'
              : 'Profil kamu sedang kami review. Tim AzeraKOL akan menghubungi kamu dalam 1–3 hari kerja via WhatsApp.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8f9ff', minHeight: '100vh', paddingTop: '80px', position: 'relative', overflow: 'hidden' }}>
      <div className="blob" style={{ width: '400px', height: '400px', background: '#e1e0ff', opacity: 0.2, top: '5%', right: '-100px' }} />
      <div className="blob" style={{ width: '350px', height: '350px', background: '#ffd9e1', opacity: 0.15, bottom: '5%', left: '-100px' }} />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="section-label" style={{ marginBottom: '12px' }}>Daftar KOL</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#191c20', lineHeight: 1.15 }}>
            Bergabung dengan{' '}
            <span className="gradient-text">AzeraKOL Network</span>
          </h1>
          <p style={{ color: '#464652', marginTop: '10px', fontFamily: "var(--font-display)" }}>
            Daftar gratis, tim kami akan review profil dan menghubungi kamu.
          </p>
        </div>

        <form onSubmit={onSubmit} style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <SectionTitle title="1. Data Diri" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }} className="form-2col">
            <div>
              <label style={labelStyle}>Nama Lengkap *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Nomor WhatsApp *</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxxxxxxxx" style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Jenis Kelamin *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <Pill label="Laki-laki" selected={gender === 'male'} onClick={() => setGender('male')} />
              <Pill label="Perempuan (Hijab)" selected={gender === 'female_hijab'} onClick={() => setGender('female_hijab')} />
              <Pill label="Perempuan (Non-Hijab)" selected={gender === 'female_non_hijab'} onClick={() => setGender('female_non_hijab')} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '28px' }} className="form-2col">
            <div>
              <label style={labelStyle}>Provinsi *</label>
              <select value={province} onChange={(e) => onProvinceChange(e.target.value)} style={inputStyle}>
                <option value="">Pilih provinsi</option>
                {provinces.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Kota/Kabupaten *</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} disabled={!province} style={inputStyle}>
                <option value="">{province ? 'Pilih kota/kabupaten' : 'Pilih provinsi dulu'}</option>
                {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <SectionTitle title="2. Media Sosial" />
          <p style={{ color: '#777683', fontSize: '0.85rem', marginBottom: '20px', fontFamily: "var(--font-display)" }}>Isi minimal 1 platform. *</p>
          {socialPlatforms.map(({ value, label, icon: Icon, color }) => (
            <div key={value} style={{ background: '#f8f9ff', border: `1px solid ${color}22`, borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Icon size={18} color={color} />
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, color, fontSize: '0.9rem' }}>{label}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }} className="form-2col">
                <div><label style={labelStyle}>Username</label><input value={socials[value]?.username || ''} onChange={(e) => setSocialField(value, 'username', e.target.value)} placeholder="@username" style={inputStyle} /></div>
                <div><label style={labelStyle}>Followers</label><input value={socials[value]?.followers || ''} onChange={(e) => setSocialField(value, 'followers', e.target.value)} type="number" placeholder="10000" style={inputStyle} /></div>
                <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Link Profil</label><input value={socials[value]?.profileUrl || ''} onChange={(e) => setSocialField(value, 'profileUrl', e.target.value)} placeholder="https://..." style={inputStyle} /></div>
              </div>
            </div>
          ))}

          <SectionTitle title="3. Aktivitas Sebagai Creator" />
          <p style={{ color: '#777683', fontSize: '0.85rem', marginBottom: '16px', fontFamily: "var(--font-display)" }}>Bisa pilih lebih dari 1. *</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
            {activities.map((a) => {
              const selected = selectedActivities.includes(a.value);
              return (
                <button key={a.value} type="button" onClick={() => toggle(selectedActivities, setSelectedActivities, a.value)}
                  style={{ textAlign: 'left', padding: '14px 16px', borderRadius: '12px', border: selected ? '1.5px solid #6728e4' : '1.5px solid #e1e0ff', background: selected ? '#f0eeff' : 'white', cursor: 'pointer' }}>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '0.85rem', color: selected ? '#6728e4' : '#191c20', marginBottom: '2px' }}>{a.label}</p>
                  <p style={{ fontSize: '0.78rem', color: '#777683', fontFamily: "var(--font-display)" }}>{a.desc}</p>
                </button>
              );
            })}
          </div>

          <SectionTitle title="4. Niche Konten" />
          <p style={{ color: '#777683', fontSize: '0.85rem', marginBottom: '16px', fontFamily: "var(--font-display)" }}>Pilih minimal 1 niche. *</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: selectedNiches.includes('Yang lain') ? '12px' : '28px' }}>
            {niches.map((n) => <Pill key={n} label={n} selected={selectedNiches.includes(n)} onClick={() => toggle(selectedNiches, setSelectedNiches, n)} />)}
          </div>
          {selectedNiches.includes('Yang lain') && (
            <input value={nicheOther} onChange={(e) => setNicheOther(e.target.value)} placeholder="Sebutkan niche lain..." style={{ ...inputStyle, marginBottom: '28px' }} />
          )}

          <SectionTitle title="5. Gaya Konten" />
          <p style={{ color: '#777683', fontSize: '0.85rem', marginBottom: '16px', fontFamily: "var(--font-display)" }}>Pilih minimal 1 gaya konten. *</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: selectedStyles.includes('Yang lain') ? '12px' : '28px' }}>
            {contentStyles.map((s) => <Pill key={s} label={s} selected={selectedStyles.includes(s)} onClick={() => toggle(selectedStyles, setSelectedStyles, s)} />)}
          </div>
          {selectedStyles.includes('Yang lain') && (
            <input value={styleOther} onChange={(e) => setStyleOther(e.target.value)} placeholder="Sebutkan gaya konten lain..." style={{ ...inputStyle, marginBottom: '28px' }} />
          )}

          <SectionTitle title="6. Rate & Negosiasi" />
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Estimasi rate untuk 1&times; video posting *</label>
            <p style={{ fontSize: '0.78rem', color: '#777683', marginBottom: '8px' }}>Hanya untuk referensi awal dan bukan merupakan kesepakatan final.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: rateType === 'nominal' ? '10px' : 0 }}>
              <Pill label="Isi nominal" selected={rateType === 'nominal'} onClick={() => setRateType('nominal')} />
              <Pill label="Saya belum memiliki patokan rate" selected={rateType === 'unknown'} onClick={() => { setRateType('unknown'); setRateAmount(''); }} />
            </div>
            {rateType === 'nominal' && (
              <input value={rateAmount} onChange={(e) => setRateAmount(e.target.value)} placeholder="Rp ________" type="number" style={inputStyle} />
            )}
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={labelStyle}>Apakah rate tersebut masih dapat dinegosiasikan? *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <Pill label="Ya" selected={rateNegotiable === 'yes'} onClick={() => setRateNegotiable('yes')} />
              <Pill label="Tidak" selected={rateNegotiable === 'no'} onClick={() => setRateNegotiable('no')} />
              <Pill label="Tergantung Campaign" selected={rateNegotiable === 'depends'} onClick={() => setRateNegotiable('depends')} />
            </div>
          </div>

          <SectionTitle title="7. Info Tambahan (opsional)" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }} className="form-2col">
            <div><label style={labelStyle}>Nama Bank</label><input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="BCA" style={inputStyle} /></div>
            <div><label style={labelStyle}>Nomor Rekening</label><input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="1234567890" style={inputStyle} /></div>
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Nama Pemilik Rekening</label>
            <input value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Sesuai buku tabungan" style={inputStyle} />
          </div>
          <div style={{ marginBottom: '36px' }}>
            <label style={labelStyle}>Portfolio</label>
            <input value={portfolioLink} onChange={(e) => setPortfolioLink(e.target.value)} placeholder="https://..." style={inputStyle} />
          </div>

          {submitError && <p style={{ color: '#ba1a1a', fontSize: '0.85rem', marginBottom: '16px', fontFamily: "var(--font-display)" }}>{submitError}</p>}

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '16px', opacity: loading ? 0.7 : 1 }}>
            <Zap size={18} />
            {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>
        </form>
      </div>
    </div>
  );
}
