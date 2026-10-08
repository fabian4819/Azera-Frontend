import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import api from '../../lib/api';
import { buildBroadcast } from '../../lib/broadcast';
import { NICHES as niches } from '../../lib/niches';
import { WILAYAH_API, type WilayahOption } from '../../lib/wilayah';
import ChecklistDropdown from '../../components/ui/ChecklistDropdown';
import CustomFormBuilder, { cleanFields, type CustomField, type ApplyFields } from './CustomFormBuilder';
import BroadcastShareModal from './BroadcastShareModal';

const platforms = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'threads', label: 'Threads' },
  { value: 'x', label: 'X' },
];

interface Brand { _id: string; namaBrand: string }
interface PicUser { _id: string; name: string; email: string; phone: string }

/** Textarea "satu baris = satu item" → array */
const lines = (v: string) => v.split('\n').map((l) => l.trim()).filter(Boolean);

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #c7c8cf',
  fontSize: '0.875rem', color: '#191c20', background: 'white', outline: 'none',
  fontFamily: "var(--font-display)",
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontWeight: 600, fontSize: '0.8rem', color: '#191c20',
  marginBottom: '5px', fontFamily: "var(--font-display)",
};

const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)', marginBottom: '20px',
};

const SectionTitle = ({ title, hint }: { title: string; hint?: string }) => (
  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1rem', color: '#6728e4', marginBottom: '18px' }}>
    {title}{hint && <span style={{ display: 'block', fontWeight: 400, fontSize: '0.78rem', color: '#777683', marginTop: '4px' }}>{hint}</span>}
  </p>
);

const Steps = ({ step }: { step: 1 | 2 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', fontFamily: "var(--font-display)", fontSize: '0.85rem', fontWeight: 700 }}>
    {['Kebutuhan Campaign', 'Setup Form'].map((label, i) => (
      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: step === i + 1 ? '#6728e4' : '#9a99a6' }}>
        {i > 0 && <span style={{ width: '28px', height: '2px', background: '#e1e0ff' }} />}
        <span style={{ width: '26px', height: '26px', borderRadius: '50%', display: 'grid', placeItems: 'center', background: step === i + 1 ? '#6728e4' : '#e1e0ff', color: step === i + 1 ? 'white' : '#6728e4' }}>{i + 1}</span>
        {label}
      </div>
    ))}
  </div>
);

