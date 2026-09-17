import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getTermPhoto, glossaryTerms } from '../data/glossary';

export default function Kamus() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return glossaryTerms;
    return glossaryTerms.filter(
      (t) => t.term.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q)
    );
  }, [query]);

  const letters = useMemo(() => {
    const set = new Set(glossaryTerms.map((t) => t.term[0].toUpperCase()));
    return Array.from(set).sort();
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach((t) => {
      const letter = t.term[0].toUpperCase();
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(t);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh' }}>
      <div style={{ padding: '80px 24px 8px', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <span className="tag-pill tag-pill-navy" style={{ margin: '0 auto 16px' }}>Kamus KOL</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', color: 'var(--on-background)', lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-0.03em' }}>
            Istilah KOL & Influencer Marketing
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto' }}>
            Kumpulan istilah yang sering dipakai dalam dunia KOL, influencer marketing, dan campaign brand — biar kamu makin paham istilahnya.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '48px 24px 100px' }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '480px', margin: '0 auto 20px' }}>
          <Search size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--outline)' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari istilah, misalnya micro influencer..."
            style={{
              width: '100%', padding: '14px 18px 14px 48px', borderRadius: '999px',
              border: '1.5px solid var(--outline-variant)', background: '#fff',
              fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--on-background)', outline: 'none',
            }}
          />
        </div>

        {/* Alphabet jump nav */}
        {!query && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '40px' }}>
            {letters.map((l) => (
              <a
                key={l}
                href={`#letter-${l}`}
                style={{
                  width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--surface-container)', color: 'var(--secondary)',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none',
                }}
              >
                {l}
              </a>
            ))}
          </div>
        )}

        {grouped.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--on-surface-variant)', padding: '40px 0' }}>
            Istilah tidak ditemukan. Coba kata kunci lain.
          </p>
        )}

        {grouped.map(([letter, terms]) => (
          <div key={letter} id={`letter-${letter}`} style={{ marginBottom: '36px', scrollMarginTop: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--secondary)' }}>{letter}</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--outline-variant)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '12px' }}>
              {terms.map((t) => (
                <Link
                  key={t.slug}
                  to={`/kamus/${t.slug}`}
                  style={{
                    display: 'block', borderRadius: '16px', textDecoration: 'none', overflow: 'hidden',
                    background: '#fff', border: '1px solid var(--outline-variant)',
                  }}
                >
                  <img
                    src={getTermPhoto(t).url}
                    alt=""
                    loading="lazy"
                    style={{ width: '100%', aspectRatio: '2 / 1', objectFit: 'cover', display: 'block', background: 'var(--surface-container)' }}
                  />
                  <div style={{ padding: '14px 16px 16px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.98rem', color: 'var(--on-background)', marginBottom: '6px' }}>
                      {t.term}
                    </div>
                    <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.86rem', lineHeight: 1.55 }}>
                      {t.summary}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
