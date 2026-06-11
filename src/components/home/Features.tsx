'use client';

import { useEffect, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const DEFAULT_DATA = {
  bannerImage: '/anasayfa/ana1.jpg',
  sectionTitle: 'Öne Çıkan Özellikler',
  fontFamily: 'Var',
  hoverEffect: true,
  items: [
    { title: 'Kurumsal Projelere Özel Çözümler', description: 'Ofis, otel ve ticari alanlara uygun perde sistemleri', iconName: 'Building2' },
    { title: 'Ücretsiz Keşif ve Ölçülendirme',  description: 'Yerinde ölçüm ve doğru planlama', iconName: 'ClipboardCheck' },
    { title: 'Hızlı ve Planlı Üretim',          description: 'Proje takvimine uygun teslim', iconName: 'Zap' },
    { title: 'Uzman Ekip ve Montaj',             description: 'Sorunsuz ve temiz uygulama', iconName: 'Wrench' },
  ],
};

export default function Features() {
  const [data, setData] = useState({ ...DEFAULT_DATA, titleSizeDesktop: '', titleSizeMobile: '' });

  useEffect(() => {
    getDoc(doc(db, 'settings', 'features'))
      .then((snap) => {
        if (snap.exists()) {
          const d = snap.data();
          setData({
            bannerImage: d.bannerImage || DEFAULT_DATA.bannerImage,
            sectionTitle: d.sectionTitle || DEFAULT_DATA.sectionTitle,
            fontFamily: d.fontFamily || DEFAULT_DATA.fontFamily,
            hoverEffect: d.hoverEffect !== false,
            titleSizeDesktop: d.titleSizeDesktop || '',
            titleSizeMobile: d.titleSizeMobile || '',
            items: Array.isArray(d.items) && d.items.length === 4 ? d.items.map((it, i) => ({ ...DEFAULT_DATA.items[i], ...it })) : DEFAULT_DATA.items,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="w-full bg-white border-t border-slate-100" style={{ fontFamily: data.fontFamily !== 'Var' ? data.fontFamily : undefined }}>

      <style>{`
        @media (min-width: 1024px) { .features-title { font-size: var(--ft-d) !important; } }
        @media (max-width: 1023px) { .features-title { font-size: var(--ft-m) !important; } }
      `}</style>

      <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="relative w-full h-[220px] lg:h-[280px] overflow-hidden rounded-tl-[28px] rounded-tr-[28px]">
          <img
            src={data.bannerImage}
            alt="Kurumsal Perde Projeleri"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>

      <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-20">

        <h2 className="features-title text-[32px] lg:text-[40px] font-extrabold text-slate-900 text-center mb-14 tracking-tight"
          style={{
            // @ts-ignore
            ['--ft-d' as string]: data.titleSizeDesktop || '',
            // @ts-ignore
            ['--ft-m' as string]: data.titleSizeMobile || data.titleSizeDesktop || '',
          } as React.CSSProperties}>
          {data.sectionTitle}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.items.map((feature, index) => {
            // @ts-ignore
            const Icon = LucideIcons[feature.iconName] || LucideIcons.Building2;
            return (
              <div
                key={index}
                className={`bg-slate-50/80 border border-slate-100 rounded-[24px] p-8 flex flex-col items-center text-center gap-5 transition-all duration-300 ${data.hoverEffect ? 'hover:shadow-md hover:-translate-y-1' : ''}`}
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                  <Icon className="w-7 h-7 text-slate-500" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-slate-800 mb-2 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-[14px] text-slate-500 font-medium leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
