import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboardIcon,
  CalendarIcon,
  ClockIcon,
  LogOutIcon
} from 'lucide-react';

// ⭐ Correct admin auth hook import
import { useAuth } from '../hooks/useAuth';

import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  {
    id: 'overview',
    label: 'Dashboard',
    icon: LayoutDashboardIcon
  },
  {
    id: 'evening',
    label: 'Evening Bookings',
    icon: ClockIcon
  },
  {
    id: 'availability',
    label: 'Manage Availability',
    icon: CalendarIcon
  }
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    // ⭐ Optional: remove admin role
    localStorage.removeItem('role');

    navigate('/');
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <img src="/cc.jpg" alt="CourtConnect" className="w-full h-auto" />
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 p-4 space-y-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors relative
                ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#6CABA8] rounded-lg"
                  transition={{
                    type: 'spring',
                    bounce: 0.2,
                    duration: 0.6
                  }}
                />
              )}

              <Icon className="w-5 h-5 relative z-10" />
              <span className="font-medium relative z-10">{tab.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* User Info + Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="mb-3 px-4">
          <p className="text-sm font-medium text-[#063830]">
            {user?.name}
          </p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOutIcon className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
