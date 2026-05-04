import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Users, GraduationCap, Stethoscope } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-text', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });

      gsap.from('.about-image', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
        x: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.about-feature', {
        scrollTrigger: {
          trigger: '.about-features',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    { icon: Heart, label: 'Empathetic Care', desc: 'Patient-first approach' },
    { icon: Users, label: 'Education Focus', desc: 'Detailed counseling' },
    { icon: GraduationCap, label: 'Expert Analysis', desc: 'Careful diagnosis' },
    { icon: Stethoscope, label: 'Comprehensive', desc: 'Holistic treatment' },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-padding bg-white dark:bg-[#0A0A0A] overflow-hidden"
    >
      <div className="w-full container-padding">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          {/* Text Content */}
          <div>
            <span className="about-text inline-block text-[#10B981] dark:text-[#FFD23F] font-semibold text-sm uppercase tracking-widest mb-4">
              About the Doctor
            </span>
            <h2 className="about-text text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E293B] dark:text-white leading-tight">
              About Dr. Gautam{' '}
              <span className="text-[#0F766E] dark:text-[#FFD23F]">Gorityala</span>
            </h2>
            <p className="about-text mt-6 text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
              Dr. Gautam is known for his empathetic approach and careful analysis. He gives
              paramount importance to patient education and counseling. He explains in detail
              whatever is necessary for patient recovery and well-being.
            </p>
            <p className="about-text mt-4 text-slate-500 dark:text-slate-400 leading-relaxed">
              With extensive training in General Medicine and specialized certifications in
              Diabetology and Geriatric Care, Dr. Gorityala brings a wealth of knowledge and
              experience to every patient interaction. His commitment to staying current with
              medical advancements ensures that patients receive the most effective and
              up-to-date treatments available.
            </p>

            {/* Feature Grid */}
            <div className="about-features grid grid-cols-2 gap-3 mt-10">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="about-feature flex flex-col items-center text-center p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#111111] hover:bg-[#EEF4FF] dark:hover:bg-[#1A1A1A] transition-colors duration-300 h-full"
                >
                  <div className="w-8 h-8 bg-[#0F766E]/10 dark:bg-[#FFD23F]/10 rounded-lg flex items-center justify-center mb-2">
                    <feature.icon className="w-4 h-4 text-[#0F766E] dark:text-[#FFD23F]" />
                  </div>
                  <p className="font-semibold text-slate-800 dark:text-white text-base leading-tight">{feature.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="about-image relative flex justify-center">
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#10B981]/10 dark:bg-[#FFD23F]/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-[#0F766E]/10 dark:bg-[#FFD23F]/10 rounded-full blur-2xl" />

              <div className="relative w-72 h-80 sm:w-80 sm:h-96 lg:w-96 lg:h-[28rem] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="./assets/dr-gorityala-scrubs.jpg"
                  alt="Dr. Gautam Gorityala in professional medical scrubs"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F766E]/30 to-transparent dark:from-[#FFD23F]/20" />
              </div>

              {/* Experience Badge */}
              <div className="absolute -bottom-5 -right-5 bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-xl p-5">
                <p className="text-3xl font-bold text-[#0F766E] dark:text-[#FFD23F]">9+</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Years of</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-white">Medical Practice</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
