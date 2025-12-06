'use client';

import { useState } from 'react';
import { DollarSign, CheckCircle, XCircle, Users, Award, Target, Zap } from 'lucide-react';

export default function AllocatePage() {
  const [allocations, setAllocations] = useState([
    { id: 1, name: 'Academic Excellence', totalSeats: 50, allocated: 45, remaining: 5, color: 'blue' },
    { id: 2, name: 'Need-Based', totalSeats: 30, allocated: 28, remaining: 2, color: 'green' },
    { id: 3, name: 'Sports Scholarship', totalSeats: 20, allocated: 15, remaining: 5, color: 'yellow' },
    { id: 4, name: 'Merit-Cum-Means', totalSeats: 40, allocated: 35, remaining: 5, color: 'purple' },
  ]);

  const [students, setStudents] = useState([
    { id: 1, name: 'John Doe', score: 92.5, scholarship: 'Academic Excellence', status: 'allocated' },
    { id: 2, name: 'Jane Smith', score: 89.3, scholarship: 'Need-Based', status: 'allocated' },
    { id: 3, name: 'Robert Johnson', score: 87.8, scholarship: null, status: 'pending' },
    { id: 4, name: 'Sarah Williams', score: 85.2, scholarship: null, status: 'pending' },
    { id: 5, name: 'Michael Brown', score: 82.7, scholarship: 'Sports Scholarship', status: 'allocated' },
  ]);

  const toggleAllocation = (studentId: number) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        const newStatus = student.status === 'allocated' ? 'pending' : 'allocated';
        return { ...student, status: newStatus };
      }
      return student;
    }));
  };

  const autoAllocate = () => {
    alert('Auto-allocation completed!');
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <DollarSign className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Scholarship Allocation</h1>
        </div>
        <p className="text-gray-600">Allocate scholarships to top merit students based on available seats</p>
      </div>

      {/* Scholarship Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Scholarships</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Allocated Seats</p>
              <p className="text-2xl font-bold text-gray-900">123</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-yellow-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Users className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available Seats</p>
              <p className="text-2xl font-bold text-gray-900">17</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Allocation Rate</p>
              <p className="text-2xl font-bold text-gray-900">88%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scholarship Seat Matrix */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Seat Allocation Matrix</h2>
            <p className="text-gray-600">Available seats across all scholarship types</p>
          </div>
          <button
            onClick={autoAllocate}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Zap size={20} />
            Auto Allocate
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allocations.map((scholarship) => (
            <div key={scholarship.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">{scholarship.name}</h3>
                <span className={`px-3 py-1 text-xs rounded-full ${
                  scholarship.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                  scholarship.color === 'green' ? 'bg-green-100 text-green-800' :
                  scholarship.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {scholarship.remaining} seats left
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Allocated: {scholarship.allocated}</span>
                  <span>Total: {scholarship.totalSeats}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      scholarship.color === 'blue' ? 'bg-blue-500' :
                      scholarship.color === 'green' ? 'bg-green-500' :
                      scholarship.color === 'yellow' ? 'bg-yellow-500' :
                      'bg-purple-500'
                    }`}
                    style={{ width: `${(scholarship.allocated / scholarship.totalSeats) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Remaining: {scholarship.remaining}</span>
                <span className="font-medium">
                  {Math.round((scholarship.allocated / scholarship.totalSeats) * 100)}% filled
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Allocation Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Student Allocation</h2>
          <p className="text-gray-600">Manage scholarship allocation for top students</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scholarship</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{student.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-lg text-gray-900">{student.score}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      {student.scholarship || 'Not Assigned'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      student.status === 'allocated' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleAllocation(student.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        student.status === 'allocated'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {student.status === 'allocated' ? 'Revoke' : 'Allocate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}