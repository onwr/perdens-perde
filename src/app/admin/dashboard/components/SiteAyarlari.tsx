"use client";

import { useEffect, useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Phone, Info, Image as ImageIcon, Loader2, Check, Trash2 } from 'lucide-react';

const IMGBB_KEY = '51eca7c487b49a21c7f45c86a42093cf';

export default function SiteAyarlari() {
  const [siteSettings, setSiteSettings] = useState({
    contact: {
      phone: '0533 691 05 84',
      email: 'info@perdensperde.com',
      address: 'Bulgurlu Mh. Toygar Sitesi No:14/4, Üsküdar / İstanbul',
      workingHours: 'Pzt - Cmt: 09:00 - 19:00\nPazar: Kapalı'
    },
    hakkimizda: {
      heroTitle: 'Hakkımızda',
      heroSubtitle: 'Ofisler, oteller ve prestijli ticari alanlar için estetik, fonksiyonellik ve uzun ömürlülüğü merkeze alan güneş kontrol çözümleri üretiyoruz.',
      aboutTitle: 'Kurumsal Projelerin Güvenilir Çözüm Ortağı',
      aboutText: 'Perdens Perde olarak, perde sistemleri sektöründe yalnızca bir üretici değil, kurumsal projelere mimari estetik ve değer katan bir çözüm ortağı olarak konumlanıyoruz.\n\nGünümüzde ofisler, oteller ve sağlık kurumları için "güneş kontrolü" sadece bir ışık kısma işlemi değil; çalışan verimliliğini, enerji tasarrufunu ve iç mekan ambiyansını doğrudan etkileyen hayati bir faktördür. Bu vizyonla, her projeye özel ve dayanıklı çözümler üretiyoruz.',
      features: ['Projeye Özel Üretim', 'Hızlı Teslimat & Kurulum', 'Geniş Uzman Kadro']
    },
    logos: {
      headerLogo: '/koyulogo.png',
      footerLogo: '/logo.png'
    }
  });

  const [headerLogoUploading, setHeaderLogoUploading] = useState(false);
  const [footerLogoUploading, setFooterLogoUploading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);

  useEffect(() => {
    let active = true;
    getDoc(doc(db, 'settings', 'site')).then((snap) => {
      if (!active) return;
      if (snap.exists()) {
        const data = snap.data();
        setSiteSettings(prev => ({
          contact: { ...prev.contact, ...(data?.contact || {}) },
          hakkimizda: { ...prev.hakkimizda, ...(data?.hakkimizda || {}) },
          logos: { ...prev.logos, ...(data?.logos || {}) },
        }));
      }
      setSettingsLoading(false);
    }).catch(() => {
      if (active) setSettingsLoading(false);
    });
    return () => { active = false; };
  }, []);

  const saveSettings = async () => {
    setSettingsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'site'), siteSettings);
      alert('Ayarlar başarıyla kaydedildi! Değişiklikler site genelinde anlık olarak yansıyacaktır.');
    } catch (e) {
      alert('Kaydedilemedi: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setSettingsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold mb-1 tracking-tight">Site Ayarları</h2>
          <p className="text-slate-500 font-medium">İletişim bilgileri ve sayfa içeriklerini bütün site genelinde anında güncelleyin.</p>
        </div>
        <button
          onClick={saveSettings}
          disabled={settingsSaving || settingsLoading}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-slate-400 text-white px-5 py-3 rounded-xl font-bold transition-all shadow"
        >
          {settingsSaving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
          Değişiklikleri Kaydet
        </button>
      </div>

      {settingsLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={36} className="animate-spin text-slate-400" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* --- Contact Settings --- */}
          <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center"><Phone size={20} /></div>
              <h3 className="text-lg font-extrabold text-slate-800">İletişim Bilgileri</h3>
            </div>
            <p className="text-sm text-slate-500 mb-6">Bu alanı değiştirdiğinizde; Header, Footer, İletişim sayfası ve Teklif Modalı dahil tüm siteyi etkiler.</p>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Telefon Numarası</label>
                <input
                  type="text"
                  value={siteSettings.contact.phone}
                  onChange={(e) => setSiteSettings(p => ({ ...p, contact: { ...p.contact, phone: e.target.value } }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-300/30 focus:border-red-400 transition-all"
                  placeholder="0533 691 05 84"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">E-Posta Adresi</label>
                <input
                  type="email"
                  value={siteSettings.contact.email}
                  onChange={(e) => setSiteSettings(p => ({ ...p, contact: { ...p.contact, email: e.target.value } }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-300/30 focus:border-red-400 transition-all"
                  placeholder="info@perdensperde.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Adres</label>
                <textarea
                  rows={2}
                  value={siteSettings.contact.address}
                  onChange={(e) => setSiteSettings(p => ({ ...p, contact: { ...p.contact, address: e.target.value } }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-300/30 focus:border-red-400 transition-all resize-none"
                  placeholder="Bulgurlu Mh. ..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Çalışma Saatleri</label>
                <textarea
                  rows={2}
                  value={siteSettings.contact.workingHours}
                  onChange={(e) => setSiteSettings(p => ({ ...p, contact: { ...p.contact, workingHours: e.target.value } }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-300/30 focus:border-red-400 transition-all resize-none"
                  placeholder="Pzt - Cmt: 09:00 - 19:00"
                />
              </div>
            </div>
          </div>

          {/* --- Hakkimizda Settings --- */}
          <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Info size={20} /></div>
              <h3 className="text-lg font-extrabold text-slate-800">Hakkımızda Sayfası</h3>
            </div>
            <p className="text-sm text-slate-500 mb-6">Hakkımızda sayfasındaki hero başlığı, açıklama ve kurumsal metin alanını güncelleyin.</p>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hero Başlığı</label>
                <input
                  type="text"
                  value={siteSettings.hakkimizda.heroTitle}
                  onChange={(e) => setSiteSettings(p => ({ ...p, hakkimizda: { ...p.hakkimizda, heroTitle: e.target.value } }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300/30 focus:border-blue-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hero Alt Yazısı</label>
                <textarea
                  rows={3}
                  value={siteSettings.hakkimizda.heroSubtitle}
                  onChange={(e) => setSiteSettings(p => ({ ...p, hakkimizda: { ...p.hakkimizda, heroSubtitle: e.target.value } }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300/30 focus:border-blue-400 transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Bölüm Başlığı ("Biz Kimiz")</label>
                <input
                  type="text"
                  value={siteSettings.hakkimizda.aboutTitle}
                  onChange={(e) => setSiteSettings(p => ({ ...p, hakkimizda: { ...p.hakkimizda, aboutTitle: e.target.value } }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300/30 focus:border-blue-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Kurumsal Metin</label>
                <textarea
                  rows={5}
                  value={siteSettings.hakkimizda.aboutText}
                  onChange={(e) => setSiteSettings(p => ({ ...p, hakkimizda: { ...p.hakkimizda, aboutText: e.target.value } }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300/30 focus:border-blue-400 transition-all resize-none"
                  placeholder="Hakkımızda sayfasındaki ana metin..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Checkmark Maddeleri (her satır = 1 madde)</label>
                <textarea
                  rows={3}
                  value={siteSettings.hakkimizda.features.join('\n')}
                  onChange={(e) => setSiteSettings(p => ({ ...p, hakkimizda: { ...p.hakkimizda, features: e.target.value.split('\n').filter(Boolean) } }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300/30 focus:border-blue-400 transition-all resize-none"
                  placeholder="Projeye Özel Üretim\nHızlı Teslimat\nUzman Kadro"
                />
              </div>
            </div>
          </div>

          {/* --- Logo Settings --- */}
          <div className="bg-white rounded-[24px] p-8 border border-slate-200 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><ImageIcon size={20} /></div>
              <h3 className="text-lg font-extrabold text-slate-800">Site Logoları</h3>
            </div>
            <p className="text-sm text-slate-500 mb-6">Sitenizin üst menüsündeki ve alt footer bölümündeki logoları değiştirebilirsiniz.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Header Logo */}
              <div className="flex flex-col gap-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Üst Menü Logosu (Header)</label>
                <div className="relative w-full h-32 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden">
                  <img src={siteSettings.logos?.headerLogo || '/koyulogo.png'} alt="Header Logo" className="max-h-20 object-contain" />
                  {headerLogoUploading && (
                    <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                      <Loader2 size={32} className="animate-spin text-emerald-500" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-bold text-sm cursor-pointer transition-all border ${headerLogoUploading ? 'bg-slate-100 text-slate-400 border-slate-200 pointer-events-none' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}>
                    <ImageIcon size={16} />
                    Yeni Logo Yükle
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={headerLogoUploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        e.target.value = '';
                        setHeaderLogoUploading(true);
                        try {
                          const fd = new FormData();
                          fd.append('image', file);
                          const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: 'POST', body: fd });
                          const data = await res.json();
                          if (data.success) {
                            setSiteSettings(p => ({ ...p, logos: { ...p.logos, headerLogo: data.data.url } as any }));
                          } else {
                            alert('Resim yüklenemedi.');
                          }
                        } catch {
                          alert('Yükleme sırasında hata oluştu.');
                        } finally {
                          setHeaderLogoUploading(false);
                        }
                      }}
                    />
                  </label>
                  {(siteSettings.logos?.headerLogo && siteSettings.logos.headerLogo !== '/koyulogo.png') && (
                    <button
                      onClick={() => setSiteSettings(p => ({ ...p, logos: { ...p.logos, headerLogo: '/koyulogo.png' } as any }))}
                      className="w-11 h-11 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all shrink-0"
                      title="Varsayılana dön"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Footer Logo */}
              <div className="flex flex-col gap-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Alt Menü Logosu (Footer)</label>
                <div className="relative w-full h-32 bg-[#1c1c1e] border border-slate-800 rounded-xl flex items-center justify-center overflow-hidden">
                  <img src={siteSettings.logos?.footerLogo || '/logo.png'} alt="Footer Logo" className="max-h-20 object-contain brightness-0 invert opacity-90" />
                  {footerLogoUploading && (
                    <div className="absolute inset-0 bg-[#1c1c1e]/80 flex flex-col items-center justify-center">
                      <Loader2 size={32} className="animate-spin text-white" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-bold text-sm cursor-pointer transition-all border ${footerLogoUploading ? 'bg-slate-100 text-slate-400 border-slate-200 pointer-events-none' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}>
                    <ImageIcon size={16} />
                    Yeni Logo Yükle
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={footerLogoUploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        e.target.value = '';
                        setFooterLogoUploading(true);
                        try {
                          const fd = new FormData();
                          fd.append('image', file);
                          const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: 'POST', body: fd });
                          const data = await res.json();
                          if (data.success) {
                            setSiteSettings(p => ({ ...p, logos: { ...p.logos, footerLogo: data.data.url } as any }));
                          } else {
                            alert('Resim yüklenemedi.');
                          }
                        } catch {
                          alert('Yükleme sırasında hata oluştu.');
                        } finally {
                          setFooterLogoUploading(false);
                        }
                      }}
                    />
                  </label>
                  {(siteSettings.logos?.footerLogo && siteSettings.logos.footerLogo !== '/logo.png') && (
                    <button
                      onClick={() => setSiteSettings(p => ({ ...p, logos: { ...p.logos, footerLogo: '/logo.png' } as any }))}
                      className="w-11 h-11 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all shrink-0"
                      title="Varsayılana dön"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
