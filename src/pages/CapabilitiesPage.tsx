import React from 'react';
import { ServicesSection } from '../components/ServicesSection';
import { SectionTransitionRibbon } from '../components/SectionTransitionRibbon';
import { useTransitionNavigation } from '../components/PageTransition';
import { CheckCircle2, Shield, Calendar, Layers, Clock, ArrowRight } from 'lucide-react';

export const CapabilitiesPage: React.FC = () => {
  const { navigateTo } = useTransitionNavigation();

  const stages = [
    {
      step: '01',
      title: 'Architectural Blueprint & Photorealistic 3D',
      desc: 'Digital laser survey of your bare shell site, structural load evaluation, electrical/plumbing layouts, and VR walkthroughs before procurement.',
    },
    {
      step: '02',
      title: 'Material Sourcing & Factory Pre-Fabrication',
      desc: 'Imported Italian marble selection, kiln-dried hardwood sourcing, and CNC modular carcass cutting in our controlled clean factory environment.',
    },
    {
      step: '03',
      title: 'In-House Civil & Acoustic Execution',
      desc: 'Our own certified masons, false-ceiling craftsmen, and electrical engineers handle all site work with strict acoustic isolation standards.',
    },
    {
      step: '04',
      title: 'Final Detailing & Turnkey Handover',
      desc: 'Art curation, circadian lighting programming, high-pressure snag inspection, and on-time key handover with our 10-year warranty document.',
    },
  ];

  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="py-16 md:py-20 bg-[#F3EEE3] border-b border-[#111111]/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#D9541E] mb-2">
              <span>Engineering & Craftsmanship</span>
              <span aria-hidden="true">·</span>
              <span>Full Turnkey Discipline</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111111] leading-tight">
              Architectural Capabilities & Turnkey Services.
            </h1>
            <p className="text-base text-[#111111]/75 mt-3 leading-relaxed">
              We eliminate the friction between architectural vision and contractor craftsmanship. From raw concrete shell to final art placement, Regalien Infrastructure manages every phase in-house.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid Component */}
      <ServicesSection />

      {/* 4-Stage Execution Methodology */}
      <section className="py-20 bg-[#F3EEE3] border-t border-[#111111]/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#D9541E] font-semibold block mb-1">
              Methodology
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#111111]">
              The 4-Stage Turnkey Protocol.
            </h2>
            <p className="text-xs text-[#111111]/70 mt-2">
              Structured milestone accountability that delivers luxury on-time with zero snags.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stages.map((st) => (
              <div key={st.step} className="p-6 bg-white border border-[#111111]/10 flex flex-col justify-between space-y-4">
                <div>
                  <span className="font-serif text-3xl font-bold text-[#D9541E] block mb-2 tabular-nums">
                    {st.step}.
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#111111] mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-[#111111]/70 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <button
              onClick={() => navigateTo('/consultation')}
              className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#D9541E] transition-colors shadow-md cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Initial Studio Walkthrough</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
