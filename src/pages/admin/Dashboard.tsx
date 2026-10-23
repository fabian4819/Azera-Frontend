import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone, Users, Building2, ChevronRight, Wallet, AlertCircle, Trophy } from 'lucide-react';
import api from '../../lib/api';
import { useAuth, hasOwnerAccess } from '../../hooks/useAuth';
import { stageLabel } from '../../lib/stages';

const f = "var(--font-display)";
const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)',
};

interface DashboardStats {
  activeCampaigns: number;
  totalCampaigns: number;
  totalCreators: number;
  newBrandLeads: number;
  brandPipeline: { new: number; reviewed: number; contacted: number };
  dailyCampaigns: { date: string; count: number }[];
  recentActivity: { type: 'brand' | 'creator'; id: string; name: string; subtitle: string; status: string; createdAt: string }[];
  workflowFunnel: { stage: string; count: number }[];
  /** client, totalDistributedFees & monthlyDistributedFees hanya dikirim untuk owner */
  pendingPayments: { client?: { count: number; total: number }; creator: { count: number } };
  actionItems: { label: string; count: number; to: string }[];
  monthlyDistributedFees?: { month: string; total: number }[];
  topCreators: { id: string; name: string; avgEngagementRate: number | null; totalFollowers: number }[];
  totalDistributedFees?: number;
}

const rupiah = (n: number) => `Rp${n.toLocaleString('id-ID')}`;

