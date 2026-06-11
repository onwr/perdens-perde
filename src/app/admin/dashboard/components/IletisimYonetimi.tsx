"use client";

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Check, MessageSquareText } from 'lucide-react';
import { useSettings, defaultSettings } from '@/contexts/SettingsContext';
import FontSizeInput from './FontSizeInput';

export default function IletisimYonetimi() {
  const { settings, loading } = useSettings();
  const [saving, setSaving] = useState(false);
  
  const [contact, setContact] = useState(settings?.contact || defaultSettings.contact);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'site'), { contact }, { merge: true });
      alert('İletişim sayfası ayarları başarıyla kaydedildi!');
    } catch {
      alert('Kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline-block" /> Yükleniyor...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold mb-1 tracking-tight">İletişim Formu & Sayfa Yönetimi</h2>
          <p className="text-slate-500 font-medium">Bize Ulaşın sayfasındaki haritayı, iletişim bilgilerini ve formu ayarlayın.</p>
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
        
        {/* Temel Bilgiler */}
        <div>
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
             <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center">
               <MessageSquareText size={20} />
             </div>
             <h3 className="text-lg font-extrabold text-slate-800">Ana İletişim Bilgileri (Adres, Tel vb.)</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Telefon Numarası</label>
                 <input
                   type="text"
                   value={contact.phone}
                   onChange={(e) => setContact(p => ({ ...p, phone: e.target.value }))}
                   className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-green-300 outline-none"
                 />
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">E-posta Adresi</label>
                 <input
                   type="text"
                   value={contact.email}
                   onChange={(e) => setContact(p => ({ ...p, email: e.target.value }))}
                   className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-green-300 outline-none"
                 />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Açık Adres</label>
                 <input
                   type="text"
                   value={contact.address}
                   onChange={(e) => setContact(p => ({ ...p, address: e.target.value }))}
                   className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-green-300 outline-none"
                 />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Çalışma Saatleri</label>
                 <textarea
                   value={contact.workingHours}
                   onChange={(e) => setContact(p => ({ ...p, workingHours: e.target.value }))}
                   rows={2}
                   className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-green-300 outline-none resize-none inline-block font-mono text-sm leading-relaxed"
                 />
              </div>
           </div>

           <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Google Maps Yerleştirme Kodu (Iframe URL)</label>
              <textarea
                value={contact.mapUrl}
                onChange={(e) => setContact(p => ({ ...p, mapUrl: e.target.value }))}
                rows={3}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-green-300 outline-none resize-none font-mono text-xs"
              />
              <p className="text-[11px] text-slate-400 mt-1">Google Maps'ten aldığınız "src" (Sadece link, iframe değil) kodunu buraya yapıştırın.</p>
           </div>
        </div>

        {/* Form Ayarları */}
        <div>
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
             <h3 className="text-lg font-extrabold text-slate-800">Form Etiketleri ve Butonu</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Form Üst Taraf Küçük Başlık</label>
                 <input
                   type="text"
                   value={contact.formTitle}
                   onChange={(e) => setContact(p => ({ ...p, formTitle: e.target.value }))}
                   className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-green-300 outline-none"
                 />
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Form Ana Başlık</label>
                 <input
                   type="text"
                   value={contact.formSubtitle}
                   onChange={(e) => setContact(p => ({ ...p, formSubtitle: e.target.value }))}
                   className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-green-300 outline-none"
                 />
              </div>
           </div>

            <div className="mb-4">
              <FontSizeInput
                label="Form Ana Ba\u015fl\u0131k Boyutu"
                desktopValue={contact.formSubtitleSizeDesktop || ''}
                mobileValue={contact.formSubtitleSizeMobile || ''}
                onDesktopChange={(v) => setContact(p => ({ ...p, formSubtitleSizeDesktop: v }))}
                onMobileChange={(v) => setContact(p => ({ ...p, formSubtitleSizeMobile: v }))}
                desktopPlaceholder="\u00d6rn: 36px"
                mobilePlaceholder="\u00d6rn: 26px"
              />
            </div>
           
           <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 mb-6">
              <h4 className="font-bold text-sm text-slate-600 mb-4 uppercase tracking-widest">Girdi Etiketleri (Labels)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">İsim Alanı</label>
                    <input type="text" value={contact.formNameLabel} onChange={(e) => setContact(p => ({ ...p, formNameLabel: e.target.value }))} className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm" />
                 </div>
                 <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">E-Posta Alanı</label>
                    <input type="text" value={contact.formEmailLabel} onChange={(e) => setContact(p => ({ ...p, formEmailLabel: e.target.value }))} className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm" />
                 </div>
                 <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Telefon Alanı</label>
                    <input type="text" value={contact.formPhoneLabel} onChange={(e) => setContact(p => ({ ...p, formPhoneLabel: e.target.value }))} className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm" />
                 </div>
                 <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Mesaj Kutusu Alanı</label>
                    <input type="text" value={contact.formMessageLabel} onChange={(e) => setContact(p => ({ ...p, formMessageLabel: e.target.value }))} className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm" />
                 </div>
              </div>
           </div>

           <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
              <h4 className="font-bold text-sm text-slate-600 mb-4 uppercase tracking-widest">Gönderme Butonu</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Buton Yazısı</label>
                    <input type="text" value={contact.formBtnText} onChange={(e) => setContact(p => ({ ...p, formBtnText: e.target.value }))} className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm" />
                 </div>
                 <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Buton Rengi</label>
                    <div className="flex items-center gap-2">
                       <input type="color" value={contact.formBtnColor} onChange={(e) => setContact(p => ({ ...p, formBtnColor: e.target.value }))} className="w-10 h-10 rounded border-0 p-0" />
                       <input type="text" value={contact.formBtnColor} onChange={(e) => setContact(p => ({ ...p, formBtnColor: e.target.value }))} className="flex-1 h-10 px-3 border border-slate-200 rounded-lg text-sm uppercase" />
                    </div>
                 </div>
              </div>
           </div>
           
        </div>

      </div>
    </div>
  );
}
