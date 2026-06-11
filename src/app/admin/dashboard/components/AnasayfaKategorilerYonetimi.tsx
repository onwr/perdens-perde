"use client";

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Check, Layers, Plus, Trash2, UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import { useSettings, defaultSettings } from '@/contexts/SettingsContext';
import FontSizeInput from './FontSizeInput';

const FONT_OPTIONS = ['Var', 'Manrope', 'Inter', 'Roboto', 'Playfair Display', 'Outfit', 'Montserrat', 'Poppins'];
const ICON_OPTIONS = [
  'Layers', 'AlignJustify', 'SlidersHorizontal', 'List', 'Wifi',
  'Sun', 'Moon', 'Star', 'Home', 'Building', 'Lightbulb', 'Box',
  'ShieldCheck', 'Settings', 'Maximize', 'LayoutGrid', 'Palette', 'Droplet',
  'Monitor', 'Cloud', 'Heart', 'Award', 'Camera', 'Hexagon',
];

const IMGBB_KEY = '51eca7c487b49a21c7f45c86a42093cf';

const FALLBACK_MAP: Record<string, string> = {
  'stor-perde': '/Perde-Image/stor-perde.png',
  'zebra-perde': '/Perde-Image/zebra-perde.jpg',
  'ahsap-jaluzi': '/Perde-Image/ahsap-jaluzi.jpg',
  'aluminyum-jaluzi': '/Perde-Image/alimunyum-jaluzi.jpg',
  'motorlu-sistemler': '/Perde-Image/motorlu-sistem.jpg',
};

