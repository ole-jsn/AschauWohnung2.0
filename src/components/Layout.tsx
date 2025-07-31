import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
      
      <div className={`flex-1 overflow-auto transition-all duration-300 ${isSidebarOpen ? 'ml-0 lg:ml-64' : 'ml-0'}`}>
        <main className="p-4 sm:p-6 md:p-8 mt-16 lg:mt-0 lg:max-w-[calc(100%-80px)] lg:ml-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;