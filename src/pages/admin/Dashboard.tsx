import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone, Users, Building2, ChevronRight } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';

const f = "var(--font-display)";
const cardStyle: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)',
};

interface DashboardStats {
  activeCampaigns: number;
  totalCreators: number;
  newBrandLeads: number;
  brandPipeline: { new: number; reviewed: number; contacted: number };
  dailyRegistrations: { date: string; count: number }[];
  recentActivity: { type: 'brand' | 'creator'; id: string; name: string; subtitle: string; status: string; createdAt: string }[];
}

function KpiCard({ icon: Icon, label, value, hint }: { icon: React.ComponentType<{ size?: number }>; label: string; value: number; hint: string }) {
  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(103,40,228,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6728e4' }}>
          <Icon size={17} />
        </div>
        <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.85rem', color: '#464652' }}>{label}</p>
      </div>
      <p style={{ fontFamily: f, fontWeight: 800, fontSize: '2rem', color: '#191c20', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: '0.78rem', color: '#8a8a99', marginTop: '6px' }}>{hint}</p>
    </div>
  );
}

function LineChart({ data }: { data: { date: string; count: number }[] }) {
  const w = 640, h = 160, pad = 8;
  const max = Math.max(1, ...data.map((d) => d.count));
  const stepX = (w - pad * 2) / Math.max(1, data.length - 1);
  const points = data.map((d, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (d.count / max) * (h - pad * 2);
    return `${x},${y}`;
  });
  const linePath = points.join(' ');
  const areaPath = `${pad},${h - pad} ${linePath} ${w - pad},${h - pad}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: `${h}px`, display: 'block' }} preserveAspectRatio="none">
      <polygon points={areaPath} fill="rgba(103,40,228,0.08)" />
      <polyline points={linePath} fill="none" stroke="#6728e4" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
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
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      api.get('/admin/dashboard/stats').then((res) => setStats(res.data)).catch(() => {});
    }, 0);
    return () => window.clearTimeout(timeoutId);
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }} className="dashboard-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }} className="dashboard-kpi-grid">
            <KpiCard icon={Megaphone} label="Campaign Aktif" value={stats?.activeCampaigns ?? 0} hint="sedang berjalan" />
            <KpiCard icon={Users} label="Total Creator" value={stats?.totalCreators ?? 0} hint="terdaftar di sistem" />
            <KpiCard icon={Building2} label="Lead Brand Baru" value={stats?.newBrandLeads ?? 0} hint="belum ditindaklanjuti" />
          </div>

          <div style={cardStyle}>
            <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.95rem', color: '#191c20', marginBottom: '4px' }}>Pendaftaran Creator</p>
            <p style={{ fontSize: '0.78rem', color: '#8a8a99', marginBottom: '16px' }}>30 hari terakhir</p>
            {stats ? <LineChart data={stats.dailyRegistrations} /> : (
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

      <style>{`
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
