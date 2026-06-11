"use client";

import { useEffect, useState, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Check, Image as ImageIcon, Trash2, Plus, ChevronDown, ChevronRight, Palette } from 'lucide-react';
import { categoriesData } from '@/data/categories';
import { useSettings } from '@/contexts/SettingsContext';

const IMGBB_KEY = '51eca7c487b49a21c7f45c86a42093cf';
const FONT_OPTIONS = ['Manrope', 'Inter', 'Roboto', 'Playfair Display', 'Outfit', 'Montserrat', 'Poppins', 'Georgia', 'Times New Roman'];

type SectionKey = 'banner' | 'hero_buttons' | 'content' | 'variants' | 'usage' | 'gallery' | 'cta';

const EMPTY_DATA = {
  image: '',
  title: '',
  shortDesc: '',
  // Hero Styles
  heroTitleFont: '',
  heroTitleColor: '',
  heroTitleSizeDesktop: '',
  heroTitleSizeMobile: '',
  heroSubtitleFont: '',
  heroSubtitleColor: '',
  heroSubtitleSizeDesktop: '',
  heroSubtitleSizeMobile: '',
  heroPrimaryBtnText: '',
  heroPrimaryBtnColor: '',
  heroPrimaryBtnTextColor: '',
  heroSecondaryBtnText: '',
  // Content Styles
  contentTitle: '',
  fullDesc: '',
  contentExtraText: '',
  contentBgColor: '',
  contentHeadingFont: '',
  contentHeadingColor: '',
  contentHeadingSizeDesktop: '',
  contentHeadingSizeMobile: '',
  contentTextFont: '',
  contentTextColor: '',
  contentTextSizeDesktop: '',
  contentTextSizeMobile: '',
  // Variants
  variants: [] as string[],
  variantsTitle: '',
  variantsSubtitle: '',
  variantsColor: '',
  variantsTitleFont: '',
  variantsTitleColor: '',
  variantsTitleSizeDesktop: '',
  variantsTitleSizeMobile: '',
  variantsSubtitleFont: '',
  variantsSubtitleColor: '',
  variantsSubtitleSizeDesktop: '',
  variantsSubtitleSizeMobile: '',
  // Usage
  usageTitle: '',
  usageDesc: '',
  usageBgColor: '',
  usageImage: '',
  usageTitleFont: '',
  usageTitleColor: '',
  usageTitleSizeDesktop: '',
  usageTitleSizeMobile: '',
  usageDescFont: '',
  usageDescColor: '',
  usageDescSizeDesktop: '',
  usageDescSizeMobile: '',
  usageCardTitleColor: '',
  usageCardDescColor: '',
  usageAreas: [] as { title: string; desc: string }[],
  // Gallery
  galleryTitle: '',
  galleryDesc: '',
  galleryLabels: [] as string[],
  galleryBgColor: '',
  galleryTitleFont: '',
  galleryTitleColor: '',
  galleryTitleSizeDesktop: '',
  galleryTitleSizeMobile: '',
  galleryDescFont: '',
  galleryDescColor: '',
  galleryDescSizeDesktop: '',
  galleryDescSizeMobile: '',
  // CTA
  ctaImage: '',
  ctaTitle: '',
  ctaDesc: '',
  ctaOverlayColor: '',
  ctaPrimaryBtnText: '',
  ctaPrimaryBtnColor: '',
  ctaPrimaryBtnTextColor: '',
  ctaSecondaryBtnText: '',
  ctaTitleFont: '',
  ctaTitleColor: '',
  ctaTitleSizeDesktop: '',
  ctaTitleSizeMobile: '',
  ctaDescFont: '',
  ctaDescColor: '',
  ctaDescSizeDesktop: '',
  ctaDescSizeMobile: '',
};

type DataType = typeof EMPTY_DATA;

/* ─── Yardımcı bileşenler — COMPONENT DIŞINDA tanımlı (focus sorunu önlenir) ─── */

const inputCls = "w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-blue-300 outline-none text-sm";
const textareaCls = "w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-blue-300 outline-none resize-none text-sm";

function Section({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: SectionKey;
  title: string;
  open: boolean;
  onToggle: (id: SectionKey) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden">
      <button type="button" onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
        <span className="font-extrabold text-slate-800">{title}</span>
        {open ? <ChevronDown size={18} className="text-slate-500" /> : <ChevronRight size={18} className="text-slate-400" />}
      </button>
      {open && <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-5">{children}</div>}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-slate-400 font-medium mb-2">{hint}</p>}
      {children}
    </div>
  );
}

