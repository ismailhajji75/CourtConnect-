import React, {
  useState,
  createContext,
  useContext,
  ReactNode
} from 'react';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication – Admin panel has its own login definition
    const isAUI = /^[a-z]\.[a-z]+@aui\.ma$/i.test(email);

    if (isAUI && password.length > 0) {
      const name = email.split('@')[0].replace('.', ' ');

      setUser({
        email,
        name: name.charAt(0).toUpperCase() + name.slice(1)
      });

      setIsAuthenticated(true);
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);

    // Optional cleanup for Admin role
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
