import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CATEGORIES = ['All Questions', 'Turnkey Execution', 'Pricing & Milestones', 'Astra Towers Studio', 'Materials & Warranty'] as const;

export const FAQSection: React.FC = () => {
  const { faqs } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All Questions');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  const filteredFaqs = selectedCategory === 'All Questions'
    ? faqs
    : faqs.filter((faq) => faq.category === selectedCategory);

  return (
    <section id="faq" className="py-20 bg-[#F3EEE3] border-t border-[#111111]/10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#D9541E] mb-2">
              <span>Client Clarity</span><span aria-hidden="true">·</span><span>Frequently Asked Questions</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] leading-tight">
              Essential Insights on Timelines & Budgets.
            </h2>
          </div>
          <p className="text-sm text-[#111111]/70 max-w-sm leading-relaxed">
            Published answers from the Regalien team regarding turnkey durations, cost structures, and consultation.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 border-b border-[#111111]/10 no-scrollbar">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap shrink-0 border ${
                selectedCategory === category
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-white/60 text-[#111111]/80 border-[#111111]/15 hover:border-[#111111]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredFaqs.length === 0 && (
            <div className="p-8 bg-white border border-[#111111]/10 text-sm text-[#111111]/65">
              No published FAQs are available yet.
            </div>
          )}
          {filteredFaqs.map((faq) => {
            const isOpen = Boolean(openIds[faq.id]);
            return (
              <div key={faq.id} className="bg-white border border-[#111111]/10">
                <button
                  onClick={() => setOpenIds((current) => ({ ...current, [faq.id]: !isOpen }))}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg font-bold text-[#111111]">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#D9541E]' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-[#111111]/75 leading-relaxed">
                    <p>{faq.answer}</p>
                    {faq.highlight && <p className="mt-3 text-xs font-semibold text-[#D9541E]">{faq.highlight}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex items-center gap-2 text-xs text-[#111111]/60">
          <HelpCircle className="w-4 h-4 text-[#D9541E]" />
          <span>Questions not covered? Contact the Regalien studio team.</span>
        </div>
      </div>
    </section>
  );
};
