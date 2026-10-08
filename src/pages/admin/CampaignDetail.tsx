import { stageLabel } from '../../lib/stages';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, MessageCircle, LayoutDashboard, Building2, ExternalLink, UserCheck } from 'lucide-react';
import { SiInstagram, SiTiktok, SiThreads, SiX } from 'react-icons/si';
import type { IconType } from 'react-icons';
import api from '../../lib/api';
import CampaignAnalyticsFinance from './CampaignAnalyticsFinance';
import WorkflowTracker from './WorkflowTracker';
import { BroadcastSharePanel } from './BroadcastShareModal';
import Switch from '../../components/ui/Switch';
import CustomFormBuilder, { type CustomField, type ApplyFields } from './CustomFormBuilder';


interface Campaign {
  _id: string; name: string; objective: string; briefContent?: string; deliverables: string[];
  budget: number; criteria: { niches: string[]; minFollowers?: number; minFollowersByPlatform?: Record<string, number | undefined>; provinces: string[]; cities?: string[]; platforms: string[] };
  status: string; workflowStage: string; applyOpen: boolean; applySlug: string; waGroupLink?: string;
  customFields: CustomField[]; applyFields?: ApplyFields; accessCode: string; clientAccessCode?: string;
  type?: 'online' | 'offline'; eventDetails?: { location?: string; date?: string; timeWindow?: string };
  fee?: { creatorFee?: number; picFee?: number; mgFee?: number }; feeNote?: string; benefits?: string[]; requirements?: string[]; infoLink?: string;
  brandName?: string | null; timeline?: { startDate?: string; endDate?: string };
  masterSheetUrl?: string | null; reportSheetUrl?: string | null; recapPaymentSheetUrl?: string | null;
}
interface PicUser { _id: string; name: string; email: string; phone: string }

const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e1e0ff',
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
  border: '1.5px solid #c7c8cf', background: 'white', color: '#464652', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
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
              style={{ flex: '1 1 220px', minWidth: 0, height: '38px', padding: '0 12px', borderRadius: '10px', border: '1.5px solid #e1e0ff', background: '#f8f9ff', color: '#464652', fontSize: '0.78rem', boxSizing: 'border-box' }} />
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
  { key: 'finance', label: 'Finance' },
] as const;
type TabKey = (typeof TABS)[number]['key'];



export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [briefDraft, setBriefDraft] = useState('');
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
        {TABS.map((t) => (
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
          <CampaignInfo campaign={campaign} />

          <div style={cardStyle}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '16px' }}>Broadcast Campaign</p>
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
            <ShareLink title="Link Form Pendaftaran" url={`${window.location.origin}/apply/${campaign.applySlug}`}
              description={campaign.applyOpen ? undefined : 'Pendaftaran ditutup: link ini menampilkan info "pendaftaran sudah ditutup".'}
              copied={copiedKey === 'apply'} onCopy={(url) => void copyLink('apply', url)} compact />
          </div>
          <div style={{ flex: '0 0 190px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div title={campaign.applyOpen ? 'Tutup kalau kebutuhan creator sudah terpenuhi' : 'Creator tidak bisa daftar selama ditutup'}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '9px 16px', borderRadius: '10px', border: '1.5px solid #e1e0ff', background: 'white' }}>
              <Switch label={campaign.applyOpen ? 'Pendaftaran Dibuka' : 'Pendaftaran Ditutup'} checked={campaign.applyOpen} disabled={applyBusy} onChange={() => void toggleApplyOpen()} />
            </div>
            <Link to={`/admin/campaigns/${campaign._id}/sheet?tab=applicants`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', border: '1.5px solid #6728e4', background: 'white', color: '#6728e4', fontWeight: 700, fontSize: '0.82rem', fontFamily: "var(--font-display)", textDecoration: 'none' }}>
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

      {activeTab === 'finance' && <CampaignAnalyticsFinance campaignId={campaign._id} />}


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

/** Keterangan campaign lengkap (isi tahap 1 pembuatan campaign). Field kosong disembunyikan. */
function CampaignInfo({ campaign: c }: { campaign: Campaign }) {
  const ev = c.type === 'offline' ? c.eventDetails : undefined;
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
              <Block title="Detail Event">
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
