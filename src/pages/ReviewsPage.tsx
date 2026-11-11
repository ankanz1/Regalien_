import React from 'react';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { useTransitionNavigation } from '../components/PageTransition';
import { Calendar, Star, ShieldCheck, Award } from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const { navigateTo } = useTransitionNavigation();

  return (
    <div className="bg-[#F3EEE3] min-h-screen">
      {/* Page Header */}
      <div className="py-12 md:py-16 bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#D9541E]">
              <span>Verified Homeowners</span>
              <span aria-hidden="true">·</span>
              <span>Kolkata Estates</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
              Client Testimonials & Handover Outcomes.
            </h1>
            <p className="text-sm text-white/70 leading-relaxed font-normal">
              Read transparent evaluations from doctors, industrialists, and venture partners who entrusted their luxury residences and commercial headquarters to Regalien Infrastructure.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Grid Component */}
      <TestimonialsSection />

      {/* Trust Metrics Strip */}
      <section className="py-16 bg-white border-t border-[#111111]/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-[#F3EEE3]/40 border border-[#111111]/10 space-y-2">
            <span className="font-serif text-4xl font-bold text-[#111111] block tabular-nums">99.4%</span>
            <p className="font-semibold text-xs uppercase tracking-wider text-[#D9541E]">On-Time Handover Rate</p>
            <p className="text-xs text-[#111111]/70">Strict adherence to milestone timelines with delay penalty guarantees.</p>
          </div>

          <div className="p-6 bg-[#F3EEE3]/40 border border-[#111111]/10 space-y-2">
            <span className="font-serif text-4xl font-bold text-[#111111] block tabular-nums">180+</span>
            <p className="font-semibold text-xs uppercase tracking-wider text-[#D9541E]">Completed Residences</p>
            <p className="text-xs text-[#111111]/70">Duplexes, sky villas, and bungalows in Newtown, Alipore, and Ballygunge.</p>
          </div>

          <div className="p-6 bg-[#F3EEE3]/40 border border-[#111111]/10 space-y-2">
            <span className="font-serif text-4xl font-bold text-[#111111] block tabular-nums">10 Years</span>
            <p className="font-semibold text-xs uppercase tracking-wider text-[#D9541E]">Cabinetry & Hardware Warranty</p>
            <p className="text-xs text-[#111111]/70">Backed by genuine Austrian and German engineered components.</p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <div className="py-16 bg-[#F3EEE3] text-center">
        <div className="max-w-xl mx-auto px-6 space-y-4">
          <h3 className="font-serif text-2xl font-bold text-[#111111]">
            Experience the Regalien Standard for Yourself.
          </h3>
          <p className="text-xs text-[#111111]/70">
            Book an architectural walkthrough at our Astra Towers studio or invite our team to inspect your bare shell flat.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('/consultation')}
              className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-[#D9541E] hover:bg-[#b84214] transition-colors shadow-md cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Free Consultation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
