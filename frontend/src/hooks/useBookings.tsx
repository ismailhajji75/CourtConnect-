import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// FIXED IMPORT PATH
import { Booking } from "../types/types";

interface BookingsContextType {
  bookings: Booking[];
  addBooking: (b: Omit<Booking, "id" | "status">) => Booking;
  cancelBooking: (id: string) => void;
  updateBookingStatus: (id: string, status: Booking["status"]) => void;
  markPastBookings: () => void;
}

const STORAGE_KEY = "courtconnect-bookings";

const BookingsContext = createContext<BookingsContextType | null>(null);

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setBookings(JSON.parse(stored));
      } catch {
        setBookings([]);
      }
    }
  }, []);

  const save = (list: Booking[]) => {
    setBookings(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const addBooking = (b: Omit<Booking, "id" | "status">): Booking => {
    const requiresApproval = b.requiresPayment === true;

    const newBooking: Booking = {
      ...b,
      id: Date.now().toString(),
      status: requiresApproval ? "pending" : "upcoming",
    };

    save([...bookings, newBooking]);
    return newBooking;
  };

  const cancelBooking = (id: string) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: "cancelled" } : b
    );
    save(updated);
  };

  const updateBookingStatus = (id: string, status: Booking["status"]) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status } : b
    );
    save(updated);
  };

  const markPastBookings = () => {
    const today = new Date().toISOString().split("T")[0];

    const updated = bookings.map((b) => {
      if (b.date < today && b.status !== "cancelled") {
        return { ...b, status: "past" };
      }
      return b;
    });

    save(updated);
  };

  return (
    <BookingsContext.Provider
      value={{
        bookings,
        addBooking,
        cancelBooking,
        updateBookingStatus,
        markPastBookings,
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx)
    throw new Error("useBookings must be used inside <BookingsProvider>");
  return ctx;
}
