const waLink = (phone: string, message: string) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

export const contactOptions = [
  { label: 'Brand', href: waLink('6281919525186', 'Halo AzeraKOL!\nSaya dari brand, ingin tanya-tanya, boleh dibantu?') },
  { label: 'Creator', href: waLink('62882000778062', 'Halo AzeraKOL!\nSaya creator, ingin tanya-tanya, boleh dibantu?') },
];
