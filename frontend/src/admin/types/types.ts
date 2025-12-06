/* ==================================================
   SHARED ADMIN TYPES – FINAL VERSION
   Used by: Dashboard, BookingsTable, EveningBookings,
            AvailabilityManager, NotificationBell, Stats
================================================== */

/* --------------------------------------------------
   ENUM-LIKE LITERAL TYPES
-------------------------------------------------- */

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled';
export type FacilityType = 'court' | 'bicycle';
export type NotificationType = 'booking' | 'cancellation';

/* --------------------------------------------------
   BOOKING (Admin booking objects)
   Used in tables, pending evening review, stats
-------------------------------------------------- */
export interface Booking {
  id: string;
  user: string;
  facility: string;            // e.g., "5v5 Court (Proxy Area)"
  facilityType: FacilityType;  // court | bicycle

  date: string;                // YYYY-MM-DD
  hour: string;                // HH:mm

  totalFee: number;            // MAD
  status: BookingStatus;       // confirmed | pending | cancelled

  includesLights: boolean;     // required: true only for evening/lights
}

/* --------------------------------------------------
   AVAILABILITY SLOTS (Admin availability manager)
-------------------------------------------------- */
export interface Availability {
  id: string;

  facility: string;
  facilityType: FacilityType;  // court | bicycle

  date: string;                // YYYY-MM-DD
  startTime: string;           // HH:mm
  endTime: string;             // HH:mm

  price: number;               // MAD (0 for daytime courts)

  // Whether this slot allows evening lighting:
  lightsAvailable: boolean;
}

/* --------------------------------------------------
   NOTIFICATION SYSTEM (Bell dropdown)
-------------------------------------------------- */
export interface Notification {
  id: string;
  type: NotificationType;      // booking | cancellation
  message: string;

  timestamp: Date;             // actual Date object
  read: boolean;
}

/* --------------------------------------------------
   DASHBOARD STATS SUMMARY
   Used in DashboardOverview top cards
-------------------------------------------------- */
export interface DashboardStats {
  mostBooked: string;          // Facility name
  todayBookings: number;       // count
  pendingRequests: number;     // count
  totalRevenue: number;        // MAD
}
