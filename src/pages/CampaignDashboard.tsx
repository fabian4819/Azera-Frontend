import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import api from '../lib/api';

const f = "var(--font-display)";

interface Social { platform: string; username: string; followers: number }
interface CreatorInfo {
  _id: string; name: string; phone: string;
  domicile?: { province?: string; city?: string }; socials: Social[]; niches: string[];
  performanceScore?: { overall: number };
}
interface ApplicationRow {
  _id: string; creatorId: CreatorInfo | null; curationResult: string; curationReason?: string; status: string;
}
interface SubmissionRow {
  _id: string; creatorId: string; type: string; platform: string; link?: string;
  status: string; revisionCount: number; createdAt: string;
}
interface HistoryRow {
  _id: string; creatorId: string; uploadedOnTime: boolean; revisions: number; violation?: string; createdAt: string;
}
interface DashboardData {
  campaign: {
    name: string; brand?: { namaBrand?: string }; workflowStage: string; status: string;
    budget: number; timeline?: { startDate?: string; endDate?: string };
  };
  applications: ApplicationRow[];
  submissions: SubmissionRow[];
  histories: HistoryRow[];
}

const curationColors: Record<string, { bg: string; color: string; label: string }> = {
  highly_recommended: { bg: '#d1fae5', color: '#065F46', label: 'Highly Recommended' },
  recommended: { bg: '#dbeafe', color: '#1E40AF', label: 'Recommended' },
  need_review: { bg: '#fef3c7', color: '#92400E', label: 'Need Review' },
  rejected: { bg: '#ffdad6', color: '#ba1a1a', label: 'Rejected' },
};
const statusColors: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#eceef3', color: '#464652' },
  accepted: { bg: '#d1fae5', color: '#065F46' },
  rejected: { bg: '#ffdad6', color: '#ba1a1a' },
};
const submissionStatusColors: Record<string, { bg: string; color: string }> = {
  submitted: { bg: '#dbeafe', color: '#1E40AF' },
  approved: { bg: '#d1fae5', color: '#065F46' },
  revision_requested: { bg: '#fef3c7', color: '#92400E' },
};

const th: React.CSSProperties = {
  textAlign: 'left', padding: '10px 14px', fontSize: '0.7rem', fontFamily: f,
  fontWeight: 700, color: '#777683', textTransform: 'uppercase', letterSpacing: '0.04em',
  borderBottom: '1.5px solid #e1e0ff', whiteSpace: 'nowrap', position: 'sticky', top: 0, background: 'white',
};
const td: React.CSSProperties = {
  padding: '10px 14px', fontSize: '0.82rem', color: '#191c20', borderBottom: '1px solid #eceef3', whiteSpace: 'nowrap',
};

