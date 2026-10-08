import { useState, type ReactNode } from 'react';
import { CalendarDays, ChevronDown, MessageCircle, RefreshCw, X } from 'lucide-react';
import Navbar from './layout/Navbar';
import SheetGrid, { type Cell, type CellKind } from './SheetGrid';
import ReviewStatusCell from './ReviewStatusCell';

const f = 'var(--font-display)';

export type BoardAudience = 'creator' | 'pic' | 'client';

export interface BoardView {
  campaign: {
    name: string; brandName: string | null; briefContent: string; deliverables: string[]; waGroupLink: string;
    timeline?: { startDate?: string; endDate?: string };
  };
  headers: string[];
  columns: { key: string; progressId?: string; kind?: CellKind; editable: boolean; review?: 'draft' | 'post' }[];
  rows: { id: string; mine: boolean; cells: Cell[]; notes?: { draft?: string; post?: string } }[];
}

const AUDIENCE_LABEL: Record<BoardAudience, string> = { creator: 'Dashboard Creator', pic: 'Dashboard PIC', client: 'Dashboard Client' };

const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '');

/** Kerangka halaman dashboard campaign (creator / PIC / client): Navbar home page + latar ungu hero. */
function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {/* -88px menutup spacer Navbar, sama seperti Hero home page, supaya ungu sampai ke atas */}
      <div style={{ background: 'var(--hero-bg)', minHeight: '100vh', marginTop: '-88px', padding: '132px 16px 56px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>{children}</div>
      </div>
    </>
  );
}

export function BoardMessage({ text }: { text: string }) {
  return (
    <Shell>
      <p style={{ fontFamily: f, color: 'white', textAlign: 'center', maxWidth: '440px', margin: '80px auto 0', fontSize: '1rem', lineHeight: 1.6 }}>{text}</p>
    </Shell>
  );
}

interface Props {
  audience: BoardAudience;
  view: BoardView;
  loading: boolean;
  onReload: () => void;
  onEdit?: (row: number, col: number, value: string) => Promise<void>;
  onUpload?: (row: number, col: number, files: File[]) => Promise<void>;
  onReview?: (row: number, type: 'draft' | 'post', status: 'approved' | 'revision_requested', notes?: string) => Promise<void>;
}

