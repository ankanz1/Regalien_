import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Project,
  ProjectCategory,
  ClientInquiry,
  BookingAppointment,
  FaqItem,
  Testimonial,
  TaskItem,
} from '../types';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Calendar,
  CheckSquare,
  Image as ImageIcon,
  Mail,
  HelpCircle,
  Star,
  Store,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Bell,
  Search,
  Menu,
  X,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  Upload,
  Download,
  Check,
  Sparkles,
  Phone,
  MessageCircle,
  ChevronRight,
  RefreshCw,
  Clock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building2,
  MapPin,
  FileText,
  Send,
  Database,
  CloudUpload,
  AlertCircle,
} from 'lucide-react';

interface AdminPortalProps {
  onClose?: () => void;
  isStandalonePage?: boolean;
}

type TabType =
  | 'dashboard'
  | 'enquiries'
  | 'projects'
  | 'consultations'
  | 'tasks'
  | 'storage'
  | 'emails'
  | 'faqs'
  | 'testimonials'
  | 'vendors'
  | 'reports'
  | 'settings';

export const AdminPortal: React.FC<AdminPortalProps> = ({ onClose, isStandalonePage = false }) => {
  const {
    adminProjects: projects,
    addProject,
    updateProject,
    uploadProjectAsset,
    deleteProjectAsset,
    deleteProject,
    toggleProjectPublish,
    inquiries,
    updateInquiryStatus,
    deleteInquiry,
    addInquiry,
    exportInquiriesCsv,
    bookings,
    updateBookingStatus,
    deleteBooking,
    addBooking,
    testimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    faqs,
    addFaq,
    updateFaq,
    deleteFaq,
    tasks,
    addTask,
    toggleTaskCompleted,
    deleteTask,
    company,
    updateCompany,
    supabaseConfig,
    updateSupabaseConfig,
    resetToDefaults,
    adminTheme,
    toggleAdminTheme,
    setIsAdminOpen,
    dataError,
    signOut,
    adminProfile,
    updateAdminProfile,
  } = useApp();

  const navigate = useNavigate();

  const handleClose = () => {
    setIsAdminOpen(false);
    if (onClose) {
      onClose();
    }
    navigate('/');
  };

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [selectedInquiryDetail, setSelectedInquiryDetail] = useState<ClientInquiry | null>(null);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isCreatingFaq, setIsCreatingFaq] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isCreatingTestimonial, setIsCreatingTestimonial] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isCreatingInquiry, setIsCreatingInquiry] = useState(false);
  const [storageProjectId, setStorageProjectId] = useState('');
  const [storageUploadError, setStorageUploadError] = useState('');
  const [storageUploading, setStorageUploading] = useState(false);

  // Close Admin on Escape key if no inner modal is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isCreatingProject) {
          setIsCreatingProject(false);
          return;
        }
        if (isCreatingInquiry) {
          setIsCreatingInquiry(false);
          return;
        }
        if (isCreatingTask) {
          setIsCreatingTask(false);
          return;
        }
        if (isCreatingFaq) {
          setIsCreatingFaq(false);
          return;
        }
        if (mobileSidebarOpen) {
          setMobileSidebarOpen(false);
          return;
        }
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCreatingProject, isCreatingInquiry, isCreatingTask, isCreatingFaq, mobileSidebarOpen, onClose]);

  // Email Notification Sandbox State
  const [emailForm, setEmailForm] = useState({
    template: 'inquiry_ack',
    recipientName: '',
    recipientEmail: '',
    subject: 'Regalien Interior — Project Consultation & Studio Reservation',
    projectScope: '',
    customNote: '',
  });
  const [emailDispatchError, setEmailDispatchError] = useState('');
  const [adminDisplayName, setAdminDisplayName] = useState('');
  const [adminDesignation, setAdminDesignation] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    setAdminDisplayName(adminProfile?.displayName || '');
    setAdminDesignation(adminProfile?.designation || '');
  }, [adminProfile?.displayName, adminProfile?.designation]);

  // New Project Form State
  const [projectForm, setProjectForm] = useState<{
    title: string;
    category: Exclude<ProjectCategory, 'All'>;
    location: string;
    year: number;
    areaSqFt: number;
    client: string;
    description: string;
    materials: string;
    features: string;
    coverImage: string;
    gallery: string;
    featured: boolean;
    published: boolean;
    completionWeeks: number;
    beforeLabel: string;
    afterLabel: string;
    beforeImage: string;
    afterImage: string;
  }>({
    title: '',
    category: 'Luxury Residential',
    location: 'Newtown Action Area II, Kolkata',
    year: 2026,
    areaSqFt: 3500,
    client: '',
    description: '',
    materials: 'Italian Marble, Slatted Oak, Burnished Brass, Bouclé Fabric',
    features: 'Acoustic Ceilings, Architectural Lighting, Motorized Hardware, Custom Joinery',
    coverImage: projects[0]?.coverImage || '',
    gallery: projects[0]?.gallery.join('\n') || '',
    featured: true,
    published: true,
    completionWeeks: 14,
    beforeLabel: 'Bare Shell Handover',
    afterLabel: 'Regalien Turnkey Finish',
    beforeImage: '',
    afterImage: '',
  });

  // Local preview only; persistent media upload requires an authenticated storage policy.
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'cover' | 'gallery' | 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (field === 'cover') {
        setProjectForm((prev) => ({ ...prev, coverImage: result }));
      } else if (field === 'before') {
        setProjectForm((prev) => ({ ...prev, beforeImage: result }));
      } else if (field === 'after') {
        setProjectForm((prev) => ({ ...prev, afterImage: result }));
      } else if (field === 'gallery') {
        setProjectForm((prev) => ({
          ...prev,
          gallery: prev.gallery ? `${prev.gallery}\n${result}` : result,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Open Edit Project
  const handleStartEditProject = (proj: Project) => {
    setEditingProject(proj);
    setProjectForm({
      title: proj.title,
      category: proj.category,
      location: proj.location,
      year: proj.year,
      areaSqFt: proj.areaSqFt,
      client: proj.client,
      description: proj.description,
      materials: proj.materials.join(', '),
      features: proj.features.join(', '),
      coverImage: proj.coverImage,
      gallery: proj.gallery.join('\n'),
      featured: proj.featured,
      published: proj.published !== false,
      completionWeeks: proj.completionWeeks,
      beforeLabel: proj.beforeAfter?.beforeLabel || 'Bare Shell',
      afterLabel: proj.beforeAfter?.afterLabel || 'Regalien Finish',
      beforeImage: proj.beforeAfter?.beforeImage || '',
      afterImage: proj.beforeAfter?.afterImage || '',
    });
    setIsCreatingProject(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title.trim()) return;

    const matList = projectForm.materials.split(',').map((m) => m.trim()).filter(Boolean);
    const featList = projectForm.features.split(',').map((f) => f.trim()).filter(Boolean);
    const galleryList = projectForm.gallery.split('\n').map((g) => g.trim()).filter(Boolean);

    const projectPayload: Omit<Project, 'id'> = {
      title: projectForm.title,
      category: projectForm.category,
      location: projectForm.location,
      year: Number(projectForm.year) || 2026,
      areaSqFt: Number(projectForm.areaSqFt) || 3000,
      client: projectForm.client || 'Private Commission',
      description: projectForm.description || 'Bespoke turnkey architecture crafted with imported materials.',
      materials: matList.length > 0 ? matList : ['Italian Marble', 'Fluted Oak'],
      features: featList.length > 0 ? featList : ['Custom Joinery', 'Architectural Lighting'],
      coverImage: projectForm.coverImage || projects[0]?.coverImage || '',
      gallery: galleryList.length > 0 ? galleryList : [projectForm.coverImage],
      featured: projectForm.featured,
      published: projectForm.published,
      completionWeeks: Number(projectForm.completionWeeks) || 12,
      beforeAfter: projectForm.beforeImage && projectForm.afterImage ? {
        beforeLabel: projectForm.beforeLabel,
        afterLabel: projectForm.afterLabel,
        beforeImage: projectForm.beforeImage,
        afterImage: projectForm.afterImage,
      } : undefined,
    };

    try {
      if (editingProject) {
        await updateProject(editingProject.id, projectPayload);
      } else {
        await addProject(projectPayload);
      }
      setIsCreatingProject(false);
      setEditingProject(null);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to save project.');
    }
  };

  // Metrics Counters
  const metrics = useMemo(() => {
    const totalProjects = projects.length;
    const publishedProjects = projects.filter((p) => p.published !== false).length;
    const totalInquiries = inquiries.length;
    const activeLeads = inquiries.filter((i) => i.status === 'New' || i.status === 'Contacted').length;
    const totalConsultations = bookings.length;
    const upcomingConsultations = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Pending').length;
    const pendingTasks = tasks.filter((t) => !t.completed).length;

    return {
      totalProjects,
      publishedProjects,
      totalInquiries,
      activeLeads,
      totalConsultations,
      upcomingConsultations,
      pendingTasks,
    };
  }, [projects, inquiries, bookings, tasks]);

  // Color theme classes
  const isDark = adminTheme === 'dark';
  const themeBg = isDark ? 'bg-[#121214] text-[#EDEDED]' : 'bg-[#FAF8F5] text-[#1E1E1E]';
  const themeSidebar = isDark ? 'bg-[#18181B] border-[#27272A]' : 'bg-[#FFFFFF] border-[#EAE6DE]';
  const themeCard = isDark ? 'bg-[#1E1E22] border-[#2E2E34]' : 'bg-[#FFFFFF] border-[#EAE6DE] shadow-xs';
  const themeCardHover = isDark ? 'hover:border-[#D9541E]/40' : 'hover:border-[#8D5B3A]/40';
  const themeTextMuted = isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]';
  const themeHeading = isDark ? 'text-white' : 'text-[#111111]';
  const themeInput = isDark
    ? 'bg-[#18181B] border-[#2E2E34] text-white focus:border-[#D9541E]'
    : 'bg-[#F9F7F4] border-[#E5E0D8] text-[#111111] focus:border-[#8D5B3A]';

  // Navigation Items matching image_4ec97503.png
  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: number; isComingSoon?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'enquiries', label: 'Clients / Enquiries', icon: Users, badge: inquiries.filter((i) => i.status === 'New').length },
    { id: 'projects', label: 'Projects', icon: FolderKanban, badge: projects.length },
    { id: 'consultations', label: 'Consultations', icon: Calendar, badge: metrics.upcomingConsultations },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: metrics.pendingTasks },
    { id: 'storage', label: 'Gallery & Storage', icon: ImageIcon },
    { id: 'emails', label: 'Automated Emails', icon: Mail },
    { id: 'faqs', label: 'FAQ Management', icon: HelpCircle },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'vendors', label: 'Vendors', icon: Store, isComingSoon: true },
    { id: 'reports', label: 'Reports', icon: BarChart3, isComingSoon: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div
      id="admin-portal-root"
      data-lenis-prevent="true"
      className={`h-screen max-h-screen w-full ${themeBg} flex font-sans antialiased overflow-hidden select-text`}
      style={{ overscrollBehavior: 'contain' }}
    >
      {/* -------------------- SIDEBAR -------------------- */}
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col w-64 shrink-0 h-full max-h-screen ${themeSidebar} border-r transition-colors duration-200 select-none z-30 overflow-hidden`}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center gap-3 border-b border-inherit">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8D5B3A] to-[#6E4226] p-1.5 flex items-center justify-center shadow-sm shrink-0">
            <img
              src="/brand/regalien-emblem.png"
              alt="Regalien Logo"
              className="w-full h-full object-contain filter brightness-110 drop-shadow"
            />
          </div>
          <div>
            <h1 className="font-serif text-base font-bold tracking-tight leading-none text-[#8D5B3A] dark:text-[#D9541E]">
              Regalien Studio
            </h1>
            <p className={`text-[10px] uppercase font-mono tracking-wider ${themeTextMuted} mt-0.5`}>
              Interior CRM
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav
          data-lenis-prevent="true"
          className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar"
          style={{ overscrollBehavior: 'contain' }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#8D5B3A] text-white shadow-xs font-semibold'
                    : isDark
                    ? 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                    : 'text-[#4B5563] hover:bg-[#F3EFEA] hover:text-[#111111]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'opacity-80'}`} />
                  <span>{item.label}</span>
                </div>

                {item.isComingSoon ? (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#F3EEE3] dark:bg-neutral-800 text-[#111111] dark:text-white">
                    Soon
                  </span>
                ) : item.badge && item.badge > 0 ? (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#D9541E]/15 text-[#D9541E]'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="p-3 border-t border-inherit">
          <div className={`p-3 rounded-xl flex items-center justify-between ${isDark ? 'bg-neutral-800/50' : 'bg-[#F6F2EC]'}`}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#8D5B3A] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                D
              </div>
              <div>
                <p className={`text-xs font-semibold ${themeHeading} leading-none`}>
                  Senior Designer
                </p>
                <p className={`text-[10px] ${themeTextMuted} mt-0.5`}>
                  Astra Towers Studio
                </p>
              </div>
            </div>

            <button
              onClick={toggleAdminTheme}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                isDark ? 'text-amber-400 hover:bg-neutral-700' : 'text-neutral-600 hover:bg-white'
              }`}
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className={`w-full mt-2.5 py-2 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer border ${
              isDark
                ? 'text-neutral-300 hover:text-white hover:bg-[#D9541E] border-neutral-700'
                : 'text-neutral-700 hover:text-white hover:bg-[#8D5B3A] border-neutral-300'
            }`}
            title="Return to Public Website"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit to Website</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside
            data-lenis-prevent="true"
            className={`relative w-72 max-w-[80vw] ${themeSidebar} flex flex-col h-full shadow-2xl z-10 overflow-hidden`}
          >
            <div className="p-5 flex items-center justify-between border-b border-inherit">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#8D5B3A] p-1 flex items-center justify-center">
                  <img src="/brand/regalien-emblem.png" alt="Regalien Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="font-serif text-sm font-bold text-[#8D5B3A]">Regalien Studio</h2>
                  <p className="text-[10px] font-mono text-neutral-500">Interior CRM</p>
                </div>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-md text-neutral-500 hover:text-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav
              data-lenis-prevent="true"
              className="flex-1 p-3 space-y-1 overflow-y-auto"
              style={{ overscrollBehavior: 'contain' }}
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#8D5B3A] text-white font-semibold'
                        : isDark
                        ? 'text-neutral-300 hover:bg-neutral-800'
                        : 'text-[#4B5563] hover:bg-[#F3EFEA]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.isComingSoon && <span className="text-[9px] text-neutral-400">Soon</span>}
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-inherit">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#D9541E] text-white flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Exit to Website</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* -------------------- MAIN CONTENT WRAPPER -------------------- */}
      <div
        data-lenis-prevent="true"
        tabIndex={0}
        className="admin-scroll-container flex-1 flex flex-col min-w-0 h-full max-h-screen overflow-y-auto overflow-x-hidden outline-none"
        style={{
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Top Header Bar matching image_4ec97503.png */}
        <header
          className={`sticky top-0 z-20 px-4 sm:px-8 py-3.5 ${themeSidebar} border-b flex items-center justify-between gap-4 backdrop-blur-md`}
        >
          {/* Left: Mobile Menu Trigger & Search Bar */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-neutral-600 hover:text-neutral-900 border border-neutral-200 dark:border-neutral-700 cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Search Input Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clients, projects, tasks..."
                className={`w-full pl-9 pr-3 py-1.5 rounded-lg text-xs border ${themeInput} focus:outline-none transition-all`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Notifications, Theme Switcher, Exit button */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleAdminTheme}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setActiveTab('enquiries')}
                className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Client Notifications"
              >
                <Bell className="w-4 h-4" />
                {metrics.activeLeads > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D9541E] ring-2 ring-white dark:ring-neutral-900" />
                )}
              </button>
            </div>

            {/* Exit to Public Website Button */}
            <button
              type="button"
              onClick={handleClose}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-neutral-800 dark:text-neutral-100 bg-neutral-200/80 dark:bg-neutral-800 hover:bg-[#D9541E] hover:text-white dark:hover:bg-[#D9541E] dark:hover:text-white border border-neutral-300 dark:border-neutral-700 transition-all cursor-pointer shadow-xs group"
              title="Close Admin Portal & Return to Website (Esc)"
              aria-label="Close Admin Portal"
            >
              <X className="w-4 h-4 text-[#D9541E] group-hover:text-white transition-colors" />
              <span>Close</span>
            </button>
            <button
              type="button"
              onClick={() => { void signOut(); }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#D9541E] hover:bg-[#b84214] transition-colors cursor-pointer"
            >
              Sign out
            </button>

            {/* Profile Avatar */}
            <div className="w-7 h-7 rounded-full bg-[#8D5B3A] text-white flex items-center justify-center font-bold text-xs select-none">
              {(adminProfile?.displayName || 'A').slice(0, 1).toUpperCase()}
            </div>
          </div>
        </header>

        {/* -------------------- MAIN CONTENT CONTAINER -------------------- */}
        <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto pb-32">
          {/* Breadcrumbs Navigation */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <span>Regalien Studio</span>
            <ChevronRight className="w-3 h-3" />
            <span className="capitalize font-semibold text-neutral-700 dark:text-neutral-300">
              {activeTab}
            </span>
          </div>

          {/* Page Title & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className={`font-serif text-3xl font-bold tracking-tight ${themeHeading} capitalize`}>
                {activeTab === 'dashboard' ? 'Dashboard' : activeTab.replace('_', ' ')}
              </h2>
              <p className={`text-xs ${themeTextMuted} mt-1`}>
                {activeTab === 'dashboard'
                  ? 'Welcome back to your design studio'
                  : `Manage and synchronize ${activeTab} across your public website and client communications`}
              </p>
            </div>

            {/* Top Right Quick Action Buttons matching image_4ec97503.png */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsCreatingInquiry(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#8D5B3A] hover:bg-[#784d30] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Client</span>
              </button>

              <button
                onClick={() => {
                  setEditingProject(null);
                  setProjectForm({
                    title: '',
                    category: 'Luxury Residential',
                    location: 'Newtown Action Area II, Kolkata',
                    year: 2026,
                    areaSqFt: 3800,
                    client: '',
                    description: '',
                    materials: 'Italian Statuario Marble, Smoked Oak, Aged Brass',
                    features: 'Turnkey Civil Execution, Acoustic Paneling, Concealed LED Niches',
                    coverImage: projects[0]?.coverImage || '',
                    gallery: projects[0]?.gallery[0] || '',
                    featured: true,
                    published: true,
                    completionWeeks: 14,
                    beforeLabel: 'Bare Shell Handover',
                    afterLabel: 'Regalien Turnkey Finish',
                    beforeImage: '',
                    afterImage: '',
                  });
                  setIsCreatingProject(true);
                }}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border text-xs font-semibold shadow-2xs transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700'
                    : 'bg-white border-[#E5E0D8] text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project</span>
              </button>
            </div>
          </div>

          {/* ==================== TAB: DASHBOARD (Matching image_4ec97503.png) ==================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Top 5 Metrics Stat Cards matching screenshot layout */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
                {/* 1. Clients / Enquiries */}
                <div
                  onClick={() => setActiveTab('enquiries')}
                  className={`p-4 rounded-xl border ${themeCard} ${themeCardHover} transition-all cursor-pointer flex items-center justify-between group`}
                >
                  <div>
                    <span className={`text-[11px] font-medium ${themeTextMuted} block`}>
                      Clients
                    </span>
                    <span className={`text-2xl font-bold ${themeHeading} mt-1 block`}>
                      {metrics.totalInquiries}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-neutral-400 group-hover:text-[#8D5B3A] transition-colors">
                    <Users className="w-6 h-6 stroke-[1.5]" />
                  </div>
                </div>

                {/* 2. Projects */}
                <div
                  onClick={() => setActiveTab('projects')}
                  className={`p-4 rounded-xl border ${themeCard} ${themeCardHover} transition-all cursor-pointer flex items-center justify-between group`}
                >
                  <div>
                    <span className={`text-[11px] font-medium ${themeTextMuted} block`}>
                      Projects
                    </span>
                    <span className={`text-2xl font-bold ${themeHeading} mt-1 block`}>
                      {metrics.totalProjects}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-neutral-400 group-hover:text-[#8D5B3A] transition-colors">
                    <FolderKanban className="w-6 h-6 stroke-[1.5]" />
                  </div>
                </div>

                {/* 3. Leads */}
                <div
                  onClick={() => setActiveTab('enquiries')}
                  className={`p-4 rounded-xl border ${themeCard} ${themeCardHover} transition-all cursor-pointer flex items-center justify-between group`}
                >
                  <div>
                    <span className={`text-[11px] font-medium ${themeTextMuted} block`}>
                      Leads
                    </span>
                    <span className={`text-2xl font-bold ${themeHeading} mt-1 block`}>
                      {metrics.activeLeads}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-neutral-400 group-hover:text-[#8D5B3A] transition-colors">
                    <Sparkles className="w-6 h-6 stroke-[1.5]" />
                  </div>
                </div>

                {/* 4. Tasks */}
                <div
                  onClick={() => setActiveTab('tasks')}
                  className={`p-4 rounded-xl border ${themeCard} ${themeCardHover} transition-all cursor-pointer flex items-center justify-between group`}
                >
                  <div>
                    <span className={`text-[11px] font-medium ${themeTextMuted} block`}>
                      Tasks
                    </span>
                    <span className={`text-2xl font-bold ${themeHeading} mt-1 block`}>
                      {metrics.pendingTasks}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-neutral-400 group-hover:text-[#8D5B3A] transition-colors">
                    <CheckSquare className="w-6 h-6 stroke-[1.5]" />
                  </div>
                </div>

                {/* 5. Consultations */}
                <div
                  onClick={() => setActiveTab('consultations')}
                  className={`p-4 rounded-xl border ${themeCard} ${themeCardHover} transition-all cursor-pointer flex items-center justify-between group col-span-2 sm:col-span-1`}
                >
                  <div>
                    <span className={`text-[11px] font-medium ${themeTextMuted} block`}>
                      Consultations
                    </span>
                    <span className={`text-2xl font-bold ${themeHeading} mt-1 block`}>
                      {metrics.upcomingConsultations}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-neutral-400 group-hover:text-[#8D5B3A] transition-colors">
                    <Calendar className="w-6 h-6 stroke-[1.5]" />
                  </div>
                </div>
              </div>

              {/* Middle 2 Cards: Recent Projects & Upcoming Tasks */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Projects Card */}
                <div className={`p-6 rounded-2xl border ${themeCard} flex flex-col justify-between`}>
                  <div className="flex items-center justify-between pb-4 border-b border-inherit">
                    <h3 className={`font-serif text-lg font-bold ${themeHeading}`}>
                      Recent Projects
                    </h3>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className="text-xs font-semibold text-[#8D5B3A] dark:text-[#D9541E] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {projects.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-[#8D5B3A]/10 text-[#8D5B3A] flex items-center justify-center">
                        <FolderKanban className="w-8 h-8 stroke-[1.5]" />
                      </div>
                      <p className={`text-sm ${themeTextMuted}`}>No projects yet</p>
                      <button
                        onClick={() => setIsCreatingProject(true)}
                        className="px-5 py-2.5 rounded-xl bg-[#8D5B3A] hover:bg-[#784d30] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                      >
                        Create Your First Project
                      </button>
                    </div>
                  ) : (
                    <div className="py-3 space-y-2.5">
                      {projects.slice(0, 3).map((proj) => (
                        <div
                          key={proj.id}
                          className={`p-3 rounded-xl border ${isDark ? 'border-neutral-800 hover:bg-neutral-800/40' : 'border-neutral-100 hover:bg-neutral-50'} flex items-center justify-between gap-3 transition-colors`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={proj.coverImage}
                              alt={proj.title}
                              className="w-12 h-12 rounded-lg object-cover shadow-2xs shrink-0"
                            />
                            <div>
                              <p className={`text-xs font-bold ${themeHeading} line-clamp-1`}>
                                {proj.title}
                              </p>
                              <p className={`text-[10px] ${themeTextMuted}`}>
                                {proj.category} · {proj.areaSqFt} sq.ft · {proj.location}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => toggleProjectPublish(proj.id)}
                              className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                                proj.published !== false
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              }`}
                              title="Toggle public portfolio status"
                            >
                              {proj.published !== false ? 'Published' : 'Draft'}
                            </button>
                            <button
                              onClick={() => handleStartEditProject(proj)}
                              className="p-1.5 rounded text-neutral-400 hover:text-[#8D5B3A] cursor-pointer"
                              title="Edit project"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upcoming Tasks Card */}
                <div className={`p-6 rounded-2xl border ${themeCard} flex flex-col justify-between`}>
                  <div className="flex items-center justify-between pb-4 border-b border-inherit">
                    <h3 className={`font-serif text-lg font-bold ${themeHeading}`}>
                      Upcoming Tasks
                    </h3>
                    <button
                      onClick={() => setActiveTab('tasks')}
                      className="text-xs font-semibold text-[#8D5B3A] dark:text-[#D9541E] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {tasks.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-[#8D5B3A]/10 text-[#8D5B3A] flex items-center justify-center">
                        <CheckSquare className="w-8 h-8 stroke-[1.5]" />
                      </div>
                      <p className={`text-sm ${themeTextMuted}`}>No upcoming tasks</p>
                      <button
                        onClick={() => setIsCreatingTask(true)}
                        className="px-5 py-2.5 rounded-xl bg-[#8D5B3A] hover:bg-[#784d30] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                      >
                        Create Your First Task
                      </button>
                    </div>
                  ) : (
                    <div className="py-3 space-y-2">
                      {tasks.slice(0, 4).map((task) => (
                        <div
                          key={task.id}
                          onClick={() => toggleTaskCompleted(task.id)}
                          className={`p-2.5 rounded-xl border ${
                            task.completed
                              ? 'opacity-60 bg-neutral-100/50 dark:bg-neutral-800/20 border-transparent'
                              : isDark
                              ? 'border-neutral-800 hover:bg-neutral-800/40'
                              : 'border-neutral-100 hover:bg-neutral-50'
                          } flex items-center justify-between gap-3 transition-colors cursor-pointer`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                                task.completed
                                  ? 'bg-[#8D5B3A] border-[#8D5B3A] text-white'
                                  : 'border-neutral-300 dark:border-neutral-600'
                              }`}
                            >
                              {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span
                              className={`text-xs ${
                                task.completed
                                  ? 'line-through text-neutral-400'
                                  : themeHeading
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 ${
                              task.priority === 'High'
                                ? 'bg-red-500/10 text-red-600'
                                : 'bg-[#F3EEE3] dark:bg-neutral-800 text-[#111111] dark:text-white'
                            }`}
                          >
                            {task.dueDate}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Card: Recent Leads matching image_4ec97503.png */}
              <div className={`p-6 rounded-2xl border ${themeCard}`}>
                <div className="flex items-center justify-between pb-4 border-b border-inherit mb-4">
                  <h3 className={`font-serif text-lg font-bold ${themeHeading}`}>
                    Recent Leads & Client Enquiries
                  </h3>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="text-xs font-semibold text-[#8D5B3A] dark:text-[#D9541E] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {inquiries.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-[#8D5B3A]/10 text-[#8D5B3A] flex items-center justify-center">
                      <Users className="w-8 h-8 stroke-[1.5]" />
                    </div>
                    <p className={`text-sm ${themeTextMuted}`}>No leads yet</p>
                    <button
                      onClick={() => setIsCreatingInquiry(true)}
                      className="px-5 py-2.5 rounded-xl bg-[#8D5B3A] hover:bg-[#784d30] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                    >
                      Add Your First Lead
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {inquiries.slice(0, 3).map((inq) => (
                      <div
                        key={inq.id}
                        className={`p-4 rounded-xl border ${isDark ? 'border-neutral-800 bg-neutral-900/50' : 'border-neutral-100 bg-[#FBF9F5]'} space-y-3`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className={`text-xs font-bold ${themeHeading}`}>{inq.name}</h4>
                            <p className={`text-[10px] ${themeTextMuted}`}>{inq.propertyType} · {inq.location}</p>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              inq.status === 'New'
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>

                        <p className={`text-xs ${themeTextMuted} line-clamp-2 italic`}>
                          "{inq.message}"
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-inherit text-[11px]">
                          <span className="font-mono text-neutral-500">{inq.budgetRange}</span>
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#25D366] hover:underline font-semibold flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== TAB: PROJECT MANAGEMENT ==================== */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Projects Controls Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">Total Projects: {projects.length}</span>
                  <span className="text-neutral-400">·</span>
                  <span className="text-xs text-emerald-600 font-semibold">
                    Published: {projects.filter((p) => p.published !== false).length}
                  </span>
                  <span className="text-neutral-400">·</span>
                  <span className="text-xs text-amber-600 font-semibold">
                    Draft: {projects.filter((p) => p.published === false).length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingProject(null);
                      setIsCreatingProject(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#8D5B3A] hover:bg-[#784d30] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>
              </div>

              {/* Projects Table / Card Grid */}
              <div className={`rounded-2xl border ${themeCard} overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`border-b ${isDark ? 'bg-neutral-800/60 text-neutral-400' : 'bg-neutral-50 text-neutral-500'}`}>
                      <tr>
                        <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Project</th>
                        <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Category</th>
                        <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Location & Area</th>
                        <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Materials</th>
                        <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Status</th>
                        <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-inherit">
                      {projects.map((proj) => (
                        <tr key={proj.id} className={`${isDark ? 'hover:bg-neutral-800/30' : 'hover:bg-neutral-50/70'} transition-colors`}>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={proj.coverImage}
                                alt={proj.title}
                                className="w-14 h-11 rounded-lg object-cover shadow-2xs shrink-0"
                              />
                              <div>
                                <p className={`font-bold ${themeHeading}`}>{proj.title}</p>
                                <p className={`text-[10px] ${themeTextMuted}`}>{proj.client}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`text-[10px] font-semibold ${themeTextMuted}`}>
                              {proj.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className={themeHeading}>{proj.location}</p>
                            <p className={`text-[10px] ${themeTextMuted}`}>{proj.areaSqFt} sq.ft · {proj.completionWeeks} wks</p>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="flex flex-wrap gap-1">
                              {proj.materials.slice(0, 3).map((mat, idx) => (
                                <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-[#F3EEE3] dark:bg-neutral-800 text-[#111111] dark:text-white">
                                  {mat}
                                </span>
                              ))}
                              {proj.materials.length > 3 && (
                                <span className="text-[9px] text-neutral-400">+{proj.materials.length - 3}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => toggleProjectPublish(proj.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                                proj.published !== false
                                  ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
                              }`}
                            >
                              {proj.published !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              <span>{proj.published !== false ? 'Published' : 'Draft'}</span>
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleStartEditProject(proj)}
                                className="p-1.5 rounded-lg text-neutral-500 hover:text-[#8D5B3A] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                                title="Edit Project"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete project "${proj.title}"?`)) {
                                    deleteProject(proj.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                                title="Delete Project"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB: ENQUIRIES / CLIENTS ==================== */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">Total Inquiries: {inquiries.length}</span>
                  <span className="text-neutral-400">·</span>
                  <span className="text-xs text-amber-600 font-semibold">
                    New: {inquiries.filter((i) => i.status === 'New').length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={exportInquiriesCsv}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                      isDark ? 'border-neutral-700 bg-neutral-800 text-white' : 'border-neutral-200 bg-white text-neutral-800'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => setIsCreatingInquiry(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#8D5B3A] hover:bg-[#784d30] text-white text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Client</span>
                  </button>
                </div>
              </div>

              {/* Inquiry Cards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className={`p-5 rounded-2xl border ${themeCard} space-y-4`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`text-sm font-bold ${themeHeading}`}>{inq.name}</h4>
                        <p className={`text-xs ${themeTextMuted}`}>{inq.email} · {inq.phone}</p>
                      </div>

                      <select
                        value={inq.status}
                        onChange={(e) => updateInquiryStatus(inq.id, e.target.value as ClientInquiry['status'])}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer ${
                          inq.status === 'New'
                            ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                            : inq.status === 'Contacted'
                            ? 'bg-blue-500/10 text-blue-600 border-blue-500/30'
                            : inq.status === 'Converted'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 border-neutral-300'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Converted">Converted</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40">
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase font-mono block">Scope</span>
                        <span className="font-semibold">{inq.projectScope}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase font-mono block">Property</span>
                        <span className="font-semibold">{inq.propertyType} ({inq.estimatedSqFt} sq.ft)</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase font-mono block">Location</span>
                        <span className="font-semibold">{inq.location}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase font-mono block">Budget</span>
                        <span className="font-semibold text-[#8D5B3A]">{inq.budgetRange}</span>
                      </div>
                    </div>

                    <div className={`p-3 rounded-lg text-xs italic ${isDark ? 'bg-neutral-900/60' : 'bg-white'}`}>
                      "{inq.message}"
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-inherit">
                      <span className="text-[10px] text-neutral-400">
                        Received: {new Date(inq.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Send Automated Email Trigger */}
                        <button
                          onClick={() => {
                            setEmailForm((prev) => ({
                              ...prev,
                              recipientName: inq.name,
                              recipientEmail: inq.email,
                              projectScope: `${inq.propertyType} (${inq.estimatedSqFt} sq.ft), ${inq.location}`,
                            }));
                            setActiveTab('emails');
                          }}
                          className="px-2.5 py-1 rounded bg-[#8D5B3A]/10 text-[#8D5B3A] hover:bg-[#8D5B3A] hover:text-white transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Dispatch Email</span>
                        </button>

                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => {
                            if (window.confirm('Delete this client inquiry?')) {
                              deleteInquiry(inq.id);
                            }
                          }}
                          className="p-1 text-neutral-400 hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB: CONSULTATIONS & GOOGLE CALENDAR ==================== */}
          {activeTab === 'consultations' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className={`font-serif text-lg font-bold ${themeHeading}`}>
                    Appointment Booking & Google Calendar Engine
                  </h3>
                  <p className={`text-xs ${themeTextMuted}`}>
                    Clients receive instant Google Calendar invites and 1-click sync for Astra Towers studio walkthroughs.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.map((book) => (
                  <div
                    key={book.id}
                    className={`p-5 rounded-2xl border ${themeCard} space-y-3`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`text-sm font-bold ${themeHeading}`}>{book.clientName}</h4>
                        <p className={`text-xs ${themeTextMuted}`}>{book.clientEmail} · {book.clientPhone}</p>
                      </div>

                      <select
                        value={book.status}
                        onChange={(e) => updateBookingStatus(book.id, e.target.value as BookingAppointment['status'])}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border cursor-pointer ${
                          book.status === 'Confirmed'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                        }`}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Rescheduled">Rescheduled</option>
                      </select>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase font-mono block">Scheduled Date & Time</span>
                        <span className="font-bold text-[#8D5B3A]">{book.date} at {book.timeSlot}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-400 uppercase font-mono block">Format</span>
                        <span className="font-semibold">{book.consultationType}</span>
                      </div>
                    </div>

                    {book.notes && (
                      <p className={`text-xs ${themeTextMuted} italic`}>"{book.notes}"</p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-inherit">
                      {book.googleCalendarEventUrl ? (
                        <a
                          href={book.googleCalendarEventUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8D5B3A] text-white hover:bg-[#784d30] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Open in Google Calendar</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-neutral-400">Manual Entry</span>
                      )}

                      <button
                        onClick={() => {
                          if (window.confirm('Delete consultation?')) {
                            deleteBooking(book.id);
                          }
                        }}
                        className="p-1.5 text-neutral-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB: AUTOMATED ENQUIRY EMAILS ==================== */}
          {activeTab === 'emails' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Email Customization Form */}
                <div className={`lg:col-span-5 p-6 rounded-2xl border ${themeCard} space-y-4`}>
                  <div className="flex items-center gap-2 pb-3 border-b border-inherit">
                    <Mail className="w-5 h-5 text-[#8D5B3A]" />
                    <h3 className={`font-serif text-lg font-bold ${themeHeading}`}>
                      Automated Email Dispatcher
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-semibold block mb-1">Select Email Template</label>
                      <select
                        value={emailForm.template}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEmailForm((prev) => ({
                            ...prev,
                            template: val,
                            subject:
                              val === 'inquiry_ack'
                                ? 'Regalien Interior — Architectural Consultation & Preliminary Estimate'
                                : val === 'calendar_confirm'
                                ? 'Appointment Confirmed — Astra Towers Design Studio Walkthrough'
                                : 'Turnkey Milestone Update — Regalien Infrastructure',
                          }));
                        }}
                        className={`w-full p-2.5 rounded-lg border ${themeInput}`}
                      >
                        <option value="inquiry_ack">1. Client Inquiry Acknowledged & Welcome</option>
                        <option value="calendar_confirm">2. Google Calendar Consultation Confirmation</option>
                        <option value="milestone_update">3. Turnkey Milestone Execution Progress</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold block mb-1">Client Name</label>
                      <input
                        type="text"
                        value={emailForm.recipientName}
                        onChange={(e) => setEmailForm({ ...emailForm, recipientName: e.target.value })}
                        className={`w-full p-2 rounded-lg border ${themeInput}`}
                      />
                    </div>

                    <div>
                      <label className="font-semibold block mb-1">Client Email Address</label>
                      <input
                        type="email"
                        value={emailForm.recipientEmail}
                        onChange={(e) => setEmailForm({ ...emailForm, recipientEmail: e.target.value })}
                        className={`w-full p-2 rounded-lg border ${themeInput}`}
                      />
                    </div>

                    <div>
                      <label className="font-semibold block mb-1">Subject Line</label>
                      <input
                        type="text"
                        value={emailForm.subject}
                        onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                        className={`w-full p-2 rounded-lg border ${themeInput}`}
                      />
                    </div>

                    <div>
                      <label className="font-semibold block mb-1">Project Scope & Specs</label>
                      <input
                        type="text"
                        value={emailForm.projectScope}
                        onChange={(e) => setEmailForm({ ...emailForm, projectScope: e.target.value })}
                        className={`w-full p-2 rounded-lg border ${themeInput}`}
                      />
                    </div>

                    <div>
                      <label className="font-semibold block mb-1">Architectural Note</label>
                      <textarea
                        rows={3}
                        value={emailForm.customNote}
                        onChange={(e) => setEmailForm({ ...emailForm, customNote: e.target.value })}
                        className={`w-full p-2 rounded-lg border ${themeInput}`}
                      />
                    </div>

                    <button
                      onClick={() => {
                        setEmailDispatchError(
                          'Email delivery is not configured. Connect a server-side email provider or Supabase Edge Function before sending.'
                        );
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#8D5B3A] hover:bg-[#784d30] text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer mt-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Luxury Notification</span>
                    </button>

                    {emailDispatchError && (
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 text-center font-semibold text-xs flex items-center justify-center gap-1.5 animate-in fade-in">
                        <AlertCircle className="w-4 h-4" />
                        <span>{emailDispatchError}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Live High-Fidelity Branded Email Preview */}
                <div className={`lg:col-span-7 p-6 rounded-2xl border ${themeCard} flex flex-col`}>
                  <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
                    <span className="text-xs uppercase font-mono tracking-wider text-neutral-400">
                      Live Branded Preview
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 font-bold">
                      HTML5 Luxury Responsive
                    </span>
                  </div>

                  {/* Mock Mail Window */}
                  <div className="p-6 rounded-xl bg-[#111111] text-white space-y-4 border border-white/10 shadow-2xl flex-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <img src="/brand/regalien-emblem.png" alt="Regalien Crown" className="w-7 h-7 object-contain" />
                        <div>
                          <span className="font-serif text-lg font-bold text-white tracking-wide block">
                            REGALIEN INTERIOR
                          </span>
                          <span className="text-[9px] uppercase tracking-widest text-[#D9541E] font-mono block">
                            Infrastructure Pvt Ltd · Newtown Kolkata
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-white/50 font-mono">ASR 026 Astra Towers</span>
                    </div>

                    <div className="space-y-3 text-xs text-white/80 leading-relaxed">
                      <p className="font-bold text-white text-sm">
                        Dear {emailForm.recipientName},
                      </p>
                      <p>
                        Thank you for reaching out to <strong>Regalien Infrastructure</strong>. We are delighted to confirm receipt of your inquiry regarding <em>{emailForm.projectScope}</em>.
                      </p>
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-white/90">
                        <p className="text-[11px] font-mono text-[#D9541E] uppercase tracking-wider mb-1">
                          Architectural Note:
                        </p>
                        <p className="italic text-xs">{emailForm.customNote}</p>
                      </div>
                      <p>
                        Our principal architects are available for a private walkthrough at our Newtown flagship studio (ASR 026 Ground Floor, Astra Towers) or via Google Calendar video link.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-white/50">
                      <span>Studio Helpline: +91 8981441040</span>
                      <span className="font-serif italic text-white/70">Excellence in Turnkey Living</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB: TASKS ==================== */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-serif text-lg font-bold ${themeHeading}`}>Project & Studio Milestones</h3>
                  <p className={`text-xs ${themeTextMuted}`}>Track architectural deliverables, stone sourcing, and handover checklists.</p>
                </div>
                <button
                  onClick={() => setIsCreatingTask(true)}
                  className="px-4 py-2 rounded-lg bg-[#8D5B3A] text-white text-xs font-semibold hover:bg-[#784d30] cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border ${themeCard} flex items-center justify-between gap-3`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleTaskCompleted(task.id)}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                          task.completed
                            ? 'bg-[#8D5B3A] border-[#8D5B3A] text-white'
                            : 'border-neutral-300 dark:border-neutral-600'
                        }`}
                      >
                        {task.completed && <Check className="w-3.5 h-3.5" />}
                      </button>
                      <div>
                        <p className={`text-xs font-semibold ${task.completed ? 'line-through text-neutral-400' : themeHeading}`}>
                          {task.title}
                        </p>
                        {task.relatedProject && (
                          <p className="text-[10px] text-neutral-400">Project: {task.relatedProject}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${task.priority === 'High' ? 'bg-red-500/10 text-red-600' : 'bg-neutral-100 dark:bg-neutral-800'}`}>
                        {task.dueDate}
                      </span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 text-neutral-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB: GALLERY & SUPABASE STORAGE ==================== */}
          {activeTab === 'storage' && (
            <div className="space-y-6">
              {/* Supabase Storage Integration Card */}
              <div className={`p-6 rounded-2xl border ${themeCard} space-y-4`}>
                <div className="flex items-center justify-between pb-3 border-b border-inherit">
                  <div className="flex items-center gap-2.5">
                    <Database className="w-5 h-5 text-[#8D5B3A]" />
                    <h3 className={`font-serif text-lg font-bold ${themeHeading}`}>
                      Supabase Cloud Storage & Media Bucket
                    </h3>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    supabaseConfig.bucketName ? 'bg-emerald-500/15 text-emerald-600' : 'bg-amber-500/15 text-amber-700'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${supabaseConfig.bucketName ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    {supabaseConfig.bucketName ? 'Bucket configured' : 'Bucket unavailable'}
                  </span>
                </div>

                <p className={`text-xs ${themeTextMuted} leading-relaxed`}>
                  Regalien projects leverage cloud storage for ultra-high-resolution architectural renders, 360° panoramas, and before/after comparison slides.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40">
                    <span className="text-[10px] text-neutral-400 uppercase font-mono block">Project Storage URL</span>
                    <span className="font-mono font-semibold break-all">{supabaseConfig.url}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40">
                    <span className="text-[10px] text-neutral-400 uppercase font-mono block">Active Bucket</span>
                    <span className="font-mono font-semibold">{supabaseConfig.bucketName}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40">
                    <span className="text-[10px] text-neutral-400 uppercase font-mono block">Public CDN Access</span>
                    <span className="font-semibold text-neutral-500">Requires public bucket policy</span>
                  </div>
                </div>

                {/* Direct Upload Box */}
                <div className="p-8 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl text-center space-y-3">
                  <CloudUpload className="w-10 h-10 text-[#8D5B3A] mx-auto" />
                  <div>
                    <h4 className="text-xs font-bold">Upload High-Res Architectural Renders</h4>
                    <p className="text-[10px] text-neutral-500 mt-0.5">PNG, JPG, WEBP up to 25MB each with automatic CDN optimization</p>
                  </div>
                  <select
                    value={storageProjectId}
                    onChange={(event) => {
                      setStorageProjectId(event.target.value);
                      setStorageUploadError('');
                    }}
                    className={`w-full max-w-sm p-2.5 rounded-lg border text-left ${themeInput}`}
                  >
                    <option value="">Select a saved project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>{project.title}</option>
                    ))}
                  </select>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8D5B3A] hover:bg-[#784d30] text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{storageUploading ? 'Uploading…' : 'Choose File to Upload'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="hidden"
                      disabled={storageUploading || !storageProjectId}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        e.target.value = '';
                        if (!file || !storageProjectId) return;
                        setStorageUploadError('');
                        setStorageUploading(true);
                        try {
                          await uploadProjectAsset(storageProjectId, file);
                        } catch (error) {
                          setStorageUploadError(error instanceof Error ? error.message : 'Unable to upload project media.');
                        } finally {
                          setStorageUploading(false);
                        }
                      }}
                    />
                  </label>
                  {storageUploadError && <p className="text-xs text-red-700">{storageUploadError}</p>}
                </div>
              </div>

              {/* Gallery Grid of Existing Project Media */}
              <div className="space-y-3">
                <h4 className={`font-serif text-base font-bold ${themeHeading}`}>Project Image Assets</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {projects.flatMap((project) => [project.coverImage, ...project.gallery]
                    .filter((image, index, images) => image && images.indexOf(image) === index)
                    .map((image) => ({ project, image }))).slice(0, 8).map(({ project, image }) => (
                    <div key={`${project.id}-${image}`} className="group relative aspect-4/3 rounded-xl overflow-hidden shadow-xs border border-inherit">
                      <img src={image} alt={`${project.title} asset`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <a
                          href={image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-full bg-white text-neutral-900"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          title="Delete uploaded media"
                          onClick={() => {
                            if (!window.confirm(`Delete this asset from ${project.title}?`)) return;
                            void deleteProjectAsset(project.id, image).catch((error) => {
                              setStorageUploadError(error instanceof Error ? error.message : 'Unable to delete project media.');
                            });
                          }}
                          className="p-1.5 rounded-full bg-white text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB: FAQ MANAGEMENT ==================== */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-serif text-lg font-bold ${themeHeading}`}>FAQ Management</h3>
                  <p className={`text-xs ${themeTextMuted}`}>Add, edit, or reorder questions displayed on the public FAQ page.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingFaq(null);
                    setIsCreatingFaq(true);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#8D5B3A] text-white text-xs font-semibold hover:bg-[#784d30] cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-3">
                {faqs.map((f) => (
                  <div key={f.id} className={`p-4 rounded-xl border ${themeCard} space-y-2`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[#8D5B3A]">
                          {f.category}
                        </span>
                        <h4 className={`text-xs font-bold ${themeHeading} mt-1.5`}>{f.question}</h4>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingFaq(f);
                            setIsCreatingFaq(true);
                          }}
                          className="p-1.5 text-neutral-400 hover:text-[#8D5B3A]"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete FAQ?')) deleteFaq(f.id);
                          }}
                          className="p-1.5 text-neutral-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className={`text-xs ${themeTextMuted} leading-relaxed`}>{f.answer}</p>
                    {f.highlight && (
                      <p className="text-[10px] font-semibold text-[#8D5B3A] italic">Highlight: {f.highlight}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB: CLIENT TESTIMONIALS ==================== */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-serif text-lg font-bold ${themeHeading}`}>Client Testimonials Management</h3>
                  <p className={`text-xs ${themeTextMuted}`}>Manage verified client reviews and project outcomes shown on the site.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingTestimonial(null);
                    setIsCreatingTestimonial(true);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#8D5B3A] text-white text-xs font-semibold hover:bg-[#784d30] cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Review</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((test) => (
                  <div key={test.id} className={`p-5 rounded-2xl border ${themeCard} space-y-3`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`text-xs font-bold ${themeHeading}`}>{test.clientName}</h4>
                        <p className={`text-[10px] ${themeTextMuted}`}>{test.role} · {test.location}</p>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: test.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>

                    <p className={`text-xs ${themeTextMuted} italic leading-relaxed`}>
                      "{test.quote}"
                    </p>

                    <div className="p-2 rounded bg-neutral-50 dark:bg-neutral-800/40 text-[10px] text-neutral-500 font-mono">
                      Outcome: {test.outcome}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-inherit">
                      <span className="text-[10px] text-neutral-400">Project: {test.project}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingTestimonial(test);
                            setIsCreatingTestimonial(true);
                          }}
                          className="p-1 text-neutral-400 hover:text-[#8D5B3A]"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete review?')) deleteTestimonial(test.id);
                          }}
                          className="p-1 text-neutral-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB: COMING SOON MODULES (Vendors / Reports) ==================== */}
          {(activeTab === 'vendors' || activeTab === 'reports') && (
            <div className={`p-12 rounded-2xl border ${themeCard} text-center space-y-4`}>
              <div className="w-16 h-16 rounded-2xl bg-[#8D5B3A]/10 text-[#8D5B3A] flex items-center justify-center mx-auto">
                {activeTab === 'vendors' ? <Store className="w-8 h-8 stroke-[1.5]" /> : <BarChart3 className="w-8 h-8 stroke-[1.5]" />}
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#8D5B3A]/15 text-[#8D5B3A] font-mono text-xs font-bold uppercase tracking-wider">
                Module Coming Soon
              </span>
              <h3 className={`font-serif text-2xl font-bold ${themeHeading}`}>
                {activeTab === 'vendors' ? 'Italian & German Vendor Directory' : 'Turnkey Financial & Milestone Analytics'}
              </h3>
              <p className={`text-xs ${themeTextMuted} max-w-md mx-auto leading-relaxed`}>
                {activeTab === 'vendors'
                  ? 'Integrated directory for verified Italian marble quarries, Austrian Blum motorized hardware partners, and acoustic veneer suppliers with live rate cards.'
                  : 'Advanced Gantt velocity, BOQ variance tracking, and client billing lifecycle graphs are currently in production testing.'}
              </p>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-5 py-2.5 rounded-xl bg-[#8D5B3A] hover:bg-[#784d30] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          )}

          {/* ==================== TAB: SETTINGS ==================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${themeCard} space-y-4`}>
                <h3 className={`font-serif text-lg font-bold ${themeHeading}`}>Administrator Profile</h3>
                <p className={`text-xs ${themeTextMuted}`}>Your authentication email remains managed by Supabase Auth.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <label>
                    <span className="font-semibold block mb-1">Display name</span>
                    <input value={adminDisplayName} onChange={(e) => setAdminDisplayName(e.target.value)} placeholder="e.g. Rahul" className={`w-full p-2 rounded-lg border ${themeInput}`} />
                  </label>
                  <label>
                    <span className="font-semibold block mb-1">Designation</span>
                    <input value={adminDesignation} onChange={(e) => setAdminDesignation(e.target.value)} placeholder="e.g. Senior Designer, Rahul" className={`w-full p-2 rounded-lg border ${themeInput}`} />
                  </label>
                </div>
                <button
                  type="button"
                  disabled={profileSaving}
                  onClick={async () => {
                    setProfileSaving(true);
                    try {
                      await updateAdminProfile(adminDisplayName, adminDesignation);
                    } catch (error) {
                      window.alert(error instanceof Error ? error.message : 'Unable to save administrator profile.');
                    } finally {
                      setProfileSaving(false);
                    }
                  }}
                  className="px-4 py-2 rounded-lg bg-[#8D5B3A] hover:bg-[#784d30] disabled:opacity-50 text-white text-xs font-semibold"
                >
                  {profileSaving ? 'Saving…' : 'Save Profile'}
                </button>
              </div>
              <div className={`p-6 rounded-2xl border ${themeCard} space-y-4`}>
                <h3 className={`font-serif text-lg font-bold ${themeHeading}`}>Studio Contact & Brand Settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold block mb-1">Company Name</label>
                    <input
                      type="text"
                      value={company.name}
                      onChange={(e) => updateCompany({ name: e.target.value })}
                      className={`w-full p-2 rounded-lg border ${themeInput}`}
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Direct Phone Number</label>
                    <input
                      type="text"
                      value={company.phone}
                      onChange={(e) => updateCompany({ phone: e.target.value })}
                      className={`w-full p-2 rounded-lg border ${themeInput}`}
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">WhatsApp Number (e.g. 918981441040)</label>
                    <input
                      type="text"
                      value={company.whatsappNumber}
                      onChange={(e) => updateCompany({ whatsappNumber: e.target.value })}
                      className={`w-full p-2 rounded-lg border ${themeInput}`}
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={company.email}
                      onChange={(e) => updateCompany({ email: e.target.value })}
                      className={`w-full p-2 rounded-lg border ${themeInput}`}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-semibold block mb-1">Studio Address (Astra Towers)</label>
                    <input
                      type="text"
                      value={company.address}
                      onChange={(e) => updateCompany({ address: e.target.value })}
                      className={`w-full p-2 rounded-lg border ${themeInput}`}
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">YouTube URL</label>
                    <input
                      type="text"
                      value={company.youtubeUrl}
                      onChange={(e) => updateCompany({ youtubeUrl: e.target.value })}
                      className={`w-full p-2 rounded-lg border ${themeInput}`}
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Instagram URL</label>
                    <input
                      type="text"
                      value={company.instagramUrl}
                      onChange={(e) => updateCompany({ instagramUrl: e.target.value })}
                      className={`w-full p-2 rounded-lg border ${themeInput}`}
                    />
                  </div>
                </div>
              </div>

              {/* Data Management */}
              <div className={`p-6 rounded-2xl border ${themeCard} space-y-3`}>
                <h4 className="font-serif text-base font-bold">Database Connection</h4>
                <p className="text-xs text-neutral-500">
                  Data is managed in Supabase. Refreshing never creates or restores local records.
                </p>
                <button
                  onClick={() => {
                    resetToDefaults();
                  }}
                  className="px-4 py-2 rounded-lg bg-[#111111] hover:bg-[#D9541E] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Refresh Database
                </button>
                {dataError && <p className="text-xs text-red-700">{dataError}</p>}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ==================== MODAL: CREATE / EDIT PROJECT ==================== */}
      {isCreatingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className={`relative w-full max-w-2xl max-h-[90vh] ${themeSidebar} rounded-2xl border shadow-2xl flex flex-col overflow-hidden`}>
            <div className="p-5 border-b border-inherit flex items-center justify-between">
              <h3 className={`font-serif text-lg font-bold ${themeHeading}`}>
                {editingProject ? 'Edit Architectural Project' : 'Create New Project'}
              </h3>
              <button
                onClick={() => setIsCreatingProject(false)}
                className="p-1 rounded text-neutral-500 hover:text-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="e.g. The Silver Spring Penthouse"
                    className={`w-full p-2 rounded-lg border ${themeInput}`}
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Category</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as any })}
                    className={`w-full p-2 rounded-lg border ${themeInput}`}
                  >
                    <option value="Luxury Residential">Luxury Residential</option>
                    <option value="Penthouse Suites">Penthouse Suites</option>
                    <option value="Commercial & Corporate">Commercial & Corporate</option>
                    <option value="Modular Kitchen & Bar">Modular Kitchen & Bar</option>
                    <option value="Bespoke Lighting">Bespoke Lighting</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Location</label>
                  <input
                    type="text"
                    value={projectForm.location}
                    onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                    placeholder="e.g. Newtown Action Area II, Kolkata"
                    className={`w-full p-2 rounded-lg border ${themeInput}`}
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Carpet Area (sq.ft)</label>
                  <input
                    type="number"
                    value={projectForm.areaSqFt}
                    onChange={(e) => setProjectForm({ ...projectForm, areaSqFt: Number(e.target.value) })}
                    className={`w-full p-2 rounded-lg border ${themeInput}`}
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Client Name / Estate</label>
                  <input
                    type="text"
                    value={projectForm.client}
                    onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })}
                    placeholder="e.g. Private Industrialist Residence"
                    className={`w-full p-2 rounded-lg border ${themeInput}`}
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Turnkey Timeline (Weeks)</label>
                  <input
                    type="number"
                    value={projectForm.completionWeeks}
                    onChange={(e) => setProjectForm({ ...projectForm, completionWeeks: Number(e.target.value) })}
                    className={`w-full p-2 rounded-lg border ${themeInput}`}
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Project Description</label>
                <textarea
                  rows={2}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className={`w-full p-2 rounded-lg border ${themeInput}`}
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Key Materials (Comma-separated)</label>
                <input
                  type="text"
                  value={projectForm.materials}
                  onChange={(e) => setProjectForm({ ...projectForm, materials: e.target.value })}
                  placeholder="Italian Marble, Slatted Oak, Brass..."
                  className={`w-full p-2 rounded-lg border ${themeInput}`}
                />
              </div>

              {/* Cover Image Upload (Local or Supabase) */}
              <div className="space-y-1.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-inherit">
                <label className="font-semibold block">Cover Image (Upload File or Enter URL)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={projectForm.coverImage}
                    onChange={(e) => setProjectForm({ ...projectForm, coverImage: e.target.value })}
                    className={`flex-1 p-2 rounded-lg border ${themeInput}`}
                    placeholder="/Project Name/photo.jpg or https://..."
                  />
                  <label className="px-3 py-2 rounded-lg bg-[#8D5B3A] text-white font-semibold cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5 inline mr-1" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileUpload(e, 'cover')}
                    />
                  </label>
                </div>
                {projectForm.coverImage && (
                  <div className="mt-2 w-28 h-16 rounded-lg overflow-hidden border">
                    <img src={projectForm.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Publishing Controls */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40">
                <div>
                  <span className="font-semibold block">Publish to Public Portfolio</span>
                  <span className="text-[10px] text-neutral-500">When enabled, project displays immediately on website portfolio.</span>
                </div>
                <input
                  type="checkbox"
                  checked={projectForm.published}
                  onChange={(e) => setProjectForm({ ...projectForm, published: e.target.checked })}
                  className="w-4 h-4 accent-[#8D5B3A] cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-inherit flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreatingProject(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#8D5B3A] hover:bg-[#784d30] text-white font-semibold shadow-xs cursor-pointer"
                >
                  {editingProject ? 'Save Changes' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: ADD CLIENT / INQUIRY ==================== */}
      {isCreatingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-lg ${themeSidebar} rounded-2xl border shadow-2xl p-6 space-y-4`}>
            <div className="flex items-center justify-between border-b pb-3 border-inherit">
              <h3 className={`font-serif text-lg font-bold ${themeHeading}`}>Add New Client Inquiry</h3>
              <button onClick={() => setIsCreatingInquiry(false)} className="p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const fd = new FormData(form);
                addInquiry({
                  name: fd.get('name') as string,
                  email: fd.get('email') as string,
                  phone: fd.get('phone') as string,
                  projectScope: fd.get('scope') as string,
                  propertyType: fd.get('propertyType') as string,
                  estimatedSqFt: fd.get('sqft') as string,
                  location: fd.get('location') as string,
                  targetTimeline: 'Within 3 Months',
                  budgetRange: fd.get('budget') as string,
                  message: fd.get('message') as string,
                });
                setIsCreatingInquiry(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-semibold block mb-1">Client Full Name</label>
                <input name="name" required className={`w-full p-2 rounded-lg border ${themeInput}`} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Email</label>
                  <input name="email" type="email" required className={`w-full p-2 rounded-lg border ${themeInput}`} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Phone Number</label>
                  <input name="phone" required defaultValue="+91 " className={`w-full p-2 rounded-lg border ${themeInput}`} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Property Type</label>
                  <input name="propertyType" defaultValue="4BHK Duplex Penthouse" className={`w-full p-2 rounded-lg border ${themeInput}`} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Budget</label>
                  <input name="budget" defaultValue="₹50L - ₹80L" className={`w-full p-2 rounded-lg border ${themeInput}`} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Scope</label>
                  <input name="scope" defaultValue="Full Turnkey Architecture" className={`w-full p-2 rounded-lg border ${themeInput}`} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Location</label>
                  <input name="location" defaultValue="Newtown, Kolkata" className={`w-full p-2 rounded-lg border ${themeInput}`} />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Inquiry Message</label>
                <textarea name="message" rows={2} defaultValue="Client requested turnkey quotation and material studio visit." className={`w-full p-2 rounded-lg border ${themeInput}`} />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-lg bg-[#8D5B3A] text-white font-semibold cursor-pointer">
                Save Client Inquiry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: ADD TASK ==================== */}
      {isCreatingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-md ${themeSidebar} rounded-2xl border shadow-2xl p-6 space-y-4`}>
            <div className="flex items-center justify-between border-b pb-3 border-inherit">
              <h3 className={`font-serif text-lg font-bold ${themeHeading}`}>Create New Studio Task</h3>
              <button onClick={() => setIsCreatingTask(false)} className="p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const fd = new FormData(form);
                try {
                  await addTask({
                    title: fd.get('title') as string,
                    dueDate: fd.get('dueDate') as string,
                    priority: (fd.get('priority') as any) || 'Medium',
                    relatedProject: fd.get('project') as string,
                  });
                  setIsCreatingTask(false);
                } catch (error) {
                  window.alert(error instanceof Error ? error.message : 'Unable to create task.');
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-semibold block mb-1">Task Title</label>
                <input name="title" required placeholder="e.g. Inspect marble polish at site" className={`w-full p-2 rounded-lg border ${themeInput}`} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Due Date</label>
                  <input name="dueDate" type="date" required defaultValue="2026-11-15" className={`w-full p-2 rounded-lg border ${themeInput}`} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Priority</label>
                  <select name="priority" className={`w-full p-2 rounded-lg border ${themeInput}`}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Related Project</label>
                <select name="project" defaultValue="" className={`w-full p-2 rounded-lg border ${themeInput}`}>
                  <option value="">No related project</option>
                  {projects.filter((project) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(project.id)).map((project) => (
                    <option key={project.id} value={project.id}>{project.title}</option>
                  ))}
                </select>
                <p className="text-[10px] text-neutral-500 mt-1">Only database projects can be linked to a task.</p>
              </div>
              <button type="submit" className="w-full py-2.5 rounded-lg bg-[#8D5B3A] text-white font-semibold cursor-pointer">
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: CREATE / EDIT FAQ ==================== */}
      {isCreatingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-md ${themeSidebar} rounded-2xl border shadow-2xl p-6 space-y-4`}>
            <div className="flex items-center justify-between border-b pb-3 border-inherit">
              <h3 className={`font-serif text-lg font-bold ${themeHeading}`}>
                {editingFaq ? 'Edit FAQ Item' : 'Add New FAQ'}
              </h3>
              <button onClick={() => setIsCreatingFaq(false)} className="p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const fd = new FormData(form);
                const q = fd.get('question') as string;
                const a = fd.get('answer') as string;
                const cat = (fd.get('category') as any) || 'Turnkey Execution';
                const hl = fd.get('highlight') as string;

                try {
                  if (editingFaq) {
                    await updateFaq(editingFaq.id, { question: q, answer: a, category: cat, highlight: hl });
                  } else {
                    await addFaq({ question: q, answer: a, category: cat, highlight: hl });
                  }
                  setIsCreatingFaq(false);
                } catch (error) {
                  window.alert(error instanceof Error ? error.message : 'Unable to save FAQ.');
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-semibold block mb-1">Category</label>
                <select name="category" defaultValue={editingFaq?.category || 'Turnkey Execution'} className={`w-full p-2 rounded-lg border ${themeInput}`}>
                  <option value="Turnkey Execution">Turnkey Execution</option>
                  <option value="Pricing & Milestones">Pricing & Milestones</option>
                  <option value="Materials & Warranty">Materials & Warranty</option>
                  <option value="Astra Towers Studio">Astra Towers Studio</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Question</label>
                <input name="question" required defaultValue={editingFaq?.question || ''} className={`w-full p-2 rounded-lg border ${themeInput}`} />
              </div>
              <div>
                <label className="font-semibold block mb-1">Answer</label>
                <textarea name="answer" rows={3} required defaultValue={editingFaq?.answer || ''} className={`w-full p-2 rounded-lg border ${themeInput}`} />
              </div>
              <div>
                <label className="font-semibold block mb-1">Key Highlight</label>
                <input name="highlight" defaultValue={editingFaq?.highlight || ''} className={`w-full p-2 rounded-lg border ${themeInput}`} />
              </div>
              <button type="submit" className="w-full py-2.5 rounded-lg bg-[#8D5B3A] text-white font-semibold cursor-pointer">
                Save FAQ
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
