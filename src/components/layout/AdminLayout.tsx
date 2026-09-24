import { Fragment, useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, UserCheck, ImageIcon, Megaphone, PanelsTopLeft, Upload, MessageCircle, Inbox, MessageSquareText, Bot, Plug, LogOut, ChevronsLeft, ChevronsRight, FolderOpen, FileText, Receipt, FileSignature, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Campaigns', to: '/admin/campaigns', icon: Megaphone },
  { label: 'Dashboard Campaign', to: '/admin/campaign-dashboard', icon: PanelsTopLeft },
  { label: 'Import Data', to: '/admin/import', icon: Upload },
  { label: 'WhatsApp', to: '/admin/whatsapp', icon: MessageCircle },
  { label: 'Inbox WhatsApp', to: '/admin/whatsapp/inbox', icon: Inbox },
  { label: 'Template Pesan', to: '/admin/wa-templates', icon: MessageSquareText },
  { label: 'Template Bot Lead', to: '/admin/lead-bot-templates', icon: Bot },
  { label: 'Brands', to: '/admin/brands', icon: Building2 },
  { label: 'Creators', to: '/admin/creators', icon: Users },
  { label: 'Ekstensi KOL Lister', to: '/admin/extension', icon: Plug },
  { label: 'PIC', to: '/admin/pic', icon: UserCheck },
  { label: 'Portfolio', to: '/admin/portfolio', icon: ImageIcon },
];

/** Grup "Document" (bisa dibuka/tutup) — dirender tepat setelah item DOCS_AFTER */
const DOCS_AFTER = '/admin/import';
const docItems = [
  { label: 'Quotation', to: '/admin/documents/quotation', icon: FileText },
  { label: 'Invoice', to: '/admin/documents/invoice', icon: Receipt },
  { label: 'SPK', to: '/admin/documents/spk', icon: FileSignature },
];

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/campaigns': 'Campaigns',
  '/admin/campaign-dashboard': 'Dashboard Campaign',
  '/admin/import': 'Import Data Historis',
  '/admin/whatsapp': 'WhatsApp',
  '/admin/whatsapp/inbox': 'Inbox WhatsApp',
  '/admin/wa-templates': 'Template Pesan WhatsApp',
  '/admin/lead-bot-templates': 'Template Bot WhatsApp (Lead Masuk)',
  '/admin/brands': 'Brand Submissions',
  '/admin/creators': 'Creator Registrations',
  '/admin/extension': 'Ekstensi KOL Lister',
  '/admin/pic': 'PIC / Handle-by',
  '/admin/portfolio': 'Portfolio Manager',
  '/admin/documents/quotation': 'Document — Quotation',
  '/admin/documents/invoice': 'Document — Invoice',
  '/admin/documents/spk': 'Document — SPK',
};

const COLLAPSE_KEY = 'azera_admin_sidebar_collapsed';
const DOCS_OPEN_KEY = 'azera_admin_docs_open';

function readFlag(key: string): boolean | null {
  try {
    const v = localStorage.getItem(key);
    return v === null ? null : v === '1';
  } catch {
    return null;
  }
}

export default function AdminLayout() {
  const location = useLocation();
  const { admin, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === '1');
  const [docsOpen, setDocsOpen] = useState(() => readFlag(DOCS_OPEN_KEY) ?? location.pathname.startsWith('/admin/documents'));
  const toggleDocs = () => {
    setDocsOpen((prev) => {
      try { localStorage.setItem(DOCS_OPEN_KEY, prev ? '0' : '1'); } catch { /* storage diblokir — cukup state */ }
      return !prev;
    });
  };

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

  const activeTo = [...navItems, ...docItems]
    .filter((item) => location.pathname === item.to || location.pathname.startsWith(item.to + '/'))
    .sort((a, b) => b.to.length - a.to.length)[0]?.to;

  const renderLink = ({ label, to, icon: Icon }: { label: string; to: string; icon: typeof LayoutDashboard }, nested = false) => {
    const active = to === activeTo;
    return (
      <Link
        key={to}
        to={to}
        title={collapsed ? label : undefined}
        style={{
          height: nested ? '40px' : '46px', borderRadius: '13px', flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: '12px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? 0 : nested ? '0 14px 0 30px' : '0 14px',
          background: active ? 'var(--lime)' : 'transparent',
          color: active ? 'var(--on-lime)' : 'rgba(255,255,255,0.65)',
          fontFamily: 'var(--font-display)', fontWeight: active ? 700 : 500, fontSize: nested ? '0.84rem' : '0.88rem',
          transition: 'background 0.2s, color 0.2s',
        }}
      >
        <Icon size={nested ? 17 : 19} style={{ flexShrink: 0 }} />
        {!collapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
      </Link>
    );
  };

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
          title={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
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
          to="/admin/dashboard"
          style={{
            display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px',
            padding: collapsed ? '0 15px' : '0 20px',
          }}
        >
          <img src="/logo-transparent.png" alt="AzeraKOL" style={{ height: '30px', objectFit: 'contain', flexShrink: 0 }} />
          {!collapsed && (
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontStyle: 'italic', fontSize: '1.02rem', color: '#fff', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
              AZERAKOL
            </span>
          )}
        </Link>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', padding: collapsed ? '0 15px' : '0 14px', overflowY: 'auto', overflowX: 'hidden' }}>
          {navItems.map((item) => (
            <Fragment key={item.to}>
              {renderLink(item)}
              {item.to === DOCS_AFTER && (collapsed ? docItems.map((d) => renderLink(d)) : (
                <>
                  <button
                    onClick={toggleDocs}
                    aria-expanded={docsOpen}
                    style={{
                      height: '46px', borderRadius: '13px', flexShrink: 0, border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '0 14px',
                      background: 'transparent', color: 'rgba(255,255,255,0.65)',
                      fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '0.88rem',
                    }}
                  >
                    <FolderOpen size={19} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1, textAlign: 'left' }}>Document</span>
                    <ChevronDown size={16} style={{ transform: docsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  {docsOpen && docItems.map((d) => renderLink(d, true))}
                </>
              ))}
            </Fragment>
          ))}
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

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <header
          style={{
            background: '#f8f9ff', borderRadius: '999px', padding: '14px 28px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0, boxShadow: '0 4px 16px rgba(21,21,125,0.06)',
            position: 'sticky', top: '16px', zIndex: 5,
          }}
        >
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--on-background)' }}>{pageTitle}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--on-background)' }}>
                {admin?.name || 'Admin'}
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--on-surface-variant)' }}>{admin?.email || ''}</p>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
              {(admin?.name?.[0] || 'A').toUpperCase()}
            </div>
          </div>
        </header>
        <main style={{ flex: 1, background: '#f8f9ff', borderRadius: '24px', padding: '28px', overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
