import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUpIcon,
  CalendarIcon,
  ClockIcon,
  DollarSignIcon
} from 'lucide-react';

// ⭐ FIX: Correct import path for admin types
import { Booking } from '../types/types';

interface DashboardOverviewProps {
  bookings: Booking[];
}

export function DashboardOverview({ bookings }: DashboardOverviewProps) {
  // Calculate stats
  const today = new Date().toISOString().split('T')[0];

  const todayBookings = bookings.filter(b => b.date === today).length;
  const pendingRequests = bookings.filter(b => b.status === 'pending').length;

  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalFee, 0);

  // Find most booked facility
  const facilityCounts = bookings.reduce((acc, b) => {
    acc[b.facility] = (acc[b.facility] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostBooked =
    Object.entries(facilityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    'N/A';

  const stats = [
    {
      label: 'Most Booked Facility',
      value: mostBooked,
      icon: TrendingUpIcon,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: "Today's Bookings",
      value: todayBookings,
      icon: CalendarIcon,
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'Pending Requests',
      value: pendingRequests,
      icon: ClockIcon,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      label: 'Total Revenue',
      value: `${totalRevenue} MAD`,
      icon: DollarSignIcon,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-[#063830] mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
