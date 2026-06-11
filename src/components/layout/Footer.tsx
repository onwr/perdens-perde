'use client';

import Link from 'next/link';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);

import { useSettings } from '@/contexts/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();
  const phoneStrip = settings.contact.phone.replace(/\D/g, '');
  return (
    <footer id="iletisim" className="w-full" style={{ backgroundColor: settings.footer.backgroundColor, color: settings.footer.textColor, fontFamily: settings.footer.fontFamily !== 'Var' ? settings.footer.fontFamily : undefined }}>
      <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-10 py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 justify-between pb-10 border-b border-white/10">
          <div className="max-w-[260px] lg:max-w-[300px]">
            <img src={settings.logos?.footerLogo || "/logo.png"} alt="Perdens Perde" style={{ width: '200px', height: '60px' }} className="object-contain brightness-0 invert mb-3 opacity-90" />
            <p className="text-[13px] leading-relaxed" style={{ color: settings.footer.textColor, opacity: 0.8 }}>
              {settings.footer.aboutText}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-8 lg:gap-8">
            {(settings.footer.groups || []).map((group) => {
              const groupLinks = (settings.footer.quickLinks || []).filter(l => l.groupId === group.id);
              return (
                <div key={group.id} className="order-2 lg:order-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: settings.footer.textColor, opacity: 0.6 }}>{group.title}</h4>
                  <ul className="space-y-2.5">
                    {groupLinks.map(({ label, href }) => (
                      <li key={label}><Link href={href} scroll={!href.startsWith('?')} className="text-[13px] hover:opacity-100 transition-colors" style={{ color: settings.footer.textColor, opacity: 0.8 }}>{label}</Link></li>
                    ))}
                  </ul>
                </div>
              );
            })}
            <div className="col-span-2 sm:col-span-1 order-1 lg:order-2 mb-2 lg:mb-0">
              <h4 className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: settings.footer.textColor, opacity: 0.6 }}>{settings.footer.contactTitle || 'İletişim'}</h4>
              <ul className="space-y-3">
                <li>
                  <a href={`tel:${phoneStrip}`} className="flex items-center gap-2 text-[13px] hover:opacity-100 transition-colors" style={{ color: settings.footer.textColor, opacity: 0.8 }}>
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    {settings.contact.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${settings.contact.email}`} className="flex items-center gap-2 text-[13px] hover:opacity-100 transition-colors" style={{ color: settings.footer.textColor, opacity: 0.8 }}>
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    {settings.contact.email}
                  </a>
                </li>
                <li>
                  <a href={`https://wa.me/90${phoneStrip.slice(-10)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[13px] text-[#25D366] hover:opacity-100 transition-colors">
                    <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" /> WhatsApp&apos;tan Yazın
                  </a>
                </li>
                <li className="flex items-start gap-2 text-[13px]" style={{ color: settings.footer.textColor, opacity: 0.8 }}>
                  <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {settings.contact.address}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-6">
          <p className="text-[12px]" style={{ color: settings.footer.textColor, opacity: 0.6 }}>{settings.footer.copyrightText}</p>
          <p className="text-[12px]" style={{ color: settings.footer.textColor, opacity: 0.6 }}>{settings.footer.designerText || 'Tasarım & Yazılım: Kürkaya Yazılım'}</p>
        </div>

      </div>
    </footer>
  );
}
