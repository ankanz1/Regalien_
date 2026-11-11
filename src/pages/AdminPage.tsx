import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminPortal } from '../components/AdminPortal';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div data-lenis-prevent="true" className="w-full h-screen overflow-hidden">
      <AdminPortal isStandalonePage={true} onClose={() => navigate('/')} />
    </div>
  );
};
