import { useEffect, useState } from 'react';
import { FolderOpen, Upload, Trash2, ExternalLink, Search } from 'lucide-react';
import api from '../../lib/api';

const f = "var(--font-display)";
const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)', marginBottom: '20px',
};

const CATEGORY_LABELS: Record<string, string> = {
  brief: 'Brief', logo: 'Logo', visual: 'Visual', caption: 'Caption', draft: 'Draft',
  final_content: 'Final Content', insight: 'Insight', final_report: 'Final Report',
  invoice: 'Invoice', case_study: 'Case Study',
};
const CATEGORY_ORDER = Object.keys(CATEGORY_LABELS);
const UPLOADABLE_CATEGORIES = ['logo', 'visual', 'caption', 'brief', 'draft', 'final_content', 'insight', 'final_report', 'invoice', 'case_study'];

interface LibraryItem {
  id: string; category: string; label: string; fileUrl?: string; content?: string;
  tags: string[]; source: 'manual' | 'auto'; createdAt: string;
}

export default function AssetLibrary({ campaignId }: { campaignId: string }) {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [uploadCategory, setUploadCategory] = useState('logo');
  const [uploadTags, setUploadTags] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [actionError, setActionError] = useState('');

  const load = async () => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (categoryFilter) params.category = categoryFilter;
    const res = await api.get(`/admin/campaigns/${campaignId}/assets`, { params });
    setItems(res.data);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId, search, categoryFilter]);

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    setActionError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', uploadCategory);
      formData.append('tags', uploadTags);
      await api.post(`/admin/campaigns/${campaignId}/assets`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFile(null);
      setUploadTags('');
      await load();
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data;
      setActionError(data?.error || data?.message || 'Gagal upload file.');
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id: string) => {
    setActionError('');
    try {
      await api.delete(`/admin/assets/${id}`);
      await load();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setActionError(message || 'Gagal menghapus file.');
    }
  };

  const grouped = CATEGORY_ORDER.map((cat) => ({ category: cat, items: items.filter((i) => i.category === cat) })).filter((g) => g.items.length > 0);

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <FolderOpen size={18} color="#6728e4" />
        <p style={{ fontFamily: f, fontWeight: 700, fontSize: '1rem', color: '#191c20' }}>Asset Library</p>
      </div>

      {actionError && (
        <div style={{ background: '#ffdad6', color: '#ba1a1a', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', fontSize: '0.8rem', fontFamily: f }}>
          {actionError}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#8a8a99' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari file atau tag..."
            style={{ width: '100%', padding: '8px 10px 8px 32px', borderRadius: '8px', border: '1.5px solid #c7c8cf', fontSize: '0.8rem', fontFamily: f, boxSizing: 'border-box' }}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #c7c8cf', fontSize: '0.8rem', fontFamily: f }}
        >
          <option value="">Semua Kategori</option>
          {CATEGORY_ORDER.map((c) => (
            <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center', padding: '14px', background: '#f8f9ff', borderRadius: '10px' }}>
        <select
          value={uploadCategory}
          onChange={(e) => setUploadCategory(e.target.value)}
          style={{ padding: '7px 10px', borderRadius: '8px', border: '1.5px solid #c7c8cf', fontSize: '0.78rem', fontFamily: f }}
        >
          {UPLOADABLE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
          ))}
        </select>
        <input
          value={uploadTags}
          onChange={(e) => setUploadTags(e.target.value)}
          placeholder="Tag (pisah koma)"
          style={{ padding: '7px 10px', borderRadius: '8px', border: '1.5px solid #c7c8cf', fontSize: '0.78rem', fontFamily: f, flex: '0 0 160px' }}
        />
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ fontSize: '0.78rem', fontFamily: f }} />
        <button
          onClick={upload}
          disabled={!file || uploading}
          className="btn-primary"
          style={{ padding: '7px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px', opacity: !file || uploading ? 0.6 : 1 }}
        >
          <Upload size={13} /> {uploading ? 'Mengupload...' : 'Upload'}
        </button>
      </div>

      {grouped.length === 0 && (
        <p style={{ textAlign: 'center', color: '#8a8a99', fontSize: '0.85rem', fontFamily: f, padding: '20px' }}>Belum ada file.</p>
      )}

      {grouped.map((group) => (
        <div key={group.category} style={{ marginBottom: '18px' }}>
          <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.8rem', color: '#6728e4', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {CATEGORY_LABELS[group.category]} ({group.items.length})
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {group.items.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#fafafe', borderRadius: '8px', fontSize: '0.8rem', fontFamily: f }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontWeight: 600, color: '#191c20', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</p>
                  {item.tags.length > 0 && <p style={{ fontSize: '0.72rem', color: '#8a8a99' }}>{item.tags.join(', ')}</p>}
                  {item.content && <p style={{ fontSize: '0.75rem', color: '#464652', marginTop: '4px', whiteSpace: 'pre-wrap' }}>{item.content.slice(0, 200)}{item.content.length > 200 ? '...' : ''}</p>}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0, marginLeft: '10px' }}>
                  {item.fileUrl && (
                    <a href={item.fileUrl} target="_blank" rel="noreferrer" style={{ color: '#6728e4' }}>
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {item.source === 'manual' && (
                    <button onClick={() => remove(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ba1a1a' }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
