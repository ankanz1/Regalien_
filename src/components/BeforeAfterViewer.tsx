import React, { useState, useRef, useCallback } from 'react';

interface BeforeAfterViewerProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const BeforeAfterViewer: React.FC<BeforeAfterViewerProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Bare Concrete Shell',
  afterLabel = 'Regalien Turnkey Handover',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden select-none bg-[#111111] cursor-ew-resize border border-[#111111]/20 shadow-lg"
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt="After Renovation"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-4 right-4 bg-[#111111]/80 text-white text-[11px] uppercase tracking-wider px-3 py-1 font-mono">
        {afterLabel}
      </div>

      {/* Before Image (Clipped) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="Before Renovation"
          className="absolute inset-0 w-full h-full object-cover object-center max-w-none"
          style={{ width: containerRef.current?.offsetWidth || '100%' }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-[#111111]/80 text-white text-[11px] uppercase tracking-wider px-3 py-1 font-mono">
          {beforeLabel}
        </div>
      </div>

      {/* Divider Bar */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize z-10"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white text-[#111111] rounded-full flex items-center justify-center shadow-lg border border-[#111111]/20">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" transform="rotate(180 12 12)" />
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none">
        <span className="text-[10px] uppercase tracking-widest text-white/70 bg-black/40 px-3 py-1 rounded">
          Drag slider to inspect transformation
        </span>
      </div>
    </div>
  );
};
