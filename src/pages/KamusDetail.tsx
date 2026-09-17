import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getTermPhoto, glossaryTerms } from '../data/glossary';

export default function KamusDetail() {
  const { slug } = useParams<{ slug: string }>();
  const term = glossaryTerms.find((t) => t.slug === slug);

  if (!term) return <Navigate to="/kamus" replace />;

  const others = glossaryTerms.filter((t) => t.slug !== term.slug && t.term[0] === term.term[0]).slice(0, 5);
  const photo = getTermPhoto(term);

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '96px 24px 100px' }}>
        <Link
          to="/kamus"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--on-surface-variant)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, marginBottom: '28px' }}
        >
          <ArrowLeft size={16} /> Kamus KOL
        </Link>

        <div style={{ aspectRatio: '16 / 9', borderRadius: '20px', overflow: 'hidden', marginBottom: '28px', background: 'var(--surface-container)' }}>
          <img
            src={photo.url}
            alt={term.term}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, 4.5vw, 2.8rem)', color: 'var(--on-background)', lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-0.02em' }}>
          {term.term}
        </h1>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '32px' }}>
          {term.summary}
        </p>

        {term.sections.map((section) => (
          <div key={section.heading} style={{ marginBottom: '28px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--on-background)', marginBottom: '8px' }}>
              {section.heading}
            </h2>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.98rem', lineHeight: 1.8 }}>
              {section.body}
            </p>
          </div>
        ))}

        <div
          style={{
            borderRadius: '24px', padding: '32px', marginBottom: '48px',
            background: 'linear-gradient(135deg, #1E0A5E, #2D1060)',
          }}
        >
          <p style={{ color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', marginBottom: '8px' }}>
            Mau jalankan campaign KOL kamu sendiri?
          </p>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
            Tim AzeraKOL bantu strategi, kurasi kreator, sampai eksekusi campaign kamu dari awal sampai selesai.
          </p>
          <Link to="/brand/form" className="btn-primary" style={{ display: 'inline-flex', boxShadow: 'none' }}>
            Konsultasi Gratis
          </Link>
        </div>

        {others.length > 0 && (
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--on-background)', marginBottom: '12px' }}>
              Istilah lain berawalan &ldquo;{term.term[0]}&rdquo;
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {others.map((o) => (
                <Link
                  key={o.slug}
                  to={`/kamus/${o.slug}`}
                  style={{
                    padding: '8px 16px', borderRadius: '999px', border: '1px solid var(--outline-variant)',
                    background: '#fff', color: 'var(--secondary)', textDecoration: 'none',
                    fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem',
                  }}
                >
                  {o.term}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
