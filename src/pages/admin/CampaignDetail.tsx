import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, MessageCircle, Megaphone, LayoutDashboard, ExternalLink, UserCheck } from 'lucide-react';
import api from '../../lib/api';
import CampaignAnalyticsFinance from './CampaignAnalyticsFinance';
import WorkflowTracker from './WorkflowTracker';
import AssetLibrary from './AssetLibrary';
import { BroadcastSharePanel } from './BroadcastShareModal';
import Switch from '../../components/ui/Switch';
import CustomFormBuilder, { type CustomField, type ApplyFields } from './CustomFormBuilder';


interface Campaign {
  _id: string; name: string; objective: string; briefContent?: string; deliverables: string[];
  budget: number; criteria: { niches: string[]; minFollowers?: number; minFollowersByPlatform?: Record<string, number | undefined>; provinces: string[]; cities?: string[]; platforms: string[] };
  status: string; workflowStage: string; applyOpen: boolean; applySlug: string; waGroupLink?: string;
  customFields: CustomField[]; applyFields?: ApplyFields; accessCode: string;
  type?: 'online' | 'offline'; eventDetails?: { location?: string; date?: string; timeWindow?: string };
  fee?: { creatorFee?: number; picFee?: number; mgFee?: number }; feeNote?: string; benefits?: string[]; requirements?: string[]; infoLink?: string;
  masterSheetUrl?: string | null; reportSheetUrl?: string | null; recapPaymentSheetUrl?: string | null;
}
interface PicUser { _id: string; name: string; email: string; phone: string }

const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)', marginBottom: '20px',
};

const labelSmall: React.CSSProperties = {
  fontSize: '0.7rem', fontFamily: "var(--font-display)", fontWeight: 700, color: '#777683',
  marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em',
};

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'form-kustom', label: 'Form Pendaftaran' },
  { key: 'distribusi', label: 'Pendaftaran & Distribusi' },
  { key: 'finance', label: 'Finance' },
  { key: 'aset', label: 'Aset' },
] as const;
type TabKey = (typeof TABS)[number]['key'];



