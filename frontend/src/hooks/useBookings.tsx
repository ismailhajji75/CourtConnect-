import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Booking } from "../types";

interface BookingsContextType {
  bookings: Booking[];
  addBooking: (b: Omit<Booking, "id" | "status">) => Booking;
  cancelBooking: (id: string) => void;
  updateBookingStatus: (id: string, status: Booking["status"]) => void;
}

const BookingsContext = createContext<BookingsContextType | null>(null);

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  /** -----------------------------
   * Load existing bookings
   --------------------------------*/
  useEffect(() => {
    const stored = localStorage.getItem("courtconnect-bookings");
    if (stored) {
      try {
        setBookings(JSON.parse(stored));
      } catch {
        setBookings([]);
      }
    }
  }, []);

  /** -----------------------------
   * Save bookings to localStorage
   --------------------------------*/
  const save = (list: Booking[]) => {
    setBookings(list);
    localStorage.setItem("courtconnect-bookings", JSON.stringify(list));
  };

  /** -----------------------------
   * ADD BOOKING
   * - Free booking   → upcoming
   * - Paid booking   → pending
   --------------------------------*/
  const addBooking = (b: Omit<Booking, "id" | "status">): Booking => {
    const requiresApproval = b.requiresPayment === true;

    const newBooking: Booking = {
      ...b,
      id: Date.now().toString(),
      status: requiresApproval ? "pending" : "upcoming",
    };

    const updated = [...bookings, newBooking];
    save(updated);

    return newBooking;
  };

  /** -----------------------------
   * CANCEL BOOKING
   --------------------------------*/
  const cancelBooking = (id: string) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: "cancelled" } : b
    );
    save(updated);
  };

  /** -----------------------------
   * ADMIN → UPDATE STATUS
   * (Approve, Reject, Mark Past)
   --------------------------------*/
  const updateBookingStatus = (
    id: string,
    status: Booking["status"]
  ) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status } : b
    );
    save(updated);
  };

  return (
    <BookingsContext.Provider
      value={{ bookings, addBooking, cancelBooking, updateBookingStatus }}
    >
      {children}
    </BookingsContext.Provider>
  );
}

/** -----------------------------
 * Hook used by all pages
--------------------------------*/
export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx)
    throw new Error("useBookings must be used inside <BookingsProvider>");
  return ctx;
}
