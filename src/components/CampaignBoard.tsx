import { useEffect, useState, type ReactNode } from 'react';
import { CalendarDays, Check, ChevronDown, MessageCircle, RefreshCw, X } from 'lucide-react';
import Navbar from './layout/Navbar';
import SheetGrid, { type Cell, type CellKind } from './SheetGrid';
import ReviewStatusCell from './ReviewStatusCell';
import BriefEditor, { BriefView, type BriefBlock } from './BriefEditor';

const f = 'var(--font-display)';

export type BoardAudience = 'creator' | 'pic' | 'client';

export type { BriefBlock };

export interface BriefCampaignData {
  blocks: BriefBlock[];
  filledBy: 'admin' | 'client';
  updatedAt: string;
}

export interface BoardView {
  campaign: {
    name: string; brandName: string | null; briefContent: string; deliverables: string[]; waGroupLink: string;
    timeline?: { startDate?: string; endDate?: string };
    briefCampaign?: BriefCampaignData | null;
  };
  headers: string[];
  columns: { key: string; progressId?: string; kind?: CellKind; editable: boolean; review?: 'draft' | 'post' }[];
  rows: { id: string; mine: boolean; cells: Cell[]; notes?: { draft?: string; post?: string } }[];
}

/** Tab "Pendaftar" di dashboard client (stage 2): kolom identik tab Pendaftar admin. */
export interface ApplicantsView {
  headers: string[];
  rows: Cell[][];
  rowIds: string[];
  rowStatus: string[];
}

const AUDIENCE_LABEL: Record<BoardAudience, string> = { creator: 'Dashboard Creator', pic: 'Dashboard PIC', client: 'Dashboard Client' };
const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: '#fff4d6', color: '#8a5a00', label: 'Pending' },
  accepted: { bg: '#d7f5e3', color: '#146c2e', label: 'Approved' },
  rejected: { bg: '#ffdad6', color: '#93000a', label: 'Rejected' },
};

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

/** Pendaftar yang sudah lolos admin (stage 1) + keputusan client sendiri (stage 2). Client-only. */
function ApplicantsTab({ view, onDecide }: { view: ApplicantsView | null; onDecide: (appId: string, status: 'accepted' | 'rejected') => Promise<void> }) {
  const [deciding, setDeciding] = useState<string | null>(null);
  const [error, setError] = useState('');

  const decide = async (appId: string, status: 'accepted' | 'rejected') => {
    setDeciding(appId);
    setError('');
    try {
      await onDecide(appId, status);
    } catch {
      setError('Gagal menyimpan keputusan. Coba lagi.');
    } finally {
      setDeciding(null);
    }
  };

  if (!view) {
    return (
      <section style={{ background: '#fff', borderRadius: '20px', padding: '48px', boxShadow: '0 10px 30px rgba(30,10,94,0.18)', textAlign: 'center', color: '#777683', fontFamily: f }}>
        Memuat…
      </section>
    );
  }

  const rowAction = (row: number) => {
    const appId = view.rowIds[row];
    const status = view.rowStatus[row] ?? 'pending';
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
          <button type="button" disabled={busy} onClick={() => void decide(appId, 'accepted')} style={btn('#146c2e', 'white')}><Check size={12} /> Approve</button>
        )}
        {status !== 'rejected' && (
          <button type="button" disabled={busy} onClick={() => void decide(appId, 'rejected')} style={btn('#ffdad6', '#93000a')}><X size={12} /> Reject</button>
        )}
      </span>
    );
  };

  return (
    <section style={{ background: '#fff', borderRadius: '20px', padding: '18px', boxShadow: '0 10px 30px rgba(30,10,94,0.18)' }}>
      {error && (
        <div role="alert" style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '10px 14px', marginBottom: '10px', borderRadius: '10px', background: '#ffdad6', color: '#93000a', fontSize: '0.8rem' }}>
          {error}
          <button type="button" onClick={() => setError('')} aria-label="Tutup pesan" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#93000a', display: 'flex' }}><X size={14} /></button>
        </div>
      )}
      <SheetGrid headers={view.headers} rows={view.rows} emptyText="Belum ada pendaftar yang di-approve admin." actionHeader="Status" rowAction={rowAction} maxHeight="calc(100vh - 200px)" />
    </section>
  );
}

/** Section "Brief Campaign" baru (beda dari Broadcast Campaign di atas). Client bisa isi/edit,
 * creator/PIC view-only. Campur bebas: beberapa blok teks/link/file/gambar/video sekaligus,
 * bukan exclusive satu kind — tambah/hapus blok satu-satu. */
