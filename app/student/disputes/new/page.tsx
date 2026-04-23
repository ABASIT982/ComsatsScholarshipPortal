'use client';

import { useEffect, useState } from 'react';
import StudentDisputeForm from '@/components/StudentDisputeForm';
import { useRouter } from 'next/navigation';

interface StudentInfo {
  id: string;
  name: string;
  email: string;
  roll_no: string;
}

export default function NewDisputePage() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentData: StudentInfo = {
      id: localStorage.getItem('studentToken') || 'STU001',
      name: localStorage.getItem('studentName') || 'Test Student',
      email: localStorage.getItem('studentEmail') || 'student@example.com',
      roll_no: localStorage.getItem('studentRegno') || 'CS-2024-001',
    };
    
    setStudent(studentData);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline mb-4 flex items-center gap-1"
        >
          ← Back to My Disputes
        </button>
        <StudentDisputeForm student={student!} />
      </div>
    </div>
  );
}