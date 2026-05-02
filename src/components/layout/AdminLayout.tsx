import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Building2, Users, ImageIcon, LogOut, Menu } from 'lucide-react';
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

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { admin, logout } = useAuth();

  const pageTitle =
    pageTitles[location.pathname] ||
    Object.entries(pageTitles).find(([key]) => location.pathname.startsWith(key))?.[1] ||
    'Admin Panel';

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #F0EEFF' }}>
        <Link to="/admin/brands" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/icon.png" alt="Azera" style={{ height: '32px', objectFit: 'contain' }} />
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1A1040', letterSpacing: '0.05em' }}>
            AZERA
          </span>
          <span style={{ fontSize: '0.7rem', background: '#F0EEFF', color: '#6B2EE8', borderRadius: '4px', padding: '2px 6px', fontWeight: 600 }}>
            ADMIN
          </span>
        </Link>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map(({ label, to, icon: Icon }) => {
          const active = location.pathname === to || location.pathname.startsWith(to + '/');
          return (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '10px',
                marginBottom: '4px',
                textDecoration: 'none',
                fontWeight: active ? 600 : 500,
                fontSize: '0.9rem',
                color: active ? '#6B2EE8' : '#8B87B0',
                background: active ? '#F0EEFF' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Divider + Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid #F0EEFF' }}>
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '12px 14px',
            borderRadius: '10px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '0.9rem',
            color: '#EF4444',
            transition: 'background 0.2s',
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAFAFA' }}>
      {/* Desktop sidebar */}
      <aside
        style={{
          width: '256px',
          background: 'white',
          borderRight: '1px solid #F0EEFF',
          flexShrink: 0,
        }}
        className="admin-sidebar-desktop"
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            display: 'flex',
          }}
        >
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }}
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            style={{
              width: '256px',
              background: 'white',
              position: 'relative',
              zIndex: 50,
              boxShadow: '4px 0 24px rgba(0,0,0,0.1)',
            }}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header
          style={{
            background: 'white',
            borderBottom: '1px solid #F0EEFF',
            padding: '0 24px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#8B87B0',
                padding: '4px',
              }}
              className="admin-hamburger"
            >
              <Menu size={22} />
            </button>
            <h1 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1A1040' }}>
              {pageTitle}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1A1040' }}>
                {admin?.name || 'Admin'}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#8B87B0' }}>
                {admin?.email || ''}
              </p>
            </div>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.875rem',
              }}
            >
              {(admin?.name?.[0] || 'A').toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .admin-sidebar-desktop { display: block !important; }
          .admin-hamburger { display: none !important; }
        }
        @media (max-width: 767px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-hamburger { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
