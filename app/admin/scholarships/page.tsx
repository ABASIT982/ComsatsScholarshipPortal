'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Calendar, Trash2, Award, Settings, ListChecks } from 'lucide-react';

interface Scholarship {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'active' | 'inactive';
  created_at: string;
  scoring_criteria: any;
  merit_list_generated: boolean;
  number_of_awards: number;
}

export default function AdminScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const response = await fetch('/api/scholarships');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch scholarships');
      }

      setScholarships(data.scholarships || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteScholarship = async (scholarshipId: string) => {
    if (!confirm('Are you sure you want to delete this scholarship? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/scholarships/${scholarshipId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete scholarship');
      }

      setScholarships(prev => prev.filter(s => s.id !== scholarshipId));
      alert('Scholarship deleted successfully!');
      
    } catch (error: any) {
      alert('Error deleting scholarship: ' + error.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">Loading scholarships...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Scholarships</h1>
            <p className="text-gray-600 mt-2">Manage all scholarship programs</p>
          </div>
          <Link
            href="/admin/scholarships/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add Scholarship
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Scholarships Grid */}
        {scholarships.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No scholarships yet</h3>
            <p className="text-gray-600 mb-6">Create your first scholarship to get started</p>
            <Link
              href="/admin/scholarships/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Create Scholarship
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scholarships.map((scholarship) => (
              <div
                key={scholarship.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      scholarship.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {scholarship.status}
                  </span>
                  
                  {/* Actions */}
                  <div className="flex gap-1">
                    <Link
                      href={`/admin/scholarships/${scholarship.id}`}
                      className="flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      title="Edit Scholarship"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => deleteScholarship(scholarship.id)}
                      className="flex items-center justify-center w-8 h-8 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Delete Scholarship"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-lg text-gray-900 mb-3 line-clamp-2">
                  {scholarship.title}
                </h3>

                {/* Description Preview */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {scholarship.description}
                </p>

                {/* Merit Status */}
                <div className="mb-4">
                  {scholarship.scoring_criteria ? (
                    <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      <Settings size={12} /> Criteria Set
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      <Settings size={12} /> No Criteria
                    </span>
                  )}
                  
                  {scholarship.merit_list_generated && (
                    <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">
                      <ListChecks size={12} /> Merit Generated
                    </span>
                  )}
                </div>

                {/* Merit Action Buttons */}
                <div className="flex gap-2 mb-4">
                  <Link
                    href={`/admin/scholarships/${scholarship.id}?tab=crieteria`}
                    className={`flex-1 text-center px-3 py-2 text-xs rounded-lg transition-colors ${
                      scholarship.scoring_criteria 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {scholarship.scoring_criteria ? 'Edit Criteria' : 'Set Criteria'}
                  </Link>
                  
                  <Link
                    href={`/admin/merit/${scholarship.id}`}
                    className={`flex-1 text-center px-3 py-2 text-xs rounded-lg transition-colors ${
                      scholarship.merit_list_generated
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : scholarship.scoring_criteria
                        ? 'bg-gray-800 text-white hover:bg-gray-900'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      if (!scholarship.scoring_criteria) {
                        e.preventDefault();
                        alert('Please set scoring criteria first');
                      }
                    }}
                  >
                    {scholarship.merit_list_generated ? 'View Merit List' : 'Generate Merit'}
                  </Link>
                </div>

                {/* Deadline */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
                  <Calendar size={16} />
                  <span>Deadline: {formatDate(scholarship.deadline)}</span>
                </div>

                {/* Created Date */}
                <div className="text-xs text-gray-400 mt-2">
                  Created: {formatDate(scholarship.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}