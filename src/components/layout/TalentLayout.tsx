import { useEffect, useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Megaphone, LogOut, ChevronsLeft, ChevronsRight, Mail } from 'lucide-react';
import { useTalentAuth } from '../../hooks/useTalentAuth';
import talentApi from '../../lib/talentApi';

const navItems = [
  { label: 'My Campaigns', to: '/talent/campaigns', icon: Megaphone },
];

const pageTitles: Record<string, string> = {
  '/talent/campaigns': 'My Campaigns',
};

const COLLAPSE_KEY = 'azera_talent_sidebar_collapsed';
const f = "var(--font-display)";

function CompleteEmailModal({ onSaved }: { onSaved: () => void }) {
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await talentApi.patch('/creator/me', { email });
      onSaved();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || 'Gagal menyimpan email');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(21,21,125,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f0eeff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <Mail size={22} color="#6728e4" />
        </div>
        <h2 style={{ fontFamily: f, fontWeight: 800, fontSize: '1.15rem', color: '#191c20', marginBottom: '8px' }}>Lengkapi Email Kamu</h2>
        <p style={{ fontFamily: f, fontSize: '0.85rem', color: '#777683', marginBottom: '20px', lineHeight: 1.5 }}>
          Supaya tim AzeraKOL bisa menghubungi kamu lewat email juga kalau diperlukan.
        </p>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
            style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #e1e0ff', fontSize: '0.9rem', outline: 'none', fontFamily: f, color: '#191c20', background: '#f8f9ff', marginBottom: '14px', boxSizing: 'border-box' }}
          />
          {error && <p style={{ color: '#ba1a1a', fontSize: '0.8rem', marginBottom: '14px', fontFamily: f }}>{error}</p>}
          <button type="submit" disabled={saving} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function TalentLayout() {
  const location = useLocation();
  const { creator, logout } = useTalentAuth();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === '1');
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      talentApi.get('/creator/me')
        .then((res) => { if (!res.data.email) setShowEmailModal(true); })
        .catch(() => {});
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

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

  const pageTitle =
    pageTitles[location.pathname] ||
    Object.entries(pageTitles).find(([key]) => location.pathname.startsWith(key))?.[1] ||
    'Talent Portal';

  return (
    <div
      className="talent-shell"
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
        className="talent-sidebar"
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
          to="/talent/campaigns"
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
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--on-background)' }}>{pageTitle}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--on-background)' }}>
                {creator?.name || 'Creator'}
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--on-surface-variant)' }}>{creator?.phone || ''}</p>
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
              {(creator?.name?.[0] || 'C').toUpperCase()}
            </div>
          </div>
        </header>
        <main style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>

      {showEmailModal && (
        <CompleteEmailModal onSaved={() => setShowEmailModal(false)} />
      )}

      <style>{`
        @media (max-width: 640px) {
          .talent-sidebar { width: 64px !important; }
          .talent-sidebar span { display: none !important; }
        }
      `}</style>
    </div>
  );
}
