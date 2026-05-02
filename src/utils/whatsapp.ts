export interface BrandFormData {
  namaBrand: string;
  namaPIC: string;
  whatsapp: string;
  email: string;
  website?: string;
  kategori: string;
  paket: string;
  targetAudience: string;
  budget: string;
  tujuan: string[];
  durasi: string;
  deskripsi: string;
}

export function buildBrandWALink(data: BrandFormData): string {
  const phone = '6288201586126';

  const tujuanList = Array.isArray(data.tujuan)
    ? data.tujuan.join(', ')
    : data.tujuan;

  const message = `Halo Azera! Saya ingin konsultasi kampanye KOL 🚀

*Detail Brand:*
• Nama Brand: ${data.namaBrand}
• Nama PIC: ${data.namaPIC}
• WhatsApp: ${data.whatsapp}
• Email: ${data.email}
• Website: ${data.website || '-'}

*Detail Kampanye:*
• Kategori: ${data.kategori}
• Paket: ${data.paket}
• Target Audience: ${data.targetAudience}
• Budget: ${data.budget}
• Tujuan: ${tujuanList}
• Durasi: ${data.durasi}

*Deskripsi:*
${data.deskripsi}

Mohon informasi lebih lanjut. Terima kasih!`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}
