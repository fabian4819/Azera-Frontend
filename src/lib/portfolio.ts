// Tipe & helper Portfolio yang dipakai halaman publik (ringkasan + detail) dan admin.
import type { CSSProperties } from 'react';

export const PORTFOLIO_CATEGORIES = ['KOL Campaign', 'KOC Campaign', 'Affiliate Campaign', 'Event Creator Activation'];
export const SCOPE_OPTIONS = ['sourcing', 'briefing', 'content review', 'monitoring posting', 'pengumpulan insight', 'reporting'];

export type ResultPlatform = 'instagram' | 'tiktok' | 'threads' | 'x' | 'youtube' | 'other';
export const PLATFORM_LABELS: Record<ResultPlatform, string> = {
  instagram: 'Instagram', tiktok: 'TikTok', threads: 'Threads', x: 'X', youtube: 'YouTube', other: 'Lainnya',
};

export interface PlatformResult {
  platform: ResultPlatform;
  platformName?: string;
  creators: number;
  posts: number;
  views?: number | null;
  reach?: number | null;
  impressions?: number | null;
  engagement?: number | null;
  er?: string;
  showExtraPublic?: boolean;
}

export interface TopCreator {
  name: string;
  platform: 'instagram' | 'tiktok';
  postLink?: string;
  views?: string;
  likes?: string;
  comments?: string;
  shares?: string;
}

export interface PortfolioItem {
  _id: string;
  status?: 'draft' | 'published';
  brand: string;
  title?: string;
  category: string;
  objective?: string;
  period?: string;
  hashtag?: string;
  kolCount?: number;
  deliverables?: string;
  scope?: string[];
  scopeOther?: string;
  partnerAgency?: string;
  platforms?: PlatformResult[];
  cpv?: string;
  cpvPublic?: boolean;
  affiliate?: { clicks?: string; orders?: string; gmv?: string };
  logo?: string;
  contents?: string[];
  featured?: boolean;
  topCreators?: TopCreator[];
  // legacy (data sebelum revisi)
  reach?: string;
  engagement?: string | number;
  metrics?: Partial<Record<keyof typeof LEGACY_METRIC_LABELS, string>>;
  createdAt?: string;
}

const LEGACY_METRIC_LABELS = {
  totalImpression: 'Total Impression', accountsReached: 'Accounts Reached', totalEngagement: 'Total Engagement',
  totalFollowers: 'Total Followers', avgEngagementRate: 'Average ER Post', costPerView: 'Cost Per View',
};

const has = (v: unknown) => v !== undefined && v !== null && v !== '';

export function platformLabel(r: PlatformResult) {
  return r.platform === 'other' ? r.platformName || 'Lainnya' : PLATFORM_LABELS[r.platform];
}

/** 1500000 → "1,5M", 900000 → "900K" (format contoh di notes revisi). */
export function formatCompact(n: number) {
  const fmt = (x: number) => x.toLocaleString('id-ID', { maximumFractionDigits: 1 });
  if (n >= 1e9) return fmt(n / 1e9) + 'B';
  if (n >= 1e6) return fmt(n / 1e6) + 'M';
  if (n >= 1e3) return fmt(n / 1e3) + 'K';
  return fmt(n);
}

export function creatorLabel(category: string) {
  if (category === 'KOC Campaign') return 'Total KOC Activated';
  if (category === 'Affiliate Campaign') return 'Total Affiliate Activated';
  if (category === 'Event Creator Activation') return 'Total Event Creators Activated';
  return 'Total KOL Activated';
}

/** Total views = akumulasi views platform yang datanya ada; null kalau tidak ada satupun (kosong ≠ nol). */
export function totalViews(item: PortfolioItem) {
  const rows = (item.platforms || []).filter((r) => has(r.views));
  return rows.length ? rows.reduce((s, r) => s + Number(r.views), 0) : null;
}

export interface ResultBox { label: string; value: string }

/** Kotak hasil: field kosong tidak menghasilkan kotak. Ringkasan memakai 4 pertama, detail memakai semua. */
export function resultBoxes(item: PortfolioItem): ResultBox[] {
  const rows = item.platforms || [];
  const views = totalViews(item);
  const aff = item.affiliate || {};
  const creators = has(item.kolCount) ? { label: creatorLabel(item.category), value: Number(item.kolCount).toLocaleString('id-ID') } : null;
  const posts = rows.length ? { label: 'Postingan Tayang', value: rows.reduce((s, r) => s + (Number(r.posts) || 0), 0).toLocaleString('id-ID') } : null;
  const viewsBox = views !== null ? { label: 'Total Views', value: formatCompact(views) } : null;
  const cpvBox = has(item.cpv) ? { label: 'CPV', value: item.cpv! } : null;
  const affBoxes = [
    has(aff.gmv) ? { label: 'GMV', value: aff.gmv! } : null,
    has(aff.orders) ? { label: 'Pesanan', value: aff.orders! } : null,
    has(aff.clicks) ? { label: 'Klik', value: aff.clicks! } : null,
  ];
  // data lama tanpa baris platform
  const legacyMetrics = Object.entries(LEGACY_METRIC_LABELS)
    .map(([k, label]) => { const v = item.metrics?.[k as keyof typeof LEGACY_METRIC_LABELS]; return has(v) ? { label, value: v! } : null; });
  const legacy = rows.length ? [] : legacyMetrics.some(Boolean) ? legacyMetrics : [
    has(item.reach) ? { label: 'Reach', value: String(item.reach) } : null,
    has(item.engagement) ? { label: 'Engagement Rate', value: `${item.engagement}%` } : null,
  ];
  const results = item.category === 'Affiliate Campaign'
    ? [...affBoxes, viewsBox, cpvBox]
    : [viewsBox, cpvBox, ...affBoxes];
  return [creators, posts, ...results, ...legacy].filter((b): b is ResultBox => b !== null);
}

export function scopeText(item: PortfolioItem) {
  return [...(item.scope || []), ...(item.scopeOther?.trim() ? [item.scopeOther.trim()] : [])].join(' · ');
}

export const isVideo = (url: string) => /\.(mp4|mov|webm|m4v)(\?|$)/i.test(url) || url.includes('/video/upload/');

export const sectionLabel: CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--lime)', marginBottom: '8px' };

/** Kotak 9:16 untuk foto/video upload. */
export const videoTile: CSSProperties = {
  position: 'relative', width: '100%', aspectRatio: '9/16', borderRadius: '10px', overflow: 'hidden', border: 'none', padding: 0,
  background: 'rgba(255,255,255,0.14)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
