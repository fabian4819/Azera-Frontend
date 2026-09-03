import { faqs } from '../data/faq';

export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://azerakol.id').replace(/\/$/, '');
export const SITE_NAME = 'AzeraKOL';
export const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

export type JsonLd = Record<string, unknown> | Record<string, unknown>[];

export interface SEOConfig {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  noindex?: boolean;
  jsonLd?: JsonLd;
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  alternateName: ['Azera KOL', 'Azera', 'azerakol'],
  url: SITE_URL,
  logo: DEFAULT_IMAGE,
  description: 'AzeraKOL membantu brand menjalankan campaign KOL dan influencer marketing dengan jaringan kreator terkurasi di Indonesia.',
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const kolServiceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Jasa KOL Management Indonesia',
  provider: organizationJsonLd,
  areaServed: {
    '@type': 'Country',
    name: 'Indonesia',
  },
  serviceType: 'KOL campaign, influencer marketing, creator campaign management',
  description: 'Layanan KOL management untuk brand yang ingin menjalankan campaign influencer marketing di Instagram, TikTok, YouTube, dan live streaming.',
};

const creatorNetworkJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'AzeraKOL Creator Network',
  provider: organizationJsonLd,
  areaServed: {
    '@type': 'Country',
    name: 'Indonesia',
  },
  serviceType: 'KOL network and creator partnership platform',
  description: 'Jaringan KOL dan kreator Indonesia untuk mendapatkan peluang kolaborasi brand terpercaya.',
};

const portfolioJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Portfolio Campaign KOL AzeraKOL',
  url: `${SITE_URL}/portfolio`,
  description: 'Portfolio campaign KOL dan influencer marketing yang dijalankan AzeraKOL bersama brand di berbagai kategori.',
};

