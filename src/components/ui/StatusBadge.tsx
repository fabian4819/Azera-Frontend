interface StatusBadgeProps {
  status: string;
}

const statusMap: Record<string, { label: string; bg: string; color: string }> = {
  new:       { label: 'Baru',     bg: '#ffdad6', color: '#ba1a1a' },
  reviewed:  { label: 'Ditinjau', bg: '#fef3c7', color: '#92400E' },
  contacted: { label: 'Dihubungi', bg: '#d1fae5', color: '#065F46' },
  pending:   { label: 'Menunggu', bg: '#eceef3', color: '#464652' },
  reviewing: { label: 'Dikurasi', bg: '#e1e0ff', color: '#15157d' },
  approved:  { label: 'Disetujui', bg: '#d1fae5', color: '#065F46' },
  rejected:  { label: 'Ditolak',  bg: '#ffdad6', color: '#ba1a1a' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusMap[status] || { label: status, bg: '#eceef3', color: '#464652' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', background: config.bg, color: config.color,
      borderRadius: '999px', padding: '4px 12px', fontSize: '0.72rem',
      fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '0.04em',
    }}>
      {config.label}
    </span>
  );
}
