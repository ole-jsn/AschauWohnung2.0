import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Info, Image, Users, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
  const { user, logout } = useAuth();
  
  const navItems = [
    { name: 'Kalender', path: '/kalender', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Info', path: '/info', icon: <Info className="w-5 h-5" /> },
    { name: 'Bilder', path: '/bilder', icon: <Image className="w-5 h-5" /> },
  ];
  
  if (user?.isAdmin) {
    navItems.push({ name: 'Admin', path: '/admin', icon: <Users className="w-5 h-5" /> });
  }

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" }
  };

  return (
    <>
      {/* Mobile menu button - only show when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={toggle}
          className="fixed top-4 left-4 z-40 p-2 rounded-md bg-white shadow-md lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggle}
        />
      )}

      {/* Sidebar */}
      <motion.div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-30 flex flex-col lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-teal-700">Aschau Wohnung</h2>
          <p className="text-sm text-gray-500">Willkommen, {user?.username}</p>
        </div>

        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-md transition-colors ${
                      isActive
                        ? 'bg-teal-100 text-teal-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                  onClick={() => {
                    if (window.innerWidth < 1024) toggle();
                  }}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center w-full p-3 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-3">Ausloggen</span>
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;