import { MetadataRoute } from 'next';
import { categoriesData } from '@/data/categories';
import { getPublishedBlogPosts } from '@/lib/blog';

const BASE_URL = 'https://perdens.com';

export const dynamic = 'force-dynamic';

const now = () => new Date();

const normalizeDate = (date: string | Date | null | undefined): Date => {
  if (!date) return now();

  const parsed = date instanceof Date ? date : new Date(date);
  return Number.isNaN(parsed.getTime()) ? now() : parsed;
};

const normalizeSlug = (slug: string) => slug.trim().replace(/^\/+|\/+$/g, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Statik Rotalar
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/hakkimizda`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/iletisim`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/kategoriler`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // 2. Dinamik Kategori Rotaları (/[slug])
  const categoryRoutes: MetadataRoute.Sitemap = categoriesData
    .map((cat) => normalizeSlug(cat.slug))
    .filter(Boolean)
    .map((slug) => ({
      url: `${BASE_URL}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  // 3. Dinamik Blog Rotaları (/blog/[slug])
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPublishedBlogPosts();
    blogRoutes = posts
      .map((post) => ({
        slug: normalizeSlug(post.slug),
        lastModified: normalizeDate(post.updatedAt || post.createdAt),
      }))
      .filter((post) => post.slug)
      .map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: post.lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
  } catch (error) {
    console.error('Sitemap blog fetch error:', error);
  }

  return [...staticRoutes, ...categoryRoutes, ...blogRoutes];
}
