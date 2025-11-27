'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  name: string;
  regno: string;
  token?: string;
  type: 'student' | 'admin'; // ADD TYPE FIELD
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
  // ADD THESE FUNCTIONS
  isStudent: () => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ADD THESE FUNCTIONS
  const isStudent = () => {
    return !!localStorage.getItem('studentToken');
  };

  const isAdmin = () => {
    return !!localStorage.getItem('adminToken');
  };

  useEffect(() => {
    const checkAuth = () => {
      const studentAuth = isStudent();
      const adminAuth = isAdmin();
      
      // If both exist, prefer the current user type
      if (studentAuth && adminAuth) {
        if (user?.type === 'admin') {
          const admin = JSON.parse(localStorage.getItem('admin')!);
          setUser({
            name: admin.name || 'Administrator',
            regno: 'admin',
            token: localStorage.getItem('adminToken')!,
            type: 'admin'
          });
        } else {
          setUser({
            name: localStorage.getItem('studentName')!,
            regno: localStorage.getItem('studentRegno')!,
            token: localStorage.getItem('studentToken')!,
            type: 'student'
          });
        }
      }
      // Only student authenticated
      else if (studentAuth) {
        setUser({
          name: localStorage.getItem('studentName')!,
          regno: localStorage.getItem('studentRegno')!,
          token: localStorage.getItem('studentToken')!,
          type: 'student'
        });
      }
      // Only admin authenticated
      else if (adminAuth) {
        const admin = JSON.parse(localStorage.getItem('admin')!);
        setUser({
          name: admin.name || 'Administrator',
          regno: 'admin',
          token: localStorage.getItem('adminToken')!,
          type: 'admin'
        });
      }
      // No authentication
      else {
        setUser(null);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData: User) => {
    if (userData.regno === 'admin') {
      // Admin login - DON'T clear student data
      localStorage.setItem('adminToken', userData.token || 'admin-token');
      localStorage.setItem('admin', JSON.stringify({ name: userData.name }));
    } else {
      // Student login - DON'T clear admin data
      localStorage.setItem('studentToken', userData.token || 'student-token');
      localStorage.setItem('studentName', userData.name);
      localStorage.setItem('studentRegno', userData.regno);
    }
    setUser({ ...userData, type: userData.regno === 'admin' ? 'admin' : 'student' });
  };

  const logout = () => {
    // Clear everything
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
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      isStudent, // EXPORT THESE
      isAdmin 
    }}>
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