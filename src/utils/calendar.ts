import { BookingAppointment, CompanyConfig } from '../types';

export function createGoogleCalendarUrl(
  booking: Omit<BookingAppointment, 'id' | 'createdAt' | 'status'>,
  company: CompanyConfig
): string {
  // Parse date and time
  const [year, month, day] = booking.date.split('-').map(Number);
  
  // Parse time e.g. "11:30 AM" or "03:00 PM"
  let hours = 10;
  let minutes = 0;
  const match = booking.timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (match) {
    hours = parseInt(match[1], 10);
    minutes = parseInt(match[2], 10);
    const meridian = match[3].toUpperCase();
    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;
  }

  // Construct start date object (IST is UTC+5:30)
  // We format into YYYYMMDDTHHmmSSZ or local format for Google Calendar
  const pad = (n: number) => String(n).padStart(2, '0');
  
  // Date in UTC
  const startDate = new Date(Date.UTC(year, month - 1, day, hours - 5, minutes - 30));
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

  const formatUtc = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

  const title = encodeURIComponent(`Architectural Consultation: Regalien Interiors & ${booking.clientName}`);
  const details = encodeURIComponent(
    `Consultation Type: ${booking.consultationType}\n` +
    `Client: ${booking.clientName} (${booking.clientPhone}, ${booking.clientEmail})\n` +
    `Project: ${booking.projectType} (${booking.estimatedSqFt ? booking.estimatedSqFt + ' sq.ft' : ''})\n` +
    `Budget: ${booking.budget || 'To be discussed'}\n` +
    `Client Notes: ${booking.notes || 'None'}\n\n` +
    `Regalien Infrastructure Pvt Ltd\n` +
    `Design Studio: ${company.address}\n` +
    `Phone / WhatsApp: ${company.phone}`
  );
  
  const location = encodeURIComponent(
    booking.consultationType.includes('Astra Towers')
      ? company.address
      : (booking.consultationType.includes('Virtual') ? 'Google Meet Video Call' : `Client Site / ${company.name}`)
  );

  const datesParam = `${formatUtc(startDate)}/${formatUtc(endDate)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}&location=${location}`;
}

export function generateIcsFile(
  booking: BookingAppointment,
  company: CompanyConfig
): void {
  const [year, month, day] = booking.date.split('-').map(Number);
  let hours = 10;
  let minutes = 0;
  const match = booking.timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (match) {
    hours = parseInt(match[1], 10);
    minutes = parseInt(match[2], 10);
    const meridian = match[3].toUpperCase();
    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  const startDate = new Date(Date.UTC(year, month - 1, day, hours - 5, minutes - 30));
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  const formatUtc = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Regalien Infrastructure Pvt Ltd//Appointment Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:regalien-${booking.id}-${Date.now()}@regalieninteriors.com`,
    `DTSTAMP:${formatUtc(new Date())}`,
    `DTSTART:${formatUtc(startDate)}`,
    `DTEND:${formatUtc(endDate)}`,
    `SUMMARY:Consultation: Regalien Interiors & ${booking.clientName}`,
    `DESCRIPTION:${booking.consultationType} - Client: ${booking.clientName} (${booking.clientPhone})`,
    `LOCATION:${company.address}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `regalien-consultation-${booking.date}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
