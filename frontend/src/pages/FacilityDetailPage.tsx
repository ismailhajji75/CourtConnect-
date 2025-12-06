import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { facilities, generateTimeSlots, calculatePrice } from "../utils/facilities";
import { useBookings } from "../hooks/useBookings";
import { toast } from "sonner";

import {
  CalendarIcon,
  ClockIcon,
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react";

export default function FacilityDetailPage() {
  const { facilityId } = useParams();
  const navigate = useNavigate();
  const { addBooking } = useBookings();

  const facility = facilities.find((f) => f.id === facilityId);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [equipment, setEquipment] = useState<Record<string, number>>({});
  const [showEquipment, setShowEquipment] = useState(false);

  // 🔥 New state for bicycles
  const [bikeType, setBikeType] = useState<"normal" | "pro">("normal");
  const [rentalPlan, setRentalPlan] =
    useState<"2h" | "daily" | "3d" | "weekly" | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);

  if (!facility) {
    return <div className="p-8 text-center text-red-500">Facility not found.</div>;
  }

  const timeSlots = generateTimeSlots(facility.id, selectedDate);

  // Base price (lights + equipment) for non-bicycles
  const basePrice = selectedTime ? calculatePrice(facility.id, selectedTime, []) : 0;

  // 🛞 Special pricing for bicycles based on type + rental plan
  const getBicyclePrice = () => {
    if (facility.type !== "bicycles" || !rentalPlan) return 0;

    if (bikeType === "normal") {
      switch (rentalPlan) {
        case "2h":
          return 20;
        case "daily":
          return 50;
        case "3d":
          return 130;
        case "weekly":
          return 200;
      }
    } else {
      // professional bike
      switch (rentalPlan) {
        case "2h":
          return 40;
        case "daily":
          return 80;
        case "3d":
          return 170;
        case "weekly":
          return 400;
      }
    }
  };

  const bicyclePrice = getBicyclePrice();
  const price = facility.type === "bicycles" ? bicyclePrice : basePrice;

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setShowEquipment(true);
  };

  const updateEquipment = (itemId: string, delta: number) => {
    const item = facility.availableEquipment.find((e) => e.id === itemId);
    if (!item) return;

    const current = equipment[itemId] || 0;
    const updated = Math.max(0, Math.min(item.quantity, current + delta));
    setEquipment((prev) => ({ ...prev, [itemId]: updated }));
  };

  // -------------------------
  // BOOKING LOGIC (FIXED)
  // -------------------------
  const handleBooking = () => {
    if (!selectedTime) return;

    // Extra guard for bicycles: must select rental plan
    if (facility.type === "bicycles" && !rentalPlan) {
      toast.error("Please choose a rental duration for the bicycle.");
      return;
    }

    const selectedEquipment = Object.entries(equipment)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const item = facility.availableEquipment.find((e) => e.id === id);
        return { name: item?.name || "", quantity: qty };
      });

    facility.availableEquipment
      .filter((item) => item.included)
      .forEach((item) =>
        selectedEquipment.push({ name: item.name, quantity: item.quantity })
      );

    // Any price > 0 means the booking is pending (needs payment)
    const requiresPayment = price > 0;

    addBooking({
      facilityId: facility.id,
      facilityName: facility.name,
      date: selectedDate.toISOString().split("T")[0],
      time: selectedTime,
      duration: 1,
      equipment: selectedEquipment,
      totalPrice: price,
      requiresPayment,
    });

    toast.success(
      requiresPayment
        ? "Booking request sent — waiting admin approval."
        : "Booking confirmed!",
      {
        description: `${facility.name} • ${selectedDate.toLocaleDateString()} at ${selectedTime}`,
      }
    );

    navigate("/bookings");
  };

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/home")}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Back to Facilities
      </button>

      {/* TITLE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#063830" }}>
          {facility.name}
        </h1>
        <p className="text-gray-600">{facility.description}</p>
      </motion.div>

      {/* IMAGE */}
      {facility.image && (
        <img
          src={facility.image}
          alt={facility.name}
          className="w-full h-64 object-cover rounded-xl shadow-md mb-6"
        />
      )}

      {/* DATE PICKER */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="w-5 h-5" style={{ color: "#6CABA8" }} />
          <h2 className="text-xl font-bold" style={{ color: "#063830" }}>
            Select Date
          </h2>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {dates.map((date) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: isSelected ? "#063830" : "white",
                  color: isSelected ? "white" : "#063830",
                  border: `2px solid ${isSelected ? "#063830" : "#6CABA8"}`,
                }}
              >
                <div className="text-xs font-medium">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div className="text-lg font-bold">{date.getDate()}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* TIME SLOTS */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <ClockIcon className="w-5 h-5" style={{ color: "#6CABA8" }} />
          <h2 className="text-xl font-bold" style={{ color: "#063830" }}>
            Select Time
          </h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {timeSlots.map((time) => {
            const isSelected = selectedTime === time;
            const hour = parseInt(time.split(":")[0]);
            const lightingHour = parseInt(facility.lightingStartTime.split(":")[0]);
            const extraFee =
              facility.type === "bicycles"
                ? null
                : hour >= lightingHour
                ? facility.lightingFee
                : null;

            return (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className="flex flex-col items-center justify-center p-3 rounded-lg"
                style={{
                  backgroundColor: isSelected ? "#063830" : "white",
                  color: isSelected ? "white" : "#063830",
                  border: `2px solid ${isSelected ? "#063830" : "#6CABA8"}`,
                  height: "70px",
                }}
              >
                <span className="font-semibold">{time}</span>

                {extraFee && (
                  <span
                    className="text-xs font-medium"
                    style={{ color: isSelected ? "#D8F2ED" : "#6CABA8" }}
                  >
                    +{extraFee} MAD
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* BOOKING SUMMARY */}
      {selectedTime && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: "#063830" }}
          >
            Booking Summary
          </h2>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Facility</span>
              <span className="font-medium">{facility.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-medium">
                {selectedDate.toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Time</span>
              <span className="font-medium">{selectedTime}</span>
            </div>

            {/* 🛞 Extra options only for bicycles */}
            {facility.type === "bicycles" && (
              <>
                {/* Bike type inside summary (1B) */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bike Type</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBikeType("normal")}
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor:
                          bikeType === "normal" ? "#063830" : "#D8F2ED",
                        color: bikeType === "normal" ? "white" : "#063830",
                      }}
                    >
                      Normal
                    </button>
                    <button
                      onClick={() => setBikeType("pro")}
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor:
                          bikeType === "pro" ? "#063830" : "#D8F2ED",
                        color: bikeType === "pro" ? "white" : "#063830",
                      }}
                    >
                      Professional
                    </button>
                  </div>
                </div>

                {/* Rental plan via modal (2C) */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rental Duration</span>
                  <button
                    onClick={() => setShowPlanModal(true)}
                    className="px-3 py-1 rounded-lg text-sm font-medium"
                    style={{ backgroundColor: "#D8F2ED", color: "#063830" }}
                  >
                    {rentalPlan
                      ? (() => {
                          switch (rentalPlan) {
                            case "2h":
                              return "2 Hours";
                            case "daily":
                              return "Daily";
                            case "3d":
                              return "3 Days";
                            case "weekly":
                              return "Weekly";
                          }
                        })()
                      : "Choose Plan"}
                  </button>
                </div>
              </>
            )}

            <div className="flex justify-between text-lg font-bold border-t pt-3">
              <span>Total</span>
              <span>{price} MAD</span>
            </div>
          </div>

          <button
            onClick={handleBooking}
            className="w-full py-4 rounded-lg mt-2 text-white"
            style={{ backgroundColor: "#063830" }}
          >
            {price > 0 ? "Send Booking Request" : "Confirm Booking"}
          </button>
        </motion.div>
      )}

      {/* RENTAL PLAN MODAL (bicycles only) */}
      <AnimatePresence>
        {facility.type === "bicycles" && showPlanModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowPlanModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                         w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6"
            >
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: "#063830" }}
              >
                Choose Rental Plan
              </h3>

              <div className="space-y-3">
                {[
                  { key: "2h", label: "2 Hours", normal: 20, pro: 40 },
                  { key: "daily", label: "Daily", normal: 50, pro: 80 },
                  { key: "3d", label: "3 Days", normal: 130, pro: 170 },
                  { key: "weekly", label: "Weekly", normal: 200, pro: 400 },
                ].map((plan) => (
                  <button
                    key={plan.key}
                    onClick={() => {
                      setRentalPlan(plan.key as any);
                      setShowPlanModal(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-xl border hover:shadow-md transition-all"
                    style={{
                      borderColor:
                        rentalPlan === plan.key ? "#063830" : "#E5E7EB",
                      backgroundColor:
                        rentalPlan === plan.key ? "#D8F2ED" : "white",
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium" style={{ color: "#063830" }}>
                        {plan.label}
                      </span>
                      <span className="text-sm text-gray-600">
                        Normal: {plan.normal} DH • Pro: {plan.pro} DH
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
