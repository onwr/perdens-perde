"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Check, Image as ImageIcon, Trash2, MousePointerClick } from 'lucide-react';
import FontSizeInput from './FontSizeInput';

const IMGBB_KEY = '51eca7c487b49a21c7f45c86a42093cf';
const FONT_OPTIONS = ['Var', 'Manrope', 'Inter', 'Roboto', 'Playfair Display', 'Outfit', 'Montserrat', 'Poppins'];
const ICON_OPTIONS = ['Building2', 'ClipboardCheck', 'Zap', 'Wrench', 'ShieldCheck', 'Award', 'Star', 'Heart', 'ThumbsUp', 'Briefcase', 'Diamond', 'Target', 'CheckCircle', 'PenTool', 'Monitor', 'Settings', 'Grid', 'Layers', 'MapPin', 'Clock', 'ChevronRight', 'Cpu', 'Users', 'Truck'];

const DEFAULT_FEATURES = {
  bannerImage: '/anasayfa/ana1.jpg',
  sectionTitle: 'Öne Çıkan Özellikler',
  fontFamily: 'Var',
  hoverEffect: true,
  titleSizeDesktop: '',
  titleSizeMobile: '',
  items: [
    { title: 'Kurumsal Projelere Özel Çözümler', description: 'Ofis, otel ve ticari alanlara uygun perde sistemleri', iconName: 'Building2' },
    { title: 'Ücretsiz Keşif ve Ölçülendirme', description: 'Yerinde ölçüm ve doğru planlama', iconName: 'ClipboardCheck' },
    { title: 'Hızlı ve Planlı Üretim', description: 'Proje takvimine uygun teslim', iconName: 'Zap' },
    { title: 'Uzman Ekip ve Montaj', description: 'Sorunsuz ve temiz uygulama', iconName: 'Wrench' },
  ]
};

