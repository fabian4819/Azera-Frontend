import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import talentApi from '../lib/talentApi';
import picApi from '../lib/picApi';
import { useTalentAuth } from '../hooks/useTalentAuth';
import { usePicAuth } from '../hooks/usePicAuth';

const f = "var(--font-display)";
const heroGradient =
  'radial-gradient(85% 65% at 50% -8%, #5a3a94, rgba(90,58,148,0) 58%),' +
  'linear-gradient(180deg, #452a80 0%, #3f2378 52%, #331d64 100%)';

type Role = 'creator' | 'pic';
type Mode = 'signin' | 'signup';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '13px 16px', borderRadius: '12px',
  border: '1.5px solid #e1e0ff', fontSize: '0.9rem', outline: 'none',
  fontFamily: f, color: '#191c20',
  background: '#f8f9ff', transition: 'border-color 0.2s',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#191c20', marginBottom: '6px', fontFamily: f,
};

export default function PortalLogin() {
  const [role, setRole] = useState<Role>('creator');
  const [mode, setMode] = useState<Mode>('signin');

  // Creator fields
  const [phone, setPhone] = useState('');
  const [creatorEmail, setCreatorEmail] = useState('');
  const [creatorPassword, setCreatorPassword] = useState('');

  // PIC fields
  const [picName, setPicName] = useState('');
  const [picPhone, setPicPhone] = useState('');
  const [picEmail, setPicEmail] = useState('');
  const [picPassword, setPicPassword] = useState('');

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login: loginCreator } = useTalentAuth();
  const { login: loginPic } = usePicAuth();
  const navigate = useNavigate();

  const switchRole = (next: Role) => {
    setRole(next);
    setMode('signin');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (role === 'creator' && mode === 'signin') {
        const res = await talentApi.post('/creator/login', { phone, password: creatorPassword });
        loginCreator(res.data.token, res.data.creator);
        navigate('/talent/campaigns');
      } else if (role === 'creator' && mode === 'signup') {
        const res = await talentApi.post('/creator/register-password', { phone, password: creatorPassword, email: creatorEmail || undefined });
        loginCreator(res.data.token, res.data.creator);
        navigate('/talent/campaigns');
      } else if (role === 'pic' && mode === 'signin') {
        const res = await picApi.post('/pic/login', { email: picEmail, password: picPassword });
        loginPic(res.data.token, res.data.pic);
        navigate('/pic/campaigns');
      } else {
        const res = await picApi.post('/pic/register', { name: picName, phone: picPhone, email: picEmail, password: picPassword });
        loginPic(res.data.token, res.data.pic);
        navigate('/pic/campaigns');
      }
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleLabel = role === 'creator' ? 'Creator / Talent' : 'PIC Campaign';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eef0ff', padding: '24px' }}>
      <div
        className="login-card"
        style={{
          width: 'min(980px, 100%)', minHeight: '660px', borderRadius: '32px', overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(21,21,125,0.18)', display: 'flex', background: 'white', position: 'relative',
        }}
      >
        <div
          className="login-left"
          style={{
            flex: '0 0 44%', position: 'relative', overflow: 'hidden', background: heroGradient,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '56px 44px', textAlign: 'center',
            borderTopRightRadius: '64px', borderBottomRightRadius: '64px',
          }}
        >
          <div className="blob-lg" style={{ width: '340px', height: '340px', background: '#814bfe', opacity: 0.25, top: '-120px', left: '-100px' }} />
          <div className="blob-lg" style={{ width: '260px', height: '260px', background: '#c4ee87', opacity: 0.12, bottom: '-100px', right: '-60px' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontFamily: f, fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '28px' }}>
              Welcome to
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
            <p style={{ fontFamily: f, fontWeight: 900, fontSize: '1.4rem', color: '#fff', letterSpacing: '-0.02em', marginBottom: '18px' }}>
              AZERAKOL
            </p>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', fontFamily: f, lineHeight: 1.7, maxWidth: '280px' }}>
              The campaign portal for creators and PICs working with AzeraKOL. Track your campaigns and progress in one place.
            </p>
          </div>
        </div>

        <div
          className="login-right"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 64px', position: 'relative' }}
        >
          <div className="mobile-logo" style={{ display: 'none', alignItems: 'center', gap: '10px', marginBottom: '36px' }}>
            <img src="/logo-transparent.png" alt="AzeraKOL" style={{ height: '32px', objectFit: 'contain' }} />
            <span style={{ fontFamily: f, fontWeight: 900, fontSize: '1.1rem', color: 'var(--primary)', letterSpacing: '-0.02em' }}>AZERAKOL</span>
          </div>

          <div style={{ width: '100%', maxWidth: '380px' }}>
            <div style={{ display: 'flex', background: '#f0eeff', borderRadius: '999px', padding: '4px', marginBottom: '28px' }}>
              {(['creator', 'pic'] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => switchRole(r)}
                  style={{
                    flex: 1, padding: '10px 12px', borderRadius: '999px', border: 'none', cursor: 'pointer',
                    fontFamily: f, fontWeight: 700, fontSize: '0.82rem',
                    background: role === r ? 'white' : 'transparent',
                    color: role === r ? 'var(--secondary)' : '#777683',
                    boxShadow: role === r ? '0 2px 8px rgba(107,46,232,0.15)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {r === 'creator' ? 'Creator / Talent' : 'PIC Campaign'}
                </button>
              ))}
            </div>

            <h1 style={{ fontFamily: f, fontWeight: 800, fontSize: '1.6rem', color: '#191c20', marginBottom: '8px' }}>
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </h1>
            <p style={{ color: '#777683', fontSize: '0.875rem', marginBottom: '28px', fontFamily: f }}>
              {mode === 'signin' ? `Sign in as ${roleLabel.toLowerCase()}.` : `Create your ${roleLabel.toLowerCase()} account.`}
            </p>
            {error && (
              <div style={{ background: '#ffdad6', color: '#ba1a1a', borderRadius: '12px', padding: '12px 16px', fontSize: '0.875rem', marginBottom: '20px', fontFamily: f }}>{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              {role === 'creator' ? (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>WhatsApp Number</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="628xxxxxxxxxx" required style={inputStyle} />
                  </div>
                  {mode === 'signup' && (
                    <div style={{ marginBottom: '16px' }}>
                      <label style={labelStyle}>Email (optional)</label>
                      <input type="email" value={creatorEmail} onChange={(e) => setCreatorEmail(e.target.value)} placeholder="you@email.com" style={inputStyle} />
                    </div>
                  )}
                  <div style={{ marginBottom: mode === 'signin' ? '12px' : '8px' }}>
                    <label style={labelStyle}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showPass ? 'text' : 'password'} value={creatorPassword} onChange={(e) => setCreatorPassword(e.target.value)} placeholder="••••••••" required minLength={mode === 'signup' ? 6 : undefined} style={{ ...inputStyle, paddingRight: '44px' }} />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#777683', padding: 0, display: 'flex' }}>
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {mode === 'signup' && (
                      <p style={{ fontSize: '0.75rem', color: '#8a8a99', fontFamily: f, marginTop: '6px' }}>
                        Your number must already be registered via the KOL form.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {mode === 'signup' && (
                    <>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Nama MG</label>
                        <input type="text" value={picName} onChange={(e) => setPicName(e.target.value)} placeholder="Enter name" required style={inputStyle} />
                      </div>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>WhatsApp Number</label>
                        <input type="tel" value={picPhone} onChange={(e) => setPicPhone(e.target.value)} placeholder="628xxxxxxxxxx" required style={inputStyle} />
                      </div>
                    </>
                  )}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>Email</label>
                    <input type="email" value={picEmail} onChange={(e) => setPicEmail(e.target.value)} placeholder="you@brand.com" required style={inputStyle} />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={labelStyle}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showPass ? 'text' : 'password'} value={picPassword} onChange={(e) => setPicPassword(e.target.value)} placeholder="••••••••" required minLength={mode === 'signup' ? 6 : undefined} style={{ ...inputStyle, paddingRight: '44px' }} />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#777683', padding: 0, display: 'flex' }}>
                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  {mode === 'signup' && (
                    <p style={{ fontSize: '0.75rem', color: '#8a8a99', fontFamily: f, marginTop: '-4px', marginBottom: '12px' }}>
                      Your dashboard starts empty. Once the admin assigns you to a campaign, it will show up here automatically.
                    </p>
                  )}
                </>
              )}

              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '14px', opacity: loading ? 0.7 : 1, marginTop: '8px' }}>
                {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#777683', fontFamily: f, marginTop: '20px' }}>
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary)', fontWeight: 700, fontFamily: f, fontSize: '0.82rem', padding: 0 }}
              >
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
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
