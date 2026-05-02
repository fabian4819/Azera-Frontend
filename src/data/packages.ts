export interface Package {
  id: string;
  name: string;
  slug: string;
  kolRange: string;
  platforms: string[];
  reach: string;
  price: string;
  priceRaw: number;
  features: string[];
  popular?: boolean;
}

export const packages: Package[] = [
  {
    id: 'starter',
    name: 'Starter',
    slug: 'starter',
    kolRange: '10–30 KOL',
    platforms: ['Instagram', 'TikTok'],
    reach: '500K–1.5M',
    price: 'Rp 5.000.000',
    priceRaw: 5000000,
    features: [
      'KOL matching + brief',
      'Content review',
      'Basic campaign report',
      'Dedicated WhatsApp support',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    slug: 'growth',
    kolRange: '30–100 KOL',
    platforms: ['Instagram', 'TikTok', 'YouTube'],
    reach: '1.5M–5M',
    price: 'Rp 15.000.000',
    priceRaw: 15000000,
    features: [
      'Everything in Starter',
      'Full campaign management',
      'Mid-campaign report',
      'Dedicated PIC',
    ],
    popular: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    slug: 'scale',
    kolRange: '100–500+ KOL',
    platforms: ['All platforms', 'Live'],
    reach: '5M–20M+',
    price: 'Rp 40.000.000',
    priceRaw: 40000000,
    features: [
      'Everything in Growth',
      'Strategy session',
      'Real-time dashboard',
      'Priority support',
      'Live streaming KOL',
    ],
  },
];
