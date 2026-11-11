import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, Testimonial, CompanyConfig, BookingAppointment, ClientInquiry, FaqItem, TaskItem, SupabaseConfig } from '../types';
import { INITIAL_COMPANY_CONFIG, INITIAL_PROJECTS, INITIAL_TESTIMONIALS, INITIAL_BOOKINGS, INITIAL_INQUIRIES, INITIAL_FAQS, INITIAL_TASKS, INITIAL_SUPABASE_CONFIG } from '../data/initialData';
import { createGoogleCalendarUrl } from '../utils/calendar';

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
  // Actions
  addBooking: (booking: Omit<BookingAppointment, 'id' | 'createdAt' | 'status' | 'googleCalendarEventUrl'>) => BookingAppointment;
  updateBookingStatus: (id: string, status: BookingAppointment['status']) => void;
  deleteBooking: (id: string) => void;
  addInquiry: (inquiry: Omit<ClientInquiry, 'id' | 'createdAt' | 'status'>) => ClientInquiry;
  updateInquiryStatus: (id: string, status: ClientInquiry['status'], notes?: string) => void;
  deleteInquiry: (id: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updated: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  updateCompany: (config: Partial<CompanyConfig>) => void;
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void;
  deleteTestimonial: (id: string) => void;
  updateTestimonial: (id: string, updated: Partial<Testimonial>) => void;
  exportInquiriesCsv: () => void;
  resetToDefaults: () => void;
  // FAQs
  faqs: FaqItem[];
  addFaq: (faq: Omit<FaqItem, 'id' | 'order'>) => void;
  updateFaq: (id: string, updated: Partial<FaqItem>) => void;
  deleteFaq: (id: string) => void;
  // Tasks
  tasks: TaskItem[];
  addTask: (task: Omit<TaskItem, 'id' | 'completed'>) => void;
  toggleTaskCompleted: (id: string) => void;
  deleteTask: (id: string) => void;
  // Supabase
  supabaseConfig: SupabaseConfig;
  updateSupabaseConfig: (config: Partial<SupabaseConfig>) => void;
  // Publishing
  toggleProjectPublish: (id: string) => void;
  // Admin Theme
  adminTheme: 'light' | 'dark';
  toggleAdminTheme: () => void;
  // Loading state for skeletons
  isLoading: boolean;
  simulateRefresh: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage state initialization
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('regalien_projects_v1');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('regalien_testimonials_v1');
    return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  const [company, setCompany] = useState<CompanyConfig>(() => {
    const saved = localStorage.getItem('regalien_company_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_COMPANY_CONFIG,
          ...parsed,
          phone: '+91 8981441040',
          whatsappNumber: '918981441040',
        };
      } catch {
        return INITIAL_COMPANY_CONFIG;
      }
    }
    return INITIAL_COMPANY_CONFIG;
  });

  const [bookings, setBookings] = useState<BookingAppointment[]>(() => {
    const saved = localStorage.getItem('regalien_bookings_v1');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [inquiries, setInquiries] = useState<ClientInquiry[]>(() => {
    const saved = localStorage.getItem('regalien_inquiries_v1');
    return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
  });

  const [faqs, setFaqs] = useState<FaqItem[]>(() => {
    const saved = localStorage.getItem('regalien_faqs_v1');
    return saved ? JSON.parse(saved) : INITIAL_FAQS;
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('regalien_tasks_v1');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() => {
    const saved = localStorage.getItem('regalien_supabase_v1');
    return saved ? JSON.parse(saved) : INITIAL_SUPABASE_CONFIG;
  });

  const [adminTheme, setAdminTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('regalien_admin_theme_v1');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  // Initial data loading simulation for skeleton screens
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const simulateRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 700);
  };

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeEmailNotice, setActiveEmailNotice] = useState<EmailNotificationPayload | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('regalien_projects_v1', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('regalien_testimonials_v1', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('regalien_company_v1', JSON.stringify(company));
  }, [company]);

  useEffect(() => {
    localStorage.setItem('regalien_bookings_v1', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('regalien_inquiries_v1', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('regalien_faqs_v1', JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem('regalien_tasks_v1', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('regalien_supabase_v1', JSON.stringify(supabaseConfig));
  }, [supabaseConfig]);

  useEffect(() => {
    localStorage.setItem('regalien_admin_theme_v1', adminTheme);
  }, [adminTheme]);

  // Actions
  const addBooking = (bookingData: Omit<BookingAppointment, 'id' | 'createdAt' | 'status' | 'googleCalendarEventUrl'>): BookingAppointment => {
    const googleCalendarEventUrl = createGoogleCalendarUrl(bookingData, company);
    const newBooking: BookingAppointment = {
      ...bookingData,
      id: `book-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      googleCalendarEventUrl,
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Dispatch automated confirmation email notification preview
    setActiveEmailNotice({
      to: newBooking.clientEmail,
      recipientName: newBooking.clientName,
      subject: `Confirmed: Interior Architecture Consultation with Regalien (${newBooking.date} at ${newBooking.timeSlot})`,
      type: 'Booking Confirmation',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      summary: `Your appointment for ${newBooking.consultationType} has been scheduled. Google Calendar sync link attached.`,
      details: {
        'Consultation Format': newBooking.consultationType,
        'Date & Time': `${newBooking.date} at ${newBooking.timeSlot}`,
        'Project Scope': newBooking.projectType,
        'Studio Address': company.address,
        'Dedicated Architect Line': company.phone,
      },
      calendarUrl: googleCalendarEventUrl,
    });

    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingAppointment['status']) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const addInquiry = (inquiryData: Omit<ClientInquiry, 'id' | 'createdAt' | 'status'>): ClientInquiry => {
    const newInquiry: ClientInquiry = {
      ...inquiryData,
      id: `inq-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: 'New',
    };

    setInquiries((prev) => [newInquiry, ...prev]);

    // Trigger automated email dispatch notice
    setActiveEmailNotice({
      to: newInquiry.email,
      recipientName: newInquiry.name,
      subject: `Inquiry Received: Regalien Infrastructure Pvt Ltd (#${newInquiry.id.toUpperCase()})`,
      type: 'Inquiry Received',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      summary: 'Thank you for reaching out to Regalien Infrastructure. Our senior design team has received your project parameters and will contact you within 4 business hours.',
      details: {
        'Inquiry ID': newInquiry.id.toUpperCase(),
        'Property Type': newInquiry.propertyType,
        'Estimated Area': `${newInquiry.estimatedSqFt} sq.ft`,
        'Location': newInquiry.location,
        'Budget Bracket': newInquiry.budgetRange,
        'Client Contact': `${newInquiry.phone} / ${newInquiry.email}`,
      },
    });

    return newInquiry;
  };

  const updateInquiryStatus = (id: string, status: ClientInquiry['status'], notes?: string) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status, ...(notes !== undefined ? { notes } : {}) } : inq))
    );
  };

  const deleteInquiry = (id: string) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
  };

  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now().toString().slice(-5)}`,
    };
    setProjects((prev) => [newProject, ...prev]);
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const updateCompany = (config: Partial<CompanyConfig>) => {
    setCompany((prev) => ({ ...prev, ...config }));
  };

  const addTestimonial = (testData: Omit<Testimonial, 'id'>) => {
    const newTest: Testimonial = {
      ...testData,
      id: `test-${Date.now().toString().slice(-5)}`,
    };
    setTestimonials((prev) => [newTest, ...prev]);
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTestimonial = (id: string, updated: Partial<Testimonial>) => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  };

  const addFaq = (faqData: Omit<FaqItem, 'id' | 'order'>) => {
    const newFaq: FaqItem = {
      ...faqData,
      id: `faq-${Date.now().toString().slice(-5)}`,
      order: faqs.length + 1,
    };
    setFaqs((prev) => [...prev, newFaq]);
  };

  const updateFaq = (id: string, updated: Partial<FaqItem>) => {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...updated } : f)));
  };

  const deleteFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  const addTask = (taskData: Omit<TaskItem, 'id' | 'completed'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: `task-${Date.now().toString().slice(-5)}`,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTaskCompleted = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const updateSupabaseConfig = (config: Partial<SupabaseConfig>) => {
    setSupabaseConfig((prev) => ({ ...prev, ...config }));
  };

  const toggleProjectPublish = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const currentPub = p.published !== undefined ? p.published : true;
        return { ...p, published: !currentPub };
      })
    );
  };

  const toggleAdminTheme = () => {
    setAdminTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const exportInquiriesCsv = () => {
    const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Property Type', 'Area (Sq.Ft)', 'Location', 'Budget', 'Status', 'Notes'];
    const rows = inquiries.map((inq) => [
      inq.id,
      new Date(inq.createdAt).toLocaleDateString(),
      `"${inq.name.replace(/"/g, '""')}"`,
      inq.email,
      inq.phone,
      `"${inq.propertyType}"`,
      inq.estimatedSqFt,
      `"${inq.location.replace(/"/g, '""')}"`,
      `"${inq.budgetRange}"`,
      inq.status,
      `"${(inq.notes || inq.message).replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `regalien_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetToDefaults = () => {
    localStorage.removeItem('regalien_projects_v1');
    localStorage.removeItem('regalien_testimonials_v1');
    localStorage.removeItem('regalien_company_v1');
    localStorage.removeItem('regalien_bookings_v1');
    localStorage.removeItem('regalien_inquiries_v1');
    localStorage.removeItem('regalien_faqs_v1');
    localStorage.removeItem('regalien_tasks_v1');
    localStorage.removeItem('regalien_supabase_v1');
    setProjects(INITIAL_PROJECTS);
    setTestimonials(INITIAL_TESTIMONIALS);
    setCompany(INITIAL_COMPANY_CONFIG);
    setBookings(INITIAL_BOOKINGS);
    setInquiries(INITIAL_INQUIRIES);
    setFaqs(INITIAL_FAQS);
    setTasks(INITIAL_TASKS);
    setSupabaseConfig(INITIAL_SUPABASE_CONFIG);
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        testimonials,
        company,
        bookings,
        inquiries,
        selectedProject,
        setSelectedProject,
        isAdminOpen,
        setIsAdminOpen,
        activeEmailNotice,
        setActiveEmailNotice,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        addInquiry,
        updateInquiryStatus,
        deleteInquiry,
        addProject,
        updateProject,
        deleteProject,
        updateCompany,
        addTestimonial,
        deleteTestimonial,
        updateTestimonial,
        exportInquiriesCsv,
        resetToDefaults,
        faqs,
        addFaq,
        updateFaq,
        deleteFaq,
        tasks,
        addTask,
        toggleTaskCompleted,
        deleteTask,
        supabaseConfig,
        updateSupabaseConfig,
        toggleProjectPublish,
        adminTheme,
        toggleAdminTheme,
        isLoading,
        simulateRefresh,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
