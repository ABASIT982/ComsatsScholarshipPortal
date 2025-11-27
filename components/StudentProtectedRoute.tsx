'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../app/contexts/AuthContext';

export default function StudentProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isStudent, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isStudent()) {
      router.push('/login');
    }
  }, [isStudent, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isStudent()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Redirecting to login...</div>
      </div>
    );
  }

  return children;
}