export default function AnasayfaKategorilerYonetimi() {
  const { settings, loading } = useSettings();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<Record<number, boolean>>({});
  const [homeCategories, setHomeCategories] = useState(settings?.homeCategories || defaultSettings.homeCategories);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'site'), { homeCategories }, { merge: true });
      alert('Kategoriler bölümü ayarları başarıyla kaydedildi!');
    } catch {
      alert('Kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const updateCard = (idx: number, key: string, val: string) => {
    const newCards = [...(homeCategories.cards || [])];
    newCards[idx] = { ...newCards[idx], [key]: val };
    setHomeCategories(p => ({ ...p, cards: newCards }));
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
        updateCard(idx, 'image', data.data.url);
      } else {
        alert('Resim yüklenemedi.');
      }
    } catch {
      alert('Bir hata oluştu.');
    } finally {
      setUploading(p => ({ ...p, [idx]: false }));
      // reset input
      e.target.value = '';
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline-block" /> Yükleniyor...</div>;

  return (
    <div>
      {/* Başlık + Kaydet */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold mb-1 tracking-tight">Kategori Listesi Yönetimi</h2>
          <p className="text-slate-500 font-medium">Anasayfadaki &quot;Sistemlerimiz&quot; kartlarının görsellerini, başlıklarını ve ikonlarını ayarlayın.</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-slate-400 text-white px-5 py-3 rounded-xl font-bold transition-all shadow">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Değişiklikleri Kaydet
        </button>
      </div>

      <div className="max-w-4xl space-y-6">

        {/* Başlık & Font */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center"><Layers size={20} /></div>
            <h3 className="text-lg font-extrabold text-slate-800">Bölüm Başlıkları ve Font</h3>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Bölüm Ana Başlığı</label>
              <input type="text" value={homeCategories.title}
                onChange={(e) => setHomeCategories(p => ({ ...p, title: e.target.value }))}
                placeholder="Örn: Sistemlerimiz"
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-amber-300 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Bölüm Alt Başlığı / Açıklaması</label>
              <input type="text" value={homeCategories.subtitle}
                onChange={(e) => setHomeCategories(p => ({ ...p, subtitle: e.target.value }))}
                placeholder="Örn: İhtiyacınıza uygun yenilikçi çözümleri keşfedin."
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-amber-300 outline-none"
              />
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Bu Alanın Özel Fontu</label>
                  <select value={homeCategories.fontFamily}
                    onChange={(e) => setHomeCategories(p => ({ ...p, fontFamily: e.target.value }))}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-amber-300/30 outline-none">
                    {FONT_OPTIONS.map(f => <option key={f} value={f}>{f === 'Var' ? 'Genel Fontu Kullan' : f}</option>)}
                  </select>
                </div>
                <FontSizeInput
                  label="Başlık Yazı Boyutu"
                  desktopValue={homeCategories.titleSizeDesktop || ''}
                  mobileValue={homeCategories.titleSizeMobile || ''}
                  onDesktopChange={(v) => setHomeCategories(p => ({ ...p, titleSizeDesktop: v }))}
                  onMobileChange={(v) => setHomeCategories(p => ({ ...p, titleSizeMobile: v }))}
                />
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <FontSizeInput
                  label="Alt Başlık Yazı Boyutu"
                  desktopValue={homeCategories.subtitleSizeDesktop || ''}
                  mobileValue={homeCategories.subtitleSizeMobile || ''}
                  onDesktopChange={(v) => setHomeCategories(p => ({ ...p, subtitleSizeDesktop: v }))}
                  onMobileChange={(v) => setHomeCategories(p => ({ ...p, subtitleSizeMobile: v }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Kategori Kartları */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-extrabold text-slate-800">Kategori Kartları</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Her karttaki başlık, URL, ikon ve kapak görselini ayrı ayrı düzenleyin.</p>
            </div>
            <button type="button"
              onClick={() => setHomeCategories(p => ({
                ...p,
                cards: [...(p.cards || []), { slug: '', title: 'Yeni Kategori', icon: 'Layers', image: '' }]
              }))}
              className="flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-2 rounded-lg text-sm font-bold hover:bg-amber-200 transition-colors shrink-0">
              <Plus size={16} /> Kart Ekle
            </button>
          </div>

          <div className="space-y-5">
            {(homeCategories.cards || []).map((card, idx) => {
              const currentImage = card.image || '';
              const fallbackImg = FALLBACK_MAP[card.slug] || '';
              const previewImg = currentImage || fallbackImg;

              return (
                <div key={idx} className="relative bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                  {/* Sil butonu */}
                  <button type="button"
                    onClick={() => {
                      const nc = [...(homeCategories.cards || [])];
                      nc.splice(idx, 1);
                      setHomeCategories(p => ({ ...p, cards: nc }));
                    }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors shadow-sm"
                    title="Bu Kartı Sil">
                    <Trash2 size={13} />
                  </button>

                  <div className="flex flex-col md:flex-row gap-0">
                    {/* Sol — Görsel önizleme ve yükleme */}
                    <div className="w-full md:w-44 shrink-0">
                      {/* Görsel önizleme */}
                      <div className="relative w-full md:w-44 h-36 bg-slate-200 overflow-hidden">
                        {previewImg ? (
                          <img src={previewImg} alt={card.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                            <ImageIcon size={24} />
                            <span className="text-[11px] font-medium">Görsel yok</span>
                          </div>
                        )}

                        {/* Eğer özel resim varsa "kaldır" butonu */}
                        {currentImage && (
                          <button type="button"
                            onClick={() => updateCard(idx, 'image', '')}
                            className="absolute top-1.5 left-1.5 w-6 h-6 flex items-center justify-center bg-black/60 text-white rounded-full hover:bg-red-600 transition-colors"
                            title="Özel görseli kaldır, varsayılana dön">
                            <X size={11} />
                          </button>
                        )}
                      </div>

                      {/* Yükle butonu */}
                      <label className={`flex items-center justify-center gap-1.5 w-full py-2.5 text-[11px] font-bold cursor-pointer transition-colors ${
                        uploading[idx]
                          ? 'bg-slate-200 text-slate-400'
                          : 'bg-amber-500 hover:bg-amber-600 text-white'
                      }`}>
                        {uploading[idx] ? (
                          <><Loader2 size={12} className="animate-spin" /> Yükleniyor...</>
                        ) : (
                          <><UploadCloud size={12} /> Görsel Yükle</>
                        )}
                        <input type="file" className="hidden" accept="image/*"
                          disabled={!!uploading[idx]}
                          onChange={(e) => handleImageUpload(e, idx)} />
                      </label>

                      {currentImage ? (
                        <p className="text-[10px] text-center text-emerald-600 font-bold bg-emerald-50 py-1">✓ Özel görsel</p>
                      ) : (
                        <p className="text-[10px] text-center text-slate-400 font-medium bg-slate-100 py-1">Varsayılan görsel</p>
                      )}
                    </div>

                    {/* Sağ — Alanlar */}
                    <div className="flex-1 p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Kart Başlığı / Kategori Adı</label>
                        <input type="text" placeholder="Örn: Stor Perde" value={card.title}
                          onChange={(e) => updateCard(idx, 'title', e.target.value)}
                          className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:ring-2 focus:ring-amber-300 outline-none" />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">URL Adresi (slug)</label>
                        <input type="text" placeholder="stor-perde" value={card.slug}
                          onChange={(e) => updateCard(idx, 'slug', e.target.value)}
                          className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-amber-300 outline-none font-mono" />
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">/<strong>{card.slug || '...'}</strong></p>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Alt İkon</label>
                        <select value={card.icon}
                          onChange={(e) => updateCard(idx, 'icon', e.target.value)}
                          className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-amber-300 outline-none">
                          {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {(!homeCategories.cards || homeCategories.cards.length === 0) && (
              <div className="text-center py-8 text-slate-400 text-sm font-medium border border-dashed border-slate-300 rounded-xl">
                Henüz kart eklenmemiş.
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-sm text-slate-400 font-medium flex gap-2 items-start">
            <span className="text-amber-500 mt-0.5">ℹ</span>
            <p>Görsel yüklenmemişse ilgili kategori klasöründeki varsayılan görsel kullanılır. Yüklenen görseli kaldırmak için sol üstteki <strong className="text-slate-500">✕</strong> ikonuna tıklayın.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
