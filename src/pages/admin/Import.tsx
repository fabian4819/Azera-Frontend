import { useRef, useState } from 'react';
import { Upload, CheckCircle2, AlertTriangle, Link2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

const f = "var(--font-display)";
const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)', marginBottom: '20px',
};

interface Social { username?: string; url?: string; followers?: number }
interface ImportRow {
  tab: string; rowNumber: number; name: string; phone: string; age?: number; domicile?: string; gender?: string;
  instagram?: Social; tiktok?: Social; approval?: string; errors: string[];
  /** Hasil cocok ke Existing Creator: baru, sudah ada & dilengkapi, atau sudah ada & sama persis */
  status?: 'new' | 'updated' | 'existing';
}
interface Preview {
  rows: ImportRow[]; total: number; validCount: number; invalidCount: number; noPhone: number;
  ignoredHeaders: string[]; tabs: { name: string; rows: number }[];
  creators: { new: number; updated: number; unchanged: number };
}
type Source = File | string;

const STATUS: Record<string, [string, string, string]> = {
  new: ['Baru', '#d1fae5', '#065F46'], updated: ['Sudah ada · dilengkapi', '#e0e7ff', '#3730a3'], existing: ['Sudah ada · sama', '#f1f1f4', '#5f6368'],
};
const num = (n?: number) => (n === undefined || n === null ? '-' : n.toLocaleString('id-ID'));
const td: React.CSSProperties = { padding: '8px 10px', whiteSpace: 'nowrap' };
const COLUMNS = 'Nama Lengkap, Umur, Domisili, Jenis Kelamin, No WA, Username IG, Link IG, Followers IG, Username TikTok, Link TikTok, Followers TikTok, Approval';

function SocialCell({ s }: { s?: Social }) {
  if (!s) return <>-</>;
  const label = s.username ? `@${s.username}` : 'link';
  return (
    <>
      {s.url ? <a href={s.url} target="_blank" rel="noreferrer" style={{ color: '#6B2EE8' }}>{label}</a> : label}
      {s.followers !== undefined && <span style={{ color: '#777683' }}> · {num(s.followers)}</span>}
    </>
  );
}

