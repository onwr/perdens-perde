'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface HeroButton {
  id: string;
  text: string;
  color: string;
  textColor: string;
  font: string;
  link: string;
  type: 'teklif' | 'phone' | 'link';
}

export interface SiteSettings {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    fontFamily: string;
    headingFontFamily: string;
  };
  logos: {
    headerLogo: string;
    footerLogo: string;
    siteName: string;
    faviconUrl: string;
  };
  navbar: {
    ctaText: string;
    ctaPhone: string;
    ctaColor: string;
    ctaTextColor: string;
    ctaFont: string;
    navLinkSizeDesktop?: string;
    navLinkSizeMobile?: string;
    ctaPhoneSizeDesktop?: string;
    ctaPhoneSizeMobile?: string;
    navFont?: string;
    navTextColor?: string;
    corpLinkFont?: string;
    corpLinkTextColor?: string;
    corpLinkSizeDesktop?: string;
    corpLinkSizeMobile?: string;
    searchIconColor?: string;
    searchIconSizeDesktop?: string;
    searchIconSizeMobile?: string;
  };
  footer: {
    backgroundColor: string;
    textColor: string;
    aboutText: string;
    fontFamily: string;
    copyrightText: string;
    designerText?: string;
    contactTitle?: string;
    aboutTextSizeDesktop?: string;
    aboutTextSizeMobile?: string;
    groups: { id: string; title: string }[];
    quickLinks: { label: string; href: string; groupId: string }[];
  };
  hero: {
    bgImage: string;
    titleLine1: string;
    titleHighlight: string;
    titleFont: string;
    titleSizeDesktop?: string;
    titleSizeMobile?: string;
    subtitle: string;
    subtitleFont: string;
    subtitleSizeDesktop?: string;
    subtitleSizeMobile?: string;
    buttons: HeroButton[];
  };
  homeCategories: {
    title: string;
    subtitle: string;
    fontFamily: string;
    titleSizeDesktop?: string;
    titleSizeMobile?: string;
    subtitleSizeDesktop?: string;
    subtitleSizeMobile?: string;
    cards: { slug: string; title: string; icon: string; image?: string }[];
  };
  homeCorporate: {
    title: string;
    subtitle: string;
    items: { title: string; image: string }[];
    fontFamily: string;
    titleSizeDesktop?: string;
    titleSizeMobile?: string;
    subtitleSizeDesktop?: string;
    subtitleSizeMobile?: string;
    hoverZoom?: boolean;
  };
  homeProjects: {
    bannerImage?: string;
    title: string;
    subtitle: string;
    fontFamily: string;
    titleSizeDesktop?: string;
    titleSizeMobile?: string;
    subtitleSizeDesktop?: string;
    subtitleSizeMobile?: string;
    hoverZoom: boolean;
    items: { img: string; label: string }[];
  };
  homeCta: {
    bgImage: string;
    title: string;
    subtitle: string;
    btnText: string;
    btnColor: string;
    btnFont: string;
    titleSizeDesktop?: string;
    titleSizeMobile?: string;
    subtitleSizeDesktop?: string;
    subtitleSizeMobile?: string;
    callBtnText?: string;
    callBtnColor?: string;
    callBtnTextColor?: string;
    callBtnSizeDesktop?: string;
    callBtnSizeMobile?: string;
    primaryBtnSizeDesktop?: string;
    primaryBtnSizeMobile?: string;
  };
  hakkimizda: {
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    heroTitleSizeDesktop?: string;
    heroTitleSizeMobile?: string;
    heroSubtitleSizeDesktop?: string;
    heroSubtitleSizeMobile?: string;
    aboutTitle: string;
    aboutText: string;
    aboutTitleSizeDesktop?: string;
    aboutTitleSizeMobile?: string;
    aboutTextSizeDesktop?: string;
    aboutTextSizeMobile?: string;
    aboutImage: string;
    aboutImage2?: string;
    experienceYears?: string;
    experienceText?: string;
    features: string[];
    valuesTitle?: string;
    valuesSubtitle?: string;
    valuesTitleSizeDesktop?: string;
    valuesTitleSizeMobile?: string;
    valuesSubtitleSizeDesktop?: string;
    valuesSubtitleSizeMobile?: string;
    values?: { icon: string; title: string; description: string }[];
    fontFamily: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    workingHours: string;
    mapUrl: string;
    formTitle: string;
    formSubtitle: string;
    formSubtitleSizeDesktop?: string;
    formSubtitleSizeMobile?: string;
    formNameLabel: string;
    formEmailLabel: string;
    formPhoneLabel: string;
    formMessageLabel: string;
    formBtnText: string;
    formBtnColor: string;
  };
  quoteModal: {
    title: string;
    description: string;
    image: string;
    whyUsTitle: string;
    whyUsItems: string[];
    contactTitle: string;
    contactDesc: string;
    formTitle: string;
    formDesc: string;
    formBtnText: string;
    successTitle: string;
    successDesc: string;
  };
}

