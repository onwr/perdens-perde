"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Plus, X, Image as ImageIcon, PenLine, FileText, ExternalLink, Eye, EyeOff, Trash2 } from 'lucide-react';

const RichEditor = dynamic(() => import('@/components/ui/RichEditor'), { ssr: false, loading: () => <div className="h-72 bg-slate-50 rounded-2xl border border-slate-200 animate-pulse" /> });

const IMGBB_KEY = '51eca7c487b49a21c7f45c86a42093cf';

const slugify = (text: string) => text
  .toLowerCase()
  .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
  .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
  .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

const BLOG_CATEGORIES = ['Perde Sistemleri', 'İç Mekan Tasarımı', 'Proje Hikayeleri', 'Kurumsal Çözümler', 'İpuçları & Rehber'];

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  author: string;
  createdAt: any;
  published: boolean;
}

export default function BlogYonetimi() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [blogFormSaving, setBlogFormSaving] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: '', slug: '', excerpt: '', content: '', category: BLOG_CATEGORIES[0], author: 'Honurs Perde', published: false, coverImage: ''
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');

  useEffect(() => {
    const bq = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(bq, (snap) => {
      const data: BlogPost[] = [];
      snap.forEach(d => data.push({ id: d.id, ...d.data() } as BlogPost));
      setBlogPosts(data);
      setBlogLoading(false);
    }, () => setBlogLoading(false));
    return () => unsub();
  }, []);

  const openNewBlogForm = () => {
    setEditingPost(null);
    setBlogForm({ title: '', slug: '', excerpt: '', content: '', category: BLOG_CATEGORIES[0], author: 'Honurs Perde', published: false, coverImage: '' });
    setCoverFile(null);
    setCoverPreview('');
    setShowBlogForm(true);
  };

  const openEditBlogForm = (post: BlogPost) => {
    setEditingPost(post);
    setBlogForm({ title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content, category: post.category, author: post.author, published: post.published, coverImage: post.coverImage || '' });
    setCoverFile(null);
    setCoverPreview(post.coverImage || '');
    setShowBlogForm(true);
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const saveBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogFormSaving(true);
    try {
      let coverImageUrl = blogForm.coverImage;

      if (coverFile) {
        const fd = new FormData();
        fd.append('image', coverFile);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: 'POST', body: fd });
        const data = await res.json();
        if (data.success) coverImageUrl = data.data.url;
      }

      const payload = { ...blogForm, coverImage: coverImageUrl, updatedAt: serverTimestamp() };

      if (editingPost) {
        await updateDoc(doc(db, 'blog_posts', editingPost.id), payload);
      } else {
        await addDoc(collection(db, 'blog_posts'), { ...payload, createdAt: serverTimestamp() });
      }
      setShowBlogForm(false);
    } catch (err) {
      alert('Kayıt sırasında hata oluştu!');
    } finally {
      setBlogFormSaving(false);
    }
  };

  const deleteBlogPost = async (id: string) => {
    if (!confirm('Bu makaleyi silmek istediğinize emin misiniz?')) return;
    await deleteDoc(doc(db, 'blog_posts', id));
  };

  const togglePublish = async (post: BlogPost) => {
    await updateDoc(doc(db, 'blog_posts', post.id), { published: !post.published, updatedAt: serverTimestamp() });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold mb-1 tracking-tight">Blog Yönetimi</h2>
          <p className="text-slate-500 font-medium">Makale ekleyin, düzenleyin, yayınlayın veya silin.</p>
        </div>
        <button
          onClick={openNewBlogForm}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-3 rounded-xl font-bold transition-all shadow hover:shadow-md"
        >
          <Plus size={18} /> Yeni Makale
        </button>
      </div>

      {showBlogForm && (
        <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-[28px] w-full max-w-2xl shadow-2xl p-8 my-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-extrabold text-slate-900">{editingPost ? 'Makaleyi Düzenle' : 'Yeni Makale Yaz'}</h3>
              <button onClick={() => setShowBlogForm(false)} className="text-slate-400 hover:text-slate-700"><X size={22} /></button>
            </div>

            <form onSubmit={saveBlogPost} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5"><ImageIcon size={14} /> Kapak Görseli</label>
                <div className="flex items-start gap-4">
                  <div
                    onClick={() => document.getElementById('coverInput')?.click()}
                    className="w-36 h-24 border-2 border-dashed border-slate-300 rounded-2xl overflow-hidden cursor-pointer hover:border-emerald-400 transition-colors flex items-center justify-center bg-slate-50 shrink-0"
                  >
                    {coverPreview ? (
                      <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-slate-400"><ImageIcon size={24} className="mx-auto mb-1" /><span className="text-xs font-bold">Seç</span></div>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 pt-2 font-medium">JPG veya PNG yükleyin.<br />İdeal boyut: 1200×630 px</div>
                  <input id="coverInput" type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Başlık *</label>
                <input
                  required
                  value={blogForm.title}
                  onChange={(e) => setBlogForm(p => ({ ...p, title: e.target.value, slug: p.slug || slugify(e.target.value) }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all"
                  placeholder="Makale başlığı..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">URL Slug *</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 h-12">
                  <span className="text-slate-400 text-sm font-medium shrink-0">/blog/</span>
                  <input
                    required
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm(p => ({ ...p, slug: slugify(e.target.value) }))}
                    className="flex-1 bg-transparent font-semibold text-slate-800 focus:outline-none text-sm"
                    placeholder="makale-url-adi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Kategori</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all appearance-none cursor-pointer"
                  >
                    {BLOG_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Yazar</label>
                  <input
                    value={blogForm.author}
                    onChange={(e) => setBlogForm(p => ({ ...p, author: e.target.value }))}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Kısa Özet *</label>
                <textarea
                  required
                  rows={2}
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm(p => ({ ...p, excerpt: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all resize-none"
                  placeholder="Blog listesinde görünecek kısa açıklama..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Makale İçeriği *</label>
                <RichEditor
                  value={blogForm.content}
                  onChange={(html) => setBlogForm(p => ({ ...p, content: html }))}
                />
                <p className="text-xs text-slate-400 mt-1.5">Zengin metin editörü ile başlıklar, listeler, renkler ve tablolar ekleyebilirsiniz.</p>
              </div>

              <div className="flex items-center justify-between bg-slate-50 px-5 py-4 rounded-xl border border-slate-200">
                <div>
                  <p className="font-bold text-slate-700 text-sm">Yayın Durumu</p>
                  <p className="text-xs text-slate-400">{blogForm.published ? 'Yayında — sitede görünür' : 'Taslak — sadece admin görür'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setBlogForm(p => ({ ...p, published: !p.published }))}
                  className={`relative w-12 h-6 rounded-full transition-all ${blogForm.published ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${blogForm.published ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowBlogForm(false)} className="flex-1 h-12 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  İptal
                </button>
                <button type="submit" disabled={blogFormSaving} className="flex-1 h-12 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                  {blogFormSaving ? <><Loader2 size={18} className="animate-spin" /> Kaydediliyor...</> : <><PenLine size={18} /> {editingPost ? 'Güncelle' : 'Yayınla'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {blogLoading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 size={36} className="animate-spin" />
        </div>
      ) : blogPosts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[24px] p-16 text-center shadow-sm">
          <FileText size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-2">Henüz Makale Yok</h3>
          <p className="text-slate-500 mb-6">İlk makalenizi eklemek için "Yeni Makale" butonunu kullanın.</p>
          <button onClick={openNewBlogForm} className="inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all"><Plus size={16} /> Makale Ekle</button>
        </div>
      ) : (
        <div className="space-y-4">
          {blogPosts.map(post => (
            <div key={post.id} className="bg-white border border-slate-200 rounded-[20px] p-5 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><FileText size={22} className="text-slate-300" /></div>
                )}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg ${post.published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {post.published ? 'Yayında' : 'Taslak'}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">{post.category}</span>
                </div>
                <h4 className="font-extrabold text-slate-800 truncate">{post.title}</h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">{post.excerpt}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors" title="Önizle">
                  <ExternalLink size={16} />
                </a>
                <button onClick={() => togglePublish(post)} className={`p-2 rounded-xl transition-colors ${post.published ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`} title={post.published ? 'Yayından kaldır' : 'Yayınla'}>
                  {post.published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => openEditBlogForm(post)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Düzenle">
                  <PenLine size={16} />
                </button>
                <button onClick={() => deleteBlogPost(post.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Sil">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
