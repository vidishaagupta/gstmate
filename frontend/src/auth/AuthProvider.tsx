import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { getMe } from './api.js';
import { tokenStore } from './tokenStore.js';

interface User {
  id: string;
  name: string;
  email: string;
  businessName?: string;
  gstin?: string;
  state?: string;
  address?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = tokenStore.get();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getMe();
        if (res.success) {
          setUser(res.data.user);
        } else {
          tokenStore.clear();
        }
      } catch (err) {
        console.error("AuthProvider: Auth check failed", err);
        tokenStore.clear();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    tokenStore.clear();
    setUser(null);
    window.location.href = '/';
  };

  const contextValue = useMemo(() => ({
    user,
    setUser,
    loading,
    logout
  }), [user, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
