import type { Metadata } from "next";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: { absolute: "Perdens Perde Sistemleri" },
  description: "Ofis, banka, otel ve ticari alanlar için yenilikçi, modern ve estetik stor ve jaluzi sistemleri.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Perdens Perde Sistemleri",
    description: "Ofis, banka, otel ve ticari alanlar için yenilikçi, modern ve estetik stor ve jaluzi sistemleri.",
    url: "/",
  },
};
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import Corporate from "@/components/home/Corporate";

import Features from "@/components/home/Features";
import Projects from "@/components/home/Projects";
import Cta from "@/components/home/Cta";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/ui/FloatingButtons";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Categories />
        <Corporate />

        <Features />
        <Projects />
        <Cta />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
