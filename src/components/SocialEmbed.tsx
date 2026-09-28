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
function tiktokVideoId(url: string) {
  return url.match(/\/video\/(\d+)/)?.[1];
}

export default function SocialEmbed({ platform, url }: { platform: 'instagram' | 'tiktok'; url: string }) {
  useEffect(() => {
    if (platform !== 'instagram') return;
    loadScriptOnce('https://www.instagram.com/embed.js', 'ig-embed-script', () => {
      window.instgrm?.Embeds.process();
    });
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
        // iframe embed/v2 langsung, BUKAN embed.js: embed.js harus disisipkan ulang tiap render
        // (tidak ada API reprocess) dan request berulangnya memicu "overload-protect triggered" dari TikTok.
        <iframe
          src={`https://www.tiktok.com/embed/v2/${tiktokVideoId(url)}`}
          title="TikTok video"
          loading="lazy"
          allow="encrypted-media; fullscreen"
          style={{ width: '100%', minWidth: '325px', height: '740px', border: 0, display: 'block' }}
        />
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
