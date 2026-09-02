export interface ServiceScopeItem {
  title: string;
  desc: string;
}

export interface ServiceWorkflowStep {
  title: string;
  desc: string;
}

export interface ServicePricingTier {
  badge: string;
  name: string;
  features: string[];
  dark?: boolean;
}

export interface ServiceFAQItem {
  question: string;
  answer: string;
}

export interface ServiceContent {
  slug: string;
  navLabel: string;
  portfolioCategory: string;
  eyebrow: string;
  headlinePlain: string;
  headlineHighlight: string;
  subheading: string;
  tags: string[];
  description: string[];
  scopeTitle: string;
  scope: ServiceScopeItem[];
  workflow: ServiceWorkflowStep[];
  pricing: ServicePricingTier[];
  faq: ServiceFAQItem[];
}

export const services: ServiceContent[] = [
  {
    slug: 'kol-marketing',
    navLabel: 'KOL Marketing',
    portfolioCategory: 'KOL Marketing',
    eyebrow: 'Core Service',
    headlinePlain: 'KOL Marketing &',
    headlineHighlight: 'Amplifikasi Brand',
    subheading: 'Kolaborasi dengan Nano hingga Macro Creator di Seluruh Indonesia',
    tags: ['#Nano-Macro KOL Management', '#Konten Autentik', '#Multi-Platform', '#Kurasi Ketat'],
    description: [
      'Lebih dari sekadar endorsement.',
      'Kami mencocokkan brand kamu dengan KOL yang tepat berdasarkan data engagement, demografi audiens, dan histori performa nyata dari jaringan 20.000+ creator terkurasi di Instagram, TikTok, YouTube, dan live streaming.',
    ],
    scopeTitle: 'Cakupan Layanan',
    scope: [
      { title: 'Matching Berbasis Data', desc: 'Pemilihan KOL memakai data engagement, demografi audiens, dan performa historis, bukan tebak-tebakan.' },
      { title: 'Jaringan 20.000+ KOL', desc: 'Akses nano, micro, hingga macro creator dari berbagai niche di satu tempat.' },
      { title: 'Kurasi Ketat', desc: 'Setiap KOL melalui proses seleksi untuk menghindari fake followers dan engagement rendah.' },
      { title: 'Multi-Platform', desc: 'Instagram, TikTok, YouTube, hingga live streaming didukung dalam satu campaign.' },
      { title: 'End-to-End Management', desc: 'Briefing, review konten, hingga publikasi ditangani penuh oleh tim AzeraKOL.' },
      { title: 'Laporan Transparan', desc: 'Metrik performa yang relevan dilaporkan untuk tiap campaign yang berjalan.' },
    ],
    workflow: [
      { title: 'Plan', desc: 'Diskusi kebutuhan campaign, target audiens, dan tujuan bisnis brand kamu bersama tim AzeraKOL.' },
      { title: 'Match', desc: 'Kami menyeleksi dan menyajikan shortlist KOL yang paling relevan berdasarkan data.' },
      { title: 'Execute', desc: 'Tim AzeraKOL mengelola seluruh proses dari briefing KOL, review konten, hingga publikasi.' },
      { title: 'Scale', desc: 'Analisis performa campaign dan optimalkan untuk hasil yang maksimal.' },
    ],
    pricing: [
      {
        badge: 'Starter',
        name: 'Campaign Nano & Micro',
        features: [
          'Kurasi KOL nano & micro sesuai niche',
          'Briefing & review konten',
          'Laporan performa akhir campaign',
          'Pendampingan 1 PIC dedicated',
        ],
      },
      {
        badge: 'Enterprise',
        name: 'Campaign Multi-Platform Skala Besar',
        dark: true,
        features: [
          'Kurasi nano hingga macro creator',
          'Manajemen multi-platform (IG, TikTok, YouTube, Live)',
          'Dashboard tracking real-time',
          'Dedicated campaign manager & laporan berkala',
        ],
      },
    ],
    faq: [
      { question: 'Berapa lama proses campaign KOL berjalan?', answer: 'Umumnya 2-4 minggu dari briefing hingga laporan akhir, tergantung skala dan jumlah KOL yang dilibatkan.' },
      { question: 'Bagaimana proses seleksi KOL dilakukan?', answer: 'Kami menyaring KOL berdasarkan niche, demografi audiens, engagement rate, dan histori performa, lalu menyajikan shortlist untuk kamu review dan setujui.' },
      { question: 'Apakah bisa custom niche atau platform tertentu?', answer: 'Bisa. Kamu bisa menentukan niche, platform, dan budget target, tim kami akan mencocokkan KOL yang paling relevan.' },
      { question: 'Bagaimana kalau konten KOL tidak sesuai brief?', answer: 'Setiap konten melalui tahap review sebelum publikasi, jadi revisi bisa dilakukan sebelum konten tayang.' },
    ],
  },
  {
    slug: 'engagement-boost',
    navLabel: 'Engagement Boost',
    portfolioCategory: 'Engagement Boost',
    eyebrow: 'Core Service',
    headlinePlain: 'Engagement Boost &',
    headlineHighlight: 'Interaksi Nyata',
    subheading: 'Tingkatkan Interaksi Autentik di Semua Platform Sosial Brand Kamu',
    tags: ['#Social Media Engagement', '#Community Building', '#Organic Reach', '#Konten Interaktif'],
    description: [
      'Lebih dari sekadar angka reach.',
      'Kami merancang aktivasi KOL dan konten yang mendorong interaksi nyata, comment, share, save, hingga percakapan organik yang membangun kedekatan brand dengan audiensnya.',
    ],
    scopeTitle: 'Cakupan Layanan',
    scope: [
      { title: 'Engagement Organik', desc: 'Aktivasi KOL dirancang untuk memancing interaksi nyata, bukan sekadar impresi pasif.' },
      { title: 'Community Building', desc: 'Membangun percakapan dan kedekatan brand dengan audiens secara berkelanjutan.' },
      { title: 'Multi-Platform Growth', desc: 'Strategi engagement disesuaikan untuk Instagram, TikTok, dan platform sosial lainnya.' },
      { title: 'Konten Interaktif', desc: 'Format konten yang mendorong comment, share, dan save dari audiens.' },
      { title: 'Kurasi KOL Relevan', desc: 'KOL dipilih berdasarkan kedekatan dengan audiens target, bukan sekadar jumlah followers.' },
      { title: 'Laporan Transparan', desc: 'Metrik engagement yang relevan dilaporkan untuk tiap campaign yang berjalan.' },
    ],
    workflow: [
      { title: 'Plan', desc: 'Diskusi target audiens, platform prioritas, dan tujuan engagement brand kamu.' },
      { title: 'Match', desc: 'Kami menyeleksi KOL dan format konten yang paling relevan untuk memancing interaksi.' },
      { title: 'Execute', desc: 'Tim AzeraKOL mengelola aktivasi konten dari briefing hingga publikasi.' },
      { title: 'Scale', desc: 'Analisis engagement secara berkala dan optimalkan format konten untuk hasil maksimal.' },
    ],
    pricing: [
      {
        badge: 'Starter',
        name: 'Boost Engagement Fokus Niche',
        features: [
          'Aktivasi KOL nano & micro sesuai niche',
          'Perencanaan format konten interaktif',
          'Laporan engagement akhir campaign',
          'Pendampingan 1 PIC dedicated',
        ],
      },
      {
        badge: 'Enterprise',
        name: 'Community Growth Multi-Platform',
        dark: true,
        features: [
          'Aktivasi KOL lintas niche & platform',
          'Strategi community building berkelanjutan',
          'Dashboard tracking engagement real-time',
          'Dedicated campaign manager & laporan berkala',
        ],
      },
    ],
    faq: [
      { question: 'Apa bedanya Engagement Boost dengan KOL Marketing biasa?', answer: 'Engagement Boost fokus pada format dan strategi konten yang secara spesifik dirancang untuk memancing interaksi (comment, share, save), bukan sekadar reach atau awareness.' },
      { question: 'Platform apa saja yang didukung?', answer: 'Instagram dan TikTok jadi fokus utama, dengan opsi ekspansi ke platform lain sesuai kebutuhan brand.' },
      { question: 'Bagaimana engagement diukur dan dilaporkan?', answer: 'Kami melaporkan metrik relevan seperti rate komentar, share, dan save per konten pada laporan akhir campaign.' },
      { question: 'Apakah cocok untuk brand baru dengan followers sedikit?', answer: 'Cocok. Justru strategi ini efektif untuk membangun community awal lewat KOL yang audiensnya relevan dengan brand kamu.' },
    ],
  },
  {
    slug: 'affiliate-marketing',
    navLabel: 'Affiliate Marketing',
    portfolioCategory: 'Affiliate Marketing',
    eyebrow: 'Core Service',
    headlinePlain: 'Affiliate Marketing &',
    headlineHighlight: 'Dorong Penjualan',
    subheading: 'Program Afiliasi KOL untuk Konversi dan Penjualan Langsung',
    tags: ['#Affiliate Program Setup', '#TikTok Shop & Shopee', '#Commission Structuring', '#Sales-Driven'],
    description: [
      'Lebih dari sekadar promosi.',
      'Kami menyusun program afiliasi end-to-end, mulai dari rekrutmen KOL, struktur komisi, hingga live shopping, supaya penjualan brand kamu terus bertumbuh bahkan setelah campaign berakhir.',
    ],
    scopeTitle: 'Cakupan Layanan',
    scope: [
      { title: 'Setup Program Afiliasi', desc: 'Struktur program afiliasi TikTok Shop dan Shopee disiapkan dari awal hingga siap jalan.' },
      { title: 'Rekrutmen Creator Afiliasi', desc: 'Mencari dan mengaktivasi creator yang relevan untuk mempromosikan produk brand kamu.' },
      { title: 'Struktur Komisi', desc: 'Skema komisi dirancang supaya adil bagi creator dan tetap menguntungkan brand.' },
      { title: 'Live Shopping', desc: 'Aktivasi host live shopping terlatih untuk mendorong konversi langsung.' },
      { title: 'Tracking Penjualan', desc: 'Performa penjualan tiap creator afiliasi dipantau secara berkala.' },
      { title: 'Laporan Transparan', desc: 'Metrik penjualan dan komisi dilaporkan secara jelas tiap periode campaign.' },
    ],
    workflow: [
      { title: 'Plan', desc: 'Diskusi target produk, margin, dan struktur komisi yang sesuai untuk brand kamu.' },
      { title: 'Match', desc: 'Kami merekrut creator afiliasi yang relevan dengan kategori produk kamu.' },
      { title: 'Execute', desc: 'Tim AzeraKOL mengaktivasi program afiliasi dan live shopping dari awal hingga berjalan.' },
      { title: 'Scale', desc: 'Analisis performa penjualan tiap creator dan optimalkan program secara berkelanjutan.' },
    ],
    pricing: [
      {
        badge: 'Starter',
        name: 'Setup Program Afiliasi',
        features: [
          'Setup program afiliasi TikTok Shop/Shopee',
          'Rekrutmen creator afiliasi awal',
          'Struktur komisi dasar',
          'Pendampingan 1 PIC dedicated',
        ],
      },
      {
        badge: 'Enterprise',
        name: 'Program Afiliasi & Live Shopping Skala Besar',
        dark: true,
        features: [
          'Rekrutmen creator afiliasi skala besar',
          'Live shopping host terlatih',
          'Dashboard tracking penjualan real-time',
          'Dedicated campaign manager & laporan berkala',
        ],
      },
    ],
    faq: [
      { question: 'Platform afiliasi apa saja yang didukung?', answer: 'TikTok Shop dan Shopee jadi fokus utama, dengan opsi ekspansi ke platform e-commerce lain sesuai kebutuhan brand.' },
      { question: 'Bagaimana struktur komisi ditentukan?', answer: 'Struktur komisi didiskusikan bersama brand berdasarkan margin produk, supaya adil bagi creator dan tetap menguntungkan brand.' },
      { question: 'Apakah program afiliasi terus berjalan setelah campaign selesai?', answer: 'Ya, program afiliasi dirancang untuk berjalan berkelanjutan, bukan hanya selama periode campaign aktif.' },
      { question: 'Apa itu live shopping host?', answer: 'Creator terlatih yang membawakan sesi live selling produk brand kamu secara langsung di TikTok Shop atau Instagram Live untuk mendorong konversi.' },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}
