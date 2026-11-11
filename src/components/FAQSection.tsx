import React, { useState } from 'react';
import { ChevronDown, Plus, Minus, HelpCircle, ArrowRight } from 'lucide-react';
import { useTransitionNavigation } from './PageTransition';

interface FAQItem {
  id: string;
  category: 'Timelines' | 'Budget' | 'Consultation' | 'Quality';
  question: string;
  answer: string;
  highlight?: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Timelines',
    question: 'How long does a complete turnkey interior take from bare shell to handover?',
    answer: 'For luxury residences ranging from 2,500 to 6,000 sq.ft (e.g., 3BHK, 4BHK duplexes and penthouses in Newtown or Alipore), our turnkey execution timeline averages 12 to 16 weeks. Because we operate our own in-house modular fabrication facility and stone masonry team, civil restructuring and carpentry run concurrently. Every contract includes an enforceable milestone timeline backed by a financial penalty clause credited to the client for any unapproved delay.',
    highlight: '12 – 16 Weeks Average with Milestone Penalty Guarantee',
  },
  {
    id: 'faq-2',
    category: 'Timelines',
    question: 'Can you start planning while the real estate builder is completing civil possession?',
    answer: 'Absolutely. In fact, engaging us 60 to 90 days before possession is ideal. Our architectural team takes precision digital measurements, drafts complete 3D photorealistic walkthroughs, finalizes the electrical and plumbing layout, and pre-cuts engineered cabinetry off-site. The moment possession keys are handed over, our civil and structural artisans begin site work without a single day lost.',
    highlight: 'Off-site pre-fabrication reduces on-site dust and delays by 35%',
  },
  {
    id: 'faq-3',
    category: 'Budget',
    question: 'How do you structure interior design pricing and budget estimation in Kolkata?',
    answer: 'We operate on a strictly itemized Bill of Quantities (BOQ) with transparent per-square-foot benchmarks. Turnkey luxury residences typically range between ₹1,800 and ₹3,500+ per sq.ft depending on whether you choose imported Italian marble (e.g. Nero Marquina, Travertine Navona), Austrian motorized hardware (Blum Servo-Drive), and integrated architectural lighting. You receive a complete line-item breakdown specifying exact brand names, board grades, and finishes prior to signing.',
    highlight: '100% Itemized BOQ with Zero Escalation Guarantee',
  },
  {
    id: 'faq-4',
    category: 'Budget',
    question: 'Are there hidden contractor charges or mid-project cost escalations?',
    answer: 'Never. Unlike conventional contractor setups where hidden civil charges and unexpected variations are added halfway through, Regalien fixes material specifications, quantities, and labor rates in a binding contract. If a drawing or material requirement does not change at your request, your final invoice matches your initial quote to the single rupee.',
    highlight: 'Fixed-price contract with zero surprise billings',
  },
  {
    id: 'faq-5',
    category: 'Consultation',
    question: 'What happens during an architectural consultation at your Astra Towers studio?',
    answer: 'Your dedicated 60-minute session at ASR 026 Ground Floor, Astra Towers is a collaborative spatial workshop. You will meet our principal architect, review your 2D blueprints on large-format screens, and physically touch real slabs of bookmatched marble, smoked oak veneers, fluted acoustic slats, and circadian LED lighting displays. By the end of the session, we formulate a preliminary budget bracket and concept direction.',
    highlight: 'Hands-on material sampling and preliminary space layout',
  },
  {
    id: 'faq-6',
    category: 'Consultation',
    question: 'How does the Google Calendar integration work for scheduling appointments?',
    answer: 'Our website features a real-time availability engine synced directly with our senior architects’ live calendar. Once you choose your preferred date and time slot, you receive an instant 1-click Google Calendar sync link that automatically populates the studio location (Astra Towers Newtown), meeting agenda, and reminder notifications into your personal calendar, along with a downloadable .ICS invite.',
    highlight: 'Instant 1-click sync with automatic Google Calendar invite',
  },
  {
    id: 'faq-7',
    category: 'Quality',
    question: 'What warranties, structural standards, and post-handover care do you provide?',
    answer: 'We provide an industry-leading 10-year comprehensive warranty on all engineered modular cabinetry, internal carcass joinery, and German hardware mechanisms. Furthermore, all wet-area stone sealing and waterproofing treatments are certified. Following project handover, we provide complimentary bi-annual inspection visits for the first 24 months to ensure smooth hinge operations and flawless veneer condition.',
    highlight: '10-Year Warranty & 2-Year Complimentary Maintenance Visits',
  },
];

