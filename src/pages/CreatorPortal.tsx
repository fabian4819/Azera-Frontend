import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, MessageCircle, RefreshCw } from 'lucide-react';
import api from '../lib/api';
import SheetGrid, { type Cell, type CellKind } from '../components/SheetGrid';

const f = 'var(--font-display)';

interface PortalView {
  campaign: { name: string; brandName: string | null; briefContent: string; deliverables: string[]; waGroupLink: string };
  headers: string[];
  columns: { key: string; progressId?: string; kind?: CellKind; editable: boolean }[];
  rows: { id: string; mine: boolean; cells: Cell[] }[];
}

/**
 * Dashboard campaign untuk creator lewat magic link (tanpa login). Tabel sama seperti Master Sheet,
 * kolom yang terlihat & bisa diedit diatur admin; creator cuma bisa mengisi sel di barisnya sendiri.
 */
export default function CreatorPortal() {
  const { token } = useParams<{ token: string }>();
  const [view, setView] = useState<PortalView | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/portal/${token}`);
      // Baris milik creator sendiri ditaruh paling atas
      const data: PortalView = res.data;
      data.rows = [...data.rows].sort((a, b) => Number(b.mine) - Number(a.mine));
      setView(data);
      setError('');
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      setError(status === 404 ? 'Link tidak valid atau akses kamu sudah dicabut. Hubungi tim AzeraKOL.' : 'Data gagal dimuat. Coba muat ulang.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const t = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(t);
  }, [load]);

  const editCell = async (_row: number, col: number, value: string) => {
    await api.patch(`/portal/${token}/cell`, { columnId: view?.columns[col]?.progressId, value });
    await load();
  };

  const uploadCell = async (_row: number, col: number, files: File[]) => {
    const fd = new FormData();
    fd.append('columnId', view?.columns[col]?.progressId ?? '');
    files.forEach((file) => fd.append('files', file));
    await api.post(`/portal/${token}/cell/upload`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    await load();
  };

  if (error && !view) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9ff', padding: '24px' }}>
        <p style={{ fontFamily: f, color: '#464652', textAlign: 'center', maxWidth: '420px' }}>{error}</p>
      </div>
    );
  }

  if (!view) {
    return <div style={{ minHeight: '100vh', background: '#f8f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#777683', fontFamily: f }}>Memuat…</div>;
  }

  const { campaign } = view;
  const hasEditable = view.columns.some((c) => c.editable);

  return (
    <div style={{ background: '#f8f9ff', minHeight: '100vh' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #e1e0ff', padding: '14px 16px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo-transparent.png" alt="" width={28} height={28} />
          <span style={{ fontFamily: f, fontWeight: 900, letterSpacing: '-0.02em', color: '#6728e4' }}>AZERAKOL</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#777683', fontFamily: f }}>Dashboard Campaign</span>
        </div>
      </header>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px 16px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <div style={{ minWidth: 0 }}>
            {campaign.brandName && <p style={{ fontSize: '0.78rem', color: '#6728e4', fontWeight: 700, fontFamily: f }}>{campaign.brandName}</p>}
            <h1 style={{ fontFamily: f, fontWeight: 800, fontSize: 'clamp(1.3rem, 3vw, 1.7rem)', color: '#191c20', lineHeight: 1.2 }}>{campaign.name}</h1>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {campaign.waGroupLink && (
              <a href={campaign.waGroupLink} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 14px', height: '38px', borderRadius: '10px', background: '#146c2e', color: 'white', fontFamily: f, fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
                <MessageCircle size={15} /> Grup WA
              </a>
            )}
            <button type="button" onClick={() => void load()} disabled={loading} aria-label="Muat ulang data" title="Muat ulang data"
              style={{ width: '38px', height: '38px', borderRadius: '10px', border: '1.5px solid #c7c8cf', background: 'white', color: '#6728e4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: loading ? 0.5 : 1 }}>
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {(campaign.briefContent || campaign.deliverables?.length > 0) && (
          <div style={{ background: 'white', border: '1px solid #e1e0ff', borderRadius: '12px', marginBottom: '16px' }}>
            <button type="button" onClick={() => setBriefOpen((o) => !o)} aria-expanded={briefOpen}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: f, fontWeight: 700, fontSize: '0.88rem', color: '#191c20' }}>
              Brief Campaign
              <ChevronDown size={18} style={{ transform: briefOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
            </button>
            {briefOpen && (
              <div style={{ padding: '0 16px 16px', fontFamily: f, fontSize: '0.86rem', color: '#464652', lineHeight: 1.7 }}>
                {campaign.deliverables?.length > 0 && (
                  <ul style={{ margin: '0 0 10px', paddingLeft: '18px' }}>{campaign.deliverables.map((d) => <li key={d}>{d}</li>)}</ul>
                )}
                {campaign.briefContent && <p style={{ whiteSpace: 'pre-wrap' }}>{campaign.briefContent}</p>}
              </div>
            )}
          </div>
        )}

        <SheetGrid
          headers={view.headers}
          rows={view.rows.map((r) => r.cells)}
          hint={hasEditable
            ? <>Baris kamu ada di paling atas (nomor ungu). Klik sel <span style={{ background: '#fffdf2', border: '1px solid #e2e3e3', padding: '0 6px' }}>kuning</span> untuk update progress.</>
            : 'Progress semua creator di campaign ini.'}
          emptyText="Belum ada creator di campaign ini."
          canEdit={(row, col) => Boolean(view.rows[row]?.mine && view.columns[col]?.editable)}
          kindOf={(col) => view.columns[col]?.kind}
          onEdit={editCell}
          onUpload={uploadCell}
          highlightRow={(row) => Boolean(view.rows[row]?.mine)}
          maxHeight="calc(100vh - 240px)"
        />
      </main>
    </div>
  );
}
