import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
const siteUrl = (process.env.VITE_SITE_URL || 'https://azerakol.id').replace(/\/$/, '');
const siteName = 'AzeraKOL';
const defaultImage = `${siteUrl}/logo.png`;

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteName,
  alternateName: ['Azera KOL', 'Azera', 'azerakol'],
  url: siteUrl,
  logo: defaultImage,
  description: 'AzeraKOL membantu brand menjalankan kampanye KOL dan influencer marketing dengan jaringan kreator terkurasi di Indonesia.',
};

const kolServiceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Jasa KOL Management Indonesia',
  provider: organizationJsonLd,
  areaServed: { '@type': 'Country', name: 'Indonesia' },
  serviceType: 'KOL campaign, influencer marketing, creator campaign management',
  description: 'Layanan KOL management untuk brand yang ingin menjalankan kampanye influencer marketing di Instagram, TikTok, YouTube, dan live streaming.',
};

const creatorNetworkJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'AzeraKOL Creator Network',
  provider: organizationJsonLd,
  areaServed: { '@type': 'Country', name: 'Indonesia' },
  serviceType: 'KOL network and creator partnership platform',
  description: 'Jaringan KOL dan kreator Indonesia untuk mendapatkan peluang kolaborasi brand terpercaya.',
};

const routes = [
  {
    path: '/',
    title: 'AzeraKOL | Jasa KOL Management & Influencer Marketing Indonesia',
    description: 'AzeraKOL membantu brand menjalankan kampanye KOL dan influencer marketing di Indonesia melalui jaringan 20K+ kreator terkurasi untuk Instagram, TikTok, YouTube, dan live streaming.',
    keywords: 'azerakol, AzeraKOL, Azera KOL, jasa KOL management, KOL agency Indonesia, influencer marketing agency, campaign KOL, nano KOL, micro influencer Indonesia',
    jsonLd: [organizationJsonLd, { '@context': 'https://schema.org', '@type': 'WebSite', name: siteName, url: siteUrl }, kolServiceJsonLd],
  },
  {
    path: '/brand',
    title: 'Paket Campaign KOL untuk Brand | AzeraKOL',
    description: 'Pilih paket campaign KOL untuk brand Anda. AzeraKOL mengelola strategi, shortlist kreator, eksekusi konten, dan laporan performa kampanye influencer marketing.',
    keywords: 'paket campaign KOL, jasa influencer marketing, KOL campaign brand, campaign TikTok, campaign Instagram, brand activation Indonesia',
    jsonLd: [kolServiceJsonLd],
  },
  {
    path: '/brand/form',
    title: 'Konsultasi Campaign KOL Gratis | AzeraKOL',
    description: 'Isi brief campaign brand Anda untuk mendapatkan rekomendasi paket KOL dan konsultasi influencer marketing dari tim AzeraKOL.',
    robots: 'noindex, nofollow',
  },
  {
    path: '/kol',
    title: 'Daftar KOL & Creator Network Indonesia | AzeraKOL',
    description: 'Bergabung gratis dengan AzeraKOL Creator Network untuk mendapatkan peluang kolaborasi brand terpercaya, campaign support, dan akses komunitas kreator Indonesia.',
    keywords: 'daftar KOL, daftar influencer Indonesia, creator network Indonesia, KOL network, peluang kolaborasi brand',
    jsonLd: [creatorNetworkJsonLd],
  },
  {
    path: '/kol/register',
    title: 'Form Pendaftaran KOL | AzeraKOL',
    description: 'Daftar sebagai KOL atau creator di AzeraKOL Network untuk mulai menerima peluang campaign dari brand terpercaya.',
    robots: 'noindex, nofollow',
  },
  {
    path: '/portfolio',
    title: 'Portfolio Campaign KOL & Influencer Marketing | AzeraKOL',
    description: 'Lihat hasil kampanye KOL AzeraKOL bersama brand dari kategori beauty, F&B, fashion, tech, fitness, dan home living dengan data reach dan engagement.',
    keywords: 'portfolio KOL campaign, case study influencer marketing, hasil campaign KOL, campaign brand Indonesia',
    jsonLd: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Portfolio Kampanye KOL AzeraKOL', url: `${siteUrl}/portfolio` }],
  },
];

function absoluteUrl(path) {
  return `${siteUrl}${path === '/' ? '' : path}`;
}

function replaceMeta(html, route) {
  const canonical = absoluteUrl(route.path);
  const robots = route.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const keywords = route.keywords || 'AzeraKOL, Azera KOL, azerakol, KOL agency Indonesia, influencer marketing Indonesia';

  let next = html
    .replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta name="robots" content="[^"]*" \/>/, `<meta name="robots" content="${robots}" />`)
    .replace(/<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/, `<meta name="description" content="${route.description}" />`)
    .replace(/<meta\s+name="keywords"\s+content="[\s\S]*?"\s*\/>/, `<meta name="keywords" content="${keywords}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${route.title}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/>/, `<meta property="og:description" content="${route.description}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${route.title}" />`)
    .replace(/<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/>/, `<meta name="twitter:description" content="${route.description}" />`);

  if (route.jsonLd) {
    next = next.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(route.jsonLd)}</script>\n  </head>`);
  }

  return next;
}

const template = await readFile(join(dist, 'index.html'), 'utf8');

for (const route of routes) {
  const outputDir = route.path === '/' ? dist : join(dist, route.path.slice(1));
  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, 'index.html'), replaceMeta(template, route));
}
