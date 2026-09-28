import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../lib/api';
import {
  PORTFOLIO_CATEGORIES, SCOPE_OPTIONS, KOL_NICHES, brandKey, PLATFORM_LABELS, creatorLabel, formatCompact, totalViews,
  type PortfolioItem, type ResultPlatform, type TopCreator,
} from '../../lib/portfolio';

type CreatorPlatform = TopCreator['platform'];
type FormCreator = Required<TopCreator>;

// angka disimpan sebagai string di form: '' = data tidak tersedia (dikirim null, bukan 0)
interface FormPlatform {
  platform: ResultPlatform;
  platformName: string;
  creators: string;
  posts: string;
  views: string;
  reach: string;
  impressions: string;
  engagement: string;
  er: string;
  showExtraPublic: boolean;
  extraOpen: boolean;
}

interface FormState {
  status: 'draft' | 'published';
  brand: string;
  title: string;
  bubbleLabel: string;
  category: string;
  objective: string;
  niches: string[];
  nicheOther: string;
  nicheOtherOn: boolean;
  period: string;
  hashtag: string;
  kolCount: string;
  deliverables: string;
  scope: string[];
  scopeOther: string;
  scopeOtherOn: boolean;
  partnerAgency: string;
  featured: boolean;
  platforms: FormPlatform[];
  cpv: string;
  cpvPublic: boolean;
  affiliate: { clicks: string; orders: string; gmv: string };
  topCreators: FormCreator[];
}

const emptyCreator = (): FormCreator => ({ name: '', platform: 'instagram', postLink: '', views: '', likes: '', comments: '', shares: '' });
const emptyPlatform = (): FormPlatform => ({
  platform: 'instagram', platformName: '', creators: '', posts: '', views: '',
  reach: '', impressions: '', engagement: '', er: '', showExtraPublic: false, extraOpen: false,
});

const emptyForm: FormState = {
  status: 'draft',
  brand: '', title: '', bubbleLabel: '', category: '', objective: '', niches: [], nicheOther: '', nicheOtherOn: false, period: '', hashtag: '', kolCount: '', deliverables: '',
  scope: [], scopeOther: '', scopeOtherOn: false, partnerAgency: '', featured: false,
  platforms: [], cpv: '', cpvPublic: false, affiliate: { clicks: '', orders: '', gmv: '' }, topCreators: [],
};

const str = (v: unknown) => (v === null || v === undefined ? '' : String(v));
const toNum = (v: string) => (v.trim() === '' ? null : Number(v));

const thStyle: React.CSSProperties = {
  padding: '14px 16px',
  textAlign: 'left',
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  color: '#191c20',
  fontSize: '0.78rem',
  whiteSpace: 'nowrap',
  letterSpacing: '0.04em',
};

const tdStyle: React.CSSProperties = {
  padding: '14px 16px',
  fontSize: '0.875rem',
  color: '#464652',
  fontFamily: 'var(--font-display)',
};

const modalInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '10px',
  border: '1.5px solid #c7c8cf',
  fontSize: '0.875rem',
  outline: 'none',
  fontFamily: 'var(--font-display)',
  background: 'white',
  color: '#191c20',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontWeight: 600,
  fontSize: '0.8rem',
  color: '#191c20',
  marginBottom: '5px',
  fontFamily: 'var(--font-display)',
};

const sectionTitle: React.CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', color: '#191c20', marginBottom: '12px' };
const hintStyle: React.CSSProperties = { fontSize: '0.72rem', color: '#8a8a99', marginTop: '-6px', marginBottom: '14px', lineHeight: 1.5 };
const miniLabel: React.CSSProperties = { ...labelStyle, fontSize: '0.72rem', fontWeight: 500 };
const miniInput: React.CSSProperties = { ...modalInputStyle, padding: '8px 10px', fontSize: '0.8rem' };
const emptyBox: React.CSSProperties = { color: '#777683', fontSize: '0.8rem', textAlign: 'center', padding: '14px', background: '#f8f9ff', borderRadius: '10px' };
const smallBtn: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', background: '#e1e0ff', color: '#6728e4', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' };
const linkBtn: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#6728e4', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-display)' };
const checkChip = (on: boolean): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '999px', cursor: 'pointer',
  border: `1.5px solid ${on ? '#6728e4' : '#e1e0ff'}`, background: on ? '#f3efff' : 'white', fontSize: '0.78rem', fontFamily: 'var(--font-display)', color: '#191c20',
});