export const defaultSettings: SiteSettings = {
  theme: {
    primaryColor: '#10b981',
    secondaryColor: '#f1f5f9',
    backgroundColor: '#ffffff',
    fontFamily: 'Manrope',
    headingFontFamily: 'Manrope'
  },
  logos: {
    headerLogo: '/koyulogo.png',
    footerLogo: '/logo.png',
    siteName: 'Perdens Perde',
    faviconUrl: '/favicon.jpeg'
  },
  navbar: {
    ctaText: 'Keşif İçin Ara',
    ctaPhone: '0533 691 05 84',
    ctaColor: '#1e293b',
    ctaTextColor: '#ffffff',
    ctaFont: 'Manrope',
    searchIconColor: '#475569',
    searchIconSizeDesktop: '14px',
    searchIconSizeMobile: '24px'
  },
  footer: {
    backgroundColor: '#18181A',
    textColor: '#A1A1AA',
    aboutText: 'Kurumsal alanlara özel, ölçüye göre üretilen yüksek kaliteli perde ve stor sistemleri.',
    fontFamily: 'Manrope',
    copyrightText: '© 2026 Perdens Perde Sistemleri. Tüm hakları saklıdır.',
    designerText: 'Tasarım & Yazılım: Kürkaya Yazılım',
    contactTitle: 'İLETİŞİM',
    groups: [
      { id: 'kurumsal', title: 'KURUMSAL' },
      { id: 'urunler', title: 'ÜRÜNLER' }
    ],
    quickLinks: [
      { label: 'Ana Sayfa', href: '/', groupId: 'kurumsal' },
      { label: 'Hakkımızda', href: '/hakkimizda', groupId: 'kurumsal' },
      { label: 'Projeler', href: '/kurumsal-cozumler', groupId: 'kurumsal' },
      { label: 'Blog', href: '/blog', groupId: 'kurumsal' },
      { label: 'İletişim', href: '/iletisim', groupId: 'kurumsal' },
      { label: 'Stor Perde', href: '/urun-turleri#stor-perde', groupId: 'urunler' },
      { label: 'Zebra Perde', href: '/urun-turleri#zebra-perde', groupId: 'urunler' },
      { label: 'Ahşap Jaluzi', href: '/urun-turleri#ahsap-jaluzi', groupId: 'urunler' },
      { label: 'Alüminyum Jaluzi', href: '/urun-turleri#aluminyum-jaluzi', groupId: 'urunler' },
      { label: 'Motorlu Sistemler', href: '/urun-turleri#motorlu-sistemler', groupId: 'urunler' }
    ]
  },
  hero: {
    bgImage: '/hero.png',
    titleLine1: 'Doğal Ahşap Jaluzi ve',
    titleHighlight: 'Kurumsal Perde Çözümleri',
    titleFont: 'Manrope',
    subtitle: 'Ofis, otel ve ticari projeler için ölçüye özel stor perde, zebra perde ve doğal ahşap jaluzi sistemleri.',
    subtitleFont: 'Manrope',
    buttons: [
      {
        id: 'btn1',
        text: 'Ücretsiz Teklif Al',
        color: '#23272d',
        textColor: '#ffffff',
        font: 'Manrope',
        link: '?teklif=true',
        type: 'teklif'
      },
      {
        id: 'btn2',
        text: 'Keşif İçin Ara',
        color: 'transparent',
        textColor: '#ffffff',
        font: 'Manrope',
        link: '0533 691 05 84',
        type: 'phone'
      }
    ]
  },
  homeCategories: {
    title: 'Sistemlerimiz',
    subtitle: 'İhtiyacınıza uygun yenilikçi çözümleri keşfedin.',
    fontFamily: 'Manrope',
    cards: [
      { slug: 'stor-perde', title: 'Stor Perde', icon: 'Layers' },
      { slug: 'zebra-perde', title: 'Zebra Perde', icon: 'AlignJustify' },
      { slug: 'ahsap-jaluzi', title: 'Ahşap Jaluzi', icon: 'SlidersHorizontal' },
      { slug: 'aluminyum-jaluzi', title: 'Alüminyum Jaluzi', icon: 'List' },
      { slug: 'motorlu-sistemler', title: 'Motorlu Sistemler', icon: 'Wifi' },
    ]
  },
  homeCorporate: {
    title: 'Kurumsal Perde Uygulamaları',
    subtitle: 'Ofis, banka, otel ve sağlık projeleri için stor perde, zebra perde ve ahşap jaluzi uygulamaları',
    items: [
      { title: 'Ofis ve İş Merkezi Perdeleri', image: 'https://i.ibb.co/D8d2pxm/kurumsal1.jpg' },
      { title: 'Banka ve Finans Şubeleri', image: 'https://i.ibb.co/6yq3Xb2/kurumsal2.jpg' },
      { title: 'Otel ve Konaklama Projeleri', image: 'https://i.ibb.co/2d1pK3X/kurumsal3.jpg' },
      { title: 'Sağlık Kurumları ve Klinikler', image: 'https://i.ibb.co/5xb0hT2/kurumsal4.jpg' }
    ],
    fontFamily: 'Manrope',
    hoverZoom: true
  },
  homeProjects: {
    bannerImage: '/anasayfa/ana1.jpg',
    title: 'Tamamlanan Projeler',
    subtitle: 'Referanslarımız ve son çalışmalarımız.',
    fontFamily: 'Manrope',
    hoverZoom: true,
    items: [
      { img: 'https://i.ibb.co/D8d2pxm/kurumsal1.jpg', label: 'Ofis Projesi 1' },
      { img: 'https://i.ibb.co/6yq3Xb2/kurumsal2.jpg', label: 'Otel Projesi 1' },
      { img: 'https://i.ibb.co/2d1pK3X/kurumsal3.jpg', label: 'Sağlık Merkezi' },
      { img: 'https://i.ibb.co/5xb0hT2/kurumsal4.jpg', label: 'Kamu Binası' },
      { img: 'https://i.ibb.co/D8d2pxm/kurumsal1.jpg', label: 'Ofis Projesi 2' },
      { img: 'https://i.ibb.co/6yq3Xb2/kurumsal2.jpg', label: 'Otel Projesi 2' },
      { img: 'https://i.ibb.co/2d1pK3X/kurumsal3.jpg', label: 'Eğitim Kurumu' },
      { img: 'https://i.ibb.co/5xb0hT2/kurumsal4.jpg', label: 'Finans Merkezi' }
    ]
  },
  homeCta: {
    bgImage: '/urun-turleri/ciftmekanizma.jpg',
    title: 'Projeniz İçin Fiyat Teklifi Alın',
    subtitle: 'Uzman ekibimizle mekanınıza değer katacak en doğru ve şık çözümü planlayalım.',
    btnText: 'Hemen Teklif Al',
    btnColor: '#e43f3f',
    btnFont: 'Manrope'
  },
  hakkimizda: {
    heroTitle: 'Hakkımızda',
    heroSubtitle: 'Ofisler, oteller ve prestijli ticari alanlar için estetik, fonksiyonellik ve uzun ömürlülüğü merkeze alan güneş kontrol çözümleri üretiyoruz.',
    heroImage: '/hero.png',
    aboutTitle: 'Kurumsal Projelerin Güvenilir Çözüm Ortağı',
    aboutText: 'Perdens Perde olarak, perde sistemleri sektöründe yalnızca bir üretici değil, kurumsal projelere mimari estetik ve değer katan bir çözüm ortağı olarak konumlanıyoruz.\n\nGünümüzde ofisler, oteller ve sağlık kurumları için "güneş kontrolü" sadece bir ışık kısma işlemi değil; çalışan verimliliğini, enerji tasarrufunu ve iç mekan ambiyansını doğrudan etkileyen hayati bir faktördür. Bu vizyonla, her projeye özel ve dayanıklı çözümler üretiyoruz.',
    aboutImage: '/yonetim-kurulu.png',
    aboutImage2: '/KurumsalPerde-Image/ofisresim.jpg',
    experienceYears: '10+',
    experienceText: 'Yıllık\nTecrübe',
    features: ['Projeye Özel Üretim', 'Hızlı Teslimat & Kurulum', 'Geniş Uzman Kadro'],
    valuesTitle: 'Neden Perdens Perde?',
    valuesSubtitle: 'Kurumsal projelerde bizi tercih etmeniz için temel değerlerimiz ve standartlarımız.',
    values: [
      { icon: 'Gem', title: 'Premium Kalite', description: 'Uluslararası standartlarda kumaş ve dayanıklı lamel mekanizmalarıyla uzun ömürlü kullanım garantisi sunarız.' },
      { icon: 'Target', title: 'Proaktif Çözümler', description: 'Standart bir üretim yerine, projenizin mimari dokusuna ve ihtiyaçlarına tam uyan tasarımlar.' },
      { icon: 'Clock', title: 'Zamanında Teslimat', description: 'Kurumsal projelerin termin sürelerindeki hassasiyetin bilinciyle, siparişleri söz verdiğimiz günde teslim ederiz.' },
      { icon: 'ShieldCheck', title: 'Satış Sonrası Destek', description: 'Uygulama tamamlandıktan sonra da hızlı teknik servis ve yedek parça teminiyle her zaman yanınızdayız.' }
    ],
    fontFamily: 'Manrope'
  },
  contact: {
    phone: '0533 691 05 84',
    email: 'info@perdensperde.com',
    address: 'Bulgurlu Mh. Toygar Sitesi No:14/4, Üsküdar / İstanbul',
    workingHours: 'Pzt - Cmt: 09:00 - 19:00\nPazar: Kapalı',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.6508933519803!2d29.07166547568166!3d41.01100237135022!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac8ac57640305%3A0xe51ab93945c225df!2sBulgurlu%2C%2C%20Bulgurlu%2C%2034696%20%C3%9Csk%C3%BCdar%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1713370000000!5m2!1str!2str',
    formTitle: 'Bize Ulaşın',
    formSubtitle: 'Projeniz İçin',
    formNameLabel: 'Adınız Soyadınız',
    formEmailLabel: 'E-posta Adresiniz',
    formPhoneLabel: 'Telefon Numaranız',
    formMessageLabel: 'Mesajınız / Proje Detayları',
    formBtnText: 'Mesaj Gönder',
    formBtnColor: '#dc2626'
  },
  quoteModal: {
    title: 'Neden Biz?',
    description: 'Kurumsal uzmanlık ve premium çözümlerimizle tanışın.',
    image: '/neden-biz.png',
    whyUsTitle: 'Neden Biz?',
    whyUsItems: ['Kurumsal Uzmanlık', 'Premium Ürünler', 'Proje Bazlı Çözümler', 'Türkiye Geneli Hizmet'],
    contactTitle: 'Hızlı İletişim',
    contactDesc: 'Teklif talebiniz için doğrudan bizimle iletişime geçebilirsiniz.',
    formTitle: 'Hızlı Teklif Formu',
    formDesc: 'Formu doldurun, ekibimiz projenize uygun perde çözümü ve fiyatlandırma için en kısa sürede sizinle iletişime geçsin.',
    formBtnText: 'Teklif Gönder',
    successTitle: 'Talebiniz Alındı!',
    successDesc: 'En kısa sürede sizinle iletişime geçeceğiz.',
  }
};

