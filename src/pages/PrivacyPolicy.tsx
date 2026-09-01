const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontWeight: 800,
  fontSize: '1.3rem',
  color: 'var(--on-background)',
  marginTop: '40px',
  marginBottom: '14px',
};

const paragraphStyle: React.CSSProperties = {
  color: 'var(--on-surface-variant)',
  fontSize: '0.98rem',
  lineHeight: 1.8,
  marginBottom: '14px',
};

const listStyle: React.CSSProperties = {
  color: 'var(--on-surface-variant)',
  fontSize: '0.98rem',
  lineHeight: 1.8,
  marginBottom: '14px',
  paddingLeft: '22px',
};

export default function PrivacyPolicy() {
  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh' }}>
      <div style={{ padding: '80px 24px 8px', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <span className="tag-pill tag-pill-navy" style={{ margin: '0 auto 16px' }}>Legal</span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              color: 'var(--on-background)',
              lineHeight: 1.15,
              marginBottom: '12px',
              letterSpacing: '-0.03em',
            }}
          >
            Kebijakan Privasi AZERAKOL.ID
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem' }}>
            Terakhir diperbarui: 1 September 2026
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px 100px' }}>
        <p style={paragraphStyle}>
          AZERAKOL.ID (&quot;kami&quot;) menyediakan layanan otomasi engagement Instagram bagi klien kami, termasuk fitur balasan
          otomatis (comment-to-DM automation) yang mengirimkan pesan langsung (Direct Message) kepada pengguna Instagram
          yang berkomentar dengan kata kunci tertentu pada unggahan klien kami. Kebijakan ini menjelaskan data apa yang
          kami kumpulkan, bagaimana kami menggunakannya, dan hak Anda atas data tersebut.
        </p>

        <h2 style={sectionTitleStyle}>1. Data yang Kami Kumpulkan</h2>
        <p style={paragraphStyle}>
          Saat Anda berinteraksi dengan akun Instagram klien kami (melalui komentar atau Direct Message) yang menggunakan
          layanan kami, kami dapat mengumpulkan:
        </p>
        <ul style={listStyle}>
          <li>Nama pengguna (username) Instagram Anda</li>
          <li>Isi komentar yang Anda tulis pada unggahan</li>
          <li>Isi pesan (DM) dalam percakapan otomatis dengan akun tersebut</li>
        </ul>
        <p style={paragraphStyle}>
          Kami <strong>tidak</strong> mengumpulkan kata sandi, data pembayaran, lokasi presisi, atau informasi pribadi lain
          di luar yang disebutkan di atas.
        </p>

        <h2 style={sectionTitleStyle}>2. Bagaimana Kami Menggunakan Data</h2>
        <p style={paragraphStyle}>Data yang dikumpulkan digunakan semata-mata untuk:</p>
        <ul style={listStyle}>
          <li>Mendeteksi kata kunci pada komentar Anda untuk memicu balasan otomatis yang relevan</li>
          <li>Mengirimkan Direct Message berisi informasi, tautan, atau balasan yang diminta</li>
          <li>Mencatat riwayat interaksi agar percakapan otomatis berjalan sesuai konteks (misalnya menghindari duplikasi pesan)</li>
          <li>Membantu klien kami (pemilik akun Instagram) memantau performa engagement mereka</li>
        </ul>
        <p style={paragraphStyle}>
          Kami tidak menggunakan data ini untuk profil iklan pihak ketiga, tidak menjual data Anda, dan tidak
          membagikannya kepada pihak luar selain klien AZERAKOL.ID yang bersangkutan dan penyedia infrastruktur teknis
          kami (server/database) yang bertindak semata sebagai penyimpan data.
        </p>

        <h2 style={sectionTitleStyle}>3. Dasar Layanan (Meta Platform)</h2>
        <p style={paragraphStyle}>
          Layanan ini beroperasi menggunakan Instagram Graph API resmi dari Meta. Kami mematuhi kebijakan penggunaan data
          Meta Platform, termasuk batasan waktu pengiriman pesan (24-hour messaging window) yang berlaku pada seluruh
          integrasi Instagram Messaging.
        </p>

        <h2 style={sectionTitleStyle}>4. Penyimpanan dan Keamanan Data</h2>
        <p style={paragraphStyle}>
          Data disimpan pada server milik AZERAKOL.ID dengan akses terbatas hanya untuk tim internal yang mengelola
          operasional layanan. Kami menerapkan langkah-langkah keamanan standar industri untuk melindungi data dari akses
          tidak sah.
        </p>

        <h2 style={sectionTitleStyle}>5. Berapa Lama Data Disimpan</h2>
        <p style={paragraphStyle}>
          Data komentar dan pesan disimpan selama diperlukan untuk keperluan operasional layanan (misalnya pelaporan
          performa kepada klien) dan akan dihapus atau dianonimkan setelah periode tersebut tidak lagi relevan, kecuali
          diwajibkan oleh hukum untuk disimpan lebih lama.
        </p>

        <h2 style={sectionTitleStyle}>6. Hak Anda</h2>
        <p style={paragraphStyle}>Anda berhak untuk:</p>
        <ul style={listStyle}>
          <li>Meminta informasi mengenai data apa yang kami simpan tentang Anda</li>
          <li>Meminta penghapusan data Anda dari sistem kami</li>
        </ul>
        <p style={paragraphStyle}>
          Untuk mengajukan permintaan ini, silakan hubungi kami melalui{' '}
          <a href="mailto:hello@azerakol.id" style={{ color: 'var(--secondary)', fontWeight: 600 }}>hello@azerakol.id</a>.
        </p>

        <h2 style={sectionTitleStyle}>7. Perubahan Kebijakan</h2>
        <p style={paragraphStyle}>
          Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Perubahan akan dipublikasikan pada halaman ini dengan
          tanggal pembaruan terbaru.
        </p>

        <h2 style={sectionTitleStyle}>8. Kontak</h2>
        <p style={paragraphStyle}>
          Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini, silakan hubungi kami di{' '}
          <a href="mailto:hello@azerakol.id" style={{ color: 'var(--secondary)', fontWeight: 600 }}>hello@azerakol.id</a>.
        </p>
      </div>
    </div>
  );
}
