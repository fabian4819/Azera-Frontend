import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plug, Copy, Check, Trash2, RefreshCw, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import { SiInstagram, SiTiktok, SiThreads, SiX, SiFacebook, SiYoutube } from 'react-icons/si';
import api from '../../lib/api';
import SnapshotDetail, { type SnapshotView } from '../../components/ui/SnapshotDetail';

const f = 'var(--font-display)';
const card: React.CSSProperties = {
  background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e1e0ff',
  boxShadow: '0 2px 12px rgba(107,46,232,0.05)', marginBottom: '20px',
};
const h2: React.CSSProperties = { fontFamily: f, fontWeight: 800, fontSize: '1.05rem', color: '#191c20', marginBottom: '4px' };
const sub: React.CSSProperties = { fontSize: '0.82rem', color: '#777683', marginBottom: '18px', lineHeight: 1.5 };
const btnPrimary: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '9px 16px', background: '#6728e4',
  color: 'white', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, fontFamily: f,
};

const platformIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  instagram: SiInstagram, tiktok: SiTiktok, threads: SiThreads, x: SiX, facebook: SiFacebook, youtube: SiYoutube,
};

interface Token {
  _id: string; label: string; hint: string;
  createdBy?: { name: string }; lastUsedAt?: string; revokedAt?: string; createdAt: string;
}
type RadarRow = SnapshotView & {
  creator?: { _id: string; name: string } | null;
  latestSnapshotId: string;
  snapshotCount: number;
  capturedAt: string;
};

function errMsg(e: unknown, fallback: string) {
  return (e as { response?: { data?: { message?: string } } })?.response?.data?.message || fallback;
}

