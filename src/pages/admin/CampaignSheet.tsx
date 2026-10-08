import { useCallback, useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Copy, ExternalLink, RefreshCw, X } from 'lucide-react';
import api from '../../lib/api';
import SheetGrid, { type Cell, type CellKind } from '../../components/SheetGrid';
import { AccessIcon, AddColumnMenu, ColumnMenu, type Access, type ProgressColumn } from './ColumnManager';
import { SHEET_TABS, type SheetKind } from './sheetTabs';

const f = 'var(--font-display)';
const GRID = '#e2e3e3';

interface ColumnMeta { key: string; progressId?: string; kind?: CellKind; access: Access }
interface SheetView {
  campaign: { _id: string; name: string; brandName: string | null };
  headers: string[];
  rows: Cell[][];
  totals?: Cell[];
  columns?: ColumnMeta[];
  rowIds?: string[];
  rowStatus?: string[];
  progressColumns?: ProgressColumn[];
  sheetUrl: string | null;
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: '#fff4d6', color: '#8a5a00', label: 'Pending' },
  accepted: { bg: '#d7f5e3', color: '#146c2e', label: 'Approved' },
  rejected: { bg: '#ffdad6', color: '#93000a', label: 'Rejected' },
};

/** Tampilan Master / Report / Recap Payment / Pendaftar satu campaign ala Google Sheets, di dalam admin. */
export default function CampaignSheet() {
  const { id } = useParams<{ id: string }>();
  const [params, setParams] = useSearchParams();
  const tab = SHEET_TABS.find((t) => t.kind === params.get('tab')) ?? SHEET_TABS[0];
  const kind = tab.kind;

  // Cache per tab supaya pindah tab instan; tombol refresh mengosongkan cache.
  const [cache, setCache] = useState<Partial<Record<SheetKind, SheetView>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deciding, setDeciding] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const view = cache[kind];

  const load = useCallback(async (k: SheetKind) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/admin/campaigns/${id}/sheet/${k}`);
      setCache((c) => ({ ...c, [k]: res.data }));
    } catch {
      setError('Data sheet gagal dimuat. Coba muat ulang.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (cache[kind] || error) return;
    const t = window.setTimeout(() => { void load(kind); }, 0);
    return () => window.clearTimeout(t);
  }, [kind, cache, error, load]);

  const switchTab = (k: SheetKind) => {
    setParams({ tab: k }, { replace: true });
    setError('');
    setActionError('');
  };

  const refresh = () => {
    setCache({});
    setError('');
  };

  // Data tab lain ikut basi setelah edit/approve, buang cache-nya, muat ulang tab yang sedang dibuka.
  const reloadCurrent = async () => {
    setCache((c) => ({ [kind]: c[kind] }));
    await load(kind);
  };

  const editCell = async (row: number, col: number, value: string) => {
    const meta = view?.columns?.[col];
    await api.patch(`/admin/campaigns/${id}/sheet/cell`, { applicationId: view?.rowIds?.[row], columnId: meta?.progressId, value });
    await reloadCurrent();
  };

  const uploadCell = async (row: number, col: number, files: File[]) => {
    const fd = new FormData();
    fd.append('applicationId', view?.rowIds?.[row] ?? '');
    fd.append('columnId', view?.columns?.[col]?.progressId ?? '');
    files.forEach((file) => fd.append('files', file));
    await api.post(`/admin/campaigns/${id}/sheet/cell/upload`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    await reloadCurrent();
  };

  // Kelola kolom langsung dari header tabel, tiap perubahan langsung disimpan ke campaign
  const progressCols = view?.progressColumns ?? [];
  const saveColumns = async (progressColumns: ProgressColumn[], columnAccess?: Record<string, Access>) => {
    setActionError('');
    try {
      await api.patch(`/admin/campaigns/${id}`, { progressColumns, ...(columnAccess ? { columnAccess } : {}) });
      await reloadCurrent();
    } catch {
      setActionError('Gagal menyimpan pengaturan kolom. Coba lagi.');
    }
  };

  const columnMenu = (col: number, close: () => void) => {
    const meta = view?.columns?.[col];
    if (!meta) return null;
    const pIdx = progressCols.findIndex((c) => c.id === meta.progressId);
    const progress = pIdx === -1 ? undefined : progressCols[pIdx];
    const withCol = (fn: (list: ProgressColumn[]) => void) => { const list = [...progressCols]; fn(list); return list; };
    return (
      <ColumnMenu
        progress={progress}
        access={meta.access}
        canMoveLeft={pIdx > 0}
        canMoveRight={pIdx !== -1 && pIdx < progressCols.length - 1}
        onAccess={(a) => {
          const access = Object.fromEntries((view?.columns ?? []).filter((c) => !c.progressId).map((c) => [c.key, c.access === 'view' ? 'view' : 'hidden'])) as Record<string, Access>;
          void saveColumns(progressCols, { ...access, [meta.key]: a });
        }}
        onChange={(next) => void saveColumns(withCol((l) => { l[pIdx] = next; }))}
        onMove={(dir) => { close(); void saveColumns(withCol((l) => { [l[pIdx], l[pIdx + dir]] = [l[pIdx + dir], l[pIdx]]; })); }}
        onInsertRight={() => { close(); void saveColumns(withCol((l) => { l.splice(pIdx + 1, 0, { id: crypto.randomUUID(), label: 'Kolom baru', type: 'text', creatorAccess: 'edit' }); })); }}
        onDelete={() => { close(); void saveColumns(progressCols.filter((c) => c.id !== meta.progressId)); }}
      />
    );
  };

  const decide = async (row: number, status: 'accepted' | 'rejected') => {
    const appId = view?.rowIds?.[row];
    if (!appId) return;
    setDeciding(appId);
    setActionError('');
    try {
      await api.patch(`/admin/applications/${appId}`, { status });
      await reloadCurrent();
    } catch {
      setActionError('Gagal mengubah status pendaftar. Coba lagi.');
    } finally {
      setDeciding(null);
    }
  };

  const copyPortal = async (row: number) => {
    const link = view?.rows[row]?.[view.headers.indexOf('Link Portal')];
    if (!link) return;
    try {
      await navigator.clipboard.writeText(String(link));
      setCopied(view?.rowIds?.[row] ?? null);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      setActionError('Gagal menyalin link. Salin manual dari kolom Link Portal.');
    }
  };

  const applicantAction = (row: number) => {
    const status = view?.rowStatus?.[row] ?? 'pending';
    const appId = view?.rowIds?.[row];
    const busy = deciding === appId;
    const s = STATUS_STYLE[status] ?? STATUS_STYLE.pending;
    const btn = (bg: string, color: string): React.CSSProperties => ({
      display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', border: 'none',
      background: bg, color, fontSize: '0.72rem', fontWeight: 700, cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.6 : 1,
    });
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ background: s.bg, color: s.color, borderRadius: '999px', padding: '2px 9px', fontSize: '0.7rem', fontWeight: 700 }}>{s.label}</span>
        {status !== 'accepted' && (
          <button type="button" disabled={busy} onClick={() => decide(row, 'accepted')} style={btn('#146c2e', 'white')}><Check size={12} /> Approve</button>
        )}
        {status !== 'rejected' && (
          <button type="button" disabled={busy} onClick={() => decide(row, 'rejected')} style={btn('#ffdad6', '#93000a')}><X size={12} /> Reject</button>
        )}
        {status === 'accepted' && (
          <button type="button" onClick={() => copyPortal(row)} title="Salin magic link portal creator ini" style={btn('#f0eeff', '#6728e4')}>
            <Copy size={12} /> {copied === appId ? 'Tersalin' : 'Link'}
          </button>
        )}
      </span>
    );
  };

  const campaign = view?.campaign ?? Object.values(cache)[0]?.campaign;
  const isMaster = kind === 'master';

  return (
    <div>
      <Link to="/admin/campaign-dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#777683', fontSize: '0.8rem', textDecoration: 'none', fontFamily: f, marginBottom: '12px' }}>
        <ArrowLeft size={14} /> Semua Campaign
      </Link>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '18px' }}>
        <div style={{ minWidth: 0 }}>
          <h2 style={{ fontFamily: f, fontWeight: 800, fontSize: '1.35rem', color: '#191c20' }}>
            {campaign ? <Link to={`/admin/campaigns/${campaign._id}`} title="Buka detail campaign" style={{ color: 'inherit', textDecoration: 'none' }}>{campaign.name}</Link> : 'Memuat…'}
          </h2>
          {campaign && <p style={{ marginTop: '4px', color: '#777683', fontSize: '0.82rem' }}>{campaign.brandName || 'Tanpa brand'}</p>}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button type="button" onClick={refresh} disabled={loading} aria-label="Muat ulang data" title="Muat ulang data"
            style={{ width: '38px', height: '38px', borderRadius: '10px', border: '1.5px solid #c7c8cf', background: 'white', color: '#6728e4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: loading ? 0.5 : 1 }}>
            <RefreshCw size={16} />
          </button>
          {view?.sheetUrl && (
            <a href={view.sheetUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 14px', height: '38px', borderRadius: '10px', border: '1.5px solid #c7c8cf', background: 'white', color: '#188038', fontFamily: f, fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
              <ExternalLink size={14} /> Buka di Google Sheets
            </a>
          )}
        </div>
      </div>

      <div role="tablist" style={{ display: 'flex', gap: '4px', borderBottom: '1px solid #e1e0ff', marginBottom: '14px', overflowX: 'auto' }}>
        {SHEET_TABS.map((t) => {
          const active = t.kind === kind;
          const Icon = t.icon;
          const count = cache[t.kind]?.rows.length;
          return (
            <button key={t.kind} role="tab" aria-selected={active} onClick={() => switchTab(t.kind)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: `2.5px solid ${active ? '#6728e4' : 'transparent'}`, marginBottom: '-1px',
                color: active ? '#6728e4' : '#5f6368', fontFamily: f, fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap',
              }}>
              <Icon size={15} /> {t.label}
              {count !== undefined && (
                <span style={{ background: active ? '#e1e0ff' : '#eef0f2', color: active ? '#6728e4' : '#5f6368', borderRadius: '999px', padding: '1px 8px', fontSize: '0.7rem' }}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {actionError && (
        <div role="alert" style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '10px 14px', marginBottom: '10px', borderRadius: '10px', background: '#ffdad6', color: '#93000a', fontSize: '0.8rem' }}>
          {actionError}
          <button type="button" onClick={() => setActionError('')} aria-label="Tutup pesan" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93000a', display: 'flex' }}><X size={14} /></button>
        </div>
      )}

      {error ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#ba1a1a', background: 'white', borderRadius: '12px', border: '1px solid #ffdad6' }}>{error}</div>
      ) : !view ? (
        <div style={{ textAlign: 'center', padding: '70px', color: '#777683', background: 'white', borderRadius: '12px', border: `1px solid ${GRID}` }}>Memuat sheet…</div>
      ) : (
        <SheetGrid
          key={kind}
          headers={view.headers}
          rows={view.rows}
          totals={view.totals}
          hint={tab.hint}
          emptyText={tab.empty}
          canEdit={isMaster ? (_row, col) => Boolean(view.columns?.[col]?.progressId) : undefined}
          kindOf={(col) => view.columns?.[col]?.kind}
          onEdit={editCell}
          onUpload={uploadCell}
          actionHeader="Status"
          rowAction={kind === 'applicants' ? applicantAction : undefined}
          columnMenu={isMaster ? columnMenu : undefined}
          headerIcon={isMaster ? (col) => (view.columns?.[col] ? <AccessIcon access={view.columns[col].access} /> : null) : undefined}
          addColumnMenu={isMaster ? (close) => <AddColumnMenu onAdd={(cols) => { close(); void saveColumns([...progressCols, ...cols]); }} /> : undefined}
          footer=" · Data langsung dari database, sama dengan yang disinkron ke Google Sheets."
        />
      )}

    </div>
  );
}
