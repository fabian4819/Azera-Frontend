import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Building2, Users, ImageIcon, Megaphone, Upload, MessageCircle, MessageSquareText, Bot, LogOut, Menu, X, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { label: 'Campaigns', to: '/admin/campaigns', icon: Megaphone },
  { label: 'Import Data', to: '/admin/import', icon: Upload },
  { label: 'WhatsApp', to: '/admin/whatsapp', icon: MessageCircle },
  { label: 'Template Pesan', to: '/admin/wa-templates', icon: MessageSquareText },
  { label: 'Template Bot Lead', to: '/admin/lead-bot-templates', icon: Bot },
  { label: 'Brands', to: '/admin/brands', icon: Building2 },
  { label: 'Creators', to: '/admin/creators', icon: Users },
  { label: 'Portfolio', to: '/admin/portfolio', icon: ImageIcon },
];

const pageTitles: Record<string, string> = {
  '/admin/campaigns': 'Campaigns',
  '/admin/import': 'Import Data Historis',
  '/admin/whatsapp': 'WhatsApp',
  '/admin/wa-templates': 'Template Pesan WhatsApp',
  '/admin/lead-bot-templates': 'Template Bot WhatsApp (Lead Masuk)',
  '/admin/brands': 'Brand Submissions',
  '/admin/creators': 'Creator Registrations',
  '/admin/portfolio': 'Portfolio Manager',
};

const COLLAPSE_KEY = 'azera_admin_sidebar_collapsed';

function SidebarContent({
  pathname, onNavigate, onLogout, collapsed,
}: {
  pathname: string; onNavigate: () => void; onLogout: () => void; collapsed?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: collapsed ? '24px 14px' : '24px 20px', borderBottom: '1px solid #e1e0ff', display: 'flex', justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <Link to="/admin/campaigns" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/logo-transparent.png" alt="AzeraKOL" style={{ height: '30px', objectFit: 'contain', flexShrink: 0 }} />
          {!collapsed && (
            <>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontStyle: 'italic', fontSize: '1.05rem', color: '#15157d', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>AZERAKOL</span>
              <span style={{ fontSize: '0.65rem', background: 'linear-gradient(135deg, #6728e4, #814bfe)', color: 'white', borderRadius: '4px', padding: '2px 7px', fontWeight: 700, letterSpacing: '0.06em', fontFamily: "var(--font-display)", whiteSpace: 'nowrap' }}>ADMIN</span>
            </>
          )}
        </Link>
      </div>

      <nav style={{ flex: 1, padding: collapsed ? '16px 10px' : '16px 12px', overflowY: 'auto' }}>
        {navItems.map(({ label, to, icon: Icon }) => {
          const active = pathname === to || pathname.startsWith(to + '/');
          return (
            <Link
              key={to} to={to} onClick={onNavigate} title={collapsed ? label : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: collapsed ? '12px' : '12px 14px', justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: '10px', marginBottom: '4px', textDecoration: 'none',
                fontFamily: "var(--font-display)", fontWeight: active ? 700 : 500,
                fontSize: '0.9rem', color: active ? '#6728e4' : '#464652',
                background: active ? '#e1e0ff' : 'transparent',
                transition: 'background 0.2s',
              }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: collapsed ? '16px 10px' : '16px 12px', borderTop: '1px solid #e1e0ff' }}>
        <button
          onClick={onLogout} title={collapsed ? 'Logout' : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
            padding: collapsed ? '12px' : '12px 14px', justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: '10px', border: 'none', background: 'transparent',
            cursor: 'pointer', fontFamily: "var(--font-display)", fontWeight: 500,
            fontSize: '0.9rem', color: '#ba1a1a', transition: 'background 0.2s',
          }}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === '1');
  const location = useLocation();
  const { admin, logout } = useAuth();

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0');
      return next;
    });
  };

  const pageTitle =
    pageTitles[location.pathname] ||
    Object.entries(pageTitles).find(([key]) => location.pathname.startsWith(key))?.[1] ||
    'Admin Panel';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f8f9ff' }}>
      <aside
        style={{
          width: collapsed ? '76px' : '256px',
          transition: 'width 0.2s ease',
          background: 'white', borderRight: '1px solid #c7c8cf', flexShrink: 0,
          height: '100%', position: 'relative',
        }}
        className="admin-sidebar-desktop"
      >
        <SidebarContent pathname={location.pathname} onNavigate={() => setSidebarOpen(false)} onLogout={logout} collapsed={collapsed} />
        <button
          onClick={toggleCollapsed}
          title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
          style={{
            position: 'absolute', top: '28px', right: '-13px', width: '26px', height: '26px',
            borderRadius: '50%', background: 'white', border: '1.5px solid #c7c8cf',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            color: '#6728e4', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', zIndex: 10,
          }}
        >
          {collapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
        </button>
      </aside>

      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 40, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} onClick={() => setSidebarOpen(false)} />
          <aside style={{ width: '256px', background: 'white', position: 'relative', zIndex: 50, boxShadow: '4px 0 24px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
              <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#464652' }}>
                <X size={20} />
              </button>
            </div>
            <SidebarContent pathname={location.pathname} onNavigate={() => setSidebarOpen(false)} onLogout={logout} />
          </aside>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%', overflow: 'hidden' }}>
        <header style={{ background: 'white', borderBottom: '1px solid #c7c8cf', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#464652', padding: '4px' }} className="admin-hamburger">
              <Menu size={22} />
            </button>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '1.05rem', color: '#191c20' }}>{pageTitle}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: '0.875rem', color: '#191c20' }}>
                {admin?.name || 'Admin'}
              </p>
              <p style={{ fontSize: '0.72rem', color: '#777683' }}>{admin?.email || ''}</p>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6728e4, #814bfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: "var(--font-display)", fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
              {(admin?.name?.[0] || 'A').toUpperCase()}
            </div>
          </div>
        </header>
        <main style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
