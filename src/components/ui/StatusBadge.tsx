interface StatusBadgeProps {
  status: string;
}

const statusMap: Record<string, { label: string; bg: string; color: string }> = {
  new: { label: 'Baru', bg: '#FEE2E2', color: '#B91C1C' },
  reviewed: { label: 'Ditinjau', bg: '#FEF3C7', color: '#92400E' },
  contacted: { label: 'Dihubungi', bg: '#D1FAE5', color: '#065F46' },
  pending: { label: 'Menunggu', bg: '#F3F4F6', color: '#4B5563' },
  reviewing: { label: 'Dikurasi', bg: '#DBEAFE', color: '#1E40AF' },
  approved: { label: 'Disetujui', bg: '#D1FAE5', color: '#065F46' },
  rejected: { label: 'Ditolak', bg: '#FEE2E2', color: '#B91C1C' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusMap[status] || { label: status, bg: '#F3F4F6', color: '#4B5563' };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: config.bg,
        color: config.color,
        borderRadius: '999px',
        padding: '3px 10px',
        fontSize: '0.75rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {config.label}
    </span>
  );
}
