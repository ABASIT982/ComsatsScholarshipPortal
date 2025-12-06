'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function AllocationPanel() {
  const [totalSeats, setTotalSeats] = useState(10);
  const [allocatedSeats, setAllocatedSeats] = useState(7);

  const students = [
    { id: 1, name: 'John Doe', score: 92.5, allocated: true },
    { id: 2, name: 'Jane Smith', score: 89.3, allocated: true },
    { id: 3, name: 'Robert Johnson', score: 87.8, allocated: false },
    { id: 4, name: 'Sarah Williams', score: 85.2, allocated: false },
    { id: 5, name: 'Michael Brown', score: 82.7, allocated: false },
  ];

  const toggleAllocation = (id: number) => {
    // Toggle logic
    alert(`Toggled allocation for student ${id}`);
  };

  const runAutoAllocation = () => {
    alert('Running auto-allocation based on merit list...');
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Scholarship Allocation</h2>
          <p className="text-gray-600">Allocate scholarships to top merit students</p>
        </div>
        <button
          onClick={runAutoAllocation}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCw size={20} />
          Auto Allocate
        </button>
      </div>

      {/* Seat Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-700">Total Available Seats</div>
          <div className="text-3xl font-bold text-blue-900">{totalSeats}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-sm text-green-700">Allocated Seats</div>
          <div className="text-3xl font-bold text-green-900">{allocatedSeats}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-sm text-yellow-700">Remaining Seats</div>
          <div className="text-3xl font-bold text-yellow-900">{totalSeats - allocatedSeats}</div>
        </div>
      </div>

      {/* Allocation List */}
      <div className="space-y-4">
        {students.map((student) => (
          <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
            <div>
              <div className="font-medium">{student.name}</div>
              <div className="text-sm text-gray-600">Score: {student.score} | Rank: {student.id}</div>
            </div>
            <div className="flex items-center gap-4">
              {student.allocated ? (
                <span className="flex items-center gap-2 text-green-600">
                  <CheckCircle size={20} />
                  Allocated
                </span>
              ) : (
                <span className="flex items-center gap-2 text-gray-500">
                  <XCircle size={20} />
                  Not Allocated
                </span>
              )}
              <button
                onClick={() => toggleAllocation(student.id)}
                className={`px-4 py-2 rounded-lg ${student.allocated ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
              >
                {student.allocated ? 'Revoke' : 'Allocate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}