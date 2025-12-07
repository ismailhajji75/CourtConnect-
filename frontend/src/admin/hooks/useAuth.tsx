// src/hooks/useAuth.tsx

import { createContext, useContext, useState } from "react";

interface User {
  email: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    // 🔐 SUPER ADMIN (ONLY ONE EXISTS)
    if (
      email === "superadmin@courtconnect.com" &&
      password === "Q!7zP@92kL#tX4mB"
    ) {
      setUser({ email, role: "admin" });
      setIsAuthenticated(true);
      return true;
    }

    // 👤 NORMAL USER VALIDATION (AUI EMAILS ONLY)
    const isAUI = /^[a-z]\.[a-z]+@aui\.ma$/i.test(email);
    if (!isAUI) return false;

    // normal user
    setUser({ email, role: "user" });
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
