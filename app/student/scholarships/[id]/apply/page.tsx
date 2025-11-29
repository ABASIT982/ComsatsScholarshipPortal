'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { FORM_TEMPLATES, STUDENT_TYPE_FIELDS } from '@/lib/form-templates';

interface Scholarship {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'active' | 'inactive';
  student_types: string[];
  form_template: string;
  custom_fields: any[];
}

export default function ApplyScholarshipPage() {
  const params = useParams();
  const router = useRouter();
  const scholarshipId = params.id as string;
  const { user } = useAuth();

  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [studentType, setStudentType] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Dynamic form state
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [documents, setDocuments] = useState<Record<string, File[]>>({});

  // Debug logs
  console.log('🔍 URL Scholarship ID:', scholarshipId);
  console.log('👤 Current User:', user);

  useEffect(() => {
    console.log('🔄 Checking scholarship with ID:', scholarshipId);
    
    fetch(`/api/scholarships/${scholarshipId}`)
      .then(r => r.json())
      .then(data => {
        console.log('🎯 Scholarship API Response:', data);
        if (data.scholarship) {
          console.log('✅ Scholarship FOUND:', data.scholarship);
          setScholarship(data.scholarship);
          
          // AUTO-SET STUDENT TYPE IF ONLY ONE OPTION
          if (data.scholarship.student_types && data.scholarship.student_types.length === 1) {
            console.log('🎯 Auto-setting student type:', data.scholarship.student_types[0]);
            setStudentType(data.scholarship.student_types[0]);
          }
        } else {
          console.log('❌ Scholarship NOT FOUND in API');
          setError('Scholarship not found');
        }
      })
      .catch(err => {
        console.error('🚨 API Error:', err);
        setError('Failed to load scholarship');
      });
  }, [scholarshipId]);

  // Initialize form with AUTO-FILL for name, regno, email
  const initializeForm = (scholarshipData: Scholarship) => {
    const fields = getAllFormFields(scholarshipData, '');
    const initialData: Record<string, any> = {};

    fields.forEach(field => {
      // AUTO-FILL NAME, REGNO, EMAIL FIELDS FROM USER ACCOUNT
      if (field.name === 'full_name' || field.name === 'name' || field.name === 'student_name') {
        initialData[field.name] = user?.name || '';
      } else if (field.name === 'email' || field.name === 'student_email') {
        initialData[field.name] = localStorage.getItem('studentEmail') || user?.email || '';
      } else if (field.name === 'regno' || field.name === 'student_regno' || field.name === 'roll_number') {
        initialData[field.name] = user?.regno || '';
      } else {
        initialData[field.name] = '';
      }
    });

    setFormData(initialData);
    setDocuments({});
    setFormErrors({});
  };

  // Get all form fields based on scholarship configuration
  const getAllFormFields = (scholarshipData: Scholarship, selectedStudentType: string) => {
    let fields: any[] = [];

    // Add template fields
    if (scholarshipData.form_template !== 'custom') {
      const template = FORM_TEMPLATES[scholarshipData.form_template as keyof typeof FORM_TEMPLATES];
      if (template) {
        fields = [...template.fields];
      }
    } else {
      // Add custom fields
      fields = [...scholarshipData.custom_fields];
    }

    // Add student type specific fields
    if (selectedStudentType && STUDENT_TYPE_FIELDS[selectedStudentType as keyof typeof STUDENT_TYPE_FIELDS]) {
      const studentFields = STUDENT_TYPE_FIELDS[selectedStudentType as keyof typeof STUDENT_TYPE_FIELDS];
      fields = [...fields, ...studentFields];
    }

    return fields;
  };

  const fetchScholarship = async () => {
    try {
      console.log('🔄 Fetching scholarship with ID:', scholarshipId);

      const response = await fetch(`/api/scholarships/${scholarshipId}`);
      const data = await response.json();

      console.log('📦 Scholarship API Response:', {
        status: response.status,
        data: data,
        scholarship: data.scholarship
      });

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch scholarship');
      }

      if (!data.scholarship) {
        throw new Error('Scholarship data is missing from response');
      }

      setScholarship(data.scholarship);
      initializeForm(data.scholarship);
    } catch (err: any) {
      console.error('❌ Error fetching scholarship:', err);
      setError(err.message);
    }
  };

  // Enhanced field validation that handles auto-filled fields
  const validateField = (field: any, value: any, files: File[] = []) => {
    // Check if this is an auto-filled field that should be skipped from validation
    const nameFields = ['full_name', 'name', 'student_name'];
    const emailFields = ['email', 'student_email'];
    const regnoFields = ['regno', 'student_regno', 'roll_number'];
    
    const isAutoFilledField = 
      (nameFields.includes(field.name) && user?.name) ||
      (emailFields.includes(field.name) && (localStorage.getItem('studentEmail') || user?.email)) ||
      (regnoFields.includes(field.name) && user?.regno);

    // If it's an auto-filled field, skip required validation (it will be auto-filled)
    if (isAutoFilledField && field.required && !value && files.length === 0) {
      return ''; // No error for auto-filled fields
    }

    // Normal validation for non-auto-filled fields
    if (field.required && !value && files.length === 0) {
      return `${field.label} is required`;
    }

    if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
      return 'Please enter a valid email address';
    }

    if (field.type === 'number' && value) {
      const numValue = parseFloat(value);
      if (field.validation?.min !== undefined && numValue < field.validation.min) {
        return `${field.label} must be at least ${field.validation.min}`;
      }
      if (field.validation?.max !== undefined && numValue > field.validation.max) {
        return `${field.label} must be at most ${field.validation.max}`;
      }
    }

    return '';
  };

  // Handle dynamic form field changes with validation
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Validate field on change
    if (scholarship && studentType) {
      const fields = getAllFormFields(scholarship, studentType);
      const field = fields.find(f => f.name === fieldName);
      if (field) {
        const error = validateField(field, value, documents[fieldName] || []);
        setFormErrors(prev => ({
          ...prev,
          [fieldName]: error
        }));
      }
    }
  };

  // Handle file uploads with validation
