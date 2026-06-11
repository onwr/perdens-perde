"use client";

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Check, MonitorPlay, Image as ImageIcon, UploadCloud, Plus, Trash2, Phone, ExternalLink, MousePointerClick } from 'lucide-react';
import { useSettings, defaultSettings, HeroButton } from '@/contexts/SettingsContext';
import FontSizeInput from './FontSizeInput';

const FONT_OPTIONS = ['Var', 'Manrope', 'Inter', 'Roboto', 'Playfair Display', 'Outfit', 'Montserrat', 'Poppins'];
const BTN_TYPES = [
  { value: 'teklif', label: 'Teklif Formu Aç', icon: '📋' },
  { value: 'phone', label: 'Telefon Ara', icon: '📞' },
  { value: 'link', label: 'Sayfaya Git / Harici Link', icon: '🔗' },
];

export default function AnasayfaHeroYonetimi() {
  const { settings, loading } = useSettings();
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [hero, setHero] = useState(settings?.hero || defaultSettings.hero);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'site'), { hero }, { merge: true });
      alert('Anasayfa kapak (Hero) ayarları başarıyla kaydedildi!');
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
      const res = await fetch(`https://api.imgbb.com/1/upload?key=51eca7c487b49a21c7f45c86a42093cf`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) setHero(p => ({ ...p, bgImage: data.data.url }));
      else alert('Resim yüklenemedi.');
    } catch {
      alert('Bir hata oluştu.');
    } finally {
      setUploadingImage(false);
    }
  };

  const addButton = () => {
    const newBtn: HeroButton = {
      id: `btn_${Date.now()}`,
      text: 'Yeni Buton',
      color: '#23272d',
      textColor: '#ffffff',
      font: 'Var',
      link: '/',
      type: 'link'
    };
    setHero(p => ({ ...p, buttons: [...(p.buttons || []), newBtn] }));
  };

  const updateBtn = (id: string, key: keyof HeroButton, value: string) => {
    setHero(p => ({
      ...p,
      buttons: (p.buttons || []).map(b => b.id === id ? { ...b, [key]: value } : b)
    }));
  };

  const removeBtn = (id: string) => {
    setHero(p => ({ ...p, buttons: (p.buttons || []).filter(b => b.id !== id) }));
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline-block" /> Yükleniyor...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold mb-1 tracking-tight">Ana Kapak (Hero) Yönetimi</h2>
          <p className="text-slate-500 font-medium">Sitenin ilk açılış ekranındaki görsel, başlıklar, slogan ve butonları ayarlayın.</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-slate-400 text-white px-5 py-3 rounded-xl font-bold transition-all shadow"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Değişiklikleri Kaydet
        </button>
      </div>

      <div className="max-w-4xl space-y-6">

        {/* Arka Plan Görseli */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center"><ImageIcon size={20} /></div>
            <h3 className="text-lg font-extrabold text-slate-800">Arka Plan (Kapak) Görseli</h3>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/2 aspect-video bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200">
              {hero.bgImage ? (
                <img src={hero.bgImage} alt="Hero Arkaplan" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400"><ImageIcon size={32} className="mb-2" /> Görsel Yok</div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 mb-4 leading-relaxed">Ekranı kaplayacak yüksek çözünürlüklü bir fotoğraf seçin. Yüklendikten sonra otomatik karanlık efekt uygulanır.</p>
              <label className="flex items-center justify-center gap-2 bg-white border-2 border-dashed border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-emerald-400 hover:text-emerald-600 w-full h-14 rounded-xl cursor-pointer font-bold transition-all">
                {uploadingImage ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
                {uploadingImage ? 'Yükleniyor...' : 'Yeni Görsel Yükle'}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
              </label>
            </div>
          </div>
        </div>

        {/* Başlıklar */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center"><MonitorPlay size={20} /></div>
            <h3 className="text-lg font-extrabold text-slate-800">Ana Başlıklar ve Slogan</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">1. Satır Başlığı (Normal Yazı)</label>
              <input value={hero.titleLine1 || ''} onChange={(e) => setHero(p => ({ ...p, titleLine1: e.target.value }))}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-purple-300 outline-none"
                placeholder="Örn: Doğal Ahşap Jaluzi ve" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">2. Satır Başlığı (Renkli/Gradiyent Vurgu)</label>
              <input value={hero.titleHighlight || ''} onChange={(e) => setHero(p => ({ ...p, titleHighlight: e.target.value }))}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-purple-300 outline-none"
                placeholder="Örn: Kurumsal Perde Çözümleri" />
            </div>
          </div>
          <div className="mb-5 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Başlık Fontu</label>
              <select value={hero.titleFont} onChange={(e) => setHero(p => ({ ...p, titleFont: e.target.value }))}
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-purple-300/30 outline-none">
                {FONT_OPTIONS.map(f => <option key={f} value={f}>{f === 'Var' ? 'Genel Fontu Kullan' : f}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <FontSizeInput
                label="Ana Başlık Yazı Boyutu"
                desktopValue={hero.titleSizeDesktop || ''}
                mobileValue={hero.titleSizeMobile || ''}
                onDesktopChange={(v) => setHero(p => ({ ...p, titleSizeDesktop: v }))}
                onMobileChange={(v) => setHero(p => ({ ...p, titleSizeMobile: v }))}
              />
            </div>
          </div>
          <div className="pt-5 border-t border-slate-100">
            <label className="block text-sm font-bold text-slate-700 mb-2">Açıklayıcı Alt Slogan</label>
            <textarea value={hero.subtitle} onChange={(e) => setHero(p => ({ ...p, subtitle: e.target.value }))} rows={2}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-purple-300 outline-none resize-none" />
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Alt Slogan Fontu</label>
                <select value={hero.subtitleFont} onChange={(e) => setHero(p => ({ ...p, subtitleFont: e.target.value }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-purple-300/30 outline-none">
                  {FONT_OPTIONS.map(f => <option key={f} value={f}>{f === 'Var' ? 'Genel Fontu Kullan' : f}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 pt-2">
                <FontSizeInput
                  label="Alt Slogan Yazı Boyutu"
                  desktopValue={hero.subtitleSizeDesktop || ''}
                  mobileValue={hero.subtitleSizeMobile || ''}
                  onDesktopChange={(v) => setHero(p => ({ ...p, subtitleSizeDesktop: v }))}
                  onMobileChange={(v) => setHero(p => ({ ...p, subtitleSizeMobile: v }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dinamik Butonlar */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center"><MousePointerClick size={20} /></div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">Aksiyon Butonları</h3>
                <p className="text-xs text-slate-500 font-medium">Kapak alanındaki CTA butonlarını özelleştirin, ekleyin veya silin.</p>
              </div>
            </div>
            <button type="button" onClick={addButton}
              className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-2 rounded-lg text-sm font-bold hover:bg-orange-100 transition-colors shrink-0">
              <Plus size={15} /> Buton Ekle
            </button>
          </div>

          <div className="space-y-5">
            {(hero.buttons || []).map((btn, idx) => (
              <div key={btn.id} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 relative">
                <button type="button" onClick={() => removeBtn(btn.id)}
                  className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors shadow-sm">
                  <Trash2 size={14} />
                </button>

                <div className="flex items-center gap-2 mb-4">
                  <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                  <span className="text-sm font-bold text-slate-700">Buton {idx + 1}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Buton Tipi */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Buton Tipi</label>
                    <select value={btn.type} onChange={(e) => updateBtn(btn.id, 'type', e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-orange-300 outline-none">
                      {BTN_TYPES.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
                    </select>
                  </div>

                  {/* Buton Yazısı */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Buton Yazısı</label>
                    <input type="text" value={btn.text} onChange={(e) => updateBtn(btn.id, 'text', e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:ring-2 focus:ring-orange-300 outline-none" />
                  </div>

                  {/* Link */}
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      {btn.type === 'phone' ? (
                        <><Phone size={10} className="inline mr-1" />Telefon Numarası (0555 555 55 55 formatında)</>
                      ) : btn.type === 'teklif' ? (
                        'Link (Teklif formu için ?teklif=true)'
                      ) : (
                        <><ExternalLink size={10} className="inline mr-1" />Hedef URL veya Link</>
                      )}
                    </label>
                    <input type="text" value={btn.link} onChange={(e) => updateBtn(btn.id, 'link', e.target.value)}
                      placeholder={btn.type === 'phone' ? '0533 691 05 84' : btn.type === 'teklif' ? '?teklif=true' : '/hakkimizda'}
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-orange-300 outline-none font-mono" />
                  </div>

                  {/* Renkler */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Arka Plan Rengi</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={btn.color === 'transparent' ? '#000000' : btn.color}
                        onChange={(e) => updateBtn(btn.id, 'color', e.target.value)}
                        className="w-10 h-10 rounded border-0 p-0 cursor-pointer" />
                      <input type="text" value={btn.color} onChange={(e) => updateBtn(btn.id, 'color', e.target.value)}
                        placeholder="transparent"
                        className="flex-1 h-10 px-3 border border-slate-200 rounded-lg text-sm uppercase font-mono bg-white" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Yazı Rengi</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={btn.textColor}
                        onChange={(e) => updateBtn(btn.id, 'textColor', e.target.value)}
                        className="w-10 h-10 rounded border-0 p-0 cursor-pointer" />
                      <input type="text" value={btn.textColor} onChange={(e) => updateBtn(btn.id, 'textColor', e.target.value)}
                        className="flex-1 h-10 px-3 border border-slate-200 rounded-lg text-sm uppercase font-mono bg-white" />
                    </div>
                  </div>

                  {/* Font */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Font</label>
                    <select value={btn.font} onChange={(e) => updateBtn(btn.id, 'font', e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-orange-300 outline-none">
                      {FONT_OPTIONS.map(f => <option key={f} value={f}>{f === 'Var' ? 'Genel Fontu Kullan' : f}</option>)}
                    </select>
                  </div>

                  {/* Önizleme */}
                  <div className="flex items-end">
                    <div
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold text-sm border border-white/20"
                      style={{
                        backgroundColor: btn.color === 'transparent' ? 'rgba(0,0,0,0.15)' : btn.color,
                        color: btn.textColor,
                        fontFamily: btn.font !== 'Var' ? btn.font : undefined
                      }}
                    >
                      {btn.type === 'phone' && <Phone size={12} className="mr-1.5" />}
                      {btn.text || 'Önizleme'}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {(!hero.buttons || hero.buttons.length === 0) && (
              <div className="text-center py-8 text-slate-400 text-sm font-medium border border-dashed border-slate-200 rounded-xl">
                Henüz buton eklenmemiş. &quot;Buton Ekle&quot; ile başlayın.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
