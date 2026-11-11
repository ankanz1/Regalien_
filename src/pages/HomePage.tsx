import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { useApp } from '../context/AppContext';
import { useTransitionNavigation } from '../components/PageTransition';
import { FeaturedProjectDetail } from '../components/FeaturedProjectDetail';
import { Project } from '../types';
import { 
  ArrowUpRight, ArrowRight, Calendar, MessageSquare, 
  Phone, MapPin, Sparkles, CheckCircle2 
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { projects, company } = useApp();
  const { navigateTo } = useTransitionNavigation();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Collections mapping to projects
  const collectionCards = [
    {
      id: projects[0]?.id || 'proj-1',
      name: 'Mondrian Living',
      tag: 'Luxury Duplex',
      image: '/src/assets/images/hero_luxury_interior_1794294899489.jpg',
      project: projects[0],
    },
    {
      id: projects[1]?.id || 'proj-2',
      name: 'Nirnia Penthouse',
      tag: 'Skyline Suite',
      image: '/src/assets/images/portfolio_penthouse_living_1794294899673.jpg',
      project: projects[1] || projects[0],
    },
    {
      id: projects[4]?.id || 'proj-5',
      name: 'Artex Executive',
      tag: 'Corporate Architecture',
      image: '/src/assets/images/portfolio_commercial_lounge_1794294900883.jpg',
      project: projects[4] || projects[0],
    },
    {
      id: projects[2]?.id || 'proj-3',
      name: 'Brera Suite',
      tag: 'Master Sanctuary',
      image: '/src/assets/images/portfolio_master_suite_1794294900756.jpg',
      project: projects[2] || projects[0],
    },
    {
      id: projects[3]?.id || 'proj-4',
      name: 'Alea Pro Island',
      tag: 'Modular Kitchen & Bar',
      image: '/src/assets/images/portfolio_modular_kitchen_1794294901675.jpg',
      project: projects[3] || projects[0],
    },
    {
      id: projects[1]?.id || 'proj-2-alt',
      name: 'Nirnia Lounge',
      tag: 'Bespoke Joinery',
      image: '/src/assets/images/portfolio_penthouse_living_1794294899673.jpg',
      project: projects[1] || projects[0],
    },
  ];

  return (
    <div className="bg-[#F3EEE3] text-[#111111]">
      {/* 1. Contemporary Rounded Hero */}
      <Hero />

      {/* 2. Modern Minimalist Bento Grid (Matching Reference Image) */}
      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Large Bento Card: "Modern Minimalist" */}
          <div
            onClick={() => setSelectedProject(projects[0])}
            className="lg:col-span-8 relative min-h-[420px] sm:min-h-[480px] rounded-3xl overflow-hidden shadow-lg bg-[#111111] group cursor-pointer flex flex-col justify-between p-8 sm:p-10"
          >
            <img
              src="/src/assets/images/portfolio_penthouse_living_1794294899673.jpg"
              alt="Modern Minimalist Interior"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

            {/* Top Pill Tag */}
            <div className="relative z-10">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-medium border border-white/25">
                Overview Interior
              </span>
            </div>

            {/* Bottom Title */}
            <div className="relative z-10 space-y-2">
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                Modern <br /> Minimalist
              </h2>
              <p className="text-xs sm:text-sm text-white/80 max-w-md">
                A harmonious dialogue between dark fluted oak, tactile bouclé upholstery, and floor-to-ceiling panoramic Bengal daylight.
              </p>
            </div>
          </div>

          {/* Right Column Bento Cards */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Top Right Card: "Into a gallery of elegance" */}
            <div className="bg-[#FAF7F2] p-8 sm:p-9 rounded-3xl border border-[#111111]/10 shadow-sm flex flex-col justify-between h-[230px]">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#111111]/5 text-[#111111] text-[11px] font-medium mb-3">
                  Aesthetics
                </span>
                <p className="text-[11px] text-[#111111]/60 leading-relaxed mb-2">
                  Aesthetic furniture where every piece tells a story of style.
                </p>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] leading-snug">
                Into a gallery <br /> of elegance
              </h3>
            </div>

            {/* Bottom Right Card: Armchair photo with circular arrow button */}
            <div
              onClick={() => setSelectedProject(projects[4] || projects[0])}
              className="relative h-[240px] rounded-3xl overflow-hidden bg-[#111111] group cursor-pointer shadow-sm p-6 flex flex-col justify-between"
            >
              <img
                src="/src/assets/images/portfolio_commercial_lounge_1794294900883.jpg"
                alt="Bespoke Furniture"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

              <div className="relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-medium border border-white/25">
                  Bespoke Furniture
                </span>
              </div>

              <div className="relative z-10 flex items-end justify-between">
                <div>
                  <p className="text-xs text-white/80 max-w-[180px] leading-relaxed">
                    Indulge in the artistry of everyday living.
                  </p>
                </div>

                {/* Circular Arrow Button matching reference */}
                <div className="w-10 h-10 rounded-full bg-white text-[#111111] flex items-center justify-center shadow-lg group-hover:bg-[#D9541E] group-hover:text-white transition-colors shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Metrics Strip (500+ / 20+ / 50+ / 1st) matching reference */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left border-y border-[#111111]/15 py-10">
          <div>
            <span className="font-sans text-4xl sm:text-5xl font-bold text-[#111111] block tabular-nums">
              180+
            </span>
            <p className="text-xs text-[#111111]/60 font-medium mt-1">Residences Handcrafted</p>
          </div>

          <div>
            <span className="font-sans text-4xl sm:text-5xl font-bold text-[#111111] block tabular-nums">
              20+
            </span>
            <p className="text-xs text-[#111111]/60 font-medium mt-1">Senior Architects & Engineers</p>
          </div>

          <div>
            <span className="font-sans text-4xl sm:text-5xl font-bold text-[#111111] block tabular-nums">
              50+
            </span>
            <p className="text-xs text-[#111111]/60 font-medium mt-1">Satisfied Luxury Clients</p>
          </div>

          <div>
            <span className="font-sans text-4xl sm:text-5xl font-bold text-[#111111] block tabular-nums">
              1<sup>st</sup>
            </span>
            <p className="text-xs text-[#111111]/60 font-medium mt-1">Premier Newtown Studio (Astra Towers)</p>
          </div>
        </div>
      </section>

      {/* 4. "Modern Style Timeless Charm" Split Section matching reference */}
      <section className="px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Landscape Image Card with Rounded-3xl */}
          <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-lg bg-[#111111]">
            <img
              src="/src/assets/images/portfolio_master_suite_1794294900756.jpg"
              alt="Modern Style Timeless Charm"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Right Editorial Copy matching reference */}
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs uppercase font-mono tracking-wider text-[#111111]/50 block">
              Elegance · Timeless
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] leading-tight">
              Modern Style <br /> Timeless Charm
            </h2>

            <p className="text-xs sm:text-sm text-[#111111]/75 leading-relaxed font-normal">
              Discover Regalien 2026 preview, featuring bespoke villas, modular kitchens, and penthouses embodying diverse lifestyle concepts, minimalist seating tables, coffee tables, and sideboards.
            </p>

            <div className="pt-2">
              <button
                onClick={() => navigateTo('/services')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111111] text-white hover:bg-[#D9541E] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                <span>About Us →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. "Explore Our Proudly Collection" (6-Card Curved Grid with ↗ Buttons) */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Section Header matching reference */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] leading-tight">
                Explore Our Proudly <br /> Collection
              </h2>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3 max-w-md">
              <p className="text-xs sm:text-sm text-[#111111]/70 leading-relaxed md:text-right">
                Regalien showcases its vision of contemporary architecture, interior design trends, and innovative living at Astra Towers Newtown.
              </p>
              <button
                onClick={() => navigateTo('/portfolio')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#111111] text-white hover:bg-[#D9541E] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <span>View More →</span>
              </button>
            </div>
          </div>

          {/* 6 Curved Cards Grid (3 Columns) matching reference image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collectionCards.map((card, idx) => {
              // Asymmetric heights to match the Poliform editorial look
              const isTall = idx === 1;
              const heightClass = isTall ? 'min-h-[420px] sm:row-span-2' : 'min-h-[290px] sm:min-h-[320px]';

              return (
                <div
                  key={idx}
                  onClick={() => card.project && setSelectedProject(card.project)}
                  className={`relative ${heightClass} rounded-2xl overflow-hidden bg-[#111111] group cursor-pointer shadow-md p-5 flex flex-col justify-end transition-all duration-300 hover:shadow-2xl`}
                >
                  <img
                    src={card.image}
                    alt={card.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Card Bottom Bar with Label and Circular ↗ Arrow */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <h3 className="font-sans text-base sm:text-lg font-bold text-white leading-tight">
                        {card.name}
                      </h3>
                      <p className="text-[10px] text-white/60 font-mono">{card.tag}</p>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-white/90 text-[#111111] flex items-center justify-center shadow-md group-hover:bg-[#D9541E] group-hover:text-white transition-colors shrink-0">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. "Engage with Us in Conversation." (Dark Section matching reference) */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto bg-[#111111] text-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                Engage with Us in <br /> Conversation.
              </h2>

              <p className="text-xs sm:text-sm text-white/75 max-w-md leading-relaxed font-normal">
                In a global world based on communication, a brand must look beyond its borders, open up to new experiences, and dare to be different. Meeting the highest minds of one's time is the most effective way to nurture creativity.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={() => navigateTo('/consultation')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#D9541E] hover:bg-[#b84214] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve Consultation</span>
                </button>

                <button
                  onClick={() => navigateTo('/location')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white hover:text-[#111111] text-white text-xs font-bold uppercase tracking-wider transition-all border border-white/20 cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Visit Astra Towers</span>
                </button>
              </div>
            </div>

            {/* Right Photo Card matching reference */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="/src/assets/images/portfolio_penthouse_living_1794294899673.jpg"
                  alt="Conversational Lounge Setting"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-xs text-white/80 font-mono">
                  ASR 026 Ground Floor, Astra Towers · Newtown Kolkata
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Project Detail Overlay if opened */}
      {selectedProject && (
        <FeaturedProjectDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};
