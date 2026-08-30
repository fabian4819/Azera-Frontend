import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Upload, ExternalLink } from 'lucide-react';
import api from '../lib/api';

const f = "var(--font-display)";

interface InvoiceItem { name: string; description?: string; qty: number | null; rate: number }
interface InvoiceInfo {
  number: string; campaign: { name: string }; billTo: string; items: InvoiceItem[];
  discount: number; subtotal: number; total: number; isDp: boolean;
  issueDate: string; dueDate: string; status: string; pdfUrl?: string;
}

export default function InvoicePayment() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code') || '';
  const [invoice, setInvoice] = useState<InvoiceInfo | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/invoices/${id}`, { params: { code } })
      .then((res) => setInvoice(res.data))
      .catch(() => setNotFound(true));
  }, [id, code]);

  const uploadProof = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('proof', file);
      await api.post(`/invoices/${id}/payment-proof`, formData, {
        params: { code },
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSubmitted(true);
    } catch {
      setError('Gagal upload bukti transfer. Coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9ff' }}>
        <p style={{ fontFamily: f, color: '#464652' }}>Invoice tidak ditemukan.</p>
      </div>
    );
  }
  if (!invoice) return <div style={{ minHeight: '100vh', background: '#f8f9ff' }} />;

  const fmt = (n: number) => `Rp${n.toLocaleString('id-ID')}`;

  return (
    <div style={{ background: '#f8f9ff', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <p style={{ fontFamily: f, fontWeight: 900, fontStyle: 'italic', fontSize: '1.4rem', color: '#15157d' }}>AZERAKOL</p>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <p style={{ fontFamily: f, fontWeight: 800, fontSize: '1.2rem', color: '#191c20' }}>{invoice.number}</p>
              <p style={{ fontFamily: f, fontSize: '0.82rem', color: '#777683' }}>{invoice.campaign?.name}</p>
            </div>
            <span style={{ background: invoice.status === 'paid' ? '#d1fae5' : '#fef3c7', color: invoice.status === 'paid' ? '#065F46' : '#92400E', borderRadius: '999px', padding: '4px 12px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'capitalize', fontFamily: f }}>
              {invoice.status.replace('_', ' ')}
            </span>
          </div>

          <div style={{ marginBottom: '16px' }}>
            {invoice.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0', fontFamily: f, fontSize: '0.85rem' }}>
                <span>{item.name} {item.qty ? `x${item.qty}` : ''}</span>
                <span style={{ fontWeight: 600 }}>{fmt((item.qty ?? 1) * item.rate)}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: f, fontSize: '0.85rem', marginBottom: '4px' }}>
            <span style={{ color: '#777683' }}>Subtotal</span><span>{fmt(invoice.subtotal)}</span>
          </div>
          {invoice.discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: f, fontSize: '0.85rem', marginBottom: '4px', color: '#ba1a1a' }}>
              <span>Discount</span><span>-{fmt(invoice.discount)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: f, fontWeight: 800, fontSize: '1.1rem', marginTop: '10px', paddingTop: '10px', borderTop: '2px solid #e1e0ff', color: '#6728e4' }}>
            <span>Total</span><span>{fmt(invoice.total)}</span>
          </div>

          {invoice.pdfUrl && (
            <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginTop: '16px', color: '#6728e4', fontSize: '0.82rem', fontFamily: f, textDecoration: 'none' }}>
              <ExternalLink size={14} /> Lihat PDF Invoice
            </a>
          )}
        </div>

        {invoice.status === 'paid' ? (
          <div style={{ background: '#d1fae5', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
            <CheckCircle2 size={32} color="#065F46" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontFamily: f, fontWeight: 700, color: '#065F46' }}>Pembayaran sudah diverifikasi</p>
          </div>
        ) : submitted || invoice.status === 'waiting_verification' ? (
          <div style={{ background: '#fef3c7', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
            <p style={{ fontFamily: f, fontWeight: 700, color: '#92400E' }}>Bukti pembayaran diterima, menunggu verifikasi admin.</p>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px' }}>
            <p style={{ fontFamily: f, fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px' }}>Upload Bukti Transfer</p>
            <input type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ marginBottom: '14px', fontFamily: f, fontSize: '0.85rem' }} />
            {error && <p style={{ color: '#ba1a1a', fontSize: '0.8rem', marginBottom: '10px', fontFamily: f }}>{error}</p>}
            <button onClick={uploadProof} disabled={!file || uploading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: !file || uploading ? 0.6 : 1 }}>
              <Upload size={16} /> {uploading ? 'Mengupload...' : 'Kirim Bukti Transfer'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
