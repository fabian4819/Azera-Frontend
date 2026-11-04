/** Skema lolos creator per campaign (server: Campaign.approvalFlow) */
export type ApprovalFlow = 'two_step' | 'client_only';
export const APPROVAL_FLOW_OPTIONS: { value: ApprovalFlow; label: string; desc: string }[] = [
  { value: 'two_step', label: '2 tahap: kurasi admin → client', desc: 'Pendaftar dikurasi dulu oleh admin di tab Pendaftar, yang di-approve diteruskan ke Listing client untuk diputuskan.' },
  { value: 'client_only', label: 'Langsung ke client', desc: 'Tanpa kurasi admin: semua pendaftar otomatis masuk Listing client, client yang memutuskan. Status di tab Pendaftar ikut keputusan client.' },
];
export const approvalFlowLabel = (f?: ApprovalFlow) => APPROVAL_FLOW_OPTIONS.find((o) => o.value === (f ?? 'two_step'))!.label;
