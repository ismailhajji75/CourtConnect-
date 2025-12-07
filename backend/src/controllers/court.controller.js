// src/controllers/court.controller.js
import {
  bookings,
  facilities,
  getNextBookingId,
  users,
} from "../data/mock.js";
import { sendEmail } from "../utils/email.js";

// Helpers
const toDateTime = (dateStr, timeStr) =>
  new Date(`${dateStr}T${timeStr}:00`);

const diffInMinutes = (a, b) => (a.getTime() - b.getTime()) / (1000 * 60);

// ---------------- CREATE BOOKING (STUDENT) ----------------
//
// - Student chooses facilityId, date, startTime
// - For courts → always 1h slot (startTime → startTime + 1h)
// - For bicycles → bikeType + rentalPlan decide price
// - Booking is stored as PENDING
// - Admin must confirm and deduct CashWallet

export const createBooking = (req, res) => {
  const {
    facilityId,
    date,
    startTime,
    bikeType,    // "normal" | "pro" (for bicycles)
    rentalPlan,  // "2h" | "daily" | "3d" | "weekly" (for bicycles)
  } = req.body || {};

  if (!facilityId || !date || !startTime) {
    return res.status(400).json({
      error: "facilityId, date and startTime are required",
    });
  }

  const facility = facilities.find((f) => f.id === facilityId);
  if (!facility) {
    return res.status(404).json({ error: "Facility not found" });
  }

  // Always 1-hour slot for courts / fields / padel
  const start = toDateTime(date, startTime);
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  const startHour = start.getHours();
  const startMinute = start.getMinutes();

  // -------- RULES FOR FUTSAL & HALF FIELD --------
  if (facility.type === "futsal" || facility.type === "half_field") {
    // Last booking time = 20:00 (8pm)
    if (startHour > 20 || (startHour === 20 && startMinute > 0)) {
      return res.status(400).json({
        error: "Last booking time for this field is 8pm.",
      });
    }
  }

  // -------- RULES FOR BICYCLES --------
  let bikeOptions = null;

  if (facility.type === "bicycles") {
    if (!bikeType || !rentalPlan) {
      return res.status(400).json({
        error: "bikeType and rentalPlan are required for bicycle bookings.",
      });
    }

    // Last bicycle booking at 17:00 (5pm)
    if (startHour > 17 || (startHour === 17 && startMinute > 0)) {
      return res.status(400).json({
        error: "Last booking time for bicycles is 5pm.",
      });
    }

    bikeOptions = { bikeType, rentalPlan };
  }

  // -------- TIME CONFLICT CHECK --------
  //
  // No one can book the same facility at overlapping times
  // (PENDING or CONFIRMED). CANCELLED bookings are ignored.

  const conflict = bookings.find((b) => {
    if (b.facilityId !== facility.id || b.date !== date) return false;
    if (b.status === "CANCELLED") return false;

    const existingStart = toDateTime(b.date, b.startTime);
    const existingEnd = toDateTime(b.date, b.endTime);
    return start < existingEnd && end > existingStart;
  });

  if (conflict) {
    return res
      .status(400)
      .json({ error: "This time slot is already booked for this facility." });
  }

  // -------- PRICE CALCULATION --------
  //
  // Courts:
  //  - Futsal light after 18:00 → +30 dh
  //  - Half field light after 18:00 → +40 dh
  //
  // Bicycles:
  //  - Normal:  20 / 50 / 130 / 200
  //  - Pro:     40 / 80 / 170 / 400

  let totalPrice = 0;

  // Light pricing for futsal / half field
  if (facility.type === "futsal" && startHour >= 18) {
    totalPrice += 30;
  }
  if (facility.type === "half_field" && startHour >= 18) {
    totalPrice += 40;
  }

  // Bicycle pricing
  if (facility.type === "bicycles") {
    if (bikeType === "normal") {
      switch (rentalPlan) {
        case "2h":
          totalPrice = 20;
          break;
        case "daily":
          totalPrice = 50;
          break;
        case "3d":
          totalPrice = 130;
          break;
        case "weekly":
          totalPrice = 200;
          break;
        default:
          return res.status(400).json({ error: "Invalid rentalPlan." });
      }
    } else if (bikeType === "pro") {
      switch (rentalPlan) {
        case "2h":
          totalPrice = 40;
          break;
        case "daily":
          totalPrice = 80;
          break;
        case "3d":
          totalPrice = 170;
          break;
        case "weekly":
          totalPrice = 400;
          break;
        default:
          return res.status(400).json({ error: "Invalid rentalPlan." });
      }
    } else {
      return res.status(400).json({ error: "Invalid bikeType." });
    }
  }

  // -------- CREATE PENDING BOOKING --------

  const booking = {
    id: getNextBookingId(),
    userId: req.user.id,
    facilityId: facility.id,
    date,
    startTime,
    endTime: `${end.getHours().toString().padStart(2, "0")}:${end
      .getMinutes()
      .toString()
      .padStart(2, "0")}`,
    totalPrice,
    status: "PENDING", // waits for admin confirmation
    createdAt: new Date().toISOString(),
    bikeOptions,
  };

  bookings.push(booking);

  // Email to user: booking created (pending)
  sendEmail(
    req.user.email,
    "AUI CourtConnect – Booking Request Received",
    `Hi ${req.user.username}, your booking request is created and is pending confirmation by the admin.
Facility: ${facility.name}
Date: ${date}
Time: ${booking.startTime}–${booking.endTime}
Price: ${totalPrice} dh
Status: PENDING (waiting for CashWallet confirmation).`
  );

  res.status(201).json({ message: "Booking created (pending)", booking });
};