const SettingsContext = createContext<{ settings: SiteSettings; loading: boolean }>({
  settings: defaultSettings,
  loading: true,
});

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'site'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setSettings({
          theme: { ...defaultSettings.theme, ...(data?.theme || {}) },
          logos: { ...defaultSettings.logos, ...(data?.logos || {}) },
          navbar: { ...defaultSettings.navbar, ...(data?.navbar || {}) },
          footer: { ...defaultSettings.footer, ...(data?.footer || {}) },
          hero: { ...defaultSettings.hero, ...(data?.hero || {}) },
          homeCategories: { ...defaultSettings.homeCategories, ...(data?.homeCategories || {}) },
          homeCorporate: { ...defaultSettings.homeCorporate, ...(data?.homeCorporate || {}) },
          homeProjects: { ...defaultSettings.homeProjects, ...(data?.homeProjects || {}) },
          homeCta: { ...defaultSettings.homeCta, ...(data?.homeCta || {}) },
          hakkimizda: { ...defaultSettings.hakkimizda, ...(data?.hakkimizda || {}) },
          contact: { ...defaultSettings.contact, ...(data?.contact || {}) },
          quoteModal: { ...defaultSettings.quoteModal, ...(data?.quoteModal || {}) },
        });
      }
      setLoading(false);
    }, (error) => {
      console.error('Failed to fetch global settings:', error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
