// Force Next.js Fast Refresh
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { categoriesData } from '@/data/categories';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Phone, Check } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function generateStaticParams() {
  return categoriesData.map((cat) => ({
    slug: cat.slug,
  }));
}

export const dynamic = 'force-dynamic';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categoriesData.find((c) => c.slug === slug);

  if (!category) {
    return {
      title: { absolute: 'Sayfa Bulunamadı | Perdens' },
      robots: { index: false, follow: false },
    };
  }

  let title = category.title;
  let description = category.shortDesc;

  try {
    const contentSnap = await getDoc(doc(db, 'categories_content', slug));
    if (contentSnap.exists()) {
      const data = contentSnap.data();
      if (data.title) title = String(data.title);
      if (data.shortDesc) description = String(data.shortDesc);
    }
  } catch {
    // Firestore erişilemezse statik kategori verisini kullan
  }

  return {
    title: { absolute: `${title} | Perdens` },
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title,
      description,
      url: `/${slug}`,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const category = categoriesData.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  // Fetch dynamic gallery URLs from Firestore
  try {
    const docSnap = await getDoc(doc(db, 'categories_gallery', slug));
    if (docSnap.exists()) {
      const gData = JSON.parse(JSON.stringify(docSnap.data()));
      if (Array.isArray(gData.gallery)) {
        category.gallery = gData.gallery.filter((img: string) => img && img.trim() !== '');
      }
    }
  } catch (error) {
    console.error('Firestore gallery fetch error:', error);
  }

  // Fetch texts, banner and extra fields from Firestore (categories_content)
  let catContent: any = {};
  try {
    const contentSnap = await getDoc(doc(db, 'categories_content', slug));
    if (contentSnap.exists()) {
      catContent = JSON.parse(JSON.stringify(contentSnap.data()));
      if (catContent.image !== undefined)        category.image       = catContent.image;
      if (catContent.title !== undefined)        category.title       = catContent.title;
      if (catContent.shortDesc !== undefined)    category.shortDesc   = catContent.shortDesc;
      if (catContent.fullDesc !== undefined)     category.fullDesc    = catContent.fullDesc;
      if (catContent.ctaTitle !== undefined)     category.ctaTitle    = catContent.ctaTitle;
      if (catContent.ctaDesc !== undefined)      category.ctaDesc     = catContent.ctaDesc;
      if (catContent.variants !== undefined)     category.variants    = catContent.variants;
      if (catContent.usageTitle !== undefined)   (category as any).usageTitle  = catContent.usageTitle;
      if (catContent.usageDesc !== undefined)    (category as any).usageDesc   = catContent.usageDesc;
      if (catContent.usageAreas !== undefined)   category.usageAreas  = catContent.usageAreas;
      if (catContent.usageImage !== undefined)   (category as any).usageImage  = catContent.usageImage;
      if (catContent.galleryTitle !== undefined) (category as any).galleryTitle = catContent.galleryTitle;
      if (catContent.galleryDesc !== undefined)  (category as any).galleryDesc  = catContent.galleryDesc;
      if (catContent.galleryLabels !== undefined)(category as any).galleryLabels= catContent.galleryLabels;
      if (catContent.ctaImage !== undefined)     (category as any).ctaImage    = catContent.ctaImage;
    }
  } catch (error) {
    console.error('Firestore content fetch error:', error);
  }

  // Fetch site settings directly from Firestore 
  let siteSettings: any = null;
  try {
    const sSnap = await getDoc(doc(db, 'settings', 'site'));
    if (sSnap.exists()) {
       siteSettings = sSnap.data();
    }
  } catch (error) {
     console.error('Settings fetch error:', error);
  }

  const ctaPhone = siteSettings?.contact?.phone || '0533 691 05 84';
  const ctaPhoneStrip = ctaPhone.replace(/\D/g, '');
  const globalCtaColor = siteSettings?.navbar?.ctaColor || '#ef4444';

  // Hero buttons (from catContent or global)
  const heroPrimaryBtnText     = catContent?.heroPrimaryBtnText     || 'Ücretsiz Teklif Al';
  const heroPrimaryBtnColor    = catContent?.heroPrimaryBtnColor    || globalCtaColor;
  const heroPrimaryBtnTextColor= catContent?.heroPrimaryBtnTextColor|| '#ffffff';
  const heroSecondaryBtnText   = catContent?.heroSecondaryBtnText   || 'Hemen Ara';
  const contentExtraText = catContent?.contentExtraText || 'Ölçüye özel üretim ile tüm mekanlara uyum sağlar ve estetik görünüm ile fonksiyonelliği bir araya getirir.';

  // CTA section
  const ctaOverlayColor       = catContent?.ctaOverlayColor       || '#1c1c1e';
  const ctaPrimaryBtnText     = catContent?.ctaPrimaryBtnText     || 'Ücretsiz Teklif Al';
  const ctaPrimaryBtnColor    = catContent?.ctaPrimaryBtnColor    || globalCtaColor;
  const ctaPrimaryBtnTextColor= catContent?.ctaPrimaryBtnTextColor|| '#ffffff';
  const ctaSecondaryBtnText   = catContent?.ctaSecondaryBtnText   || 'Hemen Ara';

  // ── Helper: CSS var adı ve inline style nesnesi bir arada
  const makeStyle = (
    colorVal: string | undefined,
    fontVal: string | undefined,
    desktopSize: string | undefined,
    mobileSize: string | undefined,
    varPrefix: string
  ): React.CSSProperties => ({
    ...(colorVal   ? { color: colorVal }         : {}),
    ...(fontVal    ? { fontFamily: fontVal }      : {}),
    ...(desktopSize? { [`--${varPrefix}-d` as string]: desktopSize } : {}),
    ...((mobileSize || desktopSize) ? { [`--${varPrefix}-m` as string]: mobileSize || desktopSize } : {}),
  });

  const heroTitleStyle    = makeStyle(catContent?.heroTitleColor,     catContent?.heroTitleFont,        catContent?.heroTitleSizeDesktop,       catContent?.heroTitleSizeMobile,       'ht');
  const heroSubStyle      = makeStyle(catContent?.heroSubtitleColor,  catContent?.heroSubtitleFont,     catContent?.heroSubtitleSizeDesktop,    catContent?.heroSubtitleSizeMobile,    'hs');
  const contentHeadingStyle = makeStyle(catContent?.contentHeadingColor, catContent?.contentHeadingFont, catContent?.contentHeadingSizeDesktop, catContent?.contentHeadingSizeMobile, 'ch');
  const contentTextStyle  = makeStyle(catContent?.contentTextColor,   catContent?.contentTextFont,      catContent?.contentTextSizeDesktop,     catContent?.contentTextSizeMobile,     'ct');
  const variantsTitleStyle= makeStyle(catContent?.variantsTitleColor, catContent?.variantsTitleFont,    catContent?.variantsTitleSizeDesktop,   catContent?.variantsTitleSizeMobile,   'vt');
  const variantsSubStyle  = makeStyle(catContent?.variantsSubtitleColor, catContent?.variantsSubtitleFont, catContent?.variantsSubtitleSizeDesktop, catContent?.variantsSubtitleSizeMobile, 'vs');
  const usageTitleStyle   = makeStyle(catContent?.usageTitleColor,    catContent?.usageTitleFont,       catContent?.usageTitleSizeDesktop,      catContent?.usageTitleSizeMobile,      'ut');
  const usageDescStyle    = makeStyle(catContent?.usageDescColor,     catContent?.usageDescFont,        catContent?.usageDescSizeDesktop,       catContent?.usageDescSizeMobile,       'ud');
  const galleryTitleStyle = makeStyle(catContent?.galleryTitleColor,  catContent?.galleryTitleFont,     catContent?.galleryTitleSizeDesktop,    catContent?.galleryTitleSizeMobile,    'gat');
  const galleryDescStyle  = makeStyle(catContent?.galleryDescColor,   catContent?.galleryDescFont,      catContent?.galleryDescSizeDesktop,     catContent?.galleryDescSizeMobile,     'gad');
  const ctaTitleStyle     = makeStyle(catContent?.ctaTitleColor,      catContent?.ctaTitleFont,         catContent?.ctaTitleSizeDesktop,        catContent?.ctaTitleSizeMobile,        'ctt');
  const ctaDescStyle      = makeStyle(catContent?.ctaDescColor,       catContent?.ctaDescFont,          catContent?.ctaDescSizeDesktop,         catContent?.ctaDescSizeMobile,         'ctd');

  // ── CSS: her bir prefix için media query üret
  const makeCSSRule = (cls: string, prefix: string, hasD: boolean, hasM: boolean) => {
    if (!hasD && !hasM) return '';
    return `
      ${hasD ? `@media (min-width: 768px) { .${cls} { font-size: var(--${prefix}-d) !important; } }` : ''}
      ${hasM ? `@media (max-width: 767px)  { .${cls} { font-size: var(--${prefix}-m) !important; } }` : ''}
    `;
  };

  const dynamicCSS = [
    makeCSSRule('dyn-ht',  'ht',  !!catContent?.heroTitleSizeDesktop,        !!(catContent?.heroTitleSizeMobile  || catContent?.heroTitleSizeDesktop)),
    makeCSSRule('dyn-hs',  'hs',  !!catContent?.heroSubtitleSizeDesktop,     !!(catContent?.heroSubtitleSizeMobile  || catContent?.heroSubtitleSizeDesktop)),
    makeCSSRule('dyn-ch',  'ch',  !!catContent?.contentHeadingSizeDesktop,   !!(catContent?.contentHeadingSizeMobile || catContent?.contentHeadingSizeDesktop)),
    makeCSSRule('dyn-ct',  'ct',  !!catContent?.contentTextSizeDesktop,      !!(catContent?.contentTextSizeMobile  || catContent?.contentTextSizeDesktop)),
    makeCSSRule('dyn-vt',  'vt',  !!catContent?.variantsTitleSizeDesktop,    !!(catContent?.variantsTitleSizeMobile || catContent?.variantsTitleSizeDesktop)),
    makeCSSRule('dyn-vs',  'vs',  !!catContent?.variantsSubtitleSizeDesktop, !!(catContent?.variantsSubtitleSizeMobile || catContent?.variantsSubtitleSizeDesktop)),
    makeCSSRule('dyn-ut',  'ut',  !!catContent?.usageTitleSizeDesktop,       !!(catContent?.usageTitleSizeMobile   || catContent?.usageTitleSizeDesktop)),
    makeCSSRule('dyn-ud',  'ud',  !!catContent?.usageDescSizeDesktop,        !!(catContent?.usageDescSizeMobile    || catContent?.usageDescSizeDesktop)),
    makeCSSRule('dyn-gat', 'gat', !!catContent?.galleryTitleSizeDesktop,     !!(catContent?.galleryTitleSizeMobile || catContent?.galleryTitleSizeDesktop)),
    makeCSSRule('dyn-gad', 'gad', !!catContent?.galleryDescSizeDesktop,      !!(catContent?.galleryDescSizeMobile  || catContent?.galleryDescSizeDesktop)),
    makeCSSRule('dyn-ctt', 'ctt', !!catContent?.ctaTitleSizeDesktop,         !!(catContent?.ctaTitleSizeMobile     || catContent?.ctaTitleSizeDesktop)),
    makeCSSRule('dyn-ctd', 'ctd', !!catContent?.ctaDescSizeDesktop,          !!(catContent?.ctaDescSizeMobile      || catContent?.ctaDescSizeDesktop)),
  ].join('');

  // Fallback labels for gallery

  const galleryLabels = [
    'Açık Ofis Alanı',
    'Yönetici Ofisi',
    'Toplantı Odası',
    'Otel Odası',
    'Klinik / Muayenehane',
    'Mağaza / Vitrin Alanı'
  ];



  return (
    <div className="min-h-screen flex flex-col pt-20 bg-white">
      <style dangerouslySetInnerHTML={{ __html: dynamicCSS }} />
      <Header />
      
      {/* ───── 1. HERO / BANNER ───── */}
      <section className="relative w-full h-[65vh] lg:h-[85vh] flex items-center justify-center overflow-hidden">
        {category.image.startsWith('http') ? (
            <img 
              src={category.image} 
              alt={catContent?.title || category.title} 
              className="absolute inset-0 w-full h-full object-cover z-0" 
            />
        ) : category.image ? (
            <Image 
              src={category.image} 
              alt={catContent?.title || category.title} 
              fill 
              className="object-cover z-0" 
              priority
            />
        ) : null}
        <div className="absolute inset-0 bg-[#1c2434]/70 z-10" />

        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="dyn-ht font-black tracking-tight leading-[1.1] mb-6 drop-shadow-md text-[42px] lg:text-[72px]"
            style={heroTitleStyle}>
            {catContent?.title || category.title}
          </h1>
          <p className="dyn-hs font-bold max-w-3xl drop-shadow-sm text-[18px] lg:text-[22px]"
            style={heroSubStyle}>
            {catContent?.shortDesc || category.shortDesc}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 w-full sm:w-auto">
            <Link
              href="?teklif=true"
              scroll={false}
              className="px-10 py-4 rounded-xl font-bold text-[16px] transition-all shadow-[0_8px_30px_rgb(0,0,0,0.3)] w-full sm:w-auto hover:-translate-y-0.5"
              style={{ backgroundColor: heroPrimaryBtnColor, color: heroPrimaryBtnTextColor }}
            >
              {heroPrimaryBtnText}
            </Link>
            <Link
              href={`tel:${ctaPhoneStrip}`}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/40 text-white px-10 py-4 rounded-xl font-bold text-[16px] transition-all flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.2)] w-full sm:w-auto hover:-translate-y-0.5"
            >
              <Phone className="w-5 h-5 text-green-400" />
              {heroSecondaryBtnText}
            </Link>
          </div>
        </div>
      </section>

      {/* ───── 3. İNCELEME (CONTENT) BÖLÜMÜ ───── */}
      <section className="relative overflow-hidden" 
        style={{ backgroundColor: catContent?.contentBgColor || '#ffffff' }}>
        <main className="w-full max-w-[1280px] mx-auto px-6 lg:px-10 py-20 lg:py-28 relative z-10 flex flex-col gap-24 font-inherit">
          {/* Info Layout */}
          <div className="w-full flex flex-col md:flex-row gap-12 items-stretch text-slate-800">
            <div className="w-full md:w-1/2 flex flex-col justify-center">
                {catContent?.contentTitle && catContent.contentTitle.trim() !== '' && (
                  <div className="mb-6">
                    <h2 className="dyn-ch font-extrabold leading-[1.2] tracking-tight text-[32px] lg:text-[40px]"
                      style={contentHeadingStyle}>
                      {catContent.contentTitle}
                    </h2>
                  </div>
                )}
                <div className="dyn-ct leading-relaxed font-medium flex flex-col gap-4 text-[16px]"
                  style={contentTextStyle}>
                    <p>{catContent?.fullDesc || category.fullDesc}</p>
                    {contentExtraText && <p>{contentExtraText}</p>}
                </div>
            </div>
            <div className="w-full md:w-1/2 min-h-[350px] relative rounded-[32px] overflow-hidden shadow-xl">
                {category.image.startsWith('http') ? (
                  <img src={category.image} alt={category.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <Image src={category.image} alt={category.title} fill className="object-cover" />
                )}
            </div>
          </div>

          {/* Variants Layout */}
          {category.variants && category.variants.length > 0 && (
            <div className="w-full flex flex-col items-center text-center">
              <h2 className="dyn-vt text-[32px] lg:text-[40px] font-extrabold tracking-tight mb-4"
                style={variantsTitleStyle}>
                {catContent?.variantsTitle && catContent.variantsTitle !== '' ? catContent.variantsTitle : (catContent?.title || category.title)}
              </h2>
              <p className="dyn-vs text-[16px] font-medium mb-12 max-w-2xl"
                 style={variantsSubStyle}>
                {catContent?.variantsSubtitle || 'Farklı dekorasyon stillerine uygun modellerimiz:'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 w-full max-w-5xl mx-auto">
                {category.variants.map((v, i) => (
                  <div key={i} className="group flex items-center justify-start gap-4 pr-6 pl-2 py-2 bg-white border text-slate-800 rounded-full font-bold text-[15.5px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                    style={{ color: catContent?.variantsColor || '#1e293b', borderColor: catContent?.variantsColor ? `${catContent.variantsColor}40` : '#e2e8f0' }}>
                    <div className="w-10 h-10 shrink-0 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-[#1c2434] group-hover:border-[#1c2434] transition-all duration-300">
                      <Check className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300" strokeWidth={3} />
                    </div>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </section>

      {/* ───── 5. KULLANIM ALANLARI ───── */}
      {category.usageAreas && category.usageAreas.length > 0 && (
        <section className="w-full py-20 relative overflow-hidden" 
          style={{ backgroundColor: catContent?.usageBgColor || '#f8fafc' }}>
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <div className={`relative w-full overflow-hidden ${catContent?.usageImage ? 'rounded-[32px] p-8 lg:p-14 shadow-2xl border border-slate-200/50' : ''}`}>
              
              {catContent?.usageImage && (
                <div className="absolute inset-0 w-full h-full z-0">
                   <img src={catContent.usageImage} className="w-full h-full object-cover" alt="Usage Background" />
                   <div className="absolute inset-0 bg-gradient-to-r from-white/70 to-white/10" />
                </div>
              )}

              {!catContent?.usageImage && <div className="absolute top-0 right-0 w-64 h-64 bg-slate-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />}
              
              <div className="relative z-20 flex flex-col lg:flex-row gap-16 items-center">
                <div className="w-full lg:w-[40%] flex flex-col justify-center">
                <h2 className="dyn-ut text-[32px] lg:text-[40px] font-extrabold leading-[1.2] tracking-tight mb-6"
                  style={usageTitleStyle}>
                  {catContent?.usageTitle && catContent.usageTitle !== '' ? catContent.usageTitle : `${(catContent?.title || category.title).split(' ')[0]} Perdelerin Kullanım Alanları`}
                </h2>
                <p className="dyn-ud text-[16px] leading-relaxed font-medium"
                   style={usageDescStyle}>
                  {catContent?.usageDesc || `${(catContent?.title || category.title).split(' ')[0]} perdeler, ayarlanabilir yapısı sayesinde gün ışığını istenilen seviyede kontrol etmeye imkan tanır ve mekanlara modern bir görünüm kazandırır.`}
                </p>
              </div>

              <div className="w-full lg:w-[60%] grid grid-cols-1 sm:grid-cols-2 gap-8">
                {category.usageAreas.map((area, i) => {
                  const isLastOdd = category.usageAreas.length % 2 !== 0 && i === category.usageAreas.length - 1;
                  return (
                    <div key={i} className={`flex bg-white p-6 rounded-[24px] shadow-sm hover:shadow-xl transition-shadow border border-white/50 ${isLastOdd ? 'col-span-1 sm:col-span-2 flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-8' : 'flex-col'}`}>
                      <h4 className={`text-[18px] font-extrabold text-slate-800 flex items-center gap-2 ${isLastOdd ? 'sm:w-2/5 mb-0 sm:mb-0' : 'mb-2'}`}
                          style={{ color: catContent?.usageCardTitleColor || '#1e293b' }}>
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                        {area.title}
                      </h4>
                      <p className={`text-[14px] leading-relaxed font-medium ${isLastOdd ? 'sm:w-3/5 ml-4 sm:ml-0 sm:border-l sm:border-slate-200 sm:pl-6' : 'ml-4'}`}
                         style={{ color: catContent?.usageCardDescColor || '#64748b' }}>
                        {area.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        </section>
      )}

      {/* ───── 6. GALERİ ───── */}
      <section className="w-full py-24" style={{ backgroundColor: catContent?.galleryBgColor || '#ffffff' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="w-full">
            <div className="text-center mb-14">
              <h2 className="dyn-gat font-extrabold mb-4 tracking-tight text-[32px] lg:text-[40px]"
                style={galleryTitleStyle}>
                {catContent?.galleryTitle && catContent.galleryTitle !== '' ? catContent.galleryTitle : `Tamamladığımız ${(catContent?.title || category.title)} Uygulama Örnekleri`}
              </h2>
              <p className="dyn-gad max-w-2xl mx-auto leading-relaxed font-medium text-[16px]"
                style={galleryDescStyle}>
                {catContent?.galleryDesc || 'Uygulama yaptığımız binlerce mutlu müsterimizin projelerinden bazı kareler.'}
              </p>
            </div>
            
            {category.gallery && category.gallery.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.gallery.slice(0, 6).map((img, i) => (
                  <div key={i} className="relative w-full h-[240px] rounded-[24px] overflow-hidden bg-slate-100 group shadow-sm">
                    <img 
                      src={img} 
                      alt={`${(catContent?.title || category.title)} Uygulama`} 
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c2434]/90 via-[#1c2434]/20 to-transparent flex flex-col justify-end p-6">
                        <p className="text-white font-bold text-[18px] tracking-wide transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">{(category.galleryLabels && category.galleryLabels[i]) || (catContent?.galleryLabels && catContent.galleryLabels[i]) || galleryLabels[i % galleryLabels.length]}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full bg-slate-50 border border-slate-200 rounded-[24px] p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                  <Image src="/logo.png" alt="Logo" width={32} height={32} className="opacity-40" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">Bölüm Güncelleniyor</h3>
                <p className="text-slate-500 font-medium">Bu kategoriye ait uygulama görselleri eklenmemiştir veya güncellenmektedir.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ───── 7. CTA BÖLÜMÜ ───── */}
      <section className="w-full py-20 bg-white">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="w-full relative rounded-[32px] overflow-hidden min-h-[420px] flex flex-col items-center justify-center text-center px-6 py-16 shadow-2xl">
            {(catContent?.ctaImage || category.image).startsWith('http') ? (
              <img 
                src={catContent?.ctaImage || category.image} 
                alt="CTA Background" 
                className="absolute inset-0 w-full h-full object-cover z-0" 
              />
            ) : (
              <Image 
                src={catContent?.ctaImage || category.image} 
                alt="CTA Background" 
                fill 
                className="object-cover z-0" 
              />
            )}
            <div className="absolute inset-0 z-10" style={{ backgroundColor: `${ctaOverlayColor}99` }} />
            
            <div className="relative z-20 flex flex-col items-center gap-6 max-w-4xl w-full my-8 text-white">
              <h2 className="dyn-ctt font-extrabold tracking-tight leading-tight drop-shadow-md text-[32px] lg:text-[44px]"
                style={ctaTitleStyle}>
                {catContent?.ctaTitle && catContent.ctaTitle !== '' ? catContent.ctaTitle : `Projenize Özel ${(catContent?.title || category.title)} Teklifi Alın`}
              </h2>
              <p className="dyn-ctd font-medium leading-relaxed max-w-2xl drop-shadow-md text-[16px] lg:text-[18px]"
                style={ctaDescStyle}>
                {catContent?.ctaDesc || `Ofis, banka ve ticari alanlar için ${(catContent?.title || category.title).toLowerCase()} ile ışık kontrolünü kolayca ayarlayın. Ücretsiz keşif ve hızlı teklif için hemen bizimle iletişime geçin.`}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 w-full sm:w-auto">
                <Link
                  href="?teklif=true"
                  scroll={false}
                  className="px-10 py-4 rounded-xl font-bold text-[16px] transition-all shadow-[0_8px_30px_rgb(0,0,0,0.3)] w-full sm:w-auto hover:-translate-y-0.5"
                  style={{ backgroundColor: ctaPrimaryBtnColor, color: ctaPrimaryBtnTextColor }}
                >
                  {ctaPrimaryBtnText}
                </Link>
                <Link
                  href={`tel:${ctaPhoneStrip}`}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/40 text-white px-10 py-4 rounded-xl font-bold text-[16px] transition-all flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.2)] w-full sm:w-auto hover:-translate-y-0.5"
                >
                  <Phone className="w-5 h-5 text-green-400" />
                  {ctaSecondaryBtnText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
