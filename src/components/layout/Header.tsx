'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Phone, Menu, X, Search as SearchIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/contexts/SettingsContext';
import { categoriesData } from '@/data/categories';
import SearchModal from '@/components/ui/SearchModal';

export default function Header({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const isKategoriler = pathname ? categoriesData.some(c => pathname === `/${c.slug}`) : false;
  const isHakkimizda = pathname === '/hakkimizda';
  const { settings } = useSettings();
  const ctaPhoneStrip = (settings.navbar.ctaPhone || settings.contact.phone).replace(/\D/g, '');

  return (
    <>
      <style>{`
        @media (min-width: 1280px) { 
          .nav-link-item { font-size: var(--nav-ld) !important; } 
          .corp-link-item { font-size: var(--corp-ld) !important; }
          .nav-phone-btn span { font-size: var(--nav-pd) !important; }
          .nav-phone-btn span:first-child { font-size: calc(var(--nav-pd) * 0.7) !important; }
          .search-icon-svg { width: var(--search-ld, 14px) !important; height: var(--search-ld, 14px) !important; color: var(--search-col, currentColor) !important; }
        }
        @media (max-width: 1279px) { 
          .nav-link-item { font-size: var(--nav-lm) !important; } 
          .corp-link-item { font-size: var(--corp-lm) !important; }
          .nav-phone-btn span { font-size: var(--nav-pm) !important; }
          .nav-phone-btn span:first-child { font-size: calc(var(--nav-pm) * 0.7) !important; }
          .search-icon-svg { width: var(--search-lm, 24px) !important; height: var(--search-lm, 24px) !important; color: var(--search-col, currentColor) !important; }
        }
      `}</style>
      <header
        className="fixed top-0 inset-x-0 w-full z-[100] border-b bg-white/95 backdrop-blur-md border-slate-200 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300"
        style={{
          ['--search-col' as string]: settings.navbar.searchIconColor || '#475569',
          ['--search-ld' as string]: settings.navbar.searchIconSizeDesktop || '14px',
          ['--search-lm' as string]: settings.navbar.searchIconSizeMobile || '24px',
        } as React.CSSProperties}
      >
        <div className="w-full mx-auto px-4 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between h-[90px] w-full">

            <div className="flex-shrink-0 flex items-center group">
              <Link href="/" className="hover:opacity-80 transition-opacity flex items-center h-full">
                <img
                  src={settings.logos?.headerLogo || "/koyulogo.png"}
                  alt="Perdens Perde"
                  className="w-[200px] lg:w-[200px] h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>

            <div className="hidden xl:flex items-center justify-center gap-4 text-[12px] font-bold tracking-wide uppercase"
              style={{
                color: settings.navbar.navTextColor || '#1e293b',
                fontFamily: settings.navbar.navFont !== 'Var' ? settings.navbar.navFont : undefined,
                ['--nav-ld' as string]: settings.navbar.navLinkSizeDesktop || '',
                ['--nav-lm' as string]: settings.navbar.navLinkSizeMobile || settings.navbar.navLinkSizeDesktop || '',
              } as React.CSSProperties}>

              {(settings.homeCategories?.cards || []).map((cat, idx) => (
                <span key={cat.slug} className="flex items-center gap-4">
                  <Link href={`/${cat.slug}`} className="nav-link-item hover:opacity-70 transition-opacity whitespace-nowrap">{cat.title.toUpperCase()}</Link>
                  {idx < (settings.homeCategories.cards.length - 1) && <div className="w-px h-3 bg-slate-300" />}
                </span>
              ))}

              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center justify-center w-8 h-8 ml-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors border border-slate-200 flex-shrink-0 group"
                aria-label="Arama"
              >
                <SearchIcon className="search-icon-svg group-hover:brightness-50 transition-all" />
              </button>

              <Link href="?teklif=true" scroll={false} className="group flex items-center ml-2 pl-3 pr-4 py-1.5 bg-slate-50 hover:bg-red-50 border border-slate-200 rounded-full hover:border-red-100 transition-all duration-300 text-slate-800 hover:text-red-700">
                <span className="relative flex h-2 w-2 mr-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600 group-hover:bg-red-500"></span>
                </span>
                <span className="nav-link-item">TEKLİF AL</span>
              </Link>
            </div>

            <div className="hidden lg:flex flex-col items-center justify-center h-full gap-2 pt-1">
              <a href={`tel:${ctaPhoneStrip}`}
                style={{
                  backgroundColor: settings.navbar.ctaColor,
                  borderColor: settings.navbar.ctaColor,
                  fontFamily: settings.navbar.ctaFont !== 'Var' ? settings.navbar.ctaFont : undefined,
                  ['--nav-pd' as string]: settings.navbar.ctaPhoneSizeDesktop || '',
                  ['--nav-pm' as string]: settings.navbar.ctaPhoneSizeMobile || settings.navbar.ctaPhoneSizeDesktop || '',
                } as React.CSSProperties}
                className="nav-phone-btn group flex items-center hover:opacity-90 border rounded-[12px] pl-2 pr-4 py-2 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <div className="w-7 h-7 rounded-[8px] bg-white flex items-center justify-center mr-2.5 group-hover:scale-105 transition-transform shadow-sm" style={{ color: settings.navbar.ctaColor }}>
                  <Phone size={13} className="fill-current" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest leading-none mb-1" style={{ color: settings.navbar.ctaTextColor || '#fff' }}>{settings.navbar.ctaText}</span>
                  <span className="text-[13px] font-extrabold tracking-wide leading-none" style={{ color: settings.navbar.ctaTextColor || '#fff' }}>{settings.navbar.ctaPhone || settings.contact.phone}</span>
                </div>
              </a>

              <div className="flex items-center gap-3 font-bold uppercase tracking-widest px-1 mt-0.5"
                style={{
                  color: settings.navbar.corpLinkTextColor || settings.navbar.navTextColor || '#94a3b8',
                  fontFamily: settings.navbar.corpLinkFont !== 'Var' ? settings.navbar.corpLinkFont : undefined,
                  ['--corp-ld' as string]: settings.navbar.corpLinkSizeDesktop || '10px',
                  ['--corp-lm' as string]: settings.navbar.corpLinkSizeMobile || settings.navbar.corpLinkSizeDesktop || '10px',
                } as React.CSSProperties}>
                <Link href="/hakkimizda" className="corp-link-item hover:opacity-70 transition-opacity">HAKKIMIZDA</Link>
                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                <Link href="/blog" className="corp-link-item hover:opacity-70 transition-opacity">BLOG</Link>
                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                <Link href="/iletisim" className="corp-link-item hover:opacity-70 transition-opacity">İLETİŞİM</Link>
              </div>
            </div>

            <div className="flex xl:hidden items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-lg transition-colors hover:bg-slate-100"
                aria-label="Arama"
              >
                <SearchIcon className="search-icon-svg" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg transition-colors text-slate-800 hover:bg-slate-100"
                aria-label="Menüyü aç/kapat"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[90] bg-zinc-950/95 backdrop-blur-xl transition-all duration-300 xl:hidden flex flex-col pt-24 pb-20 px-6 overflow-y-auto ${isMobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
          }`}
      >
        <div className="flex flex-col gap-4 text-[13px] font-bold tracking-widest uppercase text-white/90">

          <div className="border-b border-white/10 pb-4 mb-2">
            <div className="text-white/50 text-[10px] mb-4">Kategoriler</div>
            <div className="flex flex-col pl-4">
              {(settings.homeCategories?.cards || []).map((cat) => (
                <Link key={cat.slug} href={`/${cat.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-emerald-400 transition-colors">{cat.title.toUpperCase()}</Link>
              ))}
            </div>
          </div>

          <div className="text-white/50 text-[10px] mt-2 mb-4">Kurumsal</div>
          <div className="flex flex-col gap-4 pl-4">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-emerald-400 transition-colors">Ana Sayfa</Link>
            <Link href="/hakkimizda" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-emerald-400 transition-colors">Hakkımızda</Link>
            <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-emerald-400 transition-colors">Blog</Link>
            <Link href="/iletisim" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-emerald-400 transition-colors">İletişim</Link>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4">
            <a href={`tel:${ctaPhoneStrip}`}
              style={{
                backgroundColor: settings.navbar.ctaColor,
                borderColor: settings.navbar.ctaColor,
                fontFamily: settings.navbar.ctaFont !== 'Var' ? settings.navbar.ctaFont : undefined,
                color: settings.navbar.ctaTextColor || '#fff',
                ['--nav-pm' as string]: settings.navbar.ctaPhoneSizeMobile || settings.navbar.ctaPhoneSizeDesktop || '',
              } as React.CSSProperties}
              className="nav-phone-btn flex items-center justify-center space-x-2 px-4 py-4 rounded-xl border transition-colors hover:opacity-90">
              <Phone size={18} className="fill-current" />
              <span className="font-extrabold text-[15px]">{settings.navbar.ctaPhone || settings.contact.phone}</span>
            </a>

            <Link href="?teklif=true" scroll={false} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center px-5 py-4 rounded-xl transition-all duration-300 bg-white text-zinc-900 border border-white hover:bg-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2.5 animate-pulse"></span>
              <span className="text-[14px] font-extrabold tracking-widest nav-link-item">TEKLİF AL</span>
            </Link>
          </div>

        </div>
      </div>


      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
