import { useEffect, useState, useCallback } from 'react';
import { Menu, X, Stethoscope, Sun, Moon } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Qualifications', href: '#qualifications' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useDarkMode();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileOpen(false);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-3 dark:bg-[#0A0A0A]/95 dark:shadow-black/30'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="w-full container-padding">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-2 group">
              <Stethoscope className={`w-7 h-7 transition-colors duration-300 ${scrolled ? 'text-[#0F766E] dark:text-[#FFD23F]' : 'text-white'}`} />
              <span className={`text-lg font-bold transition-colors duration-300 ${scrolled ? 'text-[#0F766E] dark:text-[#FFD23F]' : 'text-white'}`}>
                Dr. Gautam Gorityala
              </span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    scrolled
                      ? 'text-slate-700 hover:text-[#0F766E] dark:text-[#E8E8E0] dark:hover:text-[#FFD23F]'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className={`dark-toggle ${
                  scrolled
                    ? 'bg-slate-100 hover:bg-slate-200 dark:bg-[#1A1A1A] dark:hover:bg-[#2A2A2A] text-[#0F766E] dark:text-[#FFD23F]'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>

              {/* CTA Button */}
              <a
                href="https://digiclinics.prescrip.in"
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-primary text-sm ${!scrolled ? 'animate-pulse-glow' : ''}`}
              >
                Book Appointment
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  scrolled
                    ? 'bg-slate-100 dark:bg-[#1A1A1A] text-[#0F766E] dark:text-[#FFD23F]'
                    : 'bg-white/10 text-white'
                }`}
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  scrolled ? 'text-[#0F766E] dark:text-[#FFD23F]' : 'text-white'
                }`}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#0F766E] dark:bg-[#0A0A0A] transition-all duration-500 lg:hidden ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-2xl font-semibold text-white hover:text-[#10B981] dark:hover:text-[#FFD23F] transition-all duration-300"
              style={{
                transitionDelay: mobileOpen ? `${index * 50}ms` : '0ms',
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://digiclinics.prescrip.in"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-4 animate-pulse-glow"
            style={{
              transitionDelay: mobileOpen ? '300ms' : '0ms',
              opacity: mobileOpen ? 1 : 0,
            }}
          >
            Book Appointment
          </a>
        </div>
      </div>
    </>
  );
}
