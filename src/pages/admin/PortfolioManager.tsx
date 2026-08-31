import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../lib/api';

type CreatorPlatform = 'instagram' | 'tiktok';
interface TopCreator {
  name: string;
  platform: CreatorPlatform;
  postLink: string;
  views: string;
  likes: string;
  comments: string;
  shares: string;
}
interface PortfolioMetrics {
  totalImpression: string;
  accountsReached: string;
  totalEngagement: string;
  totalFollowers: string;
  avgEngagementRate: string;
  costPerView: string;
}

interface PortfolioItem {
  _id: string;
  brand: string;
  hashtag: string;
  category: string;
  kolCount: number;
  reach: string;
  engagement: number;
  featured: boolean;
  logo?: string;
  title?: string;
  objective?: string;
  metrics?: Partial<PortfolioMetrics>;
  topCreators?: TopCreator[];
  createdAt: string;
}

interface FormState {
  brand: string;
  hashtag: string;
  category: string;
  kolCount: string;
  reach: string;
  engagement: string;
  featured: boolean;
  title: string;
  objective: string;
  metrics: PortfolioMetrics;
  topCreators: TopCreator[];
}

const emptyMetrics: PortfolioMetrics = {
  totalImpression: '', accountsReached: '', totalEngagement: '',
  totalFollowers: '', avgEngagementRate: '', costPerView: '',
};

const emptyCreator = (): TopCreator => ({ name: '', platform: 'instagram', postLink: '', views: '', likes: '', comments: '', shares: '' });

const emptyForm: FormState = {
  brand: '',
  hashtag: '',
  category: '',
  kolCount: '',
  reach: '',
  engagement: '',
  featured: false,
  title: '',
  objective: '',
  metrics: emptyMetrics,
  topCreators: [],
};

// Kategori resmi AzeraKOL — sama seperti yang dipakai di Footer & filter Portfolio publik
const categories = ['KOL Marketing', 'Engagement Boost', 'Affiliate Marketing'];

