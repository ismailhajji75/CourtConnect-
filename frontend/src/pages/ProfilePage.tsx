import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { UserIcon, CameraIcon, LogOutIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {  
  const { user, updateProfile, logout } = useAuth();

  if (!user) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ profilePicture: reader.result as string });
        toast.success('Profile picture updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: '#D8F2ED' }}
            >
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-16 h-16" style={{ color: '#6CABA8' }} />
              )}
            </div>

            <label
              htmlFor="photo-upload"
              className="absolute bottom-0 right-0 p-2 rounded-full cursor-pointer transition-all hover:opacity-90"
              style={{ backgroundColor: '#063830' }}
            >
              <CameraIcon className="w-5 h-5 text-white" />
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          <p className="text-sm text-gray-500 mt-3">
            Click camera icon to change photo
          </p>
        </div>

        {/* User Info */}
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#063830' }}>
              First Name
            </label>
            <div
              className="w-full px-4 py-3 rounded-lg"
              style={{ backgroundColor: '#D8F2ED', color: '#063830' }}
            >
              {user.firstName}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#063830' }}>
              Last Name
            </label>
            <div
              className="w-full px-4 py-3 rounded-lg"
              style={{ backgroundColor: '#D8F2ED', color: '#063830' }}
            >
              {user.lastName}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#063830' }}>
              Email
            </label>
            <div
              className="w-full px-4 py-3 rounded-lg"
              style={{ backgroundColor: '#D8F2ED', color: '#063830' }}
            >
              {user.email}
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: '#063830' }}
        >
          <LogOutIcon className="w-5 h-5" />
          Log Out
        </button>
      </motion.div>
    </div>
  );
}
