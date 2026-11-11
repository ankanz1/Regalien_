import React from 'react';
import { useApp } from '../context/AppContext';
import { Mail, CheckCircle, X, ExternalLink, Calendar, Copy, Check } from 'lucide-react';

export const EmailNotificationModal: React.FC = () => {
  const { activeEmailNotice, setActiveEmailNotice, company } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!activeEmailNotice) return null;

  const handleCopy = () => {
    const text = `Subject: ${activeEmailNotice.subject}\nTo: ${activeEmailNotice.to}\n\n${activeEmailNotice.summary}\n\n` +
      Object.entries(activeEmailNotice.details).map(([k, v]) => `${k}: ${v}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 overscroll-contain"
    >
      <div 
        data-lenis-prevent="true"
        className="relative w-full max-w-xl bg-white text-[#111111] shadow-2xl border-2 border-[#111111] overflow-hidden overscroll-contain"
      >
        {/* Email Client Header bar */}
        <div className="px-5 py-3.5 bg-[#111111] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#D9541E]" />
            <span className="text-xs uppercase font-mono tracking-wider text-white">
              Automated Email Notification Engine
            </span>
          </div>

          <button
            onClick={() => setActiveEmailNotice(null)}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Envelope Metadata */}
        <div className="p-5 bg-[#F3EEE3]/60 border-b border-[#111111]/10 text-xs space-y-1.5 font-mono">
          <div className="flex">
            <span className="w-16 text-[#111111]/50 uppercase tracking-wider">From:</span>
            <span className="text-[#111111] font-semibold">Regalien Infrastructure &lt;appointments@regalieninteriors.com&gt;</span>
          </div>
          <div className="flex">
            <span className="w-16 text-[#111111]/50 uppercase tracking-wider">To:</span>
            <span className="text-[#111111] font-semibold">{activeEmailNotice.recipientName} &lt;{activeEmailNotice.to}&gt;</span>
          </div>
          <div className="flex">
            <span className="w-16 text-[#111111]/50 uppercase tracking-wider">Cc:</span>
            <span className="text-[#111111]/70">studio-kolkata@regalieninteriors.com, astra-towers@regalieninteriors.com</span>
          </div>
          <div className="flex">
            <span className="w-16 text-[#111111]/50 uppercase tracking-wider">Subject:</span>
            <span className="text-[#D9541E] font-bold">{activeEmailNotice.subject}</span>
          </div>
        </div>

        {/* Email Message Content */}
        <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
          <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Dispatched to SMTP Gateway (Status: Delivered 200 OK)</span>
          </div>

          <div className="p-4 bg-white border border-[#111111]/15 space-y-3 font-sans text-xs sm:text-sm">
            <p className="font-serif text-lg font-bold text-[#111111]">
              Dear {activeEmailNotice.recipientName},
            </p>

            <p className="text-[#111111]/80 leading-relaxed">
              {activeEmailNotice.summary}
            </p>

            <div className="p-3 bg-[#F3EEE3]/40 border border-[#111111]/10 space-y-1.5 text-xs">
              <span className="font-semibold text-[#111111] block mb-1">Particulars Summary:</span>
              {Object.entries(activeEmailNotice.details).map(([key, val]) => (
                <div key={key} className="flex justify-between border-b border-[#111111]/5 pb-1">
                  <span className="text-[#111111]/60">{key}:</span>
                  <span className="font-semibold text-[#111111] text-right">{val}</span>
                </div>
              ))}
            </div>

            {activeEmailNotice.calendarUrl && (
              <div className="pt-2">
                <a
                  href={activeEmailNotice.calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111111] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#D9541E] transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Add Directly to Google Calendar</span>
                </a>
              </div>
            )}

            <div className="pt-4 border-t border-[#111111]/10 text-[11px] text-[#111111]/60">
              <p className="font-semibold text-[#111111]">Regalien Infrastructure Pvt Ltd</p>
              <p>{company.address}</p>
              <p>Helpline: {company.phone}</p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-[#F3EEE3]/80 border-t border-[#111111]/10 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-xs text-[#111111]/70 hover:text-[#111111] font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Notification' : 'Copy Notice Text'}</span>
          </button>

          <button
            onClick={() => setActiveEmailNotice(null)}
            className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#D9541E] transition-colors"
          >
            Close Notification
          </button>
        </div>
      </div>
    </div>
  );
};
