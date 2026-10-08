import { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import CampaignBoard, { BoardMessage, type BoardView } from '../components/CampaignBoard';

/**
 * Dashboard campaign via link + kode (tanpa login), kolom sama dengan dashboard creator.
 * PIC (/campaign-dashboard/:id?code=accessCode): lihat saja.
 * Client (/client-dashboard/:id?code=clientAccessCode): lihat + approve/revisi draft & posting.
 */
export default function CampaignDashboard({ audience = 'pic' }: { audience?: 'pic' | 'client' }) {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const code = params.get('code') ?? '';
  const [view, setView] = useState<BoardView | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const path = audience === 'client' ? 'client' : 'dashboard';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/campaigns/${id}/${path}`, { params: { code } });
      setView(res.data);
      setError('');
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      setError(status === 404 ? 'Link dashboard tidak valid. Minta link terbaru ke tim AzeraKOL.' : 'Data gagal dimuat. Coba muat ulang.');
    } finally {
      setLoading(false);
    }
  }, [id, path, code]);

  useEffect(() => {
    const t = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(t);
  }, [load]);

  const review = async (row: number, type: 'draft' | 'post', status: 'approved' | 'revision_requested', notes?: string) => {
    await api.patch(`/campaigns/${id}/client/review`, { code, applicationId: view?.rows[row]?.id, type, status, notes });
    await load();
  };

  if (error && !view) return <BoardMessage text={error} />;
  if (!view) return <BoardMessage text="Memuat…" />;
  return <CampaignBoard audience={audience} view={view} loading={loading} onReload={() => void load()} onReview={audience === 'client' ? review : undefined} />;
}
