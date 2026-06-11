"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LogOut, X, FileText, PenLine, Image as ImageIcon, Layers, Zap, Building2,
  ExternalLink, Menu, Palette, LayoutTemplate, LayoutPanelTop, LayoutPanelLeft,
  MonitorPlay, MessageSquareText, Handshake, Heading, Focus, MousePointerClick,
  CheckSquare, Globe, Settings
} from 'lucide-react';

import GelenTalepler from './components/GelenTalepler';
import BlogYonetimi from './components/BlogYonetimi';
import KategoriIcerik from './components/KategoriIcerik';
import TeklifPanelYonetimi from './components/TeklifPanelYonetimi';
import Galeriler from './components/Galeriler';
import OneCikanOzellikler from './components/OneCikanOzellikler';
import SiteAyarlari from './components/SiteAyarlari';
import TemaAyarlari from './components/TemaAyarlari';
import NavbarYonetimi from './components/NavbarYonetimi';
import FooterYonetimi from './components/FooterYonetimi';
import AnasayfaHeroYonetimi from './components/AnasayfaHeroYonetimi';
import AnasayfaKategorilerYonetimi from './components/AnasayfaKategorilerYonetimi';
import AnasayfaKurumsalYonetimi from './components/AnasayfaKurumsalYonetimi';
import AnasayfaProjelerYonetimi from './components/AnasayfaProjelerYonetimi';
import AnasayfaCtaYonetimi from './components/AnasayfaCtaYonetimi';
import HakkimizdaYonetimi from './components/HakkimizdaYonetimi';
import IletisimYonetimi from './components/IletisimYonetimi';
import SiteGenelYonetimi from './components/SiteGenelYonetimi';

type ActiveViewType =
  | 'tema' | 'navbar' | 'footer' | 'site' | 'genel'
  | 'anasayfaHero' | 'anasayfaKategoriler' | 'anasayfaKurumsal' | 'anasayfaProjeler' | 'anasayfaCta' | 'ozellikler'
  | 'kategoriIcerik' | 'hakkimizda' | 'iletisim' | 'teklifPanel'
  | 'galeriler'
  | 'talepler' | 'blog';

