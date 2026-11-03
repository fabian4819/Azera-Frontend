import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getFacetedRowModel,
  flexRender, type ColumnDef, type SortingState, type ColumnFiltersState, type VisibilityState, type Updater, type Column, type Table as ReactTableInstance,
} from '@tanstack/react-table';
import { Search, RefreshCw, ChevronUp, ChevronDown, ChevronsUpDown, Filter, X as XIcon, ExternalLink, ArrowDownAZ, ArrowDownZA, EyeOff } from 'lucide-react';
import ViewToolbar from '../../components/ViewToolbar';
import { useViewHistory } from '../../hooks/useViewHistory';
import StatusBadge from '../../components/ui/StatusBadge';
import api from '../../lib/api';
import WaLink from '../../components/WaLink';
import { toUrl } from '../../lib/links';

interface ExtensionMetric { followers?: number; engagementRate?: number; avgViews?: number; avgLikes?: number }
interface Social { platform: string; username: string; profileUrl?: string; followers: number }
interface CreatorItem {
  _id: string; name: string; phone: string; email?: string; age?: number; gender?: string;
  domicile?: { province?: string; city?: string };
  niches: string[]; nicheOther?: string; contentStyles: string[]; contentStyleOther?: string;
  activities: string[];
  socials: Social[];
  rateEstimateType?: string; rateEstimateAmount?: number; rateNegotiable?: string;
  bankAccount?: { bankName?: string; accountNumber?: string; accountName?: string };
  npwp?: string; portfolioLink?: string;
  performanceScore: { overall: number };
  cancelCount: number; complianceStatus: string; source: string; status: string; createdAt: string;
  campaigns?: string[];
  extensionMetrics?: Record<string, ExtensionMetric>;
}

const PLATFORMS = ['instagram', 'tiktok', 'threads', 'x'] as const;
const PLATFORM_LABELS: Record<string, string> = { instagram: 'Instagram', tiktok: 'TikTok', threads: 'Threads', x: 'X' };
// Sama dengan prefix di client/src/pages/KOLRegister.tsx buildProfileUrl().
const PLATFORM_URL_PREFIX: Record<string, string> = {
  instagram: 'https://instagram.com/', tiktok: 'https://tiktok.com/@', threads: 'https://threads.com/@', x: 'https://x.com/',
};
const GENDER_LABELS: Record<string, string> = { male: 'Laki-laki', female_hijab: 'Perempuan (Hijab)', female_non_hijab: 'Perempuan (Non-Hijab)' };
const RATE_NEGO_LABELS: Record<string, string> = { yes: 'Bisa', no: 'Tidak', depends: 'Tergantung campaign' };
const ACTIVITY_LABELS: Record<string, string> = {
  kol: 'KOL (Key Opinion Leader)', koc: 'KOC (Key Opinion Consumer)', ugc: 'UGC Creator',
  affiliator: 'Affiliator', live_streamer: 'Live Streamer',
};
const STATUS_LABELS: Record<string, string> = { pending: 'Menunggu', reviewing: 'Dikurasi', approved: 'Disetujui', rejected: 'Ditolak' };
type EditableStatus = 'pending' | 'approved' | 'rejected';
const EDITABLE_STATUSES: EditableStatus[] = ['pending', 'approved', 'rejected'];
// Warna dropdown status = warna badge status (components/ui/StatusBadge.tsx)
const STATUS_STYLE: Record<string, React.CSSProperties> = {
  pending: { background: '#eceef3', color: '#464652' }, reviewing: { background: '#e1e0ff', color: '#15157d' },
  approved: { background: '#d1fae5', color: '#065F46' }, rejected: { background: '#ffdad6', color: '#ba1a1a' },
};
const STATUS_NOTE: Record<EditableStatus, string> = {
  approved: 'Creator menerima WhatsApp & email "lolos kurasi" berisi link Komunitas WhatsApp, dan ikut broadcast "semua creator disetujui".',
  rejected: 'Creator menerima WhatsApp & email penolakan (akan dikabari kalau ada campaign yang cocok).',
  pending: 'Tidak ada pesan yang dikirim ke creator.',
};
const complianceLabels: Record<string, { label: string; color: string; bg: string }> = {
  ok: { label: 'OK', color: '#065F46', bg: '#d1fae5' },
  sp1: { label: 'SP1', color: '#92400E', bg: '#fef3c7' },
  sp2_blacklist: { label: 'Blacklist', color: '#ba1a1a', bg: '#ffdad6' },
};

