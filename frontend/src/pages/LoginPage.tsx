import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';   // ⭐ REQUIRED
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { LogInIcon, MailIcon, LockIcon } from 'lucide-react';

// ⭐⭐⭐ SUPER ADMIN CREDENTIALS
const SUPERADMIN = {
  email: "superadmin@courtconnect.com",
  password: "Q!7zP@92kL#tX4mB"
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();   // ⭐ ADD THIS

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // ⭐⭐⭐ SUPER ADMIN FRONTEND CHECK
    if (email === SUPERADMIN.email && password === SUPERADMIN.password) {

      // ⭐ REDIRECT TO INTERNAL ADMIN DASHBOARD
      window.location.href = "/admin/dashboard";
      return;
    }

    // Normal login flow
    const success = await login(email, password);

    if (!success) {
      setError('Invalid AUI email or password. Please use format: f.lastname@aui.ma');
      setLoading(false);
      return;
    }

    navigate("/home");  // normal user redirect
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#D8F2ED' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/cc.jpg" alt="CourtConnect Logo" className="h-24 w-auto" />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#063830' }}>
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to book your favorite facilities</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: '#063830' }}
              >
                AUI Email
              </label>
              <div className="relative">
                <MailIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                />
                <input
                  id="email"
                  type="email"
                  placeholder="f.lastname@aui.ma"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#6CABA8' }}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: '#063830' }}
              >
                Password
              </label>
              <div className="relative">
                <LockIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none"
                  style={{ borderColor: '#6CABA8' }}
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-600 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-medium hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#063830' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogInIcon className="w-5 h-5" />
                  Sign In
                </span>
              )}
            </button>
          </form>

          {/* Help Text */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Use your AUI Outlook credentials to sign in
          </p>
        </div>
      </motion.div>
    </div>
  );
}
