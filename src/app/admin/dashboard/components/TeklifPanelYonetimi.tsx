"use client";

import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Check, LayoutPanelTop, Image as ImageIcon, Plus, Trash2, MousePointerClick, MessageSquarePlus } from 'lucide-react';
import { useSettings, defaultSettings } from '@/contexts/SettingsContext';

const IMGBB_KEY = '51eca7c487b49a21c7f45c86a42093cf';

export default function TeklifPanelYonetimi() {
  const { settings } = useSettings();
  const [quoteModal, setQuoteModal] = useState(settings.quoteModal || defaultSettings.quoteModal);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (settings.quoteModal) {
      setQuoteModal(settings.quoteModal);
    }
  }, [settings.quoteModal]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'settings', 'site'), {
        quoteModal: quoteModal
      });
      alert('Teklif paneli ayarları başarıyla güncellendi.');
    } catch (error) {
      console.error('Error updating quote modal:', error);
      alert('Ayarlar kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setQuoteModal(prev => ({ ...prev, image: data.data.url }));
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Resim yüklenemedi.');
    } finally {
      setUploading(false);
    }
  };

  const addWhyUsItem = () => {
    setQuoteModal(prev => ({
      ...prev,
      whyUsItems: [...prev.whyUsItems, '']
    }));
  };

  const removeWhyUsItem = (index: number) => {
    setQuoteModal(prev => ({
      ...prev,
      whyUsItems: prev.whyUsItems.filter((_, i) => i !== index)
    }));
  };

  const updateWhyUsItem = (index: number, value: string) => {
    setQuoteModal(prev => {
      const newItems = [...prev.whyUsItems];
      newItems[index] = value;
      return { ...prev, whyUsItems: newItems };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Teklif Formu Paneli</h2>
          <p className="text-slate-500 font-medium">Popup içerisindeki metinleri ve görselleri düzenleyin.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-slate-300 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
        >
          {saving ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
          Değişiklikleri Kaydet
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sol Kolon - Görsel ve Neden Biz */}
        <div className="space-y-6">
          <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center"><ImageIcon size={20} /></div>
              <h3 className="text-lg font-extrabold text-slate-800">Panel Görseli & Başlık</h3>
            </div>
            
            <div className="space-y-4">
              <div className="relative w-full h-48 bg-slate-50 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 group">
                {quoteModal.image ? (
                  <img src={quoteModal.image} alt="Modal" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <ImageIcon size={40} strokeWidth={1} />
                    <span className="text-sm font-medium mt-2">Resim Yüklenmedi</span>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                    <Loader2 size={30} className="animate-spin text-indigo-500" />
                  </div>
                )}
                <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-white text-zinc-900 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
                    <ImageIcon size={16} /> Değiştir
                  </span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Panel Başlığı</label>
                <input
                  type="text"
                  value={quoteModal.title}
                  onChange={(e) => setQuoteModal(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-300 outline-none"
                  placeholder="Neden Biz?"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center"><Check size={20} /></div>
                <h3 className="text-lg font-extrabold text-slate-800">Avantajlar (Neden Biz?)</h3>
              </div>
              <button onClick={addWhyUsItem} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors">
                <Plus size={18} />
              </button>
            </div>
            
            <div className="space-y-3">
              {quoteModal.whyUsItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateWhyUsItem(index, e.target.value)}
                    className="flex-1 h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:ring-2 focus:ring-emerald-300"
                    placeholder="Avantaj metni..."
                  />
                  <button onClick={() => removeWhyUsItem(index)} className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sağ Kolon - İletişim ve Form Metinleri */}
        <div className="space-y-6">
          <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><MousePointerClick size={20} /></div>
              <h3 className="text-lg font-extrabold text-slate-800">Hızlı İletişim & Form</h3>
            </div>
            
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">İletişim Başlığı</label>
                  <input
                    type="text"
                    value={quoteModal.contactTitle}
                    onChange={(e) => setQuoteModal(prev => ({ ...prev, contactTitle: e.target.value }))}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-blue-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Form Başlığı</label>
                  <input
                    type="text"
                    value={quoteModal.formTitle}
                    onChange={(e) => setQuoteModal(prev => ({ ...prev, formTitle: e.target.value }))}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-blue-300 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">İletişim Açıklaması</label>
                <textarea
                  value={quoteModal.contactDesc}
                  onChange={(e) => setQuoteModal(prev => ({ ...prev, contactDesc: e.target.value }))}
                  rows={2}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-blue-300 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Form Açıklaması</label>
                <textarea
                  value={quoteModal.formDesc}
                  onChange={(e) => setQuoteModal(prev => ({ ...prev, formDesc: e.target.value }))}
                  rows={3}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-blue-300 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Form Buton Metni</label>
                <input
                  type="text"
                  value={quoteModal.formBtnText}
                  onChange={(e) => setQuoteModal(prev => ({ ...prev, formBtnText: e.target.value }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-blue-300 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center"><MessageSquarePlus size={20} /></div>
              <h3 className="text-lg font-extrabold text-slate-800">Başarı Mesajı (Form Sonrası)</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Başarı Başlığı</label>
                <input
                  type="text"
                  value={quoteModal.successTitle}
                  onChange={(e) => setQuoteModal(prev => ({ ...prev, successTitle: e.target.value }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-purple-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Başarı Açıklaması</label>
                <input
                  type="text"
                  value={quoteModal.successDesc}
                  onChange={(e) => setQuoteModal(prev => ({ ...prev, successDesc: e.target.value }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-purple-300 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