/** Import creator kurasi (yang sudah dipilih & pernah ikut campaign sebelum ada platform) ke menu Existing Creator. */
export default function Import() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [link, setLink] = useState('');
  const [source, setSource] = useState<Source | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ created: number; updated: number; unchanged: number; rows: number; skipped: { rowNumber: number; tab: string; reason: string }[] } | null>(null);
  const [error, setError] = useState('');

  const send = (path: string, picked: Source) => {
    if (typeof picked === 'string') return api.post(path, { url: picked });
    const formData = new FormData();
    formData.append('file', picked);
    return api.post(path, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  };
  const errorOf = (err: unknown, fallback: string) => (err as { response?: { data?: { message?: string } } }).response?.data?.message || fallback;

  // Langsung preview begitu file/link dipilih
  const load = async (picked: Source) => {
    setSource(picked);
    setPreview(null);
    setLoading(true);
    setError('');
    setResult(null);
    try {
      setPreview((await send('/admin/import/preview', picked)).data);
    } catch (err) {
      setError(errorOf(err, `Gagal membaca file. Pastikan baris 1 berisi kolom: ${COLUMNS}.`));
    } finally {
      setLoading(false);
    }
  };

  // Server membaca ulang sumber yang sama (file/link), jadi yang diimport persis yang di-preview
  const confirm = async () => {
    if (!source) return;
    setLoading(true);
    setError('');
    try {
      setResult((await send('/admin/import/confirm', source)).data);
      setPreview(null);
      setSource(null);
      setLink('');
    } catch (err) {
      setError(errorOf(err, 'Gagal import data.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={cardStyle}>
        <p style={{ fontFamily: f, fontSize: '0.85rem', color: '#464652', marginBottom: '16px', lineHeight: 1.6 }}>
          Import <strong>creator kurasi</strong> (yang sudah dipilih &amp; pernah ikut campaign sebelum ada platform). Hasilnya masuk menu{' '}
          <Link to="/admin/existing-creators" style={{ color: '#6B2EE8', fontWeight: 700 }}>Existing Creator</Link>, terpisah dari Creators.
          Semua tab dibaca, <strong>nama tab = niche</strong> (Beauty, Lifestyle, Food, dst). Kolom baris 1: <strong>{COLUMNS}</strong>
          {' '}(kolom "Followers" tanpa keterangan otomatis ikut IG/TikTok di sebelah kirinya; kolom Duplicate Check diabaikan).
          Creator dikenali dari No WA, atau username IG/TikTok kalau WA kosong. Import ulang melengkapi data (niche &amp; akun baru ditambah,
          followers diperbarui, data lain tidak ditimpa), bukan menggandakan.
        </p>
        <input
          ref={inputRef} type="file" accept=".xlsx,.csv" hidden
          onChange={(e) => {
            const picked = e.target.files?.[0];
            e.target.value = '';
            if (picked) void load(picked);
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => inputRef.current?.click()} disabled={loading} className="btn-primary" style={{ padding: '9px 18px', fontSize: '0.82rem', opacity: loading ? 0.6 : 1 }}>
            <Upload size={14} /> {loading ? 'Memproses...' : 'Pilih File'}
          </button>
          {source && <span style={{ fontFamily: f, fontSize: '0.82rem', color: '#464652' }}>{typeof source === 'string' ? 'Google Sheets' : source.name}</span>}
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); if (link.trim()) void load(link.trim()); }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '14px' }}
        >
          <span style={{ fontFamily: f, fontSize: '0.82rem', color: '#464652' }}>atau</span>
          <input
            type="url" value={link} onChange={(e) => setLink(e.target.value)}
            placeholder="Paste link Google Sheets (akses: Anyone with the link), semua tab ikut dibaca"
            aria-label="Link Google Sheets"
            style={{ flex: '1 1 320px', padding: '9px 14px', borderRadius: '999px', border: '1px solid #e1e0ff', fontFamily: f, fontSize: '0.82rem' }}
          />
          <button type="submit" disabled={loading || !link.trim()} className="btn-primary" style={{ padding: '9px 18px', fontSize: '0.82rem', opacity: loading || !link.trim() ? 0.6 : 1 }}>
            <Link2 size={14} /> Ambil dari Link
          </button>
        </form>
        {error && <p style={{ color: '#ba1a1a', fontSize: '0.82rem', marginTop: '12px', fontFamily: f }}>{error}</p>}
      </div>

      {result && (
        <div style={{ ...cardStyle, background: '#d1fae5' }}>
          <p style={{ fontFamily: f, fontWeight: 700, color: '#065F46' }}>
            <CheckCircle2 size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            {result.rows} baris diproses: {result.created} creator baru, {result.updated} dilengkapi, {result.unchanged} sudah ada (tidak berubah).{' '}
            <Link to="/admin/existing-creators" style={{ color: '#065F46' }}>Lihat Existing Creator →</Link>
          </p>
          {result.skipped.length > 0 && (
            <div style={{ marginTop: '10px', maxHeight: '240px', overflowY: 'auto' }}>
              <p style={{ fontFamily: f, fontSize: '0.8rem', color: '#92400E', fontWeight: 700 }}>{result.skipped.length} baris dilewati:</p>
              {result.skipped.map((s) => (
                <p key={`${s.tab}-${s.rowNumber}`} style={{ fontSize: '0.78rem', color: '#92400E', fontFamily: f }}>{s.tab} baris {s.rowNumber}: {s.reason}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {preview && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem' }}>
              Preview: {preview.validCount.toLocaleString('id-ID')}/{preview.total.toLocaleString('id-ID')} baris valid
            </p>
            <button onClick={confirm} disabled={loading || preview.validCount === 0} className="btn-primary" style={{ padding: '9px 18px', fontSize: '0.82rem', opacity: loading || preview.validCount === 0 ? 0.6 : 1 }}>
              {loading ? 'Mengimport...' : `Import ${preview.validCount.toLocaleString('id-ID')} Baris`}
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {([['new', preview.creators.new, 'creator baru'], ['updated', preview.creators.updated, 'sudah ada, akan dilengkapi'], ['existing', preview.creators.unchanged, 'sudah ada, tidak berubah (dilewati)']] as const).map(([k, n, label]) => (
              <span key={k} style={{ padding: '6px 12px', borderRadius: '999px', background: STATUS[k][1], color: STATUS[k][2], fontFamily: f, fontSize: '0.8rem', fontWeight: 700 }}>
                {n.toLocaleString('id-ID')} {label}
              </span>
            ))}
          </div>
          <p style={{ fontFamily: f, fontSize: '0.8rem', color: '#464652', marginBottom: '8px' }}>
            Tab (niche): {preview.tabs.map((t) => `${t.name} (${t.rows})`).join(' · ')}
          </p>
          {preview.noPhone > 0 && (
            <p style={{ fontFamily: f, fontSize: '0.8rem', color: '#92400E', marginBottom: '8px' }}>
              <AlertTriangle size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              {preview.noPhone.toLocaleString('id-ID')} baris tanpa No WA, tetap diimport dan dikenali dari username IG/TikTok.
            </p>
          )}
          {preview.ignoredHeaders.length > 0 && (
            <p style={{ fontFamily: f, fontSize: '0.8rem', color: '#92400E', marginBottom: '8px' }}>
              <AlertTriangle size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Kolom tidak dikenali &amp; diabaikan: <strong>{preview.ignoredHeaders.join(', ')}</strong>.
            </p>
          )}
          {preview.rows.length < preview.total && (
            <p style={{ fontFamily: f, fontSize: '0.78rem', color: '#777683', marginBottom: '8px' }}>
              Menampilkan {preview.rows.length} baris contoh (baris bermasalah, lalu creator baru, tampil paling atas). Semua {preview.total.toLocaleString('id-ID')} baris ikut diproses saat import.
            </p>
          )}
          <div style={{ overflowX: 'auto', maxHeight: '60vh', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', fontFamily: f }}>
              <thead>
                <tr style={{ background: '#f8f9ff', textAlign: 'left', position: 'sticky', top: 0 }}>
                  {['Tab', 'Baris', 'Nama', 'Umur', 'Domisili', 'Gender', 'No WA', 'Instagram', 'TikTok', 'Approval', 'Status'].map((h) => (
                    <th key={h} style={{ padding: '8px 10px', fontWeight: 700, background: '#f8f9ff' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.rows.map((r) => (
                  <tr key={`${r.tab}-${r.rowNumber}`} style={{ borderBottom: '1px solid #f0f0f0', background: r.errors.length ? '#fff5f5' : 'transparent' }}>
                    <td style={td}>{r.tab}</td>
                    <td style={td}>{r.rowNumber}</td>
                    <td style={td}>{r.name || '-'}</td>
                    <td style={td}>{r.age ?? '-'}</td>
                    <td style={td}>{r.domicile || '-'}</td>
                    <td style={td}>{r.gender || '-'}</td>
                    <td style={td}>{r.phone || '-'}</td>
                    <td style={td}><SocialCell s={r.instagram} /></td>
                    <td style={td}><SocialCell s={r.tiktok} /></td>
                    <td style={td}>{r.approval || '-'}</td>
                    <td style={{ padding: '8px 10px' }}>
                      {r.errors.length > 0
                        ? <span style={{ color: '#ba1a1a', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={12} /> {r.errors.join(', ')}</span>
                        : r.status && <span style={{ padding: '2px 10px', borderRadius: '999px', background: STATUS[r.status][1], color: STATUS[r.status][2], fontWeight: 700 }}>{STATUS[r.status][0]}</span>}
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