function compactNumber(n?: number | null): string {
  if (n == null) return '-';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}
function rateSummary(c: Pick<CreatorItem, 'rateEstimateType' | 'rateEstimateAmount'>): string {
  if (c.rateEstimateType === 'nominal' && c.rateEstimateAmount) return `Rp ${c.rateEstimateAmount.toLocaleString('id-ID')}`;
  if (c.rateEstimateType === 'unknown') return 'Belum ada patokan';
  return '';
}
function socialUrl(s: Social | undefined): string {
  if (!s || !s.username) return '';
  const handle = s.username.replace(/^@+/, '').trim();
  if (!handle) return '';
  return s.profileUrl || `${PLATFORM_URL_PREFIX[s.platform]}${handle}`;
}

// Satu filterFn generik dipakai semua kolom, nilai kolom boleh scalar atau array (niche dkk),
// dicocokkan sebagai "salah satu token-nya ada di daftar yang dicentang user". Ini bikin filter
// checkbox model Sheets/Excel bisa dipakai seragam di semua 44 kolom tanpa widget per-tipe.
function multiTokenFilter(row: { getValue: (id: string) => unknown }, columnId: string, filterValue: string[]): boolean {
  const raw = row.getValue(columnId);
  const tokens = Array.isArray(raw) ? raw : [raw];
  return tokens.some((t) => filterValue.includes(t == null || t === '' ? '(Kosong)' : String(t)));
}

const SOURCE_LABELS: Record<string, string> = { form: 'Form', extension: 'Ekstensi', campaign: 'Link Campaign', import: 'Import Sheet' };

interface Props {
  /** general = daftar lewat form KOL Register; campaign = masuk lewat link apply campaign / import sheet;
   * share = form + campaign/import yang punya nomor WA (picker Broadcast Campaign) */
  scope?: 'general' | 'campaign' | 'share';
  /** Mode pilih: kolom Aksi diganti checklist di paling kiri */
  selected?: string[];
  onSelectedChange?: (ids: string[]) => void;
}

interface CreatorsView { sorting: SortingState; columnFilters: ColumnFiltersState; columnVisibility: VisibilityState }
const DEFAULT_VIEW: CreatorsView = { sorting: [{ id: 'createdAt', desc: true }], columnFilters: [], columnVisibility: {} };

