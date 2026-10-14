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
// demo), cukup untuk kasih tiap istilah dalam satu kategori foto yang berbeda, lihat getTermPhoto().
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
      { heading: 'Kelebihan & Risikonya', body: 'Kelebihannya, hubungan yang konsisten membangun asosiasi kuat antara ambassador dan brand. Risikonya, reputasi brand jadi sangat terikat pada personal branding ambassador tersebut, kalau kontroversi menimpa ambassador, brand ikut terdampak.' },
    ],
  },
  {
    term: 'Audience Demographics',
    category: 'metrics',
    summary: 'Data profil audiens sebuah akun, usia, gender, lokasi, hingga minat, yang dipakai brand menilai kecocokan target pasar.',
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
      { heading: 'Yang Dinilai', body: 'Brand biasanya mengecek histori konten creator, niche yang digeluti, tone komunikasi, sampai reputasi personal, apakah semua itu selaras dengan positioning brand.' },
      { heading: 'Kenapa Sering Diabaikan tapi Krusial', body: 'Creator dengan follower besar tapi brand fit rendah justru bisa membuat campaign terasa dipaksakan dan kurang dipercaya audiens, walau angkanya di atas kertas terlihat bagus.' },
      { heading: 'Contoh Ketidakcocokan', body: 'Misalnya brand skincare halal bekerja sama dengan creator yang kontennya sering menyinggung isu sensitif, meski followernya besar, ketidakcocokan nilai ini bisa membuat campaign terasa janggal di mata audiens.' },
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
      { heading: 'Format Umum yang Dipakai', body: 'Biasanya disusun dalam format sebelum-sesudah: kondisi awal brand, strategi yang dijalankan, lalu hasil akhir dengan data konkret, sering dilengkapi kutipan testimoni dari klien.' },
    ],
  },
  {
    term: 'Content Calendar',
    category: 'ops',
    summary: 'Jadwal terstruktur berisi kapan setiap konten campaign akan diunggah di masing-masing platform.',
    sections: [
      { heading: 'Yang Biasanya Dicantumkan', body: 'Tanggal dan jam posting, platform tujuan, jenis konten (feed, story, reels), serta creator yang bertanggung jawab pada slot tersebut.' },
      { heading: 'Kenapa Dibutuhkan', body: 'Campaign yang melibatkan banyak creator sekaligus butuh content calendar agar ritme publikasi tidak menumpuk di satu hari atau malah kosong berhari-hari.' },
      { heading: 'Tools yang Biasa Dipakai', body: 'Bisa berupa spreadsheet sederhana, Notion, Trello, atau software khusus manajemen campaign, yang penting semua pihak (brand, agency, creator) bisa mengakses jadwal yang sama.' },
    ],
  },
  {
    term: 'Content Pillar',
    category: 'ops',
    summary: 'Tema-tema besar yang menjadi fondasi arah konten sebuah akun atau campaign secara konsisten.',
    sections: [
      { heading: 'Contoh Penerapan', body: 'Sebuah akun skincare misalnya bisa punya pillar seputar edukasi bahan aktif, review produk, dan rutinitas harian, semua konten dibuat berputar di sekitar tema-tema ini.' },
      { heading: 'Manfaat bagi Campaign', body: 'Content pillar membuat konten creator tetap relevan dengan brand tanpa terasa monoton, karena ada variasi sudut pandang dalam satu payung tema yang sama.' },
      { heading: 'Cara Menentukannya', body: 'Content pillar biasanya ditentukan dari kombinasi minat audiens, keahlian creator, dan tujuan brand, idealnya 3-5 pillar agar konten tetap fokus tapi tidak monoton.' },
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
      { heading: 'Contoh Deliverable', body: 'Bisa berupa 1 video TikTok, 3 story Instagram dengan link swipe-up, atau 1 post feed plus caption sesuai key message, semuanya dirinci di kontrak atau briefing.' },
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
      { heading: 'Kenapa Wajib', body: 'Selain jadi etika transparansi ke audiens, disclosure juga diatur regulasi periklanan di banyak negara, melanggar aturan ini bisa berisiko bagi brand maupun creator.' },
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
      { heading: 'Batasannya', body: 'Karena tanpa fee, brand biasanya tidak bisa memaksa creator membuat konten, banyak creator hanya bersedia posting kalau memang benar-benar suka produknya.' },
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
      { heading: 'Bukan Sama dengan Profit', body: 'GMV adalah nilai transaksi kotor sebelum dikurangi biaya produksi, komisi affiliate, diskon, dan biaya operasional lain, jadi angka GMV yang besar belum tentu berarti keuntungan brand besar juga.' },
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
      { heading: 'Bedanya dengan Reach', body: 'Reach menghitung akun unik yang melihat, sementara impression menghitung total tayangan meski dilihat orang yang sama berkali-kali, impression selalu lebih besar atau sama dengan reach.' },
      { heading: 'Kegunaannya', body: 'Impression membantu menilai seberapa sering sebuah konten berulang muncul di feed audiens, berguna untuk mengukur frekuensi eksposur campaign awareness.' },
      { heading: 'Contoh Penggunaannya', body: 'Brand yang membayar iklan berdasarkan CPM (cost per mille/seribu impression) sangat bergantung pada metrik ini untuk menghitung efisiensi biaya campaign mereka.' },
    ],
  },
  {
    term: 'Influencer',
    category: 'tiers',
    summary: 'Individu dengan audiens di media sosial yang mampu memengaruhi opini atau perilaku pengikutnya.',
    sections: [
      { heading: 'Berbagai Tingkatannya', body: 'Influencer biasa dikelompokkan berdasarkan jumlah follower, dari nano, micro, macro, sampai mega, masing-masing punya karakteristik engagement dan biaya kerja sama yang berbeda.' },
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
      { heading: 'Cara Menyusun KPI yang Baik', body: 'KPI yang baik biasanya mengikuti prinsip SMART, spesifik, terukur, realistis dicapai, relevan dengan tujuan bisnis, dan punya batas waktu yang jelas.' },
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
      { heading: 'Bedanya dengan Sponsored Post', body: 'Paid promote biasanya lebih transaksional dan cepat, brand mengirim materi promosi jadi (caption, gambar) untuk langsung diposting creator tanpa proses kreatif tambahan.' },
      { heading: 'Kapan Cocok Dipakai', body: 'Cocok untuk campaign jangka pendek dengan pesan yang sudah baku, misalnya promo flash sale atau pengumuman event, di mana kreativitas personal creator bukan prioritas utama.' },
      { heading: 'Kapan Sebaiknya Dihindari', body: 'Kalau tujuan campaign adalah membangun kepercayaan jangka panjang, paid promote yang terasa terlalu transaksional dan generik justru kurang efektif dibanding kolaborasi yang melibatkan kreativitas creator.' },
    ],
  },
  {
    term: 'Performance Marketing',
    category: 'commerce',
    summary: 'Strategi campaign yang fokus pada hasil terukur seperti klik, konversi, atau penjualan, bukan sekadar awareness.',
    sections: [
      { heading: 'Metrik yang Diprioritaskan', body: 'Selalu berpusat pada angka yang bisa langsung dihitung, cost per click, cost per acquisition, conversion rate, hingga ROI campaign.' },
      { heading: 'Kenapa Sering Dipasangkan dengan Affiliate Marketing', body: 'Karena sama-sama membayar berdasarkan hasil nyata, performance marketing dan affiliate marketing sering berjalan beriringan dalam campaign yang mengejar penjualan langsung.' },
      { heading: 'Contoh Model Pembayarannya', body: 'Bisa berupa cost-per-click (CPC), cost-per-acquisition (CPA), atau commission-based seperti pada affiliate marketing, semuanya berbasis hasil terukur, bukan sekadar tayang.' },
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
      { heading: 'Contoh Kisaran Harga', body: 'Rate bervariasi luas tergantung tier dan niche, nano influencer bisa mulai dari ratusan ribu rupiah per post, sementara macro/mega influencer bisa mencapai puluhan hingga ratusan juta rupiah per campaign.' },
    ],
  },
  {
    term: 'Reach',
    category: 'metrics',
    summary: 'Jumlah akun unik yang melihat sebuah konten, tanpa menghitung tampilan berulang dari orang yang sama.',
    sections: [
      { heading: 'Kenapa Beda dari Impression', body: 'Satu akun yang melihat konten yang sama tiga kali tetap dihitung reach 1, tapi dihitung impression 3, reach selalu menunjukkan jangkauan audiens yang sebenarnya.' },
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
      { heading: 'Contoh Insight yang Bisa Didapat', body: 'Misalnya menemukan bahwa mayoritas komentar positif menyoroti harga yang terjangkau, sementara komentar negatif banyak menyinggung soal pengiriman, insight ini bisa langsung ditindaklanjuti brand.' },
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
      { heading: 'Risikonya bagi Campaign Brand', body: 'Viral tidak selalu berarti positif, konten yang viral karena kontroversi justru bisa berbalik merugikan brand, sehingga viralitas perlu diarahkan, bukan dibiarkan begitu saja.' },
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
      { heading: 'Contoh Format Umum', body: "Bisa berupa 'a day in my life', vlog perjalanan, atau vlog rutinitas pagi, semuanya memberi ruang natural untuk menyisipkan produk brand di tengah aktivitas sehari-hari." },
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
  {
    term: 'Yellow Cart',
    category: 'commerce',
    summary: 'Ikon keranjang kuning di video atau live TikTok yang menautkan langsung ke produk di TikTok Shop, sehingga penonton bisa checkout tanpa keluar dari konten.',
    sections: [
      { heading: 'Cara Kerjanya', body: 'Creator yang sudah terdaftar sebagai affiliate TikTok Shop menautkan produk ke video atau sesi live. Ikon keranjang kuning lalu muncul di pojok konten, dan penonton tinggal mengetuknya untuk melihat serta membeli produk.' },
      { heading: 'Kenapa Penting di Campaign', body: 'Yellow cart memperpendek jarak dari menonton ke membeli, sehingga konten KOL bisa langsung diukur kontribusinya ke penjualan (GMV), bukan cuma views dan engagement.' },
      { heading: 'Hal yang Perlu Dicek Tim Ops', body: 'Pastikan akun KOL sudah eligible affiliate, produk yang ditautkan sesuai SKU di brief, komisi sudah diatur di TikTok Shop, dan keranjang benar-benar muncul saat konten tayang.' },
    ],
  },
  {
    term: 'SOW (Scope of Works)',
    category: 'ops',
    summary: 'Dokumen yang merinci lingkup pekerjaan sebuah campaign: deliverable, jumlah konten, platform, timeline, hingga tanggung jawab tiap pihak.',
    sections: [
      { heading: 'Isi yang Umum Dicantumkan', body: 'Jumlah dan jenis konten per KOL (misalnya 1 TikTok video + 3 IG story), platform, jadwal draft dan posting, jumlah revisi, usage rights, periode take down, serta format laporan akhir.' },
      { heading: 'Kenapa Wajib Ada', body: 'SOW jadi acuan bersama antara brand, agency, dan KOL. Kalau ada permintaan di luar SOW (konten tambahan, revisi berlebih), tim bisa menegosiasikan biaya tambahan dengan dasar yang jelas.' },
      { heading: 'Hubungannya dengan Dokumen Lain', body: 'SOW biasanya disusun sebelum quotation dan kontrak final, angka di quotation dan klausul di kontrak mengikuti lingkup yang sudah disepakati di SOW.' },
    ],
  },
  {
    term: 'Requirement User',
    category: 'ops',
    summary: 'Kriteria KOL yang diminta client untuk sebuah campaign, misalnya minimal follower, engagement rate, niche, lokasi, hingga profil audiens.',
    sections: [
      { heading: 'Contoh Kriteria', body: "Misalnya: 'KOL perempuan, domisili Jabodetabek, niche beauty, 10K–50K follower TikTok, ER minimal 3%, audiens mayoritas usia 18–24'." },
      { heading: 'Kegunaannya bagi Tim Ops', body: 'Requirement jadi filter utama saat mencari dan menyusun shortlist KOL, sehingga kandidat yang diajukan ke client sudah sesuai harapan dan proses approval lebih cepat.' },
      { heading: 'Tips', body: "Konfirmasi ulang requirement yang ambigu di awal (misalnya 'KOL yang aesthetic') dan minta contoh akun referensi dari client agar tidak bolak-balik revisi shortlist." },
    ],
  },
  {
    term: 'Shortlist',
    category: 'ops',
    summary: 'Daftar kandidat KOL hasil kurasi yang diajukan ke client untuk dipilih sebelum campaign berjalan.',
    sections: [
      { heading: 'Isi Shortlist', body: 'Biasanya berisi nama dan link akun, jumlah follower, engagement rate, rata-rata views, rate card, serta alasan singkat kenapa KOL tersebut cocok dengan requirement client.' },
      { heading: 'Alurnya', body: 'Tim ops menyusun shortlist berdasarkan requirement, client memilih atau mengganti kandidat, lalu KOL yang di-approve masuk ke tahap negosiasi dan kontrak.' },
    ],
  },
  {
    term: 'Quotation',
    category: 'ops',
    summary: 'Penawaran harga resmi dari agency ke client yang merinci biaya KOL, produksi, dan fee agency untuk sebuah campaign.',
    sections: [
      { heading: 'Isi yang Umum Dicantumkan', body: 'Daftar item pekerjaan sesuai SOW, harga per item, subtotal, pajak (PPN/PPh), masa berlaku penawaran, dan syarat pembayaran.' },
      { heading: 'Setelah Quotation Disetujui', body: 'Client biasanya menerbitkan PO (Purchase Order). Nomor quotation juga sering dicantumkan sebagai referensi di invoice agar penagihan mudah dicocokkan.' },
    ],
  },
  {
    term: 'PO (Purchase Order)',
    category: 'ops',
    summary: 'Dokumen resmi dari client yang menyatakan persetujuan pembelian jasa sesuai quotation, sekaligus dasar penagihan invoice.',
    sections: [
      { heading: 'Kenapa Penting', body: 'Banyak perusahaan tidak bisa memproses pembayaran tanpa nomor PO. Invoice yang tidak mencantumkan PO yang benar sering tertahan di bagian finance client.' },
      { heading: 'Yang Perlu Dicek', body: 'Pastikan nilai, item, dan nama entitas di PO sama dengan quotation. Kalau ada perbedaan, minta revisi PO sebelum campaign jalan agar penagihan tidak bermasalah.' },
    ],
  },
  {
    term: 'Draft Approval',
    category: 'ops',
    summary: 'Tahap di mana KOL mengirim draft konten (script, foto, atau video) untuk dicek dan disetujui brand sebelum diposting.',
    sections: [
      { heading: 'Yang Dicek Saat Review', body: "Kesesuaian dengan brief (key message, do & don't), penyebutan produk yang benar, kualitas visual, caption, hashtag, mention, serta label disclosure." },
      { heading: 'Batas Revisi', body: 'Jumlah revisi biasanya sudah diatur di SOW (misalnya maksimal 2x). Feedback sebaiknya dikumpulkan dalam satu kali kirim agar tidak memperlambat timeline posting.' },
    ],
  },
  {
    term: 'Go Live',
    category: 'ops',
    summary: 'Saat konten KOL resmi tayang di akun sesuai jadwal posting yang sudah disepakati.',
    sections: [
      { heading: 'Checklist Saat Go Live', body: 'Pastikan konten yang diposting sama dengan versi yang di-approve, caption dan tag sudah benar, link atau yellow cart aktif, lalu simpan link postingan untuk keperluan report.' },
      { heading: 'Kenapa Jadwalnya Penting', body: 'Go live sering diselaraskan dengan momen campaign (launching produk, payday, flash sale), sehingga keterlambatan posting bisa langsung berdampak ke hasil campaign.' },
    ],
  },
  {
    term: 'Insight Report',
    category: 'metrics',
    summary: 'Laporan performa konten KOL setelah tayang, biasanya berupa screenshot insight dari akun KOL ditambah rekap metrik campaign.',
    sections: [
      { heading: 'Isi yang Umum Diminta', body: 'Views, reach, impression, likes, comments, shares, saves, watch time, profil audiens, serta klik link atau penjualan dari yellow cart jika ada.' },
      { heading: 'Kapan Diambil', body: 'Umumnya diminta 1x24 jam dan/atau 7 hari setelah posting. Waktu pengambilan insight sebaiknya disepakati di SOW agar data antar KOL bisa dibandingkan secara adil.' },
    ],
  },
  {
    term: 'Code Boost',
    category: 'commerce',
    summary: 'Kode otorisasi dari KOL (misalnya TikTok Spark Ads code) yang memungkinkan brand nge-boost postingan KOL tersebut sebagai iklan.',
    sections: [
      { heading: 'Cara Kerjanya', body: 'KOL membuat kode otorisasi dari postingannya dengan durasi tertentu (misalnya 30 atau 60 hari), lalu brand memasukkan kode itu di Ads Manager untuk menjalankan postingan sebagai iklan.' },
      { heading: 'Yang Perlu Disepakati', body: 'Durasi kode, biaya tambahan (kalau ada), dan apakah ini termasuk usage rights di SOW. Pastikan kode dikirim sebelum kedaluwarsa sesuai jadwal ads brand.' },
    ],
  },
  {
    term: 'Take Down',
    category: 'ops',
    summary: 'Periode minimal sebuah konten campaign wajib tetap tayang sebelum KOL boleh menghapus atau mengarsipkannya.',
    sections: [
      { heading: 'Contoh Ketentuan', body: "Misalnya: 'Konten tidak boleh dihapus atau diarsipkan minimal 3 bulan setelah tanggal posting'. Ketentuan ini biasanya ditulis di SOW dan kontrak." },
      { heading: 'Kenapa Diatur', body: 'Brand ingin konten tetap bisa ditemukan audiens dan terus mengumpulkan views setelah campaign selesai. Konten yang dihapus terlalu cepat bisa dianggap melanggar kesepakatan.' },
    ],
  },
  // --- Tambahan dari Kamus Istilah Tambahan (01-10) ---
  {
    term: 'Campaign Objective',
    category: 'strategy',
    summary: 'Tujuan utama yang ingin dicapai melalui sebuah campaign, jadi acuan semua keputusan strategi dan eksekusi.',
    sections: [
      { heading: 'Contoh Penerapan', body: 'Awareness untuk peluncuran produk baru, atau kunjungan fisik untuk pembukaan outlet. Setiap campaign idealnya hanya punya satu objective utama supaya fokus.' },
      { heading: 'Kenapa Harus Ditentukan di Awal', body: 'Objective menentukan metrik yang dipakai untuk evaluasi, jenis creator yang dipilih, hingga format konten. Campaign tanpa objective jelas cenderung sulit diukur keberhasilannya.' },
    ],
  },
  {
    term: 'Campaign Brief',
    category: 'strategy',
    summary: 'Dokumen arahan yang merangkum tujuan, audiens, pesan, output, jadwal, dan ketentuan sebuah campaign.',
    sections: [
      { heading: 'Isi Umum', body: 'Brief memuat jumlah creator, jenis konten per creator, periode posting, hingga do\'s & don\'ts. Contoh: brief memuat 20 creator lokal, 1 Reels per creator, dan periode posting tertentu.' },
      { heading: 'Fungsinya', body: 'Brief jadi acuan tunggal semua pihak, creator, PIC, dan client, supaya tidak ada miskomunikasi soal apa yang harus dikerjakan dan kapan.' },
    ],
  },
  {
    term: 'Campaign Requirement',
    category: 'strategy',
    summary: 'Seluruh kebutuhan dan syarat pelaksanaan sebuah campaign, dari lokasi, jadwal, hingga ketentuan teknis.',
    sections: [
      { heading: 'Contoh', body: 'Creator berdomisili Tangerang, wajib visit ke outlet, dan posting pada periode tertentu seperti bulan November.' },
      { heading: 'Beda dengan Creator Requirement', body: 'Campaign Requirement mengatur syarat pelaksanaan secara keseluruhan, sedangkan Creator Requirement lebih spesifik ke kriteria creator yang dibutuhkan.' },
    ],
  },
  {
    term: 'Creator Requirement',
    category: 'strategy',
    summary: 'Kriteria creator yang dibutuhkan untuk suatu campaign, jadi filter utama saat sourcing dan kurasi.',
    sections: [
      { heading: 'Contoh', body: 'Niche parenting, Average Views minimal 3.000, dan audiens yang relevan dengan lokasi outlet brand.' },
      { heading: 'Kenapa Penting', body: 'Creator Requirement yang jelas mempercepat proses sourcing karena tim langsung tahu kandidat seperti apa yang perlu dicari, bukan asal banyak followers.' },
    ],
  },
  {
    term: 'Target Audience',
    category: 'strategy',
    summary: 'Kelompok konsumen yang menjadi sasaran komunikasi campaign, dasar penentuan creator dan pesan yang dipakai.',
    sections: [
      { heading: 'Contoh', body: 'Orang tua muda yang tinggal di Tangerang untuk campaign produk parenting lokal.' },
      { heading: 'Kaitannya dengan Pemilihan Creator', body: 'Target audience jadi acuan utama saat menilai Audience Fit calon creator, bukan sekadar niche kontennya.' },
    ],
  },
  {
    term: 'Audience Fit',
    category: 'strategy',
    summary: 'Kesesuaian audiens creator dengan target konsumen brand, salah satu faktor kurasi paling krusial.',
    sections: [
      { heading: 'Contoh Ketidakcocokan', body: 'Creator tinggal di Jakarta tetapi sebagian besar audiensnya justru berdomisili di Tangerang, kota target campaign.' },
      { heading: 'Cara Mengeceknya', body: 'Biasanya dicek lewat data demografi di Audience Demographics atau insight platform milik creator sebelum keputusan kurasi diambil.' },
    ],
  },
  {
    term: 'Key Message',
    category: 'strategy',
    summary: 'Pesan utama yang perlu dipahami audiens setelah melihat konten campaign.',
    sections: [
      { heading: 'Contoh', body: 'Dental Center menyediakan layanan yang lebih luas daripada sekadar tambal dan cabut gigi.' },
      { heading: 'Kenapa Harus Satu Pesan Utama', body: 'Terlalu banyak pesan dalam satu konten membuat audiens susah mengingat inti campaign. Key message yang fokus membuat konten lebih tajam dan mudah diingat.' },
    ],
  },
  {
    term: 'USP - Unique Selling Proposition',
    category: 'strategy',
    summary: 'Pembeda atau keunggulan produk yang menjadi alasan utama konsumen memilihnya dibanding kompetitor.',
    sections: [
      { heading: 'Contoh', body: 'Powerbank memiliki fitur pengisian cepat yang sesuai kebutuhan perjalanan, beda dari powerbank lain di pasaran.' },
      { heading: 'Peran dalam Brief', body: 'USP biasanya jadi bagian penting dari Key Message supaya creator tahu sudut pandang mana yang paling perlu ditonjolkan.' },
    ],
  },
  {
    term: 'Mandatory Elements',
    category: 'strategy',
    summary: 'Elemen yang wajib muncul dalam konten campaign sesuai kesepakatan dengan brand.',
    sections: [
      { heading: 'Contoh', body: 'Kemasan produk terlihat jelas, nama produk disebutkan secara verbal, dan akun brand ditandai di konten.' },
      { heading: 'Risiko Kalau Dilewatkan', body: 'Konten yang tidak memenuhi mandatory elements biasanya kena revisi, karena dianggap tidak memenuhi deliverable yang disepakati.' },
    ],
  },
  {
    term: "Do's & Don'ts",
    category: 'strategy',
    summary: 'Arahan tentang hal yang perlu dilakukan dan harus dihindari creator dalam membuat konten campaign.',
    sections: [
      { heading: 'Contoh', body: "Do: tampilkan cara pakai produk secara jelas. Don't: hindari klaim hasil yang tidak diberikan brand, misalnya klaim medis yang berlebihan." },
      { heading: 'Fungsinya', body: 'Memberi batasan kreatif yang jelas supaya creator tetap bebas berekspresi tanpa melanggar aturan brand atau regulasi yang berlaku.' },
    ],
  },
  {
    term: 'Reference Content',
    category: 'strategy',
    summary: 'Contoh konten yang dipakai untuk menjelaskan arah konsep, visual, atau gaya penyampaian yang diinginkan.',
    sections: [
      { heading: 'Contoh', body: 'Referensi video berbentuk daily routine dengan narasi personal, dipakai sebagai gambaran gaya yang diharapkan.' },
      { heading: 'Cara Pakai yang Tepat', body: 'Reference content sebaiknya dipakai sebagai inspirasi arah konsep, bukan untuk ditiru persis supaya konten tetap terasa otentik dari masing-masing creator.' },
    ],
  },
  {
    term: 'Campaign Period',
    category: 'strategy',
    summary: 'Rentang waktu pelaksanaan campaign secara keseluruhan sesuai kesepakatan.',
    sections: [
      { heading: 'Contoh', body: 'Campaign berjalan dari tanggal 1 sampai 30 November, mencakup proses sourcing hingga reporting.' },
      { heading: 'Beda dengan Posting Window', body: 'Campaign Period mencakup seluruh proses dari awal sampai akhir, sedangkan Posting Window hanya rentang waktu publikasi konten.' },
    ],
  },
  {
    term: 'Posting Window',
    category: 'strategy',
    summary: 'Rentang waktu yang diperbolehkan untuk publikasi konten campaign.',
    sections: [
      { heading: 'Contoh', body: 'Posting diperbolehkan pada tanggal 10-15 November, setelah draft mendapat approval dari brand.' },
      { heading: 'Kenapa Dibatasi', body: 'Posting window menjaga agar semua konten tayang serentak dalam periode strategis, misalnya menjelang momen penting atau peluncuran produk.' },
    ],
  },
  {
    term: 'Scope Exclusion',
    category: 'strategy',
    summary: 'Pekerjaan atau hak yang secara eksplisit tidak termasuk dalam sebuah penawaran atau kesepakatan.',
    sections: [
      { heading: 'Contoh', body: 'Raw footage, reshoot di luar brief, dan penggunaan untuk iklan berbayar tidak termasuk dalam paket yang ditawarkan.' },
      { heading: 'Kenapa Penting Ditulis Jelas', body: 'Scope Exclusion mencegah kesalahpahaman soal apa yang sebenarnya dibayar client, dan jadi dasar perhitungan biaya tambahan lewat Add-on atau Change Request.' },
    ],
  },
  {
    term: 'Add-on',
    category: 'strategy',
    summary: 'Layanan atau output tambahan di luar paket utama yang sudah disepakati.',
    sections: [
      { heading: 'Contoh', body: 'Tambahan 1 Story atau mirroring konten ke TikTok, di luar deliverable utama yang sudah ditawarkan.' },
      { heading: 'Implikasi Biaya', body: 'Add-on biasanya dikenai biaya tambahan di luar nilai kontrak awal, dan perlu disepakati lewat dokumen tambahan atau revisi invoice.' },
    ],
  },
  {
    term: 'Change Request',
    category: 'strategy',
    summary: 'Permintaan perubahan terhadap pekerjaan yang sudah disepakati sebelumnya.',
    sections: [
      { heading: 'Contoh', body: 'Client menambah platform distribusi setelah creator sudah dikonfirmasi dan jadwal sudah berjalan.' },
      { heading: 'Kenapa Perlu Dicatat Formal', body: 'Change Request yang tidak terdokumentasi bisa memicu perdebatan soal scope dan biaya di kemudian hari, apalagi kalau berdampak ke jadwal atau fee.' },
    ],
  },
  {
    term: 'Campaign Strategy',
    category: 'strategy',
    summary: 'Rencana pendekatan untuk mencapai tujuan campaign secara menyeluruh.',
    sections: [
      { heading: 'Contoh', body: 'Menggabungkan creator lokal, konten berbasis pengalaman personal, dan distribusi bertahap dari awareness ke konversi.' },
      { heading: 'Bedanya dengan Campaign Execution', body: 'Campaign Strategy adalah rencananya, sementara Campaign Execution adalah pelaksanaan nyata dari rencana tersebut di lapangan.' },
    ],
  },
  {
    term: 'Campaign Execution',
    category: 'strategy',
    summary: 'Pelaksanaan pekerjaan campaign sesuai rencana dan scope yang sudah ditentukan.',
    sections: [
      { heading: 'Contoh', body: 'Mencakup sourcing, briefing creator, review draft, monitoring posting, hingga reporting akhir.' },
      { heading: 'Kenapa Harus Disiplin', body: 'Eksekusi yang meleset dari strategi awal bisa membuat campaign kehilangan arah meski perencanaannya sudah matang.' },
    ],
  },
  {
    term: 'Handled By / Managed By',
    category: 'ops',
    summary: 'Keterangan pihak yang menangani atau mengelola pekerjaan tertentu dalam sebuah campaign.',
    sections: [
      { heading: 'Contoh', body: 'Campaign managed by AZERAKOL.ID, sementara produksi konten ditangani langsung oleh creator.' },
      { heading: 'Fungsinya', body: 'Memperjelas pembagian tanggung jawab antar pihak supaya tidak ada pekerjaan yang terlewat karena dianggap "bukan tugas saya".' },
    ],
  },
  {
    term: 'PIC - Person in Charge',
    category: 'ops',
    summary: 'Orang yang bertanggung jawab dan menjadi kontak utama untuk pekerjaan tertentu.',
    sections: [
      { heading: 'Contoh', body: 'PIC dari pihak agency mengoordinasikan jadwal dan update campaign ke semua pihak terkait.' },
      { heading: 'Kenapa Harus Ditunjuk Jelas', body: 'Satu campaign bisa melibatkan banyak orang, PIC yang jelas mencegah informasi penting tersebar tanpa ada yang bertanggung jawab penuh.' },
    ],
  },
  {
    term: 'Client PIC',
    category: 'ops',
    summary: 'Kontak utama dari pihak client untuk koordinasi sebuah campaign.',
    sections: [
      { heading: 'Contoh', body: 'Client PIC menggabungkan feedback dari tim marketing internal sebelum diteruskan ke agency.' },
      { heading: 'Peran Pentingnya', body: 'Client PIC jadi satu pintu komunikasi dari sisi brand, supaya agency tidak menerima instruksi yang berbeda-beda dari banyak orang.' },
    ],
  },
  {
    term: 'Campaign Manager',
    category: 'ops',
    summary: 'Orang yang mengoordinasikan jalannya campaign dan mengawasi kualitas, jadwal, serta kendala yang muncul.',
    sections: [
      { heading: 'Contoh', body: 'Campaign Manager mengecek listing dan konten sebelum dikirim ke client untuk approval.' },
      { heading: 'Cakupan Tanggung Jawab', body: 'Mulai dari memastikan timeline berjalan, kualitas output sesuai brief, hingga menjadi penghubung antara tim internal dan client.' },
    ],
  },
  {
    term: 'KOL Specialist / KOL Operations',
    category: 'ops',
    summary: 'Tim yang menjalankan pencarian, komunikasi, dan koordinasi creator sehari-hari.',
    sections: [
      { heading: 'Contoh', body: 'Mengundang creator, follow-up draft, dan mengumpulkan insight dari masing-masing creator yang terlibat.' },
      { heading: 'Posisinya dalam Tim', body: 'KOL Specialist jadi ujung tombak operasional yang paling sering berinteraksi langsung dengan creator di lapangan.' },
    ],
  },
  {
    term: 'Account Manager',
    category: 'ops',
    summary: 'Orang yang mengelola hubungan agency dengan client.',
    sections: [
      { heading: 'Contoh', body: 'Account Manager menerjemahkan kebutuhan client menjadi arahan yang jelas untuk tim campaign.' },
      { heading: 'Beda dengan Campaign Manager', body: 'Account Manager lebih fokus menjaga relasi dan ekspektasi client, sedangkan Campaign Manager fokus pada eksekusi operasional campaign.' },
    ],
  },
  {
    term: 'Talent Manager',
    category: 'ops',
    summary: 'Orang yang mewakili atau mengelola creator dalam urusan kerja sama dan jadwal.',
    sections: [
      { heading: 'Contoh', body: 'Negosiasi rate untuk kerja sama tertentu dilakukan melalui manager creator, bukan langsung ke creator-nya.' },
      { heading: 'Kenapa Perlu Diketahui Agency', body: 'Komunikasi lewat Talent Manager biasanya punya proses dan waktu respons yang berbeda dibanding komunikasi langsung dengan creator independen.' },
    ],
  },
  {
    term: 'Approval Authority',
    category: 'ops',
    summary: 'Pihak yang memiliki kewenangan memberikan persetujuan akhir atas suatu pekerjaan.',
    sections: [
      { heading: 'Contoh', body: 'Brand manager memberikan final approval untuk konten sebelum diizinkan tayang.' },
      { heading: 'Kenapa Harus Jelas Sejak Awal', body: 'Tanpa kejelasan siapa yang punya Approval Authority, proses review bisa berlarut-larut karena feedback datang dari banyak pihak yang berbeda.' },
    ],
  },
  {
    term: 'Escalation',
    category: 'ops',
    summary: 'Penerusan kendala kepada pihak yang memiliki kewenangan mengambil keputusan.',
    sections: [
      { heading: 'Contoh', body: 'Creator tidak bisa visit ke lokasi sehingga PIC meminta keputusan penggantian ke Campaign Manager.' },
      { heading: 'Kapan Perlu Dilakukan', body: 'Escalation dilakukan saat kendala tidak bisa diselesaikan di level operasional dan berisiko mengganggu jadwal atau kualitas campaign.' },
    ],
  },
  {
    term: 'Handover',
    category: 'ops',
    summary: 'Penyerahan pekerjaan beserta data dan status kepada pihak berikutnya.',
    sections: [
      { heading: 'Contoh', body: 'Tim sales menyerahkan quotation dan scope final ke tim campaign setelah kesepakatan tercapai dengan client.' },
      { heading: 'Risiko Kalau Tidak Rapi', body: 'Handover yang tidak lengkap bisa membuat tim penerima kehilangan konteks penting, sehingga campaign berjalan tidak sesuai kesepakatan awal.' },
    ],
  },
  {
    term: 'Kick-off Meeting',
    category: 'ops',
    summary: 'Pertemuan awal untuk menyelaraskan tujuan, scope, jadwal, dan tanggung jawab sebuah campaign.',
    sections: [
      { heading: 'Contoh', body: 'Agency dan brand membahas approval flow sebelum proses sourcing creator dimulai.' },
      { heading: 'Kenapa Penting', body: 'Kick-off meeting memastikan semua pihak punya pemahaman yang sama sejak awal, mengurangi risiko miskomunikasi di tengah jalan.' },
    ],
  },
  {
    term: 'Creator Sourcing',
    category: 'ops',
    summary: 'Proses mencari creator yang berpotensi memenuhi kebutuhan campaign.',
    sections: [
      { heading: 'Contoh', body: 'Mencari creator dengan niche food yang audiensnya dominan di area Semarang.' },
      { heading: 'Sumber Pencarian', body: 'Biasanya dilakukan lewat Creator Database internal, platform khusus KOL, atau pencarian manual berdasarkan niche dan lokasi.' },
    ],
  },
  {
    term: 'Creator Outreach',
    category: 'ops',
    summary: 'Proses menghubungi creator untuk membahas peluang kerja sama.',
    sections: [
      { heading: 'Contoh', body: 'Mengirim undangan campaign berisi SOW, jadwal, dan fee kepada calon creator.' },
      { heading: 'Kunci Outreach yang Efektif', body: 'Pesan outreach yang jelas dan langsung ke poin penting biasanya mendapat respons lebih cepat dibanding pesan yang terlalu panjang atau ambigu.' },
    ],
  },
  {
    term: 'Creator Database',
    category: 'ops',
    summary: 'Kumpulan data creator untuk keperluan pencarian dan pengelolaan kerja sama.',
    sections: [
      { heading: 'Isi Umum', body: 'Database biasanya berisi akun sosial media, niche, lokasi, data performa, dan kontak kerja sama tiap creator.' },
      { heading: 'Manfaatnya', body: 'Database yang terkelola rapi mempercepat proses Creator Sourcing karena tim tidak perlu mencari dari nol setiap ada campaign baru.' },
    ],
  },
  {
    term: 'Creator Listing',
    category: 'ops',
    summary: 'Daftar creator yang disusun atau diajukan untuk sebuah campaign.',
    sections: [
      { heading: 'Isi Umum', body: 'Listing biasanya memuat URL akun, Average Views, rate, dan status availability tiap creator yang diajukan.' },
      { heading: 'Fungsinya', body: 'Listing jadi dasar bagi client untuk melakukan Listing Approval, memutuskan creator mana yang dipakai untuk campaign.' },
    ],
  },
  {
    term: 'Longlist',
    category: 'ops',
    summary: 'Daftar kandidat creator awal sebelum disaring menjadi shortlist.',
    sections: [
      { heading: 'Contoh', body: '50 kandidat awal disaring menjadi 20 kandidat yang diajukan ke client.' },
      { heading: 'Tahapan Selanjutnya', body: 'Longlist biasanya melalui proses Creator Curation dan Creator Screening sebelum masuk ke tahap Listing Approval.' },
    ],
  },
  {
    term: 'Creator Curation',
    category: 'ops',
    summary: 'Penilaian dan penyaringan creator berdasarkan kebutuhan campaign.',
    sections: [
      { heading: 'Contoh', body: 'Kurasi dilakukan berdasarkan gaya konten, Average Views, dan Audience Fit dengan target campaign.' },
      { heading: 'Siapa yang Melakukan', body: 'Biasanya dilakukan oleh KOL Specialist atau Campaign Manager sebelum kandidat diajukan ke client.' },
    ],
  },
  {
    term: 'Creator Screening',
    category: 'ops',
    summary: 'Pemeriksaan lebih lanjut atas profil, konten, dan risiko sebuah creator.',
    sections: [
      { heading: 'Contoh', body: 'Mengecek potensi konflik kategori dengan brand kompetitor, dan indikasi interaksi atau followers yang tidak wajar.' },
      { heading: 'Kenapa Dilakukan', body: 'Screening mengurangi risiko reputasi, seperti bekerja sama dengan creator yang punya riwayat kontroversi atau data audiens yang tidak valid.' },
    ],
  },
  {
    term: 'Listing Approval',
    category: 'ops',
    summary: 'Persetujuan atas daftar creator untuk melanjutkan proses campaign.',
    sections: [
      { heading: 'Contoh', body: 'Client menyetujui 15 dari 20 creator yang diajukan dalam listing.' },
      { heading: 'Langkah Setelahnya', body: 'Creator yang disetujui lanjut ke tahap konfirmasi kesediaan sebagai Confirmed Creator.' },
    ],
  },
  {
    term: 'Confirmed Creator',
    category: 'ops',
    summary: 'Creator yang telah menyatakan kesediaan dan menyepakati ketentuan kerja.',
    sections: [
      { heading: 'Contoh', body: 'Creator menyetujui fee, SOW, tanggal visit, dan posting window yang ditawarkan.' },
      { heading: 'Status Setelah Konfirmasi', body: 'Creator confirmed artinya sudah mengikat kesepakatan kerja, kalau mengundurkan diri biasanya perlu digantikan oleh Backup Creator.' },
    ],
  },
  {
    term: 'Backup Creator',
    category: 'ops',
    summary: 'Creator cadangan yang disiapkan jika kandidat utama tidak dapat melanjutkan kerja sama.',
    sections: [
      { heading: 'Contoh', body: 'Menyiapkan 3 kandidat cadangan untuk aktivasi 30 creator, mengantisipasi pembatalan mendadak.' },
      { heading: 'Kenapa Penting Disiapkan', body: 'Tanpa backup, pembatalan mendadak dari satu creator bisa mengganggu timeline dan jumlah deliverable yang sudah disepakati dengan client.' },
    ],
  },
  {
    term: 'Creator Replacement',
    category: 'ops',
    summary: 'Penggantian creator sesuai alasan dan prosedur yang disepakati.',
    sections: [
      { heading: 'Contoh', body: 'Creator berhalangan karena sakit, dan agency mengajukan pengganti dengan profil setara.' },
      { heading: 'Yang Perlu Disepakati', body: 'Batas waktu penggantian dan kriteria pengganti biasanya sudah diatur di awal supaya proses replacement tidak mengulur jadwal campaign.' },
    ],
  },
  {
    term: 'Availability',
    category: 'ops',
    summary: 'Ketersediaan creator untuk jadwal dan pekerjaan tertentu.',
    sections: [
      { heading: 'Contoh', body: 'Creator tersedia untuk visit tanggal 11, tetapi tidak bisa hadir pada tanggal 12.' },
      { heading: 'Kenapa Dikonfirmasi di Awal', body: 'Mengecek availability sejak awal mencegah bentrok jadwal yang baru ketahuan setelah creator sudah dikonfirmasi ikut campaign.' },
    ],
  },
  {
    term: 'Niche',
    category: 'ops',
    summary: 'Bidang atau topik utama konten seorang creator.',
    sections: [
      { heading: 'Contoh', body: 'Beauty, food, parenting, travel, atau technology adalah beberapa contoh niche yang umum.' },
      { heading: 'Peran dalam Sourcing', body: 'Niche jadi filter utama saat Creator Sourcing karena audiens biasanya mengikuti creator karena konsistensi topik yang dibawakan.' },
    ],
  },
  {
    term: 'Geo-targeting',
    category: 'ops',
    summary: 'Penentuan sasaran berdasarkan wilayah geografis tertentu.',
    sections: [
      { heading: 'Contoh', body: 'Memilih creator dengan audiens dominan di area sekitar lokasi outlet brand.' },
      { heading: 'Kapan Dipakai', body: 'Paling sering dipakai untuk campaign yang mengandalkan kunjungan fisik, seperti pembukaan outlet atau event lokal.' },
    ],
  },
  {
    term: 'Audience Quality',
    category: 'ops',
    summary: 'Penilaian relevansi dan kewajaran audiens seorang creator.',
    sections: [
      { heading: 'Contoh', body: 'Memeriksa demografi serta pola followers dan engagement untuk memastikan audiensnya nyata dan relevan.' },
      { heading: 'Tanda Audiens yang Kurang Berkualitas', body: 'Followers yang melonjak tiba-tiba tanpa diimbangi engagement, atau demografi yang tidak masuk akal, biasanya jadi tanda audiens perlu dicurigai.' },
    ],
  },
  {
    term: 'Rate Negotiation',
    category: 'ops',
    summary: 'Pembahasan fee dan ketentuan untuk mencapai kesepakatan kerja sama.',
    sections: [
      { heading: 'Contoh', body: 'Negosiasi paket konten Reels, mirror ke TikTok, dan sesi visit dalam satu kesepakatan fee.' },
      { heading: 'Yang Biasa Dinegosiasikan', body: 'Selain nominal fee, biasanya juga mencakup jumlah deliverable, jadwal pembayaran, dan cakupan usage rights.' },
    ],
  },
  {
    term: 'Primary Platform',
    category: 'content',
    summary: 'Platform utama untuk publikasi atau fokus pengukuran sebuah campaign.',
    sections: [
      { heading: 'Contoh', body: 'TikTok menjadi platform utama campaign, sehingga seluruh target dan evaluasi fokus di sana.' },
      { heading: 'Kenapa Ditentukan di Awal', body: 'Menentukan primary platform membantu tim fokus optimasi konten sesuai karakteristik algoritma dan format platform tersebut.' },
    ],
  },
  {
    term: 'Secondary Platform',
    category: 'content',
    summary: 'Platform tambahan untuk distribusi campaign di luar platform utama.',
    sections: [
      { heading: 'Contoh', body: 'Instagram menjadi platform tambahan melalui Content Mirroring dari konten TikTok.' },
      { heading: 'Manfaatnya', body: 'Memperluas jangkauan campaign tanpa harus membuat konten baru dari nol untuk tiap platform.' },
    ],
  },
  {
    term: 'Content Mirroring',
    category: 'content',
    summary: 'Publikasi konten yang sama atau hampir sama ke platform lain.',
    sections: [
      { heading: 'Contoh', body: '1 video Reels diunggah juga sebagai video TikTok tanpa perubahan signifikan.' },
      { heading: 'Kelebihannya', body: 'Efisien karena tidak perlu produksi ulang, cukup menyesuaikan format teknis platform tujuan.' },
    ],
  },
  {
    term: 'Cross-posting',
    category: 'content',
    summary: 'Publikasi konten ke beberapa kanal atau akun, dengan atau tanpa penyesuaian.',
    sections: [
      { heading: 'Contoh', body: 'Video dipublikasikan pada Instagram, TikTok, dan YouTube Shorts sekaligus.' },
      { heading: 'Beda dengan Content Mirroring', body: 'Cross-posting lebih umum mencakup publikasi ke banyak kanal, sedangkan Content Mirroring spesifik ke penyalinan konten apa adanya.' },
    ],
  },
  {
    term: 'Content Repurposing',
    category: 'content',
    summary: 'Pengolahan materi yang sudah ada menjadi format atau konten baru.',
    sections: [
      { heading: 'Contoh', body: 'Video panjang diubah menjadi 5 klip pendek untuk dipublikasikan terpisah.' },
      { heading: 'Manfaatnya', body: 'Memperpanjang umur materi konten dan memperbanyak jumlah publikasi tanpa perlu produksi tambahan dari nol.' },
    ],
  },
  {
    term: 'Dedicated Content',
    category: 'content',
    summary: 'Konten yang fokus khusus pada satu brand, produk, atau campaign.',
    sections: [
      { heading: 'Contoh', body: 'Satu video Reels seluruhnya membahas pengalaman visit outlet brand tertentu, tanpa topik lain.' },
      { heading: 'Beda dengan Integrated Content', body: 'Dedicated content seluruhnya tentang brand, sedangkan Integrated Content hanya menyelipkan brand di dalam konten lain yang lebih luas.' },
    ],
  },
  {
    term: 'Integrated Content',
    category: 'content',
    summary: 'Promosi yang dimasukkan sebagai bagian dari konten utama, bukan topik tunggal.',
    sections: [
      { heading: 'Contoh', body: 'Produk muncul sebagai bagian dari vlog perjalanan creator, bukan jadi fokus utama video.' },
      { heading: 'Kenapa Dipilih', body: 'Terasa lebih natural dan tidak terlalu "jualan", cocok untuk brand yang mengutamakan kesan autentik.' },
    ],
  },
  {
    term: 'Original Content',
    category: 'content',
    summary: 'Konten yang dibuat khusus, bukan sekadar unggahan ulang materi yang sudah ada.',
    sections: [
      { heading: 'Contoh', body: 'Creator merekam sendiri pengalaman penggunaan produk, bukan sekadar mengunggah ulang video dari brand.' },
      { heading: 'Kenapa Dihargai', body: 'Original content biasanya terasa lebih personal dan punya tingkat engagement lebih baik dibanding konten repost.' },
    ],
  },
  {
    term: 'Unique Content',
    category: 'content',
    summary: 'Materi konten yang berbeda satu sama lain, terlepas dari jumlah publikasinya.',
    sections: [
      { heading: 'Contoh', body: '10 video yang di-mirror ke 2 platform menghasilkan 10 konten unik, meski menghasilkan 20 postingan total.' },
      { heading: 'Kenapa Dihitung Terpisah', body: 'Membedakan Unique Content dari jumlah postingan penting untuk menghitung nilai produksi secara adil, terutama saat ada Content Mirroring.' },
    ],
  },
  {
    term: 'Content Placement',
    category: 'content',
    summary: 'Penempatan materi promosi pada kanal atau akun tertentu.',
    sections: [
      { heading: 'Contoh', body: 'Materi brand dipublikasikan di akun creator, bukan di akun resmi brand.' },
      { heading: 'Kenapa Diperhatikan', body: 'Penempatan menentukan siapa yang memiliki kendali atas konten setelah tayang, dan berkaitan erat dengan Usage Rights.' },
    ],
  },
  {
    term: 'Repost',
    category: 'content',
    summary: 'Pembagian atau publikasi ulang konten yang telah tersedia.',
    sections: [
      { heading: 'Contoh', body: 'Brand membagikan ulang Story milik creator ke akun resminya sendiri.' },
      { heading: 'Perlu Izin', body: 'Repost biasanya butuh izin eksplisit dari creator, dicakup lewat ketentuan Reposting Rights di kesepakatan kerja.' },
    ],
  },
  {
    term: 'Quote Repost',
    category: 'content',
    summary: 'Pembagian postingan dengan tambahan komentar atau konteks sendiri.',
    sections: [
      { heading: 'Contoh', body: 'Creator membagikan postingan challenge brand dengan menambahkan cerita personalnya sendiri.' },
      { heading: 'Manfaatnya', body: 'Menambah lapisan konteks baru yang membuat konten terasa lebih relevan untuk audiens masing-masing akun.' },
    ],
  },
  {
    term: 'Collab Post',
    category: 'content',
    summary: 'Postingan yang menggunakan fitur kolaborator pada platform.',
    sections: [
      { heading: 'Contoh', body: 'Reels menampilkan brand dan creator sebagai kolaborator, sehingga muncul di kedua profil sekaligus.' },
      { heading: 'Keuntungannya', body: 'Engagement dan views dari satu postingan terakumulasi ke kedua akun, memperluas jangkauan tanpa biaya tambahan.' },
    ],
  },
  {
    term: 'Story Set',
    category: 'content',
    summary: 'Sekumpulan frame Story yang menjadi satu deliverable.',
    sections: [
      { heading: 'Contoh', body: '1 Story set terdiri dari 3 frame yang dihitung sebagai satu deliverable utuh.' },
      { heading: 'Kenapa Dihitung Sebagai Satu Set', body: 'Mencegah ambiguitas soal apakah 1 Story berarti 1 frame atau beberapa frame berurutan dalam perhitungan deliverable.' },
    ],
  },
  {
    term: 'Link Placement',
    category: 'content',
    summary: 'Penempatan tautan pada bagian konten atau profil tertentu.',
    sections: [
      { heading: 'Contoh', body: 'Tautan produk dipasang pada Story atau bio profil selama periode tertentu, misalnya 7 hari.' },
      { heading: 'Kaitannya dengan Tracking', body: 'Link placement biasanya memakai Tracking Link / UTM supaya performanya bisa diukur terpisah dari traffic lain.' },
    ],
  },
  {
    term: 'Pinned Content',
    category: 'content',
    summary: 'Konten yang disematkan pada posisi tertentu sesuai fitur platform.',
    sections: [
      { heading: 'Contoh', body: 'Video campaign disematkan di profil creator selama 14 hari agar lebih mudah ditemukan.' },
      { heading: 'Manfaatnya', body: 'Meningkatkan visibilitas konten karena jadi hal pertama yang dilihat pengunjung baru di profil creator.' },
    ],
  },
  {
    term: 'Side Account / Secondary Account',
    category: 'content',
    summary: 'Akun tambahan di luar akun utama seorang creator.',
    sections: [
      { heading: 'Contoh', body: 'Creator mempublikasikan konten di akun keduanya, misalnya akun khusus niche tertentu.' },
      { heading: 'Kenapa Perlu Diperjelas', body: 'Brand perlu tahu akun mana yang dipakai untuk campaign, karena performa dan audiens side account biasanya berbeda dari akun utama.' },
    ],
  },
  {
    term: 'Raw Footage',
    category: 'content',
    summary: 'Rekaman asli sebelum melalui proses editing.',
    sections: [
      { heading: 'Contoh', body: 'File rekaman hasil visit diserahkan untuk keperluan produksi konten tambahan oleh brand.' },
      { heading: 'Biasanya Tidak Termasuk Paket', body: 'Raw footage sering masuk kategori Scope Exclusion dan baru diserahkan kalau memang disepakati sebagai bagian dari deliverable.' },
    ],
  },
  {
    term: 'Clean Version',
    category: 'content',
    summary: 'Versi konten tanpa elemen tertentu yang telah ditentukan sebelumnya.',
    sections: [
      { heading: 'Contoh', body: 'Video tanpa teks dan tanpa musik diserahkan ke brand untuk diedit ulang sesuai kebutuhan iklan.' },
      { heading: 'Kapan Dibutuhkan', body: 'Clean version biasanya diminta saat brand ingin mengolah ulang konten untuk keperluan lain, misalnya materi iklan versi lokal berbeda.' },
    ],
  },
  {
    term: 'Content Asset',
    category: 'content',
    summary: 'Materi yang digunakan untuk produksi atau publikasi konten.',
    sections: [
      { heading: 'Contoh', body: 'Video, foto, logo, audio, dan elemen grafis yang dipakai dalam proses produksi konten.' },
      { heading: 'Kenapa Perlu Dikelola Rapi', body: 'Content asset yang terorganisir memudahkan proses produksi dan revisi, terutama saat melibatkan banyak creator sekaligus.' },
    ],
  },
  {
    term: 'Hook',
    category: 'content',
    summary: 'Bagian pembuka yang menarik perhatian audiens di awal konten.',
    sections: [
      { heading: 'Contoh', body: 'Pembuka video menunjukkan masalah baterai habis saat konser, langsung memancing rasa penasaran penonton.' },
      { heading: 'Kenapa Krusial', body: 'Beberapa detik pertama menentukan apakah audiens lanjut menonton atau langsung scroll, jadi hook sering jadi elemen paling diperhatikan dalam Script.' },
    ],
  },
  {
    term: 'Content Angle',
    category: 'content',
    summary: 'Sudut pendekatan dalam menyampaikan pesan sebuah konten.',
    sections: [
      { heading: 'Contoh', body: 'Daily routine, tutorial, pengalaman pertama, atau pendekatan masalah-solusi adalah beberapa angle yang umum dipakai.' },
      { heading: 'Kenapa Perlu Bervariasi', body: 'Angle yang beragam antar creator membuat campaign terasa lebih organik dan tidak seperti dibuat dari satu naskah yang sama.' },
    ],
  },
  {
    term: 'Script',
    category: 'ops',
    summary: 'Naskah atau garis besar ucapan dan alur penyampaian konten.',
    sections: [
      { heading: 'Contoh', body: 'Script memuat Hook, pengalaman personal, pesan produk, dan Call to Action (CTA) di bagian akhir.' },
      { heading: 'Fleksibilitasnya', body: 'Script bisa berupa naskah detail atau sekadar garis besar poin, tergantung seberapa besar ruang kreatif yang diberikan ke creator.' },
    ],
  },
  {
    term: 'Storyboard',
    category: 'ops',
    summary: 'Rencana visual urutan adegan sebelum produksi.',
    sections: [
      { heading: 'Contoh', body: 'Adegan pembuka, close-up produk, cara pakai, dan penutup disusun berurutan sebelum syuting dimulai.' },
      { heading: 'Manfaatnya', body: 'Membantu creator dan brand menyamakan ekspektasi visual sebelum waktu produksi terpakai, mengurangi risiko Reshoot.' },
    ],
  },
  {
    term: 'Rough Cut',
    category: 'ops',
    summary: 'Versi awal video hasil editing untuk ditinjau sebelum difinalisasi.',
    sections: [
      { heading: 'Contoh', body: 'Video belum memakai subtitle final atau audio final saat masuk tahap rough cut.' },
      { heading: 'Fungsinya', body: 'Memberi gambaran alur dan konsep secara umum, supaya feedback besar bisa diberikan sebelum masuk ke penyempurnaan detail.' },
    ],
  },
  {
    term: 'Final Draft',
    category: 'ops',
    summary: 'Versi yang diajukan untuk persetujuan akhir sebelum tayang.',
    sections: [
      { heading: 'Contoh', body: 'Video beserta caption diajukan untuk mendapatkan final approval dari brand.' },
      { heading: 'Setelah Disetujui', body: 'Final draft yang sudah di-approve langsung masuk ke Posting Window sesuai jadwal yang disepakati.' },
    ],
  },
  {
    term: 'Revision Round',
    category: 'ops',
    summary: 'Satu putaran revisi berdasarkan satu kumpulan feedback.',
    sections: [
      { heading: 'Contoh', body: 'Paket kerja sama mencakup 1 putaran revisi minor sebagai bagian dari fee yang disepakati.' },
      { heading: 'Kenapa Dibatasi Jumlahnya', body: 'Membatasi jumlah revision round mencegah proses revisi berlarut-larut tanpa kejelasan, dan membedakan revisi gratis dengan revisi tambahan berbayar.' },
    ],
  },
  {
    term: 'Consolidated Feedback',
    category: 'ops',
    summary: 'Masukan yang telah digabungkan menjadi satu arahan.',
    sections: [
      { heading: 'Contoh', body: 'Client PIC mengirim semua koreksi dari tim internal brand dalam satu dokumen, bukan terpisah-pisah.' },
      { heading: 'Kenapa Penting', body: 'Feedback yang dikirim bertahap dan tidak dikonsolidasi berisiko memakan lebih dari satu Revision Round tanpa disadari.' },
    ],
  },
  {
    term: 'Minor Revision',
    category: 'ops',
    summary: 'Perubahan kecil yang tidak mengubah produksi secara besar.',
    sections: [
      { heading: 'Contoh', body: 'Mengoreksi subtitle atau memotong bagian video yang terlalu panjang.' },
      { heading: 'Biasanya Gratis', body: 'Minor revision umumnya masih tercakup dalam Revision Round standar tanpa biaya tambahan.' },
    ],
  },
  {
    term: 'Major Revision',
    category: 'ops',
    summary: 'Perubahan besar pada konsep, alur, atau materi konten.',
    sections: [
      { heading: 'Contoh', body: 'Mengganti konsep dari vlog menjadi format tutorial, mengubah keseluruhan alur konten.' },
      { heading: 'Implikasinya', body: 'Major revision sering kali butuh produksi ulang dan bisa dikenai biaya tambahan di luar paket revisi standar.' },
    ],
  },
  {
    term: 'Reshoot',
    category: 'ops',
    summary: 'Pengambilan gambar ulang.',
    sections: [
      { heading: 'Contoh', body: 'Creator merekam ulang adegan karena produk yang ditampilkan ternyata salah.' },
      { heading: 'Kapan Dibutuhkan', body: 'Biasanya terjadi karena Major Revision, kualitas rekaman yang kurang layak, atau ada Mandatory Elements yang terlewat saat syuting.' },
    ],
  },
  {
    term: 'Quality Control - QC',
    category: 'ops',
    summary: 'Pemeriksaan kesesuaian pekerjaan dengan brief dan standar yang ditetapkan.',
    sections: [
      { heading: 'Contoh', body: 'Mengecek visual produk, klaim yang disampaikan, caption, dan tag akun sebelum konten disetujui tayang.' },
      { heading: 'Siapa yang Melakukan', body: 'Biasanya dilakukan oleh Campaign Manager sebelum konten diajukan ke client untuk approval akhir.' },
    ],
  },
  {
    term: 'Approval SLA',
    category: 'ops',
    summary: 'Batas waktu yang disepakati untuk feedback atau persetujuan.',
    sections: [
      { heading: 'Contoh', body: 'Feedback draft diberikan dalam 3 hari kerja sejak draft dikirimkan.' },
      { heading: 'Kenapa Perlu Disepakati', body: 'Tanpa SLA yang jelas, proses approval bisa molor dan berdampak ke seluruh timeline campaign secara keseluruhan.' },
    ],
  },
  {
    term: 'Posting Verification',
    category: 'ops',
    summary: 'Pemeriksaan ketepatan publikasi konten.',
    sections: [
      { heading: 'Contoh', body: 'Mengecek akun, tautan, caption, label kerja sama, dan tanggal tayang setelah konten dipublikasikan.' },
      { heading: 'Kenapa Dilakukan', body: 'Memastikan konten yang tayang benar-benar sesuai final draft yang sudah disetujui, bukan versi lain yang berbeda.' },
    ],
  },
  {
    term: 'Proof of Posting',
    category: 'ops',
    summary: 'Bukti bahwa konten sudah dipublikasikan.',
    sections: [
      { heading: 'Contoh', body: 'URL postingan dan tangkapan layar Story dikumpulkan sebagai bukti tayang.' },
      { heading: 'Kegunaannya', body: 'Jadi dasar untuk proses reporting ke client dan verifikasi sebelum Creator Fee dicairkan.' },
    ],
  },
  {
    term: 'Campaign Tracker',
    category: 'ops',
    summary: 'Dokumen pemantauan status dan progres campaign.',
    sections: [
      { heading: 'Isi Umum', body: 'Berisi kolom creator, status pengiriman, draft, approval, link tayang, dan insight performa.' },
      { heading: 'Manfaatnya', body: 'Memberi gambaran real-time progres campaign ke semua pihak terkait tanpa perlu tanya satu per satu ke tim operasional.' },
    ],
  },
  {
    term: 'Paid Collaboration',
    category: 'commerce',
    summary: 'Kerja sama dengan fee untuk pekerjaan tertentu.',
    sections: [
      { heading: 'Contoh', body: 'Creator menerima fee untuk pembuatan 1 video dan 1 kali visit ke lokasi brand.' },
      { heading: 'Beda dengan Barter Collaboration', body: 'Paid collaboration dibayar dengan uang tunai, sedangkan Barter Collaboration dibayar dalam bentuk produk atau layanan.' },
    ],
  },
  {
    term: 'Barter Collaboration',
    category: 'commerce',
    summary: 'Pertukaran produk atau layanan dengan deliverables yang disepakati.',
    sections: [
      { heading: 'Contoh', body: 'Produk diberikan sebagai imbalan atas satu video konten dari creator.' },
      { heading: 'Kapan Cocok Dipakai', body: 'Biasanya dipakai untuk brand baru dengan budget terbatas, atau campaign skala kecil dengan nano/micro creator.' },
    ],
  },
  {
    term: 'UGC Creator',
    category: 'commerce',
    summary: 'Creator yang memproduksi konten untuk kebutuhan brand.',
    sections: [
      { heading: 'Contoh', body: 'Creator membuat 3 video yang kemudian dipublikasikan oleh brand di akun resminya, bukan di akun creator.' },
      { heading: 'Beda dengan Endorsement Biasa', body: 'UGC Creator fokus memproduksi konten untuk dipakai brand, bukan untuk dipublikasikan di akun pribadi creator itu sendiri.' },
    ],
  },
  {
    term: 'UGC-style Content',
    category: 'commerce',
    summary: 'Konten bergaya pengalaman pengguna yang personal.',
    sections: [
      { heading: 'Contoh', body: 'Video berbayar dibuat dengan gaya review sehari-hari, meski sebenarnya hasil kerja sama berbayar.' },
      { heading: 'Kenapa Populer', body: 'Gaya UGC terasa lebih autentik dan kurang seperti iklan, sehingga performanya sering lebih baik untuk iklan berbayar.' },
    ],
  },
  {
    term: 'Event Creator Activation',
    category: 'commerce',
    summary: 'Pelibatan creator dalam sebuah acara untuk kehadiran, konten, atau amplifikasi.',
    sections: [
      { heading: 'Contoh', body: 'Creator hadir saat grand opening dan membuat konten Reels dari acara tersebut.' },
      { heading: 'Cakupan Pekerjaannya', body: 'Bisa mencakup kehadiran saja, pembuatan konten, atau keduanya sekaligus, tergantung kesepakatan dengan brand.' },
    ],
  },
  {
    term: 'Visit Campaign',
    category: 'commerce',
    summary: 'Campaign yang mengharuskan creator datang ke lokasi tertentu.',
    sections: [
      { heading: 'Contoh', body: 'Creator visit ke outlet, lalu membuat konten berdasarkan pengalaman kunjungannya.' },
      { heading: 'Pertimbangannya', body: 'Biasanya mempertimbangkan Geo-targeting dan Availability creator, karena membutuhkan komitmen waktu dan lokasi fisik.' },
    ],
  },
  {
    term: 'Attendance Only',
    category: 'commerce',
    summary: 'Pekerjaan yang hanya mewajibkan kehadiran, tanpa kewajiban posting.',
    sections: [
      { heading: 'Contoh', body: 'Creator hadir selama 2 jam di acara tanpa kewajiban mengunggah konten apa pun.' },
      { heading: 'Kapan Dipakai', body: 'Cocok untuk memastikan kehadiran banyak creator demi keramaian acara, tanpa menuntut output konten dari masing-masing.' },
    ],
  },
  {
    term: 'Live Coverage',
    category: 'commerce',
    summary: 'Dokumentasi atau publikasi aktivitas ketika acara berlangsung.',
    sections: [
      { heading: 'Contoh', body: 'Creator mengunggah Story selama event berlangsung untuk menunjukkan suasana secara real-time.' },
      { heading: 'Manfaatnya', body: 'Memberi kesan keramaian dan urgensi yang sulit didapat dari konten yang diunggah setelah acara selesai.' },
    ],
  },
  {
    term: 'Buzzer',
    category: 'commerce',
    summary: 'Istilah informal untuk peserta atau akun yang membantu menyebarkan pesan.',
    sections: [
      { heading: 'Contoh', body: 'Peserta membuat postingan campaign sesuai SOW yang diberikan agar pesan tersebar lebih luas.' },
      { heading: 'Catatan Penggunaan Istilah', body: 'Istilah ini sering dipakai informal di industri, meski konotasinya bisa berbeda-beda tergantung konteks percakapan.' },
    ],
  },
  {
    term: 'Clipping',
    category: 'commerce',
    summary: 'Pengambilan bagian materi panjang menjadi video pendek.',
    sections: [
      { heading: 'Contoh', body: 'Wawancara panjang dipotong menjadi beberapa klip pendek berdasarkan topik tertentu.' },
      { heading: 'Manfaatnya', body: 'Memperbanyak jumlah konten yang bisa dipublikasikan dari satu sesi produksi, mirip prinsip Content Repurposing.' },
    ],
  },
  {
    term: 'Content Distribution',
    category: 'commerce',
    summary: 'Penyebaran materi melalui akun atau kanal yang disepakati.',
    sections: [
      { heading: 'Contoh', body: 'Satu klip dipublikasikan oleh beberapa akun distribusi untuk memperluas jangkauan.' },
      { heading: 'Kaitannya dengan Buzzer', body: 'Distribusi sering memanfaatkan jaringan Buzzer atau beberapa akun sekaligus demi mempercepat penyebaran pesan.' },
    ],
  },
  {
    term: 'Affiliate Creator',
    category: 'commerce',
    summary: 'Creator yang mempromosikan produk melalui mekanisme atribusi dan komisi.',
    sections: [
      { heading: 'Contoh', body: 'Creator membuat review produk dengan menyertakan tautan affiliate di keterangan konten.' },
      { heading: 'Beda dengan Paid Collaboration', body: 'Affiliate creator dibayar berdasarkan hasil penjualan lewat Commission Rate, bukan fee tetap di muka.' },
    ],
  },
  {
    term: 'Hybrid Compensation',
    category: 'commerce',
    summary: 'Imbalan yang menggabungkan fee tetap dan komisi atau insentif.',
    sections: [
      { heading: 'Contoh', body: 'Fee produksi konten ditambah komisi dari penjualan yang tervalidasi lewat tautan affiliate.' },
      { heading: 'Kenapa Diminati', body: 'Menggabungkan kepastian pendapatan dari fee tetap dengan potensi tambahan dari performa penjualan, menarik bagi brand dan creator.' },
    ],
  },
  {
    term: 'Organic Usage Rights',
    category: 'ops',
    summary: 'Izin menggunakan konten di kanal brand tanpa iklan berbayar.',
    sections: [
      { heading: 'Contoh', body: 'Brand repost video creator di Instagram resminya selama 3 bulan tanpa dijadikan iklan.' },
      { heading: 'Batasannya', body: 'Organic usage rights tidak mencakup penggunaan untuk iklan berbayar, yang diatur terpisah lewat Paid Usage Rights.' },
    ],
  },
  {
    term: 'Paid Usage Rights',
    category: 'ops',
    summary: 'Izin menggunakan konten untuk iklan berbayar.',
    sections: [
      { heading: 'Contoh', body: 'Video digunakan sebagai materi iklan berbayar selama 30 hari di platform tertentu.' },
      { heading: 'Biasanya Ada Biaya Tambahan', body: 'Paid usage rights umumnya dikenai biaya terpisah dari fee produksi konten, karena nilainya lebih besar dibanding penggunaan organik.' },
    ],
  },
  {
    term: 'Usage Duration',
    category: 'ops',
    summary: 'Lama izin penggunaan konten berlaku.',
    sections: [
      { heading: 'Contoh', body: 'Hak pakai untuk iklan berlaku 30 hari sejak iklan mulai berjalan.' },
      { heading: 'Kenapa Harus Spesifik', body: 'Durasi yang jelas mencegah brand memakai konten melebihi batas waktu yang sudah disepakati dan dibayar.' },
    ],
  },
  {
    term: 'Usage Territory',
    category: 'ops',
    summary: 'Wilayah geografis yang dicakup izin penggunaan konten.',
    sections: [
      { heading: 'Contoh', body: 'Konten digunakan khusus untuk campaign yang berjalan di Indonesia.' },
      { heading: 'Kenapa Diatur', body: 'Mencegah brand memakai konten di pasar lain tanpa kesepakatan tambahan, terutama untuk brand multinasional.' },
    ],
  },
  {
    term: 'Editing Rights',
    category: 'ops',
    summary: 'Izin mengubah atau mengolah konten dalam batas tertentu.',
    sections: [
      { heading: 'Contoh', body: 'Brand diperbolehkan memotong durasi video dan menambahkan subtitle sendiri.' },
      { heading: 'Kenapa Perlu Dibatasi', body: 'Mencegah perubahan yang mengubah makna atau konteks asli konten tanpa sepengetahuan creator.' },
    ],
  },
  {
    term: 'Reposting Rights',
    category: 'ops',
    summary: 'Izin memublikasikan ulang konten di kanal lain.',
    sections: [
      { heading: 'Contoh', body: 'Brand mengunggah ulang video pada akun resminya setelah mendapat izin dari creator.' },
      { heading: 'Kaitan dengan Repost', body: 'Reposting Rights adalah dasar hukum yang membolehkan aktivitas Repost dilakukan oleh brand.' },
    ],
  },
  {
    term: 'Spark Ads',
    category: 'ops',
    summary: 'Format iklan TikTok yang menggunakan postingan organik dengan otorisasi yang sesuai.',
    sections: [
      { heading: 'Contoh', body: 'Postingan creator dipakai sebagai iklan setelah mendapat kode otorisasi dari pemilik akun.' },
      { heading: 'Kelebihannya', body: 'Iklan terasa lebih natural karena memakai format postingan organik lengkap dengan interaksi aslinya, dibanding iklan konvensional.' },
    ],
  },
  {
    term: 'Ad Authorization',
    category: 'ops',
    summary: 'Persetujuan teknis penggunaan akun atau postingan untuk iklan.',
    sections: [
      { heading: 'Contoh', body: 'Creator memberikan otorisasi untuk postingan tertentu agar bisa dijadikan iklan oleh brand.' },
      { heading: 'Biasanya Berbentuk Kode', body: 'Dalam praktiknya sering berupa kode otorisasi seperti pada Spark Ads, dengan masa berlaku terbatas.' },
    ],
  },
  {
    term: 'Boosting',
    category: 'ops',
    summary: 'Distribusi berbayar untuk memperluas jangkauan atau mencapai tujuan iklan.',
    sections: [
      { heading: 'Contoh', body: 'Brand meningkatkan distribusi postingan campaign lewat dana iklan tambahan.' },
      { heading: 'Butuh Usage Rights', body: 'Boosting konten milik creator tetap membutuhkan Paid Usage Rights atau Ad Authorization yang sesuai sebelum dijalankan.' },
    ],
  },
  {
    term: 'Media Spend / Ad Budget',
    category: 'ops',
    summary: 'Dana untuk pembelian distribusi iklan.',
    sections: [
      { heading: 'Contoh', body: 'Budget iklan dialokasikan terpisah dari fee creator dan fee agency.' },
      { heading: 'Kenapa Dipisah', body: 'Memisahkan media spend dari fee produksi memudahkan perhitungan ROAS dan evaluasi efektivitas dana iklan secara objektif.' },
    ],
  },
  {
    term: 'Average Views - AV',
    category: 'metrics',
    summary: 'Rata-rata views dari sampel konten yang telah ditentukan.',
    sections: [
      { heading: 'Contoh', body: 'Total 30.000 views pada 10 video menghasilkan Average Views sebesar 3.000.' },
      { heading: 'Kegunaannya', body: 'AV jadi acuan utama saat kurasi creator dan menyusun ekspektasi views dalam sebuah Campaign Requirement.' },
    ],
  },
  {
    term: 'Median Views',
    category: 'metrics',
    summary: 'Nilai tengah views pada sampel yang diurutkan.',
    sections: [
      { heading: 'Contoh', body: 'Views 1.000, 2.000, dan 30.000 memiliki median 2.000, meski rata-ratanya jauh lebih tinggi.' },
      { heading: 'Kenapa Lebih Representatif', body: 'Median tidak terlalu terpengaruh outlier dibanding Average Views, sehingga lebih mewakili performa konten yang sebenarnya.' },
    ],
  },
  {
    term: 'Views',
    category: 'metrics',
    summary: 'Penayangan yang dicatat berdasarkan aturan masing-masing platform.',
    sections: [
      { heading: 'Contoh', body: 'Satu video tercatat memiliki 10.000 views sesuai standar perhitungan platform tempat video tayang.' },
      { heading: 'Beda-beda Antar Platform', body: 'Durasi tontonan minimal untuk dihitung sebagai satu view berbeda di tiap platform, jadi angka antar platform tidak selalu bisa dibandingkan apple-to-apple.' },
    ],
  },
  {
    term: 'Total Campaign Views',
    category: 'metrics',
    summary: 'Jumlah views seluruh postingan dalam cakupan campaign.',
    sections: [
      { heading: 'Contoh', body: 'Views dari Instagram dan TikTok dijumlahkan untuk mendapatkan total distribusi campaign.' },
      { heading: 'Kegunaannya', body: 'Jadi salah satu angka utama yang dilaporkan ke client sebagai hasil akhir keseluruhan campaign.' },
    ],
  },
  {
    term: 'Engagement',
    category: 'metrics',
    summary: 'Interaksi yang dicatat pada sebuah konten.',
    sections: [
      { heading: 'Contoh', body: 'Likes, comments, shares, dan saves adalah bentuk-bentuk engagement yang umum dihitung.' },
      { heading: 'Dasar Perhitungan Rasio', body: 'Angka engagement menjadi dasar perhitungan berbagai rasio seperti ER by Followers, ER by Reach, dan ER by Views.' },
    ],
  },
  {
    term: 'ER by Followers',
    category: 'metrics',
    summary: 'Engagement dibagi followers, dikali 100%.',
    sections: [
      { heading: 'Contoh', body: '200 interaksi dibagi 10.000 followers menghasilkan ER by Followers sebesar 2%.' },
      { heading: 'Kelemahannya', body: 'Angka ini bisa kurang akurat untuk akun dengan banyak followers pasif yang jarang berinteraksi.' },
    ],
  },
  {
    term: 'ER by Reach',
    category: 'metrics',
    summary: 'Engagement dibagi reach, dikali 100%.',
    sections: [
      { heading: 'Contoh', body: '200 interaksi dibagi 5.000 reach menghasilkan ER by Reach sebesar 4%.' },
      { heading: 'Kelebihannya', body: 'Lebih mencerminkan performa aktual dibanding ER by Followers, karena hanya menghitung orang yang benar-benar melihat konten.' },
    ],
  },
  {
    term: 'ER by Views',
    category: 'metrics',
    summary: 'Engagement dibagi views, dikali 100%.',
    sections: [
      { heading: 'Contoh', body: '200 interaksi dibagi 8.000 views menghasilkan ER by Views sebesar 2,5%.' },
      { heading: 'Kapan Dipakai', body: 'Cocok dipakai untuk platform berbasis video, di mana views jadi metrik dasar yang lebih relevan dibanding reach.' },
    ],
  },
  {
    term: 'CPV - Cost per View',
    category: 'metrics',
    summary: 'Biaya dibagi jumlah views yang dihitung.',
    sections: [
      { heading: 'Contoh', body: 'Rp1.000.000 dibagi 20.000 views menghasilkan CPV sebesar Rp50 per view.' },
      { heading: 'Kegunaannya', body: 'Jadi acuan membandingkan efisiensi biaya antar creator atau antar campaign yang berbeda.' },
    ],
  },
  {
    term: 'CPM - Cost per Mille',
    category: 'metrics',
    summary: 'Biaya per 1.000 impressions.',
    sections: [
      { heading: 'Contoh', body: 'Rp1.000.000 dibagi 100.000 impressions dikali 1.000 menghasilkan CPM sebesar Rp10.000.' },
      { heading: 'Umum di Dunia Iklan', body: 'CPM adalah salah satu metrik standar dalam iklan digital untuk mengukur biaya eksposur, bukan hanya di konteks KOL.' },
    ],
  },
  {
    term: 'CPE - Cost per Engagement',
    category: 'metrics',
    summary: 'Biaya dibagi jumlah engagement.',
    sections: [
      { heading: 'Contoh', body: 'Rp1.000.000 dibagi 2.000 interaksi menghasilkan CPE sebesar Rp500.' },
      { heading: 'Kegunaannya', body: 'Membantu menilai efisiensi biaya dalam mendorong interaksi audiens, bukan sekadar eksposur pasif.' },
    ],
  },
  {
    term: 'CTR - Click-through Rate',
    category: 'metrics',
    summary: 'Persentase klik dari basis tayangan sesuai konteks pengukuran.',
    sections: [
      { heading: 'Contoh', body: '100 klik dibagi 10.000 impressions menghasilkan CTR sebesar 1%.' },
      { heading: 'Kegunaannya', body: 'Mengukur seberapa efektif konten mendorong audiens untuk mengambil tindakan lanjutan, seperti mengklik Link Placement.' },
    ],
  },
  {
    term: 'CPC - Cost per Click',
    category: 'metrics',
    summary: 'Biaya dibagi jumlah klik yang dihitung.',
    sections: [
      { heading: 'Contoh', body: 'Rp500.000 dibagi 1.000 klik menghasilkan CPC sebesar Rp500.' },
      { heading: 'Kapan Relevan', body: 'Paling relevan untuk campaign dengan tujuan traffic, di mana jumlah klik ke tautan jadi fokus evaluasi utama.' },
    ],
  },
  {
    term: 'CPA - Cost per Acquisition / Action',
    category: 'metrics',
    summary: 'Biaya per akuisisi atau aksi tertentu.',
    sections: [
      { heading: 'Contoh', body: 'Rp2.000.000 dibagi 100 pendaftaran menghasilkan CPA sebesar Rp20.000.' },
      { heading: 'Fleksibilitasnya', body: 'Aksi yang dihitung bisa berupa pendaftaran, pembelian, atau konversi lain tergantung definisi tujuan campaign.' },
    ],
  },
  {
    term: 'ROAS - Return on Ad Spend',
    category: 'metrics',
    summary: 'Pendapatan yang diatribusikan ke iklan dibagi biaya iklan.',
    sections: [
      { heading: 'Contoh', body: 'Rp10.000.000 dibagi Rp2.000.000 menghasilkan ROAS sebesar 5x.' },
      { heading: 'Kegunaannya', body: 'Metrik utama untuk menilai apakah dana iklan menghasilkan pendapatan yang sepadan atau lebih besar dari biayanya.' },
    ],
  },
  {
    term: 'Average Watch Duration',
    category: 'metrics',
    summary: 'Rata-rata durasi video ditonton.',
    sections: [
      { heading: 'Contoh', body: 'Video berdurasi 30 detik memiliki rata-rata durasi tonton 12 detik.' },
      { heading: 'Kaitannya dengan Hook', body: 'Durasi tonton yang rendah di awal video sering menunjukkan Hook yang kurang menarik perhatian audiens.' },
    ],
  },
  {
    term: 'Completion Rate',
    category: 'metrics',
    summary: 'Persentase penayangan yang mencapai akhir video sesuai definisi pengukuran.',
    sections: [
      { heading: 'Contoh', body: '300 dari 1.000 penayangan selesai menghasilkan completion rate sebesar 30%.' },
      { heading: 'Kegunaannya', body: 'Menunjukkan seberapa kuat konten mempertahankan perhatian audiens dari awal sampai akhir.' },
    ],
  },
  {
    term: 'Audience Retention',
    category: 'metrics',
    summary: 'Ukuran bertahannya penonton sepanjang video.',
    sections: [
      { heading: 'Contoh', body: 'Retensi turun signifikan pada bagian penjelasan yang terlalu panjang di tengah video.' },
      { heading: 'Cara Membacanya', body: 'Biasanya digambarkan sebagai grafik penurunan, titik-titik drop besar menunjukkan bagian video yang perlu diperbaiki.' },
    ],
  },
  {
    term: 'Reporting Cut-off',
    category: 'metrics',
    summary: 'Batas waktu pengambilan data untuk laporan.',
    sections: [
      { heading: 'Contoh', body: 'Insight diambil pada H+7 dari tiap postingan sebagai standar waktu pelaporan.' },
      { heading: 'Kenapa Perlu Disepakati', body: 'Data performa konten terus berubah seiring waktu, cut-off yang jelas membuat laporan antar creator bisa dibandingkan secara adil.' },
    ],
  },
  {
    term: 'Estimated Views',
    category: 'metrics',
    summary: 'Perkiraan views berdasarkan data dan asumsi.',
    sections: [
      { heading: 'Contoh', body: 'Estimasi dihitung dari Average Views historis creator dan jumlah postingan yang direncanakan.' },
      { heading: 'Kapan Dipakai', body: 'Dipakai saat perencanaan campaign, sebelum konten benar-benar tayang dan datanya belum bisa diukur langsung.' },
    ],
  },
  {
    term: 'Guaranteed Views',
    category: 'metrics',
    summary: 'Komitmen jumlah views dengan ketentuan terukur dalam kesepakatan.',
    sections: [
      { heading: 'Contoh', body: 'Minimum total views campaign disepakati harus tercapai dalam 30 hari.' },
      { heading: 'Konsekuensi Kalau Tidak Tercapai', body: 'Kalau target tidak tercapai, biasanya ada mekanisme Make-good sebagai kompensasi sesuai kesepakatan.' },
    ],
  },
  {
    term: 'Make-good',
    category: 'metrics',
    summary: 'Pemenuhan tambahan untuk menutup kekurangan sesuai kesepakatan.',
    sections: [
      { heading: 'Contoh', body: 'Tambahan postingan diberikan kalau output yang dijanjikan belum lengkap.' },
      { heading: 'Kapan Berlaku', body: 'Biasanya berlaku saat Guaranteed Views atau deliverable lain tidak tercapai sesuai komitmen awal.' },
    ],
  },
  {
    term: 'Overdelivery',
    category: 'metrics',
    summary: 'Realisasi output atau hasil melebihi komitmen.',
    sections: [
      { heading: 'Contoh', body: 'Target 100 postingan terealisasi menjadi 110 postingan.' },
      { heading: 'Biasanya Tidak Dikenai Biaya Tambahan', body: 'Overdelivery umumnya dianggap sebagai nilai tambah bagi client, bukan sesuatu yang perlu dibayar ekstra.' },
    ],
  },
  {
    term: 'Underperformance',
    category: 'metrics',
    summary: 'Hasil berada di bawah acuan atau target.',
    sections: [
      { heading: 'Contoh', body: 'Views aktual berada di bawah estimasi Average Views yang sudah dihitung sebelumnya.' },
      { heading: 'Tindak Lanjutnya', body: 'Biasanya dibahas apakah perlu Make-good, atau dicatat sebagai bahan evaluasi untuk campaign berikutnya.' },
    ],
  },
  {
    term: 'Benchmark',
    category: 'metrics',
    summary: 'Acuan pembanding untuk menilai performa.',
    sections: [
      { heading: 'Contoh', body: 'Membandingkan CPV campaign saat ini dengan campaign sejenis sebelumnya.' },
      { heading: 'Kegunaannya', body: 'Membantu menentukan apakah hasil sebuah campaign tergolong baik, biasa saja, atau di bawah ekspektasi industri.' },
    ],
  },
  {
    term: 'Attribution',
    category: 'metrics',
    summary: 'Metode menghubungkan hasil dengan aktivitas marketing.',
    sections: [
      { heading: 'Contoh', body: 'Penjualan diatribusikan ke campaign melalui tautan affiliate yang dipakai creator.' },
      { heading: 'Kenapa Rumit', body: 'Satu pembelian bisa dipengaruhi banyak titik kontak sekaligus, sehingga menentukan atribusi yang akurat tidak selalu sederhana.' },
    ],
  },
  {
    term: 'Attribution Window',
    category: 'metrics',
    summary: 'Rentang waktu hasil masih dapat dikaitkan dengan interaksi.',
    sections: [
      { heading: 'Contoh', body: 'Pembelian dalam periode tertentu setelah klik tautan tetap dicatat sebagai hasil atribusi.' },
      { heading: 'Kenapa Dibatasi', body: 'Tanpa batas waktu, pembelian yang sebenarnya tidak terkait campaign bisa ikut tercatat sebagai hasil, membuat data tidak akurat.' },
    ],
  },
  {
    term: 'Tracking Link / UTM',
    category: 'metrics',
    summary: 'Tautan dengan parameter untuk mengenali sumber traffic dan campaign.',
    sections: [
      { heading: 'Contoh', body: 'Tautan berbeda dipakai untuk masing-masing creator agar performanya bisa dibedakan satu sama lain.' },
      { heading: 'Manfaatnya', body: 'Memungkinkan brand mengetahui creator atau kanal mana yang paling efektif mendatangkan traffic dan konversi.' },
    ],
  },
  {
    term: 'Commission Rate',
    category: 'commerce',
    summary: 'Persentase atau nilai komisi transaksi yang memenuhi syarat.',
    sections: [
      { heading: 'Contoh', body: 'Komisi sebesar 10% dari dasar transaksi yang ditentukan oleh program affiliate.' },
      { heading: 'Variasinya', body: 'Commission rate bisa berbeda-beda tergantung kategori produk atau kesepakatan khusus dengan brand tertentu.' },
    ],
  },
  {
    term: 'Validated Sales',
    category: 'commerce',
    summary: 'Penjualan yang lolos ketentuan validasi.',
    sections: [
      { heading: 'Contoh', body: 'Pesanan yang dibatalkan tidak dihitung sebagai penjualan valid untuk perhitungan komisi.' },
      { heading: 'Kenapa Perlu Validasi', body: 'Mencegah komisi dibayarkan atas transaksi yang akhirnya dibatalkan, dikembalikan, atau tidak memenuhi syarat program.' },
    ],
  },
  {
    term: 'Commission Settlement',
    category: 'commerce',
    summary: 'Perhitungan dan pencairan komisi setelah memenuhi syarat.',
    sections: [
      { heading: 'Contoh', body: 'Komisi dicairkan setelah proses validasi transaksi selesai dilakukan.' },
      { heading: 'Biasanya Ada Jeda Waktu', body: 'Settlement sering tidak instan karena perlu menunggu periode Validated Sales selesai, mirip prinsip Attribution Window.' },
    ],
  },
  {
    term: 'Product Sample',
    category: 'commerce',
    summary: 'Produk untuk dipelajari, dicoba, atau digunakan dalam konten.',
    sections: [
      { heading: 'Contoh', body: 'Sample dikirim ke creator sebelum proses produksi review dimulai.' },
      { heading: 'Beda dengan Barter Collaboration', body: 'Product sample bisa diberikan sekadar untuk riset konten, tanpa selalu berarti itu adalah bentuk pembayaran penuh seperti pada barter.' },
    ],
  },
  {
    term: 'Product Link',
    category: 'commerce',
    summary: 'Tautan ke halaman produk atau tautan affiliate.',
    sections: [
      { heading: 'Contoh', body: 'Creator menyertakan tautan produk yang sedang dipromosikan di keterangan konten.' },
      { heading: 'Kaitannya dengan Tracking', body: 'Product link biasanya sudah dilengkapi parameter Tracking Link / UTM untuk keperluan atribusi penjualan.' },
    ],
  },
  {
    term: 'Promo Code',
    category: 'commerce',
    summary: 'Kode untuk memperoleh penawaran tertentu.',
    sections: [
      { heading: 'Contoh', body: 'Kode khusus creator memberi diskon bagi audiens yang melakukan pembelian.' },
      { heading: 'Manfaat Ganda', body: 'Selain mendorong penjualan, promo code juga memudahkan Attribution karena setiap transaksi lebih mudah ditelusuri sumbernya.' },
    ],
  },
  {
    term: 'Live Host',
    category: 'commerce',
    summary: 'Orang yang memandu siaran langsung.',
    sections: [
      { heading: 'Contoh', body: 'Host menjelaskan produk dan menjawab pertanyaan penonton selama sesi live berlangsung.' },
      { heading: 'Kenapa Perannya Penting', body: 'Kemampuan host menyampaikan informasi dan berinteraksi langsung sangat memengaruhi Concurrent Viewers dan hasil penjualan live.' },
    ],
  },
  {
    term: 'Live Session',
    category: 'commerce',
    summary: 'Satu sesi siaran langsung dalam jadwal tertentu.',
    sections: [
      { heading: 'Contoh', body: '1 sesi live berlangsung selama 2 jam sesuai jadwal yang disepakati.' },
      { heading: 'Perencanaannya', body: 'Jumlah dan durasi live session biasanya direncanakan berdasarkan target penjualan dan ketersediaan Live Host.' },
    ],
  },
  {
    term: 'Concurrent Viewers',
    category: 'commerce',
    summary: 'Jumlah penonton yang menonton pada waktu yang sama.',
    sections: [
      { heading: 'Contoh', body: 'Puncak concurrent viewers mencapai 500 akun pada satu titik waktu dalam sesi live.' },
      { heading: 'Kegunaannya', body: 'Jadi indikator seberapa besar daya tarik live session pada momen tertentu, misalnya saat ada promo khusus.' },
    ],
  },
  {
    term: 'AOV - Average Order Value',
    category: 'commerce',
    summary: 'Total nilai pesanan dibagi jumlah pesanan pada cakupan data tertentu.',
    sections: [
      { heading: 'Contoh', body: 'Rp10.000.000 dibagi 100 pesanan menghasilkan AOV sebesar Rp100.000.' },
      { heading: 'Kegunaannya', body: 'Membantu menilai kualitas penjualan, bukan cuma jumlah transaksi, tetapi juga rata-rata nilai tiap transaksinya.' },
    ],
  },
  {
    term: 'Agency Fee / Management Fee',
    category: 'commerce',
    summary: 'Biaya jasa agency untuk lingkup pengelolaan tertentu.',
    sections: [
      { heading: 'Contoh', body: 'Biaya mencakup sourcing, koordinasi, review, dan reporting sepanjang campaign berjalan.' },
      { heading: 'Beda dengan Creator Fee', body: 'Agency fee dibayarkan untuk jasa pengelolaan, terpisah dari Creator Fee yang dibayarkan langsung ke creator.' },
    ],
  },
  {
    term: 'Creator Fee / Talent Fee',
    category: 'commerce',
    summary: 'Imbalan creator untuk pekerjaan dan hak yang disepakati.',
    sections: [
      { heading: 'Contoh', body: 'Fee mencakup pembuatan Reels, kehadiran visit, dan Story Set sesuai kesepakatan.' },
      { heading: 'Komponen yang Memengaruhi', body: 'Besarannya biasanya dipengaruhi jumlah deliverable, Usage Duration, dan tingkat kesulitan produksi yang diminta.' },
    ],
  },
  {
    term: 'Production Fee',
    category: 'commerce',
    summary: 'Biaya produksi materi konten.',
    sections: [
      { heading: 'Contoh', body: 'Biaya studio, kru, editing, atau pengambilan gambar yang dibutuhkan untuk produksi.' },
      { heading: 'Kapan Muncul Terpisah', body: 'Production fee biasanya dihitung terpisah saat produksi melibatkan pihak ketiga di luar kapasitas creator sendiri.' },
    ],
  },
  {
    term: 'All-in Rate',
    category: 'commerce',
    summary: 'Harga yang mencakup seluruh komponen yang dinyatakan dalam penawaran.',
    sections: [
      { heading: 'Contoh', body: 'Harga sudah termasuk fee creator, transport, dan biaya pengelolaan dalam satu angka.' },
      { heading: 'Kelebihannya', body: 'Memudahkan client membandingkan penawaran karena tidak perlu menjumlahkan komponen biaya satu per satu.' },
    ],
  },
  {
    term: 'Nett Rate',
    category: 'commerce',
    summary: 'Nilai bersih yang dimaksud dalam sebuah penawaran.',
    sections: [
      { heading: 'Contoh', body: 'Fee net diterima creator sesuai mekanisme pembayaran yang disepakati, setelah dikurangi potongan yang berlaku.' },
      { heading: 'Kenapa Perlu Diperjelas', body: 'Istilah "nett" bisa berarti berbeda tergantung konteks pajak atau potongan platform, jadi perlu disepakati jelas di awal.' },
    ],
  },
  {
    term: 'Reimbursement',
    category: 'commerce',
    summary: 'Penggantian biaya yang disetujui berdasarkan ketentuan.',
    sections: [
      { heading: 'Contoh', body: 'Ongkos kirim diganti setelah creator menyerahkan bukti pembayaran yang sah.' },
      { heading: 'Kenapa Perlu Bukti', body: 'Reimbursement umumnya baru diproses setelah ada bukti transaksi, untuk menghindari klaim biaya yang tidak sesuai.' },
    ],
  },
  {
    term: 'Down Payment - DP',
    category: 'commerce',
    summary: 'Pembayaran awal sebagai bagian dari total biaya pekerjaan.',
    sections: [
      { heading: 'Contoh', body: 'DP dibayarkan sebelum campaign mulai berjalan, sebagai komitmen awal kerja sama.' },
      { heading: 'Fungsinya', body: 'Memberi kepastian bagi kedua pihak bahwa kerja sama benar-benar akan berjalan sebelum sumber daya penuh dikerahkan.' },
    ],
  },
  {
    term: 'Payment Terms',
    category: 'commerce',
    summary: 'Ketentuan tahap, syarat, dan waktu pembayaran.',
    sections: [
      { heading: 'Contoh', body: 'Pelunasan jatuh tempo setelah seluruh deliverable diterima dan disetujui.' },
      { heading: 'Kenapa Perlu Tertulis', body: 'Payment terms yang jelas mencegah perselisihan soal kapan dan berapa tahap pembayaran seharusnya dilakukan.' },
    ],
  },
  {
    term: 'Invoice',
    category: 'commerce',
    summary: 'Dokumen penagihan atas pekerjaan atau jasa.',
    sections: [
      { heading: 'Contoh', body: 'Agency menerbitkan invoice sesuai scope dan tahap pembayaran yang disepakati dalam kontrak.' },
      { heading: 'Beda dengan Quotation', body: 'Invoice adalah dokumen penagihan setelah pekerjaan dilakukan, sedangkan Quotation adalah estimasi harga sebelum kesepakatan terjadi.' },
    ],
  },
  {
    term: 'Due Date',
    category: 'commerce',
    summary: 'Tanggal terakhir penyelesaian kewajiban tertentu.',
    sections: [
      { heading: 'Contoh', body: 'Invoice memiliki tanggal jatuh tempo pembayaran pada tanggal tertentu, misalnya 21 November.' },
      { heading: 'Konsekuensi Kalau Terlewat', body: 'Keterlambatan dari due date bisa berdampak pada hubungan kerja sama berikutnya, atau dikenai ketentuan tambahan sesuai kesepakatan.' },
    ],
  },
  {
    term: 'Cancellation Fee',
    category: 'commerce',
    summary: 'Biaya pembatalan sesuai tahap dan ketentuan kerja.',
    sections: [
      { heading: 'Contoh', body: 'Pembatalan setelah proses Creator Sourcing dimulai dikenai biaya yang disepakati.' },
      { heading: 'Kenapa Ada', body: 'Biaya ini mengganti sumber daya dan waktu yang sudah terpakai sebelum campaign dibatalkan sepihak.' },
    ],
  },
  {
    term: 'Rescheduling',
    category: 'commerce',
    summary: 'Perubahan jadwal pekerjaan atau publikasi.',
    sections: [
      { heading: 'Contoh', body: 'Jadwal visit dipindahkan karena perubahan jadwal acara dari pihak brand.' },
      { heading: 'Dampak ke Ketentuan Lain', body: 'Rescheduling bisa berdampak pada Availability creator dan perlu dikoordinasikan ulang dengan Posting Window yang sudah disepakati.' },
    ],
  },
  {
    term: 'SPK - Surat Perintah Kerja',
    category: 'commerce',
    summary: 'Dokumen yang menetapkan pekerjaan dan ketentuan sesuai isinya.',
    sections: [
      { heading: 'Contoh', body: 'SPK memuat pihak yang terlibat, scope, jadwal, biaya, dan tanggung jawab masing-masing.' },
      { heading: 'Fungsinya', body: 'Jadi dasar hukum dan acuan kerja yang mengikat antara agency, client, atau creator sebelum pekerjaan dimulai.' },
    ],
  },
  {
    term: 'NDA - Non-disclosure Agreement',
    category: 'commerce',
    summary: 'Kesepakatan menjaga kerahasiaan informasi tertentu.',
    sections: [
      { heading: 'Contoh', body: 'Brief peluncuran produk baru dibagikan setelah NDA ditandatangani oleh semua pihak terkait.' },
      { heading: 'Kapan Dibutuhkan', body: 'Umum dipakai saat campaign melibatkan informasi sensitif, seperti produk yang belum diluncurkan ke publik.' },
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
