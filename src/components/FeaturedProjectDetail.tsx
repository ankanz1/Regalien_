import React, { useEffect, useState, useCallback } from 'react';
import { Project } from '../types';
import { BeforeAfterViewer } from './BeforeAfterViewer';
import { useTransitionNavigation } from './PageTransition';
import { 
  X, ChevronLeft, ChevronRight, Maximize2, Minimize2, 
  Layers, MapPin, Calendar, Clock, CheckCircle2, 
  Share2, Check, Sparkles, Building2, SlidersHorizontal
} from 'lucide-react';

interface FeaturedProjectDetailProps {
  project: Project;
  onClose: () => void;
}

export const FeaturedProjectDetail: React.FC<FeaturedProjectDetailProps> = ({ project, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const { navigateTo } = useTransitionNavigation();

  const galleryImages = project.gallery && project.gallery.length > 0
    ? project.gallery
    : [project.coverImage];

  const handleNextImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const handlePrevImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'ArrowLeft') handlePrevImage();
    };

    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      lenis?.start();
      document.body.style.overflow = 'unset';
    };
  }, [onClose, handleNextImage, handlePrevImage]);

  const handleConsultClick = () => {
    onClose();
    navigateTo('/consultation');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-label={`Featured Project Detail: ${project.title}`}
    >
      <div className="relative w-full max-w-6xl bg-[#F3EEE3] text-[#111111] shadow-2xl border-2 border-[#111111] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-[#111111] text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#D9541E] font-mono shrink-0">
              Project Specification
            </span>
            <span className="text-white/30 hidden sm:inline">/</span>
            <span className="text-xs uppercase tracking-wider text-white/80 truncate hidden sm:inline">
              {project.category}
            </span>
            <span className="text-white/30">/</span>
            <span className="text-xs font-serif text-white font-semibold truncate">
              {project.title}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleShare}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors text-xs flex items-center gap-1.5"
              title="Copy portfolio link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline text-[11px]">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
              aria-label="Close project specifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="max-h-[85vh] overflow-y-auto">
          {/* Top Section: Lightbox Image Gallery */}
          <div className="relative bg-[#0d0d0d] select-none">
            {showBeforeAfter && project.beforeAfter ? (
              <BeforeAfterViewer
                beforeImage={project.beforeAfter.beforeImage}
                afterImage={project.beforeAfter.afterImage}
                beforeLabel={project.beforeAfter.beforeLabel}
                afterLabel={project.beforeAfter.afterLabel}
              />
            ) : (
              <div
                className={`relative w-full flex items-center justify-center overflow-hidden transition-all duration-300 ${
                  isFullscreen ? 'aspect-[16/9] sm:aspect-[21/9] max-h-[75vh]' : 'aspect-[16/10] sm:aspect-[16/9]'
                }`}
              >
                <img
                  src={galleryImages[activeImageIndex]}
                  alt={`${project.title} - View ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover object-center transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Left/Right Navigation Arrows */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-[#D9541E] flex items-center justify-center transition-colors shadow-lg cursor-pointer"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-[#D9541E] flex items-center justify-center transition-colors shadow-lg cursor-pointer"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Image Counter & Fullscreen Controls Overlay */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="bg-black/75 backdrop-blur-sm text-white text-[11px] font-mono px-3 py-1">
                    {String(activeImageIndex + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}
                  </span>
                </div>

                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-1.5 bg-black/75 hover:bg-[#D9541E] text-white transition-colors"
                    title={isFullscreen ? 'Exit full width' : 'Full width view'}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Bar over media: Before/After switch & Thumbnail strip */}
            <div className="bg-[#111111] p-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
              {/* Thumbnails */}
              {!showBeforeAfter && galleryImages.length > 1 ? (
                <div className="flex gap-2 overflow-x-auto max-w-full no-scrollbar py-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-11 sm:w-20 sm:h-13 shrink-0 overflow-hidden border-2 transition-all cursor-pointer ${
                        idx === activeImageIndex
                          ? 'border-[#D9541E] opacity-100 scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : <div />}

              {/* Mode Toggle Button */}
              {project.beforeAfter && (
                <button
                  onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm shrink-0 cursor-pointer ${
                    showBeforeAfter
                      ? 'bg-[#D9541E] text-white'
                      : 'bg-white text-[#111111] hover:bg-[#F3EEE3]'
                  }`}
                >
                  {showBeforeAfter ? 'Back to Gallery' : 'Compare Before & After'}
                </button>
              )}
            </div>
          </div>

          {/* Lower Section: Material Specifications & Architectural Dossier */}
          <div className="p-6 sm:p-10 space-y-10">
            {/* Title & Key Action Row */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-[#111111]/15 pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#D9541E] font-semibold tracking-widest uppercase">
                  <span>{project.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>Handover {project.year}</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#111111]">
                  {project.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#111111]/70 max-w-2xl font-normal leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <button
                  onClick={handleConsultClick}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-[#D9541E] hover:bg-[#b84214] transition-colors shadow-md cursor-pointer whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Consult For Similar Space</span>
                </button>
                <span className="text-[11px] text-center text-[#111111]/60">
                  Instant Google Calendar slot booking
                </span>
              </div>
            </div>

            {/* Technical Specifications Matrix */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111111]/60 mb-4">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#D9541E]" />
                <span>Architectural Parameters & Metrics</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-white border border-[#111111]/15 shadow-sm">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#111111]/50 block">Super Built Area</span>
                  <span className="font-serif text-2xl font-bold text-[#111111] tabular-nums mt-0.5 block">
                    {project.areaSqFt.toLocaleString()} SQ.FT
                  </span>
                  <span className="text-[11px] text-[#111111]/60">Full floorplate scope</span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#111111]/50 block">Turnkey Delivery</span>
                  <span className="font-serif text-2xl font-bold text-[#111111] mt-0.5 block">
                    {project.completionWeeks} Weeks
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium">On-time milestone delivery</span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#111111]/50 block">Hardware Standard</span>
                  <span className="font-serif text-xl font-bold text-[#111111] mt-0.5 block">
                    Blum & Hafele
                  </span>
                  <span className="text-[11px] text-[#111111]/60">Austrian / German fittings</span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#111111]/50 block">Lighting Protocol</span>
                  <span className="font-serif text-xl font-bold text-[#111111] mt-0.5 block">
                    2700K 95+ CRI
                  </span>
                  <span className="text-[11px] text-[#111111]/60">Circadian cove & magnetic tracks</span>
                </div>
              </div>
            </div>

            {/* Material Specifications & Finishes Sheet */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Materials Breakdown */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111111]/60">
                  <Layers className="w-3.5 h-3.5 text-[#D9541E]" />
                  <span>Curated Material Palette & Joinery</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.materials.map((mat, i) => (
                    <div
                      key={i}
                      className="p-4 bg-white border border-[#111111]/10 flex items-start gap-3 hover:border-[#D9541E]/40 transition-colors"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-[#D9541E] mt-1 shrink-0" />
                      <div>
                        <span className="font-semibold text-xs text-[#111111] block">
                          {mat}
                        </span>
                        <span className="text-[11px] text-[#111111]/60">
                          Hand-selected & precision cut in-house
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architectural Features */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#111111]/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D9541E]" />
                  <span>Execution Highlights</span>
                </div>

                <div className="p-5 bg-white border border-[#111111]/10 space-y-3">
                  <ul className="space-y-2.5 text-xs text-[#111111]/85">
                    {project.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-[#D9541E] font-bold text-sm leading-none mt-0.5">―</span>
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-3 border-t border-[#111111]/10 text-[11px] text-[#111111]/60">
                    Client: <strong className="text-[#111111]">{project.client}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
