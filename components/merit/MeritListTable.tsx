'use client';

import { useState } from 'react';
import { Download, Eye, Filter, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  rollNumber: string;
  totalScore: number;
  rank: number;
  category: string;
  status: 'eligible' | 'allocated' | 'waiting';
  scores: {
    academic: number;
    entrance: number;
    financial: number;
    interview: number;
  };
}

export default function MeritListTable() {
  const [students] = useState<Student[]>([
    { id: 1, name: 'Abdul Basit', rollNumber: '2023001', totalScore: 92.5, rank: 1, category: 'General', status: 'allocated', scores: { academic: 95, entrance: 90, financial: 8, interview: 9 } },
    { id: 2, name: 'Ali khan', rollNumber: '2023002', totalScore: 89.3, rank: 2, category: 'OBC', status: 'allocated', scores: { academic: 92, entrance: 85, financial: 9, interview: 8 } },
    { id: 3, name: 'Talha Malik', rollNumber: '2023003', totalScore: 87.8, rank: 3, category: 'General', status: 'eligible', scores: { academic: 88, entrance: 90, financial: 7, interview: 8 } },
    { id: 4, name: 'Ahmad Raza', rollNumber: '2023004', totalScore: 85.2, rank: 4, category: 'SC', status: 'eligible', scores: { academic: 90, entrance: 82, financial: 9, interview: 7 } },
    { id: 5, name: 'Waqas Ahmad', rollNumber: '2023005', totalScore: 82.7, rank: 5, category: 'General', status: 'waiting', scores: { academic: 85, entrance: 80, financial: 6, interview: 8 } },
  ]);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) || 
                         student.rollNumber.includes(search);
    const matchesFilter = filter === 'all' || student.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'allocated': return 'bg-green-100 text-green-800';
      case 'eligible': return 'bg-blue-100 text-blue-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportList = () => {
    // Export functionality
    alert('Exporting merit list...');
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Merit List</h2>
            <p className="text-gray-600">Top {students.length} students sorted by merit score</p>
          </div>
          <button
            onClick={exportList}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
          >
            <Download size={20} />
            Export List
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="allocated">Allocated</option>
              <option value="eligible">Eligible</option>
              <option value="waiting">Waiting</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <>
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${student.rank <= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                        {student.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.rollNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      {student.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-lg text-gray-900">{student.totalScore.toFixed(1)}</div>
                    <div className="text-sm text-gray-500">/100</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(student.status)}`}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setExpandedRow(expandedRow === student.id ? null : student.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Details"
                      >
                        {expandedRow === student.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="View Full Profile"
                      >
                        <Eye size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Row - Score Breakdown */}
                {expandedRow === student.id && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 bg-blue-50">
                      <div className="p-4 bg-white rounded-lg shadow-inner">
                        <h4 className="font-semibold mb-3">Score Breakdown</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">Academic</div>
                            <div className="text-2xl font-bold text-blue-600">{student.scores.academic}</div>
                            <div className="text-xs text-gray-500">/100</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">Entrance</div>
                            <div className="text-2xl font-bold text-blue-600">{student.scores.entrance}</div>
                            <div className="text-xs text-gray-500">/100</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">Financial Need</div>
                            <div className="text-2xl font-bold text-blue-600">{student.scores.financial}</div>
                            <div className="text-xs text-gray-500">/10</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">Interview</div>
                            <div className="text-2xl font-bold text-blue-600">{student.scores.interview}</div>
                            <div className="text-xs text-gray-500">/10</div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredStudents.length} of {students.length} students
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-sm text-gray-600">Cutoff Score</div>
              <div className="font-bold text-lg">85.0</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Allocated</div>
              <div className="font-bold text-lg text-green-600">2</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Waiting</div>
              <div className="font-bold text-lg text-yellow-600">3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}