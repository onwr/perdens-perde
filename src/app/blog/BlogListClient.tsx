"use client";

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, Search } from 'lucide-react';
import type { BlogPost } from '@/lib/blog';

export default function BlogListClient({ posts }: { posts: BlogPost[] }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tümü');

  const categories = ['Tümü', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];

  const filtered = posts.filter(p => {
    const matchesCategory = activeCategory === 'Tümü' || p.category === activeCategory;
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (date: string | null) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(date));
  };

  const readTime = (content: string) => {
    const words = (content || '').split(' ').length;
    return Math.max(1, Math.round(words / 200));
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-50 rounded-full blur-[100px] opacity-60 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-xs font-bold uppercase tracking-widest mb-6">
            <BookOpen size={13} /> Blog & İçerikler
          </div>
          <h1 className="text-[42px] md:text-[60px] font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-5">
            Perde Sistemleri &<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-400">Tasarım Rehberi</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto mb-10">
            Mekan tasarımı, perde seçimi ve kurumsal projeler hakkında uzman içerikler.
          </p>
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Makale veya konu ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-5 h-12 bg-white border border-slate-200 rounded-2xl text-slate-700 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm transition-all"
            />
          </div>
        </div>
      </section>

      {/* Category Filters */}
      {categories.length > 1 && (
        <div className="sticky top-[79px] z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-zinc-900 text-white shadow' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-16">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-32 text-slate-400">
            <BookOpen size={48} className="mb-4 text-slate-300" />
            <h3 className="text-xl font-bold text-slate-600 mb-2">Makale Bulunamadı</h3>
            <p className="font-medium">Henüz yayınlanmış içerik yok ya da arama sonucu boş.</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {filtered[0] && (
              <Link href={`/blog/${filtered[0].slug}`} className="block mb-12 group">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-[28px] border border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-1">
                  <div className="relative h-64 lg:h-auto min-h-[300px] bg-slate-100 overflow-hidden">
                    {filtered[0].coverImage ? (
                      <img src={filtered[0].coverImage} alt={filtered[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                        <BookOpen size={64} className="text-slate-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-extrabold uppercase tracking-widest rounded-lg shadow">
                        Öne Çıkan
                      </span>
                    </div>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      {filtered[0].category && (
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[11px] font-extrabold uppercase tracking-widest rounded-lg">
                          {filtered[0].category}
                        </span>
                      )}
                      <span className="text-slate-400 text-sm font-medium flex items-center gap-1">
                        <Clock size={13} /> {readTime(filtered[0].content)} dk okuma
                      </span>
                    </div>
                    <h2 className="text-[24px] lg:text-[30px] font-extrabold text-slate-900 mb-4 leading-tight group-hover:text-emerald-700 transition-colors">
                      {filtered[0].title}
                    </h2>
                    <p className="text-slate-500 font-medium leading-relaxed mb-6 line-clamp-3">{filtered[0].excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">
                          {(filtered[0].author || 'H').charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-slate-600">{filtered[0].author || 'Perdens Perde'}</span>
                      </div>
                      <span className="text-sm text-slate-400">{formatDate(filtered[0].createdAt)}</span>
                    </div>
                    <div className="mt-6 inline-flex items-center gap-2 font-bold text-emerald-600 text-sm group-hover:gap-3 transition-all">
                      Devamını Oku <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Rest of posts */}
            {filtered.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.slice(1).map(post => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                    <article className="bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] transition-all duration-400 hover:-translate-y-1 overflow-hidden h-full flex flex-col">
                      <div className="relative h-48 bg-slate-100 overflow-hidden shrink-0">
                        {post.coverImage ? (
                          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                            <BookOpen size={40} className="text-slate-300" />
                          </div>
                        )}
                        {post.category && (
                          <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 bg-white/90 backdrop-blur text-slate-700 text-[10px] font-extrabold uppercase tracking-widest rounded-lg shadow-sm">
                              {post.category}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-3">
                          <Clock size={12} /> {readTime(post.content)} dk · {formatDate(post.createdAt)}
                        </div>
                        <h3 className="text-[17px] font-extrabold text-slate-800 mb-3 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-slate-500 text-[14px] font-medium leading-relaxed mb-4 line-clamp-3 flex-grow">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <span className="text-xs font-semibold text-slate-500">{post.author || 'Perdens Perde'}</span>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:gap-2 transition-all">
                            Oku <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
