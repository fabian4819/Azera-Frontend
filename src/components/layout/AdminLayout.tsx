import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Building2, Users, ImageIcon, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { label: 'Brands', to: '/admin/brands', icon: Building2 },
  { label: 'KOLs', to: '/admin/kols', icon: Users },
  { label: 'Portfolio', to: '/admin/portfolio', icon: ImageIcon },
];

const pageTitles: Record<string, string> = {
  '/admin/brands': 'Brand Submissions',
  '/admin/kols': 'KOL Submissions',
  '/admin/portfolio': 'Portfolio Manager',
};

function SidebarContent({ pathname, onNavigate, onLogout }: { pathname: string; onNavigate: () => void; onLogout: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #e1e0ff' }}>
        <Link to="/admin/brands" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/icon.png" alt="AzeraKOL" style={{ height: '30px', objectFit: 'contain' }} />
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900, fontStyle: 'italic', fontSize: '1.05rem', color: '#15157d', letterSpacing: '-0.02em' }}>AZERAKOL</span>
          <span style={{ fontSize: '0.65rem', background: 'linear-gradient(135deg, #6728e4, #814bfe)', color: 'white', borderRadius: '4px', padding: '2px 7px', fontWeight: 700, letterSpacing: '0.06em', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>ADMIN</span>
        </Link>
      </div>

      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map(({ label, to, icon: Icon }) => {
          const active = pathname === to || pathname.startsWith(to + '/');
          return (
            <Link
              key={to} to={to} onClick={onNavigate}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px',
                borderRadius: '10px', marginBottom: '4px', textDecoration: 'none',
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: active ? 700 : 500,
                fontSize: '0.9rem', color: active ? '#6728e4' : '#464652',
                background: active ? '#e1e0ff' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '16px 12px', borderTop: '1px solid #e1e0ff' }}>
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
            padding: '12px 14px', borderRadius: '10px', border: 'none', background: 'transparent',
            cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500,
            fontSize: '0.9rem', color: '#ba1a1a', transition: 'background 0.2s',
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { admin, logout } = useAuth();

  const pageTitle =
    pageTitles[location.pathname] ||
    Object.entries(pageTitles).find(([key]) => location.pathname.startsWith(key))?.[1] ||
    'Admin Panel';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9ff' }}>
      <aside style={{ width: '256px', background: 'white', borderRight: '1px solid #c7c8cf', flexShrink: 0 }} className="admin-sidebar-desktop">
        <SidebarContent pathname={location.pathname} onNavigate={() => setSidebarOpen(false)} onLogout={logout} />
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

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ background: 'white', borderBottom: '1px solid #c7c8cf', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#464652', padding: '4px' }} className="admin-hamburger">
              <Menu size={22} />
            </button>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#191c20' }}>{pageTitle}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: '0.875rem', color: '#191c20' }}>
                {admin?.name || 'Admin'}
              </p>
              <p style={{ fontSize: '0.72rem', color: '#777683' }}>{admin?.email || ''}</p>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6728e4, #814bfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
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
