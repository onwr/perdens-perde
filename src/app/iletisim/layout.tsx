import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'İletişim | Perdens Perde Sistemleri' },
  description: 'Perdens Perde Sistemleri ile iletişime geçin. Ücretsiz keşif, ölçü ve teklif için bize ulaşın.',
  alternates: { canonical: '/iletisim' },
  openGraph: {
    title: 'İletişim | Perdens Perde Sistemleri',
    description: 'Perdens Perde Sistemleri ile iletişime geçin. Ücretsiz keşif, ölçü ve teklif için bize ulaşın.',
    url: '/iletisim',
  },
};

export default function IletisimLayout({ children }: { children: React.ReactNode }) {
  return children;
}
