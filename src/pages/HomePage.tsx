import React, { useState, useMemo } from 'react';
import { Hero } from '../components/Hero';
import { useApp } from '../context/AppContext';
import { useTransitionNavigation } from '../components/PageTransition';
import { FeaturedProjectDetail } from '../components/FeaturedProjectDetail';
import { Project } from '../types';
import {
  ArrowUpRight, Calendar, MapPin
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { projects } = useApp();
  const { navigateTo } = useTransitionNavigation();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Dynamically generate collection cards from real projects (first 6 published projects)
  const collectionCards = useMemo(() => {
    const publishedProjects = projects.filter(p => p.published !== false);
    return publishedProjects.slice(0, 6).map((project) => ({
      id: project.id,
      name: project.title,
      tag: project.category,
      image: project.coverImage || `/${encodeURIComponent(project.title.replace(/ /g, '_'))}/1.jpg`,
      project,
    }));
  }, [projects]);

  // Compute statistics from actual project data
  const publishedProjects = useMemo(() => projects.filter(p => p.published !== false), [projects]);
  const uniqueCategories = useMemo(() => {
    const categories = new Set(publishedProjects.map(p => p.category));
    return categories.size;
  }, [publishedProjects]);

  // Top featured project for the large hero card (first project with featured flag or first project)
  const topFeaturedProject = projects.find(p => p.featured && p.published !== false) || projects[0];

  // Get a second featured project for the "Aesthetics" section
  const secondFeaturedProject = projects.find((p, idx) => idx === 1) || projects[1] || projects[0];

  // Find Rishi Pranaya project by slug for the featured section
  const rishiPranayaProject = projects.find(p => p.slug === 'rishi-pranaya' || p.id === 'local-rishi');

  return (
    <div className="bg-[#F3EEE3] text-[#111111]">
      {/* 1. Contemporary Rounded Hero */}
      <Hero />

      {/* 2. Featured Project Showcase - Dynamic from Real Projects */}
      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Large Bento Card: Top Featured Project */}
          {topFeaturedProject && (
            <div
              onClick={() => setSelectedProject(topFeaturedProject)}
              className="lg:col-span-8 relative min-h-[420px] sm:min-h-[480px] rounded-3xl overflow-hidden shadow-lg bg-[#111111] group cursor-pointer flex flex-col justify-between p-8 sm:p-10"
            >
              <img
                src={topFeaturedProject.coverImage || `/${encodeURIComponent(topFeaturedProject.title.replace(/ /g, '_'))}/1.jpg`}
                alt={topFeaturedProject.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

              {/* Top Pill Tag - Project Category */}
              <div className="relative z-10">
                <span className="inline-block px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-medium border border-white/25">
                  {topFeaturedProject.category}
                </span>
              </div>

              {/* Bottom Title */}
              <div className="relative z-10 space-y-2">
                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                  {topFeaturedProject.title.split(' ').slice(0, 2).join(' ')} <br className="sm:hidden" />
                  {topFeaturedProject.title.includes('Point') ? 'Luxury Living' : 'Bespoke Interior'}
                </h2>
                <p className="text-xs sm:text-sm text-white/80 max-w-md">
                  {topFeaturedProject.description || `Regalien's ${topFeaturedProject.title} showcases contemporary architecture with premium materials and artisanal craftsmanship.`}
                </p>
              </div>
            </div>
          )}

          {/* Right Column Bento Cards - Project highlights */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Top Right Card: Second Project Highlight */}
            {secondFeaturedProject && (
              <div
                onClick={() => setSelectedProject(secondFeaturedProject)}
                className="bg-[#FAF7F2] p-8 sm:p-9 rounded-3xl border border-[#111111]/10 shadow-sm flex flex-col justify-between h-[230px] cursor-pointer group"
              >
                <div className="relative">
                  <img
                    src={secondFeaturedProject.coverImage || `/${encodeURIComponent(secondFeaturedProject.title.replace(/ /g, '_'))}/1.jpg`}
                    alt={secondFeaturedProject.title}
                    className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 rounded-2xl" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#111111]/5 text-[#111111] text-[11px] font-medium mb-3">
                    {secondFeaturedProject.category}
                  </span>
                  <p className="text-[11px] text-[#111111]/60 leading-relaxed mb-2">
                    {secondFeaturedProject.description?.substring(0, 100) || 'Premium residential architecture'}
                  </p>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] leading-snug group-hover:text-[#D9541E] transition-colors">
                  {secondFeaturedProject.title.split(' ')[0]}
                </h3>
              </div>
            )}

            {/* Bottom Right Card: Rishi Pranaya Featured Project */}
            {rishiPranayaProject && (
              <div
                onClick={() => setSelectedProject(rishiPranayaProject)}
                className="relative h-[240px] rounded-3xl overflow-hidden bg-[#111111] group cursor-pointer shadow-sm p-6 flex flex-col justify-between"
              >
                <img
                  src={rishiPranayaProject.coverImage || `/${encodeURIComponent(rishiPranayaProject.title.replace(/ /g, '_'))}/1.jpg`}
                  alt={rishiPranayaProject.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-medium border border-white/25">
                    {rishiPranayaProject.category === 'Luxury Residential' ? 'Residential' : 'Commercial'}
                  </span>
                </div>

                <div className="relative z-10 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-white/80 max-w-[180px] leading-relaxed">
                      {rishiPranayaProject.description?.substring(0, 80) || 'Contemporary luxury interior architecture'}
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-white text-[#111111] flex items-center justify-center shadow-lg group-hover:bg-[#D9541E] group-hover:text-white transition-colors shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Metrics Strip - Dynamically computed from actual project data */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left border-y border-[#111111]/15 py-10">
          <div>
            <span className="font-sans text-4xl sm:text-5xl font-bold text-[#111111] block tabular-nums">
              {publishedProjects.length}+
            </span>
            <p className="text-xs text-[#111111]/60 font-medium mt-1">Projects Showcased</p>
          </div>

          <div>
            <span className="font-sans text-4xl sm:text-5xl font-bold text-[#111111] block tabular-nums">
              {uniqueCategories}
            </span>
            <p className="text-xs text-[#111111]/60 font-medium mt-1">Design Categories</p>
          </div>

          <div>
            <span className="font-sans text-lg sm:text-xl font-bold text-[#111111] block">
              Newtown, Kolkata
            </span>
            <p className="text-xs text-[#111111]/60 font-medium mt-1">Our Studio</p>
          </div>

          <div>
            <span className="font-sans text-lg sm:text-xl font-bold text-[#111111] block">
              Residential & Commercial
            </span>
            <p className="text-xs text-[#111111]/60 font-medium mt-1">Our Expertise</p>
          </div>
        </div>
      </section>

      {/* 4. Featured Projects Showcase - From Real Project Data */}
      {projects.slice(0, 2).map((featuredProject, idx) => (
        <React.Fragment key={featuredProject.id}>
          {idx < projects.length - 1 && (
            <section className="px-4 sm:px-6 lg:px-8 py-10">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Alternating image/text layout */}
                {idx % 2 === 0 ? (
                  <>
                    {/* Left Landscape Image Card */}
                    <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-lg bg-[#111111]">
                      <img
                        src={featuredProject.coverImage || `/${encodeURIComponent(featuredProject.title.replace(/ /g, '_'))}/1.jpg`}
                        alt={featuredProject.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    {/* Right Editorial Copy */}
                    <div className="lg:col-span-5 space-y-5">
                      <span className="text-xs uppercase font-mono tracking-wider text-[#111111]/50 block">
                        {featuredProject.category} · {featuredProject.location}
                      </span>

                      <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] leading-tight">
                        {featuredProject.title} <br /> {featuredProject.category === 'Luxury Residential' ? 'Residential Architecture' : 'Commercial Architecture'}
                      </h2>

                      <p className="text-xs sm:text-sm text-[#111111]/75 leading-relaxed font-normal">
                        {featuredProject.description || `Regalien's ${featuredProject.title} embodies contemporary architectural vision with premium materials, artisanal craftsmanship, and sustainable design.`}
                      </p>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setSelectedProject(featuredProject);
                          }}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111111] text-white hover:bg-[#D9541E] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                        >
                          <span>Explore Project →</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Text on left, Image on right for odd index */}
                    <div className="lg:col-span-5 space-y-5 order-2 lg:order-1">
                      <span className="text-xs uppercase font-mono tracking-wider text-[#111111]/50 block">
                        {featuredProject.category} · {featuredProject.location}
                      </span>

                      <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] leading-tight">
                        {featuredProject.title} <br /> {featuredProject.category === 'Luxury Residential' ? 'Residential Architecture' : 'Commercial Architecture'}
                      </h2>

                      <p className="text-xs sm:text-sm text-[#111111]/75 leading-relaxed font-normal">
                        {featuredProject.description || `Regalien's ${featuredProject.title} embodies contemporary architectural vision with premium materials, artisanal craftsmanship, and sustainable design.`}
                      </p>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setSelectedProject(featuredProject);
                          }}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111111] text-white hover:bg-[#D9541E] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                        >
                          <span>Explore Project →</span>
                        </button>
                      </div>
                    </div>

                    {/* Image on right */}
                    <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-lg bg-[#111111] order-1 lg:order-2">
                      <img
                        src={featuredProject.coverImage || `/${encodeURIComponent(featuredProject.title.replace(/ /g, '_'))}/1.jpg`}
                        alt={featuredProject.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </>
                )}
              </div>
            </section>
          )}
        </React.Fragment>
      ))}

      {/* 5. "Explore Our Proudly Collection" - 6-Card Curved Grid from Real Projects */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
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

          {/* 6 Curved Cards Grid (3 Columns) - Dynamic from Real Projects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collectionCards.map((card, idx) => {
              const isTall = idx === 1;
              const heightClass = isTall ? 'min-h-[420px] sm:row-span-2' : 'min-h-[290px] sm:min-h-[320px]';

              return (
                <div
                  key={card.id}
                  onClick={() => card.project && setSelectedProject(card.project)}
                  className={`relative ${heightClass} rounded-2xl overflow-hidden bg-[#111111] group cursor-pointer shadow-md p-5 flex flex-col justify-end transition-all duration-300 hover:shadow-2xl`}
                >
                  <img
                    src={card.image}
                    alt={card.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  {/* Card Bottom Bar with Label and ↗ Arrow */}
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

            {/* Right Photo Card - Use first project's cover image or hero image */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="/regalien-studio-material-library.jpg"
                  alt="Regalien Studio at Astra Towers"
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
