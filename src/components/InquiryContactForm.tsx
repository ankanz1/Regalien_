import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, CheckCircle2, Shield, Phone, Mail, Clock, MapPin } from 'lucide-react';

export const InquiryContactForm: React.FC = () => {
  const { company, addInquiry } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectScope, setProjectScope] = useState('Full Turnkey Interior');
  const [propertyType, setPropertyType] = useState('Luxury Apartment / Penthouse');
  const [estimatedSqFt, setEstimatedSqFt] = useState('3000');
  const [location, setLocation] = useState('Newtown / Rajarhat, Kolkata');
  const [targetTimeline] = useState('Within 3–5 Months');
  const [budgetRange, setBudgetRange] = useState('₹50L - ₹80L');
  const [message, setMessage] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg('Please complete all required fields including your project requirements.');
      return;
    }

    addInquiry({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      projectScope,
      propertyType,
      estimatedSqFt,
      location,
      targetTimeline,
      budgetRange,
      message: message.trim(),
    });

    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <section id="inquiry" className="py-20 bg-white border-t border-[#111111]/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Design Studio Contact & Trust Marks */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#D9541E] mb-2">
                <span>Start A Project</span>
                <span aria-hidden="true">·</span>
                <span>Automated Email Confirmation</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] leading-tight">
                Commission Your Residence.
              </h2>
              <p className="text-sm text-[#111111]/75 mt-3 leading-relaxed">
                Whether you have received possession of a bare concrete duplex or are planning a comprehensive turnkey renovation, submit your spatial specifications below.
              </p>
            </div>

            {/* Direct Studio Particulars */}
            <div className="p-6 bg-[#F3EEE3]/50 border border-[#111111]/10 space-y-4">
              <h4 className="text-xs uppercase tracking-widest text-[#111111]/60 font-semibold">
                Studio Headquarters
              </h4>

              <div className="space-y-3 text-xs text-[#111111]/80">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D9541E] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#111111] block">Regalien Infrastructure Pvt Ltd</span>
                    <span className="text-[#111111]/70">{company.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#D9541E] shrink-0" />
                  <div>
                    <span className="font-semibold text-[#111111]">Direct Architect Line: </span>
                    <a href={`tel:${company.phone}`} className="hover:text-[#D9541E] transition-colors">{company.phone}</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#D9541E] shrink-0" />
                  <div>
                    <span className="font-semibold text-[#111111]">Formal Tender & RFPs: </span>
                    <a href={`mailto:${company.email}`} className="hover:text-[#D9541E] transition-colors">{company.email}</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#D9541E] shrink-0" />
                  <div>
                    <span className="font-semibold text-[#111111]">Visiting Hours: </span>
                    <span>{company.officeHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Architectural Guarantees */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs uppercase tracking-widest text-[#111111]/60 font-semibold">
                Regalien Assurance
              </h4>
              <ul className="space-y-2 text-xs text-[#111111]/75">
                <li className="flex items-start gap-2">
                  <span className="text-[#D9541E] font-bold">―</span>
                  <span><strong>Zero Subcontracting:</strong> Direct in-house civil engineers, modular factory & stone artisans.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D9541E] font-bold">―</span>
                  <span><strong>Milestone Penalties:</strong> Financial penalty clause credited to client if handover exceeds target date.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D9541E] font-bold">―</span>
                  <span><strong>10-Year Warranty:</strong> On all engineered modular joinery, hardware & waterproofing.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-[#F3EEE3]/40 border-2 border-[#111111] p-8 sm:p-12 text-center animate-in fade-in duration-300">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-[#111111]">
                  Inquiry Dispatched Successfully.
                </h3>
                <p className="text-xs sm:text-sm text-[#111111]/75 max-w-lg mx-auto mt-2 leading-relaxed">
                  An automated email confirmation has been logged. Our Senior Interior Architect is analyzing your property size ({estimatedSqFt} sq.ft) and will call you back within 4 business hours with preliminary estimates.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 text-xs uppercase tracking-wider font-bold text-white bg-[#111111] hover:bg-[#D9541E] transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[#F3EEE3]/40 border border-[#111111]/15 p-6 sm:p-10 space-y-6">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111]/70 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anirban Roy"
                      className="w-full px-3 py-2.5 bg-white border border-[#111111]/20 text-xs focus:border-[#D9541E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111]/70 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="anirban@example.com"
                      className="w-full px-3 py-2.5 bg-white border border-[#111111]/20 text-xs focus:border-[#D9541E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111]/70 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98300 XXXXX"
                      className="w-full px-3 py-2.5 bg-white border border-[#111111]/20 text-xs focus:border-[#D9541E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111]/70 mb-1">
                      Project Location (Kolkata / Outstation)
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Newtown Action Area II, Alipore, Salt Lake"
                      className="w-full px-3 py-2.5 bg-white border border-[#111111]/20 text-xs focus:border-[#D9541E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111]/70 mb-1">
                      Property Category
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-[#111111]/20 text-xs focus:border-[#D9541E] focus:outline-none"
                    >
                      <option value="Luxury Apartment / Penthouse">Luxury Apartment / Penthouse</option>
                      <option value="Bungalow / Private Villa">Bungalow / Private Villa</option>
                      <option value="Corporate Office / Commercial">Corporate Office / Commercial</option>
                      <option value="Modular Kitchen Overhaul">Modular Kitchen Overhaul</option>
                      <option value="Full Estate Renovation">Full Estate Renovation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111]/70 mb-1">
                      Super Built-Up Area (Sq.Ft)
                    </label>
                    <input
                      type="number"
                      value={estimatedSqFt}
                      onChange={(e) => setEstimatedSqFt(e.target.value)}
                      placeholder="e.g. 2800"
                      className="w-full px-3 py-2.5 bg-white border border-[#111111]/20 text-xs focus:border-[#D9541E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111]/70 mb-1">
                      Budget Range
                    </label>
                    <select
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-[#111111]/20 text-xs focus:border-[#D9541E] focus:outline-none"
                    >
                      <option value="₹25L - ₹40L">₹25L – ₹40L</option>
                      <option value="₹40L - ₹75L">₹40L – ₹75L</option>
                      <option value="₹75L - ₹1.2 Cr">₹75L – ₹1.2 Cr</option>
                      <option value="₹1.2 Cr - ₹2.5 Cr">₹1.2 Cr – ₹2.5 Cr</option>
                      <option value="₹2.5 Cr+">₹2.5 Cr+ (Bespoke)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111]/70 mb-1">
                    Describe Your Vision & Space Requirements *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your property status (bare shell vs occupied), design aspirations (modern luxury, warm minimalism, Italian classic), and any critical delivery milestones..."
                    className="w-full px-3 py-2.5 bg-white border border-[#111111]/20 text-xs focus:border-[#D9541E] focus:outline-none resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <span className="text-xs text-[#111111]/60">
                    Automated email dispatch upon submission
                  </span>

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#D9541E] transition-colors shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Inquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
