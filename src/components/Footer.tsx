import React from 'react';
import { useApp } from '../context/AppContext';
import { useTransitionNavigation } from './PageTransition';
import {
  Compass,
  MapPin,
  Leaf,
  Gem,
  Briefcase,
  Calendar,
  CreditCard,
  ShieldCheck,
  Star,
  Lock,
  Instagram,
  Facebook,
  Youtube,
  Phone,
  Mail,
  Clock,
  Building2,
  ArrowUp,
  Sparkles,
  Award,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { company, setIsAdminOpen } = useApp();
  const { navigateTo, navigateToSection } = useTransitionNavigation();

  return (
    <footer className="bg-[#111111] text-white pt-16 pb-12 border-t border-white/10 selection:bg-[#D9541E] selection:text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Grid: 4 Dynamic Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-10 pb-12">
          {/* Col 1: About & Architecture */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2 text-white/50">
              <Compass className="w-4 h-4 text-[#D9541E]" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                About Studio
              </h4>
            </div>
            <ul className="space-y-3 text-xs text-white/75 font-normal">
              <li>
                <button
                  onClick={() => navigateTo('/')}
                  className="inline-flex items-center gap-2 hover:text-[#D9541E] transition-colors cursor-pointer group text-left"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white/40 group-hover:text-[#D9541E] transition-colors shrink-0" />
                  <span>Our Story & Vision</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/location')}
                  className="inline-flex items-center gap-2 hover:text-[#D9541E] transition-colors cursor-pointer group text-left"
                >
                  <MapPin className="w-3.5 h-3.5 text-white/40 group-hover:text-[#D9541E] transition-colors shrink-0" />
                  <span>Store Locator (Astra Towers)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/services')}
                  className="inline-flex items-center gap-2 hover:text-[#D9541E] transition-colors cursor-pointer group text-left"
                >
                  <Leaf className="w-3.5 h-3.5 text-white/40 group-hover:text-[#D9541E] transition-colors shrink-0" />
                  <span>Sustainability & Materials</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/portfolio')}
                  className="inline-flex items-center gap-2 hover:text-[#D9541E] transition-colors cursor-pointer group text-left"
                >
                  <Gem className="w-3.5 h-3.5 text-white/40 group-hover:text-[#D9541E] transition-colors shrink-0" />
                  <span>Signature Collections</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/inquiry')}
                  className="inline-flex items-center gap-2 hover:text-[#D9541E] transition-colors cursor-pointer group text-left"
                >
                  <Briefcase className="w-3.5 h-3.5 text-white/40 group-hover:text-[#D9541E] transition-colors shrink-0" />
                  <span>Direct Commission</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Customer Service & Booking */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2 text-white/50">
              <Calendar className="w-4 h-4 text-[#D9541E]" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                Client Service
              </h4>
            </div>
            <ul className="space-y-3 text-xs text-white/75 font-normal">
              <li>
                <button
                  onClick={() => navigateTo('/consultation')}
                  className="inline-flex items-center gap-2 hover:text-[#D9541E] transition-colors cursor-pointer group text-left"
                >
                  <Calendar className="w-3.5 h-3.5 text-white/40 group-hover:text-[#D9541E] transition-colors shrink-0" />
                  <span>Google Calendar Booking</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/faq')}
                  className="inline-flex items-center gap-2 hover:text-[#D9541E] transition-colors cursor-pointer group text-left"
                >
                  <CreditCard className="w-3.5 h-3.5 text-white/40 group-hover:text-[#D9541E] transition-colors shrink-0" />
                  <span>Pricing & Milestones</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/services')}
                  className="inline-flex items-center gap-2 hover:text-[#D9541E] transition-colors cursor-pointer group text-left"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-white/40 group-hover:text-[#D9541E] transition-colors shrink-0" />
                  <span>Turnkey Execution Warranty</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/reviews')}
                  className="inline-flex items-center gap-2 hover:text-[#D9541E] transition-colors cursor-pointer group text-left"
                >
                  <Star className="w-3.5 h-3.5 text-white/40 group-hover:text-[#D9541E] transition-colors shrink-0" />
                  <span>Client Verification Reviews</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/admin')}
                  className="inline-flex items-center gap-2 text-white/60 hover:text-[#D9541E] transition-colors cursor-pointer group text-left"
                >
                  <Lock className="w-3.5 h-3.5 text-[#D9541E]" />
                  <span>Admin Studio Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Social & Direct Contact Channels */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2 text-white/50">
              <Phone className="w-4 h-4 text-[#D9541E]" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                Contact & Connect
              </h4>
            </div>
            <ul className="space-y-3 text-xs text-white/75 font-normal">
              <li>
                <a
                  href={`tel:${company.phone}`}
                  className="inline-flex items-center gap-2 hover:text-[#D9541E] transition-colors group"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D9541E] shrink-0" />
                  <span>{company.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="inline-flex items-center gap-2 hover:text-[#D9541E] transition-colors group"
                >
                  <Mail className="w-3.5 h-3.5 text-[#D9541E] shrink-0" />
                  <span>{company.email}</span>
                </a>
              </li>
              <li>
                <div className="inline-flex items-center gap-2 text-white/60">
                  <Clock className="w-3.5 h-3.5 text-white/40 shrink-0" />
                  <span>Mon - Sat: 10:00 AM - 7:30 PM</span>
                </div>
              </li>
            </ul>

            {/* Social Media Channels with Dedicated Icon Pills */}
            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-wider text-white/40 block mb-2 font-mono">
                Social Networks
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={company.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#D9541E] border border-white/10 hover:border-transparent flex items-center justify-center text-white/80 hover:text-white transition-all shadow-xs cursor-pointer"
                  title="Follow Regalien on Instagram"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={company.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#D9541E] border border-white/10 hover:border-transparent flex items-center justify-center text-white/80 hover:text-white transition-all shadow-xs cursor-pointer font-bold text-xs"
                  title="Follow Regalien on Facebook"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={company.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#D9541E] border border-white/10 hover:border-transparent flex items-center justify-center text-white/80 hover:text-white transition-all shadow-xs cursor-pointer"
                  title="Watch Regalien Project Tours on YouTube"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/918981441040?text=${encodeURIComponent(
                    '*Inquiry: Regalien Interior Architecture*\nHello Regalien Team,\n\nI would like to inquire about bespoke interior architecture & turnkey execution for my property in Kolkata/Newtown.\n\n• Preferred Consultation: Astra Towers Studio / Site Walkthrough\n\nKindly connect with me to discuss design possibilities. Thank you!'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#25D366] border border-white/10 hover:border-transparent flex items-center justify-center text-white/80 hover:text-white transition-all shadow-xs cursor-pointer"
                  title="Chat directly on WhatsApp (+91 8981441040)"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="https://maps.app.goo.gl/1hzEZGmSfmzfCoAq7?g_st=aw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#D9541E] border border-white/10 hover:border-transparent flex items-center justify-center text-white/80 hover:text-white transition-all shadow-xs cursor-pointer"
                  title="View Studio on Google Maps"
                  aria-label="Google Maps"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Official Regalien Interior Logo Showcase */}
          <div className="lg:col-span-3 flex flex-col items-start lg:items-end justify-between space-y-4">
            <div className="w-full max-w-[280px] bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 rounded-2xl border border-white/15 shadow-2xl backdrop-blur-sm group hover:border-[#D9541E]/40 transition-all">
              {/* Official Brand Logo */}
              <div className="relative flex justify-center py-2">
                <img
                  src="/brand/regalien-logo.png"
                  alt="Regalien Interior - Luxury Architectural Design"
                  className="w-full max-h-24 sm:max-h-28 object-contain filter drop-shadow-[0_4px_12px_rgba(217,84,30,0.15)] group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D9541E]/40 to-transparent my-3" />

              <div className="text-center space-y-1">
                <p className="text-[11px] font-serif font-bold text-white tracking-wide">
                  Regalien Infrastructure Pvt Ltd
                </p>
                <p className="text-[10px] text-white/60 font-sans">
                  Ground Floor ASR 026, Astra Towers, Newtown Kolkata
                </p>
              </div>

              <div className="mt-3 pt-2">
                <button
                  onClick={() => navigateTo('/consultation')}
                  className="w-full py-2 px-3 rounded-lg bg-[#D9541E] hover:bg-[#b84214] text-white text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Studio Visit</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hallmark Trust & Quality Pillars Banner with Icons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-white/10 text-white/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D9541E] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-semibold text-white">10-Year Warranty</h5>
              <p className="text-[10px] sm:text-[11px] text-white/50">Turnkey Structural Guarantee</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D9541E] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-semibold text-white">Italian & German</h5>
              <p className="text-[10px] sm:text-[11px] text-white/50">Bespoke Hardware & Finishes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D9541E] shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-semibold text-white">Astra Towers Studio</h5>
              <p className="text-[10px] sm:text-[11px] text-white/50">Newtown Kolkata Experience</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D9541E] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-semibold text-white">Verified Excellence</h5>
              <p className="text-[10px] sm:text-[11px] text-white/50">100% On-Time Delivery Track</p>
            </div>
          </div>
        </div>

        {/* Bottom Metadata & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <img
              src="/brand/regalien-emblem.png"
              alt="Regalien Crown"
              className="w-4 h-4 object-contain opacity-75"
            />
            <p>
              © {new Date().getFullYear()} Regalien Infrastructure Pvt Ltd. CIN: U45201WB2020PTC239871. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigateToSection('hero')}
              className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-xs group"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

