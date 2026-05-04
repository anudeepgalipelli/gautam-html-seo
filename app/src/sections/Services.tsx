import { useState, useEffect, useRef } from 'react';
import TiltCard from '@/components/TiltCard';
import {
  Activity,
  HeartPulse,
  Droplets,
  Zap,
  Wind,
  Weight,
  UserCircle,
  Bone,
  Bug,
  Flame,
  ShieldAlert,
  Syringe,
  AlertCircle,
} from 'lucide-react';

type ServiceItem = {
  icon: React.ElementType;
  title: string;
  description: string;
};

type Category = {
  label: string;
  services: ServiceItem[];
};

const categories: Category[] = [
  {
    label: 'Chronic Care',
    services: [
      {
        icon: Activity,
        title: 'Diabetes Management',
        description: 'Comprehensive care for Type 1, Type 2, and gestational diabetes including insulin management.',
      },
      {
        icon: HeartPulse,
        title: 'Hypertension (BP)',
        description: 'Expert management of high blood pressure with personalized treatment plans.',
      },
      {
        icon: Droplets,
        title: 'Dyslipidemia',
        description: 'Specialized care for cholesterol disorders and lipid profile management.',
      },
      {
        icon: Zap,
        title: 'Thyroid Disorders',
        description: 'Diagnosis and treatment of hypothyroidism, hyperthyroidism, and related conditions.',
      },
      {
        icon: Weight,
        title: 'Obesity & Lifestyle',
        description: 'Holistic approach to weight management and lifestyle disorder treatment.',
      },
    ],
  },
  {
    label: 'Infectious & Respiratory',
    services: [
      {
        icon: Wind,
        title: 'Asthma & Allergy',
        description: 'Management of respiratory allergies, asthma, and allergic conditions.',
      },
      {
        icon: Flame,
        title: 'Infectious Diseases',
        description: 'Treatment for Dengue, Malaria, TB, Pneumonia, and respiratory infections.',
      },
      {
        icon: ShieldAlert,
        title: 'Sepsis & PUO',
        description: 'Critical care management of sepsis and pyrexia of unknown origin.',
      },
      {
        icon: Syringe,
        title: 'Hepatitis',
        description: 'Diagnosis and management of viral hepatitis and liver conditions.',
      },
    ],
  },
  {
    label: 'Specialized Care',
    services: [
      {
        icon: UserCircle,
        title: 'Geriatric Care',
        description: 'Specialized healthcare for elderly patients with age-related conditions.',
      },
      {
        icon: Bone,
        title: 'Musculoskeletal & Arthritis',
        description: 'Treatment for joint pain, arthritis, and musculoskeletal disorders.',
      },
      {
        icon: Bug,
        title: 'Poisoning & Snake Bites',
        description: 'Emergency management and treatment of toxic exposures and envenomation.',
      },
    ],
  },
];

export default function Services() {
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

    return () => observer.disconnect();
  }, []);

  // Re-animate cards when tab changes
  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.service-card-item');
      cards.forEach((card) => {
        card.classList.remove('card-visible');
        void (card as HTMLElement).offsetHeight; // force reflow
      });
      requestAnimationFrame(() => {
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.classList.add('card-visible');
          }, i * 80);
        });
      });
    }
  }, [activeTab]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="section-padding bg-white dark:bg-[#0A0A0A] overflow-hidden"
    >
      <div className="w-full container-padding">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-12 reveal-section">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E293B] dark:text-white reveal-item">
              Areas of Expertise
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto reveal-item">
              Dr. Gorityala provides comprehensive medical care across a wide range of specializations,
              ensuring personalized treatment for every patient.
            </p>
          </div>

          {/* Tab Bar */}
          <div className="flex justify-center mb-10 reveal-section" role="tablist" aria-label="Medical service categories">
            <div className="inline-flex bg-[#F8FAFC] dark:bg-[#111111] rounded-full p-1.5 border border-slate-100 dark:border-[#222222] shadow-sm">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={activeTab === i}
                  aria-controls={`services-panel-${i}`}
                  id={`services-tab-${i}`}
                  onClick={() => setActiveTab(i)}
                  className={`px-5 sm:px-7 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeTab === i
                      ? 'bg-[#0F766E] text-white dark:bg-[#FFD23F] dark:text-[#0A0A0A] shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-[#0F766E] dark:hover:text-[#FFD23F]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Category Cards */}
          <div ref={gridRef} className="reveal-section" role="tabpanel" id={`services-panel-${activeTab}`} aria-labelledby={`services-tab-${activeTab}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {categories[activeTab].services.map((service, index) => (
                <TiltCard key={`${activeTab}-${index}`} className="h-full">
                  <div
                    className="service-card-item card-visible group bg-white dark:bg-[#111111] rounded-2xl p-6 border border-slate-100 dark:border-[#222222] hover:border-[#0F766E]/20 dark:hover:border-[#FFD23F]/30 hover:shadow-xl dark:hover:shadow-[#FFD23F]/5 transition-all duration-300 cursor-default h-full"
                    style={{ transitionDelay: `${index * 80}ms` }}
                  >
                    <div className="w-12 h-12 bg-[#0F766E]/10 dark:bg-[#FFD23F]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0F766E] dark:group-hover:bg-[#FFD23F] transition-colors duration-300">
                      <service.icon className="w-6 h-6 text-[#0F766E] dark:text-[#FFD23F] group-hover:text-white dark:group-hover:text-[#0A0A0A] transition-colors duration-300" />
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-2 group-hover:text-[#0F766E] dark:group-hover:text-[#FFD23F] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>

          {/* COVID Note */}
          <div className="covid-note mt-12 bg-gradient-to-r from-[#F0FDFA] to-[#ECFDF5] dark:from-[#0F1F1C] dark:to-[#1A1A0A] rounded-2xl p-6 border border-[#0F766E]/10 dark:border-[#FFD23F]/20 flex items-start gap-4">
            <div className="w-10 h-10 bg-[#0F766E]/10 dark:bg-[#FFD23F]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-[#0F766E] dark:text-[#FFD23F]" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-white mb-1">COVID-19 Care</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Dr. Gorityala has treated both COVID and non-COVID patients through online consultation
                during the pandemic, offering comprehensive monitoring packages and home care services
                when required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
