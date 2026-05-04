import { useEffect, useState } from 'react';
import { DarkModeProvider } from '@/hooks/useDarkMode';
import ScrollProgress from '@/components/ScrollProgress';
import Navigation from '@/sections/Navigation';
import Hero from '@/sections/Hero';
import About from '@/sections/About';
import Services from '@/sections/Services';
import Affiliations from '@/sections/Affiliations';
import SocialServices from '@/sections/SocialServices';
import Qualifications from '@/sections/Qualifications';
import Testimonials from '@/sections/Testimonials';
import FAQ from '@/sections/FAQ';
import Contact from '@/sections/Contact';
import Footer from '@/sections/Footer';

function Preloader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="preloader">
      <div className="flex flex-col items-center gap-4">
        <div className="preloader-spinner" />
        <p className="text-slate-500 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <DarkModeProvider>
      <ScrollProgress />
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <div className={`transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[70] focus:bg-[#10B981] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold"
        >
          Skip to main content
        </a>
        <Navigation />
        <main id="main-content">
          <Hero />
          <About />
          <Services />
          <Affiliations />
          <SocialServices />
          <Qualifications />
          <Testimonials />
          <FAQ />
          <Contact />
        </main>
        <Footer />
      </div>
    </DarkModeProvider>
  );
}
