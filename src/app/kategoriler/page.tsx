import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { categoriesData } from '@/data/categories';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Moon, Scissors, Layers2, Leaf, Sparkles, Sun, Phone, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: { absolute: 'Perde Kategorileri | Perdens' },
  description: 'Stor perde, zebra perde, jaluzi ve motorlu perde sistemleri. Tüm perde kategorilerimizi inceleyin.',
  alternates: { canonical: '/kategoriler' },
  openGraph: {
    title: 'Perde Kategorileri | Perdens',
    description: 'Stor perde, zebra perde, jaluzi ve motorlu perde sistemleri. Tüm perde kategorilerimizi inceleyin.',
    url: '/kategoriler',
  },
};

export default function KategorilerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <Header />

      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/Katagoriler/enust.png"
          alt="Perde Sistemleri"
          fill
          className="object-cover object-center z-0"
          priority
        />
        <div className="absolute inset-0 bg-black/50 z-10" />

        <div className="relative z-20 w-full max-w-[1280px] mx-auto px-6 lg:px-10 flex flex-col items-center text-center gap-6">
          <div>
            <h1 className="text-[58px] lg:text-[80px] font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
              Stor Perde Sistemleri
            </h1>
            <p className="text-[17px] lg:text-[20px] text-white/80 font-medium mt-4 leading-relaxed max-w-2xl mx-auto">
              Ofis, banka ve ticari alanlar için ölçüye özel stor perde sistemleri ile modern ve fonksiyonel güneş kontrol çözümleri sunuyoruz.
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <Link
              href="?teklif=true"
              scroll={false}
              className="bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white px-8 py-4 rounded-xl font-bold text-[15px] transition-all shadow-lg"
            >
              Ücretsiz Teklif Al
            </Link>
            <Link
              href="?teklif=true"
              scroll={false}
              className="bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-[15px] transition-all flex items-center gap-2 shadow-lg"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              Ücretsiz Keşif Al
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full bg-white pt-10">
        <div className="w-full max-w-[1280px] mx-auto">
          <div className="relative w-full min-h-[500px] lg:min-h-[560px] overflow-hidden rounded-[32px]">

            <Image
              src="/Katagoriler/enust-alt.png"
              alt="Stor Perde Kurumsal Uygulama"
              fill
              className="object-cover object-center"
            />

            <div className="absolute top-0 left-0 h-full w-full lg:w-[48%] flex flex-col justify-start pt-14 lg:pt-18 px-6 sm:px-10 lg:px-14 py-10 lg:py-14 bg-white/80 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none">
              <h2
                className="text-[28px] sm:text-[30px] lg:text-[38px] font-extrabold text-slate-900 leading-[1.2] tracking-tight mb-5 lg:mb-7"
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
              >
                Kurumsal Alanlar İçin<br />Stor Perde Sistemleri
              </h2>
              <div className="flex flex-col gap-3 text-[14px] lg:text-[15px] text-slate-800 lg:text-slate-700 leading-relaxed font-semibold lg:font-medium">
                <p>Stor perde sistemleri, ofis, banka ve ticari alanlarda modern ve fonksiyonel çözümler sunar.</p>
                <p>Ölçüye özel üretim sayesinde mekanlara tam uyum sağlar ve güneş ışığını kontrollü şekilde içeri alarak konforlu bir çalışma ortamı oluşturur.</p>
                <p>Dayanıklı yapısı ve sade tasarımı ile kurumsal alanlarda estetik bir görünüm sunarken, aynı zamanda mahremiyet ve ısı dengesi sağlar.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="w-full bg-[#f8f9fb] py-20">
        <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-10">

          <div className="text-center mb-14">
            <h2 className="text-[32px] lg:text-[40px] font-extrabold text-slate-900 tracking-tight mb-3"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
              Ürün Türleri
            </h2>
            <p className="text-[15px] text-slate-500 font-medium">
              İhtiyacınıza uygun çeşitli stor perde türlerini keşfedin.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                img: '/urun-turleri/blackout-karartma.jpg',
                title: 'Blackout (Karartma) Stor Perde',
                desc: 'Tam karartma sağlar, ışık tamamen engellenir. Toplantı ve projeksiyon odaları için idealdir.',
                icon: <Moon className="w-4 h-4 text-slate-500" strokeWidth={1.5} />,
                badge: 'Karartma',
              },
              {
                img: '/urun-turleri/lazerkesim.jpg',
                title: 'Lazer Kesim Stor Perde',
                desc: 'Hassas lazer teknolojisiyle üretilen özel kesim desenlere sahip dekoratif stor perdeler.',
                icon: <Scissors className="w-4 h-4 text-slate-500" strokeWidth={1.5} />,
                badge: 'Lazer Kesim',
              },
              {
                img: '/urun-turleri/ciftmekanizma.jpg',
                title: 'Çift Mekanizmalı Stor Perde',
                desc: 'Blackout ve screen kumaşı bir arada sunan çift ray sistemi; gece-gündüz tam kontrol sağlar.',
                icon: <Layers2 className="w-4 h-4 text-slate-500" strokeWidth={1.5} />,
                badge: 'Çift Ray',
              },
              {
                img: '/urun-turleri/bambu-ahsap-stor-perde.jpg',
                title: 'Bambu / Ahşap Stor Perde',
                desc: 'Doğal bambu ve ahşap görünümlü kumaşlar ile sıcak ve organik bir atmosfer oluşturur.',
                icon: <Leaf className="w-4 h-4 text-slate-500" strokeWidth={1.5} />,
                badge: 'Doğal',
              },
              {
                img: '/urun-turleri/desenli-stor-perde.jpg',
                title: 'Desenli Stor Perde',
                desc: 'Geometrik, çizgili ve baskılı desen seçenekleriyle mekana karakter ve özgünlük katar.',
                icon: <Sparkles className="w-4 h-4 text-slate-500" strokeWidth={1.5} />,
                badge: 'Dekoratif',
              },
              {
                img: '/urun-turleri/gunes-kirici-perde.jpg',
                title: 'Güneş Kırıcı Stor (Screen)',
                desc: 'Güneş ışığını filtreler ve dışarısını görebilmenizi sağlarken UV ışınlarını engeller.',
                icon: <Sun className="w-4 h-4 text-slate-500" strokeWidth={1.5} />,
                badge: 'UV Koruma',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-[20px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="relative w-full h-[190px] overflow-hidden">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5 flex flex-col gap-2 flex-grow">
                  <h3 className="text-[15px] font-bold text-slate-800 leading-snug">{item.title}</h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed flex-grow">{item.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-500 border border-slate-100 bg-slate-50 rounded-full px-3 py-1 w-fit">
                    {item.icon}
                    {item.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <section className="w-full bg-[#f3f4f6] py-20">
        <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-10">

          <div className="text-center mb-14">
            <h2
              className="text-[32px] lg:text-[42px] font-extrabold text-slate-900 tracking-tight mb-4"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              Stor Perde Uygulama Alanları
            </h2>
            <p className="text-[15px] text-slate-500 font-medium">
              Stor Perdeler, çeşitli ticari mekanlarda estetik ve fonksiyonel çözümler sunar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                img: '/modern-istanbul.png',
                title: 'Ofisler',
                desc: 'Ofis ortamlarında verimliliği ve mahremiyet artırır.',
              },
              {
                img: '/kurumsal-banka.png',
                title: 'Bankalar',
                desc: 'Bankalarda şık bir görünüm ve güvenlik sağlar.',
              },
              {
                img: '/bodrum-mugla.png',
                title: 'Oteller',
                desc: 'Otellerde estetik ve rahat bir ortam sunar.',
              },
            ].map((area, i) => (
              <div key={i} className="bg-white rounded-[20px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                <div className="relative w-full h-[200px] overflow-hidden">
                  <Image src={area.img} alt={area.title} fill className="object-cover" />
                </div>
                <div className="p-6 flex flex-col items-center text-center gap-3 flex-grow">
                  <h3 className="text-[18px] font-bold text-slate-800">{area.title}</h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{area.desc}</p>
                  <Link
                    href="?teklif=true"
                    scroll={false}
                    className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-slate-600 border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-full transition-colors"
                  >
                    Detaylı İncele <span className="text-slate-400">›</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <section className="w-full bg-white py-20">
        <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-10">

          <div className="text-center mb-14">
            <h2
              className="text-[32px] lg:text-[42px] font-extrabold text-slate-900 tracking-tight mb-4"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              Projelerimiz
            </h2>
            <p className="text-[15px] text-slate-500 font-medium">
              Stor perde sistemlerimizin kullanıldığı bazı örnek projelerimize göz atın.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { img: '/modern-istanbul.png', label: 'Toplantı Odası' },
              { img: '/yonetim-kurulu.png', label: 'Open Office' },
              { img: '/kurumsal-banka.png', label: 'Banka Şubesi' },
              { img: '/rezidans-uygulamasi.png', label: 'Yönetici Odası' },
              { img: '/mimar-ofis.png', label: 'Banka Şubesi' },
              { img: '/klinik.png', label: 'Klinik / Hastane' },
            ].map((proj, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="relative w-full h-[200px] rounded-[16px] overflow-hidden">
                  <Image src={proj.img} alt={proj.label} fill className="object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <p className="text-[14px] font-semibold text-slate-600 text-center">{proj.label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>


      <main className="flex-grow w-full max-w-[1280px] mx-auto px-6 lg:px-10 py-20">
        <div className="text-center mb-14">
          <h2 className="text-[32px] lg:text-[40px] font-extrabold text-slate-900 tracking-tight mb-3">
            Ürün Kategorilerimiz
          </h2>
          <p className="text-[16px] text-slate-500 font-medium">
            Kurumsal ve ticari projeler için beş farklı kategori
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesData.map((cat) => (
            <Link
              key={cat.slug}
              href={`/kategoriler/${cat.slug}`}
              className="group relative rounded-[24px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-white"
            >
              <div className="relative w-full h-[220px] overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                    {cat.icon}
                  </div>
                  <h3 className="text-[17px] font-bold text-slate-800 leading-tight">{cat.title}</h3>
                </div>
                <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">{cat.shortDesc}</p>
                <div className="mt-4 flex items-center gap-1.5 text-[13px] font-bold text-[#448b97] group-hover:gap-3 transition-all">
                  İncele
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <section className="w-full bg-[#fdfdfd] py-10 pb-20">
        <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="relative w-full rounded-[32px] overflow-hidden min-h-[460px] flex flex-col items-center justify-center text-center px-6 py-16 shadow-2xl">
            <Image
              src="/katagori-alimuyum.png"
              alt="CTA Background"
              fill
              className="object-cover z-0"
            />
            <div className="absolute inset-0 bg-[#1c1c1e]/60 z-10" />

            <div className="relative z-20 flex flex-col items-center gap-6 max-w-4xl w-full my-8">
              <h2 className="text-[36px] lg:text-[48px] font-extrabold text-white tracking-tight leading-tight drop-shadow-md" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                Projenize Özel Stor Perde Teklifi Alın
              </h2>
              <p className="text-[17px] lg:text-[19px] text-white font-medium leading-relaxed max-w-2xl drop-shadow-md">
                Ofis, banka ve ticari alanlar için ölçüye özel stor perde çözümleri. Ücretsiz keşif ve hızlı fiyatlandırma için hemen iletişime geçin.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 text-[15px] text-white font-semibold mt-2 drop-shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/80 flex items-center justify-center border border-emerald-400">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                  Ücretsiz Keşif
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/80 flex items-center justify-center border border-emerald-400">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                  Uygun Fiyat Teklifi
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 w-full sm:w-auto">
                <Link
                  href="?teklif=true"
                  scroll={false}
                  className="bg-[#2b4c59] hover:bg-[#366070] text-white px-10 py-4 rounded-xl font-bold text-[16px] transition-all shadow-[0_8px_30px_rgb(0,0,0,0.3)] w-full sm:w-auto"
                >
                  Ücretsiz Teklif Al
                </Link>
                <Link
                  href="tel:05336910584"
                  className="bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/40 text-white px-10 py-4 rounded-xl font-bold text-[16px] transition-all flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.2)] w-full sm:w-auto"
                >
                  <Phone className="w-5 h-5 text-emerald-400" />
                  Hemen Ara
                </Link>
              </div>

              <p className="text-[13px] text-white/90 mt-4 drop-shadow-md">
                Uzman ekibimiz en kısa sürede size geri dönüş yapacaktır.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