const NavItem = ({
  view, activeView, setActiveView, setIsSidebarOpen, icon: Icon, label, badge
}: { 
  view: ActiveViewType; 
  activeView: ActiveViewType; 
  setActiveView: (v: ActiveViewType) => void; 
  setIsSidebarOpen: (v: boolean) => void;
  icon: any; 
  label: string; 
  badge?: string 
}) => {
  const isActive = activeView === view;
  return (
    <button
      type="button"
      onClick={() => { setActiveView(view); setIsSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-[13px] transition-all duration-300 group ${
        isActive
          ? 'bg-gradient-to-r from-zinc-800 to-zinc-800/80 text-white shadow-md border border-white/10'
          : 'text-zinc-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
        isActive ? 'bg-white/15 text-white shadow-inner' : 'bg-white/5 text-zinc-500 group-hover:text-zinc-200'
      }`}>
        <Icon size={16} />
      </div>
      <span className="flex-1 text-left">{label}</span>
      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white/70 shadow-sm shrink-0" />}
      {badge && !isActive && (
        <span className="text-[10px] font-bold bg-white/10 text-zinc-400 px-1.5 py-0.5 rounded">{badge}</span>
      )}
    </button>
  );
};

const NavGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <p className="px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 opacity-90">{title}</p>
    <div className="space-y-0.5">{children}</div>
  </div>
);

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<ActiveViewType>('tema');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin');
  };

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#f4f5f7] text-slate-800 flex font-sans">

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/70 z-[90] lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed lg:sticky top-0 h-[100dvh] w-[280px] bg-gradient-to-b from-zinc-950 via-[#111113] to-[#09090b] flex flex-col shrink-0 z-[100] transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] border-r border-white/5 shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Close button - mobile */}
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden absolute top-5 right-5 p-1.5 text-zinc-500 hover:text-white rounded-lg transition-colors">
          <X size={18} />
        </button>

        {/* Logo */}
        <div className="px-5 h-[80px] flex items-center justify-center border-b border-white/5 shrink-0 bg-white/5">
          <img src="/logo.png" alt="Perdens Perde" className="h-[42px] w-auto object-contain brightness-0 invert opacity-90 drop-shadow-sm" />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}>

          <NavGroup title="Genel Ayarlar">
            <NavItem view="tema" activeView={activeView} setActiveView={setActiveView} setIsSidebarOpen={setIsSidebarOpen} icon={Palette} label="Tema & Fontlar" />
            <NavItem view="genel" activeView={activeView} setActiveView={setActiveView} setIsSidebarOpen={setIsSidebarOpen} icon={Globe} label="Site & Logolar" />
            <NavItem view="navbar" activeView={activeView} setActiveView={setActiveView} setIsSidebarOpen={setIsSidebarOpen} icon={LayoutPanelTop} label="Üst Menü (Navbar)" />
            <NavItem view="footer" activeView={activeView} setActiveView={setActiveView} setIsSidebarOpen={setIsSidebarOpen} icon={LayoutPanelLeft} label="Alt Bilgi (Footer)" />
            <NavItem view="site" activeView={activeView} setActiveView={setActiveView} setIsSidebarOpen={setIsSidebarOpen} icon={Settings} label="Şirket & İletişim" />
          </NavGroup>

          <NavGroup title="Anasayfa">
            <NavItem view="anasayfaHero" activeView={activeView} setActiveView={setActiveView} setIsSidebarOpen={setIsSidebarOpen} icon={MonitorPlay} label="Ana Kapak (Hero)" />
            <NavItem view="anasayfaKategoriler" activeView={activeView} setActiveView={setActiveView} setIsSidebarOpen={setIsSidebarOpen} icon={Layers} label="Kategoriler Bölümü" />
            <NavItem view="anasayfaKurumsal" activeView={activeView} setActiveView={setActiveView} setIsSidebarOpen={setIsSidebarOpen} icon={Building2} label="Kurumsal Bölüm" />
            <NavItem view="anasayfaProjeler" activeView={activeView} setActiveView={setActiveView} setIsSidebarOpen={setIsSidebarOpen} icon={Focus} label="Projeler Modülü" />
            <NavItem view="anasayfaCta" activeView={activeView} setActiveView={setActiveView} setIsSidebarOpen={setIsSidebarOpen} icon={MousePointerClick} label="Aksiyon Bandı (CTA)" />
            <NavItem view="ozellikler" activeView={activeView} setActiveView={setActiveView} setIsSidebarOpen={setIsSidebarOpen} icon={Zap} label="Öne Çıkan Özellikler" />
          </NavGroup>

          <NavGroup title="İç Sayfalar">
            <NavItem view="kategoriIcerik" activeView={activeView} setActiveView={setActiveView} setIsSidebarOpen={setIsSidebarOpen} icon={Heading} label="Kategori İçerikleri" />
            <NavItem view="hakkimizda" activeView={activeView} setActiveView={setActiveView} setIsSidebarOpen={setIsSidebarOpen} icon={Handshake} label="Hakkımızda Sayfası" />
            <NavItem view="iletisim" activeView={activeView} setActiveView={setActiveView} setIsSidebarOpen={setIsSidebarOpen} icon={MessageSquareText} label="İletişim Sayfası" />
            <NavItem view="teklifPanel" activeView={activeView} setActiveView={setActiveView} setIsSidebarOpen={setIsSidebarOpen} icon={CheckSquare} label="Teklif Formu Paneli" />
          </NavGroup>

          <NavGroup title="Medya & Portföy">
            <NavItem view="galeriler" activeView={activeView} setActiveView={setActiveView} setIsSidebarOpen={setIsSidebarOpen} icon={ImageIcon} label="Sayfa Galerileri" />
          </NavGroup>

          <NavGroup title="Aktivite">
            <NavItem view="talepler" activeView={activeView} setActiveView={setActiveView} setIsSidebarOpen={setIsSidebarOpen} icon={FileText} label="Gelen Talepler" />
            <NavItem view="blog" activeView={activeView} setActiveView={setActiveView} setIsSidebarOpen={setIsSidebarOpen} icon={PenLine} label="Blog Yönetimi" />
          </NavGroup>

        </nav>

        {/* Bottom actions */}
        <div className="p-5 border-t border-white/5 space-y-3 shrink-0 bg-black/20 backdrop-blur-md">
          <a href="/" target="_blank"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-[12.5px] text-zinc-300 hover:text-white border border-white/10 hover:border-white/30 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-300">
            <ExternalLink size={15} /> Siteyi Önizle
          </a>
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-[12.5px] text-zinc-300 hover:bg-red-500/20 hover:text-red-300 border border-white/10 hover:border-red-500/30 transition-all duration-300">
            <LogOut size={15} /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full h-[100dvh] overflow-y-auto overflow-x-hidden pt-20 lg:pt-0 min-w-0">
        {/* Mobile Header trigger */}
        <div className="lg:hidden fixed top-0 w-full h-16 bg-white border-b border-slate-200 shadow-sm z-50 flex items-center px-4">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-800 hover:bg-slate-100 rounded-lg">
            <Menu size={20} />
          </button>
          <span className="font-extrabold text-[15px] ml-2">Yönetim Paneli</span>
        </div>

        <div className="min-h-full px-6 py-8 lg:px-10 lg:py-10">
          <div className="max-w-5xl mx-auto w-full pb-24">

            {/* GRUP 1 — Genel */}
            {activeView === 'tema' && <TemaAyarlari />}
            {activeView === 'genel' && <SiteGenelYonetimi />}
            {activeView === 'navbar' && <NavbarYonetimi />}
            {activeView === 'footer' && <FooterYonetimi />}
            {activeView === 'site' && <SiteAyarlari />}

            {/* GRUP 2 — Anasayfa */}
            {activeView === 'anasayfaHero' && <AnasayfaHeroYonetimi />}
            {activeView === 'anasayfaKategoriler' && <AnasayfaKategorilerYonetimi />}
            {activeView === 'anasayfaKurumsal' && <AnasayfaKurumsalYonetimi />}
            {activeView === 'anasayfaProjeler' && <AnasayfaProjelerYonetimi />}
            {activeView === 'anasayfaCta' && <AnasayfaCtaYonetimi />}
            {activeView === 'ozellikler' && <OneCikanOzellikler />}

            {/* GRUP 3 — İç Sayfalar */}
            {activeView === 'kategoriIcerik' && <KategoriIcerik />}
            {activeView === 'hakkimizda' && <HakkimizdaYonetimi />}
            {activeView === 'iletisim' && <IletisimYonetimi />}
            {activeView === 'teklifPanel' && <TeklifPanelYonetimi />}

            {/* GRUP 4 — Medya */}
            {activeView === 'galeriler' && <Galeriler />}

            {/* GRUP 5 — Aktivite */}
            {activeView === 'talepler' && <GelenTalepler />}
            {activeView === 'blog' && <BlogYonetimi />}

          </div>
        </div>
      </main>
    </div>
  );
}
