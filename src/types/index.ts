export type ProjectCategory = 
  | 'All'
  | 'Luxury Residential'
  | 'Penthouse Suites'
  | 'Commercial & Corporate'
  | 'Modular Kitchen & Bar'
  | 'Bespoke Lighting';

export interface Project {
  id: string;
  title: string;
  category: Exclude<ProjectCategory, 'All'>;
  location: string;
  year: number;
  areaSqFt: number;
  client: string;
  description: string;
  materials: string[];
  features: string[];
  coverImage: string;
  gallery: string[];
  featured: boolean;
  published?: boolean; // Controls public portfolio visibility
  completionWeeks: number;
  beforeAfter?: {
    beforeLabel: string;
    afterLabel: string;
    beforeImage: string;
    afterImage: string;
  };
}

export interface FaqItem {
  id: string;
  category: 'Turnkey Execution' | 'Pricing & Milestones' | 'Materials & Warranty' | 'Astra Towers Studio' | 'General';
  question: string;
  answer: string;
  highlight?: string;
  order: number;
}

export interface TaskItem {
  id: string;
  title: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  relatedProject?: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  bucketName: string;
  connected: boolean;
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  project: string;
  location: string;
  rating: number;
  quote: string;
  outcome: string;
  avatarUrl?: string;
  year: number;
}

export type ConsultationType = 
  | 'Studio Walkthrough (Astra Towers)'
  | 'On-Site Architectural Assessment'
  | 'Virtual Video Consultation';

export interface BookingAppointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  consultationType: ConsultationType;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "11:30 AM"
  projectType: string;
  estimatedSqFt?: number;
  budget?: string;
  notes?: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Rescheduled';
  createdAt: string;
  googleCalendarEventUrl?: string;
}

export interface ClientInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectScope: string;
  propertyType: string;
  estimatedSqFt: string;
  location: string;
  targetTimeline: string;
  message: string;
  budgetRange: string;
  status: 'New' | 'Contacted' | 'Proposal Sent' | 'Converted' | 'Archived';
  createdAt: string;
  notes?: string;
}

export interface CompanyConfig {
  name: string;
  tagline: string;
  phone: string;
  whatsappNumber: string; // e.g. "918981441040"
  email: string;
  address: string;
  googleMapsUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  officeHours: string;
}
