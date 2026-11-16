import { useState } from 'react';
import { Copy, X } from 'lucide-react';
import api from '../../lib/api';
import { PLATFORM_LABELS, applyOrder, defaultApplyKeys } from '../../lib/applyForm';
import type { ApplyFields, CustomField } from './CustomFormBuilder';

const font = "var(--font-display)";
const TYPE_LABELS: Record<string, string> = {
  text: 'Jawaban Singkat', textarea: 'Paragraf', number: 'Angka', select: 'Pilihan Ganda', checkbox: 'Kotak Centang', file: 'Upload File/Gambar',
};
const DEFAULT_LABELS: Record<string, string> = {
  name: 'Nama Lengkap', phone: 'Nomor WhatsApp', email: 'Email', niches: 'Niche', domicile: 'Provinsi & Kota', pic: 'PIC', handleBy: 'Handle by',
};

interface SourceCampaign {
  _id: string; name: string; createdAt?: string; brandId?: { namaBrand?: string };
  customFields?: CustomField[]; applyFields?: ApplyFields;
  criteria?: { platforms?: string[]; provinces?: string[]; cities?: string[] };
}

/** Pakai form Apply campaign lain sebagai template: pilih campaign, lihat preview, lalu ganti form ini. */
export default function CopyFormPicker({ excludeId, onApply }: { excludeId?: string; onApply: (fields: CustomField[], applyFields: ApplyFields) => void }) {
  const [open, setOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<SourceCampaign[] | null>(null);
  const [selectedId, setSelectedId] = useState('');
  const [error, setError] = useState('');

  const start = async () => {
    setOpen(true);
    setError('');
    if (campaigns) return;
    try {
      const res = await api.get('/admin/campaigns');
      const list = (res.data as SourceCampaign[]).filter((c) => c._id !== excludeId);
      setCampaigns(list);
      setSelectedId(list.find((c) => c.customFields?.length)?._id || list[0]?._id || '');
    } catch {
      setCampaigns([]);
      setError('Gagal memuat daftar campaign.');
    }
  };

  const src = campaigns?.find((c) => c._id === selectedId);
  const srcApply = src?.applyFields ?? { pic: true, handleBy: true, handleByRequired: false };
  const keys = src ? applyOrder(srcApply.order, defaultApplyKeys({
    askDomicile: Boolean(src.criteria?.provinces?.length || src.criteria?.cities?.length),
    platforms: src.criteria?.platforms || [],
    customIds: (src.customFields || []).map((f) => f.id),
  })).filter((k) => (k !== 'pic' || srcApply.pic) && (k !== 'handleBy' || srcApply.handleBy)) : [];

  const apply = () => {
    if (!src) return;
    onApply((src.customFields || []).map((f) => ({ ...f, options: [...(f.options || [])] })), { ...srcApply, order: srcApply.order ? [...srcApply.order] : undefined, descriptions: { ...srcApply.descriptions } });
    setOpen(false);
  };

  return (
    <>
      <button type="button" onClick={() => void start()}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', padding: '7px 14px', borderRadius: '999px', border: '1px solid #c9b6f7', background: 'white', color: '#6728e4', fontSize: '0.8rem', fontWeight: 700, fontFamily: font, cursor: 'pointer' }}>
        <Copy size={14} /> Copy form dari campaign lain
      </button>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Copy form dari campaign lain" onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(25,28,32,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '640px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e1e0ff' }}>
              <p style={{ fontFamily: font, fontWeight: 800, fontSize: '1rem', color: '#191c20' }}>Copy form dari campaign lain</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Tutup" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#5f6368' }}><X size={18} /></button>
            </div>

            <div style={{ padding: '16px 20px', display: 'grid', gap: '12px', overflowY: 'auto' }}>
              {error && <p role="alert" style={{ fontFamily: font, fontSize: '0.82rem', color: '#93000a' }}>{error}</p>}
              {campaigns === null ? <p style={{ fontFamily: font, fontSize: '0.82rem', color: '#777683' }}>Memuat campaign...</p>
                : campaigns.length === 0 ? <p style={{ fontFamily: font, fontSize: '0.82rem', color: '#777683' }}>Belum ada campaign lain.</p>
                : (
                  <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} style={{ padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #e1e0ff', fontFamily: font, fontSize: '0.85rem' }}>
                    {campaigns.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}{c.brandId?.namaBrand ? ` · ${c.brandId.namaBrand}` : ''} ({c.customFields?.length || 0} pertanyaan)</option>
                    ))}
                  </select>
                )}

              {src && (
                <div style={{ border: '1px solid #e1e0ff', borderTop: '6px solid #6728e4', borderRadius: '12px', padding: '12px 16px', display: 'grid', gap: '8px' }}>
                  <p style={{ fontFamily: font, fontSize: '0.74rem', color: '#777683' }}>Preview urutan form</p>
                  {keys.map((k, i) => {
                    const custom = src.customFields?.find((f) => f.id === k);
                    const label = custom ? custom.label : k.startsWith('social:') ? `Akun ${PLATFORM_LABELS[k.slice(7)] ?? k.slice(7)} (username + followers)` : DEFAULT_LABELS[k] ?? k;
                    return (
                      <div key={k} style={{ fontFamily: font, fontSize: '0.84rem', color: '#191c20', paddingBottom: '8px', borderBottom: i < keys.length - 1 ? '1px solid #f0eeff' : 'none' }}>
                        <span style={{ color: '#9a99a6' }}>{i + 1}. </span>{label}
                        {(custom ? custom.required : k !== 'handleBy' || srcApply.handleByRequired) && <span style={{ color: '#d93025' }}> *</span>}
                        {custom ? (
                          <span style={{ color: '#6728e4', fontSize: '0.74rem' }}> · {TYPE_LABELS[custom.type] ?? custom.type}</span>
                        ) : (
                          <span style={{ color: '#9a99a6', fontSize: '0.74rem' }}> · default</span>
                        )}
                        {custom?.options?.length ? <p style={{ fontSize: '0.74rem', color: '#777683', marginTop: '2px' }}>{custom.options.join(' / ')}</p> : null}
                        {(custom?.description || srcApply.descriptions?.[k]) && <p style={{ fontSize: '0.74rem', color: '#777683', marginTop: '2px', whiteSpace: 'pre-wrap' }}>{custom?.description || srcApply.descriptions?.[k]}</p>}
                      </div>
                    );
                  })}
                  <p style={{ fontFamily: font, fontSize: '0.72rem', color: '#9a99a6' }}>Field akun sosmed & domisili mengikuti kriteria campaign ini, bukan campaign sumber. PIC tetap dicentang di kartu PIC.</p>
                </div>
              )}
            </div>

            {src && (
              <div style={{ padding: '14px 20px', borderTop: '1px solid #e1e0ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <p style={{ fontFamily: font, fontSize: '0.76rem', color: '#a15c00' }}>Pertanyaan di form ini sekarang akan diganti.</p>
                <button type="button" onClick={apply} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>Pakai form ini</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
