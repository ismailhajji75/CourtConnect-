import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// USER auth provider
import { AuthProvider } from "./hooks/useAuth";

// USER components
import Header from "./components/Header";

// USER pages
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import FacilityDetailPage from "./pages/FacilityDetailPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import ProfilePage from "./pages/ProfilePage";

// ADMIN root dashboard page
import AdminDashboard from "./admin/AdminDashboard";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />

        <Routes>
          {/* Redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* USER ROUTES */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/facility/:facilityId" element={<FacilityDetailPage />} />
          <Route path="/bookings" element={<MyBookingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* ADMIN ROUTE */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