const metricLabels: Record<keyof PortfolioMetrics, string> = {
  totalImpression: 'Total Impression',
  accountsReached: 'Accounts Reached',
  totalEngagement: 'Total Engagement',
  totalFollowers: 'Total Followers',
  avgEngagementRate: 'Average ER Post',
  costPerView: 'Cost Per View',
};

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
    setShowModal(true);
  };

  const openEdit = (item: PortfolioItem) => {
    setEditId(item._id);
    setForm({
      brand: item.brand,
      hashtag: item.hashtag,
      category: item.category,
      kolCount: item.kolCount.toString(),
      reach: item.reach,
      engagement: item.engagement.toString(),
      featured: item.featured,
      title: item.title || '',
      objective: item.objective || '',
      metrics: { ...emptyMetrics, ...item.metrics },
      topCreators: item.topCreators?.length ? item.topCreators : [],
    });
    setLogoFile(null);
    setContentFiles([]);
    setShowModal(true);
  };

  const updateMetric = (key: keyof PortfolioMetrics, value: string) => {
    setForm((f) => ({ ...f, metrics: { ...f.metrics, [key]: value } }));
  };

  const addCreator = () => {
    if (form.topCreators.length >= 3) return;
    setForm((f) => ({ ...f, topCreators: [...f.topCreators, emptyCreator()] }));
  };
  const updateCreator = (i: number, patch: Partial<TopCreator>) => {
    setForm((f) => ({ ...f, topCreators: f.topCreators.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) }));
  };
  const removeCreator = (i: number) => {
    setForm((f) => ({ ...f, topCreators: f.topCreators.filter((_, idx) => idx !== i) }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      const { metrics, topCreators, ...flat } = form;
      Object.entries(flat).forEach(([k, v]) => fd.append(k, String(v)));
      fd.append('metrics', JSON.stringify(metrics));
      fd.append('topCreators', JSON.stringify(topCreators.filter((c) => c.name.trim() && c.postLink.trim())));
      if (logoFile) fd.append('logo', logoFile);
      contentFiles.forEach((f) => fd.append('contents', f));

      if (editId) {
        await api.patch(`/admin/portfolio/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/admin/portfolio', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowModal(false);
      fetchItems();
    } catch {
      alert('Gagal menyimpan.');
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
                {['Brand', 'Hashtag', 'Kategori', 'KOL', 'Reach', 'ER%', 'Featured', 'Tanggal', 'Aksi'].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ ...tdStyle, textAlign: 'center', padding: '48px' }}>Memuat...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={9} style={{ ...tdStyle, textAlign: 'center', padding: '48px' }}>Belum ada portfolio.</td></tr>
              ) : items.map((item, i) => (
                <tr
                  key={item._id}
                  style={{ borderBottom: '1px solid #e1e0ff', background: i % 2 === 0 ? 'white' : '#fcfcff', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#F8F6FF')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? 'white' : '#fcfcff')}
                >
                  <td style={{ ...tdStyle, fontWeight: 600, color: '#191c20' }}>{item.brand}</td>
                  <td style={tdStyle}>{item.hashtag}</td>
                  <td style={tdStyle}>
                    <span style={{ background: '#e1e0ff', color: '#6728e4', borderRadius: '999px', padding: '3px 10px', fontSize: '0.72rem', fontFamily: "var(--font-display)", fontWeight: 700 }}>
                      {item.category}
                    </span>
                  </td>
                  <td style={tdStyle}>{item.kolCount}</td>
                  <td style={tdStyle}>{item.reach}</td>
                  <td style={{ ...tdStyle, color: '#10B981', fontFamily: "var(--font-display)", fontWeight: 700 }}>{item.engagement}%</td>
                  <td style={tdStyle}>
                    <span style={{ color: item.featured ? '#10B981' : '#777683', fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '0.78rem' }}>
                      {item.featured ? 'Ya' : 'Tidak'}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{formatDate(item.createdAt)}</td>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={labelStyle}>Nama Brand *</label>
                <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="BeautyX" style={modalInputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Hashtag *</label>
                <input value={form.hashtag} onChange={(e) => setForm({ ...form, hashtag: e.target.value })} placeholder="#GlowWithBrand" style={modalInputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Kategori *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={modalInputStyle}>
                  <option value="">Pilih</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Jumlah KOL *</label>
                <input type="number" value={form.kolCount} onChange={(e) => setForm({ ...form, kolCount: e.target.value })} placeholder="100" style={modalInputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Reach *</label>
                <input value={form.reach} onChange={(e) => setForm({ ...form, reach: e.target.value })} placeholder="2.5M" style={modalInputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Engagement Rate (%) *</label>
                <input type="number" step="0.1" value={form.engagement} onChange={(e) => setForm({ ...form, engagement: e.target.value })} placeholder="4.5" style={modalInputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontFamily: 'var(--font-display)' }}>
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: '#6728e4' }} />
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#191c20' }}>Tampilkan di featured homepage</span>
              </label>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Judul Campaign (opsional, beda dari nama brand)</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Serambi MyPertamina KOL Campaign" style={modalInputStyle} />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Objective Campaign (opsional)</label>
              <textarea
                value={form.objective}
                onChange={(e) => setForm({ ...form, objective: e.target.value })}
                rows={3}
                placeholder="Membangun konten organik & menghibur untuk kampanye..., mengaktivasi total X KOL, menghasilkan Y impresi..."
                style={{ ...modalInputStyle, resize: 'vertical', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <p style={{ ...labelStyle, marginBottom: '10px' }}>Performance Metrics Result (opsional, tampil di detail publik)</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {(Object.keys(metricLabels) as (keyof PortfolioMetrics)[]).map((key) => (
                  <div key={key}>
                    <label style={{ ...labelStyle, fontSize: '0.72rem', fontWeight: 500 }}>{metricLabels[key]}</label>
                    <input
                      value={form.metrics[key]}
                      onChange={(e) => updateMetric(key, e.target.value)}
                      placeholder={key === 'costPerView' ? 'Rp468' : key === 'avgEngagementRate' ? '20%' : '1.4M+'}
                      style={{ ...modalInputStyle, padding: '9px 10px', fontSize: '0.8rem' }}
                    />
                  </div>
                ))}
              </div>
            </div>

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
                      <input value={c.postLink} onChange={(e) => updateCreator(i, { postLink: e.target.value })} placeholder="Link postingan (https://instagram.com/p/... atau tiktok.com/@.../video/...)" style={{ ...modalInputStyle, padding: '8px 10px', fontSize: '0.8rem', marginBottom: '8px' }} />
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

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1.5px solid #c7c8cf', background: 'white', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, color: '#777683' }}
              >
                Batal
              </button>
              <button onClick={save} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: 'center', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Menyimpan...' : editId ? 'Update' : 'Tambah'}
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
