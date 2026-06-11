'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { categoriesData } from '@/data/categories';

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      setTimeout(() => setQuery(''), 200); 
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const staticPages = [
    { title: 'Ana Sayfa', url: '/', type: 'Sayfa' },
    { title: 'Hakkımızda', url: '/hakkimizda', type: 'Sayfa' },
    { title: 'Projelerimiz', url: '/projeler', type: 'Sayfa' },
    { title: 'İletişim', url: '/iletisim', type: 'Sayfa' },
    { title: 'Blog', url: '/blog', type: 'Sayfa' }
  ];

  const smartActions = [
    { title: 'Tüm Ürünler ve Kategoriler', url: '/kategoriler', type: 'Katalog', keywords: ['ürün', 'ürünler', 'kategori', 'kategoriler', 'model', 'modeller', 'çeşit', 'çeşitler', 'perde', 'perdeler', 'katalog', 'seçenek'] },
    { title: 'Hızlı Fiyat Teklifi Alın', url: '?teklif=true', type: 'Hızlı İşlem', keywords: ['teklif', 'fiyat', 'ücret', 'satın', 'sipariş', 'maliyet', 'keşif', 'ölçü', 'ne kadar', 'fiyatlar'] },
    { title: 'İletişim ve Adres Bilgileri', url: '/iletisim', type: 'Sayfa', keywords: ['iletişim', 'telefon', 'adres', 'ulaşım', 'harita', 'mail', 'e-posta', 'whatsapp', 'konum', 'bize ulaşın', 'nerede', 'irtibat'] },
    { title: 'Hakkımızda', url: '/hakkimizda', type: 'Sayfa', keywords: ['hakkımızda', 'kurumsal', 'biz', 'firma', 'şirket', 'vizyon', 'misyon', 'neden biz', 'hakkında', 'kimdir'] },
    { title: 'Örnek Proje ve Çalışmalarımız', url: '/projeler', type: 'Sayfa', keywords: ['proje', 'projeler', 'referans', 'referanslar', 'galeri', 'resim', 'örnek', 'işlerimiz', 'fotoğraf'] },
  ];

  const lowerQuery = query.toLowerCase().trim();
  
  let results: { title: string, url: string, type: string, matchDesc?: string }[] = [];

  if (lowerQuery.length > 1) {
    smartActions.forEach(action => {
      const isMatch = action.keywords.some(keyword => keyword.includes(lowerQuery) || lowerQuery.includes(keyword));
      if (isMatch || action.title.toLowerCase().includes(lowerQuery)) {
        results.push({ title: action.title, url: action.url, type: action.type, matchDesc: `Aramanızla yakından ilişkili...` });
      }
    });

    staticPages.forEach(p => {
      if (p.title.toLowerCase().includes(lowerQuery) && !results.some(r => r.url === p.url)) {
         results.push(p);
      }
    });

    categoriesData.forEach(cat => {
      const catMetaWords = [cat.slug.toLowerCase(), 'perdesi', 'sistemleri'];
      const metaMatch = catMetaWords.some(w => w.includes(lowerQuery) || lowerQuery.includes(w));

      if (cat.title.toLowerCase().includes(lowerQuery) || cat.shortDesc.toLowerCase().includes(lowerQuery) || metaMatch) {
        if (!results.some(r => r.url === `/${cat.slug}`)) {
           results.push({ title: cat.title, url: `/${cat.slug}`, type: 'Ürün Kategorisi', matchDesc: cat.shortDesc.substring(0, 80) + '...' });
        }
      } else {
        const matchingVariant = cat.variants.find(v => v.toLowerCase().includes(lowerQuery));
        if (matchingVariant) {
          results.push({ title: matchingVariant, url: `/${cat.slug}`, type: 'Spesifik Model/Ürün', matchDesc: `${cat.title} ailesinden bir model.` });
        } else {
           const matchingFeature = cat.features.find(f => f.toLowerCase().includes(lowerQuery));
           if(matchingFeature) {
             results.push({ title: cat.title, url: `/${cat.slug}`, type: 'Sistem Özelliği', matchDesc: `Eşleşen: ${matchingFeature}` });
           }
        }
      }
    });
  }

  const handleNavigate = (url: string) => {
    onClose();
    if (url.startsWith('?')) {
      router.push(url, { scroll: false });
    } else {
      router.push(url);
    }
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-24 sm:pt-32 px-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="fixed inset-0 z-0" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 border border-slate-100">
        <div className="flex items-center px-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input 
            ref={inputRef}
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ne aramıştınız? (örn: ofis, jaluzi, iletişim)"
            className="w-full px-4 py-5 bg-transparent border-none focus:outline-none text-slate-800 text-[16px] sm:text-[18px] placeholder:text-slate-300 font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-2 mr-1 text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="hidden sm:block p-1.5 px-2.5 text-[10px] font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors bg-slate-50 rounded-lg border border-slate-200">
            ESC
          </button>
        </div>

        {query.length > 1 ? (
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {results.length > 0 ? (
              <div className="flex flex-col">
                <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{results.length} Sonuç Bulundu</div>
                {results.map((r, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleNavigate(r.url)}
                    className="flex items-center justify-between w-full text-left px-4 py-3.5 mt-1 hover:bg-slate-50 rounded-xl transition-colors group border border-transparent hover:border-slate-100"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[14.5px] font-bold text-slate-800 group-hover:text-[#448b97] transition-colors">{r.title}</span>
                        <span className="text-[10px] font-bold bg-slate-100/80 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full">{r.type}</span>
                      </div>
                      {r.matchDesc && <span className="text-[12.5px] text-slate-500 line-clamp-1 group-hover:text-slate-600 transition-colors">{r.matchDesc}</span>}
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#448b97] transition-colors shrink-0 ml-4" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-16 text-center text-slate-500 flex flex-col items-center">
                <Search className="w-8 h-8 text-slate-200 mb-3" />
                <p className="text-[15px] font-bold text-slate-800">Sonuç bulunamadı</p>
                <p className="text-[14px] mt-1 text-slate-500">Aramanızla eşleşen hiçbir şey bulamadık.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="px-6 py-10 text-center bg-slate-50/50">
            <p className="text-[14px] text-slate-400 font-medium">Hızlıca ürün, model, hizmet veya sayfa arayabilirsiniz.</p>
          </div>
        )}
      </div>
    </div>
  );
}
