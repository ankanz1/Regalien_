import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  Project, Testimonial, CompanyConfig, BookingAppointment, ClientInquiry,
  FaqItem, TaskItem, SupabaseConfig,
  AdminProfile, AdminRole,
} from '../types';
import { INITIAL_COMPANY_CONFIG } from '../data/initialData';
import { createGoogleCalendarUrl } from '../utils/calendar';
import { getSupabaseClient, getSupabaseStorageBucket, isSupabaseConfigured } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { describeSupabaseError } from '../lib/supabaseErrors';

export interface EmailNotificationPayload {
  to: string;
  recipientName: string;
  subject: string;
  type: 'Booking Confirmation' | 'Inquiry Received';
  timestamp: string;
  summary: string;
  details: Record<string, string>;
  calendarUrl?: string;
}

interface AppContextType {
  projects: Project[];
  adminProjects: Project[];
  testimonials: Testimonial[];
  company: CompanyConfig;
  bookings: BookingAppointment[];
  inquiries: ClientInquiry[];
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  activeEmailNotice: EmailNotificationPayload | null;
  setActiveEmailNotice: (notice: EmailNotificationPayload | null) => void;
  addBooking: (booking: Omit<BookingAppointment, 'id' | 'createdAt' | 'status' | 'googleCalendarEventUrl'>) => Promise<BookingAppointment>;
  updateBookingStatus: (id: string, status: BookingAppointment['status']) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  addInquiry: (inquiry: Omit<ClientInquiry, 'id' | 'createdAt' | 'status'>) => Promise<ClientInquiry>;
  updateInquiryStatus: (id: string, status: ClientInquiry['status'], notes?: string) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, updated: Partial<Project>) => Promise<void>;
  uploadProjectAsset: (projectId: string, file: File) => Promise<string>;
  deleteProjectAsset: (projectId: string, assetUrl: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateCompany: (config: Partial<CompanyConfig>) => Promise<void>;
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  updateTestimonial: (id: string, updated: Partial<Testimonial>) => Promise<void>;
  exportInquiriesCsv: () => void;
  resetToDefaults: () => void;
  faqs: FaqItem[];
  addFaq: (faq: Omit<FaqItem, 'id' | 'order'>) => Promise<void>;
  updateFaq: (id: string, updated: Partial<FaqItem>) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, 'id' | 'completed'>) => Promise<void>;
  toggleTaskCompleted: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  supabaseConfig: SupabaseConfig;
  updateSupabaseConfig: (config: Partial<SupabaseConfig>) => void;
  toggleProjectPublish: (id: string) => Promise<void>;
  adminTheme: 'light' | 'dark';
  toggleAdminTheme: () => void;
  isLoading: boolean;
  dataError: string | null;
  simulateRefresh: () => void;
  authLoading: boolean;
  authError: string | null;
  user: { id: string; email?: string } | null;
  adminProfile: AdminProfile | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateAdminProfile: (displayName: string, designation: string) => Promise<void>;
  isOverlayActive: boolean;
  setIsOverlayActive: (active: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

const mapProject = (row: Record<string, unknown>): Project => ({
  id: String(row.id),
  slug: typeof row.slug === 'string' ? row.slug : undefined,
  title: String(row.title || ''),
  category: row.category as Project['category'],
  location: String(row.location || ''),
  year: Number(row.year || 0),
  areaSqFt: Number(row.area_sq_ft || 0),
  client: String(row.client || ''),
  description: String(row.description || ''),
  materials: asStringArray(row.materials),
  features: asStringArray(row.features),
  coverImage: String(row.cover_image || ''),
  gallery: asStringArray(row.gallery),
  videos: asStringArray(row.videos),
  featured: Boolean(row.featured),
  published: Boolean(row.published),
  completionWeeks: Number(row.completion_weeks || 0),
  beforeAfter: row.before_after as Project['beforeAfter'],
});

const mapFaq = (row: Record<string, unknown>): FaqItem => ({
  id: String(row.id),
  category: row.category as FaqItem['category'],
  question: String(row.question || ''),
  answer: String(row.answer || ''),
  highlight: typeof row.highlight === 'string' ? row.highlight : undefined,
  order: Number(row.display_order || 0),
});

const mapTestimonial = (row: Record<string, unknown>): Testimonial => ({
  id: String(row.id),
  clientName: String(row.client_name || ''),
  role: String(row.role || ''),
  project: String(row.project || ''),
  location: String(row.location || ''),
  rating: Number(row.rating || 0),
  quote: String(row.quote || ''),
  outcome: String(row.outcome || ''),
  avatarUrl: typeof row.avatar_url === 'string' ? row.avatar_url : undefined,
  year: Number(row.year || 0),
});

const mapInquiry = (row: Record<string, unknown>): ClientInquiry => ({
  id: String(row.id),
  name: String(row.name || ''),
  email: String(row.email || ''),
  phone: String(row.phone || ''),
  projectScope: String(row.project_scope || ''),
  propertyType: String(row.property_type || ''),
  estimatedSqFt: String(row.estimated_sq_ft || ''),
  location: String(row.location || ''),
  targetTimeline: String(row.target_timeline || ''),
  message: String(row.message || ''),
  budgetRange: String(row.budget_range || ''),
  status: String(row.status || 'New') as ClientInquiry['status'],
  createdAt: String(row.created_at || ''),
  notes: typeof row.notes === 'string' ? row.notes : undefined,
});

const mapBooking = (row: Record<string, unknown>): BookingAppointment => ({
  id: String(row.id),
  clientName: String(row.client_name || ''),
  clientEmail: String(row.client_email || ''),
  clientPhone: String(row.client_phone || ''),
  consultationType: row.consultation_type as BookingAppointment['consultationType'],
  date: String(row.date || ''),
  timeSlot: String(row.time_slot || ''),
  projectType: String(row.project_type || ''),
  estimatedSqFt: typeof row.estimated_sq_ft === 'number' ? row.estimated_sq_ft : undefined,
  budget: typeof row.budget === 'string' ? row.budget : undefined,
  notes: typeof row.notes === 'string' ? row.notes : undefined,
  status: String(row.status || 'Pending') as BookingAppointment['status'],
  createdAt: String(row.created_at || ''),
  googleCalendarEventUrl: typeof row.google_calendar_event_url === 'string' ? row.google_calendar_event_url : undefined,
});

const mapTask = (row: Record<string, unknown>): TaskItem => ({
  id: String(row.id),
  title: String(row.title || ''),
  description: String(row.description || ''),
  dueDate: String(row.due_date || ''),
  priority: String(row.priority || 'Medium') as TaskItem['priority'],
  completed: row.status === 'completed',
  status: String(row.status || 'pending') as TaskItem['status'],
  assignedTo: typeof row.assigned_to === 'string' ? row.assigned_to : undefined,
  relatedProjectId: typeof row.related_project_id === 'string' ? row.related_project_id : undefined,
});

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isUuid = (value: string): boolean => UUID_PATTERN.test(value);

const throwDatabaseError = (error: { code?: string; message: string }, moduleName = 'Supabase') : never => {
  throw new Error(describeSupabaseError(error, moduleName));
};

const requireUuid = (value: string, field: string): string => {
  if (!isUuid(value)) throw new Error(`${field} is invalid. Refresh the record and try again.`);
  return value;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [adminProjects, setAdminProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [company, setCompany] = useState<CompanyConfig>(INITIAL_COMPANY_CONFIG);
  const [bookings, setBookings] = useState<BookingAppointment[]>([]);
  const [inquiries, setInquiries] = useState<ClientInquiry[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeEmailNotice, setActiveEmailNotice] = useState<EmailNotificationPayload | null>(null);
  const [adminTheme, setAdminTheme] = useState<'light' | 'dark'>('light');
  const adminDataLoaded = useRef(false);
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>({
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
    bucketName: getSupabaseStorageBucket(),
    connected: false,
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setDataError(null);
    if (!isSupabaseConfigured()) {
      setDataError('Supabase is not configured. Set the required environment variables.');
      setIsLoading(false);
      return;
    }

    try {
      const supabase = getSupabaseClient();
      const [projectResult, faqResult, testimonialResult, companyResult] = await Promise.all([
        supabase.from('projects').select('*').eq('published', true).order('created_at', { ascending: false }),
        supabase.from('faqs').select('*').eq('published', true).order('display_order', { ascending: true }),
        supabase.from('testimonials').select('*').eq('approved', true).eq('published', true).order('created_at', { ascending: false }),
        supabase.from('business_settings').select('*').eq('id', true).maybeSingle(),
      ]);

      const errors = [
        projectResult.error && describeSupabaseError(projectResult.error, 'Projects'),
        faqResult.error && describeSupabaseError(faqResult.error, 'FAQs'),
        testimonialResult.error && describeSupabaseError(testimonialResult.error, 'Testimonials'),
        companyResult.error && describeSupabaseError(companyResult.error, 'Business settings'),
      ].filter(Boolean);
      if (errors.length > 0) setDataError(errors.join(' '));

      const databaseProjects = projectResult.error
        ? []
        : (projectResult.data || []).map((row) => mapProject(row as Record<string, unknown>));
      setProjects(databaseProjects);
      setFaqs(faqResult.error ? [] : (faqResult.data || []).map((row) => mapFaq(row as Record<string, unknown>)));
      setTestimonials(testimonialResult.error ? [] : (testimonialResult.data || []).map((row) => mapTestimonial(row as Record<string, unknown>)));
      if (!companyResult.error && companyResult.data) {
        const row = companyResult.data as Record<string, unknown>;
        setCompany({
          name: String(row.name || INITIAL_COMPANY_CONFIG.name),
          tagline: String(row.tagline || ''),
          phone: String(row.phone || ''),
          whatsappNumber: String(row.whatsapp_number || ''),
          email: String(row.email || ''),
          address: String(row.address || ''),
          googleMapsUrl: String(row.google_maps_url || ''),
          instagramUrl: String(row.instagram_url || ''),
          facebookUrl: String(row.facebook_url || ''),
          youtubeUrl: String(row.youtube_url || ''),
          officeHours: String(row.office_hours || ''),
        });
      }
      setSupabaseConfig((prev) => ({ ...prev, connected: errors.length === 0 }));
    } catch (error) {
      setProjects([]);
      setDataError(error instanceof Error ? error.message : 'Unable to load Supabase data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAdminData = useCallback(async () => {
    setDataError(null);
    setIsLoading(true);
    const supabase = getSupabaseClient();
    try {
    const [projectResult, faqResult, testimonialResult, inquiryResult, bookingResult, taskResult, companyResult] = await Promise.all([
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('faqs').select('*').order('display_order', { ascending: true }),
      supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
      supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
      supabase.from('appointments').select('*').order('date', { ascending: true }),
      supabase.from('tasks').select('*').order('due_date', { ascending: true }),
      supabase.from('business_settings').select('*').eq('id', true).maybeSingle(),
    ]);
    const moduleResults = [
      ['Projects', projectResult], ['FAQs', faqResult], ['Testimonials', testimonialResult],
      ['Enquiries', inquiryResult], ['Consultations', bookingResult], ['Tasks', taskResult],
      ['Business settings', companyResult],
    ] as const;
    const errors = moduleResults
      .filter(([, result]) => result.error)
      .map(([name, result]) => describeSupabaseError(result.error!, name));
    setDataError(errors.length > 0 ? errors.join(' ') : null);
    setSupabaseConfig((previous) => ({ ...previous, connected: errors.length === 0 }));
    setAdminProjects(projectResult.error ? [] : (projectResult.data || []).map((row) => mapProject(row as Record<string, unknown>)));
    setFaqs(faqResult.error ? [] : (faqResult.data || []).map((row) => mapFaq(row as Record<string, unknown>)));
    setTestimonials(testimonialResult.error ? [] : (testimonialResult.data || []).map((row) => mapTestimonial(row as Record<string, unknown>)));
    setInquiries(inquiryResult.error ? [] : (inquiryResult.data || []).map((row) => mapInquiry(row as Record<string, unknown>)));
    setBookings(bookingResult.error ? [] : (bookingResult.data || []).map((row) => mapBooking(row as Record<string, unknown>)));
    setTasks(taskResult.error ? [] : (taskResult.data || []).map((row) => mapTask(row as Record<string, unknown>)));
    if (!companyResult.error && companyResult.data) {
      const row = companyResult.data as Record<string, unknown>;
      setCompany((previous) => ({
        ...previous,
        name: String(row.name || previous.name),
        tagline: String(row.tagline || previous.tagline),
        phone: String(row.phone || ''),
        whatsappNumber: String(row.whatsapp_number || ''),
        email: String(row.email || ''),
        address: String(row.address || ''),
        googleMapsUrl: String(row.google_maps_url || ''),
        instagramUrl: String(row.instagram_url || ''),
        facebookUrl: String(row.facebook_url || ''),
        youtubeUrl: String(row.youtube_url || ''),
        officeHours: String(row.office_hours || ''),
      }));
    }
    // Only mark as loaded when every database query succeeds.
    adminDataLoaded.current = errors.length === 0;
    } catch (error) {
      adminDataLoaded.current = false;
      setDataError(error instanceof Error ? error.message : 'Unable to load administrator data.');
      setSupabaseConfig((previous) => ({ ...previous, connected: false }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  const loadAdminProfile = useCallback(async (userId: string): Promise<AdminProfile> => {
    const supabase = getSupabaseClient();
    const [roleResult, superAdminResult, profileResult] = await Promise.all([
      supabase.from('admin_roles').select('user_id, role').eq('user_id', userId).maybeSingle(),
      supabase.rpc('is_regalien_super_admin'),
      supabase.from('admin_profiles').select('user_id, display_name, designation').eq('user_id', userId).maybeSingle(),
    ]);
    if (roleResult.error) throw new Error(`Unable to verify administrator access: ${roleResult.error.message}`);
    if (superAdminResult.error) throw new Error(`Unable to verify administrator access: ${superAdminResult.error.message}`);
    if (profileResult.error && profileResult.error.code !== '42P01') {
      throw new Error(`Unable to load administrator profile: ${profileResult.error.message}`);
    }

    const rawRole = typeof roleResult.data?.role === 'string' ? roleResult.data.role : '';
    const isSuperAdmin = superAdminResult.data === true;
    const knownRoles: AdminRole[] = ['super_admin', 'admin', 'project_manager', 'enquiry_manager', 'content_manager'];
    const role = isSuperAdmin ? 'super_admin' : knownRoles.includes(rawRole as AdminRole) ? rawRole as AdminRole : null;
    const isAuthorized = isSuperAdmin || role !== null;
    const profile: AdminProfile = {
      userId,
      role,
      isActive: isAuthorized,
      isAuthorized,
      displayName: profileResult.data?.display_name || undefined,
      designation: profileResult.data?.designation || undefined,
    };
    setAdminProfile(profile);
    return profile;
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setAuthLoading(false);
      return;
    }
    const supabase = getSupabaseClient();
    let active = true;
    void supabase.auth.getUser().then(async ({ data, error }) => {
      if (!active) return;
      if (error && error.message !== 'Auth session missing!') setAuthError('Unable to verify your session.');
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email });
        try {
          const profile = await loadAdminProfile(data.user.id);
          if (profile.isAuthorized) await loadAdminData();
        } catch (profileError) {
          setAuthError(profileError instanceof Error ? profileError.message : 'Unable to verify administrator access.');
        }
      }
      setAuthLoading(false);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user;
      setUser(nextUser ? { id: nextUser.id, email: nextUser.email } : null);
      if (!nextUser) setAdminProfile(null);
    });
    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [loadAdminData, loadAdminProfile]);

  const signIn = async (email: string, password: string) => {
    setAuthError(null);
    const { data, error } = await getSupabaseClient().auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      setAuthError('Unable to sign in with those credentials.');
      throw new Error('Unable to sign in with those credentials.');
    }
    try {
      const profile = await loadAdminProfile(data.user.id);
      if (!profile.isAuthorized) {
        throw new Error('You are not authorized to access the administrator portal.');
      }

      // Load admin dashboard data immediately after successful authentication.
      await loadAdminData();
    } catch (error) {
      await getSupabaseClient().auth.signOut();
      setUser(null);
      setAdminProfile(null);
      adminDataLoaded.current = false;
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await getSupabaseClient().auth.signOut();
    if (error) throw new Error(`Unable to sign out: ${error.message}`);
    setUser(null);
    setAdminProfile(null);
    adminDataLoaded.current = false;
  };

  const sendPasswordReset = async (email: string) => {
    const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin`,
    });
    if (error) throw new Error('Unable to send the password reset email.');
  };

  const addInquiry = async (data: Omit<ClientInquiry, 'id' | 'createdAt' | 'status'>) => {
    const { data: row, error } = await getSupabaseClient().from('inquiries').insert({
      name: data.name, email: data.email, phone: data.phone, project_scope: data.projectScope,
      property_type: data.propertyType, estimated_sq_ft: data.estimatedSqFt, location: data.location,
      target_timeline: data.targetTimeline, message: data.message, budget_range: data.budgetRange,
    }).select('*').single();
    if (error) throwDatabaseError(error);
    if (!row) throw new Error('Supabase did not return the created inquiry.');
    const created: ClientInquiry = {
      ...data, id: String(row.id), status: 'New', createdAt: String(row.created_at),
    };
    setInquiries((items) => [created, ...items]);
    return created;
  };

  const addBooking = async (data: Omit<BookingAppointment, 'id' | 'createdAt' | 'status' | 'googleCalendarEventUrl'>) => {
    const googleCalendarEventUrl = createGoogleCalendarUrl(data, company);
    const { data: row, error } = await getSupabaseClient().from('appointments').insert({
      client_name: data.clientName, client_email: data.clientEmail, client_phone: data.clientPhone,
      consultation_type: data.consultationType, date: data.date, time_slot: data.timeSlot,
      project_type: data.projectType, estimated_sq_ft: data.estimatedSqFt ?? null, budget: data.budget ?? null,
      notes: data.notes ?? null, google_calendar_event_url: googleCalendarEventUrl,
    }).select('*').single();
    if (error) throwDatabaseError(error);
    if (!row) throw new Error('Supabase did not return the created appointment.');
    const created = {
      ...data, id: String(row.id), status: String(row.status) as BookingAppointment['status'],
      createdAt: String(row.created_at), googleCalendarEventUrl,
    };
    setBookings((items) => [...items, created]);
    return created;
  };

  const updateBookingStatus = async (id: string, status: BookingAppointment['status']) => {
    const { data, error } = await getSupabaseClient().from('appointments').update({ status }).eq('id', requireUuid(id, 'Appointment')).select('*').single();
    if (error) throwDatabaseError(error);
    if (!data) throw new Error('Supabase did not return the updated appointment.');
    setBookings((items) => items.map((item) => item.id === id ? mapBooking(data as Record<string, unknown>) : item));
  };

  const deleteBooking = async (id: string) => {
    const { error } = await getSupabaseClient().from('appointments').delete().eq('id', requireUuid(id, 'Appointment'));
    if (error) throwDatabaseError(error);
    setBookings((items) => items.filter((item) => item.id !== id));
  };

  const updateInquiryStatus = async (id: string, status: ClientInquiry['status'], notes?: string) => {
    const { data, error } = await getSupabaseClient().from('inquiries').update({ status, ...(notes === undefined ? {} : { notes }) }).eq('id', requireUuid(id, 'Inquiry')).select('*').single();
    if (error) throwDatabaseError(error);
    if (!data) throw new Error('Supabase did not return the updated inquiry.');
    setInquiries((items) => items.map((item) => item.id === id ? mapInquiry(data as Record<string, unknown>) : item));
  };

  const deleteInquiry = async (id: string) => {
    const { error } = await getSupabaseClient().from('inquiries').delete().eq('id', requireUuid(id, 'Inquiry'));
    if (error) throwDatabaseError(error);
    setInquiries((items) => items.filter((item) => item.id !== id));
  };

  const toProjectRow = (project: Partial<Project>): Database['public']['Tables']['projects']['Update'] => {
    const row: Record<string, unknown> = {
      title: project.title, category: project.category, location: project.location, year: project.year,
      area_sq_ft: project.areaSqFt, client: project.client, description: project.description,
      materials: project.materials, features: project.features, cover_image: project.coverImage,
      gallery: project.gallery, videos: project.videos, featured: project.featured,
      published: project.published, completion_weeks: project.completionWeeks,
      before_after: project.beforeAfter,
    };
    return Object.fromEntries(Object.entries(row).filter(([, value]) => value !== undefined)) as Database['public']['Tables']['projects']['Update'];
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    const slug = project.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `project-${Date.now()}`;
    const { data, error } = await getSupabaseClient().from('projects').insert({ ...toProjectRow(project), slug } as Database['public']['Tables']['projects']['Insert']).select('*').single();
    if (error) throwDatabaseError(error);
    if (!data) throw new Error('Supabase did not return the created project.');
    const created = mapProject(data as Record<string, unknown>);
    setAdminProjects((items) => [created, ...items]);
    if (created.published) setProjects((items) => [created, ...items]);
  };

  const updateProject = async (id: string, updated: Partial<Project>) => {
    const { data, error } = await getSupabaseClient().from('projects').update(toProjectRow(updated)).eq('id', requireUuid(id, 'Project')).select('*').single();
    if (error) throwDatabaseError(error);
    if (!data) throw new Error('Supabase did not return the updated project.');
    const updatedProject = mapProject(data as Record<string, unknown>);
    setAdminProjects((items) => items.map((item) => item.id === id ? updatedProject : item));
    setProjects((items) => updatedProject.published
      ? items.some((item) => item.id === id)
        ? items.map((item) => item.id === id ? updatedProject : item)
        : [updatedProject, ...items]
      : items.filter((item) => item.id !== id));
  };

  const uploadProjectAsset = async (projectId: string, file: File): Promise<string> => {
    const projectUuid = requireUuid(projectId, 'Project');
    if (!file.type.startsWith('image/')) throw new Error('Only image files can be uploaded.');
    if (file.size > 25 * 1024 * 1024) throw new Error('Images must be 25 MB or smaller.');

    const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const objectPath = `${projectUuid}/${crypto.randomUUID()}.${extension}`;
    const bucket = getSupabaseStorageBucket();
    const { error: uploadError } = await getSupabaseClient().storage.from(bucket).upload(objectPath, file, {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    });
    if (uploadError) throwDatabaseError(uploadError, 'Project media upload');

    const { data } = getSupabaseClient().storage.from(bucket).getPublicUrl(objectPath);
    if (!data.publicUrl) throw new Error('Supabase did not return a public media URL.');

    const project = adminProjects.find((item) => item.id === projectUuid);
    if (!project) {
      await getSupabaseClient().storage.from(bucket).remove([objectPath]);
      throw new Error('Project not found. Refresh the projects list and try again.');
    }
    try {
      await updateProject(projectUuid, { gallery: [...new Set([...project.gallery, data.publicUrl])] });
    } catch (error) {
      await getSupabaseClient().storage.from(bucket).remove([objectPath]);
      throw error;
    }
    return data.publicUrl;
  };

  const deleteProjectAsset = async (projectId: string, assetUrl: string): Promise<void> => {
    const projectUuid = requireUuid(projectId, 'Project');
    const project = adminProjects.find((item) => item.id === projectUuid);
    if (!project) throw new Error('Project not found. Refresh the projects list and try again.');
    if (!assetUrl.includes(`/storage/v1/object/public/${getSupabaseStorageBucket()}/`)) {
      throw new Error('Only media uploaded to the configured project bucket can be deleted here.');
    }

    const path = assetUrl.split(`/storage/v1/object/public/${getSupabaseStorageBucket()}/`)[1];
    if (!path) throw new Error('The project media path is invalid.');
    const { error } = await getSupabaseClient().storage.from(getSupabaseStorageBucket()).remove([path]);
    if (error) throwDatabaseError(error, 'Project media deletion');
    await updateProject(projectUuid, {
      gallery: project.gallery.filter((image) => image !== assetUrl),
      ...(project.coverImage === assetUrl ? { coverImage: project.gallery.find((image) => image !== assetUrl) || '' } : {}),
    });
  };

  const deleteProject = async (id: string) => {
    const { error } = await getSupabaseClient().from('projects').delete().eq('id', requireUuid(id, 'Project'));
    if (error) throwDatabaseError(error);
    setAdminProjects((items) => items.filter((item) => item.id !== id));
    setProjects((items) => items.filter((item) => item.id !== id));
  };

  const toggleProjectPublish = async (id: string) => {
    const project = adminProjects.find((item) => item.id === id);
    if (!project) throw new Error('Project not found.');
    await updateProject(id, { published: !project.published });
  };

  const updateCompany = async (config: Partial<CompanyConfig>) => {
    const row = {
      name: config.name ?? company.name, tagline: config.tagline ?? company.tagline,
      phone: config.phone ?? company.phone, whatsapp_number: config.whatsappNumber ?? company.whatsappNumber,
      email: config.email ?? company.email, address: config.address ?? company.address,
      google_maps_url: config.googleMapsUrl ?? company.googleMapsUrl,
      instagram_url: config.instagramUrl ?? company.instagramUrl, facebook_url: config.facebookUrl ?? company.facebookUrl,
      youtube_url: config.youtubeUrl ?? company.youtubeUrl, office_hours: config.officeHours ?? company.officeHours,
    };
    const { data, error } = await getSupabaseClient().from('business_settings').upsert({ id: true, ...row }).select('*').single();
    if (error) throwDatabaseError(error);
    if (!data) throw new Error('Supabase did not return the updated business settings.');
    setCompany({
      name: String(data.name), tagline: String(data.tagline), phone: String(data.phone),
      whatsappNumber: String(data.whatsapp_number), email: String(data.email), address: String(data.address),
      googleMapsUrl: String(data.google_maps_url), instagramUrl: String(data.instagram_url),
      facebookUrl: String(data.facebook_url), youtubeUrl: String(data.youtube_url), officeHours: String(data.office_hours),
    });
  };

  const addFaq = async (faq: Omit<FaqItem, 'id' | 'order'>) => {
    const { data, error } = await getSupabaseClient().from('faqs').insert({
      category: faq.category, question: faq.question, answer: faq.answer, highlight: faq.highlight || null, display_order: faqs.length, published: false,
    }).select('*').single();
    if (error) throwDatabaseError(error);
    if (!data) throw new Error('Supabase did not return the created FAQ.');
    setFaqs((items) => [...items, mapFaq(data as Record<string, unknown>)]);
  };

  const updateFaq = async (id: string, updated: Partial<FaqItem>) => {
    const { data, error } = await getSupabaseClient().from('faqs').update({
      category: updated.category, question: updated.question, answer: updated.answer,
      highlight: updated.highlight || null, display_order: updated.order,
    }).eq('id', requireUuid(id, 'FAQ')).select('*').single();
    if (error) throwDatabaseError(error);
    if (!data) throw new Error('Supabase did not return the updated FAQ.');
    setFaqs((items) => items.map((item) => item.id === id ? mapFaq(data as Record<string, unknown>) : item));
  };

  const deleteFaq = async (id: string) => {
    const { error } = await getSupabaseClient().from('faqs').delete().eq('id', requireUuid(id, 'FAQ'));
    if (error) throwDatabaseError(error);
    setFaqs((items) => items.filter((item) => item.id !== id));
  };

  const addTestimonial = async (testimonial: Omit<Testimonial, 'id'>) => {
    const { data, error } = await getSupabaseClient().from('testimonials').insert({
      client_name: testimonial.clientName, role: testimonial.role, project: testimonial.project,
      location: testimonial.location, rating: testimonial.rating, quote: testimonial.quote,
      outcome: testimonial.outcome, avatar_url: testimonial.avatarUrl || null, year: testimonial.year,
      approved: false, published: false,
    }).select('*').single();
    if (error) throwDatabaseError(error);
    if (!data) throw new Error('Supabase did not return the created testimonial.');
    setTestimonials((items) => [...items, mapTestimonial(data as Record<string, unknown>)]);
  };

  const updateTestimonial = async (id: string, updated: Partial<Testimonial>) => {
    const row: Database['public']['Tables']['testimonials']['Update'] = {};
    if (updated.clientName !== undefined) row.client_name = updated.clientName;
    if (updated.role !== undefined) row.role = updated.role;
    if (updated.project !== undefined) row.project = updated.project;
    if (updated.location !== undefined) row.location = updated.location;
    if (updated.rating !== undefined) row.rating = updated.rating;
    if (updated.quote !== undefined) row.quote = updated.quote;
    if (updated.outcome !== undefined) row.outcome = updated.outcome;
    if (updated.avatarUrl !== undefined) row.avatar_url = updated.avatarUrl || null;
    if (updated.year !== undefined) row.year = updated.year;
    const { data, error } = await getSupabaseClient().from('testimonials').update(row).eq('id', requireUuid(id, 'Testimonial')).select('*').single();
    if (error) throwDatabaseError(error);
    if (!data) throw new Error('Supabase did not return the updated testimonial.');
    setTestimonials((items) => items.map((item) => item.id === id ? mapTestimonial(data as Record<string, unknown>) : item));
  };

  const deleteTestimonial = async (id: string) => {
    const { error } = await getSupabaseClient().from('testimonials').delete().eq('id', requireUuid(id, 'Testimonial'));
    if (error) throwDatabaseError(error);
    setTestimonials((items) => items.filter((item) => item.id !== id));
  };

  const addTask = async (task: Omit<TaskItem, 'id' | 'completed'>) => {
    if (!user) throw new Error('You must be signed in to create a task.');
    let relatedProjectId: string | null = null;
    const projectReference = task.relatedProjectId || task.relatedProject || '';
    if (projectReference.trim()) {
      if (isUuid(projectReference)) {
        relatedProjectId = projectReference;
      } else {
        const { data: project, error: projectError } = await getSupabaseClient()
          .from('projects')
          .select('id')
          .eq('slug', projectReference.trim())
          .maybeSingle();
        if (projectError) throwDatabaseError(projectError);
        if (!project?.id) {
          throw new Error(`Project "${projectReference}" was not found. Select a saved project instead of a local project key.`);
        }
        relatedProjectId = requireUuid(project.id, 'Project');
      }
    }
    const { data, error } = await getSupabaseClient().from('tasks').insert({
      title: task.title, description: task.description || '', assigned_to: task.assignedTo || null,
      created_by: requireUuid(user.id, 'Administrator'), related_project_id: relatedProjectId, related_inquiry_id: null,
      priority: task.priority, status: task.status || 'pending', due_date: task.dueDate || null,
    }).select('*').single();
    if (error) throwDatabaseError(error);
    if (!data) throw new Error('Supabase did not return the created task.');
    setTasks((items) => [...items, mapTask(data as Record<string, unknown>)]);
  };

  const toggleTaskCompleted = async (id: string) => {
    const task = tasks.find((item) => item.id === id);
    if (!task) throw new Error('Task not found.');
    const { data, error } = await getSupabaseClient().from('tasks').update({ status: task.completed ? 'pending' : 'completed' }).eq('id', requireUuid(id, 'Task')).select('*').single();
    if (error) throwDatabaseError(error);
    if (!data) throw new Error('Supabase did not return the updated task.');
    setTasks((items) => items.map((item) => item.id === id ? mapTask(data as Record<string, unknown>) : item));
  };

  const deleteTask = async (id: string) => {
    const { error } = await getSupabaseClient().from('tasks').delete().eq('id', requireUuid(id, 'Task'));
    if (error) throwDatabaseError(error);
    setTasks((items) => items.filter((item) => item.id !== id));
  };

  const updateAdminProfile = async (displayName: string, designation: string) => {
    if (!user || !adminProfile?.isAuthorized) throw new Error('Administrator access is required.');
    const { data, error } = await getSupabaseClient().from('admin_profiles')
      .upsert({ user_id: user.id, display_name: displayName.trim(), designation: designation.trim() })
      .select('user_id, display_name, designation')
      .single();
    if (error) throwDatabaseError(error);
    if (!data) throw new Error('Supabase did not return the updated administrator profile.');
    setAdminProfile((previous) => previous ? {
      ...previous,
      displayName: data.display_name,
      designation: data.designation,
    } : previous);
  };

  const contextValue: AppContextType = {
    projects, adminProjects, testimonials, company, bookings, inquiries, selectedProject, setSelectedProject,
    isAdminOpen, setIsAdminOpen, activeEmailNotice, setActiveEmailNotice, addBooking,
    updateBookingStatus, deleteBooking, addInquiry,
    updateInquiryStatus, deleteInquiry, addProject,
    updateProject, deleteProject, uploadProjectAsset, deleteProjectAsset, updateCompany,
    addTestimonial, deleteTestimonial, updateTestimonial,
    exportInquiriesCsv: () => {
      const csv = ['ID,Date,Name,Email,Phone,Status', ...inquiries.map((item) =>
        [item.id, item.createdAt, item.name, item.email, item.phone, item.status].join(',')
      )].join('\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `regalien_inquiries_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    },
    resetToDefaults: () => {
      if (adminProfile?.isAuthorized) {
        void loadAdminData();
      } else {
        void loadData();
      }
    },
    faqs, addFaq, updateFaq, deleteFaq,
    tasks, addTask, toggleTaskCompleted, deleteTask,
    supabaseConfig, updateSupabaseConfig: (config) => setSupabaseConfig((prev) => ({ ...prev, ...config })),
    toggleProjectPublish, adminTheme, toggleAdminTheme: () => setAdminTheme((prev) => prev === 'light' ? 'dark' : 'light'),
    isLoading, dataError, simulateRefresh: () => { void loadData(); },
    authLoading, authError, user, adminProfile, signIn, signOut, sendPasswordReset, updateAdminProfile,
    isOverlayActive, setIsOverlayActive,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
