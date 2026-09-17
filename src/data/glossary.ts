export interface GlossarySection {
  heading: string;
  body: string;
}

export type GlossaryCategory = 'tiers' | 'metrics' | 'ops' | 'commerce' | 'content' | 'strategy';

export interface GlossaryTerm {
  term: string;
  slug: string;
  category: GlossaryCategory;
  summary: string;
  sections: GlossarySection[];
}

export interface CategoryPhoto {
  url: string;
  photographer: string;
  photographerUrl: string;
}

function slugify(term: string) {
  return term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Beberapa foto Unsplash per kategori (bukan per istilah, biar tidak nabrak rate limit 50 req/jam versi
// demo) — cukup untuk kasih tiap istilah dalam satu kategori foto yang berbeda, lihat getTermPhoto().
const categoryPhotos: Record<GlossaryCategory, CategoryPhoto[]> = {
  tiers: [
    { url: 'https://images.unsplash.com/photo-1683721003111-070bcc053d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Mariia Berezovsky', photographerUrl: 'https://unsplash.com/@mariiaberezovsky' },
    { url: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Adem AY', photographerUrl: 'https://unsplash.com/@ademay' },
    { url: 'https://images.unsplash.com/photo-1726066012749-f81bf4422d4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'SumUp', photographerUrl: 'https://unsplash.com/@sumup' },
    { url: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Merakist', photographerUrl: 'https://unsplash.com/@merakist' },
    { url: 'https://images.unsplash.com/photo-1556764900-fa065610b0e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Maddi Bazzocco', photographerUrl: 'https://unsplash.com/@maddibazzocco' },
    { url: 'https://images.unsplash.com/photo-1724754608903-79368ccef14a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Swello', photographerUrl: 'https://unsplash.com/@getswello' },
    { url: 'https://images.unsplash.com/photo-1722172597269-d911054badb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Igor Omilaev', photographerUrl: 'https://unsplash.com/@omilaev' },
    { url: 'https://images.unsplash.com/photo-1675518334039-960154e902c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Lance Reis', photographerUrl: 'https://unsplash.com/@lancereis' },
    { url: 'https://images.unsplash.com/photo-1643503640904-75c1a2093570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Aman Pal', photographerUrl: 'https://unsplash.com/@paman0744' },
  ],
  metrics: [
    { url: 'https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Deng Xiang', photographerUrl: 'https://unsplash.com/@dengxiangs' },
    { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Luke Chesser', photographerUrl: 'https://unsplash.com/@lukechesser' },
    { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Carlos Muza', photographerUrl: 'https://unsplash.com/@kmuza' },
    { url: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Stephen Dawson', photographerUrl: 'https://unsplash.com/@dawson2406' },
    { url: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Markus Winkler', photographerUrl: 'https://unsplash.com/@markuswinkler' },
    { url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Stephen Phillips - Hostreviews.co.uk', photographerUrl: 'https://unsplash.com/@hostreviews' },
    { url: 'https://images.unsplash.com/photo-1686061594225-3e92c0cd51b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: '1981 Digital', photographerUrl: 'https://unsplash.com/@1981digital' },
    { url: 'https://images.unsplash.com/photo-1560221328-12fe60f83ab8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Nicholas Cappello', photographerUrl: 'https://unsplash.com/@bash__profile' },
    { url: 'https://images.unsplash.com/photo-1686061593213-98dad7c599b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: '1981 Digital', photographerUrl: 'https://unsplash.com/@1981digital' },
    { url: 'https://images.unsplash.com/photo-1686061592689-312bbfb5c055?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: '1981 Digital', photographerUrl: 'https://unsplash.com/@1981digital' },
  ],
  ops: [
    { url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Dylan Gillis', photographerUrl: 'https://unsplash.com/@mainermedia' },
    { url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Annie Spratt', photographerUrl: 'https://unsplash.com/@anniespratt' },
    { url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Austin Distel', photographerUrl: 'https://unsplash.com/@austindistel' },
    { url: 'https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Memento Media', photographerUrl: 'https://unsplash.com/@heymemento' },
    { url: 'https://images.unsplash.com/photo-1688380692117-63178554d76d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Fatemeh Rezvani', photographerUrl: 'https://unsplash.com/@irzvn_' },
    { url: 'https://images.unsplash.com/photo-1532622785990-d2c36a76f5a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Kaleidico', photographerUrl: 'https://unsplash.com/@kaleidico' },
    { url: 'https://images.unsplash.com/photo-1581091877018-dac6a371d50f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'ThisisEngineering', photographerUrl: 'https://unsplash.com/@thisisengineering' },
    { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Annie Spratt', photographerUrl: 'https://unsplash.com/@anniespratt' },
    { url: 'https://images.unsplash.com/photo-1630487656049-6db93a53a7e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Andreea Avramescu', photographerUrl: 'https://unsplash.com/@minakko' },
    { url: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Annie Spratt', photographerUrl: 'https://unsplash.com/@anniespratt' },
  ],
  commerce: [
    { url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'rupixen', photographerUrl: 'https://unsplash.com/@rupixen' },
    { url: 'https://images.unsplash.com/photo-1674027392887-751d6396b710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Growtika', photographerUrl: 'https://unsplash.com/@growtika' },
    { url: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Igor Miske', photographerUrl: 'https://unsplash.com/@igormiske' },
    { url: 'https://images.unsplash.com/photo-1674027392857-9aed6e8ecab9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Growtika', photographerUrl: 'https://unsplash.com/@growtika' },
    { url: 'https://images.unsplash.com/photo-1674027392842-29f8354e236c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Growtika', photographerUrl: 'https://unsplash.com/@growtika' },
    { url: 'https://images.unsplash.com/photo-1612103198005-b238154f4590?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'CardMapr.nl', photographerUrl: 'https://unsplash.com/@cardmapr' },
    { url: 'https://images.unsplash.com/photo-1763872038252-e6c4e0a11067?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Money Knack', photographerUrl: 'https://unsplash.com/@moneyknack' },
    { url: 'https://images.unsplash.com/photo-1698128255721-f9a9ad2da830?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Julio Lopez', photographerUrl: 'https://unsplash.com/@juliolopez' },
    { url: 'https://images.unsplash.com/photo-1674027392838-d85710a5121d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Growtika', photographerUrl: 'https://unsplash.com/@growtika' },
  ],
  content: [
    { url: 'https://images.unsplash.com/photo-1497015289639-54688650d173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Sam McGhee', photographerUrl: 'https://unsplash.com/@sammcghee' },
    { url: 'https://images.unsplash.com/photo-1611784728558-6c7d9b409cdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Kyle Loftus', photographerUrl: 'https://unsplash.com/@kyleloftusstudios' },
    { url: 'https://images.unsplash.com/photo-1630797160666-38e8c5ba44c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Andrés', photographerUrl: 'https://unsplash.com/@andresssssssq' },
    { url: 'https://images.unsplash.com/photo-1594394489098-74ac04c0fc2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Jesus Loves Austin', photographerUrl: 'https://unsplash.com/@jesuslovesaustin' },
    { url: 'https://images.unsplash.com/photo-1695408247109-3bf125ad0538?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Wesley Tingey', photographerUrl: 'https://unsplash.com/@wesleyphotography' },
    { url: 'https://images.unsplash.com/photo-1535540878298-a155c6d065ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Ross Sneddon', photographerUrl: 'https://unsplash.com/@rosssneddon' },
    { url: 'https://images.unsplash.com/photo-1496559249665-c7e2874707ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Steven Van', photographerUrl: 'https://unsplash.com/@stevenvan_' },
    { url: 'https://images.unsplash.com/photo-1603126004251-d01882b9bfd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Kyle Loftus', photographerUrl: 'https://unsplash.com/@kyleloftusstudios' },
    { url: 'https://images.unsplash.com/photo-1560785219-cc81ab373cd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Kyle Loftus', photographerUrl: 'https://unsplash.com/@kyleloftusstudios' },
  ],
  strategy: [
    { url: 'https://images.unsplash.com/photo-1596008194705-2091cd6764d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Mauro Gigli', photographerUrl: 'https://unsplash.com/@maurogigliphoto' },
    { url: 'https://images.unsplash.com/photo-1768839722142-a980c55e994b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Sasun Bughdaryan', photographerUrl: 'https://unsplash.com/@sasun1990' },
    { url: 'https://images.unsplash.com/photo-1775590766125-3b49bece6c22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Sasun Bughdaryan', photographerUrl: 'https://unsplash.com/@sasun1990' },
    { url: 'https://images.unsplash.com/photo-1654588836487-6455d85c2211?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Sasun Bughdaryan', photographerUrl: 'https://unsplash.com/@sasun1990' },
    { url: 'https://images.unsplash.com/photo-1628440501245-393606514a9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Afif Ramdhasuma', photographerUrl: 'https://unsplash.com/@javaistan' },
    { url: 'https://images.unsplash.com/photo-1753779665626-514dae5d0fb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200', photographer: 'Dilan Hiranya', photographerUrl: 'https://unsplash.com/@_frank__y_' },
  ],
};

// Istilah KOL & influencer marketing, diurutkan A-Z. Konten ditulis sendiri, bukan salinan dari sumber luar.
const rawTerms: Array<Omit<GlossaryTerm, 'slug'>> = [
  {
    term: 'Affiliate Marketing',
    category: 'commerce',
    summary: 'Model kerja sama di mana creator dibayar komisi dari setiap penjualan yang berhasil lewat link atau kode unik miliknya.',
    sections: [
      { heading: 'Cara Kerja', body: 'Brand memberi creator sebuah tracking link atau kode referral khusus. Setiap transaksi yang tercatat lewat link/kode itu otomatis dihitung sebagai kontribusi creator, dan komisi dibayarkan berdasarkan persentase dari nilai transaksi tersebut.' },
      { heading: 'Kenapa Diminati Brand', body: 'Affiliate marketing membuat biaya campaign lebih terukur karena brand hanya membayar saat ada hasil penjualan nyata, bukan sekadar eksposur. Model ini populer lewat fitur TikTok Shop Affiliate dan program afiliasi e-commerce.' },
      { heading: 'Jenis-jenis Affiliate Marketing', body: 'Ada beberapa bentuk umum: content-based (lewat artikel/video review), coupon & deal sites, email marketing, hingga influencer affiliate yang menggabungkan kredibilitas personal dengan link komisi.' },
      { heading: 'Kelebihan & Tantangannya', body: 'Kelebihannya, brand hanya bayar saat ada hasil dan creator bisa dapat penghasilan pasif dari konten lama. Tantangannya, persaingan antar affiliate cukup ketat dan penghasilan creator sangat bergantung pada performa produk brand yang dipromosikan.' },
    ],
  },
  {
    term: 'Ambassador',
    category: 'tiers',
    summary: 'Creator yang terikat kontrak jangka panjang untuk mewakili citra sebuah brand secara berkelanjutan, bukan cuma sekali kolaborasi.',
    sections: [
      { heading: 'Beda dengan Kolaborasi Biasa', body: 'Ambassador biasanya wajib memakai produk brand secara rutin, muncul di berbagai campaign, dan kadang dilibatkan dalam acara resmi brand. Durasi kontraknya bisa berbulan-bulan hingga tahunan.' },
      { heading: 'Kenapa Brand Memilih Skema Ini', body: 'Hubungan jangka panjang membuat asosiasi antara ambassador dan brand terasa lebih kuat dan konsisten di mata audiens, dibanding kolaborasi satu kali yang mudah dilupakan.' },
      { heading: 'Tanggung Jawab Tambahan', body: 'Selain posting rutin, ambassador biasanya diminta hadir di acara brand, memberi masukan produk, atau jadi wajah utama campaign besar sepanjang masa kontrak.' },
      { heading: 'Kelebihan & Risikonya', body: 'Kelebihannya, hubungan yang konsisten membangun asosiasi kuat antara ambassador dan brand. Risikonya, reputasi brand jadi sangat terikat pada personal branding ambassador tersebut — kalau kontroversi menimpa ambassador, brand ikut terdampak.' },
    ],
  },
  {
    term: 'Audience Demographics',
    category: 'metrics',
    summary: 'Data profil audiens sebuah akun — usia, gender, lokasi, hingga minat — yang dipakai brand menilai kecocokan target pasar.',
    sections: [
      { heading: 'Data yang Biasa Dilihat', body: 'Brand umumnya mengecek persentase gender, rentang usia terbanyak, sebaran kota/negara, serta minat audiens berdasarkan insight platform seperti Instagram Insights atau TikTok Analytics.' },
      { heading: 'Kenapa Penting Sebelum Kerja Sama', body: 'Follower banyak tidak berguna kalau demografinya tidak sesuai target pasar brand. Audience demographics jadi salah satu filter utama saat kurasi KOL.' },
      { heading: 'Cara Mengaksesnya', body: 'Data ini biasanya dilihat lewat fitur analitik bawaan platform yang hanya bisa diakses pemilik akun, sehingga brand umumnya meminta screenshot langsung dari creator sebagai bagian dari media kit.' },
    ],
  },
  {
    term: 'Authenticity',
    category: 'strategy',
    summary: 'Kesan bahwa konten dan opini creator terasa jujur dan alami, bukan sekadar promosi berbayar yang dipaksakan.',
    sections: [
      { heading: 'Faktor yang Mempengaruhi', body: 'Gaya bahasa yang natural, pengalaman pribadi yang detail, serta kejujuran soal kekurangan produk membuat konten terasa lebih otentik dibanding endorsement yang terlalu scripted.' },
      { heading: 'Dampak ke Campaign', body: 'Audiens zaman sekarang makin peka membedakan promosi tulus dan paksaan, sehingga authenticity berpengaruh langsung ke tingkat kepercayaan dan konversi campaign.' },
      { heading: 'Cara Menjaganya', body: 'Memberi creator ruang kreatif alih-alih naskah kaku, memilih creator yang memang cocok dengan brand, dan membiarkan mereka menyampaikan opini jujur adalah cara umum menjaga authenticity tetap terasa nyata.' },
    ],
  },
  {
    term: 'Awareness Campaign',
    category: 'strategy',
    summary: 'Campaign yang tujuan utamanya memperkenalkan brand atau produk ke audiens seluas mungkin, bukan mendorong penjualan langsung.',
    sections: [
      { heading: 'Metrik yang Dipakai', body: 'Karena fokusnya eksposur, awareness campaign biasanya diukur lewat reach, impression, dan jumlah akun unik yang melihat konten, bukan angka konversi atau penjualan.' },
      { heading: 'Kapan Cocok Dipakai', body: 'Cocok untuk brand baru, produk baru, atau saat brand ingin masuk ke pasar/audiens baru yang belum familiar dengan mereka.' },
      { heading: 'Contoh Taktiknya', body: 'Bisa berupa product seeding ke banyak nano/micro influencer sekaligus, challenge/hashtag campaign, atau kolaborasi dengan macro/mega influencer untuk eksposur cepat dalam waktu singkat.' },
    ],
  },
  {
    term: 'Brand Awareness',
    category: 'strategy',
    summary: 'Tingkat seberapa familiar dan mudah dikenali sebuah brand di mata konsumen.',
    sections: [
      { heading: 'Cara Mengukurnya', body: 'Bisa dilihat dari survei recall (apakah konsumen ingat nama brand tanpa dipancing), volume percakapan di media sosial, atau pertumbuhan pencarian nama brand di mesin pencari.' },
      { heading: 'Peran KOL di Dalamnya', body: 'KOL membantu brand awareness dengan memperkenalkan produk lewat sudut pandang yang personal dan dipercaya audiensnya, lebih efektif dibanding iklan konvensional untuk sebagian segmen.' },
      { heading: 'Tahapan Menuju Brand Loyalty', body: 'Brand awareness biasanya jadi tahap paling awal dalam funnel pemasaran, sebelum konsumen berlanjut ke tahap pertimbangan, pembelian, hingga akhirnya loyal terhadap brand.' },
    ],
  },
  {
    term: 'Brand Fit',
    category: 'strategy',
    summary: 'Kesesuaian antara citra, nilai, dan gaya konten seorang creator dengan identitas brand yang mengajak kerja sama.',
    sections: [
      { heading: 'Yang Dinilai', body: 'Brand biasanya mengecek histori konten creator, niche yang digeluti, tone komunikasi, sampai reputasi personal — apakah semua itu selaras dengan positioning brand.' },
      { heading: 'Kenapa Sering Diabaikan tapi Krusial', body: 'Creator dengan follower besar tapi brand fit rendah justru bisa membuat campaign terasa dipaksakan dan kurang dipercaya audiens, walau angkanya di atas kertas terlihat bagus.' },
      { heading: 'Contoh Ketidakcocokan', body: 'Misalnya brand skincare halal bekerja sama dengan creator yang kontennya sering menyinggung isu sensitif — meski followernya besar, ketidakcocokan nilai ini bisa membuat campaign terasa janggal di mata audiens.' },
    ],
  },
  {
    term: 'Brand Safety',
    category: 'strategy',
    summary: 'Upaya memastikan konten creator tidak mengandung isu sensitif atau kontroversial yang bisa merugikan reputasi brand.',
    sections: [
      { heading: 'Aspek yang Dicek', body: 'Termasuk riwayat konten lama creator, potensi kontroversi personal, bahasa yang dipakai, hingga konteks tempat iklan brand akan muncul (misalnya di samping konten berita negatif).' },
      { heading: 'Kenapa Brand Sangat Hati-hati', body: 'Satu kontroversi dari creator yang bekerja sama bisa langsung berdampak ke reputasi brand, sehingga proses vetting brand safety kini jadi tahap wajib sebelum tanda tangan kontrak.' },
      { heading: 'Langkah Vetting Umum', body: 'Tim brand atau agency biasanya menelusuri riwayat konten dan komentar creator beberapa bulan ke belakang, mengecek pemberitaan negatif, serta memastikan tidak ada afiliasi dengan isu kontroversial sebelum kontrak diteken.' },
    ],
  },
  {
    term: 'Briefing',
    category: 'ops',
    summary: "Dokumen arahan dari brand ke creator berisi tujuan campaign, pesan kunci, do & don't, serta deliverable yang diharapkan.",
    sections: [
      { heading: 'Isi Umum Sebuah Briefing', body: "Biasanya mencakup latar belakang produk, target audiens, key message yang wajib disampaikan, larangan (misalnya menyebut kompetitor), tenggat waktu, dan format konten yang diminta." },
      { heading: 'Kenapa Briefing yang Jelas Penting', body: 'Briefing yang detail mengurangi revisi bolak-balik dan membantu creator tetap punya ruang kreatif tanpa keluar dari tujuan campaign brand.' },
      { heading: 'Tips Membuat Briefing yang Baik', body: 'Briefing yang efektif biasanya singkat tapi jelas: satu halaman berisi tujuan, key message, dan batasan, dilengkapi contoh referensi visual atau nada bicara yang diinginkan brand.' },
    ],
  },
  {
    term: 'Call to Action (CTA)',
    category: 'content',
    summary: 'Ajakan eksplisit di akhir konten agar audiens melakukan aksi tertentu, misalnya klik link, follow, atau beli produk.',
    sections: [
      { heading: 'Contoh Bentuk CTA', body: "Bisa berupa kalimat langsung ('Klik link di bio'), tombol swipe-up, kode promo terbatas waktu, atau ajakan komentar untuk meningkatkan interaksi." },
      { heading: 'Kenapa Penempatannya Penting', body: 'CTA yang terlalu dipaksakan di awal konten bisa terasa hard selling. Kebanyakan campaign menaruh CTA di akhir, setelah audiens sudah teredukasi atau terhibur oleh kontennya.' },
      { heading: 'Contoh CTA yang Efektif', body: "'Cek link di bio sebelum kehabisan', 'Komen KODE buat dapat diskon', atau 'Follow biar gak ketinggalan part 2' adalah contoh CTA yang terasa natural dan tidak seperti iklan keras." },
    ],
  },
  {
    term: 'Case Study',
    category: 'ops',
    summary: 'Rangkuman hasil sebuah campaign yang telah selesai, biasanya berisi metrik performa dan pembelajaran untuk campaign berikutnya.',
    sections: [
      { heading: 'Komponen Umum', body: 'Berisi tujuan awal campaign, strategi yang dijalankan, kreator yang dilibatkan, dan hasil akhir dibanding target (reach, engagement, penjualan, dsb).' },
      { heading: 'Manfaatnya', body: 'Case study jadi bukti kredibilitas agency atau KOL ke calon klien baru, sekaligus bahan evaluasi internal untuk memperbaiki strategi campaign selanjutnya.' },
      { heading: 'Format Umum yang Dipakai', body: 'Biasanya disusun dalam format sebelum-sesudah: kondisi awal brand, strategi yang dijalankan, lalu hasil akhir dengan data konkret — sering dilengkapi kutipan testimoni dari klien.' },
    ],
  },
  {
    term: 'Content Calendar',
    category: 'ops',
    summary: 'Jadwal terstruktur berisi kapan setiap konten campaign akan diunggah di masing-masing platform.',
    sections: [
      { heading: 'Yang Biasanya Dicantumkan', body: 'Tanggal dan jam posting, platform tujuan, jenis konten (feed, story, reels), serta creator yang bertanggung jawab pada slot tersebut.' },
      { heading: 'Kenapa Dibutuhkan', body: 'Campaign yang melibatkan banyak creator sekaligus butuh content calendar agar ritme publikasi tidak menumpuk di satu hari atau malah kosong berhari-hari.' },
      { heading: 'Tools yang Biasa Dipakai', body: 'Bisa berupa spreadsheet sederhana, Notion, Trello, atau software khusus manajemen campaign — yang penting semua pihak (brand, agency, creator) bisa mengakses jadwal yang sama.' },
    ],
  },
  {
    term: 'Content Pillar',
    category: 'ops',
    summary: 'Tema-tema besar yang menjadi fondasi arah konten sebuah akun atau campaign secara konsisten.',
    sections: [
      { heading: 'Contoh Penerapan', body: 'Sebuah akun skincare misalnya bisa punya pillar seputar edukasi bahan aktif, review produk, dan rutinitas harian — semua konten dibuat berputar di sekitar tema-tema ini.' },
      { heading: 'Manfaat bagi Campaign', body: 'Content pillar membuat konten creator tetap relevan dengan brand tanpa terasa monoton, karena ada variasi sudut pandang dalam satu payung tema yang sama.' },
      { heading: 'Cara Menentukannya', body: 'Content pillar biasanya ditentukan dari kombinasi minat audiens, keahlian creator, dan tujuan brand — idealnya 3-5 pillar agar konten tetap fokus tapi tidak monoton.' },
    ],
  },
  {
    term: 'Conversion Rate',
    category: 'metrics',
    summary: 'Persentase audiens yang benar-benar melakukan aksi yang diinginkan (beli, daftar, klik) dari total yang melihat konten.',
    sections: [
      { heading: 'Cara Menghitung', body: 'Conversion rate = (jumlah aksi yang tercapai ÷ jumlah audiens yang melihat konten) × 100%. Aksi ini bisa berupa pembelian, pendaftaran, atau klik link tergantung tujuan campaign.' },
      { heading: 'Kenapa Lebih Berarti dari Sekadar Reach', body: 'Reach besar tidak selalu berarti hasil bagus. Conversion rate menunjukkan seberapa efektif konten benar-benar mendorong audiens mengambil tindakan nyata.' },
      { heading: 'Contoh Angka di Lapangan', body: 'Conversion rate campaign KOL di Indonesia umumnya bervariasi dari di bawah 1% untuk produk harga tinggi, hingga beberapa persen untuk produk impulsif dengan harga terjangkau dan CTA yang kuat.' },
    ],
  },
  {
    term: 'Creator Economy',
    category: 'strategy',
    summary: 'Ekosistem ekonomi yang terbentuk dari aktivitas para content creator, termasuk monetisasi, brand deal, dan platform pendukungnya.',
    sections: [
      { heading: 'Pemain di Dalamnya', body: 'Melibatkan creator, brand, platform (TikTok, Instagram, YouTube), agency KOL, hingga tools pendukung seperti software editing dan analytics.' },
      { heading: 'Kenapa Terus Bertumbuh', body: 'Semakin banyak brand mengalihkan budget iklan konvensional ke kerja sama dengan creator, karena dianggap lebih personal dan efektif menjangkau audiens spesifik.' },
      { heading: 'Sumber Penghasilan Creator', body: 'Selain brand deal, creator economy juga mencakup monetisasi platform (ad revenue, TikTok Creator Fund), penjualan produk sendiri, afiliasi, hingga konten berbayar/subscription.' },
      { heading: 'Kenapa Brand Perlu Memahaminya', body: 'Memahami ekosistem ini membantu brand menyusun penawaran kerja sama yang kompetitif, karena creator kini punya banyak pilihan sumber penghasilan selain endorsement biasa.' },
    ],
  },
  {
    term: 'Deliverable',
    category: 'ops',
    summary: 'Output konkret yang wajib diserahkan creator sesuai kontrak, misalnya jumlah post, story, atau video.',
    sections: [
      { heading: 'Contoh Deliverable', body: 'Bisa berupa 1 video TikTok, 3 story Instagram dengan link swipe-up, atau 1 post feed plus caption sesuai key message — semuanya dirinci di kontrak atau briefing.' },
      { heading: 'Kenapa Harus Spesifik', body: 'Deliverable yang tidak jelas jumlah dan formatnya sering jadi sumber sengketa antara brand dan creator soal apa yang sebenarnya sudah disepakati.' },
      { heading: 'Contoh Klausul di Kontrak', body: "Misalnya: '1x Reels durasi 30-60 detik, 3x Story dengan sticker link, wajib tayang minimal 24 jam, revisi maksimal 1 kali sebelum tayang'." },
    ],
  },
  {
    term: 'Disclosure',
    category: 'ops',
    summary: "Pengungkapan yang jelas bahwa sebuah konten adalah hasil kerja sama berbayar, biasanya lewat label \"Ad\" atau \"#ads\".",
    sections: [
      { heading: 'Bentuk Disclosure', body: 'Bisa lewat fitur paid partnership platform, watermark di video, atau hashtag seperti #ad, #sponsored, #kerjasamaberbayar di caption.' },
      { heading: 'Kenapa Wajib', body: 'Selain jadi etika transparansi ke audiens, disclosure juga diatur regulasi periklanan di banyak negara — melanggar aturan ini bisa berisiko bagi brand maupun creator.' },
      { heading: 'Regulasi Terkait di Indonesia', body: 'Di Indonesia, praktik ini merujuk pada pedoman iklan yang mewajibkan transparansi konten berbayar, sejalan dengan aturan serupa di berbagai negara seperti FTC Guidelines di Amerika Serikat.' },
    ],
  },
  {
    term: 'Earned Media',
    category: 'content',
    summary: 'Eksposur brand yang didapat secara organik tanpa bayaran langsung, misalnya dibahas ulang oleh media atau warganet.',
    sections: [
      { heading: 'Contoh Earned Media', body: 'Review spontan dari pelanggan, liputan media karena campaign yang viral, atau repost organik dari akun lain tanpa brand membayar sepeser pun.' },
      { heading: 'Bedanya dengan Paid Media', body: 'Paid media didapat lewat iklan berbayar, sedangkan earned media murni karena kualitas produk atau campaign yang cukup menarik untuk dibicarakan orang secara sukarela.' },
      { heading: 'Cara Memicunya', body: 'Brand tidak bisa "membeli" earned media secara langsung, tapi bisa memicunya lewat produk yang benar-benar berkualitas, campaign kreatif yang layak dibicarakan, atau momen PR yang tepat waktu.' },
    ],
  },
  {
    term: 'Engagement Rate',
    category: 'metrics',
    summary: 'Rasio interaksi (like, comment, share, save) dibanding jumlah follower atau jumlah orang yang melihat konten.',
    sections: [
      { heading: 'Cara Menghitung', body: 'Umumnya engagement rate = (total like + comment + share + save) ÷ jumlah follower × 100%. Beberapa platform menghitungnya berdasarkan reach/impression, bukan follower.' },
      { heading: 'Kenapa Sering Jadi Patokan Utama', body: 'Engagement rate dianggap indikator lebih jujur dibanding jumlah follower, karena menunjukkan seberapa aktif dan peduli audiens terhadap konten creator, bukan cuma angka pengikut pasif.' },
      { heading: 'Rentang Wajar per Tier', body: 'Umumnya nano/micro influencer punya engagement rate lebih tinggi (bisa di atas 5-10%) dibanding macro/mega influencer yang sering di bawah 2-3%, karena kedekatan dengan audiens yang lebih personal.' },
    ],
  },
  {
    term: 'Exclusivity Clause',
    category: 'ops',
    summary: 'Klausul kontrak yang melarang creator bekerja sama dengan brand kompetitor dalam periode tertentu.',
    sections: [
      { heading: 'Contoh Penerapan', body: 'Misalnya creator dilarang mengiklankan produk skincare merek lain selama 3 bulan setelah campaign dengan satu brand skincare berakhir.' },
      { heading: 'Kenapa Perlu Dinegosiasikan', body: 'Exclusivity biasanya diikuti kompensasi tambahan karena membatasi peluang penghasilan creator dari brand lain di kategori yang sama selama periode tersebut.' },
      { heading: 'Cara Menegosiasikannya', body: 'Creator biasanya menaikkan fee kerja sama sebagai kompensasi eksklusivitas, atau meminta durasi periode larangan diperjelas dan dibatasi agar tidak menutup terlalu banyak peluang kerja sama lain.' },
    ],
  },
  {
    term: 'FYP (For You Page)',
    category: 'content',
    summary: 'Halaman rekomendasi konten personal di TikTok yang ditentukan algoritma berdasarkan perilaku pengguna.',
    sections: [
      { heading: 'Faktor yang Mempengaruhi Algoritma', body: 'Meliputi watch time, interaksi (like, comment, share), jenis konten yang sering ditonton pengguna, serta relevansi audio dan hashtag yang dipakai.' },
      { heading: 'Kenapa Jadi Incaran Campaign', body: 'Masuk FYP berarti konten berpotensi dilihat audiens jauh di luar follower creator, membuat campaign TikTok punya peluang jangkauan organik yang sangat besar.' },
      { heading: 'Tips Meningkatkan Peluang Masuk FYP', body: 'Menggunakan audio yang sedang tren, membuat hook kuat di 3 detik pertama, dan mendorong interaksi (komentar, share) di awal video adalah beberapa taktik umum yang dipakai creator.' },
    ],
  },
  {
    term: 'Gifting',
    category: 'commerce',
    summary: 'Bentuk kerja sama di mana creator menerima produk gratis sebagai imbalan atas konten yang dibuat, tanpa fee tambahan.',
    sections: [
      { heading: 'Kapan Biasanya Dipakai', body: 'Umum dilakukan ke nano atau micro influencer, atau saat brand baru ingin memperkenalkan produk tanpa budget campaign besar.' },
      { heading: 'Batasannya', body: 'Karena tanpa fee, brand biasanya tidak bisa memaksa creator membuat konten — banyak creator hanya bersedia posting kalau memang benar-benar suka produknya.' },
      { heading: 'Tips Menjalankan Gifting yang Efektif', body: 'Mengirim produk ke creator yang memang relevan dengan niche-nya (bukan asal kirim ke banyak orang), disertai catatan personal, meningkatkan peluang produk benar-benar dipakai dan dikonten-kan.' },
    ],
  },
  {
    term: 'GMV (Gross Merchandise Value)',
    category: 'metrics',
    summary: 'Total nilai transaksi penjualan yang dihasilkan dari sebuah campaign, terutama dipakai di TikTok Shop.',
    sections: [
      { heading: 'Cara Dihitung', body: 'GMV dihitung dari total nilai barang yang terjual lewat link, keranjang kuning, atau live shopping creator dalam periode campaign tertentu, sebelum dikurangi biaya apa pun.' },
      { heading: 'Kenapa Jadi Metrik Populer di Live Commerce', body: 'GMV langsung menunjukkan dampak penjualan riil dari sebuah campaign, sehingga jadi metrik favorit brand yang fokus ke affiliate dan live shopping campaign.' },
      { heading: 'Bukan Sama dengan Profit', body: 'GMV adalah nilai transaksi kotor sebelum dikurangi biaya produksi, komisi affiliate, diskon, dan biaya operasional lain — jadi angka GMV yang besar belum tentu berarti keuntungan brand besar juga.' },
    ],
  },
  {
    term: 'Hard Selling',
    category: 'commerce',
    summary: 'Gaya promosi yang langsung dan eksplisit mendorong audiens untuk membeli produk.',
    sections: [
      { heading: 'Ciri Kontennya', body: 'Biasanya berisi klaim keunggulan produk secara langsung, harga, diskon, dan CTA belanja yang tegas tanpa banyak basa-basi cerita.' },
      { heading: 'Kelebihan dan Risikonya', body: "Efektif untuk campaign performance yang mengejar penjualan cepat, tapi kalau berlebihan bisa membuat audiens merasa 'dijualin' dan mengurangi rasa autentik konten." },
      { heading: 'Kapan Sebaiknya Dihindari', body: 'Untuk campaign awareness atau produk dengan siklus pertimbangan panjang (misalnya produk kesehatan/keuangan), hard selling yang terlalu agresif justru bisa menurunkan kepercayaan audiens terhadap brand.' },
    ],
  },
  {
    term: 'Impression',
    category: 'metrics',
    summary: 'Jumlah total kemunculan sebuah konten di layar pengguna, termasuk jika dilihat berkali-kali oleh orang yang sama.',
    sections: [
      { heading: 'Bedanya dengan Reach', body: 'Reach menghitung akun unik yang melihat, sementara impression menghitung total tayangan meski dilihat orang yang sama berkali-kali — impression selalu lebih besar atau sama dengan reach.' },
      { heading: 'Kegunaannya', body: 'Impression membantu menilai seberapa sering sebuah konten berulang muncul di feed audiens, berguna untuk mengukur frekuensi eksposur campaign awareness.' },
      { heading: 'Contoh Penggunaannya', body: 'Brand yang membayar iklan berdasarkan CPM (cost per mille/seribu impression) sangat bergantung pada metrik ini untuk menghitung efisiensi biaya campaign mereka.' },
    ],
  },
  {
    term: 'Influencer',
    category: 'tiers',
    summary: 'Individu dengan audiens di media sosial yang mampu memengaruhi opini atau perilaku pengikutnya.',
    sections: [
      { heading: 'Berbagai Tingkatannya', body: 'Influencer biasa dikelompokkan berdasarkan jumlah follower, dari nano, micro, macro, sampai mega — masing-masing punya karakteristik engagement dan biaya kerja sama yang berbeda.' },
      { heading: 'Peran dalam Campaign Brand', body: 'Influencer dipakai brand untuk memperkenalkan produk lewat kredibilitas personal mereka, yang sering kali lebih dipercaya audiens dibanding iklan konvensional.' },
      { heading: 'Platform Utama Influencer di Indonesia', body: 'Instagram, TikTok, dan YouTube jadi tiga platform utama tempat influencer di Indonesia membangun audiens, masing-masing dengan format dan gaya konten yang sedikit berbeda.' },
      { heading: 'Kelebihan & Tantangan Kerja Sama dengan Influencer', body: 'Kelebihannya, pesan brand terasa lebih personal dan dipercaya. Tantangannya, hasil campaign lebih sulit dikontrol penuh dibanding iklan konvensional karena tetap bergantung pada gaya dan kreativitas masing-masing influencer.' },
    ],
  },
  {
    term: 'KOC (Key Opinion Consumer)',
    category: 'tiers',
    summary: 'Konsumen biasa (bukan figur publik) yang membagikan pengalaman jujur memakai produk, dinilai lebih relatable dan terpercaya.',
    sections: [
      { heading: 'Beda dengan KOL', body: 'KOL biasanya punya keahlian atau reputasi di bidang tertentu, sementara KOC adalah konsumen sehari-hari yang kontennya terasa lebih apa adanya, seperti review teman ke teman.' },
      { heading: 'Kenapa Semakin Populer', body: 'Audiens makin skeptis dengan endorsement yang terlihat terlalu polished, sehingga konten KOC yang jujur dan sederhana sering dianggap lebih meyakinkan untuk keputusan beli.' },
      { heading: 'Contoh Penerapannya', body: 'Brand skincare misalnya mengirim produk ke ratusan konsumen biasa dan meminta mereka jujur membagikan hasil pemakaian di TikTok, tanpa naskah atau tekanan pesan tertentu.' },
      { heading: 'Kelebihan & Kekurangannya', body: 'Kelebihannya, biaya jauh lebih murah dan kontennya terasa sangat jujur. Kekurangannya, brand punya kontrol kualitas dan pesan yang jauh lebih rendah dibanding kerja sama dengan KOL profesional.' },
    ],
  },
  {
    term: 'KOL (Key Opinion Leader)',
    category: 'tiers',
    summary: 'Individu yang punya keahlian atau reputasi kuat di bidang tertentu sehingga opininya dipercaya audiens.',
    sections: [
      { heading: 'Contoh di Berbagai Bidang', body: 'Bisa berupa dokter yang jadi rujukan soal kesehatan, food blogger yang jadi rujukan kuliner, atau tech reviewer yang jadi rujukan sebelum orang membeli gadget.' },
      { heading: 'Kenapa Dipilih Brand', body: 'Rekomendasi dari KOL terasa lebih kredibel karena didasarkan pada keahlian atau pengalaman nyata, bukan sekadar populer di media sosial.' },
      { heading: 'Cara Memilih KOL yang Tepat', body: 'Selain jumlah follower, brand perlu mengecek keahlian/kredibilitas di bidang terkait, rekam jejak konten sebelumnya, serta seberapa relevan audiensnya dengan target pasar produk.' },
      { heading: 'Kelebihan & Tantangannya', body: 'Kelebihannya, rekomendasi terasa lebih meyakinkan karena berbasis keahlian. Tantangannya, biaya kerja sama dengan KOL yang sudah punya reputasi kuat biasanya jauh lebih tinggi dibanding creator biasa.' },
    ],
  },
  {
    term: 'KPI (Key Performance Indicator)',
    category: 'metrics',
    summary: 'Indikator terukur yang dipakai untuk menilai apakah sebuah campaign berhasil mencapai tujuannya.',
    sections: [
      { heading: 'Contoh KPI Campaign KOL', body: 'Bisa berupa target reach, engagement rate minimum, jumlah klik link, atau target penjualan tergantung tujuan campaign (awareness, engagement, atau konversi).' },
      { heading: 'Kenapa Harus Ditentukan di Awal', body: 'Tanpa KPI yang jelas sejak awal, brand dan creator sulit menilai objektif apakah campaign benar-benar berhasil atau tidak setelah selesai.' },
      { heading: 'Cara Menyusun KPI yang Baik', body: 'KPI yang baik biasanya mengikuti prinsip SMART — spesifik, terukur, realistis dicapai, relevan dengan tujuan bisnis, dan punya batas waktu yang jelas.' },
    ],
  },
  {
    term: 'Live Shopping',
    category: 'commerce',
    summary: 'Sesi siaran langsung di mana creator memperkenalkan dan menjual produk secara real-time kepada penonton.',
    sections: [
      { heading: 'Elemen Kunci Sebuah Sesi', body: 'Umumnya melibatkan demo produk langsung, tanya jawab dengan penonton, promo/diskon eksklusif selama live, dan keranjang belanja yang bisa langsung diklik penonton.' },
      { heading: 'Kenapa Efektif untuk Konversi', body: 'Interaksi real-time membuat penonton lebih yakin karena bisa langsung bertanya, sementara urgensi promo terbatas waktu mendorong keputusan beli lebih cepat.' },
      { heading: 'Persiapan Sebelum Live', body: 'Meliputi penyusunan skrip poin-poin penting, stok produk yang cukup, promo khusus yang menarik, serta jadwal live di jam-jam dengan audiens paling aktif.' },
      { heading: 'Kelebihan & Tantangannya', body: 'Kelebihannya, konversi bisa sangat tinggi berkat interaksi real-time. Tantangannya, sesi live butuh persiapan matang dan performa sangat bergantung pada kemampuan creator berkomunikasi secara spontan di depan kamera.' },
    ],
  },
  {
    term: 'Macro Influencer',
    category: 'tiers',
    summary: 'Creator dengan jumlah follower besar, umumnya 500 ribu hingga 1 juta, dengan jangkauan luas namun engagement relatif lebih rendah.',
    sections: [
      { heading: 'Kelebihannya', body: 'Cocok untuk campaign awareness skala besar karena bisa menjangkau audiens dalam jumlah signifikan dalam satu kali posting.' },
      { heading: 'Yang Perlu Diperhatikan', body: 'Karena engagement rate cenderung lebih rendah dibanding tier di bawahnya, brand perlu mengombinasikan macro influencer dengan micro/nano untuk mendapat kedalaman kepercayaan audiens.' },
      { heading: 'Contoh Skenario Penggunaan', body: 'Cocok dipakai saat brand meluncurkan produk baru secara nasional dan butuh eksposur cepat dalam waktu singkat, biasanya dikombinasikan dengan beberapa micro influencer untuk memperdalam kepercayaan.' },
    ],
  },
  {
    term: 'Media Kit',
    category: 'ops',
    summary: 'Dokumen profil creator berisi statistik akun, demografi audiens, dan contoh kerja sama sebelumnya untuk ditawarkan ke brand.',
    sections: [
      { heading: 'Isi Umum Media Kit', body: 'Biasanya mencantumkan jumlah follower per platform, rata-rata engagement rate, demografi audiens, rate card, dan portofolio brand yang pernah diajak kerja sama.' },
      { heading: 'Kenapa Penting bagi Creator', body: 'Media kit yang rapi mempermudah brand menilai kecocokan dan kredibilitas creator dengan cepat, tanpa harus menggali sendiri data dari akun media sosialnya.' },
      { heading: 'Tips Membuat Media Kit yang Menarik', body: 'Sertakan data terbaru (bukan statistik lama), highlight campaign paling sukses, serta desain yang rapi dan mudah dibaca dalam waktu singkat oleh tim brand yang sibuk.' },
    ],
  },
  {
    term: 'Mega Influencer',
    category: 'tiers',
    summary: 'Creator dengan follower di atas 1 juta, biasanya selebriti atau figur publik dengan jangkauan sangat besar.',
    sections: [
      { heading: 'Karakteristiknya', body: 'Punya eksposur media yang luas dan sering kali sudah dikenal lewat karier di luar media sosial (aktor, musisi, atlet), bukan murni dibesarkan dari konten organik.' },
      { heading: 'Kapan Cocok Dipakai', body: 'Ideal untuk campaign awareness besar-besaran atau peluncuran produk berskala nasional, dengan konsekuensi biaya kerja sama yang jauh lebih tinggi.' },
      { heading: 'Contoh Skenario Penggunaan', body: 'Umumnya dipakai brand besar untuk campaign nasional/regional, peluncuran produk flagship, atau saat butuh asosiasi dengan figur yang sudah sangat dikenal luas masyarakat.' },
    ],
  },
  {
    term: 'Micro Influencer',
    category: 'tiers',
    summary: 'Creator dengan follower sekitar 10 ribu hingga 100 ribu, dikenal punya engagement rate dan kedekatan audiens yang lebih tinggi.',
    sections: [
      { heading: 'Kenapa Sering Jadi Favorit Brand', body: 'Audiensnya cenderung lebih niche dan loyal, membuat rekomendasi produk dari micro influencer terasa lebih personal dan dipercaya dibanding creator dengan follower jauh lebih besar.' },
      { heading: 'Strategi Umum Pemakaiannya', body: 'Brand sering melibatkan banyak micro influencer sekaligus dalam satu campaign untuk mendapatkan kombinasi jangkauan yang cukup luas sekaligus engagement yang tetap tinggi.' },
      { heading: 'Contoh Skenario Penggunaan', body: 'Cocok untuk campaign yang menyasar komunitas atau minat spesifik, seperti produk kecantikan untuk kulit sensitif atau gadget untuk gamer, di mana kedalaman kepercayaan lebih penting daripada jangkauan luas.' },
    ],
  },
  {
    term: 'Nano Influencer',
    category: 'tiers',
    summary: 'Creator dengan follower di bawah 10 ribu, biasanya punya hubungan sangat dekat dan personal dengan audiensnya.',
    sections: [
      { heading: 'Kekuatan Utamanya', body: 'Karena audiensnya kecil, interaksi terasa seperti obrolan antar teman, membuat tingkat kepercayaan terhadap rekomendasinya sering kali sangat tinggi.' },
      { heading: 'Kapan Cocok Digunakan', body: 'Cocok untuk campaign dengan budget terbatas namun ingin melibatkan banyak suara sekaligus (nano-micro campaign), atau untuk menjangkau komunitas lokal yang sangat spesifik.' },
      { heading: 'Contoh Skenario Penggunaan', body: 'Cocok untuk brand lokal/UMKM dengan budget terbatas yang ingin membangun kepercayaan dari akar rumput, atau untuk menjangkau komunitas sangat spesifik di satu kota/daerah.' },
    ],
  },
  {
    term: 'Organic Reach',
    category: 'content',
    summary: 'Jangkauan konten yang didapat secara alami tanpa bantuan iklan berbayar.',
    sections: [
      { heading: 'Faktor yang Mempengaruhi', body: 'Ditentukan algoritma platform berdasarkan kualitas konten, tingkat interaksi awal, relevansi hashtag/audio, dan konsistensi posting akun.' },
      { heading: 'Kenapa Diperhitungkan Brand', body: 'Organic reach yang tinggi menunjukkan konten campaign benar-benar disukai audiens secara alami, bukan hanya terlihat bagus karena dorongan iklan berbayar.' },
      { heading: 'Cara Meningkatkannya', body: 'Konsistensi posting, riset hashtag/audio yang relevan, dan membuat konten yang benar-benar memicu interaksi di menit-menit awal semuanya membantu mendorong organic reach lebih tinggi.' },
    ],
  },
  {
    term: 'Paid Promote',
    category: 'commerce',
    summary: 'Bentuk kerja sama sederhana di mana creator dibayar untuk mempromosikan produk tanpa keterlibatan brand dalam proses kreatif.',
    sections: [
      { heading: 'Bedanya dengan Sponsored Post', body: 'Paid promote biasanya lebih transaksional dan cepat — brand mengirim materi promosi jadi (caption, gambar) untuk langsung diposting creator tanpa proses kreatif tambahan.' },
      { heading: 'Kapan Cocok Dipakai', body: 'Cocok untuk campaign jangka pendek dengan pesan yang sudah baku, misalnya promo flash sale atau pengumuman event, di mana kreativitas personal creator bukan prioritas utama.' },
      { heading: 'Kapan Sebaiknya Dihindari', body: 'Kalau tujuan campaign adalah membangun kepercayaan jangka panjang, paid promote yang terasa terlalu transaksional dan generik justru kurang efektif dibanding kolaborasi yang melibatkan kreativitas creator.' },
    ],
  },
  {
    term: 'Performance Marketing',
    category: 'commerce',
    summary: 'Strategi campaign yang fokus pada hasil terukur seperti klik, konversi, atau penjualan, bukan sekadar awareness.',
    sections: [
      { heading: 'Metrik yang Diprioritaskan', body: 'Selalu berpusat pada angka yang bisa langsung dihitung — cost per click, cost per acquisition, conversion rate, hingga ROI campaign.' },
      { heading: 'Kenapa Sering Dipasangkan dengan Affiliate Marketing', body: 'Karena sama-sama membayar berdasarkan hasil nyata, performance marketing dan affiliate marketing sering berjalan beriringan dalam campaign yang mengejar penjualan langsung.' },
      { heading: 'Contoh Model Pembayarannya', body: 'Bisa berupa cost-per-click (CPC), cost-per-acquisition (CPA), atau commission-based seperti pada affiliate marketing — semuanya berbasis hasil terukur, bukan sekadar tayang.' },
      { heading: 'Kelebihan & Tantangannya', body: 'Kelebihannya, budget campaign lebih efisien karena bayar sesuai hasil. Tantangannya, strategi ini butuh tracking dan attribution yang akurat agar hasil bisa diukur dengan benar.' },
    ],
  },
  {
    term: 'Product Seeding',
    category: 'commerce',
    summary: 'Strategi mengirim produk ke banyak creator tanpa kontrak formal, berharap sebagian membuat konten organik tentang produk tersebut.',
    sections: [
      { heading: 'Cara Menjalankannya', body: 'Brand mengirim produk ke puluhan hingga ratusan creator sekaligus (biasanya nano/micro) tanpa kewajiban kontrak, lalu menunggu siapa saja yang tertarik membuat konten secara sukarela.' },
      { heading: 'Kenapa Dipakai', body: 'Cara ini relatif murah dibanding kontrak berbayar penuh, dan konten yang dihasilkan cenderung terasa lebih organik karena murni inisiatif creator yang benar-benar suka produknya.' },
      { heading: 'Tips Agar Efektif', body: 'Targetkan creator yang memang relevan dengan kategori produk, kirim dalam jumlah cukup besar untuk meningkatkan peluang konten organik, dan sertakan informasi produk yang jelas tanpa memaksa.' },
      { heading: 'Kelebihan & Kekurangannya', body: 'Kelebihannya, biaya jauh lebih murah dibanding kontrak berbayar penuh. Kekurangannya, brand tidak bisa menjamin berapa banyak creator yang benar-benar akan membuat konten.' },
    ],
  },
  {
    term: 'Rate Card',
    category: 'ops',
    summary: 'Daftar harga jasa seorang creator untuk berbagai jenis konten (feed, story, reels, video) di platformnya.',
    sections: [
      { heading: 'Faktor Penentu Harga', body: 'Biasanya dipengaruhi jumlah follower, engagement rate, niche, tingkat eksklusivitas konten, serta durasi dan kompleksitas produksi yang diminta brand.' },
      { heading: 'Kegunaannya bagi Brand', body: 'Rate card mempercepat proses negosiasi karena brand punya gambaran awal budget yang dibutuhkan sebelum masuk ke diskusi detail kerja sama.' },
      { heading: 'Contoh Kisaran Harga', body: 'Rate bervariasi luas tergantung tier dan niche — nano influencer bisa mulai dari ratusan ribu rupiah per post, sementara macro/mega influencer bisa mencapai puluhan hingga ratusan juta rupiah per campaign.' },
    ],
  },
  {
    term: 'Reach',
    category: 'metrics',
    summary: 'Jumlah akun unik yang melihat sebuah konten, tanpa menghitung tampilan berulang dari orang yang sama.',
    sections: [
      { heading: 'Kenapa Beda dari Impression', body: 'Satu akun yang melihat konten yang sama tiga kali tetap dihitung reach 1, tapi dihitung impression 3 — reach selalu menunjukkan jangkauan audiens yang sebenarnya.' },
      { heading: 'Kegunaan dalam Evaluasi Campaign', body: 'Reach jadi metrik utama untuk campaign awareness karena langsung menunjukkan berapa banyak orang berbeda yang benar-benar terpapar pesan campaign.' },
      { heading: 'Contoh Penggunaannya', body: "Brand yang fokus pada awareness campaign biasanya menetapkan target reach sebagai salah satu KPI utama, misalnya 'menjangkau 1 juta akun unik dalam 2 minggu'." },
    ],
  },
  {
    term: 'ROI (Return on Investment)',
    category: 'metrics',
    summary: 'Perbandingan antara keuntungan yang didapat dengan biaya yang dikeluarkan untuk sebuah campaign.',
    sections: [
      { heading: 'Cara Menghitung', body: 'ROI = ((pendapatan − biaya campaign) ÷ biaya campaign) × 100%. Semakin tinggi angkanya, semakin efisien campaign tersebut menghasilkan keuntungan.' },
      { heading: 'Tantangan dalam Campaign KOL', body: 'ROI campaign awareness lebih sulit dihitung langsung karena manfaatnya (seperti brand awareness) tidak selalu berupa penjualan instan, sehingga sering dikombinasikan dengan metrik lain.' },
      { heading: 'Contoh Perhitungan Sederhana', body: 'Kalau brand mengeluarkan Rp10 juta untuk campaign dan menghasilkan penjualan Rp25 juta, ROI-nya adalah ((25jt−10jt)÷10jt)×100% = 150%.' },
    ],
  },
  {
    term: 'Sentiment Analysis',
    category: 'metrics',
    summary: 'Proses menilai nada emosi (positif, negatif, netral) dari komentar dan reaksi audiens terhadap sebuah konten.',
    sections: [
      { heading: 'Cara Melakukannya', body: 'Bisa dilakukan manual dengan membaca komentar satu per satu, atau otomatis lewat tools yang mengklasifikasikan kata dan emoji ke dalam kategori sentimen tertentu.' },
      { heading: 'Manfaat bagi Brand', body: 'Membantu brand memahami reaksi asli audiens terhadap campaign atau produk, termasuk mendeteksi lebih dini kalau ada respons negatif yang perlu segera ditangani.' },
      { heading: 'Contoh Insight yang Bisa Didapat', body: 'Misalnya menemukan bahwa mayoritas komentar positif menyoroti harga yang terjangkau, sementara komentar negatif banyak menyinggung soal pengiriman — insight ini bisa langsung ditindaklanjuti brand.' },
    ],
  },
  {
    term: 'Sponsored Post',
    category: 'commerce',
    summary: 'Konten yang dibuat creator atas dasar bayaran dari brand, biasanya wajib diberi label pengungkapan.',
    sections: [
      { heading: 'Perbedaannya dengan Konten Organik', body: 'Sponsored post dibuat karena ada pembayaran dan biasanya mengikuti briefing brand, sementara konten organik murni inisiatif dan gaya bebas creator sendiri.' },
      { heading: 'Aturan yang Menyertainya', body: 'Wajib diberi label pengungkapan (Ad/Sponsored) sesuai kebijakan platform dan regulasi periklanan agar audiens tahu itu konten berbayar.' },
      { heading: 'Tips Membuat Sponsored Post yang Efektif', body: 'Menyisipkan pesan brand secara natural dalam konteks konten yang relevan dengan gaya creator biasanya menghasilkan performa lebih baik dibanding sekadar membacakan naskah brand secara kaku.' },
    ],
  },
  {
    term: 'Talent Management',
    category: 'tiers',
    summary: 'Layanan yang mengelola jadwal, negosiasi kerja sama, dan pengembangan karier seorang creator atau KOL.',
    sections: [
      { heading: 'Cakupan Layanannya', body: 'Mulai dari negosiasi rate dengan brand, penjadwalan campaign agar tidak bentrok, hingga strategi pengembangan konten jangka panjang creator.' },
      { heading: 'Manfaat bagi Creator', body: 'Memungkinkan creator fokus membuat konten sementara urusan administratif dan negosiasi bisnis ditangani pihak profesional.' },
      { heading: 'Siapa yang Biasa Memakai Layanan Ini', body: 'Umumnya dipakai creator yang sudah punya audiens cukup besar dan volume tawaran kerja sama tinggi, sehingga butuh bantuan profesional mengelola jadwal dan negosiasi.' },
    ],
  },
  {
    term: 'Talkability',
    category: 'content',
    summary: 'Sejauh mana sebuah konten atau campaign memicu percakapan dan pembicaraan di kalangan audiens.',
    sections: [
      { heading: 'Indikatornya', body: 'Bisa dilihat dari jumlah dan kualitas komentar, seberapa sering konten dibagikan ulang dengan opini tambahan, atau muncul jadi bahan obrolan di platform lain.' },
      { heading: 'Kenapa Dikejar Brand', body: 'Campaign dengan talkability tinggi cenderung menyebar lebih jauh secara organik karena audiens sendiri yang terus membicarakannya tanpa perlu dorongan iklan tambahan.' },
      { heading: 'Cara Meningkatkannya', body: 'Konten yang mengangkat sudut pandang unik, format yang interaktif (polling, tanya-jawab), atau elemen kejutan cenderung lebih memicu percakapan dibanding konten yang terlalu standar.' },
    ],
  },
  {
    term: 'UGC (User Generated Content)',
    category: 'content',
    summary: 'Konten yang dibuat oleh konsumen atau audiens biasa tentang sebuah brand, bukan oleh brand atau creator berbayar.',
    sections: [
      { heading: 'Contohnya', body: 'Review produk spontan di TikTok, repost foto pelanggan di Instagram, atau video unboxing yang dibuat konsumen tanpa diminta brand.' },
      { heading: 'Kenapa Dianggap Sangat Kredibel', body: 'Karena dibuat tanpa bayaran dan tanpa agenda promosi, UGC sering dianggap audiens lebih jujur dan meyakinkan dibanding konten dari campaign berbayar.' },
      { heading: 'Cara Brand Memanfaatkannya', body: "Brand sering me-repost UGC di akun resmi mereka (dengan izin), atau bahkan membayar creator untuk sengaja membuat konten bergaya UGC ('UGC ads') demi kesan otentik di iklan berbayar." },
      { heading: 'Kelebihan & Batasannya', body: 'Kelebihannya, biaya produksi jauh lebih murah dan terasa sangat kredibel. Batasannya, brand tidak punya kontrol penuh atas kualitas dan pesan yang disampaikan dibanding konten yang dibuat sesuai briefing.' },
    ],
  },
  {
    term: 'Usage Rights',
    category: 'ops',
    summary: 'Hak yang diberikan creator kepada brand untuk memakai ulang kontennya di kanal lain, misalnya iklan berbayar atau website.',
    sections: [
      { heading: 'Cakupan yang Biasa Dinegosiasikan', body: 'Termasuk platform yang boleh dipakai (organik saja atau juga iklan berbayar), durasi pemakaian, dan apakah konten boleh diedit ulang oleh brand.' },
      { heading: 'Kenapa Perlu Dituliskan Jelas di Kontrak', body: 'Tanpa usage rights yang jelas, brand secara hukum sebenarnya tidak berhak memakai ulang konten creator di luar konteks postingan aslinya.' },
      { heading: 'Contoh Klausul di Kontrak', body: "Misalnya: 'Brand berhak menggunakan konten ini untuk iklan berbayar di Instagram dan Facebook selama 6 bulan sejak tanggal publikasi, tanpa hak edit ulang'." },
    ],
  },
  {
    term: 'Viral',
    category: 'content',
    summary: 'Kondisi ketika sebuah konten menyebar sangat cepat dan luas melampaui audiens asli si pembuat konten.',
    sections: [
      { heading: 'Faktor Pemicunya', body: 'Biasanya dipicu kombinasi antara relevansi topik, emosi kuat yang ditimbulkan (lucu, mengejutkan, related), dan dorongan algoritma platform yang mempercepat penyebarannya.' },
      { heading: 'Risikonya bagi Campaign Brand', body: 'Viral tidak selalu berarti positif — konten yang viral karena kontroversi justru bisa berbalik merugikan brand, sehingga viralitas perlu diarahkan, bukan dibiarkan begitu saja.' },
      { heading: 'Contoh Pola Konten yang Sering Viral', body: 'Konten yang menunjukkan transformasi dramatis, momen relatable/lucu, atau format challenge yang mudah ditiru orang lain punya peluang lebih besar untuk menyebar cepat.' },
    ],
  },
  {
    term: 'Vlog',
    category: 'content',
    summary: 'Konten video berformat jurnal pribadi yang mendokumentasikan aktivitas atau pengalaman creator sehari-hari.',
    sections: [
      { heading: 'Kenapa Efektif untuk Product Placement', body: 'Produk yang muncul natural dalam rutinitas sehari-hari creator terasa lebih organik dibanding iklan langsung, karena konteksnya memang bagian dari cerita, bukan sisipan promosi.' },
      { heading: 'Tantangannya', body: 'Karena formatnya panjang dan personal, brand perlu memastikan momen penyebutan produk tidak terasa terlalu dipaksakan di tengah narasi vlog.' },
      { heading: 'Contoh Format Umum', body: "Bisa berupa 'a day in my life', vlog perjalanan, atau vlog rutinitas pagi — semuanya memberi ruang natural untuk menyisipkan produk brand di tengah aktivitas sehari-hari." },
    ],
  },
  {
    term: 'Watch Time',
    category: 'metrics',
    summary: 'Total durasi audiens menonton sebuah video, dipakai platform untuk menilai kualitas dan relevansi konten.',
    sections: [
      { heading: 'Kenapa Dianggap Sinyal Kualitas', body: 'Video yang ditonton sampai habis dianggap algoritma lebih relevan dan menarik dibanding video yang banyak ditinggalkan di detik-detik awal.' },
      { heading: 'Dampaknya ke Distribusi Konten', body: 'Watch time yang tinggi biasanya mendorong platform mendistribusikan video lebih luas lagi, termasuk ke FYP atau rekomendasi, sehingga menambah reach organik campaign.' },
      { heading: 'Tips Meningkatkannya', body: 'Hook kuat di detik-detik awal, alur cerita yang runtut, dan durasi yang tidak terlalu panjang untuk pesan yang disampaikan semuanya membantu menjaga penonton tetap menonton sampai akhir.' },
    ],
  },
  {
    term: 'Whitelisting',
    category: 'commerce',
    summary: 'Praktik di mana brand diberi akses oleh creator untuk menjalankan iklan berbayar langsung dari akun creator tersebut.',
    sections: [
      { heading: 'Cara Kerjanya', body: 'Creator memberi izin akses lewat fitur partnership ads di platform, sehingga brand bisa menjalankan iklan berbayar yang tampil seolah-olah datang langsung dari akun creator, lengkap dengan targeting brand sendiri.' },
      { heading: 'Kenapa Digunakan', body: 'Iklan yang tampil dari akun creator biasanya punya tingkat kepercayaan dan performa lebih baik dibanding iklan dari akun brand langsung, sekaligus memperluas jangkauan konten lewat budget iklan.' },
      { heading: 'Bedanya dengan Endorsement Biasa', body: 'Pada endorsement biasa, brand hanya membayar untuk posting organik. Pada whitelisting, brand mendapat akses tambahan menjalankan iklan berbayar lewat akun creator dengan targeting sendiri.' },
      { heading: 'Kelebihan & Pertimbangannya', body: 'Kelebihannya, iklan bisa menjangkau audiens baru di luar follower creator dengan kredibilitas akun tersebut. Pertimbangannya, brand perlu kesepakatan jelas soal durasi akses dan jenis iklan yang boleh dijalankan.' },
    ],
  },
  {
    term: 'Word-of-Mouth',
    category: 'content',
    summary: 'Penyebaran informasi atau rekomendasi tentang brand dari satu orang ke orang lain secara alami.',
    sections: [
      { heading: 'Peran KOL di Dalamnya', body: 'KOL sering dipakai sebagai pemicu awal (trigger) agar audiens mulai membicarakan dan merekomendasikan produk ke lingkaran pertemanan atau keluarga mereka sendiri.' },
      { heading: 'Kenapa Dianggap Bentuk Promosi Paling Kuat', body: 'Rekomendasi dari orang yang dipercaya secara personal (teman, keluarga) punya tingkat konversi yang jauh lebih tinggi dibanding iklan langsung dari brand.' },
      { heading: 'Cara Memicunya Lewat Campaign KOL', body: 'Selain kualitas produk itu sendiri, momen yang mengejutkan, program referral dengan insentif, atau konten yang benar-benar layak dibagikan semuanya bisa mempercepat word-of-mouth menyebar.' },
    ],
  },
];

export const glossaryTerms: GlossaryTerm[] = rawTerms
  .map((t) => ({ ...t, slug: slugify(t.term) }))
  .sort((a, b) => a.term.localeCompare(b.term));

const termsByCategory: Record<GlossaryCategory, GlossaryTerm[]> = { tiers: [], metrics: [], ops: [], commerce: [], content: [], strategy: [] };
glossaryTerms.forEach((t) => termsByCategory[t.category].push(t));

// Kasih tiap istilah foto yang beda dalam kategorinya (bukan satu foto diulang-ulang per kategori).
export function getTermPhoto(term: GlossaryTerm): CategoryPhoto {
  const siblings = termsByCategory[term.category];
  const index = siblings.findIndex((t) => t.slug === term.slug);
  const photos = categoryPhotos[term.category];
  return photos[index % photos.length];
}
