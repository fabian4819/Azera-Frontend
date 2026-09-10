import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// SPA tidak me-reset scroll saat pindah route (tidak ada full page load),
// jadi kita paksa balik ke atas setiap kali pathname berubah.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
