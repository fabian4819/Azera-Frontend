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
  byPic?: { headers: string[]; rows: Cell[][]; rowIds?: string[]; totals?: Cell[] };
  sheetUrl: string | null;
}

interface PicPaymentInfo {
  _id: string; name: string; phone: string;
  paymentInfo?: { bankName?: string; accountNumber?: string; accountName?: string; ewalletType?: string; ewalletNumber?: string };
  pendingPaymentReply?: { raw: string; receivedAt: string };
  paymentInfoRequestedAt?: string;
}

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: '#fff4d6', color: '#8a5a00', label: 'Pending' },
  accepted: { bg: '#d7f5e3', color: '#146c2e', label: 'Approved' },
  rejected: { bg: '#ffdad6', color: '#93000a', label: 'Rejected' },
};

const MAX_DRAFT_MB = 80; // = batas uploadDraft di server & client_max_body_size nginx

/** Modal konfirmasi manual (BUKAN auto-save) info bank/e-wallet PIC, AD-adjustment-6. Admin lihat
 * balasan WA mentah (kalau ada) lalu isi field terstruktur sendiri sebelum simpan. */
function PicConfirmModal({ info, saving, onClose, onSave }: {
  info: PicPaymentInfo | null; saving: boolean; onClose: () => void;
  onSave: (fields: { bankName: string; accountNumber: string; accountName: string; ewalletType: string; ewalletNumber: string }) => void;
}) {
  const [bankName, setBankName] = useState(info?.paymentInfo?.bankName || '');
  const [accountNumber, setAccountNumber] = useState(info?.paymentInfo?.accountNumber || '');
  const [accountName, setAccountName] = useState(info?.paymentInfo?.accountName || '');
  const [ewalletType, setEwalletType] = useState(info?.paymentInfo?.ewalletType || '');
  const [ewalletNumber, setEwalletNumber] = useState(info?.paymentInfo?.ewalletNumber || '');

  const inputStyle: React.CSSProperties = { padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #c7c8cf', fontSize: '0.82rem', fontFamily: f };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(25,28,32,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 100 }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '440px', maxHeight: '85vh', overflowY: 'auto' }}>
        <p style={{ fontFamily: f, fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '4px' }}>Konfirmasi Info Bank/E-Wallet</p>
        <p style={{ fontSize: '0.78rem', color: '#777683', marginBottom: '14px' }}>{info?.name} · {info?.phone}</p>

        {info?.pendingPaymentReply ? (
          <div style={{ background: '#fff4d6', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px' }}>
            <p style={{ fontSize: '0.72rem', color: '#8a5a00', fontWeight: 700, marginBottom: '4px' }}>Balasan WA (belum final, cocokkan ke form di bawah):</p>
            <p style={{ fontSize: '0.82rem', color: '#191c20', whiteSpace: 'pre-wrap' }}>{info.pendingPaymentReply.raw}</p>
          </div>
        ) : !info ? (
          <p style={{ fontSize: '0.8rem', color: '#777683', marginBottom: '16px' }}>Memuat…</p>
        ) : null}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Nama Bank" style={inputStyle} />
          <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="No. Rekening" style={inputStyle} />
          <input value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="Nama Pemilik Rekening" style={inputStyle} />
          <p style={{ fontSize: '0.74rem', color: '#9a99a6', margin: '4px 0 0' }}>Atau isi e-wallet (kalau tidak pakai rekening bank):</p>
          <input value={ewalletType} onChange={(e) => setEwalletType(e.target.value)} placeholder="Jenis E-Wallet (GoPay/OVO/Dana, dst)" style={inputStyle} />
          <input value={ewalletNumber} onChange={(e) => setEwalletNumber(e.target.value)} placeholder="No. E-Wallet" style={inputStyle} />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '18px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} style={{ background: 'none', border: '1.5px solid #c7c8cf', borderRadius: '10px', padding: '9px 16px', color: '#777683', fontFamily: f, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
            Batal
          </button>
          <button type="button" disabled={saving} onClick={() => onSave({ bankName, accountNumber, accountName, ewalletType, ewalletNumber })}
            style={{ background: '#6728e4', border: 'none', borderRadius: '10px', padding: '9px 16px', color: 'white', fontFamily: f, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Menyimpan...' : 'Konfirmasi & Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}

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
  const [requestingBankInfo, setRequestingBankInfo] = useState(false);
  const [confirmPicId, setConfirmPicId] = useState<string | null>(null);
  const [confirmPicInfo, setConfirmPicInfo] = useState<PicPaymentInfo | null>(null);
  const [confirmSaving, setConfirmSaving] = useState(false);
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

  // AD-adjustment-6: admin minta info bank/e-wallet via WA ke semua PIC campaign ini
  const requestBankInfo = async () => {
    setRequestingBankInfo(true);
    setActionError('');
    try {
      const res = await api.post(`/admin/campaigns/${id}/recap/request-bank-info`);
      setActionError('');
      window.alert(`Pesan WA terkirim ke ${res.data.count} PIC.`);
      await reloadCurrent();
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setActionError(msg || 'Gagal mengirim pesan WA.');
    } finally {
      setRequestingBankInfo(false);
    }
  };

  const openConfirmPic = async (picId: string) => {
    setConfirmPicId(picId);
    setConfirmPicInfo(null);
    try {
      const res = await api.get(`/admin/pic/${picId}/payment-info`);
      setConfirmPicInfo(res.data);
    } catch {
      setActionError('Gagal memuat info PIC. Coba lagi.');
      setConfirmPicId(null);
    }
  };

  const submitConfirmPic = async (fields: { bankName: string; accountNumber: string; accountName: string; ewalletType: string; ewalletNumber: string }) => {
    if (!confirmPicId) return;
    setConfirmSaving(true);
    try {
      await api.patch(`/admin/pic/${confirmPicId}/payment-info`, fields);
      setConfirmPicId(null);
      setConfirmPicInfo(null);
      await reloadCurrent();
    } catch {
      setActionError('Gagal menyimpan info bank/e-wallet. Coba lagi.');
    } finally {
      setConfirmSaving(false);
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
            <button type="button" onClick={() => void requestBankInfo()} disabled={requestingBankInfo}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 14px', height: '38px', borderRadius: '10px', border: 'none', background: '#25d366', color: 'white', fontFamily: f, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', opacity: requestingBankInfo ? 0.6 : 1 }}>
              <MessageCircle size={14} /> {requestingBankInfo ? 'Mengirim...' : 'Minta Info Bank/E-Wallet'}
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

      {actionError && (
        <div role="alert" style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '10px 14px', marginBottom: '10px', borderRadius: '10px', background: '#ffdad6', color: '#93000a', fontSize: '0.8rem' }}>
          {actionError}
          <button type="button" onClick={() => setActionError('')} aria-label="Tutup pesan" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93000a', display: 'flex' }}><X size={14} /></button>
        </div>
      )}

      {error ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#ba1a1a', background: '#fff', borderRadius: '12px', border: '1px solid #ffdad6' }}>{error}</div>
      ) : !view ? (
        <div style={{ textAlign: 'center', padding: '70px', color: '#777683', background: '#fff', borderRadius: '12px', border: `1px solid ${GRID}` }}>Memuat sheet…</div>
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
          actionHeader="Status"
          rowAction={kind === 'applicants' ? applicantAction : undefined}
          columnMenu={isMaster ? columnMenu : undefined}
          headerIcon={isMaster ? (col) => (view.columns?.[col] ? <AccessIcon access={view.columns[col].access} /> : null) : undefined}
          addColumnMenu={isMaster ? (close) => <AddColumnMenu onAdd={(cols) => { close(); void saveColumns([...progressCols, ...cols]); }} /> : undefined}
          footer=" · Data langsung dari database, sama dengan yang disinkron ke Google Sheets."
        />
      )}

      {isRecap && view?.byPic && (
        <div style={{ marginTop: '24px' }}>
          <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem', color: '#191c20', marginBottom: '10px' }}>Rekap per PIC</p>
          <SheetGrid
            key={`${kind}-byPic`}
            headers={view.byPic.headers}
            rows={view.byPic.rows}
            totals={view.byPic.totals}
            emptyText="Belum ada PIC yang pegang creator di campaign ini."
            actionHeader="Info Bank/E-Wallet"
            rowAction={(row) => {
              const picId = view.byPic?.rowIds?.[row];
              if (!picId) return null;
              return (
                <button type="button" onClick={() => void openConfirmPic(picId)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', border: 'none', background: '#f0eeff', color: '#6728e4', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                  Konfirmasi
                </button>
              );
            }}
          />
        </div>
      )}

      {confirmPicId && (
        <PicConfirmModal
          info={confirmPicInfo}
          saving={confirmSaving}
          onClose={() => { setConfirmPicId(null); setConfirmPicInfo(null); }}
          onSave={(fields) => void submitConfirmPic(fields)}
        />
      )}
    </div>
  );
}
