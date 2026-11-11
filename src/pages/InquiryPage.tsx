import React from 'react';
import { InquiryContactForm } from '../components/InquiryContactForm';
import { useTransitionNavigation } from '../components/PageTransition';

export const InquiryPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="py-12 md:py-16 bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#D9541E]">
              <span>Direct Communication</span>
              <span aria-hidden="true">·</span>
              <span>Turnkey Estimates</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
              Commission Your Project.
            </h1>
            <p className="text-sm text-white/70 leading-relaxed font-normal">
              Provide your property details, super built-up area in square feet, and planned handover timeline. Receive an automated email confirmation and a detailed cost estimate from our senior architects.
            </p>
          </div>
        </div>
      </div>

      {/* Inquiry Form */}
      <InquiryContactForm />
    </div>
  );
};
