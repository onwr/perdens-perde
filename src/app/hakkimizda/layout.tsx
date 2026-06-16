import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Hakkımızda | Perdens Perde Sistemleri' },
  description: 'Perdens Perde Sistemleri hakkında bilgi edinin. Kurumsal perde çözümlerinde deneyim, kalite ve müşteri memnuniyeti odaklı hizmet anlayışımız.',
  alternates: { canonical: '/hakkimizda' },
  openGraph: {
    title: 'Hakkımızda | Perdens Perde Sistemleri',
    description: 'Perdens Perde Sistemleri hakkında bilgi edinin. Kurumsal perde çözümlerinde deneyim, kalite ve müşteri memnuniyeti odaklı hizmet anlayışımız.',
    url: '/hakkimizda',
  },
};

export default function HakkimizdaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
