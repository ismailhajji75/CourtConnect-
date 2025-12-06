import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Sidebar } from '../components/Sidebar';
import { NotificationBell } from '../components/NotificationBell';
import { DashboardOverview } from '../components/DashboardOverview';
import { BookingsTable } from '../components/BookingsTable';
import { EveningBookings } from '../components/EveningBookings';
import { AvailabilityManager } from '../components/AvailabilityManager';

// ⭐ Fixed types import path for admin
import { Booking, Availability } from '../types/types';

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // =============================
  // BOOKINGS (Mock Data)
  // =============================
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      user: 'Ahmed El Mansouri',
      date: new Date().toISOString().split('T')[0],
      hour: '18:00',
      totalFee: 30,
      status: 'pending',
      facility: '5v5 Court (Proxy Area)',
      facilityType: 'court',
      includesLights: true
    },
    {
      id: '2',
      user: 'Sarah Benali',
      date: new Date().toISOString().split('T')[0],
      hour: '19:00',
      totalFee: 40,
      status: 'confirmed',
      facility: 'New Soccer Field (Half-Field)',
      facilityType: 'court',
      includesLights: true
    },
    {
      id: '3',
      user: 'Youssef Alami',
      date: new Date().toISOString().split('T')[0],
      hour: '20:00',
      totalFee: 30,
      status: 'pending',
      facility: 'Tennis Courts',
      facilityType: 'court',
      includesLights: true
    },
    {
      id: '4',
      user: 'Fatima Zahra',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      hour: '14:00',
      totalFee: 0,
      status: 'confirmed',
      facility: 'Padel Court',
      facilityType: 'court',
      includesLights: false
    },
    {
      id: '5',
      user: 'Omar Idrissi',
      date: new Date().toISOString().split('T')[0],
      hour: '15:00',
      totalFee: 10,
      status: 'confirmed',
      facility: 'Bicycles',
      facilityType: 'bicycle',
      includesLights: false
    },
    {
      id: '6',
      user: 'Leila Benjelloun',
      date: new Date().toISOString().split('T')[0],
      hour: '18:30',
      totalFee: 10,
      status: 'pending',
      facility: 'Bicycles',
      facilityType: 'bicycle',
      includesLights: false
    },
    {
      id: '7',
      user: 'Karim Tazi',
      date: new Date().toISOString().split('T')[0],
      hour: '10:00',
      totalFee: 0,
      status: 'confirmed',
      facility: '5v5 Court (Proxy Area)',
      facilityType: 'court',
      includesLights: false
    },
    {
      id: '8',
      user: 'Nadia Chraibi',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      hour: '19:30',
      totalFee: 30,
      status: 'confirmed',
      facility: 'Tennis Courts',
      facilityType: 'court',
      includesLights: true
    },
    {
      id: '9',
      user: 'Hassan Berrada',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      hour: '16:00',
      totalFee: 10,
      status: 'confirmed',
      facility: 'Bicycles',
      facilityType: 'bicycle',
      includesLights: false
    },
    {
      id: '10',
      user: 'Amina Lahlou',
      date: new Date().toISOString().split('T')[0],
      hour: '11:00',
      totalFee: 0,
      status: 'confirmed',
      facility: 'New Soccer Field (Half-Field)',
      facilityType: 'court',
      includesLights: false
    }
  ]);

  // =============================
  // AVAILABILITIES (Mock Data)
  // =============================
  const [availabilities, setAvailabilities] = useState<Availability[]>([
    {
      id: '1',
      facility: '5v5 Court (Proxy Area)',
      facilityType: 'court',
      date: new Date().toISOString().split('T')[0],
      startTime: '18:00',
      endTime: '19:00',
      price: 30,
      lightsAvailable: true
    },
    {
      id: '2',
      facility: 'Tennis Courts',
      facilityType: 'court',
      date: new Date().toISOString().split('T')[0],
      startTime: '14:00',
      endTime: '15:00',
      price: 0,
      lightsAvailable: false
    },
    {
      id: '3',
      facility: 'Bicycles',
      facilityType: 'bicycle',
      date: new Date().toISOString().split('T')[0],
      startTime: '13:00',
      endTime: '20:00',
      price: 10,
      lightsAvailable: false
    },
    {
      id: '4',
      facility: 'New Soccer Field (Half-Field)',
      facilityType: 'court',
      date: new Date().toISOString().split('T')[0],
      startTime: '19:00',
      endTime: '20:00',
      price: 40,
      lightsAvailable: true
    }
  ]);

  // =============================
  // ACTION HANDLERS
  // =============================
  const handleConfirmBooking = (id: string) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === id
          ? { ...b, status: 'confirmed' as const }
          : b
      )
    );
  };

  const handleCancelBooking = (id: string) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === id
          ? { ...b, status: 'cancelled' as const }
          : b
      )
    );
  };

  const handleAddAvailability = (availability: Omit<Availability, 'id'>) => {
    const newItem: Availability = {
      ...availability,
      id: Date.now().toString()
    };
    setAvailabilities(prev => [...prev, newItem]);
  };

  const handleDeleteAvailability = (id: string) => {
    setAvailabilities(prev => prev.filter(a => a.id !== id));
  };

  // =============================
  // TAB RENDERING
  // =============================
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <DashboardOverview bookings={bookings} />
            <BookingsTable bookings={bookings.slice(0, 8)} />
          </motion.div>
        );

      case 'evening':
        return (
          <motion.div
            key="evening"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <EveningBookings
              bookings={bookings}
              onConfirm={handleConfirmBooking}
              onCancel={handleCancelBooking}
            />
          </motion.div>
        );

      case 'availability':
        return (
          <motion.div
            key="availability"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AvailabilityManager
              availabilities={availabilities}
              onAdd={handleAddAvailability}
              onDelete={handleDeleteAvailability}
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  // =============================
  // PAGE LAYOUT
  // =============================
  return (
    <div className="flex h-screen bg-[#D8F2ED]">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#063830]">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'evening' && 'Evening Bookings'}
                {activeTab === 'availability' && 'Manage Availability'}
              </h1>

              <p className="text-sm text-gray-600 mt-1">
                {activeTab === 'overview' &&
                  'Monitor facility bookings and performance'}
                {activeTab === 'evening' &&
                  'Review and manage pending evening bookings'}
                {activeTab === 'availability' &&
                  'Add or remove facility availability slots'}
              </p>
            </div>

            <NotificationBell />
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </main>
      </div>
    </div>
  );
}
