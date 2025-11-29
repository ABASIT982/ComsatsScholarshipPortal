'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Award, Mail, FileText, BookOpen, GraduationCap, Phone, MapPin } from 'lucide-react';

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
    form_template: string;
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
  const [activeTab, setActiveTab] = useState('personal');

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
        console.log('📦 Application Data:', data.application);
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

  // FIXED: Render dynamic form fields (don't exclude documents)
  const renderFormData = () => {
    if (!application?.application_data) return null;

    const appData = application.application_data;
    
    // Only exclude these specific fields, NOT documents
    const excludedKeys = [
      'student_name', 
      'student_email', 
      'student_level', 
      'applied_at', 
      'scholarship_title',
      'student_type',
      'scholarship_template',
      'additional_info', // This is handled separately
      'documents' // Keep documents separate
    ];

    const formFields = Object.entries(appData)
      .filter(([key]) => !excludedKeys.includes(key))
      .map(([key, value]) => (
        <div key={key} className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
          <span className="font-medium text-gray-900">
            {Array.isArray(value) ? value.join(', ') : String(value || 'Not provided')}
          </span>
        </div>
      ));

    return formFields.length > 0 ? formFields : null;
  };

  // FIXED: Render documents section
  const renderDocuments = () => {
    const documents = application?.application_data?.documents;
    
    console.log('📄 Documents data for admin:', documents);

    if (!documents || Object.keys(documents).length === 0) {
      return (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No documents were uploaded with this application</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {Object.entries(documents).map(([fieldName, files]) => (
          <div key={fieldName} className="border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-4 capitalize text-lg">
              {fieldName.replace(/_/g, ' ')} Documents
            </h4>
            
            <div className="space-y-3">
              {(files as any[]).map((file: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {file.name || `Document ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {file.type || 'File'} • {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      {file.url && (
                        <p className="text-xs text-blue-500 mt-1 break-all">
                          Path: {file.url}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0">
                    {file.url ? (
                      <>
                        <a 
                          href={file.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          View
                        </a>
                        <a 
                          href={file.url} 
                          download={file.name}
                          className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
                        >
                          Download
                        </a>
                      </>
                    ) : (
                      <span className="text-xs text-red-500 px-3 py-2 bg-red-50 rounded">
                        No URL
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">Loading application details...</div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
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
      <div className="max-w-6xl mx-auto">
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">Application Details</h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    application.status === 'approved' ? 'bg-green-500' :
                    application.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}>
                    {application.status.toUpperCase()}
                  </span>
                  <span className="text-blue-100">
                    Applied: {formatDate(application.applied_at)}
                  </span>
                  <span className="text-blue-100">
                    Scholarship: {application.scholarship?.title}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {['personal', 'application', 'documents'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab === 'personal' && 'Student Info'}
                  {tab === 'application' && 'Application Data'}
                  {tab === 'documents' && 'Documents'}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Student Information */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Student Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <User className="w-4 h-4 text-blue-600" />
                      <div>
                        <label className="text-sm text-gray-600 block">Full Name</label>
                        <p className="font-medium text-gray-900">
                          {application.application_data?.student_name || 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <div>
                        <label className="text-sm text-gray-600 block">Registration No</label>
                        <p className="font-medium text-gray-900">
                          {application.student_regno || 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <div>
                        <label className="text-sm text-gray-600 block">Email</label>
                        <p className="font-medium text-gray-900">
                          {application.application_data?.student_email || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scholarship & Status Information */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    Scholarship Information
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <label className="text-sm text-gray-600 block">Scholarship Title</label>
                      <p className="font-medium text-green-900 text-lg">{application.scholarship?.title || 'N/A'}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <label className="text-sm text-gray-600 block">Application Status</label>
                      <p className={`font-medium text-lg ${
                        application.status === 'approved' ? 'text-green-600' :
                        application.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {application.status.toUpperCase()}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <label className="text-sm text-gray-600 block">Form Template Used</label>
                      <p className="font-medium text-gray-900">{application.scholarship?.form_template || 'basic'}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <label className="text-sm text-gray-600 block">Application Date</label>
                      <p className="font-medium text-gray-900">{formatDate(application.applied_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Application Data Tab */}
            {activeTab === 'application' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Application Form Data
                </h2>

                {/* Additional Information */}
                {application.application_data?.additional_info && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Personal Statement</h3>
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {application.application_data.additional_info}
                      </p>
                    </div>
                  </div>
                )}

                {/* Dynamic Form Fields */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Form Responses</h3>
                  <div className="bg-white border border-gray-200 rounded-lg divide-y">
                    {renderFormData()}
                  </div>
                  
                  {!renderFormData() && (
                    <div className="text-center py-8 text-gray-500">
                      No additional form data provided.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Uploaded Documents
                </h2>
                
                {/* DEBUG: Show raw document data
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">Debug - Document Data</h3>
                  <pre className="text-xs text-yellow-700 overflow-auto max-h-40">
                    {JSON.stringify({
                      hasDocuments: !!application?.application_data?.documents,
                      documentKeys: application?.application_data?.documents ? Object.keys(application.application_data.documents) : [],
                      documents: application?.application_data?.documents
                    }, null, 2)}
                  </pre>
                </div> */}

                {renderDocuments()}
              </div>
            )}

            {/* Action Buttons */}
            {application.status === 'pending' && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Review Application</h3>
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
                          setApplication(prev => prev ? { ...prev, status: 'approved' } : null);
                          alert('Application approved successfully!');
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
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
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
                          setApplication(prev => prev ? { ...prev, status: 'rejected' } : null);
                          alert('Application rejected successfully!');
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
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
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