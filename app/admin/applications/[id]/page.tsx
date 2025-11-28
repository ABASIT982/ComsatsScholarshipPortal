'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Award, Mail, FileText } from 'lucide-react';

interface Application {
  id: string;
  scholarship_id: string;
  student_regno: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
  notes?: string;
  application_data?: any;
  scholarship?: {
    title: string;
    description: string;
    deadline: string;
  };
  student_name?: string;
  student_email?: string;
}

export default function ApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      const response = await fetch(`/api/admin/applications/${applicationId}`);
      const data = await response.json();

      if (response.ok) {
        setApplication(data.application);
      }
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-6">Loading...</div>;
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Not Found</h1>
            <Link href="/admin/applications" className="text-blue-600 hover:text-blue-800">
              Back to Applications
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin/applications"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Applications
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Application Details</h1>
            <div className="flex items-center gap-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {application.status.toUpperCase()}
              </span>
              <span className="text-blue-100">
                Applied: {formatDate(application.applied_at)}
              </span>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Student Information */}
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Student Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Name</label>
                    <p className="font-medium">{application.student_name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Registration No</label>
                    <p className="font-medium">{application.student_regno}</p>
                  </div>
                </div>
              </div>

              {/* Scholarship Information */}
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
                  Scholarship Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Scholarship Title</label>
                    <p className="font-medium">{application.scholarship?.title || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Application Status</label>
                    <p className={`font-medium ${
                      application.status === 'approved' ? 'text-green-600' :
                      application.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {application.status.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {application.application_data?.additional_info && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Additional Information
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-gray-700 whitespace-pre-line">
                    {application.application_data.additional_info}
                  </p>
                </div>
              </div>
            )}
            {/* Uploaded Documents */}
<div className="mt-8">
  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
    <FileText className="w-5 h-5 text-blue-600" />
    Uploaded Documents
  </h2>
  <div className="bg-gray-50 p-4 rounded-lg border">
    {application.application_data?.documents && application.application_data.documents.length > 0 ? (
      <div className="space-y-2">
        {application.application_data.documents.map((doc: any, index: number) => (
          <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
            <span className="text-sm text-gray-700">{doc.name || `Document ${index + 1}`}</span>
            <a 
              href={doc.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View Document
            </a>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-4">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">No documents were uploaded with this application</p>
        <p className="text-gray-400 text-xs mt-1">
          The student either didn't upload documents or file upload functionality wasn't implemented
        </p>
      </div>
    )}
  </div>
</div>

            {/* Action Buttons */}
           {/* Action Buttons */}
{application.status === 'pending' && (
  <div className="mt-8 pt-6 border-t border-gray-200">
    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
    <div className="flex gap-4">
      <button
        onClick={async () => {
          try {
            const response = await fetch(`/api/admin/applications/${application.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'approved' })
            });
            
            if (response.ok) {
              // Update local state immediately
              setApplication(prev => prev ? { ...prev, status: 'approved' } : null);
              alert('Application approved successfully!');
              
              // Wait a moment for the database to update, then redirect
              setTimeout(() => {
                router.push('/admin/applications');
              }, 1000);
            } else {
              const data = await response.json();
              throw new Error(data.error || 'Failed to approve application');
            }
          } catch (error: any) {
            console.error('Approval error:', error);
            alert('Error: ' + error.message);
          }
        }}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        Approve Application
      </button>
      <button
        onClick={async () => {
          try {
            const response = await fetch(`/api/admin/applications/${application.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'rejected' })
            });
            
            if (response.ok) {
              // Update local state immediately
              setApplication(prev => prev ? { ...prev, status: 'rejected' } : null);
              alert('Application rejected successfully!');
              
              // Wait a moment for the database to update, then redirect
              setTimeout(() => {
                router.push('/admin/applications');
              }, 1000);
            } else {
              const data = await response.json();
              throw new Error(data.error || 'Failed to reject application');
            }
          } catch (error: any) {
            console.error('Rejection error:', error);
            alert('Error: ' + error.message);
          }
        }}
        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Reject Application
      </button>
    </div>
  </div>
)}
          </div>
        </div>
      </div>
    </div>
  );
}