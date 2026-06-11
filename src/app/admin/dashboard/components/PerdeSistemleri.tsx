"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';

const IMGBB_KEY = '51eca7c487b49a21c7f45c86a42093cf';

const PRODUCT_CATS = [
  { slug: 'stor-perde', title: 'Stor Perde', fallback: '/Perde-Image/stor-perde.png' },
  { slug: 'zebra-perde', title: 'Zebra Perde', fallback: '/Perde-Image/zebra-perde.jpg' },
  { slug: 'ahsap-jaluzi', title: 'Ahşap Jaluzi', fallback: '/Perde-Image/ahsap-jaluzi.jpg' },
  { slug: 'aluminyum-jaluzi', title: 'Alüminyum Jaluzi', fallback: '/Perde-Image/alimunyum-jaluzi.jpg' },
  { slug: 'motorlu-sistemler', title: 'Motorlu Sistemler', fallback: '/Perde-Image/motorlu-sistem.jpg' },
];

export default function PerdeSistemleri() {
  const [categoryCovers, setCategoryCovers] = useState<Record<string, string>>({});
  const [coverUploading, setCoverUploading] = useState<string | null>(null);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'category_covers')).then((snap) => {
      if (snap.exists()) setCategoryCovers(snap.data() as Record<string, string>);
    }).catch(() => { });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold mb-1 tracking-tight">Perde Sistemleri Görselleri</h2>
        <p className="text-slate-500 font-medium">Ana sayfadaki "Perde Sistemleri" bölümünde her kartın kapak fotoğrafını buradan güncelleyin. Değişiklikler anında yansır.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCT_CATS.map((cat) => {
          const currentImg = categoryCovers[cat.slug] || cat.fallback;
          const isUploading = coverUploading === cat.slug;
          const hasCustom = !!categoryCovers[cat.slug];
          
          return (
            <div key={cat.slug} className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
              <div className="relative w-full h-52 bg-slate-100 overflow-hidden">
                <img src={currentImg} alt={cat.title} className="w-full h-full object-cover" />
                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                    <Loader2 size={32} className="animate-spin text-sky-500 mb-2" />
                    <span className="text-sm font-bold text-slate-600">Yükleniyor...</span>
                  </div>
                )}
                <span className={`absolute top-3 left-3 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow ${hasCustom ? 'bg-emerald-500' : 'bg-slate-400'}`}>
                  {hasCustom ? 'Özel Görsel' : 'Varsayılan'}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-extrabold text-slate-800 text-[16px] mb-4">{cat.title}</h3>
                <div className="flex gap-2">
                  <label className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-bold text-sm cursor-pointer transition-all border ${isUploading || coverUploading ? 'bg-slate-100 text-slate-400 border-slate-200 pointer-events-none' : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'}`}>
                    <ImageIcon size={16} />
                    {isUploading ? 'Yükleniyor...' : 'Görsel Yükle'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={!!coverUploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        e.target.value = '';
                        setCoverUploading(cat.slug);
                        try {
                          const fd = new FormData();
                          fd.append('image', file);
                          const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: 'POST', body: fd });
                          const data = await res.json();
                          if (data.success) {
                            const newCovers = { ...categoryCovers, [cat.slug]: data.data.url };
                            setCategoryCovers(newCovers);
                            await setDoc(doc(db, 'settings', 'category_covers'), newCovers);
                          } else {
                            alert('Resim yüklenemedi: ' + data.error?.message);
                          }
                        } catch {
                          alert('Yükleme sırasında hata oluştu.');
                        } finally {
                          setCoverUploading(null);
                        }
                      }}
                    />
                  </label>

                  {hasCustom && (
                    <button
                      disabled={!!coverUploading}
                      onClick={async () => {
                        if (!confirm(`${cat.title} için özel görseli kaldırıp varsayılana dönmek istiyor musunuz?`)) return;
                        const newCovers = { ...categoryCovers };
                        delete newCovers[cat.slug];
                        setCategoryCovers(newCovers);
                        await setDoc(doc(db, 'settings', 'category_covers'), newCovers);
                      }}
                      className="w-11 h-11 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all shrink-0 disabled:opacity-50"
                      title="Varsayılana dön"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