// UPDATED: Handle file uploads with actual file storage
// FIXED: Handle file uploads with proper state management
const handleFileUpload = async (fieldName: string, files: File[]) => {
  if (!files.length) return;

  try {
    const uploadFormData = new FormData();
    files.forEach(file => uploadFormData.append('files', file));
    uploadFormData.append('scholarshipId', scholarshipId);
    uploadFormData.append('studentRegno', user?.regno || '');
    uploadFormData.append('fieldName', fieldName);

    console.log('📤 Uploading files for field:', fieldName, files);

    const response = await fetch('/api/upload/scholarship', {
      method: 'POST',
      body: uploadFormData,
    });

    const result = await response.json();

    if (response.ok) {
      // Store the uploaded file URLs in documents state
      setDocuments(prev => ({
        ...prev,
        [fieldName]: result.files // This should be the array of file objects with URLs
      }));
      
      console.log('✅ Files uploaded and stored in state:', result.files);
      
      // Update form data to mark files as uploaded
      setFormData(prev => ({
        ...prev,
        [fieldName]: `Uploaded ${result.files.length} file(s)`
      }));
    } else {
      console.error('❌ Upload failed:', result.error);
      alert(`Failed to upload files: ${result.error}`);
    }
  } catch (error) {
    console.error('❌ Upload error:', error);
    alert('Error uploading files. Please try again.');
  }
};

  // Remove file from specific field
  const removeFile = (fieldName: string, index: number) => {
    const updatedFiles = documents[fieldName]?.filter((_, i) => i !== index) || [];
    setDocuments(prev => ({
      ...prev,
      [fieldName]: updatedFiles
    }));

    // Re-validate after removal
    if (scholarship && studentType) {
      const fields = getAllFormFields(scholarship, studentType);
      const field = fields.find(f => f.name === fieldName);
      if (field) {
        const error = validateField(field, formData[fieldName], updatedFiles);
        setFormErrors(prev => ({
          ...prev,
          [fieldName]: error
        }));
      }
    }
  };

  // Comprehensive form validation that handles auto-filled fields
  const validateForm = () => {
    if (!scholarship || !studentType) return false;

    const fields = getAllFormFields(scholarship, studentType);
    const errors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      const value = formData[field.name];
      const fieldFiles = documents[field.name] || [];
      
      // Check if this is an auto-filled field
      const nameFields = ['full_name', 'name', 'student_name'];
      const emailFields = ['email', 'student_email'];
      const regnoFields = ['regno', 'student_regno', 'roll_number'];
      
      const isAutoFilledField = 
        (nameFields.includes(field.name) && user?.name) ||
        (emailFields.includes(field.name) && (localStorage.getItem('studentEmail') || user?.email)) ||
        (regnoFields.includes(field.name) && user?.regno);

      // Skip validation for auto-filled fields (they will be filled automatically)
      if (isAutoFilledField) {
        console.log(`✅ Skipping validation for auto-filled field: ${field.name}`);
        return; // Skip this field
      }

      const error = validateField(field, value, fieldFiles);
      
      if (error) {
        errors[field.name] = error;
        isValid = false;
        console.log(`❌ Validation error for ${field.name}: ${error}`);
      }
    });

    setFormErrors(errors);
    
    // Debug log to see what's happening
    console.log('🔍 Form validation result:', { isValid, errors, formData });
    
    return isValid;
  };

  // Render dynamic form fields
  const renderFormFields = () => {
    if (!scholarship || !studentType) return null;

    const fields = getAllFormFields(scholarship, studentType);

    return fields.map((field, index) => (
      <div key={index} className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>

        {renderFieldInput(field)}

        {/* Field-specific error message */}
        {formErrors[field.name] && (
          <p className="text-red-500 text-sm mt-1">{formErrors[field.name]}</p>
        )}

        {field.placeholder && !['file', 'textarea'].includes(field.type) && !formErrors[field.name] && (
          <p className="text-sm text-gray-500 mt-1">{field.placeholder}</p>
        )}
      </div>
    ));
  };

  // Render individual field input with auto-fill for name, regno, email
  const renderFieldInput = (field: any) => {
    const commonProps = {
      className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black",
      required: field.required,
      value: formData[field.name] || '',
      onChange: (e: any) => handleFieldChange(field.name, e.target.value)
    };

    // AUTO-FILLED FIELDS - make them readonly
    const nameFields = ['full_name', 'name', 'student_name'];
    const emailFields = ['email', 'student_email'];
    const regnoFields = ['regno', 'student_regno', 'roll_number'];
    
    const isAutoFilledField = 
      (nameFields.includes(field.name) && user?.name) ||
      (emailFields.includes(field.name) && (localStorage.getItem('studentEmail') || user?.email)) ||
      (regnoFields.includes(field.name) && user?.regno);
    
    if (isAutoFilledField) {
      commonProps.className += " bg-gray-100 cursor-not-allowed";
    }

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <div className="relative">
            <input 
              type={field.type} 
              {...commonProps} 
              placeholder={field.placeholder}
              readOnly={!!isAutoFilledField}
            />
            {isAutoFilledField && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Auto-filled</span>
              </div>
            )}
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            {...commonProps}
            placeholder={field.placeholder}
            min={field.validation?.min}
            max={field.validation?.max}
            step="0.01"
          />
        );

      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={4}
            placeholder={field.placeholder}
            className={`${commonProps.className} resize-vertical`}
          />
        );

      case 'file':
        return (
          <div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">Click to upload {field.label}</p>
              <input
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    handleFileUpload(field.name, Array.from(e.target.files));
                  }
                }}
                className="hidden"
                id={`file-${field.name}`}
              />
              <label
                htmlFor={`file-${field.name}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
              >
                Choose Files
              </label>
            </div>

            {/* Show selected files */}
            {documents[field.name]?.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected Files:</p>
                <div className="space-y-2">
                  {documents[field.name].map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(field.name, index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return <input type="text" {...commonProps} placeholder={field.placeholder} />;
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  setError('');

  try {
    if (!user || user.type !== 'student') {
      throw new Error('Please login as a student to apply for scholarships');
    }

    // Comprehensive form validation
    if (!validateForm()) {
      throw new Error('Please fix the errors in the form before submitting');
    }

    const studentRegno = user.regno;

    // DEBUG: Check what's in documents state
    console.log('🔍 Documents state before submission:', documents);

    // PREPARE APPLICATION DATA - USE THE ALREADY UPLOADED FILES FROM documents STATE
    const applicationData = {
      student_regno: studentRegno,
      application_data: {
        // AUTO-FILLED STUDENT INFORMATION
        student_name: user.name,
        student_email: localStorage.getItem('studentEmail') || user?.email,
        
        // USER-ENTERED FORM DATA
        ...formData,
        
        // USE THE ALREADY UPLOADED DOCUMENTS FROM handleFileUpload
        // These should already contain the file URLs from the upload response
        documents: documents,
        
        // METADATA
        student_type: studentType,
        submitted_at: new Date().toISOString(),
        scholarship_template: scholarship?.form_template
      }
    };

    console.log('🔄 Sending application with documents:', applicationData);

    const response = await fetch(`/api/scholarships/${scholarshipId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Failed to submit application (Status: ${response.status})`);
    }

    // Store applications per student
    const appliedKey = `appliedScholarships_${studentRegno}`;
    const appliedScholarships = JSON.parse(localStorage.getItem(appliedKey) || '[]');
    localStorage.setItem(appliedKey, JSON.stringify([...appliedScholarships, scholarshipId]));

    setSuccess(true);
    setTimeout(() => {
      router.push('/student/scholarships');
    }, 2000);

  } catch (err: any) {
    console.error('❌ Submission error:', err);
    setError(err.message);
  } finally {
    setSubmitting(false);
  }
};

  if (!scholarship && !error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
            <p className="text-gray-600 mb-6">
              Your application for <strong>{scholarship?.title}</strong> has been submitted successfully.
            </p>
            <Link
              href="/student/scholarships"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Back to Scholarships
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link
          href="/student/scholarships"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Scholarship
        </Link>

        {/* Application Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Apply for Scholarship</h1>
          <p className="text-gray-600 mb-6">
            Complete your application for: <strong>{scholarship?.title}</strong>
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Info (Read-only) */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Student Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Name:</span>
                  <p className="font-medium">{user?.name || 'Not logged in'}</p>
                </div>
                <div>
                  <span className="text-blue-700">Registration No:</span>
                  <p className="font-medium">{user?.regno || 'Not logged in'}</p>
                </div>
                <div>
                  <span className="text-blue-700">Email:</span>
                  <p className="font-medium">{localStorage.getItem('studentEmail') || 'student@edu.pk'}</p>
                </div>
              </div>
            </div>

            {/* Student Type Selection */}
            {scholarship?.student_types?.includes('undergraduate') &&
              scholarship?.student_types?.includes('graduate') && !studentType && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="font-semibold text-yellow-900 mb-4">Select Your Student Type</h3>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStudentType('undergraduate')}
                      className="flex-1 bg-white border border-yellow-300 text-yellow-700 px-6 py-4 rounded-lg hover:bg-yellow-50 transition-colors text-center"
                    >
                      <div className="font-semibold">Undergraduate Student</div>
                      <div className="text-sm text-yellow-600 mt-1">Bachelor's Program</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudentType('graduate')}
                      className="flex-1 bg-white border border-yellow-300 text-yellow-700 px-6 py-4 rounded-lg hover:bg-yellow-50 transition-colors text-center"
                    >
                      <div className="font-semibold">Graduate Student</div>
                      <div className="text-sm text-yellow-600 mt-1">Master's/PhD Program</div>
                    </button>
                  </div>
                </div>
              )}

            {/* Show dynamic form when student type is selected */}
            {(studentType || (scholarship?.student_types?.length === 1)) && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Form</h3>
                {renderFormFields()}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Link
                href={`/student/scholarships/${scholarshipId}`}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting || (!studentType && (scholarship?.student_types?.length || 0) > 1)}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}