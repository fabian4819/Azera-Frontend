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
    slug: 'nano-micro-kol-campaign',
    navLabel: 'Nano-Micro KOL Campaign',
    portfolioCategory: 'KOL Campaign',
    eyebrow: 'Core Service',
    headlinePlain: 'Nano-Micro KOL',
    headlineHighlight: 'Campaign',
    subheading: 'Campaign Bersama Puluhan hingga Ribuan Nano-Micro KOL',
    tags: ['#Awareness', '#Engagement', '#Review Produk', '#Product Launch'],
    description: [
      'Lebih dari sekadar jumlah KOL.',
      'Campaign bersama puluhan hingga ribuan nano-micro KOL untuk meningkatkan awareness, engagement, review, dan peluncuran produk brand kamu.',
    ],
    scopeTitle: 'Cakupan Layanan',
    scope: [
      { title: 'Skala Fleksibel', desc: 'Jalankan campaign dengan puluhan hingga ribuan nano-micro KOL sesuai kebutuhan brand.' },
      { title: 'Kurasi Ketat', desc: 'Setiap KOL melalui proses seleksi untuk menghindari fake followers dan engagement rendah.' },
      { title: 'Multi-Tujuan Campaign', desc: 'Cocok untuk awareness, engagement, review produk, hingga product launch.' },
      { title: 'Multi-Platform', desc: 'Instagram, TikTok, dan platform sosial utama lainnya didukung dalam satu campaign.' },
      { title: 'End-to-End Management', desc: 'Briefing, review konten, hingga publikasi ditangani penuh oleh tim AzeraKOL.' },
      { title: 'Laporan Transparan', desc: 'Metrik performa yang relevan dilaporkan untuk tiap campaign yang berjalan.' },
    ],
    workflow: [
      { title: 'Plan', desc: 'Diskusi kebutuhan campaign, target audiens, dan tujuan bisnis brand kamu bersama tim AzeraKOL.' },
      { title: 'Match', desc: 'Kami menyeleksi dan menyajikan shortlist nano-micro KOL yang paling relevan berdasarkan data.' },
      { title: 'Execute', desc: 'Tim AzeraKOL mengelola seluruh proses dari briefing KOL, review konten, hingga publikasi.' },
      { title: 'Scale', desc: 'Analisis performa campaign dan optimalkan untuk hasil yang maksimal.' },
    ],
    pricing: [
      {
        badge: 'Starter',
        name: 'Campaign Puluhan KOL',
        features: [
          'Kurasi nano-micro KOL sesuai niche',
          'Briefing & review konten',
          'Laporan performa akhir campaign',
          'Pendampingan 1 PIC dedicated',
        ],
      },
      {
        badge: 'Enterprise',
        name: 'Campaign Skala Ribuan KOL',
        dark: true,
        features: [
          'Kurasi nano-micro KOL skala besar',
          'Manajemen multi-platform (IG, TikTok, dll)',
          'Dashboard tracking real-time',
          'Dedicated campaign manager & laporan berkala',
        ],
      },
    ],
    faq: [
      { question: 'Berapa banyak KOL yang bisa dilibatkan dalam satu campaign?', answer: 'Skala campaign fleksibel, mulai dari puluhan hingga ribuan nano-micro KOL, disesuaikan dengan kebutuhan dan budget brand kamu.' },
      { question: 'Bagaimana proses seleksi KOL dilakukan?', answer: 'Kami menyaring KOL berdasarkan niche, demografi audiens, engagement rate, dan histori performa, lalu menyajikan shortlist untuk kamu review dan setujui.' },
      { question: 'Apakah bisa untuk product launch?', answer: 'Bisa. Campaign nano-micro KOL cocok untuk awareness, engagement, review produk, maupun peluncuran produk baru.' },
      { question: 'Bagaimana kalau konten KOL tidak sesuai brief?', answer: 'Setiap konten melalui tahap review sebelum publikasi, jadi revisi bisa dilakukan sebelum konten tayang.' },
    ],
  },
  {
    slug: 'koc-campaign',
    navLabel: 'KOC Campaign',
    portfolioCategory: 'KOC Campaign',
    eyebrow: 'Core Service',
    headlinePlain: 'KOC',
    headlineHighlight: 'Campaign',
    subheading: 'Aktivasi Everyday Consumers untuk Konten Autentik Skala Besar',
    tags: ['#Authentic Review', '#Product Seeding', '#UGC', '#Mass Content Distribution'],
    description: [
      'Lebih dari sekadar review biasa.',
      'Aktivasi everyday consumers dan small creators untuk menghasilkan authentic reviews, product seeding, social media posting, mass content distribution, dan UGC sesuai kebutuhan campaign.',
    ],
    scopeTitle: 'Cakupan Layanan',
    scope: [
      { title: 'Everyday Consumers', desc: 'Aktivasi konsumen sehari-hari dan small creators, bukan hanya KOL profesional.' },
      { title: 'Authentic Review', desc: 'Konten review yang terasa natural dan dipercaya audiens.' },
      { title: 'Product Seeding', desc: 'Distribusi produk ke KOC untuk menghasilkan konten organik.' },
      { title: 'Mass Content Distribution', desc: 'Volume konten besar tersebar di banyak akun sekaligus.' },
      { title: 'UGC Sesuai Kebutuhan', desc: 'Format UGC disesuaikan dengan tujuan campaign brand kamu.' },
      { title: 'Laporan Transparan', desc: 'Metrik distribusi dan performa konten dilaporkan tiap campaign.' },
    ],
    workflow: [
      { title: 'Plan', desc: 'Diskusi target produk, format UGC, dan volume konten yang dibutuhkan brand kamu.' },
      { title: 'Match', desc: 'Kami mengaktivasi KOC dan small creators yang relevan dengan produk kamu.' },
      { title: 'Execute', desc: 'Tim AzeraKOL mengelola product seeding, briefing, hingga distribusi konten massal.' },
      { title: 'Scale', desc: 'Analisis performa konten dan optimalkan distribusi untuk hasil maksimal.' },
    ],
    pricing: [
      {
        badge: 'Starter',
        name: 'Aktivasi KOC Fokus Niche',
        features: [
          'Aktivasi KOC & small creators sesuai niche',
          'Product seeding awal',
          'Laporan distribusi akhir campaign',
          'Pendampingan 1 PIC dedicated',
        ],
      },
      {
        badge: 'Enterprise',
        name: 'Mass Content Distribution Skala Besar',
        dark: true,
        features: [
          'Aktivasi KOC skala besar lintas niche',
          'Product seeding & UGC production terstruktur',
          'Dashboard tracking distribusi real-time',
          'Dedicated campaign manager & laporan berkala',
        ],
      },
    ],
    faq: [
      { question: 'Apa bedanya KOC dengan KOL?', answer: 'KOC (Key Opinion Consumer) adalah konsumen sehari-hari dan small creators yang membuat konten review autentik, berbeda dari KOL yang biasanya sudah punya audiens besar dan dikenal sebagai figur publik.' },
      { question: 'Apa itu product seeding?', answer: 'Proses mengirimkan produk brand kamu ke KOC agar mereka membuat konten review atau UGC secara organik berdasarkan pengalaman menggunakan produk.' },
      { question: 'Berapa volume konten yang bisa dihasilkan?', answer: 'Volume konten disesuaikan dengan skala campaign, mulai dari puluhan hingga ratusan konten dari KOC yang berbeda.' },
      { question: 'Apakah kontennya bisa dipakai ulang oleh brand?', answer: 'Bisa, tergantung kesepakatan hak penggunaan konten yang didiskusikan di awal campaign.' },
    ],
  },
  {
    slug: 'affiliate-creator-campaign',
    navLabel: 'Affiliate Creator Campaign',
    portfolioCategory: 'Affiliate Campaign',
    eyebrow: 'Core Service',
    headlinePlain: 'Affiliate Creator',
    headlineHighlight: 'Campaign',
    subheading: 'Campaign Berbasis Performa untuk Dorong Penjualan Nyata',
    tags: ['#Traffic', '#Conversion', '#Sales', '#GMV'],
    description: [
      'Lebih dari sekadar promosi.',
      'Campaign berbasis performa bersama affiliate creators untuk mendorong traffic, conversion, sales, commission, dan GMV brand kamu.',
    ],
    scopeTitle: 'Cakupan Layanan',
    scope: [
      { title: 'Setup Program Afiliasi', desc: 'Struktur program afiliasi disiapkan dari awal hingga siap jalan.' },
      { title: 'Rekrutmen Affiliate Creator', desc: 'Mencari dan mengaktivasi creator yang relevan untuk mempromosikan produk brand kamu.' },
      { title: 'Struktur Komisi', desc: 'Skema komisi dirancang supaya adil bagi creator dan tetap menguntungkan brand.' },
      { title: 'Fokus pada Traffic & Conversion', desc: 'Campaign diarahkan untuk mendorong traffic dan konversi nyata, bukan sekadar impresi.' },
      { title: 'Tracking Penjualan & GMV', desc: 'Performa penjualan dan GMV tiap creator dipantau secara berkala.' },
      { title: 'Laporan Transparan', desc: 'Metrik sales dan komisi dilaporkan secara jelas tiap periode campaign.' },
    ],
    workflow: [
      { title: 'Plan', desc: 'Diskusi target produk, margin, dan struktur komisi yang sesuai untuk brand kamu.' },
      { title: 'Match', desc: 'Kami merekrut affiliate creator yang relevan dengan kategori produk kamu.' },
      { title: 'Execute', desc: 'Tim AzeraKOL mengaktivasi program afiliasi dari awal hingga berjalan.' },
      { title: 'Scale', desc: 'Analisis performa traffic, conversion, dan GMV lalu optimalkan program secara berkelanjutan.' },
    ],
    pricing: [
      {
        badge: 'Starter',
        name: 'Setup Program Afiliasi',
        features: [
          'Setup program affiliate creator',
          'Rekrutmen affiliate creator awal',
          'Struktur komisi dasar',
          'Pendampingan 1 PIC dedicated',
        ],
      },
      {
        badge: 'Enterprise',
        name: 'Program Afiliasi Skala Besar',
        dark: true,
        features: [
          'Rekrutmen affiliate creator skala besar',
          'Optimasi traffic, conversion, dan GMV berkelanjutan',
          'Dashboard tracking penjualan real-time',
          'Dedicated campaign manager & laporan berkala',
        ],
      },
    ],
    faq: [
      { question: 'Apa itu Affiliate Creator Campaign?', answer: 'Campaign berbasis performa di mana creator mempromosikan produk brand kamu dan mendapat komisi dari penjualan yang berhasil dikonversi lewat link atau kode afiliasi mereka.' },
      { question: 'Bagaimana struktur komisi ditentukan?', answer: 'Struktur komisi didiskusikan bersama brand berdasarkan margin produk, supaya adil bagi creator dan tetap menguntungkan brand.' },
      { question: 'Apa yang dimaksud dengan GMV?', answer: 'GMV (Gross Merchandise Value) adalah total nilai transaksi penjualan yang dihasilkan dari campaign affiliate creator kamu.' },
      { question: 'Apakah program afiliasi terus berjalan setelah campaign selesai?', answer: 'Ya, program afiliasi dirancang untuk berjalan berkelanjutan, bukan hanya selama periode campaign aktif.' },
    ],
  },
  {
    slug: 'event-creator-activation',
    navLabel: 'Event Creator Activation',
    portfolioCategory: 'Event Activation',
    eyebrow: 'Core Service',
    headlinePlain: 'Event Creator',
    headlineHighlight: 'Activation',
    subheading: 'Ramaikan Event Kamu dengan KOC dan Nano Creators',
    tags: ['#Live Content', '#On-Ground Excitement', '#Event Exposure', '#Social Media Coverage'],
    description: [
      'Lebih dari sekadar kehadiran.',
      'Aktivasi KOC dan nano creators untuk menghadiri serta meramaikan event, menghasilkan live content, membangun on-ground excitement, dan memperluas exposure event kamu di media sosial.',
    ],
    scopeTitle: 'Cakupan Layanan',
    scope: [
      { title: 'Kehadiran KOC & Nano Creators', desc: 'Creator hadir langsung meramaikan event brand kamu.' },
      { title: 'Live Content', desc: 'Konten live dari lokasi event untuk memperkuat exposure real-time.' },
      { title: 'On-Ground Excitement', desc: 'Membangun antusiasme dan interaksi langsung di lokasi event.' },
      { title: 'Perluasan Exposure Media Sosial', desc: 'Momen event diperluas jangkauannya lewat konten di media sosial creator.' },
      { title: 'Kurasi Creator Relevan', desc: 'Creator dipilih sesuai tema dan target audiens event.' },
      { title: 'Laporan Transparan', desc: 'Dokumentasi dan metrik exposure event dilaporkan usai kegiatan.' },
    ],
    workflow: [
      { title: 'Plan', desc: 'Diskusi konsep event, jumlah creator, dan target exposure yang diinginkan brand kamu.' },
      { title: 'Match', desc: 'Kami menyeleksi KOC dan nano creators yang sesuai tema dan audiens event.' },
      { title: 'Execute', desc: 'Tim AzeraKOL mengelola kehadiran creator, live content, hingga dokumentasi event.' },
      { title: 'Scale', desc: 'Analisis exposure dan engagement dari konten event untuk campaign berikutnya.' },
    ],
    pricing: [
      {
        badge: 'Starter',
        name: 'Aktivasi Event Skala Kecil',
        features: [
          'Kehadiran KOC & nano creators terkurasi',
          'Live content dari lokasi event',
          'Laporan exposure akhir kegiatan',
          'Pendampingan 1 PIC dedicated',
        ],
      },
      {
        badge: 'Enterprise',
        name: 'Aktivasi Event Skala Besar',
        dark: true,
        features: [
          'Kehadiran creator dalam jumlah besar',
          'Liputan live content multi-platform',
          'Dashboard tracking exposure real-time',
          'Dedicated campaign manager & laporan berkala',
        ],
      },
    ],
    faq: [
      { question: 'Jenis event apa saja yang bisa diaktivasi?', answer: 'Beragam jenis event brand, mulai dari product launch, grand opening, pameran, hingga event komunitas, bisa diaktivasi dengan KOC dan nano creators.' },
      { question: 'Apakah creator membuat konten secara live saat event?', answer: 'Ya, creator menghasilkan live content dari lokasi event untuk memperkuat exposure secara real-time di media sosial.' },
      { question: 'Berapa banyak creator yang bisa hadir dalam satu event?', answer: 'Jumlah creator disesuaikan dengan skala event dan kebutuhan brand, dari kelompok kecil hingga aktivasi skala besar.' },
      { question: 'Apakah ada dokumentasi hasil setelah event selesai?', answer: 'Ya, kami menyediakan laporan dokumentasi dan metrik exposure dari seluruh konten yang dihasilkan creator selama event berlangsung.' },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}
