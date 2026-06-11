"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Check, Image as ImageIcon, Trash2, Plus } from 'lucide-react';

const IMGBB_KEY = '51eca7c487b49a21c7f45c86a42093cf';

export default function Galeriler() {
  const [galleryCategory, setGalleryCategory] = useState<string>('stor-perde');
  const [galleryImages, setGalleryImages] = useState<string[]>(Array(6).fill(''));
  const [galleryUploading, setGalleryUploading] = useState<number | null>(null);
  const [gallerySaving, setGallerySaving] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setGalleryLoading(true);

    const fetchGallery = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'categories_gallery', galleryCategory));
        if (cancelled) return;
        const saved: string[] = (docSnap.exists() && docSnap.data().gallery) ? docSnap.data().gallery : [];
        const padded = [...saved];
        while (padded.length < 6) padded.push('');
        setGalleryImages(padded.slice(0, 6));
      } catch {
        if (!cancelled) setGalleryImages(Array(6).fill(''));
      } finally {
        if (!cancelled) setGalleryLoading(false);
      }
    };

    fetchGallery();
    return () => { cancelled = true; };
  }, [galleryCategory]);

  const handleGalleryImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    e.target.value = '';

    setGalleryUploading(index);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: 'POST', body: fd });
      const data = await res.json();

      if (data.success) {
        const newImages = [...galleryImages];
        newImages[index] = data.data.url;
        setGalleryImages(newImages);

        try {
          await setDoc(doc(db, 'categories_gallery', galleryCategory), {
            gallery: newImages.filter(Boolean),
            updatedAt: serverTimestamp(),
          });
        } catch (saveErr) {
          console.error("Auto-save failed:", saveErr);
        }

      } else {
        alert('Resim yüklenemedi: ' + data.error?.message);
      }
    } catch (err) {
      console.error('Yükleme hatası:', err);
      alert('Resim yüklenırken bir hata oluştu veya bağlantı koptu.');
    } finally {
      setGalleryUploading(null);
    }
  };

  const saveGallery = async () => {
    setGallerySaving(true);
    try {
      await setDoc(doc(db, 'categories_gallery', galleryCategory), {
        gallery: galleryImages.filter(Boolean),
        updatedAt: serverTimestamp(),
      });
      alert('Galeri başarıyla kaydedildi!');
    } catch (e) {
      console.error('saveGallery error:', e);
      alert('Galeri kaydedilirken bir hata oluştu: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setGallerySaving(false);
    }
  };

  const removeGalleryImage = async (idx: number) => {
    const newArr = [...galleryImages];
    newArr[idx] = '';
    setGalleryImages(newArr);
    try {
      await setDoc(doc(db, 'categories_gallery', galleryCategory), {
        gallery: newArr.filter(Boolean),
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.error('removeGalleryImage error:', e);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold mb-1 tracking-tight">Galeri Yönetimi</h2>
          <p className="text-slate-500 font-medium">Site üzerindeki kategorilere ait fotoğrafları (Tamamlanan Projeler) yükleyin ve yönetin.</p>
        </div>
        <button
          onClick={saveGallery}
          disabled={gallerySaving || galleryLoading}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-slate-400 text-white px-5 py-3 rounded-xl font-bold transition-all shadow hover:shadow-md"
        >
          {gallerySaving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Değişiklikleri Kaydet
        </button>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm mb-8">
        <label className="block text-sm font-bold text-slate-700 mb-3">Yönetmek İstediğiniz Kategoriyi Seçin</label>
        <select
          value={galleryCategory}
          onChange={(e) => setGalleryCategory(e.target.value)}
          className="w-full sm:w-1/2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium text-[15px] focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all py-3 px-4"
        >
          <option value="stor-perde">Stor Perde</option>
          <option value="zebra-perde">Zebra Perde</option>
          <option value="ahsap-jaluzi">Ahşap Jaluzi</option>
          <option value="aluminyum-jaluzi">Alüminyum Jaluzi</option>
          <option value="motorlu-sistemler">Motorlu Sistemler</option>
        </select>
      </div>

      {galleryLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 size={40} className="animate-spin mb-4" />
          <p className="font-medium">Galeri Görselleri Yükleniyor...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm font-bold text-slate-600">
              {galleryImages.filter(Boolean).length} / 6 görsel ekli
            </span>
            {galleryImages.filter(Boolean).length === 6 && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                Maksimum kapasiteye ulaşıldı
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6">
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const imgUrl = galleryImages[idx];
              const isFilled = imgUrl && imgUrl.trim() !== '';
              const isUploading = galleryUploading === idx;
              const filledCount = galleryImages.filter(Boolean).length;
              const canAdd = !isFilled && filledCount < 6;

              return (
                <div
                  key={idx}
                  className={`relative w-full aspect-[4/3] rounded-[20px] overflow-hidden border-2 transition-all duration-200 group
                  ${isFilled ? 'border-slate-200 shadow-sm hover:shadow-md' : canAdd ? 'border-dashed border-slate-300 hover:border-emerald-400 bg-slate-50 cursor-pointer' : 'border-dashed border-slate-100 bg-slate-50/50 opacity-40 cursor-not-allowed'}
                  ${galleryUploading !== null && galleryUploading !== idx ? 'pointer-events-none opacity-60' : ''}
                `}
                >
                  {isUploading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                      <Loader2 size={30} className="animate-spin mb-2" />
                      <span className="text-xs font-bold">Yükleniyor...</span>
                    </div>

                  ) : isFilled ? (
                    <>
                      <img src={imgUrl} className="w-full h-full object-cover" alt={`Kategori Görseli ${idx + 1}`} />
                      <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {idx + 1}
                      </span>
                      <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2.5 p-3">
                        <button
                          onClick={() => {
                            if (galleryUploading === null) document.getElementById(`galInput_${idx}`)?.click();
                          }}
                          disabled={galleryUploading !== null}
                          className="w-full bg-white text-zinc-900 rounded-lg px-3 py-2 font-bold text-sm shadow-lg flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ImageIcon size={14} /> Değiştir
                        </button>
                        <button
                          onClick={() => removeGalleryImage(idx)}
                          disabled={galleryUploading !== null}
                          className="w-full bg-red-500 text-white rounded-lg px-3 py-2 font-bold text-sm shadow-lg flex items-center justify-center gap-2 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={14} /> Kaldır
                        </button>
                      </div>
                    </>

                  ) : canAdd ? (
                    <button
                      onClick={() => {
                        if (galleryUploading === null) document.getElementById(`galInput_${idx}`)?.click();
                      }}
                      disabled={galleryUploading !== null}
                      className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors disabled:cursor-not-allowed disabled:group-hover:text-slate-400"
                    >
                      <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center mb-2">
                        <Plus size={22} />
                      </div>
                      <span className="text-xs font-bold tracking-wide">Görsel Ekle</span>
                    </button>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                      <ImageIcon size={24} />
                    </div>
                  )}

                  <input
                    id={`galInput_${idx}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={galleryUploading !== null}
                    onChange={(e) => handleGalleryImageUpload(idx, e)}
                  />
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-400 font-medium mt-4">
            💡 Görselleri değiştirirken üzerine tıklayın. Kaldırma işlemi otomatik kaydedilir. Yeni görsel ekledikten sonra <strong>Değişiklikleri Kaydet</strong>&apos;e basın.
          </p>
        </>
      )}
    </div>
  );
}