import { useApp } from '../context/AppContext';

const CATEGORIES = ['All Questions', 'Timelines', 'Budget', 'Consultation', 'Quality'] as const;

export const FAQSection: React.FC = () => {
  const { faqs } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All Questions');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true, // Open the first question by default
    'faq-3': true, // Open budget question by default
  });
  const { navigateTo } = useTransitionNavigation();

  const toggleFAQ = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const activeFaqs = faqs && faqs.length > 0 ? faqs : FAQS;

  const filteredFaqs = selectedCategory === 'All Questions'
    ? activeFaqs
    : activeFaqs.filter((f) => f.category === selectedCategory || (selectedCategory === 'Timelines' && f.category === 'Turnkey Execution') || (selectedCategory === 'Budget' && f.category === 'Pricing & Milestones') || (selectedCategory === 'Quality' && f.category === 'Materials & Warranty') || (selectedCategory === 'Consultation' && f.category === 'Astra Towers Studio'));

  return (
    <section id="faq" className="py-20 bg-[#F3EEE3] border-t border-[#111111]/10">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#D9541E] mb-2">
              <span>Client Clarity</span>
              <span aria-hidden="true">·</span>
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] leading-tight">
              Essential Insights on Timelines & Budgets.
            </h2>
          </div>

          <p className="text-sm text-[#111111]/70 max-w-sm font-normal leading-relaxed">
            Transparent answers regarding turnkey durations, cost structures, and our Astra Towers design consultation workflow.
          </p>
        </div>

        {/* Category Filter Buttons (Segmented Controls) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 border-b border-[#111111]/10 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                selectedCategory === cat
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-white/60 text-[#111111]/80 border-[#111111]/15 hover:border-[#111111] hover:bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = !!openIds[faq.id];
            // Natural editorial numbering
            const numStr = String(index + 1).padStart(2, '0');

            return (
              <div
                key={faq.id}
                className={`bg-white border transition-all duration-200 overflow-hidden ${
                  isOpen ? 'border-[#D9541E]/60 shadow-md' : 'border-[#111111]/10 hover:border-[#111111]/30'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-6 sm:p-7 flex items-start justify-between gap-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9541E]"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <span className="font-serif text-base sm:text-lg font-bold text-[#D9541E] tabular-nums shrink-0 mt-0.5">
                      {numStr}.
                    </span>
                    <span className="font-serif text-lg sm:text-xl font-bold text-[#111111] leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-none border border-[#111111]/15 bg-[#F3EEE3]/50 flex items-center justify-center shrink-0 text-[#111111] mt-0.5 transition-colors">
                    {isOpen ? <Minus className="w-4 h-4 text-[#D9541E]" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-7 sm:px-7 sm:pb-8 pt-0 space-y-4 text-xs sm:text-sm text-[#111111]/80 leading-relaxed border-t border-[#111111]/5 animate-in fade-in duration-200">
                    <p className="mt-4">{faq.answer}</p>

                    {faq.highlight && (
                      <div className="p-3 bg-[#F3EEE3]/60 border-l-2 border-[#D9541E] text-xs font-medium text-[#111111] flex items-center justify-between">
                        <span><strong>Standard:</strong> {faq.highlight}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Box */}
        <div className="mt-12 p-8 bg-white border border-[#111111]/15 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-serif text-xl font-bold text-[#111111]">
              Have a specific question about your floor plan?
            </h4>
            <p className="text-xs text-[#111111]/70">
              Schedule an in-person walkthrough at our Astra Towers material studio or speak with an architect.
            </p>
          </div>

          <button
            onClick={() => navigateTo('/consultation')}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#D9541E] hover:bg-[#b84214] transition-colors shrink-0 shadow-sm cursor-pointer"
          >
            <span>Book Consultation Slot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
