import React, { useState } from "react";

// ADMIN components
import { Sidebar } from "../components/Sidebar";
import { DashboardOverview } from "../components/DashboardOverview";
import { EveningBookings } from "../components/EveningBookings";
import { AvailabilityManager } from "../components/AvailabilityManager";

// GLOBAL hooks (shared with user)
import { useBookings } from "../../hooks/useBookings";
import { useAuth } from "../../hooks/useAuth";

export function DashboardPage() {
  const { bookings, updateBookingStatus } = useBookings();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "overview" | "evening" | "availability"
  >("overview");

  /* -------------------------------------------
     ADMIN ACCESS — FIXED
  ------------------------------------------- */

  // 1) user is LOADING
  if (user === undefined) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-gray-600">
        Loading...
      </div>
    );
  }

  // 2) user loaded but NOT admin
  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold text-red-600">
        Access Denied — Admins Only
      </div>
    );
  }

  /* -------------------------------------------
     ADMIN: APPROVE BOOKING  (correct status)
  ------------------------------------------- */
  const handleConfirm = (id: string) => {
    updateBookingStatus(id, "approved");
  };

  /* -------------------------------------------
     ADMIN: CANCEL BOOKING
  ------------------------------------------- */
  const handleCancel = (id: string) => {
    updateBookingStatus(id, "cancelled");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === "overview" && (
          <DashboardOverview bookings={bookings} />
        )}

        {activeTab === "evening" && (
          <EveningBookings
            bookings={bookings}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        )}

        {activeTab === "availability" && (
          <AvailabilityManager
            availabilities={[]} 
            onAdd={() => console.log("Add availability")}
            onDelete={() => console.log("Delete availability")}
          />
        )}
      </main>
    </div>
  );
}
