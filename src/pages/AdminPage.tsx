import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AdminPortal } from '../components/AdminPortal';
import { AdminLogin } from '../components/AdminLogin';
import { useApp } from '../context/AppContext';

const UnauthorizedAdmin: React.FC<{ onSignOut: () => void }> = ({ onSignOut }) => (
  <main className="min-h-screen bg-[#F3EEE3] flex items-center justify-center px-6">
    <div className="max-w-md bg-white border border-[#111111]/15 shadow-xl p-8 text-center">
      <p className="text-[10px] uppercase tracking-widest text-[#D9541E] font-semibold">Regalien</p>
      <h1 className="font-serif text-2xl font-bold mt-2">Access denied</h1>
      <p className="text-sm text-[#111111]/65 mt-3">Your account is authenticated but does not have an authorized administrator role.</p>
      <div className="mt-6 flex justify-center gap-3">
        <button type="button" onClick={onSignOut} className="bg-[#111111] hover:bg-[#D9541E] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider">
          Sign out
        </button>
        <button type="button" onClick={() => window.location.assign('/')} className="border border-[#111111]/20 hover:border-[#D9541E] px-5 py-3 text-xs font-bold uppercase tracking-wider">
          Return to website
        </button>
      </div>
    </div>
  </main>
);

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { authLoading, user, adminProfile, signOut } = useApp();

  if (authLoading) {
    return <div className="min-h-screen bg-[#F3EEE3] flex items-center justify-center text-sm">Verifying administrator session…</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!adminProfile?.isAuthorized) {
    return <UnauthorizedAdmin onSignOut={() => { void signOut(); }} />;
  }

  return (
    <div data-lenis-prevent="true" className="w-full h-screen overflow-hidden">
      <AdminPortal isStandalonePage={true} onClose={() => navigate('/')} />
    </div>
  );
};
