import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import api from '../lib/api';
import { NICHES } from '../lib/niches';
import PageHero from '../components/sections/PageHero';
import { ApplyIllustration } from '../components/illustrations';
import { WILAYAH_API, type WilayahOption } from '../lib/wilayah';

const PLATFORM_LABELS: Record<string, string> = { instagram: 'Instagram', tiktok: 'TikTok', threads: 'Threads', x: 'X' };

type CustomFieldType = 'text' | 'textarea' | 'number' | 'select' | 'checkbox';
interface CustomField { id: string; label: string; type: CustomFieldType; required: boolean; options?: string[] }
interface PicOption { _id: string; name: string }
interface ApplyFields { pic: boolean; handleBy: boolean; handleByRequired: boolean }

interface CampaignInfo {
  name: string;
  brand: { namaBrand: string };
  briefContent?: string;
  customFields?: CustomField[];
  applyFields?: ApplyFields;
  picOptions?: PicOption[];
  criteria?: { platforms?: string[]; provinces?: string[]; cities?: string[]; minFollowersByPlatform?: Record<string, number | undefined> };
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #c7c8cf',
  fontSize: '0.875rem', color: '#191c20', background: 'white', outline: 'none',
  fontFamily: "var(--font-display)",
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#191c20',
  marginBottom: '5px', fontFamily: "var(--font-display)",
};

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

/** Ilustrasi "pendaftaran ditutup": papan TUTUP tergantung di pintu (inline SVG, warna brand). */
const ClosedIllustration = () => (
  <svg viewBox="0 0 240 200" width="220" height="183" role="img" aria-label="Ilustrasi papan tutup" style={{ display: 'block', margin: '0 auto 20px' }}>
    <ellipse cx="120" cy="186" rx="88" ry="8" fill="#e1e0ff" />
    <rect x="58" y="22" width="124" height="164" rx="10" fill="#f0eeff" stroke="#c9b6f7" strokeWidth="3" />
    <rect x="72" y="38" width="96" height="60" rx="6" fill="white" stroke="#e1e0ff" strokeWidth="2" />
    <circle cx="160" cy="118" r="5" fill="#c9b6f7" />
    <circle cx="120" cy="54" r="4" fill="#6728e4" />
    <path d="M120 54 L88 92 M120 54 L152 92" stroke="#6728e4" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <g transform="rotate(-6 120 112)">
      <rect x="70" y="88" width="100" height="48" rx="10" fill="url(#closedGrad)" />
      <text x="120" y="119" textAnchor="middle" fontFamily="var(--font-display), sans-serif" fontWeight="800" fontSize="20" fill="white" letterSpacing="3">TUTUP</text>
    </g>
    <path d="M190 40 l6 -6 M198 52 h9 M186 30 l-2 -8" stroke="#ffb1c8" strokeWidth="3" strokeLinecap="round" />
    <defs>
      <linearGradient id="closedGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#6728e4" />
        <stop offset="1" stopColor="#814bfe" />
      </linearGradient>
    </defs>
  </svg>
);

/** Form pendaftaran campaign: field default (nama/WA/email + PIC/Handle by kalau aktif) + pertanyaan
 * custom dari admin. Creator tidak perlu isi Form Creator (/kol/register) dulu. */
