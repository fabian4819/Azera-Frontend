import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getFacetedRowModel,
  flexRender, type ColumnDef, type SortingState, type ColumnFiltersState, type Column, type Table as ReactTableInstance,
} from '@tanstack/react-table';
import { Search, Eye, RefreshCw, ChevronUp, ChevronDown, ChevronsUpDown, Filter, X as XIcon, ExternalLink } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import api from '../../lib/api';

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
const complianceLabels: Record<string, { label: string; color: string; bg: string }> = {
  ok: { label: 'OK', color: '#065F46', bg: '#d1fae5' },
  sp1: { label: 'SP1', color: '#92400E', bg: '#fef3c7' },
  sp2_blacklist: { label: 'Blacklist', color: '#ba1a1a', bg: '#ffdad6' },
};

function compactNumber(n?: number | null): string {
  if (n == null) return '—';
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

// Satu filterFn generik dipakai semua kolom — nilai kolom boleh scalar atau array (niche dkk),
// dicocokkan sebagai "salah satu token-nya ada di daftar yang dicentang user". Ini bikin filter
// checkbox model Sheets/Excel bisa dipakai seragam di semua 44 kolom tanpa widget per-tipe.
function multiTokenFilter(row: { getValue: (id: string) => unknown }, columnId: string, filterValue: string[]): boolean {
  const raw = row.getValue(columnId);
  const tokens = Array.isArray(raw) ? raw : [raw];
  return tokens.some((t) => filterValue.includes(t == null || t === '' ? '(Kosong)' : String(t)));
}

export default function Creators() {
  const [creators, setCreators] = useState<CreatorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([{ id: 'performanceScore', desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchCreators = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/creators');
      setCreators(res.data);
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
            if (!username) return <span style={{ color: '#c7c8cf' }}>—</span>;
            const url = socialUrl(social(row.original));
            return url ? <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#6728e4', textDecoration: 'none', fontWeight: 600 }}>@{username}</a> : `@${username}`;
          },
        },
        {
          id: `${platform}_followers`, header: `${label} Followers`,
          accessorFn: (c) => m(c)?.followers ?? social(c)?.followers ?? null,
          filterFn: multiTokenFilter, cell: ({ getValue }) => compactNumber(getValue<number | null>()),
        },
        {
          id: `${platform}_er`, header: `${label} ER`, accessorFn: (c) => m(c)?.engagementRate ?? null,
          filterFn: multiTokenFilter, cell: ({ getValue }) => { const v = getValue<number | null>(); return v == null ? '—' : `${v}%`; },
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
      cell: ({ getValue }) => { const arr = getValue<string[]>(); return arr.length ? arr.join(', ') : <span style={{ color: '#c7c8cf' }}>—</span>; },
    });

    const textCol = (id: string, header: string, accessorFn: (c: CreatorItem) => string, cell?: ColumnDef<CreatorItem>['cell']): ColumnDef<CreatorItem> => ({
      id, header, accessorFn, filterFn: multiTokenFilter,
      cell: cell ?? (({ getValue }) => { const v = getValue<string>(); return v || <span style={{ color: '#c7c8cf' }}>—</span>; }),
    });

    const numCol = (id: string, header: string, accessorFn: (c: CreatorItem) => number | null, cell?: ColumnDef<CreatorItem>['cell']): ColumnDef<CreatorItem> => ({
      id, header, accessorFn, filterFn: multiTokenFilter,
      cell: cell ?? (({ getValue }) => { const v = getValue<number | null>(); return v ?? <span style={{ color: '#c7c8cf' }}>—</span>; }),
    });

    return [
      {
        id: 'createdAt', header: 'Tanggal Daftar', accessorFn: (c) => c.createdAt, filterFn: multiTokenFilter,
        sortingFn: (a, b) => +new Date(a.original.createdAt) - +new Date(b.original.createdAt),
        cell: ({ getValue }) => formatDate(getValue<string>()),
      },
      textCol('name', 'Nama', (c) => c.name, ({ getValue }) => <span style={{ fontWeight: 600, color: '#191c20' }}>{getValue<string>()}</span>),
      textCol('phone', 'WhatsApp', (c) => c.phone),
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
        return v ? <a href={v} target="_blank" rel="noopener noreferrer" style={{ color: '#6728e4', textDecoration: 'none' }}>Buka link</a> : <span style={{ color: '#c7c8cf' }}>—</span>;
      }),
      numCol('performanceScore', 'Skor', (c) => c.performanceScore?.overall ?? 0, ({ getValue }) => <span style={{ fontWeight: 700, color: '#6728e4' }}>{getValue<number>()}</span>),
      numCol('cancelCount', 'Jumlah Cancel', (c) => c.cancelCount ?? 0),
      textCol('compliance', 'Compliance', (c) => (complianceLabels[c.complianceStatus] || complianceLabels.ok).label, ({ row }) => {
        const comp = complianceLabels[row.original.complianceStatus] || complianceLabels.ok;
        return <span style={{ background: comp.bg, color: comp.color, borderRadius: '999px', padding: '3px 10px', fontSize: '0.7rem', fontWeight: 700 }}>{comp.label}</span>;
      }),
      textCol('source', 'Sumber', (c) => (c.source === 'import' ? 'Import' : 'Form')),
      textCol('status', 'Status', (c) => STATUS_LABELS[c.status] || c.status, ({ row }) => <StatusBadge status={row.original.status} />),
      {
        id: 'action', header: 'Aksi', enableSorting: false, enableColumnFilter: false,
        cell: ({ row }) => (
          <button
            onClick={() => navigate(`/admin/creators/${row.original._id}`)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: '#e1e0ff', color: '#6728e4', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontFamily: "var(--font-display)", fontWeight: 700, whiteSpace: 'nowrap' }}
          >
            <Eye size={14} />View
          </button>
        ),
      },
    ];
  }, [navigate]);

  const table = useReactTable({
    data: creators,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
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

  const activeFilterCount = columnFilters.length;

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#777683' }} />
          <input
            value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Cari nama, WhatsApp, atau email..."
            style={{ padding: '10px 14px 10px 36px', borderRadius: '10px', border: '1.5px solid #c7c8cf', fontSize: '0.875rem', outline: 'none', fontFamily: 'var(--font-display)', background: 'white', width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {activeFilterCount > 0 && (
            <button
              onClick={() => setColumnFilters([])}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6728e4', fontSize: '0.8rem', fontWeight: 700, fontFamily: "var(--font-display)" }}
            >
              Hapus {activeFilterCount} filter kolom
            </button>
          )}
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
        <div style={{ overflow: 'auto', maxHeight: '75vh' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} style={{ background: '#f8f9ff', borderBottom: '1px solid #e1e0ff' }}>
                  {hg.headers.map((header) => (
                    <th key={header.id} style={{ padding: 0, position: 'sticky', top: 0, background: '#f8f9ff', zIndex: 1 }}>
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
                <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: '48px', color: '#777683' }}>Memuat...</td></tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: '48px', color: '#777683' }}>Belum ada creator yang cocok.</td></tr>
              ) : table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  style={{ borderBottom: '1px solid #e1e0ff', background: i % 2 === 0 ? 'white' : '#fcfcff' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#F8F6FF')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? 'white' : '#fcfcff')}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} style={{ padding: '12px 14px', color: '#464652', whiteSpace: 'nowrap', fontFamily: 'var(--font-display)' }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid #e1e0ff', color: '#777683', fontSize: '0.78rem', fontFamily: 'var(--font-display)' }}>
          {table.getRowModel().rows.length} dari {creators.length} creator ditampilkan
        </div>
      </div>
    </div>
  );
}

// Header sel: klik label buat sort (klik lagi buat balik arah / lepas sort), klik ikon corong
// buka daftar checkbox nilai unik kolom itu — persis pola filter default Sheets/Excel, dipakai
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
    // difilter) — bukan dibaca di body, makanya lint kira "tidak perlu".
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
