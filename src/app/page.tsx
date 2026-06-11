import Header from "@/components/layout/Header";
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
