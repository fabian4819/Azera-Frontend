import { stageLabel } from '../../lib/stages';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, MessageCircle, LayoutDashboard, Building2, ExternalLink, UserCheck, MapPin, CalendarDays, Clock, Pencil, Sheet } from 'lucide-react';
import { NICHES } from '../../lib/niches';
import { buildBroadcast } from '../../lib/broadcast';
import { SiInstagram, SiTiktok, SiThreads, SiX } from 'react-icons/si';
import type { IconType } from 'react-icons';
import api from '../../lib/api';
import { shortApplyCode } from '../../lib/applyForm';
import { useAuth, hasOwnerAccess } from '../../hooks/useAuth';
import CampaignAnalyticsFinance from './CampaignAnalyticsFinance';
import BriefEditor, { type BriefBlock } from '../../components/BriefEditor';
import WorkflowTracker from './WorkflowTracker';
import { BroadcastSharePanel } from './BroadcastShareModal';
import Switch from '../../components/ui/Switch';
import CustomFormBuilder, { type CustomField, type ApplyFields } from './CustomFormBuilder';


interface Campaign {
  _id: string; name: string; objective: string; briefContent?: string; deliverables: string[];
  briefCampaign?: { blocks: { kind: 'text' | 'file' | 'image' | 'video' | 'link'; content: string }[]; filledBy: 'admin' | 'client'; updatedAt: string };
  budget?: number; criteria: { niches: string[]; minFollowers?: number; minFollowersByPlatform?: Record<string, number | undefined>; provinces: string[]; cities?: string[]; platforms: string[] };
  status: string; workflowStage: string; applyOpen: boolean; applySlug: string; waGroupLink?: string;
  customFields: CustomField[]; applyFields?: ApplyFields; accessCode: string; clientAccessCode?: string; clientSpreadsheetId?: string;
  type?: 'online' | 'offline'; eventDetails?: { location?: string; date?: string; timeWindow?: string };
  fee?: { creatorFee?: number; picFee?: number; mgFee?: number }; feeNote?: string; benefits?: string[]; requirements?: string[]; infoLink?: string;
  brandName?: string | null; timeline?: { startDate?: string; endDate?: string };
  masterSheetUrl?: string | null; reportSheetUrl?: string | null; recapPaymentSheetUrl?: string | null;
}
interface PicUser { _id: string; name: string; email: string; phone: string }

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)', marginBottom: '20px',
};

const iconBox: React.CSSProperties = {
  width: '40px', height: '40px', borderRadius: '12px', background: '#f0eeff', color: '#6728e4',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
};
const shareTitle: React.CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: '#191c20' };
const shareDesc: React.CSSProperties = { fontSize: '0.78rem', color: '#777683', lineHeight: 1.5, margin: '2px 0 12px' };
const shareBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '0 14px', height: '38px', borderRadius: '10px',
  border: '1.5px solid #c7c8cf', background: '#fff', color: '#464652', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
  fontFamily: 'var(--font-display)', textDecoration: 'none', whiteSpace: 'nowrap',
};

/** Kartu link yang dibagikan (form apply, dashboard client/PIC): URL terlihat + Salin + Buka. */
function ShareLink({ icon: Icon, title, description, url, copied, onCopy, compact }: {
  icon?: React.ComponentType<{ size?: number }>; title: string; description?: string; url: string;
  copied: boolean; onCopy: (url: string) => void; compact?: boolean;
}) {
  return (
    <div style={{ ...cardStyle, padding: compact ? '14px 16px' : '20px', marginBottom: 0, display: 'flex', alignItems: 'flex-start', gap: '14px', height: '100%', boxSizing: 'border-box' }}>
      {Icon && <span style={iconBox}><Icon size={18} /></span>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={shareTitle}>{title}</p>
        {description && <p style={shareDesc}>{description}</p>}
        {url ? (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: description ? 0 : '8px' }}>
            <input readOnly value={url} aria-label={`URL ${title}`} onFocus={(e) => e.currentTarget.select()}
              style={{ flex: '1 1 220px', minWidth: 0, height: '38px', padding: '0 12px', borderRadius: '10px', border: '1.5px solid #e1e0ff', background: '#fff', color: '#464652', fontSize: '0.78rem', boxSizing: 'border-box' }} />
            <button type="button" onClick={() => onCopy(url)} style={{ ...shareBtn, background: '#6728e4', color: 'white', border: 'none' }}>
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Tersalin' : 'Salin'}
            </button>
            <a href={url} target="_blank" rel="noopener noreferrer" style={shareBtn}><ExternalLink size={14} /> Buka</a>
          </div>
        ) : (
          <p style={{ fontSize: '0.78rem', color: '#9a99a6' }}>Muat ulang halaman untuk membuat link.</p>
        )}
      </div>
    </div>
  );
}


