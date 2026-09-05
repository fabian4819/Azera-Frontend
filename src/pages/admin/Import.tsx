import { useState } from 'react';
import { Upload, CheckCircle2, AlertTriangle } from 'lucide-react';
import api from '../../lib/api';

const f = "var(--font-display)";
const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)', marginBottom: '20px',
};

interface ImportRow {
  rowNumber: number; campaignName: string; brandName: string; creatorName: string; platform: string;
  link?: string; views?: number; reach?: number; likes?: number; comments?: number; shares?: number; saved?: number;
  errors: string[];
}

export default function Import() {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ created: number; skipped: { rowNumber: number; reason: string }[] } | null>(null);
  const [error, setError] = useState('');

  const preview = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/admin/import/preview', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setRows(res.data.rows);
    } catch {
      setError('Gagal membaca file. Pastikan format sesuai (Nama Campaign, Brand, Nama Creator, Platform, Link Konten, Niche Akun, Views, Reach, Likes, Comments, Shares, Saved, Tanggal Posting).');
    } finally {
      setLoading(false);
    }
  };

  const confirm = async () => {
    setLoading(true);
    try {
      const res = await api.post('/admin/import/confirm', { rows });
      setResult(res.data);
      setRows([]);
      setFile(null);
    } catch {
      setError('Gagal import data.');
    } finally {
      setLoading(false);
    }
  };

  const validCount = rows.filter((r) => r.errors.length === 0).length;

  return (
    <div>
      <div style={cardStyle}>
        <p style={{ fontFamily: f, fontSize: '0.85rem', color: '#464652', marginBottom: '16px', lineHeight: 1.6 }}>
          Upload spreadsheet (.xlsx atau .csv) dengan kolom: <strong>Nama Campaign, Brand, Nama Creator, Platform, Link Konten,
          Niche Akun, Views, Reach, Likes, Comments, Shares, Saved, Tanggal Posting</strong>. Satu baris = satu platform per creator per campaign.
        </p>
        <input type="file" accept=".xlsx,.csv" onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ marginBottom: '14px', fontFamily: f, fontSize: '0.85rem' }} />
        <br />
        <button onClick={preview} disabled={!file || loading} className="btn-primary" style={{ padding: '9px 18px', fontSize: '0.82rem', opacity: !file || loading ? 0.6 : 1 }}>
          <Upload size={14} /> {loading ? 'Memproses...' : 'Preview'}
        </button>
        {error && <p style={{ color: '#ba1a1a', fontSize: '0.82rem', marginTop: '12px', fontFamily: f }}>{error}</p>}
      </div>

      {result && (
        <div style={{ ...cardStyle, background: '#d1fae5' }}>
          <p style={{ fontFamily: f, fontWeight: 700, color: '#065F46' }}>
            <CheckCircle2 size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            {result.created} baris berhasil diimport.
          </p>
          {result.skipped.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <p style={{ fontFamily: f, fontSize: '0.8rem', color: '#92400E', fontWeight: 700 }}>{result.skipped.length} baris dilewati:</p>
              {result.skipped.map((s) => (
                <p key={s.rowNumber} style={{ fontSize: '0.78rem', color: '#92400E', fontFamily: f }}>Baris {s.rowNumber}: {s.reason}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {rows.length > 0 && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem' }}>
              Preview: {validCount}/{rows.length} baris valid
            </p>
            <button onClick={confirm} disabled={loading || validCount === 0} className="btn-primary" style={{ padding: '9px 18px', fontSize: '0.82rem', opacity: loading || validCount === 0 ? 0.6 : 1 }}>
              {loading ? 'Mengimport...' : `Import ${validCount} Baris`}
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', fontFamily: f }}>
              <thead>
                <tr style={{ background: '#f8f9ff', textAlign: 'left' }}>
                  {['#', 'Campaign', 'Brand', 'Creator', 'Platform', 'Views', 'Status'].map((h) => (
                    <th key={h} style={{ padding: '8px 10px', fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.rowNumber} style={{ borderBottom: '1px solid #f0f0f0', background: r.errors.length ? '#fff5f5' : 'transparent' }}>
                    <td style={{ padding: '8px 10px' }}>{r.rowNumber}</td>
                    <td style={{ padding: '8px 10px' }}>{r.campaignName}</td>
                    <td style={{ padding: '8px 10px' }}>{r.brandName}</td>
                    <td style={{ padding: '8px 10px' }}>{r.creatorName}</td>
                    <td style={{ padding: '8px 10px', textTransform: 'capitalize' }}>{r.platform}</td>
                    <td style={{ padding: '8px 10px' }}>{r.views?.toLocaleString('id-ID') || '-'}</td>
                    <td style={{ padding: '8px 10px' }}>
                      {r.errors.length > 0 ? (
                        <span style={{ color: '#ba1a1a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={12} /> {r.errors.join(', ')}
                        </span>
                      ) : (
                        <span style={{ color: '#065F46' }}>OK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
