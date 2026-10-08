import PageHero from '../components/sections/PageHero';
import { KamusIllustration } from '../components/illustrations';
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
    <div className="purple-page" style={{ background: 'var(--hero-bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '32px 24px 0' }}>
        <PageHero
          title="Istilah KOL &"
          accent="Influencer Marketing"
          subtitle="Kumpulan istilah yang sering dipakai dalam dunia KOL, influencer marketing, dan campaign brand, biar kamu makin paham istilahnya."
          illustration={<KamusIllustration />}
        />
      </div>

      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px 100px' }}>
        {/* Search + huruf: sticky tepat di bawah navbar (fixed, ±80px). Kotak sangat transparan + blur: hampir tak terlihat,
            tapi kartu yang lewat di belakangnya jadi samar sehingga search & huruf tetap terbaca */}
        <div style={{
          position: 'sticky', top: '84px', zIndex: 20, margin: '0 -12px 28px', padding: '12px',
          borderRadius: '20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        }}>
        <div style={{ position: 'relative', maxWidth: '480px', margin: query ? '0 auto' : '0 auto 12px' }}>
          <Search size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--outline)' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari istilah, misalnya micro influencer..."
            style={{
              width: '100%', padding: '14px 18px 14px 48px', borderRadius: '999px',
              border: '1.5px solid var(--outline-variant)', background: '#fff', boxShadow: '0 6px 20px rgba(28,10,68,0.25)',
              fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--on-background)', outline: 'none',
            }}
          />
        </div>

        {/* Alphabet jump nav */}
        {!query && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
            {letters.map((l) => (
              <a
                key={l}
                href={`#letter-${l}`}
                style={{
                  width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--surface-container)', color: 'var(--secondary)', boxShadow: '0 4px 12px rgba(28,10,68,0.25)',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none',
                }}
              >
                {l}
              </a>
            ))}
          </div>
        )}
        </div>

        {grouped.length === 0 && (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.85)', padding: '40px 0' }}>
            Istilah tidak ditemukan. Coba kata kunci lain.
          </p>
        )}

        {grouped.map(([letter, terms]) => (
          <div key={letter} id={`letter-${letter}`} style={{ marginBottom: '36px', scrollMarginTop: '230px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--lime)' }}>{letter}</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.25)' }} />
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
