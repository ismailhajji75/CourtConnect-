import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { facilities } from "../utils/facilities";
import {
  BikeIcon,
  ClockIcon,
  ZapIcon,
  PackageIcon,
  BoxIcon,
} from "lucide-react";

const facilityIcons = {
  tennis: BoxIcon,
  padel: BoxIcon,
  soccer: BoxIcon,
  futsal: BoxIcon,
  basketball: BoxIcon,
  bicycles: BikeIcon,
};

export default function HomePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("tennis");

  const activeFacility = facilities.find((f) => f.type === activeTab);

  const tabs = [
    { id: "tennis", label: "Tennis" },
    { id: "padel", label: "Padel" },
    { id: "soccer", label: "Soccer" },
    { id: "futsal", label: "Futsal" },
    { id: "basketball", label: "Basketball" },
    { id: "bicycles", label: "Bicycles" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* ---------------- HERO ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: "#063830" }}>
          Your Game, One Tap Away
        </h1>
        <p className="text-lg sm:text-xl mb-8" style={{ color: "#6CABA8" }}>
          Book your favorite sports facilities on campus
        </p>
      </motion.div>

      {/* ---------------- TABS ---------------- */}
      <div className="mb-8">
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = facilityIcons[tab.id as keyof typeof facilityIcons];

            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="relative flex items-center gap-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all"
                style={{
                  color: isActive ? "white" : "#6CABA8",
                  backgroundColor: isActive ? "#063830" : "white",   // ✅ FIXED
                }}
              >
                {/* Background glow (behind content) */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 rounded-lg"
                    style={{ backgroundColor: "#063830", zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  />
                )}

                <Icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ---------------- FACILITY CARD ---------------- */}
      <AnimatePresence mode="wait">
        {activeFacility && (
          <motion.div
            key={activeFacility.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.005, transition: { duration: 0.25 } }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* LEFT SIDE */}
              <div>
                <h2 className="text-3xl font-bold mb-4" style={{ color: "#063830" }}>
                  {activeFacility.name}
                </h2>

                <p className="text-gray-600 mb-6">{activeFacility.description}</p>

                {/* HOURS */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <ClockIcon className="w-5 h-5 mt-1" style={{ color: "#6CABA8" }} />
                    <div>
                      <p className="font-medium" style={{ color: "#063830" }}>Operating Hours</p>
                      <p className="text-sm text-gray-600">{activeFacility.hours.weekday}</p>
                      <p className="text-sm text-gray-600">{activeFacility.hours.weekend}</p>
                    </div>
                  </div>

                  {activeFacility.lightingFee > 0 && (
                    <div className="flex items-start gap-3">
                      <ZapIcon className="w-5 h-5 mt-1" style={{ color: "#6CABA8" }} />
                      <div>
                        <p className="font-medium" style={{ color: "#063830" }}>Lighting Fee</p>
                        <p className="text-sm text-gray-600">
                          {activeFacility.lightingFee} MAD/hour after {activeFacility.lightingStartTime}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <PackageIcon className="w-5 h-5 mt-1" style={{ color: "#6CABA8" }} />
                    <div>
                      <p className="font-medium" style={{ color: "#063830" }}>Equipment</p>

                      {activeFacility.includedEquipment.length > 0 ? (
                        <p className="text-sm text-gray-600">
                          Included: {activeFacility.includedEquipment.join(", ")}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-600">Bring your own equipment</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* NOTES */}
                {activeFacility.notes.length > 0 && (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: "#D8F2ED" }}>
                    <p className="font-medium mb-2" style={{ color: "#063830" }}>Important Notes:</p>
                    <ul className="space-y-1">
                      {activeFacility.notes.map((n, i) => (
                        <li key={i} className="text-sm text-gray-700">• {n}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* RIGHT SIDE */}
              <div className="flex flex-col justify-center items-center">
                {activeFacility.image && (
                  <motion.img
                    src={activeFacility.image}
                    alt={activeFacility.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full rounded-xl mb-6 shadow-md object-cover"
                    style={{ maxHeight: "260px" }}
                  />
                )}

                {activeFacility.bookingRequired ? (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(`/facility/${activeFacility.id}`)}
                    className="w-full py-4 rounded-lg text-white font-medium text-lg transition-all hover:opacity-90"
                    style={{ backgroundColor: "#063830" }}
                  >
                    Book Now
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center p-6 rounded-lg"
                    style={{ backgroundColor: "#D8F2ED" }}
                  >
                    <p className="text-lg font-medium mb-2" style={{ color: "#063830" }}>
                      Walk-In Only
                    </p>
                    <p className="text-gray-600">No booking required. First-come, first-served.</p>
                  </motion.div>
                )}

                {activeFacility.capacity && (
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Capacity: {activeFacility.capacity}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
