'use client';

import { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export default function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { settings } = useSettings();
  const phoneStrip = settings.contact.phone.replace(/\D/g, '');

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-center gap-3">

      <button
        onClick={scrollToTop}
        aria-label="Yukarı çık"
        className={`group relative w-12 h-12 rounded-2xl bg-[#0a0f1a] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex items-center justify-center transition-all duration-500 hover:scale-110 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden ${
          showScrollTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute inset-[3px] rounded-[10px] border border-white/5" />
        <svg
          className="w-4.5 h-4.5 text-white relative z-10 group-hover:-translate-y-0.5 transition-transform duration-300"
          width="18" height="18"
          fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400 opacity-60 group-hover:opacity-100 transition-opacity" />
      </button>

      <a
        href={`https://wa.me/90${phoneStrip.slice(-10)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile iletişime geç"
        className="group relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_48px_rgba(37,211,102,0.55)] transition-all duration-300 hover:scale-110 overflow-hidden"
      >
        <span className="absolute inset-0 rounded-2xl bg-[#25d366]" />
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#128C7E] to-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="absolute inset-0 rounded-2xl border-2 border-[#25d366] scale-100 group-hover:scale-[1.35] group-hover:opacity-0 transition-all duration-500 opacity-100" />
        <svg
          className="relative z-10 w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300"
          viewBox="0 0 24 24" fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </a>

    </div>
  );
}