function FontField({
  label,
  value,
  fieldKey,
  onChange,
}: {
  label: string;
  value: string;
  fieldKey: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
      <select
        key={`font-select-${fieldKey}`}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-blue-300 outline-none text-sm appearance-none cursor-pointer"
      >
        <option value="">Varsayılan (Tema)</option>
        {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
      </select>
    </div>
  );
}

function ColorField({
  label,
  value,
  fieldKey,
  onChange,
}: {
  label: string;
  value: string;
  fieldKey: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
      <div className="flex items-center gap-3 h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="relative w-7 h-7 rounded-md overflow-hidden border border-slate-300 shrink-0 shadow-sm">
          <input
            key={`color-picker-${fieldKey}`}
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
          />
          <div className="w-full h-full rounded-md" style={{ backgroundColor: value || '#000000' }} />
        </div>
        <input
          key={`color-text-${fieldKey}`}
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent font-mono text-sm text-slate-700 outline-none uppercase"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

function SizePairField({
  label,
  desktopValue,
  mobileValue,
  fieldKey,
  onDesktopChange,
  onMobileChange,
}: {
  label: string;
  desktopValue: string;
  mobileValue: string;
  fieldKey: string;
  onDesktopChange: (v: string) => void;
  onMobileChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Masaüstü</span>
          <input
            key={`size-desktop-${fieldKey}`}
            type="text"
            value={desktopValue}
            onChange={(e) => onDesktopChange(e.target.value)}
            className="w-full h-11 pl-[82px] pr-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-700 outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Örn: 44px"
          />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Mobil</span>
          <input
            key={`size-mobile-${fieldKey}`}
            type="text"
            value={mobileValue}
            onChange={(e) => onMobileChange(e.target.value)}
            className="w-full h-11 pl-[54px] pr-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-700 outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Örn: 28px"
          />
        </div>
      </div>
    </div>
  );
}

/* ─── ANA BİLEŞEN ─── */

export default function KategoriIcerik() {
  const { settings } = useSettings();
  const allCats = (() => {
    const c = settings.homeCategories?.cards;
    if (c && c.length > 0) return c.map(x => ({ slug: x.slug, title: x.title }));
    return categoriesData.map(x => ({ slug: x.slug, title: x.title }));
  })();

  const [catSlug, setCatSlug] = useState<string>(allCats[0]?.slug || 'stor-perde');
  const [data, setData] = useState<DataType>({ ...EMPTY_DATA });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    banner: true, hero_buttons: false, content: false, variants: false, usage: false, gallery: false, cta: false
  });

  useEffect(() => {
    let cancelled = false;
    setLoadingData(true);
    const fetchContent = async () => {
      try {
        const fallback = categoriesData.find(c => c.slug === catSlug);
        const snap = await getDoc(doc(db, 'categories_content', catSlug));
        if (cancelled) return;

        const fb = fallback || {};
        const d = snap.exists() ? JSON.parse(JSON.stringify(snap.data())) : {};
        setData({
          ...EMPTY_DATA,
          ...(fb as any),
          ...d,
          // Ensure arrays are handled if they don't exist in d
          variants: d.variants || (fb as any).variants || [],
          usageAreas: d.usageAreas || (fb as any).usageAreas || [],
          galleryLabels: d.galleryLabels || (fb as any).galleryLabels || [],
        });
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoadingData(false);
      }
    };
    fetchContent();
    return () => { cancelled = true; };
  }, [catSlug]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const plainData = JSON.parse(JSON.stringify(data));
      await setDoc(doc(db, 'categories_content', catSlug), plainData);
      alert(`"${catSlug}" için içerikler başarıyla kaydedildi!`);
    } catch {
      alert('Kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'ctaImage' | 'usageImage') => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success) setData(p => ({ ...p, [field]: json.data.url }));
      else alert('Resim yüklenemedi.');
    } catch {
      alert('Yükleme hatası.');
    } finally {
      setUploading(false);
    }
  };

  const toggle = useCallback((s: SectionKey) => setOpenSections(p => ({ ...p, [s]: !p[s] })), []);

  // Tip-safe setter
  const set = useCallback(<K extends keyof DataType>(field: K, value: DataType[K]) => {
    setData(p => ({ ...p, [field]: value }));
  }, []);

  if (loadingData && !data.title) return (
    <div className="p-16 text-center">
      <Loader2 className="animate-spin inline-block text-blue-500 mb-3" size={32} />
      <p className="text-slate-500 font-medium">Kategori verileri yükleniyor...</p>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold mb-1 tracking-tight">Kategori İçerik Yönetimi</h2>
          <p className="text-slate-500 font-medium">Kategori detay sayfasındaki tüm içerikleri düzenleyin.</p>
        </div>
        <button onClick={handleSave} disabled={saving || loadingData}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-slate-300 text-white px-5 py-3 rounded-xl font-bold transition-all shadow">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Değişiklikleri Kaydet
        </button>
      </div>

      {/* Kategori Seçici */}
      <div className="bg-white rounded-[20px] border border-slate-200 shadow-sm p-5 mb-6 flex items-center gap-4">
        <label className="font-extrabold text-slate-800 shrink-0 text-sm">Düzenlenecek Kategori:</label>
        <div className="relative flex-1 max-w-xs">
          <select value={catSlug} onChange={(e) => setCatSlug(e.target.value)}
            disabled={loadingData || saving}
            className="w-full h-11 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-300/30 cursor-pointer disabled:opacity-50 text-sm">
            {allCats.map(c => <option key={c.slug} value={c.slug}>{c.title}</option>)}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronDown size={14} />
          </div>
        </div>
        {loadingData && <Loader2 size={18} className="animate-spin text-blue-500" />}
      </div>

      {/* İçerik Bölümleri */}
      <div className="max-w-4xl space-y-4">

        {/* 1. Banner */}
        <Section id="banner" title="1. Kapak Görseli, Başlık & Kısa Açıklama" open={openSections.banner} onToggle={toggle}>
          <div className="relative w-full h-48 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
            {data.image
              ? <img src={data.image} alt="Banner" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2"><ImageIcon size={28} /><span className="text-sm font-medium">Görsel yüklenmemiş</span></div>
            }
            {data.image && (
              <span className={`absolute top-3 left-3 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow ${data.image.startsWith('http') ? 'bg-emerald-500' : 'bg-slate-400'}`}>
                {data.image.startsWith('http') ? 'Özel Görsel' : 'Varsayılan'}
              </span>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                <Loader2 size={28} className="animate-spin text-blue-500 mb-2" />
                <span className="text-sm font-bold text-slate-600">Yükleniyor...</span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <label className={`flex items-center gap-2 h-11 px-4 rounded-xl font-bold text-sm cursor-pointer transition-all border flex-1 justify-center ${uploading ? 'bg-slate-100 text-slate-400 border-slate-200 pointer-events-none' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'}`}>
              <ImageIcon size={15} /> Görsel Yükle
              <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => handleImageUpload(e, 'image')} />
            </label>
            {data.image && data.image.startsWith('http') && (
              <button onClick={() => { const fb = categoriesData.find(c => c.slug === catSlug); setData(p => ({ ...p, image: fb?.image || '' })); }}
                className="h-11 w-11 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all" title="Varsayılana dön">
                <Trash2 size={15} />
              </button>
            )}
          </div>
          <Field label="Sayfa Başlığı" hint="Büyük harflerle banner üzerinde görünür.">
            <input key={`title-${catSlug}`} type="text" value={data.title} onChange={e => set('title', e.target.value)} className={inputCls} placeholder="Stor Perde Sistemleri" />
          </Field>
          <Field label="Kısa Açıklama (Banner Altı)" hint="Başlığın hemen altında küçük yazıyla görünür.">
            <textarea key={`shortDesc-${catSlug}`} value={data.shortDesc} onChange={e => set('shortDesc', e.target.value)} rows={3} className={textareaCls} />
          </Field>

          <div className="pt-4 mt-2 border-t border-slate-100 space-y-6">
            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Başlık Stili</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FontField label="Başlık Yazı Tipi" fieldKey={`heroTitleFont-${catSlug}`} value={data.heroTitleFont} onChange={v => set('heroTitleFont', v)} />
              <ColorField label="Başlık Rengi" fieldKey={`heroTitleColor-${catSlug}`} value={data.heroTitleColor} onChange={v => set('heroTitleColor', v)} />
            </div>
            <SizePairField label="Başlık Boyutu" fieldKey={`heroTitleSize-${catSlug}`}
              desktopValue={data.heroTitleSizeDesktop} mobileValue={data.heroTitleSizeMobile}
              onDesktopChange={v => set('heroTitleSizeDesktop', v)} onMobileChange={v => set('heroTitleSizeMobile', v)} />
            
            <div className="pt-4 border-t border-slate-100 space-y-6">
              <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Alt Başlık Stili</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FontField label="Alt Başlık Yazı Tipi" fieldKey={`heroSubtitleFont-${catSlug}`} value={data.heroSubtitleFont} onChange={v => set('heroSubtitleFont', v)} />
                <ColorField label="Alt Başlık Rengi" fieldKey={`heroSubtitleColor-${catSlug}`} value={data.heroSubtitleColor} onChange={v => set('heroSubtitleColor', v)} />
              </div>
              <SizePairField label="Alt Başlık Boyutu" fieldKey={`heroSubtitleSize-${catSlug}`}
                desktopValue={data.heroSubtitleSizeDesktop} mobileValue={data.heroSubtitleSizeMobile}
                onDesktopChange={v => set('heroSubtitleSizeDesktop', v)} onMobileChange={v => set('heroSubtitleSizeMobile', v)} />
            </div>
          </div>
        </Section>

        {/* 2. Hero Butonları */}
        <Section id="hero_buttons" title="2. Hero Bölümü Butonları" open={openSections.hero_buttons} onToggle={toggle}>
          <p className="text-xs text-slate-500 font-medium -mt-2 pb-2">Banner üzerindeki iki butonun metnini, arka plan rengini ve yazı rengini ayarlayın.</p>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
            <p className="text-sm font-extrabold text-slate-700">Birincil Buton (Teklif Al)</p>
            <Field label="Buton Metni">
              <input type="text" value={data.heroPrimaryBtnText} onChange={e => set('heroPrimaryBtnText', e.target.value)} className={inputCls} placeholder="Ücretsiz Teklif Al" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ColorField label="Arka Plan Rengi" fieldKey={`heroPrimaryBtnColor-${catSlug}`} value={data.heroPrimaryBtnColor} onChange={v => set('heroPrimaryBtnColor', v)} />
              <ColorField label="Yazı Rengi" fieldKey={`heroPrimaryBtnTextColor-${catSlug}`} value={data.heroPrimaryBtnTextColor} onChange={v => set('heroPrimaryBtnTextColor', v)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Önizleme:</span>
              <span className="px-4 py-2 rounded-lg text-sm font-bold shadow-sm"
                style={{ backgroundColor: data.heroPrimaryBtnColor || '#ef4444', color: data.heroPrimaryBtnTextColor || '#ffffff' }}>
                {data.heroPrimaryBtnText || 'Ücretsiz Teklif Al'}
              </span>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
            <p className="text-sm font-extrabold text-slate-700">İkincil Buton (Ara)</p>
            <Field label="Buton Metni">
              <input type="text" value={data.heroSecondaryBtnText} onChange={e => set('heroSecondaryBtnText', e.target.value)} className={inputCls} placeholder="Hemen Ara" />
            </Field>
          </div>
        </Section>

        {/* 3. İçerik */}
        <Section id="content" title="3. Ana İçerik Bölümü" open={openSections.content} onToggle={toggle}>
          <Field label="Bölüm Başığı" hint="İçerik alanının ana büyük başlığı. Boş bırakırsanız Kapak Başlığı gösterilir.">
            <input key={`contentTitle-${catSlug}`} type="text" value={data.contentTitle || ''} onChange={e => set('contentTitle', e.target.value)} className={inputCls} placeholder="Kategori İnceleme Başlığı" />
          </Field>
          <Field label="Detaylı Açıklama" hint="Sayfanın orta kısmındaki detaylı açıklama metni.">
            <textarea key={`fullDesc-${catSlug}`} value={data.fullDesc} onChange={e => set('fullDesc', e.target.value)} rows={5} className={textareaCls} />
          </Field>
          <Field label="Alt Ek Metin" hint="Açıklamanın hemen altında görünen vurgulu metin.">
            <textarea key={`contentExtraText-${catSlug}`} value={data.contentExtraText} onChange={e => set('contentExtraText', e.target.value)} rows={2} className={textareaCls} />
          </Field>
          <div className="pt-4 mt-2 border-t border-slate-100 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <ColorField label="Bölüm Arka Plan Rengi" fieldKey={`contentBgColor-${catSlug}`} value={data.contentBgColor} onChange={v => set('contentBgColor', v)} />
               <div />
            </div>
            
            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pt-2">Başlık Stili</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FontField label="Başlık Yazı Tipi" fieldKey={`contentHeadingFont-${catSlug}`} value={data.contentHeadingFont} onChange={v => set('contentHeadingFont', v)} />
              <ColorField label="Başlık Rengi" fieldKey={`contentHeadingColor-${catSlug}`} value={data.contentHeadingColor} onChange={v => set('contentHeadingColor', v)} />
            </div>
            <SizePairField label="Başlık Boyutu" fieldKey={`contentHeadingSize-${catSlug}`}
              desktopValue={data.contentHeadingSizeDesktop} mobileValue={data.contentHeadingSizeMobile}
              onDesktopChange={v => set('contentHeadingSizeDesktop', v)} onMobileChange={v => set('contentHeadingSizeMobile', v)} />

            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pt-4 border-t border-slate-100">Metin Stili</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FontField label="Metin Yazı Tipi" fieldKey={`contentTextFont-${catSlug}`} value={data.contentTextFont} onChange={v => set('contentTextFont', v)} />
              <ColorField label="Metin Rengi" fieldKey={`contentTextColor-${catSlug}`} value={data.contentTextColor} onChange={v => set('contentTextColor', v)} />
            </div>
            <SizePairField label="Metin Boyutu" fieldKey={`contentTextSize-${catSlug}`}
              desktopValue={data.contentTextSizeDesktop} mobileValue={data.contentTextSizeMobile}
              onDesktopChange={v => set('contentTextSizeDesktop', v)} onMobileChange={v => set('contentTextSizeMobile', v)} />
          </div>
        </Section>

        {/* 4. Varyantlar */}
        <Section id="variants" title="4. Ürün Varyantları (Etiketler)" open={openSections.variants} onToggle={toggle}>
          <p className="text-xs text-slate-500 font-medium -mt-2">Sayfada oval etiket kutucukları olarak listelenir.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
             <ColorField label="Etiket Baloncuğu Rengi" fieldKey={`variantsColor-${catSlug}`} value={data.variantsColor} onChange={v => set('variantsColor', v)} />
             <div />
          </div>
          <div className="space-y-4 mb-6">
            <Field label="Varyant Bölümü Başlığı" hint="Modeller listesinin üzerindeki başlık.">
              <input key={`variantsTitle-${catSlug}`} type="text" value={data.variantsTitle} onChange={e => set('variantsTitle', e.target.value)} className={inputCls} placeholder="Ürün Modellerimiz" />
            </Field>
            <Field label="Varyant Bölümü Alt Metni">
              <input key={`variantsSubtitle-${catSlug}`} type="text" value={data.variantsSubtitle} onChange={e => set('variantsSubtitle', e.target.value)} className={inputCls} placeholder="Farklı dekorasyon stillerine uygun modellerimiz:" />
            </Field>
          </div>
          <div className="space-y-2">
            {data.variants.map((v, i) => (
              <div key={`variant-row-${catSlug}-${i}`} className="flex items-center gap-2">
                <input
                  key={`variant-input-${catSlug}-${i}`}
                  type="text"
                  value={v}
                  onChange={e => { const arr = [...data.variants]; arr[i] = e.target.value; setData(p => ({ ...p, variants: arr })); }}
                  className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-300" />
                <button onClick={() => { const arr = [...data.variants]; arr.splice(i, 1); setData(p => ({ ...p, variants: arr })); }}
                  className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 shrink-0"><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
          <button onClick={() => setData(p => ({ ...p, variants: [...p.variants, ''] }))}
            className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-colors">
            <Plus size={14} /> Varyant Ekle
          </button>
          
          <div className="pt-4 mt-6 border-t border-slate-100 space-y-6">
            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pt-2">Varyant Başlık Stili</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FontField label="Yazı Tipi" fieldKey={`variantsTitleFont-${catSlug}`} value={data.variantsTitleFont} onChange={v => set('variantsTitleFont', v)} />
              <ColorField label="Renk" fieldKey={`variantsTitleColor-${catSlug}`} value={data.variantsTitleColor} onChange={v => set('variantsTitleColor', v)} />
            </div>
            <SizePairField label="Boyut" fieldKey={`variantsTitleSize-${catSlug}`} desktopValue={data.variantsTitleSizeDesktop} mobileValue={data.variantsTitleSizeMobile} onDesktopChange={v => set('variantsTitleSizeDesktop', v)} onMobileChange={v => set('variantsTitleSizeMobile', v)} />

            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pt-4 border-t border-slate-100">Varyant Alt Metin Stili</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FontField label="Yazı Tipi" fieldKey={`variantsSubtitleFont-${catSlug}`} value={data.variantsSubtitleFont} onChange={v => set('variantsSubtitleFont', v)} />
              <ColorField label="Renk" fieldKey={`variantsSubtitleColor-${catSlug}`} value={data.variantsSubtitleColor} onChange={v => set('variantsSubtitleColor', v)} />
            </div>
            <SizePairField label="Boyut" fieldKey={`variantsSubtitleSize-${catSlug}`} desktopValue={data.variantsSubtitleSizeDesktop} mobileValue={data.variantsSubtitleSizeMobile} onDesktopChange={v => set('variantsSubtitleSizeDesktop', v)} onMobileChange={v => set('variantsSubtitleSizeMobile', v)} />
          </div>
        </Section>

        {/* 5. Kullanım Alanları */}
        <Section id="usage" title="5. Kullanım Alanları" open={openSections.usage} onToggle={toggle}>
          <Field label="Bölüm Arka Plan Görseli" hint="Kullanım alanları bölümünün arka planında görünecek görsel. (Seçilmezse düz renk kullanılır)">
            <div className="relative w-full h-32 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 mb-3">
              {data.usageImage
                ? <img src={data.usageImage} alt="Usage Background" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2"><ImageIcon size={24} /><span className="text-xs font-medium">Arka plan görseli yok</span></div>
              }
              {uploading && (
                <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                  <Loader2 size={24} className="animate-spin text-blue-500 mb-2" />
                </div>
              )}
            </div>
            <div className="flex gap-3 mb-4">
              <label htmlFor={`usage-image-upload-${catSlug}`} className={`flex items-center gap-2 h-10 px-4 rounded-xl font-bold text-xs cursor-pointer transition-all border flex-1 justify-center ${uploading ? 'bg-slate-100 text-slate-400 border-slate-200 pointer-events-none' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'}`}>
                <ImageIcon size={14} /> Görsel Yükle
              </label>
              <input id={`usage-image-upload-${catSlug}`} type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => handleImageUpload(e, 'usageImage')} />
              {data.usageImage && (
                <button onClick={() => setData(p => ({ ...p, usageImage: '' }))}
                  className="h-10 w-10 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center" title="Temizle">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <ColorField label="Bölüm Arka Plan Rengi (Opsiyonel)" fieldKey={`usageBgColor-${catSlug}`} value={data.usageBgColor} onChange={v => set('usageBgColor', v)} />
          </div>
          <div className="space-y-4 mt-4">
            <Field label="Bölüm Başlığı" hint="Örn: Ofis ve İş Merkezi Kullanımı">
              <input key={`usageTitle-${catSlug}`} type="text" value={data.usageTitle} onChange={e => set('usageTitle', e.target.value)} className={inputCls} placeholder="Kullanım Alanları" />
            </Field>
            <Field label="Bölüm Açıklama Metni">
              <textarea key={`usageDesc-${catSlug}`} value={data.usageDesc} onChange={e => set('usageDesc', e.target.value)} rows={3} className={textareaCls} />
            </Field>
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700">Kullanım Alanı Kartları</label>
              {data.usageAreas.map((area, i) => (
                <div key={`usage-card-${catSlug}-${i}`} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative">
                  <button onClick={() => { const arr = [...data.usageAreas]; arr.splice(i, 1); setData(p => ({ ...p, usageAreas: arr })); }}
                    className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 shrink-0"><Trash2 size={12} /></button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-10">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Alan Başlığı</label>
                      <input
                        key={`usage-title-${catSlug}-${i}`}
                        type="text"
                        value={area.title}
                        onChange={e => { const arr = [...data.usageAreas]; arr[i] = { ...arr[i], title: e.target.value }; setData(p => ({ ...p, usageAreas: arr })); }}
                        className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-300" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Açıklama</label>
                      <input
                        key={`usage-desc-${catSlug}-${i}`}
                        type="text"
                        value={area.desc}
                        onChange={e => { const arr = [...data.usageAreas]; arr[i] = { ...arr[i], desc: e.target.value }; setData(p => ({ ...p, usageAreas: arr })); }}
                        className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-300" />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => setData(p => ({ ...p, usageAreas: [...p.usageAreas, { title: '', desc: '' }] }))}
                className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-colors">
                <Plus size={14} /> Kullanım Alanı Ekle
              </button>
            </div>
          </div>
          
          <div className="pt-4 mt-6 border-t border-slate-100 space-y-6">
            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pt-2">Bölüm Başlık Stili</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FontField label="Yazı Tipi" fieldKey={`usageTitleFont-${catSlug}`} value={data.usageTitleFont} onChange={v => set('usageTitleFont', v)} />
              <ColorField label="Renk" fieldKey={`usageTitleColor-${catSlug}`} value={data.usageTitleColor} onChange={v => set('usageTitleColor', v)} />
            </div>
            <SizePairField label="Boyut" fieldKey={`usageTitleSize-${catSlug}`} desktopValue={data.usageTitleSizeDesktop} mobileValue={data.usageTitleSizeMobile} onDesktopChange={v => set('usageTitleSizeDesktop', v)} onMobileChange={v => set('usageTitleSizeMobile', v)} />

            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pt-4 border-t border-slate-100">Bölüm Açıklama Stili</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FontField label="Yazı Tipi" fieldKey={`usageDescFont-${catSlug}`} value={data.usageDescFont} onChange={v => set('usageDescFont', v)} />
              <ColorField label="Renk" fieldKey={`usageDescColor-${catSlug}`} value={data.usageDescColor} onChange={v => set('usageDescColor', v)} />
            </div>
            <SizePairField label="Boyut" fieldKey={`usageDescSize-${catSlug}`} desktopValue={data.usageDescSizeDesktop} mobileValue={data.usageDescSizeMobile} onDesktopChange={v => set('usageDescSizeDesktop', v)} onMobileChange={v => set('usageDescSizeMobile', v)} />

            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pt-4 border-t border-slate-100">Kullanım Alanı Kartları Stili</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorField label="Kart Başlıkları Rengi" fieldKey={`usageCardTitleColor-${catSlug}`} value={data.usageCardTitleColor} onChange={v => set('usageCardTitleColor', v)} />
              <ColorField label="Kart Açıklamaları Rengi" fieldKey={`usageCardDescColor-${catSlug}`} value={data.usageCardDescColor} onChange={v => set('usageCardDescColor', v)} />
            </div>
          </div>
        </Section>

        {/* 6. Galeri */}
        <Section id="gallery" title="6. Uygulama Galerisi" open={openSections.gallery} onToggle={toggle}>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
             <ColorField label="Bölüm Arka Plan Rengi" fieldKey={`galleryBgColor-${catSlug}`} value={data.galleryBgColor} onChange={v => set('galleryBgColor', v)} />
           </div>
          <div className="space-y-4 mt-6">
            <Field label="Galeri Bölümü Başlığı">
              <input key={`galleryTitle-${catSlug}`} type="text" value={data.galleryTitle} onChange={e => set('galleryTitle', e.target.value)} className={inputCls} placeholder="Tamamladığımız Uygulama Örnekleri" />
            </Field>
            <Field label="Galeri Bölümü Açıklaması">
              <textarea key={`galleryDesc-${catSlug}`} value={data.galleryDesc} onChange={e => set('galleryDesc', e.target.value)} rows={2} className={textareaCls} />
            </Field>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Fotoğraf Üzerindeki Etiketler (en fazla 6)</label>
              {(data.galleryLabels.length === 0 ? ['', '', '', '', '', ''] : data.galleryLabels).map((lbl, i) => (
                <div key={`gallery-label-row-${catSlug}-${i}`} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 w-5 shrink-0">{i + 1}.</span>
                  <input
                    key={`gallery-label-input-${catSlug}-${i}`}
                    type="text"
                    value={data.galleryLabels[i] || ''}
                    onChange={e => { const arr = [...(data.galleryLabels.length === 0 ? ['', '', '', '', '', ''] : data.galleryLabels)]; arr[i] = e.target.value; setData(p => ({ ...p, galleryLabels: arr })); }}
                    placeholder={`Görsel ${i + 1} etiketi`}
                    className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
              ))}
            </div>
            <div className="pt-4 mt-6 border-t border-slate-100 space-y-6">
              <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pt-2">Galeri Başlık Stili</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FontField label="Yazı Tipi" fieldKey={`galleryTitleFont-${catSlug}`} value={data.galleryTitleFont} onChange={v => set('galleryTitleFont', v)} />
                 <ColorField label="Renk" fieldKey={`galleryTitleColor-${catSlug}`} value={data.galleryTitleColor} onChange={v => set('galleryTitleColor', v)} />
              </div>
              <SizePairField label="Boyut" fieldKey={`galleryTitleSize-${catSlug}`} desktopValue={data.galleryTitleSizeDesktop} mobileValue={data.galleryTitleSizeMobile} onDesktopChange={v => set('galleryTitleSizeDesktop', v)} onMobileChange={v => set('galleryTitleSizeMobile', v)} />

              <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pt-4 border-t border-slate-100">Galeri Açıklama Stili</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FontField label="Yazı Tipi" fieldKey={`galleryDescFont-${catSlug}`} value={data.galleryDescFont} onChange={v => set('galleryDescFont', v)} />
                 <ColorField label="Renk" fieldKey={`galleryDescColor-${catSlug}`} value={data.galleryDescColor} onChange={v => set('galleryDescColor', v)} />
              </div>
              <SizePairField label="Boyut" fieldKey={`galleryDescSize-${catSlug}`} desktopValue={data.galleryDescSizeDesktop} mobileValue={data.galleryDescSizeMobile} onDesktopChange={v => set('galleryDescSizeDesktop', v)} onMobileChange={v => set('galleryDescSizeMobile', v)} />
            </div>
          </div>
        </Section>

        {/* 7. CTA */}
        <Section id="cta" title="7. Alt CTA Bölümü (Teklif Kutusu)" open={openSections.cta} onToggle={toggle}>
          <Field label="CTA Bölümü Arka Plan Görseli" hint="Teklif kutusunun arka planında görünecek görsel.">
            <div className="relative w-full h-32 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 mb-3">
              {data.ctaImage
                ? <img src={data.ctaImage} alt="CTA Background" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2"><ImageIcon size={24} /><span className="text-xs font-medium">Varsayılan görsel kullanılıyor</span></div>
              }
              {uploading && (
                <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                  <Loader2 size={24} className="animate-spin text-blue-500 mb-2" />
                </div>
              )}
            </div>
            <div className="flex gap-3 mb-4">
              <label className={`flex items-center gap-2 h-10 px-4 rounded-xl font-bold text-xs cursor-pointer transition-all border flex-1 justify-center ${uploading ? 'bg-slate-100 text-slate-400 border-slate-200 pointer-events-none' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'}`}>
                <ImageIcon size={14} /> CTA Görseli Yükle
                <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => handleImageUpload(e, 'ctaImage')} />
              </label>
              {data.ctaImage && (
                <button onClick={() => setData(p => ({ ...p, ctaImage: '' }))}
                  className="h-10 w-10 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center" title="Temizle">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </Field>

          <ColorField label="Arka Plan Overlay Rengi (Karanlık Filtre)" fieldKey={`ctaOverlayColor-${catSlug}`} value={data.ctaOverlayColor} onChange={v => set('ctaOverlayColor', v)} />

          <div className="space-y-4">
            <Field label="CTA Başlığı" hint="Sayfanın alt kısmındaki teklif kutusunun büyük başlığı.">
              <input key={`ctaTitle-${catSlug}`} type="text" value={data.ctaTitle} onChange={e => set('ctaTitle', e.target.value)} className={inputCls} placeholder="Projenize Özel Teklif Alın" />
            </Field>
            <Field label="CTA Açıklama Metni">
              <textarea key={`ctaDesc-${catSlug}`} value={data.ctaDesc} onChange={e => set('ctaDesc', e.target.value)} rows={3} className={textareaCls} />
            </Field>
          </div>

          <div className="pt-2 space-y-4 border-t border-slate-100 mt-4">
            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Başlık Stili</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FontField label="Başlık Yazı Tipi" fieldKey={`ctaTitleFont-${catSlug}`} value={data.ctaTitleFont} onChange={v => set('ctaTitleFont', v)} />
              <ColorField label="Başlık Rengi" fieldKey={`ctaTitleColor-${catSlug}`} value={data.ctaTitleColor} onChange={v => set('ctaTitleColor', v)} />
            </div>
            <SizePairField label="Başlık Boyutu" fieldKey={`ctaTitleSize-${catSlug}`}
              desktopValue={data.ctaTitleSizeDesktop} mobileValue={data.ctaTitleSizeMobile}
              onDesktopChange={v => set('ctaTitleSizeDesktop', v)} onMobileChange={v => set('ctaTitleSizeMobile', v)} />

            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest pt-2">Açıklama Stili</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FontField label="Açıklama Yazı Tipi" fieldKey={`ctaDescFont-${catSlug}`} value={data.ctaDescFont} onChange={v => set('ctaDescFont', v)} />
              <ColorField label="Açıklama Rengi" fieldKey={`ctaDescColor-${catSlug}`} value={data.ctaDescColor} onChange={v => set('ctaDescColor', v)} />
            </div>
            <SizePairField label="Açıklama Boyutu" fieldKey={`ctaDescSize-${catSlug}`}
              desktopValue={data.ctaDescSizeDesktop} mobileValue={data.ctaDescSizeMobile}
              onDesktopChange={v => set('ctaDescSizeDesktop', v)} onMobileChange={v => set('ctaDescSizeMobile', v)} />
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4 mt-6">
            <p className="text-sm font-extrabold text-slate-700 flex items-center gap-2"><Palette size={15} /> Birincil Buton (Teklif Al)</p>
            <Field label="Buton Metni">
              <input key={`ctaPrimaryBtnText-${catSlug}`} type="text" value={data.ctaPrimaryBtnText} onChange={e => set('ctaPrimaryBtnText', e.target.value)} className={inputCls} placeholder="Ücretsiz Teklif Al" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ColorField label="Arka Plan Rengi" fieldKey={`ctaPrimaryBtnColor-${catSlug}`} value={data.ctaPrimaryBtnColor} onChange={v => set('ctaPrimaryBtnColor', v)} />
              <ColorField label="Yazı Rengi" fieldKey={`ctaPrimaryBtnTextColor-${catSlug}`} value={data.ctaPrimaryBtnTextColor} onChange={v => set('ctaPrimaryBtnTextColor', v)} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Önizleme:</span>
              <span className="px-4 py-2 rounded-lg text-sm font-bold shadow-sm"
                style={{ backgroundColor: data.ctaPrimaryBtnColor || '#ef4444', color: data.ctaPrimaryBtnTextColor || '#ffffff' }}>
                {data.ctaPrimaryBtnText || 'Ücretsiz Teklif Al'}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4 mt-4">
            <p className="text-sm font-extrabold text-slate-700">İkincil Buton (Ara)</p>
            <Field label="Buton Metni">
              <input key={`ctaSecondaryBtnText-${catSlug}`} type="text" value={data.ctaSecondaryBtnText} onChange={e => set('ctaSecondaryBtnText', e.target.value)} className={inputCls} placeholder="Hemen Ara" />
            </Field>
          </div>
        </Section>

      </div>
    </div>
  );
}
