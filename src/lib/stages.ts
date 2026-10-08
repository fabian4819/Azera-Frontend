/** Progress campaign (server: WORKFLOW_STAGES di campaign.model.ts). `rejected` di luar urutan. */
export const STAGE_ORDER = ['listing', 'running', 'insight', 'report', 'completed'] as const;
export const STAGE_LABELS: Record<string, string> = {
  listing: 'Listing', running: 'Running', insight: 'Insight', report: 'Report', completed: 'Completed', rejected: 'Ditolak',
};
/** Label tahap; nama lama (riwayat 17 tahap) ditampilkan apa adanya tanpa underscore. */
export const stageLabel = (stage: string) => STAGE_LABELS[stage] ?? stage.replace(/_/g, ' ');
