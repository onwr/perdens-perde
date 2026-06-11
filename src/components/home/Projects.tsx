'use client';

import { useSettings } from '@/contexts/SettingsContext';

export default function Projects() {
  const { settings } = useSettings();
  const hoverZoom = settings.homeProjects.hoverZoom !== false;
  const items = settings.homeProjects.items || [];

  return (
    <section className="w-full bg-white border-t border-slate-100">
      
      {settings.homeProjects.bannerImage && (
        <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-10 mt-16 mb-8">
          <div className="relative w-full h-[220px] lg:h-[280px] overflow-hidden rounded-tl-[28px] rounded-tr-[28px]">
            <img
              src={settings.homeProjects.bannerImage}
              alt="Projeler Banner"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>
      )}

      <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-10 pb-16 lg:pb-20 pt-4" style={{ fontFamily: settings.homeProjects.fontFamily !== 'Var' ? settings.homeProjects.fontFamily : undefined }}>

        <div className="text-center mb-12">
          <style>{`
            @media (min-width: 768px) { .proj-title { font-size: var(--pr-td) !important; } .proj-sub { font-size: var(--pr-sd) !important; } }
            @media (max-width: 767px) { .proj-title { font-size: var(--pr-tm) !important; } .proj-sub { font-size: var(--pr-sm) !important; } }
          `}</style>
          <h2 className="proj-title text-[32px] lg:text-[40px] font-extrabold text-slate-900 tracking-tight mb-4"
            style={{
              ['--pr-td' as string]: settings.homeProjects.titleSizeDesktop || '',
              ['--pr-tm' as string]: settings.homeProjects.titleSizeMobile || settings.homeProjects.titleSizeDesktop || '',
            } as React.CSSProperties}>
            {settings.homeProjects.title}
          </h2>
          {settings.homeProjects.subtitle && (
            <p className="proj-sub text-[16px] text-slate-500 font-medium max-w-2xl mx-auto"
              style={{
                ['--pr-sd' as string]: settings.homeProjects.subtitleSizeDesktop || '',
                ['--pr-sm' as string]: settings.homeProjects.subtitleSizeMobile || settings.homeProjects.subtitleSizeDesktop || '',
              } as React.CSSProperties}>
              {settings.homeProjects.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((project, i) => {
            return (
              <div
                key={i}
                className="relative aspect-[4/5] rounded-[20px] overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-500"
              >
                 <img
                   src={project.img || 'https://via.placeholder.com/600x800'}
                   alt={project.label}
                   className={`w-full h-full object-cover object-center transition-transform duration-[1200ms] ${hoverZoom ? 'group-hover:scale-[1.06]' : ''}`}
                 />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/10 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full px-5 py-5">
                  <span className="text-white font-bold text-[16px] drop-shadow-sm">
                    {project.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