const breadcrumb = (items: Array<{ name: string; path: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.path}`,
  })),
});

export const seoByPath: Record<string, SEOConfig> = {
  '/': {
    title: 'AzeraKOL | Jasa KOL Management & Influencer Marketing Indonesia',
    description:
      'AzeraKOL membantu brand menjalankan campaign KOL dan influencer marketing di Indonesia melalui jaringan 20K+ kreator terkurasi untuk Instagram, TikTok, YouTube, dan live streaming.',
    path: '/',
    keywords: 'azerakol, AzeraKOL, Azera KOL, jasa KOL management, KOL agency Indonesia, influencer marketing agency, campaign KOL, nano KOL, micro influencer Indonesia',
    jsonLd: [organizationJsonLd, websiteJsonLd, faqJsonLd, kolServiceJsonLd],
  },
  '/brand': {
    title: 'Paket Campaign KOL untuk Brand | AzeraKOL',
    description:
      'Pilih paket campaign KOL untuk brand Anda. AzeraKOL mengelola strategi, shortlist kreator, eksekusi konten, dan laporan performa campaign influencer marketing.',
    path: '/brand',
    keywords: 'paket campaign KOL, jasa influencer marketing, KOL campaign brand, campaign TikTok, campaign Instagram, brand activation Indonesia',
    jsonLd: [kolServiceJsonLd, breadcrumb([{ name: 'Home', path: '/' }, { name: 'Brand', path: '/brand' }])],
  },
  '/brand/form': {
    title: 'Konsultasi Campaign KOL Gratis | AzeraKOL',
    description: 'Isi brief campaign brand Anda untuk mendapatkan rekomendasi paket KOL dan konsultasi influencer marketing dari tim AzeraKOL.',
    path: '/brand/form',
    noindex: true,
  },
  '/kol': {
    title: 'Daftar KOL & Creator Network Indonesia | AzeraKOL',
    description:
      'Bergabung gratis dengan AzeraKOL Creator Network untuk mendapatkan peluang kolaborasi brand terpercaya, campaign support, dan akses komunitas kreator Indonesia.',
    path: '/kol',
    keywords: 'daftar KOL, daftar influencer Indonesia, creator network Indonesia, KOL network, peluang kolaborasi brand',
    jsonLd: [creatorNetworkJsonLd, breadcrumb([{ name: 'Home', path: '/' }, { name: 'KOL', path: '/kol' }])],
  },
  '/kol/register': {
    title: 'Form Pendaftaran KOL | AzeraKOL',
    description: 'Daftar sebagai KOL atau creator di AzeraKOL Network untuk mulai menerima peluang campaign dari brand terpercaya.',
    path: '/kol/register',
    noindex: true,
  },
  '/portfolio': {
    title: 'Portfolio Campaign KOL & Influencer Marketing | AzeraKOL',
    description:
      'Lihat hasil campaign KOL AzeraKOL bersama brand dari kategori beauty, F&B, fashion, tech, fitness, dan home living dengan data reach dan engagement.',
    path: '/portfolio',
    keywords: 'portfolio KOL campaign, case study influencer marketing, hasil campaign KOL, campaign brand Indonesia',
    jsonLd: [portfolioJsonLd, breadcrumb([{ name: 'Home', path: '/' }, { name: 'Portfolio', path: '/portfolio' }])],
  },
  '/service/nano-micro-kol-campaign': {
    title: 'Nano-Micro KOL Campaign | AzeraKOL',
    description:
      'Campaign bersama puluhan hingga ribuan nano-micro KOL untuk meningkatkan awareness, engagement, review, dan peluncuran produk brand kamu.',
    path: '/service/nano-micro-kol-campaign',
    keywords: 'nano micro KOL campaign, jasa KOL management Indonesia, campaign influencer skala besar',
    jsonLd: [kolServiceJsonLd, breadcrumb([{ name: 'Home', path: '/' }, { name: 'Nano-Micro KOL Campaign', path: '/service/nano-micro-kol-campaign' }])],
  },
  '/service/koc-campaign': {
    title: 'KOC Campaign | AzeraKOL',
    description:
      'Aktivasi everyday consumers dan small creators untuk authentic reviews, product seeding, mass content distribution, dan UGC sesuai kebutuhan campaign.',
    path: '/service/koc-campaign',
    keywords: 'KOC campaign, key opinion consumer, UGC campaign Indonesia, product seeding',
    jsonLd: [kolServiceJsonLd, breadcrumb([{ name: 'Home', path: '/' }, { name: 'KOC Campaign', path: '/service/koc-campaign' }])],
  },
  '/service/affiliate-creator-campaign': {
    title: 'Affiliate Creator Campaign | AzeraKOL',
    description:
      'Campaign berbasis performa bersama affiliate creators untuk mendorong traffic, conversion, sales, commission, dan GMV brand kamu.',
    path: '/service/affiliate-creator-campaign',
    keywords: 'affiliate creator campaign, affiliate marketing KOL, program afiliasi TikTok Shop, GMV creator',
    jsonLd: [kolServiceJsonLd, breadcrumb([{ name: 'Home', path: '/' }, { name: 'Affiliate Creator Campaign', path: '/service/affiliate-creator-campaign' }])],
  },
  '/service/event-creator-activation': {
    title: 'Event Creator Activation | AzeraKOL',
    description:
      'Aktivasi KOC dan nano creators untuk menghadiri serta meramaikan event, menghasilkan live content, dan memperluas exposure event di media sosial.',
    path: '/service/event-creator-activation',
    keywords: 'event creator activation, aktivasi event KOC, live content event, exposure event media sosial',
    jsonLd: [kolServiceJsonLd, breadcrumb([{ name: 'Home', path: '/' }, { name: 'Event Creator Activation', path: '/service/event-creator-activation' }])],
  },
};

export const defaultSeo: SEOConfig = seoByPath['/'];

export function getSeoForPath(pathname: string): SEOConfig {
  if (pathname.startsWith('/admin')) {
    return {
      title: 'Admin | AzeraKOL',
      description: 'Area administrasi AzeraKOL.',
      path: pathname,
      noindex: true,
    };
  }

  return seoByPath[pathname] || defaultSeo;
}

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path === '/' ? '' : path}`;
}
