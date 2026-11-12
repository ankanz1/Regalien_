import React from 'react';
import { Home, Layers, Sparkles, Building, Sliders, ShieldCheck, ArrowRight } from 'lucide-react';
import { useTransitionNavigation } from './PageTransition';

interface ServiceItem {
  number: string;
  title: string;
  description: string;
  highlights: string[];
  timeline: string;
}

const SERVICES: ServiceItem[] = [
  {
    number: '01',
    title: 'Turnkey Luxury Residences',
    description: 'Complete end-to-end design, civil restructuring, imported stone masonry, and bespoke furniture manufacturing with single-point accountability.',
    highlights: ['3D Photorealistic Pre-visualization', 'Full Civil & MEP Engineering', 'Italian Marble Procurement & Bookmatching'],
    timeline: '12 – 16 Weeks',
  },
  {
    number: '02',
    title: 'Penthouse & Sky Villa Suites',
    description: 'Specialized structural framing for high-altitude wind resistance, double-height acoustic ceilings, customized home bars, and skyline terraces.',
    highlights: ['Acoustic Decibel Isolation (40dB+)', 'Skyline Glass Envelope Integration', 'Custom Temperature-Controlled Cellars'],
    timeline: '14 – 18 Weeks',
  },
  {
    number: '03',
    title: 'Precision Modular Kitchens & Islands',
    description: 'Manufactured with German and Austrian hardware (Blum, Hafele, Hettich) using anti-scratch nanotech laminate, Calacatta waterfall counters, and integrated concealed appliances.',
    highlights: ['Servo-Drive Motorized Drawers', 'Integrated Concealed Induction & Extractors', 'Fluted Glass Showcase Illumination'],
    timeline: '4 – 6 Weeks',
  },
  {
    number: '04',
    title: 'Executive Commercial & Workspaces',
    description: 'Branded architectural reception lobbies, acoustic conference boardrooms, and ergonomic executive suites for premier Kolkata firms in Sector V and Newtown.',
    highlights: ['Acoustic Wall Paneling & Baffles', 'Low-Glare Architectural Lighting Systems', 'Modular Ergonomic Bench Systems'],
    timeline: '8 – 12 Weeks',
  },
  {
    number: '05',
    title: 'Architectural Lighting & Smart Automation',
    description: 'Circadian lighting engineering using warm 2700K recessed coves, magnetic tracks, and scene presets tailored for art collections and intimate entertaining.',
    highlights: ['DALI & Zigbee Automation Protocols', 'High CRI (95+) True Color Rendering', 'Sculptural Statement Chandeliers'],
    timeline: 'Integrated with Turnkey',
  },
  {
    number: '06',
    title: 'Bespoke Furniture & Joinery Crafting',
    description: 'In-house master carpenters craft one-of-a-kind curved bouclé sofas, smoked oak credenzas, fluted wardrobes, and dining tables designed to exact space proportions.',
    highlights: ['Kiln-Dried Hardwood Frames', 'Italian Full-Grain Leather & Linens', 'Hand-Applied Polyurethane Finishes'],
    timeline: '6 – 8 Weeks',
  },
];

export const ServicesSection: React.FC = () => {
  const { navigateTo } = useTransitionNavigation();

  return (
    <section id="services" className="py-20 bg-white border-t border-[#111111]/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header with Scroll Reveal */}
        <div className="reveal-on-scroll max-w-2xl mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#D9541E] mb-2">
            <span>Core Disciplines</span>
            <span aria-hidden="true">·</span>
            <span>Turnkey Execution</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] leading-tight">
            Integrated Architectural Capabilities.
          </h2>
          <p className="text-sm text-[#111111]/75 mt-3 leading-relaxed">
            Unlike design-only consultants who hand drawings over to third-party contractors, Regalien Infrastructure manages every square millimeter in-house — from initial spatial blueprints to the final coat of hand-polished lacquer.
          </p>
        </div>

        {/* Services Grid with Staggered Entrance */}
        <div className="stagger-cards-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.number}
              className="stagger-card p-8 bg-[#F3EEE3]/40 border border-[#111111]/10 flex flex-col justify-between hover:bg-white hover:border-[#D9541E]/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div>
                {/* Natural editorial numbering (not code comment) */}
                <span className="font-serif text-3xl font-bold text-[#D9541E]/80 group-hover:text-[#D9541E] transition-colors block mb-4 tabular-nums">
                  {service.number}.
                </span>

                <h3 className="font-serif text-2xl font-bold text-[#111111] mb-3 group-hover:text-[#D9541E] transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs text-[#111111]/75 leading-relaxed mb-6">
                  {service.description}
                </p>

                <div className="space-y-2 pt-4 border-t border-[#111111]/10">
                  <span className="text-[10px] uppercase tracking-wider text-[#111111]/50 font-semibold block">
                    Deliverables:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#111111]/80">
                    {service.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#D9541E] shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#111111]/10 flex items-center justify-between text-xs">
                <span className="text-[#111111]/60">Typical Timeline: <strong className="text-[#111111]">{service.timeline}</strong></span>
                <button
                  onClick={() => navigateTo('/consultation')}
                  className="font-semibold text-[#D9541E] hover:text-[#111111] transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  Consult <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
