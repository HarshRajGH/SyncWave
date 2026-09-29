import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({
  currentUser,
  onLogout,
  onOpenCreateWave,
  searchQuery,
  onSearchChange,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="app-shell-container">
      <Navbar
        currentUser={currentUser}
        onLogout={onLogout}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
      <div className="app-shell">
        <Sidebar
          onOpenCreateWave={onOpenCreateWave}
          onLogout={onLogout}
        />
        <main id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
