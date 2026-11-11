import React from 'react';
import { useApp } from '../context/AppContext';
import { TestimonialsSkeleton } from './SkeletonLoaders';
import { Star, Quote, CheckCircle, ShieldCheck } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, isLoading } = useApp();

  return (
    <section id="testimonials" className="py-20 bg-[#F3EEE3] border-t border-[#111111]/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header with Scroll Reveal */}
        <div className="reveal-on-scroll flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#D9541E] mb-2">
              <span>Client Voices</span>
              <span aria-hidden="true">·</span>
              <span>Verified Kolkata Homeowners</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] leading-tight">
              Testimonials of Craftsmanship.
            </h2>
          </div>

          <p className="text-sm text-[#111111]/70 max-w-md font-normal leading-relaxed">
            Our highest pride is not just the awards won, but the lifelong relationships built with Kolkata's leading doctors, industrialists, and tech founders.
          </p>
        </div>

        {/* Testimonials 3-Column Grid with Skeleton Loading State */}
        {isLoading ? (
          <TestimonialsSkeleton count={3} />
        ) : (
          <div className="stagger-cards-container grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="stagger-card p-8 bg-white border border-[#111111]/10 flex flex-col justify-between hover:shadow-2xl hover:border-[#D9541E]/40 transition-all duration-300 hover:-translate-y-2 relative group"
            >
              <div className="space-y-4">
                {/* Rating Stars & Year */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#D9541E]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-[#111111]/50 font-mono">{t.year}</span>
                </div>

                {/* Quote */}
                <p className="text-sm text-[#111111]/85 italic leading-relaxed font-serif text-base">
                  "{t.quote}"
                </p>

                {/* Specific Quantitative Outcome */}
                <div className="pt-3 border-t border-[#111111]/10">
                  <span className="text-[10px] uppercase tracking-wider text-[#111111]/50 block font-semibold">
                    Key Result:
                  </span>
                  <p className="text-xs text-[#D9541E] font-medium mt-0.5">
                    {t.outcome}
                  </p>
                </div>
              </div>

              {/* Author & Project Lockup */}
              <div className="pt-6 mt-6 border-t border-[#111111]/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-xs text-[#111111]">
                      {t.clientName}
                    </h4>
                    <p className="text-[11px] text-[#111111]/60">
                      {t.role}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-medium block">
                      ✓ Verified Handover
                    </span>
                    <span className="text-[11px] text-[#111111]/50 block">
                      {t.location}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-[#111111]/60 truncate font-mono">
                  {t.project}
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </section>
  );
};
