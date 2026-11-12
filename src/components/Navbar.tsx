import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTransitionNavigation } from './PageTransition';
import { Menu, X, Instagram, Youtube, Phone } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { company, isAdminOpen, setIsAdminOpen } = useApp();
  const { navigateTo } = useTransitionNavigation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  const handleNavClick = (path: string) => {
    navigateTo(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Smooth scroll listener to hide navbar on scroll down and show at top
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show when near the very top of the page
      if (currentScrollY <= 30) {
        setIsNavVisible(true);
      } else if (currentScrollY > lastScrollY.current + 10 && currentScrollY > 70) {
        // Scrolling down past threshold -> hide navbar smoothly
        setIsNavVisible(false);
        setMobileMenuOpen(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Secret keyboard shortcut to toggle Admin Panel (Ctrl+Shift+A or Cmd+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(!isAdminOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminOpen, setIsAdminOpen]);

  return (
    <>
      {/* Top-Right Reveal / Maximize Button (Appears when navbar is hidden, disappears on click) */}
      <button
        onClick={() => setIsNavVisible(true)}
        className={`fixed top-4 right-4 sm:top-5 sm:right-6 lg:right-8 z-50 pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#111111] text-white hover:bg-[#D9541E] shadow-2xl border border-white/20 backdrop-blur-md cursor-pointer group select-none ${
          !isNavVisible
            ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
            : '-translate-y-12 opacity-0 scale-90 pointer-events-none'
        }`}
        aria-label="Show Navigation Bar"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#D9541E] group-hover:bg-white animate-pulse" />
        <Menu className="w-4 h-4" />
        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider font-sans">
          Menu
        </span>
      </button>

      {/* Floating Header Container with Smooth Slide-Up Transition */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isNavVisible
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0'
        }`}
      >
        <div className="w-full flex items-start justify-between">
          {/* Top-Left Notch Cutout Tab with Inverted Concave Corner Fillets */}
          <div className="relative pointer-events-auto bg-[#F3EEE3] pt-3.5 pb-4 pl-5 sm:pl-8 pr-7 sm:pr-9 rounded-br-[28px] shadow-sm select-none">
            {/* Brand Logo & Wordmark with Secret Admin Trigger */}
            <div className="flex items-center gap-3 text-left">
              {/* Crown Emblem with Admin Portal Trigger */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavClick('/admin');
                }}
                className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#111111] flex items-center justify-center shrink-0 shadow-md hover:bg-[#D9541E] p-1.5 transition-all duration-200 cursor-pointer select-none group border border-[#D9541E]/30"
                title="Regalien Portal (Admin Access)"
                aria-label="Admin Portal Access"
              >
                <img
                  src="/brand/regalien-emblem.png"
                  alt="Regalien Crown Emblem"
                  className="w-full h-full object-contain filter drop-shadow group-hover:scale-110 transition-transform pointer-events-none"
                />
              </button>

              {/* Brand Wordmark & Tagline (Navigates to Home) */}
              <button
                type="button"
                onClick={() => handleNavClick('/')}
                className="flex flex-col text-left group cursor-pointer focus-visible:outline-none"
                aria-label="Regalien Interior - Home"
              >
                <div className="flex items-baseline gap-2 leading-none">
                  <span className="font-serif text-2xl sm:text-[27px] font-bold tracking-tight text-[#111111] group-hover:text-[#D9541E] transition-colors leading-none">
                    REGALIEN
                  </span>
                  <span className="hidden sm:inline-block text-[10px] tracking-[0.2em] uppercase font-mono font-semibold text-[#D9541E]">
                    INTERIOR
                  </span>
                </div>
                <span className="text-[9px] uppercase font-mono tracking-widest text-[#111111]/50 mt-1">
                  Infrastructure Pvt Ltd
                </span>
              </button>
            </div>

            {/* Inverted Concave Curve Fillet 1: Upper Right */}
            <div className="absolute top-0 -right-[24px] w-[24px] h-[24px] pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                <path d="M 0,0 L 24,0 A 24,24 0 0,0 0,24 Z" fill="#F3EEE3" />
              </svg>
            </div>

            {/* Inverted Concave Curve Fillet 2: Lower Left */}
            <div className="absolute -bottom-[24px] left-0 w-[24px] h-[24px] pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                <path d="M 0,0 L 0,24 A 24,24 0 0,0 24,0 Z" fill="#F3EEE3" />
              </svg>
            </div>
          </div>

          {/* Top-Right: Floating Capsule Nav Pill matching reference screenshot */}
          <div className="pointer-events-auto pt-3 sm:pt-4 pr-3 sm:pr-6 lg:pr-8">
            {/* Desktop Capsule Pill with Home, About, Services, Projects, Contact & Social Icons */}
            <nav className="hidden md:flex items-center bg-[#F4EBD9]/90 hover:bg-[#F2E7D2] backdrop-blur-md border border-[#111111]/10 rounded-full px-7 sm:px-8 py-3 shadow-sm gap-5 lg:gap-7 text-[13px] sm:text-[14px] font-medium text-[#111111] transition-all">
              <button
                onClick={() => handleNavClick('/')}
                className={`transition-colors whitespace-nowrap cursor-pointer ${
                  isActive('/') ? 'text-[#D9541E] font-semibold' : 'hover:text-[#D9541E]'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('/location')}
                className={`transition-colors whitespace-nowrap cursor-pointer ${
                  isActive('/location') ? 'text-[#D9541E] font-semibold' : 'hover:text-[#D9541E]'
                }`}
              >
                About
              </button>
              <button
                onClick={() => handleNavClick('/services')}
                className={`transition-colors whitespace-nowrap cursor-pointer ${
                  isActive('/services') ? 'text-[#D9541E] font-semibold' : 'hover:text-[#D9541E]'
                }`}
              >
                Services
              </button>
              <button
                onClick={() => handleNavClick('/portfolio')}
                className={`transition-colors whitespace-nowrap cursor-pointer ${
                  isActive('/portfolio') ? 'text-[#D9541E] font-semibold' : 'hover:text-[#D9541E]'
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => handleNavClick('/inquiry')}
                className={`transition-colors whitespace-nowrap cursor-pointer ${
                  isActive('/inquiry') ? 'text-[#D9541E] font-semibold' : 'hover:text-[#D9541E]'
                }`}
              >
                Contact
              </button>

              {/* Exact Social Media Icons (Instagram, Facebook & YouTube) */}
              <div className="flex items-center gap-2.5 text-[#111111]">
                <a
                  href={company.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:text-[#D9541E] transition-colors cursor-pointer"
                  title="Instagram"
                  aria-label="Instagram"
                >
                  <Instagram className="w-[18px] h-[18px]" strokeWidth={1.8} />
                </a>
                <a
                  href={company.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-5 h-5 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-[11px] leading-none hover:bg-[#D9541E] transition-colors cursor-pointer shadow-xs"
                  title="Facebook"
                  aria-label="Facebook"
                >
                  f
                </a>
                <a
                  href={company.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:text-[#D9541E] transition-colors cursor-pointer"
                  title="YouTube"
                  aria-label="YouTube Channel"
                >
                  <Youtube className="w-[18px] h-[18px]" strokeWidth={1.8} />
                </a>
              </div>
            </nav>

            {/* Mobile / Tablet Compact Pill */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="flex items-center bg-[#F4EBD9]/90 backdrop-blur-md border border-[#111111]/10 rounded-full px-3 py-1.5 shadow-sm gap-2 text-[#111111]">
                <a
                  href={company.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:text-[#D9541E] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" strokeWidth={1.8} />
                </a>
                <a
                  href={company.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-4.5 h-4.5 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-[10px] leading-none hover:bg-[#D9541E] transition-colors"
                  aria-label="Facebook"
                >
                  f
                </a>
                <a
                  href={company.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:text-[#D9541E] transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" strokeWidth={1.8} />
                </a>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1 pl-1 text-[#111111] hover:text-[#D9541E] focus-visible:outline-none"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Drawer Menu */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto md:hidden bg-[#F3EEE3] border-b border-[#111111]/10 px-6 py-6 space-y-4 shadow-xl">
            <nav className="flex flex-col gap-3 text-base font-medium text-[#111111]">
              <button
                onClick={() => handleNavClick('/')}
                className={`text-left py-2 transition-colors border-b border-[#111111]/5 ${
                  isActive('/') ? 'text-[#D9541E] font-semibold' : 'hover:text-[#D9541E]'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('/location')}
                className={`text-left py-2 transition-colors border-b border-[#111111]/5 ${
                  isActive('/location') ? 'text-[#D9541E] font-semibold' : 'hover:text-[#D9541E]'
                }`}
              >
                About
              </button>
              <button
                onClick={() => handleNavClick('/services')}
                className={`text-left py-2 transition-colors border-b border-[#111111]/5 ${
                  isActive('/services') ? 'text-[#D9541E] font-semibold' : 'hover:text-[#D9541E]'
                }`}
              >
                Services
              </button>
              <button
                onClick={() => handleNavClick('/portfolio')}
                className={`text-left py-2 transition-colors border-b border-[#111111]/5 ${
                  isActive('/portfolio') ? 'text-[#D9541E] font-semibold' : 'hover:text-[#D9541E]'
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => handleNavClick('/inquiry')}
                className={`text-left py-2 transition-colors ${
                  isActive('/inquiry') ? 'text-[#D9541E] font-semibold' : 'hover:text-[#D9541E]'
                }`}
              >
                Contact
              </button>
            </nav>

            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={() => handleNavClick('/consultation')}
                className="w-full py-3 text-center text-xs uppercase tracking-wider font-semibold text-white bg-[#D9541E] hover:bg-[#b84214] transition-colors"
              >
                Book Consultation
              </button>
              <div className="flex items-center justify-between pt-2">
                <a
                  href={`tel:${company.phone}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#111111]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D9541E]" />
                  <span>{company.phone}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
