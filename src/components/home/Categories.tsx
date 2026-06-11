'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Layers, AlignJustify, SlidersHorizontal, List, Wifi,
  Sun, Moon, Star, Home, Building, Lightbulb, Box,
  ShieldCheck, Settings as SetupIcon, Maximize, LayoutGrid, Palette, Droplet,
  Monitor, Cloud, Heart, Award, Camera, Hexagon
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSettings, defaultSettings } from '@/contexts/SettingsContext';

const iconMap: Record<string, any> = {
  Layers, AlignJustify, SlidersHorizontal, List, Wifi,
  Sun, Moon, Star, Home, Building, Lightbulb, Box,
  ShieldCheck, Settings: SetupIcon, Maximize, LayoutGrid, Palette, Droplet,
  Monitor, Cloud, Heart, Award, Camera, Hexagon
};

export default function Categories() {
  const [covers, setCovers] = useState<Record<string, string>>({});
  const { settings } = useSettings();

  useEffect(() => {
    getDoc(doc(db, 'settings', 'category_covers'))
      .then((snap) => {
        if (snap.exists()) setCovers(snap.data() as Record<string, string>);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="w-full bg-[#fdfdfd] py-16 lg:py-32 relative z-10 overflow-hidden" id="kategoriler">

      <div className="absolute inset-0 z-0 pointer-events-none opacity-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-[55%] h-[150%] bg-gradient-to-l from-slate-100 to-transparent transform rotate-12 translate-x-1/4 -translate-y-1/4 opacity-90 blur-[20px]"></div>
        <div className="absolute bottom-0 left-0 w-[45%] h-[120%] bg-gradient-to-r from-red-50 to-transparent transform -rotate-[15deg] -translate-x-1/3 translate-y-1/3 opacity-80 blur-[40px]"></div>

        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full border-[100px] border-slate-50 opacity-60"></div>

        <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '48px 48px' }}></div>
      </div>


      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-10 z-10" style={{ fontFamily: settings.homeCategories.fontFamily !== 'Var' ? settings.homeCategories.fontFamily : undefined }}>
        <style>{`
          @media (min-width: 768px) { .cat-title { font-size: var(--c-td) !important; } .cat-sub { font-size: var(--c-sd) !important; } }
          @media (max-width: 767px) { .cat-title { font-size: var(--c-tm) !important; } .cat-sub { font-size: var(--c-sm) !important; } }
        `}</style>
        <h2 className="cat-title text-[32px] md:text-[40px] lg:text-[52px] text-center font-extrabold text-slate-900 mb-4 tracking-[-0.02em]"
          style={{
            ['--c-td' as string]: settings.homeCategories.titleSizeDesktop || '',
            ['--c-tm' as string]: settings.homeCategories.titleSizeMobile || settings.homeCategories.titleSizeDesktop || '',
          } as React.CSSProperties}>
          {settings.homeCategories.title}
        </h2>
        {settings.homeCategories.subtitle && (
          <p className="cat-sub text-center text-slate-500 text-lg md:text-xl font-medium mb-12 lg:mb-20 max-w-2xl mx-auto"
            style={{
              ['--c-sd' as string]: settings.homeCategories.subtitleSizeDesktop || '',
              ['--c-sm' as string]: settings.homeCategories.subtitleSizeMobile || settings.homeCategories.subtitleSizeDesktop || '',
            } as React.CSSProperties}>
            {settings.homeCategories.subtitle}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
        {(settings.homeCategories.cards || []).map((cat, index) => {
            const fallbackMap: Record<string, string> = {
              'stor-perde': '/Perde-Image/stor-perde.png',
              'zebra-perde': '/Perde-Image/zebra-perde.jpg',
              'ahsap-jaluzi': '/Perde-Image/ahsap-jaluzi.jpg',
              'aluminyum-jaluzi': '/Perde-Image/alimunyum-jaluzi.jpg',
              'motorlu-sistemler': '/Perde-Image/motorlu-sistem.jpg',
            };
            const image = cat.image || covers[cat.slug] || fallbackMap[cat.slug] || '/urun-turleri/ciftmekanizma.jpg';
            const isExternal = image.startsWith('http');
            const IconComponent = iconMap[cat.icon] || iconMap['Layers'];

            return (
              <Link href={`/${cat.slug}`} key={index} className="bg-white/90 backdrop-blur-md rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-all duration-500 border border-slate-100 flex flex-col group cursor-pointer">

                <div className="relative w-full h-[380px] overflow-hidden bg-slate-100 border-b border-gray-50">
                  {isExternal ? (
                    <img
                      src={image}
                      alt={cat.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
                    />
                  ) : (
                    <Image
                      src={image}
                      alt={cat.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-in-out"
                    />
                  )}
                </div>

                <div className="flex flex-col items-center justify-center pt-10 pb-12 bg-white">
                  <div className="w-[84px] h-[84px] bg-[#f8fafc] rounded-[24px] flex items-center justify-center mb-6 border border-slate-100 shadow-inner group-hover:bg-slate-100 transition-colors duration-300">
                    <IconComponent size={40} className="text-slate-600 transition-colors group-hover:text-zinc-900" strokeWidth={1.5} />
                  </div>

                  <h3 className="text-[22px] font-extrabold text-slate-800 text-center tracking-tight">{cat.title}</h3>
                </div>

              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
