'use client';

import { useEffect, useState } from 'react';

interface Dispute {
  id: string;
  student_name: string;
  student_email: string;
  roll_no: string;
  category: string;
  subject: string;
  description: string;
  status: string;
  admin_response: string | null;
  created_at: string;
  scholarship_name: string | null;
  attachments: string[];
}

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDisputes();
  }, [filterStatus, filterCategory]);

  const fetchDisputes = async () => {
    try {
      const response = await fetch(`/api/disputes/admin?status=${filterStatus}&category=${filterCategory}`);
      const data = await response.json();
      setDisputes(data.disputes || []);
    } catch (error) {
      console.error('Error fetching disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDispute = async (disputeId: string) => {
    if (!selectedStatus && !adminResponse) {
      alert('Please select status or add response');
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch('/api/disputes/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dispute_id: disputeId,
          status: selectedStatus,
          admin_response: adminResponse,
          resolved_by: 'admin@comsats.edu.pk',
        }),
      });

      if (response.ok) {
        alert('Dispute updated successfully');
        fetchDisputes();
        setSelectedDispute(null);
        setAdminResponse('');
        setSelectedStatus('');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update dispute');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error');
    } finally {
      setUpdating(false);
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

  const statuses = ['all', 'pending', 'reviewing', 'resolved', 'rejected'];
  const categories = ['all', 'scholarship_result', 'merit_list', 'document_rejection', 'eligibility', 'application_status', 'general'];

  const getStatusCount = (status: string) => {
    if (status === 'all') return disputes.length;
    return disputes.filter(d => d.status === status).length;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Disputes & Complaints</h1>
        <p className="text-gray-500 mt-1">Review and respond to student disputes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 ">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold">{getStatusCount('pending')}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 ">
          <p className="text-sm text-gray-500">Under Review</p>
          <p className="text-2xl font-bold">{getStatusCount('reviewing')}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 ">
          <p className="text-sm text-gray-500">Resolved</p>
          <p className="text-2xl font-bold">{getStatusCount('resolved')}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 ">
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="text-2xl font-bold">{getStatusCount('rejected')}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6 bg-white p-4 rounded-lg shadow">
        <div>
          <label className="text-sm text-gray-600">Status Filter</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="ml-2 p-2 border rounded-lg"
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s.toUpperCase()}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600">Category Filter</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="ml-2 p-2 border rounded-lg"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'all' ? 'ALL' : getCategoryLabel(c)}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : disputes.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">No disputes found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map((dispute) => (
            <div key={dispute.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dispute.status)}`}>
                      {dispute.status.toUpperCase()}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{getCategoryLabel(dispute.category)}</span>
                  </div>
                  <h3 className="font-semibold text-lg">{dispute.subject}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    From: {dispute.student_name} ({dispute.roll_no}) - {dispute.student_email}
                  </p>
                  {dispute.scholarship_name && (
                    <p className="text-sm text-gray-500 mt-1">Scholarship: {dispute.scholarship_name}</p>
                  )}
                  <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded">{dispute.description}</p>
                  
                  {/* Show attachments */}
                  {dispute.attachments && dispute.attachments.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Attachments:</p>
                      <div className="flex gap-2 flex-wrap">
                        {dispute.attachments.map((url: string, idx: number) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            📎 Attachment {idx + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-400 mt-2">
                    Filed: {new Date(dispute.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDispute(selectedDispute?.id === dispute.id ? null : dispute)}
                  className="text-blue-600 text-sm hover:underline px-3 py-1"
                >
                  {selectedDispute?.id === dispute.id ? 'Close' : 'Respond'}
                </button>
              </div>

              {selectedDispute?.id === dispute.id && (
                <div className="mt-4 pt-4 border-t">
                  {dispute.admin_response && (
                    <div className="bg-green-50 p-3 rounded-lg mb-3">
                      <p className="font-medium text-sm text-green-800">Previous Response:</p>
                      <p className="text-green-700 text-sm">{dispute.admin_response}</p>
                    </div>
                  )}
                  <div className="space-y-3">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="reviewing">Under Review</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <textarea
                      value={adminResponse}
                      onChange={(e) => setAdminResponse(e.target.value)}
                      placeholder="Write your response to the student..."
                      rows={3}
                      className="w-full p-2 border rounded-lg"
                    />
                    <button
                      onClick={() => handleUpdateDispute(dispute.id)}
                      disabled={updating}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {updating ? 'Updating...' : 'Update Dispute'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}