/** Brief Campaign: satu dokumen ala Notion. Client bisa edit (autosave), creator/PIC baca saja. */
function BriefCampaignSection({ brief, onSave, onUpload }: {
  brief: BriefCampaignData | null | undefined;
  onSave?: (blocks: BriefBlock[]) => Promise<void>;
  onUpload?: (file: File) => Promise<{ url: string; kind: BriefBlock['kind'] }>;
}) {
  const blocks = brief?.blocks ?? [];
  return (
    <div style={{ background: '#fff', borderRadius: '20px', marginBottom: '14px', padding: '18px 22px', boxShadow: '0 10px 30px rgba(30,10,94,0.18)' }}>
      <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.92rem', color: '#191c20', margin: '0 0 10px' }}>Brief Campaign</p>
      {onSave && onUpload ? (
        <BriefEditor initialBlocks={blocks} onSave={onSave} onUpload={onUpload} placeholder='Tulis brief campaign di sini… ketik "/" untuk sisipkan gambar, video, file, atau link' />
      ) : blocks.length ? (
        <BriefView blocks={blocks} />
      ) : (
        <p style={{ fontFamily: f, fontSize: '0.85rem', color: '#777683', margin: 0 }}>Belum diisi tim AzeraKOL.</p>
      )}
      {brief && blocks.length > 0 && (
        <p style={{ fontFamily: f, fontSize: '0.72rem', color: '#9a99a6', margin: '10px 0 0' }}>
          Terakhir diubah oleh {brief.filledBy === 'admin' ? 'Admin' : 'Client'} · {fmtDate(brief.updatedAt)}
        </p>
      )}
    </div>
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
  /** Client-only (stage 2): tab "Pendaftar" */
  applicants?: ApplicantsView | null;
  onLoadApplicants?: () => void;
  onDecideApplicant?: (appId: string, status: 'accepted' | 'rejected') => Promise<void>;
  /** Client-only: isi/edit Brief Campaign */
  onSaveBrief?: (blocks: BriefBlock[]) => Promise<void>;
  onUploadBrief?: (file: File) => Promise<{ url: string; kind: BriefBlock['kind'] }>;
}

export default function CampaignBoard({ audience, view, loading, onReload, onEdit, onUpload, onReview, applicants, onLoadApplicants, onDecideApplicant, onSaveBrief, onUploadBrief }: Props) {
  const [briefOpen, setBriefOpen] = useState(false);
  const [actionError, setActionError] = useState('');
  const [tab, setTab] = useState<'pendaftar' | 'tracker'>('pendaftar');
  const { campaign } = view;
  const showTabs = audience === 'client';

  useEffect(() => {
    if (showTabs && tab === 'pendaftar' && applicants === null) onLoadApplicants?.();
  }, [showTabs, tab, applicants, onLoadApplicants]);

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

      {showTabs && (
        <div role="tablist" style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
          {([['pendaftar', 'Pendaftar'], ['tracker', 'Campaign Tracker']] as const).map(([key, label]) => (
            <button key={key} role="tab" aria-selected={tab === key} onClick={() => setTab(key)}
              style={{
                padding: '10px 18px', borderRadius: '999px', border: 'none', cursor: 'pointer',
                background: tab === key ? 'var(--lime)' : 'rgba(255,255,255,0.12)',
                color: tab === key ? '#191c20' : 'white',
                fontFamily: f, fontWeight: 700, fontSize: '0.82rem',
              }}>
              {label}
            </button>
          ))}
        </div>
      )}

      {showTabs && tab === 'pendaftar' ? (
        <ApplicantsTab view={applicants ?? null} onDecide={onDecideApplicant!} />
      ) : (
        <>
          {(campaign.briefContent || campaign.deliverables?.length > 0) && (
            <div style={{ background: '#fff', borderRadius: '20px', marginBottom: '14px', boxShadow: '0 10px 30px rgba(30,10,94,0.18)' }}>
              <button type="button" onClick={() => setBriefOpen((o) => !o)} aria-expanded={briefOpen}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: f, fontWeight: 700, fontSize: '0.92rem', color: '#191c20' }}>
                Broadcast Campaign
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

          <BriefCampaignSection
            brief={campaign.briefCampaign}
            onSave={audience === 'client' ? onSaveBrief : undefined}
            onUpload={audience === 'client' ? onUploadBrief : undefined}
          />

          <section style={{ background: '#fff', borderRadius: '20px', padding: '18px', boxShadow: '0 10px 30px rgba(30,10,94,0.18)' }}>
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
        </>
      )}
    </Shell>
  );
}
