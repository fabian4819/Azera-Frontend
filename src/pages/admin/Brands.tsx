import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import api from '../../lib/api';
import SheetGrid from '../../components/SheetGrid';

interface Brand {
  _id: string;
  namaBrand: string;
  namaPIC: string;
  whatsapp: string;
  kategori?: string;
  paket?: string;
  jasa?: string;
  budget: string;
  status: string;
  source: 'web' | 'whatsapp';
  createdAt: string;
}

const JASA_LABELS: Record<string, string> = {
  nano_micro_kol_campaign: 'Nano-Micro KOL Campaign',
  koc_campaign: 'KOC Campaign',
  affiliate_creator_campaign: 'Affiliate Creator Campaign',
  event_creator_activation: 'Event Creator Activation',
};

// Tabel ala Sheets: cari, filter & urut per kolom (termasuk Status & Sumber), bekukan, sembunyikan kolom.
const HEADERS = ['Brand', 'PIC', 'WhatsApp', 'Kategori', 'Paket', 'Sumber', 'Budget', 'Status', 'Tanggal'];
const SOURCE_COL = HEADERS.indexOf('Sumber');
const STATUS_COL = HEADERS.indexOf('Status');
const SOURCE_LABEL = { whatsapp: 'WhatsApp Bot', web: 'Web' } as const;

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/brands');
      setBrands(res.data);
    } catch {
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void fetchBrands(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const rows = brands.map((b) => [
    b.namaBrand, b.namaPIC, b.whatsapp, b.kategori || (b.jasa && JASA_LABELS[b.jasa]) || '', b.paket || '',
    SOURCE_LABEL[b.source] ?? b.source, b.budget, b.status, b.createdAt.slice(0, 10),
  ]);

  return (
    <SheetGrid
      storageKey="admin:brands"
      headers={HEADERS}
      rows={rows}
      emptyText={loading ? 'Memuat...' : 'Belum ada brand.'}
      hint={(
        <button onClick={() => void fetchBrands()} aria-label="Muat ulang" title="Muat ulang"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', border: '1.5px solid #c7c8cf', background: 'white', cursor: 'pointer', color: '#777683' }}>
          <RefreshCw size={16} />
        </button>
      )}
      // Klik baris = buka detail brand (Ctrl/⌘ = tab baru)
      onRowClick={(i, e) => {
        const url = `/admin/brands/${brands[i]._id}`;
        if (e.metaKey || e.ctrlKey) window.open(url, '_blank'); else navigate(url);
      }}
      customCell={(_r, c, v) => {
        if (c === STATUS_COL) return <StatusBadge status={String(v)} />;
        if (c === SOURCE_COL) {
          const wa = v === SOURCE_LABEL.whatsapp;
          return <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, background: wa ? 'rgba(37,211,102,0.14)' : '#f1f0fb', color: wa ? '#128c4a' : '#464652' }}>{String(v)}</span>;
        }
        return undefined;
      }}
      footer={` · ${brands.length} brand`}
    />
  );
}