function KpiCard({ icon: Icon, label, value, hint }: { icon: React.ComponentType<{ size?: number }>; label: string; value: number | string; hint: string }) {
  return (
    <div style={{ ...cardStyle, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div style={{ width: '36px', height: '36px', flexShrink: 0, borderRadius: '10px', background: 'rgba(103,40,228,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6728e4' }}>
          <Icon size={17} />
        </div>
        <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.85rem', color: '#464652' }}>{label}</p>
      </div>
      <p style={{ fontFamily: f, fontWeight: 800, fontSize: typeof value === 'string' ? '1.4rem' : '2rem', color: '#191c20', lineHeight: 1.1, overflowWrap: 'anywhere' }}>{value}</p>
      <p style={{ fontSize: '0.78rem', color: '#8a8a99', marginTop: '6px' }}>{hint}</p>
    </div>
  );
}

function LineChart({ data }: { data: { date: string; count: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const w = 640, h = 160, pad = 8;
  const max = Math.max(1, ...data.map((d) => d.count));
  const stepX = (w - pad * 2) / Math.max(1, data.length - 1);
  const points = data.map((d, i) => ({
    x: pad + i * stepX,
    y: h - pad - (d.count / max) * (h - pad * 2),
  }));
  const linePath = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPath = `${pad},${h - pad} ${linePath} ${w - pad},${h - pad}`;
  const gridLines = [0.25, 0.5, 0.75].map((frac) => h - pad - frac * (h - pad * 2));

  const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * w;
    const idx = Math.round((relX - pad) / stepX);
    setHover(Math.max(0, Math.min(data.length - 1, idx)));
  };

  const hp = hover !== null ? points[hover] : null;
  const hd = hover !== null ? data[hover] : null;

  return (
    <div style={{ position: 'relative' }}>
      <svg
        viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: `${h}px`, display: 'block', cursor: hd ? 'crosshair' : 'default' }}
        preserveAspectRatio="none" onMouseMove={handleMove} onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="dashLineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6728e4" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#6728e4" stopOpacity="0" />
          </linearGradient>
        </defs>
        {gridLines.map((y) => <line key={y} x1={pad} x2={w - pad} y1={y} y2={y} stroke="#eceef3" strokeWidth="1" />)}
        <polygon points={areaPath} fill="url(#dashLineFill)" />
        <polyline points={linePath} fill="none" stroke="#6728e4" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {hp && (
          <>
            <line x1={hp.x} x2={hp.x} y1={pad} y2={h - pad} stroke="#c9b6f7" strokeWidth="1" strokeDasharray="3,3" />
            <circle cx={hp.x} cy={hp.y} r="4.5" fill="#6728e4" stroke="#fff" strokeWidth="2" />
          </>
        )}
      </svg>
      {hp && hd && (
        <div style={{
          position: 'absolute', top: 0, left: `${(hp.x / w) * 100}%`,
          transform: `translateX(${hp.x < w / 2 ? '8px' : 'calc(-100% - 8px)'})`,
          background: '#191c20', color: '#fff', borderRadius: '8px', padding: '6px 10px', fontSize: '0.72rem', fontFamily: f,
          whiteSpace: 'nowrap', pointerEvents: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
        }}>
          <div style={{ fontWeight: 700 }}>{hd.count} campaign</div>
          <div style={{ opacity: 0.7 }}>{new Date(hd.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</div>
        </div>
      )}
    </div>
  );
}

function BarChart({ data, formatValue }: { data: { label: string; value: number }[]; formatValue?: (n: number) => string }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {data.map((d, i) => (
        <div key={d.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '70px', flexShrink: 0, fontSize: '0.78rem', color: '#464652', fontFamily: f }}>{d.label}</span>
          <div style={{ flex: 1, height: '18px', borderRadius: '6px', background: '#f2f3f9', overflow: 'hidden' }}>
            <div style={{
              width: `${(d.value / max) * 100}%`, height: '100%', borderRadius: '6px',
              background: hover === i ? '#5518c9' : '#6728e4', transition: 'width 0.3s ease, background 0.15s ease',
            }} />
          </div>
          <span style={{
            width: '90px', flexShrink: 0, textAlign: 'right', fontSize: '0.78rem', fontFamily: f,
            fontWeight: hover === i ? 800 : 700, color: hover === i ? '#6728e4' : '#191c20', transition: 'color 0.15s ease',
          }}>
            {formatValue ? formatValue(d.value) : d.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

export default function Dashboard() {
  const { admin } = useAuth();
  const isOwner = hasOwnerAccess(admin?.role);
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = () => { api.get('/admin/dashboard/stats').then((res) => setStats(res.data)).catch(() => {}); };
    fetchStats();
    const intervalId = window.setInterval(fetchStats, 60000);
    return () => window.clearInterval(intervalId);
  }, []);

  const pipeline = stats?.brandPipeline || { new: 0, reviewed: 0, contacted: 0 };
  const pipelineTotal = Math.max(1, pipeline.new + pipeline.reviewed + pipeline.contacted);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: f, fontWeight: 800, fontSize: '1.4rem', color: '#191c20' }}>
          Selamat datang, <span style={{ color: '#6728e4' }}>{admin?.name || 'Admin'}</span>
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#777683', marginTop: '4px' }}>
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* KPI satu baris selebar halaman; Aktivitas Terbaru mulai di bawahnya */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isOwner ? 5 : 4}, minmax(0, 1fr))`, gap: '16px', marginBottom: '20px' }} className="dashboard-kpi-grid dashboard-kpi-row">
        <KpiCard icon={Megaphone} label="Campaign Aktif" value={stats?.activeCampaigns ?? 0} hint="sedang berjalan" />
        <KpiCard icon={Users} label="Total Creator" value={stats?.totalCreators ?? 0} hint="terdaftar di sistem" />
        <KpiCard icon={Building2} label="Lead Brand Baru" value={stats?.newBrandLeads ?? 0} hint="belum ditindaklanjuti" />
        <KpiCard icon={Megaphone} label="Total Campaign" value={stats?.totalCampaigns ?? 0} hint="semua status" />
        {isOwner && <KpiCard icon={Wallet} label="Fee Terdistribusi" value={rupiah(stats?.totalDistributedFees ?? 0)} hint="creator + PIC + MG, semua campaign" />}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }} className="dashboard-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
          <div style={cardStyle}>
            <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem', color: '#191c20', marginBottom: '4px' }}>Campaign Baru</p>
            <p style={{ fontSize: '0.78rem', color: '#8a8a99', marginBottom: '16px' }}>30 hari terakhir</p>
            {stats ? <LineChart data={stats.dailyCampaigns} /> : (
              <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a8a99', fontSize: '0.82rem' }}>Memuat...</div>
            )}
          </div>

          <div style={cardStyle}>
            <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem', color: '#191c20', marginBottom: '4px' }}>Pipeline Brand Lead</p>
            <p style={{ fontSize: '0.78rem', color: '#8a8a99', marginBottom: '16px' }}>Total {pipeline.new + pipeline.reviewed + pipeline.contacted} lead</p>
            <div style={{ display: 'flex', height: '10px', borderRadius: '999px', overflow: 'hidden', marginBottom: '14px' }}>
              <div style={{ width: `${(pipeline.new / pipelineTotal) * 100}%`, background: '#c4ee87' }} />
              <div style={{ width: `${(pipeline.reviewed / pipelineTotal) * 100}%`, background: '#814bfe' }} />
              <div style={{ width: `${(pipeline.contacted / pipelineTotal) * 100}%`, background: '#15157d' }} />
            </div>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {[
                { label: 'New', value: pipeline.new, color: '#c4ee87' },
                { label: 'Reviewed', value: pipeline.reviewed, color: '#814bfe' },
                { label: 'Contacted', value: pipeline.contacted, color: '#15157d' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#464652' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                  {item.label} ({item.value})
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem', color: '#191c20', marginBottom: '16px' }}>Aktivitas Terbaru</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {(stats?.recentActivity || []).map((item) => (
              <button
                key={`${item.type}-${item.id}`}
                onClick={() => navigate(item.type === 'brand' ? `/admin/brands/${item.id}` : `/admin/creators/${item.id}`)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
                  padding: '10px 8px', borderRadius: '10px', border: 'none', background: 'transparent',
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '9px', flexShrink: 0,
                    background: item.type === 'brand' ? 'rgba(129,75,254,0.12)' : 'rgba(196,238,135,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: item.type === 'brand' ? '#6728e4' : '#3d6410',
                  }}>
                    {item.type === 'brand' ? <Building2 size={14} /> : <Users size={14} />}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontFamily: f, fontWeight: 600, fontSize: '0.85rem', color: '#191c20', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#8a8a99', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.subtitle} · {timeAgo(item.createdAt)}</p>
                  </div>
                </div>
                <ChevronRight size={15} color="#c7c8cf" style={{ flexShrink: 0 }} />
              </button>
            ))}
            {stats && stats.recentActivity.length === 0 && (
              <p style={{ textAlign: 'center', color: '#8a8a99', fontSize: '0.82rem', padding: '20px 0' }}>Belum ada aktivitas.</p>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isOwner ? '1fr 1fr' : '1fr', gap: '20px', marginTop: '20px' }} className="dashboard-grid">
        <div style={cardStyle}>
          <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem', color: '#191c20', marginBottom: '16px' }}>Campaign Funnel</p>
          <BarChart data={(stats?.workflowFunnel || []).map((w) => ({ label: stageLabel(w.stage), value: w.count }))} />
        </div>
        {isOwner && <div style={cardStyle}>
          <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem', color: '#191c20', marginBottom: '16px' }}>Fee Terdistribusi per Bulan</p>
          <BarChart
            data={(stats?.monthlyDistributedFees || []).map((m) => ({ label: new Date(`${m.month}-01`).toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }), value: m.total }))}
            formatValue={rupiah}
          />
        </div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }} className="dashboard-kpi-grid">
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <AlertCircle size={17} color="#ba1a1a" />
            <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem', color: '#191c20' }}>Perlu Ditindaklanjuti</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {(stats?.actionItems || []).map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.to)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
                  padding: '10px 8px', borderRadius: '10px', border: 'none', background: 'transparent',
                  cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: f,
                }}
              >
                <span style={{ fontSize: '0.85rem', color: '#191c20' }}>{item.label}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ba1a1a', background: '#ffdad6', borderRadius: '999px', padding: '2px 10px', flexShrink: 0 }}>{item.count}</span>
              </button>
            ))}
            {stats && stats.actionItems.length === 0 && (
              <p style={{ textAlign: 'center', color: '#8a8a99', fontSize: '0.82rem', padding: '20px 0' }}>Semua beres, tidak ada yang perlu ditindaklanjuti.</p>
            )}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Wallet size={17} color="#6728e4" />
            <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem', color: '#191c20' }}>Pembayaran Tertunda</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {isOwner && (
              <div>
                <p style={{ fontSize: '0.78rem', color: '#8a8a99' }}>Client (invoice belum lunas)</p>
                <p style={{ fontFamily: f, fontWeight: 800, fontSize: '1.3rem', color: '#191c20' }}>{rupiah(stats?.pendingPayments.client?.total ?? 0)}</p>
                <p style={{ fontSize: '0.75rem', color: '#8a8a99' }}>{stats?.pendingPayments.client?.count ?? 0} invoice</p>
              </div>
            )}
            <div>
              <p style={{ fontSize: '0.78rem', color: '#8a8a99' }}>Creator (info pembayaran belum dikonfirmasi)</p>
              <p style={{ fontFamily: f, fontWeight: 800, fontSize: '1.3rem', color: '#191c20' }}>{stats?.pendingPayments.creator.count ?? 0} PIC</p>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Trophy size={17} color="#c4a000" />
            <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem', color: '#191c20' }}>Top Creator</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(stats?.topCreators || []).map((c, i) => (
              <button
                key={c.id}
                onClick={() => navigate(`/admin/creators/${c.id}`)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, fontFamily: f, textAlign: 'left', width: '100%' }}
              >
                <span style={{ fontSize: '0.85rem', color: '#191c20' }}>{i + 1}. {c.name}</span>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#6728e4', textAlign: 'right' }}>
                  ER {c.avgEngagementRate?.toFixed(2)}% · {c.totalFollowers.toLocaleString('id-ID')} followers
                </span>
              </button>
            ))}
            {stats && stats.topCreators.length === 0 && (
              <p style={{ textAlign: 'center', color: '#8a8a99', fontSize: '0.82rem', padding: '20px 0' }}>Belum ada data engagement (belum ada creator yang di-scan ekstensi KOL Lister).</p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .dashboard-kpi-row { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        }
        @media (max-width: 900px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .dashboard-kpi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
