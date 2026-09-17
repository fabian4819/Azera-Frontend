export interface GlossarySection {
  heading: string;
  body: string;
}

export interface GlossaryTerm {
  term: string;
  slug: string;
  summary: string;
  sections: GlossarySection[];
}

function slugify(term: string) {
  return term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Istilah KOL & influencer marketing, diurutkan A-Z. Konten ditulis sendiri, bukan salinan dari sumber luar.
const rawTerms: Array<Omit<GlossaryTerm, 'slug'>> = [
  {
    term: 'Affiliate Marketing',
    summary: 'Model kerja sama di mana creator dibayar komisi dari setiap penjualan yang berhasil lewat link atau kode unik miliknya.',
    sections: [
      { heading: 'Cara Kerja', body: 'Brand memberi creator sebuah tracking link atau kode referral khusus. Setiap transaksi yang tercatat lewat link/kode itu otomatis dihitung sebagai kontribusi creator, dan komisi dibayarkan berdasarkan persentase dari nilai transaksi tersebut.' },
      { heading: 'Kenapa Diminati Brand', body: 'Affiliate marketing membuat biaya campaign lebih terukur karena brand hanya membayar saat ada hasil penjualan nyata, bukan sekadar eksposur. Model ini populer lewat fitur TikTok Shop Affiliate dan program afiliasi e-commerce.' },
    ],
  },
  {
    term: 'Ambassador',
    summary: 'Creator yang terikat kontrak jangka panjang untuk mewakili citra sebuah brand secara berkelanjutan, bukan cuma sekali kolaborasi.',
    sections: [
      { heading: 'Beda dengan Kolaborasi Biasa', body: 'Ambassador biasanya wajib memakai produk brand secara rutin, muncul di berbagai campaign, dan kadang dilibatkan dalam acara resmi brand. Durasi kontraknya bisa berbulan-bulan hingga tahunan.' },
      { heading: 'Kenapa Brand Memilih Skema Ini', body: 'Hubungan jangka panjang membuat asosiasi antara ambassador dan brand terasa lebih kuat dan konsisten di mata audiens, dibanding kolaborasi satu kali yang mudah dilupakan.' },
    ],
  },
  {
    term: 'Audience Demographics',
    summary: 'Data profil audiens sebuah akun — usia, gender, lokasi, hingga minat — yang dipakai brand menilai kecocokan target pasar.',
    sections: [
      { heading: 'Data yang Biasa Dilihat', body: 'Brand umumnya mengecek persentase gender, rentang usia terbanyak, sebaran kota/negara, serta minat audiens berdasarkan insight platform seperti Instagram Insights atau TikTok Analytics.' },
      { heading: 'Kenapa Penting Sebelum Kerja Sama', body: 'Follower banyak tidak berguna kalau demografinya tidak sesuai target pasar brand. Audience demographics jadi salah satu filter utama saat kurasi KOL.' },
    ],
  },
  {
    term: 'Authenticity',
    summary: 'Kesan bahwa konten dan opini creator terasa jujur dan alami, bukan sekadar promosi berbayar yang dipaksakan.',
    sections: [
      { heading: 'Faktor yang Mempengaruhi', body: 'Gaya bahasa yang natural, pengalaman pribadi yang detail, serta kejujuran soal kekurangan produk membuat konten terasa lebih otentik dibanding endorsement yang terlalu scripted.' },
      { heading: 'Dampak ke Campaign', body: 'Audiens zaman sekarang makin peka membedakan promosi tulus dan paksaan, sehingga authenticity berpengaruh langsung ke tingkat kepercayaan dan konversi campaign.' },
    ],
  },
  {
    term: 'Awareness Campaign',
    summary: 'Campaign yang tujuan utamanya memperkenalkan brand atau produk ke audiens seluas mungkin, bukan mendorong penjualan langsung.',
    sections: [
      { heading: 'Metrik yang Dipakai', body: 'Karena fokusnya eksposur, awareness campaign biasanya diukur lewat reach, impression, dan jumlah akun unik yang melihat konten, bukan angka konversi atau penjualan.' },
      { heading: 'Kapan Cocok Dipakai', body: 'Cocok untuk brand baru, produk baru, atau saat brand ingin masuk ke pasar/audiens baru yang belum familiar dengan mereka.' },
    ],
  },
  {
    term: 'Brand Awareness',
    summary: 'Tingkat seberapa familiar dan mudah dikenali sebuah brand di mata konsumen.',
    sections: [
      { heading: 'Cara Mengukurnya', body: 'Bisa dilihat dari survei recall (apakah konsumen ingat nama brand tanpa dipancing), volume percakapan di media sosial, atau pertumbuhan pencarian nama brand di mesin pencari.' },
      { heading: 'Peran KOL di Dalamnya', body: 'KOL membantu brand awareness dengan memperkenalkan produk lewat sudut pandang yang personal dan dipercaya audiensnya, lebih efektif dibanding iklan konvensional untuk sebagian segmen.' },
    ],
  },
  {
    term: 'Brand Fit',
    summary: 'Kesesuaian antara citra, nilai, dan gaya konten seorang creator dengan identitas brand yang mengajak kerja sama.',
    sections: [
      { heading: 'Yang Dinilai', body: 'Brand biasanya mengecek histori konten creator, niche yang digeluti, tone komunikasi, sampai reputasi personal — apakah semua itu selaras dengan positioning brand.' },
      { heading: 'Kenapa Sering Diabaikan tapi Krusial', body: 'Creator dengan follower besar tapi brand fit rendah justru bisa membuat campaign terasa dipaksakan dan kurang dipercaya audiens, walau angkanya di atas kertas terlihat bagus.' },
    ],
  },
  {
    term: 'Brand Safety',
    summary: 'Upaya memastikan konten creator tidak mengandung isu sensitif atau kontroversial yang bisa merugikan reputasi brand.',
    sections: [
      { heading: 'Aspek yang Dicek', body: 'Termasuk riwayat konten lama creator, potensi kontroversi personal, bahasa yang dipakai, hingga konteks tempat iklan brand akan muncul (misalnya di samping konten berita negatif).' },
      { heading: 'Kenapa Brand Sangat Hati-hati', body: 'Satu kontroversi dari creator yang bekerja sama bisa langsung berdampak ke reputasi brand, sehingga proses vetting brand safety kini jadi tahap wajib sebelum tanda tangan kontrak.' },
    ],
  },
  {
    term: 'Briefing',
    summary: "Dokumen arahan dari brand ke creator berisi tujuan campaign, pesan kunci, do & don't, serta deliverable yang diharapkan.",
    sections: [
      { heading: 'Isi Umum Sebuah Briefing', body: "Biasanya mencakup latar belakang produk, target audiens, key message yang wajib disampaikan, larangan (misalnya menyebut kompetitor), tenggat waktu, dan format konten yang diminta." },
      { heading: 'Kenapa Briefing yang Jelas Penting', body: 'Briefing yang detail mengurangi revisi bolak-balik dan membantu creator tetap punya ruang kreatif tanpa keluar dari tujuan campaign brand.' },
    ],
  },
  {
    term: 'Call to Action (CTA)',
    summary: 'Ajakan eksplisit di akhir konten agar audiens melakukan aksi tertentu, misalnya klik link, follow, atau beli produk.',
    sections: [
      { heading: 'Contoh Bentuk CTA', body: "Bisa berupa kalimat langsung ('Klik link di bio'), tombol swipe-up, kode promo terbatas waktu, atau ajakan komentar untuk meningkatkan interaksi." },
      { heading: 'Kenapa Penempatannya Penting', body: 'CTA yang terlalu dipaksakan di awal konten bisa terasa hard selling. Kebanyakan campaign menaruh CTA di akhir, setelah audiens sudah teredukasi atau terhibur oleh kontennya.' },
    ],
  },
  {
    term: 'Case Study',
    summary: 'Rangkuman hasil sebuah campaign yang telah selesai, biasanya berisi metrik performa dan pembelajaran untuk campaign berikutnya.',
    sections: [
      { heading: 'Komponen Umum', body: 'Berisi tujuan awal campaign, strategi yang dijalankan, kreator yang dilibatkan, dan hasil akhir dibanding target (reach, engagement, penjualan, dsb).' },
      { heading: 'Manfaatnya', body: 'Case study jadi bukti kredibilitas agency atau KOL ke calon klien baru, sekaligus bahan evaluasi internal untuk memperbaiki strategi campaign selanjutnya.' },
    ],
  },
  {
    term: 'Content Calendar',
    summary: 'Jadwal terstruktur berisi kapan setiap konten campaign akan diunggah di masing-masing platform.',
    sections: [
      { heading: 'Yang Biasanya Dicantumkan', body: 'Tanggal dan jam posting, platform tujuan, jenis konten (feed, story, reels), serta creator yang bertanggung jawab pada slot tersebut.' },
      { heading: 'Kenapa Dibutuhkan', body: 'Campaign yang melibatkan banyak creator sekaligus butuh content calendar agar ritme publikasi tidak menumpuk di satu hari atau malah kosong berhari-hari.' },
    ],
  },
  {
    term: 'Content Pillar',
    summary: 'Tema-tema besar yang menjadi fondasi arah konten sebuah akun atau campaign secara konsisten.',
    sections: [
      { heading: 'Contoh Penerapan', body: 'Sebuah akun skincare misalnya bisa punya pillar seputar edukasi bahan aktif, review produk, dan rutinitas harian — semua konten dibuat berputar di sekitar tema-tema ini.' },
      { heading: 'Manfaat bagi Campaign', body: 'Content pillar membuat konten creator tetap relevan dengan brand tanpa terasa monoton, karena ada variasi sudut pandang dalam satu payung tema yang sama.' },
    ],
  },
  {
    term: 'Conversion Rate',
    summary: 'Persentase audiens yang benar-benar melakukan aksi yang diinginkan (beli, daftar, klik) dari total yang melihat konten.',
    sections: [
      { heading: 'Cara Menghitung', body: 'Conversion rate = (jumlah aksi yang tercapai ÷ jumlah audiens yang melihat konten) × 100%. Aksi ini bisa berupa pembelian, pendaftaran, atau klik link tergantung tujuan campaign.' },
      { heading: 'Kenapa Lebih Berarti dari Sekadar Reach', body: 'Reach besar tidak selalu berarti hasil bagus. Conversion rate menunjukkan seberapa efektif konten benar-benar mendorong audiens mengambil tindakan nyata.' },
    ],
  },
  {
    term: 'Creator Economy',
    summary: 'Ekosistem ekonomi yang terbentuk dari aktivitas para content creator, termasuk monetisasi, brand deal, dan platform pendukungnya.',
    sections: [
      { heading: 'Pemain di Dalamnya', body: 'Melibatkan creator, brand, platform (TikTok, Instagram, YouTube), agency KOL, hingga tools pendukung seperti software editing dan analytics.' },
      { heading: 'Kenapa Terus Bertumbuh', body: 'Semakin banyak brand mengalihkan budget iklan konvensional ke kerja sama dengan creator, karena dianggap lebih personal dan efektif menjangkau audiens spesifik.' },
    ],
  },
  {
    term: 'Deliverable',
    summary: 'Output konkret yang wajib diserahkan creator sesuai kontrak, misalnya jumlah post, story, atau video.',
    sections: [
      { heading: 'Contoh Deliverable', body: 'Bisa berupa 1 video TikTok, 3 story Instagram dengan link swipe-up, atau 1 post feed plus caption sesuai key message — semuanya dirinci di kontrak atau briefing.' },
      { heading: 'Kenapa Harus Spesifik', body: 'Deliverable yang tidak jelas jumlah dan formatnya sering jadi sumber sengketa antara brand dan creator soal apa yang sebenarnya sudah disepakati.' },
    ],
  },
  {
    term: 'Disclosure',
    summary: "Pengungkapan yang jelas bahwa sebuah konten adalah hasil kerja sama berbayar, biasanya lewat label \"Ad\" atau \"#ads\".",
    sections: [
      { heading: 'Bentuk Disclosure', body: 'Bisa lewat fitur paid partnership platform, watermark di video, atau hashtag seperti #ad, #sponsored, #kerjasamaberbayar di caption.' },
      { heading: 'Kenapa Wajib', body: 'Selain jadi etika transparansi ke audiens, disclosure juga diatur regulasi periklanan di banyak negara — melanggar aturan ini bisa berisiko bagi brand maupun creator.' },
    ],
  },
  {
    term: 'Earned Media',
    summary: 'Eksposur brand yang didapat secara organik tanpa bayaran langsung, misalnya dibahas ulang oleh media atau warganet.',
    sections: [
      { heading: 'Contoh Earned Media', body: 'Review spontan dari pelanggan, liputan media karena campaign yang viral, atau repost organik dari akun lain tanpa brand membayar sepeser pun.' },
      { heading: 'Bedanya dengan Paid Media', body: 'Paid media didapat lewat iklan berbayar, sedangkan earned media murni karena kualitas produk atau campaign yang cukup menarik untuk dibicarakan orang secara sukarela.' },
    ],
  },
  {
    term: 'Engagement Rate',
    summary: 'Rasio interaksi (like, comment, share, save) dibanding jumlah follower atau jumlah orang yang melihat konten.',
    sections: [
      { heading: 'Cara Menghitung', body: 'Umumnya engagement rate = (total like + comment + share + save) ÷ jumlah follower × 100%. Beberapa platform menghitungnya berdasarkan reach/impression, bukan follower.' },
      { heading: 'Kenapa Sering Jadi Patokan Utama', body: 'Engagement rate dianggap indikator lebih jujur dibanding jumlah follower, karena menunjukkan seberapa aktif dan peduli audiens terhadap konten creator, bukan cuma angka pengikut pasif.' },
    ],
  },
  {
    term: 'Exclusivity Clause',
    summary: 'Klausul kontrak yang melarang creator bekerja sama dengan brand kompetitor dalam periode tertentu.',
    sections: [
      { heading: 'Contoh Penerapan', body: 'Misalnya creator dilarang mengiklankan produk skincare merek lain selama 3 bulan setelah campaign dengan satu brand skincare berakhir.' },
      { heading: 'Kenapa Perlu Dinegosiasikan', body: 'Exclusivity biasanya diikuti kompensasi tambahan karena membatasi peluang penghasilan creator dari brand lain di kategori yang sama selama periode tersebut.' },
    ],
  },
  {
    term: 'FYP (For You Page)',
    summary: 'Halaman rekomendasi konten personal di TikTok yang ditentukan algoritma berdasarkan perilaku pengguna.',
    sections: [
      { heading: 'Faktor yang Mempengaruhi Algoritma', body: 'Meliputi watch time, interaksi (like, comment, share), jenis konten yang sering ditonton pengguna, serta relevansi audio dan hashtag yang dipakai.' },
      { heading: 'Kenapa Jadi Incaran Campaign', body: 'Masuk FYP berarti konten berpotensi dilihat audiens jauh di luar follower creator, membuat campaign TikTok punya peluang jangkauan organik yang sangat besar.' },
    ],
  },
  {
    term: 'Gifting',
    summary: 'Bentuk kerja sama di mana creator menerima produk gratis sebagai imbalan atas konten yang dibuat, tanpa fee tambahan.',
    sections: [
      { heading: 'Kapan Biasanya Dipakai', body: 'Umum dilakukan ke nano atau micro influencer, atau saat brand baru ingin memperkenalkan produk tanpa budget campaign besar.' },
      { heading: 'Batasannya', body: 'Karena tanpa fee, brand biasanya tidak bisa memaksa creator membuat konten — banyak creator hanya bersedia posting kalau memang benar-benar suka produknya.' },
    ],
  },
  {
    term: 'GMV (Gross Merchandise Value)',
    summary: 'Total nilai transaksi penjualan yang dihasilkan dari sebuah campaign, terutama dipakai di TikTok Shop.',
    sections: [
      { heading: 'Cara Dihitung', body: 'GMV dihitung dari total nilai barang yang terjual lewat link, keranjang kuning, atau live shopping creator dalam periode campaign tertentu, sebelum dikurangi biaya apa pun.' },
      { heading: 'Kenapa Jadi Metrik Populer di Live Commerce', body: 'GMV langsung menunjukkan dampak penjualan riil dari sebuah campaign, sehingga jadi metrik favorit brand yang fokus ke affiliate dan live shopping campaign.' },
    ],
  },
  {
    term: 'Hard Selling',
    summary: 'Gaya promosi yang langsung dan eksplisit mendorong audiens untuk membeli produk.',
    sections: [
      { heading: 'Ciri Kontennya', body: 'Biasanya berisi klaim keunggulan produk secara langsung, harga, diskon, dan CTA belanja yang tegas tanpa banyak basa-basi cerita.' },
      { heading: 'Kelebihan dan Risikonya', body: "Efektif untuk campaign performance yang mengejar penjualan cepat, tapi kalau berlebihan bisa membuat audiens merasa 'dijualin' dan mengurangi rasa autentik konten." },
    ],
  },
  {
    term: 'Impression',
    summary: 'Jumlah total kemunculan sebuah konten di layar pengguna, termasuk jika dilihat berkali-kali oleh orang yang sama.',
    sections: [
      { heading: 'Bedanya dengan Reach', body: 'Reach menghitung akun unik yang melihat, sementara impression menghitung total tayangan meski dilihat orang yang sama berkali-kali — impression selalu lebih besar atau sama dengan reach.' },
      { heading: 'Kegunaannya', body: 'Impression membantu menilai seberapa sering sebuah konten berulang muncul di feed audiens, berguna untuk mengukur frekuensi eksposur campaign awareness.' },
    ],
  },
  {
    term: 'Influencer',
    summary: 'Individu dengan audiens di media sosial yang mampu memengaruhi opini atau perilaku pengikutnya.',
    sections: [
      { heading: 'Berbagai Tingkatannya', body: 'Influencer biasa dikelompokkan berdasarkan jumlah follower, dari nano, micro, macro, sampai mega — masing-masing punya karakteristik engagement dan biaya kerja sama yang berbeda.' },
      { heading: 'Peran dalam Campaign Brand', body: 'Influencer dipakai brand untuk memperkenalkan produk lewat kredibilitas personal mereka, yang sering kali lebih dipercaya audiens dibanding iklan konvensional.' },
    ],
  },
  {
    term: 'KOC (Key Opinion Consumer)',
    summary: 'Konsumen biasa (bukan figur publik) yang membagikan pengalaman jujur memakai produk, dinilai lebih relatable dan terpercaya.',
    sections: [
      { heading: 'Beda dengan KOL', body: 'KOL biasanya punya keahlian atau reputasi di bidang tertentu, sementara KOC adalah konsumen sehari-hari yang kontennya terasa lebih apa adanya, seperti review teman ke teman.' },
      { heading: 'Kenapa Semakin Populer', body: 'Audiens makin skeptis dengan endorsement yang terlihat terlalu polished, sehingga konten KOC yang jujur dan sederhana sering dianggap lebih meyakinkan untuk keputusan beli.' },
    ],
  },
  {
    term: 'KOL (Key Opinion Leader)',
    summary: 'Individu yang punya keahlian atau reputasi kuat di bidang tertentu sehingga opininya dipercaya audiens.',
    sections: [
      { heading: 'Contoh di Berbagai Bidang', body: 'Bisa berupa dokter yang jadi rujukan soal kesehatan, food blogger yang jadi rujukan kuliner, atau tech reviewer yang jadi rujukan sebelum orang membeli gadget.' },
      { heading: 'Kenapa Dipilih Brand', body: 'Rekomendasi dari KOL terasa lebih kredibel karena didasarkan pada keahlian atau pengalaman nyata, bukan sekadar populer di media sosial.' },
    ],
  },
  {
    term: 'KPI (Key Performance Indicator)',
    summary: 'Indikator terukur yang dipakai untuk menilai apakah sebuah campaign berhasil mencapai tujuannya.',
    sections: [
      { heading: 'Contoh KPI Campaign KOL', body: 'Bisa berupa target reach, engagement rate minimum, jumlah klik link, atau target penjualan tergantung tujuan campaign (awareness, engagement, atau konversi).' },
      { heading: 'Kenapa Harus Ditentukan di Awal', body: 'Tanpa KPI yang jelas sejak awal, brand dan creator sulit menilai objektif apakah campaign benar-benar berhasil atau tidak setelah selesai.' },
    ],
  },
  {
    term: 'Live Shopping',
    summary: 'Sesi siaran langsung di mana creator memperkenalkan dan menjual produk secara real-time kepada penonton.',
    sections: [
      { heading: 'Elemen Kunci Sebuah Sesi', body: 'Umumnya melibatkan demo produk langsung, tanya jawab dengan penonton, promo/diskon eksklusif selama live, dan keranjang belanja yang bisa langsung diklik penonton.' },
      { heading: 'Kenapa Efektif untuk Konversi', body: 'Interaksi real-time membuat penonton lebih yakin karena bisa langsung bertanya, sementara urgensi promo terbatas waktu mendorong keputusan beli lebih cepat.' },
    ],
  },
  {
    term: 'Macro Influencer',
    summary: 'Creator dengan jumlah follower besar, umumnya 500 ribu hingga 1 juta, dengan jangkauan luas namun engagement relatif lebih rendah.',
    sections: [
      { heading: 'Kelebihannya', body: 'Cocok untuk campaign awareness skala besar karena bisa menjangkau audiens dalam jumlah signifikan dalam satu kali posting.' },
      { heading: 'Yang Perlu Diperhatikan', body: 'Karena engagement rate cenderung lebih rendah dibanding tier di bawahnya, brand perlu mengombinasikan macro influencer dengan micro/nano untuk mendapat kedalaman kepercayaan audiens.' },
    ],
  },
  {
    term: 'Media Kit',
    summary: 'Dokumen profil creator berisi statistik akun, demografi audiens, dan contoh kerja sama sebelumnya untuk ditawarkan ke brand.',
    sections: [
      { heading: 'Isi Umum Media Kit', body: 'Biasanya mencantumkan jumlah follower per platform, rata-rata engagement rate, demografi audiens, rate card, dan portofolio brand yang pernah diajak kerja sama.' },
      { heading: 'Kenapa Penting bagi Creator', body: 'Media kit yang rapi mempermudah brand menilai kecocokan dan kredibilitas creator dengan cepat, tanpa harus menggali sendiri data dari akun media sosialnya.' },
    ],
  },
  {
    term: 'Mega Influencer',
    summary: 'Creator dengan follower di atas 1 juta, biasanya selebriti atau figur publik dengan jangkauan sangat besar.',
    sections: [
      { heading: 'Karakteristiknya', body: 'Punya eksposur media yang luas dan sering kali sudah dikenal lewat karier di luar media sosial (aktor, musisi, atlet), bukan murni dibesarkan dari konten organik.' },
      { heading: 'Kapan Cocok Dipakai', body: 'Ideal untuk campaign awareness besar-besaran atau peluncuran produk berskala nasional, dengan konsekuensi biaya kerja sama yang jauh lebih tinggi.' },
    ],
  },
  {
    term: 'Micro Influencer',
    summary: 'Creator dengan follower sekitar 10 ribu hingga 100 ribu, dikenal punya engagement rate dan kedekatan audiens yang lebih tinggi.',
    sections: [
      { heading: 'Kenapa Sering Jadi Favorit Brand', body: 'Audiensnya cenderung lebih niche dan loyal, membuat rekomendasi produk dari micro influencer terasa lebih personal dan dipercaya dibanding creator dengan follower jauh lebih besar.' },
      { heading: 'Strategi Umum Pemakaiannya', body: 'Brand sering melibatkan banyak micro influencer sekaligus dalam satu campaign untuk mendapatkan kombinasi jangkauan yang cukup luas sekaligus engagement yang tetap tinggi.' },
    ],
  },
  {
    term: 'Nano Influencer',
    summary: 'Creator dengan follower di bawah 10 ribu, biasanya punya hubungan sangat dekat dan personal dengan audiensnya.',
    sections: [
      { heading: 'Kekuatan Utamanya', body: 'Karena audiensnya kecil, interaksi terasa seperti obrolan antar teman, membuat tingkat kepercayaan terhadap rekomendasinya sering kali sangat tinggi.' },
      { heading: 'Kapan Cocok Digunakan', body: 'Cocok untuk campaign dengan budget terbatas namun ingin melibatkan banyak suara sekaligus (nano-micro campaign), atau untuk menjangkau komunitas lokal yang sangat spesifik.' },
    ],
  },
  {
    term: 'Organic Reach',
    summary: 'Jangkauan konten yang didapat secara alami tanpa bantuan iklan berbayar.',
    sections: [
      { heading: 'Faktor yang Mempengaruhi', body: 'Ditentukan algoritma platform berdasarkan kualitas konten, tingkat interaksi awal, relevansi hashtag/audio, dan konsistensi posting akun.' },
      { heading: 'Kenapa Diperhitungkan Brand', body: 'Organic reach yang tinggi menunjukkan konten campaign benar-benar disukai audiens secara alami, bukan hanya terlihat bagus karena dorongan iklan berbayar.' },
    ],
  },
  {
    term: 'Paid Promote',
    summary: 'Bentuk kerja sama sederhana di mana creator dibayar untuk mempromosikan produk tanpa keterlibatan brand dalam proses kreatif.',
    sections: [
      { heading: 'Bedanya dengan Sponsored Post', body: 'Paid promote biasanya lebih transaksional dan cepat — brand mengirim materi promosi jadi (caption, gambar) untuk langsung diposting creator tanpa proses kreatif tambahan.' },
      { heading: 'Kapan Cocok Dipakai', body: 'Cocok untuk campaign jangka pendek dengan pesan yang sudah baku, misalnya promo flash sale atau pengumuman event, di mana kreativitas personal creator bukan prioritas utama.' },
    ],
  },
  {
    term: 'Performance Marketing',
    summary: 'Strategi campaign yang fokus pada hasil terukur seperti klik, konversi, atau penjualan, bukan sekadar awareness.',
    sections: [
      { heading: 'Metrik yang Diprioritaskan', body: 'Selalu berpusat pada angka yang bisa langsung dihitung — cost per click, cost per acquisition, conversion rate, hingga ROI campaign.' },
      { heading: 'Kenapa Sering Dipasangkan dengan Affiliate Marketing', body: 'Karena sama-sama membayar berdasarkan hasil nyata, performance marketing dan affiliate marketing sering berjalan beriringan dalam campaign yang mengejar penjualan langsung.' },
    ],
  },
  {
    term: 'Product Seeding',
    summary: 'Strategi mengirim produk ke banyak creator tanpa kontrak formal, berharap sebagian membuat konten organik tentang produk tersebut.',
    sections: [
      { heading: 'Cara Menjalankannya', body: 'Brand mengirim produk ke puluhan hingga ratusan creator sekaligus (biasanya nano/micro) tanpa kewajiban kontrak, lalu menunggu siapa saja yang tertarik membuat konten secara sukarela.' },
      { heading: 'Kenapa Dipakai', body: 'Cara ini relatif murah dibanding kontrak berbayar penuh, dan konten yang dihasilkan cenderung terasa lebih organik karena murni inisiatif creator yang benar-benar suka produknya.' },
    ],
  },
  {
    term: 'Rate Card',
    summary: 'Daftar harga jasa seorang creator untuk berbagai jenis konten (feed, story, reels, video) di platformnya.',
    sections: [
      { heading: 'Faktor Penentu Harga', body: 'Biasanya dipengaruhi jumlah follower, engagement rate, niche, tingkat eksklusivitas konten, serta durasi dan kompleksitas produksi yang diminta brand.' },
      { heading: 'Kegunaannya bagi Brand', body: 'Rate card mempercepat proses negosiasi karena brand punya gambaran awal budget yang dibutuhkan sebelum masuk ke diskusi detail kerja sama.' },
    ],
  },
  {
    term: 'Reach',
    summary: 'Jumlah akun unik yang melihat sebuah konten, tanpa menghitung tampilan berulang dari orang yang sama.',
    sections: [
      { heading: 'Kenapa Beda dari Impression', body: 'Satu akun yang melihat konten yang sama tiga kali tetap dihitung reach 1, tapi dihitung impression 3 — reach selalu menunjukkan jangkauan audiens yang sebenarnya.' },
      { heading: 'Kegunaan dalam Evaluasi Campaign', body: 'Reach jadi metrik utama untuk campaign awareness karena langsung menunjukkan berapa banyak orang berbeda yang benar-benar terpapar pesan campaign.' },
    ],
  },
  {
    term: 'ROI (Return on Investment)',
    summary: 'Perbandingan antara keuntungan yang didapat dengan biaya yang dikeluarkan untuk sebuah campaign.',
    sections: [
      { heading: 'Cara Menghitung', body: 'ROI = ((pendapatan − biaya campaign) ÷ biaya campaign) × 100%. Semakin tinggi angkanya, semakin efisien campaign tersebut menghasilkan keuntungan.' },
      { heading: 'Tantangan dalam Campaign KOL', body: 'ROI campaign awareness lebih sulit dihitung langsung karena manfaatnya (seperti brand awareness) tidak selalu berupa penjualan instan, sehingga sering dikombinasikan dengan metrik lain.' },
    ],
  },
  {
    term: 'Sentiment Analysis',
    summary: 'Proses menilai nada emosi (positif, negatif, netral) dari komentar dan reaksi audiens terhadap sebuah konten.',
    sections: [
      { heading: 'Cara Melakukannya', body: 'Bisa dilakukan manual dengan membaca komentar satu per satu, atau otomatis lewat tools yang mengklasifikasikan kata dan emoji ke dalam kategori sentimen tertentu.' },
      { heading: 'Manfaat bagi Brand', body: 'Membantu brand memahami reaksi asli audiens terhadap campaign atau produk, termasuk mendeteksi lebih dini kalau ada respons negatif yang perlu segera ditangani.' },
    ],
  },
  {
    term: 'Sponsored Post',
    summary: 'Konten yang dibuat creator atas dasar bayaran dari brand, biasanya wajib diberi label pengungkapan.',
    sections: [
      { heading: 'Perbedaannya dengan Konten Organik', body: 'Sponsored post dibuat karena ada pembayaran dan biasanya mengikuti briefing brand, sementara konten organik murni inisiatif dan gaya bebas creator sendiri.' },
      { heading: 'Aturan yang Menyertainya', body: 'Wajib diberi label pengungkapan (Ad/Sponsored) sesuai kebijakan platform dan regulasi periklanan agar audiens tahu itu konten berbayar.' },
    ],
  },
  {
    term: 'Talent Management',
    summary: 'Layanan yang mengelola jadwal, negosiasi kerja sama, dan pengembangan karier seorang creator atau KOL.',
    sections: [
      { heading: 'Cakupan Layanannya', body: 'Mulai dari negosiasi rate dengan brand, penjadwalan campaign agar tidak bentrok, hingga strategi pengembangan konten jangka panjang creator.' },
      { heading: 'Manfaat bagi Creator', body: 'Memungkinkan creator fokus membuat konten sementara urusan administratif dan negosiasi bisnis ditangani pihak profesional.' },
    ],
  },
  {
    term: 'Talkability',
    summary: 'Sejauh mana sebuah konten atau campaign memicu percakapan dan pembicaraan di kalangan audiens.',
    sections: [
      { heading: 'Indikatornya', body: 'Bisa dilihat dari jumlah dan kualitas komentar, seberapa sering konten dibagikan ulang dengan opini tambahan, atau muncul jadi bahan obrolan di platform lain.' },
      { heading: 'Kenapa Dikejar Brand', body: 'Campaign dengan talkability tinggi cenderung menyebar lebih jauh secara organik karena audiens sendiri yang terus membicarakannya tanpa perlu dorongan iklan tambahan.' },
    ],
  },
  {
    term: 'UGC (User Generated Content)',
    summary: 'Konten yang dibuat oleh konsumen atau audiens biasa tentang sebuah brand, bukan oleh brand atau creator berbayar.',
    sections: [
      { heading: 'Contohnya', body: 'Review produk spontan di TikTok, repost foto pelanggan di Instagram, atau video unboxing yang dibuat konsumen tanpa diminta brand.' },
      { heading: 'Kenapa Dianggap Sangat Kredibel', body: 'Karena dibuat tanpa bayaran dan tanpa agenda promosi, UGC sering dianggap audiens lebih jujur dan meyakinkan dibanding konten dari campaign berbayar.' },
    ],
  },
  {
    term: 'Usage Rights',
    summary: 'Hak yang diberikan creator kepada brand untuk memakai ulang kontennya di kanal lain, misalnya iklan berbayar atau website.',
    sections: [
      { heading: 'Cakupan yang Biasa Dinegosiasikan', body: 'Termasuk platform yang boleh dipakai (organik saja atau juga iklan berbayar), durasi pemakaian, dan apakah konten boleh diedit ulang oleh brand.' },
      { heading: 'Kenapa Perlu Dituliskan Jelas di Kontrak', body: 'Tanpa usage rights yang jelas, brand secara hukum sebenarnya tidak berhak memakai ulang konten creator di luar konteks postingan aslinya.' },
    ],
  },
  {
    term: 'Viral',
    summary: 'Kondisi ketika sebuah konten menyebar sangat cepat dan luas melampaui audiens asli si pembuat konten.',
    sections: [
      { heading: 'Faktor Pemicunya', body: 'Biasanya dipicu kombinasi antara relevansi topik, emosi kuat yang ditimbulkan (lucu, mengejutkan, related), dan dorongan algoritma platform yang mempercepat penyebarannya.' },
      { heading: 'Risikonya bagi Campaign Brand', body: 'Viral tidak selalu berarti positif — konten yang viral karena kontroversi justru bisa berbalik merugikan brand, sehingga viralitas perlu diarahkan, bukan dibiarkan begitu saja.' },
    ],
  },
  {
    term: 'Vlog',
    summary: 'Konten video berformat jurnal pribadi yang mendokumentasikan aktivitas atau pengalaman creator sehari-hari.',
    sections: [
      { heading: 'Kenapa Efektif untuk Product Placement', body: 'Produk yang muncul natural dalam rutinitas sehari-hari creator terasa lebih organik dibanding iklan langsung, karena konteksnya memang bagian dari cerita, bukan sisipan promosi.' },
      { heading: 'Tantangannya', body: 'Karena formatnya panjang dan personal, brand perlu memastikan momen penyebutan produk tidak terasa terlalu dipaksakan di tengah narasi vlog.' },
    ],
  },
  {
    term: 'Watch Time',
    summary: 'Total durasi audiens menonton sebuah video, dipakai platform untuk menilai kualitas dan relevansi konten.',
    sections: [
      { heading: 'Kenapa Dianggap Sinyal Kualitas', body: 'Video yang ditonton sampai habis dianggap algoritma lebih relevan dan menarik dibanding video yang banyak ditinggalkan di detik-detik awal.' },
      { heading: 'Dampaknya ke Distribusi Konten', body: 'Watch time yang tinggi biasanya mendorong platform mendistribusikan video lebih luas lagi, termasuk ke FYP atau rekomendasi, sehingga menambah reach organik campaign.' },
    ],
  },
  {
    term: 'Whitelisting',
    summary: 'Praktik di mana brand diberi akses oleh creator untuk menjalankan iklan berbayar langsung dari akun creator tersebut.',
    sections: [
      { heading: 'Cara Kerjanya', body: 'Creator memberi izin akses lewat fitur partnership ads di platform, sehingga brand bisa menjalankan iklan berbayar yang tampil seolah-olah datang langsung dari akun creator, lengkap dengan targeting brand sendiri.' },
      { heading: 'Kenapa Digunakan', body: 'Iklan yang tampil dari akun creator biasanya punya tingkat kepercayaan dan performa lebih baik dibanding iklan dari akun brand langsung, sekaligus memperluas jangkauan konten lewat budget iklan.' },
    ],
  },
  {
    term: 'Word-of-Mouth',
    summary: 'Penyebaran informasi atau rekomendasi tentang brand dari satu orang ke orang lain secara alami.',
    sections: [
      { heading: 'Peran KOL di Dalamnya', body: 'KOL sering dipakai sebagai pemicu awal (trigger) agar audiens mulai membicarakan dan merekomendasikan produk ke lingkaran pertemanan atau keluarga mereka sendiri.' },
      { heading: 'Kenapa Dianggap Bentuk Promosi Paling Kuat', body: 'Rekomendasi dari orang yang dipercaya secara personal (teman, keluarga) punya tingkat konversi yang jauh lebih tinggi dibanding iklan langsung dari brand.' },
    ],
  },
];

export const glossaryTerms: GlossaryTerm[] = rawTerms
  .map((t) => ({ ...t, slug: slugify(t.term) }))
  .sort((a, b) => a.term.localeCompare(b.term));
