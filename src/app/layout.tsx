import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import QuoteModal from "@/components/ui/QuoteModal";
import { SettingsProvider } from '@/contexts/SettingsContext';

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

import ThemeInjector from "@/components/ui/ThemeInjector";

export const metadata: Metadata = {
  metadataBase: new URL('https://perdens.com'),
  title: {
    default: "Perdens Perde Sistemleri",
    template: "%s",
  },
  description: "Ofis, banka, otel ve ticari alanlar için yenilikçi, modern ve estetik stor ve jaluzi sistemleri.",
  icons: {
    icon: "/favicon.png",
  },
  verification: {
    google: "googleeca447b02b43d691",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth antialiased">
      <body className={`min-h-full flex flex-col bg-[var(--color-bg)] text-slate-800 selection:bg-red-500 selection:text-white`}>
        <SettingsProvider>
          <ThemeInjector />
          {children}
          <QuoteModal />
        </SettingsProvider>
      </body>
    </html>
  );
}
