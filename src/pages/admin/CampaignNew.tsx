import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';
import api from '../../lib/api';

const niches = ['Beauty', 'Fashion', 'Food & Beverage', 'Travel', 'Tech', 'Fitness', 'Parenting', 'Gaming', 'Finance', 'Education', 'Lifestyle', 'Entertainment'];
const platforms = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'threads', label: 'Threads' },
  { value: 'x', label: 'X' },
];

interface Brand { _id: string; namaBrand: string }

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #c7c8cf',
  fontSize: '0.875rem', color: '#191c20', background: 'white', outline: 'none',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#191c20',
  marginBottom: '5px', fontFamily: "'Plus Jakarta Sans', sans-serif",
};

const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)', marginBottom: '20px',
};

const SectionTitle = ({ title }: { title: string }) => (
  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#6728e4', marginBottom: '18px' }}>
    {title}
  </p>
);

const Pill = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
  <button type="button" onClick={onClick} style={{
    padding: '7px 14px', borderRadius: '999px', border: 'none',
    background: selected ? 'linear-gradient(135deg, #6728e4, #814bfe)' : '#e1e0ff',
    color: selected ? 'white' : '#6728e4', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  }}>
    {label}
  </button>
);

export default function CampaignNew() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [brandId, setBrandId] = useState('');
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [minFollowers, setMinFollowers] = useState('');
  const [provinces, setProvinces] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [type, setType] = useState<'online' | 'offline'>('online');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTimeWindow, setEventTimeWindow] = useState('');

  useEffect(() => {
    api.get('/admin/brands').then((res) => setBrands(res.data)).catch(() => setBrands([]));
  }, []);

  const toggle = (list: string[], setList: (v: string[]) => void, val: string) => {
    if (list.includes(val)) setList(list.filter((v) => v !== val));
    else setList([...list, val]);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!brandId || !name || !objective || !budget) {
      setError('Brand, nama, tujuan, dan budget wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      const res = await api.post('/admin/campaigns', {
        brandId, name, objective,
        budget: Number(budget),
        timeline: { startDate: startDate || undefined, endDate: endDate || undefined },
        criteria: {
          niches: selectedNiches,
          minFollowers: minFollowers ? Number(minFollowers) : undefined,
          provinces: provinces ? provinces.split(',').map((p) => p.trim()).filter(Boolean) : [],
          platforms: selectedPlatforms,
        },
        type,
        eventDetails: type === 'offline' ? { location: eventLocation, date: eventDate, timeWindow: eventTimeWindow } : undefined,
      });
      navigate(`/admin/campaigns/${res.data._id}`);
    } catch {
      setError('Gagal membuat campaign. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate('/admin/campaigns')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#777683', fontSize: '0.875rem', marginBottom: '24px', padding: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <ArrowLeft size={16} />
        Kembali ke Campaigns
      </button>

      <form onSubmit={onSubmit} style={{ maxWidth: '720px' }}>
        <div style={cardStyle}>
          <SectionTitle title="Informasi Dasar" />
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Brand *</label>
            <select value={brandId} onChange={(e) => setBrandId(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Pilih brand</option>
              {brands.map((b) => <option key={b._id} value={b._id}>{b.namaBrand}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Nama Campaign *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Pigeon Nano May" style={inputStyle} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Tujuan Campaign * <span style={{ fontWeight: 400, color: '#777683' }}>(input mentah, nanti bisa dirapikan AI)</span></label>
            <textarea value={objective} onChange={(e) => setObjective(e.target.value)} rows={3} placeholder="Naikkan awareness produk lewat nano KOL ibu muda..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }} className="form-2col">
            <div>
              <label style={labelStyle}>Budget (Rp) *</label>
              <input value={budget} onChange={(e) => setBudget(e.target.value)} type="number" placeholder="5000000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Tipe Campaign</label>
              <select value={type} onChange={(e) => setType(e.target.value as 'online' | 'offline')} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="online">Online</option>
                <option value="offline">Offline / Event</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' }} className="form-2col">
            <div>
              <label style={labelStyle}>Mulai</label>
              <input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Selesai</label>
              <input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" style={inputStyle} />
            </div>
          </div>

          {type === 'offline' && (
            <div style={{ marginTop: '14px', background: '#f8f9ff', borderRadius: '12px', padding: '16px' }}>
              <p style={{ ...labelStyle, marginBottom: '10px' }}>Detail Event</p>
              <div style={{ marginBottom: '10px' }}>
                <label style={labelStyle}>Lokasi</label>
                <input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="Dome Senayan Park" style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }} className="form-2col">
                <div>
                  <label style={labelStyle}>Tanggal</label>
                  <input value={eventDate} onChange={(e) => setEventDate(e.target.value)} type="date" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Jam</label>
                  <input value={eventTimeWindow} onChange={(e) => setEventTimeWindow(e.target.value)} placeholder="09.00–12.30 WIB" style={inputStyle} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={cardStyle}>
          <SectionTitle title="Kriteria Creator" />
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Niche</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {niches.map((n) => <Pill key={n} label={n} selected={selectedNiches.includes(n)} onClick={() => toggle(selectedNiches, setSelectedNiches, n)} />)}
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Platform</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {platforms.map((p) => <Pill key={p.value} label={p.label} selected={selectedPlatforms.includes(p.value)} onClick={() => toggle(selectedPlatforms, setSelectedPlatforms, p.value)} />)}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }} className="form-2col">
            <div>
              <label style={labelStyle}>Min. Followers</label>
              <input value={minFollowers} onChange={(e) => setMinFollowers(e.target.value)} type="number" placeholder="1000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Provinsi <span style={{ fontWeight: 400, color: '#777683' }}>(pisah koma)</span></label>
              <input value={provinces} onChange={(e) => setProvinces(e.target.value)} placeholder="Jawa Tengah, DKI Jakarta" style={inputStyle} />
            </div>
          </div>
        </div>

        {error && <p style={{ color: '#ba1a1a', fontSize: '0.85rem', marginBottom: '16px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{error}</p>}

        <button type="submit" disabled={saving} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', opacity: saving ? 0.7 : 1 }}>
          <Zap size={18} />
          {saving ? 'Membuat...' : 'Buat Campaign'}
        </button>
      </form>
    </div>
  );
}
