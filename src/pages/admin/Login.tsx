import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../lib/api';
import { Eye, EyeOff } from 'lucide-react';

const f = "var(--font-display)";
const heroGradient =
  'radial-gradient(85% 65% at 50% -8%, #5a3a94, rgba(90,58,148,0) 58%),' +
  'linear-gradient(180deg, #452a80 0%, #3f2378 52%, #331d64 100%)';

const wavePath =
  'M50 0 C 20 40, 80 80, 50 120 C 20 160, 80 200, 50 240 C 20 280, 80 320, 50 360 ' +
  'C 20 400, 80 440, 50 480 C 20 520, 80 560, 50 600 C 20 640, 80 680, 50 720 ' +
  'C 20 760, 80 800, 50 800 L100 800 L100 0 Z';

function WaveEdge() {
  const layers = [
    { color: '#3f2378', offset: 0 },
    { color: '#814bfe', offset: 14 },
    { color: '#e1e0ff', offset: 28 },
  ];
  return (
    <div style={{ position: 'absolute', top: 0, right: 0, height: '100%', width: '90px', transform: 'translateX(60%)', pointerEvents: 'none' }}>
      {layers.map((layer, i) => (
        <svg
          key={i}
          viewBox="0 0 100 800"
          preserveAspectRatio="none"
          style={{ position: 'absolute', top: 0, left: `${layer.offset}px`, height: '100%', width: '70px', zIndex: i }}
        >
          <path d={wavePath} fill={layer.color} />
        </svg>
      ))}
    </div>
  );
}

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/admin/login', { email, password });
      const { token, admin } = res.data;
      login(token, admin);
      navigate('/admin/dashboard');
    } catch {
      setError('Email atau password salah. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '13px 16px', borderRadius: '12px',
    border: '1.5px solid #e1e0ff', fontSize: '0.9rem', outline: 'none',
    fontFamily: f, color: '#191c20',
    background: '#f8f9ff', transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eef0ff', padding: '24px' }}>
      <div
        className="login-card"
        style={{
          width: 'min(980px, 100%)', minHeight: '620px', borderRadius: '32px', overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(21,21,125,0.18)', display: 'flex', background: 'white', position: 'relative',
        }}
      >
        <div
          className="login-left"
          style={{
            flex: '0 0 44%', position: 'relative', overflow: 'hidden', background: heroGradient,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '56px 44px', textAlign: 'center',
          }}
        >
          <div className="blob-lg" style={{ width: '340px', height: '340px', background: '#814bfe', opacity: 0.25, top: '-120px', left: '-100px' }} />
          <div className="blob-lg" style={{ width: '260px', height: '260px', background: '#c4ee87', opacity: 0.12, bottom: '-100px', right: '-60px' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontFamily: f, fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '28px' }}>
              Selamat Datang di
            </p>
            <div
              style={{
                width: '96px', height: '96px', borderRadius: '50%', background: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
                boxShadow: '0 12px 28px rgba(21,21,125,0.35)',
              }}
            >
              <img src="/logo-transparent.png" alt="AzeraKOL" style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
            </div>
            <p style={{ fontFamily: f, fontWeight: 900, fontStyle: 'italic', fontSize: '1.4rem', color: '#fff', letterSpacing: '-0.02em', marginBottom: '18px' }}>
              AZERAKOL
            </p>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', fontFamily: f, lineHeight: 1.7, maxWidth: '280px' }}>
              Platform manajemen campaign KOL untuk tim AzeraKOL. Kelola brand, creator, dan campaign dalam satu tempat.
            </p>
          </div>

          <WaveEdge />
        </div>

        <div
          className="login-right"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 64px', position: 'relative' }}
        >
          <div className="mobile-logo" style={{ display: 'none', alignItems: 'center', gap: '10px', marginBottom: '36px' }}>
            <img src="/logo-transparent.png" alt="AzeraKOL" style={{ height: '32px', objectFit: 'contain' }} />
            <span style={{ fontFamily: f, fontWeight: 900, fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--primary)', letterSpacing: '-0.02em' }}>AZERAKOL</span>
          </div>

          <div style={{ width: '100%', maxWidth: '360px' }}>
            <h1 style={{ fontFamily: f, fontWeight: 800, fontSize: '1.8rem', color: '#191c20', marginBottom: '8px' }}>Masuk</h1>
            <p style={{ color: '#777683', fontSize: '0.875rem', marginBottom: '32px', fontFamily: f }}>Masukkan kredensial admin kamu.</p>
            {error && (
              <div style={{ background: '#ffdad6', color: '#ba1a1a', borderRadius: '12px', padding: '12px 16px', fontSize: '0.875rem', marginBottom: '20px', fontFamily: f }}>{error}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#191c20', marginBottom: '6px', fontFamily: f }}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@azerakol.id" required style={inputStyle} />
              </div>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#191c20', marginBottom: '6px', fontFamily: f }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ ...inputStyle, paddingRight: '44px' }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#777683', padding: 0, display: 'flex' }}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '14px', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Masuk...' : 'Masuk'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-left { display: none !important; }
          .login-card { min-height: unset !important; }
          .login-right { padding: 40px 32px !important; }
          .mobile-logo { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