export default function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [contentFiles, setContentFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [campaignCost, setCampaignCost] = useState('');

  const fetchItems = async () => {
    await Promise.resolve();
    setLoading(true);
    try {
      const res = await api.get('/admin/portfolio');
      setItems(res.data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchItems();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setLogoFile(null);
    setContentFiles([]);
    setFormError('');
    setCampaignCost('');
    setShowModal(true);
  };

  const openEdit = (item: PortfolioItem) => {
    setEditId(item._id);
    setForm({
      status: item.status ?? 'published', // data lama tanpa status sudah tayang
      brand: item.brand,
      title: item.title || '',
      bubbleLabel: item.bubbleLabel || '',
      category: item.category,
      objective: item.objective || '',
      niches: (item.niches || []).filter((n) => KOL_NICHES.includes(n)),
      nicheOther: (item.niches || []).filter((n) => !KOL_NICHES.includes(n)).join(', '),
      nicheOtherOn: (item.niches || []).some((n) => !KOL_NICHES.includes(n)),
      period: item.period || '',
      hashtag: item.hashtag || '',
      kolCount: str(item.kolCount),
      deliverables: item.deliverables || '',
      scope: (item.scope || []).filter((x) => SCOPE_OPTIONS.includes(x)),
      scopeOther: item.scopeOther || '',
      scopeOtherOn: !!item.scopeOther,
      partnerAgency: item.partnerAgency || '',
      featured: !!item.featured,
      platforms: (item.platforms || []).map((r) => ({
        platform: r.platform, platformName: r.platformName || '',
        creators: str(r.creators), posts: str(r.posts), views: str(r.views),
        reach: str(r.reach), impressions: str(r.impressions), engagement: str(r.engagement), er: r.er || '',
        showExtraPublic: !!r.showExtraPublic,
        extraOpen: [r.reach, r.impressions, r.engagement, r.er].some((v) => str(v) !== ''),
      })),
      cpv: item.cpv || '',
      cpvPublic: !!item.cpvPublic,
      affiliate: { clicks: item.affiliate?.clicks || '', orders: item.affiliate?.orders || '', gmv: item.affiliate?.gmv || '' },
      topCreators: (item.topCreators || []).map((c) => ({ ...emptyCreator(), ...c })),
    });
    setLogoFile(null);
    setContentFiles([]);
    setFormError('');
    setCampaignCost('');
    setShowModal(true);
  };

  const addCreator = () => {
    if (form.topCreators.length >= 3) return;
    setForm((f) => ({ ...f, topCreators: [...f.topCreators, emptyCreator()] }));
  };
  const updateCreator = (i: number, patch: Partial<FormCreator>) => {
    setForm((f) => ({ ...f, topCreators: f.topCreators.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) }));
  };
  const removeCreator = (i: number) => {
    setForm((f) => ({ ...f, topCreators: f.topCreators.filter((_, idx) => idx !== i) }));
  };

  const addPlatform = () => setForm((f) => ({ ...f, platforms: [...f.platforms, emptyPlatform()] }));
  const updatePlatform = (i: number, patch: Partial<FormPlatform>) => {
    setForm((f) => ({ ...f, platforms: f.platforms.map((r, idx) => (idx === i ? { ...r, ...patch } : r)) }));
  };
  const removePlatform = (i: number) => setForm((f) => ({ ...f, platforms: f.platforms.filter((_, idx) => idx !== i) }));

  const toggleNiche = (opt: string) => {
    setForm((f) => ({ ...f, niches: f.niches.includes(opt) ? f.niches.filter((x) => x !== opt) : [...f.niches, opt] }));
  };

  const toggleScope = (opt: string) => {
    setForm((f) => ({ ...f, scope: f.scope.includes(opt) ? f.scope.filter((x) => x !== opt) : [...f.scope, opt] }));
  };

  // total views sama persis dengan yang tampil publik → CPV konsisten dengan angka yang dipakai
  const formViews = totalViews({ _id: '', brand: '', category: '', platforms: form.platforms.map((r) => ({ platform: r.platform, creators: 0, posts: 0, views: toNum(r.views) })) });
  const formPosts = form.platforms.reduce((s, r) => s + (Number(r.posts) || 0), 0);
  const computeCpv = () => {
    const cost = Number(campaignCost);
    if (!cost || !formViews) return;
    setForm((f) => ({ ...f, cpv: `Rp${Math.round(cost / formViews).toLocaleString('id-ID')}` }));
  };

  const save = async (status: FormState['status']) => {
    setSaving(true);
    setFormError('');
    try {
      const fd = new FormData();
      const { platforms, topCreators, scope, niches, nicheOther, nicheOtherOn, affiliate, scopeOtherOn, scopeOther, ...flat } = form;
      Object.entries({ ...flat, status, scopeOther: scopeOtherOn ? scopeOther : '' }).forEach(([k, v]) => fd.append(k, String(v)));
      fd.append('scope', JSON.stringify(scope));
      // niche "Lainnya" (dipisah koma) disimpan sebagai niche biasa, jadi tampil publik sama seperti niche baku
      const customNiches = nicheOtherOn ? nicheOther.split(',').map((n) => n.trim()).filter(Boolean) : [];
      fd.append('niches', JSON.stringify([...new Set([...niches, ...customNiches])]));
      fd.append('affiliate', JSON.stringify(affiliate));
      fd.append('platforms', JSON.stringify(platforms.map((r) => ({
        ...r,
        extraOpen: undefined, // state UI saja, tidak disimpan
        platformName: r.platform === 'other' ? r.platformName : '',
        creators: toNum(r.creators), posts: toNum(r.posts), views: toNum(r.views),
        reach: toNum(r.reach), impressions: toNum(r.impressions), engagement: toNum(r.engagement),
      }))));
      fd.append('topCreators', JSON.stringify(topCreators.filter((c) => c.name.trim())));
      if (logoFile) fd.append('logo', logoFile);
      contentFiles.forEach((f) => fd.append('contents', f));

      if (editId) {
        await api.patch(`/admin/portfolio/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/admin/portfolio', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setFormError(msg || 'Gagal menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await api.delete(`/admin/portfolio/${id}`);
      setDeleteConfirm(null);
      fetchItems();
    } catch {
      alert('Gagal menghapus.');
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button onClick={openAdd} className="btn-primary" style={{ gap: '8px', padding: '10px 20px', fontSize: '0.875rem' }}>
          <Plus size={16} />
          Tambah Portfolio
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e1e0ff', overflow: 'hidden', boxShadow: '0 2px 12px rgba(107,46,232,0.06)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8f9ff', borderBottom: '1px solid #e1e0ff' }}>
                {['Brand', 'Judul', 'Kategori', 'Kreator', 'Postingan', 'Views', 'Status', 'Featured', 'Tanggal', 'Aksi'].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} style={{ ...tdStyle, textAlign: 'center', padding: '48px' }}>Memuat...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={10} style={{ ...tdStyle, textAlign: 'center', padding: '48px' }}>Belum ada portfolio.</td></tr>
              ) : items.map((item, i) => (
                <tr
                  key={item._id}
                  style={{ borderBottom: '1px solid #e1e0ff', background: i % 2 === 0 ? 'white' : '#fcfcff', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#F8F6FF')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? 'white' : '#fcfcff')}
                >
                  <td style={{ ...tdStyle, fontWeight: 600, color: '#191c20' }}>{item.brand}</td>
                  <td style={tdStyle}>{item.title || '—'}</td>
                  <td style={tdStyle}>
                    <span style={{ background: '#e1e0ff', color: '#6728e4', borderRadius: '999px', padding: '3px 10px', fontSize: '0.72rem', fontFamily: "var(--font-display)", fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {item.category || '—'}
                    </span>
                  </td>
                  <td style={tdStyle}>{item.kolCount ?? '—'}</td>
                  <td style={tdStyle}>{item.platforms?.length ? item.platforms.reduce((s, r) => s + (r.posts || 0), 0) : '—'}</td>
                  <td style={tdStyle}>{(() => { const v = totalViews(item); return v === null ? '—' : formatCompact(v); })()}</td>
                  <td style={tdStyle}>
                    <span style={{ color: item.status === 'draft' ? '#b45309' : '#10B981', fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '0.78rem' }}>
                      {item.status === 'draft' ? 'Draft' : 'Publish'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: item.featured ? '#10B981' : '#777683', fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '0.78rem' }}>
                      {item.featured ? 'Ya' : 'Tidak'}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{item.createdAt ? formatDate(item.createdAt) : '—'}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => openEdit(item)}
                        style={{ padding: '7px', background: '#e1e0ff', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#6728e4', display: 'flex' }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(item._id)}
                        style={{ padding: '7px', background: '#ffdad6', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#ba1a1a', display: 'flex' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: '1.1rem', color: '#191c20' }}>
                {editId ? 'Edit Portfolio' : 'Tambah Portfolio'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#777683', padding: '4px', display: 'flex' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={sectionTitle}>Informasi Campaign</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={labelStyle}>Nama Brand *</label>
                <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="Smartfren" list="portfolio-brands" style={modalInputStyle} />
                {/* pilih dari brand yang sudah ada supaya ejaan sama → campaign tergabung di satu bubble brand */}
                <datalist id="portfolio-brands">
                  {[...new Map(items.map((i) => [brandKey(i.brand), i.brand.trim()])).values()].map((b) => <option key={b} value={b} />)}
                </datalist>
              </div>
              <div>
                <label style={labelStyle}>Kategori *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={modalInputStyle}>
                  <option value="">Pilih</option>
                  {PORTFOLIO_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Judul Campaign *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Smartfren Up Campaign" style={modalInputStyle} />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Label Bubble Campaign</label>
              <input value={form.bubbleLabel} onChange={(e) => setForm({ ...form, bubbleLabel: e.target.value })} placeholder="Promo Ramadhan" style={modalInputStyle} />
              <p style={{ ...hintStyle, marginTop: '4px', marginBottom: 0 }}>
                Nama pendek campaign. Kalau brand ini punya lebih dari satu campaign, klik bubble brand di halaman Portfolio memunculkan bubble per campaign dengan label ini (kosong = pakai Judul Campaign).
                {form.brand.trim() && (() => {
                  const n = items.filter((i) => i._id !== editId && brandKey(i.brand) === brandKey(form.brand)).length;
                  return n > 0 ? <> Brand ini sudah punya <b>{n}</b> campaign lain.</> : null;
                })()}
              </p>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Objective *</label>
              <textarea
                value={form.objective}
                onChange={(e) => setForm({ ...form, objective: e.target.value })}
                rows={3}
                placeholder="Meningkatkan brand awareness melalui konten kreator."
                style={{ ...modalInputStyle, resize: 'vertical', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Niche KOL</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {KOL_NICHES.map((opt) => (
                  <label key={opt} style={checkChip(form.niches.includes(opt))}>
                    <input type="checkbox" checked={form.niches.includes(opt)} onChange={() => toggleNiche(opt)} style={{ accentColor: '#6728e4' }} />
                    {opt}
                  </label>
                ))}
                <label style={checkChip(form.nicheOtherOn)}>
                  <input type="checkbox" checked={form.nicheOtherOn} onChange={(e) => setForm({ ...form, nicheOtherOn: e.target.checked })} style={{ accentColor: '#6728e4' }} />
                  Lainnya
                </label>
              </div>
              {form.nicheOtherOn && (
                <input value={form.nicheOther} onChange={(e) => setForm({ ...form, nicheOther: e.target.value })} placeholder="Isi sendiri, pisahkan dengan koma (mis. Otomotif, Home Living)" style={{ ...modalInputStyle, marginTop: '8px' }} />
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={labelStyle}>Periode Campaign</label>
                <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="Agustus 2026" style={modalInputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Hashtag</label>
                <input value={form.hashtag} onChange={(e) => setForm({ ...form, hashtag: e.target.value })} placeholder="#SmartfrenUp" style={modalInputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Total Kreator Aktif</label>
                <input type="number" min={0} value={form.kolCount} onChange={(e) => setForm({ ...form, kolCount: e.target.value })} placeholder="100" style={modalInputStyle} />
              </div>
            </div>
            <p style={hintStyle}>
              Total Kreator Aktif = jumlah kreator <b>unik</b> di seluruh campaign (diisi sekali, bukan dijumlah per platform). Tampil publik sebagai "{creatorLabel(form.category)}".
            </p>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Creator Deliverables</label>
              <input value={form.deliverables} onChange={(e) => setForm({ ...form, deliverables: e.target.value })} placeholder="1× TikTok video + mirroring Instagram Reels per KOL" style={modalInputStyle} />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Scope AZERA (hanya tampil di detail)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {SCOPE_OPTIONS.map((opt) => (
                  <label key={opt} style={checkChip(form.scope.includes(opt))}>
                    <input type="checkbox" checked={form.scope.includes(opt)} onChange={() => toggleScope(opt)} style={{ accentColor: '#6728e4' }} />
                    {opt}
                  </label>
                ))}
                <label style={checkChip(form.scopeOtherOn)}>
                  <input type="checkbox" checked={form.scopeOtherOn} onChange={(e) => setForm({ ...form, scopeOtherOn: e.target.checked })} style={{ accentColor: '#6728e4' }} />
                  Lainnya
                </label>
              </div>
              {form.scopeOtherOn && (
                <input value={form.scopeOther} onChange={(e) => setForm({ ...form, scopeOther: e.target.value })} placeholder="Scope lainnya" style={{ ...modalInputStyle, marginTop: '8px' }} />
              )}
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Kolaborasi dengan Agensi Lain</label>
              <input value={form.partnerAgency} onChange={(e) => setForm({ ...form, partnerAgency: e.target.value })} placeholder="Nama agensi (opsional)" style={modalInputStyle} />
              <p style={{ ...hintStyle, marginBottom: 0 }}>Tampil kecil di detail: "In collaboration with [Nama Agensi]".</p>
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: '#6728e4' }} />
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#191c20' }}>Tampilkan di featured homepage</span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <p style={{ ...sectionTitle, marginBottom: 0 }}>Platform dan Hasil</p>
              <button onClick={addPlatform} style={smallBtn}>
                <Plus size={13} /> Tambah Platform
              </button>
            </div>
            {form.platforms.length === 0 ? (
              <p style={emptyBox}>Belum ada platform. Satu baris per platform yang dipakai.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {form.platforms.map((r, i) => (
                  <div key={i} style={{ border: '1.5px solid #e1e0ff', borderRadius: '12px', padding: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr auto', gap: '8px', alignItems: 'end' }}>
                      <div>
                        <label style={miniLabel}>Platform *</label>
                        <select value={r.platform} onChange={(e) => updatePlatform(i, { platform: e.target.value as ResultPlatform })} style={miniInput}>
                          {(Object.keys(PLATFORM_LABELS) as ResultPlatform[]).map((p) => <option key={p} value={p}>{PLATFORM_LABELS[p]}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={miniLabel}>Kreator aktif *</label>
                        <input type="number" min={0} value={r.creators} onChange={(e) => updatePlatform(i, { creators: e.target.value })} placeholder="100" style={miniInput} />
                      </div>
                      <div>
                        <label style={miniLabel}>Postingan tayang *</label>
                        <input type="number" min={0} value={r.posts} onChange={(e) => updatePlatform(i, { posts: e.target.value })} placeholder="100" style={miniInput} />
                      </div>
                      <div>
                        <label style={miniLabel}>Total views</label>
                        <input type="number" min={0} value={r.views} onChange={(e) => updatePlatform(i, { views: e.target.value })} placeholder="Kosong = n/a" style={miniInput} />
                      </div>
                      <button onClick={() => removePlatform(i)} style={{ padding: '8px', background: '#ffdad6', border: 'none', borderRadius: '8px', color: '#ba1a1a', cursor: 'pointer', display: 'flex' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {r.platform === 'other' && (
                      <input value={r.platformName} onChange={(e) => updatePlatform(i, { platformName: e.target.value })} placeholder="Nama platform *" style={{ ...miniInput, marginTop: '8px' }} />
                    )}
                    <button onClick={() => updatePlatform(i, { extraOpen: !r.extraOpen })} style={{ ...linkBtn, marginTop: '8px' }}>
                      {r.extraOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />} Metrik Tambahan
                    </button>
                    {r.extraOpen && (
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                          <input type="number" min={0} value={r.reach} onChange={(e) => updatePlatform(i, { reach: e.target.value })} placeholder="Reach" style={miniInput} />
                          <input type="number" min={0} value={r.impressions} onChange={(e) => updatePlatform(i, { impressions: e.target.value })} placeholder="Impressions" style={miniInput} />
                          <input type="number" min={0} value={r.engagement} onChange={(e) => updatePlatform(i, { engagement: e.target.value })} placeholder="Engagement" style={miniInput} />
                          <input value={r.er} onChange={(e) => updatePlatform(i, { er: e.target.value })} placeholder="ER (mis. 4,2%)" style={miniInput} />
                        </div>
                        <label style={{ ...miniLabel, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={r.showExtraPublic} onChange={(e) => updatePlatform(i, { showExtraPublic: e.target.checked })} style={{ accentColor: '#6728e4' }} />
                          Tampilkan metrik tambahan di detail publik
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <p style={{ ...hintStyle, marginTop: '8px' }}>
              Total postingan tayang: <b>{formPosts.toLocaleString('id-ID')}</b> · Total views: <b>{formViews === null ? 'n/a' : formViews.toLocaleString('id-ID')}</b>.
              Kreator per platform tidak dijumlah menjadi total kreator — satu orang bisa posting di beberapa platform.
            </p>

            <p style={{ ...sectionTitle, marginTop: '18px' }}>Hasil Tambahan</p>
            <div style={{ border: '1.5px solid #e1e0ff', borderRadius: '12px', padding: '12px', marginBottom: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '8px', alignItems: 'end' }}>
                <div>
                  <label style={miniLabel}>Biaya campaign (hanya untuk hitung, tidak disimpan)</label>
                  <input type="number" min={0} value={campaignCost} onChange={(e) => setCampaignCost(e.target.value)} placeholder="57000000" style={miniInput} />
                </div>
                <button onClick={computeCpv} disabled={!Number(campaignCost) || !formViews} style={{ ...smallBtn, opacity: !Number(campaignCost) || !formViews ? 0.5 : 1 }}>Hitung ÷ views</button>
                <div>
                  <label style={miniLabel}>CPV campaign</label>
                  <input value={form.cpv} onChange={(e) => setForm({ ...form, cpv: e.target.value })} placeholder="Rp38" style={miniInput} />
                </div>
              </div>
              <label style={{ ...miniLabel, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.cpvPublic} onChange={(e) => setForm({ ...form, cpvPublic: e.target.checked })} style={{ accentColor: '#6728e4' }} />
                Tampilkan CPV di publik
              </label>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Affiliate (opsional, jika tersedia)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <input value={form.affiliate.clicks} onChange={(e) => setForm({ ...form, affiliate: { ...form.affiliate, clicks: e.target.value } })} placeholder="Klik" style={miniInput} />
                <input value={form.affiliate.orders} onChange={(e) => setForm({ ...form, affiliate: { ...form.affiliate, orders: e.target.value } })} placeholder="Pesanan" style={miniInput} />
                <input value={form.affiliate.gmv} onChange={(e) => setForm({ ...form, affiliate: { ...form.affiliate, gmv: e.target.value } })} placeholder="GMV (mis. Rp1,2M)" style={miniInput} />
              </div>
            </div>

            <p style={sectionTitle}>Logo & Contoh Konten</p>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <p style={labelStyle}>Top 3 Creator (opsional, tampil sebagai showcase video)</p>
                <button
                  onClick={addCreator}
                  disabled={form.topCreators.length >= 3}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: '#e1e0ff', color: '#6728e4', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-display)', opacity: form.topCreators.length >= 3 ? 0.5 : 1 }}
                >
                  <Plus size={13} /> Tambah Creator
                </button>
              </div>
              {form.topCreators.length === 0 ? (
                <p style={{ color: '#777683', fontSize: '0.8rem', textAlign: 'center', padding: '14px', background: '#f8f9ff', borderRadius: '10px' }}>Belum ada creator ditambahkan.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {form.topCreators.map((c, i) => (
                    <div key={i} style={{ border: '1.5px solid #e1e0ff', borderRadius: '12px', padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input value={c.name} onChange={(e) => updateCreator(i, { name: e.target.value })} placeholder={`Nama Creator ${i + 1}`} style={{ ...modalInputStyle, flex: 1, padding: '8px 10px', fontSize: '0.8rem' }} />
                        <select value={c.platform} onChange={(e) => updateCreator(i, { platform: e.target.value as CreatorPlatform })} style={{ ...modalInputStyle, width: '110px', padding: '8px 10px', fontSize: '0.8rem' }}>
                          <option value="instagram">Instagram</option>
                          <option value="tiktok">TikTok</option>
                        </select>
                        <button onClick={() => removeCreator(i)} style={{ padding: '8px', background: '#ffdad6', border: 'none', borderRadius: '8px', color: '#ba1a1a', cursor: 'pointer', display: 'flex', flexShrink: 0 }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <input value={c.postLink} onChange={(e) => updateCreator(i, { postLink: e.target.value })} placeholder="Link postingan asli (opsional) — instagram.com/p/... atau tiktok.com/@.../video/..." style={{ ...modalInputStyle, padding: '8px 10px', fontSize: '0.8rem', marginBottom: '8px' }} />
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                        <input value={c.views} onChange={(e) => updateCreator(i, { views: e.target.value })} placeholder="Views" style={{ ...modalInputStyle, padding: '8px 10px', fontSize: '0.78rem' }} />
                        <input value={c.likes} onChange={(e) => updateCreator(i, { likes: e.target.value })} placeholder="Likes" style={{ ...modalInputStyle, padding: '8px 10px', fontSize: '0.78rem' }} />
                        <input value={c.comments} onChange={(e) => updateCreator(i, { comments: e.target.value })} placeholder="Comments" style={{ ...modalInputStyle, padding: '8px 10px', fontSize: '0.78rem' }} />
                        <input value={c.shares} onChange={(e) => updateCreator(i, { shares: e.target.value })} placeholder="Shares" style={{ ...modalInputStyle, padding: '8px 10px', fontSize: '0.78rem' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p style={{ fontSize: '0.72rem', color: '#8a8a99', marginTop: '8px' }}>
                Urutan menentukan ranking (creator pertama = Top 1). Data diisi manual — belum dihitung otomatis dari data campaign.
              </p>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Logo Brand (opsional)</label>
              <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} style={{ ...modalInputStyle, padding: '9px 14px', cursor: 'pointer' }} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Upload Konten (maks. 3 foto/video)</label>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []).slice(0, 3);
                  setContentFiles(files);
                }}
                style={{ ...modalInputStyle, padding: '9px 14px', cursor: 'pointer' }}
              />
              {contentFiles.length > 0 && (
                <p style={{ fontSize: '0.78rem', color: '#10B981', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
                  {contentFiles.length} file dipilih
                </p>
              )}
            </div>

            {formError && (
              <div style={{ background: '#ffdad6', color: '#93000a', borderRadius: '10px', padding: '10px 14px', fontSize: '0.82rem', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                <span>{formError}</span>
                <button onClick={() => setFormError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93000a', display: 'flex' }}><X size={14} /></button>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1.5px solid #c7c8cf', background: 'white', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, color: '#777683' }}
              >
                Batal
              </button>
              <button
                onClick={() => save('draft')}
                disabled={saving}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1.5px solid #6728e4', background: 'white', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#6728e4', opacity: saving ? 0.7 : 1 }}
              >
                Simpan Draft
              </button>
              <button onClick={() => save('published')} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: 'center', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Menyimpan...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', maxWidth: '380px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ffdad6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={24} color="#ba1a1a" />
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: '1.1rem', color: '#191c20', marginBottom: '8px' }}>
              Hapus Portfolio?
            </h3>
            <p style={{ color: '#777683', fontSize: '0.875rem', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>
              Portfolio ini akan dihapus permanen dan tidak bisa dikembalikan.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1.5px solid #c7c8cf', background: 'white', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, color: '#777683' }}
              >
                Batal
              </button>
              <button
                onClick={() => deleteItem(deleteConfirm)}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#ba1a1a', color: 'white', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 700 }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
