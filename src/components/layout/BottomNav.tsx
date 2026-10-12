import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal, LogOut, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface BottomNavItem { label: string; to: string; icon: LucideIcon }

interface BottomNavProps {
  /** Tab yang selalu tampil di bar (maks ~4, sisanya masuk ke sheet "Lainnya"). */
  primaryItems: BottomNavItem[];
  /** Kalau kosong, tab terakhir jadi Logout langsung (bukan "Lainnya"). */
  moreItems?: BottomNavItem[];
  activeTo?: string;
  onLogout: () => void;
}

/** Bottom tab bar untuk shell dashboard (Admin/PIC/Talent) di mobile — ditampilkan lewat CSS `.mobile-bottom-nav` (index.css), disembunyikan di desktop. */
export default function BottomNav({ primaryItems, moreItems = [], activeTo, onLogout }: BottomNavProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const hasMore = moreItems.length > 0;

  const tabStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
    flex: 1, padding: '6px 2px', textDecoration: 'none', border: 'none', background: 'none', cursor: 'pointer',
    color: active ? 'var(--lime)' : 'rgba(255,255,255,0.6)',
    fontFamily: 'var(--font-display)', fontSize: '0.64rem', fontWeight: active ? 700 : 500,
  });

  return (
    <>
      <nav
        className="mobile-bottom-nav"
        style={{
          position: 'fixed', bottom: '10px', left: '10px', right: '10px', zIndex: 40,
          background: '#2c1a52', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)', padding: '4px 2px',
        }}
      >
        {primaryItems.map(({ label, to, icon: Icon }) => (
          <Link key={to} to={to} onClick={() => setMoreOpen(false)} style={tabStyle(to === activeTo)}>
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
        {hasMore ? (
          <button onClick={() => setMoreOpen((v) => !v)} style={tabStyle(moreOpen)}>
            <MoreHorizontal size={20} />
            <span>Lainnya</span>
          </button>
        ) : (
          <button onClick={onLogout} style={tabStyle(false)}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        )}
      </nav>

      {hasMore && moreOpen && (
        <div
          onClick={() => setMoreOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(21,21,125,0.45)', zIndex: 45 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, background: '#2c1a52', borderRadius: '24px 24px 0 0',
              padding: '18px 16px 28px', maxHeight: '65vh', overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Menu Lainnya</span>
              <button onClick={() => setMoreOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {moreItems.map(({ label, to, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMoreOpen(false)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '14px 4px',
                    borderRadius: '14px', background: 'rgba(255,255,255,0.06)', textDecoration: 'none',
                    color: to === activeTo ? 'var(--lime)' : 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-display)', fontSize: '0.72rem', fontWeight: 500,
                  }}
                >
                  <Icon size={20} />
                  <span style={{ textAlign: 'center' }}>{label}</span>
                </Link>
              ))}
              <button
                onClick={() => { setMoreOpen(false); onLogout(); }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '14px 4px',
                  borderRadius: '14px', background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-display)', fontSize: '0.72rem', fontWeight: 500,
                }}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
