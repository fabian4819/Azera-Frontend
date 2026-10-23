import { useCallback, useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Copy, ExternalLink, MessageCircle, RefreshCw, X } from 'lucide-react';
import api from '../../lib/api';
import SheetGrid, { type Cell, type CellKind } from '../../components/SheetGrid';
import ReviewStatusCell from '../../components/ReviewStatusCell';
import { AccessIcon, AddColumnMenu, ColumnMenu, type Access, type ProgressColumn } from './ColumnManager';
import { SHEET_TABS, type SheetKind } from './sheetTabs';

const f = 'var(--font-display)';
const GRID = '#e2e3e3';

interface ColumnMeta { key: string; progressId?: string; kind?: CellKind; access: Access; submission?: { type: 'draft' | 'post'; review?: boolean } }
interface SheetView {
  campaign: { _id: string; name: string; brandName: string | null };
  headers: string[];
  rows: Cell[][];
  totals?: Cell[];
  columns?: ColumnMeta[];
  rowIds?: string[];
  rowStatus?: string[];
  rowLinks?: string[];
  rowNotes?: { draft?: string; post?: string }[];
  progressColumns?: ProgressColumn[];
  byPic?: { headers: string[]; rows: Cell[][]; rowIds?: string[]; totals?: Cell[]; columns?: ColumnMeta[] };
  sheetUrl: string | null;
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: '#fff4d6', color: '#8a5a00', label: 'Pending' },
  accepted: { bg: '#d7f5e3', color: '#146c2e', label: 'Approved' },
  rejected: { bg: '#ffdad6', color: '#93000a', label: 'Rejected' },
};

