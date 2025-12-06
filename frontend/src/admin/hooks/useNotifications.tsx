import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode
} from 'react';

// ⭐ FIX: correct types import path for admin folder
import { Notification } from '../types/types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (type: 'booking' | 'cancellation', message: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'booking',
      message: 'New booking from John Doe for Court A at 18:00',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false
    },
    {
      id: '2',
      type: 'cancellation',
      message: 'Booking cancelled by Sarah Smith for Court B at 19:00',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      read: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (
    type: 'booking' | 'cancellation',
    message: string
  ) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id
          ? {
              ...n,
              read: true
            }
          : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({
        ...n,
        read: true
      }))
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotifications must be used within NotificationProvider'
    );
  }

  return context;
}
