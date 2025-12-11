import React from "react";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import { UserIcon, LogOutIcon } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: "#D8F2ED" }}
          >
            <UserIcon className="w-16 h-16" style={{ color: "#6CABA8" }} />
          </div>
          <p className="text-sm text-gray-500 mt-3">Profile overview</p>
        </div>

        {/* User Info */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#063830" }}>
              Username
            </label>
            <div
              className="w-full px-4 py-3 rounded-lg"
              style={{ backgroundColor: "#D8F2ED", color: "#063830" }}
            >
              {user.username}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#063830" }}>
              Email
            </label>
            <div
              className="w-full px-4 py-3 rounded-lg"
              style={{ backgroundColor: "#D8F2ED", color: "#063830" }}
            >
              {user.email}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#063830" }}>
              Role
            </label>
            <div
              className="w-full px-4 py-3 rounded-lg"
              style={{ backgroundColor: "#D8F2ED", color: "#063830" }}
            >
              {user.role}
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: "#063830" }}
        >
          <LogOutIcon className="w-5 h-5" />
          Log Out
        </button>
      </motion.div>
    </div>
  );
}
