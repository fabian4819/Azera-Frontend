import { useCallback, useEffect, useState } from 'react';

/** State tampilan tabel (urutan/filter/kolom) + riwayat buat Undo (tombol & Ctrl/⌘+Z), ala Sheets. */
export function useViewHistory<T>(initial: T) {
  const [h, setH] = useState({ cur: initial, past: [] as T[] });
  const set = useCallback((next: T | ((v: T) => T)) => setH((s) => {
    const cur = typeof next === 'function' ? (next as (v: T) => T)(s.cur) : next;
    return cur === s.cur ? s : { cur, past: [...s.past.slice(-49), s.cur] };
  }), []);
  const undo = useCallback(() => setH((s) => (s.past.length ? { cur: s.past[s.past.length - 1], past: s.past.slice(0, -1) } : s)), []);
  const canUndo = h.past.length > 0;

  useEffect(() => {
    if (!canUndo) return;
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.shiftKey || e.key.toLowerCase() !== 'z') return;
      // Ctrl+Z di kotak teks tetap undo ketikan bawaan browser
      if ((e.target as HTMLElement).closest?.('input:not([type=checkbox]):not([type=radio]), textarea, select, [contenteditable="true"]')) return;
      e.preventDefault();
      undo();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [canUndo, undo]);

  return [h.cur, set, undo, canUndo] as const;
}
