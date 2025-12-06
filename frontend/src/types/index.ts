/* --------------------------------------------------
   BOOKING STATUS TYPES
-------------------------------------------------- */

export type BookingStatus =
  | "upcoming"     // Free slots → auto confirmed
  | "pending"      // Payment-required → waiting admin approval
  | "approved"     // Admin accepted payment
  | "rejected"     // Admin rejected booking
  | "cancelled"    // User cancelled
  | "past";        // Automatically moved after date has passed

/* --------------------------------------------------
   BOOKING MODEL
-------------------------------------------------- */

export interface Booking {
  id: string;
  facilityId: string;
  facilityName: string;
  date: string;  // YYYY-MM-DD
  time: string;
  duration: number; // usually 1 hour

  equipment: {
    name: string;
    quantity: number;
  }[];

  totalPrice: number;

  requiresPayment: boolean;   // TRUE if time slot has lighting fee or premium rules
  status: BookingStatus;      // pending, upcoming, etc.
}

/* --------------------------------------------------
   EQUIPMENT + FACILITY TYPES
-------------------------------------------------- */

export interface EquipmentItem {
  id: string;
  name: string;
  quantity: number;
  included?: boolean; // free
}

export interface Facility {
  id: string;
  name: string;
  type: string;
  description: string;

  hours: {
    weekday: string;
    weekend: string;
  };

  lightingFee: number;
  lightingStartTime: string;

  includedEquipment: string[];
  availableEquipment: EquipmentItem[];

  notes: string[];

  capacity?: number;
  bookingRequired: boolean;

  image: string; // FIXED: always image, not imageUrl
}
