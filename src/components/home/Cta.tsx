'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useSettings } from '@/contexts/SettingsContext';

export default function Cta() {
  const { settings } = useSettings();
  const phoneStrip = settings.contact.phone.replace(/\D/g, '');

  return (
    <section className="w-full bg-[#fdfdfd] py-10 pb-20">
      <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="relative w-full rounded-[32px] overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center px-6 py-16 shadow-2xl">
          <Image 
            src={settings.homeCta.bgImage || "/urun-turleri/ciftmekanizma.jpg"}
            alt="Kurumsal Perde Çözümleri" 
            fill 
            className="object-cover z-0" 
          />
          <div className="absolute inset-0 bg-[#1c1c1e]/75 z-10" />
          
          <div className="relative z-20 flex flex-col items-center gap-4 max-w-3xl w-full my-4">
            <style>{`
              @media (min-width: 768px) { .cta-title { font-size: var(--ct-td) !important; } .cta-sub { font-size: var(--ct-sd) !important; } }
              @media (max-width: 767px) { .cta-title { font-size: var(--ct-tm) !important; } .cta-sub { font-size: var(--ct-sm) !important; } }
            `}</style>
            <h2 className="cta-title text-[36px] lg:text-[48px] font-extrabold text-white tracking-tight leading-tight drop-shadow-md"
              style={{
                ['--ct-td' as string]: settings.homeCta.titleSizeDesktop || '',
                ['--ct-tm' as string]: settings.homeCta.titleSizeMobile || settings.homeCta.titleSizeDesktop || '',
              } as React.CSSProperties}>
              {settings.homeCta.title}
            </h2>
            <p className="cta-sub text-[17px] lg:text-[20px] text-white/90 font-medium leading-relaxed max-w-2xl drop-shadow-md"
              style={{
                ['--ct-sd' as string]: settings.homeCta.subtitleSizeDesktop || '',
                ['--ct-sm' as string]: settings.homeCta.subtitleSizeMobile || settings.homeCta.subtitleSizeDesktop || '',
              } as React.CSSProperties}>
              {settings.homeCta.subtitle}
            </p>
            
            <style>{`
              @media (min-width: 768px) { .cta-primary-btn { font-size: var(--ct-bd) !important; } .cta-call-btn { font-size: var(--ct-cd) !important; } }
              @media (max-width: 767px) { .cta-primary-btn { font-size: var(--ct-bm) !important; } .cta-call-btn { font-size: var(--ct-cm) !important; } }
            `}</style>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full sm:w-auto">
              <Link
                href="?teklif=true"
                scroll={false}
                className="cta-primary-btn text-white px-10 py-4 rounded-xl font-bold text-[16px] transition-all hover:-translate-y-0.5 shadow-xl w-full sm:w-auto"
                style={{
                  backgroundColor: settings.homeCta.btnColor,
                  fontFamily: settings.homeCta.btnFont !== 'Var' ? settings.homeCta.btnFont : undefined,
                  ['--ct-bd' as string]: settings.homeCta.primaryBtnSizeDesktop || '',
                  ['--ct-bm' as string]: settings.homeCta.primaryBtnSizeMobile || settings.homeCta.primaryBtnSizeDesktop || '',
                } as React.CSSProperties}
              >
                {settings.homeCta.btnText}
              </Link>
              <Link
                href={`tel:${phoneStrip}`}
                className="cta-call-btn backdrop-blur-md border border-white/40 px-10 py-4 rounded-xl font-bold text-[16px] transition-all flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.2)] w-full sm:w-auto hover:-translate-y-0.5"
                style={{
                  backgroundColor: settings.homeCta.callBtnColor || 'rgba(255,255,255,0.1)',
                  color: settings.homeCta.callBtnTextColor || '#ffffff',
                  ['--ct-cd' as string]: settings.homeCta.callBtnSizeDesktop || '',
                  ['--ct-cm' as string]: settings.homeCta.callBtnSizeMobile || settings.homeCta.callBtnSizeDesktop || '',
                } as React.CSSProperties}
              >
                {settings.homeCta.callBtnText || 'Hemen Ara'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
