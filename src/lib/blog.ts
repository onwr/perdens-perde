import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  author: string;
  createdAt: string | null;
  updatedAt: string | null;
  published: boolean;
}

const toIsoDate = (value: unknown): string | null => {
  if (!value) return null;

  if (typeof value === 'object' && value !== null && 'toDate' in value) {
    const date = (value as { toDate: () => Date }).toDate();
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  const date = new Date(value as string | number | Date);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const normalizePost = (id: string, data: Record<string, unknown>): BlogPost => ({
  id,
  title: String(data.title || ''),
  slug: String(data.slug || ''),
  excerpt: String(data.excerpt || ''),
  content: String(data.content || ''),
  coverImage: typeof data.coverImage === 'string' ? data.coverImage : undefined,
  category: String(data.category || ''),
  author: String(data.author || 'Honurs Perde'),
  createdAt: toIsoDate(data.createdAt),
  updatedAt: toIsoDate(data.updatedAt),
  published: data.published === true,
});

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const postsQuery = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(postsQuery);

  return snapshot.docs
    .map((doc) => normalizePost(doc.id, doc.data()))
    .filter((post) => post.published && post.slug);
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const postQuery = query(collection(db, 'blog_posts'), where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(postQuery);

  if (snapshot.empty) return null;

  const post = normalizePost(snapshot.docs[0].id, snapshot.docs[0].data());
  return post.published ? post : null;
}

export async function getRelatedBlogPosts(post: BlogPost, count = 3): Promise<BlogPost[]> {
  if (!post.category) return [];

  const relatedQuery = query(collection(db, 'blog_posts'), where('category', '==', post.category));
  const snapshot = await getDocs(relatedQuery);

  return snapshot.docs
    .map((doc) => normalizePost(doc.id, doc.data()))
    .filter((relatedPost) => relatedPost.published && relatedPost.slug && relatedPost.id !== post.id)
    .slice(0, count);
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
