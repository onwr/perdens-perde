'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useSettings } from '@/contexts/SettingsContext';

export default function Hero() {
  const { settings } = useSettings();

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">

      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src={settings.hero.bgImage || "/hero.png"}
          alt="Kurumsal Mekanlar İçin Perde Çözümleri"
          fill
          className="object-cover object-center scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      <svg className="absolute top-28 left-10 w-36 h-36 text-white/8 z-10 pointer-events-none" viewBox="0 0 144 144" fill="none">
        <rect x="1" y="1" width="142" height="142" rx="12" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
        <rect x="20" y="20" width="104" height="104" rx="8" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="72" cy="72" r="30" stroke="currentColor" strokeWidth="0.5" />
      </svg>

      <svg className="absolute bottom-24 right-10 w-28 h-28 text-white/8 z-10 pointer-events-none" viewBox="0 0 112 112" fill="none">
        <circle cx="56" cy="56" r="55" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="56" cy="56" r="35" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="56" cy="56" r="5" fill="currentColor" opacity="0.3" />
      </svg>

      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 pointer-events-none hidden xl:flex flex-col gap-3 pl-8">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="h-px bg-white/20" style={{ width: `${28 - i * 4}px` }} />
        ))}
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 pointer-events-none hidden xl:flex flex-col gap-3 pr-8 items-end">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="h-px bg-white/20" style={{ width: `${28 - i * 4}px` }} />
        ))}
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center mt-12">

        <h1 
          className="hero-title text-[34px] sm:text-5xl md:text-6xl lg:text-[76px] font-bold text-white mb-4 leading-[1.1] tracking-tight drop-shadow-lg flex flex-col items-center gap-1"
          style={{
            fontFamily: settings.hero.titleFont !== 'Var' ? settings.hero.titleFont : undefined,
            ['--ts-d' as string]: settings.hero.titleSizeDesktop || '',
            ['--ts-m' as string]: settings.hero.titleSizeMobile || settings.hero.titleSizeDesktop || '',
          } as React.CSSProperties}
        >
          <span>{settings.hero.titleLine1}</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
            {settings.hero.titleHighlight}
          </span>
        </h1>

        <style>{`
          @media (min-width: 768px) {
            .hero-title { font-size: var(--ts-d) !important; }
            .hero-subtitle { font-size: var(--ts-sub-d) !important; }
          }
          @media (max-width: 767px) {
            .hero-title { font-size: var(--ts-m) !important; }
            .hero-subtitle { font-size: var(--ts-sub-m) !important; }
          }
        `}</style>

        <div className="flex items-center justify-center w-full max-w-[280px] sm:max-w-[400px] mx-auto mb-8 sm:mb-10 mt-4 opacity-80">
          <div className="h-[1px] w-full bg-gradient-to-l from-white/70 to-transparent" />
          <div className="h-[4px] w-[4px] rounded-full bg-white mx-3 sm:mx-5 flex-shrink-0" />
          <div className="h-[1px] w-full bg-gradient-to-r from-white/70 to-transparent" />
        </div>

        <p 
          className="hero-subtitle text-base sm:text-lg md:text-2xl text-white/85 mb-10 sm:mb-12 font-medium max-w-3xl leading-relaxed drop-shadow-md px-2"
          style={{
            fontFamily: settings.hero.subtitleFont !== 'Var' ? settings.hero.subtitleFont : undefined,
            ['--ts-sub-d' as string]: settings.hero.subtitleSizeDesktop || '',
            ['--ts-sub-m' as string]: settings.hero.subtitleSizeMobile || settings.hero.subtitleSizeDesktop || '',
          } as React.CSSProperties}
        >
          {settings.hero.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {(settings.hero.buttons || []).map((btn) => {
            const phoneStrip2 = btn.type === 'phone' ? btn.link.replace(/\D/g, '') : '';
            const href = btn.type === 'phone' ? `tel:${phoneStrip2}` : btn.link;
            const isTransparent = btn.color === 'transparent';
            
            const btnContent = (
              <>
                {btn.type === 'phone' && (
                  <svg className="w-4 h-4 mr-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.273-3.973-6.869-6.87l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                )}
                {btn.text}
              </>
            );

            const className = "inline-flex items-center justify-center px-9 py-5 font-semibold text-[16px] rounded-[12px] transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 border border-white/10";
            const style = {
              backgroundColor: isTransparent ? undefined : btn.color,
              color: btn.textColor,
              fontFamily: btn.font !== 'Var' ? btn.font : undefined,
              ...(isTransparent && { background: 'transparent' })
            };

            if (btn.type === 'phone' || href.startsWith('http')) {
              return (
                <a key={btn.id} href={href} className={className} style={style}>
                  {btnContent}
                </a>
              );
            }

            return (
              <Link key={btn.id} href={href} scroll={!href.startsWith('?')} className={className} style={style}>
                {btnContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
