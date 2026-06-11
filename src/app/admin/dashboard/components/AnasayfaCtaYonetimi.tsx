"use client";

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Check, MousePointerClick, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { useSettings, defaultSettings } from '@/contexts/SettingsContext';

const FONT_OPTIONS = ['Var', 'Manrope', 'Inter', 'Roboto', 'Playfair Display', 'Outfit', 'Montserrat', 'Poppins'];

export default function AnasayfaCtaYonetimi() {
  const { settings, loading } = useSettings();
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [homeCta, setHomeCta] = useState(settings?.homeCta || defaultSettings.homeCta);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'site'), { homeCta }, { merge: true });
      alert('Aksiyon bandı (CTA) ayarları başarıyla kaydedildi!');
    } catch {
      alert('Kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=51eca7c487b49a21c7f45c86a42093cf`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setHomeCta(p => ({ ...p, bgImage: data.data.url }));
      } else {
        alert('Resim yüklenemedi.');
      }
    } catch (err) {
      console.error(err);
      alert('Bir hata oluştu.');
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline-block" /> Yükleniyor...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold mb-1 tracking-tight">Aksiyon Bandı (CTA) Yönetimi</h2>
          <p className="text-slate-500 font-medium">Anasayfanın en altındaki büyük "Teklif Al" kutusunun arka plan, yazı ve butonlarını ayarlayın.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-slate-400 text-white px-5 py-3 rounded-xl font-bold transition-all shadow"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Değişiklikleri Kaydet
        </button>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-8 max-w-4xl space-y-10">
        
        {/* Arkaplan */}
        <div>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
              <ImageIcon size={20} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800">CTA Arkaplan Görseli</h3>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/2 aspect-[21/9] bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200 flex items-center justify-center">
              {homeCta.bgImage ? (
                <img src={homeCta.bgImage} alt="CTA Arkaplan" className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-400 flex flex-col items-center"><ImageIcon size={32} className="mb-2" /> Görsel Yok</div>
              )}
            </div>
            <div className="flex-1 w-full">
              <p className="text-sm font-semibold text-slate-600 mb-4 leading-relaxed">Ekranı enine incelemesine kaplayacak bir şerit şeklinde fotoğraf seçmeniz tasarıma lüks bir hava katacaktır.</p>
              <label className="flex items-center justify-center gap-2 bg-white border-2 border-dashed border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-orange-400 hover:text-orange-600 w-full h-14 rounded-xl cursor-pointer font-bold transition-all">
                {uploadingImage ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
                {uploadingImage ? 'Yükleniyor...' : 'Yeni Görsel Yükle'}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
              </label>
            </div>
          </div>
        </div>

        {/* Yazılar ve Butonlar */}
        <div>
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
             <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
               <MousePointerClick size={20} />
             </div>
             <h3 className="text-lg font-extrabold text-slate-800">Metin ve Çeyrek Buton Ayarları</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Aksiyon Ana Başlığı</label>
                <input
                  type="text"
                  value={homeCta.title}
                  onChange={(e) => setHomeCta(p => ({ ...p, title: e.target.value }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-orange-300 outline-none"
                  placeholder="Projeniz İçin Fiyat Teklifi Alın"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Başlık Boyutu (Masaüstü)</label>
                <input type="text" value={homeCta.titleSizeDesktop || ''} onChange={(e) => setHomeCta(p => ({ ...p, titleSizeDesktop: e.target.value }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-orange-300 outline-none" placeholder="Örn: 44px" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Başlık Boyutu (Mobil)</label>
                <input type="text" value={homeCta.titleSizeMobile || ''} onChange={(e) => setHomeCta(p => ({ ...p, titleSizeMobile: e.target.value }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-orange-300 outline-none" placeholder="Örn: 28px" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Aksiyon Alt İçeriği</label>
                <textarea
                  value={homeCta.subtitle}
                  onChange={(e) => setHomeCta(p => ({ ...p, subtitle: e.target.value }))}
                  rows={2}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-orange-300 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Alt Metin Boyutu (Masaüstü)</label>
                <input type="text" value={homeCta.subtitleSizeDesktop || ''} onChange={(e) => setHomeCta(p => ({ ...p, subtitleSizeDesktop: e.target.value }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-orange-300 outline-none" placeholder="Örn: 18px" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Alt Metin Boyutu (Mobil)</label>
                <input type="text" value={homeCta.subtitleSizeMobile || ''} onChange={(e) => setHomeCta(p => ({ ...p, subtitleSizeMobile: e.target.value }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-orange-300 outline-none" placeholder="Örn: 15px" />
              </div>

              <div className="md:col-span-2 p-5 bg-slate-50 border border-slate-100 rounded-xl">
                 <h4 className="font-bold text-sm text-slate-600 mb-4 uppercase tracking-widest">Aksiyon Butonu (Primary Action)</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Buton Yazısı</label>
                        <input type="text" value={homeCta.btnText} onChange={(e) => setHomeCta(p => ({ ...p, btnText: e.target.value }))} className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Rengi</label>
                        <div className="flex items-center gap-2">
                          <input type="color" value={homeCta.btnColor} onChange={(e) => setHomeCta(p => ({ ...p, btnColor: e.target.value }))} className="w-10 h-10 rounded border-0 p-0" />
                          <input type="text" value={homeCta.btnColor} onChange={(e) => setHomeCta(p => ({ ...p, btnColor: e.target.value }))} className="flex-1 h-10 px-3 border border-slate-200 rounded-lg text-sm uppercase" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Özel Fontu</label>
                        <select value={homeCta.btnFont} onChange={(e) => setHomeCta(p => ({ ...p, btnFont: e.target.value }))} className="w-full h-10 border border-slate-200 rounded-lg text-sm bg-white">
                          {FONT_OPTIONS.map(font => <option key={font} value={font}>{font === 'Var' ? 'Genel Fontu Kullan' : font}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Buton Yazı Boyutu (Masaüstü)</label>
                        <input type="text" value={homeCta.primaryBtnSizeDesktop || ''} onChange={(e) => setHomeCta(p => ({ ...p, primaryBtnSizeDesktop: e.target.value }))} className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm" placeholder="Örn: 16px" />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Buton Yazı Boyutu (Mobil)</label>
                        <input type="text" value={homeCta.primaryBtnSizeMobile || ''} onChange={(e) => setHomeCta(p => ({ ...p, primaryBtnSizeMobile: e.target.value }))} className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm" placeholder="Örn: 14px" />
                    </div>
                 </div>
              </div>

              {/* Hemen Ara Butonu */}
              <div className="md:col-span-2 p-5 bg-blue-50 border border-blue-100 rounded-xl">
                 <h4 className="font-bold text-sm text-blue-700 mb-4 uppercase tracking-widest flex items-center gap-2">
                   📞 &quot;Hemen Ara&quot; Butonu
                 </h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Buton Metni</label>
                        <input type="text" value={homeCta.callBtnText || 'Hemen Ara'} onChange={(e) => setHomeCta(p => ({ ...p, callBtnText: e.target.value }))} className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-white" placeholder="Hemen Ara" />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Arka Plan Rengi</label>
                        <div className="flex items-center gap-2">
                          <input type="color" value={homeCta.callBtnColor || '#ffffff1a'} onChange={(e) => setHomeCta(p => ({ ...p, callBtnColor: e.target.value }))} className="w-10 h-10 rounded border-0 p-0" />
                          <input type="text" value={homeCta.callBtnColor || ''} onChange={(e) => setHomeCta(p => ({ ...p, callBtnColor: e.target.value }))} className="flex-1 h-10 px-3 border border-slate-200 rounded-lg text-sm uppercase bg-white" placeholder="#ffffff" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Yazı Rengi</label>
                        <div className="flex items-center gap-2">
                          <input type="color" value={homeCta.callBtnTextColor || '#ffffff'} onChange={(e) => setHomeCta(p => ({ ...p, callBtnTextColor: e.target.value }))} className="w-10 h-10 rounded border-0 p-0" />
                          <input type="text" value={homeCta.callBtnTextColor || ''} onChange={(e) => setHomeCta(p => ({ ...p, callBtnTextColor: e.target.value }))} className="flex-1 h-10 px-3 border border-slate-200 rounded-lg text-sm uppercase bg-white" placeholder="#ffffff" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">Yazı Boyutu (Masaüstü)</label>
                          <input type="text" value={homeCta.callBtnSizeDesktop || ''} onChange={(e) => setHomeCta(p => ({ ...p, callBtnSizeDesktop: e.target.value }))} className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-white" placeholder="Örn: 16px" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">Yazı Boyutu (Mobil)</label>
                          <input type="text" value={homeCta.callBtnSizeMobile || ''} onChange={(e) => setHomeCta(p => ({ ...p, callBtnSizeMobile: e.target.value }))} className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm bg-white" placeholder="Örn: 14px" />
                        </div>
                    </div>
                 </div>
                 <p className="text-[11px] text-blue-500 mt-3 font-medium">💡 Telefon numarası için İletişim sekmesinden yönetin.</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
