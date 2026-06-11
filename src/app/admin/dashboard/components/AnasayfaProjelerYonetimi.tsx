"use client";

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Check, Focus, Plus, Trash2, UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import { useSettings, defaultSettings } from '@/contexts/SettingsContext';
import FontSizeInput from './FontSizeInput';

const FONT_OPTIONS = ['Var', 'Manrope', 'Inter', 'Roboto', 'Playfair Display', 'Outfit', 'Montserrat', 'Poppins'];
const IMGBB_KEY = '51eca7c487b49a21c7f45c86a42093cf';

export default function AnasayfaProjelerYonetimi() {
  const { settings, loading } = useSettings();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<Record<number, boolean>>({});
  const [bannerUploading, setBannerUploading] = useState(false);
  const [homeProjects, setHomeProjects] = useState(settings?.homeProjects || defaultSettings.homeProjects);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'site'), { homeProjects }, { merge: true });
      alert('Projeler bölümü ayarları başarıyla kaydedildi!');
    } catch {
      alert('Kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const addCard = () => {
    setHomeProjects(p => ({
      ...p,
      items: [...(p.items || []), { label: 'Yeni Proje', img: '' }]
    }));
  };

  const updateCard = (index: number, key: 'label' | 'img', value: string) => {
    const newItems = [...(homeProjects.items || [])];
    newItems[index] = { ...newItems[index], [key]: value };
    setHomeProjects(p => ({ ...p, items: newItems }));
  };

  const removeCard = (index: number) => {
    const newItems = [...(homeProjects.items || [])];
    newItems.splice(index, 1);
    setHomeProjects(p => ({ ...p, items: newItems }));
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setHomeProjects(p => ({ ...p, bannerImage: data.data.url }));
      } else {
        alert('Resim yüklenemedi.');
      }
    } catch {
      alert('Bir hata oluştu.');
    } finally {
      setBannerUploading(false);
      e.target.value = '';
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(p => ({ ...p, [idx]: true }));
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        updateCard(idx, 'img', data.data.url);
      } else {
        alert('Resim yüklenemedi.');
      }
    } catch {
      alert('Bir hata oluştu.');
    } finally {
      setUploading(p => ({ ...p, [idx]: false }));
      e.target.value = '';
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline-block" /> Yükleniyor...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold mb-1 tracking-tight">Projeler Modülü Yönetimi</h2>
          <p className="text-slate-500 font-medium">Anasayfadaki tamamlanan projeler vitrininin resimleri, başlıkları ve ayarları.</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-slate-400 text-white px-5 py-3 rounded-xl font-bold transition-all shadow">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Değişiklikleri Kaydet
        </button>
      </div>

      <div className="max-w-5xl space-y-6">

        {/* Üst Banner Kartı */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="relative w-full h-44 bg-slate-100 overflow-hidden">
            {homeProjects.bannerImage ? (
              <img src={homeProjects.bannerImage} alt="Projeler Banner" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">Görsel yüklenmemiş</div>
            )}
            <div className="absolute inset-0 bg-black/20" />
            {bannerUploading && (
              <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                <Loader2 size={32} className="animate-spin text-teal-500 mb-2" />
                <span className="text-sm font-bold text-slate-600">Yükleniyor...</span>
              </div>
            )}
          </div>
          <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-[16px]">Üst Banner Görseli</h3>
              <p className="text-sm text-slate-500 mt-0.5">Projeler bölümünün en üstünde yer alan tam genişlikteki görsel</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <label className={`flex items-center gap-2 h-11 px-4 rounded-xl font-bold text-sm cursor-pointer transition-all border ${bannerUploading ? 'bg-slate-100 text-slate-400 border-slate-200 pointer-events-none' : 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'}`}>
                <UploadCloud size={16} />
                Görsel Yükle
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={bannerUploading}
                  onChange={handleBannerUpload}
                />
              </label>
              {homeProjects.bannerImage && (
                <button
                  type="button"
                  onClick={() => setHomeProjects(prev => ({ ...prev, bannerImage: '' }))}
                  className="w-11 h-11 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all"
                  title="Görseli Kaldır"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Başlık, Font ve Animasyon Kartı */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
              <Focus size={20} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800">Başlıklar, Font ve Animasyon</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Bölüm Ana Başlığı</label>
              <input type="text" value={homeProjects.title || ''}
                onChange={(e) => setHomeProjects(p => ({ ...p, title: e.target.value }))}
                placeholder="Tamamlanan Projeler"
                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-teal-300 outline-none"
              />
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Bölüm Alt Başlığı / Açıklaması</label>
              <input type="text" value={homeProjects.subtitle || ''}
                onChange={(e) => setHomeProjects(p => ({ ...p, subtitle: e.target.value }))}
                placeholder="Referanslarımız ve son çalışmalarımız."
                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-teal-300 outline-none"
              />
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Bu Alanın Özel Fontu</label>
                  <select value={homeProjects.fontFamily || 'Var'}
                    onChange={(e) => setHomeProjects(p => ({ ...p, fontFamily: e.target.value }))}
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-teal-300/30 outline-none">
                    {FONT_OPTIONS.map(font => <option key={font} value={font}>{font === 'Var' ? 'Genel Fontu Kullan' : font}</option>)}
                  </select>
                </div>
                <FontSizeInput
                  label="Başlık Yazı Boyutu"
                  desktopValue={homeProjects.titleSizeDesktop || ''}
                  mobileValue={homeProjects.titleSizeMobile || ''}
                  onDesktopChange={(v) => setHomeProjects(p => ({ ...p, titleSizeDesktop: v }))}
                  onMobileChange={(v) => setHomeProjects(p => ({ ...p, titleSizeMobile: v }))}
                />
              </div>

              <div className="pt-4 border-t border-slate-200">
                <FontSizeInput
                  label="Alt Açıklama Yazı Boyutu"
                  desktopValue={homeProjects.subtitleSizeDesktop || ''}
                  mobileValue={homeProjects.subtitleSizeMobile || ''}
                  onDesktopChange={(v) => setHomeProjects(p => ({ ...p, subtitleSizeDesktop: v }))}
                  onMobileChange={(v) => setHomeProjects(p => ({ ...p, subtitleSizeMobile: v }))}
                />
              </div>
            </div>

            {/* Hover Zoom Toggle */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-bold text-slate-700">Hover Zoom Efekti</label>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Üzerine gelindiğinde hafif yakınlaşma.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setHomeProjects(p => ({ ...p, hoverZoom: !p.hoverZoom }))}
                  className={`relative inline-flex h-7 w-14 shrink-0 items-center rounded-full transition-colors focus:outline-none ${homeProjects.hoverZoom ? 'bg-teal-500' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${homeProjects.hoverZoom ? 'translate-x-8' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Proje Görselleri Kartı */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-800">Proje Görselleri</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Her kartın görselini ve alt yazısını bu bölümden yönetebilirsiniz. Toplam 8 kart önerilir.</p>
            </div>
            <button onClick={addCard}
              className="flex items-center gap-2 bg-teal-100 text-teal-700 px-3 py-2 rounded-lg text-sm font-bold hover:bg-teal-200 transition-colors">
              <Plus size={15} /> Proje Ekle
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(homeProjects.items || []).map((item, idx) => {
              const previewImg = item.img;
              return (
                <div key={idx} className="relative bg-slate-50 rounded-[20px] border border-slate-200 overflow-hidden flex flex-col">
                  {/* Silme Butonu */}
                  <button onClick={() => removeCard(idx)} title="Kartı sil"
                    className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors shadow-sm">
                    <Trash2 size={12} />
                  </button>

                  <div className="relative aspect-[4/3] bg-slate-200 overflow-hidden">
                    {previewImg ? (
                      <img src={previewImg} alt={item.label} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-medium">Görsel Yok</div>
                    )}
                    
                    {previewImg && (
                      <button type="button"
                        onClick={() => updateCard(idx, 'img', '')}
                        className="absolute top-1.5 left-1.5 w-6 h-6 flex items-center justify-center bg-black/60 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Görseli kaldır">
                        <X size={11} />
                      </button>
                    )}
                  </div>

                  <div className="p-3">
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Sol Alt Yazı (Proje Başlığı)</label>
                    <input type="text" value={item.label || ''} onChange={(e) => updateCard(idx, 'label', e.target.value)}
                      className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-teal-300"
                      placeholder="Örn: Ofis Projesi" />
                  </div>

                  <div className="px-3 pb-3 flex gap-2 mt-auto">
                    <label className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl font-bold text-[11px] cursor-pointer transition-all border ${uploading[idx] ? 'bg-slate-100 text-slate-400 border-slate-200 pointer-events-none' : 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'}`}>
                      {uploading[idx] ? <><Loader2 size={13} className="animate-spin" /> Yükleniyor</> : <><UploadCloud size={13} /> Görsel Yükle</>}
                      <input type="file" accept="image/*" className="hidden" disabled={!!uploading[idx]}
                        onChange={(e) => handleImageUpload(e, idx)} />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
          
          {(!homeProjects.items || homeProjects.items.length === 0) && (
             <div className="text-center py-8 text-slate-400 text-sm font-medium border border-dashed border-slate-300 rounded-xl mt-4">
               Henüz proje eklenmemiş.
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
