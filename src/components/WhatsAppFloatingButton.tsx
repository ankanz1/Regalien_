import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Send, ArrowUpRight, MessageCircle, Sparkles, Phone, ChevronUp } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const { company } = useApp();
  const [showOptions, setShowOptions] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

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
      title: 'Astra Towers Studio Visit',
      desc: 'Reserve material library walkthrough',
      message: `*Studio Visit Booking: Astra Towers*\nHello Regalien Team,\n\nI would like to schedule a private walkthrough at your Astra Towers Material Studio (ASR 026 Ground Floor, Newtown Kolkata) to review Italian marble, veneer profiles, and 3D VR renders.\n\nKindly share available consultation slots this week. Thank you!`,
    },
    {
      title: 'Turnkey Cost Estimation',
      desc: 'Estimate budget & timeline per sq.ft',
      message: `*Turnkey Cost Inquiry: Regalien Interior*\nHello Regalien Team,\n\nI have a residential / commercial property in Kolkata and would like an estimated turnkey execution cost per sq.ft and timeline breakdown.\n\n• Location: Kolkata / Newtown\n• Carpet Area: Approx. _____ sq.ft\n• Handover Stage: Bare shell / Under construction\n\nKindly connect with me to discuss estimates. Thank you!`,
    },
    {
      title: 'Luxury Villa / Penthouse Design',
      desc: 'Bespoke architectural consultation',
      message: `*Bespoke Project Inquiry: Regalien Interior*\nHello Regalien Team,\n\nI am planning a luxury villa / penthouse interior project and would like to review your signature portfolio and arrange an initial architectural discussion.\n\nKindly let me know how we can proceed. Thank you!`,
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

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Expandable Quick-Inquiry Drawer */}
      {showOptions && (
        <div className="mb-3 w-[calc(100vw-2.5rem)] sm:w-96 bg-white text-[#111111] shadow-2xl rounded-2xl border border-[#111111]/20 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
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

      {/* Floating Action Button Bar */}
      <div className="flex items-center gap-2">
        {/* Toggle presets drawer button */}
        <button
          onClick={() => setShowOptions(!showOptions)}
          className={`h-9 px-3 rounded-full bg-white/95 text-[#111111] hover:text-[#D9541E] border border-[#111111]/15 shadow-lg backdrop-blur-md text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            showOptions ? 'bg-[#F3EEE3] text-[#D9541E]' : ''
          }`}
          title="Quick inquiry templates"
          aria-label="Toggle WhatsApp templates"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D9541E]" />
          <span className="hidden sm:inline">Inquiry Options</span>
          <ChevronUp
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              showOptions ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Primary Direct WhatsApp Launch Button */}
        <a
          href={primaryWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-white focus:outline-none"
          title="Chat directly on WhatsApp: +91 8981441040"
          aria-label="Chat on WhatsApp with Regalien Interior at 8981441040"
        >
          {/* Subtle Radar Ripple Glow */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none" />

          {/* Official WhatsApp Icon */}
          <div className="relative z-10">
            <svg className="w-7 h-7 fill-current drop-shadow-sm" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </div>

          {/* Active Status Dot */}
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#25D366]" />
          </span>
        </a>
      </div>
    </div>
  );
};

