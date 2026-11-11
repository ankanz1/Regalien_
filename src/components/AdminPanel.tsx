import React from 'react';
import { useApp } from '../context/AppContext';
import { AdminPortal } from './AdminPortal';

export const AdminPanel: React.FC = () => {
  const { isAdminOpen, setIsAdminOpen } = useApp();

  if (!isAdminOpen) return null;

  return (
    <div
      id="admin-panel-overlay"
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60"
    >
      <AdminPortal onClose={() => setIsAdminOpen(false)} />
    </div>
  );
};
