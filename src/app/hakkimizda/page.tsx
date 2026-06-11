'use client';

import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/ui/FloatingButtons';
import Cta from '@/components/home/Cta';
import { Target, Gem, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

export default function Hakkimizda() {
  const { settings } = useSettings();
  const data = settings.hakkimizda;

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfd]">
      <style>{`
        @media (min-width: 768px) {
          .dyn-hero-t { font-size: var(--hak-td) !important; }
          .dyn-hero-s { font-size: var(--hak-sd) !important; }
          .dyn-abt-t { font-size: var(--hak-ad) !important; }
        }
        @media (max-width: 767px) {
          .dyn-hero-t { font-size: var(--hak-tm) !important; }
          .dyn-hero-s { font-size: var(--hak-sm) !important; }
          .dyn-abt-t { font-size: var(--hak-am) !important; }
        }
      `}</style>
      <Header />

      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center mt-[90px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={data.heroImage || '/hero.png'}
            alt="Perdens Perde Hakkımızda"
            fill
            className="object-cover object-center scale-105"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/60 z-10" />
        </div>

        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="dyn-hero-t text-[38px] sm:text-[56px] lg:text-[72px] font-extrabold text-white tracking-tight drop-shadow-lg leading-[1.1] mb-6"
            style={{
              fontFamily: data.fontFamily !== 'Var' ? data.fontFamily : "inherit",
              ['--hak-td' as string]: data.heroTitleSizeDesktop || '',
              ['--hak-tm' as string]: data.heroTitleSizeMobile || data.heroTitleSizeDesktop || ''
            } as React.CSSProperties}>
            {data.heroTitle}
          </h1>
          <p className="dyn-hero-s text-[16px] sm:text-[20px] text-white/90 font-medium max-w-2xl leading-relaxed drop-shadow-md"
            style={{
              ['--hak-sd' as string]: data.heroSubtitleSizeDesktop || '',
              ['--hak-sm' as string]: data.heroSubtitleSizeMobile || data.heroSubtitleSizeDesktop || ''
            } as React.CSSProperties}>
            {data.heroSubtitle}
          </p>
        </div>
      </section>

      <section className="w-full py-20 lg:py-32 px-6 lg:px-10 max-w-[1280px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="w-full lg:w-1/2 relative h-[380px] sm:h-[500px] lg:h-[600px] rounded-[32px] flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-100 rounded-full blur-[80px] opacity-60 z-0" />

            <div className="absolute left-0 top-0 w-[70%] h-[75%] rounded-[32px] overflow-hidden shadow-2xl z-20 border-8 border-white">
              <Image
                src={data.aboutImage || '/yonetim-kurulu.png'}
                alt="Perdens Perde Proje"
                fill
                className="object-cover"
                unoptimized={true}
              />
            </div>

            <div className="absolute right-0 bottom-0 w-[60%] h-[60%] rounded-[32px] overflow-hidden shadow-2xl z-30 border-8 border-white bg-slate-200">
              <Image
                src={data.aboutImage2 || '/KurumsalPerde-Image/ofisresim.jpg'}
                alt="Ofis Projesi"
                fill
                className="object-cover"
                unoptimized={true}
              />
            </div>

            <div className="absolute top-[5%] right-2 sm:top-[10%] sm:-right-4 z-40 bg-white p-4 sm:p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-slate-100 flex items-center gap-3 sm:gap-4">
              <div className="text-[28px] sm:text-[32px] font-black text-red-600 leading-none">{data.experienceYears || '10+'}</div>
              <div className="text-[11px] sm:text-[13px] font-bold text-slate-600 leading-tight uppercase tracking-wider whitespace-pre-wrap">{data.experienceText || 'Yıllık\nTecrübe'}</div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-[2px] bg-red-600" />
              <span className="text-[13px] font-bold text-red-600 uppercase tracking-widest">Hikayemiz</span>
            </div>

            <h2 className="dyn-abt-t text-[36px] lg:text-[44px] font-extrabold text-[#1e293b] leading-[1.1] tracking-tight mb-8"
              style={{
                fontFamily: data.fontFamily !== 'Var' ? data.fontFamily : "inherit",
                ['--hak-ad' as string]: data.aboutTitleSizeDesktop || '',
                ['--hak-am' as string]: data.aboutTitleSizeMobile || data.aboutTitleSizeDesktop || ''
              } as React.CSSProperties}>
              {data.aboutTitle}
            </h2>

            <div className="text-[17px] text-slate-600 leading-relaxed font-medium space-y-6 whitespace-pre-wrap">
              {data.aboutText}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {(data.features || []).map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-500 w-6 h-6 shrink-0" />
                  <span className="text-slate-700 font-bold">{feature}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <section className="w-full py-20 lg:py-28 bg-slate-50 border-y border-slate-200/60 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.25] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-[36px] lg:text-[44px] font-extrabold text-slate-900 mb-4 tracking-tight" style={{ fontFamily: data.fontFamily !== 'Var' ? data.fontFamily : "inherit" }}>
              {data.valuesTitle || 'Neden Perdens Perde?'}
            </h2>
            <p className="text-[17px] text-slate-500 font-medium leading-relaxed">
              {data.valuesSubtitle || 'Kurumsal projelerde bizi tercih etmeniz için temel değerlerimiz ve standartlarımız.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(data.values || []).map((item, idx) => {
              const bgColors = ['bg-red-50 text-red-600', 'bg-emerald-50 text-emerald-600', 'bg-blue-50 text-blue-600', 'bg-orange-50 text-orange-600'];
              const colorClass = bgColors[idx % bgColors.length];

              // @ts-ignore
              const Icon = LucideIcons[item.icon] || LucideIcons.CheckCircle2;

              return (
                <div key={idx} className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-start">
                  <div className={`w-14 h-14 ${colorClass} rounded-[16px] flex items-center justify-center mb-6`}>
                    <Icon size={28} strokeWidth={2} />
                  </div>
                  <h3 className="text-[20px] font-extrabold text-slate-800 mb-3">{item.title}</h3>
                  <p className="text-[15px] text-slate-500 font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. GLOBAL CTA BANNER ── */}
      <div className="bg-slate-50 w-full pb-10">
        <Cta />
      </div>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
