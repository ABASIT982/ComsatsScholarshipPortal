'use client';

import { useState } from 'react';
import { 
  Award, 
  Download, 
  Eye, 
  Filter, 
  Search,
  Calendar,
  Users,
  BarChart3,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

export default function MeritListsPage() {
  const [selectedScholarship, setSelectedScholarship] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Scholarship data
  const scholarships = [
    { id: 'academic', name: 'Academic Excellence Scholarship', seats: 50 },
    { id: 'need', name: 'Need-Based Scholarship', seats: 30 },
    { id: 'sports', name: 'Sports Scholarship', seats: 20 },
    { id: 'merit', name: 'Merit-Cum-Means Scholarship', seats: 40 },
  ];

  // Merit lists data
  const meritLists = [
    {
      id: 1,
      name: 'Fall 2024 - Academic Excellence',
      scholarship: 'academic',
      date: '2024-01-15',
      students: 150,
      cutoff: 85.5,
      status: 'published',
    },
    {
      id: 2,
      name: 'Fall 2024 - Need-Based',
      scholarship: 'need',
      date: '2024-01-14',
      students: 120,
      cutoff: 80.0,
      status: 'published',
    },
    {
      id: 3,
      name: 'Spring 2024 - Academic Excellence',
      scholarship: 'academic',
      date: '2023-11-20',
      students: 142,
      cutoff: 84.2,
      status: 'allocated',
    },
    {
      id: 4,
      name: 'Summer 2024 - Sports Scholarship',
      scholarship: 'sports',
      date: '2024-01-10',
      students: 80,
      cutoff: 75.5,
      status: 'draft',
    },
    {
      id: 5,
      name: 'Fall 2024 - Merit-Cum-Means',
      scholarship: 'merit',
      date: '2024-01-12',
      students: 165,
      cutoff: 82.8,
      status: 'published',
    },
    {
      id: 6,
      name: 'Spring 2024 - Need-Based',
      scholarship: 'need',
      date: '2023-11-18',
      students: 110,
      cutoff: 78.5,
      status: 'allocated',
    },
  ];

  // Student data for selected list
  const students = [
    { id: 1, name: 'John Doe', rollNumber: '2023001', score: 92.5, rank: 1, category: 'General', status: 'allocated' },
    { id: 2, name: 'Jane Smith', rollNumber: '2023002', score: 89.3, rank: 2, category: 'OBC', status: 'allocated' },
    { id: 3, name: 'Robert Johnson', rollNumber: '2023003', score: 87.8, rank: 3, category: 'General', status: 'eligible' },
    { id: 4, name: 'Sarah Williams', rollNumber: '2023004', score: 85.2, rank: 4, category: 'SC', status: 'eligible' },
    { id: 5, name: 'Michael Brown', rollNumber: '2023005', score: 82.7, rank: 5, category: 'General', status: 'waiting' },
  ];

  // Filter lists
  const filteredLists = selectedScholarship === 'all' 
    ? meritLists 
    : meritLists.filter(list => list.scholarship === selectedScholarship);

  const getScholarshipName = (id: string) => {
    const scholarship = scholarships.find(s => s.id === id);
    return scholarship ? scholarship.name : 'Unknown Scholarship';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'allocated': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadList = (listId: number) => {
    alert(`Downloading merit list ${listId}`);
  };

  const viewList = (listId: number) => {
    alert(`Viewing merit list ${listId}`);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Merit Lists</h1>
            <p className="text-gray-600">View and manage merit lists for different scholarships</p>
          </div>
        </div>
      </div>

      {/* Scholarship Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Filter by Scholarship</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedScholarship('all')}
            className={`px-4 py-2 rounded-lg ${selectedScholarship === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            All Scholarships
          </button>
          {scholarships.map((scholarship) => (
            <button
              key={scholarship.id}
              onClick={() => setSelectedScholarship(scholarship.id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${selectedScholarship === scholarship.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              <Award size={16} />
              {scholarship.name}
            </button>
          ))}
        </div>
      </div>

      {/* Merit Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredLists.map((list) => (
          <div key={list.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{list.name}</h3>
                  <p className="text-gray-600 text-sm">{getScholarshipName(list.scholarship)}</p>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(list.status)}`}>
                  {list.status.charAt(0).toUpperCase() + list.status.slice(1)}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-400" size={16} />
                  <span className="text-gray-600">Date: {list.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="text-gray-400" size={16} />
                  <span className="text-gray-600">Students: {list.students}</span>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="text-gray-400" size={16} />
                  <span className="text-gray-600">Cutoff: {list.cutoff}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => viewList(list.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Eye size={16} />
                  View List
                </button>
                <button
                  onClick={() => downloadList(list.id)}
                  className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected List Details */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Student Rankings</h2>
              <p className="text-gray-600">Top students in Academic Excellence Scholarship (Fall 2024)</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                <Filter size={20} />
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${student.rank <= 3 ? 'bg-yellow-100 text-yellow-800 font-bold' : 'bg-gray-100 text-gray-800'}`}>
                        {student.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{student.rollNumber}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-lg text-gray-900">{student.score}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      {student.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium flex items-center gap-1 w-fit ${
                      student.status === 'allocated' ? 'bg-green-100 text-green-800' :
                      student.status === 'eligible' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.status === 'allocated' && <CheckCircle size={12} />}
                      {student.status === 'waiting' && <Clock size={12} />}
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {students.length} students | Cutoff: 85.5 | Total Seats: 50
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <Download size={20} />
              Export Full List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}