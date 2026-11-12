import React from 'react';

interface ProjectCardSkeletonProps {
  colSpan?: string;
}

export const ProjectCardSkeleton: React.FC<ProjectCardSkeletonProps> = ({
  colSpan = 'lg:col-span-6',
}) => {
  return (
    <div
      className={`${colSpan} bg-white border border-[#111111]/10 flex flex-col animate-shimmer overflow-hidden`}
      aria-hidden="true"
    >
      {/* Visual aspect box placeholder with subtle architectural grid lines */}
      <div className="relative aspect-[16/10] bg-[#EBE5D8] overflow-hidden">
        {/* Subtle geometric crosshair / floorplan detail */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#111111_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Top-right badge placeholder */}
        <div className="absolute top-3 right-3 h-5 w-28 bg-[#111111]/15" />

        {/* Center architectural icon placeholder */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="w-12 h-12 border border-[#111111]/30 rotate-45" />
        </div>
      </div>

      {/* Card Content & Metadata Skeleton */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Category / Area / Year hairline meta */}
          <div className="flex items-center gap-2">
            <div className="h-3 w-24 bg-[#D9541E]/25" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#111111]/20" />
            <div className="h-3 w-16 bg-[#111111]/15" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#111111]/20" />
            <div className="h-3 w-10 bg-[#111111]/15" />
          </div>

          {/* Project Title Placeholder */}
          <div className="h-6 sm:h-7 w-3/4 bg-[#111111]/15 mt-2" />

          {/* Two-line description placeholder */}
          <div className="space-y-2 pt-1">
            <div className="h-3 w-full bg-[#111111]/10" />
            <div className="h-3 w-5/6 bg-[#111111]/10" />
          </div>
        </div>

        {/* Materials & Location Hairline Footer */}
        <div className="pt-3 border-t border-[#111111]/10 flex items-center justify-between">
          <div className="h-3 w-32 bg-[#111111]/15" />
          <div className="h-3 w-20 bg-[#111111]/20" />
        </div>
      </div>
    </div>
  );
};

export const ProjectGallerySkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8" role="status" aria-label="Loading projects...">
      {Array.from({ length: count }).map((_, idx) => {
        // Matching asymmetric rhythm of portfolio (idx % 3 === 0 ? lg:col-span-7 : lg:col-span-5)
        const isLarge = idx % 3 === 0;
        const colSpan = isLarge ? 'lg:col-span-7' : 'lg:col-span-5';
        return <ProjectCardSkeleton key={idx} colSpan={colSpan} />;
      })}
    </div>
  );
};

export const TestimonialCardSkeleton: React.FC = () => {
  return (
    <div
      className="p-8 bg-white border border-[#111111]/10 flex flex-col justify-between relative animate-shimmer overflow-hidden min-h-[320px]"
      aria-hidden="true"
    >
      <div className="space-y-4">
        {/* Rating Stars & Year Placeholder */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3.5 h-3.5 bg-[#D9541E]/30" />
            ))}
          </div>
          <div className="h-3 w-10 bg-[#111111]/15" />
        </div>

        {/* Quote Lines */}
        <div className="space-y-2.5 pt-2">
          <div className="h-4 w-full bg-[#111111]/15" />
          <div className="h-4 w-11/12 bg-[#111111]/15" />
          <div className="h-4 w-4/5 bg-[#111111]/15" />
        </div>

        {/* Quantitative Outcome Block */}
        <div className="pt-3 border-t border-[#111111]/10 space-y-1.5">
          <div className="h-2.5 w-16 bg-[#111111]/15" />
          <div className="h-3.5 w-3/4 bg-[#D9541E]/20" />
        </div>
      </div>

      {/* Author & Handover Lockup */}
      <div className="pt-6 mt-6 border-t border-[#111111]/10">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-3.5 w-28 bg-[#111111]/20" />
            <div className="h-2.5 w-36 bg-[#111111]/10" />
          </div>
          <div className="space-y-1.5 text-right">
            <div className="h-2.5 w-24 bg-emerald-800/20 ml-auto" />
            <div className="h-2.5 w-16 bg-[#111111]/10 ml-auto" />
          </div>
        </div>
        <div className="h-2.5 w-40 bg-[#111111]/10 mt-3" />
      </div>
    </div>
  );
};

export const TestimonialsSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="status" aria-label="Loading testimonials...">
      {Array.from({ length: count }).map((_, idx) => (
        <TestimonialCardSkeleton key={idx} />
      ))}
    </div>
  );
};
