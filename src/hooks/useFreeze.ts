import { useState } from 'react';

/** Bekukan N kolom pertama & N baris pertama tabel, ala Google Sheets (Lihat → Bekukan). */
export interface Freeze { cols: number; rows: number }

const read = (key: string, fallback: Freeze): Freeze => {
  try {
    const v = JSON.parse(localStorage.getItem(key) || 'null');
    return v && Number.isInteger(v.cols) && Number.isInteger(v.rows) ? v : fallback;
  } catch {
    return fallback;
  }
};

/** Pilihan bekukan disimpan per tabel di browser (localStorage), jadi tetap sama saat halaman dibuka lagi. */
export function useFreeze(storageKey: string, fallback: Freeze = { cols: 1, rows: 0 }) {
  const key = `freeze:${storageKey}`;
  // Disimpan bersama key-nya: komponen yang sama bisa ganti tabel (mis. pindah tab), langsung baca pilihan tabel itu
  const [state, setState] = useState(() => ({ key, value: read(key, fallback) }));
  const freeze = state.key === key ? state.value : read(key, fallback);
  const setFreeze = (next: Freeze) => {
    setState({ key, value: next });
    try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* mode privat: cukup di memori */ }
  };
  return [freeze, setFreeze] as const;
}

