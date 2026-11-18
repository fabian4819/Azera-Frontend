import { createContext, useContext } from 'react';

/** Modal konfirmasi sebelum tindakan admin yang membuat bot mengirim WA (lihat WaConfirmProvider). */
export interface WaConfirmRequest {
  title: string;
  /** Siapa saja yang akan dikirimi / apa isinya, satu-dua kalimat */
  description: string;
  /** Trigger template WA, untuk default pengirim (pengaturan pengirim campaign) */
  trigger: string;
  campaignId?: string;
  confirmLabel?: string;
}
/** id pengirim yang dipilih, atau null kalau dibatalkan */
export type WaConfirm = (req: WaConfirmRequest) => Promise<string | null>;

export const WaConfirmContext = createContext<WaConfirm | null>(null);

/** Di luar provider (mis. halaman tanpa AdminLayout) langsung lanjut tanpa modal, pengirim ikut pengaturan */
export const useWaConfirm = (): WaConfirm => useContext(WaConfirmContext) ?? (async () => '');

/** Approve creator padahal link grup WA campaign belum diisi: minta link dulu (disimpan ke campaign).
 * true = lanjut (link tersimpan / dilewati), false = batal. */
export type GroupLinkPrompt = (campaignId: string, currentLink?: string) => Promise<boolean>;
export const GroupLinkContext = createContext<GroupLinkPrompt | null>(null);
export const useGroupLinkPrompt = (): GroupLinkPrompt => useContext(GroupLinkContext) ?? (async () => true);