const Pill = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
  <button type="button" onClick={onClick} style={{
    padding: '7px 14px', borderRadius: '999px', border: 'none',
    background: selected ? 'linear-gradient(135deg, #6728e4, #814bfe)' : '#e1e0ff',
    color: selected ? 'white' : '#6728e4', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
    fontFamily: "var(--font-display)",
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
  const [minFollowers, setMinFollowers] = useState<Record<string, string>>({});
  // Kriteria domisili (opsional, bisa lebih dari 1), id wilayah, dikirim sebagai nama saat simpan
  const [provinceOptions, setProvinceOptions] = useState<WilayahOption[]>([]);
  const [provinceIds, setProvinceIds] = useState<string[]>([]);
  const [citiesByProvince, setCitiesByProvince] = useState<Record<string, WilayahOption[]>>({});
  const [cityIds, setCityIds] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [type, setType] = useState<'online' | 'offline'>('online');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTimeWindow, setEventTimeWindow] = useState('');
  // Listing / broadcast
  const [creatorFee, setCreatorFee] = useState('');
  const [feeNote, setFeeNote] = useState('');
  const [picFee, setPicFee] = useState('');
  const [mgFee, setMgFee] = useState('');
  const [benefits, setBenefits] = useState('');
  const [requirements, setRequirements] = useState('');
  const [sow, setSow] = useState('');
  const [infoLink, setInfoLink] = useState('');
  // Tahap 2: setup form apply
  const [step, setStep] = useState<1 | 2>(1);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [applyFields, setApplyFields] = useState<ApplyFields>({ pic: true, handleBy: true, handleByRequired: false });
  const [allPics, setAllPics] = useState<PicUser[]>([]);
  const [picIds, setPicIds] = useState<string[]>([]);
  const [created, setCreated] = useState<{ id: string; broadcast: string } | null>(null);

  useEffect(() => {
    api.get('/admin/brands').then((res) => setBrands(res.data)).catch(() => setBrands([]));
    api.get('/admin/pic').then((res) => setAllPics(res.data)).catch(() => setAllPics([]));
    fetch(`${WILAYAH_API}/provinces.json`).then((r) => r.json()).then(setProvinceOptions).catch(() => setProvinceOptions([]));
  }, []);

  // Kota yang provinsinya dilepas ikut dilepas; daftar kota provinsi baru di-fetch sekali (di-cache)
  const pickProvinces = (ids: string[]) => {
    setProvinceIds(ids);
    const keep = new Set(ids.flatMap((id) => (citiesByProvince[id] || []).map((c) => c.id)));
    setCityIds((prev) => prev.filter((c) => keep.has(c)));
    for (const id of ids.filter((x) => !citiesByProvince[x])) {
      fetch(`${WILAYAH_API}/regencies/${id}.json`).then((r) => r.json())
        .then((data: WilayahOption[]) => setCitiesByProvince((prev) => ({ ...prev, [id]: data })))
        .catch(() => undefined);
    }
  };
  const provinceName = (id: string) => provinceOptions.find((p) => p.id === id)?.name || '';
  const cityOptions = provinceIds.flatMap((pid) => (citiesByProvince[pid] || []).map((c) => ({ id: c.id, label: c.name, sub: provinceName(pid) })));
  const cityName = (id: string) => cityOptions.find((c) => c.id === id)?.label || '';

  const toggle = (list: string[], setList: (v: string[]) => void, val: string) => {
    if (list.includes(val)) setList(list.filter((v) => v !== val));
    else setList([...list, val]);
  };

  const num = (v: string) => (v ? Number(v) : undefined);

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!brandId || !name || !objective || !budget) {
      setError('Brand, nama, tujuan, dan budget wajib diisi.');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0 });
  };

  const onSubmit = async () => {
    setError('');
    setSaving(true);
    try {
      const res = await api.post('/admin/campaigns', {
        brandId, name, objective,
        budget: Number(budget),
        deliverables: lines(sow),
        fee: { creatorFee: num(creatorFee), picFee: num(picFee), mgFee: num(mgFee) },
        feeNote: feeNote.trim() || undefined,
        benefits: lines(benefits),
        requirements: lines(requirements),
        infoLink: infoLink.trim() || undefined,
        customFields: cleanFields(customFields),
        applyFields,
        timeline: { startDate: startDate || undefined, endDate: endDate || undefined },
        criteria: {
          niches: selectedNiches,
          minFollowersByPlatform: Object.fromEntries(selectedPlatforms.filter((p) => minFollowers[p]).map((p) => [p, Number(minFollowers[p])])),
          provinces: provinceIds.map(provinceName).filter(Boolean),
          cities: cityIds.map(cityName).filter(Boolean),
          platforms: selectedPlatforms,
        },
        type,
        eventDetails: type === 'offline' ? { location: eventLocation, date: eventDate, timeWindow: eventTimeWindow } : undefined,
      });
      // PIC yang dicentang di tahap 2, best-effort, campaign sudah terbuat
      await Promise.all(allPics.filter((p) => picIds.includes(p._id)).map((p) => api.post(`/admin/campaigns/${res.data._id}/pic`, { email: p.email }).catch(() => undefined)));
      setCreated({ id: res.data._id, broadcast: buildBroadcast(res.data, `${window.location.origin}/apply/${res.data.applySlug}`) });
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
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#777683', fontSize: '0.875rem', marginBottom: '24px', padding: 0, fontFamily: "var(--font-display)" }}
      >
        <ArrowLeft size={16} />
        Kembali ke Campaigns
      </button>

      <Steps step={step} />
      {step === 1 && <div className="campaign-new-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, 400px)', gap: '20px', alignItems: 'start' }}>
      <form onSubmit={next} style={{ minWidth: 0 }}>
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
          <SectionTitle title="Fee, Benefit & SOW" hint="Dipakai untuk generate Broadcast Campaign. Satu baris = satu poin." />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }} className="form-2col">
            <div>
              <label style={labelStyle}>Fee Talent (Rp)</label>
              <input value={creatorFee} onChange={(e) => setCreatorFee(e.target.value)} type="number" placeholder="75000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Keterangan Fee</label>
              <input value={feeNote} onChange={(e) => setFeeNote(e.target.value)} placeholder="include beli tiket PRJ 30k" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Fee PIC (Rp)</label>
              <input value={picFee} onChange={(e) => setPicFee(e.target.value)} type="number" placeholder="7500" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Fee MG (Rp)</label>
              <input value={mgFee} onChange={(e) => setMgFee(e.target.value)} type="number" placeholder="7500" style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Benefit Lain</label>
            <textarea value={benefits} onChange={(e) => setBenefits(e.target.value)} rows={3} placeholder={'🎟️ Free tiket konser senilai Rp175.000\n🎶 Guest star: Naykilla, Sal Priadi, dll'} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Syarat / Kriteria</label>
            <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={3} placeholder={'Gen Z (18-25 tahun)\nTiktok no minimal folls\nBersedia visit di lokasi, hari, dan jam yang sudah ditentukan'} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>SOW</label>
            <textarea value={sow} onChange={(e) => setSow(e.target.value)} rows={3} placeholder={'1x Visit\n1x Video TikTok'} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div>
            <label style={labelStyle}>Link Info <span style={{ fontWeight: 400, color: '#777683' }}>(opsional, mis. post IG event)</span></label>
            <input value={infoLink} onChange={(e) => setInfoLink(e.target.value)} placeholder="https://www.instagram.com/p/..." style={inputStyle} />
          </div>
        </div>

        <div style={cardStyle}>
          <SectionTitle title="Kriteria Creator" hint="Untuk Smart Curation." />
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
          {selectedPlatforms.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }} className="form-2col">
              {platforms.filter((p) => selectedPlatforms.includes(p.value)).map((p) => (
                <div key={p.value}>
                  <label style={labelStyle}>Min. Followers {p.label} <span style={{ fontWeight: 400, color: '#777683' }}>(kosong = bebas)</span></label>
                  <input value={minFollowers[p.value] ?? ''} onChange={(e) => setMinFollowers((m) => ({ ...m, [p.value]: e.target.value }))} type="number" min={0} placeholder="1000" style={inputStyle} />
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }} className="form-2col">
            <div>
              <label style={labelStyle}>Provinsi <span style={{ fontWeight: 400, color: '#777683' }}>(opsional, bisa lebih dari 1)</span></label>
              <ChecklistDropdown placeholder="Semua provinsi" options={provinceOptions.map((p) => ({ id: p.id, label: p.name }))} selected={provinceIds} onChange={pickProvinces} />
            </div>
            <div>
              <label style={labelStyle}>Kota / Kabupaten <span style={{ fontWeight: 400, color: '#777683' }}>(opsional, bisa lebih dari 1)</span></label>
              <ChecklistDropdown placeholder={provinceIds.length ? 'Semua kota di provinsi terpilih' : 'Pilih provinsi dulu'} options={cityOptions} selected={cityIds} onChange={setCityIds} disabled={!provinceIds.length} />
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#777683', marginTop: '6px', fontFamily: "var(--font-display)" }}>Provinsi & kota kosong = field domisili tidak ditanyakan di form apply.</p>
        </div>

        {error && <p style={{ color: '#ba1a1a', fontSize: '0.85rem', marginBottom: '16px', fontFamily: "var(--font-display)" }}>{error}</p>}

        <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
          Lanjut: Setup Form <ArrowRight size={18} />
        </button>
      </form>

      {/* top 104px = header admin sticky (top 16px + tinggi ±72px) + jarak 16px, supaya tidak ketutup header */}
      <aside style={{ ...cardStyle, position: 'sticky', top: '104px', padding: '22px', marginBottom: 0 }}>
        <SectionTitle title="Preview Broadcast" hint="Ikut ter-update saat form diisi. Masih bisa diedit setelah disimpan." />
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, maxHeight: 'calc(100vh - 260px)', overflowY: 'auto', background: '#f8f9ff', borderRadius: '12px', padding: '14px', fontSize: '0.8rem', lineHeight: 1.55, color: '#191c20', fontFamily: "var(--font-display)" }}>
          {buildBroadcast({
            name: name || 'Nama Campaign', type,
            eventDetails: { location: eventLocation, date: eventDate || undefined, timeWindow: eventTimeWindow },
            fee: { creatorFee: num(creatorFee), picFee: num(picFee), mgFee: num(mgFee) },
            feeNote: feeNote.trim(), benefits: lines(benefits), requirements: lines(requirements), deliverables: lines(sow), infoLink,
          }, `${window.location.origin}/apply/…`)}
        </pre>
      </aside>
      </div>}

      {step === 2 && (
        <div>
          <CustomFormBuilder
            initial={customFields}
            initialApplyFields={applyFields}
            platforms={selectedPlatforms}
            minFollowers={minFollowers}
            askDomicile={provinceIds.length + cityIds.length > 0}
            onChange={(f, a) => { setCustomFields(f); setApplyFields(a); }}
            pics={allPics}
            assignedPicIds={picIds}
            onTogglePic={async (p, on) => setPicIds((ids) => (on ? [...ids, p._id] : ids.filter((i) => i !== p._id)))}
          />
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            {error && <p style={{ color: '#ba1a1a', fontSize: '0.85rem', marginBottom: '16px', fontFamily: "var(--font-display)" }}>{error}</p>}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '14px 20px', borderRadius: '12px', border: '1.5px solid #6728e4', background: 'white', color: '#6728e4', fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-display)" }}>
                <ArrowLeft size={16} /> Kembali
              </button>
              <button type="button" onClick={() => void onSubmit()} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '14px', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Menyimpan...' : 'Simpan Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {created && (
        <BroadcastShareModal campaignId={created.id} initialText={created.broadcast} onClose={() => navigate(`/admin/campaigns/${created.id}`)} />
      )}
    </div>
  );
}
