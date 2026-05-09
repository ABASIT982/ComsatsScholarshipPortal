'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Dispute {
  id: string;
  category: string;
  subject: string;
  description: string;
  status: string;
  admin_response: string | null;
  created_at: string;
  resolved_at: string | null;
}

export default function MyDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);

  const studentId = typeof window !== 'undefined' ? localStorage.getItem('studentToken') || 'test_123' : 'test_123';

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const response = await fetch(`/api/disputes?student_id=${studentId}`);
      const data = await response.json();
      setDisputes(data.disputes || []);
    } catch (error) {
      console.error('Error fetching disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      scholarship_result: 'Scholarship Result',
      merit_list: 'Merit List Position',
      document_rejection: 'Document Rejection',
      eligibility: 'Eligibility Decision',
      application_status: 'Application Status',
      general: 'General Complaint',
    };
    return labels[category] || category;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Disputes & Complaints</h1>
          <p className="text-gray-500 mt-1">Track your disputes and view admin responses</p>
        </div>
        <Link
          href="/student/disputes/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Raise New Dispute
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 text-center ">
          <p className="text-2xl font-bold text-yellow-600">{disputes.filter(d => d.status === 'pending').length}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center ">
          <p className="text-2xl font-bold text-blue-600">{disputes.filter(d => d.status === 'reviewing').length}</p>
          <p className="text-xs text-gray-500">Under Review</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center ">
          <p className="text-2xl font-bold text-green-600">{disputes.filter(d => d.status === 'resolved').length}</p>
          <p className="text-xs text-gray-500">Resolved</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center ">
          <p className="text-2xl font-bold text-red-600">{disputes.filter(d => d.status === 'rejected').length}</p>
          <p className="text-xs text-gray-500">Rejected</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : disputes.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-gray-500">No disputes filed yet.</p>
          <Link href="/student/disputes/new" className="text-blue-600 hover:underline mt-2 inline-block">
            Raise your first dispute →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map((dispute) => (
            <div
              key={dispute.id}
              className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => setSelectedDispute(selectedDispute === dispute.id ? null : dispute.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dispute.status)}`}>
                      {dispute.status.toUpperCase()}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{getCategoryLabel(dispute.category)}</span>
                  </div>
                  <h3 className="font-semibold text-lg">{dispute.subject}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{dispute.description}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Filed: {new Date(dispute.created_at).toLocaleDateString()}
                  </p>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${selectedDispute === dispute.id ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {selectedDispute === dispute.id && (
                <div className="mt-4 pt-4 border-t">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-sm">Your Description:</p>
                    <p className="text-gray-700 text-sm mt-1">{dispute.description}</p>
                  </div>

                  {dispute.admin_response && (
                    <div className="bg-blue-50 p-3 rounded-lg mt-3">
                      <p className="font-medium text-sm text-blue-800">Admin Response:</p>
                      <p className="text-blue-700 text-sm mt-1">{dispute.admin_response}</p>
                      {dispute.resolved_at && (
                        <p className="text-xs text-blue-500 mt-2">
                          Resolved on: {new Date(dispute.resolved_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  {dispute.status === 'pending' && (
                    <div className="bg-yellow-50 p-3 rounded-lg mt-3">
                      <p className="text-sm text-yellow-800">
                        Your dispute is pending review. Admin will respond within 3-5 business days.
                      </p>
                    </div>
                  )}

                  {dispute.status === 'rejected' && (
                    <div className="bg-red-50 p-3 rounded-lg mt-3">
                      <p className="text-sm text-red-800">
                        Your dispute has been rejected. Please contact the scholarship office.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}