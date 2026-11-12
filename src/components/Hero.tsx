import React, { useState } from 'react';
import { useTransitionNavigation } from './PageTransition';
import { useApp } from '../context/AppContext';
import { ArrowRight, Play } from 'lucide-react';
import { VideoGalleryModal } from './VideoGalleryModal';

export const Hero: React.FC = () => {
  const { navigateTo } = useTransitionNavigation();
  const { projects } = useApp();
  const [showVideoGallery, setShowVideoGallery] = useState(false);
  const previewProject = projects[6] || projects[0];

  return (
    <>
      <div
        onClick={() => {
          if (previewProject?.videos?.length) {
            setShowVideoGallery(true);
          }
        }}
        className="cursor-pointer"
        role="presentation"
        aria-label="Open video gallery"
      >
        <section
          id="hero"
          className="relative w-full h-[100svh] p-2.5 sm:p-4 lg:p-5 bg-[#F3EEE3] flex flex-col justify-center overflow-hidden select-none"
        >
          <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-[#111111] flex flex-col justify-between p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24 pb-4 sm:pb-6">
            <div className="absolute inset-0 z-0 pointer-events-none">
              <img
                src="/hero-living-room-uploaded.png"
                alt="Luxury interior living room"
                className="w-full h-full object-cover object-center scale-105 hover:scale-100 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />
            </div>

            <div className="relative z-10 h-8 sm:h-12 shrink-0" />

            <div className="relative z-10 my-auto text-center py-1 sm:py-2">
              <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-8xl font-bold tracking-tight text-white drop-shadow-sm leading-none">
                Timeless Spaces. <br className="sm:hidden" /> Meaningful Living.
              </h1>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-end shrink-0">
              <div className="md:col-span-5 lg:col-span-4 bg-black/65 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/15 text-white space-y-2 shadow-xl">
                <p className="text-[11px] sm:text-xs text-white/80 leading-relaxed font-normal line-clamp-2 sm:line-clamp-none">
                  Crafting spaces that harmonize modern aesthetics with timeless elegance, our contemporary interior designs redefine luxury turnkey living.
                </p>
                <div className="flex items-center gap-3 pt-0.5">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      navigateTo('/portfolio');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#111111] hover:bg-[#D9541E] hover:text-white text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm group"
                  >
                    <span>View More</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      navigateTo('/consultation');
                    }}
                    className="inline-flex items-center gap-1 text-[11px] text-white/80 hover:text-white transition-colors underline-offset-4 hover:underline cursor-pointer"
                  >
                    <span>Consultation</span>
                  </button>
                </div>
              </div>

              {previewProject && (
                <div className="hidden sm:flex md:col-span-7 lg:col-span-8 justify-end">
                  <div
                    onClick={() => {
                      if (previewProject?.videos?.length) {
                        setShowVideoGallery(true);
                      }
                    }}
                    className={`group cursor-pointer bg-black/70 backdrop-blur-md p-2 rounded-xl sm:rounded-2xl border border-white/20 shadow-2xl flex items-center gap-3 transition-transform hover:-translate-y-0.5 max-w-xs ${
                      !previewProject?.videos?.length ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <div className="relative w-16 sm:w-20 h-11 sm:h-13 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={previewProject.coverImage}
                        alt={previewProject.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-white/90 text-[#111111] flex items-center justify-center shadow-md">
                          <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="pr-2 text-left">
                      <span className="text-[9px] uppercase font-mono text-[#D9541E] block leading-none mb-0.5">
                        Video Gallery
                      </span>
                      <p className="text-[11px] sm:text-xs font-bold text-white leading-tight">
                        {previewProject.title}
                      </p>
                      <p className="text-[9px] sm:text-[10px] text-white/60">{previewProject.location}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {showVideoGallery && previewProject && previewProject.videos && previewProject.videos.length > 0 && (
        <VideoGalleryModal
          projectTitle={previewProject.title}
          videos={previewProject.videos}
          onClose={() => setShowVideoGallery(false)}
        />
      )}
    </>
  );
};