export default function CampaignBoard({ audience, view, loading, onReload, onEdit, onUpload, onReview }: Props) {
  const [briefOpen, setBriefOpen] = useState(false);
  const [actionError, setActionError] = useState('');
  const { campaign } = view;

  const review = async (row: number, type: 'draft' | 'post', status: 'approved' | 'revision_requested', notes?: string) => {
    setActionError('');
    try {
      await onReview!(row, type, status, notes);
    } catch (err) {
      setActionError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal menyimpan status. Coba lagi.');
      throw err;
    }
  };

  const hasEditable = view.columns.some((c) => c.editable);
  const hint = audience === 'creator' && hasEditable
    ? <>Baris kamu ada di paling atas (nomor ungu). Klik sel <span style={{ background: '#fffdf2', border: '1px solid #e2e3e3', padding: '0 6px' }}>kuning</span> untuk upload draft, isi link posting & insight.</>
    : audience === 'client'
      ? 'Cek draft & hasil posting tiap creator, lalu Approve atau minta Revisi (dengan catatan).'
      : 'Progress semua creator di campaign ini.';
  const period = [fmtDate(campaign.timeline?.startDate), fmtDate(campaign.timeline?.endDate)].filter(Boolean).join(' – ');
  const glassBtn: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '40px', borderRadius: '999px',
    border: '1.5px solid rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.12)', color: 'white',
    fontFamily: f, fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', cursor: 'pointer',
  };

  return (
    <Shell>
      <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <span style={{ background: 'var(--lime)', color: '#191c20', borderRadius: '999px', padding: '4px 12px', fontFamily: f, fontSize: '0.72rem', fontWeight: 800 }}>
              {AUDIENCE_LABEL[audience]}
            </span>
            {campaign.brandName && (
              <span style={{ background: 'rgba(255,255,255,0.14)', color: 'white', borderRadius: '999px', padding: '4px 12px', fontFamily: f, fontSize: '0.72rem', fontWeight: 700 }}>
                {campaign.brandName}
              </span>
            )}
          </div>
          <h1 style={{ fontFamily: f, fontWeight: 700, fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)', color: 'white', lineHeight: 1.05, letterSpacing: '-0.035em' }}>
            {campaign.name}
          </h1>
          {period && (
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', color: 'rgba(255,255,255,0.8)', fontFamily: f, fontSize: '0.85rem' }}>
              <CalendarDays size={15} /> {period}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {campaign.waGroupLink && (
            <a href={campaign.waGroupLink} target="_blank" rel="noopener noreferrer" style={{ ...glassBtn, padding: '0 16px', background: '#25d366', border: 'none' }}>
              <MessageCircle size={15} /> Grup WA
            </a>
          )}
          <button type="button" onClick={onReload} disabled={loading} aria-label="Muat ulang data" title="Muat ulang data"
            style={{ ...glassBtn, width: '40px', opacity: loading ? 0.5 : 1 }}>
            <RefreshCw size={16} />
          </button>
        </div>
      </header>

      {(campaign.briefContent || campaign.deliverables?.length > 0) && (
        <div style={{ background: 'white', borderRadius: '20px', marginBottom: '14px', boxShadow: '0 10px 30px rgba(30,10,94,0.18)' }}>
          <button type="button" onClick={() => setBriefOpen((o) => !o)} aria-expanded={briefOpen}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: f, fontWeight: 700, fontSize: '0.92rem', color: '#191c20' }}>
            Brief Campaign
            <ChevronDown size={18} style={{ transform: briefOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }} />
          </button>
          {briefOpen && (
            <div style={{ padding: '0 20px 18px', fontFamily: f, fontSize: '0.88rem', color: '#464652', lineHeight: 1.7 }}>
              {campaign.deliverables?.length > 0 && (
                <ul style={{ margin: '0 0 10px', paddingLeft: '18px' }}>{campaign.deliverables.map((d) => <li key={d}>{d}</li>)}</ul>
              )}
              {campaign.briefContent && <p style={{ whiteSpace: 'pre-wrap' }}>{campaign.briefContent}</p>}
            </div>
          )}
        </div>
      )}

      <section style={{ background: 'white', borderRadius: '20px', padding: '18px', boxShadow: '0 10px 30px rgba(30,10,94,0.18)' }}>
        {actionError && (
          <div role="alert" style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '10px 14px', marginBottom: '10px', borderRadius: '10px', background: '#ffdad6', color: '#93000a', fontSize: '0.8rem' }}>
            {actionError}
            <button type="button" onClick={() => setActionError('')} aria-label="Tutup pesan" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93000a', display: 'flex' }}><X size={14} /></button>
          </div>
        )}
        <SheetGrid
          headers={view.headers}
          rows={view.rows.map((r) => r.cells)}
          hint={hint}
          emptyText="Belum ada creator di campaign ini."
          canEdit={(row, col) => Boolean(view.rows[row]?.mine && view.columns[col]?.editable)}
          kindOf={(col) => view.columns[col]?.kind}
          onEdit={onEdit}
          onUpload={onUpload}
          highlightRow={audience === 'creator' ? (row) => Boolean(view.rows[row]?.mine) : undefined}
          customCell={(row, col, v) => {
            const type = view.columns[col]?.review;
            if (!type) return undefined;
            return <ReviewStatusCell type={type} status={String(v)} notes={view.rows[row]?.notes?.[type]}
              onReview={onReview ? (status, notes) => review(row, type, status, notes) : undefined} />;
          }}
          maxHeight="calc(100vh - 200px)"
        />
      </section>
    </Shell>
  );
}