// ---------------- GET BOOKINGS ----------------

export const getBookings = (req, res) => {
  if (req.user.role === "ADMIN") {
    return res.json(bookings);
  }
  const own = bookings.filter((b) => b.userId === req.user.id);
  res.json(own);
};

export const getMyBookings = (req, res) => {
  const own = bookings.filter((b) => b.userId === req.user.id);
  res.json(own);
};

// ---------------- CANCEL BOOKING ----------------
//
// - Only owner or admin can cancel.
// - Student cannot cancel less than 2 hours before start.
// - Admin can cancel anytime.
// - Email notification is sent on cancel.

export const cancelBooking = (req, res) => {
  const bookingId = Number(req.params.id);
  const booking = bookings.find((b) => b.id === bookingId);

  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  if (req.user.role !== "ADMIN" && booking.userId !== req.user.id) {
    return res
      .status(403)
      .json({ error: "You are not allowed to cancel this booking." });
  }

  const start = toDateTime(booking.date, booking.startTime);
  const now = new Date();
  const minutesBeforeStart = diffInMinutes(start, now);

  // Students: cannot cancel ≤ 2 hours before start
  if (req.user.role === "STUDENT" && minutesBeforeStart <= 120 && minutesBeforeStart > 0) {
    return res.status(400).json({
      error:
        "You cannot cancel a booking less than 2 hours before the start time.",
    });
  }

  booking.status = "CANCELLED";

  const user = users.find((u) => u.id === booking.userId);
  const facility = facilities.find((f) => f.id === booking.facilityId);

  if (user) {
    sendEmail(
      user.email,
      "AUI CourtConnect – Booking Cancelled",
      `Hi ${user.username}, your booking has been cancelled.
Facility: ${facility?.name ?? "Unknown"}
Date: ${booking.date}
Time: ${booking.startTime}–${booking.endTime}
Status: CANCELLED`
    );
  }

  res.json({ message: "Booking cancelled", booking });
};

// ---------------- ADMIN – PENDING BOOKINGS ----------------

export const getPendingBookings = (req, res) => {
  const pending = bookings.filter((b) => b.status === "PENDING");
  res.json(pending);
};

// ---------------- ADMIN – CONFIRM BOOKING & CASHWALLET ----------------
//
// - Only admin can confirm
// - Checks user's CashWallet balance
// - Deducts and marks booking as CONFIRMED
// - Sends confirmation email

export const confirmBooking = (req, res) => {
  const bookingId = Number(req.params.id);
  const booking = bookings.find((b) => b.id === bookingId);

  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  if (booking.status !== "PENDING") {
    return res
      .status(400)
      .json({ error: "Only pending bookings can be confirmed." });
  }

  const user = users.find((u) => u.id === booking.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found for this booking." });
  }

  if (user.balance < booking.totalPrice) {
    return res
      .status(400)
      .json({ error: "User has insufficient CashWallet balance." });
  }

  // Deduct CashWallet
  user.balance -= booking.totalPrice;
  booking.status = "CONFIRMED";
  booking.paidAt = new Date().toISOString();

  const facility = facilities.find((f) => f.id === booking.facilityId);

  sendEmail(
    user.email,
    "AUI CourtConnect – Booking Confirmed",
    `Hi ${user.username}, your booking has been confirmed and paid via CashWallet.
Facility: ${facility?.name ?? "Unknown"}
Date: ${booking.date}
Time: ${booking.startTime}–${booking.endTime}
Total paid: ${booking.totalPrice} dh
Status: CONFIRMED`
  );

  res.json({ message: "Booking confirmed and CashWallet updated.", booking });
};
