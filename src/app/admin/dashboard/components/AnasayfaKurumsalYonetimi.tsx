"use client";

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Check, Building2, Plus, Trash2, UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import { useSettings, defaultSettings } from '@/contexts/SettingsContext';
import FontSizeInput from './FontSizeInput';

const FONT_OPTIONS = ['Var', 'Manrope', 'Inter', 'Roboto', 'Playfair Display', 'Outfit', 'Montserrat', 'Poppins'];

const IMGBB_KEY = '51eca7c487b49a21c7f45c86a42093cf';

export default function AnasayfaKurumsalYonetimi() {
  const { settings, loading } = useSettings();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<Record<number, boolean>>({});
  const [homeCorporate, setHomeCorporate] = useState(settings?.homeCorporate || defaultSettings.homeCorporate);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'site'), { homeCorporate }, { merge: true });
      alert('Kurumsal bölümü ayarları başarıyla kaydedildi!');
    } catch {
      alert('Kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    setHomeCorporate(p => ({
      ...p,
      items: [...(p.items || []), { title: 'Yeni Proje Alanı', image: '' }]
    }));
  };

  const updateItem = (index: number, key: 'title' | 'image', value: string) => {
    const newItems = [...(homeCorporate.items || [])];
    newItems[index] = { ...newItems[index], [key]: value };
    setHomeCorporate(p => ({ ...p, items: newItems }));
  };

  const removeItem = (index: number) => {
    const newItems = [...(homeCorporate.items || [])];
    newItems.splice(index, 1);
    setHomeCorporate(p => ({ ...p, items: newItems }));
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
        updateItem(idx, 'image', data.data.url);
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
          <h2 className="text-3xl font-extrabold mb-1 tracking-tight">Kurumsal Bölüm Yönetimi</h2>
          <p className="text-slate-500 font-medium">Anasayfadaki kurumsal bilgilendirme ve görsel alanları düzenleyin.</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-slate-400 text-white px-5 py-3 rounded-xl font-bold transition-all shadow">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Değişiklikleri Kaydet
        </button>
      </div>

      <div className="max-w-4xl space-y-6">

        {/* Ana Metinler */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center"><Building2 size={20} /></div>
            <h3 className="text-lg font-extrabold text-slate-800">Ana Metinler</h3>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Bölüm Ana Başlığı</label>
              <input type="text" value={homeCorporate.title || ''}
                onChange={(e) => setHomeCorporate(p => ({ ...p, title: e.target.value }))}
                placeholder="Kurumsal Perde Uygulamaları"
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-300 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Bölüm Alt Açıklaması</label>
              <textarea value={homeCorporate.subtitle || ''}
                onChange={(e) => setHomeCorporate(p => ({ ...p, subtitle: e.target.value }))}
                rows={3}
                placeholder="Ofis, banka, otel ve sağlık projeleri için stor perde..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-indigo-300 outline-none resize-none"
              />
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Bölüm Özel Fontu</label>
                  <select value={homeCorporate.fontFamily || 'Var'}
                    onChange={(e) => setHomeCorporate(p => ({ ...p, fontFamily: e.target.value }))}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-300/30 outline-none">
                    {FONT_OPTIONS.map(f => <option key={f} value={f}>{f === 'Var' ? 'Genel Fontu Kullan' : f}</option>)}
                  </select>
                </div>
                <FontSizeInput
                  label="Başlık Yazı Boyutu"
                  desktopValue={homeCorporate.titleSizeDesktop || ''}
                  mobileValue={homeCorporate.titleSizeMobile || ''}
                  onDesktopChange={(v) => setHomeCorporate(p => ({ ...p, titleSizeDesktop: v }))}
                  onMobileChange={(v) => setHomeCorporate(p => ({ ...p, titleSizeMobile: v }))}
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <FontSizeInput
                  label="Alt Açıklama Yazı Boyutu"
                  desktopValue={homeCorporate.subtitleSizeDesktop || ''}
                  mobileValue={homeCorporate.subtitleSizeMobile || ''}
                  onDesktopChange={(v) => setHomeCorporate(p => ({ ...p, subtitleSizeDesktop: v }))}
                  onMobileChange={(v) => setHomeCorporate(p => ({ ...p, subtitleSizeMobile: v }))}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer"
                  checked={homeCorporate.hoverZoom ?? true}
                  onChange={(e) => setHomeCorporate(p => ({ ...p, hoverZoom: e.target.checked }))} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
              <div>
                <p className="text-sm font-bold text-slate-800">Görsel Büyüme (Hover Zoom) Efekti</p>
                <p className="text-xs text-slate-500 font-medium">Görselin üzerine gelindiğinde hafifçe büyüme animasyonunu açın/kapatın.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Görsel Kartlar */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
            <h3 className="text-lg font-extrabold text-slate-800">Kurumsal Alan Görselleri</h3>
            <button onClick={addItem}
              className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors">
              <Plus size={15} /> Alan Ekle
            </button>
          </div>
          <div className="space-y-4">
            {(homeCorporate.items || []).map((item, idx) => {
               const previewImg = item.image;
               return (
                <div key={idx} className="relative bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <button onClick={() => removeItem(idx)}
                    className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors shadow-sm z-10">
                    <Trash2 size={14} />
                  </button>
                  <div className="flex flex-col md:flex-row gap-5">
                    {/* Görsel */}
                    <div className="w-full md:w-48 shrink-0">
                      <div className="relative w-full h-32 bg-slate-200 overflow-hidden rounded-xl mb-2">
                        {previewImg ? (
                          <img src={previewImg} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                            <ImageIcon size={24} />
                            <span className="text-[11px] font-medium">Görsel yok</span>
                          </div>
                        )}
                        {previewImg && (
                          <button type="button"
                            onClick={() => updateItem(idx, 'image', '')}
                            className="absolute top-1.5 left-1.5 w-6 h-6 flex items-center justify-center bg-black/60 text-white rounded-full hover:bg-red-600 transition-colors"
                            title="Görseli kaldır">
                            <X size={11} />
                          </button>
                        )}
                      </div>
                      <label className={`flex items-center justify-center gap-1.5 w-full py-2 text-[11px] font-bold cursor-pointer transition-colors rounded-lg ${
                        uploading[idx]
                          ? 'bg-slate-200 text-slate-400'
                          : 'bg-indigo-500 hover:bg-indigo-600 text-white'
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
                    </div>

                    {/* Metin */}
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Alan Adı (Başlık)</label>
                      <input type="text" value={item.title || ''}
                        onChange={(e) => updateItem(idx, 'title', e.target.value)}
                        placeholder="Örn: Ofis ve İş Merkezi Perdeleri"
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-300" />
                    </div>
                  </div>
                </div>
               );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

