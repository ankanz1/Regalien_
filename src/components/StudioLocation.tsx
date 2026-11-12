import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Navigation, Clock, Phone, Car, Compass, ExternalLink } from 'lucide-react';

export const StudioLocation: React.FC = () => {
  const { company } = useApp();

  return (
    <section id="location" className="py-20 bg-white border-t border-[#111111]/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Location Details */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#D9541E] mb-2">
                <span>Flagship Design Studio</span>
                <span aria-hidden="true">·</span>
                <span>Astra Towers Newtown</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] leading-tight">
                Visit Our Material Library.
              </h2>
            </div>

            <p className="text-sm text-[#111111]/75 leading-relaxed font-normal">
              Experience textures firsthand before committing to construction. Our Astra Towers studio houses extensive physical slabs of Italian marble, German hardware mockups, fluted timber profiles, and circadian architectural lighting galleries.
            </p>

            {/* Address Card */}
            <div className="p-6 bg-[#F3EEE3]/60 border border-[#111111]/15 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D9541E] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-[#111111]">
                    Official Business Address
                  </h4>
                  <p className="text-sm font-medium text-[#111111] mt-1">
                    {company.address}
                  </p>
                  <p className="text-xs text-[#111111]/60 mt-0.5">
                    Landmark: Ground Floor, Astra Towers (Near Akankha More & Eco Park)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#111111]/10 text-xs text-[#111111]/80">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#D9541E] shrink-0" />
                  <span>{company.officeHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#D9541E] shrink-0" />
                  <span>Dedicated Basement & Valet Parking</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={company.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#D9541E] transition-colors shadow-sm"
              >
                <Navigation className="w-4 h-4" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              <a
                href={`tel:${company.phone}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#111111] bg-white border border-[#111111]/20 hover:border-[#111111] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#D9541E]" />
                <span>Direct Studio Call</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Map Preview Card */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] bg-[#111111] overflow-hidden border border-[#111111]/20 shadow-xl group">
              {/* Map View Canvas / Graphic styling */}
              <div className="absolute inset-0 bg-[#242f3e] flex flex-col justify-between p-8 text-white">
                {/* Stylized Architectural Map Graphic */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#D9541E]">
                        GEO COORDINATES
                      </span>
                      <h4 className="font-serif text-xl font-bold text-white">
                        Astra Towers · Newtown Kolkata
                      </h4>
                    </div>
                    <span className="text-xs text-white/50 font-mono">
                      Action Area IIC
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-white/70">
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D9541E]" />
                      <span>7 mins from Kolkata International Airport (CCU)</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D9541E]" />
                      <span>Direct connectivity via Major Arterial Road Newtown</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D9541E]" />
                      <span>Ground Floor ASR 026 (No elevator needed)</span>
                    </p>
                  </div>
                </div>

                {/* Central Pin Callout */}
                <div className="my-auto text-center py-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-[#D9541E] text-white shadow-2xl rounded-full mb-3 animate-bounce">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <p className="text-xs font-semibold text-white tracking-wider uppercase">
                    Regalien Infrastructure Pvt Ltd
                  </p>
                  <p className="text-[11px] text-white/60">
                    ASR 026, Ground Floor, Astra Towers
                  </p>
                </div>

                {/* Bottom link bar */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-white/60 font-mono">
                    PIN: 700161 · KOLKATA
                  </span>
                  <a
                    href={company.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#D9541E] hover:text-white font-semibold inline-flex items-center gap-1 transition-colors"
                  >
                    Launch Navigation Route <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
