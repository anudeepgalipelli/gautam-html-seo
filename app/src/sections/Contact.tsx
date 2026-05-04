import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, Phone, Mail, MapPin, Clock, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-header', {
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

      gsap.from('.contact-form', {
        scrollTrigger: {
          trigger: '.contact-form',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from('.contact-info', {
        scrollTrigger: {
          trigger: '.contact-info',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        x: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-padding bg-[#0F766E] dark:bg-[#0A0A0A] overflow-hidden"
    >
      <div className="w-full container-padding">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="contact-header inline-block text-[#10B981] dark:text-[#FFD23F] font-semibold text-sm uppercase tracking-widest mb-4">
              Reach Out
            </span>
            <h2 className="contact-header text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Get in <span className="text-[#10B981] dark:text-[#FFD23F]">Touch</span>
            </h2>
            <p className="contact-header mt-4 text-white/70 dark:text-slate-400 max-w-2xl mx-auto">
              Ready to take the first step towards better health? Book an appointment
              or send us a message.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="contact-form">
              <form onSubmit={handleSubmit} className="bg-white/10 dark:bg-[#111111]/80 backdrop-blur-sm rounded-2xl p-8 border border-white/10 dark:border-[#222222]">
                <h3 className="text-xl font-bold text-white dark:text-white mb-6">Send a Message</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 dark:text-slate-300 text-sm mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 dark:bg-[#0A0A0A] border border-white/20 dark:border-[#333333] rounded-xl text-white dark:text-white placeholder-white/40 dark:placeholder-slate-500 focus:outline-none focus:border-[#10B981] dark:focus:border-[#FFD23F] transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 dark:text-slate-300 text-sm mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 dark:bg-[#0A0A0A] border border-white/20 dark:border-[#333333] rounded-xl text-white dark:text-white placeholder-white/40 dark:placeholder-slate-500 focus:outline-none focus:border-[#10B981] dark:focus:border-[#FFD23F] transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 dark:text-slate-300 text-sm mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 dark:bg-[#0A0A0A] border border-white/20 dark:border-[#333333] rounded-xl text-white dark:text-white placeholder-white/40 dark:placeholder-slate-500 focus:outline-none focus:border-[#10B981] dark:focus:border-[#FFD23F] transition-colors"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 dark:text-slate-300 text-sm mb-2">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 dark:bg-[#0A0A0A] border border-white/20 dark:border-[#333333] rounded-xl text-white dark:text-white placeholder-white/40 dark:placeholder-slate-500 focus:outline-none focus:border-[#10B981] dark:focus:border-[#FFD23F] transition-colors resize-none"
                      placeholder="Describe your symptoms or inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary flex items-center justify-center gap-2 py-4"
                  >
                    <Send className="w-5 h-5" />
                    {submitted ? 'Message Sent!' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info space-y-6">
              {/* Quick Booking CTA */}
              <div className="bg-white/10 dark:bg-[#111111]/80 backdrop-blur-sm rounded-2xl p-8 border border-white/10 dark:border-[#222222] text-center">
                <Calendar className="w-12 h-12 text-[#10B981] dark:text-[#FFD23F] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Book an Appointment</h3>
                <p className="text-white/70 dark:text-slate-400 mb-6">
                  Schedule your consultation online for the fastest service.
                </p>
                <a
                  href="https://digiclinics.prescrip.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2 animate-pulse-glow"
                >
                  <Calendar className="w-5 h-5" />
                  Book Online Now
                </a>
              </div>

              {/* Contact Details */}
              <div className="bg-white/10 dark:bg-[#111111]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10 dark:border-[#222222] space-y-4">
                <h4 className="font-bold text-white mb-4">Contact Information</h4>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#10B981]/20 dark:bg-[#FFD23F]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#10B981] dark:text-[#FFD23F]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Primary Locations</p>
                    <p className="text-white/60 dark:text-slate-400 text-sm">
                      Apollo Hospitals, DRDO Kanchanbagh<br />
                      Vaidyalaya Speciality Clinics, L.B. Nagar
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#10B981]/20 dark:bg-[#FFD23F]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#10B981] dark:text-[#FFD23F]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Consultation Hours</p>
                    <p className="text-white/60 dark:text-slate-400 text-sm">
                      Mon - Sat: 9:00 AM - 8:00 PM<br />
                      Sun: By Appointment
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#10B981]/20 dark:bg-[#FFD23F]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#10B981] dark:text-[#FFD23F]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Phone</p>
                    <a
                      href="tel:+919346176484"
                      className="text-white/60 dark:text-slate-400 text-sm hover:text-[#10B981] dark:hover:text-[#FFD23F] transition-colors"
                    >
                      +91 93461 76484
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#10B981]/20 dark:bg-[#FFD23F]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#10B981] dark:text-[#FFD23F]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <a
                      href="mailto:drgautamgorityala@gmail.com"
                      className="text-white/60 dark:text-slate-400 text-sm hover:text-[#10B981] dark:hover:text-[#FFD23F] transition-colors"
                    >
                      drgautamgorityala@gmail.com
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
