import { Layers, AlignJustify, SlidersHorizontal, List, Wifi } from 'lucide-react';
import React from 'react';

export interface CategorySpec {
  name: string;
  value: string;
}

export interface UsageArea {
  title: string;
  desc: string;
}

export interface CategoryData {
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  darkImage: string;
  icon: React.ReactNode;
  specs: CategorySpec[];
  features: string[];
  variants: string[];
  usageAreas: UsageArea[];
  gallery: string[];
  galleryLabels?: string[];
  galleryTitle?: string;
  galleryDesc?: string;
  ctaTitle?: string;
  ctaDesc?: string;
  ctaImage?: string;
  usageTitle?: string;
  usageDesc?: string;
}

export const categoriesData: CategoryData[] = [
  {
    slug: 'stor-perde',
    title: 'Stor Perde Sistemleri',
    shortDesc: 'Ofis, banka ve ticari alanlar için ölçüye özel stor perde sistemleri ile modern ve fonksiyonel güneş kontrol çözümleri sunuyoruz.',
    fullDesc: 'Stor perde sistemleri, ofis, banka ve ticari alanlarda modern ve fonksiyonel çözümler sunar. Ölçüye özel üretim sayesinde mekanlara tam uyum sağlar ve güneş ışığını kontrollü şekilde içeri alarak konforlu bir çalışma ortamı oluşturur. Dayanıklı yapısı ve sade tasarımı ile kurumsal alanlarda estetik bir görünüm sunarken, aynı zamanda mahremiyet ve ısı dengesi sağlar.',
    image: '/katagori-stor.png',
    darkImage: '/katagori-stor.png',
    icon: <Layers size={24} className="text-slate-600 group-hover:text-zinc-900 transition-colors" strokeWidth={1.5} />,
    specs: [
      { name: 'Kumaş Türü', value: 'Blackout, Sunscreen, Keten Görünümlü' },
      { name: 'Mekanizma', value: 'Zincirli veya Motorlu' },
      { name: 'Kasa Sistemi', value: 'Açık Kasa, Kapalı Kasa (Fascia)' },
      { name: 'Temizlik', value: 'Nemli bezle silinebilir' },
    ],
    features: [
      'Ekran parlamalarını önler.',
      'Yüksek ısı yalıtımı sağlar.',
      'Dayanıklı mekanizma.',
      'Yangın geciktirici kumaş seçenekleri.'
    ],
    variants: [
      'Blackout (Karartma) Stor Perde',
      'Lazer Kesim Stor Perde',
      'Çift Mekanizmalı Stor Perde',
      'Bambu / Ahşap Stor Perde',
      'Desenli Stor Perde',
      'Güneş Kırıcı Stor (Screen)'
    ],
    usageTitle: 'Stor Perde Sistemlerinin Kullanım Alanları',
    usageDesc: 'Stor perde sistemleri; ofis, banka, otel ve ticari alanlarda estetik, fonksiyonel ve uzun ömürlü çözümler sunar.',
    usageAreas: [
      { title: 'Ofis ve İş Merkezleri', desc: 'Verimlilik ve ışık kontrolü sağlar' },
      { title: 'Banka ve Finans Kurumları', desc: 'Mahremiyet ve profesyonel görünüm sunar' },
      { title: 'Otel ve Konaklama Alanları', desc: 'Konfor ve ışık kontrolü sağlar' },
      { title: 'Klinik ve Sağlık Kurumları', desc: 'Hijyenik ve kullanışlı çözümler sunar' },
      { title: 'Mağaza ve Ticari Alanlar', desc: 'Güneş kontrolü ve estetik sağlar' }
    ],
    galleryTitle: 'Tamamladığımız Stor Perde Projeleri',
    galleryDesc: 'Ofis, banka, otel ve sağlık alanlarında uyguladığımız stor perde projelerinden bazı örnekleri inceleyin.',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497215174542-a8c6af0fdfcd?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?auto=format&fit=crop&q=80&w=800'
    ],
    galleryLabels: [
      'Açık Ofis Alanı',
      'Toplantı Odası',
      'Banka Şubesi',
      'Çağrı Merkezi',
      'Kamu Kurumu Ofisi',
      'Hastane / Klinik'
    ],
    ctaTitle: 'Projenize Özel Stor Perde Teklifi Alın',
    ctaDesc: 'Ofis, banka ve ticari alanlar için ölçüye özel stor perde çözümleri. Ücretsiz keşif ve hızlı fiyatlandırma için hemen iletişime geçin.'
  },
  {
    slug: 'zebra-perde',
    title: 'Zebra Perde Sistemleri',
    shortDesc: 'Ofis ve ticari alanlar için ölçüye özel zebra perde sistemleri ile ışık kontrolü ve modern görünümü bir arada sunuyoruz.',
    fullDesc: 'Zebra perde sistemleri, kurumsal alanlarda ışık kontrolünü kolaylaştıran ve modern bir görünüm sunan çözümler sağlar. Şeritli yapısı sayesinde ışık seviyesini istenilen şekilde ayarlamaya imkan tanır. Ölçüye özel üretim ile tüm mekanlara uyum sağlar ve estetik görünüm ile fonksiyonelliği bir arada sunar.',
    image: '/katagori-zebra.png',
    darkImage: '/katagori-zebra.png',
    icon: <AlignJustify size={24} className="text-slate-600 group-hover:text-zinc-900 transition-colors" strokeWidth={1.5} />,
    specs: [
      { name: 'Modeller', value: 'Standart, Blackout, Geniş veya Dar Şeritli' },
      { name: 'Özel Seriler', value: 'Desenli veya Bambu / Ahşap Görünümlü' },
      { name: 'Uygulama', value: 'Ofis, Otel Odası, Klinik, Mağaza vb.' },
      { name: 'Özellik', value: 'Işık seviyesi ayarlanabilir özel şeritli mekanizma' },
    ],
    features: [
      'Gece ve gündüz kullanım özgürlüğü.',
      'Modern dekorasyon stilleri ile kusursuz uyum.',
      'Leke tutmayan, anti-statik doku.'
    ],
    variants: [
      'Standart Zebra Perde',
      'Blackout Zebra Perde (Karartma Zebra)',
      'Geniş Şeritli Zebra Perde',
      'Dar Şeritli Zebra Perde',
      'Desenli Zebra Perde',
      'Bambu / Ahşap Görünümlü Zebra'
    ],
    usageAreas: [
      { title: 'Ofis Ortamları', desc: 'Şeritli yapısı ile hem görünüm hem kontrol sağlar.' },
      { title: 'Otel Odaları', desc: 'Gün ışığını istenilen seviyede ayarlamaya imkan tanır.' },
      { title: 'Klinik ve Muayenehaneler', desc: 'Işık yoğunluğunu kontrol ederek konfor sağlar.' },
      { title: 'Mağaza ve Vitrin Alanları', desc: 'Işığı yönlendirerek dikkat çekici bir atmosfer oluşturur.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1504384308090-c894fd852ea9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1503810473512-f64b56827fb3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1431540015114-04f050212260?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1606744888344-493248afa22b?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    slug: 'ahsap-jaluzi',
    title: 'Doğal Ahşap Jaluzi Sistemleri',
    shortDesc: 'Ofis, villa ve kurumsal projeler için doğal ahşap jaluzi çözümleri. Estetik görünüm, ışık kontrolü ve premium kalite bir arada.',
    fullDesc: 'Ahşap jaluzi sistemleri, doğal malzeme yapısı ile mekanlara sıcak ve prestijli bir görünüm kazandırır. Ayarlanabilir lamel yapısı sayesinde gün ışığını kontrollü şekilde içeri alırken, aynı zamanda mahremiyet sağlar. Ölçüye özel üretim ile tüm projelere uyum sağlayarak estetik ve uzun ömürlü çözümler sunar.',
    image: '/katagori-ahsapj.png',
    darkImage: '/katagori-ahsapj.png',
    icon: <SlidersHorizontal size={24} className="text-slate-600 group-hover:text-zinc-900 transition-colors" strokeWidth={1.5} />,
    specs: [
      { name: 'Modeller', value: 'Doğal Ahşap, Boyalı, Ahşap Görünümlü, Premium' },
      { name: 'Lamel Genişliği', value: 'Geniş Lamel veya Dar Lamel seçenekleri' },
      { name: 'Kullanım Alanı', value: 'Yönetici Ofisi, Villa, Toplantı Odası, Otel' },
      { name: 'Özellik', value: 'Doğal dokulu lamel sistemi ile lüks dekorasyon uyumu' },
    ],
    features: [
      'Hassas çevresel ışık ayarlama.',
      'Otantik ve prestijli görsel doku.',
      'Uzun yıllar deforme olmayan cila.'
    ],
    variants: [
      'Doğal Ahşap Jaluzi',
      'Boyalı Ahşap Jaluzi',
      'Geniş Lamel Ahşap Jaluzi',
      'Dar Lamel Ahşap Jaluzi',
      'Ahşap Görünümlü Jaluzi',
      'Premium Ahşap Jaluzi'
    ],
    usageAreas: [
      { title: 'Yönetici Ofisleri', desc: 'Prestijli ve profesyonel bir görünüm kazandırır.' },
      { title: 'Villa ve Özel Konutlar', desc: 'Doğal dokusu ile sıcak ve şık bir atmosfer oluşturur.' },
      { title: 'Otel ve Lüks Mekanlar', desc: 'Üst segment mekanlarda estetik ve konfor sağlar.' },
      { title: 'Toplantı ve Yönetim Odaları', desc: 'Dengeli ışık ve profesyonel bir ortam sunar.' },
      { title: 'Mağaza ve Showroom Alanları', desc: 'Ürün sergilemelerinde doğal ve dikkat çekici bir görünüm oluşturur.' }
    ],
    usageTitle: 'Ahşap Jaluzinin Kullanım Alanları',
    usageDesc: 'Ahşap jaluzi sistemleri, doğal dokusu ve şık görünümü ile kurumsal ve özel mekanlarda estetik ve prestijli çözümler sunar.',
    gallery: [
      'https://images.unsplash.com/photo-1541173457446-fa104f216298?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1531201509176-ff6b62886470?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497271679268-3bb8c7b8979c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1510074377623-8cf13fb86c08?auto=format&fit=crop&q=80&w=800'
    ],
    galleryLabels: [
      'Yönetici Ofisi',
      'Villa ve Özel Konut',
      'Toplantı ve Yönetim Odası',
      'Otel Süit Odası',
      'Showroom / Mağaza',
      'Yönetim Katı / Boardroom'
    ],
    galleryTitle: 'Tamamlanan Ahşap Jaluzi Uygulamaları',
    galleryDesc: 'Yönetici ofisleri, villa ve lüks mekanlarda uyguladığımız ahşap jaluzi çözümleri ile doğal ve prestijli bir görünüm sunuyoruz.',
    ctaTitle: 'Projenize Özel Ahşap Jaluzi Teklifi Alın',
    ctaDesc: 'Yönetici ofisleri, villa ve lüks mekanlar için doğal ahşap jaluzi çözümleri. Projenize özel üretim ve ücretsiz keşif için hemen bizimle iletişime geçin.'
  },
  {
    slug: 'aluminyum-jaluzi',
    title: 'Alüminyum Jaluzi Sistemleri',
    shortDesc: 'Ofis, banka ve ticari alanlar için dayanıklı ve fonksiyonel alüminyum jaluzi çözümleri. Uzun ömürlü kullanım ve kolay kontrol bir arada.',
    fullDesc: 'Alüminyum jaluzi sistemleri, sağlam yapısı ve işlevsel tasarımı ile kurumsal alanlarda uzun ömürlü çözümler sunar. Lamel yapısı sayesinde ışık kontrolünü kolaylaştırır ve çalışma alanlarında dengeli bir ortam oluşturur. Ölçüye özel üretim ile projelere uyum sağlayarak pratik ve verimli kullanım imkanı sunar.',
    image: '/katagori-alimuyum.png',
    darkImage: '/katagori-alimuyum.png',
    icon: <List size={24} className="text-slate-600 group-hover:text-zinc-900 transition-colors" strokeWidth={1.5} />,
    specs: [
      { name: 'Lamel Türleri', value: 'Standart, Mikro Delikli (Perfore)' },
      { name: 'Yüzey ve Yansıma', value: 'Mat Yüzey, Parlak Yüzey seçenekleri' },
      { name: 'Genişlik / Kaplama', value: 'Geniş, Dar, Ahşap Görünümlü, Antibakteriyel' },
      { name: 'Kullanım Alanı', value: 'Banka, Hastane, Okul, Çağrı Merkezi' },
    ],
    features: [
      'Isı, nem ve rutubete karşı dayanıklılık.',
      'Slikon alaşımlı esnek bant yapısı.',
      'Temizlemesi kolay anti-statik doku.'
    ],
    variants: [
      'Standart Alüminyum Jaluzi',
      'Mikro Delikli (Perfore) Alüminyum Jaluzi',
      'Mat Yüzey Alüminyum Jaluzi',
      'Parlak Yüzey Alüminyum Jaluzi',
      'Renkli Alüminyum Jaluzi',
      'Geniş Lamel Alüminyum Jaluzi',
      'Dar Lamel Alüminyum Jaluzi',
      'Ahşap Görünümlü Alüminyum Jaluzi',
      'Özel Kaplamalı / Antibakteriyel Jaluzi'
    ],
    usageAreas: [
      { title: 'Ofis ve Çalışma Alanları', desc: 'Gün ışığını kontrol ederek verimli ve konforlu bir çalışma ortamı sağlar.' },
      { title: 'Banka ve Finans Kurumları', desc: 'Mahremiyet ve düzenli bir görünüm sunar.' },
      { title: 'Okullar ve Eğitim Kurumları', desc: 'Yoğun kullanıma uygun dayanıklı ve uzun ömürlü çözümler sağlar.' },
      { title: 'Hastane ve Sağlık Kurumları', desc: 'Hijyenik ve kolay temizlenebilir yapı sunar.' },
      { title: 'Kamu Kurumları ve Ofisler', desc: 'Uzun süreli kullanım için ekonomik ve sağlam çözümler sunar.' },
      { title: 'Mağaza ve Ticari Alanlar', desc: 'Güneş kontrolü ve sade bir görünüm sağlar.' }
    ],
    usageTitle: 'Alüminyum Jaluzinin Kullanım Alanları',
    usageDesc: 'Alüminyum jaluzi sistemleri, dayanıklı yapısı ve pratik kullanımı sayesinde yoğun kullanılan kurumsal alanlarda ideal çözümler sunar.',
    gallery: [
      'https://images.unsplash.com/photo-1520699918507-3c3e05c46b0c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600585154526-990dced4ea0d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&q=80&w=800'
    ],
    galleryLabels: [
      'Açık Ofis Alanı',
      'Banka Şubesi',
      'Okul / Sınıf',
      'Hastane / Klinik',
      'Kamu Kurumu Ofisleri',
      'Çağrı Merkezi / Çalışma Alanı'
    ],
    galleryTitle: 'Tamamladığımız Alüminyum Jaluzi Projeleri',
    galleryDesc: 'Ofis, banka, eğitim ve sağlık alanlarında uyguladığımız alüminyum jaluzi çözümleri ile dayanıklı ve uzun ömürlü kullanım sunuyoruz.',
    ctaTitle: 'Projenize Özel Alüminyum Jaluzi Teklifi Alın',
    ctaDesc: 'Ofis, banka, eğitim ve sağlık alanları için dayanıklı alüminyum jaluzi çözümleri. Uzun ömürlü kullanım ve ücretsiz keşif için hemen bizimle iletişime geçin.'
  },
  {
    slug: 'motorlu-sistemler',
    title: 'Motorlu Perde Sistemleri',
    shortDesc: 'Akıllı ev ve kurumsal projelere özel motorlu perde sistemleri ile maksimum konfor ve kolay kullanım sunuyoruz.',
    fullDesc: 'Motorlu perde sistemleri, uzaktan kumanda veya otomasyon sistemleri ile kontrol edilebilen modern çözümler sunar. Gün ışığını zahmetsizce ayarlamaya imkan tanırken, büyük ve ulaşılması zor alanlarda kullanım kolaylığı sağlar. Ölçüye özel üretim ile tüm projelere uyum sağlar ve konforlu bir kullanım deneyimi sunar.',
    image: '/katagori-motor.png',
    darkImage: '/katagori-motor.png',
    icon: <Wifi size={24} className="text-slate-600 group-hover:text-zinc-900 transition-colors" strokeWidth={1.5} />,
    specs: [
      { name: 'Desteklenen Ürünler', value: 'Motorlu Stor, Zebra, Ahşap ve Alüminyum Jaluzi' },
      { name: 'Kontrol Seçenekleri', value: 'Duvar Anahtarlı veya Uzaktan Kumandalı' },
      { name: 'Otomasyon', value: 'Zaman Ayarlı (Otomatik) Mekanizma' },
      { name: 'Entegrasyon', value: 'KnX ve Akıllı Ev Uyumlu Konsept' },
    ],
    features: [
      'Toplu açma kapama ve senaryo desteği.',
      'Şarj edilebilir bataryalı kablosuz modeller.',
      'Güneş ve rüzgar devresi entegrasyonu.'
    ],
    variants: [
      'Motorlu Stor Perde',
      'Motorlu Zebra Perde',
      'Motorlu Ahşap Jaluzi',
      'Motorlu Alüminyum Jaluzi',
      'Duvar Anahtarlı Motorlu Sistem',
      'Akıllı Ev Uyumlu Perde',
      'Zaman Ayarlı (Otomatik) Perde'
    ],
    usageAreas: [
      { title: 'Akıllı Evler ve Villalar', desc: 'Tek tuşla kontrol ve yüksek konfor sunar.' },
      { title: 'Ofis ve Kurumsal Alanlar', desc: 'Gün ışığını zahmetsizce ayarlayarak çalışma ortamını optimize eder.' },
      { title: 'Toplantı ve Yönetim Odaları', desc: 'Sunum ve görüşmeler için ışık kontrolünü kolaylaştırır.' },
      { title: 'Otel ve Konaklama Alanları', desc: 'Konforlu ve modern kullanım sağlar.' },
      { title: 'Konferans ve Etkinlik Salonları', desc: 'Büyük alanlarda otomatik kontrol imkanı sunar.' }
    ],
    usageTitle: 'Motorlu Perde Sistemlerinin Kullanım Alanları',
    usageDesc: 'Motorlu perde sistemleri, otomasyon ve uzaktan kontrol avantajı ile konfor ve kullanım kolaylığı gerektiren tüm mekanlarda tercih edilir.',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1588854337186-b48995a9ffca?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1588854337221-4cfb4cbbf858?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1588854337114-118df2d31215?auto=format&fit=crop&q=80&w=800'
    ],
    galleryLabels: [
      'Villa ve Akıllı Ev Sistemleri',
      'Yönetici Ofisi',
      'Toplantı ve Yönetim Odası',
      'Otel ve Konaklama Alanları',
      'Konferans ve Etkinlik Salonları',
      'Mağaza / Vitrin Alanı'
    ],
    galleryTitle: 'Tamamladığımız Motorlu Perde Uygulamaları',
    galleryDesc: 'Akıllı ev ve kurumsal projelerde uyguladığımız motorlu perde sistemleri ile uzaktan kontrol ve maksimum konfor sağlıyoruz.',
    ctaTitle: 'Projenize Özel Motorlu Perde Teklifi Alın',
    ctaDesc: 'Akıllı ev ve kurumsal projeler için motorlu perde sistemleri ile uzaktan kontrol ve maksimum konfor sağlayın. Ücretsiz keşif ve hızlı teklif için hemen bizimle iletişime geçin.'
  }
];
