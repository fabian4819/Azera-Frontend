import { stageLabel } from '../../lib/stages';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshCw, Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { SHEET_TABS } from './sheetTabs';
import api from '../../lib/api';
import { useAuth, hasOwnerAccess } from '../../hooks/useAuth';

const f = 'var(--font-display)';

interface CampaignDashboardItem {
  _id: string;
  name: string;
  status: string;
  workflowStage: string;
  budget?: number;
  brandId?: { namaBrand?: string } | string;
  timeline?: { startDate?: string; endDate?: string };
  createdAt: string;
}

const fmtDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' });
/** Periode campaign kalau diisi, kalau belum: tanggal dibuat */
const campaignDate = (c: CampaignDashboardItem) => {
  const period = [c.timeline?.startDate, c.timeline?.endDate].filter(Boolean).map((d) => fmtDate(d!)).join(' – ');
  return period || `Dibuat ${fmtDate(c.createdAt)}`;
};

const sheetButtonStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px',
  padding: '10px 6px', borderRadius: '10px', border: '1.5px solid #e1e0ff',
  background: '#faf9ff', color: '#6728e4', textDecoration: 'none',
  fontFamily: f, fontSize: '0.74rem', fontWeight: 700, textAlign: 'center',
};

export default function CampaignDashboard() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<CampaignDashboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Mode pilih (owner saja): klik kartu = centang, lalu hapus banyak sekaligus dengan konfirmasi ketik HAPUS
  const isOwner = hasOwnerAccess(useAuth().admin?.role);
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const toggleSelect = (id: string) => setSelected((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const stopSelecting = () => { setSelecting(false); setSelected(new Set()); };
  const closeConfirm = () => { setConfirmOpen(false); setConfirmText(''); setDeleteError(''); };
  const deleteSelected = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      await api.post('/admin/campaigns/bulk-delete', { ids: [...selected], confirm: 'HAPUS' });
      closeConfirm();
      stopSelecting();
      await fetchCampaigns();
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setDeleteError(message || 'Gagal menghapus campaign.');
    } finally {
      setDeleting(false);
    }
  };

  const fetchCampaigns = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/campaigns/dashboard-links');
      setCampaigns(response.data);
    } catch {
      setError('Dashboard campaign gagal dimuat. Coba muat ulang.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => { void fetchCampaigns(); }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '22px' }}>
        <div>
          <h2 style={{ fontFamily: f, fontWeight: 800, fontSize: '1.35rem', color: '#191c20' }}>Semua Campaign</h2>
          <p style={{ marginTop: '4px', color: '#777683', fontSize: '0.82rem' }}>
            Pilih campaign, lalu buka Master Sheet, Report, atau Recap Payment langsung di sini.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => void fetchCampaigns()}
            aria-label="Muat ulang daftar campaign"
            style={{ width: '38px', height: '38px', borderRadius: '10px', border: '1.5px solid #c7c8cf', background: 'white', color: '#6728e4', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <RefreshCw size={16} />
          </button>
          {isOwner && campaigns.length > 0 && (
            <button type="button" onClick={() => (selecting ? stopSelecting() : setSelecting(true))}
              style={{ height: '38px', padding: '0 14px', borderRadius: '10px', border: '1.5px solid #c7c8cf', background: selecting ? '#f0eeff' : 'white', color: '#464652', cursor: 'pointer', fontFamily: f, fontSize: '0.82rem', fontWeight: 700 }}>
              {selecting ? 'Batal pilih' : 'Pilih'}
            </button>
          )}
          <button onClick={() => navigate('/admin/campaigns/new')} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.875rem' }}>
            <Plus size={16} />
            Campaign Baru
          </button>
        </div>
      </div>

      {selecting && (
        <div style={{ position: 'sticky', top: '12px', zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px', padding: '10px 14px', background: 'white', border: '1px solid #e1e0ff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(107,46,232,0.12)' }}>
          <span style={{ fontFamily: f, fontSize: '0.82rem', color: '#464652' }}>
            {selected.size ? `${selected.size} campaign dipilih` : 'Klik kartu campaign untuk memilih'}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={() => setSelected(selected.size === campaigns.length ? new Set() : new Set(campaigns.map((c) => c._id)))}
              style={{ padding: '8px 12px', borderRadius: '10px', border: '1.5px solid #e1e0ff', background: 'white', color: '#6728e4', cursor: 'pointer', fontFamily: f, fontSize: '0.78rem', fontWeight: 700 }}>
              {selected.size === campaigns.length ? 'Kosongkan' : 'Pilih semua'}
            </button>
            <button type="button" disabled={!selected.size} onClick={() => setConfirmOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: 'none', background: selected.size ? '#ba1a1a' : '#e8c8c4', color: 'white', cursor: selected.size ? 'pointer' : 'not-allowed', fontFamily: f, fontSize: '0.78rem', fontWeight: 700 }}>
              <Trash2 size={14} /> Hapus terpilih
            </button>
          </div>
        </div>
      )}

      {confirmOpen && (
        <div role="dialog" aria-modal="true" aria-label="Konfirmasi hapus campaign" onClick={() => !deleting && closeConfirm()}
          style={{ position: 'fixed', inset: 0, background: 'rgba(25,28,32,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '24px', maxWidth: '460px', width: '100%', fontFamily: f }}>
            <p style={{ fontWeight: 800, fontSize: '1.1rem', color: '#191c20', marginBottom: '8px' }}>Hapus {selected.size} campaign permanen?</p>
            <ul style={{ maxHeight: '160px', overflowY: 'auto', margin: '0 0 12px', paddingLeft: '18px', fontSize: '0.84rem', color: '#191c20', lineHeight: 1.6 }}>
              {campaigns.filter((c) => selected.has(c._id)).map((c) => <li key={c._id}>{c.name}</li>)}
            </ul>
            <p style={{ fontSize: '0.8rem', color: '#464652', lineHeight: 1.6, marginBottom: '14px' }}>
              Ikut terhapus: pendaftar, submission, invoice & catatan keuangan, dokumen, aset, log WhatsApp, dan riwayat campaign ini. Creator, brand, dan akun PIC tetap ada. <b>Tidak bisa dibatalkan.</b>
            </p>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#191c20', marginBottom: '6px' }}>Ketik <b>HAPUS</b> untuk konfirmasi</label>
            <input autoFocus value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="HAPUS"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #c7c8cf', fontSize: '0.88rem', fontFamily: f, outline: 'none', marginBottom: '12px' }} />
            {deleteError && <p role="alert" style={{ color: '#ba1a1a', fontSize: '0.8rem', marginBottom: '10px' }}>{deleteError}</p>}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={closeConfirm} disabled={deleting}
                style={{ padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #e1e0ff', background: 'white', color: '#464652', cursor: 'pointer', fontFamily: f, fontSize: '0.85rem', fontWeight: 600 }}>Batal</button>
              <button type="button" onClick={() => void deleteSelected()} disabled={confirmText !== 'HAPUS' || deleting}
                style={{ padding: '10px 16px', borderRadius: '10px', border: 'none', background: '#ba1a1a', color: 'white', cursor: confirmText === 'HAPUS' && !deleting ? 'pointer' : 'not-allowed', opacity: confirmText === 'HAPUS' && !deleting ? 1 : 0.5, fontFamily: f, fontSize: '0.85rem', fontWeight: 700 }}>
                {deleting ? 'Menghapus...' : 'Hapus permanen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '70px', color: '#777683' }}>Memuat campaign...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#ba1a1a', background: 'white', borderRadius: '16px', border: '1px solid #ffdad6' }}>{error}</div>
      ) : campaigns.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#777683', background: 'white', borderRadius: '16px', border: '1px solid #e1e0ff' }}>Belum ada campaign.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '14px' }}>
          {campaigns.map((campaign) => {
            const brandName = typeof campaign.brandId === 'object' ? campaign.brandId?.namaBrand : undefined;
            return (
              // Klik di mana saja pada card = buka detail campaign (judul tetap <Link> untuk keyboard/tab baru)
              <article key={campaign._id} onClick={() => (selecting ? toggleSelect(campaign._id) : navigate(`/admin/campaigns/${campaign._id}`))}
                aria-selected={selecting ? selected.has(campaign._id) : undefined}
                style={{ background: selected.has(campaign._id) ? '#fff5f4' : 'white', borderRadius: '16px', padding: '20px', border: selected.has(campaign._id) ? '1.5px solid #ba1a1a' : '1px solid #e1e0ff', boxShadow: '0 2px 12px rgba(107,46,232,0.05)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  {selecting && (selected.has(campaign._id) ? <CheckSquare size={20} color="#ba1a1a" style={{ flexShrink: 0 }} /> : <Square size={20} color="#b0afba" style={{ flexShrink: 0 }} />)}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <Link to={`/admin/campaigns/${campaign._id}`} onClick={(e) => { e.stopPropagation(); if (selecting) { e.preventDefault(); toggleSelect(campaign._id); } }} style={{ fontFamily: f, fontWeight: 750, fontSize: '0.98rem', color: '#191c20', textDecoration: 'none' }}>
                      {campaign.name}
                    </Link>
                    <p style={{ fontFamily: f, fontSize: '0.78rem', color: '#777683', marginTop: '4px' }}>
                      {brandName || 'Tanpa brand'}{campaign.budget != null ? ` · Rp${campaign.budget.toLocaleString('id-ID')}` : ''}
                    </p>
                    <p style={{ fontFamily: f, fontSize: '0.76rem', color: '#9a99a6', marginTop: '2px' }}>{campaignDate(campaign)}</p>
                  </div>
                  <span style={{ flexShrink: 0, background: '#e1e0ff', color: '#6728e4', borderRadius: '999px', padding: '5px 10px', fontSize: '0.68rem', fontWeight: 700 }}>
                    {stageLabel(campaign.workflowStage)}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '18px' }}>
                  {SHEET_TABS.map(({ kind, label, icon: Icon }) => (
                    <Link key={kind} to={`/admin/campaigns/${campaign._id}/sheet?tab=${kind}`} onClick={(e) => { e.stopPropagation(); if (selecting) { e.preventDefault(); toggleSelect(campaign._id); } }} style={sheetButtonStyle}>
                      <Icon size={17} /> {label}
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
