'use client';
import { useSettings } from '@/contexts/SettingsContext';

export default function Corporate() {
  const { settings } = useSettings();
  
  return (
    <section id="hakkimizda" className="w-full bg-white py-16 md:py-24 relative overflow-hidden border-t border-slate-100" style={{ fontFamily: settings.homeCorporate.fontFamily !== 'Var' ? settings.homeCorporate.fontFamily : undefined }}>

      <div className="absolute top-0 right-0 select-none pointer-events-none overflow-hidden opacity-30">
        <span className="text-[120px] md:text-[200px] font-black text-slate-50 leading-none tracking-tighter">
          CORP
        </span>
      </div>

      <div
        className="absolute top-0 left-0 w-80 h-80 pointer-events-none opacity-40 z-0"
        style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10">

        <div className="text-center mb-12 lg:mb-16">
          <style>{`
            @media (min-width: 768px) { .corp-title { font-size: var(--cr-td) !important; } .corp-sub { font-size: var(--cr-sd) !important; } }
            @media (max-width: 767px) { .corp-title { font-size: var(--cr-tm) !important; } .corp-sub { font-size: var(--cr-sm) !important; } }
          `}</style>
          <h2 className="corp-title text-[32px] sm:text-[40px] lg:text-[44px] font-extrabold text-[#111827] mb-4 tracking-tight leading-[1.2] max-w-4xl mx-auto"
            style={{
              ['--cr-td' as string]: settings.homeCorporate.titleSizeDesktop || '',
              ['--cr-tm' as string]: settings.homeCorporate.titleSizeMobile || settings.homeCorporate.titleSizeDesktop || '',
            } as React.CSSProperties}>
            {settings.homeCorporate.title}
          </h2>
          {settings.homeCorporate.subtitle && (
            <p className="corp-sub text-[16px] sm:text-[18px] text-[#6B7280] font-medium leading-relaxed max-w-3xl mx-auto"
              style={{
                ['--cr-sd' as string]: settings.homeCorporate.subtitleSizeDesktop || '',
                ['--cr-sm' as string]: settings.homeCorporate.subtitleSizeMobile || settings.homeCorporate.subtitleSizeDesktop || '',
              } as React.CSSProperties}>
              {settings.homeCorporate.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {(settings.homeCorporate.items || []).map((item, idx) => (
            <div key={idx} className="group flex flex-col items-center">
              <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden mb-4 bg-slate-100 relative">
                 {item.image ? (
                   <img 
                     src={item.image} 
                     alt={item.title} 
                     className={`w-full h-full object-cover transition-transform duration-500 ${(settings.homeCorporate.hoverZoom ?? true) ? 'group-hover:scale-110' : ''}`}
                   />
                 ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                     <span className="text-[11px] font-medium">Görsel yok</span>
                   </div>
                 )}
                 <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-extrabold text-[#1F2937] text-lg text-center leading-snug">
                {item.title}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
