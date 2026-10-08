import { Table2, BarChart3, Wallet, UserCheck } from 'lucide-react';

/** 4 sheet per campaign, dipakai tab di CampaignSheet & tombol di kartu CampaignDashboard. */
export type SheetKind = 'master' | 'report' | 'recap' | 'applicants';

export const SHEET_TABS: { kind: SheetKind; label: string; hint: string; empty: string; icon: typeof Table2 }[] = [
  { kind: 'master', label: 'Master Sheet', icon: Table2, hint: 'Sel kuning bisa diedit langsung. Atur/hapus kolom lewat ikon di header, tambah kolom lewat tombol + di ujung kanan.', empty: 'Belum ada creator yang di-approve. Approve pendaftar di tab Pendaftar supaya masuk ke sini.' },
  { kind: 'report', label: 'Report', icon: BarChart3, hint: 'Performa tiap konten yang sudah tayang. Total ada di baris paling bawah.', empty: 'Belum ada konten tayang (submission tipe post).' },
  { kind: 'recap', label: 'Recap Payment', icon: Wallet, hint: 'Creator yang diterima, data rekening, fee, dan status pembayaran.', empty: 'Belum ada creator yang diterima.' },
  { kind: 'applicants', label: 'Pendaftar', icon: UserCheck, hint: 'Approve = creator dapat link dashboard campaign lewat WhatsApp & email.', empty: 'Belum ada yang mendaftar.' },
];
