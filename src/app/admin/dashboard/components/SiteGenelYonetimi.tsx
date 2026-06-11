"use client";

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Check, Globe, UploadCloud, Trash2, Bookmark } from 'lucide-react';
import { useSettings, defaultSettings } from '@/contexts/SettingsContext';

const IMGBB_KEY = '51eca7c487b49a21c7f45c86a42093cf';

type LogoField = 'headerLogo' | 'footerLogo';

export default function SiteGenelYonetimi() {
  const { settings, loading } = useSettings();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [logos, setLogos] = useState(settings?.logos || defaultSettings.logos);
  const [siteName, setSiteName] = useState(settings?.logos?.siteName || 'Perdens Perde');

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'site'), { logos: { ...logos, siteName } }, { merge: true });
      alert('Site ayarları başarıyla kaydedildi!');
    } catch {
      alert('Kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: LogoField) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(p => ({ ...p, [field]: true }));
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) setLogos(p => ({ ...p, [field]: data.data.url }));
      else alert('Resim yüklenemedi.');
    } catch {
      alert('Bir hata oluştu.');
    } finally {
      setUploading(p => ({ ...p, [field]: false }));
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline-block" /> Yükleniyor...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold mb-1 tracking-tight">Site Genel & Logolar</h2>
          <p className="text-slate-500 font-medium">Sitenin adını, favicon&apos;ını ve logo görsellerini buradan yönetin.</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-slate-400 text-white px-5 py-3 rounded-xl font-bold transition-all shadow">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Değişiklikleri Kaydet
        </button>
      </div>

      <div className="max-w-4xl space-y-6">

        {/* Site Adı */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-violet-50 text-violet-500 rounded-xl flex items-center justify-center"><Globe size={20} /></div>
            <h3 className="text-lg font-extrabold text-slate-800">Kimlik</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Site / Şirket Adı</label>
              <p className="text-xs text-slate-500 mb-3 font-medium">Tarayıcı sekmesinde ve meta etiketlerde görünür.</p>
              <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)}
                placeholder="Perdens Perde"
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-violet-300 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Logo Yönetimi */}
        {([
          {
            field: 'headerLogo' as LogoField,
            label: 'Header (Üst Menü) Logosu',
            desc: 'Sitenin sağ üst köşesinde görünen koyu arka plan üzerinde kullanılan logo. Koyu/siyah logo kullanın.',
            current: logos.headerLogo,
            fallback: '/koyulogo.png',
            bgClass: 'bg-white'
          },
          {
            field: 'footerLogo' as LogoField,
            label: 'Footer (Alt Bilgi) Logosu',
            desc: 'Sitenin alt kısmındaki koyu arka plan üzerinde görünen logo. Beyaz/açık renkli logo kullanın.',
            current: logos.footerLogo,
            fallback: '/logo.png',
            bgClass: 'bg-zinc-900'
          }
        ]).map(({ field, label, desc, current, fallback, bgClass }) => (
          <div key={field} className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
            <h3 className="text-base font-extrabold text-slate-800 mb-2">{label}</h3>
            <p className="text-xs text-slate-500 font-medium mb-5">{desc}</p>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className={`w-full md:w-64 h-24 ${bgClass} rounded-2xl flex items-center justify-center p-4 border border-slate-200 overflow-hidden`}>
                <img
                  src={current || fallback}
                  alt={label}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <label className="flex items-center justify-center gap-2 bg-white border-2 border-dashed border-slate-300 hover:bg-slate-50 hover:border-violet-400 hover:text-violet-600 text-slate-600 w-full h-12 rounded-xl cursor-pointer font-bold transition-all text-sm">
                  {uploading[field] ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                  {uploading[field] ? 'Yükleniyor...' : 'Yeni Logo Yükle'}
                  <input type="file" className="hidden" accept="image/*" disabled={!!uploading[field]} onChange={(e) => handleLogoUpload(e, field)} />
                </label>
                {current && current !== fallback && (
                  <button onClick={() => setLogos(p => ({ ...p, [field]: fallback }))}
                    className="flex items-center justify-center gap-2 text-sm text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 h-10 rounded-xl font-bold transition-colors">
                    <Trash2 size={14} /> Varsayılana Dön
                  </button>
                )}
                <p className="text-[11px] text-slate-400 font-medium">PNG veya SVG formatı önerilir. Şeffaf arka planlı dosyalar en iyi sonucu verir.</p>
              </div>
            </div>
          </div>
        ))}

        {/* Favicon (Site İkonu) */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center"><Bookmark size={20} /></div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">Site İkonu (Favicon)</h3>
              <p className="text-xs text-slate-500 font-medium">Tarayıcı sekmesinde ve yer imlerinde görünen küçük ikon.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center mt-5">
            {/* Önizleme */}
            <div className="shrink-0">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 text-center">Sekme Önizleme</p>
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 w-48">
                {logos.faviconUrl ? (
                  <img src={logos.faviconUrl} alt="favicon" className="w-4 h-4 object-contain" />
                ) : (
                  <div className="w-4 h-4 bg-slate-300 rounded-sm" />
                )}
                <span className="text-xs font-semibold text-slate-600 truncate">{siteName || 'Perdens Perde'}</span>
              </div>
            </div>

            {/* Yükleme */}
            <div className="flex-1 w-full flex flex-col gap-3">
              <label className={`flex items-center justify-center gap-2 border-2 border-dashed h-12 rounded-xl cursor-pointer font-bold transition-all text-sm ${
                uploading['favicon']
                  ? 'bg-slate-100 text-slate-400 border-slate-200 pointer-events-none'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-600'
              }`}>
                {uploading['favicon'] ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                {uploading['favicon'] ? 'Yükleniyor...' : 'Favicon Yükle'}
                <input type="file" className="hidden"
                  accept="image/png,image/x-icon,image/svg+xml,image/jpeg,image/gif"
                  disabled={!!uploading['favicon']}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    e.target.value = '';
                    setUploading(p => ({ ...p, favicon: true }));
                    try {
                      const fd = new FormData();
                      fd.append('image', file);
                      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: 'POST', body: fd });
                      const data = await res.json();
                      if (data.success) setLogos(p => ({ ...p, faviconUrl: data.data.url }));
                      else alert('Favicon yüklenemedi.');
                    } catch {
                      alert('Bir hata oluştu.');
                    } finally {
                      setUploading(p => ({ ...p, favicon: false }));
                    }
                  }}
                />
              </label>
              {logos.faviconUrl && logos.faviconUrl !== '/favicon.ico' && (
                <button onClick={() => setLogos(p => ({ ...p, faviconUrl: '/favicon.ico' }))}
                  className="flex items-center justify-center gap-2 text-sm text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 h-10 rounded-xl font-bold transition-colors">
                  <Trash2 size={14} /> Varsayılana Dön
                </button>
              )}
              <p className="text-[11px] text-slate-400 font-medium">
                PNG (512×512 px) önerilir. ICO ve SVG de desteklenir. Değişiklik birkaç saniye içinde tarayıcıda güncellenir.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
