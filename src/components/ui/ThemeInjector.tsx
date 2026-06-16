"use client";

import { useSettings } from '@/contexts/SettingsContext';
import { useEffect } from 'react';

let _fontLink: HTMLLinkElement | null = null;

function getFontLink(): HTMLLinkElement {
  if (!_fontLink) {
    _fontLink = document.createElement('link');
    _fontLink.rel = 'stylesheet';
    document.head.appendChild(_fontLink);
  }
  return _fontLink;
}

export default function ThemeInjector() {
  const { settings } = useSettings();

  // Font güncelleme
  useEffect(() => {
    const font1 = settings.theme.fontFamily.replace(/ /g, '+');
    const font2 = settings.theme.headingFontFamily.replace(/ /g, '+');
    const href = `https://fonts.googleapis.com/css2?family=${font1}:wght@300;400;500;600;700;800&family=${font2}:wght@300;400;500;600;700;800&display=swap`;
    getFontLink().href = href;
  }, [settings.theme.fontFamily, settings.theme.headingFontFamily]);

  // Favicon güncelleme (cache-busting ile)
  useEffect(() => {
    const faviconUrl = settings.logos?.faviconUrl;
    if (!faviconUrl) return;

    const url = faviconUrl;

    // Mevcut tüm favicon link'lerini güncelle
    const links = document.head.querySelectorAll<HTMLLinkElement>(
      'link[rel="icon"], link[rel="shortcut icon"]'
    );

    if (links.length) {
      links.forEach((link) => link.setAttribute('href', url));
    } else {
      // Hiç yoksa yeni bir tane oluştur
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = url;
      document.head.appendChild(link);
    }
  }, [settings.logos?.faviconUrl]);

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      :root {
        --color-primary: ${settings.theme.primaryColor};
        --color-secondary: ${settings.theme.secondaryColor};
        --color-bg: ${settings.theme.backgroundColor};
        --font-primary: '${settings.theme.fontFamily}', sans-serif;
        --font-heading: '${settings.theme.headingFontFamily}', sans-serif;
      }
      body {
        font-family: var(--font-primary) !important;
      }
      h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-heading) !important;
      }
    `}} />
  );
}
