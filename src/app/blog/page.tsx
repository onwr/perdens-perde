import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/ui/FloatingButtons';
import BlogListClient from './BlogListClient';
import { getPublishedBlogPosts } from '@/lib/blog';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    absolute: 'Perde Sistemleri Blog ve Tasarım Rehberi | Perdens',
  },
  description: 'Perde sistemleri, jaluzi, stor perde, ofis perde çözümleri ve iç mekan tasarımı hakkında uzman rehberleri.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Perde Sistemleri Blog ve Tasarım Rehberi | Perdens',
    description: 'Perde seçimi, mekan tasarımı ve kurumsal perde çözümleri hakkında güncel rehber içerikler.',
    url: '/blog',
    type: 'website',
  },
};

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header theme="light" />
      <BlogListClient posts={posts} />
      <Footer />
      <FloatingButtons />
    </div>
  );
}
