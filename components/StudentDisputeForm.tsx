'use client';

import { useState } from 'react';

interface StudentInfo {
  id: string;
  name: string;
  email: string;
  roll_no: string;
}

interface DisputeFormData {
  category: string;
  subject: string;
  description: string;
  scholarship_id: string;
  scholarship_name: string;
  application_id: string;
  merit_list_id: string;
}

export default function StudentDisputeForm({ student }: { student: StudentInfo }) {
  const [formData, setFormData] = useState<DisputeFormData>({
    category: '',
    subject: '',
    description: '',
    scholarship_id: '',
    scholarship_name: '',
    application_id: '',
    merit_list_id: '',
  });
  
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const categories = [
    { value: 'scholarship_result', label: 'Scholarship Result Dispute' },
    { value: 'merit_list', label: 'Merit List Position Dispute' },
    { value: 'document_rejection', label: 'Document Rejection Dispute' },
    { value: 'eligibility', label: 'Eligibility Decision Dispute' },
    { value: 'application_status', label: 'Application Status Dispute' },
    { value: 'general', label: 'General Complaint' },
  ];

  // Upload file using your existing API
  const uploadFile = async (file: File): Promise<string | null> => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('type', 'dispute');
    uploadFormData.append('regno', student.roll_no);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      
      const data = await response.json();
      if (response.ok) {
        return data.url;
      }
      console.error('Upload failed:', data.error);
      return null;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Upload all attachments first
    const attachmentUrls: string[] = [];
    for (const file of attachments) {
      const url = await uploadFile(file);
      if (url) {
        attachmentUrls.push(url);
      }
    }

    const payload = {
      student_id: student.id,
      student_name: student.name,
      student_email: student.email,
      roll_no: student.roll_no,
      category: formData.category,
      subject: formData.subject,
      description: formData.description,
      scholarship_id: formData.scholarship_id || null,
      scholarship_name: formData.scholarship_name || null,
      application_id: formData.application_id || null,
      merit_list_id: formData.merit_list_id || null,
      attachments: attachmentUrls,
    };

    try {
      const response = await fetch('/api/disputes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Dispute submitted successfully! Admin will review within 3-5 business days.' });
        setFormData({
          category: '',
          subject: '',
          description: '',
          scholarship_id: '',
          scholarship_name: '',
          application_id: '',
          merit_list_id: '',
        });
        setAttachments([]);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit dispute' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-2">Raise a Dispute / Complaint</h2>
      <p className="text-gray-600 mb-6">
        Use this form to dispute scholarship results, merit list positions, document rejections, or any other issue.
      </p>

      {message && (
        <div className={`p-4 rounded-lg mb-4 ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Dispute Category <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {(formData.category === 'scholarship_result' || formData.category === 'merit_list') && (
          <div>
            <label className="block text-sm font-medium mb-1">Scholarship Name</label>
            <input
              type="text"
              value={formData.scholarship_name}
              onChange={(e) => setFormData({ ...formData, scholarship_name: e.target.value })}
              placeholder="e.g., Merit Scholarship 2026"
              className="w-full p-2 border rounded"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Brief summary of your dispute"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Provide detailed explanation of your dispute..."
            rows={5}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Attachments */}
        <div>
          <label className="block text-sm font-medium mb-1">Attachments (Optional)</label>
          
          <div className="flex items-center gap-3">
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              Choose Files
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={(e) => setAttachments(Array.from(e.target.files || []))}
              className="hidden"
              accept=".pdf,.jpg,.png,.jpeg"
            />
            {attachments.length > 0 && (
              <span className="text-sm text-green-600">{attachments.length} file(s) selected</span>
            )}
          </div>
          
          {attachments.length > 0 && (
            <div className="mt-2 space-y-1">
              {attachments.map((file, idx) => (
                <div key={idx} className="text-xs text-gray-500 flex items-center gap-1">
                  📎 {file.name}
                </div>
              ))}
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-2">
            Upload screenshots, documents, or evidence (PDF, JPG, PNG). Max 5 files.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
        </button>
      </form>

      <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
        <p className="font-medium"><b>What happens next?</b></p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Your dispute will be reviewed within 3-5 business days</li>
          {/* <li>You will receive a response via email and notification</li> */}
          <li>Check "Disputes" page for status updates</li>
        </ul>
      </div>
    </div>
  );
}