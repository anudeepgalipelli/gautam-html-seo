import { Stethoscope, Heart, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A4F4A] dark:bg-[#050505] text-white/70 dark:text-slate-400">
      <div className="w-full container-padding py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="w-6 h-6 text-[#10B981] dark:text-[#FFD23F]" />
                <span className="text-lg font-bold text-white">Dr. Gautam Gorityala</span>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                General Physician & Diabetologist providing compassionate,
                expert medical care across Hyderabad.
              </p>
              <div className="space-y-1 text-sm text-white/60 dark:text-slate-400">
                <p>
                  <a href="tel:+919346176484" className="hover:text-[#10B981] dark:hover:text-[#FFD23F] transition-colors">
                    +91 93461 76484
                  </a>
                </p>
                <p>
                  <a href="mailto:drgautamgorityala@gmail.com" className="hover:text-[#10B981] dark:hover:text-[#FFD23F] transition-colors">
                    drgautamgorityala@gmail.com
                  </a>
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { label: 'About', href: '#about' },
                  { label: 'Services', href: '#services' },
                  { label: 'Qualifications', href: '#qualifications' },
                  { label: 'Testimonials', href: '#testimonials' },
                  { label: 'FAQ', href: '#faq' },
                  { label: 'Contact', href: '#contact' },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-sm hover:text-[#10B981] dark:hover:text-[#FFD23F] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <span className="text-sm cursor-pointer hover:text-[#10B981] dark:hover:text-[#FFD23F] transition-colors">
                    Privacy Policy
                  </span>
                </li>
                <li>
                  <span className="text-sm cursor-pointer hover:text-[#10B981] dark:hover:text-[#FFD23F] transition-colors">
                    Terms of Service
                  </span>
                </li>
                <li>
                  <span className="text-sm cursor-pointer hover:text-[#10B981] dark:hover:text-[#FFD23F] transition-colors">
                    Medical Disclaimer
                  </span>
                </li>
              </ul>

              {/* Back to Top */}
              <button
                onClick={scrollToTop}
                className="mt-6 flex items-center gap-2 text-sm text-[#10B981] dark:text-[#FFD23F] hover:text-white dark:hover:text-white transition-colors group"
              >
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                Back to Top
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-6 border-t border-white/10 dark:border-[#222222] text-center">
            <p className="text-sm text-white/80 dark:text-slate-400">
              &copy; {new Date().getFullYear()} Dr. Gautam Gorityala. All Rights Reserved.
            </p>
            <p className="text-xs text-white/40 dark:text-slate-600 mt-2">
              This website is for informational purposes only and is not a substitute for professional medical advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
