import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import ParticleField from '@/components/ParticleField';
import { Calendar, ChevronDown, Award, Shield, Clock } from 'lucide-react';

const SPECIALIZATIONS = [
  'Diabetes Management',
  'Hypertension Care',
  'Geriatric Medicine',
  'Infectious Diseases',
  'Thyroid Disorders',
  'General Medicine',
];

function useTypewriter(
  words: string[],
  typingSpeed = 100,
  deletingSpeed = 50,
  pause = 2000
) {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setText((prev) => {
          const next = currentWord.substring(0, prev.length - 1);
          if (next.length === 0) {
            setIsDeleting(false);
            setWordIndex((wi) => (wi + 1) % words.length);
          }
          return next;
        });
      }, deletingSpeed);
    } else {
      timeout = setTimeout(() => {
        setText((prev) => {
          const next = currentWord.substring(0, prev.length + 1);
          if (next.length === currentWord.length) {
            timeout = setTimeout(() => setIsDeleting(true), pause);
          }
          return next;
        });
      }, typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pause]);

  return text;
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const typewriterText = useTypewriter(SPECIALIZATIONS, 100, 50, 2000);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-title', {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.3,
      })
        .from('.hero-subtitle', {
          y: 40,
          opacity: 0,
          duration: 0.8,
        }, '-=0.5')
        .from('.hero-badges', {
          y: 30,
          opacity: 0,
          duration: 0.6,
        }, '-=0.4')
        .from('.hero-ctas', {
          y: 30,
          opacity: 0,
          duration: 0.6,
        }, '-=0.3')
        .from(imageRef.current, {
          x: 80,
          opacity: 0,
          scale: 0.9,
          duration: 1,
        }, '-=0.8')
        .from('.hero-stat', {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5,
        }, '-=0.4');
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#051818] via-[#0A2E2B] to-[#0F1F2E] dark:from-black dark:via-[#0A0A0A] dark:to-[#111111]"
    >
      {/* Interactive Particle Background */}
      <ParticleField />

      {/* Subtle gold accent overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#FFD23F]/5 via-transparent to-transparent z-[1] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full container-padding pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center max-w-7xl mx-auto">
          {/* Doctor Image — order-first on mobile */}
          <div ref={imageRef} className="relative flex justify-center lg:justify-end order-first lg:order-none">
            <div className="relative animate-float">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-[#14B8A6]/15 dark:bg-[#FFD23F]/10 rounded-full blur-3xl" />

              {/* Image Container */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 xl:w-[28rem] xl:h-[28rem]">
                <img
                  src="./assets/dr-gorityala-coat.jpg"
                  alt="Dr. Gautam Gorityala, General Physician & Diabetologist"
                  className="w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white/15"
                  loading="eager"
                />

                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0F766E] dark:bg-[#1A1A1A] dark:ring-2 dark:ring-[#FFD23F]/50 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white dark:text-[#FFD23F]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Trusted Care</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">9+ Years Experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content — order-2 on mobile */}
          <div className="text-center lg:text-left order-2 lg:order-none">
            <h1 className="hero-title text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight hero-text-shadow">
              Expert Care in
              <br />
              <span className="text-[#14B8A6] dark:text-[#FFD23F] inline-block min-h-[1.2em]">
                {typewriterText}
                <span className="inline-block w-[3px] h-[0.85em] bg-[#14B8A6] dark:bg-[#FFD23F] ml-1 align-middle animate-blink-cursor" />
              </span>
            </h1>

            <p className="hero-subtitle mt-6 text-lg sm:text-xl text-white/85 max-w-xl mx-auto lg:mx-0">
              Dr. Gautam Gorityala — General Physician &amp; Diabetologist
              <br />
              <span className="text-white/60">Hyderabad</span>
            </p>

            {/* Qualification Badges */}
            <div className="hero-badges flex flex-wrap gap-3 justify-center lg:justify-start mt-6">
              {['MBBS', 'DNB (General Medicine)', 'CCEBDM', 'CCIGC'].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-white/20"
                >
                  <Award className="w-3.5 h-3.5 text-[#14B8A6] dark:text-[#FFD23F]" />
                  {badge}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="hero-ctas flex flex-wrap gap-4 justify-center lg:justify-start mt-10">
              <a
                href="https://digiclinics.prescrip.in"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2 text-base animate-pulse-glow"
              >
                <Calendar className="w-5 h-5" />
                Book an Appointment
              </a>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-secondary flex items-center gap-2 text-base border-white/30 text-white hover:bg-white hover:text-[#0F766E] dark:hover:bg-[#FFD23F] dark:hover:text-[#0A0A0A]"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 lg:mt-20">
          {[
            { icon: Clock, value: '9+', label: 'Years Experience' },
            { icon: Shield, value: '10K+', label: 'Patients Treated' },
            { icon: Award, value: '4', label: 'Specializations' },
            { icon: Calendar, value: '10+', label: 'Hospital Affiliations' },
          ].map((stat, index) => (
            <div
              key={index}
              className="hero-stat bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10"
            >
              <stat.icon className="w-6 h-6 text-[#14B8A6] dark:text-[#FFD23F] mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-12">
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}

