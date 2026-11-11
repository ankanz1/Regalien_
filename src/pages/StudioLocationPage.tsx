import React from 'react';
import { StudioLocation } from '../components/StudioLocation';
import { SocialMediaRibbon } from '../components/SocialMediaRibbon';
import { useTransitionNavigation } from '../components/PageTransition';
import { MapPin, Navigation, Calendar, Car, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StudioLocationPage: React.FC = () => {
  const { company } = useApp();
  const { navigateTo } = useTransitionNavigation();

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="py-12 md:py-16 bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#D9541E]">
              <span>Physical Material Library</span>
              <span aria-hidden="true">·</span>
              <span>Newtown Flagship</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
              Astra Towers Design Studio.
            </h1>
            <p className="text-sm text-white/70 leading-relaxed font-normal">
              Touch full-scale Italian marble slabs, examine fluted acoustic wood profiles, and review 3D VR walkthroughs of your future home at ASR 026 Ground Floor, Astra Towers.
            </p>
          </div>
        </div>
      </div>

      {/* Main Studio Location Component */}
      <StudioLocation />

      {/* Social Media Ribbon */}
      <SocialMediaRibbon />

      {/* Quick Booking CTA */}
      <div className="py-16 bg-[#F3EEE3] text-center border-t border-[#111111]/10">
        <div className="max-w-xl mx-auto px-6 space-y-4">
          <h3 className="font-serif text-2xl font-bold text-[#111111]">
            Plan Your Studio Walkthrough.
          </h3>
          <p className="text-xs text-[#111111]/70">
            Let our design coordinators prepare dedicated material swatches matching your specific floor plan prior to your arrival.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('/consultation')}
              className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-[#D9541E] hover:bg-[#b84214] transition-colors shadow-md cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve Visiting Slot</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
