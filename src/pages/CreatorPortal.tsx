import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import CampaignBoard, { BoardMessage, type BoardView } from '../components/CampaignBoard';

/**
 * Dashboard campaign untuk creator lewat magic link (tanpa login). Tabel sama seperti Master Sheet,
 * kolom yang terlihat & bisa diedit diatur admin; creator cuma bisa mengisi sel di barisnya sendiri.
 */
export default function CreatorPortal() {
  const { token } = useParams<{ token: string }>();
  const [view, setView] = useState<BoardView | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/portal/${token}`);
      setView(res.data);
      setError('');
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      setError(status === 404 ? 'Link tidak valid atau akses kamu sudah dicabut. Hubungi tim AzeraKOL.' : 'Data gagal dimuat. Coba muat ulang.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const t = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(t);
  }, [load]);

  const editCell = async (_row: number, col: number, value: string) => {
    await api.patch(`/portal/${token}/cell`, { columnId: view?.columns[col]?.progressId, value });
    await load();
  };

  const uploadCell = async (_row: number, col: number, files: File[]) => {
    const isDraft = view?.columns[col]?.kind === 'media';
    if (isDraft && files.some((file) => file.size > 80 * 1024 * 1024)) {
      throw { response: { data: { message: 'Ukuran file maksimal 80MB per file' } } };
    }
    const fd = new FormData();
    fd.append('columnId', view?.columns[col]?.progressId ?? '');
    files.forEach((file) => fd.append('files', file));
    await api.post(`/portal/${token}/${isDraft ? 'draft' : 'cell'}/upload`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    await load();
  };

  if (error && !view) return <BoardMessage text={error} />;
  if (!view) return <BoardMessage text="Memuat…" />;
  return <CampaignBoard audience="creator" view={view} loading={loading} onReload={() => void load()} onEdit={editCell} onUpload={uploadCell} />;
}
