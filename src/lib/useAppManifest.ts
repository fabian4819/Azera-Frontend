import { useEffect } from 'react';

/** Ganti manifest PWA selama halaman ini terbuka, supaya "Add to Home Screen" dari dashboard admin/PIC
 * membuka dashboard itu (bukan landing page). Kembali ke manifest utama saat keluar. */
export function useAppManifest(href: string) {
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
    if (!link) return;
    const prev = link.getAttribute('href');
    link.setAttribute('href', href);
    return () => { if (prev) link.setAttribute('href', prev); };
  }, [href]);
}
