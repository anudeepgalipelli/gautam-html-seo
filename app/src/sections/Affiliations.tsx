import { useEffect, useRef } from 'react';
import { MapPin, Building2, ExternalLink } from 'lucide-react';

interface Hospital {
  name: string;
  mapsUrl: string;
}

const consultantHospitals: Hospital[] = [
  {
    name: 'Apollo Hospitals, DRDO Kanchanbagh',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Apollo+Hospitals+DRDO+Kanchanbagh+Hyderabad',
  },
  {
    name: 'Vaidyalaya Speciality Clinics, L.B. Nagar',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vaidyalaya+Speciality+Clinics+L.B.+Nagar+Hyderabad',
  },
  {
    name: 'Padma Nursing Home, Karmanghat',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Padma+Nursing+Home+Karmanghat+Hyderabad',
  },
];

const visitingHospitals = [
  'Rajeshwari Nursing Home, Hayathnagar, Hyderabad',
  'Rakshita Hospital, Chaitanyapuri, Hyderabad',
  'Yashoda Hospitals, Malakpet, Hyderabad',
  'Orange Hospitals, L.B. Nagar, Hyderabad',
  'Rushcare Hospitals, L.B. Nagar, Hyderabad',
  "People's Multi Specialty Hospital, Mall – Yacharam",
  'Mahonia Multi Specialty Hospital, Manneguda, Hyderabad',
  'Manogna Multi Speciality Hospital, Abdullapurmet, Hyderabad',
];

export default function Affiliations() {
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

  return (
    <section
      id="affiliations"
      ref={sectionRef}
      className="section-padding bg-[#F8FAFC] dark:bg-[#0F0F0F] overflow-hidden"
    >
      <div className="w-full container-padding">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-16 reveal-section">
            <span className="inline-block text-[#10B981] dark:text-[#FFD23F] font-semibold text-sm uppercase tracking-widest mb-4 reveal-item">
              Practice Network
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E293B] dark:text-white reveal-item">
              Practice <span className="text-[#0F766E] dark:text-[#FFD23F]">Locations</span>
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto reveal-item">
              Dr. Gorityala is affiliated with leading hospitals across Hyderabad,
              ensuring accessible care for all patients.
            </p>
          </div>

          {/* Hospital Lists */}
          <div ref={gridRef} className="space-y-10 reveal-section">
            {/* Consultant — with Get Directions links */}
            <div>
              <div className="flex items-center gap-3 mb-5 reveal-item">
                <div className="w-10 h-10 bg-[#0F766E] dark:bg-black dark:border dark:border-[#FFD23F]/40 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white dark:text-[#FFD23F]" />
                </div>
                <h3 className="text-xl font-bold text-[#1E293B] dark:text-white">Consultant</h3>
              </div>
              <div className="space-y-3">
                {consultantHospitals.map((hospital, index) => (
                  <a
                    key={index}
                    href={hospital.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hospital-card flex items-center gap-3 p-4 bg-white dark:bg-[#111111] rounded-xl shadow-sm border border-slate-100 dark:border-[#222222] hover:border-[#0F766E]/30 dark:hover:border-[#FFD23F]/30 transition-all duration-300 reveal-item group"
                    style={{ transitionDelay: `${index * 60}ms` }}
                  >
                    <MapPin className="w-5 h-5 text-[#0F766E] dark:text-[#FFD23F] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300 flex-1">{hospital.name}</span>
                    <span className="text-xs font-medium text-[#0F766E] dark:text-[#FFD23F] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Directions <ExternalLink className="w-3 h-3" />
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Visiting Consultant */}
            <div>
              <div className="flex items-center gap-3 mb-5 reveal-item">
                <div className="w-10 h-10 bg-[#10B981] dark:bg-black dark:border dark:border-[#FFD23F]/40 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white dark:text-[#FFD23F]" />
                </div>
                <h3 className="text-xl font-bold text-[#1E293B] dark:text-white">Visiting Consultant</h3>
              </div>
              <div className="space-y-3">
                {visitingHospitals.map((hospital, index) => (
                  <div
                    key={index}
                    className="hospital-card flex items-start gap-3 p-4 bg-white dark:bg-[#111111] rounded-xl shadow-sm border border-slate-100 dark:border-[#222222] hover:border-[#10B981]/30 dark:hover:border-[#FFD23F]/30 transition-all duration-300 reveal-item"
                    style={{ transitionDelay: `${index * 60}ms` }}
                  >
                    <MapPin className="w-5 h-5 text-[#10B981] dark:text-[#FFD23F] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{hospital}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
