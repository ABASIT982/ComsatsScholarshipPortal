'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Upload, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Upload as UploadIcon, 
  Edit2,
  Award,
  Clock
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';

type CustomField = {
  type: string;
  label: string;
  name: string;
  required: boolean;
  placeholder: string;
  max_value: number | null;
};

type FormSection = {
  id: string;
  title: string;
  icon: string;
  fields: CustomField[];
};

interface Scholarship {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'active' | 'inactive';
  student_types: string[];
  form_sections: FormSection[];
}

export default function ApplyScholarshipPage() {
  const params = useParams();
  const router = useRouter();
  const scholarshipId = params.id as string;
  const { user } = useAuth();

  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [documents, setDocuments] = useState<Record<string, File[]>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const studentName = user?.name || '';
  const studentRegno = user?.regno || '';
  const studentEmail = localStorage.getItem('studentEmail') || user?.email || '';

  const defaultSections: FormSection[] = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: '👤',
      fields: [
        { type: 'text', label: 'Full Name', name: 'full_name', required: true, placeholder: 'Enter your full name', max_value: null },
        { type: 'text', label: 'Registration Number', name: 'registration_no', required: true, placeholder: 'Enter registration number', max_value: null },
        { type: 'email', label: 'Email', name: 'email', required: true, placeholder: 'Enter your email', max_value: null },
        { type: 'text', label: 'CNIC/B-Form', name: 'cnic', required: true, placeholder: 'Enter CNIC number', max_value: null },
        { type: 'text', label: 'Phone Number', name: 'phone', required: true, placeholder: 'Enter phone number', max_value: null },
      ]
    },
    {
      id: 'academic',
      title: 'Academic Information',
      icon: '📚',
      fields: [
        { type: 'text', label: 'Department', name: 'department', required: true, placeholder: 'Enter your department', max_value: null },
        { type: 'number', label: 'Current Semester', name: 'semester', required: true, placeholder: 'e.g., 1', max_value: null },
        { type: 'number', label: 'Current CGPA', name: 'cgpa', required: true, placeholder: 'e.g., 3.5', max_value: null },
        { type: 'number', label: 'FSC Marks', name: 'fsc_marks', required: true, placeholder: 'Enter FSC marks', max_value: null },
        { type: 'number', label: 'Matric Marks', name: 'matric_marks', required: true, placeholder: 'Enter Matric marks', max_value: null },
        { type: 'number', label: 'NTS Score', name: 'nts_score', required: true, placeholder: 'Enter NTS score', max_value: null },
      ]
    },
    {
      id: 'documents',
      title: 'Documents Upload',
      icon: '📄',
      fields: [
        { type: 'file', label: 'Transcript', name: 'transcript', required: true, placeholder: 'Upload PDF', max_value: null },
        { type: 'file', label: 'CNIC Copy', name: 'cnic_copy', required: true, placeholder: 'Upload image', max_value: null },
        { type: 'file', label: 'Passport Photo', name: 'photo', required: true, placeholder: 'Upload image', max_value: null },
      ]
    }
  ];

  const reviewSection: FormSection = {
    id: 'review',
    title: 'Review & Submit',
    icon: '📋',
    fields: []
  };

  useEffect(() => {
    fetchScholarship();
  }, [scholarshipId]);

  useEffect(() => {
    if (scholarship) {
      const autoFillData: Record<string, any> = {};
      if (studentName) autoFillData.full_name = studentName;
      if (studentRegno) autoFillData.registration_no = studentRegno;
      if (studentEmail) autoFillData.email = studentEmail;
      setFormData(prev => ({ ...prev, ...autoFillData }));
    }
  }, [scholarship, studentName, studentRegno, studentEmail]);

  const fetchScholarship = async () => {
    try {
      const response = await fetch(`/api/scholarships?id=${scholarshipId}`);
      const data = await response.json();
      if (!response.ok || !data.scholarship) {
        throw new Error(data.error || 'Failed to fetch scholarship');
      }
      setScholarship(data.scholarship);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getAllSections = (): FormSection[] => {
    let sections: FormSection[] = [];
    
    if (scholarship?.form_sections && scholarship.form_sections.length > 0) {
      sections = [...scholarship.form_sections];
    } else {
      sections = [...defaultSections];
    }
    
    sections = sections.filter(s => s.id !== 'review');
    return sections;
  };

  const getFullSections = (): FormSection[] => {
    const sections = getAllSections();
    return [...sections, reviewSection];
  };

  const getCurrentSection = (): FormSection => {
    const sections = getFullSections();
    return sections[currentStep] || sections[0];
  };

  const getCurrentFields = (): CustomField[] => {
    const section = getCurrentSection();
    return section.fields || [];
  };

  const validateField = (field: CustomField, value: any): string => {
    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${field.label} is required`;
    }
    if (field.type === 'number' && value) {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return `${field.label} must be a valid number`;
      if (numValue < 0) return `${field.label} cannot be negative`;
      if (field.max_value && numValue > field.max_value) {
        return `${field.label} cannot exceed ${field.max_value}`;
      }
    }
    if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const isFieldValid = (field: CustomField): boolean => {
    if (field.type === 'file') {
      if (field.required && (!documents[field.name] || documents[field.name].length === 0)) return false;
      return true;
    }
    const value = formData[field.name];
    return validateField(field, value) === '';
  };

  const isStepValid = (): boolean => {
    const section = getCurrentSection();
    if (section.id === 'review') return true;
    const fields = section.fields || [];
    return fields.every(field => isFieldValid(field));
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setTouchedFields(prev => new Set(prev).add(fieldName));
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    const sections = getAllSections();
    for (const section of sections) {
      const field = section.fields.find(f => f.name === fieldName);
      if (field) {
        const error = validateField(field, value);
        setFormErrors(prev => ({ ...prev, [fieldName]: error }));
        if (!error && isFieldValid(field)) {
          setCompletedSections(prev => new Set(prev).add(section.id));
        }
      }
    }
  };

  const handleFileUpload = async (fieldName: string, files: File[]) => {
    if (!files.length) return;
    try {
      const uploadFormData = new FormData();
      files.forEach(file => uploadFormData.append('files', file));
      uploadFormData.append('scholarshipId', scholarshipId);
      uploadFormData.append('studentRegno', studentRegno || '');
      uploadFormData.append('fieldName', fieldName);

      const response = await fetch('/api/upload/scholarship', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();
      if (response.ok) {
        setDocuments(prev => ({ ...prev, [fieldName]: result.files }));
        setFormData(prev => ({ ...prev, [fieldName]: `Uploaded ${result.files.length} file(s)` }));
        setFormErrors(prev => { const newErrors = { ...prev }; delete newErrors[fieldName]; return newErrors; });
      } else {
        alert(`Failed to upload files: ${result.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading files. Please try again.');
    }
  };

  const removeFile = (fieldName: string, index: number) => {
    const updatedFiles = documents[fieldName]?.filter((_, i) => i !== index) || [];
    setDocuments(prev => ({ ...prev, [fieldName]: updatedFiles }));
    if (updatedFiles.length === 0) {
      setFormErrors(prev => ({ ...prev, [fieldName]: `Please upload ${fieldName}` }));
    }
  };

  const nextStep = () => {
    const sections = getFullSections();
    const currentSection = getCurrentSection();
    
    if (currentSection.id === 'review') return;
    
    const fields = currentSection.fields || [];
    let hasError = false;
    for (const field of fields) {
      const error = validateField(field, formData[field.name]);
      if (error) {
        setFormErrors(prev => ({ ...prev, [field.name]: error }));
        hasError = true;
      }
    }
    if (hasError) return;
    
    setCompletedSections(prev => new Set(prev).add(currentSection.id));
    
    const nextIndex = currentStep + 1;
    if (nextIndex < sections.length) {
      setCurrentStep(nextIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (index: number) => {
    if (index <= currentStep || index === 0) {
      setCurrentStep(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 🔥 FIX: Submit ONLY when submitting button is clicked
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🔥 ONLY proceed if on review step
    const currentSection = getCurrentSection();
    if (currentSection.id !== 'review') {
      return;
    }
    
    setSubmitting(true);
    setError('');

    try {
      const sections = getAllSections();
      let allValid = true;
      for (const section of sections) {
        if (section.id === 'review') continue;
        const fields = section.fields || [];
        for (const field of fields) {
          const error = validateField(field, formData[field.name]);
          if (error) {
            setFormErrors(prev => ({ ...prev, [field.name]: error }));
            allValid = false;
          }
        }
      }
      if (!allValid) throw new Error('Please fix all errors before submitting');

      if (!user || user.type !== 'student') {
        throw new Error('Please login as a student');
      }

      const applicationData = {
        student_regno: studentRegno,
        application_data: {
          student_name: studentName,
          student_email: studentEmail,
          ...formData,
          documents: documents,
          submitted_at: new Date().toISOString()
        }
      };

      const response = await fetch(`/api/scholarships/${scholarshipId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit application');

      setSuccess(true);
      setTimeout(() => router.push('/student/scholarships'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: CustomField) => {
    const value = formData[field.name] || '';
    const isAutoFilled = ['full_name', 'registration_no', 'email', 'cnic', 'phone'].includes(field.name);
    const error = touchedFields.has(field.name) ? formErrors[field.name] : '';
    const isInvalid = error && touchedFields.has(field.name);

    if (field.type === 'file') {
      return (
        <div>
          <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-blue-400'}`}>
            <UploadIcon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-3">{field.placeholder || `Upload ${field.label}`}</p>
            <input
              type="file"
              multiple
              onChange={(e) => e.target.files && handleFileUpload(field.name, Array.from(e.target.files))}
              className="hidden"
              id={`file-${field.name}`}
            />
            <label
              htmlFor={`file-${field.name}`}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors cursor-pointer text-sm font-medium"
            >
              Choose Files
            </label>
          </div>
          {documents[field.name]?.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {documents[field.name].map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                  <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(field.name, index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          {isInvalid && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      );
    }

    return (
      <div>
        <div className="relative">
          <input
            type={field.type === 'number' ? 'number' : field.type || 'text'}
            name={field.name}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            onBlur={() => setTouchedFields(prev => new Set(prev).add(field.name))}
            placeholder={field.placeholder}
            required={field.required}
            max={field.max_value || undefined}
            min={field.type === 'number' ? 0 : undefined}
            className={`w-full px-4 py-3.5 rounded-xl border transition-all duration-200 text-gray-800 ${
              isAutoFilled && value ? 'bg-gray-50 cursor-not-allowed border-gray-200' : 'bg-white hover:border-blue-400'
            } ${isInvalid ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`}
            readOnly={isAutoFilled && !!value}
            step={field.type === 'number' ? 'any' : undefined}
          />
        </div>
        {isInvalid && <p className="text-red-500 text-sm mt-1.5">{error}</p>}
        {field.max_value && field.type === 'number' && (
          <p className="text-xs text-gray-400 mt-1">Maximum value: {field.max_value}</p>
        )}
      </div>
    );
  };

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading application...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
          <p className="text-gray-600 mb-6">
            Your application for <strong>{scholarship?.title}</strong> has been submitted successfully.
          </p>
          <Link
            href="/student/scholarships"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-colors font-medium"
          >
            Back to Scholarships
          </Link>
        </div>
      </div>
    );
  }

  const sections = getFullSections();
  const section = getCurrentSection();
  const fields = getCurrentFields();
  const totalSteps = sections.length;
  const daysLeft = scholarship?.deadline ? getDaysRemaining(scholarship.deadline) : null;
  const isReview = section.id === 'review';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/student/scholarships"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Back to Scholarships
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{scholarship?.title}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                    <Award className="w-4 h-4" />
                    Scholarship Application
                  </span>
                  {daysLeft !== null && (
                    <span className={`inline-flex items-center gap-1.5 text-sm ${daysLeft < 7 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                      <Clock className="w-4 h-4" />
                      {daysLeft < 0 ? 'Deadline passed' : `${daysLeft} days left`}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                <span className="font-medium">{totalSteps} steps</span> to complete
              </div>
            </div>
          </div>

          {error && (
            <div className="mx-8 mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="p-8">
            {/* Step Circles */}
            <div className="flex items-center justify-between mb-8">
              {sections.map((s, index) => {
                const isCompleted = completedSections.has(s.id) || index < currentStep;
                const isActive = index === currentStep;
                const displayTitle = s.id === 'review' ? 'Review' : s.title.replace(/[^a-zA-Z0-9 ]/g, '').trim();
                
                return (
                  <div key={s.id} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => goToStep(index)}
                      disabled={index > currentStep}
                      className="flex flex-col items-center"
                    >
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                        isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                        isActive ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-105' : 
                        'bg-white border-gray-300 text-gray-400'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs font-semibold">{index + 1}</span>}
                      </div>
                      <span className={`text-[10px] mt-1.5 font-medium ${
                        isCompleted ? 'text-green-600' : isActive ? 'text-blue-600' : 'text-gray-400'
                      }`}>
                        {displayTitle}
                      </span>
                    </button>
                    {index < sections.length - 1 && (
                      <div className={`w-8 sm:w-12 h-0.5 mx-1 transition-colors duration-300 ${
                        isCompleted ? 'bg-green-400' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Student Info */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5 mb-8">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Student Information</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-600 block text-xs uppercase tracking-wide">Name</span>
                  <p className="font-medium text-gray-800 mt-0.5">{studentName || 'Not logged in'}</p>
                </div>
                <div>
                  <span className="text-blue-600 block text-xs uppercase tracking-wide">Registration No</span>
                  <p className="font-medium text-gray-800 mt-0.5 font-mono">{studentRegno || 'Not logged in'}</p>
                </div>
                <div>
                  <span className="text-blue-600 block text-xs uppercase tracking-wide">Email</span>
                  <p className="font-medium text-gray-800 mt-0.5">{studentEmail || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* 🔥 FIX: Use a DIV instead of FORM for navigation */}
            <div>
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {isReview ? 'Review & Submit' : section.title.replace(/[^a-zA-Z0-9 ]/g, '').trim()}
                </h2>
                <p className="text-sm text-gray-400 mt-1">Step {currentStep + 1} of {sections.length}</p>
              </div>

              {isReview ? (
                // 🔥 REVIEW SECTION - Only submit button here
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <p className="text-gray-600 text-sm">Review your application before submitting.</p>
                    {getAllSections().map((s) => {
                      if (s.fields?.length === 0) return null;
                      const isComplete = s.fields.every(f => isFieldValid(f));
                      return (
                        <div key={s.id} className={`border rounded-xl p-4 ${isComplete ? 'bg-green-50/70 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-700">
                              {s.title.replace(/[^a-zA-Z0-9 ]/g, '').trim()}
                              <span className={`text-xs ml-2 px-2 py-0.5 rounded-full font-medium ${isComplete ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {isComplete ? 'Complete' : 'Incomplete'}
                              </span>
                            </h4>
                            <button
                              type="button"
                              onClick={() => {
                                const index = sections.findIndex(sec => sec.id === s.id);
                                if (index !== -1) setCurrentStep(index);
                              }}
                              className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 font-medium"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                            {s.fields.map((field) => {
                              const value = formData[field.name];
                              const isFile = field.type === 'file';
                              const hasFile = documents[field.name] && documents[field.name].length > 0;
                              if (!value && !isFile) return null;
                              if (isFile && !hasFile) return null;
                              return (
                                <div key={field.name} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
                                  <span className="text-sm text-gray-500">{field.label}</span>
                                  <span className="text-sm text-gray-800 font-medium">
                                    {isFile ? `${documents[field.name]?.length || 0} file(s)` : value}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    <div className="bg-yellow-50/80 border border-yellow-200 rounded-xl p-4 text-center">
                      <p className="text-sm text-yellow-700">By submitting, you confirm all information is accurate.</p>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 mt-8 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 px-7 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors disabled:opacity-50 font-medium text-sm shadow-sm"
                    >
                      <CheckCircle size={16} />
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              ) : (
                // 🔥 NON-REVIEW SECTIONS - No form submission
                <div>
                  <div className="space-y-6">
                    {fields.map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {field.label}
                          {field.required && <span className="text-red-400 ml-1">*</span>}
                          {field.max_value && field.type === 'number' && (
                            <span className="text-xs text-gray-400 ml-2">(max: {field.max_value})</span>
                          )}
                        </label>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-6 mt-8 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-medium text-sm"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>

                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      className="flex items-center gap-2 px-7 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 font-medium text-sm shadow-sm"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">
                {Math.round(((currentStep + 1) / totalSteps) * 100)}% complete
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}