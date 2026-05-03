import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../lib/api';
import { Eye, EyeOff } from 'lucide-react';

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
      navigate('/admin/brands');
    } catch {
      setError('Email atau password salah. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '13px 16px', borderRadius: '12px',
    border: '1.5px solid #c7c8cf', fontSize: '0.9rem', outline: 'none',
    fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#191c20',
    background: 'white', transition: 'border-color 0.2s',
  };

  const f = "'Plus Jakarta Sans', sans-serif";

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <div className="login-left" style={{ flex: 1, background: '#15157d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', position: 'relative', overflow: 'hidden' }}>
        <div className="blob-lg" style={{ width: '500px', height: '500px', background: '#814bfe', opacity: 0.3, top: '-200px', left: '-150px' }} />
        <div className="blob-lg" style={{ width: '400px', height: '400px', background: '#ff81aa', opacity: 0.25, bottom: '-150px', right: '-100px' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontFamily: f, fontWeight: 900, fontStyle: 'italic', fontSize: 'clamp(5rem, 12vw, 10rem)', background: 'linear-gradient(135deg, #9da1ff, #ff81aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 0.9, marginBottom: '24px' }}>AZERA</div>
          <p style={{ color: 'rgba(157,161,255,0.8)', fontSize: '1rem', fontFamily: f, lineHeight: 1.7, maxWidth: '300px' }}>
            Platform manajemen kampanye KOL untuk tim Azera.
          </p>
        </div>
      </div>

      <div className="login-right" style={{ width: '480px', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px' }}>
          <img src="/icon.png" alt="Azera" style={{ height: '36px', objectFit: 'contain' }} />
          <span style={{ fontFamily: f, fontWeight: 900, fontStyle: 'italic', fontSize: '1.2rem', color: '#15157d', letterSpacing: '-0.02em' }}>AZERA</span>
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

      <style>{`
        @media (max-width: 768px) { .login-left { display: none !important; } .login-right { width: 100% !important; } }
      `}</style>
    </div>
  );
}