export default function CampaignApply() {
  const { slug } = useParams();
  const [campaign, setCampaign] = useState<CampaignInfo | null>(null);
  const [notFound, setNotFound] = useState(false);
  // Pendaftaran ditutup admin (server 410), tampilkan halaman "sudah ditutup", bukan form
  const [closed, setClosed] = useState<{ name?: string; brand?: { namaBrand?: string } } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [picUserId, setPicUserId] = useState('');
  const [handleBy, setHandleBy] = useState('');
  const [customValues, setCustomValues] = useState<Record<string, string | string[]>>({});
  const [niches, setNiches] = useState<string[]>([]);
  // id wilayah (dropdown); nama dikirim ke server saat submit, sama seperti KOLRegister
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [provinces, setProvinces] = useState<WilayahOption[]>([]);
  const [cities, setCities] = useState<WilayahOption[]>([]);
  // Cek WA/email sudah terdaftar (lihat GET /creators/lookup) + pilihan nama kalau beda dengan yang tersimpan
  const [found, setFound] = useState<{ phoneExists: boolean; emailExists: boolean; sameCreator: boolean; name?: string } | null>(null);
  const [nameChoice, setNameChoice] = useState<{ saved: string; typed: string } | null>(null);
  const [updateName, setUpdateName] = useState(false);
  const [socials, setSocials] = useState<Record<string, { username: string; followers: string }>>({});

  useEffect(() => {
    api.get(`/campaigns/${slug}`)
      .then((res) => setCampaign(res.data))
      .catch((err: { response?: { status?: number; data?: { name?: string; brand?: { namaBrand?: string } } } }) => {
        if (err.response?.status === 410) setClosed(err.response.data ?? {});
        else setNotFound(true);
      });
    fetch(`${WILAYAH_API}/provinces.json`)
      .then((r) => r.json())
      .then((data: WilayahOption[]) => setProvinces(data))
      .catch(() => setProvinces([]));
  }, [slug]);

  const lookup = async () => {
    if (!phone.trim() && !email.trim()) { setFound(null); return; }
    try {
      const res = await api.get('/creators/lookup', { params: { phone: phone.trim(), email: email.trim() } });
      setFound(res.data);
      const saved: string | undefined = res.data.name;
      if (res.data.sameCreator && saved && saved !== name.trim()) {
        if (name.trim()) setNameChoice({ saved, typed: name.trim() });
        setName(saved);
        setUpdateName(false);
      }
    } catch {
      setFound(null);
    }
  };

  const pickName = (useTyped: boolean) => {
    if (!nameChoice) return;
    setName(useTyped ? nameChoice.typed : nameChoice.saved);
    setUpdateName(useTyped);
    setNameChoice(null);
  };

  const foundNote = !found ? null
    : found.emailExists && !found.sameCreator
      ? { warn: true, text: 'Email ini sudah dipakai daftar dengan nomor WhatsApp lain. Coba cek lagi nomor WhatsApp kamu, atau pakai email lain ya.' }
      : found.sameCreator
        ? { warn: false, text: 'Kamu sudah pernah daftar sebelumnya pakai nomor WhatsApp dan email ini. Pendaftaran ini akan disambungkan ke data kamu yang lama, jadi tidak perlu bikin akun baru.' }
        : found.phoneExists
          ? { warn: false, text: 'Nomor WhatsApp ini sudah pernah dipakai daftar. Pendaftaran ini akan masuk ke data milik nomor tersebut.' }
          : null;

  const onProvinceChange = (provinceId: string) => {
    setProvince(provinceId);
    setCity('');
    setCities([]);
    if (!provinceId) return;
    fetch(`${WILAYAH_API}/regencies/${provinceId}.json`)
      .then((r) => r.json())
      .then((data: WilayahOption[]) => setCities(data))
      .catch(() => setCities([]));
  };

  const platforms = campaign?.criteria?.platforms ?? [];
  // Provinsi & kota cuma ditanya kalau campaign punya kriteria provinsi/kota
  const askDomicile = (campaign?.criteria?.provinces?.length ?? 0) + (campaign?.criteria?.cities?.length ?? 0) > 0;
  const minFollowers = (p: string) => campaign?.criteria?.minFollowersByPlatform?.[p];
  const setSocial = (platform: string, patch: Partial<{ username: string; followers: string }>) =>
    setSocials((prev) => ({ ...prev, [platform]: { ...{ username: '', followers: '' }, ...prev[platform], ...patch } }));

  const fields: ApplyFields = campaign?.applyFields ?? { pic: true, handleBy: true, handleByRequired: false };
  const showPic = fields.pic && (campaign?.picOptions?.length ?? 0) > 0;

  const setCustomValue = (fieldId: string, value: string | string[]) => {
    setCustomValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const toggleCustomCheckbox = (fieldId: string, option: string) => {
    const current = (customValues[fieldId] as string[] | undefined) || [];
    setCustomValue(fieldId, current.includes(option) ? current.filter((v) => v !== option) : [...current, option]);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setSubmitError('Nama, nomor WA, dan email wajib diisi.');
      return;
    }
    if (!niches.length) {
      setSubmitError('Niche wajib diisi.');
      return;
    }
    if (askDomicile && (!province || !city)) {
      setSubmitError('Provinsi dan kota wajib diisi.');
      return;
    }
    const missingSocial = platforms.find((p) => !socials[p]?.username.trim() || socials[p]?.followers === '');
    if (missingSocial) {
      setSubmitError(`Username & jumlah followers ${PLATFORM_LABELS[missingSocial] ?? missingSocial} wajib diisi.`);
      return;
    }
    if (showPic && !picUserId) {
      setSubmitError('PIC wajib dipilih.');
      return;
    }
    if (fields.handleBy && fields.handleByRequired && !handleBy.trim()) {
      setSubmitError('Handle by wajib diisi.');
      return;
    }
    const missingCustom = (campaign?.customFields || []).filter((f) => {
      if (!f.required) return false;
      const v = customValues[f.id];
      return v === undefined || v === '' || (Array.isArray(v) && v.length === 0);
    });
    if (missingCustom.length > 0) {
      setSubmitError(`Wajib diisi: ${missingCustom.map((f) => f.label).join(', ')}`);
      return;
    }
    setLoading(true);
    try {
      await api.post(`/campaigns/${slug}/apply`, {
        name, phone, email, niches, updateName,
        province: provinces.find((p) => p.id === province)?.name || '',
        city: cities.find((c) => c.id === city)?.name || '',
        socials: platforms.map((p) => ({ platform: p, username: socials[p].username, followers: Number(socials[p].followers) })),
        picUserId: showPic ? picUserId : undefined,
        handleBy: fields.handleBy ? handleBy : undefined,
        customAnswers: customValues,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      const response = (err as { response?: { status?: number; data?: { message?: string } } })?.response;
      if (response?.status === 410) { setClosed({ name: campaign?.name, brand: campaign?.brand }); return; } // ditutup saat sedang mengisi
      const message = response?.data?.message;
      setSubmitError(message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (closed) {
    return (
      <div className="purple-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--form-bg)', padding: '24px', paddingTop: '100px' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px', background: 'white', borderRadius: '24px', padding: 'clamp(28px, 5vw, 40px)', boxShadow: '0 12px 40px rgba(28,10,68,0.25)', fontFamily: "var(--font-display)" }}>
          <ClosedIllustration />
          {closed.name && <span className="section-label" style={{ marginBottom: '10px' }}>{closed.name}</span>}
          <h2 style={{ fontWeight: 800, fontSize: '1.7rem', color: '#191c20', marginBottom: '12px', lineHeight: 1.25 }}>
            Pendaftaran sudah ditutup
          </h2>
          <p style={{ color: '#464652', lineHeight: 1.7 }}>
            Maaf ya, kuota creator untuk campaign ini sudah terpenuhi, jadi pendaftarannya sudah ditutup.
            Pantau terus info campaign berikutnya dari AzeraKOL! 💜
          </p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="purple-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--form-bg)', padding: '24px' }}>
        <p style={{ fontFamily: "var(--font-display)", color: 'white' }}>Campaign tidak ditemukan. Cek lagi link yang kamu buka ya.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="purple-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--form-bg)', padding: '24px', paddingTop: '100px' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px', background: 'white', borderRadius: '24px', padding: 'clamp(28px, 5vw, 40px)', boxShadow: '0 12px 40px rgba(28,10,68,0.25)' }}>
          <div className="kinetic-glow" style={{ width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle2 size={40} color="white" />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: '1.8rem', color: '#191c20', marginBottom: '12px' }}>
            Pendaftaran Terkirim!
          </h2>
          <p style={{ color: '#464652', lineHeight: 1.7, fontFamily: "var(--font-display)" }}>
            Tim AzeraKOL akan review pendaftaranmu. Kalau lolos, link dashboard campaign akan dikirim ke WhatsApp dan email kamu.
          </p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return <div className="purple-page" style={{ minHeight: '100vh', background: 'var(--form-bg)' }} />;
  }

  return (
    // Tanpa overflow:hidden di wrapper, kalau ada, brief sticky tidak jalan
    <div className="purple-page" style={{ background: 'var(--form-bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: campaign.briefContent ? '1160px' : '760px', margin: '0 auto', padding: '24px 24px 80px', position: 'relative', zIndex: 1 }}>
        <PageHero
          accent={campaign.name}
          subtitle={`${campaign.brand?.namaBrand ? `Campaign dari ${campaign.brand.namaBrand}. ` : ''}Baca info campaign-nya dulu, lalu isi form pendaftaran. Tim AzeraKOL akan review dan menghubungi kamu.`}
          illustration={<ApplyIllustration />}
        />

        {/* Brief kiri (sticky di bawah navbar), form kanan; < 900px bertumpuk (lihat .apply-grid di index.css) */}
        <div className="apply-grid" style={{ display: 'grid', gridTemplateColumns: campaign.briefContent ? 'minmax(0, 1fr) minmax(0, 1.15fr)' : '1fr', gap: '24px', alignItems: 'start' }}>
        {campaign.briefContent && (
          <div className="apply-brief" style={{ position: 'sticky', top: '110px', background: 'white', borderRadius: '24px', padding: 'clamp(24px, 4vw, 32px)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', maxHeight: 'calc(100vh - 130px)', overflowY: 'auto' }}>
            <p style={{ fontFamily: "var(--font-display)", color: '#464652', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontSize: '0.9rem', wordBreak: 'break-word' }}>{campaign.briefContent}</p>
          </div>
        )}

        <form onSubmit={onSubmit} style={{ background: 'white', borderRadius: '24px', padding: 'clamp(24px, 5vw, 40px)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', minWidth: 0 }}>
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Nama Lengkap *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" autoComplete="name" style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }} className="form-2col">
            <div>
              <label style={labelStyle}>Nomor WhatsApp *</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={() => void lookup()} placeholder="08xxxxxxxxxx" inputMode="tel" autoComplete="tel" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => void lookup()} placeholder="you@email.com" autoComplete="email" style={inputStyle} />
            </div>
          </div>
          {foundNote && (
            <p role="status" style={{ marginTop: '-8px', marginBottom: '18px', padding: '10px 14px', borderRadius: '10px', fontSize: '0.8rem', lineHeight: 1.5, fontFamily: "var(--font-display)", background: foundNote.warn ? '#ffdad6' : '#f0eeff', color: foundNote.warn ? '#93000a' : '#4a2a9e' }}>
              {foundNote.text}
            </p>
          )}

          {nameChoice && (
            <div role="dialog" aria-modal="true" aria-label="Pilih nama" style={{ position: 'fixed', inset: 0, background: 'rgba(25,28,32,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
              <div style={{ background: 'white', borderRadius: '20px', padding: '24px', maxWidth: '420px', width: '100%', fontFamily: "var(--font-display)" }}>
                <p style={{ fontWeight: 800, fontSize: '1.1rem', color: '#191c20', marginBottom: '8px' }}>Kamu sudah pernah daftar 👋</p>
                <p style={{ fontSize: '0.88rem', color: '#464652', lineHeight: 1.6, marginBottom: '18px' }}>
                  Nomor WhatsApp dan email ini sudah tersimpan atas nama <b>{nameChoice.saved}</b>, tapi tadi kamu menulis <b>{nameChoice.typed}</b>. Mau pakai nama yang mana?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button type="button" onClick={() => pickName(false)} className="btn-primary" style={{ justifyContent: 'center', padding: '12px' }}>
                    Pakai "{nameChoice.saved}" (yang sudah tersimpan)
                  </button>
                  <button type="button" onClick={() => pickName(true)} style={{ padding: '12px', borderRadius: '999px', border: '1.5px solid #6728e4', background: 'white', color: '#6728e4', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: "var(--font-display)" }}>
                    Pakai "{nameChoice.typed}" (yang barusan saya tulis)
                  </button>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Niche * <span style={{ fontWeight: 400, color: '#777683' }}>(boleh lebih dari satu)</span></label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {NICHES.map((n) => (
                <Pill key={n} label={n} selected={niches.includes(n)} onClick={() => setNiches((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]))} />
              ))}
            </div>
          </div>

          {askDomicile && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }} className="form-2col">
            <div>
              <label style={labelStyle}>Provinsi Domisili *</label>
              <select value={province} onChange={(e) => onProvinceChange(e.target.value)} style={inputStyle}>
                <option value="">Pilih provinsi</option>
                {provinces.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Kota / Kabupaten *</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} disabled={!province} style={inputStyle}>
                <option value="">{province ? 'Pilih kota / kabupaten' : 'Pilih provinsi dulu'}</option>
                {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>}

          {platforms.map((p) => (
            <div key={p} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }} className="form-2col">
              <div>
                <label style={labelStyle}>Username {PLATFORM_LABELS[p] ?? p} *</label>
                <input value={socials[p]?.username ?? ''} onChange={(e) => setSocial(p, { username: e.target.value })} placeholder="@username" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>
                  Followers {PLATFORM_LABELS[p] ?? p} *
                  {minFollowers(p) ? <span style={{ fontWeight: 400, color: '#777683' }}> (min. {minFollowers(p)!.toLocaleString('id-ID')})</span> : null}
                </label>
                <input type="number" min={0} inputMode="numeric" value={socials[p]?.followers ?? ''} onChange={(e) => setSocial(p, { followers: e.target.value })} placeholder={minFollowers(p) ? String(minFollowers(p)) : '1000'} style={inputStyle} />
              </div>
            </div>
          ))}

          {showPic && (
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>PIC *</label>
              <select value={picUserId} onChange={(e) => setPicUserId(e.target.value)} style={inputStyle}>
                <option value="">Pilih PIC kamu</option>
                {campaign.picOptions!.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
          )}

          {fields.handleBy && (
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Handle by{fields.handleByRequired && ' *'}</label>
              <input value={handleBy} onChange={(e) => setHandleBy(e.target.value)} placeholder="Nama HB + nomor WA (mis. Rina 081234567890)" style={inputStyle} />
            </div>
          )}

          {(campaign.customFields || []).map((f) => (
            <div key={f.id} style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>{f.label}{f.required && ' *'}</label>
              {f.type === 'text' && (
                <input value={(customValues[f.id] as string) || ''} onChange={(e) => setCustomValue(f.id, e.target.value)} style={inputStyle} />
              )}
              {f.type === 'number' && (
                <input type="number" value={(customValues[f.id] as string) || ''} onChange={(e) => setCustomValue(f.id, e.target.value)} style={inputStyle} />
              )}
              {f.type === 'textarea' && (
                <textarea value={(customValues[f.id] as string) || ''} onChange={(e) => setCustomValue(f.id, e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              )}
              {f.type === 'select' && (
                <select value={(customValues[f.id] as string) || ''} onChange={(e) => setCustomValue(f.id, e.target.value)} style={inputStyle}>
                  <option value="">Pilih salah satu</option>
                  {(f.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              )}
              {f.type === 'checkbox' && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(f.options || []).map((o) => (
                    <Pill key={o} label={o} selected={((customValues[f.id] as string[]) || []).includes(o)} onClick={() => toggleCustomCheckbox(f.id, o)} />
                  ))}
                </div>
              )}
            </div>
          ))}

          {submitError && <p role="alert" style={{ color: '#ba1a1a', fontSize: '0.85rem', marginBottom: '16px', fontFamily: "var(--font-display)" }}>{submitError}</p>}

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '16px', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}
