'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Calendar, Trash2, Award, Settings, ListChecks } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

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
  const router = useRouter();
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
      toast.error(`Failed: ${err.message}`, {
        duration: 3000,
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete using toast confirmation (same as student delete)
  const handleDeleteScholarship = (scholarship: Scholarship) => {
    toast.dismiss();
    toast(
      (t) => (
        <div className="text-center">
          <p className="font-bold text-red-600 mb-2">Delete Scholarship?</p>
          <p className="text-sm text-gray-600 mb-1">{scholarship.title}</p>
          <p className="text-xs text-red-500 font-semibold mb-3">⚠️ This action cannot be undone!</p>
          <p className="text-xs text-gray-500 mb-4">All related applications and merit lists will also be deleted.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                confirmDelete(scholarship);
              }}
              className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 min-w-[100px]"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 min-w-[80px]"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 8000,
        position: 'top-center',
        style: {
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          maxWidth: '340px',
        },
      }
    );
  };

  const confirmDelete = async (scholarship: Scholarship) => {
    try {
      const response = await fetch(`/api/scholarships/${scholarship.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete scholarship');
      }

      toast.dismiss();
      toast.success(`${scholarship.title} deleted`, {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#fee2e2',
          color: '#991b1b',
          borderRadius: '8px',
          padding: '10px 16px',
        },
      });
      
      setScholarships(prev => prev.filter(s => s.id !== scholarship.id));

    } catch (error: any) {
      toast.dismiss();
      toast.error(`Failed: ${error.message}`, {
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check for update success message
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('updated') === 'true') {
      toast.success('Scholarship updated', {
        duration: 3000,
        position: 'top-center',
      });
      window.history.replaceState({}, '', '/admin/scholarships');
    }
  }, []);

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
        <Toaster position="top-center" />

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
                    className={`px-3 py-1 rounded-full text-sm font-medium ${scholarship.status === 'active'
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
                      onClick={() => handleDeleteScholarship(scholarship)}
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
                    className={`flex-1 text-center px-3 py-2 text-xs rounded-lg transition-colors ${scholarship.scoring_criteria
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                  >
                    {scholarship.scoring_criteria ? 'Edit Criteria' : 'Set Criteria'}
                  </Link>

                  <Link
                    href={`/admin/merit/${scholarship.id}`}
                    className={`flex-1 text-center px-3 py-2 text-xs rounded-lg transition-colors ${scholarship.merit_list_generated
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : scholarship.scoring_criteria
                        ? 'bg-gray-800 text-white hover:bg-gray-900'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    onClick={(e) => {
                      if (!scholarship.scoring_criteria) {
                        e.preventDefault();
                        toast.error('Please set scoring criteria first', {
                          duration: 3000,
                          position: 'top-center',
                        });
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