export default function OneCikanOzellikler() {
  const [featuresData, setFeaturesData] = useState(DEFAULT_FEATURES);
  const [featuresBannerUploading, setFeaturesBannerUploading] = useState(false);
  const [featuresSaving, setFeaturesSaving] = useState(false);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'features')).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setFeaturesData(prev => ({
          ...prev,
          ...(data.bannerImage ? { bannerImage: data.bannerImage } : {}),
          ...(data.sectionTitle ? { sectionTitle: data.sectionTitle } : {}),
          ...(data.fontFamily ? { fontFamily: data.fontFamily } : {}),
          ...(data.hoverEffect !== undefined ? { hoverEffect: data.hoverEffect } : {}),
          ...(data.titleSizeDesktop !== undefined ? { titleSizeDesktop: data.titleSizeDesktop } : {}),
          ...(data.titleSizeMobile !== undefined ? { titleSizeMobile: data.titleSizeMobile } : {}),
          items: Array.isArray(data.items) && data.items.length === 4 ? data.items.map((it: any, i: number) => ({ ...DEFAULT_FEATURES.items[i], ...it })) : prev.items,
        }));
      }
    }).catch(() => { });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold mb-1 tracking-tight">Öne Çıkan Özellikler</h2>
          <p className="text-slate-500 font-medium">Ana sayfadaki banner görselini, 4 özellik kartının içeriklerini, fontunu ve efektlerini Yönetin.</p>
        </div>
        <button
          onClick={async () => {
            setFeaturesSaving(true);
            try {
              await setDoc(doc(db, 'settings', 'features'), featuresData);
              alert('Özellikler bölümü başarıyla kaydedildi!');
            } catch {
              alert('Kaydedilemedi, lütfen tekrar deneyin.');
            } finally {
              setFeaturesSaving(false);
            }
          }}
          disabled={featuresSaving}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-slate-400 text-white px-5 py-3 rounded-xl font-bold transition-all shadow"
        >
          {featuresSaving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
          Değişiklikleri Kaydet
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Banner Image */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden lg:col-span-2">
          <div className="relative w-full h-44 bg-slate-100 overflow-hidden">
            {featuresData.bannerImage ? (
              <img src={featuresData.bannerImage} alt="Banner" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">Görsel yüklenmemiş</div>
            )}
            <div className="absolute inset-0 bg-black/20" />
            {featuresBannerUploading && (
              <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                <Loader2 size={32} className="animate-spin text-violet-500 mb-2" />
                <span className="text-sm font-bold text-slate-600">Yükleniyor...</span>
              </div>
            )}
            <span className={`absolute top-3 left-3 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow ${featuresData.bannerImage.startsWith('http') ? 'bg-emerald-500' : 'bg-slate-400'}`}>
              {featuresData.bannerImage.startsWith('http') ? 'Özel Görsel' : 'Varsayılan'}
            </span>
          </div>
          <div className="p-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-[16px]">Banner Görseli</h3>
              <p className="text-sm text-slate-500 mt-0.5">Özellikler bölümünün üstündeki tam genişlik görsel</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <label className={`flex items-center gap-2 h-11 px-4 rounded-xl font-bold text-sm cursor-pointer transition-all border ${featuresBannerUploading ? 'bg-slate-100 text-slate-400 border-slate-200 pointer-events-none' : 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100'}`}>
                <ImageIcon size={16} />
                Görsel Yükle
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={featuresBannerUploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    e.target.value = '';
                    setFeaturesBannerUploading(true);
                    try {
                      const fd = new FormData();
                      fd.append('image', file);
                      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: 'POST', body: fd });
                      const data = await res.json();
                      if (data.success) {
                        setFeaturesData(prev => ({ ...prev, bannerImage: data.data.url }));
                      } else {
                        alert('Resim yüklenemedi.');
                      }
                    } catch {
                      alert('Yükleme sırasında hata oluştu.');
                    } finally {
                      setFeaturesBannerUploading(false);
                    }
                  }}
                />
              </label>
              {featuresData.bannerImage.startsWith('http') && (
                <button
                  onClick={() => setFeaturesData(prev => ({ ...prev, bannerImage: '/anasayfa/ana1.jpg' }))}
                  className="w-11 h-11 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all"
                  title="Varsayılana dön"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Settings: Title, Font, Size, Hover Effect */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-6 lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Bölüm Başlığı</label>
              <input
                type="text"
                value={featuresData.sectionTitle}
                onChange={(e) => setFeaturesData(prev => ({ ...prev, sectionTitle: e.target.value }))}
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300/30 focus:border-violet-400 transition-all"
                placeholder="Öne Çıkan Özellikler"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Bölüm Fontu</label>
              <select 
                value={featuresData.fontFamily}
                onChange={(e) => setFeaturesData(prev => ({ ...prev, fontFamily: e.target.value }))}
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300/30 focus:border-violet-400 transition-all cursor-pointer"
              >
                {FONT_OPTIONS.map(f => <option key={f} value={f}>{f === 'Var' ? 'Varsayılan Font: Manrope' : f}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <FontSizeInput
                label="Bölüm Başlığı (Tema Başlığı)"
                desktopValue={featuresData.titleSizeDesktop || ''}
                mobileValue={featuresData.titleSizeMobile || ''}
                onDesktopChange={(v) => setFeaturesData(prev => ({ ...prev, titleSizeDesktop: v }))}
                onMobileChange={(v) => setFeaturesData(prev => ({ ...prev, titleSizeMobile: v }))}
              />
            </div>
            
            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${featuresData.hoverEffect ? 'bg-violet-500' : 'bg-slate-300'}`}>
                  <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${featuresData.hoverEffect ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><MousePointerClick size={16}/> Hover Büyüme</span>
                  <span className="text-[11px] text-slate-400 font-medium">Maus üzerine gelince kutu büyür.</span>
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={featuresData.hoverEffect}
                  onChange={(e) => setFeaturesData(prev => ({ ...prev, hoverEffect: e.target.checked }))}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Feature Items */}
        {featuresData.items.map((item, idx) => (
          <div key={idx} className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center font-extrabold text-sm">{idx + 1}</div>
              <h3 className="font-extrabold text-slate-800">Özellik {idx + 1}</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Kutu İkonu</label>
                <select 
                  value={item.iconName || 'Building2'}
                  onChange={(e) => {
                    const updated = featuresData.items.map((it, i) => i === idx ? { ...it, iconName: e.target.value } : it);
                    setFeaturesData(prev => ({ ...prev, items: updated }));
                  }}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300/30 focus:border-violet-400 transition-all text-sm cursor-pointer"
                >
                  {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Başlık</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const updated = featuresData.items.map((it, i) => i === idx ? { ...it, title: e.target.value } : it);
                    setFeaturesData(prev => ({ ...prev, items: updated }));
                  }}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300/30 focus:border-violet-400 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Açıklama</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => {
                    const updated = featuresData.items.map((it, i) => i === idx ? { ...it, description: e.target.value } : it);
                    setFeaturesData(prev => ({ ...prev, items: updated }));
                  }}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-300/30 focus:border-violet-400 transition-all text-sm"
                />
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
