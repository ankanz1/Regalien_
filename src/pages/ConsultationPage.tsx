import React from 'react';
import { CalendarBooking } from '../components/CalendarBooking';
import { useTransitionNavigation } from '../components/PageTransition';
import { Calendar, CheckCircle2, Clock, MapPin, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ConsultationPage: React.FC = () => {
  const { company } = useApp();
  const { navigateTo } = useTransitionNavigation();

  return (
    <div className="bg-[#F3EEE3] min-h-screen">
      {/* Page Header */}
      <div className="py-12 md:py-16 bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#D9541E]">
              <span>Direct Scheduling</span>
              <span aria-hidden="true">·</span>
              <span>Google Calendar Integration</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
              Reserve an Architectural Consultation.
            </h1>
            <p className="text-sm text-white/70 leading-relaxed font-normal">
              Pick a date and real-time availability slot. Sync instantly to your Google Calendar, receive an automated email confirmation, and meet our senior architects at Astra Towers, Newtown or on-site.
            </p>
          </div>
        </div>
      </div>

      {/* Main Booking Engine */}
      <CalendarBooking />

      {/* Consultation Perks Banner */}
      <div className="py-12 bg-white border-t border-[#111111]/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#111111]/80">
          <div className="flex items-start gap-3 p-4 bg-[#F3EEE3]/40 border border-[#111111]/10">
            <CheckCircle2 className="w-5 h-5 text-[#D9541E] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#111111] block mb-1">Tactile Material Library</strong>
              <span>Touch physical imported Italian marble slabs, Austrian hinge mockups, and fluted acoustic wood samples.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-[#F3EEE3]/40 border border-[#111111]/10">
            <Clock className="w-5 h-5 text-[#D9541E] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#111111] block mb-1">60-Minute Dedicated Session</strong>
              <span>Uninterrupted 1-on-1 session with a senior architect to analyze your bare shell floor plan.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-[#F3EEE3]/40 border border-[#111111]/10">
            <MapPin className="w-5 h-5 text-[#D9541E] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#111111] block mb-1">Astra Towers Newtown</strong>
              <span>Ground floor studio ASR 026 with dedicated basement visitor parking and direct road access.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
