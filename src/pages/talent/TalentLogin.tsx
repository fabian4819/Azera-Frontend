import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import talentApi from '../../lib/talentApi';
import { useTalentAuth } from '../../hooks/useTalentAuth';

export default function TalentLogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useTalentAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await talentApi.post('/creator/login', { phone, password });
      login(res.data.token, res.data.creator);
      navigate('/talent/campaigns');
    } catch {
      setError('Nomor WA atau password salah. Password didapat dari admin saat kamu diterima campaign.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '13px 16px', borderRadius: '12px',
    border: '1.5px solid #c7c8cf', fontSize: '0.9rem', outline: 'none',
    fontFamily: "var(--font-display)", color: '#191c20',
    background: 'white',
  };

  const f = "var(--font-display)";

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#15157d', position: 'relative', overflow: 'hidden' }}>
      <div className="blob-lg" style={{ width: '400px', height: '400px', background: '#814bfe', opacity: 0.3, top: '-150px', left: '-100px' }} />
      <div className="blob-lg" style={{ width: '350px', height: '350px', background: '#ff81aa', opacity: 0.25, bottom: '-120px', right: '-100px' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: f, fontWeight: 900, fontStyle: 'italic', fontSize: '2.4rem', background: 'linear-gradient(135deg, #9da1ff, #ff81aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '8px' }}>
          AZERAKOL
        </div>
        <p style={{ color: 'rgba(157,161,255,0.8)', fontSize: '0.85rem', fontFamily: f, marginBottom: '32px' }}>Talent Portal</p>

        <div style={{ width: '100%', maxWidth: '380px', background: 'white', borderRadius: '20px', padding: '32px 28px' }}>
          <h1 style={{ fontFamily: f, fontWeight: 800, fontSize: '1.4rem', color: '#191c20', marginBottom: '6px' }}>Masuk</h1>
          <p style={{ color: '#777683', fontSize: '0.82rem', marginBottom: '24px', fontFamily: f }}>Pakai nomor WA & password yang dikirim tim admin.</p>
          {error && (
            <div style={{ background: '#ffdad6', color: '#ba1a1a', borderRadius: '12px', padding: '12px 16px', fontSize: '0.82rem', marginBottom: '18px', fontFamily: f }}>{error}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: '#191c20', marginBottom: '6px', fontFamily: f }}>Nomor WhatsApp</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="628xxxxxxxxxx" required style={inputStyle} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.82rem', color: '#191c20', marginBottom: '6px', fontFamily: f }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ ...inputStyle, paddingRight: '44px' }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#777683', padding: 0, display: 'flex' }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem', padding: '14px', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
