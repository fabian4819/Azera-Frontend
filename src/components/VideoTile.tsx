import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { SiInstagram, SiTiktok } from 'react-icons/si';
import { videoTile as tile, type TopCreator } from '../lib/portfolio';

// Tombol kecil pojok kanan atas: tidak menutupi tombol play (tengah) & kontrol player (bawah)
function OpenPostLink({ creator }: { creator: TopCreator }) {
  const Icon = creator.platform === 'instagram' ? SiInstagram : SiTiktok;
  return (
    <a
      href={creator.postLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Buka postingan ${creator.name} di ${creator.platform === 'instagram' ? 'Instagram' : 'TikTok'}`}
      title="Buka postingan asli"
      style={{
        position: 'absolute', top: '8px', right: '8px', zIndex: 2, display: 'flex', alignItems: 'center', gap: '4px',
        padding: '5px 8px', borderRadius: '999px', background: 'rgba(0,0,0,0.6)', color: '#fff', textDecoration: 'none',
        backdropFilter: 'blur(4px)',
      }}
    >
      <Icon size={12} />
      <ExternalLink size={11} />
    </a>
  );
}

const IG_WIDTH = 326; // lebar minimum embed Instagram
const IG_HEADER = 54; // tinggi header username di embed IG
const IG_MEDIA_H = (IG_WIDTH * 5) / 4; // reel ditampilkan IG dalam kotak 4:5 dengan bar hitam kiri-kanan

/** Preview kecil postingan asli. TikTok: player resmi /player/v1 (ukuran bebas, hanya video).
 * Instagram: tidak punya player kecil & thumbnail butuh token API, jadi embed-nya dirender
 * di lebar minimum lalu diperkecil dengan CSS scale. */
export default function VideoTile({ creator }: { creator: TopCreator }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tileW, setTileW] = useState(0);
  const url = creator.postLink!;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setTileW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (creator.platform === 'tiktok') {
    const id = url.match(/\/video\/(\d+)/)?.[1];
    if (id) {
      const params = 'controls=1&progress_bar=0&volume_control=0&fullscreen_button=1&timestamp=0&music_info=0&description=0&rel=0&native_context_menu=0&closed_caption=0';
      return (
        <div style={tile}>
          <iframe src={`https://www.tiktok.com/player/v1/${id}?${params}`} title={`Video ${creator.name}`} allow="fullscreen; encrypted-media" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
          <OpenPostLink creator={creator} />
        </div>
      );
    }
  }
  const code = url.match(/instagram\.com\/(?:[^/]+\/)?(?:p|reel|reels|tv)\/([^/?#]+)/)?.[1];
  if (!code) return null;
  // perbesar sampai kotak media 4:5 setinggi tile 9:16, lalu geser ke tengah:
  // header, bar hitam, dan footer "View more on Instagram" terpotong, sisa videonya saja
  const scale = (tileW * 16) / 9 / IG_MEDIA_H;
  const offsetX = (IG_WIDTH * scale - tileW) / 2;
  return (
    <div ref={ref} style={tile}>
      <iframe
        src={`https://www.instagram.com/reel/${code}/embed/`}
        title={`Video ${creator.name}`}
        scrolling="no"
        style={{
          position: 'absolute', top: 0, left: 0, border: 0, width: `${IG_WIDTH}px`, height: `${IG_HEADER + IG_MEDIA_H + 200}px`,
          transform: `translateX(${-offsetX}px) scale(${scale}) translateY(-${IG_HEADER}px)`, transformOrigin: 'top left',
          visibility: tileW ? 'visible' : 'hidden',
        }}
      />
      <OpenPostLink creator={creator} />
    </div>
  );
}