const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'form-kustom', label: 'Form Pendaftaran' },
  { key: 'distribusi', label: 'Distribusi' },
  { key: 'brief', label: 'Brief' },
  { key: 'report', label: 'Report' },
  { key: 'finance', label: 'Finance' },
] as const;
type TabKey = (typeof TABS)[number]['key'];



export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Tab Finance = data uang, khusus owner (API finance juga menolak role lain)
  const isOwner = hasOwnerAccess(useAuth().admin?.role);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [briefDraft, setBriefDraft] = useState('');
  const [broadcastStale, setBroadcastStale] = useState(false);
  // Brief Campaign ala Notion (BriefEditor): autosave seluruh isi, upload cuma balikin URL
  const saveBrief = useCallback(async (blocks: BriefBlock[]) => {
    const res = await api.put(`/admin/campaigns/${id}/brief`, { blocks });
    setCampaign((c) => (c ? { ...c, briefCampaign: res.data.briefCampaign } : c));
  }, [id, setCampaign]);
  const uploadBrief = useCallback(async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await api.post(`/admin/campaigns/${id}/brief/upload`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data as { url: string; kind: BriefBlock['kind'] };
  }, [id]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [waGroupLinkDraft, setWaGroupLinkDraft] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [picUsers, setPicUsers] = useState<PicUser[]>([]);
  // Semua akun PIC terdaftar, jadi daftar centang pilihan PIC di Form Kustom
  const [allPics, setAllPics] = useState<PicUser[]>([]);

  const load = async () => {
    try {
      const [cRes, pRes, allRes] = await Promise.all([
        api.get(`/admin/campaigns/${id}`),
        api.get(`/admin/campaigns/${id}/pic`),
        api.get('/admin/pic').catch(() => ({ data: [] })),
      ]);
      setAllPics(allRes.data);
      setCampaign(cRes.data);
      setBriefDraft(cRes.data.briefContent || '');
      setWaGroupLinkDraft(cRes.data.waGroupLink || '');
      setPicUsers(pRes.data);
    } catch {
      navigate('/admin/campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [applyBusy, setApplyBusy] = useState(false);
  const toggleApplyOpen = async () => {
    if (!campaign) return;
    setApplyBusy(true);
    setActionError('');
    try {
      const res = await api.patch(`/admin/campaigns/${id}`, { applyOpen: !campaign.applyOpen });
      setCampaign(res.data);
    } catch {
      setActionError(`Gagal ${campaign.applyOpen ? 'menutup' : 'membuka'} pendaftaran. Coba lagi.`);
    } finally {
      setApplyBusy(false);
    }
  };

  const copyLink = async (key: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      setActionError('Gagal menyalin link. Coba lagi.');
    }
  };

  // Centang/lepas PIC dari Form Kustom, langsung tersimpan (assign PicUser ke campaign ini)
  const togglePic = async (pic: PicUser, on: boolean) => {
    if (on) {
      const res = await api.post(`/admin/campaigns/${id}/pic`, { email: pic.email });
      setPicUsers((prev) => (prev.some((p) => p._id === pic._id) ? prev : [...prev, res.data]));
    } else {
      await api.delete(`/admin/campaigns/${id}/pic/${pic._id}`);
      setPicUsers((prev) => prev.filter((p) => p._id !== pic._id));
    }
  };

  const saveWaGroupLink = async () => {
    setActionError('');
    try {
      const res = await api.patch(`/admin/campaigns/${id}`, { waGroupLink: waGroupLinkDraft });
      setCampaign(res.data);
      setActionMessage('Link grup WA disimpan.');
      setTimeout(() => setActionMessage(''), 2500);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setActionError(message || 'Gagal menyimpan link grup.');
    }
  };


  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#777683' }}>Memuat...</div>;
  if (!campaign) return null;

  return (
    <div>
      <button
        onClick={() => navigate('/admin/campaigns')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#777683', fontSize: '0.875rem', marginBottom: '24px', padding: 0, fontFamily: "var(--font-display)" }}
      >
        <ArrowLeft size={16} />
        Kembali ke Campaigns
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ width: '40px', height: '3px', background: 'linear-gradient(135deg, #6728e4, #ff81aa)', borderRadius: '2px', marginBottom: '12px' }} />
          {campaign.brandName && (
            <p style={{ fontFamily: "var(--font-display)", fontSize: '0.78rem', fontWeight: 700, color: '#6728e4', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{campaign.brandName}</p>
          )}
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: '1.4rem', color: '#191c20' }}>{campaign.name}</h2>
          {(campaign.eventDetails?.location || campaign.eventDetails?.date || campaign.eventDetails?.timeWindow) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: '8px', fontFamily: "var(--font-display)", fontSize: '0.84rem', color: '#464652' }}>
              {campaign.eventDetails.date && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CalendarDays size={15} color="#6728e4" /> Visit {fmtDate(campaign.eventDetails.date)}</span>}
              {campaign.eventDetails.timeWindow && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={15} color="#6728e4" /> {campaign.eventDetails.timeWindow}</span>}
              {campaign.eventDetails.location && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={15} color="#6728e4" /> {campaign.eventDetails.location}</span>}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ background: '#e1e0ff', color: '#6728e4', borderRadius: '999px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700 }}>
            {stageLabel(campaign.workflowStage)}
          </span>
        </div>
      </div>

      {actionMessage && (
        <div style={{ background: '#d1fae5', color: '#065F46', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.82rem', fontFamily: "var(--font-display)" }}>
          {actionMessage}
        </div>
      )}
      {actionError && (
        <div style={{ background: '#ffdad6', color: '#ba1a1a', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.82rem', fontFamily: "var(--font-display)", display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <span>{actionError}</span>
          <button onClick={() => setActionError('')} style={{ background: 'none', border: 'none', color: '#ba1a1a', cursor: 'pointer', fontWeight: 700, flexShrink: 0 }}>✕</button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '4px', borderBottom: '1.5px solid #e1e0ff', marginBottom: '24px', overflowX: 'auto' }}>
        {TABS.filter((t) => t.key !== 'finance' || isOwner).map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '0.85rem',
              color: activeTab === t.key ? '#6728e4' : '#777683', whiteSpace: 'nowrap',
              borderBottom: activeTab === t.key ? '2.5px solid #6728e4' : '2.5px solid transparent',
              marginBottom: '-1.5px', transition: 'color 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div>
          <WorkflowTracker campaignId={campaign._id} stage={campaign.workflowStage} decide={campaign.workflowStage === 'listing' && !campaign.applyOpen} onChanged={(workflowStage) => setCampaign((c) => (c ? { ...c, workflowStage } : c))} />
          <CampaignInfo campaign={campaign} onSaved={({ broadcastStale, ...patch }) => {
            setCampaign((c) => (c ? { ...c, ...patch } : c));
            if (patch.briefContent !== undefined) setBriefDraft(patch.briefContent);
            setBroadcastStale(Boolean(broadcastStale));
          }} />

          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1rem', color: '#191c20' }}>Broadcast Campaign</p>
              {/* Ganti teks di editor dengan susunan terbaru dari info campaign (belum tersimpan sampai klik Simpan/Share) */}
              <button type="button" onClick={() => { setBriefDraft(buildBroadcast(campaign, applyUrlOf(campaign))); setBroadcastStale(false); }}
                style={{ padding: '7px 14px', borderRadius: '999px', border: '1.5px solid #c9b6f7', background: 'white', color: '#6728e4', fontFamily: "var(--font-display)", fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                Susun ulang dari info campaign
              </button>
            </div>
            {broadcastStale && (
              <p role="status" style={{ marginBottom: '12px', padding: '10px 14px', borderRadius: '10px', background: '#fff4e5', color: '#8a5300', fontSize: '0.8rem', lineHeight: 1.5, fontFamily: "var(--font-display)" }}>
                Info campaign baru diubah, tapi teks broadcast ini pernah diedit manual jadi tidak diganti otomatis. Klik "Susun ulang dari info campaign" kalau mau diperbarui.
              </p>
            )}
            <BroadcastSharePanel
              campaignId={campaign._id}
              text={briefDraft}
              onTextChange={setBriefDraft}
              onPersisted={(c) => setCampaign(c as Campaign)}
              showSave
            />
          </div>

        </div>
      )}

      {activeTab === 'form-kustom' && (
        <>
        {/* Link form + kolom kanan: toggle buka/tutup di atas tombol Lihat Pendaftar (lebar sama) */}
        <div style={{ maxWidth: '760px', margin: '0 auto 12px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'stretch' }}>
          <div style={{ flex: '1 1 380px', minWidth: 0 }}>
            <ShareLink title="Link Form Pendaftaran" url={`${window.location.origin}/apply/${shortApplyCode(campaign.applySlug)}`}
              description={campaign.applyOpen ? undefined : 'Pendaftaran ditutup: link ini menampilkan info "pendaftaran sudah ditutup".'}
              copied={copiedKey === 'apply'} onCopy={(url) => void copyLink('apply', url)} compact />
          </div>
          <div style={{ flex: '0 0 190px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div title={campaign.applyOpen ? 'Tutup kalau kebutuhan creator sudah terpenuhi' : 'Creator tidak bisa daftar selama ditutup'}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '9px 16px', borderRadius: '10px', border: '1.5px solid #e1e0ff', background: '#fff' }}>
              <Switch label={campaign.applyOpen ? 'Pendaftaran Dibuka' : 'Pendaftaran Ditutup'} checked={campaign.applyOpen} disabled={applyBusy} onChange={() => void toggleApplyOpen()} />
            </div>
            <Link to={`/admin/campaigns/${campaign._id}/sheet?tab=applicants`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', border: '1.5px solid #6728e4', background: '#fff', color: '#6728e4', fontWeight: 700, fontSize: '0.82rem', fontFamily: "var(--font-display)", textDecoration: 'none' }}>
              <UserCheck size={15} /> Lihat Pendaftar
            </Link>
          </div>
        </div>
        <CustomFormBuilder
          campaignId={campaign._id}
          initial={campaign.customFields || []}
          initialApplyFields={campaign.applyFields}
          platforms={campaign.criteria.platforms}
          minFollowers={campaign.criteria.minFollowersByPlatform}
          askDomicile={campaign.criteria.provinces.length + (campaign.criteria.cities?.length ?? 0) > 0}
          niches={campaign.criteria.niches}
          pics={allPics}
          assignedPicIds={picUsers.map((p) => p._id)}
          onTogglePic={togglePic}
          onSaved={(customFields, applyFields) => setCampaign((c) => (c ? { ...c, customFields, applyFields } : c))}
        />
        </>
      )}

      {activeTab === 'distribusi' && (
        <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ShareLink icon={Building2} title="Dashboard Client"
            description="Untuk brand/client: lihat progress creator, lalu Approve atau minta Revisi draft & hasil posting (dengan catatan). Tanpa login."
            url={campaign.clientAccessCode ? `${window.location.origin}/client-dashboard/${campaign._id}?code=${campaign.clientAccessCode}` : ''}
            copied={copiedKey === 'client'} onCopy={(url) => void copyLink('client', url)} />
          {/* Sheet external dibuat otomatis saat sync pertama campaign (folder campaign di Shared Drive) */}
          <ShareLink icon={Sheet} title="Google Sheet Client"
            description="Versi Google Sheet dari dashboard client (Listing & Campaign Tracker, tanpa WA/email/PIC/handle by). Siapa pun yang punya link bisa edit, tapi hanya kolom Status & review/catatan revisi yang tidak dikunci. Tersambung realtime dengan platform."
            url={campaign.clientSpreadsheetId ? `https://docs.google.com/spreadsheets/d/${campaign.clientSpreadsheetId}/edit` : ''}
            copied={copiedKey === 'client-sheet'} onCopy={(url) => void copyLink('client-sheet', url)} />
          <ShareLink icon={LayoutDashboard} title="Dashboard PIC / Handle-by"
            description="Untuk PIC/Handle-by: lihat progress semua creator di campaign ini (hanya lihat). Tanpa login."
            url={`${window.location.origin}/campaign-dashboard/${campaign._id}?code=${campaign.accessCode}`}
            copied={copiedKey === 'pic'} onCopy={(url) => void copyLink('pic', url)} />
          <p style={{ fontSize: '0.75rem', color: '#777683', padding: '0 4px' }}>
            Kolom yang terlihat di kedua dashboard sama dengan dashboard creator, atur lewat ikon di header kolom Master Sheet.
          </p>

          <div style={{ ...cardStyle, display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <span style={iconBox}><MessageCircle size={18} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={shareTitle}>Link Grup WA</p>
              <p style={shareDesc}>Dikirim otomatis ke creator saat diterima, dan tampil sebagai tombol di dashboard creator.</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <input
                  value={waGroupLinkDraft}
                  onChange={(e) => setWaGroupLinkDraft(e.target.value)}
                  placeholder="https://chat.whatsapp.com/..."
                  aria-label="Link grup WhatsApp"
                  style={{ flex: '1 1 240px', minWidth: 0, padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #c7c8cf', fontSize: '0.8rem', fontFamily: "var(--font-display)", boxSizing: 'border-box' }}
                />
                <button type="button" onClick={saveWaGroupLink} disabled={waGroupLinkDraft === (campaign.waGroupLink || '')}
                  style={{ ...shareBtn, background: '#6728e4', color: 'white', border: 'none', opacity: waGroupLinkDraft === (campaign.waGroupLink || '') ? 0.5 : 1 }}>
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'brief' && (
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={cardStyle}>
            <p style={shareTitle}>Brief Campaign</p>
            <p style={shareDesc}>
              Tampil di dashboard creator, PIC & client. Ketik "/" untuk sisipkan gambar, video, file, atau link.
            </p>

            <div style={{ marginTop: '16px', padding: '18px 20px', borderRadius: '14px', border: '1px solid #ecebf5', background: '#fff' }}>
              <BriefEditor key={campaign._id} initialBlocks={campaign.briefCampaign?.blocks ?? []} onSave={saveBrief} onUpload={uploadBrief} />
            </div>
            {campaign.briefCampaign && (
              <p style={{ fontSize: '0.72rem', color: '#9a99a6', marginTop: '10px' }}>
                Terakhir diubah oleh {campaign.briefCampaign.filledBy === 'admin' ? 'Admin' : 'Client'} · {new Date(campaign.briefCampaign.updatedAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        </div>
      )}

      {(activeTab === 'report' || (activeTab === 'finance' && isOwner)) && (
        <CampaignAnalyticsFinance
          key={activeTab}
          campaignId={campaign._id}
          view={activeTab}
          stage={campaign.workflowStage}
          onStageChanged={(workflowStage) => setCampaign((c) => (c ? { ...c, workflowStage } : c))}
        />
      )}


      <style>{`
        @media (max-width: 900px) {
          .overview-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const PLATFORM_META: Record<string, { name: string; icon: IconType; color: string }> = {
  instagram: { name: 'Instagram', icon: SiInstagram, color: '#E1306C' },
  tiktok: { name: 'TikTok', icon: SiTiktok, color: '#000000' },
  threads: { name: 'Threads', icon: SiThreads, color: '#000000' },
  x: { name: 'X', icon: SiX, color: '#000000' },
};
/** Link apply pendek yang dipakai di teks broadcast */
const applyUrlOf = (c: { applySlug: string }) => `${window.location.origin}/apply/${shortApplyCode(c.applySlug)}`;
const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' }) : '');
const rp = (n?: number) => (n ? `Rp${n.toLocaleString('id-ID')}` : '');
const font = "var(--font-display)";

const Chip = ({ children, tone = 'violet' }: { children: React.ReactNode; tone?: 'violet' | 'lime' | 'gray' }) => {
  const t = { violet: ['#f0eeff', '#6728e4'], lime: ['#eefad8', '#3d6b00'], gray: ['#f3f3f6', '#464652'] }[tone];
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '999px', background: t[0], color: t[1], fontSize: '0.78rem', fontWeight: 600, fontFamily: font }}>{children}</span>;
};
const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: '18px' }}>
    <p style={{ fontFamily: font, fontWeight: 700, fontSize: '0.82rem', color: '#191c20', marginBottom: '8px' }}>{title}</p>
    {children}
  </div>
);
const Checklist = ({ items }: { items: string[] }) => (
  <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
    {items.map((x) => <li key={x} style={{ fontSize: '0.85rem', color: '#2d2d3a', lineHeight: 1.5 }}>{x}</li>)}
  </ul>
);

/** Keterangan campaign lengkap (isi tahap 1 pembuatan campaign). Field kosong disembunyikan. Bisa diedit. */
/** broadcastStale = info berubah tapi teks broadcast (sudah diedit manual) sengaja tidak ditimpa */
type InfoPatch = Partial<Campaign> & { broadcastStale?: boolean };
function CampaignInfo({ campaign: c, onSaved }: { campaign: Campaign; onSaved: (patch: InfoPatch) => void }) {
  const [editing, setEditing] = useState(false);
  if (editing) return <CampaignInfoEdit campaign={c} onCancel={() => setEditing(false)} onSaved={(patch) => { onSaved(patch); setEditing(false); }} />;
  const ev = c.eventDetails;
  const stats = [
    { label: 'Budget', value: rp(c.budget), bg: 'linear-gradient(135deg, #6728e4, #8b66eb)', fg: 'white' },
    { label: 'Fee Talent', value: rp(c.fee?.creatorFee), sub: c.feeNote, bg: '#eefad8', fg: '#2c4d00' },
    { label: 'Fee PIC', value: rp(c.fee?.picFee), bg: '#f0eeff', fg: '#4a2a9e' },
    { label: 'Fee MG', value: rp(c.fee?.mgFee), bg: '#f0eeff', fg: '#4a2a9e' },
  ].filter((x) => x.value);
  const followersOf = (p: string) => c.criteria.minFollowersByPlatform?.[p];
  const lists = [
    { title: 'Benefit', items: c.benefits },
    { title: 'Syarat', items: c.requirements },
    { title: 'SOW', items: c.deliverables },
  ].filter((l) => l.items?.length);
  const locations = [...c.criteria.provinces, ...(c.criteria.cities || [])];

  return (
    <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
          <button type="button" onClick={() => setEditing(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '999px', border: '1.5px solid #c9b6f7', background: 'white', color: '#6728e4', fontFamily: font, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
            <Pencil size={14} /> Edit info campaign
          </button>
        </div>
        {/* Angka */}
        {stats.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '22px' }}>
            {stats.map((x) => (
              <div key={x.label} style={{ background: x.bg, color: x.fg, borderRadius: '14px', padding: '14px 16px' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: font }}>{x.label}</p>
                <p style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: font, marginTop: '4px' }}>{x.value}</p>
                {x.sub && <p style={{ fontSize: '0.74rem', opacity: 0.8, marginTop: '2px' }}>{x.sub}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Tujuan */}
        <div style={{ background: '#f8f7ff', borderLeft: '4px solid #6728e4', borderRadius: '10px', padding: '14px 16px', marginBottom: '22px' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6728e4', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: font, marginBottom: '4px' }}>Tujuan</p>
          <p style={{ fontSize: '0.9rem', color: '#191c20', lineHeight: 1.6 }}>{c.objective}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px 32px' }}>
          <div style={{ minWidth: 0 }}>
            {lists.map((l) => <Block key={l.title} title={l.title}><Checklist items={l.items!} /></Block>)}
            {ev && (ev.location || ev.date || ev.timeWindow) && (
              <Block title="Visit">
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {ev.location && <Chip tone="gray">{ev.location}</Chip>}
                  {ev.date && <Chip tone="gray">{fmtDate(ev.date)}</Chip>}
                  {ev.timeWindow && <Chip tone="gray">{ev.timeWindow}</Chip>}
                </div>
              </Block>
            )}
            {c.infoLink && (
              <Block title="Link Info">
                <a href={c.infoLink} target="_blank" rel="noopener noreferrer" style={{ color: '#6728e4', fontSize: '0.85rem', wordBreak: 'break-all' }}>{c.infoLink}</a>
              </Block>
            )}
          </div>

          <div style={{ minWidth: 0 }}>
            {c.criteria.platforms.length > 0 && (
              <Block title="Platform & Min. Followers">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {c.criteria.platforms.map((p) => {
                    const m = PLATFORM_META[p];
                    const Icon = m?.icon;
                    return (
                      <div key={p} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '10px 14px', border: '1px solid #eeecfb', borderRadius: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '0.85rem', fontFamily: font, color: '#191c20' }}>
                          {Icon && <Icon size={16} color={m.color} />} {m?.name ?? p}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: followersOf(p) ? '#6728e4' : '#8a8a99', fontWeight: 700 }}>
                          {followersOf(p) ? `min. ${followersOf(p)!.toLocaleString('id-ID')} followers` : 'tanpa minimum'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Block>
            )}
            {c.criteria.niches.length > 0 && (
              <Block title="Niche">
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>{c.criteria.niches.map((n) => <Chip key={n}>{n}</Chip>)}</div>
              </Block>
            )}
            {locations.length > 0 && (
              <Block title="Domisili Creator">
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>{locations.map((l) => <Chip key={l} tone="lime">{l}</Chip>)}</div>
              </Block>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const editInput: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #c7c8cf', fontSize: '0.85rem', fontFamily: 'var(--font-display)', color: '#191c20', background: 'white', outline: 'none' };
const editLabel: React.CSSProperties = { display: 'block', fontWeight: 700, fontSize: '0.78rem', color: '#191c20', marginBottom: '5px', fontFamily: 'var(--font-display)' };
const EDIT_PLATFORMS = ['instagram', 'tiktok', 'threads', 'x'];
const lines = (v: string) => v.split('\n').map((x) => x.trim()).filter(Boolean);
const numOrUndef = (v: string) => (v.trim() === '' ? undefined : Number(v));

/** Mode edit info campaign (isi tahap 1): tujuan, fee, benefit/syarat/SOW, visit, link, platform & niche.
 * Domisili creator & budget tidak diedit di sini. */
function CampaignInfoEdit({ campaign: c, onCancel, onSaved }: { campaign: Campaign; onCancel: () => void; onSaved: (patch: InfoPatch) => void }) {
  const [objective, setObjective] = useState(c.objective || '');
  const [benefits, setBenefits] = useState((c.benefits || []).join('\n'));
  const [requirements, setRequirements] = useState((c.requirements || []).join('\n'));
  const [deliverables, setDeliverables] = useState((c.deliverables || []).join('\n'));
  const [creatorFee, setCreatorFee] = useState(c.fee?.creatorFee?.toString() ?? '');
  const [picFee, setPicFee] = useState(c.fee?.picFee?.toString() ?? '');
  const [mgFee, setMgFee] = useState(c.fee?.mgFee?.toString() ?? '');
  const [feeNote, setFeeNote] = useState(c.feeNote || '');
  const [infoLink, setInfoLink] = useState(c.infoLink || '');
  const [visitLocation, setVisitLocation] = useState(c.eventDetails?.location || '');
  const [visitDate, setVisitDate] = useState(c.eventDetails?.date ? c.eventDetails.date.slice(0, 10) : '');
  const [visitTime, setVisitTime] = useState(c.eventDetails?.timeWindow || '');
  const [platforms, setPlatforms] = useState<string[]>(c.criteria.platforms || []);
  const [minFollowers, setMinFollowers] = useState<Record<string, string>>(
    Object.fromEntries(Object.entries(c.criteria.minFollowersByPlatform || {}).map(([k, v]) => [k, v != null ? String(v) : ''])),
  );
  const [niches, setNiches] = useState<string[]>(c.criteria.niches || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const nicheOptions = [...NICHES, ...niches.filter((n) => !NICHES.includes(n))];

  const save = async () => {
    if (!objective.trim()) { setError('Tujuan wajib diisi.'); return; }
    setSaving(true);
    setError('');
    try {
      const payload = {
        objective: objective.trim(),
        benefits: lines(benefits), requirements: lines(requirements), deliverables: lines(deliverables),
        fee: { creatorFee: numOrUndef(creatorFee), picFee: numOrUndef(picFee), mgFee: numOrUndef(mgFee) },
        feeNote: feeNote.trim(), infoLink: infoLink.trim(),
        eventDetails: { location: visitLocation.trim(), date: visitDate || null, timeWindow: visitTime.trim() },
        criteria: {
          ...c.criteria, platforms, niches,
          minFollowersByPlatform: Object.fromEntries(platforms.map((p) => [p, numOrUndef(minFollowers[p] || '')])),
        },
      };
      // Broadcast ikut diperbarui KALAU teksnya masih persis hasil susunan otomatis dari info lama (belum
      // diedit manual / bukan hasil AI); kalau sudah diedit, dibiarkan (ada tombol "Susun ulang" di kartu broadcast).
      const oldAuto = [applyUrlOf(c), `${window.location.origin}/apply/${c.applySlug}`].map((u) => buildBroadcast(c, u).trim());
      const untouched = !c.briefContent?.trim() || oldAuto.includes(c.briefContent.trim());
      const briefContent = untouched ? buildBroadcast({ ...c, ...payload, eventDetails: { ...payload.eventDetails, date: payload.eventDetails.date ?? undefined } }, applyUrlOf(c)) : undefined;
      const res = await api.patch(`/admin/campaigns/${c._id}`, { ...payload, ...(briefContent !== undefined ? { briefContent } : {}) });
      onSaved({
        ...(briefContent !== undefined ? { briefContent: res.data.briefContent } : { broadcastStale: true }),
        objective: res.data.objective, benefits: res.data.benefits, requirements: res.data.requirements, deliverables: res.data.deliverables,
        fee: res.data.fee, feeNote: res.data.feeNote, infoLink: res.data.infoLink, eventDetails: res.data.eventDetails, criteria: res.data.criteria,
      });
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || 'Gagal menyimpan info campaign.');
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, node: React.ReactNode) => <div style={{ marginBottom: '14px' }}><label style={editLabel}>{label}</label>{node}</div>;
  const area = (value: string, set: (v: string) => void, placeholder: string) => (
    <textarea value={value} onChange={(e) => set(e.target.value)} rows={3} placeholder={placeholder} style={{ ...editInput, resize: 'vertical' }} />
  );

  return (
    <div style={{ ...cardStyle, padding: '24px 28px' }}>
      <p style={{ fontFamily: font, fontWeight: 800, fontSize: '1rem', color: '#191c20', marginBottom: '16px' }}>Edit info campaign</p>
      {field('Tujuan *', area(objective, setObjective, 'Tujuan campaign'))}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0 12px' }}>
        {field('Fee Talent (Rp)', <input type="number" min={0} value={creatorFee} onChange={(e) => setCreatorFee(e.target.value)} style={editInput} />)}
        {field('Fee PIC (Rp)', <input type="number" min={0} value={picFee} onChange={(e) => setPicFee(e.target.value)} style={editInput} />)}
        {field('Fee MG (Rp)', <input type="number" min={0} value={mgFee} onChange={(e) => setMgFee(e.target.value)} style={editInput} />)}
      </div>
      {field('Catatan Fee', <input value={feeNote} onChange={(e) => setFeeNote(e.target.value)} placeholder="mis. include beli produk 5k" style={editInput} />)}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0 12px' }}>
        {field('Benefit (1 baris = 1 poin)', area(benefits, setBenefits, 'Free produk'))}
        {field('Syarat (1 baris = 1 poin)', area(requirements, setRequirements, 'Niche: Lifestyle'))}
        {field('SOW (1 baris = 1 poin)', area(deliverables, setDeliverables, '1x TikTok Video'))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0 12px' }}>
        {field('Lokasi Visit', <input value={visitLocation} onChange={(e) => setVisitLocation(e.target.value)} placeholder="Opsional" style={editInput} />)}
        {field('Tanggal Visit', <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} style={editInput} />)}
        {field('Jam Visit', <input value={visitTime} onChange={(e) => setVisitTime(e.target.value)} placeholder="09.00–12.00 WIB" style={editInput} />)}
      </div>
      {field('Link Info', <input value={infoLink} onChange={(e) => setInfoLink(e.target.value)} placeholder="https://..." style={editInput} />)}
      {field('Platform & Min. Followers', (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {EDIT_PLATFORMS.map((p) => {
            const on = platforms.includes(p);
            const m = PLATFORM_META[p];
            return (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '130px', fontFamily: font, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input type="checkbox" checked={on} onChange={(e) => setPlatforms((prev) => (e.target.checked ? [...prev, p] : prev.filter((x) => x !== p)))} style={{ accentColor: '#6728e4', width: '16px', height: '16px' }} />
                  {m?.name ?? p}
                </label>
                {on && <input type="number" min={0} value={minFollowers[p] ?? ''} onChange={(e) => setMinFollowers((prev) => ({ ...prev, [p]: e.target.value }))} placeholder="Min. followers (kosong = tanpa minimum)" style={{ ...editInput, flex: 1, minWidth: '200px' }} />}
              </div>
            );
          })}
        </div>
      ))}
      {field('Niche', (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {nicheOptions.map((n) => {
            const on = niches.includes(n);
            return (
              <button key={n} type="button" onClick={() => setNiches((prev) => (on ? prev.filter((x) => x !== n) : [...prev, n]))}
                style={{ padding: '6px 12px', borderRadius: '999px', border: 'none', cursor: 'pointer', fontFamily: font, fontSize: '0.78rem', fontWeight: 600, background: on ? '#6728e4' : '#e1e0ff', color: on ? 'white' : '#6728e4' }}>
                {n}
              </button>
            );
          })}
        </div>
      ))}
      <p style={{ fontSize: '0.74rem', color: '#777683', marginBottom: '14px', fontFamily: font }}>Domisili creator & budget tidak diubah di sini.</p>
      {error && <p role="alert" style={{ color: '#ba1a1a', fontSize: '0.82rem', marginBottom: '10px' }}>{error}</p>}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button type="button" onClick={onCancel} disabled={saving} style={{ padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #e1e0ff', background: 'white', color: '#464652', cursor: 'pointer', fontFamily: font, fontSize: '0.85rem', fontWeight: 600 }}>Batal</button>
        <button type="button" onClick={() => void save()} disabled={saving} className="btn-primary" style={{ padding: '10px 18px', fontSize: '0.85rem', opacity: saving ? 0.6 : 1 }}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
      </div>
    </div>
  );
}
