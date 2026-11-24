import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';

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
 * Embed resmi Instagram/TikTok/Threads (oEmbed publik, gratis, tanpa API key), sistem
 * ini tidak punya penyimpanan video sendiri, jadi "video creator" berarti
 * postingan aslinya di-embed langsung dari platform. Lihat docs/plan section AD-49.
 */
// ≈ tinggi embed IG yang sudah dipotong sampai baris likes (.ig-embed-crop) di lebar 340px, supaya
// kartu IG & TikTok sejajar. Embed TikTok aslinya ±740px, sisa bawah (caption & nama musik) ikut terpotong.
const TIKTOK_H = 590;

function tiktokVideoId(url: string) {
  return url.match(/\/video\/(\d+)/)?.[1];
}

// Embed resmi Threads = halaman "<link post>/embed" (yang juga dipakai embed.js Threads), langsung sebagai iframe
function threadsEmbedUrl(url: string) {
  const m = url.match(/threads\.(?:net|com)\/(@[^/?#]+\/post\/[^/?#]+)/i);
  return m ? `https://www.threads.com/${m[1]}/embed/` : undefined;
}

export default function SocialEmbed({ platform: savedPlatform, url, thumb }: { platform: 'instagram' | 'tiktok'; url: string; thumb?: string }) {
  // TikTok dengan cover: tampil cover + tombol play dulu, player baru dimuat saat diklik. Player TikTok gagal
  // ("Unable to load player") di browser yang memblokir cookie pihak ketiga, cover & link tetap terlihat.
  const [playing, setPlaying] = useState(false);
  // Link adalah sumber kebenaran, pilihan platform di admin bisa salah (default-nya Instagram),
  // dan link TikTok yang dirender sebagai embed IG cuma jadi kotak putih kosong.
  const threadsSrc = threadsEmbedUrl(url);
  const platform = threadsSrc ? 'threads' : /tiktok\.com/i.test(url) ? 'tiktok' : /instagram\.com/i.test(url) ? 'instagram' : savedPlatform;
  useEffect(() => {
    if (platform !== 'instagram') return;
    loadScriptOnce('https://www.instagram.com/embed.js', 'ig-embed-script', () => {
      window.instgrm?.Embeds.process();
    });
  }, [platform, url]);

  return (
    // Tinggi DIKUNCI (= tinggi akhir embed) + clip-path, dan latar TikTok hitam seperti player-nya: embed.js IG
    // sempat membuat iframe ±1900px lebar & ±2600px tinggi sebelum merapikan ukurannya, tanpa ini kartu
    // ikut melar sesaat dan muncul garis putih panjang di luar kartu.
    <div style={{ background: platform === 'tiktok' ? '#000' : 'var(--surface)', borderRadius: '14px', overflow: 'hidden', clipPath: 'inset(0 round 14px)', height: `${TIKTOK_H}px`, minWidth: '326px', display: 'flex', flexDirection: 'column' }}>
      {platform === 'threads' ? (
        <iframe
          src={threadsSrc}
          title="Threads post"
          loading="lazy"
          style={{ width: '100%', minWidth: '325px', height: `${TIKTOK_H}px`, border: 0, display: 'block', background: '#fff' }}
        />
      ) : platform === 'instagram' ? (
        // Wrapper memotong baris "Add a comment..." di bawah embed IG (lihat .ig-embed-crop di index.css)
        <div className="ig-embed-crop">
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={url}
            data-instgrm-version="14"
            style={{ background: 'var(--surface)', border: 0, margin: 0, width: '100%', minWidth: '326px' }}
          />
        </div>
      ) : thumb && !playing ? (
        <div style={{ position: 'relative', height: `${TIKTOK_H}px` }}>
          <button type="button" onClick={() => setPlaying(true)} aria-label="Putar video TikTok"
            style={{ position: 'absolute', inset: 0, border: 0, padding: 0, cursor: 'pointer', background: `#000 center / cover no-repeat url(${thumb})` }}>
            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Play size={30} color="#fff" fill="#fff" />
            </span>
          </button>
          <a href={url} target="_blank" rel="noopener noreferrer"
            style={{ position: 'absolute', left: '12px', bottom: '12px', padding: '6px 12px', borderRadius: '999px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.74rem', fontWeight: 700, fontFamily: 'var(--font-display)', textDecoration: 'none' }}>
            Tonton di TikTok ↗
          </a>
        </div>
      ) : (
        // Player resmi player/v1, BUKAN embed.js / embed/v2: keduanya kena rate-limit TikTok
        // ("overload-protect triggered", HTTP 503), embed/v2 terkonfirmasi 503 sementara player/v1 tetap 200.
        // Atribut `allow` disamakan dengan iframe dari oEmbed resmi TikTok: dengan izin yang lebih sempit
        // player bisa gagal jalan ("Unable to load player") walau videonya bisa di-embed.
        <iframe
          src={`https://www.tiktok.com/player/v1/${tiktokVideoId(url)}?rel=0&music_info=1&description=1${playing ? '&autoplay=1' : ''}`}
          title="TikTok video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ width: '100%', minWidth: '325px', height: `${TIKTOK_H}px`, border: 0, display: 'block' }}
        />
      )}
    </div>
  );
}
