/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { useLenisScroll } from './hooks/useLenisScroll';
import { useScrollAnimations } from './hooks/useScrollAnimations';
import { PageTransitionProvider } from './components/PageTransition';
import { ScrollExperience } from './components/ScrollExperience';

// Separate Pages
import { HomePage } from './pages/HomePage';
import { PortfolioPage } from './pages/PortfolioPage';
import { CapabilitiesPage } from './pages/CapabilitiesPage';
import { ConsultationPage } from './pages/ConsultationPage';
import { InquiryPage } from './pages/InquiryPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { FAQPage } from './pages/FAQPage';
import { StudioLocationPage } from './pages/StudioLocationPage';
import { AdminPage } from './pages/AdminPage';
import { AdminLogin } from './components/AdminLogin';

// Shared Global Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { EmailNotificationModal } from './components/EmailNotificationModal';
import { AdminPanel } from './components/AdminPanel';

function AppRoutes() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <main className={`flex-1 ${isAdmin ? 'pt-0' : isHome ? 'pt-0' : 'pt-20 sm:pt-24'}`}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/services" element={<CapabilitiesPage />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/inquiry" element={<InquiryPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/location" element={<StudioLocationPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
}

function MainLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const { dataError } = useApp();

  // Initialize Lenis smooth scroll
  useLenisScroll();

  // Initialize GSAP ScrollTrigger animations
  useScrollAnimations();

  if (isAdmin) {
    return (
      <div className="h-screen w-full overflow-hidden font-sans">
        {dataError && <DataErrorBanner message={dataError} />}
        <AppRoutes />
        <EmailNotificationModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3EEE3] text-[#111111] flex flex-col font-sans selection:bg-[#D9541E] selection:text-white">
      {dataError && <DataErrorBanner message={dataError} />}
      {/* Scroll Progress Indicator & Back to Top */}
      <ScrollExperience />

      {/* Top Bar Navigation (Route-aware) */}
      <Navbar />

      {/* Multi-Page Routes */}
      <AppRoutes />

      {/* Global Footer with Page Links */}
      <Footer />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppFloatingButton />

      {/* Automated Email Notification Preview Modal */}
      <EmailNotificationModal />

      {/* Administrative Management Portal */}
      <AdminPanel />
    </div>
  );
}

const DataErrorBanner: React.FC<{ message: string }> = ({ message }) => (
  <div role="alert" className="relative z-[60] bg-red-50 px-4 py-2 text-center text-xs text-red-800 border-b border-red-200">
    {message}
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <PageTransitionProvider>
          <MainLayout />
        </PageTransitionProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
