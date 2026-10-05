import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import api from '../lib/api';

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

/** Form pendaftaran campaign: field default (nama/WA/email + PIC/Handle by kalau aktif) + pertanyaan
 * custom dari admin. Creator tidak perlu isi Form Creator (/kol/register) dulu. */
export default function CampaignApply() {
  const { slug } = useParams();
  const [campaign, setCampaign] = useState<CampaignInfo | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [picUserId, setPicUserId] = useState('');
  const [handleBy, setHandleBy] = useState('');
  const [customValues, setCustomValues] = useState<Record<string, string | string[]>>({});

  useEffect(() => {
    api.get(`/campaigns/${slug}`)
      .then((res) => setCampaign(res.data))
      .catch(() => setNotFound(true));
  }, [slug]);

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
        name, phone, email,
        picUserId: showPic ? picUserId : undefined,
        handleBy: fields.handleBy ? handleBy : undefined,
        customAnswers: customValues,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setSubmitError(message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9ff', padding: '24px' }}>
        <p style={{ fontFamily: "var(--font-display)", color: '#464652' }}>Campaign tidak ditemukan atau pendaftaran sudah ditutup.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9ff', padding: '24px', paddingTop: '100px' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
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
    return <div style={{ minHeight: '100vh', background: '#f8f9ff' }} />;
  }

  return (
    <div style={{ background: '#f8f9ff', minHeight: '100vh', paddingTop: '80px', position: 'relative', overflow: 'hidden' }}>
      <div className="blob" style={{ width: '400px', height: '400px', background: '#e1e0ff', opacity: 0.2, top: '5%', right: '-100px' }} />
      <div className="blob" style={{ width: '350px', height: '350px', background: '#ffd9e1', opacity: 0.15, bottom: '5%', left: '-100px' }} />
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span className="section-label" style={{ marginBottom: '12px' }}>{campaign.brand?.namaBrand}</span>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#191c20', lineHeight: 1.15 }}>
            <span className="gradient-text">{campaign.name}</span>
          </h1>
        </div>

        {campaign.briefContent && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <p style={{ fontFamily: "var(--font-display)", color: '#464652', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{campaign.briefContent}</p>
          </div>
        )}

        <form onSubmit={onSubmit} style={{ background: 'white', borderRadius: '24px', padding: 'clamp(24px, 5vw, 40px)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Nama Lengkap *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" autoComplete="name" style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }} className="form-2col">
            <div>
              <label style={labelStyle}>Nomor WhatsApp *</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxxxxxxxx" inputMode="tel" autoComplete="tel" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" autoComplete="email" style={inputStyle} />
            </div>
          </div>

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
              <input value={handleBy} onChange={(e) => setHandleBy(e.target.value)} placeholder="Nama yang meng-handle kamu" style={inputStyle} />
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
  );
}