const MAX_DRAFT_MB = 80; // = batas uploadDraft di server & client_max_body_size nginx

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
  // 'all' = kirim ke semua PIC, id PIC = kirim ke satu PIC; null = tidak sedang mengirim
  const [requestingBankInfo, setRequestingBankInfo] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState('');
  const [togglingPaidId, setTogglingPaidId] = useState<string | null>(null);
  const [recapSubTab, setRecapSubTab] = useState<'creator' | 'pic'>('creator');
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
    if (kind === 'recap') {
      await api.patch(`/admin/campaigns/${id}/sheet/recap-cell`, { applicationId: view?.rowIds?.[row], columnKey: meta?.key, value });
      await reloadCurrent();
      return;
    }
    const columnId = meta?.submission?.type === 'post' ? 'base:post' : meta?.progressId;
    await api.patch(`/admin/campaigns/${id}/sheet/cell`, { applicationId: view?.rowIds?.[row], columnId, value });
    await reloadCurrent();
  };

  const uploadCell = async (row: number, col: number, files: File[]) => {
    const meta = view?.columns?.[col];
    const isDraft = meta?.submission?.type === 'draft';
    if (isDraft && files.some((file) => file.size > MAX_DRAFT_MB * 1024 * 1024)) {
      throw { response: { data: { message: `Ukuran file maksimal ${MAX_DRAFT_MB}MB per file` } } };
    }
    const fd = new FormData();
    fd.append('applicationId', view?.rowIds?.[row] ?? '');
    fd.append('columnId', meta?.submission?.type === 'post' ? 'base:insight' : meta?.progressId ?? '');
    files.forEach((file) => fd.append('files', file));
    await api.post(`/admin/campaigns/${id}/sheet/${isDraft ? 'draft' : 'cell'}/upload`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    await reloadCurrent();
  };

  // Approve / minta revisi draft atau hasil posting, dari sel Status Draft / Status Posting
  const review = async (row: number, type: 'draft' | 'post', status: 'approved' | 'revision_requested', notes?: string) => {
    setActionError('');
    try {
      await api.patch(`/admin/campaigns/${id}/sheet/review`, { applicationId: view?.rowIds?.[row], type, status, notes });
      await reloadCurrent();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setActionError(msg || `Gagal mengubah status ${type === 'draft' ? 'draft' : 'posting'}. Coba lagi.`);
      throw err;
    }
  };

  const reviewCell = (row: number, col: number, v: Cell) => {
    const sub = view?.columns?.[col]?.submission;
    if (!sub?.review) return undefined;
    return (
      <ReviewStatusCell type={sub.type} status={String(v)} notes={view?.rowNotes?.[row]?.[sub.type]}
        onReview={(status, notes) => review(row, sub.type, status, notes)} />
    );
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
        creatorEditable={Boolean(meta.submission && !meta.submission.review)}
        canMoveLeft={pIdx > 0}
        canMoveRight={pIdx !== -1 && pIdx < progressCols.length - 1}
        onAccess={(a) => {
          const access = Object.fromEntries((view?.columns ?? []).filter((c) => !c.progressId).map((c) => [c.key, c.access])) as Record<string, Access>;
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
    const link = view?.rowLinks?.[row];
    if (!link) return;
    try {
      // Pakai origin halaman ini (bukan CLIENT_ORIGIN server), jadi link ikut port/domain tempat admin membuka
      await navigator.clipboard.writeText(`${window.location.origin}${new URL(String(link), window.location.origin).pathname}`);
      setCopied(view?.rowIds?.[row] ?? null);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      setActionError('Gagal menyalin link portal. Coba lagi.');
    }
  };

  // AD-adjustment-6: admin minta info bank/e-wallet via WA ke PIC / creator campaign ini, semua atau satu orang.
  // Pesan = template "Minta Info Bank/E-Wallet (PIC)" / "(Creator)" di menu Template Pesan.
  const requestBankInfo = async (target: 'pic' | 'creator', targetId?: string, name?: string) => {
    setRequestingBankInfo(targetId ?? 'all');
    setActionError(''); setActionNotice('');
    try {
      const res = target === 'pic'
        ? await api.post(`/admin/campaigns/${id}/recap/request-bank-info`, targetId ? { picUserId: targetId } : {})
        : await api.post(`/admin/campaigns/${id}/recap/request-creator-bank-info`, targetId ? { applicationId: targetId } : {});
      setActionNotice(name ? `Pesan WA permintaan info bank/e-wallet terkirim ke ${name}.` : `Pesan WA terkirim ke ${res.data.count} ${target === 'pic' ? 'PIC' : 'creator'}.`);
      await reloadCurrent();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setActionError(msg || 'Gagal mengirim pesan WA.');
    } finally {
      setRequestingBankInfo(null);
    }
  };

  const editPicCell = async (row: number, col: number, value: string) => {
    const meta = view?.byPic?.columns?.[col];
    await api.patch(`/admin/campaigns/${id}/sheet/recap-pic-cell`, { picUserId: view?.byPic?.rowIds?.[row], columnKey: meta?.key, value });
    await reloadCurrent();
  };

  const togglePicPaid = async (picId: string, paid: boolean) => {
    setTogglingPaidId(picId);
    try {
      const res = await api.patch(`/admin/campaigns/${id}/sheet/recap-pic-paid`, { picUserId: picId, paid });
      setActionNotice(res.data.creatorsMarkedPaid ? `PIC ditandai Lunas, ${res.data.creatorsMarkedPaid} creator di bawahnya ikut ditandai Lunas.` : '');
      await reloadCurrent();
    } catch {
      setActionError('Gagal mengubah status pembayaran. Coba lagi.');
    } finally {
      setTogglingPaidId(null);
    }
  };

  // Status bayar per creator (Recap Payment tab Creator); Lunas → WA "Pembayaran Creator Selesai" ke creator
  const toggleCreatorPaid = async (applicationId: string, paid: boolean) => {
    setTogglingPaidId(applicationId);
    try {
      await api.patch(`/admin/applications/${applicationId}/payment`, { creatorPaymentStatus: paid ? 'paid' : 'unpaid' });
      await reloadCurrent();
    } catch {
      setActionError('Gagal mengubah status pembayaran. Coba lagi.');
    } finally {
      setTogglingPaidId(null);
    }
  };

  /** Tombol Minta Info + Tandai Lunas, dipakai tab Creator & Rekap per PIC */
  const paymentActions = (opts: { id: string; name: string; paid: boolean; onRequest: () => void; onToggle: () => void }) => {
    const busy = togglingPaidId === opts.id;
    return (
      <span style={{ display: 'inline-flex', gap: '6px' }}>
        <button type="button" disabled={!!requestingBankInfo} onClick={opts.onRequest}
          title={`Kirim WA minta info bank/e-wallet ke ${opts.name}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', border: 'none', whiteSpace: 'nowrap',
            background: '#dcf8e5', color: '#128c3e', fontSize: '0.72rem', fontWeight: 700, cursor: requestingBankInfo ? 'wait' : 'pointer', opacity: requestingBankInfo && requestingBankInfo !== opts.id ? 0.6 : 1,
          }}>
          <MessageCircle size={12} /> {requestingBankInfo === opts.id ? 'Mengirim...' : 'Minta Info'}
        </button>
        <button type="button" disabled={busy} onClick={opts.onToggle}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', border: 'none', whiteSpace: 'nowrap',
            background: opts.paid ? '#d7f5e3' : '#f0eeff', color: opts.paid ? '#146c2e' : '#6728e4',
            fontSize: '0.72rem', fontWeight: 700, cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.6 : 1,
          }}>
          {opts.paid ? '✓ Lunas' : 'Tandai Lunas'}
        </button>
      </span>
    );
  };

  const creatorRecapAction = (row: number) => {
    const appId = view?.rowIds?.[row];
    if (!appId || !view) return null;
    const statusCol = view.headers.indexOf('Status Pembayaran');
    const paid = statusCol >= 0 && view.rows[row]?.[statusCol] === 'Lunas';
    const name = String(view.rows[row]?.[0] ?? 'creator');
    return paymentActions({ id: appId, name, paid, onRequest: () => void requestBankInfo('creator', appId, name), onToggle: () => void toggleCreatorPaid(appId, !paid) });
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
  const isRecap = kind === 'recap';

  return (
    <div>
      <Link to="/admin/campaigns" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#777683', fontSize: '0.8rem', textDecoration: 'none', fontFamily: f, marginBottom: '12px' }}>
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
            style={{ width: '38px', height: '38px', borderRadius: '10px', border: '1.5px solid #c7c8cf', background: '#fff', color: '#6728e4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: loading ? 0.5 : 1 }}>
            <RefreshCw size={16} />
          </button>
          {view?.sheetUrl && (
            <a href={view.sheetUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 14px', height: '38px', borderRadius: '10px', border: '1.5px solid #c7c8cf', background: '#fff', color: '#188038', fontFamily: f, fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
              <ExternalLink size={14} /> Buka di Google Sheets
            </a>
          )}
          {isRecap && (
            <button type="button" onClick={() => void requestBankInfo(recapSubTab)} disabled={!!requestingBankInfo}
              title={`Kirim WA ke semua ${recapSubTab === 'pic' ? 'PIC' : 'creator'} campaign ini. Per orang: tombol Minta Info di tiap baris. Isi pesan diatur di menu Template Pesan.`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 14px', height: '38px', borderRadius: '10px', border: 'none', background: '#25d366', color: 'white', fontFamily: f, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', opacity: requestingBankInfo ? 0.6 : 1 }}>
              <MessageCircle size={14} /> {requestingBankInfo === 'all' ? 'Mengirim...' : `Minta Info ke Semua ${recapSubTab === 'pic' ? 'PIC' : 'Creator'}`}
            </button>
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

      {actionNotice && (
        <div role="status" style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '10px 14px', marginBottom: '10px', borderRadius: '10px', background: '#d7f5e3', color: '#146c2e', fontSize: '0.8rem' }}>
          {actionNotice}
          <button type="button" onClick={() => setActionNotice('')} aria-label="Tutup pesan" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#146c2e', display: 'flex' }}><X size={14} /></button>
        </div>
      )}
      {actionError && (
        <div role="alert" style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '10px 14px', marginBottom: '10px', borderRadius: '10px', background: '#ffdad6', color: '#93000a', fontSize: '0.8rem' }}>
          {actionError}
          <button type="button" onClick={() => setActionError('')} aria-label="Tutup pesan" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93000a', display: 'flex' }}><X size={14} /></button>
        </div>
      )}

      {isRecap && view?.byPic && (
        <div role="tablist" style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
          {([['creator', 'Creator'], ['pic', 'Rekap per PIC']] as const).map(([key, label]) => (
            <button key={key} role="tab" aria-selected={recapSubTab === key} onClick={() => setRecapSubTab(key)}
              style={{
                padding: '8px 16px', borderRadius: '999px', border: 'none', cursor: 'pointer',
                background: recapSubTab === key ? '#6728e4' : '#f0eeff', color: recapSubTab === key ? '#fff' : '#6728e4',
                fontFamily: f, fontSize: '0.82rem', fontWeight: 700,
              }}>
              {label}
            </button>
          ))}
        </div>
      )}

      {error ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#ba1a1a', background: '#fff', borderRadius: '12px', border: '1px solid #ffdad6' }}>{error}</div>
      ) : !view ? (
        <div style={{ textAlign: 'center', padding: '70px', color: '#777683', background: '#fff', borderRadius: '12px', border: `1px solid ${GRID}` }}>Memuat sheet…</div>
      ) : isRecap && recapSubTab === 'pic' && view.byPic ? (
        <SheetGrid
          key={`${kind}-byPic`}
          headers={view.byPic.headers}
          rows={view.byPic.rows}
          totals={view.byPic.totals}
          emptyText="Belum ada PIC yang pegang creator di campaign ini."
          canEdit={(_row, col) => view.byPic?.columns?.[col]?.access === 'edit'}
          onEdit={editPicCell}
          actionHeader="Aksi"
          rowAction={(row) => {
            const picId = view.byPic?.rowIds?.[row];
            const statusCol = view.byPic?.headers.indexOf('Status Pembayaran') ?? -1;
            const paid = statusCol >= 0 && view.byPic?.rows[row]?.[statusCol] === 'Lunas';
            if (!picId) return null;
            const picName = String(view.byPic?.rows[row]?.[0] ?? 'PIC');
            return paymentActions({ id: picId, name: picName, paid, onRequest: () => void requestBankInfo('pic', picId, picName), onToggle: () => void togglePicPaid(picId, !paid) });
          }}
        />
      ) : (
        <SheetGrid
          key={kind}
          headers={view.headers}
          rows={view.rows}
          totals={view.totals}
          hint={tab.hint}
          emptyText={tab.empty}
          canEdit={isMaster ? (_row, col) => Boolean(view.columns?.[col]?.progressId || (view.columns?.[col]?.submission && !view.columns[col].submission?.review))
            : isRecap ? (_row, col) => view.columns?.[col]?.access === 'edit'
              : undefined}
          customCell={isMaster ? reviewCell : undefined}
          kindOf={(col) => view.columns?.[col]?.kind}
          onEdit={editCell}
          onUpload={uploadCell}
          actionHeader={isRecap ? 'Aksi' : 'Status'}
          rowAction={kind === 'applicants' ? applicantAction : isRecap ? creatorRecapAction : undefined}
          columnMenu={isMaster ? columnMenu : undefined}
          headerIcon={isMaster ? (col) => (view.columns?.[col] ? <AccessIcon access={view.columns[col].access} /> : null) : undefined}
          addColumnMenu={isMaster ? (close) => <AddColumnMenu onAdd={(cols) => { close(); void saveColumns([...progressCols, ...cols]); }} /> : undefined}
          footer=" · Data langsung dari database, sama dengan yang disinkron ke Google Sheets."
        />
      )}

    </div>
  );
}
