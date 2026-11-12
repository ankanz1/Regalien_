import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Lenis from 'lenis';

export function useLenisScroll() {
  const location = useLocation();
  const { isAdminOpen } = useApp();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const shouldDisableLenis = isAdminRoute || isAdminOpen;

  useEffect(() => {
    // Completely disable Lenis inside the Admin Portal so native wheel, trackpad, and keyboard scroll work without interference
    if (shouldDisableLenis) {
      const existingLenis = (window as unknown as { __lenis?: Lenis }).__lenis;
      if (existingLenis) {
        existingLenis.destroy();
        delete (window as unknown as { __lenis?: Lenis }).__lenis;
      }
      document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');
      document.body.style.overflow = '';
      return;
    }

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      prevent: (node) => {
        if (!node || !(node instanceof HTMLElement)) return false;
        return Boolean(
          node.hasAttribute('data-lenis-prevent') ||
          node.closest('[data-lenis-prevent]') ||
          node.closest('#admin-portal-root') ||
          node.closest('.admin-scroll-container') ||
          window.location.pathname.startsWith('/admin')
        );
      },
    });

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    // Make lenis globally accessible for smooth anchor scrolling
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');
    };
  }, [shouldDisableLenis]);
}

export function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (!element) return;

  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis) {
    lenis.scrollTo(element, { offset: -70 });
  } else {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
