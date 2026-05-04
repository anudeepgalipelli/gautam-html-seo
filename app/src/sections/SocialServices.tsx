import { useEffect, useRef } from 'react';
import { Heart, Droplets, Package, HandHeart } from 'lucide-react';

const initiatives = [
  {
    icon: Heart,
    title: 'Free Telephonic Consultations',
    description: 'Providing free telephonic medical advice to patients in need, ensuring healthcare accessibility for all.',
  },
  {
    icon: Package,
    title: 'COVID Quarantine Kits',
    description: 'Distributed essential quarantine kits to affected families during the pandemic.',
  },
  {
    icon: Droplets,
    title: 'Oxygen Supply',
    description: 'Donated over 50,000 litres of oxygen to critical patients during the COVID-19 crisis.',
  },
  {
    icon: HandHeart,
    title: 'Migrant Labourer Support',
    description: 'Provided funds and essential supplies to migrant workers affected by lockdowns.',
  },
];

export default function SocialServices() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    if (headerRef.current) observer.observe(headerRef.current);
    if (gridRef.current) observer.observe(gridRef.current);
    if (quoteRef.current) observer.observe(quoteRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="social"
      ref={sectionRef}
      className="section-padding bg-gradient-to-br from-[#F0FDFA] to-[#ECFDF5] dark:from-[#0A1A18] dark:to-[#0F1A0A] overflow-hidden"
    >
      <div className="w-full container-padding">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-16 reveal-section">
            <span className="inline-block text-[#10B981] dark:text-[#FFD23F] font-semibold text-sm uppercase tracking-widest mb-4 reveal-item">
              Community Service
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E293B] dark:text-white reveal-item">
              Social <span className="text-[#0F766E] dark:text-[#FFD23F]">Services</span>
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto reveal-item">
              Beyond clinical practice, Dr. Gorityala is deeply committed to serving the
              community through various humanitarian initiatives.
            </p>
          </div>

          {/* Initiatives Grid */}
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal-section">
            {initiatives.map((item, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-[#111111] rounded-2xl p-6 border border-slate-100 dark:border-[#222222] hover:border-[#0F766E]/20 dark:hover:border-[#FFD23F]/20 hover:shadow-xl dark:hover:shadow-[#FFD23F]/5 transition-all duration-300 text-center reveal-item"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-[#0F766E]/10 dark:bg-[#FFD23F]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#0F766E] dark:group-hover:bg-[#FFD23F] transition-colors duration-300">
                  <item.icon className="w-7 h-7 text-[#0F766E] dark:text-[#FFD23F] group-hover:text-white dark:group-hover:text-[#0A0A0A] transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-2 group-hover:text-[#0F766E] dark:group-hover:text-[#FFD23F] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Impact Statement */}
          <div
            ref={quoteRef}
            className="mt-12 bg-white dark:bg-[#111111] rounded-2xl p-8 border border-[#0F766E]/10 dark:border-[#FFD23F]/20 text-center max-w-3xl mx-auto reveal-section"
          >
            <Heart className="w-8 h-8 text-[#EF4444] mx-auto mb-4 reveal-item" />
            <p className="text-lg text-slate-700 dark:text-slate-300 italic leading-relaxed reveal-item">
              &ldquo;Healthcare is not just a profession, it is a commitment to humanity.
              Every life we touch, every patient we heal, strengthens our resolve to serve.&rdquo;
            </p>
            <p className="mt-4 font-semibold text-[#0F766E] dark:text-[#FFD23F] reveal-item">&mdash; Dr. Gautam Gorityala</p>
          </div>
        </div>
      </div>
    </section>
  );
}
