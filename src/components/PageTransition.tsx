import React, { useEffect, useRef, createContext, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import Lenis from 'lenis';

interface TransitionContextType {
  navigateTo: (target: string) => void;
  navigateToSection: (sectionId: string) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType>({
  navigateTo: () => {},
  navigateToSection: () => {},
  isTransitioning: false,
});

export const useTransitionNavigation = () => useContext(TransitionContext);

export const PageTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelTopRef = useRef<HTMLDivElement>(null);
  const panelBottomRef = useRef<HTMLDivElement>(null);
  const brandCenterRef = useRef<HTMLDivElement>(null);
  const orangeLineRef = useRef<HTMLDivElement>(null);

  // Initial page load reveal animation - ONLY ONCE ON LOAD!
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (overlayRef.current) overlayRef.current.style.display = 'none';
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power4.inOut' },
    });

    tl.to(brandCenterRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.5,
      delay: 0.35,
      ease: 'power2.in',
    })
      .to(
        orangeLineRef.current,
        {
          scaleX: 0,
          duration: 0.35,
          ease: 'power3.in',
        },
        '-=0.15'
      )
      .to(
        panelTopRef.current,
        {
          yPercent: -100,
          duration: 0.8,
        },
        '-=0.1'
      )
      .to(
        panelBottomRef.current,
        {
          yPercent: 100,
          duration: 0.8,
        },
        '-=0.8'
      )
      .set(overlayRef.current, { display: 'none' });

    return () => {
      tl.kill();
    };
  }, []);

  // Smooth, instant navigation WITHOUT repeating the curtain wipe!
  const navigateTo = (target: string) => {
    if (target.startsWith('/')) {
      if (location.pathname === target) {
        const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
        if (lenis) lenis.scrollTo(0, { duration: 0.8 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      navigate(target);
      // Smooth scroll to top on page switch
      setTimeout(() => {
        const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
        if (lenis) lenis.scrollTo(0, { immediate: true });
        else window.scrollTo(0, 0);
      }, 10);
      return;
    }

    navigateToSection(target);
  };

  const navigateToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
          if (lenis) lenis.scrollTo(el, { offset: -70 });
          else el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const targetElement = document.getElementById(sectionId);
    if (!targetElement) return;

    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) {
      lenis.scrollTo(targetElement, { offset: -70 });
    } else {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <TransitionContext.Provider value={{ navigateTo, navigateToSection, isTransitioning: false }}>
      {/* Initial Load-Only Architectural Shutter Curtain */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
        style={{ display: 'block' }}
        aria-hidden="true"
      >
        {/* Top Shutter Panel */}
        <div
          ref={panelTopRef}
          className="absolute top-0 inset-x-0 h-1/2 bg-[#111111] will-change-transform border-b border-[#D9541E]/40"
        />

        {/* Bottom Shutter Panel */}
        <div
          ref={panelBottomRef}
          className="absolute bottom-0 inset-x-0 h-1/2 bg-[#111111] will-change-transform border-t border-[#D9541E]/40"
        />

        {/* Center Orange Accent Line */}
        <div
          ref={orangeLineRef}
          className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#D9541E] -translate-y-1/2 origin-center will-change-transform z-10"
        />

        {/* Center Monogram & Brand Lockup */}
        <div
          ref={brandCenterRef}
          className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none"
        >
          <div className="bg-[#111111] px-8 py-6 border border-[#D9541E]/50 shadow-2xl text-center flex flex-col items-center">
            <img
              src="/brand/regalien-emblem.png"
              alt="Regalien Crown Emblem"
              className="w-12 h-10 object-contain mb-3 drop-shadow-[0_2px_8px_rgba(217,84,30,0.4)]"
            />
            <span className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white block">
              REGALIEN
            </span>
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-[#D9541E] mt-1.5 block">
              Interior Architecture · Astra Towers Newtown
            </span>
          </div>
        </div>
      </div>

      {children}
    </TransitionContext.Provider>
  );
};
