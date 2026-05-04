import { useEffect, useRef, useState } from 'react';
import { Star, Quote, User } from 'lucide-react';

const testimonials = [
  {
    name: 'Ramesh Kumar',
    rating: 5,
    text: "Dr. Gorityala is an exceptional physician. His detailed explanation of my diabetes condition and the personalized treatment plan has helped me manage my blood sugar levels effectively. He truly cares about his patients.",
  },
  {
    name: 'Lakshmi Devi',
    rating: 5,
    text: "I consulted Dr. Gorityala for my mother's geriatric care. His patience and expertise in handling elderly patients is remarkable. He takes time to explain everything and never rushes through appointments.",
  },
  {
    name: 'Suresh Reddy',
    rating: 5,
    text: "During the COVID-19 pandemic, Dr. Gorityala provided excellent telephonic consultation when I couldn't visit the hospital. His online monitoring package was thorough and reassuring during a difficult time.",
  },
  {
    name: 'Anita Sharma',
    rating: 5,
    text: "I was suffering from hypertension for years before consulting Dr. Gorityala. His systematic approach and lifestyle recommendations have brought my BP under control without excessive medication.",
  },
  {
    name: 'Mohammad Ali',
    rating: 5,
    text: "Dr. Gorityala treated my father for a complex infectious disease. His expertise and timely intervention made all the difference. We are forever grateful for his compassionate care.",
  },
  {
    name: 'Priya Patel',
    rating: 5,
    text: "The best general physician I have ever consulted. Dr. Gorityala's thorough diagnostic approach and clear communication style makes you feel confident about your treatment. Highly recommended!",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

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

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const child = el.firstElementChild as HTMLElement | null;
      if (!child) return;
      const gap = 24;
      const cardWidth = child.offsetWidth + gap;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveSlide(Math.min(Math.max(index, 0), testimonials.length - 1));
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSlide = (index: number) => {
    const el = gridRef.current;
    if (!el) return;
    const child = el.firstElementChild as HTMLElement | null;
    if (!child) return;
    const gap = 24;
    const cardWidth = child.offsetWidth + gap;
    el.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
  };

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="section-padding bg-white dark:bg-[#0A0A0A] overflow-hidden"
    >
      <div className="w-full container-padding">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-16 reveal-section">
            <span className="inline-block text-[#10B981] dark:text-[#FFD23F] font-semibold text-sm uppercase tracking-widest mb-4 reveal-item">
              Patient Stories
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E293B] dark:text-white reveal-item">
              What Patients <span className="text-[#0F766E] dark:text-[#FFD23F]">Say</span>
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto reveal-item">
              Real experiences from patients who have trusted Dr. Gorityala with their healthcare needs.
            </p>
          </div>

          {/* Testimonials Grid / Mobile Carousel */}
          <div
            ref={gridRef}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 reveal-section snap-carousel overflow-x-auto pb-4 md:overflow-visible md:pb-0 -mx-4 px-4 md:mx-0 md:px-0"
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="testimonial-card min-w-[85vw] sm:min-w-[70vw] md:min-w-0 bg-white dark:bg-[#111111] rounded-2xl p-6 border border-slate-100 dark:border-[#222222] shadow-sm reveal-item"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-[#0F766E]/20 dark:text-[#FFD23F]/20 mb-4" />

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-[#222222]">
                  <div className="w-10 h-10 bg-[#0F766E]/10 dark:bg-[#FFD23F]/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-[#0F766E] dark:text-[#FFD23F]" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">{testimonial.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Verified Patient</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Dots */}
          <div className="flex justify-center gap-2 mt-6 md:hidden">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeSlide === i
                    ? 'w-6 bg-[#0F766E] dark:bg-[#FFD23F]'
                    : 'w-2 bg-slate-300 dark:bg-slate-600'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
