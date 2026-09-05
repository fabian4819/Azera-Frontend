import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Megaphone, LogOut, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { usePicAuth } from '../../hooks/usePicAuth';

const navItems = [
  { label: 'My Campaigns', to: '/pic/campaigns', icon: Megaphone },
];

const COLLAPSE_KEY = 'azera_pic_sidebar_collapsed';

export default function PicLayout() {
  const location = useLocation();
  const { pic, logout } = usePicAuth();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === '1');

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0');
      return next;
    });
  };

  const activeTo = navItems
    .filter((item) => location.pathname === item.to || location.pathname.startsWith(item.to + '/'))
    .sort((a, b) => b.to.length - a.to.length)[0]?.to;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        gap: '16px',
        padding: '16px',
        background:
          'radial-gradient(85% 65% at 50% -8%, #5a3a94, rgba(90,58,148,0) 58%),' +
          'linear-gradient(180deg, #452a80 0%, #3f2378 52%, #331d64 100%)',
      }}
    >
      <aside
        style={{
          width: collapsed ? '76px' : '236px', flexShrink: 0, borderRadius: '22px',
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'column',
          padding: '20px 0', position: 'sticky', top: '16px', height: 'calc(100vh - 32px)',
          transition: 'width 0.2s ease', overflow: 'visible',
        }}
      >
        <button
          onClick={toggleCollapsed}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            position: 'absolute', top: '28px', right: '-13px', width: '26px', height: '26px',
            borderRadius: '50%', background: '#fff', border: '1.5px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            color: 'var(--secondary)', boxShadow: '0 2px 8px rgba(0,0,0,0.25)', zIndex: 10,
          }}
        >
          {collapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
        </button>

        <Link
          to="/pic/campaigns"
          style={{
            display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px',
            padding: collapsed ? '0 15px' : '0 20px',
          }}
        >
          <img src="/logo-transparent.png" alt="AzeraKOL" style={{ height: '30px', objectFit: 'contain', flexShrink: 0 }} />
          {!collapsed && (
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.02rem', color: '#fff', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              AZERAKOL
            </span>
          )}
        </Link>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', padding: collapsed ? '0 15px' : '0 14px', overflowY: 'auto', overflowX: 'hidden' }}>
          {navItems.map(({ label, to, icon: Icon }) => {
            const active = to === activeTo;
            return (
              <Link
                key={to}
                to={to}
                title={collapsed ? label : undefined}
                style={{
                  height: '46px', borderRadius: '13px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', gap: '12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  padding: collapsed ? 0 : '0 14px',
                  background: active ? 'var(--lime)' : 'transparent',
                  color: active ? 'var(--on-lime)' : 'rgba(255,255,255,0.65)',
                  fontFamily: 'var(--font-display)', fontWeight: active ? 700 : 500, fontSize: '0.88rem',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                <Icon size={19} style={{ flexShrink: 0 }} />
                {!collapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: collapsed ? '0 15px' : '0 14px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
          <button
            onClick={logout}
            title={collapsed ? 'Logout' : undefined}
            style={{
              height: '40px', borderRadius: '13px', border: 'none', background: 'transparent',
              display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
              justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? 0 : '0 14px',
              color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-display)', fontSize: '0.85rem',
            }}
          >
            <LogOut size={19} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0, background: '#f8f9ff', borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header
          style={{
            padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid var(--outline-variant)', flexShrink: 0,
          }}
        >
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--on-background)' }}>My Campaigns</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--on-background)' }}>
                {pic?.name || 'PIC'}
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--on-surface-variant)' }}>{pic?.email || ''}</p>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
              {(pic?.name?.[0] || 'P').toUpperCase()}
            </div>
          </div>
        </header>
        <main style={{ flex: 1, padding: '28px', overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