export default function ExtensionConnect() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [radar, setRadar] = useState<RadarRow[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [freshCode, setFreshCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [linkedFilter, setLinkedFilter] = useState<'all' | 'true' | 'false'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadTokens = async () => {
    const res = await api.get('/admin/extension/tokens');
    setTokens(res.data);
  };
  const loadRadar = async () => {
    const params = linkedFilter === 'all' ? {} : { linked: linkedFilter };
    const res = await api.get('/admin/extension/snapshots', { params });
    setRadar(res.data);
  };

  useEffect(() => {
    const t = window.setTimeout(() => {
      Promise.all([loadTokens(), loadRadar()])
        .catch((e) => setError(errMsg(e, 'Gagal memuat data')))
        .finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkedFilter]);

  const createToken = async () => {
    setError('');
    try {
      const res = await api.post('/admin/extension/tokens', { label: newLabel });
      setFreshCode(res.data.code);
      setNewLabel('');
      await loadTokens();
    } catch (e) { setError(errMsg(e, 'Gagal membuat kode')); }
  };

  const revoke = async (id: string) => {
    setError('');
    try {
      await api.delete(`/admin/extension/tokens/${id}`);
      await loadTokens();
    } catch (e) { setError(errMsg(e, 'Gagal mencabut kode')); }
  };

  const removeRadar = async (platform: string, username: string) => {
    if (!window.confirm(`Hapus semua snapshot @${username} dari radar?`)) return;
    setError('');
    try {
      await api.delete('/admin/extension/snapshots', { params: { platform, username } });
      setExpanded(null);
      await loadRadar();
    } catch (e) { setError(errMsg(e, 'Gagal menghapus')); }
  };

  const copyCode = () => {
    if (!freshCode) return;
    navigator.clipboard.writeText(freshCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', color: '#777683' }}>Memuat...</div>;

  return (
    <div>
      {error && (
        <div style={{ background: '#ffdad6', color: '#ba1a1a', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.82rem', fontFamily: f }}>{error}</div>
      )}

      <div style={card}>
        <p style={h2}><Plug size={16} style={{ verticalAlign: '-2px', marginRight: '6px' }} />Hubungkan Ekstensi</p>
        <p style={sub}>
          Pasang ekstensi <b>KOL Lister</b> di Chrome (folder <code>extension/</code>), lalu tempel kode di bawah ke popup ekstensi.
          Kode berlaku sampai dicabut. Setiap tarikan metrik masuk atas nama pembuat kode ini.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: freshCode ? '16px' : 0, flexWrap: 'wrap' }}>
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Nama perangkat (mis. Laptop CE Rani)"
            style={{ flex: 1, minWidth: '200px', padding: '9px 12px', border: '1px solid #ddd9ec', borderRadius: '10px', fontSize: '0.85rem' }}
          />
          <button onClick={createToken} style={btnPrimary}>Buat kode baru</button>
        </div>

        {freshCode && (
          <div style={{ background: '#f0eeff', border: '1px solid #d9d2ff', borderRadius: '12px', padding: '14px 16px' }}>
            <p style={{ fontSize: '0.75rem', color: '#3a1d8a', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Kode baru — salin sekarang, tidak ditampilkan lagi
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <code style={{ flex: 1, fontSize: '0.82rem', wordBreak: 'break-all', color: '#1E0A5E', fontFamily: 'ui-monospace, Menlo, monospace' }}>{freshCode}</code>
              <button onClick={copyCode} style={{ ...btnPrimary, padding: '7px 12px' }}>
                {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Tersalin' : 'Salin'}
              </button>
            </div>
          </div>
        )}

        {tokens.length > 0 && (
          <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tokens.map((t) => (
              <div key={t._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8f9ff', borderRadius: '10px', fontSize: '0.82rem', opacity: t.revokedAt ? 0.5 : 1 }}>
                <div>
                  <b>{t.label}</b> <span style={{ color: '#999' }}>· AZK1-{t.hint}…</span>
                  <p style={{ fontSize: '0.72rem', color: '#777683' }}>
                    {t.createdBy?.name || '—'} · {t.revokedAt ? 'dicabut' : t.lastUsedAt ? `dipakai ${new Date(t.lastUsedAt).toLocaleDateString('id-ID')}` : 'belum dipakai'}
                  </p>
                </div>
                {!t.revokedAt && (
                  <button onClick={() => revoke(t._id)} title="Cabut" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ba1a1a', display: 'flex' }}>
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '4px' }}>
          <p style={h2}>KOL Radar</p>
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['all', 'true', 'false'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setLinkedFilter(v)}
                style={{
                  padding: '5px 12px', borderRadius: '999px', border: '1px solid #ddd9ec', cursor: 'pointer',
                  fontSize: '0.75rem', fontFamily: f, fontWeight: 600,
                  background: linkedFilter === v ? '#6728e4' : 'white', color: linkedFilter === v ? 'white' : '#777683',
                }}
              >
                {v === 'all' ? 'Semua' : v === 'true' ? 'Sudah di DB' : 'Prospek'}
              </button>
            ))}
            <button onClick={() => loadRadar()} title="Muat ulang" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6728e4', display: 'flex', alignItems: 'center', padding: '0 4px' }}>
              <RefreshCw size={15} />
            </button>
          </div>
        </div>
        <p style={sub}>Semua tarikan metrik profil dari ekstensi, satu baris per akun (snapshot terbaru).</p>

        {radar.length === 0 ? (
          <p style={{ color: '#777683', fontSize: '0.85rem' }}>Belum ada tarikan metrik.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#777683', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '8px 10px' }}></th>
                  <th style={{ padding: '8px 10px' }}>Akun</th>
                  <th style={{ padding: '8px 10px' }}>Followers</th>
                  <th style={{ padding: '8px 10px' }}>ER</th>
                  <th style={{ padding: '8px 10px' }}>Avg likes</th>
                  <th style={{ padding: '8px 10px' }}>Post</th>
                  <th style={{ padding: '8px 10px' }}>Snapshot</th>
                  <th style={{ padding: '8px 10px' }}>Status</th>
                  <th style={{ padding: '8px 10px' }}></th>
                </tr>
              </thead>
              <tbody>
                {radar.map((r) => {
                  const Icon = platformIcons[r.platform];
                  const key = `${r.platform}:${r.username}`;
                  const open = expanded === key;
                  return (
                    <Fragment key={key}>
                      <tr style={{ borderTop: '1px solid #eee', cursor: 'pointer' }} onClick={() => setExpanded(open ? null : key)}>
                        <td style={{ padding: '10px', color: '#999' }}>{open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</td>
                        <td style={{ padding: '10px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                            {Icon && <Icon size={14} />}
                            {r.profileUrl ? (
                              <a href={r.profileUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ color: '#6728e4', textDecoration: 'none', fontWeight: 700 }}>
                                @{r.username} <ExternalLink size={10} />
                              </a>
                            ) : <b>@{r.username}</b>}
                          </span>
                          {(r.displayName || r.niche) && (
                            <span style={{ color: '#999', fontSize: '0.75rem' }}>
                              {r.displayName}{r.displayName && r.niche ? ' · ' : ''}{r.niche}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '10px' }}>
                          {r.followers?.toLocaleString('id-ID') ?? '—'}
                          {r.followersDelta != null && r.followersDelta !== 0 && (
                            <span style={{ color: r.followersDelta > 0 ? '#065F46' : '#ba1a1a', fontSize: '0.72rem', marginLeft: '4px' }}>
                              {r.followersDelta > 0 ? '+' : ''}{r.followersDelta.toLocaleString('id-ID')}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '10px' }}>{r.engagementRate != null ? `${r.engagementRate}%` : '—'}</td>
                        <td style={{ padding: '10px' }}>{r.avgLikes != null ? Math.round(r.avgLikes).toLocaleString('id-ID') : '—'}</td>
                        <td style={{ padding: '10px' }}>{r.postsCount != null ? r.postsCount.toLocaleString('id-ID') : '—'}</td>
                        <td style={{ padding: '10px' }}>{r.snapshotCount}× · {new Date(r.capturedAt).toLocaleDateString('id-ID')}</td>
                        <td style={{ padding: '10px' }}>
                          {r.creator ? (
                            <Link to={`/admin/creators/${r.creator._id}`} onClick={(e) => e.stopPropagation()} style={{ color: '#065F46', textDecoration: 'none', fontWeight: 700 }}>{r.creator.name}</Link>
                          ) : (
                            <span style={{ color: '#b45309', fontWeight: 700 }}>Prospek</span>
                          )}
                        </td>
                        <td style={{ padding: '10px' }} onClick={(e) => e.stopPropagation()}>
                          {!r.creator && <LinkProspect snapshotId={r.latestSnapshotId} onDone={loadRadar} setError={setError} />}
                        </td>
                      </tr>
                      {open && (
                        <tr>
                          <td colSpan={9} style={{ padding: '4px 10px 18px', background: '#fbfbff' }}>
                            <SnapshotDetail s={r} />
                            <button
                              onClick={() => removeRadar(r.platform, r.username)}
                              style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'none', border: '1px solid #ffdad6', color: '#ba1a1a', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: f }}
                            >
                              <Trash2 size={12} /> Hapus dari radar
                            </button>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function LinkProspect({ snapshotId, onDone, setError }: { snapshotId: string; onDone: () => void; setError: (s: string) => void }) {
  const [open, setOpen] = useState(false);
  const [creators, setCreators] = useState<{ _id: string; name: string }[]>([]);
  const [sel, setSel] = useState('');
  const [busy, setBusy] = useState(false);

  const openPicker = async () => {
    setOpen(true);
    if (creators.length === 0) {
      try {
        const res = await api.get('/admin/creators');
        setCreators(res.data.map((c: { _id: string; name: string }) => ({ _id: c._id, name: c.name })));
      } catch { /* ignore */ }
    }
  };

  const doLink = async () => {
    if (!sel) return;
    setBusy(true);
    try {
      await api.post(`/admin/extension/snapshots/${snapshotId}/link`, { creatorId: sel });
      setOpen(false);
      onDone();
    } catch (e) {
      setError(errMsg(e, 'Gagal menautkan'));
    } finally { setBusy(false); }
  };

  if (!open) {
    return <button onClick={openPicker} style={{ fontSize: '0.75rem', color: '#6728e4', background: 'none', border: '1px solid #6728e4', borderRadius: '8px', padding: '4px 10px', cursor: 'pointer', fontWeight: 700 }}>Tautkan</button>;
  }
  return (
    <span style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
      <select value={sel} onChange={(e) => setSel(e.target.value)} style={{ fontSize: '0.78rem', padding: '4px 6px', borderRadius: '7px', border: '1px solid #ddd9ec', maxWidth: '150px' }}>
        <option value="">Pilih creator…</option>
        {creators.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
      <button onClick={doLink} disabled={busy || !sel} style={{ fontSize: '0.75rem', color: 'white', background: '#6728e4', border: 'none', borderRadius: '7px', padding: '5px 10px', cursor: 'pointer', fontWeight: 700 }}>OK</button>
      <button onClick={() => setOpen(false)} style={{ fontSize: '0.75rem', color: '#777683', background: 'none', border: 'none', cursor: 'pointer' }}>batal</button>
    </span>
  );
}
