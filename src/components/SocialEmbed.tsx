import { useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { SiInstagram, SiTiktok } from 'react-icons/si';

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

function loadScriptOnce(src: string, id: string, onLoad: () => void) {
  const existing = document.getElementById(id) as HTMLScriptElement | null;
  if (existing) {
    onLoad();
    return;
  }
  const script = document.createElement('script');
  script.id = id;
  script.src = src;
  script.async = true;
  script.onload = onLoad;
  document.body.appendChild(script);
}

/**
 * Embed resmi Instagram/TikTok (oEmbed publik, gratis, tanpa API key) — sistem
 * ini tidak punya penyimpanan video sendiri, jadi "video creator" berarti
 * postingan aslinya di-embed langsung dari platform. Lihat docs/plan section AD-49.
 */
// TikTok embed.js butuh data-video-id eksplisit dan cite tanpa query string tambahan
// (?is_from_webapp=1 dll) — tanpa ini widget-nya gagal resolve dan jatuh ke fallback "unavailable".
function tiktokVideoId(url: string) {
  return url.match(/\/video\/(\d+)/)?.[1];
}
function cleanTiktokUrl(url: string) {
  const id = tiktokVideoId(url);
  const author = url.match(/tiktok\.com\/(@[^/]+)/)?.[1];
  return author && id ? `https://www.tiktok.com/${author}/video/${id}` : url;
}

export default function SocialEmbed({ platform, url }: { platform: 'instagram' | 'tiktok'; url: string }) {
  useEffect(() => {
    if (platform === 'instagram') {
      loadScriptOnce('https://www.instagram.com/embed.js', 'ig-embed-script', () => {
        window.instgrm?.Embeds.process();
      });
    } else {
      // TikTok embed.js men-scan blockquote baru saat script tag di-append —
      // tidak ada API reprocess resmi, jadi tag script disisipkan ulang tiap render.
      const s = document.createElement('script');
      s.src = 'https://www.tiktok.com/embed.js';
      s.async = true;
      document.body.appendChild(s);
      return () => { s.remove(); };
    }
  }, [platform, url]);

  return (
    <div style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', minHeight: '260px', minWidth: '326px', display: 'flex', flexDirection: 'column' }}>
      {platform === 'instagram' ? (
        <blockquote
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          style={{ background: '#fff', border: 0, margin: 0, width: '100%', minWidth: '326px' }}
        />
      ) : (
        <blockquote
          className="tiktok-embed"
          cite={cleanTiktokUrl(url)}
          data-video-id={tiktokVideoId(url)}
          style={{ margin: 0, width: '100%', minWidth: '325px', maxWidth: '605px' }}
        >
          <section />
        </blockquote>
      )}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          padding: '10px', fontSize: '0.76rem', fontWeight: 600, color: 'var(--secondary)',
          background: 'var(--surface-container)', textDecoration: 'none', marginTop: 'auto',
        }}
      >
        {platform === 'instagram' ? <SiInstagram size={12} /> : <SiTiktok size={12} />}
        Buka postingan asli <ExternalLink size={11} />
      </a>
    </div>
  );
}
