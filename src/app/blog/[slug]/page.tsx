import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/ui/FloatingButtons';
import { Clock, ArrowLeft, ArrowRight, BookOpen, Home } from 'lucide-react';
import { getPublishedBlogPostBySlug, getRelatedBlogPosts, stripHtml } from '@/lib/blog';

export const dynamic = 'force-dynamic';

type BlogDetailProps = {
  params: Promise<{ slug: string }>;
};

const formatDate = (date: string | null) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(date));
};

const readTime = (content: string) => Math.max(1, Math.round((content || '').split(' ').length / 200));

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Makale Bulunamadı | Perdens',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = post.excerpt || stripHtml(post.content).slice(0, 155);
  const canonical = `https://perdens.com/blog/${post.slug}`;

  return {
    title: {
      absolute: `${post.title} | Perdens Blog`,
    },
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
      },
    },
    openGraph: {
      title: post.title,
      description,
      url: canonical,
      type: 'article',
      publishedTime: post.createdAt || undefined,
      modifiedTime: post.updatedAt || post.createdAt || undefined,
      authors: [post.author || 'Perdens Perde'],
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : undefined,
    },
    twitter: {
      card: post.coverImage ? 'summary_large_image' : 'summary',
      title: post.title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const related = await getRelatedBlogPosts(post);
  const articleBody = stripHtml(post.content);
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || articleBody.slice(0, 155),
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.createdAt || undefined,
    dateModified: post.updatedAt || post.createdAt || undefined,
    author: {
      '@type': 'Organization',
      name: post.author || 'Perdens Perde',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Perdens',
      logo: {
        '@type': 'ImageObject',
        url: 'https://perdens.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://perdens.com/blog/${post.slug}`,
    },
    articleSection: post.category || undefined,
    articleBody,
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Header theme="light" />

      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden mt-[80px]">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          {/* Breadcrumb */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6">
            <div className="flex items-center gap-2 text-white/60 text-sm font-semibold mb-4">
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-1"><Home size={13} /> Ana Sayfa</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-white/90 truncate max-w-[200px]">{post.title}</span>
            </div>
            {post.category && (
              <span className="px-3 py-1.5 bg-emerald-500 text-white text-[11px] font-extrabold uppercase tracking-widest rounded-lg mb-3 inline-block">
                {post.category}
              </span>
            )}
            <h1 className="text-[26px] md:text-[38px] font-extrabold text-white leading-tight drop-shadow-lg">
              {post.title}
            </h1>
          </div>
        </div>
      )}

      <main className="flex-grow">
        <article className="max-w-3xl mx-auto px-6 py-12">

          {/* Header when no cover image */}
          {!post.coverImage && (
            <div className="pt-32 mb-10">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold mb-5">
                <Link href="/" className="hover:text-slate-700 transition-colors flex items-center gap-1"><Home size={13} /> Ana Sayfa</Link>
                <span>/</span>
                <Link href="/blog" className="hover:text-slate-700 transition-colors">Blog</Link>
              </div>
              {post.category && (
                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-extrabold uppercase tracking-widest rounded-lg mb-5 inline-block">
                  {post.category}
                </span>
              )}
              <h1 className="text-[32px] md:text-[44px] font-extrabold text-slate-900 leading-tight mb-4">{post.title}</h1>
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 flex-wrap py-6 border-y border-slate-100 mb-10">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
                {(post.author || 'H').charAt(0)}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{post.author || 'Perdens Perde'}</p>
                <p className="text-xs text-slate-400">{formatDate(post.createdAt)}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-100 hidden sm:block" />
            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-semibold">
              <Clock size={14} /> {readTime(post.content)} dk okuma
            </div>
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <div className="text-[18px] text-slate-600 font-medium leading-relaxed mb-8 p-5 bg-slate-50 border-l-4 border-emerald-500 rounded-r-2xl">
              {post.excerpt}
            </div>
          )}

          {/* Content */}
          <div
            className="blog-content text-slate-800 leading-[1.8] text-[17px]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Back link */}
          <div className="mt-16 pt-8 border-t border-slate-100">
            <Link href="/blog" className="inline-flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-[14px] font-bold hover:bg-zinc-800 transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Tüm Makaleler
            </Link>
          </div>
        </article>

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="bg-slate-50 border-t border-slate-100 py-16 px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-8">Benzer İçerikler</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map(p => (
                  <Link key={p.id} href={`/blog/${p.slug}`} className="group block">
                    <article className="bg-white rounded-[20px] border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden">
                      <div className="h-44 bg-slate-100 overflow-hidden">
                        {p.coverImage ? (
                          <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><BookOpen size={32} className="text-slate-300" /></div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-extrabold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2">{p.title}</h3>
                        <p className="text-sm text-slate-400 line-clamp-2">{p.excerpt}</p>
                        <div className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-600">
                          Oku <ArrowRight size={12} />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
