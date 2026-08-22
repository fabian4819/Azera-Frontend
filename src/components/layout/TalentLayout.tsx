import { Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useTalentAuth } from '../../hooks/useTalentAuth';

export default function TalentLayout() {
  const { creator, logout } = useTalentAuth();
  const f = "'Plus Jakarta Sans', sans-serif";

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9ff' }}>
      <header style={{ background: 'white', borderBottom: '1px solid #e1e0ff', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <p style={{ fontFamily: f, fontWeight: 900, fontStyle: 'italic', fontSize: '1rem', color: '#15157d' }}>AZERAKOL</p>
          <p style={{ fontFamily: f, fontSize: '0.75rem', color: '#777683' }}>{creator?.name}</p>
        </div>
        <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ba1a1a', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: f, fontSize: '0.8rem', fontWeight: 600 }}>
          <LogOut size={16} />
          Keluar
        </button>
      </header>
      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '20px 16px 60px' }}>
        <Outlet />
      </main>
    </div>
  );
}
