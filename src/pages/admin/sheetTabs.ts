import { Table2, BarChart3, Wallet } from 'lucide-react';

/** 3 sheet per campaign — dipakai tab di CampaignSheet & tombol di kartu CampaignDashboard. */
export type SheetKind = 'master' | 'report' | 'recap';

export const SHEET_TABS: { kind: SheetKind; label: string; hint: string; empty: string; icon: typeof Table2 }[] = [
  { kind: 'master', label: 'Master Sheet', icon: Table2, hint: 'Semua pendaftar campaign + submission terbaru tiap creator.', empty: 'Belum ada creator yang mendaftar.' },
  { kind: 'report', label: 'Report', icon: BarChart3, hint: 'Performa tiap konten yang sudah tayang. Total ada di baris paling bawah.', empty: 'Belum ada konten tayang (submission tipe post).' },
  { kind: 'recap', label: 'Recap Payment', icon: Wallet, hint: 'Creator yang diterima, data rekening, fee, dan status pembayaran.', empty: 'Belum ada creator yang diterima.' },
];
