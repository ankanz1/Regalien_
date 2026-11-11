import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Project, ProjectCategory } from '../types';
import { FeaturedProjectDetail } from './FeaturedProjectDetail';
import { ProjectGallerySkeleton } from './SkeletonLoaders';
import { Layers, ArrowUpRight, Sparkles, Filter } from 'lucide-react';

const CATEGORIES: ProjectCategory[] = [
  'All',
  'Luxury Residential',
  'Penthouse Suites',
  'Commercial & Corporate',
  'Modular Kitchen & Bar',
];

export const PortfolioShowcase: React.FC = () => {
  const { projects, isLoading } = useApp();
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const publicProjects = projects.filter((p) => p.published !== false);
  const filteredProjects = activeCategory === 'All'
    ? publicProjects
    : publicProjects.filter((p) => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-20 bg-[#F3EEE3] border-t border-[#111111]/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#D9541E] mb-2">
              <span>Curated Portfolio</span>
              <span aria-hidden="true">·</span>
              <span>Kolkata & Eastern India</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] leading-tight">
              Selected Architectural Works.
            </h2>
          </div>

          <p className="text-sm text-[#111111]/70 max-w-md font-normal leading-relaxed">
            Every residence is custom-engineered from raw shell to final art styling. Click any residence to inspect the architectural specifications and materials.
          </p>
        </div>

        {/* Category Filter Tabs (Clean segmented buttons, no pill enclosures) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 border-b border-[#111111]/10 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                activeCategory === cat
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-white/60 text-[#111111]/80 border-[#111111]/15 hover:border-[#111111] hover:bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bento Grid Showcase with Skeleton Loading State */}
        {isLoading ? (
          <ProjectGallerySkeleton count={5} />
        ) : (
          <>
            <div className="stagger-cards-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
              {filteredProjects.map((project, idx) => {
                // Asymmetric layout rhythm: alternating large 7/12 & 5/12 columns or 6/12
                const isLarge = idx % 3 === 0;
                const colSpan = isLarge ? 'lg:col-span-7' : 'lg:col-span-5';

                return (
                  <div
                    key={project.id}
                    onClick={() => setActiveModalProject(project)}
                    className={`${colSpan} stagger-card group cursor-pointer bg-white border border-[#111111]/10 transition-all duration-300 hover:shadow-2xl hover:border-[#D9541E]/50 hover:-translate-y-1.5 flex flex-col`}
                  >
                    {/* Visual Container */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#111111]/5">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="parallax-image w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />

                      {/* Top-Right Quick Badge if Before/After */}
                      {project.beforeAfter && (
                        <div className="absolute top-3 right-3 bg-[#111111]/80 backdrop-blur-sm text-white text-[10px] uppercase font-mono tracking-wider px-2.5 py-1">
                          Before & After Included
                        </div>
                      )}

                      {/* Hover Overlay Button */}
                      <div className="absolute inset-0 bg-[#111111]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#111111] text-xs font-bold uppercase tracking-wider shadow-lg">
                          <span>Inspect Project</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#D9541E]" />
                        </span>
                      </div>
                    </div>

                    {/* Card Content & Metadata */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        {/* Unboxed Metadata (Zero-pill discipline) */}
                        <div className="flex items-center gap-2 text-xs text-[#111111]/60 font-medium mb-1.5">
                          <span className="text-[#D9541E] font-semibold">{project.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums font-mono">{project.areaSqFt.toLocaleString()} sq.ft</span>
                          <span aria-hidden="true">·</span>
                          <span>{project.year}</span>
                        </div>

                        <h3 className="font-serif text-2xl font-bold text-[#111111] group-hover:text-[#D9541E] transition-colors leading-snug">
                          {project.title}
                        </h3>

                        <p className="text-xs text-[#111111]/70 line-clamp-2 mt-2 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {/* Materials & Location Hairline Footer */}
                      <div className="pt-3 border-t border-[#111111]/10 flex items-center justify-between text-xs text-[#111111]/60">
                        <span className="truncate max-w-[200px]">{project.location}</span>
                        <span className="font-semibold text-[#111111] group-hover:text-[#D9541E] transition-colors inline-flex items-center gap-1 shrink-0">
                          View Specs <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <div className="p-12 text-center bg-white border border-[#111111]/10">
                <p className="font-serif text-xl text-[#111111]">No projects listed in this category yet.</p>
                <button
                  onClick={() => setActiveCategory('All')}
                  className="mt-4 px-4 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#111111]"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Featured Project Detail Lightbox Overlay */}
      {activeModalProject && (
        <FeaturedProjectDetail
          project={activeModalProject}
          onClose={() => setActiveModalProject(null)}
        />
      )}
    </section>
  );
};
