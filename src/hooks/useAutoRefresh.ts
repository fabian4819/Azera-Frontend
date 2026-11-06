import { useEffect, useRef } from 'react';

/**
 * Muat ulang diam-diam tiap `ms` selama tab terlihat, plus langsung saat balik ke tab/jendela ini
 * (mis. habis kirim /invoice di WhatsApp), supaya data dari luar web muncul tanpa refresh manual.
 */
export function useAutoRefresh(load: () => unknown, ms = 30_000) {
  const loadRef = useRef(load);
  useEffect(() => { loadRef.current = load; }, [load]);

  useEffect(() => {
    let last = Date.now();
    const tick = () => {
      // focus + visibilitychange sering datang barengan → cukup sekali
      if (document.visibilityState !== 'visible' || Date.now() - last < 2_000) return;
      last = Date.now();
      loadRef.current();
    };
    const id = window.setInterval(tick, ms);
    document.addEventListener('visibilitychange', tick);
    window.addEventListener('focus', tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', tick);
      window.removeEventListener('focus', tick);
    };
  }, [ms]);
}
