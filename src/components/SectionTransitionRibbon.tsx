import React from 'react';

interface RibbonProps {
  phrase?: string;
  theme?: 'dark' | 'cream';
}

export const SectionTransitionRibbon: React.FC<RibbonProps> = ({
  phrase = 'ARCHITECTURAL RESIDENCES · ASTRA TOWERS NEWTOWN · BESPOKE ITALIAN JOINERY · TURNKEY CRAFTSMANSHIP ·',
  theme = 'dark',
}) => {
  return (
    <div
      className={`py-3 overflow-hidden select-none border-y transition-colors ${
        theme === 'dark'
          ? 'bg-[#111111] text-white/80 border-[#D9541E]/30'
          : 'bg-[#F3EEE3] text-[#111111]/75 border-[#111111]/15'
      }`}
      aria-hidden="true"
    >
      <div className="flex whitespace-nowrap will-change-transform animate-[marquee_25s_linear_infinite]">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="font-mono text-[11px] uppercase tracking-[0.2em] mx-4 flex items-center gap-4">
            <span>{phrase}</span>
            <span className="w-1.5 h-1.5 bg-[#D9541E] rounded-full inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
};
