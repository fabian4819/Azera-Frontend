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
    width: '100%',
    padding: '13px 16px',
    borderRadius: '12px',
    border: '1.5px solid #E0DCFF',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    color: '#120E28',
    background: 'white',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left: Dark brand panel */}
      <div
        style={{
          flex: 1,
          background: '#08060F',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="login-left"
      >
        {/* Orbs */}
        <div className="orb" style={{ width: '400px', height: '400px', background: '#6B2EE8', top: '-150px', left: '-100px' }} />
        <div className="orb" style={{ width: '300px', height: '300px', background: '#E8197A', bottom: '-100px', right: '-50px' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Giant AZERA */}
          <div
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(5rem, 12vw, 10rem)',
              background: 'linear-gradient(135deg, #6B2EE8, #E8197A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 0.9,
              marginBottom: '24px',
            }}
          >
            AZERA
          </div>
          <p
            style={{
              color: '#8B87A8',
              fontSize: '1rem',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              lineHeight: 1.7,
              maxWidth: '300px',
            }}
          >
            Platform manajemen kampanye KOL untuk tim Azera.
          </p>
        </div>
      </div>

      {/* Right: Login form */}
      <div
        style={{
          width: '480px',
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 48px',
        }}
        className="login-right"
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px' }}>
          <img src="/icon.png" alt="Azera" style={{ height: '36px', objectFit: 'contain' }} />
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: '#120E28', letterSpacing: '0.1em' }}>
            AZERA
          </span>
        </div>

        <div style={{ width: '100%', maxWidth: '360px' }}>
          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: '1.8rem',
              color: '#120E28',
              marginBottom: '8px',
            }}
          >
            Masuk
          </h1>
          <p style={{ color: '#8B87A8', fontSize: '0.875rem', marginBottom: '32px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Masukkan kredensial admin kamu.
          </p>

          {error && (
            <div
              style={{
                background: '#FEE2E2',
                color: '#B91C1C',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '0.875rem',
                marginBottom: '20px',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#120E28',
                  marginBottom: '6px',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@azerakol.id"
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#120E28',
                  marginBottom: '6px',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ ...inputStyle, paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#8B87A8',
                    padding: 0,
                    display: 'flex',
                  }}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '14px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-left { display: none !important; }
          .login-right { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
