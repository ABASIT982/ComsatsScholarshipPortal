'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  name: string;
  regno: string;
  token?: string;
  email?: string; 
  type: 'student' | 'admin'; 
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
  isStudent: () => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
      
      //-------------------------This is for  If both exist, prefer the current user type---------------------------
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
      //--------------------------This is for Only student authenticated------------------------------------------
      else if (studentAuth) {
        setUser({
          name: localStorage.getItem('studentName')!,
          regno: localStorage.getItem('studentRegno')!,
          token: localStorage.getItem('studentToken')!,
          type: 'student'
        });
      }
      //-------------------------This is for  Only admin authenticated---------------------------------
      else if (adminAuth) {
        const admin = JSON.parse(localStorage.getItem('admin')!);
        setUser({
          name: admin.name || 'Administrator',
          regno: 'admin',
          token: localStorage.getItem('adminToken')!,
          type: 'admin'
        });
      }
      //----------------------------------This is for  No authentication---------------------------------------
      else {
        setUser(null);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData: User) => {
    if (userData.regno === 'admin') {
  //-----------------------------------This is for  Admin login - DON'T clear student data---------------------------------------
      localStorage.setItem('adminToken', userData.token || 'admin-token');
      localStorage.setItem('admin', JSON.stringify({ name: userData.name }));
    } else {
  //----------------------------------This is for  Student login - DON'T clear admin data-------------------------------------
      localStorage.setItem('studentToken', userData.token || 'student-token');
      localStorage.setItem('studentName', userData.name);
      localStorage.setItem('studentRegno', userData.regno);
      localStorage.setItem('studentEmail', userData.email || '');

    }
    setUser({ ...userData, type: userData.regno === 'admin' ? 'admin' : 'student' });
  };

  const logout = () => {
    //--------------------------------------This is for  Clear everything--------------------------------------------
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
      isStudent, 
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