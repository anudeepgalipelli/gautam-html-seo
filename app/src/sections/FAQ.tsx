import { useEffect, useRef } from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What should I bring to my first appointment?',
    answer:
      'Please bring any previous medical records, current prescriptions, recent lab reports, and a valid ID. If you are visiting for diabetes or hypertension management, bringing your latest blood sugar or BP readings will help us assess your condition more accurately.',
  },
  {
    question: 'Do I need a prior appointment to consult?',
    answer:
      'While walk-in consultations may be available depending on the hospital, we strongly recommend booking an appointment online to minimize waiting time and ensure you receive dedicated attention.',
  },
  {
    question: 'What are the consultation timings?',
    answer:
      'Dr. Gorityala is available Monday through Saturday from 9:00 AM to 8:00 PM. Sunday consultations are available strictly by appointment. Timings may vary slightly by location.',
  },
  {
    question: 'Do you offer online or telephonic consultations?',
    answer:
      'Yes, online consultations are available. During the COVID-19 pandemic, Dr. Gorityala successfully provided telephonic and video consultations, and this service continues for follow-ups and non-emergency cases.',
  },
  {
    question: 'Which hospitals do you consult at?',
    answer:
      'Dr. Gorityala is a Consultant Physician at Apollo Hospitals (DRDO Kanchanbagh), Vaidyalaya Speciality Clinics (L.B. Nagar), and Padma Nursing Home (Karmanghat). He also visits several other hospitals across Hyderabad — see the Practice Locations section for the full list.',
  },
  {
    question: 'How do I prepare for a diabetes check-up?',
    answer:
      'For a fasting blood sugar test, avoid eating or drinking anything except water for 8–10 hours before the appointment. Bring your glucometer readings if you monitor at home, and a list of all current medications and supplements.',
  },
];

export default function FAQ() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
    if (contentRef.current) observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="section-padding bg-[#F8FAFC] dark:bg-[#0F0F0F] overflow-hidden"
    >
      <div className="w-full container-padding">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-12 reveal-section">
            <span className="inline-block text-[#10B981] dark:text-[#FFD23F] font-semibold text-sm uppercase tracking-widest mb-4 reveal-item">
              Common Questions
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E293B] dark:text-white reveal-item">
              Frequently Asked <span className="text-[#0F766E] dark:text-[#FFD23F]">Questions</span>
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto reveal-item">
              Find answers to commonly asked questions about consultations, preparation, and services.
            </p>
          </div>

          {/* Accordion */}
          <div ref={contentRef} className="reveal-section">
            <Accordion type="single" collapsible className="space-y-4 reveal-item">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white dark:bg-[#111111] rounded-2xl px-6 border border-slate-100 dark:border-[#222222] data-[state=open]:shadow-md dark:data-[state=open]:shadow-[#FFD23F]/5 transition-shadow"
                >
                  <AccordionTrigger className="text-left text-base font-semibold text-slate-800 dark:text-white hover:no-underline py-5 gap-4 [&>svg]:text-[#0F766E] dark:[&>svg]:text-[#FFD23F]">
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-[#0F766E] dark:text-[#FFD23F] shrink-0" />
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed pb-5 pl-8">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>

      {/* FAQPage Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        })}
      </script>
    </section>
  );
}