export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [briefDraft, setBriefDraft] = useState('');
  const [copied, setCopied] = useState(false);
  const [dashboardCopied, setDashboardCopied] = useState(false);
  const [waGroupLinkDraft, setWaGroupLinkDraft] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [picUsers, setPicUsers] = useState<PicUser[]>([]);
  // Semua akun PIC terdaftar, jadi daftar centang pilihan PIC di Form Kustom
  const [allPics, setAllPics] = useState<PicUser[]>([]);
  const [picEmailDraft, setPicEmailDraft] = useState('');
  const [addingPic, setAddingPic] = useState(false);
  const [picError, setPicError] = useState('');

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

  const copyApplyLink = () => {
    const url = `${window.location.origin}/apply/${campaign?.applySlug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyDashboardLink = () => {
    if (!campaign) return;
    const url = `${window.location.origin}/campaign-dashboard/${campaign._id}?code=${campaign.accessCode}`;
    navigator.clipboard.writeText(url);
    setDashboardCopied(true);
    setTimeout(() => setDashboardCopied(false), 2000);
  };

  const addPic = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingPic(true);
    setPicError('');
    try {
      const res = await api.post(`/admin/campaigns/${id}/pic`, { email: picEmailDraft });
      setPicUsers((prev) => [...prev, res.data]);
      setPicEmailDraft('');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setPicError(message || 'Gagal menambahkan PIC');
    } finally {
      setAddingPic(false);
    }
  };

  const removePic = async (picUserId: string) => {
    try {
      await api.delete(`/admin/campaigns/${id}/pic/${picUserId}`);
      setPicUsers((prev) => prev.filter((p) => p._id !== picUserId));
    } catch {
      setPicError('Gagal melepas PIC');
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

  const changeStatus = async (status: string) => {
    setActionError('');
    try {
      const res = await api.patch(`/admin/campaigns/${id}`, { status });
      setCampaign(res.data);
      setActionMessage(`Status campaign diubah ke ${status}.`);
      setTimeout(() => setActionMessage(''), 2500);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setActionError(message || 'Gagal mengubah status.');
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
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: '1.4rem', color: '#191c20' }}>{campaign.name}</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ background: '#e1e0ff', color: '#6728e4', borderRadius: '999px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700 }}>
            {campaign.workflowStage.replace(/_/g, ' ')}
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
          <div style={cardStyle}>
            <p style={labelSmall}>Tujuan</p>
            <p style={{ color: '#191c20', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.6 }}>{campaign.objective}</p>
            <p style={labelSmall}>Budget</p>
            <p style={{ color: '#191c20', fontSize: '0.9rem' }}>Rp{campaign.budget.toLocaleString('id-ID')}</p>
          </div>

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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="overview-grid">
            <div style={cardStyle}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '14px' }}>Status Campaign</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {campaign.status === 'draft' && (
                  <button onClick={() => changeStatus('active')} className="btn-primary" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>Mulai Campaign</button>
                )}
                {campaign.status === 'active' && (
                  <button onClick={() => changeStatus('completed')} className="btn-primary" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>Tandai Selesai</button>
                )}
                <span style={{ background: '#eceef3', color: '#464652', borderRadius: '999px', padding: '6px 12px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize' }}>{campaign.status}</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#8a8a99' }}>Mengubah status ke Active/Completed otomatis kirim notifikasi WA ke client.</p>
            </div>

            <div style={cardStyle}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '14px' }}>Kriteria</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div><p style={labelSmall}>Niche</p><p style={{ fontSize: '0.85rem', color: '#191c20' }}>{campaign.criteria.niches.join(', ') || '-'}</p></div>
                <div><p style={labelSmall}>Platform</p><p style={{ fontSize: '0.85rem', color: '#191c20' }}>{campaign.criteria.platforms.join(', ') || '-'}</p></div>
                <div><p style={labelSmall}>Min. Followers</p><p style={{ fontSize: '0.85rem', color: '#191c20' }}>{Object.entries(campaign.criteria.minFollowersByPlatform || {}).filter(([, n]) => n).map(([p, n]) => `${p} ${n!.toLocaleString('id-ID')}`).join(', ') || campaign.criteria.minFollowers?.toLocaleString('id-ID') || '-'}</p></div>
                <div><p style={labelSmall}>Provinsi</p><p style={{ fontSize: '0.85rem', color: '#191c20' }}>{campaign.criteria.provinces.join(', ') || '-'}</p></div>
                <div><p style={labelSmall}>Kota</p><p style={{ fontSize: '0.85rem', color: '#191c20' }}>{campaign.criteria.cities?.join(', ') || '-'}</p></div>
              </div>
            </div>
          </div>

          <WorkflowTracker campaignId={campaign._id} />
        </div>
      )}

      {activeTab === 'form-kustom' && (
        <>
        {/* Buka/tutup form + link ke tabel pendaftar (sheet Pendaftar di Dashboard Campaign) */}
        <div style={{ maxWidth: '760px', margin: '0 auto 12px', background: 'white', borderRadius: '12px', border: '1px solid #e1e0ff', borderLeft: `6px solid ${campaign.applyOpen ? '#1e7e34' : '#ba1a1a'}`, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0, flex: '1 1 260px' }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '0.95rem', color: '#191c20' }}>
              Pendaftaran {campaign.applyOpen ? 'Dibuka' : 'Ditutup'}
            </p>
            <p style={{ fontSize: '0.78rem', color: '#777683', marginTop: '2px' }}>
              {campaign.applyOpen
                ? 'Creator bisa daftar lewat link form. Tutup kalau kebutuhan creator sudah terpenuhi.'
                : 'Link form menampilkan info "pendaftaran sudah ditutup", creator tidak bisa daftar.'}
            </p>
          </div>
          <Switch label={campaign.applyOpen ? 'Buka' : 'Tutup'} checked={campaign.applyOpen} disabled={applyBusy} onChange={() => void toggleApplyOpen()} />
        </div>
        <div style={{ maxWidth: '760px', margin: '0 auto 12px', display: 'flex', justifyContent: 'flex-end' }}>
          <Link to={`/admin/campaigns/${campaign._id}/sheet?tab=applicants`} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', border: '1.5px solid #6728e4', background: 'white', color: '#6728e4', fontWeight: 700, fontSize: '0.82rem', fontFamily: "var(--font-display)", textDecoration: 'none' }}>
            <UserCheck size={15} /> Lihat Pendaftar
          </Link>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="overview-grid">
          <div style={cardStyle}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '16px' }}>Pendaftaran</p>
            <button
              onClick={toggleApplyOpen}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginBottom: '12px', background: campaign.applyOpen ? '#ba1a1a' : undefined }}
            >
              {campaign.applyOpen ? 'Tutup Pendaftaran' : 'Buka Pendaftaran'}
            </button>
            {campaign.applyOpen && (
              <button
                onClick={copyApplyLink}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '10px', border: '1.5px solid #c7c8cf', background: 'white', color: '#464652', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: "var(--font-display)" }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Tersalin!' : 'Salin Link Apply'}
              </button>
            )}
          </div>

          <div style={cardStyle}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '8px' }}>Dashboard PIC / Handle-by</p>
            <p style={{ fontSize: '0.78rem', color: '#777683', marginBottom: '14px', lineHeight: 1.5 }}>
              Link read-only berisi seluruh data campaign ini (pendaftar & progress), bagikan ke PIC/Handle-by, tidak perlu login.
            </p>
            <button
              onClick={copyDashboardLink}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '10px', border: '1.5px solid #c7c8cf', background: 'white', color: '#464652', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: "var(--font-display)" }}
            >
              {dashboardCopied ? <Check size={14} /> : <LayoutDashboard size={14} />}
              {dashboardCopied ? 'Tersalin!' : 'Salin Link Dashboard'}
            </button>
          </div>

          {(campaign.masterSheetUrl || campaign.reportSheetUrl || campaign.recapPaymentSheetUrl) && (
            <div style={cardStyle}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '8px' }}>Google Sheet</p>
              <p style={{ fontSize: '0.78rem', color: '#777683', marginBottom: '14px', lineHeight: 1.5 }}>
                Sheet operasional campaign ini, data pendaftar & submission (master) tersinkron otomatis dari platform, report & recap payment dikelola manual.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { url: campaign.masterSheetUrl, label: 'Buka Master Sheet' },
                  { url: campaign.reportSheetUrl, label: 'Buka Report Sheet' },
                  { url: campaign.recapPaymentSheetUrl, label: 'Buka Recap Payment' },
                ].filter((s) => s.url).map((s) => (
                  <a
                    key={s.label}
                    href={s.url!} target="_blank" rel="noopener noreferrer"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '10px', border: '1.5px solid #c7c8cf', background: 'white', color: '#464652', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: "var(--font-display)", textDecoration: 'none', boxSizing: 'border-box' }}
                  >
                    <ExternalLink size={14} />
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div style={cardStyle}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '8px' }}>Akun PIC / Handle-by</p>
            <p style={{ fontSize: '0.78rem', color: '#777683', marginBottom: '14px', lineHeight: 1.5 }}>
              Assign akun PIC yang sudah sign up (di /login) ke campaign ini pakai email. Campaign ini otomatis muncul di dashboard mereka.
            </p>
            <form onSubmit={addPic} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input
                value={picEmailDraft}
                onChange={(e) => setPicEmailDraft(e.target.value)}
                placeholder="email@pic.com"
                type="email"
                required
                style={{ flex: 1, padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #c7c8cf', fontSize: '0.8rem', fontFamily: "var(--font-display)", boxSizing: 'border-box' }}
              />
              <button type="submit" disabled={addingPic} className="btn-primary" style={{ padding: '9px 16px', fontSize: '0.78rem', opacity: addingPic ? 0.6 : 1 }}>
                {addingPic ? '...' : 'Tambah'}
              </button>
            </form>
            {picError && <p style={{ color: '#ba1a1a', fontSize: '0.76rem', marginBottom: '10px', fontFamily: "var(--font-display)" }}>{picError}</p>}
            {picUsers.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {picUsers.map((p) => (
                  <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9ff', borderRadius: '8px', padding: '8px 10px' }}>
                    <div>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '0.78rem', color: '#191c20' }}>{p.name}</p>
                      <p style={{ fontSize: '0.72rem', color: '#777683' }}>{p.email}</p>
                    </div>
                    <button onClick={() => removePic(p._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ba1a1a', fontSize: '0.72rem', fontWeight: 700, fontFamily: "var(--font-display)" }}>
                      Lepas
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={cardStyle}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '14px' }}>Link Grup WA</p>
            <input
              value={waGroupLinkDraft}
              onChange={(e) => setWaGroupLinkDraft(e.target.value)}
              placeholder="https://chat.whatsapp.com/..."
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #c7c8cf', fontSize: '0.8rem', fontFamily: "var(--font-display)", marginBottom: '10px', boxSizing: 'border-box' }}
            />
            <button onClick={saveWaGroupLink} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid #6728e4', background: 'white', color: '#6728e4', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', fontFamily: "var(--font-display)" }}>
              Simpan
            </button>
            <p style={{ fontSize: '0.72rem', color: '#8a8a99', marginTop: '8px' }}>Dikirim otomatis ke creator saat diterima.</p>
          </div>

          <div style={cardStyle}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1rem', color: '#191c20', marginBottom: '14px' }}>WhatsApp</p>
            <Link to={`/admin/campaigns/${id}/broadcast`} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #c7c8cf', color: '#464652', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', marginBottom: '8px', fontFamily: "var(--font-display)" }}>
              <Megaphone size={14} /> Broadcast Campaign Ini
            </Link>
            <Link to="/admin/wa-templates" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #c7c8cf', color: '#464652', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', fontFamily: "var(--font-display)" }}>
              <MessageCircle size={14} /> Edit Template Pesan
            </Link>
          </div>
        </div>
      )}

      {activeTab === 'finance' && <CampaignAnalyticsFinance campaignId={campaign._id} />}

      {activeTab === 'aset' && <AssetLibrary campaignId={campaign._id} />}

      <style>{`
        @media (max-width: 900px) {
          .overview-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