export default function Creators({ scope = 'general', selected, onSelectedChange }: Props) {
  const [creators, setCreators] = useState<CreatorItem[]>([]);
  const [statusChange, setStatusChange] = useState<{ id: string; name: string; to: EditableStatus } | null>(null);
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusError, setStatusError] = useState('');
  const saveStatus = async () => {
    if (!statusChange) return;
    setStatusSaving(true);
    setStatusError('');
    try {
      const res = await api.patch(`/admin/creators/${statusChange.id}`, { status: statusChange.to });
      setCreators((prev) => prev.map((c) => (c._id === statusChange.id ? { ...c, status: res.data.status } : c)));
      setStatusChange(null);
    } catch {
      setStatusError('Gagal mengubah status. Coba lagi.');
    } finally {
      setStatusSaving(false);
    }
  };
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  // Urutan, filter kolom & kolom tersembunyi lewat riwayat supaya bisa Undo / Reset tampilan
  const [view, setView, undoView, canUndo] = useViewHistory<CreatorsView>(DEFAULT_VIEW);
  const { sorting, columnFilters, columnVisibility } = view;
  const viewSetter = <K extends keyof CreatorsView>(key: K) => (u: Updater<CreatorsView[K]>) =>
    setView((v) => ({ ...v, [key]: typeof u === 'function' ? (u as (old: CreatorsView[K]) => CreatorsView[K])(v[key]) : u }));
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchCreators = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/creators', { params: scope === 'share' ? {} : { scope } });
      setCreators(scope === 'share' ? res.data.filter((c: CreatorItem) => c.source !== 'extension' && c.phone) : res.data);
    } catch {
      setCreators([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void fetchCreators(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    api.get('/admin/creators/sheet-url').then((res) => setSheetUrl(res.data.url)).catch(() => setSheetUrl(null));
  }, []);

  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  const columns = useMemo<ColumnDef<CreatorItem>[]>(() => {
    const metricCols = (platform: string): ColumnDef<CreatorItem>[] => {
      const m = (c: CreatorItem) => c.extensionMetrics?.[platform];
      const social = (c: CreatorItem) => c.socials?.find((s) => s.platform === platform);
      const label = PLATFORM_LABELS[platform];
      return [
        {
          id: `${platform}_username`, header: label, accessorFn: (c) => social(c)?.username || '',
          filterFn: multiTokenFilter,
          cell: ({ getValue, row }) => {
            const username = getValue<string>();
            if (!username) return <span style={{ color: '#c7c8cf' }}>-</span>;
            const url = socialUrl(social(row.original));
            return url ? <a href={url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: '#6728e4', textDecoration: 'none', fontWeight: 600 }}>@{username}</a> : `@${username}`;
          },
        },
        {
          id: `${platform}_followers`, header: `${label} Followers`,
          accessorFn: (c) => m(c)?.followers ?? social(c)?.followers ?? null,
          filterFn: multiTokenFilter, cell: ({ getValue }) => compactNumber(getValue<number | null>()),
        },
        {
          id: `${platform}_er`, header: `${label} ER`, accessorFn: (c) => m(c)?.engagementRate ?? null,
          filterFn: multiTokenFilter, cell: ({ getValue }) => { const v = getValue<number | null>(); return v == null ? '-' : `${v}%`; },
        },
        {
          id: `${platform}_avgViews`, header: `${label} Avg Views`, accessorFn: (c) => m(c)?.avgViews ?? null,
          filterFn: multiTokenFilter, cell: ({ getValue }) => compactNumber(getValue<number | null>()),
        },
        {
          id: `${platform}_avgLikes`, header: `${label} Avg Likes`, accessorFn: (c) => m(c)?.avgLikes ?? null,
          filterFn: multiTokenFilter, cell: ({ getValue }) => compactNumber(getValue<number | null>()),
        },
      ];
    };

    const arrayCol = (id: string, header: string, accessorFn: (c: CreatorItem) => string[]): ColumnDef<CreatorItem> => ({
      id, header, accessorFn, filterFn: multiTokenFilter,
      sortingFn: (a, b) => (accessorFn(a.original).join(', ')).localeCompare(accessorFn(b.original).join(', ')),
      cell: ({ getValue }) => { const arr = getValue<string[]>(); return arr.length ? arr.join(', ') : <span style={{ color: '#c7c8cf' }}>-</span>; },
    });

    const textCol = (id: string, header: string, accessorFn: (c: CreatorItem) => string, cell?: ColumnDef<CreatorItem>['cell']): ColumnDef<CreatorItem> => ({
      id, header, accessorFn, filterFn: multiTokenFilter,
      cell: cell ?? (({ getValue }) => { const v = getValue<string>(); return v || <span style={{ color: '#c7c8cf' }}>-</span>; }),
    });

    const numCol = (id: string, header: string, accessorFn: (c: CreatorItem) => number | null, cell?: ColumnDef<CreatorItem>['cell']): ColumnDef<CreatorItem> => ({
      id, header, accessorFn, filterFn: multiTokenFilter,
      cell: cell ?? (({ getValue }) => { const v = getValue<number | null>(); return v ?? <span style={{ color: '#c7c8cf' }}>-</span>; }),
    });

    return [
      ...(onSelectedChange ? [{
        id: 'select', enableSorting: false, enableColumnFilter: false,
        // Centang semua = semua baris yang lolos filter/cari saat ini
        header: ({ table }) => {
          const ids = table.getFilteredRowModel().rows.map((r) => r.original._id);
          const all = ids.length > 0 && ids.every((id) => selected?.includes(id));
          return (
            <input type="checkbox" aria-label="Pilih semua creator" checked={all} style={{ width: '16px', height: '16px', accentColor: '#6728e4', cursor: 'pointer' }}
              onChange={() => onSelectedChange(all ? (selected || []).filter((id) => !ids.includes(id)) : [...new Set([...(selected || []), ...ids])])} />
          );
        },
        cell: ({ row }) => {
          const id = row.original._id;
          const on = Boolean(selected?.includes(id));
          return (
            <input type="checkbox" aria-label={`Pilih ${row.original.name}`} checked={on} onClick={(e) => e.stopPropagation()} style={{ width: '16px', height: '16px', accentColor: '#6728e4', cursor: 'pointer' }}
              onChange={() => onSelectedChange(on ? (selected || []).filter((x) => x !== id) : [...(selected || []), id])} />
          );
        },
      } as ColumnDef<CreatorItem>] : []),
      textCol('name', 'Nama', (c) => c.name, ({ getValue }) => <span style={{ fontWeight: 600, color: '#191c20' }}>{getValue<string>()}</span>),
      {
        id: 'createdAt', header: 'Tanggal Daftar', accessorFn: (c) => c.createdAt, filterFn: multiTokenFilter,
        sortingFn: (a, b) => +new Date(a.original.createdAt) - +new Date(b.original.createdAt),
        cell: ({ getValue }) => formatDate(getValue<string>()),
      },
      ...(scope !== 'general' ? [arrayCol('campaigns', 'Campaign', (c) => c.campaigns || [])] : []),
      textCol('phone', 'WhatsApp', (c) => c.phone, ({ getValue }) => <WaLink phone={getValue<string>()} />),
      textCol('email', 'Email', (c) => c.email || ''),
      numCol('age', 'Usia', (c) => c.age ?? null),
      textCol('gender', 'Jenis Kelamin', (c) => (c.gender ? GENDER_LABELS[c.gender] || c.gender : '')),
      textCol('city', 'Kota', (c) => c.domicile?.city || ''),
      textCol('province', 'Provinsi', (c) => c.domicile?.province || ''),
      arrayCol('niche', 'Niche', (c) => [...(c.niches || []), ...(c.nicheOther ? [c.nicheOther] : [])]),
      arrayCol('gayaKonten', 'Gaya Konten', (c) => [...(c.contentStyles || []), ...(c.contentStyleOther ? [c.contentStyleOther] : [])]),
      arrayCol('aktivitas', 'Aktivitas', (c) => (c.activities || []).map((a) => ACTIVITY_LABELS[a] || a)),
      ...PLATFORMS.flatMap(metricCols),
      textCol('rate', 'Estimasi Rate', rateSummary),
      textCol('rateNego', 'Rate Bisa Nego', (c) => (c.rateNegotiable ? RATE_NEGO_LABELS[c.rateNegotiable] || c.rateNegotiable : '')),
      textCol('bankName', 'Nama Bank', (c) => c.bankAccount?.bankName || ''),
      textCol('accountNumber', 'No. Rekening', (c) => c.bankAccount?.accountNumber || ''),
      textCol('accountName', 'Nama Pemilik Rekening', (c) => c.bankAccount?.accountName || ''),
      textCol('npwp', 'NPWP', (c) => c.npwp || ''),
      textCol('portfolio', 'Portfolio', (c) => c.portfolioLink || '', ({ getValue }) => {
        const v = getValue<string>();
        const href = v ? toUrl(v) : null;
        return href ? <a href={href} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: '#6728e4', textDecoration: 'none' }}>Buka link</a> : <span style={{ color: '#c7c8cf' }}>-</span>;
      }),
      numCol('performanceScore', 'Skor', (c) => c.performanceScore?.overall ?? 0, ({ getValue }) => <span style={{ fontWeight: 700, color: '#6728e4' }}>{getValue<number>()}</span>),
      numCol('cancelCount', 'Jumlah Cancel', (c) => c.cancelCount ?? 0),
      textCol('compliance', 'Compliance', (c) => (complianceLabels[c.complianceStatus] || complianceLabels.ok).label, ({ row }) => {
        const comp = complianceLabels[row.original.complianceStatus] || complianceLabels.ok;
        return <span style={{ background: comp.bg, color: comp.color, borderRadius: '999px', padding: '3px 10px', fontSize: '0.7rem', fontWeight: 700 }}>{comp.label}</span>;
      }),
      textCol('source', 'Sumber', (c) => SOURCE_LABELS[c.source] || c.source),
      // Status bisa diubah langsung dari tabel (bukan mode share); ke Disetujui/Ditolak = konfirmasi dulu, karena kirim WA + email
      textCol('status', 'Status', (c) => STATUS_LABELS[c.status] || c.status, ({ row }) => onSelectedChange
        ? <StatusBadge status={row.original.status} />
        : (
          <select
            aria-label={`Status ${row.original.name}`}
            value={row.original.status}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setStatusChange({ id: row.original._id, name: row.original.name, to: e.target.value as EditableStatus })}
            style={{ ...STATUS_STYLE[row.original.status] ?? STATUS_STYLE.pending, border: 'none', borderRadius: '999px', padding: '4px 8px 4px 12px', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'var(--font-display)', cursor: 'pointer', outline: 'none' }}
          >
            {(row.original.status === 'reviewing' ? ['reviewing', ...EDITABLE_STATUSES] : EDITABLE_STATUSES).map((st) => <option key={st} value={st}>{STATUS_LABELS[st]}</option>)}
          </select>
        )),
    ];
  }, [scope, selected, onSelectedChange]);

  const openRow = (e: React.MouseEvent | React.KeyboardEvent, id: string) => {
    if (onSelectedChange) {
      const on = Boolean(selected?.includes(id));
      onSelectedChange(on ? (selected || []).filter((x) => x !== id) : [...(selected || []), id]);
      return;
    }
    const url = `/admin/creators/${id}`;
    if (e.metaKey || e.ctrlKey) window.open(url, '_blank'); else navigate(url);
  };

  // Lebar kolom pilih tetap supaya kolom Nama tahu offset kirinya; bayangan cuma di kolom terkunci terakhir (Nama)
  const SELECT_W = 44;
  const stickyCol = (id: string, head: boolean): React.CSSProperties => {
    // Status terkunci di kanan (bisa diubah langsung tanpa geser tabel)
    if (id === 'status') return { position: 'sticky', right: 0, zIndex: head ? 3 : 1, background: head ? '#f8f9ff' : 'inherit', boxShadow: '-6px 0 8px -6px rgba(0,0,0,0.12)' };
    if (id !== 'select' && id !== 'name') return {};
    const left = id === 'name' && onSelectedChange ? SELECT_W : 0;
    return {
      position: 'sticky', left, zIndex: head ? 3 : 1, background: head ? '#f8f9ff' : 'inherit',
      ...(id === 'select' ? { width: SELECT_W, minWidth: SELECT_W, maxWidth: SELECT_W, padding: head ? 0 : '12px 0' } : { boxShadow: '6px 0 8px -6px rgba(0,0,0,0.12)' }),
    };
  };

  const table = useReactTable({
    data: creators,
    columns,
    state: { sorting, columnFilters, columnVisibility, globalFilter },
    onSortingChange: viewSetter('sorting'),
    onColumnFiltersChange: viewSetter('columnFilters'),
    onColumnVisibilityChange: viewSetter('columnVisibility'),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _id, filterValue: string) => {
      const q = filterValue.toLowerCase();
      return row.original.name.toLowerCase().includes(q) || row.original.phone.includes(q) || (row.original.email || '').toLowerCase().includes(q);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
  });

  const hideable = table.getAllLeafColumns().filter((c) => c.id !== 'select');
  const visibleCount = table.getVisibleLeafColumns().length;

  return (
    <div>
      {statusChange && (
        <div role="dialog" aria-modal="true" aria-label="Konfirmasi ubah status" onClick={() => !statusSaving && setStatusChange(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(25,28,32,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '24px', maxWidth: '420px', width: '100%', fontFamily: 'var(--font-display)' }}>
            <p style={{ fontWeight: 800, fontSize: '1.05rem', color: '#191c20', marginBottom: '8px' }}>Ubah status {statusChange.name} jadi {STATUS_LABELS[statusChange.to]}?</p>
            <p style={{ fontSize: '0.84rem', color: '#464652', lineHeight: 1.6, marginBottom: '16px' }}>{STATUS_NOTE[statusChange.to]}</p>
            {statusError && <p role="alert" style={{ color: '#ba1a1a', fontSize: '0.8rem', marginBottom: '10px' }}>{statusError}</p>}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => { setStatusChange(null); setStatusError(''); }} disabled={statusSaving}
                style={{ padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #e1e0ff', background: 'white', color: '#464652', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'inherit' }}>Batal</button>
              <button type="button" onClick={() => void saveStatus()} disabled={statusSaving} className="btn-primary" style={{ padding: '10px 18px', fontSize: '0.85rem', opacity: statusSaving ? 0.6 : 1 }}>
                {statusSaving ? 'Menyimpan...' : `Ya, ${STATUS_LABELS[statusChange.to]}`}
              </button>
            </div>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#777683' }} />
          <input
            value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Cari nama, WhatsApp, atau email..."
            style={{ padding: '10px 14px 10px 36px', borderRadius: '10px', border: '1.5px solid #c7c8cf', fontSize: '0.875rem', outline: 'none', fontFamily: 'var(--font-display)', background: 'white', width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <ViewToolbar
            columns={hideable.map((c) => ({ id: c.id, label: typeof c.columnDef.header === 'string' ? c.columnDef.header : c.id, visible: c.getIsVisible() }))}
            onToggleColumn={(id) => table.getColumn(id)?.toggleVisibility()}
            onShowAll={() => setView((v) => ({ ...v, columnVisibility: {} }))}
            canUndo={canUndo} onUndo={undoView}
            canReset={view !== DEFAULT_VIEW} onReset={() => setView(DEFAULT_VIEW)} />
          <button onClick={fetchCreators} style={{ padding: '10px', borderRadius: '10px', border: '1.5px solid #c7c8cf', background: 'white', cursor: 'pointer', color: '#777683', display: 'flex' }}>
            <RefreshCw size={16} />
          </button>
          {sheetUrl && (
            <a
              href={sheetUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #c7c8cf', background: 'white', color: '#464652', fontSize: '0.82rem', fontWeight: 700, fontFamily: "var(--font-display)", textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              <ExternalLink size={14} />Buka Sheet
            </a>
          )}
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e1e0ff', overflow: 'hidden', boxShadow: '0 2px 12px rgba(107,46,232,0.06)' }}>
        {/* Kolom pilih (mode share) + Nama terkunci di kiri saat tabel digeser horizontal */}
        <div style={{ overflow: 'auto', maxHeight: '75vh' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} style={{ background: '#f8f9ff', borderBottom: '1px solid #e1e0ff' }}>
                  {hg.headers.map((header) => (
                    <th key={header.id} style={{ padding: 0, position: 'sticky', top: 0, background: '#f8f9ff', zIndex: 1, ...stickyCol(header.column.id, true) }}>
                      {header.column.getCanFilter() ? (
                        <ColumnHeaderCell column={header.column} table={table}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </ColumnHeaderCell>
                      ) : (
                        <div style={{ padding: '12px 14px', fontFamily: "var(--font-display)", fontWeight: 700, color: '#191c20', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={visibleCount} style={{ textAlign: 'center', padding: '48px', color: '#777683' }}>Memuat...</td></tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr><td colSpan={visibleCount} style={{ textAlign: 'center', padding: '48px', color: '#777683' }}>Belum ada creator yang cocok.</td></tr>
              ) : table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  // Klik baris = buka detail creator (Ctrl/⌘ = tab baru); mode pilih (share) = centang
                  onClick={(e) => openRow(e, row.original._id)}
                  onKeyDown={(e) => { if (e.key === 'Enter') openRow(e, row.original._id); }}
                  tabIndex={0}
                  style={{ borderBottom: '1px solid #e1e0ff', background: i % 2 === 0 ? 'white' : '#fcfcff', cursor: 'pointer' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#F8F6FF')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? 'white' : '#fcfcff')}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} style={{ padding: '12px 14px', color: '#464652', whiteSpace: 'nowrap', fontFamily: 'var(--font-display)', ...stickyCol(cell.column.id, false), ...(cell.column.id === 'select' ? { textAlign: 'center' } : {}) }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid #e1e0ff', color: '#777683', fontSize: '0.78rem', fontFamily: 'var(--font-display)' }}>
          {table.getRowModel().rows.length} dari {creators.length} creator ditampilkan{selected && ` · ${selected.length} dipilih`}
        </div>
      </div>
    </div>
  );
}

const menuItem: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '6px 8px', background: 'none', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', color: '#191c20', textAlign: 'left', fontFamily: 'var(--font-display)' };

// Header sel: klik label buat sort (klik lagi buat balik arah / lepas sort), klik ikon corong
// buka daftar checkbox nilai unik kolom itu, persis pola filter default Sheets/Excel, dipakai
// seragam buat semua kolom (baik nilai scalar maupun array) lewat multiTokenFilter di atas.
function ColumnHeaderCell({ column, table, children }: { column: Column<CreatorItem, unknown>; table: ReactTableInstance<CreatorItem>; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const sort = column.getIsSorted();
  const filterValue = column.getFilterValue() as string[] | undefined;
  const isFiltered = filterValue !== undefined;
  const otherColumnFilters = table.getState().columnFilters;

  const uniqueValues = useMemo(() => {
    const set = new Set<string>();
    for (const row of column.getFacetedRowModel().rows) {
      const raw = row.getValue(column.id);
      const tokens = Array.isArray(raw) ? raw : [raw];
      for (const t of tokens) set.add(t == null || t === '' ? '(Kosong)' : String(t));
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    // otherColumnFilters dipakai murni sebagai trigger recompute (facet berubah kalau kolom LAIN
    // difilter), bukan dibaca di body, makanya lint kira "tidak perlu".
  }, [column, otherColumnFilters]);

  const selected = filterValue ?? uniqueValues; // undefined filter = semua tercentang
  const visibleOptions = query ? uniqueValues.filter((v) => v.toLowerCase().includes(query.toLowerCase())) : uniqueValues;

  const toggle = (value: string) => {
    const base = filterValue ?? uniqueValues;
    const next = base.includes(value) ? base.filter((v) => v !== value) : [...base, value];
    column.setFilterValue(next.length === uniqueValues.length ? undefined : next);
  };

  const openPopover = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) setPos({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX });
    setOpen(true);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '10px 8px 10px 14px', whiteSpace: 'nowrap' }}>
      <span
        onClick={column.getToggleSortingHandler()}
        style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontFamily: "var(--font-display)", fontWeight: 700, color: '#191c20', fontSize: '0.75rem', userSelect: 'none' }}
      >
        {children}
        {sort === 'asc' ? <ChevronUp size={13} /> : sort === 'desc' ? <ChevronDown size={13} /> : <ChevronsUpDown size={12} color="#c7c8cf" />}
      </span>
      <button
        ref={btnRef}
        onClick={openPopover}
        title="Filter"
        style={{ display: 'flex', padding: '3px', background: isFiltered ? '#6728e4' : 'transparent', color: isFiltered ? 'white' : '#a9a9b8', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        <Filter size={11} />
      </button>
      {open && pos && createPortal(
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 200 }} />
          <div style={{ position: 'absolute', top: pos.top, left: pos.left, zIndex: 201, background: 'white', borderRadius: '10px', border: '1px solid #e1e0ff', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', width: '230px', maxHeight: '340px', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-display)' }}>
            <div style={{ padding: '8px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Search size={13} color="#777683" />
              <input
                autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nilai..."
                style={{ border: 'none', outline: 'none', fontSize: '0.78rem', flex: 1, fontFamily: 'var(--font-display)' }}
              />
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#777683', display: 'flex' }}><XIcon size={13} /></button>
            </div>
            <div style={{ padding: '4px', borderBottom: '1px solid #eee' }}>
              {column.getCanSort() && ([[false, ArrowDownAZ, 'Urutkan A → Z'], [true, ArrowDownZA, 'Urutkan Z → A']] as const).map(([desc, Icon, label]) => (
                <button key={label} type="button" onClick={() => { column.toggleSorting(desc); setOpen(false); }}
                  style={{ ...menuItem, fontWeight: sort === (desc ? 'desc' : 'asc') ? 700 : 500 }}><Icon size={14} /> {label}</button>
              ))}
              <button type="button" onClick={() => { column.toggleVisibility(false); setOpen(false); }} style={menuItem}><EyeOff size={14} /> Sembunyikan kolom</button>
            </div>
            <div style={{ display: 'flex', gap: '10px', padding: '6px 10px', fontSize: '0.72rem' }}>
              <button onClick={() => column.setFilterValue(undefined)} style={{ background: 'none', border: 'none', color: '#6728e4', cursor: 'pointer', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Pilih Semua</button>
              <button onClick={() => column.setFilterValue([])} style={{ background: 'none', border: 'none', color: '#777683', cursor: 'pointer', fontWeight: 700, fontFamily: 'var(--font-display)' }}>Kosongkan</button>
            </div>
            <div style={{ overflowY: 'auto', padding: '4px 4px 8px' }}>
              {visibleOptions.length === 0 && <div style={{ padding: '10px', fontSize: '0.78rem', color: '#a9a9b8' }}>Tidak ada nilai.</div>}
              {visibleOptions.map((v) => (
                <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 8px', fontSize: '0.78rem', color: '#464652', cursor: 'pointer', borderRadius: '6px' }}>
                  <input type="checkbox" checked={selected.includes(v)} onChange={() => toggle(v)} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{v}</span>
                </label>
              ))}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
