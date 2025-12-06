import React, { useState, createContext, useContext, ReactNode, useEffect } from "react";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("cc_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) localStorage.setItem("cc_user", JSON.stringify(user));
    else localStorage.removeItem("cc_user");
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const auiEmailRegex = /^[a-zA-Z0-9._%+-]+@aui\.ma$/;

    if (!auiEmailRegex.test(email)) return false;
    if (password.length === 0) return false;

    const namePart = email.split("@")[0];
    const parts = namePart.split(".");

    const firstName = parts[0] || "User";
    const lastName = parts[1] || "";

    const userData: User = {
      email,
      firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
      lastName: lastName ? lastName.charAt(0).toUpperCase() + lastName.slice(1) : "",
      profilePicture: undefined,
    };

    setUser(userData);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cc_user");
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem("cc_user", JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
