import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="bg-app min-h-screen overflow-x-hidden text-primary-theme">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div className="min-h-screen md:pl-[280px]">
        <Topbar onMenuToggle={() => setSidebarOpen((current) => !current)} onRefresh={() => setRefreshKey((current) => current + 1)} />
        <main className="app-shell-main px-4 py-6 md:px-6 md:py-8">
          <div key={refreshKey} className="mx-auto max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
