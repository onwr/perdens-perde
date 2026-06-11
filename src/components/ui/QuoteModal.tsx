"use client";

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Check, X } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

function ModalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isOpenFromUrl = searchParams.get('teklif') === 'true';
  const [isInternalOpen, setIsInternalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', mekan: '', urun: '', mesaj: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const { settings } = useSettings();
  const phoneStrip = settings.contact.phone.replace(/\D/g, '');

  useEffect(() => {
    if (isOpenFromUrl) {
      setIsInternalOpen(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsInternalOpen(false);
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpenFromUrl]);

  if (!isInternalOpen) return null;

  const handleClose = () => {
    document.body.style.overflow = ''; 
    setIsInternalOpen(false);
    setSubmitted(false);
    setFormData({ name: '', phone: '', email: '', mekan: '', urun: '', mesaj: '' });
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete('teklif');
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    
    window.history.replaceState(null, '', newUrl);
    router.replace(newUrl, { scroll: false });
  };

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
    setSubmitting(true);
    setError('');
    try {
      const orderNo = 'TLP-' + Date.now().toString().slice(-6);
      await addDoc(collection(db, 'kesif_talepleri'), {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        location: formData.mekan,
        details: `Ürün: ${formData.urun}\n\nMesaj: ${formData.mesaj}`,
        productCategory: formData.urun,
        type: 'Fiyat Teklifi',
        status: 'Bekliyor',
        orderNo,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', mekan: '', urun: '', mesaj: '' });
    } catch (err) {
      console.error(err);
      setError('Bir hata oluştu, lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-8 sm:pt-16 pb-16 px-4 bg-black/70 backdrop-blur-sm transition-opacity overflow-y-auto">
      <div
        className="fixed inset-0 z-0 bg-transparent min-h-[150vh]"
        onClick={handleClose}
      />

      <div className="relative z-10 w-full max-w-[1280px] animate-in slide-in-from-bottom-8 fade-in duration-300">

        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleClose(); }}
          type="button"
          className="absolute top-2 right-2 sm:-top-8 sm:-right-4 z-[60] p-3 sm:p-2.5 bg-white text-slate-800 rounded-full shadow-lg transition-transform hover:scale-105 hover:bg-slate-100 border border-slate-100"
        >
          <X size={22} strokeWidth={2.5} />
        </button>

        <div className="relative rounded-[32px] overflow-hidden flex flex-col lg:block min-h-[420px] lg:min-h-[480px] shadow-[0_8px_40px_rgba(0,0,0,0.07)] border border-slate-100 bg-white">
          <div className="relative z-10 w-full lg:w-[55%] px-8 sm:px-10 py-10 sm:py-12 flex flex-col justify-between bg-white/90 lg:bg-transparent lg:bg-gradient-to-r lg:from-white/95 lg:via-white/80 lg:to-transparent h-full">
            <div className="mt-6 sm:mt-12">
              <h2 className="text-[32px] lg:text-[40px] font-bold text-slate-800 mb-10 tracking-tight leading-tight">
                {settings.quoteModal?.whyUsTitle || 'Neden Biz?'}
              </h2>
              <ul className="space-y-3 mb-10">
                {(settings.quoteModal?.whyUsItems?.length ? settings.quoteModal.whyUsItems : ['Kurumsal Uzmanlık', 'Premium Ürünler', 'Proje Bazlı Çözümler', 'Türkiye Geneli Hizmet']).map((item) => (
                  <li key={item} className="flex items-center text-slate-600 text-[15px] font-medium">
                    <Check className="w-[17px] h-[17px] text-[#448b97] mr-3 shrink-0" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="absolute inset-0 z-0">
             {settings.quoteModal?.image?.startsWith('http') ? (
               <img
                 src={settings.quoteModal.image}
                 alt="Ofis Projesi"
                 className="w-full h-full object-cover"
                 style={{ objectPosition: '65% center' }}
               />
             ) : (
               <Image
                 src={settings.quoteModal?.image || "/neden-biz.png"}
                 alt="Ofis Projesi"
                 fill
                 className="object-cover"
                 style={{ objectPosition: '65% center' }}
               />
             )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start relative z-20 pb-10">

          <div className="w-full lg:w-[48%] bg-white border border-slate-200/60 rounded-[24px] p-8 mt-8 shadow-xl">
            <h3 className="text-[20px] font-bold text-slate-800 mb-1">{settings.quoteModal?.contactTitle || 'Hızlı İletişim'}</h3>
            <p className="text-[13px] text-slate-500 mb-6">
              {settings.quoteModal?.contactDesc || 'Teklif talebiniz için doğrudan bizimle iletişime geçebilirsiniz.'}
            </p>
            <div className="flex flex-col gap-3">
              <a href={`tel:${phoneStrip}`} className="flex items-center bg-white border border-slate-200 px-5 py-3.5 rounded-xl font-semibold text-[14px] text-slate-700 hover:border-slate-300 transition-colors">
                <svg className="w-[17px] h-[17px] text-[#448b97] mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {settings.contact.phone}
              </a>
              <a href={`https://wa.me/90${phoneStrip.slice(-10)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-[#1c1c1e] px-5 py-3.5 rounded-xl font-semibold text-[14px] text-white hover:bg-[#2c2c2e] transition-colors shadow-sm">
                <div className="flex items-center">
                  <WhatsAppIcon className="w-[17px] h-[17px] text-white mr-3" />
                  WhatsApp&apos;tan Yazın
                </div>
                <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a href={`mailto:${settings.contact.email}`} className="flex items-center bg-white border border-slate-200 px-5 py-3.5 rounded-xl font-semibold text-[14px] text-slate-700 hover:border-slate-300 transition-colors">
                <svg className="w-[17px] h-[17px] text-[#448b97] mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {settings.contact.email}
              </a>
            </div>
          </div>

          <div className="w-full lg:w-[44%] -mt-0 lg:-mt-32 bg-white rounded-[24px] p-7 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-slate-100 relative z-20">
            <h3 className="text-[22px] font-bold text-slate-800 mb-2">{settings.quoteModal?.formTitle || 'Hızlı Teklif Formu'}</h3>
            <p className="text-[13.5px] text-slate-500 mb-6 leading-relaxed">
              {settings.quoteModal?.formDesc || 'Formu doldurun, ekibimiz projenize uygun perde çözümü ve fiyatlandırma için en kısa sürede sizinle iletişime geçsin.'}
            </p>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                <div className="w-14 h-14 bg-[#448b97]/10 rounded-full flex items-center justify-center">
                  <Check className="w-7 h-7 text-[#448b97]" strokeWidth={3} />
                </div>
                <h4 className="text-[18px] font-bold text-slate-800">{settings.quoteModal?.successTitle || 'Talebiniz Alındı!'}</h4>
                <p className="text-[13px] text-slate-500">{settings.quoteModal?.successDesc || 'En kısa sürede sizinle iletişime geçeceğiz.'}</p>
                <button onClick={() => setSubmitted(false)} className="text-[13px] text-[#448b97] font-semibold hover:underline">
                  Yeni talep gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <input name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Ad Soyad *" required className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#458e9b] focus:bg-white transition-colors text-[14px] text-slate-800 placeholder:text-slate-400" />
                <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="Telefon *" required className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#458e9b] focus:bg-white transition-colors text-[14px] text-slate-800 placeholder:text-slate-400" />
                <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="E-posta" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#458e9b] focus:bg-white transition-colors text-[14px] text-slate-800 placeholder:text-slate-400" />

                <div className="relative">
                  <select name="mekan" value={formData.mekan} onChange={handleChange} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#458e9b] focus:bg-white transition-colors text-[14px] text-slate-600 appearance-none">
                    <option value="">Mekan Türü</option>
                    <option value="Ofis">Ofis</option>
                    <option value="Otel">Otel</option>
                    <option value="Kurumsal">Kurumsal</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>

                <div className="relative">
                  <select name="urun" value={formData.urun} onChange={handleChange} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#458e9b] focus:bg-white transition-colors text-[14px] text-slate-600 appearance-none">
                    <option value="">İlgilendiğiniz Ürün</option>
                    <option value="Stor Perde">Stor Perde</option>
                    <option value="Zebra Perde">Zebra Perde</option>
                    <option value="Ahşap Jaluzi">Ahşap Jaluzi</option>
                    <option value="Alüminyum Jaluzi">Alüminyum Jaluzi</option>
                    <option value="Motorlu Perde Sistemleri">Motorlu Perde Sistemleri</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>

                <textarea name="mesaj" value={formData.mesaj} onChange={handleChange} placeholder="Mesajınız" rows={3} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#458e9b] focus:bg-white transition-colors text-[14px] text-slate-800 placeholder:text-slate-400 resize-none" />

                {error && <p className="text-red-500 text-[13px] font-medium text-center">{error}</p>}

                <button type="submit" disabled={submitting} className="w-full py-4 mt-2 bg-[#1c1c1e] hover:bg-[#2c2c2e] disabled:opacity-60 text-white rounded-xl font-bold tracking-wide text-[15px] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  {submitting ? (
                    <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Gönderiliyor...</>
                  ) : (settings.quoteModal?.formBtnText || 'Teklif Gönder')}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function QuoteModal() {
  return (
    <Suspense fallback={null}>
      <ModalContent />
    </Suspense>
  );
}
