import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';

interface CaseStudy {
  id: string;
  headline: string;
  challenge: string;
  approach: string;
  results: string;
  brandName?: string;
  campaignName?: string;
  highlightStats: { views: number; engagementRate: number; totalPosts: number; reach: number | null };
}

const f = "var(--font-display)";

function formatNumber(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

export default function CaseStudyDetail() {
  const { id } = useParams();
  const [data, setData] = useState<CaseStudy | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/portfolio/case-studies/${id}`)
      .then((res) => setData(res.data))
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9ff' }}>
        <p style={{ fontFamily: f, color: '#464652' }}>Case study tidak ditemukan.</p>
      </div>
    );
  }

  if (!data) return <div style={{ minHeight: '100vh', background: '#f8f9ff' }} />;

  return (
    <div style={{ background: '#f8f9ff', minHeight: '100vh' }}>
      {/* Hero — screenshot-friendly: brand + headline + azerakol branding all in one crop */}
      <div style={{ background: 'linear-gradient(135deg, #1E0A5E, #2D1060)', padding: '100px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/icon.png" alt="AzeraKOL" style={{ height: '28px' }} />
          <span style={{ fontFamily: f, fontWeight: 900, fontStyle: 'italic', fontSize: '1rem', color: 'white', letterSpacing: '-0.02em' }}>AZERAKOL</span>
        </div>
        <div style={{ maxWidth: '720px', margin: '40px auto 0' }}>
          {data.brandName && (
            <span style={{ display: 'inline-block', background: '#F0EEFF', color: '#6B2EE8', borderRadius: '999px', padding: '6px 16px', fontSize: '0.8rem', fontWeight: 700, fontFamily: f, marginBottom: '20px' }}>
              {data.brandName}
            </span>
          )}
          <h1 style={{ fontFamily: f, fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'white', lineHeight: 1.2 }}>
            {data.headline}
          </h1>
        </div>
      </div>

      {/* Highlight stats — big bold numbers, screenshot-friendly block */}
      <div style={{ maxWidth: '900px', margin: '-40px auto 0', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '24px', textAlign: 'center' }}>
          <div>
            <p style={{ fontFamily: f, fontWeight: 800, fontSize: '2.2rem', color: '#6728e4' }}>{formatNumber(data.highlightStats.views)}</p>
            <p style={{ fontFamily: f, fontSize: '0.78rem', color: '#777683', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Views</p>
          </div>
          <div>
            <p style={{ fontFamily: f, fontWeight: 800, fontSize: '2.2rem', color: '#6728e4' }}>{data.highlightStats.engagementRate}%</p>
            <p style={{ fontFamily: f, fontSize: '0.78rem', color: '#777683', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Engagement Rate</p>
          </div>
          <div>
            <p style={{ fontFamily: f, fontWeight: 800, fontSize: '2.2rem', color: '#6728e4' }}>{data.highlightStats.totalPosts}</p>
            <p style={{ fontFamily: f, fontSize: '0.78rem', color: '#777683', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Posts</p>
          </div>
          {data.highlightStats.reach !== null && (
            <div>
              <p style={{ fontFamily: f, fontWeight: 800, fontSize: '2.2rem', color: '#6728e4' }}>{formatNumber(data.highlightStats.reach)}</p>
              <p style={{ fontFamily: f, fontSize: '0.78rem', color: '#777683', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Reach</p>
            </div>
          )}
        </div>
      </div>

      {/* Narrative sections — each self-contained enough to screenshot alone */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '60px 24px 100px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', marginBottom: '20px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
          <span style={{ display: 'inline-block', background: '#F0EEFF', color: '#6B2EE8', borderRadius: '999px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, fontFamily: f, marginBottom: '14px' }}>
            Tantangan
          </span>
          <p style={{ fontFamily: f, fontSize: '1rem', color: '#191c20', lineHeight: 1.7 }}>{data.challenge}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', marginBottom: '20px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
          <span style={{ display: 'inline-block', background: '#F0EEFF', color: '#6B2EE8', borderRadius: '999px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, fontFamily: f, marginBottom: '14px' }}>
            Pendekatan Azera
          </span>
          <p style={{ fontFamily: f, fontSize: '1rem', color: '#191c20', lineHeight: 1.7 }}>{data.approach}</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #1E0A5E, #2D1060)', borderRadius: '20px', padding: '32px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
          <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', color: 'white', borderRadius: '999px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 700, fontFamily: f, marginBottom: '14px' }}>
            Hasil
          </span>
          <p style={{ fontFamily: f, fontSize: '1rem', color: 'white', lineHeight: 1.7 }}>{data.results}</p>
        </div>
      </div>

      {/* Footer branding — visible in a bottom crop too */}
      <div style={{ background: '#08060F', padding: '32px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: f, fontWeight: 700, color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
          Scale Brands. Amplify Impact — @azerakol.id
        </p>
      </div>
    </div>
  );
}
