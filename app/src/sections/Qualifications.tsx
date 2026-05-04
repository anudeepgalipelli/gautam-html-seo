import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Award, BookOpen, Stethoscope, FileCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const qualifications = [
  {
    icon: GraduationCap,
    degree: 'MBBS',
    institution: 'Rajiv Gandhi Institute of Medical Sciences (RIMS), Adilabad',
    description: 'Bachelor of Medicine and Bachelor of Surgery — Foundation of medical education and clinical training.',
    color: '#0F766E',
  },
  {
    icon: Award,
    degree: 'DNB General Medicine',
    institution: 'Yashoda Super Speciality Hospital, Malakpet',
    description: 'Diplomate of National Board in General Medicine — Advanced specialist training in internal medicine.',
    color: '#10B981',
  },
  {
    icon: FileCheck,
    degree: 'NHCA Certification',
    institution: 'National Healthcare Accreditation',
    description: 'Certification in Infection Control and Prevention Management — Specialized training in hospital infection protocols.',
    color: '#0F766E',
  },
  {
    icon: BookOpen,
    degree: 'CCEBDM',
    institution: 'Certificate Course in Evidence-Based Diabetes Management',
    description: 'Fellowship in Diabetology — Comprehensive training in diabetes diagnosis, treatment, and management.',
    color: '#10B981',
  },
  {
    icon: Stethoscope,
    degree: 'CCIGC',
    institution: 'Certificate Course in Integrated Geriatric Care',
    description: 'Integrated Geriatric Care — Specialized approach to elderly patient care and age-related conditions.',
    color: '#0F766E',
  },
];

export default function Qualifications() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.qual-header', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
      });

      const timeline = document.querySelector('.timeline-container');
      if (timeline) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.15 }
        );
        observer.observe(timeline);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="qualifications"
      ref={sectionRef}
      className="section-padding bg-[#1E293B] dark:bg-[#080808] overflow-hidden"
    >
      <div className="w-full container-padding">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="qual-header inline-block text-[#10B981] dark:text-[#FFD23F] font-semibold text-sm uppercase tracking-widest mb-4">
              Education & Training
            </span>
            <h2 className="qual-header text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Education & <span className="text-[#10B981] dark:text-[#FFD23F]">Qualifications</span>
            </h2>
            <p className="qual-header mt-4 text-slate-400 dark:text-slate-500 max-w-2xl mx-auto">
              A strong academic foundation combined with specialized certifications
              enables Dr. Gorityala to provide exceptional patient care.
            </p>
          </div>

          {/* Timeline */}
          <div className="timeline-container timeline-section relative">
            {/* Vertical Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#0F766E] via-[#10B981] to-[#0F766E] dark:from-[#FFD23F] dark:via-[#E8C84A] dark:to-[#FFD23F] md:-translate-x-px" />

            <div className="space-y-8">
              {qualifications.map((qual, index) => (
                <div
                  key={index}
                  className={`timeline-node relative flex items-start gap-6 md:gap-0 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ml-16 md:ml-0 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div
                      className={`bg-white/5 dark:bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 border border-white/10 dark:border-[#222222] hover:border-white/20 dark:hover:border-[#FFD23F]/30 transition-all duration-300 hover:-translate-y-1 ${
                        index % 2 === 0 ? 'md:ml-auto' : ''
                      }`}
                      style={{ maxWidth: '400px' }}
                    >
                      <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${qual.color}20` }}
                        >
                          <qual.icon className="w-5 h-5" style={{ color: qual.color }} />
                        </div>
                        <h3 className="text-xl font-bold text-white">{qual.degree}</h3>
                      </div>
                      <p className="text-[#10B981] dark:text-[#FFD23F] font-medium text-sm mb-2">{qual.institution}</p>
                      <p className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed">{qual.description}</p>
                    </div>
                  </div>

                  {/* Center Node */}
                  <div className="absolute left-6 md:left-1/2 w-12 h-12 -translate-x-1/2 flex items-center justify-center">
                    <div
                      className="w-12 h-12 rounded-full border-4 flex items-center justify-center bg-[#1E293B] dark:bg-[#080808]"
                      style={{ borderColor: qual.color }}
                    >
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
