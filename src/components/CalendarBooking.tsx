import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ConsultationType, BookingAppointment } from '../types';
import { generateIcsFile } from '../utils/calendar';
import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle, ExternalLink, Download, MessageSquare, AlertCircle } from 'lucide-react';

const TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '02:00 PM',
  '03:30 PM',
  '05:00 PM',
  '06:30 PM',
];

const CONSULTATION_TYPES: { type: ConsultationType; label: string; desc: string; icon: string }[] = [
  {
    type: 'Studio Walkthrough (Astra Towers)',
    label: 'Studio Walkthrough · Astra Towers',
    desc: 'Visit our flagship Newtown studio to touch material swatches, marble slabs & engineered joinery samples.',
    icon: '🏢',
  },
  {
    type: 'On-Site Architectural Assessment',
    label: 'On-Site Architectural Assessment',
    desc: 'Our principal architect visits your bare shell site in Kolkata to take preliminary measurements & assess structural possibilities.',
    icon: '📐',
  },
  {
    type: 'Virtual Video Consultation',
    label: 'Virtual Video Consultation',
    desc: 'Join a 45-minute Google Meet walkthrough with preliminary floor plan review from anywhere in India or abroad.',
    icon: '💻',
  },
];

export const CalendarBooking: React.FC = () => {
  const { company, bookings, addBooking } = useApp();

  // Selected date defaults to tomorrow
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  });

  const [selectedSlot, setSelectedSlot] = useState<string>('11:30 AM');
  const [consultationType, setConsultationType] = useState<ConsultationType>('Studio Walkthrough (Astra Towers)');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [projectType, setProjectType] = useState('Luxury Apartment / Penthouse');
  const [estimatedSqFt, setEstimatedSqFt] = useState('3200');
  const [budget, setBudget] = useState('₹40L - ₹75L');
  const [notes, setNotes] = useState('');

  const [confirmedBooking, setConfirmedBooking] = useState<BookingAppointment | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Generate next 14 calendar dates for quick selection
  const upcomingDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isSunday = d.getDay() === 0;
      dates.push({
        dateStr: d.toISOString().slice(0, 10),
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        monthName: d.toLocaleDateString('en-US', { month: 'short' }),
        isSunday,
      });
    }
    return dates;
  }, []);

  // Check if slot is already booked on the selected date
  const isSlotBooked = (slot: string) => {
    return bookings.some(
      (b) => b.date === selectedDate && b.timeSlot === slot && b.status !== 'Completed'
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim()) {
      setErrorMsg('Please enter your full name, email address, and phone number.');
      return;
    }

    if (isSlotBooked(selectedSlot)) {
      setErrorMsg('This slot was just reserved. Please pick another available time slot.');
      return;
    }

    const newBooking = addBooking({
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientPhone: clientPhone.trim(),
      consultationType,
      date: selectedDate,
      timeSlot: selectedSlot,
      projectType,
      estimatedSqFt: Number(estimatedSqFt) || undefined,
      budget,
      notes,
    });

    setConfirmedBooking(newBooking);
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setNotes('');
  };

  return (
    <section id="calendar" className="py-20 bg-[#F3EEE3] border-t border-[#111111]/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#D9541E] mb-2">
            <span>Direct Appointment Engine</span>
            <span aria-hidden="true">·</span>
            <span>Google Calendar Sync</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] leading-tight">
            Schedule an Architectural Consultation.
          </h2>
          <p className="text-sm text-[#111111]/75 mt-3 leading-relaxed">
            Reserve a dedicated 60-minute session with our senior architects at our Astra Towers studio, on-site at your property, or over secure video call. Instantly adds to your Google Calendar.
          </p>
        </div>

        {confirmedBooking ? (
          /* Confirmation Success Card */
          <div className="bg-white border-2 border-[#111111] p-8 sm:p-12 shadow-xl animate-in fade-in duration-300 max-w-3xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-[#D9541E] font-semibold">
                  Appointment Confirmed
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] mt-1">
                  We look forward to meeting you, {confirmedBooking.clientName}.
                </h3>
                <p className="text-xs text-[#111111]/70 mt-1">
                  An automated email summary has been sent to <strong>{confirmedBooking.clientEmail}</strong> and our Newtown studio team.
                </p>
              </div>
            </div>

            {/* Appointment Details Box */}
            <div className="p-6 bg-[#F3EEE3]/60 border border-[#111111]/10 space-y-3 mb-8 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#111111]/50 block">Date & Time</span>
                  <span className="font-semibold text-[#111111] text-base">
                    {confirmedBooking.date} at {confirmedBooking.timeSlot}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#111111]/50 block">Consultation Type</span>
                  <span className="font-semibold text-[#111111]">
                    {confirmedBooking.consultationType}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#111111]/50 block">Location / Format</span>
                  <span className="text-[#111111]/80">
                    {confirmedBooking.consultationType.includes('Astra')
                      ? company.address
                      : (confirmedBooking.consultationType.includes('Virtual') ? 'Google Meet Video Link' : 'On-Site Property Assessment')}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#111111]/50 block">Project Scope</span>
                  <span className="text-[#111111]/80">
                    {confirmedBooking.projectType} ({confirmedBooking.estimatedSqFt} sq.ft)
                  </span>
                </div>
              </div>
            </div>

            {/* Sync & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              {confirmedBooking.googleCalendarEventUrl && (
                <a
                  href={confirmedBooking.googleCalendarEventUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-[#111111] hover:bg-[#D9541E] transition-colors shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Sync Seamlessly with Google Calendar</span>
                </a>
              )}

              <button
                onClick={() => generateIcsFile(confirmedBooking, company)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#111111] bg-white border border-[#111111]/20 hover:border-[#111111] transition-colors"
              >
                <Download className="w-4 h-4 text-[#D9541E]" />
                <span>Download .ICS File</span>
              </button>

              <button
                onClick={handleReset}
                className="inline-flex items-center justify-center px-4 py-3.5 text-xs uppercase tracking-wider text-[#111111]/60 hover:text-[#111111] transition-colors"
              >
                Book Another
              </button>
            </div>
          </div>
        ) : (
          /* Interactive Booking Form */
          <form onSubmit={handleSubmit} className="bg-white border border-[#111111]/15 p-6 sm:p-10 shadow-lg">
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Step 1: Consultation Type */}
            <div className="space-y-4 mb-8">
              <label className="text-xs uppercase tracking-widest text-[#111111]/60 font-semibold block">
                1. Select Consultation Format
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {CONSULTATION_TYPES.map((c) => (
                  <button
                    key={c.type}
                    type="button"
                    onClick={() => setConsultationType(c.type)}
                    className={`p-4 text-left border transition-all cursor-pointer ${
                      consultationType === c.type
                        ? 'border-[#D9541E] bg-[#F3EEE3]/50 ring-1 ring-[#D9541E]'
                        : 'border-[#111111]/15 bg-white hover:border-[#111111]/40'
                    }`}
                  >
                    <span className="text-xl block mb-2">{c.icon}</span>
                    <p className="font-semibold text-xs text-[#111111] mb-1">{c.label}</p>
                    <p className="text-[11px] text-[#111111]/65 leading-relaxed">{c.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Date Picker Strip */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-widest text-[#111111]/60 font-semibold block">
                  2. Choose Consultation Date
                </label>
                <span className="text-xs text-[#111111]/60">
                  Selected: <strong className="text-[#111111]">{selectedDate}</strong>
                </span>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {upcomingDates.map((item) => (
                  <button
                    key={item.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(item.dateStr)}
                    className={`shrink-0 w-20 py-3 text-center border transition-all cursor-pointer ${
                      selectedDate === item.dateStr
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-[#F3EEE3]/40 text-[#111111] border-[#111111]/15 hover:border-[#111111]'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider block opacity-75">{item.dayName}</span>
                    <span className="font-serif text-xl font-bold block tabular-nums my-0.5">{item.dayNum}</span>
                    <span className="text-[10px] block opacity-75">{item.monthName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Time Slot Selector */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-widest text-[#111111]/60 font-semibold block">
                  3. Select Availability Slot (Real-Time)
                </label>
                <span className="text-xs text-[#111111]/60 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#D9541E]" />
                  <span>Studio Hours: 10:00 AM – 7:30 PM</span>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {TIME_SLOTS.map((slot) => {
                  const booked = isSlotBooked(slot);
                  const isSelected = selectedSlot === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={booked}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3 px-2 text-center text-xs font-semibold uppercase tracking-wider border transition-all ${
                        booked
                          ? 'bg-[#111111]/5 text-[#111111]/30 border-[#111111]/10 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-[#D9541E] text-white border-[#D9541E]'
                          : 'bg-white text-[#111111] border-[#111111]/20 hover:border-[#111111]'
                      }`}
                    >
                      {slot}
                      {booked && <span className="block text-[9px] no-underline">Booked</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Client & Project Details */}
            <div className="space-y-4 pt-6 border-t border-[#111111]/10 mb-8">
              <label className="text-xs uppercase tracking-widest text-[#111111]/60 font-semibold block">
                4. Client & Residence Particulars
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#111111]/80 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. S. Sen / Dr. Banerjee"
                    className="w-full px-3 py-2.5 bg-[#F3EEE3]/40 border border-[#111111]/20 text-xs focus:border-[#D9541E] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111111]/80 mb-1">Email Address (for Google Invite) *</label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="client@domain.com"
                    className="w-full px-3 py-2.5 bg-[#F3EEE3]/40 border border-[#111111]/20 text-xs focus:border-[#D9541E] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111111]/80 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+91 98300 XXXXX"
                    className="w-full px-3 py-2.5 bg-[#F3EEE3]/40 border border-[#111111]/20 text-xs focus:border-[#D9541E] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#111111]/80 mb-1">Property Type</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F3EEE3]/40 border border-[#111111]/20 text-xs focus:border-[#D9541E] focus:bg-white focus:outline-none"
                  >
                    <option value="3BHK Luxury Residence">3BHK Luxury Residence</option>
                    <option value="4BHK / 5BHK Duplex">4BHK / 5BHK Duplex</option>
                    <option value="Penthouse Suite">Penthouse Suite</option>
                    <option value="Independent Villa / Bungalow">Independent Villa / Bungalow</option>
                    <option value="Commercial Office / Lounge">Commercial Office / Lounge</option>
                    <option value="Bespoke Kitchen & Wardrobes">Bespoke Kitchen & Wardrobes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#111111]/80 mb-1">Estimated Area (Sq.Ft)</label>
                  <input
                    type="number"
                    value={estimatedSqFt}
                    onChange={(e) => setEstimatedSqFt(e.target.value)}
                    placeholder="e.g. 3500"
                    className="w-full px-3 py-2.5 bg-[#F3EEE3]/40 border border-[#111111]/20 text-xs focus:border-[#D9541E] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#111111]/80 mb-1">Planned Budget Bracket</label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F3EEE3]/40 border border-[#111111]/20 text-xs focus:border-[#D9541E] focus:bg-white focus:outline-none"
                  >
                    <option value="₹25L - ₹40L">₹25L – ₹40L</option>
                    <option value="₹40L - ₹75L">₹40L – ₹75L</option>
                    <option value="₹75L - ₹1.2 Cr">₹75L – ₹1.2 Cr</option>
                    <option value="₹1.2 Cr - ₹2.5 Cr">₹1.2 Cr – ₹2.5 Cr</option>
                    <option value="₹2.5 Cr+">₹2.5 Cr+ (Bespoke Estate)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#111111]/80 mb-1">Special Requirements or Architectural Preferences</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Looking for Italian marble flooring, walk-in closets, acoustic ceiling in home theatre, handover required before Durga Puja."
                  className="w-full px-3 py-2 bg-[#F3EEE3]/40 border border-[#111111]/20 text-xs focus:border-[#D9541E] focus:bg-white focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Submission CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#111111]/10">
              <div className="text-xs text-[#111111]/60 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#D9541E] shrink-0" />
                <span>Instant Google Calendar sync link & email confirmation provided</span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-[#D9541E] hover:bg-[#b84214] transition-all shadow-md cursor-pointer"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Confirm Consultation Slot</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
