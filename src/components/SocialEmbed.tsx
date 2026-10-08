import { useEffect } from 'react';

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
 * Embed resmi Instagram/TikTok (oEmbed publik, gratis, tanpa API key), sistem
 * ini tidak punya penyimpanan video sendiri, jadi "video creator" berarti
 * postingan aslinya di-embed langsung dari platform. Lihat docs/plan section AD-49.
 */
// ≈ tinggi embed IG yang sudah dipotong sampai baris likes (.ig-embed-crop) di lebar 340px, supaya
// kartu IG & TikTok sejajar. Embed TikTok aslinya ±740px, sisa bawah (caption & nama musik) ikut terpotong.
const TIKTOK_H = 590;

function tiktokVideoId(url: string) {
  return url.match(/\/video\/(\d+)/)?.[1];
}

export default function SocialEmbed({ platform: savedPlatform, url }: { platform: 'instagram' | 'tiktok'; url: string }) {
  // Link adalah sumber kebenaran, pilihan platform di admin bisa salah (default-nya Instagram),
  // dan link TikTok yang dirender sebagai embed IG cuma jadi kotak putih kosong.
  const platform = /tiktok\.com/i.test(url) ? 'tiktok' : /instagram\.com/i.test(url) ? 'instagram' : savedPlatform;
  useEffect(() => {
    if (platform !== 'instagram') return;
    loadScriptOnce('https://www.instagram.com/embed.js', 'ig-embed-script', () => {
      window.instgrm?.Embeds.process();
    });
  }, [platform, url]);

  return (
    <div style={{ background: '#fff', borderRadius: '14px', overflow: 'hidden', minHeight: '260px', minWidth: '326px', display: 'flex', flexDirection: 'column' }}>
      {platform === 'instagram' ? (
        // Wrapper memotong baris "Add a comment..." di bawah embed IG (lihat .ig-embed-crop di index.css)
        <div className="ig-embed-crop">
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={url}
            data-instgrm-version="14"
            style={{ background: '#fff', border: 0, margin: 0, width: '100%', minWidth: '326px' }}
          />
        </div>
      ) : (
        // Player resmi player/v1, BUKAN embed.js / embed/v2: keduanya kena rate-limit TikTok
        // ("overload-protect triggered", HTTP 503), embed/v2 terkonfirmasi 503 sementara player/v1 tetap 200.
        <iframe
          src={`https://www.tiktok.com/player/v1/${tiktokVideoId(url)}?rel=0`}
          title="TikTok video"
          loading="lazy"
          allow="encrypted-media; fullscreen"
          style={{ width: '100%', minWidth: '325px', height: `${TIKTOK_H}px`, border: 0, display: 'block' }}
        />
      )}
    </div>
  );
}
