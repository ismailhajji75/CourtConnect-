// src/admin/AdminDashboard.tsx

import React from "react";

// Admin providers
import { AuthProvider } from "./hooks/useAuth";
import { NotificationProvider } from "./hooks/useNotifications";

// Main admin page
import { DashboardPage } from "./pages/DashboardPage";

export default function AdminDashboard() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <DashboardPage />
      </NotificationProvider>
    </AuthProvider>
  );
}
