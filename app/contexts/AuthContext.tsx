// app/contexts/AuthContext.tsx
'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  name: string;
  regno: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Check for student auth
      const studentToken = localStorage.getItem('studentToken');
      const studentName = localStorage.getItem('studentName');
      const studentRegno = localStorage.getItem('studentRegno');
      
      // Check for admin auth
      const adminToken = localStorage.getItem('adminToken');
      const adminData = localStorage.getItem('admin');
      
      if (studentToken && studentName && studentRegno) {
        setUser({
          name: studentName,
          regno: studentRegno,
          token: studentToken
        });
      } else if (adminToken && adminData) {
        // For admin, use a generic user object
        const admin = JSON.parse(adminData);
        setUser({
          name: admin.name || 'Administrator',
          regno: 'admin',
          token: adminToken
        });
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData: User) => {
    if (userData.regno === 'admin') {
      // Admin login
      localStorage.setItem('adminToken', userData.token || 'dummy-token');
    } else {
      // Student login
      localStorage.setItem('studentToken', userData.token || 'dummy-token');
      localStorage.setItem('studentName', userData.name);
      localStorage.setItem('studentRegno', userData.regno);
    }
    setUser(userData);
  };

  const logout = () => {
    // Clear both student and admin data
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentName');
    localStorage.removeItem('studentRegno');
    localStorage.removeItem('studentLevel');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    sessionStorage.removeItem('adminAuth');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};