export default function CampaignDashboard() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code') || '';
  const [data, setData] = useState<DashboardData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/campaigns/${id}/dashboard`, { params: { code } })
      .then((res) => setData(res.data))
      .catch(() => setNotFound(true));
  }, [id, code]);

  const rows = useMemo(() => {
    if (!data) return [];
    return data.applications.map((a) => {
      const creatorId = a.creatorId?._id;
      const creatorSubmissions = data.submissions
        .filter((s) => s.creatorId === creatorId)
        .sort((x, y) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime());
      const latestSubmission = creatorSubmissions[0];
      const creatorHistories = data.histories.filter((h) => h.creatorId === creatorId);
      const totalRevisions = creatorSubmissions.reduce((sum, s) => sum + (s.revisionCount || 0), 0);
      return { application: a, latestSubmission, historyCount: creatorHistories.length, totalRevisions };
    });
  }, [data]);

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9ff' }}>
        <p style={{ fontFamily: f, color: '#464652' }}>Dashboard tidak ditemukan. Link atau kode akses salah.</p>
      </div>
    );
  }
  if (!data) return <div style={{ minHeight: '100vh', background: '#f8f9ff' }} />;

  return (
    <div style={{ background: '#f8f9ff', minHeight: '100vh', padding: '32px 24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div>
            <p style={{ fontFamily: f, fontWeight: 900, fontStyle: 'italic', fontSize: '1.1rem', color: '#15157d', marginBottom: '8px' }}>AZERAKOL</p>
            <h1 style={{ fontFamily: f, fontWeight: 800, fontSize: '1.5rem', color: '#191c20' }}>{data.campaign.name}</h1>
            <p style={{ fontFamily: f, fontSize: '0.82rem', color: '#777683' }}>{data.campaign.brand?.namaBrand} · Budget Rp{data.campaign.budget.toLocaleString('id-ID')}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ background: '#e1e0ff', color: '#6728e4', borderRadius: '999px', padding: '5px 14px', fontSize: '0.75rem', fontWeight: 700 }}>
              {data.campaign.workflowStage.replace(/_/g, ' ')}
            </span>
            <span style={{ background: '#eceef3', color: '#464652', borderRadius: '999px', padding: '5px 14px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'capitalize' }}>
              {data.campaign.status}
            </span>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e1e0ff', boxShadow: '0 2px 12px rgba(107,46,232,0.05)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 14px 0' }}>
            <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.9rem', color: '#191c20' }}>
              Pendaftar & Progress ({rows.length})
            </p>
          </div>
          <div style={{ overflowX: 'auto', maxHeight: '75vh', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr>
                  <th style={th}>Creator</th>
                  <th style={th}>WA</th>
                  <th style={th}>Domisili</th>
                  <th style={th}>Skor</th>
                  <th style={th}>Kurasi</th>
                  <th style={th}>Status Apply</th>
                  <th style={th}>Submission Terakhir</th>
                  <th style={th}>Status Submission</th>
                  <th style={th}>Total Revisi</th>
                  <th style={th}>Update Terakhir</th>
                  <th style={th}>Link</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={11} style={{ ...td, textAlign: 'center', color: '#777683', padding: '32px' }}>Belum ada pendaftar.</td></tr>
                ) : rows.map(({ application: a, latestSubmission, totalRevisions }) => {
                  const cc = curationColors[a.curationResult] || curationColors.need_review;
                  const sc = statusColors[a.status] || statusColors.pending;
                  const ssc = latestSubmission ? (submissionStatusColors[latestSubmission.status] || submissionStatusColors.submitted) : null;
                  return (
                    <tr key={a._id}>
                      <td style={{ ...td, fontWeight: 600 }}>{a.creatorId?.name || 'Creator dihapus'}</td>
                      <td style={td}>{a.creatorId?.phone || '—'}</td>
                      <td style={td}>{a.creatorId?.domicile?.province || '—'}</td>
                      <td style={td}>{a.creatorId?.performanceScore?.overall ?? '—'}</td>
                      <td style={td}><span style={{ background: cc.bg, color: cc.color, borderRadius: '999px', padding: '3px 10px', fontSize: '0.7rem', fontWeight: 700 }}>{cc.label}</span></td>
                      <td style={td}><span style={{ background: sc.bg, color: sc.color, borderRadius: '999px', padding: '3px 10px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'capitalize' }}>{a.status}</span></td>
                      <td style={{ ...td, textTransform: 'capitalize' }}>{latestSubmission ? `${latestSubmission.type} (${latestSubmission.platform})` : '—'}</td>
                      <td style={td}>
                        {latestSubmission && ssc ? (
                          <span style={{ background: ssc.bg, color: ssc.color, borderRadius: '999px', padding: '3px 10px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'capitalize' }}>
                            {latestSubmission.status.replace('_', ' ')}
                          </span>
                        ) : '—'}
                      </td>
                      <td style={td}>{totalRevisions}</td>
                      <td style={td}>{latestSubmission ? new Date(latestSubmission.createdAt).toLocaleDateString('id-ID') : '—'}</td>
                      <td style={td}>
                        {latestSubmission?.link ? (
                          <a href={latestSubmission.link} target="_blank" rel="noopener noreferrer" style={{ color: '#6728e4', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ExternalLink size={13} /> Buka
                          </a>
                        ) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p style={{ fontFamily: f, fontSize: '0.72rem', color: '#8a8a99', marginTop: '14px', textAlign: 'center' }}>
          Dashboard read-only untuk PIC & Handle-by campaign ini. Data diperbarui otomatis mengikuti sistem.
        </p>
      </div>
    </div>
  );
}
