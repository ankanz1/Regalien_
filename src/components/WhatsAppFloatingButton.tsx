import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, ArrowUpRight, MessageCircle, Phone } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const { company, isOverlayActive } = useApp();
  const [showOptions, setShowOptions] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const optionsRef = useRef<HTMLDivElement>(null);

  // Primary verified phone number requested by user
  const TARGET_WHATSAPP_NUMBER = '918981441040';

  // Master Inquiry Template
  const DEFAULT_TEMPLATE = `*Inquiry: Regalien Interior Architecture*
Hello Regalien Team,

I would like to inquire about bespoke interior architecture & turnkey execution for my property in Kolkata/Newtown.

• Property Type: Residential / Luxury Villa / Penthouse / Commercial
• Scope: Complete Turnkey Interior / Modular Living / Renovation
• Preferred Consultation: Astra Towers Studio Visit / Site Walkthrough

Kindly connect with me to discuss design possibilities and project estimates. Thank you!`;

  // Curated quick prompt templates
  const quickTemplates = [
    {
      title: 'Studio Visit Booking',
      desc: 'Schedule material library walkthrough at Astra Towers',
      message: `*Studio Visit Booking: Astra Towers*
Hello Regalien Team,

I would like to schedule a private walkthrough at your Astra Towers Material Studio (ASR 026 Ground Floor, Newtown Kolkata) to review Italian marble, veneer profiles, and 3D VR renders.

Kindly share available consultation slots this week. Thank you!`,
    },
    {
      title: 'Turnkey Cost Estimation',
      desc: 'Estimate budget & timeline per sq.ft',
      message: `*Turnkey Cost Inquiry: Regalien Interior*
Hello Regalien Team,

I have a residential / commercial property in Kolkata and would like an estimated turnkey execution cost per sq.ft and timeline breakdown.

• Location: Kolkata / Newtown
• Carpet Area: Approx. _____ sq.ft
• Handover Stage: Bare shell / Under construction

Kindly connect with me to discuss estimates. Thank you!`,
    },
    {
      title: 'Luxury Villa / Penthouse Design',
      desc: 'Bespoke architectural consultation',
      message: `*Bespoke Project Inquiry: Regalien Interior*
Hello Regalien Team,

I am planning a luxury villa / penthouse interior project and would like to review your signature portfolio and arrange an initial architectural discussion.

Kindly let me know how we can proceed. Thank you!`,
    },
  ];

  const getWhatsAppUrl = (text: string) => {
    return `https://wa.me/${TARGET_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const handleLaunchWhatsApp = (text: string) => {
    const url = getWhatsAppUrl(text);
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowOptions(false);
    setCustomMsg('');
  };

  const primaryWhatsAppUrl = getWhatsAppUrl(DEFAULT_TEMPLATE);

  // Close options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showOptions]);

  // Don't render when overlay is active (loading, video gallery, modals, etc.)
  if (isOverlayActive) return null;

  return (
    <div className="fixed bottom-5 sm:bottom-6 right-5 sm:right-6 z-50 flex flex-col items-end">
      {/* Expandable Inquiry Options Popup */}
      {showOptions && (
        <div
          ref={optionsRef}
          className="mb-3 w-[calc(100vw-2.5rem)] sm:w-96 bg-white text-[#111111] shadow-2xl rounded-2xl border border-[#111111]/20 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-[#111111] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm shrink-0">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-white leading-tight">
                  Regalien WhatsApp Desk
                </h4>
                <p className="text-[10px] text-white/70 font-mono">
                  +91 89814 41040 · Senior Architects
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowOptions(false)}
              className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close options"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-[#F3EEE3]/40">
            <div className="flex items-center justify-between text-xs text-[#111111]/80">
              <span className="font-medium">Direct Architectural Connect</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#25D366]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                Online Now
              </span>
            </div>

            {/* Default Primary Launch Button */}
            <a
              href={primaryWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowOptions(false)}
              className="w-full py-2.5 px-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-semibold flex items-center justify-between shadow-md transition-all hover:scale-[1.01] cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Send Comprehensive Inquiry</span>
              </span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Quick Presets */}
            <div className="pt-1 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#111111]/50 block">
                Or select specific topic:
              </span>
              {quickTemplates.map((template, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLaunchWhatsApp(template.message)}
                  className="w-full text-left p-2.5 bg-white border border-[#111111]/10 hover:border-[#D9541E] hover:bg-white rounded-lg transition-all flex items-center justify-between group shadow-2xs cursor-pointer"
                >
                  <div className="pr-2">
                    <p className="text-xs font-semibold text-[#111111] group-hover:text-[#D9541E] transition-colors leading-tight">
                      {template.title}
                    </p>
                    <p className="text-[10px] text-[#111111]/60 leading-normal">
                      {template.desc}
                    </p>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#D9541E] opacity-40 group-hover:opacity-100 shrink-0 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>

            {/* Custom Question Input */}
            <div className="pt-1">
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder="Type a custom inquiry..."
                  className="flex-1 px-3 py-2 bg-white rounded-lg border border-[#111111]/20 text-xs focus:outline-none focus:border-[#D9541E]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customMsg.trim()) {
                      handleLaunchWhatsApp(
                        `*Inquiry for Regalien Interior*\n${customMsg.trim()}`
                      );
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (customMsg.trim()) {
                      handleLaunchWhatsApp(
                        `*Inquiry for Regalien Interior*\n${customMsg.trim()}`
                      );
                    }
                  }}
                  disabled={!customMsg.trim()}
                  className="p-2 bg-[#111111] text-white hover:bg-[#D9541E] rounded-lg disabled:opacity-40 transition-colors cursor-pointer shrink-0"
                  aria-label="Send custom message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer banner */}
          <div className="px-4 py-2.5 bg-[#111111]/5 border-t border-[#111111]/10 flex items-center justify-between text-[10px] text-[#111111]/70">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#D9541E]" />
              <span>Direct Helpline: +91 8981441040</span>
            </span>
            <span className="text-[9px] uppercase font-mono text-[#111111]/50">
              Astra Towers Studio
            </span>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-white focus:outline-none"
        title="Open inquiry options"
        aria-label="Open WhatsApp inquiry options"
        aria-expanded={showOptions}
      >
        {/* Subtle Radar Ripple Glow */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none" />

        {/* WhatsApp Icon */}
        <img
          src="/whatsapp-floating.png"
          alt="WhatsApp"
          className="relative z-10 w-7 h-7 object-contain drop-shadow-sm"
        />

        {/* Active Status Dot */}
        <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-[#25D366]" />
        </span>
      </button>
    </div>
  );
};