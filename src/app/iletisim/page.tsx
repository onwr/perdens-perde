'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/ui/FloatingButtons';
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSettings } from '@/contexts/SettingsContext';

export default function Iletisim() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', mekan: '', urun: '', mesaj: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { settings } = useSettings();
  const phoneStrip = settings.contact.phone.replace(/\D/g, '');

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    if (digits.length <= 9) return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'phone' ? formatPhone(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderNo = 'TLP-' + Date.now().toString().slice(-6);
      await addDoc(collection(db, 'kesif_talepleri'), {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        location: formData.mekan || 'Belirtilmedi',
        details: `Ürün: ${formData.urun || 'Belirtilmedi'}\n\nMesaj: ${formData.mesaj}`,
        productCategory: formData.urun || 'Genel',
        type: 'Ücretsiz Keşif Talebi',
        status: 'Bekliyor',
        orderNo,
        createdAt: new Date().toISOString() 
      });
      setSuccess(true);
      setFormData({ name: '', phone: '', email: '', mekan: '', urun: '', mesaj: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Mesaj gönderilemedi:', error);
      alert('Bir hata oluştu. Lütfen bizi doğrudan arayın veya WhatsApp üzerinden iletişime geçin.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Header />

      <section className="relative w-full h-[40vh] min-h-[350px] flex items-center justify-center mt-[90px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/neden-biz.png" 
            alt="Perdens Perde İletişim"
            fill
            className="object-cover object-center scale-105"
            unoptimized={true}
            priority
          />
          <div className="absolute inset-0 bg-slate-900/75 z-10" />
        </div>

        <div className="relative z-20 text-center px-6 max-w-3xl mx-auto flex flex-col items-center">
          <span className="text-white/80 uppercase tracking-[0.3em] text-[12px] font-bold mb-4 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20">
            Bize Ulaşın
          </span>
          <h1 className="text-[40px] sm:text-[48px] lg:text-[56px] font-extrabold text-white tracking-tight drop-shadow-lg leading-[1.1]" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
            İletişim
          </h1>
        </div>
      </section>

      <main className="flex-grow w-full py-16 lg:py-24 px-6 lg:px-10 max-w-[1280px] mx-auto relative z-10 flex flex-col lg:flex-row gap-16">
        
        <div className="w-full lg:w-5/12 flex flex-col gap-6">
          <div className="mb-6">
            <h2 className="text-[32px] font-extrabold text-[#1e293b] leading-[1.2] tracking-tight" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
              Her Türlü Projeniz İçin<br/>Buradayız.
            </h2>
            <div className="w-16 h-1 bg-red-600 rounded-full mt-4" />
          </div>

          <div className="flex bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 shrink-0 rounded-full bg-red-50 text-red-600 flex items-center justify-center mr-6">
              <Phone size={24} />
            </div>
            <div>
              <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1">Telefon</h4>
              <a href={`tel:${phoneStrip}`} className="text-[18px] font-extrabold text-slate-800 hover:text-red-600 transition-colors">
                {settings.contact.phone}
              </a>
            </div>
          </div>

          <div className="flex bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 shrink-0 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mr-6">
              <Mail size={24} />
            </div>
            <div>
              <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1">E-Posta</h4>
              <a href={`mailto:${settings.contact.email}`} className="text-[18px] font-extrabold text-slate-800 hover:text-emerald-600 transition-colors">
                {settings.contact.email}
              </a>
            </div>
          </div>

          <div className="flex bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 shrink-0 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mr-6">
              <MapPin size={24} />
            </div>
            <div>
              <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1">Merkez Adres</h4>
              <p className="text-[15px] font-medium text-slate-600 leading-snug pr-4 whitespace-pre-wrap">
                {settings.contact.address}
              </p>
            </div>
          </div>

          <div className="flex bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 shrink-0 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mr-6">
              <Clock size={24} />
            </div>
            <div>
              <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1">Çalışma Saatleri</h4>
              <p className="text-[15px] font-medium text-slate-600 whitespace-pre-wrap">
                {settings.contact.workingHours}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-7/12">
          <div className="bg-white rounded-[40px] p-6 sm:p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
            <style>{`
              @media (min-width: 768px) { .dyn-cnt-t { font-size: var(--cnt-td) !important; } }
              @media (max-width: 767px) { .dyn-cnt-t { font-size: var(--cnt-tm) !important; } }
            `}</style>
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-[80px] -mr-10 -mt-10 pointer-events-none" />
            
            <h3 className="dyn-cnt-t text-[24px] sm:text-[28px] font-extrabold text-slate-800 mb-2 relative z-10"
                style={{
                  ['--cnt-td' as string]: settings.contact.formSubtitleSizeDesktop || '',
                  ['--cnt-tm' as string]: settings.contact.formSubtitleSizeMobile || settings.contact.formSubtitleSizeDesktop || ''
                } as React.CSSProperties}>
              {settings.contact.formSubtitle}
            </h3>
            <p className="text-slate-500 font-medium mb-8 relative z-10">{settings.contact.formTitle}</p>

            {success ? (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-8 rounded-[24px] text-center flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-300">
                <CheckCircle2 size={48} className="text-emerald-500" />
                <div>
                  <h4 className="font-bold text-[18px]">Talebiniz Alındı!</h4>
                  <p className="text-[14px] mt-1">İlgili ekibimiz sizinle en kısa sürede iletişime geçecektir.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-slate-600 uppercase tracking-wide px-1">{settings.contact.formNameLabel}</label>
                    <input 
                      type="text" 
                      name="name"
                      required 
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-slate-50 border border-slate-200 rounded-[14px] px-5 py-4 w-full outline-none focus:bg-white focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all font-medium text-slate-700"
                      placeholder="Örn: Ahmet Yılmaz"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-slate-600 uppercase tracking-wide px-1">{settings.contact.formPhoneLabel}</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required 
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-slate-50 border border-slate-200 rounded-[14px] px-5 py-4 w-full outline-none focus:bg-white focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all font-medium text-slate-700"
                      placeholder="05XX XXX XX XX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-slate-600 uppercase tracking-wide px-1">Mekan Türü</label>
                    <div className="relative">
                      <select name="mekan" value={formData.mekan} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[14px] focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-100 focus:bg-white transition-all text-[14px] font-medium text-slate-700 appearance-none">
                        <option value="">Açılır Menüden Seçiniz</option>
                        <option value="Ofis">Ofis Projesi</option>
                        <option value="Otel">Otel Projesi</option>
                        <option value="Kurumsal">Kurumsal (Hastane, Okul vb.)</option>
                        <option value="Diğer">Diğer</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-slate-600 uppercase tracking-wide px-1">{settings.contact.formEmailLabel}</label>
                     <input 
                       type="email" 
                       name="email"
                       required 
                       value={formData.email}
                       onChange={handleChange}
                       className="bg-slate-50 border border-slate-200 rounded-[14px] px-5 py-4 w-full outline-none focus:bg-white focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all font-medium text-slate-700"
                       placeholder="ornek@firma.com"
                     />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-bold text-slate-600 uppercase tracking-wide px-1">{settings.contact.formMessageLabel}</label>
                  <textarea 
                    required 
                    name="mesaj"
                    rows={4}
                    value={formData.mesaj}
                    onChange={handleChange}
                    className="bg-slate-50 border border-slate-200 rounded-[14px] px-5 py-4 w-full outline-none focus:bg-white focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all font-medium text-slate-700 resize-none"
                    placeholder="Lütfen talebinizi veya varsa ölçü detaylarını buraya yazın..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="mt-2 w-full text-white rounded-[14px] py-4 px-6 font-bold text-[16px] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-[0_8px_20px_rgba(0,0,0,0.12)] disabled:opacity-70 disabled:cursor-not-allowed group"
                  style={{ backgroundColor: settings.contact.formBtnColor }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      {settings.contact.formBtnText}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <div className="w-full h-[400px] bg-slate-200 relative pointer-events-none filter grayscale opacity-90">
         <iframe 
            src={settings.contact.mapUrl} 
            className="w-full h-full border-0 pointer-events-auto" 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
         ></iframe>
      </div>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
