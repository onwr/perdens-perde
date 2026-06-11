"use client";

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Check, Handshake, Plus, Trash2, UploadCloud, Image as ImageIcon, Briefcase, Zap } from 'lucide-react';
import { useSettings, defaultSettings } from '@/contexts/SettingsContext';
import FontSizeInput from './FontSizeInput';

const FONT_OPTIONS = ['Var', 'Manrope', 'Inter', 'Roboto', 'Playfair Display', 'Outfit', 'Montserrat', 'Poppins'];
const ICON_OPTIONS = ['Gem', 'Target', 'Clock', 'ShieldCheck', 'Building2', 'ClipboardCheck', 'Wrench', 'Award', 'Star', 'Heart', 'ThumbsUp', 'Briefcase', 'Coffee', 'Package'];
const IMGBB_KEY = '51eca7c487b49a21c7f45c86a42093cf';

export default function HakkimizdaYonetimi() {
  const { settings, loading } = useSettings();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [hakkimizda, setHakkimizda] = useState(settings?.hakkimizda || defaultSettings.hakkimizda);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'site'), { hakkimizda }, { merge: true });
      alert('Hakkımızda sayfası ayarları başarıyla kaydedildi!');
    } catch {
      alert('Kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'heroImage' | 'aboutImage' | 'aboutImage2') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(p => ({ ...p, [field]: true }));
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) setHakkimizda(p => ({ ...p, [field]: data.data.url }));
      else alert('Resim yüklenemedi.');
    } catch {
      alert('Bir hata oluştu.');
    } finally {
      setUploading(p => ({ ...p, [field]: false }));
    }
  };

  const addFeature = () => setHakkimizda(p => ({ ...p, features: [...(p.features || []), 'Yeni Madde'] }));
  const updateFeature = (i: number, val: string) => {
    const f = [...(hakkimizda.features || [])];
    f[i] = val;
    setHakkimizda(p => ({ ...p, features: f }));
  };
  const removeFeature = (i: number) => {
    const f = [...(hakkimizda.features || [])];
    f.splice(i, 1);
    setHakkimizda(p => ({ ...p, features: f }));
  };

  const addValue = () => setHakkimizda(p => ({ ...p, values: [...(p.values || []), { icon: 'Star', title: 'Yeni Özellik', description: 'Özellik Açıklaması' }] }));
  const updateValue = (i: number, key: 'icon' | 'title' | 'description', val: string) => {
    const v = [...(hakkimizda.values || [])];
    v[i] = { ...v[i], [key]: val };
    setHakkimizda(p => ({ ...p, values: v }));
  };
  const removeValue = (i: number) => {
    const v = [...(hakkimizda.values || [])];
    v.splice(i, 1);
    setHakkimizda(p => ({ ...p, values: v }));
  };

  const ImageUploadCard = ({ field, label, desc }: { field: 'heroImage' | 'aboutImage' | 'aboutImage2'; label: string; desc: string }) => (
    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-4">
      <label className="block text-sm font-bold text-slate-700 mb-1">{label}</label>
      <p className="text-xs text-slate-500 mb-4 font-medium">{desc}</p>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="w-full sm:w-40 h-28 bg-slate-200 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
          {hakkimizda[field as keyof typeof hakkimizda]
            ? <img src={hakkimizda[field as keyof typeof hakkimizda] as string} alt={label} className="w-full h-full object-cover" />
            : <ImageIcon size={24} className="text-slate-400" />
          }
        </div>
        <div className="flex-1 space-y-2 w-full">
          <label className="flex items-center justify-center gap-2 bg-white border-2 border-dashed border-slate-300 hover:border-cyan-400 hover:text-cyan-600 text-slate-600 w-full h-12 rounded-xl cursor-pointer font-bold transition-all text-sm">
            {uploading[field] ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
            {uploading[field] ? 'Yükleniyor...' : 'Görsel Yükle'}
            <input type="file" className="hidden" accept="image/*" disabled={!!uploading[field]} onChange={(e) => handleImageUpload(e, field)} />
          </label>
          {hakkimizda[field as keyof typeof hakkimizda] && (
            <button onClick={() => setHakkimizda(p => ({ ...p, [field]: '' }))}
              className="w-full h-9 text-sm text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 rounded-xl font-bold transition-colors flex items-center justify-center gap-1.5">
              <Trash2 size={12} /> Görseli Kaldır
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline-block" /> Yükleniyor...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold mb-1 tracking-tight">Hakkımızda Sayfası Yönetimi</h2>
          <p className="text-slate-500 font-medium">Bizi tanıtan sayfanın tüm görsellerini, başlıklarını ve metinlerini düzenleyin.</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-slate-400 text-white px-5 py-3 rounded-xl font-bold transition-all shadow">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Değişiklikleri Kaydet
        </button>
      </div>

      <div className="max-w-4xl space-y-6">

        {/* Hero Bölümü */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-cyan-50 text-cyan-500 rounded-xl flex items-center justify-center"><Handshake size={20} /></div>
            <h3 className="text-lg font-extrabold text-slate-800">Sayfa Üst Bölümü (Hero)</h3>
          </div>
          <div className="space-y-5">
            <ImageUploadCard field="heroImage" label="Hero Arka Plan Görseli" desc="Hakkımızda sayfasının üst kısmında karanlık modda görünen büyük kapak fotoğrafı." />
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Sayfa Ana Başlığı</label>
              <input type="text" value={hakkimizda.heroTitle || ''}
                onChange={(e) => setHakkimizda(p => ({ ...p, heroTitle: e.target.value }))}
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-cyan-300 outline-none" />
            </div>
            <FontSizeInput
              label="Ana Başlık Yazı Boyutu"
              desktopValue={hakkimizda.heroTitleSizeDesktop || ''}
              mobileValue={hakkimizda.heroTitleSizeMobile || ''}
              onDesktopChange={(v) => setHakkimizda(p => ({ ...p, heroTitleSizeDesktop: v }))}
              onMobileChange={(v) => setHakkimizda(p => ({ ...p, heroTitleSizeMobile: v }))}
            />
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Başlık Altındaki Slogan</label>
              <textarea value={hakkimizda.heroSubtitle || ''}
                onChange={(e) => setHakkimizda(p => ({ ...p, heroSubtitle: e.target.value }))}
                rows={2} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-cyan-300 outline-none resize-none" />
            </div>
            <FontSizeInput
              label="Slogan Yazı Boyutu"
              desktopValue={hakkimizda.heroSubtitleSizeDesktop || ''}
              mobileValue={hakkimizda.heroSubtitleSizeMobile || ''}
              onDesktopChange={(v) => setHakkimizda(p => ({ ...p, heroSubtitleSizeDesktop: v }))}
              onMobileChange={(v) => setHakkimizda(p => ({ ...p, heroSubtitleSizeMobile: v }))}
            />
          </div>
        </div>

        {/* İçerik Metinleri & Sol Görseller */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center"><Briefcase size={20} /></div>
            <h3 className="text-lg font-extrabold text-slate-800">İçerik, Hikayemiz & Görseller</h3>
          </div>
          <div className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUploadCard field="aboutImage" label="Ana Sol Görsel (Büyük)" desc="Yan yana düzenin sol tarafında altta kalan büyük kare/dikdörtgen görsel." />
              <ImageUploadCard field="aboutImage2" label="Üst Üste Binen Görsel (Küçük)" desc="Ana görselin üzerine binen, sağ altta konumlanan tamamlayıcı kare resim." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tecrübe Rozeti Sayısı (Örn: 10+)</label>
                <input type="text" value={hakkimizda.experienceYears || ''}
                  onChange={(e) => setHakkimizda(p => ({ ...p, experienceYears: e.target.value }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-cyan-300 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tecrübe Rozeti Metni</label>
                <textarea value={hakkimizda.experienceText || ''}
                  onChange={(e) => setHakkimizda(p => ({ ...p, experienceText: e.target.value }))}
                  rows={2} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-cyan-300 outline-none" placeholder="Yıllık\nTecrübe" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-2">Hikayemiz Ana Başlığı</label>
              <input type="text" value={hakkimizda.aboutTitle || ''}
                onChange={(e) => setHakkimizda(p => ({ ...p, aboutTitle: e.target.value }))}
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-cyan-300 outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Hikaye Başlık Boyutu (Masaüstü)</label>
                <input type="text" value={hakkimizda.aboutTitleSizeDesktop || ''} onChange={(e) => setHakkimizda(p => ({ ...p, aboutTitleSizeDesktop: e.target.value }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-cyan-300 outline-none" placeholder="Örn: 44px" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Hikaye Başlık Boyutu (Mobil)</label>
                <input type="text" value={hakkimizda.aboutTitleSizeMobile || ''} onChange={(e) => setHakkimizda(p => ({ ...p, aboutTitleSizeMobile: e.target.value }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-cyan-300 outline-none" placeholder="Örn: 28px" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Detaylı Vizyon Yazısı</label>
              <textarea value={hakkimizda.aboutText || ''}
                onChange={(e) => setHakkimizda(p => ({ ...p, aboutText: e.target.value }))}
                rows={7} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-cyan-300 outline-none resize-none leading-relaxed" />
              <p className="text-[11px] text-slate-400 mt-1">Paragrafları ayırmak için Enter tuşunu kullanın.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Sayfa Özel Fontu</label>
              <select value={hakkimizda.fontFamily || 'Var'}
                onChange={(e) => setHakkimizda(p => ({ ...p, fontFamily: e.target.value }))}
                className="w-full md:w-1/2 h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-cyan-300/30 outline-none cursor-pointer">
                {FONT_OPTIONS.map(f => <option key={f} value={f}>{f === 'Var' ? 'Genel Tema Fontunu Kullan' : f}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Tikli Maddeler */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
          <h3 className="text-lg font-extrabold text-slate-800 mb-5 pb-4 border-b border-slate-100">Avantajlarımız / Onaylı Maddeler</h3>
          <div className="space-y-3">
            {(hakkimizda.features || []).map((feature, idx) => (
              <div key={idx} className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <input type="text" value={feature} onChange={(e) => updateFeature(idx, e.target.value)}
                  className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-cyan-300" />
                <button onClick={() => removeFeature(idx)}
                  className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button onClick={addFeature}
              className="w-full py-3 border-2 border-dashed border-cyan-200 hover:border-cyan-400 bg-cyan-50/50 text-cyan-600 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors text-sm">
              <Plus size={16} /> Yeni Madde Ekle
            </button>
          </div>
        </div>

        {/* 4'lü Grid "Neden Biz" Alanı */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center"><Zap size={20} /></div>
            <h3 className="text-lg font-extrabold text-slate-800">Değerlerimiz / Grid Başlıkları</h3>
          </div>
          
          <div className="space-y-5 mb-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Bölüm Ana Başlığı</label>
              <input type="text" value={hakkimizda.valuesTitle || ''}
                onChange={(e) => setHakkimizda(p => ({ ...p, valuesTitle: e.target.value }))}
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-cyan-300 outline-none" placeholder="Örn: Neden Honurs Perde?" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Bölüm Alt Açıklaması</label>
              <input type="text" value={hakkimizda.valuesSubtitle || ''}
                onChange={(e) => setHakkimizda(p => ({ ...p, valuesSubtitle: e.target.value }))}
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-cyan-300 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(hakkimizda.values || []).map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col gap-3 relative">
                <button onClick={() => removeValue(idx)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
                <div className="pr-8">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Kutu İkonu</label>
                  <select value={item.icon} onChange={(e) => updateValue(idx, 'icon', e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 outline-none cursor-pointer focus:ring-2 focus:ring-cyan-300">
                    {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Başlık</label>
                  <input type="text" value={item.title} onChange={(e) => updateValue(idx, 'title', e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-cyan-300" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Açıklama</label>
                  <textarea value={item.description} onChange={(e) => updateValue(idx, 'description', e.target.value)}
                    rows={3} className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-cyan-300 resize-none" />
                </div>
              </div>
            ))}
          </div>
          
          <button onClick={addValue}
            className="w-full mt-5 py-4 border-2 border-dashed border-cyan-200 hover:border-cyan-400 bg-cyan-50/50 text-cyan-600 font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors text-sm">
            <Plus size={18} /> Yeni Değer/Kart Ekle
          </button>
        </div>

      </div>
    </div>
  );
}
