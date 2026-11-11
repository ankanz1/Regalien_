import React from 'react';
import { FAQSection } from '../components/FAQSection';
import { useTransitionNavigation } from '../components/PageTransition';
import { HelpCircle, Calendar, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FAQPage: React.FC = () => {
  const { company } = useApp();
  const { navigateTo } = useTransitionNavigation();

  return (
    <div className="bg-[#F3EEE3] min-h-screen">
      {/* Page Header */}
      <div className="py-12 md:py-16 bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#D9541E]">
              <span>Transparency & Standards</span>
              <span aria-hidden="true">·</span>
              <span>Client FAQ Guide</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
              Frequently Asked Questions.
            </h1>
            <p className="text-sm text-white/70 leading-relaxed font-normal">
              Learn about our turnkey execution timelines, transparent itemized BOQ calculations, Italian marble sourcing, and Google Calendar consultation process in Kolkata.
            </p>
          </div>
        </div>
      </div>

      {/* Main FAQ Accordion Component */}
      <FAQSection />

      {/* Direct Contact Helpstrip */}
      <div className="py-12 bg-white border-t border-[#111111]/10">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-serif text-lg font-bold text-[#111111]">
              Need immediate answers for an upcoming property handover?
            </h4>
            <p className="text-xs text-[#111111]/70">
              Speak directly with an architect on our studio hotline.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${company.phone}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#111111] border border-[#111111]/20 hover:border-[#111111]"
            >
              <Phone className="w-3.5 h-3.5 text-[#D9541E]" />
              <span>{company.phone}</span>
            </a>

            <button
              onClick={() => navigateTo('/consultation')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#D9541E] hover:bg-[#b84214] transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
