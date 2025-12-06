import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // ⭐ ADDED navigate
import { motion } from "framer-motion";
import { HomeIcon, CalendarIcon, UserIcon, LogOutIcon } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate(); // ⭐ REQUIRED FOR REDIRECT
  const { logout, isAuthenticated } = useAuth();

  // Hide Header on login + admin pages
  const hideHeader =
    location.pathname === "/login" ||
    location.pathname.startsWith("/admin");

  if (hideHeader || !isAuthenticated) return null;

  const navItems = [
    { id: "home", label: "Home", icon: HomeIcon, path: "/home" },
    { id: "bookings", label: "My Bookings", icon: CalendarIcon, path: "/bookings" },
    { id: "profile", label: "Profile", icon: UserIcon, path: "/profile" },
  ];

  // ⭐ UPDATED LOGOUT HANDLER
  const handleLogout = () => {
    logout();
    navigate("/login"); // ⭐ Redirect to login page
  };

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-white shadow-sm">
      {/* Logo */}
      <img src="/cc.jpg" alt="CourtConnect Logo" className="h-12 object-contain" />

      {/* NAV BAR */}
      <nav className="flex items-center gap-4 bg-[#D8F2ED] px-6 py-2 rounded-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.id} to={item.path} className="relative">
              <motion.div
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer relative z-10"
                style={{
                  color: isActive ? "#FFFFFF" : "#063830",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="navActivePill"
                    className="absolute inset-0 rounded-lg"
                    style={{ backgroundColor: "#063830", zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  />
                )}

                <Icon
                  className="w-5 h-5"
                  color={isActive ? "#FFFFFF" : "#063830"}
                />

                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button onClick={handleLogout} className="p-2 hover:opacity-70 transition">
        <LogOutIcon className="w-6 h-6 text-[#063830]" />
      </button>
    </header>
  );
}
